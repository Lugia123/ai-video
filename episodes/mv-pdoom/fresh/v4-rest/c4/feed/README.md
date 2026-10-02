# feed：尾声手机推送流里的三条短片段（#1052）

手机屏里「上划刷到下一个还是她」用的。从已渲好的成片里截的，各 1 s、12 fps、竖屏 360×640：
- `parkour/`：out/v4-03-half.mp4 的 1.4–2.4 s（跑酷）。`ffmpeg -ss 1.4 -t 1 -i out/v4-03-half.mp4 -vf "fps=12,crop=304:540:470:0,scale=360:640" -q:v 3 parkour/f-%02d.jpg`
- `sydney/`：out/v4-03-half.mp4 的 16.1–17.1 s（Sydney 手机里的她）。同上，`-ss 16.1`、`crop=304:540:328:0`
- `room/`：out/c1-v4.mp4（1920×1080）的 4.85–5.85 s（副歌 1 Chinese room：整栋楼每扇窗里都是她在跳同一支舞）。`ffmpeg -ss 4.85 -t 1 -i out/c1-v4.mp4 -vf "fps=12,crop=420:747:750:300,scale=360:640" -q:v 3 room/f-%02d.jpg`

镜头按歌曲时间取帧（正放再倒放），不播放视频。那几段成片重渲、画面变了的话照上面的命令重截。
回形针海那条（clips/）用户否了，已删。
