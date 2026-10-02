"""把参考图（如 design/_smile/*.png）的脸部表情贴到 T 字立绘上：SIFT 匹配头部 → 相似变换 → 椭圆羽化贴回眼口区域。
用法: python3 tools/layers/face_swap.py --base turnaround/bluegray/front-tpose.png --ref design/_smile/bluegray-soft-a.png \
        --face 330,300,500,420 --out turnaround/bluegray/front-tpose-smile.png
--face 是 base 上要替换的眼口区域 (x0,y0,x1,y1)，椭圆羽化。头部匹配只在 base 的 --head 区域（默认 face 外扩 120px）里找特征。"""
import argparse, numpy as np, cv2
from PIL import Image
ap = argparse.ArgumentParser()
ap.add_argument('--base', required=True); ap.add_argument('--ref', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--face', required=True); ap.add_argument('--head', default=None); ap.add_argument('--feather', type=float, default=10)
ap.add_argument('--debug', default=None)
a = ap.parse_args()
B = np.asarray(Image.open(a.base).convert('RGB')); R = np.asarray(Image.open(a.ref).convert('RGB').resize(B.shape[1::-1]))
fx0, fy0, fx1, fy1 = map(int, a.face.split(','))
hx0, hy0, hx1, hy1 = map(int, a.head.split(',')) if a.head else (fx0 - 120, fy0 - 120, fx1 + 120, fy1 + 120)
sift = cv2.SIFT_create(4000)
mb = np.zeros(B.shape[:2], np.uint8); mb[max(0, hy0):hy1, max(0, hx0):hx1] = 1
kb, db = sift.detectAndCompute(cv2.cvtColor(B, cv2.COLOR_RGB2GRAY), mb)
kr, dr = sift.detectAndCompute(cv2.cvtColor(R, cv2.COLOR_RGB2GRAY), None)
m = cv2.BFMatcher().knnMatch(db, dr, k=2)
good = [x for x, y in m if x.distance < 0.75 * y.distance]
pb = np.float32([kb[g.queryIdx].pt for g in good]); pr = np.float32([kr[g.trainIdx].pt for g in good])
M, inl = cv2.estimateAffinePartial2D(pr, pb, method=cv2.RANSAC, ransacReprojThreshold=4)
print(f'matches {len(good)} inliers {int(inl.sum())} M={np.round(M, 3).tolist()}')
W = cv2.warpAffine(R, M, B.shape[1::-1], flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
mask = np.zeros(B.shape[:2], np.float32)
cv2.ellipse(mask, ((fx0 + fx1) // 2, (fy0 + fy1) // 2), ((fx1 - fx0) // 2, (fy1 - fy0) // 2), 0, 0, 360, 1, -1)
mask = cv2.GaussianBlur(mask, (0, 0), a.feather)[..., None]
out = (B * (1 - mask) + W * mask + 0.5).astype(np.uint8)
Image.fromarray(out).save(a.out); print('wrote', a.out)
if a.debug:
    Image.fromarray(np.concatenate([B, W, out], 1)[max(0, hy0):hy1, :]).save(a.debug)
