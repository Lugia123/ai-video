// 纸感 lo-fi 铺底配乐 + 轻量交互音效，全部用 OfflineAudioContext 合成（种子 PRNG，逐次输出相同）。
//
//   import { renderLofi, encodeWav } from '../../assets/lib/lofi.js';
//   const buf = await renderLofi({
//     duration,                       // 秒
//     speech: [[t0, t1], ...],        // 旁白在说话的区间（timings.json 的各段）
//     speechDb,                       // 旁白语音平均电平（timings.json 的 speech_mean_db）
//     bright: [[t0, t1], ...],        // 允许配乐稍亮的区间（片头、结尾字卡）
//     sfx: [{ t, kind }],             // kind: click | pop | snip | boing | ding | whoosh
//   });
//   window.__video.renderAudio = async () => encodeWav(buf)
//
// 电平：配乐在旁白说话时比旁白低 DUCK_DB（默认 20 dB），停顿里低 GAP_DB（17 dB），bright 区间低 BRIGHT_DB（12 dB）。
// 做法是先合成原始铺底，再按上面的目标逐样本乘增益曲线（平滑过渡），最后整体定标：
// 说话区间里配乐的 RMS = speechDb − DUCK_DB。

export const SR = 44100;
const mtof = m => 440 * 2 ** ((m - 69) / 12);
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function renderLofi({
  duration, speech = [], speechDb = -21, bright = [], sfx = [], seed = 20260928,
  bpm = 74, DUCK_DB = 20, GAP_DB = 17, BRIGHT_DB = 12, drumsFrom = 5.5, sfxDb = -16,
}) {
  const N = Math.round(SR * duration);
  const ctx = new OfflineAudioContext(2, N, SR);
  const rnd = mulberry32(seed);
  const beat = 60 / bpm, bar = beat * 4;

  const noise = ctx.createBuffer(1, SR * 2, SR);
  { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1; }
  const noiseSrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.start(t, rnd() * 1.5, dur); return s; };

  // 母线：温暖低通（纸感，不刺耳）→ 轻压缩
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 2.5; comp.attack.value = 0.01; comp.release.value = 0.2;
  comp.connect(ctx.destination);
  const warm = ctx.createBiquadFilter(); warm.type = 'lowpass'; warm.frequency.value = 3800; warm.Q.value = 0.4;
  warm.connect(comp);
  const master = ctx.createGain(); master.gain.value = 0.8; master.connect(warm);

  const room = ctx.createConvolver();
  {
    const len = Math.round(SR * 2.2), ir = ctx.createBuffer(2, len, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * Math.exp(-i / (SR * 0.55)); }
    room.buffer = ir;
  }
  const roomOut = ctx.createGain(); roomOut.gain.value = 0.22; room.connect(roomOut).connect(master);
  const send = (node, amt) => { const g = ctx.createGain(); g.gain.value = amt; node.connect(g).connect(room); };
  const pan = (node, p) => { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };
  const env = (g, t, peak, a, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };

  // 电钢琴：正弦 + 二次谐波，慢衰减，轻微走音（磁带 wow）
  function keys(t, m, v, dur, p) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06 * v, t + 0.012);
    g.gain.setTargetAtTime(0.03 * v, t + 0.02, 0.5);
    g.gain.setTargetAtTime(0, t + dur, 0.25);
    const out = pan(g, p); out.connect(master); send(g, 0.5);
    for (const [ratio, amp, det] of [[1, 1, 0], [2, 0.18, 3], [1, 0.5, -6]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.frequency.value = mtof(m) * ratio; o.detune.value = det + 4 * Math.sin(t * 0.9);
      og.gain.value = amp; o.connect(og).connect(g);
      o.start(t); o.stop(t + dur + 1.6);
    }
  }
  function bass(t, m, dur) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = mtof(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.02); g.gain.setTargetAtTime(0.08, t + 0.05, 0.3); g.gain.setTargetAtTime(0, t + dur, 0.08);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.5);
  }
  function kick(t, v = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    env(g, t, 0.42 * v, 0.004, 0.28);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.4);
  }
  function rim(t, v = 1) {
    const bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.1;
    env(g, t, 0.12 * v, 0.002, 0.12);
    noiseSrc(t, 0.2).connect(bp).connect(g).connect(master); send(g, 0.6);
  }
  function hat(t, v = 1) {
    const hp = ctx.createBiquadFilter(), g = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 6500;
    env(g, t, 0.035 * v, 0.002, 0.04);
    pan(noiseSrc(t, 0.08).connect(hp).connect(g), 0.3).connect(master);
  }
  function bell(t, m, v = 1) {
    for (const [ratio, amp, dec] of [[1, 0.05, 1.2], [3.01, 0.012, 0.4]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = mtof(m) * ratio;
      env(g, t, amp * v, 0.003, dec);
      const out = pan(o.connect(g), -0.25); out.connect(master); send(g, 0.8);
      o.start(t); o.stop(t + dec + 0.1);
    }
  }

  // 和声进行：Fmaj9 → Em7 → Dm9 → Cmaj9（每小节一个），循环
  const PROG = [
    { notes: [53, 57, 60, 64, 67], root: 41 },
    { notes: [52, 55, 59, 62], root: 40 },
    { notes: [50, 53, 57, 60, 64], root: 38 },
    { notes: [48, 55, 59, 62, 64], root: 36 },
  ];
  const nBars = Math.ceil(duration / bar);
  for (let b = 0; b < nBars; b++) {
    const t0 = b * bar, ch = PROG[b % 4];
    // 和弦：拍 1 轻扫，拍 3 前的反拍再补一下（lo-fi 的慵懒切分）
    ch.notes.forEach((m, i) => keys(t0 + i * 0.018 + rnd() * 0.01, m, 0.9, bar * 0.55, (i / (ch.notes.length - 1) - 0.5) * 0.5));
    ch.notes.slice(1).forEach((m, i) => keys(t0 + beat * 2.5 + i * 0.015 + rnd() * 0.01, m + 0, 0.55, bar * 0.35, (i / 3 - 0.5) * 0.4));
    bass(t0, ch.root, beat * 1.8); bass(t0 + beat * 2.5, ch.root + (b % 2 ? 7 : 0), beat * 1.2);
    if (t0 >= drumsFrom - 1e-3) {
      const sw = beat * 0.08; // 摇摆
      kick(t0); kick(t0 + beat * 2.5, 0.75);
      rim(t0 + beat, 0.9); rim(t0 + beat * 3, 1);
      for (let k = 0; k < 8; k++) hat(t0 + k * beat / 2 + (k % 2 ? sw : 0) + rnd() * 0.008, k % 2 ? 0.6 : 1);
    }
    // 偶尔一两声小铃，放在小节尾巴上
    if (b % 2 === 1) bell(t0 + beat * 3.5, [72, 76, 74, 79][(b >> 1) % 4], 0.8);
  }

  // 黑胶底噪：低通嘶声 + 零星爆豆
  {
    const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'bandpass'; lp.frequency.value = 2500; lp.Q.value = 0.4;
    const g = ctx.createGain(); g.gain.value = 0.006;
    n.connect(lp).connect(g).connect(master); n.start(0); n.stop(duration);
    for (let tc = 0.1; tc < duration; tc += 0.05 + rnd() * 0.25) {
      const s = noiseSrc(tc, 0.004), hp = ctx.createBiquadFilter(), cg = ctx.createGain();
      hp.type = 'highpass'; hp.frequency.value = 2000 + rnd() * 3000;
      cg.gain.value = 0.02 + rnd() * 0.05;
      pan(s.connect(hp).connect(cg), rnd() * 1.4 - 0.7).connect(master);
    }
  }

  const buf = await ctx.startRendering();

  // ---------- 电平：增益曲线 + 定标 ----------
  const db = x => 10 ** (x / 20);
  const inAny = (ranges, t) => ranges.some(([a, b]) => t >= a && t < b);
  // 目标相对电平（相对于"说话时"）：说话 0，停顿 +3，bright +8；用一阶平滑避免跳变
  const target = new Float32Array(N);
  const speechPad = speech.map(([a, b]) => [a - 0.12, b + 0.2]);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    target[i] = inAny(bright, t) ? db(DUCK_DB - BRIGHT_DB) : inAny(speechPad, t) ? 1 : db(DUCK_DB - GAP_DB);
  }
  const curve = new Float32Array(N);
  { let g = target[0]; const a = 1 - Math.exp(-1 / (SR * 0.12)); for (let i = 0; i < N; i++) { g += (target[i] - g) * a; curve[i] = g; } }
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  const fadeIn = SR * 0.6, fadeOut = SR * 1.8;
  for (let i = 0; i < N; i++) {
    const f = Math.min(1, i / fadeIn, (N - i) / fadeOut);
    L[i] *= curve[i] * f; R[i] *= curve[i] * f;
  }
  // 定标：说话区间（不含 bright）的 RMS → speechDb − DUCK_DB
  let acc = 0, cnt = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    if (inAny(speech, t) && !inAny(bright, t)) { acc += L[i] * L[i] + R[i] * R[i]; cnt += 2; }
  }
  const rms = Math.sqrt(acc / Math.max(1, cnt)) || 1e-9;
  const k = db(speechDb - DUCK_DB) / rms;
  for (let i = 0; i < N; i++) { L[i] *= k; R[i] *= k; }

  // ---------- 交互音效（定标之后单独叠加，峰值约 sfxDb） ----------
  if (sfx.length) {
    const sctx = new OfflineAudioContext(2, N, SR);
    const srnd = mulberry32(seed + 1);
    const nb = sctx.createBuffer(1, SR, SR); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = srnd() * 2 - 1; }
    const out = sctx.createGain(); out.gain.value = db(sfxDb); out.connect(sctx.destination);
    const blip = (t, f0, f1, dur, v, type = 'sine') => {
      const o = sctx.createOscillator(), g = sctx.createGain(); o.type = type;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.05);
    };
    const tick = (t, f, dur, v) => {
      const s = sctx.createBufferSource(); s.buffer = nb; const bp = sctx.createBiquadFilter(), g = sctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.4;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(bp).connect(g).connect(out); s.start(t, srnd() * 0.5, dur + 0.02);
    };
    const S = {
      click: t => { tick(t, 3800, 0.012, 0.9); blip(t, 1500, 800, 0.03, 0.4); },
      pop: t => blip(t, 600, 1200, 0.08, 0.6),
      snip: t => { tick(t, 5200, 0.02, 0.8); tick(t + 0.06, 4200, 0.03, 0.6); },
      boing: t => { blip(t, 220, 520, 0.18, 0.7, 'triangle'); blip(t + 0.16, 520, 300, 0.2, 0.4, 'triangle'); },
      ding: t => { blip(t, 1568, 1560, 0.5, 0.35); blip(t, 3136, 3130, 0.2, 0.08); },
      whoosh: t => {
        const s = sctx.createBufferSource(); s.buffer = nb; const bp = sctx.createBiquadFilter(), g = sctx.createGain();
        bp.type = 'bandpass'; bp.Q.value = 1; bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(3000, t + 0.35);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.15); g.gain.linearRampToValueAtTime(0, t + 0.4);
        s.connect(bp).connect(g).connect(out); s.start(t, 0, 0.45);
      },
    };
    for (const e of sfx) if (e.t < duration - 0.1) S[e.kind]?.(e.t);
    const sb = await sctx.startRendering();
    const SL = sb.getChannelData(0), SRc = sb.getChannelData(1);
    for (let i = 0; i < N; i++) { L[i] += SL[i]; R[i] += SRc[i]; }
  }
  return buf;
}

export function encodeWav(buf) {
  const ch = buf.numberOfChannels, n = buf.length;
  const out = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); out.setUint32(4, 36 + n * ch * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, ch, true);
  out.setUint32(24, buf.sampleRate, true); out.setUint32(28, buf.sampleRate * ch * 2, true);
  out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true);
  str(36, 'data'); out.setUint32(40, n * ch * 2, true);
  const data = Array.from({ length: ch }, (_, c) => buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
    const x = Math.max(-1, Math.min(1, data[c][i]));
    out.setInt16(o, Math.round(x * 32767), true); o += 2;
  }
  return out.buffer;
}
