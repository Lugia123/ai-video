#!/usr/bin/env python3
"""面部遮罩的合成测试（空脸片段）：把遮挡物按已知位置贴到干净的空脸帧上，量「五官画到遮挡物上」的像素（硬指标，目标 0）和「五官被误让开」的像素（可以有，报多少）。

    python3 puppet/clips/face_mask_test.py <空脸库> --clean <干净片段名> --hand <挥手片段名>:<帧号> --fist <思考片段名>:<帧号> [--json 读数.json] [--out 图.png]

遮挡物从库里现成的帧上抠（不认「手」这个特例，凡是「脸前多出来的东西」都一样处理）：张开的手（挥手那一帧里头旁边的手）、握拳（思考那一帧的拳头）、白袖子、袖口、一缕头发、
  以及两种放大的：整只手盖住一只眼（手放大到能盖住眼眶）、手盖住嘴。
情形（5 种）：盖左眼、盖右眼、盖嘴、盖脸颊、从脸的边缘探进来一半；另加「快速划过」连续 5 帧。每种 × 每个遮挡物，贴在 --clean 片段的几帧上。
五官 = 默认脸 + angry 表情脸（带眉，含腮红），按遮罩画（用的就是播放器的画法：base 层按 base 遮罩、眉按 top 遮罩）。
读数：
  画到遮挡物上（硬指标）：五官墨迹的透明度 > 0.1 且落在遮挡物像素里的像素数
  误让开：本来该画（落在干净肤色里、离遮挡物 9px 以外）却被遮罩让开的墨迹像素数
合成图是把遮挡物直接叠在帧上，没有真实片段里的接触阴影和形变；它测的是判定逻辑。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import face_mask as FM


def rgba(p): return cv2.imread(p, cv2.IMREAD_UNCHANGED)
def Mof(m): a, b, tx, ty = m; return np.array([[a, -b, tx], [b, a, ty]], np.float64)
def paste(fr, c, cx, cy):
    out = fr.astype(np.float32).copy(); H, W = fr.shape[:2]; h, w = c.shape[:2]; x, y = int(round(cx - w / 2)), int(round(cy - h / 2)); G = np.zeros((H, W), bool)
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0: return out, G
    s = c[y0 - y:y1 - y, x0 - x:x1 - x].astype(np.float32); a = s[..., 3:] / 255
    out[y0:y1, x0:x1, :3] = s[..., :3] * a + out[y0:y1, x0:x1, :3] * (1 - a); out[y0:y1, x0:x1, 3] = np.maximum(out[y0:y1, x0:x1, 3], s[..., 3]); G[y0:y1, x0:x1] = s[..., 3] > 128
    return out, G


def layer_alpha(q, M, W, H, images):
    """一块贴片按 M 搬到帧坐标的 RGBA 透明度图（0–1）。"""
    im = images[q['file']]; full = np.zeros((H, W, 4), np.float32); x, y, w, h = q['rect']; full[y:y + h, x:x + w] = im
    return cv2.warpAffine(full[..., 3], np.float32(M), (W, H), flags=cv2.INTER_LINEAR) / 255


def main():
    a = sys.argv[1:]; root = a[0].rstrip('/'); opt = {a[i]: a[i + 1] for i in range(1, len(a) - 1, 2)}      # 可选 --hand-png <帧.png>:x0,y0,x1,y1
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); P = lambda *p: os.path.join(root, *p); tr = lib['headTracks']; H, W = lib['canvas']['h'], lib['canvas']['w']
    rest = rgba(P(lib['poses'][lib['rest']]['frame'])); R = lib['headTrackRefs']; nose = R['nose']; sil = FM.rest_silhouette(rest, nose); tone = FM.face_tone_limit(rest, sil); pt = lib['poses'][lib['rest']]['patches']
    images = {}
    EY = lambda M_: float(np.mean([(M_[:, :2] @ np.asarray(R[k], np.float64) + M_[:, 2])[1] for k in ('eyeL', 'eyeR')])) - 10
    def load(q):
        if q and q['file'] not in images: images[q['file']] = rgba(P(q['file'])).astype(np.float32)
        return q
    dk = pt['ink']['default']; ang = pt['face']['angry']
    faces = {'默认脸': ([load(dk.get('eyes')), load(dk.get('mouth'))], [load(dk.get('brow'))]), 'angry': ([load(ang.get('eyesInk') or ang['eyes']), load(ang.get('mouthInk') or ang['mouth'])], [load(ang.get('brow'))])}
    cf = lib['clips'][opt['--clean']]['frames']; idx = [int(len(cf) * k) for k in (0.08, 0.3, 0.55, 0.8)]
    base = {i: (rgba(P(cf[i])), Mof(tr[cf[i]]['m'])) for i in set(idx + list(range(idx[1], idx[1] + 5)))}
    hc, hi = opt['--hand'].split(':'); hf = rgba(P(lib['clips'][hc]['frames'][int(hi)])); fc, fi = opt['--fist'].split(':'); ff = rgba(P(lib['clips'][fc]['frames'][int(fi)]))
    def cutbox(fr, M, x0, y0, x1, y1, drop_face=True):       # 框里「不是头发、不是脸的肤色区域」的东西（手、袖口、袖子、拳头）
        b, t, o, ot = FM.one(fr, M, sil, nose, tone, rest, EY(M)); keep = np.zeros((H, W), bool); keep[y0:y1, x0:x1] = True; m = keep & (fr[..., 3] > 128) & ~FM.hair_px(fr) & ~b
        ys, xs = np.where(m); c = fr[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy(); c[..., 3] = c[..., 3] * m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; return c
    cuts = {}
    Mh = Mof(tr[lib['clips'][hc]['frames'][int(hi)]]['m']); p = Mh[:, :2] @ np.array(nose) + Mh[:, 2]
    cuts['张开的手'] = cutbox(hf, Mh, int(p[0]) + 70, int(p[1]) - 230, int(p[0]) + 260, int(p[1]) - 30)
    Mf = Mof(tr[lib['clips'][fc]['frames'][int(fi)]]['m']); pf = Mf[:, :2] @ np.array(nose) + Mf[:, 2]
    cuts['握拳'] = cutbox(ff, Mf, int(pf[0]) - 110, int(pf[1]) + 90, int(pf[0]) + 60, int(pf[1]) + 330)
    h0 = cuts['张开的手']; cuts['手放大（盖住眼）'] = cv2.resize(h0, None, fx=1.7, fy=1.7, interpolation=cv2.INTER_LINEAR)
    if '--hand-png' in opt:                  # 带闭合描边的手：从 --hand-png 帧里（手完全在底色上的帧）的肤色连通块 + 外扩 4px 带描边的一圈抠出；框 x0,y0,x1,y1 里取最大的一块肤色
        from scipy import ndimage as _ndi
        fpng, box = opt['--hand-png'].rsplit(':', 1); bx0, by0, bx1, by1 = map(int, box.split(',')); hf2 = rgba(fpng); sk = FM.skin_px(hf2); bb = np.zeros(sk.shape, bool); bb[by0:by1, bx0:bx1] = True
        lab_, n_ = _ndi.label(sk & bb); sz_ = np.bincount(lab_.ravel()); mh = lab_ == 1 + int(np.argmax(sz_[1:])); ring = (cv2.dilate(mh.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0) & (hf2[..., 3] > 128)
        ys, xs = np.where(ring); ch = hf2[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy(); ch[..., 3] = ch[..., 3] * ring[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        cuts['手（带描边）'] = ch; cuts['手（带描边）放大'] = cv2.resize(ch, None, fx=1.7, fy=1.7, interpolation=cv2.INTER_LINEAR)
    cuts = {k: v for k, v in cuts.items() if v.size and (v[..., 3] > 128).sum() > 400}
    wh = np.zeros((90, 170, 4), np.uint8); wh[..., :3] = 245; wh[..., 3] = 255; cv2.rectangle(wh, (0, 0), (169, 89), (60, 40, 30, 255), 4); cuts['白袖子'] = wh
    cuff = np.zeros((50, 140, 4), np.uint8); cuff[..., :3] = (70, 40, 25); cuff[..., 3] = 255; cuts['袖口'] = cuff
    strand = np.zeros((130, 36, 4), np.uint8); strand[..., :3] = (200, 235, 160); strand[..., 3] = 255; cv2.rectangle(strand, (0, 0), (35, 129), (110, 150, 40, 255), 3); cuts['一缕头发（发色）'] = strand
    eyeL, eyeR, mouth = np.array(R['eyeL']), np.array(R['eyeR']), np.array(R['mouth']); cheek = np.array([eyeR[0] - 30, (eyeR[1] + mouth[1]) / 2 + 6]); edge = np.array([eyeR[0] + 95, eyeR[1] + 30])
    cases = {'盖左眼': eyeL + [10, 0], '盖右眼': eyeR - [10, 0], '盖嘴': mouth, '盖脸颊': cheek, '从边缘探进来': edge}
    rows = []; shots = []
    def measure(fr2, G, M2, face, fname):
        b, t, o, ot = FM.one(fr2, M2, sil, nose, tone, rest, EY(M2)); base_l, top_l = faces[face]; sb = None
        inkc = np.zeros((H, W), np.float32); expect = np.zeros((H, W), np.float32)
        od = cv2.dilate(o.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (FM.GUARD, FM.GUARD))) == 0; bm = cv2.GaussianBlur((b & od).astype(np.float32), (0, 0), 0.7) * od; odt = cv2.dilate(ot.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))) == 0; tm = cv2.GaussianBlur((t & odt).astype(np.float32), (0, 0), 0.7) * odt        # 同 face_mask.series 的后处理
        for q in base_l:
            if q: la = layer_alpha(q, M2, W, H, images); inkc = np.maximum(inkc, la * bm); expect = np.maximum(expect, la)
        for q in top_l:
            if q: la = layer_alpha(q, M2, W, H, images); inkc = np.maximum(inkc, la * tm); expect = np.maximum(expect, la)
        on = int(((inkc > 0.1) & G).sum()); far = cv2.dilate(G.astype(np.uint8), np.ones((19, 19), np.uint8)) == 0
        cleanskin = FM.skin_px(base_fr[0]) | FM.hair_px(base_fr[0]); lost = int(((expect > 0.5) & (inkc < 0.1) & far & cleanskin).sum())
        return on, lost, inkc
    for cname, c in cuts.items():
        for case, pos in cases.items():
            for face in faces:
                acc = [0, 0, 0]
                for i in idx:
                    base_fr = base[i]; fr, M0 = base_fr; pp = M0[:, :2] @ pos + M0[:, 2]; fr2, G = paste(fr, c, pp[0], pp[1])
                    on, lost, inkc = measure(fr2, G, M0, face, None); acc = [acc[0] + on, acc[1] + lost, acc[2] + int(G.sum())]
                    if i == idx[1] and face == 'angry': shots.append((cname, case, fr2, M0, inkc, G))
                rows.append({'occluder': cname, 'case': case, 'face': face, 'ink_on_occluder_px': acc[0], 'lost_px': acc[1], 'occluder_px': acc[2]})
        seq = list(range(idx[1], idx[1] + 5))
        for face in faces:
            acc = [0, 0, 0]
            for k, i in enumerate(seq):
                base_fr = base[i]; fr, M0 = base_fr; pos = eyeL + (eyeR - eyeL) * (k / 4) + [0, 10]; pp = M0[:, :2] @ pos + M0[:, 2]; fr2, G = paste(fr, c, pp[0], pp[1])
                on, lost, inkc = measure(fr2, G, M0, face, None); acc = [acc[0] + on, acc[1] + lost, acc[2] + int(G.sum())]
            rows.append({'occluder': cname, 'case': '快速划过（5 帧）', 'face': face, 'ink_on_occluder_px': acc[0], 'lost_px': acc[1], 'occluder_px': acc[2]})
    print('遮挡物｜情形｜五官｜遮挡物 px｜五官画到遮挡物上 px（硬指标，目标 0）｜被误让开 px')
    for r in rows: print(f"{r['occluder']}｜{r['case']}｜{r['face']}｜{r['occluder_px']}｜{r['ink_on_occluder_px']}｜{r['lost_px']}")
    print(f"合计 {len(rows)} 组：五官画到遮挡物上 {sum(r['ink_on_occluder_px'] for r in rows)}px，最大单组 {max(r['ink_on_occluder_px'] for r in rows)}px；被误让开 {sum(r['lost_px'] for r in rows)}px")
    if '--json' in opt: json.dump(rows, open(opt['--json'], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if '--out' in opt:
        tiles = []
        for cname, case, fr2, M0, inkc, G in shots:
            c0 = (M0[:, :2] @ np.array(nose) + M0[:, 2]).astype(int); x0, y0 = c0[0] - 130, c0[1] - 110
            comp = fr2[..., :3].copy(); al = np.clip(inkc, 0, 1)[..., None]; ink = np.zeros_like(comp); ink[...] = (40, 30, 120)
            comp = comp * (1 - al * 0.8) + ink * al * 0.8; comp[G] = comp[G] * 0.7 + np.array([0, 0, 255]) * 0.3
            t = comp[y0:y0 + 220, x0:x0 + 260].astype(np.uint8); tiles.append((f'{cname}/{case}', cv2.resize(t, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST)))
        cols = 5; th, tw = tiles[0][1].shape[:2]; sheet = np.full((((len(tiles) + cols - 1) // cols) * (th + 4), cols * (tw + 4), 3), 255, np.uint8)
        for n, (lab, t) in enumerate(tiles): y, x = (n // cols) * (th + 4), (n % cols) * (tw + 4); sheet[y:y + th, x:x + tw] = t
        cv2.imwrite(opt['--out'], sheet); print('图：', opt['--out'], sheet.shape)


if __name__ == '__main__':
    main()
