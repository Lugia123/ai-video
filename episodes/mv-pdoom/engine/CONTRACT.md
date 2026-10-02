# mv-pdoom 模块契约（总管定，改动先在群里说）

三个 worker 并行写 engine / kits，按这份接口对接。创意与分镜见 `../TREATMENT.md`。

## 通用规则
- ES module，three 用 `assets/vendor/three/three.module.min.js`（importmap 名 `three`）。缺的 three 扩展（postprocessing、TextGeometry、FontLoader 等）从同版本 three 拷进 `assets/vendor/three/examples/jsm/`，不走 CDN。
- **画面是 t 的纯函数**：不用 Date.now / 真 rAF 计时 / Math.random / CSS 动画。随机用 `mulberry32(seed)`（`assets/lib/layer-rig.js`）。同一 t 调两次 seek 画面必须一样；乱序 seek 也一样（渲染器可能跳帧）。
- 1920×1080，30 fps。字体只用 `assets/fonts/` 里的本地字体。
- 颜色常量统一从 `engine/palette.js` 取：ink `#0A0A10`、pink `#FF2E88`、mint `#5FE3C0`、lemon `#F4E04D`、paper `#F2EDE4`、blue（仅冷蓝镜头）`#3A6BFF`。

## engine/（W1）
```js
import { loadMV } from './engine/index.js';
const mv = await loadMV({ base: '.' });   // 读 data/audio.json、data/lyrics.json
mv.music   // beatAt(t)→{i, phase}, barAt(t)→{i, phase}, beatTime(i), downbeats[], sectionAt(t)→{i,start,end},
           // energy(name, t)→0..1  name ∈ rms|low|mid|high|vocal|drums|bass|other, onsetsNear(t, win)
mv.lyrics  // lines[i] = {i,text,start,end,words:[{w,start,end}]}, lineAt(t), wordsAt(t),
           // wordState(word, t)→{state:'pending'|'active'|'done', p:0..1}
mv.stage   // {renderer, width, height, render(scene, camera, post)}；post = {bloom, chroma, glitch, grade{exposure,warmth,saturation,vignette}, flash}
mv.mount(shots, { duration })   // 暴露 window.__video = {width,height,fps,duration,seek(t)}；
                                // 普通打开时带音乐实时播放（点击/空格），?render=1 时只等 seek；?t=秒 起播；?from=&to= 循环一段
```

**镜头（shot）**：
```js
export default {
  id: 'c1-foom', t0: 24.3, t1: 26.3,
  build(ctx) { /* 建自己的 scene/camera/对象，返回 state */ },
  update(state, t, ctx) { /* 纯函数：按 t 摆好一切，返回 {scene, camera, post} */ },
  transitionIn: { kind: 'cut' | 'flash' | 'wipe' | 'whip' | 'dissolve-particles', dur },
};
```
ctx = `{ THREE, mv, kits, local: t - t0, u: (t - t0)/(t1 - t0) }`。build 只在首次用到时调一次并缓存；engine 负责两镜头重叠时的转场合成。

## kits/（各 kit 都是「给我 t，我摆好」的对象，不自己跑时钟）
- `kits/girl.js`（W1）：`await createGirl(mv)` → `{ root, setSkin(name, t), dance(moves|choreo, t), pose(name), skins: ['toon','blueprint','points','voxel','chrome','hologram'], morph(fromSkin, toSkin, p) }`；另有 `kaleido(girl, {copies, t})`。动作用 `assets/lib/dance3d.js`，按 mv.music 拍点对齐。
- `kits/hologram.js`（W1）：`await createHolo(mv)` → `{ mesh, update(t, {line, expression}) }`，2D 近景 rig（`episodes/cast-cyber-girl/closeup/layers/`，`assets/lib/layer-rig.js`）画到 CanvasTexture，扫描线 + 半调 + 菲涅尔边，口型按 lyrics 词级时间。
- `kits/type3d.js`（W2）：3D 挤出字 + 字效。每个字效 `fx(opts) → { group, update(t) }`，opts 至少含 `{ line | text, words, color, font }`，逐词对 mv.lyrics 时间。
- `kits/world.js`、`kits/vfx.js`（W3）：程序化建筑（蓝图→挤出→点灯）、体素地面/波、隧道环、回形针雪崩、GPU 田野、线团网络、巨眼；粒子（网格表面采样/爆散/汇聚成字或成形）、流体着色器、沃罗诺伊碎裂、冲击波、德罗斯特递归。同样 `→ { group|mesh, update(t, params) }`。

