# pipeline/03_face：脸底、眼睛各层、口型

从角色来源目录里的母版和配准好的改图，出 `source/face/` 里的 22 张 png 和 `face.json`、`eyes.json`。
全部是程序处理，不调生图服务。2026-10-07 从原型工程拷贝过来并改了路径，原件没有动。

## 约定

- 脚本里不写任何具体工程的路径，目录由命令行给（`../lib/paths.py`）：
  `--source` 角色来源目录（`characters/<角色>/source`），成品写在它的 `face/` 里；`--work` 中间产物目录，随便一个可写目录。
  也可以用环境变量 `PUPPET_SOURCE`、`PUPPET_WORK`。
- 脚本里引的是 `from paths import S as SRC, W as WK`：原脚本里 `S`、`W` 已经是别的变量名（画布边长 1408、图宽），所以换了个名字引，算法行没动。
- 坐标：rig 空间 = head_master 像素 + [390, 136]；部件 png 和 head_master 1:1。
- 除路径以外，和原件不一样的地方只有四处，都不改变产物：
  1. `split_head.py`：原件用到的公用函数里，`load / bg_mask / rgba / bleed / navy_lines` 引 `../lib/poses_lib.py` 的（函数体相同），`save / labdiff / feather / crop_save / defringe` 那边没有，原样拷在脚本里。
  2. `split_head.py`：换色那一步原件的条件是「草稿图在 **并且** 40 步定稿原图在」，定稿原图不在 source 里，现在只看草稿图在不在（`master/derived/<名字>_draft.png` 只在配准用了定稿版时才有）。
  3. `build_eyes.py` 出的上睫毛和 `eyes.json` 先写到 `<work>/face/eyes_stage1/`，`build_lids.py` 从那里读、成品写进 source。原件是就地改写睫毛图，重跑一遍会在削过的图上再削一次。
  4. `build_face.py` 出的三张旧张嘴口型写到 `<work>/face/mouth_old/`（成品由 `mouth_build.py` 重画），`mouth_build.py` 从那里读画布尺寸；原件里「第一次运行时把旧图归档」那几行因此去掉了。

## 步骤

按顺序跑。「S/」= `--source`，「W/」= `--work`。

| # | 脚本 | 输入 | 产物 |
| --- | --- | --- | --- |
| 0 | `split_head.py` 头部拆件 | S/master/head_master.png；S/master/derived/ 的 head_nohat.png、head_bald.png、head_nohat_draft.png、head_bald_draft.png、mouth_small.png、mouth_big.png、mouth_smile.png | W/parts/ 的 25 张 png（脸底、17 个五官部件、帽子、呆毛、四层头发、脖子）、head_parts.json、dbg/ |
| 1 | `build_face.py` 脸底重建 + 眉鼻嘴去边 | W/parts/ 的 face.png 和 17 个五官部件；S/head/rig.json | S/face/ 的 face.png、face_noblush.png、blush.png、browL.png、browR.png、nose.png、mouth_closed.png、face.json；W/face/mouth_old/ 的三张旧张嘴口型；W/face/_dbg_masks.npy |
| 2 | `build_eyes.py` 眼睛各层 | W/parts/ 的 iris / eyeWhite / eyeHl / lash / eyeLow 各 L、R；S/head/rig.json | S/face/ 的 irisL/R、eyeWhiteL/R、eyeHlL/R、eyeLowL/R.png；W/face/eyes_stage1/ 的 lashL/R.png、eyes.json |
| 3 | `build_lids.py` 闭眼线 + 睫毛下缘 | W/face/eyes_stage1/ 的 lashL/R.png、eyes.json；S/face/eyeLowL/R.png；S/head/rig.json | S/face/ 的 lashL/R.png、lidL/R.png、eyes.json |
| 4 | `mouth_build.py` 三个张嘴口型（矢量画） | S/face/face.json；W/face/mouth_old/ 三张图的画布尺寸 | S/face/ 的 mouth_small.png、mouth_big.png、mouth_smile.png |

