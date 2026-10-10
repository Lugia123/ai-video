"""袖口条纹统一（出图之后的后处理）：把手臂层袖口那圈藏青带里的白条抹掉，按待机袖口的比例重画一道宽白条，底色对到待机袖口的藏青。
模型出的各张姿势图袖口条纹的宽度、道数不一致（prompt 约束无效），切换时像换了件衣服；这一步让所有姿势的袖口读起来是同一件。

  python3 cuff_unify.py <配置.json> <层文件名…> --assets <素材根> --work <任意目录> --kit-in <现有 kit> --kit-out <要改的层所在目录> --report <调试图目录>
  就地改 <kit-out>/<层文件名>；待机袖口从 <kit-in> 的 kit.idleArms 量（每次现量，不存中间文件）。调试图 <report>/cuff-dbg-<层>.png（品红 = 重画了的带，青 = 已经是宽白条、没动）。
  可重复跑：改过的袖口第二次会被判成「已是一道宽白条」而跳过。

做法：带 = 厚的暗色块里离手近的（开运算去细描边），闭运算把夹着的白条并进来；搜索半径跟手的大小走；按「带宽处处差不多」去掉绕在手外面的描边。
带内每个像素的横向位置 s = 到手一侧的距离 / (到手一侧 + 到袖子一侧)，0 = 贴手，1 = 贴袖子；白条画在待机袖口量到的 s 区间里，所以自动跟着带的弧度走。
先数现有白条：恰好一道、宽 15%–35%、中心在 0.4–0.65 的不动。只改带内部的颜色，alpha 不动，只写回带里的像素。
自动找不准的袖口（弧形窄带，如握拳）在配置 cuffManual[<层文件名>] 里手工给两条折线：hand（贴手的边）、sleeve（贴袖子的边），kit 画布坐标、同方向。
配置 cuff：shade（白条靠下一端渐变到浅灰的强度，0 = 平涂）、shadeGray。哪些姿势要过这一步写在 poses[<姿势>].cuff = true（verify_against_kit.py 据此调用）。"""
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli
EDGE = 2
def parts(a):
    al = a[..., 3] > 128; r, g, b = [a[..., i].astype(np.int16) for i in range(3)]; lum = (r + g + b) / 3
    skin = al & (r > g + 8) & (r > 175) & (lum > 150); dark = al & (lum < 120) & ~skin; bright = al & (lum > 170) & ~skin
    return al, skin, dark, bright, lum
def manual_bands(a, specs):
    """手工给的袖口带（gen/cuff_manual.json）：每只袖口两条折线 hand / sleeve。s = 到 hand 折线的距离 / 到两条折线的距离之和，所以白条跟着两条边的弧度走。"""
    al, skin, dark, bright, lum = parts(a); H, W = al.shape; out = []
    def dist(pts):
        c = np.ones((H, W), np.uint8); cv2.polylines(c, [np.int32(np.round(np.float32(pts) * 16))], False, 0, 1, cv2.LINE_8, 4); return ndi.distance_transform_edt(c)
    for q in specs:
        pm = np.zeros((H, W), np.uint8); cv2.fillPoly(pm, [np.int32(np.round(np.float32(q['hand'] + q['sleeve'][::-1]) * 16))], 1, shift=4); m = (pm > 0) & al & ~ndi.binary_dilation(skin, iterations=1)
        dh, ds = dist(q['hand']), dist(q['sleeve']); s = np.where(m, dh / np.maximum(dh + ds, 1e-3), np.nan).astype(np.float32); out.append((m, s))
    return out
def bands(a):
    """返回 [(带的掩码, s 图)]。"""
    al, skin, dark, bright, lum = parts(a); H, W = al.shape
    # 厚的暗色块（开运算去掉细描边）里离手 46px 以内的 = 袖口的藏青；闭运算把夹在中间的白条并进来
    lbs, ks = ndi.label(skin); hs = [v for v in ndi.sum(skin, lbs, range(1, ks + 1)) if v > 300]; R = float(np.sqrt(np.mean(hs))) if hs else 56.0          # 手的尺度（面积开方；待机的拳头 ≈ 56）：搜索半径和闭运算半径跟着它放大
    thick = ndi.binary_opening(dark, iterations=3); lb0, k0 = ndi.label(thick)
    dsk = ndi.distance_transform_edt(~skin); keep0 = np.isin(lb0, [i for i in range(1, k0 + 1) if (lb0 == i).sum() > 120 and dsk[lb0 == i].min() < 38 * R / 56])
    cr = int(round(8 * R / 56)); closed = ndi.binary_closing(np.pad(keep0, cr + 4), iterations=cr)[cr + 4:-(cr + 4), cr + 4:-(cr + 4)] & al & ~skin
    lb, k = ndi.label(closed); out = []; nearskin = ndi.binary_dilation(skin, iterations=7)
    for i in range(1, k + 1):
        m = lb == i
        if m.sum() < 150 or not (m & nearskin).any(): continue
        m = (ndi.binary_dilation(m, iterations=2) & dark & ~ndi.binary_dilation(skin, iterations=1)) | m          # 把开运算削掉的暗色边补回来
        ys, xs = np.where(m); y0, y1, x0, x1 = max(ys.min() - 40, 0), min(ys.max() + 40, H), max(xs.min() - 40, 0), min(xs.max() + 40, W); sl = (slice(y0, y1), slice(x0, x1))
        hand = skin[sl] & ndi.binary_dilation(m[sl], iterations=10); slv = bright[sl] & ~ndi.binary_dilation(m[sl], iterations=1) & ndi.binary_dilation(m[sl], iterations=10)
        if hand.sum() < 20 or slv.sum() < 20: continue
        dh = ndi.distance_transform_edt(~hand); ds = ndi.distance_transform_edt(~slv); wd = dh + ds; ms = m[sl]
        ms = ms & (wd <= 1.3 * np.median(wd[ms])); m = np.zeros_like(m); m[sl] = ms          # 带宽应该处处差不多：dh+ds 明显偏大的是绕在手外面的描边、带两端的尖角，不算带
        s = np.full((H, W), np.nan, np.float32); s[sl] = dh / np.maximum(wd, 1e-3); s[~m] = np.nan
        out.append((m, s))
    return out
