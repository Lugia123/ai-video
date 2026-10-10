#!/bin/bash
# 路线 2：在公用机器上跑一张拆层（一次只跑一张）。仓库根目录跑：SEETHROUGH_SSH=<ssh 目标> r2_remote.sh <输入图> <名字> [分辨率，默认 1024]
# 机器地址只从环境变量 SEETHROUGH_SSH 读，不写进任何文件。跑之前、跑之后各在群里说一句（这个脚本不替你说）。
# 做的事：① 生图服务不忙才继续；② 调生图服务已有的「切模式」接口，让它把模型卸掉腾显存；③ 跑拆层，同时每秒记一次本进程显存；
#        ④ 调同一个接口切回生图模式（模型在下一个生图请求到来时自己加载）；⑤ 把结果拷回来。不停、不重启、不改生图服务；显存不够就失败退出。
set -e
: "${SEETHROUGH_SSH:?要设环境变量 SEETHROUGH_SSH}"
IN=$1; NAME=$2; RES=${3:-1024}; D=/opt/seethrough; T=puppet/characters/beret-girl/source-next/layers-trial
BUSY=$(/usr/bin/python3 tools/imggen/client.py health | /usr/bin/python3 -c "import sys,json;h=json.load(sys.stdin);print(h['busy']+h['image_waiting']+len(h['video_jobs_active'])+h['queue']['running']+h['queue']['pending'])")
[ "$BUSY" = "0" ] || { echo "生图服务正忙（$BUSY），不抢，稍后再来"; exit 3; }
scp -q "$IN" "$SEETHROUGH_SSH:$D/in/$NAME.png"
/usr/bin/python3 tools/imggen/client.py mode video > /dev/null          # 卸掉生图模型（视频模型要等有视频任务才加载，所以这时显卡上没有生图服务的模型）
ssh -o BatchMode=yes "$SEETHROUGH_SSH" "cd $D/repo && rm -rf $D/out/$NAME && nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits > $D/logs/$NAME.vram0 && \
  (while true; do nvidia-smi --query-compute-apps=pid,used_memory --format=csv,noheader,nounits >> $D/logs/$NAME.vram; echo --- >> $D/logs/$NAME.vram; sleep 1; done) & POLL=\$!; \
  rm -f $D/logs/$NAME.vram; S=\$(date +%s); HF_HUB_OFFLINE=1 PYTHONPATH=common $D/venv/bin/python inference/scripts/inference_psd.py --srcp $D/in/$NAME.png --save_dir $D/out/$NAME \
  --resolution $RES --repo_id_layerdiff $D/models/layerdiff3d --repo_id_depth $D/models/marigold --save_to_psd > $D/logs/$NAME.log 2>&1; RC=\$?; E=\$(date +%s); kill \$POLL; \
  echo \"退出码 \$RC 用时 \$((E-S)) 秒\"; tail -c 400 $D/logs/$NAME.log | tr '\r' '\n' | tail -3" || true
/usr/bin/python3 tools/imggen/client.py mode image > /dev/null          # 切回生图模式
mkdir -p "$T/work/$NAME"; rsync -a "$SEETHROUGH_SSH:$D/out/$NAME/" "$T/work/$NAME/"; scp -q "$SEETHROUGH_SSH:$D/logs/$NAME.vram" "$SEETHROUGH_SSH:$D/logs/$NAME.vram0" "$SEETHROUGH_SSH:$D/logs/$NAME.log" "$T/work/$NAME/" || true
