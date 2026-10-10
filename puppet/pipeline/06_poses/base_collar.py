"""身体底图的领口收口：底图不含脖子；领口开口收到母版那样（约 62 宽的脖子正好穿过），领口上沿（白衬衣顶边）那圈锯齿抹平。脖子由脖子层画在底图后面。
  python3 base_collar.py <身体部件合成的原图 base_w5.png> <输出 base.png>
输入是「身体各部件合成、还没收领口」的那张（来源素材里的 pose-sources/base_w5.png）；输出是姿势库用的 base.png。确定性，可重复跑。
几何常数（开口中线、上下沿、两处半宽）是按这个角色量的，换角色要重量；现在写在脚本里，没有进配置。"""
import sys, numpy as np
from PIL import Image
if len(sys.argv) < 3: raise SystemExit(__doc__)
SRC, DST = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(SRC).convert('RGBA')).copy(); NAVY = (22, 28, 48)
CX, Y0, Y1 = 543, 684, 725          # 开口：y=Y0 处半宽 38（领尖），y=Y1 处半宽 26（母版量的：左内沿 505→517，右内沿 581→570）
def half(y): return 38 - (y - Y0) * 12 / (Y1 - Y0)
for y in range(Y0, Y1):
    for sgn in (-1, 1):
        xt = int(round(CX + sgn * half(y))); row = a[y]
        xs = range(CX, CX + sgn * 60, sgn); xe = next((x for x in xs if row[x, 3] > 128), None)          # 从中线往外，第一个不透明像素 = 现在的内沿
        if xe is None or (xe - xt) * sgn <= 0: continue          # 现在的开口不比目标宽：不动
        col = row[xe + sgn * 5].copy(); col[3] = 255          # 往领子里 5 像素取色（跳过描边）
        for x in range(xt, xe + sgn * 2, sgn): row[x] = col
        for x in (xt, xt + sgn): row[x] = NAVY + (255,)
# 顶边：开口底部那一圈锯齿（半透明 + 白 / 深色碎点）→ 一条平的深色线 + 下面白衬衣
for x in range(CX - 27, CX + 28):
    col = a[:, x]; ys = [y for y in range(Y1 - 8, Y1 + 10) if col[y, 3] > 128 and col[y, :3].mean() > 200]          # 这一列白衬衣最上面的像素
    yw = (min(ys) if ys else Y1 + 2)
    col[Y1 - 8:Y1, 3] = 0; col[Y1:Y1 + 2] = NAVY + (255,)
    for y in range(Y1 + 2, max(yw, Y1 + 2) + 1): col[y] = (250, 253, 253, 255)
Image.fromarray(a).save(DST); print('ok', DST)
