#!/usr/bin/env python3
"""给一个片段库「穿戴整齐」，让讲解员能带口型、眨眼、漫符地播：一条命令，换了静帧（比如草稿换成正式档）之后重跑。

    python3 pipeline/clips/dress.py characters/<角色> [--lib clips-draft2] [--poses think,shrug] [--track wave_loop,think_loop --no-paste turn_loop,spin_loop]

依次做：
  1. clips/sync.py            体检、量包围盒、更新 clips.js
  2. clips/bake_patches.py    给每张静帧（归位帧、各动作的停顿帧）烘口型四个、眨眼、干净脸、表情脸，并量「头部母版 → 这张静帧」的对位
  2c. clips/face_attrs.py    给每张静帧、每段片段写 facePaste / browSwap / faceBlank（程序建议值 + <库>/face_attrs.json 人工覆盖）
  2b. clips/track_head.py    （库配了才做）片段逐帧头部跟踪：动作进行中也能把口型、表情钉在脸上。第一次用 --track 片段,片段 --no-paste 片段,片段 指定，
                              之后记在 <库>/dress.json 里，不给参数照旧跑
  3. qa/clips/fit.py          每段片段重量动作进度 arc（帧换了就得重量）；最短时长沿用库里已有的，没有的按 0.3 秒（一段做完去和回的 0.6 秒）
  4. host-clips/bake_points.py 每张静帧的漫符挂点、每段片段里头的逐帧位移
  5. 再 sync 一遍
  6. qa/clips/wrap_scan.py   扫一遍库里的贴片和跟踪垫层，有没有数值回绕出来的亮青 / 亮品红 / 亮黄色块；有就停（退出码非 0）
哪一步没过就停在那一步并说是哪一步。--poses 原样传给贴片烘焙（只重烘这几张静帧）。"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.normpath(os.path.join(HERE, '..', '..'))


def main():
    argv = sys.argv[1:]; opt = {}; args = []
    it = iter(argv)
    for a in it:
        if a in ('--lib', '--poses', '--track', '--no-paste'): opt[a] = next(it)
        else: args.append(a)
    if len(args) != 1: sys.exit(__doc__)
    char = args[0].rstrip('/'); lib = opt.get('--lib', 'clips'); libdir = os.path.join(char, lib)
    def step(n, what, cmd, cwd=None):
        print(f'[{n}/6] {what}', flush=True); r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
        tail = [l for l in (r.stdout + r.stderr).strip().splitlines() if l.strip()][-3:]
        for l in tail: print('      ' + l[:200])
        if r.returncode: sys.exit(f'停在第 {n} 步（{what}），退出码 {r.returncode}')
    py = sys.executable
    step(1, 'sync：体检、包围盒', [py, os.path.join(PUPPET, 'clips', 'sync.py'), libdir])
    dj0 = os.path.join(libdir, 'dress.json'); cfg0 = json.load(open(dj0, encoding='utf-8')) if os.path.exists(dj0) else {}
    step(2, '烘贴片：口型、眨眼、干净脸、对位', [py, os.path.join(PUPPET, 'clips', 'bake_patches.py'), char, '--lib', lib] + (['--poses', opt['--poses']] if '--poses' in opt else []) + (['--align-from', cfg0['alignFrom']] if cfg0.get('alignFrom') else []) + (['--orig-frame', os.path.join(char, cfg0['origRest'])] if cfg0.get('origRest') else []) + (['--ink'] if cfg0.get('ink') else []) + (['--nobrow-frame', os.path.join(char, cfg0['noBrow'])] if cfg0.get('noBrow') and cfg0.get('ink') else []))
    if cfg0.get('origRest'):              # 空脸库：默认脸 = 原（有脸的）归位帧上的眉 + 眼 + 鼻 + 嘴，叠回空脸归位帧要和原归位帧逐像素相同
        nbf = os.path.join(char, cfg0['noBrow']) if cfg0.get('noBrow') else None
        step('2d', '默认脸贴片（clips/make_default_face.py，并验逐像素还原）', [py, os.path.join(PUPPET, 'clips', 'make_default_face.py'), libdir, '--orig', os.path.join(char, cfg0['origRest'])] + (['--noBrow', nbf] if nbf else []))
    # 逐帧头部跟踪（动作中也能贴口型、表情）：哪些片段要量、哪些整段标成不可贴，记在 <库>/dress.json 里，下次不给参数就照它跑
    dj = os.path.join(libdir, 'dress.json'); cfg = json.load(open(dj, encoding='utf-8')) if os.path.exists(dj) else {}
    if '--track' in opt: cfg['track'] = [x for x in opt['--track'].split(',') if x]
    if '--no-paste' in opt: cfg['noPaste'] = [x for x in opt['--no-paste'].split(',') if x]
    if '--track' in opt or '--no-paste' in opt: json.dump(cfg, open(dj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if cfg.get('track') or cfg.get('noPaste'):
        step('2b', '逐帧头部跟踪（clips/track_head.py）', [py, os.path.join(PUPPET, 'clips', 'track_head.py'), libdir] + cfg.get('track', []) + (['--blank'] if cfg.get('blank') else []) + (['--refine'] if cfg.get('refine') else []) + (['--ink-mask'] if cfg.get('ink') else []) + (['--per-feature'] if cfg.get('perFeature') else []) + (['--rest-a', os.path.join(char, cfg['twoPass']['restA']), '--src-a', ','.join(f'{k}={os.path.join(char, v)}' for k, v in cfg['twoPass']['srcA'].items())] if cfg.get('twoPass') else []) + (['--no-paste', ','.join(cfg['noPaste'])] if cfg.get('noPaste') else []))
    step('2c', '脸可换程度（clips/face_attrs.py：facePaste / browSwap / faceBlank，人工覆盖在 <库>/face_attrs.json）', [py, os.path.join(PUPPET, 'clips', 'face_attrs.py'), libdir])
    L = json.load(open(os.path.join(libdir, 'clips.json'), encoding='utf-8')); n = 0
    print('[3/6] 重量动作进度 arc', flush=True)
    for name, c in L['clips'].items():
        if c.get('opaque'): continue
        mn = c.get('minSeconds', 0.6 if c.get('from') == c.get('to') else 0.3)
        r = subprocess.run([py, os.path.join(PUPPET, 'qa', 'clips', 'fit.py'), libdir, name, '--write-arc', '--write-min', str(mn)], cwd=PUPPET, capture_output=True, text=True)
        if r.returncode: sys.exit(f'停在第 3 步（{name} 的 arc）：' + (r.stderr or r.stdout)[-400:])
        n += 1
    print(f'      {n} 段')
    step(4, '烘挂点：静帧的漫符挂点、片段里头的位移', [py, os.path.join(PUPPET, 'host-clips', 'bake_points.py'), char, '--lib', lib])
    step(5, 'sync：收尾', [py, os.path.join(PUPPET, 'clips', 'sync.py'), libdir])
    # 收尾检查：贴片和跟踪垫层里有没有「数值回绕」的亮色块（算图时超出 0–255 没夹住）。2026-10-08 出过一次：垫层加时间平滑后回绕成亮青色块，渲进了成片。
    scan = [d for d in (os.path.join(libdir, 'patches'), os.path.join(libdir, 'track')) if os.path.isdir(d)]
    if scan: step(6, '回绕色块检查（qa/clips/wrap_scan.py）', [py, os.path.join(PUPPET, 'qa', 'clips', 'wrap_scan.py')] + scan)
    print(f'好了：{libdir}。接着渲一段 1:1 的片子给人看（pipeline/clips/review.py，或 demo-host.html?lib=…&one=1）。')


if __name__ == '__main__':
    main()
