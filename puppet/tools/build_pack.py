"""从角色的来源素材目录生成角色数据包（character.json、parts.json、tex/、kit/、provenance.json）。
用法：python3 tools/build_pack.py <来源素材目录> <输出的角色目录>      例：python3 tools/build_pack.py characters/beret-girl/source characters/beret-girl
来源目录里要有：头部部件表和贴图、头发各片和 hair.json、脸和眼睛的清理版、深度表、姿势库、脖子层、（可选）身体部件表和母版。
各类素材在来源目录里的相对位置由 LAYOUT 决定；来源目录里放一个 layout.json 可以改（键见下面的 LAYOUT），不放就用默认布局。
坐标统一成角色坐标（部件表的画布）；头部母版像素 + head_master_origin = 角色坐标。
左右统一成「角色自己的左右」：来源文件里的 L 是画面左，也就是角色的右，这里翻过来并做断言。
注意：这个脚本目前只认第一个角色（贝雷帽女孩）的来源格式——部件名、眼睛的闭合公式、脖子的画法都是照它写的，还不是通用的「任意角色」生成器。"""
import json, math, shutil, sys, os, hashlib
src, out = sys.argv[1], sys.argv[2]
# 各类素材在来源目录里的位置（相对来源目录）。默认是 characters/<角色>/source 的标准布局；来源目录里有 layout.json 就用它覆盖。
LAYOUT = {'rig': 'head/rig.json', 'parts': 'head', 'hair': 'hair', 'face': 'face', 'depths': 'depths.json', 'kit': 'poses', 'neck': 'neck', 'body': 'body', 'master': 'master/pose_idle_f.png'}
if os.path.exists(os.path.join(src, 'layout.json')): LAYOUT.update(json.load(open(os.path.join(src, 'layout.json'))))
def S(key, *rest): return os.path.join(src, LAYOUT[key], *rest)
# 只带明确落定的素材：PUPPET_KEEP=hair,hat,face,eyes,mouth,kit（逗号分隔）里列到的那几类不从来源目录重读，沿用输出目录里现有的贴图。
# （来源目录可能有几个人同时在改；整包重读会把别人改到一半的文件顺手带进来——2026-10-07 口型就这样带进过一次。）
# PUPPET_KEEP_KIT=1 等价于在 PUPPET_KEEP 里写 kit。
KEEP = set(filter(None, os.environ.get('PUPPET_KEEP', '').split(','))) | ({'kit'} if os.environ.get('PUPPET_KEEP_KIT') == '1' else set())
_prev = {}
if KEEP - {'kit'} and os.path.isdir(f'{out}/tex'):
    import tempfile; _hold = tempfile.mkdtemp(); shutil.copytree(f'{out}/tex', f'{_hold}/tex'); _prev = {'dir': f'{_hold}/tex', 'parts': {p['id']: p for p in json.load(open(f'{out}/parts.json'))}}
def _kind(pid):
    if pid.startswith('mouth'): return 'mouth'
    if pid.startswith(('eye_', 'iris_', 'lash_', 'lid_')): return 'eyes'
    if pid in ('face', 'nose') or pid.startswith('brow_'): return 'face'
    if pid == 'hat': return 'hat'
    return None
NOD = 8
# ── 整头一体（#1160，用户反馈：低头时头发不跟、刘海缝里额头越露越多；转头时后发的发尖从侧发外面露出第二层）
# 点头：整个头（帽子、全部头发、脸、五官）一起上下移，层间只留很小的视差——纵向深度 = NOD_BASE + NOD_PARALLAX ×（横向深度 − NOD_BASE）。
#       不再靠把某一层钉住来遮缝。脖子不属于头，不动。
# 转头：后发和内层发的深度向侧发靠拢（原来 −0.08 / 0.05 对侧发 0.38，转 24° 相对错开 60 多像素）。
# ── 帽子跟着头转，并且有一点体积（#1165，用户反馈：转头时帽子留在原地，头在帽子里转）
# 帽子不再是整片一个深度：给它一张网格，每个格点有自己的横向深度——
#   帽檐下缘：每一处都取「它正下方压着的那片头发」的深度（正中压着刘海就跟刘海走，两角压着侧发就跟侧发走），沿帽檐做一点平滑；
#   帽顶：取一个比帽檐浅的值（离观众远），所以转头时帽檐前缘比帽顶动得多，像扣在圆头顶上的帽子，而不是一张平移的贴纸；
#   帽顶到帽檐之间按每一列自己的「上缘 → 下缘」平滑过渡。
# 做法：部件自己的 depth 取帽顶的值，其余部分的差额写成转头参数两端的关键形（网格顶点的横向位移）。
# 呆毛长在帽顶上：深度取帽子在它根部那一点的值。讲解员挂点里「贴在帽子上」的点取帽顶的值。
HAT_GRID = (24, 12); HAT_TOP_DEPTH = 0.36; HAT_UNDER = ('bangs', 'side_L', 'side_R')          # 帽檐可能压着的头发片
def hat_follows_head(parts, R, turn_param, turn_max, tex_dir):
    import numpy as np
    from PIL import Image
    by = {p['id']: p for p in parts}; hat = by.get('hat')
    if not hat: return {}
    def alpha(p):
        x, y, w, h = [round(v) for v in p['rect']]; a = Image.open(os.path.join(tex_dir, os.path.basename(p['texture']))).convert('RGBA').split()[3]
        return np.asarray(a if a.size == (w, h) else a.resize((w, h))) > 128, x, y
    ha, hx, hy = alpha(hat); H, W = ha.shape; under = [(by[i], *alpha(by[i])) for i in HAT_UNDER if i in by]
    cols, rows = HAT_GRID; top = np.full(cols + 1, np.nan); bot = np.full(cols + 1, np.nan); tgt = np.full(cols + 1, np.nan)
    for c in range(cols + 1):
        x = min(W - 1, round(c / cols * (W - 1))); band = ha[:, max(0, x - 6):x + 7].any(1); ys = np.where(band)[0]
        if not len(ys): continue
        top[c], bot[c] = ys.min(), ys.max(); best = None
        for p, al, px, py in under:          # 这一列帽檐下缘正下方 8 像素处是哪片头发（层序最上的）
            ix, iy = hx + x - px, hy + int(bot[c]) + 8 - py
            if 0 <= ix < al.shape[1] and 0 <= iy < al.shape[0] and al[iy, ix] and (best is None or p['order'] > best['order']): best = p
        if best is not None: tgt[c] = best['depth']
    idx = np.arange(cols + 1); ok = ~np.isnan(tgt)
    tgt = np.interp(idx, idx[ok], tgt[ok]) if ok.any() else np.full(cols + 1, HAT_TOP_DEPTH)          # 下面没有头发的列：从两边插过来
    tgt = np.convolve(np.pad(tgt, 1, mode='edge'), [0.25, 0.5, 0.25], mode='valid')                      # 沿帽檐平滑一下，免得相邻两片头发深度不同处折一下
    for a in (top, bot): m = ~np.isnan(a); a[:] = np.interp(idx, idx[m], a[m])
    s = math.sin(math.radians(turn_max)); off = []; field = np.zeros((rows + 1, cols + 1))
    for r in range(rows + 1):
        y = r / rows * (H - 1)
        for c in range(cols + 1):
            t = min(1.0, max(0.0, (y - top[c]) / max(1.0, bot[c] - top[c]))); t = t * t * (3 - 2 * t)
            field[r, c] = HAT_TOP_DEPTH + (tgt[c] - HAT_TOP_DEPTH) * t; off += [round((field[r, c] - HAT_TOP_DEPTH) * R * s, 3), 0]
    hat['depth'] = HAT_TOP_DEPTH; hat['mesh'] = {'grid': [cols, rows]}
    hat['keyforms'] = [{'at': {turn_param: -turn_max}, 'offsets': [-v for v in off]}, {'at': {turn_param: turn_max}, 'offsets': off}]
    info = {'hatTop': HAT_TOP_DEPTH, 'brimDepthMin': round(float(tgt.min()), 3), 'brimDepthMax': round(float(tgt.max()), 3)}
    ah = by.get('ahoge')
    if ah:          # 呆毛根部（支点）在帽子矩形里的位置 → 帽子在那里的深度（双线性取网格上的值）
        px, py = ah.get('pivot', [ah['rect'][0] + ah['rect'][2] / 2, ah['rect'][1] + ah['rect'][3]])
        u = min(max((px - hx) / W * cols, 0), cols - 1e-6); v = min(max((py - hy) / H * rows, 0), rows - 1e-6); ci, ri = int(u), int(v); fu, fv = u - ci, v - ri
        ah['depth'] = round(float((field[ri, ci] * (1 - fu) + field[ri, ci + 1] * fu) * (1 - fv) + (field[ri + 1, ci] * (1 - fu) + field[ri + 1, ci + 1] * fu) * fv), 4); info['ahoge'] = ah['depth']
    return info
