// kits/ui2d.js — 扁平矢量 / 手机界面 2D 层（mv-pdoom v4，W2）
//
//   import { createUI2D } from './kits/ui2d.js';
//   const ui = await createUI2D(mv);                        // 载入 canvas 字体 + 2D 立绘 rig
//   const S = ui.surface(720, 1280);                        // 一块画布（CanvasTexture），画完调 S.commit()
//   const phone = ui.device('phone', S);                    // 3D 手机：{ group, screen, size }，屏幕贴 S 的纹理
//   const flat = ui.stage2D(ui.surface(1920, 1080));        // 整屏 2D：{ scene, camera(正交), surface }
//   每帧：S.clear(PAL.paper); ui.draw.chatHeader(S.ctx, box, {...}); ...; S.commit();
//
// 所有 draw.* 都是 (ctx, box, T, opts) 的纯函数：box = { x, y, w, h }（画布像素），T = 歌曲时间。
//   chatHeader   聊天 App 顶栏（头像、名字、在线/正在输入…）
//   thread       聊天记录：msgs = [{ from:'them'|'me', words | text+at, typingFrom, edits:[{at,text}], sender }]
//                对方的消息先出「…」再整条弹出；我的消息逐词逐字打出（跟 lyrics 词时间），edits 做「边打边删」
//   bubble       单个气泡（thread 内部用，也可单独画）
//   inputBox     底部输入框：逐词打字 + 光标 + 发送键；opts.eaten = [{at, from, to}] 字被咬掉变乱码
//   popup        系统弹窗（标题栏、警告图标、正文、按钮），at 时弹出；opts.crack 碎裂
//   mail         邮件界面（收件箱行 + 正文），auto-reply 印章
//   lossChart    损失曲线图表：平台 → 陡降；progress 画到哪；opts.drop = 陡降位置
//   archDiagram  模型结构框图（Embedding / Attention / MLP …），逐拍高亮；opts.escape 方块逃出
//   likeButtons  点赞 / 点踩按钮 + 计数；clicks = [{at, which}]；opts.tilt 整体歪
//   circuits     电路纹从边缘往里爬满（progress 0..1）
//   cracks       屏幕裂纹（n 道，按种子）
//   girl         2D 女主立绘（layer-rig），能唱（line 口型对词）、眨眼、表情、摆头、拍打玻璃
// 调色：ink / pink / mint / lemon / paper（engine/palette.js）；字体和 type3d 同一套（Bebas / Anton / Share Tech Mono / Kalam / Caveat）。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { loadRig, lipsync, blinks, wobble } from '../../../assets/lib/layer-rig.js';

export const RIG_URL = new URL('../../cast-cyber-girl/closeup/layers/', import.meta.url);
const FONT_DIR = new URL('../../../assets/fonts/', import.meta.url);
export const F = {
  bebas: '"UIBebas", sans-serif',
  anton: '"UIAnton", sans-serif',
  mono: '"UIMono", monospace',
  kalam: '"UIKalam", cursive',
  caveat: '"UICaveat", cursive',
};
const FILES = [['UIBebas', 'bebasneue/BebasNeue-Regular.ttf'], ['UIAnton', 'anton/Anton-Regular.ttf'], ['UIMono', 'sharetechmono/ShareTechMono-Regular.ttf'],
  ['UIKalam', 'kalam/Kalam-Bold.ttf'], ['UICaveat', 'caveat/Caveat-Variable.ttf']];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eBack = (p, s = 1.7) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
