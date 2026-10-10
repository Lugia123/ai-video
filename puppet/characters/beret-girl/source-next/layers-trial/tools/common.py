"""分层试验的公共函数：配准、底色判断、叠回、几把边缘的尺子。坐标都是 1408² 的视图像素。"""
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
MAG = np.array([236, 64, 200])
def rgb(p): return np.asarray(Image.open(p).convert('RGB')).astype(np.int16)
def lum(I): return 0.299 * I[..., 0] + 0.587 * I[..., 1] + 0.114 * I[..., 2]
def disk(r): y, x = np.mgrid[-r:r + 1, -r:r + 1]; return x * x + y * y <= r * r
def is_magenta(I):          # 品红底：R、B 都高、G 低。生成图的底有 ±15 的浮动
    I = I.astype(int); return (np.minimum(I[..., 0], I[..., 2]) - I[..., 1] > 90) & (I[..., 0] > 170) & (I[..., 2] > 140)
def fg_of(I):               # 前景 = 不和画面边缘连通的品红之外的一切（内部的品红小洞算前景里的洞，留着）
    m = is_magenta(I); l, n = ndi.label(m); edge = set(np.unique(np.r_[l[0], l[-1], l[:, 0], l[:, -1]])) - {0}; return ~np.isin(l, list(edge))
def register(src, ref, ref_mask=None):
    """把 src（生成图）配到 ref（原视图）：SIFT + RANSAC 相似变换。返回 (配好的图, 缩放, 平移, 内点数/匹配数)。"""
    g1 = cv2.cvtColor(src.astype(np.uint8), cv2.COLOR_RGB2GRAY); g2 = cv2.cvtColor(ref.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    s = cv2.SIFT_create(6000); k1, d1 = s.detectAndCompute(g1, None); k2, d2 = s.detectAndCompute(g2, None if ref_mask is None else ref_mask.astype(np.uint8) * 255)
    mt = [m for m, n in cv2.BFMatcher().knnMatch(d1, d2, k=2) if m.distance < 0.72 * n.distance]
    p1 = np.float32([k1[m.queryIdx].pt for m in mt]); p2 = np.float32([k2[m.trainIdx].pt for m in mt])
    M, inl = cv2.estimateAffinePartial2D(p1, p2, method=cv2.RANSAC, ransacReprojThreshold=3)
    out = cv2.warpAffine(src.astype(np.uint8), M, (ref.shape[1], ref.shape[0]), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=tuple(int(v) for v in MAG))
    return out.astype(np.int16), float(np.hypot(M[0, 0], M[0, 1])), (float(M[0, 2]), float(M[1, 2])), (int(inl.sum()), len(mt))
def cdiff(a, b, sigma=1.5):  # 两张图的色差（先各自轻微模糊，免得 1px 的线条抖动全算成差异）
    fa = np.dstack([ndi.gaussian_filter(a[..., c].astype(float), sigma) for c in range(3)]); fb = np.dstack([ndi.gaussian_filter(b[..., c].astype(float), sigma) for c in range(3)])
    return np.abs(fa - fb).max(2)
def clean(m, open_r=3, min_px=1500, hole_px=800):
    m = ndi.binary_opening(m, disk(open_r)); l, n = ndi.label(m); sz = ndi.sum(m, l, range(1, n + 1)) if n else []
    m = np.isin(l, [i + 1 for i in range(n) if sz[i] >= min_px]); h = ndi.binary_fill_holes(m) & ~m; l, n = ndi.label(h); sz = ndi.sum(h, l, range(1, n + 1)) if n else []
    return m | np.isin(l, [i + 1 for i in range(n) if sz[i] < hole_px])
def rgba(I, m, soft=1.0):
    a = np.clip(ndi.gaussian_filter(m.astype(float), soft) * 2 - 0.5, 0, 1) if soft else m.astype(float); return np.dstack([np.clip(I, 0, 255).astype(np.uint8), (a * 255).astype(np.uint8)])
def over(layers, bg=(236, 64, 200)):          # 从下到上叠
    h, w = layers[0].shape[:2]; out = np.zeros((h, w, 3), float) + np.array(bg)
    for L in layers: a = L[..., 3:4] / 255.0; out = out * (1 - a) + L[..., :3] * a
    return out
# ---- 尺子 ----
def outline_cover(L, win=7, dark=70):
    """层的外沿上有近黑描边的比例（%）和最长的没有描边的一段（px）。外沿 = 不透明区域的边界；每个边界点 win 窗内最暗的亮度 < dark 才算有线。"""
    a = L[..., 3] > 128; e = a & ~ndi.binary_erosion(a); lm = np.where(a, lum(L[..., :3].astype(int)), 255); ok = ndi.minimum_filter(lm, size=win) < dark
    bad = e & ~ok; l, n = ndi.label(bad, structure=np.ones((3, 3))); gap = int(max(ndi.sum(bad, l, range(1, n + 1)))) if n else 0
    return round(100 * (e & ok).sum() / max(int(e.sum()), 1), 1), gap, int(e.sum())
def fringe(L, band=3):
    """晕边：外沿往里 band px 的带子里，不是近黑、又明显偏底色（品红）或偏白（比层内部中位亮 25 以上）的像素数。"""
    a = L[..., 3] > 128; ring = a & ~ndi.binary_erosion(a, disk(band)); I = L[..., :3].astype(int); lm = lum(I); inner = a & ~ndi.binary_dilation(~a, disk(12))
    med = np.median(lm[inner]) if inner.sum() > 100 else 200
    magish = (np.minimum(I[..., 0], I[..., 2]) - I[..., 1] > 50); return int((ring & (lm > 90) & (magish | (lm > med + 25))).sum()), int(ring.sum())
def debris(L, small=400):
    """残渣：层里面积小于 small px 的独立碎块数 / 像素数；以及层内部面积小于 small px 的透明小洞数。"""
    a = L[..., 3] > 128; l, n = ndi.label(a); sz = ndi.sum(a, l, range(1, n + 1)) if n else []; h = ndi.binary_fill_holes(a) & ~a; hl, hn = ndi.label(h); hs = ndi.sum(h, hl, range(1, hn + 1)) if hn else []
    return int(sum(1 for s in sz if s < small)), int(sum(s for s in sz if s < small)), int(sum(1 for s in hs if s < small))
