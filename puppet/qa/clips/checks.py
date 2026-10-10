#!/usr/bin/env python3
"""动画片段（透明序列帧）的质量读数。只出读数和一张标注图，不判过不过——阈值还没定。

用法：
  python3 qa/clips/checks.py <帧目录> --rest <归位帧.png> [--glob 'up-*.png'] [--first <首姿关键图>] [--last <尾姿关键图>]
                             [--regions qa/clips/<角色>.json] [--key-color 236,64,200] [--name 名字] [--out out/clips-checks]
  → <out>/<名字>.json（全部读数，逐帧曲线都在里面）、<out>/<名字>.png（标注图）、终端打一段摘要

输入：
  帧目录     一段 RGBA 序列帧，按文件名排序就是播放顺序（--glob 从一个目录里挑一段）
  --rest     归位帧（角色站好不动的那张，RGBA）。用来分「不该动的区域」、定人高、定脚的位置
  --first    这段开头应该接上的姿势图，默认 = 归位帧；--last 这段结尾应该接上的姿势图，默认 = 归位帧
  --regions  角色的「不该动的区域」配置：每块一个色域（OpenCV HSV，H 0–179）+ 在归位帧包围盒里的范围
关键图和帧尺寸不同时，关键图缩到帧的尺寸再比。长度类读数同时给像素和「占人高的 ‰」（人高 = 归位帧里人物包围盒的高），
不同分辨率的两套帧用后者比。

六组读数：
  a cut      切人：逐帧人物包围盒到画布四边的距离、贴边（最外一圈）的不透明像素数
  b seam     接缝：第 0 帧↔首姿图、末帧↔尾姿图、第 0→1 帧、倒数第 2→末帧 四处的色差 / 轮廓不一致 / 位移 / 清晰度比
  c identity 身份漂移：每块不该动的区域逐帧的面积比、色差、中心位移，各自最大偏离在第几帧
  d matte    抠边：不透明像素里的键色残留数、半透明边的宽度
  e motion   动作占比：逐帧与前一帧的差，动作实际落在第几到第几帧
  f feet     脚底：脚的包围盒底边和横向中心相对归位帧的逐帧漂移
"""
import argparse, glob, json, os, sys
import numpy as np, cv2
from scipy import ndimage as ndi

OPAQUE, VISIBLE = 128, 16          # alpha 超过 OPAQUE 算「人」，超过 VISIBLE 算「看得见」
MOVE_DIFF = 24                     # 动作口径：模糊后任一通道差超过这个数算「这个像素变了」
FOOT_BAND = 0.06                   # 脚 = 人物最底下这一截（占人高）


def load(path, size=None):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None: sys.exit(f'读不了图：{path}')
    if im.ndim != 3 or im.shape[2] != 4: sys.exit(f'不是带透明通道的图：{path}')
    im = cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA)
    if size and (im.shape[1], im.shape[0]) != size:
        # 预乘后再缩，免得透明处的垃圾颜色渗进边缘
        a = im[..., 3:].astype(np.float32) / 255
        pm = cv2.resize(np.dstack([im[..., :3] * a, a * 255]).astype(np.float32), size, interpolation=cv2.INTER_AREA)
        aa = np.clip(pm[..., 3:] / 255, 1e-4, 1)
        im = np.dstack([np.clip(pm[..., :3] / aa, 0, 255), pm[..., 3]]).round().astype(np.uint8)
    return im


def bbox(mask):
    ys, xs = np.where(mask)
    return None if not len(ys) else [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]   # x0 y0 x1 y1（右下不含）


def sharp(im, size=None):
    """清晰度：不透明区内部（离边 3px 以上）拉普拉斯的方差。给了 size 就先放大到那个尺寸再量——
    小图在自己的分辨率下看着都锐，放到成片里才软，所以跨分辨率比要放到同一个尺寸（归位帧的原尺寸）。"""
    if size and (im.shape[1], im.shape[0]) != size: im = cv2.resize(im, size, interpolation=cv2.INTER_CUBIC)
    m = ndi.binary_erosion(im[..., 3] > 250, iterations=3)
    if m.sum() < 100: return 0.0
    return float(cv2.Laplacian(cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2GRAY).astype(np.float32), cv2.CV_32F)[m].var())


