# puppet：可动角色生产线 · 架构

状态：设计已通过（2026-10-07）；**冲刺中**——引擎最小核心、第一个数据包、接进 ep09 讲解员的适配层已经有了，其余按 f 节往后排。哪些做了、哪些没做见 c 节末尾。

用户的原话：「clone 下来，借鉴各项目需要部分，整理成一个我们自己的项目」「以后再有新的角色设计，可以直接从项目中生成」。

所以目标有两个，第二个更重：

1. 一个我们自己的 2D 木偶引擎，能在本仓的确定性渲染器里按时间 t 逐帧出画面。
2. **一条生产线**：给一张新的角色设定图，产出一个会转头、有表情、有姿势库的角色数据包。

依据：`episodes/ep09-screenshot-devlog/research/open-live2d-survey.md`（源码调研）、同目录的 `ai-live2d-methodology.md`（流水线底稿）、`live2d-head-angles.md`、`live2d-route.md`，以及今天的三次实测（下面 0.2）。

文中的标注：【源码】= 我打开文件读过；【实测】= 今天跑过或量过；【未验】= 没有验证的设想。

---

## 0. 先定下来的几件事

### 0.1 引擎核心：自己写，不以 iki 为骨架

iki 试跑的事实【实测】：

- 用我们现成的头部部件合成 18 张角色图层，喂给它的自动绑定，一次跑通：18 个部件、16 个参数、6 个变形格。
- 无头 Chromium 里逐帧设参数渲染，240 帧渲两遍，逐帧 md5 全部一致。引擎没有内部时钟；待机驱动的随机数可注入（没用它）；物理是 1/60 秒固定步长，从 0 重放。
- 产物：`episodes/ep09-screenshot-devlog/proto-b/out/wip-iki-test.mp4`、`wip-iki-test-contact.png`、`wip-iki-vs-v2-contact.png`。试跑页和安装的包在 `research/_repos/_iki-trial/`（不入库）。
- 看图：它的转头是「脸在固定的头发轮廓里滑动」，干净，眨眼质量好；但头的外形不变，帽子不动。

不能直接用的原因【源码】：

| 我们需要 | iki 的情况 |
| --- | --- |
| 19 片头发、帽子、饰品各自成层 | 图层角色写死 25 个，头发只有 `hair_front`、`hair_back` 各一张（`auto-rig/roles.ts`） |
| 多套手臂互斥切换、整张姿势图替换 | 没有切换组；只有部件的不透明度绑定 |
| 贴脸叠加层、头周围符号的挂点 | 没有这个接口 |
| 层序随参数变 | `order` 是固定的数 |
| 同一部件在不同档位换贴图 | 没有 |
| 多角度原画做关键形 | 自动绑定完全不用多角度原画，只靠规则；格式里的二维关键形只在变形格上（`warp2d`），部件自己的网格关键形只支持一维 |

另外：单人项目，4 个月 559 次提交，12 星，格式自称「1.0 之前不稳定」。把核心押在它上面风险偏大；但它的代码质量高、许可是 MIT，**适合成块移植**。

### 0.2 三层能力叠加（今天下午确定的）

一个部件随头部参数怎么动，分三层，后一层只在前一层不够时才用：

1. **默认：按深度线性平移。** `dx = depth × R × sin θ`（R = 半脸宽）。W4 用 35 层（19 片头发 + 脸、五官、帽子）做了静态验证，±30° 内成立且干净【实测：`proto-b/gen/24_head_layers_test.py` → `out/wip-head-layers-shift.png`】。**前提是部件拆得细。**
2. **校正：稀疏关键形。** 某个部件在某一档上平移不够（压窄、轮廓收拢、脸颊修形），就在那个格点上存一份网格位移；没存的格点自动补出来。
3. **大角度：多视图套切换。** Q 版 3/4 侧脸是画法约定，不是球面旋转，所以大角度以原画为准：同一部件在不同档位换贴图并交叉淡化，层序随参数变。W1 已交付正面 + 三档（轻微、3/4、正侧）和 34 个特征点（`proto-b/views/views.json`）。

注：我在 iki 试跑里并排比的 `wip-v2-head-morph` 是旧做法（把贴图贴在代理椭球上转），不再作为方向。

### 0.3 渲染方式

引擎核心只算「每个部件这一帧的顶点位置、不透明度、层序、用哪张贴图」，不碰画布。画的那一步分开：

- 主后端 **WebGL2**（预乘透明度、模板缓冲做遮罩），画到一张离屏画布上，再由宿主拷到 2D 画布。iki 试跑就是这么做的，默认软件渲染下两遍一致【实测】。
- 叠加层（漫符）继续用 2D 画布画，和现在一样。
- 不做纯 2D 画布的三角形贴图后端：接缝和速度都不好。

---

## a. 模块划分

