// 讲解员的默认行为：眨眼表、口型和说话节奏、朝向内容（句尾回看镜头）、头每一帧的姿态。都是 t 的纯函数。
// 由早先试验版的讲解员（host-pose）整理而来（2026-10-07，常数原样保留）。
export const DEG = 180 / Math.PI, FPS = 30;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const lerp = (a, b, k) => a + (b - a) * k;

function prng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function blinkTrack(duration, seed = 11) {
  const r = prng(seed), times = [];
  for (let t = 1.1 + r() * 1.5; t < duration; t += 2.6 + r() * 2.8) { times.push(t); if (r() < 0.16) times.push(t + 0.32); }
  return t => { let v = 0; for (const b of times) { const d = t - b; if (d > 0 && d < 0.3) v = Math.max(v, d < 0.1 ? smooth(d / 0.1) : d < 0.15 ? 1 : 1 - smooth((d - 0.15) / 0.15)); } return v; };
}
// 口型 + 说话节奏（每个字一次开合；每个分句开头一个重音，点头用）
export function speechTrack(sentences) {
  const SHAPES = ['big', 'smile', 'small', 'big', 'smile', 'small', 'big', 'small'], units = [], accents = [], sents = [];
  for (const [si, s] of sentences.entries()) {
    const parts = [...s.text].map(ch => (/[\p{P}\s]/u.test(ch) ? { len: /[，、,；：]/.test(ch) ? 0.7 : 0, v: null } : { len: 1, v: SHAPES[ch.codePointAt(0) % SHAPES.length] }));
    const total = parts.reduce((a, p) => a + p.len, 0) || 1; let t = s.start, fresh = true, last = -9;
    for (const p of parts) { const d = (s.end - s.start) * p.len / total; if (p.v) { units.push({ a: t, b: t + d, v: p.v }); if (fresh && t - last >= 1.5) { accents.push(t + d * 0.5); last = t; } fresh = false; } else if (p.len) fresh = true; t += d; }
    sents.push({ start: s.start, end: s.end, i: si });
  }
  const find = t => { let lo = 0, hi = units.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1, u = units[m]; if (t <= u.a) hi = m - 1; else if (t >= u.b) lo = m + 1; else return u; } return null; };
  return {
    mouth(t) { const u = find(t); if (!u) return null; const amp = Math.pow(Math.sin(Math.PI * (t - u.a) / (u.b - u.a)), 0.7); return amp < 0.3 ? null : { mouth: u.v, mouthOpen: 0.55 + 0.45 * amp }; },
    nod(t) { let v = 0; for (const a of accents) { const d = t - a; if (d > -0.12 && d < 0.25) v += 4 * (d < 0 ? smooth((d + 0.12) / 0.12) : 1 - smooth(d / 0.25)); } for (const s of sents) { const d = t - s.start; if (d > -0.3 && d < 0.25) v -= 1.5 * (d < 0 ? smooth((d + 0.3) / 0.3) : 1 - smooth(d / 0.25)); } return v; },
    sentence(t) { let cur = null; for (const s of sents) { if (s.start <= t + 0.4) cur = s; else break; } return cur; },
  };
}

/**
 * 默认行为。st(t) = 导演脚本这一刻的状态；swapState(t) 来自 poses.js；geo = { W, ground, size, headUp }；
 * yawMax = 日常转头上限（度）；pitchMax = 点头软限幅的上限（度）；overlayOn() = 贴脸层这一帧有没有东西。
 */
