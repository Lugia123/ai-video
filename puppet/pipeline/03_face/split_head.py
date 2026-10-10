"""第 0 步 头部拆件。坐标系 = head_master 像素（1408²），char space = 像素 + HEAD_ORG。

  python3 split_head.py --source <角色来源目录> --work <中间产物目录>

输入（都在 source 里）：母版 master/head_master.png（M）；已配准到 M 的去帽版 master/derived/head_nohat.png（N）、光头版 head_bald.png（B）、
  三张口型改图 mouth_{small,big,smile}.png；以及两张草稿 head_nohat_draft.png / head_bald_draft.png（定稿版换色用的基准，有就用）。
输出（全部是中间产物）：<work>/parts/*.png、<work>/parts/head_parts.json（各部件的 rect、眼睛 / 嘴的几何）、<work>/parts/dbg/。
脸这一家后面的步骤只用其中的脸底和 17 个五官部件；帽子、头发几层也照原样拆出来，校验脚本叠回对比时要用。"""
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK
from poses_lib import load, bg_mask, rgba, bleed, navy_lines
# 下面五个函数 lib/poses_lib.py 里没有，从原拆件公用函数原样拷来（函数体没改）
def save(arr, path): Image.fromarray(arr).save(path)
def labdiff(a, b):
    la = cv2.cvtColor(a, cv2.COLOR_RGB2LAB).astype(np.float32); lb = cv2.cvtColor(b, cv2.COLOR_RGB2LAB).astype(np.float32)
    return np.sqrt(((la - lb) ** 2).sum(-1))
def feather(mask, r=1.2): return cv2.GaussianBlur(mask.astype(np.float32), (0, 0), r)
def crop_save(img_rgba, path, pad=6):
    """裁到 alpha 的包围盒（外扩 pad），返回 (x, y, w, h)。"""
    ys, xs = np.where(img_rgba[..., 3] > 2)
    x0, x1, y0, y1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, img_rgba.shape[1]), max(ys.min() - pad, 0), min(ys.max() + pad + 1, img_rgba.shape[0])
    Image.fromarray(img_rgba[y0:y1, x0:x1]).save(path)
    return [int(x0), int(y0), int(x1 - x0), int(y1 - y0)]
def defringe(img, mask, px=2):
    """去底色晕边：只动外轮廓往里 px 像素的一圈，颜色换成再往里最近的像素（描边的深色），alpha 不变。"""
    inner = ndi.binary_erosion(mask, iterations=px)
    if not inner.any(): return img
    idx = ndi.distance_transform_edt(~inner, return_distances=False, return_indices=True)
    out = img.copy(); edge = mask & ~inner; out[edge] = img[idx[0][edge], idx[1][edge]]
    return out
D = lambda n: SRC('master/derived', n)
HEAD_ORG = (390, 136)                 # 头部裁块左上角在 char space 的位置（候选图坐标 ×2）
M = load(SRC('master/head_master.png')); N = load(D('head_nohat.png')); B = load(D('head_bald.png'))
def match_color(img, ref, sel):
    """把 img 在 sel(img) 选中的像素的 Lab 均值 / 方差对到 ref 上同一选择的统计（40 步重绘会让颜色偏移，拉回验收过的草稿配色）。"""
    a = cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.float32); b = cv2.cvtColor(ref, cv2.COLOR_RGB2LAB).astype(np.float32)
    ma, mb = sel(img), sel(ref)
    out = a.copy()
    for c in range(3):
        sa, sb = a[..., c][ma], b[..., c][mb]
        out[..., c] = np.where(ma, (a[..., c] - sa.mean()) * (sb.std() / max(sa.std(), 1e-3)) + sb.mean(), a[..., c])
    print('match_color', [round(float(a[..., c][ma].mean() - b[..., c][mb].mean()), 1) for c in range(3)])
    return cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
def _mint(im):
    r_, g_, b_ = [im[..., i].astype(np.int16) for i in range(3)]
    return (g_ > r_ + 8) & (g_ >= b_ - 10) & (g_ > 110)
