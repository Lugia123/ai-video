"""旧版张臂身体的拆件（只为 build_rig.py 要的部件表 body_parts.json；拆出来的图现在的数据包不用）。
坐标系 = body_master 像素（1536×1344），char space = BODY_ORG + BS × 像素。

  python3 split_body.py --source <角色来源目录> --work <中间产物目录>

输入（都在 source 里）：去头版 master/derived/body_nohead.png（A，脖子、领口、肩膀已补画）、无臂版 body_noarms_b.png（Bn，躯干两侧已补画），都已配准到身体母版；
  两张草稿 body_nohead_draft.png / body_noarms_b_draft.png（定稿版换色用的基准，有就用）；四张手型特写 head/inputs/hand_{open,point,wave,clasp}_f.png（生图结果，不可重跑；没有 _f 就用同名草稿）。
输出（全部是中间产物）：<work>/parts/*.png、<work>/parts/body_parts.json、<work>/parts/dbg/torso.png。"""
import sys, os, json, math, numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import S as SRC, W as WK, rest
from poses_lib import load, register, bg_mask, rgba, bleed, navy_lines
from split_lib import save, labdiff, feather, crop_save, match_lab
from scipy import ndimage as ndi
BODY_ORG = (240, 1328); BS = 864 / 1536 * 2     # 1.125
D = lambda n: SRC('master/derived', n); HI = lambda n: SRC('head/inputs', n)
def best(name):
    """有 40 步定稿版（<名字>_f.png）就用它，否则用草稿版。"""
    return HI(name + '_f.png') if os.path.exists(HI(name + '_f.png')) else HI(name + '.png')
A = load(D('body_nohead.png')); Bn = load(D('body_noarms_b.png'))
# 40 步版：按衣服的藏青、白袖、肤色三类把颜色对回验收过的草稿版，再把红棕描边统一成深藏青
def _cls(im):
    r_, g_, b_ = [im[..., i].astype(np.int16) for i in range(3)]
    return [(b_ > r_ + 15) & (r_ < 110) & (b_ > 50), (r_ > 200) & (g_ > 215) & (b_ > 215), (r_ > g_ + 10) & (g_ > b_ - 8) & (r_ > 185), (r_ > 180) & (g_ > 120) & (b_ < 120)]
for nm_, cur in (('body_nohead', 'A'), ('body_noarms_b', 'Bn')):
    dp = D(nm_ + '_draft.png')
    # <名字>_draft.png 只在「配准用的是 40 步定稿版」时才存在（草稿版留作配色基准）；原件这里还多查了一下定稿原图在不在，定稿原图不在 source 里，这个条件去掉了
    if os.path.exists(dp):
        ref = load(dp); img = A if cur == 'A' else Bn
        for k in range(4): img = match_lab(img, ref, lambda im, k=k: _cls(im)[k])
        if cur == 'A': A = img
        else: Bn = img
A = navy_lines(A); Bn = navy_lines(Bn)
H_, W_ = A.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]
out = {}
def C(p): return [float(BODY_ORG[0] + BS * p[0]), float(BODY_ORG[1] + BS * p[1])]
def put(name, img, alpha, scale=BS, org=BODY_ORG, **kw):
    a = np.clip(alpha, 0, 1)
    r = crop_save(rgba(bleed(img, a), a), WK(f'parts/{name}.png'))
    out[name] = {'rect': [org[0] + scale * r[0], org[1] + scale * r[1], scale * r[2], scale * r[3]], **kw}
def largest(mask):
    lab, k = ndi.label(mask)
    if k == 0: return mask
    return lab == (np.argmax(ndi.sum(mask, lab, range(1, k + 1))) + 1)
def chan(img): return [img[..., i].astype(np.int16) for i in range(3)]

# 关节（母版像素，目测自带网格的对照图）
J = {'L': {'S': (600, 150), 'E': (405, 265), 'W': (200, 380)}, 'R': {'S': (915, 150), 'E': (1108, 265), 'W': (1318, 380)}}
HIP = (757, 420); SHOULDER_Y = 110; CHEST_Y = 230; FOOT = (757, 1250)