def pair(a, b):
    """两张 RGBA 的差：两边都不透明处的平均色差（0–255）、轮廓不一致的像素占人面积 %、整体位移估计（相位相关，px）、清晰度比 b/a。"""
    oa, ob = a[..., 3] > OPAQUE, b[..., 3] > OPAQUE; both = oa & ob
    d = np.abs(a[..., :3].astype(np.float32) - b[..., :3].astype(np.float32)).mean(2)
    pa, pb = [(x[..., :3].astype(np.float32).mean(2) * (x[..., 3] / 255.0)).astype(np.float32) for x in (a, b)]
    win = cv2.createHanningWindow(pa.shape[::-1], cv2.CV_32F)
    (dx, dy), resp = cv2.phaseCorrelate(pa, pb, win); (zx, zy), _ = cv2.phaseCorrelate(pa, pa, win); dx -= zx; dy -= zy   # 减掉自己比自己的零点（偶数边长时不是 0）
    sa, sb = sharp(a), sharp(b)
    return {'color': round(float(d[both].mean()), 2) if both.any() else None,
            'outline_pct': round(float((oa != ob).sum() / max(1, oa.sum()) * 100), 3),
            'shift': [round(dx, 2), round(dy, 2)], 'shift_conf': round(float(resp), 3),
            'sharp_ratio': round(sb / sa, 3) if sa else None}


def region_masks(rest, cfg, box):
    """按配置把归位帧分成几块：色域 ∩ 包围盒里的范围 ∩ 不透明，只留最大的 keep 个连通块。"""
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    hsv = cv2.cvtColor(rest[..., :3], cv2.COLOR_RGB2HSV); out = {}
    for name, r in cfg.items():
        m = cv2.inRange(hsv, np.array(r['lo'], np.uint8), np.array(r['hi'], np.uint8)) > 0
        win = np.zeros_like(m); ya, yb = r.get('y', [0, 1]); xa, xb = r.get('x', [0, 1])
        win[int(y0 + ya * h):int(y0 + yb * h), int(x0 + xa * w):int(x0 + xb * w)] = True
        m &= win & (rest[..., 3] > OPAQUE)
        lab, n = ndi.label(m)
        if n > r.get('keep', 1):
            sizes = ndi.sum(m, lab, range(1, n + 1)); keep = np.argsort(sizes)[::-1][:r.get('keep', 1)] + 1
            m = np.isin(lab, keep)
        out[name] = m
    return out


def region_stat(im, hsv, lo, hi, window):
    m = (cv2.inRange(hsv, lo, hi) > 0) & window & (im[..., 3] > OPAQUE)
    n = int(m.sum())
    if not n: return 0, None, None
    ys, xs = np.where(m)
    return n, cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2LAB)[m].astype(np.float32).mean(0), (float(xs.mean()), float(ys.mean()))


def feet(im, char_h):
    """脚：人物最底下 FOOT_BAND×人高 这一截。→ 底边 y、这一截的横向中心、左右边。"""
    o = im[..., 3] > OPAQUE; rows = np.where(o.any(1))[0]
    if not len(rows): return None
    bot = int(rows.max()) + 1; band = o[max(0, bot - max(2, int(round(FOOT_BAND * char_h)))):bot]
    xs = np.where(band.any(0))[0]
    return bot, float(np.where(band)[1].mean()), int(xs.min()), int(xs.max()) + 1


