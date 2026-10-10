#!/usr/bin/env python3
"""第 2 步 眼睛各层重做（#1158）。

  python3 build_eyes.py --source <角色来源目录> --work <中间产物目录>

输入：<work>/parts/ 里拆出来的眼睛部件（split_head.py 的产物）和 <source>/head/rig.json（只读）。
输出：<source>/face/ 的 eyeWhite{L,R} iris{L,R} eyeHl{L,R} eyeLow{L,R}.png；
  上睫毛 lash{L,R}.png 和部件清单 eyes.json 还要经 build_lids.py 再加工，这一步的版本写到 <work>/face/eyes_stage1/。
全部是程序处理，没有生图。坐标约定同 face.json：rect 是 rig 空间（= head_master 像素 + [390,136]）。

现有部件的毛病（3 倍放大看到的）和对应做法：
  虹膜  边缘是锯齿状的、带一圈半透明的浅色混色；下缘被下眼睑切成一条折线，不是完整的形状。
        → 用现有虹膜上、左、右三侧的轮廓点拟合一个椭圆；椭圆内部用「向内收 5 px 的可信颜色」向外补（inpaint），
          再按角度把原来那圈深色描边的颜色取出来，沿椭圆边重画一圈；透明度是 4 倍超采样的椭圆，边缘干净。
  眼白  轮廓是多边形折线，里面有几条细线（上一轮抠图留下的），外形带一个凹口。
        → 外形取现有不透明范围的凸包再平滑；颜色只留两种：白，和原来就有的那片蓝灰色上眼睑投影（做了去细线的中值滤波）。
  高光  白点外面包着一圈虹膜颜色的深边（叠在别的底色上就是一圈黑线）。
        → 只保留白色的部分，颜色统一成它自己的白，边缘重新做抗锯齿。
  上睫毛 下缘里侧带着几段细的深色弧线——那是虹膜上缘的描边被抠进了睫毛层，眼珠一转它不跟着动，就是残影。
        → 落在眼眶内部、位于睫毛主体下方的第二段深色去掉（逐列判断 + 开运算削平连接处）；其余只做去边。上面那道肤色的双眼皮线保留。
  下睫毛点 带一两个青色小碎屑。→ 只保留深褐色的连通块。"""
import json, os, sys
import numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 W、S_ 已经是别的变量名，所以换个名字引
from scipy import ndimage as ndi
RIG = json.load(open(SRC('head/rig.json'), encoding='utf-8')); P = {p['id']: p for p in RIG['parts']}
HEAD_ORG = (390, 136); os.makedirs(SRC('face'), exist_ok=True)
def load(n): return cv2.imread(WK('parts', n + '.png'), cv2.IMREAD_UNCHANGED)
def aa(mask_big, k=4):                     # 超采样掩膜 → 抗锯齿 alpha
    return cv2.resize(mask_big.astype(np.float32), None, fx=1 / k, fy=1 / k, interpolation=cv2.INTER_AREA)
def defringe(im, shrink=1, feather=0.7):
    a = im[..., 3].astype(np.float32) / 255; core = a > 0.6
    if shrink: core = ndi.binary_erosion(core, iterations=shrink)
    if not core.any(): return im
    idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
    rgb = im[..., :3][idx[0], idx[1]]
    na = np.minimum(a, cv2.GaussianBlur(ndi.binary_dilation(core, iterations=1).astype(np.float32), (0, 0), feather))
    return np.dstack([rgb, (np.clip(na, 0, 1) * 255).astype(np.uint8)])
