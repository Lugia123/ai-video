"""#945 v4-01 漫画页的新关键画 → 分层。  python3 episodes/cast-cyber-girl/closeup/v401comic/make_layers.py
raw/bg-bedroom.png   卧室背景（千问文生图）：墙上三张带别的人物脸的海报 + 相框换成我画的无人物海报（画面里只有她一个人）
raw/hands-phone.png  双手捧手机特写（屏幕纯绿）：白底抠掉；绿屏抠成透明（下面垫 ui2d 聊天界面，拇指仍盖在屏幕上）
→ layers/bg-bedroom.png、layers/hands-phone.png、layers.json（屏幕 bbox）"""
import json, pathlib
import numpy as np, cv2
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
D = pathlib.Path(__file__).parent; OUT = D / 'layers'; OUT.mkdir(exist_ok=True)

# ---- 背景：盖掉带脸的海报（坐标按 1664×928 原图量的）
bg = Image.open(D / 'raw' / 'bg-bedroom.png').convert('RGB'); d = ImageDraw.Draw(bg)
def poster(box, kind):
    x0, y0, x1, y1 = box; d.rectangle(box, fill=['#1d2a5a', '#ffd35c', '#8ff5dc'][kind], outline='#16121c', width=5)
    cx, cy, r = (x0 + x1) / 2, (y0 + y1) / 2, min(x1 - x0, y1 - y0) * 0.28
    if kind == 0: d.ellipse([cx - r, cy - r * 1.4, cx + r, cy + r * 0.6], fill='#ffe6a8'); d.rectangle([x0 + 5, y1 - (y1 - y0) * 0.25, x1 - 5, y1 - 5], fill='#ff7eb6')
    elif kind == 1: d.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#ff5ea8'); d.rectangle([x0 + (x1 - x0) * 0.15, y1 - (y1 - y0) * 0.2, x1 - (x1 - x0) * 0.15, y1 - (y1 - y0) * 0.14], fill='#2a1f4a')
    else: d.polygon([(cx, cy + r), (cx - r * 1.3, cy - r * 0.3), (cx - r * 0.5, cy - r), (cx, cy - r * 0.4), (cx + r * 0.5, cy - r), (cx + r * 1.3, cy - r * 0.3)], fill='#ff5ea8')
    # 夜里：和墙一样压暗偏冷
for box, k in [((0, 40, 215, 440), 0), ((325, 0, 465, 225), 1), ((640, 140, 770, 355), 2), ((1490, 70, 1664, 385), 1)]: poster(box, k)
arr = np.asarray(bg).astype(float)
mask = np.zeros(arr.shape[:2], bool)
for (x0, y0, x1, y1), _ in [((0, 40, 215, 440), 0), ((325, 0, 465, 225), 1), ((640, 140, 770, 355), 2), ((1490, 70, 1664, 385), 1)]: mask[y0:y1, x0:x1] = True
arr[mask] = arr[mask] * np.array([0.55, 0.55, 0.75])                  # 新海报压暗成夜色
Image.fromarray(arr.clip(0, 255).astype(np.uint8)).save(OUT / 'bg-bedroom.png')

# ---- 手 + 手机：白底 → 透明（四边泛洪）；绿屏 → 透明
img = cv2.cvtColor(cv2.imread(str(D / 'raw' / 'hands-phone.png')), cv2.COLOR_BGR2RGB)
nearw = (255 - img.astype(int)).max(axis=2) < 26
lab, n = ndi.label(nearw); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ~np.isin(lab, list(border)); fg = ndi.binary_fill_holes(fg)
r, g, b = [img[..., i].astype(int) for i in range(3)]
green = (g > 150) & (r < 140) & (b < 140)
green = ndi.binary_opening(green, iterations=2)
glab, gn = ndi.label(green); sizes = ndi.sum(green, glab, range(1, gn + 1)); scr = glab == (np.argmax(sizes) + 1)
scr_d = ndi.binary_dilation(scr, iterations=2)
a = np.where(fg & ~scr_d, 255, 0).astype(np.uint8); a = cv2.GaussianBlur(a, (3, 3), 0)
# 图边渐隐（袖子被原图底边截断的地方）
h, w = a.shape; ry = np.minimum(np.arange(h), np.arange(h)[::-1]) / 40.0; rx = np.minimum(np.arange(w), np.arange(w)[::-1]) / 40.0
a = (a * np.clip(np.minimum(ry[:, None], rx[None, :]), 0, 1)).astype(np.uint8)
cv2.imwrite(str(OUT / 'hands-phone.png'), cv2.cvtColor(np.dstack([img, a]), cv2.COLOR_RGBA2BGRA))
ys, xs = np.nonzero(scr)
meta = {'hands-phone': {'size': [w, h], 'screen': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}, 'bg-bedroom': {'size': list(bg.size)}}
json.dump(meta, open(OUT / 'layers.json', 'w'), indent=1); print(meta)

# ---- 反应特写：face2d（W1 #942 头部包）z0 的情绪整张（白底）→ 抠图；惊讶 = z0 分层（睁眼 + 口型 o）叠一张
FD = D.parents[2] / 'mv-pdoom' / 'kits' / 'face2d' / 'z0'
def key(img, tol=26):
    nearw = (255 - img.astype(int)).max(axis=2) < tol
    lab, n = ndi.label(nearw); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    return cv2.GaussianBlur((fg * 255).astype(np.uint8), (3, 3), 0)
for name in ['happy', 'fear']:
    im = cv2.cvtColor(cv2.imread(str(FD / 'expr' / f'{name}.png')), cv2.COLOR_BGR2RGB)
    cv2.imwrite(str(OUT / f'face-{name}.png'), cv2.cvtColor(np.dstack([im, key(im)]), cv2.COLOR_RGBA2BGRA))
base = Image.new('RGBA', (832, 1248), (0, 0, 0, 0))
for p in ['00-back.png', '01-face.png', '02-brows.png', 'eyes/open.png', 'mouth/o.png', '03-front.png']:
    base.alpha_composite(Image.open(FD / p).convert('RGBA'))
base.save(OUT / 'face-surprised.png')
print('faces ok')
