// 候选 D「小鸢」：一只纸风筝。接口与 box-buddy.js 的 createBuddy 完全一致（见 _core.js）。
import { makeBuddy, blob, poly, ellipsePts, OUT, RAD } from './_core.js';

export const META = {
  id: 'kite', name: '小鸢',
  what: '一只绿色的菱形纸风筝，脸上交叉着两根竹骨，脚边拖着一串系了蝴蝶结的尾巴。',
  personality: '轻飘飘的乐天派，一点风就想起飞，被线拽着才肯落地讲课。',
  features: '菱形轮廓（上下各一个尖）；十字竹骨把脸分成四块深浅绿；蝴蝶结尾巴。',
  vsClaude: '绿色，不是橙色；菱形、斜边、尖角，没有一条横平竖直的边；细线胳膊加圆手、两条细腿，还拖着一串尾巴。',
};

const TOP = [0, -156], RIGHT = [92, -84], BOT = [0, -2], LEFT = [-92, -84], MID = [0, -84];
const design = {
  tex: { a: '#3FA66B', b: '#7CC796', bow: '#F2A0B4' },
  headTop: -158, shadowW: 250,
  legs(d) { d.stubLegs([-22, 22], 20, 'a'); },
  body(d) {
    const { ctx, t, boil, fill, ink } = d;
    // 尾巴：从下尖拖出去的一根线 + 三个蝴蝶结，随时间轻摆
    const pt = u => [6 + 100 * u, -6 - 14 * Math.sin(u * 3.2) + 5 * Math.sin(t * 2.6 + u * 4) * u];
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = OUT;
    ctx.beginPath(); ctx.moveTo(...BOT); for (let u = 0.1; u <= 1.001; u += 0.1) ctx.lineTo(...pt(u)); ctx.stroke();
    ctx.restore();
    [0.36, 0.68, 1].forEach((u, i) => {
      const [x, y] = pt(u);
      ctx.save(); ctx.translate(x, y); ctx.rotate((-12 + 8 * Math.sin(t * 2.6 + i)) * RAD);
      const bow = poly([[-13, -8], [0, -2], [13, -8], [13, 8], [0, 2], [-13, 8]], 50 + i * 3 + boil * 5, 0.6, 40);
      fill(bow, 'bow'); ink(bow, 3);
      ctx.restore();
    });
    // 菱形身子：四块，深浅相间
    const whole = poly([TOP, RIGHT, BOT, LEFT], 3 + boil * 11, 1.3);
    fill(whole, 'a', true);
    for (const [p, q] of [[TOP, RIGHT], [BOT, LEFT]]) { const tri = poly([MID, p, q], 5 + boil * 11, 0.4, 60); fill(tri, 'b'); }
    // 竹骨
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(58,42,32,0.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(TOP[0], TOP[1] + 6); ctx.lineTo(BOT[0], BOT[1] - 6); ctx.moveTo(LEFT[0] + 6, LEFT[1]); ctx.lineTo(RIGHT[0] - 6, RIGHT[1]); ctx.stroke();
    ctx.restore();
    ink(whole, 4.6);
    // 脸
    d.ovalEyes({ dx: 30, y: -98, rx: 9.5, ry: 14 });
    ctx.fillStyle = 'rgba(255,244,205,0.55)';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 47, -72, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#1D1512'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -72, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  },
  hand(d, side, hx, hy, thumb) {
    d.arm(d.bodyPt(side * 84, -80), [hx, hy], 'a', 4);
    if (thumb > 0.02) d.nub(hx - side * 5, hy - 13, 13, 22 * thumb, 'a', 63 + side);
    d.mitt(hx, hy, 19, 'a', 60 + side * 5);
  },
};

export function createBuddy(ctx, opts) { return makeBuddy(ctx, opts, design); }
