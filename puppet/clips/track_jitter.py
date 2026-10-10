#!/usr/bin/env python3
"""头部跟踪的抖动读数（#1262）：先量，再修，修完拿同一组读数对比。

    python3 puppet/clips/track_jitter.py puppet/characters/<角色>/<空脸库> <片段名>… [--json 输出.json]

量两样：
A 轨迹本身：headTracks 里每帧的相似变换，在眼角 / 嘴角 / 鼻点这几个贴片参照位置上的位置序列 p(t)。
   · 高频残差 = p(t) 减去 Savitzky–Golay(窗口 9、2 阶) 平滑后的曲线，逐帧模长的 RMS（px）——「去掉低频后还剩多少」；
   · 二阶差 RMS = p(t) 的二阶差分模长 RMS（px/帧²）——真实动作的拐弯也会进来，只能和修后同一片段比，不能当绝对噪声。
B 贴上去的脸相对「脸周围看得见的东西」：在归位帧脸周围（刘海下缘、脸颊轮廓、耳朵、鼻点）挑一圈有角点的锚点，
   每帧在这一帧里用模板匹配（亚像素）找到它们真正的位置，和变换预测的位置比：
   · 逐锚点误差序列 e_k(t) = 实测 − 预测；每帧取各锚点误差的中位数 = 共同误差（变换整体偏了多少），
   · 其高频残差 = 共同误差的逐帧抖动（五官相对脸周围「抖」的就是它）；锚点误差的 RMS = 整体对不准的程度。
   手 / 袖子挡住的锚点（匹配分数低、或被判成遮挡）不算。锚点个数、可用帧数一并报。"""
import json, os, sys
import cv2, numpy as np
from scipy.signal import savgol_filter


MODE = os.environ.get('JITTER_ANCHORS', 'rigid')


def flat(im): a = im[..., 3:].astype(np.float32) / 255; return (im[..., :3] * a + 255 * (1 - a)).astype(np.uint8)
def gray(im): return cv2.cvtColor(flat(im), cv2.COLOR_BGR2GRAY)
def Mof(m): a, b, tx, ty = m; return np.array([[a, -b, tx], [b, a, ty]], np.float64)
def Mof_sc(full, c0):
    """[scale, rot_deg, cx, cy]（cx, cy = 鼻点 c0 搬到这一帧的位置）→ 2×3。同 track_head.compose。"""
    sc, rot, cx, cy = full; r = np.radians(rot); a, b = sc * np.cos(r), sc * np.sin(r); return np.array([[a, -b, cx - a * c0[0] + b * c0[1]], [b, a, cy - b * c0[0] - a * c0[1]]], np.float64)
def mapp(M, p): return M[:, :2] @ np.asarray(p, np.float64) + M[:, 2]
def hf(series, w=9):
    series = np.asarray(series, np.float64)
    if len(series) < w: return float('nan')
    s = np.stack([savgol_filter(series[:, k], w, 2, mode='interp') for k in range(series.shape[1])], 1); return float(np.sqrt(((series - s) ** 2).sum(1).mean()))
def d2(series): d = np.diff(np.asarray(series, np.float64), 2, axis=0); return float(np.sqrt((d ** 2).sum(1).mean()))


