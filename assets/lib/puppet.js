// 2D 骨骼纸偶运行库：读 episode-maker 产出的 puppet.json（部件 PNG + 关节枢轴 + 父子层级），
// 画成 t 的纯函数。可画到任意 2D canvas；配 three 舞台时用 puppetPlane() 放进 CanvasTexture 平面。
//
//   import { loadPuppet, loadPoses, clip, dancer, mirrorPose, puppetPlane } from '../../assets/lib/puppet.js';
//   const cat   = await loadPuppet('.../cats/puppet/orange/puppet.json', { extra: ['head_blink.png'] });
//   const POSES = await loadPoses('.../cats/puppet/poses.json');           // { 名字: pose }
//   const groove = clip({ beats: 4, poses: POSES, keys: [
//     { b: 0, pose: '左摆' }, { b: 1, pose: '双手举高', ease: 'back' }, { b: 2, pose: '右摆' }, { b: 3, pose: '蹲跳', squash: 0.12 },
//   ] });
//   const d = dancer({ clip: groove, music: M, offset: 0.5, mirror: true });   // 错半拍、左右镜像
//   cat.draw(ctx, t, d, { x: 400, y: 900, scale: 0.4, shadow: true, rim: { color: '#ffd9a0' } });
//
// ─ 概念 ─
//   pose   { root:[dx,dy], <部件名>: 角度(度，正 = 屏幕顺时针), squash: s, bend: { tail: 度 }, swap: { head: 'x.png' } }
//          缺省的部件角度 = 0（= puppet.json 的原画姿势，通常是 T-pose）
//   poseFn t → pose 的纯函数。clip()/dancer()/keyed() 都返回 poseFn
//   squash >0 压扁（落地）<0 拉长（起跳），以脚底为锚点，体积大致守恒
//   bend   对指定部件做「切片弯曲」网格变形（尾巴、头发、身体）：总弯曲角 + 弹簧滞后（跟随父骨骼的角速度和根平移）
//   swap   换图：值可以是文件名（需在 loadPuppet 的 extra 里预载），或 puppet.json 里 part.variants 的名字
//
// 世界变换 = 父变换 · T(pivot) · R(θ) · T(−pivot)，按 z 从小到大画（与 puppet.json 的 note 一致）。

const RAD = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const EASE = {
  linear: p => p,
  inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
  out: p => 1 - (1 - p) ** 3,
  in: p => p * p * p,
  back: p => { const c = 1.9, c3 = c + 1; return 1 + c3 * (p - 1) ** 3 + c * (p - 1) ** 2; },       // 过冲
  // hit：前 40% 冲到位（带一点过冲）然后停住 —— 舞蹈「卡拍」
  hit: p => { const q = clamp(p / 0.4); const c = 1.4, c3 = c + 1; return 1 + c3 * (q - 1) ** 3 + c * (q - 1) ** 2; },
  hold: p => (p < 1 ? 0 : 1),
};

function loadImage(url) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error(`读不到 ${url}`)); im.src = url; });
}

export async function loadPoses(url) {
  const r = await fetch(url); if (!r.ok) throw new Error(`读不到 ${url}`);
  return (await r.json()).poses;
}