def _skin(im):
    r_, g_, b_ = [im[..., i].astype(np.int16) for i in range(3)]
    return (r_ > g_ + 8) & (g_ > b_ - 6) & (r_ > 200) & (g_ > 150)
# <名字>_draft.png 只在「配准用的是 40 步定稿版」时才存在（草稿版留作配色基准）；原件这里还多查了一下定稿原图在不在，定稿原图不在 source 里，这个条件去掉了
if os.path.exists(D('head_nohat_draft.png')):
    N = match_color(N, load(D('head_nohat_draft.png')), _mint)
if os.path.exists(D('head_bald_draft.png')):
    B = match_color(B, load(D('head_bald_draft.png')), _skin)
H_, W_ = M.shape[:2]
yy, xx = np.mgrid[0:H_, 0:W_]
out = {}

def put(name, img, alpha, **kw):
    a = np.clip(alpha, 0, 1)
    rect = crop_save(rgba(bleed(img, a), a), WK('parts', name + '.png'))
    out[name] = {'rect': [rect[0] + HEAD_ORG[0], rect[1] + HEAD_ORG[1], rect[2], rect[3]], **kw}
    return rect

def largest(mask, n=1):
    lab, k = ndi.label(mask)
    if k == 0: return mask
    sz = ndi.sum(mask, lab, range(1, k + 1)); keep = np.argsort(sz)[::-1][:n] + 1
    return np.isin(lab, keep)

def hsv(img): return cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(np.int16)
def chan(img): return [img[..., i].astype(np.int16) for i in range(3)]

# ---------- 1. 帽子（含发卡）、呆毛：母版 − 去帽版 ----------
fgM = ~bg_mask(M); fgN = ~bg_mask(N); fgB = ~bg_mask(B)
dMN = labdiff(M, N)
hat = fgM & (dMN > 16) & (yy < 800)
r, g, b = chan(M)
mint = (g > r + 8) & (g >= b - 6) & (g > 150)
ahz = (xx > 815) & (xx < 995) & (yy < 190)
hat = hat & (~mint | ahz)
hat = ndi.binary_closing(hat, iterations=5); hat = ndi.binary_fill_holes(hat); hat = ndi.binary_opening(hat, iterations=4)
hat = largest(hat)
ah_box = (xx > 815) & (xx < 995) & (yy < 190)
navy = (b > r + 18) & (r < 110)
ahoge = hat & ah_box & ~ndi.binary_dilation(navy & ~ah_box | (navy & (yy > 150)), iterations=1)
# 呆毛 = 帽顶以上那一撮：帽子轮廓线以外、box 以内
hat_body = ndi.binary_opening(hat & ~((yy < 118) & ah_box), iterations=14)   # 开运算去掉细长的呆毛
hat_body = hat & ndi.binary_dilation(hat_body, iterations=14) & ~((yy < 100) & ah_box)
ahoge = hat & ah_box & ~hat_body
ahoge = largest(ndi.binary_dilation(ahoge, iterations=10) & hat & ah_box & (yy < 178))
hat_only = hat & ~(ahoge & (yy < 120))
hat_only &= fgM; ahoge = ndi.binary_propagation(ahoge, mask=fgM & ah_box & (yy < 178)) & fgM      # 呆毛的尖：沿前景长回来
put('hat', defringe(M, hat_only, 2), feather(hat_only, 0.6))
put('ahoge', defringe(M, ahoge, 2), feather(ahoge, 0.6))

