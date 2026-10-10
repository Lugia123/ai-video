#!/usr/bin/env python3
"""校验：新的脸部部件（#1157）。要先跑过 split_head.py、build_face.py、build_eyes.py、build_lids.py、mouth_build.py。

  python3 verify_face.py --source <角色来源目录> --work <中间产物目录>

出 <work>/out/wip-face-parts-sheet.png（爆炸图 + 叠回对比 + 错位测试 + 三种底色检查）和 <work>/face/verify.json。只读 source，不往里写。
下面说的「旧」= <work>/parts/ 里拆件直接得到的部件，「新」= <source>/face/ 里的成品。
a) 叠回：新脸底 + 新五官（闭嘴）+ 拆件得到的头发、帽子，按 rig.json 的层序叠在 head_master 坐标里，和母版逐像素比。
b) 错位：眉上下 ±12、左右 ±20；眼睛各层左右 ±15；嘴上下 ±8。量「部件挪开后露出来的那块脸底」上的残影：
   残影 = 脸底与它自己的平滑版（σ=12，只在皮肤像素上平滑，不把轮廓线算进去）的 Lab 色差。旧脸底（拆件得到的 face.png）和新脸底各量一遍。
c) 每个部件叠在品红 / 深藏青 / 白上：量边缘一圈（alpha 5%–95% 的像素）里「像皮肤的浅色」占多少。"""
import json, os, sys
import numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 S、W 已经是别的变量名（画布边长、宽度），所以换个名字引
from scipy import ndimage as ndi
HO = (390, 136); RIG = json.load(open(SRC('head/rig.json'), encoding='utf-8')); P = {p['id']: p for p in RIG['parts']}
FJ = json.load(open(SRC('face/face.json'), encoding='utf-8')); FP = {p['id']: p for p in FJ['parts']}
M = cv2.imread(SRC('master/head_master.png')); S = 1408
def rd(path): return cv2.imread(path, cv2.IMREAD_UNCHANGED)
def DIR(d, name): return WK('parts', name) if d == 'parts' else SRC('face', name)          # 下面代码里的目录记号：'parts' = 拆件得到的旧部件，'face' = 成品
def paste(canvas, im, rect, dx=0, dy=0):
    x0, y0 = int(round(rect[0] - HO[0] + dx)), int(round(rect[1] - HO[1] + dy)); h, w = im.shape[:2]
    xs, ys = max(0, x0), max(0, y0); xe, ye = min(S, x0 + w), min(S, y0 + h)
    if xe <= xs or ye <= ys: return
    src = im[ys - y0:ye - y0, xs - x0:xe - x0].astype(np.float32); a = src[..., 3:4] / 255
    canvas[ys:ye, xs:xe, :3] = canvas[ys:ye, xs:xe, :3] * (1 - a) + src[..., :3] * a
    canvas[ys:ye, xs:xe, 3:4] = np.maximum(canvas[ys:ye, xs:xe, 3:4], a * 255)
def foot(name, src_dir, dx=0, dy=0):
    c = np.zeros((S, S, 4), np.float32); paste(c, rd(DIR(src_dir, name + '.png')), P[name]['rect'], dx, dy); return c[..., 3] > 25
def lab(bgr): return cv2.cvtColor(np.clip(bgr, 0, 255).astype(np.float32) / 255, cv2.COLOR_BGR2Lab)
EYE = lambda s: [f'eyeWhite{s}', f'iris{s}', f'eyeHl{s}', f'eyeLow{s}', f'lash{s}']
def compose(face_dir, part_dir, shift=None, mouth='mouth_closed', with_hair=True, bg=(245, 239, 220)):
    """shift: {部件名: (dx, dy)}"""
    shift = shift or {}
    c = np.zeros((S, S, 4), np.float32); c[..., :3] = bg
    order = ['hair_back', 'face', 'nose'] + EYE('L') + EYE('R') + [mouth, 'hair_front', 'hair_sideL', 'hair_sideR', 'browL', 'browR', 'ahoge', 'hat']
    for n in order:
        if n.startswith(('hair', 'ahoge', 'hat')):
            if with_hair: paste(c, rd(DIR('parts', n + '.png')), P[n]['rect'])
        elif n == 'face': paste(c, rd(DIR(face_dir, 'face.png')), P['face']['rect'])
        else: paste(c, rd(DIR(part_dir, n + '.png')), P[n]['rect'], *shift.get(n, (0, 0)))
    return c[..., :3].astype(np.uint8)

