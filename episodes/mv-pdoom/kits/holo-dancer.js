// kits/holo-dancer.js —— 表演镜头的共用组件（#1033）：镭射全息伴舞 + 舞台背景 LED 大屏。
//
// ① 镭射全息伴舞：她自己的复制体（同一个 3D 模型），半透明 + 扫描线 + 彩虹镭射色散 / 菲涅尔边光 + 轻微抖动和错位残影，
//    站在舞台上固定的位置，动作可以比音乐晚几拍、可以左右镜像。
//
//   import { createHoloDancers } from '../kits/holo-dancer.js';
//   const crew = await createHoloDancers(mv, lead, { slots: [{ x: -1.5, z: -0.6 }, { x: 1.5, z: -0.6, mirror: true }, { x: -2.7, z: -1, delay: 0.5 }, …] });
//   scene.add(crew.group);                      // group 放在舞台上（位置 / 朝向自己摆；不跟着 lead 走）
//   每帧：crew.update(T, { seq, opacity, jitter })      // seq 同 girl.play 的编排；也可给 moves（girl.dance 的参数）
//     slots[i]：x, z（舞台坐标，单位 = 身高）、delay（晚几拍，默认 opts.delay = 0.5）、mirror（左右镜像）、hue（色相偏移 0..1）、scale
//     每种 delay 一个独立骨架（额外加载一个 girl 实例，不带实时脸）；同一 delay 的复制体共用骨架，动作完全一致。
//     opacity 0..1（出场 / 退场）；jitter 0..1（横向抖动的强度，默认 0.25）
//   lead 只用来取贴图；传 null 也行。
//
// ② LED 大屏：一块 16:9 的屏，屏上是她的 2D 近景（closeup/layers 的 rig：按 lyrics.json 逐词换口型、会眨眼、跟拍子轻摆头），
//    带像素格 / 扫描 / 泛光；下沿可以带一条歌词字幕条。镜头推近到屏幕铺满画面时把 led 调到 0，就是干净的 2D 唱歌特写。
//
//   import { createLedScreen } from '../kits/holo-dancer.js';
//   const led = await createLedScreen(mv, { width: 6.4 });          // 高 = 宽 × 9/16；mesh 的中心在原点、朝 +Z
//   scene.add(led.mesh); led.mesh.position.set(0, 2.4, -3.2);
//   每帧：led.update(T, { line, expression, led: 1, ticker: true, zoom: 1 })
//
//   大屏素材库（#1055）：屏上不必全程同一张正面特写，可以按时间表插动作片段（甩头发、回眸、指镜头、眼睛特写…，
//   清单见 episodes/cast-cyber-girl/closeup/screen-clips/README.md）。片段不对口型，和逐词对口型的特写按小节交替：
//   import { createLedScreen, barSchedule } from '../kits/holo-dancer.js';
//   const led = await createLedScreen(mv, { schedule: barSchedule(mv, { t0: 78.42, pattern: ['hairflip', 'rig', 'point', 'rig'] }) });
//     pattern 每项占一小节（bars 可改），'rig' = 对口型特写；也可以直接手写 schedule: [{ t0, t1, clip, mode, rate, zoom, x, y, flip }]
//   经 kits/stage.js 用：createStage(mv, { led: { schedule } })；某一帧临时指定：stage.update 的 screen: { clip: 'sway' }（片段要先写进 led: { clips: [...] } 预载）
//
// 全部是 T 的纯函数（画布每帧整张重画，抖动图案按 hash(T)）。

import * as THREE from 'three';
import { createGirl } from './girl.js';
import { PALETTE } from '../engine/palette.js';
import { loadRig, lipsync, blinks, wobble } from '../../../assets/lib/layer-rig.js';

