#!/usr/bin/env python3
"""把一个动作的两段首尾帧图生视频（去程、回程，键色底）入库成片段：抠成透明序列帧，颜色只认归位帧这一张基准。

    python3 puppet/clips/import_i2v.py puppet/characters/<角色>/clips --action think \\
        --go <去程.mp4> --back <回程.mp4> [--model-matte <去程蒙版目录> <回程蒙版目录>] [--key-color 236,64,200] [--xfade 3]
    （模型蒙版先用 clips/model_matte.py 出；不给也能跑，只是运动模糊的手、淡粉色的小洞抠不干净）
    单图往返（一段里做完去和回）：python3 puppet/clips/import_i2v.py <片段库> --loop <视频.mp4> --clip <片段名> [--loop-matte <蒙版目录>]
    之后跑：clips/sync.py（量包围盒、生成 clips.js）→ 要贴片再跑 clips/bake_patches.py → 再 sync 一遍

入库规矩（2026-10-07 定，原因见 README「颜色基准」）：
1. **只有归位帧是关键图。** 去程第 0 帧、回程末帧换成归位帧原图（像素级相同，和待机接得上）；
   动作保持帧不用生成视频时喂进去的那张姿势关键图，用生成帧——保持帧 = 回程的第一张生成帧。
2. **颜色只对归位帧校。** 每一帧各自拟合一条「这一帧 → 归位帧」的逐通道曲线（只用两边都不透明、位置没动的像素，
   动了的地方当离群点剔掉），曲线沿时间稍微平滑后套上去。这样姿势关键图本身偏暗 / 偏亮不会被带进片段。
   （校色曲线默认不做时间平滑：图生视频的头两三帧和最后一帧自带一个色调偏移，平滑会把它抹到邻帧上。）
3. 去程最后一张生成帧和回程第一张生成帧不是同一张图（两次生成），之间插 --xfade 张交叉淡化帧，接在去程末尾，
   所以每次做动作只在刚进保持时淡一次。
4. 回程最后 --settle 张生成帧逐步混向归位帧原图，把「换回关键图」那一步清晰度 / 线条位置的跳摊开。
读数（每帧校色前后和归位帧的色差、去程末 ↔ 回程首的差）写进 clips.json 的 clips.<片段>.import。"""
import argparse, json, os, subprocess
import cv2, numpy as np
from scipy import ndimage as ndi

LUM = np.array([.299, .587, .114]); LUMW = LUM.astype(np.float32)


def decode(path, size):
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path],
                                   capture_output=True, text=True).stdout.strip().split(',')[:2])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)
    if (w, h) != size: raise SystemExit(f'{path}：视频 {w}×{h}，画布是 {size[0]}×{size[1]}，先统一尺寸')
    return fr


def clean_edges(rgba, sure=None):
    """半透明的边像素，颜色换成「最近的不透明像素的颜色」：混进边里的底色、浅色亮边一起换掉（人物描边是深色，边就该是描边色）。
    只换半透明像素（alpha < 250），不透明的一个不动——描边本身只有两三个像素宽，往里多换一圈就把描边换成里面的填充色了。alpha 不动。"""
    al = rgba[..., 3]; core = (al >= 250) if sure is None else ((al >= 250) & sure)      # sure：哪些不透明像素的颜色信得过（给了就只从它们取色）
    if not core.any(): return rgba
    idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
    out = rgba.copy(); band = (al > 0) & ~core
    out[..., :3][band] = rgba[..., :3][idx[0], idx[1]][band]
    return out


