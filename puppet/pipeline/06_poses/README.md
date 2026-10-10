# pipeline/06_poses：姿势的手臂层（A 类姿势）

A 类姿势 = 身体（躯干、领子领巾、裙、腿、鞋）锁死用一张 `base.png`，每个姿势只换「双臂 + 手」一层；头由数据包画。
这里是出手臂层的脚本。2026-10-07 从原型工程拷贝过来并参数化（W4），原件没有删。

## 约定

- 脚本和配置里**不写任何具体工程的路径**。每次运行的目录全部由命令行给：
  `--pack` 角色数据包目录（肩头支点、中线从它的 `character.json` 的 `host` 字段读，这两个数只存在那里；用到它们的步骤——预涂、烘焙、逐手检查、回归——必须给，不给会报错）、
  `--assets` 素材根目录（配置里的素材路径都相对它）、`--work` 中间产物、`--kit-in` 读现有 kit、`--kit-out` 写烘焙结果、`--report` 检查图。
- 角色相关的东西都在 `configs/<角色>.json`：kit 画布、躯干线、头块、裙摆范围、配准区域和判据、颜色、prompt，以及每个姿势的取法（`poses`）。
  手工圈的待机手臂多边形在旁边的 `<角色>.pose_polys.json`。这两个文件是角色数据，数据包格式定了之后应搬进 `characters/<角色>/`。
- 生图服务的地址和令牌只从环境变量来（见 `imggen.py`）：`IMGGEN_CLIENT`（客户端脚本路径，必须）、`IMGGEN_PYTHON`、`IMGGEN_URL`（可选，给了就先等服务空闲）。服务是串行的，一次一个请求。
- 坐标一律是 kit 画布像素。

## 步骤

| # | 步骤 | 脚本 | 产物 |
| --- | --- | --- | --- |
| 1 | 整人姿势草稿（8 步，多抽，命中即用） | `draft.py plain|green|paint`；涂抹法先 `paint_mask.py` | `<work>/pose2d_*.png` |
| 1b | 草稿筛（身体 / 头 / 手的比例） | `sieve.py` | `<report>/sieve-*.png` |
| 2 | 绿底预涂：配准、裁双臂区、背景和头涂纯绿 | `arm_prep.py` | `<work>/armhd_<姿势>_crop.png` |
| 3 | 高清重绘到绿底（8 步，一次 4 个种子） | `arm_hd.py` | `<work>/armhd_<姿势>_s<种子>.png` |
| 4 | 初筛三项（肤色面积、绿底纯度、前景面积） | `arm_bake.py screen` | `<report>/armhd-screen-<姿势>.png` |
| 5–9 | 色度抠 → 去绿边 → 收线 → 按袖窿切肩 → 配准 → 写手臂层 | `arm_bake.py bake` | `<kit-out>/arms_*` / `over_*`、`poses.json`、`<report>/arm-check-<姿势>.png` |
| 9b | 袖口统一：抹掉旧白条，按待机袖口比例重画一道宽白条，底色对齐（配置里 `cuff: true` 的姿势） | `cuff_unify.py` | 就地改 `<kit-out>` 里的层，`<report>/cuff-dbg-*.png` |
| 11 | 逐手检查图 + 线宽 / 手面积 / 绿边 / 碎片 | `hands_audit.py` | `<report>/hands-audit.png`、`.json` |
| — | 回归：从来源图重跑、和现有 kit 逐像素比 | `verify_against_kit.py` | 退出码 0 = 全部一致 |

第 10 步（放回整身 1:1 看肩、手和脸的边）和落 kit 不在这里：要用讲解员运行时（`host/`）截图，属于 `qa/`。没落进数据包的姿势库想先看效果：做一个只把 `host.kit` 指到待落目录的数据包拷贝，用 `host/` 的 `createHost({ pack })` 打开。

例（在仓库根；`$A` 是素材根，`$O` 是随便一个输出目录）：

```
python3 puppet/pipeline/06_poses/arm_prep.py  puppet/pipeline/06_poses/configs/beret-girl.json shrug --assets $A --work $O/work
python3 puppet/pipeline/06_poses/arm_hd.py    …/beret-girl.json shrug 611 612 613 614 --assets $A --work $O/work          # 加 --dry-run 只打印命令
python3 puppet/pipeline/06_poses/arm_bake.py  …/beret-girl.json screen shrug --assets $A --work $O/work --report $O/report
python3 puppet/pipeline/06_poses/arm_bake.py  …/beret-girl.json bake shrug 613 --assets $A --work $O/work --kit-in <现有 kit> --kit-out $O/kit --report $O/report
python3 puppet/pipeline/06_poses/hands_audit.py …/beret-girl.json --assets $A --work $O/work --kit-in $O/kit --report $O/report
```

## 加一个新姿势

