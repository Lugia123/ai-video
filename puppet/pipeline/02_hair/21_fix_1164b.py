#!/usr/bin/env python3
"""#1164 续：帽子跟头一体转之后露出来的三处发片小毛病（b、c、d），在组装（10_assemble.py）和帽子片修补（19_hat_fix.py）之后跑：python3 21_fix_1164b.py --source <来源目录> --work <中间产物目录>
读 <work>/hair/pieces_asm/（组装刚出的发片，build.sh 负责拷过去）、<work>/hair/asm.npz、来源目录的 head/hat.png → 写来源目录的 hair/pieces/。可重跑。坐标都是发片自己的像素。
b  转头 +24°/+30°，左帽檐角下：① 刘海片左上角伸出去的一条灰绿细线尾巴和几块零碎（帽下发根取样时带出来的）——去掉细于 28px 的部分和不连着主体的碎块；
   ② 侧发（画面左）中间有一道透明的缝，后发的灰色从缝里露出来成了发白的竖纹——缝用两边的浅色头发补上。
c  转头 −24°/−30°，别针正下方：① 侧发（画面右）帽下发根是往上延伸出来的，发丝线在那一段糊成了几道竖向涂抹——原图里看不见的那部分一律淡成平的浅色，发丝线在可见部分的边上收尖；
   ② 刘海片右端别针底下有几块锯齿状的零碎和半透明的点——去掉。
d  转头 −30°，左帽檐角和侧发交界：侧发（画面左）外轮廓在接头处有 2–3px 的小折角和一小块灰——接头上 12 行到下 44 行的外沿 10px 画成近黑。"""
import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import paths
import json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
SRC, DST = paths.W('hair', 'pieces_asm', '') , paths.S('hair', 'pieces', ''); A = np.load(paths.W('hair', 'asm.npz')); META = {p['name']: p for p in json.load(open(paths.S('hair', 'hair.json')))['pieces']}
LINE = np.array([8, 14, 36])
def disk(r): y, x = np.mgrid[-r:r + 1, -r:r + 1]; return x * x + y * y <= r * r
def load(n): im = np.asarray(Image.open(f'{SRC}{n}.png').convert('RGBA')).copy(); return im, np.asarray(Image.open(f'{SRC}{n}_w.png')).copy()
def save(n, im, w): Image.fromarray(im).save(f'{DST}{n}.png'); Image.fromarray(w).save(f'{DST}{n}_w.png')
def lum(im): return 0.299 * im[..., 0].astype(float) + 0.587 * im[..., 1] + 0.114 * im[..., 2]
def vis(n): x, y, w, h = META[n]['rect']; return A[n + '_vis'][y:y + h, x:x + w]
def box(shape, x0, y0, x1, y1): m = np.zeros(shape, bool); m[y0:y1, x0:x1] = True; return m
def nearest_fill(im, w, target, source):          # target 里的像素取最近的 source 像素的颜色和权重
    idx = ndi.distance_transform_edt(~source, return_distances=False, return_indices=True); im[target, :3] = im[idx[0][target], idx[1][target], :3]; w[target] = w[idx[0][target], idx[1][target]]
