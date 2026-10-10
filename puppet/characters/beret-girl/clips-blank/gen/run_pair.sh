#!/bin/bash
# 同种子配对：A = 有五官归位帧（home_withface_magenta.png），提示词与 B（空脸）完全同一份文本；先等上一批在飞的任务结束
cd "$(dirname "$0")/.."; export V=_v2 PROMPTS=prompts2.sh HOME_FILE=home_withface_magenta.png VTAG=A
while pgrep -f "gen/gen.py" >/dev/null; do sleep 5; done
for a in "wave_h1 draft 1" "wave_h1 draft 2" "think_h1 draft 1" "think_h1 draft 2"; do
  /usr/bin/python3 gen/gen.py $a > raw/last_pair.log 2>&1; grep -E "生成|error|cancel" raw/last_pair.log | cut -c1-200 | tee -a readings/run_pair.log
  curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])" | tee -a readings/run_pair.log
done
