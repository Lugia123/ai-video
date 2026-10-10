#!/bin/bash
cd "$(dirname "$0")/.."; export V=_v2 PROMPTS=prompts2.sh
for a in "wave_h1 draft 3" "wave_h1 draft 4" "wave_h1 draft 5" "wave_h1 draft 6" "wave_h1 draft 7" "wave_h1 draft 8" "think_h1c draft 3" "think_h1c draft 4" "think_h1c draft 5" "think_h1c draft 6" "think_h1c draft 7" "think_h1c draft 8"; do
  /usr/bin/python3 gen/gen.py $a > raw/last_r3.log 2>&1; grep -E "生成|error|cancel" raw/last_r3.log | cut -c1-200 | tee -a readings/run_r3.log
  curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])" | tee -a readings/run_r3.log
done