// ---------------------------------------------------------------- 姿势运算
const NUM_SKIP = new Set(['root', 'bend', 'swap']);
export function lerpPose(a, b, p) {
  const out = { root: [(a.root?.[0] ?? 0) + ((b.root?.[0] ?? 0) - (a.root?.[0] ?? 0)) * p, (a.root?.[1] ?? 0) + ((b.root?.[1] ?? 0) - (a.root?.[1] ?? 0)) * p] };
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (NUM_SKIP.has(k)) continue;
    out[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * p;
  }
  const bk = new Set([...Object.keys(a.bend || {}), ...Object.keys(b.bend || {})]);
  if (bk.size) { out.bend = {}; for (const k of bk) out.bend[k] = (a.bend?.[k] ?? 0) + ((b.bend?.[k] ?? 0) - (a.bend?.[k] ?? 0)) * p; }
  const sw = p < 0.5 ? a.swap : b.swap;
  if (sw) out.swap = sw;
  return out;
}
/** 叠加：b 的角度 / 位移加到 a 上（例如舞蹈 + 呼吸 + 点头） */
export function addPose(a, b) {
  const out = { ...a, root: [(a.root?.[0] ?? 0) + (b.root?.[0] ?? 0), (a.root?.[1] ?? 0) + (b.root?.[1] ?? 0)] };
  for (const k of Object.keys(b)) if (!NUM_SKIP.has(k)) out[k] = (a[k] ?? 0) + b[k];
  if (b.bend) { out.bend = { ...(a.bend || {}) }; for (const k in b.bend) out.bend[k] = (out.bend[k] ?? 0) + b.bend[k]; }
  if (b.swap) out.swap = { ...(a.swap || {}), ...b.swap };
  return out;
}
/** 动作左右镜像（美术不翻）：_l ↔ _r 互换、角度取反、根平移 x 取反 */
export function mirrorPose(p) {
  const sw = k => (k.endsWith('_l') ? k.slice(0, -2) + '_r' : k.endsWith('_r') ? k.slice(0, -2) + '_l' : k);
  const out = { root: [-(p.root?.[0] ?? 0), p.root?.[1] ?? 0] };
  for (const k of Object.keys(p)) if (!NUM_SKIP.has(k)) out[sw(k)] = k === 'squash' ? p[k] : -p[k];
  if (p.bend) { out.bend = {}; for (const k in p.bend) out.bend[sw(k)] = -p.bend[k]; }
  if (p.swap) { out.swap = {}; for (const k in p.swap) out.swap[sw(k)] = p.swap[k]; }
  return out;
}

// ---------------------------------------------------------------- 关键帧 / 舞蹈片段
/**
 * 按秒的关键帧：keys [{ t, pose(对象或名字), ease='inOut', squash?, root?, ...覆盖 }]，poses = 名字表。返回 poseFn
 */
export function keyed(keys, { poses = {} } = {}) {
  const K = keys.map(k => ({ ...k, P: resolve(k, poses) })).sort((a, b) => a.t - b.t);
  return t => {
    if (t <= K[0].t) return K[0].P;
    for (let i = 1; i < K.length; i++) if (t < K[i].t) return lerpPose(K[i - 1].P, K[i].P, (EASE[K[i].ease] || EASE.inOut)((t - K[i - 1].t) / (K[i].t - K[i - 1].t)));
    return K.at(-1).P;
  };
}
function resolve(k, poses) {
  const base = typeof k.pose === 'string' ? poses[k.pose] : k.pose || {};
  if (!base) throw new Error(`没有舞姿 ${k.pose}`);
  const P = { ...base, root: [...(base.root || [0, 0])] };
  for (const f of Object.keys(k)) if (!['t', 'b', 'pose', 'ease'].includes(f)) P[f] = k[f];
  return P;
}
/**
 * 舞蹈片段（以拍为单位，循环）：{ beats, keys: [{ b, pose, ease='hit', ...覆盖 }], poses }。
 * 返回 x(拍位置，可以是小数) → pose。第 b 拍的关键帧在该拍「到位」（ease 从上一个关键帧开始算）。
 */
