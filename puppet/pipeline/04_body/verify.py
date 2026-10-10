#!/usr/bin/env python3
"""身体部件母版的验收（#1154）。
  python3 verify.py --source <角色来源目录> --work <中间产物目录>
读 <source>/body/body.json、<名>.png、master/pose_idle_f.png 和 <work>/body/full/<名>.png、labels.npy、head_standin.png（bake.py 的产物）。
产出 <work>/body/wip-body-parts-sheet.png（爆炸图 + 叠回对比 + 错位测试 + 三色底检查）和 <work>/body/verify.json。
头用 head_standin.png（母版里归头的像素）代替。检查图里的标题用系统中文字体（macOS 的 Hiragino Sans GB），别的系统要改 F。
"""
import json, sys, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import paths; from paths import S, rest; from poses_lib import bg_mask, register
WK = paths.W          # 本文件里 W 是画布宽，中间产物目录的函数另起名

B = S('body') + '/'; FULL = os.path.dirname(WK('body/full/x')) + '/'; WORK = os.path.dirname(WK('body/x')) + '/'
J = json.load(open(B + 'body.json'))
W, H = J['canvas']
A = J['anchors']
master = np.asarray(Image.open(S('master/pose_idle_f.png')).convert('RGB')).astype(np.float32)
FG = ~bg_mask(master.astype(np.uint8), tol=14)
BG = np.array([236, 239, 242], np.float32)
MAGENTA, NAVY, WHITE = (255, 0, 255), (16, 32, 72), (255, 255, 255)
F = lambda s: ImageFont.truetype('/System/Library/Fonts/Hiragino Sans GB.ttc', s)

parts = sorted(J['parts'], key=lambda p: p['z'])
layers = {p['name']: np.asarray(Image.open(FULL + p['file'])).astype(np.float32) for p in parts}
layers['head'] = np.asarray(Image.open(WORK + 'head_standin.png')).astype(np.float32)
order = [p['name'] for p in parts] + ['head']


def warp(img, M):
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def rot(center, deg):
    return cv2.getRotationMatrix2D(tuple(center), deg, 1.0)


def shift(dx, dy):
    return np.float32([[1, 0, dx], [0, 1, dy]])


def compose(xf=None, bgc=BG):
    """按层序叠；xf = {层名: 2×3 仿射}。返回 (rgb, alpha)。"""
    rgb = np.tile(np.float32(bgc), (H, W, 1)); alpha = np.zeros((H, W), np.float32)
    for n in order:
        im = layers[n]
        if xf and n in xf:
            im = warp(im, xf[n])
        a = im[..., 3:4] / 255.
        rgb = rgb * (1 - a) + im[..., :3] * a
        alpha = np.maximum(alpha, a[..., 0])
    return rgb, alpha


def holes(alpha):
    """被角色围住、透出背景的像素数（和图像边缘不连通的透明区）。"""
    t = (alpha < 0.5).astype(np.uint8)
    num, cc = cv2.connectedComponents(t, connectivity=4)
    border = set(cc[0]) | set(cc[-1]) | set(cc[:, 0]) | set(cc[:, -1])
    inner = t.astype(bool) & ~np.isin(cc, list(border))
    return inner


report = {}

