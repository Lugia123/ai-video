# 把《移植不是翻译》的讲解员换成纸片女孩（先 ep01、ep02）

用户 2026-10-01 认可切图版纸片女孩（`assets/characters/girl-q/sheet.png`，代码 `assets/lib/paper-girl.js`），要求 1–8 集全部替换，**先做 ep01、ep02 给用户看**。

## 每集要做的
1. **备份**：动手前把 `out/final.mp4` 复制成 `out/final-boxbuddy.mp4`；封面三张 `cover/cover-{4x3,16x9,9x16}.png` 复制成 `cover/_boxbuddy/` 下同名文件。别覆盖已有备份。
2. **替换**：`index.html` 和 `cover/cover.html` 里所有 `createBuddy` 从 `box-buddy.js` 改成 `paper-girl.js`（调用方式相同）。
3. **逐镜头检查和微调**（这是重点，不是改一行 import 就完）：
   - 她比方块小人高（s=1 约 240px），**头顶有没有顶到/压住字幕、窗口、纸条、标题**；必要时调这个镜头里她的 `s`（缩放）或站位，或挪旁边元素。
   - 手和表情对不对得上画面：point 是不是指向了该指的东西（看 at 坐标），knife 镜头刀是不是对着该切的地方，look 的朝向，question/startle 等表情时机是不是还合理。
   - 走路的方向和朝向一致（往左走必须镜像），走路速度和换帧别像滑步。
   - 原来方块小人有些动作是靠身体变形演的（droop 压扁、hop），换成切图后看还读不读得出；读不出就换更合适的 act 或加一点位移。
   - 项目 CLAUDE.md 规矩照旧：文字不压主体、一次只看一件事、≥4 s 几乎不动的镜头要补动作。
4. **自查**：先渲低分辨率或抽帧（每 0.5 s 一帧的 contact sheet），**放大看每个有她的镜头**，写一份检查表（时间 | 镜头 | 有无遮挡/顶字 | 改了什么）。
5. **全量渲染** `out/final.mp4`（带旁白和配乐，流程同以前：`tools/render/`），时长和旁白对齐不变；封面三种比例重导（`node tools/cover/cover.mjs episodes/<集>`，会自动压到 ≤2MB）。
6. 不改旁白、不改 timings、不 commit、不对外发布。

## 讲解员本身的两处小修（由做 ep01 的 worker 先做，做完再开 ep01）
- **knife 那张的刀像锯子**（带锯齿）：重新生成成一把**美工刀 / 纸刀**（直刃、斜刀尖、带刻度的推刃柄），手和姿势不变。
- **走路 2–4 帧差别太小，像小碎步**：重做成步幅明显的走路循环（迈步 / 交叉 / 另一腿迈步 / 交叉），3/4 朝右。
- 生图**优先用本地服务** `tools/imggen/client.py`（`edit`，参考 s5 和现有姿势图，见 `tools/imggen/README.md`；不花钱）；效果不行再用千问云 API，千问上限 10 张。
- 改完重导 `sheet.png`、`motion.mp4`，在群里说一声，做 ep02 的 worker 也要用新版。

## 交付
每集做完：`task_progress` + 群 ai-video 报：final.mp4 路径、检查表路径、contact sheet 路径、改了哪些镜头、封面路径。