# ---------- 2. 头发：去帽版 − 光头版，限定发色 ----------
dNB = labdiff(N, B)
r, g, b = chan(N)
skin_like = (r > g + 12) & (g > b - 4) & (r > 150)
redline = (r > b + 25) & (r < 170) & (r > g + 20)            # 脸的红棕色描边
hair = fgN & (dNB > 14) & ~skin_like & ~redline & (yy < 1290)
hair = ndi.binary_opening(hair, iterations=2)
hair = ndi.binary_closing(hair, iterations=3)
hair = largest(hair)
hair &= (yy < 1262) & ~((yy > 1175) & (np.abs(xx - 690) < 150))    # 领口 / 领尖被误当成头发的部分
hair &= ~((yy > 1185) & ~ndi.binary_opening(hair, iterations=5))      # 领口附近配准误差留下的细碎片
# 发丝之间的小洞（额头从刘海缝里露出来的皮肤）保留为洞；内部的描边要并进来
hair = hair | (ndi.binary_fill_holes(hair) & ~skin_like & ~redline & fgN & (dNB > 6))
# ---- 外轮廓重取（用户指出：发梢之间留着底色、发尖被吃掉）----
# 上面的开 / 闭运算只用来定「哪一片是头发」（hair = 粗的核）。真正的轮廓回到去帽版原图：
#   背景 = 和图像边缘连通的底色（洪泛）→ 发梢之间和外面连通的缝都算背景，抠透；头发内部的高光白不和外面连通，不动。
#   发尖 = 从核出发，沿「发色 / 高光 / 描边」的像素往外长回来（不做腐蚀）。只允许长到光头版剪影之外，或者和光头版明显不同的地方，
#   这样不会沿着脸的轮廓线长进脸里。
bgN = bg_mask(N, tol=14)
lumN = (r + g + b) / 3
# 发梢和领子 / 肩膀围住的底色小块不和图像边缘连通，洪泛到不了：底色是中性灰（三个通道几乎相等），发丝的高光是偏绿的白，按这个分
bgc = np.median(N[:24, :24].reshape(-1, 3), 0).astype(np.int16)
pocket = (np.abs(r - bgc[0]) < 16) & (np.abs(g - bgc[1]) < 16) & (np.abs(b - bgc[2]) < 16) & (np.abs(r - g) < 7) & (np.abs(g - b) < 9) & (yy > 1000)
bgN = bgN | ndi.binary_dilation(ndi.binary_opening(pocket, iterations=2), iterations=2) & pocket | ndi.binary_opening(pocket, iterations=2)
# 发色（薄荷白到深青绿）：绿不小于红、蓝不比绿高多少；很亮的地方要明显偏绿（否则是白衬衫）；藏青（蓝明显高于绿）不算
hlc = (g > r + 4) & (b <= g + 6) & (g > 55) & ((lumN < 235) | (g - r > 12)) & ~bgN & ~skin_like
# 不设 y 上限、不挖领口那块矩形（之前这两处把最下面一排发尖切平、在脖子两边挖了个方口）；描边（深色）只收紧贴着发色的 5px 以内
cand = ~bgN & ~skin_like & ~redline & (hlc | ((lumN < 120) & ndi.binary_dilation(hlc, iterations=10))) & (~fgB | (dNB > 8))
core = hair & ~bgN
hair = ndi.binary_propagation(core, mask=(cand & ndi.binary_dilation(core, iterations=90)) | core) & ~bgN
print('hair px: core', int(core.sum()), '→', int(hair.sum()))
save((N * hair[..., None] + (~hair[..., None]) * np.uint8(255)).astype(np.uint8), WK('parts/dbg/hair.png'))
hair_a = feather(hair, 0.6); N = defringe(N, hair, 2)
# 前发 / 左右侧发：按 x 切，接缝两边各重叠 6px（变形场连续，所以接缝不裂）
XL, XR = 372, 1012
front = hair_a * ((xx >= XL - 6) & (xx <= XR + 6))
sideL = hair_a * (xx < XL + 6); sideR = hair_a * (xx > XR - 6)
put('hair_front', N, front); put('hair_sideL', N, sideL); put('hair_sideR', N, sideR)
# 后发（补画的垫底层）：头发剪影往里缩 40px，填上模糊过的发色；平时完全被挡住，转头 / 头发摆动露缝时垫在下面
sil = ndi.binary_fill_holes(hair | (fgB & (yy < 1150) & (xx > 250) & (xx < 1130)))
inner = ndi.binary_erosion(sil, iterations=40)
base = cv2.inpaint(N, (~hair).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA) if False else N.copy()
blur = np.zeros_like(N, np.float32); wsum = cv2.GaussianBlur(hair.astype(np.float32), (0, 0), 28)
for c in range(3): blur[..., c] = cv2.GaussianBlur(N[..., c].astype(np.float32) * hair, (0, 0), 28) / np.maximum(wsum, 1e-3)
back = np.clip(blur * 0.93, 0, 255).astype(np.uint8)
far = wsum < 0.02
if far.any():
    idx = ndi.distance_transform_edt(far, return_distances=False, return_indices=True)
    back[far] = back[idx[0][far], idx[1][far]]
