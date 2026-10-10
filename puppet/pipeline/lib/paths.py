"""流水线脚本公用的路径约定：脚本里不写任何具体工程的路径，目录全部由命令行给。
  --source <角色来源目录>   characters/<角色>/source：母版、各类成品素材和它们的清单（build_pack.py 的输入）。脚本的最终产物写在这里
  --work   <中间产物目录>   随便一个可写目录；可重跑的中间步骤把产物放这里，后面的步骤从这里读
用法：
  from paths import S, W, rest          # S('hair/pieces/back.png') → 来源目录下的路径；W('hair/x.png') → 中间产物目录下的路径（父目录自动建）
  rest 是去掉 --source / --work 之后剩下的命令行参数。
也可以用环境变量 PUPPET_SOURCE、PUPPET_WORK 给（命令行优先），方便 shell 脚本串几步。"""
import os, sys
def _take(flag, env):
    a = sys.argv
    if flag in a:
        i = a.index(flag); v = a[i + 1]; del a[i:i + 2]; return os.path.abspath(v)
    if os.environ.get(env): return os.path.abspath(os.environ[env])
    raise SystemExit(f'必须给 {flag} <目录>（或环境变量 {env}）')
SOURCE = _take('--source', 'PUPPET_SOURCE'); WORK = _take('--work', 'PUPPET_WORK'); rest = sys.argv[1:]
def S(*rel): return os.path.join(SOURCE, *rel)
def W(*rel):
    p = os.path.join(WORK, *rel); os.makedirs(os.path.dirname(p), exist_ok=True); return p
