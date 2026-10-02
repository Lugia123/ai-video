"""imggen REST 服务：包在本机 ComfyUI（127.0.0.1:8188）外面的一层薄 API。

部署在 192.168.3.127:/opt/imggen/imggen_server.py，用 /opt/imggen/venv 跑（aiohttp 来自 ComfyUI 依赖）。
接口（除 /health 外都要 Authorization: Bearer <token>，token 在 /opt/imggen/token）：
  生图（同步，返回 image/png）
  POST /txt2img    JSON {prompt, negative?, width?, height?, seed?, steps?, cfg?, fast?}
  POST /edit       JSON {images:[b64...1-3], prompt, negative?, width?, height?, seed?, steps?, cfg?, fast?}
  POST /cutout     JSON {image: b64}                                                -> RGBA PNG
  生视频（异步，返回 202 {job_id}）
  POST /img2video  JSON {image: b64, end_image?: b64, prompt, model?: wan|ltx, negative?, seconds?|frames?, res?: 480p|720p,
                         width?, height?, seed?, fast?, audio?}
  POST /txt2video  JSON {prompt, model?, negative?, seconds?|frames?, res?, width?, height?, seed?, fast?, audio?}
    model=wan（默认）：Wan 2.2 A14B，16fps；fast=true 走 lightx2v 4 步，false 走 20 步定稿；end_image 仅 wan。
    model=ltx：LTX-2.5 22B distilled，24fps，固定 8+3 步（fast 不起作用）；audio=true 时带上它同时生成的音轨。
  GET  /jobs/<id>         -> JSON 状态；GET /jobs/<id>/video -> video/mp4；DELETE /jobs/<id> 取消（排队中直接取消，在跑的打断）
  模式
  POST /mode       JSON {mode: image|video}   预先切换（可选，生成请求会自动切）
  GET  /health                                -> JSON
响应头 X-Seed / X-Elapsed 给出实际种子和耗时。

显存切换：所有 ComfyUI 调用都排在同一把 gpu_lock 后面（先来先服务）。请求的类别（image / video）
和当前模式不同时，先让 ComfyUI 卸载全部模型、释放显存再跑，所以生图和生视频不会同时占显存。
视频任务进行中来了生图请求：不报错，排队等视频跑完后自动切回生图（可能要等几分钟，/health 里能看到）。
"""
import asyncio
import base64
import io
import json
import os
import random
import subprocess
import time
import uuid

import aiohttp
from aiohttp import web
from PIL import Image

COMFY = os.environ.get("COMFY_URL", "http://127.0.0.1:8188")
HOST = os.environ.get("IMGGEN_HOST", "192.168.3.127")
PORT = int(os.environ.get("IMGGEN_PORT", "7860"))
TOKEN_FILE = os.environ.get("IMGGEN_TOKEN_FILE", "/opt/imggen/token")
JOBS_DIR = os.environ.get("IMGGEN_JOBS_DIR", "/opt/imggen/jobs")
TIMEOUT = 900          # 单个生图 ComfyUI 任务
VIDEO_TIMEOUT = 3600   # 单个视频 ComfyUI 任务
IMAGE_WAIT = 3600      # 生图请求最多排队等多久（含等视频任务跑完）
JOB_KEEP_S = 7 * 86400

