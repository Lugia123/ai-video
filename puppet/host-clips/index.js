// 片段式讲解员：整个人是预先做好的透明序列帧（归位帧 ⇄ 动作保持帧，中间播片段），接口形状照着 ../host/index.js 的 createHost。
//   const host = await createClipHost({ mount, timings, W, H, ground, size, dpr, pack });
//   host.direct(t => state); host.draw(t); host.bbox(); host.anchors(); host.pose()
// pack = 角色数据包目录的 URL；片段库默认在 pack + 'clips/'（clips.json、points.json、frames/、patches/），也可以用 clips 参数另指。
//
// 导演脚本的写法和 createHost 一样：state.pose = { think: 1 } 表示「这段时间做 think 这个动作」。
//   片段式的含义：pose 开始的那一刻起播去程片段，播完停在保持帧；pose 结束的那一刻起播回程片段，回到归位帧。
//   所以一个动作占的时间 = [pose 开始, pose 结束 + 回程时长)，其中开头的「去程时长」和结尾的「回程时长」人在动。
//   一次性动作（片段从归位到归位，一段做完去和回，比如挥手、转一圈）：pose 开始那一刻起整段播完、直接回到归位，pose 那段写多长不管。
//   同一个动作既有一次性的、又有带停顿帧的（片段库里 <名> 和 <名>_hold）：脚本只写 <名>——pose 那段 ≥ 去程 + 0.3 秒就用带停顿帧的那一种
//   （去程 → 停在停顿帧 → pose 结束时回程），不够长就一次播完。要强制：pose 写 <名>_hold，或 state.move.oneshot = true / false。
//   也可以不写 pose，直接给时间表：host.act([{ action: 'think', t0, t1, in?, out?, ease?, speed?, trimmed?, skipDupes? }])（t0 起播去程，t1 起播回程）。
// 动作占多少秒由脚本定，不由片段定：act() 里写 in / out（秒），或者在 pose 开始那一刻的 state 里写 move: { in, out, ease }；
//   都不写时讲解员自己算（fit.mode = 'auto'）：目标是每段 0.8 秒（片段库的 moveSeconds / fit.target；用户 2026-10-08 看过各档后定的），
//   并且要在下一句开口前 0.3 秒做完——空够就按 0.8 秒播，不够就缩（缩到 0.5 秒以下会提醒把停顿加到多少）；
//   空连片段的最短可接受时长（片段数据里的 minSeconds）都放不下 → 报错，或者 fit.short = 'cut' 改成硬切 + 压扁回弹。
// state 里认的：x、scale、hop、lean、flip、visible、talk、blink、pose、emote（见 emotes.js）、face（表情名：静帧上贴同画风的表情脸，库里每张静帧的 patches.face 有的才行）、brow（true = 表情连眉一起换，试验；默认不换眉）、clean（静帧上先贴干净脸）。
// 不认的（整个人是画死的帧，头不能单独动）：look、attend、headYaw、nod、tilt、expr、对象写法的 face、eyes / mouth / brows。脚本里写了会在 check() 里提醒一次。
//
// 画面是 t 的纯函数：时间表（脚本的 pose 扫一遍得到，或 act() 给的）编成 ClipPlayer.timeline，任何 t 直接算出画哪段的第几帧；没有运行时累积的状态。
//
// 硬约束（check() 查，strict 时违反就抛错，不悄悄错位）：
//   · 人在动的时间段不许和任何一句旁白重叠——除非那段片段全程有逐帧头部跟踪且可贴（clips.json 的 headTracks，w > 0）：那样口型和表情能钉在动着的脸上，
//     允许边动边说（仍然建议把动作放在停顿里，自动排时长照旧按停顿排）。转圈这类头转走了的片段不可贴，仍然不许。
//   · 保持时间不能是负的（pose 段比去程片段还短）；两个动作不能叠（上一个还没归位下一个就开始）。
//   · 片段库里没有的动作名。
// 提醒（不抛错）：漫符预设里的替换眼 / 嘴 / 眉画不了（原画的五官藏不掉）；贴脸的漫符在片段播放中不出；脚本用了不认的字段。
//
// 层序（从下到上）：backLayer → 人（片段帧 + 眨眼 / 口型贴片）→ faceLayer（只留在这张静帧的肤色上，头发帽子盖不到）→ topLayer。
//   三个层都是 W·dpr × H·dpr、和画面同坐标的 2D canvas；没东西时把 xxxLayerEmpty 置 true。和 createHost 不同：faceLayer 是屏幕坐标，topLayer 不挖手。
import '../clips/player.js';                       // 普通脚本，挂 window.ClipPlayer
import { speechTrack } from '../host/behavior.js';

const FPS = 30, ClipPlayer = window.ClipPlayer;
const IGNORED = ['look', 'attend', 'headYaw', 'nod', 'tilt', 'expr', 'eyes', 'mouth', 'brows'];
const fmt = t => t.toFixed(2);

