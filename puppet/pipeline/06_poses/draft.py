"""第 1 步 整人姿势草稿（8 步，多抽种子；命中即用，不出 40 步）。三种出法：

  python3 draft.py <配置.json> plain <姿势> "<只描述手臂和手在做什么>" <种子…> --assets <素材根> --work <目录> [--dry-run]
      底板 = 待机母版（paths.idleDraft）。                                  → <work>/pose2d_<姿势>_s<种子>.png
  python3 draft.py <配置.json> green <姿势> "<…>" <种子…> …
      底板 = 头换成纯绿剪影的待机图（paths.greenHeadBase）。手靠近头的姿势用。  → <work>/pose2d_<姿势>g_s<种子>.png
  python3 draft.py <配置.json> paint <姿势> "<品红区域里要画成什么>" <种子…> …
      底板 = paint_mask.py 出的涂抹图 <work>/paint_<姿势>.png。文字定不住位置时用。→ <work>/pose2d_<姿势>p_s<种子>.png

公共的约束（身体不变、袖口、手的大小、背景）在配置 prompts 里，这里只拼接。服务地址 / 客户端见 imggen.py（环境变量）。"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from poses_lib import cli
import imggen

cfg, pos, flags, opts = cli(sys.argv[1:], __doc__)
kind, n, desc, seeds = pos[0], pos[1], pos[2], pos[3:]; PR = cfg['prompts']; W_, H_ = cfg['crop']['draft']
ref, prompt, tag = {'plain': (cfg.p('idleDraft'), desc + PR['draft'], ''), 'green': (cfg.p('greenHeadBase'), desc + PR['greenDraft'], 'g'),
                    'paint': (cfg.w(f'paint_{n}.png'), PR['paintPrefix'] + desc + PR['paintSuffix'], 'p')}[kind]
for s in seeds: imggen.run(cfg.w(f'pose2d_{n}{tag}_s{s}.png'), W_, H_, s, prompt, [ref], dry='--dry-run' in flags, log=cfg.w('prompts.log'))
