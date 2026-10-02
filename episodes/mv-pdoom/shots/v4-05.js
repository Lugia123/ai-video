// shots/v4-05.js — v4 主歌 3 + 预副歌 3（歌曲时间 74.8–94.8 s），分镜 STORYBOARD-v4.md 第二 / 四 / 五节。
//
//   const shots = await makeV405(mv);   // 先 await initType3D()
//   mv.mount(shots, { offset: 74.8, duration: 20 });
//
// 场景：W3 kits/world4.js 的镜面房间（真平面反射，镜中是另一个场景 → 镜像可以不跟她）和悬空方格舞台。
// 镜中的她 = 第二个 girl 实例（echo），放进 room.mirrorScene.content，坐标写房间坐标。
// 脸：W1 在修 —— 本段全是全身 / 中远景，脸占画高 ≤ 12%，不做脸部近景。
//
// 切点（都在拍上）：
//   74.800 forward     Forward MLP, backward, repeat：她对着镜子前进、后退、重复（每两拍一个来回），镜像晚半拍跟（逐层延迟）；
//                      词写在镜面雾气上（FORWARD / MLP / BACKWARD / REPEAT 逐词抹出）
//   77.961 obsolete    镜子里映出一台旧柜式计算机（磁带盘、指示灯）；NOW VON NEUMANN'S 雾气字，OBSOLETE 印章盖在镜面上（关键词大字）
//   81.143 leftturn    Sharp left turn：她猛地左转（甩镜），镜子里的她没转、还看着她；镜面裂开一道线，字沿裂线出现；
//                      《黑客帝国》：她伸手碰镜面，液态波纹，镜像不伸手；镜面浮出洛伦兹吸引子的两条轨迹，从同一点分岔
//   85.233 cdr         Without a single CDR：镜中一排镜像一个个消失，最后那个转身走进镜子深处，镜子空了；字在镜子下方的空白铭牌上
//   89.324 gato        悬空方格舞台，她在中心独舞；每拍由外向内掉一圈格子，舞步越来越局促；
//                      歌词逐词写在还亮的格子上，格子掉下去字跟着掉；「go」时最后一格灭，她往下掉，仰拍越来越小
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX, textGeo, advance } from '../kits/type3d.js';
import { createMirrorRoom, createGridStage } from '../kits/world4.js';
import { createGirl, createGirlLights, createFormation, loadAnims } from '../kits/girl.js';
import { plate } from '../kits/carriers.js';
import { createLorenz } from '../kits/mathart.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const persp = (fov = 40) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 400);

