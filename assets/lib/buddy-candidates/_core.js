// 讲解员候选的共用骨架（#1002）：站位 / 迈腿 / acts / 眨眼的状态机与 box-buddy.js 逐行一致，
// 只把「画成什么样」交给各候选自己的 design。这样任何候选都能直接顶替 createBuddy：
//   - 入参同：createBuddy(ctx, { path, acts, seed, blinkSeed })，返回 { draw(t, o), state(t) }
//   - state(t) 的字段同（x y s dy sqx sqy tilt handL handR thumbL thumbR knife question exclaim …）
//   - 手的静止位置同：离中线 ±117、离地 36 + 128×0.45（各集里「手里拿的牌子」就是按这个算的）
// 画面是 t 的纯函数：纹理按种子生成一次，毛边来自无状态哈希。
//
// design = {
//   tex: { 名字: '#rrggbb', ... }      每种颜色一张蜡笔排线纹理
//   headTop: -150                       头顶在身体坐标里的 y（问号 / 惊叹线放在它上面）
//   shadowW: 280                        地面铅笔阴影的宽度
//   legs(d) / body(d) / hand(d, side, hx, hy, thumb)
// }
// d = { ctx, st, t, boil, bodyBottom, fill, ink, bodyPt, stubLegs, mitt, arm, ovalEyes }

import { clamp, lerp, eo3, eio, eBack, hash, mulberry32, RAD } from '../paper-kit.js';
export { clamp, lerp, eo3, eio, eBack, hash, mulberry32, RAD };

const BODY_W = 210, BODY_H = 128, LEG_H = 36;
export const OUT = '#3A2A20';
export const GEOM = { BODY_W, BODY_H, LEG_H, HAND_X: BODY_W / 2 + 12, HAND_Y: BODY_H * 0.45 };

const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const shade = ([r, g, b], k) => (k < 0 ? [r * (1 + k), g * (1 + k), b * (1 + k)] : [r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k]).map(Math.round);

/** 蜡笔排线纹理：同一方向的短斜线，深浅两色，留出纸白 */
export function crayonTex(hex, seed) {
  const c = document.createElement('canvas'); c.width = 320; c.height = 220;
  const g = c.getContext('2d');
  const rnd = mulberry32(seed);
  const base = rgb(hex), dark = shade(base, -0.18), light = shade(base, 0.3), pale = shade(base, 0.72);
  g.fillStyle = hex; g.fillRect(0, 0, c.width, c.height);
  g.lineCap = 'round';
  for (let i = 0; i < 900; i++) {
    const x = rnd() * c.width, y = rnd() * c.height, len = 18 + rnd() * 46, a = (-58 + rnd() * 10) * RAD;
    const r = rnd();
    g.strokeStyle = r < 0.45 ? `rgba(${dark},${0.18 + rnd() * 0.22})` : r < 0.8 ? `rgba(${light},${0.2 + rnd() * 0.25})` : `rgba(${pale},${0.12 + rnd() * 0.18})`;
    g.lineWidth = 1 + rnd() * 2.2;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
  }
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (rnd() - 0.5) * 16 + (rnd() < 0.02 ? 18 : 0);
    d[i] += v; d[i + 1] += v; d[i + 2] += v;
  }
  g.putImageData(img, 0, 0);
  return c;
}
function pencilShadow(seed) {
  const c = document.createElement('canvas'); c.width = 420; c.height = 70;
  const g = c.getContext('2d');
  const rnd = mulberry32(seed);
  g.lineCap = 'round';
  for (let i = 0; i < 520; i++) {
    const u = rnd() * 2 - 1, v = rnd() * 2 - 1;
    if (u * u + v * v > 1) continue;
    const x = 210 + u * 200, y = 35 + v * 26, len = 10 + rnd() * 26;
    const fall = 1 - (u * u + v * v);
    g.strokeStyle = `rgba(60,55,50,${0.08 + 0.2 * fall * rnd()})`;
    g.lineWidth = 0.8 + rnd() * 0.8;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y - len * 0.18); g.stroke();
  }
  return c;
}