```
puppet/
  ARCHITECTURE.md  THIRD_PARTY_NOTICES.md  README.md
  third_party/        来源清单（commit 号）+ 许可证原文
  schema/             角色数据包的 JSON Schema（M1）
  engine/             运行时（浏览器里跑，零依赖，纯 ES 模块）
    params.js           参数表：范围、默认值、夹取
    blend.js            参数格上的关键形混合 + 自动补格
    parts.js            部件：默认线性平移、网格、关键形、贴图套
    order.js            层序（可随参数变）与遮罩
    groups.js           切换组（互斥部件的淡入淡出）
    warp.js             变形格：用一张粗格带着多个部件变形
    physics.js          弹簧、发链；固定步长；从 0 重放与检查点
    clock.js            固定步长时钟
    overlay.js          叠加层与挂点（脸层、最上层、背后层）
    drivers.js          眨眼、视线、口型、呼吸：t 的纯函数
    render-webgl.js     WebGL2 后端
    index.js            createPuppet(pack) → { set, get, evaluate, draw, anchors }
  autorig/            自动绑定（Node 里跑）
    measure.js          从图层量几何：包围盒、每行的不透明段、下巴线、头单位
    depth.js            给部件定深度和锚点
    fields.js           按规则生成位移场（没有多角度原画时的兜底）
    fit-views.js        用多角度原画的特征点拟合深度、生成关键形
    mesh.js             自动铺网格
    eyes-mouth.js       眨眼折叠、视线、口型的关键形
    physics-preset.js   头发物理的分组与默认参数
    checks.js           几何前提检查（不满足就报错，不出坏模型）
  pipeline/           素材流水线（Python + shell，调本地生图服务和 See-through）
    00_master … 12_selfcheck   一步一个脚本，见 d 节
  emotes/             表情库（现在的 chibi-emotes）
  adapters/
    host.js             本仓的 createHost 接口（兼容 host-pose.js 的用法）
    video.js            window.__video 的薄封装
  qa/                 质检工具：叠回对比、洋葱皮、错位测试、手部扫描、比例筛、两遍 md5
  review/             进度总览页生成器
  characters/
    beret-girl/         第一个角色数据包
    _example/           最小样例
  cli.mjs             puppet new / build / check / demo
```

各模块一句话职责和边界：

| 模块 | 输入 | 输出 | 不做什么 |
| --- | --- | --- | --- |
| engine | 角色数据包 + 一组参数值（+ 时间 t，仅物理用） | 每个部件的顶点、贴图、不透明度、层序；挂点坐标；一帧画面 | 不读时钟、不用随机数、不认识部件的名字 |
| autorig | 分层素材 + 量出来的几何 + 可选的多角度特征点 | 角色数据包里的深度、网格、关键形、物理 | 不生图、不看图好不好看 |
| pipeline | 一张设定图 + 几项设定 | 分层素材、多角度原画、姿势图，及每步的检查报告 | 不决定怎么动 |
| emotes | 脸的矩阵和包围盒（来自 engine 的挂点） | 往叠加层上画的符号；要求引擎变脸的参数 | 不直接改部件 |
| adapters | 旁白时间轴、镜头参数 | `createHost()` 返回的对象；`window.__video` | 不含角色知识 |
| qa | 数据包、渲染出的帧 | 检查图、通过 / 不通过的报告 | 不修东西 |

**「不认识部件的名字」是硬约束**：引擎里不出现 `hair_front`、`hat` 这样的字符串。部件的行为全由数据包里的字段决定。认名字的地方只有 autorig（角色表）和 pipeline。

---

## b. 逐模块：借谁的

借用方式三种：**移植** = 把代码改写成我们的语言和结构，保留版权声明；**照算法重写** = 读懂后自己写，注明出处；**只借参数和思路** = 不用它的代码。

所有来源的 commit 号在 `third_party/SOURCES.json`；许可证原文在 `third_party/licenses/`；逐文件的出处和改动说明在移植时写进 `THIRD_PARTY_NOTICES.md`。

### 运行时引擎

| 子模块 | 来源（项目 · 文件 · 函数） | 许可 | 方式 |
| --- | --- | --- | --- |
| 参数表 | iki · `packages/engine/src/parameter-store.ts` | MIT | 移植 |
| 关键形混合（二维参数格、双线性） | Inochi2D v0.8.7 · `source/inochi2d/core/param/binding.d` · `interpolateLinear`、`interpolate` | BSD-2 | 照算法重写（D → JS） |
| 自动补格 | 同上 · `fillBlanks`、`interpolate1D2D`、`extrapolateCorners`、`extendAndIntersect` | BSD-2 | 照算法重写 |
| 变形叠加（多个参数各推一份位移，相加） | Inochi2D v0.8.7 · `core/nodes/defstack.d` | BSD-2 | 照算法重写 |
| 默认线性平移 | 我们自己（W4 的 `gen/24_head_layers_test.py`；W5 的方法论 1.1） | — | 自有 |
| 变形格取样（把一个点绑进格子、随格子变形） | iki · `packages/engine/src/warp-grid.ts`、`warp.ts`、`deform.ts` | MIT | 移植 |
| 粗网格带子部件（三角形查表） | Inochi2D v0.8.7 · `core/nodes/meshgroup/package.d` | BSD-2 | 只借思路（先用变形格，够用就不做） |
| 层序随参数变 | Inochi2D 的 zSort 绑定（Aka 模型里实测有 1 处） | BSD-2 | 只借思路，自己写 |
| 贴图套切换 + 交叉淡化 | 我们自己（方法论 4.1 的 `viewSets`） | — | 自有 |
| 切换组 | 概念来自 Cubism 的 pose3.json（公开文件格式）；淡入规则自己定 | — | 自有，见下面的问题 2 |
| 遮罩（范围内 / 范围外，模板缓冲） | iki · `packages/engine/src/player.ts` · `drawClipped`；Inochi2D 的 `MaskingMode` 两种模式 | MIT / BSD-2 | 移植（iki）+ 借概念（反向遮罩） |
| 弹簧物理 | iki · `packages/engine/src/physics-motion.ts` | MIT | 移植 |
| 发链（多段角摆） | iki · `packages/engine/src/hair-chain-motion.ts` | MIT | 移植 |
| 摆 / 弹簧摆（备选模型） | Inochi2D v0.8.7 · `core/nodes/drivers/simplephysics.d`、`core/phys/system.d` | BSD-2 | 照算法重写（需要时） |
| 固定步长时钟 | iki · `packages/engine/src/frame-clock.ts` | MIT | 移植，加「从 0 重放 + 检查点」 |
| 从 0 重放、检查点 | 我们自己（`proto-l2d` 的做法） | — | 自有 |
| 叠加层与挂点 | 我们自己（W4 的 `host-pose.js` 的 faceLayer / topLayer / backLayer / anchors） | — | 搬过来 |
| 眨眼、视线、口型、呼吸的驱动 | 我们自己（`chibi-morph.js` 的 `blinkAt`、`keys`）；时间参数参考实测 | — | 自有 |
| WebGL2 后端 | iki · `packages/engine/src/player.ts`（着色器、预乘透明度、网格绘制） | MIT | 移植，去掉它的 rAF 循环和按 CSS 尺寸改缓冲的逻辑 |
| 表情与动作片段的混合（加 / 乘 / 覆盖） | iki · `expression-player.ts`、`clip-player.ts` | MIT | 移植（M3） |

