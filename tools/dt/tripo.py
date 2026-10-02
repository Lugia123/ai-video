"""Tripo v3 OpenAPI 小工具（https://developers.tripo3d.ai/zh/docs/quick-start）。Key: TRIPO_API_KEY（~/.config/tts-keys），不打印。
  python3 tools/dt/tripo.py upload a.png                     -> file_token
  python3 tools/dt/tripo.py post /generation/image-to-model '{"file_token":"..","model":"P1-20260311","texture":true}'
  python3 tools/dt/tripo.py wait <task_id> [out.glb]          -> 轮询到结束，下载 model_url
  python3 tools/dt/tripo.py get /path"""
import json, os, sys, time, urllib.request, urllib.error, uuid, pathlib
BASE = 'https://openapi.tripo3d.ai/v3'
KEY = os.environ.get('TRIPO_API_KEY') or sys.exit('TRIPO_API_KEY 未设置')
def req(method, path, body=None, headers=None, data=None):
    h = {'Authorization': 'Bearer ' + KEY}; h.update(headers or {})
    if body is not None: data = json.dumps(body).encode(); h['Content-Type'] = 'application/json'
    r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=300) as f: return json.load(f)
    except urllib.error.HTTPError as e:
        sys.exit(f'HTTP {e.code} {path}: {e.read()[:800].decode(errors="replace")}')
def upload(p):
    b = uuid.uuid4().hex; p = pathlib.Path(p)
    data = (f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="{p.name}"\r\nContent-Type: image/png\r\n\r\n').encode() + p.read_bytes() + f'\r\n--{b}--\r\n'.encode()
    return req('POST', '/files', headers={'Content-Type': f'multipart/form-data; boundary={b}'}, data=data)
def wait(tid, out=None):
    while True:
        d = req('GET', f'/tasks/{tid}'); t = d.get('data', d)
        st = t.get('status'); print('status', st, t.get('progress'), flush=True)
        if st in ('success', 'failed', 'cancelled', 'banned'): break
        time.sleep(8)
    print(json.dumps(t, ensure_ascii=False)[:1500])
    url = (t.get('output') or {}).get('model_url')
    if out and url:
        urllib.request.urlretrieve(url, out); print('wrote', out)
    img = (t.get('output') or {}).get('rendered_image_url')
    if out and img: urllib.request.urlretrieve(img, str(out) + '.preview.webp')
cmd = sys.argv[1]
if cmd == 'upload': print(json.dumps(upload(sys.argv[2])))
elif cmd == 'post': print(json.dumps(req('POST', sys.argv[2], json.loads(sys.argv[3]))))
elif cmd == 'get': print(json.dumps(req('GET', sys.argv[2])))
elif cmd == 'wait': wait(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
