#!/usr/bin/env python3
"""校验：眼睛各层（#1158）。要先跑过 split_head.py、build_face.py、build_eyes.py、build_lids.py。

  python3 verify_eyes.py --source <角色来源目录> --work <中间产物目录>   → <work>/out/wip-eye-parts-check.png、<work>/face/verify_eyes.json

只读 source，不往里写。「旧部件」= <work>/parts/ 里拆件直接得到的，「新部件」= <source>/face/ 里的成品。
a) 叠回：新脸底 + 眼睛各层（原位、睁眼），和母版在眼睛区域逐像素比；旧部件、新部件各一遍。
b) 错位：虹膜和高光左右移 15 px、上下移 8 px，眼白不动；虹膜和高光裁在眼白里（同 rig 的 clip）。
   量两样：① 眼白范围里「既不是白、也不是眼白投影色、也不是虹膜/高光/睫毛」的杂色像素数（白边、露底、残影都会落在这里）；
          ② 虹膜挪开后露出来的眼白上的色差（和眼白自己的两种颜色比）。
   另外量虹膜边缘一圈（alpha 5%–95%）里偏浅（V > 150）的像素占比——「锯齿状白边」就是这个。
c) 闭眼几档：按原型 rig 的做法近似——眼白在闭合线以上的部分向闭合线压（比例 c），上睫毛按列下移 c×(闭合线 − 睫毛下缘弧)，
   眼白/虹膜/高光在 c > 0.82 后淡出。这里是逐像素重映射，不是 rig 的网格变形，只用来看素材在各档会不会露馅。
d) 三色底 3 倍放大看每层边缘。"""
import json, os, sys, numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 S、W 已经是别的变量名（画布边长、宽度），所以换个名字引
from scipy import ndimage as ndi
from PIL import Image, ImageDraw, ImageFont
RIG = json.load(open(SRC('head/rig.json'), encoding='utf-8')); P = {p['id']: p for p in RIG['parts']}; EJ = {p['id']: p for p in json.load(open(SRC('face/eyes.json'), encoding='utf-8'))['parts']}
HO = (390, 136); S = 1408; M = cv2.imread(SRC('master/head_master.png'))
def rd(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def DIR(new, n): return SRC('face', n + '.png') if new else WK('parts', n + '.png')          # 新部件 = 成品，旧部件 = 拆件直接得到的
def rect(n, new): return EJ[n]['rect'] if new else P[n]['rect']
def layer(n, new, dx=0, dy=0):
    """部件放到 1408 画布上，返回 (bgr float, alpha 0..1)"""
    im = rd(DIR(new, n)); r = rect(n, new); c = np.zeros((S, S, 4), np.float32)
    x0, y0 = int(round(r[0] - HO[0] + dx)), int(round(r[1] - HO[1] + dy)); h, w = im.shape[:2]
    c[y0:y0 + h, x0:x0 + w] = im; return c[..., :3], c[..., 3] / 255
def over(dst, rgb, a): return dst * (1 - a[..., None]) + rgb * a[..., None]
def smooth(x): x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)
yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
def close_maps(side, c):
    e = RIG['eyes'][side]; cx, cyt, hw = e['center'][0] - HO[0], e['top'] - HO[1], e['hw']; eh = e['bottom'] - e['top']
    xc = np.clip((xx - cx) / hw, -1, 1); lineY = cyt + eh * e.get('closeAt', 0.72) + eh * 0.10 * (1 - xc * xc); yb = cyt + eh * e.get('lashArch', 0.42) * xc * xc
    return lineY, yb
