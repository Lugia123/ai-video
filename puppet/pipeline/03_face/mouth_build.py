#!/usr/bin/env python3
"""三个张嘴口型（small / big / smile）的矢量画法（#1162）。mouth_closed 保持母版原样，不在这里画。要先跑过 build_face.py。

  python3 mouth_build.py --source <角色来源目录> --work <中间产物目录>

输入：<source>/face/face.json（各口型的 rect）、<work>/face/mouth_old/ 里 build_face.py 出的三张旧口型（只读它们的画布尺寸）。
输出：<source>/face/ 的 mouth_small.png、mouth_big.png、mouth_smile.png。
用代码画，不走生图：形状、线宽、颜色都是确定的，边缘靠 4 倍超采样抗锯齿。
每张图的画布尺寸和 face.json 里的 rect 都不变（直接替换同名文件即可），只是画在画布里的东西换了。
坐标先按头部母版像素（head_master_px）写，再按各自画布的缩放换算。

对齐的基准（从母版量的）：嘴线中心 x = 681.5，嘴角高度 y ≈ 1068，线色 (131,56,50)，线宽约 5px。
旧的三个张嘴口型中心在 x 685–688，比母版的嘴偏右 4–6px，这次一起对回 681.5。
"""
import json, math, os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK
from PIL import Image, ImageDraw

SS = 4                                   # 超采样倍数
CX = 681.5                               # 嘴的中线
LINE = (122, 46, 42)                     # 描边：母版嘴线的颜色略压深一点（张嘴时线压在深色口腔边上）
LINE_W = 5.0                             # 头部像素
CAVITY = (66, 16, 22)                    # 口腔：深酒红（旧图里 big 是藏青、small/smile 是深棕，这次统一）
TONGUE = (236, 126, 128)                 # 舌头
TONGUE_SH = (208, 98, 104)               # 舌根一侧的暗部
TEETH = (252, 250, 246)

P = {p['id']: p for p in json.load(open(SRC('face/face.json')))['parts']}


def canvas(pid):
    """返回 (画布宽, 画布高, 头部像素→画布像素的函数)。"""
    p = P[pid]; x0, y0, w, h = p['rect_head_px']
    im = Image.open(WK('face/mouth_old', p['src'])); tw, th = im.size          # 旧口型（重画之前的那张）：只用它的画布尺寸
    sx, sy = tw / w, th / h
    return tw, th, (lambda x, y: ((x - x0) * sx * SS, (y - y0) * sy * SS)), (sx + sy) / 2 * SS


def blob(cx, top, w, h, upper=0.44, n=160, top_fn=None):
    """横向椭圆：上半高 = upper·h，下半高 = (1-upper)·h（上缘略扁）。返回头部像素的轮廓点。"""
    a = w / 2; bu, bl = h * upper, h * (1 - upper); cy = top + bu
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x, s = math.cos(t), math.sin(t)                  # s<0 是上半
        pts.append((cx + a * x, cy + (bu if s < 0 else bl) * s))
    return pts


def render(pid, draw_fn):
    tw, th, T, k = canvas(pid)
    im = Image.new('RGBA', (tw * SS, th * SS), (0, 0, 0, 0))
    draw_fn(im, T, k)
    return im.resize((tw, th), Image.LANCZOS)


def fill_poly(im, pts, color):
    ImageDraw.Draw(im).polygon(pts, fill=color + (255,))


def mask_poly(size, pts):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).polygon(pts, fill=255); return m


def stroke(im, pts, width, color, closed=True):
    d = ImageDraw.Draw(im); pp = pts + pts[:2] if closed else pts
    d.line(pp, fill=color + (255,), width=max(1, int(round(width))), joint='curve')
    r = width / 2
    for x, y in (pts if not closed else []):
        pass
    if not closed:
        for x, y in (pts[0], pts[-1]):
            d.ellipse([x - r, y - r, x + r, y + r], fill=color + (255,))


def open_mouth(pid, outline_head, teeth_h=0.0, tongue=(0.70, 0.62), teeth_span=0.62):
    """张嘴口型：轮廓内填口腔色 → 舌头（裁在轮廓内）→ 上牙窄弧（可选）→ 描边。
    tongue = (舌头宽 / 嘴宽, 舌头露出的高度 / 嘴高)。"""
    def fn(im, T, k):
        pts = [T(x, y) for x, y in outline_head]
        xs = [p[0] for p in outline_head]; ys = [p[1] for p in outline_head]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys); w, h = x1 - x0, y1 - y0; cx = (x0 + x1) / 2
        shape = mask_poly(im.size, pts)
        layer = Image.new('RGBA', im.size, CAVITY + (255,))
        d = ImageDraw.Draw(layer)
        # 舌头：一个大椭圆从下面顶上来，上缘是一道弧；再叠一个略小、略亮的椭圆做受光面
        tw_, th_ = w * tongue[0], h * tongue[1]
        tcx, ttop = cx, y1 - th_
        d.ellipse([*T(tcx - tw_ / 2, ttop), *T(tcx + tw_ / 2, ttop + th_ * 2.4)], fill=TONGUE_SH + (255,))
        d.ellipse([*T(tcx - tw_ * 0.43, ttop + th_ * 0.16), *T(tcx + tw_ * 0.43, ttop + th_ * 2.4)], fill=TONGUE + (255,))
        if teeth_h > 0:
            # 上牙：只在上缘内侧一道很窄的白弧 = 轮廓 ∩ 「把轮廓向下平移 teeth_h 之后的外面」，再限制在中间一段
            shifted = mask_poly(im.size, [T(x, y + teeth_h) for x, y in outline_head])
            band = np.asarray(shape).astype(np.int16) - np.asarray(shifted).astype(np.int16)
            band = np.clip(band, 0, 255).astype(np.uint8)
            xx = np.arange(im.size[0])[None, :]
            lx, rx = T(cx - w * teeth_span / 2, 0)[0], T(cx + w * teeth_span / 2, 0)[0]
            edge = np.clip(np.minimum(xx - lx, rx - xx) / (0.06 * w * k), 0, 1)       # 两端渐收，不留方头
            band = (band * edge).astype(np.uint8)
            band[int(T(0, y0 + h * 0.45)[1]):] = 0                                    # 只留上半
            layer.paste(Image.new('RGBA', im.size, TEETH + (255,)), (0, 0), Image.fromarray(band))
        im.paste(layer, (0, 0), shape)
        stroke(im, pts, LINE_W * k, LINE, closed=True)
    return render(pid, fn)