1. 选来源图的出法：手离头远 → 直接用认可的整人参考图或 `draft.py plain`；手靠近头 → `draft.py green`；文字定不住位置 → `paint_mask.py` + `draft.py paint`。
2. 在配置 `poses` 里加一条：`source`、`box`（宽高比须等于 `crop.hd`）、`mode`（`arms` 头后 / `armsAsOver` 按躯干线取但放头前 / `overPoly` 按多边形取、放头前）、`sides`，需要时 `idleOther`、`mirror`、`prep`。
3. 跑 2 → 3 → 4，在通过初筛的里面看图挑一张，把种子写进 `seed`。
4. 跑 `bake`，看 `arm-check`；按需要加 `keep` / `poly` / `erase` / `erode` / `armscale` / `armrot` / `offset` 等（各键含义在配置的 `_说明` 里）。绿剪影和涂抹那两路来源的线粗、手大，一定要 `erode`（+ `armscale`）收到和别的姿势一致，用 `hands_audit.py` 的线宽和面积对。

## 搬迁校验（2026-10-07）

`verify_against_kit.py` 对配置里的 8 个姿势（shrug、presentL→presentR、covermouth、think、hips、surprise、wave、fist）从各自的来源图重跑，
预涂裁块 8 张和手臂层 11 张与原型工程里现有的文件**逐像素一致**（出图那一步没有重跑，高清草稿用的是现成的）。`paint_mask.py` 的涂抹图也逐像素一致。
出图命令（`arm_hd.py`、`draft.py` 三种）只核了能拼出来（`--dry-run`），没有真的发请求，**新的 `imggen.py` 没有实际调过服务**。
`sieve.py` 跑了一组草稿能出表和图，没有和原件的结果逐项比（原件那组当时没有留结果文件）。

为了和 kit 里较早烘的三张文件逐像素一致，配置里留了两个旧规则开关（见 `_说明`）：shrug、presentL、hips 带 `blackLinesToNavy: false`，hips 另带 `legacySkirtBlockAll: true`。
不带这些开关时，脚本按定稿规则跑，结果和 kit 里这三张不一样（shrug：8994 个可见像素的描边颜色不同，alpha 相同；hips：另有 621 个像素的 alpha 不同，在拳头下沿）。下次重烘这三张时把开关删掉。

### 第二次校验（2026-10-07 夜，加了袖口统一之后）

`verify_against_kit.py` 现在对 `cuff: true` 的姿势（shrug、presentL→presentR、hips、fist）在烘完后接着跑 `cuff_unify.py`。对落了袖口统一的 kit 重跑：8 个姿势的预涂裁块 8 张、手臂层 11 张全部逐像素一致。两个旧规则开关已不在配置里。
`imggen.py` 仍然没有实际调过生图服务。

## 已知限制

- 手臂层烘在 kit 画布分辨率（缩回去的），没有按高清贴图输出；高清草稿是 kit 画布的 1.43 倍。
- 手压在身体上的内边（`overPoly` 的 `poly`、`keep`）是人手圈的多边形。
- 头块、裙摆范围、躯干线是按这个角色的正面站姿量的常数，换角色要重量；没有从数据包自动推。
- `hands_audit.py` 的「碎片」没有用坏样本标定过；五指、指尖描边、手腕接袖口没有自动判法。
- 袖口：母版是「一道宽白条」（藏青 / 白 / 藏青，白条占带宽 40%–62.5%）。各姿势出图后袖口的条宽、条数会不一致，由 `cuff_unify.py` 程序重画（见步骤表）。弧形窄带（握拳）自动找不准，靠配置里手工给的两条折线；透视很大的袖口画出来的白条沿弧线等宽，没有近大远小；已经是宽白条的袖口底色不对齐（有几只偏墨绿）。
- 字体：检查图的中文标注在 macOS 上用系统黑体，别的系统会退到 PIL 默认字体（中文会缺字）。

## 附：讲解员运行时的姿势切换参数（不属于流水线，记在这里备搬）

姿势之间不插值，直接换手臂层；下面是讲解员在换图前后几帧给手臂层加的处理。实现在 `host/poses.js`（选姿势、切换帧计数、整体挤压、`swapFx` 四种）和 `host/index.js`（按侧绕肩画手臂层、挖洞）；2026-10-07 夜从原型搬来，搬前搬后成片逐帧一致。支点和中线现在从数据包 `character.json` 的 `host.shoulders`、`host.midX` 读，流水线也从那里读（`--pack`），配置里不再存，只有一份。下表是搬的时候的值，以代码为准。