M = {
    "edit": "qwen_image_edit_2511_int8_convrot.safetensors",
    "edit_lora": "Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors",
    "t2i": "qwen_image_2512_fp8_e4m3fn.safetensors",
    "t2i_fast": "qwen_image_2512_int8_4steps_v1.0_comfy.safetensors",
    "clip": "qwen_2.5_vl_7b_fp8_scaled.safetensors",
    "vae": "qwen_image_vae.safetensors",
    "bg": "birefnet.safetensors",
}
# Wan 2.2 A14B：高噪声 / 低噪声两个专家，各配一对 lightx2v 4 步加速 LoRA
V = {
    "i2v_high": "wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors",
    "i2v_low": "wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors",
    "i2v_lora_high": "wan2.2_i2v_A14b_high_noise_lora_rank64_lightx2v_4step_1022.safetensors",
    "i2v_lora_low": "wan2.2_i2v_A14b_low_noise_lora_rank64_lightx2v_4step_1022.safetensors",
    "t2v_high": "wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors",
    "t2v_low": "wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors",
    "t2v_lora_high": "wan2.2_t2v_A14b_high_noise_lora_rank64_lightx2v_4step_1217.safetensors",
    "t2v_lora_low": "wan2.2_t2v_A14b_low_noise_lora_rank64_lightx2v_4step_1217.safetensors",
    "clip": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
    "vae": "wan_2.1_vae.safetensors",
}
# LTX-2.5 22B distilled（Lightricks 官方 Comfy int8_convrot），两段：半分辨率 8 步 → 潜空间 x2 放大 → 3 步精修
LTX = {
    "unet": "ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors",
    "clip": "gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors",
    "vae": "ltx-2.5-video-vae-bf16.safetensors",
    "audio_vae": "ltx-2.5-audio-vae-bf16.safetensors",
    "upscaler": "ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors",
    "sigmas1": "1.0, 0.99375, 0.9875, 0.98125, 0.975, 0.909375, 0.725, 0.421875, 0.0",
    "sigmas2": "0.85, 0.7250, 0.4219, 0.0",
    "neg": "pc game, console game, video game, cartoon, childish, ugly",
}
LTX_FPS = 24
# res 档位 -> 目标像素面积（按首帧/16:9 比例换算宽高）
RES_AREA = {"480p": 832 * 480, "720p": 1280 * 720}
# fast=True 草稿 / fast=False 定稿 的默认步数和 cfg
DEFAULTS = {
    ("t2i", True): (4, 1.0), ("t2i", False): (40, 4.0),
    ("edit", True): (8, 1.0), ("edit", False): (40, 4.0),
    ("video", True): (4, 1.0), ("video", False): (20, 3.5),
}
VIDEO_FPS = 16
DEFAULT_NEG = "低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感，构图混乱，文字模糊，扭曲"
# Wan 官方默认负面词
VIDEO_NEG = ("色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，"
             "残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，"
             "背景人很多，倒着走")

state = {"last_model": None, "mode": None, "busy": 0, "waiting": 0, "served": 0, "vram_peak_mib": 0, "switches": 0}
jobs = {}
gpu_lock = asyncio.Lock()


def token():
    with open(TOKEN_FILE) as f:
        return f.read().strip()


def snap16(v):
    return max(256, int(round(v / 16)) * 16)


def fit_1mp(w, h):
    s = (1024 * 1024 / (w * h)) ** 0.5
    return snap16(w * s), snap16(h * s)


def wf_txt2img(p, fast):
    steps, cfg = DEFAULTS[("t2i", fast)]
    steps, cfg = p.get("steps") or steps, p.get("cfg") or cfg
    neg = p.get("negative", "" if fast else DEFAULT_NEG)
    return {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": M["t2i_fast" if fast else "t2i"], "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": M["clip"], "type": "qwen_image", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": M["vae"]}},
        "4": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["1", 0], "shift": 3.1}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": p["prompt"]}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": neg}},
        "7": {"class_type": "EmptySD3LatentImage", "inputs": {"width": snap16(p.get("width", 1328)), "height": snap16(p.get("height", 1328)), "batch_size": 1}},
        "8": {"class_type": "KSampler", "inputs": {"model": ["4", 0], "positive": ["5", 0], "negative": ["6", 0], "latent_image": ["7", 0],
                                                   "seed": p["seed"], "steps": steps, "cfg": cfg, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "PreviewImage", "inputs": {"images": ["9", 0]}},
    }, M["t2i_fast" if fast else "t2i"]


def wf_edit(p, fast, names, size):
    steps, cfg = DEFAULTS[("edit", fast)]
    steps, cfg = p.get("steps") or steps, p.get("cfg") or cfg
    w, h = size
    g = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": M["edit"], "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": M["clip"], "type": "qwen_image", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": M["vae"]}},
    }
    model = ["1", 0]
    if fast:
        g["4"] = {"class_type": "LoraLoaderModelOnly", "inputs": {"model": model, "lora_name": M["edit_lora"], "strength_model": 1.0}}
        model = ["4", 0]
    g["5"] = {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": model, "shift": 3.1}}
    g["6"] = {"class_type": "CFGNorm", "inputs": {"model": ["5", 0], "strength": 1.0}}
    enc_imgs = {}
    for i, n in enumerate(names):
        g[f"20{i}"] = {"class_type": "LoadImage", "inputs": {"image": n}}
        enc_imgs[f"image{i + 1}"] = [f"20{i}", 0]
    g["10"] = {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["2", 0], "vae": ["3", 0], "prompt": p["prompt"], **enc_imgs}}
    g["11"] = {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["2", 0], "vae": ["3", 0], "prompt": p.get("negative", ""), **enc_imgs}}
    g["12"] = {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["10", 0], "reference_latents_method": "index_timestep_zero"}}
    g["13"] = {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["11", 0], "reference_latents_method": "index_timestep_zero"}}
    g["14"] = {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}}
    g["15"] = {"class_type": "KSampler", "inputs": {"model": ["6", 0], "positive": ["12", 0], "negative": ["13", 0], "latent_image": ["14", 0],
                                                    "seed": p["seed"], "steps": steps, "cfg": cfg, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}}
    g["16"] = {"class_type": "VAEDecode", "inputs": {"samples": ["15", 0], "vae": ["3", 0]}}
    g["17"] = {"class_type": "PreviewImage", "inputs": {"images": ["16", 0]}}
    return g, M["edit"] + (" + lightning8" if fast else "")


