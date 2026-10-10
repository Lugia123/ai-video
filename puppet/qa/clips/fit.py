#!/usr/bin/env python3
"""片段按不同时长播的读数：实际播出哪些帧、几个不同的帧、相邻两格之间变了多少。用来定每段的「最短可接受时长」。

    python3 qa/clips/fit.py characters/<角色>/clips <片段名> [--seconds 0.2,0.3,0.4,0.5,0.8,1.0] [--ease linear,inout,snap] [--write-min 秒]

挑帧的算法和 clips/player.js 的 sequence() 是同一个（改那边要同步改这里）：
  有效帧序列 = 首帧 + active 范围 + 末帧；m = max(2, round(秒 × fps))；m ≥ 有效帧数就全播，
  否则第 j 格取「动作进度」最接近 ease(j/(m−1)) 的那一帧。动作进度 = clip.arc（每帧 0–1，相邻帧变动面积的累计；--write-arc 量出来写进 clips.json）；
  没有 arc 时按帧号均匀当进度。
读数：
  不同帧数   实际播出的不同的帧（首末帧 = 两张静帧，也算在里面）
  最大一步   相邻两格之间「变了很多」的面积占人面积的 %（口径同 checks.py 的 e 组）；自然播放时的最大一步是对照
  最大一步 ÷ 自然   比 1 大多少 = 跳帧让最猛的那一下猛了多少倍
--write-arc：量这一段的 arc 写进 clips.json；--write-min 秒：写 minSeconds。都是读最新的文件、只加这一个键。写完跑 clips/sync.py 更新 clips.js。"""
import argparse, json, os, sys
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import checks as C

EASE = {'linear': lambda u: u, 'inout': lambda u: u * u * (3 - 2 * u), 'snap': lambda u: 1 - (1 - u) * (1 - u)}
jsround = lambda x: int(np.floor(x + 0.5))          # 和 JS 的 Math.round 一致（Python 的 round 是四舍六入五成双）


def base(clip):
    n = len(clip['frames']); keep = {0, n - 1}
    for a, b in clip.get('active') or [[0, n - 1]]: keep |= set(range(a, b + 1))
    return sorted(keep)


def pick(clip, seconds, ease):
    b = base(clip); n = len(b); m = max(2, jsround(seconds * clip['fps']))
    if m >= n: return b
    arc = clip.get('arc'); a = [arc[i] for i in b] if arc else [k / (n - 1) for k in range(n)]; out = []
    for j in range(m):
        tgt = EASE[ease](j / (m - 1)) * a[-1]; out.append(b[min(range(n), key=lambda k: (abs(a[k] - tgt), k))])
    out[0], out[-1] = b[0], b[-1]
    return out


def arc_of(lib_dir, lib, clip):
    """每一帧的「动作走到哪了」：相邻帧变动面积的累计，归一到 0–1。重复帧和静止的头尾这个数不涨，跳帧时自然被跳过。"""
    fr = [C.load(os.path.join(lib_dir, f)) for f in clip['frames']]
    rest = C.load(os.path.join(lib_dir, lib['poses'][lib['rest']]['frame'])); bb = C.bbox(rest[..., 3] > C.OPAQUE); area = (rest[..., 3] > C.OPAQUE).sum(); sig = max(0.8, 0.004 * (bb[3] - bb[1]))
    blur = [cv2.GaussianBlur(f[..., :3].astype(np.float32) * (f[..., 3:] / 255.0), (0, 0), sig) for f in fr]
    step = lambda a, b: float((np.abs(blur[a] - blur[b]).max(2) > C.MOVE_DIFF).sum() / area * 100)
    d = [0.0] + [step(i - 1, i) for i in range(1, len(fr))]
    d[1] = min(d[1], float(np.median(d[1:])) if len(d) > 3 else d[1]); d[-1] = min(d[-1], float(np.median(d[1:])))   # 首尾两步含「换成关键图」的跳，不全是动作，压到中位数以内
    c = np.cumsum(d); return [round(float(x / c[-1]), 4) for x in c], step


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('lib'); ap.add_argument('clip')
    ap.add_argument('--seconds', default='0.2,0.25,0.3,0.4,0.5,0.6,0.8,1.0'); ap.add_argument('--ease', default='linear,inout,snap'); ap.add_argument('--write-min', type=float); ap.add_argument('--write-arc', action='store_true'); ap.add_argument('--no-arc', action='store_true')
    A = ap.parse_args(); path = os.path.join(A.lib, 'clips.json'); lib = json.load(open(path, encoding='utf-8')); clip = lib['clips'][A.clip]
    if A.write_min is not None or A.write_arc:
        if A.write_arc: lib['clips'][A.clip]['arc'] = arc_of(A.lib, lib, clip)[0]
        if A.write_min is not None: lib['clips'][A.clip]['minSeconds'] = A.write_min
        lib2 = json.load(open(path, encoding='utf-8'))            # 再读一次最新的，只动这两个键
        for k in ('arc', 'minSeconds'):
            if k in lib['clips'][A.clip]: lib2['clips'][A.clip][k] = lib['clips'][A.clip][k]
        json.dump(lib2, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(f"{A.clip}：{'arc ' if A.write_arc else ''}{'minSeconds=' + str(A.write_min) if A.write_min is not None else ''} 写进 {path}（记得跑 clips/sync.py 更新 clips.js）"); return
    arc, step = arc_of(A.lib, lib, clip); fr = clip['frames']
    if A.no_arc: clip.pop('arc', None)
    elif 'arc' not in clip: clip['arc'] = arc
    b = base(clip); nat = max(step(b[i - 1], b[i]) for i in range(1, len(b))); total = step(b[0], b[-1])
    print(f"{A.clip}：共 {len(fr)} 帧，有效帧 {len(b)} 个，自然时长 {len(b) / clip['fps']:.2f}s；自然播放最大一步 {nat:.1f}% 人面积；首帧直接到末帧（硬切）{total:.1f}%")
    out = {'clip': A.clip, 'natural_seconds': len(b) / clip['fps'], 'natural_max_step': round(nat, 2), 'cut_step': round(total, 2), 'rows': []}
    for e in A.ease.split(','):
        print(f'  ease = {e}')
        for s in [float(x) for x in A.seconds.split(',')]:
            sel = pick(clip, s, e); steps = [step(sel[i - 1], sel[i]) for i in range(1, len(sel)) if sel[i] != sel[i - 1]]
            mx = max(steps) if steps else 0; at = sel[1 + int(np.argmax(steps))] if steps else None
            out['rows'].append({'ease': e, 'seconds': s, 'frames': sel, 'unique': len(set(sel)), 'max_step': round(mx, 2), 'max_step_over_natural': round(mx / nat, 2)})
            print(f"    {s:4.2f}s  播 {len(sel):2d} 格 / 不同 {len(set(sel)):2d} 帧  最大一步 {mx:5.1f}%（到第 {at} 帧，自然的 {mx / nat:.1f} 倍，硬切的 {mx / total * 100:.0f}%）  {sel}")
    os.makedirs('out/clips-checks', exist_ok=True); json.dump(out, open(f'out/clips-checks/fit-{A.clip}.json', 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
