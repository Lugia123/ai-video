#!/usr/bin/env python3
# 生成的视频 → 透明序列帧 + 读数 + 全帧 contact。
#   python3 gen/03_key.py <段名（raw/ 下不带扩展名）>   首尾关键图都是 clips-stage 的归位帧
#   → frames/<段名>/NN.png、readings/<段名>.json、puppet/out/clips-blank/<段名>.png
# 抠法同之前的小样：品红程度 m = min(R,B) − G 直接算 alpha，只在外轮廓 3px 带内反预乘和去溢色；不插帧、不做时间平滑。
# 颜色：首帧↔首关键图、末帧↔末关键图各拟合逐通道三次曲线，中间帧按位置插值。最后首帧 / 末帧换回关键图。
import sys, os, json, subprocess, numpy as np, cv2
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)); R = D + '/..'; PUP = os.path.normpath(R + '/../../..')
name = sys.argv[1]; k0 = k1 = 'home'; clip = f'{R}/raw/{name}.mp4'
out = f'{R}/frames/{name}'; os.makedirs(out, exist_ok=True); os.makedirs(R + '/readings', exist_ok=True); os.makedirs(PUP + '/out/clips-blank', exist_ok=True)
w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', clip], capture_output=True, text=True).stdout.strip().split(','))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32); n = len(fr)

def key(f):
    bg = np.median(np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)]), 0)
    m = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]; mb = min(bg[0], bg[2]) - bg[1]
    a = 1 - np.clip((m - 0.12 * mb) / (0.62 * mb), 0, 1)
    solid = a > 0.98; band = ndi.binary_dilation(~solid, iterations=3) & (a > 0)
    aa = np.clip(a, 0.25, 1)[..., None]; c = np.where((band & ~solid)[..., None], (f - bg * (1 - aa)) / aa, f)
    lim = c[..., 1] + 12
    for ch in (0, 2):
        over = band & (np.minimum(c[..., 0], c[..., 2]) > lim); c[..., ch] = np.where(over, np.minimum(c[..., ch], lim), c[..., ch])
    a[a < 0.04] = 0
    return np.dstack([np.clip(c, 0, 255), a * 255]).astype(np.uint8)

