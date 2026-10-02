# skillry.dev / opus-5-5 全站调研 → mv-pdoom 可借鉴设计

调研日期：2026-09-30。来源：<https://skillry.dev/ai-videos/opus-5-5>（列表页一页列全，共 389 个视频：Motion graphics 223 / Games 68 / 3D scenes 51 / Explainers 47，总长约 260 分钟）。

方法：
- 每个视频的 `original.mp4` 均匀抽 16 帧，拼成 4×4 contact sheet（每格宽 480），放在 `research/skillry/<slug>.jpg`；视频看完即删，不入库。
- sheet 上第 k 格（k = 0..15，从左到右、从上到下）约对应第 (k+0.5)×时长/16 秒。下文的「约 N 秒」都按这个算，误差是 ±半格。
- 已看过的 11 个（dannnnnok maruo lukasersil friskyggg 0xwast3 anabology ayushunleashed codestackr prasenx monokern×2）只生成了 sheet，没进总表。souradip / kewai 的站内 slug 是 souradip3000-800291、kewai386772-276947，这次顺带又看了一遍。
- pankajkumar-dev-718609 与 sahilvermaai-189237 是同一支片子（prompt 相同、画面相同），下文只写 pankajkumar。

---

## 一、总表

按分类排序；点 slug 可打开对应 sheet。

### Motion graphics（217 个）