def wf_cutout(name):
    return {
        "1": {"class_type": "LoadImage", "inputs": {"image": name}},
        "2": {"class_type": "LoadBackgroundRemovalModel", "inputs": {"bg_removal_name": M["bg"]}},
        "3": {"class_type": "RemoveBackground", "inputs": {"bg_removal_model": ["2", 0], "image": ["1", 0]}},
        "4": {"class_type": "InvertMask", "inputs": {"mask": ["3", 0]}},
        "5": {"class_type": "JoinImageWithAlpha", "inputs": {"image": ["1", 0], "alpha": ["4", 0]}},
        "6": {"class_type": "PreviewImage", "inputs": {"images": ["5", 0]}},
    }


def wf_video(p, kind, names, size, frames, prefix):
    """Wan 2.2 A14B 两段采样：高噪声专家跑前一半步数，低噪声专家接着跑完。kind = i2v / t2v。"""
    fast = p["fast"]
    steps, cfg = DEFAULTS[("video", fast)]
    steps, cfg = p.get("steps") or steps, p.get("cfg") or cfg
    split = steps // 2
    w, h = size
    g = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": V[f"{kind}_high"], "weight_dtype": "default"}},
        "2": {"class_type": "UNETLoader", "inputs": {"unet_name": V[f"{kind}_low"], "weight_dtype": "default"}},
        "3": {"class_type": "CLIPLoader", "inputs": {"clip_name": V["clip"], "type": "wan", "device": "default"}},
        "4": {"class_type": "VAELoader", "inputs": {"vae_name": V["vae"]}},
    }
    high, low = ["1", 0], ["2", 0]
    if fast:
        g["5"] = {"class_type": "LoraLoaderModelOnly", "inputs": {"model": high, "lora_name": V[f"{kind}_lora_high"], "strength_model": 1.0}}
        g["6"] = {"class_type": "LoraLoaderModelOnly", "inputs": {"model": low, "lora_name": V[f"{kind}_lora_low"], "strength_model": 1.0}}
        high, low = ["5", 0], ["6", 0]
    g["7"] = {"class_type": "ModelSamplingSD3", "inputs": {"model": high, "shift": 5.0}}
    g["8"] = {"class_type": "ModelSamplingSD3", "inputs": {"model": low, "shift": 5.0}}
    g["10"] = {"class_type": "CLIPTextEncode", "inputs": {"clip": ["3", 0], "text": p["prompt"]}}
    g["11"] = {"class_type": "CLIPTextEncode", "inputs": {"clip": ["3", 0], "text": p.get("negative", VIDEO_NEG)}}
    common = {"positive": ["10", 0], "negative": ["11", 0], "vae": ["4", 0], "width": w, "height": h, "length": frames, "batch_size": 1}
    if kind == "t2v":
        g["12"] = {"class_type": "EmptyHunyuanLatentVideo", "inputs": {"width": w, "height": h, "length": frames, "batch_size": 1}}
        pos, neg, lat = ["10", 0], ["11", 0], ["12", 0]
    else:
        g["20"] = {"class_type": "LoadImage", "inputs": {"image": names[0]}}
        if len(names) > 1:
            g["21"] = {"class_type": "LoadImage", "inputs": {"image": names[1]}}
            g["12"] = {"class_type": "WanFirstLastFrameToVideo", "inputs": {**common, "start_image": ["20", 0], "end_image": ["21", 0]}}
        else:
            g["12"] = {"class_type": "WanImageToVideo", "inputs": {**common, "start_image": ["20", 0]}}
        pos, neg, lat = ["12", 0], ["12", 1], ["12", 2]
    sampler = {"cfg": cfg, "sampler_name": "euler", "scheduler": "simple", "steps": steps, "positive": pos, "negative": neg}
    g["13"] = {"class_type": "KSamplerAdvanced", "inputs": {**sampler, "model": ["7", 0], "latent_image": lat, "add_noise": "enable", "noise_seed": p["seed"],
                                                            "start_at_step": 0, "end_at_step": split, "return_with_leftover_noise": "enable"}}
    g["14"] = {"class_type": "KSamplerAdvanced", "inputs": {**sampler, "model": ["8", 0], "latent_image": ["13", 0], "add_noise": "disable", "noise_seed": p["seed"],
                                                            "start_at_step": split, "end_at_step": 10000, "return_with_leftover_noise": "disable"}}
    g["15"] = {"class_type": "VAEDecode", "inputs": {"samples": ["14", 0], "vae": ["4", 0]}}
    g["16"] = {"class_type": "CreateVideo", "inputs": {"images": ["15", 0], "fps": float(VIDEO_FPS)}}
    g["17"] = {"class_type": "SaveVideo", "inputs": {"video": ["16", 0], "filename_prefix": prefix, "format": "mp4"}}
    return g, f"wan2.2 {kind} A14B fp8" + (" + lightx2v4" if fast else "")


