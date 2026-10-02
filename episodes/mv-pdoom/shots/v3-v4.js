// shots/v3-v4.js — 主歌 3 + 预副歌 3（歌曲时间 74.78–95.4 s）。#1053
// 分镜：fresh/v4-rest/v3/plan-v6-用户.md（开头 + 最后的「第七版」）。
//
//   const shots = await makeV3V4(mv);   // v3-v4.html / v3-v4-half.html 单独挂
//
// A  74.78–78.42 超立方体数据空间（kits/tesseract.js，和副歌 2 结尾共用；第一帧 = C2_EXIT）：一个慢的长镜头。
//      镜头朝正前方那个「她」推近（其实是镜像）→ 往后拉，真的她进到前景、慢慢回头，四面八方一串串同步的她 → 她转回前方，出口的光渐亮到全白。
// B  78.42–89.32 舞台：共用舞台 kits/stage.js 的 pillars 变体（薄荷 / 白 / 冷蓝的竖直光柱，8 人镜面阵列）。
//      每小节强拍换一个机位：① 升 ② 低机位仰拍 ③ 推到大屏铺满 ④ 摇 ⑤ C 位中景 ⑥ 俯拍；大屏节目单见 LED_PATTERN。
// D  89.32–95.40 回到超立方体空间：她在光格走道上走了几步、四下看 → 身后远处开始塌，一路追过来 → 她回头发现、转身就跑
//      → go 那一拍塌到脚下，她掉出去，露出现实的夜空和夜城 → 95.4 交给副歌 3：她仰面（脸朝 +Y、头朝 −Z）下落 14 身高/s，
//      镜头在正上方 8.7 身高、垂直往下看、up = (0,0,−1)、fov 32。（第七版，#1063；第六版的结尾漫画作废，代码在 fresh/v4-rest/v3/_v6/）
// 所有 update 都是歌曲时间 T 的纯函数。单位：她的身高 = 1.0（A 段用 tesseract.js 的米制，她放大 2 倍）。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { barSchedule } from '../kits/holo-dancer.js';
import { createStage } from '../kits/stage.js';
import { createTesseract } from '../kits/tesseract.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';

export const ANIMS = ['act__look-around', 'act__swagger-walk', 'move__run-fast', 'act__fly-idle', 'act__float-flail', 'move__fall-air', 'act__rapping', 'dance__kick-step', 'dance__raise-roof', 'dance__jazz-around', 'dance__body-wave'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}

// ================================================================ 时间表（歌曲秒；强拍 = 74.78 + 1.8182 k）
const BAR = 60 / 132 * 4;
export const V3T = {
  t0: 74.78, end: 95.4,            // 交接点按总管的 b 方案挪到 95.4（副歌 3 从这里接）
  stage: 74.78 + 2 * BAR,          // 78.42 剧情 → 舞台
  outside: 74.78 + 8 * BAR,        // 89.32 舞台 → 结尾漫画
};
const camBar = k => V3T.stage + k * BAR;   // 舞台第 k 个机位的起点
// 舞台段大屏的播放表（每项一小节）：① 升 ② 仰拍 ③ 推近大屏（对口型特写）④ 摇 ⑤ 中景 ⑥ 俯拍
const LED_PATTERN = ['hairflip', 'rig', 'rig', 'point', 'low', 'rig'];   // 进舞台甩头发；「there you ARE」指镜头；「Without a single CDR」抱胸俯视

