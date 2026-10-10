#!/usr/bin/env python3
"""真实片上手 / 袖子压到脸的帧：逐帧 4 倍放大图（300×240 的窗，鼻点在窗内偏左上） + 「五官墨迹落在手描边以内的像素数」，人能对着图核对（#1274）。

    python3 puppet/clips/face_mask_hand_check.py <库> <片段> <起帧-止帧> <输出目录> [--step 1]

遮挡物区域（图上黄线描出来的）= 这一帧比「按 headTrack 搬过来的空脸归位帧」多出来的东西（和任何 5×5 邻域最接近的像素差 > 30 且不是发色，或非肤色非发色的不透明像素，和 face_mask_real.py 同一条真值），
闭运算后把里面围住的洞填上——手心和脸同色、不算「多出来的」，但被手自己的描边围住，所以算在手描边以内。区域只取脸范围外扩 40px 里。
图：左 = 原帧，右 = 原帧上叠 angry 五官墨迹（绿 50%），黄线 = 遮挡物区域轮廓，红 = 落在区域里的墨迹像素。每帧一张 4 倍图 + 一张总览。
读数（逐帧）：默认脸 / angry 的墨迹（透明度 > 0.1）落在区域里的像素数；区域面积；区域和 base 遮罩的重叠像素数。"""
import json, os, sys
import cv2, numpy as np
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import face_mask as FM


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def Mof(m): a, b, tx, ty = m; return np.array([[a, -b, tx], [b, a, ty]], np.float64)


