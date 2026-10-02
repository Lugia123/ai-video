// 【另存】#1009 骨骼纸偶版：已被整图切换版 paper-girl.js 取代（用户觉得手不自然）。保留备查，勿删。
// 讲解员（#1009）：MV 女孩的 Q 版纸片人（2 头身·纸剪拼贴），骨骼纸偶 + 换脸片表情。调用方式同 box-buddy.js：
//
//   import { createBuddy } from '../../assets/lib/paper-girl.js';   // 模块加载时会等部件图片解码完
//   const buddy = createBuddy(ctx, {
//     path: [[t, x, y, s], ...],            // 站位关键帧（y 是脚底所在的地面）；两帧之间移动时自动迈腿
//     acts: [{ type: 'point', t0, t1, at: [x, y] }, ...],
//   });
//   buddy.draw(t);                          // 画在当前 ctx 变换下
//   buddy.state(t)                          // 位置、手的位置（handL / handR，画布坐标）、头顶……
//
// acts（与 box-buddy.js 同名同参数）：
//   question {t0,t1}  耸肩摊手 + 歪头 + 疑惑脸 + 头顶问号      point  {t0,t1,at,hand}  伸手、食指指向 at
//   knife    {t0,t1,at} 握纸刀比划                              startle {t0}           跳起、双手举起、吃惊脸、惊叹线
//   nod      {t0,n}    点头 n 下                                shake  {t0,t1}         摇头
//   droop    {t0,t1}   垂手、身子一沉、泄气脸                   thumbs {t0,t1,hand}    举拳点赞 + 笑眯眼
//   look     {t0,t1,at} 眼睛看向 at                             hop    {t0}            开心地小跳
// 另有两个本角色才有的：
//   blank    {t0,t1}   豆豆眼放空（发呆 / 无语）                talk   {t0,t1}         口型开合（说话）
// 眨眼按种子自动发生；画面是 t 的纯函数。
// 部件：assets/characters/girl-q/puppet/（tools/layers/puppet.py 拆出，脸片 / 手型变体见 _work/variants.py）。

import { loadPuppet, lerpPose } from './puppet.js';
import { clamp, lerp, eo3, eio, eBack, hash, mulberry32, RAD } from './paper-kit.js';

const P = await loadPuppet(new URL('../characters/girl-q/puppet/puppet.json', import.meta.url).href);
const K = 0.3;                                  // 纸偶画布像素 → 小人坐标（s=1 时约 240px 高）
const J = P.data.joints;
const HEAD_TOP = 22;                            // 画布里头顶（护目镜上沿）的 y
const SHOULDER_L = J.shoulder_l, SHOULDER_R = J.shoulder_r;

// 静止姿势：手臂垂在身侧、肘部微弯
const REST = { arm_up_l: -74, arm_lo_l: -10, arm_up_r: 74, arm_lo_r: 10 };
const norm = a => ((a + 540) % 360) - 180;

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

