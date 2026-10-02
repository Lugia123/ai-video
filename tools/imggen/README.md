# imggen：局域网本地生图 / 生视频服务（192.168.3.127）

用 Qwen 家族模型本地出图、改图、抠图，替代/补充千问云 API；用 Wan 2.2 / LTX-2.5 做图生视频、文生视频。推理后端是 ComfyUI，外面包了一层 REST。生图和生视频共用一张卡，**不同时占显存**，服务端按请求自动切换（见「生视频」一节）。

- **地址**：`http://192.168.3.127:7860`，只监听局域网网卡；ComfyUI 本体只开在 `127.0.0.1:8188`，局域网访问不到。
- **token**：在服务器的 `/opt/imggen/token` 文件里，请求头带 `Authorization: Bearer <token>`。`/health` 不需要 token。
  `client.py` 第一次运行会通过 ssh 把 token 读下来，缓存到 `~/.config/imggen/token`；也可以直接设环境变量 `IMGGEN_TOKEN`。

## 模型

| 用途 | 文件 | 来源（全部从 ModelScope 下载） |
| --- | --- | --- |
| 改图 / 保角色 | `qwen_image_edit_2511_int8_convrot.safetensors` | Comfy-Org/Qwen-Image-Edit_ComfyUI |
| 改图草稿加速 | `Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors`（LoRA） | lightx2v/Qwen-Image-Edit-2511-Lightning |
| 文生图草稿 | `qwen_image_2512_int8_4steps_v1.0_comfy.safetensors` | lightx2v/Qwen-Image-2512-Lightning（见下方说明） |
| 文生图定稿 | `qwen_image_2512_fp8_e4m3fn.safetensors` | Comfy-Org/Qwen-Image_ComfyUI |
| 文本编码器 | `qwen_2.5_vl_7b_fp8_scaled.safetensors` | Comfy-Org/Qwen-Image_ComfyUI |
| VAE | `qwen_image_vae.safetensors` | Comfy-Org/Qwen-Image_ComfyUI |
| 抠图 | `birefnet.safetensors`（BiRefNet，MIT 许可） | Comfy-Org/BiRefNet |

以上模型都是 Apache 2.0 或 MIT 许可，可以商用。按调研结论，没装 Qwen-Image-2.1（研究许可）、RMBG-2.0（非商用），Layered 暂时也没装。

**lightx2v 的 int8 文件不能直接用**：它只带 `weight_scale`，没有 ComfyUI 需要的 `comfy_quant` 标记，直接加载出来的图全是噪点。
所以用 `/opt/imggen/convert_lightx2v_int8.py` 给每层补了 `{"format": "int8_tensorwise"}`，转换结果放在 `models-conv/`。
以后换新版 lightx2v 的 int8 文件，也要先跑一遍这个脚本。

## 接口

除 `/health` 外都是 `POST` JSON，返回 PNG。响应头里有 `X-Seed`、`X-Elapsed`（服务端耗时，秒）、`X-Model`。

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `/txt2img` | `prompt`，可选 `negative` `width` `height`（默认 1328，按 16 取整）`seed` `steps` `cfg` `fast` | `fast` 默认 true：int8 4 步、cfg 1。false 是定稿：fp8 底模 40 步、cfg 4，带默认负面词 |
| `/edit` | `images`：1–3 张 base64 参考图，`prompt`，可选 `width` `height`（默认按图 1 比例缩到约 1MP）`seed` `steps` `cfg` `fast` `negative` | `fast` 默认 true：加 Lightning LoRA 跑 8 步、cfg 1。false 是定稿：不加 LoRA，40 步、cfg 4 |
| `/cutout` | `image`：base64 | 用 BiRefNet 抠图，返回透明底 RGBA PNG |
| `GET /health` | — | ComfyUI 是否在线、队列长度、内存、整卡显存和各进程显存、上一次用的模型 |

`seed` 固定时结果可以逐像素复现（ComfyUI 重启前后都对比过，差值为 0）。不传 `seed` 就随机生成一个，从 `X-Seed` 拿回来。
同一个请求原样再发一次，ComfyUI 会直接命中缓存，不到 1 秒就返回。

## client.py

```bash
python3 tools/imggen/client.py txt2img "一只橘猫坐在窗台上" -o cat.png              # 草稿
python3 tools/imggen/client.py txt2img "..." --final --seed 42 -W 1664 -H 928 -o x.png  # 定稿 16:9
python3 tools/imggen/client.py edit ref.png "保持图1角色的发型、发色、服装不变，只改表情：微笑" -o smile.png
python3 tools/imggen/client.py edit full.png face.png "..." --final -o out.png       # 多张参考图
python3 tools/imggen/client.py cutout in.png -o out_rgba.png
python3 tools/imggen/client.py health
```

