#!/usr/bin/env python3
"""换了表情之后，眉带里还残留多少「原来的眉」。

    python3 puppet/clips/brow_ghost.py <片段库> <片段名> <逐帧渲染图目录> <表情名>          动作帧（要有 headTracks）
    python3 puppet/clips/brow_ghost.py <片段库> --pose <姿势名> <渲染图.png> <表情名>        静帧

眉带 = 原画两条眉的外接范围外扩 8px（按头部对位搬到这一帧）。在眉带里、头发素材范围之外（= 露在刘海缝里的皮肤上），
数「青绿色的线」像素（G − R > 18、R < 175、不是肤色），再去掉新眉贴片所在处（贴片不透明处外扩 2px）——剩下的就是没擦掉的原眉。
压在头发上的原眉这个读数量不到（和发丝的线同色）。只出读数。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import Tracker, rgba, flat, skin, dil


def count(T, img, M, brow_patch, occ=None):
    W, H = T.W, T.H; b = flat(img); band = T.warp(T.brow_m, M) & ~dil(T.warp(T.hair_rest, M), 5) & (img[..., 3] > 128)
    teal = (b[..., 1].astype(int) - b[..., 2] > 18) & (b[..., 2] < 175) & ~skin(b)
    new = np.zeros((H, W), np.uint8)
    if brow_patch:
        im = cv2.imread(T.P(brow_patch['file']), cv2.IMREAD_UNCHANGED); x, y = brow_patch['rect'][:2]; new[y:y + im.shape[0], x:x + im.shape[1]] = (im[..., 3] > 60) * 255
    newf = dil(cv2.warpAffine(new, np.float32(M), (W, H)) > 127, 5)
    # 原眉位置上的线状暗像素（原眉是压着刘海画的，这一项量它）：比周围 11px 中值暗 18 以上。头发自己的发丝线也会被数进去，所以要和修前比
    lum = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY); line = (cv2.medianBlur(lum, 11).astype(int) - lum > 18)
    core = T.warp(T.brow_core, M) & (img[..., 3] > 128) & ~newf
    return int((teal & band & ~newf).sum()), int(band.sum()), int((line & core).sum()), int(core.sum())


def main():
    a = sys.argv[1:]; T = Tracker(a[0]); lib = T.lib
    if a[1] == '--pose':
        pose, png, expr = a[2:5]; al = lambda n: lib['poses'][n]['patches']['align']
        def mat(q): r = np.radians(q['rotate_deg']); m = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0]]) * q['scale']; m[:, 2] = q['translate']; return np.vstack([m, [0, 0, 1]])
        M = (mat(al(pose)) @ np.linalg.inv(mat(al(lib['rest']))))[:2]; bp = lib['poses'][pose]['patches']['face'][expr].get('brow')
        # 静帧的新眉贴片已经在这张静帧的坐标里：把它换算回归位帧坐标太绕，直接在帧坐标里算
        img = rgba(png); b = flat(img); band = T.warp(T.brow_m, M) & ~dil(T.warp(T.hair_rest, M), 5) & (img[..., 3] > 128)
        teal = (b[..., 1].astype(int) - b[..., 2] > 18) & (b[..., 2] < 175) & ~skin(b); new = np.zeros((T.H, T.W), bool)
        if bp: im = cv2.imread(T.P(bp['file']), cv2.IMREAD_UNCHANGED); x, y = bp['rect'][:2]; new[y:y + im.shape[0], x:x + im.shape[1]] = im[..., 3] > 60
        lum = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY); line = (cv2.medianBlur(lum, 11).astype(int) - lum > 18); core = T.warp(T.brow_core, M) & (img[..., 3] > 128) & ~dil(new, 5)
        print(f'静帧 {pose} + {expr}：眉带皮肤上残留 {int((teal & band & ~dil(new, 5)).sum())} px；原眉位置上的线状暗像素 {int((line & core).sum())} / {int(core.sum())} px'); return
    clip, d, expr = a[1:4]; files = lib['clips'][clip]['frames']; tr = lib['headTracks']; bp = lib['poses'][lib['rest']]['patches']['face'].get(expr, {}).get('brow'); rows = []; lines = []; cores = []
    for i, f in enumerate(files):
        m = tr[f]['m']; M = np.array([[m[0], -m[1], m[2]], [m[1], m[0], m[3]]]); r = count(T, rgba(f'{d}/{i:02d}.png'), M, bp); rows.append(r[0]); lines.append(r[2]); cores.append(r[3])
    print(f'{clip} + {expr} @ {os.path.basename(d)}：眉带皮肤上残留的原眉 合计 {sum(rows)} px，每帧 中位 {int(np.median(rows))} / 最大 {max(rows)}（第 {int(np.argmax(rows))} 帧）')
    print(f'   原眉位置上的线状暗像素：合计 {sum(lines)} / {sum(cores)} px（{sum(lines) / max(1, sum(cores)) * 100:.1f}%），每帧最大 {max(lines)}（第 {int(np.argmax(lines))} 帧）')


if __name__ == '__main__':
    main()
