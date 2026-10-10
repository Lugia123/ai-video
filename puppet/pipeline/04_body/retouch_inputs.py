#!/usr/bin/env python3
"""改图的输入图：把要补的区域涂成品红（#1154）。
  python3 retouch_inputs.py --source <角色来源目录> --work <中间产物目录>
读 <source>/body/body.json 和 <work>/body/full/<名>.png（bake.py 的产物）。
每张都是从烘焙好的各层现拼的第一代图；裁一块放大 2 倍到 1024²，写 <work>/body/in/<项>.png，裁切框记在 <work>/body/in/boxes.json。"""
import sys, os, json, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import paths; from paths import S, rest; from poses_lib import bg_mask, register
WK = paths.W          # 本文件里 W 是画布宽，中间产物目录的函数另起名
B = S('body') + '/'; FULL = os.path.dirname(WK('body/full/x')) + '/'; IN = os.path.dirname(WK('body/in/x')) + '/'; J = json.load(open(B + 'body.json')); W, H = J['canvas']
BG = np.float32([236, 239, 242]); MAG = np.float32([236, 64, 200])        # 和 W2 用的品红一致
L = {p['name']: np.asarray(Image.open(FULL + p['file'])).astype(np.float32) for p in J['parts']}
order = [p['name'] for p in sorted(J['parts'], key=lambda p: p['z'])]


def comp(names, paint=None, paint_before=None):
    """按层序叠 names；paint = 画在最上面的品红蒙版；paint_before = (层名, 蒙版)：在画这一层之前先涂。"""
    c = np.tile(BG, (H, W, 1))
    for n in order:
        if paint_before and n == paint_before[0]:
            c[paint_before[1]] = MAG
        if n in names:
            a = L[n][..., 3:4] / 255.; c = c * (1 - a) + L[n][..., :3] * a
    if paint is not None:
        c[paint] = MAG
    return c


def save(name, img, box):
    x0, y0, x1, y1 = box
    crop = cv2.resize(img[y0:y1, x0:x1], (1024, 1024), interpolation=cv2.INTER_LANCZOS4)
    Image.fromarray(np.clip(crop, 0, 255).astype(np.uint8)).save(f'{IN}{name}.png')
    boxes[name] = box


boxes = {}
yy, xx = np.indices((H, W))
BOX_UP = (290, 520, 802, 1032)                      # 上半身，512² → 1024²

# 1) 脖子：在画上衣之前，把脖子的竖条涂成品红（上衣、领子仍盖在它上面）；不放现有的短脖子
m = (xx >= 498) & (xx <= 592) & (yy >= 585) & (yy <= 760)
body_names = [n for n in order if n != 'neck']
save('neck', comp(body_names, paint_before=('skirt', m)), BOX_UP)

# 2) 袖窿：只放上衣（不放手臂），两侧各涂一条
m = ((xx >= 418) & (xx <= 456) | (xx >= 634) & (xx <= 672)) & (yy >= 690) & (yy <= 868)
save('armhole', comp(['top', 'skirt', 'legL', 'legR'], paint=m), BOX_UP)

# 3) 领子后片：脖子根两侧、领尖之间的背景区域涂品红（画在所有层的最下面，脖子和领子都盖在它上面）
m = (xx >= 462) & (xx <= 628) & (yy >= 664) & (yy <= 712)
save('collarback', comp(order, paint_before=(order[0], m)), BOX_UP)

json.dump(boxes, open(IN + 'boxes.json', 'w'))
print(boxes)
