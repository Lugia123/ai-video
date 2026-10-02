// shots/c3-v7.js — 副歌 3 第七版（歌曲时间 95.40–105.96）。#1070，分镜 fresh/v4-rest/c3/plan-v7-用户.md
//
//   const draw = await makeC3V7(mv);  mv.mount(draw, { offset: C3V.t0, duration: C3V.end - C3V.t0 });     // c3-v7-half.html
//
//   ① 95.40 接主歌 3 出口（shots/v3-v4.js 最后一帧：正上方 8.7 身高俯拍、fov 32、up = −Z、她仰面下落 14 身高/s，脚下同一座夜城）：
//            脚下的楼一栋栋化成回形针、塌下去，回形针从街上漫上来
//   ② 96.84 她扎进回形针海：只溅起一圈、合拢，不拍她在里面；回形针从上方继续倒下来，水面一路涨到镜头跟前
//   ③ 98.82 只拍红按钮：起伏的回形针堆上一颗亮着的扁红色大按钮（黑色底座），镜头贴着堆面慢慢推过去；远处的高楼也在变成回形针往下掉，天上零星落几枚
//   ④ 100.72 漫画页四格：齐胸往前挤 → 伸手 → 啪地拍下按钮 → 底座根部的引线点着了，火花往上冲
//   ⑤ 103.72「fuse」：切 3D，引线在底座根部点着（闪 + 震），火花沿着引线往上猛冲，镜头甩上去跟着冲；四周的灯一片片灭
//      105.96 交桥段：黑暗里一粒火花正在往上冲（位置 / 大小 / 颜色见 SPARK_END，拖尾朝正下方长 0.22 画高）
// 全部是歌曲时间 T 的纯函数。单位：她身高 = 1。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { createPaperclips, mulberry32 } from '../kits/world.js';
import { clipTexture } from '../kits/doom-scale.js';
import { createComic, C as CX, CF } from '../kits/comic.js';

