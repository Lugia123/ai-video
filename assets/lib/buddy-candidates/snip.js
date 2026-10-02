// 候选 B「咔咔」：一把剪刀。接口与 box-buddy.js 的 createBuddy 完全一致（见 _core.js）。
import { makeBuddy, blob, poly, ellipsePts, OUT, RAD, clamp } from './_core.js';

export const META = {
  id: 'snip', name: '咔咔',
  what: '一把会走路的剪刀：两个指环是它的大眼睛，两片刀刃像耳朵一样竖在头顶。',
  personality: '急性子，想到就动手，高兴和害怕全写在两片「耳朵」上。',
  features: '两个圆环加头顶 V 字刀刃的轮廓；刀刃会随情绪张开、耷拉；铆钉是鼻子。',
  vsClaude: '炭黑配银灰，不是橙色；由两个圆环和两片尖刃组成，没有方块身子；眼睛是环里的大白眼而不是小黑块；两条腿。',
};

const R = 44, HOLE = 27, CX = 43, CY = -46, PIVOT = -98;
const design = {
  tex: { handle: '#4A4453', steel: '#DCE1E6', white: '#FFFCF5' },
  headTop: -184, shadowW: 270, qx: 78,
  legs(d) { d.stubLegs([-43, 43], 25, 'handle'); },
  body(d) {
    const { ctx, st, t, boil, fill, ink } = d;
    // 刀刃：平时微张；吓一跳时竖直张大，泄气时往两边耷拉，疑问时一高一低
    const hl = clamp(st.halfLid * 2), ex = clamp(st.exclaim), q = clamp(st.question);
    for (const side of [-1, 1]) {
      const ang = side * (17 + 13 * ex + 48 * hl) + (side === 1 ? 20 * q : -6 * q) + side * 2 * Math.sin(t * 2.3 + side);
      ctx.save();
      ctx.translate(0, PIVOT); ctx.rotate(ang * RAD);
      const blade = poly([[-side * 14, 10], [side * 13, 8], [side * 11, -52], [side * 1, -86], [-side * 8, -56]], 30 + side + boil * 7, 0.9, 24);
      fill(blade, 'steel', true);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(side * 5, -2); ctx.lineTo(side * 4, -50); ctx.stroke();
      ink(blade, 4);
      ctx.restore();
    }
    // 两个指环之间的「脖子」
    const neck = poly([[-30, -74], [30, -74], [10, PIVOT - 8], [-10, PIVOT - 8]], 35 + boil * 7, 0.8);
    fill(neck, 'handle'); ink(neck, 4);
    // 指环 = 眼眶
    for (const side of [-1, 1]) {
      const ring = blob(ellipsePts(side * CX, CY, R, R, 22), 3 + side + boil * 11, 1.3);
      fill(ring, 'handle', true); ink(ring);
    }
    for (const side of [-1, 1]) {
      const hx = side * CX, hole = blob(ellipsePts(hx, CY, HOLE, HOLE, 18), 9 + side + boil * 11, 0.9);
      fill(hole, 'white');
      ctx.save(); ctx.clip(hole);
      // 瞳孔
      const px = hx + st.lookX * 1.7, py = CY + st.lookY * 1.7 + 2;
      ctx.fillStyle = '#1D1512';
      ctx.beginPath(); ctx.ellipse(px, py, 11 * st.eyeS, 14 * st.eyeS, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(px + 4, py - 6, 4 * st.eyeS, 0, Math.PI * 2); ctx.fill();
      // 眼皮：从上往下盖
      const lid = Math.max(st.blink, st.halfLid);
      if (lid > 0.02) {
        const y = CY - HOLE - 2 + lid * (HOLE * 2 + 4);
        ctx.fillStyle = d.PAT.handle; ctx.fillRect(hx - HOLE - 2, CY - HOLE - 4, HOLE * 2 + 4, y - (CY - HOLE - 4));
        ctx.strokeStyle = OUT; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(hx - HOLE - 2, y); ctx.lineTo(hx + HOLE + 2, y); ctx.stroke();
      }
      ctx.restore();
      ink(hole, 3.6);
    }
    // 铆钉 = 鼻子
    const rivet = blob(ellipsePts(0, PIVOT, 8, 8, 10), 41 + boil * 3, 0.6);
    fill(rivet, 'steel'); ink(rivet, 3.2);
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-4, PIVOT + 2); ctx.lineTo(4, PIVOT - 2); ctx.stroke();
    // 腮红
    ctx.fillStyle = 'rgba(240,150,150,0.6)';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 20, -14, 9, 5.5, 0, 0, Math.PI * 2); ctx.fill(); }
  },
  hand(d, side, hx, hy, thumb) {
    d.arm(d.bodyPt(side * 80, -52), [hx, hy], 'handle', 8);
    if (thumb > 0.02) d.nub(hx - side * 5, hy - 13, 13, 22 * thumb, 'handle', 63 + side);
    d.mitt(hx, hy, 20, 'handle', 60 + side * 5);
  },
};

export function createBuddy(ctx, opts) { return makeBuddy(ctx, opts, design); }
