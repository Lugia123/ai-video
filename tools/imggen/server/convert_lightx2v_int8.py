"""把 lightx2v 的 int8 权重（weight:int8 + weight_scale:[N,1]）补上 ComfyUI 的 comfy_quant 元数据。"""
import json, sys, torch
from safetensors import safe_open
from safetensors.torch import save_file
src, dst = sys.argv[1], sys.argv[2]
out = {}
tag = torch.tensor(list(json.dumps({"format": "int8_tensorwise"}).encode()), dtype=torch.uint8)
with safe_open(src, "pt") as s:
    keys = list(s.keys())
    n = 0
    for k in keys:
        t = s.get_tensor(k)
        if k.endswith(".weight_scale"):
            t = t.float()
        out[k] = t
        if k.endswith(".weight") and t.dtype == torch.int8:
            out[k[:-len(".weight")] + ".comfy_quant"] = tag.clone()
            n += 1
print("int8 layers:", n, "keys:", len(out))
save_file(out, dst)
