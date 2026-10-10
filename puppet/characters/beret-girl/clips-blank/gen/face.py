#!/usr/bin/env python3
# 只裁头和上身的逐帧 contact（不抽帧），查张嘴、闭眼、手挡脸：python3 gen/face.py <段名> → puppet/out/clips-blank/<段名>-face.jpg
# 裁的是原始带底帧（不是抠好的），范围 = 画幅高的 26%–64%、左右各去掉 20%；每格标帧号。
import sys, os, subprocess, numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.abspath(__file__)) + '/..'; name = sys.argv[1]; clip = f'{R}/raw/{name}.mp4'
w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', clip], capture_output=True, text=True).stdout.strip().split(','))
fr = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, h, w, 3)
x0, x1, y0, y1 = int(w * .20), int(w * .80), int(h * .26), int(h * .64); cw, ch = (x1 - x0) // 2, (y1 - y0) // 2; cols = 10; rows = (len(fr) + cols - 1) // cols
S = Image.new('RGB', (cols * cw, rows * ch), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fr):
    c = Image.fromarray(f[y0:y1, x0:x1]).resize((cw, ch), Image.LANCZOS); x, y = (i % cols) * cw, (i // cols) * ch; S.paste(c, (x, y)); d.rectangle((x, y, x + 26, y + 13), fill='black'); d.text((x + 4, y + 1), str(i), fill='yellow')
o = os.path.normpath(f'{R}/../../../out/clips-blank/{name}-face.jpg'); S.save(o, quality=90); print(o, S.size)
