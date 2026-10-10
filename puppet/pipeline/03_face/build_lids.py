#!/usr/bin/env python3
"""第 3 步 闭眼线部件 lidL / lidR + 去掉睫毛下缘里侧的小疙瘩（#1158 补修）。要先跑过 build_eyes.py。

  python3 build_lids.py --source <角色来源目录> --work <中间产物目录>

输入：<source>/head/rig.json、<work>/face/eyes_stage1/ 里 build_eyes.py 出的 lash{L,R}.png 和 eyes.json、<source>/face/eyeLow{L,R}.png。
输出：<source>/face/ 的 lash{L,R}.png（削过下缘的成品）、lid{L,R}.png、eyes.json（加上 lid 两项、下睫毛点的闭合建议）。
原件是就地改写睫毛图，重跑一遍会在已经削过的图上再削一次；这里改成从中间产物读、成品另写，重跑结果不变。
闭眼线：沿 rig 的闭合线再往下垂一点的一道弧（中间低、两端高），两端收细。
  y(x) = eye.top + eh × closeAt + eh × (0.10 + SAG) × (1 − xc²) + DROP，xc = (x − eye.center.x) / eye.hw ∈ [−0.92, 0.92]
  rig 的闭合线是同一个式子去掉 SAG 和 DROP；全闭时上睫毛的下缘正好压在闭合线上，所以这道弧的两端贴着睫毛下缘、中间比它低 SAG×eh + DROP。
  线宽取旧睫毛里那段弧线的粗细（实测约 6–7 px），颜色取睫毛深色部分的中位色。
小疙瘩：睫毛下缘逐列取轮廓，和它自己的中值滤波（宽 31 列）比，把眼眶中段（中心 ±0.5 个半宽）的下缘换成平滑后的轮廓：鼓出来的削掉，小缺口填平。"""
import json, os, sys, numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK          # 脚本里 W_ 之类的名字已经在用，所以换个名字引
from scipy import ndimage as ndi
RIG = json.load(open(SRC('head/rig.json'), encoding='utf-8')); P = {p['id']: p for p in RIG['parts']}; HO = (390, 136)
SAG, DROP, WIDTH, K = 0.07, 3.0, 6.5, 4
EJ = json.load(open(WK('face/eyes_stage1/eyes.json'), encoding='utf-8')); rep = {}
for s in 'LR':
    e = RIG['eyes'][s]; eh = e['bottom'] - e['top']
    # ---- 小疙瘩
    im = cv2.imread(WK('face/eyes_stage1', f'lash{s}.png'), cv2.IMREAD_UNCHANGED); r = P['lash' + s]['rect']; h, w = im.shape[:2]
    v = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)[..., 2]; dark = (im[..., 3] > 128) & (v < 110)
    bottom = np.full(w, -1.0)
    for x in range(w):
        ys = np.where(dark[:, x])[0]
        if len(ys):
            brk = np.where(np.diff(ys) > 2)[0]; bottom[x] = ys[brk[0]] if len(brk) else ys[-1]
    ok = bottom >= 0; med = bottom.copy(); med[ok] = ndi.median_filter(bottom[ok], size=31, mode='nearest')
    # 只在眼眶中段（中心 ±0.5 个半宽）找：两头的睫毛下缘本来就变化很快，不能拿中值比。
    # 第一版范围放到 ±0.8、还顺手删「主体下面的第二段」，把睫毛两头切出了竖直的豁口，已撤回。
    x_in0, x_in1 = e['center'][0] - 0.5 * e['hw'] - r[0], e['center'][0] + 0.5 * e['hw'] - r[0]
    # 把中段的下缘轮廓换成它自己的平滑版（中值 31 列 + 高斯 σ=6）：鼓出来的削掉，凹进去的小缺口用睫毛的深色填平；两头各 15 列渐变回原轮廓。
    # （只削不填的那一版，疙瘩削掉后旁边还留着台阶状的小缺口。）
    tgt = med.copy(); tgt[ok] = ndi.gaussian_filter1d(med[ok], 6, mode='nearest')
    dcol = np.median(im[..., :3][(im[..., 3] > 250) & (v < 60)], 0).astype(np.uint8); cut = 0
    for x in range(w):
        if not (ok[x] and x_in0 <= x <= x_in1): continue
        wt = min(1.0, (x - x_in0) / 15, (x_in1 - x) / 15); t = bottom[x] + (tgt[x] - bottom[x]) * wt; yt = int(round(t)); yb_ = int(round(bottom[x]))
        if abs(t - bottom[x]) > 14: continue
        if yt < yb_: cut += int((im[yt + 1:, x, 3] > 0).sum()); im[yt + 1:, x, 3] = 0
        elif yt > yb_: im[yb_:yt + 1, x, :3] = dcol; im[yb_:yt + 1, x, 3] = 255; cut += yt - yb_
        im[yt + 1:yt + 4, x, 3] = 0                                        # 清掉原来挂在下缘外的半透明残边
    a = im[..., 3].astype(np.float32); a = np.minimum(a, cv2.GaussianBlur(a, (0, 0), 0.7)); im[..., 3] = a.astype(np.uint8)
    cv2.imwrite(SRC('face', f'lash{s}.png'), im)
    col = np.median(im[..., :3][(im[..., 3] > 250) & (v < 60)], 0)
    # ---- 闭眼线
    lo_, hi_ = (-0.92, 0.62) if s == 'L' else (-0.62, 0.92)      # 靠鼻子的一端短一点（上睫毛在内眼角那头也短）
    xs = np.linspace(lo_, hi_, 121); X = e['center'][0] + xs * e['hw']; Y = e['top'] + eh * e.get('closeAt', 0.72) + eh * (0.10 + SAG) * (1 - xs ** 2) + DROP
    pad = 12; x0, y0 = int(np.floor(X.min())) - pad, int(np.floor(Y.min())) - pad; W_, H_ = int(np.ceil(X.max())) + pad - x0, int(np.ceil(Y.max())) + pad - y0
    big = np.zeros((H_ * K, W_ * K), np.uint8)
    for i in range(len(xs)):
        t = min(xs[i] - lo_, hi_ - xs[i]) / ((hi_ - lo_) / 2); rad = WIDTH / 2 * (0.35 + 0.65 * min(1, t / 0.35))       # 两端 35% 的长度内收细到 35%
        cv2.circle(big, (int(round((X[i] - x0) * K)), int(round((Y[i] - y0) * K))), max(1, int(round(rad * K))), 1, -1)
    al = cv2.resize(big.astype(np.float32), (W_, H_), interpolation=cv2.INTER_AREA)
    out = np.dstack([np.broadcast_to(col.astype(np.uint8), (H_, W_, 3)), (al * 255).astype(np.uint8)])
    cv2.imwrite(SRC('face', f'lid{s}.png'), out)
    # 下睫毛点：全闭时收拢到闭眼线下方
    lr = P['eyeLow' + s]['rect']; lo = cv2.imread(SRC('face', f'eyeLow{s}.png'), cv2.IMREAD_UNCHANGED); ys, xs_ = np.where(lo[..., 3] > 128)
    dot_cx, dot_top = lr[0] + xs_.mean(), lr[1] + ys.min()
    xc = np.clip((dot_cx - e['center'][0]) / e['hw'], -1, 1); lid_y = e['top'] + eh * e.get('closeAt', 0.72) + eh * (0.10 + SAG) * (1 - xc ** 2) + DROP
    dy = round(float((lid_y + WIDTH / 2 + 5) - dot_top), 1)
    rep[s] = {'lash_bump_px_removed': cut, 'lid_rect': [x0, y0, W_, H_], 'lid_color_bgr': [int(c) for c in col], 'eyeLow_dy_at_full_close': dy}
    EJ['parts'] = [p for p in EJ['parts'] if p['id'] != 'lid' + s]
    EJ['parts'].append({'id': 'lid' + s, 'src': f'lid{s}.png', 'eye': s, 'role': 'lid', 'rect': [x0, y0, W_, H_], 'rect_head_px': [x0 - HO[0], y0 - HO[1], W_, H_], 'depth': 0.60,
        'z': '画在同侧上睫毛之上（或紧挨其下都可以，颜色相同）', 'usage': '闭眼线。只在闭合度 c ≥ 0.88 时出现：alpha = smoothstep((c − 0.88) / 0.12)，c = 1 时不透明（试过从 0.80 起淡入：c = 0.9 时虹膜还露着一半，半透明的线横在虹膜上不好看，所以推迟到虹膜基本淡出之后）；睁眼时不画。不跟眼珠动，不做闭合变形（它就是闭合后的样子）。笑眼（eyeSmile）时闭合线反过来弯，这片不适用，按 (1 − eyeSmile) 再乘一次 alpha。'})
    for p in EJ['parts']:
        if p['id'] == 'eyeLow' + s: p['close_behavior'] = {'suggest': f'闭合度 c 从 0.60 到 1.00，整体平移 dy = {dy} px × smoothstep((c − 0.60) / 0.40)（负数是向上），全闭时点的上缘在闭眼线下缘下方约 5 px；alpha 保持 1。想更简单就在 c ≥ 0.85 后淡出到 0。', 'dy_at_full_close': dy}
EJ['lid'] = {'formula': 'y(x) = eye.top + eh*closeAt + eh*(0.10 + 0.07)*(1 - xc^2) + 3，xc ∈ [-0.92, 0.92]；线宽 6.5 px，两端收细', 'report': rep}
json.dump(EJ, open(SRC('face/eyes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(json.dumps(rep, ensure_ascii=False))
