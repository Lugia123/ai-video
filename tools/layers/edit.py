"""图像编辑引擎统一入口：千问 API（默认）或本机 Draw Things（EDIT_ENGINE=dt）。
edit(ref, prompt, seed, out) → 把结果写到 out，尺寸与 ref 相同。
- qwen：tools/dt/qwen_edit.py（Key 走环境变量，429 自动重试）
- none：干跑，直接返回原图（不写正式缓存）
- dt：tools/dt/gen.py（固定 qwen_image_edit_2511_q6p + 无 LoRA，单并发、一张几分钟）。
  gen.py 会把 init 图等比缩放后补白到 w×h，这里按同样的算法裁回、缩放回原尺寸。"""
import os, subprocess, sys, pathlib
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[2]

def edit(ref, prompt, seed, out, engine=None, model=None):
    out = pathlib.Path(out)
    if out.exists(): return out
    engine = engine or os.environ.get('EDIT_ENGINE', 'qwen')
    W, H = Image.open(ref).size
    if engine == 'none':  # 干跑：API 不可用时用原图顶替，只为验证分区/姿势流程，产物不能交付
        Image.open(ref).convert('RGB').save(out.with_suffix('.dryrun.png')); return out.with_suffix('.dryrun.png')
    if engine == 'dt':
        s = min(1.0, 1280 / max(W, H)); w, h = [max(64, round(v * s / 64) * 64) for v in (W, H)]  # DT 要求 64 的倍数
        tmp = out.with_suffix('.dtraw.png')
        subprocess.run([sys.executable, str(ROOT / 'tools/dt/gen.py'), '--ref', str(ref), '--prompt', prompt,
                        '--seed', str(seed), '--w', str(w), '--h', str(h), '--out', str(tmp)], check=True)
        k = min(w / W, h / H); iw, ih = round(W * k), round(H * k); x0, y0 = (w - iw) // 2, (h - ih) // 2
        Image.open(tmp).convert('RGB').crop((x0, y0, x0 + iw, y0 + ih)).resize((W, H), Image.LANCZOS).save(out)
    else:
        subprocess.run([sys.executable, str(ROOT / 'tools/dt/qwen_edit.py'), '--ref', str(ref), '--prompt', prompt,
                        '--seed', str(seed), '--out', str(out)] + (['--model', model] if model else []), check=True)
    return out