def defringe(rgba):
    """去亮边：贴着透明处的那一两个像素，如果比往里 3px 处的描边亮得多（放在深色底上就是一圈白边），颜色换成最近的、不是亮边的不透明像素色。
    只动这种像素，描边本身不碰；alpha 不动。另外把人物内部（离透明处 3px 以上）的半透明像素补成不透明——那是被误抠的眼白、高光、白袖子。"""
    al = rgba[..., 3]; vis = al > 16; lum = rgba[..., :3].astype(np.float32) @ LUMW
    dist = ndi.distance_transform_edt(vis)
    core = (al >= 250) & (dist >= 3)
    if not core.any(): return rgba
    idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True); inner = lum[idx[0], idx[1]]
    bad = vis & (dist <= 2.5) & (lum - inner > 45) & (inner < 120)
    good = vis & ~bad & (al >= 250)
    out = rgba.copy()
    if bad.any() and good.any():
        j = ndi.distance_transform_edt(~good, return_distances=False, return_indices=True)
        out[..., :3][bad] = rgba[..., :3][j[0], j[1]][bad]
    deep = vis & (al < 250) & (dist > 3)
    out[..., 3][deep] = 255
    return out


def choke(alpha, amount=0.3):
    """alpha 边往里收一点（把最淡的那圈半透明压掉），细线不整根抹掉：按色阶重映射，不做腐蚀。"""
    a = alpha.astype(np.float32) / 255
    return (np.clip((a - amount) / (1 - amount), 0, 1) * 255).round().astype(np.uint8)


EDGE = 'soft'          # 'soft'：软边 + 收边（默认）；'luma'：轮廓按亮度重建（可选，没过连续观看的验收，别默认开）。命令行 --edge 改


def luma_edge(f, a, bg):
    """轮廓按亮度重建。视频是 4:2:0，色度只有亮度一半的分辨率：键色算出来的 alpha 在硬边上要 3–4px 才过渡完，还是一格一格的台阶；
    亮度的过渡只有约 1px。人物的边都是深色描边，比底色暗——所以在「拿不准」的那圈像素（0.02 < a < 0.98）里，
    alpha 改按亮度算：这一点在「底色的亮度」和「旁边最暗的描边」之间走到哪了。得到的是贴着描边的 1px 抗锯齿硬边。
    旁边没有比底色明显更暗的东西（没描边、或者快动作糊掉了）就不改，保留键色的软边。"""
    Y = f @ LUMW; Yb = float(bg @ LUMW)
    D = ndi.distance_transform_edt(a >= 0.02).astype(np.float32)                 # 到最近的「肯定是底色」的距离
    # 往底色那一侧 2px 内有没有比底色明显更暗的像素（= 描边已经在外面了，这一点在描边里侧，是人物）
    out_min = np.full(Y.shape, 255.0, np.float32); in_min = np.full(Y.shape, 255.0, np.float32)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if dy == 0 and dx == 0: continue
            Ys = np.roll(Y, (dy, dx), (0, 1)); Ds = np.roll(D, (dy, dx), (0, 1))
            out_min = np.where(Ds < D - 0.5, np.minimum(out_min, Ys), out_min)
            in_min = np.where(Ds > D + 0.5, np.minimum(in_min, Ys), in_min)
    allun = (a > 0.02) & (a < 0.98); un = allun & (D <= 4)
    behind = (un & (out_min < Yb - 45)) | (allun & (a >= 0.8))                              # 描边里侧（外面已经有描边了，或者键色本来就认它是人物）：整个算人物
    core = np.minimum(in_min, Y)                                                  # 往里 2px 内最暗的 = 描边的芯
    trans = un & ~behind & (core < Yb - 45) & (Y < Yb + 8)                        # 底色 → 描边 的过渡：按亮度走到哪算 alpha
    aY = np.clip((Yb - Y) / np.maximum(Yb - core, 1.0), 0, 1)
    out = np.where(behind, 1.0, np.where(trans, aY, a)).astype(np.float32)
    # 逐像素算出来的边会有单个像素的缺口和毛刺：周围 8 个里至少 6 个是人物的透明点补上，至少 6 个是底色的孤点去掉
    k = np.ones((3, 3), np.float32); k[1, 1] = 0
    nb_hi = cv2.filter2D((out > 0.5).astype(np.float32), -1, k); nb_mean = cv2.filter2D(out, -1, k / 8)
    out = np.where((out < 0.5) & (nb_hi >= 6), nb_mean, out)
    out = np.where((out > 0.5) & (nb_hi <= 2), nb_mean, out)
    return out


