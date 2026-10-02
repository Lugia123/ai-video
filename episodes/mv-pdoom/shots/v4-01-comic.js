// shots/v4-01-comic.js — v4-01 的四页动态漫画（kits/comic.js，W2 #945 / #946）。页与页之间推格 / 翻页衔接。
//   const pages = await makeV401Comic(mv, { ui });   // → [A, L, S, F] 四个镜头
//
// A  3.42–9.783  「I see sparks of AGI in your eyes / Your circuits make me nervous, / that's no surprise」—— 恋爱游戏式
//    a1 夜里卧室，她趴床捧手机（t1 + 千问卧室背景）；HAL 眼里的火花飞进她的手机
//    a2 双手捧手机特写：「…」→ AGI → in your eyes（千问 hands-phone，绿屏抠空垫 ui2d）
//    d1 她脸红冒汗（face2d happy → fear），两根手指戳来戳去，DOKI DOKI；对话泡「Your circuits make me nervous,」
//    d2 手机那头的 AI：发光电路线画出来的「脸」，冲她眨眼（纯代码）
//    d3 「that's no surprise」：尴尬（face2d sad）+ 大汗珠 + 耸肩线 + 一行吐槽小字 → 镜头推进 d2 的 AI 眼睛（推格）
// L  9.783–12.965 「There was a sudden drop in your training loss」—— 没有人物：发光小球（= 模型）
//    一整格窗户（3D 损失曲线世界）→ 镜头穿进格子（comic.enter）→ 小球沿曲线滚、陡降处过山车式俯冲，镜头贴轨追；
//    歌词刻在轨道上、字头朝镜头；谷底 loss：满屏散的数据点「咔」地排成网格，一张神经网络从暗到全亮
// S  12.965–16.601 「now I'm your servant and you're my boss」—— 身份互换两格对照（新页翻进来）
//    s1 她翘腿坐电竞椅对手机发号施令，头顶标签 USER / 手机 ASSISTANT
//    s2 同构图：手机（屏幕上一只发光的眼）坐在她的椅子上，她站旁边端托盘低头；唱到 servant 标签翻转互换；boss：3D BOSS 印章弹出纸面
// F  16.601–22.1 「ChatGPT, please don't eat me alive」—— 致敬《恐怖小店》：聊天气泡小盆栽（原创造型，代码画），上一页翻走露出这一页
//    f1 她跪着喂它数据（文件 / 图片 / 字飞进嘴）  f2 它长大了，FEED ME  f3 她逐词打「ChatGPT, please don't eat me」求饶
//    f4 跨页：巨型气泡食人花占满房间，FEED ME 大字；alive 一口扑向她 → 镜头进它嘴里 → 曼德博（AI 肚子里）→ 22.1 接副歌 1
// 立绘切边：关键画都比格子大 / 贴边处在格框外。所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createComic, C, CF } from '../kits/comic.js';
import { hash } from '../kits/ui2d.js';
import { textTexture } from '../kits/world4.js';
import { createMandelbrot } from '../kits/mathart.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);

