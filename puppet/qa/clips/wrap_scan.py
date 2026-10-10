#!/usr/bin/env python3
"""找「数值回绕」的色块：算图时某个通道超出 0–255 没夹住，写盘时回绕（比如 260 → 4），皮肤上就冒出一块亮青 / 亮品红 / 亮黄。

    python3 qa/clips/wrap_scan.py <目录或图> [<目录或图>…] [--box x0,y0,x1,y1] [--min 12] [--list]

判法：一个通道很低（< 40）而另外两个都很高（> 185；最低的是蓝、也就是偏黄的那一类要 > 215）的像素（纯青、纯品红、纯黄一类——
角色身上没有这种颜色：发卡的橙黄绿通道只有 190 左右、挑染的青 G≈165、问号的蓝 G≈150 都不够格），连成 --min 个像素以上的块才算（单个像素的边缘杂色不算）。带透明通道的图只看 alpha > 32 的像素。
--box 只看画面里这一块（扫渲染出来的整帧时用来只看人物区域）。目录会递归找 .png。
退出码 1 = 有命中。输出每张命中的图：几块、最大一块多少像素、位置。"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def hits(path, box, mn):
    im = Image.open(path); im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    if box: im = im.crop(box)
    a = np.asarray(im).astype(np.int16); rgb = a[..., :3]; lo = rgb.min(2); srt = np.sort(rgb, 2)
    m = (lo < 40) & (srt[..., 1] > np.where(rgb.argmin(2) == 2, 215, 185))          # 蓝最低（偏黄）的那一类门槛更高：发卡侧面的橙黄（238,190,30）不算，回绕出来的亮黄两个通道都在 220 以上
    if a.shape[2] == 4: m &= a[..., 3] > 32
    if not m.any(): return []
    lab, n = ndi.label(m); out = []
    for i, sl in enumerate(ndi.find_objects(lab)):
        sz = int((lab[sl] == i + 1).sum())
        if sz >= mn: out.append((sz, sl[1].start + (box[0] if box else 0), sl[0].start + (box[1] if box else 0)))
    return sorted(out, reverse=True)


def main():
    args = sys.argv[1:]; box = None; mn = 12; paths = []; it = iter(args); show = False
    for x in it:
        if x == '--box': box = tuple(int(v) for v in next(it).split(','))
        elif x == '--min': mn = int(next(it))
        elif x == '--list': show = True
        else: paths.append(x)
    if not paths: sys.exit(__doc__)
    files = []
    for p in paths:
        if os.path.isdir(p): files += sorted(os.path.join(d, f) for d, _, fs in os.walk(p) for f in fs if f.lower().endswith('.png'))
        else: files.append(p)
    bad = 0
    for f in files:
        h = hits(f, box, mn)
        if h: bad += 1; print(f'命中 {f}：{len(h)} 块，最大 {h[0][0]}px 在 ({h[0][1]}, {h[0][2]})' + (f'；全部 {h}' if show else ''))
    print(f'扫了 {len(files)} 张，命中 {bad} 张（判法：一个通道 < 40、另两个 > 185（偏黄的 > 215），连成 ≥ {mn}px）'); sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
