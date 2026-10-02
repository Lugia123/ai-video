#!/usr/bin/env python3
"""2D 近景分层 → 独立五官贴花（#931）。
python3 tools/face-bake/decals.py
读 episodes/cast-cyber-girl/closeup/layers/{02-head, eyes/*, mouth/*}.png，
按「肤色 → 透明」（GIMP color-to-alpha）把皮肤抠掉，再用每块五官自己的椭圆遮罩去掉刘海发丝、鼻线、下巴线，
输出 episodes/mv-pdoom/kits/face-decals/<块>-<状态>.png（直通 alpha，裁到遮罩框）+ decals.json（每块在立绘画布里的左上角、锚点）。
"""
import json, os
import numpy as np
from scipy import ndimage
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
SRC = os.path.join(ROOT, 'episodes/cast-cyber-girl/closeup/layers')
OUT = os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals')
SKIN = np.array([253, 227, 201], float) / 255      # 立绘额头肤色（02-head 额头均值）
# 块：来源图层、椭圆遮罩（中心、半径，立绘像素）、锚点（贴到 3D 上时对齐的点）
PARTS = {
  'eyeL':  dict(layers=['eyes/' + s for s in ['open', 'closed', 'half', 'wink', 'smile', 'surprised']], c=(311, 420), r=(58, 42), anchor=(319, 422), cut=[(281, 387, 7, 15), (287, 393, 6, 11)], fill={'wink'}),
  'eyeR':  dict(layers=['eyes/' + s for s in ['open', 'closed', 'half', 'wink', 'smile', 'surprised']], c=(505, 418), r=(60, 42), anchor=(499, 415), cut=[(522, 381, 15, 10)]),
  'browL': dict(layers=['02-head'], c=(300, 366), r=(58, 17), anchor=(319, 422)),
  'browR': dict(layers=['02-head'], c=(512, 361), r=(58, 17), anchor=(499, 415)),
  'mouth': dict(layers=['mouth/' + s for s in ['rest', 'a', 'i', 'u', 'e', 'o', 'smile', 'surprised']], c=(415, 583), r=(74, 58), anchor=None, cutOnly={'u': [(449, 544, 12, 9)]}),
}
FEATHER = 0.18
FILL = {'open', 'half', 'surprised', 'a', 'e', 'i', 'o', 'u', 'smile'}   # 有封闭轮廓（眼白 / 口腔）的状态   # 遮罩边缘羽化（占半径的比例）

def color_to_alpha(rgb, s):
    up = np.where(rgb > s, (rgb - s) / np.maximum(1 - s, 1e-6), (s - rgb) / np.maximum(s, 1e-6))
    a = up.max(-1)
    a = np.clip((a - 0.06) / 0.94, 0, 1)            # 去掉肤色上的轻微噪点
    safe = np.maximum(a, 1e-4)[..., None]
    col = np.clip((rgb - s) / safe + s, 0, 1)
    return col, a

