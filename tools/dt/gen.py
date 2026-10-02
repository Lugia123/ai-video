"""Draw Things HTTP API 出图（Qwen Image Edit 2511）。
用法: python3 tools/dt/gen.py --prompt "..." --out a.png [--ref ref.jpg] [--w 1024 --h 1024] [--seed 1] [--steps 30] [--cfg 4]
总是显式指定模型并清空 LoRA，不依赖 Draw Things 界面上的当前设置。"""
import argparse, base64, json, sys, urllib.request, urllib.error, pathlib

ap = argparse.ArgumentParser()
ap.add_argument('--prompt', required=True)
ap.add_argument('--negative', default='photo, photorealistic, 3d render, blurry, lowres, extra fingers, deformed, text, watermark, logo, nsfw')
ap.add_argument('--out', required=True)
ap.add_argument('--ref', action='append', default=[])
ap.add_argument('--w', type=int, default=1024)
ap.add_argument('--h', type=int, default=1024)
ap.add_argument('--seed', type=int, default=1)
ap.add_argument('--steps', type=int, default=30)
ap.add_argument('--cfg', type=float, default=4.0)
ap.add_argument('--strength', type=float, default=1.0)
ap.add_argument('--model', default='qwen_image_edit_2511_q6p.ckpt')
ap.add_argument('--host', default='http://127.0.0.1:7860')
a = ap.parse_args()

body = {
    'prompt': a.prompt, 'negative_prompt': a.negative, 'model': a.model, 'loras': [], 'controls': [],
    'width': a.w, 'height': a.h, 'seed': a.seed, 'steps': a.steps, 'guidance_scale': a.cfg,
    'batch_count': 1, 'batch_size': 1,
}
if a.ref:
    import io
    from PIL import Image
    def png_b64(p):  # Draw Things 要求 init_images 为 PNG 且尺寸与 width/height 完全一致：等比缩放后白边补齐
        im = Image.open(p).convert('RGB')
        im.thumbnail((a.w, a.h), Image.LANCZOS)
        canvas = Image.new('RGB', (a.w, a.h), (245, 243, 238))
        canvas.paste(im, ((a.w - im.width) // 2, (a.h - im.height) // 2))
        buf = io.BytesIO(); canvas.save(buf, 'PNG')
        return base64.b64encode(buf.getvalue()).decode()
    body['init_images'] = [png_b64(p) for p in a.ref]
    body['strength'] = a.strength
    ep = '/sdapi/v1/img2img'
else:
    ep = '/sdapi/v1/txt2img'
req = urllib.request.Request(a.host + ep, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=1800) as r:
        res = json.load(r)
except urllib.error.HTTPError as e:
    sys.exit(f'HTTP {e.code}: {e.read()[:500]!r}')
imgs = res.get('images') or []
if not imgs:
    sys.exit('no image returned: ' + json.dumps(res)[:500])
out = pathlib.Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(base64.b64decode(imgs[0]))
print('wrote', out)
