#!/usr/bin/env python3
"""局域网生图服务的图生视频客户端（片段流水线的「提交生成」这一步）。模型推理在服务那头，本机只发请求、等结果、存视频。

    IMGGEN_URL=http://<主机>:<端口> IMGGEN_TOKEN=<令牌> /usr/bin/python3 pipeline/clips/imggen.py health
    … imggen.py i2v --image 首帧.png [--end 尾帧.png] --prompt-file p.txt [--negative-file n.txt] --frames 49 --width 832 --height 1104
                    --seed 1 --tier draft|final --out raw.mp4 --record take-gen.json [--wait-idle [秒]]

    … imggen.py wait --for image|video        # 等对方那一类的队列清空（见下面的排队规矩）

地址和令牌只从环境变量读，没有就退出（不猜、不回落到别处）。一次只提交一段，等它跑完才返回。
排队规矩：服务上视频和生图（含抠图 /cutout）是两类模型，换一次要卸载 / 重载十几秒。所以**同类请求连着发，异类请求等对方队列清空**：
  提交视频前默认先等生图那边没有在跑、在排的请求；发抠图那一批之前先 `wait --for image`（等视频任务都跑完），然后连着发完。
取回：服务返回什么格式就按什么存——视频（现在是 H.264 yuv420p，有损、色度半分辨率）存成 .mp4 / .mkv…，逐帧 PNG 的压缩包解成一个目录。
--wait-idle：先等服务空下来（没有在跑 / 在排的任务，而且连续空了 --calm 秒，默认 90）再提交，不插别人的队；给了秒数就是最多等这么久。
--record：把这一段的事实记下来——提示词原文、反向提示词、种子、档位、帧数、尺寸、模型、服务端生成耗时、排队时间、显存峰值、本机总等待。
只用标准库，哪个 python 都能跑（有的环境里 conda 的 python 连局域网不稳，用系统自带的）。"""
import argparse, base64, json, os, sys, time, urllib.error, urllib.request


def call(path, payload=None, method=None, timeout=120):
    url, tok = os.environ.get('IMGGEN_URL'), os.environ.get('IMGGEN_TOKEN')
    if not url or (not tok and path != '/health'): raise SystemExit('要先设环境变量 IMGGEN_URL 和 IMGGEN_TOKEN')
    req = urllib.request.Request(url.rstrip('/') + path, method=method or ('POST' if payload is not None else 'GET'))
    if path != '/health': req.add_header('Authorization', 'Bearer ' + tok)
    if payload is not None: req.data = json.dumps(payload).encode(); req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r: return r.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f'HTTP {e.code}：{e.read().decode(errors="replace")[:1500]}')


def health(): return json.loads(call('/health'))
def busy(h): return bool(h.get('busy')) or bool(h.get('video_jobs_active')) or bool(h.get('image_waiting'))
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()


def wait_idle(limit, calm):
    """等服务空下来，而且连续空了 calm 秒才算（别人串行跑一批时，两段之间会空十几秒，那不算空）。"""
    t0 = time.time(); said = 0; free_since = None
    while True:
        h = health(); now = time.time()
        if busy(h): free_since = None
        elif free_since is None: free_since = now
        if free_since is not None and now - free_since >= calm: return round(now - t0, 1)
        if now - t0 > limit: raise SystemExit(f'等了 {limit:.0f} 秒服务还没空（在跑 {len(h.get("video_jobs_active") or [])} 个视频任务、{h.get("image_waiting")} 个生图在排），没提交')
        if now - said > 300: print(f'  {time.strftime("%H:%M:%S")} ' + ('服务在忙' if free_since is None else f'空了 {now - free_since:.0f}s，再等等确认没有下一段') + f'（视频任务 {len(h.get("video_jobs_active") or [])}，生图排队 {h.get("image_waiting")}）', flush=True); said = now
        time.sleep(15)


