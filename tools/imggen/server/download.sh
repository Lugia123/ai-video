#!/bin/bash
# 从 ModelScope 拉模型到 /opt/imggen/models-src/<repo>/
set -u
MS=/opt/imggen/venv-dl/bin/modelscope
D=/opt/imggen/models-src
dl(){ echo "[$(date +%T)] start $1 $2"; $MS download --model "$1" "$2" --local_dir "$D/$1" >/dev/null 2>>/opt/imggen/logs/download.err && echo "[$(date +%T)] ok $2" || echo "[$(date +%T)] FAIL $2"; }
dl Comfy-Org/Qwen-Image_ComfyUI split_files/vae/qwen_image_vae.safetensors
dl lightx2v/Qwen-Image-Edit-2511-Lightning Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors
dl Comfy-Org/Qwen-Image_ComfyUI split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors
dl Comfy-Org/Qwen-Image-Edit_ComfyUI split_files/diffusion_models/qwen_image_edit_2511_int8_convrot.safetensors
dl lightx2v/Qwen-Image-2512-Lightning qwen_image_2512_int8_4steps_v1.0.safetensors
dl Comfy-Org/Qwen-Image_ComfyUI split_files/diffusion_models/qwen_image_2512_fp8_e4m3fn.safetensors
echo "[$(date +%T)] ALL DONE"