meta = {'skin': (SKIN * 255).round().tolist(), 'parts': {}}
for name, P in PARTS.items():
    (cx, cy), (rx, ry) = P['c'], P['r']
    x0, y0, x1, y1 = cx - rx - 2, cy - ry - 2, cx + rx + 2, cy + ry + 2
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    mask = np.clip((1 - d) / FEATHER, 0, 1)
    for (ex, ey, erx, ery) in P.get('cut', []):   # 刘海发丝尖（落在眼睛框里的）
        mask *= np.clip((np.sqrt(((xx - ex) / erx) ** 2 + ((yy - ey) / ery) ** 2) - 0.7) / 0.3, 0, 1)
    states = {}
    mask0 = mask
    for lay in P['layers']:
        mask = mask0.copy()
        for (ex, ey, erx, ery) in P.get('cutOnly', {}).get(lay.split('/')[-1], []):   # 只对某个状态的噪点块
            mask *= np.clip((np.sqrt(((xx - ex) / erx) ** 2 + ((yy - ey) / ery) ** 2) - 0.7) / 0.3, 0, 1)
        im = np.array(Image.open(os.path.join(SRC, lay + '.png')).convert('RGBA'), float)[y0:y1, x0:x1] / 255
        col, a = color_to_alpha(im[..., :3], SKIN)
        a = a * im[..., 3] * mask
        # 小碎点（分层底图的噪点）去掉：不透明连通块面积 < 40 px 的清零
        lab, n = ndimage.label(a > 0.12)
        if n:
            area = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
            small = np.isin(lab, 1 + np.where(area < 40)[0])
            a[small] = 0
        a[a < 0.12] *= np.clip(a[a < 0.12] / 0.12, 0, 1)
        # 封闭轮廓里面（眼白 / 虹膜 / 口腔）全不透明：底色和立绘肤色不同也不会透出来
        st0 = lay.split('/')[-1]
        solid = ndimage.binary_closing(a > 0.25, iterations=2)
        lab, n = ndimage.label(solid)
        if n and (st0 in FILL or st0 in P.get('fill', ())):   # 只填最大那块（眼眶 / 嘴）的内部；闭眼、微笑眼、闭嘴不填（线和线之间本来就是皮肤）
            big = 1 + int(np.argmax(ndimage.sum(np.ones_like(a), lab, range(1, n + 1))))
            holes = ndimage.binary_fill_holes(lab == big) & (mask > 0.5)   # 整个轮廓内部（含深色口腔、虹膜）不透明，用立绘原色
        else: holes = np.zeros_like(solid)
        # 轮廓外面比肤色亮的残迹（闭眼图层上眼睑的高光线、腮红边）去掉：只有封闭轮廓里（眼白 / 牙）才允许比皮肤亮
        lighter = (im[..., :3] >= SKIN - 0.02).all(-1) | ((im[..., :3] - SKIN).max(-1) > 0.03) & ((im[..., :3] - SKIN).min(-1) > -0.08)
        a = np.where(lighter & ~holes, 0, a)
        col = np.where(holes[..., None], im[..., :3], col)
        a = np.where(holes, np.maximum(a, 1.0), a)
        out = np.dstack([col, a])
        st = lay.split('/')[-1]
        if name == 'mouth':   # 嘴：量上唇线（最上面一行有明显不透明的像素）给「张嘴向下扩」对齐用
            rows = np.where((a > 0.5).sum(1) > 3)[0]
            states[st] = {'top': int(y0 + rows[0]) if len(rows) else cy, 'bottom': int(y0 + rows[-1]) if len(rows) else cy}
        else: states[st] = {}
        fn = f'{name}-{st}.png'
        Image.fromarray((out * 255).round().astype(np.uint8), 'RGBA').save(os.path.join(OUT, fn))
        states[st]['file'] = fn
    meta['parts'][name] = {'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0, 'anchor': P['anchor'], 'states': states}
# 闭口笑（嘴角明显上扬）：把 rest 嘴按 (x - 中心)² 往上弯，嘴角抬 SMILE_UP px
SMILE_UP = 17
mp = meta['parts']['mouth']
rest = np.array(Image.open(os.path.join(OUT, mp['states']['rest']['file'])), float)
H_, W_ = rest.shape[:2]; cx = 416 - mp['x']; half = 56
yy, xx = np.mgrid[0:H_, 0:W_].astype(float)
lift = SMILE_UP * np.clip(np.abs(xx - cx) / half, 0, 1.2) ** 2
warped = np.stack([ndimage.map_coordinates(rest[..., c], [yy + lift, xx], order=1, mode='constant') for c in range(4)], -1)
Image.fromarray(np.clip(warped, 0, 255).round().astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'mouth-smileup.png'))
mp['states']['smileup'] = {**mp['states']['rest'], 'file': 'mouth-smileup.png', 'top': mp['states']['rest']['top'] - SMILE_UP}
json.dump(meta, open(os.path.join(OUT, 'decals.json'), 'w'), ensure_ascii=False, indent=1)
print('ok', {k: list(v['states']) for k, v in meta['parts'].items()})