def main():
    ap = argparse.ArgumentParser(description='片段质量读数（只出读数，不判过不过）')
    ap.add_argument('frames'); ap.add_argument('--rest', required=True); ap.add_argument('--glob', default='*.png')
    ap.add_argument('--first'); ap.add_argument('--last'); ap.add_argument('--regions')
    ap.add_argument('--key-color', default='236,64,200'); ap.add_argument('--name'); ap.add_argument('--out', default='out/clips-checks')
    ap.add_argument('--no-image', action='store_true')
    A = ap.parse_args()
    files = sorted(glob.glob(os.path.join(A.frames, A.glob)))
    if len(files) < 3: sys.exit(f'{A.frames} 里按 {A.glob} 只找到 {len(files)} 帧，至少要 3 帧')
    fr = [load(f) for f in files]; H, W = fr[0].shape[:2]; n = len(fr)
    if any(f.shape[:2] != (H, W) for f in fr): sys.exit('各帧尺寸不一致')
    rest = load(A.rest, (W, H)); first = load(A.first, (W, H)) if A.first else rest; last = load(A.last, (W, H)) if A.last else rest
    rbox = bbox(rest[..., 3] > OPAQUE); char_h = rbox[3] - rbox[1]
    pm = lambda px: round(px / char_h * 1000, 2)          # 像素 → 占人高的 ‰
    name = A.name or os.path.basename(os.path.normpath(A.frames)) + ('' if A.glob == '*.png' else '-' + A.glob.split('*')[0].strip('-_'))
    R = {'name': name, 'frames': n, 'size': [W, H], 'rest_bbox': rbox, 'char_h': char_h,
         'units': '长度读数：*_px 是这套帧自己的像素，*_pm 是占人高的千分比（人高 = 归位帧里人物包围盒的高），跨分辨率比用 *_pm'}

    # ---- a 切人 ----
    boxes, margins, edge_opaque, edge_visible = [], [], [], []
    for f in fr:
        a = f[..., 3]; b = bbox(a > VISIBLE); boxes.append(b)
        margins.append([b[0], b[1], W - b[2], H - b[3]] if b else [0, 0, 0, 0])        # 左 上 右 下
        ring = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
        edge_opaque.append(int((ring > OPAQUE).sum())); edge_visible.append(int((ring > 0).sum()))
    M = np.array(margins); side = ['左', '上', '右', '下']; k = np.unravel_index(M.argmin(), M.shape)
    R['cut'] = {'min_margin_px': int(M.min()), 'min_margin_pm': pm(M.min()), 'min_margin_pct_of_canvas': round(float((M / [W, H, W, H]).min() * 100), 2),
                'min_margin_at': {'frame': int(k[0]), 'side': side[k[1]]},
                'min_per_side_px': dict(zip(side, M.min(0).tolist())), 'min_per_side_frame': dict(zip(side, M.argmin(0).tolist())),
                'edge_opaque_pixels_max': max(edge_opaque), 'edge_visible_pixels_max': max(edge_visible),
                'frames_touching_edge': [i for i, v in enumerate(edge_visible) if v], 'margins_px': margins, 'bbox': boxes}

    # ---- b 接缝 ----
    R['seam'] = {'frame0_vs_first': pair(first, fr[0]), 'last_vs_lastkey': pair(last, fr[-1]),
                 'jump_0_1': pair(fr[0], fr[1]), 'jump_end': pair(fr[-2], fr[-1]),
                 'jump_1_2': pair(fr[1], fr[2]), 'jump_before_end': pair(fr[-3], fr[-2]),
                 'note': 'jump_1_2 / jump_before_end 是紧挨着的「片段内部」相邻帧，给 jump_0_1 / jump_end 当对照：接缝处比内部大得多才算跳'}
    nat = lambda p: cv2.cvtColor(cv2.imread(p, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)      # 关键图不缩，按原尺寸量
    rest_n = nat(A.rest); NS = (rest_n.shape[1], rest_n.shape[0])
    R['sharpness'] = [round(sharp(f, NS), 1) for f in fr]
    R['sharpness_keys'] = {'rest': round(sharp(rest_n), 1), 'first': round(sharp(nat(A.first), NS), 1) if A.first else round(sharp(rest_n), 1),
                           'last': round(sharp(nat(A.last), NS), 1) if A.last else round(sharp(rest_n), 1)}
    mid = float(np.median(R['sharpness'][1:-1])); R['sharpness_mid_over_rest'] = round(mid / max(1e-9, R['sharpness_keys']['rest']), 3)
    R['sharpness_note'] = f'清晰度都放大到归位帧原尺寸 {NS[0]}×{NS[1]} 再量（拉普拉斯方差），不同分辨率的两套帧可以直接比；sharpness_mid_over_rest = 中间帧中位 ÷ 归位帧'

    # ---- c 身份漂移 ----
    R['identity'] = {}; masks = {}
    if A.regions:
        cfg = json.load(open(A.regions))['regions']; masks = region_masks(rest, cfg, rbox)
        rest_hsv = cv2.cvtColor(rest[..., :3], cv2.COLOR_RGB2HSV); hsvs = [cv2.cvtColor(f[..., :3], cv2.COLOR_RGB2HSV) for f in fr]
        for rn, m in masks.items():
            if not m.any(): R['identity'][rn] = {'error': '归位帧里按配置没分出这一块'}; continue
            lo, hi = np.array(cfg[rn]['lo'], np.uint8), np.array(cfg[rn]['hi'], np.uint8)
            win = ndi.binary_dilation(m, iterations=max(2, int(round(0.03 * char_h))))     # 只在原位附近找，别把别处的同色算进来
            n0, lab0, c0 = region_stat(rest, rest_hsv, lo, hi, win); area, dE, pos = [], [], []
            for f, hsv in zip(fr, hsvs):
                ni, labi, ci = region_stat(f, hsv, lo, hi, win)
                area.append(round(ni / n0, 3)); dE.append(round(float(np.linalg.norm((labi - lab0) * [100 / 255, 1, 1])), 2) if ni else None)
                pos.append([pm(ci[0] - c0[0]), pm(ci[1] - c0[1])] if ni else None)
            dist = [None if p is None else round(float(np.hypot(*p)), 2) for p in pos]
            worst = lambda v, key: max((i for i in range(n) if v[i] is not None), key=lambda i: key(v[i]), default=None)
            ia, ic, ip = worst(area, lambda x: abs(x - 1)), worst(dE, lambda x: x), worst(dist, lambda x: x)
            R['identity'][rn] = {'rest_area_px': n0, 'area_ratio': area, 'color_dE': dE, 'pos_pm': pos, 'pos_dist_pm': dist,
                                 'worst_area': {'frame': ia, 'ratio': area[ia]}, 'worst_color': {'frame': ic, 'dE': dE[ic]},
                                 'worst_pos': {'frame': ip, 'pm': dist[ip], 'xy_pm': pos[ip]},
                                 'frames_missing': [i for i in range(n) if area[i] < 0.5]}
        R['identity_note'] = 'area_ratio = 这一块的面积 ÷ 归位帧里的面积；color_dE = 平均色和归位帧的 Lab 距离；pos = 中心位移（‰ 人高）。' \
                             '这块被手挡住、或者这个动作本来就该带着它动时，读数也会变——读数只说「变了多少、在第几帧」，是不是毛病要对着图看'

    # ---- d 抠边 ----
    kc = np.array([int(x) for x in A.key_color.split(',')], np.float32); residue, fringe, semi_w, semi_p95 = [], [], [], []
    chroma = float(kc.max() - kc.min()) > 80           # 底色是不是鲜艳的键色（品红、绿）。不是（比如中灰）就不能按颜色满图找残留：角色自己身上就有一大片这种颜色
    def key_hits(f):
        rgb, a = f[..., :3].astype(np.float32), f[..., 3]
        if chroma:
            near = np.abs(rgb - kc).max(2) < 60                                   # 离键色近
            mg = np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1] > 40          # 偏品红（键色是品红时等价于「品红程度」，沿用原来的口径）
            hit = near | mg if (min(kc[0], kc[2]) - kc[1] > 80) else near
            return int((hit & (a > 200)).sum()), int((hit & (a > 32) & (a <= 200)).sum())
        # 非键色的底（中灰等）：只看贴着轮廓的那一圈（离透明处 3px 以内）——没抠掉的底只会留在边上；颜色要离底色很近（28 以内）
        band = ndi.binary_dilation(a == 0, iterations=3); hit = np.abs(rgb - kc).max(2) < 28
        return int((hit & band & (a > 200)).sum()), int((hit & (a > 32) & (a <= 200)).sum())
    base = key_hits(rest)                              # 归位帧自己按同一口径数出来多少：这是「本来就有」的底数，逐帧读数要和它比
    for f in fr:
        a = f[..., 3]; r_, f_ = key_hits(f); residue.append(r_); fringe.append(f_)
        semi = (a > 0) & (a < 255)
        if semi.any():
            w = ndi.distance_transform_edt(a > 0)[semi] + ndi.distance_transform_edt(a < 255)[semi] - 1
            semi_w.append(round(float(w.mean()), 2)); semi_p95.append(round(float(np.percentile(w, 95)), 2))
        else: semi_w.append(0.0); semi_p95.append(0.0)
    R['matte'] = {'key_color': kc.astype(int).tolist(), 'key_is_chroma': chroma, 'residue_rest_baseline': {'opaque': base[0], 'fringe': base[1]},
                 'residue_opaque_over_rest_max': max(residue) - base[0], 'residue_fringe_over_rest_max': max(fringe) - base[1], 'residue_opaque': residue, 'residue_opaque_max': max(residue), 'residue_opaque_frames': [i for i, v in enumerate(residue) if v],
                  'residue_fringe': fringe, 'residue_fringe_max': max(fringe), 'residue_fringe_at': int(np.argmax(fringe)),
                  'semi_width_px': semi_w, 'semi_width_p95_px': semi_p95, 'semi_width_mean_px': round(float(np.mean(semi_w)), 2),
                  'semi_width_mean_pm': pm(np.mean(semi_w)), 'semi_width_p95_max_px': max(semi_p95), 'semi_width_p95_max_at': int(np.argmax(semi_p95)),
                  'note': '底色是鲜艳的键色时：residue_opaque = alpha>200 的像素里像键色的个数；底色不鲜艳（中灰等）时改成只数贴着轮廓 3px 以内、颜色离底色 28 以内的像素，并且要和归位帧自己的底数 residue_rest_baseline 比（*_over_rest_max = 最多的一帧 − 归位帧）。residue_fringe = 半透明边（32<alpha≤200）里像键色的个数；'
                          'semi_width = 半透明带的宽度（每个半透明像素到全透明和到全不透明的距离之和 − 1），均值和 95 分位'}

    # ---- e 动作占比 ----
    # 两个口径：flicker = 预乘颜色的平均差（线条抖一两个像素、整体闪也算进来）；moved = 先模糊掉线条抖动，再数「变了很多」的面积（真的有东西挪了地方）。
    # 动作范围按 moved 算。都按归位帧的人面积归一。
    area0 = max(1, int((rest[..., 3] > OPAQUE).sum())); sig = max(0.8, 0.004 * char_h)
    pre = [f[..., :3].astype(np.float32) * (f[..., 3:] / 255.0) for f in fr]; blur = [cv2.GaussianBlur(p, (0, 0), sig) for p in pre]
    flick, mot = [0.0], [0.0]
    for i in range(1, n):
        flick.append(round(float(np.abs(pre[i] - pre[i - 1]).mean(2).sum() / area0), 2))
        mot.append(round(float((np.abs(blur[i] - blur[i - 1]).max(2) > MOVE_DIFF).sum() / area0 * 100), 2))
    off = 2 if n > 5 else 1; inner = np.array(mot[off:n - 1] if n > 5 else mot[1:])     # 去掉首尾接缝那两步（那是「换成关键图」的跳，不是动作）
    peak = float(inner.max()); act = [i + off for i, v in enumerate(inner) if v > 0.1 * peak] if peak > 0 else []
    cum = np.cumsum(inner) / max(1e-9, inner.sum())
    R['motion'] = {'moved_pct': mot, 'flicker': flick, 'peak': round(peak, 2), 'peak_at': int(inner.argmax()) + off,
                   'active_first': act[0] if act else None, 'active_last': act[-1] if act else None, 'active_frames': act,
                   'stalls': [i for i in range(act[0], act[-1]) if i not in act] if act else [],
                   'p05_frame': int(np.searchsorted(cum, 0.05)) + off, 'p95_frame': int(np.searchsorted(cum, 0.95)) + off,
                   'active_share_pct': round((act[-1] - act[0] + 1) / (n - 1) * 100, 1) if act else 0,
                   'still_flicker': round(float(np.median([flick[i] for i in range(off, n - 1) if i not in act] or [0])), 2),
                   'note': f'moved_pct[i] = 第 i 帧和第 i−1 帧之间「变了很多」的面积占人面积的 %（先按 0.4% 人高模糊，再数任一通道差 > {MOVE_DIFF} 的像素）。'
                           'active = 超过峰值 10% 的步，头尾两步（接缝）不算；stalls = 动作范围里几乎没动的帧（卡顿 / 重复帧）；p05/p95 = moved 累计到 5% / 95% 的帧；'
                           'flicker[i] = 两帧预乘颜色的平均差（0–255），still_flicker = 不在动的那些步的 flicker 中位数（人站着不动时画面自己闪多少）'}

    # ---- f 脚底 ----
    f0 = feet(rest, char_h); bot, cx, lr = [], [], []
    for f in fr:
        q = feet(f, char_h)
        bot.append(q[0] - f0[0] if q else None); cx.append(round(q[1] - f0[1], 2) if q else None); lr.append([q[2] - f0[2], q[3] - f0[3]] if q else None)
    ab = lambda v: [abs(x) if x is not None else -1 for x in v]
    R['feet'] = {'rest_bottom_y': f0[0], 'rest_center_x': round(f0[1], 1), 'bottom_dy_px': bot, 'center_dx_px': cx, 'left_right_dx_px': lr,
                 'bottom_max_px': max(ab(bot)), 'bottom_max_pm': pm(max(ab(bot))), 'bottom_max_at': int(np.argmax(ab(bot))),
                 'center_max_px': max(ab(cx)), 'center_max_pm': pm(max(ab(cx))), 'center_max_at': int(np.argmax(ab(cx))),
                 'note': f'脚 = 人物最底下 {FOOT_BAND:.0%} 人高这一截；底边 = 最低的不透明行；中心 = 这一截不透明像素的横向重心。都是相对归位帧的差'}

    os.makedirs(A.out, exist_ok=True)
    json.dump(R, open(os.path.join(A.out, name + '.json'), 'w'), ensure_ascii=False, indent=1)
    if not A.no_image: sheet(R, fr, rest, masks, os.path.join(A.out, name + '.png'))
    print(summary(R))


