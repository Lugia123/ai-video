# pipeline/05_rig：头部部件表、深度表

两样小东西，都落在 source 里（脖子层在 `../07_neck/`）。2026-10-07 从原型工程拷过来，只改了路径（原件没动）。
目录约定见 `../lib/paths.py`：`--source` 角色来源目录、`--work` 中间产物目录。

## 步骤

| 产物 | # | 脚本 | 读 | 写 | 可重跑 |
| --- | --- | --- | --- | --- | --- |
| 头部部件表 | 1 | `../03_face/split_head.py`（不在本目录，别人移植的） | `<source>/master/head_master.png`、`master/derived/` 里头部那几张 | `<work>/parts/head_parts.json`（和一批拆件图） | 是 |
| | 2 | `split_body.py` | `<source>/master/derived/body_nohead.png`、`body_noarms_b.png` 和两张 `_draft`；`<source>/head/inputs/hand_{open,point,wave,clasp}_f.png` | `<work>/parts/body_parts.json`、`<work>/parts/{torso,skirt,legs,armL,armR,hand_*}.png`、`dbg/torso.png` | 是 |
| | 3 | `split_armsdown.py` | `<source>/master/body_master.png`、`<source>/head/inputs/body_armsdown_f.png`、`<source>/master/derived/body_noarms_b.png` | `<work>/parts/armsdown_parts.json`、`armDown{L,R}.png`、`reg/body_armsdown.png` | 是 |
| | 4 | `build_rig.py` | `<work>/parts/` 的三张部件表；`<source>/head/inputs/rig_back.json` | `<source>/head/rig.json` | 是 |
| 深度表 | — | 没有脚本 | — | `<source>/depths.json` | 手写的数据文件，**成品即来源** |

`split_lib.py` 是 2、3 两步共用的几个函数（`../lib/poses_lib.py` 里没有的，从原拆件公用函数原样拷来）。

第 2、3 步拆出来的图（旧版张臂身体的躯干、裙、腿、手臂、手）现在的数据包不用，这两步只是为了第 4 步要的部件表；打包脚本从 `rig.json` 里实际用到的是头、眼、嘴的几何和脸 / 眉 / 帽子的矩形。

## 命令（在 puppet/ 目录里；`$O` 是随便一个可写目录）

```
S=characters/beret-girl/source
python3 pipeline/03_face/split_head.py --source $S --work $O
python3 pipeline/05_rig/split_body.py --source $S --work $O
python3 pipeline/05_rig/split_armsdown.py --source $S --work $O
python3 pipeline/05_rig/build_rig.py --source $S --work $O
```

`build_rig.py` 会重写 `$S/head/rig.json`（内容和现有的一致，见「校验」）。只想核对不想动 source，就先把 source 拷到别处、把 `--source` 指过去。
依赖：numpy、Pillow、opencv-python（带 SIFT）、scipy。

## 不可重跑、产物即来源（必须在 source 里）

| source 里的位置 | 是什么 | 为什么不可重跑 |
| --- | --- | --- |
| `depths.json` | 头部各部件的深度表 | 手写的；原型工程里只有读它的脚本，没有写它的 |
| `head/inputs/rig_back.json` | `rig.json` 的 `back` 字段（背面立绘的摆放） | 是早先一版部件表下算出来的，之后头部重新拆过，帽子和腿的矩形变了；其中 `headPart` 一项也没有任何脚本写。用现在的部件表重算，数值对不上（scale 1.99576 对原来的 1.99655）。`build_rig.py` 原样带进去 |
| `head/inputs/hand_open_f.png`、`hand_point_f.png`、`hand_wave_f.png`、`hand_clasp_f.png` | 四张手型特写（40 步定稿） | 生图结果 |
| `head/inputs/body_armsdown_f.png` | 手臂下垂版身体（40 步定稿） | 生图结果 |
| `master/body_master.png` | 身体母版（1536×1344） | 生图结果（`../01_master/masters.py` 出的那张） |

## 已知限制

1. `rig_back.json` 是从现有 `rig.json` 里把 `back` 字段原样抽出来的新文件，原型工程里没有对应的原件。没有它时 `build_rig.py` 退回原来的做法：从现有的 `head/rig.json` 里留下 `back`——也就是说 `rig.json` 被删掉、又没有 `rig_back.json` 时，重建出的 `rig.json` 会少 `back` 字段。算 `back` 的脚本和背面立绘没有移植（数据包不用 `back`）。
2. `split_body.py` 和 `../03_face/split_head.py` 一样，去掉了原件里「定稿原图在不在」的判断，只看 `master/derived/<名>_draft.png` 在不在（定稿原图不在 source 里）。对现有素材两种判断结果相同。
3. 关节点、手腕点、取色框等角色相关的常数写在脚本里，没有进配置。

## 校验（2026-10-07，实跑）

在临时目录里拷一份 source（`cp -RL`），补上上表的输入，删掉 `head/rig.json`，按上面的命令跑：

- `rig.json` 和真 source 里的**逐文件 md5 一致**。之后整条流水线的统一回归 `pipeline/rebuild_check.py` 也包含这几步。
- 三张部件表 `head_parts.json`、`body_parts.json`、`armsdown_parts.json` 和原型工程里留着的逐文件 md5 一致；`<work>/parts/reg/body_armsdown.png` 和 source 里的 `master/derived/body_armsdown.png` md5 一致；抽查的 9 张拆件图（`torso skirt legs armL armR hand_openL hand_claspL armDownL armDownR`）和原型工程里的 md5 一致。
- 审计钩子（`sys.addaudithook`，记所有 `open` / 列目录）下，全过程读到的文件都在那份 source 拷贝、`--work` 和 `pipeline/` 里，没有读 puppet 目录以外的任何工程文件。
- `depths.json` 没有可跑的东西，没校验。
