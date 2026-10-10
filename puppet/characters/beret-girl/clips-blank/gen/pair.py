#!/usr/bin/env python3
# 同种子配对 A（有五官归位帧）|B（空脸归位帧）逐帧偏差：python3 gen/pair.py <动作写法如 wave_h1> <种子>
# A = raw/<act>-blank2A-draft-s<seed>.mp4，B = raw/<act>-blank2-draft-s<seed>.mp4（832×1104 带品红底的原始帧）。
# 局部位移：窗口（home 坐标，随 B 的帽子位移平移）内 A→B 的 ECC 平移，亚像素；窗口里 A 的五官不进窗（下巴、左右脸颊下缘、刘海下缘中段、左右帽檐、发卡）。
# 手和袖子：各自与自己的归位帧相比「动了的像素」、去掉头部（归位帧头部轮廓外扩 25px）后的区域，量 A→B 稠密光流位移和剪影轮廓倒角距离。
# 五官搬运：A 的头区域 SIFT+RANSAC 相似变换（脸中心位移 + 旋转）把归位帧里的左眼、右眼、嘴三点带到当帧位置；B 同法得到另一个位置；再量「搬到 B 上的点」相对 B 脸轮廓（下巴 + 左右脸颊三窗位移的均值）的偏差。
import sys, os, json, subprocess, numpy as np, cv2
R = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + '/..'); OUT = os.path.normpath(R + '/../../../out/clips-blank/' + os.environ.get('PAIR_DIR', 'pair')); os.makedirs(OUT, exist_ok=True)
act, seed = sys.argv[1], sys.argv[2]; nA, nB = os.environ.get('PAIR_A', f'{act}-blank2A-draft-s{seed}'), os.environ.get('PAIR_B', f'{act}-blank2-draft-s{seed}'); TAG = os.environ.get('PAIR_TAG', f'{act}-s{seed}'); w, h = 832, 1104
def load(n): return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{R}/raw/{n}.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, h, w, 3)
FA, FB = load(nA), load(nB); N = min(len(FA), len(FB))
rd = lambda p: cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB)
HA, HB = rd(f'{R}/home_withface_magenta.png'), rd(f'{R}/home_blank_v2_magenta.png')
if os.environ.get('PAIR_REF0'): HA, HB = FA[0].copy(), FB[0].copy()   # 以各自第 0 帧当归位参照（用于归位帧与片首帧有几像素错位的 A，如 clips-batch1）
gray = lambda f: cv2.cvtColor(np.ascontiguousarray(f), cv2.COLOR_RGB2GRAY)
fg = lambda f: ((f[..., :].astype(int)[..., [0, 2]].min(2) - f[..., 1].astype(int)) < 70)
WIN = {'下巴': (350, 505, 490, 548), '左脸颊': (290, 470, 345, 512), '右脸颊': (500, 470, 552, 516), '刘海下缘': (395, 365, 470, 410), '左帽檐': (225, 305, 335, 360), '右帽檐': (565, 320, 645, 395), '发卡': (498, 252, 598, 345)}
hat = (slice(150, 290), slice(220, 620)); hw = cv2.createHanningWindow((400, 140), cv2.CV_32F); gB0 = gray(HB)[hat].astype(np.float32)
def ecc(ta, tb):
    ta = cv2.GaussianBlur(ta.astype(np.float32), (0, 0), 1.0); tb = cv2.GaussianBlur(tb.astype(np.float32), (0, 0), 1.0); M = np.eye(2, 3, dtype=np.float32)
    try: cc, M = cv2.findTransformECC(ta, tb, M, cv2.MOTION_TRANSLATION, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, 1e-5), None, 5)
    except cv2.error: return None
    return float(M[0, 2]), float(M[1, 2]), float(cc)
def crop(g, x0, y0, x1, y1): return g[max(0, y0):y1, max(0, x0):x1]
# 头区域相似变换
sift = cv2.SIFT_create(); hm = np.zeros((h, w), np.uint8); hm[150:560, 200:640] = 255; bf = cv2.BFMatcher()
def sim_all(Hm, F):
    kb, db = sift.detectAndCompute(gray(Hm), hm); out = []
    for f in F:
        kf, df = sift.detectAndCompute(gray(f), hm); ms = [m for m, n in bf.knnMatch(db, df, k=2) if m.distance < .75 * n.distance] if df is not None else []
        if len(ms) < 6: out.append(None); continue
        M, _ = cv2.estimateAffinePartial2D(np.float32([kb[m.queryIdx].pt for m in ms]), np.float32([kf[m.trainIdx].pt for m in ms]), method=cv2.RANSAC, ransacReprojThreshold=2.0); out.append(M)
    return out
