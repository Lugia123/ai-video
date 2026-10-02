// 舞台 + 后处理（自写，不依赖 three/examples 的 EffectComposer）。
//
//   const stage = createStage({ width: 1920, height: 1080 });
//   stage.render(scene, camera, post)          直接画到画布
//   stage.renderTo(slot, scene, camera, post)  画到 slot（0 / 1）的离屏图，给转场合成用；返回该 slot 的纹理
//   stage.composite({ ... })                   两个 slot → 画布（shots.js 用）
//
// post（都可省略；数字写法 = 只给强度）：
//   bloom:  0..3 | { strength, threshold=0.8, radius=0.8 }    阈值按线性 HDR 亮度（>1 = 自发光 / toneMapped:false 的高亮）
//   chroma: 0..1       径向色差（1 ≈ 边缘 12px）
//   glitch: 0..1       横条错位 + 色块 + RGB 分离；图案由 t 决定（每 2 帧换一次），glitchSeed 可再换一套
//   grade:  { exposure=1, warmth=0, saturation=1, contrast=1, vignette=0.15, lift=0, tint:'#hex', tintAmount=0 }
//   flash:  0..1 | { amount, color='#fff' }    整屏闪（最后叠加）
//   dither: 0..4       输出前加的三角噪点（单位：8 bit 色阶；默认 0 = 不加，输出和以前逐像素一致）。暗部的大片渐变（舞台的粉色光晕）在 8 bit 下会出色带，给 1–2 就散掉；图案由像素坐标 + 帧号决定
//   background: '#hex' | null                  清屏色（场景没有 scene.background 时用；默认墨黑）
//
// 管线：场景 → HDR 离屏（HalfFloat, 4×MSAA）→ bloom（亮部提取 + 6 级下采样 / 上采样）→ 合成
//        （曝光 → Khronos PBR Neutral 色调映射（保色相，霓粉不会发白）→ 调色 → 暗角 → sRGB → 故障 / 色差 → 闪）。
// 全部确定性：没有时间累积、没有随机（故障图案用 hash(t)）。

import * as THREE from 'three';
import { ink } from './palette.js';

