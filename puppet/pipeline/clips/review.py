#!/usr/bin/env python3
"""把一段透明序列帧做成给人**连续看**的 1:1 片子：人物不缩放，左边浅底、右边深底并排，先原速播两遍，再半速播一遍。

    python3 pipeline/clips/review.py <帧目录 或 片段库目录> [--clip 片段名] [--out review.mp4] [--fps 16] [--crop]

为什么要有它：抠图 / 校色的毛病（裂缝、闪边、逐帧跳的接缝）在抽帧图和读数里看不出来，只有连起来按原像素看才看得到。
规矩（2026-10-08）：任何抠图 / 校色的改动，放行前必须渲一段人物 1:1 的连续片并且有人看过。读数和抽帧不能代替。
给片段库目录时用 --clip 选片段（按 clips.json 的帧表）；不给 --clip 就把库里每段各出一个 review-<片段>.mp4 放到 <库>/review/。
--crop：裁到所有帧的包围盒（四周各留 24px），画面小一点、人还是 1:1。左上角打帧号。"""
import argparse, json, os, subprocess, sys
import cv2, numpy as np

LIGHT, DARK = (243, 248, 251), (20, 24, 33)


def make(files, out, fps, crop):
    fr = [cv2.cvtColor(cv2.imread(f, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA) for f in files]; H, W = fr[0].shape[:2]; x0, y0, x1, y1 = 0, 0, W, H
    if crop:
        m = np.any([f[..., 3] > 8 for f in fr], axis=0); ys, xs = np.where(m)
        x0, x1 = max(0, xs.min() - 24), min(W, xs.max() + 25); y0, y1 = max(0, ys.min() - 24), min(H, ys.max() + 25)
    w, h = (x1 - x0) // 2 * 2, (y1 - y0) // 2 * 2
    def comp(f, i, slow):
        a = f[y0:y0 + h, x0:x0 + w, 3:].astype(np.float32) / 255; rgb = f[y0:y0 + h, x0:x0 + w, :3].astype(np.float32)
        pair = np.concatenate([rgb * a + np.array(bg, np.float32) * (1 - a) for bg in (LIGHT, DARK)], axis=1).round().astype(np.uint8)
        pair = np.ascontiguousarray(pair); cv2.putText(pair, f'{i:02d}' + (' 1/2x' if slow else ''), (10, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (232, 89, 12), 2, cv2.LINE_AA)
        return pair
    seq = [comp(f, i, False) for i, f in enumerate(fr)]; slow = [comp(f, i, True) for i, f in enumerate(fr)]
    hold = [seq[-1]] * (fps // 2)
    frames = seq + hold + seq + hold + [x for f in slow for x in (f, f)] + hold
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w * 2}x{h}', '-r', str(fps), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'slow', '-crf', '10', '-pix_fmt', 'yuv444p', '-r', str(fps), '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(f.tobytes())
    p.stdin.close()
    if p.wait(): sys.exit('ffmpeg 失败：' + out)
    print(f'{out}：{len(fr)} 帧，{w}×{h} ×2（浅底 | 深底），人物 1:1，{len(frames) / fps:.1f}s（原速两遍 + 半速一遍）')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src'); ap.add_argument('--clip'); ap.add_argument('--out'); ap.add_argument('--fps', type=int, default=16); ap.add_argument('--crop', action='store_true')
    a = ap.parse_args(); cj = os.path.join(a.src, 'clips.json')
    if not os.path.exists(cj):
        files = sorted(os.path.join(a.src, f) for f in os.listdir(a.src) if f.endswith('.png'))
        if len(files) < 2: sys.exit(f'{a.src} 里没有序列帧')
        return make(files, a.out or os.path.join(a.src, '..', 'review-' + os.path.basename(os.path.normpath(a.src)) + '.mp4'), a.fps, a.crop)
    L = json.load(open(cj, encoding='utf-8')); names = [a.clip] if a.clip else [k for k, c in L['clips'].items() if not c.get('opaque')]
    for n in names:
        c = L['clips'][n]; make([os.path.join(a.src, f) for f in c['frames']], a.out if a.clip and a.out else os.path.join(a.src, 'review', f'review-{n}.mp4'), c.get('fps', a.fps), a.crop)


if __name__ == '__main__':
    main()