def calibrate(path):
    """量待机袖口：白条的 s 区间、白和藏青的颜色、藏青的 Lab 中位数和明暗跨度。每只袖口一条。"""
    a = np.asarray(Image.open(path)); al, skin, dark, bright, lum = parts(a); res = []; dbg = a.copy(); labA = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)
    for m, s in bands(a):
        st = m & (lum > 150); nv = m & (lum < 110); hist, edges = np.histogram(s[st], bins=40, range=(0, 1)); tot, _ = np.histogram(s[m], bins=40, range=(0, 1)); frac = hist / np.maximum(tot, 1)
        on = frac > 0.5; runs = []; i = 0
        while i < 40:
            if on[i]:
                j = i
                while j < 40 and on[j]: j += 1
                runs.append([round(float(edges[i]), 3), round(float(edges[j]), 3)]); i = j
            else: i += 1
        res.append({'px': int(m.sum()), 'stripes': runs, 'white': [int(v) for v in np.median(a[st][:, :3], 0)], 'navy': [int(v) for v in np.median(a[nv & (s > 0.15) & (s < 0.85)][:, :3], 0)], 'sRange': [round(float(np.nanpercentile(s[m], 2)), 3), round(float(np.nanpercentile(s[m], 98)), 3)]})
        nc = ndi.binary_erosion(m, iterations=3) & (lum < 110); v = labA[nc]; res[-1]['navyLab'] = [round(float(x), 1) for x in np.median(v, 0)]; res[-1]['navyLspan'] = round(float(np.percentile(v[:, 0], 90) - np.percentile(v[:, 0], 10)), 1)
        dbg[m & ~st] = (255, 0, 255, 255)
    return res

