"""姿势 kit 的静态检查（不开页面、不渲染）：对一个 kit 目录里每个姿势的每只手量四项并判过 / 不过。
量法在 pipeline/06_poses/hands_audit.py（本脚本调它），阈值在本目录 kit_checks.json。

  python3 kit_checks.py <姿势配置.json> --pack <数据包目录> --assets <素材根> --kit-in <kit 目录> --report <输出目录>
  → <report>/hands-audit.png（逐手三色底 2 倍，人看）、hands-audit.json、kit-checks.json；退出码 0 = 全过
对应 CONSOLIDATION 第 2 节 b 的第 7 条里能自动的部分（碎片）和手臂层镶边那条；五指、轮廓闭合、指尖描边、手腕接袖口没有自动判法，看 hands-audit.png。"""
import sys, os, json, subprocess
here = os.path.dirname(os.path.abspath(__file__)); argv = sys.argv[1:]; opt = lambda k: argv[argv.index(k) + 1]
if len(argv) < 9: raise SystemExit(__doc__)
rep = opt('--report'); os.makedirs(rep, exist_ok=True); TH = json.load(open(os.path.join(here, 'kit_checks.json'), encoding='utf-8'))
r = subprocess.run([sys.executable, os.path.join(here, '..', '..', 'pipeline', '06_poses', 'hands_audit.py'), argv[0], '--pack', opt('--pack'), '--assets', opt('--assets'), '--work', os.path.join(rep, '_work'), '--kit-in', opt('--kit-in'), '--report', rep], capture_output=True, text=True)
if r.returncode: print(r.stdout[-500:], r.stderr[-800:]); sys.exit(2)
rows = json.load(open(os.path.join(rep, 'hands-audit.json'))); out = []; bad = 0
for x in rows:
    fails = []
    if not TH['lineWidth']['min'] <= x['lineWidth'] <= TH['lineWidth']['max']: fails.append('线宽')
    if x['greenFringePct'] > TH['greenFringePct']['max']: fails.append('绿边')
    if x['fragments'] > TH['fragments']['max']: fails.append('碎片')
    out.append({**x, 'fail': fails}); bad += bool(fails)
    print(f'{x["pose"]:12s} {x["side"]}  线宽 {x["lineWidth"]:5.2f}  面积 {x["skinArea"]:5d}  绿边 {x["greenFringePct"]:5.1f}%  碎片 {x["fragments"]}  {"过" if not fails else "不过：" + "、".join(fails)}')
json.dump({'thresholds': TH, 'rows': out, 'failed': bad}, open(os.path.join(rep, 'kit-checks.json'), 'w'), ensure_ascii=False, indent=1)
print('全过' if not bad else f'{bad} 只手不过'); sys.exit(1 if bad else 0)
