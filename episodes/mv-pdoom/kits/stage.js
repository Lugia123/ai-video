// kits/stage.js —— 全片共用的演唱会舞台（#1051）。副歌 2、主歌 3、副歌 4 切到的都是这一座：同样的灯架、LED 大屏、镭射伴舞。
// 舞台是独立的空间：只唱跳，不演剧情、不放剧情道具（fresh/v4-rest/BRIEF.md 最末「更正」一节）。
// 镭射伴舞和 LED 大屏用的是 kits/holo-dancer.js（0xe678，#1033）的 createHoloDancers / createLedScreen，这里只是组合调用。
//
//   import { createStage } from '../kits/stage.js';
//   const stage = await createStage(mv, {
//     dancers: 12,                    // 最多几个伴舞（偶数；每帧可以只亮其中前几个：4 / 8 / 12）
//     formation: 'sides',             // 默认队形：'sides' 两侧对称 | 'row' 身后一排 | 'vee' V 字（C 位在尖上）| 'ring' 环绕 | 'mirror' 镜面阵列
//     variant: 'fan',                 // 这座舞台默认的布景变体（见下面 VARIANTS）；每个 stage.shot 也可以各点各的
//     delays: [0, 0.5],               // 伴舞晚几拍：按「第几对」轮着取（第 0 对踩拍、第 1 对晚半拍……）；每种值多加载一个骨架
//     mirror: true,                   // 右边的伴舞左右镜像
//     lead: 'act__rapping',           // C 位唱歌用的动捕（左手持麦；右手默认改成放松垂在身侧，singFix: false 关掉）；给 girl.play 的编排数组 = 完全自己管
//     leadPattern: [2, 2],            // C 位唱 ↔ 跳交替：[唱几小节, 跳几小节]（跳 = 和伴舞同一支）；[1, 0] 一直唱，[0, 1] 一直跳
//     led: { … },                     // 原样传给 createLedScreen 的参数（#1055 的大屏播放表等）；每帧的大屏参数用 update 的 screen: { … } 传
//     crew: ['dance__kick-step', 'dance__raise-roof', 'dance__body-wave', 'dance__jazz-around'],   // 伴舞：每 2 小节换一支；也可给编排数组
//     lyrics: [[58.42, 74.78]],       // 大屏只对这些时间范围里的歌词对口型、出字幕条（不给 = 整首歌）
//     girl,                           // 可选：已有的 girl 实例（不给就自己建一个）
//   });
//
//   // ① 最省事：一个引擎镜头，里面按拍子切机位（切点自动落在拍上）
//   shots.push(stage.shot({ id: 'c2-stage', t0: 62.05, t1: 65.69, plan: ['wide', 'mid'], lights: 1 }));
//   //    plan 的每一项：机位名，或 { cam, bars = 1 | beats, flip, dancers, formation, lights, blackout, spot, expression, ticker, … }
//   //    （除 cam / bars / beats 外都是 stage.update 的参数，可以写成 T => 值）；plan 用完了从头循环，直到 t1。
//
//   // ② 自己调度：stageShots 只算「这一刻用哪个机位、进行到哪」，画由 stage.update 画
//   const sched = stageShots(mv, t0, t1, ['wide', { cam: 'screen', bars: 2 }]);
//   update(_, T) { const s = sched.at(T); return stage.update(T, { cam: s.cam, u: s.u, lights: 1.2 }); }   // → { scene, camera, post }
//
// stage.update(T, opts)：
//   variant    这一帧用哪套布景变体（'fan' | 'pillars' | 'cross' | 'finale'）：灯色、光束样式、默认人数 / 队形 / 灯光强度都跟着换
//   cam        机位：'wide' 大全景 | 'mid' C 位中景 | 'screen' 推近大屏（推到铺满 = 干净的 2D 唱歌特写，像素格淡掉）
//              | 'closeup' 一直是铺满的 2D 特写 | 'low' 低机位仰拍 | 'side' 侧面跟拍 | 'orbit' 绕 C 位环绕 | 'crane' 升 | 'dolly' 推
//              | 'pan' 摇 | 'top' 俯拍；或 (u, stage) => ({ pos, look, fov, led })。reverse: true = 倒着走（升变降、推变拉）
//   lead       C 位这一帧 'sing' 唱 | 'dance' 跳；不写 = 按 leadPattern 自动交替
//   palette / beams   单独改灯色（三个颜色）/ 光束样式（'fan' | 'pillars' | 'cross' | 'burst'）
//   screen     原样并进 led.update 的参数（大屏播放表选哪条等，#1055）
//   u          这个机位进行到哪（0..1，机位自己的慢推 / 横移用）；flip: true = 左右对调
//   dancers    亮几个伴舞（≤ 创建时的数）；formation 队形；crewOpacity 伴舞整体不透明度（0..1）
//   lights     灯光强度：0 = 只有基础照明，1 = 正常，1.5 = 终场最满（多一圈光束 + 重拍频闪）
//   blackout   0..1：1 = 身后的灯、大屏、伴舞、荧光棒全灭，只剩 C 位头顶一束顶光（「Was it all for show」那一小节）
//   spot       顶光强度（默认 1）
//   expression 大屏上她的表情（neutral / smile / surprised / wink / closed）；ticker 大屏下沿歌词条（默认开）
// 灯光随拍：光束每拍一亮、每小节换一组颜色（粉 / 薄荷 / 柠黄轮换），台面灯带跟着拍子走，荧光棒随拍摆。
// 全部是 T 的纯函数。尺寸单位 = 她的身高（1）。
// 开销（1920×1080，实测 2026-10-02）：--gpu 每帧 16–23 ms，4 / 8 / 12 个伴舞差别不大；默认的软件渲染（SwiftShader）每帧约 0.7–1.2 s，舞台镜头建议用 --gpu 渲。
// 加载：1 个 C 位 + 每种延迟 1 个伴舞骨架（默认 2 个）= 3 个 girl 实例；传 girl 进来可以和剧情镜头共用 C 位那个。
// 演示页：kits/_gallery/stage.html（成片 kits/_gallery/out/stage.mp4、stage-sheet.png）。