## 画廊页（每个 kit 的验收方式）
`kits/_gallery/<kit>.html`：一页串起该 kit 的全部效果，每个 4–8 秒，遵守 `window.__video` 约定，能用 `tools/render/render.mjs` 出 contact sheet。engine 没好之前，可以先用 `engine/index.js` 里的接口名写，W1 会尽早交付 music/lyrics/mount 这一小块。

## W1 实现备注（2026-09-29，接口名没变，只有新增）
- 时间一律是歌曲时间 T。`mv.mount(shots | T => draw, { duration, offset = 0, kits })`：offset = 页面 t=0 对应歌曲哪一秒（画廊 / 样片用，渲染器自动从同一秒截音轨）。自己画时用 `mv.stage.render(scene, camera, post)`。
- music 另有 `barTime(i)`、`pulse(kind, t, {decay})`、`beatPulse(t)`、`snap(t, win)`；`music.beat` = beatAt，可直接喂 `dance3d.beatClock`。
- lyrics 另有 `words[]`、`lineProgress(line, t)`、`lineAt(t, {lead, hold})`。
- post 细节见 `stage.js` 顶部注释（bloom 阈值是线性 HDR；PBR Neutral 色调映射；glitch 图案由 t 决定）。转场窗口：cut 无；flash / whip / wipe 以 t0 为中心 ±dur/2；dissolve-particles 为 [t0, t0+dur]（两镜头都画）。
- 预览：点击 / 空格 播放，←→ 跳 2 s，H 开关时间码；`?t=`、`?from=&to=` 用歌曲时间。`window.__stats` 记每帧 seek 耗时。
- `tools/render/render.mjs --page girl.html [--preview --step 0.5]` 渲非 index.html 的画廊页，产物 `out/<页名>-sheet.png` / `out/<页名>.mp4`。
- girl.js：`createGirl(mv)` 身高 1.0、脚在 root 原点、面朝 +Z；每帧顺序「摆 root → dance → setSkin / morph」；toon / voxel 需要灯（`createGirlLights()`）。一个 girl 可跨镜头共享（update 里 `scene.add(girl.root)`）。另有 `pose('lookUp'|'reachUp'|'airborne'|任意舞步名)`、`headPosition()`、`check()`。`kaleido(girl, {copies}).update(T, {camera, center, radius})`。
- hologram.js：`createHolo(mv, {height, base})`，`update(T, {line, expression, glitch, opacity, vocal, look})`；mesh 底边中点在原点，带投影底座（base:false 去掉）。

## W1 #925 新增（动捕 + 队形）
- 动捕：`await loadAnims(['dance__house3', ...])`（或 `'all'`，默认跳过 index.json 里 ok:false 的）→ `girl.play(seq, T)`。
  seq = `[{ bar | beat | t, anim: '名字', mirror, intensity, rate, offset }]`（也可混 `move: '程序化舞步'`），`seq.fade` 交叉淡入秒数（默认 0.25）。片段第 0 帧落在开始拍上。
  片段清单、对拍参数（beats / stretch）、问题标记见 `episodes/cast-cyber-girl/3d/anim/mixamo/index.json`；验片图 `kits/_gallery/out/mocap-sheet*.jpg`。
  主舞只用 index.json 里不 hunched、`stillSec16 = 0`、`stretch` ≤ 1.25 的（raise-roof / body-wave / kick-step / jazz-around / slide-walk …，挑选图 `kits/_gallery/out/dance-picks.jpg`）；house3 / locking2 / moonwalk 等 hunched 的不做主舞。旧的程序化舞步（`girl.dance`）保留兜底。
- 队形（替代万花筒；`kaleido` 保留但别再用，用户看不懂）：
  - `await createFormation(mv, girl, { rows, cols, spacing, canon, mirror })` → `{ group, update(T, { seq }) }`：整列伴舞，前排正中是本体，后排晚 canon 拍。
  - `mirrorRoom(girl, { halfWidth, back, front, nx, nz })` → `{ group, update(T) }`：镜面房间，按真实光路排镜像，沿纵深和两侧无限延伸。
- engine `mount(draw, { offset, duration, repeat: N })`：同一段歌连放 N 遍，draw(T, pass)；渲染时页面自己编 N 遍的 WAV（renderAudio）。

