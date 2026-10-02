#!/usr/bin/env python3
"""千问生成的立绘 ↔ 3D 头部姿态拟合（#936）。
python3 tools/face-bake/fit_pose.py p10 [headmesh.json]
读 closeup/yaw/<组>/landmarks.json 的 fit2d（2D 关键点，像素），和 3D 同名点（本文件 P3，4K 模型静止姿态坐标；
z 取网格上正面看过去最靠前的表面），弱透视（正交 + 缩放）下对 yaw / pitch / roll + 缩放 + 平移做最小二乘：
  · 点状关键点（瞳孔、眼角、鼻尖、嘴角、下巴尖）：残差 = 投影点到 2D 点的距离；
  · 轮廓点（左右下颌 / 脸颊各 3 点）：残差 = 2D 点到「下半张脸顶点投影的凸包边界」的距离（轮廓随角度变，没有固定的 3D 同名点）。
写回 landmarks.json 的 fit（姿态、逐点残差、RMS），并输出 fit.json 给画叠图用。
yaw 约定同 girl.js：镜头在她左侧（头的 +X 一侧）为正。
"""
import json, os, sys
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial import ConvexHull

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
G = sys.argv[1] if len(sys.argv) > 1 else 'p10'
MESH = sys.argv[2] if len(sys.argv) > 2 else None
LP = os.path.join(ROOT, 'episodes/cast-cyber-girl/closeup/yaw', G, 'landmarks.json')
L = json.load(open(LP))
M = json.load(open(MESH or os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-headmesh.json')))
V = np.array(M['V'], float); T = np.array(M['T'], int); SKIN = np.array(M.get('skin', [1] * len(V)), bool)   # skin = girl.js 的 aFaceMask（脸皮遮罩）

# 3D 同名点（x, y；z 从网格取）：眼角 / 嘴角从 4K 原贴图读（_faceorig.html 正交正面图 + 模型坐标网格），鼻尖 / 下巴尖取几何
P3xy = {
    'pupilR_img': (-0.0244, 0.9090), 'pupilL_img': (0.0231, 0.9090),      # 画面左 / 右的瞳孔（她的右眼 / 左眼）
    'eyeOutR_img': (-0.0356, 0.9117), 'eyeInR_img': (-0.0138, 0.9096),
    'eyeInL_img': (0.0141, 0.9107), 'eyeOutL_img': (0.0356, 0.9112),
    'mouthR_img': (-0.0112, 0.8745), 'mouthL_img': (0.0112, 0.8750),
}
def front_z(x, y):
    zb = -np.inf
    A, B, C = V[T[:, 0]], V[T[:, 1]], V[T[:, 2]]
    den = (B[:, 1] - C[:, 1]) * (A[:, 0] - C[:, 0]) + (C[:, 0] - B[:, 0]) * (A[:, 1] - C[:, 1])
    ok = np.abs(den) > 1e-14
    l0 = ((B[:, 1] - C[:, 1]) * (x - C[:, 0]) + (C[:, 0] - B[:, 0]) * (y - C[:, 1])) / np.where(ok, den, 1)
    l1 = ((C[:, 1] - A[:, 1]) * (x - C[:, 0]) + (A[:, 0] - C[:, 0]) * (y - C[:, 1])) / np.where(ok, den, 1)
    l2 = 1 - l0 - l1
    inside = ok & (l0 >= 0) & (l1 >= 0) & (l2 >= 0)
    if not inside.any(): return np.nan
    return float((l0 * A[:, 2] + l1 * B[:, 2] + l2 * C[:, 2])[inside].max())
P3 = {k: np.array([x, y, front_z(x, y)]) for k, (x, y) in P3xy.items()}
# 鼻尖 = 鼻子一带最靠前的顶点；下巴尖 = 脸中线附近、脸正面（z 大）里最低的点
nose = V[(np.abs(V[:, 0]) < 0.006) & (V[:, 1] > 0.88) & (V[:, 1] < 0.905)]
P3['noseTip'] = nose[np.argmax(nose[:, 2])]
chin = V[(np.abs(V[:, 0]) < 0.004) & (V[:, 1] > 0.85) & (V[:, 1] < 0.87) & (V[:, 2] > 0.035)]
P3['chinTip'] = chin[np.argmin(chin[:, 1])]
# 下半张脸（算轮廓用）：脸皮遮罩里、眼睛以下、下巴以上
low = V[SKIN & (V[:, 1] > P3['chinTip'][1] - 0.001) & (V[:, 1] < 0.905) & (V[:, 2] > -0.004) & (np.abs(V[:, 0]) < 0.043)]   # |x| < 0.043：耳朵也是肤色，要排除
CEN = np.array([0.0, 0.89, 0.02])

def rot(yaw, pitch, roll):
    y, p, r = np.radians([yaw, pitch, roll])
    Ry = np.array([[np.cos(y), 0, np.sin(y)], [0, 1, 0], [-np.sin(y), 0, np.cos(y)]])
    Rx = np.array([[1, 0, 0], [0, np.cos(p), -np.sin(p)], [0, np.sin(p), np.cos(p)]])
    Rz = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0], [0, 0, 1]])
    return Rz @ Rx @ Ry
