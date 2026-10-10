// chibi-emotes.js：漫符 / 动漫表情。全部是代码画的矢量图形（canvas 2D），不用任何图片。
// 所有东西都是 (ctx, 锚点, 进度 p, 时间 t) 的纯函数：同样的参数画出同样的像素。不用 Math.random、不读时钟。
//
// ─ 最常用：整套表情预设 ─────────────────────────────────────────────────────────
//   import { emotePreset, drawPreset, drawPresetMix, presetHost, anchorsFromHost, PRESET_NAMES } from '…/chibi-emotes.js';
//   一个预设 = { zh, eyes, mouth, brows, symbols, head: { tilt, nod, lean }, pose, expr }：
//     eyes / mouth / brows  矢量画的替换眼、嘴、眉的名字（没有就用角色自己的）
//     symbols               头周围的漫符名字数组（可以是 ['focus', { alpha: 0.4 }] 这样带选项）
//     head                  建议的头部姿态（弧度）：tilt 歪头、nod 低头（负 = 仰）、lean 身体侧倾
//     pose / expr           建议的肢体动作名和角色自带表情权重（对应讲解员接口的 state.pose / state.expr）
//   **漫符不单独贴在一张中性的脸上**：每个漫符名字本身也是一个预设（emotePreset('sweat')），带着配套的眼、眉、嘴和头姿态。
//
//   每帧：
//     host.direct(t => ({ ...你的状态, ...presetHost(preset) }));   // 藏掉原来的眼 / 嘴 / 眉，摆头，做动作
//     host.draw(t);
//     const A = anchorsFromHost(host.anchors());
//     drawPreset(fx, preset, A, p, t);                              // fx：叠在讲解员上面的一张 2D canvas 的 context
//   两个预设之间过渡：drawPresetMix(fx, a, b, k, A, t)，k 0→1；presetHost 用 mixPreset(a, b, k) 的返回值。
//
// ─ 底层：单画一个部件 ───────────────────────────────────────────────────────────
//   drawEmote(ctx, name, anchors, p, t, opts)；EMOTES[name] = { zh, kind: 'symbol' | 'eyes' | 'mouth' | 'brows', draw }。
//   头周围的漫符（symbol）：gloom 黑线 · sweat 汗滴 · vein 青筋 · question 问号 · exclaim 感叹号 · blush 脸红 · bulb 灯泡 ·
//     cloud 乌云 · hearts 爱心 · flowers 小花 · ghost 灵魂出窍 · zzz 睡着 · dots 省略号 · sparkle 闪光 · focus 集中线
//     （sigh 叹气三个变体已停用，见文件里的 DISABLED）
//   替换眼（eyes-…）：squeeze > < · flat — — · star 星星 · spiral 圈圈 · teary 泪眼 · smile 笑眼 · closed 闭眼 · dot 豆豆眼 ·
//     side 斜视 · up 往上看 · down 垂眼 · wide 睁大 · half 半闭 · narrow 眯起（上缘压平）
//     wink 单眼眨（doubt 一眯一睁已停用）
//   替换嘴（mouth-…）：cat ω · wavy 波浪 · o 大张 · small 小圆 · tri ▽ · flat 抿平 · smirk 歪嘴 · frown 下弯 · teeth 咬牙
//   替换眉（brows-…）：worried 八字 · angry 倒八 · skeptic 一高一低 · raised 抬高 · droop 垂眉 · low 压低
//
// ─ 锚点 anchors ────────────────────────────────────────────────────────────────
//   简单版（静态图、2D 木偶）：{ head: { x, y, scale?, rot? }, eyeL, eyeR, brow, cheekL?, cheekR?, top, mouth? }，都是 ctx 坐标系里的像素。
//     eyeL / eyeR = 画面左 / 右那只眼的中心；brow = 额头正中；top = 头顶；rot = 头的倾斜（弧度）。
//   三维讲解员：anchorsFromHost(host.anchors())。它带着脸的切平面矩阵，所以**贴在脸上的东西（眼、嘴、眉、脸红、黑线）
//     跟着头左右转会有透视压缩**；每个锚点带 facing（朝镜头的程度），转到侧后时对应的漫符自动淡出。
//   内部单位：两眼中心相距 100 单位。尺寸、线宽都按单位写，放大缩小、4K 都是矢量直出。
//
// ─ p 和 t ───────────────────────────────────────────────────────────────────────
//   p：一生的进度 0–1。前约 18% 弹出来，中间保持，最后约 14% 收掉；p ≤ 0 或 ≥ 1 不画。想一直挂着就停在 0.5。
//   t：秒，只驱动保持阶段的循环小动作（汗滴下滑、青筋跳、星星闪…）。
//
// ─ 选项 opts ────────────────────────────────────────────────────────────────────
//   ink 描边色（默认 #1E2A4A）；side 1 / -1 偏在哪一侧（默认 1 = 画面右）；alpha 整体透明度；
//   layer 'face' | 'top' | 'back'（drawPreset 分层画）；rig: true（drawPreset 跳过能由讲解员自己的眼睛、眉毛做出来的部件，见 presetHost）；
//   bounds { x, y, w, h } 只有集中线用（线从这个矩形边缘射向头，默认 0,0,1920,1080）。boundsFade: true = 不在框上硬裁，改成以头为圆心往外渐隐。
//
// ─ 画法依据 ──────────────────────────────────────────────────────────────────────
//   漫符的位置、形状、配色参照早先的风格调研（docs/ 里的漫符一节）；比例是在第一个角色的脸上试出来的。
//   矢量眼、嘴、眉的颜色和线宽取自第一个角色（贝雷帽女孩）的原画部件（眉 #0D6F6C 粗约 4.7 单位、嘴线 #A65A4C、睫毛近黑、虹膜青蓝），
//   为的是和原画接得上；换了别的角色要改文件里的 FACE 这一组常量。
//   和调研不同的两处：星星眼是整只眼换成黄星；灵魂从头顶飘出（Q 版头大嘴小，从嘴里出来会挡住脸）。

export const INK = '#1E2A4A';
const C = { water: '#CDEFFA', waterDeep: '#8FD3EA', red: '#EE4B4B', coral: '#FF7A59', pink: '#FF8FA8', pinkSoft: 'rgba(255,143,168,0.38)',
  yellow: '#F6C453', blue: '#1FA2C9', mute: '#5A6B86', glow: '#FFE27A', vein: '#F0553F', cloud: '#7C89A6', cloudLight: '#9AA6C0', white: '#FFFFFF', iris: '#1FA5B8', irisDeep: '#12677C', star: '#FFD84A' };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (p, a, b) => clamp((p - a) / (b - a));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const eo3 = x => 1 - (1 - clamp(x)) ** 3;
const eBack = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
const TAU = Math.PI * 2;
/** 矢量眼嘴眉的配色（取自第一个角色的原画；换角色时要跟着换，待改成读数据包） */
export const FACE = { lash: '#0A0F22', brow: '#0D6F6C', browW: 4.8, mouth: '#A65A4C', mouthW: 2.2, inside: '#C2505A', tongue: '#F29A9A', teeth: '#FFFFFF', white: '#FFFFFF', iris: '#1FA5B8', irisDeep: '#0B4860', pupil: '#06243A', skin: '#FBE3D4' };
function prng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let x = a; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
/** 四角星（十字星）：四个内凹的尖 */
function star4(ctx, R, r = R * 0.22) { ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2, b = a + Math.PI / 4; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * R, Math.sin(a) * R); ctx.quadraticCurveTo(Math.cos(b) * r * 0.2, Math.sin(b) * r * 0.2, Math.cos(a + Math.PI / 2) * R, Math.sin(a + Math.PI / 2) * R); } ctx.closePath(); }

/** 一生的包络：a = 弹出（会略微过冲），out = 收掉前为 1，alpha = 透明度，s = 整体缩放 */
export function life(p) {
  const a = eBack(prog(p, 0, 0.18)), out = 1 - smooth(prog(p, 0.86, 1));
  return { a, out, alpha: clamp(prog(p, 0, 0.07)) * out, s: a * (0.55 + 0.45 * out) };
}

