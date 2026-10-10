#!/bin/bash
# gen/run_ctrl2.sh "<act> <seed> <控制文件(相对 clips-blank 或 ../../../out/control/ 下的完整文件名)> <tier draft|mid8c15> <标签>" …（连着发）
# 成片名 <act>-ctrl-<标签>-<tier>-s<seed>；mid8c15 = LoRA、8 步、cfg 1.5、带反向词
cd "$(dirname "$0")/.."
for spec in "$@"; do
  set -- $spec; act=$1; seed=$2; ctl=$3; tier=$4; tag=$5; n=$act-ctrl-$tag-$tier-s$seed
  bash -c ". ${PROMPTS:-gen/prompts2.sh}; printf '%s' \"\$P_$act\"" > ctrl/p_$act.txt
  extra=""; [ "$tier" = mid8c15 ] && extra="--steps 8 --cfg 1.5 --negative-file ctrl/neg_mid.txt"
  /usr/bin/python3 gen/ctrl.py ctrl --image home_blank_v2_magenta.png --control $ctl --prompt-file ctrl/p_$act.txt --frames ${FRAMES:-49} --width 832 --height 1104 --seed $seed --tier draft $extra --out raw/$n.mp4 --record raw/$n.json > raw/$n.log 2>&1
  tail -1 raw/$n.log | cut -c1-300 | tee -a readings/run_ctrl.log
  curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])" | tee -a readings/run_ctrl.log
done
