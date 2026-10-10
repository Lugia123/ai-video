#!/usr/bin/env python3
"""十字标版（#1262）：给 head3x 的逐帧截图叠两个十字，肉眼判断「贴上去的五官相对头晃不晃」。

    python3 puppet/clips/cross_markers.py <空脸库> <head3x 帧目录（含 f####.png 和 meta.json）> <输出目录> [--clip-x 1180 --clip-y 280 --scale 3 --fps 30 --out-mp4 x.mp4]

红十字 = 头上固定点：发卡中心，在**这一帧里**用模板匹配（亚像素）找到的真实位置（不是变换预测的）。
绿十字 = 贴上去的眼角：左眼外眼角的参照点按这一帧的头部变换搬过来的位置（五官贴片钉在哪）。
如果五官相对头不晃，两个十字之间的距离（向量）应当逐帧几乎不变；晃的话绿十字会相对红十字抖。
同时算每帧「绿 − 红」向量，输出它的逐帧抖动（高频残差 RMS、二阶差 RMS）。meta.json 由 head3x.mjs（META=1）写。"""
import json, os, sys, subprocess
import cv2, numpy as np
from scipy.signal import savgol_filter


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def Mof(m): a, b, tx, ty = m; return np.array([[a, -b, tx], [b, a, ty]], np.float64)
def gray(im): a = im[..., 3:].astype(np.float32) / 255; return cv2.cvtColor((im[..., :3] * a + 255 * (1 - a)).astype(np.uint8), cv2.COLOR_BGR2GRAY)


def main(root, fdir, out, cx=1180, cy=280, sc=3, fps=30, mp4=None):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p); tr = lib['headTracks']; meta = json.load(open(os.path.join(fdir, 'meta.json')))
    rest = rgba(P(lib['poses'][lib['rest']]['frame'])); R = lib['headTrackRefs']; pin0 = np.array(R['pin']); g0 = gray(rest).astype(np.float32); ax, ay = lib['anchor']['x'], lib['anchor']['y']; br = lib['breath']
    half = 22; tmpl = g0[int(round(pin0[1])) - half:int(round(pin0[1])) + half + 1, int(round(pin0[0])) - half:int(round(pin0[0])) + half + 1]
    os.makedirs(out, exist_ok=True); rel = []; ini = {}
    for m in meta:
        i = m['i']; t = i / fps; b = 1 + br['amp'] * np.sin(2 * np.pi * t / br['period'])
        if m.get('file') or (m.get('clip') and m.get('frame') is not None):
            f = m.get('file') or lib['clips'][m['clip']]['frames'][m['frame']]; M = Mof(tr[f]['m']) if f in tr else np.array([[1, 0, 0], [0, 1, 0]], np.float64); g1 = gray(rgba(P(f))).astype(np.float32)
        else: M = np.array([[1, 0, 0], [0, 1, 0]], np.float64); g1 = g0
        pp = M[:, :2] @ pin0 + M[:, 2]; ix, iy = int(round(pp[0])), int(round(pp[1])); r = half + 12
        win = g1[iy - r:iy + r + 1, ix - r:ix + r + 1]; res = cv2.matchTemplate(win, tmpl, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(res); cxm, cym = loc; sx = sy = 0.0
        if 0 < cxm < res.shape[1] - 1 and 0 < cym < res.shape[0] - 1:
            a, bb, c = res[cym, cxm - 1], res[cym, cxm], res[cym, cxm + 1]; d = a - 2 * bb + c; sx = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0
            a, bb, c = res[cym - 1, cxm], res[cym, cxm], res[cym + 1, cxm]; d = a - 2 * bb + c; sy = 0.5 * (a - c) / d if abs(d) > 1e-9 else 0
        red = np.array([ix - r + cxm + sx + half - half, iy - r + cym + sy])                     # 模板左上角位置；中心 = + half 已在 pin0 对应里，这里换算成中心
        red = np.array([ix - r + cxm + sx + half, iy - r + cym + sy + half]) - np.array([half, half]) + (pin0 - np.round(pin0)) if False else np.array([ix - r + cxm + sx + half + (pin0[0] - round(pin0[0])), iy - r + cym + sy + half + (pin0[1] - round(pin0[1]))])
        green = M[:, :2] @ np.array(R['eyeL']) + M[:, 2]
        def page(p): x2, y2 = ax + (p[0] - ax) * (2 - b), ay + (p[1] - ay) * b; return ((1400 + (x2 - ax)) - cx) * sc, ((1030 + (y2 - ay)) - cy) * sc
        pr, pg = page(red), page(green); rel.append(green - red); ini[i] = (pr, pg, mx)
        im = cv2.imread(os.path.join(fdir, f'f{i:04d}.png'))
        for p_, col in ((pr, (60, 60, 255)), (pg, (60, 200, 60))):
            x, y = int(round(p_[0])), int(round(p_[1])); cv2.line(im, (x - 22, y), (x + 22, y), (255, 255, 255), 6); cv2.line(im, (x, y - 22), (x, y + 22), (255, 255, 255), 6); cv2.line(im, (x - 22, y), (x + 22, y), col, 2); cv2.line(im, (x, y - 22), (x, y + 22), col, 2)
        cv2.imwrite(os.path.join(out, f'f{i:04d}.png'), im)
    rel = np.array(rel); idx = [m['i'] for m in meta]
    hfv = lambda s, w=9: float(np.sqrt(((s - np.stack([savgol_filter(s[:, k], w, 2, mode='interp') for k in range(2)], 1)) ** 2).sum(1).mean()))
    print(f'绿 − 红 向量（贴上去的眼角相对发卡）：均值 ({rel[:, 0].mean():.1f}, {rel[:, 1].mean():.1f})px，逐帧高频残差 RMS {hfv(rel):.2f}px，二阶差 RMS {float(np.sqrt((np.diff(rel, 2, axis=0) ** 2).sum(1).mean())):.2f}px；模板匹配得分最低 {min(v[2] for v in ini.values()):.2f}')
    if mp4: subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-framerate', str(fps), '-i', os.path.join(out, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', mp4], check=True)


if __name__ == '__main__':
    a = sys.argv[1:]; opt = {}
    for k in ('--clip-x', '--clip-y', '--scale', '--fps', '--out-mp4'):
        if k in a: i = a.index(k); opt[k] = a[i + 1]; a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1], a[2], int(opt.get('--clip-x', 1180)), int(opt.get('--clip-y', 280)), int(opt.get('--scale', 3)), int(opt.get('--fps', 30)), opt.get('--out-mp4'))