NEAR_REST = 0.42     # 人物区域里「相对归位帧没动」的占比低于这个数，就算这一帧的姿势离归位帧太远（比如转身转到侧面、背面）


def near_rest(frame, rest, color_tol=24.0, alpha_tol=30.0):
    """这一帧里，归位帧人物所在的区域有多大比例「没动」（模糊后颜色差、alpha 差都小，且连成片）。返回 (占比, 没动的 0/1 图)。"""
    pm = lambda x: x[..., :3].astype(np.float32) * (x[..., 3:].astype(np.float32) / 255)
    dc = np.abs(cv2.GaussianBlur(pm(frame), (0, 0), 2) - cv2.GaussianBlur(pm(rest), (0, 0), 2)).max(2)
    da = np.abs(cv2.GaussianBlur(frame[..., 3].astype(np.float32), (0, 0), 2) - cv2.GaussianBlur(rest[..., 3].astype(np.float32), (0, 0), 2))
    m = cv2.morphologyEx(((dc < color_tol) & (da < alpha_tol)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    fig = rest[..., 3] > 16
    return float(m[fig].mean()), m


def luts_to_rest(raw, rest, smooth=0.0):
    """整段的校色查找表。姿势离归位帧太远的帧（near_rest 占比低）和归位帧没有可比的像素，硬拟合会把颜色带偏——
    这些帧不自己拟合，用前后最近的「靠得住」的帧的查找表按帧号插值。返回 (查找表数组, 每帧拟合用上的像素占比, 靠得住的帧号)。"""
    luts, used = zip(*[lut_to_rest(f, rest) for f in raw]); luts = np.stack(luts); n = len(raw)
    good = [i for i, f in enumerate(raw) if near_rest(f, rest)[0] >= NEAR_REST]
    if good and len(good) < n:
        gi = np.array(good, np.float64); x = np.arange(n, dtype=np.float64); flat = luts[good].reshape(len(good), -1)
        luts = np.stack([np.interp(x, gi, flat[:, j]) for j in range(flat.shape[1])], 1).reshape(n, 256, 3)
    if smooth > 0: luts = ndi.gaussian_filter1d(luts, smooth, axis=0, mode='nearest')
    return luts, used, good


def static_lock(frames, rest, color_tol=24.0, alpha_tol=30.0, window=2):
    """静止锁定：相对归位帧没动的地方，直接用归位帧的像素。不动处逐帧完全一样（零闪烁），和归位帧衔接处边不跳，
    细尖的东西（呆毛、发梢）不动时用的是归位帧自己的边。「没动」= 两边模糊后颜色差、alpha 差都小，且连成片，
    而且前后各 window 帧也都没动（不然锁一帧放一帧，边界自己会跳）；锁和不锁之间留 2px 过渡。
    frames 是一段 RGBA uint8（已经对归位帧校过色）。返回 (锁定后的帧, 每帧锁住的面积占比)。"""
    pm = lambda x: x[..., :3].astype(np.float32) * (x[..., 3:].astype(np.float32) / 255)
    same = []
    for f in frames:
        frac, m = near_rest(f, rest, color_tol, alpha_tol)                           # 零星对上的不算（里面做了开运算）
        if frac < NEAR_REST: same.append(np.zeros_like(m)); continue                 # 姿势离归位帧太远：整帧不锁，免得把归位帧的碎片贴到转过去的身体上
        # 轮廓那一圈：生成帧的边和归位帧差一两个像素，单看这一圈总是「不一样」。夹在两片没动的区域（人物里面、外面的空底）之间的
        # 细环一起算没动——要锁的正是这一圈边。真在动的手臂是一大片，补不上。
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
        same.append(cv2.erode(m, np.ones((9, 9), np.uint8)))                         # 离动的地方留 4px 余量
    n = len(frames); out, frac = [], []
    for t, f in enumerate(frames):
        m = np.minimum.reduce(same[max(0, t - window):min(n, t + window + 1)])
        w = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)[..., None]
        prem = pm(rest) * w + pm(f) * (1 - w); al = rest[..., 3:].astype(np.float32) * w + f[..., 3:].astype(np.float32) * (1 - w)
        rgb = np.where(al > 0.5, prem / np.maximum(al, 1e-6) * 255, 0)
        out.append(np.dstack([np.clip(rgb, 0, 255), np.clip(al, 0, 255)]).round().astype(np.uint8)); frac.append(float(m.mean()))
    return out, frac


def key(f, kc, model=None):
    """键色底的一帧（float RGB）→ RGBA。现在只支持品红一类的键色（R、B 高，G 低）。
    1. 键色程度 m = min(R,B) − G，alpha 按 m 线性算（手臂和身体围住的洞一样挖掉）；
    2. 半透明处按「这一点 = 前景 × a + 底色 × (1−a)」把底色减掉，还原前景色（不只是压一压 R、B）；
    3. 有模型蒙版 model（0–1，白 = 主体）时让它当裁判：蒙版深处（离蒙版边 ≥ 3px）一律不透明——保护运动模糊里混进底色的手、
       白袖子；蒙版外面深处、又带键色的地方一律透明——打开被画成淡粉色、键色抠不透的小洞。边的精确位置仍然听键色的；
    4. 边带的颜色换成往里最近的实心像素色，alpha 边收一点。"""
    bg = np.median(np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)]), 0)
    m = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]; mb = min(bg[0], bg[2]) - bg[1]
    a = 1 - np.clip((m - 0.06 * mb) / (0.80 * mb), 0, 1)
    au = np.clip(1 - m / mb, 0.2, 1)[..., None]                               # 还原前景色用的混合比（不夹死在 0，免得除爆）
    c = np.where((a < 0.995)[..., None], np.clip((f - bg * (1 - au)) / au, 0, 255), f)
    if model is not None:
        win = np.clip((ndi.distance_transform_edt(model > 0.5) - 1.5) / 2, 0, 1)      # 蒙版里面：离边 1.5px 起算，3.5px 处算数（软过渡，不出台阶）
        wout = np.clip((ndi.distance_transform_edt(model <= 0.5) - 1.5) / 2, 0, 1)
        a = np.where(m < 0.45 * mb, np.maximum(a, win), a)                             # 纯键色的小缝即使在蒙版里也不保
        a = np.where(m > 0.15 * mb, a * (1 - wout), a)
    sure = a >= 0.98                                                              # 键色自己就认定不透明的像素：颜色没混底色
    if EDGE == 'luma': a = luma_edge(f, a, bg)
    a[a < 0.04] = 0
    rgba = np.dstack([c, a * 255]).round().astype(np.uint8)
    rgba = clean_edges(rgba, sure if EDGE == 'luma' else None)
    if EDGE != 'luma': rgba[..., 3] = choke(rgba[..., 3])
    return rgba


