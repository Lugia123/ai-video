// shots/v4-01.js — v4 钩子 + 主歌 1 + 预副歌 1（歌曲时间 0–22.1 s），分镜 STORYBOARD-v4.md 第二 / 四 / 五节。
//
//   const shots = await makeV401(mv);   // 先 await initType3D()
//   mv.mount(shots, { offset: 0, duration: 22.1 });
//
// 切点（钩子按八分音符，其余在拍上）：
//    0.000 hook-slam     霓粉底，黑色 3D 巨字 P(DOOM) 砸下（关键词大字）
//    0.465 hook-fourier  傅里叶本轮：几十个旋转圆的笔尖画出她的舞姿剪影 → 0.78 剪影变成整列几十个她定格在同一舞姿
//    0.919 hook-099      铬色 0.99 高速旋转 → 1.3 闪黑
//    1.374 eye           《2001》HAL：黑底红色镜头光圈 → 一眨眼变成彩色巨眼（虹膜 = 玫瑰线叠加），火花从瞳孔喷出；
//                        火花拖尾在眼上方写出「I see sparks of」（只停 2 s）
//    3.420 comicA        漫画页 A：卧室里她捧手机 → 屏幕「AGI / in your eyes」→ 恋爱游戏：她脸红冒汗 DOKI DOKI、电路线画的 AI 脸冲她眨眼 → 尴尬耸肩
//    9.783 comicL        漫画页 L：一整格窗户 → 穿进格子：发光小球（模型）沿损失曲线过山车俯冲，歌词刻在轨道上；谷底数据点排成网格、神经网络全亮
//   12.965 comicS        漫画页 S：身份互换两格对照（她翘腿坐椅子发号施令 / 手机坐她的椅子、她端托盘），USER / ASSISTANT 标签翻转，BOSS 印章弹出纸面
//   16.601 comicF        漫画页 F（翻页）：《恐怖小店》式气泡食人花，FEED ME；她逐词求饶；alive 一口扑来 → 镜头进它嘴里（曼德博）→ 接副歌 1
// 除 P(DOOM) / 0.99 / BOSS 外，歌词全部走载体：火花拖尾、聊天气泡、输入框、滑道刻字、地面字。所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX, textGeo, advance, lineMat } from '../kits/type3d.js';
import { createEye, createCity, chromeMatcap } from '../kits/world.js';
import { createGirl, createGirlLights, createFormation, loadAnims } from '../kits/girl.js';
import { createUI2D, hash } from '../kits/ui2d.js';
import { floorWords } from '../kits/carriers.js';
import { makeV401Comic } from './v4-01-comic.js';
import { textTexture, placeOnFrame } from '../kits/world4.js';
import { createFourier, createRoses } from '../kits/mathart.js';
import { Line2 } from '../../../assets/vendor/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '../../../assets/vendor/three/examples/jsm/lines/LineGeometry.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const persp = (fov = 30) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 800);
const scn = bg => { const s = new THREE.Scene(); s.background = col(bg); return s; };
function screenLayer(camera, scene, dist = 10) {
  const g = new THREE.Group(); g.position.z = -dist; g.scale.setScalar(dist / 40); camera.add(g); scene.add(camera); return g;
}

