// 姿势：从脚本状态里选出当前姿势、切换前后的帧计数、整体挤压，以及切换手感（swapFx：手臂层绕肩的预备 / 拖影 / 回弹）。
// 由早先试验版的讲解员（host-pose）整理而来（2026-10-07）。
//   swapFx：'a' 直接换图，只有整体下压上弹
//           'b' 换图那一帧新手臂身后拖两份半透明副本 + 过冲 2.6° 再回弹
//           'c' b + 换图前 2 帧向反方向预备（1.5° → 3.2°）+ 换图后绕肩衰减回弹（约 5 帧）  ← 默认（2026-10-07 总管定的临时默认）
//           'd' 换图前缩一下、换图后绕肩伸缩弹出，不加拖影
//   都是绕肩头的刚性转动 / 缩放；方向由旧手、新手的肤色重心相对肩的夹角算；手没动的那一侧不处理；两手连在一层的姿势只用 40% 的量。
import { FPS } from './behavior.js';

// 旧脚本里的姿势名 → 现在的名字（只在这一层做，不进数据包）
export const ALIAS = { pointL: 'present', pointR: 'present', clasp: 'fist' };

/** poseInfo = 姿势库的 poses.json；st(t) = 脚本状态；img = { 'arms_名' | 'over_名': 图 }；shoulders = { L: [x, y], R: [x, y] }、midX：姿势图层像素。 */
export function createPoses({ poseInfo, st, img, shoulders, midX }) {
  const PIV = shoulders, MID = midX, HAND = {}, SIDES = {};
  {
    // 每个姿势每一层：左右两侧各有没有手（肤色像素）、手的重心、两侧是不是连在一起
    const c = document.createElement('canvas'), g = c.getContext('2d', { willReadFrequently: true });
    for (const n of Object.keys(poseInfo)) { HAND[n] = {}; for (const k of ['arms', 'over']) { const im = img[k + '_' + n]; if (!im) continue;
      c.width = im.width; c.height = im.height; g.clearRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
      const acc = { L: [0, 0, 0], R: [0, 0, 0] }; let midA = 0;
      for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) { const i = (y * c.width + x) * 4; if (d[i + 3] < 128) continue; if (Math.abs(x - MID) < 3) midA++;
        if (d[i] > d[i + 1] + 8 && d[i] > 175) { const a = acc[x < MID ? 'L' : 'R']; a[0] += x; a[1] += y; a[2]++; } }
      const has = { L: acc.L[2] > 80, R: acc.R[2] > 80 }; SIDES[k + '_' + n] = { ...has, joined: has.L && has.R && midA > 6 };
      for (const sd of ['L', 'R']) if (has[sd] && (k === 'over' || !HAND[n][sd])) HAND[n][sd] = [acc[sd][0] / acc[sd][2], acc[sd][1] / acc[sd][2]]; } }
  }
  // 一侧手臂在这次切换里的转角（度，绕肩；正 = 画布顺时针）：旧手 → 新手。手没动（< 6px）返回 0
  function swing(from, to, sd) {
    const a = HAND[from]?.[sd], b = HAND[to]?.[sd]; if (!a || !b || Math.hypot(a[0] - b[0], a[1] - b[1]) < 6) return 0;
    const [px, py] = PIV[sd]; let d = (Math.atan2(b[1] - py, b[0] - px) - Math.atan2(a[1] - py, a[0] - px)) * 180 / Math.PI; d = ((d + 540) % 360) - 180;
    return Math.abs(d) < 4 ? (b[1] < a[1] ? (sd === 'L' ? 4 : -4) : (sd === 'L' ? -4 : 4)) : d;          // 几乎沿手臂方向伸缩的：给一个小的名义方向（上抬 = 向外）
  }
  // 这一帧这一侧手臂要画的若干份：[{ ang 度, scale, alpha }]，最后一份是本体，前面的是拖影
  function armFx(sw, sd, mode) {
    const body = [{ ang: 0, scale: 1, alpha: 1 }], out = { cur: body }; if (mode === 'a') return out;
    if (sw.lead && sw.next !== sw.cur) {          // 换之前
      const d = swing(sw.cur, sw.next, sd); if (!d) return out; const dir = Math.sign(d);
      if (mode === 'c') out.cur = [{ ang: -dir * (sw.lead === 2 ? 1.5 : 3.2), scale: 1, alpha: 1 }];          // 预备：向反方向收一点
      if (mode === 'd' && sw.lead === 1) out.cur = [{ ang: 0, scale: 0.955, alpha: 1 }];          // 先缩一下
      return out;
    }
    if (sw.since > 7) return out;
    const d = swing(sw.prev, sw.cur, sd); if (!d) return out; const dir = Math.sign(d), mag = Math.min(Math.abs(d), 60), n = sw.since;
    if (mode === 'b' || mode === 'c') {
      const over = mode === 'b' ? [0, 2.6, -0.9, 0][n] ?? 0 : 3.2 * Math.exp(-n * 0.6) * Math.cos(n * 1.3) * (n < 6 ? 1 : 0);          // 过冲 / 回弹（度）
      out.cur = [{ ang: dir * over, scale: 1, alpha: 1 }];
      if (n === 0) { const g = Math.min(mag * 0.22, 9); out.cur = [{ ang: dir * (over - g * 2), scale: 1, alpha: 0.16 }, { ang: dir * (over - g), scale: 1, alpha: 0.3 }, ...out.cur]; }          // 换图那一帧：新手臂身后沿来路拖两份（旧手臂不画副本：会叠在裙子上显脏）
    } else if (mode === 'd') out.cur = [{ ang: 0, scale: [0.9, 1.05, 0.985, 1.004][n] ?? 1, alpha: 1 }];
    return out;
  }
  // 权重最大且 > 0.5、姿势库里有的那个生效，否则待机
  const poseName = t => { const w = st(t).pose || {}; let best = 'idle', bw = 0.5; for (const [k, v] of Object.entries(w)) { const n = ALIAS[k] || k; if (poseInfo[n] && v > bw) { bw = v; best = n; } } return best; };
  const frameT = t => Math.round(t * FPS) / FPS;
  // 切换：离最近一次换姿势过了几帧（往回最多看 8 帧）；接下来两帧内是否要换（预备帧）
  function swapState(t) {
    const t0 = frameT(t), cur = poseName(t0); let since = 99, prev = cur;
    for (let i = 1; i <= 8; i++) { const q = poseName(t0 - i / FPS); if (q !== cur) { since = i - 1; prev = q; break; } }
    const n1 = poseName(t0 + 1 / FPS), n2 = poseName(t0 + 2 / FPS);
    return { cur, since, prev, pre: n1 !== cur, next: n1 !== cur ? n1 : n2 !== cur ? n2 : cur, lead: n1 !== cur ? 1 : n2 !== cur ? 2 : 0 };          // lead：还有几帧换（1 = 下一帧就换）
  }
  // 整体挤压 [横, 竖]：预备帧下压；换图那帧上弹约 2%，之后 3 帧落定
  function squash(sw) { if (sw.pre) return [1.012, 0.98]; if (sw.since < 4) { const k = Math.exp(-sw.since * 0.9) * Math.cos(sw.since * 1.1); return [1 - 0.011 * k, 1 + 0.02 * k]; } return [1, 1]; }
  return { poseName, swapState, squash, armFx, SIDES, PIV, MID };
}
