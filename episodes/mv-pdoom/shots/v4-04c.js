// shots/v4-04c.js — v4 副歌 3（歌曲时间 94.8–109.3 s），STORYBOARD-v4 第二节「副歌 3」+ 第四、五节。
//
//   const { shots, cuts } = await makeV404c(mv, { ui, girl });   // ui = await createUI2D(mv)；girl = await createGirl(mv)（动捕先 loadAnims(ANIMS)）
//   mv.mount(shots, { offset: 94.8, duration: 14.5 });
//
//   94.8  fall       接上一段的坠落：她从上往下掉（move__fall-air），穿过一块写着 P(DOOM) 0.81 的巨型铬字板，唱到 P(doom) 时板沃罗诺伊碎开
//   97.05 clips      落进回形针之海，翻滚站起（move__fall-roll）接主舞；四周整列从回形针里站起来，比她快半拍（createFormation canon < 0）；
//                    「PAPERCLIPS」由回形针落成字，铺在她面前
//   98.87 killswitch 镜头推进关机按钮旁的屏幕 → 2D：邮件界面，光标点「EMERGENCY SHUTDOWN」，弹回一封自动回复（Killswitch guy's on PTO）
//  101.14 buried     回 3D 航拍：回形针雨把整列埋掉，只剩她在跳；这句逐词踩亮在她脚下一圈
//  102.51 fuse       航拍夜城：火花沿希尔伯特曲线（开场那条电路）烧向城中心；这句沿引信逐词点燃（carriers.fuse）
//  106.14 blues      全片唯一冷蓝：雨里，她坐在坐标轴（像路灯杆）的横臂上晃腿（《雨中曲》致敬的 sit-swing-legs 版），霓虹灯牌写这句（carriers.ledSign）
// 关键词大字只有 P(DOOM) / 0.81；其余全部走载体。她的脸占画高 ≤ 12%（W1 在修脸，不拍脸部近景）。所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { advance } from '../kits/type3d.js';
import { createGirlLights, createFormation } from '../kits/girl.js';
import { floorWords, fuse, ledSign } from '../kits/carriers.js';
import { createPaperclips, createCity, mulberry32 } from '../kits/world.js';
import { createShatter, sampleText } from '../kits/vfx.js';
import { createHilbert } from '../kits/mathart.js';

export const ANIMS = ['move__fall-air', 'move__fall-roll', 'dance__kick-step', 'dance__raise-roof', 'dance__jazz-around', 'act__sit-swing-legs'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const BLUE = PAL.blue;

function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.start > 90 && x.text.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`v4-04c：找不到歌词「${prefix}」`);
  return l;
}
export function cuts(mv) {
  const L = { up: lineOf(mv, "I'm upping"), clips: lineOf(mv, 'as paperclips'), pto: lineOf(mv, 'Killswitch'), go: lineOf(mv, 'Now there'), fuse: lineOf(mv, 'Too late'), blues: lineOf(mv, 'Orthogonality') };
  const B = mv.audio.beats;
  const after = t => B.find(b => b >= t - 0.05);                          // 这一句唱完（或下一句开唱）之后的第一个拍
  const c = { start: 94.8, end: 109.3 };
  c.clips = after(L.up.end); c.pto = after(L.clips.end); c.buried = after(L.go.start + 0.3); c.fuse = after(L.fuse.start); c.blues = after(L.blues.start + 0.1);
  return { c, L };
}

const persp = (fov = 40) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 600);
const scn = (bg = PAL.ink) => { const s = new THREE.Scene(); s.background = col(bg); return s; };
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group(); g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g); scene.add(camera); g.userData.pointK = d / 40; return g;
}
// 屏幕层里的 PointsMaterial：点径按真实距离衰减，挪到 d 处会放大 40/d 倍 → 着色器里乘回去（同 c1）
function fixPoints(ov) {
  const k = ov.userData.pointK;
  ov.traverse(o => {
    const m = o.isPoints && o.material;
    if (!m || !m.isPointsMaterial || m.userData.pointK) return;
    m.userData.pointK = k;
    m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('gl_PointSize = size;', `gl_PointSize = size * ${k.toFixed(6)};`); };
    m.customProgramCacheKey = () => `pk${k}`; m.needsUpdate = true;
  });
}

