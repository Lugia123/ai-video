#!/usr/bin/env python3
"""多视图头部：抠底、配准、对色、量一致性、登记（#1168）。在 source-next/views/ 下运行：python3 tools/finalize_views.py
输入：SET 里列的候选图（cand/ 下的新图，和 W1 下午已配准的 proto-b/views/ 三张）。
输出：head-<视角>.png（1408²，透明底，和头部母版同一坐标）、views.json、_unaligned/（对色前）。

配准的基准（自动量，母版和各视图用同一把尺子，不依赖人读点）：
  帽顶 y  = 藏青色帽子最上面一行（不算呆毛）
  发底 y  = 头发（薄荷白 / 青绿）最下面一行
  脖轴 x  = 先自动量（衣领顶边上方的脖子肤色，或衣领顶边中心），再按人工读的脖子中线修正到 686（见 NECK_READ，±25px）
整张图等比缩放使「帽顶→发底」等于母版，再平移使帽顶 y 和脖轴 x 落在母版的位置。
W1 下午的三张是按「帽顶→下巴」人工读点配准的，这里不重新配，只量出它们在这把尺子下的偏差。
对色：帽子、浅发、青绿发、肤色、发卡五个区，各自把 Lab 中位数平移到母版的中位数（眼睛不动）。"""
import json, os, sys
import numpy as np, cv2

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(HERE, '../../source')
OLD = os.path.join(HERE, '../../../../../episodes/ep09-screenshot-devlog/proto-b/views')
S = 1408
# 视角：键 = 文件名里的视角名；yaw 为名义档位（负 = 脸朝画面左 = 露出她自己的左侧）。
SET = [
    ('back',       dict(src='cand/head_180_v1_d611.png', tier='正后', nominal=180, how='改图 8 步，母版 + 人偶', readings={})),
    ('rear-L',     dict(src='cand/head_160_rd2_d632.png', tier='后偏左（耳朵从后面露出）', nominal=-160, how='视频 s701 第 25 帧 → 改图 8 步重画', readings={'时间': 135, '耳朵(标定后)': 136, '发卡': 170})),
    ('back34-L',   dict(src='cand/head_135_rd2_d633.png', tier='后 3/4 左', nominal=-135, how='视频 s701 第 19 帧 → 改图 8 步重画', readings={'时间': 124, '耳朵(标定后)': 128, '发卡': 148})),
    ('profile-L',  dict(old='head-v3-profile.png', tier='正侧 左', nominal=-90, how='W1 下午：改图 8 步，母版 + 人偶', readings={'单眼': '75–100'})),
    ('quarter-L',  dict(old='head-v2-quarter.png', tier='3/4 左', nominal=-45, how='W1 下午：改图 8 步', readings={'眼宽比': 54})),
    ('slight-L',   dict(old='head-v1-slight.png', tier='微侧 左', nominal=-25, how='W1 下午：改图 8 步', readings={'眼宽比': 33, '球面': 10})),
    ('front',      dict(old='head-v0-front.png', tier='正面（母版）', nominal=0, how='定稿母版', readings={})),
    ('quarter-R',  dict(src='cand/head_045R_rd_d651.png', tier='3/4 右', nominal=45, how='视频 s703 第 15 帧 → 改图 8 步重画', readings={'时间': 26})),
    ('profile-R',  dict(src='cand/head_090R_v1_d641.png', tier='正侧 右', nominal=90, how='改图 8 步，母版 + 镜像人偶', readings={'单眼': '75–100'})),
    ('back34-R',   dict(src='cand/head_135R_rd_d652.png', tier='后 3/4 右', nominal=135, how='视频 s704 第 11 帧 → 改图 8 步重画', readings={'时间': 108})),
]


NECK_READ = {'back': 695, 'rear-L': 730, 'back34-L': 650, 'quarter-R': 800, 'profile-R': 800, 'back34-R': 800}


