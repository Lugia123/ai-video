#!/usr/bin/env python3
"""校验：闭眼四档验收图 <work>/out/wip-eye-closed-check.png（2 倍）：旧部件 | 新部件 + 闭眼线 + 下睫毛点收拢。闭合是按 rig 做法的逐像素近似。

  python3 closed_check.py --source <角色来源目录> --work <中间产物目录>"""
import numpy as np, cv2, json, os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'verify_eyes.py'), encoding='utf-8').read().split("res = {'recompose'")[0])          # 借用 verify_eyes.py 的前半段（SRC / WK 也从这里来）
EJ2 = json.load(open(SRC('face/eyes.json'), encoding='utf-8')); E2 = {p['id']: p for p in EJ2['parts']}
def put(img, path, rect, alpha=1.0, dy=0.0):
    im = rd(path).astype(np.float32); x0, y0 = int(round(rect[0] - HO[0])), int(round(rect[1] - HO[1] + dy)); h, w = im.shape[:2]
    a = im[..., 3:4] / 255 * alpha; img[y0:y0 + h, x0:x0 + w] = img[y0:y0 + h, x0:x0 + w] * (1 - a) + im[..., :3] * a
rows = []
from PIL import Image, ImageDraw, ImageFont
_f = ImageFont.truetype('/Library/Fonts/Arial Unicode.ttf', 26)
def bar_(t, w, h=42):
    im = Image.new('RGB', (w, h), (255, 255, 255)); ImageDraw.Draw(im).text((10, 6), t, fill=(20, 39, 74), font=_f); return np.array(im)[..., ::-1]
for c in (0.6, 0.8, 0.9, 1.0):
    old, _ = compose(False, c=c); new, _ = compose(True, c=c, with_low=False); new = new.astype(np.float32)
    for s in 'LR':
        dy = E2['eyeLow' + s]['close_behavior']['dy_at_full_close'] * float(smooth((c - 0.6) / 0.4)); put(new, SRC('face', f'eyeLow{s}.png'), E2['eyeLow' + s]['rect'], 1.0, dy)
        put(new, SRC('face', f'lid{s}.png'), E2['lid' + s]['rect'], float(smooth((c - 0.88) / 0.12)))
    new = np.clip(new, 0, 255).astype(np.uint8); box = (slice(760, 1060), slice(280, 1100))
    t = np.hstack([cv2.resize(x[box], None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC) for x in (old, new)])
    rows += [bar_(f'闭合度 {int(c * 100)}%：旧部件 | 新部件 + 闭眼线（alpha {float(smooth((c - 0.88) / 0.12)):.2f}）+ 下睫毛点收拢', t.shape[1]), t]
cv2.imwrite(WK('out/wip-eye-closed-check.png'), np.vstack(rows)); print('ok')
