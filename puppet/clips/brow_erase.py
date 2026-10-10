"""擦原眉：原眉是压着刘海画的一条青灰色弧线。形状不用猜——用素材里的眉层（browL / browR）按对位搬到这一帧，
再在 ±10px 里找它在这一帧的实际位置（片段里眉毛会比归位帧抬高几个像素），然后只把这条细线（外扩 2px）在帧上就地修补掉（Telea，半径 3）。
带子只有七八个像素宽，修补不会糊出一片（整条 16px 的眉带就地修补会，试过）。bake_patches.py（静帧）和 track_head.py（动作帧逐帧）共用。"""
import cv2, numpy as np


def erase(bgr, side_masks, allow=None, up=10, down=8, side=10):
    """bgr：这一帧（uint8，已合到不透明底）；side_masks：每条眉一张布尔图（眉层 alpha 按对位搬过来的）。→ (修补后的图, alpha 0–1, 每条眉找到的位移)"""
    lum = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY); H, W = lum.shape
    line = np.clip(cv2.morphologyEx(lum, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(np.int16) - lum, 0, 80).astype(np.float32)   # 细暗线的强度
    mask = np.zeros((H, W), bool); shifts = []
    for m in side_masks:
        ys, xs = np.where(m)
        if not len(ys): shifts.append(None); continue
        best = (-1, 0, 0)
        for dy in range(-up, down + 1):
            for dx in range(-side, side + 1):
                y2, x2 = ys + dy, xs + dx; ok = (y2 >= 0) & (y2 < H) & (x2 >= 0) & (x2 < W)
                sc = float(line[y2[ok], x2[ok]].mean()) - 0.15 * (abs(dy) + abs(dx))            # 分数接近时取位移小的
                if sc > best[0]: best = (sc, dy, dx)
        _, dy, dx = best; y2, x2 = ys + dy, xs + dx; ok = (y2 >= 0) & (y2 < H) & (x2 >= 0) & (x2 < W); one = np.zeros((H, W), bool); one[y2[ok], x2[ok]] = True; shifts.append([int(dx), int(dy)])
        # 片段里眉毛不只是整体挪位置，还会拉长一点：把眉的弧线（对找到的位置拟合一条二次曲线）向两端各延长 16px，
        # 延长段上 ±5px 的走廊里、和眉连着的细暗线也算眉。（试过按颜色沿细暗线自由生长：眉和发束轮廓线颜色太近，会顺着发丝长出去，把刘海擦花，弃用。）
        yy, xx = np.where(one)
        if len(xx) >= 30 and xx.max() - xx.min() >= 12:
            co = np.polyfit(xx.astype(np.float64), yy.astype(np.float64), 2); X = np.arange(max(0, xx.min() - 16), min(W, xx.max() + 17)); Yc = np.polyval(co, X)
            cor = np.zeros((H, W), bool)
            for x_, y_ in zip(X, Yc):
                if x_ < xx.min() or x_ > xx.max(): cor[max(0, int(round(y_)) - 5):int(round(y_)) + 6, x_] = True
            n, lab, st, _ = cv2.connectedComponentsWithStats(((cor & (line > 8)) | one).astype(np.uint8), connectivity=8); hit = np.unique(lab[one & (lab > 0)]); one = np.isin(lab, hit) & (lab > 0)
        mask |= one
    mask = cv2.dilate(mask.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    if allow is not None: mask &= allow
    # 填充：眉是横着的一条，发束的轮廓线大多是竖着穿过它的。逐列把被擦掉的那一小段用它上、下两端外侧的像素线性插值填上——
    # 竖着的发丝线、发束和皮肤的交界就顺着接上了（Telea 修补会把它们糊成一团，试过）。最后只在擦掉的范围里横向轻轻抹一下，去掉逐列的条纹。
    inp = bgr.astype(np.float32).copy(); src = bgr.astype(np.float32)
    for x in np.where(mask.any(0))[0]:
        col = mask[:, x]; ys = np.where(col)[0]; runs = np.split(ys, np.where(np.diff(ys) > 1)[0] + 1)
        for r in runs:
            y0, y1 = max(0, r[0] - 2), min(H - 1, r[-1] + 2); t = ((r - y0) / max(1, y1 - y0))[:, None]; inp[r, x] = src[y0, x] * (1 - t) + src[y1, x] * t
    sm = cv2.GaussianBlur(inp, (0, 0), sigmaX=0.8, sigmaY=0.01); inp = np.where(mask[..., None], sm, inp).round().astype(np.uint8)
    return inp, cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 0.8), shifts