export async function makeV405(mv) {
  const { music, lyrics } = mv;
  const renderer = mv.stage.renderer;
  const L = p => lyrics.lines.find(l => l.start > 70 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  await loadAnims(['dance__moonwalk', 'dance__slide-step', 'act__look-around', 'act__reach-out', 'act__swagger-walk', 'dance__shuffle', 'dance__arm-wave', 'dance__body-wave', 'move__fall-off-edge', 'move__fall-air', 'act__look-distance']);
  const girl = await createGirl(mv);
  const echo = await createGirl(mv, { points: 400, seed: 777 });
  const echoes = await createFormation(mv, echo, { rows: 1, cols: 5, spacing: [0.78, 1], canon: 0, mirror: false });
  const put = (g, parent, x, z, yaw, s = 1) => { parent.add(g.root); g.root.visible = true; g.root.position.set(x, 0, z); g.root.rotation.set(0, yaw, 0); g.root.scale.setScalar(s); };
  const BACK = Math.PI;   // 面朝镜子（镜子在 z = 0，她在 z > 0）
  const shots = [];

  // 镜面房间镜头的公共部分：房间 + 灯 + 她 + 镜中的她
  function mirrorShot({ fog = [], crack = null, extra = null }) {
    const room = createMirrorRoom({ renderer, width: 4.2, height: 2.7, depth: 5, fog, crack });
    const scene = new THREE.Scene(); scene.background = col('#07070b');
    scene.add(room.group, createGirlLights({ key: 1.8, rim: 2.4, fill: 0.9 }));
    room.mirrorScene.content.add(createGirlLights({ key: 1.8, rim: 2.4, fill: 0.9 }));
    extra?.(scene, room);
    return { scene, room, camera: persp(42) };
  }

  // ================================================================ 74.8 Forward MLP, backward, repeat
  const l23 = L('Forward');
  const fw = l23.words;
  shots.push({
    id: 'forward', t0: 74.8, t1: 77.961,
    build() {
      // 雾气字：逐词（world4 的雾最多 4 块）
      const fog = [
        { text: 'forward', t0: fw[0].start, x: -0.95, y: 2.2, size: 0.5 },
        { text: 'mlp', t0: fw[1].start, x: 1.25, y: 2.2, size: 0.5 },
        { text: 'backward', t0: fw[2].start, x: -0.85, y: 0.5, size: 0.5 },
        { text: 'repeat', t0: fw[3].start, x: 1.2, y: 0.5, size: 0.5 },
      ];
      return mirrorShot({ fog });
    },
    update(S, T) {
      // 前进 / 后退：两拍一个来回（前进时 slide-step，后退时 moonwalk）；镜像晚半拍
      const bp = music.period;
      const ph = ((T - 74.779) / (bp * 2)) % 1;
      const zOf = t => { const p = (((t - 74.779) / (bp * 2)) % 1 + 1) % 1; return 1.95 - 0.55 * Math.sin(Math.PI * p); };
      const seq = [{ t: 74.3, anim: 'dance__moonwalk' }];
      put(girl, S.scene, 0, zOf(T), BACK);
      girl.play(seq, T); girl.setSkin('toon', T);
      echoes.group.visible = false;
      put(echo, S.room.mirrorScene.content, 0, zOf(T - bp * 0.5), BACK);
      echo.play(seq, T - bp * 0.5); echo.setSkin('toon', T);
      const k = (T - 74.8) / 3.16;
      const cam = S.camera;
      cam.position.set(lerp(1.3, 0.6, k), 1.35, lerp(4.7, 4.2, k)); cam.lookAt(-0.1, 1.25, 0);
      cam.updateMatrixWorld();
      S.room.update(T, { camera: cam });
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.6, threshold: 1.0 }, grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 77.961 镜中的旧计算机 + OBSOLETE 印章
  const l24 = L('Now von');
  const obs = l24.words[3];
  shots.push({
    id: 'obsolete', t0: 77.961, t1: 81.143,
    build() {
      const fog = [
        { text: 'now', t0: l24.words[0].start, x: -1.5, y: 2.3, size: 0.42 },
        { text: 'von', t0: l24.words[1].start, x: -0.7, y: 2.3, size: 0.42 },
        { text: "neumann's", t0: l24.words[2].start, x: 0.85, y: 2.3, size: 0.42 },
      ];
      const S = mirrorShot({ fog });
      // 镜子里：一台老式柜式计算机（两盘磁带 + 一排指示灯 + 控制台）
      const pc = new THREE.Group();
      const grey = new THREE.MeshStandardMaterial({ color: '#b8b2a6', roughness: 0.6 }), dark = new THREE.MeshStandardMaterial({ color: '#2a2830', roughness: 0.5 });
      for (const x of [-0.75, 0, 0.75]) {
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.9, 0.5), grey); cab.position.set(x, 0.95, 0); pc.add(cab);
        for (const y of [1.45, 1.0]) { const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 24), dark); reel.rotation.x = Math.PI / 2; reel.position.set(x, y, 0.26); reel.userData.reel = true; pc.add(reel); }
      }
      const lights = [];
      for (let i = 0; i < 18; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.025, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' })); m.position.set(-0.95 + (i % 9) * 0.24, 0.45 + Math.floor(i / 9) * 0.1, 0.26); pc.add(m); lights.push(m); }
      pc.position.set(0, 0, 1.1); pc.rotation.y = BACK;   // 在镜中世界里，面朝镜外
      S.room.mirrorScene.content.add(pc);
      // OBSOLETE 印章：盖在镜面上（关键词大字）
      const st = FX.stamp({ words: [obs], color: PAL.pink, bg: '#1a1a22', angle: -0.18 });
      const sh = new THREE.Group(); sh.add(st.group); sh.scale.setScalar(0.13); sh.position.set(-0.1, 1.45, 0.03);   // stamp 每帧改自己的 position（震屏），套一层再摆
      S.scene.add(sh);
      return { ...S, pc, lights, st };
    },
    update(S, T) {
      put(girl, S.scene, 0.55, 2.3, BACK - 0.25);
      girl.play([{ t: 77.5, anim: 'act__look-around' }], T); girl.setSkin('toon', T);
      echo.root.visible = false; echoes.group.visible = false;
      S.pc.children.forEach(o => { if (o.userData.reel) o.rotation.y = T * 3 * (o.position.y > 1.2 ? 1 : -1); });
      S.lights.forEach((m, i) => m.material.color.set([PAL.pink, PAL.lemon, PAL.mint][(i + Math.floor(T * 6)) % 3]).multiplyScalar(((i * 7 + Math.floor(T * 5)) % 3) ? 1.6 : 0.2));
      S.st.update(T);
      const k = (T - 77.961) / 3.18;
      const cam = S.camera;
      cam.position.set(lerp(1.6, 1.2, k), 1.4, lerp(5.0, 4.4, k)); cam.lookAt(0, 1.3, 0);
      cam.updateMatrixWorld();
      S.room.update(T, { camera: cam });
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.6, threshold: 1.0 }, chroma: 0.1 + (T > obs.start ? 0.5 * Math.exp(-(T - obs.start - 0.11) * 8) : 0), grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 81.143 Sharp left turn：她转了，镜像没转；液态波纹；洛伦兹分岔
  const l25 = L('Sharp');
  const tTurn = 81.597, tReach = 83.415, tTouch = 83.87;
  shots.push({
    id: 'leftturn', t0: 81.143, t1: 85.233,
    build() {
      const fog = [{ text: 'there you are', t0: l25.words[4].start, t1: 1e9, x: -0.2, y: 2.3, size: 0.42 }];
      const S = mirrorShot({ fog, crack: { x: -1.9, y: 0.9, text: 'sharp left turn', seed: 5 } });
      // 洛伦兹：两条初值差 1e-5 的轨迹，浮在镜面上（从同一点出发，逐渐分岔）
      const lz = createLorenz({ scale: 0.05 });
      lz.group.position.set(0.9, 1.35, 0.06); lz.group.scale.setScalar(0.9);
      S.scene.add(lz.group);
      return { ...S, lz };
    },
    update(S, T) {
      // 她：先对着镜子，81.6 猛地左转 90°；83.4 回身伸手碰镜子
      const turn = smooth((T - tTurn) / 0.18) * (Math.PI / 2) * (1 - smooth((T - (tReach - 0.35)) / 0.35));
      const zz = T < tReach ? 1.7 : lerp(1.7, 0.75, eOut((T - tReach) / 0.45));
      put(girl, S.scene, 0.1, zz, BACK + turn);
      girl.play([{ t: 80.6, anim: 'dance__body-wave' }, { t: tReach - 0.15, anim: 'act__reach-out' }], T); girl.setSkin('toon', T);
      // 镜中的她：不转身、不伸手，一直站着看她
      put(echo, S.room.mirrorScene.content, 0.1, 1.7, BACK);
      echo.play([{ t: 80.6, anim: 'act__look-distance' }], T); echo.setSkin('toon', T);
      echoes.group.visible = false;
      S.lz.update(T, { p: clamp((T - 82.0) / 3.0), tail: 0.35 });
      S.lz.group.visible = T > 82.0;
      // 甩镜：转身那一拍镜头猛地往左甩一下再回来
      const whip = T > tTurn ? Math.sin(Math.PI * clamp((T - tTurn) / 0.35)) : 0;
      const k = (T - 81.143) / 4.09;
      const cam = S.camera;
      cam.position.set(lerp(1.5, 1.0, k) - whip * 0.9, 1.4, lerp(4.8, 4.0, k));
      cam.lookAt(-0.1 - whip * 1.4, 1.25, 0);
      cam.updateMatrixWorld();
      S.room.update(T, { camera: cam, ripples: [{ x: 0.35, y: 1.3, t0: tTouch, amp: 1.4 }], crack: { p: smooth((T - tTurn) / 0.7) } });
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.7, threshold: 1.0 }, chroma: 0.12 + 0.6 * whip, grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 85.233 Without a single CDR：镜像一个个消失，镜子空了
  const l26 = L('Without');
  shots.push({
    id: 'cdr', t0: 85.233, t1: 89.324,
    build() {
      const S = mirrorShot({});
      S.room.mirrorScene.add(echoes.group);   // 放在镜中世界根上：克隆的矩阵已含本体（在翻转组里）的世界变换，放进 content 会翻两次
      // 镜子下方的空白铭牌：这句逐词注入光
      const pl = plate({ line: l26, maxW: 10, maxH: 1.6, maxSize: 1.4, metal: '#6d6974' });
      pl.group.scale.setScalar(0.16); pl.group.position.set(0, 0.2, 0.08);
      S.scene.add(pl.group);
      return { ...S, pl };
    },
    update(S, T) {
      // 她：盯着镜子一步步往后退（镜像一个个消失时），最后一个走进镜子深处后，她转身背对镜子
      const back = smooth((T - 85.7) / 2.4), turnAway = smooth((T - 88.3) / 0.45);
      put(girl, S.scene, -0.55, lerp(2.0, 2.7, back), BACK + 0.15 + turnAway * (Math.PI - 0.3));
      girl.play([{ t: 84.8, anim: 'act__look-around' }, { t: 85.69, anim: 'dance__moonwalk' }, { t: 88.3, anim: 'act__look-distance' }], T); girl.setSkin('toon', T);
      // 镜中：五个她站成一排；85.7 起每拍消失一个（先闪两下），最后中间那个转身走进镜子深处
      const bp = music.period;
      const walk = clamp((T - 87.96) / 1.3);
      put(echo, S.room.mirrorScene.content, 0, lerp(1.5, 5.5, eIn(walk)), walk > 0 ? 0 : BACK);
      echo.play(walk > 0 ? [{ t: 87.9, anim: 'act__swagger-walk' }] : [{ t: 84.8, anim: 'act__look-distance' }], T); echo.setSkin('toon', T);
      echo.root.visible = walk < 0.98;
      echoes.group.visible = true;
      echoes.update(T, { seq: walk > 0 ? [{ t: 87.9, anim: 'act__swagger-walk' }] : [{ t: 84.8, anim: 'act__look-distance' }] });
      echoes.slots.forEach(sl => { if (sl.hull) sl.hull.visible = false; });
      const order = [0, 3, 1, 2];
      echoes.slots.forEach((sl, i) => {
        const tOff = 85.688 + order.indexOf(i) * bp;
        const k = T - tOff;
        sl.g.visible = k < 0 || (k < 0.18 && Math.floor(k / 0.045) % 2 === 1);
      });
      S.pl.update(T);
      const k = (T - 85.233) / 4.09;
      const cam = S.camera;
      cam.position.set(lerp(0.9, 0.35, k), lerp(1.35, 1.25, k), lerp(6.2, 5.2, eIO(k))); cam.lookAt(lerp(0, -0.25, k), 1.05, 0);   // 慢推（她始终整个在画内，脸 ≤ 12%）
      cam.updateMatrixWorld();
      S.room.update(T, { camera: cam });
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.6, threshold: 1.0 }, grade: { vignette: 0.4 } } };
    },
  });

  // ================================================================ 89.324 Gato：悬空方格舞台，一圈圈掉，最后她掉下去
  const l27 = L('Gato');
  const gw = l27.words;
  const ringTimes = [90.688, 92.051, 93.415, 94.324];          // 外圈 → 里圈（第 4 圈没字先掉；Gato / please 在第 3 圈）
  const lastTime = 94.55;                                       // 「go」开口后，最后一格灭
  // 词写在哪一格（9×9，中心 (4,4)）：按圈掉落时刻排，词所在的圈都等它唱完才掉
  const cellOf = [[4, 1], [6, 1], [3, 2], [5, 2], [4, 3], [4, 4]];   // 第 3 圈 / 第 3 圈 / 第 2 圈 ×2 / 第 1 圈 / 中心：都在她周围、画面中部
  shots.push({
    id: 'gato', t0: 89.324, t1: 94.8,
    build() {
      const grid = createGridStage({ n: 9, cell: 0.9 });
      const scene = new THREE.Scene(); scene.background = col('#07070d');
      scene.fog = new THREE.Fog('#07070d', 14, 40);
      scene.add(grid.group, createGirlLights());
      const halo = new THREE.Mesh(new THREE.CircleGeometry(7, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { a: { value: 0 }, c: { value: col(PAL.pink) }, d: { value: col(PAL.lemon) } },
        vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader: 'uniform float a; uniform vec3 c, d; varying vec2 v; void main(){ float r = length(v-0.5)*2.0; vec3 k = mix(d*1.6, c*0.9, smoothstep(0.0,0.6,r)); gl_FragColor = vec4(k * a, a * (1.0 - smoothstep(0.4,1.0,r))); }' }));
      halo.rotation.x = Math.PI / 2; halo.position.set(0, 7, 0); halo.scale.setScalar(1.6); scene.add(halo);
      // 格子上的字：挂在对应格子上（跟着一起掉）；唱到才亮
      const n = grid.n, tiles = grid.group.children.slice(0, n * n);
      const words = gw.map((w, k) => {
        const [i, j] = cellOf[k];
        const text = w.w.replace(/[,.]/g, '').toUpperCase();
        const a = advance('anton', text, 1), sz = Math.min(0.82 / a, 0.42);
        const m = new THREE.Mesh(textGeo('anton', text, { size: sz }), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(1.2), transparent: true }));
        m.rotation.x = -Math.PI / 2; m.position.set(-a * sz / 2, 0.012, sz * 0.36);
        tiles[i * n + j].add(m);
        return { w, m };
      });
      return { scene, grid, words, halo, camera: persp(40) };
    },
    update(S, T) {
      S.grid.update(T, { ringTimes, lastTime });
      for (const W of S.words) { const k = T - W.w.start; W.m.visible = k >= 0; W.m.material.color.set(k < 0.1 ? '#ffffff' : W.w.i % 2 ? PAL.pink : PAL.lemon).multiplyScalar(k < 0.1 ? 1.6 : 1.15); }
      // 她：中心独舞，舞步越来越小（shuffle → arm-wave → body-wave）；最后一格灭后往下掉
      const fall = Math.max(0, T - lastTime - 0.06);
      put(girl, S.scene, 0, 0, 0.5);
      girl.root.position.y = -4.9 * fall * fall;
      girl.play([{ t: 89.0, anim: 'dance__shuffle' }, { t: 91.1, anim: 'dance__arm-wave' }, { t: 92.9, anim: 'dance__body-wave' }, { t: lastTime - 0.3, anim: 'move__fall-off-edge' }, { t: lastTime + 0.15, anim: 'move__fall-air' }], T);
      girl.setSkin('toon', T);
      // 机位：斜上方慢环绕 → 最后仰拍（从下往上看她掉下来，越来越小）
      const cam = S.camera;
      S.halo.material.uniforms.a.value = 0;
      if (T < lastTime) {
        const k = (T - 89.324) / (lastTime - 89.324);
        const a = lerp(-0.6, 0.4, k);
        cam.position.set(Math.sin(a) * lerp(5.6, 3.8, k), lerp(3.4, 2.0, k), Math.cos(a) * lerp(5.6, 3.8, k)); cam.lookAt(0, 0.45, 0);
      } else {
        const k = clamp((T - lastTime) / 0.25);
        S.halo.material.uniforms.a.value = smooth(k / 0.4);
        const gy = girl.root.position.y;
        cam.position.set(lerp(1.0, 4.2, eOut(k)), gy + lerp(2.6, -1.6, eOut(k)), lerp(4, 3.4, k)); cam.lookAt(0, gy + lerp(0.5, 1.6, eOut(k)), 0);   // 跟着她往下掉、侧下方微仰：先掉的格子在她下面，不挡人；头顶那圈光越来越远   // 从下往上仰拍：她是头顶那圈光前的剪影，越掉越近 / 越来越小
      }
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.12 + 0.3 * kick(T), grade: { vignette: 0.35 } } };
    },
  });

  return shots;
}
