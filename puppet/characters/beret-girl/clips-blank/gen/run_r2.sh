#!/bin/bash
cd "$(dirname "$0")/.."; export V=_v2 PROMPTS=prompts2.sh
for a in "wave_h1 draft 1" "think_h1 draft 1" "wave_h2 draft 1" "think_h2 draft 1" "wave_h3 draft 1" "shrug_h1 draft 1" "wave_h1 draft 2" "think_h1 draft 2"; do
  /usr/bin/python3 gen/gen.py $a > raw/last_r2.log 2>&1; grep -E "生成|error|cancel" raw/last_r2.log | cut -c1-200
  curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])"
done
