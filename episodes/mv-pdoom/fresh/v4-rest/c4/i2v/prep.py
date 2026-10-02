"""#1052 副歌 4 的图生视频 → 逐帧抠图。改自 fresh/i2v-test/_work/prep2.py（#1039），只关掉了镜片半透明和红眼检测。
  cd episodes/mv-pdoom/fresh/v4-rest/c4/i2v && python3 prep.py gen/show-draft-s1.mp4 show [--local]   （用带 numpy / cv2 / PIL 的 python3）\n  --local = 不调服务器的 BiRefNet，本地抠白底（见 local_alpha；显卡在跑视频任务时用）

白色从哪来（#1039 查明）：
  ① 护目镜镜片是透明的，生成画面里透出的是原关键画的白底 → 旧抠法把镜片当实心，成了白块；
  ② 外轮廓抗锯齿像素混了白底颜色 → 一圈细白边；
  ③ minterpolate 插帧在手刚入画时产生的重影碎块被当成前景；
  ④ 手指缝、发缝里被围住的白底没抠掉。
做法：
  1. 原始 16 fps 帧（不插帧，见下），放大到 832×1248
  2. 每帧调本地服务 /cutout（BiRefNet）拿 alpha；本地缓存在 _work/birefnet-<out>/
  3. 只留主体（最大连通块 + 面积 ≥ 主体 3% 的块），去掉插帧碎块
  4. 主体里「接近纯白的不饱和像素」= 透出来的白底：大块的（缝隙、手指间）直接透明；
     护目镜镜片（不饱和、偏亮、位于镜框区域）按「灰色镜片叠在白底上」反推半透明 alpha
  5. 帧间 alpha 取三帧中值（时间平滑，边缘不闪，手快速移动时也不拖影）
  6. 边缘收 1px；边缘像素去白边：先按 alpha 反预乘白底（c = (I − (1−a)·255) / a），
     再把 2px 边缘带的颜色换成往外扩散的内部颜色（颜色往内部推）
输出 <out>/f-NNN.png（RGBA）+ meta.json（含红眼亮起的时刻），和 prep.py 同格式，试验页直接用。"""
import base64, json, pathlib, subprocess, sys, tempfile, io
import numpy as np, cv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[6]
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
cache = pathlib.Path(__file__).parent / '_work' / f'birefnet-{out.name}'; cache.mkdir(parents=True, exist_ok=True)
for f in out.glob('f-*.png'): f.unlink()
tmp = pathlib.Path(tempfile.mkdtemp())
# 不插帧（#1039）：minterpolate 的运动补偿在快速入画的手上会糊出白团 / 碎块，原始 16 fps 帧是干净的。
# 页面按 t 取最近的原始帧（16 fps，相当于动画「一拍二」），没有插帧伪影。
FPS = 16
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), str(tmp / 'r-%03d.png')], check=True)
files = sorted(tmp.glob('r-*.png'))
W, H = 832, 1248
rgbs = [np.asarray(Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS)) for f in files]

# ---- 2. BiRefNet ----
def birefnet(i, img):
    c = cache / f'a-{i:03d}.png'
    if not c.exists():
        p = tmp / f'in-{i:03d}.png'; Image.fromarray(img).save(p)
        subprocess.run(['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'cutout', str(p), '-o', str(c)], check=True, capture_output=True)
    return np.asarray(Image.open(c).convert('RGBA'))[..., 3].astype(np.float32) / 255
def hsv(img): return [c.astype(np.float32) for c in cv2.split(cv2.cvtColor(img, cv2.COLOR_RGB2HSV))]

# ---- 2b. 本地抠白底（--local）：显卡被别人的视频任务占着时不用排队等 BiRefNet。
#   和画面边框连通的近白 = 背景；被人物围住的近白块（手指缝、甩开的头发丝之间）也算背景，但脸里面的不动（眼白、牙）。
def local_alpha(i, img):
    h, s, v = hsv(img)
    white = ((s < 26) & (v >= 232)).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(white, connectivity=4)
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]]); border = border[border > 0]
    bg = np.isin(lab, border)
    skin = ((h >= 5) & (h <= 20) & (s > 28) & (s < 120) & (v > 205)).astype(np.uint8)
    skin = cv2.morphologyEx(skin, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n2, lab2, st2, cen2 = cv2.connectedComponentsWithStats(skin, connectivity=8)
    face = None
    cand = [k for k in range(1, n2) if st2[k, cv2.CC_STAT_AREA] > 9000 and cen2[k][1] < 0.5 * img.shape[0]]
    if cand:
        k = max(cand, key=lambda k: st2[k, cv2.CC_STAT_AREA]); x, y, w, hh = st2[k, :4]
        face = (x - 0.25 * w, y - 0.8 * hh, x + 1.25 * w, y + 1.05 * hh)   # 往上多留一截：额头上的护目镜镜片有白色高光，不能当白底挖掉
    for k in range(1, n):
        if k in border or st[k, cv2.CC_STAT_AREA] < 12: continue        # 甩开的头发丝之间的白缝很细，门槛放低（脸和额头护目镜那一块不在这条规则里）
        cx, cy = cen[k]
        if face and face[0] <= cx <= face[2] and face[1] <= cy <= face[3]: continue
        bg |= lab == k
    # 白边：快速甩动的头发 / 衣服边缘和白底混出一圈浅色（不够白，上面那条规则抓不到）。从背景往里长：
    # 贴着背景、偏亮、不饱和的像素也算背景（脸和额头护目镜那一块不长，镜片本身就是浅灰）
    pale = (s < 62) & (v >= 188)
    if face:
        x0, y0, x1, y1 = [int(max(0, t)) for t in face]; pale[y0:y1, x0:x1] = False
    k3 = np.ones((3, 3), np.uint8); bg0 = bg.copy()
    for _ in range(14):
        grow = (cv2.dilate(bg.astype(np.uint8), k3) > 0) & pale & ~bg
        if not grow.any(): break
        bg |= grow
    # 长进去的部分如果是人物里面的细缝（衣服上的浅色条纹、口袋的灰边被顺着挖出一道黑线），补回来：只留「开口够宽」的那些
    fg = (~bg).astype(np.uint8)
    closed = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)) > 0
    bg &= ~(closed & ~bg0)
    a = cv2.GaussianBlur((~bg).astype(np.float32), (0, 0), 0.9)
    return np.clip((a - 0.25) / 0.6, 0, 1)

