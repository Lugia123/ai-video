#!/usr/bin/env python3
"""对比图：每条路线一行——四层平铺（浅绿底）+ 叠回效果 + 两处局部 3 倍。仓库根目录跑：python3 <本文件> → puppet/out/layers-trial/compare.png
行标签用英文短名（图里不嵌中文字体）：ORIGINAL = 原视图；R0 CUT = 硬切对照；R1 PEEL = 逐层揭开；R2 SPLIT = 拆层模型；R3 REDRAW = 描边由代码重画。"""
import os, sys, numpy as np
from PIL import Image, ImageDraw
T = 'puppet/characters/beret-girl/source-next/layers-trial/'; OUT = 'puppet/out/layers-trial/compare.png'; S = 440; GAP = 8; LW = 150
ROWS = [('R0 CUT', T + 'r0-cut'), ('R1 PEEL', T + 'r1-gen'), ('R2 SPLIT', T + 'r2-split'), ('R3 REDRAW', T + 'r3-lineart')] + ([('R3 on R2', T + 'r3-on-r2')] if os.path.isdir(T + 'r3-on-r2') else [])
LAY = ['hat', 'front_hair', 'back_hair', 'head']; CROPS = [(250, 330, 550, 630), (880, 620, 1180, 920)]          # 局部：左帽檐角和刘海交界；耳朵和侧发
def tile(p, bg=(170, 215, 170)):
    if not os.path.exists(p): return Image.new('RGB', (S, S), (235, 235, 235))
    L = Image.open(p).convert('RGBA'); b = Image.new('RGBA', L.size, bg + (255,)); b.alpha_composite(L); return b.convert('RGB').resize((S, S), Image.LANCZOS)
def crop3(p, box):
    if not os.path.exists(p): return Image.new('RGB', (S, S), (235, 235, 235))
    im = Image.open(p).convert('RGB').crop(box); return im.resize((im.width * 3, im.height * 3), Image.NEAREST).resize((S, S), Image.NEAREST) if im.width * 3 != S else im.resize((S, S), Image.NEAREST)
cols = ['hat', 'front hair', 'back hair', 'head', 'recomposed', 'zoom A (3x)', 'zoom B (3x)']
W = LW + (S + GAP) * len(cols); H = 30 + (S + GAP) * (len(ROWS) + 1); c = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(c)
for i, t in enumerate(cols): d.text((LW + i * (S + GAP) + 6, 8), t, fill=(0, 0, 0))
src = T + 'in/quarter_magenta.png'; d.text((8, 30 + S // 2), 'ORIGINAL', fill=(0, 0, 0)); c.paste(Image.open(src).convert('RGB').resize((S, S), Image.LANCZOS), (LW + 4 * (S + GAP), 30))
for j, b in enumerate(CROPS): c.paste(crop3(src, b), (LW + (5 + j) * (S + GAP), 30))
for r, (lab, D) in enumerate(ROWS):
    y = 30 + (r + 1) * (S + GAP); d.text((8, y + S // 2), lab, fill=(0, 0, 0))
    for i, n in enumerate(LAY): c.paste(tile(f'{D}/layers/{n}.png'), (LW + i * (S + GAP), y))
    c.paste(tile(f'{D}/recomposed.png'), (LW + 4 * (S + GAP), y))
    for j, b in enumerate(CROPS): c.paste(crop3(f'{D}/recomposed.png', b), (LW + (5 + j) * (S + GAP), y))
os.makedirs(os.path.dirname(OUT), exist_ok=True); c.save(OUT); print(OUT, c.size)
