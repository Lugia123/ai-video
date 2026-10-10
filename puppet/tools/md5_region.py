#!/usr/bin/env python3
"""逐帧只比画面里的一块：python3 tools/md5_region.py <帧目录> x0,y0,x1,y1 [另一份清单.txt]
只给目录和区域：按文件名顺序打印每帧这一块像素的 md5（存成清单）。再给一份清单：逐帧比，打印不同的帧数和帧号范围。
用处：页面上的说明文字改了以后整帧 md5 全变，要确认人物那一块像素有没有变，就只比人物区域。"""
import hashlib, os, sys
from PIL import Image
d, box = sys.argv[1], tuple(int(v) for v in sys.argv[2].split(','))
cur = [hashlib.md5(Image.open(os.path.join(d, f)).convert('RGB').crop(box).tobytes()).hexdigest() for f in sorted(os.listdir(d)) if f.endswith('.png')]
if len(sys.argv) < 4: print('\n'.join(cur)); sys.exit(0)
old = [l.strip() for l in open(sys.argv[3]) if l.strip()]; bad = [i for i, (a, b) in enumerate(zip(cur, old)) if a != b]
print(f'{len(cur)} 帧 对 {len(old)} 帧，这一块不同 {len(bad) + abs(len(cur) - len(old))} 帧' + (f'（第 {bad[0]}–{bad[-1]} 帧之间）' if bad else '')); sys.exit(1 if bad or len(cur) != len(old) else 0)
