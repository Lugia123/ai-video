#!/usr/bin/env python3
"""哪些静帧 / 片段可以换眉：自动判，写进片段库。

    python3 puppet/clips/brow_ok.py puppet/characters/<角色>/<片段库> [--thresh 1.2] [--run 3] [--table 表.md]

换眉 = 把「无眉归位帧」里眉那一条刘海按头部对位贴到这一帧上，再画新眉。只有这一帧的刘海和归位帧的刘海对得上才行；
对不上（动作里刘海自己摆了、被重画成别的形状）贴上去就是「头发歪了」（2026-10-08 用户在挥手上看到的）。
每帧的读数（都在擦原眉贴片的范围及其羽化带里量，去掉原眉本身那条线、去掉被手挡住的地方）：
  line_px   发束轮廓线的位置差：贴片里的线到这一帧最近的线的平均距离，和反方向的平均（px，各自封顶 8）。两边的线重合 = 0。
  doubled   贴片里的线有多大比例在这一帧 2px 内找不到对应的线（贴上去会成双线 / 错位）。
  shift_px  这一条刘海相对头的整体错位（相位相关，px）。
判定：一帧 line_px > thresh 算超限；一段片段里连续 run 帧超限 → 整段不可换（中途换来换去会闪）；没有头部跟踪或标了不可贴的片段不可换；归位帧恒为可换。
门槛的标定（2026-10-08）：归位帧 = 可换（读数 0），挥手 = 不可换（用户：「头发歪了」）。默认 1.2px 取在两者之间，见 README。
写回：poses.<名>.browOk / browRead，clips.<名>.browOk / browRead（含逐帧 line_px）、库级 browRule。只动这几个键。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import Tracker, rgba, flat, dil
from brow_erase import erase


def lines(bgr):
    lum = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    return (cv2.morphologyEx(lum, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(np.int16) - lum) > 14


def main():
    a = sys.argv[1:]; root = a[0].rstrip('/'); opt = {a[i]: a[i + 1] for i in range(1, len(a) - 1) if a[i].startswith('--')}
    thresh, run = float(opt.get('--thresh', 1.2)), int(opt.get('--run', 3))
    T = Tracker(root); lib = T.lib; P = T.P; W, H = T.W, T.H; rest_name = lib['rest']; nb = lib['poses'][rest_name].get('noBrow')
    if not nb: raise SystemExit('这个库没有无眉归位帧（先跑 clips/brow_clean.py）')
    nob = rgba(P(nb['frame'])); changed = (np.abs(nob[..., :3] - T.rest[..., :3]).max(2) > 3).astype(np.uint8)
    band0 = cv2.dilate(changed, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))) > 0                      # 贴片范围 + 羽化带（归位帧坐标）
    nflat = flat(nob); ident = np.float32([[1, 0, 0], [0, 1, 0]])

    def read(fr, M, allow=None):
        Mf = np.float32(M); b = flat(fr); pn = cv2.warpAffine(nflat, Mf, (W, H), flags=cv2.INTER_LINEAR, borderValue=(255, 255, 255)); band = cv2.warpAffine(band0.astype(np.uint8) * 255, Mf, (W, H)) > 127
        _i, ba, _s = erase(b, [T.warp(m_, M) for m_ in T.brow_sides]); region = band & ~dil(ba > 0.3, 7) & (fr[..., 3] > 128)
        if allow is not None: region &= allow
        if region.sum() < 200: return None
        A = lines(pn) & region; B = lines(b) & region
        if A.sum() < 30 or B.sum() < 30: return {'line_px': 8.0, 'doubled': 1.0, 'shift_px': None, 'region_px': int(region.sum())}
        dB = np.minimum(cv2.distanceTransform((~B).astype(np.uint8), cv2.DIST_L2, 3), 8); dA = np.minimum(cv2.distanceTransform((~A).astype(np.uint8), cv2.DIST_L2, 3), 8)
        ys, xs = np.where(band); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        g = lambda im: cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY).astype(np.float32); sh = cv2.phaseCorrelate(g(pn), g(b))[0]
        return {'line_px': round(float((dB[A].mean() + dA[B].mean()) / 2), 2), 'doubled': round(float((dB[A] > 2).mean()), 3), 'shift_px': round(float(np.hypot(*sh)), 2), 'region_px': int(region.sum())}

    def mat(q): r = np.radians(q['rotate_deg']); m = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0]]) * q['scale']; m[:, 2] = q['translate']; return np.vstack([m, [0, 0, 1]])
    rows = []; out_p = {}; out_c = {}; tracks = lib.get('headTracks') or {}
    for name, pose in lib['poses'].items():
        al = (pose.get('patches') or {}).get('align')
        if name == rest_name: out_p[name] = (True, {'line_px': 0.0, 'note': '归位帧恒为可换'}); rows.append(('静帧', name, 0.0, 0.0, 0.0, '可换（归位帧）')); continue
        if not al: out_p[name] = (False, {'note': '没有贴片对位'}); rows.append(('静帧', name, None, None, None, '不可换（没有对位）')); continue
        t = tracks.get(pose['frame'])                              # 静帧取自片段的某一帧时用那一帧的头部跟踪对位（和片段的读数同一口径）；否则用贴片对位
        allow = None
        if t and t.get('m'):
            m = t['m']; M = np.array([[m[0], -m[1], m[2]], [m[1], m[0], m[3]]]); mk = cv2.imread(P(t['mask']['file']), cv2.IMREAD_UNCHANGED); x, y, w, h = t['mask']['rect']; allow = np.zeros((H, W), bool); allow[y:y + h, x:x + w] = mk[:, w:, 3] > 128
        else: M = (mat(al) @ np.linalg.inv(mat(lib['poses'][rest_name]['patches']['align'])))[:2]
        r = read(rgba(P(pose['frame'])), M, allow)
        ok = bool(r and r['line_px'] <= thresh); out_p[name] = (ok, r); rows.append(('静帧', name, r and r['line_px'], r and r['doubled'], r and r['shift_px'], '可换' if ok else '不可换'))
    for name, c in lib['clips'].items():
        if c.get('opaque'): continue
        trs = [tracks.get(f) for f in c['frames']]
        if any(t is None or not t.get('m') or not t.get('ok') for t in trs): out_c[name] = (False, {'note': '没有头部跟踪 / 有不可贴的帧'}); rows.append(('片段', name, None, None, None, '不可换（没有跟踪或不可贴）')); continue
        per = []
        for f, t in zip(c['frames'], trs):
            m = t['m']; M = np.array([[m[0], -m[1], m[2]], [m[1], m[0], m[3]]]); mk = cv2.imread(P(t['mask']['file']), cv2.IMREAD_UNCHANGED); x, y, w, h = t['mask']['rect']; allow = np.zeros((H, W), bool); allow[y:y + h, x:x + w] = mk[:, w:, 3] > 128
            r = read(rgba(P(f)), M, allow); per.append(r['line_px'] if r else 8.0)
        v = np.array(per); over = v > thresh; longest = cur = 0
        for o in over: cur = cur + 1 if o else 0; longest = max(longest, cur)
        ok = bool(longest < run)
        out_c[name] = (ok, {'line_px_median': round(float(np.median(v)), 2), 'line_px_max': round(float(v.max()), 2), 'frames_over': int(over.sum()), 'longest_run_over': int(longest), 'per_frame_line_px': [round(float(x_), 2) for x_ in v]})
        rows.append(('片段', name, round(float(np.median(v)), 2), None, None, ('可换' if ok else '不可换') + f'（最大 {v.max():.2f}，超限 {int(over.sum())}/{len(v)} 帧，最长连续 {longest}）'))
    l2 = json.load(open(P('clips.json'), encoding='utf-8'))
    for n, (ok, r) in out_p.items(): l2['poses'][n]['browOk'] = ok; l2['poses'][n]['browRead'] = r
    for n, (ok, r) in out_c.items(): l2['clips'][n]['browOk'] = ok; l2['clips'][n]['browRead'] = r
    l2['browRule'] = {'thresh_line_px': thresh, 'run_frames': run, 'note': '见 clips/brow_ok.py'}
    json.dump(l2, open(P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    tb = ['| 类别 | 名字 | 线位置差 px（片段 = 逐帧中位） | 成双比例 | 整体错位 px | 结论 |', '| --- | --- | --- | --- | --- | --- |'] + [f'| {k} | {n} | {"—" if a_ is None else a_} | {"—" if b_ is None else b_} | {"—" if c_ is None else c_} | {v_} |' for k, n, a_, b_, c_, v_ in rows]
    print(f'门槛：线位置差 > {thresh}px 算超限，连续 {run} 帧超限整段不可换\n' + '\n'.join(tb))
    if '--table' in opt: open(opt['--table'], 'w', encoding='utf-8').write(f'# {os.path.basename(root)}：哪些可以换眉\n\n门槛：线位置差 > {thresh}px 算超限，连续 {run} 帧超限整段不可换。\n\n' + '\n'.join(tb) + '\n')


if __name__ == '__main__':
    main()
