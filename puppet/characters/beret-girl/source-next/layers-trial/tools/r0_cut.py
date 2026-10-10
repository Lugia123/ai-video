#!/usr/bin/env python3
"""对照组：今天的做法的起点——只有一张压平的视图，按层的范围硬切，每层只拿得到「看得见的那部分」，被上层挡住的地方是空的。
（今天正面那套是在这之后又靠去帽图、纯头图、延伸、手工蒙版把空的地方补上的；这里不补，只量硬切本身留下什么。）
层的范围借用路线 1 的结果（路线 1 的层减去它上面各层）。仓库根目录跑：python3 <本文件>"""
import json, sys, os, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from common import *
T = 'puppet/characters/beret-girl/source-next/layers-trial/'; DST = T + 'r0-cut'; os.makedirs(DST + '/layers', exist_ok=True)
O = rgb(T + 'in/quarter_magenta.png'); ofg = np.asarray(Image.open(T + 'in/quarter_rgba.png'))[..., 3] > 128; above = np.zeros(ofg.shape, bool); rep = {'层': {}}; outs = {}
for n in ['hat', 'front_hair', 'back_hair', 'head']:
    full = np.asarray(Image.open(T + f'r1-gen/layers/{n}.png'))[..., 3] > 128; m = (full if n != 'head' else ofg) & ofg & ~above; outs[n] = rgba(O, m, soft=0); Image.fromarray(outs[n]).save(f'{DST}/layers/{n}.png')
    c, gap, ne = outline_cover(outs[n]); fr, ring = fringe(outs[n]); db = debris(outs[n])
    rep['层'][n] = {'像素': int(m.sum()), '完整的层有多少像素（路线 1）': int(full.sum()), '缺的（被上层挡住、空着）占完整层 %': round(100 * (full & ~m).sum() / max(full.sum(), 1), 1),
                   '外沿近黑描边覆盖率 %': c, '最长无描边段 px': gap, '晕边像素 / 外沿带像素': [fr, ring], '碎块数 / 碎块像素 / 小洞数': list(db)}
    above |= m
comp = over([outs[n] for n in ['head', 'back_hair', 'front_hair', 'hat']]); Image.fromarray(comp.astype(np.uint8)).save(DST + '/recomposed.png'); d = np.abs(comp - O).max(2)
rep['叠回'] = {'平均色差（前景内）': round(float(d[ofg].mean()), 2), '色差>30 的像素占比 %': round(100 * float((d[ofg] > 30).mean()), 2)}
json.dump(rep, open(DST + '/report.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(rep, ensure_ascii=False))
