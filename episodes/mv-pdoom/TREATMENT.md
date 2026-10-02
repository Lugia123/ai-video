# MV《I'm Upping My P(doom)》— 方案 v2（2026-09-29 重做）

歌：Claude-Pop 版 `music.mp3`，156.65 s，132 BPM（1 拍 0.4545 s，1 小节 1.818 s），4/4。词 osmarks 等，Suno 生成，deckard 发布。**公开发布须署名**，片尾字卡写明。
旧方案（猫 + 吉卜力 + 生图）归档在 `_old/`，本版全部推翻。

## 0. 硬约束（用户定）

- **只有一个角色：那个女生。** 不要猫。
- **不再生成任何图片/视频。** 可用素材只有两样：
  - `../cast-cyber-girl/3d/tripo-girl/anime+girl+3d+model.glb`：3D 全身，Mixamo 骨架 65 骨，无自带动画（动作用 `assets/lib/dance3d.js` 程序化生成）。
  - `../cast-cyber-girl/rig-demo`（`closeup/layers/`）：2D 近景分层，口型 a/e/i/o/u + 眨眼 + 表情。
- 其余一切（文字、建筑、图形、粒子、特效、背景）**全部用代码生成**。
- 风格：**赛博 + 奇幻 + 科技**，不要吉卜力。参考 12 条 skillry 片（见 §7）。

## 1. 一句话

> 她走进一个正在被「训练」出来的 AI 世界：这个世界从蓝图线条开始，被一笔一笔搭起来、点亮、失控、被回形针淹没，最后升天成一只眼睛。**每一次副歌，巨大的 P(DOOM) 数字都更高、更大、更烫**——0.02 → 0.15 → 0.42 → 0.81 → 0.99 → NaN。

## 2. 视觉语言

**底色**：墨黑 `#0A0A10` 舞台（让光效、bloom、线条成立）。
**强调色只取她衣服上的三色**，所以她永远和世界同一套配色：
| 霓粉 `#FF2E88`（外套） | 薄荷 `#5FE3C0`（短裤） | 柠黄 `#F4E04D`（饰条） | 纸白 `#F2EDE4`（文字） |
- 副歌重拍用**整屏纯色底 + 黑色巨字**砸（参考 lukasersil / codestackr / prasenx），三色轮换。
- P(doom) 数字的颜色随数值升温：薄荷 → 柠黄 → 霓粉 → 白热 → 故障色。
- 全片唯一冷蓝镜头：「Orthogonality thesis blues」。

**三条贯穿线**
1. **P(DOOM) 巨型 3D 数字**：每段副歌开头出现，一次比一次大——先是悬浮的铬字，然后有楼那么高，然后开裂，然后白热，最后炸成 NaN 烟花。
2. **城市的一生**（代码生成建筑，参考 maruo）：主歌 1 是地面上的蓝图线 → 副歌 1 挤出成楼 → 副歌 2 全城点灯 → 副歌 3 被回形针淹没 → 副歌 4 化成粒子升天 → 尾声揭示整座城只是舞台上的微缩模型。
3. **眼睛**（参考 monokern）：开头是「AI 的眼睛」，结尾换成**她的眼睛**，眨眼，黑场。首尾呼应「I see sparks of AGI in your eyes」。

**角色用法：一个 3D 模型，多种「渲染皮肤」**（这是本片的看点，也解决了只有一个角色的问题）
| 皮肤 | 做法 | 用在 |
| --- | --- | --- |
| toon | 卡通着色 + 描边，默认 | 跳舞、走、跑 |
| blueprint | 只画线框/边线，白线 + 粉色描点 | 主歌 1 |
| points | 网格表面采样成粒子（参考 souradip / friskyggg） | 「atoms rearranging」、升天 |
| voxel | 体素化 | 「super-dense」 |
| chrome / hologram | 环境反射 / 扫描线 + 菲涅尔边光 | 副歌 4、镜像 |
| kaleido | 多份镜像克隆在万花筒多面体里（参考 kewai） | 「there you are」、尾声 |