def summary(R):
    c, s, m, e, f = R['cut'], R['seam'], R['matte'], R['motion'], R['feet']
    sm = lambda k: f"色差 {s[k]['color']}，轮廓不一致 {s[k]['outline_pct']}%，位移 {s[k]['shift']}px，清晰度比 {s[k]['sharp_ratio']}"
    L = [f"== {R['name']}：{R['frames']} 帧，{R['size'][0]}×{R['size'][1]}，人高 {R['char_h']}px ==",
         f"a 切人：最小留白 {c['min_margin_px']}px（{c['min_margin_pm']}‰ 人高，画布的 {c['min_margin_pct_of_canvas']}%），在第 {c['min_margin_at']['frame']} 帧{c['min_margin_at']['side']}边；"
         f"四边各自最小 {c['min_per_side_px']}；贴边不透明像素最多 {c['edge_opaque_pixels_max']}，贴边可见像素最多 {c['edge_visible_pixels_max']}",
         f"b 接缝：第 0 帧↔首姿图 {sm('frame0_vs_first')}", f"         末帧↔尾姿图 {sm('last_vs_lastkey')}",
         f"         0→1 帧 {sm('jump_0_1')}   （对照 1→2：色差 {s['jump_1_2']['color']}，清晰度比 {s['jump_1_2']['sharp_ratio']}）",
         f"         末两帧 {sm('jump_end')}   （对照 再前一步：色差 {s['jump_before_end']['color']}，清晰度比 {s['jump_before_end']['sharp_ratio']}）",
         f"         清晰度（放大到归位帧原尺寸量）：首姿图 {R['sharpness_keys']['first']}，中间帧中位 {float(np.median(R['sharpness'][1:-1])):.1f}（归位帧的 {R['sharpness_mid_over_rest']} 倍），尾姿图 {R['sharpness_keys']['last']}"]
    for rn, v in R['identity'].items():
        if 'error' in v: L.append(f"c 身份 {rn}：{v['error']}"); continue
        L.append(f"c 身份 {rn}：面积比最偏 {v['worst_area']['ratio']}（第 {v['worst_area']['frame']} 帧），色差最大 ΔE {v['worst_color']['dE']}（第 {v['worst_color']['frame']} 帧），"
                 f"位移最大 {v['worst_pos']['pm']}‰（第 {v['worst_pos']['frame']} 帧）" + (f"，面积掉到一半以下的帧 {v['frames_missing']}" if v['frames_missing'] else ''))
    kr = f"不透明处键色残留最多 {m['residue_opaque_max']} 个（有残留的帧 {m['residue_opaque_frames']}），半透明边里键色最多 {m['residue_fringe_max']} 个（第 {m['residue_fringe_at']} 帧）" if m['key_is_chroma'] else \
         f"底色不是键色，只数贴边一圈里像底色的：最多 {m['residue_opaque_max']} 个（归位帧自己 {m['residue_rest_baseline']['opaque']} 个，多出 {m['residue_opaque_over_rest_max']}），半透明边里最多 {m['residue_fringe_max']} 个（归位帧 {m['residue_rest_baseline']['fringe']}，多出 {m['residue_fringe_over_rest_max']}，第 {m['residue_fringe_at']} 帧）"
    L += [f"d 抠边：{kr}；"
          f"半透明边宽均值 {m['semi_width_mean_px']}px（{m['semi_width_mean_pm']}‰），95 分位最宽 {m['semi_width_p95_max_px']}px（第 {m['semi_width_p95_max_at']} 帧）",
          f"e 动作：实际发生在第 {e['active_first']}–{e['active_last']} 帧（占全段 {e['active_share_pct']}%），峰值第 {e['peak_at']} 帧（{e['peak']}% 人面积）；累计 5%→95% 在第 {e['p05_frame']}–{e['p95_frame']} 帧；"
          f"动作中途几乎没动的帧 {e['stalls']}；不动时画面自闪 {e['still_flicker']}",
          f"f 脚底：底边最大漂移 {f['bottom_max_px']}px（{f['bottom_max_pm']}‰，第 {f['bottom_max_at']} 帧），横向中心最大漂移 {f['center_max_px']}px（{f['center_max_pm']}‰，第 {f['center_max_at']} 帧）"]
    return '\n'.join(L)


