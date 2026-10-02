// kits/hologram.js —— 她的 2D 近景（layer-rig）画到 CanvasTexture，做成立在 3D 里的全息屏。
//
//   import { createHolo } from '../kits/hologram.js';
//   const holo = await createHolo(mv, { height: 1.6 });   // 屏高 1.6 世界单位（宽 = 高 × 0.72）；mesh 底边中点在原点
//   scene.add(holo.mesh);
//   每帧：holo.update(T, { line, expression, glitch, opacity, vocal })
//     line        只唱这一行（行号或 mv.lyrics.lines[i]）；省略 = 所有歌词都开口
//     expression  不唱时的表情：'neutral' | 'smile' | 'surprised' | 'wink' | 'closed'（默认 neutral）
//     glitch      额外故障 0..1（本身会按种子偶尔抽一下）；opacity 0..1（出场 / 退场）；vocal 覆盖人声亮度（默认读 energy('vocal')）
//     look        { roll, nod, dx } 叠加在自带的摆头上（度 / px，安全范围见 layer-rig：|roll| ≤ 4）
//   update 返回 { mouth, eyes, word }：本帧口型、眼睛、正在唱的词（自检用）。
//
// 口型：歌词逐词时间 → layer-rig.lipsync（英文按元音组拆音节 → a/e/i/o/u，词与词之间闭嘴）。只有 t ≥ word.start 才张嘴。
// 眨眼：带种子，2.4–4.8 s 一次。摆头：跟拍子轻轻左右（≤ 3°），重拍微点头；头发滞后由 layer-rig 负责。
// 画面：人物保留原色但偏向薄荷全息色 + 半调点 + 扫描线 + 屏幕边的菲涅尔边光 + 背景玻璃的细网格；人声越响越亮。
// 全部是 T 的纯函数（CanvasTexture 每帧整张重画，没有帧间状态）。

import * as THREE from 'three';
import { loadRig, lipsync, blinks, wobble } from '../../../assets/lib/layer-rig.js';
import { PALETTE } from '../engine/palette.js';

export const LAYERS_URL = new URL('../../cast-cyber-girl/closeup/layers/', import.meta.url);

// 裁切：rig 画布 832×1248，屏上只要头 + 肩（到胸口）
const CROP = { x: 0, y: 40, w: 832, h: 1150 };
const TEX_SCALE = 0.75;

