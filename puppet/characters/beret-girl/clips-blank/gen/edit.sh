#!/bin/bash
# 改图法：从归位帧（品红底）只去五官。三条连着发（同类请求攒批）。
cd "$(dirname "$0")/.."
P='保持图中人物完全不变：头发、帽子、发卡、挑染、衣服、姿势、腮红、肤色、品红背景、线条和画风都一模一样。只做一处修改：把脸上的两只眼睛、睫毛、两条眉毛、嘴巴全部去掉，这些位置变成和周围一样的光滑皮肤，脸上没有眼睛、没有眉毛、没有嘴。鼻子的小点和腮红保留。'
H=../clips-stage/home.png
/usr/bin/python3 ../../../../tools/imggen/client.py edit $H "$P" --seed 1 -W 1104 -H 1472 -o edit/d_s1.png 2>&1 | tee edit/d_s1.log
/usr/bin/python3 ../../../../tools/imggen/client.py edit $H "$P" --seed 2 -W 1104 -H 1472 -o edit/d_s2.png 2>&1 | tee edit/d_s2.log
/usr/bin/python3 ../../../../tools/imggen/client.py edit $H "$P" --final --seed 1 -W 1104 -H 1472 -o edit/f_s1.png 2>&1 | tee edit/f_s1.log
curl -s http://192.168.3.127:7860/health | head -c 600 > edit/health_after.txt