def wf_ltx(p, kind, names, size, frames, prefix):
    """照 ComfyUI 官方 video_ltx2_5_{i2v,t2v} 模板：半分辨率 8 步 → 潜空间 x2 放大 → 全分辨率 3 步；音视频联合生成。
    去掉了模板里可选的 gemma 提示词扩写（TextGenerateLTX2Prompt）。"""
    w, h = size
    fps = float(LTX_FPS)
    g = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": LTX["unet"], "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": LTX["clip"], "type": "ltxv", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": LTX["vae"]}},
        "4": {"class_type": "VAELoader", "inputs": {"vae_name": LTX["audio_vae"]}},
        "5": {"class_type": "LatentUpscaleModelLoader", "inputs": {"model_name": LTX["upscaler"]}},
        "10": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": p["prompt"]}},
        "11": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": p.get("negative", LTX["neg"])}},
        "12": {"class_type": "LTXVConditioning", "inputs": {"positive": ["10", 0], "negative": ["11", 0], "frame_rate": fps}},
        "13": {"class_type": "LTXVDualCFGGuider", "inputs": {"model": ["1", 0], "positive": ["12", 0], "negative": ["12", 1], "video_cfg": 1.0, "audio_cfg": 1.0}},
        "14": {"class_type": "KSamplerSelect", "inputs": {"sampler_name": "euler_ancestral"}},
        "15": {"class_type": "EmptyLTXVLatentVideo", "inputs": {"width": w // 2, "height": h // 2, "length": frames, "batch_size": 1}},
        "16": {"class_type": "LTXVEmptyLatentAudio", "inputs": {"frames_number": frames, "frame_rate": fps, "batch_size": 1, "audio_vae": ["4", 0]}},
        "20": {"class_type": "RandomNoise", "inputs": {"noise_seed": p["seed"]}},
        "21": {"class_type": "ManualSigmas", "inputs": {"sigmas": LTX["sigmas1"]}},
        "24": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["20", 0], "guider": ["13", 0], "sampler": ["14", 0], "sigmas": ["21", 0], "latent_image": ["23", 0]}},
        "25": {"class_type": "LTXVSeparateAVLatent", "inputs": {"av_latent": ["24", 0]}},
        "26": {"class_type": "LTXVLatentUpsampler", "inputs": {"samples": ["25", 0], "upscale_model": ["5", 0], "vae": ["3", 0]}},
        "30": {"class_type": "RandomNoise", "inputs": {"noise_seed": 42}},
        "31": {"class_type": "ManualSigmas", "inputs": {"sigmas": LTX["sigmas2"]}},
        "33": {"class_type": "LTXVConcatAVLatent", "inputs": {"video_latent": ["32", 0], "audio_latent": ["25", 1]}},
        "34": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["30", 0], "guider": ["13", 0], "sampler": ["14", 0], "sigmas": ["31", 0], "latent_image": ["33", 0]}},
        "35": {"class_type": "LTXVSeparateAVLatent", "inputs": {"av_latent": ["34", 0]}},
        "36": {"class_type": "VAEDecodeTiled", "inputs": {"samples": ["35", 0], "vae": ["3", 0], "tile_size": 512, "overlap": 64, "temporal_size": 64, "temporal_overlap": 16}},
    }
    if kind == "i2v":
        g["40"] = {"class_type": "LoadImage", "inputs": {"image": names[0]}}
        g["41"] = {"class_type": "LTXVPreprocess", "inputs": {"image": ["40", 0], "img_compression": 18}}
        g["22"] = {"class_type": "LTXVImgToVideoInplace", "inputs": {"vae": ["3", 0], "image": ["41", 0], "latent": ["15", 0], "strength": 0.7, "bypass": False}}
        g["32"] = {"class_type": "LTXVImgToVideoInplace", "inputs": {"vae": ["3", 0], "image": ["41", 0], "latent": ["26", 0], "strength": 1.0, "bypass": False}}
        v1 = ["22", 0]
    else:
        g["32"] = {"class_type": "LTXVLatentUpsampler", "inputs": {"samples": ["25", 0], "upscale_model": ["5", 0], "vae": ["3", 0]}}
        g.pop("26")
        v1 = ["15", 0]
    g["23"] = {"class_type": "LTXVConcatAVLatent", "inputs": {"video_latent": v1, "audio_latent": ["16", 0]}}
    cv = {"images": ["36", 0], "fps": fps}
    if p.get("audio"):
        g["37"] = {"class_type": "LTXVAudioVAEDecode", "inputs": {"samples": ["35", 1], "audio_vae": ["4", 0]}}
        cv["audio"] = ["37", 0]
    g["38"] = {"class_type": "CreateVideo", "inputs": cv}
    g["39"] = {"class_type": "SaveVideo", "inputs": {"video": ["38", 0], "filename_prefix": prefix, "format": "mp4"}}
    return g, f"ltx-2.5 22b distilled int8 {kind}" + (" +audio" if p.get("audio") else "")


