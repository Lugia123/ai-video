"""第 11 步的逐手检查图 + 可量的几项：对一个 kit 目录里每个姿势的每只手出一格（浅 / 深藏青 / 品红底，2 倍），并打印
  线宽    手周围暗色外圈面积 / 边缘长度（kit 像素，近似值）——各姿势应落在同一个范围里
  面积    单手肤色像素数——握拳、张开的手各自应接近
  绿边    半透明外圈（alpha 20–230）里偏绿像素的占比——应 ≈ 0%
  碎片    和主体不连通的小块个数（> 12px、且小于最大块的 5%）——应为 0。这一项没有用坏样本标定过，报了要放大看

  python3 hands_audit.py <配置.json> --assets <素材根> --work <任意目录> --kit-in <kit 目录> --report <检查图目录>
  → <report>/hands-audit.png、<report>/hands-audit.json
一格按「这一侧手的肤色重心」裁 200×200；两只手靠得近的姿势一格里会看到两只手。五指、指尖描边、手腕接袖口只能看图。"""
import sys, os, json, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli, font as get_font

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
MIDX = cfg['midX']; CW, CH = cfg.canvas; poses = json.load(open(cfg.ki(cfg['kit']['poses']))); tiles, rows = [], []; seen = {}
for name, P in poses.items():
    for kind in ('arms', 'over'):
        f = P.get(kind)
        if not f: continue
        im = Image.open(cfg.ki(f)).convert('RGBA'); a = np.asarray(im).astype(float); al = a[..., 3] > 128; r, g, b = a[..., 0], a[..., 1], a[..., 2]; lum = a[..., :3].mean(2)
        skin = al & (r > g + 8) & (r > 175); semi = (a[..., 3] > 20) & (a[..., 3] < 230); green = (g > r + 12) & (g > b + 12)
        lb, k = ndi.label(al); sz = ndi.sum(al, lb, range(1, k + 1)) if k else []; frag = int(sum(1 for s in sz if 12 < s < max(sz) * 0.05)) if k else 0          # 比最大块的 5% 还小的独立小块
        for sd, sl in (('L', slice(0, MIDX)), ('R', slice(MIDX, CW))):
            m = np.zeros_like(skin); m[:, sl] = skin[:, sl]
            if m.sum() < 300: continue
            ys, xs = np.where(m); cx, cy = int(xs.mean()), int(ys.mean()); sig = (round(cx / 4), round(cy / 4), int(m.sum()) // 50)
            if seen.get((sd, sig)): continue          # 和别的姿势是同一只手（待机的那只）：不重复出
            seen[(sd, sig)] = name
            near = ndi.binary_dilation(m, iterations=14); d = ndi.distance_transform_edt(al); edge = (d > 0) & (d <= 1) & near
            ring = al & (lum < 75) & (d <= 12) & near & ~((b > r + 25) & (lum > 40))
            row = {'pose': name, 'layer': f, 'side': sd, 'lineWidth': round(float(ring.sum() / max(edge.sum(), 1)), 2), 'skinArea': int(m.sum()),
                   'greenFringePct': round(float(100 * green[semi].mean()) if semi.any() else 0, 1), 'fragments': frag}
            rows.append(row); tiles.append((f'{name} {sd}', im.crop((cx - 100, cy - 100, cx + 100, cy + 100)), row))
font = get_font(15); sh = Image.new('RGB', (max(len(tiles), 1) * 300, 3 * 300 + 44), (255, 255, 255)); dr = ImageDraw.Draw(sh)
for i, (nm, h, row) in enumerate(tiles):
    dr.text((i * 300 + 4, 2), nm, fill=(0, 0, 0), font=font); dr.text((i * 300 + 4, 22), f'线宽 {row["lineWidth"]}  面积 {row["skinArea"]}  绿边 {row["greenFringePct"]}%', fill=(60, 60, 60), font=font)
    for j, bg in enumerate(cfg['colors']['checkBgs']):
        c = Image.new('RGBA', h.size, tuple(bg) + (255,)); c.alpha_composite(h); sh.paste(c.convert('RGB').resize((300, 300), Image.LANCZOS), (i * 300, 44 + j * 300))
sh.save(cfg.r('hands-audit.png')); json.dump(rows, open(cfg.r('hands-audit.json'), 'w'), ensure_ascii=False, indent=1)
print(f'{"姿势":12s} 侧  线宽   面积   绿边%  碎片'); [print(f'{r["pose"]:12s} {r["side"]}  {r["lineWidth"]:5.2f}  {r["skinArea"]:5d}  {r["greenFringePct"]:5.1f}  {r["fragments"]}') for r in rows]