def compose(new, face_new=True, shift=(0, 0), c=0.0, bg=None, sides='LR', with_low=True):
    base = np.zeros((S, S, 3), np.float32); base[:] = (245, 239, 220) if bg is None else bg
    f = rd(DIR(face_new, 'face')); r = P['face']['rect']; x0, y0 = int(r[0] - HO[0]), int(r[1] - HO[1])
    fa = f[..., 3:4].astype(np.float32) / 255; base[y0:y0 + f.shape[0], x0:x0 + f.shape[1]] = base[y0:y0 + f.shape[0], x0:x0 + f.shape[1]] * (1 - fa) + f[..., :3] * fa
    info = {}
    for s in sides:
        wr, wa = layer('eyeWhite' + s, new); ir, ia = layer('iris' + s, new, *shift); hr, ha = layer('eyeHl' + s, new, shift[0] * 0.55, shift[1] * 0.55); lr, la = layer('lash' + s, new); er, ea = layer('eyeLow' + s, new)
        if c > 0:
            lineY, yb = close_maps(s, c)
            srcy = np.where(yy < lineY, lineY - (lineY - yy) / max(1e-3, 1 - min(c, 0.999)), yy)          # 眼白：闭合线以上向闭合线压
            wr = cv2.remap(wr, xx, srcy, cv2.INTER_LINEAR); wa = cv2.remap(wa, xx, srcy, cv2.INTER_LINEAR)
            sy = yy - c * (lineY - yb); lr = cv2.remap(lr, xx, sy, cv2.INTER_LINEAR); la = cv2.remap(la, xx, sy, cv2.INTER_LINEAR)   # 睫毛：按列下移
            vis = 1 - smooth((c - 0.82) / 0.16); wa = wa * vis
        ia = ia * wa; ha = ha * wa                                                                       # 虹膜、高光裁在眼白里
        base = over(base, wr, wa); base = over(base, ir, ia); base = over(base, hr, ha)
        if with_low: base = over(base, er, ea)
        base = over(base, lr, la)
        info[s] = dict(wa=wa, ia=ia, ha=ha, la=la, ea=ea)
    return np.clip(base, 0, 255).astype(np.uint8), info
def lab(b): return cv2.cvtColor(b.astype(np.float32) / 255, cv2.COLOR_BGR2Lab)
def eyebox(s, pad=34):
    r = P['lash' + s]['rect']; x0, y0 = int(r[0] - HO[0]) - pad, int(r[1] - HO[1]) - pad; return slice(y0, y0 + 250 + pad), slice(x0, x0 + int(r[2]) + 2 * pad)
res = {'recompose': {}, 'shift': [], 'iris_edge_light_pct': {}, 'close': []}
# ---- a
for tag, new in (('old', False), ('new', True)):
    img, info = compose(new)
    for s in 'LR':
        m = ndi.binary_dilation(info[s]['wa'] > 0.5, iterations=2)
        d = np.linalg.norm(lab(img) - lab(M), axis=2)[m]
        res['recompose'][f'{tag}_{s}'] = {'mean_dE': round(float(d.mean()), 2), 'p95_dE': round(float(np.percentile(d, 95)), 2), 'pct_over_10': round(float((d > 10).mean() * 100), 2)}
# ---- 虹膜边缘偏浅
for tag, d in (('old', 'parts'), ('new', 'face')):
    for s in 'LR':
        im = rd(DIR(d == 'face', f'iris{s}')); a = im[..., 3]; band = (a > 12) & (a < 242); v = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)[..., 2]
        res['iris_edge_light_pct'][f'{tag}_{s}'] = {'band_px': int(band.sum()), 'light_pct': round(float((band & (v > 150)).sum() / max(1, band.sum()) * 100), 1)}
# ---- b
SH = [('原位', 0, 0), ('左 15', -15, 0), ('右 15', 15, 0), ('上 8', 0, -8), ('下 8', 0, 8)]
tiles = {}
for label, dx, dy in SH:
    for tag, new in (('old', False), ('new', True)):
        img, info = compose(new, shift=(dx, dy), with_low=True)
        for s in 'LR':
            w = info[s]; exposed = (w['wa'] > 0.97) & (w['ia'] < 0.03) & (w['ha'] < 0.03) & (w['la'] < 0.03) & (w['ea'] < 0.03)
            wim = rd(DIR(new, f'eyeWhite{s}')); px = wim[..., :3][wim[..., 3] > 250].astype(np.float32)
            # 眼白自己的两种颜色：白和投影
            Z = np.float32(px[::7]); _c, lbl, cen = cv2.kmeans(Z, 2, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.5), 2, cv2.KMEANS_PP_CENTERS)
            L = lab(img); cl = lab(cen.reshape(1, 2, 3).astype(np.uint8))[0]
            d = np.minimum(np.linalg.norm(L - cl[0], axis=2), np.linalg.norm(L - cl[1], axis=2))
            stray = exposed & (d > 6)
            res['shift'].append({'test': label, 'set': tag, 'eye': s, 'exposed_white_px': int(exposed.sum()), 'stray_px': int(stray.sum()), 'max_dE': round(float(d[exposed].max()), 2) if exposed.any() else 0})
        tiles[(label, tag)] = np.hstack([cv2.resize(img[eyebox(s)], None, fx=2.2, fy=2.2, interpolation=cv2.INTER_CUBIC) for s in 'LR'])
