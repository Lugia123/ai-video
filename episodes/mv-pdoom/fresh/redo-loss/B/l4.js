// fresh/redo-loss/B/l4.js —— 「There was a sudden drop in your training loss」（9.52–13.16）第二轮小样：这一段不出现她，只演「它」。#1019
//
//   const shot = await makeL4(mv, n);   // n = 1 城市同步成一只眼 · 2 误差山地裂开、光球坠进深谷 · 3 夜空里的网收拢成眼
//
// 三个都在跑酷段那个世界里（黑夜、粉月、亮窗楼块、粉 / 薄荷 / 柠黄霓虹），歌词是挂在镜头前的霓虹招牌（左下）。
// 都是 T 的纯函数；随机只用种子。出口：13.1 起画面被柠黄吞掉，13.16 接像素墙。

import * as THREE from 'three';
import { PALETTE as PAL } from '../../../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
const T0 = 9.52, T1 = 13.16, T_DROP = 10.66;

// ================================================================ 共用：星、粉月、挂在镜头前的歌词招牌
function sky(scene, { moon = true } = {}) {
  const rnd = mulberry32(77), n = 1100, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.04 + rnd() * 0.96), r = 900; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })));
  if (!moon) return null;
  const m = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
  m.position.set(-90, 150, -640); m.lookAt(0, 0, 0); scene.add(m); return m;
}
function lyricHud(mv, cam) {
  const words = mv.lyrics.lines[3].words.map(w => ({ text: w.w.replace(/[,.]/g, '').toUpperCase(), at: w.start }));
  const group = new THREE.Group(); group.position.z = -1; cam.add(group);
  const U = 2 / 1080;                                 // 组的缩放 = tan(fov/2) 时，1 px = U
  const mk = (w, hpx, color) => {
    const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
    c.width = Math.ceil(g0.measureText(w.text).width) + 110; c.height = 270; const g = c.getContext('2d');
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
    g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(w.text, c.width / 2, 143);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, fog: false }), wpx = hpx * c.width / c.height, m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * U, hpx * U), mat); m.renderOrder = 20; group.add(m);
    return { ...w, m, mat, wpx, hpx };
  };
  // 两屏，同一个位置（左下）：THERE WAS A SUDDEN / DROP → IN YOUR TRAINING / LOSS。大词单独一行、最大
  const row = (list, x0, y) => { let x = x0; for (const s of list) { s.m.position.set((x + s.wpx / 2 - 960) * U, (540 - y) * U, 0); x += s.wpx + 12; } };
  const A = words.slice(0, 4).map(w => mk(w, 124, PAL.pink)), drop = mk(words[4], 232, PAL.lemon), B = words.slice(5, 8).map(w => mk(w, 124, PAL.pink)), loss = mk(words[8], 232, PAL.lemon);
  row(A, 56, 760); row([drop], 56, 950); row(B, 56, 760); row([loss], 56, 950);
  const tSwap = words[5].at - 0.06;
  return T => {
    group.scale.setScalar(Math.tan(cam.fov * Math.PI / 360));
    for (const [list, on] of [[[...A, drop], T < tSwap], [[...B, loss], T >= tSwap]]) for (const s of list) {
      const a = T - s.at; s.m.visible = on && T >= T0 - 0.3 && T < T1;
      s.mat.color.setScalar(a >= 0 ? 1.1 + 0.7 * Math.exp(-a / 0.25) : 0.3); s.m.scale.setScalar(a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9);
    }
  };
}
// 亮窗楼块（实例化）：和跑酷段的楼一个样子（深色方块 + 一格格窗）；uChaos 时每扇窗各闪各的
const BLOCK_VERT = /* glsl */`
  attribute vec3 aBase; attribute vec3 aJit; attribute vec4 aInfo; uniform float uWave, uT; varying vec3 vL; varying vec3 vN; varying vec4 vInfo; varying float vSy, vH;
  void main(){
    float sy = smoothstep(0.0, 14.0, uWave - aInfo.w);                  // 光浪扫到这栋楼：0 → 1
    float h = mix(aInfo.x, aInfo.z > 0.5 ? 15.0 : 3.2, sy), w = aBase.z;
    float yaw = aJit.z * (1.0 - sy), c = cos(yaw), s = sin(yaw);
    vec3 p = vec3(position.x * w, position.y * h, position.z * w); p = vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
    p.xz += aBase.xy + aJit.xy * (1.0 - sy);
    vL = position; vN = normal; vInfo = aInfo; vSy = sy; vH = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
const BLOCK_FRAG = /* glsl */`
  uniform float uT, uBeat; uniform vec3 uPink, uMint, uLemon; varying vec3 vL; varying vec3 vN; varying vec4 vInfo; varying float vSy, vH;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec3 c = vec3(0.05, 0.05, 0.085) * (0.6 + 0.4 * abs(vN.x));
    float lit = vInfo.z, seed = vInfo.y;
    if (abs(vN.y) < 0.5) {
      vec2 g = vec2((abs(vN.x) > 0.5 ? vL.z : vL.x) * 5.0, vL.y * vH * 0.9), f = fract(g);
      float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.76);
      float h = hash(floor(g) + seed * 31.0);
      float fl = step(0.5, hash(floor(g) + seed * 31.0 + floor(uT * (5.0 + 9.0 * h))));      // 没学会：每扇窗按自己的频率乱闪
      vec3 wc = h < 0.5 ? vec3(1.0, 0.85, 0.6) : h < 0.7 ? uLemon : h < 0.86 ? uPink : uMint;
      vec3 chaos = wc * win * fl * 1.5;
      vec3 sync = (uLemon * 1.2 + vec3(0.5)) * win * lit * (1.0 + 0.5 * uBeat) + vec3(0.02, 0.02, 0.04) * win * (1.0 - lit);   // 学会了：环上的楼每扇窗都亮、一起呼吸；环外的楼全灭
      c += mix(chaos, sync, vSy);
      c += vec3(1.6) * win * smoothstep(0.0, 0.5, vSy) * smoothstep(1.0, 0.5, vSy);          // 光浪扫过的那一瞬全白
    } else c = mix(vec3(0.04, 0.04, 0.07), uLemon * 0.5, lit * vSy);
    gl_FragColor = vec4(c, 1.0);
  }`;
function blocks(items, uniforms) {
  const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), n = items.length;
  const base = new Float32Array(n * 3), jit = new Float32Array(n * 3), info = new Float32Array(n * 4);
  items.forEach((b, i) => { base.set([b.x, b.z, b.w], i * 3); jit.set([b.dx, b.dz, b.yaw], i * 3); info.set([b.h, b.seed, b.lit, b.r], i * 4); });
  geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3)); geo.setAttribute('aJit', new THREE.InstancedBufferAttribute(jit, 3)); geo.setAttribute('aInfo', new THREE.InstancedBufferAttribute(info, 4));
  const m = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({ uniforms, vertexShader: BLOCK_VERT, fragmentShader: BLOCK_FRAG }), n); m.frustumCulled = false;
  const I = new THREE.Matrix4(); for (let i = 0; i < n; i++) m.setMatrixAt(i, I);
  return m;
}
const blockU = () => ({ uWave: { value: -1 }, uT: { value: 0 }, uBeat: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) } });
const beat = (mv, T) => mv.music.pulse ? mv.music.pulse('kick', T, { decay: 0.16 }) : 0;
const exitFlash = T => ({ amount: smooth((T - (T1 - 0.07)) / 0.07), color: PAL.lemon });

// ================================================================ 1 城市同步成一只眼
function city(mv) {
  const scene = new THREE.Scene(); scene.background = col('#05050b'); scene.fog = new THREE.Fog('#05050b', 120, 520);
  sky(scene);
  const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.3, 3000); scene.add(cam); const hud = lyricHud(mv, cam);
  const BANDS = [[24, 38], [56, 72]], inBand = r => BANDS.some(([a, b]) => r >= a && r <= b);
  const lidZ = x => 96 * (1 - (x / 172) ** 2), onLid = (x, z) => Math.abs(x) < 172 && Math.abs(Math.abs(z) - lidZ(x)) < 6;   // 上下眼睑：两道抛物线
  const rnd = mulberry32(9), items = [], SP = 7;
  for (let i = -24; i <= 24; i++) for (let j = -24; j <= 24; j++) {
    if (i === 0 || j === 0) continue;                                      // 十字大道（镜头沿它飞进来）
    const x = i * SP, z = j * SP, r = Math.hypot(x, z); if (r < 16 || r > 190) continue; if (rnd() < 0.08) continue;
    items.push({ x, z, w: 3.6 + rnd() * 1.6, h: 3 + rnd() ** 2 * 15, dx: (rnd() - 0.5) * 3.2, dz: (rnd() - 0.5) * 3.2, yaw: (rnd() - 0.5) * 1.1, seed: rnd(), lit: inBand(r) || onLid(x, z) ? 1 : 0, r });
  }
  const U = blockU(); scene.add(blocks(items, U));
  const gU = { uWave: U.uWave, uT: U.uT, uBeat: U.uBeat, uPink: U.uPink, uMint: U.uMint, uLemon: U.uLemon };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: gU,
    vertexShader: `varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uWave, uT, uBeat; uniform vec3 uPink, uMint, uLemon; varying vec3 vW;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float line(float v, float w){ return 1.0 - smoothstep(0.0, w, abs(v)); }
      void main(){
        float r = length(vW.xz), sy = smoothstep(0.0, 14.0, uWave - r);
        vec3 c = vec3(0.035, 0.036, 0.062);
        vec2 gq = vW.xz / 7.0, gf = abs(fract(gq - 0.5) - 0.5) * 7.0;
        float gl = max(line(gf.x, 0.22), line(gf.y, 0.22));
        float fl = step(0.55, hash(floor(gq) + floor(uT * 9.0)));                  // 街道线：没学会时一段段乱闪
        c += mix(mix(uMint, uPink, hash(floor(gq))) * gl * fl * 0.9, uMint * gl * 0.25, sy);
        float av = max(line(vW.x, 0.5), line(vW.z, 0.5));                           // 十字大道
        c += mix(uPink, uLemon, sy) * av * mix(fl * 1.4, 1.8, sy);
        float rings = line(r - 24.0, 0.9) + line(r - 38.0, 0.9) + line(r - 56.0, 0.9) + line(r - 72.0, 0.9);
        float lz = 96.0 * (1.0 - pow(vW.x / 172.0, 2.0)); rings += (line(abs(vW.z) - lz + 7.0, 1.3) + line(abs(vW.z) - lz - 7.0, 1.3)) * step(abs(vW.x), 172.0);
        rings += 0.5 * line(r - mod((uT - 10.66) * 110.0, 150.0), 2.5) * step(r, 80.0);        // 每一圈涟漪从瞳孔往外走
        c += uLemon * rings * sy * (1.6 + 0.6 * uBeat);                             // 学会了：一圈圈环路亮起来
        float pupil = smoothstep(11.0, 9.5, r) * smoothstep(0.0, 6.0, uWave);
        c = mix(c, uLemon * (1.7 + 0.5 * uBeat), pupil);
        c += vec3(1.8, 1.7, 1.2) * line(r - uWave, 3.5) * step(0.0, uWave);          // 光浪本身
        c *= exp(-length(vW - cameraPosition) * 0.0016);
        gl_FragColor = vec4(c, 1.0);
      }` }));
  ground.frustumCulled = false; scene.add(ground);
  const rndS = k => { const s = Math.sin(k * 127.1) * 43758.5453; return s - Math.floor(s); };
  return { id: 'l4-city', t0: T0, t1: T1, transitionIn: { kind: 'cut' }, build: () => ({}),
    update(_, T) {
      const k = T - T_DROP; U.uT.value = T; U.uBeat.value = beat(mv, T); U.uWave.value = k < 0 ? -1 : k * 190;
      // 镜头：贴着大道往城中心飞（乱闪的窗从两边掠过）→ drop：光浪从城中心炸开，镜头一口气拔到高空俯视 → 最后朝正中的「瞳孔」扎下去
      const fly = 150 - 24 * (T - T0), up = eOut(k / 1.5), dive = clamp((T - 12.3) / 0.86) ** 2;
      const sh = 0.25 * (rndS(Math.floor(T * 30)) - 0.5) * (k < 0 ? 1 : Math.exp(-k * 3) * 4);
      const y = lerp(lerp(7, 325, up) - 14 * clamp(k - 1.5), 10, dive), z = lerp(lerp(fly, 30, up), 0.5, dive), x = -42 * up * (1 - dive);   // 俯视时整只眼让到招牌右边
      cam.position.set(x + sh, y + sh, z); cam.up.set(0, 1, 0).applyAxisAngle(V(0, 0, 1), k > 0 ? 0.9 * (1 - eOut(k / 1.7)) : 0);   // 拔高的同时拧着转正
      cam.lookAt(x, lerp(9, 0, up), lerp(z - 60, 0, up)); cam.fov = lerp(62, 50, up); cam.updateProjectionMatrix(); hud(T);
      return { scene, camera: cam, post: { bloom: { strength: 0.85, threshold: 1.0 }, chroma: 0.08 + (k > 0 ? 0.8 * Math.exp(-k * 5) : 0), grade: { vignette: 0.38 }, flash: k > 0 && k < 0.2 ? { amount: 0.35 * Math.exp(-k * 16), color: '#ffffff' } : exitFlash(T) } };
    } };
}

// ================================================================ 2 误差山地裂开，光球坠进深谷
const terrainH = (x, z) => 7 * Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.09 - 0.7) + 4 * Math.sin(x * 0.23 - z * 0.19 + 2) + 2.2 * Math.sin(x * 0.47 + 0.5) * Math.sin(z * 0.41 + 1.7)
  + 9 * Math.exp(-((x - 18) ** 2 + (z + 12) ** 2) / 160) + 8 * Math.exp(-((x + 20) ** 2 + (z - 6) ** 2) / 120);
function terrain(mv) {
  const scene = new THREE.Scene(); scene.background = col('#05050b'); sky(scene);
  const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.2, 3000); scene.add(cam); const hud = lyricHud(mv, cam);
  const DEPTH = 190;
  const tU = { uRift: { value: 0 }, uT: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uBall: { value: V() } };
  const geo = new THREE.PlaneGeometry(320, 320, 420, 300).rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: tU, side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      uniform float uRift; varying vec3 vW; varying float vH0;
      float H(vec2 p){ float x = p.x, z = p.y; return 7.0 * sin(x * 0.11 + 1.3) * cos(z * 0.09 - 0.7) + 4.0 * sin(x * 0.23 - z * 0.19 + 2.0) + 2.2 * sin(x * 0.47 + 0.5) * sin(z * 0.41 + 1.7)
        + 9.0 * exp(-(pow(x - 18.0, 2.0) + pow(z + 12.0, 2.0)) / 160.0) + 8.0 * exp(-(pow(x + 20.0, 2.0) + pow(z - 6.0, 2.0)) / 120.0); }
      void main(){
        vec3 p = position; float h = H(p.xz); vH0 = h;
        float ax = length(vec2(p.x, p.z * 0.42)), open = uRift * (26.0 + 3.0 * sin(atan(p.z, p.x) * 5.0));   // 裂口：一道长椭圆的深坑，边不齐
        h -= ${DEPTH.toFixed(1)} * smoothstep(0.0, 0.6, uRift) * smoothstep(open, open * 0.36, ax);
        p.y = h; vW = p; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform float uT, uRift; uniform vec3 uPink, uMint, uLemon, uBall; varying vec3 vW; varying float vH0;
      float gridLine(float v, float s){ float g = abs(fract(v / s - 0.5) - 0.5) * s; return 1.0 - smoothstep(0.0, fwidth(v) * 1.3, g); }
      void main(){
        float deep = smoothstep(-4.0, -40.0, vW.y);                               // 谷里
        vec3 c = mix(vec3(0.03, 0.028, 0.05), vec3(0.07, 0.03, 0.09), smoothstep(-6.0, 14.0, vH0)) * (1.0 - 0.6 * deep);
        float iso = gridLine(vW.y, mix(1.4, 11.0, deep));                           // 等高线：山上密、谷壁上是一道道横纹（下坠时刷过去）
        vec3 ic = mix(uMint, uPink, smoothstep(-6.0, 12.0, vH0)); ic = mix(ic, mix(uPink, uMint, 0.5 + 0.5 * sin(vW.y * 0.09)), deep);
        c += ic * iso * (1.1 + 0.9 * deep);
        c += uLemon * 0.1 * max(gridLine(vW.x, 8.0), gridLine(vW.z, 8.0)) * (1.0 - deep);
        c += uLemon * 1.3 * exp(-distance(vW, uBall) * 0.3);                      // 光球照亮身边的山 / 谷壁
        c += uLemon * 0.55 * smoothstep(-120.0, -${DEPTH.toFixed(1)}, vW.y);                 // 谷底透上来的光
        c *= exp(-length(vW - cameraPosition) * mix(0.0035, 0.012, deep));          // 谷里越深越暗：往下看有纵深
        gl_FragColor = vec4(c, 1.0);
      }` }));
  mesh.frustumCulled = false; scene.add(mesh);
  // 远处一圈楼（这片山地在城里）
  const rnd = mulberry32(5), items = [];
  for (let i = 0; i < 150; i++) { const a = rnd() * 6.283, r = 135 + rnd() * 30, x = Math.cos(a) * r, z = Math.sin(a) * r; items.push({ x, z, w: 6 + rnd() * 5, h: 16 + rnd() * 30, dx: 0, dz: 0, yaw: 0, seed: rnd(), lit: 0, r: 1e6 }); }
  const bU = blockU(); const bm = blocks(items, bU); bm.position.y = -6; scene.add(bm);
  // 光球 + 光晕 + 拖尾
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.6) })); scene.add(ball);
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: hdr(PAL.lemon, 1.4), blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.setScalar(7); scene.add(glow);
  const NT = 40, tp = new Float32Array(NT * 3), tgeo = new THREE.BufferGeometry(); tgeo.setAttribute('position', new THREE.BufferAttribute(tp, 3));
  const trail = new THREE.Line(tgeo, new THREE.LineBasicMaterial({ color: hdr(PAL.lemon, 1.6), transparent: true, opacity: 0.8 })); trail.frustumCulled = false; scene.add(trail);
  // 谷底：那只眼（柠黄的环）
  const eye = new THREE.Group(); eye.position.y = -DEPTH + 2; eye.rotation.x = -Math.PI / 2; scene.add(eye);
  for (const [r0, r1, k] of [[0, 2.6, 2.6], [4.0, 4.5, 2], [6.0, 6.5, 2], [8.0, 8.6, 2]]) eye.add(new THREE.Mesh(r0 ? new THREE.RingGeometry(r0, r1, 96) : new THREE.CircleGeometry(r1, 64), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, k) })));
  // 光球的路径：山尖之间乱弹（没学会：每一步都落不到低处）→ drop：脚下裂开，直坠
  const HOPS = [[14, 8], [-9, 3], [7, -9], [-13, -4], [10, 4], [-4, 9], [0, 0]], HOP = (T_DROP - T0 + 0.5) / (HOPS.length - 1);
  const fall = k => k < 0.8 ? 46 * k * k : 29.4 + 74 * (k - 0.8);
  const ballAt = T => {
    const k = T - T_DROP;
    if (k >= 0) return V(0, terrainH(0, 0) + 3.2 - fall(k), 0);
    const u = clamp((T - (T0 - 0.5)) / HOP, 0, HOPS.length - 1 - 1e-4), i = Math.floor(u), f = u - i, a = HOPS[i], b = HOPS[i + 1];
    const x = lerp(a[0], b[0], f), z = lerp(a[1], b[1], f), ya = terrainH(a[0], a[1]), yb = i + 1 === HOPS.length - 1 ? terrainH(0, 0) + 3.2 : terrainH(b[0], b[1]);
    return V(x, lerp(ya, yb, f) + 0.6 + 5.5 * 4 * f * (1 - f) * (i + 1 === HOPS.length - 1 ? 1 - f * 0.5 : 1), z);
  };
  const rndS = k => { const s = Math.sin(k * 127.1) * 43758.5453; return s - Math.floor(s); };
  return { id: 'l4-terrain', t0: T0, t1: T1, transitionIn: { kind: 'cut' }, build: () => ({}),
    update(_, T) {
      const k = T - T_DROP; tU.uT.value = T; bU.uT.value = T; tU.uRift.value = eOut(k / 0.3);
      const b = ballAt(T); ball.position.copy(b); glow.position.copy(b); tU.uBall.value.copy(b); glow.scale.setScalar(5 + 0.6 * Math.sin(T * 30));
      for (let i = 0; i < NT; i++) { const p = ballAt(T - i * 0.012); tp.set([p.x, p.y, p.z], i * 3); } tgeo.attributes.position.needsUpdate = true;
      // 镜头：绕着山地看它乱弹 → drop：地面一震裂开，镜头翻到光球正上方、跟着往谷里俯冲
      const a = 0.9 + 0.22 * (T - T0), orbit = V(Math.cos(a) * 30, 15, Math.sin(a) * 30), follow = b.clone().add(V(3 * Math.sin(T * 1.3), 17 - 6 * smooth((k - 1.2) / 1.2), 5 * Math.cos(T * 1.3)));
      const w = eIO(k / 0.5), sh = (rndS(Math.floor(T * 30)) - 0.5) * (k > 0 ? 0.9 * Math.exp(-k * 4) + 0.12 : 0.05);
      cam.position.lerpVectors(orbit, follow, w).add(V(sh, sh * 0.6, 0));
      cam.up.set(Math.sin(k * 0.9) * w, 1 - w, -Math.cos(k * 0.9) * w).normalize();   // 俯冲时慢慢拧
      cam.lookAt(V(0, 5, 0).lerp(V(b.x * 0.5, b.y - 40 * w, b.z * 0.5), Math.max(w, 0.35)));
      cam.fov = lerp(55, 78, smooth(k / 1.0)); cam.updateProjectionMatrix(); hud(T);
      return { scene, camera: cam, post: { bloom: { strength: 0.9, threshold: 1.0 }, chroma: 0.08 + 0.5 * smooth(k / 1.2) + (k > 0 ? 0.6 * Math.exp(-k * 6) : 0), grade: { vignette: 0.42 }, flash: k > 0 && k < 0.2 ? { amount: 0.3 * Math.exp(-k * 16), color: '#ffffff' } : exitFlash(T) } };
    } };
}

