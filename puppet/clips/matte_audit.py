#!/usr/bin/env python3
"""片段库抠图体检：逐帧找「抠得不干净」的地方，分类型计数，出 3 倍放大的清单图（浅底 / 深底 / 中灰底）。

    python3 puppet/clips/matte_audit.py <片段库目录> [--compare <另一份片段库目录>] [--out out/clips-matte-audit-3x.png] [--json 读数.json] [--spots 12]

只看 RGBA 帧本身，不需要原视频。类型（每帧每类报像素数）：
  A 键色残留    看得见的像素里偏品红的（min(R,B) − G > 24）：粉边、没抠掉的底
  B 浅色亮边    外轮廓 / 洞的边上，比往里 3px 处的描边亮很多的像素——放在深色底上是一圈白边
  C 半透明边    半透明像素（16 < alpha < 250）总数，和折成的平均边宽（÷ 轮廓长度）
  D 淡键色      不透明但带一点品红的成片像素（10 < min(R,B) − G ≤ 24，≥ 6 个连成片）：该透明没透明的小洞、被底色染了的浅色
  E 主体被吃    离任何全透明处都超过 3px 的半透明 / 透明小块（面积 < 400px 的内洞也列出来，要人看是真洞还是白袖子、眼白被误抠）
  F 闪烁        同一像素 alpha 一帧有、前后两帧都没有（或反过来），且前后两帧这里画面基本没动；连成 ≥ 40px 一片的不算（那是快速经过的手）
  G 撕裂        相邻帧光流在人物内部的空间跳变占比（中位、90 分位）：量「人被一块一块拼错位」；只有和同一段的旧版本比才有意义
**读数全在变好不等于画面没坏**（2026-10-08：A–F 全面变好而人裂开）。改了抠图 / 校色之后，放行前必须渲一段人物 1:1 的连续片（浅底、深底）看过。
带 --compare 时两份库各量一遍，清单图左边是 --compare 那份（修前），右边是第一个参数（修后），取修前最糟的若干处。"""
import argparse, json, os, sys
import cv2, numpy as np
from scipy import ndimage as ndi

BG = {'浅底': (243, 248, 251), '深底': (20, 24, 33), '中灰': (128, 128, 128)}
LUM = np.array([.299, .587, .114], np.float32)
KINDS = ['A 键色残留', 'B 浅色亮边', 'C 半透明边', 'D 淡键色', 'E 主体被吃', 'F 闪烁']


def load(p):
    a = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    return cv2.cvtColor(a, cv2.COLOR_BGRA2RGBA)


def analyse(frames):
    """→ 每帧 {类型: 0/1 图}，以及每帧读数。"""
    n = len(frames); maps, reads = [], []
    alphas = [f[..., 3].astype(np.int16) for f in frames]
    for t, f in enumerate(frames):
        rgb = f[..., :3].astype(np.float32); al = f[..., 3]; vis = al > 16; clear = al <= 16; semi = vis & (al < 250)
        m = np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1]; lum = rgb @ LUM
        dist_clear = ndi.distance_transform_edt(~clear)                       # 到最近全透明像素的距离
        A = vis & (m > 24)
        # B：边带（离透明 ≤ 2.5px）里的像素，和「往里走到离透明 ≥ 3px 的最近像素」比亮度
        core = (al >= 250) & (dist_clear >= 3)
        if core.any():
            idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
            inner = lum[idx[0], idx[1]]
        else: inner = lum
        band = vis & (dist_clear <= 2.5)
        B = band & (lum - inner > 45) & (inner < 120)
        Dm = (al >= 200) & (m > 10) & (m <= 24)
        lab, k = ndi.label(Dm); sizes = ndi.sum(Dm, lab, range(1, k + 1)) if k else []
        D = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 6])
        E = semi & (dist_clear > 3)
        lab, k = ndi.label(al < 128, structure=np.ones((3, 3)))             # 内洞：不和画面边相连的「不实」的块（八连通；边上一圈半透明里的单点不算）
        holes = []
        border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
        for i in range(1, k + 1):
            if i in border: continue
            ys, xs = np.where(lab == i)
            if len(ys) < 3: continue
            holes.append({'area': int(len(ys)), 'x': int(xs.mean()), 'y': int(ys.mean())})
        F = np.zeros_like(vis)
        if 0 < t < n - 1:
            a0, a1, a2 = alphas[t - 1], alphas[t], alphas[t + 1]
            still = cv2.blur(np.abs(frames[t - 1][..., :3].astype(np.float32) - frames[t + 1][..., :3].astype(np.float32)).max(2), (7, 7)) < 12
            F = (np.abs(a1 - a0) > 96) & (np.abs(a1 - a2) > 96) & (np.abs(a0 - a2) < 48) & still
            lab, k = ndi.label(F, structure=np.ones((3, 3)))                 # 成片的（≥ 40px）是快速经过的手，不是闪烁
            if k:
                big = np.where(ndi.sum(F, lab, range(1, k + 1)) >= 40)[0] + 1
                F &= ~np.isin(lab, big)
        per = int((vis & ~ndi.binary_erosion(vis)).sum())
        maps.append({'A 键色残留': A, 'B 浅色亮边': B, 'C 半透明边': semi, 'D 淡键色': D, 'E 主体被吃': E, 'F 闪烁': F})
        reads.append({'A': int(A.sum()), 'B': int(B.sum()), 'C': int(semi.sum()), 'C_width_px': round(float(semi.sum()) / max(per, 1), 2), 'D': int(D.sum()), 'E': int(E.sum()),
                      'F': int(F.sum()), 'holes': len(holes), 'small_holes': [h for h in holes if h['area'] < 400]})
    return maps, reads


