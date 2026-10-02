"""把 T 字正面立绘拆成 2D 骨骼纸偶部件。
用法（--plates-only 只生成/缓存千问底图，先看底图再标关节）:
  set -a; . ~/.config/tts-keys; set +a
  python3 tools/layers/puppet.py episodes/cast-cyber-girl/cats/puppet/orange/rig.config.json

rig.config.json（路径相对它所在目录，坐标为原图像素）:
  src      T 字正面立绘（白底）
  plates   {名字: {prompt, seed, align_rows}}  千问编辑出的「补遮挡底图」（如 noarms=去掉双臂的身体），
           缓存到 _work/plate-<名字>.png；from=另一张 plate 名表示在它基础上再编辑（链式）；halo=true 表示有发光物（荧光棒），光晕抠成半透明；align_rows 是两图未改动的行区间，用来 ECC 对齐
  props    {名字: {ref, prompt, seed, length}} 道具（千问单独画在白底上），length=在原图里的长度(px)
  joints   {关节名: [x, y]}
  parts    [{name, parent, pivot(关节名), z, source(默认 src，可填 plate 名),
             bone: [关节...] + r(半径) + end(末端骨，超出末关节也算) + disc(在 pivot 处补一个重叠圆盘半径),
             或 trunk: [y0, y1]（躯干类：该行区间内、不属于任何骨段的像素），
             或 prop: 道具名,
             box: [x0,y0,x1,y1] 可选，盒内不属于其他骨段的同源前景并入（握着的道具），
             或 select: 规则（直接按颜色/位置选像素，变量 hair/cloth/x/y），
             rule: 可选额外约束，如 "x<328"}]
分区规则：像素投影落在骨段 [0,1] 内（末端骨 ≥0）且距离 < r → 候选，取最近骨段；
  其余前景按 trunk 行区间归 head/torso/pelvis。子部件在 pivot 处再并上一个 disc 圆盘（同源像素），
  转动时圆盘仍盖住关节，不露缝。
overlays（可选）：{dir, parent, M(近景→本画布 2x3), groups:{eyes:{z,default,scale,center}, mouth:{...}}}
  把 dir/<组>/*.png（与近景同画布对齐的各状态图层）变换过来，裁成 <组>/<状态>.png，puppet.json 里记 states。
输出（config 同目录）：<part>.png（裁到包围盒）+ puppet.json + _work/_review-parts.jpg"""
import json, pathlib, subprocess, sys
import numpy as np, cv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
cfg_p = pathlib.Path([x for x in sys.argv[1:] if not x.startswith('--')][0]).resolve(); base = cfg_p.parent; work = base / '_work'; work.mkdir(exist_ok=True)
cfg = json.loads(cfg_p.read_text()); J = {k: np.array(v, float) for k, v in cfg['joints'].items()}
src = np.asarray(Image.open(base / cfg['src']).convert('RGB')); H, W = src.shape[:2]

def qwen(ref, prompt, seed, out):
    sys.path.insert(0, str(ROOT / 'tools/layers')); from edit import edit
    out = edit(ref, prompt, seed, out)   # EDIT_ENGINE=dt 走本机 Draw Things；=none 干跑
    return np.asarray(Image.open(out).convert('RGB'))

