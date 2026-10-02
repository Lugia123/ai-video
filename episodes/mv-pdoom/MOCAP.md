# mv-pdoom 动捕清单 v1（2026-09-29，用户看片后定：先解决动捕）

来源：Mixamo（骨架与女主 glb 同为 mixamorig，`assets/lib/dance3d.js` 的 `loadMixamoMove` 直接重定向 + 按拍伸缩）。
下载参数：FBX Binary、**Without Skin**、30 fps、Keyframe Reduction none；有 In Place 选项的动作两份都要（原地版给舞台舞、带位移版给跑酷）。
存放：`episodes/cast-cyber-girl/3d/anim/<类别>/<名字>.fbx`，下载后写 `anim/index.json`（名字、时长、拍数、适用段落）。

## 用户看片反馈（要靠动捕和重排镜头解决的部分）
1. 程序化舞步僵硬 → 全换真人动捕。
2. 「把人叠成一个圆圈」看不懂 → 删掉。多人只用两种有意义的队形：**整列伴舞**（多个她排成列/方阵，错拍卡农）或**镜面反射**形成的万花筒阵列（像真的站在镜子房里）。
4. 「人在一边莫名其妙跳舞」→ 每个出现她的镜头都要有动作动机：她在对歌词做事（唱、推、抓、跑、坠、逃），或者是明确的「舞台/群舞」段落。
5. 连续下坠到深渊 → 跑酷 + 滑步衔接（奔跑 → 跳 → 翻 → 滑铲 → 坠落 → 落地再跑），或用滑步/溜冰感的滑行。
运镜：跟着音乐在全身和特写之间切换（全身看舞，特写看脸/手/脚）。

## 需要的动作（按用途，名字以 Mixamo 搜索结果为准，下载时核实）

### A. 主舞（副歌、尾声；整列伴舞和镜面阵列都用这些）约 14 个
- Hip Hop Dancing（取 3–4 个不同版本）
- Shuffling
- House Dancing
- Wave Hip Hop Dance
- Tut Hip Hop Dance
- Robot Hip Hop Dance
- Locking Hip Hop Dance
- Popping
- Snake Hip Hop Dance
- Bboy Hip Hop Move / Breakdance Freezes（1–2 个，尾声高潮）
- Northern Soul Spin（转圈接拍）
- Swing Dancing / Jazz Dancing（1 个，桥段前后换口味）
避开：Gangnam Style、Macarena、Thriller 这类有名的现成编舞。

### B. 跑酷 / 坠落链（v2 奇点→隧道、v3 Gato 坠落→c3 开头、主歌 2 加速）约 12 个
- Running / Fast Run / Sprint（带位移 + In Place 各一）
- Running Jump、Jump
- Front Flip、Backflip
- Running Slide（滑铲）
- Jumping Down
- Falling Idle、Falling（空中翻滚）
- Falling To Landing / Hard Landing / Falling To Roll
- 攀爬悬挂：Hanging Idle、Braced Hang（抓 GATO 字那段）

### C. 滑行 / 溜冰感（「连续下坠到深渊」的另一方案）约 3 个
- Mixamo 若有 Skating / Ice Skating 类就用；没有就用 Running Slide + 脚下发光轨道 + 身体前倾的滑步来模拟。

### D. 表演 / 叙事动作（有动机的「做事」镜头）约 12 个
- Singing（唱歌上身动作，给全息屏之外的 3D 唱段）
- Reaching Out（伸手够巨眼 / 光）
- Pushing（推笼子栏杆 —— Sydney 段）
- Pulling / Tug（拉、挣脱）
- Looking Around、Looking Up（仰望巨眼、门缝光）
- Sitting Idle / Sitting（坐在坐标轴上晃腿）
- Standing Up（起身）
- Pointing / Pointing Forward
- Victory / Cheering（尾声）
- Walking（稳定训练那段和球同行）
- Defeated / Kneeling（被吸向奇点时的抵抗）
- Waving（开头/结尾）

合计约 40 个。
