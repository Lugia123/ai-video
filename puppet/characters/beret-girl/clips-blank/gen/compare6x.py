#!/usr/bin/env python3
# 6 倍对照：原归位帧 | 空脸候选（品红底，脸区域 x270–560 y340–540，最近邻放大）。 compare6x.py <候选_magenta.png>… -o <输出>
import sys, numpy as np, cv2
args = sys.argv[1:]; out = args[args.index('-o') + 1]; cands = [a for a in args[:args.index('-o')]]
mag = cv2.resize(cv2.imread('../clips-stage/home.png'), (832, 1104), interpolation=cv2.INTER_AREA)
def crop(im): return cv2.resize(im[340:540, 270:560], None, fx=6, fy=6, interpolation=cv2.INTER_NEAREST)
rows = [np.hstack([crop(mag), crop(cv2.imread(c))]) for c in cands]
cv2.imwrite(out, np.vstack(rows))
