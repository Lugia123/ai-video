#!/usr/bin/env python3
"""给片段库的每张静帧、每段片段写「脸可换程度」属性（2026-10-09，用户定的分类）。

    python3 puppet/clips/face_attrs.py puppet/characters/<角色>/<库> [--show]

三个开关，写在 clips.json 的 poses.<名> 和 clips.<名> 上（不是死三档）：
  facePaste  能不能往这段 / 这张帧的脸上贴眼、嘴、口型、眨眼（False = 脸是画死的，贴什么都不对）
  browSwap   能不能换眉（False = 只换眉以外的；表情脸里自带的眉也不画，不然会和原眉重复）
  faceBlank  这段片段本身是空脸（没画五官），整张脸全由我们画（默认脸 + 表情 + 口型 + 眨眼）
派生出 faceClass（只读，方便看）：1 = 空脸，或 facePaste + browSwap 都行（表情随便换，含眉）；
  2 = 自带表情、只能换眉以外的（facePaste 行、browSwap 否）；3 = 不可替换（转圈）。

建议值（入库时由程序给）：
  · 片段 facePaste = 逐帧头部跟踪里有可贴帧（headTracks[帧].w > 0）；一帧都没有 = 否。
  · 静帧 facePaste = 烘过表情脸贴片（patches.face）。
  · browSwap 一律建议「否」；faceBlank 一律建议「否」。
人工覆盖写在 <库>/face_attrs.json（入库的小文件，每次重跑都套上去）：
  { "poses": { "think*": { "browSwap": true } }, "clips": { "think*": { "browSwap": true }, "turn*": { "facePaste": false } } }
键支持通配符（fnmatch）；后写的盖前写的。覆盖过的项记在 attrSource 里（'manual'）。"""
import fnmatch, json, os, sys


def main(root, show=False):
    cj = os.path.join(root, 'clips.json'); lib = json.load(open(cj, encoding='utf-8'))
    ov_path = os.path.join(root, 'face_attrs.json'); ov = json.load(open(ov_path, encoding='utf-8')) if os.path.exists(ov_path) else {}
    tracks = lib.get('headTracks') or {}
    def apply(kind, name, obj, auto):
        src = {k: 'auto' for k in auto}; val = dict(auto)
        for pat, d in (ov.get(kind) or {}).items():
            if fnmatch.fnmatchcase(name, pat):
                for k, v in d.items():
                    if k not in ('facePaste', 'browSwap', 'faceBlank'): raise SystemExit(f'{ov_path}：{kind}.{pat} 里有不认的键 {k}')
                    val[k] = bool(v); src[k] = 'manual'
        obj['facePaste'], obj['browSwap'], obj['faceBlank'] = val['facePaste'], val['browSwap'], val['faceBlank']
        obj['faceClass'] = 3 if not val['facePaste'] else 1 if (val['faceBlank'] or val['browSwap']) else 2
        manual = sorted(k for k, s in src.items() if s == 'manual')
        if manual: obj['attrManual'] = manual
        else: obj.pop('attrManual', None)
    rows = []
    for name, p in lib['poses'].items():
        auto = {'facePaste': bool((p.get('patches') or {}).get('face')), 'browSwap': False, 'faceBlank': False}
        apply('poses', name, p, auto); rows.append(('姿势', name, p, ''))
    for name, c in lib['clips'].items():
        if c.get('opaque'): auto = {'facePaste': False, 'browSwap': False, 'faceBlank': False}; note = '带底草稿'
        else:
            ws = [(tracks.get(f) or {}).get('w', 0) for f in c['frames']]; n_ok = sum(1 for w in ws if w > 0)
            auto = {'facePaste': n_ok > 0, 'browSwap': False, 'faceBlank': False}; note = f'可贴 {n_ok}/{len(ws)} 帧'
        apply('clips', name, c, auto); rows.append(('片段', name, c, note))
    text = json.dumps(lib, ensure_ascii=False, indent=1)
    text = __import__('re').sub(r'\[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\]', r'[\1, \2, \3, \4]', text)
    open(cj, 'w', encoding='utf-8').write(text + '\n')
    for kind, name, o, note in rows:
        print(f"{kind} {name:16s} 类{o['faceClass']}  facePaste={int(o['facePaste'])} browSwap={int(o['browSwap'])} faceBlank={int(o['faceBlank'])}  {note}" + (f"  人工:{','.join(o['attrManual'])}" if o.get('attrManual') else ''))
    print('（再跑 clips/sync.py 更新 clips.js）')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    if len(a) != 1: sys.exit(__doc__)
    main(a[0].rstrip('/'), '--show' in sys.argv)