def smile_outline(cx, corner_y, w, sag, depth, n=90):
    """咧嘴笑：上缘是一道向下微弯的弧（嘴角高、中间低 sag），下缘是深弧（最低点在 corner_y + depth）。
    两条都用 cos 曲线，在嘴角处相接；嘴角的尖由描边的圆角收掉。"""
    a = w / 2; top, bot = [], []
    for i in range(n + 1):
        u = -1 + 2 * i / n                                   # -1..1
        c = math.cos(u * math.pi / 2)                         # 嘴角 0，中间 1
        top.append((cx + a * u, corner_y + sag * c ** 1.2))
        bot.append((cx + a * u, corner_y + depth * c ** 0.62))
    return top + bot[::-1]


def closed_line(cx, corner_y, w, dip, n=60):
    a = w / 2
    return [(cx + a * (-1 + 2 * i / n), corner_y + dip * math.cos((-1 + 2 * i / n) * math.pi / 2) ** 0.85) for i in range(n + 1)]


def draw_closed():
    """闭嘴：一条连续的微笑弧线（旧图是中间断开的两段）。两端收细。"""
    def fn(im, T, k):
        pts_h = closed_line(CX, 1069.0, 122, 19.5)
        n = len(pts_h); d = ImageDraw.Draw(im)
        for i, (x, y) in enumerate(pts_h):                   # 用一串圆点画变宽的线：中间 5px，两端 2.6px
            u = abs(-1 + 2 * i / (n - 1)); wd = LINE_W * (1 - 0.48 * u ** 2.2) * k
            px, py = T(x, y); d.ellipse([px - wd / 2, py - wd / 2, px + wd / 2, py + wd / 2], fill=LINE + (255,))
        # 点之间补线段，避免超采样下出现珠串
        for i in range(n - 1):
            u = abs(-1 + 2 * (i + 0.5) / (n - 1)); wd = LINE_W * (1 - 0.48 * u ** 2.2) * k
            d.line([T(*pts_h[i]), T(*pts_h[i + 1])], fill=LINE + (255,), width=max(1, int(round(wd))))
    return render('mouth_closed', fn)


# 尺寸（头部像素）。三个张嘴口型的上缘都贴着嘴角线附近，往下张开；宽度 small < big < smile。
SPEC = {
    'mouth_small': dict(top=1063.0, w=60.0, h=52.0, upper=0.45),     # 说话的小口：略扁的小椭圆，不画牙
    'mouth_big':   dict(top=1056.0, w=126.0, h=90.0, upper=0.43),    # 大张嘴：横向椭圆，上缘有弧度、略扁于下缘
    'mouth_smile': dict(corner_y=1058.0, w=164.0, sag=13.0, depth=80.0),
}

if __name__ == '__main__':
    s = SPEC['mouth_small']; small = open_mouth('mouth_small', blob(CX, s['top'], s['w'], s['h'], s['upper']), teeth_h=0, tongue=(0.74, 0.50))
    b = SPEC['mouth_big']; big = open_mouth('mouth_big', blob(CX, b['top'], b['w'], b['h'], b['upper']), teeth_h=7.0, tongue=(0.72, 0.56))
    m = SPEC['mouth_smile']; smile = open_mouth('mouth_smile', smile_outline(CX, m['corner_y'], m['w'], m['sag'], m['depth']), teeth_h=8.0, tongue=(0.66, 0.52), teeth_span=0.70)
    # mouth_closed 不重画：它是定稿母版的原画法（中间断开的两段弧），验收时定的——只从母版派生，保持原样。
    # draw_closed() 留在文件里没被调用，是被退回的那版连续弧线。
    for n, im in (('mouth_small', small), ('mouth_big', big), ('mouth_smile', smile)):
        im.save(SRC('face', n + '.png'))
        a = np.asarray(im)[..., 3] > 127; ys, xs = np.where(a); p = P[n]; x0, y0, w, h = p['rect_head_px']; sx, sy = w / im.size[0], h / im.size[1]
        print(f'{n:13s} 画布 {im.size}  头部像素：x {x0 + xs.min() * sx:.1f}–{x0 + xs.max() * sx:.1f}（中心 {x0 + (xs.min() + xs.max()) / 2 * sx:.1f}） y {y0 + ys.min() * sy:.1f}–{y0 + ys.max() * sy:.1f}  '
              f'离画布边 左 {xs.min()} 右 {im.size[0] - 1 - xs.max()} 上 {ys.min()} 下 {im.size[1] - 1 - ys.max()} px')
