#!/usr/bin/env python3
"""流水线回归：从角色来源目录的一份拷贝，把所有「可重跑」的产物删掉、按顺序重跑各步，再和原来的逐文件比 md5。不往 --source 里写任何东西。

  python3 pipeline/rebuild_check.py --source characters/<角色>/source --work <中间产物目录> [--allow 相对路径,相对路径…]

--allow 里列的文件允许不一致（只在输出里标出来，不算失败）。退出码 0 = 除 --allow 以外全部一致。
步骤和顺序写在下面的 STEPS 里；哪些文件算「可重跑的产物」写在 PRODUCTS 里，其余文件（母版、各家的 inputs/、手工件）是来源，原样留着。
目前步骤表是按第一个角色（贝雷帽女孩）的流水线写的。"""
import fnmatch, hashlib, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, 'lib'))
allow = set()
if '--allow' in sys.argv: i = sys.argv.index('--allow'); allow = set(filter(None, sys.argv[i + 1].split(','))); del sys.argv[i:i + 2]
import paths
root = os.path.dirname(paths.W('rebuild', 'x')); cs, cw = os.path.join(root, 'source'), os.path.join(root, 'work')
for d in (cs, cw): shutil.rmtree(d, ignore_errors=True)
shutil.copytree(paths.SOURCE, cs, symlinks=False); os.makedirs(cw)
PRODUCTS = ['head/rig.json', 'head/hat.png', 'hair/hair.json', 'hair/pieces/*', 'face/*.png', 'face/*.json', 'body/*.png', 'body/body.json', 'neck/*', 'poses/base.png']
md5 = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()
files = sorted(os.path.relpath(os.path.join(d, f), paths.SOURCE) for d, _, fs in os.walk(paths.SOURCE) for f in fs)
prod = [f for f in files if any(fnmatch.fnmatch(f, pat) and f.count('/') == pat.count('/') for pat in PRODUCTS)]
for f in prod: os.remove(os.path.join(cs, f))
SW = ['--source', cs, '--work', cw]; py = lambda *a: [sys.executable, os.path.join(HERE, a[0]), *a[1:]]
STEPS = [
    ('拆头部部件（中间产物）', py('03_face/split_head.py', *SW)),
    ('拆身体部件（中间产物）', py('05_rig/split_body.py', *SW)), ('拆垂臂部件（中间产物）', py('05_rig/split_armsdown.py', *SW)),
    ('头部部件表 rig.json', py('05_rig/build_rig.py', *SW)),
    ('发片 + 帽子片', ['bash', os.path.join(HERE, '02_hair/build.sh'), cs, cw]),
    ('脸底、眉、鼻、闭嘴', py('03_face/build_face.py', *SW)), ('眼睛各层', py('03_face/build_eyes.py', *SW)), ('睫毛、闭眼线', py('03_face/build_lids.py', *SW)), ('张嘴口型', py('03_face/mouth_build.py', *SW)),
    ('身体部件（第一遍）', py('04_body/bake.py', *SW)), ('并回重绘的脖子', py('04_body/retouch_apply.py', 'neck', 'body/inputs/neck_s11.png', *SW)), ('身体部件（第二遍）', py('04_body/bake.py', *SW)),
    ('脖子层', py('07_neck/neck.py', os.path.join(cs, 'master/pose_idle_f.png'), os.path.join(cs, 'neck'))),
    ('姿势库底图的领口', py('06_poses/base_collar.py', os.path.join(cs, 'pose-sources/base_w5.png'), os.path.join(cs, 'poses/base.png'))),
]
for name, cmd in STEPS:
    r = subprocess.run(cmd, capture_output=True, text=True); print(f'{"ok  " if r.returncode == 0 else "失败"} {name}')
    if r.returncode: print(r.stdout[-1500:], r.stderr[-3000:]); sys.exit(2)
after = sorted(os.path.relpath(os.path.join(d, f), cs) for d, _, fs in os.walk(cs) for f in fs)
missing = [f for f in files if f not in after]; extra = [f for f in after if f not in files]
diff = [f for f in files if f in after and md5(os.path.join(cs, f)) != md5(os.path.join(paths.SOURCE, f))]
print(f'来源目录 {len(files)} 个文件，其中可重跑的产物 {len(prod)} 个（已删掉重建），其余 {len(files) - len(prod)} 个是来源（原样）')
print(f'重建后：逐文件一致 {len(files) - len(diff) - len(missing)} 个；不一致 {len(diff)} 个；没重建出来 {len(missing)} 个；多出来 {len(extra)} 个')
for tag, lst in (('不一致', diff), ('没重建出来', missing), ('多出来', extra)):
    for f in lst: print(f'  {tag}：{f}' + ('（在 --allow 里）' if f in allow else ''))
sys.exit(1 if [f for f in diff + missing + extra if f not in allow] else 0)