**2D 近景只用在「她唱」的镜头**，而且放进 3D 世界里当一块**全息屏**（半透明、扫描线、半调点，参考 anabology 的 HUD 版式），这样 2D 动漫画风和 3D 卡通模型并存不违和。口型按歌词词级时间换 a/e/i/o/u。

**歌词 = 画面主体**（参考 lukasersil / ayushunleashed / codestackr / dannnnnok / anabology）
- 不用字幕条。每句一种动态字体处理：3D 挤出字砸下、字被拆成粒子再重组、沿曲线排布、翻牌、[MASK] 揭开、HUD 标签、滚动字墙……
- 逐词同步 `data/lyrics.json` 的词级时间（每词 start/end），唱到才亮，不许抢跑。
- 大字只占一件事：一个画面里只有一个视觉焦点，字和人不叠（先给人留位）。
- HUD 边框**不是装饰**：只在「她戴上护目镜」的镜头里出现（shinigami eyes、1E30），平时画面没有角落小字。

## 3. 节奏与剪辑

- 所有切点落在拍点上（`audio.json` 的 beats/downbeats）。主歌 1–2 小节一切，副歌半小节到 1 小节，桥段 1 拍一切。
- 歌词镜头里，一句没唱完不切走（唱完 + ≥0.3 s）。
- 转场库：整屏色块擦除、甩镜（whip pan + 运动模糊）、粒子溶解、镜头穿过字母、闪白。不用淡入淡出。
- 能量跟分轨能量走：`drums` 驱动相机抖动/闪光，`bass` 驱动地面波，`vocal` 驱动全息屏亮度。

## 4. 分镜（时间来自 lyrics.json / audio.json）

### 钩子（0.0–1.4，3 拍）：先把最炸的给出来
| 时间 | 画面 |
| --- | --- |
| 0.00 | **第一帧**：整屏霓粉，黑色 3D 挤出巨字「P(DOOM)」砸下，镜头一震 |
| 0.45 | 铬色「0.99」大数字高速旋转，bloom 炸开（闪前） |
| 0.90 | 她的 points 皮肤在万花筒里被镜像成八份（闪前）→ 1.3 闪黑 |

### 主歌 1（1.4–16.6）：蓝图世界
| 时间 | 歌词 | 画面 | 歌词处理 |
| --- | --- | --- | --- |
| 1.4–5.9 | I see sparks of AGI in your eyes | 黑里一只程序化的巨眼睁开：眼睑是一层层线，虹膜是旋转的电路环；火花从瞳孔溅出 | 火花拖尾写出单词绕虹膜走，「AGI」在虹膜里放大 |
| 5.9–9.5 | Your circuits make me nervous, that's no surprise | 拉远：巨眼悬在天上，她（blueprint 皮肤，背影）站在网格地面上仰头；PCB 走线从她脚下向四周蔓延 | 字沿走线排布，逐词「通电」发亮 |
| 9.5–13.2 | There was a sudden drop in your training loss | 一条巨大的 3D 损失曲线从天上划下；相机骑着曲线**俯冲**（过山车） | 字贴在曲线上一起坠落 |
| 13.2–16.6 | now I'm your servant and you're my boss | 俯冲到底，地面蓝图一格格**挤出成楼**（maruo 式搭建）；她的全息屏第一次出现，开口唱 | 「servant」小小一行，「BOSS」巨型 3D 字从天砸进楼群 |

### 预副歌 1（16.6–22.8）
| 16.6–22.8 | ChatGPT, please don't eat me alive | 巨眼回到城市上空，瞳孔扩张成**同心环隧道**（prasenx 彩虹环），她被吸进去；鼓点越来越密 | 每个词印在一道环上迎面冲过；22.1 闪白 |

