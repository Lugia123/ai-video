#!/usr/bin/env python3
"""多角度五官（#936）：千问按角度参考图生成的一组立绘 → 分层贴花。
python3 tools/face-bake/decals_yaw.py p10
读 episodes/cast-cyber-girl/closeup/yaw/<组>/{base,a,o,closed,...}.png 和同目录 landmarks.json（base 上的瞳孔、嘴中心、各块椭圆，人工 / 半自动标定），
  ① 每张状态图用 ORB 特征 + 相似变换配准到 base（配准时遮掉被编辑的区域：改嘴的遮嘴、改眼的遮眼），
  ② 按 decals.py 同样的「肤色 → 透明」+ 椭圆遮罩 + 封闭轮廓填实，抠出 左眼 / 右眼 / 嘴（眉毛被刘海盖住，暂用正面化那套的眉毛），
输出 episodes/mv-pdoom/kits/face-decals-yaw/<组>/<块>-<状态>.png + decals.json（格式同 face-decals，另带 yaw、瞳孔、嘴锚点）。
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
G = sys.argv[1] if len(sys.argv) > 1 else 'p10'
SRC = os.path.join(ROOT, 'episodes/cast-cyber-girl/closeup/yaw', G)
OUT = os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals-yaw', G)
os.makedirs(OUT, exist_ok=True)
L = json.load(open(os.path.join(SRC, 'landmarks.json')))
# 没有手标的 parts / skinAt 时，从 fit2d 关键点自动推：眼 = 两眼角中点、半宽 = 眼角距一半 × 1.25；嘴 = 两嘴角中点，半宽 = 嘴宽一半 × 1.6；锚点 = 瞳孔 / 嘴角中点
F2 = L.get('fit2d', {})
if F2 and (not L.get('parts') or L.get('autoParts')):
    import math
    def eye(o, i, p):
        cx, cy = (o[0] + i[0]) / 2, (o[1] + i[1]) / 2; w = math.dist(o, i) / 2 * 1.25 + 6
        return {'ellipse': [cx, cy - 2, w, max(26, w * 0.72)], 'anchor': p}
    ER, EL = eye(F2['eyeOutR_img'], F2['eyeInR_img'], F2['pupilR_img']), eye(F2['eyeInL_img'], F2['eyeOutL_img'], F2['pupilL_img'])
    mr, ml = F2['mouthR_img'], F2['mouthL_img']; mw = math.dist(mr, ml) / 2
    mc = [(mr[0] + ml[0]) / 2, (mr[1] + ml[1]) / 2]
    top, bot = mc[1] - mw * 0.75, min(mc[1] + mw * 2.2, F2['chinTip'][1] - 16) if 'chinTip' in F2 else mc[1] + mw * 1.9   # 嘴框底边不越过下巴
    L['parts'] = {'eyeL': ER, 'eyeR': EL, 'mouth': {'ellipse': [mc[0], (top + bot) / 2, mw * 1.95, (bot - top) / 2], 'anchor': mc}}
    # 肤色取样：鼻尖和近侧嘴角连线往脸颊外 25 px
    L['skinAt'] = [int((F2['pupilR_img'][0] + F2['pupilL_img'][0]) / 2), int(F2['pupilR_img'][1] + 60), 6]
    L['autoParts'] = True; L['pupils'] = [F2['pupilR_img'], F2['pupilL_img']]
    L['yaw'] = L.get('fit', {}).get('yaw', L.get('yaw', 0))
EDIT = {'a': 'mouth', 'o': 'mouth', 'i': 'mouth', 'u': 'mouth', 'e': 'mouth', 'smileup': 'mouth', 'smile': 'mouth', 'closed': 'eyes', 'half': 'eyes'}
RENAME = {'smile': 'smileup'}   # 千问的「嘴角上扬闭口笑」= girl.js 的 smileup
FILL = {'base', 'a', 'o', 'i', 'u', 'e', 'half'}   # base 只对眼生效（嘴的 base = rest 闭口）
FEATHER = 0.18

def load(n): return np.array(Image.open(os.path.join(SRC, n + '.png')).convert('RGB'))

def register(img, base, masked):
    """相似变换把 img 配准到 base；masked = 不参与配准的椭圆（被编辑的区域）"""
    g1, g0 = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY), cv2.cvtColor(base, cv2.COLOR_RGB2GRAY)
    m = np.zeros(g0.shape, np.uint8); x0, y0, x1, y1 = L['regBox']; m[y0:y1, x0:x1] = 255
    for (cx, cy, rx, ry) in masked: cv2.ellipse(m, (int(cx), int(cy)), (int(rx * 1.4), int(ry * 1.6)), 0, 0, 360, 0, -1)
    orb = cv2.ORB_create(4000)
    k0, d0 = orb.detectAndCompute(g0, m); k1, d1 = orb.detectAndCompute(g1, m)
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    ms = sorted(bf.match(d1, d0), key=lambda x: x.distance)[:600]
    p1 = np.float32([k1[x.queryIdx].pt for x in ms]); p0 = np.float32([k0[x.trainIdx].pt for x in ms])
    M, inl = cv2.estimateAffinePartial2D(p1, p0, method=cv2.RANSAC, ransacReprojThreshold=2.0)
    s = float(np.hypot(M[0, 0], M[1, 0])); r = float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
    out = cv2.warpAffine(img, M, (base.shape[1], base.shape[0]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return out, {'scale': round(s, 4), 'rot': round(r, 2), 'tx': round(float(M[0, 2]), 1), 'ty': round(float(M[1, 2]), 1), 'inliers': int(inl.sum())}

def color_to_alpha(rgb, s):
    up = np.where(rgb > s, (rgb - s) / np.maximum(1 - s, 1e-6), (s - rgb) / np.maximum(s, 1e-6))
    a = np.clip((up.max(-1) - 0.06) / 0.94, 0, 1)
    col = np.clip((rgb - s) / np.maximum(a, 1e-4)[..., None] + s, 0, 1)
    return col, a

def ring_skin(img, part):
    # 椭圆外圈（1.05–1.35 倍）里像皮肤的像素的中位数：每块自己的局部肤色（腮红、阴影会让全局肤色不准，抠完留碎点）
    cx, cy, rx, ry = L['parts'][part]['ellipse']
    x0, y0, x1, y1 = int(cx - rx * 1.4), int(cy - ry * 1.4), int(cx + rx * 1.4), int(cy + ry * 1.4)
    yy, xx = np.mgrid[y0:y1, x0:x1]; d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    px = img[y0:y1, x0:x1].astype(float)[(d > 1.05) & (d < 1.35)]
    R, G_, B = px[:, 0], px[:, 1], px[:, 2]
    ok = (R > 200) & (R >= G_) & (G_ >= B) & (R - B > 15) & (R - B < 90)
    return np.median(px[ok], 0) / 255 if ok.sum() > 30 else None

def cut(img, part, st, skin):
    sk = ring_skin(img, part)
    if sk is not None: skin = sk
    cx, cy, rx, ry = L['parts'][part]['ellipse']
    x0, y0, x1, y1 = int(cx - rx - 2), int(cy - ry - 2), int(cx + rx + 2), int(cy + ry + 2)
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    mask = np.clip((1 - d) / FEATHER, 0, 1)
    # 下颌 / 下巴轮廓线（fit2d 的 jawR → chinTip → jawL 折线）附近 10 px 一律去掉：侧脸时下颌线会进到嘴框里
    F2 = L.get('fit2d', {})
    if 'chinTip' in F2 and F2.get('jawR_img'):
        poly = np.array(F2['jawR_img'] + [F2['chinTip']] + F2['jawL_img'][::-1], float)
        P = np.stack([xx, yy], -1).astype(float); dmin = np.full(xx.shape, 1e9)
        for a_, b_ in zip(poly[:-1], poly[1:]):
            ab = b_ - a_; t = np.clip(((P - a_) @ ab) / (ab @ ab), 0, 1); dmin = np.minimum(dmin, np.linalg.norm(a_ + t[..., None] * ab - P, axis=-1))
        mask *= np.clip((dmin - 10) / 6, 0, 1)
    for (ex, ey, erx, ery) in L['parts'][part].get('cut', []):
        mask *= np.clip((np.sqrt(((xx - ex) / erx) ** 2 + ((yy - ey) / ery) ** 2) - 0.7) / 0.3, 0, 1)
    rgb = img[y0:y1, x0:x1].astype(float) / 255
    col, a = color_to_alpha(rgb, skin)
    a = a * mask
    lab, n = ndimage.label(a > 0.12)
    if n:
        area = ndimage.sum(np.ones_like(a), lab, range(1, n + 1)); a[np.isin(lab, 1 + np.where(area < 40)[0])] = 0
        # 最大那块之外、平均不透明度低的块（腮红 / 阴影残迹）也去掉
        big = 1 + int(np.argmax(area)); mean_a = ndimage.mean(a, lab, range(1, n + 1))
        for j in range(n):
            if j + 1 != big and mean_a[j] < 0.45 and area[j] < 0.25 * area[big - 1]: a[lab == j + 1] = 0
    a[a < 0.12] *= np.clip(a[a < 0.12] / 0.12, 0, 1)
    solid = ndimage.binary_closing(a > 0.25, iterations=2); lab, n = ndimage.label(solid)
    holes = np.zeros_like(solid)
    if n and st in FILL:
        big = 1 + int(np.argmax(ndimage.sum(np.ones_like(a), lab, range(1, n + 1))))
        holes = ndimage.binary_fill_holes(lab == big) & (mask > 0.5) & ~(np.abs(rgb - skin).max(-1) < 0.07)   # 轮廓里接近肤色的（眼影、眼皮）不填
    lighter = (rgb >= skin - 0.02).all(-1) | ((rgb - skin).max(-1) > 0.03) & ((rgb - skin).min(-1) > -0.08)
    a = np.where(lighter & ~holes, 0, a)
    col = np.where(holes[..., None], rgb, col); a = np.where(holes, 1.0, a)
    return np.dstack([col, a]), (x0, y0, x1 - x0, y1 - y0)

base = load('base')
sx, sy, sr = L['skinAt']; skin = base[sy - sr:sy + sr, sx - sr:sx + sr].reshape(-1, 3).mean(0) / 255
meta = {'group': G, 'yaw': L['yaw'], 'skin': (skin * 255).round().tolist(), 'pupils': L['pupils'], 'parts': {}, 'registration': {}}
states = [f[:-4] for f in sorted(os.listdir(SRC)) if f.endswith('.png') and f[:-4] in ({'base'} | set(EDIT))]
for st in states:
    img = load(st)
    if st != 'base':
        ed = EDIT[st]
        masked = [L['parts']['mouth']['ellipse']] if ed == 'mouth' else [L['parts']['eyeL']['ellipse'], L['parts']['eyeR']['ellipse']]
        img, info = register(img, base, masked); meta['registration'][st] = info
        Image.fromarray(img).save(os.path.join(OUT, f'_reg-{st}.jpg'), quality=90)
    # 哪些块取自这张：base → 全部；改嘴的 → 嘴；改眼的 → 两眼
    parts = ['eyeL', 'eyeR', 'mouth'] if st == 'base' else (['mouth'] if EDIT[st] == 'mouth' else ['eyeL', 'eyeR'])
    for part in parts:
        name = {'base': 'rest' if part == 'mouth' else 'open'}.get(st, RENAME.get(st, st))
        rgba, box = cut(img, part, ('rest' if part == 'mouth' else 'base') if st == 'base' else st, skin)
        fn = f'{part}-{name}.png'
        Image.fromarray((rgba * 255).round().astype(np.uint8), 'RGBA').save(os.path.join(OUT, fn))
        P = meta['parts'].setdefault(part, {'x': box[0], 'y': box[1], 'w': box[2], 'h': box[3], 'anchor': L['parts'][part]['anchor'], 'states': {}})
        a = rgba[..., 3]; rows = np.where((a > 0.5).sum(1) > 3)[0]
        P['states'][name] = {'file': fn, 'top': int(box[1] + rows[0]) if len(rows) else box[1], 'bottom': int(box[1] + rows[-1]) if len(rows) else box[1]}
json.dump(meta, open(os.path.join(OUT, 'decals.json'), 'w'), ensure_ascii=False, indent=1)
print('ok', G, {k: list(v['states']) for k, v in meta['parts'].items()}, meta['registration'])
