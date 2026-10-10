# pipeline/clips：片段入库流水线

从「归位帧 + 动作 + 提示词 / 可选的动作关键图 + 种子 + 档位」到一条量过读数、可以挑的片段，再把挑中的并进片段库。

| 文件 | 作用 |
| --- | --- |
| `clipflow.py` | 主命令：`run`（一条龙）、`pick`（记下留 / 废和原因）、`report`（重抽率和耗时）、`promote`（并进正式片段库） |
| `imggen.py` | 提交生成的客户端（局域网生图服务；只用标准库；地址令牌只从环境变量 `IMGGEN_URL` / `IMGGEN_TOKEN` 读） |
| `review.py` | 把一段序列帧做成给人连续看的 1:1 片子（浅底 / 深底并排） |
| `adopt.py` | 把一段**已经抠好**的单图往返序列帧收进一个片段库（草稿库就是这么建的） |

抠图、校色、写帧不在这里另写：`run` 的 stage 一步直接调 `clips/import_i2v.py`（颜色只对归位帧一张图校；规矩见 `clips/README.md`），蒙版用 `clips/model_matte.py`，读数用 `qa/clips/checks.py` 和 `qa/clips/fit.py`。

## 一条命令

```
export IMGGEN_URL=http://<主机>:<端口> IMGGEN_TOKEN=<令牌>
python3 pipeline/clips/clipflow.py run characters/<角色> wave --mode loop --seed 1 --wait-idle            # 单图往返，草稿档
python3 pipeline/clips/clipflow.py run characters/<角色> shrug --mode pair --seed 2 --wait-idle           # 首尾帧式：去程、回程各一段
python3 pipeline/clips/clipflow.py run characters/<角色> shrug --mode pair --back reverse --seed 2        # 回程用去程倒放
python3 pipeline/clips/clipflow.py run … --tier final --yes-final --matte                                 # 正式档 + 模型蒙版
python3 pipeline/clips/clipflow.py run … --skip-gen                                                       # 不提交生成：raw/ 里已经放好视频，只走后面几步
```

步骤：`home`（摆归位帧）→ `gen`（提交，记耗时）→ `register`（量生成帧和归位帧对不对得上）→ `split`（单图往返在幅度最大处切开 / 回程倒放）→ `matte`（可选）→ `stage`（抠图 + 校色 + 写进暂存库）→ `check`（读数、有效帧、重复帧、动作进度、最短时长）。详见 `clipflow.py` 开头。

产物都在 `characters/<角色>/clips-work/<动作>/<方式>-<档位>-s<种子>/`（不入库）：`raw/` 原始视频、`gen-*.json` 生成记录、`register.json`、`split.json`、`lib/` 只装这一条的暂存片段库、`readings/` 读数和标注图、`take.json` 汇总。

画幅是参数：`gen.json` 的 `canvas / charFrac / foot`，或命令行 `--canvas 832x1104 --char-frac 0.6 --foot 0.8`。宽高要是 16 的倍数。

## 排队规矩（生图服务是共用的）

服务上「视频」和「生图（含抠图 `/cutout`）」是两类模型，请求的类别一变，服务就卸载一类、装另一类，每次 10–20 秒（实测：零散分批发蒙版的 40 分钟里换了 12 次）。所以：

- **同类请求连着发，异类请求等对方队列清空。** 提交视频前，`imggen.py` 默认先等生图那边没有在跑、在排的请求；发蒙版之前先等视频任务都跑完（`imggen.py wait --for image`），然后这一批连着发完——一来一回只换两次模型。
- **一段视频的全部蒙版帧攒成一批一次发完；多段视频连着生成时，先把这一批视频都生成完，再统一出蒙版**，不许「生成一段、抠一段」交替。多条一起做用 `batch`：

```
# jobs.txt：一行一条，写 run 的参数（不带角色目录）
wave --mode loop --seed 1
wave --mode loop --seed 2
shrug --mode pair --seed 1
python3 pipeline/clips/clipflow.py batch characters/<角色> jobs.txt --matte
```

  `batch` 按阶段走：全部生成 → 各自量对位、切段 → 这一批的蒙版一次发完（`matte.json` 里记着发之前、之后服务的换模型次数）→ 各自入暂存库、出读数。单条的 `run --matte` 也会先等视频队列空，但一条一条地跑就是交替，别这么用。
