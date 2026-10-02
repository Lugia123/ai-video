"""按骨骼摆姿势渲染纸偶，出对比图并检查关节处的缝/破洞。
用法: python3 tools/layers/puppet_pose.py episodes/cast-cyber-girl/cats/puppet/orange [--poses episodes/cast-cyber-girl/cats/puppet/poses.json]
输出 <dir>/check-poses.jpg：每个姿势一格（白底 + 下方棋盘底 alpha 检查），格内标出缝洞数。
缝洞检测：合成 alpha>0.5 的轮廓内部、面积 < 400px、距某关节枢轴 < 40px，且洞中心按最近关节的父/子部件逆变换回静止姿势都落在身体里的空洞
（大的封闭空隙如手叉腰、尾巴与裤腿之间、胡须之间是正常的，不算）。"""
import argparse, json, pathlib, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--poses', default=None)
a = ap.parse_args(); base = pathlib.Path(a.dir)
pj = json.loads((base / 'puppet.json').read_text())
poses = json.loads(pathlib.Path(a.poses or base.parent / 'poses.json').read_text())['poses']
W, H = pj['canvas']; PAD = 160; CW, CH = W + 2 * PAD, H + 2 * PAD
parts = {p['name']: p for p in pj['parts']}
imgs = {n: np.asarray(Image.open(base / p['file']).convert('RGBA')) for n, p in parts.items()}
FONT = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 34)

def local(p, ang):  # T(pivot) R(θ) T(-pivot)，3x3
    c, s = np.cos(np.radians(ang)), np.sin(np.radians(ang)); px, py = p['pivot']
    R = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    return np.array([[1, 0, px], [0, 1, py], [0, 0, 1]]) @ R @ np.array([[1, 0, -px], [0, 1, -py], [0, 0, 1]])

def world(name, pose, memo):
    if name in memo: return memo[name]
    p = parts[name]; M = local(p, pose.get(name, 0))
    if p['parent']: M = world(p['parent'], pose, memo) @ M
    else: M = np.array([[1, 0, PAD + pose.get('root', [0, 0])[0]], [0, 1, PAD + pose.get('root', [0, 0])[1]], [0, 0, 1]]) @ M
    memo[name] = M; return M

def render(pose, memo=None):
    out = np.zeros((CH, CW, 4), np.float32); memo = {} if memo is None else memo
    for p in sorted(pj['parts'], key=lambda p: p['z']):
        M = world(p['name'], pose, memo) @ np.array([[1, 0, p['origin'][0]], [0, 1, p['origin'][1]], [0, 0, 1]])
        im = cv2.warpAffine(imgs[p['name']], M[:2], (CW, CH), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0)).astype(np.float32) / 255
        al = im[..., 3:4]; out[..., :3] = out[..., :3] * (1 - al) + im[..., :3] * al; out[..., 3:4] = out[..., 3:4] * (1 - al) + al
    joints = [(memo[n] @ np.array([*parts[n]['pivot'], 1]))[:2] for n in parts if parts[n].get('disc')]
    return out, joints

REST = None
def holes(alpha, joints, memo=None):
    fg = (alpha > 0.5).astype(np.uint8); inv = 1 - fg
    n, lab, st, cen = cv2.connectedComponentsWithStats(inv, connectivity=4)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bad = []
    for i in range(1, n):
        if i in border or st[i, cv2.CC_STAT_AREA] >= 400: continue
        if min(np.hypot(*(cen[i] - j)) for j in joints) >= 40: continue
        if memo is not None and not seam_like(cen[i], memo): continue
        bad.append((cen[i], st[i, cv2.CC_STAT_AREA]))
    return bad

rest_img, _ = render({}); REST = rest_img[..., 3] > 0.5
def seam_like(c, memo):
    best = None
    for n, p in parts.items():
        if not p['parent'] or not p.get('disc'): continue   # 只看带重叠圆盘的真关节（尾巴、道具、眼口不算）
        wj = (memo[n] @ np.array([*p['pivot'], 1]))[:2]; dd = np.hypot(*(c - wj))
        if best is None or dd < best[0]: best = (dd, n, p['parent'])
    if best is None: return False
    for n in best[1:]:
        q = np.linalg.inv(memo[n]) @ np.array([c[0], c[1], 1]); x, y = int(q[0] + PAD), int(q[1] + PAD)
        if not (0 <= y < CH and 0 <= x < CW and REST[y, x]): return False
    return True
renders = {}
for n_, pose_ in poses.items():
    memo_ = {}; img_, j_ = render(pose_, memo_); renders[n_] = (img_, j_, memo_)
allA = sum((r[0][..., 3] > 0.02).astype(np.uint8) for r in renders.values())
ys, xs = np.nonzero(allA); m = 30
y0, y1, x0, x1 = max(0, ys.min() - m - 50), min(CH, ys.max() + m), max(0, xs.min() - m), min(CW, xs.max() + m)
tiles = []; report = {}
for name, (img, joints, memo) in renders.items():
    bad = holes(img[..., 3], joints, memo); report[name] = len(bad)
    iy, ix = np.indices((CH, CW)); chk = (((iy // 16 + ix // 16) % 2) * 0.35 + 0.35)[..., None]  # 深色棋盘底看 alpha 漏洞/白边
    white = img[..., :3] * img[..., 3:4] + (1 - img[..., 3:4])
    dark = img[..., :3] * img[..., 3:4] + chk * (1 - img[..., 3:4])
    both = np.concatenate([white[y0:y1, x0:x1], dark[y0:y1, x0:x1]], 0)
    t = Image.fromarray((both * 255).astype(np.uint8)); d = ImageDraw.Draw(t)
    for c, area in bad:
        for dy in (0, y1 - y0):
            cx, cy = c[0] - x0, c[1] - y0 + dy; d.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], outline=(255, 0, 0), width=4)
    d.text((16, 12), f'{name}  缝洞 {len(bad)}', fill=(0, 0, 0), font=FONT)
    tiles.append(t)
S = Image.new('RGB', (sum(t.width for t in tiles), tiles[0].height), 'white'); x = 0
for t in tiles: S.paste(t, (x, 0)); x += t.width
S.save(base / 'check-poses.jpg', quality=90)
[print('  洞', n, [(int(c[0] - PAD), int(c[1] - PAD), int(ar)) for c, ar in holes(r[0][..., 3], r[1], r[2])]) for n, r in renders.items() if report[n]]
print('缝洞数:', report, '→', base / 'check-poses.jpg', S.size)