def tear(a, b):
    """相邻两帧之间的「撕裂」：人物内部光流场的空间跳变。整块一起动（手臂、头）光流是平滑的；把两处位置不同的像素一块一块拼在一起
    （比如 2026-10-08 的静止锁定：一部分用归位帧像素、一部分用生成帧像素）会让相邻 8px 的两格光流差好几个像素。
    返回人物内部（离轮廓 ≥ 6px）光流差 > 2.5px 的格子占比（%）。正常动作也会有读数（手臂和身体的交界），要和同一段的旧版本比：
    那次裂开的版本，中位数是没裂的 1.5–2.8 倍。这条读数只是报警，放行前仍然要渲 1:1 的连续片自己看。"""
    g = lambda f: cv2.cvtColor((f[..., :3] * (f[..., 3:].astype(np.float32) / 255) + 128 * (1 - f[..., 3:].astype(np.float32) / 255)).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    fl = cv2.calcOpticalFlowFarneback(g(a), g(b), None, 0.5, 3, 15, 3, 5, 1.1, 0)
    inner = cv2.erode(((a[..., 3] > 200) & (b[..., 3] > 200)).astype(np.uint8), np.ones((13, 13), np.uint8)).astype(bool)
    dx = np.linalg.norm(fl[:, 8:] - fl[:, :-8], axis=2); dy = np.linalg.norm(fl[8:] - fl[:-8], axis=2)
    mx = inner[:, 8:] & inner[:, :-8]; my = inner[8:] & inner[:-8]
    return float(100 * ((dx[mx] > 2.5).sum() + (dy[my] > 2.5).sum()) / max(1, mx.sum() + my.sum()))


def library(root):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); out = {}
    for name, c in lib['clips'].items():
        if c.get('opaque'): continue
        out[name] = [load(os.path.join(root, f)) for f in c['frames']]
    return out


def summary(reads):
    tot = {k: sum(r[k] for r in reads) for k in 'ABCDEF'}
    return dict(tot, frames=len(reads), C_width_px_mean=round(float(np.mean([r['C_width_px'] for r in reads])), 2), C_width_px_max=max(r['C_width_px'] for r in reads),
                worst_frame={k: int(np.argmax([r[k] for r in reads])) for k in 'ABDEF'}, small_holes_per_frame=[len(r['small_holes']) for r in reads])