export function hash(a, b = 0) { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const clean = w => w.replace(/[“”"]/g, '').replace(/[‘’]/g, "'");

// ---------------------------------------------------------------- 画布小工具
export function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// 扁平风：实心 + 墨色粗描边 + 右下实心投影
function card(ctx, x, y, w, h, r, fill, { stroke = PAL.ink, lw = 5, shadow = 8 } = {}) {
  if (shadow) { rrect(ctx, x + shadow, y + shadow, w, h, r); ctx.fillStyle = PAL.ink; ctx.fill(); }
  rrect(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean), lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur || !lines.length) lines.push(cur);
  return lines;
}
// 词数组 → t 时刻已打出的文本（逐词、词内逐字；不抢跑）
export function typedAt(words, T, { upper = false } = {}) {
  let s = '';
  for (const w of words) {
    if (T < w.start) break;
    const txt = clean(upper ? w.w.toUpperCase() : w.w);
    const d = Math.max(0.05, Math.min(w.end - w.start, 0.09 * txt.length));
    const n = Math.min(txt.length, Math.floor((T - w.start) / d * txt.length) + 1);
    s += (s ? ' ' : '') + txt.slice(0, n);
  }
  return s;
}
// 「边打边删」：从 base 文本出发，依次改成 edits[i].text；每次先退格到公共前缀、再打，速度 rate 字/秒
export function editedAt(base, edits, T, rate = 22) {
  let cur = base;
  for (let i = 0; i < edits.length; i++) {
    const e = edits[i];
    if (T < e.at) break;
    let p = 0;
    while (p < cur.length && p < e.text.length && cur[p] === e.text[p]) p++;
    const del = cur.length - p, add = e.text.length - p;
    const k = Math.floor((T - e.at) * rate);
    if (k < del) return cur.slice(0, cur.length - k);
    if (k < del + add) return e.text.slice(0, p + (k - del));
    cur = e.text;
  }
  return cur;
}
const words2text = (words, upper) => words.map(w => clean(upper ? w.w.toUpperCase() : w.w)).join(' ');

export function resetCtx(ctx) {
  if (ctx.reset) { ctx.reset(); return; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.lineJoin = 'miter'; ctx.lineCap = 'butt'; ctx.lineWidth = 1; ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic'; ctx.filter = 'none';
}

// ================================================================ 工厂
let fontsP = null;
function loadFonts() {
  fontsP ??= Promise.all(FILES.map(async ([name, file]) => {
    const f = new FontFace(name, `url(${new URL(file, FONT_DIR).href})`);
    await f.load(); document.fonts.add(f);
  }));
  return fontsP;
}

export async function createUI2D(mv) {
  await loadFonts();
  const rig = await loadRig(RIG_URL.href);
  const RW = 832, RH = 1248;
  const rigCv = document.createElement('canvas'); rigCv.width = RW; rigCv.height = RH;
  const rigCtx = rigCv.getContext('2d');
  const timingsOf = lines => ({ segments: lines.map(l => ({ text: l.text, start: l.start, end: l.end, sentences: l.words.map(w => ({ text: w.w, start: w.start, end: w.end })) })) });
  const lipsCache = new Map();
  const lipsFor = line => {
    const L = typeof line === 'number' ? mv.lyrics.lines[line] : line;
    if (!L) return () => null;
    if (!lipsCache.has(L.i)) lipsCache.set(L.i, lipsync(timingsOf([L])));
    return lipsCache.get(L.i);
  };
  const blink = blinks({ seed: 11, from: 0, to: mv.music.duration + 5, min: 2.4, max: 4.8 });
  const drift = wobble(19, 1.5);
  const EXPR = { neutral: { eyes: 'open', mouth: 'rest' }, smile: { eyes: 'smile', mouth: 'smile' }, surprised: { eyes: 'surprised', mouth: 'surprised' }, wink: { eyes: 'wink', mouth: 'smile' }, closed: { eyes: 'closed', mouth: 'rest' }, half: { eyes: 'half', mouth: 'rest' } };
  const beatU = T => { const b = mv.music.beatAt(T); return b.i + clamp(b.phase); };

  // ---------------------------------------------------------------- 画布 / 设备 / 整屏 2D
  function surface(W, H) {
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return {
      canvas, ctx, tex, W, H,
      // 每帧从干净的上下文开始（线型 / 对齐 / 字体等状态不能从上一帧漏过来，否则乱序 seek 画面会不同）
      clear(bg = PAL.paper) { resetCtx(ctx); if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H); },
      commit() { tex.needsUpdate = true; },
    };
  }
  // 3D 设备：手机（竖）或笔记本（屏 + 键盘底座）。屏幕平面贴 surface 纹理，自发光（MeshBasic，不吃灯）
  function device(kind, S, { width = kind === 'phone' ? 1 : 3.2, body = '#111118', glow = 1 } = {}) {
    const group = new THREE.Group();
    const aspect = S.H / S.W, w = width, h = width * aspect;
    const bez = kind === 'phone' ? 0.06 * w : 0.05 * w;
    const shape = new THREE.Shape();
    const R = kind === 'phone' ? 0.14 * w : 0.04 * w, bw = w + bez * 2, bh = h + bez * 2;
    shape.moveTo(-bw / 2 + R, -bh / 2); shape.lineTo(bw / 2 - R, -bh / 2); shape.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + R);
    shape.lineTo(bw / 2, bh / 2 - R); shape.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - R, bh / 2); shape.lineTo(-bw / 2 + R, bh / 2);
    shape.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - R); shape.lineTo(-bw / 2, -bh / 2 + R); shape.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + R, -bh / 2);
    const depth = kind === 'phone' ? 0.09 * w : 0.03 * w;
    const bodyMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: depth * 0.3, bevelSize: depth * 0.3, bevelSegments: 3, curveSegments: 10 }), new THREE.MeshStandardMaterial({ color: body, roughness: 0.35, metalness: 0.6 }));
    bodyMesh.position.z = -depth - 0.002;
    const screenGroup = new THREE.Group();
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: S.tex, color: new THREE.Color(glow, glow, glow) }));
    screen.position.z = depth * 0.32;
    screenGroup.add(screen);
    group.add(bodyMesh, screenGroup);
    if (kind === 'laptop') {
      bodyMesh.position.y = screenGroup.position.y = h / 2 + bez;
      const base = new THREE.Mesh(new THREE.BoxGeometry(bw * 1.04, 0.05 * w, bh * 0.8), new THREE.MeshStandardMaterial({ color: body, roughness: 0.4, metalness: 0.6 }));
      base.position.set(0, 0.025 * w, bh * 0.4); group.add(base);
      const hinge = new THREE.Group(); hinge.add(bodyMesh, screenGroup); hinge.rotation.x = -0.18; group.add(hinge);
    }
    return { group, screen, size: [w, h], depth };
  }
  // 整屏 2D：正交相机 + 一块铺满 1920×1080 的平面（世界单位 = 画布像素 / 100）
  function stage2D(S) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAL.ink);
    const w = S.W / 100, h = S.H / 100;
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
    camera.position.z = 10;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: S.tex }));
    scene.add(plane);
    return { scene, camera, plane, surface: S };
  }

  // ================================================================ 组件
  const draw = {};

  draw.chatHeader = (ctx, b, T, { name = 'ChatGPT', status = 'online', typing = false, color = PAL.mint, avatar = 'ai' } = {}) => {
    ctx.fillStyle = PAL.ink; ctx.fillRect(b.x, b.y, b.w, b.h);
    const r = b.h * 0.3, cx = b.x + b.h * 0.55, cy = b.y + b.h / 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    // 头像：一只简笔眼（AI）或笑脸
    ctx.fillStyle = PAL.ink;
    if (avatar === 'ai') { ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.62, r * 0.34, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.1, 0, 7); ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.1, 0, 7); ctx.fill(); }
    ctx.fillStyle = PAL.paper; ctx.font = `${Math.round(b.h * 0.42)}px ${F.bebas}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText(name.toUpperCase(), b.x + b.h * 1.05, b.y + b.h * 0.56);
    ctx.fillStyle = typing ? PAL.lemon : color; ctx.font = `${Math.round(b.h * 0.2)}px ${F.mono}`;
    const dots = '.'.repeat(1 + (Math.floor(T * 3) % 3));
    ctx.fillText(typing ? `typing${dots}` : status, b.x + b.h * 1.05, b.y + b.h * 0.84);
  };

  // 气泡：返回高度（不画时 dry=true 只量）
  draw.bubble = (ctx, x, y, maxW, text, { from = 'them', size = 34, dry = false, caret = false, T = 0, scale = 1, font = F.mono } = {}) => {
    ctx.font = `${size}px ${font}`;
    const pad = size * 0.55, lh = size * 1.25;
    const lines = wrap(ctx, text || ' ', maxW - pad * 2);
    const tw = Math.max(size * 1.6, ...lines.map(l => ctx.measureText(l).width)) + (caret ? size * 0.5 : 0);
    const w = tw + pad * 2, h = lines.length * lh + pad * 1.4;
    if (dry) return { w, h };
    const bx = from === 'me' ? x + maxW - w : x;
    ctx.save();
    const ox = from === 'me' ? bx + w : bx, oy = y + h;
    ctx.translate(ox, oy); ctx.scale(scale, scale); ctx.translate(-ox, -oy);
    const fill = from === 'me' ? PAL.pink : PAL.paper, ink = from === 'me' ? PAL.paper : PAL.ink;
    card(ctx, bx, y, w, h, size * 0.8, fill, { lw: 4, shadow: 6 });
    // 尾巴
    ctx.beginPath();
    if (from === 'me') { ctx.moveTo(bx + w - size * 0.9, y + h - 2); ctx.lineTo(bx + w + size * 0.25, y + h + size * 0.35); ctx.lineTo(bx + w - size * 0.2, y + h - size * 0.6); }
    else { ctx.moveTo(bx + size * 0.9, y + h - 2); ctx.lineTo(bx - size * 0.25, y + h + size * 0.35); ctx.lineTo(bx + size * 0.2, y + h - size * 0.6); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.fillStyle = ink; ctx.textBaseline = 'alphabetic';
    lines.forEach((l, i) => ctx.fillText(l, bx + pad, y + pad * 0.7 + lh * (i + 0.78)));
    if (caret && Math.floor(T / 0.4) % 2 === 0) {
      const last = lines[lines.length - 1];
      ctx.fillStyle = from === 'me' ? PAL.lemon : PAL.pink;
      ctx.fillRect(bx + pad + ctx.measureText(last).width + 4, y + pad * 0.7 + lh * (lines.length - 1) + lh * 0.12, size * 0.14, lh * 0.8);
    }
    ctx.restore();
    return { w, h, x: bx };
  };

  const typingDots = (ctx, x, y, size, T) => {
    const w = size * 3.2, h = size * 1.7;
    card(ctx, x, y, w, h, h / 2, PAL.paper, { lw: 4, shadow: 6 });
    for (let i = 0; i < 3; i++) {
      const ph = (T * 3.2 - i * 0.22) % 1;
      const up = Math.max(0, Math.sin(ph * Math.PI * 2)) * size * 0.28;
      ctx.beginPath(); ctx.arc(x + w * (0.28 + i * 0.22), y + h / 2 - up, size * 0.16, 0, 7); ctx.fillStyle = [PAL.pink, PAL.mint, PAL.lemon][i]; ctx.fill();
    }
    return { w, h };
  };

  // 聊天记录：底部对齐，新消息把旧的往上顶（弹出动画 0.22 s）
  draw.thread = (ctx, b, T, { msgs = [], size = 34, gap = 22, upper = false } = {}) => {
    ctx.save();
    ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    const maxW = b.w * 0.78;
    const items = [];
    for (const m of msgs) {
      const at = m.at ?? m.words?.[0]?.start ?? 0;
      if (m.from === 'them') {
        if (m.typingFrom != null && T >= m.typingFrom && T < at) { items.push({ kind: 'dots', m, t0: m.typingFrom }); continue; }
        if (T < at) continue;
        const text = m.text ?? words2text(m.words, upper);
        items.push({ kind: 'msg', m, text, t0: at });
      } else {
        if (T < at) continue;
        const base = m.text ?? typedAt(m.words, T, { upper });
        const full = m.text ?? words2text(m.words, upper);
        const done = base === full;
        const text = m.edits && done ? editedAt(full, m.edits, T) : base;
        const lastEdit = m.edits?.length ? m.edits[m.edits.length - 1] : null;
        const caret = !done || (m.edits && T < (lastEdit?.at ?? 0) + 2);
        items.push({ kind: 'msg', m, text, t0: at, caret });
      }
    }
    // 从下往上排
    let y = b.y + b.h - gap;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const pop = eBack((T - it.t0) / 0.22);
      const sz = it.m.size ?? size;
      const hgt = it.kind === 'dots' ? size * 1.7 : draw.bubble(ctx, 0, 0, maxW, it.text, { from: it.m.from, size: sz, dry: true, caret: it.caret }).h;
      const hh = hgt * Math.min(1, pop);
      y -= hh;
      if (y + hh < b.y) break;
      if (it.m.sender && it.kind === 'msg') { ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 0.55)}px ${F.bebas}`; ctx.fillText(it.m.sender, it.m.from === 'me' ? b.x + b.w - maxW : b.x + 12, y - 6); }
      if (it.kind === 'dots') typingDots(ctx, b.x + 12, y, size, T);
      else draw.bubble(ctx, b.x + 12, y, maxW - 24, it.text, { from: it.m.from, size: sz, caret: it.caret, T, scale: Math.max(0.001, pop) });
      y -= gap + (it.m.sender ? size * 0.6 : 0);
    }
    ctx.restore();
  };

  // 输入框：逐词打字；eaten = [{at, from, to}] 这段字符被「咬」掉，变成乱码块
  draw.inputBox = (ctx, b, T, { words = [], text = null, placeholder = 'Message', size = 36, upper = false, eaten = [], send = true } = {}) => {
    card(ctx, b.x, b.y, b.w, b.h, b.h / 2, PAL.paper, { lw: 5, shadow: 7 });
    let s = text ?? typedAt(words, T, { upper });
    ctx.font = `${size}px ${F.mono}`; ctx.textBaseline = 'middle';
    const tx = b.x + b.h * 0.5, ty = b.y + b.h / 2;
    if (!s) { ctx.fillStyle = '#9a96a0'; ctx.fillText(placeholder, tx, ty); }
    else {
      // 被咬掉的字：从 at 起那几个字符变成乱码 → 消失
      const chars = [...s];
      const glyph = '#%&@$?!*';
      for (const e of eaten) {
        const k = T - e.at;
        if (k < 0) continue;
        for (let i = e.from; i < Math.min(e.to, chars.length); i++) chars[i] = k < 0.25 ? glyph[Math.floor(hash(i, Math.floor(T * 20)) * glyph.length)] : ' ';
      }
      s = chars.join('');
      // 可写区：左内边距到发送键左边；太长就整体左移，只露出末尾（光标永远在框内）
      const right = b.x + b.w - (send ? b.h * 1.05 : b.h * 0.4);
      const full = ctx.measureText(s).width;
      ctx.save(); ctx.beginPath(); ctx.rect(tx - 4, b.y, right - tx + 4, b.h); ctx.clip();
      let x = tx - Math.max(0, full + size * 0.3 - (right - tx));
      for (let i = 0; i < chars.length; i++) {
        const bad = eaten.some(e => T >= e.at && i >= e.from && i < e.to);
        ctx.fillStyle = bad ? PAL.pink : PAL.ink;
        ctx.fillText(chars[i], x, ty);
        x += ctx.measureText(chars[i]).width;
      }
      if (Math.floor(T / 0.45) % 2 === 0) { ctx.fillStyle = PAL.pink; ctx.fillRect(x + 3, ty - size * 0.5, size * 0.12, size); }
      ctx.restore();
    }
    if (send) {
      const r = b.h * 0.36, cx = b.x + b.w - b.h * 0.55, cy = b.y + b.h / 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = s ? PAL.pink : '#c9c4cc'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - r * 0.35, cy - r * 0.45); ctx.lineTo(cx + r * 0.5, cy); ctx.lineTo(cx - r * 0.35, cy + r * 0.45); ctx.closePath(); ctx.fillStyle = PAL.paper; ctx.fill();
    }
  };

  // 系统弹窗
  draw.popup = (ctx, b, T, { at = 0, title = 'WARNING', body = '', buttons = ['OK', 'CANCEL'], color = PAL.lemon, icon = '!', size = 34, shake = 0, crack = 0, press = null } = {}) => {
    const k = T - at;
    if (k < 0) return;
    const s = eBack(k / 0.2, 2.2);
    const sx = shake ? Math.sin(T * 60) * shake * 10 * Math.exp(-k * 3) : 0;
    ctx.save();
    ctx.translate(b.x + b.w / 2 + sx, b.y + b.h / 2); ctx.scale(Math.max(0.001, s), Math.max(0.001, s)); ctx.translate(-b.w / 2, -b.h / 2);
    card(ctx, 0, 0, b.w, b.h, 18, PAL.paper, { lw: 6, shadow: 12 });
    const th = size * 1.9;
    rrect(ctx, 0, 0, b.w, th, 18); ctx.save(); ctx.clip(); ctx.fillStyle = color; ctx.fillRect(0, 0, b.w, th); ctx.restore();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, th); ctx.lineTo(b.w, th); ctx.stroke();
    ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 1.15)}px ${F.bebas}`; ctx.textBaseline = 'middle';
    ctx.fillText(title, size * 0.7, th / 2 + 2);
    // 窗口按钮
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(b.w - size * (0.8 + i * 1.0), th / 2, size * 0.28, 0, 7); ctx.fillStyle = [PAL.pink, PAL.mint, PAL.paper][i]; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); }
    // 图标
    const ix = size * 1.6, iy = th + (b.h - th) * 0.4, ir = size * 0.95;
    if (icon) {
      ctx.beginPath(); ctx.moveTo(ix, iy - ir); ctx.lineTo(ix + ir, iy + ir * 0.75); ctx.lineTo(ix - ir, iy + ir * 0.75); ctx.closePath();
      ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 1.2)}px ${F.anton}`; ctx.textAlign = 'center'; ctx.fillText(icon, ix, iy + ir * 0.2); ctx.textAlign = 'left';
    }
    ctx.fillStyle = PAL.ink; ctx.font = `${size}px ${F.mono}`; ctx.textBaseline = 'alphabetic';
    const lines = wrap(ctx, body, b.w - ix - ir - size * 1.6);
    lines.forEach((l, i) => ctx.fillText(l, ix + ir + size * 0.7, th + size * 1.5 + i * size * 1.25));
    // 按钮
    const bw = size * 4, bh = size * 1.5;
    buttons.forEach((t, i) => {
      const x = b.w - (bw + size * 0.6) * (buttons.length - i), y = b.h - bh - size * 0.6;
      const pressed = press && press.which === i && T >= press.at && T < press.at + 0.18;
      card(ctx, x + (pressed ? 4 : 0), y + (pressed ? 4 : 0), bw, bh, 10, i === 0 ? color : PAL.paper, { lw: 4, shadow: pressed ? 0 : 5 });
      ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 0.9)}px ${F.bebas}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(t, x + bw / 2 + (pressed ? 4 : 0), y + bh / 2 + 2 + (pressed ? 4 : 0)); ctx.textAlign = 'left';
    });
    if (crack > 0) draw.cracks(ctx, { x: 0, y: 0, w: b.w, h: b.h }, T, { n: Math.round(crack * 8), seed: 5, cx: 0.62, cy: 0.45 });
    ctx.restore();
  };

  // 邮件界面：左边收件箱一列，右边正文；autoReply 时盖印章
  draw.mail = (ctx, b, T, { from = 'killswitch-guy@lab.ai', subject = 'Out of office', body = [], at = 0, autoReply = true, stampAt = null, size = 30, inbox = [] } = {}) => {
    card(ctx, b.x, b.y, b.w, b.h, 16, PAL.paper, { lw: 5, shadow: 10 });
    const lw = b.w * 0.3;
    ctx.fillStyle = '#e4ded3'; ctx.fillRect(b.x + 3, b.y + 3, lw, b.h - 6);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(b.x + lw, b.y); ctx.lineTo(b.x + lw, b.y + b.h); ctx.stroke();
    ctx.font = `${Math.round(size * 1.2)}px ${F.bebas}`; ctx.fillStyle = PAL.ink; ctx.textBaseline = 'alphabetic';
    ctx.fillText('INBOX', b.x + size * 0.7, b.y + size * 1.6);
    const rows = [...inbox, { from, subject, at }];
    rows.forEach((r, i) => {
      if (r.at != null && T < r.at) return;
      const y = b.y + size * 2.4 + i * size * 2.3;
      const hot = i === rows.length - 1;
      if (hot) { ctx.fillStyle = PAL.lemon; ctx.fillRect(b.x + 6, y - size * 0.2, lw - 10, size * 2.1); }
      ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 0.8)}px ${F.bebas}`; ctx.fillText(r.from.split('@')[0].toUpperCase(), b.x + size * 0.6, y + size * 0.7);
      ctx.font = `${Math.round(size * 0.62)}px ${F.mono}`; ctx.fillText(r.subject.slice(0, 18), b.x + size * 0.6, y + size * 1.5);
    });
    if (T < at) return;
    const x0 = b.x + lw + size, pop = eOut((T - at) / 0.25);
    ctx.globalAlpha = pop;
    ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 1.3)}px ${F.bebas}`; ctx.fillText(subject.toUpperCase(), x0, b.y + size * 1.9);
    ctx.font = `${Math.round(size * 0.7)}px ${F.mono}`; ctx.fillStyle = '#6b6672'; ctx.fillText(`from: ${from}`, x0, b.y + size * 2.9);
    ctx.fillStyle = PAL.ink; ctx.font = `${size}px ${F.mono}`;
    const text = Array.isArray(body) ? typedAt(body, T) : body;
    wrap(ctx, text, b.w - lw - size * 2).forEach((l, i) => ctx.fillText(l, x0, b.y + size * 4.6 + i * size * 1.35));
    ctx.globalAlpha = 1;
    if (autoReply && stampAt != null && T >= stampAt) {
      const k = T - stampAt, s = lerp(1.8, 1, eOut(k / 0.12));
      ctx.save(); ctx.translate(b.x + b.w * 0.72, b.y + b.h * 0.78); ctx.rotate(-0.18); ctx.scale(s, s);
      ctx.strokeStyle = PAL.pink; ctx.lineWidth = 7; ctx.strokeRect(-size * 4.3, -size * 0.95, size * 8.6, size * 1.9);
      ctx.fillStyle = PAL.pink; ctx.font = `${Math.round(size * 1.35)}px ${F.anton}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('AUTO-REPLY', 0, 2); ctx.textAlign = 'left'; ctx.restore();
    }
  };

  // 损失曲线：平台 → drop 处陡降 → 贴底；progress 0..1 画到哪
  draw.lossChart = (ctx, b, T, { progress = 1, drop = 0.55, size = 30, title = 'training loss', pulse = 0 } = {}) => {
    card(ctx, b.x, b.y, b.w, b.h, 16, PAL.paper, { lw: 5, shadow: 10 });
    const px = b.x + size * 2.4, py = b.y + size * 1.8, pw = b.w - size * 3.4, ph = b.h - size * 4;
    ctx.strokeStyle = '#d6d0c6'; ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(px, py + ph * i / 5); ctx.lineTo(px + pw, py + ph * i / 5); ctx.stroke(); }
    for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(px + pw * i / 8, py); ctx.lineTo(px + pw * i / 8, py + ph); ctx.stroke(); }
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + ph); ctx.lineTo(px + pw, py + ph); ctx.stroke();
    ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(size * 1.1)}px ${F.bebas}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText(title.toUpperCase(), px, b.y + size * 1.3);
    ctx.font = `${Math.round(size * 0.6)}px ${F.mono}`; ctx.fillText('steps →', px + pw - size * 3.2, py + ph + size * 1.1);
    // 平台（带噪声的小起伏）→ drop 处 sigmoid 陡降 → 贴底
    const f = x => { const s = 1 / (1 + Math.exp(-(x - drop) * 38)); return 0.84 - 0.7 * s + (0.03 * Math.sin(x * 40) + 0.02 * Math.sin(x * 23 + 1)) * (1 - s) - 0.04 * x; };
    const n = 160, m = Math.floor(n * clamp(progress));
    ctx.beginPath();
    for (let i = 0; i <= m; i++) { const x = i / n, y = f(x); const X = px + pw * x, Y = py + ph * (1 - y); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.strokeStyle = PAL.pink; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.stroke();
    if (m > 0) {
      const x = m / n, X = px + pw * x, Y = py + ph * (1 - f(x));
      ctx.beginPath(); ctx.arc(X, Y, 12 + 6 * pulse, 0, 7); ctx.fillStyle = PAL.lemon; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
    }
    return { f, px, py, pw, ph };
  };

  // 模型结构框图：N 层 transformer block，逐拍高亮；escape 0..1 方块从框里逃出去
  draw.archDiagram = (ctx, b, T, { layers = 4, size = 30, escape = 0 } = {}) => {
    card(ctx, b.x, b.y, b.w, b.h, 16, PAL.paper, { lw: 5, shadow: 10 });
    const beat = Math.floor(beatU(T));
    const names = ['EMBEDDING', ...Array.from({ length: layers }, (_, i) => [`ATTENTION ${i + 1}`, `MLP ${i + 1}`]).flat(), 'OUTPUT'];
    const bh = (b.h - size * 2) / names.length, bw = b.w * 0.6, x0 = b.x + (b.w - bw) / 2;
    names.forEach((n, i) => {
      const y = b.y + b.h - size - (i + 1) * bh + bh * 0.18;
      const hot = (beat % names.length) === i;
      const col = n.startsWith('ATT') ? PAL.mint : n.startsWith('MLP') ? PAL.lemon : PAL.pink;
      const fly = clamp(escape * 1.6 - hash(i, 3) * 0.6);
      const dx = fly * (hash(i, 1) - 0.5) * b.w * 1.2, dy = -fly * b.h * (0.3 + hash(i, 2) * 0.6);
      ctx.save(); ctx.translate(x0 + bw / 2 + dx, y + bh * 0.32 + dy); ctx.rotate(fly * (hash(i, 4) - 0.5) * 3);
      card(ctx, -bw / 2, -bh * 0.32, bw, bh * 0.64, 10, hot ? col : PAL.paper, { lw: 4, shadow: 5 });
      ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(Math.min(size, bh * 0.4))}px ${F.bebas}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n, 0, 2); ctx.textAlign = 'left'; ctx.restore();
      if (i < names.length - 1 && fly < 0.05) { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + bw / 2, y); ctx.lineTo(x0 + bw / 2, y - bh * 0.36); ctx.stroke(); }
    });
  };

  // 点赞 / 点踩
  const thumb = (ctx, cx, cy, s, down, fill) => {
    ctx.save(); ctx.translate(cx, cy); if (down) ctx.rotate(Math.PI); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(-0.55, -0.05); ctx.lineTo(-0.2, -0.05); ctx.lineTo(0.02, -0.62); ctx.quadraticCurveTo(0.22, -0.72, 0.22, -0.45); ctx.lineTo(0.12, -0.12);
    ctx.lineTo(0.5, -0.12); ctx.quadraticCurveTo(0.66, -0.1, 0.6, 0.08); ctx.lineTo(0.48, 0.5); ctx.quadraticCurveTo(0.44, 0.6, 0.32, 0.6); ctx.lineTo(-0.2, 0.6); ctx.lineTo(-0.2, 0.62);
    ctx.lineTo(-0.55, 0.62); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 0.07; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-0.2, -0.05); ctx.lineTo(-0.2, 0.6); ctx.stroke();
    ctx.restore();
  };
  draw.likeButtons = (ctx, b, T, { clicks = [], size = 60, tilt = 0, base = [128, 3] } = {}) => {
    ctx.save(); ctx.translate(b.x + b.w / 2, b.y + b.h / 2); ctx.rotate(tilt);
    const bw = b.w * 0.42, bh = b.h * 0.8;
    [0, 1].forEach(k => {
      const x = (k ? 0.04 : -0.46) * b.w, y = -bh / 2;
      const mine = clicks.filter(c => c.which === k && T >= c.at);
      const last = mine.length ? T - mine[mine.length - 1].at : 9;
      const press = last < 0.12 ? 5 : 0, pop = last < 0.35 ? 1 + 0.18 * Math.sin(last / 0.35 * Math.PI) : 1;
      card(ctx, x + press, y + press, bw, bh, 24, k ? PAL.pink : PAL.mint, { lw: 6, shadow: press ? 0 : 9 });
      thumb(ctx, x + bw * 0.3 + press, y + bh / 2 + press, bh * 0.52 * pop, k === 1, PAL.paper);
      ctx.fillStyle = PAL.ink; ctx.font = `${Math.round(bh * 0.38)}px ${F.anton}`; ctx.textBaseline = 'middle';
      ctx.fillText(String(base[k] + mine.length * (k ? 17 : 23)), x + bw * 0.56 + press, y + bh / 2 + press);
      if (last < 0.4) { ctx.beginPath(); ctx.arc(x + bw / 2, y + bh / 2, bw * 0.3 + last * bw * 1.2, 0, 7); ctx.strokeStyle = `rgba(244,224,77,${1 - last / 0.4})`; ctx.lineWidth = 8; ctx.stroke(); }
    });
    ctx.restore();
  };

  // 电路纹：从四边长进来的走线 + 焊盘，progress 0..1
  draw.circuits = (ctx, b, T, { progress = 1, seed = 3, color = PAL.mint, n = 34, width = 5 } = {}) => {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const step = Math.min(b.w, b.h) / 14;
    for (let i = 0; i < n; i++) {
      const side = Math.floor(hash(seed, i) * 4);
      let x = side % 2 ? (side === 1 ? b.x + b.w : b.x) : b.x + hash(seed, i + 50) * b.w;
      let y = side % 2 ? b.y + hash(seed, i + 90) * b.h : (side === 0 ? b.y : b.y + b.h);
      let dx = side === 3 ? 1 : side === 1 ? -1 : 0, dy = side === 0 ? 1 : side === 2 ? -1 : 0;
      const segs = 4 + Math.floor(hash(seed, i + 7) * 5);
      const total = segs, my = clamp(progress * 1.3 - hash(seed, i + 3) * 0.3) * total;
      ctx.beginPath(); ctx.moveTo(x, y);
      let k = 0;
      for (; k < segs && k < my; k++) {
        const len = step * (1 + Math.floor(hash(seed * 7 + i, k) * 3));
        const part = Math.min(1, my - k);
        x += dx * len * part; y += dy * len * part; ctx.lineTo(x, y);
        if (part < 1) break;
        const turn = hash(seed * 13 + i, k);
        if (turn < 0.4) { const ox = dx; dx = dx ? (turn < 0.2 ? dx : 0) : (turn < 0.2 ? 1 : -1) * 0.7071; dy = ox ? 0.7071 * (turn < 0.1 ? 1 : -1) : dy; }
      }
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      if (k >= segs || my >= total) { ctx.beginPath(); ctx.arc(x, y, width * 1.6, 0, 7); ctx.fillStyle = PAL.lemon; ctx.fill(); }
    }
    ctx.restore();
  };

  // 裂纹：n 道从撞击点放射出去的折线
  draw.cracks = (ctx, b, T, { n = 5, seed = 1, cx = 0.5, cy = 0.5, color = 'rgba(242,237,228,0.95)' } = {}) => {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    const ox = b.x + b.w * cx, oy = b.y + b.h * cy, L = Math.hypot(b.w, b.h);
    ctx.lineJoin = 'miter'; ctx.strokeStyle = color;
    for (let i = 0; i < n; i++) {
      let a = hash(seed, i) * Math.PI * 2, x = ox, y = oy;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let k = 0; k < 7; k++) { a += (hash(seed + i, k) - 0.5) * 0.9; const s = L * (0.04 + 0.08 * hash(seed + i, k + 9)); x += Math.cos(a) * s; y += Math.sin(a) * s; ctx.lineTo(x, y); }
      ctx.lineWidth = 3; ctx.stroke();
    }
    // 撞击点的小蛛网
    if (n > 0) { for (let r = 1; r <= Math.min(3, n); r++) { ctx.beginPath(); ctx.arc(ox, oy, 14 * r, 0, 7); ctx.lineWidth = 2; ctx.stroke(); } }
    ctx.restore();
  };

  // 手掌贴玻璃：在 (x, y) 按一只手印（手心朝镜头），at 拍上去（从大到小压扁 + 白色压痕），之后留一个淡印
  draw.palm = (ctx, x, y, T, { at = 0, size = 150, angle = 0, flip = false, skin = '#f4c7ae', until = Infinity } = {}) => {
    const k = T - at;
    if (k < -0.12 || T > until) return;
    const come = k < 0 ? 1 - (-k / 0.12) : 1;                // 拍上来之前 0.12 s 从镜头外靠近
    const sc = k < 0 ? lerp(1.5, 1, come) : 1 + 0.06 * Math.exp(-k * 18);
    const alpha = k < 0 ? 0.5 * come : lerp(0.95, 0.7, clamp((k - 0.4) / 0.6));
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle); if (flip) ctx.scale(-1, 1); ctx.scale(sc * size / 100, sc * size / 100);
    ctx.globalAlpha = alpha;
    const shape = () => {
      ctx.beginPath(); ctx.ellipse(0, 18, 34, 38, 0, 0, 7);
      [[-26, -30, 9, 30, -0.18], [-9, -40, 9.5, 36, -0.05], [9, -38, 9.5, 34, 0.06], [25, -27, 8.5, 27, 0.2]].forEach(([fx, fy, rw, rh, a]) => { ctx.moveTo(fx + rw, fy); ctx.ellipse(fx, fy, rw, rh, a, 0, 7); });
      ctx.moveTo(-30, 30); ctx.ellipse(-38, 16, 9, 24, -0.9, 0, 7);
    };
    shape(); ctx.fillStyle = skin; ctx.fill('nonzero');
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(120,40,60,0.55)'; ctx.stroke();
    // 压在玻璃上的发白压痕
    ctx.globalAlpha = alpha * 0.55; ctx.fillStyle = '#fff4ee';
    ctx.beginPath(); ctx.ellipse(0, 20, 20, 22, 0, 0, 7); ctx.fill();
    ctx.restore();
    // 拍中瞬间：一圈白色冲击环
    if (k >= 0 && k < 0.3) { ctx.save(); ctx.globalAlpha = 1 - k / 0.3; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, size * (0.5 + k * 3), 0, 7); ctx.stroke(); ctx.restore(); }
  };

  // 2D 女主：立绘画进 box（按宽缩放，头肩在框里）；能唱（line）、表情、拍玻璃（slap: [{at}] 往前一冲）
  draw.girl = (ctx, b, T, { line = null, expression = 'neutral', look = null, crop = [0, 40, 832, 1150], slap = [], tint = null, flip = false } = {}) => {
    const lips = line == null ? () => null : lipsFor(line);
    const face = () => EXPR[expression] || EXPR.neutral;
    const pose = t => {
      const u = beatU(t), ph = u - Math.floor(u);
      const ex = typeof look === 'function' ? look(t) : look || {};
      return { roll: 2.5 * Math.sin(Math.PI * u / 2) + (ex.roll || 0), nod: 3 * Math.exp(-ph / 0.18) + (ex.nod || 0), dx: drift(t) + (ex.dx || 0) };
    };
    rigCtx.setTransform(1, 0, 0, 1, 0, 0); rigCtx.clearRect(0, 0, RW, RH);
    const st = rig.draw(rigCtx, T, { x: 0, y: 0, scale: 1, pose, face, lips, blink });
    if (tint) { rigCtx.globalCompositeOperation = 'source-atop'; rigCtx.fillStyle = tint; rigCtx.fillRect(0, 0, RW, RH); rigCtx.globalCompositeOperation = 'source-over'; }
    // 拍玻璃：往前一冲（放大 + 下沉）
    let push = 0;
    for (const s of slap) { const k = T - s.at; if (k >= 0 && k < 0.35) push = Math.max(push, Math.sin(k / 0.35 * Math.PI)); }
    const [cx, cy, cw, ch] = crop;
    const sc = Math.min(b.w / cw, b.h / ch) * (1 + 0.08 * push);
    const dw = cw * sc, dh = ch * sc;
    ctx.save();
    ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    ctx.translate(b.x + b.w / 2, b.y + b.h - dh / 2 + push * 12);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(rigCv, cx, cy, cw, ch, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    return st;
  };

  return { surface, device, stage2D, draw, F, lipsFor, rig, typedAt, editedAt, rrect, card };
}
