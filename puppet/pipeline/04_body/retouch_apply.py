#!/usr/bin/env python3
"""把改图结果并回部件（#1154）。
  python3 retouch_apply.py neck body/inputs/neck_s11.png --source <角色来源目录> --work <中间产物目录>
第二个参数是改图结果，相对 --source（改图结果不可重跑，放在来源目录里）。
读改图的输入图 <项>.png 和 boxes.json：先找 <source>/body/inputs/in/（已经提交过、和改图结果配对存档的那张），没有再用 <work>/body/in/（retouch_inputs.py 刚出的）。
  注意：配准是拿改图结果对它当时的输入图，所以输入图必须是提交时那一张；它是用当时的各层拼的，各层后来变了就拼不回原样。
另读 <source>/body/body.json（脖子中线）、<work>/body/full/handL|R.png（肤色参照）——都是 bake.py 的产物，所以要先烘焙一遍。
改图会平移缩放画面：先把结果 SIFT 配准回它的输入图，再按裁切框换算回母版坐标。
写 <work>/body/retouch/<项>.png（整幅画布 RGBA），bake.py 烘焙时如果这个文件存在就用它替换对应的层。"""
import sys, json, os
import numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import paths; from paths import S, rest; from poses_lib import bg_mask, register
WK = paths.W          # 本文件里 W 是画布宽，中间产物目录的函数另起名
B = S('body') + '/'; FULL = os.path.dirname(WK('body/full/x')) + '/'; IN = S('body/inputs/in') + '/'; RT = os.path.dirname(WK('body/retouch/x')) + '/'; W, H = 1104, 1472
item, genp = rest[0], rest[1]
if not os.path.exists(f'{IN}{item}.png'): IN = os.path.dirname(WK('body/in/x')) + '/'
print('改图输入图', f'{IN}{item}.png')
box = json.load(open(IN + 'boxes.json'))[item]
inp = np.asarray(Image.open(f'{IN}{item}.png').convert('RGB'))
gen = np.asarray(Image.open(S(genp)).convert('RGB'))
if gen.shape != inp.shape:
    gen = cv2.resize(gen, inp.shape[1::-1], interpolation=cv2.INTER_LANCZOS4)
reg, M = register(gen, inp, name=item)
sc = float(np.hypot(M[0, 0], M[1, 0]))
assert 0.9 < sc < 1.1, f'配准缩放 {sc:.3f} 超出范围，这张不要'
x0, y0, x1, y1 = box; k = (x1 - x0) / inp.shape[1]
full = np.tile(np.uint8([236, 239, 242]), (H, W, 1))
full[y0:y1, x0:x1] = cv2.resize(reg, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA)
inp_full = np.tile(np.uint8([236, 239, 242]), (H, W, 1)); inp_full[y0:y1, x0:x1] = cv2.resize(inp, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA)
lab = cv2.cvtColor(full, cv2.COLOR_RGB2LAB).astype(np.float32)
bgl = np.median(lab[y0 + 4:y0 + 30, x0 + 4:x0 + 30].reshape(-1, 3), 0)
notbg = np.abs(lab - bgl).sum(-1) > 14
J = json.load(open(B + 'body.json'))

if item == 'neck':
    cx = int(round(J['anchors']['neckBase'][0]))
    # 每一行：以中线为起点向两边走到背景为止，得到这一行「脖子」的左右边界
    rows = {}
    for y in range(590, 770):
        r = notbg[y]
        if not r[cx]: continue
        l = cx
        while l > cx - 120 and r[l - 1]: l -= 1
        rr = cx
        while rr < cx + 120 and r[rr + 1]: rr += 1
        rows[y] = (l, rr)
    ws = np.array([b - a for a, b in rows.values()]); wmed = np.median(ws[ws < 110])
    good = sorted(y for y, (a, b) in rows.items() if abs((b - a) - wmed) <= 0.08 * wmed)   # 宽度正常的行 = 纯脖子（下巴更宽、领口里更宽）
    # 取最长的一段连续行
    runs, cur = [], [good[0]]
    for y in good[1:]:
        if y == cur[-1] + 1: cur.append(y)
        else: runs.append(cur); cur = [y]
    runs.append(cur); run = max(runs, key=len); yt, yb = run[0], run[-1]
    l = int(np.median([rows[y][0] for y in run])); r = int(np.median([rows[y][1] for y in run]))
    # 改图在脖子上面多画了一个下巴：下巴的轮廓线会横穿脖子。纯脖子从「柱子内部不再有深色线」的那一行开始
    inner_min = {y: float(lab[y, l + 9:r - 8, 0].min()) for y in run}
    crossed = [y for y in run if inner_min[y] < 150]                 # 内部有轮廓线的行（阴影的 L 约 170 以上，不算）
    if crossed:
        yt = max(crossed) + 2; run = [y for y in run if y >= yt]
    print(f'脖子：宽 {r - l + 1}px（x {l}–{r}），纯脖子的行 y {yt}–{yb}（共 {len(run)} 行）')
    # 肤色对到母版：用同一张图里的手做参照（手在输入图里是母版像素）
    hm = np.zeros((H, W), bool)
    for n in ('handL', 'handR'):
        a = np.asarray(Image.open(f'{FULL}{n}.png'))[..., 3] > 200
        hm |= cv2.erode(a.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    hm &= (np.indices((H, W))[0] < y1 - 4)
    li = cv2.cvtColor(inp_full, cv2.COLOR_RGB2LAB).astype(np.float32)
    shift = li[hm].mean(0) - lab[hm].mean(0) if hm.sum() > 200 else np.zeros(3)
    print('肤色校正（Lab）', shift.round(1), '参照像素', int(hm.sum()))
    fixed = cv2.cvtColor(np.clip(lab + shift, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    out = np.zeros((H, W, 4), np.uint8)
    YT, YB = 596, 762                                   # 上到耳朵高度，下到领口里面
    for y in range(YT, YB + 1):
        ys = min(max(y, yt + 1), yb - 1)                # 纯脖子范围内用原行，范围外复制最近的一行
        out[y, l:r + 1, :3] = fixed[ys, l:r + 1]; out[y, l:r + 1, 3] = 255
    a = cv2.GaussianBlur(out[..., 3].astype(np.float32), (0, 0), 0.6); out[..., 3] = np.clip(a, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(RT + 'neck.png')
    json.dump({'x': [l, r], 'pureRows': [yt, yb], 'rows': [YT, YB], 'regScale': sc, 'gen': genp}, open(RT + 'neck.json', 'w'))
Image.fromarray(full).save(f'{RT}{item}_registered.png')
