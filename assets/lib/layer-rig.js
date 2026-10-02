// 2D 分层角色 rig（Canvas 2D）：头部组转动/点头/晃、呼吸、头发滞后摆动、眨眼、表情、中文口型。
// 画面是 t 的纯函数（符合 CLAUDE.md 的 __video 约定）：随机只用带种子的 PRNG，头发滞后是对 pose(t) 的
// 过去一段时间做加权求和，不存任何帧间状态，所以任意顺序 seek 都得到同一帧。
//
// ---------------------------------------------------------------------------------------------
// 素材约定（见 episodes/cast-cyber-girl/closeup/layers/rig.json）
//   同一画布（如 832×1248）对齐的 RGBA 图层：01-body.png（去发干净底图）、02-head.png、
//   eyes/<state>.png、mouth/<state>.png、04-hair.png；rig.json 给 size / neck_pivot / chin_y / eyes / mouth。
//   叠放顺序 body → head → eyes → mouth → hair。
//
// 用法（页面是 ES module）
//   import { loadRig, lipsync, analyzeVoice, blinks, keys, spans, wobble } from '../../../assets/lib/layer-rig.js';
//
//   const rig = await loadRig('../closeup/layers/');          // 相对页面的图层目录；等图片解码完才返回
//   const TL = await (await fetch('narration/timings.json')).json();
//   const voiced = await analyzeVoice('narration/narration.mp3');  // 可选：实测有声区间，逗号停顿对齐到真停顿
//   const lips = lipsync(TL, { voiced });                    // t → 'a'|'i'|'u'|'e'|'o'|'rest'；不在说话时 null
//   const blink = blinks({ seed: 3, from: 0, to: TL.duration }); // 或 blinks({ at: [1.97, 5.0] }) 指定时刻
//   const roll = keys([[0, 0], [1.2, -2.5], [3, 1.5]]);      // 关键帧，段间 smoothstep 缓动，两端保持
//   const face = spans([[6.9, 9.0, { eyes: 'smile', mouth: 'smile' }]], { eyes: 'open' });
//
//   function render(t) {
//     ...画背景...
//     rig.draw(ctx, t, {
//       x: 1180, y: 40, scale: 0.86,                          // 图层画布左上角放到哪、缩放多少
//       pose: t => ({ roll: roll(t), nod: 0, dx: 0, dy: 0 }), // 必须是函数：头发滞后要回看过去的 pose
//       face, lips, blink,
//       breath: { amp: 3, period: 3.8 },                      // 可选，默认如此；amp=0 关呼吸
//       hair: { lag: 1, sway: 2 },                            // 可选：lag 滞后强度倍数，sway 发梢自摆像素
//     });
//   }
//
// pose 字段（都相对静止原图）
//   roll  头部组绕 neck_pivot 的倾角，度，正值顺时针（向画面右歪）。
//   nod   点头：头部组下移像素，并按比例轻压竖向。可正可负（负 = 抬头）。
//   dx/dy 头部组平移像素（左右晃用 dx）。
//
// 分层结构（每帧从下到上）
//   body（呼吸：绕底边竖向微缩放）→ 底衬（原图衣领线上方一窄条，钉在身体上，补转头时衣领边的细缝）
//   → 头部组（head 去掉衣领 + eyes + mouth；rig.json.neck_line 以上刚性，脖子渐变到跟身体）
//   → 衣领（从头图层按颜色分出来，钉在身体上，压住脖子根）
//   → hair（耳朵以上刚性跟头；往下对过去 1.2s 的头部运动做弹簧脉冲响应卷积 → 滞后 + 小过冲；发梢微摆）
//   rig.json 需要：size、neck_pivot、chin_y、eyes、mouth；可选 neck_line、collar_hue（见 loadRig 注释）。
//
// 安全范围（cast-cyber-girl 近景实测，见 rig-demo）：|roll| ≤ 4°、|dx| ≤ 3px、nod −4…+8px 看不出破绽。
//   roll 到 6°（或 4° 叠加 dx 6px）时脖子一侧会出现两道颈线（底衬里的静止颈线露出 2–4px），不破洞但看得出；
//   10° 以上下巴会压到衣领。转头是平面倾斜，没有真正的侧转（yaw）。
//   头发滞后：发梢比发根晚约 0.13s（4 帧），hair.lag 调软硬（>1 更软更慢）。
//
// face(t) → { eyes, mouth }
//   eyes：'open' | 'closed' | 'half' | 'wink' | 'smile' | 'surprised'，默认 'open'。
//   mouth：不说话时用的嘴型（'rest' | 'smile' | 'surprised' | ...）。说话时（lips(t) 非 null）以口型为准。
//   眨眼只作用在 eyes 为 open / surprised 时；smile / wink / closed 时跳过。
//
// lipsync(timings, { voiced, offset })
//   timings：tools/tts 的 timings.json（有 sentences 就按句，没有就按段）。
//   每个字取拼音韵母 → a/i/u/e/o（表写死在本文件，GB2312 6763 字；表外的字按 e）。
//   b/p/m 声母的字开头先闭嘴一下；相邻两字同口型时字尾闭一下，避免"张着不动"。
//   逗号等句内停顿：给了 voiced 就对齐到句内最长的几个静音；否则按字数比例估算。句间、段间自动 rest。
//   英文字母串按元音组拆成音节；数字每位一个 'e'。
//
// analyzeVoice(url, { threshold, minGap, minLen })
//   在页面里解码音频（WebAudio，离线、确定性），返回 [[start, end], ...] 有声区间。
//   threshold 为相对峰值 RMS 的比例（默认 0.06）。
//
// blinks({ seed, from, to, min, max, at, fps })
//   返回 t → null | 'half' | 'closed'。开始时刻吸附到帧格；一次眨眼 = half, closed, closed, half（4 帧 ≈ 0.13s，
//   加上前后过渡看起来约 0.15s）。at 给定时只用这些时刻，否则按种子在 [min, max] 秒间隔里抽。
//
// draw() 返回 { eyes, mouth, head, hairTip, hairTipRigid, hairRoot }：本帧实际用的眼/嘴、头部仿射、发梢/发根位置，
//   方便自检（比如量头发滞后）。
// 性能：只有真正变形的网格格子拆三角形 clip+drawImage，其余按相同仿射合并成一次绘制。
// ---------------------------------------------------------------------------------------------

