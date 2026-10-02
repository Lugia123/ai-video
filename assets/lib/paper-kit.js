// 纸剪 UI 绘制工具包：从 samples/ui-pop-15s 抽出来的可复用部分（那个样片自己仍保留原副本，未改动）。
//
//   import { createKit } from '../../assets/lib/paper-kit.js';
//   const K = createKit(ctx);          // ctx：1920×1080 的 2D context
//   K.setTime(t);                      // 每帧 seek 时先设时间，下面所有"随时间"的函数都读它
//   K.drawBG();                        // 米白底纸 + 纤维 + 折痕
//   K.paper(K.rr(x, y, w, h, r, seed), [x, y, w, h], { fill, lift, seed, crease, ink, inkW })
//   K.win({ x, y, w, h, t0, title, seed, rot }, (w, h) => { ...窗口内容... })
//   K.bigType('大字', x, y, size, t0, { align, stagger, color, shade })
//   K.cursor(x, y, press) / K.drawCursor(keys, clicks) / K.toast(...)
//
// 画面是 t 的纯函数：纹理在 createKit 时用种子 PRNG 生成一次；毛边来自无状态哈希。

export const C = {
  bg: '#EFE7D6', card: '#FFFCF5', ink: '#1E1B18', mute: '#8C8375', faint: '#D9D0BF',
  red: '#E0533A', mustard: '#F0B43C', blue: '#3E6FB0', sky: '#C4DAEA', green: '#4E9A6A',
  mint: '#CFE5D2', pink: '#F2C1B4', sand: '#EDE4D2', orange: '#EE7A3C',
};
export const F = {
  big: '"Avenir Next Condensed", "Futura", "Helvetica Neue", sans-serif',
  ui: '"Avenir Next", "Helvetica Neue", "PingFang SC", sans-serif',
  code: 'Menlo, "SF Mono", monospace',
  zh: '"PingFang SC", "Hiragino Sans GB", "Heiti SC", sans-serif',
};
export const RAD = Math.PI / 180;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const eo3 = p => 1 - (1 - p) ** 3;
export const ei3 = p => p ** 3;
export const eio = p => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
export const eBack = p => { const c = 1.9, c3 = c + 1; return 1 + c3 * (p - 1) ** 3 + c * (p - 1) ** 2; };
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
/** 无状态哈希 → [-1, 1) */
export function hash(a, b = 0) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296 * 2 - 1;
}
export function mix(a, b, p) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = s => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const [x, y] = [ch(pa), ch(pb)];
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], p))).join(',')})`;
}

/** 纸纹纹理（启动时生成一次） */
export function makeTex(w, h, seed, { base, mott, grain, speck, fibers, fiberCol, creases }) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const rnd = mulberry32(seed);
  const lattice = cell => {
    const gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2;
    const a = new Float32Array(gw * gh).map(() => rnd() * 2 - 1);
    return (x, y) => {
      const fx = x / cell, fy = y / cell, ix = fx | 0, iy = fy | 0;
      let u = fx - ix, v = fy - iy; u = u * u * (3 - 2 * u); v = v * v * (3 - 2 * v);
      const i = iy * gw + ix;
      return lerp(lerp(a[i], a[i + 1], u), lerp(a[i + gw], a[i + gw + 1], u), v);
    };
  };
  const n1 = lattice(210), n2 = lattice(55), n3 = lattice(9);
  const img = g.createImageData(w, h), d = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = mott[0] * n1(x, y) + mott[1] * n2(x, y) + mott[2] * n3(x, y) + grain * (rnd() - 0.5)
      + (rnd() < speck ? -30 - 30 * rnd() : 0);
    const i = (y * w + x) * 4;
    d[i] = base[0] + v; d[i + 1] = base[1] + v * 0.97; d[i + 2] = base[2] + v * 0.9; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  g.lineCap = 'round';
  for (let i = 0; i < fibers; i++) {
    const x = rnd() * w, y = rnd() * h, len = 8 + rnd() * 34, a = rnd() * Math.PI * 2, bend = (rnd() - 0.5) * 18;
    const light = rnd() < 0.4;
    g.strokeStyle = light ? `rgba(255,255,255,${0.1 + rnd() * 0.25})` : `rgba(${fiberCol},${0.05 + rnd() * 0.11})`;
    g.lineWidth = 0.5 + rnd() * 0.9;
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a) * len / 2 - Math.sin(a) * bend, y + Math.sin(a) * len / 2 + Math.cos(a) * bend,
      x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.stroke();
  }
  for (const [x0, y0, x1, y1] of creases) {
    const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny), ux = nx / L, uy = ny / L;
    const gr = g.createLinearGradient(x0, y0, x0 + ux * 90, y0 + uy * 90);
    gr.addColorStop(0, 'rgba(90,65,35,0.07)'); gr.addColorStop(1, 'rgba(90,65,35,0)');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x1 + ux * 90, y1 + uy * 90); g.lineTo(x0 + ux * 90, y0 + uy * 90); g.fill();
    g.lineWidth = 2; g.strokeStyle = 'rgba(90,65,35,0.14)';
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.5)';
    g.beginPath(); g.moveTo(x0 - ux * 2.5, y0 - uy * 2.5); g.lineTo(x1 - ux * 2.5, y1 - uy * 2.5); g.stroke();
  }
  return c;
}

export function createKit(ctx, { W = 1920, H = 1080, bgSeed = 7331, creases } = {}) {
  let t = 0;
  const setTime = x => { t = x; };
  const now = () => t;
  const prog = (t0, dur) => clamp((t - t0) / dur);
  /** 点击按压量：按下 50ms，松开 120ms */
  const press = times => {
    let v = 0;
    for (const tc of times) {
      if (t >= tc - 0.05 && t < tc) v = Math.max(v, (t - tc + 0.05) / 0.05);
      else if (t >= tc && t < tc + 0.12) v = Math.max(v, 1 - (t - tc) / 0.12);
    }
    return v;
  };

  const BG = makeTex(W, H, bgSeed, {
    base: [239, 232, 216], mott: [7, 4, 2], grain: 9, speck: 0.0006, fibers: 2200, fiberCol: '110,85,50',
    creases: creases ?? [[1235, -10, 1190, 1090], [-10, 470, 1930, 515]],
  });
  const GRAIN = makeTex(2500, 1400, 9127, {
    base: [250, 248, 244], mott: [4, 3, 2], grain: 8, speck: 0.0012, fibers: 2600, fiberCol: '140,115,80', creases: [],
  });
  const drawBG = () => ctx.drawImage(BG, 0, 0);

  /* ---------- 纸片路径：剪刀毛边 ---------- */
  const pathCache = new Map();
  function rr(x, y, w, h, r, seed, amp = 1.1) {
    const key = `${x},${y},${w},${h},${r},${seed},${amp}`;
    let p = pathCache.get(key);
    if (p) return p;
    r = Math.min(r, w / 2, h / 2);
    const pts = [];
    const corner = (cx, cy, a0) => { for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    const side = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 22)); for (let i = 1; i < n; i++) pts.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); };
    corner(x + w - r, y + r, -Math.PI / 2); side(x + w, y + r, x + w, y + h - r);
    corner(x + w - r, y + h - r, 0); side(x + w - r, y + h, x + r, y + h);
    corner(x + r, y + h - r, Math.PI / 2); side(x, y + h - r, x, y + r);
    corner(x + r, y + r, Math.PI); side(x + r, y, x + w - r, y);
    p = new Path2D();
    pts.forEach(([px, py], i) => {
      const jx = px + amp * hash(i, seed * 2), jy = py + amp * hash(i, seed * 2 + 1);
      i ? p.lineTo(jx, jy) : p.moveTo(jx, jy);
    });
    p.closePath();
    if (pathCache.size > 4000) pathCache.clear();
    pathCache.set(key, p);
    return p;
  }
  function circ(cx, cy, r, seed, amp = 0.9) {
    const key = `c${cx},${cy},${r},${seed},${amp}`;
    let p = pathCache.get(key);
    if (p) return p;
    p = new Path2D();
    const n = Math.max(10, Math.round(r * 2 * Math.PI / 12));
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, r2 = r + amp * hash(i, seed);
      i ? p.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2) : p.moveTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    }
    p.closePath();
    pathCache.set(key, p);
    return p;
  }
  /** 任意多边形（点列）→ 带毛边的路径，不缓存（用于伪 3D 的面） */
  function poly(pts, seed = 0, amp = 0.8, step = 26) {
    const p = new Path2D();
    let k = 0;
    pts.forEach(([x0, y0], i) => {
      const [x1, y1] = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let j = 0; j < n; j++, k++) {
        const x = lerp(x0, x1, j / n) + (j ? amp * hash(k, seed * 2) : 0), y = lerp(y0, y1, j / n) + (j ? amp * hash(k, seed * 2 + 1) : 0);
        k ? p.lineTo(x, y) : p.moveTo(x, y);
      }
    });
    p.closePath();
    return p;
  }
  /** 纸片 = 投影 + 底色 + 纸纹（multiply）+ 错位油墨描边 */
  function paper(path, bb, o = {}) {
    const lift = o.lift ?? 1;
    ctx.save();
    if (lift > 0) {
      ctx.shadowColor = `rgba(70,48,25,${0.2 + 0.04 * lift})`;
      ctx.shadowBlur = 3 + 9 * lift; ctx.shadowOffsetX = 1 + 2.5 * lift; ctx.shadowOffsetY = 2 + 6 * lift;
    }
    ctx.fillStyle = o.fill ?? C.card;
    ctx.fill(path);
    ctx.restore();
    if (o.tex !== false) {
      ctx.save(); ctx.clip(path);
      ctx.globalCompositeOperation = 'multiply';
      const s = Math.abs(o.seed ?? 0);
      const [x, y, w, h] = bb;
      const sx = (s * 211) % 500, sy = (s * 97) % 200;
      const dw = Math.min(w + 4, 1990), dh = Math.min(h + 4, 1190);
      ctx.drawImage(GRAIN, sx, sy, dw, dh, x - 2, y - 2, dw, dh);
      if (o.crease) {
        const [a, b] = o.crease;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(90,65,35,0.12)';
        ctx.beginPath(); ctx.moveTo(x + w * a, y); ctx.lineTo(x + w * b, y + h); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.moveTo(x + w * a - 2.5, y); ctx.lineTo(x + w * b - 2.5, y + h); ctx.stroke();
      }
      ctx.restore();
    }
    if (o.ink !== false) {
      ctx.save();
      ctx.translate(-1.6, -1.1);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = o.inkCol ?? C.ink; ctx.lineWidth = o.inkW ?? 3;
      ctx.stroke(path);
      ctx.restore();
    }
  }
  function text(s, x, y, size, o = {}) {
    ctx.font = `${o.weight ?? 600} ${size}px ${o.font ?? F.ui}`;
    ctx.textAlign = o.align ?? 'left';
    ctx.textBaseline = o.base ?? 'alphabetic';
    ctx.fillStyle = o.color ?? C.ink;
    ctx.fillText(s, x, y);
    return ctx.measureText(s).width;
  }

  /* ---------- 大字：逐字掉落，油墨 + 错位色版 ---------- */
  function bigType(str, x, y, size, t0, o = {}) {
    const font = `${o.weight ?? 800} ${size}px ${o.font ?? F.big}`;
    ctx.font = font;
    const chars = Array.from(str);
    const widths = chars.map(ch => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + (o.track ?? 0) * (chars.length - 1);
    let cx = o.align === 'center' ? -total / 2 : o.align === 'right' ? -total : 0;
    const stagger = o.stagger ?? 0.035;
    const out = o.out != null ? prog(o.out, 0.25) : 0;
    ctx.save();
    ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot * RAD);
    chars.forEach((ch, i) => {
      const w = widths[i];
      const p = prog(t0 + i * stagger, 0.2);
      if (p > 0 && ch !== ' ' && out < 1) {
        const k = eBack(p);
        ctx.save();
        ctx.translate(cx + w / 2, -size * 0.35 - (1 - k) * size * 0.45 + out * size * 0.3);
        ctx.rotate((1 - k) * 12 * RAD * (i % 2 ? 1 : -1) + hash(i, chars.length) * 1.5 * RAD);
        const sc = lerp(1.5, 1, eo3(p));
        ctx.scale(sc, sc);
        ctx.globalAlpha = clamp(p * 4) * (o.alpha ?? 1) * (1 - out);
        ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const off = size * 0.035;
        if (o.shade !== false) { ctx.fillStyle = o.shade ?? C.red; ctx.fillText(ch, off, off); }
        ctx.fillStyle = o.color ?? C.ink;
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      }
      cx += w + (o.track ?? 0);
    });
    ctx.restore();
    return total;
  }

  /* ---------- 光标 ---------- */
  const ARROW = [[0, 0], [0, 38], [9, 29.5], [15.5, 43], [22, 40], [15.8, 27], [28, 27]];
  function cursor(x, y, pr = 0, alpha = 1) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    const s = 1.45 * (1 - 0.14 * pr);
    ctx.scale(s, s);
    ctx.rotate(-4 * RAD);
    const p = new Path2D();
    ARROW.forEach(([px, py], i) => (i ? p.lineTo(px, py) : p.moveTo(px, py)));
    p.closePath();
    ctx.save();
    ctx.shadowColor = 'rgba(70,48,25,0.3)'; ctx.shadowBlur = 6 - 4 * pr; ctx.shadowOffsetX = 3 - 2 * pr; ctx.shadowOffsetY = 6 - 4 * pr;
    ctx.fillStyle = '#FFFEFA'; ctx.fill(p);
    ctx.restore();
    ctx.lineJoin = 'round'; ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.stroke(p);
    ctx.restore();
  }
  function clickMark(x, y, tc) {
    const p = prog(tc, 0.24);
    if (p <= 0 || p >= 1) return;
    ctx.save();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 4 * (1 - p) + 1; ctx.lineCap = 'round';
    for (const a of [-150, -110, -70, 170]) {
      const r0 = 18 + 26 * eo3(p), r1 = r0 + 16 * (1 - p);
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a * RAD) * r0, y + Math.sin(a * RAD) * r0);
      ctx.lineTo(x + Math.cos(a * RAD) * r1, y + Math.sin(a * RAD) * r1);
      ctx.stroke();
    }
    ctx.restore();
  }
  /** 光标关键帧 [秒, x, y]：缓入缓出 + 一点弧度 */
  function cpath(ks) {
    if (t <= ks[0][0]) return [ks[0][1], ks[0][2]];
    for (let i = 1; i < ks.length; i++) {
      const [t1, x1, y1] = ks[i], [t0, x0, y0] = ks[i - 1];
      if (t < t1) {
        const p = eio((t - t0) / (t1 - t0));
        const bow = Math.sin(Math.PI * p) * 0.12;
        return [lerp(x0, x1, p) - (y1 - y0) * bow, lerp(y0, y1, p) + (x1 - x0) * bow];
      }
    }
    const l = ks[ks.length - 1];
    return [l[1], l[2]];
  }
  function drawCursor(keys, clicks = [], alpha = 1) {
    const [x, y] = cpath(keys);
    if (alpha > 0) clicks.forEach(tc => clickMark(x, y, tc));
    cursor(x, y, press(clicks), alpha);
    return [x, y];
  }

  /* ---------- 窗口 ---------- */
  const TB = 64;
  function win(o, content) {
    const e = o.t0 == null ? 1 : prog(o.t0, 0.3);
    if (e <= 0) return;
    const k = eBack(e);
    ctx.save();
    ctx.translate(o.x + o.w / 2, o.y + o.h / 2 - (1 - k) * 60);
    ctx.rotate(((o.rot ?? 0) + (1 - e) * 3) * RAD);
    const s = (o.s ?? 1) * (1 + 0.05 * (1 - e));
    ctx.scale(s, s);
    ctx.translate(-o.w / 2, -o.h / 2);
    ctx.globalAlpha *= clamp(e * 5) * (o.alpha ?? 1);
    paper(rr(0, 0, o.w, o.h, 20, o.seed), [0, 0, o.w, o.h], { fill: o.fill ?? C.card, lift: (o.lift ?? 1) + 2 * (1 - e), seed: o.seed, crease: o.crease });
    if (o.title != null) {
      for (let i = 0; i < 3; i++) {
        ctx.save(); ctx.translate(-1, -1);
        ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink;
        ctx.stroke(circ(34 + i * 30, TB / 2, 9, o.seed + i));
        ctx.restore();
      }
      text(o.title, o.w / 2, TB / 2 + 1, 26, { align: 'center', base: 'middle', color: C.mute, weight: 600, font: o.titleFont ?? F.ui });
      ctx.fillStyle = C.ink; ctx.fillRect(10, TB - 1, o.w - 20, 2.5);
    }
    if (content) {
      ctx.save();
      ctx.translate(0, o.title != null ? TB : 0);
      content(o.w, o.h - (o.title != null ? TB : 0));
      ctx.restore();
    }
    ctx.restore();
  }
  /** 窗口内容区局部坐标 → 屏幕坐标（按入场结束后的姿态） */
  function l2s(o, lx, ly) {
    const s = o.s ?? 1, a = (o.rot ?? 0) * RAD;
    const dx = (lx - o.w / 2) * s, dy = (ly + (o.title != null ? TB : 0) - o.h / 2) * s;
    return [o.x + o.w / 2 + dx * Math.cos(a) - dy * Math.sin(a), o.y + o.h / 2 + dx * Math.sin(a) + dy * Math.cos(a)];
  }

  /* ---------- 通知 ---------- */
  function toast(x, y, w, title, sub, col, glyph, tIn, seed, o = {}) {
    const p = prog(tIn, 0.22);
    if (p <= 0) return;
    const out = o.out != null ? eio(prog(o.out, 0.25)) : 0;
    ctx.save();
    ctx.translate(x + (1 - eBack(p)) * (w + 80) + out * (w + 120), y);
    ctx.rotate(hash(seed, 3) * 1.2 * RAD);
    const h = 104;
    paper(rr(0, 0, w, h, 16, seed), [0, 0, w, h], { lift: 1.2, seed });
    paper(circ(52, h / 2, 26, seed + 1), [26, h / 2 - 26, 52, 52], { fill: col, lift: 0, seed: seed + 1, inkW: 2.2 });
    text(glyph, 52, h / 2 + 2, 28, { align: 'center', base: 'middle', color: C.card, weight: 800 });
    text(title, 96, 46, 29, { weight: 700, font: o.font ?? F.ui });
    text(sub, 96, 80, 23, { color: C.mute, weight: 500, font: o.font ?? F.ui });
    ctx.restore();
  }

  return {
    ctx, W, H, BG, GRAIN, setTime, now, prog, press, drawBG,
    rr, circ, poly, paper, text, bigType, cursor, clickMark, cpath, drawCursor, win, l2s, TB, toast,
  };
}