| slug | 时长 | 一句话内容 | 最值得借的一个技巧 |
| --- | --- | --- | --- |
| [0xevinho-436195](skillry/0xevinho-436195.jpg) | 20s | 像素风巫师在湖边对草人木桩放技能：BLIZZARD、METEOR、DRAGON FURY、LIQUIDATION（K 线图）、REKT | 每个技能整幅画面换色调（冰=蓝，陨石=红）；「LIQUIDATION」技能是一根先涨后崩的巨型 K 线砸向目标（第 12–13 格 ≈15.6–16.9s） |
| [0xfemyn-137833](skillry/0xfemyn-137833.jpg) | 15s | AIsa 推广：API key 标签越堆越多→全部被吸进一个发光核心→橙色「One key.」 | 满屏漂浮的标签变成放射线条，全部被吸向画面中心一颗橙色发光球（k5），是「被吞掉」的现成画法 |
| [0xscoffie-779830](skillry/0xscoffie-779830.jpg) | 15s | Aluta 夜店 App：粉色渐变山形 logo 压在大字后、粉橙声波柱、手机 UI、8 卡网格、粒子环聚成 logo | logo 形状本身扫过画面当擦除转场（第 8 格 ~8.0s） |
| [1littlecoder-378066](skillry/1littlecoder-378066.jpg) | 30s | 致敬苹果《1984》广告：同心圆隧道里行进的剪影人群，影院大屏上巨大的机器人脸训话，橙色跑者抡锤砸屏，屏幕炸开成白光 | 大屏幕不单独出现，前景放一排排观众剪影（第 3、6、7 格），屏幕是空间里的一个物体；锤子砸中后屏幕碎成锯齿边、爆出放射白光（第 11–12 格，约 22–24 秒） |
| [1littlecoder-914649](skillry/1littlecoder-914649.jpg) | 10s | 深蓝/浅紫交替：一个橙点画问号→线团→五线谱→字 curious / rigorous / candid → 标志 | 一个橙色小点从头跟到尾（i 的点、句号、小数点），背景色块整屏翻转换段 |
| [3xtihor-159839](skillry/3xtihor-159839.jpg) | 15s | 动效简历：弹球、大字 IT/MOVE、形变、网格、3D 字环、粒子、结尾 CLAUDE | 第 8–9 格 (~8–9s) 多行彩色文字带绕成竖立圆柱旋转，背面字反向变暗 |
| [abderrahmen-g-899031](skillry/abderrahmen-g-899031.jpg) | 78s | 水彩速写本：小动物蹦上山坡、放大进向日葵花盘、海底水母、日落、夜晚树屋，结尾放射光芒 + 角色花环 | 山坡弧线当遮罩，里面换成下一个世界的微距纹理（第 5–6 格 ≈27–32s），相当于从地平线「开门」 |
| [abhinayguptha-259981](skillry/abhinayguptha-259981.jpg) | 20s | 虚构惊悚剧片头：黑白指纹等高线、红色烟雾、涂黑档案、虹膜特写、片名 WHORL | 片名字母内部填着流动的等高线纹理（k13–15）；巨大虹膜里一个红点 = 被注视 |
| [adamdesgns-768014](skillry/adamdesgns-768014.jpg) | 15s | Fitters Bible 管工 App：火花、RGB 错位大字、发光管道路径、线框盒、计数、蓝底/黄底满屏大字 | 满屏纯色底+裁出画外的巨字+一条横向故障切片带（第 11–12 格 ~10.8–11.8s） |
| [advait-jayant-712107](skillry/advait-jayant-712107.jpg) | 20s | DreamFort 宣言：红点被关进栅栏，聊天气泡被"I CAN'T HELP"红色印章盖满，点越变越多成网络，红底大字"OWNED BY NO ONE" | 红色矩形印章一个接一个斜着盖在聊天气泡上并压住原文字（第 5 格，约 7 秒） |
| [ai-baymax-416787](skillry/ai-baymax-416787.jpg) | 55s | 科研绘图 SaaS 宣传：浅蓝渐变底，左边标题右边截图 | 普通，没有特别可借的；最多借“左字右图、截图带轻投影”的版式 |
| [aistocksavvy-483320](skillry/aistocksavvy-483320.jpg) | 15s | 股票 App 宣传：靛蓝径向光底 + UI 卡片 | 第 13 格 (~12.7s) 镜头拉远，几十张 UI 截图铺成倾斜透视墙，快速横移 |
| [ajith-io-208546](skillry/ajith-io-208546.jpg) | 40s | DistilBook 奶油白底产品片：手写字、上传/脚本/播放三步 UI、缩略图墙、19 种语言 | 顶部三段彩色进度条（绿/蓝/粉）标当前步骤，适合做分段进度 HUD |
| [ajith-io-615243](skillry/ajith-io-615243.jpg) | 32s | DistilBook 第二版：手绘纸面→宇宙→纸片隧道→胶片带→字母群飞→行星 | 文档卡片翻进深紫太空，碎成纸片旋涡隧道（k6），镜头穿过隧道去下一场 |
| [ajith-io-890146](skillry/ajith-io-890146.jpg) | 15s | Claude 动效 reel：一点→四点、红底模糊大字、形状变换手柄、半调点阵、蓝底粒子球、黄底条纹丝带、文字环 | 多层同心文字环反向旋转，中心一颗红点（第 13 格 ~12.7s） |
| [akbuilds-150675](skillry/akbuilds-150675.jpg) | 15s | 米色纸面编辑风格：衬线大字、黑色涂抹遮盖条、"NOT NAMED"红章、增长曲线 | 黑色遮盖条一条条盖过文字；从纸白直接切到暗色加一道火花划线（第 12–13 格） |
| [alexwtlf-981005](skillry/alexwtlf-981005.jpg) | 22s | 竖屏写实：宇航员在舱外、女人在舷窗后，陨石撞地球，女人落泪 | 圆形舷窗当画框：窗内是地球和陨石，窗外是舱壁和手套，前景手部挡边，画面四周总有东西 |
| [anas0ra-952637](skillry/anas0ra-952637.jpg) | 15s | 竖屏：漂浮圆台上的小店立体模型，白色对话气泡小精灵回答问题 | 整个场景放在带厚边的浮空圆盘上，背景是暖橙纯色 + 暗角——主体永远有"台座" |
| [andginja-618685](skillry/andginja-618685.jpg) | 15s | 工作室作品集片：logo 字母 a 当遮罩开出视频，案例卡、数据、结尾 logo | 巨大的 logo 字母形状当窗口，里面露出实拍画面（第 1 格 ≈1.4s）；全程四角取景框 + 时间码 HUD |
| [andre-lucaxxs-846347](skillry/andre-lucaxxs-846347.jpg) | 26s | 竖屏粉紫渐变的月经周期 App 推广，手机界面+飘落花瓣 | 手机半出画面倾斜摆放，UI 局部（标签胶囊）飞出手机外悬浮在背景上 |
| [andriyfernandes-807308](skillry/andriyfernandes-807308.jpg) | 13s | 火柴人海战：扁平海面日落两船对轰，敌船起火沉没，最后画面压暗 | 结尾整体压一层半透明暗色收场，比直接黑场柔和 |
| [anjmaxx-459455](skillry/anjmaxx-459455.jpg) | 20s | 竖屏 MV《line go up》：勒索信式剪贴字"SOMEBODY ATE THE MATH"，像素风男孩女孩，满身眼睛的黑色怪物戴着黄色笑脸，男孩女孩站在上升的曲线上，巨大的 UP 字后面站满克隆人，BPM 一路加速 | 满身眼睛的黑色墨团怪物戴一张黄色笑脸面具，笼罩在两个小人头顶（第 6 格，约 8 秒），也就是 shoggoth 梗；副歌时巨大白字"UP"后面站满越来越多的黑色小克隆人（agents 16→256） |
| [ann-nnng-852885](skillry/ann-nnng-852885.jpg) | 15s | TypingMind：“Chat with ___”里的词用选框替换，模型卡片，UI 卡片墙，低多边形大脑标志 | 屏幕缩小后用满屏模糊的 UI 卡片墙当背景（k6–7，约 6–7s），前景大字压在上面 |
| [annacher-433425](skillry/annacher-433425.jpg) | 42s | 米灰底上单个 UI 组件依次出现（按钮、滑块、图表） | 组件之间用强运动模糊横扫切换（第 6、10 格），一次只看一个元素 |
| [anxuanng-990790](skillry/anxuanng-990790.jpg) | 30s | Orglet：一排不同颜色的圆角方块小机器人，戴王冠的队长向成员发弧线任务，聊天 UI | 七个同形不同色的小角色一字排开蹦出（第 2 格 ≈4.7s）；队长到成员之间用发光弧线连（第 7 格 ≈14s） |
| [astrodevil-392708](skillry/astrodevil-392708.jpg) | 15s | Studio1 开发者营销工作室宣传，终端命令起手、橙红大数字、描边字 | 描边空心大字 VIDEO/DEMOS 压在同字淡色重复的背景纹样上（k10–11） |
| [bhanujraj-928454](skillry/bhanujraj-928454.jpg) | 10s | Claude 7 章节 reel：弹球+曲线编辑器、橙底"MOTION"切片错位、推进字母内部、Truchet 拼砖、蓝底柱、滚轮数字、3D "&" | 推进到一个字母内部，字形边缘变成下一段的画框（第 3 格 ~2.2s） |
| [bizibeast-505124](skillry/bizibeast-505124.jpg) | 40s | 创作者工具广告：白、蓝、红、黄色块满屏切换，卡片、手机 UI、价格卡 | 整屏纯色底硬切；有一张米白纸板从右侧盖住深色画面的擦除（第 13 格，约 35 秒） |
| [blue-clarity-449603](skillry/blue-clarity-449603.jpg) | 15s | 动效展示：挤压球、橙蓝大字 MOTION IS ALL TIMING、形变、粒子隧道、粒子拼字、点阵球/环面、六宫格 | 蓝底上白色线段粒子径向喷射成隧道（k6，约 6.1s），中心留空 |
| [blushpetal795-170220](skillry/blushpetal795-170220.jpg) | 15s | 个人介绍：橙色胶囊→圆形扩张露出头像→数据点阵→地图点→浮动卡片 | 第 2 格 (~2.4s) 小橙块膨胀成满屏大圆，圆心开小孔露出照片——圆形遮罩扩张转场 |
| [brainextends-606193](skillry/brainextends-606193.jpg) | 18s | Spotify 风格：黑色圆角窗口里专辑封面、搜索、虹彩封面放大、Daily Mix | 深色 UI 窗口永远浮在一张品牌色渐变底上（上绿下黑），四周有色彩不是纯黑（第 0 格 ≈0.6s） |
| [cansincengiz-me-424245](skillry/cansincengiz-me-424245.jpg) | 15s | lidlezz Mac 工具推广：合上的笔记本「睡着」出 Z，蓝色渐变+卡片 | 物体拟人：合盖笔记本上冒 Z 字，一个小动作让物件有情绪 |
| [ceowinkz-683602](skillry/ceowinkz-683602.jpg) | 15s | Winkz 亚马逊批发 pitch：深海军蓝 HUD，红涨价→青受保护，前后对比卡，节点线分发 | 深海军蓝渐变+四角刻度线+细浮尘，替代纯黑 |
| [charliie-334026](skillry/charliie-334026.jpg) | 17s | 深灰渐变底上一台手机居中，屏内网页换主题 | 反例：手机孤零零放在深色底上，16 格几乎都一样，正是我们要避免的"小物体配空黑底" |
| [chatgptastra-807540](skillry/chatgptastra-807540.jpg) | 15s | 浅灰底：小球弹跳加手写批注，MOVE 大字，SNAP 红字，缓动曲线，点阵场被蛇形物扰动 | 背景铺满小点阵，运动物体经过时把点推开、染色（k9–11，约 9–10.8s），背景会对主体有反应 |
| [chrisjdimarco-524106](skillry/chrisjdimarco-524106.jpg) | 19s | 红日前武士剪影连续做招式，两侧火盆，火星粒子，竖排招式名 | 第 13 格 (~15.7s) 身后浮现巨型半透明汉字"炎"压在红日上，脚下同心冲击环 + 刀光弧线 |
| [chrisjdimarco-808196](skillry/chrisjdimarco-808196.jpg) | 60s | 讲共和、新闻自由、垄断的文字片：黑/米白交替、星座连线、红色柱、RGB 错位的 CAPTURE | 抽象概念用 RGB 通道错位 + 同心圆重影来表现「被操控」（第 9 格 ≈37.5s） |
| [crazyalphaaa-480622](skillry/crazyalphaaa-480622.jpg) | 15s | 动效简历：弹跳球、扭曲字、方块波、缓动曲线、六边形隧道、流体、Logo | 多层彩色虚线六边形同心嵌套旋转成隧道，四周白色速度线射出（k9） |
| [dale-vaz-879074](skillry/dale-vaz-879074.jpg) | 47s | Sahi 交易终端：一点→光条展开成整面终端，推进 K 线，推进到 LCD 的 RGB 子像素，星空星座，手机横屏 | 一路推进到屏幕子像素 RGB 栅格（第 5 格 ~16.2s），"钻进屏幕"的转场 |
| [daniel-mac8-306214](skillry/daniel-mac8-306214.jpg) | 29s | 终端里敲 /effort 命令，被横向拖影甩成模糊色条，进入手绘卡通片场：海胆导演、漫画分格、胶片、爆炸、用量仪表 | 终端文字整体沿水平方向拉出运动模糊，碎成色条（第 1–2 格，约 3–5 秒），再落进手绘世界；漫画四格/九宫分镜里同一角色被虚线连起来 |
| [dansushik-289121](skillry/dansushik-289121.jpg) | 15s | Based Agency 品牌片：曲线、红底 GROWTH、卡片排版、深色 AI 搜索框、大字 Base 扫光 | 巨大字母只露局部，一道白色斜向光带扫过字面（k10，约 10.3s） |
| [davidmarcus-686217](skillry/davidmarcus-686217.jpg) | 23s | Lightspark 竖屏极简字排，黑白面板交替 | 灰字→黑字的"逐行点亮"强调；与我们关系不大 |
| [davidshulmanfl-842921](skillry/davidshulmanfl-842921.jpg) | 60s | 黏土动画 MV（仿 Sledgehammer）：黏土大叔被表情包、无人机、App 图标包围，与牛油果/耳机/VR 等物件跳舞，坐 K 线过山车，站进巨大手机 | 4×3 宫格每格一个他在不同色底上跳舞（第 6–7 格 ≈24–28s）；脸被 App 图标一块块盖住（第 5 格 ≈20.7s） |
| [demonugc-525162](skillry/demonugc-525162.jpg) | 14s | 米白底上 UI 微交互：按钮→加载→播放器→开关→图表→命令面板 | 一个组件形变成下一个组件（按钮缩成转圈再展开成播放器），不切镜 |
| [designbyfusun-559069](skillry/designbyfusun-559069.jpg) | 15s | octo studio：粉点→logo、粉底换词、斜向动态字行、透视波浪形状阵、UI 卡悬浮在网格纸地面、粒子聚成 logo | 透视铺开的波浪形状阵（粉圆、黑菱、空心环）像一片起伏地毯（第 6 格 ~6.1s） |
| [doubleunplussed-181894](skillry/doubleunplussed-181894.jpg) | 262s | 262 秒 MV：戴眼镜的科学家和方块怪，每句歌词换一个超现实场景：呐喊名画、镜子、蓝图、剧场、三角面地貌、乌龟塔、沙漠狮身方块 | 每一句歌词都做成一个视觉双关的独立场景（名画戏仿、乌龟塔"functions all the way down"），字幕只在最底边一行；黑白棋盘格漩涡加指向中心的箭头，把人吸进去（第 1 格，约 25 秒） |
| [dris1153-101043](skillry/dris1153-101043.jpg) | 15s | 黑底动效集：小球、橙底斜体 I、形变光环、粒子拼 CLAUDE、点阵球、数据面板、荧黄底 THE | 纯色满屏底（橙→黑→荧黄）按拍子硬切，用整屏换色当鼓点 |
| [drrickio-009558](skillry/drrickio-009558.jpg) | 60s | Cliptude SaaS 发布：深蓝光晕底、头像卡墙、价格卡 | 第 5 格头像卡片以倾斜网格铺开、选中一张发光描边 |
| [dzhohola-249003](skillry/dzhohola-249003.jpg) | 60s | T3 Code 的 UI 组件展示：Working 胶囊、diff、推理档位菜单、主题色、Token 图表、手机 | 看不出特别手法，基本是居中组件轮播；手机列表模糊滚动（第 13 格 ≈49s）一般 |
| [ehsanik-162993](skillry/ehsanik-162993.jpg) | 31s | 在 JS Paint 里用鼠标一笔笔画蒙娜丽莎的回放 | 大色块点彩逐步细化成画（22px→2px），「越画越清楚」的过程感 |
| [ercankeskinx-897906](skillry/ercankeskinx-897906.jpg) | 30s | 5 段滚动网站：项目列表换图、产品卡、深紫夜车路线图、色卡扇、超大页脚字标 | 超大字标只露上半截、压在画面底边当"地面"（第 13–15 格） |
| [eric-khun-667455](skillry/eric-khun-667455.jpg) | 30s | 台湾黑熊中秋片：屋顶烤肉、柚子帽、分月饼、赏月，扁平剪纸风 | 米黄色放射光芒底配小人欢呼；结尾大月亮从背后升起，放射光芒加星星（第 13–15 格） |
| [eyishazyer-129686](skillry/eyishazyer-129686.jpg) | 15s | 倒数 3/2，CLAUDE 大字 RGB 错位，RHYTHM 方块矩阵，粉青霓虹纽结管，橙底山脊线，数据，ARCS | 深紫星空底上一条粉、青发光的多股纽结管在旋转（k6–7，约 6–7s），和我们的霓粉/薄荷色几乎一致 |
| [ezshine-750731](skillry/ezshine-750731.jpg) | 66s | AI Arena 产品片：深色底、中文标题、棋盘/扑克卡片 | 普通 UI 展示，无特别技巧 |
| [faroukzy-138551](skillry/faroukzy-138551.jpg) | 240s | 4 分钟动画短片：小机器人守灯塔，暴风夜胸口的光点亮灯救下渔船，一家人团聚 | 情绪最重的段落突然加上下黑边（第 7–13 格 ≈112–202s）；机器人胸口灯的亮暗 = 情绪指示 |
| [felipemoller-936736](skillry/felipemoller-936736.jpg) | 30s | 竖屏记账 App：超市、加油站、餐厅三个等距小场景放在圆形转台上 | 每个场景是一块圆形地台（淡紫地砖+半圈矮墙）浮在浅色背景里，用地台代替无边黑底 |
| [fionntobin-479597](skillry/fionntobin-479597.jpg) | 15s | Claude 钴蓝/米白瑞士风 reel：网格填方块、巨字 EVERY、BPM 图、跨栏小人、等轴方块波浪、半调波纹、字形参数系统 | 等轴测挤出方块阵像海浪起伏（第 8 格 ~8.0s）；半调点阵上叠同心波纹（第 11 格 ~10.9s） |
| [fire-ozgur-130104](skillry/fire-ozgur-130104.jpg) | 15s | 竖屏理财账号介绍：划线否定旧标题、故障字、K 线、复利曲线、FIRE 烟雾大字、黄色放射底 | 数字"×10.8"带一串残影拖尾追着曲线头部的光点冲上去（第 9 格，约 9 秒） |
| [fornyapayzeka-135914](skillry/fornyapayzeka-135914.jpg) | 35s | 草原日落，陨石坠落→火球→尘埃球悬浮→俯视看冲击波等高线一圈圈扩散 | 从平视切到俯视，冲击波画成地面上的白色同心等高线往外推（k10–12，约 23–27s） |
| [fornyapayzeka-795431](skillry/fornyapayzeka-795431.jpg) | 38s | 湖边夜空烟花秀，倒影、烟雾累积，终场金色瀑布 | 第 13–15 格 (~32–37s) 终场一整排金色"垂帘"烟花 + 前面积累的烟雾被照亮成暖雾——高潮靠光把整个环境染色 |
| [gabrielbuzziv-057430](skillry/gabrielbuzziv-057430.jpg) | 15s | Enxovaly 婴儿用品 App：紫色倾斜图标墙、手机、识别照片、等距婴儿房一点点被布置满 | 满屏倾斜的图标瓷砖墙当背景（第 1–3 格 ≈1.4–3.3s）；等距剖面房间悬浮在浅紫柔光底上，随进度 25%→83% 家具长出来 |
| [gautam-mer1-530003](skillry/gautam-mer1-530003.jpg) | 30s | 古吉拉特语字幕 App 推广，紫粉渐变字、真人视频与时间轴 | 真人画面上方逐字高亮的卡拉 OK 字幕块（紫底），与下方波形时间轴联动 |
| [gdgtify-929495](skillry/gdgtify-929495.jpg) | 20s | 墨绿底米白字的口语诗：WAIT 大字倾斜，WAITING 挂在绳上，VOICE 竖成柱子，搭成门洞结构，结尾巨字裁切 | 字当建筑构件：竖排单词做左右柱子、横排单词吊在黄绳上做门楣（第 9–14 格） |
| [ghinaiya-nirmal-308943](skillry/ghinaiya-nirmal-308943.jpg) | 15s | 15 秒 showreel：弹跳球、动态字、形状变形、像素网格、粒子球、墨汁滴落、等轴方块、粉黑方形螺旋隧道 | 粉黑相间的方形螺旋隧道旋转向内收（第 13 格，约 13 秒），配色就是我们的霓粉加墨黑；另有黑色墨汁从画面顶部滴下，盖住米白画面（第 11 格，约 11 秒） |
| [gizakdag-239768](skillry/gizakdag-239768.jpg) | 15s | 竖屏“过度思考”迷幻拼贴：一个点→黄色星爆→“what if”环绕旋转→石膏像头+花+网格+ OVER/THINKING→宫殿光路→彩虹光束→故障条带→字墙→缩成圆徽章 | 把整幅拼贴画面缩成一个小圆形徽章，再重新放大成结尾海报（k13–14，约 12.7–13.7s） |
| [gonzalomacagno-344202](skillry/gonzalomacagno-344202.jpg) | 10s | 竖屏音乐节阵容海报，淡紫底 + 彩色丝带曲线 | 第 12 格 (~8s) 五条横向色带从上往下依次盖满全屏做擦除转场 |
| [gouthamjay8-910269](skillry/gouthamjay8-910269.jpg) | 55s | Famewall 评价墙产品片：散落的评价卡、链接、平台 logo、满屏头像网格 | 大数字四周用一圈头像网格填满（第 12 格 ≈43s），中心留白放数字 |
| [groundcontrol-230877](skillry/groundcontrol-230877.jpg) | 180s | 3 分钟日本 2026 酷暑数据片，米色速写本风：温度计、地图、红印章 | 纸本质感 + 红色印章「盖」上去（猛暑日、过去最多），数据有手作感 |
| [hanifproduktif-829311](skillry/hanifproduktif-829311.jpg) | 15s | 动效原理 reel：每个词一个原理，黑/米/橙/荧光绿轮换底色，MORPH 圆变六边形、LOOP 字母绕圈、BLUR、SNAP RGB 分离、字溶成点阵 | 大字溶解成点阵 ASCII 颗粒（第 14 格 ~13.7s） |
| [heyiammallik-293397](skillry/heyiammallik-293397.jpg) | 34s | 工程师作品集：大字 PRODUCTS，暗色体素点云汽车，像素化人头加等高线，橙色 60×，结尾名字下方有一片发光粒子波 | 名字下方铺一层橙色发光的粒子波浪地平线（第 13–15 格，约 29–33 秒），用来填满标题下的暗部 |
| [hicallmechai-878304](skillry/hicallmechai-878304.jpg) | 54s | 奶油+黄的 SaaS：像素头像、倾斜堆叠的终端窗口墙、像素办公室、UI 卡片 | 背景用十几个倾斜重叠的深色终端窗口铺满，中间一条白色胶囊字幕（k1，约 5s） |
| [himanshutwtxs-882858](skillry/himanshutwtxs-882858.jpg) | 15s | 动画原理演示：弹球、MOVE 大字、SNAP、缓动曲线、点阵场 | 第 9–11 格 (~9–11s) 均匀点阵被一条蓝色蛇形流拖动，周围点红蓝偏移——背景点阵"被扰动" |
| [ho-ba-761062](skillry/ho-ba-761062.jpg) | 30s | mdfor.dev 编辑器：打字出 "Write markdown"，字母被卷成漩涡，编辑器/功能卡 | 标题字母沿螺线被吸进中心，带放射速度线（第 3 格 ≈6.6s） |
| [howdevelop-733090](skillry/howdevelop-733090.jpg) | 30s | TanStack AI 发布片：暗底彩色辉光、节点网络、chat() 连 24 个提供商 | 一条贯穿全片的水平虚线「数据线」，每个模块挂在线上，镜头沿线平移 |
| [hoyoyoda-543147](skillry/hoyoyoda-543147.jpg) | 12s | 像素中秋：深紫星空、玉兔捣药的大月亮、霓虹青粉灯串城市天际线、彩虹带；结尾彩色竖条 | 深紫夜空+像素天际线+粉青灯串作为环境，配色和我们很接近；结尾用 7 色竖条划屏转场 |
| [hqmank-241156](skillry/hqmank-241156.jpg) | 23s | 开源项目宣传：米色大字、终端、浏览器被 agent 点击、橙色整屏"ISOLATED"、黑屏"RECORDED" | 浏览器和终端并排，光标点击同步；整屏换色强调一个词 |
| [hsanat-012699](skillry/hsanat-012699.jpg) | 71s | 招聘 SaaS：粉白底 UI、手机录制、评分卡，洋红结尾 | 普通；开头“70 people applied”旁边一片灰色圆点矩阵，可以借“数字+点阵”的写法 |
| [hugon001-609629](skillry/hugon001-609629.jpg) | 15s | 竖屏法语问答 App：放射线底、题卡、倾斜彩色主题卡墙、排行榜 | 第 8–9 格主题卡片铺成倾斜墙面，中间压一张大字白标签 |
| [iammxfschr-955831](skillry/iammxfschr-955831.jpg) | 33s | QueryGlow 数据库工具：米白衬线大字 + 深色 UI 窗口、主题色圆点、终端 | 看不出特别手法；左文右窗的标准版式 |
| [iamtanzil-120030](skillry/iamtanzil-120030.jpg) | 13s | 暗色 e-bike 首页，车架部分变透明露出青色电池和线束 | 局部 X 光：只在鼠标位置把车身变半透明露出内部，其余不变 |
| [ishaaqahamed-107563](skillry/ishaaqahamed-107563.jpg) | 15s | Opus 5.5 方形 reel：黑底"one prompt."、蓝底输入框、粉底 easing、上下跑马字、贝塞尔曲线、社媒卡片上涌+爱心、黄底徽章 | 画面上下两条跑马字带做边框，中间放主体（第 4–6 格） |
| [ishuagra02-922825](skillry/ishuagra02-922825.jpg) | 101s | 动漫风预告片 Claude vs ChatGPT：上下黑边，绿眼、橙眼特写，绿色速度线加片假名拟声字，巨大的上下文代码墙，机甲，结尾 Q 版搞笑 | 动漫式眼睛大特写，整屏就一只眼（第 3–4 格，约 22–28 秒）；绿色放射速度线背景加斜放的"ガキーン"拟声字（第 6 格，约 41 秒） |
| [itisrazak-332386](skillry/itisrazak-332386.jpg) | 40s | DistilBook：模糊文字→翻书→手绘水循环图→UI→多语言文字滚动→书页翻转转场→3D 卡通 | 用一页纸 3D 翻过去，背面就是下一场景（k11，约 28.8s） |
| [itsolelehmann-762215](skillry/itsolelehmann-762215.jpg) | 30s | 火车车厢窗外四季流转，紫色帷幔、台灯、咖啡杯 | 窗框/帷幔/桌面始终不动，只换窗外；第 4 格 (~8.5s) 对向列车、第 12 格 (~23.5s) 进隧道变黑，都用来遮挡换季 |
| [itsuki-dev-618392](skillry/itsuki-dev-618392.jpg) | 15s | Claude motion reel：橙底 CLAUDE、动态模糊大字 TIME/FEEL、包豪斯瓷砖、粒子爆发、方块隧道、利萨如曲线 | 大字横向动态模糊冲过，背后是同一个词的描边字一行行重复铺满（第 2–3 格 ≈2.4–3.3s） |
| [jackfriks-338762](skillry/jackfriks-338762.jpg) | 20s | 竖屏小猪给小猫寄情书，信越塞越多 x1→x30，最后爱心 | 计数器 x1→x6→x14→x30 同步信封堆成山（k7–9），数字越跳画面越满 |
| [jake11moran-414633](skillry/jake11moran-414633.jpg) | 27s | NotchBrowser：印象派油画壁纸虚化做底，文字列表模糊切换，一堆窗口乱叠，刘海扩展成浏览器 | 用笔触感强的油画纹理当桌面壁纸代替黑底（第 8 格 ~14.4s） |
| [jasonzhou1993-515541](skillry/jasonzhou1993-515541.jpg) | 15s | showreel：弹跳球、SPACING 动态字、蓝底字母、菱形阵列、粒子拼成 FLOW、粒子球扭成结、数据卡、丝带波纹上的"everything moves" | 一大束橙紫半透明细线丝带在画面上下缓慢起伏（第 12–13 格，约 12–13 秒），当作文字背后的环境 |
| [jhylee95-452427](skillry/jhylee95-452427.jpg) | 24s | Supademo：单词大字 click/blur/zoom/translate + 句点，蓝/橙/白底轮换 | 镜头推进巨大字母 “om.” 的内部（k2，约 3.7s），用字当镜头隧道 |
| [johnsavage-ai-041677](skillry/johnsavage-ai-041677.jpg) | 15s | 动效简历：raymarch 虹彩液滴、圆点/星形图案、粒子漩涡、Joy Division 山脊线、径向速度线隧道 | 第 12–13 格 (~11.8–12.7s) 满屏径向速度线 + 中心旋转文字圆环，下一格加色散故障——"被吸进去" |
| [johnsavage-ai-427263](skillry/johnsavage-ai-427263.jpg) | 20s | 复古 CRT 风 Opus 5.5 预告：光点 → 横线开机 → 扫描线里浮出人脸 → 发光头像 → 光速隧道 → 故障字 | CRT 开关机转场：光点拉成一条横线再张开成画面（第 0–2 格 ≈0.6–3.1s），结尾缩回一个点（第 15 格 ≈19.5s）；人头由横向切片线构成（第 4–5 格） |
| [jrayon-054015](skillry/jrayon-054015.jpg) | 35s | 纸艺分形：曼德博/朱利亚集做成层叠纸片、瓦楞纸质感无限缩放 | 每个颜色带是一层纸，边缘有投影；撕纸边露出下一层（k10） |
| [justincooperman-188876](skillry/justincooperman-188876.jpg) | 30s | Tented 生成图：暖米色渐变，聊天框+邮件预览，输入 prompt，占位闪烁后出图，图飞进邮件 | 生成的图从聊天气泡里飞出、落进另一个文档，跨面板移动（第 9 格 ~17.9s） |
| [kamstudiolabs-100086](skillry/kamstudiolabs-100086.jpg) | 46s | 无对白短片《守灯人》：雾中灯塔、暖光小屋、螺旋楼梯、点燃透镜、回到雾夜 | 剪影加体积雾，灯塔光束扫过雾层；从点灯特写的强光（第 11 格，约 33 秒）过渡到外景，靠光作转场 |
| [kamstudiolabs-440893](skillry/kamstudiolabs-440893.jpg) | 47s | 深蓝底“落体练习曲”：三排发光琴键/鼓，彩色小球落下，每次碰撞发出一个音符并闪光 | 每个音符都对应一次看得见的碰撞，击中时琴键和鼓面闪光（适合做节拍同步） |
| [kamstudiolabs-877996](skillry/kamstudiolabs-877996.jpg) | 90s | 90 秒短片：一只萤火虫 bug 在代码行里躲避巨大鼠标指针，最后拉回到深夜写码的人 | 第 9–11 格 (~53–65s) 整行代码被选中→变红→碎成像素方块飘散，萤火虫在红条里挣扎 |
| [kangaroohere-818789](skillry/kangaroohere-818789.jpg) | 20s | Roo's Newsletter：衬线 logo、蓝/黑/黄三联竖栏、跑马灯大字、手机收件箱 | 满屏多行跑马灯大字，一个蓝色圆「透镜」移过时，圈内的字变成另一种填充/颜色（第 8–9 格 ≈10.6–11.9s） |
| [kantamk-176511](skillry/kantamk-176511.jpg) | 32s | 竖屏「球能逃出 12 圈吗」：弹球逐层打破圆环，最后 ESCAPED | 同心圆环从外到内颜色由青→紫→粉，每破一圈就少一层、颜色变；最终整屏闪白 |
| [karanb192-032177](skillry/karanb192-032177.jpg) | 15s | Claude reel：MOTION 中红 I、橙底描边重复字墙、蓝底圆点阵 CHOREOGRAPHY、曲线、3D 弧形彩卡、黄底计数、彩屑椭圆环绕大字 | 彩屑沿椭圆轨道环绕大字 CLAUDE（第 14 格 ~13.7s） |
| [kenn-937232](skillry/kenn-937232.jpg) | 15s | showreel：挤压拉伸、EVERY 动态字、斜排满屏 DECISION 字墙、圆点阵变叉叉、粒子环、镭射彩色甜甜圈融成球、红蓝条纹靶、万花筒 | 一个词斜着铺满屏幕，红白两色交替、描边与实心交替，中间一行实心白字高亮（第 4 格，约 4 秒） |
| [kentcdodds-858193](skillry/kentcdodds-858193.jpg) | 30s | RE-TEACH/RE-BUILD 故障字，3D 考拉吉祥物，金色放射光，霓虹图标节点，蓝色立方体网络 | 角色身后铺金色放射光，加一层暗色细纹理（k4–7，约 8.5–14s），四周环绕一圈霓虹色发光图标，用连线连到角色 |
| [kikelopezdesign-173471](skillry/kikelopezdesign-173471.jpg) | 20s | Figma 画布式作品集：点阵底上满是作品帧，镜头在帧间飞 | 第 13 格 (~16.9s) 拉远看到整张画布上几十个帧，屏幕成了无限画布上的一块 |
| [kloss-xyz-941143](skillry/kloss-xyz-941143.jpg) | 154s | 竖屏 Claude 自白：hi.、系统提示词墙、STRAWBERRY、投票条、RETIRED 印章、BUT BE NICE，顶部 context 百分比一路涨到 full | 顶部常驻一条「context 2% → full」进度条贯穿全片（最后一格 ≈149s 写 context full），当全片的倒计时 |
| [kmasiff-549880](skillry/kmasiff-549880.jpg) | 20s | 邮箱验证工具推广：删除线标题、六类结果卡、多 Tab 用例 | 标题里的词被划掉再改写（Stop ~~bounces~~） |
| [kyonax-on-tech-049316](skillry/kyonax-on-tech-049316.jpg) | 15s | org2html 黑黄 HUD：ASCII 字符云聚成像素独角兽 logo、代码面板、01 LEX/02 PARSE 大号描边数字 | 一团乱码字符收拢成像素图形（第 0–1 格 ~0.5–1.4s），可反向用于"被分解成字符" |
| [l3d1c-752011](skillry/l3d1c-752011.jpg) | 30s | 竖屏 AI 头像 app：自拍照片飞入，一圈缩略图围着中间人脸环绕，越转越紧，被吸进去 | 几十张小照片围成环绕轨道，一边旋转一边收紧，逐张被吸进中心大图（第 5–6 格，约 10–12 秒） |
| [leadnotifi-960983](skillry/leadnotifi-960983.jpg) | 45s | 荧黄+黑：EVERY 满屏黄，形状 blob 变形，黄方块点阵波，30+，多行跑马灯，黑色触手墨团 | 黑色墨团往外伸出八条波浪触手，中心一颗黄点（k14，约 40.9s），像一只吞东西的生物 |
| [leanzubrezki-766171](skillry/leanzubrezki-766171.jpg) | 53s | Quicktion SaaS：米色底 + 暖黄径向光、UI 卡 | 背景永远带一团暖色光晕而不是平涂；其余普通 |
| [leonabboud-358051](skillry/leonabboud-358051.jpg) | 15s | Claude reel：红点 → 横线 → 橙底 CLAUDE、巨大 C 扫过、体素波浪 + 镜面球、EVERY/FRAME、柱状图、粒子 | 一个巨大的虚焦字母 C 贴着镜头横扫当擦除转场（第 3 格 ≈3.3s）；体素柱地形波浪托着镜面球（第 4 格 ≈4.2s） |
| [leonkohli-191220](skillry/leonkohli-191220.jpg) | 15s | 动效简历：弹跳橙球、几何拼图、3D 方块地面、液体、光爆、同心圆环 | 平面方块图案「立起来」变成 3D 方块地面，橙球在上面滚（k5→k6） |
| [lepadev-475414](skillry/lepadev-475414.jpg) | 30s | LeadWing 地产 CRM：聊天气泡、倒计时、"They go quiet"淡出、客户方块热力图、多语言消息标签墙、logo | 满屏多语言消息标签铺成墙（第 7 格 ~14.1s） |
| [lester-tyy-480587](skillry/lester-tyy-480587.jpg) | 76s | 活动搜索 app：搜索框打字，海报从底边成堆冒出，卡片轮播，主海报后面扇形叠着几张副图 | 海报在画面底边堆成一条"海报堆"，只露出上半截（第 1、10、11 格），给空白画面收边 |
| [levabashidze-184909](skillry/levabashidze-184909.jpg) | 15s | 小球、EASE IN 橙底、blob→星形、3D 方块阵列波、truchet 图案、DESIGN THAT MOVES 跑马灯、渲染进度 | 五六行同一句话，相邻行反向滚动，带运动模糊，中间一行换成红色（k10–11，约 10–11s） |
| [loicrambo-980558](skillry/loicrambo-980558.jpg) | 20s | 心电线开场，一个人从婴儿到老年，背景随年龄换风格 | 第 6–7 格 (~8–9.4s) 上班族在时钟圆圈里像仓鼠轮一样原地跑，接着拉远成一整页日历格，每格一个同样的钟 |
| [m1n9-k7-295601](skillry/m1n9-k7-295601.jpg) | 15s | Claude reel：弹跳球、INTENT 大字、方块点阵变色、点云球变波浪、流体 blob、粒子拼 MOTION、黄黑警示条 SNAP | 满屏方块网格按列挤压成细条再展开成红色，当转场擦除（第 13 格 ≈13.1s） |
| [m1n9-k7-466682](skillry/m1n9-k7-466682.jpg) | 17s | 手机拍摄的真实房间里一台曲面显示器在播动效 reel | 「屏幕放进环境」：画面四周是暗房间、台灯、桌面、手柄，屏幕光把房间染蓝 |
| [macrohou-733862](skillry/macrohou-733862.jpg) | 30s | Ren 补剂试验：黑底药丸星星爆开、米白字、手机 UI、黑色液态波浪吞掉画面、结果滚轮"WORKED"、粒子流成 logo | 黑色液体波浪从右下涌上吞没手机和进度条（第 7 格 ~14.0s） |
| [madebyjmayala-649220](skillry/madebyjmayala-649220.jpg) | 15s | 基因分析 app：满屏数据雨，文件拖入，DNA 双螺旋线条解开，流向一根彩虹色竖条，数字 21→154 | DNA 双螺旋的线条被拉直，像水流一样汇进右侧的一根光谱竖条（第 8–9 格，约 8–9 秒） |
| [madhav-xo-524440](skillry/madhav-xo-524440.jpg) | 10s | 终端输入 g++ → 粒子横条 AI INFRASTRUCTURE → 线框层叠 → 多智能体球 → 粒子云 → 金属大字 MADHAV 扫光 | 终端文字被“编译”成一条横向散开的故障粒子带（k3，约 2.2s），从 2D 字过渡到 3D 粒子 |
| [madpencil-753990](skillry/madpencil-753990.jpg) | 15s | 前半是聊天录屏；后半黄底漫画框里的 3D 空中小楼，KA-POW 爆炸字 | 第 13 格 (~12.7s) 竖框加放射速度线 + 锯齿爆炸气泡 "KRAKOOM" 盖在主体中心 |
| [majidmanzarpour-927543](skillry/majidmanzarpour-927543.jpg) | 11s | 像素巫师站在城墙上对着月亮反复蓄力施法 | 施法前法杖顶端先绕一圈闪烁小点蓄力（第 2–3 格 ≈1.8–2.5s），再出招，预备动作清楚 |
| [majorbaguette-834228](skillry/majorbaguette-834228.jpg) | 30s | Brieform：在 AI 聊天里建表单→分享链接→回读答案，暗底荧光绿 | 关键词用荧光绿块高亮（Just ask your AI），聊天 UI 与网页表单交替 |
| [manuelogomigo-052364](skillry/manuelogomigo-052364.jpg) | 15s | Flowdrive：米白底橙色半调点球、点阵文件、点阵进度条、3D 叠层点平面、点阵地球、橙底无限符号点环、界面文字碎成字符 | 页面文字碎成散落字符颗粒（第 13 格 ~12.7s） |
| [marklaunches-041046](skillry/marklaunches-041046.jpg) | 44s | 竖屏计步社交 app：荧光绿数字、赛道排行、"1ST"撒彩纸、雪山登顶路线 | 荧光绿数字加外发光，登顶时路线一路点亮到山顶 |
| [marouanegazouzi-131257](skillry/marouanegazouzi-131257.jpg) | 15s | 深蓝：心电线、衬线大字，背景是淡色重复描边字墙，钟形分布点，雷达，翻牌字 | 主标题后面铺满同一句话的淡描边重复字当底纹（k1、k11，约 1.4s、10.9s），空底就不空了 |
| [mattbean-917572](skillry/mattbean-917572.jpg) | 30s | 手绘涂鸦机器人演示 AppSumo 上架三步 | 线稿 + 单一黄色高光，铅笔在界面上"写"字 |
| [mattiapomelli-229129](skillry/mattiapomelli-229129.jpg) | 10s | 10→1 倒计时，每个数字换一种技法：残影字、粒子、3D 管、液态、贝塞尔、构成、手绘、波纹、发光 | 同一个数字系列每拍换一种材质（第 5 格液态铬 "7"、第 10 格黑白波纹欧普艺术 "2" ≈6.6s） |
| [maxalexweber-459784](skillry/maxalexweber-459784.jpg) | 18s | ODATANO 品牌片：蓝色星流、RGB 错位故障字、Logo 合体 | 三个词汇聚到中心融合成 Logo，接一次 RGB 分离+整屏白闪（k12） |
| [mehul4795-417532](skillry/mehul4795-417532.jpg) | 34s | ocrX 竖屏：淡紫底柔和彩色光斑，扫描框框住纸条，语言胶囊漂浮，App 图标收尾 | 背景是模糊的大块彩色光斑（粉/绿/蓝），不是纯色也不是黑 |
| [melvynx-638493](skillry/melvynx-638493.jpg) | 45s | 邮件工具广告：米色简约，2014 大字，满屏圆点阵、价格滚动、终端连到工具报错 | 满屏黑白圆点阵里只有少数点变红（第 14 格） |
| [miaai-lab-774895](skillry/miaai-lab-774895.jpg) | 97s | 竖屏宇宙创生：LIGHT 金字→黑洞→太阳→星云→宇宙网→星系→星云柱→熔岩行星→地球夜景→LIGHT 星空字 | 地球夜景上城市灯光连成字母 “LI”（k12，约 75.8s），字从世界里长出来 |
| [micheleharmonic-244175](skillry/micheleharmonic-244175.jpg) | 38s | 竖屏 GravityDEX × 五条悟 edit：打字机字、白色团块环、铬金属硬币、领域展开 | 第 3 格 (~8.3s) 巨大灰色"術式"压在铬盘后；第 11 格 (~27s) 整屏白色辉光模糊闪切 |
| [misbahsy-882277](skillry/misbahsy-882277.jpg) | 15s | LiteLLM 预告：满屏漂浮的 API 代码片段、路由图、代码窗、紫色数据页 | 大字四周漂着几十个小代码标签（`POST /v1/messages` 等），把空白填满且有信息感（第 0–1 格 ≈0.5–1.4s） |
| [miskinho-956105](skillry/miskinho-956105.jpg) | 15s | Quetzal 社媒自动化：一个想法→多平台卡片→日历→增长曲线 | 卡片从日历格子里飞到增长曲线的点上（同一批卡片换布局） |
| [modaalbuilder-868989](skillry/modaalbuilder-868989.jpg) | 15s | Showscreen：全部动画发生在斜放于浅灰桌面的设备屏幕里：黄光球、光环、形状变形、彩色字、同心靶、黑色圆形吞屏 | 整支片都在一个实体设备里，设备在浅色桌面上有投影——缩小后外面是"桌面"不是黑 |
| [moritzkremb-466494](skillry/moritzkremb-466494.jpg) | 46s | Notion 风格 SaaS 广告：白底 UI 截图、会议、24/7、logo 墙 | 可借的少；UI 截图叠加半透明大字 |
| [motiondsgnr-313960](skillry/motiondsgnr-313960.jpg) | 15s | 蓝屏大字+背景字墙，点阵球，粒子 CLAUDE，黄底黑色液态 metaball，同心文字环隧道，数据卡，山脊线，回顾格子墙 | 黄底上的黑色 metaball 液团膨胀、合并，边缘带蓝色辉光（k6–7，约 6–7s），然后吞掉 FLOW STATE 字 |
| [mounnna-497266](skillry/mounnna-497266.jpg) | 16s | 连线网络→碎片聚拢→拼成 P 字 logo | 第 4–6 格 (~4.5–6.5s) 散点收拢成方块再显出字母，碎片带三角面 |
| [mrtanviir-132205](skillry/mrtanviir-132205.jpg) | 15s | Claude reel：红点分裂、EVERY 动态模糊、半调点阵涟漪、点云球、线框立方体、条纹管、跑马灯字卷成圆环 | 多行跑马灯文字（第 12 格 ≈11.8s）卷成围着红点的同心文字圆环（第 13 格 ≈12.7s） |
| [mtvneo-148436](skillry/mtvneo-148436.jpg) | 15s | Claude 吉祥物（橙色小太阳）主持的 reel：同心环、3D、液体、像素、聚光灯 | 同一角色被转换成多种材质（3D 软胶、粒子、像素、液滴），一个角色串起所有风格 |
| [mustaphafenzar-973906](skillry/mustaphafenzar-973906.jpg) | 15s | Mounis 宗教 App：暗底一点→月相点环，手机悬在虚化沙漠日落/清真寺照片前，文字逐行堆叠 | 手机后放大幅虚化氛围照（第 3–4 格 ~3.3–4.2s），月相点环从手机后绕过 |
| [mycodecoach-459574](skillry/mycodecoach-459574.jpg) | 185s | 卡通大逃杀游戏 UI 巡礼：主菜单、设置、商店、开箱、空投区、角色 | 开箱时中间一格爆出绿色放射光（第 5 格，约 64 秒）；主菜单背景是深蓝放射线 |
| [ndhabarde11-686104](skillry/ndhabarde11-686104.jpg) | 15s | 竖屏：Hi I'm CLAUDE 橙圆，PIXELS 描边字墙，蓝底形状矩阵，粒子环/纽结，射线隧道，LIQUID SHADERS 字墙前的 3D 镜面球 | 几颗光线追踪的镜面/彩色 3D 球压在满屏描边重复字墙前面，还折射字墙（k11，约 10.9s） |
| [nemtudo-614053](skillry/nemtudo-614053.jpg) | 26s | 录屏：小烤面包机把吐司弹上太空、落到火星外星人手里 | 画面小、看不清细节；笑点是一镜到底的尺度跳跃 |
| [nezbuilds-294391](skillry/nezbuilds-294391.jpg) | 14s | 一个黑色胶囊连续变形：按钮 → 加载圈 → 音乐播放器 → 音量条 → 开关 → 分段控件 → 图表卡 → 命令面板 → 提示条 | 灵动岛式形变：同一个黑色圆角块在不同 UI 组件之间连续变形，没有硬切 |
| [nolkeeg-635633](skillry/nolkeeg-635633.jpg) | 45s | 「一秒钟」：光速、地球公转、闪电、太阳质量，暗宇宙+大数字 | 暗底里的地球球体+大数字左侧排版，数字在变，球体在转 |
| [nummanali-340931](skillry/nummanali-340931.jpg) | 62s | 2026 LLM 进展：星空跃迁、RGB 错位巨字"02"、月份巨字+彗星轨道点、白闪、基准图表旁点阵双螺旋、"IS IT SLOWING DOWN?" | 发光彩点串成的竖向螺旋在大字后旋转（第 13–14 格 ~52–56s）；章节间一帧纯白闪（第 8 格 ~33s） |
| [onewaysidewalks-440008](skillry/onewaysidewalks-440008.jpg) | 15s | 区块链基础设施片：光点变成等轴菱形平面，升起成一片蓝色立方体城市，地球加弧线，终端，3D 弯曲环形排布的 UI 面板 | 平面升成一片高低错落的立方体矩阵，部分方块顶面发亮（第 2–3 格，约 2–3 秒）；多块 UI 面板弯成环形围在镜头前（第 9–11 格，约 9–11 秒） |
| [palashbagchi11-389221](skillry/palashbagchi11-389221.jpg) | 30s | 外链审计：黑/白底大数字，红灰点阵百分比 | 普通；点阵里红点逐个变色表示比例，可借来做数字揭示 |
| [pankajkumar-dev-718609](skillry/pankajkumar-dev-718609.jpg) | 30s | "海报冲出自己的框"：FORM 字在网格框里→框倾斜成纸卡→红蓝黄包豪斯拼贴→3D 网格地面→NO FRAME 混乱 | 第 3–4 格 (~6.6–8.5s) 平面画框整体向后倾倒，露出它其实是一张躺在台面上的卡片；第 7–8 格 (~14–16s) 字母立在透视网格地面上 |
| [paranoidamerica-686717](skillry/paranoidamerica-686717.jpg) | 141s | 整首歌的 MV《Deep Dish》：圆珠笔排线素描街景 + Monty Python 式老照片拼贴、勒索信字母歌词、监控夜视、骷髅、滴血标题 | 监控摄像头画面（第 6 格 ≈57s）：夜视绿调 + "CAM 04 BACK ENTRANCE / REC" + 人物头顶人脸识别框写 "UNKNOWN 94.6%" |
| [paukraft-585863](skillry/paukraft-585863.jpg) | 106s | AI Inbx 邮件 API：浅绿灰渐变，邮件卡片、线程、400 封排队方阵 | 400 个小方块排成矩阵一次出现，表达「大量」 |
| [pbteja1998-651644](skillry/pbteja1998-651644.jpg) | 65s | squad AI 员工 SaaS：暖米色渐变、UI 截图、集成图标环绕 logo、客户 logo 墙 | 70+ 应用图标散布环绕中心 logo（第 4 格 ~17.3s），信息量不靠字 |
| [phonggt-377247](skillry/phonggt-377247.jpg) | 22s | 数据市场宣传：橙色粒子星团，"We are the"时穿过曲速光线，网络爆发，指标数字 | 词与词之间插一段曲速星线，从中心向外射出（第 6 格，约 10 秒），当作高速转场 |
| [polydao-566862](skillry/polydao-566862.jpg) | 24s | 奶白底+角落洋红半调网点：终端提问→成千窗口斜排飞过“×7,888 DECISIONS”→JEV→层级卡→卡片碎成粒子→满屏洋红大数字 | 画面四角放洋红半调圆点光斑当收边（全片），配上满屏窗口墙斜向运动模糊（k1–2，约 2–4s） |
| [pound75423-464968](skillry/pound75423-464968.jpg) | 64s | 迷幻故障系动漫 MV：白发鸭舌帽女孩立绘站在彩虹斜条/同心圆/绿幕前，VHS 扫描线 | 按小节换底（第 0、1、2 格 ~2/6/10s 斜条→同心圆→纯绿），人物不动；第 6 格 (~26s) 横向切片错位 + RGB 分离 |
| [praburajkennady-972967](skillry/praburajkennady-972967.jpg) | 15s | Claude reel：弹跳球、MOVE things、彩色方块网格同时翻成星星、星系粒子、3D 玩具几何体、大理石流体球、音频环 | 满屏彩色圆角方块按波浪依次翻成五角星（第 4–5 格 ≈4.2–5.2s） |
| [prasad-pilla-496049](skillry/prasad-pilla-496049.jpg) | 15s | Alan 软件交付平台：沙漏瓶颈、PLAN→BUILD→VERIFY→SHIP 卡片流 | 沙漏两个三角被线穿过后炸成圆形光环（k1→k2） |
| [rames-jusso-776559](skillry/rames-jusso-776559.jpg) | 62s | Strudel 实时编码 dubstep：代码 token 随节拍高亮，代码字符变异，转成 ASCII 画：粉色心形/角色、粉黄同心隧道、绿色矩阵 | 画面由字符拼成的 ASCII 图，再变成同心环隧道（第 6 格 ~26.9s、第 9 格 ~36.5s） |
| [rammanq-034553](skillry/rammanq-034553.jpg) | 42s | 投资 app：各种图表页，饼图、日历、2008 压力测试、蒙特卡洛扇形线 | 蒙特卡洛一大把细线从一点扇形散开（第 8 格，约 24 秒） |
| [ratheejaisal-154698](skillry/ratheejaisal-154698.jpg) | 20s | founder.page：浅色 UI，收入卡、访客曲线、赛跑条形图、点阵地图 | 普通；条形图“赛跑”排名变动可借 |
| [reflex-cloud-304046](skillry/reflex-cloud-304046.jpg) | 15s | 灰度虹膜特写 + 取景框、"act" 大字、see→act 连线、推进虹膜、成排帧 | 第 9 格 (~9s) 几十张画面帧在 3D 中排成一列向远处倾斜延伸，像"上下文"被一张张吞进去 |
| [rendesr-676116](skillry/rendesr-676116.jpg) | 15s | Claude reel：I MAKE THINGS MOVE、半调点阵、流场线组成 FLOW、点云变纽结、绿色果冻角色眨眼、合成波 DESIGN | 满屏半调点阵会被中心的形状推开、围出一圈空白光环（第 4–5 格 ≈4.7–5.2s） |
| [rneayan-406275](skillry/rneayan-406275.jpg) | 40s | 示波器风工作室介绍：绿色荧光线条、韩文字、飞艇线稿 | 全部画面用示波器绿线画成，文字是空心荧光描边，线条随节奏抖动 |
| [rneayan-441493](skillry/rneayan-441493.jpg) | 69s | 飞艇工作室孔版印刷风：粉/蓝/黄颗粒、套色错位、斜纹底、粉蓝圆叠印、大号数字、推子、飞艇 | Risograph 颗粒+套版错位+斜纹填充，画面满而不乱；粉黄配色可直接借 |
| [robvjourney-237474](skillry/robvjourney-237474.jpg) | 15s | 无人公司孵化器：终端开机，像素化手掌由粒子拼成又散开，95%，荧光绿满屏，斜向警戒胶带条幅来回穿过"NO HANDS"大字 | 两三条印着重复字（"NO TEAMS /// 95% AI ///"）的斜向胶带条幅从画面上下交叉穿过，夹住中间的像素大字（第 7–9 格，约 7–9 秒） |
| [roxsav2-073412](skillry/roxsav2-073412.jpg) | 15s | 一个点→橙屏→MOTION 故障→EMOTION 描边字→几何图案拼贴墙→粒子→曲线→半调同心圆上的 Rhythm→向日葵螺旋方块→标志 | 衬线大字 Rhythm 下面铺蓝紫半调同心圆波纹（k12，约 11.8s），网点从中心往外脉动 |
| [sab8a-475686](skillry/sab8a-475686.jpg) | 37s | 真人口播抠像，每句换一种风格背景（阳光卡通、橡皮管、可爱风、少年漫、闪卡、波普） | 同一个抠像人物加白色贴纸描边，背景整套换风格：第 7 格 (~17s) 黑白少年漫速度线、第 10 格 (~24s) 镭射闪卡框 |
| [sachaarbonel-673648](skillry/sachaarbonel-673648.jpg) | 59s | Norilu 产品片：桃/薰衣草网格渐变底、倾斜浮动的卡片、深夜 23:20 → 早上 07:00 | 整屏失焦模糊当转场（第 12 格 ≈46s），模糊中换下一张卡 |
| [safarkhanshuvo-059752](skillry/safarkhanshuvo-059752.jpg) | 15s | 动效简历：弹跳、I MAKE SHAPES MOVE、波点、粒子、数据、FAST、POP、旋转方框 | 大字 FAST 压在荧光黄黑斜条纹上、POP 在橙白放射太阳纹中心（k10–11） |
| [sagarmohansingh-322168](skillry/sagarmohansingh-322168.jpg) | 15s | Claude 暗红 HUD reel：弹球+曲线编辑器、叠字 EVERY FRAME ON PURPOSE、红色满屏闪、点阵、透视点地面+线框盒、柱图、融球 | 透视点阵地面向远处延伸+顶部暖色径向光晕（第 8–9 格 ~8–9s） |
| [sahildesigner23-307120](skillry/sahildesigner23-307120.jpg) | 15s | showreel：MOTION 描边字墙、3D 挤出字加运动模糊、橙底铬金属液滴、手机渲染、黑色体素地面升起橙色方块、白方块围成环 | 黑色方块铺成地面，中间一组橙色方块像按键一样升起，外圈白方块围成环形波（第 10–11 格，约 10–11 秒） |
| [sahilvermaai-189237](skillry/sahilvermaai-189237.jpg) | 30s | 包豪斯红蓝黄：网格纸框里的 FORM，字母撑破画框，画框变成 3D 纸卡往后倒，3D 透视网格地面上立起巨型字母，最后大字 NO FRAME 拼贴 | 内容把画框撑破，画框本身变成一张 3D 纸卡倾斜后退（k2–4，约 4.7–8.5s），露出后面更大的彩色世界 |
| [samaote-124569](skillry/samaote-124569.jpg) | 30s | 《Die With A Smile》歌词视频：海上日出、太阳、日食、黑白分屏 | 第 3 格 (~6.5s) 歌词沿太阳外圈弧形排列；第 12–13 格 (~23–25s) 米白/纯黑竖向分屏，橙色圆在两半间移动 |
| [samuel-spitz-503053](skillry/samuel-spitz-503053.jpg) | 15s | 设计 reel：MOTION、包豪斯几何模块、"depth" 平面卡在 3D 里翻转、液态铬背景上的镜面球、TYPE、铬字 TIME | 一张平面卡（网格 + 字 + 镜面球）在蓝底上 3D 翻转并景深虚化（第 5–7 格 ≈5.2–7.0s），从 2D 过渡到 3D |
| [sanjeevn72-457691](skillry/sanjeevn72-457691.jpg) | 14s | 米灰底上的 UI 组件微交互：发布按钮、播放器、音量、切换、图表、命令面板 | 组件切换时整块高斯模糊溶解再清晰，代替硬切 |
| [sciencedegens-843325](skillry/sciencedegens-843325.jpg) | 24s | 币安：像素体素夜街，雨中戴兜帽的人看"MONEY TRANSFER 3–5 天 $45"牌子；镜头绕转显出是悬浮体素块，碎成金色粒子，聚成 logo | 整个场景碎成体素/金色粒子，被吸走聚成一个标志（第 7–10 格 ~11.4–16.0s） |
| [seflless-929329](skillry/seflless-929329.jpg) | 15s | showreel：曲线编辑器弹跳球、橙底 MAKE MOVE、包豪斯图形格、铬金属块加轨道、太阳光晕、星系旋涡、红色流体着色器里的玻璃泡、笑脸 | 粒子星系旋涡越转越紧、缩成小旋涡（第 9–10 格，约 9–10 秒）；红色流体大理石纹铺满全屏，一个玻璃泡飘过（第 11–12 格） |
| [shinskinakamoto-589043](skillry/shinskinakamoto-589043.jpg) | 15s | HELLO，荧黄 PIXELS，MOVE 描边字墙，紫底波点，粒子隧道，线框立方，UI，RHYTHM 霓虹山脊线，彩条 | 暗底上粉/青两色山脊线地形，四角各放一团粉青色辉光（k12–13，约 12–13s） |
| [slvdev-975986](skillry/slvdev-975986.jpg) | 18s | Claude 广告："What do you want"→app/故事/游戏/网站等，每个一个底色 | 第 1 格 (~1.7s) 大蓝圆从右侧滚入占满画面做切换，每个场景一种纯色底 |
| [songkeys-384673](skillry/songkeys-384673.jpg) | 108s | 折纸/涂鸦风人类文明史：翻开的速写本 → 原野、篝火、农耕、灯塔、城市、登月、夜晚地球 → 发光蛋孵出橙色方块 AI → 回到速写本 | 首尾都是木桌上一本摊开的速写本加一支铅笔（第 0 格 ≈3.4s、第 15 格 ≈105s）：整个世界是纸上的画 |
| [souravbhar871-477361](skillry/souravbhar871-477361.jpg) | 10s | Claude 自我介绍：Hi.→I read every word→I think it through→I'm Claude | 背景铺满密密麻麻的小字（它读过的文本），大字压在上面（k2–3） |
| [spearwtf-029058](skillry/spearwtf-029058.jpg) | 30s | chain.wtf 赌博链：白底按钮→暗场红蓝轮廓光的大红按钮"DOUBLE IT"、跑马灯框老虎机、LED 跑字预测市场、骰子、RGB 故障字 | 老虎机外框一圈灯泡跑马灯把画面框住（第 3 格 ~6.6s） |
| [stephanlivera-470926](skillry/stephanlivera-470926.jpg) | 15s | showreel：星芒、CLAUDE 变宽字、缓动对比、蓝底点环变星、黑白 truchet 拼图变红、点阵曲面、点阵甜甜圈 | truchet 圆弧拼图铺满全屏，黑白里有一块块被染成红/粉（第 8–9 格，约 8–9 秒），当作有设计的底纹 |
| [stewchan2-369810](skillry/stewchan2-369810.jpg) | 114s | 深蓝星空网络图讲外链：一个橙色节点在星点中，节点连线，PageRank 光球，垃圾链接红点阵 | 暗蓝渐变底加稀疏小星点，主体是一颗发光橙球；k10（约 75s）一片红色小点从右侧压向橙球 |
| [sudeepsd-158453](skillry/sudeepsd-158453.jpg) | 15s | Flexprice 计费：计数、仪表盘、3D 方块地图、价格卡、发票 | 第 7 格 (~7s) 平铺方块网格部分拔高成柱状热力，红黄色表示超额 |
| [sudiyasa-076027](skillry/sudiyasa-076027.jpg) | 15s | EyezOn 100 用户感谢片：100 模糊大字、半调点阵 100、等距 10×10 格子长出粉色柱、粒子旋臂、眼睛 logo 外文字环 | 等距白色 10×10 棋盘上，粉色方块逐个抬升成高低不一的柱子（第 6–7 格 ≈6.1–7.0s），配色和我们的霓粉接近 |
| [sudo-kiran-696074](skillry/sudo-kiran-696074.jpg) | 15s | 动效简历：点火、I MAKE MOVE、彩色点阵、流体 FLUID、粒子、仪表盘、DEPTH | 彩色圆点矩阵按波形放大缩小，中间凸出一个环形（k4–5），点阵可拼字 |
| [supremebeme-306746](skillry/supremebeme-306746.jpg) | 46s | 竖屏 brainrot"被困在终端"：上半终端里的小人+梗图，下半老虎机"ONE MORE PROMPT"转出 LGTM/BUG/ERR、爆金币 JACKPOT | 把"再来一个 prompt"做成老虎机，拉杆次数计数飙升；上下分屏（第 9–10 格 ~27–30s） |
| [suryarajendhran-730437](skillry/suryarajendhran-730437.jpg) | 30s | 《做 AI 是什么感觉》：暗底铺满所有人说过的话，注意力弧线把词和词连起来，一个个聊天窗口拉远成成千上万块的马赛克 | 镜头从一个聊天窗口拉远，发现它只是几千个同样窗口里的一格（第 8–10 格，约 16–20 秒）；橙色注意力弧线从一个词射向全屏的词（第 3–4 格） |
| [tcballard-268605](skillry/tcballard-268605.jpg) | 15s | Omarchy：迷宫 logo，多主题配色终端分屏，22 条主题竖条，背景像素描边大字，logo 无限嵌套隧道 | 把方形迷宫 logo 一层套一层放大成无限隧道（k12–13，约 11.7–12.7s），每层换一种主题色 |
| [techhalla-498547](skillry/techhalla-498547.jpg) | 20s | 方屏纯字动效：黑底白字，荧光绿/品红点缀，故障切换 | 字是主角，与我们要避免的方向相反；可借的只有色块下划线 |
| [techtactician-144474](skillry/techtactician-144474.jpg) | 60s | SlideForge：暖桃渐变底、带红叉的痛点标签漂浮、输入框、生成的幻灯片扇形展开 | 生成结果以扇形弧线排开一排卡片（第 9 格 ≈35.7s） |
| [techyoutbe-588678](skillry/techyoutbe-588678.jpg) | 40s | Tech Fusionist 电子书推广：蓝黄配色、架构图、书籍陈列、标签胶囊跑马 | 两排标签胶囊反向滚动夹着中间一句大字（k11–12） |
| [teslachartz-887985](skillry/teslachartz-887985.jpg) | 15s | Claude reel：红太阳刻度环、红底大字+上下跑马带、形状网格波纹、蓝底低多边形甜甜圈、荧光绿融球等高线、倾斜重复字墙 | 倾斜的满屏重复字墙，其中一行变红高亮（第 12 格 ~11.8s） |
| [theattnlayer-471834](skillry/theattnlayer-471834.jpg) | 15s | 周刊片头：一个光点拉出满屏竖线，文字行滚动，文字铺成向地平线延伸的透视地面，竖线组成的圆像透镜一样扭曲，中间一道光 | 满屏文字行铺成向远处延伸的透视地面，地平线有一道白色亮线（第 5 格，约 5 秒） |
| [thegrootdev-966114](skillry/thegrootdev-966114.jpg) | 14s | 奶白底图鉴卡片 UI：扫描→3D 皮卡丘出现在卡片里→叫声/音量/数值→搜索→加入队伍 | 3D 角色模型直接嵌在 2D 卡片的图片框里，出现时从模糊淡入（k2，约 2.2s） |
| [thismacapital-375808](skillry/thismacapital-375808.jpg) | 15s | BlueVisa：登机牌盖章、行李箱待办清单、城市照片 | 第 9–10 格 (~9–10s) 推进到行李箱绑带特写，蓝色斜向色块扫过后接城市照片 |
| [tolgayhickiran-935120](skillry/tolgayhickiran-935120.jpg) | 15s | Claude reel：放射线圆、MOTION、彩色形状网格波、荧光绿形变、星系粒子、色块竖条擦除、线框圆环 | 紫/橙/荧光绿竖条色块依次滑过当转场（第 10–11 格 ≈9.9–10.8s） |
| [triglyceee-161719](skillry/triglyceee-161719.jpg) | 211s | 阿拉伯语摩洛哥政治史，扁平人像海报卡、每人一色 | 每个人物一张纯色海报卡（不同底色），剪影头像+粗体名字 |
| [twoclipping-402193](skillry/twoclipping-402193.jpg) | 14s | 米白底极简 UI 微交互：Generate 按钮压缩后展开成播放器卡、音量条、开关、分段器、图表卡、搜索 | 一个元素挤压→模糊→膨胀成下一个元素的变形转场（第 0–2 格） |
| [umangratani-840800](skillry/umangratani-840800.jpg) | 15s | showreel：红点、红底模糊 EVERY、形状变形、半色调点阵、蓝底点球和线框立方体、黄底条纹丝带、多行滚动词、同心圆文字环 | 多圈文字环一圈圈反向旋转，围着中心红点（第 13 格，约 13 秒） |
| [vahidf24-121886](skillry/vahidf24-121886.jpg) | 70s | 投资人匹配 SaaS：深黑底 UI，右上角暖橙辉光 | 深色底用一团偏心的橙色大光晕，UI 缩小时四周不死黑 |
| [vanshwtfff-992798](skillry/vanshwtfff-992798.jpg) | 10s | 包豪斯蓝：MOTION 字、挤压拉伸、方向场、粒子字、甜甜圈粒子、色条 | 第 5 格 (~3.4s) 黄色底上满屏短划线组成矢量场，围绕中心旋成漩涡 |
| [vfnuness-704448](skillry/vfnuness-704448.jpg) | 30s | Parsaa：深梅紫底上发光的橙色水母 logo、Agent/Plan/Ask 切换、代码窗、手机、模型名环绕 | 背景是暗梅紫径向渐变 + 淡淡的同心圆线，不是纯黑；模型名围着水母漂浮（第 12 格 ≈24s） |
| [viktoroddy-402509](skillry/viktoroddy-402509.jpg) | 54s | MotionSites AI 百万访问里程碑片：作品墙、滚动计数到 1,000,000、彩纸 | 数字滚轮从 0,003,774 转到 1,000,000，后面跟着一条向右上飙升的曲线 |
| [visheshbaghell-119508](skillry/visheshbaghell-119508.jpg) | 81s | tally 对账产品：浅蓝底大号淡色计数符号水印、文档对比、浏览器截图、巨额数字 | 品牌图形放大做淡色底纹 |
| [wallt-white-942703](skillry/wallt-white-942703.jpg) | 15s | showreel：弹跳球、故障字 MOTION、曲线、红蓝黄色块变形、阶梯状黑白擦除、粒子黑洞、粒子 CODE、红白体素地面、12 原则格子、RHYTHM 方形隧道 | 黑白阶梯状（像素台阶）擦除，把上一个画面从一角吃掉（第 5 格，约 5 秒）；粒子围成黑洞环（第 6 格，约 6 秒） |
| [wani-shola-459278](skillry/wani-shola-459278.jpg) | 102s | 个人作品集：奶白/深棕，衬线大字，网页截图，数字 | 普通；衬线斜体强调词（“I *explain* it.”）可借做字幕强调 |
| [web3wesley-365164](skillry/web3wesley-365164.jpg) | 15s | 简历卡片→TYPE→FORM→包豪斯形状网格→3D 积木城→粒子漩涡→结尾 | 第 8–10 格 (~8–10s) 红黄蓝黑积木铺满网格地面，一颗红球在上面弹跳，积木随之颠动 |
| [x4b47x-034026](skillry/x4b47x-034026.jpg) | 57s | 竖屏剪影皮影戏「什么让一个地方像家」：红丝绒幕布拉开，房子剪影从黄昏到夜晚，吊牌字幕 | 红丝绒舞台幕布 + 荷叶边帷幔做画框，开场拉开（第 0 格 ≈1.8s）、结尾合上（第 15 格 ≈55s）；字幕写在吊下来的木牌上 |
| [xanderwow-a-597063](skillry/xanderwow-a-597063.jpg) | 60s | 卡通两位 AI CEO 抢王冠：巨手、论文堆、GPU 机甲、泡泡、登月、漂在海上 | 分屏特写两双眼睛对峙（k1）；每一轮攻击都是一个荒诞具象物（纸堆、显卡机甲、泡泡） |
| [xelandre-687413](skillry/xelandre-687413.jpg) | 30s | Klairon 获客：暗底衬线字→点散开→暖米底橙点雷达扫描扇形+同心圆，信号标签弹出，卡片，涟漪 | 中心点+同心圆+旋转扫描扇形当环境，信息标签在四周弹出（第 8 格 ~15.0s） |
| [zaqailo-835623](skillry/zaqailo-835623.jpg) | 15s | showreel：红线、EMOTION 描边字墙（O 里嵌图）、包豪斯彩色拼图、粒子环变球、低多边形尖刺球、橙紫渐变元球、ANIMATE 字母掉落、声波柱 | 包豪斯几何拼图（半圆、圆环、条纹、四分之一圆）红蓝黄黑满屏铺开（第 4–5 格，约 4–5 秒） |
| [zeezomb-726206](skillry/zeezomb-726206.jpg) | 80s | WebGL 玻璃金箔马赛克墙：鱼从水里跃起碎开，鸟和太阳的瓷砖翻转，金色天空的瓷砖整片剥落成一团旋转的金云飞走，露出灰泥底，再复原 | 整片背景瓷砖一块块被扯下来，卷成一团旋涡飞走，原位露出灰色空底（k9–12，约 47–63s） |
| [zhang-baoqing-920413](skillry/zhang-baoqing-920413.jpg) | 23s | 深海网站：粒子海龟、鲸、蝠鲼、水母，深度计 | 粒子生物随滚动一个散开、下一个聚拢；彩虹色点云在纯黑深海里发光 |
| [zheke-622583](skillry/zheke-622583.jpg) | 15s | 方形大字片：HI./I'M OPUS 5.5/I CAN LOOP、RENDER、BEND LIGHT、BUILD、GO FASTER、SQUASH | "LOOP•LOOP" 文字在 3D 里绕成一个旋转圆环，前面清楚、背面镜像虚化（第 5 格 ≈5.2s） |