/* ================================================================ 镭射全息伴舞 */
const VERT = /* glsl */`
#include <common>
#include <skinning_pars_vertex>
uniform float uTime; uniform float uJit; uniform vec3 uShift; uniform float uSeed;
varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
void main() {
  vUv = uv;
  #include <skinbase_vertex>
  #include <beginnormal_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  // 抖动：按高度分带，每 1/12 秒换一次，少数几带横向错开一点
  float fr = floor(uTime * 12.0), band = floor(wp.y * 26.0);
  float h = h11(band * 3.1 + fr * 17.0 + uSeed);
  if (h < uJit * 0.3) wp.x += (h11(band + fr + uSeed) - 0.5) * 0.07;
  wp.xyz += uShift;
  vW = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vV = -mv.xyz;
  vN = normalize(normalMatrix * objectNormal);
  gl_Position = projectionMatrix * mv;
}`;
const FRAG = /* glsl */`
uniform float uTime; uniform float uOpacity; uniform float uHue; uniform float uGain; uniform sampler2D uMap; uniform float uHasMap;
varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
void main() {
  vec3 n = normalize(vN), v = normalize(vV);
  float fres = pow(1.0 - abs(dot(n, v)), 1.5);
  // 镭射色散：色相跟着视角、法线和高度走，慢慢流动（像镭射膜）
  float hue = fract(uHue + vW.y * 0.6 + fres * 0.85 + dot(n, vec3(0.31, 0.47, 0.22)) * 0.55 - uTime * 0.11);
  vec3 rainbow = 0.5 + 0.5 * cos(6.2832 * (hue + vec3(0.0, 0.33, 0.67)));
  rainbow = mix(rainbow, vec3(dot(rainbow, vec3(0.33))), -0.35);          // 再饱和一点
  float scan = 0.5 + 0.5 * smoothstep(0.3, 0.5, abs(fract(vW.y * 95.0 - uTime * 1.3) - 0.5) * 2.0);
  float sweep = exp(-pow((fract(vW.y * 0.8 - uTime * 0.55) - 0.5) * 8.0, 2.0));      // 一道往上走的亮带
  float l = mix(0.5, dot(texture2D(uMap, vUv).rgb, vec3(0.3, 0.59, 0.11)), uHasMap);
  vec3 col = rainbow * (0.07 + 0.3 * l + 1.9 * fres) * scan + rainbow * sweep * 0.6;
  gl_FragColor = vec4(col * uOpacity * uGain, 1.0);
}`;

function skinnedClone(src, material) {
  const m = new THREE.SkinnedMesh(src.geometry, material);
  m.bind(src.skeleton, src.bindMatrix);
  m.bindMode = THREE.DetachedBindMode;
  m.bindMatrixInverse.identity();
  m.frustumCulled = false; m.matrixAutoUpdate = false;
  return m;
}

