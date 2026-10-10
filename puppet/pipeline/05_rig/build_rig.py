"""把头部 / 身体的部件表合成 <source>/head/rig.json（绘制顺序、分组、深度、摆动参数）。

  python3 build_rig.py --source <角色来源目录> --work <中间产物目录>

输入（中间产物）：<work>/parts/head_parts.json（../03_face/split_head.py 的产物）、body_parts.json（split_body.py）、armsdown_parts.json（split_armsdown.py，没有就不带手臂放下那一组）。
输入（source）：head/inputs/rig_back.json——rig.json 的 back 字段（背面立绘的摆放）。它是早先一版部件表下算出来、又手工加过 headPart 的，现在重算不出原值，所以单独存档、原样带进去；
  没有这个文件时，退回原来的做法：从现有的 head/rig.json 里把 back 字段留下来。两处都没有就不带 back。
输出：<source>/head/rig.json（成品）。"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S, W as WK
W = os.path.dirname(WK('parts/x')) + '/'
hp = json.load(open(W + 'head_parts.json')); bp = json.load(open(W + 'body_parts.json'))
ad = json.load(open(W + 'armsdown_parts.json')) if os.path.exists(W + 'armsdown_parts.json') else None
if ad: bp['parts'].update(ad['parts'])
HP, BP, G, BG = hp['parts'], bp['parts'], hp['geom'], bp['geom']
ox, oy = hp['org']
HC = [690 + ox, 760 + oy]; FC = [690 + ox, 900 + oy]          # 大曲面（头发、帽子）的中心；脸曲面的中心
FACE = dict(group='head', depth=0, bulge=1, pc=FC, pr=440)
HAIR = dict(group='head', depth=0.08, bulge=1)
SW = dict(rootY=760 + oy, tipY=1250 + oy, amp=1.0, idle=3, xc=HC[0], x0=230, x1=470)
order = []
def add(name, src=None, **kw):
    d = (HP.get(name) or BP.get(name))
    if d is None: print('缺部件', name); return
    order.append({'id': name, 'src': name + '.png', **d, **kw})
add('hair_back', group='head', depth=-0.12, bulge=0.25, sway=dict(rootY=760 + oy, tipY=1250 + oy, amp=0.5, idle=2))
add('neck', group='body')
add('legs'); add('torso')
if ad: add('armDownL'); add('armDownR')
add('skirt')
for s in 'LR':
    for h in ('open', 'point', 'wave'): add(f'hand_{h}{s}')
    add('arm' + s)
add('hand_claspL')      # 交握的双手要盖在两只袖口上面
add('face', **FACE, grid=[20, 20])
add('nose', **FACE)
for s in 'LR':
    add('eyeWhite' + s, **FACE, role='eyeWhite'); add('iris' + s, **FACE, role='iris', clip='eyeWhite' + s)
    add('eyeHl' + s, **FACE, role='eyeHl', clip='eyeWhite' + s); add('eyeLow' + s, **FACE, role='eyeLow'); add('lash' + s, **FACE, role='lash')
MS = {'closed': 1, 'small': 0.85, 'big': 0.62, 'smile': 0.8}      # 改图画出来的张嘴偏大，绕嘴心缩一下
mc = G['mouth']['center']
for m in ('closed', 'small', 'big', 'smile'):
    r = HP['mouth_' + m]['rect']; k = MS[m]
    HP['mouth_' + m]['rect'] = [mc[0] + (r[0] - mc[0]) * k, mc[1] + 6 + (r[1] - mc[1] - 6) * k, r[2] * k, r[3] * k]
    add('mouth_' + m, **FACE, role='mouth:' + m)
add('hair_front', **HAIR, sway=SW, grid=[20, 20]); add('hair_sideL', **HAIR, sway=SW, grid=[10, 22]); add('hair_sideR', **HAIR, sway=SW, grid=[10, 22])
for s in 'LR': add('brow' + s, **FACE, role='brow')
add('ahoge', group='head', depth=0.1, bulge=1, sway=dict(rootY=172 + oy, tipY=40 + oy, amp=0.8, idle=5, pow=1.3, gravity=0))
add('hat', group='head', depth=0.1, bulge=1, grid=[20, 16])
eyes = {}
for s in 'LR': eyes[s] = {**G['eye' + s], 'closeAt': 0.74, 'lashArch': 0.42}
top = min(p['rect'][1] for p in order)
rig = {
    'size': [2208, 2944], 'foot': BG['foot'], 'height': BG['foot'][1] - top,
    'head': {'center': HC, 'radius': 700, 'zscale': 0.5, 'power': 0.8, 'neck': [HC[0], G['chinY'] + 12]},
    'body': {'hip': BG['hip'], 'shoulderY': BG['shoulderY'], 'chestY': BG['chestY'], 'breath': 7},
    'eyes': eyes, 'mouth': G['mouth'], 'arms': BG['arms'], 'parts': order,
    **({'armsDown': {k: {**v, 'restBend': 17, 'rootIn': 0.12, 'rootLen': 0.4} for k, v in ad['armsDown'].items()}} if ad else {}),
}
if os.path.exists(S('head/inputs/rig_back.json')): rig['back'] = json.load(open(S('head/inputs/rig_back.json')))
else:
    try: rig['back'] = json.load(open(S('head/rig.json')))['back']      # 背面立绘摆放，重建时保留
    except Exception: pass
json.dump(rig, open(S('head/rig.json'), 'w'), indent=1)
print('parts', len(order), 'height', rig['height'])