只用到标准库。
**macOS 上报 `No route to host`、但 curl 能通**：是系统「本地网络」权限拦了那个 python（2026-10-01 miniconda 的 python 就被拦过），改用 `/usr/bin/python3 tools/imggen/client.py ...`，或者在「系统设置 → 隐私与安全性 → 本地网络」里放行。`--final` 对应定稿模式；`--steps` 和 `--cfg` 可以覆盖默认值。

## 速度与显存（RTX A5000，2026-10-01 实测）

| 任务 | 尺寸 | 耗时 |
| --- | --- | --- |
| 文生图 草稿（4 步） | 1328² | 刚换模型 12–15 s，热机约 6.6 s |
| 文生图 定稿（40 步） | 1328² | 约 172–174 s |
| 改图 草稿（8 步） | 832×1248 | 20–27 s |
| 改图 定稿（40 步） | 832×1248 | 约 161–162 s |
| 抠图 | 832×1248 | 约 2.4 s |

文生图和改图用的是两套 20GB 的模型，来回切换时第一张会慢几秒（要从内存或磁盘重新载入）。

显存：ComfyUI 带 `--vram-headroom 3` 启动，按整张卡算（别人的进程也计在内）始终空出约 3GB。实测整卡峰值 21.3GB / 24.5GB。
同卡上 sontia 的两个进程（pid 1067 占 1.26GB、pid 474031 占 0.49GB）在整个测试过程中占用没变，`sontia-pt-local` 一直是 healthy。
注意：不要换回 `--reserve-vram`。ComfyUI 0.38 的动态显存模式下这个参数不起作用，实测会把整卡吃到 23.6GB。

## 生视频（#1023，2026-10-01）

### 模型选型

| 用途 | 模型 | 文件（全部从 ModelScope 下） | 许可 |
| --- | --- | --- | --- |
| 图生视频（主力，保角色） | Wan 2.2 I2V A14B（高噪声 + 低噪声两个专家） | Comfy-Org/Wan_2.2_ComfyUI_Repackaged：`wan2.2_i2v_{high,low}_noise_14B_fp8_scaled` | Apache 2.0 |
| 文生视频 | Wan 2.2 T2V A14B | 同上：`wan2.2_t2v_{high,low}_noise_14B_fp8_scaled` | Apache 2.0 |
| Wan 草稿加速 | lightx2v 4 步蒸馏 LoRA（i2v 1022 版、t2v 1217 版，高 / 低各一个） | lightx2v/Wan2.2-Distill-Loras | Apache 2.0 |
| Wan 共用 | umt5 文本编码器、Wan 2.1 VAE | Comfy-Org/Wan_2.2_ComfyUI_Repackaged：`umt5_xxl_fp8_e4m3fn_scaled`、`wan_2.1_vae` | Apache 2.0 |
| 快速视频后端 | LTX-2.5 22B distilled（Lightricks 官方 Comfy int8_convrot 版） | Lightricks/LTX-2.5：`ltx-2.5-22b-distilled-transformer-comfy-int8-convrot`、`gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot`、video / audio VAE、x2 空间放大器 | **LTX-2.x Community License**（见下） |

为什么这么选：
- **Wan 2.2 A14B** 是 Apache 2.0，可以放心商用；ComfyUI 原生支持；角色一致性最好。Wan 2.2 TI2V-5B 更轻，但画质明显不如 A14B，24GB 也放得下 A14B，所以没装 5B。
- A5000 是 Ampere，没有 FP8 张量核。Wan 的 I2V / T2V 在 ModelScope 上只有 fp8_scaled 版（int8_convrot 只有 animate 模型有），ComfyUI 按层转成 bf16 来算，能用，但不会加速。每个专家约 14.3GB，两个专家按需轮流加载，其余的放在内存里。
- **LTX-2.5** 是用户点名要的「快」模型。官方 ModelScope 镜像直接有 ComfyUI 用的 int8_convrot 版（Ampere 上能用 int8 计算），流程照 ComfyUI 官方模板 `video_ltx2_5_{i2v,t2v}`：先用半分辨率跑 8 步，潜空间放大 2 倍后再跑 3 步。它同时生成音轨，默认丢掉，传 `audio: true` 才保留。模板里可选的 gemma 提示词扩写没装。

### LTX-2.x 许可（2026-08-11 版）