# ---------- a) 叠回对比 ----------
rec, ra = compose()
sil = ra > 0.5
iou = float((sil & FG).sum() / (sil | FG).sum())
la = cv2.cvtColor(master.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
lb = cv2.cvtColor(np.clip(rec, 0, 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
de = np.sqrt(((la - lb) ** 2).sum(-1))
both = sil & FG
label = np.load(WORK + 'labels.npy')
body_px = both & (label != 99)
report['recompose'] = {'silhouetteIoU': round(iou, 4),
                       'labDiffMedian': round(float(np.median(de[both])), 2), 'labDiffP95': round(float(np.percentile(de[both], 95)), 2),
                       'bodyOnly_labDiffMedian': round(float(np.median(de[body_px])), 2), 'bodyOnly_labDiffP95': round(float(np.percentile(de[body_px], 95)), 2),
                       'bodyOnly_shareOver12': round(float((de[body_px] > 12).mean()), 4),
                       'missingPx': int((FG & ~sil).sum()), 'extraPx': int((sil & ~FG).sum()),
                       'baselineHolesPx': int(holes(ra).sum())}
diff_vis = np.clip(rec, 0, 255).astype(np.uint8).copy()
diff_vis[(de > 12) & both] = (255, 0, 0)
diff_vis[FG & ~sil] = (255, 0, 255); diff_vis[sil & ~FG] = (0, 160, 255)

# ---------- b) 错位测试 ----------
arm = lambda d: {'armIdleL': rot(A['shoulderL'], -d), 'handL': rot(A['shoulderL'], -d), 'armIdleR': rot(A['shoulderR'], d), 'handR': rot(A['shoulderR'], d)}
TESTS = [('头上移 30px', {'head': shift(0, -30)}), ('头左移 30px', {'head': shift(-30, 0)}), ('头右移 30px', {'head': shift(30, 0)}),
         ('两臂外展 15°', arm(15)), ('裙摆左摆 5°', {'skirt': rot(A['waist'], 5)}), ('裙摆右摆 5°', {'skirt': rot(A['waist'], -5)})]
base_holes = holes(ra)
test_imgs = []
report['displace'] = {}
for name, xf in TESTS:
    rgb, a = compose(xf)
    hl = holes(a) & ~cv2.dilate(base_holes.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    # 露空：原来被角色盖住、现在透出背景、且被角色围住的像素
    vis = np.clip(rgb, 0, 255).astype(np.uint8)
    vis[hl] = (255, 0, 255)
    report['displace'][name] = {'holePx': int(hl.sum())}
    test_imgs.append((f'{name}  露空 {int(hl.sum())} px', vis))

# ---------- c) 三色底 + 边缘指标 ----------
report['matte'] = {}
for p in parts:
    im = layers[p['name']]; a = im[..., 3]
    solid = (a > 250).astype(np.uint8); semi = (a > 5) & (a <= 250)
    dist = cv2.distanceTransform(1 - solid, cv2.DIST_L2, 3)
    # 边缘 3px 带里偏灰底色的像素（母版背景灰残留）：和背景灰的 Lab 距离 < 10
    band = (a > 5) & (cv2.erode(solid, np.ones((7, 7), np.uint8)) == 0)
    lab = cv2.cvtColor(im[..., :3].astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    bgl = cv2.cvtColor(np.uint8([[BG]]), cv2.COLOR_RGB2LAB).astype(np.float32)[0, 0]
    greyish = band & (np.abs(lab - bgl).sum(-1) < 18)
    report['matte'][p['name']] = {'semiMaxDistPx': round(float(dist[semi].max()) if semi.any() else 0, 1),
                                  'edgeBandPx': int(band.sum()), 'bgColorInBandShare': round(float(greyish.sum() / max(1, band.sum())), 4)}

json.dump(report, open(WORK + 'verify.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(report, ensure_ascii=False, indent=1))


# ---------- 检查图 ----------
def label_img(arr, text, size=22):
    im = Image.fromarray(arr); out = Image.new('RGB', (im.width, im.height + 34), (28, 28, 28)); out.paste(im, (0, 34))
    ImageDraw.Draw(out).text((6, 5), text, fill=(255, 255, 255), font=F(size)); return out


def hstack(ims, gap=8):
    h = max(i.height for i in ims); out = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) - 1), h), (28, 28, 28)); x = 0
    for i in ims:
        out.paste(i, (x, 0)); x += i.width + gap
    return out


def vstack(ims, gap=14):
    w = max(i.width for i in ims); out = Image.new('RGB', (w, sum(i.height for i in ims) + gap * (len(ims) - 1)), (28, 28, 28)); y = 0
    for i in ims:
        out.paste(i, (0, y)); y += i.height + gap
    return out


CROPB = (200, 620, 900, 1420)          # 身体所在区域
cb = lambda arr: arr[CROPB[1]:CROPB[3], CROPB[0]:CROPB[2]]

# 爆炸图：各层按位置向外推开
EXPL = {'legL': (-40, 150), 'legR': (40, 150), 'shoeL': (-70, 330), 'shoeR': (70, 330), 'neck': (0, -150), 'skirt': (0, 40), 'top': (0, -40),
        'topOverArm': (0, -130), 'collarBack': (150, -210), 'handL': (-190, 60), 'handR': (190, 60), 'armIdleL': (-150, -50), 'armIdleR': (150, -50)}
ex = np.tile(np.float32(MAGENTA), (1040, 1200, 1)); d = None
exim = Image.fromarray(ex.astype(np.uint8)).convert('RGBA')
dr = ImageDraw.Draw(exim)
for p in parts:
    n = p['name']; x, y, w, h = p['rect']; dx, dy = EXPL[n]
    tile = Image.open(B + p['file']).convert('RGBA')
    px, py = x - 200 + 250 + dx, y - 620 + 170 + dy
    exim.alpha_composite(tile, (int(px), int(py)))
    dr.text((int(px), int(py) - 22), f"{n}  z{p['z']}  补 {p['completedPx']}", fill=(255, 255, 255), font=F(16))
row1 = hstack([label_img(np.asarray(exim.convert('RGB')), '爆炸图（品红底；「补」= 被挡住、由 See-through 补出来的像素数）'),
               label_img(cb(master.astype(np.uint8)), '母版'),
               label_img(cb(np.clip(rec, 0, 255).astype(np.uint8)), f"叠回去  剪影交并比 {report['recompose']['silhouetteIoU']}"),
               label_img(cb(diff_vis), f"差异：红 = 色差>12，品红 = 缺，蓝 = 多   身体色差中位数 {report['recompose']['bodyOnly_labDiffMedian']}")])
sc = lambda arr: np.asarray(Image.fromarray(arr[560:1420, 150:950]).resize((480, 516), Image.LANCZOS))
row2 = hstack([label_img(sc(v), t, 18) for t, v in test_imgs])
tiles = []
for p in parts:
    tile = Image.open(B + p['file']).convert('RGBA'); cols = []
    for c in (MAGENTA, NAVY, WHITE):
        bgim = Image.new('RGBA', tile.size, c + (255,)); bgim.alpha_composite(tile); cols.append(bgim.convert('RGB'))
    m = report['matte'][p['name']]
    tiles.append(label_img(np.asarray(hstack(cols, 2)), f"{p['name']}  边缘带底色残留 {m['bgColorInBandShare'] * 100:.1f}%", 16))
row3 = hstack(tiles[:7]); row4 = hstack(tiles[7:])
sheet = vstack([row1, row2, row3, row4])
sheet.save(WORK + 'wip-body-parts-sheet.png'); print(sheet.size)
