#!/usr/bin/env python3
"""第 1 步 脸底 + 眉、鼻、嘴的去边清理（#1157）。

  python3 build_face.py --source <角色来源目录> --work <中间产物目录>

输入：<work>/parts/ 里拆出来的脸部部件（split_head.py 的产物）和 <source>/head/rig.json（只读，不改）。
输出：<source>/face/ 的 face.png、face_noblush.png、blush.png、browL/R.png、nose.png、mouth_closed.png、face.json；
  三个张嘴口型的去边版写到 <work>/face/mouth_old/（成品由 mouth_build.py 重画，它要从这里读画布尺寸）；调试掩膜 <work>/face/_dbg_masks.npy。
坐标：rig 空间 = head_master 像素 + HEAD_ORG(390,136)；部件 PNG 与 head_master 1:1，rect 沿用 rig.json 的 [x, y, w, h]（rig 空间）。

为什么不重新生图：现有脸底（拆件得到的 face.png，来自 40 步的光头版）形状、轮廓线、耳朵、腮红都是对的，毛病是五官被抹掉的地方
留着低对比的残影（把局部对比度拉大 8 倍能看到两道眉弧、眼眶的一圈圈、鼻头的红点、嘴的一小横）。皮肤是很平滑的色面，
所以用「可信皮肤像素的平滑外推」重建整块皮肤，比让模型重画更干净，而且线条、颜色一个像素都不会跑。

脸底的做法：
  1. 内部区 I = 不透明、离深色轮廓线 ≥ 10 px、不在耳朵里。
  2. 五官占位 E = 把眉、睫毛、眼白、虹膜、下睫毛点、鼻、四个口型的不透明范围放到脸上，向外扩 26 px。
  3. 腮红区 Bz = 脸下半部偏红（Lab 的 a 比周围高）的两块，取最大的两个连通块再外扩。
  4. 皮肤底 base = 在「I 去掉 E 和 Bz」这些可信像素上做归一化高斯平滑（σ=70），外推到整个 I。
  5. 腮红 = 原图 − base。每块腮红用看得见的皮肤像素拟合一个椭圆高斯，整块腮红用拟合值（母版里腮红的上缘压在眼睛底下）；看得见的像素上的细节（排线 ///）加回去。
  6. 结果 = base + 腮红；离轮廓线 3–7 px 之间过渡回原图（保住线的抗锯齿），耳朵整块用原图。
五官部件的清理：
  - 通用去边：把不透明核心收 1 px，边缘像素的颜色换成最近的核心颜色，再做 0.7 px 羽化——去掉浅色的肤色镶边。
  - 四个口型：外圈 6 px 以内像皮肤的像素直接去掉（现有的口型带一圈肤色边）。
  - 下睫毛点：只保留深褐色的连通块（现有的带一两个青色小碎屑）。
"""
import json, os, sys
import numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 S、W 已经是别的变量名（画布边长、宽度），所以换个名字引
from scipy import ndimage as ndi
HEAD_ORG = (390, 136)
RIG = json.load(open(SRC('head/rig.json'), encoding='utf-8')); P = {p['id']: p for p in RIG['parts']}
os.makedirs(SRC('face'), exist_ok=True)
OPEN_MOUTHS = ('mouth_small', 'mouth_big', 'mouth_smile')          # 这三个的成品由 mouth_build.py 画，这里的去边版只当中间产物
def dst(n): return WK('face/mouth_old', n + '.png') if n in OPEN_MOUTHS else SRC('face', n + '.png')
FEATURES = ['browL', 'browR', 'lashL', 'lashR', 'eyeWhiteL', 'eyeWhiteR', 'irisL', 'irisR', 'eyeHlL', 'eyeHlR', 'eyeLowL', 'eyeLowR', 'nose', 'mouth_closed', 'mouth_small', 'mouth_big', 'mouth_smile']
def load(n): return cv2.imread(WK('parts', n + '.png'), cv2.IMREAD_UNCHANGED)
def lab(bgr): return cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2Lab)
def unlab(L): return np.clip(cv2.cvtColor(L.astype(np.float32), cv2.COLOR_Lab2BGR) * 255, 0, 255).astype(np.uint8)
def nconv(img, w, sigma):
    """归一化卷积：只用权重 w>0 的像素做高斯平滑，结果外推到全图。"""
    num = cv2.GaussianBlur(img * w[..., None], (0, 0), sigma); den = cv2.GaussianBlur(w, (0, 0), sigma)
    return num / np.maximum(den[..., None], 1e-6), den

