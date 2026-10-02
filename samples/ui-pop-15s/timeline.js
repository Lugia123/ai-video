// 共享时间轴：画面和配乐都从这里取时间，保证交互和音效对齐。
//
// 时间以"拍"为单位写，再用 B(beat) 换成秒。速度从 110 BPM 线性爬到 130 BPM（第 24 拍到顶），
// 之后保持 130。第 0–2 拍是前奏（只有光标在动），第一次点击落在第 2 拍——音乐从这一下开始。
// 小节线在第 2、6、10、14、18、22、26 拍；第 26 拍是全曲终止重拍，同时切到收尾画面。

export const DURATION = 15;
export const FPS = 30;
export const BPM0 = 110, BPM1 = 130, RAMP = 24;
const K = (BPM1 - BPM0) / RAMP;               // 每拍增加的 BPM
const B_RAMP = (60 / K) * Math.log(BPM1 / BPM0);

/** 第 x 拍（可带小数）对应的秒数：对 60/bpm(u) 积分 */
export function B(x) {
  if (x <= RAMP) return (60 / K) * Math.log((BPM0 + K * x) / BPM0);
  return B_RAMP + (x - RAMP) * 60 / BPM1;
}

// 镜头：[b0, b1)
export const SHOTS = [
  { id: 'button',  b0: 0,  b1: 6 },   // 光标 hover → 点击 → 按钮回弹 + 进度
  { id: 'chat',    b0: 6,  b1: 10 },  // 逐字输入 → 发送 → 正在输入… → 回复
  { id: 'post',    b0: 10, b1: 13 },  // 点赞数狂跳 + 转发
  { id: 'code',    b0: 13, b1: 16 },  // 打字 + 补全弹出 + Tab Tab Tab
  { id: 'dials',   b0: 16, b1: 18 },  // 拖滑块 → 下载条提速 + 两个开关
  { id: 'palette', b0: 18, b1: 20 },  // ⌘K 命令面板搜索 → 回车 → 通知堆叠
  { id: 'chart',   b0: 20, b1: 22 },  // 图表实时长高 + 拖拽窗口
  { id: 'burst',   b0: 22, b1: 26 },  // 六窗口平铺，同时爆发
  { id: 'end',     b0: 26, b1: Infinity },
];

// 交互事件（拍）
export const EV = {
  A: { hover: 1.25, click: 2, done: 4 },
  B: { type: [6.2, 7.3], text: 'make it faster', send: 7.75, dots: [8.0, 8.95], reply: 9.0 },
  C: { like: 10.5, count: [10.5, 12.7], repost: 11.5, words: [11, 11.5, 12] },
  D: { type: [13.0, 13.4], text: 'const v = acc', popup: 13.45, sel: [13.7, 13.85], tabs: [14, 14.5, 15], ghosts: [14.1, 14.6] },
  E: { grab: 16.25, release: 16.9, toggles: [17.25, 17.6], word: 17 },
  F: { keys: 18.25, type: [18.35, 18.7], text: 'ship', enter: 18.85, toasts: [19, 19.25, 19.5, 19.75] },
  G: { grab: 20.25, release: 21.0, bars: 12, toasts: [21.25, 21.5] },
  X: {
    snap: 22,
    clicks: [22.5, 23, 23.5, 24, 24.5, 25, 25.25, 25.5, 25.75],
    targets: [1, 3, 0, 4, 5, 2, 1, 3, 0],     // 点在哪个窗口（平铺顺序）
    words: [22, 23, 24],
    toasts: [24, 24.25, 24.5, 24.75, 25, 25.25, 25.5],
    msgs: [22.25, 22.75, 23.25, 23.75, 24.25, 24.75, 25.25, 25.75],
  },
  Z: { hit: 26, click: 28 },
};

// 无状态哈希 → [-1, 1)
export function hash(a, b = 0) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296 * 2 - 1;
}

/** 逐字输入：每个字符落下的拍（等分 + 轻微人手抖动，保持单调） */
export function typeBeats(text, b0, b1, seed = 0) {
  const n = text.length, slot = (b1 - b0) / n;
  return Array.from(text, (_, i) => b0 + slot * (i + 0.5 + 0.3 * hash(i, seed + n)));
}

// ---------- 音效事件表（music.js 合成，画面用同样的拍） ----------
export const SFX = (() => {
  const s = [];
  const add = (b, kind, p = {}) => s.push({ b, t: B(b), kind, ...p });
  const { A, B: Bc, C, D, E, F, G, X, Z } = EV;

  add(A.hover, 'hover');
  add(A.click, 'click');
  add(A.done, 'ding', { m: 84 });

  typeBeats(Bc.text, ...Bc.type, 1).forEach(b => add(b, 'key'));
  add(Bc.send, 'click'); add(Bc.send + 0.05, 'send');
  add(Bc.reply, 'ding', { m: 88 });

  add(C.like, 'click'); add(C.like, 'pop');
  for (let b = C.count[0] + 0.125, i = 0; b < C.count[1]; b += 0.125, i++) add(b, 'tick', { p: i / 16 });
  add(C.repost, 'click'); add(C.repost, 'pop', { up: 1 });

  typeBeats(D.text, ...D.type, 2).forEach(b => add(b, 'key'));
  add(D.popup, 'pop', { soft: 1 });
  D.sel.forEach(b => add(b, 'key'));
  D.tabs.forEach((b, i) => add(b, 'tab', { i }));

  add(E.grab, 'click');
  for (let b = E.grab + 0.0625, i = 0; b < E.release; b += 0.0625, i++) add(b, 'ratchet', { p: i / 10 });
  add(E.release, 'click', { v: 0.5 });
  E.toggles.forEach(b => add(b, 'toggle'));

  add(F.keys, 'key'); add(F.keys + 0.02, 'whoosh');
  typeBeats(F.text, ...F.type, 3).forEach(b => add(b, 'key'));
  add(F.enter, 'enter');
  F.toasts.forEach((b, i) => add(b, 'ding', { m: [84, 88, 91, 96][i] }));

  add(G.grab, 'click');
  add(G.release, 'snap');
  G.toasts.forEach((b, i) => add(b, 'ding', { m: [91, 96][i] }));

  add(X.snap, 'snap', { big: 1 });
  X.clicks.forEach(b => add(b, 'click'));
  X.toasts.forEach((b, i) => add(b, 'ding', { m: [84, 88, 91, 93, 96, 100, 103][i], v: 0.7 }));
  X.msgs.forEach(b => add(b, 'pop', { soft: 1 }));

  add(Z.click, 'click'); add(Z.click, 'ding', { m: 96 });
  return s.sort((a, b) => a.t - b.t);
})();
