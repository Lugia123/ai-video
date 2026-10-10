#!/usr/bin/env python3
"""从一条有五官的片段做控制视频（给 Wan Fun Control 一类「照这条的运动生空脸」用）。纯 CPU 图像处理，不跑任何模型。

    python3 puppet/pipeline/clips/control_video.py <片段.mp4|帧目录> --ref-face <有五官归位帧品红底.png> --ref-blank <空脸归位帧品红底.png>
        [--out puppet/out/control] [--name 名] [--style ink|canny] [--polarity blackonwhite|whiteonblack]

输入：832×1104、品红底（min(R,B)−G 大）的帧。输出（同分辨率、同帧数、同帧率）：
  <name>-line-noface.mp4   a) 线稿，擦掉眼、眉、嘴的线（逐帧跟踪定位，范围略放大；鼻点保留）
  <name>-line-face.mp4     b) 线稿，不擦（对照）
  <name>-sil.mp4           c) 剪影（人物纯白、背景纯黑）
  <name>-compare.png       6 帧并排：原帧 | 线稿(擦) 
  <name>-report.json       逐帧读数
--style ink：按原图的深色描边提取（黑帽 + 剪影边，保线宽）；canny：Canny 细线。
五官擦除区 = 有五官归位帧与空脸归位帧的差异像素（眼、眉、嘴及其发丝瑕疵）；逐帧用头部 SIFT+RANSAC 相似变换搬过来，
再对眼、嘴各自做小范围模板匹配（±12px）校位。匹配分太低（被手挡等）= 该特征「跟踪失败」，退回只用相似变换。"""
import argparse, json, os, subprocess
import cv2, numpy as np

W, H, FPS = 832, 1104, 16
FEAT = {'eyeL': (293, 385, 390, 480), 'eyeR': (440, 385, 541, 480), 'mouth': (385, 470, 440, 500)}  # 模板匹配窗口（归位帧坐标）
NOSE = (410, 462)


def load_frames(src):
    if os.path.isdir(src):
        fs = sorted(f for f in os.listdir(src) if f.lower().endswith(('.png', '.jpg')))
        return np.stack([cv2.imread(os.path.join(src, f)) for f in fs])
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, H, W, 3)