const mul = (M, p) => ({ x: M[0] * p.x + M[2] * p.y + M[4], y: M[1] * p.x + M[3] * p.y + M[5] });
const inv = M => { const d = M[0] * M[3] - M[1] * M[2]; return [M[3] / d, -M[1] / d, -M[2] / d, M[0] / d, (M[2] * M[5] - M[3] * M[4]) / d, (M[1] * M[4] - M[0] * M[5]) / d]; };
const NORM = new WeakMap();
/** 把锚点整理成：脸的矩阵 M（单位 = 两眼距 ÷ 100，原点 = 两眼中点）、各点在脸坐标里的位置 L、屏幕上的单位长度 u 和倾斜 rot */
function norm(A) {
  let n = NORM.get(A); if (n) return n;
  const mid = { x: (A.eyeL.x + A.eyeR.x) / 2, y: (A.eyeL.y + A.eyeR.y) / 2 };
  let M;
  if (A.face) {
    const I0 = inv(A.face), a = mul(I0, A.eyeL), b = mul(I0, A.eyeR), k = Math.hypot(b.x - a.x, b.y - a.y) / 100;
    M = [A.face[0] * k, A.face[1] * k, A.face[2] * k, A.face[3] * k, mid.x, mid.y];
  } else {
    const u = A.head?.scale ?? Math.hypot(A.eyeR.x - A.eyeL.x, A.eyeR.y - A.eyeL.y) / 100, r = A.head?.rot ?? 0;
    M = [Math.cos(r) * u, Math.sin(r) * u, -Math.sin(r) * u, Math.cos(r) * u, mid.x, mid.y];
  }
  const I = inv(M), loc = (pt, dflt) => (pt ? mul(I, pt) : dflt), eL = mul(I, A.eyeL), eR = mul(I, A.eyeR);
  const L = { mid: { x: 0, y: 0 }, eyeL: eL, eyeR: eR, mouth: loc(A.mouth, { x: 0, y: 42 }), cheekL: loc(A.cheekL, { x: -68, y: 33 }), cheekR: loc(A.cheekR, { x: 68, y: 33 }),
    browL: { x: eL.x, y: eL.y - 49 }, browR: { x: eR.x, y: eR.y - 49 } };
  n = { M, L, u: Math.hypot(M[2], M[3]), rot: Math.atan2(-M[2], M[3]), facing: A.facing ?? 1 };
  NORM.set(A, n); return n;
}
const frame = A => norm(A);
const seen = f => smooth(((f ?? 1) - 0.12) / 0.3);          // 朝镜头的程度 → 透明度
/** 头周围的符号：在某个屏幕锚点上开一个「单位」坐标系，跟着头平移、缩放、歪；锚点转到背面时淡出 */
function at(ctx, A, pt, dx, dy, fn) {
  const { u, rot } = norm(A), a = seen(pt.facing);
  if (a <= 0) return;
  ctx.save();
  ctx.translate(pt.x, pt.y); ctx.rotate(rot); ctx.scale(u, u); ctx.translate(dx, dy);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalAlpha *= a;
  fn();
  ctx.restore();
}
/** 贴在脸上的东西：用脸的矩阵画，跟着头转有透视压缩；key 是 L 里的点名（eyeL、mouth、browR、cheekL、mid…） */
function onFace(ctx, A, key, dx, dy, fn) {
  const n = norm(A), a = seen(n.facing);
  if (a <= 0) return;
  ctx.save();
  ctx.transform(...n.M); ctx.translate(n.L[key].x + dx, n.L[key].y + dy);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalAlpha *= a;
  fn();
  ctx.restore();
}
/** 描边 + 填色的小工具：先填后描，线宽按单位 */
function paint(ctx, fill, ink, lw = 2.2) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (ink) { ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke(); }
}
/** 两层描线：底下一层粗的深色，上面一层细的亮色（问号、Zzz 这类「空心粗线」） */
function tube(ctx, path, ink, color, wOut, wIn) {
  ctx.strokeStyle = ink; ctx.lineWidth = wOut; ctx.beginPath(); path(); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = wIn; ctx.beginPath(); path(); ctx.stroke();
}
function heart(ctx) { ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-17, -5, -9, -19, 0, -9); ctx.bezierCurveTo(9, -19, 17, -5, 0, 8); ctx.closePath(); }
function star(ctx, R, r, n = 5) { ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? r : R; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); }
function drop(ctx) { ctx.beginPath(); ctx.moveTo(0, -20); ctx.bezierCurveTo(15, 1, 13, 17, 0, 17); ctx.bezierCurveTo(-13, 17, -15, 1, 0, -20); ctx.closePath(); }

/** 一条起笔粗、收笔尖的线：沿 f(u)（u 0→1）走，宽度从 w 收到 0 */
function taper(ctx, f, w, color, n = 18) {
  const P = []; for (let i = 0; i <= n; i++) P.push(f(i / n));
  const Lp = [], Rp = [];
  for (let i = 0; i <= n; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(n, i + 1)], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, hw = w / 2 * (1 - i / n) ** 0.8; Lp.push([P[i].x - dy / d * hw, P[i].y + dx / d * hw]); Rp.push([P[i].x + dy / d * hw, P[i].y - dx / d * hw]); }
  ctx.beginPath(); ctx.moveTo(...Lp[0]); for (const q of Lp) ctx.lineTo(...q); for (const q of Rp.reverse()) ctx.lineTo(...q); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.arc(P[0].x, P[0].y, w / 2, 0, TAU); ctx.fill();
}
const SIGH = 'rgba(70,100,134,0.92)', SIGH_W = 2.15;   // 线宽是「放大 1.8 倍之前」的数，实际约 3.9 单位
/** 一口气的一条线：细、带弧度（bend 正 = 往下弯），从 (0, y) 往 +x 飘 len；curl > 0 时末端往上卷一个半径 curl 的小钩（turn = 卷多少弧度） */
function breath(ctx, ph, len, bend, y, curl = 0, turn = 3.4) {
  const g = clamp(ph * 1.6); if (g <= 0) return;
  ctx.strokeStyle = SIGH; ctx.lineWidth = SIGH_W; ctx.beginPath();
  const N = 28, body = curl ? 0.72 : 1;
  for (let i = 0; i <= N; i++) {
    const u = i / N * g; let x, yy;
    if (u <= body) { const v = u / body; x = len * v; yy = y + bend * len * v * v; }
    else { const a = (u - body) / (1 - body) * turn, r = curl * (1 - 0.35 * (u - body) / (1 - body)); x = len + Math.sin(a) * r; yy = y + bend * len - curl + Math.cos(a) * r + (curl - r); }
    ctx[i ? 'lineTo' : 'moveTo'](x, yy);
  }
  ctx.stroke();
}
/** 叹气三个变体共用：在嘴角外侧开一个斜向下的坐标系（x = 吹出去的方向），循环相位 ph */
function sighAt(ctx, A, p, t, o, fn) {
  const L = life(p), ph = (t * 0.7) % 1, mouth = A.mouth ?? mul(norm(A).M, { x: 0, y: 42 });
  at(ctx, A, mouth, 176 * o.side, 2, () => {      // 头的侧面、头发轮廓之外的空白处，高度和嘴齐平；朝斜下外侧飘
    ctx.globalAlpha *= L.alpha * (1 - smooth((ph - 0.55) / 0.45)); ctx.scale(o.side * L.s * 1.9, L.s * 1.9); ctx.rotate(0.42); ctx.translate(ph * 8, 0);
    fn(ph, L);
  });
}