def zones(bgr, alpha=None):
    """按颜色分区（像素级，粗）。返回 dict 名字 → bool 蒙版。"""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.int16); lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.int16)
    H, Sa, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    ok = np.ones(H.shape, bool) if alpha is None else alpha > 200
    z = {}
    z['hat'] = ok & (H > 98) & (H < 125) & (Sa > 90) & (V > 40) & (V < 140)                # 藏青
    z['hair_light'] = ok & (H > 70) & (H < 98) & (Sa > 12) & (Sa < 95) & (V > 200)          # 薄荷白
    z['hair_teal'] = ok & (H > 76) & (H < 98) & (Sa >= 95) & (V > 110)                      # 青绿（发梢内侧、挑染）
    z['skin'] = ok & (lab[..., 0] > 190) & (lab[..., 1] > 132) & (lab[..., 2] > 136) & (H < 20)
    z['pin'] = ok & (H > 14) & (H < 32) & (Sa > 140) & (V > 150)
    z['line'] = ok & (V < 60)
    return z


def measure(bgr, alpha):
    z = zones(bgr, alpha); h, w = alpha.shape
    hat = cv2.morphologyEx(z['hat'].astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8)) > 0
    n, cc, st, cen = cv2.connectedComponentsWithStats(hat.astype(np.uint8))
    j = 1 + int(np.argmax(st[1:, 4])); hat = cc == j                                         # 最大的一块藏青 = 帽子（衣领是另一块）
    ys, xs = np.where(hat); hat_top = int(ys.min()); hat_l, hat_r = int(xs.min()), int(xs.max())
    hair = cv2.morphologyEx((z['hair_light'] | z['hair_teal']).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)) > 0
    n, cc, st, cen = cv2.connectedComponentsWithStats(hair.astype(np.uint8))
    hair = np.isin(cc, [i for i in range(1, n) if st[i, 4] > 2000 and st[i, 1] < ys.max() + 400 and st[i, 1] + st[i, 3] < h - 3])
    hy, hx = np.where(hair & (np.indices(hair.shape)[0] > hat_top + 150)); hair_bot = int(np.percentile(hy, 99.7))
    # 脖轴：衣领（帽子以外最大的一块藏青，在头发下方）顶边往上 4–26px 这一条里的肤色 = 脖子（避开下巴：下巴不会贴着衣领）。
    # 背面看不到脖子：用衣领顶边那几行的藏青中心。
    coll = z['hat'] & ~hat; coll[: hat_top + 400] = False
    n2, cc2, st2, _ = cv2.connectedComponentsWithStats(cv2.morphologyEx(coll.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)))
    neck_x, neck_by = float((hat_l + hat_r) / 2), 'hat'
    if n2 > 1:
        j2 = 1 + int(np.argmax(st2[1:, 4])); cm = cc2 == j2; cy, cx = np.where(cm); ctop = int(cy.min())
        topx = cx[cy < ctop + 25]
        sk = z['skin'][max(0, ctop - 26): max(1, ctop - 4)]; skx = np.where(sk)[1]
        skx = skx[(skx > cx.min() - 60) & (skx < cx.max() + 60)]
        if len(skx) > 150: neck_x, neck_by = float((np.percentile(skx, 5) + np.percentile(skx, 95)) / 2), 'skin'
        else: neck_x, neck_by = float((topx.min() + topx.max()) / 2), 'collar'
    # 线宽：深色线的距离变换 ×2 的中位数（沿线中心）
    line = z['line'].astype(np.uint8); dt = cv2.distanceTransform(line, cv2.DIST_L2, 5)
    ridge = (dt >= cv2.dilate(dt, np.ones((3, 3), np.uint8)) - 1e-6) & (dt > 1.5)
    lw = float(np.median(dt[ridge]) * 2) if ridge.any() else None
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    med = {k: (np.median(lab[m], 0).round(1).tolist() if m.sum() > 300 else None) for k, m in z.items() if k != 'line'}
    return dict(hat_top=hat_top, hair_bottom=hair_bot, neck_x=round(neck_x, 1), neck_by=neck_by, hat_w=hat_r - hat_l, line_w=round(lw, 1) if lw else None, lab=med), z


