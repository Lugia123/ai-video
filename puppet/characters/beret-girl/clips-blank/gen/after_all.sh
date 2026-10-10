#!/bin/bash
# 一段出完后的全部产物：gen/after_all.sh <段名>
cd "$(dirname "$0")/.."; n=$1
python3 gen/03_key.py $n | tail -1 | cut -c1-300
python3 gen/analyze.py $n | tail -1
python3 gen/face.py $n; python3 gen/zoom.py $n every:3
bash gen/08_after.sh $n 2>&1 | tail -25
