"""旧版「手臂放下」袖子的拆件（只为 build_rig.py 要的部件表 armsdown_parts.json；拆出来的图现在的数据包不用）。
取自模型直接画出来的手臂下垂版（本来想让它删手臂，结果画成了垂在身侧，袖子和肩膀的衔接是原画）。
配准到身体母版后，只取躯干 / 裙子剪影外面的袖子；被裙子挡住的下半截沿边缘往里补 24px。

  python3 split_armsdown.py [来源图名] --source <角色来源目录> --work <中间产物目录>

输入（都在 source 里）：身体母版 master/body_master.png、手臂下垂版 head/inputs/<来源图名>.png（默认 body_armsdown_f，没有就 body_noarms）——都是生图结果，不可重跑；
  无臂版 master/derived/body_noarms_b.png。
输出（全部是中间产物）：<work>/parts/armDown{L,R}.png、<work>/parts/armsdown_parts.json、<work>/parts/reg/body_armsdown.png（配准后的手臂下垂版；和 source 里 master/derived/body_armsdown.png 是同一张）。"""
import sys, os, json, numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import S as SRC, W as WK, rest
from poses_lib import load, register, bg_mask, rgba, bleed, navy_lines
from split_lib import save, labdiff, feather, crop_save, match_lab
from scipy import ndimage as ndi
BODY_ORG = (240, 1328); BS = 864 / 1536 * 2
HI = lambda n: SRC('head/inputs', n)
srcname = rest[0] if rest else ('body_armsdown_f' if os.path.exists(HI('body_armsdown_f.png')) else 'body_noarms')
bm = load(SRC('master/body_master.png')); Bn = load(SRC('master/derived/body_noarms_b.png'))
D, M = register(load(HI(srcname + '.png')), bm, (480, 60, 1050, 420), srcname)
D = navy_lines(D)
save(D, WK('parts/reg/body_armsdown.png'))
H_, W_ = D.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]
def C(p): return [float(BODY_ORG[0] + BS * p[0]), float(BODY_ORG[1] + BS * p[1])]
def largest(mask):
    lab, k = ndi.label(mask)
    return mask if k == 0 else lab == (np.argmax(ndi.sum(mask, lab, range(1, k + 1))) + 1)
fgD = ~bg_mask(D); fgBn = ~bg_mask(Bn)
body = ndi.binary_fill_holes(fgBn)
r, g, b = [D[..., i].astype(np.int16) for i in range(3)]
white = (r > 190) & (g > 215) & (b > 215)
J = {'L': {'S': (600, 150), 'E': (470, 350), 'W': (405, 575)}, 'R': {'S': (915, 150), 'E': (1044, 350), 'W': (1109, 575)}}
out = {}; geom = {}
for side, half in (('L', xx < 757), ('R', xx > 757)):
    m = largest(ndi.binary_opening(fgD & ~ndi.binary_dilation(body, iterations=2) & half & (yy > 60) & (yy < 700), iterations=4))
    # 肩部往躯干里多吃一段白袖子（y<400 才是躯干，往下是裙子）
    grow = ndi.binary_dilation(m, iterations=26) & fgD & half & (white | ndi.binary_dilation(m, iterations=6)) & (yy > 70) & (yy < 395)
    m2 = ndi.binary_fill_holes(largest(m | ndi.binary_opening(grow, iterations=2)))
    # 裙子挡住的那一侧：往裙子里补 24px（颜色取最近的袖子像素），裙摆摆动时不露空
    ext = ndi.binary_dilation(m2, iterations=24) & ndi.binary_dilation(body, iterations=4) & (yy >= 395) & ~m2
    idx = ndi.distance_transform_edt(~m2, return_distances=False, return_indices=True)
    Dx = D.copy(); Dx[ext] = D[idx[0][ext], idx[1][ext]]
    m3 = m2 | ext
    # 肩部切口补一圈深色线
    band = m2 & ~ndi.binary_erosion(m2, iterations=5) & (yy < 395)
    lum = D.astype(np.int16).sum(-1)
    Dx[band & (lum > 330)] = (22, 28, 48)
    Dx = np.where(ndi.binary_dilation(band, iterations=1)[..., None], cv2.GaussianBlur(Dx, (0, 0), 0.8), Dx)
    a = np.clip(feather(m3, 0.8), 0, 1)
    rct = crop_save(rgba(bleed(Dx, a), a), WK(f'parts/armDown{side}.png'))
    out['armDown' + side] = {'rect': [BODY_ORG[0] + BS * rct[0], BODY_ORG[1] + BS * rct[1], BS * rct[2], BS * rct[3]], 'group': 'armD' + side, 'role': 'armDown', 'grid': [14, 20]}
    geom[side] = {k2: C(J[side][k1]) for k1, k2 in (('S', 'shoulder'), ('E', 'elbow'), ('W', 'wrist'))}
json.dump({'parts': out, 'armsDown': geom}, open(WK('parts/armsdown_parts.json'), 'w'), indent=1)
print(json.dumps(geom))
