"""#1050 MV 进度总片：定稿段（全分辨率渲好的 mp4）+ 占位段（状态卡 + 当前歌词）→ out/final.mp4（整首 0–156.65 s，配 music.mp3）。

  cd episodes/mv-pdoom && python3 tools-final/build_final.py

以后某段定稿：把 SEGMENTS 里那一段的 kind 改成 'clip'、src 指向渲好的 mp4（时长要等于这段长度），重跑即可。
占位卡没有动效：深色底，居中「段名 · 起–止 · 状态」，下面一行是这一刻在唱的歌词（data/lyrics.json，换句时整张换图）。
"""
import json, pathlib, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]           # episodes/mv-pdoom
OUT = ROOT / 'out'
W, H, FPS = 1920, 1080, 30
TOTAL = 156.65

# (起, 止, 段名, 类型, 状态 / 源文件[, 源文件里跳过开头多少秒])；止 = None：按源片实际长度放（最后一段可以比歌长）
SEGMENTS = [
    (0.0,   22.5,   '开头 + 主歌 1 + 关盒子', 'clip', 'out/v4-01-final-clip-0-22.5.mp4'),   # 22.1–22.5 全黑四只眼
    (22.5,  38.4,   '副歌 1',               'clip', 'out/c1-v4.mp4', 0.4),   # c1-v4 覆盖 22.1–38.4，从片内 0.4 s 起取；22.1–22.5 仍用 v4-01 的全黑四只眼
    (38.4,  58.4,   '主歌 2 跑酷 + 预副歌 2',  'clip', 'out/v4-03-clip-0-20.mp4'),
    (58.4,  74.8,   '副歌 2',               'clip', 'out/c2-v4.mp4'),   # 定稿：final 第 1752–2243 帧（74.78 不在帧格上，2244 帧起归主歌 3）
    (74.8,  95.4,   '主歌 3 + 预副歌 3',     'clip', 'out/v3-v7.mp4'),   # 定稿：final 第 2244–2861 帧
    (95.4,  105.96, '副歌 3',               'clip', 'out/c3-v7.mp4'),   # 定稿：final 第 2862–3178 帧
    (105.96, 123.87, '桥段',                 'clip', 'out/br-v5.mp4'),   # 定稿：final 第 3179–3715 帧
    (123.87, None,  '副歌 4 + 尾声',         'clip', 'out/c4-v4.mp4'),   # 定稿；比歌长 1 s（音乐结束后的渐暗），按源片实际长度放
]

ZH = '/System/Library/Fonts/Hiragino Sans GB.ttc'
F_BIG, F_MID, F_LYR = ImageFont.truetype(ZH, 116), ImageFont.truetype(ZH, 60), ImageFont.truetype(ZH, 56)   # 段名字身 ≈ 画高 8%，歌词 ≈ 4%
LINES = json.loads((ROOT / 'data/lyrics.json').read_text())['lines']

def lyric_at(t):
    for ln in LINES:
        if ln['start'] <= t < ln['end']: return ln['text']
    return ''

def card(name, t0, t1, status, lyric):
    im = Image.new('RGB', (W, H), (16, 14, 24)); d = ImageDraw.Draw(im)
    d.text((W / 2, H / 2 - 120), name, font=F_BIG, fill=(240, 236, 228), anchor='mm')
    d.text((W / 2, H / 2 + 10), f'{t0:.1f}–{t1:.1f} s  ·  {status}', font=F_MID, fill=(240, 180, 60), anchor='mm')
    d.line((W / 2 - 420, H / 2 + 85, W / 2 + 420, H / 2 + 85), fill=(70, 66, 80), width=2)
    if lyric: d.text((W / 2, H / 2 + 170), lyric, font=F_LYR, fill=(170, 165, 180), anchor='mm')
    d.text((40, H - 50), '占位 · MV 进度总片', font=ImageFont.truetype(ZH, 28), fill=(90, 86, 100))
    return im

def frames_dur(t0, t1):
    return round(t1 * FPS) - round(t0 * FPS)

# 单帧补丁：{final 帧号: 图片}，用来替换某几帧。文件名 f<final 帧号>.png
PATCH_DIRS = [
    'fresh/redo-box/fix1072/frames',     # #1072 关盒子闭嘴图修复：606–608、621–625
    'fresh/v4-rest/c4/fix1074/frames',   # #1074 副歌 4 单眼 wink：4650–4653、4656–4659
]
PATCHES = {int(f.stem[1:]): f for d in PATCH_DIRS for f in sorted((ROOT / d).glob('f*.png'))}