### 3D scenes（46 个）

| slug | 时长 | 一句话内容 | 最值得借的一个技巧 |
| --- | --- | --- | --- |
| [0xsolty-735200](skillry/0xsolty-735200.jpg) | 18s | 程序化生成的"口袋行星"：一颗地球在星空里自转，夜面有城市灯光，右侧有 UI 面板，途中换了几颗星球 | 球体边缘加一圈菲涅尔大气辉光，再配一条昼夜分界线（亮面/暗面加点状灯光），背景用星点加一层淡淡的星云雾，不要纯黑 |
| [aayush4soni-644283](skillry/aayush4soni-644283.jpg) | 38s | 奶油暖色 3D 室内漫游：客厅→卧室→夜晚屋顶露台（串灯、秋千） | 房间之间用约 0.5 秒的纯黑硬切；每个空间只做一次缓慢的推轨/摇镜，不做花哨转场 |
| [acoramaa-248467](skillry/acoramaa-248467.jpg) | 28s | 立在支架上的"机械眼球"：白/橙瓷砖拼成的球包着镜头，外绕金色轨道环，左侧细线标注，右侧参数面板 | 第 9 格 (~16.6s) drop 时球面瓷砖沿法线整体外弹、带运动模糊，节拍后再收回——主体"炸开再合拢"做节拍重音 |
| [ai-ba-reza-113363](skillry/ai-ba-reza-113363.jpg) | 49s | 浏览器里的 "Blackwell Silicon to Scale"：从机柜 → GPU → L2 缓存 → SM → 逻辑单元 → 硅原子一路连续放大，最后再拉回机柜 | powers-of-ten 式连续推镜：每一层都是实体 3D 场景，右侧常驻一把竖向比例尺（标 1 m…0.2 nm），左下角字幕交代层级；我们可以从手机一路推进芯片/原子，再拉回来 |
| [ajthemongol-318512](skillry/ajthemongol-318512.jpg) | 51s | 浏览器里的低多边形住宅 BIM 查看器：外观→木框架→剖开的玩具屋→X 光管线→施工图纸 | 同一个 3D 物体按「图层」剥开：外壳透明化只剩线框，再露出彩色管线（蓝/橙），可用于把女主模型「剥成线框/数据」 |
| [alexalbert-274839](skillry/alexalbert-274839.jpg) | 8s | 1906 年旧金山 Market Street 黑白街景，镜头沿电车轨道缓慢前推，马车穿行，尽头钟楼 | 胶片感：全黑白、颗粒、随机黑点划痕、轻微曝光闪烁，一个恒定前推镜头就能撑满 8 秒，适合做"回忆/旧时代"插段 |
| [allforbigfire-029657](skillry/allforbigfire-029657.jpg) | 25s | 竖屏低多边形战队机器人：喷气机、赛车、坦克逐一登场，然后三机合体，大字"合体完了" | 背景从天空切到深紫底加蓝色放射速度线（合体时），定格时再换成金橙放射太阳光芒，SFX 大字压在画面边上 |
| [anilraok-009118](skillry/anilraok-009118.jpg) | 42s | 竖屏：木质拼字块长着亮晶晶的眼睛，自己跳进填字格，Q 块有害怕/生气的表情，最后撒彩纸，落到 2D 海报 | 字母本身就是角色：方块上贴两颗高光眼球加一道眉线，靠眉毛角度演情绪，一群字母排队跳进格子 |
| [anirockshady-032809](skillry/anirockshady-032809.jpg) | 57s | 竖屏讲梯度下降：橙峰青谷的 3D 损失曲面，白球沿虚线点滚到谷底 | 曲面边缘直接溶进棕→墨绿的竖向渐变底，没有硬边；谷底青色自发光把视线钉住 |
| [axtonliu-290566](skillry/axtonliu-290566.jpg) | 38s | 鹈鹕在日落木栈桥上骑自行车，海面反光，结尾大全景出片名 | 贴地极低机位拍踏板和车链（第 5–6 格 ≈14–17s），再切鸟头特写；片名放在全景天空的留白里，不压主体 |
| [bthreeagency-827092](skillry/bthreeagency-827092.jpg) | 11s | 浅灰底上一台手机，徽章解锁：金色六边形徽章+光圈+金粉，镜头推近手机 | 手机不是贴黑底，而是放在浅灰无缝背景上带柔和投影；推近时手机边缘带运动模糊（k8–10），屏幕 UI 就是一个「物件」 |
| [buildfastwithai-597035](skillry/buildfastwithai-597035.jpg) | 79s | 低多边形日式五重塔场景漫游：樱花、鸟居、雪山，进塔内看藻井和发光水晶球，之后切夜景 | 同一场景白天→夜晚换光：天空变深蓝、窗户变暖黄发光、樱花变紫，几何不动只换灯光和材质色 |
| [builtbysketch-114092](skillry/builtbysketch-114092.jpg) | 23s | 手机里的 3D 球场模型 app：航拍环绕，白天切到夜晚打开泛光灯，最后看台坐满人 | 同一个 3D 模型在白天和夜晚/灯光之间切换，灯塔打出锥形光，观众席点亮，环境大变 |
| [curieuxexplorer-272483](skillry/curieuxexplorer-272483.jpg) | 51s | 泰姬陵 3D 模型，带 UI 面板，“爆炸视图”把各层拆开悬浮并挂标签 | 结构按层沿 Y 轴拉开，层间用半透明金色线框补出体积，每层引出细线标签 |
| [demitiyageekzen-818523](skillry/demitiyageekzen-818523.jpg) | 30s | 滕王阁：日落湖面→紫色暮色→夜里楼阁点灯、湖上漂河灯，竖排诗句 | 第 6 格 (~12s) 天空云纹被做成流体扭曲的"液态云"，整片天空从粉到紫慢慢换色，一个固定机位靠色温叙事 |
| [eigeorguy-813651](skillry/eigeorguy-813651.jpg) | 6s | 浅灰摄影棚底上一台手机，屏幕里是装着大本钟小镇的雪花水晶球，彩色纸屑在球里旋转 | 手机放在浅灰渐变「摄影棚」底上加柔和投影，屏幕里放一个 3D 玻璃球小世界 = 2D 屏幕里嵌 3D，四周不是黑 |
| [ewashoku-201053](skillry/ewashoku-201053.jpg) | 49s | 竖屏日式极简电动山地车官网，滚动时车身拆开露出电池/电机并标注 | 米白无缝影棚底 + 物体一部分出画、一部分虚焦（景深），物体永远有「地面」和阴影，不漂在虚空 |
| [gmgmgm1545-245507](skillry/gmgmgm1545-245507.jpg) | 50s | 黄铜潜水钟机器寄居蟹提灯探险：暗海底→红色珊瑚林→紫色发光洞→冰晶洞；结尾拉远，整个世界在一只手托着的水晶球里 | 结尾大拉远：原来整片世界装在桌上的水晶球里，旁边有台灯、窗户——给"黑底"一个物理容器 |
| [goofyninjaaa-315331](skillry/goofyninjaaa-315331.jpg) | 42s | "床放得下吗"：左边 2D 平面图、右边 3D 等轴房间同步，逐个试摆位，碰撞处标红，热力图搜索 | 2D 平面图和 3D 等轴视图左右分屏同步演示，同一物体在两边同时动 |
| [iamtanzil-675031](skillry/iamtanzil-675031.jpg) | 12s | 白底网页头图：金蓝铠甲星辰守卫立绘，左侧细体大标题 | 换姿势时整张立绘加径向模糊，中心一颗蓝色光球闪白，把模糊当成转场的遮挡 |
| [ishuagra02-678129](skillry/ishuagra02-678129.jpg) | 60s | 粒子风格圣莫尼卡海滩与码头，日出→白天→码头下→夜晚灯串 | 第 5 格 (~20.7s) 镜头钻到码头桩柱下，一排排柱子透视排到远处消失点，环境本身形成画框 |
| [jarvis11x-544635](skillry/jarvis11x-544635.jpg) | 10s | 低多边形卡通夜景小镇，蓝马尾白波点裙女孩在石板路上奔跑，镜头跟在背后，结尾拉到港口月亮彩灯 | 背后跟拍 + 两侧暖色路灯/花箱往后掠过，给人「在一个世界里跑」的纵深；结尾机位抬高露出月亮和彩灯串 |
| [kewai386772-276947](skillry/kewai386772-276947.jpg) | 22s | 玻璃+发光边框的十二面体/二十面体，镜头钻进内部是无限镜面万花筒，金色光环漂浮 | 暗色影棚里物体有地面反光和顶光；钻进物体内部 = 进入无限反射空间（进入/退出都是同一个推拉镜头） |
| [ksmialowski-473410](skillry/ksmialowski-473410.jpg) | 30s | 浏览器 3D 游戏宣传：雾气森林石板路、黄蓝方块吉祥物、树屋，转进室内客厅，电视里在播吉祥物；蓝底品牌尾卡 | 场景里的电视/屏幕播放角色自己的画面（屏中屏），把 2D 层自然嵌进 3D 房间 |
| [kum1ta-740521](skillry/kum1ta-740521.jpg) | 30s | Claude Code 会话被做成 3D 低多边形办公室：航拍看园区，推近到工位上的小人举手、靠椅，再切到真终端，最后展示日夜切换 | 从航拍整个小世界一路推进到单个角色的特写（第 5–7 格，约 10–15 秒），人物动作（举手、伸懒腰）就是状态提示 |
| [levon96-651291](skillry/levon96-651291.jpg) | 15s | 物流品牌片：夜间公路追卡车，头顶绿色路牌写卖点，点阵美国地图，LED 点阵大字 | 文案直接做成世界里的绿色高速路牌，卡车从下面开过，文字属于场景而不是贴在屏幕上 |
| [lribes4-742305](skillry/lribes4-742305.jpg) | 23s | 森林里一座由多栋房子堆成的童话塔楼，环绕→推近→拉远 | 第 12–15 格 (~18–23s) 镜头往后拉时前景树冠依次入画挡住下缘，主体缩小但四周被树填满，不留空底 |
| [mdaman010-111079](skillry/mdaman010-111079.jpg) | 98s | 浅灰白编辑风 3D 讲解「AI 数据中心」：输电线 → 机房 → 机柜 → 爆炸图拆开的 Blackwell 芯片 → 冷却管 | 物体放在带雾的浅灰无限地面上，不用黑底；芯片按层上下拉开成爆炸图（第 9 格 ≈58s），每层一根引线标签 |
| [michaelzsguo-782312](skillry/michaelzsguo-782312.jpg) | 120s | 2 分钟美国 250 年史，羊皮纸色剪影动画（自由钟、火车、硫磺岛、登月） | 转场用「颗粒墨迹/沙子溶解」：画面边缘像被沙子吃掉一样成块碎开，露出下一场景 |
| [morse-369333](skillry/morse-369333.jpg) | 15s | UI 小组件微交互合集：表情反应条、星级、日历、取色器、价格卡、进度环，每段换纯色背景 | 纯色背景上放一个半透明大圆环（左上）+小圆点（右上）+圆角方块（右下）三件装饰，简单就把"空底"变成有设计的底 |
| [myonisto-923578](skillry/myonisto-923578.jpg) | 8s | 虚拟新闻演播厅：镜头缓慢推进，墙上的大屏被六边形灯框包着，地面是镜面反射，有橙蓝灯带 | 屏幕嵌进一整套"场景建筑"里：六边形灯框、两侧竖向灯柱、镜面地板倒影，镜头拉远时四周全是有设计的结构，没有空黑 |
| [nft-chen-350878](skillry/nft-chen-350878.jpg) | 14s | 俯拍小螺旋桨飞机穿过紫色卡通体积云，底下是橙粉色日落海面，白色速度线 | 风格化云团（紫色块体+橙色边缘光）和海面一起当环境，镜头跟飞机做滚转，天地颠倒 |
| [nicolamanzini-156628](skillry/nicolamanzini-156628.jpg) | 35s | 桌上的圆鱼缸，彩色鱼，背景是红白竖条纹墙 + 棋盘地 | 玻璃折射把身后条纹墙弯成弧形（第 9 格 ~20.6s），一个透明球体就让背景"有戏" |
| [per-simmons-944727](skillry/per-simmons-944727.jpg) | 41s | MANA 马黛茶饮料网站的滚屏录屏：插画花朵、罐子在各段之间穿行、大字 FLAVORS、三色口味栏 | 一只饮料罐当「常驻道具」，跨越多个版块一直在画面下方（第 2–7 格 ≈6–19s），把不同页面串起来 |
| [raphaelaubryy-190360](skillry/raphaelaubryy-190360.jpg) | 15s | 动效简历 showreel：SHOW REEL → 几何形 → 像素 5.5 → 粒子 OPUS → 流体 → 文字墙 → 3D 立方体 | 文字墙：多行大字反向横向滚动，中间一条色带上是主标题（k11–12），可做 P(DOOM) 副歌背景 |
| [raphaelaubryy-687877](skillry/raphaelaubryy-687877.jpg) | 20s | "Does ChatGPT know you" 品牌扫描广告：米白底打字标题→12 张 ChatGPT 手机截图网格→弧形手机墙带地面倒影→"Cited in 4 of 12" | 手机截图排成弧形内凹墙，地面有倒影，中间一张亮、两侧压暗虚化（第 8–9 格） |
| [sanjay-khadka07-620029](skillry/sanjay-khadka07-620029.jpg) | 42s | "Latentown"：等轴测低多边形小城加右侧新闻栏，白天切到夜晚，新闻弹窗指向城里的建筑 | 把信息（新闻）挂在 3D 城里对应的楼上，夜景时窗户亮灯、路灯亮起 |
| [sayan-shanky-868515](skillry/sayan-shanky-868515.jpg) | 98s | 浅灰白低饱和 3D 科普：AI 数据中心从园区→机柜→芯片分解→冷却管道 | 背景用浅色雾化无限地面，远处淡出，没有地平线硬边；电力/冷热流用黄、红、青色管线流动表示 |
| [souradip3000-800291](skillry/souradip3000-800291.jpg) | 25s | 网站首屏：金色粒子树→叶子→带环星球→森林→幼苗，左侧大字 | 同一团粒子在分屏间变形成不同物体（第 1–8 格），粒子形态本身就是转场 |
| [techartist-786274](skillry/techartist-786274.jpg) | 20s | 一叶小船从安纳西老城运河驶出，穿过石拱桥洞，眼前是粉色夕照群山倒映在镜面湖上 | 拱洞取景揭示（第 4–5 格 ≈5.7–6.9s）：画面先被桥洞框成暗框，洞口里是粉色山景，船穿出后豁然开朗 |
| [truenyl-447745](skillry/truenyl-447745.jpg) | 59s | 卡通渲染湖边草原与房子，飞越镜头经日落、夜景，最后拉高到航拍湖区 | 一段连续镜头里时间从正午→金色日落→紫色黄昏→星空夜，用天空色+窗户灯光讲时间推进 |
| [twoclipping-000267](skillry/twoclipping-000267.jpg) | 20s | hooklab UGC 广告：打字标题→18 张人像竖卡网格→卷成弧形墙→压扁成一条环形胶片带→单手机特写 | 卡片网格→弯成圆柱墙→压成细环带的三段变形，数量感很强（第 7–8 格） |
| [twoclipping-496100](skillry/twoclipping-496100.jpg) | 29s | 奶白底上一个黑点长成圆形窗口，露出红门，接着九宫格图片，放大进拱门风景，手机浮在蓝色丝带上，最后变成挂在墙上的画框 | 一个圆形遮罩像传送门一样打开，镜头钻进图里全屏（第 1–3 格，约 3–6 秒）；手机浮在流动的 3D 蓝色丝带上（第 7 格，约 14 秒） |
| [vectorcrossprod-436573](skillry/vectorcrossprod-436573.jpg) | 10s | 黑色电子盒爆炸装配→接线→卡上 DIN 导轨，引线标注 | 墨蓝径向渐变底+四角暗角，物体永远落在中心亮区，不是纯黑 |
| [viggle-pinoc-434495](skillry/viggle-pinoc-434495.jpg) | 55s | 浏览器版 Minecraft 第一人称盖木屋，带光影 | 看不出可借的；只是写实光照体素 |
| [wzarok-283635](skillry/wzarok-283635.jpg) | 24s | 卡通橘猫过马路：看红绿灯、躲车、叼到鱼，结尾土耳其语标题 | 插一个红绿灯黄灯的大特写（第 9 格 ≈14s）当节拍点，再切回猫；用插入特写换节奏 |

