// shots/c3-v7.js — 副歌 3 第七版（歌曲时间 95.40–105.96）。#1070，分镜 fresh/v4-rest/c3/plan-v7-用户.md
//
//   const draw = await makeC3V7(mv);  mv.mount(draw, { offset: C3V.t0, duration: C3V.end - C3V.t0 });     // c3-v7-half.html
//
//   ① 95.40 接主歌 3 出口（shots/v3-v4.js 最后一帧：正上方 8.7 身高俯拍、fov 32、up = −Z、她仰面下落 14 身高/s，脚下同一座夜城）：
//            脚下的楼一栋栋化成回形针、塌下去，回形针从街上漫上来
//   ② 96.84 她扎进回形针海：只溅起一圈、合拢，不拍她在里面；回形针从上方继续倒下来，水面一路涨到镜头跟前
//   ③ 98.82 只拍红按钮：回形针海上一座高台，一颗亮着的红色大按钮，镜头贴着海面慢慢推过去
//   ④ 100.72 漫画页四格：齐胸往前挤 → 伸手 → 啪地拍下按钮 → 按钮裂开，里面是一根点着的引线
//   ⑤ 103.72「fuse」：火花从格子里烧出来变成 3D，沿着引线在回形针海上一路烧过去，四周的灯一片片灭
//      105.69–105.96 全黑，只剩一粒火花（位置 / 大小 / 颜色见 SPARK_END，桥段从这里接）
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
export const SPARK_END = { x: 0.498, y: 0.611, r: 0.0075, core: '#f2eaf1', halo: '#ffd6e4' };      // = 0x58ad 桥段第一帧量出来的数（seq 385）
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
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
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

  // ================================================================ 场景 B：回形针海上的红按钮（③）+ 引线一路烧过去（⑤）
  const NIGHT = '#05060e';
  const sB = new THREE.Scene(); sB.background = new THREE.Color(NIGHT); sB.fog = new THREE.FogExp2(NIGHT, 0.042);
  const camB = new THREE.PerspectiveCamera(36, mv.width / mv.height, 0.05, 800); sB.add(camB);
  const capB = capMesh(camB);
  const hemiB = new THREE.HemisphereLight('#7f8ad0', '#0c0a18', 0.22), moonB = new THREE.DirectionalLight('#9fb0ff', 0.55); moonB.position.set(-6, 9, -4); sB.add(hemiB, moonB, moonB.target);
  const clipMatB = metal({ color: '#aeb0bc', roughness: 0.36 });
  // 引线：从按钮里出来，顺着高台垂到海面，在回形针海上弯弯曲曲伸向远处
  const BTN = V3(0, 1.02, 0);
  const fusePath = new THREE.CatmullRomCurve3([V3(0, 1.3, 0), V3(0.5, 1.22, 0.3), V3(1.02, 0.86, 0.62), V3(1.25, 0.3, 0.85), V3(1.9, 0.07, 1.6), V3(2.6, 0.07, 3.4), V3(1.2, 0.07, 7), V3(-2.0, 0.07, 12), V3(-1.2, 0.07, 20), V3(3, 0.07, 31), V3(2, 0.07, 46), V3(-3, 0.07, 64), V3(0, 0.07, 90), V3(4, 0.07, 130)], false, 'catmullrom', 0.5);
  const FUSE_LEN = fusePath.getLength();
  // 海：高台周围 + 引线沿途铺真回形针，再远是贴图平面 + 雾
  { const N = 56000, rnd = mulberry32(9), mesh = new THREE.InstancedMesh(clipGeo, clipMatB, N); mesh.frustumCulled = false; const pt = V3();
    for (let i = 0; i < N; i++) {
      let x, z; if (rnd() < 0.5) { const a = rnd() * 6.283, r = 11 * Math.sqrt(rnd()); x = Math.cos(a) * r; z = Math.sin(a) * r + 2.5; } else { fusePath.getPointAt(0.03 + 0.45 * rnd() ** 1.3, pt); const a = rnd() * 6.283, r = 5.5 * Math.sqrt(rnd()); x = pt.x + Math.cos(a) * r; z = pt.z + Math.sin(a) * r; }
      const inPlat = Math.hypot(x, z) < 1.12;
      e.set(-Math.PI / 2 + (rnd() - 0.5) * 0.8, rnd() * 6.283, (rnd() - 0.5) * 0.8, 'YXZ');
      mesh.setMatrixAt(i, m4.compose(p3.set(x, 0.03 * Math.sin(x * 0.7) * Math.cos(z * 0.5) - rnd() * 0.15, z), q.setFromEuler(e), s3.setScalar(inPlat ? 0 : lerp(1.1, 1.8, rnd())))); mesh.setColorAt(i, tintOf(rnd())); }
    sB.add(mesh);
    const t2 = clipTex.clone(); t2.needsUpdate = true; t2.repeat.set(150, 150);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ map: t2, color: '#9a9cb0', metalness: 0.6, roughness: 0.5 })); plane.rotation.x = -Math.PI / 2; plane.position.y = -0.2; sB.add(plane); }
  // 高台 + 红按钮（⑤ 里按钮裂成几瓣翻开，引线从里面伸出来）
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.4, ...o });
  { const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); sB.add(m); return m; };
    add(new THREE.CylinderGeometry(1.05, 1.2, 1.3, 40), std('#2a2a3a'), 0, 0.2, 0);
    add(new THREE.CylinderGeometry(1.07, 1.07, 0.05, 40), std('#3a3a4c'), 0, 0.86, 0);
    add(new THREE.CylinderGeometry(0.74, 0.82, 0.2, 40), std('#15151f', { metalness: 0.7 }), 0, 0.96, 0); }
  const btnMat = new THREE.MeshBasicMaterial({ fog: false, toneMapped: false });
  const SHARDS = Array.from({ length: 6 }, (_, i) => { const a0 = i / 6 * Math.PI * 2, g = new THREE.Group(), piv = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 10, a0, Math.PI * 2 / 6, 0, Math.PI / 2), btnMat); m.material.side = THREE.DoubleSide;
    const am = a0 + Math.PI / 6, rim = V3(Math.cos(am) * 0.62, 0, -Math.sin(am) * 0.62);          // SphereGeometry 的 phi：x = −cos·sin，z = sin·sin → 这一瓣朝 (−cos am, 0, sin am)
    rim.set(-Math.cos(am) * 0.62, 0, Math.sin(am) * 0.62); m.position.copy(rim).multiplyScalar(-1); piv.position.copy(rim); piv.add(m); g.position.copy(BTN); g.add(piv); sB.add(g);
    return { piv, axis: V3(rim.z, 0, -rim.x).normalize(), h: hash(i, 71) }; });
  const redLight = new THREE.PointLight('#ff2030', 0, 16, 1.5); redLight.position.set(0, 1.9, 0.4); sB.add(redLight);
  // 远处还露在海面上的楼：亮着窗，⑤ 里一片片灭
  const FAR = []; { const rnd = mulberry32(61); for (let i = 0; i < 46; i++) { const a = rnd() * 6.283, r = 26 + 60 * rnd(); FAR.push({ x: Math.cos(a) * r, z: Math.sin(a) * r + 10, w: 5 + 5 * rnd(), d: 5 + 5 * rnd(), h: 3 + 13 * rnd(), a }); } }
  const farMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ map: cityTex }), FAR.length); farMesh.frustumCulled = false; sB.add(farMesh);
  FAR.forEach((b, i) => farMesh.setMatrixAt(i, m4.compose(p3.set(b.x, -0.3, b.z), q.identity(), s3.set(b.w, b.h, b.d))));
  // 一片片灭：按方位分 5 片，各有熄灭时刻（闪几下再灭）
  const SECT_OFF = [104.05, 104.4, 104.72, 105.0, 105.22], sectOf = b => Math.floor(((b.a + 1.3) % 6.283) / 6.283 * 5);
  const farOn = (b, i, T) => { const k = T - SECT_OFF[sectOf(b)] - 0.08 * hash(i, 81); return k > 0 ? 0 : k > -0.3 ? (hash(i, Math.floor(T * 24)) > 0.5 ? 1 : 0.15) : 1; };
  // 引线本体（一段段小方块，颜色随烧到哪儿变）+ 火花
  const WIRE_N = 420, wire = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.05, 1), new THREE.MeshBasicMaterial({ toneMapped: false }), WIRE_N); wire.frustumCulled = false; sB.add(wire);
  const WIRE_U = 0.62;                                           // 只做前 62%（再远镜头里看不到）
  { const a = V3(), b = V3(), mid = V3(), look = new THREE.Matrix4();
    for (let i = 0; i < WIRE_N; i++) { fusePath.getPointAt(i / WIRE_N * WIRE_U, a); fusePath.getPointAt((i + 1) / WIRE_N * WIRE_U, b); mid.copy(a).add(b).multiplyScalar(0.5);
      q.setFromRotationMatrix(look.lookAt(a, b, Math.abs(b.y - a.y) > 0.9 * a.distanceTo(b) ? V3(1, 0, 0) : V3(0, 1, 0))); wire.setMatrixAt(i, m4.compose(mid, q, s3.set(1, 1, a.distanceTo(b) + 0.01))); } }
  const sparkS = T => { const k = Math.max(0, T - C3V.fuse); return Math.min(FUSE_LEN * WIRE_U, 2.0 * k + 8.5 * k * k); };      // 火花烧过的弧长：越烧越快
  const sparkAt = (T, out) => fusePath.getPointAt(clamp(sparkS(T) / FUSE_LEN, 0, 1), out);
  const sparkLight = new THREE.PointLight('#ff7a30', 0, 6, 1.4); sB.add(sparkLight);
  const SPK_N = 70, spk = new THREE.InstancedMesh(new THREE.BoxGeometry(0.014, 0.014, 0.09), new THREE.MeshBasicMaterial({ color: hdr('#ffc060', 4), fog: false, toneMapped: false }), SPK_N); spk.frustumCulled = false; sB.add(spk);
  // 火花本体画在镜头上（屏幕位置 = 它在世界里的投影；最后 0.6 s 收到 SPARK_END，保证和桥段对得上）
  const haloTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
  const sparkCore = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color: hdr(SPARK_FIRE.core, 6), depthTest: false, depthWrite: false, fog: false, toneMapped: false })); sparkCore.renderOrder = 998;
  const sparkHalo = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: haloTex, color: hdr(SPARK_FIRE.halo, 1.6), transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); sparkHalo.renderOrder = 997;
  camB.add(sparkHalo, sparkCore);
  const _sp = V3(), _sq = V3(), _dir = V3(), wireC = new THREE.Color(), farC = new THREE.Color();
  function drawB(T) {
    const inFuse = T >= C3V.fuse, kf = T - C3V.fuse;
    const lightK = inFuse ? 1 - seg(T, 104.25, 105.3) : 1;                                     // 月光 / 环境：⑤ 里慢慢全灭
    hemiB.intensity = 0.22 * lightK; moonB.intensity = 0.55 * lightK; clipMatB.envMapIntensity = 0.42 * lightK;
    const black = seg(T, 105.2, C3V.dark); sB.background.set(NIGHT).lerp(new THREE.Color('#000000'), black); sB.fog.color.copy(sB.background);
    // 按钮：③ 亮着（随拍呼吸）；⑤ 一开始就裂成几瓣翻开、暗下去
    const open = inFuse ? 1 - Math.exp(-kf * 9) : 0, glow = inFuse ? Math.exp(-kf * 5) : 1;
    SHARDS.forEach(s => s.piv.quaternion.setFromAxisAngle(s.axis, -open * (0.9 + 0.5 * s.h)));
    btnMat.color.copy(hdr('#ff1a2e', (0.25 + 2.6 * glow) * (0.85 + 0.15 * kick(T, 0.25))));
    redLight.intensity = 42 * glow * (0.85 + 0.15 * kick(T, 0.25));
    FAR.forEach((b, i) => farMesh.setColorAt(i, farC.setScalar(0.85 * farOn(b, i, T)))); farMesh.instanceColor.needsUpdate = true;
    // 引线和火花
    const s = sparkS(T), us = s / (FUSE_LEN * WIRE_U);
    for (let i = 0; i < WIRE_N; i++) { const ui = (i + 0.5) / WIRE_N, d = (us - ui) * FUSE_LEN * WIRE_U;
      if (!inFuse || d < 0) wireC.set('#c9a25c').multiplyScalar(inFuse ? (0.5 * lightK + 0.05) * (1 - black) : 0); else wireC.set('#ff8a30').multiplyScalar((0.02 + 1.8 * Math.exp(-d * 1.6)) * (1 - black));
      wire.setColorAt(i, wireC); }
    wire.instanceColor.needsUpdate = true; wire.visible = inFuse;
    sparkAt(T, _sp);
    const fade = 1 - seg(T, 105.3, C3V.dark);
    sparkLight.intensity = inFuse ? (3.2 + 1.2 * Math.sin(T * 50)) * fade : 0; sparkLight.position.copy(_sp).add(V3(0, 0.25, 0));
    spk.visible = inFuse && fade > 0.02;
    if (spk.visible) { for (let i = 0; i < SPK_N; i++) { const ph = (T * 3.4 + hash(i, 61)) % 1, a = hash(i, 62) * 6.283, b = hash(i, 63) * 1.5, sp = 0.5 + 1.0 * hash(i, 64);
      p3.set(_sp.x + Math.cos(a) * Math.sin(b) * sp * ph * 0.6, _sp.y + Math.cos(b) * sp * ph * 0.7 - 1.3 * ph * ph, _sp.z + Math.sin(a) * Math.sin(b) * sp * ph * 0.6);
      e.set(b, a, 0); spk.setMatrixAt(i, m4.compose(p3, q.setFromEuler(e), s3.setScalar(1.7 * (1 - ph) * fade * (hash(i, 65) < fade ? 1 : 0)))); } spk.instanceMatrix.needsUpdate = true; }
    // 镜头
    if (!inFuse) { const u = seg(T, C3V.button, C3V.comic + 0.1);
      camB.fov = lerp(38, 33, u); camB.up.set(0, 1, 0); camB.position.set(lerp(1.6, 0.5, u), lerp(0.5, 0.95, u), lerp(15.5, 5.6, u)); camB.lookAt(0, lerp(1.0, 1.15, u), 0);
    } else {
      sparkAt(T - 0.22, _sq); _dir.copy(_sp).sub(_sq); _dir.y = 0; if (_dir.lengthSq() < 1e-6) _dir.set(0.6, 0, 0.8); _dir.normalize();
      const chase = seg(T, C3V.fuse + 0.25, C3V.fuse + 1.0), far = seg(T, C3V.fuse + 0.6, 105.4);
      const pClose = V3(3.0, 1.9, 3.4), lClose = V3(0.3, 1.0, 0.25);
      const pChase = _sp.clone().addScaledVector(_dir, -lerp(4.2, 5.5, far)).add(V3(0, lerp(2.0, 2.6, far), 0)), lChase = _sp.clone().addScaledVector(_dir, lerp(2.5, 6, far)).add(V3(0, lerp(0.5, 1.4, far), 0));
      camB.fov = lerp(36, 42, chase); camB.up.set(0, 1, 0); camB.position.copy(pClose).lerp(pChase, chase); camB.lookAt(lClose.lerp(lChase, chase));
    }
    camB.updateProjectionMatrix(); camB.updateMatrixWorld(true);
    // 火花画在镜头上
    sparkCore.visible = sparkHalo.visible = inFuse;
    if (inFuse) { const n = _sq.copy(_sp).project(camB), w = seg(T, 105.25, 105.6), nx = lerp(n.x, SPARK_END.x * 2 - 1, w), ny = lerp(n.y, 1 - SPARK_END.y * 2, w);
      const D = 2, hh = Math.tan(camB.fov * Math.PI / 360) * D, r = SPARK_END.r * 2 * hh * (1 + 0.25 * Math.sin(T * 70) * (1 - w) + 0.08 * Math.sin(T * 41));
      sparkCore.material.color.copy(hdr(SPARK_FIRE.core, 6)).lerp(hdr(SPARK_END.core, 4), w); sparkHalo.material.color.copy(hdr(SPARK_FIRE.halo, 1.6)).lerp(hdr(SPARK_END.halo, 1.0), w);
      sparkCore.position.set(nx * hh * camB.aspect, ny * hh, -D); sparkHalo.position.copy(sparkCore.position); sparkCore.scale.setScalar(r); sparkHalo.scale.setScalar(r * lerp(7, 4, w)); }
    updateCaption(T, camB, capB);
    const cutIn = inFuse ? Math.max(0, 1 - kf / 0.16) : Math.max(0, 1 - (T - C3V.button) / 0.14);
    return { scene: sB, camera: camB, post: { dither: 1.2, bloom: { strength: 0.75, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + 0.15 * kick(T) * (1 - black), grade: { vignette: 0.4 * (1 - black) }, flash: cutIn > 0 ? { amount: 0.7 * cutIn, color: inFuse ? '#ffe9b0' : '#dfe3ea' } : 0 } };
  }

  // ================================================================ 漫画页（④）：四格
  const KEYS = ['k1', 'k2', 'k3', 'k4'], I = {};
  await Promise.all(KEYS.map(async k => { try { const im = new Image(); im.src = new URL(`${k}.png`, KDIR).href; await im.decode(); I[k] = im; } catch { I[k] = null; } }));
  // 每张关键画在格子里取哪一块：[中心 x, 中心 y（0–1，图上）, 取图高的多少]
  const FRAME = { k1: [0.5, 0.42, 0.82], k2: [0.52, 0.48, 0.94], k3: [0.5, 0.5, 1.0], k4: [0.56, 0.5, 0.94] };
  const K4_TIP = [0.7, 0.41];                                        // 第 4 格里火花在图上的位置（镜头最后推到这里）
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
  // ④ 按钮裂开，里面是一根点着的引线
  comic.panel({ id: 'p4', rect: RC.p4, reveal: { at: TP.p4, kind: 'pop', dur: 0.14 }, border: 'ink', borderW: 14, depth: 0.1,
    layers: [{ depth: 0.25, draw: (c, b, T) => { const k = T - TP.p4, fl = 0.5 + 0.5 * Math.sin(T * 47) * Math.sin(T * 31);
        c.save(); jitter(c, 5 * Math.exp(-k * 9) + 1.5 * fl, T, 1.2); cover(c, b, 'k4', lerp(1.0, 1.08, smooth(k / 0.5))); c.restore();
        const g = c.createRadialGradient(b.w * K4_TIP[0], b.h * K4_TIP[1], 4, b.w * K4_TIP[0], b.h * K4_TIP[1], b.w * 0.45); g.addColorStop(0, `rgba(255,240,170,${0.3 + 0.3 * fl})`); g.addColorStop(1, 'rgba(255,200,80,0)'); c.fillStyle = g; c.fillRect(0, 0, b.w, b.h); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['WE', fw(3)], ['LIT', fw(4)]], 0.04, 0.06, 0.1); } }] });
  comic.sfx({ text: 'SLAM!', x: 0.39, y: 0.9, size: 0.085, at: TP.p3 + 0.02, color: PAL.pink, stroke: PAL.ink, angle: -8, shake: 1 });
  comic.shock({ x: 0.255, y: 0.76, at: TP.p3, dur: 0.4, radius: 3.0, color: '#ffffff' });
  comic.sfx({ text: 'FSSSS', x: 0.87, y: 0.9, size: 0.06, at: TP.p4 + 0.1, color: PAL.lemon, stroke: PAL.ink, angle: 6, shake: 1 });
  const tipPage = [RC.p4[0] + RC.p4[2] * K4_TIP[0], RC.p4[1] + RC.p4[3] * K4_TIP[1]];
  comic.light({ x: tipPage[0], y: tipPage[1], z: 0.9, color: '#ffc060', intensity: 3.2, radius: 10, at: TP.p4, until: C3V.fuse + 0.2 });
  comic.sparks({ from: tipPage, to: [tipPage[0] + 0.05, tipPage[1] - 0.05], at: C3V.fuse - 0.3, dur: 0.3, n: 46, color: '#ffd070', arc: 0.6, burst: true, out: true });
  const keysC = [
    { t: C3V.comic, target: RC.p1, yaw: 1, pitch: 0, margin: 0.99 }, { t: TP.p2 - 0.08, target: RC.p1, yaw: 2, pitch: -1, margin: 1.03 },
    { t: TP.p2 + 0.16, target: RC.p2, yaw: -1, pitch: 0, margin: 1.0 }, { t: TP.p3 - 0.08, target: RC.p2, yaw: -2, pitch: 1, margin: 1.03 },
    { t: TP.p3 + 0.14, target: RC.p3, yaw: 2, pitch: -2, margin: 1.0 }, { t: TP.p4 - 0.06, target: RC.p3, yaw: 2, pitch: -2, margin: 1.03 },
    { t: TP.p4 + 0.16, target: RC.p4, yaw: -2, pitch: -1, margin: 1.0 }, { t: C3V.fuse - 0.2, target: RC.p4, yaw: -2, pitch: -1, margin: 1.02 }, { t: C3V.fuse, target: [tipPage[0] - 0.13, tipPage[1] - 0.125, 0.26, 0.25], yaw: -4, pitch: 2, roll: -2, margin: 1.0 },
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
