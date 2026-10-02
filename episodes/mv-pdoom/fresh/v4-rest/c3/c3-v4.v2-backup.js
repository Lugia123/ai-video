// shots/c3-v4.js — 副歌 3 v4（歌曲时间 94.78–109.32 s）。#1047
// 分镜：fresh/v4-rest/c3/plan.md（用户 10-02 通过）。
//
//   const shots = await makeC3V4(mv);     // c3-v4-half.html / c3-v4.html 挂；mv.mount(shots, { offset: C3.t0, duration: C3.end - C3.t0 })
//
// 一个世界：被回形针淹没的夜城（同一座城、同一台秤，kits/doom-scale.js）。
//   ① 94.78 接主歌 3 出口：正上方 8.7 俯拍、FOV 32、她仰面下落 14 /s（0xe678 seq 211 的接口）→ 95.40 背摔进楼顶回形针堆
//   ② 95.45 她身后低机位仰拍：楼那么高的 P(DOOM) 秤，回形针从天上倒进秤盘，每一拍指针跳一格 1.00 → 1.07 → 1.13，断销、裂开、ERR
//   ③ 96.84 街道：回形针潮齐腰，她往前挣；两边每扇窗被回形针从里面塞满（97.86「fill」整条街同时塞满）；街尽头那面楼的窗拼出 FILL THE ROOM
//   ④ 98.82 撞进 SAFETY 门 → 漫画页四格（唯一的 2D）：撞门 / KILLSWITCH / 空椅子 + OUT OF OFFICE / 她愣住；100.40 回形针冲破格子把整页埋掉
//   ⑤ 100.72 从回形针里钻出来升镜：她在楼顶，四周楼顶的 EXIT 灯一盏盏沉进回形针海（「哇」点）
//   ⑥ 102.46 秤崩开，碎片落进海里点着一条回形针串成的引信，火沿海面烧过她脚下这栋楼，一路烧向地平线升起的那只眼
//   ⑦ 105.69 闷响 → 霓虹全熄、冷蓝、下雨；引信的痕迹留成一条冷蓝直线
//   ⑧ 105.96 保留镜头（v4-04c 坐标轴晃腿）+ 竖轴 INTELLIGENCE / 横轴 GOALS + 竖轴高处一枚发光回形针；108.55 起镜头顺竖轴上摇，竖轴叠成 transformer 方块塔（交桥段 0x58ad）
// P(DOOM) 的读数全由外力推高（回形针压秤），她始终被动。2D 关键画只在 ④（episodes/cast-cyber-girl/closeup/killswitch/，/edit 喂设定图生成）。
// 所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { createPaperclips, mulberry32 } from '../kits/world.js';
import { textTexture } from '../kits/world4.js';
import { createDoomScale, clipTexture } from '../kits/doom-scale.js';
import { createComic, C as CC } from '../kits/comic.js';
import { initType3D } from '../kits/type3d.js';
import { ledSign } from '../kits/carriers.js';

