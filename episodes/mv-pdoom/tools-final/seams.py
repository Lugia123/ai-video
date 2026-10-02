"""#1050 接缝检查：每个接缝前后各 3 帧拼图（final 帧号标注），并和源片逐帧比对。
  python3 tools-final/seams.py 1752 2244 ...   → out/final-seams/seam-<帧号>.jpg"""
import subprocess, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT = pathlib.Path(__file__).resolve().parents[1]; F = ROOT / 'out/final.mp4'; OUT = ROOT / 'out/final-seams'; OUT.mkdir(exist_ok=True)
font = ImageFont.truetype('/System/Library/Fonts/Hiragino Sans GB.ttc', 22)
for b in map(int, sys.argv[1:]):
    tmp = OUT / f'_tmp-{b}'; tmp.mkdir(exist_ok=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(F), '-vf', f"select='between(n\\,{b-3}\\,{b+2})',scale=640:-1", '-vsync', '0', str(tmp / 'f-%d.png')], check=True)
    fs = sorted(tmp.glob('f-*.png'), key=lambda p: int(p.stem[2:]))
    c = Image.new('RGB', (3 * 640, 2 * 390), 'black'); d = ImageDraw.Draw(c)
    for i, f in enumerate(fs):
        x, y = (i % 3) * 640, (i // 3) * 390; c.paste(Image.open(f), (x, y + 30)); n = b - 3 + i
        d.text((x + 8, y + 4), f'#{n}  {n/30:.3f}s  {"接缝前" if n < b else "接缝后"}', font=font, fill=(255, 220, 120) if n >= b else 'white')
    c.save(OUT / f'seam-{b}.jpg', quality=88)
    for f in fs: f.unlink()
    tmp.rmdir()
    print(OUT / f'seam-{b}.jpg')
