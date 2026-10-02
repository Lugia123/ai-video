// MV 引擎入口（接口契约见 CONTRACT.md）。
//
//   <script type="importmap">{ "imports": { "three": "<到项目根>/assets/vendor/three/three.module.min.js" } }</script>
//   import { loadMV } from '<到 mv-pdoom>/engine/index.js';
//   const mv = await loadMV();                         // 读 data/audio.json + lyrics.json，建好 1920×1080 舞台
//   mv.mount(shots, { duration, offset = 0, kits });   // 或 mv.mount((T, pass) => { ...自己画... }, { duration, repeat })
//   repeat = N：同一段歌连放 N 遍（画廊对比用），画函数的第二个参数是第几遍；渲染时页面自己编好 N 遍的 WAV 交给渲染器（renderAudio）。
//
// 时间：镜头 / kit 一律用「歌曲时间」T。页面时间 t（渲染器的 seek(t)）= T − offset。
//   整首歌：offset 0，duration = mv.music.duration；做样片 / 画廊：offset = 起点秒数，渲染器自动从同一秒截音轨。
// 预览（普通打开）：点击 / 空格 播放暂停，←→ 跳 2 s，H 显示时间码；?t=秒 从这里起播；?from=&to= 在这段里循环（歌曲时间）。
// ?render=1：不放音乐、不跑 rAF，只等渲染器调 window.__video.seek(t)。
// window.__stats：每次 seek 的耗时（ms，CPU 侧提交时间 + 同步读回一个像素，等于真实 GPU 完成时间）。

import { createMusic } from './music.js';
import { createLyrics } from './lyrics.js';
import { createStage } from './stage.js';
import { createDirector } from './shots.js';

export { PALETTE, ACCENTS, doomColor } from './palette.js';
export { createMusic } from './music.js';
export { createLyrics } from './lyrics.js';
export { createStage } from './stage.js';
export { createDirector, windowOf } from './shots.js';
export { mulberry32 } from '../../../assets/lib/layer-rig.js';

const DATA = new URL('../data/', import.meta.url);
export const MUSIC_URL = new URL('../music.mp3', import.meta.url);

/** 从页面目录到 abs（同源 URL）的相对路径 —— 渲染器按「相对页面目录」解析 __video.music */
function relFromPage(abs) {
  const from = location.pathname.replace(/[^/]*$/, '').split('/').filter(Boolean);
  const to = abs.pathname.split('/').filter(Boolean);
  let k = 0;
  while (k < from.length && k < to.length - 1 && from[k] === to[k]) k++;
  return [...from.slice(k).map(() => '..'), ...to.slice(k)].join('/');
}

export async function loadMV({ base = null, width = 1920, height = 1080 } = {}) {
  const dataUrl = base ? new URL('data/', new URL(base.endsWith('/') ? base : base + '/', location.href)) : DATA;
  const get = async f => { const r = await fetch(new URL(f, dataUrl)); if (!r.ok) throw new Error(`读不到 data/${f}`); return r.json(); };
  const [audio, lyr] = await Promise.all([get('audio.json'), get('lyrics.json')]);
  const music = createMusic(audio);
  const lyrics = createLyrics(lyr);
  const stage = createStage({ width, height });
  const mv = { music, lyrics, stage, audio, width, height, fps: 30 };
  mv.mount = (shots, opts = {}) => mount(mv, shots, opts);
  return mv;
}

/** 把 music.mp3 的 [offset, offset+dur) 重复 repeat 次，编成 16 bit 立体声 WAV（给渲染器的 renderAudio 用） */
async function segmentWav(offset, dur, repeat) {
  const buf = await (await fetch(MUSIC_URL)).arrayBuffer();
  const audio = await new OfflineAudioContext(2, 44100, 44100).decodeAudioData(buf);
  const sr = audio.sampleRate, n0 = Math.round(offset * sr), n = Math.round(dur * sr), N = n * repeat;
  const L = audio.getChannelData(0), Rr = audio.getChannelData(Math.min(1, audio.numberOfChannels - 1));
  const out = new ArrayBuffer(44 + N * 4), v = new DataView(out);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + N * 4, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, N * 4, true);
  const fade = Math.round(0.006 * sr);   // 每遍首尾 6 ms 淡入淡出，接缝不爆音
  for (let k = 0, o = 44; k < N; k++, o += 4) {
    const i = k % n, g = Math.min(1, i / fade, (n - 1 - i) / fade);
    v.setInt16(o, Math.max(-1, Math.min(1, (L[n0 + i] || 0) * g)) * 32767, true);
    v.setInt16(o + 2, Math.max(-1, Math.min(1, (Rr[n0 + i] || 0) * g)) * 32767, true);
  }
  return out;
}