export const ANIMS = ['move__fall-air', 'move__fall-hard-land', 'act__push-heavy', 'act__look-around', 'act__look-distance', 'act__sit-swing-legs'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

// ================================================================ 时间表（歌曲秒）
export const C3 = {
  t0: 94.78, end: 109.32,
  land: 95.40, gauge: 95.45,           // 摔进楼顶 / 切到秤
  street: 96.84, fill: 97.86,
  comic: 98.82, burst: 100.40,
  roof: 100.72,
  fuse: 102.46, boom: 105.69,
  blues: 105.96, tilt: 108.55,
};
// 出口（交桥段 0x58ad，seq 230）：109.32 这一帧。坐标 = 保留镜头场景（她身高 1，地面 y = 0，竖轴在原点）。
export const C3_EXIT = {
  T: 109.32,
  cam: { pos: [1.5, 1.7, 5.0], target: [0.15, 3.55, 0], fov: 42, up: [0, 1, 0] },
  axis: { origin: [0, 0, 0], vertTop: 4.3, horizY: 2.35, horizX: [-0.9, 4.1], radius: 0.035, color: '#3A6BFF', hdr: 2.2, arrowTop: [0, 4.3, 0] },
  labels: { y: { text: 'INTELLIGENCE', pos: [-0.2, 3.35, 0], height: 0.2 }, x: { text: 'GOALS', pos: [3.75, 2.1, 0], height: 0.2 } },
  clip: [0.16, 3.88, 0.05],
  girl: { pos: [1.35, 1.88, 0.02], yaw: 0, anim: 'act__sit-swing-legs' },
  rain: { color: '#9fb4ff', count: 700, area: [16, 8, 12] },
};
// 接口参数（0xe678 主歌 3 出口，seq 211；可调）
export const ENTRY = { camUp: 8.7, fov: 32, speed: 14, girlScreenY: 0.45 };

// ================================================================ 世界尺寸（她身高 = 1）
const HOME = V3(10, 24, 6);            // 她摔进去的那栋楼的楼顶（整个楼顶堆满回形针）
const SCALE_AT = V3(0, 30, -40);       // 秤所在那栋楼的楼顶中心
const LOT = 12;                         // 地块间距
const STREET = { x: 0, z0: 30, z1: -34 };   // ③ 的街道：沿 z 轴，x = 0；z1 = 街尽头那面「FILL THE ROOM」墙

// ================================================================ 回形针海的材质（LOD）
// 近处（离镜头 < ~8，或屏幕上一枚回形针 > 几个像素）= 一枚枚回形针的贴图；远处合成成一片有光泽的金属海面：
//   枪灰底 + 视角越斜越亮的菲涅尔反光 + 缓慢流动的粉 / 薄荷 / 柠黄霓虹反光带 + 细碎高光。不会再糊成满屏灰白雪花点。
function metalSeaMaterial(clipTex, { near = 0, bands = 1 } = {}) {
  const t = clipTex.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); t.needsUpdate = true;
  return new THREE.ShaderMaterial({
    uniforms: { uClip: { value: t }, uNear: { value: near }, uBands: { value: bands }, uBlue: { value: 0 }, uT: { value: 0 },
      uPink: { value: new THREE.Color(PAL.pink) }, uMint: { value: new THREE.Color(PAL.mint) }, uLemon: { value: new THREE.Color(PAL.lemon) } },
    extensions: { derivatives: true },
    vertexShader: /* glsl */`
      varying vec3 vW; varying vec3 vN; varying float vD;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uClip; uniform float uNear, uBlue, uT, uBands; uniform vec3 uPink, uMint, uLemon;
      varying vec3 vW; varying vec3 vN; varying float vD;
      float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }
      void main(){
        vec2 uv = vW.xz * 0.42;                                  // 贴图一块 ≈ 2.4 单位（一枚回形针约 0.2，她身高 1）
        float fw = length(fwidth(uv));                           // 屏幕上一个像素跨多少贴图：越大越远 / 越斜
        float far = max(smoothstep(6.0 + 14.0 * uNear, 16.0 + 24.0 * uNear, vD), smoothstep(0.004, 0.012, fw));
        vec3 nearC = texture2D(uClip, uv).rgb * vec3(0.8, 0.8, 0.95);
        // 远景：金属海面
        vec3 V = normalize(cameraPosition - vW);
        float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 3.0);
        float n1 = vn(vW.xz * vec2(0.035, 0.22) + vec2(uT * 0.05, -uT * 0.2)), n2 = vn(vW.xz * 0.05 - vec2(uT * 0.04, uT * 0.06));   // 反光带沿 x 拉长、很细，像灯光在金属堆上的反光条
        float band = (1.0 - smoothstep(0.0, fwidth(n1) * 1.4, abs(n1 - 0.625))) * uBands * (1.0 - smoothstep(0.03, 0.09, fwidth(n1)));   // 近地平线处线太密会闪：渐隐   // 屏幕上恒定 1–2 px 的细亮线：金属上的霓虹反光   // 细细的霓虹反光线（不是大色块）
        vec3 neon = n2 < 0.4 ? uPink : n2 < 0.7 ? uMint : uLemon;
        float glint = pow(vn(vW.xz * 1.7 + uT * 0.3), 22.0) * 1.6;
        float grain = vn(vW.xz * 0.9) * 0.08;                                            // 远处一层很淡的颗粒，读得出「是一堆东西」
        vec3 farC = vec3(0.018, 0.016, 0.042) + grain * vec3(0.35, 0.3, 0.6) + vec3(0.07, 0.06, 0.16) * fres + neon * (1.4 + 1.6 * fres) * band + vec3(0.85, 0.9, 1.0) * glint * (0.35 + fres);   // 深蓝紫夜色底
        vec3 c = mix(nearC, farC, far);
        c = mix(c, vec3(dot(c, vec3(0.3, 0.5, 0.2))) * vec3(0.35, 0.5, 1.2), uBlue);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

export async function makeC3V4(mv) {
  const { music, lyrics } = mv;
  const W = mv.width, Hh = mv.height;
  await Promise.all([loadAnims(ANIMS), initType3D(),
    new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f))]);
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 94 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { up: line("I'm upping"), clips: line('as paperclips'), pto: line('Killswitch'), go: line('Now there'), fuse: line('Too late'), blues: line('Orthogonality') };
  const wt = (ln, i) => ln.words[i].start;
  const clipTex = clipTexture(31, { size: 512, n: 300 });

  // ================================================================ 夜城（实例化楼块 + 程序化窗户；窗户可以被回形针塞满）
  const city = (() => {
    const rnd = mulberry32(77), B = [];
    for (let i = -7; i <= 7; i++) for (let j = -9; j <= 5; j++) {
      const x = i * LOT, z = j * LOT;
      if (Math.abs(x - STREET.x) < 4) continue;                       // 留出 ③ 那条街
      const w = lerp(6, 9.5, rnd()), d = lerp(6, 9.5, rnd()), r = Math.hypot(x, z + 20) / 90;
      let h = lerp(10, 26, rnd()) + 18 * Math.exp(-r * r * 3) * rnd();
      if (z > SCALE_AT.z + 4 && z < HOME.z - 2 && x > -8 && x < HOME.x + 8) h = Math.min(h, 17);   // 她的楼顶 → 秤：视线里的楼压低
      B.push({ x, z, w, d, h, id: B.length, hue: rnd(), seed: rnd() });
    }
    // 指定的几栋：她的楼、秤楼、③ 街尽头那面「FILL THE ROOM」楼
    const pin = (x, z, h, w = 8.5, d = 8.5) => { const b = B.reduce((a, q) => Math.hypot(q.x - x, q.z - z) < Math.hypot(a.x - x, a.z - z) ? q : a); Object.assign(b, { x, z, h, w, d }); return b; };
    const home = pin(HOME.x, HOME.z, HOME.y), scaleB = pin(SCALE_AT.x + 0.01, SCALE_AT.z, SCALE_AT.y, 11, 11);
    const N = B.length;
    const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    const info = new Float32Array(N * 4);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uClip: { value: clipTex }, uFill: { value: 0 }, uFillAt: { value: new THREE.Vector2(-1e9, 1) }, uLight: { value: 1 }, uSea: { value: -10 }, uFogC: { value: col('#06060b') }, uFogN: { value: 60 }, uFogF: { value: 320 },
        uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uBlue: { value: 0 } },
      vertexShader: /* glsl */`
        attribute vec4 aInfo; varying vec3 vW; varying vec3 vN; varying vec4 vI; varying vec3 vL; varying float vD;
        void main(){ vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
          vI = aInfo; vL = position; vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */`
        uniform sampler2D uClip; uniform float uFill, uLight, uSea, uFogN, uFogF, uBlue; uniform vec2 uFillAt; uniform vec3 uFogC, uPink, uMint, uLemon;
        varying vec3 vW; varying vec3 vN; varying vec4 vI; varying vec3 vL; varying float vD;
        float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
        void main(){
          vec3 n = normalize(vN);
          vec3 c = vec3(0.035, 0.032, 0.05) * (0.55 + 0.45 * max(0.0, dot(n, normalize(vec3(0.3, 0.8, 0.5)))));
          float top = step(0.7, n.y);
          vec3 neon = vI.z < 0.33 ? uPink : vI.z < 0.66 ? uMint : uLemon;
          if (top < 0.5) {
            // 侧面：窗格（宽 1.1、高 1.35），面内坐标
            float u = abs(n.x) > 0.5 ? vW.z : vW.x;
            vec2 cell = vec2(u / 1.1, vW.y / 1.35);
            vec2 ci = floor(cell), cf = fract(cell);
            float win = step(0.18, cf.x) * step(cf.x, 0.82) * step(0.22, cf.y) * step(cf.y, 0.8);
            float hh = h21(ci + vI.x * 13.7);
            float lit = step(0.42, hh) * uLight;
            vec3 wc = hh > 0.93 ? uPink : hh > 0.88 ? uMint : hh > 0.8 ? uLemon : vec3(1.0, 0.86, 0.62);
            // 塞满回形针：uFill 全城（③）+ uFillAt（x = 起始时刻偏移, y = 范围）按格子随机先后
            float f = step(h21(ci * 1.7 + vI.x * 3.1), uFill);
            vec3 clip = texture2D(uClip, cf * vec2(0.6, 0.5) + ci * 0.37).rgb * 1.6;
            c = mix(c, mix(wc * (0.4 + 0.9 * hh) * 1.3, clip, f), win * max(lit, f));
            // 楼顶边一道霓虹线
            float rim = smoothstep(0.08, 0.0, abs(vW.y - (vI.y - 0.15)));
            c += neon * rim * 2.2 * uLight;
          } else {
            c = vec3(0.05, 0.045, 0.07);
          }
          c = mix(c, vec3(dot(c, vec3(0.3, 0.5, 0.2))) * vec3(0.45, 0.6, 1.25), uBlue);
          if (vW.y < uSea) discard;                                   // 海面以下不画（海面自己画）
          float fog = smoothstep(uFogN, uFogF, vD);
          gl_FragColor = vec4(mix(c, uFogC, fog), 1.0);
        }`,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N); mesh.frustumCulled = false;
    const m4 = new THREE.Matrix4();
    B.forEach((b, i) => { info.set([b.id, b.h, b.hue, b.seed], i * 4); m4.makeScale(b.w, b.h, b.d).setPosition(b.x, 0, b.z); mesh.setMatrixAt(i, m4); b.base = b.h; });
    geo.setAttribute('aInfo', new THREE.InstancedBufferAttribute(info, 4));
    // 楼下沉（⑤ EXIT 那几栋）：dy[i] 往下挪
    function sink(dy) { B.forEach((b, i) => { m4.makeScale(b.w, b.h, b.d).setPosition(b.x, -(dy[i] ?? 0), b.z); mesh.setMatrixAt(i, m4); info[i * 4 + 1] = b.h - (dy[i] ?? 0); }); mesh.instanceMatrix.needsUpdate = true; geo.attributes.aInfo.needsUpdate = true; }
    return { mesh, mat, B, home, scaleB, sink };
  })();

  // ================================================================ 回形针海（平面，平铺贴图；海面高度 seaY）+ 近处的真回形针
  const seaMat = metalSeaMaterial(clipTex);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800, 1, 1), seaMat); sea.rotation.x = -Math.PI / 2;

  // ================================================================ 秤
  const scale = await createDoomScale();
  scale.group.position.copy(SCALE_AT);
  const scaleState = T => {
    const w = L.up.words;   // I'm 95.47 / upping 95.72 / my 96.10 / P(doom) 96.32
    const steps = [[C3.t0, 0.99], [w[1].start, 1.00], [w[2].start, 1.07], [w[3].start, 1.13]];
    let v = steps[0][1]; for (const [t, x] of steps) if (T >= t) v = x;
    // 每一跳：指针过冲一下再回
    const last = steps.filter(([t]) => T >= t).at(-1), k = T - last[0];
    v += 0.025 * Math.exp(-k * 9) * Math.sin(k * 40) * (T > steps[1][0] ? 1 : 0);
    const cracked = T < w[2].start ? 0 : T < C3.fuse ? lerp(0.55, 0.92, smooth((T - w[2].start) / 0.5)) : 1;
    const err = T >= w[3].start + 0.12;
    const pile = clamp((T - (C3.t0 - 1)) / 4);
    return { value: v, cracked, err, pile, lit: 1, glow: kick(T) };
  };

  // ================================================================ 她
  const put = (scene, T, { pos, yaw = 0, pitch = 0, roll = 0, seq, scale: s = 1 }) => {
    scene.add(girl.root); girl.root.visible = true;
    girl.root.position.copy(pos); girl.root.rotation.set(pitch, yaw, roll, 'YXZ'); girl.root.scale.setScalar(s);
    girl.play(seq, T); girl.setSkin('toon', T);
  };
  const SEQ = {
    fall: [{ t: C3.t0 - 2, anim: 'move__fall-air' }],
    land: [{ t: C3.land - 0.15, anim: 'move__fall-hard-land' }, { t: C3.land + 1.9, anim: 'act__look-distance' }],
    wade: [{ t: C3.street - 0.4, anim: 'act__push-heavy' }],
    roof: [{ t: C3.roof - 0.3, anim: 'act__look-around' }],
    fuse: [{ t: C3.fuse - 1, anim: 'act__look-distance' }],
    blues: [{ t: C3.blues - 0.3, anim: 'act__sit-swing-legs' }],
  };

  // ================================================================ 共用场景（① ② ③ ⑤ ⑥ 同一个世界）
  const scene = new THREE.Scene(); scene.background = col('#06060b');
  const hemi = new THREE.HemisphereLight('#9aa6ff', '#140c1c', 0.6); scene.add(hemi);
  const gl = createGirlLights({ key: 2.2, rim: 2.6, fill: 0.9 }); scene.add(gl);
  scene.add(city.mesh, sea, scale.group);
  // 粉月
  const moon = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.3), fog: false, toneMapped: false }));
  moon.position.set(-160, 150, -420); moon.lookAt(0, 30, 0); scene.add(moon);
  // 星
  { const rnd = mulberry32(9), n = 600, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = 0.05 + rnd() * 1.2; p.set([Math.cos(a) * Math.cos(e) * 700, Math.sin(e) * 700, Math.sin(a) * Math.cos(e) * 700], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: hdr('#ffffff', 0.9), size: 1.6, sizeAttenuation: false, fog: false }))); }
  // 楼顶回形针堆（她摔进去的那一堆）+ 下落中的回形针雨（相对她往上掠过）
  const pile = createPaperclips({ count: 2600, seed: 41, clipSize: 0.13 }); scene.add(pile.mesh);
  // 楼顶整个铺满：一块微微鼓起的回形针堆（和海面同一个着色器，近处看得出一枚枚），四边垂到楼沿外
  const roofHeap = (() => {
    const gw = city.home.w + 0.6, gd = city.home.d + 0.6, geo = new THREE.PlaneGeometry(gw, gd, 40, 40); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position, rnd = mulberry32(19);
    for (let i = 0; i < P.count; i++) { const x = P.getX(i) / (gw / 2), z = P.getZ(i) / (gd / 2), e = Math.max(Math.abs(x), Math.abs(z)); P.setY(i, 0.75 * (1 - e ** 4) + (rnd() - 0.5) * 0.12 - (e > 0.97 ? 0.5 : 0)); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, metalSeaMaterial(clipTex, { bands: 0 })); m.position.set(city.home.x, HOME.y + 0.02, city.home.z); scene.add(m); return m;
  })();
  const rain = (() => {   // 天上往下倒的回形针：一根根竖直下落，按种子循环（纯函数）
    const N = 900, rnd = mulberry32(12), m = createPaperclips({ count: N, seed: 12, clipSize: 0.13 }).mesh;
    const D = Array.from({ length: N }, () => [rnd(), rnd(), rnd(), rnd() * 6.28, rnd() * 6.28, rnd()]);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = V3(1, 1, 1), zero = new THREE.Matrix4().makeScale(0, 0, 0), p = V3();
    function update(T, { center, radius = 8, height = 30, speed = 16, density = 1, scale: sc = 1 }) {
      for (let i = 0; i < N; i++) {
        const [a, b, c, r1, r2, f] = D[i];
        if (f > density) { m.setMatrixAt(i, zero); continue; }
        const ang = a * Math.PI * 2, rr = Math.sqrt(b) * radius;
        const y = center.y + height / 2 - (((T * speed / height) + c) % 1) * height;
        p.set(center.x + Math.cos(ang) * rr, y, center.z + Math.sin(ang) * rr);
        e.set(r1 + T * 3 * (c - 0.5), r2 + T * 2.2 * (a - 0.5), 0); q.setFromEuler(e);
        m4.compose(p, q, s1.setScalar(sc)); m.setMatrixAt(i, m4);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    scene.add(m);
    return { mesh: m, update };
  })();
  // 倒进秤盘的回形针瀑布（从秤上方的天上一股往下灌）
  const pour = (() => {
    const N = 1400, rnd = mulberry32(55), m = createPaperclips({ count: N, seed: 55, clipSize: 0.6 }).mesh;
    const D = Array.from({ length: N }, () => [rnd(), rnd(), rnd(), rnd() * 6.28]);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = V3(1, 1, 1), p = V3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    function update(T, { on = 1, top, bursts = null }) {
      // bursts：每一股的开始时刻；一股 = 一团回形针从秤上方 26 处整体砸进盘里（0.4 s 落完）
      for (let i = 0; i < N; i++) {
        const [a, b, c, r] = D[i];
        if (!on) { m.setMatrixAt(i, zero); continue; }
        const spread = 1.2 + 2.6 * b;   // 越往下越散开
        let fall = ((T * 0.9 + c) % 1), y, k;
        if (bursts) {
          const t0 = bursts.filter(t => T >= t).at(-1), age = t0 === undefined ? -1 : T - t0 - c * 0.12;
          if (age < 0 || age > 0.42) { m.setMatrixAt(i, zero); continue; }
          y = top.y + 26 - 0.5 * 160 * age * age; k = 0.3 + 0.7 * b;
          if (y < top.y - 0.4) { m.setMatrixAt(i, zero); continue; }
        } else { y = top.y + 60 - fall * 62; k = clamp((top.y + 60 - y) / 60); }
        p.set(top.x + Math.cos(a * 6.28) * spread * k * 1.6, y, top.z + Math.sin(a * 6.28) * spread * k * 1.6);
        e.set(r + T * 4 * (a - 0.5), r * 2 + T * 3, 0); q.setFromEuler(e); m4.compose(p, q, s1); m.setMatrixAt(i, m4);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    scene.add(m);
    return { mesh: m, update };
  })();

  // ---------------- 霓虹字牌（场景里的载体）：黑底板 + 发光字；setLit(0..1)
  function neonSign(text, { height = 1, color = PAL.pink, board = true, pad = 0.18 } = {}) {
    const { texture, aspect } = textTexture(text, { font: FONT, px: 180, pad: 20 });
    const g = new THREE.Group(), w = height * aspect;
    if (board) { const b = new THREE.Mesh(new THREE.PlaneGeometry(w + pad * 2, height + pad * 2), new THREE.MeshBasicMaterial({ color: '#08070d', transparent: true, opacity: 0.88 })); b.position.z = -0.02; g.add(b);
      const fr = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w + pad * 2, height + pad * 2)), new THREE.LineBasicMaterial({ color: hdr(color, 1.6), toneMapped: false })); fr.position.z = -0.01; g.add(fr); g.userData.frame = fr; }
    const mat = new THREE.MeshBasicMaterial({ map: texture, color: hdr(color, 0.15), transparent: true, depthWrite: false, toneMapped: false });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, height), mat); g.add(m);
    g.userData.setLit = k => { mat.color.copy(hdr(color, lerp(0.12, 2.6, clamp(k)))); if (g.userData.frame) g.userData.frame.material.color.copy(hdr(color, lerp(0.25, 1.6, clamp(k)))); };
    g.userData.width = w + (board ? pad * 2 : 0);
    g.userData.setLit(0);
    return g;
  }
  const wordLit = (w, T, hold = 0.05) => (T >= w.start - 0.04 ? 1 : 0);
  const lineOn = (ln, T) => T >= ln.start - 0.1 && T < ln.end + 0.35;

  // ① ② 招牌：秤外圈上方「I'M UPPING MY」三块（P(DOOM) 就是表盘本身）
  const upSigns = ['I\'M', 'UPPING', 'MY'].map((s, i) => { const g = neonSign(s, { height: 3.4, color: [PAL.mint, PAL.pink, PAL.lemon][i] }); scene.add(g); return g; });
  { const dc = scale.dims; const xs = [-7.4, 0, 7.4]; upSigns.forEach((g, i) => { g.position.set(SCALE_AT.x + xs[i] * 1.05, SCALE_AT.y + dc.dialY + dc.dialR + 2.6 - Math.abs(xs[i]) * 0.12, SCALE_AT.z + 0.6); g.rotation.z = -xs[i] * 0.03; }); }

  // ③ 街道：半淹的路牌「AS PAPERCLIPS」+ 街尽头那面楼「FILL THE ROOM」（窗格按词一格格塞满回形针）
  const streetSign = (() => {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6, 12), new THREE.MeshStandardMaterial({ color: '#2c2a36', metalness: 0.7, roughness: 0.4 })); pole.position.y = 3; g.add(pole);
    const a = neonSign('AS', { height: 0.9, color: PAL.mint }), b = neonSign('PAPERCLIPS', { height: 0.9, color: PAL.lemon });
    a.position.set(-b.userData.width / 2 - 0.2, 5.3, 0.1); b.position.set(a.userData.width / 2 + 0.25, 5.3, 0.1);
    const arm = new THREE.Group(); arm.add(a, b); arm.position.x = 0.6 + b.userData.width / 2; arm.rotation.z = -0.08; g.add(arm);
    g.position.set(STREET.x - 3.2, -3.4, -1.5); g.rotation.y = 0.0; scene.add(g);   // 半淹：杆子插在回形针里，牌子在她前方左上、正对镜头
    return { g, a, b };
  })();
  const roomWall = (() => {   // 画布：一面 30 × 34 的窗格墙；FILL / THE / ROOM 三个词的格子按词塞满回形针
    const COLS = 40, ROWS = 34, cw = 48, ch = 54, cv = document.createElement('canvas'); cv.width = COLS * cw; cv.height = ROWS * ch;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    // 字的格子图：用 Anton 把三行字画到一张小画布上，按格子采样
    const mask = (() => {
      const m = document.createElement('canvas'); m.width = COLS; m.height = ROWS; const g = m.getContext('2d');
      g.fillStyle = '#000'; g.fillRect(0, 0, COLS, ROWS); g.textAlign = 'center'; g.textBaseline = 'middle';
      const words = ['FILL', 'THE', 'ROOM'], cols = ['#f00', '#0f0', '#00f'];
      words.forEach((w, i) => { g.font = `${i === 1 ? 9 : 11}px ${FONT}`; g.fillStyle = cols[i]; g.fillText(w, COLS / 2, 6 + i * 11); });
      const d = g.getImageData(0, 0, COLS, ROWS).data, out = [];
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const q = (y * COLS + x) * 4; out.push(d[q] > 90 ? 1 : d[q + 1] > 90 ? 2 : d[q + 2] > 90 ? 3 : 0); }
      return out;
    })();
    const rnd = mulberry32(6), lit = Array.from({ length: COLS * ROWS }, () => rnd());
    const clipImg = clipTex.image;
    let lastKey = '';
    function draw(T) {
      const w = L.clips.words;  // as / paperclips / fill / the / room
      const on = [w[2].start, w[3].start, w[4].start].map(t => T >= t - 0.04);
      const key = on.join();
      if (key === lastKey) return; lastKey = key;
      const g = cv.getContext('2d');
      g.fillStyle = '#0b0a12'; g.fillRect(0, 0, cv.width, cv.height);
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x, k = mask[i], X = x * cw + 10, Y = y * ch + 12, ww = cw - 20, hh = ch - 22;
        if (k && on[k - 1]) { g.drawImage(clipImg, (x * 37) % 400, (y * 53) % 400, 90, 100, X, Y, ww, hh); g.fillStyle = [0, 'rgba(244,224,77,0.35)', 'rgba(95,227,192,0.35)', 'rgba(255,46,136,0.35)'][k]; g.fillRect(X, Y, ww, hh); g.lineWidth = 3; g.strokeStyle = ['', PAL.lemon, PAL.mint, PAL.pink][k]; g.strokeRect(X, Y, ww, hh); }
        else { g.fillStyle = lit[i] > 0.55 ? `rgba(255,220,160,${0.18 + 0.3 * lit[i]})` : '#14121c'; g.fillRect(X, Y, ww, hh); }
      }
      tex.needsUpdate = true;
    }
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: hdr('#ffffff', 1.35) });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 30 * cv.height / cv.width), mat);
    m.position.set(STREET.x, 30 * cv.height / cv.width / 2 + 0.2, STREET.z1 + 4); scene.add(m);
    const back = new THREE.Mesh(new THREE.BoxGeometry(31, 36, 6), new THREE.MeshStandardMaterial({ color: '#0b0a12' })); back.position.set(STREET.x, 18, STREET.z1); scene.add(back);
    draw(0);
    return { m, back, draw };
  })();
  // ③「fill」那一拍：两边楼面上的窗被回形针塞满后，从窗里往街上涌（8 扇窗，各一股）
  const gush = (() => {
    const N = 1600, m = createPaperclips({ count: N, seed: 64, clipSize: 0.16 }).mesh, rnd = mulberry32(64);
    const W8 = Array.from({ length: 8 }, (_, i) => ({ side: i % 2 ? 1 : -1, dz: -2.5 - Math.floor(i / 2) * 2.6 - rnd() * 0.8, y: 2.2 + rnd() * 3.2, t0: C3.fill - 0.02 + rnd() * 0.14 }));
    const D = Array.from({ length: N }, (_, i) => [i % 8, rnd(), rnd(), rnd(), rnd() * 6.28]);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = V3(1, 1, 1), p = V3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    scene.add(m);
    function update(T, { zz }) {
      for (let i = 0; i < N; i++) {
        const [w, a, b, c, r] = D[i], W = W8[w], age = T - W.t0 - c * 0.35;
        if (T < C3.street || T > C3.comic || age < 0) { m.setMatrixAt(i, zero); continue; }
        const x0 = STREET.x + W.side * 7.3, z0 = zz + W.dz + (a - 0.5) * 0.8, y0 = W.y + (b - 0.5) * 0.7;
        const vx = -W.side * (2.2 + 2.4 * a), vy = 1.2 + 1.6 * b, vz = (c - 0.5) * 1.6;
        const y = Math.max(0.4, y0 + vy * age - 4.9 * age * age);
        p.set(x0 + vx * age, y, z0 + vz * age);
        e.set(r + age * 9 * (a - 0.5), r * 1.7 + age * 7, 0); q.setFromEuler(e); m4.compose(p, q, s1); m.setMatrixAt(i, m4);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    return { update };
  })();
  // ③ 结尾她撞的那扇门（街边，SAFETY）
  const safetyDoor = (() => {
    const g = new THREE.Group();
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.15), new THREE.MeshStandardMaterial({ color: '#c9c3b8', roughness: 0.6 })); door.position.y = 1.3; g.add(door);
    const s = neonSign('SAFETY', { height: 0.55, color: PAL.mint }); s.position.set(0, 3.1, 0.1); g.add(s); s.userData.setLit(1);
    g.position.set(STREET.x + 3.95, 0, -6); g.rotation.y = -Math.PI / 2; scene.add(g);
    return { g, door };
  })();

  // ⑤ EXIT 灯（她周围楼顶上的 9 盏 + 歌词三盏）：楼一栋栋往下沉，灯跟着沉进海里
  const roofExits = (() => {
    const cand = city.B.filter(b => b !== city.home && b !== city.scaleB && Math.hypot(b.x - HOME.x, b.z - HOME.z) < 40);
    const byD = (a, b) => Math.hypot(a.x - HOME.x, a.z - HOME.z) - Math.hypot(b.x - HOME.x, b.z - HOME.z);
    // 歌词三盏：升镜画面里她前方（−Z）从左到右三栋，按词的顺序
    const nearestTo = (x, z, ex) => cand.filter(b => !ex.includes(b)).reduce((a, b) => Math.hypot(b.x - x, b.z - z) < Math.hypot(a.x - x, a.z - z) ? b : a);
    const lyr3 = []; for (const [dx, dz] of [[-12, -12], [10, -12]]) lyr3.push(nearestTo(HOME.x + dx, HOME.z + dz, lyr3));   // NOW THERE'S / LEFT TO GO（NOWHERE 在她自己楼顶，见 homeExit）
    const near = [...lyr3, ...cand.filter(b => !lyr3.includes(b)).sort(byD).slice(0, 9)];
    const lyr = ['NOW THERE\'S', 'LEFT TO GO'];
    return near.map((b, i) => {
      const txt = i < 2 ? lyr[i] : 'EXIT';
      const s = neonSign(txt, { height: i < 2 ? 2.8 : 1.2, color: '#3dff7a' });
      const g = new THREE.Group(); g.add(s); s.position.y = 1.2;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), new THREE.MeshStandardMaterial({ color: '#222' })); post.position.y = 0.6; g.add(post);
      scene.add(g);
      // 沉没时刻：歌词三盏 = 各自那个词；其余提前一点、间隔散开
      const w = L.go.words;   // Now 100.72 there's 100.88 nowhere 101.14 left 101.56 to 101.82 go 102.02
      const tSink = i < 2 ? [w[2].start, w[5].start][i] + 0.25 : lerp(C3.roof + 0.4, w[5].start, ((i * 0.37) % 1));
      return { b, g, s, tSink, lyric: i < 2, lit0: i < 2 ? [w[0].start, w[3].start][i] : 0 };
    });
  })();
  // 她脚下这栋楼的 EXIT：唱到 nowhere 亮成 NOWHERE（全城最后一盏，离镜头最近）
  const homeExit = (() => {
    const g = new THREE.Group(), a = neonSign('EXIT', { height: 0.9, color: '#3dff7a' }), b = neonSign('NOWHERE', { height: 1.5, color: '#3dff7a' });
    a.position.y = 1.4; b.position.y = 1.6; g.add(a, b);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.12), new THREE.MeshStandardMaterial({ color: '#222' })); post.position.y = 0.7; g.add(post);
    g.position.set(HOME.x + 2.6, HOME.y, HOME.z - 2.8); g.lookAt(HOME.x + 14, HOME.y, HOME.z + 18); scene.add(g);
    a.userData.setLit(1);
    return { g, a, b };
  })();

  // ⑥ 引信：一串首尾相扣的回形针，沿海面从秤脚下经过她的楼，烧向地平线（+X）
  const fuseCurve = new THREE.CatmullRomCurve3([V3(2, 0, -32), V3(6, 0, -14), V3(16, 0, 3), V3(30, 0, 14), V3(70, 0, 22), V3(160, 0, 26), V3(300, 0, 24), V3(430, 0, 20)], false, 'centripetal');
  const FUSE_LEN = fuseCurve.getLength();
  const fuse = (() => {
    const N = 1500, m = createPaperclips({ count: N, seed: 88, clipSize: 0.55 }).mesh;   // 链子：每枚沿切线首尾相接
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = V3(), t = V3(), up = V3(0, 1, 0), s1 = V3(1, 1, 1), qr = new THREE.Quaternion();
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1); fuseCurve.getPointAt(u, p); fuseCurve.getTangentAt(u, t);
      const mx = new THREE.Matrix4().lookAt(V3(), t, up); q.setFromRotationMatrix(mx); qr.setFromAxisAngle(V3(1, 0, 0), Math.PI / 2); q.multiply(qr); q.multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), (i % 2) * 0.35));
      m4.compose(p, q, s1); m.setMatrixAt(i, m4);
    }
    const base = new THREE.Color(0.55, 0.55, 0.6), hot = hdr('#ffd27a', 3.2), burnt = hdr('#ff7a2e', 0.9);
    for (let i = 0; i < N; i++) m.setColorAt(i, base);
    m.instanceColor.needsUpdate = true;
    scene.add(m);
    // 火头：一团亮点 + 光
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 10), new THREE.MeshBasicMaterial({ color: hdr('#fff0b0', 6), toneMapped: false })); scene.add(head);
    const light = new THREE.PointLight('#ffb35a', 0, 40, 1.6); scene.add(light);
    const NP = 220, sp = new Float32Array(NP * 3), sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: hdr('#ffcf6a', 4), size: 0.35, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sparks.frustumCulled = false; scene.add(sparks);
    const rnd = mulberry32(3), SD = Array.from({ length: NP }, () => [rnd(), rnd(), rnd(), rnd()]);
    let lastU = -1;
    function update(T, { u, blue = 0, seaY }) {
      m.position.y = seaY + 0.12; head.position.y = 0; sparks.position.y = 0;
      const ui = Math.floor(u * (N - 1));
      if (Math.abs(u - lastU) > 1e-6) {
        for (let i = 0; i < N; i++) { const d = ui - i; m.setColorAt(i, d < 0 ? base : d < 12 ? hot : blue > 0 ? hdr('#5f86ff', 1.2) : burnt); }
        m.instanceColor.needsUpdate = true; lastU = u;
      }
      const on = u > 0 && u < 1 && blue < 0.5;
      head.visible = on; light.intensity = on ? 30 : 0; sparks.visible = on;
      if (on) {
        const hp = fuseCurve.getPointAt(clamp(u, 0.0001, 0.9999)); hp.y = seaY + 0.5; head.position.copy(hp); light.position.copy(hp).add(V3(0, 1.2, 0));
        for (let i = 0; i < NP; i++) { const [a, b, c, d] = SD[i]; const age = ((T * 2.4 + c) % 1), back = clamp(u - age * 0.004); const bp = fuseCurve.getPointAt(back);
          sp.set([bp.x + (a - 0.5) * 2 * age, seaY + 0.4 + b * 2.2 * age - age * age * 1.5, bp.z + (d - 0.5) * 2 * age], i * 3); }
        sg.attributes.position.needsUpdate = true;
      }
    }
    return { m, update, head };
  })();
  // 引信上的字：烧到时一个词一个词亮（竖在引信旁边，面向追拍镜头）
  const fuseWords = (() => {
    const w = L.fuse.words;   // Too late now, we lit the fuse
    const items = [['WE', 3], ['LIT', 4], ['THE', 5], ['FUSE', 6]].map(([s, k], i) => {
      const g = neonSign(s, { height: 4.2, color: PAL.lemon, board: false }); scene.add(g);
      return { g, k, t: w[k].start };
    });
    return items;
  })();
  // 秤碎片上的字「TOO LATE NOW」
  const fragSign = (() => { const g = new THREE.Group(); const items = ['TOO', 'LATE', 'NOW'].map((s, i) => { const n = neonSign(s, { height: 1.4, color: [PAL.pink, PAL.lemon, PAL.mint][i] }); n.position.set(-3.4 + i * 3.6, -0.8 - i * 0.2, 0.3); g.add(n); return n; }); scale.fragment.add(g); g.position.set(3.2, 2.5, 0.2); return { g, items }; })();
  // 地平线上升起的那只眼
  // 全片同一只眼：枪灰压圈 + 黑瞳 + 柠黄三圈环（同 shots/v3-v4.js / c1-v4.js 的 makeEye）
  function makeEye(R) {
    const g = new THREE.Group(), add = (geo, mat, z) => { const m = new THREE.Mesh(geo, mat); m.position.z = z; g.add(m); return m; };
    add(new THREE.RingGeometry(R, R * 1.24, 64), new THREE.MeshBasicMaterial({ color: '#4a4a5a', fog: false }), 0.01);
    add(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: '#0b0a06', fog: false }), 0.012);
    const lit = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6), fog: false, toneMapped: false });
    add(new THREE.CircleGeometry(R * 0.26, 40), lit, 0.02);
    for (const k of [0.46, 0.66, 0.86]) add(new THREE.RingGeometry(R * k - R * 0.03, R * k + R * 0.03, 64), lit, 0.02);
    return { g, lit };
  }
  const eye = makeEye(40); eye.group = eye.g;
  eye.g.position.set(470, 0, 22); eye.g.lookAt(0, 30, 10); scene.add(eye.g);

  // ---------------- 时间函数：海面、引信进度
  const seaY = T => {
    if (T < C3.street) return 18;                    // ① ② 楼顶下方远处
    if (T < C3.comic) return 0.42;                   // ③ 街上齐腰
    if (T < C3.fuse) return lerp(19.6, 21.2, smooth((T - C3.roof) / (C3.fuse - C3.roof)));   // ⑤ 海已经快到楼顶
    return 21.5;
  };
  const fuseU = T => {
    const w = L.fuse.words, tStart = C3.fuse + 0.55;   // 碎片落海点着
    const keys = [[tStart, 0], [w[3].start, 0.05], [w[4].start, 0.09], [w[5].start, 0.14], [w[6].start, 0.2], [C3.boom, 1]];
    if (T <= keys[0][0]) return 0;
    for (let i = 1; i < keys.length; i++) if (T < keys[i][0]) { const a = keys[i - 1], b = keys[i]; const p = (T - a[0]) / (b[0] - a[0]); return lerp(a[1], b[1], i === keys.length - 1 ? eIn(p) * 0.6 + p * 0.4 : p); }
    return 1;
  };

  // ---------------- 世界摆位（每个 3D 镜头开头调）
  function world(T, { blue = 0 } = {}) {
    const sy = seaY(T);
    sea.position.y = sy; sea.visible = T >= C3.street;
    city.mat.uniforms.uSea.value = T >= C3.street ? sy : -10;
    city.mat.uniforms.uBlue.value = blue;
    city.mat.uniforms.uLight.value = 1 - blue;
    // ③ 窗户塞满：97.02「paperclips」起一格格开始，97.86「fill」整条街同时满
    city.mat.uniforms.uFill.value = T < C3.street ? 0 : T < C3.fill ? 0.35 * smooth((T - L.clips.words[1].start) / 0.8) : T < C3.roof ? lerp(0.35, 1, eOut((T - C3.fill) / 0.12)) : 1;
    seaMat.uniforms.uBlue.value = blue; seaMat.uniforms.uT.value = T;
    // ⑤ 楼下沉
    const dy = new Array(city.B.length).fill(0);
    if (T >= C3.roof) roofExits.forEach(e => { dy[city.B.indexOf(e.b)] = (e.b.base - sy + 0.9) * 0 + 4.5 * eIn((T - e.tSink) / 0.45); });
    city.sink(dy);
    // 秤
    scale.update(T, { ...scaleState(T), lit: (1 - blue) * (T > C3.fuse + 0.7 ? 0.45 : 1) });   // 追火时秤在远处只剩余光，别抢火头
    scale.group.visible = true;
    // 碎片：102.46 崩开 → 0.5 s 落进海里
    { const k = T - C3.fuse, f = scale.fragment;
      if (T >= C3.fuse) { f.position.set(0, -14 * eIn(k / 0.55), 2 + k * 3); f.rotation.set(k * 1.6, 0, -k * 2.1); f.visible = k < 0.62; }
      else { f.position.set(0, 0, 0); f.rotation.set(0, 0, 0); }
      fragSign.items.forEach((n, i) => n.userData.setLit(T >= L.fuse.words[i].start - 0.04 && T < C3.fuse + 0.62 ? 1 : 0)); }
    // 秤上的招牌
    upSigns.forEach((g, i) => g.userData.setLit(lineOn(L.up, T) ? wordLit(L.up.words[i], T) : 0));
    // 街
    streetSign.a.userData.setLit(lineOn(L.clips, T) ? wordLit(L.clips.words[0], T) : 0);
    streetSign.b.userData.setLit(lineOn(L.clips, T) ? wordLit(L.clips.words[1], T) : 0);
    streetSign.g.position.y = 0;
    roomWall.draw(T); roomWall.m.visible = roomWall.back.visible = T >= C3.street && T < C3.comic;
    // EXIT
    roofExits.forEach((e, i) => {
      const b = e.b, dyb = dy[city.B.indexOf(b)];
      e.g.position.set(b.x + (i % 2 ? 2 : -2), b.base - dyb, b.z + 2.5); e.g.lookAt(HOME.x + 12, b.base - dyb + 1.5, HOME.z + 18);   // 面向升镜的路线（固定点，纯函数）
      e.g.visible = T >= C3.roof && T < C3.fuse + 0.7;
      e.s.userData.setLit(e.lyric ? (T >= e.lit0 - 0.04 ? 1 : 0.15) : 1);
    });
    homeExit.g.visible = T >= C3.roof;
    { const on = T >= L.go.words[2].start - 0.04; homeExit.a.visible = !on; homeExit.b.visible = on; homeExit.b.userData.setLit(on ? 1 : 0); }
    // 引信
    const u = fuseU(T);
    fuse.m.visible = T >= C3.fuse;   // 引信点着前不露（下落俯拍里会从楼边露出一截）
    fuse.update(T, { u, blue, seaY: sy });
    fuseWords.forEach((it, i) => {
      const pu = [0.05, 0.09, 0.14, 0.2][i] + 0.035, p = fuseCurve.getPointAt(pu), tg = fuseCurve.getTangentAt(pu);   // 立在火头前方一点：亮起时正在镜头里
      it.g.position.set(p.x - tg.z * 2.2, sy + 1.6, p.z + tg.x * 2.2); it.g.lookAt(p.x - tg.x * 20, sy + 2, p.z - tg.z * 20);   // 面向追在后面的镜头
      it.g.visible = T >= C3.fuse; it.g.userData.setLit(blue > 0.5 ? 0 : T >= it.t - 0.04 ? 1 : 0);
    });
    // 眼：引信点着后从地平线升起，闷响时闭上
    // 引信点着后从地平线升起；火烧到它正下方（105.69）闷响，眼一下熄掉
    eye.g.visible = T >= C3.fuse;
    eye.g.position.y = lerp(-50, 46, smooth((T - C3.fuse - 0.4) / 2.2));
    const eb = T < C3.boom ? 1.6 + 1.4 * smooth((T - 104.6) / 1.0) + 2.5 * Math.exp(-Math.abs(T - C3.boom) / 0.05) : 1.6 * Math.exp(-(T - C3.boom) / 0.06);
    eye.lit.color.copy(hdr(PAL.lemon, eb));
    // 灯
    hemi.color.set(blue > 0 ? '#7f93ff' : '#9aa6ff'); hemi.intensity = lerp(0.6, 0.35, blue);
    moon.material.color.copy(hdr(PAL.pink, 1.3 * (1 - blue))).lerp(hdr('#3a5bff', 0.6), blue);
    scene.background.set(blue > 0 ? '#04060f' : '#06060b');
  }
  // 楼顶堆：她落点 HOME，堆在 95.40 之前已经在
  const pileAt = HOME.clone();
  function updatePile(T) { pile.mesh.visible = T < C3.street; pile.mesh.position.copy(pileAt).add(V3(0, 0.55, 0)); pile.update(T, { t0: C3.t0 - 6, dur: 2, height: 0.35, radius: 2.6, drop: 3 }); }   // 散在鼓包上的立体回形针，铺满整个楼顶（半径 > 楼顶，四角也有）

  // ================================================================ 镜头
  const cam = new THREE.PerspectiveCamera(32, W / Hh, 0.05, 2500); scene.add(cam);
  // girl.js 已知问题：头出画时 face.update 传 camera 会抛 RangeError（读回遮罩尺寸为负）→ 头不在画内就不传 camera（同 0xe678 的绕法）
  const _hp = V3();
  const headIn = c => { const hb = girl.dancer?.S?.info?.Head?.bone; if (!hb) return false; c.updateMatrixWorld(true); girl.root.updateMatrixWorld(true); hb.getWorldPosition(_hp).project(c); return Math.abs(_hp.x) < 0.92 && Math.abs(_hp.y) < 0.92 && _hp.z < 1; };
  const faceUp = (T, c, opts = {}) => { if (girl.face && girl.root.visible) girl.face.update(T, { camera: headIn(c) ? c : null, ...opts }); };
  const face = (T, opts = {}) => faceUp(T, cam, opts);
  const post = (T, extra = {}) => ({ bloom: { strength: 0.75, threshold: 1.0 }, chroma: 0.1 + 0.25 * kick(T), grade: { vignette: 0.36 }, ...extra });
  const shots = [];
  const shot3d = (id, t0, t1, fn, extra = () => ({}), tin = { kind: 'cut' }) => shots.push({ id, t0, t1, transitionIn: tin, build() { return {}; }, update(_, T) { const r = fn(T) ?? {}; return { scene: r.scene ?? scene, camera: cam, post: post(T, extra(T)) }; } });
  const setCam = (pos, look, fov, up = V3(0, 1, 0)) => { cam.position.copy(pos); cam.up.copy(up); cam.lookAt(look); cam.fov = fov; cam.updateProjectionMatrix(); };

  // ---------------- ① 94.78 俯拍下落 → 95.40 背摔进回形针堆
  // 仰面朝上的摆法同 shots/v3-v4.js（0xe678）：先量出片段自带的身体朝向，转成「头 → −Z、脸 → +Y」，再把髋钉在目标点
  const BI = girl.dancer.S.info, bp = k => BI[k].bone.getWorldPosition(V3());
  const _B = new THREE.Matrix4(), _Rn = new THREE.Quaternion();
  const SUPINE_Q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(1, 0, 0), V3(0, 0, -1), V3(0, 1, 0)));
  const FALL = getAnim('move__fall-air'), sol = (m, sec) => m.solve(sec / m.srcPeriod, girl.dancer);
  function placeSupine(T, hips) {
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(1);
    girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(sol(FALL, 0.6 + (T - 94.30))); girl.root.updateMatrixWorld(true);
    const h = bp('Hips'), y = bp('Head').sub(bp('LeftFoot').add(bp('RightFoot')).multiplyScalar(0.5)).normalize();
    const x = bp('LeftUpLeg').sub(bp('RightUpLeg')); x.addScaledVector(y, -x.dot(y)).normalize();
    _Rn.setFromRotationMatrix(_B.makeBasis(x, y, V3().crossVectors(x, y))).invert();
    const q = SUPINE_Q.clone().multiply(_Rn);
    girl.root.quaternion.copy(q); girl.root.position.copy(hips).sub(h.applyQuaternion(q));
    girl.setSkin('toon', T); girl.root.updateMatrixWorld(true);
  }
  const fallY = T => HOME.y + 0.9 + Math.max(0, (C3.land - T)) * ENTRY.speed;
  shot3d('c3-fall', C3.t0, C3.gauge, T => {
    world(T); updatePile(T);
    const y = fallY(T), landed = T >= C3.land;
    // 仰面朝上：根绕 x 转 -90°（脸朝 +Y），头朝 −Z
    placeSupine(T, V3(HOME.x, y, HOME.z));
    const cy = landed ? HOME.y + 0.9 + ENTRY.camUp + (T - C3.land) * 1.5 : y + ENTRY.camUp;
    const shake = landed ? 0.25 * Math.exp(-(T - C3.land) * 10) * Math.sin((T - C3.land) * 70) : 0;
    // 她身体中心在屏幕 y ≈ 45%（偏上）：镜头看向她下方一点
    setCam(V3(HOME.x + shake, cy, HOME.z + 0.35), V3(HOME.x, cy - 10, HOME.z + 0.35), ENTRY.fov, V3(0, 0, -1));
    rain.update(T, { center: V3(HOME.x, y, HOME.z), radius: 7, height: 26, speed: -4, density: clamp((T - C3.t0) / 0.3) * 0.5 + 0.1, scale: 1 });   // 相对她往上掠过（她比它们落得快）
    pour.update(T, { on: 0, top: V3() });
    face(T, { expression: 'surprised' });
  }, T => ({ flash: { amount: 0.5 * Math.exp(-Math.max(0, T - C3.land) / 0.08) * (T >= C3.land ? 1 : 0), color: '#ffffff' }, chroma: 0.15 + (T >= C3.land ? 0.8 * Math.exp(-(T - C3.land) / 0.15) : 0) }));

  // ---------------- ② 95.45 秤：她身后低机位仰拍
  shot3d('c3-gauge', C3.gauge, C3.street, T => {
    world(T); updatePile(T);
    put(scene, T, { pos: V3(HOME.x, HOME.y + 0.5, HOME.z - 0.4), yaw: Math.atan2(SCALE_AT.x - HOME.x, SCALE_AT.z - HOME.z), seq: SEQ.land });
    const k = T - C3.gauge, w = L.up.words;
    const jolt = [w[1].start, w[2].start, w[3].start].reduce((a, t) => a + (T >= t ? 0.12 * Math.exp(-(T - t) * 12) * Math.sin((T - t) * 60) : 0), 0);
    const dc = scale.dims;
    const dcen = V3(SCALE_AT.x, SCALE_AT.y + dc.dialY, SCALE_AT.z);
    setCam(V3(HOME.x + 1.1, HOME.y + 0.8 + jolt, HOME.z + 3.4 - k * 0.5), dcen.clone().add(V3(0, -3.2 + k * 0.4, 0)), 34);
    const top = V3(SCALE_AT.x, SCALE_AT.y + dc.panY + 1, SCALE_AT.z);
    pour.update(T, { on: 1, top, bursts: [w[1].start - 0.38, w[2].start - 0.38, w[3].start - 0.38] });
    rain.update(T, { center: V3(HOME.x - 4, HOME.y + 12, HOME.z - 16), radius: 12, height: 20, speed: 12, density: 0.3, scale: 1.2 });
    face(T, { expression: 'surprised' });
  }, T => { const w = L.up.words; const hit = [w[1].start, w[2].start, w[3].start].reduce((a, t) => a + (T >= t ? Math.exp(-(T - t) / 0.12) : 0), 0);
    return { chroma: 0.12 + 0.35 * hit, flash: T >= w[3].start + 0.12 ? { amount: 0.25 * Math.exp(-(T - w[3].start - 0.12) / 0.1), color: '#ff3040' } : 0 }; });

  // ---------------- ③ 96.84 街道：回形针潮齐腰，她往镜头这边挣；98.5 起拐向右边那扇 SAFETY 门
  const wadeZ = T => lerp(14, 4, smooth((T - C3.street) / 1.5)) - 0.6 * (T - C3.street);
  shot3d('c3-street', C3.street, C3.comic, T => {
    world(T);
    const z = wadeZ(T), turn = smooth((T - 98.25) / 0.45);
    const x = STREET.x + lerp(0, 2.6, turn), zz = lerp(z, -5.4, turn * 0.0) ;
    put(scene, T, { pos: V3(x, 0.02, zz), yaw: lerp(0, -Math.PI / 2 * 0.85, turn), seq: SEQ.wade });
    const k = T - C3.street;
    // 贴近她（占画高 ~35%）；97.86「fill」那一拍镜头仰起看两边的窗被塞满、往外涌，98.4 再落回她身上、跟着她转向门
    const up = smooth((T - (C3.fill - 0.12)) / 0.3) * (1 - smooth((T - 98.38) / 0.3));
    setCam(V3(x - 0.42 + Math.sin(k * 0.7) * 0.08, lerp(0.88, 0.7, up), zz + lerp(1.75, 1.35, up)), V3(x + 0.1, lerp(0.62, 4.6, up), zz - 6), lerp(50, 62, up));
    rain.update(T, { center: V3(STREET.x, 7, zz - 4), radius: 9, height: 14, speed: 14, density: 0.45, scale: 1 });
    gush.update(T, { zz });
    pour.update(T, { on: 0, top: V3() });
    face(T, { expression: 'surprised' });
  }, T => ({ grade: { vignette: 0.4, saturation: 1.05 }, flash: T >= C3.fill ? { amount: 0.18 * Math.exp(-(T - C3.fill) / 0.1), color: '#f2ede4' } : 0 }));
  // 门放到她转过去的方向上
  safetyDoor.g.position.set(STREET.x + 3.95, 0, 4 - 0.6 * (C3.comic - C3.street) - 0.2);

  // ---------------- ④ 98.82 漫画页（2D 关键画）
  const KS = new URL('../../cast-cyber-girl/closeup/killswitch/raw/', import.meta.url);
  const loadImg = async n => { const im = new Image(); im.src = new URL(n + '.png', KS).href; await im.decode(); return im; };
  const IMG = Object.fromEntries(await Promise.all(['door-cut', 'button', 'chair', 'face'].map(async n => [n, await loadImg(n).catch(() => loadImg(n.replace('-cut', '')).catch(() => null))])));
  const comic = await createComic(mv, { w: 20, h: 11.25, seed: 31 });
  const cScene = new THREE.Scene();
  { const c = document.createElement('canvas'); c.width = 16; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#1d1638'); gr.addColorStop(1, '#0a0812'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; cScene.background = t; }
  cScene.add(comic.group); comic.group.rotation.set(-0.04, 0.03, -0.01);
  const cCam = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const pw = L.pto.words;   // Killswitch 98.82 / guy's 99.30 / on 99.60 / PTO 99.74
  const tP = { door: C3.comic, button: C3.comic + 0.1, chair: pw[1].start - 0.06, face: 100.02 };
  const fig = (c, im, cx, cy, h, { rot = 0, sx = 1, sy = 1, alpha = 1 } = {}) => { if (!im) return; const k = h / im.height; c.save(); c.globalAlpha *= alpha; c.translate(cx, cy); c.rotate(rot); c.scale(k * sx, k * sy); c.drawImage(im, -im.width / 2, -im.height / 2); c.restore(); };
  const cover = (c, b, im, { zoom = 1, ox = 0, oy = 0 } = {}) => { if (!im) return; const k = Math.max(b.w / im.width, b.h / im.height) * zoom; c.drawImage(im, b.w / 2 - im.width * k / 2 + ox * b.w, b.h / 2 - im.height * k / 2 + oy * b.h, im.width * k, im.height * k); };
  const bleed = (c, b, fill) => { c.fillStyle = fill; c.fillRect(-80, -80, b.w + 160, b.h + 160); };
  comic.panel({ id: 'door', rect: [0.025, 0.045, 0.3, 0.91], reveal: { at: tP.door - 0.05, kind: 'pop', dur: 0.04 }, dim: { at: tP.chair, amount: 0.25 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 1.6, draw: (c, b) => { const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#16122c'); g.addColorStop(1, '#2b2350'); bleed(c, b, g);
        c.fillStyle = '#0a0812'; c.fillRect(b.w * 0.06, b.h * 0.08, b.w * 0.6, b.h * 0.86); c.strokeStyle = PAL.mint; c.lineWidth = 6; c.strokeRect(b.w * 0.06, b.h * 0.08, b.w * 0.6, b.h * 0.86); } },
      { depth: 0.9, draw: (c, b, T) => CC.speedLines(c, { x: -60, y: -60, w: b.w + 120, h: b.h + 120 }, T, { angle: 180, n: 30, color: PAL.paper, width: 4, speed: 3, alpha: 0.35, seed: 5 }) },
      { depth: 0.2, draw: (c, b, T) => fig(c, IMG['door-cut'], b.w * 0.52 + 14 * Math.sin(T * 4), b.h * 0.53, b.h * 0.92) },
    ] });
  comic.panel({ id: 'button', rect: [0.345, 0.045, 0.3, 0.44], reveal: { at: tP.button, kind: 'pop', dur: 0.14 }, dim: { at: tP.face, amount: 0.2 }, border: 'ink', borderW: 12,
    layers: [{ depth: 0.5, draw: (c, b, T) => cover(c, b, IMG.button, { zoom: 1.08 + 0.05 * clamp((T - tP.button) / 1.5) }) },
      { depth: 0, draw: (c, b, T) => { const a = 0.5 + 0.5 * Math.sin(T * 14); c.fillStyle = `rgba(255,40,50,${0.12 * a})`; c.fillRect(0, 0, b.w, b.h); } }] });
  comic.panel({ id: 'chair', rect: [0.665, 0.045, 0.31, 0.44], reveal: { at: tP.chair, kind: 'slide', dir: 'r', dur: 0.16 }, dim: { at: tP.face, amount: 0.2 }, border: 'ink', borderW: 12,
    layers: [{ depth: 0.5, draw: (c, b, T) => cover(c, b, IMG.chair, { zoom: 1.05 + 0.04 * clamp((T - tP.chair) / 1.2) }) }] });
  comic.panel({ id: 'face', rect: [0.345, 0.515, 0.63, 0.44], reveal: { at: tP.face, kind: 'drop', dur: 0.1 }, border: 'ink', borderW: 12,
    layers: [{ depth: 1.0, draw: (c, b, T) => { bleed(c, b, '#f2ede4'); CC.tone(c, b, { color: PAL.mint, step: 18, grad: [0.6, 0], alpha: 0.35 }); } },
      { depth: 0.15, draw: (c, b, T) => fig(c, IMG.face, b.w * 0.5, b.h * 0.56 + 6 * Math.sin(T * 3), b.h * 1.12) }] });
  // 歌词：按钮上的标签 / 便签 / 明信片（格子里的物件）
  comic.sfx({ text: 'KILLSWITCH', x: 0.495, y: 0.405, size: 0.05, at: pw[0].start - 0.02, color: PAL.lemon, stroke: PAL.ink, angle: -3, shake: 0.6 });
  comic.sfx({ text: "GUY'S", x: 0.74, y: 0.11, size: 0.05, at: pw[1].start, color: PAL.mint, stroke: PAL.ink, angle: -6, shake: 0.4 });
  comic.sfx({ text: 'ON PTO', x: 0.9, y: 0.43, size: 0.046, at: pw[2].start, color: PAL.pink, stroke: PAL.ink, angle: 7, shake: 0.4 });
  comic.sfx({ text: '…', x: 0.86, y: 0.62, size: 0.07, at: tP.face + 0.2, color: PAL.ink, stroke: PAL.paper, angle: 0, shake: 0 });
  const cKeys = [
    { t: tP.door, target: 'door', yaw: 0, pitch: 0, roll: 0, margin: 1.05 },
    { t: tP.door + 0.06, target: 'door', yaw: 2, pitch: 0, roll: -0.5, margin: 1.05 },
    { t: tP.button + 0.22, target: [0.02, 0, 0.64, 0.5], yaw: -3, pitch: 1, roll: 0.5, margin: 1.0 },
    { t: tP.chair + 0.05, target: [0.33, 0, 0.67, 0.5], yaw: -2, pitch: 1, roll: 0.5, margin: 1.0 },
    { t: tP.face - 0.04, target: [0.33, 0, 0.67, 0.5], yaw: -1, pitch: 1, roll: 0, margin: 0.98 },
    { t: tP.face + 0.12, target: 'face', yaw: 3, pitch: -2, roll: -1, margin: 1.06 },
    { t: C3.burst - 0.05, target: 'face', yaw: 2, pitch: -2, roll: -0.5, margin: 1.03 },
    { t: C3.burst + 0.18, target: 'page', yaw: 0, pitch: -1, roll: 0, margin: 0.95 },
  ];
  // 破格：回形针从格子里冲出来盖满整页（一层平铺的针墙从下往上涨 + 近处的真回形针往镜头飞）
  // 破格：回形针洪流从「她愣住」那一格里喷出来，一大股冲向镜头，越来越密，最后把画面盖满（每一枚都够大，看得出是回形针）
  const torrent = (() => {
    const N = 240, m = createPaperclips({ count: N, seed: 71, clipSize: 2.6 }).mesh, rnd = mulberry32(71);   // 少而大：一枚枚看得出形状
    const D = Array.from({ length: N }, () => [rnd(), rnd(), rnd(), rnd() * 6.28, rnd()]);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = V3(1, 1, 1), p = V3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    comic.over.add(m);
    const src = comic.pagePt(0.66, 0.74, 0.2);
    function update(T) {
      for (let i = 0; i < N; i++) {
        const [a, b, c, r, sz] = D[i], age = T - C3.burst - c * 0.28;
        if (age < 0) { m.setMatrixAt(i, zero); continue; }
        const ang = a * 6.283, sp = 3 + 9 * b;                  // 从格子里往外扇形喷，同时冲向镜头（+z）
        p.set(src.x + Math.cos(ang) * sp * age * 1.4, src.y + Math.sin(ang) * sp * age * 0.9, src.z + (6 + 18 * b) * age);
        e.set(r + age * 6 * (a - 0.5), r * 1.3 + age * 5, r * 0.7); q.setFromEuler(e); m4.compose(p, q, s1.setScalar(0.6 + 0.8 * sz)); m.setMatrixAt(i, m4);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    return { m, update };
  })();
  cScene.add(new THREE.HemisphereLight('#ffffff', '#30284a', 1.6));
  shots.push({
    id: 'c3-comic', t0: C3.comic, t1: C3.roof, transitionIn: { kind: 'flash', dur: 0.12, peak: 0.7 },
    build() { return {}; },
    update(_, T) {
      comic.camPath(cCam, T, cKeys);
      const k = T - C3.burst, f = eOut(k / 0.28);
      torrent.m.visible = T >= C3.burst; torrent.update(T);
      const hits = [tP.button, tP.chair, tP.face, C3.burst].filter(t => T >= t), hk = hits.length ? T - hits.at(-1) : 9;
      const sh = 0.07 * Math.exp(-hk * 12); cCam.position.x += sh * Math.sin(hk * 95); cCam.position.y += sh * 0.6 * Math.cos(hk * 71);
      cCam.updateMatrixWorld(); comic.update(T, { camera: cCam }); comic.group.updateMatrixWorld(true); comic.update(T, { camera: cCam });
      return { scene: cScene, camera: cCam, post: { bloom: { strength: 0.35, threshold: 1.25 }, chroma: 0.06 + 0.2 * Math.exp(-hk * 8), grade: { vignette: 0.28 }, flash: { amount: 0.15 * Math.exp(-Math.abs(T - C3.comic) * 20), color: '#ffffff' } } };
    },
  });

  // ---------------- ⑤ 100.72 从回形针海里钻出来升镜：楼顶上的她，四周 EXIT 一盏盏沉下去
  shot3d('c3-roof', C3.roof, C3.fuse, T => {
    world(T);
    put(scene, T, { pos: V3(HOME.x, HOME.y + 0.02, HOME.z), yaw: Math.PI * 0.85, seq: SEQ.roof });
    const k = (T - C3.roof) / (C3.fuse - C3.roof), e = smooth(k);
    // 起点：海面以下（贴着她的楼外墙）往上冲出海面 → 她身后 → 一路升到俯瞰
    const p0 = V3(HOME.x + 6, seaY(T) - 1.5, HOME.z + 7), p1 = V3(HOME.x + 4.5, HOME.y + 2.2, HOME.z + 5), p2 = V3(HOME.x + 16, HOME.y + 20, HOME.z + 26);
    const a = smooth(k / 0.22), pos = a < 1 ? p0.clone().lerp(p1, a) : p1.clone().lerp(p2, smooth((k - 0.22) / 0.78));
    const look = V3(HOME.x - lerp(0, 4, e), HOME.y + lerp(1.2, -1, e), HOME.z - lerp(2, 12, e));
    setCam(pos, look, lerp(48, 40, e));
    rain.update(T, { center: V3(HOME.x, HOME.y + 8, HOME.z), radius: 16, height: 22, speed: 12, density: 0.25, scale: 1.4 });
    pour.update(T, { on: 1, top: V3(SCALE_AT.x, SCALE_AT.y + scale.dims.panY + 1, SCALE_AT.z) });
    face(T, { expression: 'neutral' });
  }, T => ({ flash: { amount: 0.2 * Math.exp(-(T - C3.roof) / 0.1), color: '#ffffff' } }));

  // ---------------- ⑥ 102.46 秤崩开 → 碎片落海点着引信 → 追火 → 105.69 闷响全熄
  const camFuse = T => {
    const u = fuseU(T), uu = clamp(u - 0.012), p = fuseCurve.getPointAt(clamp(u, 0.001, 0.999)), pb = fuseCurve.getPointAt(Math.max(0, uu - 0.004)), sy = seaY(T);
    if (T < C3.fuse + 0.7) {   // 先看秤崩开、碎片往下掉
      const dc = scale.dims, k = T - C3.fuse;
      return [V3(SCALE_AT.x + 10, SCALE_AT.y + 6 + k * 2, SCALE_AT.z + 28), V3(SCALE_AT.x + 1, SCALE_AT.y + dc.dialY - 6 - k * 8, SCALE_AT.z), 44];
    }
    // 机位高过露出海面的楼顶（海面上最高还露 ~5），从斜后上方追火头
    return [V3(pb.x, sy + 8, pb.z).addScaledVector(fuseCurve.getTangentAt(clamp(uu, 0, 1)), -10).add(V3(0, 0, 4)), V3(p.x, sy + 1.2, p.z).addScaledVector(fuseCurve.getTangentAt(clamp(u, 0, 0.999)), 22), lerp(50, 58, smooth((T - 103.4) / 1.5))];
  };
  shot3d('c3-fuse', C3.fuse, C3.blues, T => {
    const blue = smooth((T - C3.boom) / 0.18);
    world(T, { blue });
    put(scene, T, { pos: V3(HOME.x, HOME.y + 0.02, HOME.z), yaw: Math.PI * 0.6, seq: SEQ.fuse });
    const [p, l, f] = camFuse(T);
    if (T >= C3.boom) { const k = T - C3.boom; p.y += 0.15 * Math.exp(-k * 8) * Math.sin(k * 60); }
    setCam(p, l, f);
    rain.update(T, { center: l.clone().lerp(p, 0.4).add(V3(0, 4, 0)), radius: 10, height: 18, speed: 12, density: T < C3.boom ? 0.12 : 0, scale: 1.4 });   // 雨落在镜头前方，不从镜头上擦过
    pour.update(T, { on: T < C3.fuse + 0.3 ? 1 : 0, top: V3(SCALE_AT.x, SCALE_AT.y + scale.dims.panY + 1, SCALE_AT.z) });
    face(T, { expression: 'neutral' });
  }, T => { const boom = T >= C3.boom ? Math.exp(-(T - C3.boom) / 0.06) : 0, crack = T >= C3.fuse ? Math.exp(-(T - C3.fuse) / 0.12) : 0;
    return { flash: { amount: 0.6 * boom + 0.3 * crack, color: boom > 0.01 ? '#cfe0ff' : '#ffffff' }, chroma: 0.12 + 0.4 * crack + 0.6 * boom, grade: { vignette: 0.36, saturation: lerp(1, 0.75, smooth((T - C3.boom) / 0.2)), warmth: lerp(0, -0.5, smooth((T - C3.boom) / 0.2)) } }; });

  // ---------------- ⑦⑧ 105.96 保留镜头：冷蓝雨里坐标轴晃腿（照 v4-04c 原样）+ 轴标签 + 小回形针 + 108.55 上摇
  const blues = (() => {
    const BLUE = PAL.blue;
    const s = new THREE.Scene(); s.background = col('#04060f'); s.fog = new THREE.Fog('#04060f', 6, 22);
    s.add(new THREE.HemisphereLight('#c8d4ff', '#0a0f22', 1.1));
    const key = new THREE.DirectionalLight('#9fb4ff', 2.2); key.position.set(-2, 5, 3); s.add(key);
    const rim = new THREE.DirectionalLight(BLUE, 2.5); rim.position.set(3, 2, -3); s.add(rim);
    const blueM = new THREE.MeshBasicMaterial({ color: hdr(BLUE, 2.2), toneMapped: false });
    const yAx = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.2, 12), blueM); yAx.position.y = 2.1; s.add(yAx);
    const xAx = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5, 12), blueM); xAx.rotation.z = Math.PI / 2; xAx.position.set(1.6, 2.35, 0); s.add(xAx);
    for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.02), blueM); t.position.set(-0.6 + i * 0.55, 2.35, 0); s.add(t); }
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 16), blueM); arrow.position.set(4.2, 2.35, 0); arrow.rotation.z = -Math.PI / 2; s.add(arrow);
    const arrowY = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 16), blueM); arrowY.position.set(0, 4.3, 0); s.add(arrowY);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#0a0f1e', roughness: 0.15, metalness: 0.6 })); floor.rotation.x = -Math.PI / 2; s.add(floor);
    const sign = ledSign({ line: L.blues, cols: 120, rows: 14, pitch: 0.2, color: BLUE }); sign.group.scale.setScalar(0.12); sign.group.position.set(1.9, 3.0, 0); s.add(sign.group);
    const sign2 = ledSign({ line: L.blues, cols: 72, rows: 14, pitch: 0.2, color: BLUE }); sign2.group.scale.setScalar(0.085); sign2.group.position.set(2.05, 2.78, 0.1); s.add(sign2.group);
    // 新加：轴标签（桥段要用）+ 竖轴高处一枚发光回形针
    const label = (text, h) => { const { texture, aspect } = textTexture(text, { font: FONT, px: 160, pad: 16 }); const m = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), new THREE.MeshBasicMaterial({ map: texture, color: hdr('#9fb4ff', 1.6), transparent: true, depthWrite: false, toneMapped: false })); return m; };
    const lY = label('INTELLIGENCE', 0.2); lY.rotation.z = Math.PI / 2; lY.position.set(-0.2, 3.35, 0); s.add(lY);
    const lX = label('GOALS', 0.2); lX.position.set(3.75, 2.1, 0); s.add(lX);
    const clip = createPaperclips({ count: 1, seed: 1, clipSize: 0.2 }).mesh; clip.setColorAt(0, hdr(PAL.lemon, 1.25)); clip.instanceColor.needsUpdate = true;
    clip.material = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }); s.add(clip);
    const clipLight = new THREE.PointLight(PAL.lemon, 0.35, 0.9, 2); s.add(clipLight);
    const rnd = mulberry32(22), N = 700, pos = new Float32Array(N * 6), seeds = [];
    for (let i = 0; i < N; i++) seeds.push([(rnd() - 0.5) * 16, rnd() * 8, (rnd() - 0.5) * 12, 0.25 + rnd() * 0.35, 5 + rnd() * 3]);
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const rainL = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: hdr('#9fb4ff', 0.7), transparent: true, opacity: 0.55, toneMapped: false })); rainL.frustumCulled = false; s.add(rainL);
    return { s, sign, sign2, seeds, pos, rg, clip, clipLight };
  })();
  const bCam = new THREE.PerspectiveCamera(38, W / Hh, 0.05, 600);
  shots.push({
    id: 'c3-blues', t0: C3.blues, t1: C3.end + 0.5, transitionIn: { kind: 'flash', dur: 0.2, color: PAL.blue, peak: 0.6 },
    build() { return {}; },
    update(_, T) {
      const S = blues, k = T - C3.blues;
      put(S.s, T, { pos: V3(1.35, 2.35 - 0.47, 0.02), yaw: 0.25 * Math.sin(k * 0.8), seq: SEQ.blues });
      S.sign.update(T); S.sign2.update(T);
      S.sign2.group.visible = T > L.blues.words[2].start - 0.2; S.sign.group.visible = !S.sign2.group.visible;
      S.seeds.forEach(([x, y0, z, len, v], i) => { const y = 8 - ((y0 + T * v) % 8); S.pos.set([x + y * 0.08, y, z, x + (y - len) * 0.08, y - len, z], i * 6); });
      S.rg.attributes.position.needsUpdate = true;
      // 小回形针：竖轴高处挂着，慢慢转
      S.clip.setMatrixAt(0, new THREE.Matrix4().compose(V3(0.16, 3.88, 0.05), new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, T * 0.6, 0.35)), V3(1, 1, 1))); S.clip.instanceMatrix.needsUpdate = true;
      S.clipLight.position.set(0.2, 3.9, 0.3);
      // 镜头：原样（远景 → 唱到 blues 推到中景），108.55 起顺竖轴上摇
      const push = smooth((T - (L.blues.words[2].start - 0.2)) / 0.9);
      const base = V3(lerp(-2.2 + Math.min(k, 2.6) * 0.3, 0.9, push), lerp(1.5, 2.15, push), lerp(6.4 - Math.min(k, 2.6) * 0.2, 2.35, push));
      const look = V3(lerp(1.3, 1.55, push), lerp(2.3, 2.25, push), 0);
      // 108.55 起：她抬头，镜头顺着竖轴仰起（方块塔归桥段，从 C3_EXIT 这一帧接走）
      const up = smooth((T - C3.tilt) / (C3.end - C3.tilt));
      bCam.position.copy(base).lerp(V3(...C3_EXIT.cam.pos), up);
      bCam.lookAt(look.lerp(V3(...C3_EXIT.cam.target), up));
      bCam.fov = lerp(38, C3_EXIT.cam.fov, up); bCam.updateProjectionMatrix();
      const head = girl.dancer?.S?.info?.Head?.bone;
      if (head && up > 0) { head.rotateX(-0.36 * up); girl.root.updateMatrixWorld(true); }
      faceUp(T, bCam, { expression: 'neutral' });
      return { scene: S.s, camera: bCam, post: { bloom: { strength: 0.9, threshold: 0.85 }, grade: { saturation: 0.85, warmth: -0.5, vignette: 0.4 } } };
    },
  });

  window.__c3 = { C3, ENTRY, scale, fuseU, seaY, girl, cam, bp: k => girl.dancer.S.info[k].bone.getWorldPosition(new THREE.Vector3()) };
  return shots;
}
