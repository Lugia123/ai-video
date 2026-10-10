#!/usr/bin/env python3
"""贴上去的五官相对「头上固定点」的逐帧抖动（#1262 的读数）。

    python3 puppet/clips/track_rel_jitter.py <库目录> <片段名>… [--clips-json 另一份 clips.json（比如修前的备份）]

头上固定点 = 帽子 / 发卡上的 3 个角点（发卡中心、帽檐上两个角点），在每一帧里用模板匹配（亚像素）找到真实位置；
贴上去的眼角 = 左眼外眼角、右眼外眼角、嘴角的参照点按这一帧 headTrack 变换搬过来的位置。
对每个（固定点, 五官点）对，取两者位置差的逐帧曲线，报：高频残差 RMS（减去 Savitzky–Golay(9,2) 平滑后的模长）、二阶差 RMS。五官相对头不晃 → 曲线平滑 → 两个数小。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import track_jitter as TJ


def hat_points(rest, pin, n=2):
    g = TJ.gray(rest); m = TJ.rigid_mask(rest); m[:120] = 0; m[340:] = 0; pts = cv2.goodFeaturesToTrack(g, 200, 0.02, 40, mask=m.astype(np.uint8) * 255, blockSize=7)
    out = []
    for p in (pts.reshape(-1, 2) if pts is not None else []):
        if np.linalg.norm(p - pin) > 60: out.append(p)
        if len(out) >= n: break
    return out


def track_point(g0, g1, p0, M, half=18, search=14):
    pp = M[:, :2] @ p0 + M[:, 2]; ix, iy = int(round(pp[0])), int(round(pp[1])); t = g0[int(round(p0[1])) - half:int(round(p0[1])) + half + 1, int(round(p0[0])) - half:int(round(p0[0])) + half + 1]
    A = M[:, :2]; t = cv2.warpAffine(t, np.hstack([A, [[half - A[0, 0] * half - A[0, 1] * half], [half - A[1, 0] * half - A[1, 1] * half]]]).astype(np.float32), (2 * half + 1, 2 * half + 1), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE); r = half + search
    if iy - r < 0 or ix - r < 0 or iy + r >= g1.shape[0] or ix + r >= g1.shape[1]: return None
    win = g1[iy - r:iy + r + 1, ix - r:ix + r + 1]; res = cv2.matchTemplate(win, t, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(res); cx, cy = loc; sx = sy = 0.0
    if mx < 0.85: return None
    if 0 < cx < res.shape[1] - 1 and 0 < cy < res.shape[0] - 1:
        a, b, c = res[cy, cx - 1], res[cy, cx], res[cy, cx + 1]; d = a - 2 * b + c; sx = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0
        a, b, c = res[cy - 1, cx], res[cy, cx], res[cy + 1, cx]; d = a - 2 * b + c; sy = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0
    return np.array([ix - r + cx + sx + half, iy - r + cy + sy + half]) + (p0 - np.round(p0)) - M[:, :2] @ (p0 - np.round(p0)) * 0


PERFEAT = False      # --perfeat：贴上去的参照点再加 headTracks[帧].feat（逐五官偏移）
def FOFF(tr, k): return np.array(tr['feat'][k], np.float64) if PERFEAT and tr.get('feat') else np.zeros(2)


def main(root, clips, cj=None):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); trs = json.load(open(cj, encoding='utf-8'))['headTracks'] if cj else lib['headTracks']
    rest = cv2.imread(os.path.join(root, lib['poses'][lib['rest']]['frame']), cv2.IMREAD_UNCHANGED); g0 = TJ.gray(rest).astype(np.float32); R = lib['headTrackRefs']; pin = np.array(R['pin']); fixed = [pin] + hat_points(rest, pin)
    allhf, alld2 = [], []
    for clip in clips:
        files = lib['clips'][clip]['frames']; series = {(i, k): [] for i in range(len(fixed)) for k in ('eyeL', 'eyeR', 'mouth')}
        for f in files:
            M = TJ.Mof(trs[f]['m']); g1 = TJ.gray(cv2.imread(os.path.join(root, f), cv2.IMREAD_UNCHANGED)).astype(np.float32); tp = [track_point(g0, g1, p, M) for p in fixed]
            for i, t in enumerate(tp):
                for k in ('eyeL', 'eyeR', 'mouth'): series[(i, k)].append((TJ.mapp(M, R[k]) + FOFF(trs[f], k) - t) if t is not None else None)
        hfs, d2s = [], []
        for key, s in series.items():
            ok = [j for j, v in enumerate(s) if v is not None]
            if len(ok) < 30: continue
            a = np.array([s[j] for j in ok]); xs = np.arange(len(s)); a = np.stack([np.interp(xs, ok, a[:, c]) for c in range(2)], 1); hfs.append(TJ.hf(a)); d2s.append(TJ.d2(a))
        print(f'{clip}: 固定点 {len(fixed)} 个 × 五官点 3 个：相对位置的高频残差 RMS 平均 {np.mean(hfs):.2f}px（最大 {np.max(hfs):.2f}），二阶差 RMS 平均 {np.mean(d2s):.2f}px'); allhf += hfs; alld2 += d2s
    print(f'合计平均：高频残差 {np.mean(allhf):.2f}px，二阶差 {np.mean(alld2):.2f}px')


if __name__ == '__main__':
    a = sys.argv[1:]; cj = None
    if '--perfeat' in a: a.remove('--perfeat'); PERFEAT = True
    if '--clips-json' in a: i = a.index('--clips-json'); cj = a[i + 1]; a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1:], cj)
