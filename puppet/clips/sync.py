#!/usr/bin/env python3
"""片段库体检 + 量包围盒 + 生成 clips.js。加了 / 换了片段之后跑一遍：

    python3 puppet/clips/sync.py puppet/characters/<角色>/clips

做三件事：
1. 检查 clips.json 里列的每个帧文件都在、尺寸和画布一致，片段首末帧和它声明的首姿 / 尾姿是不是同一张图。
2. 量每一帧人物的包围盒（alpha > 8 的范围）和它离画布四边的距离，写回 clips.json
   （姿势和片段的 bbox / frameBBox / margin，库级的 minMargin）。带底不透明的片段（opaque）不量。
（口型 / 眨眼贴片不在这里做，见 bake_patches.py；这里只查贴片文件在不在。）
3. 把 clips.json 原样包成 clips.js（window.__clipLibrary = …），file:// 双击打开页面时 fetch 用不了，靠它加载。
人写的字段（标签、帧列表、有效帧范围、说明）不动。退出码非 0 = 有帧缺失 / 尺寸不对 / 人物贴边。"""
import json, os, sys
import numpy as np
from PIL import Image

MIN_MARGIN = 24      # 人物离画布边少于这么多像素就算贴边（呼吸会让人再长高约 0.6%）


def bbox(path, size):
    im = Image.open(path)
    if im.size != size: raise ValueError(f'{path}：尺寸 {im.size}，画布是 {size}')
    if im.mode != 'RGBA': raise ValueError(f'{path}：不是透明图（{im.mode}）')
    m = np.asarray(im)[..., 3] > 8
    ys, xs = np.where(m.any(1))[0], np.where(m.any(0))[0]
    return [int(xs[0]), int(ys[0]), int(xs[-1]) + 1, int(ys[-1]) + 1]


def margin(b, size):   # [左, 上, 右, 下]
    return [b[0], b[1], size[0] - b[2], size[1] - b[3]]


def same(a, b):
    return open(a, 'rb').read() == open(b, 'rb').read()


def main(root):
    lib = json.load(open(os.path.join(root, 'clips.json'), encoding='utf-8'))
    size, P, errs = (lib['canvas']['w'], lib['canvas']['h']), lambda f: os.path.join(root, f), []
    mins = []
    for name, pose in lib['poses'].items():
        pose['bbox'] = bbox(P(pose['frame']), size); pose['margin'] = margin(pose['bbox'], size); mins.append(pose['margin'])
        pt = pose.get('patches') or {}
        for q in list(pt.get('mouth', {}).values()) + [pt[k] for k in ('blink', 'clean', 'eyeSkin', 'browErase') if pt.get(k)]:   # 贴片由 bake_patches.py 烘，这里只查文件在不在
            if not os.path.exists(P(q['file'])): errs.append(f'姿势 {name}：贴片 {q["file"]} 不存在')
    for name, c in lib['clips'].items():
        miss = [f for f in c['frames'] if not os.path.exists(P(f))]
        if miss: errs.append(f'{name}：缺 {len(miss)} 帧，第一个是 {miss[0]}'); continue
        n = len(c['frames'])
        for a, b in c.get('active', []):
            if not (0 <= a <= b < n): errs.append(f'{name}：有效帧范围 [{a}, {b}] 超出 0–{n - 1}')
        if c.get('opaque'):
            cs = (c['canvas']['w'], c['canvas']['h'])
            bad = [f for f in c['frames'] if Image.open(P(f)).size != cs]
            if bad: errs.append(f'{name}：{len(bad)} 帧尺寸不是 {cs}')
            continue
        try: c['frameBBox'] = [bbox(P(f), size) for f in c['frames']]
        except ValueError as e: errs.append(str(e)); continue
        fb = c['frameBBox']
        c['bbox'] = [min(b[0] for b in fb), min(b[1] for b in fb), max(b[2] for b in fb), max(b[3] for b in fb)]
        c['margin'] = margin(c['bbox'], size); mins.append(c['margin'])
        for end, idx in (('from', 0), ('to', -1)):
            pose = lib['poses'].get(c.get(end) or '')
            if pose and not same(P(pose['frame']), P(c['frames'][idx])):
                errs.append(f'{name}：{"首" if idx == 0 else "末"}帧和姿势 {c[end]} 的图不是同一张，衔接处会跳')
    for a in lib['actions']:
        for k in ('in', 'out'):
            if a.get(k) and a[k] not in lib['clips']: errs.append(f'动作 {a["id"]}：片段 {a[k]} 不存在')
        if a.get('pose') and a['pose'] not in lib['poses']: errs.append(f'动作 {a["id"]}：姿势 {a["pose"]} 不存在')
    if mins:
        lib['minMargin'] = {'left': min(m[0] for m in mins), 'top': min(m[1] for m in mins), 'right': min(m[2] for m in mins), 'bottom': min(m[3] for m in mins)}
        lib['minMargin']['min'] = min(lib['minMargin'].values())
        if lib['minMargin']['min'] < MIN_MARGIN: errs.append(f'人物贴边：最小留白 {lib["minMargin"]["min"]}px < {MIN_MARGIN}px')
    text = json.dumps(lib, ensure_ascii=False, indent=1)
    # frameBBox 一帧一行太长，压成一行一个
    text = __import__('re').sub(r'\[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\]', r'[\1, \2, \3, \4]', text)
    open(os.path.join(root, 'clips.json'), 'w', encoding='utf-8').write(text + '\n')
    open(os.path.join(root, 'clips.js'), 'w', encoding='utf-8').write(
        '// 由 clips/sync.py 从 clips.json 生成，别手改。file:// 打开页面时靠它加载片段库。\nwindow.__clipLibrary = ' + text + ';\n')
    for name, c in lib['clips'].items():
        print(f'{name}: {len(c["frames"])} 帧 @{c["fps"]}fps，有效 {c.get("active")}，' + (f'包围盒 {c["bbox"]}，留白 左上右下 {c["margin"]}' if 'bbox' in c else '带底，不量包围盒'))
    print('最小留白：', lib.get('minMargin'))
    for e in errs: print('✗', e)
    print('通过' if not errs else f'{len(errs)} 处问题')
    return 1 if errs else 0


if __name__ == '__main__':
    if len(sys.argv) != 2: print(__doc__); sys.exit(2)
    sys.exit(main(sys.argv[1]))
