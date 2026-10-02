// 逐词歌词：data/lyrics.json → t 的纯函数查询。
//
//   lines[i] = { i, text, start, end, words: [{ w, start, end, k, syl? }] }
//   lineAt(t, { lead=0, hold=0 }) → start−lead ≤ t < end+hold 的那一行（重叠取较晚开始的）| null
//   wordsAt(t)   → 此刻正在唱的词（可能跨行，通常 0 或 1 个）[{ ...word, line }]
//   wordState(word, t) → { state: 'pending'|'active'|'done', p }   p = 唱词内进度 0..1（pending 0 / done 1）
//                 「亮起」一律看 t ≥ word.start —— 第一帧 = ceil(start·fps)，绝不抢跑
//   lineProgress(line, t) → 行内 0..1（按词分段线性）
//   extras      → lyrics.json 里的 ad-lib（"ah"、"oh-oh" 等），原样

export function createLyrics(J) {
  const lines = J.lines.map(l => ({ i: l.i, text: l.text, start: l.start, end: l.end, words: l.words.map((w, k) => ({ ...w, k, line: l.i })) }));
  const words = lines.flatMap(l => l.words);

  function lineAt(t, { lead = 0, hold = 0 } = {}) {
    let best = null;
    for (const l of lines) if (t >= l.start - lead && t < l.end + hold) best = l;
    return best;
  }

  const wordsAt = t => words.filter(w => t >= w.start && t < w.end);

  function wordState(w, t) {
    if (t < w.start) return { state: 'pending', p: 0 };
    if (t < w.end) return { state: 'active', p: (t - w.start) / Math.max(1e-3, w.end - w.start) };
    return { state: 'done', p: 1 };
  }

  function lineProgress(line, t) {
    const ws = line.words, n = ws.length;
    if (t <= ws[0].start) return 0;
    for (let k = 0; k < n; k++) if (t < ws[k].end) return (k + Math.max(0, Math.min(1, (t - ws[k].start) / (ws[k].end - ws[k].start)))) / n;
    return 1;
  }

  return { lines, words, extras: J.extras || [], lineAt, wordsAt, wordState, lineProgress };
}
