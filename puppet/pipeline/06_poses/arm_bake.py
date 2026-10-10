"""第 4–9 步：初筛 → 色度抠 → 去绿边 → 收线 → 切肩 → 配准 → 写手臂层。

  python3 arm_bake.py <配置.json> screen <姿势> --assets <素材根> --work <中间产物> --report <检查图目录>
      对 <work>/armhd_<姿势>_s*.png 逐张初筛（阈值在配置 screen 里），出 <report>/armhd-screen-<姿势>.png
      skin  = 肤色像素数之比（手被染绿 / 画成空心线稿会明显变小）
      green = 输入里是绿的地方重绘后仍是绿的比例（头被画回来 / 多画东西会变小）
      fill  = 非绿前景面积之比。袖口条纹数、手指数只能看图。
  python3 arm_bake.py <配置.json> bake <姿势> [种子] --assets <素材根> --work <中间产物> --kit-in <现有 kit> --kit-out <输出目录> --report <检查图目录>
      种子不给就用配置 poses[<姿势>].seed。读 <kit-in> 的 base.png（切肩）、arms_idle.png（肤色基准、另一只手臂）、tintRef（褶皱影色调）；
      写 <kit-out>/arms_<姿势>.png 或 over_<姿势>.png、poses.json（kit-out 里没有就从 kit-in 拷一份起步），出 <report>/arm-check-<姿势>.png（三色底 2 倍）。

姿势的取法在配置 poses[<姿势>] 里（mode / sides / idleOther / mirror，以及 poly keep erase offset nudge erode armscale armrot skirtNavyOnly regLoose shadeTint idleSide blackLinesToNavy）。
kit 画布、躯干线、肩头支点、裙摆范围、配准区域等角色坐标都在配置顶层。"""
import sys, os, glob, json, shutil, numpy as np, cv2
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli, load, register, master, rgba, bleed, navy_lines, chan, greenish, skinish, font as get_font

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
cmd, n = pos[0], pos[1]; P = cfg.pose(n); font = get_font(22)
meta = json.load(open(cfg.w(f'armhd_{n}.json'))); BOX = meta['box']; OW, OH = meta['out']; k = OW / (BOX[2] - BOX[0])

