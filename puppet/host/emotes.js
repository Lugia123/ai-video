// 给讲解员（host-pose 接口：faceLayer / topLayer / backLayer / anchors）接上表情预设（../emotes/chibi-emotes.js）。
// 导演脚本在 state 里写 emote: { name, t0, t1 }（这段时间里摆这个预设），这里负责：
//   · 把预设要讲解员配合的状态（藏哪些原部件、原画眼睛怎么变、头怎么摆）并进 state——姿势仍由脚本自己定，不用预设里建议的；
//   · 每帧把贴脸的画到脸层、符号画到最上层 / 背后层（要先画一遍拿到这一帧的挂点，再画第二遍）。
// 用法：const drawHost = attachEmotes(host, script, { W, H, dpr });  每帧调 drawHost(t) 代替 host.draw(t)。
import { EMOTES, emotePreset, presetHost, drawPreset, mixPreset, anchorsFromHost, inLayer } from '../emotes/chibi-emotes.js';

const FADE = 0.22;
export function attachEmotes(host, script, { W, H, dpr = 1 }) {
  const FL = host.faceLayer, fl = FL.getContext('2d'), TL = host.topLayer, tl = TL.getContext('2d'), BL = host.backLayer, bl = BL.getContext('2d');
  // 贴脸层的静态锚点：按 face 矩形 [609, 463, …] 量的，透视交给头（这几个数是这个角色特有的，待改成读数据包的挂点）
  const FO = [609 - FL.rect[0], 463 - FL.rect[1]], fp = (x, y) => ({ x: x + FO[0], y: y + FO[1] });
  const FA = { head: fp(469, 597), eyeL: fp(274, 605), eyeR: fp(654, 603), mouth: fp(461, 756), cheekL: fp(211, 727), cheekR: fp(721, 727), brow: fp(469, 420), top: fp(469, 0) };
  const cache = new Map();
  const preset = (name, pose) => { const key = name + '|' + pose; if (!cache.has(key)) { const q = emotePreset(name); if (host.poseInfo?.[pose]?.hideMouth) q.mouth = null; cache.set(key, q); } return cache.get(key); };
  // 这一刻的预设、漫符的动画相位 p、脸的强度 w
  function at(t) {
    const s = script(t) || {}, e = s.emote;
    if (!e || t < e.t0 || t >= e.t1) return { s, q: null, p: 0, w: 0 };
    const pose = Object.entries(s.pose || {}).sort((a, b) => b[1] - a[1]).find(([, v]) => v > 0.5)?.[0];
    const q = preset(e.name, pose), lt = t - e.t0, len = e.t1 - e.t0;
    const m = lt < FADE ? mixPreset(null, q, 0.5 + 0.5 * lt / FADE) : lt > len - FADE ? mixPreset(q, null, 0.5 * (lt - (len - FADE)) / FADE) : { p: 0.5, w: 1 };
    return { s, q, p: m.p, w: m.w };
  }
  host.direct(t => {
    const { s, q, w } = at(t);
    if (!q) return s;
    const ps = presetHost(q, w, { rig: true }); delete ps.pose;                    // 姿势听脚本的
    return { ...s, ...ps, tilt: (s.tilt || 0) + (ps.tilt || 0), nod: (s.nod || 0) + (ps.nod || 0), lean: (s.lean || 0) + (ps.lean || 0), expr: w > 0.5 ? ps.expr : s.expr };
  });
  return function draw(t) {
    const { s, q, p } = at(t), live = q && p > 0 && p < 1, has = layer => live && (q.symbols || []).some(sy => inLayer(Array.isArray(sy) ? sy[0] : sy, layer));
    fl.setTransform(FL.scale, 0, 0, FL.scale, 0, 0); fl.clearRect(0, 0, FL.rect[2], FL.rect[3]); fl.globalAlpha = 1;
    if (live) drawPreset(fl, q, FA, p, t, { layer: 'face', rig: true });
    host.faceLayerEmpty = !live; host.faceLayerDirty = true; host.topLayerEmpty = true; host.backLayerEmpty = true;
    host.draw(t);
    if (!has('top') && !has('back')) return;
    // 符号不许跑出讲解员自己那一块（别压到舞台内容上）
    const x = s.x ?? W / 2, o = { boundsFade: true, bounds: { x: Math.max(0, x - 330), y: 0, w: Math.min(W, x + 330) - Math.max(0, x - 330), h: H } };
    const A = anchorsFromHost(host.anchors());
    for (const [g, key] of [[tl, 'top'], [bl, 'back']]) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.globalAlpha = 1;
      if (has(key)) { drawPreset(g, q, A, p, t, { ...o, layer: key }); host[key + 'LayerEmpty'] = false; }
    }
    host.draw(t);
  };
}