fgA = ~bg_mask(A)
d = labdiff(A, Bn)
# 手臂 = 去头版里有、无臂版剪影外面的部分；再沿白袖子往躯干里多吃 26px 当肩部重叠
fgBn = ~bg_mask(Bn)
arm_all = fgA & ~ndi.binary_dilation(fgBn, iterations=2) & (yy > 55)
arm_all = ndi.binary_opening(arm_all, iterations=4)
rA, gA, bA = chan(A)
whiteA = (rA > 190) & (gA > 215) & (bA > 215)
arms = {}
for side, half in (('L', xx < 757), ('R', xx > 757)):
    m = largest(arm_all & half)
    grow = ndi.binary_dilation(m, iterations=26) & fgA & half & (whiteA | ndi.binary_dilation(m, iterations=6)) & (yy > 70) & (yy < 380)
    arms[side] = ndi.binary_fill_holes(largest(m | ndi.binary_opening(grow, iterations=2)))

# ---------- 躯干：去头版里把手臂换成无臂版的像素 ----------
outer = ndi.binary_dilation(arms['L'] | arms['R'], iterations=9)
T = np.where((outer | (yy > 420))[..., None], Bn, A)      # 手臂盖过的地方和腰以下用无臂版，领口和脖子用去头版
fgT = ~bg_mask(T)
fgT = largest(ndi.binary_opening(fgT, iterations=2))
save(T, WK('parts/dbg/torso.png'))
r, g, b = chan(T)
skin = (r > g + 10) & (g > b - 8) & (r > 185)
sock = (r > 225) & (g > 225) & (b > 225)
WAIST = 398
skirt = fgT & (yy >= WAIST) & (yy < 800) & ~skin & ~sock
skirt = ndi.binary_opening(skirt, iterations=5)
skirt = largest(skirt)
skirt = ndi.binary_dilation(skirt, iterations=3) & fgT & (yy >= WAIST) & ~skin
skirt = ndi.binary_fill_holes(skirt)
skirt = largest(ndi.binary_opening(skirt, iterations=4))      # 裙边上粘着的腿部描边碎屑
skirt = largest(ndi.binary_opening(skirt, structure=np.ones((1, 31), bool)))      # 裙摆下面挂着的竖向细线（腿的描边）：3D 版有视差，会露出来
hem_y = np.where(skirt.any(1))[0].max()
put('skirt', T, feather(skirt, 0.8), group='skirt', sway={'rootY': C((0, WAIST + 20))[1], 'tipY': C((0, hem_y))[1], 'amp': 0.9, 'idle': 2.5})
put('torso', T, feather(fgT & (yy < WAIST + 46) & (yy > 50), 0.8), group='body')      # y<50 是领尖往上翘的两个小尖，缩小后像碎屑，裁掉
# 腿：裙摆以下的部分 + 往上补一段（裙子摆开时不露空）
yref = hem_y + 14
legs = fgT & (yy >= yref)                # 裙摆最低点再往下 14px 才用原图，之上全用补画的（免得留下裙边的碎线）
Lg = T.copy(); la = legs.copy()
rowa = fgT[yref] & ~skirt[yref]
for y in range(WAIST + 150, yref):
    Lg[y] = np.where(rowa[:, None], T[yref], Lg[y]); la[y] = rowa
put('legs', Lg, feather(la, 0.8), group='legs')

# ---------- 手臂（袖子 + 袖口；手另算） ----------
geom = {'hip': C(HIP), 'shoulderY': C((0, SHOULDER_Y))[1], 'chestY': C((0, CHEST_Y))[1], 'foot': C(FOOT), 'arms': {}}
for side in 'LR':
    S, E, Wp = [np.array(J[side][k], np.float32) for k in 'SEW']
    dirv = (Wp - E) / np.linalg.norm(Wp - E)
    along = (xx - Wp[0]) * dirv[0] + (yy - Wp[1]) * dirv[1]
    m = arms[side] & (along < 2)
    m = largest(m)
    # 肩部切口没有描边，转起来像剪纸：沿遮罩边缘补一圈深色线（原本就是描边的地方不变）
    band = m & ~ndi.binary_erosion(m, iterations=5)
    lum = A.astype(np.int16).sum(-1)
    Aa = A.copy(); Aa[band & (lum > 330)] = (22, 28, 48)
    Aa = np.where(ndi.binary_dilation(band, iterations=1)[..., None], cv2.GaussianBlur(Aa, (0, 0), 0.8), Aa)
    put('arm' + side, Aa, feather(m, 0.8), group='arm' + side, role='arm', grid=[18, 18])
    geom['arms'][side] = {'shoulder': C(S), 'elbow': C(E), 'wrist': C(Wp)}