export async function makeV401(mv) {
  const { music, lyrics } = mv;
  const renderer = mv.stage.renderer;
  const L = i => lyrics.lines[i];
  const beats = mv.audio.beats;
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  await loadAnims(['move__sprint', 'move__run-slide', 'dance__slide-walk', 'act__look-distance', 'dance__shuffle']);
  const girl = await createGirl(mv);
  const crew = await createFormation(mv, girl, { rows: 2, cols: 13, spacing: [0.9, 1.4], canon: 0, mirror: false });
  const ui = await createUI2D(mv);
  const D = ui.draw;
  const putGirl = (scene, x, y, z, yaw = 0, s = 1) => { scene.add(girl.root); girl.root.visible = true; girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(s); };
  const shots = [];

  // ================================================================ 0.000 P(DOOM) 砸下
  shots.push({
    id: 'hook-slam', t0: 0, t1: 0.465,
    build() {
      const scene = scn(PAL.pink), camera = persp();
      const fx = FX.slam({ words: [{ w: 'P(DOOM)', start: -0.13, end: 0.45 }], bg: PAL.pink, maxW: 22, maxH: 10, maxSize: 10, tilt: [-0.16, 0.3, 0.03], kick: 2 });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(S, T) {
      S.fx.update(T);
      S.camera.position.set(0, 0, 40 - 3 * eOut(T / 0.465)); S.camera.lookAt(0, 0, 0);
      const hit = T > 0.0 ? Math.exp(-T / 0.1) : 0;
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.2, chroma: 0.2 + 0.8 * hit, grade: { vignette: 0.2 } } };
    },
  });

  // ================================================================ 0.465 傅里叶本轮画舞姿 → 整列定格
  const tForm = 0.74;
  const FREEZE = [{ t: 0, anim: 'dance__shuffle' }];
  shots.push({
    id: 'hook-fourier', t0: 0.465, t1: 0.919,
    build() {
      const sA = scn(PAL.ink), cA = persp(30);
      // 剪影按包围盒自动缩放到画面高 ~75%、居中
      const probe = createFourier({ scale: 1, terms: 40 });
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (let i = 0; i <= 200; i++) { const [x, y] = probe.evalAt(i / 200 * Math.PI * 2); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const SC = 6.8 / (y1 - y0);
      const four = createFourier({ scale: SC, terms: 40 });
      four.group.position.set(-(x0 + x1) / 2 * SC, -(y0 + y1) / 2 * SC, 0); sA.add(four.group);
      // 笔尖画出来的剪影再描一道粗霓虹线（mathart 的线是 1px，太细）+ 背后一团暗粉光，画面不空
      const M = 400, fat = [];
      for (let i = 0; i <= M; i++) { const [x, y] = four.evalAt(i / M * Math.PI * 2); fat.push(V(x * SC, y * SC, 0.02)); }
      const lg = new LineGeometry(); lg.setPositions(fat.flatMap(p => [p.x, p.y, p.z]));
      const trail = new Line2(lg, lineMat(col(PAL.lemon).multiplyScalar(1.6), 7)); trail.computeLineDistances(); trail.userData.n = M;
      four.group.add(trail);
      const halo = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { c: { value: col(PAL.pink) } },
        vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader: 'uniform vec3 c; varying vec2 v; void main(){ float d = length(v-0.5)*2.0; gl_FragColor = vec4(c * 0.35 * (1.0 - smoothstep(0.0, 1.0, d)), 1.0 - smoothstep(0.0, 1.0, d)); }' }));
      halo.position.set(0, 0, -1); sA.add(halo);
      cA.position.set(0, 0, 15.5); cA.lookAt(0, 0, 0);
      const sB = scn('#0a0710'), cB = persp(38);
      sB.add(createGirlLights({ key: 2.2, rim: 3, fill: 0.8 }));
      sB.fog = new THREE.Fog('#0a0710', 8, 26);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#141018', roughness: 0.3, metalness: 0.6 }));
      floor.rotation.x = -Math.PI / 2; sB.add(floor);
      sB.add(crew.group);
      return { sA, cA, four, sB, cB, trail };
    },
    update(S, T) {
      if (T < tForm) {
        const pf = lerp(0.4, 1, eOut((T - 0.465) / (tForm - 0.465 - 0.02)));   // 切进来时已画了四成，第一帧不空
        S.four.update(T, { p: pf });
        S.trail.geometry.instanceCount = Math.floor(S.trail.userData.n * pf);
        return { scene: S.sA, camera: S.cA, post: { bloom: { strength: 1.1, threshold: 0.9 }, grade: { vignette: 0.3 } } };
      }
      // 剪影 → 整列几十个她，同一个舞姿定格（时间冻在 0.35 s）
      putGirl(S.sB, 0, 0, 0);
      girl.play(FREEZE, 0.35); girl.setSkin('toon', T);
      crew.update(0.35, { seq: FREEZE });
      const k = (T - tForm) / (0.919 - tForm);
      S.cB.position.set(lerp(2.6, 2.2, k), 0.55, lerp(3.4, 3.0, k)); S.cB.lookAt(-0.8, 0.75, -2.5);
      return { scene: S.sB, camera: S.cB, post: { bloom: { strength: 0.6, threshold: 1.1 }, grade: { vignette: 0.35 }, flash: { amount: 0.5 * Math.exp(-(T - tForm) / 0.06), color: PAL.pink } } };
    },
  });

  // ================================================================ 0.919 铬色 0.99 → 1.3 闪黑
  shots.push({
    id: 'hook-099', t0: 0.919, t1: 1.374,
    build() {
      const scene = scn(PAL.ink), camera = persp();
      const size = 9.5, text = '0.99';
      const geo = textGeo('anton', text, { size, depth: size * 0.35, bevel: size * 0.03, curve: 6 }).clone();
      geo.translate(-advance('anton', text, size) / 2, -size * 0.36, 0);
      const mesh = new THREE.Mesh(geo, new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(1.45, 1.45, 1.45) }));
      scene.add(mesh);
      return { scene, camera, mesh };
    },
    update(S, T) {
      const k = T - 0.919;
      S.mesh.rotation.y = -Math.PI * 2 * (1 - eOut(k / 0.16)) + 0.2;   // 整一圈后停在正面（字不会是背面 / 镜像）
      S.mesh.scale.setScalar(lerp(0.75, 1.05, eOut(k / 0.25)));
      S.camera.position.set(0, 0, 36 - 4 * k); S.camera.lookAt(0, 0, 0);
      const dark = smooth((T - 1.29) / 0.06);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.4, threshold: 1.0 }, chroma: 0.35, grade: { vignette: 0.3 }, flash: { amount: dark, color: '#000000' } } };
    },
  });

  // ================================================================ 1.374 HAL 红镜头 → 彩色巨眼（玫瑰线虹膜）+ 火花写字
  const l0 = L(0);
  const tBlink = 1.83;
  const sparkW = l0.words.find(w => /spark/.test(w.w));
  shots.push({
    id: 'eye', t0: 1.374, t1: 3.42,
    build() {
      const scene = scn('#000000'), camera = persp();
      // HAL：黑底上一枚红色镜头光圈（同心环 + 发光的红芯）
      const hal = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshBasicMaterial({ color: '#16080a' })); hal.add(disc);
      [3.2, 2.7, 2.2].forEach((r, i) => { const m = new THREE.Mesh(new THREE.RingGeometry(r - 0.08, r, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35 + i * 0.1, 0.35 + i * 0.1, 0.4 + i * 0.1) })); m.position.z = 0.01; hal.add(m); });
      const core = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), new THREE.ShaderMaterial({
        transparent: true, uniforms: { k: { value: 1 } },
        vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader: 'uniform float k; varying vec2 v; void main(){ float d = length(v-0.5)*2.0; vec3 c = mix(vec3(4.0,1.4,0.5), vec3(1.4,0.02,0.02), smoothstep(0.0,0.35,d)); c *= 1.0 - smoothstep(0.7,1.0,d); c += vec3(3.0,3.0,2.5) * (1.0 - smoothstep(0.0,0.08,length(v-vec2(0.4,0.6)))); gl_FragColor = vec4(c*k, 1.0); }',
      }));
      core.position.z = 0.02; hal.add(core);
      scene.add(hal);
      const eye = createEye({ width: 30 });
      scene.add(eye.mesh);
      const roses = createRoses({ count: 40, radius: 3.9 });
      roses.group.position.z = 0.3; scene.add(roses.group);
      // 火花拖尾写字：眼睛上方一道弧（只写 I see sparks of；AGI 下一镜在聊天里）
      const arc = [];
      for (let k = 0; k <= 10; k++) { const a = lerp(Math.PI * 0.82, Math.PI * 0.18, k / 10); arc.push([13.5 * Math.cos(a), -1.2 + 8.6 * Math.sin(a), 0]); }
      const words = l0.words.filter(w => w.start < 3.6);
      const trail = FX.curve({ words, points: arc, color: PAL.paper, accent: PAL.lemon, lineColor: PAL.pink, glow: 1.25 });
      const tg = new THREE.Group(); tg.position.z = 1.5; tg.add(trail.group); scene.add(tg);
      // 眼睑：黑色上下帘（眨眼用）
      const lidM = new THREE.MeshBasicMaterial({ color: '#000000' });
      const lidT = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), lidM), lidB = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), lidM);
      lidT.position.z = lidB.position.z = 5; scene.add(lidT, lidB);
      return { scene, camera, hal, core, eye, roses, trail, lidT, lidB };
    },
    update(S, T) {
      const halOn = T < tBlink;
      // 眨眼：1.83 前后 0.14 s 帘子合上再打开；合上那一刻换成彩色巨眼
      const b = 1 - Math.abs(clamp((T - (tBlink - 0.07)) / 0.14) * 2 - 1);
      const close = T > tBlink - 0.07 && T < tBlink + 0.07 ? b : 0;
      S.lidT.position.y = lerp(20, 10, close); S.lidB.position.y = lerp(-20, -10, close);
      S.hal.visible = halOn; S.hal.scale.setScalar(1.7 + 0.08 * Math.sin(T * 6));
      S.core.material.uniforms.k.value = 0.9 + 0.2 * Math.sin(T * 9);
      S.eye.mesh.visible = !halOn; S.roses.group.visible = !halOn;
      const k = T - tBlink;
      const sparks = T < sparkW.start ? 0.2 : clamp(0.5 + 0.5 * Math.exp(-(T - sparkW.start) / 0.6) + 0.5 * kick(T));
      S.eye.update(T, { open: halOn ? 0 : smooth(k / 0.3), pupil: 0.35 + 0.1 * kick(T), sparks, spin: 1.2, glow: 0.8 });
      S.roses.update(T, { open: smooth(k / 0.35), spin: 0.35, beat: kick(T) });
      S.trail.update(T);
      S.camera.position.set(0, 0.3, 42 - 5 * eOut((T - 1.374) / 2)); S.camera.lookAt(0, 0.8, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.9, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T), grade: { vignette: 0.35 } } };
    },
  });

  // 3.42–22.1：四页动态漫画（shots/v4-01-comic.js，#945 / #946）
  shots.push(...await makeV401Comic(mv, { ui }));
  return shots;
}