# ---------------------------------------------------------------- 脸底
f = load('face'); fr = P['face']['rect']; H, W = f.shape[:2]
bgr, al = f[..., :3], f[..., 3]
hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
line = (hsv[..., 2] < 110) & (al > 128)                                   # 深色轮廓线
dist_line = cv2.distanceTransform((~line).astype(np.uint8), cv2.DIST_L2, 5)
solid = al > 250
yy, xx = np.mgrid[0:H, 0:W]
# 耳朵：头的主体是最宽处以内的部分；按每行不透明范围估头的左右缘，耳朵是伸出脸缘之外、带内耳深色的两块——用列范围框出来
# 耳朵：逐行看不透明范围的左右边界，耳朵所在的行（约 y 505–738）边界突然向外跳。取耳朵上、下两行的脸缘连一条直线当「没有耳朵时的脸缘」，
# 直线以外的就是耳朵（含耳朵里面的粉色）。试过两种别的办法都不行：竖条框会把贴着耳朵的一条脸颊也框进去（睫毛外眼角的残影留在里面）；
# 按轮廓线切连通块不行，因为耳朵和脸颊之间的线不闭合，耳朵和脸是连着的。
left = np.array([np.where(solid[y])[0].min() if solid[y].any() else W for y in range(H)]); right = np.array([np.where(solid[y])[0].max() if solid[y].any() else 0 for y in range(H)])
d4 = np.abs(left[4:].astype(int) - left[:-4].astype(int)); jump = np.where(d4 > 8)[0]; jump = jump[(jump > H * 0.4) & (jump < H * 0.9)]   # 4 行之内边界挪了 8 px 以上 = 耳朵的上沿或下沿（下沿是斜着收回来的，单行跳变抓不到）
ey0, ey1 = int(jump.min()) - 2, int(jump.max()) + 10
lx = np.interp(yy[:, 0], [ey0, ey1], [left[ey0], left[ey1]]); rx = np.interp(yy[:, 0], [ey0, ey1], [right[ey0], right[ey1]])
ear = solid & (yy >= ey0) & (yy <= ey1) & ((xx < lx[:, None] + 4) | (xx > rx[:, None] - 4))
print('ear rows', ey0, ey1, 'ear px', int(ear.sum()))
I = solid & (dist_line >= 10) & ~ear
E = np.zeros((H, W), bool); foot = {}
for n in FEATURES:
    im = load(n); r = P[n]['rect']; x0, y0 = int(round(r[0] - fr[0])), int(round(r[1] - fr[1]))
    m = np.zeros((H, W), bool); h_, w_ = im.shape[:2]
    ys, xs = slice(max(0, y0), min(H, y0 + h_)), slice(max(0, x0), min(W, x0 + w_))
    m[ys, xs] = im[ys.start - y0:ys.stop - y0, xs.start - x0:xs.stop - x0, 3] > 20
    foot[n] = m; E |= m
E = ndi.binary_dilation(E, iterations=26)
L = lab(bgr)
base0, _ = nconv(L, (I & ~E).astype(np.float32), 70)
da = L[..., 1] - base0[..., 1]
red = I & ~E & (da > 1.2) & (yy > H * 0.5)
lb, k = ndi.label(ndi.binary_opening(red, iterations=3))
sz = ndi.sum(red, lb, range(1, k + 1)); keep = np.argsort(sz)[::-1][:2] + 1
Bz = np.zeros((H, W), bool)
for i in keep:
    pts = np.argwhere(lb == i)[:, ::-1].astype(np.int32); hull = cv2.convexHull(pts); cv2.fillConvexPoly(tmp := np.zeros((H, W), np.uint8), hull, 1); Bz |= tmp > 0
