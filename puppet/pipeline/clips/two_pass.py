#!/usr/bin/env python3
"""两遍法建库：定位用「有五官那遍 A」，贴脸画在「空脸那遍 B」上（B 是用 A 做控制视频、起始图是空脸归位帧生出来的）。

    python3 puppet/pipeline/clips/two_pass.py puppet/characters/<角色> <新库名> --like <有脸的库> --dress-from <已有的空脸库> \
        --home <空脸归位帧 rgba.png> --orig-home <原归位帧.png> --rest-a <有五官归位帧 rgba.png> \
        --clip <片段名>=<B 的逐帧 PNG 目录>:<A 的逐帧 PNG 目录>[,label=…] [--clip …] [--per-feature]

做的事：
  1. make_blank_lib.py 用 B 搭空脸库（首末帧要和空脸归位帧逐像素相同）；
  2. dress.json：沿用 --dress-from 库的 ink / refine / noBrow，加 twoPass = {restA, srcA:{片段: A 的帧目录}}；
  3. dress.py：烘贴片 → track_head.py（对 A 的帧、用有五官归位帧做参照去跟踪：眼、嘴看得见，SIFT 特征点多；跟踪结果原样记到 B 的帧上；
     遮挡物、面部遮罩仍然逐帧从 B 这一帧自己算）→ 体检。
--per-feature：另外给每个五官（左眼、右眼、嘴）量 A 里的逐帧实测位置（clips/track_head.py --per-feature），存 headTracks[帧].feat；播放器 ?perfeat=1 才用，默认行为不变。
A、B 帧数必须一样、同尺寸（832×1104）。路径都相对当前目录或绝对路径。"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.normpath(os.path.join(HERE, '..', '..'))


def main():
    a = sys.argv[1:]; opt = {'--clip': []}; pos = []; it = iter(a)
    for x in it:
        if x == '--per-feature': opt[x] = True
        elif x in ('--like', '--dress-from', '--home', '--orig-home', '--rest-a'): opt[x] = next(it)
        elif x == '--clip': opt['--clip'].append(next(it))
        else: pos.append(x)
    if len(pos) != 2 or not all(k in opt for k in ('--like', '--dress-from', '--home', '--orig-home', '--rest-a')) or not opt['--clip']: sys.exit(__doc__)
    char = os.path.abspath(pos[0].rstrip('/')); name = pos[1]; py = sys.executable; srcA = {}; mk = []
    for spec in opt['--clip']:
        cname, rest = spec.split('=', 1); dirs, *kv = rest.split(','); b, aa = dirs.split(':'); srcA[cname] = os.path.relpath(os.path.abspath(aa), char); mk += ['--clip', f'{cname}={os.path.abspath(b)}' + ''.join(',' + x for x in kv)]
    r = subprocess.run([py, os.path.join(PUPPET, 'clips', 'make_blank_lib.py'), char, name, '--like', opt['--like'], '--home', os.path.abspath(opt['--home']), '--orig-home', os.path.abspath(opt['--orig-home'])] + mk)
    if r.returncode: sys.exit('停在 make_blank_lib')
    dj = os.path.join(char, name, 'dress.json'); cfg = json.load(open(dj, encoding='utf-8')); src = json.load(open(os.path.join(char, opt['--dress-from'], 'dress.json'), encoding='utf-8'))
    for k in ('ink', 'refine', 'noBrow'):
        if k in src: cfg[k] = src[k]
    if opt.get('--per-feature'): cfg['perFeature'] = True
    cfg['twoPass'] = {'restA': os.path.relpath(os.path.abspath(opt['--rest-a']), char), 'srcA': srcA}
    json.dump(cfg, open(dj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    r = subprocess.run([py, os.path.join(HERE, 'dress.py'), char, '--lib', name]); sys.exit(r.returncode)


if __name__ == '__main__':
    main()