keys = [cv2.resize(cv2.cvtColor(cv2.imread(f'{R}/home_blank{os.environ.get("V","")}_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA), (w, h), interpolation=cv2.INTER_AREA) for k in (k0, k1)]
home = cv2.resize(cv2.cvtColor(cv2.imread(f'{R}/home_blank{os.environ.get("V","")}_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA), (w, h), interpolation=cv2.INTER_AREA)
rgba = [key(f) for f in fr]
def diff(a, b):   # 两边都不透明处的平均色差、轮廓不一致的像素占全画幅的百分比
    both = (a[..., 3] > 128) & (b[..., 3] > 128); d = np.abs(a[..., :3].astype(float) - b[..., :3].astype(float)).mean(2)
    return [round(float(d[both].mean()), 2), round(float(((a[..., 3] > 128) != (b[..., 3] > 128)).mean() * 100), 3)]
def fit(a, b):
    both = (a[..., 3] > 250) & (b[..., 3] > 250); both = ndi.binary_erosion(both, iterations=3)
    A = cv2.GaussianBlur(a[..., :3], (0, 0), 2)[both].astype(np.float64); B = cv2.GaussianBlur(b[..., :3], (0, 0), 2)[both].astype(np.float64)
    return [np.polyfit(A[:, c], B[:, c], 3) for c in range(3)]
def apply(f, c0, c1, k):
    o = f.copy().astype(np.float64)
    for c in range(3): o[..., c] = np.polyval(c0[c], o[..., c]) * (1 - k) + np.polyval(c1[c], o[..., c]) * k
    return np.clip(o, 0, 255).astype(np.uint8)
info = {'clip': name, 'keys': [k0, k1], 'frames': n, 'fps': 16, 'size': [w, h]}
info['raw_first_vs_key'] = diff(rgba[0], keys[0]); info['raw_last_vs_key'] = diff(rgba[-1], keys[1])
c0, c1 = fit(rgba[0], keys[0]), fit(rgba[-1], keys[1])
rgba = [apply(f, c0, c1, i / (n - 1)) for i, f in enumerate(rgba)]
info['matched_first_vs_key'] = diff(rgba[0], keys[0]); info['matched_last_vs_key'] = diff(rgba[-1], keys[1])
info['matched_second_vs_key'] = diff(rgba[1], keys[0]); info['matched_penult_vs_key'] = diff(rgba[-2], keys[1])
info['note_diff'] = '[两边都不透明处平均色差(0-255), 轮廓不一致像素占全画幅 %]；换回关键图后首末帧 = 关键图，差为 0'
# 每帧和归位帧的差（轮廓不一致 %）：看动作什么时候离开 / 回到归位
info['sil_vs_home_pct'] = [diff(f, home)[1] for f in rgba]
# 帧间运动：相邻帧轮廓不一致像素占全画幅 %（只看轮廓；线条抖动不算）
mo = [0.0] + [round(float(((rgba[i][..., 3] > 128) != (rgba[i - 1][..., 3] > 128)).mean() * 100), 3) for i in range(1, n)]
info['motion'] = mo; thr = max(0.2 * max(mo), 0.06); act = [i for i, v in enumerate(mo) if v > thr]
info['motion_frames'] = {'threshold': round(thr, 3), 'first': act[0] if act else None, 'last': act[-1] if act else None, 'count': len(act)}
# E3 留白：人物包围盒（alpha > 128，去掉 < 12 像素的散点）到四边的距离
mg = []
for f in rgba:
    m = f[..., 3] > 128; lab, k = ndi.label(m)
    if k: sz = ndi.sum(m, lab, range(1, k + 1)); m = np.isin(lab, 1 + np.where(sz >= 12)[0])
    ys, xs = np.where(m); mg.append([int(xs.min()), int(ys.min()), int(w - 1 - xs.max()), int(h - 1 - ys.max())] if len(xs) else [0, 0, 0, 0])
mg = np.array(mg); info['margin_px_LTRB_per_frame'] = mg.tolist()
info['margin_min'] = {s: {'px': int(mg[:, i].min()), 'frac_of_frame': round(float(mg[:, i].min() / (w if i % 2 == 0 else h)), 3), 'frame': int(mg[:, i].argmin())} for i, s in enumerate(('left', 'top', 'right', 'bottom'))}
info['touches_edge_frames'] = [int(i) for i in np.where(mg.min(1) <= 2)[0]]
info['bbox_height_frac'] = [round(float((h - r[1] - r[3]) / h), 3) for r in mg]
info['magenta_left'] = [int(((np.minimum(f[..., 0].astype(int), f[..., 2]) - f[..., 1] > 40) & (f[..., 3] > 200)).sum()) for f in rgba]
gen_first, gen_last = rgba[0].copy(), rgba[-1].copy()
rgba[0], rgba[-1] = keys[0], keys[1]
for i, f in enumerate(rgba): cv2.imwrite(f'{out}/{i:02d}.png', cv2.cvtColor(f, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_PNG_COMPRESSION, 6])
json.dump(info, open(f'{R}/readings/{name}.json', 'w'), ensure_ascii=False)
# 全帧 contact：一格一帧、整个画幅（看留白），单双行浅 / 深底
ch = 430; cw = round(w * ch / h); cols = 13 if n <= 52 else 14; rows = (n + cols - 1) // cols
S = Image.new('RGB', (cols * cw, rows * ch)); dr = ImageDraw.Draw(S)
for i, f in enumerate(rgba):
    x, y = (i % cols) * cw, (i // cols) * ch; bg = Image.new('RGB', (cw, ch), (243, 248, 251) if (i // cols) % 2 == 0 else (18, 22, 28))
    im = Image.fromarray(f).resize((cw, ch), Image.LANCZOS); bg.paste(im, mask=im.split()[3]); S.paste(bg, (x, y)); dr.rectangle((x, y, x + cw - 1, y + ch - 1), outline=(150, 150, 150)); dr.rectangle((x, y, x + 24, y + 13), fill='black'); dr.text((x + 4, y + 1), str(i), fill='yellow')
S.save(f'{PUP}/out/clips-blank/{name}.png')
print(name, {k: v for k, v in info.items() if k.startswith(('raw', 'matched', 'motion_frames', 'margin_min', 'touches'))}, 'magenta max', max(info['magenta_left']))
