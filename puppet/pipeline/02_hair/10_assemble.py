#!/usr/bin/env python3
# 第 10 步：组装每一片完整的发片（可见部分 + 被压住的部分），抠图，出权重图和 hair.json。
#   可见部分：母版原像素（被衣服挡住的发梢取「纯头」图）。正面叠回去 = 母版。
#   被压住的部分，来源按片不同：
#     帽下发根      ← 「纯头去帽」图 reg_ho_nohat
#     相邻发束压住的 ← 逐层揭开图 reg_peelK（K 见 PEEL_OF；还没出图的先跳过，hair.json 里标 pending）
#     后发 5 片      ← See-through 的完整后发 st_back（可见处仍用母版像素）
#   python3 10_assemble.py --source <来源目录> --work <中间产物目录>
#   读来源目录的 hair/inputs/、master/；写来源目录的 hair/pieces/<名>.png、<名>_w.png、hair/hair.json，和 <work>/hair/asm.npz
import sys, json, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from hlib import *
M, N, B = masters(); H, W = M.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
M2 = rgb(IN + 'master2.png'); hair2 = np.asarray(Image.open(IN + 'hair2.png')) > 0; hat = np.asarray(Image.open(IN + 'hat.png')) > 0; ahoge = np.asarray(Image.open(IN + 'ahoge.png')) > 0
pm = np.load(IN + 'pieces2.npy'); order0 = json.load(open(IN + 'pieces.json'))['order']
# ---- 少片方案（10-07 用户：「先不做那么多分片了」）：把 14 个可见分区并成 6 组，加呆毛共 7 片。19 片的版本留在 hair/_v19/。
GROUPS = {'back': ['back', 'under_L', 'under_R'], 'inner_L': ['inner_L'], 'inner_R': ['inner_R'], 'side_L': ['side_L'], 'side_R': ['side_R'],
          'bangs': ['burn_L', 'burn_R', 'bang_L2', 'bang_R2', 'bang_R', 'bang_L', 'bang_C']}
_pm = np.zeros_like(pm); _names = list(GROUPS)
for gi, g in enumerate(_names):
    for o in GROUPS[g]: _pm[pm == order0.index(o) + 1] = gi + 1
pm = _pm; order0 = _names
vis = {n: pm == i + 1 for i, n in enumerate(order0)}
R_FACE, CX = 330, 704
# 层序（下 → 上）、深度、贴头/悬空分界 [y_attach, y_free]（权重在两者之间从 1 降到 0）
SPEC = [
 ('back',    -0.08, (900, 1120)), ('inner_L',  0.05, (900, 1020)), ('inner_R',  0.05, (900, 1020)),
 ('side_L',   0.38, (720, 900)),  ('side_R',   0.38, (720, 900)),  ('bangs',    0.58, (660, 860)),
 ('ahoge',    0.10, (150, 110)),
]
FACE_BEHIND = {'back', 'inner_L', 'inner_R'}
PEEL_OF_UNUSED = {'bang_L': 1, 'bang_R': 1, 'bang_L2': 2, 'bang_R2': 2, 'burn_L': 3, 'burn_R': 3, 'side_L': 4, 'side_R': 4, 'under_L': 5, 'under_R': 5, 'inner_L': 5, 'inner_R': 5}
REACH = {1: 70, 2: 80, 3: 110, 4: 130, 5: 150}        # 揭开图里从可见部分往被压区最多取多远（px，沿头发走的距离）
def hairmask(img, exclude):
    """一张图里的头发像素（颜色规则 + 贴着的描边），exclude 是不看的区域。"""
    seed = mintish(img) & ~exclude; line = hair_line(img) & ~exclude
    hl = (img[..., 1] > 225) & (img[..., 2] > 215) & (img[..., 0] > 205) & (img[..., 1] >= img[..., 0]) & ~exclude
    m = seed | (hl & ndi.binary_dilation(seed, iterations=6))
    m |= ndi.binary_propagation(ndi.binary_dilation(m, iterations=2) & line, mask=line & ndi.binary_dilation(m, iterations=12))
    return ndi.binary_fill_holes(m) & ~exclude | m
def grow(img, src_hair, markers, allowed, reach):
    """把 allowed 里的头发像素按「离哪片可见部分近（沿线稿的分水岭）」分给各片。markers: {名: mask}。"""
    names = list(markers); mk = np.zeros((H, W), np.int32)
    for i, n in enumerate(names): mk[markers[n]] = i + 1
    region = (src_hair & allowed) | (mk > 0); mk[~region] = len(names) + 1
    g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_RGB2GRAY), (0, 0), 1.2)
    ws = cv2.watershed(cv2.cvtColor(g, cv2.COLOR_GRAY2BGR), mk.copy()); ws[ws > len(names)] = 0; ws[~region] = 0
    idx = ndi.distance_transform_edt(ws <= 0, return_distances=False, return_indices=True); ws = np.where(region, ws[idx[0], idx[1]], 0)
    out = {}
    for i, n in enumerate(names):
        ext = (ws == i + 1) & allowed & src_hair & ~markers[n]
        near = ndi.binary_dilation(markers[n], iterations=reach); ext &= near
        l, k = ndi.label(ext | markers[n]); keep = np.unique(l[markers[n]]); out[n] = ext & np.isin(l, keep)
    return out
DISK = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)).astype(bool)
def clean_ext(e, base):
    """延伸区去掉细碎的尖刺和孤岛（只动延伸区，不动可见部分）：对「可见 + 延伸」做一次半径 5 的开运算，结果里属于延伸区的留下，再只留和可见部分连着的。"""
    u = ndi.binary_opening(e | base, structure=DISK); e2 = e & u
    l, k = ndi.label(e2 | base); return e2 & np.isin(l, np.unique(l[base]))
eyes = (yy > 830) & (yy < 1030) & (((xx > 410) & (xx < 610)) | ((xx > 770) & (xx < 970)))
col = {n: M2.copy() for n in order0}; msk = {n: vis[n].copy() for n in order0}; src = {n: ['master'] for n in order0}; pending = {n: [] for n in order0}
# ③（#1159）描边断口的原因：两片交界处的那条线，切片时整条归了其中一片（多数归了下面那片）。正面叠着看不出来；一转头两片错开，上面那片的边就没有线，
# 线留在原地跟着下面那片走——看起来就是「黑线一段有一段没有」。修法：交界线两片都要有——上面那片把紧贴自己边缘（7px 内）、被分给下层片的线条像素也收进来，
# 用的是母版原像素，线宽和母版一致；不另外加一圈新描边。
_lum2 = M2[..., 0] * 0.3 + M2[..., 1] * 0.59 + M2[..., 2] * 0.11
_fill = ndi.median_filter(np.where(hair2, _lum2, 255).astype(np.uint8), size=25).astype(np.float32)
LINE2 = hair2 & (_lum2 < np.minimum(135, _fill - 45))
SHARE = {}
for _i, n in enumerate(order0):
    if n == 'back': continue
    lower = np.zeros((H, W), bool)
    for o in order0[:_i]: lower |= vis[o]
    near = ndi.binary_dilation(vis[n], iterations=7) & ~vis[n] & lower & LINE2
    near = ndi.binary_propagation(ndi.binary_dilation(vis[n], iterations=2) & near, mask=near)
    msk[n] |= near; SHARE[n] = int(near.sum())
