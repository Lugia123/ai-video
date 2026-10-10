# clips-blank：空脸动作小样（#1221）
素材不入库。画布 832×1104（= clips-b1/frames/idle.png，home_rgba 的 INTER_AREA 缩小）。
- `home_blank_rgba.png` / `home_blank_magenta.png`：空脸归位帧（做法 A：clips-b1 干净脸贴片贴回；alpha 与归位帧逐像素相同，改动只在 x283–540 y355–525）。鼻子的小点留着。
- `cmp6x_A.png`（原 | A）、`cmp6x_B_d_s1/d_s2/f_s1.png`（原 | 改图法 B，ECC 配准后只取贴片范围）。
- `gen/`：`edit.sh`（改图）、`make_blank.py`（A / B 合成）、`compare6x.py`。`edit/`：改图原结果和日志。

## 6 条空脸草稿（2026-10-10）
`raw/<动作>-blank1-<档>-s<种子>.mp4`（draft = 4 步 LoRA cfg1；mid8c15 = LoRA 8 步 cfg1.5 + 反向词）、`frames/` 抠好的帧（批 1 同一套：键色软边、不锁定）、`readings/*.face.json` 脸部/头晃读数、`readings/*.after.txt` 完整读数。
产物（不入库）在 puppet/out/clips-blank/：review/（1:1 连续片）、*-face.jpg（逐帧脸部）、*-curve.png（脸区色差/五官像素/头晃曲线）、checks/、*-zoom.jpg。`gen/after_all.sh <段名>` 重出全部产物；提示词在 `gen/prompts.sh`。
