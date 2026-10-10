# 拆层模型（See-through）在公用显卡机器上的部署和使用

拆层模型：给一张角色图，直接出一组分好的层（前发、后发、脸、耳朵、眼睛、帽子……每层一张透明底的图，外加深度图和一个 PSD）。
口径：只当工具用，输出的图可以入库；**权重不入库、不再分发**。模型推理不在个人电脑上跑，只在公用显卡机器上跑。

本文不写机器地址、账号、令牌。地址从环境变量 `SEETHROUGH_SSH`（ssh 目标）读；生图服务的地址和令牌由 `tools/imggen/client.py` 自己从环境变量 / 本机配置读。

## 红线

- 不停、不重启、不修改生图服务本身，不动同一台机器上别人的进程和环境。
- 不往生图服务的目录和它的 Python 环境里装任何东西；不改系统 Python，不改全局配置（包括全局 git 配置）。
- 显存不够就让这次运行失败退出，不去动别人的占用。
- 一次只跑一张。占用显卡之前、之后各在群里说一句（别人也在排队出图）。

## 一次性部署（**没做完，现在不可用**）

> 状态（2026-10-07 晚）：第 1–3 步做完了（目录、官方原版代码、独立环境，自检能用显卡）；**第 4 步权重只拷了一部分**（36 个文件里到了 19 个，哈希没核），随后整件事被叫停。
> 所以机器上那个目录现在是个半成品，**没有跑过任何一张**，下面「跑一张」一节的流程和脚本没有实测过。要用：把权重续传完、核哈希，再按下面跑第一张并补上实测的显存峰值和耗时。

机器上的位置：`/opt/seethrough/`，下面是 `repo/`（代码）、`venv/`（独立 Python 环境）、`models/`（权重）、`in/`、`out/`、`logs/`。

1. 建目录：`mkdir -p /opt/seethrough/{models,in,out,logs}`。
2. 代码：官方仓库 `shitagaki-lab/see-through`，提交 `df019de`，**原版不改**（原版写死用 CUDA，在这台机器上正好）。
   从已有的一份拷过去后，用 `git -c safe.directory=/opt/seethrough/repo checkout -- .` 确认没有本地改动（不要去改全局 git 配置）。
3. 环境：用系统自带的 Python 3.10 建独立环境 `python3 -m venv /opt/seethrough/venv`，然后
   `venv/bin/pip install -r requirements.txt -i <国内镜像>`。依赖清单是精简过的（去掉界面和训练用的包），见本目录 `split-model-requirements.txt`。装完约 6 GB。
   装完自检：`venv/bin/python -c "import torch,diffusers;print(torch.__version__, torch.cuda.is_available())"` 应输出 `True`。
4. 权重：两个模型目录 `layerdiff3d`（9.5 GB）、`marigold`（3.1 GB），共 36 个文件，从已有的一份经局域网 `rsync -a` 过去，然后两边各算一遍 SHA-256 逐文件比对。
   （macOS 自带的 rsync 不认 `--info=` 这类新参数，会直接报错什么都不拷——用最朴素的 `rsync -a`。实测很慢，约每分钟 0.4 GB，13 GB 要半小时以上。）

## 跑一张

仓库根目录：

```
SEETHROUGH_SSH=<ssh 目标> puppet/characters/<角色>/source-next/layers-trial/tools/r2_remote.sh <输入图> <名字> [分辨率]
```

脚本做的事（顺序不能乱）：

1. 问生图服务忙不忙（`client.py health`），有任务在跑或在排队就退出，不抢。
2. 调生图服务已有的「切模式」接口（`client.py mode video`）。这会让它把生图模型从显卡上卸掉；视频模型要等真有视频任务才加载，所以切完后显卡上没有生图服务的模型。
3. 在机器上跑 `inference/scripts/inference_psd.py`，同时每秒记一次各进程的显存到 `logs/<名字>.vram`。
4. 调同一个接口切回（`client.py mode image`）。生图模型在下一个生图请求到来时自己重新加载。
5. 把结果目录和日志拷回本地。

注意：第 2 步到第 4 步之间**没有锁**——如果这期间别人往生图服务提交了请求，生图服务会重新加载模型，两边抢显存，可能有一边失败。所以要先在群里说。
要彻底解决，得把拆层接成生图服务的一种任务、走同一个串行队列（要改服务端并重启，没做）。

## 输入要求

- 一张角色图，不透明底（纯色）；正面和 3/4 侧面都试过。
- 输出每层一张 `<层名>.png` 和 `<层名>_depth.png`，层名是固定的一套英文名（front hair、back hair、face、ears、headwear……），没有的层是空图。
