"""外轮廓描边的缺口：沿手臂层的外轮廓走一圈，量每一处描边有多厚，报「描边太薄 / 没有」的段。
  python3 outline_gaps.py <kit 目录> [--base <base.png>] [--full 层1,层2] [--out <标注图目录>] [层文件名…]
  --full：这些层整圈都量（不按 base 排除）——手压在身体前面、内边是多边形切出来的层（捂嘴、手抵下巴），内边也必须有完整描边。
量法：外轮廓 = alpha>128 区域的边界像素。每个轮廓像素的描边厚度 ≈ 它周围 9×9 里暗像素（亮度 < DARK）的个数 ÷ 8。厚度 < THIN 记为缺口。
不算的：被身体盖住的轮廓（给了 --base 时 base 的 alpha>128 处外扩 2px）、画布边、按袖窿切肩的竖直切口（连续 ≥ 12px 完全竖直）、本身就是深色的面（袖口的藏青带，厚度会很大，不是缺口）。
每层按画面左 / 右两只袖子分开报：轮廓长度、描边厚度中位数、缺口总长和占比、最长一段及位置。标注图：黄 = 缺口。
读数怎么看：2026-10-07 的坏样本（捂嘴，收线把多边形内边的线收没了）左袖缺口占比 20% 以上、最长段几十像素；干净的层缺口占比 < 5%、最长段 < 12px。阈值只有这一个坏样本。"""
import sys, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
DARK, THIN, MID = 95, 1.5, 547
def measure(path, base=None):
    a = np.asarray(Image.open(path).convert('RGBA')).astype(np.int16); sol = a[..., 3] > 128; lum = a[..., :3].mean(-1)
    edge = sol & ~ndi.binary_erosion(sol); dark = (sol & (lum < DARK)).astype(np.float32)
    thick = ndi.uniform_filter(dark, size=9, mode='constant') * 81 / 8.0          # 轮廓像素周围 9×9 里的暗像素数 ÷ 8 ≈ 描边厚度（直线段上；最外一圈抗锯齿变浅不影响）
    skip = np.zeros_like(sol); skip[[0, -1], :] = True; skip[:, [0, -1]] = True
    if base is not None: skip |= ndi.binary_dilation(base, iterations=2)
    vert = edge & ~np.roll(sol, 1, 1) & np.roll(edge, 1, 0) & np.roll(edge, -1, 0) | edge & ~np.roll(sol, -1, 1) & np.roll(edge, 1, 0) & np.roll(edge, -1, 0)
    lbv, kv = ndi.label(vert, structure=np.ones((3, 3))); skip |= np.isin(lbv, [i + 1 for i, s in enumerate(ndi.sum(vert, lbv, range(1, kv + 1))) if s >= 12])
    cnt = edge & ~skip; gap = cnt & (thick < THIN); out = {}
    for sd, sl in (('L', slice(0, MID)), ('R', slice(MID, None))):
        c = np.zeros_like(cnt); c[:, sl] = cnt[:, sl]; g = c & gap
        if c.sum() < 40: continue
        lb, k = ndi.label(g, structure=np.ones((3, 3))); sz = ndi.sum(g, lb, range(1, k + 1)) if k else np.array([0]); where = None
        if k: ys, xs = np.where(lb == int(np.argmax(sz)) + 1); where = [int(xs.mean()), int(ys.mean())]
        out[sd] = {'contour': int(c.sum()), 'lineMedian': round(float(np.median(np.minimum(thick[c], 12))), 1), 'gapTotal': int(g.sum()), 'gapPct': round(100 * g.sum() / c.sum(), 1), 'longest': int(sz.max()), 'longestAt': where}
    return out, gap, a
if __name__ == '__main__':
    argv = sys.argv[1:]; K = argv[0]; base = None; out = None; names = []; full = set(); i = 1
    while i < len(argv):
        if argv[i] == '--base': base = np.asarray(Image.open(argv[i + 1]).convert('RGBA'))[..., 3] > 128; i += 2
        elif argv[i] == '--full': full = set(argv[i + 1].split(',')); i += 2
        elif argv[i] == '--out': out = argv[i + 1]; os.makedirs(out, exist_ok=True); i += 2
        else: names.append(argv[i]); i += 1
    if not names:
        P = json.load(open(os.path.join(K, 'poses.json'))); names = sorted({v[k] for v in P.values() for k in ('arms', 'over') if v.get(k)})
    print(f'{"层":22s} 侧  轮廓  线厚中位  缺口  占比   最长段  最长处'); rows = {}
    for f in names:
        r, gap, a = measure(os.path.join(K, f), None if f in full else base); rows[f] = r
        for sd, q in r.items(): print(f'{f:22s} {sd}  {q["contour"]:5d}  {q["lineMedian"]:5.1f}   {q["gapTotal"]:5d}  {q["gapPct"]:4.1f}%  {q["longest"]:5d}   {q["longestAt"]}')
        if out:
            c = Image.new('RGBA', (a.shape[1], a.shape[0]), (255, 0, 255, 255)); c.alpha_composite(Image.fromarray(a.astype(np.uint8))); px = np.asarray(c.convert('RGB')).copy(); px[ndi.binary_dilation(gap, iterations=1)] = (255, 255, 0)
            ys, xs = np.where(a[..., 3] > 20); Image.fromarray(px).crop((max(xs.min() - 10, 0), max(ys.min() - 10, 0), xs.max() + 10, ys.max() + 10)).save(os.path.join(out, 'gaps-' + f))
    if out: json.dump(rows, open(os.path.join(out, 'outline-gaps.json'), 'w'), ensure_ascii=False, indent=1)