NOD_BASE, NOD_PARALLAX, BACK_TURN_DEPTH = 0.37, 0.15, 0.30
def nod_depth(d): return round(NOD_BASE + NOD_PARALLAX * (d - NOD_BASE), 4)
def whole_head(parts, behind_face):
    for p in parts:
        if p.get('group') != 'head': continue
        if p['id'] in behind_face and p['depth'] < BACK_TURN_DEPTH: p['depth'] = BACK_TURN_DEPTH
        p['depthY'] = nod_depth(p['depth'])

rig = json.load(open(S('rig'))); hair = json.load(open(S('hair', 'hair.json'))); dep = json.load(open(S('depths')))
ORG = dep['unit']['head_master_origin_in_character_px']; R = dep['unit']['R']; assert R == hair['face_half_width_R']
P = {p['id']: p for p in rig['parts']}
# 眼睛各层：face/eyes.json 在的话用那边重做过的贴图和矩形（虹膜、眼白的矩形和旧的不一样）；PUPPET_OLD_EYES=1 强制用 parts/ 里的旧眼睛（出新旧对比图用）
EYES, LIDS, LOW_DY = {}, [], {}
if os.environ.get('PUPPET_OLD_EYES') != '1' and os.path.exists(S('face', 'eyes.json')):
    for e in json.load(open(S('face', 'eyes.json')))['parts']:
        if e.get('role') == 'lid' and os.path.exists(S('face', e['src'])) and os.environ.get('PUPPET_NO_LID') != '1': LIDS.append(e)
        if e.get('close_behavior') and os.environ.get('PUPPET_NO_LID') != '1': LOW_DY[e['id']] = e['close_behavior']['dy_at_full_close']
        if e['id'] in P and os.path.exists(S('face', e['src'])): EYES[e['id']] = e['src']; P[e['id']] = {**P[e['id']], 'rect': e['rect']}
cx = rig['head']['center'][0]
def depth_of(i): return next(d['depth'] for d in dep['depths'] if i.startswith(d['prefix']))
RENAME = {'eyeWhite': 'eye_white', 'iris': 'iris', 'eyeHl': 'eye_highlight', 'eyeLow': 'lash_lower', 'lash': 'lash', 'brow': 'brow'}
def new_id(i):
    for old, new in RENAME.items():
        if i.startswith(old) and i[len(old):] in ('L', 'R'):
            x = P[i]['rect'][0] + P[i]['rect'][2] / 2; side = i[-1]
            assert (x < cx) == (side == 'L'), f'{i}: 旧文件的 L 应在画面左'
            return f"{new}_{'R' if side == 'L' else 'L'}"      # 画面左 = 角色的右
    return {'mouth_closed': 'mouth'}.get(i, i)
