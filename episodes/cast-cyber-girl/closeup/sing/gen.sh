#!/bin/zsh
# #1038 开头鱼眼里「她对着镜头唱歌」的 2D 关键画（本地生图，不花钱）。用法：gen.sh <base|o|i|e|u|rest|belt> <seed>   在仓库根目录跑，一次一个请求
cd /Users/lugia/lugia_fc/ai_video
D=episodes/cast-cyber-girl/closeup/sing
KEEP="保持图1的构图、人物、姿势、两只手的位置、头发、服装、纯白背景完全不变，只改嘴型和眉眼："
typeset -A P
P[base]="保持图1女孩的脸、发型、额头上的护目镜、粉色外套和正面半身像的构图不变，头的位置和大小不变，纯白背景。让她对着镜头投入地唱歌：嘴张大唱「啊」，眉毛微微上扬，眼睛看着镜头、眼神明亮。右手按在自己胸口，左手在胸前向前摊开、手掌朝上，两只手都在胸口的高度、不挡住脸和脖子，肩膀随着唱歌微微抬起。没有麦克风。日本动画关键画，赛璐璐上色，不是Q版。"
P[o]="${KEEP}嘴收成圆形在唱「哦」，眉毛舒展上扬（不要皱眉），眼睛睁开看着镜头，神情明亮。"
P[i]="${KEEP}嘴咧开、微笑着在唱「衣」，嘴只张开一点，露出一条窄窄的整齐上牙，眼睛睁开看着镜头、带着笑意，眉毛舒展。"
P[e]="${KEEP}嘴半张在唱「诶」，眉毛舒展上扬（不要皱眉），眼睛睁开看着镜头，神情开心。"
P[u]="${KEEP}嘴唇撅成小小的圆在唱「呜」，眉毛舒展、微微扬起，眼睛睁大看着镜头，表情俏皮开心（不是生气，不要皱眉）。"
P[rest]="${KEEP}嘴轻轻闭上、嘴角带一点微笑（唱句之间换气），眼睛看着镜头。"
P[belt]="${KEEP}闭着眼睛、嘴大大张开，开心地唱一个长音，像笑着放声高歌；眉毛舒展、高高扬起，脸上是享受和幸福的表情（不是生气，不是痛苦，不要皱眉，不要皱鼻子，没有尖牙）。"
name=$1; seed=$2; ref=$D/sing-a.png; [[ $name == base ]] && ref=episodes/cast-cyber-girl/closeup/final/neutral.png
out=$D/draft/$name-$seed.png
perl -e 'alarm 1500; exec @ARGV' /usr/bin/python3 tools/imggen/client.py edit $ref "${P[$name]}" -o $out --seed $seed -W 832 -H 1248 2>&1 | tail -1
echo "$(date '+%F %T') $name seed=$seed -> $out" >> $D/calls.log
