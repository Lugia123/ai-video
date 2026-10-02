"""千问图像编辑 API（DashScope multimodal-generation）。Key 从环境变量 DASHSCOPE_API_KEY 读，不打印。
用法: set -a; . ~/.config/tts-keys; set +a
      python3 tools/dt/qwen_edit.py --ref a.jpg [--ref b.png] --prompt "..." --out x.png [--model qwen-image-edit-plus] [--n 1] [--seed 1]"""
import argparse, base64, json, os, sys, urllib.request, urllib.error, pathlib, io
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('--ref', action='append', default=[])
ap.add_argument('--prompt', required=True)
ap.add_argument('--negative', default='photorealistic, photo, 3d render, blurry, lowres, deformed hands, extra fingers, text, watermark, logo')
ap.add_argument('--out', required=True)
ap.add_argument('--model', default='qwen-image-edit-plus-2025-12-15')  # 不带日期的别名 qwen-image-edit-plus 在本账号 403
ap.add_argument('--n', type=int, default=1)
ap.add_argument('--seed', type=int, default=None)
ap.add_argument('--size', default=None, help='如 1664*928；无 --ref 时为文生图（模型默认 qwen-image-plus）')
ap.add_argument('--base', default='https://maas.qianwenaiapi.com/api/v1')
a = ap.parse_args()
if not a.ref and a.model.startswith('qwen-image-edit'): a.model = 'qwen-image-plus'

def data_uri(p):
    im = Image.open(p).convert('RGB'); im.thumbnail((1536, 1536))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=92)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

content = [{'image': data_uri(p)} for p in a.ref] + [{'text': a.prompt}]
params = {'n': a.n, 'negative_prompt': a.negative, 'watermark': False, 'prompt_extend': True}
if a.seed is not None: params['seed'] = a.seed
if a.size: params['size'] = a.size
body = {'model': a.model, 'input': {'messages': [{'role': 'user', 'content': content}]}, 'parameters': params}
key = os.environ.get('DASHSCOPE_API_KEY') or sys.exit('DASHSCOPE_API_KEY 未设置')
req = urllib.request.Request(a.base + '/services/aigc/multimodal-generation/generation', data=json.dumps(body).encode(),
                             headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
import time
for attempt in range(8):  # 429 限流：指数退避重试
    try:
        with urllib.request.urlopen(req, timeout=600) as r: res = json.load(r)
        break
    except urllib.error.HTTPError as e:
        if e.code == 429 and attempt < 7:
            time.sleep(min(60, 3 * 2 ** attempt)); continue
        sys.exit(f'HTTP {e.code}: {e.read()[:600].decode(errors="replace")}')
urls = [c['image'] for ch in res['output']['choices'] for c in ch['message']['content'] if 'image' in c]
out = pathlib.Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
for i, u in enumerate(urls):
    dst = out if len(urls) == 1 else out.with_name(f'{out.stem}-{i+1}{out.suffix}')
    urllib.request.urlretrieve(u, dst); print('wrote', dst)
