"""腾讯混元生3D（API Key 版，https://cloud.tencent.com/document/product/1804/126189）。Key: HY_API_KEY，不打印。
  python3 tools/dt/hy3d.py submit front.png [--left l.png] [--back b.png] [--right r.png] [--model 3.1] [--extra '{"EnablePBR":true}']
  python3 tools/dt/hy3d.py wait <JobId> out_dir"""
import argparse, base64, io, json, os, sys, time, urllib.request, urllib.error, pathlib
from PIL import Image
BASE = 'https://api.ai3d.cloud.tencent.com/v1/ai3d'
KEY = os.environ.get('HY_API_KEY') or sys.exit('HY_API_KEY 未设置')
def call(path, body):
    r = urllib.request.Request(f'{BASE}/{path}', data=json.dumps(body).encode(), headers={'Authorization': KEY, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=120) as f: return json.load(f)
    except urllib.error.HTTPError as e:
        sys.exit(f'HTTP {e.code} {path}: {e.read()[:800].decode(errors="replace")}')
def b64(p):  # 实测：ImageUrl 传 data URI 会 Invalid param；ImageBase64 传裸 base64 可用
    im = Image.open(p).convert('RGB'); im.thumbnail((1024, 1024)); b = io.BytesIO(); im.save(b, 'JPEG', quality=90)
    return base64.b64encode(b.getvalue()).decode()
ap = argparse.ArgumentParser(); ap.add_argument('cmd'); ap.add_argument('a'); ap.add_argument('b', nargs='?')
ap.add_argument('--left'); ap.add_argument('--back'); ap.add_argument('--right'); ap.add_argument('--model', default=''); ap.add_argument('--extra', default='{}')
a = ap.parse_args()
if a.cmd == 'submit':
    body = {'ImageBase64': b64(a.a)}
    if a.model: body['Model'] = a.model
    views = [{'ViewType': k, 'ViewImageBase64': b64(v)} for k, v in (('left', a.left), ('back', a.back), ('right', a.right)) if v]
    if views: body['MultiViewImages'] = views
    body.update(json.loads(a.extra))
    print(json.dumps(call('submit', body), ensure_ascii=False))
elif a.cmd == 'wait':
    out = pathlib.Path(a.b); out.mkdir(parents=True, exist_ok=True)
    while True:
        d = call('query', {'JobId': a.a}); r = d.get('Response', d); st = r.get('Status')
        print('status', st, flush=True)
        if st in ('DONE', 'FAIL', 'FAILED', 'SUCCESS'): break
        time.sleep(10)
    print(json.dumps(r, ensure_ascii=False)[:2000])
    for i, f in enumerate(r.get('ResultFile3Ds') or []):
        u = f.get('Url'); t = (f.get('Type') or 'bin').lower()
        ext = 'zip' if '.zip' in u.split('?')[0] else t
        if u: urllib.request.urlretrieve(u, out / f'result-{i}.{ext}'); print('wrote', out / f'result-{i}.{ext}')
        pu = f.get('PreviewImageUrl')
        if pu: urllib.request.urlretrieve(pu, out / f'preview-{i}.png')
