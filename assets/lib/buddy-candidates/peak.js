// 候选 E「山山」：一座双峰小山。接口与 box-buddy.js 的 createBuddy 完全一致（见 _core.js）。
import { makeBuddy, blob, poly, OUT, RAD } from './_core.js';

export const META = {
  id: 'peak', name: '山山',
  what: '一座长了脚的靛蓝色小山，一高一低两个山头都戴着雪帽，高的那个山顶插着一面小旗。',
  personality: '稳重的老好人，说话慢半拍，但站在那儿就让人安心。',
  features: '一高一低双峰的 M 形轮廓；白色锯齿雪帽；山顶小旗。',
  vsClaude: '靛蓝配雪白，不是橙色；底宽顶尖的山形，左右不对称，没有方块；圆手、两条腿，头顶有旗。',
};

// 山的轮廓（身体坐标，底边在 y=0）
const OUTLINE = [[-106, 0], [-96, -22], [-52, -124], [-40, -130], [-30, -122], [-10, -86], [22, -148], [34, -156], [46, -148], [98, -22], [106, 0], [60, 3], [0, 4], [-60, 3]];
const design = {
  tex: { rock: '#3F4F9E', snow: '#FFFCF5', flag: '#F0B43C' },
  headTop: -180, shadowW: 290, qx: 92,
  legs(d) { d.stubLegs([-44, 44], 27, 'rock'); },
  body(d) {
    const { ctx, t, boil, fill, ink } = d;
    // 小旗（山后）
    ctx.save();
    ctx.lineCap = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = 3.4;
    ctx.beginPath(); ctx.moveTo(34, -150); ctx.lineTo(34, -184); ctx.stroke();
    const f = 3 * Math.sin(t * 5);
    const flag = poly([[35, -184], [60, -177 + f], [35, -168]], 44 + boil * 5, 0.5, 40);
    fill(flag, 'flag'); ink(flag, 3);
    ctx.restore();
    // 山体
    const hill = blob(OUTLINE, 3 + boil * 11, 1.3);
    fill(hill, 'rock', true);
    // 雪帽：两个山头各一块，下沿锯齿
    ctx.save(); ctx.clip(hill);
    for (const [pts, sd] of [
      [[[-80, -140], [-10, -140], [-10, -100], [-24, -108], [-34, -96], [-44, -108], [-56, -98], [-64, -110], [-80, -104]], 71],
      [[[-12, -170], [80, -170], [80, -112], [68, -122], [56, -108], [44, -124], [32, -110], [20, -124], [8, -112], [-12, -118]], 73],
    ]) {
      const snow = poly(pts, sd + boil * 7, 0.8, 30);
      fill(snow, 'snow'); ink(snow, 3.2);
    }
    ctx.restore();
    ink(hill, 4.6);
    // 脸
    d.ovalEyes({ dx: 36, y: -56, rx: 10, ry: 15, cx: 2 });
    ctx.fillStyle = 'rgba(255,170,190,0.5)';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(2 + s * 62, -38, 11, 7, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#1D1512'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(2, -40, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  },
  hand(d, side, hx, hy, thumb) {
    d.arm(d.bodyPt(side * 80, -52), [hx, hy], 'rock', 8);
    if (thumb > 0.02) d.nub(hx - side * 5, hy - 13, 13, 22 * thumb, 'rock', 63 + side);
    d.mitt(hx, hy, 20, 'rock', 60 + side * 5);
  },
};

export function createBuddy(ctx, opts) { return makeBuddy(ctx, opts, design); }
