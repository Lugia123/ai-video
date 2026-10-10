# host-clips：片段式讲解员

整个人是预先做好的透明序列帧（归位帧 ⇄ 动作保持帧，中间播片段），对外接口照着 `host/` 的 `createHost`。
片段库、播放器、贴片在 `clips/` 和 `characters/<角色>/clips/`（见 `clips/README.md`）；这里只做「接成讲解员」。

| 文件 | 作用 |
| --- | --- |
| `index.js` | `createClipHost(...)`：导演脚本 → 纯函数时间线 → 画人；时间表校验；挂点；三个叠加层 |
| `emotes.js` | `attachEmotes(host, script, { W, H, dpr })`：把漫符 / 表情预设接上（用法同 `host/emotes.js`） |
| `bake_points.py` | 给每张静帧算漫符挂点、给每段片段量头的逐帧位移 → `characters/<角色>/clips/points.json` |

演示页：`clips/demo-host.html`（走本地服务打开）。渲染：`node tools/render.mjs clips --page demo-host.html`。

## 导演脚本怎么写

和拆件讲解员一样：

```js
import { createClipHost } from '../host-clips/index.js';
import { attachEmotes } from '../host-clips/emotes.js';
const host = await createClipHost({ mount, timings, W, H, ground, size, pack });
const drawHost = attachEmotes(host, t => ({
  x: 1400,
  pose: t >= 6.5 && t < 12.9 ? { think: 1 } : undefined,       // 6.5s 起播去程，12.9s 起播回程
  emote: { name: 'question', t0: 8.2, t1: 11.8 },
}), { W, H });
host.check();        // 时间表不合格在这里就抛，别等到渲染一半
// 每帧：drawHost(t)
```

- `pose: { 动作名: 1 }` 的那段时间 = 去程 + 保持；pose 结束那一刻起播回程。所以人**在动**的是 `[pose 开始, +去程时长)` 和 `[pose 结束, +回程时长)`。`host.seconds('think')` 给这两个时长，`host.moves()` 给整条时间线上所有在动的时间段。
- 也可以不写 pose，直接 `host.act([{ action, t0, t1 }])`。
- 认的 state：`x scale hop lean flip visible talk blink pose emote`。不认：`look attend headYaw nod tilt expr face eyes mouth brows`（头是画死的）。
- 说话：`timings` 里有句子的时间就自动贴口型（每个字一次开合，和拆件讲解员同一套 `speechTrack`）；眨眼用片段库的眨眼贴片，默认开。

## 两种动作，脚本怎么写

- **去程 → 保持 → 回程**（片段库里有停顿帧 `pose` 和回程 `out`）：`pose: { 名: 1 }` 那段 = 去程 + 保持，pose 结束那一刻起播回程。
- **一次性**（片段从归位到归位，一段做完去和回：挥手、转一圈）：pose 开始那一刻起整段播完，直接回到归位；pose 那段写多长不管。
- 同一个动作两种都有（库里 `<名>` 是一次性、`<名>_hold` 是在幅度最大处切开、带停顿帧的）：脚本只写 `<名>`。pose 那段 ≥ 去程 + 0.3 秒（`fit.holdMin`）就用带停顿帧的那一种，不够长就一次播完。要强制：pose 写 `<名>_hold`，或 `state.move.oneshot = true / false`。
- 片段库的动作上写 `host: false` = 讲解员不用这一种（停顿帧的贴片烘不干净时用）。

口型、眨眼、漫符的脸只在静帧（归位、停顿帧）上出，人在动的时候收起；头在片段里转走了（转一圈）的那几段，播放中漫符整个不出。

## 换一个片段库 / 换了静帧

`createClipHost({ pack, clips: <片段库目录的 URL> })`。库要先「穿戴整齐」——一条命令，草稿换成正式档之后重跑：

```
python3 pipeline/clips/dress.py characters/<角色> --lib clips-draft2      # sync → 烘贴片 → 重量动作进度 → 烘挂点 → sync
```