### 自动绑定

| 子模块 | 来源 | 许可 | 方式 |
| --- | --- | --- | --- |
| 量几何（每行不透明段、下巴线、头单位） | iki · `packages/editor/src/layer-measure.ts`、`auto-rig/head.ts` | MIT | 移植 |
| 定深度 | 我们自己（W5 实测的深度表、W2 的 hair.json 深度） | — | 自有 |
| 用多角度特征点拟合深度 | 我们自己（方法论第 3 节第 8 步）；量法参考 iki · `packages/mcp/src/measure-turn.ts` | MIT | 自有 + 移植量法 |
| 按规则生成位移场（兜底） | iki · `auto-rig/profile.ts`、`fields.ts`、`grid.ts`、`solve.ts` | MIT | 移植。把写死的角色名改成读数据包里的「族」 |
| 脖子 / 耳朵的岛 | iki · `auto-rig/face-mesh.ts` | MIT | 移植（M2 之后，需要时） |
| 自动铺网格（轮廓取样 + 向内缩圈） | Inochi Creator · `source/creator/viewport/common/automesh/contours.d` 及其预设 | BSD-2 | 照算法重写 |
| 眨眼折叠、视线、口型关键形 | iki · `auto-rig/drivers.ts` | MIT | 移植 |
| 头发物理的分组（前 / 侧 / 后 × 左右 / 上下，共六组） | 我们量的官方样例数字（调研第 3.2 节） | — | 只借参数和思路；不含任何官方文件 |
| 弹簧的默认参数 | iki 生成的模型里的值（`stiffness 30 / damping 3`）；Inochi2D 的默认值 | MIT / BSD-2 | 借参数 |
| 几何前提检查 | iki · `auto-rig/checks.ts`；自己加「格子不翻面」 | MIT | 移植 + 自有 |
| 转头位移场的备选形状（平顶钟形） | mesh-avatar-studio · `reference/engine/rig.js` · `turnOffset` | MIT | 只借思路（单层图才用得上） |
| 四个角的交互项 | 一般数学（`yaw × pitch`） | — | 自有；见下面的问题 1 |

### 素材流水线

| 子模块 | 来源 | 许可 | 方式 |
| --- | --- | --- | --- |
| 整条流程 | 我们自己（方法论第 3 节；`proto-b/gen/` 的 24 步脚本；`proto-b/hair/`、`proto-b/views/`） | — | 搬过来并参数化 |
| 拆层 | See-through（W5 已装在 `proto-seethrough/`） | Apache-2.0 | **当外部工具调用，不移植代码** |
| 生图 | 本地生图服务（192.168.3.127） | — | 调接口 |
| 图层合成到统一画布 | iki · `packages/mcp/src/compose.ts`（思路） | MIT | 只借思路 |
| 清单格式、「大动作换整帧」 | img2rig · `docs/rig-format.md` | Apache-2.0 | 只借思路 |

### 其余

| 模块 | 来源 | 方式 |
| --- | --- | --- |
| 表情库 | `assets/lib/chibi-emotes.js`（W3） | 原样搬 |
| 渲染适配 | `proto-b/rig/host-pose.js` 的接口（W4）；`tools/render/render.mjs` 的约定 | 接口照旧，里面换成引擎 |
| 质检工具 | `proto-b/gen/` 里的 `hand_scan.mjs`、`22_sieve.py`、`switch_check.mjs`、`dpr_check.mjs`；W3 的两遍 md5 脚本 | 搬过来 |
| 进度总览页 | `proto-b/tools/build-review.mjs`（W3） | 原样搬 |

### 明确不借的

| 项目 | 许可 | 处理 |
| --- | --- | --- |
| psd2live | GPL-3.0 | 不移植、不看着改写。只保留「九宫格可分解成几项」这个一般性的想法 |
| Cubism Web Framework | Live2D Open Software License | 不移植。只用公开的概念（参数名、切换组、物理输入输出）和我们自己量的数 |
| Spine 运行时 | Spine Runtimes License | 不移植 |
| 官方样例模型 Natori、Mao；Inochi2D 的 Aka | 样例条款 / CC BY 4.0 | 模型文件不进项目。调研里量出来的统计数字可以引用 |
| inochi2d-ts | BSD-2【源码：LICENSE】 | 2023 年后没更新，没读，不用。（调研报告里我写成了「没有许可证文件」，是错的，已改） |

### 拿不准、要问的

