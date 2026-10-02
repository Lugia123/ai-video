"""背景按深度切层 + 千问补画被遮挡区域（逐层剥离）。
用法:
  set -a; . ~/.config/tts-keys; set +a
  python3 tools/layers/bg_layers.py episodes/mv-pdoom/art/layers/whale-city/scene.json

scene.json（路径相对 scene.json 所在目录）:
  {"src": "../../approved/01-whale-city-2.png",
   "depth_model": "base",
   "layers": [                       # 从最前到最后
     {"name": "03-near-clouds", "rule": "(d>0.6)&cloud&(y>0.68)", "min_area": 4000,
      "remove": "移除……，其余保持完全不变"},   # 除最后一层外都要 remove 提示词
     ...
     {"name": "00-sky"}]}             # 最后一层不透明，不需要 rule
  thin_rule：可选，满足它（且 D>thin_thr）的差异里，宽 < thin_px 的细条和面积 < thin_area 的碎块也并入（天线、电线、晾衣绳）
  fill: "global"：region 规则区内整片换成千问结果（稳健配色后），配合 matte:diff 抠出区内所有与之不同的东西（天空+远云）
  fill: "inpaint"：千问只用来定 mask，补画用 OpenCV 低分辨率 inpaint（天空等平滑背景，避免千问整体换色调）
  matte: "diff"：差分抠像（光雾/发光体用），alpha 取 |原-去除后| 幅度映射 matte_range=[lo,hi]，颜色反预乘
  grow_rule：可选，满足它的差异区中与 rule 命中处相连的整块也并入（滞后阈值）
  seed / model：可选，单层覆盖千问种子和模型（如难删的层用 qwen-image-edit-max）
  某层不写 remove：后一层沿用同一底图（适合 海面 在 天空 前、且海面区域被本层完全盖住的情况）

rule 是 numpy 表达式，可用变量：
  d 深度(0远..1近)  rel 相对本行背景的凸起(d - 本行15分位)  D 千问移除前后的 Lab 差异（仅有 remove 的层）  x,y 归一化坐标(0..1)
  r,g,b,lum,sat (0..1)  cloud 暖白/云色  blue 偏蓝
流程（第 i 层）：
  1. 对当前底图 plate_i 重跑深度（前面的层已被移除，所以本层被遮挡的部分已完整）
  2. 有 remove：千问编辑 plate_i「移除本层」→ ECC 仿射对齐（它常整体平移 ~8px）→
     本层 mask = 前后 Lab 差异 > diff_thr（变量 D）且满足 rule（约束，如只要近处 d>0.5）
     没有 remove：mask = rule
  3. 该层 PNG = plate_i，alpha = mask 膨胀 1px + 羽化
  4. 千问结果局部配色后只在 mask 膨胀区贴回，得 plate_{i+1}
     （可见区域保持原图像素，还原误差只来自羽化边）
千问结果缓存在 _work/remove-<name>.png，删掉即可重抽；--seed 改种子。"""
import argparse, json, os, subprocess, sys, pathlib
import numpy as np, cv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
ap = argparse.ArgumentParser()
ap.add_argument('scene')
ap.add_argument('--seed', type=int, default=7)
ap.add_argument('--feather', type=float, default=1.5)
ap.add_argument('--pad', type=int, default=None, help='四周镜像外扩像素（相机运动余量），默认取 scene.json 的 pad 或 64')
a = ap.parse_args()
scene_p = pathlib.Path(a.scene).resolve(); base = scene_p.parent
cfg = json.loads(scene_p.read_text())
work = base / '_work'; work.mkdir(exist_ok=True)
src = np.asarray(Image.open(base / cfg['src']).convert('RGB'))
H, W = src.shape[:2]