def cutout(img, thr=236, halo=False):
    """白底抠图：与边框连通的近白像素 = 背景（角色内部的白毛/鞋底被描线围住，不受影响）。返回 0..1 alpha。"""
    white = (img.min(-1) >= thr).astype(np.uint8)
    n, lab = cv2.connectedComponents(white, connectivity=4)
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    bg = np.isin(lab, border[border > 0]) if n > 1 else np.zeros_like(white, bool)
    fg = (~bg).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # 描线外沿的浅灰抗锯齿：用「离白色多远」做软边
    soft = np.clip((255 - img.min(-1).astype(np.float32)) / (255 - thr + 1e-6), 0, 1)
    edge = cv2.dilate(fg, np.ones((3, 3), np.uint8)) - cv2.erode(fg, np.ones((3, 3), np.uint8))
    a = fg.astype(np.float32); a[edge > 0] = soft[edge > 0] * fg[edge > 0]  # 边缘带：越白越透明，外侧背景保持 0
    if halo:  # 发光晕：从背景出发、穿过浅色像素（min≥170）能连到的区域都算光晕，alpha 按离白色多远渐变
        light = (img.min(-1) >= 170).astype(np.uint8)
        n2, lab2 = cv2.connectedComponents(light, connectivity=4)
        seeds = np.unique(lab2[bg & (light > 0)]); zone = np.isin(lab2, seeds[seeds > 0])
        ha = np.clip((thr - img.min(-1).astype(np.float32)) / (thr - 170), 0, 1)
        a[zone] = np.minimum(a[zone], ha[zone])
        # 光晕颜色是画在白底上的（预乘了白色），反预乘恢复成纯色光，叠在任何背景上都不会发灰
        az = np.maximum(a[..., None], 1e-3); un = np.clip((img.astype(np.float32) - (1 - az) * 255) / az, 0, 255)
        img[zone] = un[zone].astype(np.uint8)
    return a

def align(img, rows):
    """把千问底图 ECC 仿射对齐到原图，只用 rows 行区间（未改动部分）。"""
    img = cv2.resize(img, (W, H), interpolation=cv2.INTER_LANCZOS4)
    m = np.zeros((H, W), np.uint8)
    for y0, y1 in rows: m[y0:y1] = 1
    g1, g2 = [cv2.cvtColor(x, cv2.COLOR_RGB2GRAY).astype(np.float32) for x in (src, img)]
    warp = np.eye(2, 3, dtype=np.float32)
    _, warp = cv2.findTransformECC(g1, g2, warp, cv2.MOTION_AFFINE, (3, 200, 1e-6), m, 5)
    print('  ECC', np.round(warp, 3).tolist())
    return cv2.warpAffine(img, warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderValue=(255, 255, 255))

sources = {'src': src}
for name, P in cfg.get('plates', {}).items():
    print('plate', name)
    ref = work / f"plate-{P['from']}.png" if P.get('from') else base / cfg['src']
    sources[name] = align(qwen(ref, P['prompt'], P['seed'], work / f'plate-{name}.png'), P['align_rows'])
if '--plates-only' in sys.argv: sys.exit(0)
for k in sources: sources[k] = sources[k].copy()   # cutout(halo) 会就地反预乘光晕颜色
alphas = {k: cutout(v, halo=cfg.get('plates', {}).get(k, {}).get('halo', False)) for k, v in sources.items()}

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
def seg_dist(p0, p1, end):
    d = p1 - p0; L2 = (d ** 2).sum(); t = ((xx - p0[0]) * d[0] + (yy - p0[1]) * d[1]) / L2
    ok = (t >= 0) & ((t <= 1) | end)
    tc = np.clip(t, 0, None if end else 1)
    return np.hypot(xx - (p0[0] + tc * d[0]), yy - (p0[1] + tc * d[1])), ok

