#!/usr/bin/env python3
"""量一段「转头」视频每一帧的朝向（#1168）。用法：python3 tools/turn_measure.py <帧目录> <起始角> <结束角>
两个互相独立的读数，都只是估计：
  t    按时间线性分配的角度（假设匀速转；首尾帧的角度由首尾两张关键图给定）
  ear  球面法：把头发外轮廓在耳朵那一行的左右边界当成球的两端，近侧耳朵中心的横向位置 x_e 满足 (x_e − cx)/R = cosθ
       （θ=90° 时耳朵在正中，θ=180° 时耳朵转到轮廓边缘并被头发挡住）。脸朝画面左。耳朵看不到时记 null。
另外记发卡中心的横向位置（相对轮廓中心，以 R 为单位），只当参考。"""
import sys, glob, json, os
import numpy as np, cv2
d, a0, a1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
fs = sorted(glob.glob(os.path.join(d, '*.png'))); out = []
for i, f in enumerate(fs):
    im = cv2.imread(f); h, w = im.shape[:2]
    lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.int16); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    bg = np.median(np.concatenate([lab[:8].reshape(-1, 3), lab[:, :8].reshape(-1, 3), lab[:, -8:].reshape(-1, 3)]), 0)
    fg = (np.abs(lab - bg).sum(-1) > 22).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    skin = ((lab[..., 0] > 190) & (lab[..., 1] > 133) & (lab[..., 2] > 138) & (hsv[..., 0] < 18)).astype(np.uint8)
    skin = cv2.morphologyEx(skin, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, cc, st, cen = cv2.connectedComponentsWithStats(skin)
    # 耳朵：头部高度范围内（上 65%）、面积在 0.15%–2.5% 之间、被头发包着的肤色块里最靠右的一个
    ear = None
    cands = [j for j in range(1, n) if 0.0015 * h * w < st[j, 4] < 0.025 * h * w and cen[j][1] < 0.62 * h and cen[j][1] > 0.3 * h]
    if cands:
        j = max(cands, key=lambda j: cen[j][0]); ex, ey = cen[j]
        row = np.where(fg[int(ey)])[0]
        # 取包含耳朵的那一段连续前景
        segs = np.split(row, np.where(np.diff(row) > 3)[0] + 1); seg = next((s for s in segs if s[0] <= ex <= s[-1]), row)
        cx, R = (seg[0] + seg[-1]) / 2, (seg[-1] - seg[0]) / 2
        c = float(np.clip((ex - cx) / R, -1, 1))
        # 耳朵贴着轮廓最左端（脸的前缘）时那是脸不是耳朵：左边 12% 以内的不算
        if (ex - seg[0]) / (2 * R) > 0.12: ear = {'x': round(float(ex), 1), 'y': round(float(ey), 1), 'cx': round(float(cx), 1), 'R': round(float(R), 1), 'cos': round(c, 3), 'yaw': round(float(np.degrees(np.arccos(c))), 1), 'area': int(st[j, 4])}
    pin = (hsv[..., 0] > 15) & (hsv[..., 0] < 32) & (hsv[..., 1] > 140) & (hsv[..., 2] > 150)
    ys, xs = np.where(pin & (np.indices((h, w))[0] < 0.45 * h)); pr = None
    if len(xs) > 30:
        row = np.where(fg[int(ys.mean())])[0]; cx, R = (row[0] + row[-1]) / 2, (row[-1] - row[0]) / 2
        pr = {'x': round(float(xs.mean()), 1), 'rel': round(float((xs.mean() - cx) / R), 3), 'w': int(xs.max() - xs.min())}
    out.append({'frame': i + 1, 'file': os.path.basename(f), 'yaw_t': round(a0 + (a1 - a0) * i / (len(fs) - 1), 1), 'ear': ear, 'pin': pr})
json.dump(out, open(os.path.join(d, 'measure.json'), 'w'), ensure_ascii=False, indent=1)
for o in out:
    print(o['frame'], 'yaw_t', o['yaw_t'], 'ear', (o['ear']['yaw'], o['ear']['cos']) if o['ear'] else None, 'pin', (o['pin']['rel'], o['pin']['w']) if o['pin'] else None)
