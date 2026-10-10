"""回归检查的总入口：python3 puppet/qa/regress/run.py <角色目录> [--page <成片页面，相对仓库根>] [--out <输出目录>]
跑完在输出目录里写 report.json 和 report.md（每条：过 / 不过、数值、阈值、对应的图），并把还没自动化、要人看图的条目列在后面。
在哪个目录运行都行。只读数据包和页面，不改任何东西。"""
import json, os, subprocess, sys, datetime
PUPPET = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))          # puppet 目录；在哪个目录运行都行
R_ = lambda *a: os.path.join(PUPPET, *a)
args = sys.argv[1:]; pack = os.path.abspath(args[0].rstrip('/'))
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
cid = os.path.basename(pack); out = os.path.abspath(opt('--out', R_('out', 'regress', cid))); page = opt('--page', 'qa/demo.html?render=1'); cfg = os.path.abspath(opt('--config', R_('qa', 'regress', cid + '.json')))          # page：相对 puppet 目录
os.makedirs(out, exist_ok=True)
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.stderr.write(r.stderr); raise SystemExit(f'失败：{" ".join(cmd)}')
    return json.loads(r.stdout.strip().splitlines()[-1])
res = run(['node', R_('qa/regress/engine_checks.mjs'), pack, cfg]) + run(['python3', R_('qa/regress/image_checks.py'), pack, cfg, out]) + run(['python3', R_('qa/regress/head_checks.py'), pack, cfg, f'{out}/head']) + run(['node', R_('qa/regress/page_checks.mjs'), page, pack, cfg])
# 姿势 kit 的逐手检查（W4 的 qa/poses/kit_checks.py）：线宽、手面积、外圈绿边、独立碎片。作为回归的一组接进来，结果并成一条。
C = json.load(open(cfg)); PZ = C.get('poses')
if PZ and not os.path.isdir(R_(PZ['assets'])):
    res.append({'id': 'pose-kit-hands', 'title': '姿势 kit 逐手检查（W4 的 kit_checks）', 'auto': False, 'info': True, 'pass': True, 'value': {'没跑': '姿势的来源图目录不在：' + PZ['assets']}, 'note': '角色的来源目录（source/）不在'})
elif PZ and os.path.exists(R_('qa/poses/kit_checks.py')) and os.path.isdir(f'{pack}/kit'):
    r = subprocess.run(['python3', R_('qa/poses/kit_checks.py'), R_(PZ['config']), '--pack', pack, '--assets', R_(PZ['assets']), '--kit-in', f'{pack}/kit', '--report', f'{out}/poses'], capture_output=True, text=True)
    kc = f'{out}/poses/kit-checks.json'
    if r.returncode in (0, 1) and os.path.exists(kc):
        k = json.load(open(kc)); bad = [f"{x['pose']} {x['side']}：{'、'.join(x['fail'])}" for x in k['rows'] if x['fail']]
        res.append({'id': 'pose-kit-hands', 'title': '姿势 kit 逐手：线宽、外圈绿边、独立碎片（W4 的 kit_checks）', 'auto': True, 'pass': not bad, 'value': {'检查的手': len(k['rows']), '不过的': bad}, 'image': 'poses/hands-audit.png', 'note': '五指、掌轮廓闭合、指尖描边、手腕接袖口没有自动判法，看 poses/hands-audit.png；线宽下限和手面积范围没有坏样本'})
    else: res.append({'id': 'pose-kit-hands', 'title': '姿势 kit 逐手检查（W4 的 kit_checks）', 'auto': True, 'pass': False, 'value': {'错误': (r.stdout[-300:] + r.stderr[-300:]).strip()}})