def key_diff(f, model=None, t0=40.0, t1=80.0):
    """中性底色（灰）用：alpha 以模型蒙版为主（它的边是软的，和软边流程配得上），再用差值键把模型漏掉的细尖补回来。
    差值键 = 这一点离底色多远（三个通道里差得最多的那个）。人物身上几乎没有和中灰一样的颜色，呆毛、发梢这类细尖抠图模型常认不出来，
    但它们的颜色离灰很远。补回来的部分必须和模型认出的人物连着（细尖是长在头上的），孤零零的一小块是噪点，不要。
    只用差值键当主 alpha 试过（2026-10-08）：边太硬，边上混了灰的像素留成不透明，深色底上一圈亮边，所以不那么做。"""
    if model is None: raise SystemExit('--key diff 必须同时给模型蒙版')
    bg = np.median(np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)]), 0)
    d = np.abs(f - bg).max(2)
    a = model.astype(np.float32).copy(); a[a < 0.04] = 0; a[a > 0.96] = 1
    extra = np.clip((d - t0) / (t1 - t0), 0, 1)
    both = np.maximum(a, extra)
    lab, k = ndi.label(both > 0.5)
    if k:
        touch = np.unique(lab[(model > 0.5) & (lab > 0)]); extra = np.where(np.isin(lab, touch), extra, 0.0)
    a = np.maximum(a, extra)
    au = np.clip(a, 0.2, 1)[..., None]
    c = np.where(((a > 0) & (a < 1))[..., None], np.clip((f - bg * (1 - au)) / au, 0, 255), f)
    sure = a >= 0.98
    if EDGE == 'luma': a = luma_edge(f, a, bg)
    rgba = np.dstack([c, a * 255]).round().astype(np.uint8)
    rgba = clean_edges(rgba, sure if EDGE == 'luma' else None)
    if EDGE != 'luma': rgba[..., 3] = choke(rgba[..., 3])
    return rgba