export function clip({ beats = 4, keys, poses = {}, loop = true }) {
  const K = keys.map(k => ({ ...k, P: resolve(k, poses) })).sort((a, b) => a.b - b.b);
  return x => {
    let u = loop ? ((x % beats) + beats) % beats : clamp(x, 0, beats);
    // 找 u 落在哪两个关键帧之间（首尾相接）
    let i = K.length - 1;
    for (let j = 0; j < K.length; j++) if (u >= K[j].b) i = j;
    const a = K[i], b = K[(i + 1) % K.length];
    let span = b.b - a.b; if (span <= 0) span += beats;
    let du = u - a.b; if (du < 0) du += beats;
    if (u < K[0].b) { // 在第一个关键帧之前 = 从最后一个过渡到第一个
      const last = K.at(-1); span = K[0].b + beats - last.b; du = u + beats - last.b;
      return lerpPose(last.P, K[0].P, (EASE[K[0].ease || 'hit'])(du / span));
    }
    return lerpPose(a.P, b.P, (EASE[b.ease || 'hit'])(du / span));
  };
}
/**
 * 用音乐拍相位驱动片段：t → pose。offset 以拍计（0.5 = 错半拍），mirror 镜像动作，speed 倍速（0.5 = 半速），
 * base 叠加一层常驻姿势（例如整体后仰），from/to 秒：片段只在这段时间内起作用，其余时间用 idle 姿势。
 */
export function dancer({ clip: c, music, offset = 0, mirror = false, speed = 1, base = null, idle = null, from = -Infinity, to = Infinity }) {
  return t => {
    let P;
    if ((t < from || t >= to) && idle) P = idle;
    else {
      const b = music.beat(t);
      P = c((b.i + b.phase) * speed + offset);
    }
    if (mirror) P = mirrorPose(P);
    if (base) P = addPose(P, base);
    return P;
  };
}