def cutout(bgr):
    """背景 = 和边框颜色接近、且与上/左/右三条边连通的区域。"""
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.int16); h, w = lab.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); bm = np.zeros((h, w), bool); bm[:6] = True; bm[:, :6] = True; bm[:, -6:] = True
    X = np.c_[xx[bm], yy[bm], np.ones(bm.sum())]; plane = np.stack([(np.c_[xx.ravel(), yy.ravel(), np.ones(h * w)] @ np.linalg.lstsq(X, lab[..., c][bm].astype(np.float32), rcond=None)[0]).reshape(h, w) for c in range(3)], -1)
    like = (np.abs(lab - plane).sum(-1) < 16).astype(np.uint8)
    n, cc = cv2.connectedComponents(like, connectivity=4)
    seeds = set(cc[0]) | set(cc[:, 0]) | set(cc[:, -1]); seeds.discard(0)
    bg = np.isin(cc, list(seeds)) & (like > 0)
    fg = cv2.erode((~bg).astype(np.uint8), np.ones((3, 3), np.uint8))
    a = cv2.GaussianBlur(fg.astype(np.float32), (0, 0), 0.8)
    return np.clip(a * 255, 0, 255).astype(np.uint8)


def color_align(bgr, alpha, zsrc, ref_lab):
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32); out = lab.copy(); rep = {}
    for k in ('hat', 'hair_light', 'hair_teal', 'skin', 'pin'):
        m = zsrc[k]
        if m.sum() < 300 or ref_lab.get(k) is None: continue
        cur = np.median(lab[m], 0); sh = np.float32(ref_lab[k]) - cur
        wgt = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.5)[..., None]                 # 区域内部满强度，边缘渐弱
        out += sh * np.clip(wgt, 0, 1) * m[..., None]
        rep[k] = {'before': round(float(np.linalg.norm(sh)), 1)}
    res = cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    lab2 = cv2.cvtColor(res, cv2.COLOR_BGR2LAB).astype(np.float32)
    for k in rep: rep[k]['after'] = round(float(np.linalg.norm(np.float32(ref_lab[k]) - np.median(lab2[zsrc[k]], 0))), 1)
    return res, rep


master = cv2.imread(os.path.join(OLD, 'head-v0-front.png'), cv2.IMREAD_UNCHANGED)
M, _ = measure(master[..., :3].copy(), master[..., 3])
print('母版：', {k: M[k] for k in ('hat_top', 'hair_bottom', 'neck_x', 'hat_w', 'line_w')})
os.makedirs(os.path.join(HERE, '_unaligned'), exist_ok=True)
reg = {'canvas': [S, S], 'space': 'head_master_px', 'reference': 'source/master/head_master.png',
       'anchors_auto': {k: M[k] for k in ('hat_top', 'hair_bottom', 'neck_x')},
       'anchors_readme': '帽顶 y、发底 y、脖轴 x 都是 tools/finalize_views.py 自动量的（见脚本开头），母版和各视图同一把尺子。W1 下午的三张是按人工读的「帽顶 95 / 下巴 1192 / 脖轴 686」配准的，这里没有重配，residual 是它们在这把尺子下的偏差。',
       'yaw_readme': 'nominal 是档位名义角（负 = 脸朝画面左 = 露出她自己的左侧，发卡那一侧）；readings 是几种互不一致的实测读数，都只是估计。Q 版的斜侧是画法约定，不是球在转。',
       'views': {}}