const RAD = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => p * p * (3 - 2 * p);
const smoothstep = (a, b, x) => smooth(clamp((x - a) / (b - a)));

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let q = a;
    q = Math.imul(q ^ (q >>> 15), q | 1);
    q ^= q + Math.imul(q ^ (q >>> 7), q | 61);
    return ((q ^ (q >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 动作小工具 ----------

/** 关键帧 [[t, v], ...] → t => v；段间 smoothstep，首尾之外保持端点值。 */
export function keys(pts, ease = smooth) {
  const k = [...pts].sort((a, b) => a[0] - b[0]);
  return t => {
    if (t <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) {
      if (t < k[i][0]) return lerp(k[i - 1][1], k[i][1], ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])));
    }
    return k[k.length - 1][1];
  };
}

/** [[t0, t1, value], ...] → t => 命中的 value（后写的优先），否则 fallback。value 若是对象会与 fallback 合并。 */
export function spans(list, fallback = {}) {
  return t => {
    for (let i = list.length - 1; i >= 0; i--) {
      const [a, b, v] = list[i];
      if (t >= a && t < b) return typeof v === 'object' ? { ...fallback, ...v } : v;
    }
    return fallback;
  };
}

/** 平滑小晃动：几条不同周期的正弦叠加，相位由种子决定。返回 t => [-amp, amp] 内的值。 */
export function wobble(seed, amp, periods = [3.7, 5.3, 8.9]) {
  const r = mulberry32(seed);
  const ph = periods.map(() => r() * Math.PI * 2);
  return t => amp * periods.reduce((s, p, i) => s + Math.sin(2 * Math.PI * t / p + ph[i]), 0) / periods.length;
}

// ---------- 眨眼 ----------

const BLINK = ['half', 'closed', 'closed', 'half'];

export function blinks({ seed = 1, from = 0, to = 600, min = 2.5, max = 5.5, at = null, fps = 30 } = {}) {
  let times = at;
  if (!times) {
    const r = mulberry32(seed);
    times = [];
    for (let t = from + min * 0.4 + r() * (max - min) * 0.5; t < to && times.length < 5000; t += min + r() * (max - min)) times.push(t);
  }
  const starts = times.map(t => Math.round(t * fps)).sort((a, b) => a - b);
  return t => {
    const f = Math.floor(t * fps + 1e-4);
    for (const s of starts) {
      if (f >= s && f < s + BLINK.length) return BLINK[f - s];
      if (s > f) break;
    }
    return null;
  };
}

// ---------- 口型 ----------

const PAUSE = new Set('，、；：,;:—…～~（）()「」『』“”"\'‘’《》'.split(''));
const END = new Set('。！？!?.'.split(''));
let VIS_MAP = null;
function visMap() {
  if (VIS_MAP) return VIS_MAP;
  VIS_MAP = new Map();
  for (const v of ['a', 'o', 'i', 'u']) for (const ch of VIS_TABLE[v]) VIS_MAP.set(ch, v);
  return VIS_MAP;
}
const BPM = () => (BPM.s ||= new Set(VIS_TABLE.bpm));

/** 文本 → [[单元, ...], ...]（按句内停顿切成小句）；单元 {v, bpm, w} */
function tokenize(text) {
  const map = visMap(), clauses = [[]];
  const cut = () => { if (clauses[clauses.length - 1].length) clauses.push([]); };
  const s = text.normalize('NFKC');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (/[A-Za-z]/.test(ch)) {                       // 英文词：按元音组拆音节
      let j = i; while (j < s.length && /[A-Za-z']/.test(s[j])) j++;
      const word = s.slice(i, j).toLowerCase();
      const groups = word.match(/[aeiouy]+/g) || ['e'];
      const lead = word[0];
      groups.forEach((g, k) => {
        const v = { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'i' }[g[0]];
        clauses[clauses.length - 1].push({ v, bpm: k === 0 && 'bpmf'.includes(lead), w: 0.8 });
      });
      i = j - 1;
    } else if (/[0-9]/.test(ch)) {
      clauses[clauses.length - 1].push({ v: 'e', bpm: false, w: 1 });
    } else if (PAUSE.has(ch)) {
      cut();
    } else if (END.has(ch) || /\s/.test(ch)) {
      if (END.has(ch)) cut();
    } else if (/\p{Script=Han}/u.test(ch)) {
      clauses[clauses.length - 1].push({ v: map.get(ch) || 'e', bpm: BPM().has(ch), w: 1 });
    }
  }
  return clauses.filter(c => c.length);
}

function sentencesOf(timings) {
  const out = [];
  for (const seg of timings.segments || []) {
    if (seg.sentences && seg.sentences.length) out.push(...seg.sentences);
    else out.push({ text: seg.text, start: seg.start, end: seg.end });
  }
  return out;
}

/** 有声区间里落在 [a, b] 的部分，合并短缝 */
function voicedIn(voiced, a, b, minGap) {
  const v = voiced.filter(([s, e]) => e > a && s < b).map(([s, e]) => [Math.max(s, a), Math.min(e, b)]);
  const m = [];
  for (const iv of v) {
    if (m.length && iv[0] - m[m.length - 1][1] < minGap) m[m.length - 1][1] = iv[1];
    else m.push([...iv]);
  }
  return m;
}

export function lipsync(timings, { voiced = null, offset = 0, minGap = 0.09 } = {}) {
  const units = [];   // {t0, t1, v, bpm}
  const speaking = [];
  const place = (clause, a, b) => {
    const W = clause.reduce((s, u) => s + u.w, 0);
    let t = a;
    clause.forEach((u, k) => {
      const d = (b - a) * u.w / W;
      units.push({ t0: t, t1: t + d, v: u.v, bpm: u.bpm, same: k + 1 < clause.length && clause[k + 1].v === u.v });
      t += d;
    });
  };
  for (const sen of sentencesOf(timings)) {
    const a = sen.start + offset, b = sen.end + offset;
    speaking.push([a, b]);
    const clauses = tokenize(sen.text);
    if (!clauses.length) continue;
    const iv = voiced ? voicedIn(voiced, a - 0.05, b + 0.05, minGap) : [];
    const k = clauses.length - 1;
    if (iv.length && iv.length - 1 >= k) {
      // 句内静音缝里挑最长的 k 个当逗号停顿
      const gaps = iv.slice(1).map((x, i) => ({ i, len: x[0] - iv[i][1] }));
      const cuts = gaps.sort((p, q) => q.len - p.len).slice(0, k).map(g => g.i).sort((p, q) => p - q);
      let lo = 0;
      clauses.forEach((c, ci) => {
        const hi = ci < k ? cuts[ci] : iv.length - 1;
        place(c, iv[lo][0], iv[hi][1]);
        lo = hi + 1;
      });
    } else {
      // 按字数比例：一个句内停顿按 1.5 个字的时长估
      const P = 1.5, W = clauses.reduce((s, c) => s + c.reduce((x, u) => x + u.w, 0), 0) + P * k;
      let t = a;
      clauses.forEach(c => {
        const d = (b - a) * c.reduce((x, u) => x + u.w, 0) / W;
        place(c, t, t + d);
        t += d + (b - a) * P / W;
      });
    }
  }
  const quiet = voiced ? t => !voiced.some(([s, e]) => t >= s - 0.02 && t < e + 0.02) : () => false;
  const fn = t => {
    if (!speaking.some(([a, b]) => t >= a && t < b)) return null;
    if (quiet(t)) return 'rest';
    const u = units.find(u => t >= u.t0 && t < u.t1);
    if (!u) return 'rest';
    const d = u.t1 - u.t0, p = (t - u.t0) / d;
    if (u.bpm && p < 0.3) return 'rest';
    if (u.same && d > 0.12 && p > 0.78) return 'rest';
    return u.v;
  };
  fn.units = units;
  return fn;
}

/** 在页面里解码音频，返回有声区间 [[s, e], ...]（秒）。 */
export async function analyzeVoice(url, { threshold = 0.06, hop = 0.01, minGap = 0.06, minLen = 0.04 } = {}) {
  const buf = await (await fetch(url)).arrayBuffer();
  const audio = await new OfflineAudioContext(1, 1, 24000).decodeAudioData(buf);
  const x = audio.getChannelData(0), n = Math.max(1, Math.round(hop * audio.sampleRate));
  const rms = [];
  for (let i = 0; i + n <= x.length; i += n) {
    let s = 0; for (let j = i; j < i + n; j++) s += x[j] * x[j];
    rms.push(Math.sqrt(s / n));
  }
  const peak = rms.reduce((m, v) => Math.max(m, v), 0) || 1;
  const out = [];
  let st = -1;
  rms.forEach((v, i) => {
    const on = v > peak * threshold;
    if (on && st < 0) st = i;
    if (!on && st >= 0) { out.push([st * hop, i * hop]); st = -1; }
  });
  if (st >= 0) out.push([st * hop, rms.length * hop]);
  const m = [];
  for (const iv of out) {
    if (m.length && iv[0] - m[m.length - 1][1] < minGap) m[m.length - 1][1] = iv[1];
    else m.push(iv);
  }
  return m.filter(([s, e]) => e - s >= minLen).map(([s, e]) => [+s.toFixed(3), +e.toFixed(3)]);
}

// ---------- 仿射与网格变形 ----------

// 仿射 [a, b, c, d, e, f]：x' = a x + c y + e，y' = b x + d y + f（与 canvas transform 同序）
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const T = (x, y) => [1, 0, 0, 1, x, y];
const R = deg => { const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD); return [c, s, -s, c, 0, 0]; };
const S = (x, y) => [x, 0, 0, y, 0, 0];