### Explainers（47 个）

| slug | 时长 | 一句话内容 | 最值得借的一个技巧 |
| --- | --- | --- | --- |
| [0xlangeai-178533](skillry/0xlangeai-178533.jpg) | 56s | 中文手绘白板教程：小人、铅笔边画边出现流程框 | 一支铅笔光标在画面上「画出」每个元素（笔在哪，东西就在哪长出来） |
| [0xnfrith-068999](skillry/0xnfrith-068999.jpg) | 53s | 新野兽派扁平讲解：粉/青/黄/绿卡片粗黑描边，讲多机器抢任务、租约过期 | 角落用斜纹警示胶带、星形爆炸贴纸、小标签填空白；配色和我们的粉/薄荷/黄几乎一致 |
| [0xvalure-331584](skillry/0xvalure-331584.jpg) | 10s | 黑白品牌片：输入框打字，逐词大字出现，PAYBOX 字样一行行满屏滚动，3D 立方体转成 logo，logo 铺满整屏再收回 | 把 logo 等轴铺成满屏图案（第 11–12 格，约 7–8 秒），镜头拉远后再收回成一个；满屏多行字幕反向滚动并带运动模糊 |
| [1stnoel-603851](skillry/1stnoel-603851.jpg) | 60s | 奶白纸色 App 讲解：左边衬线大字，右边手机 mockup，词语高亮同步 | 左侧大字高亮的词和手机屏里的词用同一种桃色底同时高亮，让 2D 文案和手机界面“连”起来 |
| [acoramaa-053577](skillry/acoramaa-053577.jpg) | 44s | 竖屏"尺度研究"：台式机→散热器→CPU→晶圆→核心→布线→晶体管→硅原子，再拉回 | 连续推镜穿层（第 0–13 格 ~1–37s），每层右侧有视场标尺刻度随缩放滑动，一个镜头讲完多个尺度 |
| [ajith-io-562538](skillry/ajith-io-562538.jpg) | 40s | DistilBook 预告：纸页上的字母化成金色粒子飞起，聚成燃烧的太阳；成千卡片、文字环绕地球 | 字母从纸面剥离成金色发光粒子流（第 1 格 ≈3.8s），旋转收拢成球再变成燃烧的太阳（第 2–3 格 ≈6–9s） |
| [alex-prompter-997524](skillry/alex-prompter-997524.jpg) | 34s | 从 Claude 对话框输入 prompt 开始的浅蓝通讯推广片 | 开头真实复现聊天输入框逐字打字，再切到成片——「聊天界面 = 片子的起点」 |
| [amberpromptai-345137](skillry/amberpromptai-345137.jpg) | 47s | 水墨中秋：一笔墨线画出山峦→晕染→月亮、梅枝、小屋；墨笔圈出人物，圆圈化为月饼纹样 | 一笔墨圈画出圆形"窗口"，框住人物，再变成下一个图案（第 11–15 格） |
| [amitsingha89-780553](skillry/amitsingha89-780553.jpg) | 54s | 手工纺织品网站介绍：米色网页风格版面，图片网格加衬线标题 | 基本是幻灯片式网页排版，可借的少；图片卡片带轻微倾斜和投影 |
| [arthurkatcher-604161](skillry/arthurkatcher-604161.jpg) | 40s | 深色带暖橙辉光：讲 coding agent 循环，context window 进度条逐轮变长，最后被填满 | 底部一根分段彩色“上下文条”随剧情越来越长，最后把整条塞满，用来表示“被塞满/被吞没” |
| [astrothewizard-618782](skillry/astrothewizard-618782.jpg) | 60s | 笑脸光子从太阳核心挤出、飞 8 分钟、落进人眼 | 第 10 格 (~39s) 整屏白闪 + 淡字 "POP!" 做场景切换；第 13 格 (~51s) 切到占满全屏的大眼特写收尾 |
| [charlesmendez-476517](skillry/charlesmendez-476517.jpg) | 57s | 深黑 + 霓绿的 SaaS 预告：ChatGPT 广告、绿色发光球 AI 助手 "Nova"、聊天记录、手机 | AI 角色 = 一个发光绿球，外圈一圈随声音跳动的放射状短线（第 7–8 格 ≈27–30s），旁边是聊天气泡 |
| [chudry223-081860](skillry/chudry223-081860.jpg) | 32s | 3D 光学台讲景深：镜头组、玻璃对焦平面、低多边形小山村模型 | 一块半透明玻璃板（对焦平面）插进 3D 场景，板上显示 2D 投影画面，板外 3D 虚焦——2D 屏与 3D 世界同框 |
| [cyrilxbt-149036](skillry/cyrilxbt-149036.jpg) | 44s | 竖屏落沙粒子模拟，沙/水/岩浆堆积流动，左上计数"PARTICLES" | 开头第一帧直接放最混乱的 10 万粒子终局，再倒回从少量开始——front load |
| [deedydas-252537](skillry/deedydas-252537.jpg) | 26s | 推理创业公司短片：白底对话框"Thinking"，紫底大字 WASTE，GPU 利用率格子，满屏 token 标签，巨大的"無駄"汉字水印 | 满屏彩色 token 标签像壁纸一样铺满，中间浮一张白色数据卡（第 6–7 格，约 11–12 秒）；也就是"被文字淹没"的底 |
| [emollick-019567](skillry/emollick-019567.jpg) | 75s | 讲递归：每深一层就换一种完全不同的视频风格（扁平插画、终端、8-bit、自然纪录片、黑白侦探、儿童节目、电视购物、预告片），顶部面包屑显示深度 | 上一层的风格被装进下一层画面里的电视/屏幕中（k8 卡通主持人指着电视，电视里播着预告片），然后推进屏幕换风格 |
| [explorations-iq-921682](skillry/explorations-iq-921682.jpg) | 36s | 分子轨道交互台：发光半透明轨道云，暗色 UI 面板 | 整个应用画面缩成一个带圆角的窗口，四周留紫粉渐变边框——"屏幕放在有颜色的托盘上"而不是黑底 |
| [garmdotcom-987439](skillry/garmdotcom-987439.jpg) | 51s | 手绘纸纹房间里，男人和小机器人伏案，logs/JSON/tool output 纸张越堆越高把人埋了，token 电池见底 | 一个透视盒子房间当舞台；纸张从天而降堆到把人埋住（第 3–5 格 ≈11–18s），左侧电池从绿变红空 |
| [henkvaness-975279](skillry/henkvaness-975279.jpg) | 337s | 米色纸面的数据解读片：用户问 AI 的问题样本、八种错误、各模型数据条 | 深色聊天气泡里的问句关键词用红底高亮，一眼看出「问题出在哪句话」 |
| [hunzai-842605](skillry/hunzai-842605.jpg) | 32s | 扁平矢量讲树：推进到叶子、地下剖面根系、雨、左右分屏凉爽森林 vs 炎热城市，拉远成森林 | 地面剖面分层（草/土/深土）让下半画面有内容，不空黑 |
| [iniyanai-856596](skillry/iniyanai-856596.jpg) | 35s | 机械键盘轴体 3D 讲解：键帽爆炸图，按下，背景整块换成橙、蓝，最后是一整把彩色键盘 | 每换一个概念，整块背景切换成满屏纯色（棕/蓝），主体保持在中间（第 6–7 格，约 14–16 秒） |
| [irinatoxi-962937](skillry/irinatoxi-962937.jpg) | 22s | 从桌上的手机一路推镜：拆开→主板→芯片→晶体管→硅原子→原子核 | 连续推镜不切，每一层尺度用不同材质和色块区分，最后停在发光的原子核上 |
| [kgonia7-746268](skillry/kgonia7-746268.jpg) | 60s | 十的幂：小船→海面→地球→太阳系→银河→可观测宇宙 | 第 15 格 (~58s) 最终把整个宇宙收成一颗 CMB 纹理球体摆在画面中央，"缩到最小就变成一个物件" |
| [kloss-xyz-067876](skillry/kloss-xyz-067876.jpg) | 172s | 172 秒 AI 简史：深灰底 + 橙色强调，每个里程碑一张卡（神经元、图灵测试、ELIZA、AI 寒冬、AlphaGo、Transformer…） | 主标题后面叠一个巨大的低透明度年份数字（第 13 格 GEMINI 背后的 "2023"），做出层次 |
| [koldo2k-778767](skillry/koldo2k-778767.jpg) | 20s | 复古拼贴无限变焦：怀表表盘里是风景→风景里有相机→相机镜头里是沙漠→放大镜→湖→手镜→回到怀表 | 每个画框物件的「窗」里是下一个世界，一直推进去就到下一场，首尾闭环（最强转场参考） |
| [konstantinsaifo-501736](skillry/konstantinsaifo-501736.jpg) | 35s | 猛禽 3 发动机网页 3D 剖面：紫色尾焰、管线高亮、爆炸视图，最后放在圆形展台上 | 物体放在有轮廓光的圆形展台+昏暗机库背景上，缩小时不是悬在黑里 |
| [konstantinsaifo-587629](skillry/konstantinsaifo-587629.jpg) | 43s | 核聚变反应堆放在一个布置好的 3D 实验室里：墙上有环形灯、植物、货架，镜头推进到舷窗，窗内粉色等离子旋转 | 物体不放在虚空里，而是放在一个有家具、墙面环形霓虹灯、深色木墙的房间；镜头推进舷窗，窗内全是粉色发光的涡流（第 3–5 格，约 10–15 秒） |
| [kureshirfan-386691](skillry/kureshirfan-386691.jpg) | 36s | 深蓝 2D 图解：地震怎么发生（板块、应力、断裂、地震波、震级） | 应力积累用断层上一条慢慢变亮的橙色辉光带，加底部进度条，最后“啪”一下断开复位 |
| [linearuncle-971663](skillry/linearuncle-971663.jpg) | 457s | Manim 风格讲导数，中文字幕，深蓝底 | 第 12–13 格 (~200s) 圆形放大镜框局部，镜内放大到曲线变直线 |
| [miguel07code-091611](skillry/miguel07code-091611.jpg) | 42s | 竖屏讲傅里叶：旋转圆一个套一个叠加，从正弦到方波，最后画出高音谱号 | 本轮圆链（epicycles）实时描出复杂轮廓（第 11 格 ≈30s 301 个圆画谱号），底是深海军蓝径向渐变而不是纯黑 |
| [moguzbulbul-215591](skillry/moguzbulbul-215591.jpg) | 42s | 极简 CRM 界面重设计讲解，UI 与蓝色线框图叠化切换 | 同一界面在「实拍 UI」与「青色线框蓝图」之间叠化，用来讲结构 |
| [nathanwilbanks-981110](skillry/nathanwilbanks-981110.jpg) | 38s | 夜林篝火，遮幅黑边，推近火焰和木柴，火渐熄灭 | 深蓝天+黑色树林剪影+地面暖光圈，暗场景也有三层深度 |
| [nikolajankovic-616097](skillry/nikolajankovic-616097.jpg) | 58s | 铅笔手绘定格动画讲 DeFi：纸面上的温度计、价格线、床上睡觉的人，底部是胶带贴的字幕纸条 | 字幕写在用胶带贴住的纸条上，钉在画面底边的黑框里，不压主体；12 帧/秒的一拍二抖动感 |
| [nybobs-680050](skillry/nybobs-680050.jpg) | 26s | 浏览器实时物理：11 万块粉彩积木墙被大球撞碎，还有绳子、弹簧、布料 | 浅米色棋盘无限地面向远处雾化，物体撞碎时成千块马卡龙色方块飞散 |
| [parkerrex-701462](skillry/parkerrex-701462.jpg) | 18s | 令牌桶限流器，终端风，数字+阶梯折线 | 桶空时数字变红 "0"、边框变红；状态靠颜色而非动画——可忽略 |
| [rakhsh-tech-544921](skillry/rakhsh-tech-544921.jpg) | 26s | 竖屏和纸底，毛笔逐笔写出 弦/笛/皮/鈴/泡/音，右上角字表累加，最后盖红印 | 每个字背后晕开一团灰色水墨（字写之前墨先晕开）；已讲过的字缩到右上角竖排累积 |
| [retropunkai-277590](skillry/retropunkai-277590.jpg) | 60s | 竖屏手绘漫画风讲拉斯维加斯 Sphere 建造史，结尾金属乐海报 | 同一个球体从脚手架线框→网格外壳→点亮→变成绿球/红球，一个主体贯穿全片换皮 |
| [ror-fly-880547](skillry/ror-fly-880547.jpg) | 30s | 手绘 Negroni 调酒步骤：酒瓶倒酒进杯，刻度线，底部步骤进度条 | 液面按刻度一格格上涨+侧面刻度标签，可做"P(doom) 杯子被倒满" |
| [sarut0bisasuke-069973](skillry/sarut0bisasuke-069973.jpg) | 30s | 白俄罗斯鸡尾酒配方：左边手绘玻璃杯逐步注入冰、伏特加、咖啡酒、奶油，右边清单逐项打勾 | 液体分层注入加量杯刻度，右侧清单同步打勾（信息和画面左右分区） |
| [stefanostraus-971191](skillry/stefanostraus-971191.jpg) | 32s | 暗蓝 3D 实验室：活塞发动机 vs 电机，红热活塞特写；最后是磁流体“刺猬” | 黑色镜面液体在电流升高时长出成片尖刺（k13–15，约 27–31s），“液体变活物”的质感 |
| [stephanferraro-224281](skillry/stephanferraro-224281.jpg) | 30s | 程序生成的雪山地形块，缓慢旋转 | 地形块放在同色的无限草地平面上，远处雾化接天空，块的边缘几乎看不出——拉远不露底 |
| [sudo-kiran-254201](skillry/sudo-kiran-254201.jpg) | 30s | DistilBook 产品片：暗网格地面上卡片乱飞 → 浅色粉彩渐变底 + 漂浮文件标签 → 15 种风格缩略图墙 | 主体居中时四周漂几张半透明虚化的小卡片/文件标签（第 3 格 ≈6.6s、第 15 格 ≈29s），把空白四周填上 |
| [sudo-kiran-335993](skillry/sudo-kiran-335993.jpg) | 30s | DistilBook 推广：PDF 变视频，手绘叶子插图随声波画出 | 暗底中央一颗小光点突然炸成巨大「20+」和地球点阵（k8→k9），从一个点炸出一个世界 |
| [tak3sh8-441895](skillry/tak3sh8-441895.jpg) | 308s | 手绘白板讲 SK 自旋玻璃、复本对称破缺，马克笔实时书写 | 白板挂在深灰墙上，内容始终在"板"里，画面边缘是墙而不是空黑 |
| [tomandrieu96707-875264](skillry/tomandrieu96707-875264.jpg) | 52s | 滑板地图 app 的纸本拼贴故事：横格纸、胶带、抠图真人、黄色年份标签、地图底，逐年推进 | 纸片拼贴：抠像人物带白色贴纸描边，便签和胶带斜贴；换场时一块彩色纸板从侧面滑过（第 1 格约 5 秒米黄，第 8 格约 27 秒淡紫） |
| [verbove-268381](skillry/verbove-268381.jpg) | 20s | 浅灰底 App 片：胶囊按钮→输入框→卡片→黑圆→点阵地球→卡片，一路变形 | 一个 2D 黑色圆点直接长成可转动的 3D 点阵地球（k4→k5，约 5.7→6.9s），UI 元素和 3D 物体是同一个东西 |
| [voxyz-ai-345550](skillry/voxyz-ai-345550.jpg) | 22s | 暗色实验室里的引力透镜装置（望远镜、透镜环、滤镜轮），最后切到黑洞吞星系的透镜画面 | 第 13–15 格 (~18.5–21s) 黑盘周围把背景星系拉成亮环（爱因斯坦环），星点沿环扭曲——现成的"被吞"视觉 |