/* ---------- 手绘毛边路径 ---------- */
/** 圆滑闭合形：过各点中点的二次曲线，点位按种子抖动 */
export function blob(pts, seed, amp = 1.3) {
  const p = new Path2D(), n = pts.length;
  const q = pts.map(([x, y], i) => [x + amp * hash(i, seed), y + amp * hash(i, seed + 7)]);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(q[n - 1], q[0]); p.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const m = mid(q[i], q[(i + 1) % n]); p.quadraticCurveTo(q[i][0], q[i][1], m[0], m[1]); }
  p.closePath();
  return p;
}
/** 带棱角的多边形：边上加点抖动，角保持尖 */
export function poly(pts, seed, amp = 1.2, step = 28) {
  const p = new Path2D();
  let k = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let j = 0; j < n; j++, k++) {
      const x = lerp(x0, x1, j / n) + (j ? amp * hash(k, seed) : 0), y = lerp(y0, y1, j / n) + (j ? amp * hash(k, seed + 7) : 0);
      k ? p.lineTo(x, y) : p.moveTo(x, y);
    }
  });
  p.closePath();
  return p;
}
export function ellipsePts(cx, cy, rx, ry, n = 22) {
  return Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
}
export function rrectPts(x, y, w, h, r) {
  const pts = [];
  const corner = (cx, cy, a0) => { for (let i = 0; i <= 3; i++) { const a = a0 + i / 3 * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  const side = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 30)); for (let i = 1; i < n; i++) pts.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); };
  corner(x + w - r, y + r, -Math.PI / 2); side(x + w, y + r, x + w, y + h - r);
  corner(x + w - r, y + h - r, 0); side(x + w - r, y + h, x + r, y + h);
  corner(x + r, y + h - r, Math.PI / 2); side(x, y + h - r, x, y + r);
  corner(x + r, y + r, Math.PI); side(x + r, y, x + w - r, y);
  return pts;
}

