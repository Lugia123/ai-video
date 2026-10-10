#!/usr/bin/env python3
"""把三档关键形的分区配色和线色对到正面母版。#1151
用法：python3 align_colors.py        （在 proto-b/gen/turnaround/ 下；可重复跑，每次都从 views/_unaligned/ 里的原图出发）
分区（按颜色分类，HSV 阈值见 classify()）：帽子藏青、头发浅色、头发青绿（发梢内侧和挑染）、肤色、发卡黄、描边深色线。
眼睛周围（按特征点里两个虹膜中心各画一个椭圆）不参加分类也不改色：眼睛在 rig 里用母版自己的部件。
每个区在 Lab 里做「中位数对齐 + 明暗范围对齐」：L' = (L − 本图中位数) × k + 母版中位数，k = 母版四分位距 ÷ 本图四分位距，夹在 0.9–1.15（肤色和线不缩放，只平移）；
a、b 只平移到母版中位数。用中位数不用均值：各图里脖子阴影、腮红占的比例不同，均值会被带偏（第一版用均值，把脸整体调黄调浅了）。
统计时排除眼睛椭圆；应用时椭圆内的肤色和浅发也照改（第一版没改，脸上留下两圈椭圆形接缝）。report 里的 mean/std 字段现在装的是中位数和四分位距。区的边界用 1.5 px 的软掩膜过渡。描边线只对齐颜色均值，不改粗细（粗细只量、只报）。
输出：views/head-v*.png 换成对齐后的；原图留在 views/_unaligned/；读数写 color_align.json；对比图 out/wip-views-color-align.png。"""
import json, os, shutil
import numpy as np, cv2
V = '../../views'; U = f'{V}/_unaligned'; os.makedirs(U, exist_ok=True)
LM = json.load(open('landmarks.json', encoding='utf-8'))
REG = ['hat', 'hair_light', 'hair_teal', 'skin', 'pin', 'line']

def classify(bgr, alpha, name):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV); H, S, Vv = [hsv[..., i].astype(int) for i in range(3)]
    ok = alpha > 200
    eye = np.zeros(alpha.shape, np.uint8)
    for k in ('iris_near', 'iris_far'):
        p = LM[name].get(k)
        if p and p[2]: cv2.ellipse(eye, (p[0], p[1]), (150, 130), 0, 0, 360, 255, -1)
    inner = ok & (eye > 0); ok = ok & (eye == 0)
    m = {}
    m['line'] = ok & (Vv < 75)
    m['hat'] = ok & (H >= 100) & (H <= 125) & (S > 80) & (Vv >= 75) & (Vv < 150)
    m['hair_light'] = ok & (H >= 68) & (H <= 98) & (S >= 8) & (S < 80) & (Vv > 185)
    m['hair_teal'] = ok & (H >= 72) & (H <= 98) & (S >= 80) & (Vv >= 90)
    m['skin'] = ok & ((H <= 18) | (H >= 170)) & (S >= 18) & (S < 125) & (Vv > 175)
    m['pin'] = ok & (H >= 12) & (H <= 30) & (S > 120) & (Vv > 140)
    # 眼睛椭圆内：肤色、浅发、帽子、发卡照常归类（应用时要改到），青绿和深色线不归类（那是虹膜和睫毛）
    m['skin'] |= inner & ((H <= 18) | (H >= 170)) & (S >= 18) & (S < 125) & (Vv > 175)
    m['hair_light'] |= inner & (H >= 68) & (H <= 98) & (S >= 8) & (S < 80) & (Vv > 185)
    m['_stat_ok'] = ok
    return m

def stats(lab, m):
    out = {}
    for r in REG:
        px = lab[m[r] & m['_stat_ok']]
        out[r] = None if len(px) < 500 else {'n': int(len(px)), 'mean': [round(float(x), 2) for x in np.median(px, 0)], 'std': [round(float(np.percentile(px[:, i], 75) - np.percentile(px[:, i], 25)), 2) for i in range(3)],
                                              'L_p5_p95': [round(float(np.percentile(px[:, 0], 5)), 1), round(float(np.percentile(px[:, 0], 95)), 1)]}
    return out

def line_width(m_line):
    """描边粗细的粗略读数：深色线的面积 ÷ 它的骨架长度（用距离变换的脊近似：线中心的距离值的 2 倍取中位数）。"""
    d = cv2.distanceTransform(m_line.astype(np.uint8), cv2.DIST_L2, 5)
    loc = (d >= cv2.dilate(d, np.ones((3, 3)))) & (d > 0.8)          # 局部极大 = 线的中心
    return round(float(np.median(d[loc]) * 2), 2) if loc.any() else None