/** 三点对应求仿射：src (x,y)×3 → dst (u,v)×3 */
function triAffine(s0, s1, s2, d0, d1, d2) {
  const ax = s1[0] - s0[0], ay = s1[1] - s0[1], bx = s2[0] - s0[0], by = s2[1] - s0[1];
  const ux = d1[0] - d0[0], uy = d1[1] - d0[1], vx = d2[0] - d0[0], vy = d2[1] - d0[1];
  const det = ax * by - bx * ay;
  const a = (ux * by - vx * ay) / det, c = (vx * ax - ux * bx) / det;
  const b = (uy * by - vy * ay) / det, d = (vy * ax - uy * bx) / det;
  return [a, b, c, d, d0[0] - a * s0[0] - c * s0[1], d0[1] - b * s0[0] - d * s0[1]];
}

/** 图层 alpha → 网格覆盖（哪些格子有像素），加载时算一次 */
function coverage(img, box, step) {
  const [x0, y0, x1, y1] = box;
  const cols = Math.ceil((x1 - x0) / step), rows = Math.ceil((y1 - y0) / step);
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const a = g.getImageData(0, 0, img.width, img.height).data;
  const on = new Uint8Array(cols * rows);
  for (let y = y0; y < Math.min(y1, img.height); y++) for (let x = x0; x < Math.min(x1, img.width); x++) {
    if (a[(y * img.width + x) * 4 + 3] > 2) on[((y - y0) / step | 0) * cols + ((x - x0) / step | 0)] = 1;
  }
  return { x0, y0, step, cols, rows, on };
}

function alphaBox(img, pad = 4) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const a = g.getImageData(0, 0, img.width, img.height).data;
  let x0 = img.width, y0 = img.height, x1 = 0, y1 = 0;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
    if (a[(y * img.width + x) * 4 + 3] > 2) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  return [Math.max(0, x0 - pad), Math.max(0, y0 - pad), Math.min(img.width, x1 + pad + 1), Math.min(img.height, y1 + pad + 1)];
}

const EPS_KEY = m => m.map((v, i) => (i < 4 ? v.toFixed(4) : v.toFixed(2))).join(',');

/**
 * 按位移场 map(x, y) → [x', y'] 画一张变形后的图层（当前 ctx 变换 = 图层坐标系）。
 * 同一仿射的格子合并成一次 clip+drawImage；不是仿射的格子拆两个三角形各画一次。
 * 三角形向外扩 1.2px 盖住抗锯齿缝。
 */