# ---------- 手型（各自一张 768² 的特写；手腕点、前臂朝向为目测） ----------
HANDS = {  # 名字: (文件, 手腕点, 图里「肘→腕」方向角度, 图里袖口宽度 px)
    'open': ('hand_open', (512, 297), 159, 297),
    'point': ('hand_point', (536, 322), 180, 292),
    'wave': ('hand_wave', (375, 512), -90, 307),
    'clasp': ('hand_clasp', (250, 470), -38.7, 242),     # 两个小拳头相碰，只挂在画面左手腕上，不跟前臂转
}
CUFF_CHAR = 146   # 身体上袖口的宽度（char px）
for nm, (f, wr, ang, cuffw) in HANDS.items():
    I = navy_lines(load(best(f))); h, w = I.shape[:2]; y2, x2 = np.mgrid[0:h, 0:w]
    fg = ~bg_mask(I)
    dv = (math.cos(math.radians(ang)), math.sin(math.radians(ang)))
    al = (x2 - wr[0]) * dv[0] + (y2 - wr[1]) * dv[1]
    r3, g3, b3 = chan(I)
    skin3 = (r3 > g3 + 8) & (r3 > 170) & (g3 > b3 - 10)
    cuff3 = ((g3 > r3 + 22) & (b3 > r3 + 22)) | ((r3 > 200) & (g3 > 225) & (b3 > 225))
    sk_ = ndi.binary_opening(skin3 & fg, iterations=2)
    hand = ndi.binary_dilation(sk_ if nm == 'clasp' else largest(sk_), iterations=13) & fg & ~cuff3 & (al > -30)       # 交握那张是两只手，两块肤色都要
    hand = largest(ndi.binary_opening(hand, iterations=2))
    alh = al[hand]; near = hand & (al < alh.min() + 14)
    wr = (float(x2[near].mean()), float(y2[near].mean()))                 # 手腕点：手最靠袖口的那一截的中点
    al = (x2 - wr[0]) * dv[0] + (y2 - wr[1]) * dv[1]
    hand &= al > 0
    # 往袖口里补 46px：把手腕处的截面沿前臂方向往回拉
    EXT = 46
    mx = (x2 + dv[0] * np.clip(26 - al, 0, None)).astype(np.float32); my = (y2 + dv[1] * np.clip(26 - al, 0, None)).astype(np.float32)
    I2 = cv2.remap(I, mx, my, cv2.INTER_LINEAR); h2 = cv2.remap(hand.astype(np.float32), mx, my, cv2.INTER_LINEAR) > 0.5
    h2 &= (al > -EXT)
    s = CUFF_CHAR / cuffw
    for side in ('L' if nm == 'clasp' else 'LR'):
        Wc = geom['arms'][side]['wrist']
        img, msk, wx, a_ = I2, h2, wr[0], ang
        flip = (side == 'R') if nm != 'wave' else (side == 'L')    # open / point 取自画面左手，wave 取自画面右手
        if flip: img, msk, wx, a_ = I2[:, ::-1], h2[:, ::-1], w - 1 - wr[0], 180 - ang
        a = feather(msk, 0.9)
        r_ = crop_save(rgba(bleed(np.ascontiguousarray(img), a), a), WK(f'parts/hand_{nm}{side}.png'))
        out[f'hand_{nm}{side}'] = {'rect': [Wc[0] + (r_[0] - wx) * s, Wc[1] + (r_[1] - wr[1]) * s, r_[2] * s, r_[3] * s],
                                   'group': 'arm' + side, 'role': 'hand:' + nm, 'wrist': Wc, 'angle': a_, **({'fixed': True} if nm == 'clasp' else {})}
json.dump({'parts': out, 'geom': geom}, open(WK('parts/body_parts.json'), 'w'), indent=1, default=float)
print(json.dumps(geom))
