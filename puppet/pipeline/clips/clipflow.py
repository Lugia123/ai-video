#!/usr/bin/env python3
"""片段入库流水线：从「归位帧 + 动作 + 提示词 / 可选的动作关键图 + 种子 + 档位」到一条量过、可以挑的片段。

    python3 pipeline/clips/clipflow.py run <角色目录> <动作> --mode loop|pair --seed N [--tier draft|final] [选项]
    python3 pipeline/clips/clipflow.py batch <角色目录> <条目清单.txt> [--matte] [--wait-idle]      # 多条一起：先全部生成，再统一出蒙版
    python3 pipeline/clips/clipflow.py pick <角色目录> <动作> <条目> keep|reject [--reason 轨迹,挡脸,…] [--note 话]
    python3 pipeline/clips/clipflow.py report <角色目录>
    python3 pipeline/clips/clipflow.py promote <角色目录> <动作> <条目> [--lib 片段库目录]

两种生成方式（--mode）：
  loop  单图往返：首帧 = 尾帧 = 归位帧，一段里做完去和回（默认 49 帧）。之后在「动作做到头」的那一帧（--apex，不给就自动找）切成去程、回程。
  pair  首尾帧式：去程 归位帧 → 动作关键图，回程 动作关键图 → 归位帧，各一段（默认各 25 帧）；--back reverse = 不另外生成回程，把去程倒过来用。

run 的步骤（每步的产物都留在 <角色>/clips-work/<动作>/<条目>/，条目名 = <方式>-<档位>-s<种子>；重跑时已经有的产物跳过，--redo 步骤名 强制重做）：
  home      归位帧（和动作关键图）按画幅参数摆进画布：人高 = 画幅高 × charFrac，脚底在 foot 处，水平居中；出透明版和键色底版
            （gen.json 里 restPlaced: true = 来源图已经按这个比例摆好了，只缩放不重摆）
  gen       提交生成（pipeline/clips/imggen.py，走局域网生图服务，地址令牌从环境变量读，串行，--wait-idle 时等服务空了才提交）
            记录：提示词原文、种子、档位、服务端耗时、排队、显存峰值 → gen-*.json
  register  量生成帧和归位帧对不对得上（第 1 帧 / 倒数第 2 帧对归位帧：下半身的位移、轮廓不一致）→ register.json。只量不改：
            偏了多少写进读数和提示里，超过 --max-shift 像素这一条标成「没回到归位 / 位置漂了」
  split     loop：找动作做到头的那一帧，无损切成 go.mkv / back.mkv；pair + reverse：把去程无损倒过来当回程
  matte     （--matte 才做）每帧出一张主体蒙版（clips/model_matte.py，抠图模型在服务那头），给下一步当裁判。
            抠图和视频在服务上是两类模型，来回切一次要卸载 / 重载十几秒：蒙版帧攒成一批、等视频队列空了一次发完；
            多条一起做用 batch（先全部生成、再统一出蒙版），不要一条一条 run --matte 交替着来
  stage     （抠法开关 --edge / --static-lock / --no-chroma 原样传给 import_i2v.py，不给就用它的默认——现在是软边、不做静止锁定；--no-chroma = 底色不是键色、只靠模型蒙版，必须配 --matte）
            建一个只装这一条的暂存片段库（lib/），调 clips/import_i2v.py：键色抠图 → **颜色只对归位帧一张图校** → 去程末尾接保持帧、
            回程末尾混回归位帧 → 写帧和 clips.json；再 clips/sync.py 量包围盒。抠图和校色的做法以 clips/ 那两个脚本为准，这里不另写一套
  check     qa/clips/checks.py 对去程、回程各出一份读数和标注图，另出给人连续看的 1:1 片子 readings/review-in.mp4、review-out.mp4
            （pipeline/clips/review.py：人物不缩放，浅底、深底并排，原速两遍 + 半速一遍）；按读数填 active（有效帧范围）、dupes（重复帧），
            qa/clips/fit.py 写 arc（动作进度）和 minSeconds；汇总成 take.json，并在挑选记录里登记这一条（待定）
挑：看 clips-work/<动作>/<条目>/readings/*.png 和读数，pick 记下留还是废、废在哪。promote 把留下的那条并进正式片段库
（画幅和归位帧必须和库里的一致），然后跑 sync、贴片烘焙、挂点烘焙。

角色的生成配置在 <角色>/clips/gen.json（画幅、人占画幅多高、底色 keyColor——喂给模型的归位帧 / 关键图垫的底、抠图认的键色、读数查的残留色都跟它走，命令行 --key-color 可盖、归位帧来源、提示词的公共尾巴和反向提示词、各动作的提示词和关键图）。
挑选记录在 <角色>/clips/picks.json（小文件，入库）：每个动作抽过哪些条、各自的事实（种子、档位、耗时）、读数摘要、留 / 废和原因。
正式档（--tier final）要另加 --yes-final 才提交。"""
import argparse, json, os, shutil, subprocess, sys, time
import cv2, numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.normpath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(PUPPET, 'clips'))
import import_i2v as I            # 解码和键色抠图用同一份（clips/import_i2v.py），不另写

REASONS = {'轨迹': '动作的路线 / 幅度不是要的', '挡脸': '手或道具从脸前面过、挡住五官或配饰', '表情': '模型自己加了眨眼、张嘴、变表情', '重复帧': '中途有几帧几乎不动，连播一顿一顿',
           '走样': '人变了：配饰、衣服、比例、画风和归位帧不一样', '切人': '出画、贴边或留白不够', '没归位': '结尾回不到归位帧（位置、姿势差得多）', '抠图': '抠不干净：残留、缺块、闪',
           '手': '手画坏了：多指、少指、融化', '其他': '见备注'}
