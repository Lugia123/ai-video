"""涂抹重画法的输入图：以配准后的待机母版为底，把指定区域涂成纯品红，让模型只补这一块。
区域 = 待机手臂多边形里 y 大于 cutY 的部分（外扩 14px）∪ 若干矩形（给新手臂留的空间）；上臂（cutY 以上的待机手臂）不涂，所以上臂贴身是被原图锁住的。

  python3 paint_mask.py <配置.json> <名> --assets <素材根> --work <目录>     → <work>/paint_<名>.png、paint_<名>_mask.png
区域定义在配置 paintRegions[<名>]（cutY、boxes，kit 画布坐标）；待机手臂多边形在配置 idleArmPolys 指的文件里（和配置放在一起，是角色数据）。
实测：模型不一定守涂抹范围（fist 4 张里 3 张把拳头画到了范围外），要多抽几张挑。"""
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli, master

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
n = pos[0]; R = cfg['paintRegions'][n]; M = master(cfg); H_, W_ = M.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]
polys = json.load(open(os.path.join(os.path.dirname(cfg.path), cfg['idleArmPolys'])))['idle']['arms']; pm = np.zeros((H_, W_), np.uint8)
for p in polys: cv2.fillPoly(pm, [np.array(p, np.int32)], 1)
paint = ndi.binary_dilation((pm > 0) & (yy > R['cutY']), iterations=14) & (yy > R['cutY'] - 6)
for x0, y0, x1, y1 in R['boxes']: paint[y0:y1, x0:x1] = True
keep = ndi.binary_dilation((pm > 0) & (yy <= R['cutY']), iterations=3); paint &= ~keep          # 矩形里不许盖到上臂
out = M.copy(); out[paint] = (255, 0, 255)
Image.fromarray(out).save(cfg.w(f'paint_{n}.png')); Image.fromarray((paint * 255).astype(np.uint8)).save(cfg.w(f'paint_{n}_mask.png')); print('painted px', int(paint.sum()))