def project(X, q):
    # 镜头在她左侧 yaw 度 = 头绕 y 轴转 −yaw；图像 y 向下
    yaw, pitch, roll, s, tx, ty = q
    Y = (X - CEN) @ rot(-yaw, pitch, roll).T
    return np.stack([tx + s * Y[:, 0], ty - s * Y[:, 1]], 1)
def seg_dist(p, a, b):
    ab = b - a; t = np.clip(((p - a) @ ab) / max(ab @ ab, 1e-12), 0, 1); return np.linalg.norm(a + t * ab - p)
def contour_dist(p, hull_pts):
    n = len(hull_pts); return min(seg_dist(p, hull_pts[i], hull_pts[(i + 1) % n]) for i in range(n))

F2 = L['fit2d']
# 默认（登记用）：眼 6 点 + 嘴角 + 下巴尖、不用轮廓、俯仰固定 0。鼻尖不用：动画画法把鼻子画得比 3D 更偏向侧面，会把 yaw 拉大（p10：+11°）；
# 轮廓不用：千问的下半脸比 3D 长约 10%，下颌线对不上。两者都作为「脸型差异」单独报告。
DEFAULT_USE = 'nocontour:pupilR_img,pupilL_img,eyeOutR_img,eyeInR_img,eyeInL_img,eyeOutL_img,mouthR_img,mouthL_img,chinTip'
USE = os.environ.get('FIT_USE', DEFAULT_USE)   # 逗号分隔的关键点子集；'nocontour' 前缀 = 不用轮廓
NOC = bool(USE and USE.startswith('nocontour'))
if NOC: USE = USE.split(':', 1)[1] if ':' in USE else None
pt_keys = [k for k in F2 if k in P3 and (not USE or k in USE.split(','))]
contour2d = [] if NOC else [np.array(p, float) for side in ('jawR_img', 'jawL_img') for p in F2.get(side, [])]
FIXP = os.environ.get('FIT_PITCH', '0')
if FIXP == 'free': FIXP = None   # 俯仰组（低头 / 仰头）：俯仰也拟合   # 固定俯仰（度）：参考图俯仰是 0，千问加长的下半脸不该被解释成低头 / 仰头
def residuals(q):
    if FIXP is not None: q = [q[0], float(FIXP), *q[2:]]
    Xs = np.stack([P3[k] for k in pt_keys]); pr = project(Xs, q)
    r = list((pr - np.array([F2[k] for k in pt_keys])).ravel())
    if contour2d:
        H = project(low, q); hv = H[ConvexHull(H).vertices]
        r += [contour_dist(p, hv) for p in contour2d]
    return np.array(r)
