# pipeline/04_body：身体部件母版（脖子以下 13 层）

把待机母版拆成 13 层身体部件：`legL legR shoeL shoeR collarBack neck skirt top handL handR armIdleL armIdleR topOverArm`。
规则：母版里看得见的像素一律取母版；被挡住的部分用 See-through（本机拆层模型）补，颜色按色块对到母版。
2026-10-07 从原型工程拷过来，只改了路径（原件没动）。目录约定见 `../lib/paths.py`：`--source` 角色来源目录、`--work` 中间产物目录。

## 步骤

| # | 脚本 | 读 | 写 | 可重跑 |
| --- | --- | --- | --- | --- |
| 1 | `bake.py`（第一遍） | `<source>/master/pose_idle_f.png`、`<source>/body/inputs/seethrough/*.png`、`<source>/body/inputs/top_patch.png` | `<source>/body/<名>.png` ×13、`body.json`；`<work>/body/full/<名>.png`（整幅画布版）、`labels.npy`、`head_standin.png` | 是 |
| 2 | `retouch_apply.py neck body/inputs/neck_s11.png` | `<source>/body/inputs/neck_s11.png`（改图结果）、`<source>/body/inputs/in/neck.png` + `boxes.json`（它当时的输入图）、`<source>/body/body.json`、`<work>/body/full/handL.png` `handR.png` | `<work>/body/retouch/neck.png`、`neck.json`、`neck_registered.png` | 是 |
| 3 | `bake.py`（第二遍） | 同第 1 步，另加 `<work>/body/retouch/neck.png`（存在就整层替换脖子） | 同第 1 步——这一遍写出的才是成品 | 是 |
| 4 | `verify.py` | `<source>/body/body.json`、`<名>.png`、`master/pose_idle_f.png`；`<work>/body/full/*.png`、`labels.npy`、`head_standin.png` | `<work>/body/verify.json`、`wip-body-parts-sheet.png` | 是 |

为什么烘两遍：第 2 步要用第 1 步的 `body.json`（脖子中线）和手的整幅图（肤色参照），第 3 步再把并回的脖子换进去。第一遍写进 `<source>/body/` 的是没换脖子的版本，会被第二遍覆盖。

只在要补新的改图时才用的两步（不在重建链上）：

| 脚本 | 做什么 | 可重跑 |
| --- | --- | --- |
| `retouch_inputs.py` | 用 `<work>/body/full/` 的各层拼出涂了品红的输入图 → `<work>/body/in/{neck,armhole,collarback}.png`、`boxes.json` | 是，但见「已知限制」第 1 条 |
| `edit.sh <输出名> <W> <H> <seed> <prompt> <参考图…>` | 把输入图提交给生图服务 → `$PUPPET_WORK/body/gen/<输出名>.png`，prompt 记进同目录 `prompts.log` | **不可重跑** |

`edit.sh` 的服务地址和令牌只从环境变量来：`PUPPET_WORK`（必须）、`IMGGEN_CLIENT`（客户端脚本路径，必须）、`IMGGEN_PYTHON`、`IMGGEN_URL`（可选，给了就先等服务空闲）。
采用一张新的改图结果时：把结果图和它的输入图（`<work>/body/in/<项>.png`、`boxes.json`）一起存进 `<source>/body/inputs/`（输入图放 `inputs/in/`），再跑第 2、3 步。

## 命令（在 puppet/ 目录里；`$O` 是随便一个可写目录）

```
S=characters/beret-girl/source
python3 pipeline/04_body/bake.py --source $S --work $O
python3 pipeline/04_body/retouch_apply.py neck body/inputs/neck_s11.png --source $S --work $O
python3 pipeline/04_body/bake.py --source $S --work $O
python3 pipeline/04_body/verify.py --source $S --work $O
```

