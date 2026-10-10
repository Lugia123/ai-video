#!/usr/bin/env python3
"""把一张选中的头部候选图抠成透明底、配准到正面母版、存进 proto-b/views/ 并登记到 views.json。#1151
用法（在 proto-b/gen/turnaround/ 下）：
  python3 finalize.py <候选图> <档位名，如 v1-slight> --hat <帽顶 y> --chin <下巴最低点 y> --neck <脖子中线 x> \
      --nominal 45 --measured 33 --range 27 38 --steps 8 [--note …]
锚点是人对着 grid.py 的网格图读的（±10 px）。帽顶不算呆毛。
配准：整张图等比缩放，使「帽顶到下巴」的高度等于母版的（1097 px），再平移使下巴的 y 和脖子中线的 x 落在母版的位置
（母版 gen/work/head_master.png：帽顶 y=95，下巴 y=1192，脖子中线 x=686）。脖子是转头的轴，所以横向用它对齐。
抠图：背景是一整片浅灰（有的带渐变）。拟合背景平面，取「像背景」且与上/左/右三条边连通的那一片当背景；边缘收 1 px 再羽化。
（第一版从四条边泛洪填充，把贴着下边缘的衣服和帽子一起填掉了，弃用。）
没有用服务器的 /cutout（服务器在排队），这一步纯本地。"""
import sys, json, os, argparse
import numpy as np, cv2
M = dict(hat=95, chin=1192, neck=686, size=1408)
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('tag')
for k in ('hat', 'chin', 'neck'): ap.add_argument('--' + k, type=float, required=True)
ap.add_argument('--nominal', type=float); ap.add_argument('--measured', type=float); ap.add_argument('--range', type=float, nargs=2)
ap.add_argument('--steps', type=int); ap.add_argument('--note', default=''); ap.add_argument('--tol', type=int, default=9)
a = ap.parse_args()
im = cv2.imread(a.src); h, w = im.shape[:2]
# 背景模型：用上、左、右三条边（各取 6 px 宽）的像素拟合一张一次平面（背景有的带左右渐变），
# 「像背景」= 和这张平面的色差 < tol 且饱和度低；再只保留和这三条边连通的那一片（下边缘是角色的衣服，不当种子）。
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
bm = np.zeros((h, w), bool); bm[:6, :] = True; bm[:, :6] = True; bm[:, -6:] = True
X = np.c_[xx[bm], yy[bm], np.ones(bm.sum())]
plane = np.dstack([(np.c_[xx.ravel(), yy.ravel(), np.ones(h * w)] @ np.linalg.lstsq(X, im[..., c][bm].astype(np.float32), rcond=None)[0]).reshape(h, w) for c in range(3)])
dist = np.abs(im.astype(np.float32) - plane).max(axis=2)
like = (dist < a.tol).astype(np.uint8)
n, lab = cv2.connectedComponents(like, connectivity=4)
edge = np.unique(np.r_[lab[0, :], lab[:, 0], lab[:, -1]]); edge = edge[edge > 0]
bg = np.isin(lab, edge)
fg = (~bg).astype(np.uint8) * 255
fg = cv2.erode(fg, np.ones((3, 3), np.uint8)); fg = cv2.GaussianBlur(fg, (0, 0), 0.8)
rgba = np.dstack([im, fg])
s = (M['chin'] - M['hat']) / (a.chin - a.hat)
tx = M['neck'] - a.neck * s; ty = M['chin'] - a.chin * s
A = np.float32([[s, 0, tx], [0, s, ty]])
out = cv2.warpAffine(rgba, A, (M['size'], M['size']), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
al = out[..., 3] > 8; ys, xs = np.where(al)
views = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../views')); os.makedirs(views, exist_ok=True)
name = f'head-{a.tag}.png'; cv2.imwrite(os.path.join(views, name), out)   # tag 是档位名：v0-front / v1-slight / v2-quarter / v3-profile
# 贴边检查：配准后内容碰到画布边说明被裁了
clipped = [k for k, v in dict(left=xs.min() <= 1, right=xs.max() >= M['size'] - 2, top=ys.min() <= 1, bottom=ys.max() >= M['size'] - 2).items() if v]
jp = os.path.join(views, 'views.json'); db = json.load(open(jp, encoding='utf-8')) if os.path.exists(jp) else {'canvas': [M['size'], M['size']], 'reference': 'gen/work/head_master.png', 'anchors_on_canvas': {'hat_top_y': M['hat'], 'chin_y': M['chin'], 'neck_x': M['neck']}, 'facing': '角色朝画面左转（她的脸转向画面左边）；发卡在她自己头的左侧，挑染在她自己的右侧', 'views': {}}
old = db['views'].get(name, {})
db['views'][name] = {**old, 'kind': 'head', 'source': 'gen/turnaround/' + a.src, 'steps': a.steps, 'scale_applied': round(float(s), 4), 'translate_applied': [round(float(tx), 1), round(float(ty), 1)],
    'anchors_in_source': {'hat_top_y': a.hat, 'chin_y': a.chin, 'neck_x': a.neck}, 'bbox_on_canvas': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
    'head_height_px': int(M['chin'] - M['hat']), 'clipped_edges': clipped, 'bottom_edge': '画到锁骨和衣领，下边是原图的画面下缘，直切', 'note': a.note or old.get('note', '')}
if a.measured is not None: db['views'][name]['angle_eye_ratio'] = a.measured
if a.range is not None: db['views'][name]['angle_eye_ratio_range'] = a.range
json.dump(db, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(name, 'scale', round(float(s), 3), 'bbox', db['views'][name]['bbox_on_canvas'], 'clipped', clipped, 'bg%', round(bg.mean() * 100, 1))
