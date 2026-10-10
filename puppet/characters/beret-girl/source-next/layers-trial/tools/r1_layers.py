#!/usr/bin/env python3
"""路线 1：逐层揭开。原视图 → 去帽 → 去刘海和鬓发 → 光头，每一步改图只拿掉最上面那一层；相邻两张做差就是被拿掉的那层，像素取自「拿掉之前」的那张（那时它在最上面、没有东西挡它）。
仓库根目录跑：python3 <本文件>  → r1-gen/layers/{hat,front_hair,back_hair,head}.png + r1-gen/report.json"""
import json, sys, os, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from common import *
T = 'puppet/characters/beret-girl/source-next/layers-trial/'; R = T + 'r1-gen/'; os.makedirs(R + 'layers', exist_ok=True); os.makedirs(R + 'reg', exist_ok=True)
O = rgb(T + 'in/quarter_magenta.png'); ofg = np.asarray(Image.open(T + 'in/quarter_rgba.png'))[..., 3] > 128
CHAIN = [('nohat', 'nohat_s11'), ('nobangs', 'backhair2_s12'), ('bald', 'bald_s11')]; imgs = [O]; fgs = [ofg]; rep = {'配准': {}}
for name, f in CHAIN:
    G, sc, tr, inl = register(rgb(R + f'raw/{f}.png'), O); imgs.append(G); fgs.append(fg_of(G)); Image.fromarray(G.astype(np.uint8)).save(R + f'reg/{name}.png')
    rep['配准'][name] = {'缩放': round(sc, 4), '平移': [round(tr[0], 1), round(tr[1], 1)], '内点/匹配': list(inl)}
# 取层的判据不用「两张图像素不一样」——模型每次都把整张重画一遍，线条位置会抖几个像素，差分里全是别处的线渣。
# 改用「类别变了」：这块在拿掉之前是这一层的颜色（帽子色 / 头发色），拿掉之后变成了别的（头发 / 皮肤 / 底色）；再把贴着它的近黑描边收进来。
def classes(I, fg):
    I = I.astype(int); r, g, b = I[..., 0], I[..., 1], I[..., 2]; L = lum(I)
    navy = fg & (b > g + 8) & (L < 120) & (((b > r + 22) & (L > 36)) | (b > r + 40))                    # 帽子的藏青（亮度约 55；近黑描边约 15–25，不算）
    dark = fg & (L < 62) & ~navy
    pin = fg & (r > 170) & (g > 110) & (b < 130) & (r > b + 70)                       # 发卡的橙黄
    hair = fg & ~dark & ~navy & (g > r + 6) & (g >= b - 18) & (L > 62)                 # 薄荷绿到深青绿
    skin = fg & (r > 200) & (r > g + 8) & (g > b - 5) & ~pin
    return dict(dark=dark, navy=navy, pin=pin, hair=hair, skin=skin)
C = [classes(I, f) for I, f in zip(imgs, fgs)]; lens = ndi.binary_fill_holes(ndi.binary_closing(C[0]['pin'], disk(9)))          # 发卡连同里面的镜头
def take(core, A_dark, B_keepdark):
    core = clean(core, open_r=6, min_px=1200, hole_px=4000)          # 开运算半径 6：两张图轮廓对不齐留下的一圈细边不算
    line = A_dark & ndi.binary_dilation(core, disk(11)) & ~B_keepdark                                                 # 贴着这块、拿掉之后就不在了的描边
    m = ndi.binary_closing(core | line, disk(3)); return clean(m, open_r=1, min_px=1200, hole_px=4000)
gone = lambda k, cls: ~ndi.binary_dilation(C[k][cls], disk(2))
NAMES = ['hat', 'front_hair', 'back_hair']; layers = {}; rep['层'] = {}
m_hat = take((C[0]['navy'] | lens) & ~ndi.binary_dilation(C[1]['navy'], disk(2)), C[0]['dark'], ndi.binary_erosion(C[1]['dark'] | C[1]['hair'], disk(1)) & C[1]['dark'] & False)
m_front = take(C[1]['hair'] & (C[2]['skin'] | ~fgs[2] | (C[2]['dark'] & ~C[1]['dark'])) , C[1]['dark'], C[2]['dark'] & ndi.binary_dilation(C[2]['hair'], disk(4)) & ~ndi.binary_dilation(C[2]['skin'], disk(6)))
m_back = take(C[2]['hair'] & ~ndi.binary_dilation(C[3]['hair'], disk(1)), C[2]['dark'], C[3]['dark'])
for n, m, k in (('hat', m_hat, 0), ('front_hair', m_front, 1), ('back_hair', m_back, 2)): layers[n] = rgba(imgs[k], m); rep['层'][n] = {}
layers['head'] = rgba(imgs[3], fgs[3])
for n, L in layers.items(): Image.fromarray(L).save(R + f'layers/{n}.png')
# 叠回去和原视图比
comp = over([layers['head'], layers['back_hair'], layers['front_hair'], layers['hat']]); Image.fromarray(comp.astype(np.uint8)).save(R + 'recomposed.png')
d = np.abs(comp - O).max(2); roi = ofg | (comp - MAG).any(2)
rep['叠回'] = {'平均色差（前景内）': round(float(d[ofg].mean()), 2), '色差>30 的像素占比 %': round(100 * float((d[ofg] > 30).mean()), 2), '色差>60 的像素占比 %': round(100 * float((d[ofg] > 60).mean()), 2)}
Image.fromarray(np.clip(d * 3, 0, 255).astype(np.uint8)).save(R + 'recomposed_diff.png')
# 每层：完整程度（这层有多少像素在原视图里其实被上面的层挡着——这些是「画出来的」）、边缘
above = np.zeros(O.shape[:2], bool)
for n in ['hat', 'front_hair', 'back_hair', 'head']:
    L = layers[n]; a = L[..., 3] > 128; hid = a & above; c, gap, ne = outline_cover(L); fr, ring = fringe(L); db = debris(L)
    rep['层'].setdefault(n, {}).update({'像素': int(a.sum()), '其中原视图里被上层挡住、这里画出来了的': int(hid.sum()), '占比 %': round(100 * hid.sum() / max(a.sum(), 1), 1),
        '外沿近黑描边覆盖率 %': c, '最长无描边段 px': gap, '晕边像素 / 外沿带像素': [fr, ring], '碎块数 / 碎块像素 / 小洞数': list(db)})
    above |= a
json.dump(rep, open(R + 'report.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(rep, ensure_ascii=False, indent=1))
