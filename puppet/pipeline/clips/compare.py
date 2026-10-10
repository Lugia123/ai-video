#!/usr/bin/env python3
"""同一个动作的几条候选并排、同步播放，人物 1:1：给人挑哪条用的。

    python3 pipeline/clips/compare.py <片段库目录> --group 思考 [--out out/x.mp4]          # 按动作分组（clips.json 里 actions 的 group）取全部候选
    python3 pipeline/clips/compare.py <片段库目录> --clips think_loop,think_f2_loop --labels '正式 s1,正式 s2' --out out/x.mp4

每条一列，列头写这一条是哪档哪个种子；上排浅底、下排深底；人物不缩放，各列裁到自己全部帧的包围盒（四周留 20px），所有列同一个上下范围。
帧数不一样的，短的播完停在最后一帧等长的。原速（片段帧率）播两遍，再半速一遍；左上角帧号。"""
import argparse, json, os, subprocess, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

LIGHT, DARK = (243, 248, 251), (20, 24, 33)


def font(sz):
    for p in ('/System/Library/Fonts/PingFang.ttc', '/Library/Fonts/Arial Unicode.ttf', '/System/Library/Fonts/STHeiti Medium.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'):
        try: return ImageFont.truetype(p, sz)
        except OSError: pass
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lib'); ap.add_argument('--group'); ap.add_argument('--clips'); ap.add_argument('--labels'); ap.add_argument('--out', required=True)
    a = ap.parse_args(); L = json.load(open(os.path.join(a.lib, 'clips.json'), encoding='utf-8'))
    if a.group:
        acts = [x for x in L['actions'] if x.get('group') == a.group and not x['id'].endswith('_hold')]
        clips = [x['in'] for x in acts]; labels = [f"{a.group}·{x.get('variant', x['id'])}" for x in acts]
    else:
        clips = a.clips.split(','); labels = a.labels.split(',') if a.labels else clips
    if not clips: sys.exit('没有要比的片段')
    cols = []
    for c in clips:
        fr = [cv2.cvtColor(cv2.imread(os.path.join(a.lib, f), cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA) for f in L['clips'][c]['frames']]
        m = np.any([f[..., 3] > 8 for f in fr], axis=0); ys, xs = np.where(m); cols.append((fr, xs.min(), xs.max() + 1, ys.min(), ys.max() + 1))
    H, W = cols[0][0][0].shape[:2]; y0 = max(0, min(c[3] for c in cols) - 20); y1 = min(H, max(c[4] for c in cols) + 20); h = (y1 - y0) // 2 * 2; fps = L['clips'][clips[0]].get('fps', 16)
    boxes = [(max(0, c[1] - 20), min(W, c[2] + 20)) for c in cols]; ws = [(b - a_) // 2 * 2 for a_, b in boxes]; n = max(len(c[0]) for c in cols); HEAD = 56; F = font(26); Fs = font(22)
    def frame(i, slow):
        img = Image.new('RGB', (sum(ws), HEAD + 2 * h), (255, 255, 255)); d = ImageDraw.Draw(img); x = 0
        for (fr, *_), (bx0, _b), w, lab in zip(cols, boxes, ws, labels):
            f = fr[min(i, len(fr) - 1)][y0:y0 + h, bx0:bx0 + w]; al = f[..., 3:].astype(np.float32) / 255; rgb = f[..., :3].astype(np.float32)
            for r, bg in enumerate((LIGHT, DARK)): img.paste(Image.fromarray((rgb * al + np.array(bg, np.float32) * (1 - al)).round().astype(np.uint8)), (x, HEAD + r * h))
            d.text((x + 10, 6), lab, font=F, fill=(20, 39, 74)); d.text((x + 10, 34), f"第 {min(i, len(fr) - 1)} / {len(fr) - 1} 帧" + (' · 半速' if slow else ''), font=Fs, fill=(200, 60, 30)); d.line((x, 0, x, HEAD + 2 * h), fill=(200, 208, 220)); x += w
        return np.asarray(img)
    seq = [frame(i, False) for i in range(n)]; slow = [frame(i, True) for i in range(n)]; hold = [seq[-1]] * (fps // 2)
    frames = seq + hold + seq + hold + [x for f in slow for x in (f, f)] + hold
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); hh, ww = frames[0].shape[:2]
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{ww}x{hh}', '-r', str(fps), '-i', '-', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
                          '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv444p', '-r', str(fps), '-movflags', '+faststart', a.out], stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(f.tobytes())
    p.stdin.close()
    if p.wait(): sys.exit('ffmpeg 失败')
    print(f"{a.out}：{len(clips)} 列（{'、'.join(labels)}），{ww}×{hh}，人物 1:1，{len(frames) / fps:.1f}s")


if __name__ == '__main__':
    main()
