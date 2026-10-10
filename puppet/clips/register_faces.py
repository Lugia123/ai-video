#!/usr/bin/env python3
"""把改图模型出的「只改了表情的头」配准回头部母版，存成表情脸的来源图。

    python3 puppet/clips/register_faces.py puppet/characters/<角色> <改图结果目录> --pick squeeze=1,flat=2,…

改图模型每次都会把整张图重画，并且平移、缩放一点（实测 0.88–1.06 倍、最多 200px）。所以先用五官以外的地方
（帽子、头发、发卡）做 SIFT + RANSAC 相似变换对回母版，再存。五官区域不参与配准——那里本来就被改了。
<改图结果目录> 里的文件名：<表情名>-s<种子>.png。--pick 说每个表情用哪个种子；不给 --pick 就全部配准一遍只出读数和核对图，
不写来源图（用来挑）。
产物：characters/<角色>/faces/<表情名>.png（母版坐标，和母版同尺寸）+ faces.json（每张的来源、配准读数、
和母版比的线条 / 瞳色 / 肤色读数）。贴片由 bake_patches.py 从这里烘。"""
import json, os, sys
import cv2, numpy as np


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; pick = None
    if '--pick' in sys.argv: pick = dict(kv.split('=') for kv in sys.argv[sys.argv.index('--pick') + 1].split(',')); args = [a for a in args if '=' not in a]
    if len(args) != 2: raise SystemExit(__doc__)
    char, raw = args[0].rstrip('/'), args[1].rstrip('/')
    P = lambda *p: os.path.join(char, *p)
    face = json.load(open(P('source', 'face', 'face.json'), encoding='utf-8')); org = face['head_org']; parts = {p['id']: p for p in face['parts']}
    master = cv2.imread(P('source', 'master', 'head_master.png')); H, W = master.shape[:2]
    def rect(ids, pad):                      # 这些部件的外接矩形（母版像素）
        r = [parts[i]['rect'] for i in ids]; x0 = min(a[0] for a in r) - org[0] - pad; y0 = min(a[1] for a in r) - org[1] - pad
        x1 = max(a[0] + a[2] for a in r) - org[0] + pad; y1 = max(a[1] + a[3] for a in r) - org[1] + pad
        return [int(max(0, x0)), int(max(0, y0)), int(min(W, x1)), int(min(H, y1))]
    feat_ids = [i for i in parts if i.startswith(('eye', 'iris', 'lash', 'brow', 'mouth', 'blush', 'nose'))]
    fx0, fy0, fx1, fy1 = rect(feat_ids, 40)
    mask = np.full((H, W), 255, np.uint8); mask[fy0:fy1, fx0:fx1] = 0          # 五官区域不参与配准
    sift = cv2.SIFT_create(6000); gm = cv2.cvtColor(master, cv2.COLOR_BGR2GRAY); k1, d1 = sift.detectAndCompute(gm, mask)
    eye_box = rect([i for i in parts if i.startswith(('eyeWhite', 'iris'))], 0); skin_box = rect(['nose'], 30)
    def stats(img):                          # 和母版比用的几个数：描边有多黑、瞳色、肤色
        e = img[eye_box[1]:eye_box[3], eye_box[0]:eye_box[2]].reshape(-1, 3).astype(np.float32); lum = e @ np.array([.114, .587, .299], np.float32)
        dark = float(np.percentile(lum, 3)); hsv = cv2.cvtColor(img[eye_box[1]:eye_box[3], eye_box[0]:eye_box[2]], cv2.COLOR_BGR2HSV).reshape(-1, 3)
        teal = hsv[(hsv[:, 1] > 110) & (hsv[:, 2] > 90) & (hsv[:, 0] > 75) & (hsv[:, 0] < 105)]
        s = img[skin_box[1]:skin_box[3], skin_box[0]:skin_box[2]].reshape(-1, 3)
        return {'line_dark_p3': round(dark, 1), 'iris_teal_px': int(len(teal)), 'iris_hue_median': float(np.median(teal[:, 0])) if len(teal) else None, 'skin_bgr_median': [int(v) for v in np.median(s, 0)]}
    out = {'master': 'source/master/head_master.png', 'master_stats': stats(master), 'faces': {}}
    os.makedirs(P('faces'), exist_ok=True); tiles = []
    for f in sorted(os.listdir(raw)):
        if not f.endswith('.png') or f.startswith('_'): continue
        name, seed = f[:-4].rsplit('-s', 1)
        img = cv2.imread(os.path.join(raw, f))
        if img.shape[:2] != (H, W): img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)
        k2, d2 = sift.detectAndCompute(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), None)
        fwd = {m.queryIdx: m for m, n2 in cv2.BFMatcher().knnMatch(d2, d1, k=2) if m.distance < 0.75 * n2.distance}
        back = {m.queryIdx: m.trainIdx for m, n2 in cv2.BFMatcher().knnMatch(d1, d2, k=2) if m.distance < 0.8 * n2.distance}
        good = [m for q, m in fwd.items() if back.get(m.trainIdx) == q]            # 两个方向都认的才算（一堆点对到母版同一个点会把变换压成一个点）
        src = np.float32([k2[g.queryIdx].pt for g in good]); dst = np.float32([k1[g.trainIdx].pt for g in good])
        M, inl = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=2.0, maxIters=5000, confidence=0.999)
        sc = float(np.hypot(M[0, 0], M[1, 0])) if M is not None else 0
        if not 0.8 < sc < 1.25: print(f'{name}-s{seed}: 配准失败（缩放 {sc:.3f}，匹配 {len(good)}）'); continue
        res = np.linalg.norm(src @ M[:, :2].T + M[:, 2] - dst, axis=1)[inl.ravel() == 1]
        reg = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
        outside = np.abs(reg.astype(np.int16) - master.astype(np.int16)).max(2)[mask > 0]
        read = {'source': f, 'seed': int(seed), 'scale': round(float(np.hypot(M[0, 0], M[1, 0])), 4), 'translate': [round(float(M[0, 2]), 1), round(float(M[1, 2]), 1)],
                'inliers': int(inl.sum()), 'residual_px': round(float(res.mean()), 2), 'diff_outside_face_mean': round(float(outside.mean()), 1), **stats(reg)}
        print(f'{name}-s{seed}: 缩放 {read["scale"]} 平移 {read["translate"]} 内点 {read["inliers"]} 残差 {read["residual_px"]}px  五官外和母版平均差 {read["diff_outside_face_mean"]}  描边暗度 {read["line_dark_p3"]}（母版 {out["master_stats"]["line_dark_p3"]}）  瞳色像素 {read["iris_teal_px"]}')
        t = cv2.resize(reg[fy0 - 120:fy1 + 60, fx0 - 60:fx1 + 60], None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA); cv2.putText(t, f'{name}-s{seed}', (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 80, 230), 2, cv2.LINE_AA); tiles.append(t)
        if pick and pick.get(name) == seed:
            cv2.imwrite(P('faces', name + '.png'), reg); out['faces'][name] = read
    if tiles:                                # 核对图：全部候选配准后的脸
        m0 = cv2.resize(master[fy0 - 120:fy1 + 60, fx0 - 60:fx1 + 60], None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA); cv2.putText(m0, 'master', (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 80, 230), 2, cv2.LINE_AA)
        tiles = [m0] + tiles; cols = 6; h, w = tiles[0].shape[:2]; rows = (len(tiles) + cols - 1) // cols
        sheet = np.full((rows * h, cols * w, 3), 255, np.uint8)
        for i, t in enumerate(tiles): sheet[(i // cols) * h:(i // cols) * h + t.shape[0], (i % cols) * w:(i % cols) * w + t.shape[1]] = t
        cv2.imwrite(os.path.join(raw, '_registered-sheet.png'), sheet); print('核对图：', os.path.join(raw, '_registered-sheet.png'))
    if pick:
        json.dump(out, open(P('faces', 'faces.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print('写了', P('faces'), list(out['faces']))


if __name__ == '__main__':
    main()
