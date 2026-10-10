#!/usr/bin/env python3
# 空脸稳不稳：python3 gen/analyze.py <段名>  → readings/<段名>.face.json、puppet/out/clips-blank/<段名>-curve.png
# 读原始带底帧（不是抠好的），对照空脸归位帧（品红底）。
#  色差曲线：脸区域 R_FACE（x283–540 y355–525，和空脸贴片同范围）逐帧与归位帧的平均色差，同时画「有五官的原归位帧」的同一读数当参照线（一旦画回脸，曲线应冲到它附近）。
#  五官像素：R_CORE（x305–515 y415–505，眼、嘴所在，刘海之下）里和脸皮肤色相差 >60 的像素数，逐帧。
#  头晃：帽子区域 x220–620 y150–290 对归位帧的相位相关位移（px），挥手 / 托腮的手不进这块。
import sys, os, json, subprocess, numpy as np, cv2
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
R = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + '/..'); PUP = os.path.normpath(R + '/../../..'); name = sys.argv[1]; clip = f'{R}/raw/{name}.mp4'
w, h = 832, 1104
fr = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, h, w, 3).astype(np.float32)
blank = cv2.cvtColor(cv2.imread(f'{R}/home_blank{os.environ.get("V","")}_magenta.png'), cv2.COLOR_BGR2RGB).astype(np.float32)
orig = cv2.cvtColor(cv2.resize(cv2.imread(f'{R}/../clips-stage/home.png'), (w, h), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB).astype(np.float32)
fx0, fx1, fy0, fy1 = 283, 541, 355, 526; cx0, cx1, cy0, cy1 = 305, 516, 415, 506
def fdiff(a, b): return float(np.abs(a[fy0:fy1, fx0:fx1] - b[fy0:fy1, fx0:fx1]).mean())
skin = np.median(blank[cy0:cy1, cx0:cx1].reshape(-1, 3), 0)
def feat(f): return int((np.abs(f[cy0:cy1, cx0:cx1] - skin).max(2) > 60).sum())
def gray(f): return cv2.cvtColor(f.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
hat = (slice(150, 290), slice(220, 620)); win = cv2.createHanningWindow((400, 140), cv2.CV_32F); g0 = gray(blank)[hat]
dxy = [cv2.phaseCorrelate(g0, gray(f)[hat], win)[0] for f in fr]
def shifted(f, a, b): return cv2.warpAffine(f, np.float32([[1, 0, -a], [0, 1, -b]]), (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
al = [shifted(f, a, b) for f, (a, b) in zip(fr, dxy)]   # 按帽子位移把头平移回归位帧位置再比脸（头跟着晃的那部分不算脸变了）
# 相似变换（SIFT + RANSAC，头区域 x200–640 y150–560；手是离群点）：脸中心 (420,440) 的位移 + 旋转角 + 缩放；另量帽子（藏青色块质心）位移
sift = cv2.SIFT_create(); hm = np.zeros((h, w), np.uint8); hm[150:560, 200:640] = 255; gb = gray(blank).astype(np.uint8); kb, db = sift.detectAndCompute(gb, hm); bf = cv2.BFMatcher()
sim = []
for f in fr:
    kf, df = sift.detectAndCompute(gray(f).astype(np.uint8), hm); ms = [m for m, n in bf.knnMatch(db, df, k=2) if m.distance < .75 * n.distance]
    if len(ms) < 6: sim.append([None] * 4); continue
    M, inl = cv2.estimateAffinePartial2D(np.float32([kb[m.queryIdx].pt for m in ms]), np.float32([kf[m.trainIdx].pt for m in ms]), method=cv2.RANSAC, ransacReprojThreshold=2.0)
    if M is None: sim.append([None] * 4); continue
    c = M @ np.array([420, 440, 1.0]); sim.append([round(float(c[0] - 420), 2), round(float(c[1] - 440), 2), round(float(np.degrees(np.arctan2(M[1, 0], M[0, 0]))), 2), round(float(np.hypot(M[0, 0], M[1, 0])), 4)])
def hatc(f):
    m = (f[..., 0] < 50) & (f[..., 1] < 90) & (f[..., 2] < 110) & (f[..., 2] > 20); m[:100] = 0; m[330:] = 0; n_, lb, st, ce = cv2.connectedComponentsWithStats(m.astype(np.uint8)); k_ = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); return float(ce[k_][0]), float(ce[k_][1])   # 只取最大的一块（帽子），袖口的藏青条不算
hb = hatc(blank); hat_c = [[round(float(hatc(f)[0] - hb[0]), 2), round(float(hatc(f)[1] - hb[1]), 2)] for f in fr]
d = [fdiff(f, blank) for f in al]; ft = [feat(f) for f in al]; d_raw = [fdiff(f, blank) for f in fr]
info = {'clip': name, 'frames': len(fr), 'ref_orig_face_diff': round(fdiff(orig, blank), 2), 'ref_orig_feat_px': feat(orig),
        'face_diff': [round(x, 2) for x in d], 'face_diff_unaligned': [round(x, 2) for x in d_raw], 'feat_px': ft, 'head_shift_px': [[round(float(a), 2), round(float(b), 2)] for a, b in dxy],
        'hat_centroid_dx_dy': hat_c, 'hat_dx_max_abs': max(abs(x[0]) for x in hat_c), 'hat_dy_max_abs': max(abs(x[1]) for x in hat_c), 'head_sim_dx_dy_rot_scale': sim, 'sim_dx_max_abs': max(abs(x[0]) for x in sim if x[0] is not None), 'sim_dy_max_abs': max(abs(x[1]) for x in sim if x[0] is not None), 'sim_rot_max_abs_deg': max(abs(x[2]) for x in sim if x[0] is not None),
        'face_diff_max': round(max(d), 2), 'face_diff_max_frame': int(np.argmax(d)), 'feat_px_first': ft[0], 'feat_px_over_first_max': max(ft) - ft[0], 'feat_px_max': max(ft), 'feat_px_max_frame': int(np.argmax(ft)),
        'head_shift_max_abs': [round(float(max(abs(a) for a, _ in dxy)), 2), round(float(max(abs(b) for _, b in dxy)), 2)]}
os.makedirs(f'{R}/readings', exist_ok=True); json.dump(info, open(f'{R}/readings/{name}.face.json', 'w'), ensure_ascii=False)
os.makedirs(f'{PUP}/out/clips-blank', exist_ok=True)
plt.rcParams['font.sans-serif'] = ['PingFang SC', 'Heiti SC', 'Arial Unicode MS']; plt.rcParams['axes.unicode_minus'] = False
fig, ax = plt.subplots(3, 1, figsize=(10, 7), sharex=True); t = np.arange(len(fr))
ax[0].plot(t, d, label='对齐头位移后'); ax[0].plot(t, d_raw, color='gray', alpha=.5, label='未对齐'); ax[0].axhline(info['ref_orig_face_diff'], color='r', ls='--', label='有五官的原归位帧'); ax[0].set_ylabel('脸区色差 vs 空脸'); ax[0].legend()
ax[1].plot(t, ft); ax[1].axhline(info['ref_orig_feat_px'], color='r', ls='--'); ax[1].set_ylabel('五官区深/异色像素')
ax[2].plot(t, [a for a, _ in dxy], label='dx'); ax[2].plot(t, [b for _, b in dxy], label='dy'); ax[2].set_ylabel('帽子位移 px'); ax[2].legend(); ax[2].set_xlabel('帧')
for a in ax: a.grid(alpha=.3)
fig.suptitle(name); fig.tight_layout(); fig.savefig(f'{PUP}/out/clips-blank/{name}-curve.png', dpi=100)
print(name, {k: v for k, v in info.items() if k not in ('face_diff', 'face_diff_unaligned', 'feat_px', 'head_shift_px', 'head_sim_dx_dy_rot_scale', 'hat_centroid_dx_dy')})