# 初值：尺度按瞳距，平移按瞳孔中点
d2 = np.linalg.norm(np.subtract(F2['pupilL_img'], F2['pupilR_img'])); d3 = np.linalg.norm(P3['pupilL_img'][:2] - P3['pupilR_img'][:2])
best = None
for y0 in (-20, -10, 0, 10, 20, 30):
    q0 = [y0, 0, 0, d2 / d3, 0, 0]
    pr = project(np.stack([P3['pupilR_img'], P3['pupilL_img']]), q0); c2 = (np.array(F2['pupilR_img']) + np.array(F2['pupilL_img'])) / 2
    q0[4] = c2[0] - pr.mean(0)[0]; q0[5] = c2[1] - pr.mean(0)[1]
    sol = least_squares(residuals, q0, bounds=([-60, -30, -25, 0, -1e4, -1e4], [60, 30, 25, 1e6, 1e4, 1e4]))
    if best is None or sol.cost < best.cost: best = sol
q = best.x.copy()
if FIXP is not None: q[1] = float(FIXP)
r = residuals(q)
npt = len(pt_keys)
per = {k: round(float(np.hypot(r[2 * i], r[2 * i + 1])), 1) for i, k in enumerate(pt_keys)}
cont = [round(float(v), 1) for v in r[2 * npt:]]
rms_pts = float(np.sqrt(np.mean([v ** 2 for v in per.values()])))
rms_all = float(np.sqrt(np.mean(np.concatenate([[v ** 2 for v in per.values()], np.square(cont)]))))
iod = d2
fit = {'yaw': round(float(q[0]), 1), 'pitch': round(float(q[1]), 1), 'roll': round(float(q[2]), 1), 'scale': round(float(q[3]), 1), 'tx': round(float(q[4]), 1), 'ty': round(float(q[5]), 1),
       'rmsPoints_px': round(rms_pts, 1), 'rmsAll_px': round(rms_all, 1), 'interocular_px': round(float(iod), 1), 'perPoint_px': per, 'contour_px': cont,
       'P3': {k: [round(float(v), 5) for v in P3[k]] for k in pt_keys}}
# 投影结果（画叠图用）
fit['proj'] = {k: [round(float(v), 1) for v in project(P3[k][None], q)[0]] for k in pt_keys}
H = project(low, q); fit['hull'] = [[round(float(a), 1), round(float(b), 1)] for a, b in H[ConvexHull(H).vertices]]
# 诊断：在登记姿态下，所有关键点（含鼻尖、轮廓）的残差
all_keys = [k for k in F2 if k in P3]
pr_all = project(np.stack([P3[k] for k in all_keys]), q)
fit['diag_allPoints_px'] = {k: round(float(np.linalg.norm(pr_all[i] - np.array(F2[k]))), 1) for i, k in enumerate(all_keys)}
Hh = project(low, q); hv = Hh[ConvexHull(Hh).vertices]
from matplotlib.path import Path as _P
_hp = _P(hv)
fit['diag_contour_px'] = [round(float(contour_dist(np.array(p, float), hv)) * (-1 if _hp.contains_point(p) else 1), 1) for side in ('jawR_img', 'jawL_img') for p in F2.get(side, [])]   # 负 = 2D 点在 3D 轮廓里面（3D 更宽）
fit['proj_all'] = {k: [round(float(v), 1) for v in pr_all[i]] for i, k in enumerate(all_keys)}
fit['P3_all'] = {k: [round(float(v), 5) for v in P3[k]] for k in all_keys}
fit['subset'] = pt_keys; fit['contour'] = bool(contour2d); fit['pitchFixed'] = FIXP
if not os.environ.get('FIT_USE') and os.environ.get('FIT_PITCH') in (None, 'free'):
    L['fit'] = {k: v for k, v in fit.items() if k not in ('proj', 'hull', 'P3', 'proj_all', 'P3_all')}
    json.dump(L, open(LP, 'w'), ensure_ascii=False, indent=1)
    json.dump(fit, open(os.path.join(os.path.dirname(LP), 'fit.json'), 'w'), ensure_ascii=False, indent=1)
print(json.dumps({k: fit[k] for k in ('yaw', 'pitch', 'roll', 'scale', 'rmsPoints_px', 'rmsAll_px', 'interocular_px', 'perPoint_px', 'contour_px')}, ensure_ascii=False))
