"""第 3 步 高清重绘：把预涂好的裁块（arm_prep.py 的产物）放大重绘到 crop.hd，绿底保持；手和袖子的线是模型自己画的原线，之后按色度抠。

  python3 arm_hd.py <配置.json> <姿势> <种子…> --assets <素材根> --work <中间产物目录> [--final] [--dry-run]
  → <work>/armhd_<姿势>_s<种子>.png        （--final 走 40 步，文件名末尾加 f；默认 8 步草稿，命中即用）
  --dry-run 只打印要发的命令。服务地址 / 客户端见 imggen.py（环境变量）。"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from poses_lib import cli
import imggen

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
n, seeds = pos[0], pos[1:]; cfg.pose(n); W_, H_ = cfg['crop']['hd']; final = '--final' in flags
for s in seeds:
    imggen.run(cfg.w(f'armhd_{n}_s{s}{"f" if final else ""}.png'), W_, H_, s, cfg['prompts']['hd'], [cfg.w(f'armhd_{n}_crop.png')], final=final, dry='--dry-run' in flags, log=cfg.w('prompts.log'))
