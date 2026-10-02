#!/usr/bin/env python3
"""2D 特写头部包（#942）：一个角度组的 base + 状态图 + 去刘海底图（plate）→ 分层，可以 layer-rig 驱动。
python3 tools/face-bake/head2d_layers.py <组> [--out kits/face2d/<名字>]
输入 episodes/cast-cyber-girl/closeup/yaw/<组>/：base.png、plate.png（去掉刘海和护目镜的同构图）、各状态 png、landmarks.json（fit2d 关键点 + fit 实测角）
输出（全部 832×1248 同画布对齐，直通 alpha PNG）：
  00-back.png      后发 + 脖子 + 衣服（整张 base 去掉「脸、前发、护目镜」，被挡处用 plate 补）
  01-face.png      脸（plate 上的脸皮 + 耳朵，五官处已由 plate 生成时保留，下面再抹成肤色）
  02-brows.png     眉毛（plate 上抠：去掉刘海后眉毛完整）
  eyes/<状态>.png  两眼（open / half / closed / surprised …）
  mouth/<状态>.png 嘴（rest / a i u e o / smile / surprised …）
  03-front.png     前发 + 护目镜（base 与 plate 的差异区域；刘海盖在眉眼上时照常盖住）
  expr/<情绪>.png  情绪整张（只在 0° / ±30° 组；不分层，直接切换整张头）
  rig.json         尺寸、锚点（瞳孔 / 嘴中心 / 颈部转轴）、实测 yaw / pitch、层顺序
"""
import json, os, sys, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
G = sys.argv[1]
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(ROOT, 'episodes/mv-pdoom/kits/face2d', G)
SRC = os.path.join(ROOT, 'episodes/cast-cyber-girl/closeup/yaw', G)
sys.path.insert(0, os.path.dirname(__file__))
os.makedirs(os.path.join(OUT, 'eyes'), exist_ok=True); os.makedirs(os.path.join(OUT, 'mouth'), exist_ok=True)
L = json.load(open(os.path.join(SRC, 'landmarks.json'))); F2 = L['fit2d']
def load(n):
    p = os.path.join(SRC, n + '.png')
    return np.array(Image.open(p).convert('RGB')).astype(float) / 255 if os.path.exists(p) else None
def save(a, rgb, name):
    Image.fromarray(np.dstack([rgb, a[..., None]]).__mul__(255).clip(0, 255).round().astype(np.uint8), 'RGBA').save(os.path.join(OUT, name))

base, plate = load('base'), load('plate')
H, W = base.shape[:2]
R, Gc, B = base[..., 0], base[..., 1], base[..., 2]
def skin_of(img):
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    return (r > 0.78) & (r >= g) & (g >= b - 0.03) & (r - b > 0.06) & (r - b < 0.42) & (g > 0.55)
def hair_of(img):
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    return (r > 0.18) & (r < 0.72) & (r - b > 0.1) & (g < r * 0.85) & (g > r * 0.35)
bg = (base.min(-1) > 0.93)                      # 白底
# ---- 前发 + 护目镜 = base 和 plate 不同的地方（颜色差 > 阈值），去掉小碎块，限制在头部上半
if plate is not None:
    diff = np.abs(base - plate).max(-1)
    front = ndimage.binary_opening(diff > 0.12, iterations=1)
    lab, n = ndimage.label(front)
    if n:
        area = ndimage.sum(np.ones_like(diff), lab, range(1, n + 1))
        front = np.isin(lab, 1 + np.where(area > 300)[0])
    chin_y = F2.get('chinTip', [0, max(F2['mouthR_img'][1], F2['mouthL_img'][1]) + 90])[1]
    eyeline = (F2['pupilR_img'][1] + F2['pupilL_img'][1]) / 2
    # 护目镜 = 眼睛以上、低饱和的灰 / 黑（镜片、框、带子），和差异区连通的整块
    sat = base.max(-1) - base.min(-1)
    gog = (sat < 0.12) & (base.max(-1) < 0.93) & (np.arange(H)[:, None] < eyeline - 60)
    lab2, n2 = ndimage.label(ndimage.binary_closing(gog, iterations=2))
    if n2:
        area2 = ndimage.sum(np.ones_like(diff), lab2, range(1, n2 + 1)); gog = np.isin(lab2, 1 + np.where(area2 > 2000)[0])
    gog = ndimage.binary_fill_holes(ndimage.binary_closing(gog, iterations=4))
    front = (front | gog) & (np.arange(H)[:, None] < eyeline + 40)   # 刘海 / 护目镜只在眼睛以上一点
    front = ndimage.binary_fill_holes(ndimage.binary_closing(front, iterations=3)) & ~(bg & ~ndimage.binary_fill_holes(front))   # 镜片的透明处（和底色接近）也算前发层
    fa = ndimage.gaussian_filter(front.astype(float), 0.8)
    save(fa, base, '03-front.png')
