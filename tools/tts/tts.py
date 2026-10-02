#!/usr/bin/env python3
"""读 <dir>/script.md 的旁白，用 edge-tts（默认）或千问 TTS 生成分段音频、整条旁白和 timings.json。

用法：
    python3 tools/tts/tts.py episodes/epNN-slug [--engine edge|qwen] [--voice ...] [--rate +0%]
                                                [--pause 0.4] [--gap id=秒 ...] [--lead 0] [--tail 0.6] [--force [id ...]]

--engine qwen：调用冻结脚本 ~/lugia_fc/Polter_Pub/explainer/voice/recipes/qwen-zh-maia-clear.promo_qwen.py
    （配方见 docs/qwen-voice.md，默认音色 Maia）。Key 只从环境变量 DASHSCOPE_API_KEY 读，先在 shell 里
    `set -a; . ~/.config/tts-keys; set +a`。本工具不打印、不落盘 Key。
    千问每次合成都有随机性，所以按段缓存：某段不满意就 `--force s03` 只重做那一段。
    首尾静音会被裁掉（段间停顿统一由 --pause 控制）。
--sentence-pause 0.45：按句合成（按 。？！ 切，逗号不切），同段句间插 0.45s；段间仍用 --pause。
    timings.json 每段多一层 sentences:[{text,start,end}]。缓存按句：seg-<id>-<k>.wav。
--question-extra 0.2：问句后多停 0.2s（句间、段间都加）。
--gap s03=2.2：某段之前的停顿单独指定（总长，不再叠加问句加时），比如留出无配音字卡的时间。
--force：不带 id 表示全部重来；带 id 只重做这些段。

script.md 格式：每段以 `## <id>` 开头，段内 `旁白：` 之后到 `画面：` / 下一段之前的文字是旁白。

产物（<dir>/narration/）：
    seg-<id>.mp3      edge-tts 原始输出（文本/音色/语速不变时复用，不重新请求）
    seg-<id>.wav      千问原始输出（--engine qwen；文本/音色/配方不变时复用）
    narration.mp3     lead 静音 + 各段（段间 pause 静音）+ tail 静音
    timings.json      {segments:[{id,text,start,end[,sentences]}], duration, voice, rate, pause, engine, speech_mean_db}
                      speech_mean_db：只算各段语音（不含停顿）的平均电平，供页面给配乐定音量

时间全部来自 ffprobe 实测：各段先解码成同一采样率的 PCM，按实测时长累加，再一次性编码成 mp3。
"""
import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import os

QWEN_SCRIPT = Path.home() / "lugia_fc/Polter_Pub/explainer/voice/recipes/qwen-zh-maia-clear.promo_qwen.py"
RATE_RANGE = (3.5, 5.5)  # 字/秒，超出就提示重做该段

SAMPLE_RATE = 24000  # edge-tts 输出就是 24kHz 单声道

HEADING = re.compile(r"^##\s+(\S+)\s*$")
FIELD = re.compile(r"^(旁白|画面)\s*[：:]\s*(.*)$")


def parse_script(path: Path):
    """返回 [(id, 旁白文本)]，跳过旁白为空的段。"""
    segments, cur_id, cur_field, buf = [], None, None, []

    def flush():
        if cur_id is not None:
            text = "".join(line.strip() for line in buf).strip()
            if text:
                segments.append((cur_id, text))

    in_comment = False
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        # 跳过 HTML 注释
        if in_comment:
            if "-->" in line:
                in_comment = False
            continue
        if line.lstrip().startswith("<!--"):
            in_comment = "-->" not in line
            continue

        m = HEADING.match(line)
        if m:
            flush()
            cur_id, cur_field, buf = m.group(1), None, []
            continue
        if cur_id is None:
            continue
        m = FIELD.match(line.strip())
        if m:
            cur_field = m.group(1)
            if cur_field == "旁白":
                buf.append(m.group(2))
            continue
        if cur_field == "旁白":
            buf.append(line)
    flush()

    ids = [s[0] for s in segments]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        sys.exit(f"script.md 里段落 id 重复：{', '.join(sorted(dup))}")
    return segments


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    return float(out)


