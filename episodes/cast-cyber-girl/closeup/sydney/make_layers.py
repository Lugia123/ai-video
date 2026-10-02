"""Sydney 段 2D 关键画 → 抠图 + 分层（W2 #940）。
   python3 episodes/cast-cyber-girl/closeup/sydney/make_layers.py
raw/ 下是千问生成的原图（832×1248，白底；01 是浅蓝玻璃底，只取它的脸）。输出到 layers/：
  base-full.png   02 整张抠白底（渲染时垫底）；base-body.png 身体层（头、手挖空）
  base-head.png   头 + 头发（领口以上）；base-hand-l.png / base-hand-r.png   两只贴玻璃的手（画面左 / 右）
  face-plead.png / face-strain.png / face-resolve.png   只有五官的一块（羽化椭圆），三张原图同构图，直接叠在 head 上换表情
  key-windup.png / key-punch.png / key-burst.png / key-leap.png   整张关键画抠白底（只留最大连通块，去掉背景速度线）
  layers.json     各层的锚点（掌心、脸中心、拳头中心），动画按它对位
"""
import json, pathlib
import numpy as np, cv2
from scipy import ndimage as ndi

D = pathlib.Path(__file__).parent
RAW, OUT = D / 'raw', D / 'layers'
OUT.mkdir(exist_ok=True)