原文：https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x （LTX-2.5 模型卡 license_link 指向这里）。要点：
- **按收入设门槛**：年收入低于 1000 万美元的实体可以免费商用。收入按实体连同子公司、关联公司合并计算；达到或超过 1000 万美元就要买付费许可（Commercial Use Agreement）。
- 附件 A 第 5 条：把生成内容放到任何场合时，必须**明确声明是机器生成的**；另外遵守 Lightricks 的 Acceptable Use Policy（禁止深度伪造冒充他人、误导性内容等）。
- 第 6 条：不得移除或绕过模型内置的水印、溯源元数据等透明度标记；要遵守欧盟 AI 法案、加州 AI 透明法等 AI 法规的标注义务。
- 生成内容的权利归使用者（第 5 条），但微调后的权重转给商业实体有额外限制（3.5 条）。
- **我们是否在 1000 万美元门槛以下，需要用户确认。** 不确定时用 Wan（Apache 2.0，没有这些条件）。

其他 2026 年的开源视频模型这次没有调研和实测。

### 接口（异步任务）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `POST /img2video` | `image`（base64 首帧），可选 `end_image`（尾帧，仅 wan）、`prompt`、`model`（`wan` 默认 / `ltx`）、`seconds`（默认 5）或 `frames`、`res`（`480p` 默认 / `720p`，按首帧比例换算宽高）或 `width`+`height`、`seed`、`fast`、`negative`、`audio`（仅 ltx） | 返回 202 和 `{id, status: queued, width, height, frames, ...}` |
| `POST /txt2video` | 同上，没有 `image`，比例默认 16:9 | 同上 |
| `GET /jobs/<id>` | — | 状态：`queued` / `running` / `done` / `error` / `cancelled`，还有耗时 `elapsed`、排队时间 `queue_wait`、本任务期间的整卡显存峰值 `vram_peak_mib` |
| `GET /jobs/<id>/video` | — | 结果 MP4（`video/mp4`） |
| `DELETE /jobs/<id>` | — | 取消：排队中直接取消，在跑的让 ComfyUI 打断 |
| `POST /mode` | `{"mode": "image" \| "video"}` | 可选，预先切换（会卸载另一类模型）；不调也行，生成请求会自动切 |

- `model=wan`：16 fps，帧数取 4n+1。`fast=true`（默认）加 lightx2v LoRA，跑 4 步、cfg 1；`fast=false` 是定稿，不加 LoRA，20 步、cfg 3.5。高噪声专家跑前一半步数，低噪声专家跑后一半。
- `model=ltx`：24 fps，帧数取 8n+1，固定 8+3 步，`fast` 不起作用。宽高取 64 的倍数（第一段要跑半分辨率）。
- 任务结果保存在服务器 `/opt/imggen/jobs/`，7 天后自动清理。服务重启时，没跑完的任务会被标成 error。

### 生图 / 生视频的切换（不同时占显存）

- 所有 ComfyUI 调用都排在同一把锁后面，先来先服务，显卡上同一时间只跑一个任务。
- 请求的类别（image / video）和当前模式不同时，先让 ComfyUI 卸载全部模型、释放显存（`POST /free`），再加载新的一类。`/health` 里的 `mode` 是当前模式。
- **视频任务跑着的时候来了生图请求：不报错，排队**，等这条视频跑完自动切回生图（单个生图请求最多等 1 小时）。Wan 定稿一条要 16 分钟左右，赶时间的生图调用方要知道这一点，可以先看 `/health` 的 `video_jobs_active`。排在生图请求前面的视频任务可以用 `client.py cancel <id>` 取消。
- 切换的代价：卸载、重新加载约 10–20 秒（模型留在内存里时更快）。

### 实测（RTX A5000，5 秒视频，2026-10-01）

图生视频，首帧 `episodes/cast-cyber-girl/closeup/final/smile.png`（832×1248 竖图），同一提示词、seed 12：

| 后端 | 分辨率 | 帧 | 生成耗时 | 整卡显存峰值 |
| --- | --- | --- | --- | --- |
| LTX-2.5 | 480p → 512×768 | 121 @ 24fps | **36 s**（冷启动 47 s） | 22.7 GB |
| LTX-2.5 | 720p → 768×1152 | 121 @ 24fps | **60 s** | 21.2 GB |
| Wan 2.2 草稿（4 步） | 512×768 | 81 @ 16fps | **112–116 s** | 20.0 GB |
| Wan 2.2 定稿（20 步） | 512×768 | 81 @ 16fps | **961 s（16 分钟）**，约 47 s/步 | 19.2 GB |

文生视频，霓虹夜城推镜头，seed 21：

| 后端 | 分辨率 | 生成耗时 | 整卡显存峰值 |
| --- | --- | --- | --- |
| LTX-2.5 | 480p → 832×448 | **45 s** | 21.1 GB |
| LTX-2.5 | 720p → 1280×704 | **75 s** | 21.0 GB |
| Wan 2.2 草稿（4 步） | 480p → 848×480 | **119 s** | 19.7 GB |
| Wan 2.2 定稿（20 步） | 480p → 848×480 | **1005 s（17 分钟）** | 18.1 GB |

