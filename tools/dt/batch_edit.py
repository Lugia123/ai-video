"""批量调用 qwen_edit.py，并发 2（千问 API 限流）。用法: python3 tools/dt/batch_edit.py jobs.json
jobs.json: {"ref": [...], "out_dir": "...", "suffix": "共同追加的提示", "seed": 7, "jobs": {"name": "prompt", ...}}"""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
cfg = json.load(open(sys.argv[1]))
def run(item):
    name, prompt = item
    cmd = ['python3', 'tools/dt/qwen_edit.py', '--n', '1', '--out', f"{cfg['out_dir']}/{name}.png", '--prompt', prompt + ' ' + cfg.get('suffix', '')]
    for r in cfg['ref']: cmd += ['--ref', r]
    if 'seed' in cfg: cmd += ['--seed', str(cfg['seed'])]
    p = subprocess.run(cmd, capture_output=True, text=True)
    return name, (p.stdout + p.stderr).strip()[-200:]
with ThreadPoolExecutor(2) as ex:
    for name, msg in ex.map(run, cfg['jobs'].items()): print(name, '->', msg)