for name, c in SET:
    if 'old' in c:
        im = cv2.imread(os.path.join(OLD, c['old']), cv2.IMREAD_UNCHANGED); bgr, a = im[..., :3].copy(), im[..., 3]; note = '沿用 proto-b/views/ 已配准、已对色的图，未改动'
        m, z = measure(bgr, a); rep = None; scale, tx, ty = 1.0, 0.0, 0.0
    else:
        raw = cv2.imread(os.path.join(HERE, c['src']))
        if raw.shape[0] != S: raw = cv2.resize(raw, (S, S), interpolation=cv2.INTER_LANCZOS4)
        a0 = cutout(raw); m0, z0 = measure(raw, a0)
        scale = (M['hair_bottom'] - M['hat_top']) / (m0['hair_bottom'] - m0['hat_top'])
        tx, ty = M['neck_x'] - m0['neck_x'] * scale, M['hat_top'] - m0['hat_top'] * scale
        # 自动量的脖轴不可靠（转过去以后衣领顶边的中心不在脖子上）：横向再按人工读的脖子中线修正。
        # NECK_READ[name] = 自动配准后的图上，人对着 50px 网格读到的脖子中线 x（±25px）；目标是 W1 用的 686。
        if name in NECK_READ: tx += 686 - NECK_READ[name]
        A = np.float32([[scale, 0, tx], [0, scale, ty]])
        rgba = np.dstack([raw, a0]).astype(np.float32); rgba[..., :3] *= rgba[..., 3:4] / 255.
        w = cv2.warpAffine(rgba, A, (S, S), flags=cv2.INTER_LANCZOS4 if scale > 1 else cv2.INTER_AREA)
        a = np.clip(w[..., 3], 0, 255).astype(np.uint8); bgr = np.clip(np.where(a[..., None] > 2, w[..., :3] / np.maximum(w[..., 3:4], 1) * 255., 0), 0, 255).astype(np.uint8)
        cv2.imwrite(os.path.join(HERE, '_unaligned', f'head-{name}.png'), np.dstack([bgr, a]))
        _, z = measure(bgr, a); bgr, rep = color_align(bgr, a, z, M['lab'])
        m, z = measure(bgr, a); note = ''
    cv2.imwrite(os.path.join(HERE, f'head-{name}.png'), np.dstack([bgr, a]))
    ys, xs = np.where(a > 20)
    dcol = {k: (round(float(np.linalg.norm(np.float32(m['lab'][k]) - np.float32(M['lab'][k]))), 1) if m['lab'].get(k) and M['lab'].get(k) else None) for k in ('hat', 'hair_light', 'hair_teal', 'skin', 'pin')}
    reg['views'][f'head-{name}.png'] = dict(view=name, tier=c['tier'], nominal_yaw=c['nominal'], yaw_readings=c['readings'], how=c['how'], source=c.get('src') or 'proto-b/views/' + c['old'], steps=8 if name != 'front' else 40,
        scale_applied=round(float(scale), 4), translate_applied=[round(float(tx), 1), round(float(ty), 1)],
        measured={k: m[k] for k in ('hat_top', 'hair_bottom', 'neck_x', 'neck_by', 'hat_w', 'line_w')},
        residual={'hat_top': m['hat_top'] - M['hat_top'], 'hair_bottom': m['hair_bottom'] - M['hair_bottom'], 'neck_x': round(m['neck_x'] - M['neck_x'], 1)},
        consistency={'lab_distance_to_master': dcol, 'line_w_px': m['line_w'], 'line_w_master': M['line_w'], 'hat_w_ratio': round(m['hat_w'] / M['hat_w'], 3)},
        color_align=rep, bbox=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], clipped=[e for e, v in (('left', xs.min() <= 1), ('right', xs.max() >= S - 2), ('top', ys.min() <= 1), ('bottom', ys.max() >= S - 2)) if v], note=note)
    print(f'{name:10s} 缩放 {scale:.3f} 残差 帽顶 {m["hat_top"] - M["hat_top"]:+d} 发底 {m["hair_bottom"] - M["hair_bottom"]:+d} 脖轴 {m["neck_x"] - M["neck_x"]:+.0f}（{m["neck_by"]}） 线宽 {m["line_w"]} 帽宽比 {m["hat_w"] / M["hat_w"]:.2f} 色差 {dcol}')
json.dump(reg, open(os.path.join(HERE, 'views.json'), 'w'), ensure_ascii=False, indent=1)
