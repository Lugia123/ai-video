// 原创配乐：100 BPM 艺术摇滚 / 放克，1986 年的声音调色板。
// 全部用 OfflineAudioContext 合成，噪声来自种子 PRNG，同一浏览器里每次输出同样的采样。
//
// 编排（1 小节 = 2.4s，16 分音符 = 0.15s）：
//   bar0 Am7   开场齐奏 + 通知提示音        bar1 Am7   全编制律动
//   bar2 F → G 贝斯走低音线                 bar3 Am7   抽空：只剩底鼓 / 门限军鼓 / 无品贝斯滑音
//   bar4 Dm9   回到全编制                   bar5 E7#9  铜管半音爬升 + 通鼓加花
//   bar6 A7#9  (14.4s) 终止重拍，余响到 15s
//
// 画面从这里 import 同一份事件表（stabs / kicks / dings …），保证镜头节拍和声音对齐。

export const BPM = 100;
export const BEAT = 60 / BPM;          // 0.6
export const BAR = BEAT * 4;           // 2.4
export const S16 = BEAT / 4;           // 0.15
export const DURATION = 15;
export const SR = 44100;
export const FINAL_HIT = 6 * BAR;      // 14.4

const at = (bar, pos) => bar * BAR + pos * S16;
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

// ---------- 和声 ----------
// 每小节的和弦；[pos16 起, 名字]
const CHORD_BY_BAR = [
  [[0, 'Am7']], [[0, 'Am7']], [[0, 'F'], [8, 'G']], [[0, 'Am7']],
  [[0, 'Dm9']], [[0, 'E7#9']], [[0, 'A7#9']],
];
const PAD = {            // 合成器铺底的排列
  'Am7': [57, 60, 64, 67], 'F': [53, 57, 60, 64], 'G': [55, 59, 62, 67],
  'Dm9': [50, 57, 60, 64], 'E7#9': [52, 56, 62, 67], 'A7#9': [57, 61, 67, 72],
};
const HORN = {           // 铜管齐奏的排列（小号 / 萨克斯的紧凑三度叠置）
  'Am7': [57, 64, 67, 72], 'F': [57, 60, 65, 69], 'G': [59, 62, 67, 71],
  'Dm9': [60, 64, 65, 69], 'E7#9': [56, 62, 67, 71], 'A7#9': [45, 57, 61, 67, 72],
};
const chordAt = (bar, pos) => {
  let name = CHORD_BY_BAR[bar][0][1];
  for (const [p, n] of CHORD_BY_BAR[bar]) if (pos >= p) name = n;
  return name;
};

// ---------- 无品贝斯：[pos16, midi, len16, 滑音起点(可选)] ----------
const BASS_AM = [[0, 33, 3], [3, 45, 1], [4, 43, 2], [6, 40, 2], [8, 33, 2], [10, 36, 1], [11, 38, 2], [14, 40, 2]];
const BASS = [
  BASS_AM,
  BASS_AM,
  [[0, 29, 3], [3, 41, 1], [4, 36, 2], [6, 29, 2], [8, 31, 3], [11, 43, 1], [12, 38, 2], [14, 31, 2]],
  [[0, 33, 6, 31], [8, 45, 2, 43], [12, 43, 4, 45]],
  [[0, 38, 3], [3, 50, 1], [4, 48, 2], [6, 45, 2], [8, 38, 2], [10, 41, 1], [11, 43, 2], [14, 45, 2]],
  [[0, 40, 3], [3, 52, 1], [4, 50, 2], [6, 47, 2], [8, 40, 2], [10, 43, 1], [11, 44, 2], [14, 40, 1], [15, 39, 1]],
  [[0, 33, 4, 32]],
];

// ---------- 铜管短促齐奏：[pos16, len16] ----------
const HORNS = [
  [[0, 3], [10, 1], [11, 3]],
  [[3, 1], [6, 2], [10, 1], [14, 1], [15, 1]],
  [[0, 2], [6, 1], [8, 2], [14, 2]],
  [[6, 1], [7, 1], [14, 2]],
  [[3, 1], [6, 2], [10, 1], [11, 1], [12, 3]],
  [[0, 1], [2, 1], [4, 1], [6, 1], [8, 2], [11, 1], [12, 1], [13, 1], [14, 1], [15, 1]],
  [[0, 4]],
];