1. **psd2live 我已经读过源码了。** #1155 要求读源码，我读了它的 `NinePoseFaceRig.kt` 和两三个文件，调研报告里也描述了它的思路。现在的红线是「不看着代码改写」。我的处理：puppet 里不实现任何出自它的东西；「四个角加一项 `yaw × pitch`」是一般数学，如果以后要用，由没读过它的人（或 agent）按数学定义独立写。这样够不够，请定。
2. **切换组的淡入公式。** 我在 Cubism 框架的 `cubismpose.ts` 里读到了具体的折线和 0.15 这个阈值。按红线不搬。打算：新层线性淡入；旧层保持不透明直到新层完全盖住再撤（先上后下）——这是从「切换途中不许露出背后」这个要求直接推出来的，不需要它的常数。请确认这样算「只用概念」。
3. **数字能不能用。** 官方样例的 physics3.json 里的输入权重（60 / 60 / 40 / 40）、摆长范围，是我们自己解析可读 json 量出来的。我的理解是「量出来的数」可以当默认值的参考；如果不放心，就改用 iki 和 Inochi2D 的默认值（许可没有问题），效果差别应该不大【未验】。
4. **Aka 模型的统计**（CC BY 4.0，作者 seagetch）只在调研文档里引用，已署名。puppet 里不放它的任何文件。

---

## c. 角色数据包

一个角色 = 一个目录。统一现在散在五处的东西：W1 的 `views.json`、W2 的 `hair.json`、W4 的 `rig.json` 和 `poses.json`、W5 的身体部件表（目前没有成形的 `body.json`，身体数据在 `rig.json` 里）、W3 的表情预设。

```
characters/<id>/
  character.json     清单：画布、参数、族、切换组、物理、挂点、指向其它文件
  parts.json         全部部件（头、发、身体、饰品）：贴图、层序、深度、网格、关键形
  views.json         多视图套：每档的原画、实测角度、特征点
  poses.json         姿势库：A 类（手臂层）/ B 类（整张立绘）
  expressions.json   表情预设（参数组合 + 漫符）
  provenance.json    每张图哪来的：母版、提示词、步数、配准量、实测角度
  tex/               贴图（部件图、权重图、姿势图）
  qa/                这个角色的检查报告和检查图
```

### 坐标和单位

- 画布像素，原点左上，y 向下（和现在所有素材一致）。
- `unit.R` = 半脸宽（像素），`unit.hh` = 眼睛那一行到下巴尖（像素）。所有「多远」的规则用这两个单位，换角色不用改数。
- 左右：`L` / `R` 指**角色自己的**左右（和 Cubism、iki 一致）。现在的 `rig.json` 里 `L` 是画面左，迁移时要翻过来——这是一个容易出错的点，迁移脚本里做断言。
- 角度参数的正方向照 Cubism：`ParamAngleX` 正 = 脸转向画面右；`ParamAngleZ` 正 = 头顶倒向画面右。

### schema（类型写法；机器可查的 JSON Schema 在 M1 放进 `schema/`）

```ts
// character.json
interface Character {
  version: 1;
  id: string;                       // "beret-girl"
  name: string;
  canvas: { width: number; height: number };
  unit: { R: number; hh: number; headCenter: [number, number]; neckPivot: [number, number] };
  parameters: Parameter[];
  families: Family[];               // 一族部件共用一个变形格（眼、眉、嘴…）
  poseGroups: PoseGroup[];          // 互斥部件组
  physics: PhysicsRig[];
  anchors: Record<string, Anchor>;  // 挂点：face、headTop、cheekL…
  overlays: OverlayLayer[];         // 叠加层在层序里的位置
  files: { parts: string; views?: string; poses?: string; expressions?: string; provenance?: string };
}
interface Parameter { id: string; min: number; max: number; default: number;
  kind?: "input" | "physics";       // physics = 只由物理写
  degreesPerUnit?: number; }        // 参数 1 等于多少度（参数刻度不一定是角度）
interface Family { id: string; grid?: { cols: number; rows: number; rect: [number, number, number, number] } }
interface PoseGroup { id: string; parts: string[]; fadeIn: number }      // 秒
interface PhysicsRig { id: string; model: "spring" | "chain";
  inputs: { parameter: string; weight: number }[];
  output: { parameter: string; scale: number };
  mass: number; stiffness: number; damping: number; segments?: number }
interface Anchor { part?: string; at: [number, number] }                 // 跟着哪个部件走
interface OverlayLayer { id: "back" | "face" | "top"; order: number; clipTo?: string }

// parts.json
interface Part {
  id: string;
  family?: string;                  // 属于哪一族；没有就自己动
  group: "head" | "body" | string;  // 挂在哪个刚体上
  texture: string;                  // tex/ 下的文件
  rect: [number, number, number, number];   // 在画布上的位置
  order: number;                    // 层序，小的先画
  orderKeys?: { parameter: string; at: number; order: number }[];   // 层序随参数变
  depth: number;                    // 以 R 为 1，朝镜头为正。默认行为只靠它
  depthY?: number;                  // 点头用的深度；不写就等于 depth
  weight?: string;                  // 权重图（发根 1 → 发梢 0），物理和附着用
  pivot?: [number, number];
  mesh?: { preset: string } | { vertices: number[]; uvs: number[]; triangles: number[] };
  keyforms?: Keyform[];             // 稀疏：只在需要校正的格点上有
  textureSets?: { view: string; texture: string; rect: [number, number, number, number] }[];
  mask?: { by: string[]; invert?: boolean };
  visibleWhen?: Record<string, [number, number]>;
  physics?: string;                 // 由哪条物理的输出参数带动
  holesAllowed?: boolean;           // 默认 false：内部不许有透明洞
}
interface Keyform { at: Record<string, number>;      // { ParamAngleX: -30, ParamAngleY: 0 }
  translate?: [number, number]; scale?: [number, number]; rotate?: number;
  offsets?: number[] }              // 网格顶点位移；和 translate 等可以并存

// views.json
interface Views { landmarkNames: string[];
  views: { id: string; tier: number; image: string;
    yaw: { measured: number; range: [number, number]; how: string };
    registration: { scale: number; translate: [number, number] };
    landmarks: Record<string, [number, number, boolean]>;        // x, y, 是否可见
    usedFor: { yawRange: [number, number]; mirrorForNegative?: boolean } }[] }

// poses.json
interface Pose { id: string; kind: "A" | "B";
  arms?: string; over?: string;     // A 类：手臂层、盖在头前面的那一层
  full?: string; fullOver?: string; handMask?: string;      // B 类：整张立绘
  headYawMax: number;               // 这个姿势下头最多能转多少
  registration?: { scale: number; translate: [number, number] };
  proportions?: Record<string, number>;       // 比例筛的结果
  accepted: boolean }

// expressions.json
interface Expression { id: string; label: string;
  params: Record<string, number | { add?: number; multiply?: number; set?: number }>;
  emotes?: { name: string; layer: "face" | "top" | "back"; side?: "L" | "R" }[];
  disabled?: boolean }
```