## W1 #926：4K 模型 + 实时 2D 脸（分镜规则，所有镜头照此）
- `createGirl(mv)` 默认加载 4K 版（`tripo-girl-4k/anime girl 3d model.glb`，52 根骨）；它的骨架导出有坐标系错误，girl.js 的 `restoreBindPose` 自动校正（残差 0.16 mm）。旧 2K 版：`createGirl(mv, { model: 'legacy' })`。
- 脸是实时的：每帧先摆好 root / play / setSkin，再 `girl.face.update(T, { line, expression, blink: 'auto', look, camera })`。
  - 口型按 lyrics 词级时间（和 hologram.js 同一套 lipsync），`line` 省略 = 所有歌词都开口；不唱的镜头给 `expression`（neutral / smile / surprised / wink / closed）。
  - 一定要传 `camera`：脸相对镜头的偏航角 ≤ 45° 全用 2D 脸，45–70° 过渡，≥ 70° 自动回到 3D 原脸（纯侧脸 2D 五官会被压扁）。
- 分镜规则：
  - **唱歌 / 看脸的镜头偏航 ≤ 45°（正面到 3/4）**，侧脸只拍不唱的镜头。
  - **脸占画高 ≤ 30%**（2D 脸画布里脸约 300 px 高，再近就放大发糊；4K 模型身上其余部分可以更近）。旧的 2K 模型是 ≤ 20%。
  - 唱歌镜头别配手常在头边的舞（raise-roof 的手会挡脸），优先 body-wave / kick-step / jazz-around，或用中景（20–25%）+ 略仰拍。
  - 低头 / 仰头在 HEAD_LIMIT（低头 25°、抬头 22°、侧倾 18°）以内，动捕已自动限幅。

## W1 #931：实时脸返工（干净贴图 + 五官贴花）
- 不再贴整张 02-head 立绘。`girl.face` = ① 4K 原贴图抹掉原眼 / 眉 / 嘴（`girl.face.cleanMap`，原图 `originalMap` 不动）+ 贴花画布里按正面投影垫肤色；
  ② 左眼、右眼、左眉、右眉、嘴五块独立贴花（`kits/face-decals/`，由 `tools/face-bake/decals.py` 从 2D 分层抠出，只有五官、不带刘海 / 轮廓 / 下巴线），
  按片段的静止姿态坐标投影（`kits/face-4k.json` 定锚点和区域），3/4 侧自然透视压缩；③ 脸内圈用平滑前向法线打光（toon 分阶线不横穿五官），描边外壳在脸内圈不画。
- `girl.face.update(T, { line, expression, blink: 'auto', camera, mouth })`：expression = neutral / smile（睁眼 + 嘴角上扬的闭口笑）/ grin（露齿开口笑）/ happy（眯眼笑，要明确写）/ surprised / wink / closed；mouth 可强制口型。
- 嘴不在脸的贴花画布里，而是一块贴在头骨上、横向弯成脸弧度的「嘴片」（`girl.face.mouthMesh`，挂在 girl.root 下，每次 face.update 摆位）：侧脸只做水平透视压缩，开口上下沿保持水平。阵列 / 镜像克隆体没有嘴片，着色器里按正面投影兜底画嘴。**每帧都要调 face.update**（嘴片靠它跟头）。
  **默认睁眼**；眨眼 = 半闭 1 帧 + 全闭 2 帧 + 半闭 1 帧。口型贴花大小固定，张嘴时上唇线不动、向下扩。
- 清晰度（对照 `kits/_gallery/out/face-clarity.jpg`）：脸部镜头 **bloom 阈值 ≥ 1.2、强度 ≤ 0.6，色差 ≤ 0.2**（强 bloom 会把白眼球 / 高光整片晕开，这是之前「糊」的主要来源之一）；
  4K 原贴图一只眼只有约 60 纹素，不换脸必糊；贴花画布 2048² + mipmap / 各向异性。
- 验收页：`kits/_gallery/face-live2.html`（角度 × 状态）、`face-sing.html`（近景唱歌 22.2–29.9）。