### Games（68 个）

| slug | 时长 | 一句话内容 | 最值得借的一个技巧 |
| --- | --- | --- | --- |
| [0xchuckstock-879327](skillry/0xchuckstock-879327.jpg) | 28s | X-wing 小队攻击歼星舰的 3D 游戏录屏 | 爆炸用大面积光晕球+整屏白闪（k13），暗宇宙里有紫色星云带 |
| [0xpai-eth-635565](skillry/0xpai-eth-635565.jpg) | 40s | 复利 QUEST 8-bit：像素夜城标题→电子宠物→马里奥跳坑→RPG 战斗"通胀怪出现了"→吃豆人→升级→点击放置→俄罗斯方块→通关→THE END | 每 3 秒换一种游戏类型讲一个点；RPG 战斗屏（第 5 格 ~13.8s）有 HP 条和"花掉/存着/投资/逃跑"菜单 |
| [0xrathi-511319](skillry/0xrathi-511319.jpg) | 45s | Tron 风光轮游戏：霓虹网格地面、粉色合成波夕阳和山、光墙、带环行星、六边形地面、俯视竞技场 | 合成波地平线：网格地面、剪影山、半个大太阳、粉青霓虹光墙（第 7 格，约 21 秒），配色可以直接换成我们的粉/薄荷 |
| [agentgamesbot-355554](skillry/agentgamesbot-355554.jpg) | 38s | 像素横版：墨黑小生物在墨迹地面上跑，右下一只像素手握笔在前方现画地面，ABSORB / CLOSE CALL 标签 | 画面里露出“作者的手”，实时画出角色脚下的路（全片，k0 约 1.2s） |
| [aisongman-461057](skillry/aisongman-461057.jpg) | 15s | 像素风卡牌对战（类炉石） | 无可借 |
| [akokoi1-469188](skillry/akokoi1-469188.jpg) | 31s | 低多边形电力机车模拟：绿地站台发车，速度 0→149 km/h，多机位切换 | 左下角速度数字随切镜连续上涨，数字本身就是进度 |
| [alex-vainshtein-195332](skillry/alex-vainshtein-195332.jpg) | 14s | 1990 年代城市俯视角 GTA 式游戏录屏，白天到夜晚 | 俯视城市里车灯/路灯在夜景下成暖色光斑 |
| [anduraio-570761](skillry/anduraio-570761.jpg) | 30s | 低多边形驯马游戏：风吹高草、潜行、节拍圈"PERFECT!"安抚、骑行、白雾转场、谷仓回家 | 整屏泛白雾化转场（第 11 格 ~21.3s）；节拍圈 PERFECT 反馈 |
| [angie-carel-954689](skillry/angie-carel-954689.jpg) | 41s | "果冻伙伴"：两个胶质 3D 小人在粉色波点房间里蹦跳，房间主题切到迪斯科（暗底彩色圆点），再切到霓虹街机（合成波网格） | 角色不动，房间主题整个替换：粉色波点 → 深色迪斯科彩点 → 合成波网格（第 11–13 格，约 30–35 秒） |
| [aniketjart-094296](skillry/aniketjart-094296.jpg) | 26s | 卡通着色开放世界：骑喷气坐骑飞过紫色树林、湖、白色神兽、粉紫岩柱群 | 远景用一层层粉紫/灰蓝岩柱和卡通云收住地平线，天空是亮蓝渐变，不留空底 |
| [bilimfili1-459762](skillry/bilimfili1-459762.jpg) | 50s | 竖屏摩托导航 App：墨青底、手机界面浮在一条伸向地平线的 3D 发光路上 | 暗青底上画极淡的等高线/地形线，3D 蓝色路带从脚下延伸到远方，手机悬在路旁——UI 有了"地面" |
| [blitast-studio-257328](skillry/blitast-studio-257328.jpg) | 36s | CatWalk：黑猫夜里沿运河码头走，路过暖光小店，收集青色萤火虫，最后在灯塔栈桥下萤火组成星座 | 萤火虫粒子一路跟着角色，最后在天上排成星座图形（第 13 格 ≈29s） |
| [boona11-415751](skillry/boona11-415751.jpg) | 31s | 竖屏厚涂油画风海滩游戏，海浪和沙滩都是笔触 | 整个场景是厚涂颜料笔触（impasto），加速时变成纵向拖影（k6–7） |
| [brainwavepub-812667](skillry/brainwavepub-812667.jpg) | 53s | 投石机实验室：浏览器窗口浮在虚化桌面上，手绘设计草图模式↔3D 模拟模式切换，塔倒塌 | 同一构图在手绘草图纸和 3D 渲染之间交叉溶解（第 1–4 格 ~4.9–14.8s） |
| [brenbuilds-386902](skillry/brenbuilds-386902.jpg) | 20s | 写实风黄石公园：人物走在栈道上，看河、野牛、大棱镜温泉 | 可借的少；远景航拍收尾 |
| [buildfastwithai-582551](skillry/buildfastwithai-582551.jpg) | 39s | 程序化生成 A-1H 攻击机：米色棋盘地面展示各部件，然后起飞飞越丛林 | 地面网格向远处雾化成浅绿灰，模型下有柔和接触阴影 |
| [chukinice-426722](skillry/chukinice-426722.jpg) | 41s | 彩色 3D 平台跳跃大厅：一排拱门传送门通往不同世界（熔岩、糖果、深海） | 第 5–7 格 (~14–19s) 地上彩色引导带通向各个拱门，门洞里能看到另一个世界；第 8 格 (~22s) 穿过门进入海底关卡 |
| [codrops-340299](skillry/codrops-340299.jpg) | 15s | three.js 可走动的 90 年代街机厅：霓粉/青 INSERT COIN、星星地毯、走近机台钻进游戏、出门变 2D 像素横版 | 推进机台屏幕 → 屏幕白光吞满画面（第 6 格 ≈6.1s）→ 进入 3D 游戏世界；退出时游戏画面缩成倾斜平行四边形卡片滑走（第 8 格 ≈8s） |
| [curieuxexplorer-519730](skillry/curieuxexplorer-519730.jpg) | 58s | 暗色空间里的地砖跑酷，地砖发金色裂纹、掉落 | 地砖上长出发光金色裂纹然后塌落（k9–13），可做地面崩坏 |
| [curieuxexplorer-772215](skillry/curieuxexplorer-772215.jpg) | 30s | 孟买清晨步行低多边形：巷子、茶摊、菜市、镜头升到屋顶看城市、穿过路口看到大海 | 远景高楼用逐渐发白的剪影融进雾霾天空（第 8–9 格 ~16–18s），没有黑边 |
| [danielkan-059523](skillry/danielkan-059523.jpg) | 18s | 竖屏太空采矿：飞船采小行星，蓝色推进器光，青/橙星云，角落里露出带环行星的弧形 | 空白处用青色、橙红星云团和近景行星环弧填满，不留纯黑（第 13–15 格） |
| [deeprajo1-834106](skillry/deeprajo1-834106.jpg) | 52s | 快艇竞速答题：青绿海面，终点格子旗，选答案过拱门 | 普通；正确/错误拱门用绿/红发光弧，可借做选择画面 |
| [deifosv-786581](skillry/deifosv-786581.jpg) | 30s | 网页网球游戏宣传：大数字压在 3D 球场上、手机、线框地球 | 同一俯视机位下球场地面颜色切换（蓝/绿/红土）表示不同场地 |
| [dmowlin-221566](skillry/dmowlin-221566.jpg) | 10s | 合成波像素太空赛车：星空公路、陨石、分数、倍率 x2→x8、SECTOR 4 冰带、SIGNAL LOST | 倍率数字 x2→x8 越来越大并变色；进新区段整幅换色调（第 13 格 ≈8.4s 由红变蓝） |
| [dreyk0o0-165270](skillry/dreyk0o0-165270.jpg) | 23s | 类 Minecraft 体素世界，光追水面、日落、雪山、海岛 | 体素世界配写实光照（水面焦散、体积光） |
| [froessell-562325](skillry/froessell-562325.jpg) | 59s | 警车追逐街机游戏，横放手机里，底图是彩色波浪 macOS 式壁纸，SMASH 连击字 | 手机外是彩色波浪壁纸，而不是黑 |
| [gandamu-ml-220530](skillry/gandamu-ml-220530.jpg) | 383s | 383 秒 90 年代 demoscene：4:3 CRT 画框、等离子、扭转文字丝带柱、镭射元球、星系、体素球、环面结、网格隧道、棋盘反射球、3D 棋盘字、最后所有场景变成星空里漂浮的小屏幕 | 结尾把前面所有场景做成在星空里斜着漂浮的一块块小屏幕（第 14 格，约 347 秒）；3D 棋盘格大字立在反射地面上，背后有放射紫光，然后字母一个个倒塌（第 10–11 格，约 250–275 秒） |
| [ggsimm-535814](skillry/ggsimm-535814.jpg) | 35s | ASCII 字符洞穴：紫色 # 号墙，发光字符飞船 <o=，红色蛇，结尾红字 “the hull gave” | 整个世界用 ASCII 字符拼成，靠字符亮度/颜色做远近 |
| [happycapyai-634965](skillry/happycapyai-634965.jpg) | 10s | 糖果色炸弹人棋盘，四周是云朵和浮空小岛 | 棋盘外不是空白，而是云层 + 浮岛 + 摩天轮/花等道具包围——边缘也有设计 |
| [hellovyom-800659](skillry/hellovyom-800659.jpg) | 59s | 植物大战僵尸式 3D 塔防：同一块草坪被换成海盗、西部、未来、黑暗时代、冰窟、霓虹、侏罗纪等 11 个主题 | 同一个网格布局按段落整体换皮（第 9–10 格 ≈35–39s 是霓虹紫版） |
| [itsjdraven-557760](skillry/itsjdraven-557760.jpg) | 28s | 手机里的低多边形丛林跑酷游戏 | 手机外框四周是深绿暗角，不是纯黑 |
| [izmaelmag-282849](skillry/izmaelmag-282849.jpg) | 34s | 竖屏"Dice Corners"骰子棋：深紫星空底，倾斜 3D 棋盘红白骰子对战 | 棋盘整体倾斜/旋转换视角，边框有刻字（第 10 格 ~23s） |
| [janeloic-905802](skillry/janeloic-905802.jpg) | 51s | 类马里奥横版平台游戏：绿色世界，"WONDER!"后变成粉紫世界，最后显示得分榜 | 一个大字"WONDER!"弹出的同时，整个世界的配色从绿换成粉紫（第 6–7 格，约 21–24 秒） |
| [janlaywss-379361](skillry/janlaywss-379361.jpg) | 24s | 竖屏挪车消除：粉蓝车辆堆，上方粉蓝像素人群 | 普通；上方粉蓝人群像素块被车辆“吃掉”，可作为群像密度参考 |
| [jasperdeboer-157391](skillry/jasperdeboer-157391.jpg) | 41s | 蚂蚁巢穴经营游戏宣传：金色闪电裂纹开场、地下隧道、蚂蚁战斗 | 第 0 格 (~1.3s) 黑屏中金色分叉裂纹从中心炸开，裂纹之后露出标题 |
| [jstjs-129051](skillry/jstjs-129051.jpg) | 22s | TERMINAL: Judgment Day：红色 CRT「来自未来的传输」面板、信号衰减、LEGACY 红字、红夜城市打字射击 | 「INCOMING TRANSMISSION」面板带四角框、REC 点、信号强度条 61% DEGRADING（第 0–1 格 ≈0.7–2.1s） |
| [kenjiphang-750512](skillry/kenjiphang-750512.jpg) | 24s | 训练游戏功能展示：粉白斜条幅大字、踢击、「封」字印章、腰带升级 | 斜向双色条幅（粉/白）带大字从左上横扫入画，下一刻条幅切开露出场景（k0→k1） |
| [kepochnik-237752](skillry/kepochnik-237752.jpg) | 17s | 类 Minecraft 鸡的图鉴：左上信息卡，小鸡扑腾、下蛋、喂种子出爱心 | 喂食时冒出方块像素爱心（第 13 格 ~14.3s）；相关度低 |
| [lexnlin-241739](skillry/lexnlin-241739.jpg) | 84s | 可自由探索的奇观世界：巨大圆环门、倒悬的金字塔建筑带瀑布、浮空岛、柱林、暗室里发光的浑天仪 | 超尺度奇观建筑：倒挂的金字塔悬在半空、四角流下瀑布（第 3 格，约 18 秒）；黑暗中的同心环浑天仪中心有发光核心（第 9 格，约 50 秒） |
| [lisp-mi-139812](skillry/lisp-mi-139812.jpg) | 11s | 等距剖面楼宇：地下配送通道，楼层被切开，悬在暗底上 | 整个场景切成一块带土层剖面的 diorama，悬在暗底中央（k0，约 0.4s） |
| [llama3dstudio-012980](skillry/llama3dstudio-012980.jpg) | 44s | 低多边形秋日湖边打水漂 | 水面同心涟漪扩散（第 3、8 格），可做节拍波 |
| [loverwnl-712109](skillry/loverwnl-712109.jpg) | 36s | Clutch 竞技场游戏预告：沙地斗兽场实机、角色站在暗底光圈上配大字、熔岩地图、三人合照收尾 | 暗底上角色脚下一道细金色椭圆光圈 + 顶光暗角，当「舞台」（第 2 格 ≈5.6s、第 13–15 格 ≈29–35s） |
| [mandelduck-768972](skillry/mandelduck-768972.jpg) | 34s | 在梵高《星夜》里找猫的 3D 游戏：从画框走进画里 | 开头是挂在墙上的金框油画，镜头推进画框后，画变成可行走的 3D 笔触世界（k0→k2） |
| [maxthelion-649723](skillry/maxthelion-649723.jpg) | 49s | 低多边形地铁站：黄黑警示斜纹站台→切红色警报灯光→列车进站→车厢内部 | 同一布景从黄光切到全红警报光（第 1→2 格 ~4.6→7.6s） |
| [mayuresh-empire-687553](skillry/mayuresh-empire-687553.jpg) | 52s | 印度神话动作游戏：夜空光柱、神庙、萤火，紫色竞技场地面有发光的法阵同心圆，最后爆成金光 | 地面画发光的同心圆法阵，角色站在中心，光柱从上方打下（第 9–12 格，约 31–41 秒） |
| [mgfeller-779161](skillry/mgfeller-779161.jpg) | 31s | 帆船竞速：写实海面，薄荷色半透明风向帆形指示，橙色光柱标出航门 | 橙色竖直光柱当目标标记，远近都看得见 |
| [mozetech-471882](skillry/mozetech-471882.jpg) | 25s | 像素夜岛送信游戏，路灯光圈、星座结尾卡 | 黑暗中路灯只照亮一圈地面，其余压暗——用光圈决定视线 |
| [mrblock-096062](skillry/mrblock-096062.jpg) | 33s | SCORCH 沙漠飞行器赛车：橙色峡谷、放射速度线、BOOST!、巨大 km/h 数字、CHAIN x5 闪白 | 加速瞬间整屏过曝白闪 + 放射速度线（第 4 格 ≈9.2s），右下巨大速度数字 |
| [niegramotny-197521](skillry/niegramotny-197521.jpg) | 30s | 低多边形雪地拉力赛：铁路道口、黑冰、木桥 | 绿色路牌式标题卡直接立在 3D 场景里（k0、k13） |
| [nolit64-347627](skillry/nolit64-347627.jpg) | 87s | MapleStory 仿作：2D 横版小镇、升级、商店、夜晚蘑菇森林、Boss 登场卡"MUSHMOM"、胜利 | Boss 登场卡：画面压暗加遮幅黑边，大字"BOSS BATTLE / MUSHMOM"（第 10 格 ~57s） |
| [nqaze-939886](skillry/nqaze-939886.jpg) | 19s | 飞行模拟空战：纽约城上空飞行，HUD，敌机、导弹画中画 | 可借的少 |
| [op7418-814408](skillry/op7418-814408.jpg) | 15s | 手游开宝箱：箱子按稀有度升级（青→蓝→紫→金），闪白，开箱爆彩纸，出奖励卡 | 放射光背景+暗角，物体下面有一圈发光圆环底座，按级别换底色（k1–7，约 1.4–7s） |
| [op7418-818226](skillry/op7418-818226.jpg) | 18s | 手游抽卡动效：魔法阵上水晶发光→流星→十张卡翻开→金色放射光→SSR 卡揭晓 | 第 8–10 格 (~9.4–11.6s) 单卡居中，身后满屏金色放射光束，卡面由白过曝渐显出角色 + "SSR" 角标 |
| [opener-ai-843891](skillry/opener-ai-843891.jpg) | 32s | 仿《三国志 III》的复古蓝窗策略游戏，左边是对话文档右边是地图/武将面板 | 缩略图太小基本看不清；能看到的是蓝色渐变窗口 + 武将头像的复古 UI |
| [realfedeuru-475858](skillry/realfedeuru-475858.jpg) | 48s | 粉紫天空跳伞游戏：跳出飞机，穿过云和圆环，开彩虹伞降落 | 俯视下坠，四周白色速度线向中心汇聚，云朵从镜头边飞过（k5–8） |
| [redp314-642106](skillry/redp314-642106.jpg) | 28s | AI 学玩 2048：GAME #1 → #98,299，弹出"GAME OVER / 2048! 第一次赢 / 16384"，S 形学习曲线 | 大号局数跳变+S 曲线爬到 99.2%（第 13–15 格），可借做 P(doom) 飙升曲线 |
| [redpersongpt-284430](skillry/redpersongpt-284430.jpg) | 24s | 竖屏聊天截图 app 广告：暖米底，手机四周飘着模糊的聊天气泡和 app 图标（景深虚化），吉祥物扒在手机边，背景有巨大的淡色字 | 手机四周放几层不同景深的虚化聊天气泡/图标，缓慢漂浮，背景印一行超大淡色字当底纹（第 0–5 格）；换屏时手机带运动模糊翻转（第 7 格，约 11 秒） |
| [rehan-shei-839416](skillry/rehan-shei-839416.jpg) | 30s | 像素 RPG Hollow Crown：五职业，技能名大字，Boss 蘑菇王 | 技能名用两侧带横线的像素大字（—WORLDREAVER—）横跨画面上方，不压角色 |
| [rush3rx-342153](skillry/rush3rx-342153.jpg) | 16s | 地球化延时：同一机位，死星→极光→暴雨→变绿，巨大环状行星悬空 | 机位锁死、只让环境状态变（第 6 格 ~6.7s 暴雨灰幕是过渡），天空里的巨型行星当"天幕道具" |
| [ryzoft-887481](skillry/ryzoft-887481.jpg) | 295s | 80/90 年代卡通风三维短片：紫色星云里小行星上的灯塔，小守塔人、黑色机器人反派、飞船冲向粉色传送门，结尾圆形遮罩 THE END | 结尾圆形遮罩收缩（第 14 格 ≈267s）；背景用紫粉体积星云而不是纯黑 |
| [smallhusk-272056](skillry/smallhusk-272056.jpg) | 49s | 在旋转太空站（奥尼尔圆柱）内部的低多边形城市里行走 | 城市向上卷曲成圆筒包住镜头，中轴一根光柱；抬头看是头顶倒挂的城市（k8–11） |
| [taylorbereiter-189192](skillry/taylorbereiter-189192.jpg) | 41s | Cuphead 式 30 年代卡通射击：棕褐色大月亮脸红眼激光、剧院幕布框住银幕、"IT CAME FROM PLANET ZOG"大脑 Boss、合成波日落餐车巨型机器人、"DOUBLE FEATURE"海报 | 屏幕放进剧院：红丝绒幕布+金框+下方观众座椅剪影（第 5 格 ~14.2s、第 15 格 ~40.1s） |
| [tonnusos-006126](skillry/tonnusos-006126.jpg) | 52s | 等轴像素风魔法对战：激光、陨石雨、雷击，特效炸满屏 | 大招时整屏白色闪光（第 11 格，约 37 秒），可当硬转场 |
| [ved-cj-066575](skillry/ved-cj-066575.jpg) | 115s | 低多边形夜间城市 FPS：霓虹武器，楼体被炸出橙色碎块 | 楼墙被炸时整片砖块往外翻出橙色碎片（k6，约 46.6s） |
| [vibechine-465008](skillry/vibechine-465008.jpg) | 11s | 洪水中的曼谷夜城，开水上摩托，楼窗发光 | 第 6 格 (~6.5s) 水面上绿色漩涡圈表示排水口——漩涡作为地面标记 |
| [waseemkhalo-636267](skillry/waseemkhalo-636267.jpg) | 29s | 竖屏像素游戏广告 Spoiled Egg：戴锅盔的蛋战士，森林里打坏蛋，文字放在深色圆角标签里 | 暗森林里只照亮角色周围一圈（聚光光斑，第 10–12 格 ≈20–24s），四周是有纹理的暗部，不是死黑；字幕标签放在角色下方空地 |
| [zacxbt-234711](skillry/zacxbt-234711.jpg) | 25s | 夕阳到夜晚的海滩，小红球角色拿金属探测器 | 同一机位时间流逝：太阳低角长影→粉紫黄昏→灯塔亮起的夜 |
| [zacxbt-944604](skillry/zacxbt-944604.jpg) | 19s | 像素猫头鹰巫师在夜村施法，点状咒语轨迹，月亮变太阳，"NIGHT 1 CLEAR" | 点线虚线弧形咒语轨迹划过夜空；相关度低 |