if __name__ == '__main__':
    cfg, pos, flags, opts = cli(sys.argv[1:], __doc__); CU = cfg.get('cuff', {}); C = calibrate(cfg.ki(cfg['kit']['idleArms']))
    STR = C[0]['stripes']; WHITE0 = np.float32(C[0]['white']); TLAB = [round(float(np.mean([c['navyLab'][i] for c in C])), 1) for i in range(3)]; TL_SPAN = float(np.mean([c['navyLspan'] for c in C]))
    SHADE = float(CU.get('shade', 0.7)); MANUAL = cfg.get('cuffManual', {})
    for f in pos:
        a = np.asarray(Image.open(cfg.k(f))).copy(); al = a[..., 3] > 128; n = 0; dbg = a.copy(); inner = ndi.binary_erosion(a[..., 3] > 40, iterations=EDGE); rgb = a[..., :3].astype(np.float32); lum0 = rgb.mean(-1)
        for m, s in (manual_bands(a, MANUAL[f]) if f in MANUAL else bands(a)):
            # 现状：沿「贴手 → 贴袖子」方向数白条。恰好一道、宽度占带宽 15%–35%、中心在 0.4–0.65 = 已经是待机那种宽白条，不动
            sv_ = np.nan_to_num(s, nan=-1); hw, _ = np.histogram(sv_[m & (lum0 > 150)], bins=40, range=(0, 1)); ht, _ = np.histogram(sv_[m], bins=40, range=(0, 1)); on = hw / np.maximum(ht, 1) > 0.5; runs = []; q = 0
            while q < 40:
                if on[q]:
                    e = q
                    while e < 40 and on[e]: e += 1
                    runs.append((q / 40, e / 40)); q = e
                else: q += 1
            desc = '、'.join(f'{lo:.2f}–{hi:.2f}' for lo, hi in runs) or '无'
            if len(runs) == 1 and 0.15 <= runs[0][1] - runs[0][0] <= 0.35 and 0.4 <= (runs[0][0] + runs[0][1]) / 2 <= 0.65: print('  带', int(m.sum()), 'px：已是一道宽白条（', desc, '），不改'); dbg[m] = (0, 255, 255, 255); continue
            print('  带', int(m.sum()), 'px：现有白条', desc, '→ 重画')
            n += 1; core = m & inner; nvpx = m & (lum0 < 95) & (lum0 > 25); NAVY = np.median(rgb[nvpx], 0) if nvpx.sum() > 30 else np.float32(C[0]['navy']); WHITE = WHITE0          # 藏青用这只袖口自己的（各层色调略有不同） sv = np.nan_to_num(s, nan=-1)
            # 底色对齐：带内部（离带的边 ≥ 3px，避开描边）的藏青，Lab 中位数挪到待机袖口的，明暗跨度按比例压到待机的
            nc = ndi.binary_erosion(m, iterations=3) & (lum0 < 110); 
            if nc.sum() > 60:
                lab = cv2.cvtColor(np.clip(rgb, 0, 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32); v = lab[nc]; med = np.median(v, 0); span = max(float(np.percentile(v[:, 0], 90) - np.percentile(v[:, 0], 10)), 1.0)
                k_ = float(np.clip(TL_SPAN / span, 0.5, 1.5)); wn = cv2.GaussianBlur(nc.astype(np.float32), (0, 0), 1.0) * (lum0 < 120) * m; new = lab.copy(); new[..., 0] = (lab[..., 0] - med[0]) * k_ + TLAB[0]; new[..., 1] = lab[..., 1] - med[1] + TLAB[1]; new[..., 2] = lab[..., 2] - med[2] + TLAB[2]
                lab = lab * (1 - wn[..., None]) + new * wn[..., None]; conv = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32); rgb = np.where((wn > 0)[..., None], conv, rgb);          # 只写回带里的像素（整图来回转 Lab 会让别处也差 1–2 级） print('    底色 Lab 中位', [round(float(x), 1) for x in med], '→', TLAB, '明暗跨度', round(span, 1), '×', round(k_, 2))
                nvpx = nc; NAVY = np.median(rgb[nvpx], 0)
            # 带内部：原来的白条和它的抗锯齿边 → 藏青；暗的（描边、藏青底）不动，这样带两端和两侧的描边都留着
            lumc = rgb.mean(-1); wgt = cv2.GaussianBlur(np.clip((lumc - (float(NAVY.mean()) + 10)) / 16, 0, 1) * core, (0, 0), 0.7) * core; wgt = np.clip(wgt * 1.6, 0, 1); rgb = rgb * (1 - wgt[..., None]) + NAVY * wgt[..., None]          # 比藏青底亮的都算旧白条（含它的抗锯齿边）
            # 画两道白条：s 落在区间里，边上 0.02 的软过渡；离带的暗色边界（描边）近的地方按原来的暗度压住
            w = np.zeros(al.shape, np.float32); sw = np.nan_to_num(s, nan=-1)
            for lo, hi in STR: w = np.maximum(w, np.clip((sw - lo) / 0.03 + 0.5, 0, 1) * np.clip((hi - sw) / 0.03 + 0.5, 0, 1))
            line = ndi.binary_dilation(~m & (lum0 < 60) | (a[..., 3] < 128), iterations=EDGE + 1)          # 带外的描边 / 层外：白条不画到这里
            w = cv2.GaussianBlur(w * core * ~line, (0, 0), 0.6) * core
            col = np.broadcast_to(WHITE, rgb.shape).copy()
            if SHADE:          # 很轻的阴影：沿带的长轴，靠下的那一端 25% 长度渐变到浅灰（待机袖口的白条靠内侧就有这么一段）
                ys, xs = np.where(m); pts = np.stack([xs, ys], 1).astype(np.float32); c0 = pts.mean(0); ax = np.linalg.svd(pts - c0, full_matrices=False)[2][0]; ax = ax if ax[1] > 0 else -ax
                Y, X = np.mgrid[0:al.shape[0], 0:al.shape[1]]; t = (X - c0[0]) * ax[0] + (Y - c0[1]) * ax[1]; t0, t1 = np.percentile((pts - c0) @ ax, [2, 98]); u = np.clip((t - t0) / max(t1 - t0, 1), 0, 1)
                g = np.clip((u - 0.75) / 0.25, 0, 1)[..., None] * SHADE; col = col * (1 - g) + np.float32(CU.get('shadeGray', [186, 200, 208])) * g
            rgb = rgb * (1 - w[..., None]) + col * w[..., None]; dbg[m] = (255, 0, 255, 255)
        newrgb = np.clip(rgb, 0, 255).astype(np.uint8); touched = (dbg[..., 0] == 255) & (dbg[..., 1] == 0) & (dbg[..., 2] == 255); a[..., :3] = np.where(ndi.binary_dilation(touched, iterations=2)[..., None], newrgb, a[..., :3]); Image.fromarray(a).save(cfg.k(f)); Image.fromarray(dbg).save(cfg.r('cuff-dbg-' + f)); print(f, '带', n)

