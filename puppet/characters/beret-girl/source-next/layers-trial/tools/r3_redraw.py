#!/usr/bin/env python3
"""路线 3：色块和描边分开。每层只要「形状（剪影）+ 里面的颜色」，外描边不从图里拿，由代码沿这层自己的剪影重画一圈等宽的近黑线。
这样「这段线归哪片」的问题不存在：每层的外描边一定完整、连续，层和层之间不共用线。层里面的发丝线、帽子褶线（不是近黑外轮廓）当作颜色留着。
输入是任何一条路线给的层（这里用路线 1 的；路线 2 的层出来后同样能喂）。仓库根目录跑：python3 <本文件> [输入层目录] [输出目录]"""
import json, sys, os, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from common import *
T = 'puppet/characters/beret-girl/source-next/layers-trial/'; SRC = sys.argv[1] if len(sys.argv) > 1 else T + 'r1-gen/layers'; DST = sys.argv[2] if len(sys.argv) > 2 else T + 'r3-lineart'; os.makedirs(DST + '/layers', exist_ok=True)
W = 9; LINE = np.array([8, 14, 36]); ORDER = ['head', 'back_hair', 'front_hair', 'hat']
O = rgb(T + 'in/quarter_magenta.png'); ofg = np.asarray(Image.open(T + 'in/quarter_rgba.png'))[..., 3] > 128; rep = {'描边宽 px': W, '层': {}}; outs = {}
for n in ORDER:
    L = np.asarray(Image.open(f'{SRC}/{n}.png').convert('RGBA')).copy(); a = L[..., 3] > 128; I = L[..., :3].astype(np.int16)
    l, k = ndi.label(a); sz = ndi.sum(a, l, range(1, k + 1)); a = np.isin(l, [i + 1 for i in range(k) if sz[i] >= 0.02 * sz.max()])          # 远小于主体的碎块不要
    m = ndi.gaussian_filter(ndi.binary_fill_holes(a).astype(float) if n != 'back_hair' else a.astype(float), 2.5) > 0.5                     # 剪影抹顺；后发中间那个洞是头，留着
    m &= ndi.binary_dilation(a, disk(4))
    # 原来的近黑外描边（离剪影边界 16px 内、亮度 < 62）抹掉，换成最近的非描边颜色
    near = m & ~ndi.binary_erosion(m, disk(16)); old = (near & (lum(I) < 62)) | (m & ~a)
    idx = ndi.distance_transform_edt(old | ~m, return_distances=False, return_indices=True); F = I.copy(); F[old] = I[idx[0][old], idx[1][old]]
    # 新描边：剪影往里 W px 的一圈；画布边缘（下缘直切处）不画
    ring = m & ~ndi.binary_erosion(m, disk(W)); ring[-W - 2:, :] = False; F[ring] = LINE
    outs[n] = rgba(F, m, soft=0.8); Image.fromarray(outs[n]).save(f'{DST}/layers/{n}.png')
    c, gap, ne = outline_cover(outs[n]); fr, rg = fringe(outs[n]); db = debris(outs[n])
    rep['层'][n] = {'像素': int(m.sum()), '抹掉的旧描边像素': int(old.sum()), '外沿近黑描边覆盖率 %': c, '最长无描边段 px': gap, '晕边像素 / 外沿带像素': [fr, rg], '碎块数 / 碎块像素 / 小洞数': list(db)}
comp = over([outs[n] for n in ORDER]); Image.fromarray(comp.astype(np.uint8)).save(DST + '/recomposed.png'); d = np.abs(comp - O).max(2)
rep['叠回'] = {'平均色差（前景内）': round(float(d[ofg].mean()), 2), '色差>30 的像素占比 %': round(100 * float((d[ofg] > 30).mean()), 2), '色差>60 的像素占比 %': round(100 * float((d[ofg] > 60).mean()), 2)}
json.dump(rep, open(DST + '/report.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(rep, ensure_ascii=False))