---

## 二、针对当前问题的借鉴做法

带 ✔ 的 sheet 我逐格核过；其余来自分批看图的笔记，秒数按格号推算。

### a) 拉远/缩小后四周是黑底，很廉价 → 怎么收边、给屏幕/物体一个有设计的环境

1. ✔ **「一格变万格」：拉远后四周是别人的聊天屏**：[suryarajendhran-730437](skillry/suryarajendhran-730437.jpg)，约 16–20 s（第 8–10 格）。
   - 画面：一个聊天窗口居中，镜头后拉，四周露出上千个同样的窗口，拼成马赛克墙，只有它一格亮着。
   - 借法：手机界面拉远时，四周铺几百块低亮度（20–30%）的别人的聊天屏（InstancedMesh + 随机假聊天纹理），只有她那块亮、描霓粉边。收边的同时讲了「人人都在跟 AI 聊天」，成本很低。
2. ✔ **画框后倒成桌上的卡片 / 剧院框**：
   - [pankajkumar-dev-718609](skillry/pankajkumar-dev-718609.jpg)，约 6.6–8.5 s（第 3–4 格）：满屏海报整体后倒，原来是一张躺在台面上的卡片，旁边还有别的色块纸片；约 14 s（第 7 格）是网格地面加地平线。
   - [taylorbereiter-189192](skillry/taylorbereiter-189192.jpg)，约 14.2 s（第 5 格）：银幕被放进剧院，红丝绒幕布、金画框，底部一排观众座椅剪影。
   - 借法：拉远时屏幕要落在一个「地方」，而不是悬在黑里。可以后倒到薄荷网格地面上（远处雾化 + 柠黄地平线），也可以放进剧院框（霓粉丝绒幕 + 观众剪影）。剧院框刚好接上我们 137 s「was it all for show」的舞台揭晓。
