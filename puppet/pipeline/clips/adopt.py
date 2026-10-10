#!/usr/bin/env python3
"""把一段已经抠好的透明序列帧（单图往返：首帧 = 尾帧 = 归位帧）收进一个片段库。抠图和校色用帧里现成的，这里不重做。

    python3 pipeline/clips/adopt.py <片段库目录> <动作名> <帧目录> --label 挥手 [--apex N] [--no-hold] [--draft] [--character 名字]
                                   [--group 挥手 --variant '正式 s1']（同一动作的几条候选并存时用）[--host-no-hold]（讲解员里不在停顿帧停）

片段库不存在就新建（画幅 = 帧的尺寸，归位帧 = 这段的第 0 帧）；已存在时这段的第 0 帧必须和库里的归位帧是同一张图。
一段完成去和回的片段，中间没有保持帧，播放器的模型是「去程 → 保持 → 回程」。两种用法都登记，播的时候选：
  <动作>        一次性动作：整段当去程播完，直接回到归位帧（片段 <动作>_loop，从归位到归位）
  <动作>_hold   想停住：在动作幅度最大的那一帧切开——前半当去程（<动作>_in）、那一帧当保持帧、后半当回程（<动作>_out）。
                三段共用同一批帧文件，不另存。幅度最大的那一帧 = 轮廓离归位帧最远的那段平台的正中（--apex 可指定）；--no-hold 不登记这一种。
之后自动跑：clips/sync.py（体检、包围盒）→ qa/clips/checks.py（读数，填有效帧范围和重复帧）→ qa/clips/fit.py（动作进度 arc、最短时长）→ 再 sync。
读数和标注图放在 <片段库>/readings/。"""
import argparse, json, os, shutil, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from clipflow import PUPPET, PY, rd, jload, jdump, find_apex, say


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lib'); ap.add_argument('action'); ap.add_argument('frames'); ap.add_argument('--label'); ap.add_argument('--apex', type=int); ap.add_argument('--no-hold', action='store_true')
    ap.add_argument('--draft', action='store_true'); ap.add_argument('--group'); ap.add_argument('--variant'); ap.add_argument('--host-no-hold', action='store_true'); ap.add_argument('--character'); ap.add_argument('--fps', type=int, default=16); ap.add_argument('--regions')
    a = ap.parse_args(); lib, A, label = a.lib.rstrip('/'), a.action, a.label or a.action
    files = sorted(f for f in os.listdir(a.frames) if f.endswith('.png')); n = len(files)
    if n < 5: sys.exit(f'{a.frames} 里只有 {n} 帧')
    first = os.path.join(a.frames, files[0]); f0 = rd(first); H, W = f0.shape[:2]; cj = os.path.join(lib, 'clips.json')
    if open(first, 'rb').read() != open(os.path.join(a.frames, files[-1]), 'rb').read(): sys.exit('这段的首帧和末帧不是同一张图：这里只收「归位 → 归位」的单图往返')
    if not os.path.exists(cj):
        os.makedirs(os.path.join(lib, 'frames'), exist_ok=True); shutil.copy(first, os.path.join(lib, 'frames', 'idle.png'))
        ys, xs = np.where(f0[..., 3] > 128)
        L = {'character': a.character or os.path.basename(os.path.dirname(os.path.abspath(lib))), 'version': 1, 'canvas': {'w': W, 'h': H},
             'anchor': {'x': int(round((xs.min() + xs.max() + 1) / 2)), 'y': int(ys.max()) + 1, 'note': '脚底中点；呼吸绕这一点缩放'}, 'breath': {'amp': 0.006, 'period': 3.6},
             'rest': 'idle', 'moveSeconds': 0.8, 'poses': {'idle': {'label': '归位（待机）', 'frame': 'frames/idle.png'}}, 'clips': {}, 'actions': []}
        if a.draft: L['tier'] = 'draft'; L['note'] = '草稿档片段库：帧是 4 步草稿、抠图和校色是小样阶段的做法，只用来看动作，不进成片。'
    else:
        L = jload(cj)
        if (L['canvas']['w'], L['canvas']['h']) != (W, H): sys.exit(f"帧是 {W}×{H}，片段库的画幅是 {L['canvas']['w']}×{L['canvas']['h']}")
        if open(first, 'rb').read() != open(os.path.join(lib, L['poses'][L['rest']]['frame']), 'rb').read(): sys.exit('这段的第 0 帧和片段库的归位帧不是同一张图')
    d = os.path.join(lib, 'frames', A + '_loop'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    rel = []
    for i, f in enumerate(files): shutil.copy(os.path.join(a.frames, f), os.path.join(d, f'{i:02d}.png')); rel.append(f'frames/{A}_loop/{i:02d}.png')
    al = [rd(os.path.join(d, f'{i:02d}.png'))[..., 3] > 128 for i in range(n)]; area = max(1, int(al[0].sum())); away = [round(float((x != al[0]).sum() / area * 100), 2) for x in al]
    k = a.apex if a.apex is not None else find_apex(away)
    L['clips'][A + '_loop'] = {'label': f'{label}（一段做完去和回）', 'from': L['rest'], 'to': L['rest'], 'fps': a.fps, 'frames': rel, 'apex': k, 'away_pct': away}
    tag = {k: v for k, v in (('group', a.group), ('variant', a.variant)) if v}          # 同一个动作的几条候选并存时：group = 动作名，variant = 这一条是哪档哪个种子（演示页按 group 分组）
    L['actions'] = [x for x in L['actions'] if x['id'] not in (A, A + '_hold')] + [{'id': A, 'label': label, 'in': A + '_loop', 'oneshot': True, **tag}]
    for key in (A, ):
        L['poses'].pop(key, None)
    for c in (A + '_in', A + '_out'): L['clips'].pop(c, None)
    if not a.no_hold:
        L['poses'][A] = {'label': f'{label}（幅度最大处，第 {k} 帧）', 'frame': rel[k]}
        L['clips'][A + '_in'] = {'label': f'归位 → {label}', 'from': L['rest'], 'to': A, 'fps': a.fps, 'frames': rel[:k + 1]}
        L['clips'][A + '_out'] = {'label': f'{label} → 归位', 'from': A, 'to': L['rest'], 'fps': a.fps, 'frames': rel[k:]}
        L['actions'].append({'id': A + '_hold', 'label': f'{label}（停在幅度最大处）', 'in': A + '_in', 'pose': A, 'out': A + '_out', **tag, **({'host': False, 'host_note': '讲解员里这个动作整段一次播完，不在停顿帧停'} if a.host_no_hold else {})})
    jdump(L, cj); say('adopt', f"{A}：{n} 帧，幅度最大在第 {k} 帧（{'指定的' if a.apex is not None else '自动找的'}；离归位 {away[k]}%，最远 {max(away)}% 在第 {int(np.argmax(away))} 帧）")
    sync = lambda: subprocess.run([PY, os.path.join(PUPPET, 'clips', 'sync.py'), lib], capture_output=True, text=True)
    r = sync()
    if r.returncode: sys.exit('sync.py 没通过：\n' + (r.stdout + r.stderr)[-1200:])
    # 读数（整段量一次）→ 有效帧范围、重复帧
    rdir = os.path.join(lib, 'readings'); os.makedirs(rdir, exist_ok=True)
    cmd = [PY, os.path.join(PUPPET, 'qa', 'clips', 'checks.py'), d, '--rest', os.path.join(lib, 'frames', 'idle.png'), '--name', A, '--out', rdir] + (['--regions', a.regions] if a.regions else [])
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.exit('checks.py 失败：\n' + r.stderr[-1200:])
    open(os.path.join(rdir, A + '.txt'), 'w', encoding='utf-8').write(r.stdout); m = jload(os.path.join(rdir, A + '.json'))['motion']; f, l = m['active_first'], m['active_last']
    L = jload(cj); L['clips'][A + '_loop'].update(active=[[f, l]], dupes=m['stalls'])
    if not a.no_hold:
        L['clips'][A + '_in'].update(active=[[f, k - 1]] if f < k else [], dupes=[i for i in m['stalls'] if i < k])
        L['clips'][A + '_out'].update(active=[[1, max(1, l - k)]], dupes=[i - k for i in m['stalls'] if i > k])
    jdump(L, cj)
    for c, mn in ((A + '_loop', 0.6),) + (() if a.no_hold else ((A + '_in', 0.3), (A + '_out', 0.3))):
        subprocess.run([PY, os.path.join(PUPPET, 'qa', 'clips', 'fit.py'), lib, c, '--write-arc', '--write-min', str(mn)], check=True, stdout=subprocess.DEVNULL, cwd=PUPPET)
    r = sync(); say('adopt', f"动作在第 {f}–{l} 帧，中途几乎不动的帧 {m['stalls']}；sync：" + (r.stdout.strip().splitlines() or [''])[-1])


if __name__ == '__main__':
    main()
