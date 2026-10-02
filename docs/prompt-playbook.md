# Prompt 手册

## 短片（10–30 秒：片头、预告、单个概念）——一句话就够

结构：**时长 + 类型 + 要展示什么 + 身份框架 + 反 AI 味约束 + go all out**

```
make a dynamic 20-second motion graphics video that explains <概念>,
like it's the cold open of a science channel that cares about craft.
avoid corner labels, frames, and everything-pops-in-at-once — the usual AI giveaways.
go all out.
```

身份框架（"像简历里的 showreel"、"像在乎工艺的公司的发布片"）给了模型动机，比罗列画面有效。
先让它一次成型，再针对具体一段改；别一上来就给分镜。

## 长片（1–5 分钟的一集课）——分步走

一句话 prompt 撑不住长片，按这个顺序，每步各自确认：

1. **风格**：给 1–2 张参考图或描述，让它出 3 张 HTML 静帧风格稿，选一个。
2. **事实**：`列出本集要讲的每一条事实主张和可靠来源，标出你不确定的。`
3. **讲稿**：`按 script.md 格式写旁白，每段 1–3 句，给每段写画面说明。`
4. **分镜**：`把每段画成一张静帧，拼成 contact sheet。`
5. **动画**：`按 CLAUDE.md 的 __video 约定实现 index.html，时间轴读 timings.json。`
6. **样片 → 修 → 全量渲染**。

## 修改时的说法

- 指明段落和时间：`seg-03（0:42–0:55）公式出现太快，停留延长到 3 秒，箭头改成逐段画出。`
- 给每个状态命名：`状态 A 空坐标轴 → 状态 B 曲线画出 → 状态 C 切线滑动`。
- 一次只改一种运动。