log = {}
# ---------------- 刘海 ----------------
im, w = load('bangs'); a = im[..., 3] > 128; h_, w_ = a.shape
reg = box(a.shape, 0, 0, 175, 260)                                               # b①：左上角
keep = ndi.binary_dilation(ndi.binary_opening(a, disk(14)), disk(2)) & a; l, n = ndi.label(keep | (a & ~reg)); big = l == (1 + int(np.argmax(ndi.sum(a, l, range(1, n + 1)))))
thin = a & ~big & reg
im[thin | (reg & ~a), 3] = 0; log['b 刘海左上角去掉的细线和零碎'] = int(thin.sum())
a = im[..., 3] > 128
reg = box(a.shape, 770, 140, w_, 380)                                            # c②：右端别针底下
keep = ndi.binary_dilation(ndi.binary_opening(a, disk(12)), disk(2)) & a; l, n = ndi.label(keep); big = l == (1 + int(np.argmax(ndi.sum(keep, l, range(1, n + 1)))))
rag = a & ~big & reg; im[rag | (reg & ~a), 3] = 0; log['c 刘海右端去掉的锯齿零碎'] = int(rag.sum())
a = im[..., 3] > 128                                                             # 右缘半透明的点：右半边里细于 5px 的突出
reg = box(a.shape, 700, 140, w_, 520); speck = a & ~ndi.binary_dilation(ndi.binary_opening(a, disk(2)), disk(1)) & reg; im[speck, 3] = 0
semi = (im[..., 3] > 0) & (im[..., 3] <= 128) & reg & ~ndi.binary_dilation(im[..., 3] > 128, disk(3)); im[semi, 3] = 0; log['c 刘海右缘去掉的点'] = int(speck.sum() + semi.sum())
# c②b 别针底下刘海右缘那条发丝线被一段半透明的羽化边截断了（上面剩一小截浮着）——这一小块里半透明的像素改成不透明，线接上
reg = box(a.shape, 820, 250, 880, 315); im[reg & (im[..., 3] > 25), 3] = 255
# c③ 刘海右缘（别针往下那一段）是锯齿状的切口，转头后压在侧发上成了一条带齿的线——把这一段的边缘抹顺（alpha 做 σ=2.5 的模糊再取回硬边 + 1px 软边）
reg = box(a.shape, 700, 140, w_, 600); af = ndi.gaussian_filter((im[..., 3] > 128).astype(float), 2.5); a2 = af > 0.5
grow = a2 & ~(im[..., 3] > 128) & reg
if grow.any(): nearest_fill(im, w, grow, (im[..., 3] > 128))
na = np.clip((af - 0.35) / 0.3, 0, 1) * 255; edge = reg & (ndi.binary_dilation(a2, disk(2)) & ~ndi.binary_erosion(a2, disk(2)))
log['c 刘海右缘抹顺的边缘像素'] = int((edge & (np.abs(na - im[..., 3]) > 60)).sum()); im[edge, 3] = na[edge].astype(np.uint8)
BANGS_A = np.zeros((1408, 1408), bool); _x, _y, _w, _h = META['bangs']['rect']; BANGS_A[_y:_y + _h, _x:_x + _w] = im[..., 3] > 128
save('bangs', im, w)
# ---------------- 侧发（画面左）----------------
im, w = load('side_L'); a = im[..., 3] > 128
slit = ndi.binary_closing(np.pad(a, 20), disk(9))[20:-20, 20:-20] & ~a & box(a.shape, 110, 120, 300, 640)          # b②：中间的缝
slit &= ndi.binary_fill_holes(a | slit) ; l, n = ndi.label(slit); sz = ndi.sum(slit, l, range(1, n + 1)) if n else []
slit = np.isin(l, [i + 1 for i in range(n) if sz[i] >= 40])
semi_edge = ndi.binary_dilation(slit, disk(3)) & a & (im[..., 3] < 250)
nearest_fill(im, w, slit | semi_edge, a & (lum(im) > 190) & ~ndi.binary_dilation(slit, disk(4))); im[slit | semi_edge, 3] = 255; log['b 侧发中间的缝补上的像素'] = int(slit.sum())
# d：接头处的外描边。接头 = 外沿上从「帽下发根」换到「原图可见部分」的那一行；原图的外描边在这一行上下 20 来行里是发灰的（亮度 60–90，再往下才是近黑），
#    发根那段是我画的近黑，两段接起来就是一小块灰、看着像折了一下。接头上 12 行到下 44 行，外沿 10px 一律画成近黑。
a = im[..., 3] > 128; v = vis('side_L'); L = lum(im)
xl = np.array([np.where(a[y])[0].min() if a[y].any() else -1 for y in range(a.shape[0])])
yj = next(y for y in range(120, a.shape[0] - 3) if all(xl[y + k] >= 0 and v[y + k, xl[y + k]:xl[y + k] + 3].all() for k in range(3)))
n_d = 0
for y in range(yj - 12, yj + 45):
    seg = im[y, xl[y]:xl[y] + 10]; n_d += int((lum(seg[None])[0] > 40).sum()); seg[:, :3] = LINE; seg[:, 3] = 255