put('hair_back', back, feather(inner, 3))

# ---------- 3. 脸底（光头版，五官抹掉；含耳朵），脖子归身体 ----------
r, g, b = chan(B)
col = B[:, 690].astype(np.int16)
dark = np.where((col[1000:1250].sum(1) < 380))[0]
chinY = 1000 + int(dark.max()) if len(dark) else 1130
# 下巴线：从嘴往下找到的第一条深色线
runs = np.where(col[1085:1250].sum(1) < 420)[0]
chinY = 1085 + int(runs[0]) + 8
print('chinY', chinY)
headm = fgB & (yy <= chinY)
headm = largest(ndi.binary_opening(headm, iterations=2))
skinB = (r > g + 8) & (g > b - 6) & (r > 200) & (g > 170)       # 肤色和腮红（亮）
feat_zone = headm & (xx > 338) & (xx < 1034) & (yy > 640) & (yy < chinY - 40)
feat_zone &= ndi.binary_erosion(headm, iterations=16)
feat = feat_zone & ((g < 190) | (b > 232) | (b > r + 15))
feat = ndi.binary_opening(feat, iterations=1)
# 贴着检测区边界的小块是脸轮廓线伸进来的一截，不是五官（不能被抹掉）
_lab, _k = ndi.label(feat); _edge = set(np.unique(_lab[feat_zone & ~ndi.binary_erosion(feat_zone, iterations=3)])) - {0}
_sz = ndi.sum(feat, _lab, range(1, _k + 1))
feat &= ~np.isin(_lab, [i for i in _edge if _sz[i - 1] < 2500])
# 竖着的细长条也是脸轮廓（40 步版的脸轮廓是深藏青色，颜色上和睫毛分不开）
_objs = ndi.find_objects(_lab)
_bars = [i + 1 for i, o in enumerate(_objs) if o is not None and (o[1].stop - o[1].start) < 36 and (o[0].stop - o[0].start) > 48 and (o[1].start < 420 or o[1].stop > 960)]
feat &= ~np.isin(_lab, _bars)
print('脸轮廓误判块', len([i for i in _edge if _sz[i - 1] < 2500]), '+', len(_bars))
featd = ndi.binary_dilation(feat, iterations=7)
face = cv2.inpaint(B, featd.astype(np.uint8) * 255, 12, cv2.INPAINT_TELEA)
# 抹掉的区域再糊一下，去掉 inpaint 的条纹
fb = cv2.GaussianBlur(face, (0, 0), 9); wgt = feather(featd, 6)[..., None]
face = (face * (1 - wgt) + fb * wgt).astype(np.uint8)
put('face', face, feather(headm, 0.8))
save(face, WK('parts/dbg/face.png')); save((feat * 255).astype(np.uint8), WK('parts/dbg/feat.png'))

