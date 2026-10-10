"""从选中的候选立绘裁出头部 / 身体两块，交给高清重绘（masters.py）做成母版。

  python3 crops.py <配置.json> --assets <素材根> --work <输出目录>
  → <work>/head_crop.png、body_crop.png、crops.json
crops.json 里的 K = 头部裁块放大到母版的倍数；角色坐标 = 候选图坐标 × K。裁块的框和母版尺寸在配置 crops 里。"""
import sys, os, json
from PIL import Image
argv = sys.argv[1:]; opt = lambda k: argv[argv.index(k) + 1]
if len(argv) < 5: raise SystemExit(__doc__)
cfg = json.load(open(argv[0], encoding='utf-8')); A, W = opt('--assets'), opt('--work'); os.makedirs(W, exist_ok=True)
im = Image.open(os.path.join(A, cfg['candidate'])).convert('RGB'); C = cfg['crops']
for part in ('head', 'body'): im.crop(tuple(C[part]['box'])).save(os.path.join(W, f'{part}_crop.png'))
K = C['head']['out'][0] / (C['head']['box'][2] - C['head']['box'][0])
json.dump({'src': cfg['candidate'], 'K': K, 'head_box': C['head']['box'], 'body_box': C['body']['box'], 'head_px': C['head']['out'], 'body_px': C['body']['out']}, open(os.path.join(W, 'crops.json'), 'w'), indent=1)
print('K', K)
