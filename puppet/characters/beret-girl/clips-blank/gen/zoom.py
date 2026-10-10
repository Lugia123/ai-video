#!/usr/bin/env python3
# 原像素裁切若干帧（只裁人物所在范围），看身份细节：python3 gen/zoom.py <段名> <帧号,帧号,…|all|every:N> → puppet/out/clips-blank/<段名>-zoom.jpg
import sys, glob, os, numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.abspath(__file__)) + '/..'; name, sel = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(f'{R}/frames/{name}/*.png')); ids = list(range(len(fs))) if sel == 'all' else list(range(0, len(fs), int(sel[6:]))) if sel.startswith('every:') else [int(x) for x in sel.split(',')]
ims = [Image.open(fs[i]) for i in ids]; al = np.max([np.array(im)[..., 3] for im in ims], 0); ys, xs = np.where(al > 64)
b = (max(xs.min() - 8, 0), max(ys.min() - 8, 0), min(xs.max() + 8, al.shape[1]), min(ys.max() + 8, al.shape[0])); w, h = b[2] - b[0], b[3] - b[1]
cols = min(len(ims), 7); rows = (len(ims) + cols - 1) // cols; S = Image.new('RGB', (cols * w, rows * h), (243, 248, 251)); d = ImageDraw.Draw(S)
for k, (i, im) in enumerate(zip(ids, ims)):
    c = im.crop(b); x, y = (k % cols) * w, (k // cols) * h; S.paste(c, (x, y), c.split()[3]); d.rectangle((x, y, x + 26, y + 13), fill='black'); d.text((x + 4, y + 1), str(i), fill='yellow')
o = os.path.normpath(f'{R}/../../../out/clips-blank/{name}-zoom.jpg'); S.save(o, quality=90); print(o, S.size)