const IMG = new URL('../../cast-cyber-girl/closeup/', import.meta.url);
async function loadImg(rel) { const im = new Image(); im.src = new URL(rel, IMG).href; await im.decode(); return im; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function deskBg() {
  const c = canvas(16, 256), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#2a1d4a'); gr.addColorStop(1, '#0e0b18'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// comic.js 视差读父级 matrixWorld：先摆好刷新矩阵再画（乱序 seek 一致）
function comicFrame(comic, camera, T) { camera.updateMatrixWorld(); comic.update(T, { camera }); comic.group.updateMatrixWorld(true); comic.update(T, { camera }); }
const post = (T, kick, extra = {}) => ({ bloom: { strength: 0.6, threshold: 1.0 }, grade: { vignette: 0.28 }, chroma: 0.06 + 0.15 * kick(T), ...extra });

export async function makeV401Comic(mv, { ui }) {
  const { music, lyrics } = mv;
  const D = ui.draw;
  const L = i => lyrics.lines[i];
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const img = Object.fromEntries(await Promise.all([
    ['typing', 'flood/layers/key-t1-typing.png'], ['lookup', 'flood/layers/key-t2-lookup.png'],
    ['bg', 'v401comic/layers/bg-bedroom.png'], ['hands', 'v401comic/layers/hands-phone.png'],
    ['fHappy', 'v401comic/layers/face-happy.png'], ['fFear', 'v401comic/layers/face-fear.png'],
    ['boss', 'v401b/layers/key-s1-boss.png'], ['servant', 'v401b/layers/key-s2-servant.png'], ['feed', 'v401b/layers/key-f-feed.png'],
  ].map(async ([k, p]) => [k, await loadImg(p)])));
  // face2d 的 sad（尴尬）：白底整张，现场抠一次（和四边相连的近白 → 透明）
  img.fSad = await (async () => {
    const im = await loadImg('../../mv-pdoom/kits/face2d/z0/expr/sad.png'), c = canvas(im.width, im.height), x = c.getContext('2d');
    x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height), a = d.data, W = c.width, H = c.height, seen = new Uint8Array(W * H), st = [];
    const white = i => a[i * 4] > 232 && a[i * 4 + 1] > 232 && a[i * 4 + 2] > 232;
    for (let xx = 0; xx < W; xx++) st.push(xx, (H - 1) * W + xx); for (let yy = 0; yy < H; yy++) st.push(yy * W, yy * W + W - 1);
    while (st.length) { const i = st.pop(); if (seen[i] || !white(i)) continue; seen[i] = 1; a[i * 4 + 3] = 0; const xx = i % W, yy = (i / W) | 0; if (xx > 0) st.push(i - 1); if (xx < W - 1) st.push(i + 1); if (yy > 0) st.push(i - W); if (yy < H - 1) st.push(i + W); }
    x.putImageData(d, 0, 0); return c;
  })();

  // ================================================================ 画布画家（共用）
  function drawBedroom(c, b, T, { glow = null, focus = [0.55, 0.55], dark = 0.25 } = {}) {
    const W = b.w, H = b.h, im = img.bg, s = Math.max(W / im.width, H / im.height) * 1.08;
    c.drawImage(im, W * focus[0] - im.width * s * focus[0], H * focus[1] - im.height * s * focus[1], im.width * s, im.height * s);
    c.fillStyle = `rgba(20,12,40,${dark})`; c.fillRect(0, 0, W, H);
    if (glow) { const g = c.createRadialGradient(glow[0] * W, glow[1] * H, 10, glow[0] * W, glow[1] * H, W * 0.5); g.addColorStop(0, `rgba(190,255,245,${0.45 * (glow[2] ?? 1)})`); g.addColorStop(1, 'rgba(190,255,245,0)'); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore(); }
  }
  function drawFold(c, b, y) {
    c.fillStyle = '#f7a9cf'; c.strokeStyle = PAL.ink; c.lineWidth = 8;
    c.beginPath(); c.moveTo(-60, y); for (let i = 0; i <= 12; i++) c.quadraticCurveTo(b.w * (i - 0.5) / 12, y - 26 - 14 * hash(i, 9), b.w * i / 12, y + 6 * Math.sin(i)); c.lineTo(b.w + 60, b.h + 60); c.lineTo(-60, b.h + 60); c.closePath(); c.fill(); c.stroke();
  }
  function drawLying(c, b, T, key, { scale = 1.05, bob = 3 } = {}) {
    const im = img[key], s = b.w * scale / im.width;
    c.drawImage(im, (b.w - im.width * s) / 2, b.h - 30 - 690 * s + bob * Math.sin(T * 2.4), im.width * s, im.height * s);
  }
  const SCR = [584, 66, 815, 557], SCX = (SCR[0] + SCR[2]) / 2, SCY = (SCR[1] + SCR[3]) / 2;
  function drawHandsPhone(c, cx, cy, s, uiS) {
    const x0 = cx - SCX * s, y0 = cy - SCY * s, sw = (SCR[2] - SCR[0]) * s, sh = (SCR[3] - SCR[1]) * s, sx = x0 + SCR[0] * s, sy = y0 + SCR[1] * s;
    if (uiS) { c.save(); ui.rrect(c, sx, sy, sw, sh, 24 * s); c.clip(); const us = Math.max(sw / 720, sh / 1280); c.drawImage(uiS.canvas, sx + sw / 2 - 360 * us, sy + sh / 2 - 640 * us, 720 * us, 1280 * us); c.restore(); }
    c.drawImage(img.hands, x0, y0, img.hands.width * s, img.hands.height * s);
  }
  // 人脸类关键画（832×1248）：脸中心（424, 470）放到格内 (x, y)，缩放 s
  function drawFace(c, im, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.drawImage(im, -424, -470); c.restore(); }
  function sweat(c, x, y, size, T) {
    c.save(); c.translate(x, y + 4 * Math.sin(T * 9)); c.fillStyle = '#bfe8ff'; c.strokeStyle = PAL.ink; c.lineWidth = size * 0.08;
    c.beginPath(); c.moveTo(0, -size); c.quadraticCurveTo(size * 0.7, 0, 0, size * 0.45); c.quadraticCurveTo(-size * 0.7, 0, 0, -size); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.ellipse(-size * 0.15, -size * 0.15, size * 0.1, size * 0.2, -0.3, 0, 7); c.fill(); c.restore();
  }
  const heart = (c, x, y, s, fill = PAL.pink) => { c.fillStyle = fill; c.beginPath(); c.moveTo(x, y + s); c.bezierCurveTo(x - s * 1.4, y, x - s * 0.6, y - s, x, y - s * 0.3); c.bezierCurveTo(x + s * 0.6, y - s, x + s * 1.4, y, x, y + s); c.fill(); };

  // ================================================================================================ 页 A
  const l0 = L(0), l1 = L(1), l2 = L(2);
  const agi = l0.words.find(w => /AGI/.test(w.w)), eyesW = l0.words.filter(w => w.start > agi.end);
  const tNerv = l1.words.find(w => /nervous/.test(w.w)).start;
  const A = await createComic(mv, { w: 20, h: 11.25, seed: 17 });
  const sceneA = new THREE.Scene(); sceneA.background = deskBg(); sceneA.add(A.group);
  A.group.rotation.set(-0.05, -0.04, -0.01);
  const camA = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const uiA = ui.surface(720, 1280);
  function phoneA(T) {
    const msgs = [{ from: 'them', text: 'AGI', at: agi.start, typingFrom: 3.45, size: 150 }, { from: 'them', words: eyesW, typingFrom: agi.end + 0.1 }];
    uiA.clear(PAL.paper);
    D.chatHeader(uiA.ctx, { x: 0, y: 0, w: 720, h: 130 }, T, { name: 'Assistant', typing: T < agi.start || (T > agi.end && T < eyesW[0].start) });
    D.thread(uiA.ctx, { x: 8, y: 140, w: 704, h: 990 }, T, { msgs, size: 64, gap: 26 });
    D.inputBox(uiA.ctx, { x: 24, y: 1150, w: 672, h: 100 }, T, { text: '', size: 44 });
    uiA.commit();
  }
  A.panel({ id: 'a1', rect: [0.02, 0.03, 0.46, 0.47], reveal: { at: 3.3, kind: 'drop', dur: 0.35 }, dim: { at: 5.9, amount: 0.3 },
    layers: [
      { depth: 1.6, draw: (c, b, T) => drawBedroom(c, b, T, { glow: [0.5, 0.62, 1 + 0.3 * Math.exp(-(T - 3.62) * 4) * (T > 3.62)] }) },
      { depth: 0.3, draw: (c, b, T) => drawLying(c, b, T, 'typing') },
      { depth: 0, draw: (c, b) => drawFold(c, b, b.h * 0.9) },
    ] });
  A.panel({ id: 'a2', rect: [0.5, 0.03, 0.2, 0.47], reveal: { at: 3.5, kind: 'slide', dir: 'r', dur: 0.3 }, dim: { at: 5.9, amount: 0.3 },
    layers: [
      { depth: 1.2, draw: (c, b, T) => { c.fillStyle = '#1b1530'; c.fillRect(-40, -40, b.w + 80, b.h + 80); C.focusLines(c, b, T, { fx: 0.5, fy: 0.4, inner: 0.5, n: 60, color: '#8ff5dc', alpha: 0.25 }); } },
      { depth: 0.1, draw: (c, b, T) => { phoneA(T); drawHandsPhone(c, b.w / 2, b.h * 0.42, b.h * 0.9 / 520, uiA); } },
    ] });
  A.sparks({ from: [0.3, -0.25], to: [0.25, 0.37], at: 3.42, dur: 0.35, n: 60, color: PAL.lemon, arc: 1.5, burst: true });
  A.shock({ x: 0.25, y: 0.37, at: 3.77, dur: 0.4, radius: 1.6, color: PAL.mint });
  // d2：发光电路线画的 AI 脸（冲她眨眼）
  const winks = [6.75, 8.6];
  function drawAIFace(c, b, T) {
    c.fillStyle = '#0b0f24'; c.fillRect(-40, -40, b.w + 80, b.h + 80);
    c.strokeStyle = 'rgba(143,245,220,0.12)'; c.lineWidth = 2; for (let x = 0; x < b.w; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, b.h); c.stroke(); } for (let y = 0; y < b.h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(b.w, y); c.stroke(); }
    const p = smooth((T - 5.95) / 0.7), cx = b.w / 2, cy = b.h * 0.48, R = Math.min(b.w, b.h) * 0.36;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = PAL.mint; c.shadowBlur = 18; c.strokeStyle = '#bff7ea'; c.lineWidth = 6;
    const seg = (pts, k) => { const n = Math.floor(pts.length * clamp(k)); if (n < 2) return; c.beginPath(); c.moveTo(...pts[0]); for (let i = 1; i < n; i++) c.lineTo(...pts[i]); c.stroke(); };
    const oct = []; for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4 + Math.PI / 8; oct.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R * 1.05]); }
    seg(oct, p * 1.3);
    for (const s of [-1, 1]) { seg([[cx + s * R * 0.92, cy - R * 0.2], [cx + s * R * 1.2, cy - R * 0.2], [cx + s * R * 1.2, cy - R * 0.6]], p * 1.5 - 0.3); if (p > 0.6) { c.fillStyle = PAL.lemon; c.beginPath(); c.arc(cx + s * R * 1.2, cy - R * 0.6, 7, 0, 7); c.fill(); } }
    const wink = winks.some(t => T >= t && T < t + 0.35);
    c.lineWidth = 7;
    if (p > 0.4) {
      const bx = Math.sin(music.beatAt(T).i * 1.3) * 6;
      c.fillStyle = PAL.pink;
      c.beginPath(); c.arc(cx - R * 0.38, cy - R * 0.12, R * 0.17, 0, 7); c.stroke();
      c.beginPath(); c.arc(cx - R * 0.38 + bx, cy - R * 0.1, R * 0.07, 0, 7); c.fill();
      if (wink) { c.beginPath(); c.moveTo(cx + R * 0.22, cy - R * 0.08); c.lineTo(cx + R * 0.38, cy - R * 0.22); c.lineTo(cx + R * 0.54, cy - R * 0.08); c.stroke(); }
      else { c.beginPath(); c.arc(cx + R * 0.38, cy - R * 0.12, R * 0.17, 0, 7); c.stroke(); c.beginPath(); c.arc(cx + R * 0.38 + bx, cy - R * 0.1, R * 0.07, 0, 7); c.fill(); }
      const m = []; for (let i = 0; i <= 16; i++) { const u = i / 16; m.push([cx + (u - 0.5) * R * 0.9, cy + R * 0.3 + Math.sin(u * Math.PI) * R * 0.22]); }
      seg(m, (p - 0.4) * 2);
      c.fillStyle = PAL.lemon; if (p > 0.9) for (const e of [m[0], m[16]]) { c.beginPath(); c.arc(e[0], e[1], 7, 0, 7); c.fill(); }
      if (T > 6.8) { c.shadowColor = PAL.pink; for (const s of [-1, 1]) heart(c, cx + s * R * 0.62, cy + R * 0.2, 12 + 3 * Math.sin(T * 8), PAL.pink); }
    }
    c.restore();
    c.fillStyle = '#bff7ea'; c.font = `44px ${CF.bebas}`; c.textAlign = 'center'; c.fillText('ASSISTANT', cx, b.h * 0.95);
  }
  A.panel({ id: 'd2', rect: [0.72, 0.03, 0.26, 0.47], reveal: { at: 5.9, kind: 'ink', dur: 0.35 },
    layers: [{ depth: 0.4, draw: (c, b, T) => drawAIFace(c, b, T) }] });
  // d1：她脸红冒汗，手指戳来戳去
  A.panel({ id: 'd1', rect: [0.02, 0.53, 0.56, 0.44], reveal: { at: 5.85, kind: 'pop', dur: 0.22 },
    layers: [
      { depth: 1.2, draw: (c, b, T) => {
        const nerv = T >= tNerv;
        c.fillStyle = nerv ? '#c9d4ff' : '#ffb3d6'; c.fillRect(-40, -40, b.w + 80, b.h + 80);
        C.tone(c, b, { color: nerv ? '#6a70c0' : PAL.pink, step: 14, alpha: 0.45 });
        if (!nerv) for (let i = 0; i < 10; i++) heart(c, b.w * (0.55 + 0.45 * hash(i, 2)), b.h * hash(i, 3), 16 + 14 * hash(i, 4) + 5 * Math.sin(T * 6 + i));
        else for (let i = 0; i < 22; i++) { c.fillStyle = 'rgba(30,20,70,0.45)'; c.fillRect(b.w * (0.5 + 0.5 * i / 22), 0, 5, b.h * (0.3 + 0.4 * hash(i, 5))); }
      } },
      { depth: 0.2, draw: (c, b, T) => {
        const f = T < tNerv ? img.fHappy : img.fFear, s = b.h * 1.3 / 620;
        drawFace(c, f, b.w * 0.3, b.h * 0.52 + 4 * Math.sin(T * 7), s);
        if (T < tNerv) { c.fillStyle = 'rgba(255,70,130,0.35)'; for (const dx of [-110, 110]) { c.beginPath(); c.ellipse(b.w * 0.3 + dx * s, b.h * 0.52 + 30 * s, 60 * s, 22 * s, 0, 0, 7); c.fill(); } }
        sweat(c, b.w * 0.3 + 190 * s, b.h * 0.3, 26, T);
        for (const sd of [-1, 1]) { const t = Math.sin(T * 11) * 10 * sd;
          c.save(); c.translate(b.w * 0.3 + sd * (34 + t), b.h * 0.97); c.rotate(sd * -0.6); c.fillStyle = '#f6c9b0'; c.strokeStyle = PAL.ink; c.lineWidth = 6;
          c.beginPath(); c.ellipse(0, -40, 17, 48, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#ff5ea8'; c.fillRect(-26, 0, 52, 50); c.strokeRect(-26, 0, 52, 50); c.restore(); }
      } },
    ] });
  A.bubble({ x: 0.43, y: 0.63, w: 0.2, words: l1.words, at: 5.95, kind: 'speech', size: 46, tail: [0.3, 0.7], until: 7.75 });
  A.sfx({ text: 'DOKI DOKI', x: 0.44, y: 0.86, size: 0.06, at: 6.0, until: 7.75, color: PAL.pink, angle: -8, shake: 1 });
  // d3：that's no surprise —— 尴尬 + 大汗珠 + 耸肩线 + 吐槽小字
  A.panel({ id: 'd3', rect: [0.6, 0.53, 0.38, 0.44], reveal: { at: 7.6, kind: 'slide', dir: 'r', dur: 0.25 },
    layers: [
      { depth: 1.0, draw: (c, b) => { c.fillStyle = '#e9e4f5'; c.fillRect(-40, -40, b.w + 80, b.h + 80); C.tone(c, b, { color: '#b6a8d8', step: 16, alpha: 0.5 }); } },
      { depth: 0.2, draw: (c, b, T) => {
        const s = b.h * 1.1 / 620, sh = 10 * Math.max(0, Math.sin((T - 7.72) * 9)) * (T < 8.6);
        drawFace(c, img.fSad, b.w * 0.42, b.h * 0.55 - sh, s);
        sweat(c, b.w * 0.42 + 170 * s, b.h * 0.22, 46, T);
        c.strokeStyle = PAL.ink; c.lineWidth = 5; for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(b.w * 0.42 + sd * 300 * s, b.h * 0.86 - i * 18, 26 + i * 12, sd < 0 ? Math.PI * 1.1 : -Math.PI * 0.1, sd < 0 ? Math.PI * 1.5 : -Math.PI * 0.5, sd > 0); c.stroke(); }
      } },
    ] });
  A.bubble({ x: 0.9, y: 0.62, w: 0.12, words: l2.words, kind: 'speech', size: 44, tail: [0.8, 0.72] });
  A.note({ text: '(she is literally flirting with autocomplete)', x: 0.79, y: 0.94, size: 30, at: 8.4, angle: -3 });
  const keysA = [
    { t: 3.42, target: 'a1', yaw: -6, pitch: -3, margin: 1.05 },
    { t: 3.55, target: 'a1', yaw: -3, pitch: -2, margin: 1.03 },
    { t: 3.72, target: 'a2', yaw: 4, pitch: 0, margin: 1.03 },
    { t: 5.0, target: 'a2', yaw: 1, pitch: 1, margin: 1.0 },
    { t: 5.55, target: [0.02, 0.02, 0.96, 0.52], yaw: -4, pitch: -3, margin: 1.02 },
    { t: 6.05, target: 'd1', yaw: -6, pitch: 2, margin: 1.04 },
    { t: 6.55, target: 'd1', yaw: -3, pitch: 1, margin: 1.02 },
    { t: 6.8, target: 'd2', yaw: 5, pitch: -1, margin: 1.05 },
    { t: 7.2, target: 'd1', yaw: -5, pitch: 2, margin: 1.03 },
    { t: 7.85, target: 'd3', yaw: 6, pitch: 2, margin: 1.04 },
    { t: 8.75, target: 'd3', yaw: 3, pitch: 1, margin: 1.02 },
    { t: 9.2, target: 'page', yaw: -10, pitch: -7, roll: 1.5, margin: 1.02 },
    { t: 9.783, target: [0.795, 0.1, 0.08, 0.14], yaw: 0, pitch: 0, margin: 1.0 },       // 推进 AI 的左眼（推格进下一页）
  ];
  const shotA = {
    id: 'comicA', t0: 3.42, t1: 9.783,
    build() { return {}; },
    update(_, T) { A.camPath(camA, T, keysA); comicFrame(A, camA, T); return { scene: sceneA, camera: camA, post: post(T, kick) }; },
  };

  // ================================================================================================ 页 L：损失曲线过山车（没有人物）
  const l3 = L(3), dropW = l3.words.find(w => w.w === 'drop'), lossW = l3.words[l3.words.length - 1];
  const LX = 44, LY = 11, ROAD = 3.2, BASE = -3;
  const lossF = x => { const s = 1 / (1 + Math.exp(-(x - 0.56) * 38)); return 0.84 - 0.7 * s + (0.03 * Math.sin(x * 40) + 0.02 * Math.sin(x * 23 + 1)) * (1 - s) - 0.04 * x; };
  const NT = 900, trk = [], cum = [0];
  for (let i = 0; i <= NT; i++) { const x = i / NT; trk.push(V(x * LX, lossF(x) * LY, 0)); if (i) cum.push(cum[i - 1] + trk[i].distanceTo(trk[i - 1])); }
  const trkAt = s => { s = clamp(s, 0, cum[NT]); let lo = 0, hi = NT; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; } return trk[lo].clone().lerp(trk[hi], (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo])); };
  const frameAtS = (s, win = 0.7) => { const fwd = trkAt(s + win).sub(trkAt(s - win)).normalize(); return { pos: trkAt(s), forward: fwd, up: V(-fwd.y, fwd.x, 0) }; };
  const sOfX = x => cum[Math.round(clamp(x) * NT)];
  // 小球：平台上匀速 → 坡沿（drop）起过山车俯冲（大加速度）→ 谷底减速停在最低点
  const V0 = 7, ACC = 16, sEdge = sOfX(0.515), sBottom = sOfX(0.625), sStop = sOfX(0.78);
  const tEdge = dropW.start, kB = (-V0 + Math.sqrt(V0 * V0 + 2 * ACC * (sBottom - sEdge))) / ACC, vB = V0 + ACC * kB, tB = tEdge + kB;
  const DEC = vB * vB / (2 * (sStop - sBottom)), tStop = tB + vB / DEC;
  const sAt = T => T < tEdge ? sEdge - V0 * (tEdge - T) : T < tB ? sEdge + V0 * (T - tEdge) + 0.5 * ACC * (T - tEdge) ** 2 : T < tStop ? sBottom + vB * (T - tB) - 0.5 * DEC * (T - tB) ** 2 : sStop;
  const world = new THREE.Scene();
  world.background = (() => { const c = canvas(16, 256), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#06071a'); g.addColorStop(0.6, '#1a0f3a'); g.addColorStop(1, '#4a1242'); x.fillStyle = g; x.fillRect(0, 0, 16, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  world.fog = new THREE.Fog('#1a0f3a', 45, 130);
  world.add(new THREE.HemisphereLight('#8fa0ff', '#2a0f30', 1.2));
  const roadTex = (() => { const c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#1b1530'; x.fillRect(0, 0, 256, 512); x.fillStyle = '#ff5ea8'; x.fillRect(0, 0, 14, 512); x.fillRect(242, 0, 14, 512);
    x.fillStyle = 'rgba(143,245,220,0.5)'; for (let i = 0; i < 512; i += 64) x.fillRect(20, i, 216, 10);          // 过山车轨枕
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
  { const rp = [], ruv = [], idx = [];
    for (let i = 0; i <= NT; i++) { const p = trk[i]; rp.push(p.x, p.y, -ROAD / 2, p.x, p.y, ROAD / 2); ruv.push(0, cum[i] / 6, 1, cum[i] / 6); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(ruv, 2)); rg.setIndex(idx); rg.computeVertexNormals();
    world.add(new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.35, metalness: 0.3, side: THREE.DoubleSide }))); }
  const gridTex = (() => { const c = canvas(1024, 512), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#6a1f5c'); g.addColorStop(1, '#140c2a'); x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    x.strokeStyle = 'rgba(143,245,220,0.35)'; x.lineWidth = 3; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 512); x.stroke(); } for (let j = 0; j <= 8; j++) { x.beginPath(); x.moveTo(0, j * 64); x.lineTo(1024, j * 64); x.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  for (const z of [-ROAD / 2, ROAD / 2]) {
    const ap = [], auv = [], ai = [];
    for (let i = 0; i <= NT; i += 3) { const p = trk[i]; ap.push(p.x, p.y, z, p.x, BASE, z); auv.push(p.x / LX, (p.y - BASE) / (LY + 3 - BASE), p.x / LX, 0); }
    for (let k = 1; k < ap.length / 6; k++) { const a = (k - 1) * 2; ai.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const ag = new THREE.BufferGeometry(); ag.setAttribute('position', new THREE.Float32BufferAttribute(ap, 3)); ag.setAttribute('uv', new THREE.Float32BufferAttribute(auv, 2)); ag.setIndex(ai);
    world.add(new THREE.Mesh(ag, new THREE.MeshBasicMaterial({ map: gridTex, side: THREE.DoubleSide })));
    world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trk.filter((_, i) => i % 6 === 0).map(p => V(p.x, p.y + 0.12, z))), 400, 0.09, 6), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(2.2) })));
  }
  const axM = new THREE.MeshBasicMaterial({ color: col(PAL.paper).multiplyScalar(1.4) });
  { const yAx = new THREE.Mesh(new THREE.BoxGeometry(0.35, LY + 6, 0.35), axM); yAx.position.set(-1.2, BASE + (LY + 6) / 2, -ROAD / 2 - 0.4); world.add(yAx);
    const xAx = new THREE.Mesh(new THREE.BoxGeometry(LX + 6, 0.35, 0.35), axM); xAx.position.set(LX / 2 + 1.8, BASE, -ROAD / 2 - 0.4); world.add(xAx); }
  const label3 = (text, h, x, y, z, color = PAL.paper) => { const { texture, aspect } = textTexture(text, { px: 160 }); const m = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), new THREE.MeshBasicMaterial({ map: texture, transparent: true, color: col(color).multiplyScalar(1.3), depthWrite: false })); m.position.set(x, y, z); world.add(m); return m; };
  label3('TRAINING LOSS', 2.6, 9, LY + 3.2, -ROAD / 2 - 0.4); label3('STEPS →', 1.6, LX - 2, BASE - 1.8, -ROAD / 2 - 0.4, PAL.mint);
  // 歌词刻在轨道上（字头朝前进方向，追拍机位正着读）
  const trackWords = l3.words.map((w, i) => {
    const s = w.start < 9.9 ? sAt(9.9) - 4 + i * 2.6 : sAt(w.start) + 2.2;
    const { texture, aspect } = textTexture(w.w.replace(/[,.]/g, '').toUpperCase(), { px: 160 });
    const hh = Math.min(0.9, (ROAD - 0.5) / aspect);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(hh * aspect, hh), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, color: col(PAL.paper).multiplyScalar(0.35) }));
    const f = frameAtS(s, 0.3); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 0, 1), f.forward, f.up)); m.position.copy(f.pos).addScaledVector(f.up, 0.03);
    world.add(m); return { m, s };
  });
  // 小球 + 拖尾 + 光
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(2.6) })); world.add(ball);
  const trail = Array.from({ length: 14 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.34 * (1 - i / 16), 12, 8), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.8 - i * 0.1), transparent: true, opacity: 0.8 - i * 0.05 })); world.add(m); return m; });
  const ballLight = new THREE.PointLight(PAL.lemon, 20, 12, 2); world.add(ballLight);
  // 谷底：散的数据点 → 网格；神经网络从暗到全亮
  const valley = trkAt(sStop), NP = 20 * 12;
  const ptsA = new Float32Array(NP * 3), ptsB = new Float32Array(NP * 3), ptsNow = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) {
    ptsA.set([valley.x - 12 + 24 * hash(i, 1), valley.y + 0.5 + 9 * hash(i, 2), -9 + 6 * hash(i, 3)], i * 3);
    ptsB.set([valley.x - 9.5 + (i % 20) * 1.0, valley.y + 0.8 + Math.floor(i / 20) * 0.75, -7.5], i * 3);
  }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(ptsNow, 3));
  const dataPts = new THREE.Points(pg, new THREE.PointsMaterial({ color: col(PAL.mint).multiplyScalar(1.8), size: 0.22 })); dataPts.frustumCulled = false; world.add(dataPts);
  const NN = [5, 8, 8, 3], nnNodes = [], nnEdges = [];
  NN.forEach((n, li) => { for (let j = 0; j < n; j++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshBasicMaterial({ color: '#2a2440' })); m.position.set(valley.x - 6 + li * 4, valley.y + 5.2 + (j - (n - 1) / 2) * 1.05, -6.5); world.add(m); nnNodes.push({ m, li }); } });
  const ePos = [], eCol = [];
  { let off = 0; for (let li = 0; li < NN.length - 1; li++) { for (let a = 0; a < NN[li]; a++) for (let b2 = 0; b2 < NN[li + 1]; b2++) { const A1 = nnNodes[off + a].m.position, B1 = nnNodes[off + NN[li] + b2].m.position; ePos.push(A1.x, A1.y, A1.z, B1.x, B1.y, B1.z); nnEdges.push(li); eCol.push(0, 0, 0, 0, 0, 0); } off += NN[li]; } }
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.Float32BufferAttribute(ePos, 3)); eg.setAttribute('color', new THREE.Float32BufferAttribute(eCol, 3));
  const edges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true })); world.add(edges);
  const tSnap = lossW.start, tNN = tSnap + 0.12;
  function updateWorld(T) {
    const s = sAt(T), f = frameAtS(s, 0.5);
    ball.position.copy(f.pos).addScaledVector(f.up, 0.45);
    trail.forEach((m, i) => { const fs = frameAtS(sAt(T - (i + 1) * 0.025), 0.5); m.position.copy(fs.pos).addScaledVector(fs.up, 0.45); m.visible = T - (i + 1) * 0.025 > 9.6; });
    ballLight.position.copy(ball.position).add(V(0, 0.6, 0.8));
    for (const w of trackWords) w.m.material.color.copy(col(PAL.paper).multiplyScalar(0.35)).lerp(col(PAL.lemon).multiplyScalar(1.4), smooth((s - w.s + 0.5) / 0.6));
    const k = eOut((T - tSnap) / 0.16);                              // 「咔」：一下子排齐
    for (let i = 0; i < NP; i++) for (let a = 0; a < 3; a++) ptsNow[i * 3 + a] = lerp(ptsA[i * 3 + a] + (a === 1 ? 0.15 * Math.sin(T * 3 + i) : 0), ptsB[i * 3 + a], k);
    pg.attributes.position.needsUpdate = true; dataPts.visible = T > 11.3;
    nnNodes.forEach(({ m, li }) => { const on = smooth((T - tNN - li * 0.16) / 0.2); m.material.color.set('#2a2440').lerp(col(li % 2 ? PAL.pink : PAL.mint).multiplyScalar(2), on); m.scale.setScalar(1 + 0.3 * on * kick(T)); });
    const ec = eg.attributes.color; nnEdges.forEach((li, e) => { const on = smooth((T - tNN - li * 0.16 - 0.08) / 0.25) * 0.9; for (const v of [0, 1]) ec.setXYZ(e * 2 + v, 0.56 * on, 0.96 * on, 0.86 * on); }); ec.needsUpdate = true;
  }
  const chaseCam = new THREE.PerspectiveCamera(58, 16 / 9, 0.05, 400);
  function chase(T) {
    const s = sAt(T), cam = chaseCam;
    const back = lerp(4.2, 5, smooth((T - tB) / 0.5)), cf = frameAtS(Math.min(s, sStop) - back, 1.3);
    cam.position.copy(cf.pos).addScaledVector(cf.up, 1.3).add(V(0, 0, 1.2)); cam.up.copy(cf.up);
    const lf = frameAtS(Math.min(s, sStop) + (T < tEdge - 0.1 ? 3 : 5), 1.3); cam.lookAt(lf.pos.clone().addScaledVector(lf.up, 0.4));
    // 停下后：镜头抬起看谷底的网格 + 神经网络
    const e = smooth((T - tStop) / 0.45);
    if (e > 0) {
      const p0 = cam.position.clone();
      cam.position.lerpVectors(p0, V(valley.x, valley.y + 4.5, 8.5 - 1.2 * smooth((T - tStop - 0.45) / 1.2)), e); cam.up.set(0, 1, 0);
      cam.lookAt(V(valley.x, lerp(valley.y + 0.4, valley.y + 4.4, e), lerp(0, -6.5, e)));
    }
    cam.fov = 58; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    return cam;
  }
  const Lp = await createComic(mv, { w: 20, h: 11.25, seed: 23 });
  const sceneL = new THREE.Scene(); sceneL.background = deskBg(); sceneL.add(Lp.group);
  Lp.group.rotation.set(-0.03, 0.03, 0);
  const camL = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  Lp.panel({ id: 'L1', rect: [0.02, 0.03, 0.96, 0.94], reveal: { at: 9.7, kind: 'none' }, border: 'ink', borderW: 14,
    window: { scene: world, scale: 1.25, center: [21, 4.5, 21], background: '#1a0f3a', update: T => updateWorld(T) },
    layers: [{ depth: 0, draw: (c, b, T) => { c.fillStyle = PAL.ink; c.font = `54px ${CF.bebas}`; c.fillText('EPOCH ' + Math.floor(9000 + (T - 9.7) * 3000).toLocaleString('en-US'), 40, 70); } }] });
  Lp.note({ text: 'the model →', x: 0.2, y: 0.28, size: 40, at: 9.85, until: 10.3, arrow: [0.33, 0.33] });
  const keysL = [{ t: 9.783, target: 'L1', yaw: 0, pitch: 0, margin: 0.92 }, { t: 10.05, target: 'L1', yaw: -3, pitch: -2, margin: 1.0 }, { t: 10.3, target: [0.25, 0.2, 0.2, 0.2], yaw: 0, pitch: 0, margin: 0.9 }];
  const tIn = 10.3;                                                    // 穿过格面，进 3D
  const blendCam = new THREE.PerspectiveCamera(58, 16 / 9, 0.05, 400);
  const shotL = {
    id: 'comicL', t0: 9.783, t1: 12.965,
    build() { return {}; },
    update(_, T) {
      Lp.camPath(camL, T, keysL);
      if (T < tIn) { comicFrame(Lp, camL, T); return { scene: sceneL, camera: camL, post: post(T, kick) }; }
      // 进格：窗户里同姿态的相机 → 0.35 s 内并到追拍机位
      updateWorld(T);
      const e = smooth((T - tIn) / 0.35), cc = chase(T);
      if (e < 1) {
        camL.updateMatrixWorld(); const ent = Lp.enter('L1', camL).camera;
        blendCam.position.lerpVectors(ent.position, cc.position, e); blendCam.quaternion.copy(ent.quaternion).slerp(cc.quaternion, e); blendCam.fov = lerp(ent.fov, cc.fov, e); blendCam.updateProjectionMatrix();
        return { scene: world, camera: blendCam, post: post(T, kick, { bloom: { strength: 0.8, threshold: 1.0 } }) };
      }
      const speed = T > tEdge && T < tB + 0.3 ? 0.5 : 0;
      return { scene: world, camera: cc, post: post(T, kick, { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.1 + speed + 0.2 * kick(T), flash: { amount: T > tSnap && T < tSnap + 0.12 ? 0.25 : 0, color: '#bff7ea' } }) };
    },
  };

  // ================================================================================================ 页 S：身份互换
  const l4 = L(4), servantW = l4.words.find(w => /servant/.test(w.w)), bossW = l4.words[l4.words.length - 1];
  const Sp = await createComic(mv, { w: 20, h: 11.25, seed: 29 });
  const sceneS = new THREE.Scene(); sceneS.background = deskBg(); sceneS.add(Sp.group);
  Sp.group.rotation.set(-0.04, 0.04, 0);
  const camS = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  // 标签牌：USER / ASSISTANT；flip 0..1 翻牌
  function tag(c, x, y, text, fill, flip = 0) {
    const sc = Math.abs(Math.cos(flip * Math.PI)); if (sc < 0.02) return;
    c.save(); c.translate(x, y); c.scale(sc, 1); c.font = `46px ${CF.bebas}`; const w = c.measureText(text).width + 40;
    ui.rrect(c, -w / 2, -34, w, 60, 12); c.fillStyle = fill; c.fill(); c.lineWidth = 5; c.strokeStyle = PAL.ink; c.stroke();
    c.fillStyle = PAL.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, -2); c.restore();
  }
  // 手机「老板」：粉色手机立在椅子上，屏幕是一只发光的眼（会眨）
  function phoneBoss(c, x, y, h, T) {
    const w = h * 0.52;
    c.save(); c.translate(x, y); c.rotate(-0.06 + 0.03 * Math.sin(T * 2));
    ui.rrect(c, -w / 2, -h, w, h, w * 0.18); c.fillStyle = '#ff8cc0'; c.fill(); c.lineWidth = 8; c.strokeStyle = PAL.ink; c.stroke();
    ui.rrect(c, -w / 2 + 12, -h + 14, w - 24, h - 28, w * 0.12); c.fillStyle = '#0b0f24'; c.fill();
    const blink = (T % 2.2) < 0.12 ? 0.1 : 1, ey = -h * 0.55, px = w * 0.04 * Math.sin(T);
    c.save(); c.shadowColor = PAL.mint; c.shadowBlur = 30; c.fillStyle = '#f2fffb'; c.beginPath(); c.ellipse(0, ey, w * 0.36, w * 0.24 * blink, 0, 0, 7); c.fill();
    c.fillStyle = PAL.mint; c.beginPath(); c.arc(px, ey, w * 0.14 * Math.min(1, blink * 3), 0, 7); c.fill(); c.fillStyle = PAL.ink; c.beginPath(); c.arc(px, ey, w * 0.06 * Math.min(1, blink * 3), 0, 7); c.fill(); c.restore();
    c.restore();
  }
  const S_IMG = 1.19, S_Y = -40;
  Sp.panel({ id: 's1', rect: [0.02, 0.03, 0.47, 0.94], reveal: { at: 12.9, kind: 'none' }, dim: { at: 13.9, amount: 0.35 },
    layers: [
      { depth: 1.4, draw: (c, b, T) => drawBedroom(c, b, T, { focus: [0.3, 0.5], dark: 0.35 }) },
      { depth: 0.25, draw: (c, b, T) => { const s = b.w / 832 * S_IMG; c.drawImage(img.boss, (b.w - 832 * s) / 2, S_Y + 2 * Math.sin(T * 2), 832 * s, 1248 * s); } },
      { depth: 0, draw: (c, b) => { tag(c, b.w * 0.3, b.h * 0.07, 'USER', PAL.lemon); tag(c, b.w * 0.8, b.h * 0.07, 'ASSISTANT', '#bff7ea'); c.fillStyle = PAL.ink; c.font = `40px ${CF.hand}`; c.fillText('BEFORE', 24, b.h - 24); } },
    ] });
  // s2 同构图：椅子对齐到 s1 的椅子（原图像素 -39, +41）
  const flipAt = servantW.start;
  Sp.panel({ id: 's2', rect: [0.51, 0.03, 0.47, 0.94], reveal: { at: 13.12, kind: 'flip', dur: 0.4 },
    layers: [
      { depth: 1.4, draw: (c, b, T) => drawBedroom(c, b, T, { focus: [0.3, 0.5], dark: 0.35 }) },
      { depth: 0.25, draw: (c, b, T) => {
        const s = b.w / 832 * S_IMG, x0 = (b.w - 832 * s) / 2;
        c.drawImage(img.servant, x0 - 39 * s, S_Y + 41 * s, 832 * s, 1248 * s);
        phoneBoss(c, x0 + 560 * s, S_Y + 700 * s + 6 * Math.sin(T * 3), 330 * s, T);
      } },
      { depth: 0, draw: (c, b, T) => {
        const f = clamp((T - flipAt) / 0.3), swap = f >= 0.5;
        tag(c, b.w * 0.3, b.h * 0.07, swap ? 'ASSISTANT' : 'USER', swap ? '#bff7ea' : PAL.lemon, f);
        tag(c, b.w * 0.72, b.h * 0.07, swap ? 'USER' : 'ASSISTANT', swap ? PAL.lemon : '#bff7ea', f);
        c.fillStyle = PAL.ink; c.font = `40px ${CF.hand}`; c.fillText('NOW', 24, b.h - 24);
      } },
    ] });
  Sp.bubble({ x: 0.64, y: 0.3, w: 0.16, words: l4.words.slice(0, 4), at: 13.5, kind: 'speech', size: 44, tail: [0.62, 0.42], until: 16.4 });
  Sp.bubble({ x: 0.64, y: 0.5, w: 0.13, words: l4.words.slice(4, 7), kind: 'whisper', size: 40, tail: [0.62, 0.42], until: 16.4 });
  Sp.word3d({ text: 'BOSS', x: 0.83, y: 0.42, size: 2.3, at: bossW.start, lift: 1.6, color: PAL.pink, glow: 1.6, light: PAL.pink, lightI: 3, rot: [8, -10, -8] });
  Sp.shock({ x: 0.83, y: 0.42, at: bossW.start + 0.05, dur: 0.5, radius: 3, color: PAL.pink });
  const keysS = [
    { t: 12.965, target: 'page', yaw: -8, pitch: -5, margin: 1.02 },
    { t: 13.3, target: 's1', yaw: -5, pitch: -2, margin: 1.03 },
    { t: 13.6, target: 's1', yaw: -3, pitch: -1, margin: 1.02 },
    { t: 14.0, target: 's2', yaw: 5, pitch: -1, margin: 1.03 },
    { t: 15.3, target: 's2', yaw: 3, pitch: 1, margin: 1.0 },
    { t: 15.8, target: [0.62, 0.15, 0.36, 0.6], yaw: 4, pitch: -2, margin: 1.05 },
    { t: 16.3, target: 'page', yaw: -6, pitch: -5, margin: 1.02 },
  ];
  const turnIn = T => 1 - eIO((T - 12.965) / 0.35);                    // 新页从左边翻进来
  const shotS = {
    id: 'comicS', t0: 12.965, t1: 16.601,
    build() { return {}; },
    update(_, T) { sceneS.add(Sp.group); Sp.group.position.z = 0; Sp.turn(turnIn(T)); Sp.camPath(camS, T, keysS); comicFrame(Sp, camS, T); return { scene: sceneS, camera: camS, post: post(T, kick) }; },
  };

  // ================================================================================================ 页 F：《恐怖小店》气泡食人花
  const l5 = L(5), [wChat, wPlease, wDont, wEat, wMe, wAlive] = l5.words;
  const Fp = await createComic(mv, { w: 20, h: 11.25, seed: 37 });
  const sceneF = new THREE.Scene(); sceneF.background = deskBg(); sceneF.add(Fp.group);
  Fp.group.rotation.set(-0.04, -0.03, -0.01);
  const camF = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  // 盆栽：陶盆 + 弯茎 + 气泡形叶子（带尾巴的对话泡）+ 气泡形的头（上下颚张合，牙）+ 一对大眼
  function drawPlant(c, x, y, size, T, { open = 0.2, mood = 'cute', lean = 0, leaves = 3, bob = 1 } = {}) {
    const s = size / 100;
    c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
    c.fillStyle = '#d9774a'; c.strokeStyle = PAL.ink; c.lineWidth = 6;
    c.beginPath(); c.moveTo(-42, 0); c.lineTo(42, 0); c.lineTo(32, 52); c.lineTo(-32, 52); c.closePath(); c.fill(); c.stroke();
    c.fillRect(-48, -10, 96, 16); c.strokeRect(-48, -10, 96, 16);
    const sw = Math.sin(T * 3) * 6 * bob + lean * 40, hx = sw, hy = -120;
    c.strokeStyle = '#2f8a5a'; c.lineWidth = 12; c.beginPath(); c.moveTo(0, -8); c.bezierCurveTo(-20, -40, 20 + sw * 0.5, -80, hx, hy + 20); c.stroke();
    c.strokeStyle = PAL.ink; c.lineWidth = 3; c.stroke();
    for (let i = 0; i < leaves; i++) {
      const side = i % 2 ? 1 : -1, ly = -30 - i * 22 / Math.max(1, leaves / 5), lx = side * (26 + 6 * i) + sw * (0.2 + i * 0.1), r = 18 + 4 * (i % 3);
      c.save(); c.translate(lx, ly); c.rotate(side * (0.5 + 0.1 * Math.sin(T * 4 + i)));
      c.fillStyle = i % 3 === 0 ? '#bff7ea' : '#ffffff'; c.strokeStyle = PAL.ink; c.lineWidth = 4;
      c.beginPath(); c.ellipse(0, 0, r * 1.3, r, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-side * r * 0.6, r * 0.6); c.lineTo(-side * r * 1.3, r * 1.2); c.lineTo(-side * r * 0.1, r * 0.9); c.fill(); c.stroke();
      c.fillStyle = PAL.ink; for (let k = -1; k <= 1; k++) { c.beginPath(); c.arc(k * r * 0.4, 0, 2.5, 0, 7); c.fill(); }
      c.restore();
    }
    c.save(); c.translate(hx, hy + 6 * Math.sin(T * 5) * bob);
    const R = 46, op = clamp(open), jaw = op * 0.9;
    const half = up => { c.save(); c.rotate(up ? -jaw * 0.5 : jaw * 0.5); c.beginPath(); if (up) c.ellipse(0, 0, R * 1.2, R, 0, Math.PI, 0); else c.ellipse(0, 0, R * 1.2, R * 0.8, 0, 0, Math.PI); c.closePath(); c.fillStyle = mood === 'evil' ? '#ff3d8a' : '#ff8cc0'; c.fill(); c.lineWidth = 6; c.strokeStyle = PAL.ink; c.stroke();
      c.fillStyle = '#ffffff'; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * R * 0.3 - 7, 0); c.lineTo(k * R * 0.3, (up ? 1 : -1) * (mood === 'evil' ? 18 : 9)); c.lineTo(k * R * 0.3 + 7, 0); c.closePath(); c.fill(); c.lineWidth = 2; c.stroke(); }
      c.restore(); };
    if (op > 0.05) { c.fillStyle = '#4a0f2a'; c.beginPath(); c.ellipse(0, 0, R * 1.1, R * op * 0.9, 0, 0, 7); c.fill(); c.fillStyle = '#ff9ccc'; for (let k = -1; k <= 1; k++) { c.beginPath(); c.arc(k * 16, R * op * 0.3, 6, 0, 7); c.fill(); } }
    half(false); half(true);
    const blink = (T % 2.7) < 0.1 ? 0.15 : 1;
    for (const sd of [-1, 1]) {
      c.save(); c.translate(sd * 22, -R * 0.95 - jaw * 18);
      c.fillStyle = '#ffffff'; c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 16, 18 * blink, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = PAL.ink; c.beginPath(); c.arc(0, 4 * blink, 7 * Math.min(1, blink * 2), 0, 7); c.fill();
      if (mood === 'evil') { c.lineWidth = 6; c.beginPath(); c.moveTo(-18, -20 + sd * 6); c.lineTo(18, -20 - sd * 6); c.stroke(); }
      c.restore();
    }
    c.restore(); c.restore();
    return { head: [x + hx * s, y + hy * s] };
  }
  // 喂进去的数据：文件 / 图片 / 字，沿弧线飞进嘴里
  function feedIcons(c, from, to, T, t0, dt, n) {
    for (let i = 0; i < n; i++) {
      const k = (T - (t0 + i * dt)) / 0.45; if (k < 0 || k > 1) continue;
      const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 60, s = 1 - 0.5 * k, kind = i % 3;
      c.save(); c.translate(x, y); c.rotate(k * 4); c.scale(s, s); c.lineWidth = 4; c.strokeStyle = PAL.ink;
      if (kind === 0) { c.fillStyle = '#ffffff'; c.fillRect(-16, -20, 32, 40); c.strokeRect(-16, -20, 32, 40); c.fillStyle = PAL.pink; c.fillRect(-10, -10, 20, 4); c.fillRect(-10, -2, 16, 4); }
      else if (kind === 1) { c.fillStyle = '#8ff5dc'; c.fillRect(-20, -16, 40, 32); c.strokeRect(-20, -16, 40, 32); c.fillStyle = PAL.lemon; c.beginPath(); c.arc(8, -6, 5, 0, 7); c.fill(); }
      else { c.fillStyle = PAL.lemon; c.font = `40px ${CF.bang}`; c.textAlign = 'center'; c.fillText(['Aa', '01', '{ }'][i % 3], 0, 12); }
      c.restore();
    }
  }
  Fp.panel({ id: 'f1', rect: [0.02, 0.03, 0.36, 0.46], reveal: { at: 16.5, kind: 'none' }, dim: { at: 17.9, amount: 0.3 },
    layers: [
      { depth: 1.4, draw: (c, b, T) => drawBedroom(c, b, T, { focus: [0.6, 0.6], dark: 0.3 }) },
      { depth: 0.25, draw: (c, b, T) => {
        const s = b.h * 1.05 / 915; c.drawImage(img.feed, b.w * 0.36 - 420 * s, b.h * 0.98 - 1101 * s, 832 * s, 1248 * s);
        const hand = [b.w * 0.36 + (800 - 420) * s, b.h * 0.98 - (1101 - 470) * s];
        const p = drawPlant(c, b.w * 0.86, b.h * 0.86, b.h * 0.42, T, { open: 0.3 + 0.5 * Math.max(0, Math.sin(T * 9)), leaves: 3 });
        feedIcons(c, hand, p.head, T, 16.65, 0.23, 6);
      } },
    ] });
  Fp.note({ text: 'day 1: so cute!', x: 0.06, y: 0.08, size: 34, at: 16.7, angle: -3 });
  Fp.panel({ id: 'f2', rect: [0.4, 0.03, 0.26, 0.46], reveal: { at: 17.5, kind: 'pop', dur: 0.22 }, dim: { at: 18.9, amount: 0.3 },
    layers: [
      { depth: 1.2, draw: (c, b, T) => drawBedroom(c, b, T, { focus: [0.5, 0.6], dark: 0.35 }) },
      { depth: 0.25, draw: (c, b, T) => { const p = drawPlant(c, b.w * 0.5, b.h * 0.93, b.h * 0.42, T, { open: 0.35 + 0.4 * Math.max(0, Math.sin(T * 8)), leaves: 7 }); feedIcons(c, [b.w * -0.1, b.h * 0.5], p.head, T, 17.55, 0.18, 7); } },
    ] });
  Fp.note({ text: 'day 47', x: 0.42, y: 0.08, size: 34, at: 17.6, angle: 3 });
  Fp.sfx({ text: 'FEED ME', x: 0.6, y: 0.4, size: 0.045, at: 18.1, until: 19.3, color: PAL.pink, angle: 8, shake: 1 });
  Fp.panel({ id: 'f3', rect: [0.68, 0.03, 0.3, 0.46], reveal: { at: 18.35, kind: 'slide', dir: 'r', dur: 0.25 },
    layers: [
      { depth: 1.4, draw: (c, b, T) => drawBedroom(c, b, T, { glow: [0.5, 0.75, 1] }) },
      { depth: 0.3, draw: (c, b, T) => drawLying(c, b, T, T < wDont.start ? 'typing' : 'lookup', { scale: 1.12 }) },
      { depth: 0, draw: (c, b) => drawFold(c, b, b.h * 0.92) },
    ] });
  Fp.bubble({ x: 0.89, y: 0.19, w: 0.13, words: [wChat, wPlease, wDont, wEat, wMe], at: 18.45, kind: 'speech', size: 32, tail: [0.83, 0.33] });
  const tLunge = wAlive.start;
  Fp.panel({ id: 'f4', rect: [0.02, 0.52, 0.96, 0.45], reveal: { at: 19.25, kind: 'pop', dur: 0.25 },
    layers: [
      { depth: 1.6, draw: (c, b, T) => { drawBedroom(c, b, T, { focus: [0.5, 0.45], dark: 0.45 }); C.focusLines(c, b, T, { fx: 0.62, fy: 0.45, inner: 0.35, n: 90, color: PAL.pink, alpha: T > wEat.start ? 0.5 : 0.2 }); } },
      { depth: 0.3, draw: (c, b, T) => {
        const s = b.w * 0.36 / 1376; c.drawImage(img.lookup, -b.w * 0.02, b.h * 1.02 - 700 * s, 1376 * s, 768 * s);    // 她缩在左下角（抬头惊）
        // 巨型：头在格子中上部；alive 时扑过来（放大、往她那边压，头始终在格子里）
        const lunge = eIn((T - tLunge) / 0.35), big = lerp(1, 1.6, lunge);
        const open = T < wEat.start ? 0.35 + 0.25 * Math.max(0, Math.sin(T * 7)) : T < tLunge ? lerp(0.7, 0.95, Math.max(0, Math.sin((T - wEat.start) * 9))) : 1;
        const pl = drawPlant(c, lerp(b.w * 0.66, b.w * 0.4, lunge), lerp(b.h * 1.02, b.h * 1.78, lunge), b.h * 0.75 * big, T, { open, mood: T > 19.9 ? 'evil' : 'cute', leaves: 11, lean: -0.3 * lunge, bob: 1.6 * (1 - lunge) });
        // 一口吞下：嘴（暗红 + 一圈牙）从它的头张开，罩住整格 → 接曼德博
        const gulp = eIn((T - 21.5) / 0.22);
        if (gulp > 0) {
          const [hx, hy] = pl.head, r = lerp(40, Math.hypot(b.w, b.h), gulp);
          c.fillStyle = '#4a0f2a'; c.beginPath(); c.arc(hx, hy, r, 0, 7); c.fill();
          c.fillStyle = '#ffffff'; c.strokeStyle = PAL.ink; c.lineWidth = 4;
          for (let i = 0; i < 18; i++) { const a0 = i / 18 * Math.PI * 2; c.beginPath(); c.moveTo(hx + Math.cos(a0 - 0.12) * r, hy + Math.sin(a0 - 0.12) * r); c.lineTo(hx + Math.cos(a0) * r * 0.82, hy + Math.sin(a0) * r * 0.82); c.lineTo(hx + Math.cos(a0 + 0.12) * r, hy + Math.sin(a0 + 0.12) * r); c.closePath(); c.fill(); c.stroke(); }
          c.lineWidth = 12; c.strokeStyle = '#ff3d8a'; c.beginPath(); c.arc(hx, hy, r, 0, 7); c.stroke();
        }
      } },
    ] });
  Fp.sfx({ text: 'FEED ME!!', x: 0.8, y: 0.62, size: 0.1, at: 19.33, until: 20.8, color: PAL.pink, stroke: PAL.ink, angle: -7, shake: 1 });
  Fp.bubble({ x: 0.2, y: 0.62, w: 0.13, words: [wAlive], kind: 'shout', size: 58 });
  // 嘴里：曼德博（AI 的肚子），镜头推进它的嘴之后接上
  const mand = createMandelbrot({ width: 16, height: 9 });
  const mandScene = new THREE.Scene(); mandScene.background = col('#000000'); mandScene.add(mand.mesh);
  const mandCam = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 100); mandCam.position.z = 10;
  const keysF = [
    { t: 16.601, target: 'page', yaw: 0, pitch: 0, margin: 1.02 },
    { t: 16.95, target: 'f1', yaw: -4, pitch: -2, margin: 1.03 },
    { t: 17.4, target: 'f1', yaw: -2, pitch: -1, margin: 1.02 },
    { t: 17.75, target: 'f2', yaw: 3, pitch: -1, margin: 1.03 },
    { t: 18.25, target: 'f2', yaw: 1, pitch: 0, margin: 1.02 },
    { t: 18.6, target: 'f3', yaw: 5, pitch: -2, margin: 1.03 },
    { t: 19.15, target: 'f3', yaw: 3, pitch: -1, margin: 1.02 },
    { t: 19.5, target: 'f4', yaw: -4, pitch: 3, margin: 1.03 },
    { t: 20.9, target: 'f4', yaw: 2, pitch: 1, margin: 1.0 },
    { t: 21.4, target: 'f4', yaw: 0, pitch: 0, margin: 0.98 },
    { t: 21.72, target: [0.25, 0.55, 0.5, 0.35], yaw: 0, pitch: 0, margin: 0.6 },
  ];
  const tMouth = 21.72;
  const shotF = {
    id: 'comicF', t0: 16.601, t1: 22.1,
    build() { return {}; },
    update(_, T) {
      if (T >= tMouth) {
        const k = (T - tMouth) / (22.1 - tMouth);
        mand.update(T, { zoom: 0.4 + 2.2 * eIn(k), spin: k * 0.8 });
        return { scene: mandScene, camera: mandCam, post: { bloom: { strength: 0.6, threshold: 0.9 }, grade: { vignette: 0.35 }, flash: { amount: 0.6 * Math.exp(-(T - tMouth) * 10), color: PAL.pink } } };
      }
      sceneF.add(Fp.group);
      Fp.camPath(camF, T, keysF);
      comicFrame(Fp, camF, T);
      // 翻页：上一页（S）从右往左翻走，露出这一页（前 0.35 s）
      const tp = (T - 16.601) / 0.35;
      if (tp < 1) { sceneF.add(Sp.group); Sp.group.position.z = 0.03; Sp.turn(eIO(tp)); Sp.camPath(camS, 16.6, keysS); comicFrame(Sp, camS, 16.6); }
      else if (Sp.group.parent === sceneF) sceneF.remove(Sp.group);
      const lg = T > tLunge && T < tLunge + 0.2 ? 0.4 : 0;
      return { scene: sceneF, camera: camF, post: post(T, kick, { flash: { amount: lg, color: '#ffffff' } }) };
    },
  };
  return [shotA, shotL, shotS, shotF];
}