def spots(maps, want, tile=56):
    """挑最糟的若干处：把 A/B/D/E/F 的标记按 tile 分格，每格取标记最多的那一帧；同一格只取一次。"""
    cand = []
    for t, mp in enumerate(maps):
        for kind in KINDS:
            if kind.startswith('C'): continue
            m = mp[kind]
            if not m.any(): continue
            ys, xs = np.where(m); gy, gx = ys // tile, xs // tile
            for (cy, cx), cnt in zip(*np.unique(np.stack([gy, gx], 1), axis=0, return_counts=True)):
                sel = (gy == cy) & (gx == cx)
                cand.append((int(cnt), kind, t, int(xs[sel].mean()), int(ys[sel].mean()), (int(cy), int(cx))))
    cand.sort(reverse=True); seen, out = set(), []
    per_kind = {}
    for cnt, kind, t, x, y, cell in cand:
        if (kind, cell) in seen or per_kind.get(kind, 0) >= max(2, want // 3): continue
        seen.add((kind, cell)); per_kind[kind] = per_kind.get(kind, 0) + 1; out.append({'kind': kind, 'frame': t, 'x': x, 'y': y, 'count': cnt})
        if len(out) >= want: break
    return out


def crop3(f, x, y, bg, half=28, k=3):
    H, W = f.shape[:2]; x0, y0 = int(np.clip(x - half, 0, W - 2 * half)), int(np.clip(y - half, 0, H - 2 * half))
    c = f[y0:y0 + 2 * half, x0:x0 + 2 * half].astype(np.float32); a = c[..., 3:] / 255
    return cv2.resize((c[..., :3] * a + np.array(bg, np.float32) * (1 - a)).astype(np.uint8), None, fx=k, fy=k, interpolation=cv2.INTER_NEAREST)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lib'); ap.add_argument('--compare'); ap.add_argument('--out'); ap.add_argument('--json'); ap.add_argument('--spots', type=int, default=12)
    o = ap.parse_args()
    sets = ([('修前', o.compare)] if o.compare else []) + [('修后' if o.compare else '当前', o.lib)]
    data, result = {}, {}
    for label, root in sets:
        data[label] = {}; result[label] = {}
        for clip, frames in library(root).items():
            maps, reads = analyse(frames); data[label][clip] = (frames, maps); result[label][clip] = {'summary': summary(reads), 'per_frame': reads}
            tr = [tear(x, y) for x, y in zip(frames, frames[1:])] or [0.0]; result[label][clip]['summary'].update(G_tear_median=round(float(np.median(tr)), 2), G_tear_p90=round(float(np.percentile(tr, 90)), 2)); result[label][clip]['tear'] = [round(v, 2) for v in tr]
            s = result[label][clip]['summary']
            print(f'{label} {clip}（{s["frames"]} 帧）：A 键色残留 {s["A"]}  B 浅色亮边 {s["B"]}  C 半透明 {s["C"]}（边宽均值 {s["C_width_px_mean"]}px）  D 淡键色 {s["D"]}  E 主体被吃 {s["E"]}  F 闪烁 {s["F"]}'
                  f'  小内洞（<400px）每帧个数 最多 {max(s["small_holes_per_frame"])}  G 撕裂 中位 {s["G_tear_median"]}% / 90 分位 {s["G_tear_p90"]}%')
    if o.json: json.dump(result, open(o.json, 'w', encoding='utf-8'), ensure_ascii=False)
    if not o.out: return
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
    from fonts import label_font
    from PIL import Image, ImageDraw
    font = label_font(20); first = sets[0][0]; rows = []
    for clip, (frames, maps) in data[first].items():
        for s in spots(maps, max(2, o.spots // len(data[first]))): rows.append(dict(s, clip=clip))
    T = 56 * 3; gap = 6; cols = len(sets) * 3; LW = 330
    sheet = Image.new('RGB', (LW + cols * (T + gap) + (len(sets) - 1) * 18 + 10, 40 + len(rows) * (T + gap) + 10), (255, 255, 255)); d = ImageDraw.Draw(sheet)
    for si, (label, _) in enumerate(sets):
        for bi, bn in enumerate(BG): d.text((LW + si * (3 * (T + gap) + 18) + bi * (T + gap), 8), f'{label}·{bn}', fill=(20, 39, 74), font=font)
    for ri, r in enumerate(rows):
        y = 40 + ri * (T + gap)
        d.text((8, y + 6), f'{r["kind"]}', fill=(200, 60, 0), font=font)
        d.text((8, y + 34), f'{r["clip"]} 第 {r["frame"]} 帧', fill=(20, 39, 74), font=font); d.text((8, y + 62), f'位置 ({r["x"]}, {r["y"]})  {r["count"]} 像素', fill=(20, 39, 74), font=font)
        for si, (label, _) in enumerate(sets):
            frames = data[label].get(r['clip'], (None,))[0]
            if frames is None or r['frame'] >= len(frames): continue
            for bi, bg in enumerate(BG.values()):
                sheet.paste(Image.fromarray(crop3(frames[r['frame']], r['x'], r['y'], bg)), (LW + si * (3 * (T + gap) + 18) + bi * (T + gap), y))
    sheet.save(o.out); print('清单图：', o.out, sheet.size)


if __name__ == '__main__':
    main()