function drawWarped(ctx, src, cov, map) {
  const { x0, y0, step, cols, rows, on } = cov;
  const V = new Array((cols + 1) * (rows + 1));
  const vtx = (i, j) => {
    const k = j * (cols + 1) + i;
    return V[k] || (V[k] = map(x0 + i * step, y0 + j * step));
  };
  const groups = new Map(), tris = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (!on[j * cols + i]) continue;
    const sx = x0 + i * step, sy = y0 + j * step;
    const s00 = [sx, sy], s10 = [sx + step, sy], s01 = [sx, sy + step], s11 = [sx + step, sy + step];
    const d00 = vtx(i, j), d10 = vtx(i + 1, j), d01 = vtx(i, j + 1), d11 = vtx(i + 1, j + 1);
    const A = triAffine(s00, s10, s01, d00, d10, d01);
    const p = apply(A, s11[0], s11[1]);
    if (Math.abs(p[0] - d11[0]) < 0.02 && Math.abs(p[1] - d11[1]) < 0.02) {
      const key = EPS_KEY(A);
      let g = groups.get(key);
      if (!g) groups.set(key, g = { A, cells: [] });
      g.cells.push([sx, sy]);
    } else {
      tris.push([s00, s10, s11, d00, d10, d11], [s00, s11, s01, d00, d11, d01]);
    }
  }
  const pad = 0.75;
  for (const { A, cells } of groups.values()) {
    ctx.save();
    ctx.transform(...A);
    ctx.beginPath();
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (const [sx, sy] of cells) {
      ctx.rect(sx - pad, sy - pad, step + 2 * pad, step + 2 * pad);
      bx0 = Math.min(bx0, sx); by0 = Math.min(by0, sy); bx1 = Math.max(bx1, sx + step); by1 = Math.max(by1, sy + step);
    }
    ctx.clip();
    bx0 = Math.max(0, bx0 - 2); by0 = Math.max(0, by0 - 2);
    bx1 = Math.min(src.width, bx1 + 2); by1 = Math.min(src.height, by1 + 2);
    ctx.drawImage(src, bx0, by0, bx1 - bx0, by1 - by0, bx0, by0, bx1 - bx0, by1 - by0);
    ctx.restore();
  }
  const grow = 1.2;
  for (const [s0, s1, s2, d0, d1, d2] of tris) {
    const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3;
    ctx.save();
    ctx.beginPath();
    for (const [k, d] of [d0, d1, d2].entries()) {
      const dx = d[0] - cx, dy = d[1] - cy, l = Math.hypot(dx, dy) || 1;
      const x = d[0] + dx / l * grow, y = d[1] + dy / l * grow;
      if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.clip();
    ctx.transform(...triAffine(s0, s1, s2, d0, d1, d2));
    const bx0 = Math.max(0, Math.min(s0[0], s1[0], s2[0]) - 2), by0 = Math.max(0, Math.min(s0[1], s1[1], s2[1]) - 2);
    const bx1 = Math.min(src.width, Math.max(s0[0], s1[0], s2[0]) + 2), by1 = Math.min(src.height, Math.max(s0[1], s1[1], s2[1]) + 2);
    ctx.drawImage(src, bx0, by0, bx1 - bx0, by1 - by0, bx0, by0, bx1 - bx0, by1 - by0);
    ctx.restore();
  }
}

// ---------- 加载 ----------

function loadImage(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => (im.decode ? im.decode().then(() => res(im), () => res(im)) : res(im));
    im.onerror = () => rej(new Error(`图层加载失败：${url}`));
    im.src = url;
  });
}

/**
 * 读 <base>/rig.json 和全部图层。rig.json 可选字段（本库扩展）：
 *   neck_line: [[x, y], ...]  下巴/颌线正下方的折线（从左到右）。线以上刚性跟头；线到 neck_pivot.y 之间的脖子
 *                             逐渐过渡到跟身体，脖子根不离开衣领。没有这项就整个头刚性（仍然安全，只是脖子不弯）。
 *   collar_hue: "pink"         头图层里衣领的颜色（目前只认 pink / 任意 CSS 色 → 近似色相），用来把衣领从头上
 *                             分出来钉在身体上。没有就不分离。
 * opts 可覆盖：hair: { top, bottom }（头发从 top 行开始滞后，到 bottom 行完全"挂着"）、headStep / hairStep（网格 px）。
 */
