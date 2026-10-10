"""出图那几步共用：拼生图服务的命令并（可选）执行。服务地址和令牌只从环境变量来，不写进任何文件：
  IMGGEN_CLIENT   客户端脚本的路径（必须）。调用形式：<python> <client> edit <参考图…> <prompt> [--final] -W <宽> -H <高> --seed <种子> -o <输出>
  IMGGEN_PYTHON   跑客户端用的解释器（默认 python3）
  IMGGEN_URL      服务地址（可选）：给了就先轮询 <地址>/health，等 busy + image_waiting 为 0 再发（服务是串行的，一次一个请求）
令牌由客户端自己从它的环境变量 / 配置里读，这里不经手。"""
import os, sys, json, time, shlex, subprocess, urllib.request

def command(out, w, h, seed, prompt, refs, final=False):
    client = os.environ.get('IMGGEN_CLIENT') or '$IMGGEN_CLIENT'
    return [os.environ.get('IMGGEN_PYTHON', 'python3'), client, 'edit', *refs, prompt, *(['--final'] if final else []), '-W', str(w), '-H', str(h), '--seed', str(seed), '-o', out]

def wait_idle():
    url = os.environ.get('IMGGEN_URL')
    while url:
        try:
            d = json.load(urllib.request.urlopen(url.rstrip('/') + '/health', timeout=5))
            if d['busy'] + d['image_waiting'] == 0: return
        except Exception: pass
        time.sleep(5)

def run(out, w, h, seed, prompt, refs, final=False, dry=False, log=None):
    """已存在就跳过。dry=True 只打印命令。返回 'skip' / 'dry' / 'done'。"""
    cmd = command(out, w, h, seed, prompt, refs, final)
    if dry: print(' '.join(shlex.quote(c) for c in cmd)); return 'dry'
    if os.path.exists(out): print('skip', out); return 'skip'
    if not os.environ.get('IMGGEN_CLIENT'): raise SystemExit('没有设环境变量 IMGGEN_CLIENT（客户端脚本路径）')
    wait_idle()
    if log: open(log, 'a', encoding='utf-8').write(f'[{os.path.basename(out)}] seed={seed} {w}x{h} {"final" if final else "draft"} refs={" ".join(refs)}  :: {prompt}\n')
    r = subprocess.run(cmd, capture_output=True, text=True, env={**os.environ, 'LC_ALL': 'en_US.UTF-8', 'PYTHONUTF8': '1'})
    print((r.stdout + r.stderr).strip().splitlines()[-1] if (r.stdout + r.stderr).strip() else f'exit {r.returncode}'); return 'done'
