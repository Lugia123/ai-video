#!/usr/bin/env python3
"""把成品页（publish/index.html）和它要的脚本、片段库拷成一个可以整目录拷走的包。只读原库，不改它。

用法（在 puppet/ 下）：
  python3 publish/build.py                      → out/release-html/<角色>-host-v4/（帧保持 PNG）
  python3 publish/build.py --webp               → out/release-html/<角色>-host-v4-webp/（帧转无损 WebP，像素不变，体积小）
  选项：--char beret-girl  --lib clips-2p  --add <库>:<动作,动作>（可多次）  --no-add  --keep-all  --tag v4  --port 8797  --out <目录>  --jobs 8

合并库：以 --lib 为底，--add 从同一个角色的另一个库里并入指定的几条动作（动作条目、它用的片段、逐帧头部跟踪、挂点一起并）。
两个库的公共部分（画布、归位帧、贴片、口型、眨眼…）必须一模一样，不一样就停。默认并入见下面的 ADD；按钮用哪几条、叫什么见 MAIN（写进包里的 library/page.json）。
精简：MAIN 里没列的动作不进包（动作条目、片段、逐帧跟踪、挂点、图都不带）；--keep-all 时全带上，没列的进页面的「更多版本」。

包里有什么：
  index.html            成品页
  lib/                  播放器和讲解员脚本，原样拷（保持相对位置，import 路径不用改）
  library/              片段库：clips.json / clips.js / points.json + clips.json 里引用到的图（帧、贴片、逐帧遮罩）；库里没被引用的图不拷
  打开.command start.sh start.bat 怎么打开.txt

和原库不一样的地方，都只在包里的拷贝上：
  0. 并入了 --add 的动作、去掉了 MAIN 里没列的动作（留白 minMargin 按留下的片段重算）；多一份 page.json（页面配置：主按钮 main、
     加载清单 load = [[路径开头, 文件数, 字节数], …]（页面的加载进度条按它算字节）、等待时的人物图 poster）；
     publish/poster/<角色>.webp 有的话拷成 library/poster.webp（加载时先摆在房间里的那张站姿图，用 publish/make_poster.py 从打好的包里截）；
  1. points.json 里没有这个角色的情绪符号选项（emote：出在哪一侧、常用组合）时，从角色默认库 clips/points.manual.json 补上；
  2. --webp 时图的扩展名和 clips.json / clips.js 里的路径一起从 .png 换成 .webp。
"""
import argparse, json, os, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.dirname(HERE)
JS = ['clips/player.js', 'host-clips/index.js', 'host-clips/emotes.js', 'host/behavior.js', 'emotes/chibi-emotes.js']
# 每个角色默认并入哪些、主按钮是哪几条（[动作 id, 按钮上的名字]，按这个顺序排）
ADD = {'beret-girl': ['clips-2p-new:clap_s1,stepbeat_s1', 'clips-2p-new-fix:hips_s1_fix']}
MAIN = {'beret-girl': [['think_b1_final', '思考 A'], ['think_b1_draft', '思考 B'], ['wave_b1_draft', '挥手 A'], ['wave_h1_s2_canny', '挥手 B'], ['shrug_b1_final_s2', '摊手'],
                      ['clap_s1', '鼓掌'], ['stepbeat_s1', '踩拍'], ['hips_s1_fix', '叉腰'], ['hips_s1', '叉腰']]}          # 库里没有的那几条自动跳过

ap = argparse.ArgumentParser(); ap.add_argument('--char', default='beret-girl'); ap.add_argument('--lib', default='clips-2p')
ap.add_argument('--add', action='append'); ap.add_argument('--no-add', action='store_true'); ap.add_argument('--port', type=int, default=8797); ap.add_argument('--keep-all', action='store_true'); ap.add_argument('--tag', default='v4')
ap.add_argument('--webp', action='store_true'); ap.add_argument('--out'); ap.add_argument('--jobs', type=int, default=8)
A = ap.parse_args(); PORT = A.port
SRC = os.path.join(PUPPET, 'characters', A.char, A.lib)
OUT = os.path.abspath(A.out or os.path.join(PUPPET, 'out', 'release-html', f'{A.char}-host-{A.tag}' + ('-webp' if A.webp else '')))
if os.path.commonpath([OUT, os.path.join(PUPPET, 'characters')]) == os.path.join(PUPPET, 'characters'): sys.exit('输出目录不能放在 characters/ 里')