和现有文件的对应：

| 现在 | 进数据包后 |
| --- | --- |
| `views.json` 的 `views[*].landmarks`、`angle_eye_ratio`、`scale_applied` | `views.json` 的 `landmarks`、`yaw.measured`、`registration` |
| `hair.json` 的 `pieces[*].z / depth / rect / weight / anchor / axis / behind_face / inner_holes` | `parts.json` 里每片一个部件：`order / depth / rect / weight / pivot`；`behind_face` 变成层序；`inner_holes` 变成检查项 |
| `rig.json` 的 `parts[*].rect / group / depth`、`eyes`、`head` | `parts.json` + `character.json` 的 `unit`、`families` |
| `poses.json`（kit）的 `arms / over / headYawMax / kind / full / handmask` | `poses.json`，字段基本照搬 |
| `chibi-emotes.js` 的 `PRESETS`、`DISABLED` | `expressions.json`（库本身留在 `emotes/`，数据包里只存这个角色启用哪些、参数怎么配） |

参数名（向 Cubism 对齐）：`ParamAngleX/Y/Z`、`ParamBodyAngleX/Y/Z`、`ParamEyeLOpen`、`ParamEyeROpen`、`ParamEyeBallX/Y`、`ParamBrowLY`、`ParamBrowRY`、`ParamBrowLAngle`、`ParamBrowRAngle`、`ParamMouthOpenY`、`ParamMouthForm`、`ParamCheek`、`ParamBreath`、`ParamHairFront`、`ParamHairSide`、`ParamHairBack`（物理输出）。切换组叫 `poseGroups`。

最小样例：`characters/_example/`（一张脸、一只眼的三个部件、一片头发，一条弹簧，一个切换组）。

### 补充（W4 审过 c 节后提的，总管裁定全部采纳，2026-10-07）

都是 `host-pose.js` 现在实际在用、上面的 schema 装不下的：

| # | 内容 | 落到哪 |
| --- | --- | --- |
| 1 | B 类姿势要有「这张整图里头的位姿」（头部坐标 → 整图的仿射，含倾角） | `Pose.headTransform: { L: [a,b,c,d], T: [tx,ty] }` |
| 2 | 每个姿势对部件的显隐覆盖（捂嘴不画嘴；整图只画眼、嘴和脸层） | `Pose.hideSlots: string[]`、`Pose.onlySlots: string[]`（槽位见 `character.json` 的 `slots`） |
| 3 | 姿势图层自己的坐标（现在是「角色画布 ÷ 2 的整幅图」，换分辨率会错位） | 每张姿势图带 `rect` 和 `textureScale` |
| 4 | 层序不靠字段名约定 | 姿势的每一层写 `order`（手臂层在领子之上、头之下；盖层在头之上） |
| 5 | `headYawMax` 的单位 | **参数单位**（按多角度那条参数轴走），不用度 |
| 6 | 来源和检查 | `Pose.source`（哪张图、步数、种子、方法 = 文字 / 涂抹 / 人偶）、`polys`（手工圈的多边形，重烘焙要用）、`rejectedReason`；`proportions` 里只有「头」和「领口到裙摆」可信 |
| 7 | 旧名映射（pointL / pointR → present、clasp → fist） | 放适配层，不进数据包 |
| 8 | 最上层要能在手和手臂处挖掉 | `OverlayLayer.punchBy: "poseHands"`（A 类用盖层的透明度，B 类用手遮罩） |
| 9 | 姿势切换不是淡入：硬切 + 预备 1 帧下压 + 换图帧上弹 2% + 3 帧落定 + 头的小惯性，按帧算的纯函数 | `PoseGroup.transition: "cut-bounce" \| "fade"`；弹动的参数放适配层 |
| 10 | `createHost` 的 state 字段和默认行为（朝向内容、句尾回看镜头、分句点头、每句换重心、眨眼表） | 以 `host-pose.js` 顶部注释为准，适配层保留 |
| 11 | 两个画布：头部母版 1408²、身体母版 1104×1472（= 角色坐标 ÷ 2）；角色坐标 = 头部像素 + (390, 136) | `canvas` 定成角色坐标（2208×2944），`unit.headMasterOrigin` 记偏移——**已实现** |
| 12 | 左右翻成角色自己的左右；但姿势里的 `stage` 侧、`look`、`headYaw` 的正方向是画面方向，不翻 | 转换脚本里只翻部件 id——**已实现** |

### 现在已经做出来的（冲刺版，和上面的设计有出入的地方）