- LTX 官方说的「比实时还快」是 H100 / GB200 上的数。**A5000 上做不到实时**：5 秒 480p 要 36–45 秒，5 秒 720p 要 60–75 秒，大约是视频时长的 7–15 倍。
- 画面对比（当时做了文生视频、图生视频各四个版本的抽帧对比图，样例文件没有随仓库公开）：两个模型都保住了角色（护目镜、耳饰、粉夹克、发型）。Wan 的表情变化更自然，眨眼、笑、睁眼都演出来了，几乎没有多余动作；LTX 的头发飘动更明显，720p 那条从头到尾都眯眼笑。另外，用同一张图、让她「转头」的提示词，LTX 一路转成了全侧脸，动作幅度比提示词要的大。
- 显存：LTX 有一次整卡峰值到了 22.7GB（`--vram-headroom 3` 在动态显存模式下只是尽量保持，不是硬上限），其余都在 21.3GB 以下。sontia 的两个进程（1.26G、0.49G）全程不变。
- 文生视频：四条都拍出了雨夜街道往前推的镜头。Wan 草稿偏写实、暖色路灯多；Wan 定稿更暗，粉、青霓虹更重；LTX 两条的霓虹招牌和雾最多，最接近提示词里的「粉 / 薄荷 / 柠黄」。招牌上的字都是乱码，需要字的话后期加。
- 切回生图：视频跑完后调一次 `/edit`，含切换共 25 s，结果和视频测试之前同 seed 的那张逐像素一致。
- 建议：要快、要动作活泼，用 `model=ltx`（注意许可门槛）；要角色稳、动作克制，用 Wan 草稿；Wan 定稿 16 分钟一条，只留给最终镜头。

### 磁盘

视频模型新增约 104GB：Wan 63G、lightx2v LoRA 2.5G、LTX-2.5 39G。`/opt/imggen` 合计 196G，`/` 盘还剩约 880G。

## 服务器上的布局（全在 /opt/imggen，没改系统环境）

```
/opt/imggen/
  ComfyUI/                 ComfyUI 0.38（在 Mac 上 git clone 后 rsync 过去，服务器直连 github 会断）
    models/*/              指向 models-src/、models-conv/ 的软链接
  models-src/<repo>/       ModelScope 原始文件（生图约 68GB + 视频约 104GB）
  models-conv/             转换后的 2512 int8 4steps（20GB）
  venv/                    推理环境：python3.10 + torch 2.14.1+cu130（从 USTC PyPI 镜像装的）
  venv-dl/                 下载工具：modelscope CLI
  pyhdr/                   从 libpython3.10-dev 解包出来的头文件（triton 编译要用，系统里没装 python3-dev）
  imggen_server.py         REST 层（源码在本仓库 tools/imggen/server/）
  convert_lightx2v_int8.py
  download.sh              从 ModelScope 下载生图模型的脚本
  download-video.sh / download-ltx.sh   下载 Wan 2.2 / LTX-2.5 的脚本
  jobs/                    视频任务的结果和状态（7 天清理）
  token
  logs/
```

systemd 单元（文件在本仓库 `server/`，已装到 `/etc/systemd/system/`）：

- `imggen-comfy.service`：ComfyUI，`Restart=always`，开机自启。kill -9 测过，5 秒内会自动拉起。
- `imggen-api.service`：REST 层，`Restart=always`，开机自启。

```bash
ssh root@192.168.3.127
systemctl restart imggen-comfy imggen-api       # 重启
systemctl status imggen-comfy imggen-api
journalctl -u imggen-comfy -f                    # ComfyUI 日志
journalctl -u imggen-api -f                      # 接口访问日志
```

更新 REST 层：改完 `server/imggen_server.py` 后执行 `scp` 把它传到 `/opt/imggen/`，再 `systemctl restart imggen-api`。
**重启 imggen-api 会让正在等结果的生图请求断开、没跑完的视频任务标成 error**，所以先看 `/health`，确认 `busy` 为 0、`video_jobs_active` 为空再重启。

再下新模型：用 `/opt/imggen/venv-dl/bin/modelscope download --model <repo> <file> --local_dir /opt/imggen/models-src/<repo>`，下完软链到 `ComfyUI/models/<类型>/`。
ModelScope 实测约 50–80 MB/s；hf-mirror 只有 4–11 MB/s；huggingface.co 直连不通（DNS 被污染）。

## 样图

验收时出过一组样例（样例文件没有随仓库公开）：文生图草稿 / 定稿各一张（同 seed 42）；改图草稿 / 定稿各一张（参考图 `episodes/cast-cyber-girl/closeup/final/neutral.png`，换成惊讶表情，seed 7）；再对改图定稿抠一次图。