res = {}
_m = np.load(WK('face/_dbg_masks.npy')); _e = np.zeros((S, S, 4), np.float32); paste(_e, np.dstack([np.zeros(_m[3].shape + (3,), np.uint8), _m[3] * 255]), P['face']['rect'])
EARC = ndi.binary_dilation(_e[..., 3] > 128, iterations=10)
# ---------- a) 叠回对比
old = compose('parts', 'parts', bg=(233, 233, 233)); new = compose('face', 'face', bg=(233, 233, 233))
fm = foot('face', 'parts')                                             # 只在脸底覆盖的范围里比
vis = fm & ~ndi.binary_dilation(~fm, iterations=4)
def cmp(a):
    d = np.linalg.norm(lab(a) - lab(M), axis=2); return {'mean_dE': round(float(d[vis].mean()), 2), 'p95_dE': round(float(np.percentile(d[vis], 95)), 2), 'pct_over_10': round(float((d[vis] > 10).mean() * 100), 2)}, d
res['recompose_vs_master'] = {'old_parts': cmp(old)[0], 'new_parts': cmp(new)[0], 'region': '脸底覆盖的范围（向内收 4 px）', 'note': '头发、帽子用的是拆件直接得到的（头发归 #1152）。母版里刘海在额头上的投影、发丝边缘不在这次的部件里，差异主要来自那里。'}
dnew = cmp(new)[1]
# ---------- b) 错位测试
def ghost(face_dir, names, dx, dy, part_dir):
    f = np.zeros((S, S, 4), np.float32); paste(f, rd(DIR(face_dir, 'face.png')), P['face']['rect']); fb = f[..., :3]
    L = lab(fb)
    line0 = cv2.cvtColor(fb.astype(np.uint8), cv2.COLOR_BGR2HSV)[..., 2] < 110
    skinm = ((f[..., 3] > 250) & ~ndi.binary_dilation(line0, iterations=5)).astype(np.float32)      # 只在皮肤像素上做平滑：
    sm = cv2.GaussianBlur(L * skinm[..., None], (0, 0), 12) / np.maximum(cv2.GaussianBlur(skinm, (0, 0), 12), 1e-6)[..., None]   # 否则旁边的深色轮廓线会被算进平均值，贴着脸缘的地方读数虚高
    hp = np.linalg.norm(L - sm, axis=2)
    was = np.zeros((S, S), bool); now = np.zeros((S, S), bool)
    for n in names: was |= foot(n, part_dir); now |= foot(n, part_dir, dx, dy)
    U = ndi.binary_dilation(was, iterations=4) & ~now & (f[..., 3] > 250)
    line = cv2.cvtColor(fb.astype(np.uint8), cv2.COLOR_BGR2HSV)[..., 2] < 110
    U &= ~ndi.binary_dilation(line, iterations=14)                     # 轮廓线自己和它 14 px 以内不算：线的抗锯齿和线内侧的软过渡会被读成色差（8 px 时外眼角贴着脸缘的一小块读到 4.3，放大看是干净的皮肤）
    U &= ~EARC                                                           # 耳朵是画出来的东西（里面有粉色的耳廓），不是残影；外眼角的睫毛尖正好盖到耳朵上
    return (round(float(hp[U].max()), 2), round(float(np.percentile(hp[U], 99)), 2), int(U.sum())) if U.any() else (0, 0, 0)
