#!/usr/bin/env python3
# 手压脸的帧：python3 gen/handface.py <段名>…   脸皮肤区（归位帧里 R_FACE 内接近皮肤色、内缩 6px）里，对齐头位移后与归位帧相差 >40 的像素数；
# 超过「前 3 帧最大值 + 300」的帧记为疑似（要对着 -face.jpg 逐格核）。写 readings/<段名>.hand.json
import sys, os, json, subprocess, numpy as np, cv2
R = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + '/..'); w, h = 832, 1104
blank = cv2.cvtColor(cv2.imread(f'{R}/home_blank_v2_magenta.png'), cv2.COLOR_BGR2RGB).astype(np.float32)
fx0, fx1, fy0, fy1 = 283, 541, 355, 526; skin = np.median(blank[415:506, 305:516].reshape(-1, 3), 0)
m = np.zeros((h, w), np.uint8); m[fy0:fy1, fx0:fx1] = (np.abs(blank[fy0:fy1, fx0:fx1] - skin).max(2) < 25); m = cv2.erode(m, np.ones((13, 13), np.uint8)) > 0
def gray(f): return cv2.cvtColor(f.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
hat = (slice(150, 290), slice(220, 620)); win = cv2.createHanningWindow((400, 140), cv2.CV_32F); g0 = gray(blank)[hat]
for name in sys.argv[1:]:
    fr = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{R}/raw/{name}.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, h, w, 3).astype(np.float32)
    c = []
    for f in fr:
        a, b = cv2.phaseCorrelate(g0, gray(f)[hat], win)[0]
        s = cv2.warpAffine(f, np.float32([[1, 0, -a], [0, 1, -b]]), (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        c.append(int(((np.abs(s - blank).max(2) > 40) & m).sum()))
    thr = max(c[:3]) + 300; fl = [i for i, x in enumerate(c) if x > thr]
    json.dump({'clip': name, 'skin_px': int(m.sum()), 'counts': c, 'thr': thr, 'frames': fl}, open(f'{R}/readings/{name}.hand.json', 'w'))
    print(name, 'thr', thr, 'max', max(c), '疑似帧', fl)
