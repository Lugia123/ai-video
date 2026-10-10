#!/usr/bin/env python3
"""空脸 B 遍帧里「漏画出来的嘴」的定位和修补（只动嘴窗口内的像素；不重生成、不碰控制视频）。在 puppet/ 下跑：

    python3 characters/beret-girl/clips-newact-fix/mouthfix.py measure <库目录> <片段名> <B 帧目录> <读数.json>
    python3 characters/beret-girl/clips-newact-fix/mouthfix.py fix     <库目录> <片段名> <B 帧目录> <输出帧目录> <读数.json> [--frames 13,14,15]

窗口：有五官归位帧和空脸归位帧逐像素比，得到眼、眉、嘴各自的包围盒（归位帧坐标），四边各放 PAD px；每帧用库里 headTracks 的相似变换搬到这一帧。
异色像素：窗口内这一帧和「空脸归位帧按同一变换搬过来」的 RGB 最大通道差 > THR 的像素数。
泄漏帧：嘴窗口异色像素 > 首帧（= 空脸归位帧自己）+ LEAK 的帧；--frames 可以人工指定。
修补：泄漏帧的嘴窗口内，换成最近的不泄漏帧（按两帧的头部变换对位）同位置的颜色，窗口边缘向内羽化 FEATHER px；找不到邻帧用空脸归位帧搬过来的。窗口外、alpha 一律不动。"""
import json, os, sys, shutil, numpy as np, cv2
PAD = 10; THR = 30; LEAK = 40; FEATHER = 4; SKIN_ERODE = 6; SKIN = None; C = 'characters/beret-girl'


