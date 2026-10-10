#!/bin/bash
# 发片和帽子片一键重建：组装 → 帽子片修补 → 发片的三处修补。顺序不能换：19 读 10 写的 hair.json，21 读 19 写的帽子片和 10 的中间产物。
# 用法：build.sh <来源目录（characters/<角色>/source）> <中间产物目录>
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; export PUPPET_SOURCE="$(cd "$1" && pwd)"; mkdir -p "$2"; export PUPPET_WORK="$(cd "$2" && pwd)"
mkdir -p "$PUPPET_WORK/hair/pieces_asm"
python3 "$HERE/10_assemble.py" > "$PUPPET_WORK/hair/assemble.log" 2>&1 || { tail -5 "$PUPPET_WORK/hair/assemble.log"; exit 1; }
for n in ahoge back bangs inner_L inner_R side_L side_R; do cp "$PUPPET_SOURCE/hair/pieces/$n.png" "$PUPPET_SOURCE/hair/pieces/${n}_w.png" "$PUPPET_WORK/hair/pieces_asm/"; done
python3 "$HERE/19_hat_fix.py"
python3 "$HERE/21_fix_1164b.py"