export async function createHoloDancers(mv, lead = null, { slots = [{ x: -1.4, z: -0.5 }, { x: 1.4, z: -0.5, mirror: true }], delay = 0.5, base = true } = {}) {
  const S = slots.map((s, i) => ({ x: 0, z: 0, delay, mirror: false, hue: i * 0.21, scale: 1, ...s }));
  // 每种 delay 一个独立骨架
  const delays = [...new Set(S.map(s => s.delay))];
  const sources = new Map();
  for (const d of delays) sources.set(d, await createGirl(mv, { points: 200, face: 'none', seed: 20261001 + Math.round(d * 100) }));
  const map = (lead ?? sources.get(delays[0])).mesh.material.map ?? null;

  const group = new THREE.Group(); group.name = 'holo-dancers';
  const time = { value: 0 }, jit = { value: 0.25 };
  const mk = (s, k) => {
    const uniforms = { uTime: time, uJit: jit, uSeed: { value: s.x * 7.3 + s.z * 3.1 }, uShift: { value: new THREE.Vector3() }, uOpacity: { value: 1 }, uHue: { value: s.hue }, uGain: { value: 1 }, uMap: { value: map }, uHasMap: { value: map ? 1 : 0 } };
    // 三遍：残影（错开一点、色相偏一点，先画）→ 只写深度（自己挡自己，身体内侧的面不再层层叠亮）→ 本体
    const ghost = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: { ...uniforms, uShift: { value: new THREE.Vector3(0.035, 0.004, -0.02) }, uHue: { value: s.hue + 0.33 }, uGain: { value: 0.4 }, uOpacity: uniforms.uOpacity },
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const depth = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: 'void main(){ gl_FragColor = vec4(0.0); }', uniforms, transparent: true, colorWrite: false, depthWrite: true, side: THREE.DoubleSide });
    const main = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthFunc: THREE.LessEqualDepth, side: THREE.DoubleSide });
    const src = sources.get(s.delay);
    const g = new THREE.Group(); g.matrixAutoUpdate = false;
    [ghost, depth, main].forEach((m, i) => { const c = skinnedClone(src.mesh, m); c.renderOrder = 20 + k * 3 + i; g.add(c); });
    group.add(g);
    // 脚下的投影环
    let ring = null;
    if (base) {
      ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.225, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((s.hue + 0.45) % 1, 1, 0.6).multiplyScalar(2.2), toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(s.x, 0.006, s.z); group.add(ring);
    }
    return { ...s, g, src, uniforms, ring };
  };
  const items = S.map(mk);

  const M = new THREE.Matrix4(), inv = new THREE.Matrix4(), tr = new THREE.Matrix4(), sc = new THREE.Matrix4();
  function update(T, { seq = null, moves = null, opacity = 1, jitter = 0.25 } = {}) {
    time.value = T; jit.value = jitter;
    for (const [d, s] of sources) {
      const tt = T - d * mv.music.period;
      s.root.position.set(0, 0, 0); s.root.rotation.set(0, 0, 0); s.root.scale.setScalar(1);
      if (seq) s.play(seq, tt); else if (moves) s.dance(moves, tt);
      s.root.updateWorldMatrix(true, true);
    }
    group.updateWorldMatrix(true, false);
    for (const it of items) {
      // G = 舞台 group × 平移到站位 ×（镜像）× 缩放 × 源根⁻¹
      inv.copy(it.src.root.matrixWorld).invert();
      M.copy(group.matrixWorld).multiply(tr.makeTranslation(it.x, 0, it.z)).multiply(sc.makeScale(it.mirror ? -it.scale : it.scale, it.scale, it.scale)).multiply(inv);
      it.g.matrix.copy(M); it.g.matrixWorld.copy(M); it.g.matrixWorldNeedsUpdate = false;
      for (const c of it.g.children) { c.matrix.identity(); c.matrixWorld.copy(M); }
      it.uniforms.uOpacity.value = opacity;
      it.g.visible = opacity > 0.001;
      if (it.ring) { it.ring.visible = it.g.visible; it.ring.material.opacity = opacity; }
    }
    return group;
  }
  // g 的 matrixWorld 自己管（group 的子节点，但矩阵已经含 group.matrixWorld）
  for (const it of items) { it.g.matrixWorldAutoUpdate = false; for (const c of it.g.children) c.matrixWorldAutoUpdate = false; }
  return { group, update, items, sources: [...sources.values()] };
}

/* ================================================================ LED 大屏（2D 唱歌特写） */
const LAYERS_URL = new URL('../../cast-cyber-girl/closeup/layers/', import.meta.url);
const FONT_URL = new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url);
const CLIPS_URL = new URL('../../cast-cyber-girl/closeup/screen-clips/', import.meta.url);

/** 大屏素材库（#1055）：图生视频出的动作片段，逐帧透明底图。清单和每条的说明在 screen-clips/clips.json。
 *  names：要用到的片段名数组，或 'all'。返回 { 名: { frames: [Image], fps, dur, mode, fit, alpha } } */
export async function loadScreenClips(names = 'all', base = CLIPS_URL) {
  const root = new URL(base, location.href);          // base：换一个片段目录（对比 / 试验用），默认是素材库
  const index = await (await fetch(new URL('clips.json', root))).json();
  const want = names === 'all' ? Object.keys(index.clips) : [...new Set(names)];
  const out = {};
  await Promise.all(want.map(async name => {
    const c = index.clips[name];
    if (!c) throw new Error(`screen-clips: 没有片段 ${name}（见 clips.json）`);
    const frames = await Promise.all(Array.from({ length: c.frames }, (_, i) => {
      const im = new Image(); im.src = new URL(`${name}/f-${String(i).padStart(3, '0')}.webp`, root).href;
      return im.decode().then(() => im);
    }));
    out[name] = { ...c, name, fps: c.fps ?? index.fps, frames, dur: c.frames / (c.fps ?? index.fps) };
  }));
  return out;
}

