# 调研笔记：用 Opus 5.5 写代码做动画（2026-09-28）

Opus 5.5 于 2026-09-22 发布，一周内出现一波"让 Claude 写动画代码 → 渲染成视频"的热潮。

## 核心机制

不是视频生成模型，是 **Claude 写动画代码**（HTML / CSS / SVG / Canvas / WebGL，或 Remotion、Manim、p5.js 等框架），
再用无头浏览器**逐帧渲染**、ffmpeg 合成 MP4。好处：

- 结果确定、可复现：不满意就改代码改参数，不用重新抽卡
- 不需要视频生成额度，Claude Code 本地就能做
- 迭代成本极低——"动态设计的瓶颈从来不是画，而是能看几遍、改几次主意"

## 值得参考的案例

| 案例 | 要点 |
| --- | --- |
| @leonabboud 9/26（71K 浏览，收藏 > 点赞） | 一句话 prompt：`make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out.` 结构 = 时长 + 类型 + 展示什么 + **身份框架** + go all out |
| @achxvi 9/28 | 创始人给自己产品（pocketsflow）做发布动画，45 分钟 |
| @1littlecoder | `...be as creative and dynamic as possible. Avoid the frames and texts on the corners which are typical ai made giveaways!` —— 明确点名"AI 味"元素让它避开 |
| Rory Flynn 的 Negroni 讲解片 | 给一张参考图，"30 seconds, using javascript or html (w/e you think will produce the best)"——**让模型自己选媒介**。产出了步骤卡片、双单位、进度条等讲解片常用元素 |
| Charlie Hills 三步法 | ① 一次只做一种运动（如会变形的图表）② 给参考并**给每个状态命名** ③ 要 HTML+SVG，一轮一轮修 |
| 狭义相对论剪纸风讲解（46 秒）、Manim 微积分课 | 科普类可行；教学片是所有类别里平均时长最长的（>100 秒） |

## 从 HN 讨论与合集里提炼的经验（对科普片最相关）

1. **节奏太快是头号问题**：文字还没读完就切走。旁白驱动时间轴，而不是动画驱动。
2. **默认输出很"香草"**：一开始就定视觉风格，并点名要避开的 AI 味元素（角落小字、边框、霓虹渐变、满屏粒子）。
3. **长片别一把梭**：风格 → 讲稿 → 分镜（可以是 HTML 静帧）→ 分段动画 → 合成。一句话 prompt 适合 10–30 秒的片头/预告，不适合 3 分钟的课。
4. **先出低分辨率样片**（前 5 秒 / 抽帧 contact sheet），检查文字溢出、遮挡、速度，再全量渲染。
5. **事实核对**：教学片先列事实主张和来源，再写讲稿；未核实的公式/史实不能当定论。
6. **确定性渲染**：动画必须是时间 t 的纯函数，渲染时由渲染器逐帧推进，不能依赖真实时钟。
7. 成本参考：HN 上有人报一条讲解片约 $3–4 的 token。

## 可借鉴的开源项目

- [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)：Canvas/WebGL 逐帧渲染 + 共享时间轴 + 本地 TTS，`films/<name>/` 一片一目录
- ClaudeAnimationBase：p5.js 起手 + 分镜 + contact sheet
- Remotion 官方 skill：`npx skills add remotion-dev/skills`（≥4 人公司需商业授权）

## 来源

- https://x.com/leonabboud/status/2103576084499358051
- https://x.com/achxvi/status/2104014659615392078
- https://x.com/1littlecoder/status/2103587706999914649
- https://x.com/charliejhills/status/2103893708550914076
- https://x.com/0xMovez/article/2104216919033192746
- https://sloptvnews.com/opus-5-5-negroni-explainer-html-motion-graphics-iteration/
- https://news.ycombinator.com/item?id=49836374
- https://github.com/athemeroy/awesome-opus-5-5-videos （含中文 prompt playbook：docs/prompt-playbook.zh-CN.md）
- https://github.com/opusvideo/awesome-claude-video
- https://github.com/lemomo-ai/lemo-opuscar
