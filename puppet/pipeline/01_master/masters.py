"""把头 / 身体裁块高清重绘成母版（40 步定稿）。

  python3 masters.py <配置.json> --work <裁块所在、也是输出的目录> [--dry-run] [名字…]
  → <work>/head_master.png、body_master.png（已存在就跳过）
每张母版的尺寸、种子、prompt、用哪张裁块在配置 masters 里。--dry-run 只打印要发的命令。
生图服务的地址 / 客户端只从环境变量来，见 ../06_poses/imggen.py（IMGGEN_CLIENT、IMGGEN_PYTHON、IMGGEN_URL）。"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '06_poses'))
import imggen
argv = sys.argv[1:]
if len(argv) < 3: raise SystemExit(__doc__)
cfg = json.load(open(argv[0], encoding='utf-8')); W = argv[argv.index('--work') + 1]; dry = '--dry-run' in argv
only = [a for a in argv[1:] if not a.startswith('--') and a != W]
for m in cfg['masters']:
    if only and m['name'] not in only: continue
    imggen.run(os.path.join(W, m['name'] + '.png'), m['size'][0], m['size'][1], m['seed'], m['prompt'], [os.path.join(W, m['from'] + '.png')], final=True, dry=dry, log=os.path.join(W, 'prompts.log'))