// ════════════════════════════════════════════ 头部周围的符号
const SYMBOLS = {
  // 黑线：额头垂下几条竖线，上半张脸罩一层阴影（无语、尴尬、被打败）
  gloom: { zh: '黑线', draw(ctx, A, p, t, o) {
    const L = life(p), d = eo3(prog(p, 0, 0.3)) * L.out;
    // 两部分分两层画（2026-10-08 拆的）：阴影在脸前、刘海后（layer 'face'）；竖线是符号，要看得全，画在最上面（layer 'top'）。不分层画时两样一起画。
    const shade = o.layer !== 'top', lines = o.layer !== 'face';
    onFace(ctx, A, 'mid', 0, 0, () => {
      ctx.globalAlpha *= L.alpha;
      // 一层自上而下渐淡的青灰影，只落在皮肤上（这一层画在刘海下面）；到眼睛下缘淡完，眼睛看得清
      if (shade) {
        const g = ctx.createLinearGradient(0, -100, 0, -100 + 128 * d + 1);
        g.addColorStop(0, 'rgba(62,76,124,0.62)'); g.addColorStop(0.6, 'rgba(62,76,124,0.3)'); g.addColorStop(1, 'rgba(62,76,124,0)');
        ctx.beginPath(); ctx.ellipse(0, -8, 100, 96, 0, Math.PI, 0); ctx.lineTo(100, 30); ctx.lineTo(-100, 30); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      }
      if (!lines) return;
      // 五条长短不一的竖线：从额头上沿垂下来，停在眼睛上方（压在刘海上面）
      const xs = [-62, -36, -8, 22, 52], end = [-15, -6, -20, -9, -17];
      ctx.strokeStyle = o.ink; ctx.lineWidth = 3.2;
      xs.forEach((x, i) => {
        const dd = eo3(prog(p, 0.02 + i * 0.03, 0.24 + i * 0.03)) * L.out, sway = Math.sin(t * 1.7 + i * 1.3) * 0.7;
        ctx.beginPath(); ctx.moveTo(x, -96); ctx.lineTo(x + sway, -96 + (end[i] + 96) * dd); ctx.stroke();
      });
    });
  } },
  // 汗滴：太阳穴边一颗大汗珠，慢慢往下滑（尴尬、无奈）
  sweat: { zh: '汗滴', draw(ctx, A, p, t, o) {
    const L = life(p), slide = 30 * smooth(prog(p, 0.12, 0.8));
    at(ctx, A, A.brow, 164 * o.side, -34 + slide, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(2.6 * L.s, 2.6 * L.s * (1 + 0.05 * Math.sin(t * 5)));
      drop(ctx); paint(ctx, C.water, o.ink, 2.2);
      ctx.beginPath(); ctx.ellipse(-4.5, 6, 2.6, 5, 0.3, 0, TAU); ctx.fillStyle = C.white; ctx.fill();
    });
    const s2 = eBack(prog(p, 0.1, 0.3)) * L.out;
    if (s2 > 0) at(ctx, A, A.brow, 122 * o.side, 30 + slide * 0.6, () => { ctx.globalAlpha *= L.alpha; ctx.scale(1.0 * s2, 1.0 * s2); drop(ctx); paint(ctx, C.water, o.ink, 2.8); });
  } },
  // 青筋：四段弯角拼成的十字，一跳一跳（生气）
  vein: { zh: '青筋', draw(ctx, A, p, t, o) {
    const L = life(p), beat = 1 + 0.16 * Math.max(0, Math.sin(t * 9.5)) ** 2;
    at(ctx, A, A.brow, -118 * o.side, -78, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(2.1 * L.s * beat, 2.1 * L.s * beat); ctx.rotate(0.2);
      const arm = () => { for (let k = 0; k < 4; k++) { ctx.save(); ctx.rotate(k * Math.PI / 2); ctx.moveTo(4.5, 15); ctx.quadraticCurveTo(4.5, 4.5, 15, 4.5); ctx.restore(); } };
      tube(ctx, arm, o.ink, C.vein, 7.2, 4);
    });
    const s2 = eBack(prog(p, 0.12, 0.32)) * L.out, beat2 = 1 + 0.16 * Math.max(0, Math.sin(t * 9.5 + 1.6)) ** 2;
    if (s2 > 0) at(ctx, A, A.brow, -150 * o.side, -34, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.15 * s2 * beat2, 1.15 * s2 * beat2); ctx.rotate(-0.25);
      tube(ctx, () => { for (let k = 0; k < 4; k++) { ctx.save(); ctx.rotate(k * Math.PI / 2); ctx.moveTo(4.5, 15); ctx.quadraticCurveTo(4.5, 4.5, 15, 4.5); ctx.restore(); } }, o.ink, C.vein, 7.6, 4.2);
    });
  } },
  // 问号：头顶一侧弹出一大一小两个，左右摆（疑惑）
  question: { zh: '问号', draw(ctx, A, p, t, o) {
    const L = life(p), wob = Math.sin(prog(p, 0, 0.5) * 9) * (1 - prog(p, 0, 0.5)) * 0.35 + Math.sin(t * 7.8) * 0.12;
    const one = (x, y, k, rot, delay) => { const s = eBack(prog(p, delay, delay + 0.18)) * (0.55 + 0.45 * L.out); if (s <= 0) return; at(ctx, A, A.top, x * o.side, y, () => {
      ctx.globalAlpha *= L.alpha; ctx.rotate(rot * o.side + wob); ctx.scale(k * s, k * s);
      tube(ctx, () => { ctx.arc(0, -18, 11, Math.PI * 1.08, Math.PI * 0.4); ctx.quadraticCurveTo(0.5, -3, 0.5, 3); }, o.ink, C.blue, 9.6, 5.6);
      ctx.beginPath(); ctx.arc(0.5, 17, 4.8, 0, TAU); paint(ctx, C.blue, o.ink, 2.2);
    }); };
    one(92, 34, 2, 0.22, 0); one(142, -4, 1.15, 0.42, 0.1);
  } },
  // 感叹号：暖黄的一根，弹出时周围一圈短线闪一下（吃惊、发现）
  exclaim: { zh: '感叹号', draw(ctx, A, p, t, o) {
    const L = life(p), jolt = Math.sin(prog(p, 0, 0.4) * 22) * (1 - prog(p, 0, 0.4)) * 3, flash = 0.55 + 0.45 * Math.sin(t * 9);
    at(ctx, A, A.top, -88 * o.side + jolt, 30, () => {
      ctx.globalAlpha *= L.alpha; ctx.rotate(-0.16 * o.side); ctx.scale(1.9 * L.s, 1.9 * L.s);
      ctx.strokeStyle = C.yellow; ctx.lineWidth = 3.4;
      for (let i = 0; i < 7; i++) { const a = Math.PI * (1.02 + i * 0.16), r0 = 31 + 3 * flash, r1 = r0 + 7 + 4 * flash; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, -8 + Math.sin(a) * r0 * 1.15); ctx.lineTo(Math.cos(a) * r1, -8 + Math.sin(a) * r1 * 1.15); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-7.5, -32); ctx.lineTo(7.5, -32); ctx.lineTo(3.2, 8); ctx.lineTo(-3.2, 8); ctx.closePath(); paint(ctx, C.yellow, o.ink, 2.4);
      ctx.beginPath(); ctx.arc(0, 20, 5.4, 0, TAU); paint(ctx, C.yellow, o.ink, 2.4);
    });
  } },
  // 脸红：两颊各一团粉晕加三道斜线（害羞）
  blush: { zh: '脸红', draw(ctx, A, p, t, o) {
    const L = life(p), k = 1 + 0.04 * Math.sin(t * 3);
    for (const key of ['cheekL', 'cheekR']) onFace(ctx, A, key, 0, 0, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(k, k);
      ctx.beginPath(); ctx.ellipse(0, 0, 30, 16, 0, 0, TAU); ctx.fillStyle = 'rgba(255,120,150,0.45)'; ctx.fill();
      ctx.strokeStyle = '#E23A66'; ctx.lineWidth = 2.8;
      for (let i = -1; i <= 1; i++) { const q = eo3(prog(p, 0.03 + (i + 1) * 0.04, 0.2 + (i + 1) * 0.04)); ctx.beginPath(); ctx.moveTo(i * 13 - 4, 9); ctx.lineTo(i * 13 - 4 + 8 * q, 9 - 18 * q); ctx.stroke(); }
    });
  } },
  // 灯泡：头顶亮起，周围一圈光芒一闪一闪（想到了）
  bulb: { zh: '灯泡', draw(ctx, A, p, t, o) {
    const L = life(p), lit = 0.5 + 0.5 * Math.sin(t * 7);
    at(ctx, A, A.top, 0, -46, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.6 * L.s, 1.6 * L.s);
      ctx.strokeStyle = C.yellow; ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) { const a = Math.PI + (i + 0.5) * Math.PI / 7 * 1.0 - 0, r0 = 27 + 2 * lit, r1 = 34 + 5 * lit; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, -8 + Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * r1, -8 + Math.sin(a) * r1); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, -8, 18, Math.PI * 0.72, Math.PI * 0.28); ctx.lineTo(7, 12); ctx.lineTo(-7, 12); ctx.closePath(); paint(ctx, C.glow, o.ink, 2.4);
      ctx.beginPath(); ctx.roundRect(-7.5, 12, 15, 10, 2.5); paint(ctx, '#C9D2E3', o.ink, 2.2);
      ctx.beginPath(); ctx.moveTo(-7, 17); ctx.lineTo(7, 17); ctx.strokeStyle = o.ink; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-7, -14, 3.2, 5.5, 0.6, 0, TAU); ctx.fillStyle = C.white; ctx.fill();
    });
  } },
  // 乌云：头顶一朵灰云，下着小雨（消沉、倒霉）
  cloud: { zh: '乌云', draw(ctx, A, p, t, o) {
    const L = life(p), bob = Math.sin(t * 1.6) * 2.5;
    at(ctx, A, A.top, 0, -34 + bob, () => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.55 * L.s, 1.55 * L.s);
      const puffs = [[-30, 6, 11], [-16, -4, 15], [4, -11, 18], [24, -3, 14], [36, 7, 10], [0, 8, 14], [-14, 9, 12], [18, 9, 12]];
      ctx.fillStyle = o.ink; for (const [x, y, r] of puffs) { ctx.beginPath(); ctx.arc(x, y, r + 2.3, 0, TAU); ctx.fill(); }
      ctx.fillStyle = C.cloud; for (const [x, y, r] of puffs) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
      ctx.fillStyle = C.cloudLight; for (const [x, y, r] of [[-16, -6, 9], [4, -14, 11], [23, -6, 8]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = C.waterDeep; ctx.lineWidth = 2.6;
      for (let i = 0; i < 4; i++) { const ph = (t * 1.3 + i * 0.27) % 1, x = -24 + i * 16, y = 24 + ph * 22; ctx.globalAlpha = L.alpha * (1 - ph) * 0.95; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9); ctx.stroke(); }
    });
  } },
  // 爱心：从脸旁一颗接一颗冒上去（喜欢）
  hearts: { zh: '爱心', draw(ctx, A, p, t, o) {
    const L = life(p);
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.62 + i / 3) % 1, k = [2.0, 1.4, 1.65][i], x = [150, 190, 124][i] * o.side + Math.sin(ph * TAU + i) * 6, y = -6 - ph * 86 + [0, 10, -6][i];
      at(ctx, A, A.brow, x, y, () => {
        ctx.globalAlpha *= L.alpha * smooth(ph * 5) * (1 - smooth((ph - 0.7) / 0.3)); ctx.rotate([0.2, -0.15, 0.05][i] * o.side); ctx.scale(k * L.s, k * L.s);
        heart(ctx); paint(ctx, C.pink, o.ink, 2.1);
        ctx.beginPath(); ctx.ellipse(-5.5, -7.5, 2, 3.2, -0.5, 0, TAU); ctx.fillStyle = C.white; ctx.fill();
      });
    }
  } },
  // 小花：头两边飘着几朵小花，慢慢转（开心、满足）
  flowers: { zh: '小花', draw(ctx, A, p, t, o) {
    const spots = [[-150, -48, 1.25, '#FFD6E0'], [148, -66, 1.45, '#FFF2B8'], [-118, 44, 0.95, '#FFF2B8'], [160, 30, 1.05, '#FFD6E0'], [-172, 0, 0.8, '#FFFFFF']];
    spots.forEach(([x, y, k, col], i) => {
      const a = eBack(prog(p, i * 0.035, 0.2 + i * 0.035)) * (1 - smooth(prog(p, 0.86, 1)));
      if (a <= 0) return;
      at(ctx, A, A.brow, x, y + Math.sin(t * 1.8 + i) * 3, () => {
        ctx.globalAlpha *= clamp(a); ctx.scale(k * a * 1.2, k * a * 1.2); ctx.rotate(t * 0.9 * (i % 2 ? 1 : -1) + i);
        for (let j = 0; j < 5; j++) { const q = j * TAU / 5; ctx.beginPath(); ctx.arc(Math.cos(q) * 8.5, Math.sin(q) * 8.5, 6.2, 0, TAU); paint(ctx, col, o.ink, 1.8); }
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); paint(ctx, C.yellow, o.ink, 1.8);
      });
    });
  } },
  // 灵魂出窍：头顶飘出一只小白魂，拖着一条尾巴（被吓到、累瘫）
  ghost: { zh: '灵魂出窍', draw(ctx, A, p, t, o) {
    const L = life(p), rise = 44 * eo3(prog(p, 0.05, 0.6)), sway = Math.sin(t * 2.3) * 6;
    at(ctx, A, A.top, 46 * o.side + sway, -28 - rise, () => {
      ctx.globalAlpha *= L.alpha * 0.96; ctx.scale(1.7 * L.s, 1.7 * L.s); ctx.rotate(sway * 0.02);
      ctx.beginPath(); ctx.moveTo(-15, 6); ctx.bezierCurveTo(-18, -26, 18, -26, 15, 6);
      ctx.bezierCurveTo(14, 20, 6, 22, 3 - sway * 0.5, 40 + rise * 0.25); ctx.bezierCurveTo(-2, 26, -14, 22, -15, 6); ctx.closePath(); paint(ctx, C.white, o.ink, 2.2);
      ctx.strokeStyle = o.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(-4, -3); ctx.lineTo(-9, 0); ctx.moveTo(9, -6); ctx.lineTo(4, -3); ctx.lineTo(9, 0); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 7, 3, 4, 0, 0, TAU); ctx.fillStyle = o.ink; ctx.fill();
    });
  } },
  // Zzz：三个由小到大的 Z 往上飘（睡着、无聊）
  zzz: { zh: '睡着 Zzz', draw(ctx, A, p, t, o) {
    const L = life(p);
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.5 + i / 3) % 1, s = 9 + ph * 15, x = (74 + ph * 74) * o.side, y = 40 - ph * 100;
      at(ctx, A, A.top, x, y, () => {
        ctx.globalAlpha *= L.alpha * smooth(ph * 6) * (1 - smooth((ph - 0.75) / 0.25)); ctx.rotate(-0.14 * o.side); ctx.scale(L.s, L.s);
        tube(ctx, () => { ctx.moveTo(-s, -s); ctx.lineTo(s, -s); ctx.lineTo(-s, s); ctx.lineTo(s, s); }, o.ink, C.water, 7.4, 3.6);
      });
    }
  } },
  // 省略号：头顶一侧三个灰点依次出现（沉默、无语、在想）
  dots: { zh: '省略号', draw(ctx, A, p, t, o) {
    const L = life(p);
    for (let i = 0; i < 3; i++) {
      const s = eBack(prog(p, 0.04 + i * 0.1, 0.16 + i * 0.1)) * L.out, hop = Math.max(0, Math.sin(t * 5 - i * 0.9)) * 3;
      if (s > 0) at(ctx, A, A.top, (70 + i * 40) * o.side, 26 - i * 9 - hop, () => { ctx.globalAlpha *= L.alpha; ctx.beginPath(); ctx.arc(0, 0, 13 * s, 0, TAU); paint(ctx, C.mute, o.ink, 2.2); });
    }
  } },
  // 叹气「呼——」：从嘴角斜向下吹出的几条弧形速度线，起笔粗、收笔尖；线滑出、拉长、淡掉。三个变体：
  //   sigh 纯弧线 · sigh-puff 三条短线 + 小圈（「＝3」的读法）· sigh-curl 一条带卷尾的长线
  sigh: { zh: '叹气', draw(ctx, A, p, t, o) { sighAt(ctx, A, p, t, o, ph => {           // A（主推）：三条长短不一的弧线，末端略卷
    [[-11, -0.1, 30, 4.5], [0, 0.05, 44, 6], [12, 0.22, 24, 4]].forEach(([y, bend, len, curl], i) => breath(ctx, ph - i * 0.07, len, bend, y, curl));
  }); } },
  'sigh-puff': { zh: '叹气 ＝3', draw(ctx, A, p, t, o) { sighAt(ctx, A, p, t, o, ph => {   // B：两条短线 + 一个开口朝嘴的「3」形（两个小弧），不是一朵云
    breath(ctx, ph, 20, -0.05, -6); breath(ctx, ph - 0.05, 20, 0.05, 6);
    const g = clamp(ph * 1.7 - 0.2); if (g > 0) { ctx.save(); ctx.translate(31 + ph * 5, 0); ctx.scale(g, g); ctx.strokeStyle = SIGH; ctx.lineWidth = SIGH_W; ctx.beginPath(); ctx.arc(0, -6.5, 6.5, Math.PI * 1.15, Math.PI * 0.5); ctx.arc(0, 6.5, 6.5, Math.PI * 1.5, Math.PI * 0.85); ctx.stroke(); ctx.restore(); }
  }); } },
  'sigh-curl': { zh: '叹气 卷尾', draw(ctx, A, p, t, o) { sighAt(ctx, A, p, t, o, ph => {   // C：一条长弧线，末端卷一整圈，旁边一条短的
    breath(ctx, ph, 50, 0.12, -3, 8, 5.6); breath(ctx, ph - 0.1, 22, 0.2, 12);
  }); } },
  // 闪光：眼角外侧一颗四角星「叮」地亮一下，旁边跟两颗小的（得意、有把握）
  sparkle: { zh: '闪光', draw(ctx, A, p, t, o) {
    const L = life(p);
    [[104, -62, 46, 0], [164, -4, 30, 0.33], [150, -124, 34, 0.62]].forEach(([x, y, R, off], i) => {
      const ph = (t * 1.25 + off) % 1, k = Math.sin(Math.PI * Math.min(1, ph * 1.6)) ** 0.8;
      at(ctx, A, o.side > 0 ? A.eyeR : A.eyeL, x * o.side, y, () => {
        ctx.globalAlpha *= L.alpha; ctx.rotate(ph * Math.PI / 4 * (i ? -1 : 1)); ctx.scale(k * L.s, k * L.s);
        star4(ctx, R); paint(ctx, i ? C.white : C.star, o.ink, 2.6);
      });
    });
  } },
  // 集中线：从画面四边射向头的一圈细长尖刺，每隔两帧换一组长度（强调、冲击）。铺满 opts.bounds。
  focus: { zh: '集中线', draw(ctx, A, p, t, o) {
    const L = life(p), B = o.bounds ?? { x: 0, y: 0, w: 1920, h: 1080 }, { u } = frame(A);
    const rnd = prng(977 + Math.floor(t * 15)), far = Math.hypot(B.w, B.h), N = 72;
    ctx.save(); ctx.beginPath(); ctx.rect(B.x, B.y, B.w, B.h); ctx.clip();
    ctx.translate(A.head.x, A.head.y); ctx.globalAlpha *= L.alpha * 0.92 * seen(norm(A).facing * 0 + 1); ctx.fillStyle = o.ink;
    if (o.boundsFade) {
      // 范围框比画面小的时候（讲解员只占画面一侧）：线不许齐刷刷断在框上，改成以头为圆心往外渐隐，到最近的那条竖边之前就淡没了
      const R = Math.max(40, Math.min(A.head.x - B.x, B.x + B.w - A.head.x)), g = ctx.createRadialGradient(0, 0, R * 0.68, 0, 0, R * 0.99);
      g.addColorStop(0, o.ink); g.addColorStop(1, 'rgba(30,42,74,0)'); ctx.fillStyle = g;
      ctx.globalAlpha = Math.min(1, ctx.globalAlpha * 1.6);          // 渐隐后整体偏淡：加深一档，靠近头的一端更实
    }
    const open = (1.9 - 0.9 * eo3(prog(p, 0, 0.16)));                      // 一开始收得紧，随即张开留出脸
    for (let i = 0; i < N; i++) {
      const a = (i + rnd() * 0.7) / N * TAU, half = (0.008 + rnd() * 0.02), rin = (170 + rnd() * 110) * u * open * (1 + 0.25 * Math.abs(Math.sin(a)));
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * rin, Math.sin(a) * rin * 0.92);
      ctx.lineTo(Math.cos(a - half) * far, Math.sin(a - half) * far); ctx.lineTo(Math.cos(a + half) * far, Math.sin(a + half) * far); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  } },
};

