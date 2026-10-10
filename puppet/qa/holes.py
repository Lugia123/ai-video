"""露底检查：python3 puppet/qa/holes.py <品红底的图.png> [标注图.png]
数「被角色包住的品红像素」（不和图的边连通的背景）以及半透明透出品红的像素。打印数量和最大的几块的位置。"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int); r, g, b = im[..., 0], im[..., 1], im[..., 2]
bg = (r > 235) & (g < 20) & (b > 235)
lab, n = ndimage.label(bg); edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
inner = bg & ~np.isin(lab, list(edge))
tint = (~bg) & (r - g > 90) & (b - g > 90) & (abs(r - b) < 60)      # 半透明处透出的品红
tl, tn = ndimage.label(tint); big = ndimage.sum(tint, tl, range(1, tn + 1)) if tn else []
il, inn = ndimage.label(inner); sizes = ndimage.sum(inner, il, range(1, inn + 1)) if inn else []
print(f'被包住的露底：{int(inner.sum())} 像素，{inn} 块；透出品红的半透明像素：{int(tint.sum())}')
for k in np.argsort(sizes)[::-1][:6]:
    ys, xs = np.where(il == k + 1); print(f'  露底块 {int(sizes[k])} px  @ x {xs.min()}–{xs.max()}  y {ys.min()}–{ys.max()}')
if len(sys.argv) > 2:
    o = im.copy().astype(np.uint8); o[inner] = (255, 255, 0); Image.fromarray(o).save(sys.argv[2])
