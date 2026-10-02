"""#946 新关键画抠白底。  python3 episodes/cast-cyber-girl/closeup/v401b/make_layers.py
raw/s1-boss（翘腿坐电竞椅发号施令）/ s2-servant（空椅旁端托盘低头）/ f-feed（跪着伸手喂）→ layers/key-*.png + layers.json（前景 bbox、椅子 bbox：黑色椅面像素）"""
import json, pathlib
import numpy as np, cv2
from scipy import ndimage as ndi
D = pathlib.Path(__file__).parent; OUT = D / 'layers'; OUT.mkdir(exist_ok=True)
def key(img, tol=26):
    nearw = (255 - img.astype(int)).max(axis=2) < tol
    lab, n = ndi.label(nearw); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(border)); fl, fn = ndi.label(fg)
    if fn > 1: sizes = ndi.sum(fg, fl, range(1, fn + 1)); fg = np.isin(fl, [i + 1 for i, s in enumerate(sizes) if s >= 0.02 * sizes.max()])
    return cv2.GaussianBlur((ndi.binary_fill_holes(fg) * 255).astype(np.uint8), (3, 3), 0)
meta = {}
for n in ['s1-boss', 's2-servant', 'f-feed']:
    img = cv2.cvtColor(cv2.imread(str(D / 'raw' / f'{n}.png')), cv2.COLOR_BGR2RGB); a = key(img)
    cv2.imwrite(str(OUT / f'key-{n}.png'), cv2.cvtColor(np.dstack([img, a]), cv2.COLOR_RGBA2BGRA))
    ys, xs = np.nonzero(a > 128)
    dark = (img.max(axis=2) < 60) & (a > 128); dark = ndi.binary_opening(dark, iterations=3)
    dy, dx = np.nonzero(dark)
    meta[n] = {'size': [img.shape[1], img.shape[0]], 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
               'chair': [int(np.percentile(dx, 3)), int(np.percentile(dy, 3)), int(np.percentile(dx, 97)), int(np.percentile(dy, 97))] if len(dx) else None}
json.dump(meta, open(OUT / 'layers.json', 'w'), indent=1); print(json.dumps(meta))
