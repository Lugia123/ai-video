// 候选 A「阿线」：一只线轴。接口与 box-buddy.js 的 createBuddy 完全一致（见 _core.js）。
import { makeBuddy, blob, poly, rrectPts, OUT, RAD } from './_core.js';

export const META = {
  id: 'spool', name: '阿线',
  what: '一只绕满莓红色线的线轴，背后斜插一根针，两只手是用线牵着的木纽扣。',
  personality: '慢性子，做事一圈一圈来，从不打结。',
  features: '上下两片宽、中间一截细的工字形轮廓；斜插的针；纽扣手。',
  vsClaude: '莓红配浅木色，不是橙色；工字形（两头宽中间细）而不是一整块方块；手是圆纽扣加细线，不是方块手；两条腿。',
};

const design = {
  tex: { thread: '#C8457A', wood: '#EBD3A8', steel: '#D5D9DD' },
  headTop: -152, shadowW: 250,
  legs(d) { d.stubLegs([-34, 34], 25, 'wood'); },
  body(d) {
    const { ctx, st, t, boil, fill, ink } = d;
    // 针（在线轴后面）+ 穿过针眼垂下来的线头
    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(34, -128); ctx.lineTo(80, -192);
    ctx.lineWidth = 10; ctx.strokeStyle = OUT; ctx.stroke();
    ctx.lineWidth = 5; ctx.strokeStyle = '#DADDE0'; ctx.stroke();
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(74, -184, 2.2, 5, 36 * RAD, 0, Math.PI * 2); ctx.fill();
    const sway = 6 * Math.sin(t * 2.1);
    ctx.beginPath(); ctx.moveTo(74, -184); ctx.quadraticCurveTo(116 + sway, -176, 104 + sway * 0.6, -128);
    ctx.lineWidth = 4; ctx.strokeStyle = design.tex.thread; ctx.stroke();
    ctx.restore();

    // 线：中间一段，略鼓
    const barrel = blob(rrectPts(-60, -132, 120, 116, 20), 3 + boil * 11, 1.4);
    fill(barrel, 'thread', true);
    ctx.save(); ctx.clip(barrel);
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let y = -128, k = 0; y < -14; y += 9, k++) {
      ctx.strokeStyle = k % 3 ? 'rgba(120,20,62,0.28)' : 'rgba(255,214,230,0.3)';
      ctx.beginPath(); ctx.moveTo(-64, y + 3); ctx.lineTo(64, y - 3); ctx.stroke();
    }
    ctx.restore();
    ink(barrel);
    // 上下两片木头
    for (const [y, sd] of [[-152, 21], [-24, 27]]) {
      const f = blob(rrectPts(-96, y, 192, 25, 11), sd + boil * 11, 1.2);
      fill(f, 'wood', true); ink(f);
    }
    // 脸
    d.ovalEyes({ dx: 27, y: -82, rx: 9.5, ry: 14.5 });
    ctx.fillStyle = 'rgba(255,190,205,0.55)';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 43, -62, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); }
  },
  hand(d, side, hx, hy, thumb) {
    const { ctx } = d;
    d.arm(d.bodyPt(side * 60, -70), [hx, hy], 'thread', 4);
    if (thumb > 0.02) d.nub(hx - side * 5, hy - 14, 13, 22 * thumb, 'wood', 63 + side);
    d.mitt(hx, hy, 21, 'wood', 60 + side * 5);
    ctx.fillStyle = OUT;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + s * 6, hy, 2.6, 0, Math.PI * 2); ctx.fill(); }
  },
};

export function createBuddy(ctx, opts) { return makeBuddy(ctx, opts, design); }
