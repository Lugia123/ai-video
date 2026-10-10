// 片段播放器：归位（待机）⇄ 动作保持，中间用预先做好的序列帧过渡。
// 普通脚本（不是 module），file:// 双击打开的页面也能用。全局只挂一个 ClipPlayer。
//
//   const lib = await ClipPlayer.loadLibrary(base);               // base = 片段库目录（含 clips.json / clips.js）
//   const images = await ClipPlayer.preload(lib, base, onProgress); // 全部帧加载并解码完才返回
//   const p = new ClipPlayer(lib, images, canvas);
//   p.play('think');  p.rest();  p.advance(dt);                    // advance 由页面的 rAF 调，播放器自己不看表
//
// 状态：rest（归位帧）→ in（播 in 段）→ hold（停在动作姿势）→ out（播 out 段）→ rest。
//   play(动作)：在归位时直接播；动作中再点，默认排队到归位后再播；opts.jump = true 时不等归位、直接切过去。
//   rest()：保持中 → 立刻播 out 段；in 段播到一半 → 播完 in 段马上接 out 段。
//   hold 到 opts.hold 秒自动归位（Infinity = 一直保持到 rest()）。
//   口型 / 眨眼贴片（opts.talk / opts.blink）：只贴在静止帧（rest、hold）上，片段播放中自动不贴。
//   视图上还能直接指定：view.mouth = 'closed' | 'small' | 'big' | 'smile' | null（指定口型，优先于 talk 的固定节拍；null = 不贴，
//   露出帧里原来的嘴；不给这个键 = 照 talk 走）；view.face = '<表情名>'（poses.<静帧>.patches.face 里有的）贴一张同画风的表情脸：眼眉一块、嘴一块，
//   说话（有口型贴片要画）时嘴那块不贴、让位给口型；优先于 clean 和 blink。交互时对应 opts.face。
//   片段播放中：库里有 headTracks（逐帧头部对位 + 遮罩 + 权重 w）的帧，口型 / 眨眼 / 表情脸 / 脸部动画按对位画在动着的脸上，
//   用的是归位帧那份贴片；没有跟踪数据的帧不贴。
//   view.faceClip = { name, t }：播一段脸部动画（poses.<静帧>.patches.faceClips.<name> = { fps, frames: [{eyes, mouth, brow}] }），
//   按 t 秒取帧；和 face 同样的三块、同样的让位规则。
//   表情脸还有第三块 brow（眉，画在刘海上层）：**默认按库里的 browOk 标记**（clips/brow_ok.py）：可换的静帧 / 片段擦原眉、画新眉，
//   不可换的只换眼和嘴、原眉保留；view.brow / opts.brow = true / false 强制。没有标记的库 = 都不换。
//   view.clean = true 先贴一张擦掉眼、眉、嘴的干净脸（给换整套五官用，
//   上面再叠什么由调用方自己画）。交互时对应 opts.mouth（undefined = 不指定）和 opts.clean。
//   没有 pose / out 的动作（standalone，比如带底的草稿片段）：播完 in 段直接回归位帧。
// 画面只由「视图」决定：{ mode, action, clip, pos }（pos = 片段里播到第几个）+ 时间 t（只管呼吸）。
// 交互时视图来自状态机，渲染时来自 ClipPlayer.timeline(...).at(t)——后者是 t 的纯函数。
// 片段占多少秒可以由脚本定（时间线的 in / out，见 sequence 上面的说明）：短了跳帧、长了每帧停久一点；不给就是自然时长，和原来一样。
(function (root) {
  'use strict';

  // 片段实际要播的帧号列表。o.trimmed：只播首帧 + 有效范围 + 末帧，裁掉静止的头尾。
  // o.skipDupes：跳过 clip.dupes 里标的「几乎没动、像重复帧」的帧（首末帧永远保留）。
  function baseSequence(clip, o) {
    const n = clip.frames.length, dup = new Set(o && o.skipDupes ? clip.dupes || [] : []);
    const all = Array.from({ length: n }, (_, i) => i).filter(i => i === 0 || i === n - 1 || !dup.has(i));
    if (!o || !o.trimmed || !clip.active || !clip.active.length) return all;
    const keep = new Set([0, n - 1]);
    for (const [a, b] of clip.active) for (let i = a; i <= b; i++) keep.add(i);
    return all.filter(i => keep.has(i));
  }
  // —— 按指定时长播（时间重映射）——
  // o.seconds = 这段要占多少秒（导演脚本定的）。不给就是自然时长：有效帧一帧不落，每帧 1 / (fps × speed) 秒。
  //   比自然时长短 → 跳帧：播 m = round(seconds × fps) 格（至少 2 格），第 j 格取「动作进度」最接近 ease(j / (m−1)) 的那一帧；
  //                 首帧、末帧一定取到（j = 0 和 j = m−1），每格在屏幕上的时间仍约等于 1 / fps，所以看上去是「少画了几张」而不是「快放」。
  //                 按动作进度而不是按帧号挑：片段里静止的头尾、重复帧进度不涨，自然被跳过，剩下的格子都花在真的在动的那几帧上。
  //   比自然时长长 → 不跳帧，有效帧全播，每帧停得更久（seconds / n 秒一帧）；不做混帧。
  // o.ease：跳帧时怎么挑帧。linear 每格走的动作量一样多；inout 两头密中间疏（起止都慢）；snap 开头疏结尾密（起手快、到位前收住）。
  // o.only = 帧号：只播这一帧（低于最短时长改成硬切时用）。
  const EASE = { linear: u => u, inout: u => u * u * (3 - 2 * u), snap: u => 1 - (1 - u) * (1 - u) };
  const DEFAULT_EASE = 'linear', MIN_FRAMES = 5;       // 最短可接受时长的缺省值 = 播得出 5 格（16fps 时约 0.31 秒）；片段可以用 minSeconds 自己定
  function sequence(clip, o) {
    if (o && o.only != null) return [o.only];
    const base = baseSequence(clip, o);
    if (!o || o.seconds == null) return base;
    const n = base.length, m = Math.max(2, Math.round(o.seconds * clip.fps));
    if (m >= n) return base;
    const E = EASE[o.ease || DEFAULT_EASE]; if (!E) throw new Error('没有这种 ease：' + o.ease + '（可用：' + Object.keys(EASE).join(' / ') + '）');
    // 动作进度：clip.arc[帧号]（0–1，相邻帧变动面积的累计，qa/clips/fit.py --write-arc 量的）；没有就按帧号均匀当进度
    const arc = clip.arc ? base.map(i => clip.arc[i]) : base.map((_, k) => k / (n - 1)), total = arc[n - 1];
    const out = Array.from({ length: m }, (_, j) => { const tgt = E(j / (m - 1)) * total; let best = 0; for (let k = 1; k < n; k++) if (Math.abs(arc[k] - tgt) < Math.abs(arc[best] - tgt)) best = k; return base[best]; });
    out[0] = base[0]; out[m - 1] = base[n - 1];
    return out;
  }
  const naturalSeconds = (clip, o) => baseSequence(clip, o).length / (clip.fps * ((o && o.speed) || 1));
  const clipSeconds = (clip, o) => (o && o.seconds != null ? o.seconds : naturalSeconds(clip, o));
  // 这段播到第 e 秒时是序列里的第几格
  function posAt(clip, o, e) { const len = sequence(clip, o).length; return Math.min(len - 1, Math.floor(e / clipSeconds(clip, o) * len + 1e-6)); }
  const minSeconds = clip => (clip.minSeconds != null ? clip.minSeconds : MIN_FRAMES / clip.fps);
  // 按 o 播这段片段会怎样：{ seconds, natural, min, frames: 实际播的帧号序列, unique: 不同的帧数, short: 是不是低于最短可接受时长 }
  function fit(clip, o) {
    const frames = sequence(clip, o), seconds = clipSeconds(clip, o), min = minSeconds(clip);
    return { seconds, natural: naturalSeconds(clip, o), min, frames, unique: new Set(frames).size, short: seconds < min - 1e-9 };
  }
  // 硬切时的整体挤压 [横, 竖]：切之前那一格下压，切过去之后上弹约 2%、三四格落定（和拆件讲解员换姿势的手感同一组数）
  function cutSquash(e) { if (e < 1 / 30) return [1.012, 0.98]; const n = (e - 1 / 30) * 30, k = Math.exp(-n * 0.9) * Math.cos(n * 1.1); return n < 5 ? [1 - 0.011 * k, 1 + 0.02 * k] : [1, 1]; }

  // 静止帧上的贴片（口型、眨眼）。时间都是 t 的纯函数。
  const PERFEAT_URL = (() => { try { return new URLSearchParams(location.search).has('perfeat'); } catch (e) { return false; } })();     // ?perfeat=1：逐五官贴（需要库里有 headTracks[帧].feat）
  const patchList = pose => (pose.patches ? [...Object.values(pose.patches.mouth || {}), ...['blink', 'clean', 'eyeSkin', 'browErase'].filter(k => pose.patches[k]).map(k => pose.patches[k]),
    ...Object.values(pose.patches.face || {}).flatMap(f => Object.values(f)),
    ...Object.values(pose.patches.dfltMouth || {}), ...(pose.patches.dfltBlink ? [pose.patches.dfltBlink] : []),
    ...(pose.patches.ink ? [...Object.values(pose.patches.ink.default || {}), ...Object.values(pose.patches.ink.mouth || {}), pose.patches.ink.blink].filter(Boolean) : []),
    ...(pose.patches.defaultFace ? ['base', 'hair', 'brow'].filter(k => pose.patches.defaultFace[k]).map(k => pose.patches.defaultFace[k]) : []),
    ...Object.values(pose.patches.faceClips || {}).flatMap(c => c.frames.flatMap(f => Object.values(f)))] : []);
  function mouthAt(lib, t) {              // → 口型名，或 null（不贴，露出帧里原来的嘴）
    const pat = lib.talk && lib.talk.pattern; if (!pat) return null;
    const total = pat.reduce((s, p) => s + p[1], 0); let x = ((t % total) + total) % total;
    for (const [shape, d] of pat) { if (x < d) return shape; x -= d; }
    return null;
  }
  function blinkAt(lib, t) {
    const b = lib.blink; if (!b) return false;
    return (((t + (b.offset || 0)) % b.period) + b.period) % b.period < b.closed;
  }

  function loadImage(src) {
    return new Promise((ok, no) => {
      const im = new Image();
      im.onload = () => im.decode().then(() => ok(im), () => no(new Error('解码失败：' + src)));   // onload 只说明文件到了，解码完才算数
      im.onerror = () => no(new Error('加载失败：' + src));
      im.src = src;
    });
  }

  class ClipPlayer {
    static async loadLibrary(base) {
      if (location.protocol !== 'file:') {
        const r = await fetch(base + 'clips.json');
        if (!r.ok) throw new Error('读不到 ' + base + 'clips.json');
        return r.json();
      }
      await new Promise((ok, no) => {          // file:// 下 fetch 不能用，走同内容的 clips.js
        const s = document.createElement('script');
        s.src = base + 'clips.js'; s.onload = ok; s.onerror = () => no(new Error('读不到 ' + base + 'clips.js'));
        document.head.appendChild(s);
      });
      return root.__clipLibrary;
    }

    // 返回 { 帧路径: Image }。全部解码完才 resolve，播的时候不会边播边等图。
    static async preload(lib, base, onProgress) {
      const files = new Set(Object.values(lib.poses).map(p => p.frame));
      for (const c of Object.values(lib.clips)) c.frames.forEach(f => files.add(f));
      for (const p of Object.values(lib.poses)) for (const q of patchList(p)) files.add(q.file);
      for (const t of Object.values(lib.headTracks || {})) { if (t.maskInk) files.add(t.maskInk.file); if (t.mask) files.add(t.mask.file); if (t.under) files.add(t.under.file); if (t.browErase) files.add(t.browErase.file); }
      const out = {}; let done = 0;
      await Promise.all([...files].map(async f => { out[f] = await loadImage(base + f); if (onProgress) onProgress(++done, files.size); }));
      return out;
    }

    // 固定脚本 → 时间线。steps：[{ rest: 秒, talk?, blink? } | { action: 动作名, hold: 秒, trimmed?, skipDupes?, speed?, talk?, blink?,
    //   in?: 去程占多少秒, out?: 回程占多少秒（不给 = 自然时长）, ease?, short?: 'error'（缺省）| 'cut' }]。at(t) 是 t 的纯函数。
    //   in / out 低于片段的最短可接受时长（clip.minSeconds，缺省 5 格）时：short = 'error' 抛错；'cut' 改成硬切 + 压扁回弹，仍占这么多秒。
    static timeline(lib, steps, opts) {
      const segs = []; let t = 0;
      const move = (mode, a, name, o, seconds) => {
        const clip = lib.clips[name], q = Object.assign({}, o, seconds != null ? { seconds } : {}), f = fit(clip, q);
        if (f.short && q.short !== 'cut') throw new Error(`动作「${a.id}」的${mode === 'in' ? '去程' : '回程'}只给了 ${f.seconds.toFixed(2)} 秒，低于这段片段的最短可接受时长 ${f.min.toFixed(2)} 秒（再短就只剩两三帧，像瞬移）`);
        push(f.seconds, { mode, action: a.id, clip: name, o: q, cut: f.short });
      };
      const push = (len, view) => { segs.push({ t0: t, t1: t + len, view }); t += len; };
      for (const s of steps) {
        if (s.rest != null) { push(s.rest, { mode: 'rest', talk: s.talk, blink: s.blink, mouth: s.mouth, clean: s.clean, face: s.face, brow: s.brow, faceClip: s.faceClip }); continue; }
        const a = lib.actions.find(x => x.id === s.action), o = Object.assign({}, opts, s);
        move('in', a, a.in, o, s.in);
        if (a.pose) push(s.hold || 0, { mode: 'hold', action: a.id, talk: s.talk, blink: s.blink, mouth: s.mouth, clean: s.clean, face: s.face, brow: s.brow, faceClip: s.faceClip });
        if (a.out) move('out', a, a.out, o, s.out);
      }
      const at = time => {
        const tt = Math.max(0, Math.min(t - 1e-6, time));
        const g = segs.find(x => tt < x.t1) || segs[segs.length - 1], v = g.view;
        if (!v.clip) return { mode: v.mode, action: v.action, talk: v.talk, blink: v.blink, mouth: v.mouth, clean: v.clean, face: v.face, brow: v.brow, faceClip: v.faceClip };
        const clip = lib.clips[v.clip], e = tt - g.t0;
        if (v.cut) return { mode: v.mode, action: v.action, clip: v.clip, only: e < 1 / 30 ? 0 : clip.frames.length - 1, pos: 0, squash: cutSquash(e) };   // 硬切：先压一格，再切到末帧回弹
        return { mode: v.mode, action: v.action, clip: v.clip, trimmed: !!v.o.trimmed, skipDupes: !!v.o.skipDupes, seconds: v.o.seconds, ease: v.o.ease, speed: v.o.speed,
          pos: posAt(clip, v.o, e) };
      };
      return { duration: t, segments: segs, at };
    }

    constructor(lib, images, canvas, opts) {
      this.lib = lib; this.images = images; this.canvas = canvas; this.g = canvas.getContext('2d');
      canvas.width = lib.canvas.w; canvas.height = lib.canvas.h;
      this.opts = Object.assign({ hold: 2, speed: 1, trimmed: true, skipDupes: false, jump: false, showBox: false, talk: false, blink: false }, opts);
      this.time = 0;                       // 只喂给呼吸，一直往前走
      this.s = { mode: 'rest', action: null, e: 0, next: null, wantRest: false };
      this.onChange = null;
      this.render(this.view(), 0);
    }

    action(id) { return this.lib.actions.find(a => a.id === id); }
    _start(id) { this.s = { mode: 'in', action: id, e: 0, next: null, wantRest: false }; }
    _toRest() { const next = this.s.next; this.s = { mode: 'rest', action: null, e: 0, next: null, wantRest: false }; if (next) this._start(next); }
    _leave() {                             // 离开当前动作：有 out 段就播，没有就直接回归位帧
      const a = this.action(this.s.action);
      if (a.out) { this.s.mode = 'out'; this.s.e = 0; } else this._toRest();
    }

    play(id) {
      if (!this.action(id)) throw new Error('没有这个动作：' + id);
      const s = this.s;
      if (s.mode === 'rest' || this.opts.jump) this._start(id);
      else { s.next = id; if (s.mode === 'hold') this._leave(); }
      this.render(this.view(), this.time);
    }

    rest() {
      const s = this.s; s.next = null;
      if (s.mode === 'hold') this._leave();
      else if (s.mode === 'in') { if (this.action(s.action).out) s.wantRest = true; else this._toRest(); }
      this.render(this.view(), this.time);
    }

    advance(dt) {
      this.time += dt; const s0 = this.s; s0.e += dt;
      for (let guard = 0; guard < 8; guard++) {          // 一步里可能连过几个状态（保持 0 秒、很大的 dt）
        const s = this.s, a = s.action && this.action(s.action);
        if (s.mode === 'in') {
          const d = clipSeconds(this.lib.clips[a.in], this.opts); if (s.e < d) break;
          const left = s.e - d;
          if (!a.pose) { this._toRest(); this.s.e = left; }
          else { s.mode = 'hold'; s.e = left; if (s.next || s.wantRest) { this._leave(); this.s.e = left; } }
        } else if (s.mode === 'hold') {
          if (s.e < this.opts.hold) break;
          const left = s.e - this.opts.hold; this._leave(); this.s.e = left;
        } else if (s.mode === 'out') {
          const d = clipSeconds(this.lib.clips[a.out], this.opts); if (s.e < d) break;
          const left = s.e - d; this._toRest(); this.s.e = left;
        } else break;
      }
      this.render(this.view(), this.time);
    }

    view() {
      const s = this.s, v = { mode: s.mode, action: s.action, next: s.next };
      if (s.mode === 'in' || s.mode === 'out') {
        const a = this.action(s.action), name = a[s.mode], clip = this.lib.clips[name];
        v.clip = name; v.trimmed = this.opts.trimmed; v.skipDupes = this.opts.skipDupes; v.seconds = this.opts.seconds; v.ease = this.opts.ease;   // 交互时也能按时长播：opts.seconds
        v.pos = posAt(clip, this.opts, s.e);
      }
      return v;
    }

    // 视图 → 这一格画哪张图。返回 { file, bbox, clip, frame, pos, count, total }
    resolve(v) {
      const lib = this.lib;
      if (v.clip) {
        const clip = lib.clips[v.clip], seq = sequence(clip, v), frame = seq[v.pos];
        return { file: clip.frames[frame], bbox: clip.frameBBox && clip.frameBBox[frame], clip, frame, pos: v.pos, count: seq.length, total: clip.frames.length };
      }
      const pose = lib.poses[v.mode === 'hold' ? this.action(v.action).pose : lib.rest];
      return { file: pose.frame, bbox: pose.bbox, pose };
    }

    render(v, t) {
      const lib = this.lib, g = this.g, W = lib.canvas.w, H = lib.canvas.h, r = this.resolve(v), im = this.images[r.file];
      if (!im) throw new Error('帧没加载：' + r.file);     // 宁可报错，也不悄悄画一格空的
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.imageSmoothingQuality = 'high';
      let margin = null, box = null; const patches = [];
      if (r.clip && r.clip.opaque) {       // 带底的草稿片段：等比放进画布正中，不呼吸
        const k = Math.min(W / im.width, H / im.height), w = im.width * k, h = im.height * k;
        g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      } else {
        const b = 1 + lib.breath.amp * Math.sin(2 * Math.PI * t / lib.breath.period), ax = lib.anchor.x, ay = lib.anchor.y;
        const sq = v.squash || [1, 1];       // 硬切时的整体挤压（时间线给的），和呼吸一样绕脚底
        g.translate(ax, ay); g.scale((2 - b) * sq[0], b * sq[1]); g.drawImage(im, -ax, -ay);
        // 贴片只贴在静止帧上（片段播放中不贴），和帧用同一个变换画，所以呼吸缩放时跟着走
        // 贴片。静止帧：用这张静帧自己的贴片，直接画。片段播放中：这一帧有头部跟踪（lib.headTracks[帧文件]，clips/track_head.py 量的）且可贴，
        // 就把归位帧那份贴片按逐帧对位画上去——分三层，每层先画到离屏小画布、按这一帧的遮罩裁掉（头发、挡在脸前的手和袖子），再贴回：
        //   ① 不透明的块（眼 / 干净脸 / 眨眼 / 嘴 / 口型），遮罩左半（头发下面）；② 腮红，正片叠底；③ 眉，遮罩右半（头发上面，只让开遮挡物）。
        // 没有跟踪数据的库照旧——片段播放中不贴。
        const tr = r.clip && lib.headTracks && lib.headTracks[r.file], moving = !!(tr && tr.w > 0 && tr.mask && this.images[tr.mask.file]);
        // 「脸可换程度」（clips/face_attrs.py 写的 facePaste / browSwap；老库没有就退回 browOk）：
        //   facePaste = false 的静帧不贴任何东西；facePaste = false 的片段（转圈）里不贴，但开头 / 结尾各 3 格里把相邻静帧的脸按原位淡出 / 淡入，不硬跳。
        const pastes = o => !!o && o.facePaste !== false, brows = o => !!o && (o.browSwap !== undefined ? !!o.browSwap : !!o.browOk);
        let pt = r.clip ? (moving ? lib.poses[lib.headTrackBasis || lib.rest].patches : null) : r.pose && pastes(r.pose) ? r.pose.patches : null, faceA = 1;
        if (r.clip && !moving && r.clip.facePaste === false) {
          const side = (n, a) => (n && lib.poses[n] && pastes(lib.poses[n]) && lib.poses[n].patches ? { n, a: Math.max(0, 1 - a / 3) } : { n, a: 0 });
          const f = side(r.clip.from, r.pos), e = side(r.clip.to, r.count - 1 - r.pos), pick = e.a > f.a ? e : f;
          if (pick.a > 0) { pt = lib.poses[pick.n].patches; faceA = pick.a; }
        }
        if (r.clip && moving && r.clip.facePaste === false) pt = null;
        // 空脸（faceBlank）：片段 / 静帧本身没画五官，每一帧都由我们画整张脸——没指定表情画默认脸（patches.defaultFace：从原归位帧上取的眉 + 眼 + 鼻 + 嘴，
        // 空脸归位帧 + 默认脸 = 原归位帧逐像素相同），指定了表情画表情脸（含它的眉；空脸上没有原眉要擦）。口型、眨眼照旧叠在上面。
        const blankF = !!(r.clip ? r.clip.faceBlank === true : r.pose && r.pose.faceBlank === true), dflt = blankF && pt && pt.defaultFace;
        // 面部遮罩做法（空脸库，lib.faceMode = 'ink'；opts.faceMode = 'legacy' 退回旧的「底块 + 发边修补」默认脸）：贴上去的只有五官的墨迹，不带任何不透明的肤色、发边、脸轮廓；
        // 动作中按这一帧自己算的面部遮罩（track_ink/）裁：遮罩 = 这一帧里含鼻点的肤色区域（略放大进头发），手、袖子、描边一个像素都不在里面。
        const inkMode = blankF && !!(pt && pt.ink) && (this.opts.faceMode || lib.faceMode) !== 'legacy' && (!r.clip || !moving || !!(tr && tr.maskInk));
        if (blankF && r.clip && !moving && !dflt && !inkMode) pt = null;
        if (pt) {
          const talk = v.talk != null ? v.talk : this.opts.talk, blink = v.blink != null ? v.blink : this.opts.blink;
          const clean = v.clean != null ? v.clean : this.opts.clean;
          const faceName = v.face !== undefined ? v.face : this.opts.face;           // 表情脸：同画风的整套表情五官
          // 脸部动画：view.faceClip = { name, t }（t = 这段动画播到第几秒），按 t 取帧，纯函数；有它就不看 face
          const fc = (v.faceClip !== undefined ? v.faceClip : this.opts.faceClip) || null, fcd = fc && pt.faceClips && pt.faceClips[fc.name];
          const fp = fcd ? fcd.frames[Math.max(0, Math.min(fcd.frames.length - 1, Math.floor(fc.t * fcd.fps + 1e-6)))] : faceName && pt.face && pt.face[faceName];
          const fixedMouth = v.mouth !== undefined ? v.mouth : this.opts.mouth;      // undefined = 没指定，照 talk 的节拍
          const shape = fixedMouth !== undefined ? fixedMouth : talk ? mouthAt(lib, t) : null;
          const base = [], mult = [], top = []; let under = null, browPre = null, topAlpha = 1, hairFix = null;
          if (fp && fp.eyes) {
            under = inkMode ? null : moving ? tr.under : pt.eyeSkin;          // 眼睛底下垫的肤色：静帧用这张静帧的，动作中用这一帧自己的（已经在帧坐标里，不跟贴片一起变换）；面部遮罩做法不垫
            base.push(inkMode && fp.eyesInk ? fp.eyesInk : fp.eyes); patches.push(fcd ? '脸部动画 ' + fc.name : '表情 ' + faceName);
            if (fp.blush) mult.push(fp.blush);
            // 换眉：显式 view.brow / opts.brow（true / false）强制；不给就按库里的标记（clips/brow_ok.py 判的 browOk）——
            // 可换的静帧 / 片段换，不可换的自动不换。不可换的片段若首 / 尾接的是可换的静帧，开头 / 结尾 3 帧里新眉淡出 / 淡入，不硬跳。
            const forced = v.brow !== undefined ? v.brow : this.opts.brow; let browA = 0;
            if (forced !== undefined) browA = forced === true ? 1 : 0;
            else if (blankF) browA = 1;                                    // 空脸：表情的眉照画（上面没有原眉）
            else if (!r.clip) browA = brows(r.pose) ? 1 : 0;
            else {                                                         // 片段：按 browSwap。和相邻静帧的「能不能换眉」不一样时，开头 / 结尾 3 格里新眉淡入 / 淡出，不硬跳
              const nb = n => brows(lib.poses[n]), fi = r.pos / 3, fo = (r.count - 1 - r.pos) / 3;
              if (brows(r.clip)) browA = Math.min(1, nb(r.clip.from) || !r.clip.from ? 1 : fi, nb(r.clip.to) || !r.clip.to ? 1 : fo);
              else browA = Math.max(nb(r.clip.from) ? 1 - fi : 0, nb(r.clip.to) ? 1 - fo : 0, 0);
            }
            const brow = browA > 0; topAlpha = Math.min(1, browA);             // 眉画在刘海上层；view.brow = false 不贴
            if (fp.brow && brow === true) { if (pt.browErase && !blankF) top.push(pt.browErase); top.push(fp.brow); patches.push('眉'); }      // 先擦原眉，再画新眉；动作中用这一帧自己的那张（帧坐标）      // 先擦原眉（压着刘海画的那条线），再画新眉
          }
          else if (inkMode) {                                  // 默认脸 = 美术素材的墨迹（腮红、眼、鼻、嘴、眉），眨眼时眼换成闭眼线
            const dk = pt.ink.default; if (dk.blush) base.push(dk.blush);
            if (blink && pt.ink.blink && blinkAt(lib, t)) { base.push(pt.ink.blink); patches.push('眨眼'); } else if (dk.eyes) base.push(dk.eyes);
            if (!shape && dk.mouth) base.push(dk.mouth);
            if (dk.brow) top.push(dk.brow); topAlpha = v.brow === false ? 0 : 1; patches.push('默认脸·墨迹');
          }
          else if (clean && pt.clean && !blankF) { base.push(pt.clean); patches.push('干净脸'); }
          else if (dflt) {
            // 发边修补（空脸帧的发边和原画不一样的那几块，贴原画像素才逐像素还原）：静帧上直接画；动作中只在开头 / 结尾 6 格、头移得不远（d < 4px）时渐隐着画，
            // 动起来头发形状变了，贴原画的发丝会错位成一块一块的。
            if (dflt.base) base.push(dflt.base); if (dflt.brow) top.push(dflt.brow); patches.push('默认脸'); topAlpha = v.brow === false ? 0 : 1;
            if (dflt.hair) { if (!moving) base.push(dflt.hair); else { const d = Math.hypot(tr.m[2], tr.m[3]) + 200 * Math.abs(tr.m[1]), edge = Math.min(r.pos, r.count - 1 - r.pos), a = Math.max(0, 1 - edge / 6) * Math.max(0, Math.min(1, (4 - d) / 3.5)); if (a > 0) hairFix = { q: dflt.hair, a }; } }
            const bk = pt.dfltBlink || pt.blink; if (blink && bk && blinkAt(lib, t)) { base.push(bk); patches.push('眨眼'); }          // 默认脸的底是原画肤色：用对着原归位帧烘的那套
          }
          else if (blink && pt.blink && blinkAt(lib, t)) { base.push(pt.blink); patches.push('眨眼'); }
          const mset = inkMode ? pt.ink.mouth : dflt && !fp && pt.dfltMouth ? pt.dfltMouth : pt.mouth;
          if (shape && mset && mset[shape]) { base.push(mset[shape]); patches.push('口型 ' + shape); }
          else if (fp && fp.mouth) base.push(inkMode && fp.mouthInk ? fp.mouthInk : fp.mouth);                              // 没在说话：用表情脸自己的嘴；说话时这块不贴，让位给口型贴片
          if (!moving) {
            const put = q => g.drawImage(this.images[q.file], q.rect[0] - ax, q.rect[1] - ay);
            g.globalAlpha = faceA; if (under && this.images[under.file]) put(under); g.globalAlpha = 1;
            g.globalAlpha = faceA; base.forEach(put); g.globalCompositeOperation = 'multiply'; mult.forEach(put); g.globalCompositeOperation = 'source-over'; g.globalAlpha = topAlpha * faceA; top.forEach(put); g.globalAlpha = 1;
          } else {
            const mdef = inkMode ? tr.maskInk : tr.mask, [rx, ry, rw, rh] = mdef.rect, mk = this.images[mdef.file], off = this._off || (this._off = document.createElement('canvas'));
            const layer = (list, half, op, pre, mul = 1, skinOnly = false) => {
              if (!list.length) return;
              off.width = rw; off.height = rh; const c = off.getContext('2d'); c.imageSmoothingQuality = 'high';
              if (pre && this.images[pre.file]) c.drawImage(this.images[pre.file], pre.rect[0] - rx, pre.rect[1] - ry);
              // 逐五官（两遍法，?perfeat=1 或 opts.perFeat；默认关）：左眼、右眼、嘴各自再加 A 里实测的残余位移 tr.feat（帧坐标）；眉和腮红跟同侧的眼，鼻点不动。
              // 贴片按中心高度分：在嘴参照点附近及以下的 = 嘴，其余（眼、眉、腮红、眨眼）按鼻点的横坐标分左右两半各画一遍。
              const pf = (this.opts.perFeat !== undefined ? this.opts.perFeat : PERFEAT_URL) && tr.feat, R = lib.headTrackRefs, T6 = (dx, dy) => c.setTransform(tr.m[0], tr.m[1], -tr.m[1], tr.m[0], tr.m[2] - rx + dx, tr.m[3] - ry + dy);
              if (!pf) { T6(0, 0); for (const q of list) c.drawImage(this.images[q.file], q.rect[0], q.rect[1]); }
              else for (const q of list) {
                const img = this.images[q.file];
                if (q.rect[1] + q.rect[3] / 2 > R.mouth[1] - 12) { T6(...tr.feat.mouth); c.drawImage(img, q.rect[0], q.rect[1]); continue; }
                for (const side of ['eyeL', 'eyeR']) {
                  c.save(); T6(...tr.feat[side]); c.beginPath(); if (side === 'eyeL') c.rect(-1e4, -1e4, 1e4 + R.nose[0], 2e4); else c.rect(R.nose[0], -1e4, 1e4, 2e4); c.clip();
                  c.drawImage(img, q.rect[0], q.rect[1]); c.restore();
                }
              }
              c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'destination-in'; c.drawImage(mk, half * rw, 0, rw, rh, 0, 0, rw, rh); c.globalCompositeOperation = 'source-over';
              if (skinOnly) {          // 只留在这一帧的肤色上：默认眉（压在刘海边上的一条细线）动起来后发边和头对不上，落到头发上的那段不画
                const fc = this._fc || (this._fc = document.createElement('canvas')); fc.width = rw; fc.height = rh; const f2 = fc.getContext('2d', { willReadFrequently: true });
                f2.clearRect(0, 0, rw, rh); f2.drawImage(im, rx, ry, rw, rh, 0, 0, rw, rh); const fd = f2.getImageData(0, 0, rw, rh), od = c.getImageData(0, 0, rw, rh), a = fd.data, b = od.data;
                for (let i = 0; i < a.length; i += 4) if (!(a[i + 3] > 200 && a[i] > 205 && a[i] - a[i + 2] > 14 && a[i + 1] > 150)) b[i + 3] = 0;
                c.putImageData(od, 0, 0);
              }
              g.globalAlpha = tr.w * mul; g.globalCompositeOperation = op; g.drawImage(off, rx - ax, ry - ay); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
            };
            layer(base, 0, 'source-over', under); layer(mult, 0, 'multiply');
            if (hairFix) { g.globalAlpha = hairFix.a * tr.w; g.drawImage(this.images[hairFix.q.file], hairFix.q.rect[0] - ax, hairFix.q.rect[1] - ay); g.globalAlpha = 1; }
            layer(top, 1, 'source-over', browPre, topAlpha);
            if (patches.length) patches.push(`跟踪 w=${tr.w}`);
          }
          if (top.length && topAlpha < 1) patches.push(`眉 α=${topAlpha.toFixed(2)}`);
          {
          }
        }
        g.setTransform(1, 0, 0, 1, 0, 0);
        if (r.bbox) {                      // 包围盒跟着呼吸一起变
          box = [ax + (r.bbox[0] - ax) * (2 - b), ay + (r.bbox[1] - ay) * b, ax + (r.bbox[2] - ax) * (2 - b), ay + (r.bbox[3] - ay) * b];
          margin = { left: box[0], top: box[1], right: W - box[2], bottom: H - box[3] };
          margin.min = Math.min(margin.left, margin.top, margin.right, margin.bottom);
        }
      }
      if (this.opts.showBox) {
        g.lineWidth = 2; g.strokeStyle = '#E8590C'; g.setLineDash([10, 8]); g.strokeRect(1, 1, W - 2, H - 2);
        if (box) { g.strokeStyle = '#1C7ED6'; g.setLineDash([]); g.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]); }
        g.setLineDash([]);
      }
      this.last = Object.assign({ view: v, margin, patches }, r);
      if (this.onChange) this.onChange(this.last);
    }
  }

  ClipPlayer.sequence = sequence;
  ClipPlayer.clipSeconds = clipSeconds;
  ClipPlayer.naturalSeconds = naturalSeconds;
  ClipPlayer.minSeconds = minSeconds;
  ClipPlayer.fit = fit;
  ClipPlayer.EASE = EASE; ClipPlayer.DEFAULT_EASE = DEFAULT_EASE;
  root.ClipPlayer = ClipPlayer;
})(window);