// ---------------------------------------------------------------- 纸偶
export async function loadPuppet(url, { extra = [] } = {}) {
  const r = await fetch(url); if (!r.ok) throw new Error(`读不到 ${url}`);
  const data = await r.json();
  const base = new URL('.', new URL(url, location.href));
  const images = new Map();
  const files = new Set([...data.parts.map(p => p.file), ...extra, ...data.parts.flatMap(p => Object.values(p.variants || {}))]);
  await Promise.all([...files].map(async f => images.set(f, await loadImage(new URL(f, base).href))));
  const parts = [...data.parts].sort((a, b) => a.z - b.z);
  const byName = Object.fromEntries(data.parts.map(p => [p.name, p]));
  // 脚底锚点：所有部件包围盒的最低点、水平中心取画布中线
  const footY = Math.max(...data.parts.map(p => p.origin[1] + p.size[1]));
  const footX = data.canvas[0] / 2;
  const chain = name => { const out = []; for (let p = byName[name]; p; p = byName[p.parent]) out.push(p.name); return out; };

  // 2×3 矩阵 [a,b,c,d,e,f]（与 canvas setTransform 同序）
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  const rotAt = (px, py, deg) => { const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD); return [c, s, -s, c, px - c * px + s * py, py - s * px - c * py]; };

  function world(pose) {
    const M = {};
    const get = name => {
      if (M[name]) return M[name];
      const p = byName[name];
      const parent = p.parent ? get(p.parent) : [1, 0, 0, 1, 0, 0];
      return (M[name] = mul(parent, rotAt(p.pivot[0], p.pivot[1], pose[name] ?? 0)));
    };
    data.parts.forEach(p => get(p.name));
    return M;
  }

  /** 某部件在纸偶画布坐标里的点（例如道具尖端），用于拖尾、激光起点等 */
  function pointOf(pose, partName, x, y) {
    const m = world(pose)[partName];
    return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  }

  const chainAngle = (pose, name) => chain(name).reduce((a, n) => a + (pose[n] ?? 0), 0);

  function drawPart(ctx, p, img, pose, bendCfg, lagFn) {
    const [ox, oy] = p.origin, [w, h] = p.size, [plx, ply] = p.pivot_local;
    const total = pose.bend?.[p.name] ?? 0;
    if (!bendCfg && !total) { ctx.drawImage(img, ox, oy); return; }
    const segs = bendCfg?.segs ?? 6;
    // 弯曲轴：枢轴 → 「<部件名>_tip」关节（没有就竖直往下/往上）；切片绕轴线上的点转，不会裂开
    const tipJ = data.joints?.[`${p.name}_tip`];
    const down = tipJ ? tipJ[1] - oy > ply : ply < h / 2;
    const [ex, ey] = tipJ ? [tipJ[0] - ox, tipJ[1] - oy] : [plx, down ? h : 0];
    const cxAt = r => plx + (ex - plx) * (r - ply) / ((ey - ply) || 1);
    const dir = down ? 1 : -1, L = down ? h - ply : ply;
    ctx.save();
    ctx.translate(ox + plx, oy + ply);
    // 枢轴另一侧的一小段不弯
    if (down && ply > 0) ctx.drawImage(img, 0, 0, w, ply + 1, -plx, -ply, w, ply + 1);
    if (!down && ply < h) ctx.drawImage(img, 0, ply - 1, w, h - ply + 1, -plx, -1, w, h - ply + 1);
    let prevLag = 0;
    for (let k = 0; k < segs; k++) {
      const lag = lagFn ? lagFn(k + 1) : 0;
      ctx.rotate((total / segs + (lag - prevLag)) * RAD);
      prevLag = lag;
      const r0 = ply + dir * (L * k) / segs, r1 = ply + dir * (L * (k + 1)) / segs;
      const top = Math.max(0, Math.min(r0, r1) - 1), hh = Math.min(h - top, Math.abs(r1 - r0) + 2);
      ctx.drawImage(img, 0, top, w, hh, -cxAt(r0), top - r0, w, hh);
      ctx.translate(cxAt(r1) - cxAt(r0), r1 - r0);
    }
    ctx.restore();
  }

  /**
   * 画一帧。poseFn: t → pose（或直接给 pose 对象）。opts:
   *   x, y      画布上脚底中心的位置；scale 缩放；flip 美术左右翻转（整张图镜像）
   *   bend      { 部件名: { segs=6, delay=0.045 秒, gain=0.9, rootGain=0.25 } } —— 这些部件走切片弯曲 + 弹簧滞后
   *   filter    canvas filter 串（占位染色用，例如 'hue-rotate(160deg) saturate(0.4)'）
   *   shadow    true | { w, alpha, color }：脚下软阴影（跳起时变小变淡）
   *   rim       { color, width=6, alpha=0.8, dir=[1,-0.4] }：场景边缘光（只在朝光一侧），需要 ctx 所在画布只画这一个纸偶
   *   tint      { color, alpha }：整体叠场景色调（source-atop）
   */
  function draw(ctx, t, poseFn, opts = {}) {
    const { x = 0, y = 0, scale = 1, flip = false, bend = {}, filter = 'none', shadow = false, rim = null, tint = null } = opts;
    const pose = typeof poseFn === 'function' ? poseFn(t) : poseFn;
    const M = world(pose);
    const [rx, ry] = pose.root || [0, 0];
    const sq = pose.squash ?? 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * (flip ? -1 : 1), scale);
    ctx.translate(rx, ry);
    // squash & stretch：以脚底为锚
    ctx.scale(1 + sq * 0.5, 1 - sq);
    ctx.translate(-footX, -footY);
    ctx.filter = filter;
    for (const p of parts) {
      const file = pose.swap?.[p.name];
      const img = images.get(p.variants?.[file] ?? file ?? p.file) || images.get(p.file);
      const cfg = bend[p.name];
      const lagFn = cfg && typeof poseFn === 'function' ? k => {
        // 弹簧滞后：第 k 段跟随「k·delay 秒之前」的父链角度 + 根平移
        const dt = k * (cfg.delay ?? 0.045);
        const past = poseFn(t - dt);
        const d = chainAngle(past, p.name) - chainAngle(pose, p.name) + ((past.root?.[0] ?? 0) - rx) * (cfg.rootGain ?? 0.25);
        return d * (cfg.gain ?? 0.9);
      } : null;
      ctx.save();
      ctx.transform(...M[p.name]);
      drawPart(ctx, p, img, pose, cfg, lagFn);
      ctx.restore();
    }
    ctx.filter = 'none';
    ctx.restore();
    if (rim || tint) grade(ctx, { rim, tint });
    if (shadow) {
      const s = shadow === true ? {} : shadow;
      const lift = clamp(-ry / 160);
      const w = (s.w ?? 300) * scale * (1 - 0.4 * lift) * (1 + sq * 0.5);
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.translate(x + rx * scale * (flip ? -1 : 1), y);
      ctx.scale(1, 0.22);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w / 2);
      const a = (s.alpha ?? 0.45) * (1 - 0.6 * lift);
      g.addColorStop(0, `rgba(${s.rgb ?? '30,20,40'},${a})`); g.addColorStop(1, `rgba(${s.rgb ?? '30,20,40'},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    return { pose, M };
  }

  return { data, parts, byName, images, footX, footY, world, pointOf, draw, canvas: data.canvas };
}

// 边缘光 + 色调：作用于整张画布（画布上应只有这个纸偶）
const scratch = (() => { let c; return (w, h) => { c ??= document.createElement('canvas'); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } return c; }; })();
function grade(ctx, { rim, tint }) {
  const cv = ctx.canvas, W = cv.width, H = cv.height;
  if (rim) {
    const s = scratch(W, H), g = s.getContext('2d');
    const [dx, dy] = rim.dir ?? [1, -0.4], n = Math.hypot(dx, dy) || 1, wpx = rim.width ?? 6;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
    g.drawImage(cv, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = rim.color ?? '#ffe0a8'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'destination-out'; g.drawImage(cv, (-dx / n) * wpx, (-dy / n) * wpx);
    g.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = rim.alpha ?? 0.8; ctx.globalCompositeOperation = 'source-atop';
    ctx.drawImage(s, 0, 0); ctx.restore();
  }
  if (tint) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = tint.alpha ?? 0.15; ctx.fillStyle = tint.color;
    ctx.fillRect(0, 0, W, H); ctx.restore();
  }
}

/**
 * 放进 three 舞台：一只纸偶一块 CanvasTexture 平面（默认朝向相机）。
 *   const a = puppetPlane(stage, cat, { x, y: 脚底世界 y, z, height: 纸偶原画布高对应的世界高度, res: 0.5 });
 *   a.paint(t, poseFn, drawOpts)   —— 每帧调
 * 平面比纸偶画布四周多留 margin（给跳跃、道具、阴影），脚底锚点在平面下方 pad 处。
 */
export function puppetPlane(stage, puppet, { x = 0, y = 0, z = 0, height = 400, res = 0.5, margin = [0.35, 0.3], billboard = true, bloom = false } = {}) {
  const [cw, ch] = puppet.canvas;
  const pxW = Math.round(cw * (1 + 2 * margin[0]) * res), pxH = Math.round(ch * (1 + margin[1]) * res);
  const k = height / ch;                                    // 世界单位 / 原画布像素
  const worldW = cw * (1 + 2 * margin[0]) * k, worldH = ch * (1 + margin[1]) * k;
  const footPad = 0.06 * ch * res;                          // 脚底离纹理底边的距离（留给阴影）
  const plane = stage.addCanvasPlane({ res: [pxW, pxH], size: [worldW, worldH], x, y: y - footPad / res * k + worldH / 2, z, billboard, bloom });
  return {
    plane,
    /** 纸偶画布坐标 → 世界坐标（例如道具尖端） */
    toWorld(px, py, flip = false) { return [x + ((flip ? cw - px : px) - puppet.footX) * k, y - (py - puppet.footY) * k, z]; },
    paint(t, poseFn, opts = {}) {
      let out;
      plane.paint(c => { out = puppet.draw(c, t, poseFn, { ...opts, x: pxW / 2, y: pxH - footPad, scale: res }); });
      return out;
    },
    setPosition(nx, ny, nz = z) { x = nx; y = ny; z = nz; plane.mesh.position.set(nx, ny - footPad / res * k + worldH / 2, nz); },
  };
}
