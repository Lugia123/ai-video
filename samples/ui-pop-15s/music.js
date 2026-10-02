// 原创配乐：明快合成器流行，C 大调，110 → 130 BPM 逐拍加速（速度曲线见 timeline.js 的 B()）。
// 全部用 OfflineAudioContext 合成，噪声和人手抖动来自种子 PRNG，同一浏览器里每次输出同样的采样。
//
// 编排（小节线在第 2/6/10/14/18/22/26 拍）：
//   0–2   前奏：只有铺底淡入、光标 hover 的一声轻响
//   2–6   Cmaj7  点击一下，底鼓进来（半拍密度）          6–10  G6    四拍底鼓 + 拍手 + 八分贝斯
//   10–14 Am7    琶音、反拍踩镲                          14–18 Fmaj7 全编制
//   18–22 Dm7→G7 积累：军鼓滚奏 8 分→16 分、噪声上扬      22–26 F→G   爆发：主旋律钩子 + 开镲
//   26    C      终止重拍，余响到 15s
// 交互音效（点击、按键、发送、通知……）来自 timeline.js 的 SFX 表，和画面同一份拍号。

import { B, SFX, DURATION } from './timeline.js';

export const SR = 44100;
const mtof = m => 440 * 2 ** ((m - 69) / 12);

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// [起拍, 止拍, 铺底音, 贝斯根音]
const CHORDS = [
  [0, 2, [55, 60, 64, 67], 36],
  [2, 6, [59, 60, 64, 67], 36],        // Cmaj7
  [6, 10, [59, 62, 64, 67], 43],       // G6
  [10, 14, [57, 60, 64, 67], 45],      // Am7
  [14, 18, [57, 60, 64, 65], 41],      // Fmaj7
  [18, 20, [57, 60, 62, 65], 38],      // Dm7
  [20, 22, [59, 62, 65, 67], 43],      // G7
  [22, 24, [57, 60, 65, 69], 41],      // F
  [24, 26, [59, 62, 67, 71], 43],      // G
];
const chordAt = b => CHORDS.find(c => b >= c[0] && b < c[1]) ?? CHORDS[CHORDS.length - 1];

// 爆发段主旋律（八分音符，从第 22 拍起）
const HOOK = [69, 72, 69, 67, 65, 67, 69, 72, 71, 74, 71, 67, 74, 71, 79, 74];