# W4 的两把新尺子（#1161）：手臂层外轮廓的描边缺口、肩部盖住身体的像素。各只有一个坏样本，先只出读数、不判。
for nm, cmd in (('arm-outline-gaps', ['python3', R_('qa/poses/outline_gaps.py'), f'{pack}/kit', '--base', f'{pack}/kit/base.png', '--full', 'over_covermouth.png,over_think.png', '--out', f'{out}/poses/outline-gaps']),
                ('shoulder-overlap', ['python3', R_('qa/poses/shoulder_overlap.py'), f'{pack}/kit', '--out', f'{out}/poses/shoulder-overlap'])):
    if not os.path.exists(cmd[1]) or not os.path.isdir(f'{pack}/kit'): continue
    r = subprocess.run(cmd, capture_output=True, text=True); open(f'{out}/poses/{nm}.txt', 'w').write(r.stdout + r.stderr)
    res.append({'id': nm, 'title': {'arm-outline-gaps': '手臂层外轮廓的描边缺口（W4 的 outline_gaps，只出读数）', 'shoulder-overlap': '手臂层盖在身体上的像素（W4 的 shoulder_overlap，只出读数）'}[nm], 'auto': False, 'info': True, 'pass': True,
                'value': {'读数见': f'poses/{nm}.txt', '退出码': r.returncode}, 'note': '只出读数不判：阈值只有一个坏样本（W4 #1161）'})
# 外接检查：角色配置里的 extraChecks 列表。每项 { id, title, cmd: [...], judge: false, enabled: true, note }。
#   cmd 里的 {pack} {out} {puppet} 会被替换成数据包目录、这条检查的输出目录、puppet 目录；命令在 puppet 目录里运行。
#   约定：命令往标准输出打一个 JSON（对象或数组都行）当读数；judge 为 true 时按退出码判（0 = 过），否则只出读数不判。
#   enabled 为 false 的只在报告里占个位置、写明为什么没开。别人写的检查（各自维护）从这里接进来，不用改这个入口。
for x in C.get('extraChecks', []):
    if not x.get('enabled', True):
        res.append({'id': x['id'], 'title': x['title'] + '（未启用）', 'auto': False, 'info': True, 'pass': True, 'value': {'没跑': x.get('note', '未启用')}, 'note': x.get('note', '')}); continue
    xo = f"{out}/extra/{x['id']}"; os.makedirs(xo, exist_ok=True)
    cmd = [str(c).replace('{pack}', pack).replace('{out}', xo).replace('{puppet}', PUPPET) for c in x['cmd']]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=PUPPET, env={**os.environ, **{k: str(v) for k, v in (x.get('env') or {}).items()}}); open(f'{xo}/stdout.txt', 'w').write(r.stdout + r.stderr)
    # 读数：优先读检查自己存的 readings.json，其次把标准输出整段或最后一行当 JSON
    val = None
    for cand in ([open(f'{xo}/readings.json').read()] if os.path.exists(f'{xo}/readings.json') else []) + [r.stdout.strip(), (r.stdout.strip().splitlines() or [''])[-1]]:
        try: val = json.loads(cand); break
        except ValueError: pass
    if val is None: val = {'输出': r.stdout.strip()[-400:]}
    # 嵌套的读数摊平成「上层 · 下层」的键，好给它们定上限
    def flat(d, pre=''):
        o = {}
        for k, v in d.items():
            if isinstance(v, dict): o.update(flat(v, pre + k + ' · '))
            else: o[pre + k] = v
        return o
    if isinstance(val, dict): val = flat(val)
    # 「越大越好」的读数（覆盖率之类）用 floors：{ 键的一段: 下限 }，凡是键里含这一段的都要 ≥ 下限
    floors = x.get('floors') or {}
    # limits：{ 读数的键: 上限 }（给了就按它判；键可以只写开头一段）。没给 limits 时 judge 为 true 才按退出码判
    lim = x.get('limits'); over = {}
    if lim and isinstance(val, dict):
        for k, mx in lim.items():
            hit = [kk for kk in val if kk.startswith(k)]
            if not hit: over[k] = '读数里没有这一项'
            elif isinstance(val[hit[0]], (int, float)) and val[hit[0]] > mx: over[hit[0]] = f'{val[hit[0]]} > {mx}'
    if lim and isinstance(val, dict):
        for k, mx in lim.items():          # 上限也按「键里含这一段」再扫一遍（摊平后的键前面多了上层的名字）
            for kk, vv in val.items():
                if k in kk and not kk.startswith(k) and isinstance(vv, (int, float)) and vv > mx: over[kk] = f'{vv} > {mx}'
                if k in kk and not kk.startswith(k): over.pop(k, None)
    if isinstance(val, dict):
        for k, mn in floors.items():
            for kk, vv in val.items():
                if k in kk and isinstance(vv, (int, float)) and vv < mn: over[kk] = f'{vv} < {mn}'
    judge = bool(x.get('judge')) or bool(lim) or bool(floors)
    res.append({'id': x['id'], 'title': x['title'] + ('' if judge else '（只出读数）'), 'auto': judge, 'info': not judge, 'pass': (not over if (lim or floors) else r.returncode == 0) if judge else True,
                'value': {'读数': {k: v for k, v in val.items() if not isinstance(v, (list, dict))} if isinstance(val, dict) else val, **({'超限': over} if over else {}), **({'上限': lim} if lim else {}), **({'下限': floors} if floors else {}), '输出目录': os.path.relpath(xo, out)}, 'note': x.get('note', '')})
