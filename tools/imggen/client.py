#!/usr/bin/env python3
"""本地生图服务（192.168.3.127:7860）的命令行客户端，只用标准库。

  python3 tools/imggen/client.py txt2img "一只橘猫坐在窗台上" -o cat.png [--final] [--seed 42] [-W 1328 -H 1328]
  python3 tools/imggen/client.py edit ref.png [ref2.png ...] "让图1的女孩微笑" -o smile.png [--final] [--seed 42]
  python3 tools/imggen/client.py cutout in.png -o out.png
  python3 tools/imggen/client.py img2video first.png "她眨眼微笑，慢慢转头" -o v.mp4 [--model ltx] [--final] [--seconds 5] [--res 720p] [--end last.png]
  python3 tools/imggen/client.py txt2video "霓虹夜城，镜头缓慢推进" -o v.mp4 [--model ltx] [--no-wait]
  python3 tools/imggen/client.py job <job_id> [-o v.mp4]      # 查异步任务 / 取结果
  python3 tools/imggen/client.py cancel <job_id>              # 取消视频任务（排队中直接取消，在跑的打断）
  python3 tools/imggen/client.py mode video|image             # 预先切换显存模式（可选）
  python3 tools/imggen/client.py health

默认 fast（Lightning 草稿）；--final 关 LoRA 走定稿步数。视频是异步任务，client 默认提交后轮询等结果（--no-wait 只提交）。
生图和生视频不同时占显存：服务端自动切换，视频任务跑着时生图请求会排队等它结束。
token：环境变量 IMGGEN_TOKEN，或 ~/.config/imggen/token，或 ssh 去服务器读 /opt/imggen/token。
"""
import argparse
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

URL = os.environ.get("IMGGEN_URL", "http://192.168.3.127:7860")


def get_token():
    if os.environ.get("IMGGEN_TOKEN"):
        return os.environ["IMGGEN_TOKEN"]
    p = os.path.expanduser("~/.config/imggen/token")
    if os.path.exists(p):
        return open(p).read().strip()
    tok = subprocess.run(["ssh", "-o", "BatchMode=yes", "root@192.168.3.127", "cat /opt/imggen/token"],
                         capture_output=True, text=True, timeout=20).stdout.strip()
    if not tok:
        sys.exit("拿不到 token：设 IMGGEN_TOKEN 或写 ~/.config/imggen/token")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as f:
        f.write(tok)
    os.chmod(p, 0o600)
    return tok


def call(path, payload=None, method=None):
    req = urllib.request.Request(URL + path, method=method or ("POST" if payload is not None else "GET"))
    if path != "/health":
        req.add_header("Authorization", "Bearer " + get_token())
    if payload is not None:
        req.data = json.dumps(payload).encode()
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=3700) as r:
            return r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode(errors='replace')[:2000]}")


def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def save(data, headers, out, t0):
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "wb") as f:
        f.write(data)
    print(f"{out}  seed={headers.get('X-Seed')}  服务端 {headers.get('X-Elapsed')}s  总计 {time.time() - t0:.1f}s  模型 {headers.get('X-Model')}")


def fetch_video(j, out):
    data, _ = call(f"/jobs/{j['id']}/video")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "wb") as f:
        f.write(data)
    print(f"{out}  {j['width']}x{j['height']} {j['frames']}帧@{j['fps']}fps ({j['seconds']}s)  seed={j['seed']}  "
          f"生成 {j['elapsed']}s（排队 {j.get('queue_wait')}s）  整卡显存峰值 {j.get('vram_peak_mib')} MiB  模型 {j.get('model')}")