MA, MB = sim_all(HA, FA[:N]), sim_all(HB, FB[:N])
PTS = {'左眼': (350, 436), '右眼': (475, 439), '嘴': (412, 489)}
apply = lambda M, p: (M @ np.array([p[0], p[1], 1.0]))[:2] if M is not None else None
# 头部区域（排除手臂用）
headm = cv2.dilate((fg(HA) & (np.arange(h)[:, None] < 590)).astype(np.uint8), np.ones((51, 51), np.uint8)) > 0
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
rows = []
for t in range(N):
    a, b = FA[t], FB[t]; r = {'t': t}
    sh = cv2.phaseCorrelate(gB0, gray(b)[hat].astype(np.float32), hw)[0]; sx, sy = int(round(sh[0])), int(round(sh[1]))
    ga, gb, gbh = gray(a), gray(b), gray(HB)
    loc = {}
    for k, (x0, y0, x1, y1) in WIN.items():
        e = ecc(crop(ga, x0 + sx, y0 + sy, x1 + sx, y1 + sy), crop(gb, x0 + sx, y0 + sy, x1 + sx, y1 + sy)); loc[k] = e
        r[k] = None if e is None else [round(e[0], 3), round(e[1], 3), round(e[2], 3)]   # A→B 位移 dx dy、相关系数
    # B 自身脸轮廓相对 B 归位帧的位移（下巴 + 两颊三窗均值）
    od = []
    for k in ('下巴', '左脸颊', '右脸颊'):
        x0, y0, x1, y1 = WIN[k]; e = ecc(crop(gbh, x0, y0, x1, y1), crop(gb, x0 + sx, y0 + sy, x1 + sx, y1 + sy))
        if e: od.append((sx + e[0], sy + e[1]))
    r['B脸轮廓位移'] = [round(float(np.mean([p[0] for p in od])), 3), round(float(np.mean([p[1] for p in od])), 3)] if len(od) == 3 else None
    for k, p0 in PTS.items():
        pa, pb = apply(MA[t], p0), apply(MB[t], p0)
        pbo = None if pb is None or r['B脸轮廓位移'] is None else round(float(np.hypot(pb[0] - p0[0] - r['B脸轮廓位移'][0], pb[1] - p0[1] - r['B脸轮廓位移'][1])), 3)
        r['底噪_' + k] = pbo   # B 自己的跟踪点相对 B 脸轮廓的偏差（和 A 无关，是「相似变换 vs 脸轮廓平移」这套量法本身的底）
        r['搬运_' + k] = None if pa is None or pb is None else {'A跟踪点': [round(float(pa[0]), 2), round(float(pa[1]), 2)], 'B同法点': [round(float(pb[0]), 2), round(float(pb[1]), 2)], '两者相差': round(float(np.hypot(*(pa - pb))), 3),
            '相对B脸轮廓': None if r['B脸轮廓位移'] is None else round(float(np.hypot(pa[0] - p0[0] - r['B脸轮廓位移'][0], pa[1] - p0[1] - r['B脸轮廓位移'][1])), 3)}
    # 手和袖子
    fa, fb = fg(a), fg(b); mv = (((np.abs(a.astype(int) - HA).max(2) > 40) & fa) | ((np.abs(b.astype(int) - HB).max(2) > 40) & fb)) & ~headm
    mv = cv2.morphologyEx(mv.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    r['手臂区像素'] = int(mv.sum())
    if mv.sum() >= 400:
        fl = dis.calc(ga, gb, None); mag = np.hypot(fl[..., 0], fl[..., 1])[mv]; r['手臂光流均值'] = round(float(mag.mean()), 3); r['手臂光流p95'] = round(float(np.percentile(mag, 95)), 3)
        zone = cv2.dilate(mv.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
        ca = (fa & ~cv2.erode(fa.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)) & zone; cb = (fb & ~cv2.erode(fb.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)) & zone
        if ca.sum() and cb.sum():
            da = cv2.distanceTransform((~cb).astype(np.uint8), cv2.DIST_L2, 3)[ca]; db_ = cv2.distanceTransform((~ca).astype(np.uint8), cv2.DIST_L2, 3)[cb]; r['手臂轮廓倒角均值'] = round(float((da.mean() + db_.mean()) / 2), 3); r['手臂轮廓倒角最大'] = round(float(max(da.max(), db_.max())), 3)
    rows.append(r)
# 汇总
def mag(r, k):
    v = r.get(k); return None if v is None else float(np.hypot(v[0], v[1]))
S = {}
def stat(name, vals):
    ok = [(v, r['t']) for v, r in zip(vals, rows) if v is not None]
    if ok: m = max(ok); S[name] = {'均值': round(float(np.mean([v for v, _ in ok])), 3), '最大': round(m[0], 3), '最大帧': m[1], '有效帧': len(ok)}
for k in WIN: stat(k, [mag(r, k) for r in rows])
stat('脸轮廓(下巴/左右颊逐帧取最大)', [None if any(mag(r, k) is None for k in ('下巴', '左脸颊', '右脸颊')) else max(mag(r, k) for k in ('下巴', '左脸颊', '右脸颊')) for r in rows])
for k in PTS:
    stat(f'搬运_{k}_两者相差', [r['搬运_' + k]['两者相差'] if r.get('搬运_' + k) else None for r in rows]); stat(f'搬运_{k}_相对B脸轮廓', [r['搬运_' + k]['相对B脸轮廓'] if r.get('搬运_' + k) else None for r in rows])
for k in PTS: stat(f'底噪_{k}(B自己的点相对B脸轮廓)', [r.get('底噪_' + k) for r in rows])
for k in ('手臂光流均值', '手臂光流p95', '手臂轮廓倒角均值', '手臂轮廓倒角最大'): stat(k, [r.get(k) for r in rows])
S['手臂区有效帧(>=400px)'] = sum(1 for r in rows if r['手臂区像素'] >= 400)
json.dump({'A': nA, 'B': nB, 'frames': N, 'summary': S, 'rows': rows}, open(f'{R}/readings/pair-{TAG}.json', 'w'), ensure_ascii=False)
print(nA, 'vs', nB, N, '帧')
for k, v in S.items(): print('  %-34s %s' % (k, v))
# 视频：A|B 并排 1:1；头部 3 倍 50% 叠化
pa_, pb_ = f'{R}/raw/{nA}.mp4', f'{R}/raw/{nB}.mp4'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', pa_, '-i', pb_, '-filter_complex', 'hstack=inputs=2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-r', '16', f'{OUT}/{TAG}-AB-sidebyside.mp4'])
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', pa_, '-i', pb_, '-filter_complex', '[0:v][1:v]blend=all_expr=(A+B)/2,crop=440:470:200:130,scale=1320:1410:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-r', '16', f'{OUT}/{TAG}-AB-head3x-crossfade.mp4'])
print(OUT)