## W1 #935：动漫式五官层（替换 #931 的「嘴片」和网格投影五官）
- 本体的五官不再贴在网格上：每帧 `face.update(T, { camera, ... })` 按头相对镜头的 yaw / pitch，在屏幕空间重新摆 2D 立绘五官（`girl.face.overlay`，挂在 girl.root 下的一块屏幕四边形）。
  - 位置 = 真实网格上眼 / 嘴 / 鼻梁点的投影（随转头自然往转向侧平移）；大小按参数表（|yaw| 0/15/30/45/60°，实际只用到 20°）：近侧眼略大、远侧眼水平变窄（1 → 0.5），嘴水平压缩；眉毛跟眼。不剪切（屏幕轴只取头的右方向）。
  - 鼻子：正面只点鼻尖下一小笔；|yaw| > 15° 起沿下半截鼻梁到鼻尖描深色线、鼻尖往远侧勾，越侧越明显。
  - 脸皮遮罩 RT：每帧先把本体渲成「脸皮 = 白」的遮罩，五官层只在脸皮像素里可见（头发、手、衣领挡住的地方不画，任何角度都画不到脸外）。
  - 嘴永远在脸内：读回遮罩里嘴附近一块，唱歌口型的包络放不下就朝「可见下半脸的质心」挪（二分求最小挪动），还不行再连续缩小（≥ 0.6）；挪动量只随朝向连续变化，换口型不跳。
- **看脸 / 唱歌镜头的角度上限（#935 用户反馈后收紧）：头相对镜头 |yaw| ≤ 20°、|pitch| ≤ 12°。**
  - 超出时 face.update 会 console.warn（每秒一次）；|yaw| 在 20–26° 之间五官层淡出，≥ 26° 换回网格投影五官（只够远景用）。
  - **侧脸 > 20° 只拍背影、远景（脸 ≤ 8% 画高）或切 2D 近景（ui2d 立绘）**，不要拍侧脸特写 / 中景唱歌。
- 嘴贴花整体比 #931 小 30%（face-4k.json mouthScale 0.595，张嘴向下扩的量同比缩）；`face.update(..., { mouthScale })` 可临时再乘一个倍数。
- **必须每帧传 camera**（不传就退回网格投影五官）；镜头要在 face.update 之前摆好。阵列 / 镜像克隆体仍按网格投影画五官。
- 调试：`?facemask=1` 看遮罩（粉 = 脸皮）。验收页：`kits/_gallery/face-anime.html`（yaw × pitch × 状态 60 格）、`face-sing2.html`（正面 → 45° → 正面，旧演示，已超上限）、`face-sing3.html`（yaw ±15° 正面唱，小嘴）、对照 `out/face-mouth-size.jpg`。
- **立绘自带角度（#935 第三轮）**：2D 近景立绘本身朝她的右侧（画面左）转约 4°（face-4k.json `artYaw: 4`，按 yaw 约定 = 镜头在她左侧 +4°），并逆时针歪约 2.5°（`artRoll`）。两套五官二选一（`face.update(..., { style })`，默认 `face-4k.json style`）：
  - `A` = 立绘原样：允许 yaw = artYaw ± 12°（−8° ~ +16°，淡出到 ±18°）；往反方向（镜头在她右侧）几乎不能转。
  - `B` = 正面化（`kits/face-decals-front/`，decals.py 生成：转正 2.5°、两眼等大、嘴取近侧半边镜像成左右对称）：按 ±20° 规则。**当前默认 B**，等用户看 `out/face-artyaw.jpg` 定。
- **脸轮廓描边（#936）**：`face.update(..., { outline })`，默认 `true` = 单侧渐细：只描脸转过去那一侧（远侧）的下颌，从耳前到下巴，下巴前渐细收掉；朝镜头这一侧从耳根到下巴都不描。正面（|yaw| < 4°）时两侧各画中间一小段，4°–14° 之间过渡到单侧。`'full'` = 下颌一圈全描（旧版）；`false` = 关。以下是判定方法：在五官层里按屏幕空间画：在脸皮像素里，邻近像素是背景，或者比它远 4 mm 以上（深度跳变：下颌后面的脖子、侧发、衣领）就描黑线。线宽在脸占画高 25% 时约 3 px，随脸在画面里的大小缩放。只在静止姿态下眼睛以下、鼻子以外的区域描线，所以额头刘海边、鼻子自身、脸内部都不会出线。和五官层一起淡出（|yaw| > 20° 时）。
- **多角度五官（#936，试点）**：`style: 'Y'` 按头相对镜头的 yaw 在「0° = 正面化 B 套」和 `kits/face-decals-yaw/<组>/` 之间交叉淡化。每组的角度用 `tools/face-bake/fit_pose.py` 拟合 2D 关键点与 3D 同名点得出（用眼 6 点、嘴角和下巴尖，俯仰固定 0），不按名义角度登记。