// ================================================================ 3 夜空里的网收拢成眼
function net(mv) {
  const scene = new THREE.Scene(); scene.background = col('#05050b'); scene.fog = new THREE.Fog('#05050b', 160, 520); sky(scene, { moon: false });
  const cam = new THREE.PerspectiveCamera(55, 16 / 9, 0.3, 3000); scene.add(cam); const hud = lyricHud(mv, cam);
  // 地平线上的城
  const rnd = mulberry32(13), items = [];
  for (let i = 0; i < 260; i++) { const x = (rnd() - 0.5) * 420, z = -60 - rnd() * 200; items.push({ x, z, w: 6 + rnd() * 6, h: 5 + rnd() ** 2 * 17, dx: 0, dz: 0, yaw: 0, seed: rnd(), lit: 0, r: 1e6 }); }
  const bU = blockU(); scene.add(blocks(items, bU));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#0a0a14' })); scene.add(ground);
  // 网：节点先是一团散在夜空里的云；之后按「离中心第几近 + 原来的方位角」落到眼睛的各个环上（邻居还是邻居，连线不会乱穿）
  const N = 460, C = V(0, 58, -150), RE = 36, P0 = [], P1 = [], seed = [];
  for (let i = 0; i < N; i++) { P0.push(V((rnd() - 0.5) * 200, 20 + rnd() * 84, -150 + (rnd() - 0.5) * 40)); seed.push(rnd()); }
  const order = P0.map((p, i) => ({ i, rho: Math.hypot(p.x - C.x, (p.y - C.y) * 1.8), th: Math.atan2(p.y - C.y, p.x - C.x) })).sort((a, b) => a.rho - b.rho);
  const GROUPS = [[0.14, 0, 0.16], [0.16, 0.36, 0.36], [0.2, 0.6, 0.6], [0.2, 0.86, 0.86], [0.3, -1, -1]];   // [占比, 内半径, 外半径]（× RE）：瞳孔是一团，其余是环
  { let s = 0; for (const [frac, r0, r1] of GROUPS) { const n = Math.round(frac * N), g = order.slice(s, s + n).sort((a, b) => a.th - b.th); s += n;
      g.forEach((o, k) => { const th = r0 === 0 ? o.th : -Math.PI + (k + 0.5) / g.length * Math.PI * 2, rr = RE * (r0 === 0 ? r1 * Math.sqrt(seed[o.i]) : r0);
        P1[o.i] = r0 < 0 ? V(C.x + Math.cos(th) * RE * 2.1, C.y + Math.sign(Math.sin(th)) * RE * 1.18 * Math.sin(th) ** 2, C.z)      // 最外一组：上下眼睑
          : V(C.x + Math.cos(th) * rr, C.y + Math.sin(th) * rr, C.z); }); }
    for (let i = 0; i < N; i++) if (!P1[i]) P1[i] = C.clone(); }
  const links = []; for (let i = 0; i < N; i++) { const d = P0.map((p, j) => [p.distanceToSquared(P0[i]), j]).sort((a, b) => a[0] - b[0]); for (const [, j] of d.slice(1, 4)) if (i < j || !d.slice(1, 4).some(([, q]) => q === i)) links.push([i, j]); }
  const pPos = new Float32Array(N * 3), pCol = new Float32Array(N * 3), pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 5, map: dotTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); pts.frustumCulled = false; scene.add(pts);
  const lPos = new Float32Array(links.length * 6), lCol = new Float32Array(links.length * 6), lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lPos, 3)); lg.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); lines.frustumCulled = false; scene.add(lines);
  // 收拢完成后压上去的实环（让眼睛的边是利索的）
  const eye = new THREE.Group(); eye.position.copy(C); scene.add(eye); const eyeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2), transparent: true, opacity: 0, fog: false, depthWrite: false });
  for (const [r0, r1] of [[0.35, 0.37], [0.59, 0.61], [0.84, 0.88]]) eye.add(new THREE.Mesh(new THREE.RingGeometry(RE * r0, RE * r1, 128), eyeM));
  const coreM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.6), transparent: true, opacity: 0, fog: false, depthWrite: false }); const core = new THREE.Mesh(new THREE.CircleGeometry(RE * 0.15, 64), coreM); core.position.z = 0.1; eye.add(core);
  const hsh = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const cP = col(PAL.pink), cM = col(PAL.mint), cL = col(PAL.lemon), cW = col(PAL.paper), tmp = new THREE.Color(), pos = P0.map(() => V());
  return { id: 'l4-net', t0: T0, t1: T1, transitionIn: { kind: 'cut' }, build: () => ({}),
    update(_, T) {
      const k = T - T_DROP; bU.uT.value = T;
      const gather = eIO((k - 0.3) / 1.0), look = smooth((T - 12.2) / 0.3);                 // 0.3 s 之后开始收拢，1 秒收完；12.2 起这只眼往下看
      for (let i = 0; i < N; i++) {
        const wave = smooth((k * 520 - (P0[i].x + 95)) / 30), jit = (1 - wave) * 2.2;       // 同步的那一波：从左往右 0.4 秒扫完
        pos[i].lerpVectors(P0[i], P1[i], gather).add(V(jit * Math.sin(T * (5 + 9 * seed[i]) + i), jit * Math.cos(T * (4 + 7 * seed[i]) + i * 2), 0));
        if (look > 0 && P1[i].distanceTo(C) < RE * 0.2) pos[i].y -= 4.5 * look;              // 瞳孔往下挪：它在看这座城
        const err = hsh(i, Math.floor(T * (4 + 6 * seed[i]))) < 0.3;                          // 没学会：节点各闪各的，三成在报错（粉）
        tmp.copy(err ? cP : hsh(i, 7) < 0.5 ? cM : cW).multiplyScalar(err ? 1.5 : 0.35 + 0.5 * hsh(i, Math.floor(T * 9))).lerp(cL.clone().multiplyScalar(1.5 + 2.2 * Math.exp(-Math.max(0, k - (P0[i].x + 95) / 520) * 5)), wave);
        pPos.set([pos[i].x, pos[i].y, pos[i].z], i * 3); pCol.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      links.forEach(([a, b], n) => {
        const wave = smooth((k * 520 - ((P0[a].x + P0[b].x) / 2 + 95)) / 30), on = hsh(n, Math.floor(T * (3 + 8 * hsh(n, 1)))) < 0.35 ? 0.5 : 0.06;   // 没学会：连线断断续续
        tmp.copy(hsh(n, 3) < 0.5 ? cP : cM).multiplyScalar(on).lerp(cL.clone().multiplyScalar(0.9 + 1.6 * Math.exp(-Math.max(0, k - ((P0[a].x + P0[b].x) / 2 + 95) / 520) * 4)), wave);
        lPos.set([pos[a].x, pos[a].y, pos[a].z, pos[b].x, pos[b].y, pos[b].z], n * 6); lCol.set([tmp.r, tmp.g, tmp.b, tmp.r, tmp.g, tmp.b], n * 6);
      });
      pg.attributes.position.needsUpdate = pg.attributes.color.needsUpdate = lg.attributes.position.needsUpdate = lg.attributes.color.needsUpdate = true;
      const done = smooth((k - 1.15) / 0.3); eyeM.opacity = done; coreM.opacity = done; core.position.y = -4.5 * look; core.scale.setScalar(1 + 0.25 * beat(mv, T));
      // 镜头：从街上仰着看夜空里这张乱闪的网，慢慢推；收拢成眼之后朝瞳孔冲过去
      const push = clamp((T - 12.2) / 0.96) ** 2.4, drift = (T - T0) * 2.2;
      cam.position.set(lerp(6, 0, smooth(k / 1)), lerp(4, C.y - 6, push), lerp(-28 - drift, C.z + 12, push)); cam.up.set(0, 1, 0);
      cam.lookAt(0, lerp(54, C.y - 4.5 * look, smooth(k / 0.8)), C.z); cam.fov = 55; cam.updateProjectionMatrix(); hud(T);
      return { scene, camera: cam, post: { bloom: { strength: 0.95, threshold: 0.95 }, chroma: 0.08 + (k > 0 ? 0.7 * Math.exp(-k * 5) : 0), grade: { vignette: 0.4 }, flash: k > 0 && k < 0.2 ? { amount: 0.3 * Math.exp(-k * 16), color: '#ffffff' } : exitFlash(T) } };
    } };
}

export async function makeL4(mv, n) {
  await new FontFace('UIAnton', `url(${new URL('../../../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  return [null, city, terrain, net][n](mv);
}
