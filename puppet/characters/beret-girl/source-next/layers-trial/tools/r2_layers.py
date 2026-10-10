#!/usr/bin/env python3
"""路线 2：拆层模型的输出 → 和路线 1 同样的四层（帽子、前发、后发、头）+ 同样的读数。
仓库根目录跑：python3 <本文件> <拆层结果目录（里面是 front hair.png 等）> <原视图 RGB> <原视图前景 RGBA 或 -> <输出目录>"""
import json, sys, os, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from common import *
run, src, srca, DST = sys.argv[1:5]; os.makedirs(DST + '/layers', exist_ok=True)
O = rgb(src); H, Wd = O.shape[:2]; ofg = (np.asarray(Image.open(srca))[..., 3] > 128) if srca != '-' else fg_of(O)
def L(name):
    p = f'{run}/{name}.png'
    if not os.path.exists(p): return np.zeros((H, Wd, 4), np.uint8)
    return np.asarray(Image.open(p).convert('RGBA').resize((Wd, H), Image.LANCZOS))
def stack(names):          # 从下到上叠成一层
    out = np.zeros((H, Wd, 4), float)
    for n in names:
        l = L(n).astype(float); a = l[..., 3:4] / 255; out[..., :3] = out[..., :3] * (1 - a) + l[..., :3] * a; out[..., 3:4] = out[..., 3:4] + a * (255 - out[..., 3:4])
    return out.astype(np.uint8)
GROUPS = {'head': ['neck', 'topwear', 'neckwear', 'face', 'ears', 'earwear', 'nose', 'mouth', 'eyewhite', 'irides', 'eyelash', 'eyebrow', 'eyewear'], 'back_hair': ['back hair'], 'front_hair': ['front hair'], 'hat': ['headwear', 'objects']}
ORDER = ['back_hair', 'head', 'front_hair', 'hat']          # 拆层模型的后发是整片的（包括头后面那块），所以叠的时候后发在头的下面
layers = {n: stack(GROUPS[n]) for n in GROUPS}; rep = {'原始层（非空的）': {}, '层': {}}
for f in sorted(os.listdir(run)):
    if f.endswith('.png') and '_depth' not in f and f[:-4] not in ('src_img', 'src_head', 'reconstruction', 'head', 'optimized'):
        px = int((np.asarray(Image.open(f'{run}/{f}').convert('RGBA'))[..., 3] > 128).sum())
        if px: rep['原始层（非空的）'][f[:-4]] = px
for n, l in layers.items(): Image.fromarray(l).save(f'{DST}/layers/{n}.png')
comp = over([layers[n] for n in ORDER]); Image.fromarray(comp.astype(np.uint8)).save(DST + '/recomposed.png'); d = np.abs(comp - np.where(ofg[..., None], O, MAG)).max(2)
rep['叠回'] = {'平均色差（前景内）': round(float(d[ofg].mean()), 2), '色差>30 的像素占比 %': round(100 * float((d[ofg] > 30).mean()), 2), '色差>60 的像素占比 %': round(100 * float((d[ofg] > 60).mean()), 2)}
Image.fromarray(np.clip(d * 3, 0, 255).astype(np.uint8)).save(DST + '/recomposed_diff.png')
above = np.zeros((H, Wd), bool)
for n in ORDER[::-1]:
    l = layers[n]; a = l[..., 3] > 128; hid = a & above; c, gap, ne = outline_cover(l); fr, ring = fringe(l); db = debris(l); semi = int(((l[..., 3] > 20) & (l[..., 3] < 235)).sum())
    rep['层'][n] = {'像素': int(a.sum()), '其中原视图里被上层挡住、这里画出来了的': int(hid.sum()), '占比 %': round(100 * hid.sum() / max(a.sum(), 1), 1), '外沿近黑描边覆盖率 %': c, '最长无描边段 px': gap,
                   '晕边像素 / 外沿带像素': [fr, ring], '碎块数 / 碎块像素 / 小洞数': list(db), '半透明像素（alpha 20–235）': semi}
    above |= a
json.dump(rep, open(DST + '/report.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(rep, ensure_ascii=False))
