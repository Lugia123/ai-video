"""肩部衔接：手臂层有多少像素盖在身体底图上（肩 / 领子边 / 胸侧本该露出来的地方），并和这一层自己的基线比。
  python3 shoulder_overlap.py <kit 目录> [--out <标注图目录>]        退出码：有超基线的 1，否则 0
量法：躯干带（base 不透明、x 在两个肩头支点外各 60px 以内、y 675–885）里，手臂层 alpha>128 且 base alpha>128 的像素数，按画面左 / 右分开。
基线在同目录 shoulder_overlap.json，按「这一侧的手臂是怎么取的」分三类，读数只和自己那一类的上限比：
  idle   待机手臂（arms_idle，以及借用它那只手的层的那一侧）：母版原样的一层。它的内侧边圈在袖子和躯干的交界上，而身体底图把被袖子挡住的衬衣侧片也补画了，
         所以两层在两条竖带（画面左 x 430–456、右 x 634–657，从肩到腰带）上重叠约三千像素。重叠处画的是母版原有的袖子，没有盖掉该露出的东西。
  cut    按袖窿切过的手臂（高清绿底取法的层）：只剩切口的抗锯齿边，几十到几百。超过上限说明切口挪到了身体上面（坏样本：外转之后没重切的挥手，930）。
  front  手和袖子设计上就在身体前面（捂嘴、手抵下巴的 over 层）：不判。
哪一侧属于哪一类：这一侧盖住身体的那片像素和 arms_idle 这一侧的那片几乎重合（交并比 > 0.98）→ idle（借用了待机的那只手；整侧逐像素比不行，另一只手臂会有零星像素越过中线）；姿势在基线文件的 front 列表里且是 over 层 → front；其余 → cut。
标注图：红 = 盖住身体的手臂像素。"""
import sys, os, json, numpy as np
from PIL import Image
argv = sys.argv[1:]; K = argv[0]; out = argv[argv.index('--out') + 1] if '--out' in argv else None
SH = {'L': (440, 715), 'R': (654, 715)}; MID = 547
P = json.load(open(os.path.join(K, 'poses.json'))); base = np.asarray(Image.open(os.path.join(K, 'base.png')).convert('RGBA'))[..., 3] > 128
H, W = base.shape; Y, X = np.mgrid[0:H, 0:W]; zone = base & (X > SH['L'][0] - 60) & (X < SH['R'][0] + 60) & (Y > 675) & (Y < 885)
iou = lambda p, q: (p & q).sum() / max((p | q).sum(), 1) if (p | q).any() else 0.0
BL = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shoulder_overlap.json'), encoding='utf-8'))
idle = np.asarray(Image.open(os.path.join(K, 'arms_idle.png')).convert('RGBA')) if os.path.exists(os.path.join(K, 'arms_idle.png')) else None
print(f'{"姿势":12s} {"层":22s} 左（类 / 上限）      右（类 / 上限）      结论'); rows = {}; bad = 0
if out: os.makedirs(out, exist_ok=True)
for n, v in P.items():
    for kind in ('arms', 'over'):
        f = v.get(kind)
        if not f: continue
        a = np.asarray(Image.open(os.path.join(K, f)).convert('RGBA')); ov = (a[..., 3] > 128) & zone; res = {}; fails = []
        for sd, sl in (('L', slice(0, MID)), ('R', slice(MID, None))):
            cnt = int(ov[:, sl].sum()); has = bool((a[:, sl, 3] > 128).any())
            cls = 'none' if not has else 'front' if (n in BL['front'] and kind == 'over') else 'idle' if (idle is not None and iou(ov[:, sl], ((idle[..., 3] > 128) & zone)[:, sl]) > 0.98) else 'cut'
            lim = None if cls in ('none', 'front') else BL[cls][sd]['max']; res[sd] = {'px': cnt, 'class': cls, 'max': lim}
            if lim is not None and cnt > lim: fails.append(sd)
        rows[f'{n}/{f}'] = res; bad += bool(fails); cell = lambda q: f'{q["px"]:5d} ({q["class"]}' + (f' ≤{q["max"]}' if q['max'] is not None else '') + ')'
        print(f'{n:12s} {f:22s} {cell(res["L"]):20s} {cell(res["R"]):20s} {"超基线：" + "、".join(fails) if fails else "过"}')
        if out:
            c = Image.new('RGBA', (W, H), (244, 247, 251, 255)); c.alpha_composite(Image.open(os.path.join(K, 'base.png')).convert('RGBA')); c.alpha_composite(Image.fromarray(a)); px = np.asarray(c.convert('RGB')).copy(); px[ov] = (255, 0, 0)
            Image.fromarray(px).crop((330, 640, 770, 900)).save(os.path.join(out, f'overlap-{n}-{kind}.png'))
if out: json.dump(rows, open(os.path.join(out, 'shoulder-overlap.json'), 'w'), ensure_ascii=False, indent=1)
print('全过' if not bad else f'{bad} 层超基线'); sys.exit(1 if bad else 0)
