#!/usr/bin/env python3
"""给片段库的静止帧（归位帧、各动作保持帧）烘口型贴片和眨眼贴片。只用角色已有的分层素材，不生成任何新图。

    python3 puppet/clips/bake_patches.py puppet/characters/<角色> [--lib clips-draft2] [--poses think,shrug] [--clip <脸部动画名>] [--align-from <库目录名>] [--orig-frame <原归位帧.png>]
    （--lib：角色目录下的哪个片段库，默认 clips；--poses：只重烘这几张静帧，归位帧总会一起对位。静帧按 poses.<名>.frame 读，可以指进片段的某一帧。
      写回 clips.json 时重新读盘、只动 poses.<名>.patches 和库级的 mouthShapes / talk / blink。对不上位的静帧跳过并打印原因。）
    （之后再跑一遍 clips/sync.py 更新 clips.js）

做法：
1. 对位：头部母版（source/master/head_master.png）和静止帧做 SIFT + RANSAC 相似变换，只用脸区的特征点。
2. 在母版坐标里拼一张「没有五官的头」：干净脸底 face.png + 排在脸前面的头发片。
   · 口型贴片 = 这张头在嘴附近的一小块（盖掉帧里画死的嘴）+ 一个口型素材；
   · 眨眼贴片 = 这张头在两只眼睛附近的一小块（盖掉睁着的眼）+ 闭眼线 lidL / lidR；
   · 干净脸贴片 = 眼、眉、嘴一起盖掉，什么都不画（换整套五官时垫在下面）；
   · 表情脸贴片（有 <角色>/faces/ 才烘）= 同画风的整套表情五官，拆成四块：poses.<名>.patches.face.<表情>.{eyes,mouth,brow,blush}——
     眼（只盖原画眼睛的范围 + 约 8px；在刘海下面）、腮红（只在比原画更红时才有；正片叠底）、嘴（按这张表情自己嘴的实际范围切；说话时不贴）、眉（画在刘海上层，可不贴）。
3. 变换到帧坐标，按贴片外面一圈的肤色把贴片的颜色对到帧上（逐通道加一个常数），边缘羽化。
4. 动作保持帧里挡在脸前面的东西（比如抵着下巴的手）：拿它和归位帧比，差得多的地方算遮挡，贴片在那里挖掉。
产物：clips/patches/<姿势>/*.png（很小的透明图）+ 写回 clips.json 的 poses.<姿势>.patches（文件、在画布上的位置、对位读数）。"""
import json, os, sys
import cv2
import numpy as np
from scipy import ndimage as ndi

FEATHER = 2.2        # 贴片边缘羽化（帧像素）
PAD = 6              # 遮盖范围比五官素材的轮廓往外多盖几个帧像素


def rgba(path):
    a = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if a is None: raise SystemExit('读不到 ' + path)
    if a.shape[2] == 3: a = np.dstack([a, np.full(a.shape[:2], 255, np.uint8)])
    return a.astype(np.float32)


def over(dst, src, x, y):          # 把 src（BGRA）叠到 dst 的 (x, y)，直通 alpha
    x, y = int(round(x)), int(round(y)); h, w = src.shape[:2]
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, dst.shape[1]), min(y + h, dst.shape[0])
    if x1 <= x0 or y1 <= y0: return
    s = src[y0 - y:y1 - y, x0 - x:x1 - x]; d = dst[y0:y1, x0:x1]; sa = s[..., 3:] / 255; da = d[..., 3:] / 255
    oa = sa + da * (1 - sa)
    d[..., :3] = np.where(oa > 0, (s[..., :3] * sa + d[..., :3] * da * (1 - sa)) / np.maximum(oa, 1e-6), 0); d[..., 3:] = oa * 255


def align(master_bgr, org, face_rect, frame):
    """母版（rig 坐标 = 母版像素 + org）→ 帧 的相似变换。返回 (2×3 矩阵, 读数)。"""
    sift = cv2.SIFT_create(4000)
    fx, fy, fw, fh = face_rect; mask = np.zeros(master_bgr.shape[:2], np.uint8)
    cv2.rectangle(mask, (int(fx - org[0] + fw * .13), int(fy - org[1] + fh * .37)), (int(fx - org[0] + fw * .87), int(fy - org[1] + fh * .955)), 255, -1)
    k1, d1 = sift.detectAndCompute(cv2.cvtColor(master_bgr, cv2.COLOR_BGR2GRAY), mask)
    al = frame[..., 3:] / 255; flat = (frame[..., :3] * al + 255 * (1 - al)).astype(np.uint8)
    k2, d2 = sift.detectAndCompute(cv2.cvtColor(flat, cv2.COLOR_BGR2GRAY), None)
    good = [a for a, b in cv2.BFMatcher().knnMatch(d1, d2, k=2) if a.distance < 0.75 * b.distance]
    src = np.float32([k1[g.queryIdx].pt for g in good]) + np.float32(org); dst = np.float32([k2[g.trainIdx].pt for g in good])
    M, inl = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=2.0)
    res = np.linalg.norm(src @ M[:, :2].T + M[:, 2] - dst, axis=1)[inl.ravel() == 1]
    return M, {'scale': round(float(np.hypot(M[0, 0], M[1, 0])), 4), 'rotate_deg': round(float(np.degrees(np.arctan2(M[1, 0], M[0, 0]))), 2),
               'translate': [round(float(M[0, 2]), 1), round(float(M[1, 2]), 1)], 'matches': len(good), 'inliers': int(inl.sum()), 'residual_px': round(float(res.mean()), 2)}


def to_frame(img, M, size):        # rig 坐标的图 → 帧坐标；缩小前先模糊一点防锯齿
    s = float(np.hypot(M[0, 0], M[1, 0])); sig = max(0.01, 0.5 / s - 0.5)
    pre = img.copy(); pre[..., :3] *= pre[..., 3:] / 255                    # 预乘再缩，边上不发黑发白
    pre = cv2.GaussianBlur(pre, (0, 0), sig) if sig > 0.3 else pre
    out = cv2.warpAffine(pre, M, size, flags=cv2.INTER_LINEAR)
    a = out[..., 3:]; out[..., :3] = np.where(a > 0.5, out[..., :3] / np.maximum(a, 1e-6) * 255, 0)
    return out


INK = False                 # --ink：空脸库的「面部遮罩」做法（2026-10-10）：贴片只有五官自己的墨迹，不带任何不透明的肤色底、发边、脸轮廓；见 clips/README.md
NOBROW_FRAME = None         # --nobrow-frame <无眉的原归位帧.png>：默认脸的眉从它和原归位帧的差里取
ORIG_FRAME = None           # --orig-frame <原归位帧.png>：空脸库取眉色用
ALIGN_FROM = None          # --align-from <库目录名>：归位帧的对位照这个库的（空脸库用）