// ════════════════════════════════════════════ 替换眼（画在两只眼的锚点上；角色要先把原来的眼睛藏起来）
const both = (ctx, A, fn) => { onFace(ctx, A, 'eyeL', 0, 0, () => fn(-1)); onFace(ctx, A, 'eyeR', 0, 0, () => fn(1)); };
/**
 * 照原画的路子画一只眼：近黑的粗上睫毛（外眼角带一小撇）、眼白、青蓝虹膜、深色瞳孔、两点高光。
 * s = -1 画面左眼 / 1 右眼；rx, ry 眼睛半宽半高；iris 虹膜半径；gx, gy 视线偏移（单位）；lid 上眼睑压下来的比例 0–1；flat 上缘压平 0–1
 */
function vecEye(ctx, s, { rx = 25, ry = 21, iris = 17, gx = 0, gy = 0, lid = 0, flat = 0, ink } = {}) {
  const top = -ry + lid * ry * 2;                         // 上眼睑的位置
  const arch = (1 - flat) * (1 - lid * 0.6);              // 上缘的弧度
  const upper = () => { ctx.moveTo(-rx, top + ry * 0.55 * arch + 2); ctx.quadraticCurveTo(0, top - ry * 0.5 * arch, rx, top + ry * 0.5 * arch + 2); };
  ctx.save(); ctx.beginPath(); upper(); ctx.quadraticCurveTo(rx * 0.9, ry, 0, ry); ctx.quadraticCurveTo(-rx * 0.9, ry, -rx, top + ry * 0.55 * arch + 2); ctx.closePath();
  ctx.fillStyle = FACE.white; ctx.fill(); ctx.clip();
  const ix = clamp(gx, -rx + iris * 0.7, rx - iris * 0.7), iy = clamp(gy, -ry * 0.5, ry * 0.5) + 1;
  ctx.beginPath(); ctx.ellipse(ix, iy, iris, iris * 1.12, 0, 0, TAU); ctx.fillStyle = FACE.irisDeep; ctx.fill();
  ctx.beginPath(); ctx.ellipse(ix, iy + iris * 0.25, iris * 0.82, iris * 0.8, 0, 0, TAU); ctx.fillStyle = FACE.iris; ctx.fill();
  ctx.beginPath(); ctx.ellipse(ix, iy, iris * 0.42, iris * 0.5, 0, 0, TAU); ctx.fillStyle = FACE.pupil; ctx.fill();
  ctx.fillStyle = FACE.white; ctx.beginPath(); ctx.arc(ix - iris * 0.38, iy - iris * 0.42, iris * 0.26, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(ix + iris * 0.36, iy + iris * 0.4, iris * 0.13, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.2; ctx.beginPath(); upper(); ctx.stroke();
  ctx.lineWidth = 4.4; ctx.beginPath(); ctx.moveTo(s * rx, top + ry * 0.5 * arch + 2); ctx.lineTo(s * (rx + 7), top + ry * 0.5 * arch - 3); ctx.stroke();   // 外眼角的小撇
  ctx.strokeStyle = 'rgba(10,15,34,0.5)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-rx * 0.5, ry - 1); ctx.quadraticCurveTo(0, ry + 1.5, rx * 0.5, ry - 1); ctx.stroke();
}
/** 一组「真眼睛」的变体：共用 vecEye，只是参数不同 */
const eyeVariant = (zh, param) => ({ zh, draw(ctx, A, p, t, o) { const L = life(p); both(ctx, A, s => { ctx.globalAlpha *= L.alpha; ctx.scale(0.6 + 0.4 * L.s, 0.6 + 0.4 * L.s); vecEye(ctx, s, { ...param(s, t, o), ink: o.ink }); }); } });
const EYES = {
  // > <：使劲闭眼（疼、用力、不敢看）
  'eyes-squeeze': { zh: '> < 挤眼', draw(ctx, A, p, t, o) {
    const L = life(p), tr = Math.sin(t * 34) * 0.5;
    both(ctx, A, s => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.2 * L.s * s, 1.2 * L.s); ctx.translate(tr, 0);   // 左眼是 >，右眼镜像成 <
      ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(18, -17); ctx.lineTo(-16, 0); ctx.lineTo(18, 17); ctx.stroke();
    });
  } },
  // — —：两条横线（无语、冷漠）
  'eyes-flat': { zh: '— — 无语', draw(ctx, A, p, t, o) {
    const L = life(p), w = eo3(prog(p, 0, 0.16));
    both(ctx, A, s => {
      ctx.globalAlpha *= L.alpha; ctx.scale(s, 1);
      ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.6; ctx.beginPath(); ctx.moveTo(-23 * w, 3); ctx.lineTo(23 * w, 5); ctx.stroke();
    });
  } },
  // 星星眼：两颗会闪的星星（向往、兴奋）
  'eyes-star': { zh: '星星眼', draw(ctx, A, p, t, o) {
    const L = life(p), k = 1 + 0.09 * Math.sin(t * 8);
    both(ctx, A, s => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.18 * L.s * k * s, 1.18 * L.s * k); ctx.rotate(Math.sin(t * 2) * 0.12);
      star(ctx, 26, 11.5); paint(ctx, C.star, o.ink, 2.8);
      ctx.beginPath(); ctx.ellipse(-6, -7, 2.6, 4.6, -0.5, 0, TAU); ctx.fillStyle = C.white; ctx.fill();
      const tw = 0.5 + 0.5 * Math.sin(t * 8 + 2); ctx.strokeStyle = C.star; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(25, -26 - 6 * tw); ctx.lineTo(25, -26 + 6 * tw); ctx.moveTo(25 - 6 * tw, -26); ctx.lineTo(25 + 6 * tw, -26); ctx.stroke();
    });
  } },
  // 圈圈眼：两个转着的螺旋（晕）
  'eyes-spiral': { zh: '圈圈眼', draw(ctx, A, p, t, o) {
    const L = life(p);
    both(ctx, A, s => {
      ctx.globalAlpha *= L.alpha; ctx.scale(1.3 * L.s, 1.3 * L.s); ctx.rotate(-t * 4.2 * s);
      ctx.strokeStyle = FACE.lash; ctx.lineWidth = 3.4; ctx.beginPath();
      for (let i = 0; i <= 150; i++) { const th = i / 150 * 5.1 * Math.PI, r = 1.5 + th * 1.42; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(th) * r, Math.sin(th) * r); }
      ctx.stroke();
    });
  } },
  // 泪眼：圆圆的大眼睛，高光晃动，下眼眶蓄着一汪水（委屈、求求你）
  'eyes-teary': { zh: '泪眼汪汪', draw(ctx, A, p, t, o) {
    const L = life(p), w = Math.sin(t * 7), w2 = Math.sin(t * 7 + 1.7);
    both(ctx, A, s => {
      ctx.globalAlpha *= L.alpha; ctx.scale(L.s, L.s);
      ctx.beginPath(); ctx.ellipse(0, 0, 27, 29, 0, 0, TAU); paint(ctx, C.white, o.ink, 3.2);
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 25.4, 27.4, 0, 0, TAU); ctx.clip();
      ctx.beginPath(); ctx.arc(0, 1, 20, 0, TAU); ctx.fillStyle = C.iris; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 1, 11, 0, TAU); ctx.fillStyle = C.irisDeep; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-30, 17 + w); ctx.quadraticCurveTo(-10, 11 + w2 * 1.5, 0, 16 + w); ctx.quadraticCurveTo(12, 21 - w2 * 1.5, 30, 15 - w); ctx.lineTo(30, 32); ctx.lineTo(-30, 32); ctx.closePath(); ctx.fillStyle = C.water; ctx.fill();
      ctx.restore();
      ctx.fillStyle = C.white;
      ctx.beginPath(); ctx.arc(-8 + w * 0.8, -9 + w2 * 0.8, 8, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(9 - w2 * 0.6, 5 + w * 0.6, 4, 0, TAU); ctx.fill();
      const bead = 0.55 + 0.45 * Math.sin(t * 2.4 + (s > 0 ? 1 : 0));
      ctx.save(); ctx.translate(17 * s, 30); ctx.scale(0.5 * bead, 0.5 * bead); drop(ctx); paint(ctx, C.water, o.ink, 3.6); ctx.restore();
    });
  } },
};

