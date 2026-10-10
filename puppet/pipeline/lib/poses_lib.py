"""姿势 / 手臂层流水线（pipeline/06_poses/）的公共函数：读配置、读图、配准、背景、外扩、描边转色。
从原型工程的 gen/lib.py 拷贝后改的（2026-10-07，W4）：去掉了写死的工作目录，路径全部来自命令行和角色配置。
函数体里的算法和数值没有改，改了会让重跑结果和现有 kit 对不上。"""
import os, json, io, contextlib
import numpy as np, cv2
from PIL import Image


class Config:
    """角色的姿势配置（configs/<角色>.json）+ 这次运行的目录。
    配置里的素材路径都相对「素材根目录」（--assets）；中间产物、kit 输入 / 输出、检查图的目录全部由命令行给，脚本和配置里不写任何具体工程的路径。"""
    PACK_KEYS = ('shoulders', 'midX')          # 这几个数只存在数据包 character.json 的 host 字段里（讲解员运行时也读它），配置里不再存
    def __init__(self, path, assets, work, kit_in=None, kit_out=None, report=None, pack=None):
        self.path = os.path.abspath(path); self.d = json.load(open(path, encoding='utf-8')); self.assets = os.path.abspath(assets); self.pack = os.path.abspath(pack) if pack else None; self.host = None
        if self.pack:
            self.host = json.load(open(os.path.join(self.pack, 'character.json'), encoding='utf-8')).get('host') or {}
            for k in self.PACK_KEYS:
                if k not in self.host: raise SystemExit(f'数据包 {self.pack} 的 character.json 里 host.{k} 不存在')
                if k in self.d and self.d[k] != self.host[k]: raise SystemExit(f'配置里的 {k} = {self.d[k]} 和数据包 host.{k} = {self.host[k]} 不一致；配置里那份应删掉')
        self.work = os.path.abspath(work)                                           # 中间产物：裁块、高清草稿、整人草稿
        self.kit_in = os.path.abspath(kit_in) if kit_in else None                   # 读：base.png、arms_idle.png（肤色基准）、arms_<tintRef>.png
        self.kit_out = os.path.abspath(kit_out) if kit_out else None                # 写：arms_* / over_* / poses.json
        self.report = os.path.abspath(report) if report else None                   # 检查图
        for q in (self.work, self.kit_out, self.report):
            if q: os.makedirs(q, exist_ok=True)

    def __getitem__(self, k):
        if k in self.PACK_KEYS or k == 'mirrorSum':
            if self.host is None: raise SystemExit(f'这一步要用 {k}，它存在数据包里：请加 --pack <角色数据包目录>')
            return 2 * self.host['midX'] if k == 'mirrorSum' else self.host[k]          # 镜像：x → 2·midX − x
        return self.d[k]
    def get(self, k, default=None): return self.d.get(k, default)
    def a(self, sub): return sub if os.path.isabs(sub) else os.path.join(self.assets, sub)      # 素材根目录下的路径
    def p(self, key): return self.a(self.d['paths'][key])                                          # 配置 paths 里登记的素材
    def pose(self, name):
        if name not in self.d['poses']: raise SystemExit(f'配置里没有姿势 {name}；有的：{", ".join(self.d["poses"])}')
        return self.d['poses'][name]
    def w(self, name): return os.path.join(self.work, name)
    def ki(self, name): return os.path.join(self._need(self.kit_in, '--kit-in'), name)
    def k(self, name): return os.path.join(self._need(self.kit_out, '--kit-out'), name)
    def r(self, name): return os.path.join(self._need(self.report, '--report'), name)
    @staticmethod
    def _need(v, flag):
        if not v: raise SystemExit(f'这一步需要 {flag} <目录>')
        return v
    @property
    def canvas(self): return tuple(self.d['canvas'])       # (宽, 高)，kit 画布


def load(path):
    return np.asarray(Image.open(path).convert('RGB'))

def quiet(f, *a, **k):
    with contextlib.redirect_stdout(io.StringIO()): return f(*a, **k)

def register(src, ref, box=None, name='', full_affine=False):
    """把 src 配准到 ref（相似变换，SIFT + RANSAC）。box=(x0,y0,x1,y1) 只用 ref 这个区域里的特征。返回 (warped, M)。"""
    sift = cv2.SIFT_create(6000)
    m = None
    if box:
        m = np.zeros(ref.shape[:2], np.uint8); m[box[1]:box[3], box[0]:box[2]] = 1
    kr, dr = sift.detectAndCompute(cv2.cvtColor(ref, cv2.COLOR_RGB2GRAY), m)
    ks, ds = sift.detectAndCompute(cv2.cvtColor(src, cv2.COLOR_RGB2GRAY), None)
    mt = cv2.BFMatcher().knnMatch(dr, ds, k=2)
    good = [a for a, b in mt if a.distance < 0.75 * b.distance]
    pr = np.float32([kr[g.queryIdx].pt for g in good]); ps = np.float32([ks[g.trainIdx].pt for g in good])
    est = cv2.estimateAffine2D if full_affine else cv2.estimateAffinePartial2D
    M, inl = est(ps, pr, method=cv2.RANSAC, ransacReprojThreshold=3)
    sc = float(np.hypot(M[0, 0], M[1, 0]))
    print(f'register {name}: matches {len(good)} inliers {int(inl.sum())} scale {sc:.4f} shift ({M[0,2]:.1f},{M[1,2]:.1f})')
    out = cv2.warpAffine(src, M, ref.shape[1::-1], flags=cv2.INTER_LANCZOS4 if sc > 0.95 else cv2.INTER_AREA, borderMode=cv2.BORDER_REPLICATE)
    return out, M