/** 按小节排大屏内容：pattern 里每一项占 bars 小节，'rig' = 逐词对口型的 2D 特写，其余是片段名。
 *  返回 createLedScreen 的 schedule（只含片段项；没排到的时间都是 rig）。切点都落在小节强拍上。
 *  fit（默认 true）：把片段的播放速度调到正好填满它的时段（0.8–1.35 倍以内），once 类片段不会被截断 */
export function barSchedule(mv, { t0, pattern, bars = 1 }) {
  const BAR = mv.music.period * 4, out = [];
  pattern.forEach((p, i) => { if (p && p !== 'rig') out.push({ t0: t0 + i * bars * BAR, t1: t0 + (i + 1) * bars * BAR, ...(typeof p === 'string' ? { clip: p } : p) }); });
  return out;
}
const LED_VERT = /* glsl */`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const LED_FRAG = /* glsl */`
uniform sampler2D uTex; uniform vec2 uCells; uniform float uLed; uniform float uTime; uniform float uBright;
varying vec2 vUv;
void main() {
  vec2 cell = floor(vUv * uCells), f = fract(vUv * uCells);
  vec3 pix = texture2D(uTex, (cell + 0.5) / uCells).rgb;             // 每颗灯取格心的颜色
  vec3 clean = texture2D(uTex, vUv).rgb;
  float dot_ = smoothstep(0.5, 0.32, length(f - 0.5));                // 圆形灯珠
  float roll = 0.92 + 0.08 * sin(vUv.y * 40.0 - uTime * 6.0);         // 慢慢往下滚的亮暗带
  vec3 led = pix * dot_ * 1.55 * roll;
  float k = uLed * mix(0.3, 1.0, smoothstep(0.17, 0.2, vUv.y));       // 下沿歌词条那一带灯珠更密（少做像素化），小字也读得清
  vec3 col = mix(clean, led, k);
  gl_FragColor = vec4(col * uBright, 1.0);
}`;

/** clips / schedule（#1055）：大屏不必全程同一张正面特写。
 *    schedule: [{ t0, t1, clip, mode?, rate?, fit?, zoom?, x?, y?, flip? }]   t0 ≤ T < t1 时放这条片段，其余时间放逐词对口型的特写；
 *      mode: 'loop' | 'once'（放完停在最后一帧）| 'pingpong'，默认用 clips.json 里登记的；
 *      rate: 播放倍速；不写时 fit !== false 就自动把片段调到正好填满时段（限 0.8–1.35 倍，loop 类取整数圈）
 *    clips: 额外要预载的片段名（update 里临时指定 clip 时用），或 'all'
 *  取帧是 T 的纯函数（按 T 算帧号换图，不播放视频）。 */
export async function createLedScreen(mv, { width = 6.4, cells = 168, seed = 9, frame = true, clips = null, schedule = null, clipsBase = undefined } = {}) {
  const rig = await loadRig(LAYERS_URL.href);
  const need = clips === 'all' ? 'all' : [...(clips || []), ...(schedule || []).map(e => e.clip)];
  const lib = need.length ? await loadScreenClips(need, clipsBase) : {};
  await new FontFace('LEDAnton', `url(${FONT_URL.href})`).load().then(f => document.fonts.add(f)).catch(() => {});
  const W = 1600, H = 900, height = width * H / W;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  const mat = new THREE.ShaderMaterial({ vertexShader: LED_VERT, fragmentShader: LED_FRAG, toneMapped: false,
    uniforms: { uTex: { value: tex }, uCells: { value: new THREE.Vector2(cells, Math.round(cells * H / W)) }, uLed: { value: 1 }, uTime: { value: 0 }, uBright: { value: 1 } } });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  const mesh = new THREE.Group(); mesh.name = 'led-screen'; mesh.add(panel);
  if (frame) {            // 屏框：一圈霓虹灯管 + 背后的深色板
    const back = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.3, height + 0.3), new THREE.MeshBasicMaterial({ color: '#0b0a14' })); back.position.z = -0.02; mesh.add(back);
    const tube = new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.pink).multiplyScalar(2.4), toneMapped: false });
    for (const [w, h, x, y] of [[width + 0.22, 0.05, 0, height / 2 + 0.09], [width + 0.22, 0.05, 0, -height / 2 - 0.09], [0.05, height + 0.22, -width / 2 - 0.09, 0], [0.05, height + 0.22, width / 2 + 0.09, 0]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), tube); b.position.set(x, y, 0.01); mesh.add(b);
    }
  }

  const timingsOf = lines => ({ segments: lines.map(l => ({ text: l.text, start: l.start, end: l.end, sentences: l.words.map(w => ({ text: w.w, start: w.start, end: w.end })) })) });
  const lipsAll = lipsync(timingsOf(mv.lyrics.lines));
  const blink = blinks({ seed, from: 0, to: mv.music.duration + 5, min: 2.4, max: 4.8 });
  const drift = wobble(seed + 3, 1.5);
  const EXPR = { neutral: { eyes: 'open', mouth: 'rest' }, smile: { eyes: 'smile', mouth: 'smile' }, surprised: { eyes: 'surprised', mouth: 'surprised' }, wink: { eyes: 'wink', mouth: 'smile' }, closed: { eyes: 'closed', mouth: 'rest' } };
  const beats = T => { const b = mv.music.beatAt(T); return b.i + Math.min(1, Math.max(0, b.phase)); };

  /** zoom：人像放大倍数（1 = 头顶到胸口占满屏高）；ticker：下沿歌词条（当前这一句，唱到的词亮） */
  // 片段在 T 时刻该画第几帧
  function clipFrame(e, T) {
    const c = lib[e.clip]; if (!c) throw new Error(`createLedScreen: 片段 ${e.clip} 没预载（写进 clips 或 schedule）`);
    const mode = e.mode ?? c.mode ?? 'loop', n = c.frames.length, slot = (e.t1 ?? Infinity) - e.t0;
    let rate = e.rate;
    if (rate == null) {
      rate = 1;
      if (e.fit !== false && isFinite(slot)) {
        const laps = mode === 'once' ? 1 : Math.max(1, Math.round(slot / c.dur));      // loop：整数圈；pingpong：去 / 回各算一程
        rate = Math.min(1.35, Math.max(0.8, c.dur * laps / slot));
      }
    }
    const k = Math.max(0, (T - e.t0) * c.fps * rate);
    let i = Math.floor(k);
    if (mode === 'once') i = Math.min(n - 1, i);
    else if (mode === 'pingpong') { const m = i % (2 * n - 2 || 1); i = m < n ? m : 2 * n - 2 - m; }
    else i = i % n;
    return { c, img: c.frames[i], i };
  }
  let sched = schedule;
  function update(T, { expression = 'neutral', led = 1, ticker = true, zoom = 1, bright = 1, clip = undefined, schedule: s2 = undefined } = {}) {
    if (s2 !== undefined) sched = s2;
    // clip：这一帧直接指定（{ clip, t0, … } 或 null = 强制放特写）；不传就查 schedule
    const cur = clip !== undefined ? (typeof clip === 'string' ? { clip, t0: 0 } : clip) : (sched || []).find(e => T >= e.t0 && T < (e.t1 ?? Infinity)) ?? null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 屏上的背景：深紫到粉的舞台光，按拍子呼吸
    const kick = mv.music.pulse ? mv.music.pulse('kick', T, { decay: 0.2 }) : 0;
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#2a1244'); g.addColorStop(0.55, '#7a1d63'); g.addColorStop(1, '#19183f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = `rgba(255,46,136,${0.10 + 0.18 * kick})`; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 5; i++) {                       // 几道斜的光柱
      const x = ((i * 0.23 + T * 0.03) % 1.2 - 0.1) * W;
      ctx.fillStyle = `rgba(95,227,192,${0.07 + 0.05 * ((i * 7) % 3)})`;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 90, 0); ctx.lineTo(x - 260, H); ctx.lineTo(x - 420, H); ctx.fill();
    }
    // 慢慢飘的光斑（#1055）：背景不是一块纯色，片段换底后边缘残留的小白点落在光斑里不显眼
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) {
      const h1 = (Math.sin(i * 127.1 + seed) * 43758.5453) % 1, h2 = (Math.sin(i * 311.7 + seed) * 43758.5453) % 1, a1 = Math.abs(h1), a2 = Math.abs(h2);
      const x = (((a1 + T * (0.012 + 0.02 * a2) * (i % 2 ? 1 : -1)) % 1.2) + 1.2) % 1.2 * W - 0.1 * W, y = (0.12 + 0.76 * a2 + 0.05 * Math.sin(T * 0.4 + i)) * H, r = (60 + 150 * a1) * (1 + 0.08 * Math.sin(T * 0.9 + i * 2));
      const c = ['255,225,77', '95,227,192', '255,120,190'][i % 3], g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
      g2.addColorStop(0, `rgba(${c},${0.10 + 0.06 * a2})`); g2.addColorStop(0.6, `rgba(${c},0.05)`); g2.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g2; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    ctx.restore();
    // 人像：rig 画布 832×1248，取头顶到胸口（y 110–880）铺满屏高
    const sc = H / 770 * zoom;
    const pose = t => { const u = beats(t), ph = u - Math.floor(u); return { roll: 2.5 * Math.sin(Math.PI * u / 2), nod: 3 * Math.exp(-ph / 0.18) * (mv.music.beatAt(t).isDown ? 1 : 0.5), dx: drift(t) }; };
    if (cur) {
      // 片段：按屏高铺满（cover），fit / 调用方可以再缩放、平移、左右翻转；整幅不透明的片段（眼睛特写）直接盖住背景
      const { c, img } = clipFrame(cur, T), f = c.fit ?? {};
      const k = Math.max(W / img.naturalWidth, H / img.naturalHeight) * (f.scale ?? 1) * (cur.zoom ?? 1) * zoom;
      const w = img.naturalWidth * k, h = img.naturalHeight * k, flip = cur.flip ? -1 : 1;
      ctx.save(); ctx.translate(W / 2 + ((f.x ?? 0) + (cur.x ?? 0)) * W, H / 2 + ((f.y ?? 0) + (cur.y ?? 0)) * H); ctx.scale(flip, 1);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
    } else
    rig.draw(ctx, T, { x: W * 0.5 - 416 * sc, y: H * 0.5 - 495 * sc, scale: sc, pose, face: () => EXPR[expression] || EXPR.neutral, lips: lipsAll, blink });
    // 下沿歌词条
    if (ticker) {
      const line = mv.lyrics.lines.find(l => T >= l.start - 0.15 && T < l.end + 0.25);
      if (line) {
        const px = 92; ctx.font = `${px}px LEDAnton, Impact, sans-serif`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        const words = line.words.map(w => w.w.toUpperCase()), sp = ctx.measureText(' ').width;
        const ws = words.map(w => ctx.measureText(w).width), total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
        const k = Math.min(1, (W - 120) / total);
        ctx.save(); ctx.translate(W / 2, H - 78); ctx.scale(k, k);
        ctx.fillStyle = 'rgba(10,10,16,0.82)'; ctx.fillRect(-total / 2 - 40, -px * 0.72, total + 80, px * 1.44);
        let x = -total / 2;
        line.words.forEach((w, i) => { if (T >= w.start) { ctx.fillStyle = T < w.end + 0.08 ? PALETTE.lemon : '#ffffff'; ctx.fillText(words[i], x, 6); } x += ws[i] + sp; });
        ctx.restore();
      }
    }
    tex.needsUpdate = true;
    mat.uniforms.uLed.value = led; mat.uniforms.uTime.value = T; mat.uniforms.uBright.value = bright;
  }
  return { mesh, panel, width, height, canvas: cv, texture: tex, update, clips: lib, clipAt: T => (sched || []).find(e => T >= e.t0 && T < (e.t1 ?? Infinity))?.clip ?? null };
}