lib = json.load(open(os.path.join(SRC, 'clips.json'), encoding='utf-8'))
pts = json.load(open(os.path.join(SRC, 'points.json'), encoding='utf-8'))
# 并入别的库里的动作。每张图记下它来自哪个库目录（origin）
origin = {}; merged = []
SHARED = [k for k in lib if k not in ('clips', 'actions', 'headTracks', 'minMargin')]
for spec in ([] if A.no_add else (A.add or ADD.get(A.char, []))):
    name, ids = spec.split(':'); src2 = os.path.join(PUPPET, 'characters', A.char, name)
    lib2 = json.load(open(os.path.join(src2, 'clips.json'), encoding='utf-8')); pts2 = json.load(open(os.path.join(src2, 'points.json'), encoding='utf-8'))
    diff = [k for k in SHARED if lib.get(k) != lib2.get(k)] + [k for k in ('canvas', 'poses') if pts.get(k) != pts2.get(k)]
    if diff: sys.exit(f'{name} 和 {A.lib} 的公共部分不一样，不能并：{diff}')
    for aid in ids.split(','):
        act = next((a for a in lib2['actions'] if a['id'] == aid), None)
        if not act: sys.exit(f'{name} 里没有动作 {aid}')
        if any(a['id'] == aid for a in lib['actions']): sys.exit(f'动作 {aid} 已经在库里了')
        if any(k in act for k in ('pose', 'hold')): sys.exit(f'动作 {aid} 带静帧，这个脚本只会并「一次播完」的动作')
        lib['actions'].append(act)
        for cid in [act[k] for k in ('in', 'out') if act.get(k)]:
            if cid in lib['clips']: sys.exit(f'片段 {cid} 重名')
            c = lib['clips'][cid] = lib2['clips'][cid]; pts['clips'][cid] = pts2['clips'][cid]
            for f in c['frames']:
                tr = lib2.get('headTracks', {}).get(f)
                if tr is not None: lib['headTracks'][f] = tr
            before = set(origin); 
            def mark(o):
                if isinstance(o, dict):
                    for k, v in o.items():
                        if k == 'file' and isinstance(v, str): origin[v] = src2
                        else: mark(v)
                elif isinstance(o, list):
                    for v in o: mark(v)
            mark([lib['headTracks'].get(f) for f in c['frames']]); origin.update({f: src2 for f in c['frames']})
        merged.append(f'{name}:{aid}')
# 精简：只留 MAIN 里列的动作
main = [m for m in MAIN.get(A.char, []) if any(a['id'] == m[0] for a in lib['actions'])]; dropped = []
if main and not A.keep_all:
    keep = {m[0] for m in main}; dropped = [a['id'] for a in lib['actions'] if a['id'] not in keep]
    if any(k in a for a in lib['actions'] if a['id'] in dropped for k in ('pose', 'hold')): sys.exit('要去掉的动作里有带静帧的，这个脚本不会去')
    lib['actions'] = [a for a in lib['actions'] if a['id'] in keep]; used = {a[k] for a in lib['actions'] for k in ('in', 'out') if a.get(k)}
    for cid in [c for c in lib['clips'] if c not in used]:
        for f in lib['clips'][cid]['frames']: lib['headTracks'].pop(f, None)
        del lib['clips'][cid]; pts['clips'].pop(cid, None)
if merged or dropped:          # 留白：四边各取所有片段和静帧里最小的（和原库的算法对得上：对 clips-2p 重算得到的就是它自己写的数）
    ms = [c['margin'] for c in lib['clips'].values()] + [p['margin'] for p in lib['poses'].values()]
    l, t, r, b = (min(m[i] for m in ms) for i in range(4)); lib['minMargin'] = {'left': l, 'top': t, 'right': r, 'bottom': b, 'min': min(l, t, r, b)}
    lib['note'] = (lib.get('note') or '') + f' ｜ 成品页用的库（publish/build.py）：{A.lib}' + (f' + {"、".join(merged)}' if merged else '') + (f'，去掉 {"、".join(dropped)}' if dropped else '')
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
srcOf = lambda f: origin.get(f, SRC)
missing = [f for f in files if not os.path.isfile(os.path.join(srcOf(f), f))]
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
        subprocess.run(['cwebp', '-quiet', '-lossless', '-exact', '-z', '8', os.path.join(srcOf(f), f), '-o', dst[:-4] + '.webp'], check=True)
    else: shutil.copy2(os.path.join(srcOf(f), f), dst)
