"""本机深度估计：Depth Anything V2（transformers，MPS）。
用法: python3 tools/layers/depth.py in.png out-depth.png [--model base|small|large]
输出 16-bit 灰度 PNG，值越大越近（相对深度，已归一化到 0..65535），同时写 out-depth.npy (float32, 0..1)。"""
import argparse, sys, importlib.util, numpy as np, torch
# 本机 torchaudio 与 torch 版本不匹配，transformers 探测到它就会加载崩溃；假装它不存在
_fs = importlib.util.find_spec
importlib.util.find_spec = lambda n, *a, **k: None if n.split('.')[0] in ('torchaudio',) else _fs(n, *a, **k)
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForDepthEstimation  # 不用 pipeline：它会连带导入 torchaudio（本机版本不匹配）

ap = argparse.ArgumentParser()
ap.add_argument('inp'); ap.add_argument('out')
ap.add_argument('--model', default='base', choices=['small', 'base', 'large'])
a = ap.parse_args()
dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
name = f'depth-anything/Depth-Anything-V2-{a.model.capitalize()}-hf'
proc = AutoImageProcessor.from_pretrained(name)
model = AutoModelForDepthEstimation.from_pretrained(name).to(dev).eval()
im = Image.open(a.inp).convert('RGB')
with torch.no_grad():
    d = model(**{k: v.to(dev) for k, v in proc(images=im, return_tensors='pt').items()}).predicted_depth
d = torch.nn.functional.interpolate(d[None] if d.dim() == 3 else d[None, None], size=im.size[::-1], mode='bicubic', align_corners=False)[0, 0]
d = d.float().cpu().numpy()
d = (d - d.min()) / (d.max() - d.min() + 1e-8)
np.save(a.out.rsplit('.', 1)[0] + '.npy', d.astype(np.float32))
Image.fromarray((d * 65535).astype(np.uint16)).save(a.out)
print('wrote', a.out, 'device', dev)
