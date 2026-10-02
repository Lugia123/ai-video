// 镜头调度 + 转场。镜头格式见 CONTRACT.md：{ id, t0, t1, build(ctx), update(state, t, ctx) → { scene, camera, post }, transitionIn }
//
// 时间一律是「歌曲时间」（和 lyrics.json / audio.json 同一轴）。某时刻 t 的当前镜头 = t0 ≤ t 的最后一个（按 t0 排序）。
// transitionIn = { kind, dur, ...参数 }，挂在「进来的」镜头上，窗口相对它的 t0：
//   cut                     —— 没有窗口
//   flash    [t0−dur/2, t0+dur/2]  t0 前是旧镜头、后是新镜头，白（color）在 t0 最亮，两侧指数衰减。{ color, peak=1 }
//   whip     [t0−dur/2, t0+dur/2]  甩镜：旧镜头加速甩出（dir=−1 向左，默认），t0 切换，新镜头从另一侧带着运动模糊减速进来。{ dir }
//   wipe     [t0−dur/2, t0+dur/2]  整屏色块从左往右擦过：前半色块盖住旧镜头，t0 全屏纯色，后半色块离开露出新镜头。{ color, slant }
//   dissolve-particles [t0, t0+dur] 旧镜头碎成方块粒子往上飘散，露出新镜头（这段时间两个镜头都在画）。
// 窗口里旧镜头继续按真实 t 调 update（可能超过它的 t1），所以 update 要能接受 t1 之后一点点的时间。
// 两个镜头同时要画时各自走完整后处理，再由 stage.composite 合成。
//
// build(ctx) 只在该镜头第一次被用到时调一次，结果缓存；ctx = { THREE, mv, kits, stage, shot, local, u }。

import * as THREE from 'three';

const CENTERED = new Set(['flash', 'whip', 'wipe']);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeIn = x => x * x * x;
const easeOut = x => 1 - Math.pow(1 - x, 3);

export function windowOf(tr) {
  if (!tr || tr.kind === 'cut' || !(tr.dur > 0)) return { pre: 0, post: 0 };
  if (CENTERED.has(tr.kind)) return { pre: tr.dur / 2, post: tr.dur / 2 };
  return { pre: 0, post: tr.dur };   // dissolve-particles
}

export function createDirector(shots, { mv, kits = {}, stage }) {
  const list = [...shots].sort((a, b) => a.t0 - b.t0);
  const states = new Map();
  const ctxOf = (shot, t) => ({ THREE, mv, kits, stage, shot, local: t - shot.t0, u: (t - shot.t0) / Math.max(1e-6, shot.t1 - shot.t0) });

  function frameOf(shot, t) {
    if (!states.has(shot)) states.set(shot, shot.build ? shot.build(ctxOf(shot, shot.t0)) : {});
    const out = shot.update(states.get(shot), t, ctxOf(shot, t));
    if (!out || !out.scene || !out.camera) throw new Error(`镜头 ${shot.id} 的 update 要返回 { scene, camera, post }`);
    return out;
  }
  const draw = (slot, shot, t) => { const f = frameOf(shot, t); stage.renderTo(slot, f.scene, f.camera, f.post || {}); };

  function indexAt(t) {
    let i = 0;
    for (let k = 0; k < list.length; k++) if (list[k].t0 <= t) i = k;
    return i;
  }

  /** 找 t 时刻落在哪个转场窗口里：{ tr, a: 旧镜头, b: 新镜头, p, x: t − b.t0 } | null */
  function transitionAt(t) {
    const i = indexAt(t);
    const cand = [];
    if (i + 1 < list.length) cand.push(i + 1);   // 下一个镜头的居中型转场可能已经开始
    cand.push(i);
    for (const j of cand) {
      if (j === 0) continue;
      const b = list[j], tr = b.transitionIn, w = windowOf(tr);
      if (t >= b.t0 - w.pre && t < b.t0 + w.post) return { tr, a: list[j - 1], b, p: (t - (b.t0 - w.pre)) / (w.pre + w.post), x: t - b.t0 };
    }
    return null;
  }

  function render(t) {
    stage.time = t;
    if (!list.length) return;
    const X = transitionAt(t);
    if (!X) { draw(0, list[indexAt(t)], t); stage.composite({ kind: 'none' }); return; }
    const { tr, a, b, p, x } = X;
    const cur = x < 0 ? a : b;
    const half = tr.dur / 2;
    switch (tr.kind) {
      case 'flash': {
        draw(0, cur, t);
        const f = (tr.peak ?? 1) * Math.exp(-Math.abs(x) / Math.max(1e-3, half * 0.35));
        stage.composite({ kind: 'none', flash: f, flashColor: tr.color ?? '#ffffff' });
        break;
      }
      case 'whip': {
        draw(0, cur, t);
        const dir = tr.dir ?? -1;
        // 旧镜头：位移从 0 加速到 0.5 屏；新镜头：从反向 0.5 屏减速到 0。模糊 ∝ 速度
        const q = x < 0 ? clamp(1 + x / half) : clamp(x / half);
        const shift = x < 0 ? -dir * 0.5 * easeIn(q) : dir * 0.5 * (1 - easeOut(q));
        const speed = x < 0 ? 3 * q * q : 3 * (1 - q) * (1 - q);
        stage.composite({ kind: 'whip', shift, blur: 0.18 * speed + 0.002 });
        break;
      }
      case 'wipe': {
        draw(0, cur, t);
        // 色块区间 [lo, hi]（按 x 坐标，slant 让边斜一点）：t0 前前沿 hi 从左扫到右盖住旧镜头；t0 后后沿 lo 扫过露出新镜头
        // 缓动用 1.6 次方（比三次方温和）：整屏纯色只在 t0 前后约 ±6% 的窗口里（dur 0.36 s ≈ 1–2 帧），不会一整格都是纯色
        const q = clamp(p), ein = x => Math.pow(clamp(x), 1.6), eout = x => 1 - Math.pow(1 - clamp(x), 1.6);
        const lo = x < 0 ? -1 : ein(q * 2 - 1) * 1.25 - 0.1;
        const hi = x < 0 ? eout(q * 2) * 1.25 - 0.1 : 2;
        stage.composite({ kind: 'wipe', wipeA: hi, wipeB: lo, wipeColor: tr.color ?? '#FF2E88', slant: tr.slant ?? 0.12 });
        break;
      }
      case 'dissolve-particles': {
        draw(0, a, t);
        draw(1, b, t);
        stage.composite({ kind: 'dissolve', p: clamp(p) * 1.05, seed: 7.3 });
        break;
      }
      default:
        draw(0, cur, t); stage.composite({ kind: 'none' });
    }
  }

  return { render, list, transitionAt, indexAt, frameOf };
}
