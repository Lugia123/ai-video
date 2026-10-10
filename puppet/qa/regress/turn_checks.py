#!/usr/bin/env python3
"""转头变形的三把尺子（#1170）。不开浏览器：用引擎算出每个部件网格在各转头角度的顶点位置（tools/eval_mesh.mjs），再量。
  python3 qa/regress/turn_checks.py <数据包目录> <配置.json> <输出目录>      → 标准输出一个 JSON 数组（回归条目）
1 对应点：角色来源里的 turn-landmarks.json 给了同一批点在正面和 3/4 原画上的位置。把正面的点按数据包的变形推到各角度，
  和「正面 → 3/4 原画」按角度比例插值的位置比，出横向误差（平均 / 最大）。原画只有朝一侧的，另一侧用左右镜像的点。
2 不动的面积：日常转头角度下，头上各层里横向位移不到 1 像素的不透明面积占比。
3 局部拉伸：帽子和各发片的网格里，一格在横向被拉宽 / 压窄到原来的多少倍（只算有画面的格子）。"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image
PUPPET = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
pack, cfg_file, out = [os.path.abspath(v) for v in sys.argv[1:4]]; os.makedirs(out, exist_ok=True)
cfg = json.load(open(cfg_file)); TH, NOTE, R_ = cfg['thresholds'], cfg['notes'], cfg['roles']; TC = cfg.get('turnChecks') or {}
C = json.load(open(f'{pack}/character.json')); TURN = cfg['turn']['parameter']; D = cfg.get('turnDaily', 24); prm = {p['id']: p for p in C['parameters']}; TMAX = int(min(prm[TURN]['max'], -prm[TURN]['min']))
LM = json.load(open(os.path.join(PUPPET, TC['landmarks']))) if TC.get('landmarks') and os.path.exists(os.path.join(PUPPET, TC['landmarks'])) else None
REF = LM['target']['angleDeg'] if LM else None; angs = sorted({-TMAX, -D, D, TMAX} | ({-REF, REF} if LM else set()))
E = json.loads(subprocess.run(['node', os.path.join(PUPPET, 'tools/eval_mesh.mjs'), pack] + [json.dumps({TURN: a}) for a in angs], capture_output=True, text=True, check=True).stdout)
parts = {q['id']: q for q in E['parts']}; pose = {a: p['vertices'] for a, p in zip(angs, E['poses'])}; res = []
ox, oy = C['unit'].get('headMasterOrigin', [0, 0]); AX = C['unit']['headCenter'][0]
def moved(pid, x, y, a):
    """部件 pid 上静止时在 (x, y) 的点，转到角度 a 时在哪（按它所在的三角形做重心插值；落在网格外就用最近的三角形外推）"""
    q = parts[pid]; r = np.asarray(q['rest']).reshape(-1, 2); v = np.asarray(pose[a][pid]).reshape(-1, 2); best = None
    for t in np.asarray(q['triangles']).reshape(-1, 3):
        A, B, Cc = r[t]; M = np.array([[B[0] - A[0], Cc[0] - A[0]], [B[1] - A[1], Cc[1] - A[1]]]); det = np.linalg.det(M)
        if abs(det) < 1e-9: continue
        s, u = np.linalg.solve(M, [x - A[0], y - A[1]]); w = np.array([1 - s - u, s, u]); neg = -min(w.min(), 0)
        if best is None or neg < best[0]: best = (neg, w @ v[t])
        if neg == 0: break
    return best[1]
# ── 1 对应点
if LM:
    mirror_part = lambda p: p[:-2] + ('_R' if p.endswith('_L') else '_L') if p.endswith(('_L', '_R')) else p
    rows = {}; detail = {}
    for a in angs:
        k = abs(a) / REF; same = (a < 0) == (LM['target']['direction'] < 0); errs = []
        for name, P in LM['points'].items():
            f = np.array(P['front'], float) + [ox, oy]; t = np.array(P['quarter'], float) + [ox, oy]; pid = P['part']
            if not same and P.get('mirror', True) is False: continue
            if not same: f[0] = 2 * AX - f[0]; t[0] = 2 * AX - t[0]; pid = mirror_part(pid)
            if pid not in parts: continue
            tgt = f + k * (t - f); got = moved(pid, f[0], f[1], a); e = got - tgt
            detail.setdefault(a, {})[name] = {'部件': pid, '正面': f.tolist(), '目标': tgt.tolist(), '实际': got.tolist(), '可靠': P.get('reliable', True)}
            if P.get('reliable', True): errs.append((abs(e[0]), abs(e[1]), name))
        ex = [e[0] for e in errs]; worst = max(errs)
        rows[a] = {'横向平均': round(float(np.mean(ex)), 1), '横向最大': round(worst[0], 1), '最大的点': worst[2], '纵向平均': round(float(np.mean([e[1] for e in errs])), 1), '点数': len(errs)}
    json.dump(detail, open(f'{out}/landmarks.json', 'w'), ensure_ascii=False, indent=1)
    lim = TH.get('turnLandmark'); judged = [a for a in angs if abs(a) <= TMAX]
    ok = all(rows[a]['横向平均'] <= lim['meanPx'] and rows[a]['横向最大'] <= lim['maxPx'] for a in judged) if lim else True
    res.append({'id': 'turn-landmarks', 'title': '转头时对应点落在「正面 → 3/4 原画」的连线上（横向误差）' + ('' if lim else '（只出读数）'), 'auto': bool(lim), 'info': not lim, 'pass': ok,
                'value': {'各角度（像素）': {f'{a:+d}': rows[a] for a in angs}, **({'上限（只判到参数上限的角度）': lim} if lim else {}), '说明': f'{REF}° 是那张原画的参考角度，超出参数范围，只出读数；纵向这次没做，只出读数'}, 'note': NOTE.get('turnLandmark', '')})
# ── 2、3 逐格量：每个部件的网格格子在日常角度下的横向位移和横向拉伸，按格子里的不透明像素数加权
head = [q for q in E['parts'] if q['group'] == 'head']; still = tot = 0; per = {}; stretch = {}
for q in head:
    cols, rows_ = q['grid']; r = np.asarray(q['rest']).reshape(rows_ + 1, cols + 1, 2); v = np.asarray(pose[D][q['id']]).reshape(rows_ + 1, cols + 1, 2); dx = v[..., 0] - r[..., 0]
    al = np.asarray(Image.open(f"{pack}/{q['texture']}").convert('RGBA').split()[3]) > 128; H, W = al.shape; s_ = t_ = 0; smax, smin = 1.0, 1.0
    for j in range(rows_):
        for i in range(cols):
            n = int(al[round(H * j / rows_):round(H * (j + 1) / rows_), round(W * i / cols):round(W * (i + 1) / cols)].sum())
            if not n: continue
            cdx = dx[j:j + 2, i:i + 2].mean(); t_ += n; s_ += n if abs(cdx) < 1 else 0
            if n > 0.05 * (H / rows_) * (W / cols):
                w0 = r[j, i + 1, 0] - r[j, i, 0]; k = ((v[j, i + 1, 0] - v[j, i, 0]) + (v[j + 1, i + 1, 0] - v[j + 1, i, 0])) / 2 / w0; smax = max(smax, k); smin = min(smin, k)
    still += s_; tot += t_; per[q['id']] = round(s_ / t_, 3) if t_ else None; stretch[q['id']] = (round(float(smax), 3), round(float(smin), 3))
frac = still / tot; lim = TH.get('turnStillAreaMax')
res.append({'id': 'turn-nothing-rigid', 'title': f'转头 {D}° 时头上没有原地不动的大块（横向位移不到 1 像素的不透明面积占比）' + ('' if lim is not None else '（只出读数）'), 'auto': lim is not None, 'info': lim is None, 'pass': lim is None or frac <= lim,
            'value': {'整头占比': round(frac, 3), **({'上限': lim} if lim is not None else {}), '整片不动的部件': [k for k, f_ in per.items() if f_ and f_ > 0.99], '逐部件': per}, 'note': NOTE.get('turnStillAreaMax', '')})
ids = [i for i in [R_.get('hat')] + list(R_.get('frontHair') or []) + list(R_.get('backHair') or []) + [R_.get('ahoge'), R_.get('face')] if i in stretch]
worst = max(max(stretch[i][0], 1 / max(stretch[i][1], 1e-6)) for i in ids); lim = TH.get('turnStretchMax')
res.append({'id': 'turn-local-stretch', 'title': f'转头 {D}° 时帽子、发片、脸的网格没有被局部扯开（一格横向被拉宽 / 压窄的最大倍数）' + ('' if lim is not None else '（只出读数）'), 'auto': lim is not None, 'info': lim is None, 'pass': lim is None or worst <= lim,
            'value': {'最大倍数（拉宽或压窄取大的）': round(float(worst), 3), **({'上限': lim} if lim is not None else {}), '逐部件 [最宽, 最窄]': {i: stretch[i] for i in ids}}, 'note': NOTE.get('turnStretchMax', '')})
print(json.dumps(res, ensure_ascii=False))
