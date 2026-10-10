#!/bin/bash
# 路线 1 提交一张：r1_gen.sh <名> <输入图> <提示词变量名> <种子> ；仓库根目录跑。一次只提交一个。地址和令牌由客户端从环境变量 / 配置读。
set -e
T=puppet/characters/beret-girl/source-next/layers-trial; source $T/tools/r1_prompts.sh
NAME=$1; IN=$2; PV=$3; SEED=$4; PROMPT="${!PV}"
/usr/bin/python3 tools/imggen/client.py edit "${IN}" "${PROMPT}" -o "${T}/r1-gen/raw/${NAME}_s${SEED}.png" --seed "${SEED}" -W 1408 -H 1408 2>&1 | sed 's#http://[0-9.:]*#<服务>#g' | tee -a "${T}/r1-gen/raw/gen.log"
