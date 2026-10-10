"""搬迁 / 改动后的回归：用本目录的脚本把配置里的姿势从来源图重跑一遍，产物和一个现有 kit 逐像素比。
出图那一步不重跑——高清草稿从 --hd-from 目录拷（文件名 armhd_<姿势>_s<种子>.png）；--hd-from 里要是还有原来的预涂裁块（armhd_<姿势>_crop.png），也一并比。

  python3 verify_against_kit.py <配置.json> [姿势…] --assets <素材根> --work <目录> --kit-in <现有 kit> --kit-out <重跑输出> --report <目录> --hd-from <高清草稿目录> --pack <数据包目录>
退出码：全部一致 0，否则 1。"""
import sys, os, json, shutil, subprocess, numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import poses_lib
argv = sys.argv[1:]; hd = argv[argv.index('--hd-from') + 1]; del argv[argv.index('--hd-from'):argv.index('--hd-from') + 2]
cfg, pos, flags, opts = poses_lib.cli(argv, __doc__); here = os.path.dirname(os.path.abspath(__file__)); names = pos or list(cfg['poses'])
common = [cfg.path, '--assets', cfg.assets, '--work', cfg.work] + (['--pack', cfg.pack] if cfg.pack else []); bad = 0
def diff(a, b):
    if not (os.path.exists(a) and os.path.exists(b)): return '缺文件'
    A, B = [np.asarray(Image.open(q).convert('RGBA')).astype(int) for q in (a, b)]
    if A.shape != B.shape: return f'尺寸不同 {A.shape} {B.shape}'
    d = np.abs(A - B); nd = int((d.sum(-1) > 0).sum()); return None if nd == 0 else f'{nd} 个像素不同（alpha 不同 {int((d[..., 3] > 0).sum())}，最大差 {int(d.max())}）'
def run(script, *a):
    r = subprocess.run([sys.executable, os.path.join(here, script), *a], capture_output=True, text=True)
    if r.returncode: print(r.stdout[-600:], r.stderr[-900:]); raise SystemExit(f'{script} 失败')
kit = json.load(open(cfg.ki(cfg['kit']['poses'])))
for n in names:
    P = cfg.pose(n); run('arm_prep.py', cfg.path, n, *common[1:]); out = []
    oc = os.path.join(hd, f'armhd_{n}_crop.png')
    if os.path.exists(oc): out.append(('预涂裁块', diff(cfg.w(f'armhd_{n}_crop.png'), oc)))
    shutil.copy(os.path.join(hd, f'armhd_{n}_s{P["seed"]}.png'), cfg.work)
    run('arm_bake.py', cfg.path, 'bake', n, *common[1:], '--kit-in', cfg.kit_in, '--kit-out', cfg.kit_out, '--report', cfg.report)
    if P.get('cuff'):          # 袖口统一：对这次烘出来的层就地做
        kk = json.load(open(cfg.k(cfg['kit']['poses']))); layers = [kk[q][kind] for q in [n] + ([P['mirror']] if P.get('mirror') else []) for kind in ('arms', 'over') if kk.get(q, {}).get(kind)]
        run('cuff_unify.py', cfg.path, *layers, *common[1:], '--kit-in', cfg.kit_in, '--kit-out', cfg.kit_out, '--report', cfg.report)
    for name in [n] + ([P['mirror']] if P.get('mirror') else []):
        for kind in ('arms', 'over'):
            f = kit.get(name, {}).get(kind)
            if f: out.append((f, diff(cfg.k(f), cfg.ki(f))))
    for what, res in out: print(f'{n:12s} {what:26s} {"一致" if res is None else "不一致：" + res}'); bad += res is not None
print('全部一致' if not bad else f'{bad} 项不一致'); sys.exit(1 if bad else 0)
