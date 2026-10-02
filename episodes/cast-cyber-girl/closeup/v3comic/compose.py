"""主歌 3 结尾漫画 ④⑤ 的分层合成（总管 seq 360）：机械手不靠模型和她一起画对，单独出一张「握着一根细绿杆的机械拳」，
把绿杆对到她的前臂上（手腕下面一点），绿杆的像素挖掉——她的手臂从拳头里穿过去，拳头压在前面，手从拳头上方露出来。
  python3 episodes/cast-cyber-girl/closeup/v3comic/compose.py        （仓库根目录；要 numpy / cv2 / PIL；抠图走本地 /cutout）
输入（key/）：mech-fist.png（白底）、g-arm.png（④ 她，带夜空背景）、g-hang.png（⑤ 她，白底全身）、bg-far.png（⑤ 背景）
输入还有 g-drop.png（⑥ 她）。输出（key/）：c3-grip-loose.png / c3-grip.png（④ 松 / 紧）、c5-hang.png（⑤）、c6-drop.png（⑥ 加高的底图）、mech-fist-arm.png（挖掉绿杆、把小臂接长的机械手）"""
import pathlib, subprocess
import numpy as np, cv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[4]
K = pathlib.Path(__file__).resolve().parent / 'key'


def cutout(name):
    out = K / f'{name}-cut.png'
    if not out.exists() or out.stat().st_mtime < (K / f'{name}.png').stat().st_mtime:
        subprocess.run(['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'cutout', str(K / f'{name}.png'), '-o', str(out)], check=True, capture_output=True)
    return Image.open(out).convert('RGBA')


# ---------------------------------------------------------------- 机械拳：挖掉绿杆，量出杆的位置；把小臂沿它自己的方向接长（大远景里要一直伸出画外）
def mech():
    m = np.asarray(cutout('mech-fist')).copy(); rgb = m[..., :3].astype(int)
    green = (rgb[..., 1] > 140) & (rgb[..., 0] < 150) & (rgb[..., 2] < 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 50)
    ys, xs = np.where(green); rod_x = float(np.median(xs)); rod_w = float(np.percentile(xs, 97) - np.percentile(xs, 3))
    rows = np.unique(ys); gaps = np.where(np.diff(rows) > 25)[0]                       # 杆被拳头挡住的那一段
    g0, g1 = (rows[gaps[0]], rows[gaps[0] + 1]) if len(gaps) else (rows.min(), rows.max())
    m[cv2.dilate(green.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0, 3] = 0
    # 拳头的范围：被挡住那一段附近的不透明像素
    a = m[..., 3] > 128; fy0, fy1 = g0 - 6, g1 + 6
    cols = np.where(a[fy0:fy1].any(axis=0))[0]
    info = dict(rod_x=rod_x, rod_w=rod_w, fist_top=int(g0), fist_bot=int(g1))
    # 小臂：图右边缘处的截面，沿方向 d 平铺出去
    H, W = a.shape; xa, xb = W - 140, W - 12
    ca = np.where(a[:, xa])[0]; cb = np.where(a[:, xb])[0]
    d = np.array([xb - xa, (cb.mean() - ca.mean())]); L = 110; d = d / np.linalg.norm(d)
    big = np.zeros((H * 3, W * 3, 4), np.uint8); oy = H * 2; big[oy:oy + H, :W] = m      # 原图放在左下角，往右上接
    patch = m[:, W - 12 - L:W - 12].copy()
    for k in range(1, 40):
        dx, dy = d * L * k; x0 = int(round(W - 12 - L + dx)); y0 = int(round(oy + dy))
        if x0 + L > big.shape[1] or y0 < 0: break
        dst = big[y0:y0 + H, x0:x0 + L]; al = patch[..., 3:4] / 255
        dst[...] = (patch * al + dst * (1 - al)).astype(np.uint8)
    out = Image.fromarray(big); out.save(K / 'mech-fist-arm.png')
    info.update(oy=oy); return out, info


def paste_mech(canvas, mimg, info, at, scale, angle=0):
    """把机械拳贴到 canvas：at = 「拳头上沿、杆的中心」要落在 canvas 的哪一点；angle = 逆时针转多少度（绕那一点）"""
    px, py = info['rod_x'], info['oy'] + info['fist_top']
    mm = mimg.rotate(angle, resample=Image.BICUBIC, center=(px, py))
    mm = mm.resize((round(mm.width * scale), round(mm.height * scale)), Image.LANCZOS)
    ox, oy = round(at[0] - px * scale), round(at[1] - py * scale)
    layer = Image.new('RGBA', canvas.size); layer.paste(mm, (ox, oy)); canvas.alpha_composite(layer)


def main():
    mimg, info = mech(); print(info)
    # ---------------- ④ 她肩后仰拍：机械拳握着她的手腕下面一点，她的手从拳头上方露出来
    g = Image.open(K / 'g-arm.png').convert('RGBA'); gc = np.asarray(cutout('g-arm'))[..., 3]
    def axis(y): r = np.where(gc[y, 300:780] > 128)[0]; return 300 + (r.min() + r.max()) / 2, r.max() - r.min()
    top = np.where(gc.max(axis=1) > 128)[0].min()
    yw = top + 185; (x1, w1), (x2, _) = axis(yw), axis(yw + 220)
    ang = np.degrees(np.arctan2(x1 - x2, 220))                                       # 前臂相对竖直方向偏了多少（往右上偏为正）
    EXT = 260                                                                          # 画布往上加高：机械手的小臂要伸出去
    al = cv2.dilate((gc > 20).astype(np.uint8), np.ones((15, 15), np.uint8)) > 0
    ga = np.asarray(g).copy(); strip = ga[:EXT].copy(); msk = al[:EXT]; strip[msk] = np.roll(strip, 300, axis=1)[msk]
    for name, sc in (('c3-grip-loose', 1.0), ('c3-grip', 0.94)):
        s = w1 / info['rod_w'] * 0.52 * sc                                             # 杆比手腕细：拳头约是她手臂的 4 倍宽
        out = Image.new('RGBA', (g.width, g.height + EXT)); out.paste(g, (0, EXT)); out.paste(Image.fromarray(strip).transpose(Image.FLIP_TOP_BOTTOM), (0, 0))
        paste_mech(out, mimg, info, (x1, EXT + yw), s, -ang)
        out.convert('RGB').save(K / f'{name}.png'); print(name, out.size, 'scale', round(s, 3), 'angle', round(ang, 1))
    # ---------------- ⑤ 大远景：背景 + 她（白底抠出来，缩小）+ 同一只机械拳握着她的手腕，小臂一直伸出画外
    bg = Image.open(K / 'bg-far.png').convert('RGBA'); hc = cutout('g-hang'); ha = np.asarray(hc)[..., 3]
    ys, xs = np.where(ha > 128); top = ys.min(); gh = ys.max() - top
    r = np.where(ha[top + 150] > 128)[0]; hx, hw = (r.min() + r.max()) / 2, r.max() - r.min()                # 手腕下面一点
    TARGET = 0.27                                                                      # 她占画高多少
    k = bg.height * TARGET / gh; hs = hc.resize((round(hc.width * k), round(hc.height * k)), Image.LANCZOS)
    gx, gy = round(bg.width * 0.42 - hx * k), round(bg.height * 0.40 - top * k)      # 她在画面中间偏下：16:9 的取景框里能同时看到她和脚下的城
    out = bg.copy(); out.alpha_composite(hs, (gx, gy))
    fs = 0.15 * gh * k / (info['fist_bot'] - info['fist_top'])                         # 拳头的高 = 她身高的 15%（和 ④ 里「拳头约一个头大」一致）
    paste_mech(out, mimg, info, (gx + hx * k, gy + (top + 150) * k), fs, 0)
    out.convert('RGB').save(K / 'c5-hang.png'); print('c5-hang', out.size)

    # ---------------- ⑥ 她往后仰着掉下去：画布往上加高 240（张开的机械手在她上方，由 shots/v3-comic.js 画，会动）
    d = Image.open(K / 'g-drop.png').convert('RGB'); dc = np.asarray(cutout('g-drop'))[..., 3]; EXT = 240
    al = cv2.dilate((dc > 20).astype(np.uint8), np.ones((21, 21), np.uint8)) > 0
    da = np.asarray(d).copy(); strip = da[:EXT].copy(); msk = al[:EXT]; strip[msk] = np.roll(strip, 420, axis=1)[msk]
    out = Image.new('RGB', (d.width, d.height + EXT)); out.paste(d, (0, EXT)); out.paste(Image.fromarray(strip).transpose(Image.FLIP_TOP_BOTTOM), (0, 0))
    out.save(K / 'c6-drop.png'); ys, xs = np.where(dc[:60] > 128); print('c6-drop', out.size, 'hand top x', int(xs.mean()) if len(xs) else None, 'y', EXT + int(np.where(dc.max(axis=1) > 128)[0].min()))


if __name__ == '__main__':
    main()