PY = sys.executable
run = lambda cmd, **k: subprocess.run(cmd, check=True, **k)
jload = lambda p: json.load(open(p, encoding='utf-8'))
def jdump(o, p): os.makedirs(os.path.dirname(p), exist_ok=True); json.dump(o, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
def say(step, msg): print(f'[{step}] {msg}', flush=True)


def place(src_rgba, canvas, frac, foot, M=None):
    """把一张透明图摆进画布。M 不给就按这张图自己的包围盒定（人高 = 画幅高 × frac，水平居中，脚底在 foot × 画幅高）；给了就用同一个变换（关键图和归位帧要同位置）。"""
    W, H = canvas
    if M is None:
        ys, xs = np.where(src_rgba[..., 3] > 128); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        s = frac * H / (y1 - y0 + 1); M = np.float32([[s, 0, W / 2 - s * (x0 + x1 + 1) / 2], [0, s, foot * H - s * (y1 + 1)]])
    pm = src_rgba.astype(np.float32); pm[..., :3] *= pm[..., 3:4] / 255
    w = cv2.warpAffine(pm, M, (W, H), flags=cv2.INTER_AREA if M[0, 0] < 1 else cv2.INTER_CUBIC, borderValue=0); a = np.clip(w[..., 3:4] / 255, 0, 1)
    rgb = np.clip(w[..., :3] / np.clip(a, 1e-3, 1), 0, 255)
    return np.dstack([rgb, a * 255]).round().astype(np.uint8), M


def on_key(rgba, kc):
    a = rgba[..., 3:4].astype(np.float32) / 255
    return (rgba[..., :3] * a + np.array(kc, np.float32) * (1 - a)).round().astype(np.uint8)


def rd(p):
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im is None or im.ndim != 3 or im.shape[2] != 4: raise SystemExit(f'读不了透明图：{p}')
    return cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA)
def wr(p, im): os.makedirs(os.path.dirname(p), exist_ok=True); cv2.imwrite(p, cv2.cvtColor(im, cv2.COLOR_RGBA2BGRA if im.shape[2] == 4 else cv2.COLOR_RGB2BGR))