校验（只读 source，产物全在 W/）：

| 脚本 | 要先跑过 | 产物 |
| --- | --- | --- |
| `verify_face.py` | 0–4 | W/out/wip-face-parts-sheet.png、W/face/verify.json |
| `brow_check.py` | `verify_face.py` | W/out/wip-face-base-check.png |
| `verify_eyes.py` | 0–3 | W/out/wip-eye-parts-check.png、W/face/verify_eyes.json |
| `closed_check.py` | 0–3 | W/out/wip-eye-closed-check.png |
| `mouth_compare.mjs` + `mouth_compare.html` | 1、4；另要 `--pack` 角色数据包 | W/face/mouth_compare/_cmp-before.png、_cmp-after.png |
| `mouth_compare.py` | `mouth_compare.mjs` | W/out/mouth-compare-2x.png |
| `verify_rebuild.py` | 无（自己从头跑 0–4） | 在 W/rebuild/ 里重建一遍，和现有 S/face/ 逐文件比 md5；退出码 0 = 全部一致 |

校验脚本里说的「旧部件」是 W/parts/ 里拆件直接得到的，「新部件」是 S/face/ 里的成品。

## 运行

在 `puppet/` 目录里（`$O` 是随便一个输出目录）：

```
S=characters/beret-girl/source
python3 pipeline/03_face/split_head.py  --source $S --work $O
python3 pipeline/03_face/build_face.py  --source $S --work $O
python3 pipeline/03_face/build_eyes.py  --source $S --work $O
python3 pipeline/03_face/build_lids.py  --source $S --work $O
python3 pipeline/03_face/mouth_build.py --source $S --work $O

python3 pipeline/03_face/verify_face.py  --source $S --work $O
python3 pipeline/03_face/brow_check.py   --source $S --work $O
python3 pipeline/03_face/verify_eyes.py  --source $S --work $O
python3 pipeline/03_face/closed_check.py --source $S --work $O
node    pipeline/03_face/mouth_compare.mjs --source $S --work $O --pack characters/beret-girl
python3 pipeline/03_face/mouth_compare.py  --source $S --work $O
```

上面 0–4 步会**改写** `$S/face/`。只想确认能不能重建、不想动现有文件，用回归：

```
python3 pipeline/03_face/verify_rebuild.py --source characters/beret-girl/source --work $O
```

## 哪些输入是「不可重跑、产物即来源」

脸这一家的五个生成步骤，输入全部已经在 source 里，没有要另外搬的文件：

| 输入 | 为什么不可重跑 |
| --- | --- |
| `master/head_master.png` | 生图服务出的头部母版 |
| `master/derived/head_nohat.png`、`head_bald.png`、`mouth_small.png`、`mouth_big.png`、`mouth_smile.png` | 生图服务出的改图配准到母版后的结果（改图原图不在 source 里） |
| `master/derived/head_nohat_draft.png`、`head_bald_draft.png` | 同上，草稿版，当配色基准 |
| `head/rig.json` | 另一步（`../05_rig/build_rig.py`）的产物，不归这里；这里只读它的部件 rect 和眼睛几何 |

注意 `head/rig.json` 里三个张嘴口型的 rect 是组 rig 那一步绕嘴心缩过的（0.85 / 0.62 / 0.8 倍），和 `split_head.py` 拆出来的 rect 不一样，这是原来就有的设计；其余 22 个头部部件的 rect 两边相同（2026-10-07 比过）。

## 已知限制