Bz = ndi.binary_dilation(Bz, iterations=28) & solid
T = (I & ~E & ~Bz).astype(np.float32)
base, den = nconv(L, T, 70)
delta = L - base
# 腮红被眼睛挡住的上半部分：不能只靠邻近像素外推（第一版这么做，腮红被压成扁扁一条）。
# 每块腮红拟合一个椭圆高斯：在种子块周围的窗口里，用看得见的皮肤像素（I 去掉 E）的 a 通道偏移拟合 A·exp(−…)，
# 再把拟合出来的形状乘上「单位 a 偏移对应的 Lab 偏移方向」，填到被 E 盖住的地方。看得见的像素保持原值（排线保留）。
from scipy.optimize import least_squares
dlt = np.zeros_like(L); Bfit = np.zeros((H, W), np.float32); blush_fit = []
for i in keep:
    ys_, xs_ = np.where(lb == i); cx0, cy0 = xs_.mean(), ys_.mean()
    x0w, x1w, y0w, y1w = int(max(0, cx0 - 190)), int(min(W, cx0 + 190)), int(max(0, cy0 - 230)), int(min(H, cy0 + 150))
    win = np.zeros((H, W), bool); win[y0w:y1w, x0w:x1w] = True
    tr = win & I & ~E
    X, Y, A_ = xx[tr].astype(np.float64), yy[tr].astype(np.float64), delta[..., 1][tr].astype(np.float64)
    sub = np.random.default_rng(7).choice(len(X), min(len(X), 20000), replace=False)
    def g(p, x, y): return p[0] * np.exp(-((x - p[1]) ** 2 / (2 * p[3] ** 2) + (y - p[2]) ** 2 / (2 * p[4] ** 2)))
    fit = least_squares(lambda p: g(p, X[sub], Y[sub]) - A_[sub], [float(np.clip(np.percentile(A_, 99.5), 1, 29)), cx0, cy0 - 30, 70, 70], bounds=([0.5, cx0 - 80, cy0 - 140, 30, 30], [30, cx0 + 80, cy0 + 60, 160, 160]))
    pf = fit.x; G = g(pf, xx.astype(np.float64), yy.astype(np.float64)).astype(np.float32)
    strong = tr & (delta[..., 1] > 0.5 * pf[0] * 0.5)
    dirv = np.array([np.sum(delta[..., c][strong] * delta[..., 1][strong]) / np.sum(delta[..., 1][strong] ** 2) for c in range(3)], np.float32)   # 每单位 a 偏移对应的 (L, a, b) 偏移
    zone = (G > 0.04 * pf[0]) & solid
    fitted = G[..., None] * dirv[None, None, :]
    # 整块腮红都用拟合出来的椭圆高斯，只把看得见的像素上的细节（排线）加回去：
    # 旧脸底在眼睛下缘留着一片向上抹开的粉色（上一次抹五官时带出来的），直接沿用真实像素会在五官占位的边界上留一条平直的台阶。
    use_real = zone & I & ~ndi.binary_dilation(E, iterations=6)
    detail = (delta - cv2.GaussianBlur(delta, (0, 0), 6)) * cv2.GaussianBlur(use_real.astype(np.float32), (0, 0), 2)[..., None]
    dlt += np.where(zone[..., None], fitted + detail, 0)
    Bfit = np.maximum(Bfit, G / pf[0])
    blush_fit.append({'amp_a': round(float(pf[0]), 2), 'center': [round(float(pf[1]), 1), round(float(pf[2]), 1)], 'sigma': [round(float(pf[3]), 1), round(float(pf[4]), 1)], 'rms_resid_a': round(float(np.sqrt(np.mean(fit.fun ** 2))), 3)})
print('blush fit', blush_fit)
model = base + dlt
# 耳朵和脸颊之间没有线，直接切换会留一道色阶（原图贴着耳朵的皮肤偏青一点）：从耳朵边界往耳朵里 12 px 内渐变
ear_in = cv2.distanceTransform(ear.astype(np.uint8), cv2.DIST_L2, 5)
ear_w = np.clip(ear_in / 12, 0, 1)                                       # 0 = 脸，1 = 完全用原图的耳朵
wgt = np.clip((dist_line - 3) / 4, 0, 1) * (1 - ear_w) * solid
wgt = cv2.GaussianBlur(wgt.astype(np.float32), (0, 0), 1.5)[..., None]
outL = L * (1 - wgt) + model * wgt
clean = unlab(outL)
cv2.imwrite(SRC('face/face.png'), np.dstack([clean, al]))
# 腮红单独一层 + 不带腮红的脸底
nob = unlab(L * (1 - wgt) + base * wgt); cv2.imwrite(SRC('face/face_noblush.png'), np.dstack([nob, al]))
bl_a = np.clip(np.linalg.norm(dlt, axis=2) / 6.0, 0, 1) * wgt[..., 0]            # 腮红层的透明度：按色差大小给
bl_rgb = unlab(base + dlt / np.maximum(bl_a, 0.15)[..., None])                    # 颜色做了反预乘，叠回去近似等于带腮红的脸底
ys, xs = np.where(bl_a > 0.02); bx = [int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]
cv2.imwrite(SRC('face/blush.png'), np.dstack([bl_rgb, (bl_a * 255).astype(np.uint8)])[bx[1]:bx[1] + bx[3], bx[0]:bx[0] + bx[2]])
np.save(WK('face/_dbg_masks.npy'), np.stack([I, E, Bz, ear]).astype(np.uint8))