def master(cfg):
    """待机母版（配到设定图上的那张）：所有姿势图都对到它。"""
    return quiet(register, load(cfg.p('idleDraft')), load(cfg.p('master')), tuple(cfg['register']['low']), 'm')[0]

def bg_mask(img, tol=14):
    """与四角连通、颜色接近背景灰的区域 = 背景。"""
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB).astype(np.int16)
    bg = np.median(np.concatenate([lab[:20, :20].reshape(-1, 3), lab[:20, -20:].reshape(-1, 3)]), 0)
    near = (np.abs(lab - bg).sum(-1) < tol * 3).astype(np.uint8)
    n, cc = cv2.connectedComponents(near, connectivity=4)
    keep = set(cc[0, :]) | set(cc[:, 0]) | set(cc[:, -1]) | set(cc[-1, :])
    keep.discard(0) if near[0, 0] == 0 else None
    return np.isin(cc, [k for k in keep if k != 0 or near[0, 0]]) & (near > 0)

def rgba(img, alpha):
    return np.dstack([img, np.clip(alpha * 255 + 0.5, 0, 255).astype(np.uint8)])

def bleed(img, alpha, it=8):
    """把不透明区的颜色往透明区外扩几圈，防止缩小采样时边缘发灰/发白。"""
    img = img.copy(); known = alpha > 0.5
    for _ in range(it):
        k = cv2.dilate(known.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
        blur = cv2.blur(np.where(known[..., None], img, 0).astype(np.float32), (3, 3)); cnt = cv2.blur(known.astype(np.float32), (3, 3))
        new = k & ~known
        img[new] = (blur[new] / np.maximum(cnt[new], 1e-6)[:, None]).astype(np.uint8)
        known = k
    return img

def navy_lines(img, navy=(22, 28, 48)):
    """把红棕色的深色描边换成深藏青（只动暗的、偏红的线，浅粉的腮红 / 膝盖线不动）。"""
    f = img.astype(np.float32); r, g, b = f[..., 0], f[..., 1], f[..., 2]
    lum = (r + g + b) / 3
    w = np.clip((r - b - 18) / 25, 0, 1) * np.clip((150 - lum) / 50, 0, 1)
    w = cv2.GaussianBlur(w, (0, 0), 0.7)[..., None]
    return np.clip(f * (1 - w) + np.array(navy, np.float32) * w, 0, 255).astype(np.uint8)

def chan(im): return [im[..., i].astype(np.int16) for i in range(3)]
def greenish(im): r, g, b = chan(im); return (g > r + 45) & (g > b + 25)
def skinish(im): r, g, b = chan(im); return (r > g + 8) & (g > b - 12) & (r > 175) & ((r + g + b) / 3 > 150)

def font(size=22):
    from PIL import ImageFont
    for f in ('/System/Library/Fonts/STHeiti Medium.ttc', '/System/Library/Fonts/PingFang.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'):
        if os.path.exists(f): return ImageFont.truetype(f, size)
    return ImageFont.load_default()

def cli(argv, usage):
    """公共命令行：<配置.json> <位置参数…> --assets 素材根 --work 目录 [--pack 数据包目录] [--kit-in 目录] [--kit-out 目录] [--report 目录] [其它开关]。
    返回 (cfg, 位置参数, 开关集合, 带值选项)。"""
    VAL = {'--assets', '--work', '--kit-in', '--kit-out', '--report', '--mirror', '--pack'}; pos, flags, opts = [], set(), {}; i = 0
    while i < len(argv):
        a = argv[i]
        if a in VAL: opts[a] = argv[i + 1]; i += 2
        elif a.startswith('--'): flags.add(a); i += 1
        else: pos.append(a); i += 1
    if not pos or '--assets' not in opts or '--work' not in opts: raise SystemExit(usage + '\n必须给：<配置.json> --assets <素材根目录> --work <中间产物目录>')
    return Config(pos[0], opts['--assets'], opts['--work'], opts.get('--kit-in'), opts.get('--kit-out'), opts.get('--report'), opts.get('--pack')), pos[1:], flags, opts
