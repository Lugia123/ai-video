// 给片段式讲解员（./index.js）接上漫符 / 表情预设（../emotes/chibi-emotes.js）。用法和 ../host/emotes.js 一样：
//   const drawHost = attachEmotes(host, script, { W, H, dpr });   每帧调 drawHost(t) 代替 host.draw(t)。
// 导演脚本在 state 里写 emote: { name, t0, t1 }（这段时间里摆这个预设）。
//
// 片段式角色上能出什么：
//   · 头周围的符号（top 层：问号、感叹号、汗滴、灯泡、爱心…；back 层：集中线）—— 能出。挂点是片段库 points.json 里每张静帧的点。
//   · 贴脸的符号（face 层：脸红、黑线）—— 只在静帧上出，而且只留在皮肤上（讲解员按这张静帧的肤色遮罩裁掉头发、帽子、眼睛上的部分）。
//   · 脸 —— 漫符不带脸。换脸用 state.face（同画风的「表情脸」贴片，片段库每张静帧的 patches.face.<表情名>）；漫符库里矢量画的替换眼 / 嘴 / 眉不用
//     （用户嫌和原画风格差异大）。正在说话时表情脸的嘴让位给说话口型；表情脸优先于眨眼。预设建议的头姿态和动作不用：头不能单独动，动作听脚本的。
//   · 贴脸的符号（脸红、黑线的阴影）叠在当前的脸上——不管是原画的脸还是表情脸——在刘海之下；黑线的竖线在最上面。
// 片段播放中（人在动）：
//   · top / back 的符号继续出，跟着头走——挂点 = 首姿的点 + 片段里量好的头的逐帧位移，所以一个漫符可以从归位一直挂到动作保持，不会跳。
//   · 贴脸的符号和表情脸都不出（贴片只有静帧有，脸也可能被手挡）：进片段前收掉、露回片段里画好的脸，停住后再换上。
import { EMOTES, emotePreset, drawPreset, mixPreset, anchorsFromHost, inLayer } from '../emotes/chibi-emotes.js';

const FADE = 0.22, FADE_OUT = 0.5;          // 弹出 0.22 秒；收起 0.5 秒（原来也是 0.22，用户嫌「一闪就没」，2026-10-08 放慢）
// 漫符（符号）和表情脸是两个互相独立的通道（2026-10-08 用户定：「漫符可以是独立漫符，不要和表情绑定，这样组合更多」）：
//   state.emote = { name, t0, t1 }  只出符号，不换脸；state.face = '<表情名>'  只换脸。要组合就两个都写。
//   常用组合是角色数据里一份可选的快捷写法（片段库 points.json 的 emote.combos = { 名: { emote, face, zh } }，可改可删）：
//   state.combo = { name, t0, t1 } 展开成那一对；脚本同时写了 emote / face 的，各听脚本的。
// 脸红符号和表情脸：表情脸大多自带一层很淡的腮红，点了「脸红」要看得见明显的红，所以照样叠（画在表情脸贴片之上、刘海之下）；
// 只有自带浓腮红的表情不再叠（角色数据 points.json 的 emote.heavyBlush 可改）。
const HEAVY_BLUSH = ['love'];
// 漫符停多久（秒，含弹出和收起）。导演脚本自己写 t0 / t1，这里是建议值和演示页的默认：状态型的（脸红、黑线、汗滴——表示「一直处在这个状态」）要停得住，
// 按本仓「关键信息停留 ≥ 2 秒」取 4 秒；一下子的反应（问号、感叹号、灯泡…）3 秒。emoteSpan(name, t0) 按这张表给出 { name, t0, t1 }。
export const EMOTE_STAY = { default: 3, blush: 4, gloom: 4, sweat: 4 };
export const emoteSpan = (name, t0, seconds) => ({ name, t0, t1: t0 + (seconds ?? EMOTE_STAY[name] ?? EMOTE_STAY.default) });