# ---------- 4. 五官 ----------
feat_a = feather(ndi.binary_dilation(feat, iterations=1), 0.9)
geom = {'chinY': chinY + HEAD_ORG[1]}
def comp_in(box):
    x0, y0, x1, y1 = box
    return feat & (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
EYES = {'L': (340, 800, 650, 1020), 'R': (735, 800, 1034, 1020)}
BROW = {'L': (350, 650, 660, 795), 'R': (725, 650, 1034, 795)}
hs = hsv(B)
for side in 'LR':
    box = EYES[side]; m = comp_in(box)
    # 上方的眉毛带可能连着双眼皮线：眉毛单独一层
    bm_ = comp_in(BROW[side]) & (b > r + 5)
    bm_ = largest(ndi.binary_dilation(bm_, iterations=2)) & comp_in(BROW[side])
    put('brow' + side, B, feather(ndi.binary_dilation(bm_, iterations=1), 0.9), eye=side)
    # 虹膜：蓝绿色（B 明显大于 R）、不太亮
    iris = m & (b > r + 22) & (hs[..., 1] > 90) & (hs[..., 2] >= 46) & (hs[..., 0] > 78) & (hs[..., 0] < 122)
    iris = largest(ndi.binary_opening(iris, iterations=2))
    ys, xs = np.where(iris)
    ix0, ix1, iy0, iy1 = xs.min(), xs.max(), ys.min(), ys.max()
    hull = cv2.fillConvexPoly(np.zeros((H_, W_), np.uint8), cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32)), 1) > 0
    icx, rx = (ix0 + ix1) / 2, (ix1 - ix0) / 2
    ry = max((iy1 - iy0) / 2, rx * 1.12); icy = iy1 - ry          # 完整的椭圆：上面被睫毛挡住的部分补出来
    ell = ((xx - icx) / rx) ** 2 + ((yy - icy) / ry) ** 2 <= 1
    full = hull | ell
    # 高光：虹膜里的亮白点
    hl = ndi.binary_erosion(hull, iterations=4) & (r > 215) & (g > 225) & (b > 225) & m
    hl = ndi.binary_dilation(hl, iterations=2) & full
    it = cv2.inpaint(B, ndi.binary_dilation(hl, iterations=3).astype(np.uint8) * 255, 5, cv2.INPAINT_TELEA)
    # 被睫毛盖住 / 椭圆补出来的部分：沿列把虹膜最上面的颜色往上延
    lash_px = (hs[..., 2] < 46) | ((r > b + 10) & (r + g + b < 330))
    bad = full & (~hull | lash_px) & (yy < icy)
    it2 = it.copy()
    for x in range(int(icx - rx) - 1, int(icx + rx) + 2):
        colbad = np.where(bad[:, x])[0]
        if len(colbad) == 0: continue
        good = np.where(hull[:, x] & ~lash_px[:, x] & (yy[:, x] > colbad.max()))[0]
        src = it[good[:6], x].mean(0) if len(good) else it[int(iy0) + 8, int(icx)]
        it2[colbad, x] = src
    it2 = np.where(bad[..., None], cv2.GaussianBlur(it2, (0, 0), 2), it2)
    put('iris' + side, it2, feather(full, 0.9), eye=side)
    put('eyeHl' + side, B, feather(hl, 0.8), eye=side)
    # 眼白开口：亮的低饱和像素 ∪ 虹膜可见部分，填洞
    white = m & (hs[..., 1] < 95) & (hs[..., 2] > 130) & ~((hs[..., 0] < 25) & (hs[..., 1] > 30))
    opening = ndi.binary_closing(white | (hull & m & ~lash_px), iterations=3)
    opening = largest(ndi.binary_fill_holes(opening))
    opening = ndi.binary_dilation(opening, iterations=2)
    wt = np.where(white[..., None] & ~hull[..., None], B, np.uint8(252)).astype(np.uint8)
    wt = np.where(opening[..., None] & ~(white & ~hull)[..., None], cv2.GaussianBlur(wt, (0, 0), 3), wt)
    put('eyeWhite' + side, wt, feather(opening, 1.0), eye=side)
    # 上睫毛 + 双眼皮线：眼睛范围内、不属于开口的五官像素，取上半；下睫毛的小点留作静态层
    oy0, oy1 = np.where(opening.any(1))[0][[0, -1]]; ox0, ox1 = np.where(opening.any(0))[0][[0, -1]]
    ocy = (oy0 + oy1) / 2
    rest = m & ~(ndi.binary_erosion(opening, iterations=3) & ~lash_px) & ~bm_
    lash = rest & (yy < ocy + (oy1 - oy0) * 0.12)
    low = rest & ~lash & (hs[..., 2] < 120)          # 只留下睫毛的小点，眼白下缘的浅线不要
    lab_, k_ = ndi.label(lash); sz_ = ndi.sum(lash, lab_, range(1, k_ + 1))
    lash = np.isin(lab_, [i + 1 for i in range(k_) if sz_[i] > 400 and i + 1 not in set(np.unique(lab_[ndi.binary_erosion(hull, iterations=6)]))])
    lash &= ~(ndi.binary_dilation(full, iterations=5) & (yy > icy - 0.45 * ry))   # 虹膜两侧的深色描边不算睫毛
    lash = ndi.binary_dilation(lash, iterations=1)
    put('lash' + side, B, feather(lash, 0.9), eye=side)
    if low.sum() > 30: put('eyeLow' + side, B, feather(ndi.binary_dilation(low, iterations=1), 0.9), eye=side)
    ly, lx = np.where(lash)
    geom['eye' + side] = {
        'center': [float((ox0 + ox1) / 2 + HEAD_ORG[0]), float(ocy + HEAD_ORG[1])], 'hw': float((lx.max() - lx.min()) / 2),
        'top': float(oy0 + HEAD_ORG[1]), 'bottom': float(oy1 + HEAD_ORG[1]),
        'iris': [float(icx + HEAD_ORG[0]), float(icy + HEAD_ORG[1])], 'gaze': [float(rx * 0.42), float(ry * 0.25)],
    }
