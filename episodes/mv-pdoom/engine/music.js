// 音乐时钟：data/audio.json → t 的纯函数查询。时间轴 = mp3 无缝解码时间（和 lyrics.json 一致）。
//
//   beatAt(t)   → { i, t0, phase, inBar, isDown }   i = 最近一个 ≤ t 的拍（数组外按周期外推），phase 0..1
//   barAt(t)    → { i, t0, phase }                  以 downbeats 为小节线
//   beatTime(i) → 第 i 拍的时间（可为负 / 越界，按周期外推）；barTime(i) 同理
//   downbeats[] / beats[] / sections[] / period / bpm / duration
//   sectionAt(t)→ { i, name, start, end, p }
//   energy(name, t) → 0..1   name ∈ rms|low|mid|high|vocal|drums|bass|other（100 fps 线性插值）
//   onsetsNear(t, win, kind?) → [{ time, strength, kind }]  |onset − t| ≤ win，按时间排序；kind ∈ kick|snare|hat|vocal，省略 = 全部
//   pulse(kind, t, { decay, window })  → Σ strength·exp(−age/decay)，卡点抖动 / 闪光用（只看过去的 onset）
//   beatPulse(t, { decay, downOnly })  → 规则网格上的 1→0 衰减脉冲（无鼓段落也能用）
//   snap(t, win, { grid })             → ±win 内有 downbeat（grid:'beat' 时为拍）就吸附过去

export function lastIdx(arr, x, key = v => v) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (key(arr[mid]) <= x) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

export function createMusic(A) {
  const beats = A.beats, downbeats = A.downbeats, period = A.beat_period;
  const firstDown = downbeats[0];
  const i0 = beats.findIndex(b => Math.abs(b - firstDown) < 1e-3);   // 第一个 downbeat 在 beats 里的序号
  const sections = A.sections.map((s, i) => ({ ...s, i }));
  const onsets = A.onsets;
  const KINDS = Object.keys(onsets);

  const beatTime = i => (i < 0 ? beats[0] + i * period : i >= beats.length ? beats[beats.length - 1] + (i - beats.length + 1) * period : beats[i]);
  const barTime = i => (i < 0 ? firstDown + i * 4 * period : i >= downbeats.length ? downbeats[downbeats.length - 1] + (i - downbeats.length + 1) * 4 * period : downbeats[i]);

  function beatAt(t) {
    let i = lastIdx(beats, t);
    if (i < 0) i = Math.floor((t - beats[0]) / period);
    else if (i === beats.length - 1 && t >= beats[i] + period) i += Math.floor((t - beats[i]) / period);
    const t0 = beatTime(i), t1 = beatTime(i + 1);
    const inBar = ((((i - i0) % 4) + 4) % 4);
    return { i, t0, phase: (t - t0) / (t1 - t0), inBar, isDown: inBar === 0 };
  }

  function barAt(t) {
    let i = lastIdx(downbeats, t);
    if (i < 0) i = Math.floor((t - firstDown) / (4 * period));
    else if (i === downbeats.length - 1 && t >= downbeats[i] + 4 * period) i += Math.floor((t - downbeats[i]) / (4 * period));
    const t0 = barTime(i), t1 = barTime(i + 1);
    return { i, t0, phase: (t - t0) / (t1 - t0) };
  }

  function sectionAt(t) {
    const i = Math.max(0, lastIdx(sections, t, s => s.start));
    const s = sections[i];
    return { i, name: s.name, start: s.start, end: s.end, p: Math.min(1, Math.max(0, (t - s.start) / (s.end - s.start))) };
  }

  function energy(name, t) {
    const arr = A[name];
    if (!arr) throw new Error(`audio.json 没有能量轨 ${name}`);
    const x = t * A.fps, i = Math.floor(x);
    if (i < 0) return arr[0];
    if (i >= arr.length - 1) return arr[arr.length - 1];
    return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
  }

  function onsetsNear(t, win = 0.1, kind = null) {
    const out = [];
    for (const k of kind ? [kind] : KINDS) {
      const list = onsets[k] || [];
      for (let i = Math.max(0, lastIdx(list, t - win, o => o[0])); i < list.length && list[i][0] <= t + win; i++) {
        if (Math.abs(list[i][0] - t) <= win) out.push({ time: list[i][0], strength: list[i][1], kind: k });
      }
    }
    return out.sort((a, b) => a.time - b.time);
  }

  function pulse(kind, t, { decay = 0.12, window = 0.6 } = {}) {
    const list = onsets[kind] || [];
    let sum = 0;
    for (let i = lastIdx(list, t, o => o[0]); i >= 0 && t - list[i][0] <= window; i--) sum += list[i][1] * Math.exp(-(t - list[i][0]) / decay);
    return Math.min(1, sum);
  }

  function beatPulse(t, { decay = 0.1, downOnly = false } = {}) {
    const b = downOnly ? barAt(t) : beatAt(t);
    return Math.exp(-(t - b.t0) / decay);
  }

  function snap(t, win = 0.25, { grid = 'down' } = {}) {
    const g = grid === 'beat' ? beats : downbeats;
    const i = lastIdx(g, t);
    const a = g[Math.max(0, i)], b = g[Math.min(g.length - 1, i + 1)];
    const n = Math.abs(t - a) <= Math.abs(b - t) ? a : b;
    return Math.abs(n - t) <= win ? n : t;
  }

  return {
    duration: A.duration, bpm: A.bpm, period, beats, downbeats, sections, onsets,
    beatAt, barAt, beatTime, barTime, sectionAt, energy, onsetsNear, pulse, beatPulse, snap,
    // 兼容 dance3d.beatClock(M)：它要 M.beat(t) / M.beats / M.downbeats / M.period
    beat: beatAt,
  };
}