import * as THREE from 'three';
import { PALETTE } from '../engine/palette.js';
import { createGirl, loadAnims, getAnim } from './girl.js';
import { createHoloDancers, createLedScreen } from './holo-dancer.js';
import { createChoreo, blendSolved, normalizeSpecExport } from '../../../assets/lib/dance3d.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const col = (c, k = 1) => new THREE.Color(c).multiplyScalar(k);
const val = (v, T) => (typeof v === 'function' ? v(T) : v);

export const LEAD_POS = [0, 0, 0.15];                 // C 位
export const LED = { y: 3.0, z: -3.3, width: 6.6 };   // 主屏中心高度 / 位置 / 宽（下沿 1.14，比她头顶高，字幕条不被人挡）

/** 队形：n 个伴舞的站位（偶数下标在左、奇数在右，一对一对从里往外排）。 */
export const FORMATIONS = {
  // 两侧对称：C 位两边各一组，前后错开
  sides: n => [[1.25, -0.55], [2.45, -1.05], [1.85, -1.95], [3.55, -1.6], [0.75, -2.35], [3.05, -2.6]].slice(0, n / 2).flatMap(([x, z]) => [{ x: -x, z }, { x, z }]),
  // 身后一排（12 个时排成前后两排）
  row: n => {
    const front = Math.min(n, 8) / 2, back = (n - front * 2) / 2, out = [];
    for (let i = 0; i < front; i++) { const x = (front === 2 ? 1.15 : 0.6) + i * (front === 2 ? 1.55 : 1.12); out.push({ x: -x, z: -1.45 }, { x, z: -1.45 }); }
    for (let i = 0; i < back; i++) { const x = 1.15 + i * 1.12; out.push({ x: -x, z: -2.5 }, { x, z: -2.5 }); }
    return out;
  },
  // V 字：C 位在尖上，两翼往后往外张开
  // 环绕：围着 C 位一圈（正前方留一个口子，不挡她）
  ring: n => { const m = n / 2, R = n > 8 ? 2.35 : 1.95; return Array.from({ length: m }, (_, i) => (40 + 135 * (i + 0.5) / m) * Math.PI / 180).flatMap(a => [{ x: -Math.sin(a) * R, z: LEAD_POS[2] + Math.cos(a) * R }, { x: Math.sin(a) * R, z: LEAD_POS[2] + Math.cos(a) * R }]); },
  // 镜面阵列：她身后一排排往深处排，每排 4 个，越往后越淡、往外错开一点（像镜子里一层层的像；正面看前后排不重叠）
  mirror: n => Array.from({ length: n / 2 }, (_, p) => [0.78 + 1.56 * (p % 2) + 0.4 * (p >> 1), -0.35 - 1.05 * (p >> 1), 0.82 ** (p >> 1) * (p >> 1 ? 0.8 : 1)]).flatMap(([x, z, dim]) => [{ x: -x, z, dim }, { x, z, dim }]),
  vee: n => { const m = n / 2, dx = Math.min(0.8, 3.1 / Math.max(1, m - 1)), dz = Math.min(0.6, 2.3 / Math.max(1, m - 1)); return Array.from({ length: m }, (_, i) => [1.45 + dx * i, -0.55 - dz * i]).flatMap(([x, z]) => [{ x: -x, z }, { x, z }]); },
};

/** 机位预设：u（0..1）→ { pos, look, fov, led }；led = 大屏像素格的强度（1 = LED 质感，0 = 干净的 2D 画面）。 */
export const CAMS = {
  wide: u => ({ pos: [0.6 - 0.5 * u, 1.2, 8.3 - 0.6 * u], look: [0, 2.15, -1.6], fov: 32, led: 1 }),                 // 大全景：舞台 + 大屏 + 伴舞 + 灯架，慢推
  mid: u => ({ pos: [-0.35 + 0.3 * u, 0.6, 3.5], look: [0, 1.12, -0.6], fov: 32, led: 1 }),                          // C 位中景：略仰，带到两侧内圈伴舞
  low: u => ({ pos: [-1.0 + 0.4 * u, 0.14, 1.95], look: [0.05, 1.08, -0.1], fov: 42, led: 1 }),                       // 低机位仰拍：她 + 头顶的灯架和光束
  side: u => ({ pos: [2.3, 1.0, 3.0 - 1.0 * u], look: [-0.15, 0.92, -0.1], fov: 40, led: 1 }),                      // 侧面跟拍：从台口一侧斜着拍 C 位（她离镜头最近），沿台口往里移；伴舞在她身后
  screen: u => {                                                                                                     // 推近大屏：越过她的头顶，推到屏幕铺满
    const p = smooth(u / 0.8), fill = (LED.width * 9 / 16 / 2) / Math.tan(32 * Math.PI / 360);
    return { pos: [0, lerp(1.9, LED.y, p), lerp(5.6, LED.z + fill, p)], look: [0, LED.y, LED.z], fov: 32, led: 1 - smooth((p - 0.55) / 0.4) };
  },
  orbit: u => { const a = lerp(-0.62, 0.62, u), R = 3.9; return { pos: [Math.sin(a) * R, 1.15, LEAD_POS[2] + Math.cos(a) * R], look: [0, 1.1, -0.2], fov: 34, led: 1 }; },    // 绕 C 位环绕（正面 ±35° 的一段弧：再往侧面去伴舞会和她叠在一起）
  crane: u => { const s = smooth(u); return { pos: [0.3, lerp(0.35, 3.6, s), lerp(4.2, 6.4, s)], look: [0, lerp(1.0, 1.6, s), -0.8], fov: 34, led: 1 }; },                    // 升：从台口贴地升到半空，亮出整座舞台
  dolly: u => { const s = u ** 1.5; return { pos: [0.2, lerp(1.2, 0.85, s), lerp(8.6, 3.3, s)], look: [0, lerp(2.0, 1.1, s), -0.8], fov: 32, led: 1 }; },                     // 推：大全景一路推到 C 位中景
  pan: u => ({ pos: [-0.4, 0.95, 4.6], look: [lerp(-3.2, 3.2, smooth(u)), 1.05, -0.9], fov: 30, led: 1 }),                                                                    // 摇：从一侧伴舞扫过 C 位到另一侧
  top: u => ({ pos: [0, 5.4 - 0.5 * u, 3.2], look: [0, 0.6, -0.6], fov: 38, led: 1 }),                                                                                        // 俯拍：看队形
  closeup: () => ({ pos: [0, LED.y, LED.z + (LED.width * 9 / 16 / 2) / Math.tan(32 * Math.PI / 360)], look: [0, LED.y, LED.z], fov: 32, led: 0 }),   // 一直铺满：2D 唱歌特写
};