else:
    front = np.zeros((H, W), bool); fa = front.astype(float)
# ---- 脸（plate 上的皮肤连通块：包含两瞳孔中点的那块）+ 眉毛
src = plate if plate is not None else base
sk = skin_of(src)
sk = ndimage.binary_closing(sk, iterations=4)
lab, n = ndimage.label(sk)
cx, cy = int((F2['pupilR_img'][0] + F2['pupilL_img'][0]) / 2), int((F2['pupilR_img'][1] + F2['mouthR_img'][1]) / 2)
face_id = lab[cy, cx] or (1 + int(np.argmax(ndimage.sum(np.ones_like(R), lab, range(1, n + 1)))))
face = ndimage.binary_fill_holes(lab == face_id)                  # 填洞：眼 / 嘴 / 眉的洞都算脸
skin_col = np.median(src[face & skin_of(src)], 0)
face_rgb = src.copy()
# 五官处抹成肤色（眼、嘴由各自图层画；眉由眉层画）：脸内非皮肤像素 → 周围肤色（pull-push 近似：大半径高斯的肤色加权平均）
inside = ndimage.binary_dilation(face & ~skin_of(src), iterations=3) & face
# 眼 / 嘴 / 鼻子区域整块抹掉（淡残影也去掉）：五官椭圆里全部换成周围肤色；鼻子保留（鼻线由 base 自带）
yy_, xx_ = np.mgrid[0:H, 0:W]
for pr in ('pupilR_img', 'pupilL_img'):
    px, py = F2[pr]; inside |= face & ((((xx_ - px) / 60.0) ** 2 + ((yy_ - py + 4) / 40.0) ** 2) < 1)
mx_, my_ = (F2['mouthR_img'][0] + F2['mouthL_img'][0]) / 2, (F2['mouthR_img'][1] + F2['mouthL_img'][1]) / 2
inside |= face & ((((xx_ - mx_) / 70.0) ** 2 + ((yy_ - my_ - 6) / 34.0) ** 2) < 1)
keep = face & skin_of(src) & ~inside
w = ndimage.gaussian_filter(keep.astype(float), 14)
fill = np.stack([ndimage.gaussian_filter(np.where(keep, src[..., c], 0), 14) for c in range(3)], -1) / np.maximum(w, 1e-4)[..., None]
face_rgb[inside] = fill[inside]
fa_face = ndimage.gaussian_filter(face.astype(float), 0.8)
save(fa_face, face_rgb, '01-face.png')
# 眉毛：plate 上脸内、眼睛上方的深色（头发色）线
eyey = min(F2['pupilR_img'][1], F2['pupilL_img'][1])
brow = face & hair_of(src) & (np.arange(H)[:, None] < eyey - 18) & (np.arange(H)[:, None] > eyey - 110)
brow = ndimage.binary_opening(brow, iterations=1)
lab, n = ndimage.label(brow)
if n:
    area = ndimage.sum(np.ones_like(R), lab, range(1, n + 1)); brow = np.isin(lab, 1 + np.where(area > 60)[0])
