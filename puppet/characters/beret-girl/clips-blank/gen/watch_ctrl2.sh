#!/bin/bash
# gen/watch_ctrl2.sh "<act> <seed> <控制文件> <tier> <标签>" …：每条出完跑 after_all + pair；A 取 <act>-blank2A-draft-s<seed>
cd "$(dirname "$0")/.."; export V=_v2 PAIR_DIR=ctrl
for spec in "$@"; do
  set -- $spec; act=$1; seed=$2; ctl=$3; tier=$4; tag=$5; an=$6; n=$act-ctrl-$tag-$tier-s$seed
  until [ -f raw/$n.json ] || grep -qE "^(error|cancelled)|Error" raw/$n.log 2>/dev/null; do sleep 8; done; sleep 2
  echo "md5 成片 $(md5 -q raw/$n.mp4) 控制 $(md5 -q $ctl)" > readings/$n.after.txt
  gen/after_all.sh $n >> readings/$n.after.txt 2>&1
  PAIR_A=${an:-$act-blank2A-draft-s$seed} PAIR_REF0=${PAIR_REF0_ON:-} PAIR_B=$n PAIR_TAG=$act-ctrl-$tag-$tier-s$seed python3 gen/pair.py $act $seed > readings/pair-$act-ctrl-$tag-$tier-s$seed.txt 2>&1
  echo "done $n" >> readings/watch_ctrl.log
done
