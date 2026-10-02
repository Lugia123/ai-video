// 全片配色（TREATMENT §2）：墨黑底 + 她衣服上的三色 + 纸白；冷蓝只给「Orthogonality thesis blues」一个镜头。
export const PALETTE = {
  ink: '#0A0A10',
  pink: '#FF2E88',
  mint: '#5FE3C0',
  lemon: '#F4E04D',
  paper: '#F2EDE4',
  blue: '#3A6BFF',
};
export const { ink, pink, mint, lemon, paper, blue } = PALETTE;

/** 副歌重拍整屏色底的轮换顺序 */
export const ACCENTS = [pink, mint, lemon];

/** P(doom) 数值 → 颜色：薄荷 → 柠黄 → 霓粉 → 白热（>0.95）。返回 CSS hex */
export function doomColor(p) {
  const stops = [[0, mint], [0.3, lemon], [0.7, pink], [0.95, '#FFF4F8']];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) if (p >= stops[i][0] && p <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
  if (p > stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  const k = (p - a[0]) / Math.max(1e-6, b[0] - a[0]);
  const [r, g, bl] = hex(a[1]).map((v, i) => Math.round(v + (hex(b[1])[i] - v) * k));
  return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('');
}