export function attachEmotes(host, userScript, { W, H, dpr = 1 }) {
  const TL = host.topLayer, tl = TL.getContext('2d'), BL = host.backLayer, bl = BL.getContext('2d'), FL = host.faceLayer, fl = FL.getContext('2d');
  const cache = new Map();
  const EO = host.points?.emote || {};          // 这个角色漫符的选项（片段库 points.json 的 emote）：side / sides（出在哪一侧）、combos（常用组合）、heavyBlush
  // 常用组合展开：combo: { name, t0, t1 } → emote + face（脚本自己写了的不动）
  const script = t => {
    const s = userScript(t) || {}, c = s.combo; if (!c || t < c.t0 || t >= c.t1) return s;
    const def = (EO.combos || {})[c.name]; if (!def) throw new Error(`没有叫「${c.name}」的常用组合（这个角色有：${Object.keys(EO.combos || {}).join('、') || '无'}；在片段库 points.manual.json 的 emote.combos 里加）`);
    return { ...s, ...(s.emote == null && def.emote ? { emote: { name: def.emote, t0: c.t0, t1: c.t1 } } : {}), ...(s.face == null && def.face ? { face: def.face } : {}) };
  };
  const preset = name => {
    if (!cache.has(name)) {
      const q = emotePreset(name);
      // 这个角色对个别符号单独定的侧（points.json 的 emote.sides）：有的符号在漫符库里本来就画在另一侧，跟着整体换侧反而撞上配饰
      const symbols = (q.symbols || []).map(sy => { const [n, o] = Array.isArray(sy) ? sy : [sy, {}]; return EO.sides?.[n] != null ? [n, { ...o, side: EO.sides[n] }] : sy; });
      // 只要符号：预设里配套的矢量眼 / 眉 / 嘴一律不画，脸由 state.face 另管
      const sym = { ...q, symbols, eyes: null, brows: null, mouth: null };
      cache.set(name, { sym, noBlush: { ...sym, symbols: symbols.filter(sy => (Array.isArray(sy) ? sy[0] : sy) !== 'blush') } });
    }
    return cache.get(name);
  };
  // 这一刻的漫符和动画相位 p
  function at(t) {
    const s = script(t), e = s.emote;
    if (!e || t < e.t0 || t >= e.t1) return { s, q: null, p: 0, w: 0 };
    const q = preset(e.name), lt = t - e.t0, len = e.t1 - e.t0;
    const out = Math.min(FADE_OUT, len / 2), m = lt < FADE ? mixPreset(null, q, 0.5 + 0.5 * lt / FADE) : lt > len - out ? mixPreset(q, null, 0.5 * (lt - (len - out)) / out) : { p: 0.5, w: 1 };
    return { s, q, p: m.p, w: m.w, name: e.name };
  }
  // 贴脸符号的相位：人一动就收、停住再弹。离最近的「在动」时间段的边界不到 FADE 秒时按距离收放。
  // 人在动、而且那一帧脸上贴不了东西（没有逐帧头部跟踪，或头转走了）时收掉，停住再弹；可贴的帧照出（讲解员按那一帧的权重淡入淡出）。
  function faceP(t, p) {
    if (host.pasteAt(t) <= 0) return 0;
    let k = 1;
    for (const m of host.moves()) { const d = t < m.t0 ? m.t0 - t : t >= m.t1 ? t - m.t1 : -1; if (d >= 0 && d < FADE && host.pasteAt(t < m.t0 ? m.t0 + 1e-3 : m.t1 - 1e-3) <= 0) k = Math.min(k, d / FADE); }
    return k >= 1 ? p : Math.min(p, 0.18 * k);          // 0–0.18 是漫符自己「弹出来」的那一段，拿它当收放
  }
  host.direct(script);
  function draw(t) {
    const { s, q: Q, p } = at(t), live = Q && p > 0 && p < 1, v = live ? host.viewAt(t) : null;
    // 脸红叠在当前的脸上；只有自带浓腮红的表情脸（love）上不再叠
    const heavy = !!(v && v.face) && (EO.heavyBlush || HEAVY_BLUSH).includes(v.face), q = live ? (heavy ? Q.noBlush : Q.sym) : null;
    const has = layer => live && (q.symbols || []).some(sy => inLayer(Array.isArray(sy) ? sy[0] : sy, layer));
    host.topLayerEmpty = host.backLayerEmpty = host.faceLayerEmpty = true;
    if (live) {
      const a = host.anchorsAt(t);
      if (a.pt.eyeL) {
        const A = anchorsFromHost(a), x = s.x ?? W / 2;
        // 符号不许跑出讲解员自己那一块（别压到舞台内容上）
        const o = { side: EO.side ?? 1, boundsFade: true, bounds: { x: Math.max(0, x - 330), y: 0, w: Math.min(W, x + 330) - Math.max(0, x - 330), h: H } };
        for (const [g, key] of [[tl, 'top'], [bl, 'back']]) if (has(key)) {
          g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.globalAlpha = 1;
          drawPreset(g, q, A, p, t, { ...o, layer: key }); host[key + 'LayerEmpty'] = false;
        }
        const fp = has('face') ? faceP(t, p) : 0;
        if (fp > 0) { fl.setTransform(dpr, 0, 0, dpr, 0, 0); fl.clearRect(0, 0, W, H); fl.globalAlpha = 1; drawPreset(fl, q, A, fp, t, { side: EO.side ?? 1, layer: 'face' }); host.faceLayerEmpty = false; }
      }
    }
    host.draw(t);
  }
  draw.at = at; draw.combos = EO.combos || {};
  return draw;
}