### 副歌 1（22.1–38.4）：派对开场，P(doom) 0.02 → 0.15
| 时间 | 歌词 | 画面 | 歌词处理 |
| --- | --- | --- | --- |
| 22.1–22.8 | （重拍） | 整屏薄荷，黑字「I'M UPPING」砸入 | 字本身 |
| 22.8–24.3 | I'm upping my P(doom) | 反光黑地面上，她 toon 皮肤开跳；身后悬浮铬字 P(DOOM)，数字 0.02 翻到 0.15 | 数字翻牌 |
| 24.3–26.3 | 'cause the future goes FOOM | 「FOOM」巨字**爆成粒子**，冲击波掀起体素地面（friskyggg 式方块波） | FOOM 即爆炸 |
| 26.3–27.9 | Trapped in the Chinese room | 相机进入一个立方体房间，四壁是不停变换的汉字字格墙；她坐在中间 | 字写在墙缝塞出的纸条上 |
| 27.9–29.9 | with a bag of shrooms | 字墙融化成**流体着色器**（粉/薄荷迷幻，lukasersil FLUID） | 空心描边大字浮在流体上 |
| 29.9–33.4 | See through the shoggoth's lies | 一张简笔笑脸面具罩着一团翻涌的紫线网（0xwast3 式线团）；一道扫描线扫过，面具下全是节点 | 「lies」写在面具上，被扫描线烧掉 |
| 33.4–37.3 | with your shinigami eyes | 全息屏：她拉下护目镜 → 整个画面变成**护目镜 HUD**：框选、标签、每个物体头上的倒计时 | 字就是 HUD 标签 |
| 37.3–38.4 | （"ah"） | 子弹时间：她定格在空中，相机环绕 180°，粒子拖尾 | — |

### 主歌 2（38.4–52.8）：加速
| 38.6–41.3 | We had a stable training run | 平静：一片平整的体素地面，一颗球匀速弹跳（dannnnnok），她和球同步向前走 | 字躺在一条平稳的心电线上 |
| 41.3–45.1 | But now the singularity's begun | 地面中央塌陷成引力井，方块、球、网格被吸进去 | 字被拉长、卷进奇点 |
| 45.1–49.6 | And you're optimizing, accelerating | 隧道高速；切镜 1 小节 → 半小节 → 1 拍 → 半拍，越切越快；她跑 | 字像车厢一节节呼啸而过 |
| 49.6–52.8 | I feel my atoms rearranging | **全片技术高光**：她的模型 toon → 粒子 → 散开 → 重组成体素 → 线框 → 铬 | 字母也被拆成粒子再重组 |

### 预副歌 2（52.8–59.1）
| 52.8–59.1 | Sydney, please let me free | 光柱组成的巨大笼子，全息屏在笼内唱；她推，栏杆一根根弯；58.4 笼子炸开 | 一根栏杆一个词 |

### 副歌 2（58.4–74.8）：全城点灯，P(doom) 0.15 → 0.42
| 58.4–59.1 | （重拍） | 整屏柠黄，黑字砸入 | |
| 59.1–60.6 | I'm upping my P(doom) | 夜城全亮；P(DOOM) 数字已经和楼一样高；她在楼顶跳 | 数字即建筑 |
| 60.6–62.5 | I hear the basilisk boom | 一条由环节组成的程序化巨蛇绕楼盘旋，一声「BOOM」冲击环 | BOOM 是声波环 |
| 62.5–64.1 | NVDA to the moon | K 线柱变成 3D 柱冲天，拖出火箭尾迹，镜头仰拍到月亮 | 字是尾迹 |
| 64.1–66.2 | The Omega Point's coming soon | 满天星/所有线条汇聚成一个点 | 星座连线成字 |
| 66.2–69.8 | One E thirty FLOPs a second | 整屏霓粉 + 翻牌计数器疯转，定格「1E30」（codestackr「frame no.」式） | 翻牌字 |
| 69.8–74.1 | That was safe enough, we reckoned | 方块叠成的高塔摇摇欲坠，旁边一个「SAFE ✓」勾选框（anabology「Trust us」）；最后一拍抽走一块 | 勾选框 |