_model = {}
def depth(img):
    import importlib.util, torch
    _fs = importlib.util.find_spec  # 本机 torchaudio 与 torch 不匹配，transformers 探测到就崩；假装它不存在
    importlib.util.find_spec = lambda n, *x, **k: None if n.split('.')[0] == 'torchaudio' else _fs(n, *x, **k)
    from transformers import AutoImageProcessor, AutoModelForDepthEstimation
    dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
    if not _model:
        name = f"depth-anything/Depth-Anything-V2-{cfg.get('depth_model', 'base').capitalize()}-hf"
        _model['p'] = AutoImageProcessor.from_pretrained(name)
        _model['m'] = AutoModelForDepthEstimation.from_pretrained(name).to(dev).eval()
    with torch.no_grad():
        inp = _model['p'](images=Image.fromarray(img), return_tensors='pt')
        dd = _model['m'](**{k: v.to(dev) for k, v in inp.items()}).predicted_depth
    dd = torch.nn.functional.interpolate(dd[:, None], size=(H, W), mode='bicubic', align_corners=False)[0, 0].float().cpu().numpy()
    return (dd - dd.min()) / (dd.max() - dd.min() + 1e-8)

def mask_from_rule(img, d, L, extra={}):
    f = img.astype(np.float32) / 255; r, g, b = f[..., 0], f[..., 1], f[..., 2]
    lum = f.mean(-1); mx, mn = f.max(-1), f.min(-1); sat = (mx - mn) / (mx + 1e-6)
    yy, xx = np.mgrid[0:H, 0:W]; y, x = yy / H, xx / W
    rel = d - np.percentile(d, 15, axis=1, keepdims=True)
    cloud = (r >= b - 0.02) & (lum > 0.6); blue = b > r + 0.05
    m = eval(L['rule'], {'np': np}, dict(d=d, rel=rel, x=x, y=y, r=r, g=g, b=b, lum=lum, sat=sat, cloud=cloud, blue=blue, **extra)).astype(np.uint8)
    # 清理：闭运算连碎片 → 去小连通域 → 填洞
    k = L.get('close', 5)
    if k: m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    if L.get('open', 0): m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (L['open'],) * 2))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros(n, bool); keep[1:] = st[1:, cv2.CC_STAT_AREA] >= L.get('min_area', 500)
    m = keep[lab].astype(np.uint8)
    if L.get('fill_holes', True):
        inv = (1 - m).astype(np.uint8); n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
        border = set(np.unique(np.r_[lab2[0], lab2[-1], lab2[:, 0], lab2[:, -1]]))
        hole = np.isin(lab2, [i for i in range(1, n2) if i not in border and st2[i, cv2.CC_STAT_AREA] < L.get('max_hole', 20000)])
        m[hole] = 1
    return m

def soft(m, grow, feather):
    if grow: m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * grow + 1,) * 2))
    s = m.astype(np.float32)
    return np.clip(cv2.GaussianBlur(s, (0, 0), feather), 0, 1) if feather else s

def qwen_remove(img, prompt, out, seed=None, model=None):
    if not out.exists():
        tmp = work / '_in.png'; Image.fromarray(img).save(tmp)
        sys.path.insert(0, str(ROOT / 'tools/layers')); from edit import edit
        edit(tmp, prompt, seed if seed is not None else a.seed, out, model=model)   # EDIT_ENGINE=dt 时走本机 Draw Things
    return np.asarray(Image.open(out).convert('RGB').resize((W, H), Image.LANCZOS))

def align(raw, ref, valid):
    """ECC 仿射对齐千问输出（它偶尔整体平移/缩放几像素），只用未被移除的区域算。"""
    g1 = cv2.cvtColor(ref, cv2.COLOR_RGB2GRAY).astype(np.float32); g2 = cv2.cvtColor(raw, cv2.COLOR_RGB2GRAY).astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, 1e-5)
    def run(mode):
        try: return cv2.findTransformECC(g1, g2, np.eye(2, 3, dtype=np.float32), mode, crit, valid.astype(np.uint8), 5)[1]
        except cv2.error as e: print('  ECC 失败:', e); return None
    warp = run(cv2.MOTION_AFFINE)
    # 大面积被移除时（如整团积云）仿射会发散出剪切/缩放；千问的偏移实际只有平移，不合理就退回纯平移
    if warp is None or np.abs(warp[:, :2] - np.eye(2)).max() > 0.02 or np.abs(warp[:, 2]).max() > 30:
        print('  仿射不合理，改用纯平移', None if warp is None else np.round(warp, 3).tolist())
        warp = run(cv2.MOTION_TRANSLATION)
        if warp is None or np.abs(warp[:, 2]).max() > 30: warp = np.eye(2, 3, dtype=np.float32)
    return cv2.warpAffine(raw, warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE), warp