def rule_env(s):
    hsv = cv2.cvtColor(sources[s], cv2.COLOR_RGB2HSV).astype(int); h, sat, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    cloth = (((h > 80) & (h < 100)) | (h > 150) | (h < 5) | ((h > 20) & (h < 38))) & (sat > 90) & (v > 120)
    cloth = cv2.dilate(cloth.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0   # 连带衣服边上的描线
    hair = (h >= 5) & (h <= 25) & (sat > 60) & (v > 40) & (v < 200)   # 棕色头发
    return dict(x=xx, y=yy, cloth=cloth, hair=hair)

def bone_dist(P, s='src'):
    js = [J[j] for j in P['bone']]; best = np.full((H, W), np.inf, np.float32)
    for i in range(len(js) - 1):
        dd, ok = seg_dist(js[i], js[i + 1], bool(P.get('end')) and i == len(js) - 2)
        best = np.where(ok & (dd < best), dd, best)
    best = np.where(best < P['r'], best, np.inf)
    if P.get('rule'):  # rule 在归属竞争时就生效：不满足的像素让给别的骨段（如尾巴不许抢裤腿描边）
        best = np.where(eval(P['rule'], {'np': np}, rule_env(s)), best, np.inf)
    return best

bone_parts = [P for P in cfg['parts'] if 'bone' in P]
owner = {}  # 每个 source 上：像素 → 最近骨段编号（-1 = 无）
for s in sources:
    D = np.stack([bone_dist(P, s) for P in bone_parts]); fg = alphas[s] > 0.02
    o = np.where(np.isfinite(D.min(0)) & fg, D.argmin(0), -1); owner[s] = o

out_parts = []; review = []
for P in cfg['parts']:
    name = P['name']
    if 'prop' in P:
        pr = cfg['props'][P['prop']]
        img = qwen(base / pr['ref'], pr['prompt'], pr['seed'], work / f'prop-{P["prop"]}.png')
        a = cutout(img); ys, xs = np.nonzero(a > 0.5)
        crop = np.dstack([img, (a * 255).astype(np.uint8)])[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        s = pr['length'] / crop.shape[0]
        crop = np.asarray(Image.fromarray(crop).resize((max(1, round(crop.shape[1] * s)), round(crop.shape[0] * s)), Image.LANCZOS))
        g = J[P['pivot']]; ch, cw = crop.shape[:2]
        x0, y0 = int(round(g[0] - cw / 2)), int(round(g[1] - ch * 0.55))  # 握点在棒中间略偏下
        rgba = crop
    else:
        s = P.get('source', 'src'); img, al = sources[s], alphas[s]
        if 'bone' in P:
            m = owner[s] == bone_parts.index(P)
        elif 'select' in P:  # 直接按规则选像素（不参与骨段归属），如长发后片、刘海
            m = (al > 0.02) & eval(P['select'], {'np': np}, rule_env(s))
            m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
        else:
            y0_, y1_ = P['trunk']; m = (owner[s] < 0) & (al > 0.02) & (yy >= y0_) & (yy < y1_)
        if P.get('box'):  # 盒内的同源前景（不属于别的骨段）也并入，如拳头里握着的荧光棒伸出胶囊外的部分
            bx0, by0, bx1, by1 = P['box']; me = bone_parts.index(P) if 'bone' in P else -2
            m |= (al > 0.02) & (xx >= bx0) & (xx < bx1) & (yy >= by0) & (yy < by1) & ((owner[s] < 0) | (owner[s] == me))
        if P.get('rule') and 'bone' not in P:
            m &= eval(P['rule'], {'np': np}, rule_env(s))
        if P.get('disc'):
            c = J[P['pivot']]; m |= (np.hypot(xx - c[0], yy - c[1]) < P['disc']) & (al > 0.02)
        m = m.astype(np.float32)
        a = al * cv2.GaussianBlur(m, (0, 0), 0.8)
        # 部件内部 < 200px 的小洞补实（底图描线处偶有细白缝连到外面，被抠成透明，转动后会露出来）
        solid = (a > 0.5).astype(np.uint8); inv = 1 - solid
        n_, lab_, st_, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
        brd = set(np.unique(np.r_[lab_[0], lab_[-1], lab_[:, 0], lab_[:, -1]]))
        small = [i for i in range(1, n_) if i not in brd and st_[i, cv2.CC_STAT_AREA] < 200]
        if small: a[np.isin(lab_, small)] = 1.0   # 分区线轻微羽化（1px），外轮廓用抠图自己的软边
        ys, xs = np.nonzero(a > 0.01)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        rgba = np.dstack([img, (a * 255 + 0.5).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba).save(base / f'{name}.png')
    pv = J[P['pivot']]
    out_parts.append(dict(name=name, file=f'{name}.png', parent=P['parent'], z=P['z'], origin=[int(x0), int(y0)], disc=P.get('disc', 0),
                          size=[int(rgba.shape[1]), int(rgba.shape[0])], pivot=[float(pv[0]), float(pv[1])],
                          pivot_local=[float(pv[0] - x0), float(pv[1] - y0)]))
    review.append((name, rgba))
    print(f'{name:10s} origin={x0},{y0} size={rgba.shape[1]}x{rgba.shape[0]}')

# 眼口替换图：近景 closeup/layers 的各状态图层 → 相似变换缩放到本画布，裁到各组的公共包围盒
if cfg.get('overlays'):
    O = cfg['overlays']; odir = base / O['dir']; M0 = np.vstack([np.array(O['M'], float), [0, 0, 1]])
    par = next(p for p in out_parts if p['name'] == O['parent'])
    for g, G in O['groups'].items():
        M = M0
        if G.get('scale'):
            cx_, cy_ = G['center']; k = G['scale']
            M = np.array([[k, 0, cx_ * (1 - k)], [0, k, cy_ * (1 - k)], [0, 0, 1]]) @ M0
        files = sorted((odir / g).glob('*.png')); warped = {}
        for f in files:
            im = np.asarray(Image.open(f).convert('RGBA'))
            warped[f.stem] = cv2.warpAffine(im, M[:2], (W, H), flags=cv2.INTER_AREA, borderValue=(0, 0, 0, 0))
        allA = sum((w[..., 3] > 4).astype(np.uint8) for w in warped.values()); ys, xs = np.nonzero(allA)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        (base / g).mkdir(exist_ok=True); states = {}
        for st, w in warped.items():
            Image.fromarray(w[y0:y1, x0:x1]).save(base / g / f'{st}.png'); states[st] = f'{g}/{st}.png'
        out_parts.append(dict(name=g, file=states[G['default']], parent=O['parent'], z=G['z'], origin=[int(x0), int(y0)],
                              size=[int(x1 - x0), int(y1 - y0)], pivot=par['pivot'], pivot_local=[par['pivot'][0] - x0, par['pivot'][1] - y0],
                              states=states))
        print(f'overlay {g}: {len(states)} 个状态 origin={x0},{y0} size={x1 - x0}x{y1 - y0}')

json.dump(dict(src=cfg['src'], canvas=[W, H], joints=cfg['joints'],
               note='origin=部件 PNG 左上角在原画布的位置；pivot=关节枢轴（原画布坐标），pivot_local=相对部件 PNG；'
                    '角度正值=屏幕上顺时针；世界变换 = 父变换 · T(pivot) · R(θ) · T(-pivot)；按 z 从小到大画。_l/_r=画面左/右。',
               parts=out_parts), open(base / 'puppet.json', 'w'), ensure_ascii=False, indent=1)

# 部件总览（棋盘格底）
tiles = []
for name, rgba in sorted(review, key=lambda r: r[0]):
    t = Image.new('RGBA', (240, 260), (235, 235, 235, 255))
    for i in range(0, 240, 20):
        for j in range(0, 240, 20):
            if (i + j) // 20 % 2: t.paste((210, 210, 210, 255), (i, j, i + 20, j + 20))
    im = Image.fromarray(rgba); im.thumbnail((230, 230)); t.alpha_composite(im, ((240 - im.width) // 2, (240 - im.height) // 2))
    from PIL import ImageDraw; ImageDraw.Draw(t).text((6, 242), name, fill=(0, 0, 0)); tiles.append(t)
cols = 7; S = Image.new('RGB', (240 * cols, 260 * ((len(tiles) + cols - 1) // cols)), 'white')
for i, t in enumerate(tiles): S.paste(t.convert('RGB'), ((i % cols) * 240, (i // cols) * 260))
S.save(work / '_review-parts.jpg', quality=90)
print('wrote', base / 'puppet.json')
