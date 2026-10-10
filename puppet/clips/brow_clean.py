#!/usr/bin/env python3
"""离线做一张「无眉的归位帧」：只做一次，给擦原眉贴片当来源（贴片逐帧按头部跟踪贴，不再逐帧在片段帧上擦）。

    python3 puppet/clips/brow_clean.py puppet/characters/<角色>/<片段库> [--out 对照图.png]

1. 眉的范围：素材里的眉层（browL / browR）按贴片对位搬到归位帧，在 ±10px 里找它的实际位置，沿弧线向两端延长（同 brow_erase.py 的找法），外扩 2px。
2. 填充（方向感知）：被擦掉的每个像素，沿 13 个方向（竖直 ±60°）各放两条射线，取两头第一个没被擦的像素 a、b；
   选「a、b 颜色最接近、而且两头都落在线条 / 边界上」的方向，按距离在 a、b 之间插值。
   这样穿过眉的发束轮廓线、发束和皮肤的交界沿着它们自己的走向接上（逐列上下插值会把斜着的线接糊，Telea 会糊成一团）。
产物：<库>/frames/<归位帧名>_nobrow.png（整张，和归位帧同尺寸，只有眉那一条不同）+ clips.json 的 poses.<归位>.noBrow。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from track_head import Tracker, rgba, flat
from brow_erase import erase


def clean(bgr, mask):
    H, W = mask.shape; src = bgr.astype(np.float32); out = src.copy()
    med = cv2.medianBlur(bgr, 7).astype(np.float32); struct = np.abs(src - med).max(2)            # 这一点是不是线条 / 边界（和周围 7px 中值差多少）
    angs = np.radians(np.arange(-60, 61, 10)); dirs = [(np.sin(a), -np.cos(a)) for a in angs]      # 以竖直向上为 0°
    ys, xs = np.where(mask)
    def first(y, x, dx, dy):
        for k in range(1, 40):
            xx, yy = int(round(x + dx * k * 0.5)), int(round(y + dy * k * 0.5))
            if xx < 0 or yy < 0 or xx >= W or yy >= H: return None
            if not mask[yy, xx]: return yy, xx, k * 0.5
        return None
    # 方向不逐像素各选各的（那样交叉处会出一片杂点）：先算每个像素每个方向的分数，把分数图在擦掉的范围里平滑一下（邻近像素倾向选同一个方向），再选。
    N = len(ys); cost = np.full((N, len(dirs)), 1e6, np.float32); vals = np.zeros((N, len(dirs), 3), np.float32)
    for n, (y, x) in enumerate(zip(ys, xs)):
        for j, ((dx, dy), a) in enumerate(zip(dirs, angs)):
            p, q = first(y, x, dx, dy), first(y, x, -dx, -dy)
            if p is None or q is None: continue
            ca, cb = src[p[0], p[1]], src[q[0], q[1]]; diff = float(np.abs(ca - cb).max()); t = p[2] / (p[2] + q[2])
            cost[n, j] = diff - 0.6 * min(struct[p[0], p[1]], struct[q[0], q[1]]) + 0.35 * (p[2] + q[2]) + 2.0 * abs(a); vals[n, j] = ca * (1 - t) + cb * t
    cmap = np.full((H, W, len(dirs)), 0, np.float32); cmap[ys, xs] = np.minimum(cost, 300); wsum = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.6)
    sm = cv2.GaussianBlur(cmap, (0, 0), 1.6) / np.maximum(wsum[..., None], 1e-6); pick = np.argmin(sm[ys, xs] + 0.4 * np.minimum(cost, 300), axis=1)
    out[ys, xs] = vals[np.arange(N), pick]
    med3 = cv2.medianBlur(np.clip(out, 0, 255).astype(np.uint8), 3).astype(np.float32); out[ys, xs] = med3[ys, xs]      # 剩下的单点杂色
    return out
    for y, x in zip(ys, xs):
        best = None
        for (dx, dy), a in zip(dirs, angs):
            p, q = first(y, x, dx, dy), first(y, x, -dx, -dy)
            if p is None or q is None: continue
            ca, cb = src[p[0], p[1]], src[q[0], q[1]]; diff = float(np.abs(ca - cb).max())
            score = diff - 0.6 * min(struct[p[0], p[1]], struct[q[0], q[1]]) + 0.35 * (p[2] + q[2]) + 2.0 * abs(a)       # 颜色接近、两头都是线、路径短、尽量竖直
            if best is None or score < best[0]: t = p[2] / (p[2] + q[2]); best = (score, ca * (1 - t) + cb * t)
        if best is not None: out[y, x] = best[1]
    return out


def touchup(img, ops, ref):
    """手工修补：fill（多边形填取样色）/ line（折线，取样色，可收尖）。4 倍超采样画再缩回，边是抗锯齿的。颜色从 ref（有眉的原图）取样。"""
    SS = 4; H, W = img.shape[:2]; out = img.astype(np.float32)
    for o in ops:
        if o['op'] != 'heal': col = np.array(o['color'], np.float32) if 'color' in o else np.median(ref[int(o['from'][1]) - 1:int(o['from'][1]) + 2, int(o['from'][0]) - 1:int(o['from'][0]) + 2].reshape(-1, 3).astype(np.float32), axis=0)
        m = np.zeros((H * SS, W * SS), np.uint8)
        if o['op'] == 'heal':                  # 多边形里就地修补（Telea，小块平涂处用）：抹掉不该有的短线、色斑
            hm = np.zeros((H, W), np.uint8); cv2.fillPoly(hm, [np.array(o['poly'], np.float32).round().astype(np.int32)], 255)
            out = cv2.inpaint(np.clip(out, 0, 255).astype(np.uint8), hm, 4, cv2.INPAINT_TELEA).astype(np.float32); continue
        if o['op'] == 'fill': cv2.fillPoly(m, [(np.array(o['poly'], np.float32) * SS).astype(np.int32)], 255, cv2.LINE_AA)
        else:
            pts = np.array(o['pts'], np.float32) * SS; seg = np.linalg.norm(np.diff(pts, axis=0), axis=1); total = seg.sum(); n = max(2, int(total)); te = o.get('taper_end', 1.0); ts = o.get('taper_start', 1.0)
            for i in range(n + 1):
                t = i / n; d = t * total; k = 0
                while k < len(seg) - 1 and d > seg[k]: d -= seg[k]; k += 1
                p = pts[k] + (pts[k + 1] - pts[k]) * (d / seg[k]); r = o['width'] * SS / 2 * (ts + (te - ts) * t)
                cv2.circle(m, (int(round(p[0])), int(round(p[1]))), max(1, int(round(r))), 255, -1, cv2.LINE_AA)
        a = (cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255)[..., None]; out = out * (1 - a) + col * a
    return out.round().astype(np.uint8)


def main():
    a = sys.argv[1:]; root = a[0].rstrip('/'); T = Tracker(root); lib = T.lib; rest_name = lib['rest']; rel = lib['poses'][rest_name]['frame']
    rest = T.rest; b = flat(rest); _inp, ba, sh = erase(b, T.brow_sides, rest[..., 3] > 128)
    mask = ba > 0.35; filled = clean(b, mask)
    soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 0.6)[..., None]; res = (filled * soft + b.astype(np.float32) * (1 - soft)).round().astype(np.uint8)
    tu = T.P('nobrow_touchup.json')
    if os.path.exists(tu): ops = json.load(open(tu, encoding='utf-8'))['ops']; res = touchup(res, ops, b); print('手工修补', len(ops), '处')
    out_rel = os.path.splitext(rel)[0] + '_nobrow.png'; cv2.imwrite(T.P(out_rel), np.dstack([res, rest[..., 3].astype(np.uint8)]))
    l2 = json.load(open(T.P('clips.json'), encoding='utf-8')); ys, xs = np.where(mask)
    l2['poses'][rest_name]['noBrow'] = {'frame': out_rel, 'brow_bbox': [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)], 'found_shift': sh}
    json.dump(l2, open(T.P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('无眉归位帧：', T.P(out_rel), '擦掉', int(mask.sum()), 'px，眉的位移', sh)
    if '--out' in a:
        x0, y0, x1, y1 = xs.min() - 22, ys.min() - 30, xs.max() + 23, ys.max() + 26; k = 6
        ov = b.copy(); ov[mask] = (255, 0, 255)
        t = [cv2.resize(im[y0:y1, x0:x1], None, fx=k, fy=k, interpolation=cv2.INTER_NEAREST) for im in (b, res, ov)]
        cv2.imwrite(a[a.index('--out') + 1], np.vstack([t[0], np.full((8, t[0].shape[1], 3), 255, np.uint8), t[1], np.full((8, t[0].shape[1], 3), 255, np.uint8), t[2]])); print('对照图（上：有眉；中：无眉；下：擦掉的范围）：', a[a.index('--out') + 1])


if __name__ == '__main__':
    main()
