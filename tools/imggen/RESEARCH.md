# 本地文生图选型调研（2026-10-01，总管派调研助手网上查，未在 A5000 上实测）

## 平台：ComfyUI
- 自带 HTTP API（POST /prompt 入队、/history、/queue、WebSocket 进度），`--listen` 无头运行；新模型通常当天支持（Qwen-Edit-2511、Qwen-Image-2512、FLUX.2 等）；fp8/GGUF/int8 量化 + 自动卸载；节点生态最大。
- 用法：在 UI 里调好工作流 → 导出 API 格式 JSON → 脚本只替换 prompt / 图 / seed 提交。外面包一层简单 REST（txt2img / edit / health + token）。
- SwarmUI = ComfyUI + 表单 UI，对脚本没额外好处；Forge / InvokeAI / Fooocus 偏手工、新模型跟进慢；diffusers 自写服务性价比低。

## 模型（24 GB）
- **A5000 是 Ampere，没有 FP8 张量核**：fp8 权重能加载但不加速。优先 **int8_convrot**（3090 实测比 fp8 快 20–100%，画质近 Q8）；原生不支持就装 ComfyUI-INT8-Fast 节点或改 GGUF。
- **改图 / 保角色（主力）：Qwen-Image-Edit-2511**（Apache 2.0，可商用；角色一致性比 2509 好，最多 3 张参考图）。
  - `Comfy-Org/Qwen-Image-Edit_ComfyUI` → `split_files/diffusion_models/qwen_image_edit_2511_int8_convrot.safetensors`（20.5 GB）；显存紧备选 `unsloth/Qwen-Image-Edit-2511-GGUF` Q6_K（16.9 GB）。
  - 加速 `lightx2v/Qwen-Image-Edit-2511-Lightning` 8 步（4 步易塑料感）；定稿关 LoRA 走 30–40 步。
- **文生图：Qwen-Image-2512**（Apache 2.0），`lightx2v/Qwen-Image-2512-Lightning` 的 `qwen_image_2512_int8_4steps_v1.0`。
- 共用：`Comfy-Org/Qwen-Image_ComfyUI` → `qwen_2.5_vl_7b_fp8_scaled.safetensors`（文本编码器）、`qwen_image_vae.safetensors`。
- **纸偶拆件**：Qwen-Image-Layered（分解 RGBA 图层，Apache）+ BiRefNet（MIT）收边。**RMBG-2.0 非商用，别用。**
- **不进生产**：Qwen-Image-2.1（2026-09，榜单第一，但 Qwen Research License 仅研究/评测）；FLUX.2 klein 9B 权重非商用（4B 是 Apache），动漫和汉字偏弱。
- 动漫底图可选 Anima-Base v1.0（2B）或 Illustrious/NoobAI（SDXL）。

## 提质（按投入产出）
1. 参考图规范：干净白底全身立绘 + 脸部特写一起喂；提示写「保持图1角色的发型、发色、服装、瞳色」再逐条写改动；编辑模型少写负面词。
2. Lightning 8 步 cfg 1.0 出草稿；定稿关 Lightning：euler + simple/beta、30–40 步、cfg≈4。
3. 放大：4x-AnimeSharp / RealESRGAN-anime → 低去噪 0.2–0.35 重绘 → 修脸。
4. 抠图：BiRefNet-HR / BiRefNet-matting（ComfyUI-RMBG 节点）。
5. 专属角色 LoRA（长期最稳）：20–40 张一致图（可先用 Qwen-Edit 生成后人工筛），ostris ai-toolkit / musubi-tuner。

## 下载（大陆）
- 首选 **ModelScope**（上面仓库都有官方/社区镜像，已用其 API 核对）；其次 hf-mirror.com（HF_ENDPOINT + `hf download`，或 hfd.sh + aria2）。直连 HF 只有 KB 级。别用 git lfs。
- 显存估算：可用约 22 GB；int8 20.5 GB 部分常驻，文本编码器编码完卸载到内存（62 GB 够）。速度推算：改图 Lightning 8 步 1MP 每张 30–60 s，文生图 4 步 15–30 s——需实测。

来源：docs.comfy.org Qwen-Image-Edit-2511 教程、blog.comfy.org、lightx2v HF 仓库、MarkTechPost/Latenode（Qwen-Image-2.1 许可）、ComfyUI-INT8-Fast Speed.md、ModelScope API 实查。