save(ndimage.gaussian_filter(brow.astype(float), 0.7), src, '02-brows.png')
# ---- 后发 + 脖子 + 衣服 = base 里不是背景、不是脸、不是前发的；前发盖住的地方用 plate 补
# 后发层要在脸 / 前发下面垫满（转头时脸边会露出来）：头部轮廓 = 非背景的连通大块 ∪ 脸 ∪ 前发，再填洞
head = ndimage.binary_fill_holes(~bg | face | front)
back = head & ~(face & ~ndimage.binary_erosion(face, iterations=6))   # 脸边缘留 6 px 重叠
hair_fill = np.median(base[hair_of(base) & ~front & ~face], 0)
back_rgb = np.where(front[..., None], src, base)
under = (face | front) & head
back_rgb = np.where(under[..., None], np.where(hair_of(src)[..., None] | skin_of(src)[..., None], src, hair_fill), back_rgb)
save(ndimage.gaussian_filter(back.astype(float), 0.6), back_rgb, '00-back.png')
# ---- 眼 / 嘴：沿用 decals_yaw 的抠法，但输出到整张画布（同坐标）
import importlib.util
spec = importlib.util.spec_from_file_location('dy', os.path.join(os.path.dirname(__file__), 'decals_yaw.py'))
os.environ['DECALS_YAW_NO_MAIN'] = '1'
states = {'eyes': {'base': 'open', 'half': 'half', 'closed': 'closed', 'surprised': 'surprised'},
          'mouth': {'base': 'rest', 'a': 'a', 'i': 'i', 'u': 'u', 'e': 'e', 'o': 'o', 'smile': 'smile', 'surprised': 'surprised'}}
dec = json.load(open(os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals-yaw', G, 'decals.json'))) if os.path.exists(os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals-yaw', G, 'decals.json')) else None
rig = {'size': [W, H], 'group': G, 'yaw': L.get('fit', {}).get('yaw'), 'pitch': L.get('refPitch', 0), 'roll': L.get('fit', {}).get('roll'),
       'pupils': [F2['pupilR_img'], F2['pupilL_img']], 'mouth_center': [(F2['mouthR_img'][0] + F2['mouthL_img'][0]) / 2, (F2['mouthR_img'][1] + F2['mouthL_img'][1]) / 2],
       'neck_pivot': [cx, int(F2.get('chinTip', [0, cy + 150])[1] + 30)],
       'order': ['00-back', '01-face', '02-brows', 'eyes/<state>', 'mouth/<state>', '03-front'], 'eyes': [], 'mouth': [], 'expr': []}
if dec:
    DD = os.path.join(ROOT, 'episodes/mv-pdoom/kits/face-decals-yaw', G)
    for kind, parts in (('eyes', ['eyeL', 'eyeR']), ('mouth', ['mouth'])):
        names = sorted({st for p in parts for st in dec['parts'][p]['states']})
        for st in names:
            canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            for p in parts:
                P = dec['parts'][p]; S = P['states'].get(st)
                if S: canvas.alpha_composite(Image.open(os.path.join(DD, S['file'])), (P['x'], P['y']))
            canvas.save(os.path.join(OUT, kind, st + '.png')); rig[kind].append(st)
# 情绪整张
for e in ('happy', 'sad', 'angry', 'fear', 'determined', 'surprised'):
    p = os.path.join(SRC, e + '.png')
    if os.path.exists(p) and e != 'surprised':
        os.makedirs(os.path.join(OUT, 'expr'), exist_ok=True); shutil.copy(p, os.path.join(OUT, 'expr', e + '.png')); rig['expr'].append(e)
json.dump(rig, open(os.path.join(OUT, 'rig.json'), 'w'), ensure_ascii=False, indent=1)
print('ok', G, {k: rig[k] for k in ('yaw', 'pitch', 'eyes', 'mouth', 'expr')}, 'front px', int(front.sum()), 'face px', int(face.sum()))
