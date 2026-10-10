# pipeline/02_hair：发片和帽子片

把头发拆成能各自按深度平移的几片（每片带「被别的东西压住的部分」和一张权重图），并修帽子片。产物是角色来源目录里的
`hair/pieces/*.png`（7 片 + 7 张权重图）、`hair/hair.json`（每片的位置、层序、深度）和 `head/hat.png`。

脚本原作者是做头发的那位同事；2026-10-07 拷进本项目，只把路径改成了 `lib/paths.py` 的约定（`--source` 来源目录、`--work` 中间产物目录），算法没动。

## 步骤

| 顺序 | 脚本 | 读 | 写 |
| --- | --- | --- | --- |
| 1 | `10_assemble.py` 组装每一片（可见部分 + 被压住的部分）、抠图、出权重图 | `hair/inputs/` 全部、`master/head_master.png`、`master/derived/head_nohat.png`、`head_bald.png` | `hair/pieces/`、`hair/hair.json`；`<work>/hair/asm.npz` |
| 2 | `19_hat_fix.py` 帽子片：去掉不属于帽子的线、补帽顶缺口、去碎块 | `head/hat_pre1164.png`（帽子原件）、`head/rig.json`、`hair/hair.json`、`hair/inputs/ahoge.png` | `head/hat.png` |
| 3 | `21_fix_1164b.py` 发片的三处修补（刘海角上的线头、侧发中间的缝、侧发外沿接头） | `<work>/hair/pieces_asm/`（第 1 步刚出的发片）、`<work>/hair/asm.npz`、`hair/hair.json`、`head/hat.png` | `hair/pieces/`（覆盖其中几片） |

顺序不能换：第 2 步读第 1 步写的 `hair.json`，第 3 步读第 2 步写的帽子片和第 1 步的中间产物。**只跑第 1 步会把第 3 步的修补冲掉**，所以一律用 `build.sh`：

```bash
# 在 puppet 目录里
bash pipeline/02_hair/build.sh characters/beret-girl/source /tmp/hair-work
python3 tools/build_pack.py characters/beret-girl/source characters/beret-girl     # 再把来源重新生成数据包
```

`build.sh` 就地改写来源目录里的产物（约 20 秒）。

## 不可重跑的输入（产物即来源）

`hair/inputs/` 里的 16 个文件和 `head/hat_pre1164.png` 是更早的拆分步骤的产物：头发遮罩、过分割和归并（`master2.png`、`hair2.png`、`hat.png`、`ahoge.png`、`pieces2.npy`、`pieces.json`）、
「纯头」「去帽」「逐层揭开」的重绘图配准后的结果（`reg_ho_*.png`、`reg_peel1–5_d.png`、`peel.json`）、分层模型给的完整后发和去帽前发（`st_back.png`、`B_front_bangs_inner_nohat.png`）。
这些步骤用了本地生图模型的抽样结果，加上人工调参和挑选，**不能确定性重跑**，所以它们的产物直接当来源保存；那几步的脚本没有拷进本项目。
`st_back.png`、`B_front_bangs_inner_nohat.png` 是第三方分层模型的输出：按 `THIRD_PARTY_NOTICES.md` 已定的口径，输出图可以入库，模型权重不进项目。

第 1 步里还有一批手工圈的多边形蒙版，是脚本里写死的坐标（头部母版像素），只对这个角色有效。

## 校验（2026-10-07）

在来源目录的一份临时拷贝上，删掉 `hair/pieces/` 全部 14 张、`hair/hair.json`、`head/hat.png`，跑 `build.sh`：重建出的 16 个文件与原来的逐文件 md5 一致。

## 已知限制

- 只认这一个角色：片名、手工蒙版坐标、帽子片在母版里的位置、呆毛根部的范围都写在脚本里，没有进配置。
- 早期拆分步骤不在本项目里，新角色的头发拆分流程还没有整理。
- 帽子和呆毛、侧发外描边的检查在 `qa/hair/checks_1164.py`，已接进回归。
