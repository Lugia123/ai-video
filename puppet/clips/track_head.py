#!/usr/bin/env python3
"""片段逐帧头部跟踪（「铆钉」）+ 脸前遮挡物：让口型、眨眼、表情脸这些贴片在动作进行中也能钉在脸上，而且不盖住挡在脸前的手、袖子、头发。

    python3 puppet/clips/track_head.py puppet/characters/<角色>/<片段库> <片段名> [<片段名>…] [--no-paste 片段名,…]

每一帧：
1. 对位：归位帧头部（帽子、发卡、头发、脸）的 SIFT 特征和这一帧双向匹配，RANSAC 求相似变换（平移 + 旋转 + 缩放）；
   手这类挡在前面的东西是离群点，自动剔掉。变换参数沿时间轻微平滑（高斯 σ=0.7 帧）。
2. 上限读数：把归位帧按变换搬过来，在眼角、嘴角、鼻点、发卡几个参照点上做小范围模板匹配，量「对位之后还差多少」。
3. 脸前遮挡物（通用，不认具体动作）。证据是组合的，不靠单独一条：
   a 「新东西」：这一帧和「搬过来的归位帧」不一样的像素。比的时候容许 ±2px 的错位（和 5×5 邻域里每个像素都不一样才算），
     所以对位差一两个像素、线条粗细略变不会被当成新东西。
   b 「从外面伸进来」：五官（眼、嘴）范围以外的成块新东西直接算遮挡物（袖子、手臂、手的描边、飘过来的头发）。
     五官范围以内，原帧自己的眼睛、嘴会变（模型加的眨眼、张嘴），不能直接算；只有和外面的遮挡物**同一类颜色**（肤色 / 白 / 深色 / 其他）
     并且连成一片的新东西才算——袖子盖到眼睛上是「白色、连着外面的白袖子」，自己眨眼是「肤色、只在眼眶里、不连外面」。
   c 「围住的里面」：手盖在脸颊上时手心和脸同色、不算新东西，但手的描边是；描边围住的洞一起算。
   d 时间：某一帧冒出、前后帧附近都没有的一块去掉；前后帧都有、这一帧漏掉的补上。
   头发另算：搬过来的归位帧前发 ∪ 这一帧紧挨着的发色像素。
4. 两张遮罩（存成一张左右拼的小图）：左 = 贴片可画（脸的范围里，去掉头发和遮挡物）；右 = 画在头发上层的贴片（眉）可画（只去掉遮挡物）。
   等价于「贴片画完后把原帧的遮挡物重新画回最上面」，边界是遮挡物自己的轮廓。
5. 可贴判定：内点够、残差小、五官没被挡掉太多才算 ok；ok 沿时间做过渡成权重 w。--no-paste 的片段（转圈）整段不可贴。
6. 自动读数（每帧）：yield_eye_px = 眼眶范围里被让开的像素（没有东西挡着时应当是 0，否则会露出原来的眼睛）；
   yield_px = 贴片占地里被让开的像素；cover_alien_px = 贴片会盖住的「脸上不该有的颜色」（白、藏青）像素（应当接近 0，否则盖住了袖子）。
写进 clips.json 的 headTracks[帧文件]；遮罩图在 <库>/track/。可当模块用：Tracker(库目录).align(帧) / .occlusion(帧, M)（合成测试 occlusion_test.py 用）。"""
import json, os, sys
import cv2, numpy as np
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from brow_erase import erase as erase_brow

REF = ['eyeL', 'eyeR', 'mouth', 'nose', 'pin']


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED).astype(np.float32)
def flat(im, bg=255.0): a = im[..., 3:] / 255; return (im[..., :3] * a + bg * (1 - a)).astype(np.uint8)
def sim(M): return float(np.hypot(M[0, 0], M[1, 0])), float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
def compose(scale, rot, cx, cy, c0):
    r = np.radians(rot); a, b = scale * np.cos(r), scale * np.sin(r)
    return np.array([[a, -b, cx - a * c0[0] + b * c0[1]], [b, a, cy - b * c0[0] - a * c0[1]]], np.float64)
def dil(m, k): return cv2.dilate(m.astype(np.uint8), np.ones((k, k), np.uint8)).astype(bool)
def skin(im): return (im[..., 2] > 195) & (im[..., 2].astype(np.int16) - im[..., 0] > 14) & (im[..., 1] > 150) & (im[..., 2].astype(np.int16) - im[..., 1] > 6)
def haircol(im): return (im[..., 1].astype(np.int16) - im[..., 2] > 6) & (im[..., 1] > 110)


