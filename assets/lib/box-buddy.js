// 方块小人讲解员（参考 assets/characters/box-buddy-reference.png）：橙色长方体身子、两只方块小手、
// 四条短腿、两只带高光的黑眼睛，蜡笔手绘质感 + 铅笔排线的地面阴影 + 纸片投影。全部用代码画。
//
//   import { createBuddy } from '../../assets/lib/box-buddy.js';
//   const buddy = createBuddy(ctx, {
//     path: [[t, x, y, s], ...],            // 站位关键帧（y 是脚底所在的地面）；两帧之间移动时自动迈腿
//     acts: [{ type: 'point', t0, t1, at: [x, y] }, ...],
//   });
//   buddy.draw(t);                          // 画在当前 ctx 变换下
//   buddy.state(t)                          // 取状态（位置、手的位置……），方便别的东西对齐
//
// acts 类型（时间单位秒；at 可以是 [x,y] 或 t => [x,y]，坐标与 path 同一坐标系）：
//   question {t0,t1}           歪头 + 头顶问号
//   point    {t0,t1,at,hand}   伸手指向（hand: 'r' | 'l'，默认按目标在哪边自动选）
//   knife    {t0,t1,at}        右手拿纸刀，刀尖对着 at 比划
//   startle  {t0}              吓一跳：跳起、眼睛瞪大、头顶惊叹线
//   nod      {t0,n}            点头 n 下
//   shake    {t0,t1}           左右摇头（眼睛左右看 + 身子轻摆）
//   droop    {t0,t1}           泄气：身子压扁、眼睛半闭
//   thumbs   {t0,t1,hand}      竖起小手（大拇指）
//   look     {t0,t1,at}        眼睛看向 at
//   hop      {t0}              开心地小跳一下
// 眨眼按种子自动发生；画面是 t 的纯函数。

import { clamp, lerp, eo3, eio, eBack, hash, mulberry32, RAD } from './paper-kit.js';

const BODY_W = 210, BODY_H = 128, LEG_H = 36, LEG_W = 27, HAND = 44;
const OUT = '#3A2A20';
const ORANGE = '#EE7A3C';

function crayonTex(seed) {
  const c = document.createElement('canvas'); c.width = 320; c.height = 220;
  const g = c.getContext('2d');
  const rnd = mulberry32(seed);
  g.fillStyle = ORANGE; g.fillRect(0, 0, c.width, c.height);
  g.lineCap = 'round';
  // 蜡笔排线：同一方向的短斜线，深浅两色，留出纸白
  for (let i = 0; i < 900; i++) {
    const x = rnd() * c.width, y = rnd() * c.height, len = 18 + rnd() * 46, a = (-58 + rnd() * 10) * RAD;
    const r = rnd();
    g.strokeStyle = r < 0.45 ? `rgba(214,92,38,${0.18 + rnd() * 0.22})` : r < 0.8 ? `rgba(248,160,104,${0.2 + rnd() * 0.25})` : `rgba(255,236,214,${0.12 + rnd() * 0.18})`;
    g.lineWidth = 1 + rnd() * 2.2;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
  }
  // 细小的纸面颗粒
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

/** 手绘描边：矩形路径上的点加抖动；boil 让线条每 1/8 秒轻轻换一次形（定格动画感） */
function wobblyRect(x, y, w, h, r, seed, amp) {
  const p = new Path2D();
  const pts = [];
  const corner = (cx, cy, a0) => { for (let i = 0; i <= 3; i++) { const a = a0 + i / 3 * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  const side = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 30)); for (let i = 1; i < n; i++) pts.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); };
  corner(x + w - r, y + r, -Math.PI / 2); side(x + w, y + r, x + w, y + h - r);
  corner(x + w - r, y + h - r, 0); side(x + w - r, y + h, x + r, y + h);
  corner(x + r, y + h - r, Math.PI / 2); side(x, y + h - r, x, y + r);
  corner(x + r, y + r, Math.PI); side(x + r, y, x + w - r, y);
  pts.forEach(([px, py], i) => {
    const jx = px + amp * hash(i, seed), jy = py + amp * hash(i, seed + 7);
    i ? p.lineTo(jx, jy) : p.moveTo(jx, jy);
  });
  p.closePath();
  return p;
}