LOCAL = '--local' in sys.argv
alphas = [(local_alpha if LOCAL else birefnet)(i, im) for i, im in enumerate(rgbs)]
print('alpha done', len(alphas), 'local' if LOCAL else 'birefnet')

def exterior(a, thr=0.5):
    """与画面边框连通的透明区 = 真背景；其余透明区都是人物内部的洞"""
    t = (a < thr).astype(np.uint8)
    n, lab = cv2.connectedComponents(t, connectivity=4)
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    return np.isin(lab, border[border > 0])

def fill_holes(a, a_ref, keep):
    """人物轮廓内部一律不透明：不和外部背景连通的低 alpha 区域，恢复成 BiRefNet 原值；keep（镜片）除外"""
    inner = ~exterior(a, 0.5)
    hole = inner & (a < 0.98) & ~keep
    a = a.copy(); a[hole] = np.maximum(a[hole], a_ref[hole])
    return a

def clean(img, a):
    a = a.copy()
    # 3. 只留主体
    m = (a > 0.5).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
    if n > 2:
        big = st[1:, cv2.CC_STAT_AREA].max()
        keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] >= 0.03 * big]
        near = cv2.dilate(np.isin(lab, keep).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        a[~near] = 0
    # 4. 透出来的白底
    h, s, v = hsv(img)
    a0 = a.copy()
    ext_near = cv2.dilate(exterior(a).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    whiteish = (s < 22) & (v >= 236) & (a > 0.05)
    lensgray = (s < 30) & (v >= 190) & (v < 236)
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(whiteish.astype(np.uint8), connectivity=4)
    highlight = np.zeros_like(whiteish)
    holes = np.zeros_like(whiteish)
    for i in range(1, n2):
        if st2[i, cv2.CC_STAT_AREA] <= 120: continue
        x, y, w, hh = st2[i, :4]; x0, y0 = max(0, x - 4), max(0, y - 4)
        comp = (lab2[y0:y + hh + 4, x0:x + w + 4] == i).astype(np.uint8)
        ring = (cv2.dilate(comp, np.ones((7, 7), np.uint8)) > 0) & (comp == 0)
        # 一圈大半是镜片灰 = 镜片上的白色高光，保留；否则是透出来的白底
        if lensgray[y0:y + hh + 4, x0:x + w + 4][ring].mean() > 0.5: highlight[y0:y + hh + 4, x0:x + w + 4] |= comp > 0
        # 只有「贴着外部背景」或「BiRefNet 自己也认为半透明」的白块才是透出来的白底；
        # 脸和身体内部的白（眼白、牙、高光、白描边）BiRefNet 给的是实心，一律保留（#1039 眼白被挖掉的修正）
        elif (ext_near[y0:y + hh + 4, x0:x + w + 4][comp > 0].any() or a0[y0:y + hh + 4, x0:x + w + 4][comp > 0].mean() < 0.6
              or x == 0 or y == 0 or x + w >= img.shape[1] or y + hh >= img.shape[0]):   # 贴着画面边框的白 = 白底
            holes[y0:y + hh + 4, x0:x + w + 4] |= comp > 0
    a[holes] = 0
    # 护目镜镜片：不饱和、偏亮（浅灰，是灰镜片 × 白底），面积大的连通块；按灰镜片 G=150 反推透明度
    # 只取浅灰（v ≥ 205），灰色镜框（更暗）不算；最透也留 60%，保住「浅灰玻璃」的样子，不变成深色墨镜
    lens = (s < 30) & (v >= 205) & (v < 236) & (a > 0.3)
    n3, lab3, st3, _ = cv2.connectedComponentsWithStats(lens.astype(np.uint8), connectivity=4)
    lens = np.isin(lab3, [i for i in range(1, n3) if st3[i, cv2.CC_STAT_AREA] > 1500])
    lens[:] = False   # 副歌 4（#1052）：护目镜一直在额头上（后面是头发，不是白底），镜片保持实心，不做半透明反推
    G = 110.0
    la = np.clip((255 - v) / (255 - G), 0.6, 1.0)
    a[lens] = np.minimum(a[lens], la[lens])
    # 手快速入画时指尖被糊成一团发白的拖影：轮廓 20px 以内（镜片和镜片高光除外）、不饱和且很亮的像素按白的程度降 alpha
    solid = (a > 0.5).astype(np.uint8)
    # 画框外当背景（默认腐蚀把框外当前景，贴着画框的手就永远算不上「轮廓附近」）
    rim = (solid > 0) & (cv2.erode(solid, np.ones((41, 41), np.uint8), borderType=cv2.BORDER_CONSTANT, borderValue=0) == 0)   # 轮廓 20px 以内
    smear = rim & (s < 40) & (v > 228) & ~highlight & ~lens
    wf = np.clip((v - 228) / 22, 0, 1) * np.clip((40 - s) / 25, 0, 1)
    a[smear] *= 1 - wf[smear]
    LENS.append(lens | highlight)
    return a

LENS = []
raw_alphas = alphas
alphas = [clean(im, a) for im, a in zip(rgbs, alphas)]
# 5. 时间平滑：三帧中值
A = np.stack(alphas)
Am = A.copy(); med = np.median(np.stack([A[:-2], A[1:-1], A[2:]]), axis=0)
# 只在三帧都接近的像素上平滑（去边缘闪）；真在动的地方（手）不动，免得拖影或吃掉手指
steady = (np.max(np.stack([A[:-2], A[1:-1], A[2:]]), axis=0) - np.min(np.stack([A[:-2], A[1:-1], A[2:]]), axis=0)) < 0.35   # #1052：三帧都接近才平滑。原来只比前后两帧，甩头发时「前后都是头发、中间这帧是白底」会被中值填回成白块
Am[1:-1] = np.where(steady, med, A[1:-1])
# 填洞：轮廓内部（眼白、牙、高光…）一律不透明，只有镜片保留半透明
Am = np.stack([fill_holes(Am[i], raw_alphas[i], LENS[i]) for i in range(len(Am))])

def finish(img, a):
    img = img.astype(np.float32)
    # 6a. 收边 1px（只收外轮廓，镜片的半透明不动）
    solid = (a > 0.5).astype(np.uint8)
    er = cv2.erode(solid, np.ones((3, 3), np.uint8))
    # 收边 / 去白边只作用在外轮廓 3px 带内（与画面边框连通的背景旁边），脸和身体内部不碰
    outer = cv2.dilate(exterior(a, 0.5).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
    edge = (solid > 0) & (er == 0) & outer
    a = a.copy(); a[edge] *= 0.55
    a[(solid == 0) & (a < 0.5)] *= 0.5
    # 6b. 反预乘白底
    aa = np.maximum(a, 1e-3)[..., None]
    un = np.clip((img - (1 - aa) * 255) / aa, 0, 255)
    # alpha 太小的像素反预乘会被算成负数、截成黑点（镜片 / 镜框边一圈黑麻点），只对 a ≥ 0.35 做
    col = np.where(((a >= 0.35) & outer)[..., None], un, img)
    # 6c. 边缘带颜色换成内部扩散色（normalized convolution）
    inner = cv2.erode(solid, np.ones((5, 5), np.uint8)).astype(np.float32)
    k = (9, 9)
    num = cv2.blur(col * inner[..., None], k); den = cv2.blur(inner, k)[..., None]
    spread = np.where(den > 1e-3, num / np.maximum(den, 1e-3), col)
    band = (((solid > 0) & (inner == 0)) | ((a > 0.02) & (solid == 0))) & outer
    keep_lens = (a > 0.2) & (a < 0.95) & (inner > 0)
    col[band & ~keep_lens] = spread[band & ~keep_lens]
    return np.dstack([np.clip(col, 0, 255).astype(np.uint8), (np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8)])

for i, (im, a) in enumerate(zip(rgbs, Am)):
    Image.fromarray(finish(im, a)).save(out / f'f-{i:03d}.png')

json.dump({'src': str(src), 'fps': FPS, 'frames': len(files), 'size': [W, H], 'matte': ('本地抠白底' if LOCAL else 'birefnet') + ' + 三帧中值 + 收边去白边（c4/i2v/prep.py，改自 fresh/i2v-test/_work/prep2.py）'}, open(out / 'meta.json', 'w'), ensure_ascii=False)
print(out, len(files), 'frames')
