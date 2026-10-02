// 讲解员（#1009）：MV 女孩的 Q 版纸片人（2 头身·纸剪拼贴）——切图版。调用方式同 box-buddy.js：
//
//   import { createBuddy } from '../../assets/lib/paper-girl.js';   // 模块加载时会等图片解码完
//   const buddy = createBuddy(ctx, {
//     path: [[t, x, y, s], ...],            // 站位关键帧（y 是脚底所在的地面）；两帧之间移动时自动换走路帧
//     acts: [{ type: 'point', t0, t1, at: [x, y] }, ...],
//   });
//   buddy.draw(t);                          // 画在当前 ctx 变换下（第二参 { alpha, force: { body, face, mirror } }）
//   buddy.state(t)                          // 位置、当前身体 / 表情……（draw 的返回值另带 hand / headTop）
//
// 不做骨骼：每个动作是一整张画好的身体（手是画好的），头单独一层、表情换图。两层按朝向分组，只许同朝向相配：
//   front（正面）：idle point question startle thumbs shake nod hop droop knife talk_open look blank
//   r34（3/4 朝右）：walk1–4；朝左走 / 指左 / 看左 / 刀朝左 / 右手点赞 = 整体镜像（头身表情一起翻）
// 叠放：后发片 → 身体 → 头 → 脸 → 前景手（举过领口线的手，画在头上面，不会被脸挡住）。
// 动感：换图时纸片轻弹一下（放大 + 小抖；createBuddy 的 pop 参数调幅度，默认 1/3，1 = 2026-10-01 最初的幅度）、
//       呼吸缩放、走路按步距换帧；头可以歪、点、晃（2D 转动，不换朝向）。
// 用法（BRIEF-calm.md）：她是配角，默认站着呼吸眨眼；一个镜头最多 1–2 个动作、落在关键词上，动作保持 ≥ 1.5 s，换姿势间隔 ≥ 3 s。
//
// acts（与 box-buddy.js 同名同参数）：look point knife question startle nod shake droop thumbs hop
// 另有：blank {t0,t1} 豆豆眼放空；talk {t0,t1} 说话（嘴开合 + 讲解手势）。眨眼按种子自动发生；画面是 t 的纯函数。
// 素材：assets/characters/girl-q/poses/out/（_work/build.py 生成）。骨骼版另存在 paper-girl-rig.js。

import { clamp, lerp, eo3, eio, eBack, hash, mulberry32, RAD } from './paper-kit.js';

const BASE = new URL('../characters/girl-q/poses/out/', import.meta.url);
const MAN = await (await fetch(new URL('manifest.json', BASE))).json();
const IMG = {};
await Promise.all([
  ...Object.values(MAN.bodies).flatMap(b => [b.file, b.fore?.file]),
  MAN.heads.front.head.file, MAN.heads.front.hairBack.file, ...Object.values(MAN.heads.front.face.states),
  MAN.heads.r34.hairBack.file, ...Object.values(MAN.heads.r34.states).map(s => s.file),
].filter(Boolean).map(f => new Promise((res, rej) => { const im = new Image(); im.onload = () => { IMG[f] = im; res(); }; im.onerror = () => rej(new Error(`读不到 ${f}`)); im.src = new URL(f, BASE).href; })));

const K = 0.3;                                 // 原图像素 → 小人坐标（s=1 时约 240px 高）
const FOOT = MAN.bodies.idle.foot;             // 站着时脖子到脚底
// 拳头 / 指尖在身体图里的位置（相对脖子，原图像素；镜像时 x 取反），给举牌之类的道具对齐
const HANDS = { thumbs: [-66, 74], point: [190, -150], idle: [-110, 150] };

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

// 每个动作：身体图、表情、优先级（同时有多个 act 时大的赢）
const ACT = {
  point: { body: 'point', face: 'lookR', pri: 3 },
  knife: { body: 'knife', face: 'idle', pri: 3 },
  question: { body: 'question', face: 'question', pri: 4 },
  startle: { body: 'startle', face: 'surprised', pri: 7 },
  thumbs: { body: 'thumbs', face: 'happy', pri: 5 },
  shake: { body: 'shake', face: 'question', pri: 4 },
  nod: { body: 'nod', face: 'blink', pri: 2 },
  hop: { body: 'hop', face: 'happy', pri: 6 },
  droop: { body: 'droop', face: 'droop', pri: 5 },
  blank: { body: 'blank', face: 'blank', pri: 6 },
  talk: { body: 'talk_open', face: 'talk', pri: 1 },
  look: { body: 'look', face: 'look', pri: 1 },
};