演示页 `clips/demo-host.html?lib=draft2`（或 `?lib=<目录名>`）；`&one=1` 人物按原像素画（审看用），`&dark=1` 深色底。

## 动作占多少秒

由导演脚本定，不由片段定。播放端按时长挑帧（`clips/player.js` 的 `sequence()`）：比自然时长短就跳帧，长就每帧停久一点，首帧末帧一定取到。

- 写明：`host.act([{ action: 'think', t0, t1, in: 0.5, out: 0.4 }])`，或在 pose 开始那一刻的 state 里带 `move: { in, out, ease }`。
- 不写（默认，`fit.mode = 'auto'`）：讲解员按停顿自己定。目标是去程、回程各 **0.8 秒**（片段库 `clips.json` 的 `moveSeconds`，可被单段片段的 `moveSeconds`、`fit.target`、脚本写的时长盖掉；片段本身比它短就不拉长），并且要在下一句开口前 `fit.settle`（0.3）秒做完。空够就按 0.8 秒播，不够才缩；缩到 0.5 秒以下 `host.check()` 给一条提醒（不报错），写明这里的停顿加到多少就能按 0.8 秒播。
- **写讲稿时：用片段动作的地方，动作前留出 ≥ 0.8 + 0.3 = 1.1 秒的空最合适**（段间的 1.2 秒正好；句间 0.6 秒只放得下 0.3 秒的动作）。一段做完去和回的单图往返片段默认约 1.6 秒。
- 空连这段片段的最短可接受时长（片段数据的 `minSeconds`，现在两段都是 0.3 秒 = 5 格）都放不下：报错；或者 `fit: { short: 'cut' }` 改成硬切 + 压扁回弹。
- `fit: { mode: 'natural' }` = 一律自然时长（不够就按重叠报错）。`fit.ease`：`linear`（默认）/ `inout` / `snap`。
- `host.moves()` 里每段带 `seconds / natural / min / unique / cut`，演示页的时间条下面打的就是它。

读数工具：`python3 qa/clips/fit.py characters/<角色>/clips <片段名>`（各时长下播哪些帧、几个不同帧、最大一步），`--write-arc --write-min 0.3` 把动作进度和最短时长写进 clips.json。

## 校验（`host.check()`，`strict` 默认开，违反就抛错）

| 查什么 | 级别 |
| --- | --- |
| 人在动（去程 / 回程）的时间段和任何一句旁白重叠 | 不合格 |
| pose 段比去程片段还短（保持时间为负） | 不合格 |
| 上一个动作还没归位，下一个就开始 | 不合格 |
| 片段库里没有的动作名 | 不合格 |
| 脚本用了不认的字段 | 提醒 |

报错会写出是哪个动作的哪一段、压在第几句上、要挪多少秒。`guard: { after, before }` 可以要求动作离上一句结束 / 下一句开始再多留几秒（默认 0 = 只要不重叠；项目的节奏规矩是 1.0 / 0.3，由导演脚本自己留）。

## 漫符和表情：两个独立的通道

- **漫符**（`emote: { name, t0, t1 }`）只出符号，不换脸。问号、感叹号、汗滴、青筋、灯泡、爱心在头周围；脸红、黑线贴在脸上，也算漫符。
- **表情**（`face: '<表情名>'`）只换脸，不出符号：同画风的「表情脸」贴片（片段库每张静帧的 `patches.face.<表情名>`，眼眉、嘴、眉三块）。库里烘过哪些看 `host.faces`（现在：squeeze > <、flat - -、surprise、happy、love、angry、awkward、doubt）。
- 要组合就两个都写：`emote: 问号 + face: 'flat'`。任意搭配；love（爱心眼）是整张脸的表情，换了别的表情就不是爱心眼了。
- **常用组合**是角色数据里一份可选的快捷写法：片段库 `points.manual.json` 的 `emote.combos = { 名: { emote, face, zh } }`（可改可删），导演脚本写 `combo: { name, t0, t1 }`，展开成那一对；脚本同时写了 `emote` / `face` 的各听脚本的。贝雷帽女孩现在配了 8 个：puzzled 疑惑（问号 + doubt）、shocked 吃惊、smitten 心动、idea 想到了、embarrassed 尴尬、furious 生气、gloomy 无语（黑线 + flat）、shy 害羞（脸红 + awkward）。