export async function loadRig(base, opts = {}) {
  if (!base.endsWith('/')) base += '/';
  const meta = await (await fetch(base + 'rig.json')).json();
  const [W, H] = meta.size;
  const names = ['01-body', '02-head', '04-hair',
    ...meta.eyes.map(s => `eyes/${s}`), ...meta.mouth.map(s => `mouth/${s}`)];
  const imgs = Object.fromEntries(await Promise.all(names.map(async n => [n, await loadImage(base + n + '.png')])));

  const [px, py] = meta.neck_pivot;
  const chin = meta.chin_y ?? py - 35;
  const hairCfg = { top: chin - 225, bottom: null, ...(opts.hair || {}) };
  const hairBox = alphaBox(imgs['04-hair']);
  if (hairCfg.bottom == null) hairCfg.bottom = hairBox[3];
  const bodyTop = alphaBox(imgs['01-body'])[1];

  const canvas = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const pixels = img => { const c = canvas(), g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0); return g.getImageData(0, 0, W, H); };

  // ---- 衣领分离：头图层里衣领像素 → collar（钉在身体上，画在头之上）；头 = 其余部分 ----
  // 每列从下巴附近往下找第一个衣领色像素，往上多带 5px 包住描边线。
  const headPx = pixels(imgs['02-head']);
  const collarTop = new Float32Array(W).fill(Infinity);
  const isCollar = meta.collar_hue === 'pink' || opts.collarTest
    ? (opts.collarTest || ((r, g, b) => r > 120 && r - g > 60 && b - g > 20)) : null;
  if (isCollar) {
    const d = headPx.data;
    for (let x = 0; x < W; x++) for (let y = Math.round(chin - 60); y < H; y++) {
      const i = (y * W + x) * 4;
      if (d[i + 3] > 128 && isCollar(d[i], d[i + 1], d[i + 2])) { collarTop[x] = y - 5; break; }
    }
  }
  const headOnly = canvas(), collar = canvas(), plate = canvas();
  {
    const hp = new ImageData(new Uint8ClampedArray(headPx.data), W, H);
    const cp = new ImageData(new Uint8ClampedArray(headPx.data), W, H);
    const hairPx = pixels(imgs['04-hair']);
    // 底衬：原图（头 + 头发）在衣领线上方 18px 的窄带，静止钉在身体上，画在头下面；转头时衣领边露出的细缝由它补
    // 横向取 ±14px 内最高的衣领线，脖子两侧和衣领之间的缝也在底衬范围里
    const plateTop = new Float32Array(W);
    for (let x = 0; x < W; x++) {
      let m = Infinity;
      for (let d = -14; d <= 14; d++) if (x + d >= 0 && x + d < W) m = Math.min(m, collarTop[x + d]);
      plateTop[x] = m - 18;
    }
    const pl = new ImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, inCollar = y >= collarTop[x];
      if (inCollar) hp.data[i + 3] = 0; else cp.data[i + 3] = 0;
      if (!inCollar && y >= plateTop[x]) {
        const ha = headPx.data[i + 3] / 255, ra = hairPx.data[i + 3] / 255, a = ra + ha * (1 - ra);
        if (a > 0) for (let c = 0; c < 3; c++) pl.data[i + c] = (hairPx.data[i + c] * ra + headPx.data[i + c] * ha * (1 - ra)) / a;
        pl.data[i + 3] = a * 255;
      }
    }
    headOnly.getContext('2d').putImageData(hp, 0, 0);
    collar.getContext('2d').putImageData(cp, 0, 0);
    plate.getContext('2d').putImageData(pl, 0, 0);
  }

  // ---- 脖子弯曲权重：1 = 跟头，0 = 跟身体 ----
  const line = meta.neck_line;
  const lineY = x => {
    if (!line) return Infinity;
    if (x <= line[0][0] || x >= line[line.length - 1][0]) return Infinity;   // 折线范围外：刚性
    for (let i = 1; i < line.length; i++) {
      if (x <= line[i][0]) return lerp(line[i - 1][1], line[i][1], (x - line[i - 1][0]) / (line[i][0] - line[i - 1][0]));
    }
    return Infinity;
  };
  const neckW = (x, y) => { const y0 = lineY(x); return y <= y0 ? 1 : 1 - smoothstep(y0, py, y); };

  const headStep = opts.headStep || 8, hairStep = opts.hairStep || 16;
  const headCov = coverage(headOnly, alphaBox(headOnly), headStep);
  const hairCov = coverage(imgs['04-hair'], hairBox, hairStep);

  const face = canvas();
  const fctx = face.getContext('2d');

  function headMatrix(p, by) {
    const nod = p.nod || 0;
    return mul(T(px + (p.dx || 0), py + (p.dy || 0) + nod + by),
      mul(R(p.roll || 0), mul(S(1, 1 - nod * 0.004), T(-px, -py))));
  }

  function draw(ctx, t, o = {}) {
    const { x = 0, y = 0, scale = 1, pose = () => ({}), face: faceFn = () => ({}), lips = () => null,
      blink = () => null, breath = {}, hair = {} } = o;
    const bAmp = breath.amp ?? 3, bPer = breath.period ?? 3.8;
    const breathAt = tt => -bAmp * 0.5 * (1 - Math.cos(2 * Math.PI * tt / bPer));  // 吸气时上移（负）
    const span = H - bodyTop;
    const bodyShift = (yy, by) => by * clamp((H - yy) / span);

    const by = breathAt(t);
    const Hm = headMatrix(pose(t), by);

    // 表情 + 眨眼 + 口型
    const f = faceFn(t) || {};
    let eyes = f.eyes || 'open';
    const bl = blink(t);
    if (bl && (eyes === 'open' || eyes === 'surprised')) eyes = bl;
    const talk = lips(t);
    const mouth = talk ?? (f.mouth || 'rest');

    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.clearRect(0, 0, W, H);
    fctx.drawImage(headOnly, 0, 0);
    fctx.drawImage(imgs[`eyes/${eyes}`] || imgs['eyes/open'], 0, 0);
    fctx.drawImage(imgs[`mouth/${mouth}`] || imgs['mouth/rest'], 0, 0);

    ctx.save();
    ctx.transform(scale, 0, 0, scale, x, y);

    // 1. 身体（+ 底衬）：绕底边的竖向微缩放 = 一个仿射
    const k = by / span;
    ctx.save();
    ctx.transform(1, 0, 0, 1 - k, 0, k * H);
    ctx.drawImage(imgs['01-body'], 0, 0);
    ctx.drawImage(plate, 0, 0);
    ctx.restore();

    // 2. 头部组：颌线以上刚性跟头，脖子逐渐过渡到跟身体
    drawWarped(ctx, face, headCov, (vx, vy) => {
      const w = neckW(vx, vy);
      if (w >= 1) return apply(Hm, vx, vy);
      const b = [vx, vy + bodyShift(vy, by)];
      if (w <= 0) return b;
      const h = apply(Hm, vx, vy);
      return [lerp(b[0], h[0], w), lerp(b[1], h[1], w)];
    });

    // 3. 衣领：钉在身体上，压住脖子根
    ctx.save();
    ctx.transform(1, 0, 0, 1 - k, 0, k * H);
    ctx.drawImage(collar, 0, 0);
    ctx.restore();

    // 4. 头发：上半截刚性跟头；往下按行对过去的头部矩阵做阻尼振荡核加权 → 滞后 + 微过冲
    const lagK = hair.lag ?? 1, sway = hair.sway ?? 2;
    const N = 72, dt = 1 / 60;
    const past = [];
    for (let i = 0; i < N; i++) past.push(headMatrix(pose(t - i * dt), breathAt(t - i * dt)));
    const rowM = new Map();
    const hangM = s => {
      const key = s.toFixed(4);
      let M = rowM.get(key);
      if (M) return M;
      // 欠阻尼弹簧的脉冲响应 e^(−ζωτ)·sin(ω_d τ)：越往发梢越软（频率低）→ 滞后更多，ζ=0.5 给一点过冲
      const hz = (6 - 4.5 * s) / Math.max(0.2, lagK), zeta = 0.5, om = 2 * Math.PI * hz, od = om * Math.sqrt(1 - zeta * zeta);
      let sum = 0; const w = [];
      for (let i = 0; i < N; i++) { const tau = (i + 0.5) * dt; const v = Math.exp(-zeta * om * tau) * Math.sin(od * tau); w.push(v); sum += v; }
      M = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < N; i++) for (let c = 0; c < 6; c++) M[c] += past[i][c] * w[i] / sum;
      rowM.set(key, M);
      return M;
    };
    const top = hairCfg.top, bot = hairCfg.bottom;
    const hairMap = (vx, vy) => {
      const h = apply(Hm, vx, vy);
      const s = smoothstep(top, bot, vy);
      if (s <= 0) return h;
      const M = hangM(s);
      const q = apply(M, vx, top);
      const sw = s * s * sway * Math.sin(2 * Math.PI * t / 3.3 + vy * 0.006 + vx * 0.002);
      const hx = vx + (q[0] - vx) + sw, hy = vy + (q[1] - top);
      return [lerp(h[0], hx, s), lerp(h[1], hy, s)];
    };
    drawWarped(ctx, imgs['04-hair'], hairCov, hairMap);

    ctx.restore();
    // 调试/自检用：头部矩阵、左侧发梢的实际位置与"刚性跟头"时应在的位置（图层坐标）
    const tip = [px - 200, bot - 20];
    return { eyes, mouth, head: Hm, hairTip: hairMap(...tip), hairTipRigid: apply(Hm, ...tip), hairRoot: apply(Hm, tip[0], top) };
  }

  return { meta, size: [W, H], images: imgs, draw, neckWeight: neckW, layers: { headOnly, collar, plate } };
}