const VERT = /* glsl */`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const COMMON = /* glsl */`
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`;

// 亮部提取（软膝）
const BRIGHT = /* glsl */`
uniform sampler2D tSrc; uniform float threshold; uniform float knee; varying vec2 vUv;
void main() {
  vec3 c = texture2D(tSrc, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - threshold + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee + 1e-4);
  float w = max(soft, br - threshold) / max(br, 1e-4);
  gl_FragColor = vec4(min(c * w, vec3(40.0)), 1.0);
}`;

// 13 tap 下采样（Jimenez 2014）
const DOWN = /* glsl */`
uniform sampler2D tSrc; uniform vec2 texel; varying vec2 vUv;
void main() {
  vec2 o = texel;
  vec3 a = texture2D(tSrc, vUv + o * vec2(-2.0, 2.0)).rgb, b = texture2D(tSrc, vUv + o * vec2(0.0, 2.0)).rgb, c = texture2D(tSrc, vUv + o * vec2(2.0, 2.0)).rgb;
  vec3 d = texture2D(tSrc, vUv + o * vec2(-2.0, 0.0)).rgb, e = texture2D(tSrc, vUv).rgb, f = texture2D(tSrc, vUv + o * vec2(2.0, 0.0)).rgb;
  vec3 g = texture2D(tSrc, vUv + o * vec2(-2.0, -2.0)).rgb, h = texture2D(tSrc, vUv + o * vec2(0.0, -2.0)).rgb, i = texture2D(tSrc, vUv + o * vec2(2.0, -2.0)).rgb;
  vec3 j = texture2D(tSrc, vUv + o * vec2(-1.0, 1.0)).rgb, k = texture2D(tSrc, vUv + o * vec2(1.0, 1.0)).rgb;
  vec3 l = texture2D(tSrc, vUv + o * vec2(-1.0, -1.0)).rgb, m = texture2D(tSrc, vUv + o * vec2(1.0, -1.0)).rgb;
  vec3 col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(col, 1.0);
}`;

// 3×3 tent 上采样 + 叠加本级
const UP = /* glsl */`
uniform sampler2D tSrc; uniform sampler2D tBase; uniform vec2 texel; uniform float radius; varying vec2 vUv;
void main() {
  vec2 o = texel * radius;
  vec3 s = texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, o.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(o.x, o.y)).rgb
         + texture2D(tSrc, vUv + vec2(-o.x, 0.0)).rgb * 2.0 + texture2D(tSrc, vUv).rgb * 4.0 + texture2D(tSrc, vUv + vec2(o.x, 0.0)).rgb * 2.0
         + texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, -o.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb;
  gl_FragColor = vec4(texture2D(tBase, vUv).rgb + s / 16.0, 1.0);
}`;

// 合成：一个镜头的 HDR + bloom → 显示值（sRGB 编码，8 bit 离屏）
const POST = /* glsl */`
uniform sampler2D tScene; uniform sampler2D tBloom; uniform vec2 res;
uniform float bloom, chroma, glitch, glitchSeed, exposure, warmth, saturation, contrast, vignette, lift, tintAmount, flash, dither, ditherSeed;
uniform vec3 tint, flashColor;
varying vec2 vUv;
${COMMON}
vec3 neutral(vec3 color) {   // Khronos PBR Neutral
  const float startCompression = 0.8 - 0.04; const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < startCompression) return color;
  const float d = 1.0 - startCompression;
  float newPeak = 1.0 - d * d / (peak + d - startCompression);
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}
vec3 toSRGB(vec3 c) { c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
vec3 shade(vec2 uv) {
  vec3 c = texture2D(tScene, uv).rgb + texture2D(tBloom, uv).rgb * bloom;
  c *= exposure;
  c = neutral(c);
  c.r *= 1.0 + 0.10 * warmth; c.b *= 1.0 - 0.10 * warmth; c.g *= 1.0 + 0.02 * warmth;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, saturation);
  c = mix(c, c * tint * 1.6, tintAmount);
  vec3 s = toSRGB(c);
  s = (s - 0.5) * contrast + 0.5;
  s = s + lift * (1.0 - s);
  vec2 q = uv - 0.5; q.x *= res.x / res.y;
  s *= 1.0 - vignette * smoothstep(0.35, 1.05, length(q));
  return clamp(s, 0.0, 1.0);
}
void main() {
  vec2 uv = vUv;
  float gshift = 0.0; vec3 gcol = vec3(0.0); float gmix = 0.0;
  if (glitch > 0.0) {
    float rows = 18.0 + floor(hash11(glitchSeed * 7.1) * 40.0);
    float band = floor(uv.y * rows);
    float h = hash21(vec2(band, glitchSeed));
    if (h < glitch * 0.55) gshift = (hash21(vec2(band * 1.7, glitchSeed + 3.0)) - 0.5) * 0.16 * glitch;
    uv.x = fract(uv.x + gshift);
    vec2 blk = floor(vUv * vec2(24.0, 14.0));
    float hb = hash21(blk + glitchSeed * 13.0);
    if (hb < (glitch - 0.45) * 0.12) { gmix = 0.85; gcol = hash11(hb * 91.0) < 0.5 ? vec3(1.0, 0.18, 0.53) : vec3(0.37, 0.89, 0.75); }
  }
  float ca = chroma * 0.0065 + abs(gshift) * 0.35 + glitch * 0.004;
  vec3 col;
  if (ca > 0.0) {
    vec2 dir = (uv - 0.5) * ca * 2.0 + vec2(ca * 0.6 * step(0.0001, glitch), 0.0);
    col = vec3(shade(uv + dir).r, shade(uv).g, shade(uv - dir).b);
  } else col = shade(uv);
  col = mix(col, gcol, gmix);
  col = mix(col, flashColor, clamp(flash, 0.0, 1.0));
  if (dither > 0.0) { vec2 pq = gl_FragCoord.xy + ditherSeed * vec2(37.0, 17.0); col += (hash21(pq) + hash21(pq + 71.3) - 1.0) * dither / 255.0; }
  gl_FragColor = vec4(col, 1.0);
}`;

// 转场合成：两个显示值 slot → 画布
const COMP = /* glsl */`
uniform sampler2D tA; uniform sampler2D tB; uniform vec2 res;
uniform int kind;          // 0 只 A，1 粒子溶解 A→B，2 甩镜（只 A，位移 + 方向模糊），3 色块擦除（A + 色块）
uniform float p;           // 转场进度 0..1
uniform float shift;       // 甩镜位移（屏宽为 1）
uniform float blur;        // 甩镜模糊长度（屏宽为 1）
uniform float wipeA, wipeB; uniform vec3 wipeColor; uniform float slant;
uniform float flash; uniform vec3 flashColor; uniform float seed;
varying vec2 vUv;
${COMMON}
vec3 A(vec2 uv) { return texture2D(tA, uv).rgb; }
vec3 B(vec2 uv) { return texture2D(tB, uv).rgb; }
vec2 mirrorUv(vec2 uv) { return 1.0 - abs(1.0 - mod(uv, 2.0)); }
void main() {
  vec2 uv = vUv; vec3 col;
  if (kind == 1) {
    // 屏幕切成方块「像素粒子」：每块有自己的阈值；越过阈值前后一小段，块从 A 脱落、向上飘散缩小，露出 B
    float cell = 18.0;
    vec2 px = uv * res;
    vec3 base = B(uv);
    col = base;
    // 当前像素可能被附近脱落中的 A 块覆盖：只查自身块及下方两格（块只往上飘）
    for (int dy = 0; dy <= 3; dy++) {
      vec2 cid = floor(px / cell) - vec2(0.0, float(dy));
      float r = hash21(cid + seed);
      float thr = r * 0.75 + (1.0 - uv.y) * 0.0 + 0.0;
      float k = clamp((p - thr) / 0.25, 0.0, 1.0);     // 0 = 还在原位，1 = 已飞散消失
      if (k <= 0.0) { if (dy == 0) col = A(uv); continue; }
      if (k >= 1.0) continue;
      vec2 c0 = (cid + 0.5) * cell;
      float dx = (hash21(cid * 1.3 + seed) - 0.5) * 60.0;
      vec2 c = c0 + vec2(dx * k, k * k * cell * 3.2);
      float s = cell * 0.5 * (1.0 - k);
      if (abs(px.x - c.x) < s && abs(px.y - c.y) < s) {
        col = mix(A(c0 / res), vec3(1.0, 0.18, 0.53), k * 0.6) * (1.0 + k * 0.8);
      }
    }
  } else if (kind == 2) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 24; i++) {
      float f = (float(i) / 23.0 - 0.5) * blur;
      acc += A(mirrorUv(vec2(uv.x + shift + f, uv.y)));
    }
    col = acc / 24.0;
  } else if (kind == 3) {
    float x = uv.x + (uv.y - 0.5) * slant;
    col = (x >= wipeB && x < wipeA) ? wipeColor : A(uv);   // [wipeB, wipeA) 是色块，其余是 A
  } else {
    col = A(uv);
  }
  col = mix(col, flashColor, clamp(flash, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

function hexColor(h, fallback = '#ffffff') { return new THREE.Color(h ?? fallback); }

export function createStage({ width = 1920, height = 1080, canvas = null, samples = 4 } = {}) {
  canvas ||= document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.autoClear = true;

  const rt = (w, h, opts = {}) => new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, ...opts,
  });
  const sceneRT = rt(width, height, { depthBuffer: true, samples });
  const slots = [0, 1].map(() => rt(width, height, { type: THREE.UnsignedByteType }));
  const LEVELS = 6;
  const down = [], up = [];
  for (let i = 0; i < LEVELS; i++) {
    const w = Math.max(1, width >> (i + 1)), h = Math.max(1, height >> (i + 1));
    down.push(rt(w, h)); up.push(rt(w, h));
  }

  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const quad = new THREE.Mesh(tri);
  quad.frustumCulled = false;
  const mat = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  const M = {
    bright: mat(BRIGHT, { tSrc: { value: null }, threshold: { value: 0.8 }, knee: { value: 0.3 } }),
    down: mat(DOWN, { tSrc: { value: null }, texel: { value: new THREE.Vector2() } }),
    up: mat(UP, { tSrc: { value: null }, tBase: { value: null }, texel: { value: new THREE.Vector2() }, radius: { value: 1 } }),
    post: mat(POST, {
      tScene: { value: sceneRT.texture }, tBloom: { value: up[0].texture }, res: { value: new THREE.Vector2(width, height) },
      bloom: { value: 0 }, chroma: { value: 0 }, glitch: { value: 0 }, glitchSeed: { value: 0 },
      exposure: { value: 1 }, warmth: { value: 0 }, saturation: { value: 1 }, contrast: { value: 1 }, vignette: { value: 0.15 }, lift: { value: 0 },
      tint: { value: new THREE.Color(1, 1, 1) }, tintAmount: { value: 0 }, flash: { value: 0 }, flashColor: { value: new THREE.Color(1, 1, 1) },
      dither: { value: 0 }, ditherSeed: { value: 0 },
    }),
    comp: mat(COMP, {
      tA: { value: slots[0].texture }, tB: { value: slots[1].texture }, res: { value: new THREE.Vector2(width, height) },
      kind: { value: 0 }, p: { value: 0 }, shift: { value: 0 }, blur: { value: 0 },
      wipeA: { value: 0 }, wipeB: { value: 0 }, wipeColor: { value: new THREE.Color() }, slant: { value: 0.12 },
      flash: { value: 0 }, flashColor: { value: new THREE.Color(1, 1, 1) }, seed: { value: 0 },
    }),
  };
  const pass = (material, target) => { quad.material = material; renderer.setRenderTarget(target); renderer.render(quad, quadCam); };
  const clearColor = new THREE.Color();

  let time = 0;   // 当前帧的歌曲时间（故障图案用），由 shots.js / mount 设
  const fps = 30;

  function renderTo(slot, scene, camera, post = {}) {
    // 1) 场景 → HDR
    const bg = post.background === undefined ? ink : post.background;
    renderer.setClearColor(clearColor.set(bg ?? ink), 1);
    renderer.setRenderTarget(sceneRT);
    renderer.clear();
    renderer.render(scene, camera);

    // 2) bloom
    const b = typeof post.bloom === 'number' ? { strength: post.bloom } : (post.bloom || {});
    const strength = b.strength ?? 0;
    if (strength > 0) {
      M.bright.uniforms.tSrc.value = sceneRT.texture;
      M.bright.uniforms.threshold.value = b.threshold ?? 0.8;
      M.bright.uniforms.knee.value = Math.max(0.05, (b.threshold ?? 0.8) * 0.4);
      pass(M.bright, down[0]);
      for (let i = 1; i < LEVELS; i++) {
        M.down.uniforms.tSrc.value = down[i - 1].texture;
        M.down.uniforms.texel.value.set(1 / down[i - 1].width, 1 / down[i - 1].height);
        pass(M.down, down[i]);
      }
      const radius = b.radius ?? 0.8;
      for (let i = LEVELS - 2; i >= 0; i--) {
        const src = i === LEVELS - 2 ? down[LEVELS - 1] : up[i + 1];
        M.up.uniforms.tSrc.value = src.texture;
        M.up.uniforms.tBase.value = down[i].texture;
        M.up.uniforms.texel.value.set(1 / src.width, 1 / src.height);
        M.up.uniforms.radius.value = radius * 1.5;
        pass(M.up, up[i]);
      }
    }

    // 3) 合成
    const U = M.post.uniforms, g = post.grade || {};
    U.bloom.value = strength;
    U.chroma.value = post.chroma || 0;
    U.glitch.value = post.glitch || 0;
    U.glitchSeed.value = Math.floor(time * fps / 2) + (post.glitchSeed || 0) * 131;
    U.exposure.value = g.exposure ?? 1; U.warmth.value = g.warmth ?? 0; U.saturation.value = g.saturation ?? 1;
    U.contrast.value = g.contrast ?? 1; U.vignette.value = g.vignette ?? 0.15; U.lift.value = g.lift ?? 0;
    U.tint.value.set(g.tint ?? '#ffffff'); U.tintAmount.value = g.tintAmount ?? 0;
    const fl = typeof post.flash === 'number' ? { amount: post.flash } : (post.flash || {});
    U.flash.value = fl.amount || 0; U.flashColor.value.set(fl.color ?? '#ffffff').convertLinearToSRGB();   // 闪白在显示空间里混：色值要是 sRGB
    U.dither.value = post.dither || 0; U.ditherSeed.value = Math.floor(time * fps) % 997;
    pass(M.post, slots[slot]);
    return slots[slot].texture;
  }

  /** o = { kind:'none'|'dissolve'|'whip'|'wipe', p, shift, blur, wipeA, wipeB, wipeColor, slant, flash, flashColor, seed } */
  function composite(o = {}) {
    const U = M.comp.uniforms;
    U.kind.value = { none: 0, dissolve: 1, whip: 2, wipe: 3 }[o.kind || 'none'];
    U.p.value = o.p ?? 0; U.shift.value = o.shift ?? 0; U.blur.value = o.blur ?? 0;
    // 合成在显示空间（slot 里已是 sRGB 编码值）：THREE.Color.set('#hex') 会转成线性，要转回 sRGB，色块才和调色板一致
    U.wipeA.value = o.wipeA ?? 0; U.wipeB.value = o.wipeB ?? 0; U.wipeColor.value.set(o.wipeColor ?? '#FF2E88').convertLinearToSRGB(); U.slant.value = o.slant ?? 0.12;
    U.flash.value = o.flash ?? 0; U.flashColor.value.set(o.flashColor ?? '#ffffff').convertLinearToSRGB(); U.seed.value = o.seed ?? 0;
    pass(M.comp, null);
  }

  function render(scene, camera, post = {}) {
    renderTo(0, scene, camera, post);
    composite({ kind: 'none' });
  }

  return {
    renderer, canvas, width, height,
    render, renderTo, composite,
    get time() { return time; }, set time(v) { time = v; },
    hexColor,
  };
}