with ThreadPoolExecutor(A.jobs) as ex: list(ex.map(put, sorted(files)))

text = json.dumps(lib, ensure_ascii=False, indent=1)
if A.webp: text = text.replace('.png"', '.webp"')
open(os.path.join(L, 'clips.json'), 'w', encoding='utf-8').write(text)
open(os.path.join(L, 'clips.js'), 'w', encoding='utf-8').write('// 由 publish/build.py 从 clips.json 生成。\nwindow.__clipLibrary = ' + text + ';\n')

added = False
manual = os.path.join(PUPPET, 'characters', A.char, 'clips', 'points.manual.json')
if not pts.get('emote') and os.path.isfile(manual):
    e = json.load(open(manual, encoding='utf-8')).get('emote')
    if e: pts['emote'] = {k: v for k, v in e.items() if not k.startswith('_')}; added = True
open(os.path.join(L, 'points.json'), 'w', encoding='utf-8').write(json.dumps(pts, ensure_ascii=False))

# 加载清单：包里的图按路径开头分三类（动作帧 / 表情贴片 / 逐帧头部跟踪），各有多少个、多少字节——页面的进度条按字节算
load = []
for prefix in ('frames/', 'patches/', 'track'):
    fs = [f for f in files if f.startswith(prefix)]
    if fs: load.append([prefix, len(fs), sum(os.path.getsize(os.path.join(L, f[:-4] + '.webp' if A.webp and f.endswith('.png') else f)) for f in fs)])
page = {'main': main, 'load': load}
poster = os.path.join(HERE, 'poster', A.char + '.webp')
if os.path.isfile(poster): shutil.copy2(poster, os.path.join(L, 'poster.webp')); page['poster'] = 'poster.webp'
open(os.path.join(L, 'page.json'), 'w', encoding='utf-8').write(json.dumps(page, ensure_ascii=False))

def script(name, body, mode=0o755):
    p = os.path.join(OUT, name); open(p, 'w', encoding='utf-8', newline='').write(body); os.chmod(p, mode)
script('start.sh', f'#!/bin/sh\ncd "$(dirname "$0")"\necho "打开 http://localhost:{PORT}/ （Ctrl+C 结束）"\nexec python3 -m http.server {PORT} --bind 127.0.0.1\n')
script('打开.command', f'#!/bin/sh\ncd "$(dirname "$0")"\n(sleep 1; open "http://localhost:{PORT}/") &\nexec python3 -m http.server {PORT} --bind 127.0.0.1\n')
script('start.bat', f'@echo off\r\ncd /d "%~dp0"\r\nstart "" "http://localhost:{PORT}/"\r\npython -m http.server {PORT} --bind 127.0.0.1\r\n', 0o644)
size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(OUT) for f in fs)
script('怎么打开.txt', f'''讲解员成品页（角色 {A.char}，片段库 {A.lib}{'（并入 ' + '、'.join(merged) + '）' if merged else ''}，帧格式 {'无损 WebP' if A.webp else 'PNG'}）

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
  library/     片段库（透明序列帧、表情贴片、逐帧遮罩；page.json 是页面配置：主按钮是哪几条动作）

构建：publish/build.py，{time.strftime('%Y-%m-%d %H:%M')}，{len(files)} 张图。
''', 0o644)
print(f'{OUT}\n  图 {len(files)} 张，{"转 WebP" if A.webp else "拷贝"}用时 {time.time() - t0:.1f}s；总大小 {size / 1e6:.1f} MB；points.json 补情绪符号选项：{"是" if added else "否"}；并入：{"、".join(merged) or "无"}；去掉：{"、".join(dropped) or "无"}；留下动作 {len(lib["actions"])} 条；等待时的人物图：{"有" if "poster" in page else "无"}；端口 {PORT}')
