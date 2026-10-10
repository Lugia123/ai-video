#!/usr/bin/env python3
"""给一段键色底视频的每一帧出一张「主体蒙版」（抠图模型，跑在局域网生图服务上，不在本机推理）。

    IMGGEN_URL=http://<主机>:<端口> IMGGEN_TOKEN=<令牌> /usr/bin/python3 puppet/clips/model_matte.py <视频.mp4> <输出目录>

    可选 --batch=45 --pause=180：每发 45 帧停 180 秒，把队列让给别人的任务（公用机器上别一口气压几百张）；
         --parallel=4：一批里同时排 4 个请求进队列（服务那头仍是串行），免得每做几张就被别人的长任务隔开。

→ <输出目录>/NN.png（灰度，白 = 主体）。一次只发一张，串行。已经有的帧跳过（可断点续跑）。
蒙版给 import_i2v.py --model-matte 用：键色抠像管边和洞的精确位置，模型蒙版只当裁判——
保护被键色误伤的主体（运动模糊里混进底色的手、白袖子），以及打开被画成淡粉色、键色抠不透的小洞。
只用标准库，哪个 python 都能跑（有的环境里 conda 的 python 连局域网不稳，用系统自带的）。"""
import base64, json, os, subprocess, sys, tempfile, time, urllib.request


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
    if len(args) != 2: raise SystemExit(__doc__)
    video, out = args; batch, pause = int(opt.get('batch', 0)), float(opt.get('pause', 180))
    url, tok = os.environ.get('IMGGEN_URL'), os.environ.get('IMGGEN_TOKEN')
    if not url or not tok: raise SystemExit('要先设环境变量 IMGGEN_URL 和 IMGGEN_TOKEN')
    os.makedirs(out, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-start_number', '0', os.path.join(tmp, '%02d.png')], check=True)
        frames = sorted(os.listdir(tmp))
        todo = [f for f in frames if not os.path.exists(os.path.join(out, f))]
        par = int(opt.get('parallel', 1))

        def one(f):
            t0 = time.time()
            req = urllib.request.Request(url.rstrip('/') + '/cutout', method='POST', data=json.dumps({'image': base64.b64encode(open(os.path.join(tmp, f), 'rb').read()).decode()}).encode())
            req.add_header('Authorization', 'Bearer ' + tok); req.add_header('Content-Type', 'application/json')
            with urllib.request.urlopen(req, timeout=3600) as r: data = r.read()
            rgba = os.path.join(tmp, 'cut-' + f); open(rgba, 'wb').write(data)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', rgba, '-vf', 'alphaextract', os.path.join(out, f)], check=True)   # 只留 alpha
            print(f'{f}  {time.time() - t0:.1f}s', flush=True)

        # 分批：一批里的请求同时排进队列（服务那头仍然一张一张做），这样一批能在别人两条任务之间的空档里一口气做完，
        # 不会每做几张就被下一条长任务隔开；一批发完停一会儿，把队列让给别人。
        size = batch or len(todo) or 1
        for i in range(0, len(todo), size):
            if i: print(f'已发 {i} 帧，让出队列 {pause:.0f} 秒', flush=True); time.sleep(pause)
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor(max(1, par)) as ex: list(ex.map(one, todo[i:i + size]))
    print(f'完成：{len(frames)} 帧 → {out}')


if __name__ == '__main__':
    main()
