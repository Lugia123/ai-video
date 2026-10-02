"""T 字正面立绘自动估关节（猫队服版：青卫衣 + 粉裤 + 黄鞋；主角可用 --top/--bottom 颜色参数改）。
用法: python3 tools/layers/auto_joints.py episodes/cast-cyber-girl/cats/puppet/white/rig.config.json [--write]
打印估计结果并出 _work/_joints.png 叠图；--write 写回 rig.config.json 的 joints（会覆盖）。
规则：臂展最宽的行带 = 手臂；手臂下方躯干左右边 = 肩；肘/腕按肩→手尖 0.37/0.755 比例；
颈 = 中线上卫衣顶 + 10；腰 = 卫衣下摆 + 8；胯 = 裤裆 − 30；膝 = 胯与鞋顶的中点；脚 = 鞋底；
尾巴 = 腰以下、非衣服/鞋颜色的前景，测地距离从最靠近胯的点到最远点取 4 个点。"""
import json, sys, pathlib, numpy as np, cv2
from PIL import Image, ImageDraw
sys.path.insert(0, str(pathlib.Path(__file__).parent))
cfg_p = pathlib.Path([x for x in sys.argv[1:] if not x.startswith('--')][0]).resolve(); base = cfg_p.parent
cfg = json.loads(cfg_p.read_text())
img = np.asarray(Image.open(base / cfg['src']).convert('RGB')); H, W = img.shape[:2]

