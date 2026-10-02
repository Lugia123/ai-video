// 候选 C「卷卷」：一卷纸胶带。接口与 box-buddy.js 的 createBuddy 完全一致（见 _core.js）。
import { makeBuddy, blob, poly, ellipsePts, OUT, clamp } from './_core.js';

export const META = {
  id: 'roll', name: '卷卷',
  what: '一卷紫色的纸胶带，纸芯的圆洞正好是一张永远在「哦——」的嘴，身后拖着一截撕开的胶带尾巴。',
  personality: '好奇宝宝，看什么都「哦？」，粘上一件事就不撒手。',
  features: '正圆轮廓；圆洞嘴；拖在地上的锯齿胶带尾巴。',
  vsClaude: '紫色，不是橙色；整个身子是一个圆，没有任何直边和方角；有嘴（方块小人没有）；圆手、两条腿，还多一条尾巴。',
};

const design = {
  tex: { tape: '#6C63C7', core: '#E9D3AE' },
  headTop: -148, shadowW: 250,
  legs(d) { d.stubLegs([-34, 34], 26, 'tape'); },
  body(d) {
    const { ctx, st, t, boil, fill, ink } = d;
    // 尾巴：一截撕开的胶带，末端锯齿，轻轻飘
    const w1 = 5 * Math.sin(t * 2.4), w2 = 7 * Math.sin(t * 2.4 + 1.1);
    const tail = poly([[26, -20], [78, -22 + w1], [112, -30 + w2], [106, -24 + w2], [113, -19 + w2], [106, -14 + w2], [112, -9 + w2], [78, -6 + w1], [26, -4]], 31 + boil * 7, 0.7, 40);
    fill(tail, 'tape'); ink(tail, 3.6);
    // 胶带卷
    const roll = blob(ellipsePts(0, -74, 76, 74, 26), 3 + boil * 11, 1.4);
    fill(roll, 'tape', true);
    ctx.save(); ctx.clip(roll);
    ctx.lineWidth = 2;
    for (const [r, a] of [[40, 0.2], [52, 0.16], [64, 0.2]]) {      // 一圈圈胶带的层次
      ctx.strokeStyle = `rgba(225,220,255,${a})`; ctx.beginPath(); ctx.arc(0, -66, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.beginPath(); ctx.ellipse(-30, -122, 30, 12, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ink(roll);
    // 纸芯 = 嘴：吓一跳时张大，泄气时扁
    const k = st.eyeS, flat = 1 - 0.6 * clamp(st.halfLid * 2);
    const core = blob(ellipsePts(0, -52, 19 * k, 19 * k * flat, 14), 13 + boil * 5, 0.8);
    fill(core, 'core'); ink(core, 3.4);
    ctx.fillStyle = '#3A2A20'; ctx.beginPath(); ctx.ellipse(0, -52, 10.5 * k, Math.max(2, 10.5 * k * flat), 0, 0, Math.PI * 2); ctx.fill();
    // 眼睛、腮红
    d.ovalEyes({ dx: 33, y: -92, rx: 9.5, ry: 14 });
    ctx.fillStyle = 'rgba(255,170,200,0.5)';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 50, -70, 10, 6.5, 0, 0, Math.PI * 2); ctx.fill(); }
  },
  hand(d, side, hx, hy, thumb) {
    d.arm(d.bodyPt(side * 70, -62), [hx, hy], 'tape', 8);
    if (thumb > 0.02) d.nub(hx - side * 5, hy - 13, 13, 22 * thumb, 'tape', 63 + side);
    d.mitt(hx, hy, 20, 'tape', 60 + side * 5);
  },
};

export function createBuddy(ctx, opts) { return makeBuddy(ctx, opts, design); }
