#!/usr/bin/env python3
"""空脸片段的「面部遮罩」（#1262，2026-10-10 用户定）：不扣图，五官的墨迹贴在每一帧自己算出来的遮罩里。

遮罩逐帧从**这一帧自己**算（片段帧的头发、帽子、脸轮廓、皮肤一个像素都不改，贴上去的只有五官墨迹）：
  base 遮罩（眼、鼻、嘴、腮红用）= 这一帧里「含鼻点的肤色连通区域」（空脸上是一整片均匀肤色，被脸轮廓线、刘海边、手 / 袖子的描边围住），
            限制在按 headTrack 搬过来的归位空脸轮廓外扩 8px 以内；再往外放 3px，**只放进发色像素**（宁可五官多露一点、压到头发边上，也不切五官、不改头发）。
  top 遮罩（眉用，画在刘海上层）= base 遮罩 ∪ 脸附近 35px 以内的发色像素。
遮挡物一律不在遮罩里：手、袖子、袖口、任何道具——它们既不是肤色区域（或是另一块被描边隔开的肤色区域）、也不是发色，
  遮罩边缘再乘上「不是（非肤色且非发色）的像素」：描边、袖子、深色线上一个像素的墨迹都不会有（硬要求：脸不许出现在手前面）。
  拿不准的按遮挡物处理：含鼻点的区域取不到（鼻点被盖住）就取轮廓内最大的一块肤色。
  遮挡判定只认「脸前多出来的东西」，不认「手」这个特例。
时间上：单帧冒出来的突起（这一帧有、前后两帧附近都没有）去掉；单帧的缺口不补（缺口可能就是真的遮挡）。边缘 0.8px 软化。
输出每帧两张 uint8 图（base, top，帧坐标，0–255）。"""
import cv2, numpy as np
from scipy import ndimage as ndi


def skin_px(bgra):
    b, g, r, a = [bgra[..., i].astype(np.int16) for i in range(4)]
    return (a > 200) & (r > 195) & (r - b > 14) & (r - b < 100) & (g > 150)


def hair_px(bgra):
    b, g, r, a = [bgra[..., i].astype(np.int16) for i in range(4)]
    lum = (114 * b + 587 * g + 299 * r) // 1000
    mint = (g - r > 6) & (b - g <= 14) & (g > 45)                                          # 薄荷色发丝和较亮的青色发丝（B 比 G 高不超过 14）
    dark = (g - r >= -4) & (lum > 60) & (lum < 170) & (b - g <= 14)                       # 深青色的发丝描边（R、G 接近）：手的描边是近黑偏红的（G < R − 4），不会进来
    return (a > 200) & (mint | dark)                                                       # 帽子（B−G≈23）、袖口（≈26）、白袖子（亮度 > 200）、肤色（R 比 G 高很多）都不算


def comp_at(mask, seed, snap=12):
    """含 seed 的连通块；seed 不在 mask 里就找 snap px 以内最近的 mask 像素。取不到返回 None。"""
    lab, n = ndi.label(mask, structure=np.ones((3, 3)))
    if n == 0: return None
    x, y = int(round(seed[0])), int(round(seed[1])); H, W = mask.shape
    if 0 <= y < H and 0 <= x < W and lab[y, x] > 0: return lab == lab[y, x]
    y0, y1, x0, x1 = max(0, y - snap), min(H, y + snap + 1), max(0, x - snap), min(W, x + snap + 1)
    sub = lab[y0:y1, x0:x1]; ys, xs = np.nonzero(sub)
    if len(ys) == 0: return None
    k = np.argmin((ys + y0 - y) ** 2 + (xs + x0 - x) ** 2); return lab == sub[ys[k], xs[k]]


def rest_silhouette(rest_bgra, nose):
    """归位空脸帧上的脸轮廓：含鼻点的肤色连通区域，填洞。"""
    m = comp_at(skin_px(rest_bgra), nose, 20)
    return ndi.binary_fill_holes(m) if m is not None else np.zeros(rest_bgra.shape[:2], bool)


