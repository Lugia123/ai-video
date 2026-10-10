#!/usr/bin/env python3
"""把一批「空脸」素材（空脸归位帧 + 空脸动作片段的逐帧 PNG）搭成一个片段库，之后走 pipeline/clips/dress.py 穿戴整齐。

    python3 puppet/clips/make_blank_lib.py puppet/characters/<角色> <新库名> --like <有脸的库名> \
        --home <空脸归位帧.png> --orig-home <原归位帧.png> --clip wave_loop=<逐帧PNG目录>[,label=挥手·空脸 s1] [--clip …]

做的事：
  · 从 --like 库抄画布、锚点、呼吸、口型 / 说话 / 眨眼节拍、头部跟踪参考点；
  · poses.idle = 空脸归位帧；每个 --clip 一段「归位 → 动作 → 归位」的一次性动作（首末帧要和空脸归位帧逐像素相同，不同就停）；
  · 写 face_attrs.json（所有片段 faceBlank = true）和 dress.json（贴片对位沿用 --like 库的；原归位帧路径记下来，给默认脸用）。
素材不入库（帧复制进 <新库>/frames/）。之后：python3 pipeline/clips/dress.py <角色> --lib <新库名> --track <片段名,…>"""
import json, os, shutil, sys
import numpy as np
from PIL import Image


def main(char, name, like, home, orig_home, clips):
    P = lambda *p: os.path.join(char, *p); L = json.load(open(P(like, 'clips.json'), encoding='utf-8'))
    root = P(name); os.makedirs(P(name, 'frames'), exist_ok=True)
    shutil.copyfile(home, P(name, 'frames', 'idle.png')); hm = np.array(Image.open(home).convert('RGBA'))
    lib = {k: L[k] for k in ('character', 'version', 'canvas', 'anchor', 'breath', 'moveSeconds', 'mouthShapes', 'talk', 'blink', 'headTrackRefs', 'headTrackBasis') if k in L}
    lib.update({'rest': 'idle', 'tier': 'draft-blank', 'note': '空脸片段库：片段里没有画五官（faceBlank），脸全由贴片画（默认脸 / 表情脸 / 口型 / 眨眼）。',
                'poses': {'idle': {'label': '归位（空脸）', 'frame': 'frames/idle.png'}}, 'clips': {}, 'actions': []})
    for spec in clips:
        cname, rest = spec.split('=', 1); d, *kv = rest.split(','); label = dict(x.split('=', 1) for x in kv).get('label', cname)
        files = sorted(f for f in os.listdir(d) if f.endswith('.png')); os.makedirs(P(name, 'frames', cname), exist_ok=True); frames = []
        for f in files:
            shutil.copyfile(os.path.join(d, f), P(name, 'frames', cname, f)); frames.append(f'frames/{cname}/{f}')
        for end, idx in (('首', 0), ('末', -1)):
            a = np.array(Image.open(P(name, frames[idx])).convert('RGBA'))
            if a.shape != hm.shape or (a != hm).any(): sys.exit(f'{cname}：{end}帧和空脸归位帧不是逐像素相同（{int((a != hm).any(2).sum()) if a.shape == hm.shape else "尺寸不同"} 像素不同）')
        for idx in (0, -1): shutil.copyfile(home, P(name, frames[idx]))          # 像素相同已验过；字节也换成同一份（sync.py 按字节比首末帧和姿势）
        n = len(frames); lib['clips'][cname] = {'label': label, 'from': 'idle', 'to': 'idle', 'fps': 16, 'frames': frames, 'active': [[1, n - 2]]}
        aid = cname[:-5] if cname.endswith('_loop') else cname
        lib['actions'].append({'id': aid, 'label': label, 'in': cname, 'oneshot': True, 'group': aid})
    json.dump(lib, open(P(name, 'clips.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump({'_note': '空脸库：所有片段 faceBlank。', 'poses': {'idle': {'faceBlank': True}}, 'clips': {'*': {'faceBlank': True}}}, open(P(name, 'face_attrs.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump({'blank': True, 'alignFrom': like, 'origRest': os.path.relpath(orig_home, char), 'track': [c.split('=')[0] for c in clips]}, open(P(name, 'dress.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{root}：{len(lib["clips"])} 段片段；接着 python3 pipeline/clips/dress.py {char} --lib {name}')


if __name__ == '__main__':
    a = sys.argv[1:]; opt = {'--clip': []}; pos = []; it = iter(a)
    for x in it:
        if x in ('--like', '--home', '--orig-home'): opt[x] = next(it)
        elif x == '--clip': opt['--clip'].append(next(it))
        else: pos.append(x)
    if len(pos) != 2 or not all(k in opt for k in ('--like', '--home', '--orig-home')) or not opt['--clip']: sys.exit(__doc__)
    main(pos[0].rstrip('/'), pos[1], opt['--like'], opt['--home'], opt['--orig-home'], opt['--clip'])
