#!/usr/bin/env python3
"""空脸片段的对位复核：头晃得大、头还会转向时，相似变换（平移 + 旋转 + 缩放）在眼 / 嘴位置上到底差多少。

    python3 puppet/clips/track_check.py puppet/characters/<角色>/<空脸库> <片段名>… [--out 目录]

空脸帧上没有眼角、嘴角可以直接量（track_head 读数里的「参照点还差」是拿归位帧的眼嘴模板去空脸上找，没有意义）。这里换一种量法：
  把归位帧按这一帧的相似变换搬过来，再和这一帧做稠密光流（DIS）；光流只在「有纹理的地方」可信（脸轮廓、腮红边、鼻点、刘海边、耳朵），
  取脸范围内这些点的光流做高斯加权平均（σ = 30px），在眼角 / 嘴角 / 鼻点的参照位置上读 = 「相似变换搬过来之后，这个位置周围的东西还多移了几个像素」。
  它是估计值（脸正中没有纹理，靠周围外推；手挡住的地方光流不可信，已按遮罩让开），转向（yaw）会让脸内部相对轮廓横移，在这里表现为 eyeL / eyeR / mouth 的横向分量。
输出每帧的 (dx, dy)、模长，汇总每个参照点的最大值和超过 3px 的帧号；--out 另存一张大于 3px 的帧的对照图。"""
import json, os, sys
import cv2, numpy as np


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def gray(im): a = im[..., 3:].astype(np.float32) / 255; return cv2.cvtColor((im[..., :3] * a + 255 * (1 - a)).astype(np.uint8), cv2.COLOR_BGR2GRAY)


def main(root, clips, out):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p)
    rest = rgba(P(lib['poses'][lib['rest']]['frame'])); g0 = gray(rest); H, W = g0.shape; refs = lib['headTrackRefs']; tracks = lib['headTracks']
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    face = np.zeros((H, W), bool); face[330:540, 270:560] = True          # 脸的范围（归位帧坐标，眼眉口鼻 + 脸颊）
    yy, xx = np.mgrid[0:H, 0:W]; allrows = {}
    for clip in clips:
        rows = []; files = lib['clips'][clip]['frames']
        for i, f in enumerate(files):
            tr = tracks[f]; a, b, tx, ty = tr['m']; M = np.array([[a, -b, tx], [b, a, ty]], np.float32)
            fr = rgba(P(f)); g1 = gray(fr); gw = cv2.warpAffine(g0, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=255)
            fl = dis.calc(gw, g1, None)
            gx = cv2.Sobel(gw, cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(gw, cv2.CV_32F, 0, 1, ksize=3); edge = np.hypot(gx, gy) > 40
            fw = cv2.warpAffine(face.astype(np.uint8), M, (W, H)) > 0
            # 手 / 袖子挡住的地方不算：这一帧和搬过来的归位帧差得多、又不是小错位 → 遮挡物。用遮罩图的左半（脸范围里去掉头发和遮挡物）的反面不行（头发也被去掉了），
            # 所以直接用「这一帧比归位帧多出来的、成块的东西」：差 > 60 且面积 ≥ 300 的连通块。
            d = np.abs(g1.astype(np.int16) - gw.astype(np.int16)) > 60; n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(d.astype(np.uint8), np.ones((5, 5), np.uint8)))
            occ = np.isin(lab, [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] >= 300])
            valid = edge & fw & ~occ & (np.hypot(fl[..., 0], fl[..., 1]) < 12)
            row = {}
            for k, (rx, ry) in refs.items():
                if k == 'pin': continue
                px, py = M[0, 0] * rx + M[0, 1] * ry + M[0, 2], M[1, 0] * rx + M[1, 1] * ry + M[1, 2]
                w = np.exp(-((xx - px) ** 2 + (yy - py) ** 2) / (2 * 30.0 ** 2)) * valid; sw = float(w.sum())
                if sw < 2.0: row[k] = None; continue
                row[k] = [float((w * fl[..., 0]).sum() / sw), float((w * fl[..., 1]).sum() / sw), sw]
            rows.append(row)
        allrows[clip] = rows
        print(f'\n{clip}')
        for k in ('eyeL', 'eyeR', 'mouth', 'nose'):
            v = [(i, r[k]) for i, r in enumerate(rows) if r.get(k)]; mag = [(i, float(np.hypot(x[0], x[1]))) for i, x in v]
            if not mag: print(f'  {k}：周围纹理太少，量不出'); continue
            mx = max(mag, key=lambda q: q[1]); big = [i for i, m in mag if m > 3.0]; mean = np.mean([m for _, m in mag])
            hx = max(abs(x[0]) for _, x in v); print(f'  {k}：最大 {mx[1]:.1f}px（第 {mx[0]} 帧），平均 {mean:.1f}px，横向最大 {hx:.1f}px；> 3px 的帧 {big if big else "无"}；可量帧 {len(mag)}/{len(files)}')
    if out:
        os.makedirs(out, exist_ok=True); json.dump(allrows, open(os.path.join(out, 'track_check.json'), 'w'), ensure_ascii=False)


if __name__ == '__main__':
    a = sys.argv[1:]; out = None
    if '--out' in a: i = a.index('--out'); out = a[i + 1]; a = a[:i] + a[i + 2:]
    if len(a) < 2: sys.exit(__doc__)
    main(a[0].rstrip('/'), a[1:], out)
