#!/usr/bin/env python3
"""空脸库的验收片：每个动作 × (default / angry / talk) 出 1:1（1920×1080 整页）和 head3x（头部 3 倍，1320×1020），
default 另出一条十字标版（红 = 发卡真实位置、绿 = 贴上去的左眼外眼角），再出「旧做法 | 新做法」并排（default，1:1 和 head3x 各一）。

    python3 puppet/pipeline/clips/accept_render.py <新库目录> <输出目录> [--acts a,b] [--perfeat（只出 刚性|逐五官 并排）] [--old-lib <旧库目录> --old-act 新动作前缀=旧动作,…]

产物：<输出>/<动作>-{default,angry,talk}-{1to1,head3x}.mp4、<动作>-default-head3x-cross.mp4、<动作>-vs-old-{1to1,head3x}.mp4（有 --old-lib 才出）。
渲染走 tools/render.mjs（页 clips/demo-host.html?show=blankface）；头部裁切和 meta 用 RENDER_CLIP / RENDER_META。"""
import json, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.normpath(os.path.join(HERE, '..', '..'))
CLIP = '1180,280,440,340'


def render(lib, act, extra, out, scale=1, clip=False, meta=False):
    tmp = out + '.tmp'; shutil.rmtree(tmp, ignore_errors=True)
    env = dict(os.environ); 
    if clip: env['RENDER_CLIP'] = CLIP
    if meta: env['RENDER_META'] = '1'
    cmd = ['node', 'tools/render.mjs', 'clips', '--page', 'demo-host.html', '--query', f'lib={lib}&show=blankface&act={act}{extra}', '--out', tmp] + (['--scale', str(scale)] if scale != 1 else []) + (['--keep-frames'] if meta else [])
    r = subprocess.run(cmd, cwd=PUPPET, env=env, capture_output=True, text=True)
    if r.returncode: sys.exit(f'渲染失败 {lib} {act}{extra}：' + (r.stdout + r.stderr)[-500:])
    mp4 = [f for f in os.listdir(tmp) if f.endswith('.mp4')][0]; shutil.move(os.path.join(tmp, mp4), out)
    if not meta: shutil.rmtree(tmp, ignore_errors=True)
    return tmp


def hstack(a, b, out):
    f = '[0:v]tpad=stop_mode=clone:stop_duration=1[a];[1:v]tpad=stop_mode=clone:stop_duration=1[b];[a][b]hstack=inputs=2:shortest=0'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-i', b, '-filter_complex', f, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', out], check=True)


def main():
    a = sys.argv[1:]; opt = {}
    only_pf = '--perfeat' in a
    if only_pf: a.remove('--perfeat')
    for k in ('--acts', '--old-lib', '--old-act'):
        if k in a: i = a.index(k); opt[k] = a[i + 1]; a = a[:i] + a[i + 2:]
    if len(a) != 2: sys.exit(__doc__)
    libdir, out = os.path.abspath(a[0].rstrip('/')), os.path.abspath(a[1]); os.makedirs(out, exist_ok=True); lib = os.path.basename(libdir)
    L = json.load(open(os.path.join(libdir, 'clips.json'), encoding='utf-8')); acts = opt['--acts'].split(',') if '--acts' in opt else [x['id'] for x in L['actions']]
    oldmap = dict(x.split('=') for x in opt['--old-act'].split(',')) if '--old-act' in opt else {}
    if only_pf:                      # --perfeat：只出「刚性 | 逐五官」并排（左 = 整头一个刚性变换，右 = ?perfeat=1 逐五官），default 和 angry，1:1 和 head3x
        for act in acts:
            for name, extra in (('default', ''), ('angry', '&face=angry')):
                for kind, sc, cl in (('1to1', 1, False), ('head3x', 3, True)):
                    render(lib, act, extra, f'{out}/_r.mp4', sc, clip=cl); render(lib, act, extra + '&perfeat=1', f'{out}/_p.mp4', sc, clip=cl)
                    hstack(f'{out}/_r.mp4', f'{out}/_p.mp4', f'{out}/{act}-{name}-{kind}-rigid-vs-perfeat.mp4'); os.remove(f'{out}/_r.mp4'); os.remove(f'{out}/_p.mp4')
            print(act, '逐五官并排', flush=True)
        print('好了：', out); return
    for act in acts:
        for name, extra in (('default', ''), ('angry', '&face=angry'), ('talk', '&talk=1')):
            render(lib, act, extra, f'{out}/{act}-{name}-1to1.mp4'); render(lib, act, extra, f'{out}/{act}-{name}-head3x.mp4', 3, clip=True)
            print(act, name, flush=True)
        tmp = render(lib, act, '', f'{out}/{act}-default-head3x-cross.tmp.mp4', 3, clip=True, meta=True); fd = os.path.join(tmp, [d for d in os.listdir(tmp) if d.startswith('frames')][0])
        fr = sorted(f for f in os.listdir(fd) if f.endswith('.png')); src = os.path.join(out, f'_cross_{act}'); shutil.rmtree(src, ignore_errors=True); os.makedirs(src); meta = []
        for i, f in enumerate(fr): shutil.copy(os.path.join(fd, f), os.path.join(src, f'f{i:04d}.png')); meta.append({'i': i, 'file': json.load(open(os.path.join(fd, f.replace('.png', '.meta.json'))))['file']})
        json.dump(meta, open(os.path.join(src, 'meta.json'), 'w')); os.remove(f'{out}/{act}-default-head3x-cross.tmp.mp4')
        r = subprocess.run([sys.executable, os.path.join(PUPPET, 'clips', 'cross_markers.py'), libdir, src, src + '_x', '--out-mp4', f'{out}/{act}-default-head3x-cross.mp4'], capture_output=True, text=True); print(act, '十字标：', r.stdout.strip() or r.stderr[-300:])
        shutil.rmtree(src, ignore_errors=True); shutil.rmtree(src + '_x', ignore_errors=True); shutil.rmtree(tmp, ignore_errors=True)
        if '--old-lib' in opt:
            old = os.path.basename(opt['--old-lib'].rstrip('/')); oa = next((v for k, v in oldmap.items() if act.startswith(k)), None)
            if oa:
                render(old, oa, '', f'{out}/_old-{act}-1to1.mp4'); render(old, oa, '', f'{out}/_old-{act}-head3x.mp4', 3, clip=True)
                for k in ('1to1', 'head3x'): hstack(f'{out}/_old-{act}-{k}.mp4', f'{out}/{act}-default-{k}.mp4', f'{out}/{act}-vs-old-{k}.mp4'); os.remove(f'{out}/_old-{act}-{k}.mp4')
    print('好了：', out)


if __name__ == '__main__':
    main()
