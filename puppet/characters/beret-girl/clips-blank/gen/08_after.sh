#!/bin/bash
# 一段出完后的例行产物：gen/08_after.sh <段名>
#   → out/clips-blank/review/<段名>.mp4（人物 1:1 连续片，浅底 + 深底，原速两遍 + 半速一遍）
#   → out/clips-blank/checks/<段名>.json / .png（W3 的 checks.py 读数）
#   → out/clips-blank/<段名>-zoom.jpg（隔 2 帧原像素）、转身类另出 <段名>-feet.jpg（逐帧脚部）
cd "$(dirname "$0")/.."; n=$1; P=../../..
python3 $P/pipeline/clips/review.py frames/$n --crop --out $P/out/clips-blank/review/$n.mp4
(cd $P && python3 qa/clips/checks.py characters/beret-girl/clips-blank/frames/$n --rest characters/beret-girl/clips-blank/home_blank${V}_rgba.png --regions qa/clips/beret-girl.json --name $n --out out/clips-blank/checks) | tee readings/$n.checks.txt
python3 gen/zoom.py $n every:2
case $n in turn*|spin*) python3 gen/feet.py $n;; esac
grep -h "生成" raw/$n.log