os.makedirs(f'{out}/tex', exist_ok=True)
parts, prov, order = [], [], 0
def add(pid, file, rect, depth, family=None, extra=None):
    global order; order += 10
    tex = f'tex/{pid}.png'; kind = _kind(pid) or ('hair' if (extra or {}).get('family') == 'hair' else None); kept = kind in KEEP and pid in _prev.get('parts', {})
    if kept: shutil.copyfile(f"{_prev['dir']}/{pid}.png", f'{out}/{tex}'); rect = _prev['parts'][pid]['rect']
    else: shutil.copyfile(file, f'{out}/{tex}')
    p = {'id': pid, 'group': 'head', 'texture': tex, 'rect': [round(v, 3) for v in rect], 'order': order, 'depth': depth}
    if family: p['family'] = family
    if extra: p.update(extra)
    if kept and 'pivot' in _prev['parts'][pid]: p['pivot'] = _prev['parts'][pid]['pivot']          # 保留的部件连支点也用原来的
    parts.append(p); prov.append({'part': pid, 'from': '（沿用数据包里原有的）' if kept else os.path.relpath(file, src), 'sha1': hashlib.sha1(open(f'{out}/{tex}', 'rb').read()).hexdigest()[:12]})
# 脸底、眉、鼻、嘴优先用 face/ 里清理过的版本（同尺寸同矩形）；眼睛各层见上面的 EYES
CLEAN = ('face', 'brow', 'nose', 'mouth')
def file_of(i):
    if i in EYES: return S('face', EYES[i])
    f = S('face', P[i]['src'])
    return f if i.startswith(CLEAN) and os.path.exists(f) else S('parts', P[i]['src'])
def add_rig(i, family=None, extra=None): add(new_id(i), file_of(i), P[i]['rect'], depth_of(i), family, extra)
def add_hair(pc):
    x, y, w, h = pc['rect']; extra = {'pivot': [pc['anchor'][0] + ORG[0], pc['anchor'][1] + ORG[1]], 'family': 'hair'}
    wf = S('hair', pc['weight'])
    kw = 'hair' in KEEP and _prev and os.path.exists(f"{_prev['dir']}/{pc['name']}_w.png")          # 权重图和发片一起保留
    if kw or os.path.exists(wf): shutil.copyfile(f"{_prev['dir']}/{pc['name']}_w.png" if kw else wf, f"{out}/tex/{pc['name']}_w.png"); extra['weight'] = f"tex/{pc['name']}_w.png"
    add(pc['name'], S('hair', pc['file']), [x + ORG[0], y + ORG[1], w, h], pc['depth'], None, extra)
FACE = ['face', 'nose', 'eyeWhiteL', 'irisL', 'eyeHlL', 'eyeLowL', 'lashL', 'eyeWhiteR', 'irisR', 'eyeHlR', 'eyeLowR', 'lashR', 'mouth_closed']
fam = lambda i: ('eye_' + new_id(i)[-1]) if i[-1] in 'LR' and i != 'mouth_closed' else None
overlay_face = None
for pc in sorted(hair['pieces'], key=lambda p: p['z']):
    if pc['name'] == 'ahoge': continue
    add_hair(pc)
    if pc['name'] == hair['face_layer_goes_after']:
        for i in FACE: add_rig(i, fam(i), {'mask': {'by': ['eye_white_' + new_id(i)[-1]]}} if i.startswith(('iris', 'eyeHl')) else None)
        order += 5; overlay_face = order