def sheet(R, fr, rest, masks, path):
    """标注图：上面是全部帧（浅底一排、深底一排，画了包围盒和归位帧的脚线），标出各项读数最差的帧；下面是逐帧曲线。"""
    import matplotlib; matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    for fn in ('PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'Noto Sans CJK SC', 'Arial Unicode MS'):
        if any(f.name == fn for f in font_manager.fontManager.ttflist): plt.rcParams['font.sans-serif'] = [fn]; break
    plt.rcParams['axes.unicode_minus'] = False
    n, (W, H) = R['frames'], R['size']; x = list(range(n))
    flags = {}                                             # 帧号 → 该帧是哪些读数的最差帧
    def flag(i, s):
        if i is not None: flags.setdefault(int(i), []).append(s)
    flag(R['cut']['min_margin_at']['frame'], '留白最小'); flag(R['motion']['peak_at'], '动得最快')
    for i in R['motion']['stalls']: flag(i, '停顿')
    flag(R['feet']['bottom_max_at'] if R['feet']['bottom_max_px'] else None, '脚底最偏'); flag(R['feet']['center_max_at'] if R['feet']['center_max_px'] else None, '脚横移最大')
    if R['matte']['residue_opaque_max']: flag(int(np.argmax(R['matte']['residue_opaque'])), '键色残留')
    for rn, v in R['identity'].items():
        if 'error' not in v: flag(v['worst_area']['frame'], f'{rn}面积'); flag(v['worst_color']['frame'], f'{rn}颜色')
    cols = min(n + 1, 13); rows = int(np.ceil((n + 1) / cols)); th = 150; tw = int(round(th * W / H))
    strip = np.full((rows * 2 * th, cols * tw, 3), 255, np.uint8)
    for i, f in enumerate(fr):
        b = R['cut']['bbox'][i]; a = f[..., 3:] / 255.0
        for k, bg in enumerate(((243, 248, 251), (28, 30, 38))):
            im = (f[..., :3] * a + np.array(bg) * (1 - a)).astype(np.uint8).copy(); lw = max(2, W // 250)
            if b: cv2.rectangle(im, (b[0], b[1]), (b[2] - 1, b[3] - 1), (230, 60, 60), lw)
            cv2.line(im, (0, R['feet']['rest_bottom_y']), (W, R['feet']['rest_bottom_y']), (40, 160, 80), lw)
            r, c = divmod(i, cols); strip[(r * 2 + k) * th:(r * 2 + k + 1) * th, c * tw:(c + 1) * tw] = cv2.resize(im, (tw, th), interpolation=cv2.INTER_AREA)
    if masks:                                              # 最后一格：归位帧上各块分在哪（颜色同曲线）
        ov = (rest[..., :3] * (rest[..., 3:] / 255.0) + 243 * (1 - rest[..., 3:] / 255.0)).astype(np.uint8); ov = (ov * 0.45 + 255 * 0.55).astype(np.uint8)
        pal = plt.rcParams['axes.prop_cycle'].by_key()['color']
        for k, (rn, mk) in enumerate(masks.items()): ov[mk] = [int(pal[k % len(pal)][i:i + 2], 16) for i in (1, 3, 5)]
        r, c = divmod(n, cols); strip[r * 2 * th:(r * 2 + 2) * th, c * tw:(c + 1) * tw] = cv2.resize(ov, (tw, 2 * th), interpolation=cv2.INTER_AREA) if tw * 2 * th else 0
    fw = 20; sh = fw * 0.945 * strip.shape[0] / strip.shape[1]
    fig = plt.figure(figsize=(fw, sh + 14.5), dpi=90)
    gs = fig.add_gridspec(4, 3, height_ratios=[sh / 3.6, 1, 1, 1], hspace=0.3, wspace=0.18, left=0.04, right=0.985, top=1 - 0.5 / (sh + 14.5), bottom=0.4 / (sh + 14.5))
    ax = fig.add_subplot(gs[0, :]); ax.imshow(strip); ax.axis('off')
    for i in range(n):
        r, c = divmod(i, cols); hot = i in flags
        ax.text(c * tw + 4, r * 2 * th + 4, str(i), va='top', fontsize=10, color='#c0392b' if hot else '#14274A', fontweight='bold' if hot else 'normal')
        if hot: ax.text(c * tw + tw / 2, (r * 2 + 2) * th - 4, '\n'.join(flags[i]), va='bottom', ha='center', fontsize=7.5, color='#ffd166', linespacing=1.1)
    if masks: ax.text((n % cols) * tw + tw / 2, (n // cols) * 2 * th + 6, '归位帧分块', va='top', ha='center', fontsize=9, color='#14274A')
    ax.set_title(f"{R['name']} · {n} 帧 · {W}×{H} · 人高 {R['char_h']}px      红框 = 人物包围盒，绿线 = 归位帧的脚底；红色帧号 = 某项读数的最差帧（黄字写着哪项）。只出读数，没有判过不过",
                 fontsize=12, loc='left')
    c, s, e = R['cut'], R['seam'], R['motion']
    def panel(pos, title, ylabel=None):
        a = fig.add_subplot(pos); a.set_title(title, fontsize=11, loc='left'); a.grid(alpha=0.25); a.set_xlim(-0.5, n - 0.5); a.set_xticks(x[::max(1, n // 25)])
        if ylabel: a.set_ylabel(ylabel)
        return a
    a = panel(gs[1, 0], f"a 切人：包围盒到四边的距离（px）——最小 {c['min_margin_px']}px，第 {c['min_margin_at']['frame']} 帧{c['min_margin_at']['side']}边；贴边可见像素最多 {c['edge_visible_pixels_max']}")
    Mg = np.array(c['margins_px'])
    for k, nm in enumerate(['左', '上', '右', '下']): a.plot(x, Mg[:, k], marker='.', label=nm)
    a.set_ylim(0, None); a.legend(ncol=4, fontsize=9)
    a = panel(gs[1, 1], f"e 动作：与前一帧比——动作在第 {e['active_first']}–{e['active_last']} 帧（{e['active_share_pct']}%），峰值第 {e['peak_at']} 帧")
    a.bar(x, e['moved_pct'], color=['#e07a5f' if i in e['active_frames'] else '#9aa5b1' for i in x], label='变动面积 %（左轴）')
    a.bar([1, n - 1], [e['moved_pct'][1], e['moved_pct'][-1]], color='none', edgecolor='#14274A', hatch='//', label='首尾接缝那两步（不计入动作）')
    a2 = a.twinx(); a2.plot(x[1:], e['flicker'][1:], color='#3d5a80', lw=1, marker='.', label='整帧平均色差（右轴）'); a2.set_ylim(0, None)
    h1, l1 = a.get_legend_handles_labels(); h2, l2 = a2.get_legend_handles_labels(); a.legend(h1 + h2, l1 + l2, fontsize=8, loc='upper right')
    a = panel(gs[1, 2], f"b 接缝：逐帧清晰度；0→1 色差 {s['jump_0_1']['color']}（对照 {s['jump_1_2']['color']}），末两帧 {s['jump_end']['color']}（对照 {s['jump_before_end']['color']}）")
    a.plot(x, R['sharpness'], marker='.', color='#3d5a80'); a.axhline(R['sharpness_keys']['first'], color='#2a9d8f', ls='--', lw=1, label='首姿图'); a.axhline(R['sharpness_keys']['last'], color='#e76f51', ls=':', lw=1.3, label='尾姿图'); a.set_ylim(0, None); a.legend(fontsize=9)
    ids = {k: v for k, v in R['identity'].items() if 'error' not in v}
    for j, (key, title) in enumerate((('area_ratio', 'c 身份：各块面积 ÷ 归位帧面积'), ('color_dE', 'c 身份：各块平均色与归位帧的 Lab 距离（ΔE）'), ('pos_dist_pm', 'c 身份：各块中心位移（‰ 人高）'))):
        a = panel(gs[2, j], title if ids else title + '（没给 --regions）')
        for rn, v in ids.items(): a.plot(x, [np.nan if q is None else q for q in v[key]], marker='.', label=rn)
        if key == 'area_ratio': a.axhline(1, color='#555', lw=0.8)
        if ids: a.legend(ncol=3, fontsize=8.5)
    m, f = R['matte'], R['feet']
    a = panel(gs[3, 0], f"d 抠边：键色残留（不透明处最多 {m['residue_opaque_max']}，半透明边里最多 {m['residue_fringe_max']}）")
    a.bar(np.array(x) - 0.2, m['residue_opaque'], 0.4, label='不透明处', color='#c0392b'); a.bar(np.array(x) + 0.2, m['residue_fringe'], 0.4, label='半透明边里', color='#e9a8c9'); a.legend(fontsize=9)
    a = panel(gs[3, 1], f"d 抠边：半透明边宽（px）——均值 {m['semi_width_mean_px']}，95 分位最宽 {m['semi_width_p95_max_px']}（第 {m['semi_width_p95_max_at']} 帧）")
    a.plot(x, m['semi_width_px'], marker='.', label='均值'); a.plot(x, m['semi_width_p95_px'], marker='.', label='95 分位'); a.set_ylim(0, None); a.legend(fontsize=9)
    a = panel(gs[3, 2], f"f 脚底漂移（px）：底边最大 {f['bottom_max_px']}（第 {f['bottom_max_at']} 帧），横向中心最大 {f['center_max_px']}（第 {f['center_max_at']} 帧）")
    a.plot(x, f['bottom_dy_px'], marker='.', label='底边 dy（正 = 往下）'); a.plot(x, f['center_dx_px'], marker='.', label='横向中心 dx'); a.axhline(0, color='#555', lw=0.8); a.legend(fontsize=9)
    fig.savefig(path); plt.close(fig)


if __name__ == '__main__':
    main()