export function createBuddy(ctx, { path, acts = [], seed = 5, blinkSeed = 11 } = {}) {
  const TEX = crayonTex(seed * 131 + 7);
  const SHADOW = pencilShadow(seed * 17 + 3);
  const pattern = ctx.createPattern(TEX, 'repeat');

  // 眨眼时刻：每 2.2–4 秒一次，偶尔连眨两下
  const blinks = [];
  { const r = mulberry32(blinkSeed); let tb = 0.8 + r() * 1.5; while (tb < 600) { blinks.push(tb); if (r() < 0.18) blinks.push(tb + 0.28); tb += 2.2 + r() * 1.8; } }

  const at = (v, t) => (typeof v === 'function' ? v(t) : v);
  const env = (t, t0, t1, a = 0.25, b = 0.25) => clamp((t - t0) / a) * (1 - clamp((t - (t1 - b)) / b)) * (t < t1 ? 1 : 0);

  // 路径：位置 + 已走过的距离（迈腿相位用）
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
    // 走路时身子上下轻颠
    st.dy -= Math.abs(Math.sin(st.phase * Math.PI)) * 7 * st.walk;
    st.tilt += Math.sin(st.phase * Math.PI) * 2.5 * st.walk;
    // 眨眼
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

  function limb(x, y, w, h, sd, boil) {
    const p = wobblyRect(x, y, w, h, 5, sd + boil * 3, 1.1);
    ctx.fillStyle = pattern; ctx.fill(p);
    ctx.lineWidth = 3.6; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.stroke(p);
  }

  function draw(t, o = {}) {
    const st = state(t);
    const boil = Math.floor(t * 8) % 4;
    const alpha = o.alpha ?? 1;
    if (alpha <= 0) return st;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(st.x, st.y);
    ctx.scale(st.s, st.s);

    // 地面：铅笔排线阴影（跳起时变小变淡）
    const air = clamp(-st.dy / 90);
    ctx.save();
    ctx.globalAlpha *= 0.9 - 0.5 * air;
    const sw = (BODY_W + 70) * (1 - 0.3 * air);
    ctx.drawImage(SHADOW, -sw / 2, -14, sw, 36);
    ctx.restore();

    // 腿：四条，走路时两两交替抬起
    const legX = [-74, -40, 40, 74];
    const bodyBottom = -LEG_H + st.dy;
    legX.forEach((lx, i) => {
      const ph = st.phase * Math.PI + (i % 2 ? Math.PI : 0);
      const lift = Math.max(0, Math.sin(ph)) * 12 * st.walk;
      const swing = Math.cos(ph) * 6 * st.walk;
      const top = bodyBottom - 6, bottom = Math.min(0, -lift + (st.dy < 0 ? st.dy * 0.6 : 0));
      limb(lx - LEG_W / 2 + swing, top, LEG_W, Math.max(18, bottom - top), 40 + i * 5, boil);
    });

    // 身子（整体绕底边中点歪头、挤压）
    ctx.save();
    ctx.translate(0, bodyBottom);
    ctx.rotate(st.tilt * RAD);
    ctx.scale(st.sqx, st.sqy);
    const bw = BODY_W, bh = BODY_H;
    const body = wobblyRect(-bw / 2, -bh, bw, bh, 9, 3 + boil * 11, 1.4);
    ctx.save();
    ctx.shadowColor = 'rgba(70,48,25,0.28)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 8;
    ctx.fillStyle = ORANGE; ctx.fill(body);
    ctx.restore();
    ctx.fillStyle = pattern; ctx.fill(body);
    // 顶面一条亮边 + 右侧一条暗边：一点点体积感
    ctx.save(); ctx.clip(body);
    ctx.fillStyle = 'rgba(255,230,200,0.22)'; ctx.fillRect(-bw / 2, -bh, bw, 12);
    ctx.fillStyle = 'rgba(150,60,20,0.16)'; ctx.fillRect(bw / 2 - 16, -bh, 16, bh);
    ctx.restore();
    ctx.lineWidth = 4.6; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.stroke(body);

    // 眼睛
    const eyeY = -bh + 50 + st.lookY, open = (1 - st.blink) * (1 - st.halfLid);
    for (const side of [-1, 1]) {
      const ex = side * 46 + st.lookX;
      const ew = 20 * st.eyeS, eh = Math.max(3, 31 * st.eyeS * open);
      ctx.fillStyle = '#1D1512';
      ctx.beginPath(); ctx.roundRect(ex - ew / 2, eyeY - eh / 2 + (1 - open) * 4, ew, eh, Math.min(8, eh / 2)); ctx.fill();
      if (open > 0.4) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(ex + ew * 0.06, eyeY - eh / 2 + 5, 6 * st.eyeS, 6 * st.eyeS); }
    }
    ctx.restore();

    // 手：身子两侧的小方块，可以伸出去
    const hy0 = bodyBottom - bh * 0.45;
    const hands = [[-1, st.handL, st.thumbL, 60], [1, st.handR, st.thumbR, 70]];
    for (const [side, [ox, oy], thumb, sd] of hands) {
      const hx = side * (bw / 2 + 12) + ox, hy = hy0 + oy;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(side * st.tilt * 0.5 * RAD);
      limb(-HAND / 2, -HAND / 2, HAND, HAND, sd, boil);
      if (thumb > 0.02) {
        const th = 26 * thumb;
        limb(-side * 6 - 7, -HAND / 2 - th + 4, 14, th + 2, sd + 3, boil);
      }
      // 刀
      if (side === 1 && st.knife) {
        const { ang, e } = st.knife;
        ctx.save();
        ctx.rotate(ang);
        ctx.scale(e, e);
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
      ctx.restore();
    }

    // 头顶的问号 / 惊叹线
    if (st.question > 0.01) {
      const q = eBack(clamp(st.question));
      ctx.save();
      ctx.translate(58, bodyBottom - bh - 58 - 6 * Math.sin(t * 5));
      ctx.rotate(12 * RAD); ctx.scale(q, q);
      ctx.font = '800 76px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E0533A'; ctx.fillText('?', 3, 3);
      ctx.fillStyle = '#1E1B18'; ctx.fillText('?', 0, 0);
      ctx.restore();
    }
    if (st.exclaim > 0.01) {
      ctx.save();
      ctx.translate(0, bodyBottom - bh - 16);
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
