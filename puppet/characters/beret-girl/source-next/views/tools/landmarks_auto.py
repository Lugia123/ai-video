#!/usr/bin/env python3
"""给各视图登记同名对应点（#1168）。在 source-next/views/ 下运行：python3 tools/landmarks_auto.py
- W1 下午的四张（front / slight-L / quarter-L / profile-L）：34 个人工读的点原样从 proto-b/views/views.json 抄过来。
- 新视图：只有能自动量的几个点（帽顶、帽檐两端、发卡四角、近侧耳朵上下端），其余点写 null、status 记「未读」。
  名字和 W1 的一致。near = 靠近镜头的一侧（朝左的视图是她自己的左侧，朝右的视图是她自己的右侧）。
  帽檐：朝左的视图 far = 画面左端、near = 画面右端；朝右的视图反过来（和 W1 在正侧面的约定一致：far 是帽檐前端）。
坐标是 1408² 画布（head_master_px），[x, y, visible]。自动点的精度约 ±6px，发卡四角的顺序是按最小外接矩形排的，没有人工核过。"""
import json, os, sys
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = json.load(open(os.path.join(HERE, '../../../../../episodes/ep09-screenshot-devlog/proto-b/views/views.json')))
J = json.load(open(os.path.join(HERE, 'views.json')))
MAP = {'front': 'head-v0-front.png', 'slight-L': 'head-v1-slight.png', 'quarter-L': 'head-v2-quarter.png', 'profile-L': 'head-v3-profile.png'}
NAMES = list(OLD['views']['head-v0-front.png']['landmarks'].keys())
for fn, v in J['views'].items():
    n = v['view']
    if n in MAP:
        v['landmarks'] = OLD['views'][MAP[n]]['landmarks']; v['landmarks_status'] = 'W1 人工读点（±5px），原样沿用'; continue
    im = cv2.imread(os.path.join(HERE, fn), cv2.IMREAD_UNCHANGED); bgr, a = im[..., :3].copy(), im[..., 3]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.int16); lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.int16)
    ok = a > 200; Hh, Sa, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    hat = cv2.morphologyEx((ok & (Hh > 98) & (Hh < 125) & (Sa > 90) & (V > 40) & (V < 140)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    k, cc, st, _ = cv2.connectedComponentsWithStats(hat); hat = cc == 1 + int(np.argmax(st[1:, 4])); ys, xs = np.where(hat)
    L = {nm: [None, None, None] for nm in NAMES}
    top = ys.min(); L['hat_top'] = [int(xs[ys == top].mean()), int(top), True]
    li, ri = int(np.argmin(xs)), int(np.argmax(xs)); left, right = [int(xs[li]), int(ys[xs == xs[li]].mean()), True], [int(xs[ri]), int(ys[xs == xs[ri]].mean()), True]
    facing_right = v['nominal_yaw'] > 0 and n != 'back'
    L['brim_far_end'], L['brim_near_end'] = (right, left) if facing_right else (left, right)
    pin = cv2.morphologyEx((ok & (Hh > 14) & (Hh < 32) & (Sa > 140) & (V > 150) & (np.indices(a.shape)[0] < 900)).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    k, cc, st, _ = cv2.connectedComponentsWithStats(pin)
    if k > 1 and st[1:, 4].max() > 600:
        j = 1 + int(np.argmax(st[1:, 4])); pts = cv2.boxPoints(cv2.minAreaRect(np.argwhere(cc == j)[:, ::-1].astype(np.float32)))
        c = pts.mean(0); ang = np.arctan2(pts[:, 1] - c[1], pts[:, 0] - c[0]); o = pts[np.argsort(ang)]            # 从左上开始顺时针：tl, tr, br, bl
        for nm, p in zip(('pin_tl', 'pin_tr', 'pin_br', 'pin_bl'), o): L[nm] = [int(p[0]), int(p[1]), True]
    else:
        for nm in ('pin_tl', 'pin_tr', 'pin_br', 'pin_bl'): L[nm] = [None, None, False]
    skin = cv2.morphologyEx((ok & (lab[..., 0] > 190) & (lab[..., 1] > 132) & (lab[..., 2] > 136) & (Hh < 20)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    k, cc, st, cen = cv2.connectedComponentsWithStats(skin)
    # 耳朵：头部高度内、面积 0.15%–2.2% 的肤色块里，离脸的前缘最远的一个（朝左看 → 最靠右；朝右看 → 最靠左）；正后看不到
    cand = [j for j in range(1, k) if 0.0015 * a.size < st[j, 4] < 0.022 * a.size and 600 < cen[j][1] < 1150]
    if cand and n != 'back':
        j = (min if facing_right else max)(cand, key=lambda j: cen[j][0]); ey, ex = np.where(cc == j)
        L['ear_near_top'] = [int(ex[ey == ey.min()].mean()), int(ey.min()), True]; L['ear_near_bottom'] = [int(ex[ey == ey.max()].mean()), int(ey.max()), True]
    else:
        L['ear_near_top'] = L['ear_near_bottom'] = [None, None, False]
    if abs(v['nominal_yaw']) >= 135:                                                   # 后 3/4 和正后：五官都看不到
        for nm in NAMES:
            if nm.startswith(('eye_', 'iris_', 'brow_', 'nose', 'mouth_', 'chin', 'contour_far', 'hairline')): L[nm] = [None, None, False]
    v['landmarks'] = L
    got = sum(1 for p in L.values() if p[2] is True); inv = sum(1 for p in L.values() if p[2] is False); todo = sum(1 for p in L.values() if p[2] is None)
    v['landmarks_status'] = f'自动量 {got} 个，标为看不到 {inv} 个，未读 {todo} 个（五官、脸缘、发际、呆毛根要人工读）'
    print(n, v['landmarks_status'])
J['landmarks_readme'] = OLD.get('landmarks_readme', '') + ' ｜ 新视图的点见各自的 landmarks_status；[x, y, null] 表示还没读。'
json.dump(J, open(os.path.join(HERE, 'views.json'), 'w'), ensure_ascii=False, indent=1)
# 核对图：把点画回去
tiles = []
for fn, v in J['views'].items():
    if v['view'] in MAP: continue
    im = cv2.imread(os.path.join(HERE, fn), cv2.IMREAD_UNCHANGED); al = im[..., 3:4] / 255.; c = (im[..., :3] * al + np.float32([242, 239, 236]) * (1 - al)).astype(np.uint8).copy()
    for nm, p in v['landmarks'].items():
        if p[2] is True:
            cv2.circle(c, (p[0], p[1]), 9, (0, 0, 255), 3); cv2.putText(c, nm, (p[0] + 12, p[1] + 6), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    cv2.putText(c, v['view'], (20, 1380), cv2.FONT_HERSHEY_SIMPLEX, 1.6, (0, 0, 0), 3); tiles.append(cv2.resize(c, (704, 704)))
out = os.path.join(HERE, '../../../../out/views'); cv2.imwrite(os.path.join(out, 'landmarks-auto-check.jpg'), np.vstack([np.hstack(tiles[:3]), np.hstack(tiles[3:6])]))