TESTS = [('眉 上移 12', ['browL', 'browR'], 0, -12), ('眉 下移 12', ['browL', 'browR'], 0, 12), ('眉 左移 20', ['browL', 'browR'], -20, 0), ('眉 右移 20', ['browL', 'browR'], 20, 0),
         ('眼 左移 15', EYE('L') + EYE('R'), -15, 0), ('眼 右移 15', EYE('L') + EYE('R'), 15, 0), ('嘴 上移 8', ['mouth_closed'], 0, -8), ('嘴 下移 8', ['mouth_closed'], 0, 8)]
res['shift_tests'] = []
tiles = []
for label, names, dx, dy in TESTS:
    go = ghost('parts', names, dx, dy, 'parts'); gn = ghost('face', names, dx, dy, 'face')
    res['shift_tests'].append({'test': label, 'old_face_max_dE': go[0], 'old_face_p99_dE': go[1], 'new_face_max_dE': gn[0], 'new_face_p99_dE': gn[1], 'uncovered_px': gn[2]})
    sh = {n: (dx, dy) for n in names}
    a = compose('parts', 'parts', sh, with_hair=False); b = compose('face', 'face', sh, with_hair=False)
    box = (slice(600, 1160), slice(230, 1150)) if not label.startswith('嘴') else (slice(900, 1220), slice(380, 1000))
    def boost(im):          # 右半边再放一张对比度 ×6 的，残影看得更清楚
        f_ = im.astype(np.float32); return np.clip(128 + (f_ - cv2.GaussianBlur(f_, (0, 0), 20)) * 6, 0, 255).astype(np.uint8)
    t = np.hstack([cv2.resize(x[box], (460, 280)) for x in (a, boost(a), b, boost(b))])
    tiles.append((label, go, gn, t))
# ---------- c) 三种底色
edge = {}
def skin_frac(name, d):
    im = rd(DIR(d, name + '.png')); a = im[..., 3]; band = (a > 12) & (a < 242)
    b, g, r = [im[..., i].astype(int) for i in range(3)]; sk = (r > 200) & (g > 150) & (r > g + 8)
    core = a >= 242; return round(float((band & sk).sum() / max(1, band.sum()) * 100), 1), int((core & sk).sum())