export const C3V = { t0: 95.40, hit: 96.84, pour: 97.3, button: 98.82, comic: 100.72, fuse: 103.72, dark: 105.69, end: 105.96 };
export const ANIMS = ['move__fall-air'];
// 105.96 那一帧（交桥段 0x58ad）：全黑，一粒火花。x / y = 画面分数（左上为原点），r = 亮芯半径（画高的分数），光晕半径约 4 倍
export const SPARK_END = { x: 0.498, y: 0.636, r: 0.01, core: '#f2eaf1', halo: '#ffd6e4', trail: 0.22 };      // = 0x58ad 桥段第一帧的数（seq 392）：火花钉在这个点上（镜头跟着升），拖尾朝正下方长 0.22 画高
const SPARK_FIRE = { core: '#fff2c8', halo: '#ff8a5a' };                                                 // 烧的时候是火的颜色，最后 0.4 s 过渡到 SPARK_END
// 入口（= shots/v3-v4.js 95.4 的出口；坐标是那边「现实世界」组里的，除以 2 之后她身高 = 1）
const ENTRY = { camUp: 8.7, fov: 32, speed: 14, y: -7.7, z: -19.09, off: 8.7 * Math.tan(32 * Math.PI / 360) * 0.1, cityY: -60 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const seg = (T, a, b) => smooth((T - a) / (b - a));
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
const KDIR = new URL('../../cast-cyber-girl/closeup/c3v7/', import.meta.url);

export async function makeC3V7(mv) {
  const { music, lyrics } = mv;
  await Promise.all([loadAnims(ANIMS), new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f))]);
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 94 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { up: line("I'm upping"), clips: line('as paperclips'), pto: line('Killswitch'), go: line('Now there'), fuse: line('Too late') };
  const wt = (ln, i) => ln.words[i].start;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = V3(), p3 = V3(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0);

  // ---------------------------------------------------------------- 回形针：共用几何 + 金属材质
  const clipGeo = createPaperclips({ count: 1, clipSize: 0.085 }).mesh.geometry;
  const envMap = Object.values(girl.materials ?? {}).find(m => m?.envMap)?.envMap ?? null;
  const metal = (o = {}) => new THREE.MeshStandardMaterial({ color: '#b6b8c6', metalness: 1, roughness: 0.34, envMap, envMapIntensity: 0.55, ...o });
  const TINT = [new THREE.Color('#ffffff'), new THREE.Color(PAL.pink), new THREE.Color(PAL.mint), new THREE.Color(PAL.lemon)];
  const tintOf = h => TINT[h < 0.86 ? 0 : 1 + Math.min(2, Math.floor((h - 0.86) / 0.0467))];
  const clipTex = clipTexture(31, { size: 1024, n: 420 }); clipTex.wrapS = clipTex.wrapT = THREE.RepeatWrapping; clipTex.anisotropy = 8;

  // ---------------------------------------------------------------- 歌词条（挂在镜头下沿，逐词亮；漫画段不用，词写在格子里）
  const capCv = document.createElement('canvas'); capCv.width = 1920; capCv.height = 170; const capG = capCv.getContext('2d');
  const capTex = new THREE.CanvasTexture(capCv); capTex.colorSpace = THREE.SRGBColorSpace;
  const capMesh = cam => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: capTex, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); m.renderOrder = 999; cam.add(m); return m; };
  const CAPS = [{ ln: L.up, from: 0 }, { ln: L.clips, from: 0 }, { ln: L.pto, from: 0 }, { ln: L.fuse, from: 5, until: 105.3 }];      // 最后一句只在 3D 里补「THE FUSE」
  function updateCaption(T, cam, mesh) {
    const g = capG; g.clearRect(0, 0, 1920, 170);
    const c = CAPS.filter(c => T >= c.ln.words[c.from].start - 0.12).at(-1), nx = c && CAPS[CAPS.indexOf(c) + 1];
    if (c && T < Math.min(c.until ?? c.ln.end + 0.9, nx ? nx.ln.words[nx.from].start - 0.12 : 1e9) && (T < C3V.comic || T >= C3V.fuse - 0.15)) {
      g.font = `76px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left';
      const ws = c.ln.words.slice(c.from).map(w => ({ ...w, s: (w.w ?? w.text ?? '').toUpperCase().replace(/[,.]/g, '') })), gap = 26, wd = ws.map(w => g.measureText(w.s).width + 36);
      let x = (1920 - wd.reduce((a, b) => a + b + gap, -gap)) / 2;
      ws.forEach((w, i) => {
        const on = T >= w.start, act = on && T < (ws[i + 1]?.start ?? w.end + 0.4), pop = on ? 1 + 0.12 * Math.exp(-(T - w.start) * 12) : 1;
        g.save(); g.translate(x + wd[i] / 2, 85); g.scale(pop, pop);
        g.fillStyle = on ? '#0a0a10' : 'rgba(10,10,16,0.55)'; g.fillRect(-wd[i] / 2, -52, wd[i], 104);
        g.strokeStyle = act ? PAL.lemon : on ? PAL.mint : 'rgba(95,227,192,0.35)'; g.lineWidth = 6; g.strokeRect(-wd[i] / 2 + 3, -49, wd[i] - 6, 98);
        g.fillStyle = act ? PAL.lemon : on ? '#ffffff' : 'rgba(255,255,255,0.3)'; g.fillText(w.s, -wd[i] / 2 + 18, 6); g.restore();
        x += wd[i] + gap;
      });
    }
    capTex.needsUpdate = true;
    const hh = 2 * Math.tan(cam.fov * Math.PI / 360), ww = hh * cam.aspect;
    mesh.scale.set(ww, hh * 170 / 1080, 1); mesh.position.set(0, -hh / 2 + hh * (170 / 1080) / 2 + hh * 0.035, -1);
  }

  // ================================================================ 场景 A：坠落 → 楼化成回形针 → 扎进回形针海（①②）
  const sA = new THREE.Scene(); sA.background = new THREE.Color('#070812');
  const camA = new THREE.PerspectiveCamera(ENTRY.fov, mv.width / mv.height, 0.05, 2000); sA.add(camA);
  sA.add(createGirlLights(), girl.root);
  const capA = capMesh(camA);
  const CEN = V3(0, 0, ENTRY.z);                             // 她正下方
  const SEA1 = ENTRY.y - ENTRY.speed * (C3V.hit - C3V.t0);   // 她在 96.84 落到的海面高度
  const girlY = T => ENTRY.y - ENTRY.speed * (T - C3V.t0);
  // 海面高度：楼化掉的同时从街面漫上来，96.78 到 SEA1；97.3 起回形针继续倒下来，一路涨到镜头跟前
  const seaY = T => T < C3V.pour ? lerp(ENTRY.cityY + 1.5, SEA1, 1 - (1 - clamp((T - 95.45) / (96.78 - 95.45))) ** 2.2) : SEA1 + 4.9 * clamp((T - C3V.pour) / (C3V.button - C3V.pour)) ** 3;
  const camAY = T => T < C3V.hit ? girlY(T) + ENTRY.camUp : SEA1 + ENTRY.camUp - (ENTRY.speed / 5.7) * (1 - Math.exp(-(T - C3V.hit) * 5.7));

  // 夜城：和 shots/v3-v4.js 结尾同一座（同一个生成器、同一组种子），每栋楼带一个「化掉」的时刻
  const cityTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(5);
    g.fillStyle = '#111120'; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 7; x++) if (rnd() < 0.55) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 36 + 8, y * 28 + 6, 20, 12); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
  const BLD = [];
  { const r2 = mulberry32(23);
    for (let a = 0; a < 30; a++) for (let b = 0; b < 30; b++) {
      const x = (a - 14.5) * 16 + (r2() - 0.5) * 3, z = (b - 14.5) * 16 + (r2() - 0.5) * 3 - 20, w = 7 + r2() * 5, d = 7 + r2() * 5, h = 8 + r2() * 26;
      if ((a % 5 === 2) || (b % 5 === 2)) continue;
      const dist = Math.hypot(x - CEN.x, z - CEN.z);
      BLD.push({ x, z, w, d, h, dist, tm: 95.5 + 0.03 * dist + 0.2 * hash(a * 31 + b, 7), seed: hash(a * 31 + b, 3) });
    } }
  const cityMat = new THREE.ShaderMaterial({
    uniforms: { uWin: { value: cityTex }, uClip: { value: clipTex }, uT: { value: 0 }, uSea: { value: -60 }, uMint: { value: hdr(PAL.mint, 0.45) } },
    vertexShader: /* glsl */`
      attribute vec4 aInfo; uniform float uT, uSea; varying vec2 vUv; varying vec3 vW, vN; varying float vM, vY;
      void main(){
        float m = smoothstep(aInfo.y, aInfo.y + 0.55, uT); vM = m; vUv = uv; vY = position.y;
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vec3 c = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float top = c.y + aInfo.x, tgt = min(uSea - 0.4, top);
        w.y = c.y + position.y * mix(aInfo.x, max(tgt - c.y, 0.0), m);
        float bulge = sin(m * 3.14159);
        w.xz = c.xz + (w.xz - c.xz) * (1.0 + 0.3 * bulge * position.y);
        w.x += sin(uT * 11.0 + aInfo.z * 40.0 + position.y * 4.0) * 0.6 * bulge * position.y;
        w.z += cos(uT * 9.0 + aInfo.z * 23.0 + position.y * 3.0) * 0.6 * bulge * position.y;
        vW = w.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uWin, uClip; uniform float uT, uSea; uniform vec3 uMint; varying vec2 vUv; varying vec3 vW, vN; varying float vM, vY;
      void main(){
        if (vW.y < uSea - 0.05) discard;
        float roof = step(0.7, vN.y);
        vec2 b = min(vUv, 1.0 - vUv); float edge = 1.0 - step(0.047, min(b.x, b.y));
        vec3 roofC = mix(vec3(0.0075, 0.007, 0.023), vec3(1.0), edge) * uMint;
        vec3 base = mix(texture2D(uWin, vUv).rgb, roofC, roof);
        // 化成回形针：从楼顶往下一层层换成金属回形针的纹理，带一道亮边
        vec2 cuv = roof > 0.5 ? vW.xz : vec2(abs(vN.x) > 0.5 ? vW.z : vW.x, vW.y);
        vec3 clip = texture2D(uClip, cuv / 3.6).rgb * 0.5 + vec3(0.015, 0.015, 0.025);
        float k = smoothstep(0.0, 0.25, vM * 1.6 - (1.0 - vY) * 0.5);
        float rim = exp(-pow((vM * 1.6 - (1.0 - vY) * 0.5 - 0.12) * 9.0, 2.0));
        gl_FragColor = vec4(mix(base, clip, k) + vec3(0.9, 0.85, 0.7) * rim * step(0.001, vM) * (1.0 - vM), 1.0); }`,
  });
  { const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), info = new Float32Array(BLD.length * 4);
    const city = new THREE.InstancedMesh(geo, cityMat, BLD.length); city.frustumCulled = false;
    BLD.forEach((b, i) => { city.setMatrixAt(i, m4.compose(p3.set(b.x, ENTRY.cityY, b.z), q.identity(), s3.set(b.w, b.h, b.d))); info.set([b.h, b.tm, b.seed, 0], i * 4); });
    geo.setAttribute('aInfo', new THREE.InstancedBufferAttribute(info, 4)); sA.add(city);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: '#0d0c18' })); ground.rotation.x = -Math.PI / 2; ground.position.y = ENTRY.cityY; sA.add(ground);
    const cols = [PAL.pink, PAL.mint, PAL.lemon];
    for (let a = 2, n = 0; a < 30; a += 5, n++) for (const horiz of [0, 1]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(horiz ? 480 : 1.1, horiz ? 1.1 : 480), new THREE.MeshBasicMaterial({ color: hdr(cols[(n + horiz) % 3], 2.2), fog: false }));
      m.rotation.x = -Math.PI / 2; m.position.set(horiz ? 0 : (a - 14.5) * 16, ENTRY.cityY + 0.05, horiz ? (a - 14.5) * 16 - 20 : -20); sA.add(m);
    } }
  // 海面（远处）：一张流动的回形针贴图，离她越远越暗；她落点一圈涟漪
  const seaMatA = new THREE.ShaderMaterial({
    uniforms: { uClip: { value: clipTex }, uT: { value: 0 }, uC: { value: new THREE.Vector2(CEN.x, CEN.z) }, uHit: { value: C3V.hit }, uNear: { value: 0 }, uVis: { value: 0 } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: /* glsl */`
      uniform sampler2D uClip; uniform float uT, uHit, uNear, uVis; uniform vec2 uC; varying vec3 vW;
      void main(){
        float d = distance(vW.xz, uC);
        vec3 a = texture2D(uClip, vW.xz / 3.6 + vec2(uT * 0.045, 0.0)).rgb, b = texture2D(uClip, vW.xz / 8.0 + vec2(0.37, uT * 0.03)).rgb;
        vec3 c = max(a * 0.7, b * 0.45);
        c *= mix(0.1, 1.0, 1.0 - smoothstep(14.0, 60.0, d));
        c += vec3(0.8, 0.85, 1.0) * 0.1 * pow(max(0.0, sin(d * 0.55 - uT * 3.0)), 14.0) * (1.0 - smoothstep(10.0, 45.0, d));
        float k = uT - uHit; if (k > 0.0) c += vec3(1.0, 0.95, 0.9) * 0.9 * exp(-pow((d - k * 9.0) * 0.9, 2.0)) * exp(-k * 2.2);
        c *= (1.0 - uNear * (1.0 - smoothstep(5.5, 8.5, d)) * 0.85) * uVis;        // 近处有真回形针盖着，贴图压暗当底
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const seaA = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), seaMatA); seaA.rotation.x = -Math.PI / 2; sA.add(seaA);
  // 海面（近处）：落点周围一层真回形针，跟着海面走；她扎进去时中间空一个洞、合拢，涟漪往外推
  const clipMatA = metal();
  const NEAR_N = 30000, NEAR_R = 8.2, near = new THREE.InstancedMesh(clipGeo, clipMatA, NEAR_N); near.frustumCulled = false; sA.add(near);
  const nearD = new Float32Array(NEAR_N * 8);
  { const rnd = mulberry32(5); for (let i = 0; i < NEAR_N; i++) { const a = rnd() * 6.283, r = NEAR_R * Math.sqrt(rnd()); nearD.set([Math.cos(a) * r, -rnd() * 0.16, Math.sin(a) * r, -Math.PI / 2 + (rnd() - 0.5) * 0.8, rnd() * 6.283, (rnd() - 0.5) * 0.8, lerp(1.2, 1.9, rnd()), r], i * 8); near.setColorAt(i, tintOf(rnd())); } }
  function updateNear(T) {
    const k = T - C3V.hit, hole = k > 0 ? 0.62 * (1 - smooth(k / 0.42)) : 0, sy = seaY(T);
    for (let i = 0; i < NEAR_N; i++) { const o = i * 8, r = nearD[o + 7];
      if (r < hole) { near.setMatrixAt(i, ZERO); continue; }
      const wv = k > 0 && k < 1.6 ? 0.5 * Math.exp(-(((r - k * 5.2) / 0.55) ** 2)) * Math.exp(-k * 1.8) : 0, push = 1 + (k > 0 ? 0.25 * Math.exp(-r * 1.4) * Math.exp(-k * 3) : 0);
      e.set(nearD[o + 3] + wv * 1.6, nearD[o + 4], nearD[o + 5], 'YXZ');
      near.setMatrixAt(i, m4.compose(p3.set(CEN.x + nearD[o] * push, sy + nearD[o + 1] + wv, CEN.z + nearD[o + 2] * push), q.setFromEuler(e), s3.setScalar(nearD[o + 6]))); }
    near.instanceMatrix.needsUpdate = true;
  }
  // 楼化掉时蹦出来的大回形针（俯拍看得清是一枚枚回形针），落回海里
  const DEB = []; BLD.filter(b => b.dist < 40 && b.dist > 6).forEach((b, bi) => { const n = 2; for (let j = 0; j < n; j++) { const id = bi * 16 + j;
    DEB.push({ x: b.x + (hash(id, 1) - 0.5) * b.w, z: b.z + (hash(id, 2) - 0.5) * b.d, y: ENTRY.cityY + b.h, t: b.tm + 0.1 + 0.45 * hash(id, 3), vx: (hash(id, 4) - 0.5) * 9, vz: (hash(id, 5) - 0.5) * 9, vy: 5 + 7 * hash(id, 6), s: lerp(2, 3.2, hash(id, 7)), id }); } });
  const deb = new THREE.InstancedMesh(clipGeo, clipMatA, DEB.length); deb.frustumCulled = false; sA.add(deb);
  DEB.forEach((d, i) => deb.setColorAt(i, tintOf(hash(d.id, 8))));
  function updateDeb(T) { const sy = seaY(T);
    DEB.forEach((d, i) => { const k = T - d.t, y = d.y + d.vy * k - 11 * k * k;
      if (k < 0 || y < sy - 0.6) { deb.setMatrixAt(i, ZERO); return; }
      e.set(hash(d.id, 9) * 6.283 + k * (2 + 3 * hash(d.id, 10)), hash(d.id, 11) * 6.283 + k * 2.2, hash(d.id, 12) * 6.283);
      deb.setMatrixAt(i, m4.compose(p3.set(d.x + d.vx * k, y, d.z + d.vz * k), q.setFromEuler(e), s3.setScalar(d.s * Math.min(1, k * 7)))); });
    deb.instanceMatrix.needsUpdate = true; }
  // 小回形针：下落时从她身边往上掠过；扎进去溅起的一圈；97.3 起从上方倒下来的
  const FLY_N = 90, SPL_N = 900, POUR_N = 1700, misc = new THREE.InstancedMesh(clipGeo, clipMatA, FLY_N + SPL_N + POUR_N); misc.frustumCulled = false; sA.add(misc);
  for (let i = 0; i < FLY_N + SPL_N + POUR_N; i++) misc.setColorAt(i, tintOf(hash(i, 21)));
  function updateMisc(T) {
    const gy = girlY(T), sy = seaY(T), cy = camAY(T), k = T - C3V.hit;
    for (let i = 0; i < FLY_N; i++) { const a = hash(i, 22) * 6.283, r = 0.9 + 3.6 * hash(i, 23), y = gy - 5 + ((hash(i, 24) * 10 + (T - C3V.t0) * (7 + 6 * hash(i, 25))) % 10);
      if (T >= C3V.hit - 0.05 || y < sy || hash(i, 29) > 0.25 + 0.75 * clamp((T - C3V.t0) / 0.6)) { misc.setMatrixAt(i, ZERO); continue; }
      e.set(hash(i, 26) * 6.283 + T * 5, a + T * 3, hash(i, 27) * 6.283); misc.setMatrixAt(i, m4.compose(p3.set(CEN.x + Math.cos(a) * r, y, CEN.z + Math.sin(a) * r), q.setFromEuler(e), s3.setScalar(1.1))); }
    for (let j = 0; j < SPL_N; j++) { const i = FLY_N + j, a = hash(i, 22) * 6.283, vr = 0.8 + 3.4 * hash(i, 23), vy = 3.5 + 5.5 * hash(i, 24) * (1 - 0.5 * hash(i, 23)), y = SEA1 + vy * k - 8.5 * k * k;
      if (k < 0 || y < sy - 0.05) { misc.setMatrixAt(i, ZERO); continue; }
      const r = 0.3 + vr * k; e.set(hash(i, 26) * 6.283 + k * 9, a + k * 4, hash(i, 27) * 6.283 + k * 7); misc.setMatrixAt(i, m4.compose(p3.set(CEN.x + Math.cos(a) * r, y, CEN.z + Math.sin(a) * r), q.setFromEuler(e), s3.setScalar(1.5))); }
    const on = clamp((T - C3V.pour) / 1.3) ** 1.5;
    for (let j = 0; j < POUR_N; j++) { const i = FLY_N + SPL_N + j, a = hash(i, 22) * 6.283, r = 0.9 + 5.2 * Math.sqrt(hash(i, 23)), top = cy + 3, ph = (hash(i, 24) + (T - C3V.pour) * (0.85 + 0.5 * hash(i, 25))) % 1, y = top - ph * ph * (top - sy + 0.3);
      if (T < C3V.pour || hash(i, 28) > on || y < sy) { misc.setMatrixAt(i, ZERO); continue; }
      e.set(hash(i, 26) * 6.283 + T * 6, a + T * 3, hash(i, 27) * 6.283 + T * 4); misc.setMatrixAt(i, m4.compose(p3.set(CEN.x + Math.cos(a) * r, y, CEN.z + Math.sin(a) * r), q.setFromEuler(e), s3.setScalar(1.5))); }
    misc.instanceMatrix.needsUpdate = true;
  }
  // 她：仰面下落（同 v3-v4.js：头 → −Z、脸 → +Y，髋钉在下落轨迹上）
  const BI = girl.dancer.S.info, bp = k => BI[k].bone.getWorldPosition(V3());
  const SUPINE_Q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(1, 0, 0), V3(0, 0, -1), V3(0, 1, 0)));
  const FALL = getAnim('move__fall-air'), _B = new THREE.Matrix4(), _Rn = new THREE.Quaternion();
  function placeSupine(T, hips) {
    girl.root.scale.setScalar(1); girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(FALL.solve((0.6 + (T - 94.30)) / FALL.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true);
    const h = bp('Hips'), y = bp('Head').sub(bp('LeftFoot').add(bp('RightFoot')).multiplyScalar(0.5)).normalize();
    const x = bp('LeftUpLeg').sub(bp('RightUpLeg')); x.addScaledVector(y, -x.dot(y)).normalize();
    _Rn.setFromRotationMatrix(_B.makeBasis(x, y, V3().crossVectors(x, y))).invert();
    const qq = SUPINE_Q.clone().multiply(_Rn);
    girl.root.quaternion.copy(qq); girl.root.position.copy(hips).sub(h.applyQuaternion(qq)); girl.root.updateMatrixWorld(true);
  }
  function drawA(T) {
    const sy = seaY(T), cy = camAY(T), k = T - C3V.hit;
    cityMat.uniforms.uT.value = T; cityMat.uniforms.uSea.value = sy;
    seaA.position.y = sy; seaMatA.uniforms.uT.value = T; seaMatA.uniforms.uNear.value = seg(T, 96.2, 96.7); seaMatA.uniforms.uVis.value = seg(T, 95.7, 96.7); if (T > C3V.pour) seaMatA.uniforms.uNear.value = lerp(1, 1.15, seg(T, C3V.pour, C3V.button));
    near.visible = T > 96.3; near.count = Math.floor(NEAR_N * seg(T, 96.3, 96.8)); if (near.visible) updateNear(T);
    updateDeb(T); updateMisc(T);
    clipMatA.envMapIntensity = 0.7;
    girl.root.visible = k < 0.1; if (girl.root.visible) { if (girl.root.parent !== sA) sA.add(girl.root); placeSupine(T, V3(CEN.x, girlY(T), CEN.z)); girl.setSkin('toon', T); girl.root.updateMatrixWorld(true); }
    const roll = 0.5 * seg(T, C3V.hit + 0.1, C3V.button), sh = k > 0 ? 0.12 * Math.exp(-k * 8) * Math.sin(k * 60) : 0;
    camA.fov = lerp(ENTRY.fov, 40, seg(T, C3V.hit, C3V.hit + 0.6)); camA.up.set(Math.sin(roll), 0, -Math.cos(roll));
    camA.position.set(CEN.x + sh, cy, CEN.z + ENTRY.off); camA.lookAt(CEN.x + sh, cy - 10, CEN.z + ENTRY.off); camA.updateProjectionMatrix(); camA.updateMatrixWorld(true);
    if (girl.root.visible && girl.face) { try { girl.face.update(T, { camera: camA, expression: 'surprised' }); } catch {} }
    updateCaption(T, camA, capA);
    const out = seg(T, C3V.button - 0.08, C3V.button);
    return { scene: sA, camera: camA, post: { dither: 1.2, bloom: { strength: 0.7, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + 0.25 * kick(T) + (k > 0 ? 0.5 * Math.exp(-k * 7) : 0), grade: { vignette: 0.38 }, flash: k > 0 && k < 0.2 ? { amount: 0.35 * (1 - k / 0.2), color: '#ffffff' } : out > 0 ? { amount: 0.6 * out, color: '#dfe3ea' } : 0 } };
  }

  // ================================================================ 场景 B：起伏的回形针堆上的红按钮（③）+ 引线从底座点着、火花往上猛冲（⑤）
  const NIGHT = '#05060e';
  const sB = new THREE.Scene(); sB.background = new THREE.Color(NIGHT); sB.fog = new THREE.FogExp2(NIGHT, 0.03);
  const camB = new THREE.PerspectiveCamera(36, mv.width / mv.height, 0.05, 800); sB.add(camB);
  const capB = capMesh(camB);
  const hemiB = new THREE.HemisphereLight('#7f8ad0', '#0c0a18', 0.2), moonB = new THREE.DirectionalLight('#aab8ff', 0.9); moonB.position.set(-7, 5, -3); sB.add(hemiB, moonB, moonB.target);
  const clipMatB = metal({ color: '#aeb0bc', roughness: 0.36 });
  // 堆体：沙丘一样有高有低（按钮周围压平一点）；物理烘焙的 kit（0xb52e #1073）出来后换掉这一块
  const dune = (x, z) => { const r = Math.hypot(x, z), k = smooth((r - 1.2) / 5);
    return k * (0.5 * Math.sin(x * 0.21 + 1.0) * Math.cos(z * 0.17 + 0.4) + 0.28 * Math.sin(x * 0.47 + z * 0.33) + 0.13 * Math.sin(z * 0.85 - x * 0.6 + 2.0)) + 0.9 * smooth((r - 30) / 60) * Math.sin(x * 0.06) * Math.cos(z * 0.05); };
  const duneN = (x, z, out) => { const d = 0.15; return out.set(dune(x - d, z) - dune(x + d, z), 2 * d, dune(x, z - d) - dune(x, z + d)).normalize(); };
  { const g = new THREE.PlaneGeometry(300, 300, 200, 200); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, dune(p.getX(i), p.getZ(i)) - 0.14); g.computeVertexNormals();
    const t2 = clipTex.clone(); t2.needsUpdate = true; t2.repeat.set(85, 85);
    sB.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: t2, color: '#8e90a6', metalness: 0.55, roughness: 0.5 })));
    const N = 70000, rnd = mulberry32(9), mesh = new THREE.InstancedMesh(clipGeo, clipMatB, N); mesh.frustumCulled = false; const nrm = V3(), up = V3(0, 1, 0), qs = new THREE.Quaternion();
    for (let i = 0; i < N; i++) { const a = rnd() * 6.283, r = 17 * Math.sqrt(rnd()), x = 0.6 + Math.cos(a) * r, z = 6 + Math.sin(a) * r;
      const stand = rnd() < 0.18;                                                       // 一部分斜插着，堆起来才有厚度
      e.set(-Math.PI / 2 + (rnd() - 0.5) * (stand ? 2.4 : 0.7), rnd() * 6.283, (rnd() - 0.5) * (stand ? 2.0 : 0.7), 'YXZ');
      q.setFromEuler(e).premultiply(qs.setFromUnitVectors(up, duneN(x, z, nrm)));
      mesh.setMatrixAt(i, m4.compose(p3.set(x, dune(x, z) - rnd() * 0.12 + (stand ? 0.04 : 0), z), q, s3.setScalar(Math.hypot(x, z) < 1.02 ? 0 : lerp(1.1, 1.8, rnd())))); mesh.setColorAt(i, tintOf(rnd())); }
    sB.add(mesh); }
  // 按钮：扁的红色大按钮 + 黑色底座（和漫画四格同一个造型）；⑤ 里是被拍下去的状态
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.5, ...o });
  const BTN = V3(0, 0.56, 0);
  { const add = (geo, mat, y) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; sB.add(m); return m; };
    add(new THREE.CylinderGeometry(0.98, 1.08, 0.5, 48), std('#14141c', { metalness: 0.8, roughness: 0.35, envMap, envMapIntensity: 0.5 }), 0.2);
    add(new THREE.TorusGeometry(0.9, 0.06, 10, 48).rotateX(Math.PI / 2), std('#5a5a6a', { metalness: 1, roughness: 0.25, envMap, envMapIntensity: 0.8 }), 0.46); }
  const btnMat = new THREE.MeshBasicMaterial({ fog: false, toneMapped: false });
  const btn = new THREE.Group(); sB.add(btn);
  { const side = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.76, 0.22, 48), btnMat); const top = new THREE.Mesh(new THREE.SphereGeometry(0.74, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), btnMat); top.scale.y = 0.16; top.position.y = 0.11; btn.add(side, top); }
  const redLight = new THREE.PointLight('#ff2030', 0, 16, 1.5); redLight.position.set(0, 1.5, 0.4); sB.add(redLight);
  // 远处的高楼：一栋栋从楼顶往下变成回形针、往下掉（楼身从上往下消失，消失的那一圈往外喷回形针）
  const FAR = []; { const rnd = mulberry32(61); for (let i = 0; i < 40; i++) { const a = 2.2 + rnd() * 2.9, r = 42 + 60 * rnd(); FAR.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, w: 5 + 5 * rnd(), d: 5 + 5 * rnd(), h: 9 + 22 * rnd(), a, t0: 98.3 + 5.2 * rnd() ** 1.3, dur: 1.6 + 1.6 * rnd() }); } }
  const farMat = new THREE.ShaderMaterial({ uniforms: { uWin: { value: cityTex }, uK: { value: 1 }, uFog: { value: new THREE.Color(NIGHT) } },
    vertexShader: 'attribute vec2 aCut; varying vec2 vUv; varying float vY, vCut, vD, vTop; void main(){ vUv = uv * vec2(1.0, aCut.y); vY = position.y; vCut = aCut.x; vTop = step(0.5, normal.y); vec4 mvp = modelViewMatrix * instanceMatrix * vec4(position, 1.0); vD = -mvp.z; gl_Position = projectionMatrix * mvp; }',
    fragmentShader: 'uniform sampler2D uWin; uniform float uK; uniform vec3 uFog; varying vec2 vUv; varying float vY, vCut, vD, vTop; void main(){ if (vY > vCut) discard; vec3 c = mix(texture2D(uWin, vUv).rgb * uK, vec3(0.012, 0.012, 0.02), vTop) + vec3(0.5, 0.5, 0.56) * smoothstep(0.02, 0.0, vCut - vY) * step(vCut, 0.995) * uK * (1.0 - vTop); gl_FragColor = vec4(mix(c, uFog, 1.0 - exp(-vD * 0.014)), 1.0); }' });
  const farGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), farCut = new Float32Array(FAR.length * 2);
  farGeo.setAttribute('aCut', new THREE.InstancedBufferAttribute(farCut, 2));
  const farMesh = new THREE.InstancedMesh(farGeo, farMat, FAR.length); farMesh.frustumCulled = false; sB.add(farMesh);
  FAR.forEach((b, i) => { farMesh.setMatrixAt(i, m4.compose(p3.set(b.x, -0.5, b.z), q.identity(), s3.set(b.w, b.h, b.d))); farCut[i * 2 + 1] = b.h / 12; });
  const FARC = 46, farClips = new THREE.InstancedMesh(clipGeo, clipMatB, FAR.length * FARC); farClips.frustumCulled = false; sB.add(farClips);
  for (let i = 0; i < FAR.length * FARC; i++) farClips.setColorAt(i, tintOf(hash(i, 91)));
  const farMelt = (b, T) => clamp((T - b.t0) / b.dur);
  function updateFar(T, lightK) {
    farMat.uniforms.uK.value = 0.5 * lightK;
    FAR.forEach((b, i) => { const m = farMelt(b, T), top = b.h * (1 - m); farCut[i * 2] = 1 - m;
      for (let j = 0; j < FARC; j++) { const id = i * FARC + j, ph = (hash(id, 92) + T * (0.5 + 0.4 * hash(id, 93))) % 1, life = 1.5;
        if (m <= 0 || m >= 1 && ph > 0.3) { farClips.setMatrixAt(id, ZERO); continue; }
        const side = hash(id, 94) * 4, u = hash(id, 95) - 0.5, tt = ph * life;
        const ox = side < 1 ? u * b.w : side < 2 ? u * b.w : side < 3 ? -b.w / 2 : b.w / 2, oz = side < 1 ? -b.d / 2 : side < 2 ? b.d / 2 : u * b.d;
        const y = -0.5 + top + 1.5 * tt - 6 * tt * tt; if (y < dune(b.x, b.z) - 0.5) { farClips.setMatrixAt(id, ZERO); continue; }
        e.set(hash(id, 96) * 6.283 + tt * 5, hash(id, 97) * 6.283 + tt * 3, hash(id, 98) * 6.283);
        farClips.setMatrixAt(id, m4.compose(p3.set(b.x + ox * (1 + 0.5 * tt), y, b.z + oz * (1 + 0.5 * tt)), q.setFromEuler(e), s3.setScalar(lerp(6, 11, hash(id, 99))))); } });
    farGeo.attributes.aCut.needsUpdate = true; farClips.instanceMatrix.needsUpdate = true; }
  // 天上零星落下的回形针（不多）；⑤ 往上冲时一路还有，从镜头前刷过去
  const SKY_N = 150, sky = new THREE.InstancedMesh(clipGeo, clipMatB, SKY_N); sky.frustumCulled = false; sB.add(sky);
  for (let i = 0; i < SKY_N; i++) sky.setColorAt(i, tintOf(hash(i, 51)));
  function updateSky(T) {
    for (let i = 0; i < SKY_N; i++) { const low = i < 26, a = hash(i, 52) * 6.283, r = low ? 1.5 + 9 * hash(i, 53) : 1.2 + 5 * hash(i, 53), v = 1.6 + 1.2 * hash(i, 54);
      const x = (low ? 0.5 : 1.0) + Math.cos(a) * r, z = (low ? 6 : 0.4) + Math.sin(a) * r, span = low ? 9 : 120, y = low ? span - ((hash(i, 55) * span + (T - 98) * v) % span) : 8 + span * hash(i, 55) - (T - C3V.fuse) * v;
      if (y < dune(x, z)) { sky.setMatrixAt(i, ZERO); continue; }
      e.set(hash(i, 56) * 6.283 + T * (1 + 2 * hash(i, 57)), hash(i, 58) * 6.283 + T * 1.3, hash(i, 59) * 6.283);
      sky.setMatrixAt(i, m4.compose(p3.set(x, y, z), q.setFromEuler(e), s3.setScalar(low ? 1.7 : 2.4))); }
    sky.instanceMatrix.needsUpdate = true; }
  // 引线：从底座侧面的根部笔直往上伸进夜空。拍下按钮 → 根部点着 → 火花沿着它往上猛冲
  const ROOT_P = V3(0.98, 0.1, 0.42), IGN = 0.05;                       // 漫画里已经点着、窜出格子了：3D 一进来几乎立刻起飞
  const sparkY = T => { const k = Math.max(0, T - C3V.fuse - IGN); return ROOT_P.y + 7 * k + 16 * k * k; };      // 越冲越快：105.96 时约 86 高、速度约 74 / s
  const sparkAt = (T, out) => { const y = sparkY(T); return out.set(ROOT_P.x + 0.1 * Math.sin(y * 0.2), y, ROOT_P.z + 0.08 * Math.sin(y * 0.13 + 1)); };
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: '#c9a25c', toneMapped: false })); sB.add(rope);
  const sparkLight = new THREE.PointLight('#ff8a40', 0, 9, 1.3); sB.add(sparkLight);
  const EMB_N = 150, emb = new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.14, 0.02), new THREE.MeshBasicMaterial({ color: hdr('#ffb050', 4), fog: false, toneMapped: false }), EMB_N); emb.frustumCulled = false; sB.add(emb);
  // 速度线：引线四周竖着的细光条，镜头跟着冲上去时它们往下刷
  const SL_N = 170, sl = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 1, 0.018), new THREE.MeshBasicMaterial({ color: hdr('#b9c6ff', 0.9), fog: false, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), SL_N); sl.frustumCulled = false; sB.add(sl);
  for (let i = 0; i < SL_N; i++) { const a = hash(i, 31) * 6.283, r = 1.4 + 7 * hash(i, 32) ** 1.4; sl.setMatrixAt(i, m4.compose(p3.set(ROOT_P.x + Math.cos(a) * r, 5 + 110 * hash(i, 33), ROOT_P.z + Math.sin(a) * r), q.identity(), s3.set(1, 1.5 + 4.5 * hash(i, 34), 1))); }
  // 火花本体 + 拖尾画在镜头上（屏幕位置 = 它在世界里的投影；最后 0.35 s 收到 SPARK_END，和桥段对齐）
  const haloTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const trailTex = (() => { const c = document.createElement('canvas'); c.width = 32; c.height = 256; const g = c.getContext('2d'), gv = g.createLinearGradient(0, 0, 0, 256); gv.addColorStop(0, 'rgba(255,255,255,1)'); gv.addColorStop(0.3, 'rgba(255,255,255,0.5)'); gv.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gv; g.fillRect(0, 0, 32, 256);
    const gh = g.createLinearGradient(0, 0, 32, 0); gh.addColorStop(0, 'rgba(0,0,0,1)'); gh.addColorStop(0.5, 'rgba(0,0,0,0)'); gh.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gh; g.fillRect(0, 0, 32, 256); return new THREE.CanvasTexture(c); })();
  const ovl = o => new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false, toneMapped: false, ...o });
  const sparkCore = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false, fog: false, toneMapped: false })); sparkCore.renderOrder = 998;
  const sparkHalo = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ovl({ map: haloTex })); sparkHalo.renderOrder = 997;
  const trail = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0, -0.5, 0), ovl({ map: trailTex })); trail.renderOrder = 996;      // 原点在火花，往 −Y 拖
  camB.add(trail, sparkHalo, sparkCore);
  const TRAIL_END = SPARK_END.trail;
  const _sp = V3(), _sq = V3(), wireC = new THREE.Color();
  function drawB(T) {
    const inFuse = T >= C3V.fuse, kf = T - C3V.fuse, fly = Math.max(0, kf - IGN);
    const lightK = inFuse ? 1 - seg(T, 104.3, 105.2) : 1;
    hemiB.intensity = 0.2 * lightK; moonB.intensity = 0.9 * lightK; clipMatB.envMapIntensity = 0.42 * lightK;
    const black = seg(T, 105.1, C3V.dark); sB.background.set(NIGHT).lerp(new THREE.Color('#000000'), black); sB.fog.color.copy(sB.background); farMat.uniforms.uFog.value.copy(sB.background);
    // 按钮：③ 亮着（随拍呼吸）；⑤ 是拍下去的，点着那一下闪一下，然后暗下去
    const glow = inFuse ? 0.35 + 0.9 * Math.exp(-kf * 6) : 1;
    btn.position.set(BTN.x, BTN.y - (inFuse ? 0.13 : 0), BTN.z);
    btnMat.color.copy(hdr('#ff1a2e', 2.4 * glow * (0.85 + 0.15 * kick(T, 0.25)) * (inFuse ? lightK * 0.8 + 0.2 : 1)));
    redLight.intensity = 34 * glow * (0.85 + 0.15 * kick(T, 0.25)) * lightK;
    updateFar(T, lightK); updateSky(T);
    // 引线 / 火花 / 火星 / 速度线
    sparkAt(T, _sp); const sy = _sp.y, vel = inFuse && kf > IGN ? 7 + 32 * fly : 0;
    rope.visible = inFuse; rope.position.set(ROOT_P.x, sy, ROOT_P.z); rope.scale.set(1, 260, 1); rope.material.color.set('#c9a25c').multiplyScalar(0.12 + 0.5 * lightK);
    sparkLight.intensity = inFuse ? (9 + 3 * Math.sin(T * 50)) * (1 - 0.6 * black) : 0; sparkLight.position.copy(_sp);
    emb.visible = inFuse;
    if (inFuse) { for (let i = 0; i < EMB_N; i++) { const ph = (T * 2.6 + hash(i, 61)) % 1, age = ph * 0.55, a = hash(i, 62) * 6.283, sp = 0.6 + 2.2 * hash(i, 64);
      sparkAt(T - age, p3); const burst = kf < 0.5 ? 2.2 : 1;
      p3.x += Math.cos(a) * sp * age * burst; p3.z += Math.sin(a) * sp * age * burst; p3.y += (1.5 * hash(i, 63) * burst - 0.3) * age - 5 * age * age;
      e.set(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5); emb.setMatrixAt(i, age > kf || p3.y < 0 && kf > 0.6 ? ZERO : m4.compose(p3, q.setFromEuler(e), s3.setScalar(1.6 * (1 - ph)))); } emb.instanceMatrix.needsUpdate = true; }
    sl.visible = inFuse && fly > 0.25; sl.material.color.copy(hdr('#b9c6ff', lerp(0.35, 0.9, seg(fly, 0.25, 1.2))));
    // 镜头
    if (!inFuse) { const u = seg(T, C3V.button, C3V.comic + 0.1), x = lerp(2.2, 0.9, u), z = lerp(15.5, 5.2, u);
      camB.fov = lerp(40, 34, u); camB.up.set(0, 1, 0); camB.position.set(x, Math.max(lerp(0.55, 0.8, u), dune(x, z) + 0.42), z); camB.lookAt(0, lerp(1.6, 1.0, u), 0);
    } else {
      // 0–IGN：贴地近景，底座根部点着（震）→ 火花窜上去，镜头先仰着追（甩），再整个跟着升上去，越退越远
      const f = seg(fly, 0.08, 0.75), D = lerp(3.6, 9.5, seg(fly, 0, 1.7)), dir = V3(0.78, 0, 0.62);
      const camY = lerp(0.6, sy, f), sh = 0.09 * Math.exp(-kf * 7) * Math.sin(kf * 85);
      camB.fov = lerp(34, 52, seg(fly, 0, 0.5)); camB.up.set(0.12 * Math.exp(-fly * 4) * Math.sin(kf * 30), 1, 0).normalize();
      const cx = ROOT_P.x + dir.x * D, cz = ROOT_P.z + dir.z * D;
      camB.position.set(cx + sh, Math.max(camY, dune(cx, cz) + 0.5) + sh * 0.6, cz);
      const off = (SPARK_END.y - 0.5) * 2 * Math.tan(camB.fov * Math.PI / 360) * D * f;     // 跟上之后火花落在 SPARK_END.y
      camB.lookAt(_sp.x, lerp(lerp(0.35, sy, seg(fly, 0, 0.12)), sy + off, f), _sp.z);
    }
    camB.updateProjectionMatrix(); camB.updateMatrixWorld(true);
    // 火花和拖尾（画在镜头上）
    sparkCore.visible = sparkHalo.visible = trail.visible = inFuse;
    if (inFuse) { const n = _sq.copy(_sp).project(camB), w = seg(T, 105.5, 105.85), nx = lerp(n.x, SPARK_END.x * 2 - 1, w), ny = lerp(n.y, 1 - SPARK_END.y * 2, w);
      const Dz = 2, hh = Math.tan(camB.fov * Math.PI / 360) * Dz, ig = Math.exp(-kf * 9), r = SPARK_END.r * 2 * hh * (1 + 0.25 * Math.sin(T * 70) * (1 - w) + 0.08 * Math.sin(T * 41) + 3 * ig);
      sparkCore.material.color.copy(hdr(SPARK_FIRE.core, 6)).lerp(hdr(SPARK_END.core, 4), w); sparkHalo.material.color.copy(hdr(SPARK_FIRE.halo, 1.6)).lerp(hdr(SPARK_END.halo, 1.0), w);
      sparkCore.position.set(nx * hh * camB.aspect, ny * hh, -Dz); sparkHalo.position.copy(sparkCore.position); sparkCore.scale.setScalar(r); sparkHalo.scale.setScalar(r * lerp(8, 4, w));
      // 拖尾：朝 0.07 s 前的位置拖，长度随速度；最后收成朝正下方、长 TRAIL_END
      const pv = sparkAt(T - 0.07, V3()).project(camB), dx = (pv.x - n.x) * camB.aspect, dy = pv.y - n.y, len = clamp(Math.hypot(dx, dy) * 0.5, 0, 0.3) * seg(fly, 0, 0.1);
      const ang = lerp(Math.atan2(dx, -dy), 0, w), L = lerp(len, TRAIL_END, w) * 2 * hh;
      trail.position.copy(sparkCore.position); trail.rotation.z = ang; trail.scale.set(r * 2.6, Math.max(L, 1e-4), 1); trail.material.color.copy(hdr(SPARK_FIRE.halo, 2.2)).lerp(hdr('#ffb8d0', 1.6), w); }
    updateCaption(T, camB, capB);
    const cutIn = inFuse ? Math.max(0, 1 - kf / 0.2) : Math.max(0, 1 - (T - C3V.button) / 0.14), whip = inFuse ? Math.exp(-Math.abs(fly - 0.2) * 9) : 0;
    return { scene: sB, camera: camB, post: { dither: 1.2, bloom: { strength: 0.75 + 0.5 * cutIn, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + 0.15 * kick(T) * (1 - black) + 0.55 * cutIn + 0.35 * whip, grade: { vignette: 0.4 * (1 - black) }, flash: cutIn > 0 ? { amount: (inFuse ? 0.6 : 0.85) * cutIn, color: inFuse ? '#fff1c8' : '#dfe3ea' } : 0 } };
  }

  // ================================================================ 漫画页（④）：四格
  const KEYS = ['k1', 'k2', 'k3', 'k4'], I = {};
  await Promise.all(KEYS.map(async k => { try { const im = new Image(); im.src = new URL(`${k}.png`, KDIR).href; await im.decode(); I[k] = im; } catch { I[k] = null; } }));
  // 每张关键画在格子里取哪一块：[中心 x, 中心 y（0–1，图上）, 取图高的多少]
  const FRAME = { k1: [0.5, 0.42, 0.82], k2: [0.56, 0.4, 0.74], k3: [0.5, 0.5, 1.0], k4: [0.5, 0.5, 1.0] };
  const K4 = { src: [0.3, 0.24, 0.65, 0.38], top: 0.4, root: [0.685, 0.9], ropeX: 0.76, ign: 0.1 };      // 第 4 格：按钮图取哪一块（放在格子下 60%）、引线根部和竖直段在格子里的位置、点着后停多久起飞
  const cover = (c, b, k, z = 1, dx = 0, dy = 0) => {
    const im = I[k]; if (!im) { c.fillStyle = '#2a2c44'; c.fillRect(0, 0, b.w, b.h); c.fillStyle = '#fff'; c.font = '60px sans-serif'; c.fillText(k, 40, 90); return; }
    const [fx, fy, fh] = FRAME[k], sh = im.height * fh / z, sw = sh * b.w / b.h;
    const sx = clamp(im.width * (fx + dx) - sw / 2, 0, Math.max(0, im.width - sw)), sy = clamp(im.height * (fy + dy) - sh / 2, 0, Math.max(0, im.height - sh));
    c.drawImage(im, sx, sy, Math.min(sw, im.width), Math.min(sh, im.height), 0, 0, b.w, b.h);
  };
  const caption = (c, b, T, list, fx, fy, hp) => {                    // 旁白框：逐词出现（歌词）
    const shown = list.filter(([, t]) => T >= t); if (!shown.length) return;
    const fs = b.h * hp; c.font = `${fs}px ${CF.bang}`;
    const txt = shown.map(([w]) => w).join(' '), full = list.map(([w]) => w).join(' '), w = c.measureText(full).width + fs * 0.9, h = fs * 1.55, x = b.w * fx, y = b.h * fy;
    const k = T - shown.at(-1)[1], z = 1 + 0.12 * Math.exp(-k * 18);
    c.save(); c.translate(x + w / 2, y + h / 2); c.scale(z, z); c.translate(-w / 2, -h / 2);
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(8, 10, w, h); c.fillStyle = PAL.lemon; c.fillRect(0, 0, w, h); c.lineWidth = fs * 0.09; c.strokeStyle = PAL.ink; c.strokeRect(0, 0, w, h);
    c.fillStyle = PAL.ink; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(txt, fs * 0.45, h / 2 + fs * 0.05); c.restore();
  };
  const jitter = (c, a, T, s = 1) => c.translate(a * Math.sin(T * 91 * s), a * Math.cos(T * 77 * s));
  const gw = i => wt(L.go, i), fw = i => wt(L.fuse, i);
  const TP = { p1: C3V.comic, p2: gw(3) - 0.02, p3: fw(0) - 0.02, p4: fw(3) - 0.04 };      // 每格出现的时刻：now / left / too / we
  const comic = await createComic(mv, { w: 20, h: 11.25, seed: 71 });
  const sC = new THREE.Scene(); sC.background = new THREE.Color('#0b0a14'); sC.add(comic.group); comic.group.rotation.set(-0.03, 0.025, 0.006);
  const camC = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const RC = { p1: [0.018, 0.03, 0.474, 0.455], p2: [0.508, 0.03, 0.474, 0.455], p3: [0.018, 0.515, 0.474, 0.455], p4: [0.508, 0.515, 0.474, 0.455] };
  // ① 齐胸往前挤（画面往右）
  comic.panel({ id: 'p1', rect: RC.p1, reveal: { at: TP.p1 - 0.01, kind: 'none' }, border: 'ink', borderW: 12, dim: { at: TP.p3, amount: 0.25 },
    layers: [{ depth: 0.25, draw: (c, b, T) => { const k = T - TP.p1, step = 0.012 * Math.sin(k * Math.PI * 2 / 0.4545);        // 一拍一顶
        c.save(); jitter(c, kick(T, 0.1) * 3, T); cover(c, b, 'k1', lerp(1.06, 1.12, smooth(k / 1.4)), -0.02 + 0.03 * smooth(k / 1.4) + step, 0); c.restore();
        CX.speedLines(c, b, T, { angle: 180, n: 26, color: '#ffffff', width: 3, speed: 2.2, seed: 5, alpha: 0.35, gap: 0.5 }); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['NOW', gw(0)], ["THERE'S", gw(1)], ['NOWHERE', gw(2)]], 0.04, 0.06, 0.1); } }] });
  // ② 伸手
  comic.panel({ id: 'p2', rect: RC.p2, reveal: { at: TP.p2, kind: 'slide', dir: 'l', dur: 0.14 }, border: 'ink', borderW: 12, depth: 0.03, dim: { at: TP.p3, amount: 0.25 },
    layers: [{ depth: 0.22, draw: (c, b, T) => { const k = T - TP.p2;
        c.save(); jitter(c, kick(T, 0.08) * 2.5, T, 0.8); cover(c, b, 'k2', lerp(1.0, 1.1, smooth(k / 0.9)), 0.02 * smooth(k / 0.9), 0); c.restore();
        CX.speedLines(c, b, T, { angle: 0, n: 30, color: '#ffffff', width: 3, speed: 4, seed: 9, alpha: 0.4, gap: 0.45 }); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['LEFT', gw(3)], ['TO', gw(4)], ['GO', gw(5)]], 0.04, 0.06, 0.1); } }] });
  // ③ 啪：拍下按钮
  comic.panel({ id: 'p3', rect: RC.p3, reveal: { at: TP.p3, kind: 'drop', dur: 0.12 }, border: 'ink', borderW: 14, depth: 0.07, dim: { at: TP.p4 + 0.2, amount: 0.2 },
    layers: [{ depth: 0.25, draw: (c, b, T) => { const k = T - TP.p3;
        c.save(); jitter(c, 16 * Math.exp(-k * 8), T, 1.5); cover(c, b, 'k3', 1.12 - 0.1 * (1 - Math.exp(-k * 14))); c.restore();
        CX.focusLines(c, b, T, { fx: 0.5, fy: 0.55, inner: 0.3 + 0.12 * Math.exp(-k * 7), n: 64, color: '#ffffff', alpha: 0.75 * Math.exp(-k * 2.2) + 0.15 }); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['TOO', fw(0)], ['LATE', fw(1)], ['NOW', fw(2)]], 0.04, 0.06, 0.1); } }] });
  // ④ 引线在底座根部点着，火花沿着引线往上冲（按钮是同一张定稿按钮图；引线、火花、拖尾、速度线是代码画的，火花真的在格子里往上窜）
  const p4Spark = (T, b) => { const k = T - TP.p4 - K4.ign, u = clamp(k / (C3V.fuse - TP.p4 - K4.ign)); return k < 0 ? [K4.root[0] * b.w, K4.root[1] * b.h, 0] : [lerp(K4.root[0], K4.ropeX, smooth(u * 4)) * b.w, lerp(K4.root[1], -0.12, u * u * 0.75 + u * 0.25) * b.h, u]; };
  comic.panel({ id: 'p4', rect: RC.p4, reveal: { at: TP.p4, kind: 'pop', dur: 0.14 }, border: 'ink', borderW: 14, depth: 0.1,
    layers: [{ depth: 0.25, draw: (c, b, T) => { const k = T - TP.p4, fl = 0.5 + 0.5 * Math.sin(T * 47) * Math.sin(T * 31), [sx, sy, u] = p4Spark(T, b), lit = k >= K4.ign * 0.3;
        c.save(); jitter(c, 6 * Math.exp(-k * 9) + (lit ? 2.5 * fl : 0), T, 1.2);
        CX.sky(c, { x: 0, y: 0, w: b.w, h: b.h }, [[0, '#0d0b2e'], [0.5, '#241a5e'], [1, '#3a2470']]); CX.tone(c, { x: 0, y: 0, w: b.w, h: b.h * 0.5 }, { color: '#5a48b0', step: 12, grad: [0.0, 0.3], alpha: 0.5 });
        const im = I.k4; if (im) c.drawImage(im, im.width * K4.src[0], im.height * K4.src[1], im.width * K4.src[2], im.height * K4.src[3], 0, b.h * K4.top, b.w, b.h * (1 - K4.top));
        // 引线：从底座根部拐上去，笔直伸出格子上沿；烧过的一段是焦的
        const rope = (y0, y1, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(K4.root[0] * b.w, K4.root[1] * b.h); c.quadraticCurveTo(K4.ropeX * b.w, K4.root[1] * b.h, K4.ropeX * b.w, (K4.root[1] - 0.14) * b.h); c.lineTo(K4.ropeX * b.w, y1); c.stroke(); };
        c.save(); c.beginPath(); c.rect(0, -50, b.w, sy + 50); c.clip(); rope(0, -50, PAL.ink, b.h * 0.034); rope(0, -50, '#d0a252', b.h * 0.02);
        c.strokeStyle = '#7a5a22'; c.lineWidth = b.h * 0.006; for (let y = (K4.root[1] - 0.16) * b.h; y > -20; y -= b.h * 0.03) { c.beginPath(); c.moveTo(K4.ropeX * b.w - b.h * 0.009, y); c.lineTo(K4.ropeX * b.w + b.h * 0.009, y - b.h * 0.012); c.stroke(); } c.restore();
        c.save(); c.beginPath(); c.rect(0, sy, b.w, b.h); c.clip(); rope(0, -50, '#1a1210', b.h * 0.022); c.restore();
        if (lit) {
          CX.speedLines(c, b, T, { angle: 90, n: 34, color: '#ffffff', width: 3, speed: 5, seed: 13, alpha: 0.2 + 0.5 * u, gap: 0.4 });
          // 拖尾 + 火星 + 火花
          const tl = b.h * (0.06 + 0.5 * u), g = c.createLinearGradient(0, sy, 0, sy + tl); g.addColorStop(0, 'rgba(255,250,220,0.95)'); g.addColorStop(0.25, 'rgba(255,190,60,0.8)'); g.addColorStop(1, 'rgba(255,90,40,0)');
          c.fillStyle = g; c.beginPath(); c.moveTo(sx - b.h * 0.035, sy); c.lineTo(sx + b.h * 0.035, sy); c.lineTo(sx, sy + tl); c.closePath(); c.fill();
          for (let i = 0; i < 26; i++) { const ph = (T * 3 + hash(i, 41)) % 1, a = hash(i, 42) * 6.283, d = b.h * (0.03 + 0.2 * ph) * (0.5 + hash(i, 43)); c.fillStyle = `rgba(255,${180 + 60 * hash(i, 44) | 0},80,${1 - ph})`; c.fillRect(sx + Math.cos(a) * d * 0.7, sy + Math.abs(Math.sin(a)) * d * 1.2 + ph * tl * 0.5, b.h * 0.012, b.h * 0.012); }
          const R0 = b.h * (0.075 + 0.02 * fl + 0.12 * Math.exp(-Math.max(0, k - K4.ign * 0.3) * 12)); c.save(); c.translate(sx, sy); c.rotate(T * 9);
          c.fillStyle = PAL.ink; c.beginPath(); for (let i = 0; i < 20; i++) { const a = i / 20 * 6.283, r = (i % 2 ? 0.5 : 1.12) * R0; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
          c.fillStyle = '#ffd23a'; c.beginPath(); for (let i = 0; i < 20; i++) { const a = i / 20 * 6.283, r = (i % 2 ? 0.42 : 1) * R0; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
          c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, 0, R0 * 0.36, 0, 6.283); c.fill(); c.restore();
          const gl = c.createRadialGradient(sx, sy, 4, sx, sy, b.w * 0.4); gl.addColorStop(0, `rgba(255,220,130,${0.3 + 0.2 * fl})`); gl.addColorStop(1, 'rgba(255,180,60,0)'); c.fillStyle = gl; c.fillRect(0, 0, b.w, b.h);
        }
        c.restore(); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['WE', fw(3)], ['LIT', fw(4)]], 0.04, 0.06, 0.1); } }] });
  comic.sfx({ text: 'SLAM!', x: 0.39, y: 0.9, size: 0.085, at: TP.p3 + 0.02, color: PAL.pink, stroke: PAL.ink, angle: -8, shake: 1 });
  comic.shock({ x: 0.255, y: 0.76, at: TP.p3, dur: 0.4, radius: 3.0, color: '#ffffff' });
  comic.sfx({ text: 'FWOOSH!', x: 0.62, y: 0.75, size: 0.06, at: TP.p4 + K4.ign + 0.06, color: PAL.lemon, stroke: PAL.ink, angle: -78, shake: 1 });
  const rootPage = [RC.p4[0] + RC.p4[2] * K4.root[0], RC.p4[1] + RC.p4[3] * K4.root[1]], ropePX = RC.p4[0] + RC.p4[2] * K4.ropeX;
  comic.light({ x: rootPage[0], y: rootPage[1] - 0.1, z: 0.9, color: '#ffc060', intensity: 3.2, radius: 10, at: TP.p4 + K4.ign * 0.3, until: C3V.fuse + 0.2 });
  comic.shock({ x: rootPage[0], y: rootPage[1], at: TP.p4 + K4.ign * 0.3, dur: 0.35, radius: 2.2, color: '#ffd070' });
  comic.sparks({ from: rootPage, to: [ropePX, RC.p4[1] - 0.12], at: TP.p4 + K4.ign, dur: C3V.fuse - TP.p4 - K4.ign, n: 60, color: '#ffd070', arc: 0.1, burst: true, out: true });
  const keysC = [
    { t: C3V.comic, target: RC.p1, yaw: 1, pitch: 0, margin: 0.99 }, { t: TP.p2 - 0.08, target: RC.p1, yaw: 2, pitch: -1, margin: 1.03 },
    { t: TP.p2 + 0.16, target: RC.p2, yaw: -1, pitch: 0, margin: 1.0 }, { t: TP.p3 - 0.08, target: RC.p2, yaw: -2, pitch: 1, margin: 1.03 },
    { t: TP.p3 + 0.14, target: RC.p3, yaw: 2, pitch: -2, margin: 1.0 }, { t: TP.p4 - 0.06, target: RC.p3, yaw: 2, pitch: -2, margin: 1.03 },
    { t: TP.p4 + 0.14, target: RC.p4, yaw: -2, pitch: -1, margin: 1.0 }, { t: C3V.fuse - 0.16, target: RC.p4, yaw: -2, pitch: 2, margin: 1.02 },
    { t: C3V.fuse, target: [ropePX - 0.17, RC.p4[1] - 0.1, 0.34, 0.33], yaw: -3, pitch: 8, roll: -2, margin: 1.0 },      // 最后跟着火花甩出格子上沿
  ];
  function drawC(T) {
    comic.camPath(camC, T, keysC);
    const kS = T - TP.p3, pop = kS >= 0 ? Math.exp(-kS * 9) : 0; camC.position.x += 0.16 * pop * Math.sin(kS * 80); camC.position.y += 0.1 * pop * Math.cos(kS * 63);
    camC.updateMatrixWorld(); comic.update(T, { camera: camC }); comic.group.updateMatrixWorld(true); comic.update(T, { camera: camC });      // 跑两遍：乱序 seek 才一致（同 v4-03b）
    const flood = seg(T, C3V.fuse - 0.12, C3V.fuse), inn = Math.max(0, 1 - (T - C3V.comic) / 0.14);
    return { scene: sC, camera: camC, post: { bloom: { strength: 0.45 + 0.5 * flood, threshold: 1.0 }, grade: { vignette: 0.28 }, chroma: 0.06 + 0.3 * pop,
      flash: flood > 0 ? { amount: 0.8 * flood, color: '#ffe9b0' } : { amount: Math.max(0.3 * pop, 0.6 * inn), color: '#ffffff' } } };
  }

  return function draw(T) {
    const r = T < C3V.button ? drawA(T) : T < C3V.comic ? drawB(T) : T < C3V.fuse ? drawC(T) : drawB(T);
    mv.stage.render(r.scene, r.camera, r.post);
  };
}
