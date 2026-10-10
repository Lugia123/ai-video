#!/usr/bin/env python3
# 空脸归位帧（832×1104，和 clips-b1/frames/idle.png 同一画布：home_rgba 的 INTER_AREA 缩小）。
#   A：clips-b1 的「干净脸」贴片贴回归位帧（贴片自带 alpha，头发在贴片外 / alpha=0 处原样）
#   B：改图模型去五官的结果，ECC 仿射配准回归位帧（遮掉脸区域算），只在贴片 alpha 的范围里取改图的像素
# 用法：make_blank.py <改图结果.png> <输出前缀>   → <前缀>_rgba.png、<前缀>_magenta.png
import sys, json, numpy as np, cv2
B1 = '../clips-b1'; ST = '../clips-stage'
rgba = cv2.cvtColor(cv2.imread(f'{ST}/home_rgba.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)
home = cv2.resize(rgba, (832, 1104), interpolation=cv2.INTER_AREA)
mag = cv2.cvtColor(cv2.resize(cv2.imread(f'{ST}/home.png'), (832, 1104), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)
patch = cv2.cvtColor(cv2.imread(f'{B1}/patches/idle/clean.png', cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA); x0, y0 = 283, 355; ph, pw = patch.shape[:2]
def put(base, src, a):  # a: 0..1 (ph,pw)
    o = base.copy().astype(np.float32); reg = o[y0:y0+ph, x0:x0+pw]; reg[..., :3] = reg[..., :3] * (1 - a[..., None]) + src[..., :3] * a[..., None]; return o
a = patch[..., 3] / 255.0
if sys.argv[1] == 'A':
    out_mag = put(mag, patch[..., :3].astype(np.float32), a)
else:
    e = cv2.cvtColor(cv2.imread(sys.argv[1]), cv2.COLOR_BGR2RGB); e = cv2.resize(e, (832, 1104), interpolation=cv2.INTER_AREA)
    g0 = cv2.cvtColor(mag, cv2.COLOR_RGB2GRAY).astype(np.float32); g1 = cv2.cvtColor(e, cv2.COLOR_RGB2GRAY).astype(np.float32)
    msk = np.full(g0.shape, 255, np.uint8); msk[300:560, 250:600] = 0   # 脸区域不参与配准
    W = np.eye(2, 3, dtype=np.float32)
    cc, W = cv2.findTransformECC(g0, g1, W, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-7), msk, 5)
    ea = cv2.warpAffine(e, W, (832, 1104), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
    d = np.abs(ea.astype(int) - mag.astype(int)).max(2); outside = (msk > 0)
    print('ECC cc %.4f  W=%s' % (cc, np.round(W, 4).tolist()), ' 配准后脸外差>20 的像素 %d (%.3f%%)' % ((d[outside] > 20).sum(), (d[outside] > 20).mean() * 100))
    # 肤色补偿：脸区域贴片范围里「原图是皮肤」的像素（A 的干净脸皮肤）与改图同位置的均值差
    A = put(mag, patch[..., :3].astype(np.float32), a)[y0:y0+ph, x0:x0+pw]; Er = ea[y0:y0+ph, x0:x0+pw].astype(np.float32)
    skin = (a > 0.98) & (np.abs(A - Er).max(2) < 25); sh = (A[skin] - Er[skin]).mean(0); print('肤色差 A−B（RGB 均值）', np.round(sh, 2), '样本', int(skin.sum()))
    Er = np.clip(Er + sh, 0, 255); out_mag = put(mag, Er, a)
out_mag = np.clip(out_mag, 0, 255).astype(np.uint8)
# rgba：alpha 用归位帧的；脸区域 rgb 取 out_mag（脸整块不透明）
o = home.copy(); o[y0:y0+ph, x0:x0+pw, :3] = np.where((a > 0)[..., None], out_mag[y0:y0+ph, x0:x0+pw], o[y0:y0+ph, x0:x0+pw, :3])
# 贴片只在 a>0 处改；其余像素与 home 逐字节相同
chg = (o.astype(int) != home.astype(int)).any(2); ys, xs = np.where(chg); print('改动像素 %d，包围盒 x %d–%d y %d–%d' % (chg.sum(), xs.min(), xs.max(), ys.min(), ys.max()))
cv2.imwrite(sys.argv[2] + '_rgba.png', cv2.cvtColor(o, cv2.COLOR_RGBA2BGRA)); cv2.imwrite(sys.argv[2] + '_magenta.png', cv2.cvtColor(out_mag, cv2.COLOR_RGB2BGR))
