#!/bin/bash
export LC_ALL=en_US.UTF-8 PYTHONUTF8=1
# 提交一张改图（涂色补画）。不可重跑：同样的输入和种子不保证出同一张图，结果图就是来源，采用后和它的输入图一起存进来源目录。
# 用法：edit.sh <输出名> <W> <H> <seed> <prompt> <参考图...>   默认 8 步草稿；FINAL=1 走 40 步定稿
# 环境变量（服务地址和令牌只从环境变量来，不写进任何文件；令牌由客户端自己读）：
#   PUPPET_WORK     中间产物目录（必须）。结果写 ${PUPPET_WORK}/body/gen/<输出名>.png，已存在就跳过；prompt 记到同目录的 prompts.log
#   IMGGEN_CLIENT   生图客户端脚本的路径（必须）
#   IMGGEN_PYTHON   跑客户端用的解释器（默认 python3）
#   IMGGEN_URL      服务地址（可选）：给了就先轮询 ${IMGGEN_URL}/health，等服务空了再发。一次只提交一个。
# 参考图通常是 retouch_inputs.py 的产物 ${PUPPET_WORK}/body/in/<项>.png。
: "${PUPPET_WORK:?必须设 PUPPET_WORK（中间产物目录）}" "${IMGGEN_CLIENT:?必须设 IMGGEN_CLIENT（生图客户端脚本路径）}"
PY=${IMGGEN_PYTHON:-python3}
name=$1; mkdir -p "${PUPPET_WORK}/body/gen"; out=${PUPPET_WORK}/body/gen/${name}.png; W=$2; H=$3; seed=$4; prompt=$5; shift 5
[ -f "${out}" ] && { echo "skip ${out}"; exit 0; }
if [ -n "${IMGGEN_URL}" ]; then
  until [ "$(curl -s -m 5 "${IMGGEN_URL%/}/health" | ${PY} -c 'import json,sys;d=json.load(sys.stdin);print(d["busy"]+d["image_waiting"]+len(d["video_jobs_active"]))' 2>/dev/null)" = "0" ]; do sleep 6; done
fi
echo "[${name}] seed=${seed} ${W}x${H} ${FINAL:+final} refs=$*  :: ${prompt}" >> "${PUPPET_WORK}/body/gen/prompts.log"
t0=$(date +%s)
${PY} "${IMGGEN_CLIENT}" edit "$@" "${prompt}" $([ -n "${FINAL}" ] && echo --final) -W ${W} -H ${H} --seed ${seed} -o "${out}" 2>&1 | tail -1
echo "[${name}] $(( $(date +%s) - t0 )) s" >> "${PUPPET_WORK}/body/gen/prompts.log"
