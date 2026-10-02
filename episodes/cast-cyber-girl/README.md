# cast-cyber-girl：主角与猫咪伴舞角色设定

全部用千问 `qwen-image-edit-plus` API 生成（`tools/dt/qwen_edit.py`、`tools/dt/batch_edit.py`，Key 走 ~/.config/tts-keys）。

- `refs/`：真人参考照片（不入库）
- `style/`：风格候选；用户选定 `cand-seed11.png`（本机 Draw Things 出）
- `turnaround/final/`：主角三视图。建模用 `front-tpose.png` / `side.png` / `back-tpose.png`；自然站姿 `front.png` / `back.png`
- `closeup/final/`：近景 2D 素材，`neutral` + 表情（eyes-closed/eyes-half/wink/smile/surprised）+ 口型（mouth-a/i/u/e/o），`expressions-sheet.jpg` 总览
- `closeup/layers/`：近景 2D 分层（01-body 去发底图 / 02-head / eyes/* / mouth/* / 04-hair，同画布对齐），参数见 rig.json
- `cats/`：5 只猫咪伴舞，统一队服（青色短卫衣+粉色束脚裤+黄鞋+青色护目镜）
  - `design/<花色>.png`：持荧光棒标准造型（orange 橘 / white 白 / calico 三花 / bluegray 蓝灰 / tuxedo 奶牛（黑猫、带胡子奶牛猫被用户否掉，存于 _old/））
  - `props/<花色>.png`：搞笑道具——橘猫双手鱼形荧光棒、白猫盯着自己的逗猫棒、三花毛线球溜溜球缠腿、蓝灰猫拿猫条当麦克风偷舔、奶牛猫激光笔点到自己脚
  - `turnaround/<花色>/front-tpose.png`、`back-tpose.png`：建模用 T 字
  - `crew-sheet.jpg`：总览
  - `turnaround/{bluegray,tuxedo}/front-tpose-smile.png`：换成用户新定微笑脸（_smile/*-soft-*）的 T 字图，纸偶用它
  - `puppet/<花色>/`：2D 骨骼纸偶部件 + puppet.json（做法见 tools/layers/README.md），`puppet/poses.json` 通用舞姿；5 只都已做，前臂含握着的荧光棒
- `puppet/girl/`：主角全身纸偶（长发后片 hair_back、刘海 hair_front、eyes/ mouth/ 换图，前臂握荧光棒）
