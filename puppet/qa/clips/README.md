# qa/clips：动画片段（序列帧）的检查和渲染约定

片段 = 一段透明序列帧（播放 → 归位）。这里有两样东西：量片段质量的 `checks.py`，和「按 t 取序列帧」的页面怎么写才渲得确定（样板 `seq-test.html`）。

## 1. 片段质量读数：checks.py

```
python3 qa/clips/checks.py <帧目录> --rest <归位帧.png> [--glob 'up-*.png'] [--first <首姿图>] [--last <尾姿图>] \
        [--regions qa/clips/beret-girl.json] [--key-color 236,64,200] [--name 名字] [--out out/clips-checks]
```

出 `<out>/<名字>.json`（全部读数和逐帧曲线）、`<out>/<名字>.png`（标注图）、终端一段摘要。**只出读数，不判过不过**，阈值还没定。

| 组 | 量什么 | 主要字段 |
| --- | --- | --- |
| a 切人 | 逐帧人物包围盒到画布四边的距离；最外一圈像素有没有不透明的 | `cut.min_margin_*`、`cut.edge_visible_pixels_max` |
| b 接缝 | 第 0 帧↔首姿图、末帧↔尾姿图、第 0→1 帧、末两帧：色差、轮廓不一致、位移、清晰度比；旁边一步当对照 | `seam.*`、`sharpness*` |
| c 身份漂移 | 归位帧按色域分出的几块（帽子、发卡…）逐帧的面积比、色差、中心位移，各自最偏的帧 | `identity.<块>.worst_*` |
| d 抠边 | 键色残留（不透明处 / 半透明边里），半透明边宽 | `matte.*` |
| e 动作占比 | 逐帧变动面积；动作落在第几到第几帧、中途停顿的帧；不动时画面自己闪多少 | `motion.*` |
| f 脚底 | 脚的底边和横向中心相对归位帧的漂移 | `feet.*` |

长度读数同时给像素（`*_px`，这套帧自己的像素）和占人高的千分比（`*_pm`）；不同分辨率的两套帧用后者比。清晰度都放大到归位帧原尺寸再量。

「不该动的区域」是角色的配置（`qa/clips/<角色>.json`）：每块一个 HSV 色域 + 在归位帧包围盒里的范围。新角色要新写一份；标注图最后一格画着分块结果，先看它分对了没有。

读数的已知局限：
- c 组分不清「漂了」和「被手挡住 / 这个动作本来就带着它动」，只报变了多少、在第几帧，要对着图看。
- b 组的位移是整张图的相位相关，只有整个人一起挪才量得准；局部动作不反映在里面。
- e 组的动作范围用「超过峰值 10%」划线，是为了有个可比的口径，不是验收标准。

## 2. 序列帧页面的写法（渲染器依赖）

`tools/render.mjs` 逐帧 `seek(t)` 后立刻截图，不等任何异步的东西。所以：

1. **所有帧在 `window.__video.ready` 之前加载并解码完。** 每张图 `await img.decode()`（或 `createImageBitmap`）；`onload` 只说明文件到了。`ready` 推荐是 Promise（加载失败就 reject，渲染器报错退出）；布尔（先 `false` 后 `true`）和函数渲染器也认。
2. **`seek(t)` 同步画，只用已经解码好的图；要的帧不在就 `throw`**，不许 `if (!img) return`——那样成片里混进空帧也不会有人知道。
3. **帧号是 t 的纯函数**：`floor((t − 片段起点) × 片段帧率 + 1e-6)`，夹在 `0…n−1`。不用 `Date.now()`、不靠 rAF 计数。
4. 演示页里「点了才加载」的片段，在 `?render=1` 下要改成全部预加载；或者 `seek` 返回 Promise（渲染器会等它），但那样每一帧都多一次往返，慢。
5. 不要用 `<img>` 换 `src` 来播（换完到显示之间有一帧空档）；用 canvas `drawImage`，或者所有帧各一个 `<img>` 预先放好、只切 `visibility`。

为什么必须有 `ready`：脚本一开头就 `new Image()` 的图会拖住页面的 load 事件，渲染器等 load 时顺带等到了它们，看上去「不写 ready 也没事」；但先 fetch 一份清单、再按清单加载的页面（片段库就是这样），图是 load 之后才发起的，没有 `ready` 就会截到空帧。实测见下。

样板和测试页：`qa/clips/seq-test.html`（`?frames=<帧地址前缀>&n=<帧数>`，`&lazy=1` 模拟先读清单再加载，`&ready=promise|bool|none`）。

```
node tools/render.mjs qa/clips --page seq-test.html --keep-frames --query 'frames=/<帧目录>/up-&n=25&lazy=1'
python3 tools/md5_frames.py qa/clips/out/frames-seq-test > run1.txt      # 再渲一遍存 run2.txt
python3 tools/md5_frames.py run1.txt run2.txt                            # 「不同 0」= 逐帧一致
PUPPET_SERVE_DELAY_MS=1500 node tools/render.mjs …                       # 每张图晚 1.5 秒到，结果应该还是一样
```

实测（2026-10-07，25 帧 832×1104 的片段，逐帧 md5）：

| 情形 | 结果 |
| --- | --- |
| 样板页 `ready` 是 Promise，渲两遍 | 75 / 75 帧一致 |
| 同上，每张图晚 40ms / 1.5s 到（`lazy=1`） | 和不延迟的逐帧一致 |
| `ready` 是布尔，每张图晚 1.5s 到 | 和上面逐帧一致 |
| 反例：不给 `ready`，`lazy=1`，每张图晚 1.5s | 75 帧全是空底（和正常的 75 帧全不同） |
| 帧地址写错 | 渲染器退出：「页面没准备好：… The source image cannot be decoded」 |
