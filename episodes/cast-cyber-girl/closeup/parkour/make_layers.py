"""跑酷漫画格关键画 → 抠成透明底（#1030）。
   python3 episodes/cast-cyber-girl/closeup/parkour/make_layers.py [--drafts gap=23,wall=11,flip=23,land=23]
raw/<名字>.png（定稿；没有就用 --drafts 指的草稿）→ 本地 imggen /cutout（BiRefNet）→ layers/<名字>.png。
贴到图边被截断的部分（手、头发）在 48 px 内渐隐，格子里任何时候都不露直边；地面阴影（半透明灰）一并去掉。"""
import pathlib, subprocess, sys
import numpy as np
from PIL import Image

D = pathlib.Path(__file__).parent
ROOT = D.resolve().parents[3]
OUT = D / 'layers'; OUT.mkdir(exist_ok=True)
drafts = {}
if '--drafts' in sys.argv: drafts = dict(a.split('=') for a in sys.argv[sys.argv.index('--drafts') + 1].split(','))
for name in ['gap', 'wall', 'flip', 'land']:
    src = D / 'raw' / f'{name}.png'
    if not src.exists(): src = D / 'raw' / 'drafts' / f'{name}-s{drafts[name]}.png'
    tmp = OUT / f'_{name}-cut.png'
    subprocess.run(['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'cutout', str(src), '-o', str(tmp)], check=True)
    a = np.array(Image.open(tmp).convert('RGBA')).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3] / 255
    # 接近白 / 浅灰且低饱和的像素（白底残留、地面投影）→ 透明
    mx, mn = rgb.max(-1), rgb.min(-1)
    pale = (mn > 150) & ((mx - mn) < 26)
    edge = al < 0.98
    al = np.where(pale & edge, 0, al)
    al = np.clip((al - 0.12) / 0.8, 0, 1)
    h, w = al.shape
    ry = np.minimum(np.arange(h), np.arange(h)[::-1]) / 48.0; rx = np.minimum(np.arange(w), np.arange(w)[::-1]) / 48.0
    al *= np.clip(np.minimum(ry[:, None], rx[None, :]), 0, 1)
    a[..., 3] = al * 255
    Image.fromarray(a.astype(np.uint8)).save(OUT / f'{name}.png'); tmp.unlink()
    ys, xs = np.nonzero(al > 0.5); print(name, src.name, 'bbox', xs.min(), ys.min(), xs.max(), ys.max(), 'of', w, h)