MANUAL = [
  ('发卡四周没有浅色圈', '发卡一带 1:1，转头 −30 / 0 / +30；浅色圈和头发高光自动分不开'),
  ('每个姿势的手：五指、掌轮廓闭合、指尖有描边、手腕接袖口、无夹带碎片', '每个姿势每只手放大 2 倍；碎片和手腕连通性可以自动判，还没写'),
  ('摊手等最宽的姿势在合成后不少像素', '讲解员画布原样导出和手臂层并排（tools/host_canvas.mjs）；还没写成自动比对'),
  ('B 类整图姿势切换时头不跳、比例不变', '等 kit 里有 B 类姿势再写'),
  ('表情不许「笑着冒汗」', '预设总表「只看脸 / 只看符号」两张；语义判断'),
  ('转头的存在感、看内容和回看镜头的差别', '同一句话里两帧并排'),
  ('两遍渲染逐帧一致', '渲染脚本里已有（两遍 md5 + 渲染期间素材没被改），还没并进这个入口'),
]
rep_auto = [r for r in res if not r.get('info')]; rep_info = [r for r in res if r.get('info')]
rep = {'character': cid, 'pack': pack, 'page': page, 'when': datetime.datetime.now().isoformat(timespec='seconds'), 'auto': rep_auto, 'info': rep_info, 'manual': [{'title': t, 'how': h} for t, h in MANUAL]}
json.dump(rep, open(f'{out}/report.json', 'w'), ensure_ascii=False, indent=1)
info = [r for r in res if r.get('info')]; res = [r for r in res if not r.get('info')]
L = [f'# 回归检查 · {cid}', '', f'{rep["when"]}　数据包 `{pack}`　成片页面 `{page}`', '', f'自动判：{sum(r["pass"] for r in res)} / {len(res)} 条通过', '', '| 结果 | 检查 | 数值 | 图 |', '| --- | --- | --- | --- |']
for r in res:
    v = json.dumps(r['value'], ensure_ascii=False); v = v if len(v) < 260 else v[:257] + '…'
    L.append(f"| {'过' if r['pass'] else '**不过**'} | {r['title']}{'<br>注：' + r['note'] if r.get('note') else ''} | `{v}` | {r.get('image', '')} |")
L += ['', '## 只出读数、不判的', ''] + [f"- **{r['title']}**：`{json.dumps(r['value'], ensure_ascii=False)}`　{r.get('note', '')}" for r in info]
L += ['', '## 还要人看图的', ''] + [f'- **{t}**：{h}' for t, h in MANUAL]
open(f'{out}/report.md', 'w').write('\n'.join(L) + '\n')
for r in res: print(('过  ' if r['pass'] else '不过'), r['title'])
print(f'自动判 {sum(r["pass"] for r in res)}/{len(res)} 通过；报告 {os.path.relpath(out)}/report.md')