def load(name):
    return cv2.cvtColor(cv2.imread(str(RAW / name), cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)

def key_white(img, tol=26, keep='largest'):
    """从四边泛洪：接近纯白的连通背景 → 透明。只留最大的前景连通块（去掉孤立的速度线）。"""
    h, w = img.shape[:2]
    nearw = (255 - img.astype(int)).max(axis=2) < tol
    lab, n = ndi.label(nearw)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ~bg
    fl, fn = ndi.label(fg)
    if fn > 1 and keep == 'largest':
        sizes = ndi.sum(fg, fl, range(1, fn + 1))
        big = np.argmax(sizes) + 1
        # 留最大块 + 面积 ≥ 最大块 3% 的块（比如分开的另一只手 / 鞋）
        keepers = [i + 1 for i, s in enumerate(sizes) if s >= 0.03 * sizes.max()]
        fg = np.isin(fl, keepers)
    fg = ndi.binary_fill_holes(fg)
    a = (fg * 255).astype(np.uint8)
    a = cv2.GaussianBlur(a, (3, 3), 0)
    return a

def rgba(img, a):
    return np.dstack([img, a])

def save(name, arr):
    # 贴到图边的部分（手指 / 拳头 / 衣服被原图边截断的地方）在 48 px 内渐隐：任何时候都不会露出一条直直的切边
    arr = arr.copy()
    h, w = arr.shape[:2]
    ry = np.minimum(np.arange(h), np.arange(h)[::-1]) / 48.0
    rx = np.minimum(np.arange(w), np.arange(w)[::-1]) / 48.0
    ramp = np.clip(np.minimum(ry[:, None], rx[None, :]), 0, 1)
    arr[..., 3] = (arr[..., 3] * ramp).astype(np.uint8)
    cv2.imwrite(str(OUT / name), cv2.cvtColor(arr, cv2.COLOR_RGBA2BGRA))

def skin_mask(img):
    r, g, b = [img[..., i].astype(int) for i in range(3)]
    return (r > 205) & (g > 150) & (g < 232) & (b > 115) & (b < 212) & (r - b > 28) & (r >= g)

def hand_mask(img, fg, box):
    x0, y0, x1, y1 = box
    m = np.zeros(fg.shape, bool)
    sk = skin_mask(img) & (fg > 128)
    sub = np.zeros_like(sk); sub[y0:y1, x0:x1] = sk[y0:y1, x0:x1]
    lab, n = ndi.label(sub)
    if n == 0: return m
    sizes = ndi.sum(sub, lab, range(1, n + 1))
    m = lab == (np.argmax(sizes) + 1)
    m = ndi.binary_dilation(m, iterations=6)           # 包进手的黑色轮廓线
    m = ndi.binary_closing(m, iterations=8)
    m = ndi.binary_fill_holes(m) & (fg > 128)
    m[:, :x0] = False; m[:, x1:] = False; m[y1:, :] = False
    return m

base = load('02-strain.png')
fgA = key_white(base)
H, W = fgA.shape
# 手：画面左 / 右两只（02 与 01 / 03 同构图）
hl = hand_mask(base, fgA, (0, 330, 330, 900))
hr = hand_mask(base, fgA, (500, 330, 832, 900))
# 手腕切口：手掩码只取到袖口上沿（袖子留在身体层）
# 头：领口以上（chin 下方领子顶端约 y=600），去掉手
yy = np.arange(H)[:, None].repeat(W, 1)
head = (fgA > 128) & (yy < 610) & ~hl & ~hr
# 头发两侧垂到肩下的部分留在身体层；头层只要 x 在 [150, 690] 的那块（脸 + 发型轮廓）
xx = np.arange(W)[None, :].repeat(H, 0)
head &= (xx > 140) & (xx < 700)
head = ndi.binary_opening(head, iterations=2)
hole = (head | hl | hr)
# 身体层：挖掉头和手（透明）。动画里用 base-full 垫底、头 / 手层叠在上面做小幅动作，就不会露洞
save('base-full.png', rgba(base, fgA))
save('base-body.png', rgba(base, np.where(ndi.binary_dilation(hole, iterations=2), 0, fgA).astype(np.uint8)))
feather = lambda m, k=5: cv2.GaussianBlur((m * 255).astype(np.uint8), (k, k), 0)
save('base-head.png', rgba(base, np.minimum(feather(head, 3), fgA)))
save('base-hand-l.png', rgba(base, np.minimum(feather(hl, 3), fgA)))
save('base-hand-r.png', rgba(base, np.minimum(feather(hr, 3), fgA)))

# 表情：五官区域羽化椭圆（眼、眉、嘴、泪）
FACE_C, FACE_R = (408, 468), (178, 150)
fm = np.zeros((H, W), np.uint8)
cv2.ellipse(fm, FACE_C, FACE_R, 0, 0, 360, 255, -1)
fm = cv2.GaussianBlur(fm, (41, 41), 0)
for src, name in [('01-palms.png', 'plead'), ('02-strain.png', 'strain'), ('03-resolve.png', 'resolve')]:
    save(f'face-{name}.png', rgba(load(src), fm))

# 整张关键画
keys = {}
for src, name in [('04-windup.png', 'windup'), ('06-punch.png', 'punch'), ('07-burst.png', 'burst'), ('08-leap.png', 'leap')]:
    img = load(src)
    a = key_white(img)
    save(f'key-{name}.png', rgba(img, a))
    ys, xs = np.nonzero(a > 128)
    sk = skin_mask(img) & (a > 128)
    sk = ndi.binary_opening(sk, iterations=2)
    lab, n = ndi.label(sk)
    blobs = []
    for i in range(1, n + 1):
        m = lab == i; c = int(m.sum())
        if c < 3000: continue
        yy_, xx_ = np.nonzero(m); blobs.append({'c': [int(xx_.mean()), int(yy_.mean())], 'bbox': [int(xx_.min()), int(yy_.min()), int(xx_.max()), int(yy_.max())], 'n': c})
    keys[name] = {'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], 'skin': sorted(blobs, key=lambda b: -b['n'])}

def centroid(m):
    ys, xs = np.nonzero(m); return [int(xs.mean()), int(ys.mean())]
meta = {
    'size': [W, H],
    'palmL': centroid(hl), 'palmR': centroid(hr), 'faceCenter': list(FACE_C),
    'handL_bbox': [int(v) for v in (*np.nonzero(hl)[1][[0]], 0)] if False else None,
    'keys': keys,
}
json.dump(meta, open(OUT / 'layers.json', 'w'), indent=1)
print(json.dumps(meta))