def gpu_procs():
    """nvidia-smi 的整卡占用与按进程占用（MiB）。"""
    try:
        tot = subprocess.run(["nvidia-smi", "--query-gpu=memory.used,memory.total", "--format=csv,noheader,nounits"],
                             capture_output=True, text=True, timeout=10).stdout.strip().split(",")
        procs = subprocess.run(["nvidia-smi", "--query-compute-apps=pid,process_name,used_memory", "--format=csv,noheader,nounits"],
                               capture_output=True, text=True, timeout=10).stdout.strip().splitlines()
        used = int(tot[0])
        state["vram_peak_mib"] = max(state["vram_peak_mib"], used)
        return {"used_mib": used, "total_mib": int(tot[1]),
                "procs": [dict(zip(("pid", "name", "mib"), [x.strip() for x in l.split(",")])) for l in procs]}
    except Exception as e:  # noqa: BLE001
        return {"error": str(e)}


async def upload(session, png_bytes):
    name = f"api_{uuid.uuid4().hex}.png"
    form = aiohttp.FormData()
    form.add_field("image", png_bytes, filename=name, content_type="image/png")
    form.add_field("overwrite", "true")
    async with session.post(f"{COMFY}/upload/image", data=form) as r:
        r.raise_for_status()
        return (await r.json())["name"]


async def comfy_idle(session):
    async with session.get(f"{COMFY}/queue") as r:
        q = await r.json()
    return not q.get("queue_running") and not q.get("queue_pending")


async def ensure_mode(session, mode):
    """持有 gpu_lock 时调用：类别变了就让 ComfyUI 卸载全部模型并释放显存。"""
    if state["mode"] == mode:
        return
    if state["mode"] is not None:
        async with session.post(f"{COMFY}/free", json={"unload_models": True, "free_memory": True}) as r:
            r.raise_for_status()
        # ComfyUI 在工作线程空闲时处理 free 标记，稍等让它生效
        for _ in range(20):
            await asyncio.sleep(0.5)
            if await comfy_idle(session):
                break
        await asyncio.sleep(2)
        state["switches"] += 1
    state["mode"] = mode


async def run(session, graph, timeout=TIMEOUT, want="image"):
    async with session.post(f"{COMFY}/prompt", json={"prompt": graph, "client_id": "imggen"}) as r:
        body = await r.json()
        if r.status != 200:
            raise web.HTTPBadRequest(text=json.dumps(body, ensure_ascii=False), content_type="application/json")
        pid = body["prompt_id"]
    t0 = time.time()
    while time.time() - t0 < timeout:
        await asyncio.sleep(0.5 if want == "image" else 2)
        async with session.get(f"{COMFY}/history/{pid}") as r:
            h = (await r.json()).get(pid)
        if not h:
            continue
        st = h.get("status", {})
        if st.get("status_str") == "error":
            msgs = [m for m in st.get("messages", []) if m[0] == "execution_error"]
            raise web.HTTPInternalServerError(text=json.dumps(msgs, ensure_ascii=False)[:4000], content_type="application/json")
        for out in h.get("outputs", {}).values():
            for key, items in out.items():
                for it in items if isinstance(items, list) else []:
                    if not isinstance(it, dict) or "filename" not in it:
                        continue
                    is_video = it["filename"].endswith((".mp4", ".webm", ".mkv"))
                    if (want == "video") != is_video:
                        continue
                    async with session.get(f"{COMFY}/view", params={"filename": it["filename"], "subfolder": it.get("subfolder", ""),
                                                                     "type": it.get("type", "temp")}) as r:
                        return await r.read()
        if st.get("completed"):
            raise web.HTTPInternalServerError(text=f"no {want} output")
    raise web.HTTPGatewayTimeout(text="comfy timeout")