tmp = pathlib.Path(tempfile.mkdtemp())
parts = []
for i, (t0, t1, name, kind, arg, *rest) in enumerate(SEGMENTS):
    skip = round((rest[0] if rest else 0) * FPS)   # 源片里跳过的帧数
    if t1 is None:   # 最后一段按源片实际长度放（可以比歌长，例如音乐结束后的渐暗）
        nsrc = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', str(ROOT / arg)], capture_output=True, text=True).stdout.strip())
        n = nsrc - skip; t1 = (round(t0 * FPS) + n) / FPS
    else:
        n = frames_dur(t0, t1)
    out = tmp / f'seg-{i}.mp4'
    if kind == 'clip':
        src = ROOT / arg
        # 定稿段：去掉音轨，只取画面，按帧数截齐（防止渲染器尾帧多 / 少 1 帧）
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-an', '-vf', f"fps={FPS},select='gte(n\\,{skip})',setpts=N/{FPS}/TB,scale={W}:{H}", '-frames:v', str(n),
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', str(out)], check=True)
    else:
        # 占位段：歌词换句的时刻切图（帧对齐），concat demuxer 按时长铺
        cuts = sorted({t0, t1, *[x for ln in LINES for x in (ln['start'], ln['end']) if t0 < x < t1]})
        lst = tmp / f'seg-{i}.txt'; rows = []
        for k, (a, b) in enumerate(zip(cuts, cuts[1:])):
            fa, fb = round(a * FPS), round(b * FPS)
            if fb <= fa: continue
            p = tmp / f'seg-{i}-{k}.png'; card(name, t0, t1, arg, lyric_at((a + b) / 2)).save(p)
            rows.append(f"file '{p}'\nduration {(fb - fa) / FPS:.6f}")
        rows.append(f"file '{p}'")   # concat demuxer 最后一张要再列一次
        lst.write_text('\n'.join(rows))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-vf', f'fps={FPS},format=yuv420p', '-frames:v', str(n),
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(out)], check=True)
    f0 = round(t0 * FPS); hit = {k - f0: v for k, v in PATCHES.items() if f0 <= k < f0 + n}
    if hit:   # 这一段里有要替换的帧：解成图片序列、换掉、再编码
        sd = tmp / f'patch-{i}'; sd.mkdir()
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(out), str(sd / 'p-%05d.png')], check=True)
        for k, src_img in hit.items():
            Image.open(src_img).convert('RGB').save(sd / f'p-{k + 1:05d}.png')
        out2 = tmp / f'seg-{i}-patched.mp4'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-framerate', str(FPS), '-i', str(sd / 'p-%05d.png'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', str(out2)], check=True)
        out = out2; print(f'        换了 {len(hit)} 帧：{sorted(k + f0 for k in hit)}')
    got = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', str(out)], capture_output=True, text=True).stdout.strip())
    print(f'{t0:7.2f}–{t1:7.2f}  {kind:4s}  {name}  frames {got}/{n}')
    assert got == n, f'段 {name} 帧数不对：{got} != {n}'
    parts.append(out); VEND = t1

lst = tmp / 'all.txt'; lst.write_text('\n'.join(f"file '{p}'" for p in parts))
final = OUT / 'final.mp4'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-i', str(ROOT / 'music.mp3'),
                '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '256k', '-t', f'{max(TOTAL, VEND):.3f}', '-movflags', '+faststart', str(final)], check=True)   # 视频比歌长时，音轨在歌后补静音
print('wrote', final)
# 每 2 s 一帧的 sheet（ffmpeg 抽帧，PIL 拼图加时间标）
sd = tmp / 'sheet'; sd.mkdir()
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(final), '-vf', "select='not(mod(n\\,60))',scale=384:-1", '-vsync', '0', str(sd / 's-%03d.png')], check=True)   # 第 0、60、120… 帧 = 0、2、4… s 整点
fs = sorted(sd.glob('s-*.png')); cols = 8; tw, th = 384, 216
sheet = Image.new('RGB', (cols * tw, ((len(fs) + cols - 1) // cols) * th), 'black'); sdraw = ImageDraw.Draw(sheet)
for k, f in enumerate(fs):
    x, y = (k % cols) * tw, (k // cols) * th; sheet.paste(Image.open(f), (x, y))
    t = k * 2.0
    kind = next((sg[3] for sg in SEGMENTS if sg[0] <= t < (sg[1] or 1e9)), '')
    sdraw.rectangle((x, y, x + 230, y + 26), fill=(0, 0, 0)); sdraw.text((x + 6, y + 3), f'{t:5.1f}s  {"定稿" if kind == "clip" else "占位"}', font=ImageFont.truetype(ZH, 18), fill=(255, 220, 120) if kind == 'clip' else (180, 180, 190))
sheet.save(OUT / 'final-sheet.png')
print('wrote', OUT / 'final-sheet.png', len(fs), 'frames')