# ---------------------------------------------------------------- 五官部件
def defringe(im, shrink=1, feather=0.7):
    a = im[..., 3].astype(np.float32) / 255; core = a > 0.6
    if shrink: core = ndi.binary_erosion(core, iterations=shrink)
    if not core.any(): return im
    idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
    rgb = im[..., :3][idx[0], idx[1]]
    na = np.minimum(a, cv2.GaussianBlur(ndi.binary_dilation(core, iterations=1).astype(np.float32), (0, 0), feather))
    return np.dstack([rgb, (np.clip(na, 0, 1) * 255).astype(np.uint8)])
def skinlike(bgr):
    b, g, r = [bgr[..., i].astype(int) for i in range(3)]
    return (r > 200) & (g > 150) & (r > g + 8) & (g > b - 6)
info = {}
for n in FEATURES:
    im = load(n).copy(); note = []
    if n.startswith('mouth'):
        a = im[..., 3] > 20; rim = a & (cv2.distanceTransform(a.astype(np.uint8), cv2.DIST_L2, 5) <= 6) & skinlike(im[..., :3])
        im[..., 3][rim] = 0; note.append(f'去掉外圈肤色边 {int(rim.sum())} px')
        im = defringe(im, 1)
    elif n.startswith('eyeLow'):
        a = im[..., 3] > 40; lb, k = ndi.label(a); v = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)
        drop = 0
        for i in range(1, k + 1):
            m = lb == i; hue, sat, val = [float(v[..., c][m].mean()) for c in range(3)]
            if not (val < 150 and (hue < 25 or hue > 160)) or m.sum() < 12: im[..., 3][ndi.binary_dilation(m, iterations=3)] = 0; drop += 1
        note.append(f'去掉非深褐色的碎屑 {drop} 块'); im = defringe(im, 0, 0.6)
    elif n == 'nose': note.append('原样（本来就是一小块带软边的深肤色）')
    elif n.startswith('eyeHl'): im = defringe(im, 0, 0.6)
    elif n.startswith('eyeWhite'): im = defringe(im, 2)
    else: im = defringe(im, 1)
    if n.startswith(('eye', 'iris', 'lash')): info[n] = '眼睛各层由 face/build_eyes.py 生成（#1158），这里不写'; continue
    cv2.imwrite(dst(n), im); info[n] = '；'.join(note)

# ---------------------------------------------------------------- face.json
DEPTH = {'face': 0.37, 'blush': 0.37, 'eyeWhite': 0.60, 'lash': 0.60, 'eyeLow': 0.60, 'iris': 0.70, 'eyeHl': 0.70, 'brow': 0.75, 'mouth': 0.75, 'nose': 1.0}
def dep(n):
    for k, v in DEPTH.items():
        if n.startswith(k): return v
order = ['face', 'blush', 'nose', 'eyeWhiteL', 'irisL', 'eyeHlL', 'eyeLowL', 'lashL', 'eyeWhiteR', 'irisR', 'eyeHlR', 'eyeLowR', 'lashR', 'mouth_closed', 'mouth_small', 'mouth_big', 'mouth_smile', 'browL', 'browR']
parts = []
for z, n in enumerate(order):
    if n == 'blush': rect = [fr[0] + bx[0], fr[1] + bx[1], bx[2], bx[3]]; src = 'blush.png'; extra = {'optional': True, 'note': '只在用 face_noblush.png 当脸底时才叠；face.png 里已经带腮红'}
    else: rect = P[n]['rect']; src = n + '.png'; extra = {k: P[n][k] for k in ('eye', 'role', 'clip') if k in P[n]}
    parts.append({'id': n, 'src': src, 'z': z, 'rect': rect, 'rect_head_px': [rect[0] - HEAD_ORG[0], rect[1] - HEAD_ORG[1], rect[2], rect[3]], 'depth': dep(n), **extra, **({'cleanup': info[n]} if info.get(n) else {})})
json.dump({'space': 'rect 是 rig 空间（= head_master 像素 + [390,136]），与 parts/rig.json 同约定；rect_head_px 是 head_master 像素',
           'head_org': list(HEAD_ORG), 'order': '按 z 从下到上叠；四个口型同一时刻只画一个；虹膜和高光要裁在同侧眼白里（clip）',
           'depth': '起步值（W4 给的）：脸 0.37、眼眶和睫毛 0.60、虹膜和高光 0.70、眉和嘴 0.75、鼻 1.0',
           'face_variants': {'face.png': '带腮红的干净脸底', 'face_noblush.png': '不带腮红', 'blush.png': '单独的腮红层，叠在 face_noblush 上'},
           'parts': parts}, open(SRC('face/face.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', len(parts), 'blush rect', bx, 'E px', int(E.sum()), 'Bz px', int(Bz.sum()))