- **`face.json` 用现在的脚本重建不出逐字节相同的文件。** 现有的那份是 `build_face.py` 的早一版写的；之后脚本改成不再出眼睛各层，并给 10 个眼睛部件的 `cleanup` 字段写一句说明，但那之后现有的 `face.json` 没有重出过。两份的差别只在这 10 个部件（eyeWhite / iris / eyeHl / eyeLow / lash 各 L、R）的 `cleanup` 字段：现有的有 8 个没有这个字段、2 个（eyeLowL/R）写的是「去掉非深褐色的碎屑 N 块」，重建的 10 个都写「眼睛各层由 face/build_eyes.py 生成（#1158），这里不写」。rect、层序、深度都相同。puppet 里没有别的代码读 `cleanup`。
- `face.json`、`eyes.json` 里有几句说明文字还写着 `parts/rig.json`、`face/build_eyes.py` 这样的旧相对路径。它们是写进产物的字符串，改了产物的 md5 就变，这次没动。
- `split_head.py` 把帽子、呆毛、头发、脖子也照原样拆出来（校验脚本叠回对比要用头发和帽子），但这些只当中间产物；source 里 `head/hat.png`、`hair/`、`neck/` 的成品另有来历，和这里拆出来的不是同一份（帽子后来改过）。
- 几个角色专用的数写死在脚本里：`HEAD_ORG = (390, 136)`、`split_head.py` 里眼睛 / 眉毛 / 嘴的检测框和发色阈值、`mouth_build.py` 的嘴中线和各口型尺寸、`mouth_compare.html` 的嘴位置。换角色要改脚本，没有做成配置。
- 校验图里的字用 `/Library/Fonts/Arial Unicode.ttf`、`/System/Library/Fonts/Hiragino Sans GB.ttc`，只在 macOS 上能跑。
- `mouth_compare.mjs` 的数据包目录必须在 `puppet/` 里面；它依赖 playwright。
- 逐字节一致只在这一套环境里验证过：Python 3.13.9、opencv 4.13.0、numpy 2.4.6、scipy 1.17.0、Pillow 12.2.0。换版本后 png 的字节可能变，没试过。

## 这次校验的实际结果（2026-10-07）

做法：把 `characters/beret-girl/source` 整个拷到一个临时目录（跟着符号链接拷实体），删掉拷贝里 `face/` 的全部 24 个文件，对着拷贝按顺序跑 0–4 步，再和真的 `source/face/` 逐文件比 md5。没有往真的 source 里写。

- 重建出 24 个文件，**23 个 md5 一致**（22 张 png + `eyes.json`）；不一致 1 个：`face.json`，原因见上面「已知限制」第一条。
- 读文件记录（Python 的 open 审计事件，加上包了一层的 `cv2.imread` / `cv2.imwrite`，路径解开符号链接后记）：五个生成步骤和四个 Python 校验脚本读的文件只落在临时目录的 `source/`、`work/`，以及 `pipeline/03_face/`、`pipeline/lib/`；路径里含试验目录名的 0 条。
- `split_head.py` 拆出的 25 张 png 和原型工程里当初拆出来的那批比：24 张逐字节相同，`hat.png` 不同（那边的帽子后来换过）。
- `verify_eyes.py` 出的 `verify_eyes.json` 和原型工程里留着的那份逐字节相同。`verify_face.py` 出的 `verify.json` 和留着的那份不同：留着的那份是眼睛各层、口型重做之前跑的，叠回对比和眼睛错位几项的读数因此不一样（叠回平均色差 旧记录 7.51，这次 8.21）。
- `brow_check.py`、`closed_check.py`、`mouth_compare.mjs`、`mouth_compare.py` 都跑通出了图。`mouth_compare.mjs` 的两张截图和原型工程里留着的不是逐字节相同（数据包里别的贴图之后变过），拼出的对照图看过：四个口型修前 / 修后两行都在。其余三张校验图只确认生成了，没有逐张细看。
- `verify_rebuild.py` 跑过一次：五步都 ok，报「现有 24 个文件，重建出 24 个，md5 一致 23 个；不一致：face.json」，退出码 1。
- `tools/check_generic.py` 跑过：通过。
- 没跑：直接对着真的 `source` 跑 0–4 步（会改写成品，这次只在拷贝上跑）；换一套 Python 库版本重跑。
