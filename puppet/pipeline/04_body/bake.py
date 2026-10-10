#!/usr/bin/env python3
"""身体部件母版的烘焙（#1154，用法 B）。
  python3 bake.py --source <角色来源目录> --work <中间产物目录>

输入（都在 --source 下）
  master/pose_idle_f.png            待机母版（1104×1472），坐标系 pose_idle_f_px
  body/inputs/seethrough/<层>.png   See-through 对「母版只裁脖子以下」拆出的各层（1024²）和 <层>_depth.png；模型产物，不可重跑
  body/inputs/top_patch.png         领口补丁（从补脖子那张改图里取的几块，没有留下脚本）；有就用，不可重跑
输入（在 --work 下）
  body/retouch/<名>.png             retouch_apply.py 的产物；存在就整层替换对应的层（第一遍烘焙时还没有）
规则
  母版里看得见的像素一律从母版取；See-through 只提供 alpha 和被遮挡部分的像素。
  被遮挡部分的颜色按色块对到母版（不做整体调色——姿势库烘焙时统一调）。
输出
  <source>/body/<名>.png        裁到包围盒的小图（成品）
  <source>/body/body.json       层序、矩形、锚点、每层的可见 / 补全像素数（成品）
  <work>/body/full/<名>.png     整幅画布版（1104×1472，和姿势库同对位；验收和改图输入用，body.json 的 full 字段指的就是它）
  <work>/body/labels.npy        每个像素在母版里属于哪一层（验收用）
  <work>/body/head_standin.png  头的替身（验收用）
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import paths; from paths import S, rest; from poses_lib import bg_mask, register
WK = paths.W          # 本文件里 W 是画布宽，中间产物目录的函数另起名

ST = S('body/inputs/seethrough') + '/'
CROP = (212, 640, 892, 1420)          # 喂给 See-through 的裁切框（母版像素）
K = 1024 / 780                        # 裁切图居中补成 780 方图后缩到 1024
PADX = (780 - (CROP[2] - CROP[0])) // 2
W, H = 1104, 1472
OUT = S('body') + '/'; FULL = os.path.dirname(WK('body/full/x')) + '/'; WORK = os.path.dirname(WK('body/x')) + '/'; INP = S('body/inputs') + '/'; os.makedirs(OUT, exist_ok=True)

master = np.asarray(Image.open(S('master/pose_idle_f.png')).convert('RGB'))
bg = bg_mask(master, tol=14)
FG = ~bg


def st_layer(tag):
    """See-through 的一层 → 母版坐标的 RGBA（float，alpha 0..1）。"""
    im = np.asarray(Image.open(ST + tag + '.png').convert('RGBA')).astype(np.float32)
    im[..., :3] *= im[..., 3:4] / 255.          # 预乘后再缩，边缘不带进透明处的杂色
    M = np.float32([[1 / K, 0, CROP[0] - PADX], [0, 1 / K, CROP[1]]])
    w = cv2.warpAffine(im, M, (W, H), flags=cv2.INTER_AREA)
    a = w[..., 3] / 255.
    rgb = np.where(a[..., None] > 1e-3, w[..., :3] / np.maximum(a[..., None], 1e-3), 0)
    dp = os.path.join(ST, tag + '_depth.png')
    DEPTH[tag] = cv2.warpAffine(np.asarray(Image.open(dp).convert('L')).astype(np.float32), M, (W, H), flags=cv2.INTER_AREA, borderValue=255) if os.path.exists(dp) else np.full((H, W), 255, np.float32)
    return np.clip(rgb, 0, 255), a


DEPTH = {}                                          # See-through 的伪深度（小 = 靠前）


def components(mask, n):
    """面积最大的 n 个连通域，按 x 从左到右。"""
    num, cc, stats, cen = cv2.connectedComponentsWithStats(mask.astype(np.uint8), connectivity=8)
    order = np.argsort(stats[1:, cv2.CC_STAT_AREA])[::-1][:n] + 1
    order = sorted(order, key=lambda i: cen[i][0])
    return [cc == i for i in order]


def skin_mask(rgb):
    lab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.int16)
    return (lab[..., 0] > 150) & (lab[..., 1] > 133) & (lab[..., 2] > 133)   # 亮、偏红偏黄 = 肤色；白袜和白袖不算


# ---------- 1. 取各层，拆左右、拆手 ----------
src = {}                                           # 名字 → (rgb, alpha)
rgb, a = st_layer('legwear')
solid = a > 0.5
# 两条腿在大腿根可能连着：按两腿之间那条竖缝的 x 切
cols = solid[int(np.where(solid.any(1))[0].mean()):].sum(0).astype(np.float32)
xs = np.where(solid.any(0))[0]; mid = (xs.min() + xs.max()) // 2
gap = mid - 15 + int(np.argmin(cols[mid - 15: mid + 15]))
left = np.zeros((H, W), bool); left[:, :gap] = True
# 切口两边可能留下对面那条腿的一丝描边：右腿取切口右侧开运算后的最大块，其余都归左腿
r_core = components(cv2.morphologyEx((solid & ~left).astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)) > 0, 1)[0]
right = (cv2.dilate(r_core.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0) & ~left
src['legL'] = (rgb, a * ~right); src['legR'] = (rgb, a * right)
DEPTH['legL'] = DEPTH['legR'] = DEPTH['legwear']

rgb, a = st_layer('footwear')
cl, cr = components(a > 0.5, 2)
grow = lambda m: cv2.dilate(m.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
src['shoeL'] = (rgb, a * grow(cl)); src['shoeR'] = (rgb, a * grow(cr))
DEPTH['shoeL'] = DEPTH['shoeR'] = DEPTH['footwear']

src['neck'] = st_layer('neck')
src['skirt'] = st_layer('bottomwear'); DEPTH['skirt'] = DEPTH['bottomwear']
src['top'] = st_layer('topwear'); DEPTH['top'] = DEPTH['topwear']

rgb, a = st_layer('handwear')
CUFF = {}
al, ar = components(a > 0.5, 2)
for side, comp in (('L', al), ('R', ar)):
    comp = grow(comp) & (a > 0.3)
    # 手 = 沿手臂方向越过袖口的那一段。袖口是一条粗的藏青带（描边只有约 3px，腐蚀掉）
    ys, xs = np.where(comp)
    top = np.array([xs[ys < ys.min() + 25].mean(), ys.min() + 12.])               # 肩头
    far = np.argmax((xs - top[0]) ** 2 + (ys - top[1]) ** 2); tip = np.array([xs[far], ys[far]], np.float64)
    u = (tip - top) / np.linalg.norm(tip - top)                                    # 肩 → 拳头
    proj = (np.indices((H, W))[1] - top[0]) * u[0] + (np.indices((H, W))[0] - top[1]) * u[1]
    lab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.int16)
    navy = comp & (lab[..., 0] < 95)
    band = cv2.erode(navy.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
    cuff_end = float(proj[band].max()) + 3.5                                       # 腐蚀掉的 3px 加回来
    hand = comp & (proj > cuff_end - 1)
    CUFF[side] = {'top': top.tolist(), 'u': u.tolist(), 'end': cuff_end}
    src['hand' + side] = (rgb, a * hand)
    src['armIdle' + side] = (rgb, a * (comp & (proj <= cuff_end + 1)))             # 接缝处两层各多留 1px
    DEPTH['hand' + side] = DEPTH['armIdle' + side] = DEPTH['handwear']

# 头的替身：这一轮里 See-through 认成头发 / 头的部分 + 母版里没人认领的前景
head_a = np.zeros((H, W), np.float32)
for t in ('front hair', 'back hair', 'head'):
    head_a = np.maximum(head_a, st_layer(t)[1])

ORDER = ['legL', 'legR', 'shoeL', 'shoeR', 'neck', 'skirt', 'top', 'handL', 'handR', 'armIdleL', 'armIdleR']
LID = {n: i + 1 for i, n in enumerate(ORDER)}        # labels.npy 里的编号
Z = {'collarBack': 30, 'legL': 10, 'legR': 11, 'shoeL': 20, 'shoeR': 21, 'neck': 40, 'skirt': 50, 'top': 60,
     'handL': 80, 'handR': 81, 'armIdleL': 90, 'armIdleR': 91}

# ---------- 2. 母版里每个像素归哪一层 ----------
label = np.zeros((H, W), np.int16)                 # 0 = 背景，1.. = ORDER，99 = 头
for i, n in enumerate(ORDER):                      # 默认按层序：后画的盖住先画的
    label[src[n][1] > 0.5] = i + 1
# 例外只有一对：上衣（领子）和手臂。母版里领子压着袖子的肩头，用 See-through 的伪深度判断这一块谁在前
ti0 = ORDER.index('top') + 1
for n in ('armIdleL', 'armIdleR'):
    m = (src['top'][1] > 0.5) & (src[n][1] > 0.5) & (DEPTH['top'] < DEPTH[n])
    label[m] = ti0
label[head_a > 0.5] = 99                            # 头（头发、下巴）永远在身体各层前面；它和脖子之间的伪深度不可靠
label[: CROP[1] + 4] = 99                           # 裁切框以上全是头
label[bg] = 0
# 前景里没人认领的像素：就近归给最近的一层（See-through 的轮廓和母版差 1–3 px）
un = FG & (label == 0)
dist, idx = cv2.distanceTransformWithLabels((label == 0).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
ys0, xs0 = np.where(label > 0)
lut = np.zeros(idx.max() + 1, np.int16)
lut[idx[ys0, xs0]] = label[ys0, xs0]
near = lut[idx]
label[un] = near[un]
np.save(WORK + 'labels.npy', label)

# ---------- 3. 逐层合成：可见处取母版，被挡处取 See-through（色块对色） ----------
mlab = cv2.cvtColor(master, cv2.COLOR_RGB2LAB).astype(np.float32)
occ = FG & (label > 0)                              # 母版里有东西的地方
meta = {}
for i, n in enumerate(ORDER):
    rgb, a = src[n]
    vis = label == i + 1
    # 被挡的部分：See-through 说这层在这里、而母版里这里是别的层
    hid = (a > 0.5) & occ & ~vis
    hid = cv2.morphologyEx(hid.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    # 只留和可见部分连着的、或者够大的被挡块（去掉零星噪点）
    num, cc, stats, _ = cv2.connectedComponentsWithStats((vis | hid).astype(np.uint8), connectivity=8)
    keep = np.isin(cc, [j for j in range(1, num) if stats[j, cv2.CC_STAT_AREA] > 150])
    vis &= keep; hid &= keep
    shape = vis | hid

    # 色块对色：把这层按颜色聚成几类，每类用「可见处母版均值 − See-through 均值」平移
    slab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    core = cv2.erode(vis.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    pts = slab[shape]
    kk = min(4, max(1, len(pts) // 500))
    fixed = slab.copy()
    if len(pts) > 50:
        _, lab_k, cen = cv2.kmeans(pts[::3].astype(np.float32), kk, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1), 3, cv2.KMEANS_PP_CENTERS)
        cl = np.argmin(((slab[..., None, :] - cen[None, None]) ** 2).sum(-1), -1)
        glob = (mlab[core].mean(0) - slab[core].mean(0)) if core.sum() > 200 else np.zeros(3)
        for c in range(kk):
            m = core & (cl == c)
            shift = (mlab[m].mean(0) - slab[m].mean(0)) if m.sum() > 200 else glob
            fixed[cl == c] += np.clip(shift, -25, 25)
    st_rgb = cv2.cvtColor(np.clip(fixed, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)

    w_vis = cv2.GaussianBlur(vis.astype(np.float32), (0, 0), 1.2)       # 交界处羽化
    w_vis = np.where(vis, np.maximum(w_vis, 0.5), np.minimum(w_vis, 0.5))
    w_vis = np.clip((w_vis - 0.25) / 0.5, 0, 1)[..., None]
    col = master * w_vis + st_rgb * (1 - w_vis)

    alpha = cv2.GaussianBlur(shape.astype(np.float32), (0, 0), 0.7)
    alpha = np.where(shape, np.maximum(alpha, 0.55), alpha)
    alpha = np.clip((alpha - 0.2) / 0.6, 0, 1)
    # 去晕边：贴着母版背景的最外 2px，颜色用往里 2px 的颜色（母版那里混了背景灰）
    inner = cv2.erode(shape.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    rim = (alpha > 0) & ~inner & (cv2.dilate(bg.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)
    if rim.any() and inner.any():
        _, idx2 = cv2.distanceTransformWithLabels((~inner).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
        ys1, xs1 = np.where(inner); lut2 = np.zeros((idx2.max() + 1, 3), np.float32); lut2[idx2[ys1, xs1]] = col[ys1, xs1]
        col[rim] = lut2[idx2[rim]]

    out = np.dstack([np.clip(col, 0, 255), alpha * 255]).astype(np.uint8)
    out[alpha <= 0] = 0
    Image.fromarray(out).save(f'{FULL}{n}.png')
    ys, xs = np.where(alpha > 0.02)
    x0, y0, x1, y1 = max(0, xs.min() - 4), max(0, ys.min() - 4), min(W, xs.max() + 5), min(H, ys.max() + 5)
    Image.fromarray(out[y0:y1, x0:x1]).save(f'{OUT}{n}.png')
    meta[n] = {'name': n, 'file': f'{n}.png', 'full': f'full/{n}.png', 'z': Z[n], 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
               'visiblePx': int(vis.sum()), 'completedPx': int(hid.sum()), 'source': 'master + seethrough(bodycrop)'}
    print(f'{n:9s} rect {meta[n]["rect"]} 可见 {vis.sum():6d} 补全 {hid.sum():6d}')

# 腿：补出来的大腿（被裙子挡住）是偏深的肤色，Lab 约 186/149/148。量过以后发现它不是补错了：
# 母版里裙摆正下方本来就有一条约 25px 高的裙子投影，颜色是 183/150/148，再往下才是亮的肤色 225/138/144。
# 也就是说「上深下浅」的分界线在母版的可见像素里（裙摆下 25px 处），补出来的大腿和这条投影是连续的。
# 这里只做一件事：把补出来的肤色对到紧挨着它的那圈可见肤色（即投影带），保证裙摆处没有台阶；母版像素不动。
def _skin(l):
    return (l[..., 0] > 140) & (l[..., 1] > 131) & (l[..., 2] > 131) & (np.hypot(l[..., 1] - 128, l[..., 2] - 128) > 7)


for n in ('legL', 'legR'):
    im = np.asarray(Image.open(f'{FULL}{n}.png')).copy(); a_ = im[..., 3] > 127
    l_ = cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    vis_ = a_ & (label == LID[n]); sk = a_ & _skin(l_)
    hid_s, vis_s = sk & ~vis_, sk & vis_
    d_to_hid = cv2.distanceTransform((~hid_s).astype(np.uint8), cv2.DIST_L2, 5)        # 可见像素到补全区的距离
    d_to_vis = cv2.distanceTransform((~vis_s).astype(np.uint8), cv2.DIST_L2, 5)        # 补全像素到可见区的距离
    near = vis_s & (d_to_hid < 40)                                                     # 紧挨着的那一圈可见肤色当基准
    ref, cur = np.median(l_[near], 0), np.median(l_[hid_s], 0)
    k = min(1.0, float(l_[near][:, 0].std() / max(1e-3, l_[hid_s][:, 0].std())))       # 明暗起伏不放大
    fixed = l_.copy(); fixed[hid_s] = ref + (l_[hid_s] - cur) * k
    # 渐变：离可见区 25px 以内，从「正上方那圈可见肤色的实际均值」过渡到对齐后的颜色，避免留一条线
    w_ = np.clip(d_to_vis / 25.0, 0, 1)[..., None]
    edge_mean = np.median(l_[vis_s & (d_to_hid < 8)], 0)
    fixed[hid_s] = (edge_mean * (1 - w_) + fixed * w_)[hid_s]
    # 补全一侧贴着交界的 10px 再做一次只在肤色内部的模糊，抹掉残余的台阶
    band = hid_s & (d_to_vis < 10)                                                      # 只动补出来的一侧
    m_ = sk.astype(np.float32)[..., None]
    blur = cv2.GaussianBlur(fixed * m_, (0, 0), 4) / np.maximum(cv2.GaussianBlur(m_, (0, 0), 4)[..., None], 1e-3)
    fixed[band] = blur[band]
    im[..., :3] = np.where(sk[..., None], cv2.cvtColor(np.clip(fixed, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB), im[..., :3])
    Image.fromarray(im).save(f'{FULL}{n}.png')
    x0, y0, w0, h0 = meta[n]['rect']; Image.fromarray(im[y0:y0 + h0, x0:x0 + w0]).save(f'{OUT}{n}.png')
    after = cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    meta[n]['thighToneFix'] = {'before': cur.round(1).tolist(), 'target': ref.round(1).tolist(), 'after': np.median(after[hid_s], 0).round(1).tolist()}
    print(f'{n:9s} 大腿肤色 {cur.round(0)} → {np.median(after[hid_s], 0).round(0)}（基准 {ref.round(0)}）')

# 上衣的收边（不用改图）：See-through 补出来的两侧是没有描边的白边，这里沿外轮廓补一圈和别处一样的深色描边；
# 领口尖角处混进来的几粒下巴肤色去掉。两次 8 步改图都把护胸 / 腰带改坏了，所以改成确定性的做法。
t = np.asarray(Image.open(f'{FULL}top.png')).copy()
ta = t[..., 3] > 127
tl = cv2.cvtColor(t[..., :3], cv2.COLOR_RGB2LAB).astype(np.int16)
skin = ta & (tl[..., 0] > 170) & (tl[..., 1] > 134) & (tl[..., 2] > 136) & (np.indices((H, W))[0] < 725)
t[skin] = 0; ta &= ~skin
dark = t[..., :3][ta & (tl[..., 0] < 55)]
line = np.median(dark, 0).astype(np.uint8)                                   # 这件衣服自己的描边色
smooth = cv2.GaussianBlur(ta.astype(np.float32), (0, 0), 1.5) > 0.5              # 先把轮廓抹平一点，线才不抖
cs, _ = cv2.findContours(smooth.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
stroke = np.zeros((H, W), np.uint8); cv2.drawContours(stroke, cs, -1, 255, thickness=7, lineType=cv2.LINE_AA)   # 轮廓线内外各约 3px
light = cv2.erode((tl[..., 0] > 110).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0      # 这一带原来不是深色 = 没有描边
zone = cv2.dilate((light & ta & (stroke > 0)).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
w_line = (stroke.astype(np.float32) / 255.) * zone * ta
t[..., :3] = (t[..., :3] * (1 - w_line[..., None]) + line * w_line[..., None]).astype(np.uint8)
need = w_line > 0.5
pp = INP + 'top_patch.png'                                        # 补脖子那张改图顺带重画了领口：只取上衣缺的那几块（领子上缘的缺口、领口和脖子之间的缝）
if os.path.exists(pp):
    pt = np.asarray(Image.open(pp)); m = (pt[..., 3] > 127) & (t[..., 3] < 128)
    t[m] = pt[m]; meta['top']['patchedFromNeckEditPx'] = int(m.sum()); print(f'top       领口补丁 {int(m.sum())} px')
Image.fromarray(t).save(f'{FULL}top.png')
ys_, xs_ = np.where(t[..., 3] > 5); meta['top']['rect'] = [int(xs_.min() - 4), int(ys_.min() - 4), int(xs_.max() - xs_.min() + 9), int(ys_.max() - ys_.min() + 9)]
x0, y0, w0, h0 = meta['top']['rect']; Image.fromarray(t[y0:y0 + h0, x0:x0 + w0]).save(f'{OUT}top.png')
meta['top']['outlineAddedPx'] = int(need.sum()); print(f'top       补描边 {int(need.sum())} px，去掉肤色杂点 {int(skin.sum())} px')

# 领子后片 collarBack（确定性画法；8 步改图把它画成了背面视图，见 rejected/）：
# 两个领尖之间、绕到脖子后面的一条藏青弧带。平时被头挡住，头抬起来或转动时露出一点。
ta2 = np.asarray(Image.open(f'{FULL}top.png'))[..., 3] > 127
cx = W // 2 - 8
colsL = [x for x in range(440, cx) if ta2[:, x].any()]; colsR = [x for x in range(cx, 660) if ta2[:, x].any()]
tipL = min(((np.where(ta2[:, x])[0].min(), x) for x in range(480, 530)), default=None)       # 左领尖（最高点）
tipR = min(((np.where(ta2[:, x])[0].min(), x) for x in range(560, 610)), default=None)
(yl, xl), (yr, xr) = tipL, tipR
xs_ = np.arange(xl - 6, xr + 7); u_ = (xs_ - xs_[0]) / (xs_[-1] - xs_[0])
upper = np.interp(u_, [0, 1], [yl + 2, yr + 2]) - 7 * np.sin(np.pi * u_)                   # 上缘略向上拱
lower = upper + 26
cb = np.zeros((H, W), np.uint8)
cv2.fillPoly(cb, [np.int32(np.concatenate([np.stack([xs_, upper], 1), np.stack([xs_[::-1], lower[::-1]], 1)]))], 255, lineType=cv2.LINE_AA)
t3 = np.asarray(Image.open(f'{FULL}top.png'))
navy = t3[..., :3][(t3[..., 3] > 200) & (cv2.cvtColor(t3[..., :3], cv2.COLOR_RGB2LAB)[..., 0] > 45) & (cv2.cvtColor(t3[..., :3], cv2.COLOR_RGB2LAB)[..., 0] < 95)]
fill = (np.median(navy, 0) * 0.78).astype(np.uint8)                                          # 比前片深一点
cbimg = np.zeros((H, W, 4), np.uint8); cbimg[..., :3] = fill; cbimg[..., 3] = cb
edge = np.zeros((H, W), np.uint8); cv2.polylines(edge, [np.int32(np.stack([xs_, upper], 1))], False, 255, 3, cv2.LINE_AA)
cbimg[..., :3] = (cbimg[..., :3] * (1 - edge[..., None] / 255.) + line * (edge[..., None] / 255.)).astype(np.uint8)
cbimg[..., 3] = np.maximum(cbimg[..., 3], (edge * (cb > 0)).astype(np.uint8))
Image.fromarray(cbimg).save(FULL + 'collarBack.png')
ys_, xs2 = np.where(cbimg[..., 3] > 5); x0, y0, x1, y1 = xs2.min() - 4, ys_.min() - 4, xs2.max() + 5, ys_.max() + 5
Image.fromarray(cbimg[y0:y1, x0:x1]).save(OUT + 'collarBack.png')
meta['collarBack'] = {'name': 'collarBack', 'file': 'collarBack.png', 'full': 'full/collarBack.png', 'z': 30, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
                      'visiblePx': 0, 'completedPx': int((cbimg[..., 3] > 127).sum()), 'source': '程序画的弧带（领尖之间），不是生图'}
ORDER.insert(ORDER.index('neck'), 'collarBack')
print(f'collarBack rect {meta["collarBack"]["rect"]} 领尖 L({xl},{yl}) R({xr},{yr})')

# 手腕：把手在袖口切面处的那一圈颜色沿手臂方向往袖子里延伸 24px（藏在袖口里，手臂挪开或换袖子时不露断口）
for side in 'LR':
    hp = f'{FULL}hand{side}.png'; hnd = np.asarray(Image.open(hp)).copy(); c = CUFF[side]
    top_, u = np.array(c['top']), np.array(c['u']); yy_, xx_ = np.indices((H, W))
    proj = (xx_ - top_[0]) * u[0] + (yy_ - top_[1]) * u[1]
    band = (proj > c['end'] - 25) & (proj <= c['end'] + 3)
    back = (c['end'] + 5) - proj                                                           # 往拳头方向退到切面外 3px 处取色
    sx = np.clip(np.round(xx_ + u[0] * back), 0, W - 1).astype(np.int32); sy = np.clip(np.round(yy_ + u[1] * back), 0, H - 1).astype(np.int32)
    arm_in = cv2.erode((np.asarray(Image.open(f'{FULL}armIdle{side}.png'))[..., 3] > 127).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
    ext = hnd[sy, sx]; m = band & (ext[..., 3] > 200) & (hnd[..., 3] < 250) & (arm_in | ((proj > c['end'] - 6) & FG))   # 紧挨拳头的 6px 不裁，免得和拳头之间留缝     # 只留藏在袖口里面的部分，不许比袖口宽
    hnd[m] = ext[m]; Image.fromarray(hnd).save(hp)
    ys_, xs2 = np.where(hnd[..., 3] > 5); x0, y0, x1, y1 = xs2.min() - 4, ys_.min() - 4, xs2.max() + 5, ys_.max() + 5
    Image.fromarray(hnd[y0:y1, x0:x1]).save(f'{OUT}hand{side}.png')
    meta['hand' + side].update({'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'wristExtendedPx': int(m.sum())})
    print(f'hand{side}     手腕延伸 {int(m.sum())} px')

# 改图补过的层：<work>/body/retouch/<名>.png 存在就整层替换（由 retouch_apply.py 生成）
for n in ORDER:
    rp = f'{WORK}retouch/{n}.png'
    if os.path.exists(rp):
        out = np.asarray(Image.open(rp).convert('RGBA')); Image.fromarray(out).save(f'{FULL}{n}.png')
        ys, xs = np.where(out[..., 3] > 5); x0, y0, x1, y1 = max(0, xs.min() - 4), max(0, ys.min() - 4), min(W, xs.max() + 5), min(H, ys.max() + 5)
        Image.fromarray(out[y0:y1, x0:x1]).save(f'{OUT}{n}.png')
        meta[n].update({'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'source': 'qwen edit 8 步草稿（涂色补画），见 body/work/gen/prompts.log', 'visiblePx': 0, 'completedPx': int((out[..., 3] > 127).sum())})
        print(f'{n:9s} 用改图结果替换，rect {meta[n]["rect"]}')

# 领子压着袖子肩头的那一小块：母版里是上衣（领子）在前、手臂在后，但层序里手臂整体在上衣上面。
# 所以把这一块单独成层 topOverArm 放到手臂上面；手臂层在这里用的是 See-through 补出来的肩头。
ti = LID['top']                                      # 用烘焙开始时的编号（后面往 ORDER 里插过 collarBack）
arm_a = np.maximum(src['armIdleL'][1], src['armIdleR'][1]) > 0.5
ov = (label == ti) & (cv2.dilate(arm_a.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0)
ov = cv2.morphologyEx(ov.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
oa = np.clip((cv2.GaussianBlur(ov.astype(np.float32), (0, 0), 0.7) - 0.2) / 0.6, 0, 1); oa = np.where(ov, np.maximum(oa, 0.9), oa) * (label == ti)
out = np.dstack([master, (oa * 255)]).astype(np.uint8); out[oa <= 0] = 0
Image.fromarray(out).save(FULL + 'topOverArm.png')
ys, xs = np.where(oa > 0.02); x0, y0, x1, y1 = xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5
Image.fromarray(out[y0:y1, x0:x1]).save(OUT + 'topOverArm.png')
meta['topOverArm'] = {'name': 'topOverArm', 'file': 'topOverArm.png', 'full': 'full/topOverArm.png', 'z': 95, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
                      'visiblePx': int(ov.sum()), 'completedPx': 0, 'source': 'master（上衣里压在袖子肩头上面的部分，和 top 重复）'}
ORDER.append('topOverArm')
print(f'topOverArm rect {meta["topOverArm"]["rect"]} {int(ov.sum())} px')

# 头的替身（只给验收叠回用，不是交付物）：母版里归头的像素
hs = np.dstack([master, (label == 99).astype(np.uint8) * 255]); Image.fromarray(hs).save(WORK + 'head_standin.png')


# ---------- 4. 锚点 ----------
def col_center(mask, row):
    xs = np.where(mask[row])[0]; return float(xs.mean()) if len(xs) else None


def bbox(n):
    a = np.asarray(Image.open(f'{FULL}{n}.png'))[..., 3] > 127
    ys, xs = np.where(a); return a, xs.min(), ys.min(), xs.max(), ys.max()


anch = {}
for s in 'LR':
    a, x0, y0, x1, y1 = bbox('armIdle' + s)
    rows = slice(y0, y0 + 30)                                     # 肩：袖子最上面 30px 的中心
    ys, xs = np.where(a[rows]); anch['shoulder' + s] = [round(float(xs.mean()), 1), round(float(y0 + ys.mean()), 1)]
    ha, hx0, hy0, hx1, hy1 = bbox('hand' + s)
    ys, xs = np.where(ha[hy0: hy0 + 8]); anch['wrist' + s] = [round(float(xs.mean()), 1), float(hy0 + 4)]
    la, lx0, ly0, lx1, ly1 = bbox('leg' + s)
    anch['hip' + s] = [round(col_center(la, ly0 + 12), 1), float(ly0 + 12)]
    sa, sx0, sy0, sx1, sy1 = bbox('shoe' + s)
    anch['foot' + s] = [round((sx0 + sx1) / 2, 1), float(sy1)]
ka, kx0, ky0, kx1, ky1 = bbox('skirt'); anch['waist'] = [round(col_center(ka, ky0 + 6), 1), float(ky0 + 6)]
na, nx0, ny0, nx1, ny1 = bbox('neck'); anch['neckBase'] = [round((nx0 + nx1) / 2, 1), float(ny1)]
# 下巴尖：See-through 这一轮「头」层的最低点
hrgb, ha = st_layer('head'); ys, xs = np.where(ha > 0.5)
anch['chin'] = [round(float(xs[ys > ys.max() - 3].mean()), 1), float(ys.max())]

json.dump({'space': 'pose_idle_f_px', 'canvas': [W, H], 'master': 'gen/work/pose_idle_f.png',
           'order_note': '从后到前按 z 画；handL/R、armIdleL/R 是一组，非待机姿势时整组不画；armIdle 在 top 和 collar 之上，肩头多画的一截压在 top 上面（正面时被头发挡住）',
           'pending': ['collar（水手领前片 + 领巾）还没从 top 里切出来', 'neckShadow 没单独成层：下巴的阴影画在 neck 里，不跟头动', 'collarBack 和手腕是程序画的，上衣两侧的描边是程序补的'],
           'parts': [meta[n] for n in ORDER], 'anchors': anch}, open(OUT + 'body.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(anch))
