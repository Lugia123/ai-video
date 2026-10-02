#!/bin/bash
# 副歌 4 + 尾声的图生视频素材（#1052）。在仓库根目录跑：bash episodes/mv-pdoom/fresh/v4-rest/c4/i2v/gen.sh <步骤>
# 本地 imggen（Wan 2.2，Apache）；视频一次只交一个。首尾帧都是设定图或 /edit 喂设定图出的。
D=episodes/mv-pdoom/fresh/v4-rest/c4/i2v; C="/usr/bin/python3 tools/imggen/client.py"; R=episodes/cast-cyber-girl
P_SHOW="一个日系动漫风格的女孩，正面半身，白色背景。她刚唱完最后一句，慢慢把按在胸口的手和摊开的手都放下去、垂到画面外，嘴慢慢合上，抬起眼睛平静地看着镜头，表情有一点迟疑。头发轻轻晃动。动作缓慢连贯，镜头固定不动。"
P_TURN="一个日系动漫风格的女孩，半身，白色背景。她一开始背对镜头，然后向右转过身来面向镜头，棕色长直发随着转身甩开再落下，转过来之后看着镜头浅浅一笑。额头上的灰色护目镜和青色方块耳环保持不变。动作流畅，镜头固定不动。"
P_WINK="一个日系动漫风格的女孩，正面半身，白色背景。她看着镜头浅笑，然后俏皮地闭上一只眼睛眨了一下。头基本不动，头发轻轻晃动。镜头固定不动。"
case "$1" in
  back)   # 终帧转身的首帧：背面半身（turnaround 的背面全身 + 正面半身近景做参考）
    $C edit $R/turnaround/final/back.png $R/closeup/final/neutral.png "画图1这个角色的背面半身特写：镜头在她正后方，只看到后脑勺和垂下来的棕色长直发、护目镜的黑色头带绕在脑后、粉色短夹克的肩和背（黄色和薄荷色条纹）。景别和图2一样（头顶到胸口，人在画面正中），纯白背景，动漫画风和图2一致。" -W 832 -H 1248 --seed ${2:-31} -o $D/gen/back-bust-s${2:-31}.png ;;
  show)   $C img2video $R/closeup/sing/sing-a.png "$P_SHOW" --end $R/closeup/final/neutral.png --frames 61 --res 480p --seed ${2:-1} ${3:+--final} -o $D/gen/show-${3:-draft}-s${2:-1}.mp4 ;;
  turn)   $C img2video $D/gen/back-bust.png "$P_TURN" --end $R/closeup/final/neutral.png --frames 33 --res 480p --seed ${2:-1} ${3:+--final} -o $D/gen/turn-${3:-draft}-s${2:-1}.mp4 ;;
  wink)   $C img2video $R/closeup/final/neutral.png "$P_WINK" --end $R/closeup/final/wink.png --frames 17 --res 480p --seed ${2:-1} ${3:+--final} -o $D/gen/wink-${3:-draft}-s${2:-1}.mp4 ;;
esac
