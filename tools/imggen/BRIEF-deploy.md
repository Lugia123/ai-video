# 本地文生图服务：192.168.3.127

用户提供一台局域网服务器，部署文生图（和图生图/改图），开放 HTTP API 给 worker 调用，替代/补充花钱的千问云 API。

## 机器现状（总管 2026-10-01 查过）
- `ssh root@192.168.3.127`（证书登录，BatchMode 可用）。Ubuntu 22.04，16 核，62 GB 内存。
- GPU：RTX A5000 24 GB，驱动 595.91；**已被别人占用约 1.8 GB**。
- 磁盘：`/` 1.9T 剩 1.1T（最空，用它）；`/mnt/disk1` 剩 117G，`/mnt/disk2` 剩 76G（别用）。
- 外网：huggingface.co 可达（302），modelscope.cn 可达。
- **这台机器上跑着别人的服务，绝对不能动**：docker 容器 `sontia-pt-local`（GPU 推理）、`sontia-sqv3-preview-frontend`；uvicorn :8765、python :8077 / :8096 / :8788、node :5180、argus-agent :28216、qdrant :6333/6334。不要停、重启、改它们，不要 `docker system prune`，不要改系统级 python/驱动/CUDA。

## 要做的
1. **选模型**：项目一直用千问生图（Qwen-Image 文生图 + Qwen-Image-Edit 图生图/改图，保角色一致靠参考图）。优先本地部署同家族：Qwen-Image + Qwen-Image-Edit（2509 或更新），按 24 GB 显存选能放下的量化（fp8 / GGUF）+ 可选 Lightning 加速 LoRA；加载不下就 CPU offload。如果你判断别的模型（FLUX 等）在这张卡上明显更合适，写清理由。先评估显存：给 sontia 那个容器留出它现在的占用，峰值别把它挤爆。
2. **部署**：全部放在 `/opt/imggen/`（或 `/` 盘上一个独立目录），独立 venv/conda 或独立 docker 容器，不碰系统环境。推荐 ComfyUI 做推理后端，外面包一层简单 REST 服务。用 systemd（或 docker restart policy）开机自启、崩了自动拉起。端口选一个没被占的（避开上面列的）。
3. **API**（给 worker 用，局域网内访问）：至少
   - `POST /txt2img`：prompt、negative、width、height、seed、steps → PNG
   - `POST /edit`：一张或多张参考图 + prompt（图生图 / 改图，保住角色）→ PNG
   - `GET /health`：模型是否加载、显存占用、队列长度
   参数里 seed 固定时结果可复现。加一个简单的 token（放在服务器一个文件里，告诉我路径），别完全裸奔。
4. **客户端 + 文档**：在本仓库写 `tools/imggen/client.py`（命令行：txt2img / edit，存 PNG）和 `tools/imggen/README.md`（地址、端口、token 在哪、示例、速度、显存、怎么重启服务、模型文件放在哪）。
5. **验收**：从这台 Mac 上用 client.py 实际跑通：① 一张文生图；② 用 `episodes/cast-cyber-girl/closeup/final/neutral.png` 做参考的一张改图（同一个女孩换个表情），两张都存进 `tools/imggen/samples/`，报出每张耗时。跑的时候看一眼 `nvidia-smi`，确认 sontia 容器还活着、它的显存没被挤掉。

## 规矩
- 大文件下载放后台、写日志，别卡住终端；下载慢就换 modelscope / hf-mirror。
- 不 commit；不动服务器上不属于你的任何东西；不对公网开放端口（只监听局域网）。
- 卡住或需要用户决定（比如模型许可、显存不够要不要动别人的服务）就停下报我，不要自己拍板。
- 做完 `task_progress` + 群 ai-video 报：模型、地址端口、token 路径、两张样图路径和耗时、显存峰值。
