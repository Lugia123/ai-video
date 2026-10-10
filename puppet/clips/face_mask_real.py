#!/usr/bin/env python3
"""真实空脸片段上逐帧量「五官落在遮挡物上的像素数」（硬指标，目标 0）。

    python3 puppet/clips/face_mask_real.py <空脸库> <片段名>… [--json 读数.json]

遮挡物的真值不用遮罩自己的逻辑，用独立的两条：
  A 按 headTrack 搬过来的空脸归位帧，这一帧脸范围（轮廓外扩 8px）里比它「多出来的东西」——和它任何 5×5 邻域里最接近的像素差 > 30 且不是发色的像素（手、描边、袖口……）；
  B 这一帧脸范围里不是肤色、不是发色的不透明像素。
五官 = 默认脸、angry、surprise，各按遮罩画（和播放器一样：base 层按 base 遮罩，眉按 top 遮罩），墨迹透明度 > 0.1 的像素落在 A ∪ B 里的数。
同时报每帧 base 遮罩面积，看有没有单帧突然缩 / 涨。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import face_mask as FM


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def Mof(m): a, b, tx, ty = m; return np.array([[a, -b, tx], [b, a, ty]], np.float64)


VIZ = None; STRICT = False        # --strict：不排除挨着发丝的描边（读数会含五官压到头发边线上的像素）
def main(root, clips, jp=None):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p); H, W = lib['canvas']['h'], lib['canvas']['w']; tr = lib['headTracks']
    rest = rgba(P(lib['poses'][lib['rest']]['frame'])); nose = lib['headTrackRefs']['nose']; R = lib['headTrackRefs']; sil = FM.rest_silhouette(rest, nose); pt = lib['poses'][lib['rest']]['patches']; images = {}
    def load(q):
        if q and q['file'] not in images: images[q['file']] = rgba(P(q['file'])).astype(np.float32)
        return q
    def alpha(q, M):
        full = np.zeros((H, W, 4), np.float32); x, y, w, h = q['rect']; full[y:y + h, x:x + w] = images[q['file']]; return cv2.warpAffine(full[..., 3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR) / 255
    dk = pt['ink']['default']
    faces = {'默认脸': ([load(dk.get('eyes')), load(dk.get('mouth'))], [load(dk.get('brow'))])}
    for n in ('angry', 'surprise'):
        f = pt['face'][n]; faces[n] = ([load(f.get('eyesInk') or f['eyes']), load(f.get('mouthInk') or f['mouth'])], [load(f.get('brow'))])
    out = {}
    for clip in clips:
        files = lib['clips'][clip]['frames']; res = {k: [] for k in faces}; lres = {k: [] for k in faces}; areas = []
        for f in files:
            fr = rgba(P(f)); M = Mof(tr[f]['m']); mk = tr[f]['maskInk']; hh = cv2.imread(P(mk['file']), cv2.IMREAD_UNCHANGED); rx, ry, rw, rh = mk['rect']
            bm = np.zeros((H, W), np.float32); tm = np.zeros((H, W), np.float32); bm[ry:ry + rh, rx:rx + rw] = hh[:, :rw, 3] / 255; tm[ry:ry + rh, rx:rx + rw] = hh[:, rw:, 3] / 255; areas.append(int((bm > 0.5).sum()))
            sil_w = cv2.warpAffine(sil.astype(np.uint8) * 255, np.float32(M), (W, H), flags=cv2.INTER_LINEAR) > 127; near = cv2.dilate(sil_w.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0
            pred = cv2.warpAffine(rest[..., :3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.int16); fr16 = fr[..., :3].astype(np.int16); d = np.full((H, W), 255, np.int16)
            for dy in (-2, -1, 0, 1, 2):
                for dx in (-2, -1, 0, 1, 2): d = np.minimum(d, np.abs(fr16 - np.roll(pred, (dy, dx), (0, 1))).max(2))
            b_, g_, r_ = [fr[..., i].astype(np.int16) for i in range(3)]; warm = (r_ - g_ > 25) & ((114 * b_ + 587 * g_ + 299 * r_) // 1000 > 90)      # 刘海和皮肤交界处偏暖的亮线：眉线本来就压着它，不算遮挡物
            occ = near & (fr[..., 3] > 200) & ~warm & ((d > 30) & ~FM.hair_px(fr) | (~FM.skin_px(fr) & ~FM.hair_px(fr)))
            if not STRICT: occ &= cv2.dilate(FM.hair_px(fr).astype(np.uint8), np.ones((5, 5), np.uint8)) == 0      # 挨着发丝（2px 内）的深色描边是头发自己的轮廓线，不是遮挡物；五官压到头发边上是允许的（用户 2026-10-10 定），不计
            # 脸自己的轮廓线、脸颊边的描边也满足 B（非肤色非发色）：它们在脸轮廓上、本来就不该有墨迹，保留；真正要看的是落进手 / 袖口里的
            for face, (bl, tl) in faces.items():
                ink = np.zeros((H, W), np.float32); exp = np.zeros((H, W), np.float32)
                for q in bl:
                    if q: aq = alpha(q, M); ink = np.maximum(ink, aq * bm); exp = np.maximum(exp, aq)
                for q in tl:
                    if q: aq = alpha(q, M); ink = np.maximum(ink, aq * tm); exp = np.maximum(exp, aq)
                lost = int(((exp > 0.5) & (ink < 0.1) & (cv2.dilate(occ.astype(np.uint8), np.ones((19, 19), np.uint8)) == 0) & (FM.skin_px(fr) | FM.hair_px(fr))).sum()); lres[face].append(lost)      # 多让开：本该画（离遮挡物 9px 以外、落在肤色 / 发色上）却被遮罩让开的墨迹像素
                leak = (ink > 0.1) & occ; res[face].append(int(leak.sum()))
                if VIZ and face == '默认脸' and leak.sum() > 0:          # --viz 目录：有落到遮挡物上的帧，存 4 倍的脸部放大（原帧压暗的五官墨迹 + 红色 = 落在遮挡物上的像素）
                    ys, xs = np.nonzero(leak); cx, cy = int(xs.mean()), int(ys.mean()); x0, y0 = max(0, cx - 60), max(0, cy - 45); comp = fr[..., :3].astype(np.float32).copy(); a_ = np.clip(ink, 0, 1)[..., None]
                    comp = comp * (1 - a_ * .5) + np.array([0, 160, 0], np.float32) * a_ * .5; comp[leak] = (0, 0, 255); crop = comp[y0:y0 + 90, x0:x0 + 120].astype(np.uint8); os.makedirs(VIZ, exist_ok=True)
                    cv2.imwrite(os.path.join(VIZ, f'{clip}_{len(res[face]) - 1:02d}.png'), cv2.resize(np.hstack([fr[y0:y0 + 90, x0:x0 + 120, :3], crop]), None, fx=4, fy=4, interpolation=cv2.INTER_NEAREST))
        out[clip] = {'ink_on_occluder_px': res, 'lost_px': lres, 'base_mask_area': areas}
        print(f"{clip}: " + '；'.join(f"{k} 合计 {sum(v)}px 最大单帧 {max(v)}px（第 {int(np.argmax(v))} 帧）" for k, v in res.items()) + f"；多让开 " + '、'.join(f'{k} 合计 {sum(v)}px 最大单帧 {max(v)}px' for k, v in lres.items()) + f"；遮罩面积 {min(areas)}–{max(areas)}px，相邻帧最大变化 {int(np.abs(np.diff(areas)).max())}px")
    if jp: json.dump(out, open(jp, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    a = sys.argv[1:]; jp = None
    if '--strict' in a: a.remove('--strict'); STRICT = True
    if '--viz' in a: i = a.index('--viz'); VIZ = a[i + 1]; a = a[:i] + a[i + 2:]
    if '--json' in a: i = a.index('--json'); jp = a[i + 1]; a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1:], jp)