Object.assign(EYES, {
  // 笑眼 ^ ^：两道向上拱的弧（开心、得意）
  'eyes-smile': { zh: '笑眼', draw(ctx, A, p, t, o) { const L = life(p); both(ctx, A, s => { ctx.globalAlpha *= L.alpha; ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(-23, 9); ctx.quadraticCurveTo(0, -19 * L.a, 23, 9); ctx.stroke(); }); } },
  // 闭眼：两道向下垂的弧（睡着、安心）
  'eyes-closed': { zh: '闭眼', draw(ctx, A, p, t, o) { const L = life(p); both(ctx, A, s => { ctx.globalAlpha *= L.alpha; ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-23, 0); ctx.quadraticCurveTo(0, 15 * L.a, 23, 0); ctx.stroke(); ctx.lineWidth = 3.4; for (const x of [-1, 0.2]) { ctx.beginPath(); ctx.moveTo(s * (17 + x * 6), 5); ctx.lineTo(s * (23 + x * 6), 11); ctx.stroke(); } }); } },
  // 豆豆眼：瞳孔缩成两个小点（吓呆了）
  'eyes-dot': { zh: '豆豆眼', draw(ctx, A, p, t, o) { const L = life(p), sh = Math.sin(t * 40) * 0.6; both(ctx, A, s => { ctx.globalAlpha *= L.alpha; ctx.beginPath(); ctx.ellipse(0, 0, 25, 23, 0, 0, TAU); paint(ctx, FACE.white, FACE.lash, 3.2); ctx.beginPath(); ctx.arc(sh, 1, 5.2 * L.s, 0, TAU); ctx.fillStyle = FACE.pupil; ctx.fill(); }); } },
  'eyes-side': eyeVariant('斜视', (s, t, o) => ({ gx: 12 * o.side, gy: 2, lid: 0.16, flat: 0.5 })),
  'eyes-up': eyeVariant('往上看', () => ({ gy: -9, ry: 23 })),
  'eyes-down': eyeVariant('垂眼', () => ({ gy: 8, lid: 0.42, flat: 0.3 })),
  'eyes-wide': eyeVariant('睁大', (s, t) => ({ rx: 27, ry: 25, iris: 14.5 + 0.5 * Math.sin(t * 6) })),
  'eyes-half': eyeVariant('半闭', () => ({ lid: 0.5, flat: 0.9, gy: 4 })),
  'eyes-narrow': eyeVariant('眯起', () => ({ lid: 0.3, flat: 1, ry: 19 })),
  'eyes-askance': eyeVariant('半闭斜下看', (s, t, o) => ({ lid: 0.6, flat: 0.95, gy: 7, gx: 9 * o.side })),
  // 怀疑：一只眼眯成一条线，另一只正常
  'eyes-doubt': { zh: '一眯一睁', draw(ctx, A, p, t, o) { const L = life(p); both(ctx, A, s => { ctx.globalAlpha *= L.alpha; if (s === o.side) vecEye(ctx, s, { lid: 0.12, flat: 0.4, gx: -4 * o.side }); else { ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(-23, 5); ctx.lineTo(23, 2); ctx.stroke(); } }); } },
  // 单眼眨：一只笑成弧，另一只睁着（得意）
  'eyes-wink': { zh: '单眼眨', draw(ctx, A, p, t, o) { const L = life(p); both(ctx, A, s => { ctx.globalAlpha *= L.alpha; if (s !== o.side) vecEye(ctx, s, { gx: 3 * o.side }); else { ctx.strokeStyle = FACE.lash; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(-23, 9); ctx.quadraticCurveTo(0, -17, 23, 9); ctx.stroke(); } }); } },
});

