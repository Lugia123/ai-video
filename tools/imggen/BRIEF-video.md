# 192.168.3.127 加部署文生视频 / 图生视频

用户 2026-10-01：「在部署文生视频，需要的时候可以切换，估计没法同时启动」。

## 现状
生图服务已上线（`tools/imggen/README.md`）：ComfyUI 0.38 在 127.0.0.1:8188，REST 在 :7860，systemd `imggen-comfy` / `imggen-api`，全部在 `/opt/imggen`，显存留 3 GB headroom，别人的 sontia 进程占约 1.8 GB 不能碰（机器规矩见 `BRIEF-deploy.md`）。

## 要做的
1. **选模型**（先查清再下，写进 README 并说明理由）：优先 **Wan 2.2**（Apache 2.0，ComfyUI 原生支持）。24 GB + Ampere（无 FP8 加速，int8/GGUF 更合适）下评估：Wan2.2-TI2V-5B（文生+图生视频，720p，单卡轻松）和 Wan2.2-I2V/T2V-A14B（质量高，需 GGUF/int8 + Lightning/LightX2V 加速 LoRA + offload）。我们最常用的是**图生视频**（拿一张角色关键画/画面动起来，保角色一致），其次文生视频。许可必须可商用。有更新更好的 2026 年模型也可以提，但要写清许可和显存。全部从 ModelScope 下。
2. **切换**：生图和生视频**不同时占显存**。做法自定，但要简单可靠，比如：同一个 ComfyUI 按需加载、调用前自动卸载另一类模型；或 REST 提供 `POST /mode {image|video}`，切换时卸载/重启对应后端。`/health` 要报当前模式和显存。生图请求在视频模式下来了要么自动切回、要么明确报错说明怎么切——写清楚是哪种。
3. **API**：在现有 REST（:7860）上加
   - `POST /img2video`：一张首帧图（可选尾帧）+ prompt + 时长/帧数 + 分辨率 + seed + fast → MP4
   - `POST /txt2video`：prompt + 时长/帧数 + 分辨率 + seed + fast → MP4
   - 视频耗时长：做成**异步**（提交返回 job id，`GET /jobs/<id>` 查状态/取结果），同步等待作为 client 的便捷选项。
   - `client.py` 加对应子命令；README 补上。
4. **验收**（从 Mac 用 client.py 跑）：① 用 `episodes/cast-cyber-girl/closeup/final/smile.png` 做首帧的 3–5 秒图生视频（她眨眼微笑转头之类）；② 一段 3–5 秒文生视频（霓虹夜城镜头）；各报 fast/定稿耗时、分辨率、显存峰值；样片存 `tools/imggen/samples/`。③ 视频跑完后再调一次 `/edit`，确认切回生图正常。④ 全程 sontia 进程显存不变、容器 healthy。
5. 磁盘：`/` 盘随便用，但报一下新增多少。

规矩同 `BRIEF-deploy.md`：不动别人的东西、只听局域网、不装系统包、不 commit；需要用户决定的停下报总管。做完 task_progress + 群 ai-video 报告。