export async function renderMusic() {
  const ctx = new OfflineAudioContext(2, Math.round(SR * DURATION), SR);
  const rnd = mulberry32(20260928);

  const noise = ctx.createBuffer(1, SR * 2, SR);
  { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1; }

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 3;
  comp.attack.value = 0.005; comp.release.value = 0.1;
  comp.connect(ctx.destination);
  const master = ctx.createGain(); master.gain.value = 0.85; master.connect(comp);
  const sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(comp);

  // 侧链"抽吸"：铺底和琶音走这条母线，每个底鼓处压一下
  const pump = ctx.createGain(); pump.gain.value = 1; pump.connect(master);

  const plate = ctx.createConvolver();
  {
    const len = Math.round(SR * 1.8), ir = ctx.createBuffer(2, len, SR);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * Math.exp(-i / (SR * 0.4));
    }
    plate.buffer = ir;
  }
  const plateOut = ctx.createGain(); plateOut.gain.value = 0.18;
  const plateLP = ctx.createBiquadFilter(); plateLP.type = 'lowpass'; plateLP.frequency.value = 6000;
  plate.connect(plateLP).connect(plateOut).connect(master);

  // 乒乓延迟给琶音和提示音
  const dl = ctx.createDelay(1), dr = ctx.createDelay(1), fb = ctx.createGain(), dOut = ctx.createGain();
  dl.delayTime.value = 0.21; dr.delayTime.value = 0.21; fb.gain.value = 0.32; dOut.gain.value = 0.35;
  const merger = ctx.createChannelMerger(2);
  dl.connect(dr); dr.connect(fb).connect(dl);
  dl.connect(merger, 0, 0); dr.connect(merger, 0, 1);
  merger.connect(dOut).connect(master);

  const noiseSrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.start(t, rnd() * 1.5, dur); return s; };
  const env = (g, t, peak, a, d) => {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  };
  const pan = (node, p) => { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };
  const send = (node, dest, amt) => { const g = ctx.createGain(); g.gain.value = amt; node.connect(g).connect(dest); };

  // ---------- 鼓 ----------
  function kick(t, v = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.1);
    env(g, t, 0.9 * v, 0.002, 0.32);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + 0.4);
    const n = noiseSrc(t, 0.02), hp = ctx.createBiquadFilter(), ng = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 3000;
    env(ng, t, 0.2 * v, 0.001, 0.01);
    n.connect(hp).connect(ng).connect(master);
    pump.gain.setValueAtTime(0.35, t);
    pump.gain.setTargetAtTime(1, t + 0.02, 0.07);
  }
  function clap(t, v = 1) {
    const bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.8;
    g.gain.setValueAtTime(0, t);
    for (const [dt, a] of [[0, 1], [0.011, 0.8], [0.022, 1]]) {
      g.gain.setValueAtTime(0.5 * v * a, t + dt);
      g.gain.exponentialRampToValueAtTime(0.02, t + dt + 0.009);
    }
    g.gain.setValueAtTime(0.4 * v, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    noiseSrc(t, 0.25).connect(bp).connect(g).connect(master);
    send(g, plate, 0.7);
  }
  function snare(t, v = 1) {
    const n = noiseSrc(t, 0.15), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.7;
    env(g, t, 0.4 * v, 0.001, 0.09);
    n.connect(bp).connect(g).connect(master);
    send(g, plate, 0.3);
  }
  function hat(t, v, open) {
    const n = noiseSrc(t, open ? 0.35 : 0.06), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 7500;
    env(g, t, 0.18 * v, 0.001, open ? 0.22 : 0.03);
    pan(n.connect(hp).connect(g), 0.25).connect(master);
  }
  function crash(t, v = 1) {
    const n = noiseSrc(t, 1.9), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 4500;
    env(g, t, 0.22 * v, 0.002, 1.7);
    n.connect(hp).connect(g).connect(master);
    send(g, plate, 0.4);
  }
  function riser(t0, t1) {
    const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true;
    const bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.Q.value = 2.5;
    bp.frequency.setValueAtTime(400, t0);
    bp.frequency.exponentialRampToValueAtTime(7000, t1);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.22, t1 - 0.02);
    g.gain.linearRampToValueAtTime(0, t1);
    pan(n.connect(bp).connect(g), 0).connect(master);
    n.start(t0); n.stop(t1 + 0.05);
  }

  // ---------- 音高乐器 ----------
  function bass(t, dur, m, v = 1) {
    const saw = ctx.createOscillator(), sub = ctx.createOscillator();
    saw.type = 'sawtooth'; sub.type = 'sine';
    saw.frequency.value = mtof(m); sub.frequency.value = mtof(m);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 4;
    lp.frequency.setValueAtTime(1400, t);
    lp.frequency.setTargetAtTime(380, t + 0.01, 0.06);
    const sg = ctx.createGain(); sg.gain.value = 0.22;
    const bg = ctx.createGain(); bg.gain.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.6 * v, t + 0.006);
    g.gain.setValueAtTime(0.5 * v, t + Math.max(0.02, dur - 0.03));
    g.gain.setTargetAtTime(0, t + Math.max(0.02, dur - 0.03), 0.015);
    saw.connect(sg).connect(lp); sub.connect(bg).connect(g);
    lp.connect(g).connect(master);
    saw.start(t); sub.start(t); saw.stop(t + dur + 0.15); sub.stop(t + dur + 0.15);
  }
  function pad(t0, t1, notes, level = 1, attack = 0.08) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1700; lp.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(level, t0 + attack);
    g.gain.setValueAtTime(level, t1);
    g.gain.setTargetAtTime(0, t1, 0.05);
    lp.connect(g).connect(pump);
    send(g, plate, 0.4);
    for (const m of notes) for (const [cents, side] of [[-9, -0.55], [9, 0.55]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = cents;
      og.gain.value = 0.017;
      pan(o.connect(og), side).connect(lp);
      o.start(t0); o.stop(t1 + 0.4);
    }
  }
  function pluck(t, m, v = 1, p = 0) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'square'; o2.type = 'sawtooth';
    o.frequency.value = mtof(m); o2.frequency.value = mtof(m); o2.detune.value = 7;
    lp.type = 'lowpass'; lp.Q.value = 3;
    lp.frequency.setValueAtTime(3800, t);
    lp.frequency.exponentialRampToValueAtTime(600, t + 0.12);
    env(g, t, 0.07 * v, 0.002, 0.14);
    o.connect(lp); o2.connect(lp);
    pan(lp.connect(g), p).connect(pump);
    send(g, dl, 0.5);
    o.start(t); o2.start(t); o.stop(t + 0.2); o2.stop(t + 0.2);
  }
  function lead(t, dur, m, v = 1) {
    const lp = ctx.createBiquadFilter(), g = ctx.createGain();
    lp.type = 'lowpass'; lp.Q.value = 2;
    lp.frequency.setValueAtTime(1200, t);
    lp.frequency.linearRampToValueAtTime(4200, t + 0.03);
    lp.frequency.setTargetAtTime(2200, t + 0.03, 0.08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09 * v, t + 0.008);
    g.gain.setValueAtTime(0.07 * v, t + dur * 0.8);
    g.gain.setTargetAtTime(0, t + dur * 0.8, 0.03);
    lp.connect(g).connect(master);
    send(g, plate, 0.35); send(g, dl, 0.25);
    for (const [type, cents] of [['sawtooth', -8], ['square', 6], ['sawtooth', 0]]) {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.value = mtof(m); o.detune.value = cents;
      o.connect(lp); o.start(t); o.stop(t + dur + 0.2);
    }
  }
  function stab(t, notes, dur, v = 1) {
    const lp = ctx.createBiquadFilter(), g = ctx.createGain();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(5000, t); lp.frequency.setTargetAtTime(900, t + 0.05, 0.6);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.006);
    g.gain.setTargetAtTime(0, t + 0.08, dur / 4);
    lp.connect(g).connect(master);
    send(g, plate, 0.6);
    notes.forEach((m, i) => {
      for (const cents of [-12, 0, 11]) {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = cents;
        og.gain.value = 0.03;
        pan(o.connect(og), (i / (notes.length - 1) - 0.5) * 0.7).connect(lp);
        o.start(t); o.stop(t + dur);
      }
    });
  }

  // ---------- 交互音效 ----------
  function blip(t, f0, f1, dur, v, p = 0.15, type = 'sine') {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, v, 0.001, dur);
    pan(o.connect(g), p).connect(sfxBus);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function tickNoise(t, f, dur, v, p = 0.1) {
    const n = noiseSrc(t, dur + 0.02), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.5;
    env(g, t, v, 0.0005, dur);
    pan(n.connect(bp).connect(g), p).connect(sfxBus);
  }
  function ding(t, m, v = 1) {
    for (const [ratio, amp, dec] of [[1, 0.16, 0.4], [2.76, 0.05, 0.15], [5.4, 0.02, 0.06]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = mtof(m) * ratio;
      env(g, t, amp * v, 0.002, dec);
      pan(o.connect(g), 0.3).connect(sfxBus);
      send(g, dl, 0.35);
      o.start(t); o.stop(t + dec + 0.05);
    }
  }
  const SOUNDS = {
    hover: e => blip(e.t, 2600, 2200, 0.02, 0.05),
    click: e => { tickNoise(e.t, 4200, 0.008, 0.5 * (e.v ?? 1)); blip(e.t, 1700, 900, 0.025, 0.22 * (e.v ?? 1)); },
    key: e => tickNoise(e.t, 2600 + 1800 * rnd(), 0.006, 0.28, -0.15 + 0.3 * rnd()),
    send: e => blip(e.t, 480, 1500, 0.09, 0.16),
    pop: e => e.soft ? blip(e.t, 900, 1300, 0.05, 0.08) : blip(e.t, e.up ? 800 : 620, e.up ? 1400 : 1100, 0.07, 0.2),
    tick: e => blip(e.t, 2200 + 2400 * e.p, 2000 + 2400 * e.p, 0.012, 0.05, 0.3),
    tab: e => { tickNoise(e.t, 1800, 0.012, 0.45); blip(e.t, [523, 659, 784][e.i] * 2, [523, 659, 784][e.i] * 2, 0.06, 0.1, 0, 'triangle'); },
    ratchet: e => tickNoise(e.t, 1500 + 3000 * Math.min(1, e.p), 0.005, 0.22),
    toggle: e => { blip(e.t, 1300, 1100, 0.015, 0.2); blip(e.t + 0.035, 1900, 1700, 0.015, 0.16); },
    whoosh: e => {
      const n = noiseSrc(e.t, 0.2), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(700, e.t); bp.frequency.exponentialRampToValueAtTime(3500, e.t + 0.15);
      g.gain.setValueAtTime(0, e.t); g.gain.linearRampToValueAtTime(0.2, e.t + 0.07); g.gain.linearRampToValueAtTime(0, e.t + 0.17);
      n.connect(bp).connect(g).connect(sfxBus);
    },
    enter: e => { tickNoise(e.t, 2200, 0.01, 0.45); blip(e.t, 800, 420, 0.05, 0.22); },
    snap: e => { blip(e.t, e.big ? 160 : 220, 55, e.big ? 0.18 : 0.12, e.big ? 0.5 : 0.35, 0); tickNoise(e.t, 3000, 0.01, 0.4); },
    ding: e => ding(e.t, e.m, e.v ?? 1),
  };

  // ---------- 排谱 ----------
  const at = B;
  // 铺底
  pad(at(0), at(2), CHORDS[0][2], 0.55, 0.9);
  for (const [b0, b1, notes] of CHORDS.slice(1)) pad(at(b0), at(b1), notes);
  const FINAL = [48, 55, 60, 64, 67, 72, 76];
  pad(at(26), DURATION - 0.15, [60, 64, 67, 71], 0.9, 0.02);
  stab(at(26), FINAL, DURATION - at(26), 1);

  // 贝斯
  for (const [b0, b1, , root] of CHORDS.slice(1)) {
    const step = b0 < 6 ? 1 : 0.5;
    for (let b = b0; b < b1 - 1e-6; b += step) {
      const oct = b0 >= 10 && Math.round((b - b0) / 0.5) % 2 === 1 ? 12 : 0;
      bass(at(b), (at(b + step) - at(b)) * 0.85, root + oct);
    }
  }
  bass(at(26), 1.6, 36, 1.1);

  // 鼓
  for (let b = 2; b < 26; b++) {
    if (b < 6 && b % 2 === 1) continue;
    kick(at(b), b === 22 ? 1.15 : 1);
    const inBar = (b - 2) % 4;
    if (b >= 6 && (inBar === 1 || inBar === 3) && !(b >= 20 && b < 22)) clap(at(b));
    if (b >= 10) hat(at(b + 0.5), 0.9, b >= 22);
    if (b >= 18 && b < 22 || b >= 22) { hat(at(b + 0.25), 0.4); hat(at(b + 0.75), 0.4); }
  }
  kick(at(26), 1.2);
  crash(at(10), 0.6); crash(at(22), 1.1); crash(at(26), 1.2);
  // 积累段：军鼓滚奏 8 分 → 16 分，越来越响
  for (let b = 20; b < 22 - 1e-6; b += b < 21 ? 0.5 : 0.25) snare(at(b), 0.5 + 0.6 * (b - 20) / 2);
  riser(at(18.5), at(22));

  // 琶音：16 分，和弦音上行下行
  const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
  for (let b = 10, i = 0; b < 26 - 1e-6; b += 0.25, i++) {
    const notes = chordAt(b)[2];
    const m = notes[ARP[i % ARP.length]] + 12;
    pluck(at(b), m, i % 4 === 0 ? 1.2 : 0.85, (i % 2 ? 0.35 : -0.35));
  }
  // 主旋律钩子
  HOOK.forEach((m, i) => { const b = 22 + i * 0.5; lead(at(b), at(b + 0.45) - at(b), m); });

  // 交互音效
  for (const e of SFX) SOUNDS[e.kind]?.(e);

  const buf = await ctx.startRendering();

  // 归一到 -1.5 dBFS 峰值，末尾 120ms 淡出
  let peak = 0;
  for (let c = 0; c < 2; c++) for (const x of buf.getChannelData(c)) peak = Math.max(peak, Math.abs(x));
  const k = peak > 0 ? 10 ** (-1.5 / 20) / peak : 1;
  const fade = Math.round(SR * 0.12);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < d.length; i++) {
      const r = d.length - i;
      d[i] *= k * (r < fade ? r / fade : 1);
    }
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