// ════════════════════════════════════════════ 替换嘴（画在嘴的位置；角色要先把原来的嘴藏起来）
const mouthAt = (ctx, A, p, fn) => { const L = life(p); onFace(ctx, A, 'mouth', 0, 0, () => { ctx.globalAlpha *= L.alpha; ctx.scale(0.5 + 0.5 * L.s, 0.5 + 0.5 * L.s); ctx.strokeStyle = FACE.mouth; ctx.lineWidth = FACE.mouthW; fn(L); }); };
const openMouth = (ctx, path, ink) => { ctx.beginPath(); path(); ctx.closePath(); ctx.fillStyle = FACE.inside; ctx.fill(); ctx.save(); ctx.clip(); ctx.beginPath(); ctx.ellipse(0, 13, 9, 6, 0, 0, TAU); ctx.fillStyle = FACE.tongue; ctx.fill(); ctx.restore(); ctx.strokeStyle = ink; ctx.lineWidth = 2.6; ctx.beginPath(); path(); ctx.closePath(); ctx.stroke(); };
const MOUTHS = {
  // 猫嘴 ω：两个明显的圆弧，中间一个向上的尖
  'mouth-cat': { zh: '猫嘴 ω', draw(ctx, A, p) { mouthAt(ctx, A, p, () => { ctx.beginPath(); ctx.moveTo(-19, -5); ctx.bezierCurveTo(-19, 9, -3, 9, 0, -5); ctx.bezierCurveTo(3, 9, 19, 9, 19, -5); ctx.stroke(); }); } },
  // 波浪嘴：横向拉宽到两眼间距的六成，三个波
  'mouth-wavy': { zh: '波浪嘴', draw(ctx, A, p, t) { mouthAt(ctx, A, p, () => { const w = Math.sin(t * 9) * 0.8; ctx.beginPath(); ctx.moveTo(-30, 2); for (let i = 0; i < 6; i++) { const x0 = -30 + i * 10; ctx.quadraticCurveTo(x0 + 5, 2 + (i % 2 ? 7 : -7) + (i % 2 ? -w : w), x0 + 10, 2); } ctx.stroke(); }); } },
  'mouth-o': { zh: '大张 O', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, L => { openMouth(ctx, () => ctx.ellipse(0, 7, 13, 17 * (0.6 + 0.4 * L.a), 0, 0, TAU), o.ink); }); } },
  'mouth-small': { zh: '小圆嘴', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, () => { ctx.beginPath(); ctx.ellipse(0, 2, 4.6, 5.4, 0, 0, TAU); ctx.fillStyle = FACE.inside; ctx.fill(); ctx.strokeStyle = o.ink; ctx.lineWidth = 2.2; ctx.stroke(); }); } },
  'mouth-tri': { zh: '▽ 开心', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, () => { openMouth(ctx, () => { ctx.moveTo(-15, -4); ctx.quadraticCurveTo(0, -1, 15, -4); ctx.quadraticCurveTo(9, 15, 0, 16); ctx.quadraticCurveTo(-9, 15, -15, -4); }, o.ink); }); } },
  'mouth-three': { zh: '3 形嘴', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, () => { ctx.scale(o.side, 1); ctx.beginPath(); ctx.moveTo(-3, -7); ctx.bezierCurveTo(7, -8, 7, 0, -1, 0); ctx.bezierCurveTo(8, 0, 8, 9, -3, 8); ctx.stroke(); }); } },
  'mouth-flat': { zh: '抿平', draw(ctx, A, p) { mouthAt(ctx, A, p, () => { ctx.beginPath(); ctx.moveTo(-8, 2); ctx.lineTo(8, 2); ctx.stroke(); }); } },   // 抿嘴：一条直短线
  'mouth-smirk': { zh: '歪嘴', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, () => { ctx.beginPath(); ctx.moveTo(-11 * o.side, 2); ctx.quadraticCurveTo(2 * o.side, 4, 12 * o.side, -5); ctx.stroke(); }); } },
  'mouth-frown': { zh: '嘴角下弯', draw(ctx, A, p) { mouthAt(ctx, A, p, () => { ctx.beginPath(); ctx.moveTo(-16, 9); ctx.bezierCurveTo(-12, -9, 12, -9, 16, 9); ctx.stroke(); }); } },   // 明显的倒 U
  'mouth-teeth': { zh: '咬牙', draw(ctx, A, p, t, o) { mouthAt(ctx, A, p, () => { const tr = Math.sin(t * 38) * 0.4; ctx.translate(tr, 0); ctx.beginPath(); ctx.roundRect(-15, -5, 30, 13, 4); ctx.fillStyle = FACE.teeth; ctx.fill(); ctx.strokeStyle = o.ink; ctx.lineWidth = 2.4; ctx.stroke(); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-15, 1.5); ctx.lineTo(15, 1.5); for (const x of [-7.5, 0, 7.5]) { ctx.moveTo(x, -5); ctx.lineTo(x, 8); } ctx.stroke(); }); } },
};

// ════════════════════════════════════════════ 替换眉（角色要先把原来的眉毛藏起来）
// 每条眉：内端、外端相对眉心的高度（单位，负 = 往上），加一点弧度。原画的眉是一条青绿色的粗弧线。
const browPair = (zh, spec) => ({ zh, draw(ctx, A, p, t, o) {
  const L = life(p);
  for (const [key, s] of [['browL', -1], ['browR', 1]]) onFace(ctx, A, key, 0, 0, () => {
    const b = spec(s, o), k = L.a;                                   // s：-1 = 画面左那条；内端在 -s 方向
    ctx.globalAlpha *= L.alpha; ctx.strokeStyle = FACE.brow; ctx.lineWidth = FACE.browW;
    const xi = -s * 24, xo = s * 26, yi = (b.inner ?? 0) * k + (b.lift ?? 0), yo = (b.outer ?? 0) * k + (b.lift ?? 0);
    ctx.beginPath(); ctx.moveTo(xi, yi); ctx.quadraticCurveTo(0, (yi + yo) / 2 - (b.arch ?? 5), xo, yo); ctx.stroke();
  });
} });
const BROWS = {
  'brows-worried': browPair('八字眉', () => ({ inner: -14, outer: 9, arch: 3 })),
  'brows-low': browPair('压低', () => ({ inner: 5, outer: 0, arch: 0, lift: 17 })),
  'brows-angry': browPair('倒八怒眉', () => ({ inner: 13, outer: -9, arch: 1, lift: 6 })),
  'brows-skeptic': browPair('一高一低', (s, o) => (s === o.side ? { inner: -6, outer: -12, arch: 8, lift: -9 } : { inner: 8, outer: 2, arch: 1, lift: 5 })),
  'brows-raised': browPair('抬高', () => ({ inner: -2, outer: 0, arch: 9, lift: -11 })),
  'brows-droop': browPair('垂眉', () => ({ inner: -7, outer: 15, arch: 2, lift: 5 })),
};

