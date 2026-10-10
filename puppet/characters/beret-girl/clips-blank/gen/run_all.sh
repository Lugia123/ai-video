#!/bin/bash
cd "$(dirname "$0")/.."
for a in "wave draft 1" "wave draft 2" "think draft 1" "think draft 2" "wave mid8c15 1" "think mid8c15 1"; do
  /usr/bin/python3 gen/gen.py $a 2>&1 | grep -v '^$' | cut -c1-200; curl -s -m 8 http://192.168.3.127:7860/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('health: busy',d['busy'],'gpu',d['gpu']['used_mib'],'/',d['gpu']['total_mib'],'switches',d['mode_switches'])"
done
