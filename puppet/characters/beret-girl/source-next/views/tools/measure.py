#!/usr/bin/env python3
"""实测一张头部图的水平转角（yaw）。#1151：生图给的角度不可信，入库前必须量。

为什么是人工读点：试过自动找（肤色块 + 深色连通块当眼睛），在母版上能用，在生成的斜侧图上会把刘海阴影、
睫毛和虹膜连成一块，量出来差 30° 以上，不可用。现在的做法是用 grid.py 给脸部叠坐标网格，人眼读出
两只虹膜的左右上下边界和鼻尖的 x，记在 points.json 里，这个脚本只做换算。

用法：python3 measure.py points.json            对里面每一条算角度，打印并写回 est 字段
points.json 每条：{"file":…, "near":[x0,x1,y0,y1], "far":[x0,x1,y0,y1] 或 null, "nose_x":…, "note":…}
  near = 靠近镜头那只眼的虹膜外接框，far = 远侧那只；只看得到一只眼时 far 写 null。
第一条必须是正面母版（基线）。

两个互相独立的估计（参考数字来自 research/ai-live2d-methodology.md 第 1 节，Live2D 官方样例 Mao 上量的：
转 30° 时远侧眼宽 0.87–0.90、近侧 1.07–1.09；以脸宽为 1，鼻尖位移 0.25、瞳孔 0.18）：
  A 眼宽比：r = 远侧虹膜宽 ÷ 近侧虹膜宽。按球面，r = (1 − tanθ·tanφ)/(1 + tanθ·tanφ)，
    φ 取使 r(30°) = 0.885/1.08 = 0.82 的值（φ ≈ 9.7°）。反解 tanθ = (1 − r)/((1 + r)·tanφ)。
  B 鼻尖相对两眼中点的偏移：Δ =（鼻尖 x − 两眼中点 x）÷ 脸宽，减去母版的基线；
    30° 时 Δ = 0.25 − 0.18 = 0.07，按 sinθ 线性：sinθ = Δ / 0.14。脸宽用「4.2 × 虹膜高」折算（母版上脸宽约为虹膜高的 4.2 倍；
    斜侧图里近侧脸缘被头发盖住，直接量不到）。
结果：**以 A（眼宽比）为准**，yaw = A。B 只当旁证：
  第一张 40 步定稿（head_045_v2_f311）量出来 A = 62°、B 饱和到 90°——Q 版 3/4 侧脸的画法习惯是把鼻尖贴到远侧脸缘，
  B 的参考系数（正常头身的 Live2D 模型）在这里不适用，一过 40° 就饱和。所以：
  B 没饱和（< 80°）且和 A 相差不到 15°：range = 两者的最小最大各放宽 5°；
  否则：range = A ± 8°，并在 warn 里写明 B 的读数。
只看得到一只眼：记为 75°–100°（正侧面一类），不给单值，除非人工另给理由。
C 球面几何法（2026-10-07 13:50 加，和 A 的结论差一倍，两个都报）：
  在眼睛高度读三个 x：远侧脸缘 x_c、两眼内眼角连线的中点 x_m（脸的中线）、近侧耳朵中心 x_e。
  把头当成半径 R 的球、脸朝前、耳朵在正侧面：转 θ 后远侧轮廓在 −R，中线在 −R·sinθ，耳朵在 +R·cosθ，
  所以 t = (x_m − x_c)/(x_e − x_c) = (1 − sinθ)/(1 + cosθ)，与图的大小无关。0° 时 0.5，30° 时 0.27，45° 时 0.17，60° 时 0.09。
  points.json 里可选字段 "contour_x"、"ear_x"；有就算。
  实测：同一张图 A 给 62°、C 给 28°（head_045_v2_f311）；A 给 33°、C 给 10°（d212）。
  原因：Q 版 3/4 侧脸的画法是「远侧眼睛很快压窄，但脸仍然画得很宽、耳朵仍在很靠外的位置」，不是一个球在转。
  A 的标定来自正常头身的 Live2D 模型（那里的「参数 30」本身也不是真角度）。**哪个口径算数，要由用这些图的人（W4 的形变模型）定。**
Q 版的五官是贴在脸上的大图案，不严格服从球面投影——这些数是估计，W4 会用自己的办法再反算一遍。"""
import sys, json, math
TANPHI = (1 - 0.82) / ((1 + 0.82) * math.tan(math.radians(30)))

def est(p, base):
    if p.get('far') is None:
        return {'kind': 'one-eye', 'range': [75, 100], 'yaw': None}
    n, f = p['near'], p['far']
    wn, wf = n[1] - n[0], f[1] - f[0]; h = ((n[3] - n[2]) + (f[3] - f[2])) / 2
    r = min(1.0, wf / wn); tA = math.degrees(math.atan((1 - r) / ((1 + r) * TANPHI)))
    mid = ((n[0] + n[1]) / 2 + (f[0] + f[1]) / 2) / 2; delta = (p['nose_x'] - mid) / (4.2 * h)
    d = abs(delta - (base or 0)); tB = math.degrees(math.asin(min(1.0, d / 0.14)))
    out = {'kind': 'two-eyes', 'width_ratio': round(r, 3), 'yaw_by_width_ratio': round(tA, 1), 'nose_offset': round(delta, 4), 'yaw_by_nose': round(tB, 1), 'yaw': round(tA)}
    if tB < 80 and abs(tA - tB) <= 15: out['range'] = [max(0, round(min(tA, tB) - 5)), round(max(tA, tB) + 5)]
    else:
        out['range'] = [max(0, round(tA - 8)), round(tA + 8)]; out['warn'] = f'鼻尖法读数 {tB:.0f}°' + ('（饱和）' if tB >= 80 else '') + '，与眼宽比法不一致，只采信眼宽比'
    out['facing'] = 'left' if (f[0] + f[1]) < (n[0] + n[1]) else 'right'
    if p.get('contour_x') is not None and p.get('ear_x') is not None:
        inner = (max(f[0], f[1]) + min(n[0], n[1])) / 2 if out['facing'] == 'left' else (max(n[0], n[1]) + min(f[0], f[1])) / 2
        t = abs(inner - p['contour_x']) / abs(p['ear_x'] - p['contour_x'])
        tC = min(range(0, 91), key=lambda d: abs((1 - math.sin(math.radians(d))) / (1 + math.cos(math.radians(d))) - t))
        out['sphere_t'] = round(t, 3); out['yaw_by_sphere'] = tC; out['range_sphere'] = [max(0, tC - 6), tC + 6]
    return out

if __name__ == '__main__':
    path = sys.argv[1]; pts = json.load(open(path, encoding='utf-8'))
    b = pts[0]; n, f = b['near'], b['far']; h = ((n[3] - n[2]) + (f[3] - f[2])) / 2
    base = (b['nose_x'] - ((n[0] + n[1]) / 2 + (f[0] + f[1]) / 2) / 2) / (4.2 * h)
    for i, p in enumerate(pts):
        p['est'] = est(p, None if i == 0 else base) if i else {'kind': 'baseline', 'nose_offset': round(base, 4), 'yaw': 0}
        print(p['file'], json.dumps(p['est'], ensure_ascii=False))
    json.dump(pts, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
