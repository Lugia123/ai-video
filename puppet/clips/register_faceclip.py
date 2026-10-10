#!/usr/bin/env python3
"""一段「带着整个头生成的表情动画」逐帧配准回头部母版，给 bake_patches.py --clip 用。

    python3 puppet/clips/register_faceclip.py puppet/characters/<角色> <视频.mp4> --name <名> [--label 说明]

每帧用五官以外的地方（帽子、头发、发卡）做 SIFT + RANSAC 相似变换对回母版（同 register_faces.py），存成母版坐标的图。
产物：<角色>/clips-work/faceclip/<名>/reg/NN.png + frames.json（fps、每帧的缩放 / 旋转 / 平移 / 内点 / 残差，以及头在画面里晃了多少）。"""
import json, os, subprocess, sys
import cv2, numpy as np


def main():
    a = sys.argv[1:]; char, video = a[0].rstrip('/'), a[1]; name = a[a.index('--name') + 1]; label = a[a.index('--label') + 1] if '--label' in a else name
    P = lambda *p: os.path.join(char, *p)
    face = json.load(open(P('source', 'face', 'face.json'), encoding='utf-8')); org = face['head_org']; parts = {p['id']: p for p in face['parts']}
    master = cv2.imread(P('source', 'master', 'head_master.png')); H, W = master.shape[:2]
    ids = [i for i in parts if i.startswith(('eye', 'iris', 'lash', 'brow', 'mouth', 'blush', 'nose'))]; r = [parts[i]['rect'] for i in ids]
    fx0, fy0 = int(min(q[0] for q in r) - org[0] - 40), int(min(q[1] for q in r) - org[1] - 40); fx1, fy1 = int(max(q[0] + q[2] for q in r) - org[0] + 40), int(max(q[1] + q[3] for q in r) - org[1] + 40)
    mask = np.full((H, W), 255, np.uint8); mask[fy0:fy1, fx0:fx1] = 0
    sift = cv2.SIFT_create(6000); k1, d1 = sift.detectAndCompute(cv2.cvtColor(master, cv2.COLOR_BGR2GRAY), mask)
    w, h, fr_ = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', video], capture_output=True, text=True).stdout.strip().split(',')[:3]
    w, h = int(w), int(h); fps = eval(fr_)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3); out = P('clips-work', 'faceclip', name, 'reg'); os.makedirs(out, exist_ok=True)
    rows = []
    for i, f in enumerate(frames):
        k2, d2 = sift.detectAndCompute(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), None)
        fwd = {m.queryIdx: m for m, n2 in cv2.BFMatcher().knnMatch(d2, d1, k=2) if m.distance < 0.75 * n2.distance}
        back = {m.queryIdx: m.trainIdx for m, n2 in cv2.BFMatcher().knnMatch(d1, d2, k=2) if m.distance < 0.8 * n2.distance}
        good = [m for q, m in fwd.items() if back.get(m.trainIdx) == q]
        src = np.float32([k2[g.queryIdx].pt for g in good]); dst = np.float32([k1[g.trainIdx].pt for g in good])
        M, inl = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=2.0, maxIters=5000, confidence=0.999)
        res = np.linalg.norm(src @ M[:, :2].T + M[:, 2] - dst, axis=1)[inl.ravel() == 1]
        cv2.imwrite(f'{out}/{i:02d}.png', cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE))
        c = np.linalg.solve(M[:, :2], np.array([W / 2, H / 2]) - M[:, 2])               # 母版中心在这一帧里的位置（视频像素）
        rows.append({'frame': i, 'scale': round(float(np.hypot(M[0, 0], M[1, 0])), 4), 'rotate_deg': round(float(np.degrees(np.arctan2(M[1, 0], M[0, 0]))), 3),
                     'head_center_px': [round(float(c[0]), 2), round(float(c[1]), 2)], 'inliers': int(inl.sum()), 'residual_px': round(float(res.mean()), 2)})
    c0 = np.array(rows[0]['head_center_px']); s0 = rows[0]['scale']
    for q in rows: q['shift_px'] = [round(float(v), 2) for v in (np.array(q['head_center_px']) - c0)]; q['scale_rel'] = round(s0 / q['scale'], 4)
    json.dump({'name': name, 'label': label, 'fps': fps, 'video': os.path.relpath(video, char), 'video_size': [w, h], 'frames': rows}, open(P('clips-work', 'faceclip', name, 'frames.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sh = np.array([q['shift_px'] for q in rows]); print(f'{name}: {len(rows)} 帧 @{fps}fps；头在视频里相对第 0 帧的位移 最大 {np.abs(sh).max(0)}px（视频像素 {w}×{h}），头的相对缩放 {min(q["scale_rel"] for q in rows)}–{max(q["scale_rel"] for q in rows)}，'
          f'旋转 {min(q["rotate_deg"] for q in rows)}°–{max(q["rotate_deg"] for q in rows)}°，配准残差 均值 {np.mean([q["residual_px"] for q in rows]):.2f}px 最大 {max(q["residual_px"] for q in rows)}px，内点最少 {min(q["inliers"] for q in rows)}')


if __name__ == '__main__':
    main()