export function createBehavior({ timings, st, swapState, poseInfo, geo, yawMax, pitchMax, overlayOn }) {
  const sentences = (timings?.segments || []).flatMap(s => s.sentences || [s]);
  const speech = speechTrack(sentences), blink = blinkTrack((timings?.duration || 600) + 5, 11);
  const softLimit = (v, m) => m * Math.tanh(v / m), frameT = t => Math.round(t * FPS) / FPS;
  const { W, ground, size, headUp } = geo, YAW_MAX = yawMax;
  function aim(s, t) {
    let on = s.attend === 'camera' ? 0 : s.look ? 1 : 0;
    if (on && (s.attend ?? 'auto') === 'auto') { const c = speech.sentence(t); if (c) { const left = c.end - t; on *= 1 - 0.85 * smooth((0.55 - left) / 0.2) * smooth((left + 0.35) / 0.25); } }
    if (!s.look) return [0, 0];
    const sc = s.scale ?? 1, dx = (s.look[0] - (s.x ?? W / 2)) * (s.flip ? -1 : 1), dy = s.look[1] - (ground - headUp * size * sc);
    return [clamp(dx / 420, -1, 1) * on, clamp(-dy / 520, -1, 1) * on];
  }
  function aimSmooth(t, delay, span) { const g = [0, 0], N = 7; for (let i = 0; i < N; i++) { const tt = t - delay - span * i / (N - 1), v = aim(st(tt), tt); g[0] += v[0] / N; g[1] += v[1] / N; } return g; }
  // 身体的朝向感（−1..1）：跟着看向的方向，比头晚
  const bodyAim = t => aimSmooth(t, 0.2, 0.5)[0];

  function headPose(t) {
    const s = st(t), e = s.expr || {}, sw = swapState(t), P = poseInfo[sw.cur] || {};
    const happy = clamp(e.happy || 0), sur = clamp(e.surprised || 0), sad = clamp(e.sad || 0), ang = clamp(e.angry || 0);
    const gEye = aimSmooth(t, 0, 0.22), gHead = aimSmooth(t, 0.1, 0.42);
    const ymax = Math.min(P.headYawMax ?? YAW_MAX, YAW_MAX), B = P.kind === 'B';
    const idleYaw = 3 * Math.sin(2 * Math.PI * t / 6.5), idlePitch = 1 * Math.sin(2 * Math.PI * t / 3.5 + 1), idleRoll = 2 * Math.sin(2 * Math.PI * t / 5.5 + 2);
    const talkOn = s.talk === false ? 0 : 1, talking = talkOn ? speech.mouth(t) : null;
    let kick = 0; if (sw.since < 5) { const d = sw.since / FPS + (t - frameT(t)); kick = -1.5 * Math.exp(-d * 9) * Math.cos(d * 22); }      // 换姿势时头的小惯性
    const yaw = clamp(gHead[0] * YAW_MAX + (s.headYaw || 0) + idleYaw * (ymax / 30), -ymax, ymax), lim = ymax / YAW_MAX;
    const eyeSmile = smooth((happy - 0.3) / 0.4);
    let mouth = { mouth: 'closed', mouthOpen: lerp(1, -0.9, clamp(Math.max(sad, ang * 1.2))) };
    if (sur > 0.45) mouth = { mouth: 'small', mouthOpen: 0.8 + 0.4 * sur }; else if (happy > 0.72) mouth = { mouth: 'smile', mouthOpen: 0.9 };
    if (talking) mouth = talking;
    return {
      // 俯仰：看内容 ±3°、脚本 nod ×0.4、分句点头 3°（句首抬 1.1°）、待机 ±1°、换姿势惯性 1.5°；合计再过软限幅，
      // 上限取数据包里点头参数的范围（引擎对超限是硬夹，会把点头削成平顶）
      yaw, pitch: softLimit((gHead[1] * 3 - (s.nod || 0) * DEG * 0.4 - speech.nod(t) * 0.75 * talkOn) * Math.max(lim, 0.35) + idlePitch * lim + kick, pitchMax), roll: ((s.tilt || 0) * DEG + idleRoll) * Math.max(lim, 0.3),
      eyeX: clamp(gEye[0] * 0.9, -1, 1), eyeY: clamp(-gEye[1] * 0.7, -1, 1),
      blink: blink(t) * (1 - eyeSmile) * (1 - sur), eyeOpen: 1 + 0.22 * sur - 0.1 * sad - 0.14 * ang, eyeSmile, irisScale: 1 - 0.14 * sur,
      browY: 0.35 * happy + sur - 0.45 * ang, browTilt: clamp(0.9 * sad - 0.9 * ang, -1, 1), ...mouth,
      eyesHide: s.eyes === 'hide', mouthHide: s.mouth === 'hide' || !!P.hideMouth, browsHide: s.brows === 'hide', faceOverlayOn: overlayOn(),
      ...(B ? { yaw: 0, pitch: 0, roll: 0, browsHide: true } : {}),      // 整张立绘：头是画死的，五官不转（倾角在姿势的 face.L 里）
      ...(s.face || {}),
    };
  }
  // 每句话换一次重心（−1..1，5 个采样平滑）
  const weightShift = (t, s) => { let shift = 0; for (let i = 0; i < 5; i++) { const c = speech.sentence(t - i * 0.12); shift += (c && s.talk !== false ? (c.i % 2 ? -1 : 1) : 0) / 5; } return shift; };
  return { headPose, bodyAim, weightShift };
}
