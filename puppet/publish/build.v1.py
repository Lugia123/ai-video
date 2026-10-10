#!/usr/bin/env python3
"""把成品页（publish/index.html）和它要的脚本、片段库拷成一个可以整目录拷走的包。只读原库，不改它。

用法（在 puppet/ 下）：
  python3 publish/build.py                      → out/release-html/<角色>-host/（帧保持 PNG）
  python3 publish/build.py --webp               → out/release-html/<角色>-host-webp/（帧转无损 WebP，像素不变，体积小）
  选项：--char beret-girl  --lib clips-2p  --out <目录>  --jobs 8

包里有什么：
  index.html            成品页
  lib/                  播放器和讲解员脚本，原样拷（保持相对位置，import 路径不用改）
  library/              片段库：clips.json / clips.js / points.json + clips.json 里引用到的图（帧、贴片、逐帧遮罩）；库里没被引用的图不拷
  打开.command start.sh start.bat 怎么打开.txt

和原库不一样的地方只有两处，都只在包里的拷贝上：
  1. points.json 里没有这个角色的漫符选项（emote：出在哪一侧、常用组合）时，从角色默认库 clips/points.manual.json 补上；
  2. --webp 时图的扩展名和 clips.json / clips.js 里的路径一起从 .png 换成 .webp。
"""
import argparse, json, os, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.dirname(HERE)
JS = ['clips/player.js', 'host-clips/index.js', 'host-clips/emotes.js', 'host/behavior.js', 'emotes/chibi-emotes.js']
PORT = 8765

ap = argparse.ArgumentParser(); ap.add_argument('--char', default='beret-girl'); ap.add_argument('--lib', default='clips-2p')
ap.add_argument('--webp', action='store_true'); ap.add_argument('--out'); ap.add_argument('--jobs', type=int, default=8)
A = ap.parse_args()
SRC = os.path.join(PUPPET, 'characters', A.char, A.lib)
OUT = os.path.abspath(A.out or os.path.join(PUPPET, 'out', 'release-html', f'{A.char}-host' + ('-webp' if A.webp else '')))
if os.path.commonpath([OUT, os.path.join(PUPPET, 'characters')]) == os.path.join(PUPPET, 'characters'): sys.exit('输出目录不能放在 characters/ 里')

lib = json.load(open(os.path.join(SRC, 'clips.json'), encoding='utf-8'))
# clips.json 里引用到的图：静帧、片段帧、所有 "file" 字段（贴片、逐帧遮罩）
files = set()
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('file', 'frame') and isinstance(v, str): files.add(v)
            elif k == 'frames' and isinstance(v, list) and all(isinstance(x, str) for x in v): files.update(v)
            else: walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(lib)
missing = [f for f in files if not os.path.isfile(os.path.join(SRC, f))]
if missing: sys.exit(f'clips.json 引用了 {len(missing)} 个不存在的文件，例如 {missing[:3]}')

if os.path.exists(OUT): shutil.rmtree(OUT)
L = os.path.join(OUT, 'library'); os.makedirs(L)
shutil.copy2(os.path.join(HERE, 'index.html'), os.path.join(OUT, 'index.html'))
for f in JS:
    os.makedirs(os.path.dirname(os.path.join(OUT, 'lib', f)), exist_ok=True); shutil.copy2(os.path.join(PUPPET, f), os.path.join(OUT, 'lib', f))

t0 = time.time()
def put(f):
    dst = os.path.join(L, f); os.makedirs(os.path.dirname(dst), exist_ok=True)
    if A.webp and f.endswith('.png'):          # 无损、保留透明像素下面的颜色（-exact），解码出来和 PNG 逐像素相同
        subprocess.run(['cwebp', '-quiet', '-lossless', '-exact', '-z', '8', os.path.join(SRC, f), '-o', dst[:-4] + '.webp'], check=True)
    else: shutil.copy2(os.path.join(SRC, f), dst)
with ThreadPoolExecutor(A.jobs) as ex: list(ex.map(put, sorted(files)))

text = json.dumps(lib, ensure_ascii=False, indent=1)
if A.webp: text = text.replace('.png"', '.webp"')
open(os.path.join(L, 'clips.json'), 'w', encoding='utf-8').write(text)
open(os.path.join(L, 'clips.js'), 'w', encoding='utf-8').write('// 由 publish/build.py 从 clips.json 生成。\nwindow.__clipLibrary = ' + text + ';\n')

pts = json.load(open(os.path.join(SRC, 'points.json'), encoding='utf-8')); added = False
manual = os.path.join(PUPPET, 'characters', A.char, 'clips', 'points.manual.json')
if not pts.get('emote') and os.path.isfile(manual):
    e = json.load(open(manual, encoding='utf-8')).get('emote')
    if e: pts['emote'] = {k: v for k, v in e.items() if not k.startswith('_')}; added = True
open(os.path.join(L, 'points.json'), 'w', encoding='utf-8').write(json.dumps(pts, ensure_ascii=False))

def script(name, body, mode=0o755):
    p = os.path.join(OUT, name); open(p, 'w', encoding='utf-8', newline='').write(body); os.chmod(p, mode)
script('start.sh', f'#!/bin/sh\ncd "$(dirname "$0")"\necho "打开 http://localhost:{PORT}/ （Ctrl+C 结束）"\nexec python3 -m http.server {PORT} --bind 127.0.0.1\n')
script('打开.command', f'#!/bin/sh\ncd "$(dirname "$0")"\n(sleep 1; open "http://localhost:{PORT}/") &\nexec python3 -m http.server {PORT} --bind 127.0.0.1\n')
script('start.bat', f'@echo off\r\ncd /d "%~dp0"\r\nstart "" "http://localhost:{PORT}/"\r\npython -m http.server {PORT} --bind 127.0.0.1\r\n', 0o644)
size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(OUT) for f in fs)
script('怎么打开.txt', f'''讲解员成品页（角色 {A.char}，片段库 {A.lib}，帧格式 {'无损 WebP' if A.webp else 'PNG'}）

怎么打开
  这个目录可以整个拷走。要走本地服务打开，直接双击 index.html 不行（浏览器不让本地文件加载脚本模块）。
  · macOS：双击「打开.command」
  · 命令行：sh start.sh ，然后浏览器开 http://localhost:{PORT}/
  · Windows（要装 Python）：双击 start.bat
  · 或者把整个目录放到任何静态网站服务上。
  需要 Python 3（只用它自带的 http.server），不需要联网。

目录
  index.html   页面
  lib/         播放器和讲解员脚本
  library/     片段库（透明序列帧、表情贴片、逐帧遮罩）

构建：publish/build.py，{time.strftime('%Y-%m-%d %H:%M')}，{len(files)} 张图。
''', 0o644)
print(f'{OUT}\n  图 {len(files)} 张，{"转 WebP" if A.webp else "拷贝"}用时 {time.time() - t0:.1f}s；总大小 {size / 1e6:.1f} MB；points.json 补漫符选项：{"是" if added else "否"}')