def color_match(raw, ref, fill):
    """在补画区外一圈环带里，按通道线性拟合 raw→ref，消除千问的整体偏色。"""
    ring = (cv2.dilate(fill, np.ones((41, 41), np.uint8)) > 0) & (fill == 0)
    out = raw.astype(np.float32)
    for c in range(3):
        x, y = raw[..., c][ring].astype(np.float32), ref[..., c][ring].astype(np.float32)
        k = np.clip(np.cov(x, y)[0, 1] / (x.var() + 1e-6), 0.8, 1.25); off = y.mean() - k * x.mean()
        out[..., c] = out[..., c] * k + off
    return np.clip(out, 0, 255).astype(np.uint8)

def diff_mask(raw, ref):
    l1 = cv2.cvtColor(cv2.GaussianBlur(ref, (0, 0), 3), cv2.COLOR_RGB2LAB).astype(np.float32)
    l2 = cv2.cvtColor(cv2.GaussianBlur(raw, (0, 0), 3), cv2.COLOR_RGB2LAB).astype(np.float32)
    return np.linalg.norm(l1 - l2, axis=-1)

PAD = a.pad if a.pad is not None else cfg.get('pad', 64)
layers = cfg['layers']; plate = src.copy(); out_layers = []
for i, L in enumerate(layers):
    last = i == len(layers) - 1
    print(f'[{L["name"]}]')
    d = depth(plate)
    Image.fromarray((d * 255).astype(np.uint8)).save(work / f'depth-{L["name"]}.png')
    raw = None
    if last:
        m = np.ones((H, W), np.uint8)
    elif L.get('remove'):
        # 有 remove：千问移除本层 → 对齐 → 前后差异 = 本层 mask（rule 只作约束，比颜色/深度阈值干净得多）
        raw0 = qwen_remove(plate, L['remove'], work / f'remove-{L["name"]}.png', L.get('seed'), L.get('model'))
        raw, _ = align(raw0, plate, np.ones((H, W), np.uint8))   # 先粗对齐，找出变化区，再只用不变区精对齐
        rough = (diff_mask(raw, plate) > L.get('diff_thr', 25)).astype(np.uint8)
        raw, warp = align(raw0, plate, 1 - cv2.dilate(rough, np.ones((31, 31), np.uint8)))
        print('  ECC warp', np.round(warp, 3).tolist())
        thr = L.get('diff_thr', 25); D = diff_mask(raw, plate)
        m = mask_from_rule(plate, d, dict(L, rule=f"(D>{thr})&({L.get('rule', 'True')})"), extra=dict(D=D))
        if L.get('grow_rule'):  # 滞后阈值：满足 grow_rule 的差异区里，凡与种子相连的整块并入（云顶等深度偏远的部分）
            reg = mask_from_rule(plate, d, dict(L, rule=f"(D>{thr})&({L['grow_rule']})", min_area=0), extra=dict(D=D))
            n, lab = cv2.connectedComponents(reg, connectivity=8)
            m = (np.isin(lab, np.unique(lab[(m > 0) & (lab > 0)])) | (m > 0)).astype(np.uint8)
        if L.get('thin_rule'):  # 细物：满足 thin_rule 的差异区里，被 thin_px 开运算抹掉的细条 + 面积 < thin_area 的碎块（天线/电线/晾衣绳）
            t = ((D > L.get('thin_thr', 14)) & eval(L['thin_rule'], {'np': np}, dict(y=np.mgrid[0:H, 0:W][0] / H, x=np.mgrid[0:H, 0:W][1] / W, d=d))).astype(np.uint8)
            k = L.get('thin_px', 9)
            thin = t & (1 - cv2.morphologyEx(t, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))))
            n, lab, st, _ = cv2.connectedComponentsWithStats(t, 8)
            small = (st[:, cv2.CC_STAT_AREA] < L.get('thin_area', 3000))[lab] & (lab > 0)
            near = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * L.get('thin_near', 80) + 1,) * 2)) > 0
            m = (m | ((thin | small) & near)).astype(np.uint8)  # 只要主体附近的，远处零碎差异多半是千问重画的云
            m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    else:
        m = mask_from_rule(plate, d, L)
    alpha = np.ones((H, W), np.float32) if last else soft(m, L.get('grow', 1), a.feather)
    color = plate
    if raw is not None and L.get('fill') == 'inpaint':
        # 平滑背景（天空渐变）：千问只用来定 mask，补画改用 OpenCV 在 1/4 分辨率 inpaint，颜色从周边原图延续，不会整体偏色
        hole = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
        sm = cv2.resize(plate, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
        hm = (cv2.resize(hole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST) > 0).astype(np.uint8)
        filled = cv2.inpaint(sm, hm, 12, cv2.INPAINT_TELEA)
        filled = cv2.GaussianBlur(filled, (0, 0), 2)
        up = cv2.resize(filled, (W, H), interpolation=cv2.INTER_CUBIC)
        hs = soft(hole, 0, 6)[..., None]
        raw = (plate * (1 - hs) + up * hs + 0.5).astype(np.uint8)
        fill = hole
    elif raw is not None and L.get('fill') == 'global':
        # 整片替换（天空）：规则区内全部用千问的结果，先用「差异最小的 30% 像素」稳健拟合各通道线性配色，再在区内做差分抠像
        region = eval(L.get('region', 'True'), {'np': np}, dict(y=np.mgrid[0:H, 0:W][0] / H, x=np.mgrid[0:H, 0:W][1] / W))
        region = region if isinstance(region, np.ndarray) else np.ones((H, W), bool)
        dd = np.linalg.norm(plate.astype(np.float32) - raw.astype(np.float32), axis=-1)
        pick = region & (dd <= np.percentile(dd[region], 30))
        out = raw.astype(np.float32)
        for c in range(3):
            A = np.stack([raw[..., c][pick].astype(np.float32), np.ones(pick.sum())], 1)
            k, b = np.linalg.lstsq(A, plate[..., c][pick].astype(np.float32), rcond=None)[0]
            out[..., c] = out[..., c] * k + b
        rs = cv2.GaussianBlur(region.astype(np.float32), (0, 0), 12)[..., None]
        raw = np.clip(plate * (1 - rs) + out * rs, 0, 255).astype(np.uint8)
        m = (region & (np.linalg.norm(plate.astype(np.float32) - raw.astype(np.float32), axis=-1) > L.get('diff_thr', 25))).astype(np.uint8)
        fill = (rs[..., 0] > 0.01).astype(np.uint8)
    elif raw is not None:
        fill = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * L.get('fill_grow', L.get('grow', 1) + 3) + 1,) * 2))
        raw = color_match(raw, plate, fill)
    if raw is not None and L.get('matte') == 'diff':
        # 差分抠像（光雾/发光体）：alpha = 逐像素 |plate - clean| 的幅度，颜色反预乘 → 半透明边缘干净，叠回仍精确
        lo, hi = L.get('matte_range', [6, 60])
        dp = np.linalg.norm(plate.astype(np.float32) - raw.astype(np.float32), axis=-1)
        region = soft(cv2.dilate(m, np.ones((25, 25), np.uint8)), 0, 6) if L.get('fill') != 'global' else fill.astype(np.float32)
        alpha = np.clip((dp - lo) / (hi - lo), 0, 1) * region
        alpha = cv2.GaussianBlur(alpha, (0, 0), 0.7)
        a3 = np.maximum(alpha, 1e-3)[..., None]
        color = np.clip((plate - (1 - a3) * raw) / a3, 0, 255).astype(np.uint8)
        color[alpha < 0.01] = plate[alpha < 0.01]
        fill = (region > 0.01).astype(np.uint8)
    rgba = np.dstack([color, (alpha * 255 + 0.5).astype(np.uint8)])
    if PAD: rgba = cv2.copyMakeBorder(rgba, PAD, PAD, PAD, PAD, cv2.BORDER_REFLECT)  # 云/海/天镜像外扩看不出来；真要大幅摇镜再用千问外扩
    Image.fromarray(rgba).save(base / f'{L["name"]}.png')
    Image.fromarray(m * 255).save(work / f'mask-{L["name"]}.png')
    # 每层深度图（给 addDepthLayer 等位移用）：本步底图的深度，层外用最近的层内值外推，16-bit，与层 PNG 同尺寸（含 pad）
    from scipy.ndimage import distance_transform_edt
    inside = alpha > 0.5 if not last else np.ones((H, W), bool)
    idx = distance_transform_edt(~inside, return_distances=False, return_indices=True)
    dl = d[idx[0], idx[1]]
    lo_, hi_ = float(dl[inside].min()), float(dl[inside].max())
    dimg = (dl * 65535).astype(np.uint16)
    if PAD: dimg = cv2.copyMakeBorder(dimg, PAD, PAD, PAD, PAD, cv2.BORDER_REFLECT)
    cv2.imwrite(str(base / f'{L["name"]}.depth.png'), dimg)
    ys, xs = np.nonzero(m)
    out_layers.append(dict(name=L['name'], file=f'{L["name"]}.png', depth_file=f'{L["name"]}.depth.png', depth_range=[round(lo_, 4), round(hi_, 4)],
                           mask=m, d_med=float(np.median(d[m > 0])),
                           bbox=[int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]))
    if last or raw is None: continue  # 不写 remove：后一层沿用同一底图
    fs = soft(fill, 0, 3)[..., None]
    plate = (plate * (1 - fs) + raw * fs + 0.5).astype(np.uint8)
    Image.fromarray(plate).save(work / f'plate-after-{L["name"]}.png')