export async function makeV3V4(mv) {
  const { music, lyrics } = mv;
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const cam = new THREE.PerspectiveCamera(60, mv.width / mv.height, 0.05, 900);
  const A = { fly: getAnim('act__fly-idle'), flail: getAnim('act__float-flail'), fall: getAnim('move__fall-air') };
  const sol = (m, sec) => m.solve(sec / m.srcPeriod, girl.dancer);
  const line = p => lyrics.lines.find(l => l.start > 73 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { fwd: line('Forward'), now: line('Now'), gato: line('Gato') };

  // ---------------------------------------------------------------- 把一个姿势摆到指定朝向：动捕片段自带的身体朝向 / 髋位移各不相同，
  // 先在根 = 单位变换下量出「脚 → 头」「左髋 → 右髋」，求出把它转回「直立、面朝 +Z」的旋转 Rn，再乘目标朝向 Qt。
  // w = 摆正的权重（0 = 不动片段原来的朝向）。返回髋在根坐标里的位置 h：调用方用 root.position = 目标髋位置 − q·h 把髋钉在想要的点上。
  const BI = girl.dancer.S.info, bp = k => BI[k].bone.getWorldPosition(V3());
  const _B = new THREE.Matrix4(), _Rn = new THREE.Quaternion(), _I = new THREE.Quaternion();
  function applyOriented(pose, Qt, w = 1) {
    girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
    const h = bp('Hips'), y = bp('Head').sub(bp('LeftFoot').add(bp('RightFoot')).multiplyScalar(0.5)).normalize();
    const x = bp('LeftUpLeg').sub(bp('RightUpLeg')); x.addScaledVector(y, -x.dot(y)).normalize();      // 角色面朝 +Z 时，她的左手边是 +X
    const z = V3().crossVectors(x, y);
    _Rn.setFromRotationMatrix(_B.makeBasis(x, y, z)).invert();
    const q = Qt.clone().multiply(_I.identity().slerp(_Rn, w));
    girl.root.quaternion.copy(q);
    return { h, q };
  }

  // ---------------------------------------------------------------- 招牌：墨底 + 霓虹边 + 白字；挂在镜头前（屏幕坐标）
  function makeSign(text, color) {
    const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
    c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
    g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, fog: false });   // transparent：排在所有半透明物体之后画，不被层的圆环盖住
    const m = new THREE.Mesh(new THREE.PlaneGeometry(c.width / c.height, 1), mat); m.renderOrder = 900; m.frustumCulled = false;
    return { m, mat, aspect: c.width / c.height };
  }
  /** 一组挂在镜头前的招牌：items = [{ text, color, at, until, x, y, h }]，x / y = 屏幕分数（左上原点，牌的左上角），h = 牌高占画高 */
  function hudSigns(scene, items) {
    const S = items.map(it => { const s = makeSign(it.text, it.color ?? PAL.mint); scene.add(s.m); return { ...it, ...s }; });
    const fwd = V3(), right = V3(), up = V3();
    return (T, camera) => {
      camera.updateMatrixWorld(true);
      camera.matrixWorld.extractBasis(right, up, fwd); fwd.negate();
      const d = 2, hh = d * Math.tan(camera.fov * Math.PI / 360), hw = hh * camera.aspect;
      for (const s of S) {
        const a = T - s.at; s.m.visible = a >= 0 && T < s.until; if (!s.m.visible) continue;
        const f = v => (typeof v === 'function' ? v(T) : v), bh = f(s.h) * 2 * hh, bw = bh * s.aspect, k = lerp(0.9, 1, eOut(a / 0.1));      // x / y / h 可以写成 T => 值
        const cx = (f(s.x) * 2 - 1) * hw + bw / 2, cy = (1 - f(s.y) * 2) * hh - bh / 2;
        s.m.position.copy(camera.position).addScaledVector(fwd, d).addScaledVector(right, cx).addScaledVector(up, cy);
        s.m.quaternion.copy(camera.quaternion); s.m.scale.set(bh * k, bh * k, 1);
        s.mat.color.setScalar(1.1 + 1.5 * Math.exp(-a / 0.3));
      }
    };
  }
  const W = (ln, i) => ln.words[i];

  // ================================================================ A：超立方体数据空间（第六版，用户分镜 fresh/v4-rest/v3/plan-v6-用户.md）
  // 空间 = kits/tesseract.js（0xb52e，和副歌 2 结尾共用，concept3 的参数）：三向重复的画框晶格 + 光丝；晶格三个轴上是一串串和她完全同步的镜像。
  // 单位：米，她身高 2（A 段里她放大 2 倍）。74.78 第一帧 = shots/c2-v4.js 的 C2_EXIT。
  // 一个慢的长镜头，三拍：
  //   ① 74.78–75.9 镜头朝正前方那个「她」慢慢推近（其实是前后镜像里最近的一个，面朝镜头）；
  //   ② 75.9–77.2 她开始慢慢回头；镜头往后拉，真的她从画面左边进到前景——四面八方一串串的她都在同步回头；
  //   ③ 77.2–78.42 她转回前方，远处出口的光渐亮，镜头继续慢慢拉开，78.42 全白接舞台。
  // Forward / backward / repeat 不用字牌：光丝上的数据和画框里的切片往前流 → 倒流（76.12）→ 再往前（76.84）。
  const JOIN = { girl: [0, 0, -20], cam: [1.9, 0.35, -22.4], look: [1.4, 0.2, -60], fov: 60, phase: 10.7, phaseRate: 6 };      // = C2_EXIT（改的话两边一起改）
  const tess = await createTesseract(mv);
  const sA = new THREE.Scene(); sA.background = col('#070403');
  sA.add(tess.group, new THREE.HemisphereLight('#ffe2b0', '#2a1608', 0.8), createGirlLights({ key: 2.1, rim: 2.6, fill: 1.1 }));
  const KT = { BACK: W(L.fwd, 2).start, REP: W(L.fwd, 3).start, EXIT: 77.6, END: V3T.stage };
  const GA = V3(...JOIN.girl);                                      // 真的她的身体中心
  // 分段线性速度的积分（连续）：keys = [[t, v], …] → ∫ v dt（从 keys[0][0] 起）
  function integ(keys, T) {
    let acc = 0; if (T <= keys[0][0]) return (T - keys[0][0]) * keys[0][1];
    for (let i = 0; i + 1 < keys.length; i++) { const [t0, v0] = keys[i], [t1, v1] = keys[i + 1]; if (T >= t1) { acc += (v0 + v1) / 2 * (t1 - t0); continue; } return acc + (v0 + lerp(v0, v1, (T - t0) / (t1 - t0))) / 2 * (T - t0); }
    return acc + (T - keys.at(-1)[0]) * keys.at(-1)[1];
  }
  const VF = [[74.78, JOIN.phaseRate], [KT.BACK - 0.1, JOIN.phaseRate], [KT.BACK + 0.1, -11], [KT.REP - 0.08, -11], [KT.REP + 0.12, 11], [KT.END, 14]];       // 数据流：正 = 往前流 / 切片正放，负 = 倒流 / 倒放
  // 镜头：位置和注视点的关键帧（世界坐标），pchip 插值
  const CK = [                                                       // [t, 位置, 注视点]
    [74.78, V3(...JOIN.cam), V3(...JOIN.look)],                      // 接副歌 2：真的她在左后方画外；正前方 10 m 是她的一个镜像
    [75.35, V3(1.25, 0.3, -24.0), V3(0.4, 0.2, -32)],                // 慢慢朝它推（起步速度接副歌 2 的 1.5 m/s）
    [75.90, V3(0.45, 0.25, -26.2), V3(0, 0.2, -30)],                 // 推到跟前：画面里只有「她」，面朝镜头
    [76.60, V3(1.55, 0.6, -17.6), V3(-0.2, 0.35, -30)],              // 往后拉：真的她从左边进到前景（背影），前面一串串都是她
    [77.20, V3(1.95, 0.85, -16.0), V3(-0.35, 0.45, -25)],            // 她回头看身后（镜头这边），所有的她都在同步回头
    [KT.END, V3(2.7, 1.7, -12.6), V3(0, 0.2, -80)],                  // 她转回前方；镜头继续慢慢拉开，出口的光铺满
  ];
  const camKey = (T, i) => V3(pchip(CK.map(k => [k[0], k[i].x]), T), pchip(CK.map(k => [k[0], k[i].y]), T), pchip(CK.map(k => [k[0], k[i].z]), T));
  // 她的动作：站直悬着（和副歌 2 结尾同一个站姿：act__look-around 第 0.6 s），只做一件事：慢慢回头看身后，再转回前方
  const STAND = getAnim('act__look-around');
  const lookBack = T => smooth((T - 75.85) / 1.05) * (1 - smooth((T - 77.3) / 0.6));
  const TURN = [['Spine', 0.24], ['Spine1', 0.24], ['Spine2', 0.26], ['Neck', 0.34], ['Head', 0.55]], Y1 = V3(0, 1, 0);
  // 让一根骨头绕世界竖轴多转 ang。不能用 bone.rotateOnWorldAxis：它假设父节点没有旋转，而骨架的父链是带旋转的，
  // 转出来的轴是歪的、角度也不够（第六版回头只转了一半，镜头看到的是近 90° 的侧脸 → 五官层淡成空脸，#1063）
  const _pq = new THREE.Quaternion(), _wq = new THREE.Quaternion();
  function twistY(bone, ang) {
    bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_pq);
    _wq.setFromAxisAngle(Y1, ang); bone.quaternion.premultiply(_pq.clone().invert().multiply(_wq).multiply(_pq)); bone.updateMatrixWorld(true);
  }
  // 脸的朝向和「头 → 镜头」的夹角（度）：0 = 正对镜头。头骨的本地轴不一定是脸的朝向，所以先标定：不回头时她面朝世界 −Z
  let HEAD_F = null; const _hf = V3(), _hv = V3(), _hq = new THREE.Quaternion();
  const faceAngle = c => { BI.Head.bone.getWorldQuaternion(_hq); _hf.copy(HEAD_F).applyQuaternion(_hq); _hv.copy(c.position).sub(girl.headPosition(_hp)).normalize(); return Math.acos(clamp(_hf.dot(_hv), -1, 1)) * 180 / Math.PI; };
  function poseA(t, lb) {
    girl.root.scale.setScalar(2); girl.root.quaternion.setFromAxisAngle(Y1, Math.PI - 0.8 * lb); girl.root.position.set(GA.x, GA.y - 1 + 0.06 * Math.sin(2.1 * t), GA.z); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(STAND.solve(0.6 / STAND.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true);
    for (const [k, a] of TURN) twistY(BI[k].bone, -a * lb);                        // 脊柱 / 颈 / 头逐节往她右肩那边转
    girl.root.updateMatrixWorld(true);
  }
  const _hp = V3();
  { sA.add(girl.root); poseA(74.78, 0); BI.Head.bone.getWorldQuaternion(_hq); HEAD_F = V3(0, 0, -1).applyQuaternion(_hq.invert()); }
  function worldA(T) {
    if (girl.root.parent !== sA) sA.add(girl.root);
    hideD();
    girl.setSkin('toon', T);
    tess.update(T, { phase: JOIN.phase + integ(VF, T), exit: smooth((T - KT.EXIT) / (KT.END - KT.EXIT)) });
    poseA(T, lookBack(T));
    cam.fov = pchip([[74.78, JOIN.fov], [75.9, 50], [76.6, 56], [KT.END, 58]], T); cam.up.set(0, 1, 0); cam.position.copy(camKey(T, 1)); cam.lookAt(camKey(T, 2)); cam.far = 4000;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    // 五官：这一段不把镜头交给 girl.js 的 2D 五官层，一律用贴在网格上的五官。
    // 第六版回头最大的那几帧 2D 五官层画不出五官（一张空脸，用户看到的「脸部缺失」）；网格五官在任何角度都在（#1063）
    try { girl.face?.update(T, { blink: 'auto' }); } catch {}
    tess.reflectArray(sA, cam, girl.root, GA);                       // 同步的镜像阵列（她和镜头都摆好之后调）
  }

  // ================================================================ B：舞台（kits/stage.js，pillars 变体）
  // 大屏每小节放什么：'rig' = 逐词对口型的 2D 特写（③ 推近大屏那一小节必须是它），其余是 screen-clips 里的动作片段
  const stage = await createStage(mv, { dancers: 8, girl, variant: 'pillars', lyrics: [[V3T.stage - 0.75, V3T.outside]],
    led: { schedule: barSchedule(mv, { t0: V3T.stage, pattern: LED_PATTERN }) } });
  const dark = T => smooth((T - (V3T.outside - 0.22)) / 0.2);        // 结尾：89.32 前灯灭一拍
  const stageShot = stage.shot({ id: 'v3-stage', t0: V3T.stage, t1: V3T.outside, variant: 'pillars',
    // ② ④ 用自己的机位（stage.js 的 low / pan 会把大屏字幕条裁掉一截）：仰拍退后一点、摇的幅度收窄，字幕条整条留在画面里
    plan: ['crane', { cam: () => u => ({ pos: [-2.4 + 0.4 * u, 0.14, 3.2], look: [-0.1, 1.45, -1.0], fov: 46, led: 1 }) }, 'screen',
      { cam: () => u => ({ pos: [-0.4, 0.95, 5.4], look: [lerp(-1.1, 1.1, smooth(u)), 1.25, -0.9], fov: 34, led: 1 }) }, 'mid', 'top'],
    blackout: T => 0.85 * dark(T) });

  // ================================================================ D：结尾（第七版，用户 10-02：「回到超空间，超空间慢慢崩溃瓦解，最后角色回到现实然后掉落」）
  // 89.32 舞台灯灭 → 回到超立方体空间（和开头同一个 tess、同一套同步镜像）。她在一条光格走道上走了几步、四下看；
  // please 起身后远处开始塌（画框剥落翻飞、光丝和镜像一层层消失，塌过的地方露出现实的夜空和夜城），一路追过来；
  // 她回头发现，转身就跑；go 那一拍塌到脚下，她掉出去；95.4 = 交给副歌 3 的出口（仰面下落，镜头在正上方）。
  // 单位：米（她身高 2）。「塌到哪儿」= 一个垂直于 Z 的面 zf(T)：世界 z > zf 的超空间都没了，露出现实。
  const X1v = V3(1, 0, 0);
  mv.stage.renderer.localClippingEnabled = true;                   // 只影响带 clippingPlanes 的材质（下面现实世界的那些）
  const CLIPP = new THREE.Plane(V3(0, 0, 1), 0);                    // 现实只在塌过的那一侧看得到
  const RW = new THREE.Group(); RW.scale.setScalar(2); RW.position.set(0, 0, 0); sA.add(RW);
  // 夜城（在脚下 70）：亮窗楼块 + 霓虹路；俯拍时看得到屋顶的霓虹边
  const CITY_Y = -60;
  { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(5);
    g.fillStyle = '#111120'; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 7; x++) if (rnd() < 0.55) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 36 + 8, y * 28 + 6, 20, 12); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const rc = document.createElement('canvas'); rc.width = rc.height = 64; const rg = rc.getContext('2d'); rg.fillStyle = '#15142a'; rg.fillRect(0, 0, 64, 64); rg.strokeStyle = '#ffffff'; rg.lineWidth = 2; rg.strokeRect(2, 2, 60, 60);
    const roofT = new THREE.CanvasTexture(rc); roofT.colorSpace = THREE.SRGBColorSpace;
    const side = new THREE.MeshBasicMaterial({ map: tex }), roof = new THREE.MeshBasicMaterial({ map: roofT, color: hdr(PAL.mint, 0.45) });
    const N = 30 * 30, im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), [side, side, roof, side, side, side], N), M = new THREE.Matrix4(), q = new THREE.Quaternion(), r2 = mulberry32(23);
    im.instanceColor = null; let i = 0;
    for (let a = 0; a < 30; a++) for (let b = 0; b < 30; b++) {
      const x = (a - 14.5) * 16 + (r2() - 0.5) * 3, z = (b - 14.5) * 16 + (r2() - 0.5) * 3 - 20, w = 7 + r2() * 5, d = 7 + r2() * 5, h = 8 + r2() * 26;
      const road = (a % 5 === 2) || (b % 5 === 2);
      im.setMatrixAt(i++, M.compose(V3(x, CITY_Y + h / 2, z), q, road ? V3(0, 0, 0) : V3(w, h, d)));
    }
    RW.add(im);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: '#0d0c18' })); ground.rotation.x = -Math.PI / 2; ground.position.y = CITY_Y; RW.add(ground);
    // 霓虹路：每 5 格一条，粉 / 薄荷 / 柠黄
    const cols = [PAL.pink, PAL.mint, PAL.lemon];
    for (let a = 2, n = 0; a < 30; a += 5, n++) for (const horiz of [0, 1]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(horiz ? 480 : 1.1, horiz ? 1.1 : 480), new THREE.MeshBasicMaterial({ color: hdr(cols[(n + horiz) % 3], 2.2), fog: false }));
      m.rotation.x = -Math.PI / 2; m.position.set(horiz ? 0 : (a - 14.5) * 16, CITY_Y + 0.05, horiz ? (a - 14.5) * 16 - 20 : -20); RW.add(m);
    }
  }
  { const rnd = mulberry32(77), n = 700, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.05 + rnd() * 0.9), r = 380; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r - 20, Math.sin(a) * Math.cos(e) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    RW.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })));
  }
  const moon = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.2), fog: false }));
  moon.position.set(-150, 70, -300); moon.lookAt(0, 0, 0); RW.add(moon);
  { const dome = new THREE.Mesh(new THREE.SphereGeometry(700, 32, 20), new THREE.MeshBasicMaterial({ color: '#070812', side: THREE.BackSide, depthWrite: false })); dome.renderOrder = -20; RW.add(dome); }
  RW.traverse(o => { for (const m of [].concat(o.material ?? [])) { m.clippingPlanes = [CLIPP]; m.fog = false; } });
  const tessSky = tess.group.children.find(c => c.geometry?.type === 'SphereGeometry');      // tess 自带的暗褐背景球：这一段关掉，背景色由场景给（现实的天要从后面露出来）
  // 回形针（坠落时往上掠过）：银色为主，少量粉 / 薄荷 / 柠黄；长约 0.13，相对她往上掠过
  const CLIPS = (() => { const rnd = mulberry32(41), a = [];
    const shape = []; for (const [x0, y0, x1, y1] of [[-0.3, -1, -0.3, 0.7], [-0.3, 0.7, 0.3, 0.7], [0.3, 0.7, 0.3, -0.7], [0.3, -0.7, -0.1, -0.7], [-0.1, -0.7, -0.1, 0.45]]) shape.push(x0, y0, 0, x1, y1, 0);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(shape, 3));
    for (let i = 0; i < 16; i++) { const h = rnd(), c = h < 0.7 ? '#dfe3ea' : h < 0.8 ? PAL.pink : h < 0.9 ? PAL.mint : PAL.lemon;
      const m = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: hdr(c, 1.8), fog: false })); m.scale.setScalar(0.13); sA.add(m);
      a.push({ m, x: (rnd() - 0.5) * 6.4, z: (rnd() - 0.5) * 3.6, y0: -10 - rnd() * 16, v: 2 + rnd() * 4, rot: rnd() * 6.28, spin: (rnd() - 0.5) * 8 }); }
    return a; })();

  const D = { t0: V3T.outside, stop: 90.75, look: 91.0, run: 91.85, go: W(L.gato, 5).start, end: V3T.end };
  const WALK = getAnim('act__swagger-walk'), RUN = getAnim('move__run-fast'), V_WALK = 2.03, V_RUN = 6.05;      // 速度 = 动捕支撑脚的后滑速度 × 她的身高（index.json 的 slide / 带位移版速度），再用 __v3Slide 量着微调到支撑脚不滑
  // 三种状态的权重：走 → 站住回头 → 跑
  const wWalk = T => 1 - smooth((T - D.stop) / 0.3), wRun = T => smooth((T - D.run) / 0.3);
  const zD = T => GA.z - integ([[D.t0, V_WALK], [D.stop, V_WALK], [D.stop + 0.3, 0], [D.run, 0], [D.run + 0.3, V_RUN], [D.go, V_RUN], [D.go + 0.25, V_RUN * 0.4]], Math.min(T, D.go + 0.25));
  // 塌的那个面离她多远（> 0 = 还在她身后）：please 之后才看得见，回头时已经很近，go 那一拍追到脚下，然后扫过镜头、把剩下的全带走
  const GAP = [[D.t0, 1700], [90.3, 1500], [W(L.gato, 1).start, 420], [91.4, 120], [92.0, 62], [93.0, 28], [93.9, 7], [D.go, 0.5], [D.go + 0.3, -45], [D.go + 0.7, -500]];      // 一开始在现实的天穹之外（什么都看不到），please 起从很远处塌过来
  const zF = T => zD(Math.min(T, D.go)) + pchip(GAP, T);
  const lookD = T => smooth((T - D.look) / 0.45) * (1 - smooth((T - (D.run - 0.12)) / 0.3));       // 回头的量
  const FEET_Y = GA.y - 1;
  // 光格走道：她脚下的一条玻璃格子（3 列 × 2 m）；塌到哪儿，哪儿的格子就掉下去
  const TILE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 128, 128);
    g.fillStyle = 'rgba(255,201,120,0.10)'; g.fillRect(6, 6, 116, 116); g.strokeStyle = '#ffc978'; g.lineWidth = 5; g.strokeRect(6, 6, 116, 116);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const tiles = (() => { const list = []; for (let k = -44; k <= 10; k++) for (const x of [-2, 0, 2]) list.push({ x, z: GA.z + 1 - k * 2 - 20, h: (Math.sin(k * 12.9898 + x * 78.233) * 43758.5453) % 1 });
    const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.92, 1.92), new THREE.MeshBasicMaterial({ map: TILE, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), list.length);
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3), 3); im.frustumCulled = false; sA.add(im); return { im, list }; })();
  // 碎片：塌的面扫到哪儿，哪儿的画框就剥下来、翻着往下掉（金边的暗色画框 + 断掉的光丝）
  const SH = (() => { const rnd = mulberry32(88), list = [];
    for (let i = 0; i < 260; i++) { const line = i % 3 === 2; let x, y; do { x = (rnd() - 0.5) * 70; y = (rnd() - 0.5) * 44; } while (Math.abs(x) < 4 && Math.abs(y) < 4);
      list.push({ x, y, z: GA.z + 70 - rnd() * 120, line, w: line ? 0.06 : 3.4 * (0.5 + rnd() * 0.6), h: line ? 4 + rnd() * 8 : 1.9 * (0.5 + rnd() * 0.6), ax: V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), sp: 2 + rnd() * 5, vx: (rnd() - 0.5) * 6, vz: -4 - rnd() * 10, r0: rnd() * 6.28, yawK: rnd() < 0.3 ? Math.PI / 2 : 0 }); }
    const c = document.createElement('canvas'); c.width = 128; c.height = 72; const g = c.getContext('2d'); g.fillStyle = '#2a1a0c'; g.fillRect(0, 0, 128, 72); g.strokeStyle = '#ffc978'; g.lineWidth = 6; g.strokeRect(3, 3, 122, 66);
    g.fillStyle = 'rgba(255,201,120,0.35)'; g.fillRect(14, 14, 60, 30); g.fillStyle = 'rgba(255,46,136,0.4)'; g.fillRect(80, 30, 34, 28);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), list.length);
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3), 3); im.frustumCulled = false; sA.add(im); return { im, list }; })();
  // 断面：塌的那个面上，晶格的截面烧成一圈圈亮线
  const edge = (() => { const pts = []; for (let i = -8; i <= 8; i++) { pts.push(i * 10, -52, 0, i * 10, 52, 0); pts.push(-80, i * 6.5, 0, 80, i * 6.5, 0); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hdr('#fff0c8', 2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.frustumCulled = false; sA.add(m); return m; })();
  const SUPINE_Q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(1, 0, 0), V3(0, 0, -1), V3(0, 1, 0)));   // 头 → −Z，脸 → +Y
  const FACE_Q = new THREE.Quaternion().setFromAxisAngle(Y1, Math.PI);                 // 面朝 −Z
  const FD = D.end - D.go, V_EXIT = 28;                                                // 出口：28 m/s = 14 身高 / 秒
  const dropD = T => { const k = clamp(T - D.go, 0, FD + 1); return 0.5 * V_EXIT / FD * k * k; };
  const tFront = z => { let lo = D.t0, hi = D.end; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (zF(m) > z) lo = m; else hi = m; } return hi; };      // 塌的面什么时候扫到 z（zF 单调递减）
  for (const o of [...tiles.list, ...SH.list]) o.t = tFront(o.z);
  const _M = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _S = new THREE.Vector3(), _P = new THREE.Vector3(), _C = new THREE.Color(), FLAT = new THREE.Quaternion().setFromAxisAngle(X1v, -Math.PI / 2);
  function worldD(T) {
    if (girl.root.parent !== sA) sA.add(girl.root);
    girl.root.scale.setScalar(2); girl.setSkin('toon', T);
    const z = zD(T), zf = zF(T), fall = T >= D.go, kf = T - D.go;
    // ---- 空间
    tessSky.visible = false; sA.background.set(T > D.go + 0.45 ? '#070812' : '#070403');
    tess.update(T, { phase: 40 + 6 * (T - D.t0), exit: 0 }); tess.frames.material.uniforms.uZMax.value = zf;
    CLIPP.constant = -zf; RW.visible = true; RW.position.set(0, 0, z + 40);
    const ek = clamp(1 - (zf - z - 60) / 240) * clamp((zf - z + 60) / 40);          // 断面的亮线：塌到 300 m 以内才慢慢显出来
    edge.visible = ek > 0.01; edge.position.set(0, 0, zf); edge.material.color.copy(hdr('#fff0c8', (0.5 + 0.9 * kick(T)) * ek));
    // ---- 她
    const ww = wWalk(T), wr = wRun(T), lb = lookD(T), sec = T - D.t0;
    let o = null;
    if (!fall || kf < 0.3) {
      const pw = WALK.solve(sec / WALK.srcPeriod, girl.dancer), pr = RUN.solve((T - D.run) / RUN.srcPeriod, girl.dancer), ps = STAND.solve(0.6 / STAND.srcPeriod, girl.dancer);
      let pose = ww >= 1 ? pw : wr >= 1 ? pr : ww > 0 ? blendSolved(ps, pw, ww) : wr > 0 ? blendSolved(ps, pr, wr) : ps;
      if (fall) pose = blendSolved(pose, sol(A.fall, 0.6 + kf), smooth(kf / 0.3));
      girl.root.position.set(0, FEET_Y - dropD(T), z); girl.root.quaternion.setFromAxisAngle(Y1, Math.PI - 0.5 * lb).slerp(SUPINE_Q, fall ? smooth(kf / 0.45) : 0); girl.root.updateMatrixWorld(true);
      girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
      // 走的时候四下看（头和颈左右慢慢转）；站住之后回头看身后
      const glance = 0.45 * Math.sin((T - D.t0) * 3.4) * ww;
      twistY(BI.Neck.bone, glance * 0.4 - 0.34 * lb); twistY(BI.Head.bone, glance * 0.6 - 0.55 * lb);
      for (const k of ['Spine', 'Spine1', 'Spine2']) twistY(BI[k].bone, -0.25 * lb);
      girl.root.updateMatrixWorld(true);
    } else {                                                                            // 仰面下落：髋钉在下落的轨迹上
      const cen = V3(0, GA.y - dropD(T), z);
      o = applyOriented(sol(A.fall, 0.6 + kf), new THREE.Quaternion().copy(FACE_Q).slerp(SUPINE_Q, smooth(kf / 0.45)), smooth(kf / 0.45));
      girl.root.position.copy(cen).sub(o.h.applyQuaternion(o.q)); girl.root.updateMatrixWorld(true);
    }
    const cen = V3(0, GA.y - dropD(T), z);
    // ---- 走道：离她近的格子亮；塌到的格子掉下去
    tiles.list.forEach((t, i) => { const k = T - t.t, d = Math.abs(t.z - z), fy = k > 0 ? -0.5 * 22 * k * k : 0;
      _M.compose(_P.set(t.x + (k > 0 ? t.h * 2 * k : 0), FEET_Y - 0.02 + fy, t.z), k > 0 ? _Q.setFromAxisAngle(X1v, -Math.PI / 2 + t.h * 5 * k) : FLAT, _S.set(1, 1, 1)); tiles.im.setMatrixAt(i, _M);
      tiles.im.setColorAt(i, _C.setScalar((0.12 + 0.5 * Math.exp(-d * d / 18)) * clamp(1 - d / 26) * (k > 0 ? Math.max(0, 1 - k / 1.2) + 1.5 * Math.exp(-k * 8) : 1))); });
    tiles.im.instanceMatrix.needsUpdate = true; tiles.im.instanceColor.needsUpdate = true;
    // ---- 碎片
    SH.list.forEach((s, i) => { const k = T - s.t;
      if (k <= 0 || k > 2.2) { _M.makeScale(0, 0, 0); SH.im.setMatrixAt(i, _M); return; }
      _Q.setFromAxisAngle(s.ax, s.r0 + s.sp * k); if (s.yawK) _Q.premultiply(new THREE.Quaternion().setFromAxisAngle(Y1, s.yawK));
      _M.compose(_P.set(s.x + s.vx * k, s.y - 0.5 * 16 * k * k + 2 * k, s.z + s.vz * k), _Q, _S.set(s.w, s.h, 1)); SH.im.setMatrixAt(i, _M);
      SH.im.setColorAt(i, _C.set(s.line ? '#ffd9a0' : '#ffffff').multiplyScalar((s.line ? 1.6 : 0.9) * Math.min(1, k * 6) * Math.max(0, 1 - k / 2.2) + 1.2 * Math.exp(-k * 7))); });
    SH.im.instanceMatrix.needsUpdate = true; SH.im.instanceColor.needsUpdate = true;
    // ---- 回形针：掉下去之后往上掠过
    for (const c of CLIPS) { c.m.visible = kf > 0.25; c.m.position.set(c.x * 2, cen.y - 3 + c.y0 * 0.84 + c.v * 2 * kf + 14 * kf, z + c.z * 2); c.m.rotation.set(Math.PI / 2, 0, c.rot + c.spin * kf); }
    // ---- 镜头：一直在她前面倒退着拍（她迎着镜头，身后在塌）；回头时绕到侧前；掉下去之后升到她正上方
    const side = smooth((T - D.look + 0.15) / 0.5) * (1 - smooth((T - D.run - 0.1) / 0.6));
    const cx = lerp(1.3, 3.6, side) + 0.8 * wr, cyy = lerp(0.35, 0.7, side) - 0.25 * wr, cz = z - lerp(5.2, 3.6, side) - 0.2 * wr;
    const pA = V3(cx, GA.y + cyy, cz), lA = V3(-0.2 - 0.5 * wr, GA.y + 0.35, z + 5);
    if (!fall) { cam.fov = lerp(46, 50, wr); cam.up.set(0, 1, 0); cam.position.copy(pA); cam.lookAt(lA); }
    else {                                                                              // 出口：正上方 17.4 m（8.7 身高），垂直往下看，up = −Z，fov 32，和她同速
      const u = smooth(kf / FD), s = 1 - (1 - clamp(kf / FD)) ** 2, off = 17.4 * Math.tan(32 * Math.PI / 360) * 0.1;
      const pB = V3(cen.x, cen.y + 17.4, cen.z + off), lB = V3(cen.x, cen.y, cen.z + off);
      cam.fov = lerp(50, 32, u); cam.up.set(0, 1 - u, -u).normalize();
      cam.position.copy(pA).lerp(pB, s); cam.lookAt(lA.clone().lerp(lB, Math.min(1, s * 1.6)));
    }
    cam.far = 4000; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    try { girl.face?.update(T, { blink: 'auto', expression: T > D.look + 0.3 ? 'surprised' : undefined }); } catch {}
    tess.reflectArray(sA, cam, girl.root, cen, { zMax: zf });
    return { cen, zf, z };
  }

  function hideD() { tessSky.visible = true; sA.background.set('#070403'); tess.frames.material.uniforms.uZMax.value = 1e9; RW.visible = false; edge.visible = false; tiles.im.visible = SH.im.visible = false; for (const c of CLIPS) c.m.visible = false; }
  const showD = () => { tiles.im.visible = SH.im.visible = true; };
  // ---------------------------------------------------------------- 手和脸的间距（#1065，舞台段）
  // 唱歌姿势（act__rapping）握麦的左手、跳舞时从脸前划过的手，离头中心只有 0.08–0.12 身高，会贴进 / 穿进脸里（用户看到的「脸变形」）。
  // 做法：以头中心为球心留一个半径 KEEP 的禁区；手上的采样点进了禁区，就把整条手臂绕肩关节转一点，把手沿「头中心 → 手」的方向推到禁区外。
  // 推多少只取决于当前姿势（进得越深推得越多），所以是连续的，不会跳。禁区半径在唱 ↔ 跳交界的 0.3 s 里平滑过渡。
  const KEEP = 0.15, HANDS = [['LeftArm', ['LeftHand', 'LeftHandMiddle1', 'LeftHandMiddle3']], ['RightArm', ['RightHand', 'RightHandMiddle1', 'RightHandMiddle3']]];
  const _kq = new THREE.Quaternion(), _kp = new THREE.Quaternion(), _kc = V3(), _ks = V3(), _kh = V3(), _kd = V3(), _ka = V3(), _kf = V3();
  // 只在 C 位跳舞的时候修（和 stage.js 的 leadPattern [2, 2] 同一个算法：唱 2 小节、跳 2 小节，交界 0.3 s 混合）。
  // 唱歌时握麦的手本来就举在嘴前，那是编排，不动它。
  const danceW = T => { const bar = music.barAt(T), k = ((bar.i % 4) + 4) % 4, mode = k >= 2 ? 1 : 0, prev = ((k + 3) % 4) >= 2 ? 1 : 0; return lerp(prev, mode, smooth((T - bar.t0) / 0.3)); };
  function keepHandsOffFace(T) {
    const sc = girl.root.scale.x, R = lerp(0.085, KEEP, danceW(T)) * sc;
    for (const [armK, pts] of HANDS) {
      const arm = BI[armK]?.bone; if (!arm) continue;
      for (let it = 0; it < 4; it++) {
        girl.root.updateMatrixWorld(true); girl.headPosition(_kc); arm.getWorldPosition(_ks);
        let worst = null, depth = 0;      // eslint-disable-line prefer-const
        for (const k of pts) { if (!BI[k]) continue; BI[k].bone.getWorldPosition(_kh); const d = R - _kh.distanceTo(_kc); if (d > depth) { depth = d; worst = _kh.clone(); } }
        if (!worst) break;
        _kd.copy(worst).sub(_kc).normalize();                              // 从头中心指向手
        BI.Head.bone.getWorldQuaternion(_kq); _kf.copy(HEAD_F).applyQuaternion(_kq);      // 脸的朝向
        _kd.addScaledVector(_kf, 1.6).normalize();             // 往外推的方向：以「朝脸的正前方」为主——握麦的手还在嘴前，只是离远一点，不会被挤到肩膀旁边
        depth /= Math.max(0.35, _kd.dot(worst.clone().sub(_kc).normalize()));
        const lever = worst.clone().sub(_ks), L = lever.length(); _ka.crossVectors(lever, _kd); if (_ka.lengthSq() < 1e-8) break; _ka.normalize();
        arm.parent.getWorldQuaternion(_kp); _kq.setFromAxisAngle(_ka, Math.min(0.5, depth / L * 1.05));
        arm.quaternion.premultiply(_kp.clone().invert().multiply(_kq).multiply(_kp)); arm.updateMatrixWorld(true);
      }
    }
    girl.root.updateMatrixWorld(true);
  }
  const camSide = new THREE.PerspectiveCamera(30, mv.width / mv.height, 0.05, 200);
  // 自查机位：默认从她的左手边正侧面看（握麦 / 划过脸前的是左手）；window.__v3Side = 'R' 换到右边
  function sideCam() { girl.root.updateMatrixWorld(true); const h = girl.headPosition(V3()), right = V3(1, 0, 0).applyQuaternion(girl.root.getWorldQuaternion(new THREE.Quaternion()));
    camSide.position.copy(h).addScaledVector(right, window.__v3Side === 'R' ? -1.5 : 1.5).add(V3(0, 0.02, 0)); camSide.up.set(0, 1, 0); camSide.lookAt(h.x, h.y - 0.03, h.z); camSide.updateProjectionMatrix(); camSide.updateMatrixWorld(true); return camSide; }
  // ================================================================ 镜头表
  const post = (T, extra = {}) => ({ dither: 1.2, bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.1 + 0.3 * kick(T), grade: { vignette: 0.36 }, ...extra });
  const shots = [
    { id: 'v3-mlp', t0: V3T.t0, t1: V3T.stage, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldA(T); const wu = smooth((T - 77.85) / (V3T.stage - 77.85));        // 出口的光越来越亮，到全白（用户分镜）
        return { scene: sA, camera: cam, post: { dither: 1.2, bloom: { strength: 0.7 + 0.7 * wu, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + 0.2 * wu, grade: { vignette: 0.4 * (1 - wu) }, flash: { amount: wu * wu, color: '#fffbe6' } } }; } },
    { ...stageShot,
      update(_, T) { const r = stageShot.update(_, T), k = Math.min(5, Math.floor((T - V3T.stage) / BAR + 1e-6)), u = T - camBar(k);
        // 手别贴进脸里（#1065）：stage.js 摆完姿势之后，把离头太近的手沿肩关节转出去，再让五官层按新的手位重画一遍
        let camS = r.camera;
        if (!window.__v3NoHandFix) keepHandsOffFace(T);
        if (window.__v3Side) { camS = sideCam(); }                  // 自查用：从她的正侧面看头和手
        if (!window.__v3NoHandFix || window.__v3Side) { const hp = girl.headPosition(V3()).project(camS), headIn = Math.abs(hp.x) < 0.92 && Math.abs(hp.y) < 0.92 && hp.z < 1;
          try { girl.face?.update(T, headIn ? { blink: 'auto', camera: camS } : { blink: 'auto' }); } catch {} }
        const cutFlash = k === 0 ? 1.0 * Math.exp(-u / 0.16) : 0.18 * Math.exp(-u / 0.07);   // 进舞台：灯亮的白闪；之后每次换机位轻轻一闪
        return { scene: r.scene, camera: camS, post: { ...r.post, dither: 1.5, grade: { ...r.post.grade, exposure: 1 - 0.6 * dark(T) }, flash: { amount: Math.max(cutFlash, r.post.flash?.amount ?? 0), color: k === 0 ? '#fffbe6' : '#ffffff' } } }; } },
    { id: 'v3-collapse', t0: V3T.outside, t1: V3T.end, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { showD(); const w = worldD(T), fin = smooth((T - V3T.outside) / 0.35), near = clamp(1 - (w.zf - w.z) / 30), go = T >= D.go ? Math.exp(-(T - D.go) / 0.12) : 0;
        return { scene: sA, camera: cam, post: { dither: 1.2, bloom: { strength: 0.7, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + 0.25 * near * kick(T) + 0.4 * go, grade: { vignette: 0.38, exposure: 0.2 + 0.8 * fin }, flash: { amount: 0.45 * go, color: '#fff2c8' } } }; } },
  ];

  // 自检用：出口那一帧的参数（给副歌 3 对接口）
  window.__v3Exit = () => { showD(); const w = worldD(V3T.end), H = 2;                    // 换算成「她的身高 = 1」的单位，和副歌 3 的入口规格对
    const h = girl.headPosition(V3()), f = BI.LeftFoot.bone.getWorldPosition(V3()).add(BI.RightFoot.bone.getWorldPosition(V3())).multiplyScalar(0.5);
    const v = (dropD(V3T.end) - dropD(V3T.end - 0.01)) / 0.01, pr = q0 => { const q = q0.clone().project(cam); return [+(q.x * 0.5 + 0.5).toFixed(3), +(0.5 - q.y * 0.5).toFixed(3)]; };
    return { T: V3T.end, camAbove: +((cam.position.y - w.cen.y) / H).toFixed(2), fov: cam.fov, up: cam.up.toArray().map(x => +x.toFixed(2)), speed: +(v / H).toFixed(2), headScreen: pr(h), feetScreen: pr(f), centerScreen: pr(w.cen), heightFrac: +Math.abs(pr(h)[1] - pr(f)[1]).toFixed(3) }; };
  // 调试：T 时刻她的头在屏幕上的位置（0..1）；A 段还给脸和镜头的夹角（度；0 = 正对镜头）
  // 自查脚滑：T 时刻「踩地的那只脚」（较低的那只）在世界里的水平速度（m/s）；应接近 0
  window.__v3Slide = T => { const foot = t => { showD(); worldD(t); return ['LeftToeBase', 'RightToeBase'].map(k => (BI[k] ?? BI[k.replace('ToeBase', 'Foot')]).bone.getWorldPosition(V3())); };
    const a = foot(T), b = foot(T + 1 / 60), i = a[0].y < a[1].y ? 0 : 1; return { T, foot: i ? 'R' : 'L', y: +(a[i].y - FEET_Y).toFixed(3), vz: +((b[i].z - a[i].z) * 60).toFixed(2), body: +((zD(T + 1 / 60) - zD(T)) * 60).toFixed(2) }; };
  // 自查手和头：T 时刻两只手（手腕骨、中指根）离头中心多远（单位：她的身高）
  window.__v3Hand = T => { const sh = shots.find(x => T >= x.t0 && T < x.t1); sh.update(null, T); girl.root.updateMatrixWorld(true);
    const hc = girl.headPosition(V3()), sc = girl.root.scale.x, o = { T, keys: Object.keys(BI).filter(k => /Hand/.test(k)).length };
    for (const k of ['LeftHand', 'RightHand', 'LeftHandMiddle1', 'RightHandMiddle1', 'LeftHandMiddle3', 'RightHandMiddle3']) if (BI[k]) o[k] = +(BI[k].bone.getWorldPosition(V3()).distanceTo(hc) / sc).toFixed(3);
    return o; };
  window.__v3D = T => { showD(); const w = worldD(T); return { z: +w.z.toFixed(1), zf: +w.zf.toFixed(1), clip: CLIPP.constant, lce: mv.stage.renderer.localClippingEnabled, cam: cam.position.toArray().map(x => +x.toFixed(1)) }; };
  window.__v3Dbg = T => { const sh = shots.find(x => T >= x.t0 && T < x.t1) ?? shots.at(-1), r = sh.update(null, T);
    const q = girl.headPosition(V3()).project(r.camera);
    return { T, shot: sh.id, headScr: [+(q.x * 0.5 + 0.5).toFixed(3), +(0.5 - q.y * 0.5).toFixed(3)], faceAngle: +faceAngle(r.camera).toFixed(1),
      faceFrac: +(0.2 * girl.root.scale.x / (2 * r.camera.position.distanceTo(girl.headPosition(V3())) * Math.tan(r.camera.fov * Math.PI / 360))).toFixed(3) }; };      // faceFrac：脸高约占画高多少（头高按 0.2 身高估）
  return shots;
}