print('交界线共用的像素数', SHARE)
# ---- 帽下发根 ----
NH = rgb(IN + 'reg_ho_nohat.png'); bgNH, _ = outside_bg(NH)
nh_hair = hairmask(NH, bgNH | eyes | (yy > 900))
front = ['side_L', 'side_R', 'bangs']
# 发根按发流方向分：头发从头顶发旋向外放射。每片在帽檐处占一段方位角，帽檐以上同一方位角范围内的头发就是它的发根；
# 每片的角度范围两边各多留 MARG 度，相邻两片的发根互相重叠（转头错开时不露底）。只取帽檐往上 ROOT_H 像素。
CROWN = (700, 335); ROOT_H = 400; MARG = 5.0
ang = np.degrees(np.arctan2(xx - CROWN[0], yy - CROWN[1]))            # 正下方 = 0°，画面右 = 正
brim = ndi.binary_dilation(hat, iterations=12)
hatz = ndi.binary_dilation(hat, iterations=10) & ~hair2          # 帽子和头发之间有一圈描边，两边的 mask 都不含它，这里并进来
dist_hat = ndi.distance_transform_edt(hat)                              # 帽子里每个点到帽子边缘的距离
ext = {}
for n in front:
    touch = vis[n] & ndi.binary_dilation(hat, iterations=40)
    if touch.sum() < 20: ext[n] = np.zeros((H, W), bool); continue
    a0, a1 = np.percentile(ang[touch], [4, 96])
    if n == 'bangs': a0, a1 = ang[touch].min() - 14, ang[touch].max() + 14          # 刘海组的发根两边放宽 14°：它横移最多（约 80px），帽檐下让出来的地方要有发根垫着
    rh = 110 if n.startswith('side') else ROOT_H          # 侧发只往帽子里取 70px（帽子和侧发最多错开约 50px），刘海组取到发旋
    e = nh_hair & hatz & (yy > CROWN[1] - 6) & (ang >= a0 - MARG) & (ang <= a1 + MARG) & (dist_hat < ROOT_H)
    if n.startswith('side'): e &= ndi.distance_transform_edt(~vis[n]) < rh
    # 发根不能在转头时露到帽子外面：这片相对帽子最多横移 |深度差| × R × sin30° 像素，把帽子左右各收窄这么多（再加 8px），发根只取收窄后的范围
    sh = int(abs(dict((a_, b_) for a_, b_, _ in SPEC)[n] - 0.08) * R_FACE * 0.5) + 8
    # （10-07 回退修复）上一版拿「帽子」本身横向收窄，把帽檐正上方的发根也收掉了——帽檐是斜的，刘海横移时帽檐下面让出来的地方正需要这些发根，结果露出脸的肤色。
    # 该防的只是「发根露到整个头的外轮廓外面（背景上）」，所以改成拿「帽子 + 头发 + 它们围住的脸」这个整头剪影来收窄；帽檐那一侧不受限。
    cover = ndi.binary_fill_holes(ndi.binary_closing(hat | hair2, iterations=8))
    if n.startswith('side'):
        # （#1159 续）侧发的帽下发根不再用「整头剪影横向收窄」去切——那样切出来的边是一条没有描边的直边，转头时帽子外角一让开就露出一条没线的浅色。
        # 改成一直取到去帽图里头发自己的外轮廓（那里有头发原本的外描边）；帽子外角让开时露出来的是带描边的头发边缘。
        pass
    else:
        e &= ndi.binary_erosion(cover, structure=np.ones((1, 2 * sh + 1), bool)) | ~hat
    if n == 'bangs':
        # ④（#1159）低头时帽子相对头发上下错开，帽檐正上方、两束发根的方位角之间和刘海两端外侧原来没有发根，露出后面的额头。
        # 刘海组在帽檐上方 70px 的一整条都补上发根（去帽图的正常头发），横向覆盖整个脸宽以外各 60px；仍受上面「不露到整头轮廓外」的限制。
        d_brim = ndi.distance_transform_edt(hat)                                                       # 帽子里每个点到帽子边缘的距离
        below = ndi.binary_dilation(hair2 & ~hat, iterations=3)
        near_brim = hat & (ndi.distance_transform_edt(~below) < 70) & (yy > 380)
        e |= nh_hair & near_brim & (xx > CX - R_FACE - 60) & (xx < CX + R_FACE + 60) & ndi.binary_erosion(cover, structure=np.ones((1, 2 * sh + 1), bool))
    if n == 'bangs':
        # 发卡下面：发卡是帽子片的一部分，转头时它相对刘海横移约 80px，刘海在发卡位置（外扩 40px）必须有正常的头发垫着，否则露出额头和一圈浅色边。
        # 这里直接取去帽图的头发（那里本来就是正常头发），不受上面「收进帽子轮廓」的限制——发卡四周都是帽子或头发，露不到外面。
        clipz = ndi.binary_dilation(hat & (xx > 930) & (xx < 1230) & (yy > 380) & (yy < 660) & (M[..., 0].astype(int) > 150) & (M[..., 2].astype(int) < 140), iterations=40) & (yy > 380)
        e |= nh_hair & clipz & ~vis[n] & (xx < 1235)
    l, k = ndi.label(ndi.binary_dilation(e | vis[n], iterations=2)); e &= np.isin(l, np.unique(l[vis[n]])); ext[n] = e
# 母版里帽檐那条深色描边被圈进了头发（它其实属于帽子）。离帽子 12px 以内的头发像素改用去帽图的颜色，帽子错开时头发上不会留一条帽檐形的线。
# 帽檐线下面 12px 全用去帽图，12–40px 从去帽图渐变回母版，不留一条硬接缝。
dh_ = ndi.distance_transform_edt(~hat); t_ = np.clip((dh_ - 12) / 28.0, 0, 1)[..., None]
for n in front:
    r_ = vis[n] & (dh_ < 40) & nh_hair
    if r_.sum(): c_ = col[n].copy(); mix_ = NH.astype(np.float32) * (1 - t_) + col[n].astype(np.float32) * t_; c_[r_] = np.clip(mix_, 0, 255).astype(np.uint8)[r_]; col[n] = c_
