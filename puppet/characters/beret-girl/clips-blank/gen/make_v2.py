#!/usr/bin/env python3
# 空脸归位帧 v2：以 v1(A) 为底，只修贴片边界处的毛病（不整张重画）。输出 home_blank_v2_{rgba,magenta}.png；旧的 home_blank_* 不动。
import numpy as np, cv2
from scipy import ndimage as ndi
ST = '../clips-stage'
orig = cv2.cvtColor(cv2.resize(cv2.imread(f'{ST}/home.png'), (832, 1104), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)
v1 = cv2.cvtColor(cv2.imread('home_blank_magenta.png'), cv2.COLOR_BGR2RGB)
o = orig.astype(int); D = (np.abs(o - v1.astype(int)).max(2) > 3)
# 头发填色（浅薄荷）：原图里是它、v1 却改掉了的像素 → 还原成原图（这是「发束被贴片横切」的来源）
mint = (o[..., 1] > o[..., 0] + 10) & (o.mean(2) > 175) & (o[..., 2] > o[..., 0] + 5)
lab, k = ndi.label(mint); sz = ndi.sum(mint, lab, range(1, k + 1)); hairmass = np.isin(lab, 1 + np.where(sz > 3000)[0])   # 只认大块发色（排除虹膜高光等小块）
fix = D & hairmass
print('v1 改动', D.sum(), '其中原图是发色填充的', fix.sum())
out = v1.copy(); out[fix] = orig[fix]
np.save('v2work/fixmask.npy', fix); cv2.imwrite('v2work/step1.png', cv2.cvtColor(out, cv2.COLOR_RGB2BGR))

# 右脸边缘的小尖点（睫毛翼尖残留，约 x527,y428）：上下两行之间逐列线性插值，边缘按两端的走向连起来
y0, y1, xa, xb = 421, 438, 512, 542
for y in range(y0 + 1, y1):
    t = (y - y0) / (y1 - y0); out[y, xa:xb] = np.clip(out[y0, xa:xb] * (1 - t) + out[y1, xa:xb] * t, 0, 255).astype(np.uint8)
cv2.imwrite('v2work/step2.png', cv2.cvtColor(out, cv2.COLOR_RGB2BGR))

home = cv2.cvtColor(cv2.resize(cv2.cvtColor(cv2.imread(f'{ST}/home_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA), (832, 1104), interpolation=cv2.INTER_AREA), cv2.COLOR_RGBA2RGB) if False else None
rgba = cv2.cvtColor(cv2.imread(f'{ST}/home_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA); rgba = cv2.resize(rgba, (832, 1104), interpolation=cv2.INTER_AREA)
v1r = cv2.cvtColor(cv2.imread('home_blank_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)
chg = (np.abs(out.astype(int) - v1.astype(int)).max(2) > 0)   # v2 相对 v1 改了的像素
r2 = v1r.copy(); r2[chg, :3] = out[chg]
ys, xs = np.where(chg); print('v2 相对 v1 改动 %d 像素，包围盒 x %d–%d y %d–%d；alpha 与归位帧相同: %s' % (chg.sum(), xs.min(), xs.max(), ys.min(), ys.max(), bool((r2[..., 3] == rgba[..., 3]).all())))
cv2.imwrite('home_blank_v2_rgba.png', cv2.cvtColor(r2, cv2.COLOR_RGBA2BGRA)); cv2.imwrite('home_blank_v2_magenta.png', cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
