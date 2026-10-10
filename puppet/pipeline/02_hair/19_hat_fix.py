#!/usr/bin/env python3
"""#1164：帽子片修两处（python3 19_hat_fix.py --source <来源目录> --work <中间产物目录>；读来源目录的 head/hat_pre1164.png 这份原件，写 head/hat.png，可重跑）。
1 去掉不属于帽子的线：帽子贴图左下、右下角各带一截顺着头发外轮廓往下走的线（切帽子时把贴着帽子的头发描边一起圈进来了）。帽子深度 0.08、侧发 0.38，
  一转头这截线留在原地，和侧发自己的描边成了两条线。帽子的轮廓线只沿帽子自己的边走：离帽子本体（藏青填充 + 发卡）以外成段的线全部去掉。
2 帽顶上沿在呆毛位置的台阶形缺口补平：切帽子时把呆毛根部那一块连同旁边的帽子描边一起挖掉了，底色从缺口透出来成了白点。
  在呆毛根部左右各 70px 的范围内，把帽子上沿按两端连成的直线补齐，补的是帽子描边的近黑色。呆毛片的发根从帽子后面穿出来。"""
import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import paths
import numpy as np, json
from PIL import Image
from scipy import ndimage as ndi
im = np.asarray(Image.open(paths.S('head', 'hat_pre1164.png')).convert('RGBA')).copy(); r, g, b, a = [im[..., i].astype(int) for i in range(4)]; H, W = a.shape
# 帽子本体 = 帽子片的不透明区域做一次半径 13 的开运算（宽不到 26px 的东西——也就是线——被去掉，帽子本体留下）。这里的开运算只用来分辨「本体 / 线」，不改帽子本体的像素。
DISK = np.zeros((27, 27), bool); yy_, xx_ = np.mgrid[-13:14, -13:14]; DISK[yy_ ** 2 + xx_ ** 2 <= 169] = True
body = ndi.binary_opening(np.pad(a > 128, 20), structure=DISK)[20:-20, 20:-20]
dist = ndi.distance_transform_edt(~body); far = (a > 0) & (dist > 4)
# 只去掉成段的线（> 200px 的块）和它们沿线往回 14→9px 的那一小截过渡；零星的边缘抗锯齿像素不动
l, n = ndi.label(far); sz = ndi.sum(far, l, range(1, n + 1)); stray = np.isin(l, [i + 1 for i in range(n) if sz[i] > 200])
grow = ndi.binary_dilation(stray, iterations=4) & (a > 0) & (dist > 1.5); stray |= grow
im[stray, 3] = 0; print('去掉不属于帽子的线', int(stray.sum()), 'px；分块', sorted([int(s) for s in sz if s > 200], reverse=True))
# 1b 帽子片边上贴着的灰青色细线（头发的线，切帽子时一起圈进来的，贴在帽檐下沿和帽角内侧）：帽子自己只有藏青、近黑、发卡的黄和镜头的深青，
#    离帽子边缘 10px 以内、偏青偏亮的像素（G 比 R 高 18 以上且亮度 > 85）不是帽子的，去掉；发卡（黄色外扩 30px）范围内不动。
r2, g2, b2, a2 = [im[..., i].astype(int) for i in range(4)]; lum2 = r2 * 0.3 + g2 * 0.59 + b2 * 0.11
yel = ndi.binary_dilation((a2 > 200) & (r2 > 150) & (g2 > 100) & (b2 < 140) & (r2 > b2 + 60), iterations=30)
rimz = (a2 > 0) & ~ndi.binary_erosion(a2 > 128, iterations=10) & ~yel
teal = rimz & (g2 > r2 + 18) & (lum2 > 85)
teal = ndi.binary_dilation(teal, iterations=1) & rimz & (lum2 > 60) & (g2 > r2 + 8)
im[teal, 3] = 0; print('去掉帽子片边上的灰青细线', int(teal.sum()), 'px')
# 2 补帽顶缺口
rig = json.load(open(paths.S('head', 'rig.json'))); hp = next(p for p in rig['parts'] if p['id'] == 'hat'); hx, hy = round(hp['rect'][0] - 390), round(hp['rect'][1] - 136)
hj = json.load(open(paths.S('hair', 'hair.json'))); ah = next(p for p in hj['pieces'] if p['name'] == 'ahoge'); A = np.asarray(Image.open(paths.S('hair', 'inputs', 'ahoge.png'))) > 0          # 母版坐标里的呆毛可见范围
ys, xs = np.where(A); bx = xs[ys > ys.max() - 8]; x0, x1 = int(bx.min()) - 70 - hx, int(bx.max()) + 70 - hx
al = im[..., 3] > 128; top = np.array([np.where(al[:, x])[0].min() if al[:, x].any() else H for x in range(W)])
xa, xb = x0, x1; cols = np.arange(xa, xb + 1); mid = (bx.min() - hx + bx.max() - hx) / 2
ok = np.abs(cols - mid) > 48                                     # 缺口在中间约 ±45px，用两侧完好的帽沿拟合一条二次曲线（帽顶是弧形的）
fit = np.polyval(np.polyfit(cols[ok], top[xa:xb + 1][ok], 2), cols); filled = 0
for i, x in enumerate(cols):
    t = int(round(fit[i]))
    if top[x] > t + 1: im[t:top[x] + 2, x] = (5, 11, 34, 255); filled += top[x] + 2 - t
    if abs(x - mid) <= 52:          # 缺口一带：帽顶线以下 11px（帽子描边的宽度）整条画成描边色，缺口里残留的小洞和浅色点一并盖住；再往下若还有透明小洞，用帽子的藏青填上
        im[t:t + 11, x] = (5, 11, 34, 255)
        hole = im[t + 11:t + 40, x, 3] < 200
        if hole.any(): im[t + 11:t + 40, x][hole] = (33, 58, 96, 255)
print('帽顶缺口补上', int(filled), 'px（帽子贴图 x', xa, '–', xb, '）')
# 收尾：帽子片只留最大的一块，前面几步切下来的零星小碎块（< 400px）去掉
l_, n_ = ndi.label(im[..., 3] > 0); sz_ = ndi.sum(im[..., 3] > 0, l_, range(1, n_ + 1))
drop = np.isin(l_, [i + 1 for i in range(n_) if sz_[i] < 400]); im[drop, 3] = 0; print('去掉帽子片上的零星碎块', int(drop.sum()), 'px')
# #1164 续 c：别针下沿挂着两个头发色的小三角（发丝线的线头被圈进了帽子片），转头后悬在侧发上面——别针下沿往下 30px 这一带里头发色的像素去掉
_r, _g, _b = [im[..., i].astype(int) for i in range(3)]; _L = 0.299 * _r + 0.587 * _g + 0.114 * _b
_zone = np.zeros(im.shape[:2], bool); _zone[515:545, 935:1000] = True
_tips = _zone & (im[..., 3] > 0) & (_g > _r + 4) & (_g >= _b - 12) & (_L > 60); _tips = ndi.binary_dilation(_tips, iterations=2) & _zone & (im[..., 3] > 0) & ~((_r > _g + 15))          # 连它的软边一起，别针的棕色描边不动
im[_tips, 3] = 0; print('去掉别针下沿的头发色线头', int(_tips.sum()), 'px')
Image.fromarray(im).save(paths.S('head', 'hat.png'))