export function createBuddy(ctx, { path, acts = [], seed = 5, blinkSeed = 11, pop: popAmp = 1 / 3 } = {}) {
  const SHADOW = pencilShadow(seed * 17 + 3);
  const OFF = document.createElement('canvas'), RIM = document.createElement('canvas'), CUT = document.createElement('canvas');
  const blinks = [];
  { const r = mulberry32(blinkSeed); let tb = 0.8 + r() * 1.5; while (tb < 600) { blinks.push(tb); if (r() < 0.18) blinks.push(tb + 0.3); tb += 2.2 + r() * 1.8; } }
  const at = (v, t) => (typeof v === 'function' ? v(t) : v);

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
  /** 一段动作的时间窗（换图就在两端发生） */
  const span = a => [a.t0, a.t1 ?? a.t0 + ({ startle: 1.3, hop: 0.6, nod: 0.36 * (a.n ?? 2) + 0.15 }[a.type] ?? 1.2)];
  // 所有换图时刻（走路起止也算），用来做「纸片弹一下」
  const switches = [];
  for (const a of acts) { const [t0, t1] = span(a); switches.push(t0, t1); }
  for (let i = 1; i < path.length; i++) if (Math.hypot(path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]) > 1) switches.push(path[i - 1][0] + 0.08, path[i][0] - 0.08);

  function state(t) {
    const w = where(t);
    const st = {
      x: w.x, y: w.y, s: w.s, dir: w.dir, walk: w.moving,
      body: 'idle', face: 'idle', mirror: false, pri: 0,
      dy: 0, sx: 1, sy: 1, rot: 0, headRot: 0, headDy: 0,
      blink: 0, question: 0, exclaim: 0,
    };
    // 走路：3/4 朝右的四帧按步距轮换，朝左整体镜像
    if (w.moving > 0.25) {
      // 一帧 = 走 40 小人像素（随缩放）：四帧一个循环 ≈ 两步，步幅和腿长相称，不会像滑步
      const ph = w.dist / (40 * w.s);
      st.body = `walk${1 + Math.floor(ph) % 4}`; st.mirror = w.dir < 0;
      st.dy -= Math.abs(Math.sin(ph * Math.PI)) * 7;
    }
    for (const tb of blinks) { if (t >= tb && t < tb + 0.14) st.blink = 1; if (tb > t) break; }

    for (const a of acts) {
      const [t0, t1] = span(a), A = ACT[a.type];
      if (!A || t < t0 || t >= t1 || A.pri < st.pri) continue;
      const u = t - t0;
      st.body = A.body; st.face = A.face; st.pri = A.pri; st.mirror = false;
      switch (a.type) {
        case 'point': case 'knife': case 'look': {
          const [tx] = at(a.at, t);
          st.mirror = tx < st.x;
          if (a.type === 'point') st.rot += 1.5 * Math.sin(u * 9) * (u > 0.2 ? 1 : 0);
          // 纸刀：整只往目标方向一推一收地比划（以脚底为轴摆 ±3°）
          if (a.type === 'knife') st.rot += 3 * Math.sin(u * 7) * clamp(u / 0.3);   // 镜像时画布已翻，不用取反
          if (a.type === 'look') {
            // 朝左看 = 朝右看整体镜像（头、身体、表情一起翻，和 point ← 一样），不单换「看左」脸片
            st.face = 'lookR';
            // 看东西时头歪向那边，并慢慢晃（切图版没有转眼珠，靠这个避免定格）；镜像时画布已翻，角度不用取反
            st.headRot = (4 + 2.5 * Math.sin(u * 2.4)) * clamp(u / 0.3);
          }
          break;
        }
        case 'thumbs': st.mirror = a.hand === 'r'; break;   // 图里是画面左侧那只手点赞
        case 'question': st.headRot = 9 * eBack(clamp(u / 0.3)); st.question = clamp(u / 0.25) * clamp((t1 - t) / 0.2); break;
        case 'startle': {
          const jump = u < 0.55 ? Math.sin(Math.PI * u / 0.55) : 0;
          st.dy -= 70 * jump;
          const land = u > 0.55 && u < 0.85 ? Math.sin(Math.PI * (u - 0.55) / 0.3) : 0;
          st.sx *= 1 + 0.08 * land; st.sy *= 1 - 0.08 * land + 0.05 * jump;
          st.exclaim = clamp(u / 0.1) * (1 - clamp((u - 1.0) / 0.3));
          st.headRot += -4 * Math.sin(u * 30) * Math.exp(-u * 4);
          break;
        }
        case 'hop': st.dy -= 40 * Math.sin(Math.PI * clamp(u / 0.5)); break;
        case 'nod': { const n = a.n ?? 2; st.headDy = 10 * Math.sin(Math.PI * clamp(u / (0.36 * n)) * n) ** 2; break; }
        case 'shake': st.headRot = 8 * Math.sin(u * 13) * clamp(u / 0.15) * clamp((t1 - t) / 0.2); break;
        case 'droop': st.headRot = 5; st.headDy = 8; st.sy *= 0.98; break;
        case 'talk': {
          const k = Math.floor(u / 0.11), r = hash(k, 977);
          st.face = t > t1 - 0.12 ? 'idle' : r > 0.25 ? 'talkA' : r > -0.45 ? 'talkH' : 'idle';
          st.rot += 1.2 * Math.sin(u * 5);
          break;
        }
      }
    }
    // 眨眼只在睁眼的脸上
    if (st.blink && ['idle', 'lookL', 'lookR', 'talkH', 'talkA'].includes(st.face) && st.pri < 3) st.face = 'blink';
    // 纸片弹一下：最近一次换图后 0.22 秒内放大再回弹 + 小抖
    let pop = 0;
    for (const ts of switches) { const u = (t - ts) / 0.22; if (u >= 0 && u < 1) pop = Math.max(pop, Math.sin(Math.PI * u) * (1 - u)); }
    st.sx *= 1 + 0.07 * popAmp * pop; st.sy *= 1 + 0.07 * popAmp * pop; st.rot += 3 * popAmp * pop * Math.sin((t * 37) % 6.28);
    // 呼吸
    st.sy *= 1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.2);
    st.headDy += 1.5 * Math.sin(t * 2 * Math.PI / 3.2 - 0.6);
    st.facing = MAN.bodies[st.body].facing;
    return st;
  }

  function draw(t, o = {}) {
    const st = state(t);
    if (o.force) Object.assign(st, o.force);              // 设定图定格用：{ body, face, mirror }
    const alpha = o.alpha ?? 1;
    if (alpha <= 0) return st;
    const B = MAN.bodies[st.body], H = MAN.heads[B.facing];      // 只配同朝向的头
    const S = st.s;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(st.x, st.y);
    ctx.scale(S, S);

    // 地面铅笔阴影（跳起时变小变淡）
    const air = clamp(-st.dy / 80);
    ctx.save(); ctx.globalAlpha *= 0.9 - 0.5 * air;
    const sw = 190 * (1 - 0.3 * air);
    ctx.drawImage(SHADOW, -sw / 2, -14, sw, 36);
    ctx.restore();

    // 离屏：整只纸片画好，再按剪影描白边 + 浅灰剪痕，最后整体投影
    const BX = 230, BY = 330, BW = 460, BH = 380;          // 小人坐标里的离屏范围（脚底为原点）
    const w = Math.ceil(BW * S), h = Math.ceil(BH * S);
    for (const c of [OFF, RIM, CUT]) if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    const g = OFF.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h);
    // 坐标：原点在脖子，单位 = 原图像素
    g.setTransform(S * K, 0, 0, S * K, BX * S, BY * S);
    g.translate(0, st.dy / K - FOOT);                      // 脚底 → 脖子
    if (st.mirror) g.scale(-1, 1);
    g.translate(0, FOOT); g.rotate(st.rot * RAD); g.scale(st.sx, st.sy); g.translate(0, -FOOT);   // 以脚底为锚挤压 / 摇
    const put = (f, [ox, oy]) => g.drawImage(IMG[f], ox, oy);
    const headT = fn => { g.save(); g.translate(0, st.headDy - 10); g.rotate(st.headRot * RAD); g.translate(0, 10); fn(); g.restore(); };
    headT(() => put(H.hairBack.file, H.hairBack.origin));
    put(B.file, B.origin);
    headT(() => {
      if (B.facing === 'front') {
        put(H.head.file, H.head.origin);
        put(H.face.states[st.face] ?? H.face.states.idle, H.face.origin);
      } else {
        const k = st.face === 'blink' ? 'blink' : st.face === 'talkA' ? 'talkA' : 'idle';
        put(H.states[k].file, H.states[k].origin);
      }
    });
    if (B.fore) put(B.fore.file, B.fore.origin);

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

    // 头顶的问号 / 惊叹线
    const top = st.dy + (H.top - FOOT + st.headDy) * K;
    if (st.question > 0.01) {
      const q = eBack(clamp(st.question));
      ctx.save();
      ctx.translate(62, top - 26 - 6 * Math.sin(t * 5));
      ctx.rotate(12 * RAD); ctx.scale(q, q);
      ctx.font = '800 76px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E0533A'; ctx.fillText('?', 3, 3);
      ctx.fillStyle = '#1E1B18'; ctx.fillText('?', 0, 0);
      ctx.restore();
    }
    if (st.exclaim > 0.01) {
      ctx.save();
      ctx.translate(0, top - 4);
      ctx.strokeStyle = '#1E1B18'; ctx.lineCap = 'round'; ctx.lineWidth = 6;
      const k = eo3(clamp(st.exclaim));
      for (const a of [-140, -90, -40]) {
        const r0 = 22 + 10 * k, r1 = r0 + 34 * k;
        ctx.beginPath(); ctx.moveTo(Math.cos(a * RAD) * r0, Math.sin(a * RAD) * r0); ctx.lineTo(Math.cos(a * RAD) * r1, Math.sin(a * RAD) * r1); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();

    // 给道具对齐用的点（画布坐标）
    const hp = HANDS[st.body] ?? HANDS.idle, mx = st.mirror ? -1 : 1;
    const toWorld = (lx, ly) => [st.x + lx * S, st.y + ly * S];
    st.hand = toWorld(mx * hp[0] * K, st.dy + (hp[1] - FOOT) * K);
    st.handL = st.hand; st.handR = st.hand;
    st.headTop = toWorld(0, top);
    return st;
  }

  return { draw, state };
}