def face_tone_limit(rest_bgra, sil):
    """这张脸自己的肤色上限：归位空脸帧脸内肤色 G、B 的 99.5 百分位再放宽（G +2、B +6）。比这更亮的肤色（手的肤色比脸亮 4–10 个色阶）不算这张脸，
    手的描边断了、手和脸的肤色直接连在一起时靠它分开。"""
    px = rest_bgra[sil & skin_px(rest_bgra)]
    return float(np.percentile(px[:, 1], 99.5)) + 2, float(np.percentile(px[:, 0], 99.5)) + 6          # (G 上限, B 上限)；BGRA 通道序：0=B、1=G


def hand_region(fr, d, skin, hair, opaque, far, close=15):
    """遮挡物的轮廓线围起来的区域（手心和脸同色，不算「多出来的」，但被手自己的描边围住）：
    「新线」= 比搬过来的空脸多出来的（差 > 30，非发色）或非肤色非发色的不透明像素（挨着发丝的细线和发丝边的暖色线不算），去掉 < 150px 的碎块，
    闭运算 15px（补描边的小缺口，比如拇指边那条细棕线）后把外轮廓里面全填上。和 clips/face_mask_hand_check.py 的「手区域」同一条定义。"""
    b_, g_, r_ = [fr[..., i].astype(np.int16) for i in range(3)]; warm = (r_ - g_ > 25) & ((114 * b_ + 587 * g_ + 299 * r_) // 1000 > 90)
    hair_adj = cv2.dilate(hair.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    new = far & opaque & ~(warm & (cv2.dilate(hair.astype(np.uint8), np.ones((13, 13), np.uint8)) > 0)) & ~hair_adj & (((d > 30) & ~hair) | (~skin & ~hair))
    new = cv2.morphologyEx(new.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)); n, lab, st, _ = cv2.connectedComponentsWithStats(new)
    new = np.isin(lab, [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] >= 150]).astype(np.uint8)
    closed = cv2.morphologyEx(new, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (close, close)))
    cs, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); out = np.zeros_like(closed); cv2.drawContours(out, cs, -1, 1, -1)
    return out > 0


MULTI = True
HANDIN = float(__import__('os').environ.get('FACE_MASK_HANDIN', 0.6))      # 非鼻点的肤色块，有这么大比例落在「遮挡物轮廓围起来的区域」里就不算脸
HANDALL = bool(int(__import__('os').environ.get('FACE_MASK_HANDALL', 1)))
ENCLOSED = float(__import__('os').environ.get('FACE_MASK_ENCLOSED', 0.85))      # 非鼻点的肤色块，边界上「新线」占比 ≥ 这个值就不算脸（手心 / 袖口里面）
GUARD = 5          # 遮挡物外扩多少 px（圆形核直径）内一点墨迹都不画；env FACE_MASK_GUARD 可改（合成测试用）
import os as _os
GUARD = int(_os.environ.get('FACE_MASK_GUARD', GUARD))


