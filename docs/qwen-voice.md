# 千问中文配音方法（Maia「clear」）

用千问 TTS 生成中文女声旁白的做法，2026-09-28 为 Polter 宣传片定下的配方。
当时的原话是：「中文这个好，怎么生成的记录下来，以后还会用到。」

> 原始配方和冻结脚本在 `~/lugia_fc/Polter_Pub/explainer/voice/`：
> `VOICE-RECIPE.md`、`recipes/qwen-zh-maia-clear.promo_qwen.py`、`recipes/qwen-zh-maia-clear.reference.wav`。
> 本文是它的中文摘要。两边不一致时，以那份为准。

---

## 一、一句话

用 `qwen3-tts-instruct-flash` 模型、预置音色 `Maia`，再加一段「吐字清晰，但语气口语、亲切」的自然语言指令。
稿子要写成口语。

## 二、配方

| 项 | 值 |
|---|---|
| 平台 | 千问 AI 平台（DashScope），`https://maas.qianwenaiapi.com/api/v1` |
| 接口 | `POST services/aigc/multimodal-generation/generation` |
| 模型 | `qwen3-tts-instruct-flash`：预置音色，用自然语言指令控制语气 |
| 音色 | `Maia`：预置音色，不需要「声音设计」，不消耗造音色额度 |
| language_type | `Chinese` |
| optimize_instructions | `true` |
| 输出 | 接口返回一个音频 URL，下载下来是 WAV（24 kHz、单声道）。下载后用 ffmpeg 重写一次 WAV 头 |
| Key | 环境变量 `DASHSCOPE_API_KEY`，存在 `~/.config/tts-keys`。不打印、不入库 |

### instructions（逐字照抄，别改）

```
二十多岁的女生，在跟懂行的朋友安利自己做的工具。吐字一定要清晰，咬字干净，每个字都像专业主播一样清楚，不吞字、不含糊，句尾不要虚掉；但语气是口语的、亲切的，自信里带点俏皮，语速中等偏快，句子之间有自然的停顿，讲到得意处语调上扬，不要播音腔，也不要广告腔。
```

这段指令写了三层意思：
- **角色和场景**：跟懂行的朋友安利自己做的工具。
- **清晰度的硬要求**：咬字干净、不吞字、句尾不虚。
- **语气的边界**：口语、俏皮，但不要播音腔，也不要广告腔。

如果只写「亲切口语」，吐字就会糊；如果只写「清晰」，就会变成播音腔。所以两头都要写。

### 请求体

```json
{
  "model": "qwen3-tts-instruct-flash",
  "input": {
    "text": "<要念的稿子>",
    "voice": "Maia",
    "language_type": "Chinese",
    "instructions": "<上面那段 instructions>",
    "optimize_instructions": true
  }
}
```

请求头是 `Authorization: Bearer $DASHSCOPE_API_KEY` 和 `Content-Type: application/json`。
返回里的音频地址在 `output.audio.url`。

## 三、怎么跑

```sh
cd ~/lugia_fc/Polter_Pub/explainer
set -a; . ~/.config/tts-keys; set +a        # 载入 Key，不回显
python3 voice/recipes/qwen-zh-maia-clear.promo_qwen.py instruct zh <稿子.txt> <输出.wav> --voice Maia
```

- 一定要用 `voice/recipes/` 下**冻结的那份脚本**。`voice/promo_qwen.py` 以后可能还会改，别依赖它。
- `--voice Maia` 必须写上，脚本默认的音色是 `Cherry`。
- 脚本做了这几步：读稿 → 调接口 → 下载音频 → 用 `ffmpeg -c:a pcm_s16le` 重写 WAV 头，否则播放器读到的时长不对 → 打印时长。

### 首次准备

```sh
# 存 Key：用 >> 追加。用 > 会覆盖掉文件里的其它 Key（真出过这事）
echo 'DASHSCOPE_API_KEY=sk-...' >> ~/.config/tts-keys
chmod 600 ~/.config/tts-keys
# 需要 python3 和 ffmpeg
```

## 四、稿子怎么写（好听的另一半原因）

同一个音色，念广告短句会发假，念口语就自然。写稿时注意这几点：

- 要有连接词和语气：「你有没有过这种时候？」「另一个呢，其实……」
- 句子长短错开，别全是三四个字的口号。
- 像在跟人说话，不像在念文案。

当时的试音稿（参考音频 18.2 秒）：

> 你有没有过这种时候？同时开了四五个 AI 在干活，结果一个卡在那儿等你回话，另一个呢，其实早就干完了，你还得一个一个点开去看。Polter 就是来解决这个的：你挑一个终端当总管，剩下的，交给它盯着就好。

## 五、怎么选出来的

- **试过的预置音色**（都配同一段 instructions）：Maia、Cherry、Serena、Bellona、Elias。最后听下来选了 Maia。
- **也试过「声音设计」路线**：用 `qwen-voice-design` 从描述造一个音色，再用 `qwen3-tts-vd-2026-01-26` 合成。造过 `polterdev` 和 `polterclear` 两个，最后没选。另外，造音色的免费额度是 10 次，脚本在已经存过音色时会拒绝再造，除非加 `--again`。
- **可以客观打分**：`voice/samples/score.sh` 先用 whisper medium 把每条试听转写成文字，再用 `cer.py` 算它和原稿的字错误率（CER），作为「吐字清不清楚」的客观分。最终还是以人耳试听为准。
- **被否掉的其它方案**：
  - edge-tts：「一听就是 AI」。
  - 本地开源 TTS：渲染太慢，被叫停。
  - 所以用 API。

## 六、注意事项

1. **同一个配方，不等于同一条音频。** 用冻结脚本、同一段稿子重跑，原来那条 18.2 秒，重跑是 16.9 秒。模型有随机性，语速和停顿每次略有不同，但音色和风格是稳定的。所以：
   - 定稿的那条音频本身要留档。
   - 某一句不满意，就单句重生成几次，挑一条好的，别指望能重跑出一模一样的。
2. **配方里任何一项改了**（模型、音色、指令、参数），出来的就不是这个声音了，要重新试听。
3. **Key 不打印、不入库。** 脚本报错时只显示接口的回复，不显示请求内容。
4. **长稿子**：建议按段落或句子分开生成再拼接。这样哪一句不满意，只重做那一句。

## 附：英文怎么配

英文用的不是千问，是 Gemini：
- 模型 `gemini-3.8-flash-tts`，用 Voice design 造的音色。
- **不加 style**：加了 style，语气会「太强烈」。

细节见同目录的 `VOICE-RECIPE.md` 下半部分。