def fg_mask(bgr):
    b, g, r = [bgr[..., i].astype(np.int16) for i in range(3)]
    bg = (np.minimum(r, b) - g) > 110
    bg = cv2.morphologyEx(bg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    fg = (1 - bg).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
    keep = np.zeros_like(fg)
    for i in range(1, n):
        if st[i, 4] > 2000: keep[lab == i] = 1
    return keep.astype(bool)


def lines(bgr, fg, style):
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    if style == 'canny':
        L = cv2.Canny(cv2.GaussianBlur(gray, (3, 3), 0), 40, 110) > 0
    else:
        bh = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        L = bh > 14
    inner = cv2.erode(fg.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    edge = fg & ~inner if style == 'ink' else (cv2.Canny(fg.astype(np.uint8) * 255, 50, 150) > 0)
    return (L & fg) | edge


def head_sim(ref_gray, frames_gray, mask):
    sift = cv2.SIFT_create(); bf = cv2.BFMatcher(); kb, db = sift.detectAndCompute(ref_gray, mask); out = []
    for g in frames_gray:
        kf, df = sift.detectAndCompute(g, mask); ms = [m for m, n in bf.knnMatch(db, df, k=2) if m.distance < .75 * n.distance] if df is not None and len(df) > 2 else []
        if len(ms) < 6: out.append(None); continue
        M, _ = cv2.estimateAffinePartial2D(np.float32([kb[m.queryIdx].pt for m in ms]), np.float32([kf[m.trainIdx].pt for m in ms]), method=cv2.RANSAC, ransacReprojThreshold=2.0)
        out.append(M)
    return out


def warp_mask(m, M): return cv2.warpAffine(m.astype(np.uint8), M, (W, H), flags=cv2.INTER_NEAREST) > 0


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--ref-face', required=True); ap.add_argument('--ref-blank', required=True)
    ap.add_argument('--out', default='puppet/out/control'); ap.add_argument('--name'); ap.add_argument('--style', default='ink', choices=['ink', 'canny'])
    ap.add_argument('--polarity', default='blackonwhite', choices=['blackonwhite', 'whiteonblack']); ap.add_argument('--grow', type=int, default=4)
    ap.add_argument('--min-ncc', type=float, default=.55); ap.add_argument('--shift', type=int, default=12)
    a = ap.parse_args(); name = a.name or os.path.splitext(os.path.basename(a.src.rstrip('/')))[0]; os.makedirs(a.out, exist_ok=True)
    F = load_frames(a.src); N = len(F); R = cv2.imread(a.ref_face); B0 = cv2.imread(a.ref_blank)
    # 擦除区（归位帧坐标）：有五官 vs 空脸的差异，再略放大；保留鼻点
    diff = np.abs(R.astype(int) - B0).sum(2) > 30
    er0 = cv2.dilate(diff.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (a.grow * 2 + 1,) * 2)) > 0
    er0[NOSE[1] - 3:NOSE[1] + 4, NOSE[0] - 3:NOSE[0] + 4] = False
    op = cv2.morphologyEx(diff.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)); hull0 = {}
    for k in FEAT:
        m = (diff if k == "mouth" else op > 0) & _blockmask(k); ys, xs = np.nonzero(m); h = np.zeros((H, W), np.uint8)
        cv2.fillConvexPoly(h, cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32)), 1); hull0[k] = h > 0
    fg0 = fg_mask(R); L0 = lines(R, fg0, a.style); fgb = fg_mask(B0); LB = lines(B0, fgb, a.style); keep0 = cv2.dilate(LB.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0; prot0 = LB
    hm = np.zeros((H, W), np.uint8); hm[150:560, 200:640] = 255
    gr = lambda x: cv2.cvtColor(x, cv2.COLOR_BGR2GRAY)
    Ms = head_sim(gr(R), [gr(f) for f in F], hm)
    Rg = gr(R); outs = {k: [] for k in ('noface', 'face', 'sil')}; rows = []
    for t in range(N):
        f = F[t]; fg = fg_mask(f); L = lines(f, fg, a.style); M = Ms[t]; row = {'t': t}
        if M is None: M = np.float64([[1, 0, 0], [0, 1, 0]]); row['sim_fail'] = True
        er = np.zeros((H, W), bool); fails = []; fg_ = gr(f)
        for k, (x0, y0, x1, y1) in FEAT.items():  # 逐特征校位
            tp = Rg[y0:y1, x0:x1]; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; px, py = M @ [cx, cy, 1]; s = a.shift
            ax0, ay0 = int(round(px - (x1 - x0) / 2 - s)), int(round(py - (y1 - y0) / 2 - s)); ax1, ay1 = ax0 + (x1 - x0) + 2 * s, ay0 + (y1 - y0) + 2 * s
            if ax0 < 0 or ay0 < 0 or ax1 > W or ay1 > H: fails.append(k); continue
            res = cv2.matchTemplate(fg_[ay0:ay1, ax0:ax1], tp, cv2.TM_CCOEFF_NORMED); _, mx, _, ml = cv2.minMaxLoc(res)
            row[f'{k}_ncc'] = round(float(mx), 3)
            if mx < a.min_ncc: fails.append(k); continue
            dx, dy = ml[0] - s, ml[1] - s; row[f'{k}_adj'] = [dx, dy]
            Mk = M.copy(); Mk[0, 2] += dx; Mk[1, 2] += dy
            er |= warp_mask(er0 & _blockmask(k) & ~keep0, Mk)
        # 失败的特征：只用相似变换
        for k in fails: er |= warp_mask(er0 & _blockmask(k) & ~keep0, M)
        row['track_fail'] = fails
        Lc = L & ~er; Fg = L
        prot = warp_mask(prot0 & cv2.dilate(er0.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool), M); row['miserase_px'] = int((L & er & cv2.dilate(prot.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)).sum())
        # 残留（独立于擦除区）：特征凸包（眼、嘴的实体，不含眉）按校位后的变换搬来，其中仍留在输出里的线像素；
        # leak = 凸包外扩 8px 内、擦除区外、原帧里偏暗（灰度<85）的像素（特征画到擦除区外了）
        resid = 0; leak = 0; kp = cv2.dilate(warp_mask(prot0, M).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0  # 空脸帧里本来就有的线（刘海、轮廓）不算残留
        for k in FEAT:
            if k in fails: continue
            hk = warp_mask(hull0[k], _adj(M, row, k)); resid = max(resid, int((Lc & hk & ~kp).sum()))
            ring = cv2.dilate(hk.astype(np.uint8), np.ones((17, 17), np.uint8)).astype(bool) & ~er; leak += int((ring & ~kp & (fg_ < 85)).sum())
        row['leak_dark_px'] = leak
        row['foreign_erased_px'] = int((L & er & ~warp_mask(cv2.dilate(diff.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0, M) & ~warp_mask(er0 & False, M)).sum())  # 擦掉的、不在原五官差异区(±3px)里的线：手、袖口等挡在脸前的线被误擦
        row['residual_px'] = resid; rows.append(row)
        def enc(m): return (np.where(m, 0, 255) if a.polarity == 'blackonwhite' else np.where(m, 255, 0)).astype(np.uint8)
        outs['noface'].append(enc(Lc)); outs['face'].append(enc(L)); outs['sil'].append((fg * 255).astype(np.uint8))
    sfx = {'noface': 'line-noface', 'face': 'line-face', 'sil': 'sil'}; paths = {}
    for k, v in outs.items():
        p = f'{a.out}/{name}-{a.style}-{sfx[k]}.mp4' if k != 'sil' else f'{a.out}/{name}-sil.mp4'; paths[k] = p
        pr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '8', '-pix_fmt', 'yuv420p', '-r', str(FPS), p], stdin=subprocess.PIPE)
        for im in v: pr.stdin.write(im.tobytes())
        pr.stdin.close(); pr.wait()
    idx = np.linspace(0, N - 1, 6).astype(int); sh = 1.0 / 2
    top = np.hstack([cv2.resize(F[i], None, fx=sh, fy=sh) for i in idx]); bot = np.hstack([cv2.resize(cv2.cvtColor(outs['noface'][i], cv2.COLOR_GRAY2BGR), None, fx=sh, fy=sh) for i in idx])
    cv2.imwrite(f'{a.out}/{name}-{a.style}-compare.png', np.vstack([top, bot]))
    json.dump({'frames': N, 'paths': paths, 'rows': rows}, open(f'{a.out}/{name}-{a.style}-report.json', 'w'), indent=1)
    print(name, a.style, 'frames', N, 'residual max', max(r['residual_px'] for r in rows), 'miserase max', max(r['miserase_px'] for r in rows), 'track_fail frames', sum(1 for r in rows if r['track_fail'] or r.get('sim_fail')))


def _blockmask(k):
    m = np.zeros((H, W), bool)
    if k == 'eyeL': m[340:500, 270:415] = True
    elif k == 'eyeR': m[340:500, 415:560] = True
    else: m[462:515, 375:455] = True
    return m


def _adj(M, row, k):
    Mk = M.copy(); d = row.get(f'{k}_adj')
    if d: Mk[0, 2] += d[0]; Mk[1, 2] += d[1]
    return Mk


if __name__ == '__main__': main()