export const EMOTES = {};
for (const [k, v] of Object.entries(SYMBOLS)) EMOTES[k] = { ...v, kind: 'symbol', layer: k === 'gloom' || k === 'blush' ? 'face' : k === 'focus' ? 'back' : 'top' };
EMOTES.gloom.layers = ['face', 'top'];          // 黑线跨两层：阴影在 face，竖线在 top
/** 这个部件在不在这一层上要画（大多数只在自己的 layer；黑线跨 face 和 top 两层）。分层画的地方都用它判断。 */
export const inLayer = (name, layer) => { const e = EMOTES[name]; return !!e && (e.layer === layer || !!e.layers?.includes(layer)); };
for (const [k, v] of Object.entries(EYES)) EMOTES[k] = { ...v, kind: 'eyes', layer: 'face' };
for (const [k, v] of Object.entries(MOUTHS)) EMOTES[k] = { ...v, kind: 'mouth', layer: 'face' };
for (const [k, v] of Object.entries(BROWS)) EMOTES[k] = { ...v, kind: 'brows', layer: 'face' };
// 停用的部件。叹气三个变体（sigh / sigh-puff / sigh-curl）2026-10-07 被否（「叹气不太对，叹气先不要了」）：代码留着，标成 disabled，
// 不进 EMOTE_NAMES、不进预设、不出现在总表和演示片里。drawEmote 按名字仍能画出来，只是不对外列。
export const DISABLED = ['sigh', 'sigh-puff', 'sigh-curl', 'eyes-doubt'];   // eyes-doubt（一眯一睁）只有「怀疑」用；一高一低眉「问号」还在用，留着
for (const k of DISABLED) EMOTES[k].disabled = true;
export const EMOTE_NAMES = Object.keys(EMOTES).filter(k => !EMOTES[k].disabled);

/**
 * 把三维讲解员 host.anchors() 的返回值换成本文件用的锚点：带上脸的切平面矩阵（贴脸的东西跟着头转有透视压缩）
 * 和每个点的 facing（转到侧后时自动淡出）。
 */
export function anchorsFromHost(h) {
  const P = h.pt, side = P.eyeL.facing != null ? Math.min(P.eyeL.facing, P.eyeR.facing) : 1;
  return {
    // 姿势差分版（host-pose.js）没有 face 矩阵和 facing：贴脸的都走 faceLayer，这里只给头周围的符号用，按两眼连线定大小和倾斜
    head: h.face ? { x: h.face[4], y: h.face[5] } : { x: (P.eyeL.x + P.eyeR.x) / 2, y: (P.eyeL.y + P.eyeR.y) / 2, rot: Math.atan2(P.eyeR.y - P.eyeL.y, P.eyeR.x - P.eyeL.x) },
    ...(h.face ? { face: h.face } : {}), facing: Math.min(P.forehead?.facing ?? 1, side + 0.25),
    eyeL: P.eyeL, eyeR: P.eyeR, brow: P.forehead, cheekL: P.cheekL, cheekR: P.cheekR, top: P.top, mouth: P.mouth,
  };
}

// ════════════════════════════════════════════ 表情预设：脸 + 漫符 + 头姿态 + 建议动作
// pose 用的是讲解员动作库里的名字（think 托腮 / shrug 摊手 / covermouth 捂嘴 / surprise 吓一跳 / hips 叉腰；clasp 双手相碰 / behind 背手 / wave 挥手 库里还没有，会当待机）。
// 2026-10-07：抱头（headhold）从动作库里撤了，原来配它的三个预设改配 think / covermouth / 待机。
const P_ = (zh, o) => ({ zh, eyes: null, mouth: null, brows: null, symbols: [], head: {}, pose: null, expr: {}, ...o });
export const PRESETS = {
  // ── 16 个漫符各自配套的脸（名字和漫符相同）
  gloom:    P_('黑线',     { eyes: 'eyes-flat', brows: 'brows-droop', mouth: 'mouth-flat', symbols: ['gloom'], head: { nod: 0.1 } }),
  sweat:    P_('汗滴',     { eyes: 'eyes-side', brows: 'brows-worried', mouth: 'mouth-smirk', symbols: ['sweat'], head: { tilt: -0.07 } }),
  vein:     P_('青筋',     { eyes: 'eyes-narrow', brows: 'brows-angry', mouth: 'mouth-teeth', symbols: ['vein'], head: { nod: 0.06 }, pose: 'hips' }),
  question: P_('问号',     { eyes: 'eyes-up', brows: 'brows-skeptic', mouth: 'mouth-small', symbols: ['question'], head: { tilt: 0.16 }, pose: 'think' }),
  exclaim:  P_('感叹号',   { eyes: 'eyes-dot', brows: 'brows-raised', mouth: 'mouth-o', symbols: ['exclaim'], head: { nod: -0.07 }, pose: 'surprise' }),
  blush:    P_('脸红',     { eyes: 'eyes-side', brows: 'brows-worried', mouth: 'mouth-wavy', symbols: ['blush'], head: { tilt: -0.12, nod: 0.1 } }),
  bulb:     P_('灯泡',     { eyes: 'eyes-wide', brows: 'brows-raised', mouth: 'mouth-tri', symbols: ['bulb'], head: { nod: -0.05 } }),
  cloud:    P_('乌云',     { eyes: 'eyes-down', brows: 'brows-droop', mouth: 'mouth-frown', symbols: ['cloud'], head: { nod: 0.18 } }),
  hearts:   P_('爱心',     { eyes: 'eyes-smile', mouth: 'mouth-cat', symbols: ['hearts', 'blush'], head: { tilt: 0.1 }, pose: 'clasp' }),
  flowers:  P_('小花',     { eyes: 'eyes-smile', mouth: 'mouth-tri', symbols: ['flowers'], head: { tilt: -0.08 } }),
  ghost:    P_('灵魂出窍', { eyes: 'eyes-flat', brows: 'brows-droop', mouth: 'mouth-o', symbols: ['ghost'], head: { nod: -0.1, tilt: 0.08 } }),
  zzz:      P_('睡着',     { eyes: 'eyes-closed', mouth: 'mouth-small', symbols: ['zzz'], head: { nod: 0.14, tilt: 0.12 } }),
  dots:     P_('省略号',   { eyes: 'eyes-askance', brows: 'brows-low', mouth: 'mouth-flat', symbols: ['dots'], head: { tilt: 0.06, nod: 0.05 } }),
  sparkle:  P_('闪光',     { eyes: 'eyes-wink', brows: 'brows-raised', mouth: 'mouth-smirk', symbols: ['sparkle'], head: { tilt: 0.09, nod: -0.06 }, pose: 'hips' }),
  focus:    P_('集中线',   { eyes: 'eyes-wide', brows: 'brows-angry', mouth: 'mouth-o', symbols: ['focus'], head: { nod: -0.04 } }),
  // ── 常用的组合表情
  speechless: P_('无语',     { eyes: 'eyes-flat', brows: 'brows-low', mouth: 'mouth-flat', symbols: ['sweat'], pose: 'shrug' }),
  confused:   P_('想不明白', { eyes: 'eyes-spiral', brows: 'brows-worried', mouth: 'mouth-wavy', symbols: ['question'], head: { tilt: 0.12 }, pose: 'think' }),
  breakdown:  P_('崩溃',     { eyes: 'eyes-squeeze', brows: 'brows-worried', mouth: 'mouth-o', symbols: ['focus'], head: { nod: -0.08 }, pose: 'covermouth' }),
  smug:       P_('得意',     { eyes: 'eyes-smile', brows: 'brows-raised', mouth: 'mouth-cat', symbols: ['sparkle'], head: { tilt: 0.08, nod: -0.06 }, pose: 'hips' }),
  shocked:    P_('被吓到',   { eyes: 'eyes-dot', brows: 'brows-raised', mouth: 'mouth-o', symbols: ['exclaim'], head: { nod: -0.1 }, pose: 'covermouth' }),
  guilty:     P_('心虚',     { eyes: 'eyes-side', brows: 'brows-worried', mouth: 'mouth-wavy', symbols: ['sweat'], head: { tilt: -0.1, nod: 0.05 }, pose: 'behind' }),
  wronged:    P_('委屈',     { eyes: 'eyes-teary', brows: 'brows-worried', mouth: 'mouth-frown', symbols: [], head: { nod: 0.08, tilt: 0.06 }, pose: 'clasp' }),
  angry:      P_('生气',     { eyes: 'eyes-narrow', brows: 'brows-angry', mouth: 'mouth-frown', symbols: ['vein'], pose: 'hips' }),
  eureka:     P_('恍然大悟', { eyes: 'eyes-wide', brows: 'brows-raised', mouth: 'mouth-tri', symbols: ['bulb'], head: { nod: -0.06 } }),
  sleepy:     P_('犯困',     { eyes: 'eyes-half', brows: 'brows-droop', mouth: 'mouth-o', symbols: ['zzz'], head: { nod: 0.12, tilt: 0.12 } }),
  awkward:    P_('尴尬',     { eyes: 'eyes-dot', brows: 'brows-worried', mouth: 'mouth-wavy', symbols: ['gloom'], head: { nod: 0.05 } }),   // 只留黑线（用户：「尴尬表情就不要汗滴了，有黑线了」）
  lovestruck: P_('花痴',     { eyes: 'eyes-star', mouth: 'mouth-cat', symbols: ['blush', 'hearts'], head: { tilt: 0.1 }, pose: 'clasp' }),
  dejected:   P_('沮丧',     { eyes: 'eyes-closed', brows: 'brows-droop', mouth: 'mouth-frown', symbols: ['cloud'], head: { nod: 0.2 } }),
  relieved:   P_('得救了',   { eyes: 'eyes-closed', brows: 'brows-droop', mouth: 'mouth-small', symbols: [], head: { nod: 0.14, tilt: 0.05, lean: 0.03 } }),   // 不用叹气符号：闭眼 + 眉放松 + 嘴微张 + 头一低
  serious:    P_('认真',     { eyes: 'eyes-narrow', brows: 'brows-low', mouth: 'mouth-flat', symbols: [['focus', { alpha: 0.3 }]] }),
  happy:      P_('开心',     { eyes: 'eyes-smile', mouth: 'mouth-tri', symbols: ['flowers'], head: { tilt: -0.08 }, pose: 'wave' }),
  doubt:      P_('怀疑',     { eyes: 'eyes-doubt', brows: 'brows-skeptic', mouth: 'mouth-smirk', symbols: ['dots'], head: { tilt: 0.12 } }),
  dizzy:      P_('晕了',     { eyes: 'eyes-spiral', brows: 'brows-droop', mouth: 'mouth-wavy', symbols: [], head: { tilt: 0.14 } }),
};
// 「怀疑」2026-10-07 被否（「怀疑表情也不要，也先不要了」）：预设留着但标 disabled，不进 PRESET_NAMES、总表和演示片；emotePreset('doubt') 仍取得到。
// 「心虚」「得救了」同一天被否（「心虚、得救了表情也不要了，不好」），同样处理。
for (const k of ['doubt', 'guilty', 'relieved']) PRESETS[k].disabled = true;
export const PRESET_NAMES = Object.keys(PRESETS).filter(k => !PRESETS[k].disabled);
// 能用角色自己的部件做出来的眼和眉（三维讲解员的 state.face）：这些就不画矢量替换，让原画的眼睛自己变。
// 必须整只换掉的（> <、— —、星星、圈圈、泪眼）、一高一低眉（rig 的眉毛只能两边一起动）和怒眉不在表里，仍然画矢量的。
export const RIG_EYES = {
  'eyes-side': s => ({ eyeX: 1.7 * s, eyeOpen: 0.72 }), 'eyes-up': () => ({ eyeY: -0.85, eyeOpen: 1.1 }), 'eyes-down': () => ({ eyeY: 1.3, eyeOpen: 0.42 }),
  'eyes-wide': () => ({ eyeOpen: 1.2, irisScale: 0.9 }), 'eyes-half': () => ({ eyeOpen: 0.34, eyeY: 0.3 }), 'eyes-askance': s => ({ eyeOpen: 0.27, eyeY: 0.9, eyeX: 1.1 * s }), 'eyes-narrow': () => ({ eyeOpen: 0.5 }),
  'eyes-dot': () => ({ eyeOpen: 1.22, irisScale: 0.5 }), 'eyes-smile': () => ({ eyeSmile: 1 }), 'eyes-closed': () => ({ blink: 1 }),
};
export const RIG_BROWS = {
  'brows-raised': { browY: 1 },   // 八字眉、垂眉、怒眉、压低都不在这里：rig 的眉毛转不到 20° 以上，这几种画矢量的
};
const FACE_REST = { eyeOpen: 1, irisScale: 1, eyeX: 0, eyeY: 0, eyeSmile: 0, blink: 0, browY: 0, browTilt: 0 };
/** 取一个预设（副本）。也可以直接传一个自己拼的对象给 drawPreset。 */
export function emotePreset(name) { const q = PRESETS[name]; if (!q) throw new Error(`chibi-emotes: 没有叫 ${name} 的预设（可用：${PRESET_NAMES.join(' ')}）`); return { name, ...q, head: { ...q.head }, symbols: [...q.symbols], expr: { ...q.expr } }; }
const asPreset = q => (typeof q === 'string' ? emotePreset(q) : q);
/**
 * 这个预设要讲解员配合的状态：藏哪些原部件、头怎么摆、做什么动作。展开到讲解员的 state 里。w = 强度 0–1。
 * o.rig = true（三维讲解员）：能用原画眼睛、眉毛做的变化走 state.face（眼睑、视线、瞳孔、眉角度随 w 渐变），不藏原部件；
 *   这时 drawPreset 也要带 { rig: true }，它会跳过这些部件的矢量版。o.side 同 drawEmote。
 */