| 东西 | 静帧（归位、停顿帧） | 片段播放中（人在动） |
| --- | --- | --- |
| 头周围的符号、黑线的竖线（top 层）、集中线（back 层） | 出，挂点 = 这张静帧的点 | 出，跟着头走；头转走了追不上的片段（转一圈）不出 |
| 脸红、黑线的阴影（face 层） | 出：叠在当前的脸（原画或表情脸）之上、刘海之下。只有自带浓腮红的表情（love）上不再叠脸红 | 不出：进片段前收掉，停住后再弹出 |
| 表情脸 | 换上；说话时念字的那一刻贴口型，字与字之间露出这张表情自己的嘴；口型里的 smile 只配开心类表情（happy、love，`smileFaces` 可改），别的表情遇到它换成 small；优先于眨眼。硬换，没有渐变 | 不换：露回片段里画好的脸，停住再换上 |

贴脸层留在哪：「脸前、头发后」= 这张静帧贴了干净脸之后的肤色范围（含眼睛、嘴的位置），讲解员加载时算一次。

**停多久**：导演脚本自己写 `t0 / t1`。建议值在 `host-clips/emotes.js` 的 `EMOTE_STAY`：状态型的（脸红、黑线、汗滴）4 秒，一下子的反应 3 秒；`emoteSpan(name, t0)` 按这张表给出 `{ name, t0, t1 }`。弹出 0.22 秒，收起 0.5 秒。

漫符出在哪一侧：角色数据 `emote.side`（-1 = 画面左）和个别符号的 `emote.sides`。漫符库里矢量画的替换眼 / 嘴 / 眉不用（用户嫌和原画风格差异大）；预设建议的歪头、低头不做；top 层不挖手。

## 动作进行中也贴口型、表情、脸上的漫符（片段有逐帧头部跟踪时）

片段库的 `clips.json` 里有 `headTracks`（`clips/track_head.py` 量的：每一帧「归位帧 → 这一帧」的相似变换、遮罩、权重 w）时：

- 这一帧可贴（w > 0）：口型、眨眼、表情脸在动作中保持（播放器按逐帧对位画归位帧那份贴片）；脸红、黑线的阴影也保持（讲解员把贴脸层的范围按同一个变换搬过去、按那一帧的遮罩裁、乘 w）。不可贴的帧（转圈）照旧：收起，停住再出。
- 挂点：动作中 = 归位帧的点按那一帧的变换搬过去（含旋转），头周围的符号跟头更准。没有 `headTracks` 的库退回 `points.json` 里量的逐帧平移。
- 校验：片段**全程**可贴时允许边动边说，不再报重叠；不可贴的片段仍然报。自动排时长照旧优先把动作塞进停顿里，停顿放不下最短时长时：可贴的片段不报错、按默认时长边说边做，不可贴的才报错。`host.moves()` 每段带 `pasteable`。
- 一条命令里的位置：`dress.py` 在烘贴片之后跑头部跟踪。第一次要说明量哪些、哪些整段不可贴：`--track wave_loop,think_loop,shrug_loop --no-paste turn_loop,spin_loop`，记在 `<库>/dress.json`，以后不带参数照它跑。

## 已知限制

- 口型贴片是讲解员自己贴的（player 的视图现在只能按固定节拍循环口型，不能指定「这一刻用哪个口型」）；等 player 支持后改成传给它。
- 片段播放中手的挂点只是首尾姿势之间按进度连线，不是真的手的位置。
- 肤色遮罩是按颜色阈值算的，换角色要看一眼；手贴在脸上的姿势里手也算皮肤，脸红可能蹭到手上。
- 跑过的动作：正式库的 think；第一批草稿库的 think / wave / shrug / turn / spin（都没有人连续看过成片）。
- 新舞台那个库手的挂点还没量（漫符里用到手的没有）。
