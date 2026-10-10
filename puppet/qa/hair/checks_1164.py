#!/usr/bin/env python3
"""帽子和呆毛、侧发外描边的几条检查（W2 写的；2026-10-07 从头发来源目录的 18_checks_1164.py 拷进来，只把路径改成以 puppet 目录为基准，量法没动）。
对一个数据包跑（在哪个目录运行都行）：[CHECK_YAW=度数] python3 qa/hair/checks_1164.py <数据包目录> <输出目录>   读数打到标准输出并存成 <输出目录>/readings.json
B、C 默认量正面；CHECK_YAW 给了角度就在那个转头角度上量（图名带 -yaw角度）。D 固定量 ±24°。部件的位置一律取自引擎渲出来的图。
A 帽子片上不属于帽子的线：帽子贴图里，伸出帽子本体（不透明区域里宽 ≥ 26px 的部分）4px 以上、成段（≥ 60px）的像素数。帽子的描边只该贴着帽子自己的边（描边宽约 9px）。
  这些像素就是「顺着头发外轮廓往下走」的线，帽子深度和头发不同，一转头就留在原地成了一根孤立的线。
B 呆毛根部和帽顶交界：引擎只画呆毛 + 帽子（品红底），在呆毛根部左右各 40px、帽顶上沿上下 14px 的框里数
  B1 夹在呆毛和帽子之间的底色像素（同一列往上 14px 内有呆毛、往下 14px 内有帽子的品红）——从缝里透出来的底色；
  B2 呆毛根部的白点：a 根部浅色填充 2px 内就是底色的像素（外面没有描边挡着）+ b 帽顶线缺口像素（见下面代码注释）；
  B3 帽子上沿之上、不属于呆毛弧线主体的近黑小块（面积 < 150 的孤立深色块）——黑茬。
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
PUPPET = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))          # puppet 目录
pack, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]); os.makedirs(out, exist_ok=True)
C = json.load(open(f'{pack}/character.json')); PL = json.load(open(f"{pack}/{C['files']['parts']}")); parts = {p['id']: p for p in PL}; ox, oy = C['unit']['headMasterOrigin']
res = {}
# ---- A ----
hp = parts['hat']; im = np.asarray(Image.open(f"{pack}/{hp['texture']}").convert('RGBA')).astype(int); r, g, b, a = [im[..., i] for i in range(4)]
DISK = np.zeros((27, 27), bool); yy_, xx_ = np.mgrid[-13:14, -13:14]; DISK[yy_ ** 2 + xx_ ** 2 <= 169] = True
body = ndi.binary_opening(np.pad(a > 128, 20), structure=DISK)[20:-20, 20:-20]          # 帽子本体：不透明区域里宽 ≥ 26px 的部分；线会被开运算去掉
far0 = (a > 128) & (ndi.distance_transform_edt(~body) > 4); l, n = ndi.label(far0); sz = ndi.sum(far0, l, range(1, n + 1)) if n else []
far = np.isin(l, [i + 1 for i in range(n) if sz[i] >= 60]); l, n = ndi.label(far); sz = ndi.sum(far, l, range(1, n + 1)) if n else []          # 只数成段的（≥ 60px），边缘零星像素不算
res['A 帽子片上伸出帽子本体的线（像素）'] = int(far.sum()); res['A 分块（像素数, 帽子贴图内 x 范围, y 范围）'] = [(int(sz[i]), [int(np.where(l == i + 1)[1].min()), int(np.where(l == i + 1)[1].max())], [int(np.where(l == i + 1)[0].min()), int(np.where(l == i + 1)[0].max())]) for i in np.argsort(sz)[::-1][:4]]
v = im[..., :3].astype(np.uint8).copy(); v[a < 128] = (255, 0, 255); v[ndi.binary_dilation(far, iterations=2)] = (255, 255, 0); Image.fromarray(v).save(f'{out}/A-hat-stray.png')
# ---- B ----
# 转头角度：环境变量 CHECK_YAW=度数，B、C 两组就在这个角度上量（默认 0 = 正面）。
# 【量法】帽子、呆毛各在哪儿，一律从引擎渲出来的图里取（只画帽子一张、只画呆毛一张，非底色的像素就是它），不再把贴图遮罩按深度平移——
# 帽子现在是网格变形，各处横移不一样，平移贴图对不上（对不上的那几个像素会被当成「帽顶上方的黑茬」）。
rel = os.path.relpath(pack, PUPPET) + '/'; YAW = float(os.environ.get('CHECK_YAW', '0')); TURN = C['turn']['x']['parameter']; ytag = '' if not YAW else f'-yaw{YAW:g}'
def render(ids, yaw, name, x0=None, w=1408):          # 只画 ids 这几个部件（None = 整头，藏脖子），返回 RGB 数组
    hide = 'neck' if ids is None else ','.join(i for i in parts if i not in ids)
    subprocess.run(['node', os.path.join(PUPPET, 'tools/shot.mjs'), f"qa/shift-test.html?pack={rel}&k=1&only=0&param=ParamAngleZ&bg=%23ff00ff&crop={ox if x0 is None else x0},{oy},{w},1408&hide={hide}" + (f"&set={TURN}:{yaw:g}" if yaw else ''), name], check=True, stdout=subprocess.DEVNULL)
    return np.asarray(Image.open(name).convert('RGB')).astype(int)
def notbg(J): return ~((J[..., 0] > 235) & (J[..., 1] < 20) & (J[..., 2] > 235))
f = f'{out}/B-ahoge-hat{ytag}.png'; render(('ahoge', 'hat'), YAW, f)
I = np.asarray(Image.open(f).convert('RGB')).astype(int); bg = (I[..., 0] > 235) & (I[..., 1] < 20) & (I[..., 2] > 235); lum = 0.299 * I[..., 0] + 0.587 * I[..., 1] + 0.114 * I[..., 2]
def placed(pid):
    p = parts[pid]; x, y, w, h = [round(v) for v in p['rect']]; al = Image.open(f"{pack}/{p['texture']}").convert('RGBA').split()[3]
    if al.size != (w, h): al = al.resize((w, h))
    m = Image.new('L', (1408, 1408), 0); m.paste(al, (x - ox, y - oy)); return np.asarray(m) > 128
hat = ndi.binary_fill_holes(notbg(render(('hat',), YAW, f'{out}/_hat{ytag}.png'))); ah = notbg(render(('ahoge',), YAW, f'{out}/_ahoge{ytag}.png')) & ~hat
# 呆毛根部 = 呆毛贴着帽子的那一段（不是「呆毛最低的几行」——转头后帽顶线是斜的，最低的可能是垂下来的发梢）
_root = ah & ndi.binary_dilation(hat, iterations=4); ys, xs = np.where(_root if _root.any() else ah); base_y = ys.max(); bx = xs; x0, x1 = bx.min() - 40, bx.max() + 40
top = np.array([np.where(hat[:, x])[0].min() if hat[:, x].any() else 9999 for x in range(1408)])          # 帽子每一列的上沿
yy, xx = np.mgrid[0:1408, 0:1408]; box = (xx >= x0) & (xx <= x1) & (yy >= top[xx] - 14) & (yy <= top[xx] + 14)
# 「夹着」= 同一列里往上 14px 内有呆毛、往下 14px 内有帽子的底色像素（呆毛悬在帽子上方留下的缝）；单纯的拐角（上面没有呆毛）不算
up = np.zeros_like(ah); dn = np.zeros_like(hat)
for k in range(1, 15): up[k:] |= ah[:-k]; dn[:-k] |= hat[k:]
b1 = box & bg & up & dn
stem = ah & (yy > base_y - 30) & (lum > 120); stem_l = float(np.median(lum[stem])) if stem.any() else 200
# B2（#1164 后续改过）：原来量的是「帽子上沿 4px 内比茎更亮的像素」，在坏样本上读 0——用户圈的白点不是帽子上的亮点，
# 而是呆毛茎根部左侧「没有描边挡着的浅色」：茎的左描边在根部上方断了，浅色填充直接挨着底色；断口下面还透出一小块底色。
# 页面底色是近白色，这两样连成一片就是一个白点。现在量这两样：
#   B2a 呆毛根部（帽顶线上方 60px 内）浅色填充里，2px 之内就是底色的像素数——填充外面该有一圈描边，修好应为 0；
#   B2b 帽顶线缺口：用缺口两侧各 120px 的帽子上沿拟合一条二次曲线当「该有的帽顶线」，这条线往下 2px 之后还不是帽子的像素数。
light = ~bg & (lum > 120)
b2a = light & ndi.binary_dilation(bg, structure=np.ones((5, 5), bool)) & (xx >= x0) & (xx <= x1) & (yy > base_y - 60) & (yy <= top[xx])
fx = np.r_[np.arange(x0 - 120, x0), np.arange(x1 + 1, x1 + 121)]; fx = fx[(fx >= 0) & (fx < 1408)]; fx = fx[top[fx] < 9999]
fit = np.polyval(np.polyfit(fx, top[fx], 2), np.arange(1408))
b2b = (xx >= x0) & (xx <= x1) & (yy > fit[xx] + 2) & (yy < fit[xx] + 30) & (yy < top[xx])
b2 = b2a | b2b
dark = ~bg & (lum < 70) & (yy < top[xx]) & box; main = ndi.binary_opening(ah | (dark & ~box), iterations=1)
l, n = ndi.label(dark & ~ndi.binary_dilation(ah & (lum < 70), iterations=1)); b3 = np.zeros_like(dark)
for i in range(1, n + 1):
    c = l == i
    if c.sum() < 150: b3 |= c
res.update({'B1 呆毛和帽子之间夹着的底色像素': int(b1.sum()), 'B2 呆毛根部的白点（a + b）': int(b2a.sum() + b2b.sum()), 'B2a 根部浅色填充直接挨着底色的像素（没有描边挡着）': int(b2a.sum()), 'B2b 帽顶线缺口像素（比拟合的帽顶线低 2px 以上还不是帽子）': int(b2b.sum()), 'B3 帽顶上沿之上的孤立黑茬像素': int(b3.sum()), 'B 呆毛茎的亮度中位': round(stem_l, 1)})
v = I.astype(np.uint8).copy(); v[b1] = (255, 255, 0); v[b2] = (0, 255, 0); v[b3] = (255, 128, 0)
X0, X1 = max(0, x0 - 40), min(1408, x1 + 40); Y0 = max(0, int(top[x0:x1].min()) - 110); Image.fromarray(v[Y0:Y0 + 200, X0:X1]).resize(((X1 - X0) * 4, 800), Image.NEAREST).save(f'{out}/B-marked{ytag}.png')
Image.fromarray(I.astype(np.uint8)[Y0:Y0 + 200, X0:X1]).resize(((X1 - X0) * 4, 800), Image.NEAREST).save(f'{out}/B-zoom{ytag}.png')
print(json.dumps(res, ensure_ascii=False, indent=1)); json.dump(res, open(f'{out}/readings.json', 'w'), ensure_ascii=False, indent=1)

# ---- C 呆毛根部：帽顶线以上、呆毛剪影以外的深色像素（修好应为 0）----
# 「呆毛剪影」取来源里的可见呆毛（数据包没有这个信息，所以用呆毛贴图里「帽顶线以上」的最大连通块做参照）：
# 把呆毛 + 帽子图里帽顶线以上的非底色像素，减去「呆毛弧线主体」——主体 = 对它做半径 3 的开运算后的最大块再膨胀 3px（一根完整的茎和弧都比 6px 粗；
# 梳齿一样的细竖条、茎旁的小黑块会被开运算去掉）。剩下的深色像素就是多出来的黑条、黑块。
above = ~bg & (yy < top[xx] - 1) & (xx >= x0 - 20) & (xx <= x1 + 200)
core = ndi.binary_opening(above, structure=np.ones((7, 7), bool)); l, n = ndi.label(core)
if n: core = l == (1 + int(np.argmax(ndi.sum(core, l, range(1, n + 1)))))
extra = above & ~ndi.binary_dilation(core, iterations=3) & (lum < 90)
# 另数：茎的截面里竖着的深色条数（在帽顶线上方 6px 那一行，从左到右数深色段）。一根茎应该是 2 段（两侧描边）
row = int(np.median(top[x0 + 40:x1 - 40])) - 6; seg = (lum[row, x0:x1 + 1] < 90) & ~bg[row, x0:x1 + 1]; nseg = int((np.diff(seg.astype(int)) == 1).sum() + int(seg[0]))
# 有来源里的可见呆毛遮罩（母版坐标，第三个参数）时用它当「呆毛剪影」，更准：帽顶线以上、离这个剪影超过 2px 的深色像素
if len(sys.argv) > 3 and os.environ.get('C_USE_REF') == '1':          # 默认不用：重做的茎会在原剪影外新画两条描边，用原剪影当参照会把它们算成多余
    ref = np.asarray(Image.open(sys.argv[3]).convert('L')) > 0; extra = ~bg & (lum < 90) & (yy < top[xx] - 1) & (xx >= x0 - 20) & (xx <= x1 + 200) & ~ndi.binary_dilation(ref, iterations=2)
rows = [int(np.median(top[x0 + 40:x1 - 40])) - k for k in (3, 6, 9, 12)]; nsegs = []
for row in rows:
    seg = (lum[row, x0:x1 + 1] < 90) & ~bg[row, x0:x1 + 1] & ~hat[row, x0:x1 + 1] & (np.arange(x0, x1 + 1) > bx.min() - 25) & (np.arange(x0, x1 + 1) < bx.max() + 45); nsegs.append(int((np.diff(seg.astype(int)) == 1).sum() + int(seg[0])))
nseg = max(nsegs)
# C（#1164 后续改过）：原来的「呆毛主体以外的深色像素」在坏样本上只读 2、在梳齿版上读 0，区分度不够，不再当判据（数还留着供参考）。
# 现在逐行看茎的截面：帽顶线上方 CROWS 行里，每一行从左到右应该正好是「描边–浅色填充–描边」（两条描边各 ≥ 4px，填充 ≥ 8px，两头外面是底色；帽子自己的像素当底色看，帽顶线是斜的，不让它混进来）。
# 不是这个样子的行数就是读数：描边断了（坏样本）、多出竖黑条（梳齿）、茎旁有黑块、填充露在外面，都会让这一行不合格。修好应为 0。
CROWS = 24; cx0, cx1 = bx.min() - 25, bx.max() + 45; ytop = int(top[bx.min() - 12:bx.max() + 13].min()) - 1; badrows = []          # 茎（连两侧描边）这一段里帽顶线最高处的上一行起，往上数；再往下茎的一侧已经进到帽子后面了
for row in range(ytop - CROWS + 1, ytop + 1):
    cls = np.where(bg[row, cx0:cx1 + 1] | hat[row, cx0:cx1 + 1], 0, np.where(lum[row, cx0:cx1 + 1] < 90, 1, np.where(lum[row, cx0:cx1 + 1] > 120, 2, -1)))
    runs = []
    for c in cls[cls >= 0]:          # 过渡色（-1）不算；连续同类合成一段
        if runs and runs[-1][0] == c: runs[-1][1] += 1
        else: runs.append([int(c), 1])
    runs = [r for r in runs if r[1] >= 2]; merged = []
    for r in runs:
        if merged and merged[-1][0] == r[0]: merged[-1][1] += r[1]
        else: merged.append(list(r))
    while merged and merged[0][0] == 0: merged.pop(0)
    while merged and merged[-1][0] == 0: merged.pop()
    groups = [[]]          # 按底色切成几组，取浅色最多的那一组当茎（旁边隔着底色的是帽沿的边角或呆毛弧线绕回来的那段）；一组浅色都没有就取最宽的
    for m in merged:
        if m[0] == 0: groups.append([])
        else: groups[-1].append(m)
    merged = max(groups, key=lambda g: (sum(m[1] for m in g if m[0] == 2), sum(m[1] for m in g)))
    ok = [m[0] for m in merged] == [1, 2, 1] and merged[0][1] >= 4 and merged[2][1] >= 4 and merged[1][1] >= 8
    if not ok: badrows.append(row)
res.update({'C 茎截面不是「描边–填充–描边」的行数（帽顶线上方 %d 行）' % CROWS: len(badrows), 'C 帽顶线上方 3–12px 四行里深色段数的最大值（一根茎应为 2）': nseg, 'C（参考，不当判据）帽顶线以上、呆毛主体以外的深色像素': int(extra.sum())})
extra = extra.copy()
for row in badrows: extra[row, cx0 - 6:cx0 - 1] = True; extra[row, cx1 + 2:cx1 + 7] = True          # 图上在不合格的行两头画黄色短杠

v2 = I.astype(np.uint8).copy(); v2[extra] = (255, 255, 0); Image.fromarray(v2[Y0:Y0 + 200, X0:X1]).resize(((X1 - X0) * 4, 800), Image.NEAREST).save(f'{out}/C-marked{ytag}.png')

# ---- D 侧发外轮廓在转头 ±24° 时：可见外沿上近黑描边的覆盖率 / 最长非近黑段（灰青细线算缺）----
# 引擎画整头（品红底，藏掉脖子）；取整头剪影的外轮廓里「最近的部件是侧发」的那些点（用侧发贴图按深度平移后的遮罩判断）；
# 每个点沿法线往里 9px 内最暗的像素亮度 < 55 才算有近黑描边（母版外描边亮度约 15；去帽图那种灰青细线约 90–120，算缺）。
Rr = C['unit']['R']; import math
def placed_at(pid, yaw):
    p = parts[pid]; x, y, w, h = [round(v) for v in p['rect']]; al = Image.open(f"{pack}/{p['texture']}").convert('RGBA').split()[3]
    if al.size != (w, h): al = al.resize((w, h))
    m = Image.new('L', (1408, 1408), 0); m.paste(al, (round(x - ox + p.get('depth', 0) * Rr * math.sin(math.radians(yaw))), y - oy)); return np.asarray(m) > 128
D = {}
for yaw in (-24, 24):
    f = f'{out}/D-yaw{yaw}.png'
    J = render(None, yaw, f, ox - 100, 1608); bgj = (J[..., 0] > 235) & (J[..., 1] < 20) & (J[..., 2] > 235); lj = 0.299 * J[..., 0] + 0.587 * J[..., 1] + 0.114 * J[..., 2]
    fg = ndi.binary_fill_holes(~bgj); edge = fg & ~ndi.binary_erosion(fg); mk = J.astype(np.uint8).copy()
    hm = ndi.binary_fill_holes(notbg(render(('hat',), yaw, f'{out}/_D-hat{yaw}.png', ox - 100, 1608)))          # 帽子、头发在这个角度各占哪儿：从引擎图里取（同上）
    allhair = notbg(render([q['id'] for q in parts.values() if q.get('family') == 'hair' and q['id'] != 'ahoge'], yaw, f'{out}/_D-hair{yaw}.png', ox - 100, 1608))
    for sid in ('左半边', '右半边'):          # 整头外沿上属于头发的点（侧发、后发都算——从侧发外面露出来的后发边也该有近黑描边），按画面左右分开报
        half = np.zeros((1408, 1608), bool); half[:, :804] = True
        sm = allhair & (half if sid == '左半边' else ~half) & (np.mgrid[0:1408, 0:1608][0] < 1000)          # 只看下巴高度以上（帽檐到外翘发尖这一段）
        e = edge & ndi.binary_dilation(sm & ~hm, iterations=3)          # 外沿点里紧挨着露出来的头发的那些（含贴着帽子角的那一段）
        # 每个外沿点：它 3px 邻域里最暗的像素要 < 55（外沿本身就是近黑线）。用小窗口，免得旁边别的黑线顶替；灰青细线（亮度约 90–120）算缺。
        dark = ndi.minimum_filter(np.where(fg, lj, 255), size=7) < 55
        bad = e & ~dark; l, n = ndi.label(bad, structure=np.ones((3, 3))); gap = int(max(ndi.sum(bad, l, range(1, n + 1)))) if n else 0; bad = e & ~dark; l, n = ndi.label(bad, structure=np.ones((3, 3))); gap = int(max(ndi.sum(bad, l, range(1, n + 1)))) if n else 0
        D[f'{sid} yaw{yaw:+d}'] = {'外沿点数': int(e.sum()), '近黑描边覆盖率 %': round(100 * (e & dark).sum() / max(int(e.sum()), 1), 1), '最长非近黑段 px': gap}; mk[ndi.binary_dilation(bad, iterations=2)] = (255, 255, 0)
    Image.fromarray(mk).save(f'{out}/D-yaw{yaw}-marked.png')
res['D 侧发外轮廓（转头 ±24°）'] = D
print(json.dumps({k: v for k, v in res.items() if k[0] in 'CD'}, ensure_ascii=False, indent=1)); json.dump(res, open(f'{out}/readings.json', 'w'), ensure_ascii=False, indent=1)