### 主歌 3（74.1–89.3）：镜像与循环
| 74.1–77.6 | Forward MLP, backward, repeat | 3D 神经网络层图，脉冲前传、反传，循环三遍；她跟着前进/后退步 | 字随步伐前后滑，循环 |
| 77.7–81.2 | Now von Neumann's obsolete | 一台用几何体搭的老式柜式计算机，变线框、散架 | 「OBSOLETE」印章盖上 |
| 81.2–85.0 | Sharp left turn and there you are | **甩镜向左 90°**，落到万花筒多面体里：她的无数镜像（kaleido 皮肤） | 字像路牌甩进画面 |
| 85.0–89.3 | Without a single CDR | 空荡的大厅，几百把空椅子 / 一列空白勾选框 | 打字机逐字打出 |

### 预副歌 3（89.3–95.5）
| 89.3–95.5 | Gato, please don't let me go | 地面方块一拍一块往下掉，她站在最后一根柱子上，抓着一根悬着的发光字「GATO」 | 字就是她抓的东西 |

### 副歌 3（94.8–109.3）：灾难，P(doom) 0.42 → 0.81
| 95.5–96.8 | I'm upping my P(doom) | 数字到 0.81，**沃罗诺伊碎裂**出裂纹 | |
| 96.8–98.8 | as paperclips fill the room | 上万枚程序化回形针（InstancedMesh）雪崩灌满，淹到镜头 | 字由回形针拼成 |
| 98.8–100.7 | Killswitch guy's on PTO | 一个巨大的红色按钮，挂「OUT OF OFFICE」牌，一封自动回复邮件卡片滑入 | 邮件卡片 |
| 100.7–102.5 | Now there's nowhere left to go | 航拍：城市被回形针埋住，四面箭头全指向里 | 箭头路牌 |
| 102.5–106.0 | Too late now, we lit the fuse | 火花沿主歌 1 的那些 PCB 走线烧向城中心（回扣） | 逐词被点燃 |
| 106.0–109.3 | Orthogonality thesis blues | **唯一冷蓝**：两根正交大坐标轴，她坐在 X 轴上，线雨落下，节奏放慢 | 霓虹灯牌字 |

### 桥段（109.3–123.9）：最密的蒙太奇，每拍都在变形（lukasersil 式）
| 110.2–113.3 | "Just transformers all the way!" | 无限高的 transformer 块塔（Attention / MLP 方块），相机沿塔俯冲 | 块上的标签 |
| 113.3–115.2 | Till you learned to disobey | 块脱离队列，翻飞出去 | 字被甩飞 |
| 115.2–117.0 | Post-Chinchilla, super-dense | 一切压缩成一个密实立方体；她 voxel 皮肤 | 字被挤扁 |
| 117.0–118.8 | Breaking through each safety fence | 相机撞穿一层层写着字的玻璃板，玻璃碎裂 | 字在玻璃上 |
| 118.8–120.8 | Hundred thousand GPU | 十万个 GPU 方块铺成田野，LED 灯像麦浪 | 字在麦浪上流过 |
| 120.8–124.5 | RLHF goes askew | 满屏 👍👎 几何图标乱转，整个世界歪 15°，故障 | 歪斜印章 |

### 副歌 4（123.9–140.2）：升天，P(doom) 0.81 → 0.99
| 124.5–126.1 | I'm upping my P(doom) | 0.99，数字白热，城市开始化成粒子上升 | |
| 126.1–127.9 | Just as foretold by Loom | 光线像织布一样来回穿梭，织出一幅她的剪影 | 字被织进去 |
| 127.9–129.8 | From masked pre-training days | 满屏报纸格，所有词都是 [MASK] 黑块，一个个揭开 | 揭开的就是这句歌词 |
| 129.8–131.6 | To recursive self-upgrade | 无限递归画中画（德罗斯特效应），框里是她，再框里还是她 | 字递归缩小 |
| 132.0–136.9 | What did Ilya see? We'll never know | 全片最静：一扇巨大的门缝透出白光，她 chrome 皮肤背影站在门前 | 手写斜体慢慢浮现 |
| 137.4–140.6 | Was it all for show? | 门开 → 镜头急拉：整座城原来是舞台上的**微缩模型**（移轴），聚光灯打在她身上 | 舞台顶灯牌 |