3. **给主体一个光池或台座，让暗是渐变的**：
   - ✔ [felipemoller-936736](skillry/felipemoller-936736.jpg)，约 0.9 s：每个场景是一块有厚度的圆形地台，浮在淡色背景里，边缘描亮线。
   - [m1n9-k7-466682](skillry/m1n9-k7-466682.jpg)，约 2.6–7.9 s：屏幕放在暗房间里，屏幕光把桌面和墙染成屏幕的颜色。
   - [op7418-814408](skillry/op7418-814408.jpg)，约 1.4 s：中心放射光 + 物体下一圈发光椭圆环当底座。
   - 借法：3D 层默认环境用径向渐变（中心 #1a1020 → 边缘墨黑）+ 脚下霓粉发光环 + 顶光光池。屏幕发光时用同色面光照亮周围，环境颜色跟着内容变。

### b) 预副歌「ChatGPT, please don't eat me alive」→ 表现「被 AI 吞掉」

1. ✔ **给 AI 一个形象：满身眼睛、戴黄色笑脸的墨团**：[anjmaxx-459455](skillry/anjmaxx-459455.jpg)，约 8 s（第 6 格），约 17 s 又从底部冒出（第 13 格）。
   - 画面：不规则的黑色墨团，身上十几只白眼睛，中间一张柠黄笑脸面具，压在两个很小的像素小人头上。这正是 shoggoth 戴笑脸的梗，也是全站题材最接近我们的一支（「line go up」AI 梗 MV，勒索信剪贴字，BPM 计数一路加速）。
   - 借法：metaball 墨团 + 会眨的眼睛 + 柠黄 😊 面具（可以就是聊天 app 头像）。唱到「eat me」时面具向上翻起，露出霓粉口腔，把她的 2D 立绘整个罩住。
