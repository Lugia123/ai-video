#!/usr/bin/env python3
"""校验：把 mouth_compare.mjs 截的两张图拼成对照图（#1162）。要先跑过 mouth_compare.mjs。

  python3 mouth_compare.py --source <角色来源目录> --work <中间产物目录>

输出 <work>/out/mouth-compare-2x.png：两行（正面 / 转头 20°），每个口型左「修前」右「修后」。"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 W 已经是别的变量名，所以换个名字引
F = lambda s: ImageFont.truetype('/System/Library/Fonts/Hiragino Sans GB.ttc', s)
b, a = Image.open(WK('face/mouth_compare/_cmp-before.png')).convert('RGB'), Image.open(WK('face/mouth_compare/_cmp-after.png')).convert('RGB')
TW, TH = b.width // 4, b.height // 2
NAMES = ['closed 闭嘴', 'small 小口', 'big 大张嘴', 'smile 咧嘴笑']; ROWS = ['正面', '转头 20°']
GAP, HEAD, LEFT = 14, 64, 110
W = LEFT + 4 * (2 * TW + 4) + 3 * GAP; H = HEAD + 2 * TH + 10
out = Image.new('RGB', (W, H), (34, 38, 43)); d = ImageDraw.Draw(out)
for i, n in enumerate(NAMES):
    x = LEFT + i * (2 * TW + 4 + GAP)
    d.text((x + 8, 6), n, fill=(255, 255, 255), font=F(26))
    d.text((x + 8, 38), '修前', fill=(255, 170, 150), font=F(20)); d.text((x + TW + 12, 38), '修后', fill=(150, 230, 170), font=F(20))
    for r in range(2):
        y = HEAD + r * (TH + 10)
        out.paste(b.crop((i * TW, r * TH, (i + 1) * TW, (r + 1) * TH)), (x, y))
        out.paste(a.crop((i * TW, r * TH, (i + 1) * TW, (r + 1) * TH)), (x + TW + 4, y))
for r, t in enumerate(ROWS):
    d.text((10, HEAD + r * (TH + 10) + TH // 2 - 14), t, fill=(255, 255, 255), font=F(24))
out.save(WK('out/mouth-compare-2x.png')); print(out.size)