function mount(mv, shots, { duration = null, offset = 0, kits = {}, fps = 30, ready = null, repeat = 1 } = {}) {
  const { stage } = mv;
  const q = new URLSearchParams(location.search);
  const RENDER = q.get('render') === '1';
  duration ??= mv.music.duration - offset;
  const director = typeof shots === 'function' ? null : createDirector(shots, { mv, kits, stage });
  // repeat > 1：同一段歌 [offset, offset+duration) 连放 repeat 遍（画廊对比用）；画函数收到 (T, pass)，pass = 第几遍
  let pass = 0;
  const drawSong = director ? T => director.render(T) : T => { stage.time = T; shots(T, pass); };

  const canvas = stage.canvas;
  if (!canvas.parentNode) document.body.append(canvas);
  Object.assign(document.body.style, { margin: '0', background: '#000', overflow: 'hidden' });
  canvas.style.display = 'block';

  const gl = stage.renderer.getContext(), px = new Uint8Array(4);
  const stats = window.__stats = { frames: 0, totalMs: 0, maxMs: 0, last: 0, get avgMs() { return this.frames ? this.totalMs / this.frames : 0; } };
  const total = duration * repeat;
  const seek = t => {
    const t0 = performance.now();
    t = Math.max(0, Math.min(total, t));
    pass = Math.min(repeat - 1, Math.floor(t / duration + 1e-9));
    drawSong(t - pass * duration + offset);
    if (RENDER) gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);   // 等 GPU 画完，耗时才真实
    const ms = performance.now() - t0;
    stats.frames++; stats.totalMs += ms; stats.maxMs = Math.max(stats.maxMs, ms); stats.last = ms;
  };
  window.__video = { width: mv.width, height: mv.height, fps, duration: total, seek, music: relFromPage(MUSIC_URL), musicOffset: offset, ready, director };
  if (repeat > 1) Object.assign(window.__video, { music: null, musicOffset: 0, renderAudio: () => segmentWav(offset, duration, repeat) });

  if (RENDER) {
    canvas.style.width = `${mv.width}px`; canvas.style.height = `${mv.height}px`;
    seek(0);
    return window.__video;
  }

  // ---------- 实时预览 ----------
  const fit = () => {
    const s = Math.min(innerWidth / mv.width, innerHeight / mv.height);
    Object.assign(canvas.style, { width: `${mv.width * s}px`, height: `${mv.height * s}px`, margin: `${(innerHeight - mv.height * s) / 2}px auto 0` });
  };
  addEventListener('resize', fit); fit();
  const from = q.has('from') ? Number(q.get('from')) : null, to = q.has('to') ? Number(q.get('to')) : null;
  const startT = q.has('t') ? Number(q.get('t')) : from != null ? from : offset;
  const audio = new Audio(MUSIC_URL.href);
  audio.preload = 'auto';
  // 暂停时用自己的 cur 当时钟（元数据没到之前设 currentTime 会被浏览器重置成 0），播放时以 audio 为准
  let cur = startT, paused = true;
  const setT = T => { cur = Math.max(0, T); try { audio.currentTime = cur; } catch { /* 元数据未到，loadedmetadata 再设 */ } };
  audio.addEventListener('loadedmetadata', () => { audio.currentTime = cur; });
  setT(startT);
  const hud = document.createElement('div');
  Object.assign(hud.style, { position: 'fixed', left: '12px', bottom: '10px', color: '#F2EDE4', font: '13px/1.3 ui-monospace, Menlo, monospace', background: 'rgba(10,10,16,.7)', padding: '6px 10px', pointerEvents: 'none', whiteSpace: 'pre' });
  document.body.append(hud);
  let showHud = true, livePass = 0;
  const toggle = () => {
    if (paused) { audio.currentTime = cur; audio.play(); paused = false; }
    else { audio.pause(); cur = audio.currentTime; paused = true; }
  };
  addEventListener('click', toggle);
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') setT((paused ? cur : audio.currentTime) + (e.code === 'ArrowRight' ? 2 : -2));
    if (e.code === 'KeyH') showHud = !showHud;
    if (repeat > 1 && /^Digit[1-9]$/.test(e.code)) livePass = Math.min(repeat - 1, Number(e.code.slice(5)) - 1);   // 数字键切第几遍
  });
  const loop = () => {
    let T = paused ? cur : audio.currentTime;
    if (!paused && to != null && T >= to) { setT(from ?? offset); T = cur; }
    if (!paused && T >= offset + duration) {
      if (repeat > 1 && livePass < repeat - 1) { livePass++; setT(offset); audio.currentTime = offset; T = cur; }
      else { audio.pause(); paused = true; livePass = 0; setT(from ?? offset); T = cur; }
    }
    if (!paused) cur = T;
    seek(T - offset + livePass * duration);
    if (showHud) {
      const b = mv.music.beatAt(T), s = mv.music.sectionAt(T), line = mv.lyrics.lineAt(T);
      hud.style.display = '';
      hud.textContent = `${repeat > 1 ? `第 ${livePass + 1}/${repeat} 遍  ` : ''}${T.toFixed(2)}s  ${s.name}  bar ${mv.music.barAt(T).i}.${b.inBar + 1}  ${stats.last.toFixed(1)}ms${paused ? '  ▶ 点击 / 空格' : ''}\n${line ? line.text : ''}`;
    } else hud.style.display = 'none';
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return window.__video;
}