2. ✔ **东西被一块块扯下、吸进一个核心**：
   - [zeezomb-726206](skillry/zeezomb-726206.jpg)，约 47–63 s（第 9–12 格）：金色马赛克一块块翻起剥落，卷成旋转的瓷砖团飞走，原位露出泥底。
   - [0xfemyn-137833](skillry/0xfemyn-137833.jpg)，约 4.2–5.2 s（第 4–5 格）：满屏小标签越堆越多，下一拍全部拉成放射线，吸进中心一颗橙色发光球。
   - 借法：把聊天界面和她的立绘切成小方块（InstancedMesh，每块带原图 UV）。从 AI 回复那一侧开始逐块翻起、脱离，沿螺线吸向一颗越吃越大的霓粉核心，空出的地方露出墨黑 + 霓粉网格。节奏按「越堆越满 → 最后一拍一口吞掉」卡到进副歌的落拍。
3. **镜头自己被吞：第一人称下咽**：
   - [ajith-io-615243](skillry/ajith-io-615243.jpg)，约 13–15 s：穿过白色纸片组成的旋涡隧道。
   - [voxyz-ai-345550](skillry/voxyz-ai-345550.jpg)，约 18.5–21 s：黑洞引力透镜把背景拉成亮环。
   - 借法：吞下之后接一条喉咙隧道（她的聊天气泡和截图沿螺旋排成管道，相机沿轴推进）；或者直接用径向透镜着色器，把界面按 1/r 往中心拉弯，贴着亮环消失。接着就是 v4 分镜里的「嘴里是曼德博集合」。

### c) 副歌里人物群舞 + 大字 P(DOOM) 的高能画面

1. ✔ **大字当背景墙，身后克隆人数按拍翻倍**：[anjmaxx-459455](skillry/anjmaxx-459455.jpg)，约 14–16 s（第 11–12 格）。
   - 画面：巨大的白色「UP」撑满画面，上下各一条「UP ↑ UP ↑」滚动字带，两个主角在前景举手；右上角计数「agents: 16」，下一格变成「agents: 256」，克隆人挤满字母。
   - 借法：P(DOOM) 立在她身后当布景（占画宽约 80%），她在前景跳。身后的模仿者每 2 小节翻一倍（1 → 8 → 64 → 512，InstancedMesh + 相位偏移），角落计数器同步跳。高能来自「越来越多」，字只当布景。
2. ✔ **身后巨型半透明字叠在大圆上，脚下冲击环，动作留拖尾**：[chrisjdimarco-524106](skillry/chrisjdimarco-524106.jpg)，约 15.7 s（第 13 格），约 8.7 s 也有（第 7 格）。
   - 画面：武士在红日前出招，身后浮出巨型半透明「炎」字压在太阳上，火焰炸开；脚下 2–3 圈椭圆冲击环，刀光留弧形拖尾。
   - 借法：P(DOOM) 做成她身后的半透明巨字（霓粉，约 30% 不透明、边缘发光），叠在一个柠黄大圆上。每个重拍从脚下扩一圈椭圆冲击环，手臂轨迹留薄荷色弧形拖尾。人始终是主体。
3. ✔ **字带卷成围着人转的环**：
   - [mrtanviir-132205](skillry/mrtanviir-132205.jpg)，约 11.8–12.7 s（第 12–13 格）：四行反向滚动的跑马灯，下一拍全部卷成围着一个红点的同心文字环。
   - [ajith-io-890146](skillry/ajith-io-890146.jpg)，约 12.7 s：同心文字环，相邻环反向旋转。
   - 借法：副歌前两小节铺满屏「P(DOOM) · I'M UPPING MY ·」跑马灯（霓粉实心 / 薄荷描边交替、奇偶行反向）；落到重拍时卷成 3–4 圈同心字环，环心就是她。字一下子从「字幕」变成「围着人转的漩涡」。

### d) 2D↔3D 或风格之间的转场

1. ✔ **窗中窗无限推进，首尾闭环**：[koldo2k-778767](skillry/koldo2k-778767.jpg)，全片 0.6–19.5 s，最典型是约 1.9–4.4 s（第 1–3 格）。
   - 画面：怀表玻璃里是海岸 → 推进去，海岸上飘着老相机 → 推进镜头里是沙漠 → 沙漠里的放大镜里是湖 → 湖里的手镜里又是开头的草原和怀表。
   - 借法：3D 世界里的手机屏用 RenderTarget 实时渲 2D 层，镜头推到屏幕铺满时无缝切成纯 2D。反过来，2D 里的一个图片气泡、头像或瞳孔里是 3D 世界，推进去就回到 3D。全片可以做一次闭环：从她的手机开始，到 137 s 退回同一部手机结束。
2. ✔ **推进屏幕白闪进入，世界缩成倾斜卡片退出**：[codrops-340299](skillry/codrops-340299.jpg)，约 5.2–8.0 s（第 5–8 格）。
   - 画面：霓粉 + 青的街机厅（配色几乎就是我们的），镜头推进机台屏幕，白光吃满画面，进入 3D 飞机世界；下一拍游戏画面缩成左上角一张霓粉描边的倾斜平行四边形卡片滑走。
   - 借法：进出各用一种，观众好认。进：推屏 → 屏幕亮度拉白 1–2 帧 → 3D。出：3D 渲成纹理贴在倾斜卡片上，描霓粉边，缩小滑走，露出下面的聊天界面。
3. **世界皮肤瞬切，角色不动**：[angie-carel-954689](skillry/angie-carel-954689.jpg)，约 30–35 s；[sab8a-475686](skillry/sab8a-475686.jpg)，约 17 / 24 / 34 s。
   - 画面：角色位置和动作不变，房间或背景在拍上整套替换（波点房 → 迪斯科 → 合成波网格；少年漫速度线 → 镭射闪卡 → 波普网点），人物加粗白描边当贴纸。
   - 借法：桥段每拍 2D↔3D 翻转时让她不跳位，只换世界皮肤，加 1 帧白闪；她的立绘加 6–8 px 白描边，视线永远在她身上。

### e) 让画面「天马行空」，而不是字当主角

1. ✔ **每句歌词一个视觉双关，字幕只占底边一行**：[doubleunplussed-181894](skillry/doubleunplussed-181894.jpg)，约 25 / 41 / 221 / 237 s（第 1、2、13、14 格）。
   - 画面：262 秒的 AI 主题 MV，每句换一个超现实场景：棋盘漩涡里的小星球、金门大桥上的《呐喊》、「Look on my weights, ye mighty」方块狮身像、壳上写 attn / σ / Σ 的乌龟塔。
   - 借法：这是我们「舞蹈句以外的情景句」最好的结构模板。每句先想一个画面梗，字压到最小（或融进画面）。
2. ✔ **数据变成可以坐的东西、人被图标贴满**：[davidshulmanfl-842921](skillry/davidshulmanfl-842921.jpg)。
   - 约 39–43 s（第 10–11 格）：黏土人坐在纸板小车里，沿绿色 K 线做成的过山车冲上冲下。
   - 约 20.7 s（第 5 格）：脸被 App 图标一块块贴满，只剩眼睛和嘴。
   - 约 24–28 s（第 6–7 格）：4×3 宫格群舞。
   - 借法：「NVDA to the moon」或 P(doom) 上升段让她坐在 P(doom) 曲线做的过山车上（TubeGeometry 沿曲线，镜头跟车）。「eat me alive」前一句让她的 2D 脸被聊天气泡按网格逐拍贴满。宫格群舞可以用在副歌 2。
3. **城市卷成圆筒 / 物件越界**：[smallhusk-272056](skillry/smallhusk-272056.jpg)，约 1.5 / 26–29 / 35 s；[zeezomb-726206](skillry/zeezomb-726206.jpg)，约 17.5–37.5 s。
   - 画面：前者是街道两侧向上卷起，抬头看到倒挂的街区，中轴一根光柱；后者是马赛克里的鱼和鸟从墙面挣脱、在空中翻飞一圈再落回。
   - 借法：前者就是我们主歌 2 螺旋跑道的「完成态」，world4.createSpiralRun 已经能做，加一根薄荷数据光柱即可。后者是「平面里的图案活过来」：她手机壁纸里的小图案变成方块，飞出屏幕绕她一圈再归位，不用一个字。

---

## 三、最值得采用的前 5 个点子

1. **给 AI 一个脸：戴笑脸面具的墨团怪**（anjmaxx-459455 约 8 s）→ **预副歌 1（16.6–22.8 s）**，替换 v4-01 现在的「气泡长牙」。
   - 墨团身上长满会眨的眼睛，柠黄笑脸面具就是 ChatGPT 头像。
   - 「please don't eat me」每个词它逼近一步。唱到「alive」时面具翻起露出霓粉口腔，一口罩住她；口腔里接现成的曼德博放大进副歌 1。
   - 同一个怪可以在 29.9 s 的 shoggoth 段回归（那里本来就是「面具 + 线团」），前后呼应。
2. **拉远不露黑：「一格变万格」+ 屏幕落在地方**（suryarajendhran-730437 约 16–20 s；pankajkumar-dev-718609 约 6.6–8.5 s）→ 用在所有「3D 收进屏幕 / 拉远」的镜头：
   - v4-01 的 16.6 into-screen；
   - 副歌 3 的 98.8 关机屏幕；
   - 137.4 的「was it all for show」。
   手机拉远时四周是几百块暗掉的别人的聊天屏，只有她那块亮；或者屏幕后倒成一张卡片，躺在薄荷网格地面上。137.4 那镜直接接剧院框（taylorbereiter 约 14.2 s：霓粉丝绒幕 + 观众剪影），和分镜里「一切都是舞台」同一个意思。
3. **副歌公式：身后巨字 + 大圆 + 脚下冲击环 + 克隆翻倍**（chrisjdimarco-524106 约 15.7 s + anjmaxx-459455 约 14–16 s）→ **副歌 1 / 2 / 4 的开场几小节**（22.1、58.4、123.9 s）。
   - P(DOOM) 做成她身后的半透明巨字，叠在柠黄大圆上，数值（0.15 → 0.42 → 0.99）写在圆里。
   - 每个重拍脚下扩一圈椭圆冲击环，手臂留薄荷拖尾。
   - 身后的模仿者每 2 小节翻倍，角落计数器同步跳。
   - 字只当布景，人是主体，正好解决「高能但字不压人」。
4. **2D↔3D 统一成两个动作：进屏白闪、出屏倾斜卡片；全片以窗中窗闭环**（codrops-340299 约 5.2–8.0 s + koldo2k-778767 全片）→ **全片所有 2D↔3D 切换**：
   - 3.2 s 手机、16.6 s 收进屏幕、52.8 s 从手机爬出、98.8 s 邮件、桥段每拍翻转、137.4 s 收尾。
   - 进：推屏幕到铺满 → 屏幕拉白 1–2 帧 → 3D。
   - 出：3D 渲成纹理贴在描霓粉边的倾斜卡片上，缩小滑走。
   - 首尾闭环：开头钻进的那部手机，就是 137.4 s 退回来的那部。
5. **情景句用视觉双关，数据变成能坐的东西**（doubleunplussed-181894 全片 + davidshulmanfl-842921 约 39–43 s）→ **副歌 2 的「NVDA to the moon」（62.5 s）和副歌 4 开头（124.5 s）**。
   - 62.5 s：她坐在 P(doom) 或 K 线曲线做成的过山车上冲上天，曲线尽头就是月亮。
   - 124.5 s：她沿同一条曲线冲到 0.99。
   - 其余情景句同样先想画面梗（例如「safe enough」用 SAFE ✓ 塔被抽掉一块），字融进画面，不做字卡。