names = [p['id'] for p in FJ['parts'] if p['id'] not in ('face', 'blush')]
for n in names: edge[n] = {'old_edge_skin_pct': skin_frac(n, 'parts')[0], 'new_edge_skin_pct': skin_frac(n, 'face')[0]}
res['edge_skin'] = {'what': '半透明边缘里像皮肤的浅色像素占比（%）。鼻子本身就是肤色系，不算毛病。', 'parts': edge}
json.dump(res, open(WK('face/verify.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------- 拼总图
from PIL import Image, ImageDraw, ImageFont
F = '/Library/Fonts/Arial Unicode.ttf'; f28 = ImageFont.truetype(F, 28); f22 = ImageFont.truetype(F, 22)
def title(w, text, h=46):
    im = Image.new('RGB', (w, h), (255, 255, 255)); ImageDraw.Draw(im).text((12, 6), text, fill=(20, 39, 74), font=f28); return np.array(im)[..., ::-1]
Wd = 1840
# 爆炸图：每个部件按原位置的 1.0 倍放，再按「离脸中心的方向」推开
ex = np.zeros((1100, Wd, 4), np.float32); ex[..., :3] = (94, 58, 36)
def put(im, x, y):
    h, w = im.shape[:2]; x, y = int(x), int(y); xs, ys = max(0, x), max(0, y); xe, ye = min(Wd, x + w), min(1100, y + h)
    if xe <= xs or ye <= ys: return
    src = im[ys - y:ye - y, xs - x:xe - x].astype(np.float32); a = src[..., 3:4] / 255; ex[ys:ye, xs:xe, :3] = ex[ys:ye, xs:xe, :3] * (1 - a) + src[..., :3] * a
k = 0.62
def sc(im): return cv2.resize(im, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
put(sc(rd(SRC('face/face.png'))), 40, 260); put(sc(rd(SRC('face/face_noblush.png'))), 640, 260); put(sc(rd(SRC('face/blush.png'))), 740, 880)
x, y = 1250, 30
for n in ['browL', 'browR', 'lashL', 'lashR', 'eyeWhiteL', 'eyeWhiteR', 'irisL', 'irisR', 'eyeHlL', 'eyeHlR', 'eyeLowL', 'eyeLowR', 'nose', 'mouth_closed', 'mouth_small', 'mouth_big', 'mouth_smile']:
    im = rd(SRC('face', n + '.png')); put(im, x, y)
    if n.endswith('L') and n[:-1] + 'R' in FP: x += 300
    else: x = 1250; y += im.shape[0] + 14
exi = Image.fromarray(ex[..., :3].astype(np.uint8)[..., ::-1]); d = ImageDraw.Draw(exi)
for t, xy in [('face.png（带腮红）', (40, 220)), ('face_noblush.png', (640, 220)), ('blush.png', (740, 846)), ('五官各层（左列 L，右列 R）', (1250, 2))]: d.text(xy, t, fill=(255, 255, 255), font=f22)
rows = [title(Wd, '① 爆炸图：新的脸底和各部件（深藏青底）'), np.array(exi)[..., ::-1]]
# 叠回对比
c0 = (slice(250, 1300), slice(170, 1210)); hm = np.clip(dnew * 8, 0, 255).astype(np.uint8); hm = cv2.applyColorMap(hm, cv2.COLORMAP_INFERNO)
rc = np.hstack([cv2.resize(x[c0], (460, 464)) for x in (M, old, new, hm)])
rows += [title(Wd, f"② 叠回对比：母版 | 旧部件 | 新部件 | 新部件与母版的色差（越亮越大）  脸底范围内平均 ΔE：旧 {res['recompose_vs_master']['old_parts']['mean_dE']}，新 {res['recompose_vs_master']['new_parts']['mean_dE']}"), rc]
rows.append(title(Wd, '③ 错位测试（不叠头发）：旧脸底 | 旧脸底·对比度×6 | 新脸底 | 新脸底·对比度×6。数字是露出来的那块脸底上的残影（Lab 色差：最大 / 99 分位）'))
for label, go, gn, t in tiles:
    rows.append(title(Wd, f'{label}    旧 {go[0]} / {go[1]}    新 {gn[0]} / {gn[1]}', 40)); rows.append(t)
# 三种底色
bgs = [(255, 0, 255), (94, 58, 36), (255, 255, 255)]
strip = []
for n in names:
    im = rd(SRC('face', n + '.png')).astype(np.float32); a = im[..., 3:4] / 255
    t = np.hstack([(im[..., :3] * a + np.array(b_, np.float32) * (1 - a)).astype(np.uint8) for b_ in bgs]); kk = min(1.0, 250 / t.shape[0]); strip.append(cv2.resize(t, None, fx=kk, fy=kk))
line_, lines, wcur = [], [], 0
for t in strip:
    if wcur + t.shape[1] + 10 > Wd: lines.append(line_); line_, wcur = [], 0
    line_.append(t); wcur += t.shape[1] + 10
lines.append(line_)
rows.append(title(Wd, '④ 每个部件叠在品红 / 深藏青 / 白上（新部件）'))
for ln in lines:
    h = max(t.shape[0] for t in ln); r = np.full((h + 10, Wd, 3), 200, np.uint8); x = 0
    for t in ln: r[5:5 + t.shape[0], x:x + t.shape[1]] = t; x += t.shape[1] + 10
    rows.append(r)
rows = [np.hstack([r, np.full((r.shape[0], Wd - r.shape[1], 3), 255, np.uint8)]) if r.shape[1] < Wd else r for r in rows]
cv2.imwrite(WK('out/wip-face-parts-sheet.png'), np.vstack(rows))
print(json.dumps(res['recompose_vs_master'], ensure_ascii=False)); [print(t) for t in res['shift_tests']]; print({k: v for k, v in edge.items()})