def b64png(s):
    if "," in s[:100]:
        s = s.split(",", 1)[1]
    im = Image.open(io.BytesIO(base64.b64decode(s)))
    buf = io.BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue(), im.size


@web.middleware
async def auth(request, handler):
    if request.path != "/health":
        if request.headers.get("Authorization", "") != f"Bearer {token()}":
            return web.json_response({"error": "unauthorized"}, status=401)
    return await handler(request)


async def respond(request, build):
    """生图：同步。排在 gpu_lock 后面，必要时从视频模式切回生图模式。"""
    p = await request.json() if request.can_read_body else {}
    s = request.app["session"]
    state["waiting"] += 1
    t0 = time.time()
    try:
        await asyncio.wait_for(gpu_lock.acquire(), timeout=IMAGE_WAIT)
    except asyncio.TimeoutError:
        raise web.HTTPServiceUnavailable(text="GPU 忙（视频任务未结束），稍后重试")
    finally:
        state["waiting"] -= 1
    state["busy"] += 1
    try:
        await ensure_mode(s, "image")
        graph, model = await build(p, s)
        png = await run(s, graph)
    finally:
        state["busy"] -= 1
        gpu_lock.release()
    gpu_procs()
    state["served"] += 1
    if model:
        state["last_model"] = model
    return web.Response(body=png, content_type="image/png",
                        headers={"X-Seed": str(p.get("seed", "")), "X-Elapsed": f"{time.time() - t0:.2f}", "X-Model": model or ""})


def seed_of(p):
    if p.get("seed") is None:
        p["seed"] = random.randint(0, 2**53)
    p["fast"] = bool(p.get("fast", True))


async def h_txt2img(request):
    async def build(p, s):
        if not p.get("prompt"):
            raise web.HTTPBadRequest(text="prompt required")
        seed_of(p)
        return wf_txt2img(p, p["fast"])
    return await respond(request, build)


async def h_edit(request):
    async def build(p, s):
        imgs = p.get("images") or ([p["image"]] if p.get("image") else [])
        if not p.get("prompt") or not 1 <= len(imgs) <= 3:
            raise web.HTTPBadRequest(text="prompt and 1-3 images required")
        seed_of(p)
        decoded = [b64png(x) for x in imgs]
        names = [await upload(s, b) for b, _ in decoded]
        w0, h0 = decoded[0][1]
        size = (snap16(p["width"]), snap16(p["height"])) if p.get("width") and p.get("height") else fit_1mp(w0, h0)
        return wf_edit(p, p["fast"], names, size)
    return await respond(request, build)


async def h_cutout(request):
    async def build(p, s):
        if not p.get("image"):
            raise web.HTTPBadRequest(text="image required")
        name = await upload(s, b64png(p["image"])[0])
        return wf_cutout(name), None
    return await respond(request, build)


# ---------- 视频：异步 job ----------

def job_public(j):
    keys = ("id", "kind", "backend", "status", "created", "started", "finished", "elapsed", "queue_wait", "error",
            "width", "height", "frames", "fps", "seconds", "seed", "fast", "model", "prompt", "vram_peak_mib")
    out = {k: j.get(k) for k in keys}
    if j["status"] == "done":
        out["video_url"] = f"/jobs/{j['id']}/video"
    return out


def job_save(j):
    with open(os.path.join(JOBS_DIR, j["id"] + ".json"), "w") as f:
        json.dump(job_public(j), f, ensure_ascii=False)


