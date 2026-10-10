"""两张同尺寸图的差异：python3 puppet/qa/diff.py a.png b.png [差异图.png] [阈值=24]
打印：差异像素比例（任一通道差 > 阈值）、平均绝对差、最大差。"""
import sys
from PIL import Image, ImageChops
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB'); th = int(sys.argv[4]) if len(sys.argv) > 4 else 24
assert a.size == b.size, f'尺寸不同 {a.size} {b.size}'
d = ImageChops.difference(a, b); g = Image.merge('RGB', d.split()).convert('L') if False else ImageChops.lighter(ImageChops.lighter(*d.split()[:2]), d.split()[2])
h = g.histogram(); n = a.size[0] * a.size[1]; over = sum(h[th + 1:]); mean = sum(i * v for i, v in enumerate(h)) / n; mx = max(i for i, v in enumerate(h) if v)
print(f'{over / n * 100:.3f}% 像素差>{th}   平均差 {mean:.3f}   最大差 {mx}')
if len(sys.argv) > 3 and sys.argv[3] != '-': g.point(lambda v: min(255, v * 4)).save(sys.argv[3])
