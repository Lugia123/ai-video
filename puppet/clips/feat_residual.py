#!/usr/bin/env python3
"""两遍法逐五官：贴上去的眼、嘴参照点对「A 里实测五官位置」的残差，刚性（整头变换）vs 逐五官（再加 headTracks[帧].feat）。

    python3 puppet/clips/feat_residual.py <库> <片段名>… [--a-dir 片段=A帧目录,…]   （A 帧目录默认取库 dress.json 的 twoPass.srcA）

实测用和 track_head.py 里不同的算法（避免自己量自己）：A 这一帧按整头变换转回归位帧坐标，对每个五官的归位帧模板做 ECC 平移配准（亚像素，初值 0，±12px 窗口），
收敛且相关系数 ≥ 0.8 的帧才算；位移换回帧坐标 = 「A 里这个五官实际比整头变换预测的偏了多少」。
刚性残差 = |实测|；逐五官残差 = |实测 − feat|。报均值 / 最大（px）和用到的帧数。同时报 feat 本身的幅度（相对整头变换）。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import FEATWIN, flat, rgba


def ecc_shift(tp, win, S=12):
    """tp: 模板（float32 灰度），win: 比模板每边大 S 的窗口。→ (dx, dy, cc) 或 None"""
    h, w = tp.shape; warp = np.eye(2, 3, dtype=np.float32)
    try:
        cc, warp = cv2.findTransformECC(tp, win[S:S + h, S:S + w].copy(), warp, cv2.MOTION_TRANSLATION, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, 1e-5), None, 5)
    except cv2.error: return None
    return float(warp[0, 2]), float(warp[1, 2]), float(cc)


def main(root, clips, adirs):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p); dj = json.load(open(P('dress.json'), encoding='utf-8')); char = os.path.dirname(root)
    rest = rgba(os.path.join(char, dj['twoPass']['restA'])); rg = cv2.cvtColor(flat(rest), cv2.COLOR_BGR2GRAY).astype(np.float32); H, W = rg.shape; tr = lib['headTracks']
    for clip in clips:
        ad = adirs.get(clip) or os.path.join(char, dj['twoPass']['srcA'][clip]); fa = sorted(f for f in os.listdir(ad) if f.endswith('.png')); files = lib['clips'][clip]['frames']
        R = {k: [] for k in FEATWIN}; F = {k: [] for k in FEATWIN}; Z = {k: [] for k in FEATWIN}
        for i, f in enumerate(files):
            t = tr[f]; a, b, tx, ty = t['m']; M = np.array([[a, -b, tx], [b, a, ty]], np.float64); feat = t.get('feat')
            ag = cv2.cvtColor(flat(rgba(os.path.join(ad, fa[i]))), cv2.COLOR_BGR2GRAY).astype(np.float32); al = cv2.warpAffine(ag, np.float32(M), (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
            for k, (x0, y0, x1, y1) in FEATWIN.items():
                S = 12; r = ecc_shift(rg[y0:y1, x0:x1], al[y0 - S:y1 + S, x0 - S:x1 + S], S)
                if r is None or r[2] < 0.8: continue
                m = M[:, :2] @ np.array([r[0], r[1]]); R[k].append(np.hypot(*m)); Z[k].append(np.hypot(*feat[k]) if feat else 0.0)
                if feat: F[k].append(np.hypot(*(m - np.array(feat[k]))))
        print(f'{clip}：' + '；'.join(f'{k} 用 {len(R[k])}/{len(files)} 帧：刚性残差 {np.mean(R[k]):.2f}/{np.max(R[k]):.2f}' + (f'，逐五官残差 {np.mean(F[k]):.2f}/{np.max(F[k]):.2f}，feat 幅度 {np.mean(Z[k]):.2f}/{np.max(Z[k]):.2f}' if F[k] else '') for k in FEATWIN if R[k]))


if __name__ == '__main__':
    a = sys.argv[1:]; ad = {}
    if '--a-dir' in a: i = a.index('--a-dir'); ad = dict(x.split('=', 1) for x in a[i + 1].split(',')); a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1:], ad)
