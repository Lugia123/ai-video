#!/usr/bin/env python3
"""回归：从来源目录的一份拷贝重跑整条脸部流水线，重建出的 face/ 和现有的逐文件比 md5。不往 --source 里写任何东西。

  python3 verify_rebuild.py --source <角色来源目录> --work <中间产物目录>

做法：把 <source> 整个拷到 <work>/rebuild/source（跟着符号链接拷实体），删掉拷贝里 face/ 下的全部 png / json，
按顺序跑 split_head → build_face → build_eyes → build_lids → mouth_build（--source 指拷贝，--work 指 <work>/rebuild/work），再逐文件比。
退出码 0 = 全部一致。"""
import hashlib, os, shutil, subprocess, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
from paths import S as SRC, W as WK
HERE = os.path.dirname(os.path.abspath(__file__)); STEPS = ['split_head', 'build_face', 'build_eyes', 'build_lids', 'mouth_build']
root = os.path.dirname(WK('rebuild/x')); cs, cw = os.path.join(root, 'source'), os.path.join(root, 'work')
for d in (cs, cw): shutil.rmtree(d, ignore_errors=True)
shutil.copytree(SRC(), cs, symlinks=False)
real = sorted(f for f in os.listdir(SRC('face')) if f.endswith(('.png', '.json')))
for f in os.listdir(os.path.join(cs, 'face')):
    if f.endswith(('.png', '.json')): os.remove(os.path.join(cs, 'face', f))
for s in STEPS:
    r = subprocess.run([sys.executable, os.path.join(HERE, s + '.py'), '--source', cs, '--work', cw], capture_output=True, text=True)
    print(f'{s}: {"ok" if r.returncode == 0 else "失败"}')
    if r.returncode: print(r.stdout[-2000:], r.stderr[-4000:]); sys.exit(2)
md5 = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()
built = sorted(os.listdir(os.path.join(cs, 'face'))); same, bad = [], []
for f in real:
    p = os.path.join(cs, 'face', f)
    (same if os.path.exists(p) and md5(p) == md5(SRC('face', f)) else bad).append(f if os.path.exists(p) else f + '（没重建出来）')
extra = [f for f in built if f not in real]
print(f'现有 {len(real)} 个文件，重建出 {len(built)} 个，md5 一致 {len(same)} 个')
if bad: print('不一致：', '、'.join(bad))
if extra: print('现有的里面没有、重建多出来的：', '、'.join(extra))
sys.exit(1 if bad or extra else 0)