// ---------- 鼓 ----------
const DRUMS = [
  { kick: [0, 6, 10], snare: [4, 12], hats: 16, open: [], crash: [0] },
  { kick: [0, 6, 10], snare: [4, 12], hats: 16, open: [14] },
  { kick: [0, 6, 10, 14], snare: [4, 12], hats: 16, open: [] },
  { kick: [0, 10], snare: [12], hats: 8, open: [] },
  { kick: [0, 6, 10], snare: [4, 12], hats: 16, open: [14], crash: [0] },
  { kick: [0, 6, 10], snare: [4], hats: 16, open: [], toms: [[8, 190], [10, 160], [12, 130], [13, 112], [14, 95], [15, 80]] },
  { kick: [0], snare: [0], hats: 0, open: [], crash: [0] },
];

// 通知提示音（第一个镜头的气泡、聊天镜头的新消息）：[bar, pos16, midi]
const DINGS = [[0, 2, 88], [0, 5, 91], [0, 9, 93], [0, 13, 96], [4, 0, 84], [4, 10, 88]];

// ---------- 导出给画面的事件表（秒） ----------
export const events = (() => {
  const e = { stabs: [], kicks: [], snares: [], toms: [], dings: [], bass: [] };
  HORNS.forEach((list, bar) => list.forEach(([p, l]) => e.stabs.push({ t: at(bar, p), len: l * S16 })));
  DRUMS.forEach((d, bar) => {
    d.kick.forEach(p => e.kicks.push(at(bar, p)));
    d.snare.forEach(p => e.snares.push(at(bar, p)));
    (d.toms || []).forEach(([p]) => e.toms.push(at(bar, p)));
  });
  DINGS.forEach(([bar, p]) => e.dings.push(at(bar, p)));
  BASS.forEach((list, bar) => list.forEach(([p]) => e.bass.push(at(bar, p))));
  for (const k in e) if (Array.isArray(e[k])) e[k].sort((a, b) => (a.t ?? a) - (b.t ?? b));
  return e;
})();

