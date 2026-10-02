# 副歌 1（22.1–38.4 s）v4 新做

用户 2026-10-01：v4-01（0–22.1）定稿方向后，要「一直做到 v4-03b 这段我们看看」——也就是 0–58.4 连起来看。0–22.1 = v4-01 新版，38.4–58.4 = 现有 `v4-03.html`（跑酷 v4-03a + Sydney 漫画 v4-03b，用户都认可过）。**中间 22.1–38.4 副歌 1 还没有 v4 版本**（`out/c1.mp4` 是 9-29 的旧风格，不用）。你来做这段。

## 先看
- `out/v4-01-final-half.mp4`（0–22.6，低分辨率；9.52–13.16 那句会换成 `out/v4-01-l4-3.mp4` 的「夜空的网」）——尤其结尾：盒子合严、全黑、只剩四只柠黄的眼和 ALIVE。
- `out/v4-03.mp4`——38.4 起的跑酷：黑夜、霓虹线、亮窗楼块、粉月、霓虹招牌字。你的结尾要把人送进这里。
- 用户反馈汇总：项目记忆里的 feedback-mv-visuals（要点：她每次出镜要有动作动机；多人只用有意义的队形（整列伴舞 / 镜面阵列），不要叠成圆圈花朵；文字别当主角、画面要天马行空；2D 和 3D 的她不同屏；3D 做细腻表演太假，3D 只做舞蹈、跑酷、远景、特效；脸用 2D 关键画）。
- `STORYBOARD-v4.md` 的「副歌 1」一节可以参考意象（P(DOOM) 翻牌、FOOM、Chinese room、shoggoth 面具、shinigami 护目镜 HUD），**但要放进现在这个世界**，不必照搬。

## 歌词（逐词见 data/lyrics.json）
| 时间 | 歌词 |
|---|---|
| 22.76–24.32 | I'm upping my P(doom) |
| 24.32–26.32 | 'cause the future goes FOOM |
| 26.32–27.94 | Trapped in the Chinese room, |
| 27.94–29.91 | with a bag of shrooms |
| 29.91–33.40 | See through the shoggoth's lies, |
| 33.40–37.32 | with your shinigami eyes |
| 37.32–38.62 | （过门，接 38.62 We had a stable training run） |

## 要求
- **副歌 = 高能量**：这是第一次副歌爆发，22.1 从全黑盒子里炸开。「Trapped in the Chinese room」正好接上她被关在盒子里——盒子可以就是那间 Chinese room。
- **P(DOOM) 母题要巨大**（全片各副歌一致的母题，比如巨大的 P(DOOM) 霓虹字 / 数字翻牌），不能是角落小字。
- 每句都要演出意思（不是一词一图的图解），画面是这个世界里的奇观；舞蹈用 3D 女主 + Mixamo 动捕（`../cast-cyber-girl/3d/anim/mixamo`），近景表情用 2D 关键画。
- 歌词 = 霓虹招牌，字高 ≥ 画高 5%，不压她。
- 结尾 37.3–38.4 自然送进跑酷开头（看 v4-03 第一帧是什么样）。
- 生图优先用本地服务 `tools/imggen/client.py`（不花钱，见 README）；要用千问云 API 先报总管。

## 流程
1. **先写 `fresh/c1-v4/plan.md`**：一句话 + 逐句分镜表（画面 / 她在做什么为什么 / 镜头 / 招牌）+ 4 张关键帧草图拼成 `plan-sheet.png`。写完在群里报，**等总管回话再做第 2 步**。
2. 实现 `shots/c1-v4.js` + `c1-v4.html`（offset 22.1，duration 16.3），低分辨率渲 `out/c1-v4-half.mp4` + 每 0.5 s sheet，自查（脚滑、穿模、招牌被挡、空画面、≥4 s 不动）后报。
不改 v4-01 / v4-03 的文件，不 commit。