for i in ('browL', 'browR'): add_rig(i, 'brow_' + new_id(i)[-1])
add_hair(next(p for p in hair['pieces'] if p['name'] == 'ahoge'))
add_rig('hat')
# ── 眨眼 / 笑眼 / 睁大 / 视线 / 眉 / 口型：旧 rig（rig/chibi-morph.js 的 deform）是逐顶点现算的，这里烘成参数格上的关键形
def grid_pts(rect, cols, rows): x, y, w, h = rect; return [(x + w * i / cols, y + h * j / rows) for j in range(rows + 1) for i in range(cols + 1)]
def flat(v): return [round(c, 3) for xy in v for c in xy]
by = {p['id']: p for p in parts}
for old, side in (('L', 'R'), ('R', 'L')):          # 旧文件的 L（画面左）= 角色的右
    e = rig['eyes'][old]; eh = e['bottom'] - e['top']; OPEN, SMILE = f'ParamEye{side}Open', f'ParamEye{side}Smile'
    xc = lambda x: max(-1, min(1, (x - e['center'][0]) / e['hw']))
    # 闭合线。有闭眼线部件（lid）时，正常闭眼的弧度和位置对到那条线上（W1 的公式：弧高 0.17·eh，再低 3 像素），
    # 这样睫毛合上后下缘正好落在闭眼线上，读成一道弧；不然睫毛停在它上方十几像素，会变成「一条粗杠 + 下面一道细线」。
    has_lid = any(l['eye'] == old for l in LIDS); arc0, drop = (0.17, 3) if has_lid else (0.10, 0)
    line = lambda x, smile: e['top'] + eh * e.get('closeAt', 0.72) + eh * (arc0 + (-0.20 - arc0) * smile) * (1 - xc(x) ** 2) + drop * (1 - smile)
    w = by[f'eye_white_{side}']; w['mesh'] = {'grid': [8, 8]}; pts = grid_pts(w['rect'], 8, 8)
    shut = lambda smile, c=1.0: flat([(0, (line(x, smile) - y) * c if y < line(x, smile) else 0) for x, y in pts])
    wide = flat([(0, -0.3 * eh * 0.5 * (1 - 0.5 * xc(x) ** 2) * max(0, min(1, (e['bottom'] - y) / eh * 1.6))) for x, y in pts])
    w['keyforms'] = [{'at': {OPEN: 0, SMILE: 0}, 'offsets': shut(0), 'opacity': 0}, {'at': {OPEN: 0.18, SMILE: 0}, 'offsets': shut(0, 0.82)}, {'at': {OPEN: 1.3, SMILE: 0}, 'offsets': wide},
                     {'at': {OPEN: 0, SMILE: 1}, 'offsets': shut(1), 'opacity': 0}, {'at': {OPEN: 0.18, SMILE: 1}, 'offsets': shut(1), 'opacity': 0}, {'at': {OPEN: 1, SMILE: 1}, 'offsets': shut(1), 'opacity': 0}, {'at': {OPEN: 1.3, SMILE: 1}, 'offsets': shut(1), 'opacity': 0}]
    # 笑眼中途（SMILE = HS）这一列：旧 rig 里眼白 / 虹膜要到「闭合 82% 以上」才淡出，不是随笑眼线性淡出；少了这一列，半笑的时候眼睛会一直半透明
    HS = 0.82; cs = lambda o: 1 - o * (1 - HS)
    w['keyforms'] += [{'at': {OPEN: o, SMILE: HS}, 'offsets': shut(HS, cs(o)), 'opacity': op} for o, op in ((0, 0), (0.18, 0), (1, 1), (1.3, 1))]
    l = by[f'lash_{side}']; l['mesh'] = {'grid': [8, 6]}; pts = grid_pts(l['rect'], 8, 6)
    down = lambda smile: flat([(0, line(x, smile) - (e['top'] + eh * e.get('lashArch', 0.42) * xc(x) ** 2)) for x, y in pts])
    up = flat([(0, -0.3 * eh * 0.5 * (1 - 0.5 * xc(x) ** 2)) for x, y in pts])
    l['keyforms'] = [{'at': {OPEN: 0, SMILE: 0}, 'offsets': down(0)}, {'at': {OPEN: 1.3, SMILE: 0}, 'offsets': up}] + [{'at': {OPEN: o, SMILE: 1}, 'offsets': down(1)} for o in (0, 1, 1.3)]
    for pid, g in ((f'iris_{side}', 1), (f'eye_highlight_{side}', 0.55)):
        q = by[pid]; q['pivot'] = e['iris']; k = 1 if g == 1 else 0.5
        q['keyforms'] = [{'at': {'ParamEyeBallX': v}, 'translate': [v * e['gaze'][0] * g, 0]} for v in (-1, 1)] + [{'at': {'ParamEyeBallY': v}, 'translate': [0, v * e['gaze'][1] * g]} for v in (-1, 1)] \
            + [{'at': {'ParamIrisScale': v}, 'scale': [1 + (v - 1) * k] * 2} for v in (0.6, 1.3)] \
            + [{'at': {OPEN: 0, SMILE: 0}, 'opacity': 0}, {'at': {OPEN: 0.18, SMILE: 0}, 'opacity': 1}] + [{'at': {OPEN: o, SMILE: 1}, 'opacity': 0} for o in (0, 0.18, 1, 1.3)] \
            + [{'at': {OPEN: o, SMILE: 0.82}, 'opacity': op} for o, op in ((0, 0), (0.18, 0), (1, 1), (1.3, 1))]
    # 下睫毛点：闭合度 0.6 → 1 时整体下移，收拢到闭眼线下面（W1 的 eyes.json：close_behavior）
    dy = LOW_DY.get('eyeLow' + old)
    if dy: by[f'lash_lower_{side}']['keyforms'] = [{'at': {OPEN: 0.4}, 'translate': [0, 0]}, {'at': {OPEN: 0.2}, 'translate': [0, dy * 0.5]}, {'at': {OPEN: 0}, 'translate': [0, dy]}]
    # 闭眼线：只在快闭上（闭合度 ≥ 0.88）时淡入，全闭时不透明；不跟眼珠动、不变形；笑眼时不用它（笑眼的闭合线是反着弯的）
    lid = next((e for e in LIDS if e['eye'] == old), None)
    if lid:
        add(f'lid_{side}', S('face', lid['src']), lid['rect'], lid.get('depth', depth_of('lash')), f'eye_{side}',
            {'keyforms': [{'at': {OPEN: o, SMILE: 0}, 'opacity': a_} for o, a_ in ((0, 1), (0.06, 0.5), (0.12, 0), (1, 0), (1.3, 0))] + [{'at': {OPEN: o, SMILE: 1}, 'opacity': 0} for o in (0, 1, 1.3)]})
        parts[-1]['order'] = by[f'lash_{side}']['order'] + 2; order -= 10; by[parts[-1]['id']] = parts[-1]
    b = by[f'brow_{side}']; b['mesh'] = {'grid': [4, 1]}; pts = grid_pts(b['rect'], 4, 1); sgn = 1 if old == 'L' else -1
    b['keyforms'] = [{'at': {f'ParamBrow{side}Y': v}, 'translate': [0, -v * eh * 0.2]} for v in (-1, 1)] + [{'at': {f'ParamBrow{side}Angle': v}, 'offsets': flat([(0, -v * eh * 0.16 * sgn * (x - e['center'][0]) / e['hw']) for x, y in pts])} for v in (-1, 1)]
# 口型：四张嘴按 ParamMouthShape 取一张；ParamMouthScale 是竖向缩放（负数 = 上下翻，旧 rig 用它做嘴角向下）
mc = rig['mouth']['center']; SHAPES = ['closed', 'small', 'big', 'smile']
by['mouth'].update({'pivot': mc, 'visibleWhen': {'ParamMouthShape': [-0.5, 0.5]}})
for i, name in enumerate(SHAPES[1:], 1):
    order -= 1000   # 插回嘴的层位（紧跟在闭嘴之后）
    add(f'mouth_{name}', file_of('mouth_' + name), P['mouth_' + name]['rect'], depth_of('mouth'), None, {'pivot': mc, 'visibleWhen': {'ParamMouthShape': [i - 0.5, i + 0.5]}})
    parts[-1]['order'] = by['mouth']['order'] + i; order += 1000 - 10