def key_model_only(f, model):
    """底色不是键色（比如中性灰）时：alpha 完全用模型蒙版；半透明的边按「前景 × a + 底色 × (1−a)」把底色减掉，
    边带颜色换成最近的不透明像素色。没有键色可查，所以蒙版认错的地方（没打开的窄缝、漏掉的发梢）没有第二道保险。"""
    if model is None: raise SystemExit('--no-chroma 必须同时给模型蒙版')
    bg = np.median(np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)]), 0)
    a = model.astype(np.float32).copy(); a[a < 0.04] = 0; a[a > 0.96] = 1
    au = np.clip(a, 0.2, 1)[..., None]
    c = np.where(((a > 0) & (a < 1))[..., None], np.clip((f - bg * (1 - au)) / au, 0, 255), f)
    sure = a >= 0.98
    if EDGE == 'luma': a = luma_edge(f, a, bg)
    rgba = np.dstack([c, a * 255]).round().astype(np.uint8)
    rgba = clean_edges(rgba, sure if EDGE == 'luma' else None)
    if EDGE != 'luma': rgba[..., 3] = choke(rgba[..., 3])
    return rgba


def lut_to_rest(f, rest):
    """这一帧 → 归位帧 的逐通道查找表（256×3）。两边都不透明的像素，先模糊抹掉一两个像素的线条错位；
    迭代剔掉对不上的像素（动了的手臂、画法不同的地方），剩下的拟合二次曲线。"""
    both = ndi.binary_erosion((f[..., 3] > 250) & (rest[..., 3] > 250), iterations=3)
    A = cv2.GaussianBlur(f[..., :3], (0, 0), 3)[both].astype(np.float64); B = cv2.GaussianBlur(rest[..., :3], (0, 0), 3)[both].astype(np.float64)
    keep = np.abs(A - B).max(1) < 60                           # 一上来就差很多的 = 内容不同（比如袖子盖住了裙子）
    x = np.arange(256.0); lut = np.zeros((256, 3))
    for _ in range(3):
        co = [np.polyfit(A[keep, c], B[keep, c], 2) for c in range(3)]
        res = np.abs(np.stack([np.polyval(co[c], A[:, c]) for c in range(3)], 1) - B).max(1)
        keep = res < max(8.0, 2.0 * np.median(res[keep]))
    for c in range(3):
        lo, hi = np.percentile(A[keep, c], [0.5, 99.5])        # 样本范围外不外推，按端点的偏移量平移
        y = np.polyval(co[c], np.clip(x, lo, hi)) + (x - np.clip(x, lo, hi)); lut[:, c] = y
    return lut, float(keep.mean())