export function makeBuddy(ctx, { path, acts = [], seed = 5, blinkSeed = 11 } = {}, design) {
  const SHADOW = pencilShadow(seed * 17 + 3);
  const PAT = {}, COL = design.tex;
  Object.keys(COL).forEach((k, i) => { PAT[k] = ctx.createPattern(crayonTex(COL[k], seed * 131 + 7 + i * 53), 'repeat'); });

  // 眨眼时刻：每 2.2–4 秒一次，偶尔连眨两下
  const blinks = [];
  { const r = mulberry32(blinkSeed); let tb = 0.8 + r() * 1.5; while (tb < 600) { blinks.push(tb); if (r() < 0.18) blinks.push(tb + 0.28); tb += 2.2 + r() * 1.8; } }

  const at = (v, t) => (typeof v === 'function' ? v(t) : v);
  const env = (t, t0, t1, a = 0.25, b = 0.25) => clamp((t - t0) / a) * (1 - clamp((t - (t1 - b)) / b)) * (t < t1 ? 1 : 0);

  // ↓↓↓ where / state 与 box-buddy.js 保持一致（改那边时这里同步） ↓↓↓
  function where(t) {
    const ks = path;
    if (t <= ks[0][0]) return { x: ks[0][1], y: ks[0][2], s: ks[0][3] ?? 1, dist: 0, moving: 0, dir: 0 };
    let dist = 0;
    for (let i = 1; i < ks.length; i++) {
      const [t0, x0, y0, s0 = 1] = ks[i - 1], [t1, x1, y1, s1 = 1] = ks[i];
      const L = Math.hypot(x1 - x0, y1 - y0);
      if (t < t1) {
        const u = (t - t0) / (t1 - t0), p = eio(u);
        const moving = L > 1 ? Math.sin(Math.PI * clamp(u)) ** 0.5 : 0;
        return { x: lerp(x0, x1, p), y: lerp(y0, y1, p), s: lerp(s0, s1, p), dist: dist + L * p, moving, dir: Math.sign(x1 - x0) };
      }
      dist += L;
    }
    const l = ks[ks.length - 1];
    return { x: l[1], y: l[2], s: l[3] ?? 1, dist, moving: 0, dir: 0 };
  }

  function state(t) {
    const w = where(t);
    const st = {
      x: w.x, y: w.y, s: w.s, dir: w.dir, walk: w.moving, phase: w.dist / 34,
      tilt: 0, dy: 0, sqx: 1, sqy: 1, blink: 0, eyeS: 1, lookX: w.dir * 0.8, lookY: 0,
      handL: [0, 0], handR: [0, 0], thumbL: 0, thumbR: 0, knife: null, question: 0, exclaim: 0, halfLid: 0,
    };
    st.dy -= Math.abs(Math.sin(st.phase * Math.PI)) * 7 * st.walk;
    st.tilt += Math.sin(st.phase * Math.PI) * 2.5 * st.walk;
    for (const tb of blinks) { if (t >= tb && t < tb + 0.16) st.blink = Math.max(st.blink, Math.sin(Math.PI * (t - tb) / 0.16)); if (tb > t) break; }

    const bodyCx = () => st.x, handY = () => st.y - (LEG_H + BODY_H * 0.45) * st.s;
    for (const a of acts) {
      const t1 = a.t1 ?? a.t0 + 1.2;
      if (t < a.t0 - 0.3 || t > t1 + 0.6) continue;
      switch (a.type) {
        case 'question': {
          const e = env(t, a.t0, t1, 0.3, 0.3);
          st.tilt += 11 * eBack(Math.min(1, e));
          st.question = Math.max(st.question, e);
          st.lookY -= 3 * e; st.lookX += 1.5 * e;
          break;
        }
        case 'look': {
          const e = env(t, a.t0, t1, 0.2, 0.2);
          const [tx, ty] = at(a.at, t);
          const dx = tx - st.x, dy = ty - (st.y - 100 * st.s), L = Math.hypot(dx, dy) || 1;
          st.lookX = lerp(st.lookX, 5 * dx / L, e); st.lookY = lerp(st.lookY, 4 * dy / L, e);
          break;
        }
        case 'point': {
          const e = eio(env(t, a.t0, t1, 0.28, 0.3));
          const [tx, ty] = at(a.at, t);
          const hand = a.hand ?? (tx < st.x ? 'l' : 'r');
          const hx = bodyCx() + (hand === 'l' ? -1 : 1) * (BODY_W / 2 + 12) * st.s, hy = handY();
          const dx = tx - hx, dy = ty - hy, L = Math.hypot(dx, dy) || 1;
          const reach = Math.min(70, L * 0.5) + 5 * Math.sin((t - a.t0) * 9) * (t > a.t0 + 0.3 ? 1 : 0);
          const off = [dx / L * reach * e, dy / L * reach * e - 10 * e];
          if (hand === 'l') st.handL = off; else st.handR = off;
          st.tilt += (hand === 'l' ? -4 : 4) * e;
          st.lookX = lerp(st.lookX, 5 * dx / L, e); st.lookY = lerp(st.lookY, 4 * dy / L, e);
          break;
        }
        case 'knife': {
          const e = eio(env(t, a.t0, t1, 0.3, 0.3));
          if (e <= 0) break;
          const [tx, ty] = at(a.at, t);
          const hx = bodyCx() + (BODY_W / 2 + 12) * st.s, hy = handY();
          const dx = tx - hx, dy = ty - hy, L = Math.hypot(dx, dy) || 1;
          const reach = Math.min(60, L * 0.35) * e;
          st.handR = [dx / L * reach, dy / L * reach - 14 * e];
          st.knife = { ang: Math.atan2(dy, dx), e };
          st.tilt += -3 * e;
          st.lookX = lerp(st.lookX, 5 * dx / L, e); st.lookY = lerp(st.lookY, 4 * dy / L, e);
          break;
        }
        case 'startle': {
          const u = t - a.t0;
          if (u < 0 || u > 1.6) break;
          const jump = u < 0.55 ? Math.sin(Math.PI * u / 0.55) : 0;
          st.dy -= 70 * jump;
          const land = u > 0.55 && u < 0.85 ? Math.sin(Math.PI * (u - 0.55) / 0.3) : 0;
          st.sqx *= 1 + 0.12 * land - 0.06 * jump; st.sqy *= 1 - 0.12 * land + 0.08 * jump;
          const wide = clamp(u / 0.08) * (1 - clamp((u - 1.1) / 0.5));
          st.eyeS = 1 + 0.4 * wide;
          st.blink = st.blink * (1 - wide);
          st.exclaim = Math.max(st.exclaim, clamp(u / 0.1) * (1 - clamp((u - 1.1) / 0.4)));
          const up = clamp(u / 0.12) * (1 - clamp((u - 0.9) / 0.5));
          st.handL = [st.handL[0] - 14 * up, st.handL[1] - 46 * up];
          st.handR = [st.handR[0] + 14 * up, st.handR[1] - 46 * up];
          st.tilt += -4 * Math.sin(u * 30) * Math.exp(-u * 4);
          break;
        }
        case 'nod': {
          const n = a.n ?? 2, dur = 0.36 * n, u = (t - a.t0) / dur;
          if (u < 0 || u > 1) break;
          const k = Math.sin(Math.PI * u * n) ** 2;
          st.dy += 6 * k; st.sqy *= 1 - 0.07 * k; st.sqx *= 1 + 0.04 * k; st.lookY += 5 * k; st.blink = Math.max(st.blink, 0.35 * k);
          break;
        }
        case 'shake': {
          const e = env(t, a.t0, t1, 0.15, 0.2);
          const sw = Math.sin((t - a.t0) * 13);
          st.lookX = lerp(st.lookX, 5 * sw, e); st.tilt += 3.5 * sw * e;
          break;
        }
        case 'droop': {
          const e = eio(env(t, a.t0, t1, 0.35, 0.35));
          st.sqy *= 1 - 0.1 * e; st.sqx *= 1 + 0.05 * e; st.halfLid = Math.max(st.halfLid, 0.5 * e); st.lookY += 3 * e;
          st.handL = [st.handL[0], st.handL[1] + 10 * e]; st.handR = [st.handR[0], st.handR[1] + 10 * e];
          break;
        }
        case 'thumbs': {
          const e = eBack(clamp(eio(env(t, a.t0, t1, 0.3, 0.3))));
          const hand = a.hand ?? 'r';
          const off = [(hand === 'l' ? -1 : 1) * 16 * e, -62 * e];
          if (hand === 'l') { st.handL = off; st.thumbL = clamp(e); } else { st.handR = off; st.thumbR = clamp(e); }
          st.tilt += (hand === 'l' ? -3 : 3) * e;
          break;
        }
        case 'hop': {
          const u = (t - a.t0) / 0.42;
          if (u < 0 || u > 1) break;
          st.dy -= 34 * Math.sin(Math.PI * u);
          break;
        }
      }
    }
    return st;
  }
  // ↑↑↑ 与 box-buddy.js 一致的部分到此为止 ↑↑↑

  function draw(t, o = {}) {
    const st = state(t);
    const boil = Math.floor(t * 8) % 4;
    const alpha = o.alpha ?? 1;
    if (alpha <= 0) return st;
    const bodyBottom = -LEG_H + st.dy;

    /* 给 design 用的画笔 */
    const fill = (p, key, shadow = false) => {
      if (shadow) {
        ctx.save();
        ctx.shadowColor = 'rgba(70,48,25,0.28)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 8;
        ctx.fillStyle = COL[key]; ctx.fill(p);
        ctx.restore();
      }
      ctx.fillStyle = PAT[key]; ctx.fill(p);
    };
    const ink = (p, lw = 4.4, col = OUT) => { ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(p); };
    /** 身体坐标（原点在身体底边中点，已含歪头和挤压）→ 小人局部坐标：手臂的肩膀用它定位 */
    const bodyPt = (x, y) => {
      const a = st.tilt * RAD, sx = x * st.sqx, sy = y * st.sqy;
      return [sx * Math.cos(a) - sy * Math.sin(a), bodyBottom + sx * Math.sin(a) + sy * Math.cos(a)];
    };
    /** 短腿：走路时交替抬起（和方块小人同一套相位） */
    const stubLegs = (xs, w, key, cap) => xs.forEach((lx, i) => {
      const ph = st.phase * Math.PI + (i % 2 ? Math.PI : 0);
      const lift = Math.max(0, Math.sin(ph)) * 12 * st.walk, swing = Math.cos(ph) * 6 * st.walk;
      const top = bodyBottom - 6, bottom = Math.min(0, -lift + (st.dy < 0 ? st.dy * 0.6 : 0));
      const h = Math.max(18, bottom - top);
      const p = blob(rrectPts(lx - w / 2 + swing, top, w, h, w * 0.42), 40 + i * 5 + boil * 3, 1);
      fill(p, key); ink(p, 3.6);
      if (cap) cap(lx + swing, top + h, i);
    });
    const mitt = (hx, hy, r, key, sd) => { const p = blob(ellipsePts(hx, hy, r, r * 0.94, 14), sd + boil * 3, 1); fill(p, key); ink(p, 3.6); return p; };
    const nub = (x, y, w, h, key, sd) => { const p = blob(rrectPts(x - w / 2, y - h, w, h + 4, w * 0.45), sd + boil * 3, 0.8); fill(p, key); ink(p, 3.2); };
    const arm = (from, to, key, w = 9) => {
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]);
      ctx.lineWidth = w + 6; ctx.strokeStyle = OUT; ctx.stroke();
      ctx.lineWidth = w; ctx.strokeStyle = COL[key]; ctx.stroke();
    };
    /** 椭圆黑眼睛 + 圆高光；眨眼 / 半闭 / 瞪大 / 视线都读 st */
    const ovalEyes = ({ dx, y, rx = 10, ry = 15, cx = 0, col = '#1D1512' }) => {
      const open = (1 - st.blink) * (1 - st.halfLid), ey = y + st.lookY;
      for (const side of [-1, 1]) {
        const ex = cx + side * dx + st.lookX, w = rx * st.eyeS, h = Math.max(1.8, ry * st.eyeS * open);
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(ex, ey + (1 - open) * 4, w, h, 0, 0, Math.PI * 2); ctx.fill();
        if (open > 0.4) { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + w * 0.3, ey - h * 0.42, 3.4 * st.eyeS, 0, Math.PI * 2); ctx.fill(); }
      }
    };
    const d = { ctx, st, t, boil, bodyBottom, COL, PAT, fill, ink, bodyPt, stubLegs, mitt, nub, arm, ovalEyes };

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(st.x, st.y);
    ctx.scale(st.s, st.s);

    // 地面：铅笔排线阴影（跳起时变小变淡）
    const air = clamp(-st.dy / 90);
    ctx.save();
    ctx.globalAlpha *= 0.9 - 0.5 * air;
    const sw = (design.shadowW ?? BODY_W + 70) * (1 - 0.3 * air);
    ctx.drawImage(SHADOW, -sw / 2, -14, sw, 36);
    ctx.restore();

    design.legs(d);

    // 身子：整体绕底边中点歪头、挤压
    ctx.save();
    ctx.translate(0, bodyBottom);
    ctx.rotate(st.tilt * RAD);
    ctx.scale(st.sqx, st.sqy);
    design.body(d);
    ctx.restore();

    // 手：静止位置与方块小人相同
    const hy0 = bodyBottom - BODY_H * 0.45;
    for (const [side, [ox, oy], thumb] of [[-1, st.handL, st.thumbL], [1, st.handR, st.thumbR]]) {
      const hx = side * (BODY_W / 2 + 12) + ox, hy = hy0 + oy;
      design.hand(d, side, hx, hy, thumb);
      if (side === 1 && st.knife) {
        const { ang, e } = st.knife;
        ctx.save();
        ctx.translate(hx, hy); ctx.rotate(ang); ctx.scale(e, e);
        const blade = new Path2D();
        blade.moveTo(18, -13); blade.lineTo(118, -8); blade.quadraticCurveTo(140, -2, 146, 4); blade.lineTo(18, 11); blade.closePath();
        ctx.save(); ctx.shadowColor = 'rgba(70,48,25,0.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 5;
        ctx.fillStyle = '#E3E1DC'; ctx.fill(blade); ctx.restore();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(24, -9, 90, 4);
        ctx.lineWidth = 3.2; ctx.strokeStyle = OUT; ctx.stroke(blade);
        ctx.fillStyle = '#8A5A36';
        ctx.beginPath(); ctx.roundRect(-18, -10, 38, 20, 5); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // 头顶的问号 / 惊叹线
    const top = bodyBottom + design.headTop * st.sqy;
    if (st.question > 0.01) {
      const q = eBack(clamp(st.question));
      ctx.save();
      ctx.translate(design.qx ?? 58, top - 58 - 6 * Math.sin(t * 5));
      ctx.rotate(12 * RAD); ctx.scale(q, q);
      ctx.font = '800 76px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E0533A'; ctx.fillText('?', 3, 3);
      ctx.fillStyle = '#1E1B18'; ctx.fillText('?', 0, 0);
      ctx.restore();
    }
    if (st.exclaim > 0.01) {
      ctx.save();
      ctx.translate(0, top - 16);
      ctx.strokeStyle = '#1E1B18'; ctx.lineCap = 'round'; ctx.lineWidth = 6;
      const k = eo3(clamp(st.exclaim));
      for (const a of [-130, -90, -50]) {
        const r0 = 20 + 10 * k, r1 = r0 + 34 * k;
        ctx.beginPath(); ctx.moveTo(Math.cos(a * RAD) * r0, Math.sin(a * RAD) * r0); ctx.lineTo(Math.cos(a * RAD) * r1, Math.sin(a * RAD) * r1); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
    return st;
  }

  return { draw, state };
}
