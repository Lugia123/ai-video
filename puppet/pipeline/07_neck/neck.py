"""脖子层贴图：清晰的肤色脖子 + 两侧深色描边 + 下巴投下的一道硬边阴影。程序画，不出图；颜色取自待机母版。
  python3 neck.py <待机母版 pose_idle_f.png> <输出目录>        → <输出目录>/neck.png（180×354，角色坐标 1:1）+ neck.json（矩形、颜色、尺寸）
几何（贴图像素 = 角色坐标像素；贴图原点 = 角色 (1002, 1182)，中线 x = 90，下巴在贴图 y ≈ 170）：
  上端一直画到贴图顶，藏在脸下面，转头 / 点头时下巴挪开也不露空。看得见的那截宽约 126–136、略收腰；进领口后放宽到 168，藏在领子后面。
  描边：两侧各一条，宽 6.5，深藏青。阴影：下巴投影，硬边，下沿是一条中间低两边高的弧线（中间在下巴下 13 像素），以上是阴影色、以下是脸的浅肤色。
打包时按身体底图的领口把它挖掉（藏进领子后面），登记成跟身体不跟头的部件，层序在脸之下、后发之上。
取色位置（母版里脖子、脸的两块取样框）和几何常数是按这个角色量的，写在脚本里，没有进配置。"""
import sys, os, json, numpy as np
if len(sys.argv) < 3: raise SystemExit(__doc__)
MASTER, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
from PIL import Image
W, H, CX, CHIN = 180, 354, 89.5, 170; SS = 4          # 4 倍超采样再缩
M = np.asarray(Image.open(MASTER).convert('RGB')).astype(float)
SHADOW = [float(v) for v in np.median(M[696:712, 535:560].reshape(-1, 3), 0)]          # 母版脖子（整段在下巴阴影里）的颜色
SKIN = [float(v) for v in np.median(M[640:660, 520:575].reshape(-1, 3), 0)]            # 母版下巴上方脸的肤色
LINE = (22, 28, 48); LINE_W = 6.5
yy, xx = (np.mgrid[0:H * SS, 0:W * SS].astype(np.float64) + 0.5) / SS
v = np.clip((yy - (CHIN + 30)) / 34, 0, 1); v = v * v * (3 - 2 * v); t = np.clip((yy - (CHIN - 30)) / 60, 0, 1)
hw = 68 - 5 * np.sin(np.pi * t) + 16 * v          # 半宽：下巴处 68（kit 34）、中间略收到 63、进领口后放宽到 84 填满领口开口
edge = hw - np.abs(xx - CX)                                                                  # 到左右轮廓的距离（里正外负）
aa = lambda d: np.clip(d * SS + 0.5, 0, 1)                                                   # 超采样格上的 1 格过渡
alpha = aa(edge); line = aa(LINE_W - edge) * alpha
yb = CHIN + 13 - 7 * ((xx - CX) / 62) ** 2; sh = aa(yb - yy)                                # 阴影下沿：中间低、两边高
rgb = np.stack([SKIN[i] * (1 - sh) + SHADOW[i] * sh for i in range(3)], -1); rgb = rgb * (1 - line[..., None]) + np.array(LINE) * line[..., None]
im = np.dstack([rgb, alpha * 255]); im = im.reshape(H, SS, W, SS, 4).mean((1, 3))
pm = im[..., :3] * im[..., 3:] ; a_ = np.maximum(im[..., 3:], 1e-6)          # 颜色按 alpha 加权平均已在上一步近似；边缘像素颜色直接取未混透明的
Image.fromarray(np.dstack([rgb.reshape(H, SS, W, SS, 3).mean((1, 3)), im[..., 3]]).round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'neck.png'))
json.dump({'rect': [1002, 1182, W, H], 'textureScale': 1, 'chinY': CHIN, 'visibleWidth': 130, 'flaredWidth': 168, 'lineWidth': LINE_W, 'colors': {'skin': [round(v) for v in SKIN], 'shadow': [round(v) for v in SHADOW], 'line': LINE},
           'note': '角色坐标 1:1 的贴图；领口遮挡由数据包导入时按 base.png 的 alpha 挖。'}, open(os.path.join(OUT, 'neck.json'), 'w'), ensure_ascii=False, indent=1)
print('skin', [round(v) for v in SKIN], 'shadow', [round(v) for v in SHADOW])