white = (img.min(-1) >= 236).astype(np.uint8)
n, lab = cv2.connectedComponents(white, connectivity=4)
b = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]]); fg = ~np.isin(lab, b[b > 0])
fg = cv2.morphologyEx(fg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(int); h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
cyan = (h > 80) & (h < 100) & (s > 60) & (v > 120)
pink = ((h > 150) | (h < 5)) & (s > 90) & (v > 120)
yellow = (h > 20) & (h < 38) & (s > 110) & (v > 150)
cx = W // 2

# 手臂：各行前景跨度，最宽的那段行带
span = np.array([(np.ptp(np.nonzero(r)[0]) if r.any() else 0) for r in fg])
arm_rows = np.nonzero(span > span.max() * 0.9)[0]; ay0, ay1 = arm_rows.min(), arm_rows.max()
xs_band = np.nonzero(fg[ay0:ay1 + 1].any(0))[0]; hx_l, hx_r = xs_band.min(), xs_band.max()
def arm_y(x):  # 该列在臂带附近的前景中心
    col = np.nonzero(fg[max(0, ay0 - 40):ay1 + 40, x])[0]
    return (col.min() + col.max()) / 2 + max(0, ay0 - 40) if len(col) else (ay0 + ay1) / 2
# 躯干：手臂下方 25px 的行里，包含中线的那段
def torso_edges(y):
    r = fg[min(H - 1, y)]; tl = cx; tr = cx
    while tl > 0 and r[tl - 1]: tl -= 1
    while tr < W - 1 and r[tr + 1]: tr += 1
    return tl, tr
tl, tr = torso_edges(ay1 + 25)
if tr - tl > 0.6 * (hx_r - hx_l):  # 那一行还在手臂里（手臂粗/下垂），往下找到躯干变窄的行
    for yy in range(ay1 + 25, H):
        tl, tr = torso_edges(yy)
        if tr - tl < 0.45 * (hx_r - hx_l): break
yl, yr = arm_y(tl + 5), arm_y(tr - 5)
sh_l, sh_r = np.array([tl, yl]), np.array([tr, yr]); tip_l, tip_r = np.array([hx_l, arm_y(hx_l + 3)]), np.array([hx_r, arm_y(hx_r - 3)])
J = {}
J['shoulder_l'], J['shoulder_r'] = sh_l, sh_r
for side, sh, tip in (('l', sh_l, tip_l), ('r', sh_r, tip_r)):
    J[f'elbow_{side}'] = sh + 0.37 * (tip - sh); J[f'wrist_{side}'] = sh + 0.755 * (tip - sh); J[f'hand_{side}'] = tip
    J[f'grip_{side}'] = sh + 0.85 * (tip - sh)
def run_at(mask_col, y, gap=6):  # 中线列上包含 y 的连续段（允许 gap 像素的小断口，如拉链/描线）
    top = y
    while top > 0 and mask_col[max(0, top - gap):top].any(): top -= 1
    bot = y
    while bot < H - 1 and mask_col[bot + 1:bot + 1 + gap].any(): bot += 1
    return top, bot
colc = cyan[:, cx - 58:cx - 42].mean(1) > 0.25   # 中线左侧 50px：避开胸前闪电图案和拉链
hood_top, hem = run_at(colc, (ay0 + ay1) // 2)
J['neck'] = np.array([cx, hood_top + 10]); J['waist'] = np.array([cx, hem + 8])
colp = (pink | cyan)[:, cx - 30:cx - 18].mean(1) > 0.3
y = hem; gap = 0
while y < H - 1 and not (colp[y] and gap >= 5):   # 跳过下摆滚边，等到露出的肚皮（≥5 行非衣服）之后第一次出现裤子
    gap = 0 if colp[y] else gap + 1; y += 1
py0 = y
colm = (pink | cyan)[:, cx - 3:cx + 4].mean(1) > 0.3   # 裤裆看正中线：裤子在中线上一直延续到裆部
_, crotch = run_at(colm, py0 + 15, gap=8)
hip_y = int(py0 + 0.45 * (crotch - py0))   # 肥裤子：胯关节约在裤腰到裆的 45% 处（橘猫手标 690 与此一致）
leg_row = fg[min(H - 1, crotch + 40)]
def seg_center(row, x0, x1):
    xs = np.nonzero(row[x0:x1])[0]; return xs.mean() + x0 if len(xs) else (x0 + x1) / 2
for side, (x0, x1) in (('l', (tl - 40, cx)), ('r', (cx, tr + 40))):
    # 腿的 x：裤子/鞋颜色列的中心（排除尾巴）
    legcol = (pink | cyan)[crotch + 40, x0:x1]; xs = np.nonzero(legcol)[0]
    lx = xs.mean() + x0 if len(xs) else seg_center(leg_row, x0, x1)
    ys_col = yellow[hip_y + 100:, x0:x1]; yrows = np.nonzero(ys_col.sum(1) > 8)[0]   # 只在胯以下找鞋（胸前闪电也是黄的）
    shoe_top = yrows.min() + hip_y + 100; foot = np.nonzero(fg[:, x0:x1].any(1))[0].max()
    shoe_x = np.nonzero(yellow[shoe_top:foot, x0:x1].any(0))[0].mean() + x0
    J[f'hip_{side}'] = np.array([lx, hip_y])
    kx = np.nonzero((pink | cyan)[(hip_y + shoe_top) // 2, x0:x1])[0]
    J[f'knee_{side}'] = np.array([kx.mean() + x0 if len(kx) else lx, (hip_y + shoe_top) / 2])
    J[f'foot_{side}'] = np.array([shoe_x, foot])
# 尾巴
cloth = cv2.dilate((cyan | pink | yellow).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
tail = fg & ~cloth & (np.arange(H)[:, None] > J['waist'][1] + 20)
shoe_zone = np.zeros_like(tail); shoe_zone[int(min(J['foot_l'][1], J['foot_r'][1])) - 120:] = True
tail &= ~(shoe_zone & (img.min(-1) > 200))            # 鞋底白边
tail = cv2.morphologyEx(tail.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(tail, 8)
if n > 1:
    t = lab == (np.argmax(st[1:, 4]) + 1); ys, xs = np.nonzero(t)
    hc = (J['hip_l'] + J['hip_r']) / 2
    ri = np.argmin(np.hypot(xs - hc[0], ys - hc[1])); root = (xs[ri], ys[ri])
    # 测地距离（BFS）
    dist = np.full(t.shape, -1, int); from collections import deque
    q = deque([root[::-1]]); dist[root[1], root[0]] = 0
    while q:
        yy, xx = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            y2, x2 = yy + dy, xx + dx
            if 0 <= y2 < H and 0 <= x2 < W and t[y2, x2] and dist[y2, x2] < 0:
                dist[y2, x2] = dist[yy, xx] + 1; q.append((y2, x2))
    L = dist.max()
    def band(f0, f1):
        m = (dist >= f0 * L) & (dist <= f1 * L); yy, xx = np.nonzero(m); return np.array([xx.mean(), yy.mean()])
    J['tail_root'], J['tail_1'], J['tail_2'], J['tail_tip'] = band(0, 0.06), band(0.3, 0.36), band(0.63, 0.69), band(0.94, 1.0)
J = {k: [int(round(float(v[0]))), int(round(float(v[1])))] for k, v in J.items()}
print(json.dumps(J, ensure_ascii=False))
vis = Image.fromarray(img.copy()); d = ImageDraw.Draw(vis)
for k, (x, y) in J.items(): d.ellipse([x - 6, y - 6, x + 6, y + 6], outline=(255, 0, 0), width=3); d.text((x + 7, y - 6), k, fill=(200, 0, 0))
(base / '_work').mkdir(exist_ok=True); vis.save(base / '_work/_joints.png')
if '--write' in sys.argv:
    cfg['joints'] = {**cfg['joints'], **J}; cfg_p.write_text(json.dumps(cfg, ensure_ascii=False, indent=1)); print('wrote joints')
