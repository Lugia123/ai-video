"""头发组装的公用函数。坐标系 = 头部母版像素（1408²）。路径来自 lib/paths.py（--source / --work）。"""
import numpy as np, cv2, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import paths
from scipy import ndimage as ndi
from PIL import Image
IN = paths.S('hair', 'inputs') + os.sep          # 组装的输入：早期拆分步骤的产物（不可重跑，产物即来源）
def rgb(path): return np.asarray(Image.open(path).convert('RGB'))
def lab(img): return cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.float32)
def labdiff(a, b): return np.sqrt(((lab(a) - lab(b)) ** 2).sum(-1))
def ch(img): return [img[..., i].astype(np.int16) for i in range(3)]
def masters():
    M = rgb(paths.S('master', 'head_master.png')); N = rgb(paths.S('master', 'derived', 'head_nohat.png')); B = rgb(paths.S('master', 'derived', 'head_bald.png'))
    return M, N, B
def outside_bg(img, tol=10):
    """和画面边框连通的浅灰底。"""
    f = img.astype(np.int16); bg = np.median(np.concatenate([f[:16, :16].reshape(-1, 3), f[:16, -16:].reshape(-1, 3)]), 0)
    near = np.abs(f - bg).max(-1) < tol
    l, n = ndi.label(near); e = np.unique(np.concatenate([l[0], l[-1], l[:, 0], l[:, -1]])); e = e[e > 0]
    return np.isin(l, e), bg
def mintish(img):
    r, g, b = ch(img); return (g > r + 6) & (g >= b - 12) & (g > 70)
def hair_line(img):
    """头发的描边：深藏青偏青（不是脸的红棕线，也不是睫毛的纯黑）。"""
    r, g, b = ch(img); return (r < 70) & (b >= r + 6) & (g >= r - 2) & (g < 120) & (b < 130)
def save_rgba(img, a, path):
    Image.fromarray(np.dstack([img, (np.clip(a, 0, 1) * 255).astype(np.uint8)])).save(path)
