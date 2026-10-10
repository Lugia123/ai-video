#!/usr/bin/env python3
"""贴上去的五官相对「这一帧脸本身」的逐帧抖动（#1274 补的读数；track_rel_jitter.py 的固定点是帽子 / 发卡，帽子相对脸本身不刚，会把帽子对脸的错动算成五官抖动）。

    python3 puppet/clips/track_rel_jitter_face.py <库目录> <片段名>… [--clips-json 另一份 clips.json]

脸上的固定点 = 归位帧脸轮廓（含鼻点的肤色连通区域，填洞）上的 4 个点：下巴最低点、左脸颊最外点、右脸颊最外点（取嘴的高度）、刘海下缘（脸轮廓上缘在鼻点正上方的点）。
每个点在每一帧里用模板匹配（亚像素；模板按这一帧头部变换的旋转 / 缩放先转正）找真实位置，得分 < 0.85（手盖住等）的帧不用，沿时间插值补；
贴上去的眼角 / 嘴角 = 左眼外眼角、右眼外眼角、嘴角的参照点按这一帧 headTrack 变换搬过来的位置。
对每个（脸点, 五官点）对，取位置差的逐帧曲线，报高频残差 RMS（减 Savitzky–Golay(9,2) 平滑后的模长）和二阶差 RMS。
同时报每个脸点的找到率。脸点在 B 自己的帧上找（B 才是被贴脸的那张脸）。"""
import json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import track_jitter as TJ, face_mask as FM
import track_rel_jitter as TR
from track_rel_jitter import track_point


def face_points(rest, nose, mouth_y):
    sil = FM.rest_silhouette(rest, nose); ys, xs = np.nonzero(sil)
    chin = np.array([xs[ys == ys.max()].mean(), ys.max()], np.float64)
    row = np.nonzero(sil[int(round(mouth_y))])[0]; left = np.array([row.min(), mouth_y]); right = np.array([row.max(), mouth_y])
    col = np.nonzero(sil[:, int(round(nose[0]))])[0]; bang = np.array([nose[0], col.min()], np.float64)
    return {'下巴': chin, '左颊': left, '右颊': right, '刘海下缘': bang}


def FOFF(tr, k): return np.array(tr['feat'][k], np.float64) if TR.PERFEAT and tr.get('feat') else np.zeros(2)


def main(root, clips, cj=None):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8')); trs = json.load(open(cj, encoding='utf-8'))['headTracks'] if cj else lib['headTracks']
    rest = cv2.imread(os.path.join(root, lib['poses'][lib['rest']]['frame']), cv2.IMREAD_UNCHANGED); g0 = TJ.gray(rest).astype(np.float32); R = lib['headTrackRefs']
    fp = face_points(rest, np.array(R['nose']), R['mouth'][1]); allhf, alld2 = [], []
    for clip in clips:
        files = lib['clips'][clip]['frames']; series = {(k, f): [] for k in fp for f in ('eyeL', 'eyeR', 'mouth')}; found = {k: 0 for k in fp}
        for f in files:
            M = TJ.Mof(trs[f]['m']); g1 = TJ.gray(cv2.imread(os.path.join(root, f), cv2.IMREAD_UNCHANGED)).astype(np.float32)
            for k, p in fp.items():
                t = track_point(g0, g1, p, M, half=14, search=12); found[k] += t is not None
                for ft in ('eyeL', 'eyeR', 'mouth'): series[(k, ft)].append((TJ.mapp(M, R[ft]) + FOFF(trs[f], ft) - t) if t is not None else None)
        hfs, d2s, per = [], [], {}
        for key, s in series.items():
            ok = [j for j, v in enumerate(s) if v is not None]
            if len(ok) < 30: continue
            a = np.array([s[j] for j in ok]); xs = np.arange(len(s)); a = np.stack([np.interp(xs, ok, a[:, c]) for c in range(2)], 1); h, d = TJ.hf(a), TJ.d2(a); hfs.append(h); d2s.append(d); per.setdefault(key[0], []).append(h)
        n = len(files)
        print(f'{clip}: 脸点找到率 ' + ' '.join(f'{k}{found[k]}/{n}' for k in fp) + f'；五官相对脸：高频残差 RMS 平均 {np.mean(hfs):.2f}px（最大 {np.max(hfs):.2f}），二阶差 RMS 平均 {np.mean(d2s):.2f}px；按脸点 ' + ' '.join(f'{k}{np.mean(v):.2f}' for k, v in per.items())); allhf += hfs; alld2 += d2s
    print(f'合计平均：高频残差 {np.mean(allhf):.2f}px，二阶差 {np.mean(alld2):.2f}px')


if __name__ == '__main__':
    a = sys.argv[1:]; cj = None
    if '--perfeat' in a: a.remove('--perfeat'); TR.PERFEAT = True
    if '--clips-json' in a: i = a.index('--clips-json'); cj = a[i + 1]; a = a[:i] + a[i + 2:]
    main(a[0].rstrip('/'), a[1:], cj)
