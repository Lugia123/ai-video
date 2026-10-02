"""主歌 3 结尾漫画（89.32–94.78）分镜总图（第三版，用户 10-02 seq 328–330 的要求；前两版在 _v1/ _v2/）：把选中的草图按分格摆进三页，标上格号 / 时间 / 景别 / 歌词。
  python3 episodes/mv-pdoom/fresh/v4-rest/v3/comic/board.py   → 同目录 storyboard.jpg
草图在 episodes/cast-cyber-girl/closeup/v3comic/raw/drafts/_pick/（Lightning 草稿档，不是定稿）。"""
import pathlib
from PIL import Image, ImageDraw, ImageFont
HERE = pathlib.Path(__file__).resolve().parent
PICK = HERE.parents[5] / 'episodes/cast-cyber-girl/closeup/v3comic/raw/drafts/_pick'
F = lambda n: ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', n)
ANTON = lambda n: ImageFont.truetype(str(HERE.parents[5] / 'assets/fonts/anton/Anton-Regular.ttf'), n)
PW, PH, M = 1280, 720, 40
# 每页：[(格号, 图, [x, y, w, h]（页面分数）, 时间, 景别, 画面, 字, 取景中心 (cx, cy))]
PAGES = [
    ('第 1 页　89.32–91.80　醒过来（同一只眼睛的三个状态：闭着 → 慢慢睁开 → 睁开后的特写）', [
        ('①', ['e-closed'], [0.02, 0.03, 0.96, 0.27], '89.32–89.95', '极特写', '舞台灯灭后的黑里，她的眼闭着，安静', 'GATO,', (0.5, 0.5)),
        ('②', ['e-closed', 'e-half'], [0.02, 0.33, 0.96, 0.27], '89.95–91.00', '同机位 · 慢', '眼睛慢慢睁开：闭 → 半睁，格内渐变约 0.9 s，不闪、不加集中线', 'PLEASE', (0.5, 0.5)),
        ('③', ['e-open'], [0.02, 0.63, 0.96, 0.34], '91.00–91.80', '更近的极特写', '完全睁开，瞳孔正中映着白光（就是空间尽头那道光）；瞳孔慢慢缩小——发觉不对', '', (0.52, 0.48)),
    ]),
    ('第 2 页　91.80–94.30　镜头拉远：是那只机械手攥着她的手腕，把她吊在夜城上空', [
        ('④', ['c3-arm'], [0.02, 0.03, 0.47, 0.94], '91.80–92.90', '仰拍 · 竖格', '她抬头；镜头沿她被拽直的手臂往上摇：一只巨大的机械手攥着她的手腕。她惊恐地朝它喊', "DON'T", (0.5, 0.5)),
        ('⑤', ['c4-far'], [0.51, 0.03, 0.47, 0.94], '92.90–94.30', '超大远景 · 竖格', '再拉远：她很小，被那只巨大的手吊在整座夜城上空；格内从手慢慢往下摇到脚下的城，她在挣', 'LET ME', (0.5, 0.5)),
    ]),
    ('第 3 页　94.30–95.40　go：机器突然松手 → 她坠落 → 接 3D（交接点暂按 95.4）', [
        ('⑥', ['c6-release'], [0.02, 0.03, 0.96, 0.45], '94.30–94.85', '中景 · 仰视', '唱到 go：机械手五指突然全张开，她的手脱出来，够不着了', 'GO', (0.5, 0.45)),
        ('⑦', ['c7-fall'], [0.0, 0.51, 1.0, 0.49], '94.85–95.40', '正上方俯拍 · 出血到页边', '她往下坠，惊恐、哭喊，头发和手往上飞，脚下夜城；格内她越坠越小，3D 的她在同一位置淡入，交给副歌 3', '', (0.5, 0.5)),
    ]),
]


def cover(im, w, h, c):
    k = max(w / im.width, h / im.height); im = im.resize((round(im.width * k) + 1, round(im.height * k) + 1), Image.LANCZOS)
    x = min(max(0, round(im.width * c[0] - w / 2)), im.width - w); y = min(max(0, round(im.height * c[1] - h / 2)), im.height - h)
    return im.crop((x, y, x + w, y + h))


rows = []
for title, panels in PAGES:
    notes = []
    for n, _, _, t, shot, desc, word, _ in panels:
        line = f'{n}  {t}　{shot}　{desc}' + (f'　〔{word}〕' if word else '')
        notes += [line[i:i + 60] if i == 0 else '　　' + line[i:i + 60] for i in range(0, len(line), 60)]
    H = 70 + PH + 20 + 34 * len(notes) + 30
    sh = Image.new('RGB', (PW + 2 * M, H), '#14141c'); d = ImageDraw.Draw(sh)
    d.text((M, 18), title, font=F(30), fill='#FFE14D')
    page = Image.new('RGB', (PW, PH), '#f2ede4'); pd = ImageDraw.Draw(page)
    for n, imgs, r, t, shot, desc, word, c in panels:
        x, y, w, h = round(r[0] * PW), round(r[1] * PH), round(r[2] * PW), round(r[3] * PH)
        if len(imgs) == 2:                        # 同一格前后两个状态：左半 / 右半
            a = cover(Image.open(PICK / f'{imgs[0]}.png').convert('RGB'), w, h, c); b = cover(Image.open(PICK / f'{imgs[1]}.png').convert('RGB'), w, h, c)
            a.paste(b.crop((w // 2, 0, w, h)), (w // 2, 0)); im = a; ImageDraw.Draw(im).line([(w // 2, 0), (w // 2, h)], fill='#ffffff', width=3)
        else: im = cover(Image.open(PICK / f'{imgs[0]}.png').convert('RGB'), w, h, c)
        page.paste(im, (x, y)); pd.rectangle([x, y, x + w - 1, y + h - 1], outline='#0a0a10', width=6)
        pd.rectangle([x + 8, y + 8, x + 62, y + 46], fill='#0a0a10'); pd.text((x + 16, y + 10), n, font=F(26), fill='#FFE14D')
        if word and not word.startswith('（'):
            tw = pd.textlength(word, font=ANTON(54)); bx, by = x + w - tw - 46, y + h - 86
            pd.rectangle([bx - 14, by - 4, bx + tw + 14, by + 70], fill='#f2ede4', outline='#0a0a10', width=4); pd.text((bx, by), word, font=ANTON(54), fill='#0a0a10')
    sh.paste(page, (M, 70))
    for i, s in enumerate(notes): d.text((M, 70 + PH + 20 + 34 * i), s, font=F(21), fill='#F2EDE4')
    rows.append(sh)
board = Image.new('RGB', (PW + 2 * M, sum(r.height for r in rows)), '#14141c'); y = 0
for r in rows: board.paste(r, (0, y)); y += r.height
board.save(HERE / 'storyboard.jpg', quality=90); print(board.size)