def load(name, src_dir):
    im = cv2.imread(f'{src_dir}/{name}', cv2.IMREAD_UNCHANGED); return im[..., :3].copy(), im[..., 3].copy()

mb, ma = load('head-v0-front.png', V); mm = classify(mb, ma, 'head-v0-front.png')
mlab = cv2.cvtColor(mb.astype(np.float32) / 255, cv2.COLOR_BGR2Lab); ms = stats(mlab, mm)
report = {'master': {'file': 'head-v0-front.png', 'regions': ms, 'line_width_px': line_width(mm['line'])}, 'views': {}}
rows = []
for name in ['head-v1-slight.png', 'head-v2-quarter.png', 'head-v3-profile.png']:
    if not os.path.exists(f'{U}/{name}'): shutil.copy2(f'{V}/{name}', f'{U}/{name}')      # 第一次跑：把未对齐的原图留底
    b, a = load(name, U); m = classify(b, a, name)
    lab = cv2.cvtColor(b.astype(np.float32) / 255, cv2.COLOR_BGR2Lab); before = stats(lab, m)
    out = lab.copy(); applied = {}
    for r in REG:
        if before[r] is None or ms[r] is None: continue
        mu_s, sd_s = np.array(before[r]['mean']), np.array(before[r]['std']); mu_t, sd_t = np.array(ms[r]['mean']), np.array(ms[r]['std'])
        k = float(np.clip(sd_t[0] / max(sd_s[0], 1e-3), 0.9, 1.15)) if r not in ('line', 'skin') else 1.0
        tgt = lab.copy(); tgt[..., 0] = (lab[..., 0] - mu_s[0]) * k + mu_t[0]; tgt[..., 1] = lab[..., 1] - mu_s[1] + mu_t[1]; tgt[..., 2] = lab[..., 2] - mu_s[2] + mu_t[2]
        w = cv2.GaussianBlur(m[r].astype(np.float32), (0, 0), 1.5)[..., None] * m[r][..., None]          # 只在本区内生效，边上软一点
        out = out * (1 - w) + tgt * w; applied[r] = {'L_gain': round(k, 3), 'shift_Lab': [round(float(x), 2) for x in (mu_t - mu_s)]}
    out[..., 0] = np.clip(out[..., 0], 0, 100)
    nb = np.clip(cv2.cvtColor(out, cv2.COLOR_Lab2BGR) * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(f'{V}/{name}', np.dstack([nb, a]))
    after = stats(cv2.cvtColor(nb.astype(np.float32) / 255, cv2.COLOR_BGR2Lab), classify(nb, a, name))
    report['views'][name] = {'before': before, 'after': after, 'applied': applied, 'line_width_px': line_width(m['line'])}
    def tile(bgr, al):
        bg = np.full_like(bgr, (245, 239, 220)); x = (bgr * (al[..., None] / 255.0) + bg * (1 - al[..., None] / 255.0)).astype(np.uint8); return cv2.resize(x, (560, 560), interpolation=cv2.INTER_AREA)
    rows.append(np.hstack([tile(mb, ma), tile(b, a), tile(nb, a)]))
sheet = np.vstack(rows); bar = np.full((60, sheet.shape[1], 3), 255, np.uint8)
for i, t in enumerate(['master (v0)', 'before', 'after']): cv2.putText(bar, t, (i * 560 + 16, 42), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (74, 39, 20), 2)
cv2.imwrite('../../out/wip-views-color-align.png', np.vstack([bar, sheet]))
json.dump(report, open('color_align.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('line width px  master', report['master']['line_width_px'], {k: v['line_width_px'] for k, v in report['views'].items()})
for name, v in report['views'].items():
    print(name)
    for r in REG:
        if v['before'][r] is None or ms[r] is None: print('  ', r, '—'); continue
        d0 = np.linalg.norm(np.array(v['before'][r]['mean']) - np.array(ms[r]['mean'])); d1 = np.linalg.norm(np.array(v['after'][r]['mean']) - np.array(ms[r]['mean']))
        print(f"   {r:10s} 与母版的 Lab 均值距离 {d0:5.2f} → {d1:5.2f}   L 的 5–95 分位 {v['before'][r]['L_p5_p95']} → {v['after'][r]['L_p5_p95']}（母版 {ms[r]['L_p5_p95']}）  n={v['before'][r]['n']}")