/**
 * 布景变体：同一座舞台的几套「打扮」——运镜套路 + 伴舞人数和队形 + 灯光主色和光束样式。各段各用一套，不撞（用了哪套写进各段 plan）。
 *   palette 三个灯色（每小节轮一格；霓虹灯管也跟着换）；beams 光束样式：'fan' 扇形慢摇 | 'pillars' 竖直光柱跑马 | 'cross' 交叉剪刀 | 'burst' 重拍聚到 C 位再炸开
 *   plan 默认的机位顺序（stage.shot 没给 plan 时用）；dancers / formation / lights 同 stage.update 的参数。
 * 用法：stage.shot({ variant: 'pillars', t0, t1 })；想改其中一项就在后面写（写了的优先）。也可以给 stage.update 传 variant。
 */
export const VARIANTS = {
  fan: { palette: [PALETTE.pink, PALETTE.mint, PALETTE.lemon], beams: 'fan', dancers: 4, formation: 'sides', lights: 1,                      // 第一版的样子（副歌 2 在用）
    plan: ['wide', 'mid', 'screen'] },
  pillars: { palette: [PALETTE.mint, PALETTE.paper, '#5C86FF'], beams: 'pillars', dancers: 8, formation: 'mirror', lights: 1,                // 冷色光柱 + 镜面阵列
    plan: ['crane', 'low', { cam: 'pan', bars: 1 }, 'mid'] },
  cross: { palette: [PALETTE.lemon, PALETTE.pink, PALETTE.paper], beams: 'cross', dancers: 8, formation: 'vee', lights: 1.15,               // 柠黄交叉光 + V 字
    plan: ['dolly', 'orbit', 'side', 'screen'] },
  finale: { palette: [PALETTE.pink, PALETTE.lemon, PALETTE.mint], beams: 'burst', dancers: 12, formation: 'ring', lights: 1.5,              // 终场最满：12 人环绕 + 聚光炸开
    plan: [{ cam: 'crane', bars: 2 }, 'top', 'low', { cam: 'dolly', flip: true }, 'screen'] },                                             // 环形队形别用 orbit / side：前排伴舞会挡住镜头
};

/**
 * 按拍子切机位的调度。plan = ['wide', { cam: 'mid', bars: 2 }, { cam: 'low', beats: 2, flip: true }, …]（用完从头循环）。
 * 第一个机位从 t0 开始，之后每个切点 = 「t0 之后第一个重拍」起按 bars / beats 累加，落在拍上；最后一个到 t1。
 * 返回 { segs: [{ t0, t1, cam, …该项其余字段 }], at(T) → { …seg, u, i } }。
 */
export function stageShots(mv, t0, t1, plan = ['wide', 'mid', 'screen']) {
  const { music } = mv, P = music.period;
  const items = plan.map(p => (typeof p === 'string' ? { cam: p } : p));
  const lenOf = it => (it.beats ?? (it.bars ?? 1) * 4);
  // 以 t0 所在的那一拍为基准往后数拍子（t0 本身通常就在重拍上；不在的话第一段长一点 / 短一点，后面的切点仍在拍上）
  const b0 = music.beatAt(t0 + P * 0.5).i;                       // 最接近 t0 的那一拍
  const segs = [];
  let beat = b0, k = 0, start = t0;
  while (start < t1 - 1e-3) {
    const it = items[k % items.length]; beat += lenOf(it);
    let end = music.beatTime(beat);
    if (end > t1 - P * 0.75 || k > 400) end = t1;                // 剩下不到一拍：并进这一段
    const { bars, beats, ...rest } = it;
    segs.push({ ...rest, t0: start, t1: end });
    start = end; k++;
  }
  const at = T => { let i = 0; while (i < segs.length - 1 && T >= segs[i].t1) i++; const s = segs[i]; return { ...s, i, u: clamp((T - s.t0) / Math.max(1e-3, s.t1 - s.t0)) }; };
  return { segs, at };
}

