"""#941 文字洪水段的 2D 关键画 → 抠白底。  python3 episodes/cast-cyber-girl/closeup/flood/make_layers.py
raw/t1-typing（趴着打字）/ t2-lookup（抬头惊）/ t3-drown（淹到胸口挣扎）/ t4-hand（只剩一只手）→ layers/key-*.png + layers.json（bbox、底边）
t1 原图底下有一块灰床单：泛洪容差放大把它一起抠掉（放进房间后下沿由 3D 被子 / 文字海挡住）。"""
import json, pathlib, sys
import numpy as np, cv2
from scipy import ndimage as ndi
D = pathlib.Path(__file__).parent

def key_white(img, tol=26):
    """同 sydney/make_layers.py：四边泛洪的近白背景 → 透明，只留大块前景。"""
    nearw = (255 - img.astype(int)).max(axis=2) < tol
    lab, n = ndi.label(nearw)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(border))
    fl, fn = ndi.label(fg)
    if fn > 1:
        sizes = ndi.sum(fg, fl, range(1, fn + 1))
        fg = np.isin(fl, [i + 1 for i, s in enumerate(sizes) if s >= 0.03 * sizes.max()])
    fg = ndi.binary_fill_holes(fg)
    return cv2.GaussianBlur((fg * 255).astype(np.uint8), (3, 3), 0)

OUT = D / 'layers'; OUT.mkdir(exist_ok=True)
meta = {}
load = lambda n: cv2.cvtColor(cv2.imread(str(D / 'raw' / f'{n}.png')), cv2.COLOR_BGR2RGB)
a2 = key_white(load('t2-lookup'), tol=30)
for name, tol in [('t1-typing', 30), ('t2-lookup', 30), ('t3-drown', 30), ('t4-hand', 30)]:
    img = load(name)
    a = key_white(img, tol=tol)
    if name == 't1-typing':   # 床单：下半部分只留 t2（同构图、已无床单）轮廓以内的
        lim = cv2.dilate(a2, np.ones((25, 25), np.uint8)); a[520:] = np.minimum(a[520:], lim[520:])
    if name == 't4-hand': a[745:] = 0   # 底边那条线
    cv2.imwrite(str(OUT / f'key-{name}.png'), cv2.cvtColor(np.dstack([img, a]), cv2.COLOR_RGBA2BGRA))
    ys, xs = np.nonzero(a > 128)
    meta[name] = {'size': [img.shape[1], img.shape[0]], 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}
json.dump(meta, open(OUT / 'layers.json', 'w'), indent=1)
print(json.dumps(meta))