def write_lossless(frames_rgb, path, fps):
    """无损存一段（ffv1 / mkv，RGB 原样），解出来和输入逐像素相同。"""
    h, w = frames_rgb[0].shape[:2]
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(fps), '-i', '-', '-c:v', 'ffv1', '-pix_fmt', 'bgr0', path], stdin=subprocess.PIPE)
    for f in frames_rgb: p.stdin.write(np.clip(f, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close()
    if p.wait(): raise SystemExit('ffmpeg 写无损视频失败：' + path)


def raw_path(work, seg):
    """这一段取回来的原始结果在哪：raw/<段>/（逐帧 PNG）优先，否则 raw/<段>.mp4 / .mkv / .mov / .webm。没有返回 None。"""
    d = os.path.join(work, 'raw', seg)
    if os.path.isdir(d) and any(f.endswith('.png') for f in os.listdir(d)): return d
    return next((d + e for e in ('.mp4', '.mkv', '.mov', '.webm') if os.path.exists(d + e)), None)


def raw_frames(work, seg, size):
    """原始结果 → 逐帧 float RGB。服务返回的是有损视频（现在：H.264 yuv420p，色度只有一半分辨率）、无损视频、还是逐帧 PNG，这里都认。"""
    p = raw_path(work, seg)
    if not p: raise SystemExit(f'缺原始结果 {os.path.join(work, "raw", seg)}.*')
    if not os.path.isdir(p): return I.decode(p, size)
    out = []
    for f in sorted(x for x in os.listdir(p) if x.endswith('.png')):
        im = cv2.imread(os.path.join(p, f), cv2.IMREAD_COLOR)
        if (im.shape[1], im.shape[0]) != size: raise SystemExit(f'{p}/{f}：{im.shape[1]}×{im.shape[0]}，画布是 {size[0]}×{size[1]}')
        out.append(cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32))
    return np.stack(out)


def away(frames, kc):
    """每一帧离第 0 帧多远：键色抠出来的轮廓和第 0 帧轮廓不一致的像素占第 0 帧人面积的 %。"""
    al = [I.key(f, kc)[..., 3] > 128 for f in frames]; area = max(1, int(al[0].sum()))
    return [round(float((a != al[0]).sum() / area * 100), 2) for a in al]


def find_apex(dist):
    """动作做到头的那一帧：离归位最远的那一段平台（≥ 最大值的 85%）的正中。"""
    d = np.array(dist); top = np.where(d >= 0.85 * d.max())[0]
    runs, s = [], top[0]
    for a, b in zip(top, top[1:]):
        if b != a + 1: runs.append((s, a)); s = b
    runs.append((s, top[-1])); a, b = max(runs, key=lambda r: (r[1] - r[0], d[r[0]:r[1] + 1].sum()))
    return int((a + b) // 2)


def step_home(cfg, char, key_dir, end_key):
    canvas = (cfg['canvas']['w'], cfg['canvas']['h']); kc = cfg['keyColor']
    if canvas[0] % 16 or canvas[1] % 16: raise SystemExit(f'画幅 {canvas[0]}×{canvas[1]} 的宽高要是 16 的倍数（视频模型的要求）')
    src = rd(os.path.join(char, cfg['restSource']))
    if cfg.get('restPlaced'):          # 归位帧来源已经按这个画幅的比例摆好了（只是分辨率不同）：只缩放，不重新摆
        if abs(src.shape[1] / src.shape[0] / (canvas[0] / canvas[1]) - 1) > 0.01: raise SystemExit('restPlaced 的归位帧来源宽高比要和画幅一样（差 1% 以内）')
        home, M = place(src, canvas, None, None, np.float32([[canvas[0] / src.shape[1], 0, 0], [0, canvas[1] / src.shape[0], 0]]))
    else: home, M = place(src, canvas, cfg['charFrac'], cfg['foot'])
    wr(os.path.join(key_dir, 'home_rgba.png'), home); wr(os.path.join(key_dir, 'home.png'), on_key(home, kc))
    ys, xs = np.where(home[..., 3] > 128); bb = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    info = {'canvas': list(canvas), 'charFrac': None if cfg.get('restPlaced') else cfg['charFrac'], 'foot': None if cfg.get('restPlaced') else cfg['foot'], 'restPlaced': bool(cfg.get('restPlaced')), 'restSource': cfg['restSource'], 'place': [[round(float(v), 5) for v in r] for r in M],
            'bbox': bb, 'char_h': bb[3] - bb[1], 'margin_px': {'左': bb[0], '上': bb[1], '右': canvas[0] - bb[2], '下': canvas[1] - bb[3]}}
    if end_key:
        ek, _ = place(rd(os.path.join(char, end_key)), canvas, None, None, M); wr(os.path.join(key_dir, 'end_rgba.png'), ek); wr(os.path.join(key_dir, 'end.png'), on_key(ek, kc)); info['endKey'] = end_key
    jdump(info, os.path.join(key_dir, 'home.json'))
    say('home', f"画幅 {canvas[0]}×{canvas[1]}，人高 {info['char_h']}px（{info['char_h'] / canvas[1]:.0%}），四边留白 {info['margin_px']}" + ('，动作关键图同位置摆好' if end_key else ''))
    return info


def step_gen(cfg, a, work, key_dir, segs):
    env = os.environ
    if not env.get('IMGGEN_URL') or not env.get('IMGGEN_TOKEN'): raise SystemExit('gen 这一步要先设环境变量 IMGGEN_URL 和 IMGGEN_TOKEN（生图服务的地址和令牌）')
    if a.tier == 'final' and not a.yes_final: raise SystemExit('正式档一段十几分钟、要先定好再跑：确认要提交就加 --yes-final')
    if cfg.get('negative'): open(os.path.join(work, 'negative.txt'), 'w', encoding='utf-8').write(cfg['negative'])
    for seg, (first, last, prompt, frames) in segs.items():
        mp4 = os.path.join(work, 'raw', seg + '.mp4'); rec = os.path.join(work, f'gen-{seg}.json')          # 服务返回别的格式时 imggen.py 会按实际格式改扩展名 / 解成 raw/<段>/ 逐帧图
        if raw_path(work, seg) and os.path.exists(rec) and 'gen' not in a.redo: say('gen', f'{seg}：已有原始结果，跳过'); continue
        pf = os.path.join(work, f'prompt-{seg}.txt'); open(pf, 'w', encoding='utf-8').write(prompt)
        cmd = ['/usr/bin/python3' if os.path.exists('/usr/bin/python3') else PY, os.path.join(HERE, 'imggen.py'), 'i2v', '--image', os.path.join(key_dir, first + '.png'), '--end', os.path.join(key_dir, last + '.png'),
               '--prompt-file', pf, '--frames', str(frames), '--width', str(cfg['canvas']['w']), '--height', str(cfg['canvas']['h']), '--seed', str(a.seed), '--tier', a.tier, '--out', mp4, '--record', rec]
        if cfg.get('negative'): cmd += ['--negative-file', os.path.join(work, 'negative.txt')]
        if a.wait_idle is not None: cmd += ['--wait-idle', str(a.wait_idle), '--calm', str(a.calm)]
        say('gen', f'{seg}：提交（{frames} 帧，种子 {a.seed}，{a.tier}）'); run(cmd)


def step_register(cfg, work, key_dir, segs, max_shift):
    """量生成帧和归位帧对不对得上。只看下半身（包围盒下 40%）：上半身在动，下半身该是原地不动的。"""
    size = (cfg['canvas']['w'], cfg['canvas']['h']); kc = cfg['keyColor']; home = rd(os.path.join(key_dir, 'home_rgba.png'))
    ys = np.where((home[..., 3] > 128).any(1))[0]; y0 = int(ys.min() + 0.6 * (ys.max() - ys.min())); band = slice(y0, min(size[1], int(ys.max()) + 20))
    g = lambda im: np.ascontiguousarray((cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2GRAY).astype(np.float32) * (im[..., 3] / 255.0))[band].astype(np.float32))
    win = cv2.createHanningWindow((size[0], band.stop - band.start), cv2.CV_32F); (zx, zy), _ = cv2.phaseCorrelate(g(home), g(home), win)
    out = {'max_shift_px': max_shift, 'note': '生成帧对归位帧：下半身的整体位移（px，相位相关）和下半身轮廓不一致的像素占比。只在该和归位帧一样的那一头量'}
    for seg, (first, last, _p, _n) in segs.items():
        fr = raw_frames(work, seg, size); r = {}
        for end, idx, keyname in (('开头', 1, first), ('结尾', len(fr) - 2, last)):
            if keyname != 'home': continue
            k = I.key(fr[idx], kc); (dx, dy), _ = cv2.phaseCorrelate(g(home), g(k), win); dx -= zx; dy -= zy
            ha, ka = home[band, :, 3] > 128, k[band, :, 3] > 128
            r[end] = {'frame': idx, 'shift_px': [round(dx, 2), round(dy, 2)], 'outline_pct': round(float((ha != ka).sum() / max(1, ha.sum()) * 100), 2), 'over': bool(max(abs(dx), abs(dy)) > max_shift)}
        out[seg] = r
        say('register', f"{seg}：" + '；'.join(f"{e}（第 {v['frame']} 帧）位移 {v['shift_px']}px、轮廓不一致 {v['outline_pct']}%" + ('  ← 超过 %.1fpx' % max_shift if v['over'] else '') for e, v in r.items()))
    jdump(out, os.path.join(work, 'register.json')); return out


def step_split(cfg, a, work):
    size = (cfg['canvas']['w'], cfg['canvas']['h']); kc = cfg['keyColor']; fps = cfg.get('fps', 16); info = {'mode': a.mode}
    go, back = os.path.join(work, 'go.mkv'), os.path.join(work, 'back.mkv')
    if a.mode == 'loop':
        fr = raw_frames(work, 'loop', size); d = away(fr, kc); k = a.apex if a.apex is not None else find_apex(d)
        if not 2 <= k <= len(fr) - 3: raise SystemExit(f'动作做到头的那一帧定在第 {k} 帧，太靠边了（共 {len(fr)} 帧）；用 --apex 指定')
        write_lossless(fr[:k + 1], go, fps); write_lossless(fr[k:], back, fps)
        info.update(frames=len(fr), apex=k, apex_auto=a.apex is None, away_pct=d, go_frames=k + 1, back_frames=len(fr) - k)
        say('split', f"共 {len(fr)} 帧，动作做到头在第 {k} 帧（{'自动找的' if a.apex is None else '指定的'}；离归位 {d[k]}%，最远 {max(d)}%）→ 去程 {k + 1} 帧、回程 {len(fr) - k} 帧")
    else:
        g = raw_frames(work, 'go', size); write_lossless(g, go, fps)
        if a.back == 'reverse': write_lossless(g[::-1], back, fps); info.update(back='去程倒放')
        else: write_lossless(raw_frames(work, 'back', size), back, fps); info.update(back='单独生成')
        info.update(go_frames=len(g)); say('split', f"去程 {len(g)} 帧；回程 = {info['back']}")
    jdump(info, os.path.join(work, 'split.json')); return info


def step_matte(works):
    """给若干条的去程、回程出主体蒙版，**攒成一批一次发完**。抠图模型和视频模型在服务上是两类，来回切一次要卸载 / 重载十几秒：
    所以先等视频队列清空（没有在跑、在排的视频任务），再把这一批的帧连着发；发之前、发之后各记一次服务的换模型次数。"""
    py = '/usr/bin/python3' if os.path.exists('/usr/bin/python3') else PY
    run([py, os.path.join(HERE, 'imggen.py'), 'wait', '--for', 'image'])
    h0 = json.loads(subprocess.run([py, os.path.join(HERE, 'imggen.py'), 'health'], capture_output=True, text=True).stdout or '{}'); t0 = time.time(); n = 0
    for work in works:
        for s in ('go', 'back'):
            say('matte', f'{os.path.relpath(work, PUPPET)} {s}：逐帧出主体蒙版（clips/model_matte.py，已有的帧跳过）')
            run([py, os.path.join(PUPPET, 'clips', 'model_matte.py'), os.path.join(work, s + '.mkv'), os.path.join(work, 'matte-' + s)]); n += len(os.listdir(os.path.join(work, 'matte-' + s)))
    h1 = json.loads(subprocess.run([py, os.path.join(HERE, 'imggen.py'), 'health'], capture_output=True, text=True).stdout or '{}')
    info = {'videos': len(works) * 2, 'frames': n, 'seconds': round(time.time() - t0, 1), 'mode_switches_before': h0.get('mode_switches'), 'mode_switches_after': h1.get('mode_switches'),
            'note': '这一批蒙版期间服务换模型的次数 = after − before（含别人的请求引起的）；正常是 1（视频 → 生图），下一个视频任务来时再切回去 1 次'}
    for work in works: jdump(info, os.path.join(work, 'matte.json'))
    say('matte', f"这一批 {info['videos']} 段 {n} 帧，用时 {info['seconds']}s；服务换模型次数 {info['mode_switches_before']} → {info['mode_switches_after']}")


def step_stage(cfg, a, char, work, key_dir, label):
    lib = os.path.join(work, 'lib'); shutil.rmtree(lib, ignore_errors=True); os.makedirs(os.path.join(lib, 'frames'))
    home = rd(os.path.join(key_dir, 'home_rgba.png')); wr(os.path.join(lib, 'frames', 'idle.png'), home)
    ys, xs = np.where(home[..., 3] > 128); real = os.path.join(char, 'clips', 'clips.json'); base = jload(real) if os.path.exists(real) else {}
    A = a.action
    jdump({'character': os.path.basename(os.path.normpath(char)), 'version': 1, 'canvas': cfg['canvas'],
           'anchor': {'x': int(round((xs.min() + xs.max() + 1) / 2)), 'y': int(ys.max()) + 1, 'note': '脚底中点；呼吸绕这一点缩放'},
           'breath': base.get('breath', {'amp': 0.006, 'period': 3.6}), 'rest': 'idle',
           'poses': {'idle': {'label': '归位（待机）', 'frame': 'frames/idle.png'}, A: {'label': f'{label}（保持帧，取自生成帧）', 'frame': f'frames/{A}.png'}},
           'clips': {f'{A}_in': {'label': f'归位 → {label}', 'from': 'idle', 'to': A, 'fps': cfg.get('fps', 16), 'frames': []},
                     f'{A}_out': {'label': f'{label} → 归位', 'from': A, 'to': 'idle', 'fps': cfg.get('fps', 16), 'frames': []}},
           'actions': [{'id': A, 'label': label, 'in': f'{A}_in', 'pose': A, 'out': f'{A}_out'}]}, os.path.join(lib, 'clips.json'))
    cmd = [PY, os.path.join(PUPPET, 'clips', 'import_i2v.py'), lib, '--action', A, '--go', os.path.join(work, 'go.mkv'), '--back', os.path.join(work, 'back.mkv'), '--key-color', ','.join(map(str, cfg['keyColor']))]
    if a.mode == 'loop' or a.back == 'reverse': cmd += ['--xfade', '0']          # 去程末帧和回程首帧本来就是同一张生成帧，不用交叉淡化
    if os.path.isdir(os.path.join(work, 'matte-go')): cmd += ['--model-matte', os.path.join(work, 'matte-go'), os.path.join(work, 'matte-back')]
    # 抠法的开关原样传给 import_i2v.py；不给就是它的默认（现在：轮廓按亮度重建、静止锁定都开）
    if a.edge: cmd += ['--edge', a.edge]
    if a.static_lock: cmd += ['--static-lock']          # 默认关：开了以后动作中晃动的大色块会一块块被贴回归位帧的位置，人身上裂出台阶（2026-10-08 用户看片发现）
    if a.no_static_lock: cmd += ['--no-static-lock']
    if a.no_chroma:
        if not os.path.isdir(os.path.join(work, 'matte-go')): raise SystemExit('--no-chroma（底色不是键色）只能靠模型蒙版抠：要同时给 --matte')
        cmd += ['--no-chroma']
    say('stage', '抠图 + 对归位帧校色 + 写帧（clips/import_i2v.py）'); r = subprocess.run(cmd, capture_output=True, text=True)
    open(os.path.join(work, 'import.log'), 'w', encoding='utf-8').write(r.stdout + r.stderr)
    if r.returncode: raise SystemExit('import_i2v.py 失败：\n' + (r.stderr or r.stdout)[-1500:])
    r = subprocess.run([PY, os.path.join(PUPPET, 'clips', 'sync.py'), lib], capture_output=True, text=True); open(os.path.join(work, 'sync.log'), 'w', encoding='utf-8').write(r.stdout + r.stderr)
    say('stage', 'sync.py：' + (r.stdout.strip().splitlines() or ['（没输出）'])[-1] + ('' if r.returncode == 0 else '  ← 没通过，见 sync.log'))
    return lib, r.returncode == 0


def step_check(cfg, a, char, work, lib, extra):
    A = a.action; rd_dir = os.path.join(work, 'readings'); os.makedirs(rd_dir, exist_ok=True); name = os.path.basename(os.path.normpath(char))
    regions = os.path.join(PUPPET, 'qa', 'clips', name + '.json'); L = jload(os.path.join(lib, 'clips.json')); res = {}
    for side, flag in (('in', '--last'), ('out', '--first')):
        cmd = [PY, os.path.join(PUPPET, 'qa', 'clips', 'checks.py'), os.path.join(lib, 'frames', f'{A}_{side}'), '--rest', os.path.join(lib, 'frames', 'idle.png'), flag, os.path.join(lib, 'frames', A + '.png'),
               '--key-color', ','.join(map(str, cfg['keyColor'])), '--name', side, '--out', rd_dir] + (['--regions', regions] if os.path.exists(regions) else [])
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode: raise SystemExit('checks.py 失败：\n' + r.stderr[-1500:])
        open(os.path.join(rd_dir, side + '.txt'), 'w', encoding='utf-8').write(r.stdout); R = jload(os.path.join(rd_dir, side + '.json')); res[side] = R
        # 有效帧范围、重复帧：按读数填（import 在去程末尾加的淡化帧、回程末尾的混合帧单列一段，照 clips/ 的写法）
        clip = L['clips'][f'{A}_{side}']; m = R['motion']; imp = clip.get('import', {}); tail = imp.get('xfade_frames') or imp.get('settle_frames')
        act = [[m['active_first'], m['active_last']]] if m['active_first'] is not None else []
        if tail and act and tail[0] > act[0][1]: act.append(tail)
        clip['active'] = act; clip['dupes'] = [i for i in m['stalls']]; clip['notes'] = f"流水线按读数自动填的：动作在第 {m['active_first']}–{m['active_last']} 帧，中途几乎不动的帧 {m['stalls']}。入正式库前对着标注图核一遍。"
    L2 = jload(os.path.join(lib, 'clips.json'))
    for side in ('in', 'out'):
        for k in ('active', 'dupes', 'notes'): L2['clips'][f'{A}_{side}'][k] = L['clips'][f'{A}_{side}'][k]
    jdump(L2, os.path.join(lib, 'clips.json'))
    for side in ('in', 'out'): run([PY, os.path.join(PUPPET, 'qa', 'clips', 'fit.py'), lib, f'{A}_{side}', '--write-arc', '--write-min', str(a.min_seconds)], stdout=subprocess.DEVNULL, cwd=PUPPET)
    run([PY, os.path.join(PUPPET, 'clips', 'sync.py'), lib], stdout=subprocess.DEVNULL)
    L = jload(os.path.join(lib, 'clips.json'))
    # 摘要 + 提示（提示只是「读数上看着像」，留还是废由人定）
    s, hints = {}, []
    for side, R in res.items():
        ids = {k: v for k, v in R['identity'].items() if 'error' not in v}
        s[side] = {'frames': R['frames'], 'min_margin_pct_of_canvas': R['cut']['min_margin_pct_of_canvas'], 'edge_pixels': R['cut']['edge_visible_pixels_max'],
                   'jump_start': R['seam']['jump_0_1']['color'], 'jump_end': R['seam']['jump_end']['color'], 'sharp_mid_over_rest': R['sharpness_mid_over_rest'],
                   'active': [R['motion']['active_first'], R['motion']['active_last']], 'stalls': R['motion']['stalls'], 'peak_moved_pct': R['motion']['peak'],
                   'residue_opaque_max': R['matte']['residue_opaque_max'], 'semi_width_pm': R['matte']['semi_width_mean_pm'], 'feet_bottom_pm': R['feet']['bottom_max_pm'], 'feet_center_pm': R['feet']['center_max_pm'],
                   'identity_worst': {k: {'area': v['worst_area']['ratio'], 'dE': v['worst_color']['dE'], 'pos_pm': v['worst_pos']['pm'], 'missing': v['frames_missing']} for k, v in ids.items()},
                   'natural_seconds': round((sum(b - c + 1 for c, b in L['clips'][f'{A}_{side}']['active']) + 2 if L['clips'][f'{A}_{side}']['active'] else R['frames']) / L['clips'][f'{A}_{side}']['fps'], 2)}
        zh = '去程' if side == 'in' else '回程'
        if R['cut']['edge_visible_pixels_max'] or R['cut']['min_margin_pct_of_canvas'] < 3: hints.append(f"切人？{zh}最小留白只有画布的 {R['cut']['min_margin_pct_of_canvas']}%")
        if R['motion']['stalls']: hints.append(f"重复帧？{zh}第 {R['motion']['stalls']} 帧几乎不动")
        miss = {k: v['frames_missing'] for k, v in ids.items() if v['frames_missing']}
        if miss: hints.append(f"挡脸 / 走样？{zh}这些块有帧面积掉到一半以下：{miss}")
        if R['matte']['residue_opaque_max'] > 20: hints.append(f"抠图？{zh}不透明处键色残留最多 {R['matte']['residue_opaque_max']} 个像素")
    for seg, r in extra.get('register', {}).items():
        if isinstance(r, dict):
            for end, v in r.items():
                if isinstance(v, dict) and v.get('over'): hints.append(f"没归位？{seg} {end}的生成帧和归位帧差 {v['shift_px']}px")
    # 给人连续看的 1:1 片子（去程、回程各一个，浅底 | 深底并排）。读数和抽帧看不出裂缝、闪边——这一条挑之前必须有人看过它
    for side in ('in', 'out'): run([PY, os.path.join(HERE, 'review.py'), lib, '--clip', f'{A}_{side}', '--crop', '--out', os.path.join(rd_dir, f'review-{side}.mp4')], stdout=subprocess.DEVNULL)
    say('check', f"连续看的 1:1 片子：{os.path.relpath(rd_dir, PUPPET)}/review-in.mp4、review-out.mp4（挑之前必须看）")
    for h in hints: say('check', '提示：' + h)
    say('check', f"读数和标注图在 {os.path.relpath(rd_dir, PUPPET)}/（in.png、out.png）")
    return s, hints


def picks_path(char): return os.path.join(char, 'clips', 'picks.json')
def picks_load(char):
    p = picks_path(char)
    return jload(p) if os.path.exists(p) else {'_说明': '片段的挑选记录：每个动作抽过哪些条、各自的事实和读数摘要、留还是废、废在哪。pipeline/clips/clipflow.py 写；verdict 和 reasons 是人定的（pick 命令），hints 只是读数上的提示。',
                                                '原因表': REASONS, 'actions': {}}


def prepare(a):
    """一条的参数 → 这一条要用的东西（配置、工作目录、各段的首尾帧和提示词）。不做事。"""
    char = a.char.rstrip('/'); cfg = jload(os.path.join(char, 'clips', 'gen.json')); spec = (cfg.get('actions') or {}).get(a.action, {})
    if a.canvas: w, h = map(int, a.canvas.lower().split('x')); cfg['canvas'] = {'w': w, 'h': h}
    for k in ('charFrac', 'foot'):
        if getattr(a, k) is not None: cfg[k] = getattr(a, k)
    if a.key_color: cfg['keyColor'] = [int(v) for v in a.key_color.split(',')]          # 底色：归位帧 / 关键图垫的底、抠图认的键色、读数里查的残留色，都是这一个值
    label = a.label or spec.get('label') or a.action; take = a.take or f'{a.mode}-{a.tier}-s{a.seed}'
    work = os.path.join(char, 'clips-work', a.action, take); os.makedirs(os.path.join(work, 'raw'), exist_ok=True)
    key_dir = os.path.join(work, 'key'); tail = spec.get('tail', cfg.get('promptTail', ''))          # 动作可以有自己的提示词尾巴（actions.<动作>.tail）和帧数（.frames）
    def prompt(kind):
        t = (open(a.prompt_file, encoding='utf-8').read().strip() if a.prompt_file and kind in ('loop', 'go') else None) or spec.get(kind)
        if not t: raise SystemExit(f'动作「{a.action}」没有 {kind} 的提示词：在 gen.json 的 actions.{a.action}.{kind} 里写，或用 --prompt-file')
        return t + tail
    end_key = a.end_key or spec.get('endKey')
    if a.mode == 'pair' and not end_key: raise SystemExit('首尾帧式要有动作关键图：gen.json 的 actions.<动作>.endKey，或 --end-key（透明图，和归位帧来源同一套坐标）')
    nf = dict(cfg.get('frames', {})); nf.update({k: spec['frames'] for k in ('loop', 'pair') if spec.get('frames')}); segs = {'loop': ('home', 'home', None, a.frames or nf.get('loop', 49))} if a.mode == 'loop' else {'go': ('home', 'end', None, a.frames or nf.get('pair', 25))}
    if a.mode == 'pair' and a.back == 'gen': segs['back'] = ('end', 'home', None, a.frames or nf.get('pair', 25))
    segs = {k: (f, l, prompt(k), n) for k, (f, l, _p, n) in segs.items()}
    return {'a': a, 'char': char, 'cfg': cfg, 'label': label, 'take': take, 'work': work, 'key_dir': key_dir, 'segs': segs, 'end_key': end_key if a.mode == 'pair' else None}


# 一条的四个阶段。run 是一条从头走到尾；batch 是多条一起、按阶段走——先把这一批视频都生成完，再统一出蒙版（见 cmd_batch）。
def phase_gen(c):
    a = c['a']; print(f"== {os.path.basename(c['char'])} / {a.action} / {c['take']}（{'单图往返' if a.mode == 'loop' else '首尾帧式' + ('，回程倒放' if a.back == 'reverse' else '')}，{a.tier}）==")
    c['home'] = step_home(c['cfg'], c['char'], c['key_dir'], c['end_key'])
    if not a.skip_gen: step_gen(c['cfg'], a, c['work'], c['key_dir'], c['segs'])
    missing = [s for s in c['segs'] if not raw_path(c['work'], s)]
    if missing: raise SystemExit(f"缺原始视频 raw/{missing[0]}.*（--skip-gen 时要先把视频或逐帧图放进去）")
def phase_split(c):
    c['reg'] = step_register(c['cfg'], c['work'], c['key_dir'], c['segs'], c['a'].max_shift); c['split'] = step_split(c['cfg'], c['a'], c['work'])
def phase_finish(c):
    a, char, cfg, work, segs, take, label, home, reg, split = c['a'], c['char'], c['cfg'], c['work'], c['segs'], c['take'], c['label'], c['home'], c['reg'], c['split']
    lib, sync_ok = step_stage(cfg, a, char, work, c['key_dir'], label)
    summary, hints = step_check(cfg, a, char, work, lib, {'register': reg})
    if not sync_ok: hints.append('sync.py 没通过（缺帧 / 尺寸不对 / 人物贴边），见 sync.log')
    gens = {s: jload(os.path.join(work, f'gen-{s}.json')) for s in segs if os.path.exists(os.path.join(work, f'gen-{s}.json'))}
    rec = {'take': take, 'mode': a.mode, 'back': a.back if a.mode == 'pair' else None, 'tier': a.tier, 'seed': a.seed, 'canvas': [cfg['canvas']['w'], cfg['canvas']['h']], 'char_h_frac': round(home['char_h'] / cfg['canvas']['h'], 3),
           'gen': gens, 'gen_seconds_total': round(sum(g.get('gen_seconds') or 0 for g in gens.values()), 1), 'queue_seconds_total': round(sum(g.get('queue_seconds') or 0 for g in gens.values()), 1),
           'prompts': {s: v[2] for s, v in segs.items()}, 'register': {k: v for k, v in reg.items() if k in segs}, 'split': {k: v for k, v in split.items() if k != 'away_pct'},
           'model_matte': bool(a.matte), 'readings': summary, 'hints': hints, 'work': os.path.relpath(work, char), 'made_at': time.strftime('%Y-%m-%d %H:%M:%S')}
    jdump(rec, os.path.join(work, 'take.json'))
    P = picks_load(char); act = P['actions'].setdefault(a.action, {'label': label, 'takes': []}); old = next((t for t in act['takes'] if t['take'] == take), None)
    entry = {k: rec[k] for k in ('take', 'mode', 'back', 'tier', 'seed', 'canvas', 'char_h_frac', 'gen_seconds_total', 'queue_seconds_total', 'prompts', 'readings', 'hints', 'made_at')}
    entry.update(model=next((g.get('model') for g in gens.values()), None), verdict=(old or {}).get('verdict', 'pending'), reasons=(old or {}).get('reasons', []), note=(old or {}).get('note', ''))
    act['takes'] = [t for t in act['takes'] if t['take'] != take] + [entry]; jdump(P, picks_path(char))
    print(f"完成：{os.path.relpath(work, PUPPET)}/take.json；挑选记录里登记为「待定」。看完标注图后：clipflow.py pick {a.char} {a.action} {take} keep|reject --reason …")




def cmd_run(a):
    c = prepare(a); phase_gen(c); phase_split(c)
    if a.matte: step_matte([c['work']])
    phase_finish(c)


def cmd_batch(a):
    """多条一起跑，按阶段走：① 全部条目的视频先连着生成完（同类请求连着发）；② 各自量对位、切段；③ 这一批的蒙版帧攒成一批一次发完
    （抠图和视频在服务上是两类模型，切一次要卸载 / 重载十几秒——所以不许「生成一段、抠一段」交替）；④ 各自入暂存库、出读数。
    条目清单：文本文件，一行一条，写 run 的参数（不带角色目录），例如  wave --mode loop --seed 1"""
    import shlex
    lines = [l.strip() for l in open(a.jobs, encoding='utf-8') if l.strip() and not l.strip().startswith('#')]
    ap = build_parser(); cs = []
    for l in lines:
        b = ap.parse_args(['run', a.char] + shlex.split(l) + (['--wait-idle', str(a.wait_idle), '--calm', str(a.calm)] if a.wait_idle is not None else []) + (['--skip-gen'] if a.skip_gen else []))
        cs.append(prepare(b))
    say('batch', f'{len(cs)} 条；先全部生成，再统一出蒙版')
    for c in cs: phase_gen(c)
    for c in cs: phase_split(c)
    ms = [c['work'] for c in cs if c['a'].matte or a.matte]
    if ms: step_matte(ms)
    for c in cs: phase_finish(c)


def cmd_pick(a):
    char = a.char.rstrip('/'); P = picks_load(char); act = P['actions'].get(a.action) or sys.exit(f'挑选记录里没有动作 {a.action}')
    t = next((t for t in act['takes'] if t['take'] == a.take), None) or sys.exit(f"没有这一条：{a.take}（有：{'、'.join(t['take'] for t in act['takes'])}）")
    rs = [r for r in (a.reason or '').replace('，', ',').split(',') if r]; bad = [r for r in rs if r not in REASONS]
    if bad: sys.exit(f"原因只能从这里选：{'、'.join(REASONS)}（不认识：{'、'.join(bad)}）；别的写进 --note 并选「其他」")
    if a.verdict == 'reject' and not rs: sys.exit('废掉的要写原因（--reason），这是以后估重抽率的依据')
    if a.verdict == 'keep' and not a.watched: sys.exit('留下的那条要写明谁连续看过 1:1 片子（--watched 名字）：readings/review-in.mp4、review-out.mp4。只看读数和抽帧不算看过')
    t.update(verdict=a.verdict, reasons=rs, note=a.note or t.get('note', ''), watched_by=a.watched or t.get('watched_by'), decided_at=time.strftime('%Y-%m-%d %H:%M:%S')); jdump(P, picks_path(char))
    print(f"{a.action} / {a.take}：{'留' if a.verdict == 'keep' else '废'}" + (f"（{'、'.join(rs)}）" if rs else ''))


def cmd_report(a):
    P = picks_load(a.char.rstrip('/')); tot = {'n': 0, 'keep': 0, 'reject': 0, 'pending': 0, 'sec': 0.0}; why = {}
    for name, act in P['actions'].items():
        ts = act['takes']; k = [t for t in ts if t['verdict'] == 'keep']; r = [t for t in ts if t['verdict'] == 'reject']; sec = sum(t.get('gen_seconds_total') or 0 for t in ts)
        print(f"{name}（{act.get('label', '')}）：抽了 {len(ts)} 条，留 {len(k)}、废 {len(r)}、待定 {len(ts) - len(k) - len(r)}；生成共 {sec:.0f}s" + (f"；留一条平均要抽 {len(ts) / len(k):.1f} 条" if k else ''))
        for t in ts:
            v = {'keep': '留', 'reject': '废', 'pending': '待定'}[t['verdict']]
            print(f"   {t['take']:<22} {v}  {'、'.join(t['reasons']) or '—'}  生成 {t.get('gen_seconds_total', 0)}s  {t.get('note', '')}" + (f"   提示：{'；'.join(t['hints'])}" if t['verdict'] == 'pending' and t.get('hints') else ''))
            for x in t['reasons']: why[x] = why.get(x, 0) + 1
        tot['n'] += len(ts); tot['keep'] += len(k); tot['reject'] += len(r); tot['sec'] += sec
    done = tot['keep'] + tot['reject']
    print(f"合计：{tot['n']} 条，留 {tot['keep']}、废 {tot['reject']}、待定 {tot['n'] - done}；生成共 {tot['sec']:.0f}s" + (f"；已定的里面废掉 {tot['reject'] / done:.0%}" if done else '') + (f"；废的原因：{why}" if why else ''))


def cmd_promote(a):
    char = a.char.rstrip('/'); work = os.path.join(char, 'clips-work', a.action, a.take); src = os.path.join(work, 'lib'); dst = a.lib or os.path.join(char, 'clips')
    P = picks_load(char); t = next((t for t in (P['actions'].get(a.action) or {'takes': []})['takes'] if t['take'] == a.take), None)
    if not t or t['verdict'] != 'keep': sys.exit('只能并入挑选记录里标成「留」的那一条（先 pick … keep）')
    S, D = jload(os.path.join(src, 'clips.json')), jload(os.path.join(dst, 'clips.json'))
    if S['canvas'] != D['canvas']: sys.exit(f"画幅不一致：这一条 {S['canvas']}，片段库 {D['canvas']}。一个库只有一个画幅和一张归位帧")
    sr, dr = rd(os.path.join(src, S['poses'][S['rest']]['frame'])), rd(os.path.join(dst, D['poses'][D['rest']]['frame']))
    mism = float(((sr[..., 3] > 128) != (dr[..., 3] > 128)).sum() / max(1, (dr[..., 3] > 128).sum()) * 100)
    if mism > 0.5: sys.exit(f'这一条的归位帧和片段库的归位帧不是同一张（轮廓不一致 {mism:.1f}%）：片段只能并进用同一张归位帧做的库')
    A = a.action
    for name in (f'{A}_in', f'{A}_out'):
        d = os.path.join(dst, 'frames', name); shutil.rmtree(d, ignore_errors=True); shutil.copytree(os.path.join(src, 'frames', name), d)
    shutil.copy(os.path.join(src, 'frames', A + '.png'), os.path.join(dst, 'frames', A + '.png'))
    D = jload(os.path.join(dst, 'clips.json'))                    # 读最新的，只加 / 换这个动作的键
    D['poses'][A] = {k: v for k, v in S['poses'][A].items() if k != 'patches'}; D['clips'][f'{A}_in'] = S['clips'][f'{A}_in']; D['clips'][f'{A}_out'] = S['clips'][f'{A}_out']
    D['actions'] = [x for x in D['actions'] if x['id'] != A] + [x for x in S['actions'] if x['id'] == A]; jdump(D, os.path.join(dst, 'clips.json'))
    run([PY, os.path.join(PUPPET, 'clips', 'sync.py'), dst])
    if not a.lib:                                                 # 正式库：重烘贴片和挂点
        for script in (os.path.join('clips', 'bake_patches.py'), os.path.join('host-clips', 'bake_points.py')):
            r = subprocess.run([PY, os.path.join(PUPPET, script), char]); print(f"{script}：{'好了' if r.returncode == 0 else '没跑通，手动看一下'}")
        run([PY, os.path.join(PUPPET, 'clips', 'sync.py'), dst])
    t['promoted_at'] = time.strftime('%Y-%m-%d %H:%M:%S'); jdump(P, picks_path(char)); print(f'{A} / {a.take} 并进了 {os.path.relpath(dst, PUPPET)}')


def build_parser():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); sub = ap.add_subparsers(dest='cmd', required=True)
    r = sub.add_parser('run'); r.add_argument('char'); r.add_argument('action'); r.add_argument('--mode', choices=['loop', 'pair'], required=True); r.add_argument('--seed', type=int, required=True)
    r.add_argument('--tier', choices=['draft', 'final'], default='draft'); r.add_argument('--yes-final', action='store_true'); r.add_argument('--back', choices=['gen', 'reverse'], default='gen')
    r.add_argument('--prompt-file'); r.add_argument('--end-key'); r.add_argument('--label'); r.add_argument('--take'); r.add_argument('--frames', type=int); r.add_argument('--apex', type=int)
    r.add_argument('--edge', choices=['luma', 'soft']); r.add_argument('--no-static-lock', action='store_true'); r.add_argument('--static-lock', action='store_true'); r.add_argument('--no-chroma', action='store_true'); r.add_argument('--canvas'); r.add_argument('--key-color'); r.add_argument('--char-frac', dest='charFrac', type=float); r.add_argument('--foot', type=float); r.add_argument('--matte', action='store_true')
    r.add_argument('--wait-idle', type=float, nargs='?', const=7200.0); r.add_argument('--calm', type=float, default=90.0); r.add_argument('--skip-gen', action='store_true'); r.add_argument('--redo', default=''); r.add_argument('--max-shift', type=float, default=1.5); r.add_argument('--min-seconds', type=float, default=0.3)
    r.set_defaults(fn=cmd_run)
    p = sub.add_parser('pick'); p.add_argument('char'); p.add_argument('action'); p.add_argument('take'); p.add_argument('verdict', choices=['keep', 'reject']); p.add_argument('--reason'); p.add_argument('--note'); p.add_argument('--watched', help='谁连续看过 1:1 片子（留下的那条必填）'); p.set_defaults(fn=cmd_pick)
    q = sub.add_parser('report'); q.add_argument('char'); q.set_defaults(fn=cmd_report)
    m = sub.add_parser('promote'); m.add_argument('char'); m.add_argument('action'); m.add_argument('take'); m.add_argument('--lib'); m.set_defaults(fn=cmd_promote)
    bt = sub.add_parser('batch'); bt.add_argument('char'); bt.add_argument('jobs'); bt.add_argument('--matte', action='store_true'); bt.add_argument('--skip-gen', action='store_true')
    bt.add_argument('--wait-idle', type=float, nargs='?', const=7200.0); bt.add_argument('--calm', type=float, default=90.0); bt.set_defaults(fn=cmd_batch)
    return ap


def main():
    a = build_parser().parse_args(); a.fn(a)


if __name__ == '__main__':
    main()