for m in [p for p in parts if p['id'].startswith('mouth')]: m['keyforms'] = [{'at': {'ParamMouthScale': v}, 'scale': [1, v]} for v in (-1, 1.4)]
E_ = rig['eyes']; mouth = rig['mouth']['center']; mid = [(E_['L']['center'][0] + E_['R']['center'][0]) / 2, (E_['L']['center'][1] + E_['R']['center'][1]) / 2]
hh = P['face']['rect'][1] + P['face']['rect'][3] - mid[1]
_face_order = next(p['order'] for p in parts if p['id'] == 'face')
_hat = hat_follows_head(parts, R, 'ParamAngleX', 30, f'{out}/tex')          # 先定帽子和呆毛的横向深度，再统一算点头用的纵向深度
whole_head(parts, {p['id'] for p in parts if p.get('group') == 'head' and p['order'] < _face_order})
# ── 转轴深度（#1166，用户反馈：「转头的时候，头的中心位置左右偏离很大，像头在移动」）
# 深度表里的深度都是同号的正数（后发 0.30 … 鼻 1.0），照它算，转头时整个头的剪影一起往同一边走四五十像素，看起来是头在平移。
# 真正的转头是绕头的竖轴转：外轮廓几乎不动，靠近观众的（五官、刘海、帽檐前缘）往转的方向滑，头后面的（后发）略往反方向走。
# 做法：深度表给一个转轴深度 pivot，头部每一层写进数据包的横向深度 = 表里的深度 − pivot（等价于给整头加一个反向的整体平移）。
# 层与层之间的深度差一律不变（帽檐贴头发、后发不露第二层这些只取决于深度差）；帽子网格的关键形存的是相对帽顶的差额，也不变。
# 点头用的纵向深度 depthY 这次不动。脖子不属于头，深度仍是 0。
PIVOT = float(dep.get('pivot', {}).get('depth', 0))
def turn_depth(d): return round(d - PIVOT, 4)
SHAPE = dep.get('headShape')
# ── 整头的转头位移场（#1170，用户反馈：「live2D 转头的时候，头部所有东西都会对应调整吧？现在……头发有一部分分层没动，帽子没动，没动的就会被拉伸」）
# 「每层一个深度、整片平移」做不出转头：轮廓那几层整片不动，五官在里面滑，帽子被两头扯。改成：头上每一层都有网格，
# 每个网格点的转头位移来自同一个头形（深度表里的 headShape），写进数据包的 mesh.turn = { z, w }（引擎：dx = z·R·sinθ + w·R·(1−cosθ)）。
#   「一张皮」sheet：帽子、呆毛和全部头发共用同一个场——外轮廓处几乎不动（edge），往里很快升到 front，过渡带宽 rim 像素。
#       同一个场 → 这些层之间转头时没有任何相对滑动：帽檐贴着头发、后发不从侧发外面露出来、呆毛接缝，都是自动保住的。
#   「脸」face：脸底和五官——z = z0 + zu2·u² + zv2·(v − vc)²，w = −squeeze·u（u、v 是到头的竖轴 / 脸心的距离 ÷ R）。
#       w 让朝转过去的那半边脸压窄、另一半展宽。系数是对着 3/4 原画的对应点拟合的（见深度表里的说明），不是凭感觉。
#   corrections：按部件加的修正量（在头形之上，鼻尖这种明显凸出来的）。
# 有了位移场，部件自己的 depth（整片平移）归 0；点头用的 depthY 不动（前面按原来的深度算好的）。
def turn_fields(parts, tex_dir, canvas):
    import numpy as np
    from PIL import Image
    from scipy import ndimage as ndi
    AXc = SHAPE.get('axisX', rig['head']['center'][0] - ORG[0]) + ORG[0]; F, SH = SHAPE['face'], SHAPE['sheet']; CELL = SHAPE.get('cell', 48); corr = SHAPE.get('corrections', {})
    is_sheet = lambda pid: any(pid.startswith(k) for k in SH['parts'])
    # 整头剪影（全部头部部件的不透明区域并起来、填洞），在 1/4 分辨率上做；模糊后 0.5 就是外轮廓，往里升到 1
    Wc, Hc = canvas; q = 4; sil = np.zeros((Hc // q + 1, Wc // q + 1), bool)
    for p in parts:
        if p.get('group') != 'head': continue
        x, y, w, h = [int(round(v)) for v in p['rect']]; al = Image.open(os.path.join(tex_dir, os.path.basename(p['texture']))).convert('RGBA').split()[3].resize((max(1, w // q), max(1, h // q)), Image.BILINEAR)
        m = np.asarray(al) > 128; sil[y // q:y // q + m.shape[0], x // q:x // q + m.shape[1]] |= m
    sil = ndi.binary_fill_holes(sil); blur = ndi.gaussian_filter(sil.astype(float), SH['rim'] / q)
    g_img = np.clip((blur - 0.5) / (SH.get('full', 0.95) - 0.5), 0, 1); g_img = ndi.gaussian_filter(g_img, SH['rim'] / q / 4)          # 0 在外轮廓，1 在里面；再轻轻抹一遍，把两头的折角抹圆
    def g_at(x, y): return float(ndi.map_coordinates(g_img, [[np.clip(y / q, 0, g_img.shape[0] - 1)], [np.clip(x / q, 0, g_img.shape[1] - 1)]], order=1)[0])
    def face_zw(x, y, pid=''):
        u = (x - AXc) / R; v = (y - ORG[1] - F['centerY']) / R; u = max(-F.get('uMax', 1.5), min(F.get('uMax', 1.5), u))
        return F['z0'] + F['zu2'] * u * u + F['zv2'] * v * v + next((d for k, d in corr.items() if pid.startswith(k)), 0), -F['squeeze'] * u
    def sheet_zw(x, y, pid=''):
        g = g_at(x, y); return SH['edge'] + (SH['front'] - SH['edge']) * g + next((d for k, d in corr.items() if pid.startswith(k)), 0), -SH.get('squeeze', 0) * (x - AXc) / R * g
    for p in parts:
        if p.get('group') != 'head': continue
        p['depth'] = 0; m = p.get('mesh') or {}
        if p['id'] == 'hat': p.pop('keyforms', None)          # 帽子原来「帽檐跟头发、帽顶另算」的关键形被整头的场取代
        has_off = any('offsets' in k for k in p.get('keyforms', []))
        x, y, w, h = p['rect']; cols, rows = m.get('grid') or [1, 1]
        if not has_off and not m.get('vertices'): cols, rows = max(cols, min(40, math.ceil(w / CELL))), max(rows, min(40, math.ceil(h / CELL)))
        fn = sheet_zw if is_sheet(p['id']) else face_zw; zs, ws = [], []
        for j in range(rows + 1):
            for i in range(cols + 1):
                z, w_ = fn(x + w * i / cols, y + h * j / rows, p['id']); zs.append(round(z, 4)); ws.append(round(w_, 4))
        p['mesh'] = {**m, 'grid': [cols, rows], 'turn': {'z': zs, 'w': ws}}
    # 贴脸层：一张盖满画布的网格，跟着脸的场走（漫符画在它上面）
    oc, orw = math.ceil(Wc / 96), math.ceil(Hc / 96); oz, ow = [], []
    for j in range(orw + 1):
        for i in range(oc + 1):
            z, w_ = face_zw(Wc * i / oc, Hc * j / orw); oz.append(round(z, 4)); ow.append(round(w_, 4))
    return {'grid': [oc, orw], 'turn': {'z': oz, 'w': ow}}, {'axisX': AXc, 'faceAt': lambda x, y: face_zw(x, y)}
FACE_OVERLAY = None
if SHAPE: FACE_OVERLAY, _shape_info = turn_fields(parts, f'{out}/tex', rig['size'])
else:
    for p in parts:
        if p.get('group') == 'head': p['depth'] = turn_depth(p['depth'])
HOST = {
  'height': rig['height'], 'foot': rig['foot'], 'kit': 'kit/', 'kitScale': 2, 'shoulders': {'L': [440, 715], 'R': [654, 715]}, 'midX': 547, 'yawMax': 24,
  # 头上的点贴在哪一层：按这一层的深度随转头平移
  'pointDepth': {k: (0 if SHAPE else turn_depth(v)) for k, v in {'face': 0.6, 'hair': 0.55, 'hat': _hat.get('hatTop', 0.08)}.items()},
  # 有整头位移场时：头上的点跟着这一层对应的部件的场走（脸 → 脸底，头发 → 刘海，帽子 → 帽子）
  **({'pointPart': {'face': 'face', 'hair': 'bangs', 'hat': 'hat'}} if SHAPE else {}), 'pointDepthY': {k: nod_depth(v) for k, v in {'face': 0.6, 'hair': 0.55, 'hat': _hat.get('hatTop', 0.08)}.items()},
  # 挂点（部件像素）。eyeL / eyeR、cheekL / cheekR 等是画面左 / 右（表情库的叫法），不是角色的左右
  'points': {'eyeL': [*E_['L']['center'], 'face'], 'eyeR': [*E_['R']['center'], 'face'], 'mouth': [*mouth, 'face'], 'cheekL': [820, 1190, 'face'], 'cheekR': [1330, 1190, 'face'], 'chin': [1075, 1335, 'face'],
             'forehead': [1078, 860, 'hair'], 'templeL': [640, 900, 'hair'], 'templeR': [1520, 900, 'hair'], 'top': [1100, 300, 'hat'], 'crownL': [700, 420, 'hat'], 'crownR': [1500, 420, 'hat']},
}
character = {
  'version': 1, 'id': os.path.basename(out.rstrip('/')), 'name': '贝雷帽女孩', 'canvas': {'width': rig['size'][0], 'height': rig['size'][1]},
  'unit': {'R': R, 'hh': round(hh, 1), 'headCenter': rig['head']['center'], 'neckPivot': rig['head']['neck'], 'headMasterOrigin': ORG, **({} if SHAPE else {'turnPivotDepth': PIVOT})},          # turnPivotDepth 只是记录：各层的 depth 已经减过它了，引擎不读
  'turn': {'x': {'parameter': 'ParamAngleX', 'degreesPerUnit': 1}, 'y': {'parameter': 'ParamAngleY', 'degreesPerUnit': 1}},
  # ParamAngleY 的范围是目检出来的：只靠平移的点头，超过这个幅度脸会滑出发底 / 帽檐下露肤色
  'parameters': [{'id': 'ParamAngleX', 'min': -30, 'max': 30, 'default': 0}, {'id': 'ParamAngleY', 'min': -NOD, 'max': NOD, 'default': 0}, {'id': 'ParamAngleZ', 'min': -30, 'max': 30, 'default': 0}]
    + [{'id': f'ParamEye{s}{k}', 'min': 0, 'max': mx, 'default': d} for s in 'LR' for k, mx, d in (('Open', 1.3, 1), ('Smile', 1, 0))]
    + [{'id': i, 'min': -1, 'max': 1, 'default': 0} for i in ('ParamEyeBallX', 'ParamEyeBallY', 'ParamBrowLY', 'ParamBrowRY', 'ParamBrowLAngle', 'ParamBrowRAngle')]
    + [{'id': 'ParamIrisScale', 'min': 0.6, 'max': 1.3, 'default': 1}, {'id': 'ParamMouthShape', 'min': 0, 'max': 3, 'default': 0}, {'id': 'ParamMouthScale', 'min': -1, 'max': 1.4, 'default': 1}],
  'mouthShapes': SHAPES,
  'groups': [{'id': 'head', 'pivot': rig['head']['neck'], 'bindings': [{'parameter': 'ParamAngleZ', 'channel': 'rotate', 'k': 0.4}]}],
  'families': [{'id': f} for f in ['eye_L', 'eye_R', 'brow_L', 'brow_R', 'hair']],
  'poseGroups': [], 'physics': [],
  # 挂点的名字沿用漫符库的叫法：eyeL / eyeR 是画面左 / 右（不是角色的左右）
  'anchors': {'eyeL': {'part': 'eye_white_R', 'at': E_['L']['center']}, 'eyeR': {'part': 'eye_white_L', 'at': E_['R']['center']},
              'mouth': {'part': 'mouth', 'at': mouth}, 'forehead': {'part': 'face', 'at': [mid[0], mid[1] - 0.55 * hh]},
              'cheekL': {'part': 'face', 'at': [E_['L']['center'][0] - 0.1 * R, mid[1] + 0.42 * hh]}, 'cheekR': {'part': 'face', 'at': [E_['R']['center'][0] + 0.1 * R, mid[1] + 0.42 * hh]},
              'top': {'part': 'hat', 'at': [cx, P['hat']['rect'][1]]}, 'chin': {'part': 'face', 'at': [mid[0], P['face']['rect'][1] + P['face']['rect'][3]]}},
  # 槽位：宿主（表情库）要整组藏掉或替换的部件
  'slots': {'eyes': [p['id'] for p in parts if p.get('family', '').startswith('eye_')], 'brows': [p['id'] for p in parts if p.get('family', '').startswith('brow_')], 'mouth': [p['id'] for p in parts if p['id'].startswith('mouth')]},
  'overlays': [{'id': 'back', 'order': 0, 'group': 'head'}, {'id': 'face', 'order': overlay_face, 'group': 'head', 'clipTo': 'face', **(FACE_OVERLAY or {}), 'depth': 0 if SHAPE else turn_depth(depth_of('eyeWhite')), 'depthY': nod_depth(depth_of('eyeWhite'))}, {'id': 'top', 'order': 100000}],
  'files': {'parts': 'parts.json', 'provenance': 'provenance.json'},
  # 讲解员（puppet/host/）要的数：身高和脚底（部件像素）、姿势图层的缩放和肩头支点（姿势图层像素）、日常转头上限、给表情库的挂点
  'host': HOST,
}
json.dump(character, open(f'{out}/character.json', 'w'), ensure_ascii=False, indent=1)
json.dump(parts, open(f'{out}/parts.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'imported_from': os.path.relpath(src, out), 'note': '贴图是原文件的拷贝，像素没动', 'parts': prov}, open(f'{out}/provenance.json', 'w'), ensure_ascii=False, indent=1)
# 姿势库：整目录快照进数据包（别人还在改那边的 kit；渲染只读这份快照，重新导入才更新）
# PUPPET_KEEP_KIT=1：不重拷，保留数据包里已有的那份快照（只想换头部素材、别人又正在改 kit 的时候用）
if 'kit' in KEEP and os.path.isdir(f'{out}/kit'): print('姿势库快照：保留原有的', sorted(json.load(open(f'{out}/kit/poses.json'))))
elif os.path.isdir(S('kit')):
    shutil.rmtree(f'{out}/kit', ignore_errors=True); shutil.copytree(S('kit'), f'{out}/kit')
    print('姿势库快照：', sorted(json.load(open(f'{out}/kit/poses.json'))))
# 脖子：身体的底图（kit/base.png）整张画在头的后面，后发片会把它盖住——脖子单独做成头部画布里的一个部件，
# 层序在「后发 / 内层发」之上、脸之下；不挂在头的刚体组上、深度 0（跟身体，不跟头动）。上端藏在下巴后面。
# 下端要藏进领口：身体底图是先画的，所以把脖子片在「领子和上衣」的位置预先挖掉（只留底图透明处和底图自己那截脖子的位置）。
NECK = S('body', 'neck.png')
if os.environ.get('PUPPET_NO_NECK') != '1' and os.path.exists(NECK) and os.path.exists(f'{out}/kit/base.png'):
    import numpy as np
    from PIL import Image
    from scipy import ndimage
    bj = json.load(open(S('body', 'body.json'))); nr = next(p['rect'] for p in bj['parts'] if p['name'] == 'neck')      # 身体母版像素 = 角色坐标 ÷ 2
    # 底图用数据包里的那份快照。如果 kit 里带着单独的整幅 neck.png（底图里合着的脖子就是它），先把这截脖子从快照的底图里去掉：
    # 脖子由下面这个部件单独画（位置在后发前面、宽度按母版），底图里再留一截更宽的会在两侧叠出第二道轮廓。
    # 只改数据包里的拷贝（原图另存成 base_with_neck.png），不动来源目录。
    kb = f'{out}/kit/base.png'; base = np.asarray(Image.open(kb).convert('RGBA')).astype(int); x, y, w, h = nr
    if os.path.exists(f'{out}/kit/neck.png') and not os.path.exists(f'{out}/kit/base_with_neck.png'):
        kn = np.asarray(Image.open(f'{out}/kit/neck.png').convert('RGBA')).astype(int)
        same = (kn[..., 3] > 0) & (base[..., 3] > 0) & (np.abs(kn[..., :3] - base[..., :3]).max(-1) <= 8) if kn.shape == base.shape else np.zeros(1, bool)
        if same.sum() > 2000:          # 底图里真的合着这截脖子才抠（2026-10-07 傍晚起 W4 的 base.png 已不带脖子，这段一般不会触发）
            shutil.copyfile(kb, f'{out}/kit/base_with_neck.png'); base[..., 3] = np.where(same, 0, base[..., 3])
            Image.fromarray(base.astype(np.uint8), 'RGBA').save(kb); print('底图快照里去掉了合着的脖子：', int(same.sum()), '像素')
            np.save(f'{out}/kit/_neck_removed.npy', same[y:y + h, x:x + w])
    sub = base[y:y + h, x:x + w]; r, g, b, al = [sub[..., i] for i in range(4)]
    skin = (al > 128) & (r > 190) & (g > 110) & (g < 225) & (b > 95) & (b < 215) & (r - b > 18)          # 底图自己那截脖子（肤色）
    keep = ndimage.binary_dilation((al < 128) | skin, iterations=2)                                        # 往领子里多吃 2 像素，盖住底图脖子的描边过渡
    NECK3 = S('neck', 'neck.png')
    if os.path.exists(NECK3):
        # 脖子层源图（W4 #1161：程序画，角色坐标 1:1，矩形在 neck.json）。领口的遮挡在这里做：身体底图是先画的，
        # 所以脖子片在底图不透明的地方（领子、上衣）预先挖掉；往领子里多留 1 个姿势图层像素，盖住两者边缘的抗锯齿缝。
        nj = json.load(open(S('neck', 'neck.json'))); nrect = nj['rect']; ks = 2
        im = np.asarray(Image.open(NECK3).convert('RGBA')).copy(); H2, W2 = im.shape[:2]; assert (W2, H2) == (round(nrect[2]), round(nrect[3])), (im.shape, nrect)
        bx, by = round(nrect[0] / ks), round(nrect[1] / ks); cover = base[by:by + round(H2 / ks) + 1, bx:bx + round(W2 / ks) + 1, 3] > 128
        cover = ndimage.binary_erosion(cover, iterations=1)
        cov2 = np.asarray(Image.fromarray(cover).resize((cover.shape[1] * ks, cover.shape[0] * ks), Image.NEAREST))[:H2, :W2]
        im[..., 3] = np.where(cov2, 0, im[..., 3]); Image.fromarray(im, 'RGBA').save(f'{out}/tex/neck.png')
        neck_rect, neck_from = [float(v) for v in nrect], 'parts/neck/neck.png（按 kit/base.png 的领口挖过）'
    else:
        assert Image.open(NECK).size == (w, h), nr
        # 脖子片的画法（总管 2026-10-07 看图后定的）：W5 的原片是直上直下的方柱 + 两条又直又黑的竖线，像一块板。
        # 这里沿用它的位置和矩形，按母版的样子重画：宽度对到母版（约 62 像素，原片 82）、两侧略收腰、
        # 整段压着下巴的阴影（越靠近下巴越深，颜色取母版脖子的阴影色）、描边改成细而淡的暖棕色，只在靠领口的下半段出现。
        master = S('master'); SHADOW = (228, 157, 137)
        if os.path.exists(master):
            mm = np.asarray(Image.open(master).convert('RGB')).astype(int)[y + 104:y + 124, x + w // 2 - 8:x + w // 2 + 8].reshape(-1, 3)
            if abs(mm.mean(0) - SHADOW).max() < 30: SHADOW = tuple(int(v) for v in mm.mean(0))      # 母版下巴正下方那一小块的平均色
        LIGHT, LINE = (246, 214, 196), (170, 96, 78)
        yy, xx = np.mgrid[0:h, 0:w].astype(float); cx = (w - 1) / 2
        v = np.clip((yy - 70) / 90, 0, 1); hw = 32.5 - 3.5 * np.sin(np.pi * v)                    # 半宽：两头 32.5、腰 29
        left, right = cx - hw, cx + hw                                                               # 每一行的左右轮廓
        flare = np.zeros((h, w))
        rm = f'{out}/kit/_neck_removed.npy'
        if os.path.exists(rm):
            # 底图里原来那截脖子比母版宽；把它去掉以后，领口开口里脖子两侧会空出来露底。
            # 所以脖子在进领口的地方往两侧放宽到正好填满原来的开口（上面看得见的那截仍是母版的宽度），过渡 10 行。
            gone = np.load(rm); os.remove(rm); sub0 = base[y:y + h, x:x + w, 3] > 128
            # 领子真正贴到脖子两侧的第一行：原来那截脖子的左右边缘外侧 5 像素内出现了底图的不透明像素
            yc = h
            for r_ in range(h):
                cols = np.where(gone[r_])[0]
                if len(cols) and (sub0[r_, max(0, cols.min() - 5):cols.min()].any() or sub0[r_, cols.max() + 1:cols.max() + 6].any()): yc = r_; break
            for r_ in range(h):
                cols = np.where(gone[r_])[0]
                if not len(cols): continue
                f_ = float(np.clip((r_ - (yc - 10)) / 10, 0, 1)); f_ = f_ * f_ * (3 - 2 * f_); flare[r_] = f_
                left[r_] = left[r_] + (min(left[r_, 0], cols.min() - 0.5) - left[r_]) * f_; right[r_] = right[r_] + (max(right[r_, 0], cols.max() + 0.5) - right[r_]) * f_
        edge = np.minimum(xx - left, right - xx)                                                    # 到轮廓的距离（像素，里正外负）
        alpha = np.clip(edge + 0.5, 0, 1)
        k = np.clip((yy - 95) / 75, 0, 1); k = k * k * (3 - 2 * k)                                 # 阴影：下巴处最深，往领口渐浅（不到全亮）
        rgb = np.stack([SHADOW[i] + (LIGHT[i] - SHADOW[i]) * 0.55 * k for i in range(3)], -1)
        la = np.clip((yy - 100) / 35, 0, 1) * 0.6 * np.clip(1.8 - np.abs(edge - 0.9), 0, 1)        # 描边：约 2 像素宽，下半段才淡入，最浓 60%
        la = la * (1 - flare)                                                                        # 放宽的那段在领子底下，不画线
        rgb = rgb * (1 - la[..., None]) + np.array(LINE) * la[..., None]
        im = np.dstack([rgb, alpha * 255]).round().clip(0, 255).astype(np.uint8)
        im[..., 3] = np.where(keep, im[..., 3], 0); Image.fromarray(im, 'RGBA').save(f'{out}/tex/neck.png')
        neck_rect, neck_from = [x * 2, y * 2, w * 2, h * 2], 'body/neck.png 的位置和矩形；形状、阴影、描边由导入脚本按母版重画，再按 kit/base.png 的领口挖过'
    face_order = next(p['order'] for p in parts if p['id'] == 'face')
    parts.append({'id': 'neck', 'group': 'body', 'texture': 'tex/neck.png', 'rect': neck_rect, 'order': face_order - 5, 'depth': 0, 'depthY': 0})
    if SHAPE and SHAPE.get('neck'):
        # 脖子不属于头，但转头时下巴会横移（按原画，24° 时约 85 像素），脖子上端要跟过去一部分，下端进领口的地方不动：
        # z 从下巴线处的「follow × 下巴的 z」平滑降到下巴线以下 fade 像素处的 0。
        NK = SHAPE['neck']; chin_y = P['face']['rect'][1] + P['face']['rect'][3]; zc = _shape_info['faceAt'](_shape_info['axisX'], chin_y)[0] * NK['follow']; nx, ny, nw, nh = neck_rect; cols, rows = 4, 16; zs = []
        for j in range(rows + 1):
            t = min(1, max(0, (ny + nh * j / rows - (chin_y - NK.get('above', 40))) / NK['fade'])); zs += [round(zc * (1 - t * t * (3 - 2 * t)), 4)] * (cols + 1)
        parts[-1]['mesh'] = {'grid': [cols, rows], 'turn': {'z': zs, 'w': [0] * len(zs)}}
    prov.append({'part': 'neck', 'from': neck_from, 'sha1': hashlib.sha1(open(NECK, 'rb').read()).hexdigest()[:12]})
    json.dump(parts, open(f'{out}/parts.json', 'w'), ensure_ascii=False, indent=1)
    json.dump({'imported_from': os.path.relpath(src, out), 'note': '贴图是原文件的拷贝，像素没动（脖子除外：按领口挖过）', 'parts': prov}, open(f'{out}/provenance.json', 'w'), ensure_ascii=False, indent=1)
print(len(parts), '个部件 →', out)
