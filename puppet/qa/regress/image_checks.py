"""回归检查里要看像素的几条（只画头，不带身体）：脖子可见、帽檐下不露肤色、眉毛残留、发梢晕边和直边、露底、手臂层边缘。
用法：python3 puppet/qa/regress/image_checks.py <角色目录> <配置.json> <输出目录>      → 往标准输出打一个 JSON 数组；图存进输出目录
在哪个目录运行都行。"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage
PUPPET = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))          # puppet 目录；在哪个目录运行都行
pack, cfg_file, out = [os.path.abspath(v) for v in sys.argv[1:4]]; os.makedirs(out, exist_ok=True)
C = json.load(open(f'{pack}/character.json')); parts = {p['id']: p for p in json.load(open(f"{pack}/{C['files']['parts']}"))}
cfg = json.load(open(cfg_file)); R, TH = cfg['roles'], cfg['thresholds']; U = C['unit']; ox, oy = U.get('headMasterOrigin', [0, 0]); N = 1408
rel = os.path.relpath(pack, PUPPET) + '/'
def shot(name, angle, extra=''):
    f = f'{out}/{name}.png'
    subprocess.run(['node', os.path.join(PUPPET, 'tools/shot.mjs'), f"qa/shift-test.html?pack={rel}&k=1&only={angle}&bg=%23ff00ff{extra}", f], check=True); return np.asarray(Image.open(f).convert('RGB')).astype(int)
def is_bg(a): return (a[..., 0] > 235) & (a[..., 1] < 20) & (a[..., 2] > 235)
def is_skin(a): r, g, b = a[..., 0], a[..., 1], a[..., 2]; return (r > 215) & (g > 150) & (b > 120) & (r - g > 12) & (g - b > 4) & (b < 232)
def luma(a): return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
res = []; angles = cfg['turn']['angles']; amax = max(angles)
imgs = {a: shot(f'head{a:+d}', a) for a in angles}

# 1 脖子可见：下巴正下方一条竖带里应当是肤色（不是后发的颜色）
nk, fc = parts[R['neck']], parts[R['face']]; cx = round(nk['rect'][0] + nk['rect'][2] / 2 - ox); chin = round(fc['rect'][1] + fc['rect'][3] - oy)
vals = {}
for a in (-amax, 0, amax):
    band = imgs[a][chin + 8:chin + 40, cx - 14:cx + 14]; vals[a] = round(float(is_skin(band).mean()), 3)
res.append({'id': 'neck-visible', 'title': '下巴下面看得见脖子（肤色）', 'auto': True, 'pass': min(vals.values()) >= TH['neckSkinMin'], 'value': {'肤色占比': vals, '阈值': TH['neckSkinMin']}, 'image': 'head+0.png'})

# 2 帽檐下不露肤色：帽子下沿往下一条带子里数肤色像素
hat = parts[R['hat']]; ha = np.asarray(Image.open(f"{pack}/{hat['texture']}").convert('RGBA'))[..., 3] > 128
hx, hy, hw, hh = [round(v) for v in hat['rect']]; hs = ha if ha.shape == (hh, hw) else np.asarray(Image.fromarray(ha).resize((hw, hh))) > 0
def brim_skin(img, angle):
    # 帽子这一帧实际在哪：只画帽子再截一张（帽子可以带网格形变，不能假设它是整片平移）
    hm = ~is_bg(shot(f'hatonly{angle:+d}', angle, '&hide=' + ','.join(i for i in parts if i != R['hat']))); cols = np.where(hm.any(0))[0]; cnt = 0; mark = []
    if not len(cols): return 0, []
    x0, x1 = cols.min(), cols.max()
    for x in range(int(x0 + 0.2 * (x1 - x0)), int(x0 + 0.8 * (x1 - x0))):
        col = np.where(hm[:, x])[0]
        if not len(col): continue
        y0 = col.max() + 3; seg = img[y0:y0 + 42, x]; m = is_skin(seg); cnt += int(m.sum()); mark += [(x, y0 + int(i)) for i in np.where(m)[0]]
    return cnt, mark
bv = {}; worst = None
for a in angles:
    n, mark = brim_skin(imgs[a], a); bv[a] = n
    if worst is None or n > worst[0]: worst = (n, a, mark)
neg, _ = brim_skin(shot('neg-nobangs', amax, '&hide=' + ','.join(R['frontHair'])), amax)       # 反向验证：把前面的头发藏掉，必须数出一大片肤色
if worst[0]:
    im = Image.open(f'{out}/head{worst[1]:+d}.png').convert('RGB'); px = im.load()
    for x, y in worst[2]: px[x, y] = (255, 255, 0)
    im.save(f'{out}/brim-marked.png')
res.append({'id': 'brim-skin', 'title': '帽檐下不露肤色', 'auto': True, 'pass': max(bv.values()) <= TH['brimSkinMaxPx'] and neg > 20 * TH['brimSkinMaxPx'], 'value': {'各角度肤色像素': bv, '阈值': TH['brimSkinMaxPx'], '反向验证（藏掉前发）': neg}, 'image': 'brim-marked.png' if worst[0] else f'head{amax:+d}.png', 'note': cfg['notes'].get('brimSkinMaxPx')})

# 3 眉毛残留：刘海片上，眉毛轮廓线的位置是不是正好有一圈深色线（= 眉形描边残留）
hit = {}
for bid in R['bangs']:
    bg = parts[bid]; B = np.asarray(Image.open(f"{pack}/{bg['texture']}").convert('RGBA')).astype(int); dark = (B[..., 3] > 128) & (luma(B) < 150)
    for br in R['brows']:
        b = parts[br]; A = np.asarray(Image.open(f"{pack}/{b['texture']}").convert('RGBA'))[..., 3] > 128
        ring = ndimage.binary_dilation(A, iterations=3) & ~ndimage.binary_erosion(A, iterations=1)
        x0 = round(b['rect'][0] - bg['rect'][0]); y0 = round(b['rect'][1] - bg['rect'][1]); h, w = A.shape
        if x0 < 0 or y0 < 0 or y0 + h > dark.shape[0] or x0 + w > dark.shape[1]: continue
        hit[f'{bid}×{br}'] = round(float(dark[y0:y0 + h, x0:x0 + w][ring].mean()), 3)
res.append({'id': 'brow-residue', 'title': '刘海片上没有眉形描边残留', 'auto': True, 'pass': max(hit.values()) <= TH['browOutlineHitMax'], 'value': {'眉毛轮廓处的深色线占比': hit, '阈值': TH['browOutlineHitMax']}, 'note': cfg['notes'].get('browOutlineHitMax')})

# 5 头发下缘：外轮廓上不该有浅色（晕边）；下缘不该有长直边
a0 = shot('head-noneck', 0, '&hide=' + R['neck']); sil = ~is_bg(a0);      # 不带脖子：脖子片的下端是平的，接上身体后藏在领口里，不算头发的直边
edge = sil & ~ndimage.binary_erosion(sil, iterations=3); low = np.zeros_like(sil); low[round(U['headCenter'][1] - oy):] = True
# 只看头发那一段（到脸底为止），脖子不算
low[chin + 4:] = False
e = edge & low; light = e & (luma(a0) > 185)
frac = round(float(light.sum() / max(1, e.sum())), 4)
bottom = np.array([np.where(sil[:chin + 80, x])[0].max() if sil[:chin + 80, x].any() else -1 for x in range(N)])
run = best = 0
for x in range(1, N):
    run = run + 1 if bottom[x] >= 0 and bottom[x] == bottom[x - 1] else 0; best = max(best, run)
o = a0.copy().astype(np.uint8); o[light] = (255, 255, 0); Image.fromarray(o).save(f'{out}/fringe-marked.png')
res.append({'id': 'hair-fringe', 'title': '头发外轮廓没有浅色晕边', 'auto': True, 'pass': frac <= TH['fringeLightMax'], 'value': {'外沿 3 像素里偏亮的比例': frac, '阈值': TH['fringeLightMax']}, 'image': 'fringe-marked.png', 'note': cfg['notes'].get('fringeLightMax')})
res.append({'id': 'hair-straight-edge', 'title': '头发下缘没有长直边', 'auto': True, 'pass': best <= TH['straightEdgeMaxPx'], 'value': {'最长水平直线段（像素）': int(best), '阈值': TH['straightEdgeMaxPx']}})

# 6 露底：被角色包住、又不在白名单里的背景像素
hv = {}
for a in (-amax, 0, amax):
    bgm = is_bg(imgs[a]); lab, n = ndimage.label(bgm); edge_ids = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); inner = bgm & ~np.isin(lab, list(edge_ids))
    for w in cfg['whitelist']['holes']: x0, y0, x1, y1 = w['box']; inner[y0 - oy - 4:y1 - oy + 4, x0 - ox - 4:x1 - ox + 4] = False
    hv[a] = int(inner.sum())
    if a == amax: o = imgs[a].copy().astype(np.uint8); o[inner] = (255, 255, 0); Image.fromarray(o).save(f'{out}/holes-marked.png')
res.append({'id': 'enclosed-holes', 'title': '转头时没有被包住的露底（白名单除外）', 'auto': True, 'pass': max(hv.values()) <= TH['enclosedHolesMaxPx'], 'value': {'各角度露底像素': hv, '阈值': TH['enclosedHolesMaxPx'], '白名单': len(cfg['whitelist']['holes'])}, 'image': 'holes-marked.png'})

# 8 手臂层边缘：最外一圈应当是深色描边，不该是浅色镶边。被身体底图盖住的边（袖窿处被躯干线直切的口子）不算。
#   另一条：半透明的外圈不该偏绿（绿底抠图留下的描边和绿底的混色，深色底上是一圈细暗绿线）。
def arm_edges(path, base_alpha=None):
    A = np.asarray(Image.open(path).convert('RGBA')).astype(int); m = A[..., 3] > 128
    if m.sum() < 500: return None
    d = ndimage.distance_transform_edt(m); ring = (d > 0) & (d <= 2)
    if base_alpha is not None and base_alpha.shape == m.shape: ring &= ~base_alpha
    light = float((ring & (luma(A) > 200)).sum() / max(1, ring.sum()))
    semi = (A[..., 3] > 8) & (A[..., 3] < 247) & ndimage.binary_dilation(m, iterations=3) & ~ndimage.binary_erosion(m, iterations=2)
    r, g, b = A[..., 0], A[..., 1], A[..., 2]; green = semi & (g > r + 10) & (g > b + 10)
    return round(light, 3), round(float(green.sum() / max(1, semi.sum())), 3)
kit = f'{pack}/kit'; fv, gv = {}, {}
if os.path.isdir(kit):
    ba = np.asarray(Image.open(f'{kit}/base.png').convert('RGBA'))[..., 3] > 128 if os.path.exists(f'{kit}/base.png') else None
    live = set(); poses = json.load(open(f'{kit}/poses.json'))
    for v in poses.values(): live |= {v.get('arms'), v.get('over')}
    for f in sorted(x for x in live if x):
        e = arm_edges(f'{kit}/{f}', ba)
        if e: fv[f], gv[f] = e
# 只出读数、不判（总管 2026-10-07 定）：这个判法对「白袖子 + 细描边」不适用，又没有真的浅色镶边样本可标定；将来有了坏样本再恢复成判定
res.append({'id': 'arm-fringe', 'title': '手臂层外轮廓最外 2 像素偏亮的比例（只出读数，不判）', 'auto': False, 'info': True, 'pass': True, 'value': {'读数': fv, '曾用过的起步阈值': TH['armFringeMax']}, 'note': '只出读数不判：判法对白袖 + 细描边不适用、无坏样本（W4 复核过 arms_shrug 的高读数是误报）'})
bad = {}; bd = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bad-samples/2026-10-07-arm-green-fringe')
if os.path.isdir(bd):
    for f in sorted(os.listdir(bd)):
        if f.endswith('.png'): bad[f] = arm_edges(f'{bd}/{f}')[1]
res.append({'id': 'arm-green-fringe', 'title': '手臂层半透明外圈不偏绿（绿底抠图的残留）', 'auto': True, 'pass': bool(gv) and max(gv.values()) <= TH['armGreenMax'], 'value': {'外圈半透明像素里偏绿的比例': gv, '阈值': TH['armGreenMax'], '坏样本上的读数': bad}, 'note': cfg['notes'].get('armGreenMax')})
print(json.dumps(res, ensure_ascii=False))