// ---------- 拼音韵母 → 口型表（GB2312 6763 字；由 macOS CFStringTransform 离线生成；不在 a/o/i/u 里的字按 e） ----------
// a：a ia ua ai uai ao iao an uan ang iang uang；o：o uo ou iu ong iong；i：i in ing 及 zhi/chi/shi/ri/zi/ci/si；
// u：u ü ün；e：e ie üe ei ui en un eng er ian üan。bpm：声母 b/p/m 的字。
const VIS_TABLE = {
  a: '啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒薄雹保堡饱宝抱报暴豹鲍爆标彪膘表擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒揣川穿椽传船喘串疮窗幢床闯创蹿篡窜搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗碉叼雕凋刁掉吊钓调端短锻段断缎发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告蛤刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩貉花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁槛僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖喀咖卡开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠咳夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝俩粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦撂镣廖料峦挛孪滦卵乱妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸苗描瞄藐秒渺庙妙拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖娘酿鸟尿暖啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡飘漂瓢票掐恰洽枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍茄然燃冉染瓤壤攘嚷让饶扰绕软阮撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍刷耍摔衰甩帅栓拴霜双爽酸蒜算塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套挑条迢眺跳湍团拓挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄瞎虾匣霞辖暇峡侠狭下厦夏吓相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄哮嚣销消宵淆晓小孝校肖啸笑效压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀钥匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召抓爪拽专砖转撰赚篆桩庄装妆撞壮状钻纂柞丐卅孬夭爻睾鼗鼐匚卦刂剀剌剡剜蒯剽劁罔仉仨伢佤伥伧伉佧伽佴侉侃佻侪佼俳倌傥僬儋汆冁勹袤脔讪诏诓诖诮诰诳谄谙谠谯谵阪陔隍邗邝邙邡邰郏郐郇郜郯鄣鄯奂劢劭凼鬯垡圹坂坩坳垭垲埏垧垴垓埯埽埭墁墚艹艽艿芄芗苌芟苷茇苒茑茆苕荛荞茭茳荬莰莞莨萘菝菖萑萏菪菀菡葜葙蒇蒈葆葩蒎葭蒿蒡蒗蓼薅薹藁蘩夼耷奘匏尢尥尬尴抟拚拗挢拶捱捺掴捭掼揸揠揞搋搌搡撖撺擀擐攥攮甙叨吒吖吆呔咂咔呷呶哐哒哓咣哌哙咤唛唠哳唣喵啭啁啕唼啖啷唰啜嗒喃嗷嗄嗥嗲嗳嗌嗨嘈嘌嘹噍嚆噻嚓囔囡圜帑幔幛幡岈岙岚岜岬岱峁峤崂崃崤崾崴崽嶂彷徉徕徜徨徭徼彡犴犷犸狎狍狯狻猹猱獐獠獾舛饷馇馓馔馕庖庠庵廒廛忉忏忾怅怆怛怏怊恺惝惘愀憔闩闶闼阆阊阚丬爿戕汊沆泔泱泖泮洹浃洮洚涞浜浣淦涫涮湫湟漭溻溏滂潢潇漤漕漶澉潸潲潺濑澹澶濠瀚灏灞宕寮寰迓迦迨逄逍逭遄遑遐遨遢邈邋彖尻孱羼妲姗娅娆娈姣姹娲婊娼婵媪嫒嫱嫖嫦嫜嬗嬲孀尕尜孢驵骀骁骅骖骜骟骠骣骧纨纩绀绐绗绛绡绱绾缃缈缟缥缦缫缭缰缲缳缵幺巛甾玳珈琊珧琬瑁瑕瑙瑷瑭璜璋璨瓒韬杓杈杩杪杳枭枋杷柰柙枵栲栳桠桡桄栝桦栾桉梵棹椋楠楂榄椴槎榻槔槁樯樘橄樵檫獒殇殍殚轺辋戗戛戡戤臧旮旯旰昊昙杲昝昴昶晁晗暧曜曩贶赅赉赕觇犟牦犒挲掰耄毵氅氘氚氩敫肓朊肽肭肴胩胛胍胱脍脎胲脬脘脲腩腽膪臊膻歃飑飒飙飚斓旄旃炀炝炱烊焓焯煅煲熳熵燔爨灬焘祧禅禳忐恝恙懋戆沓淼矸砀砉砑砝砹砟砬硭硖硗砦硇磉礓礤龛眇眈睐睚瞀瞟瞰畈畹疃罡罱盥钆钊钌钏钐钗钛钣钫钪钯钽铊铐铑铗铙铛铞铠铧铪铩铫铴铵铹铼锆锎锒锕锖锬锴锸锾锿锵镎镓镖镗镘镡镧镩镪镲镳稂穰皎皓鸨鸹鸾鹋鹌鹞鹩鹪鹳疝疳疸痄疱痂痖痨痧瘅瘌瘥瘕瘙瘢癀瘭瘵癍癞窈窕衩衲袢裆袷裱褡褓褴襁襻耖耢耥耩聃聱覃顸颃颔颛颟颡颢虿蚝蚶蚺蚱蛱蛲蛟蛘蛸蜣蜩蜿螂蝻蝥螯螨蟒蟆螗螃蟥螬螵螳蟓蟑蟀蟊蟠蟮蟾罅笊笪笤笳筻筢筲筱箪箫篁簖簪籁舡舢舨舫艄艚袅袈裟羟羰粑粜粲糁糌糨繇纛趱赧豇酐醢醣醪醮趵趿跄跚跏跆跷跤踉踝踹蹒蹯躔躜貂觞霎霭霾龅龆銮錾鏊鲂鲅鲐鲛鲞鲦鲨鲩鲳鲷鳇鳋鳌鳎鳏鳐鳔鳗鳝靼鞅鞑鞒鞔髂髋魃魉魈魍飨饕髟髦髯髫鬟鏖黛黠黪黯鼾齄',
  o: '剥玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳卜充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭戳绰聪葱囱匆从丛凑磋撮搓措挫错丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都掇哆多夺垛躲朵跺舵剁惰堕否工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够锅郭国果裹过轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后豁活伙火获或惑霍货祸炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚空恐孔控抠口扣寇括扩廓阔溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋萝螺罗逻锣箩骡裸落洛骆络谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某牛扭钮纽脓浓农弄挪懦糯诺哦欧鸥殴藕呕偶沤坡泼颇婆破魄迫粕剖琼穷秋丘邱球求囚酋泅戎茸蓉荣融熔溶容绒冗揉柔肉若弱收手首守寿授售受瘦兽说硕朔烁松耸怂颂送宋讼诵搜艘擞嗽蓑梭唆缩琐索锁所通桐酮瞳同铜彤童桶捅筒统痛偷投头透拖托脱鸵陀驮驼椭妥唾挝蜗涡窝我斡卧握沃兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤捉拙卓桌琢茁酌啄灼浊鬃棕踪宗综总纵邹走奏揍昨左佐做作坐座乇厝叵卣劐冂攸佝佟佗侑侬侔俦俅俑偌倬倮倭倥偬偻傩僦僮仝黉馘訇亠亳裒蠃凇冢讧讴诟诹诼谟阼陬邛鄱鄹叟巯壅垅坨垌埚堠墉芎苁芤茉茏茕茼茺荦荭荮莴莠莜莸菘蒌蓦蒴蔸蔻蕃蕻薨薮藿廾扌掊搠搦摞擢攉叩呙咚咄呦咻哚哝哞唢唑喏唷啵喁啾嗖喽喔嗦嗍嗵嗾嘬噢嚯囿帱帼幄岽岫岣峒崧崞崆嵘嵯嵝嵩後犰狃狨狩猓猡夥饽馊馍馐庥庹怄忡忪忸怍恸悚惆慵憧闳阄泷沲泺沱泓浏浞淞涿淙溲渥溴漯潼濯宥辶迥逅逑遒遘遛妁妞妯娑媾嫫嬷驺骝骢纣绉缍绶绺缑缪邕珑珀珙珞琮璁枞栊柩柚柝枸柁桕桫椤椁楱楸槊榕橐檗猷殁辍辏瓯炅赇觏擘氡牖虢肟肜肱胧胨胄胙胴脶脞腙腠飕彀旒熘扃祚禚斫砻砼砣硐硪碡礴眍眸睃瞍钋钭钬钷钹铄铎铕铥铳锉锍锘锪锼镂镆镏镙镛镬镯锺矬秣皤甬鸠鸫鸺鹁鹨鹫疣痤瘊瘘瘼瘰癃瘳竦穹窦裰耠耦耧耨耱聒虬蚣蚪蚰蚯蚴蛩蛞蛑蜾蝈蝾螋蝣蝼蝤螽蠖缶筇笸笱筘箬箨箜篌篝篼簸籀舂舯艏艟裘羧粽糇糅糗赳酎酢酡鹾跫跎跛踔踣踵踱蹉蹂貊貅貘觥龊龌鼍雒雠銎鍪鎏鱿鲎鲰鳅鳙鞣鞲骰骺髅饔髹鬏麽黝鼬鼽',
  i: '逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛彬斌濒滨宾摈兵冰柄丙秉饼炳病并吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽疵茨磁雌辞慈瓷词此刺赐次堤低滴迪敌笛狄涤翟嫡抵底蒂第帝弟递缔丁盯叮钉顶鼎锭定订击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪藉巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令眯醚靡糜迷谜弥米秘觅泌蜜密幂民抿皿敏悯闽明螟鸣铭名命妮霓倪泥尼拟你匿腻逆溺您柠狞凝宁拧泞坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬拼频贫品聘乒坪苹萍平凭瓶评屏期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆日师失狮施湿诗尸虱十石拾时食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试斯撕嘶思私司丝死肆寺嗣四伺似饲巳梯剔踢锑提题蹄啼体替嚏惕涕剃屉厅听烃汀廷停亭庭挺艇昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒兹咨资姿滋淄孜紫仔籽滓子自渍字丌丕匕卮氐囟胤亟乩亓芈厮刈刭剞劓仃仳佞佚伲佶佾俪俚俜俟俾倜偈傧傺僖儆籴兮兕禀嬴冫冖冥诋诒谛谘谥谧卺阱陂陉陟陴隰邴邳邸郅郦郢郗郫鄞酃廴厶墼圮圯坜圻坻坭垠埘埴埸埤堙墀馨鼙懿芨芑芰苈芘芷芩芪苡苘茌苓茚茔苠荑荜茈莛荇茗荠荥荩荸莳莅荻莺菁萁菥堇萋萆萦葺葸葶蓍蒺蓠蓥蓰蔺蕺蕲薏薜藜蘼弈奕奚挹掎揿摒撄摭擗擤弋弑叱叽呓呖吡吣吲呤咛咝咭咦哔呲咿哜咪哧唏唧啉啶唳喱喑啻嗪嗤嘁嘤嘀嘧噙噤噫噼囹圊帙岌屺岐岷峄嵫嵴嶙豳嶷彳徙徵狴猁狺猗猊猕獍夤夂饣饧饩饬饴馑庀庳廑廪膺忄忮怩怿怡悒悌悻愎憬懔闵阋汔汜汨泗泠泯泾洇洎浠淇淅淠溱滢溧滗溟潆漪澌澧濞瀛宓甯迤迳逦逖遴彐彘咫屐屣弪弭弼妣妗姊姒姘娌娉娣婧婢婷媲嫔媸嫠嬉嬖孳驷驿骊骐骘骥纟纰绨绫绮缁缇缌缗缙缡缢缤畿玎玑玢珉玺琪瑛琦瑾璎璧杞枥枇栉枰枳栀柃柢栎桎桤梃梓棂棣楫榀楹槟槿槭檠檎樨檩殛殡殪轵轶轹轼轾辎辚戟戢瓴甓昕昵耆暝曦贳贻贽赀赆赍觊觋觌觐牝犄氤敕肼胝胫脒腈腚媵膑膣膦欷欹歆齑旌旎旖炻熠熹戾礻祀祉祢祗祠祺禊禧恣愍憩矶砺砥硎碛碇碲磬黹眙眦眵睇睨睥瞑瞵町畀詈罴罹羁钅钇铈铋铌铍铟铤锂锓锱锶镒镔镝镱雉秕秭嵇稷皙鸱鸶鸷鹂鹈鹚鹦疔疠疬痍痣瘗瘛瘠瘿瘾癔癖翊穸窨衤衿裼裨褫疋矜耔耜耵聆聍颀颍颦虮蚍蚓蚩蛎蛉蛭蛳蜓蛴蜊蜻蜞蜥蜴蜱螓螅螭螫蟋蠡罂罄舐笈笄笫笠笥笞筚筮箐箅篥篦篪舄舣舭舾衾襞羝羲敉粝粞粢粼糍暨羿翎翕翳糸絷綦綮趑豉酊酏酩酯酾醍醯醴豕跖跞跸跻跽踟踬踯蹊躏豸貔觜觯訾謦靓雳霆霁霪龇龈黾鑫鲆鲚鲡鲥鲫鲭鲮鲵鲺鲻鳍鳘鳢骶髀髌魑髻髭鬓縻麂麋麒麟黟黧黥鼷',
  u: '捕哺补埠不布步簿部怖初出橱厨躇锄雏滁除楚础储矗搐触处粗醋簇促督毒犊独读堵睹赌杜镀肚度渡妒佛夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧均菌钧军君峻俊竣浚郡骏枯哭窟苦酷库裤芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿拇牡亩姆母墓暮幕募慕木目睦牧穆奴努怒女扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑趋区蛆曲躯屈驱渠取娶龋趣去裙群茹蠕儒孺如辱乳汝入褥蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕苏酥俗素速粟僳塑溯宿诉肃凸秃突图徒途涂屠土吐兔巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续勋熏循旬询寻驯巡殉汛训讯逊迅迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭耘云郧匀陨允运蕴酝晕韵孕珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻租足卒族祖诅阻组亍兀禺毓丶嘏刳仫伛仵伫侏俣倏倨俎巽匍匐凫夙冱讵诂诎诩谀谕谡阝阢邬邾郓郛刍劬勖塾圬垆坶埙堍堀芏芙芸苣芴苎苜苴苻莒茱茯荀荨荼莩菽萸菔菟菹菰蓐蓣蔌蔟蕖蓿蕈薷薰蘧拊捋捃掬揄摅撸卟呋呒呱唔唿喾嗉嘟噗噜嚅囫圄圉幞岖岵峋崮嵛徂徇衢狁狳猝猢獯饫馀庑庾怃忤怙怵怫恂恽惚愠愫憷闾阈阒沐汩沭泸洙洫洵浒浔洳涑浯渚渎渌溆溥溽滏滹潴漉澍濡濮寤迕逋逡逯遽屦弩艴鬻妩妪妤姝胬婺孚孥驸驽骛纡纭纾绂绋绌绔缛顼琥琚瑜璞璩璐韫杌杵杼栌栩梏桴楮椟椐榘榈榉槠樗橥槲橹橘殂殒轱轳轷辂辘瓿攴昀昱晡曛赙觎觑牯牾牿犋毪毹氇氆氍氲攵牍胪朐腴腧膂臌欤飓殳毂觳於烀炷焐煳煜熨燠煦戽扈祛祜祓恧肀聿砩磲黻黼盱瞽罘罟钍钕钚钜钰钴钸钼铢铷锔锢镞镤镥镨秫稆稃馥瓠鸪鸬鸲鹄鹆鹉鹕鹜鹬鹱鹭疰痦瘃痼瘐瘀癯窬窭窳褚裾褛襦胥皲颥虍蚨蛄蛐蜈蜍蜉蜮蝠蝮蝓蠹蠼竺竽笃笏筠箸簌簏臾舁衄舻舳糈翥麸麴趄酤酴醐醑醭醵醺蹙趺跗踽蹰蹼蹴躅斛觚觫雩龃龉雎瞿鋈鲈稣鲋鲟鲴鳆鞫骷鹘髑麇麈黜黢黩鼯',
  bpm: '芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖脯妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑丕丿匕乜芈孛叵匾剽仫仳侔俜俳俾傧勹匍亳袤裒禀冫冖冥谝谟谧阪陂陴邙邴邳邶郫鄱劢勐弁畚坌圮坂坶埤堋墁鼙芘苄茉苤茇苜茆苠荜茗荬荸莓菝萆葆葩蒎蓦蓓蒡甍瞢蕃薜蘼匏扪拚捭掊摒擗卟吡呗哔哌咩咪哞唛喵啵辔嘌嘣嘧嘭噗噼帔幔岜峁岷嵋豳彷犸狍狴猕猸饽馍庀庖庳忭怦悖愎懵闵爿沐沔汨汴泖泮泯浜浼淠渑湎湓湄漭溥滗滂溟濮濞灞宀宓逄逋邈弭弼妣姘娉婊婢嫫媲嫔嫖嬖嬷孢骈骠纰缈缏缗缤缥缦缪玢珀珉瑁璞璧杓杩枇杪杷枰榀楣槟檗殁殍殡瓿甏甓攴昴晡暝贲牝牦犏掰擘耄毪氆氕攵胼脒脬腼膑朦飑飙飚旆旄焖煲煸熳灬祢愍懋懑淼砭硭碚碥礞礴眄眇眸睥瞀瞑瞟畀罴钋钔钚钣钯钷钸钹钼铋铍锛锫镅镆镔镖镘镤镨镳秕秣皤鸨鹁鹋鹎鹛疱瘼瘢瘭癍癖窆袂袢裱裨褙褓褊襻疋耱颟颦虻蚍蛑蜱蜢蝙蝥螨蟒蟆螃螵蟊蟛蟠蠓蠛笸笾筚筢箅篦篾簸舭舨艋艨襞敉粑翩糸酩醅醭蹩趵跛跸踣蹁蹒蹼貊貘貔霈霾龅黾鍪鐾鲅鲆鳊鳔鳗鳘鞔鞴髀髌魅魃髟髦鬓麽縻麋',
};