for n, e in ext.items():
    e = clean_ext(e, vis[n]); ext[n] = e
# 发卡四周：母版里贴着发卡的头发像素带着发卡的投影和描边晕（一圈浅色）。发卡外扩 30px 内刘海组的可见像素全用去帽图，30–60px 渐变回母版；发卡下面的小洞填上。
clipm = hat & (xx > 930) & (xx < 1230) & (yy > 380) & (yy < 660) & (M[..., 0].astype(int) > 150) & (M[..., 2].astype(int) < 140); clipm = ndi.binary_fill_holes(ndi.binary_closing(clipm, iterations=6))
dc_ = ndi.distance_transform_edt(~clipm); tc_ = np.clip((dc_ - 30) / 30.0, 0, 1)[..., None]
rc_ = vis['bangs'] & (dc_ < 60) & nh_hair
c_ = col['bangs'].copy(); mixc = NH.astype(np.float32) * (1 - tc_) + col['bangs'].astype(np.float32) * tc_; c_[rc_] = np.clip(mixc, 0, 255).astype(np.uint8)[rc_]; col['bangs'] = c_
fullb = vis['bangs'] | ext['bangs']; holeb = ndi.binary_fill_holes(fullb) & ~fullb & ndi.binary_dilation(clipm, iterations=40)
ext['bangs'] = ext['bangs'] | holeb
_w = cv2.GaussianBlur(nh_hair.astype(np.float32), (0, 0), 5); NH_soft = np.clip(cv2.GaussianBlur(NH.astype(np.float32) * nh_hair[..., None], (0, 0), 5) / np.maximum(_w, 1e-3)[..., None], 0, 255).astype(np.uint8)
for n, e in ext.items():
    if e.sum() > 50:
        col[n][e] = (NH_soft if n.startswith('side') else NH)[e]; msk[n] |= e; src[n].append('nohat')
        if n.startswith('side'):          # 贴着去帽图头发外轮廓 12px 内用不模糊的原像素，保住那条外描边
            rim_nh = e & ndi.binary_dilation(bgNH, iterations=12); col[n][rim_nh] = NH[rim_nh]
            # 去帽图里头发外轮廓的线是灰青色（亮度约 110），母版里看得见的外轮廓是近黑（亮度约 15）。同一条外轮廓不能上半截灰下半截黑：
            # 贴着外沿 9px 内、比头发底色暗的像素，按「暗的程度」压到母版外描边的近黑色。
            lnh = NH[..., 0] * 0.3 + NH[..., 1] * 0.59 + NH[..., 2] * 0.11; rim9 = e & ndi.binary_dilation(bgNH, iterations=9)
            k_ = np.clip((215 - lnh) / 90.0, 0, 1)[..., None]; dk = col[n].astype(np.float32) * (1 - k_) + np.array([8, 14, 36], np.float32) * k_
            col[n][rim9] = np.clip(dk, 0, 255).astype(np.uint8)[rim9]
            # 发根和可见部分之间留下的细缝（宽 1–3px）补上
            gapfill = ndi.binary_closing(np.pad(msk[n], 6), structure=np.ones((5, 5), bool))[6:-6, 6:-6] & ~msk[n] & ndi.binary_dilation(e, iterations=6)
            if gapfill.sum(): idxg = ndi.distance_transform_edt(~msk[n], return_distances=False, return_indices=True); col[n][gapfill] = col[n][idxg[0], idxg[1]][gapfill]; msk[n] |= gapfill
            # 发根的外描边和可见部分的外描边接头处：沿这片朝外的边（贴着去帽图背景 14px 内，含上面补的细缝和接头两侧 12px 的可见部分），
            # 凡是比底色暗的像素都压到近黑，接头不留一小段灰线。
            joint = msk[n] & ndi.binary_dilation(bgNH, iterations=14) & ndi.binary_dilation(e | gapfill, iterations=12)
            joint &= ~ndi.binary_erosion(msk[n], iterations=9)          # （#1164）只处理这片最外沿 9px
            lj = col[n][..., 0] * 0.3 + col[n][..., 1] * 0.59 + col[n][..., 2] * 0.11
            hard = joint & (lj < 175); col[n][hard] = (8, 14, 36)
            # 发根这段外轮廓：去帽图的线又细又灰（原来露不出来是因为帽子片上那截多余的黑线正好盖着它；那截线去掉后它就露出来了）。
            # 画成和下面可见部分一样的外描边：贴着这片外沿 8px 的一条整条近黑（母版外描边宽约 8–9px）。
            outer8 = (e | gapfill) & ndi.binary_dilation(bgNH, iterations=8) & msk[n]; col[n][outer8] = (8, 14, 36)
            inner2 = (e | gapfill) & msk[n] & ndi.binary_dilation(outer8, iterations=2) & ~outer8; col[n][inner2] = ((col[n][inner2].astype(np.int32) + np.array([8, 14, 36])) // 2).astype(np.uint8)          # 硬阈值：比底色暗的直接成近黑，不留由深到浅的渐变短线头
            # 接头处的灰色软块：发根和可见部分的接头两侧 16px 内，外描边往里 9–24px 那一带里发灰的像素（亮度 < 185，是上面几步衔接留下的由深到浅的渐变），
            # 换成这片里最近的浅色头发像素；外沿 8px 的描边不动。接头处因此只有一条近黑线和干净的浅色头发。
            dout = ndi.distance_transform_edt(msk[n]); jz = msk[n] & ndi.binary_dilation(e | gapfill, iterations=16) & ndi.binary_dilation(vis[n], iterations=16) & (dout > 9) & (dout <= 24)
            ljz = col[n][..., 0] * 0.3 + col[n][..., 1] * 0.59 + col[n][..., 2] * 0.11; grey = jz & (ljz < 185)
            if grey.sum():
                light = msk[n] & (ljz > 205); il = ndi.distance_transform_edt(~light, return_distances=False, return_indices=True); col[n][grey] = col[n][il[0], il[1]][grey]
            # 外沿 8px：接头两侧 16px 内整条近黑（保证和上下两段是同一条线、同样的线宽）
            band8 = msk[n] & (dout <= 8) & ndi.binary_dilation(e | gapfill, iterations=16) & ndi.binary_dilation(vis[n], iterations=16) & ndi.binary_dilation(bgNH | ~cover, iterations=10); col[n][band8] = (8, 14, 36)
# ---- 相邻发束压住的边 ----
# 试过让生图「涂掉上层再补」（hair/08_peel.sh，peel1 出了定稿）：40 步重绘会把整头头发的线条和明暗都改掉（线稿重合降到 85%、色差中位 9.5），
# 补出来的边和母版的可见部分接不上。所以改成确定性的做法：每片在「被更上层发片盖住」的方向上，把自己的颜色顺着延伸 MARGIN 像素
# （取最近的非描边像素的颜色，再沿延伸区做一次小模糊）。延伸区平时完全被上层盖住；转头错开时露出来的是「同一束头发继续往里」的平涂色，
# 没有多余的描边——上层那片自己的描边压在它上面。
MARGIN = {'side_L': 56, 'side_R': 56, 'inner_L': 70, 'inner_R': 70}
DRAFT_OF = {}      # 8 步草稿的逐层揭开图里，这四片被盖住的边画得能用；peel3–5 模型把刘海又画了回去，不能用
peel = json.load(open(IN + 'peel.json')); zidx = {n: i for i, n in enumerate(order0)}
def line_color(n):
    m_ = vis[n] & hair_line(col[n]); return np.median(col[n][m_], 0) if m_.sum() > 50 else np.array([70, 115, 115.])
for n, mg in MARGIN.items():
    above = np.zeros((H, W), bool)
    for o in order0:
        if zidx[o] > zidx[n]: above |= vis[o]
    base = msk[n]; done = False
    if n in DRAFT_OF and os.path.exists(IN + f'reg_peel{DRAFT_OF[n]}_d.png'):
        k = DRAFT_OF[n]; P = rgb(IN + f'reg_peel{k}_d.png'); removed = np.isin(pm, [order0.index(o) + 1 for o in peel[str(k)]]); bgP, _ = outside_bg(P)
        mag = (P[..., 0].astype(int) > 180) & (P[..., 1].astype(int) < 120) & (P[..., 2].astype(int) > 150)
        ph = hairmask(P, bgP | eyes | hat) & ~mag
        allowed = ndi.binary_dilation(removed, iterations=2) & above & ~hat
        e = grow(P, ph, {o: msk[o] for o in DRAFT_OF if DRAFT_OF[o] == k}, allowed, mg + 30)[n] & ~base
        e &= mintish(P) | hair_line(P) | ((P[..., 1].astype(int) > 225) & (P[..., 1].astype(int) >= P[..., 0].astype(int)))      # 只要头发色、描边和高光，草稿在这里画的额头肤色不要
        e = clean_ext(e, base)
        if e.sum() > 400:
            # 草稿的颜色对到这片自己的颜色（取两边贴着切口的像素比中位数），切口处 8px 羽化衔接
            ring_b = base & ndi.binary_dilation(e, iterations=6) & ~hair_line(col[n]); ring_e = e & ndi.binary_dilation(base, iterations=10) & ~hair_line(P)
            Pc = P.astype(np.float32)
            if ring_b.sum() > 30 and ring_e.sum() > 30: Pc = Pc + (np.median(col[n][ring_b], 0) - np.median(P[ring_e], 0))
            d_ = ndi.distance_transform_edt(~base); t = np.clip(d_ / 8.0, 0, 1)[..., None]
            idx = ndi.distance_transform_edt(~(base & ~hair_line(col[n])), return_distances=False, return_indices=True); own = col[n][idx[0], idx[1]].astype(np.float32)
            c = col[n].copy(); mix = own * (1 - t) + Pc * t; c[e] = np.clip(mix, 0, 255).astype(np.uint8)[e]; col[n] = c; msk[n] = base | e; src[n].append(f'draft_peel{k}'); done = True
    if not done:
        # 程序化收边：延伸区收成圆顺的闭合形状，沿它的自由边补一条和这片同色的描边
        e = ndi.binary_dilation(base, iterations=mg) & above & ~base
        u = cv2.GaussianBlur((e | base).astype(np.float32), (0, 0), 7) > 0.5; e = clean_ext(e & u, base)
        if e.sum() < 30: continue
        srcpx = base & ~hair_line(col[n]) & ~ndi.binary_dilation(~base, iterations=3)
        if srcpx.sum() < 30: srcpx = base
        idx = ndi.distance_transform_edt(~srcpx, return_distances=False, return_indices=True); sm = cv2.GaussianBlur(col[n][idx[0], idx[1]], (0, 0), 14)          # 模糊开大：最近像素填充会拉出一条条竖纹，抹成平滑的同色过渡
        c = col[n].copy(); c[e] = sm[e]
        full_ = base | e; rim = full_ & ~ndi.binary_erosion(full_, iterations=4) & e          # 延伸区的外沿 4px
        rim &= ~ndi.binary_dilation(base & ~ndi.binary_erosion(base, iterations=2) & ~ndi.binary_dilation(~full_, iterations=3), iterations=1)
        if n.startswith('side'):
            # （10-07 左脸缘修复，第二版）侧发和刘海组之间的分界是我在一大片头发里人工切的一条近乎竖直的线（画里那儿没有线稿）。两片横移量不同（30° 时差约 35px），
            # 一错开，这条人工切口就成了一道竖直硬边，旁边露出后面的脸。标准做法是「重叠」：侧发在刘海组下面多留 70px，这 70px 用的就是母版里那个位置的头发像素
            # （和刘海组在那儿的像素一模一样）。错开时露出来的是同一片头发的延续，不是空的也不是平涂；刘海组那条切口另做 12px 羽化（见 matte），不留硬边。
            e = ndi.binary_dilation(base, iterations=125) & vis['bangs'] & ~base & ((xx < CX - 140) if n.endswith('L') else (xx > CX + 140))          # 鬓发下半段离侧发的可见部分有 80px 左右，重叠量放到 125px，只取鬓发那一侧（不伸到刘海中间去）
            l_, k_ = ndi.label(e | base); e &= np.isin(l_, np.unique(l_[base])); full_ = base | e
            c = col[n].copy(); c[e] = col['bangs'][e]; src[n].append('master(与刘海组重叠 125px)')
        col[n] = c; msk[n] = full_; src[n].append('extend')
# ---- 后发 5 片：See-through 的完整后发，按 x 分条；条与条之间各多留 45px 重叠（外条压着内条）----
SB = np.asarray(Image.open(IN + 'st_back.png')); sb_a = SB[..., 3] > 128; sb = SB[..., :3]
# 下缘只用一个来源：后发在「纯头」图里看得见的部分（下巴两侧到脖子后面那圈、最下面一排发尖）整块取「纯头」图的像素，
# 不再混用母版像素（母版在领口处被衣服切过，混用会留下矩形接缝）。See-through 的后发只用在平时被脸和其它头发挡住的地方：
# 凡是「纯头」图里是背景的位置一律不要（它自己的下缘发尖和「纯头」图的不重合，留着转头时会露出第二排发尖）。
HBr = rgb(IN + 'reg_ho_body.png'); bgHB, _ = outside_bg(HBr); bgHB = ndi.binary_dilation(bgHB, iterations=7)          # 多让 7px：See-through 的外轮廓带一圈浅色晕边，不能露到「纯头」图的轮廓外
back_all = (sb_a & ~bgHB) | vis['back']
ov = sb_a & ndi.binary_erosion(vis['back'], iterations=4); sbm = sb
if ov.sum() > 2000:
    a_, b_ = lab(sb), lab(HBr); adj = a_.copy()
    for c in range(3): adj[..., c] += np.median(b_[..., c][ov]) - np.median(a_[..., c][ov])
    sbm = cv2.cvtColor(np.clip(adj, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
# （#1159 红棕糊痕）可见后发在右耳旁边那一小条紧贴耳朵的暗红描边，边缘像素是头发色和红线的混色。下面的衔接羽化原来取「最近的可见后发像素」，把这圈带红的边往外抹开了 10px。
# 现在：偏红的像素（R 比 G 高 12 以上）不算可靠的头发色——取色只用「往里收 3px、且不偏红」的可见后发像素；可见后发自己边上偏红的那圈也换成最近的可靠头发色。
_h = HBr.astype(np.int16); reddish = (_h[..., 0] > _h[..., 1] + 12) & (_h[..., 0] > _h[..., 2] + 6)
good = ndi.binary_erosion(vis['back'], iterations=3) & ~ndi.binary_dilation(reddish, iterations=2)
_ig = ndi.distance_transform_edt(~good, return_distances=False, return_indices=True); HBg = HBr[_ig[0], _ig[1]]          # 每个位置最近的可靠后发色
bad_red = vis['back'] & ndi.binary_dilation(reddish, iterations=2)
# 只在右耳旁边这一块用新取色（母版 x 1090–1200、y 850–990）：全片都换会连带改动别处衔接带的颜色（试过：3.6 万像素变化，还把下缘手工蒙版那道缝又填上了一部分），这次只修这一处。
EARZ = (xx > 1090) & (xx < 1200) & (yy > 850) & (yy < 990)
HBg = np.where(EARZ[..., None], HBg, HBr[ndi.distance_transform_edt(~vis['back'], return_distances=False, return_indices=True)[0], ndi.distance_transform_edt(~vis['back'], return_distances=False, return_indices=True)[1]])
bad_red = bad_red & EARZ
bcol = sbm.copy(); bcol[vis['back']] = HBr[vis['back']]; bcol[bad_red] = HBg[bad_red]; print('后发：可见部分里偏红的边缘像素换色', int(bad_red.sum()), 'px')
# 两个来源的交界（都在脸后面）做 10px 羽化
dv_ = ndi.distance_transform_edt(~vis['back']); t_ = np.clip(dv_ / 10.0, 0, 1)[..., None]; idx_ = ndi.distance_transform_edt(~vis['back'], return_distances=False, return_indices=True)
mixb = HBg.astype(np.float32) * (1 - t_) + sbm.astype(np.float32) * t_; nearb = (dv_ > 0) & (dv_ < 10); bcol[nearb] = np.clip(mixb, 0, 255).astype(np.uint8)[nearb]
# ②（#1159）后发两侧的外翘发尖去掉：自动拆层给的完整后发两侧带着和前侧发一样的外翘尖，正面时藏在前侧发后面，一转头就从后面探出来，成了「第二层翘边」。
# 后脑勺不该有翘边：对「后发里正面看不见的部分」做一次大半径开运算（半径 46），细长伸出去的翘尖被抹掉，剩下圆顺的波波头轮廓；
# 正面看得见的那圈（下巴两侧到最下面一排发尖）原样保留。再整体往里收，保证正面时完全藏在前面头发的剪影以内。
front_sil = ndi.binary_fill_holes(ndi.binary_closing(hair2 | hat, iterations=6))                       # 正面时整个头的剪影
DISK46 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (93, 93)).astype(bool)
smooth = cv2.morphologyEx(np.pad(back_all, 60).astype(np.uint8), cv2.MORPH_OPEN, DISK46.astype(np.uint8))[60:-60, 60:-60] > 0
# 收多少按深度差定（引擎里后发的转头深度现在是 0.30）：帽子 0.08 → ±30° 时后发比帽子多横移 36px，所以帽子那一段（帽檐外角以上）后发要比帽子的轮廓横向窄 40px；
# 侧发 0.38 → 只差 13px，所以侧发那一段比整头剪影窄 18px 就够。这样 ±24°–30° 时后发不会从帽子或侧发外缘探出来。
_erH = ndi.binary_erosion(front_sil, structure=np.ones((1, 81), bool)); _er18 = ndi.binary_erosion(front_sil, iterations=18)
_hy = np.where(hat.any(1))[0]; HAT_BOTTOM_OUT = int(np.where((hat & (xx < CX - 420)).any(1))[0].max()) if (hat & (xx < CX - 420)).any() else 760          # 帽子左外角的最低点
inside = np.where(yy < HAT_BOTTOM_OUT + 10, _erH & _er18, _er18)
keep_vis = vis['back']
back_new = (smooth & inside & (yy < 1120)) | (back_all & (yy >= 1120)) | keep_vis
back_new = ndi.binary_fill_holes(back_new)
cut_edge = back_new & ~ndi.binary_erosion(back_new, iterations=5) & ~keep_vis & ndi.binary_dilation(back_all & ~back_new, iterations=6) | (back_new & ~ndi.binary_erosion(back_new, iterations=5) & ~keep_vis & (yy < 1120) & ~ndi.binary_erosion(back_all, iterations=9))
# 新轮廓沿边画 5px 的描边（颜色取后发自己描边的中位色），这是一条新切出来的边，原来没有线
_bl = keep_vis & hair_line(HBr); bline = np.median(HBr[_bl], 0).astype(np.uint8) if _bl.sum() > 50 else np.uint8([22, 30, 50])
bcol_keep = bcol.copy(); bcol = bcol.copy()
# 略压暗以示在后：只压正面看不见的部分，离可见部分 30px 内渐变，免得出一道台阶
dvis = ndi.distance_transform_edt(~keep_vis); kd = (1 - 0.10 * np.clip(dvis / 30.0, 0, 1))[..., None]
bcol = np.clip(bcol.astype(np.float32) * kd, 0, 255).astype(np.uint8)
bcol[cut_edge] = (8, 14, 36)          # （#1164）整头外剪影的线在这套画里一律是近黑；原来取的是后发内部发丝线的灰青色，转头时从侧发外面露出来就成了一段细灰青线
BACK_TRIM = os.environ.get('HAIR_BACK_TRIM', '1') == '1'          # 10-07 总管：W3 正在把后发的转头深度向侧发靠拢，素材这边先不大改轮廓；等引擎里看了还露多少再定。默认关。
print('后发：去掉外翘', int((back_all & ~back_new).sum()), 'px；新描边', int(cut_edge.sum()), 'px', '（已启用）' if BACK_TRIM else '（未启用）')
if BACK_TRIM: back_all = back_new
else: bcol = bcol_keep
col['back'] = bcol; msk['back'] = back_all; src['back'] = ['seethrough_back', 'headonly', 'master']; pending['back'] = []
# ---- 呆毛 ----
# 呆毛的茎（#1164 退回后重做）：一根完整的形状——两侧各一条描边、中间是茎的浅色填充，沿茎自己的走向一直插到帽顶线以下。
# 做法：从根部往上找一行「两侧都是近黑描边、中间是浅色」的干净截面；这一行以下的原像素全部不要（那里描边已经散开、不成形），
# 改成把这行截面沿茎的走向逐行往下平移复制 90 行。帽顶的缺口在帽子片上补成连续弧线后，茎从帽子后面穿出来。
_lumA = M[..., 0] * 0.3 + M[..., 1] * 0.59 + M[..., 2] * 0.11
_ys, _xs = np.where(ahoge); _base = int(_ys.max()); _fx = _xs[_ys > _base - 8]; _fs = int(_fx.min())          # 茎的填充左边界（根部那几行只剩填充）
# 母版里的样子：左侧描边在根部上方约 20px 处就散开了（有缺口），右侧描边（弧的内沿）到根部上方约 10px 处结束，根部最后 10 行只有填充、没有描边。
# yA = 左侧描边最后一行完整（填充左边紧挨着 ≥ 8px 连续近黑）的行；yB = 右侧描边最后一行还在的行。
def _left_ok(y): return ahoge[y, _fs - 8:_fs].all() and (_lumA[y, _fs - 8:_fs] < 70).all()
_yA = next(y for y in range(_base, _base - 60, -1) if _left_ok(y) and _left_ok(y - 1) and _left_ok(y - 2))
_xl = _fs - 1
while ahoge[_yA, _xl - 1] and _lumA[_yA, _xl - 1] < 70: _xl -= 1                                               # 左描边的左缘
def _right_start(y):
    x = _fs
    while x < _fs + 70 and ahoge[y, x] and _lumA[y, x] >= 70: x += 1                                           # 走完填充
    while x < _fs + 70 and not ahoge[y, x]: x += 1                                                             # 跨过填充和描边之间的小缝
    return x if (x < _fs + 70 and ahoge[y, x] and _lumA[y, x] < 70) else None
_yB = next(y for y in range(_base, _base - 60, -1) if _right_start(y) is not None); _r0 = _right_start(_yB)
_fillc = np.median(M[_base - 12:_base - 2, _fs + 3:_fs + 14].reshape(-1, 3), 0).astype(np.uint8); _lc = np.array([8, 14, 36], np.uint8); LW = _fs - _xl
_c = M.copy(); _am = ahoge.copy()
_re = _r0
while _re < _r0 + LW and ahoge[_yB, _re] and _lumA[_yB, _re] < 70: _re += 1          # 母版里右描边在 yB 那一行的右缘
_d0 = _r0 + LW - _re
for _y in range(_yA + 1, _base + 91):
    if _y >= H: break
    _c[_y, _xl:_fs] = _lc; _am[_y, _xl:_fs] = True                                                             # 左描边：从 yA 往下一条直线，宽度和母版一样
    if _y > _yB:                                                                                               # yB 以下：填充 + 右描边，按 yB 那一行的位置直着往下
        _am[_y, _fs:_r0 + LW + 40] = False
        _w = LW - max(0, _d0 - (_y - _yB) // 2)          # 右描边的右缘从母版那一行的位置起，每 2 行往外 1px 渐渐加到整宽——原来一步跳到整宽，贴着帽顶留下一个 3×4px 的小黑台阶（#1164 续 a）
        _c[_y, _fs:_r0] = _fillc; _am[_y, _fs:_r0] = True; _c[_y, _r0:_r0 + _w] = _lc; _am[_y, _r0:_r0 + _w] = True
    else:                                                                                                      # yA–yB 之间：右边保持母版原样，只把填充和右描边之间的小缝补上填充色
        _r = _right_start(_y)
        if _r is not None: _gap = ~_am[_y, _fs:_r]; _c[_y, _fs:_r][_gap] = _fillc; _am[_y, _fs:_r] = True
    _am[_y, max(0, _xl - 30):_xl] = False                                                                      # 左描边左侧散开的零碎不要
print('呆毛茎：左描边从 y =', _yA, '往下（宽', LW, 'px），右描边从 y =', _yB, '往下，茎宽', _r0 + LW - _xl, 'px，原根部 y =', _base)
col['ahoge'] = _c; msk['ahoge'] = _am; vis['ahoge'] = ahoge; src['ahoge'] = ['master', 'extend']; pending['ahoge'] = []
# 发卡下面刘海组里剩下的洞（去帽图在那儿不是头发色的小块）：填上，颜色取去帽图
_cl = ndi.binary_closing(np.pad(msk['bangs'], 20), structure=cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)).astype(bool))[20:-20, 20:-20]          # 洞有一条细缝通到外面，先闭运算再找
_hb = ndi.binary_fill_holes(_cl) & ~msk['bangs'] & ndi.binary_dilation(clipm, iterations=10) & hat
if _hb.sum(): _c = col['bangs'].copy(); _c[_hb] = NH[_hb]; col['bangs'] = _c; msk['bangs'] = msk['bangs'] | _hb; print('发卡下补洞', int(_hb.sum()), 'px')
# ---- 眉毛、睫毛残留 ----
# 母版里眉毛画在头发上面、颜色和头发一样，切发片时留下了眉毛端头的小钩和一道画在头发上的眉形弧线；转头时眉毛片和刘海错开，这些残边会露出来。
# 光头版里眉毛是完整的：取它在眉毛一带的青色像素，放大 7px 当「眉毛区」。发片落在眉毛区里的像素：
#   在发束内部的（把眉毛区挖掉后，对剩下的发片做半径 9 的闭运算能盖回来的）→ 留着，但颜色用周围的头发补平（OpenCV Telea）；
#   伸到发束外面的小钩 → 从发片里去掉。
browzone = np.zeros((H, W), bool)
for (x0_, y0_, x1_, y1_) in ((395, 690, 570, 770), (780, 690, 985, 770)): browzone[y0_:y1_, x0_:x1_] = True
Rb = ndi.binary_dilation(mintish(B) & browzone & ~hair_line(B), iterations=7) | ndi.binary_dilation(mintish(B) & browzone, iterations=5)
# 第二版修法（第一版用 Telea 补平，表情把眉毛抬高后露出浅色小块和缺口）：眉线一带直接换成「去帽再拆」的前发整片（hair/inputs/B_front_bangs_inner_nohat.png）——
# 它的前发层本来就不含眉毛，眉线经过的地方是连续的头发和发丝线，发束的轮廓也是完整的。它比母版略软、有小色差：按眉线区外圈的像素把颜色对到母版，边界 10px 羽化。
BF = np.asarray(Image.open(IN + 'B_front_bangs_inner_nohat.png').convert('RGBA')); bf_a = BF[..., 3] > 128; bf = BF[..., :3]
Z = ndi.binary_dilation(mintish(B) & browzone, iterations=12)
n = 'bangs'
ring = ndi.binary_dilation(Z, iterations=14) & ~ndi.binary_dilation(Z, iterations=2) & msk[n] & bf_a & ~hair_line(col[n]) & ~hair_line(bf)
off = (np.median(col[n][ring], 0) - np.median(bf[ring], 0)) if ring.sum() > 200 else 0
bfc = np.clip(bf.astype(np.float32) + off, 0, 255)
dz = ndi.distance_transform_edt(Z); t = np.clip(dz / 10.0, 0, 1)[..., None]
idxm = ndi.distance_transform_edt(~msk[n], return_distances=False, return_indices=True); own = col[n][idxm[0], idxm[1]].astype(np.float32)        # 这片在该处（或最近处）自己的颜色
mixz = own * (1 - t) + bfc * t; c_ = col[n].copy(); selz = Z & bf_a; c_[selz] = np.clip(mixz, 0, 255).astype(np.uint8)[selz]; col[n] = c_
newm = (msk[n] & ~Z) | selz; removed = int((msk[n] & ~newm).sum()); added = int((newm & ~msk[n]).sum()); msk[n] = newm; vis[n] = vis[n] & newm
src[n].append('seethrough_front_nohat(眉线一带)'); print('眉线一带换成去帽前发：', int(selz.sum()), 'px；去掉', removed, '加上', added)
# ---- 抠图：外轮廓软边 + 去污 ----
bgM2 = np.array([218, 218, 218], np.float32); FRINGE = {}
UNION_ALL = np.zeros((H, W), bool)
for _n, _, _ in SPEC: UNION_ALL |= msk[_n]
def matte(name):
    m = msk[name]; img = col[name].astype(np.float32)
    hol = ndi.binary_fill_holes(m) & ~m; hl_, hn_ = ndi.label(hol)                 # 小于 30px 的内部孔是 mask 的毛刺，填上（颜色取这片自己在该处的像素）
    if hn_:
        hs_ = ndi.sum(hol, hl_, range(1, hn_ + 1)); m = m | np.isin(hl_, [i + 1 for i in range(hn_) if hs_[i] < 30]); msk[name] = m
    a = m.astype(np.float32)
    # 只在「贴着真正背景」的外轮廓做软边：那里的像素混了浅灰底
    edge_out = m & ndi.binary_dilation(~hair2 & ~hat & (np.abs(M2.astype(np.float32) - bgM2).max(-1) < 14), iterations=2) if name != 'ahoge' else np.zeros_like(m)
    out = img.copy()
    if edge_out.any():
        d = np.abs(img - bgM2).max(-1); soft = np.clip((d - 8) / 40, 0, 1)
        a = np.where(edge_out, np.maximum(soft, 0.0), a)
        aa = np.clip(a, 0.3, 1)[..., None]; un = (img - bgM2 * (1 - aa)) / aa; out = np.where(edge_out[..., None], un, img)
    # 片与片之间的切口：1px 羽化（两片在这条线上互相盖住，不会透底）
    a = np.where(m & ~edge_out, 1.0, a)
    a2 = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.6); a = np.where(~m, np.where(ndi.binary_dilation(m, iterations=1), a2, 0), a)
    # 去晕边：头发的外轮廓（朝向所有发片之外的那一侧；后发整片的轮廓全算）外沿 3px 内，比往里 3px 处的像素明显更亮的（浅色晕边），
    # 颜色换成往里最近的像素（通常是描边色）。alpha 不动；只改偏亮的像素，描边和发尖本来就是深色，不会被改。
    band = m & (~ndi.binary_erosion(m, iterations=3) if name == 'back' else ndi.binary_dilation(~UNION_ALL, iterations=3))
    if band.any():
        inner = m & ~ndi.binary_dilation(~m, iterations=3)
        if inner.sum() > 100:
            idx_i = ndi.distance_transform_edt(~inner, return_distances=True, return_indices=True); near = out[idx_i[1][0], idx_i[1][1]]
            lum = lambda x: x[..., 0] * 0.3 + x[..., 1] * 0.59 + x[..., 2] * 0.11
            fr = band & (lum(out) > lum(near) + 18) & (idx_i[0] < 8)
            out = np.where(fr[..., None], near, out); FRINGE[name] = int(fr.sum())
            # 描边外面还挂着的浅色细条（来源图的底色残留，贴在深色描边外侧 2–5px）：外沿 6px 内、自己偏亮、而往里最近的像素是深色描边的，直接去掉。
            band6 = m & (~ndi.binary_erosion(m, iterations=6) if name == 'back' else ndi.binary_dilation(~UNION_ALL, iterations=6))
            stray = band6 & (((lum(img) > 150) & (lum(near) < 95) & (idx_i[0] < 9)) | ((a < 0.6) & (lum(out) > 140)))          # 第二种：半透明又偏亮的边缘像素（软边反预乘时被放大成近白色；细发尖旁边往里找不到 3px 厚的内部，上一条规则够不着）
            # 第三种：来源图的浅灰底被圈进了发片（不透明的一条，贴在描边外侧，浅底上看不见）。底是中性灰（三个通道几乎相等、亮度 195–240），
            # 头发的高光是偏绿的白，按这个区分；只切和片外连通、在外沿 14px 内的。
            i3 = img.astype(np.int16); greybg = m & (i3.max(-1) - i3.min(-1) < 16) & (lum(img) > 150) & (lum(img) < 240)          # 放宽：发尖之间夹着的底色边上是灰到深的过渡像素，上一版只切了一半，留下碎点
            outer14 = m & (~ndi.binary_erosion(m, iterations=14) if name == 'back' else ndi.binary_dilation(~UNION_ALL, iterations=14))
            greybg = ndi.binary_propagation(ndi.binary_dilation(~m, iterations=1) & greybg & outer14, mask=greybg & outer14)
            greybg = ndi.binary_closing(np.pad(greybg, 4), iterations=2)[4:-4, 4:-4] & m & outer14 & (lum(img) > 110) | greybg
            stray = stray | greybg
            a = np.where(stray, 0.0, a); m = m & ~stray; FRINGE[name + '_cut'] = int(stray.sum())
            # 收尾：切完以后，外沿一带留下的碎孔（< 80px、被这片包住的）填回去，外沿 10px 内还剩的偏亮近中性像素改成往里最近的颜色——发尖之间夹着的小条底色不再是「一半切掉一半留着」的碎点。
    # 透明处的颜色用最近的不透明像素填（出血），免得缩放采样时带进杂色
    idx = ndi.distance_transform_edt(~m, return_distances=False, return_indices=True); out = np.where(m[..., None], out, out[idx[0], idx[1]])
    return np.clip(out, 0, 255).astype(np.uint8), np.clip(a, 0, 1)
