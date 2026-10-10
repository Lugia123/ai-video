#!/usr/bin/env python3
"""给片段库的每张静帧算漫符挂点，给每段片段量头的逐帧位移。写 <角色>/clips/points.json（讲解员 host-clips 读它）。

    python3 host-clips/bake_points.py characters/<角色> [--lib clips-draft2]       # 换了静帧 / 片段、或重跑了贴片烘焙之后跑一遍；--lib 指定角色目录下哪个片段库（默认 clips）

挂点从哪来：
  头上的点（眼、嘴、脸颊、下巴、额头、帽顶…）= 角色数据包 character.json 的 host.points（头部母版坐标）
      × 贴片烘焙时量好的「母版 → 这张静帧」相似变换（clips.json 里每张静帧的 patches.align）。没有 align 的静帧算不了头上的点，会报。
  手 = 人量的，写在 <角色>/clips/points.manual.json：{ "<静帧名>": { "handL": [x, y], "handR": [x, y] } }（画面左 / 右那只手的中心）。
  同一个文件里的 "emote": { "side": -1 } 是这个角色漫符的默认选项（-1 = 出在画面左；默认的画面右被配饰占了就换边），原样带进 points.json。
片段里头的位移：把片段每一帧的头顶到眼线这一块（不含下巴，免得被抬上来的手带偏）和片段首帧做相位相关，得到 [dx, dy]（帧像素）。
  播放时挂点 = 首姿挂点 + 这一帧的位移，再把「末帧算出来的」和「尾姿自己的挂点」之间的差按进度摊掉，两头都接得上。
都是片段画布的像素坐标（左上原点），不含呼吸；呼吸和整体摆放由讲解员在运行时套。"""
import json, math, os, sys
import numpy as np, cv2


def rgba(p):
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im is None or im.ndim != 3 or im.shape[2] != 4: sys.exit(f'读不了透明图：{p}')
    return im


def gray(im): return (cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2GRAY).astype(np.float32) * (im[..., 3] / 255.0)).astype(np.float32)


def main(char, LIB='clips'):
    P = lambda *p: os.path.join(char, *([LIB] + list(p[1:]) if p and p[0] == 'clips' else p))          # 代码里写的 'clips' = 这次要处理的那个片段库目录
    lib = json.load(open(P('clips', 'clips.json'), encoding='utf-8'))
    HP = json.load(open(P('character.json'), encoding='utf-8'))['host']['points']
    manual = json.load(open(P('clips', 'points.manual.json'), encoding='utf-8')) if os.path.exists(P('clips', 'points.manual.json')) else {}
    out = {'_说明': '漫符挂点和片段里头的逐帧位移。host-clips/bake_points.py 生成，别手改；手的位置改 points.manual.json 再重跑。坐标 = 片段画布像素，不含呼吸。',
           'canvas': lib['canvas'], 'poses': {}, 'clips': {}}
    if manual.get('emote'): out['emote'] = {k: v for k, v in manual['emote'].items() if not k.startswith('_')}      # 这个角色漫符的默认选项（side: -1 = 出在画面左）
    for name, pose in lib['poses'].items():
        al = (pose.get('patches') or {}).get('align')
        if not al: print(f'✗ 静帧 {name} 没有 patches.align（先跑贴片烘焙），头上的挂点算不了'); continue
        s, r, (tx, ty) = al['scale'], math.radians(al['rotate_deg']), al['translate']
        c, sn = s * math.cos(r), s * math.sin(r)
        pts = {k: [round(c * x - sn * y + tx, 1), round(sn * x + c * y + ty, 1)] for k, (x, y, _layer) in HP.items()}
        for k, v in (manual.get(name) or {}).items() if name != 'emote' else []:
            if not k.startswith('_'): pts[k] = v
        out['poses'][name] = {'points': pts, 'eyeDist': round(math.hypot(pts['eyeR'][0] - pts['eyeL'][0], pts['eyeR'][1] - pts['eyeL'][1]), 1),
                              'hands': 'manual' if any(k.startswith('hand') for k in pts) else 'none'}
        print(f"静帧 {name}：{len(pts)} 个点，两眼相距 {out['poses'][name]['eyeDist']}px，手 {out['poses'][name]['hands']}")
    for cname, clip in lib['clips'].items():
        a, b = clip.get('from'), clip.get('to')
        if clip.get('opaque') or a not in out['poses'] or b not in out['poses']: continue
        A, B = out['poses'][a]['points'], out['poses'][b]['points']
        x0, x1 = int(A['templeL'][0] - 30), int(A['templeR'][0] + 30); y0, y1 = int(A['top'][1] - 20), int((A['eyeL'][1] + A['mouth'][1]) / 2)
        fr = [gray(rgba(P('clips', f)))[y0:y1, x0:x1] for f in clip['frames']]
        win = cv2.createHanningWindow(fr[0].shape[::-1], cv2.CV_32F); (zx, zy), _ = cv2.phaseCorrelate(fr[0], fr[0], win)
        head, conf = [], []
        for f in fr: (dx, dy), r = cv2.phaseCorrelate(fr[0], f, win); head.append([round(dx - zx, 2), round(dy - zy, 2)]); conf.append(float(r))
        # 头转过去了（转身）就追不上了。判断：算出来头跑了三分之一个头那么远、相邻两帧之间跳了一大步、或者末帧算出来的位置和尾姿自己的挂点差得多。
        # （不看相位相关的响应值：手从头旁边过的时候响应会很低，但位移照样是对的。）这种片段不给位移，播放中漫符不出
        hw = x1 - x0; far0 = max(math.hypot(*h) for h in head); step = max(math.hypot(head[i][0] - head[i - 1][0], head[i][1] - head[i - 1][1]) for i in range(1, len(head)))
        gap0 = math.hypot(B['forehead'][0] - A['forehead'][0] - head[-1][0], B['forehead'][1] - A['forehead'][1] - head[-1][1])
        if far0 > 0.33 * hw or step > 0.12 * hw or gap0 > 0.06 * hw:
            out['clips'][cname] = {'from': a, 'to': b, 'head': None, 'why': f'头在这段里追不上（最远 {far0:.0f}px，相邻帧最大一步 {step:.0f}px，末帧和尾姿挂点差 {gap0:.0f}px；头宽 {hw}px）：播放中漫符不出'}
            print(f"片段 {cname}：{len(head)} 帧，头追不上（最远 {far0:.0f}px，最大一步 {step:.0f}px，末帧差 {gap0:.0f}px）→ 不给位移，这段播放中漫符不出"); continue
        want = [B['forehead'][0] - A['forehead'][0], B['forehead'][1] - A['forehead'][1]]
        gap = [round(want[0] - head[-1][0], 2), round(want[1] - head[-1][1], 2)]
        far = max(range(len(head)), key=lambda i: math.hypot(*head[i]))
        out['clips'][cname] = {'from': a, 'to': b, 'head': head, 'endGap': gap, 'crop': [x0, y0, x1, y1]}
        print(f"片段 {cname}：{len(head)} 帧，头最远偏 {math.hypot(*head[far]):.1f}px（第 {far} 帧 {head[far]}），末帧 {head[-1]}，和尾姿挂点差 {gap}px（播放时按进度摊掉）")
    json.dump(out, open(P('clips', 'points.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('写了', P('clips', 'points.json'))


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; lib = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == '--lib' and i + 1 < len(sys.argv)), 'clips')
    args = [a for a in args if a != lib or '--lib' not in sys.argv]
    main(args[0].rstrip('/'), lib) if len(args) == 1 else sys.exit(__doc__)
