// world / vfx 画廊的公共串场：一段一个效果，用 engine 的 mount（函数形式）和 stage.render 出画。
//   await mountGallery([{ name, dur, build(mv) → state, update(state, lt, u, mv) → { scene, camera, post } }])
// window.__video.chapters = [{ id, name, t0, dur, sheet:[3 个时刻] }]（contact sheet 用）。
import { loadMV } from '../../engine/index.js';

export async function mountGallery(segments) {
  const mv = await loadMV();
  let acc = 0;
  const table = segments.map(s => { const r = { ...s, t0: acc }; acc += s.dur; return r; });
  for (const s of table) s.state = await s.build(mv);
  const label = document.createElement('div');
  label.style.cssText = 'position:fixed;left:28px;top:22px;font:600 22px/1.2 ui-monospace,Menlo,monospace;color:#F2EDE4;opacity:.7;letter-spacing:.06em;pointer-events:none;z-index:2';
  document.body.appendChild(label);
  const draw = T => {
    let seg = table[table.length - 1];
    for (const s of table) if (T < s.t0 + s.dur) { seg = s; break; }
    const lt = Math.min(seg.dur, Math.max(0, T - seg.t0));
    const out = seg.update(seg.state, lt, lt / seg.dur, mv);
    mv.stage.render(out.scene, out.camera, out.post ?? {});
    label.textContent = `${String(table.indexOf(seg) + 1).padStart(2, '0')}  ${seg.name}`;
  };
  const video = mv.mount(draw, { duration: acc - 1e-3, offset: 0 });
  video.chapters = table.map((s, i) => ({ id: `${String(i + 1).padStart(2, '0')}-${s.name}`, name: s.name, t0: s.t0, dur: s.dur,
    sheet: [0.2, 0.55, 0.9].map(f => +(s.t0 + s.dur * f).toFixed(3)) }));
  return { mv, video };
}