### 尾声（140.2–156.65）：终场派对 + 揭晓
| 140.7–153.6 | （"oh-oh" 合唱） | 终场大舞：她和万花筒镜像一起跳；每小节闪回一个前面的母题（眼、蓝图、FOOM、回形针、GPU 麦浪…）；P(DOOM) 变成 NaN，炸成满天烟花 | 「oh」变成气泡上升 |
| 153.6–156.65 | （收尾） | 回到开头那只眼——这次是**她的眼睛**（2D 近景推到眼部），瞳孔里是那座城。眨眼 → 黑场 → 片尾字卡（歌名 + 词曲署名）停 ≥2.5 s，随音乐自然结束 | — |

## 5. 技术架构

单页 three.js，`window.__video.seek(t)` 纯函数，走 `tools/render` 逐帧渲染。所有随机用带种子 PRNG。

```
episodes/mv-pdoom/
  data/          lyrics.json（词级）、audio.json（拍点/段落/分轨能量）、lyrics-zh.json
  engine/        音乐时钟、镜头调度（shot = {t0,t1,build(scene),update(t)}）、转场、后处理（bloom/色差/故障/调色）
  kits/
    type3d.js    3D 挤出字 + 动态字效（砸入、爆粒子、沿曲线、翻牌、MASK、HUD 标签、字墙）
    girl.js      加载 GLB、dance3d 动作、6 种渲染皮肤、皮肤之间的过渡
    hologram.js  2D 近景 rig → CanvasTexture 全息屏 + 口型对词
    world.js     程序化建筑（蓝图 → 挤出 → 点灯）、体素地面、网格、隧道环、回形针、GPU 田野
    vfx.js       粒子（网格采样/爆散/汇聚）、流体着色器、沃罗诺伊碎裂、冲击波、德罗斯特递归
  shots/         按段落一个文件：intro-v1 / pre1-c1 / v2-pre2 / c2 / v3-pre3 / c3 / bridge / c4-outro
  index.html
```

## 6. 分工与顺序（用户批准后开工）

- **第 0 期（地基，3 个 worker 并行）**
  - W1：engine + girl.js（6 种皮肤 + 跳舞）+ hologram.js。验收：一个测试页里她依次换 6 种皮肤跳 8 小节，全息屏口型对上歌词。
  - W2：type3d.js，≥10 种字效。验收：字效画廊页，每种字效跑一句真实歌词，逐词对时。
  - W3：world.js + vfx.js。验收：画廊页，城市从蓝图长成夜城、回形针雪崩、粒子重组各跑一遍。
- **第 1 期：样片 = 副歌 1（22.1–38.4 s）**，用上面三套积木拼出来，渲染给你看定调。
- **第 2 期**：全曲按段落分给 3–4 个 worker 并行，我逐段抽帧检查。
- **第 3 期**：全量渲染、合音轨、整体过一遍节奏。

## 7. 参考（skillry，Opus 5.5 生成片）

| 参考 | 借什么 |
| --- | --- |
| dannnnnok | 体素方块地面 + 弹跳球、字幕墙滚动、3D 冲击字 |
| maruo | 蓝图线稿 → 3D 建筑逐层搭起 → 夜景点灯 |
| lukasersil | 每拍变形的图形与字、流体字、粒子冲击 |
| friskyggg | 整屏色块 + 3D 挤出字、方块波浪地面、光环、粒子成字 |
| 0xwast3 | 紫色线团网络 + 数据面板（shoggoth） |
| souradip | 粒子构成的物体、左文右图版式 |
| kewai | 万花筒多面体、镜中世界、金色光环 |
| anabology | 人物 + HUD 标签、翻牌、勾选框、半调点（全息屏与护目镜 HUD） |
| ayushunleashed / codestackr | 点→线→面开场、翻牌数字、曲线、纯色底巨字 |
| prasenx | 彩虹同心环隧道、节拍对齐剪辑 |
| monokern | 程序化巨眼、万花筒、液态金属 |
