#!/bin/bash
# 控制视频生成：gen/run_ctrl.sh <动作写法 wave_h1|think_h1> <种子> <控制文件后缀 如 canny-line-noface> …（连着发）
cd "$(dirname "$0")/.."; act=$1; seed=$2; shift 2
bash -c ". gen/prompts2.sh; printf '%s' \"\$P_$act\"" > ctrl/p_$act.txt
for c in "$@"; do
  n=$act-ctrl-${c}-draft-s$seed
  /usr/bin/python3 gen/ctrl.py ctrl --image home_blank_v2_magenta.png --control ../../../out/control/$act-s$seed-A-$c.mp4 --prompt-file ctrl/p_$act.txt --frames 49 --width 832 --height 1104 --seed $seed --tier draft --out raw/$n.mp4 --record raw/$n.json > raw/$n.log 2>&1
  tail -1 raw/$n.log | cut -c1-300 | tee -a readings/run_ctrl.log
  curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])" | tee -a readings/run_ctrl.log
done