def wait_other(kind, limit=21600.0, calm=20.0):
    """排队规矩：同类请求连着发，异类请求等对方的队列清空。服务上生图（含抠图）和视频是两类模型，切一次要卸载 / 重载十几秒。
    kind = 'video'：要提交视频——等生图那边没有在跑、在排的请求（别的视频任务在排没关系，排在它后面就是）。
    kind = 'image'：要发生图 / 抠图——等视频那边没有在跑、在排的任务，然后这一批连着发完。
    连续 calm 秒都满足才算（对方一批里两个请求之间会有几秒空档）。"""
    t0 = time.time(); said = 0; ok_since = None
    while True:
        h = health(); now = time.time(); vids = h.get('video_jobs_active') or []
        blocked = (bool(h.get('image_waiting')) or (h.get('mode') == 'image' and bool(h.get('busy')))) if kind == 'video' else bool(vids)
        ok_since = None if blocked else (ok_since or now)
        if ok_since is not None and now - ok_since >= calm: return round(now - t0, 1)
        if now - t0 > limit: raise SystemExit(f'等了 {limit:.0f} 秒，' + ('生图' if kind == 'video' else '视频') + '那边的队列还没清空，没提交')
        if now - said > 300: print(f'  {time.strftime("%H:%M:%S")} 等' + ('生图' if kind == 'video' else '视频') + f'队列清空（视频任务 {len(vids)}，生图排队 {h.get("image_waiting")}，当前模式 {h.get("mode")}）', flush=True); said = now
        time.sleep(10)


def fetch(job_id, out):
    """取回结果，按服务实际返回的格式存：视频（现在是 H.264 yuv420p 的 mp4，有损、色度半分辨率；以后可能是无损 4:4:4）存成 <out 去掉扩展名>.<mp4|mkv|mov|webm>；
    逐帧 PNG 的压缩包解到 <out 去掉扩展名>/NN.png。返回 (存到哪, 格式说明)。"""
    url, tok = os.environ.get('IMGGEN_URL'), os.environ.get('IMGGEN_TOKEN')
    req = urllib.request.Request(url.rstrip('/') + f'/jobs/{job_id}/video'); req.add_header('Authorization', 'Bearer ' + tok)
    with urllib.request.urlopen(req, timeout=900) as r: data = r.read(); ctype = (r.headers.get('Content-Type') or '').split(';')[0].strip().lower()
    base = os.path.splitext(out)[0]; os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    if ctype in ('application/zip', 'application/x-zip-compressed') or data[:4] == b'PK\x03\x04':
        import io, zipfile
        os.makedirs(base, exist_ok=True); z = zipfile.ZipFile(io.BytesIO(data)); names = sorted(n for n in z.namelist() if n.lower().endswith('.png'))
        for i, n in enumerate(names): open(os.path.join(base, f'{i:02d}.png'), 'wb').write(z.read(n))
        return base, f'逐帧 PNG × {len(names)}'
    ext = {'video/mp4': '.mp4', 'video/x-matroska': '.mkv', 'video/quicktime': '.mov', 'video/webm': '.webm'}.get(ctype, '.mkv' if data[:4] == b'\x1a\x45\xdf\xa3' else '.mp4')
    open(base + ext, 'wb').write(data); return base + ext, ctype or '视频'