def main(char, libname='clips', only=None, clip=None):
    P = lambda *p: os.path.join(char, *p)
    lib = json.load(open(P(libname, 'clips.json'), encoding='utf-8'))
    face = json.load(open(P('source', 'face', 'face.json'), encoding='utf-8')); eyes = json.load(open(P('source', 'face', 'eyes.json'), encoding='utf-8'))
    hair = json.load(open(P('source', 'hair', 'hair.json'), encoding='utf-8'))
    org = face['head_org']; parts = {p['id']: p for p in face['parts']}; parts.update({p['id']: p for p in eyes['parts']})   # eyes.json 的矩形更新，以它为准
    art = lambda pid: rgba(P('source', 'face', parts[pid]['src']))
    master = cv2.imread(P('source', 'master', 'head_master.png'))
    RW, RH = master.shape[1] + org[0] + 200, master.shape[0] + org[1] + 200

    def place(canvas, pid):        # 部件按 rect 放进 rig 画布（rect 的宽高和图不一样时缩放）
        x, y, w, h = parts[pid]['rect']; im = art(pid)
        if (round(w), round(h)) != (im.shape[1], im.shape[0]): im = cv2.resize(im, (max(1, round(w)), max(1, round(h))), interpolation=cv2.INTER_AREA)
        over(canvas, im, x, y)

    # 没有五官的头：脸底 + 脸前面的头发
    bare = np.zeros((RH, RW, 4), np.float32); place(bare, 'face')
    after, front = False, []
    for pc in sorted(hair['pieces'], key=lambda p: p['z']):
        if after and not pc.get('behind_face'): over(bare, rgba(P('source', 'hair', pc['file'])), pc['rect'][0] + org[0], pc['rect'][1] + org[1]); front.append(pc['name'])
        if pc['name'] == hair.get('face_layer_goes_after'): after = True
    hair_only = np.zeros((RH, RW, 4), np.float32)
    for pc in hair['pieces']:
        if pc['name'] in front: over(hair_only, rgba(P('source', 'hair', pc['file'])), pc['rect'][0] + org[0], pc['rect'][1] + org[1])

    def region(ids):               # 这些部件不透明处的并集（rig 画布上的 0/1）
        c = np.zeros((RH, RW, 4), np.float32)
        for i in ids: place(c, i)
        return (c[..., 3] > 20).astype(np.uint8)

    mouths = {k: 'mouth_' + k for k in lib.get('mouthShapes', ['closed', 'small', 'big', 'smile'])}
    eye_ids = [i for i in parts if i.startswith(('eyeWhite', 'iris', 'eyeHl', 'eyeLow', 'lash'))]
    size = (lib['canvas']['w'], lib['canvas']['h'])
    faces = {}
    if clip:                                   # 一段脸部动画：<角色>/clips-work/faceclip/<名>/reg/NN.png（配准回母版的逐帧图），只烘它，别的贴片不动
        cdir = P('clips-work', 'faceclip', clip, 'reg'); cmeta = json.load(open(P('clips-work', 'faceclip', clip, 'frames.json'), encoding='utf-8'))
        for f in sorted(x for x in os.listdir(cdir) if x.endswith('.png')): faces[f[:-4]] = cv2.imread(os.path.join(cdir, f)).astype(np.float32)
    elif os.path.exists(P('faces', 'faces.json')):
        for expr in json.load(open(P('faces', 'faces.json'), encoding='utf-8'))['faces']: faces[expr] = cv2.imread(P('faces', expr + '.png')).astype(np.float32)
    rest = rgba(P(libname, lib['poses'][lib['rest']]['frame'])); M_rest = None
    order = [lib['rest']] + [k for k in lib['poses'] if k != lib['rest']]
    skipped = {}
    for name in order:
        pose = lib['poses'][name]; frame = rgba(P(libname, pose['frame']))
        if only and name not in only and name != lib['rest']: continue
        try:
            if ALIGN_FROM and name == lib['rest']:           # 空脸归位帧：脸上没有五官，对不上特征点——直接沿用有脸版本的对位（两张图除了五官逐像素相同）
                al_ = json.load(open(P(ALIGN_FROM, 'clips.json'), encoding='utf-8'))['poses'][lib['rest']]['patches']['align']; r_ = np.radians(al_['rotate_deg'])
                M = np.array([[np.cos(r_), -np.sin(r_), al_['translate'][0] / al_['scale']], [np.sin(r_), np.cos(r_), al_['translate'][1] / al_['scale']]]) * al_['scale']; read = dict(al_, alignedFrom=ALIGN_FROM)
            else: M, read = align(master, org, parts['face']['rect'], frame)
        except Exception as e:                                                       # 对不上（脸被挡住、转过去了）：这张跳过，别的照烘
            skipped[name] = f'对位失败：{type(e).__name__}'; print(name, '跳过 ——', skipped[name]); continue
        if read['inliers'] < 20 or read['residual_px'] > 2.5:
            skipped[name] = f'对位不可靠（内点 {read["inliers"]}，残差 {read["residual_px"]}px）'; print(name, '跳过 ——', skipped[name]); continue
        if name == lib['rest']: M_rest = M
        s = read['scale']; kpad = int(round(PAD / s))
        bare_f, hair_f = to_frame(bare, M, size), to_frame(hair_only, M, size)[..., 3] / 255

        # 遮挡：这一帧和归位帧（按两边的对位搬过来）差得多的地方 = 挡在脸前面的东西
        occ = np.zeros(size[::-1], np.float32)
        if name != lib['rest']:
            A = np.vstack([M, [0, 0, 1]]) @ np.linalg.inv(np.vstack([M_rest, [0, 0, 1]]))
            rest_here = cv2.warpAffine(rest, A[:2], size, flags=cv2.INTER_LINEAR)
            d = np.abs(cv2.GaussianBlur(frame[..., :3], (0, 0), 1) - cv2.GaussianBlur(rest_here[..., :3], (0, 0), 1)).max(2)
            m = cv2.morphologyEx((d > 36).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
            m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
            n, lab, st, _ = cv2.connectedComponentsWithStats(m)
            for i in range(1, n):
                if st[i, cv2.CC_STAT_AREA] >= 400: occ[lab == i] = 1          # 只认成块的（手），零星的线条位置差不算
            # 表情变了不算遮挡：这张静帧自己张着嘴、闭着眼时，嘴和眼那里也和归位帧「差得多」，但那正是贴片要盖掉的东西。
            # 真的遮挡物（手）是从五官区域外面伸进来的大块；整块（几乎）都落在五官区域里面的，当成表情变化，不挖。
            feat_rig = region(eye_ids + [i for i in parts if i.startswith('brow')] + list(mouths.values())).astype(np.float32)
            feat = cv2.dilate((cv2.warpAffine(feat_rig, M, size, flags=cv2.INTER_LINEAR) > 0.5).astype(np.uint8), np.ones((13, 13), np.uint8)) > 0
            n2, lab2 = cv2.connectedComponents((occ > 0.5).astype(np.uint8))
            for i in range(1, n2):
                blob = lab2 == i; outside = int((blob & ~feat).sum())
                if outside < 150 and outside < 0.3 * int(blob.sum()): occ[blob] = 0
            occ = cv2.GaussianBlur(cv2.dilate(occ, np.ones((3, 3), np.uint8)), (0, 0), 0.8)

        def bake(cover_ids, draw_ids, fname, grow=kpad, ref=None):          # ref：量肤色差用的参考帧（空脸库的「默认脸」变体用原归位帧：默认脸的底是原画肤色，和空脸帧差几个色阶）
            cf = frame if ref is None else ref
            cov = cv2.dilate(region(cover_ids), np.ones((2 * grow + 1, 2 * grow + 1), np.uint8)).astype(np.float32) * 255
            cov = cv2.warpAffine(cov, M, size, flags=cv2.INTER_LINEAR) / 255
            hard = cov > 0.5
            ring = cv2.dilate(hard.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool) & ~hard
            ok = ring & (frame[..., 3] > 250) & (bare_f[..., 3] > 250) & (hair_f < 0.05) & (occ < 0.05)
            # 只拿「两边都是皮肤」的像素算色差：亮、偏暖
            sk = lambda im: (im[..., 2] > 200) & (im[..., 2] - im[..., 0] > 12)
            ok &= sk(cf) & sk(bare_f)
            shift = np.median(cf[ok][:, :3] - bare_f[ok][:, :3], axis=0) if ok.sum() >= 30 else np.zeros(3)
            fg = np.zeros((RH, RW, 4), np.float32)
            for i in draw_ids: place(fg, i)
            patch = bare_f.copy(); patch[..., :3] = np.clip(patch[..., :3] + shift * (1 - hair_f[..., None]), 0, 255)   # 头发不跟着肤色调
            comp = np.zeros_like(patch); over(comp, patch, 0, 0); over(comp, to_frame(fg, M, size), 0, 0)
            alpha = cv2.GaussianBlur(cov, (0, 0), FEATHER) * (comp[..., 3] / 255) * (1 - occ) * (frame[..., 3] / 255)
            ys, xs = np.where(alpha > 0.004)
            x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
            out = np.dstack([comp[y0:y1, x0:x1, :3], alpha[y0:y1, x0:x1] * 255]).round().astype(np.uint8)
            rel = f'patches/{name}/{fname}.png'; os.makedirs(os.path.dirname(P(libname, rel)), exist_ok=True)
            cv2.imwrite(P(libname, rel), out)
            return {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'color_shift_rgb': [round(float(v), 1) for v in shift[::-1]],
                    'skin_samples': int(ok.sum()), 'occluded_px': int((occ[y0:y1, x0:x1] > 0.5).sum())}

        cover_mouth = list(mouths.values())          # 盖的范围 = 所有口型的并集，这样换口型时遮盖块的边不动
        pose['patches'] = dict(pose.get('patches') or {}) if clip else {
            'align': read,
            'mouth': {k: bake(cover_mouth, [pid], pid) for k, pid in mouths.items()},
            'blink': bake(eye_ids, ['lidL', 'lidR'], 'blink'),
            # 擦掉眼、眉、嘴的干净脸：换整套五官（漫符的 > <、- - 之类）时先贴它，再往上叠
            'clean': bake(eye_ids + [i for i in parts if i.startswith('brow')] + cover_mouth, [], 'clean'),
        }
        if ORIG_FRAME is not None and name == lib['rest']:     # 空脸库：默认脸的底块是原画肤色，口型 / 眨眼贴片要对着原归位帧的肤色再烘一套，不然贴出一块偏白的方
            pose['patches']['dfltMouth'] = {k: bake(cover_mouth, [pid], pid + '_dflt', ref=ORIG_FRAME) for k, pid in mouths.items()}
            pose['patches']['dfltBlink'] = bake(eye_ids, ['lidL', 'lidR'], 'blink_dflt', ref=ORIG_FRAME)
        # 表情脸：<角色>/faces/ 里配准回母版的「只改了表情的头」（clips/register_faces.py 出的）。每张拆成两块——
        # 眼眉（含腮红）和嘴：说话时嘴那块不贴，让位给口型贴片。被刘海盖住的地方不取，帧里自己的刘海仍在最上面。
        if faces:
            # 脸的轮廓（脸底素材，往里收一点）：表情脸的各块、垫层、腮红都不许画到轮廓线外面
            fo = np.zeros((RH, RW, 4), np.float32); place(fo, 'face'); ff = (to_frame(fo, M, size)[..., 3] > 200).astype(np.uint8)
            ez_ = (cv2.warpAffine(cv2.dilate(region(eye_ids), np.ones((2 * int(round(8 / s)) + 1,) * 2, np.uint8)).astype(np.float32) * 255, M, size) > 127).astype(np.uint8)      # 眼眶范围里放出 2px（外眼角的睫毛尾画到脸的轮廓线上）
            face_in = cv2.GaussianBlur(np.maximum(cv2.erode(ff, np.ones((5, 5), np.uint8)), cv2.dilate(ff, np.ones((5, 5), np.uint8)) * ez_).astype(np.float32), (0, 0), 1.0)
            cov_m0 = cv2.dilate(region(cover_mouth), np.ones((2 * kpad + 1, 2 * kpad + 1), np.uint8))       # 嘴块：所有口型素材的并集外扩约 6 帧像素（盖住原帧的嘴），不再往脸颊铺
            # 占地收小（2026-10-08）：每块只占它真正要改的地方。眼块 = 原画眼睛各层的外接范围外扩约 8 帧像素（把上睫毛弧、外眼角翘尖、下眼线都包进去，
            # 片段里眼睛逐帧略大略小、对位差一两个像素也盖得严）；眉、嘴各自成块；腮红单独一块用正片叠底叠（只加红、不带不透明的肤色）。
            # 块与块之间的脸颊、下巴不铺任何像素——占地越小，和挡在脸前的手、袖子相交的机会越少。
            ek = 2 * int(round(8 / s)) + 1; cov_eb = cv2.dilate(region(eye_ids), np.ones((ek, ek), np.uint8))
            blush_zone = cv2.dilate(region([i for i in parts if i.startswith('blush')]), np.ones((2 * kpad + 1, 2 * kpad + 1), np.uint8)) & (1 - cov_eb)
            # 原画的上睫毛翘尖是压在头发上画的。这一小块（睫毛层外扩一圈 ∩ 头发）也要盖：用「没有五官的头」（脸底 + 前发）的像素垫上，否则翘尖永远留在那里
            lash_zone = cv2.warpAffine(cv2.dilate(region([i for i in parts if i.startswith('lash')]), np.ones((25, 25), np.uint8)).astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) / 255
            # 只取这张静帧里「看得见深色睫毛压在头发上」的地方（外眼角的翘尖）；被刘海盖住的那段上睫毛不算——那里贴片不许碰头发
            vis_lash = cv2.dilate(((frame[..., :3].max(2) < 90) & (lash_zone > 0.5) & (hair_f > 0.5)).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
            lash_hair = cv2.GaussianBlur(vis_lash * np.clip(hair_f * 1.5, 0, 1), (0, 0), 1.0)
            # 下半张脸（鼻子以下、两眼外沿之间）：找每张表情自己的嘴用
            er = [parts[i]['rect'] for i in eye_ids]; nr = parts['nose']['rect']; fr_ = parts['face']['rect']
            zx0, zx1 = int(min(r[0] for r in er)), int(max(r[0] + r[2] for r in er)); zy0, zy1 = int(nr[1] + nr[3]), int(fr_[1] + fr_[3])
            # 眉毛带（眉的上下各放宽）：眉毛这一块允许画在刘海上面
            br = [parts[i]['rect'] for i in parts if i.startswith('brow')]; eye_top = int(min(r[1] for r in er))
            bx0, bx1 = int(min(r[0] for r in br)) - 50, int(max(r[0] + r[2] for r in br)) + 50; by0, by1 = int(min(r[1] for r in br)) - 70, eye_top + 25
            mrig = np.zeros((RH, RW, 3), np.float32); mrig[org[1]:org[1] + master.shape[0], org[0]:org[0] + master.shape[1]] = master
            sk = lambda im: (im[..., 2] > 200) & (im[..., 2] - im[..., 0] > 12)
            band = np.zeros((RH, RW), bool); band[by0:by1, bx0:bx1] = True; zone = np.zeros((RH, RW), bool); zone[zy0:zy1, zx0:zx1] = True
            ob0 = region([i for i in parts if i.startswith('brow')]); brow_w = float(np.percentile(ob0.sum(0)[ob0.sum(0) > 0], 60)) * 0.85          # 原眉的线宽（母版像素）
            face_cx = int(parts['nose']['rect'][0] + parts['nose']['rect'][2] / 2)
            brow_pts = json.load(open(P('faces', 'brows.json'), encoding='utf-8')) if os.path.exists(P('faces', 'brows.json')) and not clip else None
            old_brow = cv2.dilate(region([i for i in parts if i.startswith('brow')]), np.ones((9, 9), np.uint8))          # 原眉所在处（母版坐标，外扩 4px）
            def ranges(src, expr=None):               # 这张图自己的嘴范围、眉范围（母版坐标的 0/1 图）
                rig = np.zeros((RH, RW, 3), np.float32); rig[org[1]:org[1] + src.shape[0], org[0]:org[0] + src.shape[1]] = src
                dm = np.abs(rig - mrig).max(2) > 40
                lab, k = ndi.label(cv2.morphologyEx((dm & zone).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)))
                keep = np.unique(lab[(cov_m0 > 0) & (lab > 0)]); mouth_px = np.isin(lab, keep) & (lab > 0)
                cm = ((cv2.dilate(mouth_px.astype(np.uint8), np.ones((2 * kpad + 1, 2 * kpad + 1), np.uint8)) > 0) | (cov_m0 > 0)).astype(np.uint8)
                # 眉块只取新眉的线条。参照是母版（不是前发素材——素材的头发和母版 / 表情图的头发不一样，拿它当参照会把发束的轮廓线也当成眉贴上去，
                # 2026-10-08 的「短茬」就是这么来的）：表情图比母版暗 30 以上的像素。原眉所在处母版本来就暗、比不出来，所以分两步：
                # ① 原眉位置之外，成条的暗块 = 新眉的主体；② 原眉位置之内，表情图里的细暗线只有落在「主体做闭运算补出来的范围」里才算（新眉穿过原眉位置的那一小段）。
                lumf = lambda im: im[..., :3] @ np.array([.114, .587, .299], np.float32); le = lumf(rig); ob = old_brow > 0
                # 眉的线条比发丝线粗（母版里约 8–12px，发丝线 2–4px），颜色是青灰：不要近黑的（睫毛）、不要偏红的（眼皮褶线）；
                # 连通块里要有经得起 7px 开运算的「粗」的部分才算眉——改图把发丝重画后错开一点，会多出很多细长的线，靠粗细筛掉。
                colour = (rig.max(2) > 70) & (rig[..., 2] - rig[..., 1] < 15)
                out_ink = ((lumf(mrig) - le > 30) & band & ~ob & colour).astype(np.uint8); oc = cv2.morphologyEx(out_ink, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
                thick = cv2.morphologyEx(oc, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))); n_i, lab_i, st_i, _ = cv2.connectedComponentsWithStats(oc, connectivity=8)
                keep_i = [j for j in range(1, n_i) if st_i[j, cv2.CC_STAT_AREA] >= 250 and max(st_i[j, cv2.CC_STAT_WIDTH], st_i[j, cv2.CC_STAT_HEIGHT]) >= 50 and int(thick[lab_i == j].sum()) >= 0.35 * st_i[j, cv2.CC_STAT_AREA]]
                # 只留粗的主体和它旁边 6px 以内的：搭在眉上的细发丝线剪掉（眉梢的细尖也会短一点）
                kept = (np.isin(lab_i, keep_i) & (cv2.dilate(thick, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) > 0)).astype(np.uint8); le8 = np.clip(le, 0, 255).astype(np.uint8)
                thin = (cv2.morphologyEx(le8, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))).astype(np.int16) - le8 > 30)
                kept |= (thin & ob & (cv2.morphologyEx(kept, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41))) > 0)).astype(np.uint8)
                # 新眉不直接用筛出来的像素（细而断续的会被筛碎）：只用它定位置和形状——左右各拟合一条二次弧线，再按原眉的线宽重画成一笔两端收尖的干净线。
                cb = np.zeros((RH, RW), np.float32)
                if brow_pts is not None:                                      # 有手工控制点（faces/brows.json）：只照它画；没列的表情不换眉
                    for tri in brow_pts['brows'].get(expr, []):
                        (xa_, ya_), (xm_, ym_), (xb_, yb_) = tri; mx_, my_ = (xa_ + xb_) / 2, (ya_ + yb_) / 2; xa_, ya_, xb_, yb_ = mx_ + (xa_ - mx_) * .92, my_ + (ya_ - my_) * .92, mx_ + (xb_ - mx_) * .92, my_ + (yb_ - my_) * .92; SSb = 4; m4 = np.zeros((RH * SSb // 4, RW * SSb // 4), np.uint8); bw = brow_pts.get('width', 13)
                        m4 = np.zeros((RH, RW), np.uint8); cx_ = 2 * xm_ - (xa_ + xb_) / 2; cy_ = 2 * ym_ - (ya_ + yb_) / 2              # 过中间点的二次贝塞尔的控制点
                        for t_ in np.linspace(0, 1, 120):
                            x_ = (1 - t_) ** 2 * xa_ + 2 * t_ * (1 - t_) * cx_ + t_ ** 2 * xb_ + org[0]; y_ = (1 - t_) ** 2 * ya_ + 2 * t_ * (1 - t_) * cy_ + t_ ** 2 * yb_ + org[1]
                            cv2.circle(m4, (int(round(x_)), int(round(y_))), max(1, int(round(bw / 2 * (0.18 + 0.82 * min(1, t_ / 0.3, (1 - t_) / 0.3) ** 0.8)))), 255, -1, cv2.LINE_AA)
                        cb = np.maximum(cb, m4.astype(np.float32) / 255)
                    return cm, cb
                for sx0, sx1 in ((0, face_cx), (face_cx, RW)):
                    src_px = kept[:, sx0:sx1]
                    if src_px.sum() < 150:                                   # 粗的主体太少（眉本来就细）：退回用成条的暗块
                        n2, lab2, st2, _ = cv2.connectedComponentsWithStats(oc[:, sx0:sx1], connectivity=8); src_px = np.isin(lab2, [j for j in range(1, n2) if st2[j, cv2.CC_STAT_AREA] >= 60 and st2[j, cv2.CC_STAT_WIDTH] >= 1.5 * st2[j, cv2.CC_STAT_HEIGHT]]).astype(np.uint8)
                    yy, xx = np.where(src_px > 0)
                    if len(xx) < 60 or xx.max() - xx.min() < 30: continue
                    xa, xb = np.percentile(xx, [2, 98]); co = np.polyfit(xx.astype(np.float64), yy.astype(np.float64), 2 if xb - xa > 60 else 1); X = np.linspace(xa, xb, 40); Yc = np.polyval(co, X)
                    m4 = np.zeros((RH, RW), np.uint8)
                    for t_, (x_, y_) in zip(np.linspace(0, 1, 40), zip(X, Yc)): cv2.circle(m4, (int(round(x_ + sx0)), int(round(y_))), max(1, int(round(brow_w / 2 * (0.3 + 0.7 * min(1, 5 * t_, 5 * (1 - t_)) ** 0.7)))), 255, -1, cv2.LINE_AA)
                    cb = np.maximum(cb, m4.astype(np.float32) / 255)
                return cm, cb
            rng = {e: ranges(src, e) for e, src in faces.items()}
            if clip:                           # 动画：整段用同一个范围（各帧的并集），免得贴片的边逐帧变形
                um = np.maximum.reduce([r[0] for r in rng.values()]); rng = {e: (um, rng[e][1]) for e in rng}        # 嘴的范围整段取并集；眉是重画的线，逐帧各自的
            fkey = 'face' if not clip else '_faceclip'; pose['patches'][fkey] = {}
            # 眼睛底下垫的肤色（这张静帧自己的）：眼块范围里用块外一圈实际的肤色（含腮红）平滑铺进来。眼块本身只留线和眼白（肤色处透明），肤色由它垫。
            sk2 = lambda im: (im[..., 2] > 195) & (im[..., 2] - im[..., 0] > 14) & (im[..., 1] > 150) & (im[..., 2] - im[..., 1] > 6)
            ezone = cv2.dilate((cv2.warpAffine(cov_eb.astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) > 127).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
            valid = (sk2(frame) & ~ezone & (occ < 0.05) & (hair_f < 0.05) & (frame[..., 3] > 250) & (bare_f[..., 3] > 128)).astype(np.float32); fb = frame[..., :3]
            fill = np.zeros_like(fb) + (np.median(fb[valid > 0], axis=0) if valid.any() else 220); done = np.zeros(valid.shape, bool)
            for sg in (5, 10, 20, 40):
                w = cv2.GaussianBlur(valid, (0, 0), sg); f2 = cv2.GaussianBlur(fb * valid[..., None], (0, 0), sg) / np.maximum(w[..., None], 1e-6); use = (w > 0.06) & ~done; fill[use] = f2[use]; done |= use
            hairc = lambda im: (im[..., 1] - im[..., 2] > 6) & (im[..., 1] > 110)                 # 这张帧里实际的发色像素（挨着素材头发范围的）也算头发
            hair_all = (hair_f > 0.3) | (hairc(frame) & (cv2.dilate((hair_f > 0.3).astype(np.uint8), np.ones((11, 11), np.uint8)) > 0) & ~(cv2.warpAffine(cov_eb.astype(np.float32) * 255, M, size) > 127))
            if name == lib['rest']:                       # 头发的范围（帧坐标）存一份：空脸库的默认脸要让开头发边（clips/make_default_face.py）
                cv2.imwrite(P(libname, 'patches', name, 'hair_all.png'), hair_all.astype(np.uint8) * 255)
            keep = ezone & ~(cv2.dilate(hair_all.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)
            ua = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.5) * (~hair_all) * (1 - occ) * (frame[..., 3] / 255) * face_in; uy, ux = np.where(ua > 0.01)
            if len(uy):
                ux0, uy0, ux1, uy1 = ux.min(), uy.min(), ux.max() + 1, uy.max() + 1; rel = f'patches/{name}/eye_skin.png'; os.makedirs(os.path.dirname(P(libname, rel)), exist_ok=True)
                cv2.imwrite(P(libname, rel), np.dstack([cv2.GaussianBlur(fill, (0, 0), 3)[uy0:uy1, ux0:ux1], ua[uy0:uy1, ux0:ux1] * 255]).round().astype(np.uint8)); pose['patches']['eyeSkin'] = {'file': rel, 'rect': [int(ux0), int(uy0), int(ux1 - ux0), int(uy1 - uy0)]}
            # 擦原眉（原眉是压着刘海画的一条线，换了眉以后它还在，成了两副眉）：见 brow_erase.py。画在刘海上层、新眉之前。
            # （用前发素材盖的做法弃用：这套帧的头发和头部母版 / 素材的头发形状不一样，盖上去发丝对不上。）
            # 内容取自「无眉的归位帧」（clips/brow_clean.py 离线做的，一次做干净）：眉带这一块按这张静帧相对归位帧的对位搬过来，颜色做低频匹配。
            # 没有无眉归位帧的库不出这块（也就不能换眉）。
            nb = lib['poses'][lib['rest']].get('noBrow'); by_ = np.array([]); bshift = None
            if nb and M_rest is not None:
                nbi = rgba(P(libname, nb['frame'])); changed = (np.abs(nbi[..., :3] - rest[..., :3]).max(2) > 3).astype(np.uint8)
                band_r = cv2.GaussianBlur(cv2.dilate(changed, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))).astype(np.float32), (0, 0), 2.0)       # 眉那一条外扩 6px，羽化落在平涂色里
                A2 = (np.vstack([M, [0, 0, 1]]) @ np.linalg.inv(np.vstack([M_rest, [0, 0, 1]])))[:2].astype(np.float32)
                cont = cv2.warpAffine(nbi[..., :3], A2, size, flags=cv2.INTER_LINEAR); ba = cv2.warpAffine(band_r, A2, size, flags=cv2.INTER_LINEAR) * (frame[..., 3] / 255) * (1 - occ)
                ringb = (ba > 0.02) & (ba < 0.5) & (frame[..., 3] > 250)
                content = np.clip(cont + (np.median(frame[ringb][:, :3] - cont[ringb], axis=0) if ringb.sum() >= 30 else 0), 0, 255); by_, bx_ = np.where(ba > 0.01)
            if len(by_) and not clip:
                x0, y0, x1, y1 = bx_.min(), by_.min(), bx_.max() + 1, by_.max() + 1; rel = f'patches/{name}/brow_erase.png'
                cv2.imwrite(P(libname, rel), np.clip(np.dstack([content[y0:y1, x0:x1], ba[y0:y1, x0:x1] * 255]), 0, 255).round().astype(np.uint8)); pose['patches']['browErase'] = {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'source': 'noBrow'}
            for expr, src in faces.items():
                rig = np.zeros((RH, RW, 4), np.float32); rig[org[1]:org[1] + src.shape[0], org[0]:org[0] + src.shape[1], :3] = src; rig[org[1]:org[1] + src.shape[0], org[0]:org[0] + src.shape[1], 3] = 255
                cov_m, cov_b = rng[expr]
                cov_e = cov_eb & (1 - cov_m)                                         # 眼块里不带任何嘴的像素
                # 眼块里也不许带表情图自己的眉（2026-10-08：不换眉时原眉 + 表情图的眉残段并存，「重复」）：眼睛外扩出来的那圈余量里，
                # 青灰色、不是近黑也不是眼白的线条 = 表情图的眉落进来的部分，从眼块里扣掉（那里由垫层的肤色顶上）。睫毛尖是近黑的，不受影响。
                r3 = rig[..., :3]; lum3 = r3 @ np.array([.114, .587, .299], np.float32)
                browish = (r3.max(2) > 70) & (lum3 < 190) & (r3[..., 1] - r3[..., 2] > 4) & (r3[..., 0] - r3[..., 2] > 0)
                margin = (cov_eb > 0) & ~(cv2.dilate(region(eye_ids), np.ones((5, 5), np.uint8)) > 0)
                cov_e = cov_e & (1 - cv2.dilate((browish & margin).astype(np.uint8), np.ones((7, 7), np.uint8)) * margin.astype(np.uint8))
                # 2026-10-09：上面只认「偏红的青灰」，漏了灰绿的眉残段（angry / squeeze / doubt / awkward 的眉梢在眼块上缘、压到刘海边）。
                # 补一刀：每一列里，比这列最上面的深色线（上睫毛 / 眼线）还高的地方，除了近黑的线和眼睑褶的橙线（R > G + 30，更淡的偏肤色边是眉的软边；注意 rig 是 BGR），一律不属于眼（那里只可能是表情图的眉和它的软边），扣掉。
                # 眼睑褶的橙线（R > G）不动；虹膜、眼白、睫毛都在最上缘的深线以下，不受影响。
                ink = (lum3 < 80) & (cov_eb > 0); has = ink.any(0); topc = np.where(has, ink.argmax(0), -1).astype(np.int64)
                xs_h = np.where(has)[0]
                if len(xs_h):
                    near = np.abs(np.arange(RW)[:, None] - xs_h[None]).argmin(1); topf = np.where(np.abs(np.arange(RW) - xs_h[near]) <= 40, topc[xs_h[near]], -1)
                    above = (np.arange(RH)[:, None] < (topf[None] - 1)) & (topf[None] >= 0)
                    grn = (cov_eb > 0) & above & (lum3 >= 80) & ~(r3[..., 2] > r3[..., 1] + 30) & ~(r3.min(2) > 235)
                    cov_e = cov_e & (1 - cv2.dilate(grn.astype(np.uint8), np.ones((5, 5), np.uint8)))
                img_f = to_frame(rig, M, size); entry = {}
                # 腮红块：表情图 ÷ 母版（都先模糊一点，免得线条错位出暗边），夹在 0.55–1 之间 = 「比原画红了多少」，播放器用正片叠底叠上去；差得很少就不出这块
                ratio = np.clip(cv2.GaussianBlur(rig[..., :3], (0, 0), 3) / np.maximum(cv2.GaussianBlur(mrig, (0, 0), 3), 1), 0.55, 1.0)
                bz = blush_zone & (1 - cov_m)
                if float((1 - ratio)[bz > 0].mean()) >= 0.012:
                    rr4 = np.dstack([ratio * 255, np.full(ratio.shape[:2], 255, np.float32)]).astype(np.float32); rf = to_frame(rr4, M, size)
                    ab = cv2.GaussianBlur(cv2.warpAffine(bz.astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) / 255, (0, 0), 3.0) * (1 - np.clip(hair_f * 1.5, 0, 1)) * (1 - occ) * (frame[..., 3] / 255) * face_in
                    ys, xs = np.where(ab > 0.004)
                    if len(ys):
                        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
                        rel = f'patches/{name}/face_{expr}_blush.png' if not clip else f'patches/{name}/faceclip/{clip}/{expr}_blush.png'; os.makedirs(os.path.dirname(P(libname, rel)), exist_ok=True)
                        cv2.imwrite(P(libname, rel), np.dstack([rf[y0:y1, x0:x1, :3], ab[y0:y1, x0:x1] * 255]).round().astype(np.uint8)); entry['blush'] = {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'blend': 'multiply'}
                for part, cov_rig, under_hair in (('eyes', cov_e, True), ('mouth', cov_m, True), ('brow', cov_b, False)):
                    if not cov_rig.any(): continue
                    cov = cv2.warpAffine(cov_rig.astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) / 255; hard = cov > 0.5
                    # 肤色补偿：不止加一个常数。贴片里外「两边都是皮肤」的像素上量帧和表情图的色差，按位置平滑成一张色差图（归一化卷积），
                    # 表情图的皮肤像素按这张图拉平——改图有时把五官周围画得偏亮偏黄，是一片一片的，一个常数拉不平。
                    near = cv2.dilate(hard.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
                    ok = near & (frame[..., 3] > 250) & (img_f[..., 3] > 250) & (hair_f < 0.05) & (occ < 0.05) & sk(frame) & sk(img_f)
                    # 「两边都是皮肤」还要更严：绿通道够高（张着的嘴里面是红的，红、蓝关系和皮肤一样）、两边差得不离谱
                    ok &= (frame[..., 1] > 185) & (img_f[..., 1] > 185) & (np.abs(frame[..., :3] - img_f[..., :3]).max(2) < 45)
                    shift = np.median(frame[ok][:, :3] - img_f[ok][:, :3], axis=0) if ok.sum() >= 30 else np.zeros(3)
                    # 帧里原来的眼睛、嘴那里取不到皮肤样本：小尺度铺不到的地方用更大的尺度，最后整体再抹平，
                    # 否则「色差图 / 常数」的交界正好是帧里原来眼睛的形状，贴上去能看到一圈眼形的浅色轮廓。
                    okf = ok.astype(np.float32); dimg = (frame[..., :3] - img_f[..., :3]) * okf[..., None]; field = np.zeros_like(dimg) + shift; done = np.zeros(okf.shape, bool)
                    for sg in (7, 14, 28, 56):
                        w = cv2.GaussianBlur(okf, (0, 0), sg); f2 = cv2.GaussianBlur(dimg, (0, 0), sg) / np.maximum(w[..., None], 1e-6)
                        use = (w > 0.08) & ~done; field[use] = f2[use]; done |= use
                    field = cv2.GaussianBlur(field, (0, 0), 5)
                    skin_w = cv2.GaussianBlur(sk(img_f).astype(np.float32), (0, 0), 1.0)[..., None]       # 皮肤用色差图，眼睛、嘴、线条只加常数
                    rgbf = np.clip(img_f[..., :3] + field * skin_w + shift * (1 - skin_w), 0, 255)
                    hz = lash_hair if part == 'eyes' else 0.0                                # 眼块在睫毛压着头发的地方垫头发色
                    if part == 'eyes': rgbf = rgbf * (1 - lash_hair[..., None]) + np.clip(bare_f[..., :3] + shift * 0, 0, 255) * lash_hair[..., None]
                    alpha = cv2.GaussianBlur(cov, (0, 0), FEATHER if under_hair else 1.2) * ((np.maximum(1 - np.clip(hair_f * 1.5, 0, 1), hz)) if under_hair else 1.0) * (1 - occ) * (frame[..., 3] / 255) * (img_f[..., 3] / 255)
                    if part == 'eyes':                                                       # 眼块只留线、眼白、爱心这些「墨」，肤色处透明（肤色由 eyeSkin / 逐帧的 under 垫）；睫毛压着头发的那一小块保留
                        ink = 1 - cv2.GaussianBlur(sk2(img_f).astype(np.float32), (0, 0), 0.7); alpha = alpha * np.maximum(ink, np.clip(lash_hair * 1.2, 0, 1))
                    alpha = alpha * (np.maximum(face_in, np.clip(lash_hair * 1.2, 0, 1)) if part != 'brow' else 1.0)
                    ys, xs = np.where(alpha > 0.004)
                    if not len(ys): continue
                    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
                    if part == 'brow':
                        ob_f = cv2.warpAffine(region([i for i in parts if i.startswith('brow')]).astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) > 200
                        bsrc = ORIG_FRAME if ORIG_FRAME is not None else frame          # 眉的颜色取原画眉的线色；空脸库里帧上没有原眉，取原（有脸的）归位帧的
                        bcol = np.percentile(bsrc[ob_f][:, :3], 30, axis=0) if ob_f.sum() >= 20 else np.array([120, 130, 100], np.float32)
                        al0 = cv2.warpAffine(cov_rig.astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) / 255
                        core_w = cv2.GaussianBlur(cv2.erode((al0 > 0.5).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32), (0, 0), 6.0); core_w = (core_w / max(1e-6, float(core_w.max())))[..., None]      # 线的中段、芯部 → 1，两端和边 → 0
                        rgbf = bcol + 18 * (1 - core_w); alpha = cv2.GaussianBlur(al0, (0, 0), 0.6) * (frame[..., 3] / 255); ys, xs = np.where(alpha > 0.004); x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
                    rel = f'patches/{name}/face_{expr}_{part}.png' if not clip else f'patches/{name}/faceclip/{clip}/{expr}_{part}.png'
                    os.makedirs(os.path.dirname(P(libname, rel)), exist_ok=True); cv2.imwrite(P(libname, rel), np.dstack([rgbf[y0:y1, x0:x1], alpha[y0:y1, x0:x1] * 255]).round().astype(np.uint8))
                    if INK and part in ('eyes', 'mouth') and not clip:
                        # 墨迹版（空脸库用）：只有线、眼白、虹膜、高光、舌头牙齿这些「墨」，肤色处全透明；不垫头发色、不按头发 / 脸轮廓裁（遮罩逐帧在跟踪里算，宁可多露一点）；
                        # 眼 / 嘴范围外圈里发色（薄荷色）的像素是表情图里的头发，不要（眼眶范围里的青色是虹膜，要）。
                        ink_i = 1 - cv2.GaussianBlur(sk2(img_f).astype(np.float32), (0, 0), 0.7)
                        hairpx = ((img_f[..., 1] - img_f[..., 2] > 6) & (img_f[..., 1] > 110)).astype(np.float32)
                        core = (cv2.warpAffine(cv2.dilate(region(eye_ids) if part == 'eyes' else region(list(mouths.values())), np.ones((7, 7), np.uint8)).astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) > 127).astype(np.float32)
                        nonhair = 1 - cv2.GaussianBlur(hairpx * (1 - core), (0, 0), 0.7)
                        ai = cv2.GaussianBlur(cov, (0, 0), FEATHER) * ink_i * nonhair * (frame[..., 3] / 255) * (img_f[..., 3] / 255)
                        ys_, xs_ = np.where(ai > 0.004)
                        if len(ys_):
                            xa, ya, xb, yb = xs_.min(), ys_.min(), xs_.max() + 1, ys_.max() + 1; reli = rel[:-4] + '_ink.png'
                            cv2.imwrite(P(libname, reli), np.dstack([rgbf[ya:yb, xa:xb], ai[ya:yb, xa:xb] * 255]).round().astype(np.uint8)); entry[part + 'Ink'] = {'file': reli, 'rect': [int(xa), int(ya), int(xb - xa), int(yb - ya)]}
                    entry[part] = {'file': rel, 'rect': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'color_shift_rgb': [round(float(v), 1) for v in shift[::-1]]}
                pose['patches'][fkey][expr] = entry
            if clip:
                fc = pose['patches'].pop('_faceclip'); pose['patches'].setdefault('faceClips', {})[clip] = {'fps': cmeta['fps'], 'label': cmeta.get('label', clip), 'frames': [fc[k] for k in sorted(fc)]}
            else: print('   表情脸', {k: list(v) for k, v in pose['patches']['face'].items()})
        if INK:                    # 默认脸 / 口型 / 眨眼的墨迹版：直接用角色的分层美术素材（有真 alpha，干净的线和色块），不从任何一帧里抠
            def ink_part(ids, fname):
                cv_ = np.zeros((RH, RW, 4), np.float32)
                for i_ in ids: place(cv_, i_)
                fr_ = to_frame(cv_, M, size); a_ = fr_[..., 3] / 255; ys_, xs_ = np.where(a_ > 0.004)
                if not len(ys_): return None
                x0_, y0_, x1_, y1_ = xs_.min(), ys_.min(), xs_.max() + 1, ys_.max() + 1; rel_ = f'patches/{name}/ink_{fname}.png'; os.makedirs(os.path.dirname(P(libname, rel_)), exist_ok=True)
                cv2.imwrite(P(libname, rel_), np.dstack([np.clip(fr_[y0_:y1_, x0_:x1_, :3], 0, 255), fr_[y0_:y1_, x0_:x1_, 3:]]).round().astype(np.uint8)); return {'file': rel_, 'rect': [int(x0_), int(y0_), int(x1_ - x0_), int(y1_ - y0_)]}
            eyes_ids = [i for i in parts if i.startswith(('eyeWhite', 'iris', 'eyeHl', 'eyeLow', 'lash'))]
            def ink_from_orig(zone_ids, fname, pad, bg_mode='inpaint'):
                # 从原（有脸的）归位帧上取这一块五官的墨迹：背景 = 把五官擦掉后补出来的肤色（眉用无眉帧），alpha 按和背景的色差定，被线圈住的洞（眼白）整块不透明；
                # 范围 = 五官范围外扩 pad，不含头发（hair_all），所以一个头发像素都不带、也没有肤色底。
                o8 = np.clip(ORIG_FRAME, 0, 255).astype(np.uint8); zone = cv2.warpAffine(cv2.dilate(region(zone_ids), np.ones((2 * pad + 1,) * 2, np.uint8)).astype(np.float32) * 255, M, size, flags=cv2.INTER_LINEAR) > 127
                zone &= ~(cv2.dilate(hair_all.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0) if not fname.startswith('brow') else zone
                if bg_mode == 'nobrow': bg = np.clip(NOBROW_FRAME[..., :3], 0, 255).astype(np.uint8)
                else:
                    b_, g_, r_ = [o8[..., i].astype(np.int16) for i in range(3)]; skin_o = (r_ > 225) & (r_ - b_ > 14) & (g_ > 205) & (r_ - b_ < 100)        # 比一般的肤色判定严：嘴线是淡红的，宽松的判定会把它当皮肤
                    inkm = cv2.dilate((zone & ~skin_o).astype(np.uint8), np.ones((5, 5), np.uint8))
                    bg = cv2.inpaint(o8[..., :3], inkm, 6, cv2.INPAINT_TELEA)
                d_ = np.abs(o8[..., :3].astype(np.int16) - bg.astype(np.int16)).max(2).astype(np.float32); a_ = np.clip(d_ / 48.0, 0, 1) * zone
                solid = ndi.binary_fill_holes(cv2.morphologyEx((a_ > 0.5).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)) > 0) & zone
                a_ = np.maximum(a_, cv2.erode(solid.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32)) * (ORIG_FRAME[..., 3] / 255)
                ys_, xs_ = np.where(a_ > 0.02)
                if not len(ys_): return None
                x0_, y0_, x1_, y1_ = xs_.min(), ys_.min(), xs_.max() + 1, ys_.max() + 1; rel_ = f'patches/{name}/ink_{fname}.png'
                cv2.imwrite(P(libname, rel_), np.dstack([o8[y0_:y1_, x0_:x1_, :3], np.round(a_[y0_:y1_, x0_:x1_] * 255).astype(np.uint8)])); return {'file': rel_, 'rect': [int(x0_), int(y0_), int(x1_ - x0_), int(y1_ - y0_)]}
            brow_ids = [i for i in parts if i.startswith('brow')]
            if ORIG_FRAME is not None:
                dflt_ink = {'eyes': ink_from_orig(eyes_ids, 'eyes', 10), 'mouth': ink_from_orig(['mouth_closed', 'mouth_smile'], 'mouth', 8), 'brow': ink_from_orig(brow_ids, 'brow', 18, 'nobrow') if NOBROW_FRAME is not None else ink_part(brow_ids, 'brow')}
                dflt_ink = {k: v for k, v in dflt_ink.items() if v}
            else: dflt_ink = {k: v for k, v in (('blush', ink_part(['blush'], 'blush')), ('eyes', ink_part(['nose'] + eyes_ids, 'eyes')), ('mouth', ink_part(['mouth_smile'], 'mouth_smile')), ('brow', ink_part(brow_ids, 'brow'))) if v}
            ink = {'default': dflt_ink,
                   'mouth': {k: ink_part([pid], 'mouth_' + k) for k, pid in mouths.items()}, 'blink': ink_part(['lidL', 'lidR'], 'blink')}
            pose['patches']['ink'] = ink; print('   墨迹版（美术素材）：', {k: (list(v) if isinstance(v, dict) else bool(v)) for k, v in ink.items()})
        print(name, read)
        for k, v in list(pose['patches']['mouth'].items()) + [('blink', pose['patches']['blink']), ('clean', pose['patches']['clean'])]: print('  ', k, v['rect'], '色差补偿 RGB', v['color_shift_rgb'], '遮挡像素', v['occluded_px'])
    # 写回：重新读盘上最新的 clips.json，只动自己的键（各姿势的 patches、库级的 mouthShapes / talk / blink 只在没有时补），别人写的键不碰
    baked = {k: v['patches'] for k, v in lib['poses'].items() if 'patches' in v and k not in skipped and (not only or k in only or k == lib['rest'])}
    lib = json.load(open(P(libname, 'clips.json'), encoding='utf-8'))
    for k, v in baked.items():
        if clip: lib['poses'][k].setdefault('patches', {}).setdefault('faceClips', {})[clip] = v['faceClips'][clip]     # 动画模式只写这一段
        else:
            keep = (lib['poses'][k].get('patches') or {}).get('faceClips')                                          # 重烘静态贴片时别把已有的脸部动画丢了
            lib['poses'][k]['patches'] = v
            if keep and 'faceClips' not in v: lib['poses'][k]['patches']['faceClips'] = keep
    lib.setdefault('mouthShapes', list(mouths))
    if INK: lib['faceMode'] = 'ink'
    # 固定的说话节奏：[口型, 秒]，循环播；null = 不贴（露出帧里原来的嘴）。眨眼：每 period 秒闭 closed 秒。
    lib.setdefault('talk', {'pattern': [['small', .10], ['big', .14], ['small', .08], ['closed', .08], ['big', .16], ['smile', .14], ['small', .10], ['closed', .10],
                                        ['small', .08], ['big', .14], ['small', .10], ['smile', .16], ['closed', .12], [None, .60]]})
    lib.setdefault('blink', {'period': 3.2, 'closed': 0.13, 'offset': 1.4})
    json.dump(lib, open(P(libname, 'clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; opt = {}
    it = iter(sys.argv[1:])
    for a in it:
        if a in ('--lib', '--poses', '--clip', '--align-from', '--orig-frame', '--nobrow-frame'): opt[a] = next(it); args = [x for x in args if x != opt[a]]
    if len(args) != 1: print(__doc__); sys.exit(2)
    ALIGN_FROM = opt.get('--align-from'); INK = '--ink' in sys.argv
    if opt.get('--orig-frame'): ORIG_FRAME = rgba(opt['--orig-frame'])
    if opt.get('--nobrow-frame'): NOBROW_FRAME = rgba(opt['--nobrow-frame'])
    main(args[0].rstrip('/'), opt.get('--lib', 'clips'), set(opt['--poses'].split(',')) if '--poses' in opt else None, opt.get('--clip'))