- 数据包里多了几样设计时没写的：`turn`（哪个参数驱动按深度的平移）、`groups`（刚体组：支点 + 随参数线性的平移 / 旋转 / 缩放）、`slots`（宿主整组藏掉或替换的部件）、`mouthShapes`、`kit/`（姿势库目录的快照）。
- 部件的 `mesh` 目前只有规则网格（`{ grid: [列, 行] }`）和显式顶点两种；`visibleWhen` 用来在四张嘴里取一张。
- 眨眼、笑眼、睁大、视线、瞳孔缩放、眉的升降和倾斜、口型，都由导入脚本从旧 rig 的逐顶点公式烘成关键形（`tools/import_proto_b.py`）。
- 物理、贴图套切换、层序随参数变（`orderKeys` 写了但没用到）、JSON Schema：都还没做。


---

## d. 新角色怎么生成

**输入**：一张设定图 + 一个小的设定文件（`brief.json`）：

```json
{ "id": "new-girl", "hair": "齐肩短发，右侧一缕挑染", "asymmetric": ["左侧发卡", "贝雷帽偏右"],
  "palette": { "hair": "#bfeee0", "skin": "#fbe3d3", "line": "#1a2238" }, "headBodyRatio": 2.2 }
```

**输出**：`characters/<id>/` 数据包 + 一段自检演示片（转头、点头、眨眼、每个表情、每个姿势各过一遍）。

下面的命令是设计，还没有实现【未验】。「来自」一列是现有的哪个脚本会被搬进来。

| 步 | 命令 | 做什么 | 产物 | 自动检查 | 人看吗 | 来自 |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `puppet new <id> --ref 图 --brief brief.json` | 建目录，登记输入 | 空数据包 | 文件齐全 | 否 | 新 |
| 1 | `pipeline/01_master` | 母版规范化：正面、A 字站姿、纯色底、40 步定稿；头单独出一张高分辨率头部母版 | `source/master.png`、`head_master.png` | 左右对称度；五官特征点能检出；配色与 brief 的差 | **看一次（这是唯一的源头）** | `gen/01_masters.sh` |
| 2 | `pipeline/02_split` | 拆层：See-through 粗拆 → 按清单细拆（头发 ≥ 15 片；眼睛 5 层；帽子、饰品各自成层） | 每个部件一张透明图 + 清单 | 叠回去和母版的差；层边缘无背景色；片数达标 | 否 | `gen/05_split_head.py`、`hair/01–03`、`proto-seethrough` |
| 3 | `pipeline/03_inpaint` | 补被挡的区域：**每个部件单独出一张完整无遮挡的图** | 补全后的部件图 | 部件内部无透明洞（高光不许被抠成洞）；补的部分与原部分的接缝色差 | 否 | `hair/04_headonly.sh`、`gen/23_paint_*` |
| 4 | `puppet measure` | 量几何：包围盒、每行不透明段、下巴线、R 和 hh | `unit`、部件矩形 | 眼睛、嘴在脸的范围内；左右标注没反 | 否 | iki 的量法 |
| 5 | `puppet depth` | 给每个部件定深度（按族的默认表起步） | `parts.json` 的 depth | 深度排序符合「鼻 > 嘴眉 > 眼 > 脸 > 前发 > 侧发 > 后发」 | 否 | W5 深度表、`hair.json` |
| 6 | `qa/shift-test` | 错位测试：只用线性平移出 ±30° 一排图，品红底 | 检查图 + 露底像素数 | 露底像素为 0；相邻层不开缝 | **看一眼** | `gen/24_head_layers_test.py` |
| 7 | `pipeline/07_views` | 出多角度原画：轻微、3/4、正侧三档，先 8 步草稿筛，再 40 步 | 三档原画 | **实测角度**（虹膜宽比）在目标范围内；配色对齐；配准后的下巴、帽顶位置 | **看（好不好看、是不是同一个人）** | `gen/15_quarter_views.sh`、`gen/turnaround/`、`views/` |
| 8 | `puppet landmarks` | 各档标同一套 34 个特征点 | `views.json` | 点数齐；可见性合理；轨迹单调 | **看一眼**（目前是人工读点） | W1 的做法 |
| 9 | `puppet fit` | 用特征点校准深度；平移不够的部件生成稀疏关键形；登记大角度用哪套贴图 | 更新的 `parts.json` | 重投影误差低于阈值；格子不翻面 | 否 | 新 |
| 10 | `puppet rig` | 铺网格；生成眨眼、视线、口型的关键形；头发物理分组 | 完整的 `parts.json`、`physics` | 无翻面三角形；闭眼时眼白高度为 0 | 否 | iki 的生成器、Inochi Creator 的铺网格 |
| 11 | `pipeline/11_poses` | 姿势库：每个姿势先出草稿，过比例筛，再定稿；手臂整条画，配准到肩 | 姿势图 + `poses.json` | 比例筛（头身比、肩宽、手的大小）；手部扫描（手指数、缺失）；肩部接缝误差 | **看（手对不对）** | `gen/13–23`、`22_sieve.py`、`hand_scan.mjs`、`19_pose_kit.py` |
| 12 | `puppet expressions` | 从表情库挑预设，配这个角色的参数 | `expressions.json` | 每个预设出一格，符号不压五官 | **看一眼** | `chibi-emotes.js` |
| 13 | `puppet check` | 整包检查 | `qa/report.json` | schema 校验；贴图都在；左右断言；洋葱皮图；转头序列的特征点轨迹平滑 | 否 | 各处的检查脚本 |
| 14 | `puppet demo` | 渲自检演示片，两遍 | `qa/demo.mp4` | 两遍逐帧 md5 一致 | **看一遍成片** | `tools/render/render.mjs`、W3 的 md5 脚本 |

