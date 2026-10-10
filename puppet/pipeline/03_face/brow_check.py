#!/usr/bin/env python3
"""校验：验收图 <work>/out/wip-face-base-check.png：眉毛层上下移 12 px、左右移 20 px，看脸底上有没有残影和双线（#1157 收窄后的唯一验收项）。
要先跑过 verify_face.py（读它写的 <work>/face/verify.json）。

  python3 brow_check.py --source <角色来源目录> --work <中间产物目录>

每行一个位移：旧脸底 + 旧眉 | 同图对比度×6 | 新脸底 + 新眉 | 同图对比度×6。不叠头发，眼睛照常画。"""
import numpy as np, cv2, json, os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'verify_face.py'), encoding='utf-8').read().split("# ---------- a) 叠回对比")[0]; exec(src)          # 借用 verify_face.py 的前半段（读图、叠图的函数；SRC / WK 也从这里来）
from PIL import Image, ImageDraw, ImageFont
f26 = ImageFont.truetype('/Library/Fonts/Arial Unicode.ttf', 26)
V = json.load(open(WK('face/verify.json'), encoding='utf-8')); G = {t['test']: t for t in V['shift_tests']}
def boost(im):
    f_ = im.astype(np.float32); return np.clip(128 + (f_ - cv2.GaussianBlur(f_, (0, 0), 20)) * 6, 0, 255).astype(np.uint8)
rows = []
def bar(text, w, h=44):
    im = Image.new('RGB', (w, h), (255, 255, 255)); ImageDraw.Draw(im).text((10, 6), text, fill=(20, 39, 74), font=f26); return np.array(im)[..., ::-1]
box = (slice(640, 1000), slice(250, 1130))
for label, dx, dy in [('原位', 0, 0), ('眉 上移 12', 0, -12), ('眉 下移 12', 0, 12), ('眉 左移 20', -20, 0), ('眉 右移 20', 20, 0)]:
    sh = {'browL': (dx, dy), 'browR': (dx, dy)}
    a = compose('parts', 'parts', sh, with_hair=False); b = compose('face', 'face', sh, with_hair=False)
    t = np.hstack([cv2.resize(x[box], (528, 216)) for x in (a, boost(a), b, boost(b))])
    g = G.get(label); extra = f"    露出处的残影（Lab 色差 最大/99 分位）：旧 {g['old_face_max_dE']} / {g['old_face_p99_dE']}   新 {g['new_face_max_dE']} / {g['new_face_p99_dE']}" if g else ''
    rows += [bar(label + extra, t.shape[1]), t]
head = bar('旧脸底 + 旧眉  |  同图 对比度×6  |  新脸底 + 新眉  |  同图 对比度×6        （对比度×6 是为了让残影看得见；正常观看时是左边那张）', rows[1].shape[1])
cv2.imwrite(WK('out/wip-face-base-check.png'), np.vstack([head] + rows)); print('ok')