const VERT = /* glsl */`
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz; vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */`
uniform sampler2D uTex; uniform float uTime; uniform float uOpacity; uniform float uGlitch; uniform float uGlitchSeed; uniform float uBright;
uniform vec3 uMint; uniform vec3 uPink; uniform vec2 uTexSize; uniform float uAspect;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec4 tex(vec2 uv) { return (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) ? vec4(0.0) : texture2D(uTex, uv); }
void main() {
  vec2 uv = vUv;
  // 故障：横条错位
  float shift = 0.0;
  if (uGlitch > 0.0) {
    float band = floor(uv.y * 26.0);
    float h = h21(vec2(band, uGlitchSeed));
    if (h < uGlitch * 0.5) shift = (h21(vec2(band * 1.9, uGlitchSeed + 5.0)) - 0.5) * 0.12 * uGlitch;
  }
  vec2 u2 = vec2(uv.x + shift, uv.y);
  float ca = 0.003 + abs(shift) * 0.4;
  vec4 c = tex(u2);
  float r = tex(u2 + vec2(ca, 0.0)).r, b = tex(u2 - vec2(ca, 0.0)).b;
  vec3 col = vec3(r, c.g, b);
  float a = c.a;
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  // 全息着色：原色 60% + 薄荷单色 40%
  vec3 holo = mix(col, uMint * (0.35 + 1.1 * lum), 0.4);
  // 半调点（按亮度决定点大小），只轻轻压暗点与点之间
  vec2 cell = uv * vec2(uAspect, 1.0) * 150.0;
  vec2 gv = fract(cell) - 0.5;
  float rad = 0.25 + 0.5 * lum;
  float dotm = 1.0 - smoothstep(rad - 0.08, rad + 0.08, length(gv));
  holo *= mix(0.72, 1.08, dotm);
  // 扫描线（细）+ 一条慢慢往下扫的亮带
  float scan = 0.82 + 0.18 * step(0.5, fract(uv.y * uTexSize.y * 0.5 + uTime * 3.0));
  float sweep = exp(-pow((fract(uv.y + uTime * 0.18) - 0.5) * 14.0, 2.0));
  holo = holo * scan * uBright + uMint * sweep * 0.25 * a;
  // 背景玻璃：极淡的蓝黑 + 细网格
  vec2 g = fract(uv * vec2(uAspect, 1.0) * 24.0);
  float grid = (step(g.x, 0.02) + step(g.y, 0.02)) * 0.5;
  vec3 glass = vec3(0.02, 0.05, 0.07) + uMint * grid * 0.07;
  float glassA = 0.35 + grid * 0.15;
  // 屏幕边：边框线 + 菲涅尔（侧面看更亮）
  vec2 e = min(uv, 1.0 - uv) * vec2(uAspect, 1.0);
  float edge = min(e.x, e.y);
  float frame = 1.0 - smoothstep(0.0, 0.006, edge);
  float halo = exp(-edge * 28.0) * 0.6;
  float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.5);
  vec3 rim = mix(uMint, uPink, 0.35 + 0.35 * sin(uv.y * 3.0 + uTime)) * (frame * 2.4 + halo * (0.5 + fres));
  vec3 outc = mix(glass, holo, a) + rim;
  float outa = max(max(a, glassA), frame);
  // 偶尔整屏闪一下（亮度抖）
  outc *= 1.0 - 0.25 * step(0.93, h21(vec2(floor(uTime * 15.0), 3.0)));
  gl_FragColor = vec4(outc * uOpacity, outa * uOpacity);
}`;

function hash1(n) { let h = Math.imul(n | 0, 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }

export async function createHolo(mv, { height = 1.6, seed = 7, base = true } = {}) {
  const rig = await loadRig(LAYERS_URL.href);
  const W = Math.round(CROP.w * TEX_SCALE), H = Math.round(CROP.h * TEX_SCALE);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;

  const aspect = W / H, width = height * aspect;
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uTex: { value: tex }, uTime: { value: 0 }, uOpacity: { value: 1 }, uGlitch: { value: 0 }, uGlitchSeed: { value: 0 }, uBright: { value: 1 },
      uMint: { value: new THREE.Color(PALETTE.mint) }, uPink: { value: new THREE.Color(PALETTE.pink) }, uTexSize: { value: new THREE.Vector2(W, H) }, uAspect: { value: aspect },
    },
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  screen.position.y = height / 2 + (base ? 0.08 : 0);
  screen.name = 'holo-screen';
  const mesh = new THREE.Group(); mesh.name = 'hologram';
  mesh.add(screen);

  // 投影底座：一圈发光环 + 向上的淡光锥（加法混合）
  let ring = null, cone = null;
  if (base) {
    ring = new THREE.Mesh(new THREE.TorusGeometry(width * 0.32, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.mint).multiplyScalar(3), toneMapped: false }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.02;
    const coneMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { c: { value: new THREE.Color(PALETTE.mint) }, k: { value: 0.25 } },
      // h = 光锥内的高度 0（底座）..1（顶）：底座最亮往上淡出，顶边完全透明（不然加法混合下顶圈会亮成一道白环）
      vertexShader: 'varying vec2 v; varying float h; void main(){ v = uv; h = position.y / 0.5 + 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; uniform float k; varying vec2 v; varying float h; void main(){ float a = pow(1.0 - clamp(h, 0.0, 1.0), 2.2) * (0.4 + 0.6 * pow(abs(sin(v.x * 3.14159 * 18.0)), 8.0)); gl_FragColor = vec4(c * a * k, 1.0); }',
    });
    cone = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.62, width * 0.32, 0.5, 48, 1, true), coneMat);
    cone.position.y = 0.27;
    mesh.add(ring, cone);
  }

  // ---- 口型：每行一套（只唱指定行时用），外加「全部歌词」一套 ----
  const timingsOf = lines => ({ segments: lines.map(l => ({ text: l.text, start: l.start, end: l.end, sentences: l.words.map(w => ({ text: w.w, start: w.start, end: w.end })) })) });
  const lipsAll = lipsync(timingsOf(mv.lyrics.lines));
  const lipsLine = new Map();
  const lipsFor = line => {
    if (line == null) return lipsAll;
    const L = typeof line === 'number' ? mv.lyrics.lines[line] : line;
    if (!lipsLine.has(L.i)) lipsLine.set(L.i, lipsync(timingsOf([L])));
    return lipsLine.get(L.i);
  };
  const blink = blinks({ seed, from: 0, to: mv.music.duration + 5, min: 2.4, max: 4.8 });
  const drift = wobble(seed + 3, 1.5);
  const EXPR = { neutral: { eyes: 'open', mouth: 'rest' }, smile: { eyes: 'smile', mouth: 'smile' }, surprised: { eyes: 'surprised', mouth: 'surprised' }, wink: { eyes: 'wink', mouth: 'smile' }, closed: { eyes: 'closed', mouth: 'rest' } };
  const clock = T => { const b = mv.music.beatAt(T); return b.i + Math.min(1, Math.max(0, b.phase)); };

  function update(T, { line = null, expression = 'neutral', glitch = 0, opacity = 1, vocal = null, look = null } = {}) {
    const lips = lipsFor(line);
    const face = () => EXPR[expression] || EXPR.neutral;
    // 摆头：两拍一个来回（≤ 2.5°），重拍轻点头；look 叠加
    const pose = t => {
      const u = clock(t), ph = u - Math.floor(u);
      const extra = typeof look === 'function' ? look(t) : look || {};
      return {
        roll: 2.5 * Math.sin(Math.PI * u / 2) + (extra.roll || 0),
        nod: 3 * Math.exp(-ph / 0.18) * (mv.music.beatAt(t).isDown ? 1 : 0.5) + (extra.nod || 0),
        dx: drift(t) + (extra.dx || 0),
      };
    };
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const st = rig.draw(ctx, T, { x: -CROP.x * TEX_SCALE, y: -CROP.y * TEX_SCALE, scale: TEX_SCALE, pose, face, lips, blink });
    tex.needsUpdate = true;

    const U = mat.uniforms;
    U.uTime.value = T;
    U.uOpacity.value = opacity;
    const f = Math.floor(T * 10), h = hash1(f * 31 + seed);
    const auto = h < 0.06 ? 0.5 + h * 6 : 0;          // 偶尔的自动故障（约 6% 的 0.1 s 时段）
    U.uGlitch.value = Math.min(1, glitch + auto);
    U.uGlitchSeed.value = Math.floor(T * 30 / 2);
    const v = vocal ?? mv.music.energy('vocal', T);
    U.uBright.value = 0.85 + 0.35 * v;
    if (ring) ring.material.color.set(PALETTE.mint).multiplyScalar(1.2 + 1.2 * v);
    if (cone) cone.material.uniforms.k.value = (0.15 + 0.25 * v) * opacity;
    const word = mv.lyrics.wordsAt(T)[0] || null;
    return { mouth: st?.mouth ?? null, eyes: st?.eyes ?? null, word: word ? word.w : null };
  }

  return { mesh, screen, width, height, canvas: cv, texture: tex, update, lipsFor };
}