# 鼻子
nose = comp_in((640, 960, 740, 1040))
if nose.sum() > 5: put('nose', B, feather(ndi.binary_dilation(nose, iterations=1), 0.9))
# 嘴：闭嘴取光头版；三个张嘴口型取各自改图（同一坐标系），只要嘴那一块里「不是肤色」的像素
MB = (575, 1030, 805, chinY - 12)
mc = (r - g > 40) & (xx >= MB[0]) & (xx < MB[2]) & (yy >= MB[1]) & (yy < MB[3])
mc = largest(ndi.binary_closing(mc, iterations=2))
put('mouth_closed', B, feather(ndi.binary_dilation(mc, iterations=1), 0.9))
my, mx = np.where(mc)
geom['mouth'] = {'center': [float(mx.mean() + HEAD_ORG[0]), float(my.mean() + HEAD_ORG[1])]}
for nm in ['small', 'big', 'smile']:
    p = D(f'mouth_{nm}.png')
    if not os.path.exists(p): print('缺口型', nm); continue
    I = load(p); r2, g2, b2 = chan(I)
    mm = ((g2 < 188) | (b2 > 232)) & (xx >= MB[0]) & (xx < MB[2]) & (yy >= MB[1]) & (yy < MB[3])
    mm = ndi.binary_opening(mm, iterations=1)
    mm = largest(ndi.binary_fill_holes(ndi.binary_closing(mm, iterations=2)))
    put('mouth_' + nm, I, feather(ndi.binary_dilation(mm, iterations=1), 0.9))
nk = np.zeros((300, 150, 4), np.uint8); ncol = B[chinY + 26, 690]; nline = B[chinY + 26, 632] if B[chinY + 26, 632].sum() < 300 else np.array([110, 40, 35], np.uint8)
nk[..., :3] = ncol; nk[..., 3] = 255; nk[:, :7, :3] = nline; nk[:, -7:, :3] = nline
nk[..., :3] = navy_lines(np.ascontiguousarray(nk[..., :3]))
Image.fromarray(nk).save(WK('parts/neck.png'))
out['neck'] = {'rect': [690 - 75 + HEAD_ORG[0], chinY - 60 + HEAD_ORG[1], 150, 300]}
json.dump({'parts': out, 'geom': geom, 'org': HEAD_ORG}, open(WK('parts/head_parts.json'), 'w'), indent=1)
print(json.dumps(geom, indent=1))
