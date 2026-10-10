#!/usr/bin/env python3
"""脸前遮挡物判定的合成测试：把几种遮挡物按已知位置贴到没有遮挡的片段帧的脸上，再跑 track_head.py 的对位和遮挡判定，量漏掉多少、误让多少。

    python3 puppet/clips/occlusion_test.py <片段库> --clean <没有遮挡的片段> --hand <手举在头旁的片段>:<帧号> [--out 图.png] [--json 读数.json]

遮挡物从库里现成的帧上抠：张开的手（--hand 那一帧里头右侧最大的一块肤色）、握拳（归位帧垂在身侧的拳头）、白袖子、袖口（拳头上方那一截）、一缕头发（归位帧侧发的下端）。
情形：盖眼、盖嘴、盖脸颊、从脸的边缘探进来一半、快速划过（连续 5 帧从脸左划到脸右，走时间那一步）。每种 × 每个遮挡物，贴在 --clean 片段的几帧上。
读数（像素）：
  总量   遮挡物落在「贴片占地 ∩ 脸 ∩ 非头发」里的像素（贴片本来会盖住它的那部分）
  漏     其中判定没让开的 = 贴片会盖住遮挡物的像素          → 漏 / 总量 = 漏报率
  误让   眼眶范围里被让开、而 9px 内没有遮挡物的像素 = 会露出原来眼睛的像素
  对位   贴了遮挡物之后重新对位的内点数、残差，以及和不贴时的头部位置差（遮挡物会不会把对位带偏）
合成图是把遮挡物直接叠在帧上，没有真实片段里的接触阴影和形变；它测的是判定逻辑，不是全部真实情况。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import Tracker, rgba, flat, skin, dil, sim


def cut(fr, mask):                      # 按 mask 从帧里抠一块 RGBA
    ys, xs = np.where(mask); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    out = fr[y0:y1, x0:x1].copy(); out[..., 3] = out[..., 3] * mask[y0:y1, x0:x1]; return out
def biggest(m):
    n, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8)); return lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])) if n > 1 else np.zeros_like(m)
def paste(fr, c, cx, cy):               # 中心放在 (cx, cy)；返回 (新帧, 遮挡物真值)
    out = fr.copy(); H, W = fr.shape[:2]; h, w = c.shape[:2]; x, y = int(round(cx - w / 2)), int(round(cy - h / 2)); G = np.zeros((H, W), bool)
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h); s = c[y0 - y:y1 - y, x0 - x:x1 - x]; a = s[..., 3:] / 255
    out[y0:y1, x0:x1, :3] = s[..., :3] * a + out[y0:y1, x0:x1, :3] * (1 - a); out[y0:y1, x0:x1, 3] = np.maximum(out[y0:y1, x0:x1, 3], s[..., 3]); G[y0:y1, x0:x1] = s[..., 3] > 128
    return out, G


def main():
    a = sys.argv[1:]; root = a[0].rstrip('/'); opt = {a[i]: a[i + 1] for i in range(1, len(a) - 1, 2)}
    T = Tracker(root); lib, P, W, H = T.lib, T.P, T.W, T.H; rest = T.rest; rb = flat(rest); op = rest[..., 3] > 128
    hc, hi = opt['--hand'].split(':'); hf = rgba(P(lib['clips'][hc]['frames'][int(hi)])); hb = flat(hf)
    face_x1 = int(np.where(T.face_m.any(0))[0].max()); face_y = np.where(T.face_m.any(1))[0]
    Mh, _q = T.align(hf); oh = T.occlusion(hf, Mh)['occ']                 # --hand 那一帧里判成遮挡物的东西中，最大的一块肤色 = 张开的手
    cuts = {'张开的手': cut(hf, dil(biggest(skin(hb) & oh & (hf[..., 3] > 128)), 9) & (hf[..., 3] > 128))}
    low = np.zeros((H, W), bool); low[int(face_y.max()) + 40:, :] = True; fist = biggest(skin(rb) & low & op & (np.arange(H)[:, None] < int(H * 0.75))); fy, fx = np.where(fist)
    cuts['握拳'] = cut(rest, dil(fist, 9))
    box = np.zeros((H, W), bool); box[fy.min() - 34:fy.min() - 2, fx.min() - 6:fx.max() + 7] = True; cuts['袖口'] = cut(rest, box & op)
    mn, mx = rb.min(2).astype(int), rb.max(2).astype(int); white = (mn > 215) & (mx - mn < 30) & op
    box = np.zeros((H, W), bool); box[fy.min() - 150:fy.min() - 40, fx.min() - 30:fx.max() + 30] = True; cuts['白袖子'] = cut(rest, dil(biggest(white & box), 5) & op)
    hy, hx = np.where(T.hair_rest); box = np.zeros((H, W), bool); box[int(np.percentile(hy, 55)):hy.max() + 1, hx.min():hx.min() + 46] = True; from track_head import haircol; cuts['一缕头发'] = cut(rest, dil(T.hair_rest & box & op & haircol(rb), 5) & T.hair_rest & box & op)   # 只取看得见的发色像素：头发素材的范围含被脸挡住、补画出来的部分，直接按素材范围抠会把脸的肤色也抠进来
    cuts = {k: v for k, v in cuts.items() if v.size and (v[..., 3] > 128).sum() > 150}
    # 真实的手连着手臂：给手、拳头各接一截袖子（往下拖 200px，伸到脸外面去）。单独的（悬空的）也留着测——那是判定的已知盲区：
    # 整个落在眼眶范围里、和外面不相连的东西，和原帧自己闭眼分不开。
    if '白袖子' in cuts:
        sl = cuts['白袖子']; arm = cv2.resize(sl, (max(30, sl.shape[1]), 200), interpolation=cv2.INTER_LINEAR)
        for k in ('张开的手', '握拳'):
            if k in cuts:
                h = cuts[k]; w = max(h.shape[1], arm.shape[1]); c = np.zeros((h.shape[0] * 2 + 2 * arm.shape[0] - 20, w, 4), np.float32)      # 手放在画布正中（paste 按中心放），手臂接在下面
                y0 = c.shape[0] // 2 - h.shape[0] // 2; ax = (w - arm.shape[1]) // 2; c[y0 + h.shape[0] - 10:y0 + h.shape[0] - 10 + arm.shape[0], ax:ax + arm.shape[1]] = arm
                hx = (w - h.shape[1]) // 2; al = h[..., 3:] / 255; reg = c[y0:y0 + h.shape[0], hx:hx + h.shape[1]]; reg[..., :3] = h[..., :3] * al + reg[..., :3] * (1 - al); reg[..., 3] = np.maximum(reg[..., 3], h[..., 3])
                cuts[k + ' + 手臂'] = c
    cuts = {k: cuts[k] for k in sorted(cuts, key=lambda x: ('手臂' not in x, x))}
    R = T.refs; eye = (np.array(R['eyeL']) * 0.35 + np.array(R['eyeR']) * 0.65); eyeL = np.array(R['eyeL']) + [38, 0]; mouth = np.array(R['mouth']); cheek = np.array([R['eyeR'][0] - 30, (R['eyeR'][1] + R['mouth'][1]) / 2 + 6]); edge = np.array([R['eyeR'][0] + 26, R['eyeR'][1] + 14])
    cases = {'盖眼': np.array(R['eyeR']) - [38, 0], '盖嘴': mouth, '盖脸颊': cheek, '从边缘探进来': edge}
    cf = lib['clips'][opt['--clean']]['frames']; idx = [int(len(cf) * k) for k in (0.08, 0.3, 0.55, 0.8)]
    base = {}
    for i in set(idx + list(range(idx[1], idx[1] + 5))):
        fr = rgba(P(cf[i])); M, q = T.align(fr); base[i] = (fr, M, q)
    rows = []; shots = []
    def measure(fr2, G, M2, occ, info, M0):
        can = info['fm'] & ~info['hair'] & info['opaque']; tot = int((G & info['foot'] & can).sum()); miss = int((G & info['foot'] & can & ~occ).sum()); false = int((occ & info['eye'] & ~dil(G, 19)).sum())
        c0 = T.c0; d = float(np.linalg.norm((M2[:, :2] @ c0 + M2[:, 2]) - (M0[:, :2] @ c0 + M0[:, 2]))); return tot, miss, false, d
    for cname, c in cuts.items():
        for case, pos in cases.items():
            acc = [0, 0, 0, 0.0, 9999]
            for i in idx:
                fr, M0, q0 = base[i]; p = M0[:, :2] @ pos + M0[:, 2]; fr2, G = paste(fr, c, p[0], p[1]); M2, q2 = T.align(fr2)
                if M2 is None: acc[4] = 0; continue
                info = T.occlusion(fr2, M2); tot, miss, false, d = measure(fr2, G, M2, info['occ'], info, M0)
                acc = [acc[0] + tot, acc[1] + miss, acc[2] + false, max(acc[3], d), min(acc[4], q2['inliers'])]
                if i == idx[1]: shots.append((cname, case, fr2, M2, info, info['occ']))
            rows.append({'occluder': cname, 'case': case, 'frames': len(idx), 'total_px': acc[0], 'miss_px': acc[1], 'miss_rate': round(acc[1] / max(1, acc[0]), 3), 'false_yield_eye_px': acc[2], 'head_shift_px_max': round(acc[3], 2), 'inliers_min': acc[4]})
        # 快速划过：连续 5 帧从脸左到脸右，带时间那一步
        seq = list(range(idx[1], idx[1] + 5)); frs, Gs, Ms, infos = [], [], [], []
        for k, i in enumerate(seq):
            fr, M0, q0 = base[i]; pos = np.array(R['eyeL']) + (np.array(R['eyeR']) - np.array(R['eyeL'])) * (k / 4) + [0, 10]; p = M0[:, :2] @ pos + M0[:, 2]; fr2, G = paste(fr, c, p[0], p[1]); M2, q2 = T.align(fr2)
            M2 = M2 if M2 is not None else M0; frs.append(fr2); Gs.append(G); Ms.append(M2); infos.append(T.occlusion(fr2, M2))
        occs = T.temporal([q['occ'] for q in infos]); acc = [0, 0, 0, 0.0]
        for k, i in enumerate(seq):
            tot, miss, false, d = measure(frs[k], Gs[k], Ms[k], occs[k], infos[k], base[i][1]); acc = [acc[0] + tot, acc[1] + miss, acc[2] + false, max(acc[3], d)]
        rows.append({'occluder': cname, 'case': '快速划过（5 帧）', 'frames': 5, 'total_px': acc[0], 'miss_px': acc[1], 'miss_rate': round(acc[1] / max(1, acc[0]), 3), 'false_yield_eye_px': acc[2], 'head_shift_px_max': round(acc[3], 2), 'inliers_min': None})
        shots.append((cname, '快速划过 第 3 帧', frs[2], Ms[2], infos[2], occs[2]))
    # 对照：不贴任何东西
    acc = 0
    for i in idx: fr, M0, q0 = base[i]; acc += int((T.occlusion(fr, M0)['occ'] & T.warp(T.eye_m, M0)).sum())
    print(f'不贴遮挡物时（{opt["--clean"]} 的 {len(idx)} 帧）眼眶被让开：{acc}px')
    print('遮挡物｜情形｜总量 px｜漏 px（漏报率）｜误让 px（眼眶里没有遮挡物却让开）｜对位被带偏 px（最大）｜内点最少')
    for r in rows: print(f'{r["occluder"]}｜{r["case"]}｜{r["total_px"]}｜{r["miss_px"]}（{r["miss_rate"] * 100:.1f}%）｜{r["false_yield_eye_px"]}｜{r["head_shift_px_max"]}｜{r["inliers_min"]}')
    tm = sum(r['miss_px'] for r in rows); tt = sum(r['total_px'] for r in rows); print(f'合计：总量 {tt}，漏 {tm}（{tm / max(1, tt) * 100:.1f}%），误让 {sum(r["false_yield_eye_px"] for r in rows)}px；{len(rows)} 组')
    if '--json' in opt: json.dump({'no_occluder_yield_eye_px': acc, 'rows': rows}, open(opt['--json'], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if '--out' in opt:                   # 3 倍图：每格 = 合成帧贴上换眼睛的表情之后（按判定出的遮罩裁）
        pt = lib['poses'][lib['rest']]['patches']; f = (pt.get('face') or {}).get('flat') or next(iter((pt.get('face') or {'x': {}}).values()))
        layer = np.zeros((H, W, 4), np.float32)
        for k in ('eyes', 'mouth'):
            if k in f: im = rgba(P(f[k]['file'])); x, y = f[k]['rect'][:2]; al = im[..., 3:] / 255; reg = layer[y:y + im.shape[0], x:x + im.shape[1]]; reg[..., :3] = np.where(al > 0.02, im[..., :3], reg[..., :3]); layer[y:y + im.shape[0], x:x + im.shape[1], 3] = np.maximum(layer[y:y + im.shape[0], x:x + im.shape[1], 3], im[..., 3])
        bx0, by0, bx1, by1 = T.box; k3 = 3; tiles = []
        for cname, case, fr2, M2, info, occ in shots:
            allow, _ = T.masks(info, occ); lw = cv2.warpAffine(layer, np.float32(M2), (W, H), flags=cv2.INTER_LINEAR); al = (lw[..., 3:] / 255) * allow[..., None]
            comp = flat(fr2, 248).astype(np.float32) * (1 - al) + lw[..., :3] * al; red = comp.copy(); red[occ] = red[occ] * 0.5 + np.array([60, 60, 235]) * 0.5
            c0 = (M2[:, :2] @ T.c0 + M2[:, 2]).astype(int); x0, y0 = c0[0] - 120, c0[1] - 95
            t = np.hstack([comp[y0:y0 + 190, x0:x0 + 240], red[y0:y0 + 190, x0:x0 + 240]]).astype(np.uint8); t = cv2.resize(t, None, fx=k3, fy=k3, interpolation=cv2.INTER_NEAREST); tiles.append((f'{cname} / {case}', t))
        sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools')); from fonts import label_font; from PIL import Image, ImageDraw
        cols = 5; th, tw = tiles[0][1].shape[:2]; sheet = Image.new('RGB', (cols * (tw + 8), ((len(tiles) + cols - 1) // cols) * (th + 34)), (255, 255, 255)); d = ImageDraw.Draw(sheet); font = label_font(22)
        for n, (lab, t) in enumerate(tiles): x, y = (n % cols) * (tw + 8), (n // cols) * (th + 34); sheet.paste(Image.fromarray(cv2.cvtColor(t, cv2.COLOR_BGR2RGB)), (x, y + 30)); d.text((x + 4, y + 3), lab + '（左：贴表情后；右：判成遮挡物的标红）', fill=(20, 39, 74), font=font)
        sheet.save(opt['--out']); print('图：', opt['--out'], sheet.size)


if __name__ == '__main__':
    main()