def one(fr, M, sil, nose, tone=None, rest=None, eye_y=None, want_d=False):
    H, W = fr.shape[:2]
    sil_w = cv2.warpAffine(sil.astype(np.uint8) * 255, np.float32(M), (W, H), flags=cv2.INTER_LINEAR) > 127
    near = cv2.dilate(sil_w.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0            # 外扩 8px
    far = cv2.dilate(sil_w.astype(np.uint8), np.ones((81, 81), np.uint8)) > 0             # 外扩 40px（眉画在头发上，范围放宽）
    skin, hair = skin_px(fr), hair_px(fr); opaque = fr[..., 3] > 200
    seed = M[:, :2] @ np.asarray(nose, np.float64) + M[:, 2]
    d_new = None
    face_skin = skin & ((fr[..., 1] <= tone[0]) & (fr[..., 0] <= tone[1]) if tone else True)         # 比这张脸自己的肤色亮的（手）不算脸
    if rest is not None:           # 和「按 headTrack 搬过来的空脸归位帧」比：脸范围里偏差 > 10 个色阶的肤色（手肤色里偏暗的部分、道具……）不算干净的脸（边缘按 ±2px 容差）
        pred = cv2.warpAffine(rest[..., :3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.int16); fr16 = fr[..., :3].astype(np.int16); d = np.full((H, W), 255, np.int16)
        for dy in (-2, -1, 0, 1, 2):                                                              # 容许 ±2px 错位：这一像素和「预测的脸」周围 5×5 里最接近的那个比
            for dx in (-2, -1, 0, 1, 2): d = np.minimum(d, np.abs(fr16 - np.roll(pred, (dy, dx), (0, 1))).max(2))
        face_skin = face_skin & (d <= 10); d_new = d
    fs0 = face_skin & near
    handfill = hand_region(fr, d_new, skin, hair, opaque, far) if d_new is not None else np.zeros((H, W), bool)
    handwide = hand_region(fr, d_new, skin, hair, opaque, far, 41) if d_new is not None else np.zeros((H, W), bool)       # 宽闭运算（41px）：拇指肉垫这种被拇指描边 / 手心 / 腕带围着的、和脸同色的小块（不通到脸）也算在手里；只用来判「鼻点那块以外的肤色块」要不要并进脸
    fs = cv2.morphologyEx(fs0.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))) > 0          # 开运算：窄于 5px 的细桥（手的描边被运动模糊画淡后留下的 1–2px 肤色缝）断开，手那块就不会顺着桥并进脸
    comp = comp_at(fs, seed, 12)
    if comp is not None and MULTI:                         # 手 / 道具把脸分成几块时，其余也是「脸的肤色（不比这张脸亮、和搬过来的空脸偏差 ≤ 10）」的大块也算脸（鼻点那块之外的）
        lab_, n_ = ndi.label(fs, structure=np.ones((3, 3))); sizes = np.bincount(lab_.ravel(), minlength=n_ + 1)
        for k in range(1, n_ + 1):
            if sizes[k] < 120: continue
            blk = lab_ == k
            if handfill[blk].mean() >= HANDIN or handwide[blk].mean() >= HANDIN: continue      # 大半在「遮挡物的轮廓线围起来的区域」里的肤色块 = 手心 / 袖口里面（和脸同色、描边闭合或有小缺口），不算脸
            if False:                       # 被「新线」围死的块是手 / 道具的里面（手心和脸同色、描边闭合，开运算把它和脸断开后会被当成脸的碎块）：一圈边界里 ≥ 85% 是比搬过来的空脸多出来的东西（差 > 30）= 遮挡物的内部，不算脸。
                ring = (cv2.dilate(blk.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & ~blk & opaque                # 被头发 / 脸轮廓线围住的碎块：边界上这些和空脸一致，比例低，仍算脸
                if ring.sum() > 0 and (ring & (d_new > 30)).sum() >= ENCLOSED * ring.sum(): continue
            comp = comp | blk
    if comp is None:                                                                         # 鼻点被盖住：取轮廓内最大的一块肤色
        lab, n = ndi.label(fs, structure=np.ones((3, 3)))
        comp = (lab == 1 + int(np.argmax(np.bincount(lab.ravel())[1:]))) if n else np.zeros((H, W), bool)
    comp = comp | (cv2.dilate(comp.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & fs0 & ~(cv2.dilate((~fs0 & opaque & ~hair).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)      # 开运算削掉的边缘一圈补回来（只补离非肤色非发色的东西 1px 以外、离这块脸 2px 以内的）
    labf, nf = ndi.label(fs0, structure=np.ones((3, 3))); szf = np.bincount(labf.ravel(), minlength=nf + 1)
    frag = np.isin(labf, [k for k in range(1, nf + 1) if szf[k] < 120]) & ~comp                # 刘海缝里露出来的碎肤色（脸的肤色、不比脸亮、和搬过来的空脸一致，只是被头发隔成小块）：是脸，不是遮挡物
    frag = frag & ~(cv2.dilate((opaque & ~skin & ~hair).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)    # 紧挨着描边 / 袖子（非发色的深色线）4px 以内的不算：那是手 / 道具边上的肤色
    comp = comp | frag
    other = (opaque & ~skin & ~hair) | (skin & ~comp)                                         # 描边、袖子、袖口、道具……（脸前多出来的东西 + 脸轮廓线），以及不是这块脸的肤色（手）：一个像素的墨迹都不许有
    b0_, g0_, r0_ = [fr[..., i].astype(np.int16) for i in range(3)]; warm0 = (r0_ - g0_ > 25) & ((114 * b0_ + 587 * g0_ + 299 * r0_) // 1000 > 90)
    grow = (cv2.dilate(comp.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0) & hair        # 往外放 3px，只放进发色像素
    base = comp | grow
    above = np.ones((H, W), bool) if eye_y is None else (np.arange(H)[:, None] < eye_y)                      # 眉画在头发上：只在眼线以上放宽进发色区（眼线以下的头发是挡在脸前的，不放）
    lines = cv2.dilate((opaque & ~skin & ~hair & ~warm0).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0                  # 非发色的深色线（手 / 袖口 / 道具的描边）及外扩 2px
    top = base | ((cv2.dilate(comp.astype(np.uint8), np.ones((121, 121), np.uint8)) > 0) & hair & far & above) | (fs0 & ~lines & far)   # 眉线要能压过刘海缝里被开运算削掉的细肤色条：脸色的肤色（不比脸亮、和搬过来的空脸一致）只要不挨着遮挡物的描边都放行
    # 眉画在刘海边上：刘海和皮肤交界处有一圈偏暖的亮线（R 比 G 高 25 以上、亮度 > 90），眉线要能压过它（眉原画就压着这条线）；手 / 袖口的描边是近黑的深线，不在此列
    b_, g_, r_ = [fr[..., i].astype(np.int16) for i in range(3)]; warm = opaque & ~skin & ~hair & (r_ - g_ > 25) & ((114 * b_ + 587 * g_ + 299 * r_) // 1000 > 90)
    hair_adj = cv2.dilate(hair.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0                       # 挨着发丝的细线（刘海和皮肤交界处的描边、抗锯齿像素）：眉线本来就压着它们，不当遮挡物
    if comp is not None and d_new is not None:
        cut = handfill & ~comp if not HANDALL else handfill                       # HANDALL：连鼻点那块里落在遮挡物轮廓区域里的也去掉（拇指边这类没围死的缺口处，手心会连进脸的肤色块）
        top = top & ~cut; base = base & ~cut
    if want_d: return base, top, other, other & ~warm & ~hair_adj, d_new, handfill
    return base, top, other, other & ~warm & ~hair_adj


STABLE = int(_os.environ.get('FACE_MASK_STABLE', '1'))      # 1 = 稳定底：和搬过来的空脸一致（没有新东西）的脸内像素，遮罩恒为开，不随逐帧肤色判断抖动；0 = 旧算法


def series(frames, Ms, rest_bgra, nose, use_pred=True, refs=None):
    """frames：RGBA 帧列表，Ms：每帧 2×3，→ [(base_u8, top_u8)]。"""
    sil = rest_silhouette(rest_bgra, nose); tone = face_tone_limit(rest_bgra, sil); B, T, O, OT, D, HF = [], [], [], [], [], []
    H, W = rest_bgra.shape[:2]
    if STABLE and use_pred:       # 空脸归位帧自己的遮罩（没有任何遮挡物）：逐帧搬过去当稳定底
        I = np.float64([[1, 0, 0], [0, 1, 0]]); ey0 = float(np.mean([refs[k][1] for k in ('eyeL', 'eyeR')])) - 10 if refs else None
        rb, rt = one(rest_bgra, I, sil, nose, tone, None, ey0)[:2]
    for fr, M in zip(frames, Ms):
        ey = float(np.mean([(M[:, :2] @ np.asarray(refs[k], np.float64) + M[:, 2])[1] for k in ('eyeL', 'eyeR')])) - 10 if refs else None
        b, t, o, ot, d, hf = one(fr, M, sil, nose, tone, rest_bgra if use_pred else None, ey, want_d=True); B.append(b); T.append(t); O.append(o); OT.append(ot); D.append(d); HF.append(hf)
    n = len(B); k5 = np.ones((7, 7), np.uint8); out = []
    for i in range(n):
        nb = [j for j in (i - 1, i + 1) if 0 <= j < n]
        def deb(X):                                                                          # 去掉单帧突起：这一帧有、前后帧（膨胀 3px）都没有的
            near = np.zeros_like(X[i])
            for j in nb: near |= cv2.dilate(X[j].astype(np.uint8), k5) > 0
            return X[i] & near
        b, t = deb(B), deb(T)
        o_i = O[i]; el = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (GUARD, GUARD)); Od = None
        if STABLE and use_pred and D[i] is not None:
            fr = frames[i]; d = D[i]; opq = fr[..., 3] > 200
            real = (d > 30) | HF[i]                                                           # 这一帧真多出来的东西（和搬过来的空脸有差、或在遮挡物轮廓区域里）
            o_real = o_i & real
            o_static = (opq & ~skin_px(fr) & ~hair_px(fr)) & ~real                            # 和空脸一致的深色线（脸轮廓线、刘海边）：不当遮挡物，不留让开的边（睫毛两端就压在这条线上）
            Od = cv2.dilate(o_real.astype(np.uint8), el) == 0
            M_ = np.float32(Ms[i]); keep = ~(cv2.dilate(real.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (GUARD, GUARD))) > 0)
            wb = cv2.warpAffine(rb.astype(np.uint8), M_, (W, H), flags=cv2.INTER_NEAREST) > 0
            wt = cv2.warpAffine(rt.astype(np.uint8), M_, (W, H), flags=cv2.INTER_NEAREST) > 0
            k7 = np.ones((7, 7), np.uint8); gate_b = cv2.dilate(B[i].astype(np.uint8), k7) > 0; gate_t = cv2.dilate(T[i].astype(np.uint8), k7) > 0    # 只在这一帧自己判出的脸边缘 3px 内补：和脸同色、被描边围起来的手心 / 拇指肉垫离脸块远，不会被补进来
            wb = wb & keep & (d <= 30) & opq & gate_b; wt = wt & keep & (d <= 30) & opq & gate_t & ~hair_px(fr)      # 稳定底只放行「没有新东西」的像素；头发在这一帧飘到脸前（和空脸有差）的地方不放
            sil_w = cv2.warpAffine(sil.astype(np.uint8), M_, (W, H), flags=cv2.INTER_NEAREST) > 0
            lin = (o_static | (hair_px(fr) & (d <= 30))) & ~(cv2.dilate(real.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (GUARD, GUARD))) > 0) & (cv2.dilate(sil_w.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0) & gate_b    # 脸轮廓线 / 刘海边上和空脸一致的深色线：原画里眼尾睫毛尖就压在这条线上，放行（和线同色，盖上去看不出；遮挡物 = 有新东西的地方照旧让开）
            b = b | wb | lin; t = t | wb | lin | (wt & ~hair_px(fr))
        if Od is None: Od = cv2.dilate(o_i.astype(np.uint8), el) == 0
        tonly = t & ~b; lab, nl = ndi.label(tonly, structure=np.ones((3, 3)))                     # 眉放宽区里的碎渣（被手切成的小条）去掉：< 30px 的孤立小块
        if nl: sz = np.bincount(lab.ravel(), minlength=nl + 1); small = np.isin(lab, [k for k in range(1, nl + 1) if sz[k] < 30]); t = t & ~small
        Odt = cv2.dilate(OT[i].astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))) == 0          # 眉的遮挡物只外扩 1px（眉本来就贴着发丝描边画）
        sb = cv2.GaussianBlur((b & Od).astype(np.float32), (0, 0), 0.7) * Od; st = cv2.GaussianBlur((t & Odt).astype(np.float32), (0, 0), 0.7) * Odt       # 先硬裁再软化再硬裁：软化只发生在脸一侧，遮挡物外 2px 内一点墨迹都没有
        out.append(((sb * 255).round().astype(np.uint8), (st * 255).round().astype(np.uint8)))
    return out
