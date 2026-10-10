// puppet 的讲解员：身体锁死的一张底图 + 每个姿势一层手臂（在头后面 / 盖在头前面）+ 引擎画的头 + 三个叠加层。
//   const host = await createHost({ mount, timings, W, H, ground, size, dpr, pack, swapFx });
//   host.direct(t => state); host.draw(t); host.bbox(); host.anchors(); host.pose()
// pack = 角色数据包目录的 URL（character.json 里要有 host 字段，姿势库在 host.kit 指的目录）。
//
// 层序（从下到上）：backLayer → 身体底图 → arms（头后面的手臂）→ 头（脸、五官、贴脸层、头发、帽子；脖子也在这里面）→ over（盖在头前面的手臂和手）→ topLayer（挖掉手的地方）
// 整张立绘的姿势（kind: 'B'）：backLayer → 整图 → 眼 / 嘴 / 贴脸层 → 整图盖层 → topLayer（挖掉手的地方）
//
// state：
//   x, scale, hop, lean, nod, tilt, talk, visible, flip
//   pose        { 姿势名: 权重 }：权重最大且 > 0.5 的那个生效，否则待机。姿势名 = 姿势库 poses.json 里的键（host.poses）；旧名映射见 poses.js 的 ALIAS。
//   look        [px, py] 看向页面上一点（头转、眼珠跟）；省略 = 看镜头。attend: 'stage' | 'camera' | 'auto'（auto = 每句话最后 0.5 秒回看镜头）
//   headYaw     只转头：再加多少度（正 = 朝画面右）。总转角会被当前姿势的 headYawMax 限住。
//   expr        { happy, surprised, sad, angry }
//   eyes / mouth / brows = 'hide'；face = { eyeOpen, eyeSmile, eyeX, eyeY, irisScale, blink, browY, browTilt, mouth, mouthOpen } 直接覆盖
//   swapFx      逐帧覆盖姿势切换的手感（见 poses.js）
//
// 给表情库的挂点：
//   host.faceLayer   2D canvas，对应脸部件的矩形（.rect，部件像素），分辨率 = 矩形 × .scale。draw 之前往上画，画完置 faceLayerDirty = true；整张透明时置 faceLayerEmpty = true。
//   host.topLayer    2D canvas，W·dpr × H·dpr，和画面同坐标。画在整个人最上面，但盖在头前面的手和手臂处会被挖掉。没东西时置 topLayerEmpty = true。
//   host.backLayer   同样的约定，画在人物背后。没东西时置 backLayerEmpty = true。
//   host.anchors()   draw 之后调：{ px, head: {yaw, pitch, roll}, pose, pt: { 数据包 host.points 里的每个点 } }，CSS 像素
//
// 由早先试验版的讲解员（host-pose）整理而来（2026-10-07；整理前后成片逐帧比对过）。
import { createHead } from './head.js';
import { createBehavior, DEG } from './behavior.js';
import { createPoses } from './poses.js';

const loadImg = src => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error('加载失败 ' + src)); i.src = src; });

