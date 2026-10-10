#!/usr/bin/env python3
"""头部跟踪的精修（#1262）：把逐帧 SIFT 求出的相似变换，换成「脸周围锚点的亚像素跟踪 + 稳健最小二乘 + SIFT 软先验」。
默认（实测 6 条空脸片段平均最好）：ring 锚点拟合 + SIFT 先验权重 0.1 + 不做时间平滑（只去孤立尖点）。
  对比（局部锚点共同误差 RMS / 抖动 / 相对帽子发卡高频，6 条平均）：原 SIFT σ0.7 = 0.98 / 0.51 / 0.93；SIFT + 自适应平滑 = 1.21 / 0.68 / 0.97（平滑反而更差：
  AI 视频里头自己有真实的小抖动，脸要跟着它一起抖才协调）；锚点拟合无先验 = 0.82 / 0.55 / 1.00；先验 0.1 = 0.57 / 0.36 / 0.88。

    python3 puppet/clips/track_refine.py puppet/characters/<角色>/<库> <片段名>…      # 只算、只比读数，不改库
    （track_head.py --refine 在重量头部跟踪时调 refine_clip；遮罩、垫层照旧按新变换重算）

为什么：逐帧 SIFT 的内点少到 19–28 的帧，变换估计带 0.7–1.0px 的抖动（特征落在会摆的发梢上、每帧各自求解、时间平滑只有 σ=0.7 帧），
  贴上去的五官相对脸周围就「轻微晃」。这里：
  1 锚点：归位帧脸周围的一圈角点（刘海下缘、脸颊轮廓、耳朵），偶数下标的 24 个拟合、奇数下标的 24 个留给 track_jitter 评估（不自己量自己）。
  2 每帧从 SIFT 变换出发，按这一帧的旋转 / 缩放把模板变形后在预测位置附近匹配（亚像素），迭代 2 次；得分 < 0.85 的锚点不要。
  3 稳健相似变换（RANSAC 起步，Procrustes 加权最小二乘，剔除 > max(1.2px, 3×MAD) 的）。锚点少于 6 个的帧沿用 SIFT 变换。
  4 时间平滑：旋转 / 对数缩放 / 鼻点位置三条曲线，先用中值去尖，再按「动作速度」在 Savitzky–Golay 长窗（9 帧 3 阶）和短窗（5 帧 2 阶）之间混合——
    动作慢的地方压抖动，动作快的地方不滞后；缩放另外用更长的窗（15 帧 2 阶）。"""
import json, os, sys
import cv2, numpy as np
from scipy.signal import savgol_filter
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import track_jitter as TJ

HALF, SEARCH, MIN_SCORE = 15, 14, 0.85
FIT = os.environ.get('TRACK_FIT', 'ring')                 # rigid：帽子 / 发卡 / 脸轮廓线；ring：脸周围一圈（含刘海）
SMOOTH = os.environ.get('TRACK_SMOOTH', 'none')          # none / light / adapt
PRIOR = float(os.environ.get('TRACK_PRIOR', '0.1'))         # 融合时 SIFT 先验点的总权重 / 锚点总权重（0 = 不融合）


def fit_sim(P, Q, w):
    """加权相似变换 Q ≈ s R P + t（复数形式）。返回 2×3。"""
    w = w / w.sum(); mp, mq = (w[:, None] * P).sum(0), (w[:, None] * Q).sum(0); z = (P - mp); u = (Q - mq)
    zc, uc = z[:, 0] + 1j * z[:, 1], u[:, 0] + 1j * u[:, 1]; a = (w * np.conj(zc) * uc).sum() / (w * np.abs(zc) ** 2).sum()
    t = (mq[0] + 1j * mq[1]) - a * (mp[0] + 1j * mp[1]); return np.array([[a.real, -a.imag, t.real], [a.imag, a.real, t.imag]], np.float64)


