#!/usr/bin/env python3
"""贴片盖没盖严：逐帧数「换掉眼睛的表情贴上去之后，眼眶区域里还露着的原帧像素」。

    python3 puppet/clips/patch_leak.py <片段库> <片段名> <逐帧渲染图目录（NN.png，画布同尺寸，透明底）> [--json out.json]

渲染图 = 播放器把某个表情贴在这段片段上逐帧出的图；第 0 帧必须是归位帧（贴片在那一帧是原样贴的，当作「应该长什么样」）。
每一帧：把第 0 帧的渲染图按这一帧的头部跟踪搬过来当参照；在眼眶区域（原画眼睛各层的外接范围外扩 8px，按跟踪搬过来）里，
数渲染图上「很深的线」（三个通道都 < 80）和「眼白」（三个通道都 > 232）而参照图附近 5px 内没有的像素——就是没盖住的原帧睫毛线、眼白。
只出读数（每帧：深色、眼白各多少像素，分左右眼）；多少算坏帧要对着图定。没有头部跟踪的库不能用。"""
import json, os, sys
import cv2, numpy as np


def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]; root, clip, d = a[0].rstrip('/'), a[1], a[2]; jout = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    if jout in a: a.remove(jout)
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); W, H = lib['canvas']['w'], lib['canvas']['h']; char = os.path.dirname(root)
    al = lib['poses'][lib['rest']]['patches']['align']; r = np.radians(al['rotate_deg']); Mm = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0]]) * al['scale']; Mm[:, 2] = al['translate']
    org = json.load(open(os.path.join(char, 'source', 'face', 'face.json'), encoding='utf-8'))['head_org']
    parts = {p['id']: p for p in json.load(open(os.path.join(char, 'source', 'face', 'eyes.json'), encoding='utf-8'))['parts']}
    reg = {}
    for s in 'LR':
        m = np.zeros((2200, 2400), np.uint8)
        for q in ('eyeWhite', 'iris', 'lash', 'eyeLow'):
            x, y, w, h = parts[q + s]['rect']; im = cv2.imread(os.path.join(char, 'source', 'face', parts[q + s]['src']), cv2.IMREAD_UNCHANGED)
            if (im.shape[1], im.shape[0]) != (round(w), round(h)): im = cv2.resize(im, (round(w), round(h)))
            x, y = int(round(x)), int(round(y)); m[y:y + im.shape[0], x:x + im.shape[1]] = np.maximum(m[y:y + im.shape[0], x:x + im.shape[1]], (im[..., 3] > 10) * 255)
        reg[s] = cv2.dilate(cv2.warpAffine(m, Mm, (W, H), flags=cv2.INTER_LINEAR), np.ones((17, 17), np.uint8))
    if '--pose' in sys.argv:              # 静帧模式（不依赖 headTracks）：<片段名> 的位置填姿势名，<目录> 里要有 <姿势>.png 和 <归位姿势>.png（同一个表情贴在两张静帧上的渲染图）
        def amat(n): q = lib['poses'][n]['patches']['align']; rr = np.radians(q['rotate_deg']); m = np.array([[np.cos(rr), -np.sin(rr), 0], [np.sin(rr), np.cos(rr), 0]]) * q['scale']; m[:, 2] = q['translate']; return np.vstack([m, [0, 0, 1]])
        A = (amat(clip) @ np.linalg.inv(amat(lib['rest'])))[:2].astype(np.float32); rd = lambda n: cv2.imread(f'{d}/{n}.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
        fl = lambda im: (im[..., :3] * (im[..., 3:] / 255) + 160 * (1 - im[..., 3:] / 255)); cur = fl(rd(clip)); ref = cv2.warpAffine(fl(rd(lib['rest'])), A, (W, H), flags=cv2.INTER_LINEAR, borderValue=(160, 160, 160))
        dark = lambda im: im.max(2) < 80; white = lambda im: im.min(2) > 232; k = np.ones((11, 11), np.uint8); out = {}
        for s_ in 'LR':
            rg = cv2.warpAffine(reg[s_], A, (W, H), flags=cv2.INTER_NEAREST) > 127
            out['dark' + s_] = int((dark(cur) & ~cv2.dilate(dark(ref).astype(np.uint8), k).astype(bool) & rg).sum()); out['white' + s_] = int((white(cur) & ~cv2.dilate(white(ref).astype(np.uint8), k).astype(bool) & rg).sum())
        print(f'静帧 {clip} @ {os.path.basename(d)}：眼眶里比归位帧多出的 深色 左 {out["darkL"]} 右 {out["darkR"]} / 眼白 左 {out["whiteL"]} 右 {out["whiteR"]} px'); return
    files = lib['clips'][clip]['frames']; tr = lib['headTracks']
    ld = lambda i: cv2.imread(f'{d}/{i:02d}.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
    fl = lambda im: (im[..., :3] * (im[..., 3:] / 255) + 160 * (1 - im[..., 3:] / 255))
    ref0 = fl(ld(0)); rows = []
    for i, f in enumerate(files):
        m = tr[f]['m']; A = np.float32([[m[0], -m[1], m[2]], [m[1], m[0], m[3]]]); cur = fl(ld(i)); ref = cv2.warpAffine(ref0, A, (W, H), flags=cv2.INTER_LINEAR, borderValue=(160, 160, 160))
        dark = lambda im: im.max(2) < 80; white = lambda im: im.min(2) > 232; k = np.ones((11, 11), np.uint8); row = {'frame': i}
        for s in 'LR':
            rg = cv2.warpAffine(reg[s], A, (W, H), flags=cv2.INTER_NEAREST) > 127
            row['dark' + s] = int((dark(cur) & ~cv2.dilate(dark(ref).astype(np.uint8), k).astype(bool) & rg).sum()); row['white' + s] = int((white(cur) & ~cv2.dilate(white(ref).astype(np.uint8), k).astype(bool) & rg).sum())
        row['total'] = row['darkL'] + row['darkR'] + row['whiteL'] + row['whiteR']; rows.append(row)
    t = [q['total'] for q in rows]; print(f'{clip} @ {os.path.basename(d)}：露出像素 合计 {sum(t)}，每帧 中位 {int(np.median(t))} / 最大 {max(t)}（第 {int(np.argmax(t))} 帧）；≥ 30 像素的帧 {[q["frame"] for q in rows if q["total"] >= 30]}')
    print('   逐帧（深色左+右 / 眼白左+右）：', ' '.join(f'{q["frame"]}:{q["darkL"]}+{q["darkR"]}/{q["whiteL"]}+{q["whiteR"]}' for q in rows if q['total'] >= 10))
    if jout: json.dump(rows, open(jout, 'w'))


if __name__ == '__main__':
    main()