export function presetHost(q, w = 1, o = {}) {
  q = asPreset(q); if (!q) return {};
  const on = w > 0.5, s = { tilt: (q.head?.tilt || 0) * w, nod: (q.head?.nod || 0) * w, lean: (q.head?.lean || 0) * w, expr: {}, talk: false };
  const rigEyes = o.rig && RIG_EYES[q.eyes], rigBrows = o.rig && RIG_BROWS[q.brows];
  if (rigEyes || rigBrows) { const f = { ...(rigEyes ? rigEyes(o.side ?? 1) : {}), ...(rigBrows || {}) }; s.face = {}; for (const [k, v] of Object.entries(f)) s.face[k] = FACE_REST[k] + (v - FACE_REST[k]) * w; }
  if (on && q.eyes && !rigEyes) s.eyes = 'hide'; if (on && q.mouth) s.mouth = 'hide'; if (on && q.brows && !rigBrows) s.brows = 'hide';
  // 旧的 host3d 里 state.mouth='hide' 藏不掉嘴（它先按口型名选图、后看隐藏开关）；给一个不存在的口型名，四张嘴就都不画了
  if (o.mouthNone && on && q.mouth) s.face = { ...(s.face || {}), mouth: 'none' };   // 只给旧的 host3d 用；host-pose.js 里 mouth='hide' 是好的
  if (q.pose) s.pose = { [q.pose]: w };
  for (const [k, v] of Object.entries(q.expr || {})) s.expr[k] = v * w;
  return s;
}
/**
 * 画一整套：眉 → 眼 → 嘴 → 漫符。p、t 同 drawEmote。
 * **分三层画**：opts.layer = 'face' 只画贴脸的（眉、眼、嘴、脸红、黑线）——这一层要在脸的上面、前发 / 侧发 / 帽子的下面；
 * opts.layer = 'top' 只画头周围的符号（和黑线的竖线）——在人物最上面（手的位置由讲解员挖掉）；opts.layer = 'back' 只画集中线——在人物背后。
 * 不给 layer 就全画在一起（只适合没有遮挡问题的场合）。opts.bakedBrows：眉毛画死在立绘里时，先盖掉再画矢量眉。
 */
export function drawPreset(ctx, q, anchors, p, t = 0, opts = {}) {
  q = asPreset(q); if (!q || !(p > 0 && p < 1)) return;
  const want = name => (!opts.layer || inLayer(name, opts.layer)) && !(opts.rig && (RIG_EYES[name] || (RIG_BROWS[name] && !opts.bakedBrows)));
  // 眉毛画死在立绘里的姿势（讲解员的 B 类姿势）：先用肤色把原来的眉毛盖掉，再画矢量眉
  if (opts.bakedBrows && q.brows && (!opts.layer || opts.layer === 'face')) for (const key of ['browL', 'browR']) onFace(ctx, anchors, key, 0, 2, () => { const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 34); g.addColorStop(0, FACE.skin); g.addColorStop(0.7, FACE.skin); g.addColorStop(1, 'rgba(251,227,212,0)'); ctx.scale(1, 0.5); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fill(); });
  for (const part of [q.brows, q.eyes, q.mouth]) if (part && want(part)) drawEmote(ctx, part, anchors, p, t, opts);
  for (const sy of q.symbols || []) { const [name, o] = Array.isArray(sy) ? sy : [sy, {}]; if (want(name)) drawEmote(ctx, name, anchors, p, t, { ...opts, ...o }); }
}
/** 从预设 a 过渡到 b：前一半 a 收掉，后一半 b 弹出。返回这一刻该用哪个预设、强度多少（给 presetHost 用）。a、b 可以是 null（= 没有表情）。 */
export function mixPreset(a, b, k) { k = clamp(k); return k < 0.5 ? { preset: a, p: 0.86 + 0.14 * (k / 0.5) * 0.999, w: 1 - smooth(k / 0.5) } : { preset: b, p: 0.001 + 0.18 * ((k - 0.5) / 0.5), w: smooth((k - 0.5) / 0.5) }; }
export function drawPresetMix(ctx, a, b, k, anchors, t = 0, opts = {}) { const m = mixPreset(a, b, k); if (m.preset) drawPreset(ctx, m.preset, anchors, m.p, t, opts); return m; }
/** 把漫符层在手的位置挖掉（手抬到脸前时用）。只能用在专门画漫符的那张 canvas 上。circles: [{ x, y, r }] */
export function cutOut(ctx, circles) { ctx.save(); ctx.globalCompositeOperation = 'destination-out'; for (const c of circles) { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, TAU); ctx.fill(); } ctx.restore(); }

/** 画一个漫符。p 不在 (0,1) 内时不画。 */
export function drawEmote(ctx, name, anchors, p, t = 0, opts = {}) {
  const e = EMOTES[name];
  if (!e) throw new Error(`chibi-emotes: 没有叫 ${name} 的漫符（可用：${EMOTE_NAMES.join(' ')}）`);
  if (!(p > 0 && p < 1)) return;
  ctx.save();
  if (opts.alpha != null) ctx.globalAlpha *= opts.alpha;
  e.draw(ctx, anchors, p, t, { ink: INK, side: 1, ...opts });
  ctx.restore();
}