class Tracker:
    def __init__(self, root, rest_path=None):
        self.root = root = root.rstrip('/'); char = os.path.dirname(root); self.P = P = lambda *p: os.path.join(root, *p)
        self.lib = lib = json.load(open(P('clips.json'), encoding='utf-8')); self.W, self.H = W, H = lib['canvas']['w'], lib['canvas']['h']
        self.rest = rest = rgba(rest_path or P(lib['poses'][lib['rest']]['frame'])); pt = lib['poses'][lib['rest']]['patches']; al = pt['align']
        r = np.radians(al['rotate_deg']); Mm = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0]]) * al['scale']; Mm[:, 2] = al['translate']; self.Mm = Mm
        face = json.load(open(os.path.join(char, 'source', 'face', 'face.json'), encoding='utf-8')); org = face['head_org']; parts = {p['id']: p for p in face['parts']}
        parts.update({p['id']: p for p in json.load(open(os.path.join(char, 'source', 'face', 'eyes.json'), encoding='utf-8'))['parts']})
        hair = json.load(open(os.path.join(char, 'source', 'hair', 'hair.json'), encoding='utf-8'))
        to_rest = lambda x, y: Mm[:, :2] @ np.array([x, y], np.float64) + Mm[:, 2]
        rc = lambda pid: (parts[pid]['rect'][0] + parts[pid]['rect'][2] / 2, parts[pid]['rect'][1] + parts[pid]['rect'][3] / 2)
        corners = np.array([to_rest(org[0] + x, org[1] + y) for x, y in ((0, 0), (1408, 0), (0, 1300), (1408, 1300))]); hx0, hy0 = np.floor(corners.min(0)).astype(int); hx1, hy1 = np.ceil(corners.max(0)).astype(int)
        self.c0 = np.array(to_rest(*rc('nose')))
        hmask = np.zeros((H, W), np.uint8); hmask[max(0, hy0):hy1, max(0, hx0):hx1] = 255; hmask[rest[..., 3] < 128] = 0
        self.sift = cv2.SIFT_create(5000, contrastThreshold=0.02); self.k1, self.d1 = self.sift.detectAndCompute(cv2.cvtColor(flat(rest), cv2.COLOR_BGR2GRAY), hmask)
        ew = {s: parts['eyeWhite' + s]['rect'] for s in 'LR'}
        self.refs = refs = {'eyeL': to_rest(ew['L'][0], ew['L'][1] + ew['L'][3] * .5), 'eyeR': to_rest(ew['R'][0] + ew['R'][2], ew['R'][1] + ew['R'][3] * .5), 'mouth': to_rest(*rc('mouth_closed')), 'nose': to_rest(*rc('nose'))}
        hsv0 = cv2.cvtColor(flat(rest), cv2.COLOR_BGR2HSV); yel = ((hsv0[..., 0] > 15) & (hsv0[..., 0] < 32) & (hsv0[..., 1] > 120) & (hsv0[..., 2] > 150) & (hmask > 0)).astype(np.uint8)
        n_, lab_, st_, cen_ = cv2.connectedComponentsWithStats(yel); refs['pin'] = cen_[1 + int(np.argmax(st_[1:, cv2.CC_STAT_AREA]))] if n_ > 1 else self.c0
        def layers(ids, th=10):                       # 这些素材层不透明处的并集（归位帧坐标）
            m = np.zeros((2200, 2400), np.uint8)
            for i in ids:
                x, y, w, h = parts[i]['rect']; im = cv2.imread(os.path.join(char, 'source', 'face', parts[i]['src']), cv2.IMREAD_UNCHANGED)
                if (im.shape[1], im.shape[0]) != (round(w), round(h)): im = cv2.resize(im, (max(1, round(w)), max(1, round(h))))
                x, y = int(round(x)), int(round(y)); m[y:y + im.shape[0], x:x + im.shape[1]] = np.maximum(m[y:y + im.shape[0], x:x + im.shape[1]], (im[..., 3] > th) * 255)
            return cv2.warpAffine(m, Mm, (W, H), flags=cv2.INTER_LINEAR) > 127
        def rects(rs, pad=0):
            m = np.zeros((2200, 2400), np.uint8)
            for x, y, w, h in rs: m[int(y) - pad:int(y + h) + pad, int(x) - pad:int(x + w) + pad] = 255
            return cv2.warpAffine(m, Mm, (W, H), flags=cv2.INTER_LINEAR) > 127
        # 脸的范围 = 脸底素材的轮廓（往里收 2px），不是矩形：矩形的竖边会在脸颊上切出一条线，矩形的角会伸到脸的轮廓外面。
        # 任何贴片、垫层、腮红块都只画在这里面（外眼角压着头发的睫毛翘尖那几小块除外）。
        fx, fy, fw, fh = parts['face']['rect']; face_full = layers(['face'], 200) & rects([(fx, fy + fh * .25, fw, fh * .75)]); self.face_m = cv2.erode(face_full.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
        eye_ids = [i for i in parts if i.startswith(('eyeWhite', 'iris', 'lash', 'eyeLow'))]
        self.eye_m = dil(layers(eye_ids), 17)                                                           # 眼眶范围（原画眼睛外扩 8px）= 眼块的占地
        self.face_m |= self.eye_m & dil(face_full, 5)        # 眼眶范围里不往里收、反而放出 2px：外眼角的睫毛尾一直画到脸的轮廓线上，收进去就盖不住它
        self.brow_sides = [layers([i], 100) for i in parts if i.startswith('brow')]                        # 两条原眉各自的形状
        self.brow_core = dil(layers([i for i in parts if i.startswith('brow')], 60), 5)                  # 原眉本身（外扩 2px）
        self.brow_m = dil(layers([i for i in parts if i.startswith('brow')]), 21)                        # 眉带：原画两条眉外扩约 10px（盖住对位 2px 误差和片段里眉自己的轻微移动）
        self.feat_m = self.eye_m | dil(layers([i for i in parts if i.startswith('mouth_')]), 13)         # 五官范围：这里面原帧自己会变
        hm_rig = np.zeros((2200, 2400), np.uint8); after = False
        for pc in sorted(hair['pieces'], key=lambda p: p['z']):
            if after and not pc.get('behind_face'):
                im = cv2.imread(os.path.join(char, 'source', 'hair', pc['file']), cv2.IMREAD_UNCHANGED); x, y = int(pc['rect'][0] + org[0]), int(pc['rect'][1] + org[1]); hm_rig[y:y + im.shape[0], x:x + im.shape[1]] = np.maximum(hm_rig[y:y + im.shape[0], x:x + im.shape[1]], im[..., 3])
            if pc['name'] == hair.get('face_layer_goes_after'): after = True
        self.hair_rest = cv2.warpAffine(hm_rig, Mm, (W, H), flags=cv2.INTER_LINEAR) > 100
        # 睫毛「画在头发上面」的地方（外眼角的翘尖压着侧发）：归位帧里这里看得见深色的睫毛。只有这几小块允许贴片盖到头发上；
        # 被刘海盖住的那段上睫毛不算（那里头发在上面，贴片不许碰，否则把刘海下缘的发梢盖虚）。
        rb_ = flat(rest); self.lash_hair = dil(dil(layers([i for i in parts if i.startswith('lash')]), 5) & self.hair_rest & (rb_.max(2) < 90), 5) & self.hair_rest
        # 贴片占地（归位帧坐标）：所有表情的眼、嘴、腮红块，加口型、眨眼
        fp = np.zeros((H, W), bool)
        def add(q):
            im = cv2.imread(P(q['file']), cv2.IMREAD_UNCHANGED)
            if im is None: return
            x, y = q['rect'][:2]; fp[y:y + im.shape[0], x:x + im.shape[1]] |= im[..., 3] > 100
        for f in (pt.get('face') or {}).values():
            for k in ('eyes', 'mouth', 'blush'):
                if k in f: add(f[k])
        for q in list((pt.get('mouth') or {}).values()) + [pt[k] for k in ('blink',) if k in pt]: add(q)
        self.foot = fp if fp.any() else self.feat_m
        ys, xs = np.where(self.face_m); pad = 90; self.box = (xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad)

    def align(self, fr):
        """→ (M 2×3, {inliers, residual}) 或 (None, None)。"""
        k2, d2 = self.sift.detectAndCompute(cv2.cvtColor(flat(fr), cv2.COLOR_BGR2GRAY), (fr[..., 3] > 128).astype(np.uint8) * 255)
        if d2 is None or len(k2) < 8: return None, None
        fwd = {m.queryIdx: m for m, n2 in cv2.BFMatcher().knnMatch(self.d1, d2, k=2) if m.distance < 0.8 * n2.distance}
        back = {m.queryIdx: m.trainIdx for m, n2 in cv2.BFMatcher().knnMatch(d2, self.d1, k=2) if m.distance < 0.85 * n2.distance}
        good = [m for q, m in fwd.items() if back.get(m.trainIdx) == q]
        if len(good) < 8: return None, None
        src = np.float32([self.k1[m.queryIdx].pt for m in good]); dst = np.float32([k2[m.trainIdx].pt for m in good])
        M, inl = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=2.0, maxIters=5000, confidence=0.999)
        if M is None: return None, None
        res = np.linalg.norm(src @ M[:, :2].T + M[:, 2] - dst, axis=1)[inl.ravel() == 1]
        return M, {'inliers': int(inl.sum()), 'residual': float(res.mean())}

    def warp(self, m, M): return cv2.warpAffine(m.astype(np.uint8) * 255, np.float32(M), (self.W, self.H), flags=cv2.INTER_LINEAR) > 127

    def occlusion(self, fr, M):
        """这一帧的脸前遮挡物（未做时间处理）和头发。→ dict，都是帧坐标的布尔图。"""
        W, H = self.W, self.H; pred = cv2.warpAffine(self.rest, np.float32(M), (W, H), flags=cv2.INTER_LINEAR); bgr, pbgr = flat(fr), flat(pred)
        fm, eye, feat, foot, hr = (self.warp(m, M) for m in (self.face_m, self.eye_m, self.feat_m, self.foot, self.hair_rest))
        near = dil(fm, 61); opaque = fr[..., 3] > 128; pa = pred[..., 3] > 128
        # a 新东西：容许 ±2px 错位的差异
        A = cv2.GaussianBlur(bgr, (0, 0), 0.8).astype(np.int16); B = cv2.GaussianBlur(pbgr, (0, 0), 0.8).astype(np.int16); D = np.full((H, W), 999, np.int16)
        for dy in range(-2, 3):
            for dx in range(-2, 3): D = np.minimum(D, np.abs(A - np.roll(B, (dy, dx), (0, 1))).max(2))
        # 颜色种类变了（归位帧这里是肤色、这一帧是发色，或反过来）时门槛降一半：浅色的发梢高光盖在皮肤上，RGB 只差二三十，但一个偏绿一个偏红
        kind_changed = (haircol(bgr) & skin(pbgr)) | (skin(bgr) & haircol(pbgr) & ~skin(pbgr))
        new = ((D > 36) | ((D > 16) & kind_changed) | (opaque & ~dil(pa, 5))) & opaque & near
        # b 从外面伸进来：五官范围外的成块新东西 = 种子；五官范围内只收和种子同类颜色、连成一片的
        featw = dil(feat, 5)
        # （不做开运算：手的描边只有两三个像素宽，一开就没了；错位造成的假差异已经由 ±2px 的容许挡掉）
        seed = np.zeros((H, W), bool); n, lab, st, _ = cv2.connectedComponentsWithStats((new & ~featw).astype(np.uint8), connectivity=8)
        for j in range(1, n):
            if st[j, cv2.CC_STAT_AREA] >= 60: seed |= lab == j
        occ = seed.copy()
        mn, mx = bgr.min(2).astype(np.int16), bgr.max(2).astype(np.int16); sk = skin(bgr); wh = (mn > 200) & (mx - mn < 45) & ~sk; dk = (mx < 120); ot = ~(sk | wh | dk)
        comps = [cv2.connectedComponentsWithStats((new & cls).astype(np.uint8), connectivity=8) for cls in (sk, wh, dk, ot)]
        for _ in range(3):                     # 从外面的遮挡物往五官范围里长：每一类颜色各自连成片的新东西，挨着已认定的遮挡物就收进来；长三轮（描边 → 里面的肤色 → 另一侧描边）
            sd = dil(occ, 5); grew = False
            for n, lab, st, _c in comps:
                if n > 1:
                    hit = [j for j in np.unique(lab[sd & (lab > 0)]) if st[j, cv2.CC_STAT_AREA] >= 12]
                    if hit: add = np.isin(lab, hit) & ~occ; grew |= bool(add.any()); occ |= add
            if not grew: break
        # 手的肤色区域：帧里的肤色被帧自己的描边分成一块一块。脸是包含鼻点的那一块；别的肤色块只要挨着已认定的遮挡物，就整块算遮挡物
        # （手心压在脸颊上和脸同色、不算「新东西」，但它被手自己的描边和脸隔开了）；再把这块外面一圈的深色像素（它的描边）补上——
        # 描边压在原来的睫毛上、深色压深色认不出时，靠这一步把手的轮廓定下来。
        n, lab, st, _ = cv2.connectedComponentsWithStats((sk & opaque & near).astype(np.uint8), connectivity=4)
        if n > 1:
            pn = np.round(M[:, :2] @ self.c0 + M[:, 2]).astype(int); patch = lab[max(0, pn[1] - 6):pn[1] + 7, max(0, pn[0] - 6):pn[0] + 7]; facelab = np.bincount(patch[patch > 0]).argmax() if (patch > 0).any() else -1
            # 遮挡物横在脸上会把脸的肤色切成几块；被切下来的那块仍是脸（归位帧在那里本来就是脸的肤色），不能当成手——
            # 只收「大半不在归位帧的脸皮肤上」的肤色块（手多半伸在头发、空底、衣服上面）。整只手都压在脸皮肤上的情形靠描边围洞那一步。
            pskin = skin(pbgr) & pa
            touch = [j for j in np.unique(lab[dil(occ, 5) & (lab > 0)]) if j != facelab and st[j, cv2.CC_STAT_AREA] >= 40 and (pskin & (lab == j)).sum() < 0.5 * st[j, cv2.CC_STAT_AREA]]
            if touch: hand = np.isin(lab, touch); occ |= hand | (dil(hand, 7) & dk)
        # c 围住的里面：合上小缝、填洞
        occ = ndi.binary_fill_holes(cv2.morphologyEx(occ.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(bool))
        # 遮挡物的描边正好压在原来的深色线（上睫毛）上时，那一段「深色压深色」不算新东西，轮廓就断了一截，贴片会把那段描边盖成肤色。
        # 补：遮挡物凹进去的地方（半径 12 的闭运算补出来的范围）里，这一帧的深色像素算作它的描边。代价是紧挨着遮挡物的一小段原睫毛也会留下。
        hull = cv2.morphologyEx(occ.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))).astype(bool)
        occ |= hull & dk & dil(occ, 9) | (hull & ~featw)
        # 五官范围里去掉遮挡物上细于 5px 的尾巴：紧挨着手的那一小段原睫毛是「深色连着深色」被带进来的，留着就是手边的几个黑点
        occ = (occ & ~featw) | (cv2.morphologyEx(occ.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool) & featw)
        occ = dil(occ, 3) & opaque                                                # 只外扩 1px：扩多了，被手截断的线条和手之间会留一道缝
        hair_f = hr | (haircol(bgr) & dil(hr, 13) & ~featw) | (haircol(bgr) & ~haircol(pbgr) & fm & ~featw)
        return {'occ': occ, 'lash_hair': self.warp(self.lash_hair, M), 'hair': hair_f & ~self.warp(self.lash_hair, M), 'hair_all': hair_f | (haircol(bgr) & dil(hair_f, 5) & ~dil(eye, 1) | (haircol(bgr) & dil(hr, 7))), 'fm': fm, 'eye': eye, 'feat': feat, 'foot': foot, 'bgr': bgr, 'pbgr': pbgr, 'opaque': opaque}

    @staticmethod
    def temporal(occs):
        """d 时间：单帧冒出的块去掉，单帧漏掉的补上。"""
        out = []
        for t, o in enumerate(occs):
            nb = [occs[i] for i in (t - 1, t + 1) if 0 <= i < len(occs)]
            if not nb: out.append(o); continue
            around = dil(np.logical_or.reduce(nb), 81); n, lab, st, _ = cv2.connectedComponentsWithStats(o.astype(np.uint8)); keep = o.copy()
            for j in range(1, n):
                if not (around & (lab == j)).any(): keep[lab == j] = False
            if len(nb) == 2: keep |= nb[0] & nb[1]
            out.append(keep)
        return out

    def masks(self, info, occ):
        """→ (贴片可画, 画在头发上层的可画)，0–1 浮点。"""
        base = info['opaque'] & ~occ
        allow = cv2.GaussianBlur(((info['fm'] | info['lash_hair']) & ~info['hair'] & base).astype(np.float32), (0, 0), 1.0)
        # 画在头发上层的（眉）：靠近遮挡物的地方淡出（离遮挡物 2px 起、10px 处才全显），别齐刷刷顶在手上
        # 头发上层的贴片（擦原眉、新眉）只让开大块的遮挡物（手、袖子，≥ 1200px）：头歪的时候发梢、挑染相对头会动一点，被判成小块的「新东西」，
        # 要是也让开，擦原眉和新眉在那里一起被挖掉，原眉就露出一小截（2026-10-08 逐格看到的）。
        n_o, lab_o, st_o, _ = cv2.connectedComponentsWithStats(occ.astype(np.uint8)); hc = haircol(info['bgr']); big = np.isin(lab_o, [j for j in range(1, n_o) if st_o[j, cv2.CC_STAT_AREA] >= 1200 and hc[lab_o == j].mean() < 0.6])      # 大块、而且不是头发（头歪时一大片头发相对归位帧错开，也会成块，那不是遮挡物）
        ramp = np.clip((ndi.distance_transform_edt(~big) - 2) / 8, 0, 1).astype(np.float32); base = info['opaque'] & ~big
        top = cv2.GaussianBlur((dil(info['fm'], 161) & base).astype(np.float32), (0, 0), 1.0) * ramp        # 头发上层的范围放大：抬高的眉在脸的轮廓上方很远
        return allow, top

    def underlay(self, info, occ):
        """眼睛底下垫的肤色（这一帧自己的）：眼眶范围里，用块外一圈这一帧实际的肤色（含腮红）由近到远平滑铺进来。
        换眼睛的表情只带线和眼白，肤色用这张垫——所以不会在脸上留一块和这一帧明暗、腮红位置对不上的浅色块。→ (BGR 浮点图, alpha 0–1)"""
        b = info['bgr'].astype(np.float32); zone = dil(info['eye'], 7)
        valid = (skin(info['bgr']) & ~zone & ~dil(occ, 5) & info['fm'] & ~info['hair'] & info['opaque']).astype(np.float32)
        fill = np.zeros_like(b) + (np.median(b[valid > 0], axis=0) if valid.any() else 220); done = np.zeros(valid.shape, bool)
        for sg in (5, 10, 20, 40):
            w = cv2.GaussianBlur(valid, (0, 0), sg); f = cv2.GaussianBlur(b * valid[..., None], (0, 0), sg) / np.maximum(w[..., None], 1e-6); use = (w > 0.06) & ~done; fill[use] = f[use]; done |= use
        # 垫层不许盖到头发：范围里去掉头发（刘海始终在最上面），羽化只往肤色里落
        keep = zone & ~dil(info['hair_all'], 3) & info['fm']
        return cv2.GaussianBlur(fill, (0, 0), 3), cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.5) * (~info['hair_all']).astype(np.float32)

    def stats(self, info, occ):
        b = info['bgr']; mn, mx = b.min(2).astype(np.int16), b.max(2).astype(np.int16)
        alien = (((mn > 200) & (mx - mn < 30)) | ((b[..., 0].astype(np.int16) - b[..., 2] > 25) & (mx < 150))) & ~info['feat']          # 白（袖子）、藏青（袖口、衣服）；五官里的眼白不算
        pb = info['pbgr']; pmn, pmx = pb.min(2).astype(np.int16), pb.max(2).astype(np.int16)
        alien &= ~dil(((pmn > 200) & (pmx - pmn < 30)) | ((pb[..., 0].astype(np.int16) - pb[..., 2] > 25) & (pmx < 150)), 7)      # 归位帧这里本来就是白 / 藏青的不算（头发高光、领子）
        can = info['fm'] & ~info['hair'] & ~occ & info['opaque']
        return {'yield_eye_px': int((occ & info['eye']).sum()), 'yield_px': int((occ & info['foot']).sum()), 'cover_alien_px': int((can & info['foot'] & alien).sum()),
                'occluded': round(float((occ & info['feat']).sum() / max(1, info['feat'].sum())), 3)}


