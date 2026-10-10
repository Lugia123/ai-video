"""草稿自动筛：整人草稿相对待机母版量三项比例，标出命中的。

  python3 sieve.py <配置.json> <草稿文件名通配，如 "pose2d_wave*"> --assets <素材根> --work <草稿所在目录> --report <检查图目录>
  → 表格 + <report>/sieve-<通配去掉星号>.png + <work>/sieve_<…>.json
  body  整图配准缩放（配置 register.low 区域的 SIFT）
  head  头的大小（头部母版 paths.headMaster → 这张图的 SIFT 缩放，相对待机）
  hand  手的大小：脸、脖子、腿以外的肤色块（每块 300–20000px）的平均面积开方，相对待机；看不到手记 None，不算不合格
合格范围在配置 sieve 里。没量的：袖口条纹、姿势对不对（只能看图）。来源是绿剪影草稿时 head 量不了（头是一块绿），会记成异常，照常看图。"""
import sys, os, glob, json, numpy as np, cv2
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from poses_lib import cli, load, quiet, register, master, bg_mask, font as get_font

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
pat = pos[0]; tag = pat.replace('*', '').strip('_'); files = sorted(glob.glob(cfg.w(pat if pat.endswith('.png') else pat + '.png'))); SV = cfg['sieve']; LOW = tuple(cfg['register']['low'])
Mst = master(cfg); H_, W_ = Mst.shape[:2]; yy, xx = np.mgrid[0:H_, 0:W_]; hm = load(cfg.p('headMaster')); ORG = np.array(cfg['headMasterOrigin'], np.float32)
def hand_size(im, Mh):
    r, g, b = [im[..., i].astype(np.int16) for i in range(3)]; f = ~bg_mask(im, tol=12)
    skin = f & (r > g + 8) & (g > b - 10) & (r > 180) & ((r + g + b) / 3 > 150)
    c = (np.array(SV['faceCenterInHeadMaster'], np.float32) - ORG) @ Mh[:, :2].T + Mh[:, 2]; s = float(np.hypot(Mh[0, 0], Mh[1, 0]))
    face = ((xx - c[0]) / (SV['faceRadii'][0] * s)) ** 2 + ((yy - c[1]) / (SV['faceRadii'][1] * s)) ** 2 < 1; chin = c[1] + SV['chinBelowCenter'] * s
    m = skin & ~face & ~((np.abs(xx - c[0]) < SV['neckHalfWidth']) & (yy < chin + 60)) & (yy < SV['handYMax'])          # 脖子和腿不算
    lb, k = ndi.label(ndi.binary_opening(m, iterations=2)); sz = [v for v in ndi.sum(m, lb, range(1, k + 1)) if 300 < v < 20000]
    return float(np.sqrt(np.mean(sz))) if sz else None
def head_of(im):
    f = ~bg_mask(im, tol=12); top = np.where(f.any(1))[0][0]; hw = SV['headSearchHalfWidth']; return quiet(register, hm, im, (W_ // 2 - hw, top, W_ // 2 + hw, top + SV['headSearchHeight']), 'h')[1]
MhM = head_of(Mst); h0 = float(np.hypot(MhM[0, 0], MhM[1, 0])); hand0 = hand_size(Mst, MhM)
rows = []; font = get_font(20); tiles = []; inr = lambda v, q: q[0] <= v <= q[1]
for fpath in files:
    name = os.path.basename(fpath)[:-4]
    try:
        R, T = quiet(register, load(fpath), Mst, LOW, name); body = float(np.hypot(T[0, 0], T[1, 0]))
        Mh = head_of(R); head = float(np.hypot(Mh[0, 0], Mh[1, 0])) / h0; hs = hand_size(R, Mh); hand = hs / hand0 if hs and hand0 else None
    except Exception as e: rows.append((name, None, None, None, False, str(e)[:40])); continue
    ok = inr(body, SV['body']) and inr(head, SV['head']) and (hand is None or inr(hand, SV['hand']))
    rows.append((name, round(body, 3), round(head, 3), round(hand, 3) if hand else None, ok, ''))
    t = Image.fromarray(R).resize((368, 490)); d = ImageDraw.Draw(t); d.rectangle([0, 0, 368, 50], fill=(20, 110, 60) if ok else (150, 40, 40))
    d.text((6, 3), name.replace('pose2d_', ''), fill=(255, 255, 255), font=font); d.text((6, 26), f'body {body:.2f} head {head:.2f} hand {hand:.2f}' if hand else f'body {body:.2f} head {head:.2f} hand —', fill=(255, 255, 255), font=font); tiles.append(t)
print(f'{"草稿":34s} body   head   hand   命中'); [print(f'{r[0]:34s} {r[1]}  {r[2]}  {r[3]}  {"✓" if r[4] else "✗"} {r[5]}') for r in rows]
if tiles:
    t0 = Image.fromarray(Mst).resize((368, 490)); ImageDraw.Draw(t0).text((6, 3), '待机母版', fill=(0, 0, 0), font=font); tiles = [t0] + tiles
    s = Image.new('RGB', (368 * len(tiles), 490)); [s.paste(t, (i * 368, 0)) for i, t in enumerate(tiles)]; s.save(cfg.r(f'sieve-{tag}.png'))
json.dump(rows, open(cfg.w(f'sieve_{tag}.json'), 'w'), ensure_ascii=False)