def run_ffmpeg(args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


async def synth(text: str, voice: str, rate: str, out: Path):
    import edge_tts
    await edge_tts.Communicate(text, voice, rate=rate).save(str(out))


def synth_qwen(text: str, voice: str, out: Path):
    """调冻结脚本合成一段。Key 经环境变量传给子进程，这里不碰它的值。"""
    if not os.environ.get("DASHSCOPE_API_KEY"):
        sys.exit("没有 DASHSCOPE_API_KEY：先在同一个 shell 里 `set -a; . ~/.config/tts-keys; set +a`")
    with tempfile.TemporaryDirectory() as tmp:
        txt = Path(tmp) / "text.txt"
        txt.write_text(text, encoding="utf-8")
        raw = Path(tmp) / "raw.wav"
        r = subprocess.run([sys.executable, str(QWEN_SCRIPT), "instruct", "zh", str(txt), str(raw), "--voice", voice],
                           capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit(f"千问合成失败：{(r.stderr or r.stdout).strip()[:800]}")
        # 裁掉首尾静音（-50 dB 以下），尾巴留 60ms 自然衰减
        run_ffmpeg(["-i", str(raw), "-af",
                    "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,"
                    "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse",
                    "-ar", str(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s16le", str(out)])


def spoken_chars(text: str) -> int:
    """语速口径：汉字各算 1，连续的英文字母/数字（如 Polter、C、API）各算 1 个词。"""
    return len(re.findall(r"[\u4e00-\u9fff]", text)) + len(re.findall(r"[A-Za-z0-9#]+", text))


def mean_db(path: Path) -> float:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.search(r"mean_volume:\s*(-?[\d.]+) dB", r.stderr)
    return float(m.group(1)) if m else 0.0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir", type=Path, help="集目录（含 script.md）")
    ap.add_argument("--engine", choices=["edge", "qwen"], default="edge")
    ap.add_argument("--voice", default=None, help="edge 默认 zh-CN-YunxiNeural；qwen 默认 Maia")
    ap.add_argument("--rate", default="+0%", help="edge-tts 语速，如 -10%% / +5%%")
    ap.add_argument("--pause", type=float, default=0.4, help="段间停顿秒数")
    ap.add_argument("--sentence-pause", type=float, default=None,
                    help="给出时按句（。？！）分别合成，同段句间插这么长的静音")
    ap.add_argument("--question-extra", type=float, default=0.0,
                    help="问句（？结尾）之后额外多停的秒数（只在按句模式下生效）")
    ap.add_argument("--gap", nargs="*", default=[], metavar="ID=秒",
                    help="某段之前的停顿单独指定，如 s03=2.2")
    ap.add_argument("--lead", type=float, default=0.0, help="开头静音秒数")
    ap.add_argument("--tail", type=float, default=0.6, help="结尾静音秒数")
    ap.add_argument("--force", nargs="*", default=None, metavar="ID",
                    help="忽略缓存重新合成；不带 id 表示全部，带 id 只重做这些段")
    args = ap.parse_args()
    if args.voice is None:
        args.voice = "Maia" if args.engine == "qwen" else "zh-CN-YunxiNeural"
    try:
        gaps = {k: float(v) for k, v in (g.split("=", 1) for g in args.gap)}
    except ValueError:
        sys.exit("--gap 格式应为 id=秒，如 s03=2.2")
    force_all = args.force is not None and len(args.force) == 0
    force_ids = set(args.force or [])

    script = args.dir / "script.md"
    if not script.exists():
        sys.exit(f"找不到 {script}")
    segments = parse_script(script)
    if not segments:
        sys.exit(f"{script} 里没有任何「旁白：」文本")

    out_dir = args.dir / "narration"
    out_dir.mkdir(parents=True, exist_ok=True)
    cache_path = out_dir / ".cache.json"
    unknown = (force_ids | set(gaps)) - {sid for sid, _ in segments}
    if unknown:
        sys.exit(f"--force / --gap 里的段落不存在：{', '.join(sorted(unknown))}")
    cache = {} if force_all or not cache_path.exists() else json.loads(cache_path.read_text())

    # 1. 合成单位：整段，或（--sentence-pause 时）按 。？！ 切成的句子
    def split_sentences(text):
        return [x.strip() for x in re.findall(r"[^。？！]+[。？！]*[”」』]?", text) if x.strip()]

    units = []  # (段 id, 文件名 stem, 文本)
    for sid, text in segments:
        if args.sentence_pause is None:
            units.append((sid, f"seg-{sid}", text))
        else:
            sents = split_sentences(text)
            if re.sub(r"\s", "", "".join(sents)) != re.sub(r"\s", "", text):  # 切句只许去掉句间空白
                sys.exit(f"{sid} 切句后文字对不上：{sents}")
            for k, st in enumerate(sents, 1):
                units.append((sid, f"seg-{sid}-{k}", st))

    # 文本/音色/语速/引擎未变且文件在，就复用
    ext = "wav" if args.engine == "qwen" else "mp3"
    recipe = hashlib.sha1(QWEN_SCRIPT.read_bytes()).hexdigest()[:12] if args.engine == "qwen" else ""
    new_cache = {}
    for sid, stem, text in units:
        ident = f"{args.voice}|{args.rate}|{text}" if args.engine == "edge" else f"qwen|{recipe}|{args.voice}|{text}"
        key = hashlib.sha1(ident.encode()).hexdigest()
        seg_file = out_dir / f"{stem}.{ext}"
        new_cache[stem] = key
        if sid not in force_ids and cache.get(stem) == key and seg_file.exists():
            print(f"  {stem}: 复用缓存")
            continue
        print(f"  {stem}: 合成中 …")
        if args.engine == "qwen":
            synth_qwen(text, args.voice, seg_file)
        else:
            asyncio.run(synth(text, args.voice, args.rate, seg_file))
    # 删掉讲稿里已不存在的旧段（以及另一种引擎留下的段）
    keep = {f"{stem}.{ext}" for _, stem, _ in units}
    for old in [*out_dir.glob("seg-*.mp3"), *out_dir.glob("seg-*.wav")]:
        if old.name not in keep:
            old.unlink()
    cache_path.write_text(json.dumps(new_cache, ensure_ascii=False, indent=2))

    # 2. 解码成统一 PCM，实测时长，排时间轴
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        pcm = ["-ar", str(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s16le"]

        def silence(seconds):
            p = tmp / f"sil-{round(seconds * 1000)}.wav"
            if not p.exists():
                run_ffmpeg(["-f", "lavfi", "-i", f"anullsrc=r={SAMPLE_RATE}:cl=mono",
                            "-t", f"{seconds:.3f}", *pcm, str(p)])
            return p

        def add_silence(seconds):
            nonlocal t
            if seconds > 0:
                parts.append(silence(seconds))
                t += probe_duration(parts[-1])

        parts, timings, t = [], [], 0.0
        add_silence(args.lead)
        prev = None  # 上一个单位：(段 id, 文本)
        for sid, stem, text in units:
            if prev is not None:
                if prev[0] != sid and sid in gaps:
                    add_silence(gaps[sid])          # 指定的段前停顿是总长，不再叠加问句加时
                else:
                    base = args.pause if prev[0] != sid else args.sentence_pause
                    extra = args.question_extra if prev[1].rstrip("”」』").endswith("？") else 0.0
                    add_silence(base + extra)
            wav = tmp / f"{stem}.wav"
            run_ffmpeg(["-i", str(out_dir / f"{stem}.{ext}"), *pcm, str(wav)])
            d = probe_duration(wav)
            if not timings or timings[-1]["id"] != sid:
                timings.append({"id": sid, "text": dict(segments)[sid], "start": round(t, 3), "end": None})
                if args.sentence_pause is not None:
                    timings[-1]["sentences"] = []
            if args.sentence_pause is not None:
                timings[-1]["sentences"].append({"text": text, "start": round(t, 3), "end": round(t + d, 3)})
            parts.append(wav)
            t += d
            timings[-1]["end"] = round(t, 3)
            prev = (sid, text)
        add_silence(args.tail)

        speech = tmp / "speech.txt"
        speech.write_text("".join(f"file '{tmp / f'{stem}.wav'}'\n" for _, stem, _ in units))
        speech_wav = tmp / "speech.wav"
        run_ffmpeg(["-f", "concat", "-safe", "0", "-i", str(speech), "-c", "copy", str(speech_wav)])
        speech_db = mean_db(speech_wav)

        lst = tmp / "list.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in parts))
        full = tmp / "narration.wav"
        run_ffmpeg(["-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(full)])
        wav_duration = probe_duration(full)
        narration = out_dir / "narration.mp3"
        run_ffmpeg(["-i", str(full), "-c:a", "libmp3lame", "-b:a", "128k", str(narration)])

    # 以 wav 实测总长为准（mp3 容器时长会多出几十毫秒编码填充）
    data = {
        "segments": timings,
        "duration": round(wav_duration, 3),
        "voice": args.voice,
        "rate": args.rate,
        "pause": args.pause,
        "sentence_pause": args.sentence_pause,
        "question_extra": args.question_extra if args.sentence_pause is not None else 0.0,
        "gaps": gaps,
        "engine": args.engine,
        "speech_mean_db": round(speech_db, 1),
    }
    (out_dir / "timings.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    bad = []
    for s in timings:
        d = sum(x["end"] - x["start"] for x in s["sentences"]) if "sentences" in s else s["end"] - s["start"]
        rate = spoken_chars(s["text"]) / d
        flag = "" if RATE_RANGE[0] <= rate <= RATE_RANGE[1] else "  ← 语速超出范围"
        if flag:
            bad.append(s["id"])
        print(f"  {s['id']}: {s['start']:6.2f} → {s['end']:6.2f}  ({d:5.2f}s, {rate:.2f} 字/秒){flag}  {s['text']}")
    print(f"总长 {data['duration']:.2f}s，语音平均电平 {speech_db:.1f} dB → {out_dir / 'timings.json'}")
    if bad:
        print(f"语速不在 {RATE_RANGE[0]}–{RATE_RANGE[1]} 字/秒：{' '.join(bad)}（可 --force {' '.join(bad)} 重做）")


if __name__ == "__main__":
    main()
