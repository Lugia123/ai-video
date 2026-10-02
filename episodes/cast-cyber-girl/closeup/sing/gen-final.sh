#!/bin/zsh
# #1038 唱歌关键画定稿档（关 Lightning，40 步）。a 直接在旧脸图 closeup/final/neutral.png 上改（脸和画风以它为准，和 5.88 之后一致），手的姿势借草稿；其余嘴型在定稿 a 上只改嘴和眉眼
# 用法：gen-final.sh <a|o|i|e|rest|belt> <seed>   在仓库根目录跑，一次一个请求
cd /Users/lugia/lugia_fc/ai_video
D=episodes/cast-cyber-girl/closeup/sing
STYLE=episodes/cast-cyber-girl/closeup/final/neutral.png
ST="眼睛的大小和画法、刘海、画风、线条都不变；纯白背景。"
KEEP="保持图1的构图、人物、姿势、两只手的位置、头发、服装完全不变，只改嘴型和眉眼："
typeset -A P
P[a]="以图1为准：图1女孩的脸型、两只眼睛（大小、形状、瞳孔、高光和图1一模一样，不要放大、不要改画法）、眉毛的位置、刘海、头发、额头上的护目镜、服装、画风、线条粗细、头的位置和大小全部原样保留。只做两处改动：一、嘴张开在唱「啊」；二、加上两只手，照图2的样子：右手按在胸口，左手在胸前摊开、手掌朝上。纯白背景。"
P[o]="${KEEP}嘴收成圆形在唱「哦」，眉毛舒展上扬，眼睛睁开看着镜头。$ST"
P[i]="${KEEP}嘴咧开、微笑着在唱「衣」，嘴只张开一点，露出一条窄窄的平整上牙，眼睛睁开看着镜头、带着笑意。$ST"
P[e]="${KEEP}嘴半张在唱「诶」，眉毛舒展上扬，眼睛睁开看着镜头，神情开心。$ST"
P[rest]="${KEEP}嘴轻轻闭上、嘴角带一点微笑，眼睛看着镜头。$ST"
P[belt]="${KEEP}闭着眼睛、嘴大大张开，开心地唱一个长音；嘴里只看得到上排一排平整的普通牙齿和舌头，绝对没有尖牙、没有虎牙、没有獠牙；眉毛舒展、高高扬起，神情享受幸福。$ST"
name=$1; seed=$2; refs=($D/final-a.png); [[ $name == a ]] && refs=($STYLE $D/draft/base-2.png)
out=$D/final-draft/$name-$seed.png
perl -e 'alarm 1800; exec @ARGV' /usr/bin/python3 tools/imggen/client.py edit $refs "${P[$name]}" -o $out --seed $seed -W 832 -H 1248 --final -n "尖牙，虎牙，獠牙，Q版，皱眉，生气，眼睛放大，大眼睛，闪亮的大高光" 2>&1 | tail -1
echo "$(date '+%F %T') [final] $name seed=$seed -> $out" >> $D/calls.log