export function createBuddy(ctx, { path, acts = [], seed = 5, blinkSeed = 11 } = {}) {
  const SHADOW = pencilShadow(seed * 17 + 3);
  const OFF = document.createElement('canvas'), RIM = document.createElement('canvas'), CUT = document.createElement('canvas');
  const blinks = [];
  { const r = mulberry32(blinkSeed); let tb = 0.8 + r() * 1.5; while (tb < 600) { blinks.push(tb); if (r() < 0.18) blinks.push(tb + 0.3); tb += 2.2 + r() * 1.8; } }

  const at = (v, t) => (typeof v === 'function' ? v(t) : v);
  const env = (t, t0, t1, a = 0.25, b = 0.25) => clamp((t - t0) / a) * (1 - clamp((t - (t1 - b)) / b)) * (t < t1 ? 1 : 0);

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

  /** 世界坐标的目标 → 纸偶画布坐标（不含身体的跳跃 / 挤压，够指向用了） */
  const toCanvas = (st, [tx, ty]) => [P.footX + (tx - st.x) / (st.s * K), P.footY + (ty - st.y) / (st.s * K)];
  /** 让某侧整条手臂（上臂 + 前臂）指向画布里的点：返回 [上臂角, 前臂角] */
  function aim(side, [cx, cy], bend = 0) {
    const sh = side === 'l' ? SHOULDER_L : SHOULDER_R;
    const phi = Math.atan2(cy - sh[1], cx - sh[0]) / RAD;          // 画面角度，顺时针为正
    const up = side === 'l' ? norm(phi - 180) : norm(phi);
    return [up - bend * (side === 'l' ? -1 : 1), bend * (side === 'l' ? -1 : 1)];
  }

  function state(t) {
    const w = where(t);
    const st = {
      x: w.x, y: w.y, s: w.s, dir: w.dir, walk: w.moving, phase: w.dist / 46,
      pose: { ...REST, root: [0, 0], squash: 0 }, face: 'idle', faceW: 0, hands: { l: 'open', r: 'open' },
      blink: 0, question: 0, exclaim: 0, knife: null, dy: 0, front: null,
    };
    const pose = st.pose;
    // 走路：两腿前后摆、手臂反向摆、身体上下颠
    const ph = st.phase * Math.PI;
    // 正面走路：两条腿轮流往外踢一下（纸偶腿不能抬，只能转）
    pose.leg_l = -11 * Math.max(0, Math.sin(ph)) * st.walk; pose.leg_r = 11 * Math.max(0, -Math.sin(ph)) * st.walk;
    pose.arm_up_l += 14 * Math.sin(ph) * st.walk; pose.arm_up_r += 14 * Math.sin(ph) * st.walk;
    pose.root[1] -= Math.abs(Math.cos(ph)) * 14 * st.walk;
    pose.pelvis = 3 * Math.sin(ph) * st.walk;
    // 呼吸：头和身子极轻地晃
    pose.head = 1.2 * Math.sin(t * 1.7);
    for (const tb of blinks) { if (t >= tb && t < tb + 0.16) st.blink = 1; if (tb > t) break; }

    // 表情按优先级：数值大的覆盖小的（只有 e > 0.5 才换脸，避免半路闪）
    const want = (name, e, pri) => { if (e > 0.5 && pri >= st.faceW) { st.face = name; st.faceW = pri; } };
    const blend = (target, e) => { if (e <= 0) return; const q = lerpPose(pose, { ...pose, ...target, root: [pose.root[0] + (target.root?.[0] ?? 0), pose.root[1] + (target.root?.[1] ?? 0)] }, e); Object.assign(pose, q); };

    for (const a of acts) {
      const t1 = a.t1 ?? a.t0 + 1.2;
      if (t < a.t0 - 0.3 || t > t1 + 0.8) continue;
      switch (a.type) {
        case 'look': {
          const e = env(t, a.t0, t1, 0.2, 0.2);
          const [tx] = at(a.at, t);
          want(tx < st.x ? 'lookL' : 'lookR', e, 1);
          blend({ head: (tx < st.x ? -4 : 4) }, e);
          break;
        }
        case 'point': {
          const e = eio(env(t, a.t0, t1, 0.3, 0.3));
          if (e <= 0) break;
          const tgt = at(a.at, t), [cx, cy] = toCanvas(st, tgt);
          const side = a.hand ?? (tgt[0] < st.x ? 'l' : 'r');
          const [up, lo] = aim(side, [cx, cy]);
          const jab = 3 * Math.sin((t - a.t0) * 9) * (t > a.t0 + 0.3 ? 1 : 0);
          blend({ [`arm_up_${side}`]: up + jab, [`arm_lo_${side}`]: lo, head: side === 'l' ? -5 : 5, torso: side === 'l' ? -3 : 3 }, e);
          if (e > 0.4) st.hands[side] = 'point';
          if (e > 0.2) st.front = side;             // 手臂抬起时会钻到大头后面：指的那只手画到头前面
          want(side === 'l' ? 'lookL' : 'lookR', e, 2);
          break;
        }
        case 'knife': {
          const e = eio(env(t, a.t0, t1, 0.3, 0.3));
          if (e <= 0) break;
          const tgt = at(a.at, t), [cx, cy] = toCanvas(st, tgt);
          const [up, lo] = aim('r', [cx, cy], 25);
          blend({ arm_up_r: up, arm_lo_r: lo, torso: -3, head: 4 }, e);
          if (e > 0.4) st.hands.r = 'point';
          if (e > 0.2) st.front = 'r';
          st.knife = { e, ang: Math.atan2(cy - SHOULDER_R[1], cx - SHOULDER_R[0]) };
          want('lookR', e, 2);
          break;
        }
        case 'question': {
          const e = env(t, a.t0, t1, 0.3, 0.3);
          // 耸肩摊手：上臂垂下、前臂向外平伸
          blend({ arm_up_l: -55, arm_lo_l: 62, arm_up_r: 55, arm_lo_r: -62, head: 13 * eBack(Math.min(1, e)) - pose.head, torso: 2 }, e);
          st.question = Math.max(st.question, e);
          want('question', e, 3);
          break;
        }
        case 'startle': {
          const u = t - a.t0;
          if (u < 0 || u > 1.7) break;
          const jump = u < 0.55 ? Math.sin(Math.PI * u / 0.55) : 0;
          pose.root[1] -= 240 * jump;
          const land = u > 0.55 && u < 0.85 ? Math.sin(Math.PI * (u - 0.55) / 0.3) : 0;
          pose.squash += 0.1 * land - 0.06 * jump;
          const up = clamp(u / 0.12) * (1 - clamp((u - 0.95) / 0.55));
          // 双手张开举在头两侧（手掌在头发外沿，不挡脸）
          blend({ arm_up_l: 22, arm_lo_l: 46, arm_up_r: -22, arm_lo_r: -46, leg_l: 10, leg_r: -10 }, eo3(up));
          pose.head += -5 * Math.sin(u * 30) * Math.exp(-u * 4);
          st.exclaim = Math.max(st.exclaim, clamp(u / 0.1) * (1 - clamp((u - 1.1) / 0.4)));
          want('surprised', clamp(u / 0.06) * (1 - clamp((u - 1.2) / 0.3)), 6);
          break;
        }
        case 'nod': {
          const n = a.n ?? 2, dur = 0.36 * n, u = (t - a.t0) / dur;
          if (u < 0 || u > 1) break;
          const k = Math.sin(Math.PI * u * n) ** 2;
          pose.root[1] += 10 * k; pose.squash += 0.05 * k;
          want('happy', Math.sin(Math.PI * u) + 0.4, 2);
          break;
        }
        case 'shake': {
          const e = env(t, a.t0, t1, 0.15, 0.2);
          const sw = Math.sin((t - a.t0) * 13);
          pose.head += 9 * sw * e; pose.torso = (pose.torso ?? 0) + 2 * sw * e;
          want('droop', e, 2);
          break;
        }
        case 'droop': {
          const e = eio(env(t, a.t0, t1, 0.4, 0.35));
          blend({ arm_up_l: -86, arm_lo_l: 0, arm_up_r: 86, arm_lo_r: 0, head: 7 - pose.head, root: [0, 12], torso: 2 }, e);
          pose.squash += 0.05 * e;
          want('droop', e, 5);
          break;
        }
        case 'thumbs': {
          const e = eio(env(t, a.t0, t1, 0.3, 0.3));
          const side = a.hand === 'l' ? 'l' : 'r', sg = side === 'l' ? -1 : 1;
          // 举拳到肩旁：上臂斜向下、前臂向上翻，拳头的大拇指朝上
          blend({ [`arm_up_${side}`]: 32 * sg, [`arm_lo_${side}`]: -62 * sg, head: 5 * sg, torso: 2 * sg }, eBack(clamp(e)));
          if (e > 0.4) st.hands[side] = 'thumbs';
          want('happy', e, 4);
          break;
        }
        case 'hop': {
          const u = (t - a.t0) / 0.42;
          if (u < 0 || u > 1) break;
          pose.root[1] -= 110 * Math.sin(Math.PI * u);
          blend({ leg_l: 8, leg_r: -8, arm_up_l: -50, arm_up_r: 50 }, Math.sin(Math.PI * u));
          want('happy', Math.sin(Math.PI * u) + 0.2, 4);
          break;
        }
        case 'blank': {
          const e = env(t, a.t0, t1, 0.1, 0.1);
          want('blank', e, 7);
          break;
        }
        case 'talk': {
          if (t < a.t0 || t >= t1) break;
          // 口型：每 0.11 秒按哈希在 张大 / 半张 / 闭 之间换，句尾闭嘴
          const k = Math.floor((t - a.t0) / 0.11), r = hash(k, 977);
          want(t > t1 - 0.12 ? 'idle' : r > 0.25 ? 'talkA' : r > -0.45 ? 'talkH' : 'idle', 1, 1.5);
          break;
        }
      }
    }
    // 眨眼只在睁眼的脸上发生
    if (st.blink && ['idle', 'lookL', 'lookR', 'talkH', 'talkA'].includes(st.face) && st.faceW < 3) st.face = 'blink';
    st.dy = pose.root[1] * K;
    return st;
  }

  function draw(t, o = {}) {
    const st = state(t);
    const alpha = o.alpha ?? 1;
    if (alpha <= 0) return st;
    const pose = { ...st.pose, swap: { face: st.face, arm_lo_l: st.hands.l, arm_lo_r: st.hands.r } };
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(st.x, st.y);
    ctx.scale(st.s, st.s);

    // 地面：铅笔排线阴影（跳起时变小变淡）
    const air = clamp(-st.dy / 90);
    ctx.save();
    ctx.globalAlpha *= 0.9 - 0.5 * air;
    const sw = 200 * (1 - 0.3 * air);
    ctx.drawImage(SHADOW, -sw / 2, -14, sw, 36);
    ctx.restore();

    // 纸偶先画进离屏画布，再按整个剪影描一圈白纸边 + 浅灰剪痕，最后整张投一个纸片影子：
    // 部件各自的白边已在拆件时去掉（_work/variants.py），所以任何姿势外轮廓都是一张完整的纸。
    const S = st.s, BX = 270, BY = 400, BW = 540, BH = 440;           // 小人坐标里的离屏范围（脚底为原点）
    const w = Math.ceil(BW * S), h = Math.ceil(BH * S);
    for (const c of [OFF, RIM, CUT]) if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    const g = OFF.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h);
    g.setTransform(S, 0, 0, S, BX * S, BY * S);
    g.shadowColor = 'rgba(70,48,25,0.22)'; g.shadowBlur = 5 * S; g.shadowOffsetX = 2 * S; g.shadowOffsetY = 3 * S;   // 部件之间的薄纸叠影
    // 部件按 z 画；要把某只手臂提到头前面时，临时改 P.parts 的顺序（同一个数组，画完还原）
    // 自动判断：某只手臂的肘 / 前臂 / 手只要有一点落进头（含头发）的范围，就整条提到头前面。
    // 这样任何 act 和过渡中间帧里，抬起来的手都不会被大头盖住。
    const order = P.parts.slice();
    const Mw = P.world(pose);
    const tf = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    const inHead = ([x, y]) => ((x - 640) / 212) ** 2 + ((y - 196) / 190) ** 2 < 1;
    const front = new Set(st.front ? [st.front] : []);
    for (const sd of ['l', 'r']) {
      const lo = Mw[`arm_lo_${sd}`], el = J[`elbow_${sd}`], wr = J[`wrist_${sd}`], hd = J[`hand_${sd}`];
      const pts = [el, [(el[0] + wr[0]) / 2, el[1]], wr, [(wr[0] + hd[0]) / 2, wr[1] - 40], hd].map(q => tf(lo, q));
      if (pts.some(inHead)) front.add(sd);
    }
    st.armsFront = [...front];
    if (front.size) {
      const arm = P.parts.filter(p => p.name.startsWith('arm_') && front.has(p.name.slice(-1)));
      P.parts.splice(0, P.parts.length, ...P.parts.filter(p => !arm.includes(p)), ...arm);
    }
    const { M } = P.draw(g, t, pose, { x: 0, y: 0, scale: K });
    P.parts.splice(0, P.parts.length, ...order);
    const ring = (c, r, color) => {
      const q = c.getContext('2d');
      q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, w, h);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; q.drawImage(OFF, Math.cos(a) * r, Math.sin(a) * r); }
      q.drawImage(OFF, 0, 0);
      q.globalCompositeOperation = 'source-in'; q.fillStyle = color; q.fillRect(0, 0, w, h);
    };
    ring(CUT, 6.2 * S, 'rgba(120,108,92,0.55)');
    ring(RIM, 5 * S, '#FFFDF6');
    ctx.save();
    ctx.shadowColor = 'rgba(70,48,25,0.28)'; ctx.shadowBlur = 9; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 7;
    ctx.drawImage(CUT, -BX, -BY, BW, BH);
    ctx.restore();
    ctx.drawImage(RIM, -BX, -BY, BW, BH);
    ctx.drawImage(OFF, -BX, -BY, BW, BH);

    // 纸刀：握在右手里，刀尖对着目标
    const toLocal = ([cx, cy]) => [(cx + pose.root[0] - P.footX) * K, (cy + pose.root[1] - P.footY) * K];
    const ptOf = (part, x, y) => { const m = M[part]; return toLocal([m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]); };
    if (st.knife) {
      const [hx, hy] = ptOf('arm_lo_r', J.wrist_r[0] + 44, J.wrist_r[1]);
      const { ang, e } = st.knife;
      ctx.save();
      ctx.translate(hx, hy); ctx.rotate(ang); ctx.scale(e * 0.55, e * 0.55);
      const blade = new Path2D();
      blade.moveTo(18, -13); blade.lineTo(118, -8); blade.quadraticCurveTo(140, -2, 146, 4); blade.lineTo(18, 11); blade.closePath();
      ctx.save(); ctx.shadowColor = 'rgba(70,48,25,0.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 5;
      ctx.fillStyle = '#E3E1DC'; ctx.fill(blade); ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(24, -9, 90, 4);
      ctx.lineWidth = 3.2; ctx.strokeStyle = '#3A2A20'; ctx.stroke(blade);
      ctx.fillStyle = '#8A5A36';
      ctx.beginPath(); ctx.roundRect(-18, -10, 38, 20, 5); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // 头顶的问号 / 惊叹线
    const [tx, ty] = ptOf('head', 640, HEAD_TOP);
    if (st.question > 0.01) {
      const q = eBack(clamp(st.question));
      ctx.save();
      ctx.translate(tx + 70, ty - 20 - 6 * Math.sin(t * 5));
      ctx.rotate(12 * RAD); ctx.scale(q, q);
      ctx.font = '800 76px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E0533A'; ctx.fillText('?', 3, 3);
      ctx.fillStyle = '#1E1B18'; ctx.fillText('?', 0, 0);
      ctx.restore();
    }
    if (st.exclaim > 0.01) {
      ctx.save();
      ctx.translate(tx, ty + 4);
      ctx.strokeStyle = '#1E1B18'; ctx.lineCap = 'round'; ctx.lineWidth = 6;
      const k = eo3(clamp(st.exclaim));
      for (const a of [-140, -90, -40]) {
        const r0 = 22 + 10 * k, r1 = r0 + 34 * k;
        ctx.beginPath(); ctx.moveTo(Math.cos(a * RAD) * r0, Math.sin(a * RAD) * r0); ctx.lineTo(Math.cos(a * RAD) * r1, Math.sin(a * RAD) * r1); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();

    // 手的位置（画布坐标），给举牌之类的道具对齐
    const toWorld = ([lx, ly]) => [st.x + lx * st.s, st.y + ly * st.s];
    st.handL = toWorld(ptOf('arm_lo_l', J.wrist_l[0] - 30, J.wrist_l[1]));
    st.handR = toWorld(ptOf('arm_lo_r', J.wrist_r[0] + 30, J.wrist_r[1]));
    st.headTop = toWorld([tx, ty]);
    return st;
  }

  return { draw, state };
}
