"""出检查图时给标注文字找一个能显示中文的字体。
  from fonts import label_font;  f = label_font(24)
找的顺序：环境变量 PUPPET_FONT（字体文件路径）→ 常见系统中文字体（macOS、Linux、Windows）→ 都没有就用 PIL 自带的默认字体
（默认字体显示不了中文，标注会变成方框，但不会报错、图照出；这时会在标准错误里提醒一次）。角色本身的渲染不依赖字体。"""
import os, sys
from PIL import ImageFont
CANDIDATES = [
    '/System/Library/Fonts/Hiragino Sans GB.ttc', '/System/Library/Fonts/STHeiti Medium.ttc', '/System/Library/Fonts/PingFang.ttc',
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', '/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc', '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc',
    'C:/Windows/Fonts/msyh.ttc', 'C:/Windows/Fonts/simhei.ttf',
]
_warned = False
def font_path():
    for f in [os.environ.get('PUPPET_FONT')] + CANDIDATES:
        if f and os.path.exists(f): return f
    return None
def label_font(size):
    global _warned
    f = font_path()
    if f:
        try: return ImageFont.truetype(f, size)
        except OSError: pass
    if not _warned: print('提醒：没找到中文字体，检查图上的中文标注会显示不出来；可用环境变量 PUPPET_FONT 指定一个字体文件', file=sys.stderr); _warned = True
    try: return ImageFont.load_default(size)
    except TypeError: return ImageFont.load_default()