这四条会重写 `$S/body/` 下的 13 张图和 `body.json`（内容和现有的一致，见「校验」）。只想核对不想动 source，就先把 source 拷到别处、把 `--source` 指过去。
依赖：numpy、Pillow、opencv-python（要带 SIFT，4.4 以上）。校验时用的是 Python 3.13、OpenCV 4.13.0、numpy 2.4.6、Pillow 12.2.0。

## 不可重跑、产物即来源（必须在 source 里）

| source 里的位置 | 是什么 | 为什么不可重跑 |
| --- | --- | --- |
| `body/inputs/seethrough/` 下 17 张：`legwear` `footwear` `neck` `bottomwear` `topwear` `handwear` `front hair` `back hair` 各一张图 + 一张 `_depth`，`head.png`（没有 depth） | See-through 对「母版只裁脖子以下」拆出的层（1024²） | 模型产物；拆层这一步没有移植，也没有重跑过 |
| `body/inputs/neck_s11.png` | 补脖子的改图结果（8 步草稿，种子 11） | 生图结果 |
| `body/inputs/in/neck.png`、`boxes.json` | 上面那张改图配准用的输入图和裁切框 | 是用当时的各层拼的；之后烘焙脚本加了手腕延伸和领子后片，现在的 `retouch_inputs.py` 拼不回这一张（见「已知限制」第 1 条） |
| `body/inputs/top_patch.png` | 领口补丁：从补脖子那张改图里取的、上衣缺的几块（烘焙时补进 `top` 的 32 px） | 没有留下生成它的脚本 |
| `body/inputs/prompts.log` | 四次改图的 prompt 原文（脚本不读，留作出处） | 记录 |

裁切框、裁给 See-through 的框（`CROP`）、各层 z、画布尺寸等角色相关的常数写在脚本里，没有进配置。

## 已知限制

1. `retouch_inputs.py` 现在拼出的 `neck.png`、`collarback.png` 和当初提交给生图服务的不是同一张（`armhole.png` 逐字节一致）。原因：那两张是烘焙脚本较早的一版拼的，当时还没有手腕延伸和领子后片。把手腕延伸关掉试过，`neck.png` 仍有 236 个像素不同（在左领尖附近）。所以当初的输入图只能当来源存档。
2. `body.json` 里有三处写死的旧字样，为了和现有成品逐字节一致没有改：`"master": "gen/work/pose_idle_f.png"`、每层的 `"full": "full/<名>.png"`（整幅画布版现在在 `<work>/body/full/`）、脖子层 `source` 里的「见 body/work/gen/prompts.log」。脚本本身不读这些字段。
3. `verify.py` 的检查图标题用 macOS 系统字体（Hiragino Sans GB），别的系统要改脚本里的 `F`。
4. `edit.sh` 移植后**没跑**（只过了 `bash -n` 语法检查），没有真的调过生图服务。
5. 四张改图里没命中的三张（`armhole_s21`、`armhole_s22`、`collarback_s31`）没有列进来源，脚本不用。

## 校验（2026-10-07，实跑）

在临时目录里拷一份 source（`cp -RL`），补上上表的输入，删掉 `body/*.png` 和 `body.json`，按 1 → 2 → 3 → 4 跑：

- 重建的 13 张图 + `body.json` 共 14 个文件，和真 source 里的**逐文件 md5 一致**（14 / 14）。
- 中间产物 `<work>/body/full/` 13 张、`retouch/neck.png`、`verify.json` 也和原型工程里留着的逐文件 md5 一致。
- `verify.json` 的读数（和原来的一样）：叠回去剪影交并比 1.0、缺 0 多 0、身体色差中位数 0；露空像素：头上移 30px 17、左移 3、右移 0，两臂外展 15° 0，裙摆左右各摆 5° 各 6。
- 审计钩子（`sys.addaudithook`，记所有 `open` / 列目录）下，全过程读到的文件都在那份 source 拷贝、`--work` 和 `pipeline/` 里，没有读 puppet 目录以外的任何工程文件。
- `retouch_inputs.py` 跑了，能出三张图；其中两张和旧件不一致（已知限制第 1 条）。`edit.sh` 没跑。