def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True); sub.add_parser('health')
    w = sub.add_parser('wait'); w.add_argument('--for', choices=['video', 'image'], required=True); w.add_argument('--limit', type=float, default=21600.0); w.add_argument('--calm', type=float, default=20.0)
    g = sub.add_parser('i2v'); g.add_argument('--image', required=True); g.add_argument('--end'); g.add_argument('--prompt-file', required=True); g.add_argument('--negative-file')
    g.add_argument('--frames', type=int, required=True); g.add_argument('--width', type=int, required=True); g.add_argument('--height', type=int, required=True)
    g.add_argument('--seed', type=int, required=True); g.add_argument('--tier', choices=['draft', 'final'], default='draft'); g.add_argument('--model', default='wan')
    g.add_argument('--out', required=True); g.add_argument('--record', required=True); g.add_argument('--wait-idle', type=float, nargs='?', const=7200.0); g.add_argument('--calm', type=float, default=90.0)
    c = sub.add_parser('ctrl', help='控制视频生成 /control2video：--image 参考图（空脸归位帧）、--control 控制视频 mp4，参数同 i2v，另可给 --steps --cfg')
    c.add_argument('--image', required=True); c.add_argument('--control', required=True); c.add_argument('--prompt-file', required=True); c.add_argument('--negative-file')
    c.add_argument('--frames', type=int, required=True); c.add_argument('--width', type=int, required=True); c.add_argument('--height', type=int, required=True)
    c.add_argument('--seed', type=int, required=True); c.add_argument('--tier', choices=['draft', 'final'], default='draft'); c.add_argument('--steps', type=int); c.add_argument('--cfg', type=float)
    c.add_argument('--out', required=True); c.add_argument('--record', required=True); c.add_argument('--wait-idle', type=float, nargs='?', const=7200.0); c.add_argument('--calm', type=float, default=90.0)
    a = ap.parse_args()
    if a.cmd == 'health': print(json.dumps(health(), ensure_ascii=False, indent=1)); return
    if a.cmd == 'wait': print(f"等了 {wait_other(getattr(a, 'for'), a.limit, a.calm)}s"); return
    prompt = open(a.prompt_file, encoding='utf-8').read().strip(); neg = open(a.negative_file, encoding='utf-8').read().strip() if a.negative_file else None
    # 提交视频前：--wait-idle = 等服务整个空下来（给别人让路时用）；不给 = 只等生图那边的队列清空（同类连着发、异类等清空）
    t0 = time.time(); waited = wait_idle(a.wait_idle, a.calm) if a.wait_idle is not None else wait_other('video', calm=min(a.calm, 20.0))
    p = {'image': b64(a.image), 'prompt': prompt, 'fast': a.tier == 'draft', 'frames': a.frames, 'width': a.width, 'height': a.height, 'seed': a.seed}
    if a.cmd == 'ctrl':
        p['control_video'] = b64(a.control); a.end = None; a.model = 'wan'
        if a.steps: p['steps'] = a.steps
        if a.cfg: p['cfg'] = a.cfg
    else: p['model'] = a.model
    if a.end: p['end_image'] = b64(a.end)
    if neg: p['negative'] = neg
    j = json.loads(call('/control2video' if a.cmd == 'ctrl' else '/img2video', p, timeout=300)); print(f"job {j['id']}  {j.get('backend')} {j['width']}x{j['height']} {j['frames']} 帧  种子 {a.seed}  {a.tier}", flush=True)
    last = None
    while True:
        time.sleep(5); j = json.loads(call(f"/jobs/{j['id']}"))
        if j['status'] != last: print(f"  {time.strftime('%H:%M:%S')} {j['status']}", flush=True); last = j['status']
        if j['status'] == 'done': break
        if j['status'] in ('error', 'cancelled'): raise SystemExit(f"{j['status']}：{j.get('error')}")
    saved, fmt = fetch(j['id'], a.out)
    rec = {'job': j['id'], 'model': j.get('model'), 'backend': j.get('backend'), 'tier': a.tier, 'seed': j.get('seed', a.seed), 'frames': j.get('frames'), 'fps': j.get('fps'),
           'size': [j.get('width'), j.get('height')], 'first_last': bool(a.end), 'control_video': os.path.basename(a.control) if a.cmd == 'ctrl' else None, 'steps': getattr(a, 'steps', None), 'cfg': getattr(a, 'cfg', None), 'prompt': prompt, 'negative': neg,
           'gen_seconds': j.get('elapsed'), 'queue_seconds': j.get('queue_wait'), 'waited_idle_seconds': waited, 'wall_seconds': round(time.time() - t0, 1),
           'vram_peak_mib': j.get('vram_peak_mib'), 'submitted_at': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(t0)), 'video': os.path.basename(saved), 'format': fmt}
    json.dump(rec, open(a.record, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{saved}（{fmt}）：生成 {rec['gen_seconds']}s，排队 {rec['queue_seconds']}s，总等待 {rec['wall_seconds']}s，显存峰值 {rec['vram_peak_mib']} MiB，模型 {rec['model']}")


if __name__ == '__main__':
    main()