def apply_lut(f, lut):
    o = f.copy()
    for c in range(3): o[..., c] = np.clip(lut[:, c][f[..., c]], 0, 255).round().astype(np.uint8)
    return o


def diff(a, b):     # 两边都不透明处的平均色差、平均亮度差（a − b）
    both = (a[..., 3] > 128) & (b[..., 3] > 128); d = a[..., :3].astype(float) - b[..., :3].astype(float)
    return round(float(np.abs(d).mean(2)[both].mean()), 2), round(float((d @ LUM)[both].mean()), 2)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lib'); ap.add_argument('--action'); ap.add_argument('--go'); ap.add_argument('--back')
    ap.add_argument('--loop', help='单图往返：一段视频里做完去和回，首帧 = 尾帧 = 归位帧'); ap.add_argument('--clip', help='--loop 时：写进哪个片段（用它现有的帧表）'); ap.add_argument('--loop-matte', help='--loop 时的模型蒙版目录')
    ap.add_argument('--key-color', default='236,64,200'); ap.add_argument('--model-matte', nargs=2, metavar=('去程蒙版目录', '回程蒙版目录'))
    ap.add_argument('--no-clean-rest', action='store_true'); ap.add_argument('--no-chroma', action='store_true', help='同 --key model')
    ap.add_argument('--key', choices=['magenta', 'diff', 'model'], default='magenta', help='magenta：品红一类的键色（默认）；diff：中性灰底，按离底色多远抠 + 模型蒙版当裁判；model：只用模型蒙版')
    ap.add_argument('--edge', choices=['luma', 'soft'], default='soft', help='soft：软边 + 收边（默认，用户认可过的那版）；luma：轮廓按亮度重建（可选）')
    ap.add_argument('--static-lock', action='store_true', help='做静止锁定（默认不做）。2026-10-08 用户看到连续播放时人「裂开」，已搁置：锁住的用归位帧像素、没锁的用生成帧，两者差零点几到一两个像素，交界在人身上成了缝')
    ap.add_argument('--no-static-lock', action='store_true', help='（兼容旧命令，现在默认就不做）'); ap.add_argument('--xfade', type=int, default=3); ap.add_argument('--smooth', type=float, default=0.0); ap.add_argument('--settle', type=int, default=3)
    o = ap.parse_args(); kc = [int(v) for v in o.key_color.split(',')]
    global EDGE; EDGE = o.edge
    if o.no_chroma: o.key = 'model'
    keyer = (lambda f, mm: key_model_only(f, mm)) if o.key == 'model' else (lambda f, mm: key_diff(f, mm)) if o.key == 'diff' else (lambda f, mm: key(f, kc, mm))
    P = lambda *p: os.path.join(o.lib, *p)
    lib = json.load(open(P('clips.json'), encoding='utf-8')); size = (lib['canvas']['w'], lib['canvas']['h'])
    if not o.loop and not (o.action and o.go and o.back): ap.error('要么 --action + --go + --back，要么 --loop + --clip')
    act = next(a for a in lib['actions'] if a['id'] == o.action) if not o.loop else None
    rest = cv2.cvtColor(cv2.imread(P(lib['poses'][lib['rest']]['frame']), cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)
    lib['matte'] = {'method': 'chroma-linear + unmix + edge-recolor', 'edge': o.edge, 'static_lock': bool(o.static_lock), 'model_matte': bool(o.model_matte or o.loop_matte)}
    save = lambda rel, im: (os.makedirs(os.path.dirname(P(rel)), exist_ok=True), cv2.imwrite(P(rel), cv2.cvtColor(im, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_PNG_COMPRESSION, 6]))

    out, reads = {}, {}
    rest_dirty = False
    if not o.no_clean_rest:
        # 归位帧自己的边也按同一套规矩清一遍（它是别处抠的，边上有一圈浅色），清完写回——它仍是唯一的基准图。
        # 只在第一次导入时清；已经清过的（库里记了 restCleaned）不再动，免得每导一个动作就多收一圈。
        if not lib.get('restCleaned'):
            rest = clean_edges(rest); rest[..., 3] = choke(rest[..., 3])
            if o.edge == 'luma': rest = defringe(rest)
            lib['restCleaned'] = True; rest_dirty = True
    def mattes(d, n):
        if not d: return [None] * n
        ms = [cv2.imread(os.path.join(d, f'{i:02d}.png'), cv2.IMREAD_GRAYSCALE) for i in range(n)]
        if any(m is None or m.shape[::-1] != size for m in ms): raise SystemExit(f'{d}：蒙版缺帧或尺寸不对')
        return [m.astype(np.float32) / 255 for m in ms]
    if o.loop:
        # 单图往返：整段一个片段，帧数和帧文件名照片段现有的帧表（别的片段可能共用这些文件，比如「停在幅度最大处」的去程 / 回程）
        clip = lib['clips'][o.clip]; rawf = decode(o.loop, size); n = len(rawf)
        if n != len(clip['frames']): raise SystemExit(f'{o.clip}：帧表 {len(clip["frames"])} 帧，视频 {n} 帧，对不上')
        raw = [keyer(f, mm) for f, mm in zip(rawf, mattes(o.loop_matte, n))]
        luts, used, good = luts_to_rest(raw, rest, o.smooth)
        fixed = [apply_lut(f, l) for f, l in zip(raw, luts)]; locked = []
        if o.static_lock:
            fixed, locked = static_lock(fixed, rest)
        read = {'edge': o.edge, 'static_locked_frac': [round(v, 3) for v in locked], 'frames_far_from_rest': [i for i in range(n) if i not in good],'frames': n, 'luma_diff_to_rest_before': [diff(f, rest)[1] for f in raw], 'luma_diff_to_rest_after': [diff(f, rest)[1] for f in fixed],
                'settle_frames': [n - 1 - o.settle, n - 2] if o.settle else None, 'model_matte': bool(o.loop_matte), 'key': o.key,
                'rule': '首帧 = 尾帧 = 归位帧原图；其余是生成帧，逐帧对归位帧校色；末尾几张逐步混向归位帧'}
        if o.edge == 'luma': fixed = [defringe(f) for f in fixed]
        fixed[0] = rest; fixed[-1] = rest
        for j in range(o.settle):
            i = n - 1 - o.settle + j; k = (j + 1) / (o.settle + 1)
            fixed[i] = np.clip(fixed[i].astype(np.float32) * (1 - k) + rest.astype(np.float32) * k, 0, 255).round().astype(np.uint8)
        for rel, im in zip(clip['frames'], fixed): save(rel, im)
        if rest_dirty: save(lib['poses'][lib['rest']]['frame'], rest)
        clip['import'] = read; lib['colorBasis'] = lib['rest']
        json.dump(lib, open(P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'{o.clip}（{n} 帧，单图往返）：亮度差（帧 − 归位帧）校色后最大 {max(abs(v) for v in read["luma_diff_to_rest_after"]):.1f}')
        return
    for side, path, md in (('in', o.go, (o.model_matte or [None, None])[0]), ('out', o.back, (o.model_matte or [None, None])[1])):
        rawf = decode(path, size); n = len(rawf)
        raw = [keyer(f, mm) for f, mm in zip(rawf, mattes(md, n))]
        luts, used, good = luts_to_rest(raw, rest, o.smooth)
        fixed = [apply_lut(f, l) for f, l in zip(raw, luts)]; locked = []
        if o.static_lock:
            fixed, locked = static_lock(fixed, rest)
        reads[side] = {'edge': o.edge, 'static_locked_frac': [round(v, 3) for v in locked],'frames': n, 'color_diff_to_rest_before': [diff(f, rest)[0] for f in raw], 'color_diff_to_rest_after': [diff(f, rest)[0] for f in fixed],
                       'luma_diff_to_rest_before': [diff(f, rest)[1] for f in raw], 'luma_diff_to_rest_after': [diff(f, rest)[1] for f in fixed],
                       'fit_pixels_used': [round(u, 3) for u in used]}
        out[side] = [defringe(f) for f in fixed] if o.edge == 'luma' else fixed
    go, back = out['in'], out['out']
    go[0] = rest; back[-1] = rest                                # 只有归位这一头换成关键图
    # 回程末尾：生成帧 → 归位帧原图 那一步是清晰度和线条位置的跳（生成帧软、差一两个像素）。末尾本来就是静止的尾巴，
    # 把最后 --settle 张生成帧逐步混向归位帧，一步的跳摊成几小步。
    nb = len(back)
    for j in range(o.settle):
        i = nb - 1 - o.settle + j; k = (j + 1) / (o.settle + 1)
        back[i] = np.clip(back[i].astype(np.float32) * (1 - k) + rest.astype(np.float32) * k, 0, 255).round().astype(np.uint8)
    hold = back[0]                                               # 保持帧 = 回程第一张生成帧
    gap = diff(go[-1], hold)
    xf = [np.clip(go[-1].astype(np.float32) * (1 - k) + hold.astype(np.float32) * k, 0, 255).round().astype(np.uint8)
          for k in (np.arange(1, o.xfade + 1) / (o.xfade + 1))] if o.xfade > 0 else []
    go_all = go + xf + [hold]

    cin, cout = lib['clips'][act['in']], lib['clips'][act['out']]
    for clip, name, frames in ((cin, act['in'], go_all), (cout, act['out'], back)):
        d = P('frames', name)
        for f in (os.listdir(d) if os.path.isdir(d) else []):
            if f.endswith('.png'): os.remove(os.path.join(d, f))
        clip['frames'] = [f'frames/{name}/{i:02d}.png' for i in range(len(frames))]
        for rel, im in zip(clip['frames'], frames): save(rel, im)
    save(lib['poses'][act['pose']]['frame'], hold)
    ng = len(go)
    cin['import'] = dict(reads['in'], source_frames=ng, xfade_frames=[ng, ng + len(xf) - 1] if xf else None,
                         hold_gap={'what': '去程最后一张生成帧 ↔ 保持帧（回程第一张生成帧）', 'color_diff': gap[0], 'luma_diff': gap[1]},
                         rule='第 0 帧 = 归位帧原图；其余是生成帧，逐帧对归位帧校色；末尾接交叉淡化到保持帧')
    cout['import'] = dict(reads['out'], settle_frames=[nb - 1 - o.settle, nb - 2] if o.settle else None,
                          rule='第 0 帧 = 保持帧（生成帧）；末帧 = 归位帧原图；逐帧对归位帧校色；末尾几张逐步混向归位帧')
    if rest_dirty: save(lib['poses'][lib['rest']]['frame'], rest)      # 全部算完才落盘，中途失败不留半套
    lib['colorBasis'] = lib['rest']
    json.dump(lib, open(P('clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for side in ('in', 'out'):
        r = reads[side]; f = lambda k: ' '.join(f'{v:.1f}' for v in r[k])
        print(f'{act[side]}（{r["frames"]} 帧）\n  亮度差（帧 − 归位帧）校色前：{f("luma_diff_to_rest_before")}\n  校色后：{f("luma_diff_to_rest_after")}')
    print(f'去程末生成帧 ↔ 回程首生成帧：色差 {gap[0]}，亮度差 {gap[1]}；交叉淡化 {len(xf)} 帧')
    print('注意：active / dupes 里的帧号要对着新的帧表核一遍（去程后面多了淡化帧）。')


if __name__ == '__main__':
    main()