if cmd == 'screen':
    SC = cfg['screen']; crop = np.asarray(Image.open(cfg.w(f'armhd_{n}_crop.png')).convert('RGB').resize((OW, OH), Image.LANCZOS))
    files = sorted(glob.glob(cfg.w(f'armhd_{n}_s*.png'))); tiles = []; g0 = ndi.binary_erosion(greenish(crop), iterations=6); s0 = skinish(crop).sum(); f0 = (~greenish(crop)).sum(); TW, TH = OW // 2, OH // 2
    for f in files:
        I = load(f); sk = skinish(I).sum() / max(s0, 1); gr = (greenish(I) & g0).sum() / max(g0.sum(), 1); fl = (~greenish(I)).sum() / f0
        ok = SC['skin'][0] <= sk <= SC['skin'][1] and gr >= SC['greenMin'] and SC['fill'][0] <= fl <= SC['fill'][1]
        t = Image.fromarray(I).resize((TW, TH)); d = ImageDraw.Draw(t); d.rectangle([0, 0, TW, 28], fill=(20, 110, 60) if ok else (150, 40, 40))
        d.text((6, 3), f'{os.path.basename(f)[:-4]}  skin {sk:.2f}  green {gr:.3f}  fill {fl:.2f}  {"通过" if ok else "不通过"}', fill=(255, 255, 255), font=font); tiles.append(t)
        print(os.path.basename(f), f'skin {sk:.2f} green {gr:.3f} fill {fl:.2f}', '通过' if ok else '不通过')
    t0 = Image.fromarray(crop).resize((TW, TH)); ImageDraw.Draw(t0).text((6, 3), '输入裁块（背景和头已预先涂绿）', fill=(0, 0, 0), font=font); tiles = [t0] + tiles
    cols = 3; s = Image.new('RGB', (TW * cols, TH * -(-len(tiles) // cols)), (255, 255, 255)); [s.paste(t, ((i % cols) * TW, (i // cols) * TH)) for i, t in enumerate(tiles)]
    s.save(cfg.r(f'armhd-screen-{n}.png')); sys.exit(0)
assert cmd == 'bake', __doc__

# ---------------- bake ----------------
seed = pos[2] if len(pos) > 2 else P['seed']; MODE = P.get('mode', 'arms'); OVER = MODE == 'overPoly'; sides = '' if OVER else P.get('sides', 'LR')
CW, CH = cfg.canvas; MIDX = cfg['midX']; TOR = cfg['torso']; SK = cfg['skirt']; RG = cfg['register']; NAVY = tuple(cfg['colors']['lineNavy']); KIT = cfg['kit']
if not os.path.exists(cfg.k(KIT['poses'])): shutil.copy(cfg.ki(KIT['poses']), cfg.k(KIT['poses']))
I = load(cfg.w(f'armhd_{n}_s{seed}.png')); H_, W_ = I.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]
# 色度抠：到「局部背景绿」的 Lab 距离 12→32 映成 alpha；不做形态学
lab = cv2.cvtColor(I, cv2.COLOR_RGB2LAB).astype(np.float32); gm = greenish(I)
ws = cv2.GaussianBlur(gm.astype(np.float32), (0, 0), 60); bgl = np.dstack([cv2.GaussianBlur(lab[..., c] * gm, (0, 0), 60) / np.maximum(ws, 1e-3) for c in range(3)])
alpha = np.clip((np.sqrt(((lab - bgl) ** 2).sum(-1)) - 12) / 20, 0, 1); solid = alpha > 0.5
# 躯干在裁块里的左右边；手臂 = 这两条线以外的最大连通块，往里多留 EXT 像素给肩部接合
TL, TR, EXT = (TOR['left'] - BOX[0]) * k, (TOR['right'] - BOX[0]) * k, TOR['shoulderExt']
# 裙子：腰线以下、躯干附近的藏青色不算手臂（袖子下缘在腋下会和裙腰的描边连上）
r_, g_, b_ = chan(I); navy_ = (b_ > r_ + 8) & ((r_ + g_ + b_) / 3 < 120)
hx, hy = xx / k + BOX[0], yy / k + BOX[1]
inside = (hy > SK['insideYMin']) & (hx > SK['insideLeftX'] - (hy - SK['insideY0']) * SK['insideSlope']) & (hx < SK['insideRightX'] + (hy - SK['insideY0']) * SK['insideSlope'])
block = (hy > SK['blockYMin']) & (hx > SK['blockLeftX'] - (hy - SK['blockYMin']) * SK['blockSlope']) & (hx < SK['blockRightX'] + (hy - SK['blockYMin']) * SK['blockSlope'])
cut_ = (navy_ & inside) | block; KP = P.get('keep'); km = np.zeros((H_, W_), np.uint8)
if P.get('skirtNavyOnly') or (KP and not P.get('legacySkirtBlockAll')): cut_ = (navy_ & inside) | (navy_ & block)          # 袖子下缘伸进裙摆范围的姿势：只排除藏青色，白袖子留着
if KP:          # 手叉在裙腰上：圈出来的手 / 袖口不算裙子
    cv2.fillPoly(km, [np.int32([[(x - BOX[0]) * k, (y - BOX[1]) * k] for x, y in q]) for q in KP], 1); cut_ = cut_ & ~km.astype(bool)
solid = solid & ~cut_
rgbf = I.astype(np.float32); edge = (alpha > 0.02) & (alpha < 0.98); mx = np.maximum(rgbf[..., 0], rgbf[..., 2]); rgbf[..., 1] = np.where(edge, np.minimum(rgbf[..., 1], mx + 4), rgbf[..., 1])     # 去绿溢色
rgb = navy_lines(rgbf.astype(np.uint8), NAVY); a_all = np.zeros_like(alpha)
if P.get('blackLinesToNavy', True):          # 纯黑的描边对到母版的深藏青
    lum_ = rgb.astype(np.float32).mean(-1); wk = np.clip((50 - lum_) / 25, 0, 1)[..., None]; rgb = (rgb * (1 - wk) + np.float32(NAVY) * wk).astype(np.uint8)
if OVER:          # 手压在头 / 脸前面：范围 = 多边形（内边落在身体上）；深一点的绿（模型给手画的投影）也算背景
    pm = np.zeros((H_, W_), np.uint8)
    cv2.fillPoly(pm, [np.int32([[(x - BOX[0]) * k * 16, (y - BOX[1]) * k * 16] for x, y in P['poly']])], 255, lineType=cv2.LINE_AA, shift=4)
    key_ = alpha * ~greenish(I); a_all = key_ * (pm / 255.0)
for side in sides:
    sel = (xx < TL + EXT) if side == 'L' else (xx > TR - EXT); core = (xx < TL) if side == 'L' else (xx > TR)
    lb, kk = ndi.label(solid & core); m = lb == (np.argmax(ndi.sum(solid & core, lb, range(1, kk + 1))) + 1)
    # 往里只长进「肩到腰」那一段的留边；不能经留边绕到裙子（裙摆比躯干宽，会被一起带进来）
    kmb = (km.astype(bool) & ((xx < W_ / 2) if side == 'L' else (xx >= W_ / 2))) if KP else np.zeros_like(solid)
    sel = sel | kmb
    stripm = (solid & sel & ~core & (yy < ((TOR['stripYMaxKeep'] if kmb.any() else TOR['stripYMax']) - BOX[1]) * k)) | (solid & kmb)
    m = ndi.binary_propagation(m, mask=m | stripm); m = ndi.binary_fill_holes(m)
    a_all = np.maximum(a_all, alpha * ndi.binary_dilation(m, iterations=2) * sel)
if P.get('erode'):          # 收线：到轮廓的距离减掉 erode 再做 1 像素的过渡
    # overPoly：只从绿底那一侧收（外轮廓）；多边形切出来的内边不收——那里的描边要完整留着（#1161：捂嘴袖子内侧的线被收没了）
    dist_ = ndi.distance_transform_edt((key_ if OVER else a_all) > 0.5); a_all = np.minimum(a_all, np.clip(dist_ - P['erode'], 0, 1))
hd = rgba(bleed(rgb, (a_all > 0.6).astype(np.float32), 4), a_all)
# 缩回 kit 画布，再按重绘图的躯干对到母版（重绘后会差几像素）
small = cv2.resize(hd, (BOX[2] - BOX[0], BOX[3] - BOX[1]), interpolation=cv2.INTER_AREA); lay = np.zeros((CH, CW, 4), np.uint8); lay[BOX[1]:BOX[3], BOX[0]:BOX[2]] = small
full = np.zeros((CH, CW, 3), np.uint8); full[:] = tuple(cfg['colors']['green']); full[BOX[1]:BOX[3], BOX[0]:BOX[2]] = cv2.resize(I, (BOX[2] - BOX[0], BOX[3] - BOX[1]), interpolation=cv2.INTER_AREA)
M = master(cfg)
_, T = register(full, M, tuple(RG['torso']), f'{n} 重绘→母版'); sc = float(np.hypot(T[0, 0], T[1, 0]))
C0 = np.float32(RG['torsoCenter']); dsp_ = T @ np.float32([C0[0], C0[1], 1]) - C0          # 躯干中心的实际位移（缩放是绕原点的，光看平移项会偏大）
LOOSE_ = RG['looseExtra'] if P.get('regLoose') else 0
if not RG['scale'][0] - LOOSE_ <= sc <= RG['scale'][1] + LOOSE_ or abs(dsp_[0]) > RG['maxShift'] or abs(dsp_[1]) > RG['maxShift']: print('!! 重绘图和母版的躯干对不上（缩放 / 平移过大），不做对齐'); T = np.float32([[1, 0, 0], [0, 1, 0]])
if P.get('nudge'): T = np.float32([[1, 0, P['nudge'][0]], [0, 1, P['nudge'][1]]]); sc = 1.0; print('用手工平移', P['nudge'])
if P.get('offset'): T = T.copy(); T[0, 2] += P['offset'][0]; T[1, 2] += P['offset'][1]
lay = cv2.warpAffine(lay, T, (CW, CH), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
# 切肩：留的那一截里，被母版身体（base）盖住的部分去掉 —— 等于沿身体的袖窿轮廓切，接缝落在身体自己的描边上
base = np.asarray(Image.open(cfg.ki(KIT['base'])))[..., 3].astype(np.float32) / 255; Y, X = np.mgrid[0:CH, 0:CW]
strip = ~np.bool_(OVER) & ((X > TOR['left'] - TOR['baseStripPad']) & (X < TOR['right'] + TOR['baseStripPad']) & (Y < TOR['baseStripYMax']))
la = lay[..., 3].astype(np.float32) * np.where(strip, 1 - np.clip(cv2.GaussianBlur(base, (0, 0), 0.6) * 1.6, 0, 1), 1); lay[..., 3] = la.astype(np.uint8)
AS, AR = P.get('armscale'), P.get('armrot', 0); SH = cfg['shoulders']
if AS or AR:          # 整条手臂绕肩头缩放 / 向外转
    AS = AS or 1.0; out_ = np.zeros_like(lay)
    for (px_, py_), half, sgn in [(SH['L'], slice(0, MIDX), 1), (SH['R'], slice(MIDX, CW), -1)]:
        src_ = np.zeros_like(lay); src_[:, half] = lay[:, half]; A_ = cv2.getRotationMatrix2D((px_, py_), sgn * AR, AS).astype(np.float32)
        pm_ = src_.astype(np.float32); pm_[..., :3] *= pm_[..., 3:] / 255          # 预乘再缩，免得边上带色
        w_ = cv2.warpAffine(pm_, A_, (CW, CH), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0)); al_ = np.maximum(w_[..., 3:], 1e-3); w_[..., :3] = w_[..., :3] * 255 / al_
        w_ = np.clip(w_, 0, 255).astype(np.uint8); out_ = np.where(w_[..., 3:] > out_[..., 3:], w_, out_)
    lay = out_
    # 缩放 / 外转之后肩部那条切口会挪到身体上面（#1161：挥手的袖子根部盖住了肩和领子边）：按袖窿再切一次，被身体底图盖住的手臂像素去掉
    cut2_ = (X > TOR['left'] - TOR['baseStripPad']) & (X < TOR['right'] + TOR['baseStripPad']) & (Y < TOR['baseStripYMax'])
    lay[..., 3] = (lay[..., 3].astype(np.float32) * np.where(cut2_, 1 - np.clip(cv2.GaussianBlur(base, (0, 0), 0.6) * 1.6, 0, 1), 1)).astype(np.uint8)
    # 重采样（预乘再除回来）会把内部一些 255 取整成 254；挖洞时这些像素会留下 1/255 的漫符颜色。内部（离轮廓 ≥ 4px）alpha ≥ 250 的拉回 255，边缘的抗锯齿不动
    in_ = ndi.binary_erosion(lay[..., 3] > 128, iterations=4) & (lay[..., 3] >= 250); lay[..., 3][in_] = 255
if P.get('erase'):
    em = np.zeros((CH, CW), np.uint8); cv2.fillPoly(em, [np.int32(q) for q in P['erase']], 1); lay[..., 3][em > 0] = 0
# 手的肤色对到待机的手
idle = np.asarray(Image.open(cfg.ki(KIT['idleArms']))); si = skinish(idle[..., :3]) & (idle[..., 3] > 200); sl = skinish(lay[..., :3]) & (lay[..., 3] > 200)
if si.sum() > 200 and sl.sum() > 200:
    L1 = cv2.cvtColor(lay[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32); L0 = cv2.cvtColor(idle[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32)
    dl = [float(np.median(L0[..., c][si]) - np.median(L1[..., c][sl])) for c in range(3)]; w = cv2.GaussianBlur(sl.astype(np.float32), (0, 0), 1.0)
    for c in range(3): L1[..., c] += dl[c] * w
    lay[..., :3] = cv2.cvtColor(np.clip(L1, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
TN = P.get('tone')
for tn in (TN or []):          # 局部去红：多边形里偏红（r 比 g 高 30 以上）且不是深色描边的像素，换成这一层的手肤色（to: skin）或描边色（to: line）；只改颜色
    tm = np.zeros((CH, CW), np.uint8); cv2.fillPoly(tm, [np.int32(tn['poly'])], 1); r_t, g_t = lay[..., 0].astype(np.float32), lay[..., 1].astype(np.float32); lum_t = lay[..., :3].astype(np.float32).mean(-1)
    core_t = (r_t - g_t > 40) & (lum_t > 110) & (tm > 0) & (lay[..., 3] > 0)
    if tn['to'] == 'line': w_t = np.clip(cv2.GaussianBlur(ndi.binary_dilation(core_t, iterations=2).astype(np.float32), (0, 0), 0.7) * 1.4, 0, 1) * (lay[..., 3] > 0)          # 并进描边：那一块整片（外扩 2px 盖住它和描边之间的暗红边）换成描边色，边缘 1px 软过渡
    else: w_t = np.clip((r_t - g_t - 30) / 15, 0, 1) * (lum_t > 110) * (tm > 0) * (lay[..., 3] > 0)
    sk_t = skinish(lay[..., :3]) & (lay[..., 3] > 200) & ((r_t - g_t) < 30); skin_t = np.median(lay[..., :3][sk_t], 0) if sk_t.sum() > 100 else np.float32([253, 231, 215])
    tgt = skin_t if tn['to'] in ('skin', 'skinpatch') else np.float32(NAVY)
    if tn['to'] == 'skinpatch':          # 一整块偏红的肉色（如两手夹缝里手指的侧面）→ 手的肤色；它贴着描边的那圈暗红过渡像素 → 描边色。描边的线宽不变
        # 做法：这块肉色原来的亮度范围是「描边色 … 肉色」，把它按亮度线性映到「描边色 … 肤色」上——肉色本体变成肤色，它和描边之间的抗锯齿过渡照样是平滑的过渡
        grow_t = ndi.binary_dilation(core_t, iterations=2) & (lay[..., 3] > 0) & (r_t - g_t > 6); nv_t = np.float32(NAVY); l0 = float(nv_t.mean()); l1 = float(np.median(lum_t[core_t])) if core_t.sum() > 20 else 180.0
        k_t = np.clip((lum_t - l0) / max(l1 - l0, 1), 0, 1)[..., None]; new_t = nv_t * (1 - k_t) + skin_t * k_t; lay[..., :3] = np.where(grow_t[..., None], new_t.round(), lay[..., :3]).astype(np.uint8); w_t = np.zeros_like(lum_t)
    lay[..., :3] = (lay[..., :3] * (1 - w_t[..., None]) + tgt * w_t[..., None]).round().astype(np.uint8)
if P.get('shadeTint') and os.path.exists(cfg.ki(KIT['tintRef'])):
    # 袖子褶皱影的色调：参考层里「浅、偏青绿」的像素在 Lab 里的中位数 → 本层「浅、低饱和、非肤色」的像素色度直接换成参考的（按变暗的程度），亮度不动
    ref_ = np.asarray(Image.open(cfg.ki(KIT['tintRef']))); rl_ = cv2.cvtColor(ref_[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32); rr_, rg_, rb_ = [ref_[..., i].astype(np.int16) for i in range(3)]
    rs_ = (ref_[..., 3] > 200) & (rg_ > rr_ + 10) & (rl_[..., 0] > 170) & (rl_[..., 0] < 235); tL, ta, tb = [float(np.median(rl_[..., c][rs_])) for c in range(3)]
    ll_ = cv2.cvtColor(lay[..., :3], cv2.COLOR_RGB2LAB).astype(np.float32); cr_, cg_, cb_ = [lay[..., i].astype(np.int16) for i in range(3)]
    sh_ = (lay[..., 3] > 0) & (ll_[..., 0] > 150) & (np.maximum(np.maximum(cr_, cg_), cb_) - np.minimum(np.minimum(cr_, cg_), cb_) < 30) & ~((cr_ > cg_ + 8) & (cr_ > 175))
    m_ = cv2.GaussianBlur(sh_.astype(np.float32), (0, 0), 0.8); k_ = np.clip((250 - ll_[..., 0]) / max(250 - tL, 1), 0, 1.2)
    ll_[..., 1] = ll_[..., 1] * (1 - m_) + (128 + (ta - 128) * k_) * m_; ll_[..., 2] = ll_[..., 2] * (1 - m_) + (128 + (tb - 128) * k_) * m_; lay[..., :3] = cv2.cvtColor(np.clip(ll_, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB); print('shadeTint → Lab', round(tL), round(ta - 128, 1), round(tb - 128, 1))
# 去绿边：外圈的半透明像素残留的暗绿（描边和绿底的混色，缩小 / 对齐插值后又带回来的）换成描边的深藏青，alpha 不动
_r, _g, _b = [lay[..., i].astype(np.int16) for i in range(3)]; _sol = lay[..., 3] > 128
_ring = (lay[..., 3] > 0) & ~ndi.binary_erosion(_sol, iterations=3) & (_g > _r + 8) & (_g > _b + 8) & ((_r + _g + _b) / 3 < 140)
lay[..., :3][_ring] = NAVY
moved = Image.fromarray(lay)

def idle_half(keep):          # 待机手臂层里只留画面左（'L'）或右（'R'）那一只
    idl = np.asarray(Image.open(cfg.ki(KIT['idleArms']))).copy(); idl[:, (slice(MIDX, CW) if keep == 'L' else slice(0, MIDX)), 3] = 0; return Image.fromarray(idl)
def with_idle(img, other):          # 手臂层 + 另一侧的待机手臂
    c = img.copy(); c.alpha_composite(idle_half(other)); return c
OTHER = {'L': 'R', 'R': 'L'}; one = sides in ('L', 'R'); poses = json.load(open(cfg.k(KIT['poses']))); prev = poses.get(n, {})
entry = {**prev, 'kind': 'A', 'source': f'armhd_{n}_s{seed}', 'regScale': round(sc, 4), 'regShift': [round(float(T[0, 2]), 1), round(float(T[1, 2]), 1)]}
if OVER:
    moved.save(cfg.k(f'over_{n}.png')); arms = None
    if P.get('idleSide'): idle_half(P['idleSide']).save(cfg.k(f'arms_{n}.png')); arms = f'arms_{n}.png'          # 另一只手臂垂着：用待机的那一只
    entry.update({'arms': arms, 'over': f'over_{n}.png', 'method': '高清重绘到纯绿底（8 步）+ 色度抠；over 层范围 = 配置里的 poly'})
elif MODE == 'armsAsOver':          # 手举在头旁边、会压到头发：手臂照常按躯干线取，但整层放到头前面
    moved.save(cfg.k(f'over_{n}.png')); arms = None
    if P.get('idleOther') and one: idle_half(OTHER[sides]).save(cfg.k(f'arms_{n}.png')); arms = f'arms_{n}.png'
    entry.update({'arms': arms, 'over': f'over_{n}.png', 'headYawMax': prev.get('headYawMax', 30), 'method': '高清重绘到纯绿底（8 步）+ 色度抠'})
else:
    moved.save(cfg.k(f'arms_{n}_moved.png')); (with_idle(moved, OTHER[sides]) if P.get('idleOther') and one else moved).save(cfg.k(f'arms_{n}.png'))
    entry.update({'arms': f'arms_{n}.png', 'over': None, 'headYawMax': prev.get('headYawMax', 30), 'method': '高清重绘到纯绿底（8 步）+ 色度抠'})
for q in ('polys', 'armRatio', 'handSkinShift'): entry.pop(q, None)
poses[n] = entry
if P.get('mirror') and MODE == 'arms':          # 再出一个只镜像手臂层的姿势
    mn = P['mirror']; fl = np.ascontiguousarray(lay[:, ::-1]); sh = cfg['mirrorSum'] - (CW - 1)
    ml = Image.fromarray(cv2.warpAffine(fl, np.float32([[1, 0, sh], [0, 1, 0]]), (CW, CH), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0)))
    (with_idle(ml, sides) if P.get('idleOther') and one else ml).save(cfg.k(f'arms_{mn}.png')); poses[mn] = {**entry, 'arms': f'arms_{mn}.png', 'mirrorOf': n}
json.dump(poses, open(cfg.k(KIT['poses']), 'w'), indent=1, ensure_ascii=False)
# 三色底 2 倍验收图（kit 画布分辨率的手臂层；两侧都有就每侧一行）
ys, xs = np.where(lay[..., 3] > 20); bx = (max(xs.min() - 12, 0), max(ys.min() - 12, 0), min(xs.max() + 12, CW), min(ys.max() + 12, CH))
def tile(bg, box): c = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), tuple(bg) + (255,)); c.alpha_composite(moved.crop(box)); return c.convert('RGB').resize(((box[2] - box[0]) * 2, (box[3] - box[1]) * 2), Image.LANCZOS)
boxes = [(bx[0], bx[1], min(bx[2], MIDX), bx[3]), (max(bx[0], MIDX), bx[1], bx[2], bx[3])] if sides == 'LR' else [bx]
tw = max((b[2] - b[0]) * 2 for b in boxes); th = sum((b[3] - b[1]) * 2 for b in boxes)
s = Image.new('RGB', (tw * 3, th + 30), (255, 255, 255)); ImageDraw.Draw(s).text((6, 3), f'{n}（{entry["source"]}）：手臂层叠在浅底 / 深藏青底 / 品红底，2 倍', fill=(0, 0, 0), font=font); y = 30
for b in boxes:
    for i, bg in enumerate(cfg['colors']['checkBgs']): s.paste(tile(bg, b), (i * tw, y))
    y += (b[3] - b[1]) * 2
s.save(cfg.r(f'arm-check-{n}.png')); print('ok', n, 'reg', round(sc, 4), [round(float(T[0, 2]), 1), round(float(T[1, 2]), 1)], s.size)