// 一根方截面的桁架：四根弦杆 + 之字斜撑（线框）
function trussGeo(a, b, w = 0.28) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length(); d.normalize();
  const u = new THREE.Vector3().crossVectors(d, Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize(), v = new THREE.Vector3().crossVectors(d, u);
  const corner = (s, i, j) => A.clone().addScaledVector(d, s).addScaledVector(u, i * w / 2).addScaledVector(v, j * w / 2);
  const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]], pts = [];
  for (const [i, j] of C) pts.push(corner(0, i, j), corner(L, i, j));
  const n = Math.max(2, Math.round(L / w));
  for (let k = 0; k < n; k++) for (let f = 0; f < 4; f++) {
    const [i0, j0] = C[f], [i1, j1] = C[(f + 1) % 4], s0 = k / n * L, s1 = (k + 1) / n * L;
    pts.push(corner(s0, ...(k % 2 ? [i0, j0] : [i1, j1])), corner(s1, ...(k % 2 ? [i1, j1] : [i0, j0])));
    if (f === 0) for (const [i, j] of C) { const [i2, j2] = C[(C.findIndex(c => c[0] === i && c[1] === j) + 1) % 4]; pts.push(corner(s0, i, j), corner(s0, i2, j2)); }
  }
  return pts;
}

export async function createStage(mv, {
  dancers = null, formation = null, delays = [0, 0.5], mirror = true,
  lead = 'act__rapping', crew = ['dance__kick-step', 'dance__raise-roof', 'dance__body-wave', 'dance__jazz-around'],
  leadPattern = [2, 2], singFix = true,
  variant = 'fan', lyrics = null, girl = null, crowd = true, led: ledOpts = {},
} = {}) {
  const { music } = mv, P = music.period;
  const baseV = VARIANTS[variant] ?? VARIANTS.fan;
  const showDefault = dancers ?? baseV.dancers;                   // 没写 dancers：能亮到 12 个，默认亮这套变体的人数
  dancers = dancers ?? 12; dancers = Math.max(0, dancers - dancers % 2);
  formation = formation ?? baseV.formation;
  // ---------------------------------------------------------------- 动捕编排（从歌的第 0 小节排起：任何时刻的姿态只取决于 T，各段切进来都接得上）
  const bars = Math.ceil(music.duration / (P * 4)) + 2;
  const leadCustom = Array.isArray(lead);                         // 给了编排数组 = 完全自己管 C 位（不做唱 / 跳交替，也不改手臂）
  const leadSeq = leadCustom ? lead : [{ bar: -1, anim: lead }];
  const crewSeq = crew.length && typeof crew[0] === 'object' ? crew : Array.from({ length: Math.ceil(bars / 2) + 1 }, (_, k) => ({ bar: k * 2 - 1, anim: crew[k % crew.length] }));
  const [g] = await Promise.all([girl ?? createGirl(mv), loadAnims([...new Set([...leadSeq, ...crewSeq].map(e => e.anim).filter(Boolean))])]);
  girl = g;

  // ---------------------------------------------------------------- 伴舞（一对一对：左 / 右；第 p 对的延迟 = delays[p % len]）
  const F0 = FORMATIONS.sides(dancers);
  const crewKit = dancers ? await createHoloDancers(mv, girl, { slots: F0.map((s, i) => ({ ...s, delay: delays[(i >> 1) % delays.length], mirror: mirror && i % 2 === 1 })) }) : null;

  // ---------------------------------------------------------------- 大屏（只对 lyrics 范围里的词对口型 / 出字幕）
  const inRange = t => !lyrics || lyrics.some(([a, b]) => t >= a - 0.05 && t < b);
  const lines = mv.lyrics.lines.map(l => { const words = l.words.filter(w => inRange(w.start)); return words.length ? { ...l, words, start: words[0].start, end: words.at(-1).end, text: words.map(w => w.w).join(' ') } : null; }).filter(Boolean);
  const led = await createLedScreen({ ...mv, lyrics: { ...mv.lyrics, lines } }, { ...ledOpts, width: LED.width });   // ledOpts 原样传给 createLedScreen（#1055 的播放表等）

  // ================================================================ 场景
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#05040c'); scene.fog = new THREE.Fog('#05040c', 11, 30);
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.05, 200);
  // 她身上的灯（卡通皮肤要灯；全息伴舞是自发光，不吃灯）
  const L = {
    hemi: new THREE.HemisphereLight('#f5f0ff', '#2a2035', 0.9),
    key: new THREE.DirectionalLight('#fff4ea', 2.2), rimA: new THREE.DirectionalLight(PALETTE.pink, 2.6), rimB: new THREE.DirectionalLight(PALETTE.mint, 1.55),
    top: new THREE.DirectionalLight('#fff8e8', 0),
  };
  L.key.position.set(1.5, 3, 2.5); L.rimA.position.set(-2.5, 1.8, -2); L.rimB.position.set(2.5, 1.2, -2.2); L.top.position.set(0, 6, 0.6);
  for (const l of Object.values(L)) { scene.add(l); if (l.target) scene.add(l.target); }
  if (crewKit) scene.add(crewKit.group);
  led.mesh.position.set(0, LED.y, LED.z); scene.add(led.mesh);

  const W = 11, D0 = -4.7, D1 = 2.7;                              // 台面：宽 11，z 从 −4.7 到 2.7
  const world = new THREE.Group(); scene.add(world);
  const dimmable = [];                                            // { mat, base, role, k }：blackout 时一起压暗；role = 用变体 palette 的第几个颜色（null = 不换色）
  const ROLE = { [PALETTE.pink]: 0, [PALETTE.mint]: 1, [PALETTE.lemon]: 2 };
  const dim = (mat, role = null, k = 1) => { dimmable.push({ mat, base: mat.color.clone(), role, k }); return mat; };
  const neon = (c, k = 2.6) => dim(new THREE.MeshBasicMaterial({ color: col(c, k), toneMapped: false }), ROLE[c] ?? null, k);
  // ---- 台面：一块抬高的台子 + 台口立面
  { const deck = new THREE.Mesh(new THREE.BoxGeometry(W, 0.9, D1 - D0), new THREE.MeshStandardMaterial({ color: '#0b0a15', roughness: 0.92, metalness: 0 }));
    deck.position.set(0, -0.45, (D0 + D1) / 2); world.add(deck);
    const pit = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshBasicMaterial({ color: '#030308' })); pit.rotation.x = -Math.PI / 2; pit.position.set(0, -0.9, 8); world.add(pit);   // 台下
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ color: '#070610' })); wall.position.set(0, 4, D0 - 0.6); world.add(wall); }
  const tube = (c, w, x, y, z, ry = 0, t = 0.05) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, t, t), neon(c)); m.position.set(x, y, z); m.rotation.y = ry; world.add(m); return m; };
  tube(PALETTE.mint, W, 0, 0.03, D1 - 0.03);                                                    // 台口
  tube(PALETTE.pink, D1 - D0, -W / 2 + 0.03, 0.03, (D0 + D1) / 2, Math.PI / 2); tube(PALETTE.pink, D1 - D0, W / 2 - 0.03, 0.03, (D0 + D1) / 2, Math.PI / 2);
  tube(PALETTE.lemon, W, 0, -0.42, D1 + 0.01, 0, 0.04);                                         // 台口立面中间一道
  // ---- 台面灯带：纵横几条，亮度沿着走（跑马），每拍一亮
  const strips = [];
  { const mk = (x0, z0, x1, z1, k) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([x0, 0.006, z0, x1, 0.006, z1], 3)); const m = new THREE.Line(g, new THREE.LineBasicMaterial({ color: '#000', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); world.add(m); strips.push({ m, k }); };
    [-4.2, -2.8, -1.4, 1.4, 2.8, 4.2].forEach((x, i) => mk(x, D0 + 0.4, x, D1 - 0.2, i));
    [-3.6, -2.2, -0.9, 0.9].forEach((z, i) => mk(-W / 2 + 0.3, z, W / 2 - 0.3, z, 6 + i)); }
  // ---- 灯架：后排两根立柱 + 后横梁 + 中横梁 + 两侧纵梁（线框桁架）
  const TR = { x: 5.0, yB: 5.3, yM: 5.15, zB: -3.75, zM: -1.3 };
  { const pts = [
      ...trussGeo([-TR.x, 0, TR.zB], [-TR.x, TR.yB + 0.15, TR.zB]), ...trussGeo([TR.x, 0, TR.zB], [TR.x, TR.yB + 0.15, TR.zB]),
      ...trussGeo([-TR.x, TR.yB, TR.zB], [TR.x, TR.yB, TR.zB]), ...trussGeo([-TR.x, TR.yM, TR.zM], [TR.x, TR.yM, TR.zM]),
      ...trussGeo([-TR.x, TR.yM, TR.zM], [-TR.x, TR.yB, TR.zB]), ...trussGeo([TR.x, TR.yM, TR.zM], [TR.x, TR.yB, TR.zB]),
      ...trussGeo([-TR.x, 0, TR.zM], [-TR.x, TR.yM + 0.15, TR.zM]), ...trussGeo([TR.x, 0, TR.zM], [TR.x, TR.yM + 0.15, TR.zM]),
    ];
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    world.add(new THREE.LineSegments(g, dim(new THREE.LineBasicMaterial({ color: '#7d82a6' })))); }
  tube(PALETTE.lemon, TR.x * 2 - 0.4, 0, TR.yB - 0.22, TR.zB + 0.05);                           // 后横梁下沿的灯管（屏上方）
  // ---- 背墙竖灯带（屏两侧）
  const wallStrips = [];
  for (const x of [-6.3, -5.7, 5.7, 6.3]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 5.2, 0.04), new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false })); m.position.set(x, 2.8, D0 - 0.5); world.add(m); wallStrips.push(m); }
  // ---- 侧屏：两块竖屏，放的是主屏同一路画面的中间一条（共用主屏的材质，不多画一遍）
  { const wh = 3.5, ww = 1.95, cu = ww / wh * (0.8 * 900 / 1600) / 2;
    for (const s of [-1, 1]) {
      const geo = new THREE.PlaneGeometry(ww, wh), uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.5 + (uv.getX(i) - 0.5) * 2 * cu, 0.2 + uv.getY(i) * 0.8);
      const m = new THREE.Mesh(geo, led.panel.material), grp = new THREE.Group(); grp.add(m);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(ww + 0.24, wh + 0.24), new THREE.MeshBasicMaterial({ color: '#0b0a14' })); back.position.z = -0.02; grp.add(back);
      for (const [w, h, x, y] of [[ww + 0.18, 0.045, 0, wh / 2 + 0.07], [ww + 0.18, 0.045, 0, -wh / 2 - 0.07], [0.045, wh + 0.18, -ww / 2 - 0.07, 0], [0.045, wh + 0.18, ww / 2 + 0.07, 0]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.045), neon(PALETTE.mint, 2.2)); b.position.set(x, y, 0.01); grp.add(b); }
      grp.position.set(s * 4.55, 2.75, -2.75); grp.rotation.y = -s * 0.42; world.add(grp);
    } }
  // 主屏的霓虹框是 holo-dancer 里建的：把它的材质也登记进来，blackout 时一起灭
  led.mesh.traverse(o => { if (o.isMesh && o !== led.panel && o.material.toneMapped === false) dim(o.material, 0, 2.4); });

  // ---- 光束：摇头灯（后横梁 7 支 + 中横梁 6 支），加法锥光；灯头一个亮点
  const beamMat = () => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { c: { value: new THREE.Color() }, k: { value: 0 } },
    vertexShader: 'varying float h; void main(){ h = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',       // h：1 = 灯头，0 = 落地那头（淡到没有）
    fragmentShader: 'uniform vec3 c; uniform float k; varying float h; void main(){ gl_FragColor = vec4(c * k * pow(clamp(h, 0.0, 1.0), 1.6), 1.0); }' });
  const lensGeo = new THREE.SphereGeometry(0.07, 12, 8);
  const mkBeam = (x, y, z, { len = 5.6, r = 0.5, tilt = 0, pitch = 0, row = 0 }) => {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.05, r, len, 24, 1, true), beamMat()); cone.position.y = -len / 2; cone.renderOrder = 6;
    const lens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false }));
    const piv = new THREE.Group(); piv.position.set(x, y, z); piv.add(cone, lens); scene.add(piv);
    return { piv, cone, lens, x, tilt, pitch, row };
  };
  const beams = [
    ...[-4.2, -2.8, -1.4, 0, 1.4, 2.8, 4.2].map(x => mkBeam(x, TR.yB - 0.3, TR.zB + 0.25, { tilt: -x * 0.09, pitch: -0.32, row: 0, len: 6.4 })),
    ...[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map(x => mkBeam(x, TR.yM - 0.25, TR.zM, { tilt: x * 0.1, pitch: -0.1, row: 1, len: 5.6 })),
    ...[-4.6, 4.6].map(x => mkBeam(x, 0.25, D0 + 0.8, { tilt: 0, pitch: Math.PI - 0.25, row: 2, len: 7, r: 0.4 })),      // 台面两角往上打的两支（lights > 1.1 才亮）
  ];
  // C 位的顶光：一束窄锥 + 地上的光斑
  const spotBeam = mkBeam(LEAD_POS[0], 5.6, LEAD_POS[2] + 0.1, { len: 5.6, r: 0.62 }); spotBeam.cone.material.uniforms.c.value.set('#fff4d6');
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.85, 48), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float k; varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(vec3(1.0, 0.96, 0.84) * k * smoothstep(1.0, 0.2, r), 1.0); }' }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(LEAD_POS[0], 0.008, LEAD_POS[2]); scene.add(pool);
  // ---- 烟雾：几团很淡的大光晕，慢慢横着飘，染上当下的灯色
  const hazeTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const haze = Array.from({ length: 7 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, color: '#000', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.scale.set(5 + 2.5 * hash(i, 3), 2.2 + 1.2 * hash(i, 4), 1); s.renderOrder = 4; scene.add(s); return s; });
  // ---- 台下的荧光棒：稀稀的一片小光点，随拍左右摆
  let sticks = null;
  if (crowd) {
    const n = 150, p = new Float32Array(n * 3), c = new Float32Array(n * 3), base = [];
    const cs = [PALETTE.pink, PALETTE.mint, PALETTE.lemon].map(x => col(x));
    for (let i = 0; i < n; i++) { const x = (hash(i, 1) - 0.5) * 17, z = D1 + 1.2 + hash(i, 2) * 7.5, y = -0.75 + hash(i, 3) * 0.45 + (z - D1) * 0.03; base.push([x, y, z]); const k = cs[Math.floor(hash(i, 4) * 3)]; c.set([k.r, k.g, k.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const m = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); m.frustumCulled = false; scene.add(m);
    sticks = { m, p, base, n };
  }

  // ================================================================ C 位：唱歌 ↔ 跳舞
  // 唱歌 = act__rapping（左手持麦举在嘴前）；singFix：片段里右手一直在胸前乱比划 → 右臂换成放松垂在身侧、随拍轻轻摆。
  // 跳舞 = 和伴舞同一支（踩拍那一组）。leadPattern = [唱几小节, 跳几小节]（从歌的第 0 小节数起；[1, 0] 一直唱，[0, 1] 一直跳），
  //   交界处 0.3 s 内混过去；plan 里某一项写了 lead: 'sing' | 'dance' 就按它（切机位那一下直接换，不混）。
  const D = girl.dancer, RARM = /^Right(Arm|ForeArm|Hand)/;
  const danceChoreo = createChoreo(crewSeq.map(e => ({ beat: e.beat ?? (e.bar != null ? girl.clock.barToBeat(e.bar) : girl.clock.beats(e.t)), move: getAnim(e.anim) })), { clock: girl.clock, blend: 0.25 / P });
  const singClip = leadCustom ? null : getAnim(lead);
  function singPose(T) {
    const pose = singClip.solve(girl.clock.beats(T), D);
    if (!singFix) return pose;
    const bt = music.beatAt(T), sw = Math.sin((bt.i + bt.phase) * Math.PI), bp = Math.exp(-bt.phase * 5);
    const arm = D.solver.solve(normalizeSpecExport({ handR: { pos: [-0.3 - 0.03 * sw, -0.84 + 0.03 * bp, 0.16 + 0.05 * sw], pole: [-0.3, -0.2, -1], wrist: [0, 0, 0], grip: 0.3 } }, {}));
    const d = { ...pose.d }; for (const k of Object.keys(d)) if (RARM.test(k) && arm.d[k]) d[k] = arm.d[k];
    return { ...pose, d };
  }
  const [nSing, nDance] = leadPattern, cyc = Math.max(1, nSing + nDance);
  const danceW = T => {                                             // 0 = 唱，1 = 跳
    if (!nDance) return 0; if (!nSing) return 1;
    const bar = music.barAt(T), k = ((bar.i % cyc) + cyc) % cyc, mode = k >= nSing ? 1 : 0, prev = ((k - 1 + cyc) % cyc) >= nSing ? 1 : 0;
    return lerp(prev, mode, smooth((T - bar.t0) / 0.3));
  };
  function poseLead(T, mode) {
    if (leadCustom) { girl.play(leadSeq, T); return; }
    const w = mode === 'sing' ? 0 : mode === 'dance' ? 1 : danceW(T);
    D.apply(w <= 0 ? singPose(T) : w >= 1 ? danceChoreo.at(T, D) : blendSolved(singPose(T), danceChoreo.at(T, D), w));
  }

  // ================================================================ 每帧
  const _pal = {};
  const _c = new THREE.Color(), _v = new THREE.Vector3();
  let curForm = null, curN = -1;
  function layout(name, n) {
    if (!crewKit || (name === curForm && n === curN)) return;
    curForm = name; curN = n;
    const F = (FORMATIONS[name] ?? FORMATIONS.sides)(n);
    crewKit.items.forEach((it, i) => { if (i < n) { it.x = F[i].x; it.z = F[i].z; it.dimK = F[i].dim ?? 1; if (it.ring) it.ring.position.set(it.x, 0.006, it.z); } });
  }
  function update(T, o = {}) {
    const vName = val(o.variant, T), V = VARIANTS[vName ?? variant] ?? VARIANTS.fan;
    // 这一帧点名了变体：人数 / 队形 / 灯光强度用它的；没点名：用 createStage 时定的（旧的调用不受影响）
    o = { ...(vName ? { lights: V.lights, dancers: Math.min(dancers, V.dancers), formation: V.formation } : { lights: baseV.lights, dancers: Math.min(dancers, showDefault), formation }), ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) };
    const PAL3 = (val(o.palette, T) ?? V.palette).map(c => _pal[c] ??= new THREE.Color(c)), style = val(o.beams, T) ?? V.beams;
    const lights = val(o.lights, T) ?? 1, blackout = clamp(val(o.blackout, T) ?? 0), spot = val(o.spot, T) ?? 1, on = 1 - blackout;
    const nShow = Math.min(dancers, val(o.dancers, T) ?? dancers), form = val(o.formation, T) ?? formation, CYC = PAL3;
    const kick = music.pulse('kick', T, { decay: 0.14 }), bt = music.beatAt(T), bar = music.barAt(T);
    const beatP = Math.exp(-bt.phase * 4.5), downP = Math.exp(-bar.phase * 9);
    // ---- 她：C 位，站定唱歌
    scene.add(girl.root); girl.root.visible = true;
    girl.root.position.set(...LEAD_POS); girl.root.rotation.set(0, 0, 0); girl.root.scale.setScalar(1);
    if (o.leadSeq) girl.play(val(o.leadSeq, T), T); else poseLead(T, val(o.lead, T) ?? null);
    girl.setSkin('toon', T);
    // ---- 伴舞
    if (crewKit) {
      layout(form, nShow);
      const op = (val(o.crewOpacity, T) ?? 1) * lerp(1, 0.0, smooth(blackout / 0.8));
      crewKit.update(T, { seq: val(o.crewSeq, T) ?? crewSeq, opacity: op, jitter: 0.25 });
      crewKit.items.forEach((it, i) => { if (i >= nShow) { it.g.visible = false; if (it.ring) it.ring.visible = false; } else if (it.dimK !== 1) { it.uniforms.uOpacity.value = op * it.dimK; if (it.ring) it.ring.material.opacity = op * it.dimK; } });
    }
    // ---- 机位
    const camDef = val(o.cam, T) ?? 'wide', uu = clamp(o.u ?? 0), C = (typeof camDef === 'function' ? camDef : CAMS[camDef] ?? CAMS.wide)(o.reverse ? 1 - uu : uu, api), fx = o.flip ? -1 : 1;
    camera.position.set(C.pos[0] * fx, C.pos[1], C.pos[2]); camera.up.set(0, 1, 0); camera.fov = C.fov ?? 32; camera.lookAt(C.look[0] * fx, C.look[1], C.look[2]);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    // 头在画面外时不传 camera（girl.js 的五官层在头出画时读回遮罩会报 RangeError；不传 camera = 网格投影五官）
    if (girl.face) { const hp = girl.headPosition(_v).project(camera), headIn = Math.abs(hp.x) < 0.92 && Math.abs(hp.y) < 0.92 && hp.z < 1; girl.face.update(T, headIn ? { blink: 'auto', camera } : { blink: 'auto' }); }
    // ---- 她身上的灯：blackout 时只剩头顶那一盏
    L.hemi.intensity = lerp(0.9, 0.12, blackout); L.key.intensity = 2.2 * on; L.rimA.intensity = 2.6 * on * (0.85 + 0.3 * beatP * Math.min(1, lights)); L.rimB.intensity = 1.55 * on;
    L.rimA.color.copy(CYC[((bar.i % 3) + 3) % 3]); L.rimB.color.copy(CYC[((bar.i + 1) % 3 + 3) % 3]);
    L.top.intensity = 3.2 * blackout * spot;
    // ---- 大屏
    led.update(T, { ...(val(o.screen, T) ?? {}), expression: val(o.expression, T) ?? 'neutral', led: C.led ?? 1, ticker: val(o.ticker, T) ?? true, zoom: val(o.zoom, T) ?? 1, bright: (1.05 + 0.25 * kick * Math.min(1, lights)) * lerp(1, 0.006, blackout) });
    // ---- 霓虹灯管 / 桁架
    for (const dm of dimmable) { if (dm.role == null) dm.mat.color.copy(dm.base); else dm.mat.color.copy(CYC[dm.role % CYC.length]).multiplyScalar(dm.k); dm.mat.color.multiplyScalar(lerp(1, 0.03, blackout)); }
    // ---- 光束：每小节一组颜色、每拍一亮、慢慢摇；lights > 1.1 再加台面两角往上打的两支；重拍那一下整排更亮
    const A = ((bar.i % 3) + 3) % 3, sway = T * (2 * Math.PI / (P * 8));
    const run2 = (bt.i + bt.phase) * 2, nMain = beams.filter(b => b.row < 2).length;
    for (const [i, b] of beams.entries()) {
      const up = b.row === 2, amt = up ? clamp((lights - 1.1) / 0.3) : Math.min(1, lights);
      let rz, rx = b.pitch, gain = 1;
      if (up) rz = 0.5 * Math.sin(sway * 2 + b.x);
      else if (style === 'pillars') {                               // 竖直光柱：不摇，亮度一支接一支跑过去
        rz = 0.02 * Math.sin(sway + i); rx = b.pitch * 0.25;
        const dd = Math.abs((((i - run2) % nMain) + nMain * 1.5) % nMain - nMain / 2); gain = 1.5 + 3.2 * Math.exp(-dd * dd / 1.4);   // 底亮度也抬高：远景里每根光柱都看得见，跑到的那几根更亮
      } else if (style === 'cross') {                               // 交叉：相邻两支一左一右，像剪刀一样开合
        rz = (i % 2 ? 1 : -1) * (0.3 + 0.28 * Math.sin(sway * 2 + b.row)); rx = b.pitch + 0.06 * Math.sin(sway + i);
      } else if (style === 'burst') {                               // 聚到 C 位 → 一小节里炸开成扇形；重拍那一下最亮
        const toC = -Math.atan2(b.x, b.piv.position.y - 1.0), open = b.x * 0.16;
        rz = lerp(toC, open, smooth(bar.phase * 1.5)); rx = b.pitch + 0.08 * Math.sin(sway + i); gain = 1 + 0.9 * downP;
      } else {                                                      // fan：扇形，慢慢摇
        rz = b.tilt + 0.16 * Math.sin(sway + i * 0.9) * Math.sign(b.x || 1); rx = b.pitch + 0.1 * Math.sin(sway * 0.5 + i);
      }
      b.piv.rotation.z = rz; b.piv.rotation.x = rx;
      const k = on * amt * gain * ((b.row === 1 ? 0.085 : 0.065) + 0.075 * beatP + 0.07 * downP * Math.max(0, lights - 0.5));
      _c.copy(CYC[(A + (b.row + (i % 2))) % 3]);
      b.cone.material.uniforms.c.value.copy(_c); b.cone.material.uniforms.k.value = k; b.cone.visible = k > 0.002;
      b.lens.material.color.copy(_c).multiplyScalar(on * amt * (1.6 + 2.2 * beatP) * Math.min(1.6, gain)); b.lens.visible = !up || amt > 0.01;
    }
    const sk = lerp(0.17 + 0.08 * kick, 0.34, blackout) * spot;
    spotBeam.cone.material.uniforms.k.value = sk; spotBeam.lens.material.color.set('#fff4d6').multiplyScalar(2.4 * spot);
    pool.material.uniforms.k.value = lerp(0.1, 0.3, blackout) * spot;
    // ---- 台面灯带（跑马）+ 背墙竖灯带
    const run = bt.i + bt.phase;
    for (const s of strips) { const w = 0.5 + 0.5 * Math.cos((run - s.k * 0.5) * Math.PI * 0.5); s.m.material.color.copy(CYC[(A + (s.k > 5 ? 1 : 0)) % 3]).multiplyScalar(on * Math.min(1.2, lights) * (0.1 + 0.5 * w * w + 0.3 * beatP)); }
    wallStrips.forEach((m, i) => m.material.color.copy(CYC[(A + 2) % 3]).multiplyScalar(on * Math.min(1.2, lights) * (0.5 + 1.8 * (((bt.i + i) % 4 + 4) % 4 === 0 ? beatP : 0.15))));
    // ---- 烟雾
    haze.forEach((s, i) => {
      s.position.set(((hash(i, 7) * 14 + T * (0.12 + 0.1 * hash(i, 8)) * (i % 2 ? 1 : -1)) % 14 + 14) % 14 - 7, 0.5 + 1.4 * hash(i, 9), -3.0 + 2.6 * hash(i, 10));
      s.material.color.copy(CYC[(A + i) % 3]).multiplyScalar(on * (0.035 + 0.02 * beatP) * Math.min(1.3, 0.4 + lights));
    });
    // ---- 荧光棒
    if (sticks) {
      for (let i = 0; i < sticks.n; i++) { const [x, y, z] = sticks.base[i], ph = (bt.i + bt.phase) * Math.PI + hash(i, 5) * 0.8; sticks.p.set([x + 0.1 * Math.sin(ph), y + 0.05 * Math.abs(Math.cos(ph)), z], i * 3); }
      sticks.m.geometry.attributes.position.needsUpdate = true; sticks.m.material.opacity = on * (0.55 + 0.35 * beatP) * Math.min(1, 0.3 + lights);
      sticks.m.visible = sticks.m.material.opacity > 0.01;
    }
    const strobe = lights > 1.1 ? 0.07 * (lights - 1) / 0.5 * downP * on : 0;
    return { scene, camera, led: C.led ?? 1, post: {
      bloom: { strength: lerp(0.75, 0.5, blackout), threshold: 1.2 }, chroma: (0.12 + 0.2 * kick * Math.min(1, lights)) * on + 0.06,
      grade: { vignette: lerp(0.3, 0.55, blackout) }, flash: { amount: strobe, color: '#ffffff' } } };
  }
  /** 一个引擎镜头：[t0, t1] 里按 plan 在拍上切机位。rest 里的参数（lights / blackout / dancers / formation…）是每个机位的默认值，可以写成 T => 值。 */
  function shot({ id = 'stage', t0, t1, plan = null, transitionIn = { kind: 'cut' }, ...rest }) {
    const sched = stageShots(mv, t0, t1, plan ?? (VARIANTS[rest.variant ?? variant] ?? VARIANTS.fan).plan);
    return { id, t0, t1, transitionIn, sched, build() { return {}; },
      update(_, T) { const { t0: _a, t1: _b, i, ...seg } = sched.at(Math.min(Math.max(T, t0), t1 - 1e-4)); const { scene: sc, camera: cm, post } = update(T, { ...rest, ...seg }); return { scene: sc, camera: cm, post }; } };
  }
  const api = { scene, camera, girl, crew: crewKit, led, lights: L, beams, update, shot, leadSeq, crewSeq, dancers, lines, variant };
  return api;
}
