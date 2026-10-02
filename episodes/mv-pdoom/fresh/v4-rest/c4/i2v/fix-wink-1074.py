"""#1074 眨眼改成单眼：图生视频的第 10–14 帧两只眼都闭着（画面左边那只本该一直睁着）。
做法：不重新生图。把第 9 帧（同一个头部姿势、左眼睁着、右眼半闭）的左眼，按每帧的头部位移对位后，用羽化椭圆贴回第 10–14 帧。
  cd episodes/mv-pdoom/fresh/v4-rest/c4/i2v && python3 fix-wink-1074.py     （带 numpy / PIL 的 python3；源 = wink.pre1074/，写到 wink/）
"""
import numpy as np
from PIL import Image
SRC, DST = 'wink.pre1074', 'wink'
EYE = (321, 424)          # 画面左边那只眼的中心（832×1248 里的像素）
RX, RY, FEATHER = 66, 46, 14
REF = np.asarray(Image.open(f'{SRC}/f-009.png').convert('RGBA')).astype(np.float32)
H, W = REF.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - EYE[0]) / RX) ** 2 + ((yy - EYE[1]) / RY) ** 2)
mask0 = np.clip((1 - d) * min(RX, RY) / FEATHER, 0, 1)                      # 椭圆里 1，边上羽化
# 对位用的区域：脸中部（刘海下沿、鼻子、脸颊、嘴），去掉两只眼
ax0, ax1, ay0, ay1 = 230, 610, 330, 640
amask = np.ones((ay1 - ay0, ax1 - ax0), bool)
for cx, cy in (EYE, (505, 424)):
    amask &= (((xx[ay0:ay1, ax0:ax1] - cx) / 85) ** 2 + ((yy[ay0:ay1, ax0:ax1] - cy) / 62) ** 2) > 1
gray = lambda a: a[..., :3].mean(-1)
gref = gray(REF)
def shift_of(g):                                                              # 第 9 帧 → 这一帧的整数位移（±12 px 里找差最小的）
    best = (1e18, 0, 0)
    for dy in range(-12, 13):
        for dx in range(-12, 13):
            a = g[ay0:ay1, ax0:ax1]; b = gref[ay0 - dy:ay1 - dy, ax0 - dx:ax1 - dx]
            e = float((np.abs(a - b) * amask).sum())
            if e < best[0]: best = (e, dx, dy)
    return best
for k in range(10, 15):
    F = np.asarray(Image.open(f'{SRC}/f-{k:03d}.png').convert('RGBA')).astype(np.float32)
    e, dx, dy = shift_of(gray(F))
    src = np.roll(REF, (dy, dx), axis=(0, 1)); m = np.roll(mask0, (dy, dx), axis=(0, 1))[..., None]
    out = F.copy(); out[..., :3] = F[..., :3] * (1 - m) + src[..., :3] * m          # alpha 不动
    Image.fromarray(out.round().astype(np.uint8), 'RGBA').save(f'{DST}/f-{k:03d}.png')
    print(k, 'shift', dx, dy, 'err/px', round(e / amask.sum(), 2))
# 半闭那一帧：成片 30 fps 采样时第 9 帧（半闭）正好被跳过（4649 帧取第 8 帧、4650 帧取第 10 帧），眼睛会从全睁直接跳到全闭。
# 所以把第 10 帧换成第 9 帧的内容（头部姿势一样），成片里就是 睁 → 半闭（4650）→ 全闭（4651–4658）→ 半闭（4659）→ 睁。代码不用改。
import shutil; shutil.copy(f'{SRC}/f-009.png', f'{DST}/f-010.png'); print('f-010 := f-009（半闭）')