export async function createHost({ mount, timings, W = 1920, H = 1080, ground = 900, size = 760, dpr = 1, pack, swapFx = 'c' }) {
  if (!pack) throw new Error('createHost 要给 pack（角色数据包目录的 URL）');
  const PACK = pack.endsWith('/') ? pack : pack + '/';
  const canvas = document.createElement('canvas'); canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none`;
  mount.appendChild(canvas);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  // 头画在离屏的 WebGL 画布上（2 倍超采样）；位置固定在画布正中偏下，之后和身体套同一个整体变换贴到 2D 画布上
  const HS = 2, HEADPX = Math.round(size * dpr * 1.1), gcv = document.createElement('canvas'); gcv.width = gcv.height = HEADPX * HS;
  const ch = await createHead(PACK, { canvas: gcv });
  const C = ch.puppet.character, HO = C.host, KS = HO.kitScale ?? 1;
  if (!HO) throw new Error('数据包的 character.json 里没有 host 字段');
  const BASE = size / HO.height;                  // scale=1 时：部件像素 → CSS 像素
  const KIT = new URL(HO.kit, PACK).href;
  const POSEDB = await (await fetch(KIT + 'poses.json')).json();
  const img = { base: await loadImg(KIT + 'base.png') };
  for (const [n, p] of Object.entries(POSEDB)) for (const k of ['arms', 'over', 'full', 'handmask']) if (p[k]) img[k + '_' + n] = await loadImg(KIT + p[k]);
  await Promise.all(Object.values(img).map(i => i.decode?.().catch(() => {})));

  let script = () => ({}); const st = t => script(t) || {};
  const PZ = createPoses({ poseInfo: POSEDB, st, img, shoulders: HO.shoulders, midX: HO.midX }), { swapState, squash, armFx, SIDES, PIV, MID } = PZ;
  const yp = C.parameters.find(q => q.id === C.turn?.y?.parameter);
  const BH = createBehavior({ timings, st, swapState, poseInfo: POSEDB, yawMax: HO.yawMax ?? 24, pitchMax: (yp?.max ?? 8) * 0.94,       // 留一点余量，tanh 永远到不了上限
    geo: { W, ground, size, headUp: (HO.foot[1] - C.unit.headCenter[1]) / HO.height }, overlayOn: () => !self.faceLayerEmpty });

  // 头在离屏画布上的摆放：脚底在画布外面下方，头心落在画布中间
  const hk = dpr * HS, headPlace = sc => ({ x: gcv.width / 2, y: gcv.height * 0.56 + (HO.foot[1] - C.unit.headCenter[1]) * BASE * sc * hk, scale: BASE * sc * hk });
  let last = { t: 0, M: [1, 0, 0, 1, 0, 0], sc: 1, pose: 'idle' };
  const FLS = dpr >= 2 ? 2 : 1, faceLayer = Object.assign(document.createElement('canvas'), { width: Math.round(ch.FACE_RECT[2] * FLS), height: Math.round(ch.FACE_RECT[3] * FLS) });
  faceLayer.scale = FLS; faceLayer.rect = ch.FACE_RECT.slice();
  const mk = () => Object.assign(document.createElement('canvas'), { width: canvas.width, height: canvas.height });
  const topLayer = mk(), backLayer = mk(), scratch = mk(), sctx = scratch.getContext('2d');

  const self = {
    faceLayer, faceLayerDirty: false, faceLayerEmpty: true, topLayer, topLayerEmpty: true, backLayer, backLayerEmpty: true,
    direct(fn) { script = fn; },
    draw(t) {
      const s = st(t), sc = s.scale ?? 1, sw = swapState(t), [qx, qy] = squash(sw), flip = s.flip ? -1 : 1;
      canvas.style.opacity = s.visible === false ? 0 : 1;
      if (self.faceLayerDirty) { ch.uploadOverlay(faceLayer); self.faceLayerDirty = false; }
      const PB = POSEDB[sw.cur]?.kind === 'B' ? POSEDB[sw.cur] : null;
      // 整张立绘：只画眼、嘴和贴脸层，贴到这张图的脸上；眉、鼻、头发、帽子、脖子都是图里画好的
      const hp = headPlace(sc); ch.render(BH.headPose(t), hp, !!PB);
      // 整体变换（CSS 像素，绕脚底）：重心摆动 / lean 的旋转、呼吸和切换的挤压、身体跟着朝向的一点横向压缩
      const br = 0.5 - 0.5 * Math.cos(2 * Math.PI * t / 3.6), shift = BH.weightShift(t, s);
      const rot = ((s.lean || 0) * flip + (0.7 * Math.sin(2 * Math.PI * t / 9 + 1.3) + shift * 0.9) / DEG), ba = BH.bodyAim(t);
      const fx = s.x ?? W / 2, fy = ground - (s.hop || 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!self.backLayerEmpty) ctx.drawImage(backLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(fx, fy); ctx.rotate(rot); ctx.scale(flip * qx * (1 - 0.03 * Math.abs(ba)), qy * (1 + 0.004 * br)); ctx.translate(-fx, -fy);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const S = BASE * sc, ox = fx - HO.foot[0] * S, oy = fy - HO.foot[1] * S;                 // 部件坐标 → CSS：x·S + ox
      const put = im => { if (im) ctx.drawImage(im, ox, oy, im.width * KS * S, im.height * KS * S); };
      // 手臂层（arms / over）：每一侧绕自己的肩头转 / 缩，可以画多份（拖影）。两侧连在一起的层只用 40% 的量，免得在中线撕开
      const mode = s.swapFx ?? swapFx, FX = { L: armFx(sw, 'L', mode), R: armFx(sw, 'R', mode) };
      const putArm = (c2, key, list, sd) => { const im = img[key], si = SIDES[key]; if (!im || !si?.[sd] || !list) return; const two = si.L && si.R, k = si.joined ? 0.4 : 1, [px, py] = PIV[sd];
        for (const f of list) { c2.save(); c2.globalAlpha *= f.alpha; c2.translate(ox + px * KS * S, oy + py * KS * S); c2.rotate(f.ang * k / DEG); c2.scale(1 + (f.scale - 1) * k, 1 + (f.scale - 1) * k); c2.translate(-(ox + px * KS * S), -(oy + py * KS * S));
          if (two) { c2.beginPath(); c2.rect(ox + (sd === 'L' ? -200 : MID) * KS * S, oy - 400 * S, (MID + 200) * KS * S, (im.height + 400) * KS * S); c2.clip(); }
          c2.drawImage(im, ox, oy, im.width * KS * S, im.height * KS * S); c2.restore(); } };
      // 'a'、以及其它模式里没在切换的帧，整层直接画；切换前后那几帧每一侧按 armFx 画
      const still = f => f.cur.length === 1 && f.cur[0].ang === 0 && f.cur[0].scale === 1, plain = mode === 'a' || (still(FX.L) && still(FX.R));
      const putArms = kind => { if (plain) return put(img[kind + '_' + sw.cur]); for (const sd of ['L', 'R']) putArm(ctx, kind + '_' + sw.cur, FX[sd].cur, sd); };
      const hw = gcv.width / hk, hx = fx - hp.x / hk, hy = fy - hp.y / hk;        // 头：离屏画布上的 (hp.x, hp.y) 是脚底
      if (PB) {
        put(img['full_' + sw.cur]);
        // 头部坐标 c → 这张图里的位置 L·c + T（角色坐标）。页面上：p' = L·p + (o − L·o + S·T)
        const [a, b, c2, d] = PB.face.L, [tx, ty] = PB.face.T;
        ctx.save(); ctx.transform(a, b, c2, d, ox - (a * ox + c2 * oy) + S * tx, oy - (b * ox + d * oy) + S * ty); ctx.drawImage(gcv, hx, hy, hw, hw); ctx.restore();
      } else { put(img.base); putArms('arms'); ctx.drawImage(gcv, hx, hy, hw, hw); }
      const M = ctx.getTransform();
      if (PB) put(img['over_' + sw.cur]); else putArms('over');
      // 最上层：画在整个人上面，但「盖在头前面的手和手臂」处挖掉（整张立绘 = 烘焙时算的手 + 袖子遮罩）。帽子和头发不挖。
      if (!self.topLayerEmpty) {
        sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'source-over'; sctx.clearRect(0, 0, scratch.width, scratch.height); sctx.drawImage(topLayer, 0, 0);
        const mask = PB ? img['handmask_' + sw.cur] : img['over_' + sw.cur];
        if (mask) { sctx.globalCompositeOperation = 'destination-out'; sctx.setTransform(M);
          if (PB || plain) sctx.drawImage(mask, ox, oy, mask.width * KS * S, mask.height * KS * S);
          else for (const sd of ['L', 'R']) putArm(sctx, 'over_' + sw.cur, FX[sd].cur.slice(-1), sd); }          // 挖洞跟着转动 / 缩放后的手臂本体走（不含拖影）
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(scratch, 0, 0); ctx.setTransform(M);
      }
      // 回归检查用：这一帧画了哪些手臂层、怎么摆的（屏幕空间的手遮罩、去掉手臂后比身体，都靠它）
      last = { t, M: [M.a / dpr, M.b / dpr, M.c / dpr, M.d / dpr, M.e / dpr, M.f / dpr], sc, pose: sw.cur, hx, hy, hk, S, ox, oy, plain, swap: sw };
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    bbox() {
      const w = canvas.width, h = canvas.height, d = ctx.getImageData(0, 0, w, h).data; let x0 = w, x1 = -1, y0 = h, y1 = -1;
      for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (d[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return x1 < 0 ? null : { x0: x0 / dpr, x1: x1 / dpr, y0: y0 / dpr, y1: y1 / dpr };
    },
    anchors() {
      const [a, b, c, d, e, f] = last.M;
      const P = ([x, y, layer]) => { const p = ch.headPoint(x, y, layer), lx = last.hx + p[0] / last.hk, ly = last.hy + p[1] / last.hk; return { x: a * lx + c * ly + e, y: b * lx + d * ly + f }; };
      return { px: BASE * last.sc, head: { ...ch.headAngles }, pose: last.pose, pt: Object.fromEntries(Object.entries(HO.points).map(([k, v]) => [k, P(v)])) };
    },
    pose: () => last.pose, hands: () => null,
    // 回归检查用：把某一层（'base' | 'arms' | 'over'，当前姿势的）按这一帧的摆放单独画到一张和画面同尺寸的画布上
    layerMask(kind) {
      const c = mk(), g = c.getContext('2d'), key = kind === 'base' ? 'base' : kind + '_' + last.pose, im = img[key]; if (!im) return c;
      const [a, b, c2, d, e, f] = last.M; g.setTransform(a * dpr, b * dpr, c2 * dpr, d * dpr, e * dpr, f * dpr);
      g.drawImage(im, last.ox, last.oy, im.width * KS * last.S, im.height * KS * last.S); return c;
    },
    impl: 'puppet', poses: Object.keys(POSEDB), poseInfo: POSEDB, canvas, character: C,
  };
  return self;
}
