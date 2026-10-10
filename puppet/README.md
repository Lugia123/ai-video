# puppet

可动角色的生产线：给一张角色设定图，产出一个会转头、有表情、有姿势库的角色数据包，并按时间 t 逐帧确定性地出画面。项目名是暂定的。

状态（2026-10-07）：引擎、讲解员、表情库、第一个角色（贝雷帽女孩）和一套回归检查能用；素材流水线还在从试验目录往里搬，「从设定图生成新角色」的完整流程还没走通过。哪些做了、哪些没做见最后一节。

下面的命令都在 **puppet 目录里**运行。

## 前提

- Node.js ≥ 20
- Python 3，带 Pillow、numpy、scipy（回归检查和几个出图工具用）
- ffmpeg（合成视频、抽帧）
- 中文字体：演示页的说明文字用系统的苹方 / 黑体；出检查图的脚本会自己找系统中文字体，找不到时用环境变量 `PUPPET_FONT` 指定一个字体文件（都没有也能出图，只是中文标注显示不出来）。角色本身不依赖字体

## 装依赖

```bash
npm install                 # 只有一个依赖：playwright（版本锁在 package.json）
pip install -r requirements.txt   # 回归检查和出图工具用
npx playwright install chromium
```

## 校验数据包

```bash
node tools/check_pack.mjs characters/beret-girl
```

查结构和文件：json 能读、必需字段齐、每张被引用的贴图和姿势图都在、槽位 / 遮罩 / 挂点引用的部件存在。不看图。

## 单元测试

```bash
npm test                    # 关键形混合和自动补格
```

## 渲演示片

```bash
node tools/render.mjs qa --page demo.html                 # → qa/out/demo.mp4
node tools/render.mjs qa --page demo.html --keep-frames   # 另外留下逐帧 PNG：qa/out/frames-demo/
```

演示片约 30 秒：待机朝内容说话 → 掌心示意 → 抵下巴问号 → 摊手无语 → 捂嘴被吓到 → 举手感叹号 → 叉腰得意 → 握拳认真 → 挥手开心。

确定性自查（渲两遍，逐帧比）：

```bash
node tools/render.mjs qa --page demo.html --keep-frames && python3 tools/md5_frames.py qa/out/frames-demo > /tmp/a.txt
node tools/render.mjs qa --page demo.html --keep-frames && python3 tools/md5_frames.py qa/out/frames-demo /tmp/a.txt
```

第二条会打印「共多少帧、多少帧不同」，退出码 0 表示两遍完全一致。

## 回归检查

```bash
python3 qa/regress/run.py characters/beret-girl
```

出 `out/regress/beret-girl/report.md`：22 条自动判（脖子层序、帽檐不露肤色、帽子跟头转、呆毛接缝、眉形残留、发梢晕边、露底、手臂层偏绿、换姿势时身体没变、漫符不盖手、点头不削顶、换姿势间隔等）+ 还要人看图的条目清单。阈值和白名单在 `qa/regress/<角色>.json`；阈值有没有用坏样本标定过，见 `qa/regress/bad-samples/README.md`。

## 在自己的页面里用

```js
import { createHost } from './host/index.js';
const host = await createHost({ mount, timings, W: 1920, H: 1080, ground: 900, size: 760,
                                pack: new URL('./characters/beret-girl/', import.meta.url).href });
host.direct(t => ({ x: 1500, look: [600, 500], pose: { think: 1 } }));   // 导演脚本：t → 状态
host.draw(t);                                                              // 画第 t 秒
```

状态字段、叠加层和挂点的约定写在 `host/index.js` 顶部。只要头、不要身体：`engine/index.js` 的 `createPuppet(pack)`。

## 目录

| 目录 | 放什么 | 入口 |
| --- | --- | --- |
| `engine/` | 引擎：参数、按深度平移、关键形混合、层序、遮罩、WebGL2 后端。不认识任何部件名 | `index.js` |
| `host/` | 讲解员：默认行为、姿势切换、合成、把表情接进三个叠加层 | `index.js`、`emotes.js` |
| `emotes/` | 表情库：47 个漫符、30 个预设 | `chibi-emotes.js` |
| `characters/<id>/` | 角色数据包：`character.json`、`parts.json`、`tex/`、`kit/`（姿势库） | — |
| `qa/` | 检查页和回归检查 | `regress/run.py` |
| `tools/` | 渲染器、截图、校验、出检查图的小工具 | `render.mjs` |
| `pipeline/` | 素材流水线（从设定图到部件）。**搬迁中** | 各子目录的 README |
| `third_party/` | 借鉴的开源项目：commit 号、许可证原文 | `SOURCES.json` |

## 文档

- `ARCHITECTURE.md` — 设计：模块划分、每个模块借谁的、数据包格式、新角色生成流程（设计稿）、里程碑
- `CONSOLIDATION.md` — 整理成单独项目的清单和测试方案
- `THIRD_PARTY_NOTICES.md` — 第三方来源与许可

## 现在做到哪了

能用的：

- 引擎按数据包画头（29 个部件），转头 ±30°、点头 ±8°、歪头、眨眼、视线、口型、眉；两遍渲染逐帧一致
- 讲解员：10 个姿势，切换有预备 / 拖影 / 回弹；朝向内容、分句点头、眨眼
- 表情预设画在脸层（刘海下面）和最上层（不盖手）

还没有的：

- **从一张新设定图生成新角色**：流水线脚本还没搬完，没有合在一起跑过；多角度原画只做了数据，没接进引擎
- 物理（头发摆动）、大角度换贴图套、分层身体
- 数据包的 JSON Schema（现在只有 `tools/check_pack.mjs` 的结构校验）
- `tools/build_pack.py` 从来源素材目录生成数据包，但来源素材还没搬进本项目，而且它目前只认第一个角色的来源格式；贝雷帽女孩的数据包是它生成的
- 回归检查里「姿势 kit 逐手」那一条需要姿势的来源图，来源图还没进本项目（见 `qa/regress/beret-girl.json` 的 `poses.assets`）