# ============================================================ 正面化五官（#935 方案 B）
# 立绘本身是朝她的右侧（画面左）转约 4°、逆时针歪约 2.5° 的角度。这里做一套真正正面的贴花，输出到 face-decals-front/（同样的裁框和锚点）：
#   ① 所有块绕自己的锚点转回 ROLL（眼 / 眉绕瞳孔，嘴绕上唇线锚点）；② 两眼按宽度平均缩放成等大（远侧眼放宽、近侧眼收窄）；
#   ③ 嘴按竖直中线取画面右半（近侧、画得完整）镜像成左右对称，并把中线移到锚点 x（= 两眼中点在 3D 上对应的位置）。
FRONT = os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals-front')
os.makedirs(FRONT, exist_ok=True)
ROLL = float(np.degrees(np.arctan2(414.68 - 422.82, 504.05 - 320.11)))   # ≈ −2.5°（图像坐标 y 向下：右眼更高）
EYE_W = {'eyeL': 88, 'eyeR': 94}; EYE_T = (EYE_W['eyeL'] + EYE_W['eyeR']) / 2
PUPIL = {'eyeL': (320.1, 422.8), 'eyeR': (504.1, 414.7)}
def affine(im, cx, cy, ang_deg, sx=1.0):
    # 先绕 (cx, cy) 水平缩放 sx，再旋转 ang（使内容顺时针转 |ROLL|，把逆时针的歪转正）；PIL 的 transform 要的是输出 → 输入的逆矩阵
    a = np.radians(ang_deg); c, s = np.cos(a), np.sin(a)
    # 正向：p' = R · S · (p − c) + c；逆向：p = S⁻¹ · R⁻¹ · (p' − c) + c
    M = np.array([[c / sx, s / sx], [-s, c]])
    off = np.array([cx, cy]) - M @ np.array([cx, cy])
    return im.transform(im.size, Image.AFFINE, (M[0, 0], M[0, 1], off[0], M[1, 0], M[1, 1], off[1]), resample=Image.BICUBIC)
meta_f = json.loads(json.dumps(meta))
for part, P in meta['parts'].items():
    for st, S in P['states'].items():
        im = Image.open(os.path.join(OUT, S['file'])).convert('RGBA')
        if part in ('eyeL', 'eyeR', 'browL', 'browR'):
            eye = 'eyeL' if part.endswith('L') else 'eyeR'
            cx, cy = PUPIL[eye][0] - P['x'], PUPIL[eye][1] - P['y']
            im = affine(im, cx, cy, ROLL, EYE_T / EYE_W[eye] if part.startswith('eye') else 1.0)
        else:   # 嘴
            cx, cy = 416 - P['x'], P['states']['rest']['top'] + 2 - P['y']
            im = affine(im, cx, cy, ROLL)
            arr = np.array(im)
            al = arr[..., 3]; cols = np.where((al > 90).any(0))[0]
            if len(cols):
                mid = (cols[0] + cols[-1]) / 2
                shift = int(round(cx - mid))                       # 中线移到锚点
                arr = np.roll(arr, shift, axis=1)
                c0 = int(round(cx)); W_ = arr.shape[1]
                for x in range(0, c0):                             # 左半 = 右半的镜像
                    xm = 2 * c0 - x
                    arr[:, x] = arr[:, xm] if xm < W_ else 0
                im = Image.fromarray(arr, 'RGBA')
            a2 = np.array(im)[..., 3]; rows = np.where((a2 > 128).sum(1) > 3)[0]
            if len(rows): meta_f['parts'][part]['states'][st]['top'] = int(P['y'] + rows[0]); meta_f['parts'][part]['states'][st]['bottom'] = int(P['y'] + rows[-1])
        im.save(os.path.join(FRONT, S['file']))
meta_f['frontalized'] = {'roll': round(ROLL, 2), 'eyeWidth': EYE_W, 'mouth': 'mirror right half, centred on anchor x'}
json.dump(meta_f, open(os.path.join(FRONT, 'decals.json'), 'w'), ensure_ascii=False, indent=1)
print('front ok, roll', round(ROLL, 2))