async def video_worker(app, j, p, names):
    s = app["session"]
    await gpu_lock.acquire()
    if j["status"] == "cancelled":            # 排队时被取消：拿到锁就立刻放掉
        gpu_lock.release()
        j["finished"] = time.time()
        job_save(j)
        return
    stop = asyncio.Event()

    async def sample_vram():  # 任务期间每 2 秒记一次整卡显存，作为本任务的峰值
        while not stop.is_set():
            g = await asyncio.to_thread(gpu_procs)
            if "used_mib" in g:
                j["vram_peak_mib"] = max(j.get("vram_peak_mib") or 0, g["used_mib"])
            try:
                await asyncio.wait_for(stop.wait(), 2)
            except asyncio.TimeoutError:
                pass

    sampler = None
    try:
        j["status"], j["started"] = "running", time.time()
        j["queue_wait"] = round(j["started"] - j["created"], 1)
        job_save(j)
        state["busy"] += 1
        await ensure_mode(s, "video")
        sampler = asyncio.create_task(sample_vram())
        build = wf_ltx if j["backend"] == "ltx" else wf_video
        graph, model = build(p, j["kind"], names, (j["width"], j["height"]), j["frames"], f"imggen/{j['id']}")
        j["model"] = model
        mp4 = await run(s, graph, timeout=VIDEO_TIMEOUT, want="video")
        with open(os.path.join(JOBS_DIR, j["id"] + ".mp4"), "wb") as f:
            f.write(mp4)
        j["status"] = "done"
        state["served"] += 1
        state["last_model"] = model
    except web.HTTPException as e:
        j["status"], j["error"] = ("cancelled", "已取消") if j.get("cancel") else ("error", e.text)
    except Exception as e:  # noqa: BLE001
        j["status"], j["error"] = "error", f"{type(e).__name__}: {e}"
    finally:
        stop.set()
        if sampler:
            await sampler
        state["busy"] -= 1
        gpu_lock.release()
        j["finished"] = time.time()
        j["elapsed"] = round(j["finished"] - j["started"], 1)
        job_save(j)


def frames_of(p, fps, mult):
    """Wan：16fps、4n+1 帧；LTX：24fps、8n+1 帧。"""
    if p.get("frames"):
        n = int(p["frames"])
    else:
        n = int(round(float(p.get("seconds", 5)) * fps)) + 1
    n = max(mult + 1, min(n, 10 * fps + 1))
    return (n - 1) // mult * mult + 1


def video_size(p, aspect_wh, backend):
    """width/height 显式给就用；否则按 res 档（480p/720p，默认 480p）和首帧（或 16:9）比例算。
    LTX 第一段跑半分辨率，所以宽高取 64 的倍数；Wan 取 16 的倍数。"""
    step = 64 if backend == "ltx" else 16
    snap = lambda v: max(step * 4, int(round(v / step)) * step)
    if p.get("width") and p.get("height"):
        return snap(p["width"]), snap(p["height"])
    area = RES_AREA.get(p.get("res", "480p"))
    if not area:
        raise web.HTTPBadRequest(text="res must be 480p or 720p")
    w, h = aspect_wh
    s = (area / (w * h)) ** 0.5
    return snap(w * s), snap(h * s)


async def submit_video(request, kind):
    p = await request.json()
    if not p.get("prompt"):
        raise web.HTTPBadRequest(text="prompt required")
    seed_of(p)
    backend = p.get("model", "wan")
    if backend not in ("wan", "ltx"):
        raise web.HTTPBadRequest(text="model must be wan or ltx")
    if backend == "ltx" and p.get("end_image"):
        raise web.HTTPBadRequest(text="end_image 目前只有 model=wan 支持")
    s = request.app["session"]
    names = []
    aspect = (16, 9)
    if kind == "i2v":
        if not p.get("image"):
            raise web.HTTPBadRequest(text="image required")
        first = b64png(p["image"])
        names.append(await upload(s, first[0]))
        aspect = first[1]
        if p.get("end_image"):
            names.append(await upload(s, b64png(p["end_image"])[0]))
    size = video_size(p, aspect, backend)
    fps = LTX_FPS if backend == "ltx" else VIDEO_FPS
    frames = frames_of(p, fps, 8 if backend == "ltx" else 4)
    jid = uuid.uuid4().hex[:12]
    j = {"id": jid, "kind": kind, "backend": backend, "status": "queued", "created": time.time(), "width": size[0], "height": size[1],
         "frames": frames, "fps": fps, "seconds": round((frames - 1) / fps, 2), "seed": p["seed"],
         "fast": p["fast"] if backend == "wan" else None, "prompt": p["prompt"], "end_frame": len(names) > 1}
    jobs[jid] = j
    job_save(j)
    asyncio.create_task(video_worker(request.app, j, p, names))
    return web.json_response(job_public(j), status=202)


async def h_img2video(request):
    return await submit_video(request, "i2v")


async def h_txt2video(request):
    return await submit_video(request, "t2v")


