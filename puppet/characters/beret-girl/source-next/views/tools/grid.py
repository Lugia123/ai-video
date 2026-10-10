#!/usr/bin/env python3
"""给一张图叠上带坐标的网格，方便人眼读五官的像素坐标（量角度用）。
用法：python3 grid.py <图> <输出> [x0 y0 x1 y1] [步长]   坐标是原图像素；裁出这一块后放大到宽 1600。"""
import sys
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA'); _bg = Image.new('RGBA', im.size, (200, 200, 205, 255)); _bg.alpha_composite(im); im = _bg.convert('RGB')   # 透明底的图垫一层灰
box = tuple(map(int, sys.argv[3:7])) if len(sys.argv) >= 7 else (0, 0, im.width, im.height)
step = int(sys.argv[7]) if len(sys.argv) >= 8 else 50
c = im.crop(box); k = 1600 / c.width
c = c.resize((1600, round(c.height * k)), Image.LANCZOS)
d = ImageDraw.Draw(c)
try: f = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 20)
except Exception: f = ImageFont.load_default()
x = (box[0] // step + 1) * step
while x < box[2]:
    X = (x - box[0]) * k; d.line([(X, 0), (X, c.height)], fill=(255, 0, 255), width=1); d.text((X + 2, 2), str(x), fill=(255, 0, 255), font=f); x += step
y = (box[1] // step + 1) * step
while y < box[3]:
    Y = (y - box[1]) * k; d.line([(0, Y), (c.width, Y)], fill=(255, 0, 255), width=1); d.text((2, Y + 2), str(y), fill=(255, 0, 255), font=f); y += step
c.save(out, quality=88)