def one_frame(g1, M0, anc, tmpl, prior=None):
    """→ (M, 用到的锚点数, 残差 RMS)；锚点不够时 (M0, 0, nan)。迭代 2 次。"""
    M = M0.copy(); used = 0; rms = float('nan')
    for it in range(2):
        P, Q, S = [], [], []
        for (x, y), t in zip(anc, tmpl):
            px, py = TJ.mapp(M, (x, y)); ix, iy = int(round(px)), int(round(py)); r = HALF + SEARCH
            if iy - r < 0 or ix - r < 0 or iy + r >= g1.shape[0] or ix + r >= g1.shape[1]: continue
            win = g1[iy - r:iy + r + 1, ix - r:ix + r + 1]; A = M[:, :2]
            tt = cv2.warpAffine(t, np.hstack([A, [[HALF - A[0, 0] * HALF - A[0, 1] * HALF], [HALF - A[1, 0] * HALF - A[1, 1] * HALF]]]).astype(np.float32), (2 * HALF + 1, 2 * HALF + 1), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            res = cv2.matchTemplate(win, tt, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(res)
            if mx < MIN_SCORE: continue
            cx, cy = loc; sx = sy = 0.0
            if 0 < cx < res.shape[1] - 1 and 0 < cy < res.shape[0] - 1:
                a, b, c = res[cy, cx - 1], res[cy, cx], res[cy, cx + 1]; d = a - 2 * b + c; sx = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
                a, b, c = res[cy - 1, cx], res[cy, cx], res[cy + 1, cx]; d = a - 2 * b + c; sy = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0.0
            P.append((x, y)); Q.append((ix - SEARCH + cx + sx, iy - SEARCH + cy + sy)); S.append(mx)
        if len(P) < 6: return M0, 0, float('nan')
        P, Q, S = np.array(P), np.array(Q), np.array(S); w = np.maximum(S - 0.7, 0.05) ** 2; keep = np.ones(len(P), bool)
        if prior is not None and prior[1] > 0:                                    # 融合：把 SIFT 变换 M0 在头上均匀撒的点当作软约束（总权重 = 锚点总权重 × prior[1]），锚点量得到的局部运动为主、整体由 SIFT 兜底
            ps = prior[0]; Pp, Qp = ps, ps @ M0[:, :2].T + M0[:, 2]; wp = np.full(len(ps), w.sum() * prior[1] / len(ps)); P = np.vstack([P, Pp]); Q = np.vstack([Q, Qp]); w = np.concatenate([w, wp]); keep = np.ones(len(P), bool)
        for _ in range(4):
            if keep.sum() < 6: return M0, 0, float('nan')
            M1 = fit_sim(P[keep], Q[keep], w[keep]); r = np.linalg.norm(P @ M1[:, :2].T + M1[:, 2] - Q, axis=1)
            mad = np.median(np.abs(r[keep] - np.median(r[keep]))) * 1.4826; thr = max(1.2, 3 * mad); nk = r < thr
            if (nk == keep).all(): break
            keep = nk
        M = M1; used = int(keep.sum()); rms = float(np.sqrt((r[keep] ** 2).mean()))
    return M, used, rms


def smooth_series(full):
    """full: n×4 = [scale, rot_deg, cx, cy]。旋转 / 缩放 / 鼻点位置分别平滑。"""
    n = len(full); out = full.copy()
    def sg(x, w, p):
        w = min(w, n if n % 2 else n - 1); return savgol_filter(x, w, min(p, w - 1), mode='interp') if w >= 5 else x
    def despike(x):                              # 中值去尖：和中值滤波差得很多的孤立点换成中值（只动孤立点，不动真实的快速头动）
        med = ndi.median_filter(x, 3, mode='nearest'); d = x - med; mad = np.median(np.abs(d)) * 1.4826 + 1e-9; y = x.copy(); y[np.abs(d) > 4 * mad + 0.3] = med[np.abs(d) > 4 * mad + 0.3]; return y
    for k in (1, 2, 3):
        x = despike(full[:, k]); long_, short_ = sg(x, 9, 3), sg(x, 5, 2)
        speed = np.abs(np.gradient(sg(x, 5, 2)))                                           # 每帧变多少（rot 用度，位置用 px）
        thr = 0.6 if k == 1 else 4.0                                                      # 旋转 0.6°/帧、位置 4px/帧 以上算「快」，完全用短窗
        al = np.clip(speed / thr, 0, 1); out[:, k] = (1 - al) * long_ + al * short_
    ls = np.log(full[:, 0]); out[:, 0] = np.exp(sg(despike(ls), 15, 2))
    return out


def light_series(full):
    """只去孤立尖点（中值去尖），不做平滑：保留头自己的真实小抖动（脸要和头一起抖）。"""
    out = full.copy()
    for k in range(4):
        x = full[:, k]; med = ndi.median_filter(x, 3, mode='nearest'); d = x - med; mad = np.median(np.abs(d)) * 1.4826 + 1e-9; m = np.abs(d) > 5 * mad + 0.4; y = x.copy(); y[m] = med[m]; out[:, k] = y
    return out


def refine_clip(rest, frames, full0, c0, prior_w=None):
    """rest：归位帧 RGBA（float32 或 uint8 都行）；frames：这段片段的 RGBA 帧；full0：n×4 = SIFT 的 [scale, rot_deg, cx, cy]（已插值补洞）；c0：鼻点在归位帧的位置。
    → (full n×4, 每帧用到的锚点数, 每帧拟合残差)。"""
    if FIT == 'sift':                                                                      # 不再量锚点，只对 SIFT 的变换做稳健的时间平滑
        return smooth_series(full0), [0] * len(frames), [float('nan')] * len(frames)
    rest8 = np.clip(rest, 0, 255).astype(np.uint8); g0 = TJ.gray(rest8)
    ring = TJ.rigid_mask(rest8).astype(np.uint8) * 255 if FIT == 'rigid' else None
    if ring is None: ring = np.zeros(g0.shape, np.uint8); ring[300:560, 250:580] = 255; ring[395:540, 285:540] = 0
    else: ring[:120] = 0
    ring[rest8[..., 3] < 200] = 0
    pts = cv2.goodFeaturesToTrack(g0, 600, 0.01, 14, mask=ring, blockSize=7); anc = []
    for p in (pts.reshape(-1, 2) if pts is not None else []):
        x, y = int(round(p[0])), int(round(p[1]))
        if HALF + 6 < x < g0.shape[1] - HALF - 6 and HALF + 6 < y < g0.shape[0] - HALF - 6: anc.append((float(p[0]), float(p[1])))
        if len(anc) >= 48: break
    anc = anc[0::2]                                                                         # 偶数下标拟合；奇数下标留给 track_jitter 评估
    tmpl = [g0[int(round(y)) - HALF:int(round(y)) + HALF + 1, int(round(x)) - HALF:int(round(x)) + HALF + 1].astype(np.float32) for x, y in anc]
    n = len(frames); full = np.zeros((n, 4)); used = []; rmss = []
    ys_, xs_ = np.mgrid[300:560:30, 270:560:30]; head_pts = np.stack([xs_.ravel(), ys_.ravel()], 1).astype(np.float64)       # 先验点：脸范围里的格点
    for i, fr in enumerate(frames):
        M0 = TJ.Mof_sc(full0[i], c0); M, u, r = one_frame(TJ.gray(fr).astype(np.float32), M0, anc, tmpl, (head_pts, PRIOR) if PRIOR > 0 else None); used.append(u); rmss.append(r)
        s = float(np.hypot(M[0, 0], M[1, 0])); rot = float(np.degrees(np.arctan2(M[1, 0], M[0, 0]))); c = M[:, :2] @ np.asarray(c0, np.float64) + M[:, 2]; full[i] = [s, rot, c[0], c[1]] if u >= 6 else [np.nan] * 4
    ok = ~np.isnan(full[:, 0])                                                              # 锚点不够的帧（手挡住、跑出搜索范围）不沿用 SIFT 的值（会和别的帧的估计法不一致、冒尖），从前后帧插值
    if ok.sum() >= 6:
        idx = np.where(ok)[0]; full = np.stack([np.interp(np.arange(n), idx, full[idx, k]) for k in range(4)], 1)
    else: full = full0.copy()
    return (smooth_series(full) if SMOOTH == 'adapt' else light_series(full) if SMOOTH == 'light' else full), used, rmss


def main(root, clips):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); g0, _, anc_eval = TJ.anchors(root, lib, mode=TJ.MODE); tr = lib['headTracks']
    rest = cv2.imread(os.path.join(root, lib['poses'][lib['rest']]['frame']), cv2.IMREAD_UNCHANGED); refs = lib['headTrackRefs']; c0 = np.array(refs['nose'])
    for clip in clips:
        files = lib['clips'][clip]['frames']; frames = [cv2.imread(os.path.join(root, f), cv2.IMREAD_UNCHANGED) for f in files]
        full0 = []
        for f in files:
            a, b, tx, ty = tr[f]['m']; M = TJ.Mof((a, b, tx, ty)); c = M[:, :2] @ c0 + M[:, 2]; full0.append([np.hypot(a, b), np.degrees(np.arctan2(b, a)), c[0], c[1]])
        full0 = np.array(full0); full, used, rms = refine_clip(rest.astype(np.float32), frames, full0, c0)
        Ms = [TJ.Mof_sc(full[i], c0) for i in range(len(files))]; M0s = [TJ.Mof_sc(full0[i], c0) for i in range(len(files))]
        dev = np.array([[np.linalg.norm(TJ.mapp(a, refs[k]) - TJ.mapp(b, refs[k])) for k in ('eyeL', 'eyeR', 'mouth')] for a, b in zip(Ms, M0s)])      # 修后相对 SIFT 原值，在眼 / 嘴位置上挪了多少
        print(f'  {clip} 相对 SIFT 原值的位移（眼 / 嘴位置）：平均 {dev.mean():.2f} 最大 {dev.max():.2f}@{int(dev.max(1).argmax())} px')
        rows = TJ.measure(root, lib, clip, g0, anc_eval, Ms=Ms); r = TJ.summarize(root, lib, clip, g0, anc_eval, rows, Ms=Ms); c = r['common']
        print(f"{clip}: 修后 轨迹 eyeL 高频{r['eyeL']['hf']:.2f} 二阶{r['eyeL']['d2']:.2f} | eyeR 高频{r['eyeR']['hf']:.2f} | mouth 高频{r['mouth']['hf']:.2f} 二阶{r['mouth']['d2']:.2f} | nose 高频{r['nose']['hf']:.2f}px"
              f" || 评估锚点：共同误差 RMS {c['rms']:.2f} 最大 {c['max']:.2f} 抖动(高频) {c['hf']:.2f} px，散布 {r['scatter']:.2f}px；拟合用锚点均 {np.mean(used):.1f}，最少 {min(used)}，拟合残差均 {np.nanmean(rms):.2f}px")


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    main(a[0].rstrip('/'), a[1:])