export async function createClipHost({ mount, timings, W = 1920, H = 1080, ground = 900, size = 760, dpr = 1, pack, clips, strict = true, blink = true,
  play = {}, duration, guard = {}, fit = {}, smileFaces }) {
  if (!pack && !clips) throw new Error('createClipHost 要给 pack（角色数据包目录的 URL）或 clips（片段库目录的 URL）');
  const BASE_URL = clips ? (clips.endsWith('/') ? clips : clips + '/') : (pack.endsWith('/') ? pack : pack + '/') + 'clips/';
  const lib = await ClipPlayer.loadLibrary(BASE_URL), images = await ClipPlayer.preload(lib, BASE_URL);
  // 挂点（漫符用）。没有 points.json 也能播动作，只是漫符和贴脸层出不了——check() 里会提醒
  const pr = await fetch(BASE_URL + 'points.json'), PTS = pr.ok ? await pr.json() : { poses: {}, clips: {} }, NO_POINTS = !pr.ok;
  const PLAY = { trimmed: true, skipDupes: false, speed: 1, ...play };          // 片段怎么播（同 ClipPlayer 的选项）；每个动作可以在 act() 里单独盖
  // 动作占多少秒：mode 'auto' = 脚本没写时长时，按「这一刻到下一句开口」之间的空自动定（新姿势先停住 settle 秒下一句才开口；空够就用自然时长，不够就跳帧缩短）；
  //   'natural' = 一律自然时长。short = 空连最短可接受时长都放不下时：'error' 报错 | 'cut' 改成硬切 + 压扁回弹。ease 见 ClipPlayer.EASE。
  const FIT = { mode: 'auto', settle: 0.3, short: 'error', ease: undefined, target: lib.moveSeconds ?? 0.8, warnBelow: 0.5, holdMin: 0.3, ...fit };          // target：去程 / 回程各自的默认目标时长（片段库的 moveSeconds，缺省 0.8 秒；片段自己的 moveSeconds、脚本写的时长优先）
  const GUARD = { after: 0, before: 0, ...guard };                             // 动作离上一句结束 / 下一句开始至少多少秒（0 = 只要不重叠）

  const canvas = document.createElement('canvas'); canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none`;
  mount.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const pc = document.createElement('canvas'), player = new ClipPlayer(lib, images, pc, { talk: false, blink: false }), pg = pc.getContext('2d');
  const mk = () => Object.assign(document.createElement('canvas'), { width: canvas.width, height: canvas.height });
  const topLayer = mk(), backLayer = mk(), faceLayer = mk(), scratch = mk(), sctx = scratch.getContext('2d');

  const REST = lib.poses[lib.rest], CHAR_H = REST.bbox[3] - REST.bbox[1], AX = lib.anchor.x, AY = lib.anchor.y;
  if (size === 'native') size = CHAR_H;          // size: 'native' = 人物按片段的原像素画（1:1，审看抠图和接缝时用）
  // 两种动作：去程 → 保持 → 回程（有 pose 和 out）；一次性（只有 in，片段从归位到归位，播完即归位）。
  // 片段库里某个动作写了 host: false = 讲解员不用它（比如停顿帧的贴片烘不干净的那种）。
  // 同一个动作两种都有时（<名> 是一次性、<名>_hold 是带停顿帧的）：脚本只写 <名>，讲解员按 pose 那段有多长来选——见 compile。
  const ONE = a => !a.pose && !a.out, ACTIONS = Object.fromEntries(lib.actions.filter(a => !a.standalone && a.host !== false && ((a.pose && a.out) || (ONE(a) && lib.clips[a.in]?.from === lib.clips[a.in]?.to && !lib.clips[a.in]?.opaque))).map(a => [a.id, a]));
  const moveTarget = clip => clip.moveSeconds ?? (clip.from === clip.to ? 2 : 1) * FIT.target;          // 这段片段的默认目标时长：单程 0.8 秒，一段做完去和回的 1.6 秒，片段自己写了就用它的
  const breath = t => 1 + lib.breath.amp * Math.sin(2 * Math.PI * t / lib.breath.period);

  // 每张静帧的肤色遮罩（贴脸层只留在皮肤上：头发、帽子、眼睛盖不到）。加载时算一次，只看头那一块。
  // SKIN_CLEAN：先贴上「干净脸」贴片（擦掉眼、眉、嘴的那张）再算——整张脸（含眼睛、嘴的位置）都算皮肤，贴脸层优先用它。
  const SKIN = {}, SKIN_CLEAN = {};
  for (const [name, pose] of Object.entries(lib.poses)) for (const clean of [false, true]) {
    const P = PTS.poses[name]?.points, cp = pose.patches?.clean; if (!P || (clean && !cp)) continue;
    const c = document.createElement('canvas'); c.width = lib.canvas.w; c.height = lib.canvas.h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(images[pose.frame], 0, 0); if (clean) g.drawImage(images[cp.file], cp.rect[0], cp.rect[1]);
    const x0 = Math.floor(P.templeL[0] - 20), x1 = Math.ceil(P.templeR[0] + 20), y0 = Math.floor(P.forehead[1] - 60), y1 = Math.ceil(P.chin[1] + 20);
    const id = g.getImageData(x0, y0, x1 - x0, y1 - y0), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const r = d[i], gg = d[i + 1], b = d[i + 2], skin = d[i + 3] > 200 && r > 215 && gg > 170 && r - b > 18 && r - b < 80 && r >= gg && gg >= b - 2; d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = skin ? 255 : 0; }
    g.clearRect(0, 0, c.width, c.height); g.putImageData(id, x0, y0); (clean ? SKIN_CLEAN : SKIN)[name] = c;
  }

  let script = () => ({}), acts = null, compiled = null, sentences = [], speech = null;
  const st = t => script(t) || {};
  function retime(tm) { sentences = (tm?.segments || []).flatMap(s => s.sentences || [s]).filter(s => s.end > s.start); speech = speechTrack(sentences); compiled = null; if (tm?.duration > 0) self.duration = tm.duration; }

  // 脚本的 pose 扫一遍（每 1/30 秒一格）→ [{ action, t0, t1 }]；顺手记下用到的漫符和不认的字段
  function scan() {
    const D = self.duration || 0, out = [], emotes = new Map(), ignored = new Set(), unknown = new Set(); let cur = null;
    const poseAt = t => { let best = null, bw = 0.5; for (const [k, v] of Object.entries(st(t).pose || {})) { if (k === lib.rest || k === 'idle') continue; if (v > bw) { bw = v; best = k; } } return best; };
    // 两格之间姿势变了：二分找到变的那一刻（脚本常把动作起点写成「这句说完的时刻」，不在 1/30 秒的格子上；差一格就可能把刚好够的停顿算成不够）
    const edge = (a, b, was) => { for (let k = 0; k < 20; k++) { const m = (a + b) / 2; if (poseAt(m) === was) a = m; else b = m; } return Math.round(b * 1e4) / 1e4; };
    let prev = null;
    for (let i = 0; i <= Math.ceil(D * FPS); i++) {
      const t = i / FPS, s = st(t); let best = poseAt(t);
      if (best && !ACTIONS[best]) { unknown.add(best); best = null; }
      const tc = i && best !== prev ? edge((i - 1) / FPS, t, poseAt((i - 1) / FPS)) : t; prev = best;
      if (cur && cur.action !== best) { cur.t1 = tc; out.push(cur); cur = null; }
      if (best && !cur) cur = { action: best.endsWith('_hold') && ACTIONS[best.slice(0, -5)] ? best.slice(0, -5) : best, t0: tc, ...(best.endsWith('_hold') && ACTIONS[best.slice(0, -5)] ? { oneshot: false } : {}), ...(st(tc).move || s.move || {}) };          // 脚本直接写 <名>_hold = 指定要停顿帧那一种          // state.move = { in, out, ease }：这个动作的去程 / 回程各占多少秒（在 pose 开始那一刻读）
      if (s.emote && !emotes.has(s.emote.name + '@' + s.emote.t0)) emotes.set(s.emote.name + '@' + s.emote.t0, s.emote);
      for (const k of IGNORED) if (s[k] != null) ignored.add(k);
      if (s.face != null && typeof s.face !== 'string') ignored.add('face（对象写法）');          // 这里的 face 是表情名（字符串）；拆件讲解员那种逐项覆盖五官的对象不认
    }
    if (cur) { cur.t1 = D; cur.open = true; out.push(cur); }
    return { acts: out, emotes: [...emotes.values()], ignored: [...ignored], unknown: [...unknown] };
  }

  // 时间表 → ClipPlayer.timeline（纯函数时间线）+ 问题清单
  function compile() {
    if (compiled) return compiled;
    const sc = scan(), list = (acts || sc.acts).slice().sort((a, b) => a.t0 - b.t0), problems = [], steps = [], moves = [];
    const err = (t, msg) => problems.push({ level: 'error', t, msg }), warn = (t, msg) => problems.push({ level: 'warn', t, msg });
    for (const n of sc.unknown) err(0, `脚本里的姿势「${n}」片段库里没有（可用的动作：${Object.keys(ACTIONS).join('、') || '无'}）`);
    let cursor = 0;
    const pasteable = clipName => !!lib.headTracks && lib.clips[clipName].facePaste !== false && lib.clips[clipName].frames.every(f => lib.headTracks[f]?.w > 0);          // 这段片段是不是全程可贴
    const nextSay = t => sentences.find(q => q.start >= t - 1e-6);          // t 之后第一句开口的时刻（t 落在一句话中间时不算那一句：那是重叠，后面会报）
    for (const [ai, a] of list.entries()) {
      const A = ACTIONS[a.action]; if (!A) { err(a.t0, `时间表里的动作「${a.action}」片段库里没有`); continue; }
      const o = { ...PLAY, ...(a.speed != null ? { speed: a.speed } : {}), ...(a.trimmed != null ? { trimmed: a.trimmed } : {}), ...(a.skipDupes != null ? { skipDupes: a.skipDupes } : {}), ease: a.ease ?? FIT.ease, short: FIT.short };
      // 这一段（去程 / 回程）占多少秒：脚本写了就用脚本的；没写且 auto → min(自然时长, 到下一句开口前 settle 秒为止的空)
      const span = (kind, clipName, given, from, limit, probe) => {          // probe = true：只问「会占多少秒」，不报错不提醒
        const clip = lib.clips[clipName], nat = ClipPlayer.naturalSeconds(clip, o), min = ClipPlayer.minSeconds(clip); let d = given ?? nat, why = given != null ? '脚本定的' : '自然时长';
        if (given == null && FIT.mode === 'auto') {
          // 目标时长：片段自己的 moveSeconds，否则库 / 讲解员的默认（0.8 秒）；片段本身比它还短就不拉长。空够就用目标时长，不够才缩。
          const want = Math.min(moveTarget(clip), nat), q = nextSay(from), toSay = q ? q.start - FIT.settle - from : Infinity, room = Math.min(toSay, limit - from);
          d = want; why = '默认目标时长';
          if (room < want) {
            d = room; why = toSay <= limit - from ? `到下一句开口（${fmt(q.start)}s）前 ${FIT.settle}s 为止的空` : '到下一个动作开始为止的空';
            if (!probe && d >= min - 1e-3 && d < FIT.warnBelow * (clip.from === clip.to ? 2 : 1) - 1e-3 && toSay <= limit - from) warn(from, `动作「${a.action}」的${kind}被停顿压到 ${fmt(d)}s（目标 ${fmt(want)}s）：${fmt(from)}s 这里到下一句开口只有 ${fmt(q.start - from)}s，把这个停顿加到 ${fmt(want + FIT.settle)}s 就能按 ${fmt(want)}s 播`);
          }
        }
        if (probe) return Math.max(d, min);
        // 停顿里放不下、但这段片段全程可贴（有逐帧头部跟踪）：不报错，按目标时长播，和下一句叠着——边动边说
        if (d < min - 1e-3 && given == null && pasteable(clipName)) { const want = Math.min(moveTarget(clip), nat, limit - from); if (want >= min - 1e-3) return { d: want, cut: false, nat, min, overlap: true }; }
        if (d < min - 1e-3) {
          if (FIT.short === 'cut' && d > 0.1 && clip.from !== clip.to) return { d, cut: true, nat, min };
          err(from, `动作「${a.action}」的${kind}从 ${fmt(from)}s 起只有 ${fmt(Math.max(0, d))}s（${why}），放不下这段片段的最短可接受时长 ${fmt(min)}s：把这里的停顿加到 ${fmt(min + (given == null ? FIT.settle : 0))}s 以上，或者把动作挪到更宽的空里` + (FIT.short !== 'cut' ? '，或者开 fit.short = \'cut\'（硬切 + 压扁回弹）' : ''));
          d = min;
        }
        return { d: Math.max(d, min), cut: false, nat, min };
      };
      const nextAct = list[ai + 1]?.t0 ?? Infinity;
      // 脚本写的是一次性动作的名字：pose 那段够长（≥ 去程 + holdMin 秒）而且库里有带停顿帧的那一种（<名>_hold），就改用它——去程、停在停顿帧、pose 结束时回程；
      //   否则整段一次播完（pose 那段多长不管，从 pose 开始那一刻起播）。脚本可以用 oneshot: true / false 直接指定（act() 的条目里，或 state.move.oneshot）。
      let A2 = A;
      if (ONE(A)) {
        const H = ACTIONS[a.action + '_hold'];
        if (H && a.oneshot !== true) { const probe = span.call(null, '去程', H.in, a.in, a.t0, Infinity, true); if (a.oneshot === false || a.t1 - a.t0 >= probe + FIT.holdMin - 1e-3) A2 = H; }
        if (a.oneshot === false && !H) err(a.t0, `动作「${a.action}」没有停顿帧（片段库里没有 ${a.action}_hold），只能一次播完`);
      }
      if (ONE(A2)) {          // 一次性：一段播完即归位
        const X = span('动作', A2.in, a.in ?? a.seconds, a.t0, nextAct); let rest = a.t0 - cursor;
        if (rest < -1e-6) { err(a.t0, `动作「${a.action}」在 ${fmt(a.t0)}s 开始，但上一个动作要到 ${fmt(cursor)}s 才归位（差 ${fmt(-rest)}s）`); rest = 0; }
        const t0 = cursor + Math.max(0, rest), tEnd = t0 + X.d;
        steps.push({ rest: Math.max(0, rest) }, { action: A2.id, ...o, in: X.d, short: 'error' });
        moves.push({ action: a.action, kind: '动作', clip: A2.in, pasteable: pasteable(A2.in), t0, t1: tEnd, seconds: X.d, natural: X.nat, min: X.min, cut: false, unique: ClipPlayer.fit(lib.clips[A2.in], { ...o, seconds: X.d }).unique, oneshot: true });
        cursor = tEnd; continue;
      }
      const I = span('去程', A2.in, a.in, a.t0, Math.min(a.t1, nextAct)), O = span('回程', A2.out, a.out, a.t1, nextAct);
      const dIn = I.d, dOut = O.d;
      let rest = a.t0 - cursor, hold = a.t1 - a.t0 - dIn;
      if (rest < -1e-6) { err(a.t0, `动作「${a.action}」在 ${fmt(a.t0)}s 开始，但上一个动作要到 ${fmt(cursor)}s 才归位（差 ${fmt(-rest)}s）`); rest = 0; }
      if (hold < -1e-6) { err(a.t0, `动作「${a.action}」${fmt(a.t0)}–${fmt(a.t1)}s 只有 ${fmt(a.t1 - a.t0)}s，比去程（${fmt(dIn)}s）还短，保持不了：至少留 ${fmt(dIn)}s`); hold = 0; }
      const t0 = cursor + Math.max(0, rest), tHold = t0 + dIn, tOut = tHold + Math.max(0, hold), tEnd = tOut + dOut;
      steps.push({ rest: Math.max(0, rest) }, { action: A2.id, hold: Math.max(0, hold), ...o, in: dIn, out: dOut, short: 'cut' });      // 够不够短已经在上面查过了；到这里还短的就是说好了要硬切的
      const info = (X, name) => ({ seconds: X.d, natural: X.nat, min: X.min, cut: X.cut, unique: X.cut ? 2 : ClipPlayer.fit(lib.clips[name], { ...o, seconds: X.d }).unique });
      moves.push({ action: a.action, kind: '去程', clip: A2.in, pasteable: pasteable(A2.in), t0, t1: tHold, ...info(I, A2.in) }, { action: a.action, kind: '回程', clip: A2.out, pasteable: pasteable(A2.out), t0: tOut, t1: tEnd, ...info(O, A2.out) });
      cursor = tEnd;
    }
    steps.push({ rest: Math.max(1, (self.duration || 0) - cursor + 1) });
    // 动的时候不说话——除非这段片段全程可贴（每一帧都有头部跟踪且 w > 0）：那样口型、表情能钉在动着的脸上，允许边动边说。转圈这类追不上头的仍然不许。
    for (const m of moves) for (const [i, s] of sentences.entries()) {
      if (m.clip && pasteable(m.clip)) continue;
      const a0 = s.start - GUARD.before, a1 = s.end + GUARD.after;
      if (m.t0 < a1 - 1e-6 && m.t1 > a0 + 1e-6) {
        const txt = s.text ? `「${s.text.length > 14 ? s.text.slice(0, 14) + '…' : s.text}」` : '';
        err(m.t0, `动作「${m.action}」的${m.kind}（${fmt(m.t0)}–${fmt(m.t1)}s，${fmt(m.t1 - m.t0)}s）压在第 ${i + 1} 句 ${txt}（${fmt(s.start)}–${fmt(s.end)}s）上：` +
          (m.t0 < s.start ? `这段要在 ${fmt(a0)}s 前做完（提前 ${fmt(m.t1 - a0)}s），或者这句推后 ${fmt(m.t1 - a0)}s` : `这段要等到 ${fmt(a1)}s 之后再开始（推后 ${fmt(a1 - m.t0)}s）`));
      }
    }
    // 「脸可换程度」（clips/face_attrs.py）：脚本在脸不可换的片段上写了表情 / 说话 / 换眉，或在不换眉的动作上写了 brow: true → 提醒（不报错，那些东西会被收起 / 忽略）
    for (const [i, m] of moves.entries()) {
      const c = m.clip && lib.clips[m.clip]; if (!c) continue;
      const a1 = m.kind === '去程' ? moves.slice(i + 1).find(q => q.action === m.action && q.kind === '回程') : null, t1 = a1 ? a1.t0 : m.t1, pose = a1 ? ACTIONS[m.action]?.pose : null, who = `动作「${m.action}」的${m.kind}（${fmt(m.t0)}–${fmt(t1)}s，片段 ${m.clip}）`;
      const seen = new Set(), note = (k, msg) => { if (!seen.has(k)) { seen.add(k); warn(m.t0, who + msg); } };
      for (let t = m.t0; t < t1 - 1e-6; t += 0.1) {
        const s = st(t), speak = s.talk !== false && speakingAt(t), pasteOk = c.facePaste !== false && (!pose || lib.poses[pose]?.facePaste !== false);
        if (!pasteOk && (typeof s.face === 'string' || s.clean || speak)) note('paste', `脸是画死的（facePaste 否，类③不可替换）：脚本这时写了${typeof s.face === 'string' ? '表情 ' + s.face : s.clean ? 'clean' : '说话'}，会被收起（开头结尾各 3 格淡出 / 淡入）`);
        if (s.brow === true && (c.browSwap === false || (pose && lib.poses[pose]?.browSwap === false))) note('brow', '不换眉（browSwap 否，只换眉以外的）：脚本写了 brow: true，会硬换，眉可能和原眉重复 / 头发错位');
      }
    }
    if (NO_POINTS) warn(0, '这个片段库没有 points.json（挂点）：动作能播，漫符和贴脸的东西出不了。先烘贴片再跑 host-clips/bake_points.py');
    if (sc.ignored.length) warn(0, `脚本里的 ${sc.ignored.join('、')} 片段式讲解员不认（整个人是画好的帧，头和五官不能单独动）`);
    const tl = ClipPlayer.timeline(lib, steps, PLAY);
    compiled = { tl, problems, moves, emotes: sc.emotes, acts: list };
    if (strict) { const e = problems.filter(p => p.level === 'error'); if (e.length) { compiled = null; throw new Error('片段式讲解员的时间表有 ' + e.length + ' 处不行：\n' + e.map(p => '  · ' + p.msg).join('\n')); } }
    return compiled;
  }

  // t → 视图（哪种状态、哪段的第几帧）。纯函数。
  const speakingAt = t => sentences.some(q => t >= q.start && t < q.end);          // 这一刻是不是在一句旁白里
  // 片段里的这一帧能不能贴东西（口型、眨眼、表情脸、贴脸的漫符）：库里有逐帧头部跟踪（clips.json 的 headTracks，clips/track_head.py 量的）
  // 而且这一帧可贴（w > 0）。返回那一帧的跟踪数据，或 null。基准静帧 = lib.headTrackBasis（缺省归位帧）：动作中贴的是它那份贴片，按逐帧对位搬过去。
  const BASIS = lib.headTrackBasis || lib.rest, SMILE_FACES = smileFaces || ['happy', 'love'];
  const frameFile = v => lib.clips[v.clip].frames[ClipPlayer.sequence(lib.clips[v.clip], v)[v.pos]];
  const trackOf = v => { if (!v.clip || !lib.headTracks) return null; const tr = lib.headTracks[frameFile(v)]; return tr && tr.w > 0 && tr.mask && images[tr.mask.file] ? tr : null; };
  function viewAt(t) {
    const v = compile().tl.at(Math.max(0, t)), s = st(t); v.talk = false; v.blink = blink && s.blink !== false;
    // 贴片用哪张静帧的：停着 = 这张静帧自己的；在动 = 这一帧可贴时用基准静帧的（播放器按逐帧对位画上去），不可贴就没有
    const still = v.mode === 'hold' ? ACTIONS[v.action].pose : v.mode === 'rest' ? lib.rest : null, pose = still || (trackOf(v) ? BASIS : null);
    // 口型：这一刻正在念字的时候贴（每个字一次开合）。交给播放器贴：view.mouth = 口型名 / null（不贴，露出帧里原来的嘴）
    const m = pose && s.talk !== false && speech ? speech.mouth(t) : null;
    v.mouth = m && lib.poses[pose].patches?.mouth?.[m.mouth] ? m.mouth : null;
    // 换整套五官的老办法：state.clean = true 时先贴干净脸。只在静帧上
    v.clean = !!(s.clean && still && lib.poses[still].patches?.clean && PTS.poses[still]?.points);
    // 表情脸（state.face = 表情名）：有这张贴片才贴；优先于干净脸和眨眼（播放器管）
    v.face = typeof s.face === 'string' && pose && lib.poses[pose].patches?.face?.[s.face] ? s.face : undefined;
    // 眉：播放器默认不换眉（表情只换眼和嘴，原画的眉留着）。state.brow = true 才让它换（试验：擦原眉 + 画表情的眉）；不写就不传，听播放器 / 库的默认
    if (s.brow === true || s.brow === false) v.brow = s.brow;
    // 有表情脸时说话：念字的那一刻贴口型，字与字之间不贴——露出这张表情自己的嘴（疑惑脸、- - 脸说话时不会每隔几格冒出一个微笑嘴）。
    // 口型里的 smile（咧嘴笑）只配开心类的表情（smileFaces，缺省 happy、love）；别的表情遇到它换成 small，免得 - - 眼配一张大笑的嘴。
    if (v.face) { let shape = m ? m.mouth : null; if (shape === 'smile' && !SMILE_FACES.includes(v.face)) shape = 'small'; v.mouth = shape && lib.poses[pose].patches.mouth?.[shape] ? shape : null; }
    // 干净脸（没有表情脸）上原来的嘴被擦掉了：正在说这句话的时候字与字之间贴闭嘴那张
    else if (v.clean) v.mouth = s.talk !== false && speakingAt(t) ? (m && lib.poses[pose].patches.mouth?.[m.mouth] ? m.mouth : lib.poses[pose].patches.mouth?.closed ? 'closed' : null) : null;
    return v;
  }
  const poseOf = v => (v.mode === 'hold' ? ACTIONS[v.action].pose : v.mode === 'rest' ? lib.rest : null);
  // 这一刻脸上的东西能出几成：停着 = 1；在动 = 这一帧头部跟踪的权重 w（0 = 不可贴）
  const pasteAt = t => { const v = viewAt(t); if (poseOf(v)) return 1; const tr = trackOf(v); return tr ? tr.w : 0; };
  // 这一刻的挂点，片段画布像素（不含呼吸）。静帧：这张静帧的点。片段中：有逐帧头部跟踪的帧 = 基准静帧的点按那一帧的相似变换搬过去（含旋转）；
  // 没有跟踪的库退回 points.json 里量的逐帧位移（只有平移）；头转走了追不上的没有挂点。手按进度从首姿滑到尾姿，只是大致。
  function pointsAt(v) {
    const p = poseOf(v); if (p) return { pts: PTS.poses[p]?.points || null, still: true };
    const tr = lib.headTracks?.[frameFile(v)], BP = PTS.poses[BASIS]?.points;
    if (tr && BP && (tr.ok || tr.w > 0)) {
      const [a, b, tx, ty] = tr.m, out = {}, c = PTS.clips[v.clip], frame = ClipPlayer.sequence(lib.clips[v.clip], v)[v.pos], n = lib.clips[v.clip].frames.length, k = n > 1 ? frame / (n - 1) : 1;
      const A = c && PTS.poses[c.from]?.points, B = c && PTS.poses[c.to]?.points;
      for (const [key, q] of Object.entries(BP)) out[key] = key.startsWith('hand') ? (A?.[key] && B?.[key] ? [A[key][0] + (B[key][0] - A[key][0]) * k, A[key][1] + (B[key][1] - A[key][1]) * k] : q) : [a * q[0] - b * q[1] + tx, b * q[0] + a * q[1] + ty];
      return { pts: out, still: false };
    }
    if (lib.headTracks?.[frameFile(v)]) return { pts: null, still: false };          // 量过、但这一帧追不上（转过去了）
    const c = PTS.clips[v.clip]; if (!c || !c.head) return { pts: null, still: false };          // 没量过、或头在这段里转走了追不上：播放中没有挂点
    const frame = ClipPlayer.sequence(lib.clips[v.clip], v)[v.pos], n = c.head.length, k = n > 1 ? frame / (n - 1) : 1;
    const A = PTS.poses[c.from].points, B = PTS.poses[c.to].points, h = c.head[frame], out = {};
    for (const key of Object.keys(A)) out[key] = key.startsWith('hand') ? (B[key] ? [A[key][0] + (B[key][0] - A[key][0]) * k, A[key][1] + (B[key][1] - A[key][1]) * k] : A[key])
      : [A[key][0] + h[0] + c.endGap[0] * k, A[key][1] + h[1] + c.endGap[1] * k];
    return { pts: out, still: false };
  }
  // 片段画布像素 → 页面 CSS 像素：先呼吸（绕脚底），再整体摆放（绕脚底：缩放、翻转、侧倾、落点）
  function placeAt(t) {
    const s = st(t), K = size / CHAR_H * (s.scale ?? 1), flip = s.flip ? -1 : 1, rot = (s.lean || 0) * flip, fx = s.x ?? W / 2, fy = ground - (s.hop || 0), b = breath(t);
    const cos = Math.cos(rot), sin = Math.sin(rot);
    const map = ([x, y]) => { const u = (x - AX) * (2 - b) * K * flip, w = (y - AY) * b * K; return { x: fx + u * cos - w * sin, y: fy + u * sin + w * cos }; };
    return { s, K, flip, rot, fx, fy, b, map };
  }
  function anchorsAt(t) {
    const v = viewAt(t), { pts, still } = pointsAt(v), pl = placeAt(t);
    return { px: pl.K, head: { yaw: 0, pitch: 0, roll: 0 }, pose: poseOf(v) || v.action, mode: v.mode, still,
      pt: pts ? Object.fromEntries(Object.entries(pts).map(([k, p]) => [k, pl.map(p)])) : {} };
  }

  let last = { t: 0, view: { mode: 'rest' }, bbox: null };
  const self = {
    impl: 'clips', lib, points: PTS, faces: [...new Set(Object.values(lib.poses).flatMap(q => Object.keys(q.patches?.face || {})))],          // faces：这个库里烘过的表情名
    canvas, topLayer, topLayerEmpty: true, backLayer, backLayerEmpty: true, faceLayer, faceLayerEmpty: true, faceLayerDirty: false,
    duration: duration ?? timings?.duration ?? 0, poses: [lib.rest, ...Object.keys(ACTIONS)], actions: ACTIONS,
    direct(fn) { script = fn; compiled = null; },
    act(list) { acts = list ? list.map(a => ({ ...a })) : null; compiled = null; },
    retime,
    // 时间表查一遍：[{ level: 'error' | 'warn', t, msg }]。strict 时有 error 会直接抛。
    check() { return compile().problems.slice(); },
    // 时间线上人在动的时间段（给页面画时间条、给导演排句子用）：[{ action, kind: '去程' | '回程', t0, t1, seconds, natural, min, unique: 播出几个不同的帧, cut: 是不是硬切, pasteable: 这段片段是不是全程可贴（可以边动边说） }]
    moves() { return compile().moves.slice(); },
    // 某个动作的去程 / 回程：自然时长 in / out，最短可接受时长 minIn / minOut
    seconds(action, o) { const A = ACTIONS[action]; if (!A) throw new Error('没有这个动作：' + action); const q = { ...PLAY, ...o };
      if (ONE(A)) { const c = lib.clips[A.in], n = ClipPlayer.naturalSeconds(c, q); return { oneshot: true, in: n, out: 0, target: Math.min(moveTarget(c), n), min: ClipPlayer.minSeconds(c), hold: !!ACTIONS[action + '_hold'] }; }
      return { in: ClipPlayer.naturalSeconds(lib.clips[A.in], q), out: ClipPlayer.naturalSeconds(lib.clips[A.out], q), minIn: ClipPlayer.minSeconds(lib.clips[A.in]), minOut: ClipPlayer.minSeconds(lib.clips[A.out]) }; },
    viewAt, anchorsAt, speakingAt, pasteAt,
    draw(t) {
      const v = viewAt(t), pl = placeAt(t), s = pl.s, pose = poseOf(v), mouth = v.mouth || null;
      player.render(v, t); self.lastFile = (player.last && player.last.file) || null;       // 审看工具（tools/render.mjs 的 RENDER_META、clips/cross_markers.py）读：这一帧画的是哪个帧文件
      canvas.style.opacity = s.visible === false ? 0 : 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!self.backLayerEmpty) ctx.drawImage(backLayer, 0, 0);
      const place = g => { g.setTransform(dpr, 0, 0, dpr, 0, 0); g.translate(pl.fx, pl.fy); g.rotate(pl.rot); g.scale(pl.flip * pl.K, pl.K); g.translate(-AX, -AY); };
      place(ctx); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(pc, 0, 0);
      // 贴脸层留在哪：「脸前、头发后」——用贴了干净脸（擦掉眼、眉、嘴）之后的肤色范围，这样眼睛、嘴那里也算脸，阴影 / 脸红能均匀盖过去，刘海和帽子仍然盖不到。
      // （原来没换脸时用的是原画的肤色范围，眼睛不算皮肤：黑线的阴影在两只眼睛的位置各缺一块，换上表情脸后就成了两个亮圈。）没有干净脸贴片的静帧才退回原画的范围。
      const tr = pose ? null : trackOf(v), mp = pose || (tr ? BASIS : null), skin = mp && (SKIN_CLEAN[mp] || SKIN[mp]);
      if (!self.faceLayerEmpty && skin) {      // 贴脸层：只留在脸上（肤色范围）。在动的帧：把基准静帧的范围按逐帧对位搬过去，再按那一帧的遮罩裁掉刘海和挡在脸前的手，整体乘权重 w
        const inFrame = g => { place(g); g.translate(AX, AY); g.scale(2 - pl.b, pl.b); g.translate(-AX, -AY); };
        sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'source-over'; sctx.clearRect(0, 0, scratch.width, scratch.height); sctx.drawImage(faceLayer, 0, 0);
        sctx.globalCompositeOperation = 'destination-in'; inFrame(sctx); if (tr) sctx.transform(tr.m[0], tr.m[1], -tr.m[1], tr.m[0], tr.m[2], tr.m[3]); sctx.drawImage(skin, 0, 0);
        // 那一帧的遮罩图：新格式是左右拼的一张（mask.halves：左半 = 刘海下可画，右半 = 刘海上可画），贴脸层在刘海下，取左半；旧格式整张就是
        if (tr) { inFrame(sctx); const mi = images[tr.mask.file], [mx, my, mw, mh] = tr.mask.rect, hi = tr.mask.halves ? tr.mask.halves.indexOf('under_hair') : -1;
          if (hi >= 0) sctx.drawImage(mi, hi * mw, 0, mw, mh, mx, my, mw, mh); else sctx.drawImage(mi, mx, my); }
        sctx.globalCompositeOperation = 'source-over';
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = tr ? tr.w : 1; ctx.drawImage(scratch, 0, 0); ctx.globalAlpha = 1;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (!self.topLayerEmpty) ctx.drawImage(topLayer, 0, 0);
      const r = player.last, bb = r.bbox && [[r.bbox[0], r.bbox[1]], [r.bbox[2], r.bbox[1]], [r.bbox[0], r.bbox[3]], [r.bbox[2], r.bbox[3]]].map(pl.map);
      last = { t, view: v, pose, mouth, frame: r.clip ? r.frame : null, clip: v.clip || null, patches: r.patches,
        bbox: bb && { x0: Math.min(...bb.map(p => p.x)), x1: Math.max(...bb.map(p => p.x)), y0: Math.min(...bb.map(p => p.y)), y1: Math.max(...bb.map(p => p.y)) } };
    },
    bbox: () => last.bbox, anchors: () => anchorsAt(last.t), pose: () => last.pose || last.view.action || lib.rest, hands: () => null, last: () => last,
  };
  retime(timings);
  return self;
}