// ---------- 合成 ----------
export async function renderMusic() {
  const ctx = new OfflineAudioContext(2, Math.round(SR * DURATION), SR);
  const rnd = mulberry32(19860519);

  // 白噪声：2 秒，每次取不同起点（起点也来自 PRNG）
  const noise = ctx.createBuffer(1, SR * 2, SR);
  { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1; }

  // 母线：压缩 → 输出
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 3;
  comp.attack.value = 0.006; comp.release.value = 0.12;
  comp.connect(ctx.destination);
  const master = ctx.createGain(); master.gain.value = 0.9; master.connect(comp);

  // 门限混响：一段满幅噪声响应，320ms 后硬切——80 年代鼓声的那种"炸开又突然消失"
  const gate = ctx.createConvolver();
  {
    const len = Math.round(SR * 0.34), ir = ctx.createBuffer(2, len, SR);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const x = i / len;
        const env = (1 - 0.35 * x) * (x > 0.96 ? (1 - x) / 0.04 : 1);
        d[i] = (rnd() * 2 - 1) * env;
      }
    }
    gate.buffer = ir;
  }
  const gateOut = ctx.createGain(); gateOut.gain.value = 0.55;
  gate.connect(gateOut).connect(master);

  // 板式混响：给铜管和铺底一点空间
  const plate = ctx.createConvolver();
  {
    const len = Math.round(SR * 1.6), ir = ctx.createBuffer(2, len, SR);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * Math.exp(-i / (SR * 0.35));
    }
    plate.buffer = ir;
  }
  const plateOut = ctx.createGain(); plateOut.gain.value = 0.22;
  const plateLP = ctx.createBiquadFilter(); plateLP.type = 'lowpass'; plateLP.frequency.value = 5000;
  plate.connect(plateLP).connect(plateOut).connect(master);

  const noiseSrc = (t, dur) => {
    const s = ctx.createBufferSource(); s.buffer = noise;
    s.start(t, rnd() * 1.5, dur);
    return s;
  };
  const env = (g, t, peak, attack, decay) => {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  };
  const pan = (node, p) => { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };

  function kick(t, v = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(155, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.12);
    env(g, t, 0.95 * v, 0.002, 0.36);
    o.connect(g).connect(master);
    const send = ctx.createGain(); send.gain.value = 0.15; g.connect(send).connect(gate);
    o.start(t); o.stop(t + 0.45);
    const n = noiseSrc(t, 0.02), hp = ctx.createBiquadFilter(), ng = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 2500;
    env(ng, t, 0.25 * v, 0.001, 0.012);
    n.connect(hp).connect(ng).connect(master);
  }
  function snare(t, v = 1) {
    const n = noiseSrc(t, 0.3), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.6;
    env(g, t, 0.55 * v, 0.001, 0.17);
    n.connect(bp).connect(g).connect(master);
    const send = ctx.createGain(); send.gain.value = 0.9; g.connect(send).connect(gate);
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(170, t + 0.08);
    env(og, t, 0.45 * v, 0.001, 0.09);
    o.connect(og).connect(master); og.connect(send);
    o.start(t); o.stop(t + 0.2);
  }
  function hat(t, v, open) {
    const n = noiseSrc(t, open ? 0.4 : 0.08), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 7200;
    env(g, t, 0.22 * v, 0.001, open ? 0.26 : 0.035);
    pan(n.connect(hp).connect(g), 0.28).connect(master);
  }
  function tom(t, f) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
    env(g, t, 0.6, 0.002, 0.32);
    pan(o.connect(g), (f - 130) / 160).connect(master);
    const send = ctx.createGain(); send.gain.value = 1.1; g.connect(send).connect(gate);
    o.start(t); o.stop(t + 0.4);
  }
  function crash(t, v = 1) {
    const n = noiseSrc(t, 1.6), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 4200;
    env(g, t, 0.28 * v, 0.002, 1.4);
    n.connect(hp).connect(g).connect(master);
    const send = ctx.createGain(); send.gain.value = 0.5; g.connect(send).connect(plate);
  }

  // 无品贝斯："mwah"——音头从下方滑进来，低通滤波器延迟张开再合上
  function bass(t, dur, m, from) {
    const saw = ctx.createOscillator(), sub = ctx.createOscillator();
    saw.type = 'sawtooth';
    const f0 = mtof(from ?? m - 0.5), f1 = mtof(m);
    for (const o of [saw, sub]) {
      o.frequency.setValueAtTime(f0, t);
      if (from != null) o.frequency.linearRampToValueAtTime(f1, t + dur * 0.55);
      else o.frequency.setTargetAtTime(f1, t, 0.025);
    }
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 6;
    lp.frequency.setValueAtTime(260, t);
    lp.frequency.linearRampToValueAtTime(1150, t + 0.07);
    lp.frequency.setTargetAtTime(420, t + 0.07, 0.12);
    const sg = ctx.createGain(); sg.gain.value = 0.3;
    const bg = ctx.createGain(); bg.gain.value = 0.55;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.012);
    g.gain.setValueAtTime(0.5, t + Math.max(0.02, dur - 0.03));
    g.gain.setTargetAtTime(0, t + Math.max(0.02, dur - 0.03), 0.025);
    saw.connect(sg).connect(lp); sub.connect(bg).connect(lp);
    lp.connect(g).connect(master);
    saw.start(t); sub.start(t); saw.stop(t + dur + 0.2); sub.stop(t + dur + 0.2);
  }

  // 铜管齐奏：每个音 3 支锯齿波微失谐 + 音头下滑修正（吹奏的"挤"进音），滤波器快速张开
  function horns(t, dur, notes, transpose = 0, v = 1) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(700, t);
    lp.frequency.linearRampToValueAtTime(5200, t + 0.025);
    lp.frequency.setTargetAtTime(2100, t + 0.025, 0.08);
    const g = ctx.createGain();
    const off = t + Math.max(0.05, dur - 0.035);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.012);
    g.gain.setValueAtTime(v * 0.8, off);
    g.gain.setTargetAtTime(0, off, 0.03);
    lp.connect(g).connect(master);
    const send = ctx.createGain(); send.gain.value = 0.6; g.connect(send).connect(plate);
    notes.forEach((m, i) => {
      const p = ctx.createStereoPanner(); p.pan.value = ((i / Math.max(1, notes.length - 1)) - 0.5) * 0.6;
      p.connect(lp);
      for (const cents of [-9, 0, 8]) {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = mtof(m + transpose);
        o.detune.setValueAtTime(cents - 45, t);
        o.detune.setTargetAtTime(cents, t, 0.016);
        og.gain.value = 0.045;
        o.connect(og).connect(p);
        o.start(t); o.stop(off + 0.25);
      }
    });
  }

  // 合成器铺底：双锯齿、左右分开、慢起慢收
  function pad(t0, t1, notes) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1300; lp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.3);
    g.gain.setValueAtTime(1, t1);
    g.gain.setTargetAtTime(0, t1, 0.12);
    lp.connect(g).connect(master);
    const send = ctx.createGain(); send.gain.value = 0.5; g.connect(send).connect(plate);
    for (const m of notes) for (const [cents, side] of [[-11, -0.6], [11, 0.6]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = cents;
      og.gain.value = 0.016;
      pan(o.connect(og), side).connect(lp);
      o.start(t0); o.stop(t1 + 0.6);
    }
  }

  // 通知提示音：钟形（基频 + 2.76 倍泛音）
  function ding(t, m) {
    for (const [ratio, amp, dec] of [[1, 0.2, 0.45], [2.76, 0.08, 0.18]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = mtof(m) * ratio;
      env(g, t, amp, 0.002, dec);
      pan(o.connect(g), 0.35).connect(master);
      const send = ctx.createGain(); send.gain.value = 0.4; g.connect(send).connect(plate);
      o.start(t); o.stop(t + dec + 0.05);
    }
  }

  // ---------- 排谱 ----------
  CHORD_BY_BAR.forEach((changes, bar) => {
    if (bar === 6) return;
    changes.forEach(([p, name], i) => {
      const end = i + 1 < changes.length ? at(bar, changes[i + 1][0]) : at(bar + 1, 0);
      pad(at(bar, p), end, PAD[name]);
    });
  });
  pad(FINAL_HIT, DURATION - 0.2, PAD['A7#9']);

  BASS.forEach((list, bar) => list.forEach(([p, m, l, from]) => bass(at(bar, p), l * S16, m, from)));

  HORNS.forEach((list, bar) => list.forEach(([p, l]) => {
    const tr = bar === 5 && p >= 12 ? p - 11 : 0;
    const v = bar === 3 ? 0.8 : 1;
    horns(at(bar, p), l * S16, HORN[chordAt(bar, p)], tr, v);
  }));

  DRUMS.forEach((d, bar) => {
    d.kick.forEach(p => kick(at(bar, p), bar === 6 ? 1.1 : 1));
    d.snare.forEach(p => snare(at(bar, p), bar === 3 ? 1.15 : 1));
    for (let i = 0; i < 16; i += 16 / (d.hats || 16)) {
      if (!d.hats) break;
      const open = d.open.includes(i);
      hat(at(bar, i), (i % 4 === 0 ? 0.7 : i % 2 === 0 ? 0.45 : 0.28) * (bar === 3 ? 0.6 : 1), open);
    }
    (d.toms || []).forEach(([p, f]) => tom(at(bar, p), f));
    (d.crash || []).forEach(p => crash(at(bar, p), bar === 6 ? 1.2 : 0.8));
  });

  DINGS.forEach(([bar, p, m]) => ding(at(bar, p), m));

  const buf = await ctx.startRendering();

  // 归一到 -1.5 dBFS 峰值，末尾 80ms 淡出防爆音
  let peak = 0;
  for (let c = 0; c < 2; c++) for (const x of buf.getChannelData(c)) peak = Math.max(peak, Math.abs(x));
  const k = peak > 0 ? 10 ** (-1.5 / 20) / peak : 1;
  const fade = Math.round(SR * 0.08);
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