def job_get(jid):
    if "/" in jid or ".." in jid:
        raise web.HTTPNotFound()
    if jid in jobs:
        return job_public(jobs[jid])
    path = os.path.join(JOBS_DIR, jid + ".json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    raise web.HTTPNotFound(text="no such job")


async def h_job(request):
    return web.json_response(job_get(request.match_info["id"]))


async def h_job_video(request):
    j = job_get(request.match_info["id"])
    path = os.path.join(JOBS_DIR, j["id"] + ".mp4")
    if j.get("status") != "done" or not os.path.exists(path):
        raise web.HTTPConflict(text=f"job status: {j.get('status')}")
    return web.FileResponse(path, headers={"Content-Type": "video/mp4", "X-Seed": str(j.get("seed")), "X-Elapsed": str(j.get("elapsed"))})


async def h_job_cancel(request):
    jid = request.match_info["id"]
    j = jobs.get(jid)
    if not j:
        raise web.HTTPNotFound(text="no such job (或服务重启前的任务)")
    if j["status"] == "queued":
        j["status"], j["error"] = "cancelled", "排队时被取消"
        job_save(j)
    elif j["status"] == "running":
        j["cancel"] = True
        async with request.app["session"].post(f"{COMFY}/interrupt", json={}) as r:
            r.raise_for_status()
    return web.json_response(job_public(j))


async def h_mode(request):
    p = await request.json()
    mode = p.get("mode")
    if mode not in ("image", "video"):
        raise web.HTTPBadRequest(text="mode must be image or video")
    async with gpu_lock:
        await ensure_mode(request.app["session"], mode)
    return web.json_response({"mode": state["mode"], "gpu": gpu_procs()})


async def h_health(request):
    s = request.app["session"]
    active = [job_public(j) for j in jobs.values() if j["status"] in ("queued", "running")]
    out = {"service": "imggen", "comfy": False, "mode": state["mode"], "busy": state["busy"], "image_waiting": state["waiting"],
           "video_jobs_active": active, "served": state["served"], "mode_switches": state["switches"],
           "last_model": state["last_model"], "models": {"image": M, "video": V}}
    try:
        async with s.get(f"{COMFY}/queue", timeout=aiohttp.ClientTimeout(total=5)) as r:
            q = await r.json()
            out["queue"] = {"running": len(q.get("queue_running", [])), "pending": len(q.get("queue_pending", []))}
        async with s.get(f"{COMFY}/system_stats", timeout=aiohttp.ClientTimeout(total=5)) as r:
            ss = await r.json()
            out["comfy"] = True
            out["comfy_version"] = ss.get("system", {}).get("comfyui_version")
            out["ram_free_gb"] = round(ss.get("system", {}).get("ram_free", 0) / 2**30, 1)
    except Exception as e:  # noqa: BLE001
        out["comfy_error"] = str(e)
    out["gpu"] = gpu_procs()
    out["vram_peak_mib_seen"] = state["vram_peak_mib"]
    return web.json_response(out)


async def cleanup_jobs():
    while True:
        cutoff = time.time() - JOB_KEEP_S
        for fn in os.listdir(JOBS_DIR):
            path = os.path.join(JOBS_DIR, fn)
            if os.path.getmtime(path) < cutoff:
                os.remove(path)
        for jid in [k for k, j in jobs.items() if j.get("finished") and j["finished"] < cutoff]:
            jobs.pop(jid)
        await asyncio.sleep(3600)


async def on_start(app):
    os.makedirs(JOBS_DIR, exist_ok=True)
    # 上次进程里没跑完的 job 标成失败，免得客户端一直等
    for fn in os.listdir(JOBS_DIR):
        if fn.endswith(".json"):
            path = os.path.join(JOBS_DIR, fn)
            with open(path) as f:
                j = json.load(f)
            if j.get("status") in ("queued", "running"):
                j["status"], j["error"] = "error", "服务重启，任务中断，请重新提交"
                with open(path, "w") as f:
                    json.dump(j, f, ensure_ascii=False)
    app["session"] = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=VIDEO_TIMEOUT + 60))
    app["cleanup"] = asyncio.create_task(cleanup_jobs())


async def on_stop(app):
    app["cleanup"].cancel()
    await app["session"].close()


def main():
    app = web.Application(middlewares=[auth], client_max_size=64 * 2**20)
    app.add_routes([web.post("/txt2img", h_txt2img), web.post("/edit", h_edit), web.post("/cutout", h_cutout),
                    web.post("/img2video", h_img2video), web.post("/txt2video", h_txt2video),
                    web.get("/jobs/{id}", h_job), web.get("/jobs/{id}/video", h_job_video), web.delete("/jobs/{id}", h_job_cancel),
                    web.post("/mode", h_mode), web.get("/health", h_health)])
    app.on_startup.append(on_start)
    app.on_cleanup.append(on_stop)
    web.run_app(app, host=HOST, port=PORT, access_log_format='%a "%r" %s %Tfs')


if __name__ == "__main__":
    main()