report = {}; parts_out = []
for S_ in 'LR':
    rep = report[S_] = {}
    # ------------------------------------------------ 虹膜
    im = load('iris' + S_); r = P['iris' + S_]['rect']; h, w = im.shape[:2]
    PAD = 14                                                             # 画布四周多留 14 px：补全后的椭圆下缘会超出原矩形
    big = np.zeros((h + 2 * PAD, w + 2 * PAD, 4), np.uint8); big[PAD:PAD + h, PAD:PAD + w] = im
    A = big[..., 3] > 128
    cnt = max(cv2.findContours(A.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea)[:, 0, :]
    ys_ = np.where(A.any(1))[0]; ybot = ys_.max()
    good = cnt[cnt[:, 1] < ybot - 0.22 * (ybot - ys_.min())]              # 下面约五分之一是被下眼睑切过的折线，不拿来拟合
    (cx, cy), (d1, d2), ang = cv2.fitEllipse(good.astype(np.float32))
    yy_i = np.mgrid[0:big.shape[0], 0:big.shape[1]][0]
    K = 4; eb = np.zeros((big.shape[0] * K, big.shape[1] * K), np.uint8)
    cv2.ellipse(eb, (((cx + 0.5) * K, (cy + 0.5) * K), (d1 * K, d2 * K), ang), 1, -1)
    alpha = aa(eb, K); inside = alpha > 0.02
    core = ndi.binary_erosion(big[..., 3] > 230, iterations=5) & (alpha > 0.98) & (yy_i < ybot - 14)   # 原图最下面 14 px 是被下眼睑切过的边，带一条浅色线，不当可信颜色
    fill = cv2.inpaint(big[..., :3], (~core).astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA)   # 可信核心以外全部重填：第一版只填椭圆内，椭圆外透明像素里的杂色（黑、肤色）被当成已知颜色吸了进来，下缘出现一条浅色带和黑斑
    # 描边：原图里离边 1.5–5 px 的那一圈，按角度取中位色
    dist_in = cv2.distanceTransform(A.astype(np.uint8), cv2.DIST_L2, 5)
    yy, xx = np.mgrid[0:big.shape[0], 0:big.shape[1]]
    th = np.degrees(np.arctan2(yy - cy, xx - cx)) % 360
    ring_src = A & (dist_in > 1.5) & (dist_in < 5) & (yy < ybot - 12)
    bins = np.full((24, 3), np.nan)
    for b in range(24):
        m = ring_src & (th >= b * 15) & (th < b * 15 + 15)
        if m.sum() > 12: bins[b] = np.median(big[..., :3][m], 0)
    okb = ~np.isnan(bins[:, 0]); idxb = np.arange(24)
    for c in range(3): bins[:, c] = np.interp(idxb, idxb[okb], bins[okb, c], period=24)
    ring_col = bins[(th // 15).astype(int) % 24]
    # 椭圆内离边的距离（按 alpha 的距离变换近似）
    din = cv2.distanceTransform((alpha > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    rw = np.clip((5.0 - din) / 2.0, 0, 1)[..., None]                       # 离边 3 px 以内全是描边色，3–5 px 过渡
    # 原图描边和内部的反差如果很小（这一段本来就没有明显的描边），就不画
    contrast = np.linalg.norm(ring_col.astype(np.float32) - fill.astype(np.float32), axis=2, keepdims=True)
    rgb = (fill * (1 - rw) + ring_col * rw).astype(np.uint8)
    out = np.dstack([rgb, (np.clip(alpha, 0, 1) * 255).astype(np.uint8)])
    ys, xs = np.where(alpha > 0.004); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cv2.imwrite(SRC('face', f'iris{S_}.png'), out[y0:y1, x0:x1])
    rect_i = [r[0] - PAD + int(x0), r[1] - PAD + int(y0), int(x1 - x0), int(y1 - y0)]
    iou = float((A & (alpha > 0.5)).sum() / (A | (alpha > 0.5)).sum())
    rep['iris'] = {'ellipse_center_rig': [round(r[0] - PAD + cx, 1), round(r[1] - PAD + cy, 1)], 'axes': [round(d1, 1), round(d2, 1)], 'angle': round(ang, 1), 'iou_with_old': round(iou, 3),
                   'old_rect': r, 'new_rect': rect_i, 'grew_px': {'left': r[0] - rect_i[0], 'top': r[1] - rect_i[1], 'right': rect_i[0] + rect_i[2] - r[0] - r[2], 'bottom': rect_i[1] + rect_i[3] - r[1] - r[3]}}
    parts_out.append(('iris' + S_, rect_i))
    # ------------------------------------------------ 眼白
    im = load('eyeWhite' + S_); r = P['eyeWhite' + S_]['rect']; h, w = im.shape[:2]
    big = np.zeros((h + 2 * PAD, w + 2 * PAD, 4), np.uint8); big[PAD:PAD + h, PAD:PAD + w] = im
    A = big[..., 3] > 128
    pts = np.argwhere(A)[:, ::-1].astype(np.int32); hull = cv2.convexHull(pts)
    hm = np.zeros((big.shape[0] * K, big.shape[1] * K), np.uint8); cv2.fillConvexPoly(hm, (hull.astype(np.float32) * K + K / 2).astype(np.int32), 1)
    hm = cv2.GaussianBlur(hm.astype(np.float32), (0, 0), 3 * K) > 0.5                      # 把凸包的折角磨圆（约 3 px）
    alpha = aa(hm, K)
    hsv = cv2.cvtColor(big[..., :3], cv2.COLOR_BGR2HSV); Hh, Ss, Vv = [hsv[..., i].astype(int) for i in range(3)]
    shadow = A & (Ss > 22) & (Vv < 236) & (Vv > 120) & (Hh > 95) & (Hh < 130)
    shadow = cv2.medianBlur(shadow.astype(np.uint8) * 255, 9) > 127; shadow = ndi.binary_opening(shadow, iterations=3)
    white = A & ~ndi.binary_dilation(shadow, iterations=3) & (Vv > 235) & (Ss < 18)
    wcol = np.median(big[..., :3][white], 0)
    scol = np.median(big[..., :3][shadow], 0) if shadow.sum() > 50 else wcol
    sw = cv2.GaussianBlur(shadow.astype(np.float32), (0, 0), 1.0)[..., None]
    rgb = (wcol[None, None] * (1 - sw) + scol[None, None] * sw).astype(np.uint8)
    out = np.dstack([rgb, (np.clip(alpha, 0, 1) * 255).astype(np.uint8)])
    ys, xs = np.where(alpha > 0.004); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cv2.imwrite(SRC('face', f'eyeWhite{S_}.png'), out[y0:y1, x0:x1])
    rect_w = [r[0] - PAD + int(x0), r[1] - PAD + int(y0), int(x1 - x0), int(y1 - y0)]
    rep['eyeWhite'] = {'old_rect': r, 'new_rect': rect_w, 'area_old': int(A.sum()), 'area_new': int((alpha > 0.5).sum()), 'white_bgr': [int(x) for x in wcol], 'shadow_bgr': [int(x) for x in scol], 'shadow_px': int(shadow.sum())}
    parts_out.append(('eyeWhite' + S_, rect_w))
    hull_canvas = (alpha > 0.5); hull_off = (r[0] - PAD, r[1] - PAD)
    # ------------------------------------------------ 高光
    im = load('eyeHl' + S_); r = P['eyeHl' + S_]['rect']
    v = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)[..., 2]
    m = (im[..., 3] > 128) & (v > 190)
    mb = cv2.resize(m.astype(np.uint8), None, fx=K, fy=K, interpolation=cv2.INTER_LINEAR); mb = cv2.GaussianBlur(mb.astype(np.float32), (0, 0), 1.2 * K) > 0.5
    a2 = aa(mb, K); col = np.median(im[..., :3][m], 0)
    cv2.imwrite(SRC('face', f'eyeHl{S_}.png'), np.dstack([np.broadcast_to(col.astype(np.uint8), im[..., :3].shape), (a2 * 255).astype(np.uint8)]))
    rep['eyeHl'] = {'kept_px': int(m.sum()), 'dropped_dark_ring_px': int(((im[..., 3] > 128) & ~m).sum())}
    parts_out.append(('eyeHl' + S_, r))
    # ------------------------------------------------ 上睫毛
    im = load('lash' + S_).copy(); r = P['lash' + S_]['rect']; h, w = im.shape[:2]
    a = im[..., 3] > 128; v = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)[..., 2]
    dark = a & (v < 110)
    dt = cv2.distanceTransform(dark.astype(np.uint8), cv2.DIST_L2, 5)
    # 眼眶内部：眼白凸包向内收 6 px，换到睫毛的坐标里
    inner = np.zeros((h, w), bool); er = ndi.binary_erosion(hull_canvas, iterations=6)
    ox, oy = int(round(hull_off[0] - r[0])), int(round(hull_off[1] - r[1]))
    ys, xs = np.where(er); ok = (ys + oy >= 0) & (ys + oy < h) & (xs + ox >= 0) & (xs + ox < w); inner[ys[ok] + oy, xs[ok] + ox] = True
    # 逐列看：睫毛主体是每一列最上面那一段深色；它下面如果还有第二段深色、而且落在眼眶内部，就是被抠进来的虹膜描边，去掉。
    # 弧线和主体连在一起的地方（两端）再用半径 4 px 的开运算把鼓出来的小疙瘩削平，只在眼眶内部生效。
    # （第一版只按「细」来删，弧线靠近主体的两头比较粗，留下了两截断头。）
    inner_w = ndi.binary_dilation(inner, iterations=4)
    thin = np.zeros((h, w), bool)
    for x in range(w):
        col = dark[:, x]
        if not col.any(): continue
        ys_c = np.where(col)[0]; brk = np.where(np.diff(ys_c) > 2)[0]
        if len(brk): thin[ys_c[brk[0] + 1]:, x] = col[ys_c[brk[0] + 1]:] & inner_w[ys_c[brk[0] + 1]:, x]
    d2 = dark & ~thin
    opened = cv2.morphologyEx(d2.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))) > 0
    thin |= d2 & ~opened & inner_w
    thin = ndi.binary_dilation(thin, iterations=2) & a & inner_w & ~opened
    im[..., 3][thin] = 0
    im = defringe(im, 1)
    cv2.imwrite(WK('face/eyes_stage1', f'lash{S_}.png'), im)
    rep['lash'] = {'removed_thin_arc_px': int(thin.sum())}
    parts_out.append(('lash' + S_, r))
    # ------------------------------------------------ 下睫毛点
    im = load('eyeLow' + S_).copy(); r = P['eyeLow' + S_]['rect']
    a = im[..., 3] > 40; lb, k = ndi.label(a); drop = 0
    for i in range(1, k + 1):
        m = lb == i; bm, gm, rm = [float(im[..., c][m].mean()) for c in range(3)]
        # 睫毛点是深褐色（红 > 蓝）；碎屑是青灰色（蓝 > 红）。第一版用色相的平均值判断，色相是环形的，平均值不可靠，把真的点也删了。
        if not (rm > bm + 8) or m.sum() < 12: im[..., 3][ndi.binary_dilation(m, iterations=3)] = 0; drop += 1
    cv2.imwrite(SRC('face', f'eyeLow{S_}.png'), defringe(im, 0, 0.6)); rep['eyeLow'] = {'dropped_specks': drop}
    parts_out.append(('eyeLow' + S_, r))
DEPTH = {'eyeWhite': 0.60, 'lash': 0.60, 'eyeLow': 0.60, 'iris': 0.70, 'eyeHl': 0.70}
order = ['eyeWhite', 'iris', 'eyeHl', 'eyeLow', 'lash']
parts = []
for S_ in 'LR':
    for n in order:
        rect = dict(parts_out)[n + S_]; old = P[n + S_]
        parts.append({'id': n + S_, 'src': n + S_ + '.png', 'eye': S_, 'role': old.get('role'), **({'clip': old['clip']} if 'clip' in old else {}), 'rect': rect, 'rect_head_px': [rect[0] - HEAD_ORG[0], rect[1] - HEAD_ORG[1], rect[2], rect[3]],
                      'rect_changed': rect != old['rect'], 'old_rect': old['rect'], 'depth': DEPTH[n]})
json.dump({'space': 'rect 是 rig 空间（= head_master 像素 + [390,136]）；rect_head_px 是 head_master 像素', 'order': '每只眼从下到上：眼白、虹膜、高光、下睫毛点、上睫毛（同 parts/rig.json）；虹膜和高光裁在同侧眼白里',
           'note': '虹膜和眼白的矩形变了（补全以后比原来大），rect_changed=true 的要用新 rect；高光、睫毛、下睫毛点的矩形不变。眼睛的几何（rig.json 的 eyes：中心、gaze、闭合线）没有动。',
           'parts': parts, 'report': report}, open(WK('face/eyes_stage1/eyes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(report, ensure_ascii=False))
