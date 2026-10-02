"""背景分层自查：按顺序叠回 → 与原图比平均像素差；各层按深度错开模拟视差 → 对比图。
用法: python3 tools/layers/check_layers.py episodes/mv-pdoom/art/layers/whale-city [--shift 40]
输出 check-recomposite.jpg（原图 | 叠回 | 差异×4）、check-parallax.jpg（左移/原位/右移/上移 + 空洞标红）。"""
import argparse, json, pathlib, numpy as np
from PIL import Image, ImageDraw, ImageFont
FONT = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 28)

ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--shift', type=float, default=40)
a = ap.parse_args(); base = pathlib.Path(a.dir)
cfg = json.loads((base / 'layers.json').read_text()); W, H = cfg['size']
src = np.asarray(Image.open(base / cfg['src']).convert('RGB')).astype(np.float32)
Ls = sorted(cfg['layers'], key=lambda l: l['order'])  # 0 = 最后面
P = cfg.get('pad', 0)
imgs = [np.asarray(Image.open(base / l['file']).convert('RGBA')).astype(np.float32) / 255 for l in Ls]  # 含 pad

def comp(offsets):
    out = np.zeros((H, W, 3), np.float32); cov = np.zeros((H, W), np.float32)
    for im, (dx, dy) in zip(imgs, offsets):
        dx, dy = int(round(dx)), int(round(dy))
        big = np.zeros((H + 4 * P + 200, W + 4 * P + 200, 4), np.float32); o = P + 100  # 先放进足够大的画布再裁取视口
        big[o + dy:o + dy + im.shape[0], o + dx:o + dx + im.shape[1]] = im
        s = big[o + P:o + P + H, o + P:o + P + W]
        al = s[..., 3:4]; out = out * (1 - al) + s[..., :3] * al; cov = cov + al[..., 0] * (1 - cov)
    return out * 255, cov

rec, _ = comp([(0, 0)] * len(imgs))
diff = np.abs(rec - src); mae = diff.mean(); p99 = np.percentile(diff.max(-1), 99)
print(f'还原误差: 平均 {mae:.2f}/255, 99分位 {p99:.1f}/255, >16 的像素 {(diff.max(-1) > 16).mean() * 100:.2f}%')
row = [src, rec, np.clip(diff * 4, 0, 255)]
Image.fromarray(np.concatenate([r.astype(np.uint8) for r in row], 1)).resize((W * 3 // 2, H // 2)).save(base / 'check-recomposite.jpg', quality=90)

# 视差：位移 ∝ 1/距离 − 1/参考距离（参考层不动，前层反向、后层同向……这里简单地按 1/scale 线性分配）
inv = np.array([1 / l['scale'] for l in Ls]); w = (inv - inv.min()) / (inv.max() - inv.min() + 1e-6)
tiles = []
for vx, vy, name in [(-1, 0, '相机右移'), (0, 0, '原位'), (1, 0, '相机左移'), (0, -0.6, '相机下移')]:
    img, cov = comp([(vx * a.shift * k, vy * a.shift * k) for k in w])
    hole = cov < 0.99; img[hole] = [255, 0, 0]
    t = Image.fromarray(img.astype(np.uint8)).resize((W // 2, H // 2)); ImageDraw.Draw(t).text((10, 10), f'{name}  hole={hole.mean() * 100:.2f}%', fill=(255, 255, 255), font=FONT, stroke_width=2, stroke_fill=(0, 0, 0))
    tiles.append(t); print(f'{name}: 空洞 {hole.mean() * 100:.3f}%')
S = Image.new('RGB', (W, H)); [S.paste(t, ((i % 2) * W // 2, (i // 2) * H // 2)) for i, t in enumerate(tiles)]
S.save(base / 'check-parallax.jpg', quality=90)
print('位移(px) 各层:', {l['name']: round(float(k * a.shift), 1) for l, k in zip(Ls, w)})