def main(root, clip, rng, out, step=1):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p); H, W = lib['canvas']['h'], lib['canvas']['w']; tr = lib['headTracks']
    rest = rgba(P(lib['poses'][lib['rest']]['frame'])); nose = lib['headTrackRefs']['nose']; sil = FM.rest_silhouette(rest, nose); pt = lib['poses'][lib['rest']]['patches']; images = {}
    def load(q):
        if q and q['file'] not in images: images[q['file']] = rgba(P(q['file'])).astype(np.float32)
        return q
    def alpha(q, M):
        full = np.zeros((H, W, 4), np.float32); x, y, w, h = q['rect']; full[y:y + h, x:x + w] = images[q['file']]; return cv2.warpAffine(full[..., 3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR) / 255
    dk = pt['ink']['default']; ang = pt['face']['angry']
    faces = {'默认脸': ([load(dk.get('eyes')), load(dk.get('mouth'))], [load(dk.get('brow'))]), 'angry': ([load(ang.get('eyesInk') or ang['eyes']), load(ang.get('mouthInk') or ang['mouth'])], [load(ang.get('brow'))])}
    os.makedirs(out, exist_ok=True); a0, a1 = map(int, rng.split('-')); files = lib['clips'][clip]['frames']; rows = []; tiles = []
    for i in range(a0, a1 + 1, step):
        f = files[i]; fr = rgba(P(f)); M = Mof(tr[f]['m']); mk = tr[f]['maskInk']; hh = cv2.imread(P(mk['file']), cv2.IMREAD_UNCHANGED); rx, ry, rw, rh = mk['rect']
        bm = np.zeros((H, W), np.float32); tm = np.zeros((H, W), np.float32); bm[ry:ry + rh, rx:rx + rw] = hh[:, :rw, 3] / 255; tm[ry:ry + rh, rx:rx + rw] = hh[:, rw:, 3] / 255
        sil_w = cv2.warpAffine(sil.astype(np.uint8) * 255, np.float32(M), (W, H), flags=cv2.INTER_LINEAR) > 127; near8 = cv2.dilate(sil_w.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0; near40 = cv2.dilate(sil_w.astype(np.uint8), np.ones((81, 81), np.uint8)) > 0
        pred = cv2.warpAffine(rest[..., :3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.int16); fr16 = fr[..., :3].astype(np.int16); d = np.full((H, W), 255, np.int16)
        for dy in (-2, -1, 0, 1, 2):
            for dx in (-2, -1, 0, 1, 2): d = np.minimum(d, np.abs(fr16 - np.roll(pred, (dy, dx), (0, 1))).max(2))
        b_, g_, r_ = [fr[..., k].astype(np.int16) for k in range(3)]; warm = (r_ - g_ > 25) & ((114 * b_ + 587 * g_ + 299 * r_) // 1000 > 90); hair = FM.hair_px(fr); hair_adj = cv2.dilate(hair.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        occ = near40 & (fr[..., 3] > 200) & ~(warm & (cv2.dilate(hair.astype(np.uint8), np.ones((13, 13), np.uint8)) > 0)) & ~hair_adj & ((d > 30) & ~hair | (~FM.skin_px(fr) & ~hair))
        occ = cv2.morphologyEx(occ.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)); n, lab, st, _ = cv2.connectedComponentsWithStats(occ); occ = np.isin(lab, [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] >= 150])      # 去掉 < 150px 的碎块（脸轮廓线、发丝高光）
        region = cv2.morphologyEx(occ.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
        cs0, _ = cv2.findContours(region, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); region = np.zeros_like(region); cv2.drawContours(region, cs0, -1, 1, -1); region = region > 0      # 填外轮廓（不是只填闭合的洞）：描边有缺口时手心也算在手里；图上黄线 = 这个轮廓，数的就是线里面的
        # 区域只算「外面伸进来的」：面积 < 400 的当没有（单帧的脸轮廓线一类）
        n, lab, st, _ = cv2.connectedComponentsWithStats(region.astype(np.uint8)); region = np.isin(lab, [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] >= 400])
        inkm = {}
        for name, (bl, tl) in faces.items():
            ink = np.zeros((H, W), np.float32)
            for q in bl:
                if q: ink = np.maximum(ink, alpha(q, M) * bm)
            for q in tl:
                if q: ink = np.maximum(ink, alpha(q, M) * tm)
            inkm[name] = ink
        if os.environ.get('HC_DUMP'): np.save(os.path.join(out, f'dump_{i:02d}.npy'), np.stack([region, inkm['angry'] > 0.1]))
        row = {'frame': i, 'region_px': int(region.sum()), 'region_in_face_near8_px': int((region & near8).sum())}
        for name, ink in inkm.items(): row[name] = int(((ink > 0.1) & region).sum())
        rows.append(row)
        c = np.array(M[:, :2] @ np.array(nose) + M[:, 2]).astype(int); x0, y0 = max(0, c[0] - 130), max(0, c[1] - 120); X1, Y1 = x0 + 300, y0 + 240
        left = np.where((fr[..., 3:] > 128), fr[..., :3], 235).astype(np.uint8)[y0:Y1, x0:X1]; comp = np.where((fr[..., 3:] > 128), fr[..., :3], 235).astype(np.float32); a_ = np.clip(inkm['angry'], 0, 1)[..., None]; comp = comp * (1 - a_ * .5) + np.array([0, 170, 0], np.float32) * a_ * .5
        leak = (inkm['angry'] > 0.1) & region; comp[leak] = (0, 0, 255); right = comp.astype(np.uint8)[y0:Y1, x0:X1]
        big = [cv2.resize(x, None, fx=4, fy=4, interpolation=cv2.INTER_NEAREST) for x in (left, right)]
        cs, _ = cv2.findContours(cv2.resize(region[y0:Y1, x0:X1].astype(np.uint8), None, fx=4, fy=4, interpolation=cv2.INTER_NEAREST), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        for im in big: cv2.drawContours(im, cs, -1, (0, 255, 255), 2)
        img = np.hstack(big); cv2.putText(img, f'{clip} #{i}  angry {row["angry"]}px  default {row["默认脸"]}px  region {row["region_px"]}px', (8, 24), 0, .7, (0, 0, 0), 2); cv2.imwrite(os.path.join(out, f'{clip}_{i:02d}.png'), img); tiles.append(cv2.resize(img, None, fx=.5, fy=.5))
    cols = 2; hh_, ww_ = tiles[0].shape[:2]; sheet = np.full((((len(tiles) + cols - 1) // cols) * hh_, cols * ww_, 3), 255, np.uint8)
    for k, t in enumerate(tiles): sheet[(k // cols) * hh_:(k // cols + 1) * hh_, (k % cols) * ww_:(k % cols + 1) * ww_] = t
    cv2.imwrite(os.path.join(out, f'{clip}_sheet.png'), sheet); json.dump(rows, open(os.path.join(out, f'{clip}_readings.json'), 'w'), ensure_ascii=False, indent=1)
    print(clip, f'帧 {a0}–{a1}：默认脸 落在手区域里 合计 {sum(r["默认脸"] for r in rows)}px 最大单帧 {max(r["默认脸"] for r in rows)}px；angry 合计 {sum(r["angry"] for r in rows)}px 最大单帧 {max(r["angry"] for r in rows)}px（第 {max(rows, key=lambda r: r["angry"])["frame"]} 帧）；手区域面积 最大 {max(r["region_px"] for r in rows)}px')


if __name__ == '__main__':
    a = sys.argv[1:]; step = 1
    if '--step' in a: i = a.index('--step'); step = int(a[i + 1]); a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1], a[2], a[3], step)
