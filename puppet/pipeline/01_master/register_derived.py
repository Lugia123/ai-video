"""把各张派生改图（去帽、光头、口型、去头的身体、去手臂的身体…）配准到母版坐标。

  python3 register_derived.py <配置.json> --work <改图和母版所在目录> --out <输出目录> [名字…]
  → <out>/<名字>.png（配准后的图）、<out>/<名字>.npy（2×3 相似变换矩阵）
每张改图对到哪张母版、只用母版的哪个区域在配置 derived 里。改图有 40 步定稿版（<名字>_f.png）就用它，否则用草稿版（<名字>.png）；缺的跳过并报出来。
配准是 SIFT + RANSAC 的相似变换（../lib/poses_lib.py 的 register）。打印的 inliers 少于 30 左右时结果不可信，要看图。"""
import sys, os, json, numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import load, register
argv = sys.argv[1:]; opt = lambda k: argv[argv.index(k) + 1]
if len(argv) < 5: raise SystemExit(__doc__)
cfg = json.load(open(argv[0], encoding='utf-8')); W, O = opt('--work'), opt('--out'); os.makedirs(O, exist_ok=True)
only = [a for i, a in enumerate(argv[1:], 1) if not a.startswith('--') and argv[i - 1] not in ('--work', '--out')]
masters = {}
for j in cfg['derived']:
    if only and j['name'] not in only: continue
    src = next((p for p in (os.path.join(W, j['name'] + '_f.png'), os.path.join(W, j['name'] + '.png')) if os.path.exists(p)), None)
    if not src: print('缺', j['name']); continue
    ref = masters.setdefault(j['master'], load(os.path.join(W, j['master'] + '.png')))
    out, M = register(load(src), ref, tuple(j['box']) if j.get('box') else None, os.path.basename(src)[:-4])
    Image.fromarray(out).save(os.path.join(O, j['name'] + '.png')); np.save(os.path.join(O, j['name'] + '.npy'), M)
