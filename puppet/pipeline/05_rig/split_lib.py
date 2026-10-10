"""拆件公用函数里 ../lib/poses_lib.py 没有的那几个，从原拆件公用函数原样拷来（函数体没改）。"""
import numpy as np, cv2
from PIL import Image

def save(arr, path):
    Image.fromarray(arr).save(path)

def labdiff(a, b):
    la = cv2.cvtColor(a, cv2.COLOR_RGB2LAB).astype(np.float32); lb = cv2.cvtColor(b, cv2.COLOR_RGB2LAB).astype(np.float32)
    return np.sqrt(((la - lb) ** 2).sum(-1))

def feather(mask, r=1.2):
    return cv2.GaussianBlur(mask.astype(np.float32), (0, 0), r)

def crop_save(img_rgba, path, pad=6):
    """裁到 alpha 的包围盒（外扩 pad），返回 (x, y, w, h)。"""
    ys, xs = np.where(img_rgba[..., 3] > 2)
    x0, x1, y0, y1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, img_rgba.shape[1]), max(ys.min() - pad, 0), min(ys.max() + pad + 1, img_rgba.shape[0])
    Image.fromarray(img_rgba[y0:y1, x0:x1]).save(path)
    return [int(x0), int(y0), int(x1 - x0), int(y1 - y0)]

def match_lab(img, ref, sel):
    """把 img 在 sel 选中像素的 Lab 均值 / 方差对到 ref 上（两张图已配准）。"""
    a = cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.float32); b_ = cv2.cvtColor(ref, cv2.COLOR_RGB2LAB).astype(np.float32)
    ma, mb = sel(img), sel(ref); out = a.copy()
    if ma.sum() < 100 or mb.sum() < 100: return img
    for c in range(3):
        sa, sb = a[..., c][ma], b_[..., c][mb]
        out[..., c] = np.where(ma, (a[..., c] - sa.mean()) * (sb.std() / max(sa.std(), 1e-3)) + sb.mean(), a[..., c])
    return cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