必须人看的一共 **7 处**：1（母版）、6（错位图）、7（多角度原画）、8（特征点）、11（姿势的手）、12（表情）、14（成片）。其中 6、8、12 是「看一眼」。别的步骤靠自动检查过关。

### 硬规则（今天和之前踩过的坑）

素材：

1. **只从 40 步定稿母版派生**，不链式改图。
2. **每个部件单独出一张完整无遮挡的图。** 被挡住的部分要补出来，不能留洞。
3. **部件要拆得细**：头发至少按「后发中 / 后侧 / 内层 / 侧发 / 鬓角 / 刘海各片 / 呆毛」分，贝雷帽女孩是 19 片。这是「默认线性平移」成立的前提；拆不细，转头就露底。
4. **局部涂掉再补，比单独补更听话。** 要改哪里就把哪里涂掉让它补。
5. **头发内部的高光不许抠成洞。** 检查项：部件内部不允许有透明连通域（`holesAllowed` 默认 false）。
6. 背面和侧面的东西**不许用正面部件镜像**。
7. 改图会平移缩放画面（实测 0.88–1.06 倍）：**所有派生图先配准再用**，配准量记进 `provenance.json`。
8. 配色：派生图按母版分区对齐颜色。

角度：

9. **生图的角度靠实测。** 提示词写的度数不算数；每张按角度生成的图都要量出实际角度再入库，量不准的不用。文件名用档位（v1 轻微、v2 3/4、v3 正侧），不用度数。
10. **关键形以原画为准。** Q 版 3/4 侧脸是画法约定，不是球面旋转；规则算出来的和原画不一致时，听原画的。
11. ±30° 以内不换图；超过了才换贴图套。

姿势和手：

12. **手不拆骨骼，每个姿势整条画。**
13. **手靠近头的姿势，先出草稿筛比例**，过了再出定稿。
14. 每个姿势登记 `headYawMax`：手碰着头的时候头不能乱转。

运行时：

15. 画面是 t 的纯函数：不读时钟、不用随机数；物理固定步长，从 0 重放。
16. 屏幕上的符号和文字不压在五官上；贴脸的符号走脸层（在刘海下面）。
17. 每次改素材之后重渲两遍比 md5；渲染期间素材被改过的那一遍作废。

---

## e. 迁移计划

### 引擎核心：W3 和 W4 怎么分

W4 准备写的「不认部件名、直接读 `hair.json` / `views.json` 的数据驱动头部渲染」和引擎核心是同一件事。分法（按总管的倾向）：

- **W3 写引擎核心**：参数、部件、关键形混合、层序、物理、渲染后端。W4 的 `24_head_layers_test.py` 是第一个验收样例——引擎在同样的输入下，要逐像素复现它的 ±30° 那一排图（允许抗锯齿带来的小差异，定一个阈值）。
- **W4 负责数据和姿势库**：把贝雷帽女孩的数据包填满（深度表、层序、19 片头发接进来、三档原画的关键形）；姿势烘焙脚本搬进 `pipeline/`；`createHost` 的接口由它定，W3 在 `adapters/host.js` 里实现。
- **接口就是数据包格式（c 节）加下面这几个函数**，先定死，两边各写各的：

```js
const p = await createPuppet(packUrl, { canvas });   // 读 character.json 及其指向的文件
p.set(params);                 // { ParamAngleX: 12, ParamEyeLOpen: 0.3, ... }
p.setPose(id, k);              // 切换组 / 姿势，k = 0…1 的进度
p.step(t);                     // 物理推进到 t（内部从最近的检查点重放）
const frame = p.evaluate();    // 每个部件的顶点、贴图、不透明度、层序（纯数据，可以拿去检查）
p.draw(ctx2d, placement);      // 画到宿主的 2D 画布上
p.anchors();                   // { face: 矩阵, headBox, top: [x,y], ... } 给漫符用
p.layer("face" | "top" | "back");   // 叠加层的 2D 画布
```

  W4 在引擎出来之前要验证数据，可以先用 `evaluate()` 的参考实现（就是它那个 Python 脚本的逻辑），格式对得上就行。

### 逐项