log['d 接头行（侧发片内 y）'] = int(yj); log['d 外沿改成近黑的像素'] = n_d
save('side_L', im, w)
# ---------------- 侧发（画面右）----------------
im, w = load('side_R'); a = im[..., 3] > 128; v = vis('side_R'); L = lum(im)
_x, _y, _w, _h = META['side_R']['rect']; under = ndi.binary_erosion(BANGS_A[_y:_y + _h, _x:_x + _w], disk(3)); YY = np.mgrid[0:a.shape[0], 0:a.shape[1]][0]
v = v & ~under                                                                  # 正面时被刘海片盖住的也算看不见：交界那条发丝线刘海片上有一条，侧发上不留第二条（转头错开后成了双线）
hid = a & ~v & (YY < 430)                   # c①：片子上半、原图里看不见的部分（帽子、别针、刘海底下），都是延伸出来的
d = ndi.distance_transform_edt(~v); t = np.clip((d - 1) / 8, 0, 1) * np.clip((430 - YY) / 50, 0, 1)              # 离可见部分 1px 起淡，9px 处完全淡成浅色——发丝线在这里收成一个尖
light = a & (L > 215); k = ndi.gaussian_filter(light.astype(float), 14) + 1e-6
smooth = np.dstack([ndi.gaussian_filter(np.where(light, im[..., c], 0).astype(float), 14) / k for c in range(3)])
rim = ndi.binary_dilation(~ndi.binary_fill_holes(a), disk(11)) & (L < 80)        # 外轮廓的近黑描边不动
tgt = hid & ~rim; tt = t[..., None]
# 可见部分最上面 90px（紧挨别针下沿）：发丝线在这里是从去帽图来的，发糊、起头是一团——往上渐渐淡出，线头收成尖的
HAT = np.zeros((1408, 1408), bool); _ha = np.asarray(Image.open(paths.S('head', 'hat.png')).convert('RGBA'))[..., 3] > 128; HAT[86:86 + _ha.shape[0], 127:127 + _ha.shape[1]] = _ha          # 帽子片（含别针）在头部母版里的位置：部件表里的 [517, 222] 减去头部母版原点 [390, 136]
_x, _y, _w, _h = META['side_R']['rect']; hat_l = HAT[_y:_y + _h, _x:_x + _w]
top_hid = np.maximum.accumulate(np.where(a & hat_l, YY, -1), axis=0); dv = np.where(top_hid >= 0, YY - top_hid, 999)
out = im[..., :3] * (1 - tt) + smooth * tt; im[tgt, :3] = np.clip(out[tgt], 0, 255).astype(np.uint8); log['c 侧发发根淡成浅色的像素（原来不是浅色的）'] = int((tgt & (t > 0.05) & (L <= 215)).sum())
# 收尖的做法：越靠近别针，只留线里越暗的芯（亮度门槛从 215 降到 95），其余换成浅色——线越往上越细，到头是个尖，不是一团淡影
TAPER = 90; u = np.clip(dv / TAPER, 0, 1) ** 0.6; thr = 95 + (215 - 95) * u; L = lum(im)
k2 = np.clip((L - thr) / 14 + 0.5, 0, 1) * (dv < TAPER) * (YY < 430); tap = a & ~rim & (k2 > 0) & (L <= 222)
out = im[..., :3] * (1 - k2[..., None]) + smooth * k2[..., None]; im[tap, :3] = np.clip(out[tap], 0, 255).astype(np.uint8); log['c 侧发线头收尖改的像素'] = int((tap & (k2 > 0.5)).sum())
save('side_R', im, w)
print(json.dumps(log, ensure_ascii=False, indent=1))
