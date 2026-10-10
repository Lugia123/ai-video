"""第 2 步 绿底预涂：姿势来源图配准到母版，裁「双臂 + 躯干上半」，背景和头自己先涂成纯绿。
这样改图模型只需要做「高清重绘」这一件事（让它自己「把头和背景换成绿」，三张里两张会动到手）。

  python3 arm_prep.py <配置.json> <姿势> --assets <素材根> --work <中间产物目录>
  → <work>/armhd_<姿势>_crop.png、<work>/armhd_<姿势>.json

姿势在配置 poses[<姿势>] 里：source（来源图）、box（裁块，宽高比须等于 crop.hd）、prep（可选）：
  headHalfWidth / headYMax  头块收窄 / 上下移（默认用配置 head 里的）
  hairYMax                  把 y 小于它的发色像素按颜色涂掉（头块收窄之后用）
  handBoxes                 手伸进头块里的姿势：这些框里只留肤色和贴着肤色的深色描边
  keepLargest               只留最大的非绿连通块（清掉绿剪影边缘的细线残留、脸的碎片）
  fillHoles                 手里的小绿洞用周围颜色补
来源是「绿色头部剪影」草稿时会自动认出来，不整块涂头（手画在剪影前面，不能涂掉）。"""
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli, load, quiet, register, master, bg_mask

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
n = pos[0]; P = cfg.pose(n); PR = P.get('prep', {}); BOX = tuple(P.get('box') or cfg['crop']['defaultBox']); G = tuple(cfg['colors']['green']); HEAD = cfg['head']; MIDX = cfg['midX']
assert abs((BOX[2] - BOX[0]) / (BOX[3] - BOX[1]) - cfg['crop']['hd'][0] / cfg['crop']['hd'][1]) < 1e-6, '裁块宽高比须等于 crop.hd'
M = master(cfg); R, T = quiet(register, load(cfg.a(P['source'])), M, tuple(cfg['register']['low']), 's')
H_, W_ = R.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]; r, g, b = [R[..., i].astype(np.int16) for i in range(3)]; lum = (r + g + b) / 3
bg = bg_mask(R, tol=12)
hair = (g > r + 4) & (b <= g + 8) & (g > 60) & ~((r > 205) & (g > 218) & (b > 218))
HW, HY = int(PR.get('headHalfWidth', HEAD['blockHalfWidth'])), int(PR.get('headYMax', HEAD['blockYMax']))
greenhead = (g > 140) & (g > r + 70) & (g > b + 50)          # 来源是绿剪影草稿：头已经是绿的
head = ((yy < HY) & (np.abs(xx - MIDX) < HW)) if greenhead.sum() < 20000 else ndi.binary_dilation(greenhead, iterations=2) & ~ndi.binary_dilation(~greenhead & ~bg, iterations=3)
if PR.get('hairYMax'): head = head | ndi.binary_dilation(ndi.binary_opening(hair & (yy < PR['hairYMax']), iterations=1), iterations=3)
if PR.get('handBoxes'):
    skin = (r > g + 8) & (r > 175) & (lum > 150) & ~((g > 200) & (b > 200) & (r - b < 28)); near = ndi.binary_dilation(ndi.binary_opening(skin, iterations=2), iterations=8)
    for x0, y0, x1, y1 in PR['handBoxes']:
        bx = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1); head = head & ~(bx & near & (skin | (lum < 95)))
out = R.copy(); out[ndi.binary_dilation(bg, iterations=1) | head] = G
if greenhead.sum() >= 20000:        # 剪影上的眼 / 嘴标记点也涂掉
    dots = ndi.binary_fill_holes(greenhead | head) & ~greenhead & (g > r + 30) & (r < 60); out[ndi.binary_dilation(dots, iterations=3)] = G
a = np.array(Image.fromarray(out).crop(BOX))
if PR.get('keepLargest'):
    ng = np.abs(a.astype(int) - np.array(G)).sum(2) > 60
    lab, k = ndi.label(ndi.binary_opening(ng, iterations=2)); sz = ndi.sum(ng, lab, range(1, k + 1)); keep = ndi.binary_dilation(lab == (1 + int(np.argmax(sz))), iterations=3); small = np.zeros_like(keep)
    if PR.get('fillHoles'):
        holes = ndi.binary_fill_holes(keep) & ~ng; lab2, k2 = ndi.label(holes); small = np.isin(lab2, [i + 1 for i, s in enumerate(ndi.sum(holes, lab2, range(1, k2 + 1))) if s < 400])
        a = cv2.inpaint(a, ndi.binary_dilation(small, iterations=1).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
    a[~keep & ~small] = G
Image.fromarray(a).save(cfg.w(f'armhd_{n}_crop.png')); json.dump({'box': list(BOX), 'out': cfg['crop']['hd'], 'src': P['source']}, open(cfg.w(f'armhd_{n}.json'), 'w'))
print(n, 'head px', int(head.sum()), 'box', BOX)