FEATWIN = {'eyeL': (293, 385, 392, 482), 'eyeR': (440, 385, 541, 482), 'mouth': (380, 466, 446, 508)}       # 逐五官跟踪的模板窗口（归位帧坐标）：左眼、右眼、嘴（含周围一点点脸）


def feat_offsets(rest_g, frame_g, M, S=10):
    """两遍法的「逐五官」：A 里的眼、嘴是模型和脸一起画的，它们各自的逐帧位置就是「协调」。
    把 A 这一帧按整头变换 M 转回归位帧坐标（旋转、缩放消掉），在里面对每个五官的归位帧模板做 ±S px 的模板匹配（亚像素，抛物线插值），
    得到「相对整头变换的残余位移」（归位帧坐标），再用 M 的线性部分换回帧坐标。→ {名: (dx, dy, 匹配分)}"""
    H, W = rest_g.shape; al = cv2.warpAffine(frame_g, np.float32(M), (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE); out = {}
    for k, (x0, y0, x1, y1) in FEATWIN.items():
        tp = rest_g[y0:y1, x0:x1]; win = al[y0 - S:y1 + S, x0 - S:x1 + S]
        if win.shape[0] != tp.shape[0] + 2 * S or win.shape[1] != tp.shape[1] + 2 * S: out[k] = (0.0, 0.0, 0.0); continue
        res = cv2.matchTemplate(win, tp, cv2.TM_CCOEFF_NORMED); _, mx, _, (cx, cy) = cv2.minMaxLoc(res); sx = sy = 0.0
        if 0 < cx < res.shape[1] - 1 and 0 < cy < res.shape[0] - 1:
            a, b, c = res[cy, cx - 1], res[cy, cx], res[cy, cx + 1]; d = a - 2 * b + c; sx = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
            a, b, c = res[cy - 1, cx], res[cy, cx], res[cy + 1, cx]; d = a - 2 * b + c; sy = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
        d_rest = np.array([cx - S + sx, cy - S + sy]); out[k] = (*(M[:, :2] @ d_rest), float(mx))
    return out


def smooth_feat(raw, min_ncc=0.6, max_off=8.0):
    """raw: [n] 个 {名: (dx, dy, ncc)}。匹配分太低（闭眼 / 被手挡）或偏移太离谱的帧不用，用相邻好帧的偏移线性插值（头尾取最近的好帧；整条都不好 = 0）；
    再对偏移曲线做 3 帧中值（只去单帧毛刺，不抹真实微动）。→ ({名: [n,2] 平滑后}, {名: [n,2] 补完未平滑}, {名: 好帧数})"""
    n = len(raw); sm, pre, good = {}, {}, {}
    for k in FEATWIN:
        a = np.array([[r[k][0], r[k][1]] for r in raw]); ok = np.array([r[k][2] >= min_ncc and np.hypot(r[k][0], r[k][1]) <= max_off for r in raw]); good[k] = int(ok.sum())
        if ok.any(): a = np.stack([np.interp(np.arange(n), np.nonzero(ok)[0], a[ok, c]) for c in range(2)], 1)
        else: a = np.zeros((n, 2))
        pre[k] = a; sm[k] = ndi.median_filter(a, size=(3, 1), mode='nearest')
    return sm, pre, good

PERFEAT = False       # --per-feature：两遍法下逐五官（左眼、右眼、嘴）各自用 A 里的实测位置，存 headTracks[帧].feat（播放器 ?perfeat=1 才用）
INKMASK = False       # --ink-mask：空脸库的面部遮罩（track_ink/），和旧遮罩并存，播放器按 lib.faceMode 选
REFINE = False       # --refine：用 track_refine.smooth_series 代替 σ=0.7 帧的高斯平滑（抖动读数见 clips/track_jitter.py）
BLANK = False        # --blank：空脸库。脸上没有五官可对，只用帽子、头发的特征点定位；门槛放宽（内点 ≥ 12、残差 ≤ 2.0px），可贴的帧权重一律 1


def main():
    global BLANK, REFINE, INKMASK, PERFEAT
    PERFEAT = '--per-feature' in sys.argv; BLANK = '--blank' in sys.argv; REFINE = '--refine' in sys.argv; INKMASK = '--ink-mask' in sys.argv
    SRCA, RESTA = {}, None                       # --src-a clip=帧目录[,clip=帧目录] --rest-a 有五官的归位帧.png：两遍法，定位用有五官那遍（A）的帧，原样用到本库（空脸遍 B）同名片段上
    for flag in ('--src-a', '--rest-a'):
        if flag in sys.argv:
            i = sys.argv.index(flag); v = sys.argv[i + 1]; sys.argv[i:i + 2] = []
            if flag == '--src-a': SRCA = dict(x.split('=', 1) for x in v.split(',') if x)
            else: RESTA = v
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; nopaste = set()
    if '--no-paste' in sys.argv: nopaste = set(sys.argv[sys.argv.index('--no-paste') + 1].split(',')); args = [a for a in args if a not in nopaste and ',' not in a]
    T = Tracker(args[0]); TA = Tracker(args[0], RESTA) if SRCA else None; clips = args[1:] + sorted(nopaste); P, lib, W, H, c0 = T.P, T.lib, T.W, T.H, T.c0
    os.makedirs(P('track'), exist_ok=True); tracks = {}; summary = []
    for clip in clips:
        files = lib['clips'][clip]['frames']; frames = [rgba(P(f)) for f in files]; n = len(files)
        two = clip in SRCA                      # 两遍法：定位的帧 = A（有五官），贴的帧 = B（空脸）
        if two:
            fa = sorted(f for f in os.listdir(SRCA[clip]) if f.endswith('.png')); assert len(fa) == n, f'{clip}：A 片 {len(fa)} 帧，B 片 {n} 帧，帧数要一样'
            tframes = [rgba(os.path.join(SRCA[clip], f)) for f in fa]; TT = TA
        else: tframes, TT = frames, T
        raw = [TT.align(fr) for fr in tframes]
        idx = [i for i, (M, q) in enumerate(raw) if M is not None and q['inliers'] >= 12]
        if not idx: print(clip, '一帧都没对上'); continue
        arr = []
        for i in idx: M = raw[i][0]; s_, r_ = sim(M); c = M[:, :2] @ c0 + M[:, 2]; arr.append([s_, r_, c[0], c[1]])
        arr = np.array(arr); full = np.stack([np.interp(np.arange(n), idx, arr[:, j]) for j in range(4)], 1)
        if REFINE:       # 精修（clips/track_refine.py）：脸周围锚点的亚像素跟踪 + 稳健最小二乘 + SIFT 软先验（实测比逐帧 SIFT 再 σ=0.7 高斯平滑的局部误差小 40%、相对抖动小 30%）
            import track_refine; full = track_refine.refine_clip(TT.rest, tframes, full, c0)[0]
        else: full = ndi.gaussian_filter1d(full, 0.7, axis=0, mode='nearest')
        if clip in nopaste:
            for f in files: tracks[f] = {'ok': False, 'w': 0}
            summary.append(f'{clip}（{n} 帧）：标为不可贴（--no-paste）；能对上的帧 {len(idx)}/{n}'); continue
        Ms = [compose(*full[i], c0) for i in range(n)]; infos = [T.occlusion(fr, M) for fr, M in zip(frames, Ms)]; occs = T.temporal([q['occ'] for q in infos]); rows = []
        # 垫层的时间连贯：每帧垫层的平均色沿时间做一次轻的平滑（σ=1 帧），把逐帧的小抖动压掉；垫层的空间内容仍是这一帧自己的
        inkm = None
        if INKMASK:                                                                   # 面部遮罩（空脸库）：逐帧从这一帧自己算，见 clips/face_mask.py
            import face_mask; os.makedirs(P('track_ink'), exist_ok=True); inkm = face_mask.series(frames, Ms, T.rest, T.c0, refs=T.refs)
        unders = [T.underlay(info, occ) for info, occ in zip(infos, occs)]
        um = np.array([(u[0] * u[1][..., None]).sum((0, 1)) / max(1e-6, u[1].sum()) for u in unders]); us = ndi.gaussian_filter1d(um, 1.0, axis=0, mode='nearest'); ushift = us - um
        lum = lambda a: a @ np.array([.114, .587, .299]); st0 = np.abs(np.diff(lum(um))); st1 = np.abs(np.diff(lum(us)))
        under_note = f'垫层平均亮度相邻帧台阶：平滑前 最大 {st0.max():.2f}（>2 的帧 {[int(i) + 1 for i in np.where(st0 > 2)[0]]}），平滑后 最大 {st1.max():.2f}（>2 的帧 {[int(i) + 1 for i in np.where(st1 > 2)[0]]}）'
        for i, f in enumerate(files):
            M, info, occ = Ms[i], infos[i], occs[i]; q = raw[i][1] if raw[i][0] is not None else None; rr = {}
            if two: rbgr = flat(tframes[i]); rpb = flat(cv2.warpAffine(TT.rest, np.float32(M), (W, H), flags=cv2.INTER_LINEAR))     # 参照点残差在 A 上量（有五官，眼角嘴角看得见）
            else: rbgr, rpb = info['bgr'], info['pbgr']
            for name in REF:
                p = M[:, :2] @ np.asarray(T.refs[name], np.float64) + M[:, 2]; x, y = int(round(p[0])), int(round(p[1])); t, sr = 14, 8
                if y - t - sr < 0 or x - t - sr < 0 or y + t + sr >= H or x + t + sr >= W: continue
                sc = cv2.matchTemplate(rbgr[y - t - sr:y + t + sr + 1, x - t - sr:x + t + sr + 1], rpb[y - t:y + t + 1, x - t:x + t + 1], cv2.TM_CCOEFF_NORMED); _, mxv, _, loc = cv2.minMaxLoc(sc)
                if mxv > 0.6: rr[name] = round(float(np.hypot(loc[0] - sr, loc[1] - sr)), 1)
            allow, top = T.masks(info, occ); st = T.stats(info, occ)
            dx, dy = int(round(full[i][2] - c0[0])), int(round(full[i][3] - c0[1])); bx0, by0, bx1, by1 = T.box; x0, y0 = max(0, bx0 + dx), max(0, by0 + dy); x1, y1 = min(W, bx1 + dx), min(H, by1 + dy)
            rel = f'track/{os.path.splitext(f)[0].replace("frames/", "").replace("/", "_")}.png'; both = np.hstack([allow[y0:y1, x0:x1], top[y0:y1, x0:x1]])
            cv2.imwrite(P(rel), np.dstack([np.full(both.shape + (3,), 255, np.uint8), (both * 255).round().astype(np.uint8)]))
            mink = None
            if inkm:
                relk = 'track_ink/' + rel[len('track/'):]; bothk = np.hstack([inkm[i][0][y0:y1, x0:x1], inkm[i][1][y0:y1, x0:x1]])
                cv2.imwrite(P(relk), np.dstack([np.full(bothk.shape + (3,), 255, np.uint8), bothk])); mink = {'file': relk, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'halves': ['base', 'top']}
            uf, ua = unders[i]; uf = uf + ushift[i]      # 加了时间平滑的偏移后可能超出 0–255，写盘前必须夹住（否则回绕成青色的色块）
            uy, ux = np.where(ua > 0.01); under = None
            if len(uy):
                ux0, uy0, ux1, uy1 = ux.min(), uy.min(), ux.max() + 1, uy.max() + 1; urel = rel[:-4] + '_u.png'
                cv2.imwrite(P(urel), np.clip(np.dstack([uf[uy0:uy1, ux0:ux1], ua[uy0:uy1, ux0:ux1] * 255]), 0, 255).round().astype(np.uint8)); under = {'file': urel, 'rect': [int(ux0), int(uy0), int(ux1 - ux0), int(uy1 - uy0)]}
            ok = bool(q is not None and q['inliers'] >= (12 if BLANK and not two else 20) and q['residual'] <= (2.0 if BLANK and not two else 1.6) and st['occluded'] < 0.6 and abs(full[i][1]) < 25 and 0.85 < full[i][0] < 1.15)
            rows.append(dict({'file': f, 'm': [round(float(M[0, 0]), 5), round(float(M[1, 0]), 5), round(float(M[0, 2]), 2), round(float(M[1, 2]), 2)], 'scale': round(float(full[i][0]), 4), 'rot_deg': round(float(full[i][1]), 2),
                              'shift': [round(float(full[i][2] - c0[0]), 1), round(float(full[i][3] - c0[1]), 1)], 'inliers': q['inliers'] if q else 0, 'residual_px': round(q['residual'], 2) if q else None,
                              'ref_residual_px': rr, 'ok': ok, **({'trackedFrom': 'A'} if two else {}), **({'maskInk': mink} if mink else {}), 'mask': {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'halves': ['under_hair', 'over_hair']}, 'under': under}, **st))
        okv = np.array([1.0 if q['ok'] else 0.0 for q in rows]); wv = np.clip(ndi.gaussian_filter1d(np.minimum(okv, ndi.uniform_filter1d(okv, 3, mode='nearest')), 0.8, mode='nearest') * 1.15 - 0.075, 0, 1) * okv
        wv = np.where((okv > 0) & (ndi.minimum_filter1d(okv, 3, mode='nearest') > 0), 1.0, wv)
        if BLANK: wv = okv.copy()                      # 空脸片段：脸全靠贴片画，不能有半透明过渡（过渡帧会露出空脸）；可贴的帧一律不透明                   # 前后都可贴的帧一律不透明
        if PERFEAT and two:
            rg = cv2.cvtColor(flat(TT.rest), cv2.COLOR_BGR2GRAY); rawf = [feat_offsets(rg, cv2.cvtColor(flat(tframes[i]), cv2.COLOR_BGR2GRAY), Ms[i]) for i in range(n)]; sm, pre, good = smooth_feat(rawf)
            for i, q in enumerate(rows): q['feat'] = {k: [round(float(sm[k][i][0]), 2), round(float(sm[k][i][1]), 2)] for k in FEATWIN}
            mag = {k: np.hypot(*sm[k].T) for k in FEATWIN}; dsm = {k: np.hypot(*(sm[k] - pre[k]).T) for k in FEATWIN}
            summary.append(f'{clip} 逐五官：好帧 ' + ' '.join(f'{k}{good[k]}/{n}' for k in FEATWIN) + '；相对整头变换的偏移 均值/最大 px ' + ' '.join(f'{k}{mag[k].mean():.2f}/{mag[k].max():.2f}' for k in FEATWIN) + '；中值平滑前后差 均值/最大 ' + ' '.join(f'{k}{dsm[k].mean():.2f}/{dsm[k].max():.2f}' for k in FEATWIN))
        for q, w_ in zip(rows, wv): q['w'] = round(float(w_), 3); tracks[q.pop('file')] = q
        sh = np.array([q['shift'] for q in rows]); rot = [q['rot_deg'] for q in rows]; refmax = {k: max([q['ref_residual_px'].get(k, 0) for q in rows]) for k in REF}
        summary.append(under_note); summary.append(f'{clip}（{n} 帧）：头最远偏 ({np.abs(sh[:, 0]).max():.1f}, {np.abs(sh[:, 1]).max():.1f})px，旋转 {min(rot):.2f}°–{max(rot):.2f}°；内点最少 {min(q["inliers"] for q in rows)}，残差最大 {max(q["residual_px"] or 0 for q in rows)}px；'
                       f'参照点还差（最大）{refmax}；可贴 {int(okv.sum())}/{n}；眼眶被让开 合计 {sum(q["yield_eye_px"] for q in rows)}px（最多第 {int(np.argmax([q["yield_eye_px"] for q in rows]))} 帧 {max(q["yield_eye_px"] for q in rows)}），'
                       f'贴片占地被让开 合计 {sum(q["yield_px"] for q in rows)}px，贴片会盖住的白 / 藏青 合计 {sum(q["cover_alien_px"] for q in rows)}px（最多第 {int(np.argmax([q["cover_alien_px"] for q in rows]))} 帧 {max(q["cover_alien_px"] for q in rows)}）')
    lib2 = json.load(open(P('clips.json'), encoding='utf-8')); lib2.setdefault('headTracks', {}).update(tracks); lib2['headTrackBasis'] = lib['rest']
    lib2['headTrackRefs'] = {k: [round(float(v[0]), 1), round(float(v[1]), 1)] for k, v in T.refs.items()}
    json.dump(lib2, open(P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print('\n'.join(summary))


if __name__ == '__main__':
    main()
