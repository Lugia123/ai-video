#!/bin/bash
export LC_ALL=en_US.UTF-8 PYTHONUTF8=1
# 多视图头部出图包装（#1168；照 proto-b/gen/turnaround/gen.sh 改的，产物放 source-next/views/cand/）。
#   tools/gen.sh <输出名> <W> <H> <seed> <prompt 文件> <参考图...>      默认 8 步草稿；FINAL=1 走 40 步
# 在 puppet/characters/beret-girl/source-next/views/ 下跑。已存在就跳过；每次调用记一行到 cand/log.tsv。
# 服务器串行共享：等没有别的生图在排队再提交，一次只提交一个。地址和令牌由 tools/imggen/client.py 从环境变量读。
cd "$(dirname "$0")/.."
ROOT=$(cd ../../../../.. && pwd)
name=$1; out=cand/${name}.png; W=$2; H=$3; seed=$4; pf=$5; shift 5
[ -f "${out}" ] && { echo "skip ${out}"; exit 0; }
[ -f "${pf}" ] || { echo "没有 prompt 文件 ${pf}"; exit 1; }
until [ "$(/usr/bin/python3 ${ROOT}/tools/imggen/client.py health 2>/dev/null | /usr/bin/python3 -c 'import json,sys;d=json.load(sys.stdin);print(d["image_waiting"])' 2>/dev/null)" = "0" ]; do sleep 6; done
t0=$(date +%s)
/usr/bin/python3 ${ROOT}/tools/imggen/client.py edit "$@" "$(cat "${pf}")" $([ -n "${FINAL}" ] && echo --final) ${CFG:+--cfg ${CFG}} -W ${W} -H ${H} --seed ${seed} -o "${out}" 2>&1 | tail -1
printf '%s\t%s\t%sx%s\tseed=%s\t%s\t%s\trefs=%s\t%ss\n' "$(date '+%H:%M:%S')" "${name}" "${W}" "${H}" "${seed}" "${FINAL:+final}${CFG:+cfg${CFG}}" "${pf}" "$*" "$(( $(date +%s) - t0 ))" >> cand/log.tsv
