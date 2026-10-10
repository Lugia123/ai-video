# 第三方来源与许可

状态：2026-10-07。puppet/ 里目前**没有逐行移植来的代码**；有两处是读懂别人的算法后重写的、一处参考了别人的做法，登记在最下面的表里。

- 来源仓库与 commit 号：`third_party/SOURCES.json`
- 许可证原文：`third_party/licenses/`
- 逐模块的借用方式：`ARCHITECTURE.md` b 节

## 可以移植代码的

| 项目 | 许可 | 版权声明 | 许可证原文 |
| --- | --- | --- | --- |
| [iki](https://github.com/zeikar/iki) | MIT | Copyright (c) 2026 Zeikar | `licenses/iki-MIT.txt` |
| [Inochi2D](https://github.com/Inochi2D/inochi2d)（v0.8.7） | BSD-2-Clause | Copyright (c) 2020, Inochi2D Project | `licenses/inochi2d-BSD-2-Clause.txt` |
| [Inochi Creator](https://github.com/Inochi2D/inochi-creator) | BSD-2-Clause | Copyright (c) 2020-2023, Inochi2D Project | `licenses/inochi-creator-BSD-2-Clause.txt` |
| [nijilive](https://github.com/nijigenerate/nijilive) | BSD-2-Clause | Copyright (c) 2020, Inochi2D Project | `licenses/nijilive-BSD-2-Clause.txt` |
| [mesh-avatar-studio](https://github.com/shinshin86/mesh-avatar-studio) | MIT | Copyright (c) 2026 Yuki Shindo | `licenses/mesh-avatar-studio-MIT.txt` |
| [img2rig](https://github.com/SSnemo/img2rig) | Apache-2.0 | Copyright 2026 img2rig contributors | `licenses/img2rig-Apache-2.0.txt`、`img2rig-NOTICE.txt` |
| [See-through](https://github.com/shitagaki-lab/see-through) | Apache-2.0 | 见其 LICENSE | `licenses/see-through-Apache-2.0.txt`（只当外部工具调用，不移植代码） |

规则：

- MIT、BSD-2：移植的文件头保留原版权声明和许可声明，并写一行「改写自 <项目> <文件> @ <commit>」。
- Apache-2.0：除上面之外，文件头还要写明我们改了什么；保留其 NOTICE。
- 「照算法重写」的文件：文件头写出处（项目、文件、函数、commit），同样保留原许可声明。

## 不移植的

| 项目 | 许可 | 处理 |
| --- | --- | --- |
| psd2live | GPL-3.0 | 不移植，不看着代码改写。**调研时读过它的源码（2026-10-07，#1155），未借用任何代码**；puppet 里不实现任何出自它的东西 |
| Cubism Web Framework | Live2D Open Software License（Core 另为专有许可） | 不移植；只用公开的概念和我们自己量的数 |
| Spine 运行时 | Spine Runtimes License | 不移植 |
| Live2D 官方样例模型（Natori、Mao） | 官方样例条款 | 文件不进项目、不外发 |
| Inochi2D 示例模型 Aka | CC BY 4.0（作者 seagetch） | 文件不进项目；调研文档里引用的统计数字已署名 |

## 逐文件登记

| 我们的文件 | 来源项目 · 文件 · commit | 方式 | 改动 |
| --- | --- | --- | --- |
| `engine/blend.js` | Inochi2D · `source/inochi2d/core/param/binding.d`（fillBlanks、interpolate1D2D、extrapolateCorners、extendAndIntersect、interpolateLinear）@ e2235f6f2968（v0.8.7） | 照算法重写（D → JS） | 数据结构换成扁平数组；按「用到哪几个参数」分组成多张格并相加；静止格点缺省为零 |
| `engine/params.js` | iki · `packages/engine/src/parameter-store.ts` @ e93ca7dd9c71 | 参考做法，代码重写 | 只保留范围夹取和默认值 |
| `engine/render-webgl.js` | iki · `packages/engine/src/player.ts` @ e93ca7dd9c71 | 参考做法（预乘透明度管线、模板遮罩两遍画），代码重写 | 不含渲染循环；画布尺寸由调用方定；遮罩支持反向 |

物理的默认值以后用 iki / Inochi2D 的默认值起步；官方样例里量出来的数字只做交叉核对，不写进代码和默认配置（总管 2026-10-07 定）。