def rigid_mask(rest):
    """归位帧上「刚性的头」：帽子（藏青）、发卡（黄）、脸的轮廓线（深红褐）。头发（会摆）不算。"""
    b, g, r, a = [rest[..., i].astype(int) for i in range(4)]; hsv = cv2.cvtColor(flat(rest), cv2.COLOR_BGR2HSV); yy = np.arange(rest.shape[0])[:, None]
    hat = (a > 200) & (np.maximum(np.maximum(r, g), b) < 120) & (b >= r) & (yy < 340)
    pin = (hsv[..., 0] > 15) & (hsv[..., 0] < 32) & (hsv[..., 1] > 120) & (hsv[..., 2] > 150) & (yy < 340)
    outline = (a > 200) & (r - g > 22) & (r < 215) & (0.114 * b + 0.587 * g + 0.299 * r < 150) & (yy > 340) & (yy < 570)        # 脸颊、下巴的轮廓线（深红褐）
    return cv2.dilate((hat | pin | outline).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0


def anchors(root, lib, n=48, half=15, mode='rigid'):
    """锚点（归位帧上的角点，彼此至少隔 14px）。mode='rigid'：只在刚性的头（帽子、发卡、脸轮廓线）上挑——头发会摆，跟着它抖的五官会和「头」不协调；
    mode='ring'：脸周围一圈（含刘海下缘）。返回 (灰度归位帧, 偶数下标锚点 = 拟合用, 奇数下标锚点 = 评估用——评估的不参与拟合，读数才不是自己量自己)。"""
    rest = cv2.imread(os.path.join(root, lib['poses'][lib['rest']]['frame']), cv2.IMREAD_UNCHANGED); g = gray(rest)
    if mode == 'rigid': ring = rigid_mask(rest).astype(np.uint8) * 255; ring[:120] = 0
    else:
        ring = np.zeros(g.shape, np.uint8); ring[300:560, 250:580] = 255; ring[395:540, 285:540] = 0
    ring[rest[..., 3] < 200] = 0
    pts = cv2.goodFeaturesToTrack(g, 600, 0.01, 14, mask=ring, blockSize=7)
    out = []
    for p in (pts.reshape(-1, 2) if pts is not None else []):
        x, y = int(round(p[0])), int(round(p[1]))
        if half + 6 < x < g.shape[1] - half - 6 and half + 6 < y < g.shape[0] - half - 6: out.append((float(p[0]), float(p[1])))
        if len(out) >= n: break
    return g, out[0::2], out[1::2]


def measure(root, lib, clip, g0, anc, half=15, search=14, Ms=None):
    """每帧每个锚点：在预测位置附近模板匹配（亚像素），返回 e[frame][anchor] = (dx, dy, score) 或 None。Ms：每帧的 2×3 变换（缺省用库里 headTracks 的）。"""
    files = lib['clips'][clip]['frames']; tr = lib['headTracks']; rows = []
    tmpl = [g0[int(round(y)) - half:int(round(y)) + half + 1, int(round(x)) - half:int(round(x)) + half + 1].astype(np.float32) for x, y in anc]
    for fi, f in enumerate(files):
        fr = cv2.imread(os.path.join(root, f), cv2.IMREAD_UNCHANGED); g1 = gray(fr).astype(np.float32); M = Mof(tr[f]['m']) if Ms is None else Ms[fi]; row = []
        for (x, y), t in zip(anc, tmpl):
            px, py = mapp(M, (x, y)); ix, iy = int(round(px)), int(round(py)); r = half + search
            if iy - r < 0 or ix - r < 0 or iy + r >= g1.shape[0] or ix + r >= g1.shape[1]: row.append(None); continue
            win = g1[iy - r:iy + r + 1, ix - r:ix + r + 1]
            # 模板按这一帧的旋转 / 缩放变形后再匹配（大幅转动时才不会偏）
            A = M[:, :2]; tt = cv2.warpAffine(t, np.hstack([A, [[half - A[0, 0] * half - A[0, 1] * half], [half - A[1, 0] * half - A[1, 1] * half]]]).astype(np.float32), (2 * half + 1, 2 * half + 1), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            res = cv2.matchTemplate(win, tt, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(res)
            cx, cy = loc; sx = sy = 0.0
            if 0 < cx < res.shape[1] - 1 and 0 < cy < res.shape[0] - 1:           # 抛物线亚像素
                a, b, c = res[cy, cx - 1], res[cy, cx], res[cy, cx + 1]; d = a - 2 * b + c; sx = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
                a, b, c = res[cy - 1, cx], res[cy, cx], res[cy + 1, cx]; d = a - 2 * b + c; sy = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
            mx_, my_ = ix - search + cx + sx, iy - search + cy + sy        # 窗口里匹配到的模板中心
            row.append((float(mx_ - px), float(my_ - py), float(mx)))
        rows.append(row)
    return rows


def summarize(root, lib, clip, g0, anc, rows, min_score=0.85, Ms=None):
    refs = lib['headTrackRefs']; tr = lib['headTracks']; files = lib['clips'][clip]['frames']; res = {}
    for k in ('eyeL', 'eyeR', 'mouth', 'nose'):
        p = np.array([mapp(Mof(tr[f]['m']) if Ms is None else Ms[i], refs[k]) for i, f in enumerate(files)]); res[k] = {'hf': hf(p), 'd2': d2(p)}
    common = []; usable = []; per = []
    for row in rows:
        v = np.array([[r[0], r[1]] for r in row if r and r[2] >= min_score]); usable.append(len(v))
        if len(v) >= 5:
            med = np.median(v, axis=0); common.append(med); per.append(np.sqrt(((v - med) ** 2).sum(1)).mean())      # 共同误差 + 各锚点相对共同误差的散布
        else: common.append((np.nan, np.nan)); per.append(np.nan)
    common = np.array(common); ok = ~np.isnan(common[:, 0])
    if ok.sum() >= 12:
        idx = np.where(ok)[0]; cc = np.stack([np.interp(np.arange(len(common)), idx, common[idx, k]) for k in range(2)], 1)
        res['common'] = {'rms': float(np.sqrt((cc[ok] ** 2).sum(1).mean())), 'max': float(np.sqrt((cc[ok] ** 2).sum(1)).max()), 'hf': hf(cc), 'd2': d2(cc), 'frames_ok': int(ok.sum())}
    res['scatter'] = float(np.nanmean(per)) if np.any(~np.isnan(per)) else float('nan'); res['anchors_usable_mean'] = float(np.mean(usable))
    return res


def main(root, clips, jpath=None):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); g0, _, anc = anchors(root, lib, mode=MODE); out = {}
    print(f'评估用锚点 {len(anc)} 个（归位帧脸周围的角点，奇数下标；偶数下标留给 track_refine 拟合）')
    for clip in clips:
        rows = measure(root, lib, clip, g0, anc); r = summarize(root, lib, clip, g0, anc, rows); out[clip] = r
        c = r.get('common', {})
        print(f"{clip}: 轨迹 eyeL 高频{r['eyeL']['hf']:.2f} 二阶{r['eyeL']['d2']:.2f} | eyeR 高频{r['eyeR']['hf']:.2f} | mouth 高频{r['mouth']['hf']:.2f} 二阶{r['mouth']['d2']:.2f} | nose 高频{r['nose']['hf']:.2f}px"
              f" || 脸周围锚点：共同误差 RMS {c.get('rms', float('nan')):.2f} 最大 {c.get('max', float('nan')):.2f} 抖动(高频) {c.get('hf', float('nan')):.2f} px，锚点散布 {r['scatter']:.2f}px，每帧可用锚点均 {r['anchors_usable_mean']:.1f}")
    if jpath: json.dump(out, open(jpath, 'w'), ensure_ascii=False, indent=1)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]; j = None
    if '--json' in a: i = a.index('--json'); j = a[i + 1]; a = a[:i] + a[i + 2:]
    if len(a) < 2: sys.exit(__doc__)
    main(a[0].rstrip('/'), a[1:], j)
