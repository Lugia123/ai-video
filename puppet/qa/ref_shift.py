"""错位测试的参考实现（不经过引擎）：读数据包，每个部件只做 dx = depth × R × sin θ 的整体平移，按层序叠起来。
和最早做纸面验证的那个脚本是同一个算法，只是输入换成数据包。
用法：python3 puppet/qa/ref_shift.py <角色目录> <输出目录> [--subpixel]
  默认把位置取整（和原脚本一致）；--subpixel 用双线性做亚像素平移（和引擎的做法一致）。
输出：ref-<角度>.png（浅底，裁到 headMasterOrigin 起的 1408 见方，1:1）。"""
import json, math, sys, os
from PIL import Image
pack, out = sys.argv[1], sys.argv[2]; sub = '--subpixel' in sys.argv
ch = json.load(open(f'{pack}/character.json')); parts = json.load(open(f"{pack}/{ch['files']['parts']}"))
R = ch['unit']['R']; ox, oy = ch['unit'].get('headMasterOrigin', [0, 0]); N = 1408
os.makedirs(out, exist_ok=True)
layers = []
for p in sorted(parts, key=lambda p: p['order']):
    x, y, w, h = p['rect']; im = Image.open(f"{pack}/{p['texture']}").convert('RGBA')
    if im.size != (round(w), round(h)): im = im.resize((round(w), round(h)), Image.LANCZOS)
    layers.append((im, x - ox, y - oy, p.get('depth', 0)))
for a in [-30, -20, -10, 0, 10, 20, 30]:
    c = Image.new('RGBA', (N, N), (244, 247, 251, 255)); s = math.sin(math.radians(a))
    for im, x, y, d in layers:
        fx = x + d * R * s
        if sub:
            big = Image.new('RGBA', (N, N), (0, 0, 0, 0)); ix, iy = math.floor(fx), math.floor(y); big.alpha_composite(im, (ix, iy)) if ix >= 0 and iy >= 0 else big.paste(im, (ix, iy))
            pm = big.convert('RGBa').transform((N, N), Image.AFFINE, (1, 0, -(fx - ix), 0, 1, -(y - iy)), Image.BILINEAR).convert('RGBA')
            c.alpha_composite(pm)
        else: c.alpha_composite(im, (round(fx), round(y)))
    c.convert('RGB').save(f'{out}/ref-{a}.png')
print('ok', out)