# ---- layers.json：默认相机（竖直 fov，参考层在 z=0 缩放 1）----
fov = cfg.get('fov', 35.0); D = (H / 2) / np.tan(np.radians(fov / 2))   # 世界单位 = 原图像素
ref_i = next(i for i, L in enumerate(layers) if L.get('ref'))
d_ref = out_layers[ref_i]['d_med']
res = []
for i, (L, o) in enumerate(zip(layers, out_layers)):
    if 'z' in L: z = float(L['z'])
    else:  # Depth Anything 是相对视差：距离 ∝ 1/视差，限制在 0.5–4 倍参考距离
        ratio = float(np.clip((d_ref + 0.05) / (o['d_med'] + 0.05), 0.5, 4.0)); z = -D * (ratio - 1)
    res.append(dict(name=o['name'], file=o['file'], depth_file=o['depth_file'], depth_range=o['depth_range'], order=len(layers) - 1 - i, depth_median=round(o['d_med'], 3),
                    bbox=o['bbox'], z=round(z, 1), scale=round((D - z) / D, 4)))
res.reverse()
json.dump(dict(src=cfg['src'], size=[W, H], pad=PAD, camera=dict(fov=fov, z=round(float(D), 1), note='PerspectiveCamera 在 (0,0,z) 看向原点；世界单位=原图像素；每层 PNG 四周各外扩 pad 像素，是以原点为中心的 (W+2pad)×(H+2pad) 平面，放在 z 处、乘 scale 后在默认相机下与原画像素对齐'),
               layers=res), open(base / 'layers.json', 'w'), ensure_ascii=False, indent=1)
print('wrote', base / 'layers.json')