- `--wait-idle [秒]`：比上面更保守——等服务整个空下来、而且连续空了 `--calm` 秒才提交。给别人正在跑的批次让路时用。

## 取回的格式

服务现在返回的图生视频是 H.264 yuv420p 的 mp4：有损，色度只有一半分辨率。`imggen.py` 按服务实际返回的格式存，`clipflow.py` 两种都认：视频（`raw/<段>.mp4 / .mkv / .mov / .webm`，有损无损都行）和逐帧 PNG（压缩包解成 `raw/<段>/NN.png`）。两样都在时用逐帧图。服务那头如果改成返回无损或逐帧图，这里不用改。

## 底色

`gen.json` 的 `keyColor`（命令行 `--key-color` 可盖）一个值管到底：喂给模型的归位帧和动作关键图垫的底、量对位和找切点时的临时抠图、传给 `clips/import_i2v.py` 的键色、读数里查的残留色。

## 角色的生成配置：`characters/<角色>/clips/gen.json`

画幅、人占画幅多高、键色、归位帧来源（`restSource`）、提示词的公共尾巴（`promptTail`）和反向提示词、各动作的提示词（`loop` / `go` / `back`）和动作关键图（`endKey`，首尾帧式才要）。

## 挑选记录：`characters/<角色>/clips/picks.json`

每跑完一条自动登记为「待定」，带事实（种子、档位、提示词原文、生成耗时、排队）、读数摘要和提示（读数上像重复帧 / 挡脸 / 没归位 / 切人 / 抠不干净的地方）。人看完标注图后：

```
python3 pipeline/clips/clipflow.py pick characters/<角色> wave loop-draft-s2 reject --reason 挡脸,表情 --note "第 11 帧手挡住发卡"
python3 pipeline/clips/clipflow.py pick characters/<角色> wave loop-draft-s1 keep
python3 pipeline/clips/clipflow.py report characters/<角色>
```

原因从固定的表里选（轨迹 / 挡脸 / 表情 / 重复帧 / 走样 / 切人 / 没归位 / 抠图 / 手 / 其他），废掉的必须写原因——这是以后估成本和重抽率的依据。

## 放行前必须连续看

抠图、校色的毛病（裂缝、闪边、逐帧跳的接缝）在读数和抽帧图里看不出来。规矩（2026-10-08，一次「读数全好、连起来看人裂开了」之后定的）：**任何抠图 / 校色的改动，放行前必须渲一段人物 1:1 的连续片，并且有人看过。**

- `run` / `batch` 每条都会出 `readings/review-in.mp4`、`review-out.mp4`（人物不缩放，左浅底右深底，原速两遍 + 半速一遍，左上角帧号）。
- `pick … keep` 必须带 `--watched <谁看的>`，不带不让留。
- 对已有的库或帧目录：`python3 pipeline/clips/review.py <片段库目录> [--clip 片段名] --crop`（不给 `--clip` 就每段各出一个，放在 `<库>/review/`）。

## 并进片段库

`promote` 只收标成「留」的那一条，而且**画幅和归位帧必须和库里的一致**（一个库只有一个画幅、一张归位帧）；之后自动跑 sync、贴片烘焙、挂点烘焙。

## 一段做完去和回的片段怎么播

单图往返中间没有保持帧。两种都登记（`adopt.py`）：`<动作>` 整段当一次性动作，播完直接回归位；`<动作>_hold` 在幅度最大的那一帧切开，前半当去程、那一帧当保持帧、后半当回程。幅度最大的那一帧 = 轮廓离归位帧最远的那段平台的正中，可以用 `--apex` 指定。

## 现在的状态（2026-10-08）

- 后半段（register → check）用小样的现成视频离线跑通了两种方式各一条。
- `batch` 用现成视频（`--skip-gen`、不带蒙版）离线跑通了两条。
- `gen` 这一步的草稿档实跑、`--matte`（含排队等待和换模型次数的记录）、取回逐帧 PNG 的那条路、`promote` 到正式库：还没实跑过。
- register 只量不改：生成帧整体偏了的话只标出来，不做重采样纠正。
- 讲解员（`host-clips/`）现在只认「去程 → 保持 → 回程」的动作，一次性动作（`oneshot`）还没接。