// ================================================================ 镜头
export async function makeV404c(mv, { ui, girl = null } = {}) {
  const { c, L } = cuts(mv);
  const A = mv.audio, P = A.beat_period;
  const beatIdx = T => A.beats.filter(b => b <= T + 1e-3).length - 1;
  const kick = T => Math.exp(-(T - A.beats[beatIdx(T)]) * 9);
  const shots = [];
  const put = (scene, T, { x = 0, y = 0, z = 0, yaw = 0, seq, scale = 1, skin = 'toon' }) => {
    if (!girl) return;
    scene.add(girl.root);
    girl.root.visible = true; girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(scale);
    girl.play(seq, T); girl.setSkin(skin, T);
  };

  // 编排（每个数组只建一次：girl.play 按数组身份缓存）
  const tLand = c.clips + 0.05;
  const SEQ_FALL = [{ t: c.start - 2, anim: 'move__fall-air' }];
  const SEQ_CLIPS = [{ t: tLand - 0.2, anim: 'move__fall-roll' }, { t: tLand + 1.6, anim: 'dance__kick-step' }];
  const SEQ_DANCE = [{ t: c.start, anim: 'dance__kick-step' }, { t: c.pto, anim: 'dance__raise-roof' }, { t: c.fuse, anim: 'dance__jazz-around' }];
  const SEQ_BLUES = [{ t: c.blues - 0.3, anim: 'act__sit-swing-legs' }];

  // ---------------------------------------------------------------- 1. 坠落穿过 0.81
  const tSmash = L.up.words[3].start;                                   // 唱到「P(doom)」那一刻她穿过板
  const fallY = T => (tSmash - T) * 5.5;                                 // 匀速下坠（相对板面高度）
  shots.push({
    id: 'v404c-1-fall', t0: c.start, t1: c.clips, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#05050a'), cam = persp(48);
      scene.add(createGirlLights({ key: 1.6, rim: 3 }));
      // 铬字板贴图：黑镜面 + 铬色渐变大字（关键词大字：P(DOOM) / 0.81）
      const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 900;
      const g = cv.getContext('2d');
      g.fillStyle = '#0c0c14'; g.fillRect(0, 0, 1600, 900);
      g.strokeStyle = PAL.pink; g.lineWidth = 14; g.strokeRect(20, 20, 1560, 860);
      const chrome = (y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#9aa3b4'); gr.addColorStop(0.52, '#3a3f4c'); gr.addColorStop(0.7, '#e8ecf2'); gr.addColorStop(1, '#7c8494'); return gr; };
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '170px "UIAnton", "Anton", sans-serif'; g.fillStyle = chrome(90, 290); g.fillText('P(DOOM)', 800, 190);
      g.font = '520px "UIAnton", "Anton", sans-serif'; g.fillStyle = chrome(330, 860); g.fillText('0.81', 800, 590);
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const slab = createShatter({ width: 12, height: 6.75, cells: 60, seed: 81, texture: tex, impact: [0, 0], thickness: 0.18, color: PAL.paper });
      const holder = new THREE.Group(); holder.rotation.x = -Math.PI / 2; holder.add(slab.group); scene.add(holder);   // 字面朝上：相机在她头顶往下看，她朝着字板坠下去
      // 下坠速度线（往上刷）
      const rnd = mulberry32(5), N = 90, pos = new Float32Array(N * 6), seeds = [];
      for (let i = 0; i < N; i++) seeds.push([(rnd() - 0.5) * 10, (rnd() - 0.5) * 10, rnd() * 20, 0.6 + rnd() * 1.4]);
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const streaks = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: hdr(PAL.mint, 1.6), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, toneMapped: false })); streaks.frustumCulled = false; scene.add(streaks);
      return { scene, cam, slab, seeds, pos, lg };
    },
    update(S, T) {
      const y = fallY(T);
      put(S.scene, T, { y: y - 0.5, seq: SEQ_FALL, yaw: T * 0.6 });
      S.slab.update(T, { crack: smooth((T - (tSmash - 0.35)) / 0.3), shatter: Math.max(0, T - tSmash) * 1.6 });
      // 相机在她头顶上方跟着一起掉，往下看：她在画面中间，下面是越来越近的 0.81；撞穿后相机也穿过去
      const cy = y + 4.2;
      S.cam.position.set(Math.sin(T * 0.7) * 0.6, cy, 1.4); S.cam.up.set(0, 0, -1); S.cam.lookAt(0, y - 3, 0);
      S.seeds.forEach(([x, z, o, len], i) => { const yy = cy - 2 - ((o + T * 18) % 20) + 4; S.pos.set([x, yy, z, x, yy + len, z], i * 6); });
      S.lg.attributes.position.needsUpdate = true;
      const hit = T > tSmash ? Math.exp(-(T - tSmash) * 6) : 0;
      return { scene: S.scene, camera: S.cam, post: { bloom: { strength: 0.6, threshold: 1.2 }, chroma: 0.2 + 0.8 * hit, flash: hit * 0.3 } };
    },
  });

  // ---------------------------------------------------------------- 2. 回形针之海 + 快半拍的整列 + 回形针拼字
  let form = null;
  if (girl) form = await createFormation(mv, girl, { rows: 3, cols: 5, spacing: [1.15, 1.4], canon: -0.5, mirror: false });
  const SEA_Y = 0.12;                                                   // 回形针只铺地面一层
  // 回形针海：地面一层，压暗、降饱和（背景 30% 亮度），让人和字跳出来
  const dimSea = mesh => { mesh.material.color.setRGB(0.3, 0.3, 0.32); const g = new THREE.Color(0.55, 0.55, 0.58); for (let i = 0; i < mesh.count; i++) mesh.setColorAt(i, g); mesh.instanceColor.needsUpdate = true; };
  // PAPERCLIPS：立起来的字墙，在整列身后上方（面向镜头），笔画用更密更亮的柠黄针
  const NW = 3400, WORD_Z = -4.6, WORD_Y = 2.35;
  const clipText = await sampleText('PAPERCLIPS', NW, { height: 1.05, depth: 0.05, seed: 4 });
  const txt = new Float32Array(NW * 3);
  for (let i = 0; i < NW; i++) { txt[i * 3] = clipText[i * 3]; txt[i * 3 + 1] = WORD_Y + clipText[i * 3 + 1]; txt[i * 3 + 2] = WORD_Z + clipText[i * 3 + 2]; }
  const clipsShot = { id: 'v404c-2-clips', t0: c.clips, t1: c.pto, transitionIn: { kind: 'cut' } };
  shots.push(clipsShot);
  clipsShot.build = () => {
    const scene = scn('#07060c'), cam = persp(40);
    scene.fog = new THREE.Fog('#07060c', 5, 16);
    scene.add(createGirlLights({ key: 2.4, rim: 3.0 }));
    const sea = createPaperclips({ count: 9000, seed: 3, clipSize: 0.13 }); dimSea(sea.mesh); scene.add(sea.mesh);
    const fore = createPaperclips({ count: 160, seed: 23, clipSize: 0.13 }); fore.mesh.position.z = -1.6; scene.add(fore.mesh);   // 少量飞落，落在她身后（不从镜头前擦过）
    const word = createPaperclips({ count: NW, seed: 9, clipSize: 0.07 }); scene.add(word.mesh);
    const gold = new THREE.Color(PAL.lemon).multiplyScalar(2.6); for (let i = 0; i < NW; i++) word.mesh.setColorAt(i, gold); word.mesh.instanceColor.needsUpdate = true;
    if (form) scene.add(form.group);
    return { scene, cam, sea, fore, word };
  };
  clipsShot.update = (S, T) => {
    const k = T - c.clips;
    S.sea.update(T, { t0: c.clips - 30, dur: 1, height: SEA_Y, radius: 9, clear: 0.35 });
    S.fore.update(T, { t0: c.clips, dur: c.pto - c.clips, height: SEA_Y, radius: 2.4, drop: 2.2 });
    S.word.update(T, { t0: L.clips.words[1].start - 0.25, dur: 0.9, targets: txt, drop: 5 });
    put(S.scene, T, { y: SEA_Y, seq: SEQ_CLIPS });
    if (form) {
      form.update(T, { seq: SEQ_DANCE });
      form.slots.forEach(sl => { if (sl.r === 0) sl.g.visible = false; });   // 前排只留她本人：后两排是快半拍 / 快一拍的模仿者
      form.group.position.y = -1.2 * (1 - eOut((T - (tLand + 0.5)) / 0.8));   // 从回形针里站起来
    }
    // 低机位中景：她占画高约一半，身后三排整列（后排比她快半拍、一拍），头顶上方是回形针字墙
    const sway = Math.sin(k * 0.9) * 0.35;
    S.cam.position.set(0.35 + sway, 0.72, 2.6 - k * 0.12); S.cam.lookAt(0.05, 0.95, -1.5);
    return { scene: S.scene, camera: S.cam, post: { bloom: { strength: 0.7, threshold: 1.0 }, chroma: 0.15 * kick(T), grade: { saturation: 0.85, vignette: 0.35 } } };
  };

  // ---------------------------------------------------------------- 3. 关机按钮旁的屏幕 → 2D 自动回复
  const pw = L.pto.words, tClick = pw[1].start, tReply = pw[2].start, tStamp = pw[3].start;
  const tFlat = A.beats[beatIdx(c.pto) + 1];                             // 推镜一拍后转纯 2D
  const drawUI = (ctx, T) => {
    // 左：邮件（自动回复，正文逐词打出这句）；右：红色紧急关机按钮 + 光标
    ui.draw.mail(ctx, { x: 150, y: 110, w: 1100, h: 860 }, T, {
      from: 'killswitch-guy@lab.ai', subject: 'Out of office', at: tReply, stampAt: tStamp, size: 40,
      body: pw.map(w => ({ ...w, w: w.w })).concat([{ w: '—', start: tStamp + 0.2, end: tStamp + 0.4 }, { w: 'back', start: tStamp + 0.45, end: tStamp + 0.6 }, { w: 'never.', start: tStamp + 0.65, end: tStamp + 0.9 }]),
      inbox: [{ from: 'safety-team@lab.ai', subject: 'ALERT: runaway' }, { from: 'ops@lab.ai', subject: 'shutdown?' }, { from: 'ceo@lab.ai', subject: 'ship it' }],
    });
    const pressed = T >= tClick && T < tClick + 0.18, bounce = T >= tClick ? Math.sin((T - tClick) * 30) * Math.exp(-(T - tClick) * 6) * 22 : 0;
    ui.rrect(ctx, 1330 + 10, 330 + 10, 440, 300, 36); ctx.fillStyle = PAL.ink; ctx.fill();
    ui.rrect(ctx, 1330 + (pressed ? 8 : 0) + bounce, 330 + (pressed ? 8 : 0), 440, 300, 36); ctx.fillStyle = '#e8303a'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.fillStyle = PAL.paper; ctx.font = `74px ${ui.F.anton}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('EMERGENCY', 1550 + bounce, 440); ctx.fillText('SHUTDOWN', 1550 + bounce, 530); ctx.textAlign = 'left';
    // 光标：从左下滑到按钮上，点下去，被弹开
    const cx = T < tClick ? lerp(1100, 1560, eOut((T - c.pto) / (tClick - c.pto))) : 1560 + (T - tClick) * 260, cy = T < tClick ? lerp(900, 520, eOut((T - c.pto) / (tClick - c.pto))) : 520 + (T - tClick) * 340;
    ctx.save(); ctx.translate(cx, cy); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 64); ctx.lineTo(17, 48); ctx.lineTo(30, 76); ctx.lineTo(42, 70); ctx.lineTo(29, 43); ctx.lineTo(50, 43); ctx.closePath(); ctx.fillStyle = PAL.paper; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke(); ctx.restore();
  };
  shots.push({
    id: 'v404c-3-killswitch', t0: c.pto, t1: c.buried, transitionIn: { kind: 'whip', dur: 0.26, dir: 1 },
    build() {
      const S2 = ui.surface(1920, 1080), flat = ui.stage2D(S2);
      const scene = scn('#0a0a10'), cm = persp(35);
      scene.add(new THREE.HemisphereLight('#fff', '#223', 1.2)); const dl = new THREE.DirectionalLight('#fff', 1.6); dl.position.set(2, 4, 3); scene.add(dl);
      const mon = ui.device('laptop', S2, { width: 3.2 }); mon.group.position.set(0.3, 0, 0); scene.add(mon.group);
      const desk = new THREE.Mesh(new THREE.BoxGeometry(9, 0.1, 4), new THREE.MeshStandardMaterial({ color: '#1a1822', roughness: 0.7 })); desk.position.set(0, -0.05, 0.8); scene.add(desk);
      const btn = new THREE.Group(); btn.position.set(-2.4, 0, 1.2); scene.add(btn);
      btn.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.22, 40), new THREE.MeshStandardMaterial({ color: '#2a2830', metalness: 0.6, roughness: 0.4 })));
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 40), new THREE.MeshStandardMaterial({ color: '#e8303a', emissive: '#6a0a10', roughness: 0.35 })); cap.position.y = 0.2; btn.add(cap);
      return { S2, flat, scene, cm, mon };
    },
    update(S, T) {
      S.S2.clear(PAL.ink); drawUI(S.S2.ctx, T); S.S2.commit();
      if (T >= tFlat) return { scene: S.flat.scene, camera: S.flat.camera, post: { bloom: 0, chroma: 0.25 * kick(T) } };
      // 一拍推镜：从按钮和屏幕的全景推进到屏幕铺满
      const p = eOut((T - c.pto) / (tFlat - c.pto));
      S.cm.position.set(lerp(-1.2, 0.3, p), lerp(2.2, 1.12, p), lerp(6.5, 3.05, p)); S.cm.lookAt(0.3, lerp(0.9, 1.1, p), 0);
      return { scene: S.scene, camera: S.cm, post: { bloom: { strength: 0.4, threshold: 1 } } };
    },
  });

  // ---------------------------------------------------------------- 4. 航拍：整列被回形针埋掉，只剩她在跳
  shots.push({
    id: 'v404c-4-buried', t0: c.buried, t1: c.fuse, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#0b0a12'), cm = persp(40);
      scene.add(createGirlLights({ key: 2.2 }));
      const sea = createPaperclips({ count: 9000, seed: 3, clipSize: 0.13 }); dimSea(sea.mesh); scene.add(sea.mesh);
      const rain = createPaperclips({ count: 9000, seed: 17, clipSize: 0.13 }); scene.add(rain.mesh);
      if (form) scene.add(form.group);
      // 字沿她脚下前方的一段圆弧逐词排开：按每个词的字宽分配弧长（不重叠），每个词转成沿弧的切向
      const FS = 0.8, R = 9, GAP = 0.9;
      const widths = L.go.words.map(w => advance('anton', w.w.replace(/[,.]/g, '').toUpperCase(), FS));
      const total = widths.reduce((a, b) => a + b, 0) + GAP * (widths.length - 1);
      let arc = -total / 2;
      const ang = widths.map(w => { const th = (arc + w / 2) / R; arc += w + GAP; return th; });
      const fw = floorWords({ line: L.go, size: FS, steps: ang.map(th => [R * Math.sin(th), 3.4 - R * (1 - Math.cos(th))]) });
      fw.group.children.forEach((g, i) => { g.rotation.z = -ang[i]; });   // 沿弧转成切向，字头朝镜头
      fw.group.scale.setScalar(0.45); fw.group.position.y = SEA_Y + 0.25; scene.add(fw.group);
      fw.group.traverse(o => { if (o.material) { o.material.depthTest = false; o.renderOrder = 5; } });   // 字浮在针堆上面，不被针盖住
      return { scene, cm, sea, rain, fw };
    },
    update(S, T) {
      const k = T - c.buried, dur = c.fuse - c.buried;
      S.sea.update(T, { t0: c.clips - 30, dur: 1, height: SEA_Y, radius: 9, clear: 0.35 });
      S.rain.update(T, { t0: c.buried - 0.4, dur: dur * 0.9, height: 0.45, radius: 6.5, drop: 1.2, clear: 1.3 });   // 从低处落下：起点（≤ 1.2 + 4 m）始终在相机下方，不会从镜头前飞过
      put(S.scene, T, { y: SEA_Y, seq: SEQ_DANCE });                            // 她脚下留一圈空地（clear），回形针只埋整列
      if (form) { form.update(T, { seq: SEQ_DANCE }); form.group.position.y = -1.6 * smooth(k / (dur * 0.85)); }   // 被埋：整列沉下去
      S.fw.update(T);
      S.cm.position.set(Math.sin(k * 0.2) * 1.2, 6.2 - k * 0.4, 6.4 - k * 0.3); S.cm.lookAt(0, 0.3, 0.6);   // 从正前方斜俯：弧形字读得正，她在空地中央   // 斜俯拍：她在空地中央，四周整列被埋
      return { scene: S.scene, camera: S.cm, post: { bloom: { strength: 0.6, threshold: 1.0 }, chroma: 0.2 * kick(T), grade: { saturation: 0.85, vignette: 0.3 } } };
    },
  });

  // ---------------------------------------------------------------- 5. 火花沿希尔伯特曲线烧向城中心 + 引信逐词点燃
  const fuseW = L.fuse.words;
  shots.push({
    id: 'v404c-5-fuse', t0: c.fuse, t1: c.blues, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#06060b'), cm = persp(40);
      const city = createCity({ seed: 7, n: 21 }); city.update(0, { draw: 1, extrude: 1, light: 0.35 }); scene.add(city.group);
      const hil = createHilbert({ order: 5, size: 19 }); hil.group.rotation.x = -Math.PI / 2; hil.group.position.y = 0.03; scene.add(hil.group);
      const ov = overlay(scene, cm);
      const f = fuse({ line: L.fuse, points: [[-16, -6.5], [-11, -7.8], [-6, -6.2], [-1, -8], [4, -6.4], [9, -7.9], [14, -6.6], [17, -7.4]], size: 1.7 });
      ov.add(f.group); fixPoints(ov);
      return { scene, cm, city, hil, f };
    },
    update(S, T) {
      const k = T - c.fuse, dur = c.blues - c.fuse;
      S.city.update(T, { draw: 1, extrude: 1, light: 0.35 + 0.5 * smooth((T - fuseW[fuseW.length - 1].start) / 1.5) });   // 引信烧到头，城亮起来
      S.hil.update(T, { p: smooth(k / (dur * 0.92)) * 0.999 });
      S.f.update(T);
      S.cm.position.set(Math.sin(k * 0.12) * 2, 17 - k * 1.6, 11 - k * 1.2); S.cm.lookAt(0, 0, -0.5);
      return { scene: S.scene, camera: S.cm, post: { bloom: { strength: 0.9, threshold: 0.85 }, chroma: 0.15 * kick(T) } };
    },
  });

  // ---------------------------------------------------------------- 6. 冷蓝：雨中挂坐标轴绕杆甩一圈（《雨中曲》）
  shots.push({
    id: 'v404c-6-blues', t0: c.blues, t1: c.end + 0.5, transitionIn: { kind: 'flash', dur: 0.2, color: BLUE, peak: 0.6 },
    build() {
      const scene = scn('#04060f'), cm = persp(38);
      scene.fog = new THREE.Fog('#04060f', 6, 22);
      scene.add(new THREE.HemisphereLight('#c8d4ff', '#0a0f22', 1.1));   // 只用冷光：全片唯一冷蓝镜头
      const key = new THREE.DirectionalLight('#9fb4ff', 2.2); key.position.set(-2, 5, 3); scene.add(key);
      const rim = new THREE.DirectionalLight(BLUE, 2.5); rim.position.set(3, 2, -3); scene.add(rim);
      const blueM = new THREE.MeshBasicMaterial({ color: hdr(BLUE, 2.2), toneMapped: false });
      // 坐标轴：竖轴 = 路灯杆，横轴 = 灯臂；刻度 + 箭头
      const yAx = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.2, 12), blueM); yAx.position.y = 2.1; scene.add(yAx);
      const xAx = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5, 12), blueM); xAx.rotation.z = Math.PI / 2; xAx.position.set(1.6, 2.35, 0); scene.add(xAx);
      for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.02), blueM); t.position.set(-0.6 + i * 0.55, 2.35, 0); scene.add(t); }
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 16), blueM); arrow.position.set(4.2, 2.35, 0); arrow.rotation.z = -Math.PI / 2; scene.add(arrow);
      const arrowY = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 16), blueM); arrowY.position.set(0, 4.3, 0); scene.add(arrowY);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#0a0f1e', roughness: 0.15, metalness: 0.6 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
      // 霓虹灯牌：挂在横轴上方
      const sign = ledSign({ line: L.blues, cols: 120, rows: 14, pitch: 0.2, color: BLUE }); sign.group.scale.setScalar(0.12); sign.group.position.set(1.9, 3.0, 0); scene.add(sign.group);
      const sign2 = ledSign({ line: L.blues, cols: 72, rows: 14, pitch: 0.2, color: BLUE }); sign2.group.scale.setScalar(0.085); sign2.group.position.set(2.05, 2.78, 0.1); scene.add(sign2.group);   // 推到中景时她身边的小灯牌
      // 雨：斜线，按种子
      const rnd = mulberry32(22), N = 700, pos = new Float32Array(N * 6), seeds = [];
      for (let i = 0; i < N; i++) seeds.push([(rnd() - 0.5) * 16, rnd() * 8, (rnd() - 0.5) * 12, 0.25 + rnd() * 0.35, 5 + rnd() * 3]);
      const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: hdr('#9fb4ff', 0.7), transparent: true, opacity: 0.55, toneMapped: false })); rain.frustumCulled = false; scene.add(rain);
      return { scene, cm, sign, sign2, seeds, pos, rg };
    },
    update(S, T) {
      const k = T - c.blues, dur = c.end - c.blues;
      // 单手挂在横轴外端（x≈1.2），绕竖杆甩一圈：唱到 blues 起甩，角度按拍平滑走完 2π
      // 坐在 X 轴上晃腿（胯高约 0.45 → 根放在轴下 0.45），雨里慢慢晃
      put(S.scene, T, { x: 1.35, y: 2.35 - 0.47, z: 0.02, yaw: 0.25 * Math.sin(k * 0.8), seq: SEQ_BLUES });
      S.sign.update(T); S.sign2.update(T);
      S.sign2.group.visible = T > L.blues.words[2].start - 0.2; S.sign.group.visible = !S.sign2.group.visible;
      S.seeds.forEach(([x, y0, z, len, v], i) => { const y = 8 - ((y0 + T * v) % 8); S.pos.set([x + y * 0.08, y, z, x + (y - len) * 0.08, y - len, z], i * 6); });
      S.rg.attributes.position.needsUpdate = true;
      // 前半段远景（雨、坐标轴、灯牌）；唱到「blues」推到中景：她坐在 X 轴上晃腿，占画高 ~35%，灯牌在她右上
      const push = smooth((T - (L.blues.words[2].start - 0.2)) / 0.9);
      S.cm.position.set(lerp(-2.2 + k * 0.3, 0.9, push), lerp(1.5, 2.15, push), lerp(6.4 - k * 0.2, 2.35, push));
      S.cm.lookAt(lerp(1.3, 1.55, push), lerp(2.3, 2.25, push), 0);   // 全身远景：人在画面里小，脸不做近景
      return { scene: S.scene, camera: S.cm, post: { bloom: { strength: 0.9, threshold: 0.85 }, grade: { saturation: 0.85, warmth: -0.5, vignette: 0.4 } } };
    },
  });

  return { shots, cuts: c };
}