def video(a):
    if not a.no_wait and not a.out:
        sys.exit("等待模式需要 -o")
    p = {k: v for k, v in {"seed": a.seed, "negative": a.negative, "width": a.width, "height": a.height,
                           "frames": a.frames}.items() if v is not None}
    p.update(prompt=a.prompt, model=a.model, fast=not a.final, seconds=a.seconds, res=a.res, audio=a.audio)
    path = "/txt2video"
    if a.cmd == "img2video":
        path = "/img2video"
        p["image"] = b64(a.image)
        if a.end:
            p["end_image"] = b64(a.end)
    j = json.loads(call(path, p)[0])
    print(f"job {j['id']}  {j['backend']} {j['kind']} {j['width']}x{j['height']} {j['frames']}帧", flush=True)
    if a.no_wait:
        return
    last = None
    while True:
        time.sleep(5)
        j = json.loads(call(f"/jobs/{j['id']}")[0])
        if j["status"] != last:
            print(f"  {time.strftime('%H:%M:%S')} {j['status']}", flush=True)
            last = j["status"]
        if j["status"] == "done":
            fetch_video(j, a.out)
            return
        if j["status"] in ("error", "cancelled"):
            sys.exit(f"{j['status']}：{j.get('error')}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("-o", "--out", required=True)
    common.add_argument("--final", action="store_true", help="关 Lightning，40 步定稿")
    common.add_argument("--seed", type=int)
    common.add_argument("--steps", type=int)
    common.add_argument("--cfg", type=float)
    common.add_argument("-n", "--negative")
    common.add_argument("-W", "--width", type=int)
    common.add_argument("-H", "--height", type=int)
    t = sub.add_parser("txt2img", parents=[common])
    t.add_argument("prompt")
    e = sub.add_parser("edit", parents=[common])
    e.add_argument("args", nargs="+", help="1-3 张参考图，最后一个是 prompt")
    c = sub.add_parser("cutout")
    c.add_argument("image")
    c.add_argument("-o", "--out", required=True)
    vid = argparse.ArgumentParser(add_help=False)
    vid.add_argument("-o", "--out", help="mp4 输出路径（等待模式下必填）")
    vid.add_argument("--model", choices=["wan", "ltx"], default="wan", help="wan=Wan2.2 A14B（默认），ltx=LTX-2.5（快）")
    vid.add_argument("--final", action="store_true", help="wan：关 lightx2v，20 步定稿")
    vid.add_argument("--seconds", type=float, default=5)
    vid.add_argument("--frames", type=int)
    vid.add_argument("--res", choices=["480p", "720p"], default="480p")
    vid.add_argument("-W", "--width", type=int)
    vid.add_argument("-H", "--height", type=int)
    vid.add_argument("--seed", type=int)
    vid.add_argument("-n", "--negative")
    vid.add_argument("--audio", action="store_true", help="ltx：保留它生成的音轨")
    vid.add_argument("--no-wait", action="store_true", help="只提交，打印 job id")
    i2v = sub.add_parser("img2video", parents=[vid])
    i2v.add_argument("image")
    i2v.add_argument("prompt")
    i2v.add_argument("--end", help="尾帧图（仅 wan）")
    t2v = sub.add_parser("txt2video", parents=[vid])
    t2v.add_argument("prompt")
    jb = sub.add_parser("job")
    jb.add_argument("id")
    jb.add_argument("-o", "--out")
    cc = sub.add_parser("cancel")
    cc.add_argument("id")
    md = sub.add_parser("mode")
    md.add_argument("mode", choices=["image", "video"])
    sub.add_parser("health")
    a = ap.parse_args()

    if a.cmd == "mode":
        print(json.dumps(json.loads(call("/mode", {"mode": a.mode})[0]), ensure_ascii=False, indent=2))
        return
    if a.cmd == "cancel":
        print(json.dumps(json.loads(call(f"/jobs/{a.id}", method="DELETE")[0]), ensure_ascii=False, indent=2))
        return
    if a.cmd == "job":
        j = json.loads(call(f"/jobs/{a.id}")[0])
        print(json.dumps(j, ensure_ascii=False, indent=2))
        if a.out and j.get("status") == "done":
            fetch_video(j, a.out)
        return
    if a.cmd in ("img2video", "txt2video"):
        video(a)
        return

    if a.cmd == "health":
        print(json.dumps(json.loads(call("/health")[0]), ensure_ascii=False, indent=2))
        return
    t0 = time.time()
    if a.cmd == "cutout":
        save(*call("/cutout", {"image": b64(a.image)}), a.out, t0)
        return
    p = {k: v for k, v in {"seed": a.seed, "steps": a.steps, "cfg": a.cfg, "negative": a.negative,
                           "width": a.width, "height": a.height}.items() if v is not None}
    p["fast"] = not a.final
    if a.cmd == "txt2img":
        p["prompt"] = a.prompt
        save(*call("/txt2img", p), a.out, t0)
    else:
        *imgs, p["prompt"] = a.args
        if not 1 <= len(imgs) <= 3:
            sys.exit("edit 需要 1-3 张参考图 + prompt")
        p["images"] = [b64(i) for i in imgs]
        save(*call("/edit", p), a.out, t0)


if __name__ == "__main__":
    main()