meta = {'space': 'head_master_px', 'size': [W, H], 'face_half_width_R': R_FACE, 'head_center_x': CX, 'depth_note': '以半脸宽 R 为 1、朝镜头为正；转头 θ 时横向位移 = depth × R × sin θ；负值按字面反向',
        'weight_note': '<名>_w.png 与该片 PNG 同尺寸同对位，发根 1 → 发梢 0；权重 1 跟头的曲面走，权重 0 取 anchor 处的位移做平移', 'bleed_px': 0, 'face_layer_goes_after': 'inner_R', 'pieces': []}
A = {}
for z, (name, depth, (y1, y0)) in enumerate(SPEC):
    img, a = matte(name)
    if name == 'bangs':
        # 刘海组和侧发之间的人工切口：12px 羽化（下面有侧发的重叠区垫着，正面叠回去不变）
        sv = ndi.binary_dilation(vis['side_L'] | vis['side_R'], iterations=2); dsv = ndi.distance_transform_edt(~sv)
        cut = (dsv < 12) & (a > 0) & (msk['side_L'] | msk['side_R'])
        cut &= ~ndi.binary_dilation(LINE2, iterations=8)          # 切口上有一段正好沿着母版的真线稿走（右鬓发外缘 y≈670–800）：那里不羽化，线留在刘海组上（原来羽化把它抹掉了，成了 129px 的缺口）
        a = np.where(cut, a * np.clip(dsv / 12.0, 0, 1), a)
    if name == 'back':
        # 外沿挂着的细碎残线（宽不到 4px 的细线、小点：切底色时留下的描边碎屑，引擎的描边检查从外往里数会先碰到它们）：对 alpha 做半径 2 的开运算，开运算去掉的、又不在主体 2px 以内的像素清掉。
        # 这是唯一一处开运算，只删「细于 4px 且离主体远」的碎屑；发尖是 6px 以上的粗描边，不受影响（下面打印被删的像素数）。
        _m = a > 0.5; _core = ndi.binary_opening(np.pad(_m, 4), structure=cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)).astype(bool))[4:-4, 4:-4]
        _l, _k = ndi.label(_core); _sz = ndi.sum(_core, _l, range(1, _k + 1)); _core = np.isin(_l, [i + 1 for i in range(_k) if _sz[i] > 400])          # 开运算后剩下的小碎块也不算主体
        _crumb = (a > 0) & ~ndi.binary_dilation(_core, iterations=3); a = np.where(_crumb, 0.0, a); print('后发外沿碎屑清掉', int(_crumb.sum()), 'px')
        # 手工蒙版（10-07，总管要求）：右下两根发尖之间的那道斜缝里夹着「纯头」图的浅灰底，规则切不干净。沿缝手描一个多边形（母版坐标），
        # 多边形里偏亮的像素（不是深色描边的）和半透明碎点一律设为透明；两侧发尖的深色描边不在多边形里，不受影响。
        poly = np.array([(1237, 1131), (1241, 1136), (1234, 1150), (1229, 1160), (1227, 1170), (1221, 1178), (1213, 1183), (1206, 1181), (1210, 1172), (1219, 1161), (1226, 1148), (1232, 1138)], np.int32)
        pm_ = np.zeros((H, W), np.uint8); cv2.fillPoly(pm_, [poly], 1); pm_ = pm_ > 0
        lumi = img[..., 0] * 0.3 + img[..., 1] * 0.59 + img[..., 2] * 0.11
        kill = pm_ & ((lumi > 62) | (a < 0.95)); a = np.where(kill, 0.0, a); print('手工蒙版去掉', int(kill.sum()), 'px')
    m = a > 0.02; ys, xs = np.where(m); x0, y0b, x1, y1b = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    if name == 'ahoge': w = np.clip((yy - 60) / 110, 0, 1).astype(np.float32)          # 呆毛：根在下
    else: w = np.clip((y0 - yy) / max(y0 - y1, 1), 0, 1).astype(np.float32); w = w * w * (3 - 2 * w)
    w = np.where(m, w, 0)
    save_rgba(img[y0b:y1b, x0:x1], a[y0b:y1b, x0:x1], paths.S('hair', 'pieces', f'{name}.png')); Image.fromarray((w[y0b:y1b, x0:x1] * 255).astype(np.uint8)).save(paths.S('hair', 'pieces', f'{name}_w.png'))
    top = m & (w > 0.9); 
    if top.sum() < 50: top = m & (w >= np.percentile(w[m], 85))
    ay, ax = [float(v) for v in ndi.center_of_mass(top)]; lo = m & (w <= np.percentile(w[m], 8)); ty, tx = [float(v) for v in ndi.center_of_mass(lo)]
    v = vis[name] & m; holes = ndi.binary_fill_holes(m) & ~m; hl, hn = ndi.label(holes); hs = [int(s) for s in ndi.sum(holes, hl, range(1, hn + 1))] if hn else []
    meta['pieces'].append(dict(name=name, z=z + 1, depth=depth, rect=[int(x0), int(y0b), int(x1 - x0), int(y1b - y0b)], file=f'pieces/{name}.png', weight=f'pieces/{name}_w.png',
        anchor=[round(ax, 1), round(ay, 1)], axis=[[round(ax, 1), round(ay, 1)], [round(tx, 1), round(ty, 1)]], attach_y=[y1, y0], behind_face=name in FACE_BEHIND,
        sources=src[name], has_inpaint=len(src[name]) > 1 or src[name][0] != 'master', pending=pending[name], visible_px=int(v.sum()), hidden_px=int((m & ~vis[name]).sum()), inner_holes=hs))
    A[name + '_rgb'] = img; A[name + '_a'] = (a * 255).astype(np.uint8); A[name + '_w'] = (w * 255).astype(np.uint8); A[name + '_vis'] = vis[name]
    print(f"{z+1:2d} {name:8s} depth {depth:+.2f} vis {int(v.sum()):6d} hidden {int((m & ~vis[name]).sum()):6d} src {src[name]} pending {pending[name]} holes {hs}")
print('去晕边改的像素数', FRINGE)
json.dump(meta, open(paths.S('hair', 'hair.json'), 'w'), ensure_ascii=False, indent=1); np.savez_compressed(paths.W('hair', 'asm.npz'), **A)