# ---- c
ctiles = {}
for c in (0.0, 0.3, 0.6, 0.85, 1.0):
    for tag, new in (('old', False), ('new', True)):
        img, info = compose(new, c=c); ctiles[(c, tag)] = np.hstack([cv2.resize(img[eyebox(s)], None, fx=2.2, fy=2.2, interpolation=cv2.INTER_CUBIC) for s in 'LR'])
json.dump(res, open(WK('face/verify_eyes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# ---- 拼图
F = '/Library/Fonts/Arial Unicode.ttf'; f26 = ImageFont.truetype(F, 26)
def bar(t, w, h=42):
    im = Image.new('RGB', (w, h), (255, 255, 255)); ImageDraw.Draw(im).text((10, 6), t, fill=(20, 39, 74), font=f26); return np.array(im)[..., ::-1]
rows = []; Wd = None
def add(t, img):
    rows.append((t, img))
mt = np.hstack([cv2.resize(M[eyebox(s)], None, fx=2.2, fy=2.2, interpolation=cv2.INTER_CUBIC) for s in 'LR'])
rc = res['recompose']
add(f"① 叠回对比（睁眼原位）：母版 | 旧部件 | 新部件。眼白范围内平均色差 旧 L {rc['old_L']['mean_dE']} R {rc['old_R']['mean_dE']}，新 L {rc['new_L']['mean_dE']} R {rc['new_R']['mean_dE']}", np.hstack([mt, tiles[('原位', 'old')], tiles[('原位', 'new')]]))
def st(label, tag): return sum(x['stray_px'] for x in res['shift'] if x['test'] == label and x['set'] == tag)
for label, dx, dy in SH[1:]:
    add(f"② 虹膜和高光 {label}（眼白不动）：旧部件 | 新部件。露出的眼白上的杂色像素（两眼合计）：旧 {st(label, 'old')}，新 {st(label, 'new')}", np.hstack([tiles[(label, 'old')], tiles[(label, 'new')]]))
for c in (0.3, 0.6, 0.85, 1.0):
    add(f"③ 闭眼 c = {c}：旧部件 | 新部件（逐像素近似 rig 的做法）", np.hstack([ctiles[(c, 'old')], ctiles[(c, 'new')]]))
def tri(path, k=3):
    im = rd(path).astype(np.float32); a = im[..., 3:4] / 255
    return cv2.resize(np.hstack([(im[..., :3] * a + np.array(c_, np.float32) * (1 - a)).astype(np.uint8) for c_ in [(255, 0, 255), (94, 58, 36), (255, 255, 255)]]), None, fx=k, fy=k, interpolation=cv2.INTER_NEAREST)
for n in ['iris', 'eyeWhite', 'lash', 'eyeHl', 'eyeLow']:
    ts = [tri(DIR(False, n + 'L')), tri(DIR(True, n + 'L')), tri(DIR(False, n + 'R')), tri(DIR(True, n + 'R'))]; h = max(t.shape[0] for t in ts)
    add(f"④ {n}：三色底 3 倍。旧 L | 新 L | 旧 R | 新 R", np.hstack([np.vstack([t, np.full((h - t.shape[0], t.shape[1], 3), 128, np.uint8)]) for t in ts] ))
Wd = 2700
rows = [(t, i if i.shape[1] <= Wd else cv2.resize(i, (Wd, int(i.shape[0] * Wd / i.shape[1])), interpolation=cv2.INTER_AREA)) for t, i in rows]
out = []
for t, i in rows: out += [bar(t, Wd), np.hstack([i, np.full((i.shape[0], Wd - i.shape[1], 3), 128, np.uint8)])]
cv2.imwrite(WK('out/wip-eye-parts-check.png'), np.vstack(out))
print(json.dumps(res['recompose'], ensure_ascii=False)); print(json.dumps(res['iris_edge_light_pct'], ensure_ascii=False))
for label, _, _ in SH: print(label, '杂色 px  旧', st(label, 'old'), ' 新', st(label, 'new'), ' 最大色差 旧', max(x['max_dE'] for x in res['shift'] if x['test'] == label and x['set'] == 'old'), '新', max(x['max_dE'] for x in res['shift'] if x['test'] == label and x['set'] == 'new'))