| 现有的东西 | 谁的 | 怎么处理 | 进哪 | 谁搬 |
| --- | --- | --- | --- | --- |
| `proto-b/rig/host-pose.js`（姿势差分版讲解员） | W4 | 接口保留；内部的头换成引擎。姿势切换逻辑搬进 `engine/groups.js` | `adapters/host.js` | W3 写适配，W4 审接口 |
| `proto-b/rig/chibi-morph.js`（代理椭球形变） | W4 | **不搬**。旧做法。里面的 `keys / mix / blinkAt` 小工具和弹簧脉冲响应的思路搬进 `engine/drivers.js` | — | W3 |
| `proto-b/gen/24_head_layers_test.py` | W4 | 变成 `qa/shift-test` 和引擎的验收样例 | `qa/` | W4 |
| `proto-b/gen/17_poseswap_bake.py`、`19_pose_kit.py`、`20_pose_full.py`（姿势烘焙） | W4 | 参数化后原样搬 | `pipeline/11_poses/` | W4 |
| `proto-b/gen/22_sieve.py`、`hand_scan.mjs`、`hand_report.py`、`switch_check.mjs`、`dpr_check.mjs` | W4 | 原样搬 | `qa/` | W4 |
| `proto-b/gen/01–16`（母版、拆头、拆身体、配准） | W4 | 去掉写死的路径和坐标后搬 | `pipeline/01–07` | W4（M4 之前） |
| `proto-b/hair/01–04`（19 片头发的拆分）+ `hair.json` | W2 | 脚本搬；`hair.json` 由转换脚本并进 `parts.json` | `pipeline/02_split/`、数据包 | W2 搬脚本，W3 写转换 |
| `proto-b/views/` + `views.json` + `gen/turnaround/measure.py` | W1 | 数据进数据包；量角度的脚本搬 | 数据包、`pipeline/07_views/` | W1 搬，W3 写转换 |
| `proto-seethrough/`（See-through 的安装和调用脚本） | W5 | 当外部工具；只搬调用它的薄封装 | `pipeline/02_split/` | W5 |
| 身体部件表（目前在 `rig.json` 里） | W5 / W4 | 并进 `parts.json`（`group: "body"`） | 数据包 | W5 |
| `assets/lib/chibi-emotes.js` + 演示页 | W3 | 原样搬；预设表拆一份进 `expressions.json` | `emotes/` | W3 |
| `proto-b/emotes-test.html` | W3 | 改成读数据包 | `qa/` | W3 |
| `proto-b/tools/build-review.mjs` | W3 | 原样搬 | `review/` | W3 |
| `proto-l2d/` 的确定性经验（固定步长重放、两遍 md5） | W5 | 重写进 `engine/physics.js` 和 `qa/` | — | W3 |
| `tools/render/render.mjs` | 共享 | 不动，继续用 | — | — |
| `proto-b/rig/host3d.js`、`chibi3d.js`、`chibi-rig*.js`、`proto/`（VRM）、`proto-c/` | 各人 | **不搬**，留在原处当历史 | — | — |

在总管点头之前，上面的一切都只是计划：不改任何人的文件，原文件迁移后也先不删，等 M3 通过再归档。

### 顺序

1. 定数据包格式（本文 c 节）→ 总管和 W4 确认。
2. W3 写三个转换脚本（`rig.json`、`hair.json`、`views.json` → 数据包），产出 `characters/beret-girl/` 的第一版。
3. W3 写引擎 M1；同时 W4 继续用自己的验证脚本调深度表。
4. 之后按里程碑。

---

## f. 里程碑

每个里程碑的验收都是可以跑出来看的东西。

**M1 引擎最小可用**（参数 + 默认线性平移 + 关键形混合 + 层序 + 叠加层）

- `characters/beret-girl/` 第一版能通过 schema 校验。
- 引擎读它，出 ±30° 每 10° 一排图，和 W4 的 `wip-head-layers-shift.png` 逐格比：差异像素比例低于定好的阈值（先定 0.5%，看实际再调）。
- 关键形混合的单元测试：3×3 格只填 3 个点，补格结果和手算一致；填满时退化成普通双线性。
- 叠加层：`chibi-emotes` 的一个贴脸预设和一个头顶预设画在对的位置（截图）。
- 一段 4 秒转头片渲两遍，逐帧 md5 一致。
- 引擎源码里搜不到任何部件名。

**M2 接进 19 片头发和三档关键形**

- 19 片头发各自成部件，带权重图；六组物理带着摆；从 0 重放和中途 seek 的结果一致（任取 5 个时间点比）。
- 三档原画接进来：0 → 轻微 → 3/4 的转头片，特征点的屏幕位置和 `views.json` 里的读数之差低于阈值（先定 R 的 5%）。
- 贴图套切换有交叉淡化；切换点前后两帧的差异图里没有整块跳变。
- 洋葱皮图：34 个特征点的轨迹单调、平滑。
- 层序随参数变至少有一处在用，并且有图说明它为什么需要。

**M3 姿势库和表情库接入，ep09 能直接换用**

- `adapters/host.js` 实现现在 `host-pose.js` 的全部接口；`emotes-test.html` 不改调用代码就能跑。
- 现有姿势（idle、think、headhold、shrug）全部可切换，切换途中不露出背后（逐帧扫描露底像素）。
- 30 个表情预设的总表重渲，和现在的总表并排，没有变差的格子（人看）。
- ep09 的 `index.html` 加一个 `?host=puppet`，整片渲得出来；`tools/check.mjs` 的节奏检查照过。
- 两遍 md5 一致。

**M4 第二个角色走一遍流水线**

- 用一张新的设定图，按 d 节从第 0 步走到第 14 步。
- 记录：每一步花了多久、哪几步卡住、人实际看了几次、重做了几次。
- 产出第二个数据包和它的自检演示片。
- 通过标准：引擎代码零改动；流水线脚本里没有针对这个角色的特判；人看的次数不超过 d 节列的 7 处（超了就写明为什么，并把那一步的自动检查补上）。
- 流程文档按实际走的结果改一版。

---

## 没验证的、我不确定的

- d 节的命令都还不存在；步骤 9（用特征点自动拟合深度和生成关键形）是全新的，没有任何原型。这是整条线上技术风险最大的一步。
- 「引擎复现 W4 的平移图」的阈值是拍的数。
- 自动补格在我们的数据上好不好用没试过；Inochi2D 的模型是人摆的关键形，我们的是从原画拟合的，噪声更大。
- WebGL2 软件渲染下两遍一致，只在 iki 的着色器上验过；自己的后端要重新验。
- iki 的生成器移植过来以后，「把写死的 25 个角色名换成读族」的改动量我只看了结构，没逐个函数估过；`fields.ts` 有 1230 行，里面和前发 / 后发几何耦合的部分（帽檐、鬓角的规则）可能大半用不上。
- 特征点目前是人工读的（W1）。要让 M4 的「人看 7 处」成立，这一步需要自动化或半自动化，方案还没有。
- 身体怎么动（转身、重心）本文几乎没涉及：先把头做对。