def rd(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def M2(m): a, b, tx, ty = m; return np.float64([[a, -b, tx], [b, a, ty]])
def inv(M): return cv2.invertAffineTransform(M)
def chain(A, B): return (np.vstack([A, [0, 0, 1]]) @ np.vstack([B, [0, 0, 1]]))[:2]   # 先 B 后 A


def windows():
    """有五官归位帧 − 空脸归位帧 的差异连通块 → {名字: [x0, y0, x1, y1]}（归位帧坐标，已放 PAD）。"""
    f = rd(f'{C}/clips-b1/frames/idle.png').astype(int); b = rd(f'{C}/clips-blank/home_blank_v2_rgba.png').astype(int)
    d = (np.abs(f[..., :3] - b[..., :3]).max(2) > 24).astype(np.uint8); d = cv2.morphologyEx(d, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, ce = cv2.connectedComponentsWithStats(d); bl = [(st[i], ce[i]) for i in range(1, n) if st[i][cv2.CC_STAT_AREA] >= 40]
    refs = json.load(open(sys.argv[2] + '/clips.json', encoding='utf-8'))['headTrackRefs']; out = {}
    def box(s): return [int(s[0]) - PAD, int(s[1]) - PAD, int(s[0] + s[2]) + PAD, int(s[1] + s[3]) + PAD]
    for s, c in bl:
        x0, y0, w, h = s[:4]; inside = lambda p: x0 - 6 <= p[0] <= x0 + w + 6 and y0 - 6 <= p[1] <= y0 + h + 6
        if inside(refs['mouth']): out['mouth'] = box(s)
        elif c[1] < refs['eyeL'][1] - 25: out['browL' if c[0] < refs['nose'][0] else 'browR'] = box(s)
        elif abs(c[1] - refs['eyeL'][1]) < 40: out['eyeL' if c[0] < refs['nose'][0] else 'eyeR'] = box(s)
        else: out[f'other_{int(c[0])}_{int(c[1])}'] = box(s)
    return out


def wmask(box, M, shape):
    x0, y0, x1, y1 = box; pts = np.float64([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); q = (M @ np.hstack([pts, np.ones((4, 1))]).T).T
    m = np.zeros(shape[:2], np.uint8); cv2.fillConvexPoly(m, np.round(q).astype(np.int32), 255); return m


def load(lib, clip, bdir):
    L = json.load(open(lib + '/clips.json', encoding='utf-8')); n = len(L['clips'][clip]['frames'])
    Ms = [M2(L['headTracks'][f'frames/{clip}/{i:02d}.png']['m']) for i in range(n)]
    return [rd(f'{bdir}/{i:02d}.png') for i in range(n)], Ms, rd(f'{C}/clips-blank/home_blank_v2_rgba.png')


def measure(fr, Ms, blank, W):
    """每帧每个窗口两个数：<名字> = 窗口内全部异色像素；<名字>_skin = 只数「空脸归位帧上是脸皮肤、且离头发 / 轮廓线 ≥ SKIN_ERODE px」的那部分
    （刘海、脸轮廓相对头的刚性变换会滑动，窗口里压到它们的异色像素不是五官；_skin 把这部分排除）。"""
    global SKIN
    h, w = blank.shape[:2]; rows = []; x0, y0, x1, y1 = W['mouth']; skin = np.median(blank[y0:y1, x0:x1, :3].reshape(-1, 3), 0)
    SKIN = cv2.erode(((np.abs(blank[..., :3].astype(int) - skin).max(2) < 45) & (blank[..., 3] > 250)).astype(np.uint8) * 255, np.ones((2 * SKIN_ERODE + 1,) * 2, np.uint8))
    for f, M in zip(fr, Ms):
        wb = cv2.warpAffine(blank, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        d = np.abs(f[..., :3].astype(int) - wb[..., :3].astype(int)).max(2) > THR
        sk = cv2.warpAffine(SKIN, M, (w, h), flags=cv2.INTER_NEAREST) > 0
        r = {k: int((d & (wmask(b, M, f.shape) > 0)).sum()) for k, b in W.items()}; r.update({k + '_skin': int((d & sk & (wmask(b, M, f.shape) > 0)).sum()) for k, b in W.items()}); rows.append(r)
    return rows


def main():
    mode, lib, clip, bdir = sys.argv[1:5]; fr, Ms, blank = load(lib, clip, bdir); W = windows(); rows = measure(fr, Ms, blank, W)
    base = rows[0]; leak = [i for i, r in enumerate(rows) if r['mouth'] > base['mouth'] + LEAK]
    info = {'clip': clip, 'b_frames': bdir, 'params': {'PAD': PAD, 'THR': THR, 'LEAK': LEAK, 'FEATHER': FEATHER}, 'windows_home_xyxy': W, 'window_size_wh': {k: [b[2] - b[0], b[3] - b[1]] for k, b in W.items()},
            'alien_px_before': rows, 'leak_frames_by_reading': leak, 'over_base_frames': {k: [i for i, r in enumerate(rows) if r[k] > base[k] + LEAK] for k in rows[0]}}
    if mode == 'measure':
        json.dump(info, open(sys.argv[5], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('窗口', info['window_size_wh']); print('超出首帧 +%d 的帧' % LEAK, info['over_base_frames'])
        for k in W: print(k, [r[k] for r in rows]); print(k + '_skin', [r[k + '_skin'] for r in rows])
        return
    out, rj = sys.argv[5], sys.argv[6]; a = sys.argv[7:]; fix = [int(x) for x in a[a.index('--frames') + 1].split(',')] if '--frames' in a else leak
    if os.path.exists(out): sys.exit(f'{out} 已经在了，不覆盖')
    os.makedirs(out); h, w = blank.shape[:2]; done = {}
    for i, f in enumerate(fr):
        if i not in fix: shutil.copy(f'{bdir}/{i:02d}.png', f'{out}/{i:02d}.png'); continue
        cand = sorted((j for j in range(len(fr)) if j not in fix and j not in leak), key=lambda j: (abs(j - i), j)); j = cand[0] if cand else None
        src = cv2.warpAffine(fr[j], chain(Ms[i], inv(Ms[j])), (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE) if j is not None else cv2.warpAffine(blank, Ms[i], (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        m = wmask(W['mouth'], Ms[i], f.shape); k = np.clip(cv2.distanceTransform(m, cv2.DIST_L2, 5) / FEATHER, 0, 1)[..., None]   # 窗口边上 0 → 向内 FEATHER px 处 1；窗口外恒 0
        g = f.copy(); g[..., :3] = np.round(f[..., :3] * (1 - k) + src[..., :3] * k).astype(np.uint8)
        assert (g[m == 0] == f[m == 0]).all() and (g[..., 3] == f[..., 3]).all()
        cv2.imwrite(f'{out}/{i:02d}.png', g, [cv2.IMWRITE_PNG_COMPRESSION, 6]); ys, xs = np.where(m > 0)
        done[i] = {'source': f'frame {j}' if j is not None else 'blank home', 'window_bbox_xyxy': [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1], 'window_px': int((m > 0).sum()), 'changed_px': int((g != f).any(2).sum())}
    fr2 = [rd(f'{out}/{i:02d}.png') for i in range(len(fr))]; rows2 = measure(fr2, Ms, blank, W)
    info.update({'fixed_frames': done, 'fixed_dir': out, 'alien_px_after': rows2, 'over_base_frames_after': {k: [i for i, r in enumerate(rows2) if r[k] > base[k] + LEAK] for k in rows2[0]}})
    json.dump(info, open(rj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for i, d in done.items(): print(i, d, '嘴窗口异色像素', rows[i]['mouth'], '→', rows2[i]['mouth'])
    print('修后仍超出首帧 +%d 的帧' % LEAK, info['over_base_frames_after'])


if __name__ == '__main__':
    main()
