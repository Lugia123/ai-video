#!/usr/bin/env python3
"""空脸库的「默认脸」贴片：直接从原来有脸的归位帧上取（眉 + 眼 + 鼻 + 嘴），所以「空脸归位帧 + 默认脸」和原归位帧逐像素相同。

    python3 puppet/clips/make_default_face.py puppet/characters/<角色>/<空脸库> --orig <原归位帧.png> [--noBrow <无眉的原归位帧.png>]

做法：
  D = 空脸归位帧和原归位帧不一样的所有像素（含各种边界瑕疵——贴片边缘的切口、小尖点，都算进来，所以一定逐像素还原）。
  眉的那一条（原归位帧和「无眉归位帧」不一样的地方，外扩 9px）∩ D → 眉块（画在刘海上层）；其余的 D → 底块（眼、鼻、嘴，在刘海下面）。
  两块都直接取原归位帧的像素，范围 = 各自那部分 D 外扩 2px（D 外面两张图本来就一样，外扩那一圈不改变结果，只让动作中搬过去时边缘不留缝）。
写 patches/idle/default_{base,brow}.png，并在 poses.<归位>.patches.defaultFace 记下 { base, brow, orig, verified }；之后再跑 sync.py。
verified = 把两块按「底块、眉块」的顺序叠回空脸帧，和原归位帧比：不同的像素数、最大色差（都应为 0）。"""
import json, os, sys
import cv2, numpy as np


def main(root, orig, nobrow):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); name = lib['rest']; P = lambda *p: os.path.join(root, *p)
    blank = cv2.imread(P(lib['poses'][name]['frame']), cv2.IMREAD_UNCHANGED); o = cv2.imread(orig, cv2.IMREAD_UNCHANGED)
    if blank.shape != o.shape: sys.exit(f'尺寸不同：空脸 {blank.shape}，原归位帧 {o.shape}')
    D = (blank != o).any(2)
    # 三块：眉（原归位帧和「无眉归位帧」不一样的那几个像素外扩 1px，画在刘海上层）、底块（眼 / 鼻 / 嘴 / 脸上其余的 D，让开头发边）、
    # 发边修补（D 里落在头发范围 ± 2px 以内的像素：只有静帧、几乎没动的帧才画，动起来头发形状变了，贴原画的发丝会错位成一块一块的）。
    # 头发范围 = bake_patches.py 存的 patches/<归位>/hair_all.png。三块都取原归位帧的像素，叠起来 = 原归位帧。
    if nobrow:
        nb = cv2.imread(nobrow, cv2.IMREAD_UNCHANGED); ch = ((np.abs(nb.astype(int) - o.astype(int)).max(2) > 3) & (o[..., 3] > 0)).astype(np.uint8)       # 透明处的 RGB 垃圾值不算
        win = np.zeros_like(ch); fy0, fy1, fx0, fx1 = [int(v) for v in np.percentile(np.argwhere(D), [0, 100], axis=0).T.ravel()][0:2] + [int(np.where(D.any(0))[0].min()), int(np.where(D.any(0))[0].max())]; win[fy0:fy1 + 1, fx0:fx1 + 1] = 1; ch = ch * win          # 眉只可能在改动范围（D）的外接框里
        n_, lab_, st_, _ = cv2.connectedComponentsWithStats(ch, connectivity=8); keep_ = [i for i in range(1, n_) if 30 <= st_[i, cv2.CC_STAT_AREA] <= 5000]
        Rb = cv2.dilate(np.isin(lab_, keep_).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    else: Rb = np.zeros(D.shape, bool)
    hp = P('patches', name, 'hair_all.png')
    hz = cv2.dilate((cv2.imread(hp, cv2.IMREAD_UNCHANGED) > 127).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0 if os.path.exists(hp) else np.zeros(D.shape, bool)
    if not hz.any(): print('（没有 hair_all.png：先跑 bake_patches.py；这次不分发边修补）')
    Dr = D & ~Rb; Dbase, Dhair = Dr & ~hz, Dr & hz
    k = np.ones((5, 5), np.uint8)       # 底块外扩 2px（但不进头发范围）
    regs = {'base': (cv2.dilate(Dbase.astype(np.uint8), k) > 0) & ~hz, 'hair': cv2.dilate(Dhair.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0, 'brow': Rb & (D | Rb)}
    out = {}; rec = {}
    for key, reg in regs.items():
        if not reg.any(): continue
        ys, xs = np.where(reg); x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        img = o.copy(); img[..., 3] = np.where(reg, o[..., 3], 0); crop = img[y0:y1, x0:x1]
        rel = f'patches/{name}/default_{key}.png'; os.makedirs(os.path.dirname(P(rel)), exist_ok=True); cv2.imwrite(P(rel), crop)
        out[key] = reg; rec[key] = {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)]}
    Db = D & Rb
    comp = blank.copy()
    for key in ('base', 'hair', 'brow'):                     # 叠回去（原像素直通：这些区域里原归位帧的 alpha 就是它自己的）
        if key in out: comp[out[key]] = o[out[key]]
    nd = int((comp != o).any(2).sum()); mx = int(np.abs(comp.astype(int) - o.astype(int)).max())
    # 再用播放器的画法（带 alpha 的 over）验一遍：贴片图叠到空脸帧上
    c2 = blank.astype(np.float32)
    for key in ('base', 'hair', 'brow'):
        if key not in rec: continue
        x, y, w, h = rec[key]['rect']; pa = cv2.imread(P(rec[key]['file']), cv2.IMREAD_UNCHANGED).astype(np.float32); a = pa[..., 3:] / 255; d = c2[y:y + h, x:x + w]
        da = d[..., 3:] / 255; oa = a + da * (1 - a); d[..., :3] = np.where(oa > 0, (pa[..., :3] * a + d[..., :3] * da * (1 - a)) / np.maximum(oa, 1e-6), 0); d[..., 3:] = oa * 255
    nd2 = int((np.rint(c2).astype(np.uint8) != o).any(2).sum()); mx2 = int(np.abs(np.rint(c2) - o.astype(np.float32)).max())
    pose = lib['poses'][name]; pose.setdefault('patches', {})['defaultFace'] = dict(rec, orig=os.path.relpath(orig, root), noBrow=os.path.relpath(nobrow, root) if nobrow else None,
        verified={'diffPixels': nd2, 'maxDiff': mx2, 'diffPixelsExactMask': nd, 'D_px': int(D.sum()), 'brow_px': int(Db.sum())})
    json.dump(lib, open(P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'默认脸：底块 {rec.get("base", {}).get("rect")}，发边修补 {rec.get("hair", {}).get("rect")}（{int(Dhair.sum())}px），眉块 {rec.get("brow", {}).get("rect")}；D={int(D.sum())}px（眉 {int(Db.sum())}px）；空脸 + 默认脸 vs 原归位帧：不同像素 {nd2}，最大色差 {mx2}')
    return 0 if nd2 == 0 and mx2 == 0 else 1


if __name__ == '__main__':
    a = sys.argv[1:]; opt = {}; pos = []; it = iter(a)
    for x in it:
        if x in ('--orig', '--noBrow'): opt[x] = next(it)
        else: pos.append(x)
    if len(pos) != 1 or '--orig' not in opt: sys.exit(__doc__)
    sys.exit(main(pos[0].rstrip('/'), opt['--orig'], opt.get('--noBrow')))
