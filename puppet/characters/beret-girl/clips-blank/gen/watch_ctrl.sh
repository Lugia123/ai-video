#!/bin/bash
# gen/watch_ctrl.sh <act> <seed> <后缀…>：每条出完跑 after_all + pair（控制遍 vs A），并核对成片与控制视频不是同一个文件
cd "$(dirname "$0")/.."; export V=_v2 PAIR_DIR=ctrl; act=$1; seed=$2; shift 2
for c in "$@"; do
  n=$act-ctrl-${c}-draft-s$seed
  until [ -f raw/$n.json ] || grep -qE "^(error|cancelled)" raw/$n.log 2>/dev/null; do sleep 8; done; sleep 2
  echo "md5 成片 $(md5 -q raw/$n.mp4) 控制 $(md5 -q ../../../out/control/$act-s$seed-A-$c.mp4)" > readings/$n.after.txt
  gen/after_all.sh $n >> readings/$n.after.txt 2>&1
  PAIR_B=$n PAIR_TAG=$act-ctrl-$c-s$seed python3 gen/pair.py $act $seed > readings/pair-$act-ctrl-$c-s$seed.txt 2>&1
  echo "done $n" >> readings/watch_ctrl.log
done