| 项 | 值 | 说明 |
| --- | --- | --- |
| 选项 | `createHost({ swapFx })`，取 `'a'` / `'b'` / `'c'` / `'d'`，默认 `'c'`；`state.swapFx` 可逐帧覆盖 | `'c'` 是 2026-10-07 总管定的临时默认，用户还没挑 |
| 时间基准 | 帧（30fps）。「换图帧」= 姿势名变了的第一帧，记 n = 0；之前的帧记 lead = 2、1 | 往回最多看 8 帧找上一次换图，往前看 2 帧找下一次 |
| 支点 | 左肩 (440, 715)、右肩 (654, 715)，kit 画布像素 | 角色数据，和流水线配置里的 `shoulders` 是同一组数 |
| 运动方向 | 每一侧单独算：旧姿势的手 → 新姿势的手，相对肩头的夹角差（度，画布顺时针为正），只取符号 | 手的位置 = 该侧手臂层里肤色像素的重心（加载时每层算一次，隔点采样） |
| 手没动的判定 | 两个重心相距 < 6 kit px → 这一侧不做任何处理 | 例：挥手时垂着的那只手 |
| 沿手臂方向伸缩的情况 | 夹角差绝对值 < 4° 时不用实际夹角，给名义方向：手上抬 = 向外，下落 = 向内 | 否则方向会被噪声决定 |
| 预备（只有 c） | lead = 2：反方向 1.5°；lead = 1：反方向 3.2° | 整条旧手臂绕肩刚性转 |
| 拖影（b、c） | 只在 n = 0 画，2 份，都是**新**手臂的副本，落在来路一侧：角度 = 本体角 − g 和 本体角 − 2g，透明度 0.30 和 0.16 | g = min(转角 × 0.22, 9°)，转角先截到 60° |
| 旧手臂副本 | 不画 | 试过（往新位置甩出一份，透明度 0.22），会叠在裙子上，去掉了 |
| 过冲 / 回弹（c） | 本体角 = 3.2° × e^(−0.6n) × cos(1.3n)，n = 0…5；n ≥ 6 为 0。逐帧：3.2、0.47、-0.83、-0.38、0.14、0.16 | 沿运动方向为正；换图帧本身就在过冲位置 |
| 过冲（b） | n = 0、1、2 的本体角：0°、2.6°、−0.9°；之后 0 | b 没有预备 |
| 伸缩（d） | lead = 1 缩到 0.955；n = 0…3：0.90、1.05、0.985、1.004；之后 1 | 绕肩等比缩放，不转、不拖影 |
| 两手连层的折减 | × 0.4（角度和缩放量都乘） | 判定：这一层左右两侧都有手，且中线 ±3px 内不透明像素的采样数 > 6（现在只有捂嘴） |
| 一层里有两只手时 | 每侧各画一遍，按中线裁开，各绕各的肩 | 中线 x = 547 |
| 不在切换的帧 | 两侧本体角都是 0、缩放 1 时走整层直接画 | 和 `'a'` 逐像素相同 |
| 顶层漫符的挖洞 | 用转动 / 缩放后的手臂本体挖，不含拖影 | 只对盖在头前面的手臂层 |
| 整体挤压（各模式都有，原有的） | 换图前 1 帧 [横 1.012, 竖 0.98]；n = 0…3：[0.989, 1.02]、[0.998, 1.0037]、[1.0011, 0.9981]、[1.0007, 0.9987] | 绕脚底 |
| 头的小惯性（各模式都有，原有的） | 俯仰加 −1.5 × e^(−9d) × cos(22d)，d = 距换图的秒数，持续到 n < 5 | |

状态：`c` 是临时默认，用户还没看片挑；参数只对着抽帧调过。

### 第三次校验（2026-10-07 夜，肩头支点和中线改成只从数据包读之后）

配置里删掉了 `shoulders`、`midX`、`mirrorSum`（镜像用的 2·midX 现算）；`verify_against_kit.py … --pack <数据包>` 重跑，8 个姿势的 19 项全部逐像素一致。配置里若又出现这两个键且和数据包不一致，脚本会报错退出。例子里的命令都要加 `--pack`。

### 第四次校验（2026-10-07 夜，来源素材搬进 characters/<角色>/source/ 之后）

配置里的素材路径改成相对来源目录（W3 改的 12 处）。命令：`verify_against_kit.py <配置> --pack <数据包> --assets <数据包>/source --kit-in <数据包>/source/poses --hd-from <数据包>/source/pose-sources/hd …`。8 个姿势 19 项全部逐像素一致；`kit_checks.py`、`shoulder_overlap.py` 对 `source/poses` 全过。

同时拷进来两个脚本，都做了「重跑 = 现文件」的校验：

- `base_collar.py <base_w5.png> <输出 base.png>`：身体底图收领口。输入 `source/pose-sources/base_w5.png`，重跑结果与 `source/poses/base.png` 逐像素一致。
- `../07_neck/neck.py <待机母版> <输出目录>`：脖子层。重跑的 neck.png 与 `source/neck/neck.png` 逐像素一致，neck.json 内容一致。

这两个脚本的几何常数（领口开口的位置和宽度、脖子的宽度和阴影、母版上取色的框）是按这个角色量的，还写在脚本里，没有进配置；参数形式是「输入文件、输出文件」，没有用 `lib/paths.py` 的 `--source / --work` 约定（06_poses 这组用的是更早定的 `--assets / --work / --kit-in / --kit-out`）。两套约定并存，还没统一。

不可重跑、「产物即来源」的层：`source/poses/arms_idle.png`（早先旧脚本加手圈多边形从母版取的，后来手工去过一个 14 像素碎片）、`over_headhold.png`（搁置的抱头）、`neck.png`（姿势库里那张 82 宽的旧脖子，现在的讲解员不读）。
