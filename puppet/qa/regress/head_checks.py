"""#1160 的四条回归（只画头）：a 呆毛与帽子之间无缝；b 转头时前侧发外侧不出现后发的第二层发尖；
c 点头全程头顶不露肤色 / 底色，且头发位移与脸位移之比不低于下限；d 头部外轮廓的深色描边连续（最长断口）。
用法：python3 puppet/qa/regress/head_checks.py <角色目录> <配置.json> <输出目录>   → 标准输出一个 JSON 数组。在哪个目录运行都行。"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage
PUPPET = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))          # puppet 目录；在哪个目录运行都行
pack, cfg_file, out = [os.path.abspath(v) for v in sys.argv[1:4]]; os.makedirs(out, exist_ok=True)
C = json.load(open(f'{pack}/character.json')); PL = json.load(open(f"{pack}/{C['files']['parts']}")); parts = {p['id']: p for p in PL}
cfg = json.load(open(cfg_file)); R, TH, NOTE = cfg['roles'], cfg['thresholds'], cfg['notes']; U = C['unit']; ox, oy = U.get('headMasterOrigin', [0, 0])
# 检查画布：头部母版那一块四周各多留 MARGIN 像素。发尖转过去会伸出母版范围，贴着画布边被裁掉的地方会被误读成「没有描边」
MARGIN = 200; ox -= MARGIN; oy -= MARGIN; N = 1408 + 2 * MARGIN
rel = os.path.relpath(pack, PUPPET) + '/'; arr = lambda x: [x] if isinstance(x, str) else list(x or [])
TURN, NOD = cfg['turn']['parameter'], cfg['nod']['parameter']; prm = {p['id']: p for p in C['parameters']}
def shot(name, extra):
    f = f'{out}/{name}.png'
    subprocess.run(['node', os.path.join(PUPPET, 'tools/shot.mjs'), f"qa/shift-test.html?pack={rel}&k=1&only=0&param=ParamAngleZ&bg=%23ff00ff&crop={ox},{oy},{N},{N}{extra}", f], check=True); return np.asarray(Image.open(f).convert('RGB')).astype(int)
is_bg = lambda a: (a[..., 0] > 235) & (a[..., 1] < 20) & (a[..., 2] > 235)
def is_skin(a): r, g, b = a[..., 0], a[..., 1], a[..., 2]; return (r > 215) & (g > 150) & (b > 120) & (r - g > 12) & (g - b > 4) & (b < 232)
luma = lambda a: 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
def dxy(p, yaw=0, pitch=0): d = p.get('depth', 0); return d * U['R'] * math.sin(math.radians(yaw)), -p.get('depthY', d) * U['R'] * math.sin(math.radians(pitch))
def placed(pid, yaw=0, pitch=0):
    """部件的不透明遮罩，摆到头部画布（1408 见方）上，按深度平移"""
    p = parts[pid]; x, y, w, h = [round(v) for v in p['rect']]; a = Image.open(f"{pack}/{p['texture']}").convert('RGBA').split()[3]
    if a.size != (w, h): a = a.resize((w, h))
    sx, sy = dxy(p, yaw, pitch); m = Image.new('L', (N, N), 0); m.paste(a, (round(x - ox + sx), round(y - oy + sy))); return np.asarray(m) > 128
res = []; D = cfg.get('turnDaily', 24); PMIN, PMAX = prm[NOD]['min'], prm[NOD]['max']

# a 呆毛与帽子之间无缝：只画呆毛和帽子，呆毛不许是一块孤立的（和帽子之间隔着底色）；并量呆毛贴着帽子的像素数
if R.get('ahoge') and R['ahoge'] in parts:
    others = ','.join(i for i in parts if i not in (R['ahoge'], R['hat'])); vals = {}
    for nm, ex in (('rest', ''), (f'yaw{D}', f'&set={TURN}:{D}'), (f'yaw-{D}', f'&set={TURN}:-{D}'), ('nodmin', f'&set={NOD}:{PMIN}'), ('nodmax', f'&set={NOD}:{PMAX}')):
        im = shot(f'ahoge-{nm}', ex + '&hide=' + others); fg = ~is_bg(im); lab, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab, range(1, n + 1)) if n else []
        big = [int(s) for s in sizes if s > 60]
        yw = D if nm == f'yaw{D}' else -D if nm == f'yaw-{D}' else 0; pt = PMIN if nm == 'nodmin' else PMAX if nm == 'nodmax' else 0
        # 根部压进帽子多深：呆毛和帽子重叠的那部分，按列数最深的一列（像素）。0 = 只是搭在帽子上，根部的切口露在外面
        ov = placed(R['ahoge'], yw, pt) & placed(R['hat'], yw, pt); depth = int(ov.sum(0).max()) if ov.any() else 0
        vals[nm] = {'块数': len(big), '根部压进帽子的深度': depth}
    ok = all(v['块数'] == 1 and v['根部压进帽子的深度'] >= TH['ahogeContactMinPx'] for v in vals.values())
    res.append({'id': 'ahoge-seam', 'title': '呆毛与帽子之间无缝', 'auto': True, 'pass': ok, 'value': {**vals, '深度下限': TH['ahogeContactMinPx']}, 'image': 'ahoge-rest.png', 'note': NOTE.get('ahogeContactMinPx')})

# b 转头时前侧发外侧不出现后发的第二层发尖：后发在「同侧侧发最外缘」之外露出来的像素（只看侧发下半段那些行）
def back_outside(yaw):
    back = np.zeros((N, N), bool)
    for i in arr(R['backHair']): back |= placed(i, yaw)
    front = np.zeros((N, N), bool)
    for i in PL:
        if i['id'] not in arr(R['backHair']) and i.get('group') == 'head': front |= placed(i['id'], yaw)
    vis = back & ~front; cx = N // 2; tot = 0; mark = np.zeros((N, N), bool)
    for sid in arr(R['sideHair']):
        m = placed(sid, yaw); ys = np.where(m.any(1))[0]
        if not len(ys): continue
        left = np.where(m.any(0))[0].mean() < cx
        for y in range(int(ys.min() + 0.45 * (ys.max() - ys.min())), int(ys.max()) + 1):
            xs = np.where(m[y])[0]
            if not len(xs): continue
            seg = vis[y, :xs.min()] if left else vis[y, xs.max() + 1:]
            tot += int(seg.sum())
            if left: mark[y, :xs.min()] |= seg
            else: mark[y, xs.max() + 1:] |= seg
    return tot, mark
bv = {}
for yaw in (-D, 0, D):
    n, mark = back_outside(yaw); bv[yaw] = n
    if yaw != 0:
        im = shot(f'backtip{yaw:+d}', f'&set={TURN}:{yaw}').astype(np.uint8); im[mark] = (255, 255, 0); Image.fromarray(im).save(f'{out}/backtip{yaw:+d}-marked.png')
res.append({'id': 'back-hair-tips', 'title': f'转头 ±{D}° 时前侧发外侧不出现后发的第二层发尖', 'auto': True, 'pass': max(bv[-D], bv[D]) <= TH['backTipOutsideMaxPx'], 'value': {'侧发外缘之外露出的后发像素': bv, '上限': TH['backTipOutsideMaxPx']}, 'image': f'backtip{D:+d}-marked.png', 'note': NOTE.get('backTipOutsideMaxPx')})

# c 点头：头发 / 帽子的位移不低于脸的某个比例；全程额头一带不多露肤色、不露底色
face = parts[R['face']]; fy = face.get('depthY', face.get('depth', 0)); follow = {}
for i in arr(R['frontHair']) + arr(R['backHair']) + [R['hat']] + arr(R.get('ahoge')):
    if i in parts: follow[i] = round(parts[i].get('depthY', parts[i].get('depth', 0)) / fy, 3)
eye_y = round(np.mean([parts[i]['rect'][1] + parts[i]['rect'][3] / 2 for i in arr(R['eyeWhites'])]) - oy)
def forehead(pitch, name):
    im = shot(name, f'&set={NOD}:{pitch}'); sy = round(dxy(face, 0, pitch)[1]); band = im[:eye_y + sy - 70]
    bgm = is_bg(im); lab, n = ndimage.label(bgm); edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); inner = bgm & ~np.isin(lab, list(edge)); inner[eye_y + sy:] = False
    return int(is_skin(band).sum()), int(inner.sum())
s0, h0 = forehead(0, 'nod+0'); sk = {0: s0}; holes = {0: h0}
for pch in sorted({PMIN, PMIN / 2, PMAX / 2, PMAX}): s, h = forehead(pch, f'nod{pch:+g}'); sk[pch] = s; holes[pch] = h
growth = round(max(sk.values()) / max(1, s0) - 1, 3)
okc = min(follow.values()) >= TH['nodHairFollowMin'] and growth <= TH['nodForeheadSkinGrowthMax'] and max(holes.values()) <= max(h0, 0) + 30
res.append({'id': 'nod-whole-head', 'title': '点头时整头一体：头发跟着脸动，头顶不露肤色 / 底色', 'auto': True, 'pass': okc,
            'value': {'头发 / 帽子位移 ÷ 脸位移（最小）': min(follow.values()), '各层': follow, '下限': TH['nodHairFollowMin'], '眼睛以上的肤色像素': sk, '最多比静止多': growth, '允许多': TH['nodForeheadSkinGrowthMax'], '眼睛以上被包住的底色像素': holes}, 'image': f'nod{PMIN:+g}.png', 'note': NOTE.get('nodHairFollowMin')})

# e 转头时帽子和头是一体的：帽檐下缘上的每个点，和它正下方那片头发，转到日常上限时横向错开多少（像素）
def part_dx(p, yaw):
    """这个部件在转头 yaw 度时的横向位移场：返回 f(x, y)（角色坐标）→ dx。= 按深度的整体平移 + 关键形里的网格位移（按转头参数线性插值）"""
    base = p.get('depth', 0) * U['R'] * math.sin(math.radians(yaw)); ks = [k for k in p.get('keyforms', []) if list(k['at']) == [TURN] and (k.get('offsets') or k.get('translate'))]
    g = (p.get('mesh') or {}).get('grid')
    if not ks: return lambda x, y: base
    stops = sorted([(0, None)] + [(k['at'][TURN], k) for k in ks], key=lambda t: t[0]); yv = max(stops[0][0], min(stops[-1][0], yaw))
    i = max(j for j in range(len(stops) - 1) if stops[j][0] <= yv) if yv < stops[-1][0] else len(stops) - 2
    (a0, k0), (a1, k1) = stops[i], stops[i + 1]; w = (yv - a0) / (a1 - a0)
    def one(k, x, y):
        if k is None: return 0.0
        dx = (k.get('translate') or [0, 0])[0]
        if k.get('offsets') and g:
            cols, rows = g; rx, ry, rw, rh = p['rect']; u = min(max((x - rx) / rw * cols, 0), cols - 1e-6); v = min(max((y - ry) / rh * rows, 0), rows - 1e-6); ci, ri = int(u), int(v); fu, fv = u - ci, v - ri
            o = lambda c, r: k['offsets'][2 * (r * (cols + 1) + c)]
            dx += (o(ci, ri) * (1 - fu) + o(ci + 1, ri) * fu) * (1 - fv) + (o(ci, ri + 1) * (1 - fu) + o(ci + 1, ri + 1) * fu) * fv
        return dx
    return lambda x, y: base + one(k0, x, y) * (1 - w) + one(k1, x, y) * w
def alpha_of(pid):
    p = parts[pid]; x, y, w, h = [round(v) for v in p['rect']]; a = Image.open(f"{pack}/{p['texture']}").convert('RGBA').split()[3]
    return (np.asarray(a if a.size == (w, h) else a.resize((w, h))) > 128), x, y
hatp = parts[R['hat']]; ha, hx0, hy0 = alpha_of(R['hat']); front = [(i, parts[i], *alpha_of(i)) for i in arr(R['frontHair'])]
def brim_gap(yaw):
    fh = part_dx(hatp, yaw); rel = []
    for c in range(0, ha.shape[1], 6):
        col = np.where(ha[:, c])[0]
        if not len(col): continue
        x, y = hx0 + c, hy0 + col.max(); below = None
        for pid, pp, al, px, py in front:          # 帽檐下缘正下方 8 像素处是哪片头发（取层序最上的）
            ix, iy = x - px, y + 8 - py
            if 0 <= ix < al.shape[1] and 0 <= iy < al.shape[0] and al[iy, ix] and (below is None or pp['order'] > below['order']): below = pp
        if below is not None: rel.append(abs(fh(x, y) - part_dx(below, yaw)(x, y + 8)))
    return (round(max(rel), 1), round(float(np.mean(rel)), 1), len(rel), round(float(np.percentile(rel, 90)), 1), int(sum(v > TH['hatBrimSlipMaxPx'] for v in rel))) if rel else (0, 0, 0, 0, 0)
bg_ = {yaw: brim_gap(yaw) for yaw in (-D, D)}
cxh = hx0 + ha.shape[1] / 2; colc = np.where(ha[:, ha.shape[1] // 2])[0]
table = {yaw: {'帽檐前缘（正中下缘）': round(part_dx(hatp, yaw)(cxh, hy0 + colc.max()), 1), '帽顶（正中上缘）': round(part_dx(hatp, yaw)(cxh, hy0 + colc.min()), 1),
               **{i: round(part_dx(parts[i], yaw)(0, 0), 1) for i in arr(R['frontHair']) + [R['face']] + arr(R.get('ahoge')) if not parts[i].get('keyforms') or True}} for yaw in (-D, D)}
res.append({'id': 'hat-turns-with-head', 'title': f'转头 ±{D}° 时帽子和头是一体的（帽檐下缘与它下面的头发横向错开多少）', 'auto': True, 'pass': max(bg_[-D][3], bg_[D][3]) <= TH['hatBrimSlipMaxPx'],
            'value': {'帽檐下缘与下方头发的相对横向位移（像素）': {yaw: f'九成的点 ≤ {v[3]}；平均 {v[1]}；最大 {v[0]}（{v[2]} 个点里 {v[4]} 个超过上限）' for yaw, v in bg_.items()}, '上限（按九成的点判）': TH['hatBrimSlipMaxPx'], '最大值（只出读数，不判）': {yaw: v[0] for yaw, v in bg_.items()},
                      '为什么不按最大值判': '刘海和侧发是两片、深度不同，它们在帽檐下的交界处自己就会相对错开（深度差 × R × sin 转角），帽檐在那几个点不可能同时贴住两边', '各层横向位移（像素）': table}, 'note': NOTE.get('hatBrimSlipMaxPx')})

# d 头部外轮廓的深色描边连续：绕头心一圈，每 0.25° 看最外缘往里 4 像素有没有深色线；最长的连续「没有线」的一段折成像素。
#   静止和转头 ±日常上限各量一次（各层错开后轮廓上最容易出断口），取最坏的
def outline(name, extra):
    im = shot(name, extra + '&hide=' + R['neck']); fg = ~is_bg(im); lab, n = ndimage.label(fg); big = lab == (1 + int(np.argmax(ndimage.sum(fg, lab, range(1, n + 1))))); dark = (luma(im) < 90) & big
    ys, xs = np.where(big); cx0, cy0 = xs.mean(), ys.mean(); BINS = 1440; has = np.zeros(BINS, bool); rad = np.zeros(BINS); seen = np.zeros(BINS, bool); pts = [None] * BINS
    for b in range(BINS):
        ang = 2 * math.pi * b / BINS; ca, sa = math.cos(ang), math.sin(ang); r = 0; last = -1
        while True:
            x, y = int(round(cx0 + ca * r)), int(round(cy0 + sa * r))
            if not (0 <= x < N and 0 <= y < N): break
            if big[y, x]: last = r
            r += 1
        if last < 0: continue
        seen[b] = True; rad[b] = last; pts[b] = (int(round(cx0 + ca * last)), int(round(cy0 + sa * last)))
        has[b] = any(dark[int(round(cy0 + sa * q)), int(round(cx0 + ca * q))] for q in range(max(0, last - 4), last + 1))
    global touched; touched = touched or bool(big[0].any() or big[-1].any() or big[:, 0].any() or big[:, -1].any())
    miss = [bool(seen[b] and not has[b] and not (70 <= 360 * b / BINS <= 110)) for b in range(BINS)]          # 正下方那一段是脖子的开口（脖子没画），不算
    gap = best = 0; marks = im.astype(np.uint8).copy()
    for b in list(range(BINS)) * 2:
        if miss[b]:
            gap += rad[b] * 2 * math.pi / BINS; best = max(best, gap)
            if pts[b]: x, y = pts[b]; marks[max(0, y - 3):y + 4, max(0, x - 3):x + 4] = (255, 255, 0)
        else: gap = 0
    Image.fromarray(marks).save(f'{out}/{name}-marked.png')
    return round(min(best, sum(rad[b] * 2 * math.pi / BINS for b in range(BINS) if miss[b])), 1), round(float(sum(rad[b] * 2 * math.pi / BINS for b in range(BINS) if miss[b])), 1)
touched = False
ov = {nm: outline(f'outline-{nm}', ex) for nm, ex in (('rest', ''), (f'yaw{D}', f'&set={TURN}:{D}'), (f'yaw-{D}', f'&set={TURN}:-{D}'))}
worst = max(ov, key=lambda k: ov[k][0])
res.append({'id': 'outline-continuous', 'title': '头部外轮廓的深色描边连续（最长断口）', 'auto': True, 'pass': ov[worst][0] <= TH['outlineGapMaxPx'], 'value': {'最长断口（像素）': {k: v[0] for k, v in ov.items()}, '没有描边的总长（像素）': {k: v[1] for k, v in ov.items()}, '上限': TH['outlineGapMaxPx'], '轮廓碰到检查画布的边': touched}, 'image': f'outline-{worst}-marked.png', 'note': NOTE.get('outlineGapMaxPx')})
# f 转头是绕头的竖轴转，不是整头平移（#1166，用户反馈：「转头的时候，头的中心位置左右偏离很大，像头在移动」）
#   整头剪影（藏掉脖子，其余全画）的质心和包围盒中心，相对正面横移多少；下巴尖（只画脸，最低 8 行的中点）相对脖子中线横移多少。
#   判据在日常转头角度和参数上限两档上各一组。点头时整头纵向移多少只出读数（这次没改）。
if R.get('face') in parts and R.get('neck') in parts:
    TMAX = int(min(prm[TURN]['max'], -prm[TURN]['min'])); angs = sorted({-TMAX, -D, 0, D, TMAX})
    def sil(yaw, pitch=0, tag=''):
        a = shot(f'pivot{tag}{yaw:+d}', f"&hide={R['neck']}" + (f'&set={TURN}:{yaw}' if yaw else '') + (f'&set={NOD}:{pitch}' if pitch else '')); ys, xs = np.where(~is_bg(a))
        return float(xs.mean()), (int(xs.min()) + int(xs.max())) / 2, float(ys.mean())
    def chin(yaw):
        a = shot(f'pivot-chin{yaw:+d}', '&hide=' + ','.join(i for i in parts if i != R['face']) + (f'&set={TURN}:{yaw}' if yaw else '')); ys, xs = np.where(~is_bg(a)); return float(xs[ys > ys.max() - 8].mean())
    nk = parts[R['neck']]; neck_x = nk['rect'][0] + nk['rect'][2] / 2 - ox; sv = {y: sil(y) for y in angs}; cv = {y: chin(y) for y in angs}
    cen = {y: round(sv[y][0] - sv[0][0], 1) for y in angs if y}; box = {y: round(sv[y][1] - sv[0][1], 1) for y in angs if y}; chn = {y: round(cv[y] - neck_x, 1) for y in angs}
    lim = TH['headPivot']; okp = all(max(abs(cen[y]), abs(box[y])) <= (lim['silhouetteDaily'] if abs(y) <= D else lim['silhouetteMax']) for y in cen) and all(abs(chn[y] - chn[0]) <= lim['chinToNeck'] for y in chn)
    json.dump({'脖子中线 x（检查画布）': neck_x, '剪影质心 x': {y: sv[y][0] for y in angs}, '下巴尖 x': cv}, open(f'{out}/pivot.json', 'w'), ensure_ascii=False, indent=1)
    res.append({'id': 'head-turns-about-axis', 'title': '转头是绕头的竖轴转，不是整头平移（整头剪影中心、下巴尖相对脖子中线的横移）', 'auto': True, 'pass': okp,
                'value': {'整头剪影质心横移（像素）': cen, '整头剪影包围盒中心横移（像素）': box, '下巴尖 − 脖子中线（像素；正面时本身的偏差也在里面）': chn,
                          '上限': {f'剪影 ±{D}°': lim['silhouetteDaily'], f'剪影 ±{TMAX}°': lim['silhouetteMax'], '下巴尖相对正面的变化': lim['chinToNeck']}}, 'image': f'pivot{D:+d}.png', 'note': NOTE.get('headPivot', '')})
    ny = {p_: round(sil(0, p_, 'nod')[2] - sv[0][2], 1) for p_ in (int(PMIN), int(PMAX))}
    res.append({'id': 'head-nod-translation', 'title': '点头时整头剪影质心纵向移多少（只出读数）', 'auto': False, 'info': True, 'pass': True, 'value': {'剪影质心纵向位移（像素，向下为正）': ny}, 'note': NOTE.get('headNodTranslation', '')})
print(json.dumps(res, ensure_ascii=False, default=lambda o: o.item() if hasattr(o, 'item') else str(o)))
