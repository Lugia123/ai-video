#!/usr/bin/env python3
"""逐五官偏移的读数（和 track_head.py --per-feature 同一套 feat_offsets / smooth_feat，从库里的 headTracks 读整头变换，不改库）。

    python3 puppet/clips/feat_report.py <库> <片段名>…
每条片段报：每个五官的好帧数（匹配分 ≥ 0.6 且偏移 ≤ 8px）、相对整头变换的偏移（平滑后）均值 / 最大、3 帧中值平滑前后差（均值 / 最大）；头部变换自己的内点、残差。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import FEATWIN, feat_offsets, smooth_feat, flat, rgba


def main(root, clips):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); dj = json.load(open(os.path.join(root, 'dress.json'), encoding='utf-8')); char = os.path.dirname(root); tr = lib['headTracks']
    rest = rgba(os.path.join(char, dj['twoPass']['restA'])); rg = cv2.cvtColor(flat(rest), cv2.COLOR_BGR2GRAY)
    for clip in clips:
        ad = os.path.join(char, dj['twoPass']['srcA'][clip]); fa = sorted(f for f in os.listdir(ad) if f.endswith('.png')); files = lib['clips'][clip]['frames']; raw = []
        for i, f in enumerate(files):
            a, b, tx, ty = tr[f]['m']; M = np.array([[a, -b, tx], [b, a, ty]], np.float64); raw.append(feat_offsets(rg, cv2.cvtColor(flat(rgba(os.path.join(ad, fa[i]))), cv2.COLOR_BGR2GRAY), M))
        sm, pre, good = smooth_feat(raw); n = len(files); rows = [tr[f] for f in files]
        print(f'{clip}：头部变换 内点最少 {min(r["inliers"] for r in rows)} 残差最大 {max(r["residual_px"] or 0 for r in rows):.2f}px 旋转 {min(r["rot_deg"] for r in rows):.2f}°~{max(r["rot_deg"] for r in rows):.2f}°；逐五官 ' + '；'.join(
            f'{k} 好帧 {good[k]}/{n}，偏移 {np.hypot(*sm[k].T).mean():.2f}/{np.hypot(*sm[k].T).max():.2f}，平滑前后差 {np.hypot(*(sm[k] - pre[k]).T).mean():.2f}/{np.hypot(*(sm[k] - pre[k]).T).max():.2f}' for k in FEATWIN))


if __name__ == '__main__':
    main(sys.argv[1].rstrip('/'), sys.argv[2:])
