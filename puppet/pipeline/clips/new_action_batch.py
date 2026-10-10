#!/usr/bin/env python3
"""新动作的两遍法批量：读一份清单（JSON），对每个「动作 × 种子」顺序走完 A 遍 → 控制视频 → B 遍 → 登记到 two_pass 命令。

    cd puppet
    python3 pipeline/clips/new_action_batch.py pipeline/clips/batches/<清单>.json --dry-run                 # 只打印每步命令和预计耗时，不发任何请求、不写任何文件
    python3 pipeline/clips/new_action_batch.py <清单>.json [--only nod,clap] [--seeds-per-action 1] [--resume] [--order item|phase]
    python3 pipeline/clips/new_action_batch.py <清单>.json --prompts                                        # 只打印每个动作 A / B 两份提示词原文

每条（<动作>-s<种子>）的步骤，产物都在清单的 work 目录下（素材不入库）：
  a_gen   提交 A 遍 /img2video：首帧 = 尾帧 = 有五官归位帧（品红底），A 提示词           → raw/<动作>-A-<档>-s<种子>.mp4 + .json
  a_key   键色抠图（clips-blank/gen/03_key.py 的做法）：颜色对有五官归位帧校，首末帧换成它 → frames/<动作>-A-…/NN.png + readings/….key.json
  ctl     pipeline/clips/control_video.py：线稿擦掉眼眉嘴（极性按清单，已入库的几条都是黑底白线）→ ctl/<动作>-s<种子>-A-<style>-line-noface.mp4
  b_gen   提交 B 遍 /control2video：参考图 = 空脸归位帧（品红底）+ 控制视频，B 提示词     → raw/<动作>-B-<档>-s<种子>.mp4 + .json
  b_key   键色抠图：首末帧换成空脸归位帧                                               → frames/<动作>-B-…/NN.png
  登记    全部跑完后写 <work>/two_pass_cmd.sh（two_pass.py + accept_render.py 的整条命令，含所有 B 抠好了的条目）；不自动执行，留给人挑完种子再跑。

--order item（默认）：一条走完再走下一条。phase：先发完全部 A 遍，再本机抠图 / 控制视频，再发全部 B 遍（A、B 是两套模型，这样服务只换一次）。
--resume：产物已经在的步骤跳过。不带 --resume 时只要发现已有产物就停，不覆盖。
--est a_gen=120,b_gen=210：覆盖清单里的预计耗时（秒），只影响打印的估计。
--select-by track_fail：每个动作抽多个种子时，先把全部 A 遍、抠图、控制视频做完，读 control_video.py 自己写的 <ctl>/…-report.json，
  每个动作只留 track_fail 帧数最少的那一条（并列时依次比 miserase 最大值、residual 最大值、种子号小的），只有它进 B 遍；结果写 <work>/selection.json。
  不改 control_video.py，只读它的报告。自动带 --order phase。
--pick 动作=种子[,动作=种子]：人看过原始帧后指定某个动作用哪个种子，盖过 track_fail 的排序（selection.json 里记 picked_by=manual）。
--stop-after ctl：做到控制视频为止（不发 B 遍）。配合 --select-by 分两步跑：先 --stop-after ctl，看帧，再 --resume --select-by track_fail [--pick …]。
服务地址和令牌：用 tools/imggen/client.py 的取法（环境变量 IMGGEN_URL / IMGGEN_TOKEN → ~/.config/imggen/token → 服务器上的令牌文件），
只放进子进程环境，不打印、不写文件。--dry-run / --prompts 不取令牌、不连服务。提交走 pipeline/clips/imggen.py（排队规矩在它里面）。
一条的生成步骤失败（服务报错）就整批停下；本机步骤失败只跳过这一条剩下的步骤。"""
import argparse, json, os, shlex, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__)); PUPPET = os.path.normpath(os.path.join(HERE, '..', '..')); REPO = os.path.normpath(os.path.join(PUPPET, '..'))
STEPS = ('a_gen', 'a_key', 'ctl', 'b_gen', 'b_key'); GEN = ('a_gen', 'b_gen')
PHASES = (('a_gen',), ('a_key', 'ctl'), ('b_gen',), ('b_key',))


def key_clip(mp4, home_rgba, out_dir, readings, ends_rgba=None):
    """和 clips-blank/gen/03_key.py 同一套：品红程度 m = min(R,B) − G 直接算 alpha，外轮廓 3px 带内反预乘和去溢色；
    首帧、末帧各自对归位帧 home_rgba 拟合逐通道三次曲线，中间帧按位置插值；最后首末帧换成 ends_rgba（不给 = home_rgba）原图。只写帧和读数，不出 contact 图。"""
    import cv2, numpy as np
    from scipy import ndimage as ndi
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout.strip().split(','))
    fr = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout, np.uint8).reshape(-1, h, w, 3).astype(np.float32); n = len(fr)

    def key(f):
        bg = np.median(np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)]), 0)
        m = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]; mb = min(bg[0], bg[2]) - bg[1]
        a = 1 - np.clip((m - 0.12 * mb) / (0.62 * mb), 0, 1)
        solid = a > 0.98; band = ndi.binary_dilation(~solid, iterations=3) & (a > 0)
        aa = np.clip(a, 0.25, 1)[..., None]; c = np.where((band & ~solid)[..., None], (f - bg * (1 - aa)) / aa, f)
        lim = c[..., 1] + 12
        for ch in (0, 2):
            over = band & (np.minimum(c[..., 0], c[..., 2]) > lim); c[..., ch] = np.where(over, np.minimum(c[..., ch], lim), c[..., ch])
        a[a < 0.04] = 0
        return np.dstack([np.clip(c, 0, 255), a * 255]).astype(np.uint8)

    home = cv2.cvtColor(cv2.imread(home_rgba, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)
    if home.shape[:2] != (h, w): home = cv2.resize(home, (w, h), interpolation=cv2.INTER_AREA)
    rgba = [key(f) for f in fr]

    def diff(a, b):   # [两边都不透明处的平均色差, 轮廓不一致的像素占全画幅 %]
        both = (a[..., 3] > 128) & (b[..., 3] > 128); d = np.abs(a[..., :3].astype(float) - b[..., :3].astype(float)).mean(2)
        return [round(float(d[both].mean()), 2), round(float(((a[..., 3] > 128) != (b[..., 3] > 128)).mean() * 100), 3)]

    def fit(a, b):
        both = ndi.binary_erosion((a[..., 3] > 250) & (b[..., 3] > 250), iterations=3)
        A = cv2.GaussianBlur(a[..., :3], (0, 0), 2)[both].astype(np.float64); B = cv2.GaussianBlur(b[..., :3], (0, 0), 2)[both].astype(np.float64)
        return [np.polyfit(A[:, c], B[:, c], 3) for c in range(3)]

    def apply(f, c0, c1, k):
        o = f.copy().astype(np.float64)
        for c in range(3): o[..., c] = np.polyval(c0[c], o[..., c]) * (1 - k) + np.polyval(c1[c], o[..., c]) * k
        return np.clip(o, 0, 255).astype(np.uint8)

    info = {'clip': os.path.basename(out_dir), 'frames': n, 'fps': 16, 'size': [w, h], 'home': os.path.basename(home_rgba)}
    info['raw_first_vs_home'] = diff(rgba[0], home); info['raw_last_vs_home'] = diff(rgba[-1], home)
    c0, c1 = fit(rgba[0], home), fit(rgba[-1], home)
    rgba = [apply(f, c0, c1, i / (n - 1)) for i, f in enumerate(rgba)]
    info['matched_first_vs_home'] = diff(rgba[0], home); info['matched_last_vs_home'] = diff(rgba[-1], home)
    info['matched_second_vs_home'] = diff(rgba[1], home); info['matched_penult_vs_home'] = diff(rgba[-2], home)
    info['sil_vs_home_pct'] = [diff(f, home)[1] for f in rgba]
    mo = [0.0] + [round(float(((rgba[i][..., 3] > 128) != (rgba[i - 1][..., 3] > 128)).mean() * 100), 3) for i in range(1, n)]
    info['motion'] = mo; thr = max(0.2 * max(mo), 0.06); act = [i for i, v in enumerate(mo) if v > thr]
    info['motion_frames'] = {'threshold': round(thr, 3), 'first': act[0] if act else None, 'last': act[-1] if act else None, 'count': len(act)}
    mg = []
    for f in rgba:   # 留白：人物包围盒（alpha > 128，去掉 < 12 像素的散点）到四边的距离
        m = f[..., 3] > 128; lab, k = ndi.label(m)
        if k: sz = ndi.sum(m, lab, range(1, k + 1)); m = np.isin(lab, 1 + np.where(sz >= 12)[0])
        ys, xs = np.where(m); mg.append([int(xs.min()), int(ys.min()), int(w - 1 - xs.max()), int(h - 1 - ys.max())] if len(xs) else [0, 0, 0, 0])
    mg = np.array(mg); info['margin_px_LTRB_per_frame'] = mg.tolist()
    info['margin_min'] = {s: {'px': int(mg[:, i].min()), 'frame': int(mg[:, i].argmin())} for i, s in enumerate(('left', 'top', 'right', 'bottom'))}
    info['touches_edge_frames'] = [int(i) for i in np.where(mg.min(1) <= 2)[0]]
    info['magenta_left_max'] = max(int(((np.minimum(f[..., 0].astype(int), f[..., 2]) - f[..., 1] > 40) & (f[..., 3] > 200)).sum()) for f in rgba)
    if ends_rgba: home = cv2.cvtColor(cv2.imread(ends_rgba, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA); info['ends'] = os.path.basename(ends_rgba)
    rgba[0], rgba[-1] = home, home
    os.makedirs(out_dir, exist_ok=True); os.makedirs(os.path.dirname(readings), exist_ok=True)
    for i, f in enumerate(rgba): cv2.imwrite(f'{out_dir}/{i:02d}.png', cv2.cvtColor(f, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_PNG_COMPRESSION, 6])
    json.dump(info, open(readings, 'w', encoding='utf-8'), ensure_ascii=False)
    return info


def fmt(sec): return f'{sec / 60:.1f} 分钟' if sec >= 90 else f'{sec:.0f} 秒'


class Batch:
    def __init__(self, a):
        self.a = a; self.m = m = json.load(open(a.manifest, encoding='utf-8')); self.work = m['work']; self.W, self.H = m['canvas']
        self.est = dict(m['estimateSeconds']); self.est.pop('_note', None)
        for kv in (a.est.split(',') if a.est else []): k, v = kv.split('='); self.est[k] = float(v)
        only = a.only.split(',') if a.only else None; ids = [x['id'] for x in m['actions']]
        if only and set(only) - set(ids): sys.exit(f'清单里没有这些动作：{sorted(set(only) - set(ids))}（有 {ids}）')
        self.items = [(x, s) for x in m['actions'] if not only or x['id'] in only for s in x['seeds'][:a.seeds_per_action or None]]

    # —— 名字和路径（都相对 puppet/）
    def n(self, act, seed, p): return f"{act['id']}-{p}-{self.m['tier']}-s{seed}"
    def raw(self, act, seed, p, ext='.mp4'): return f"{self.work}/raw/{self.n(act, seed, p)}{ext}"
    def frames(self, act, seed, p): return f"{self.work}/frames/{self.n(act, seed, p)}"
    def reading(self, act, seed, p): return f"{self.work}/readings/{self.n(act, seed, p)}.key.json"
    def ctl_name(self, act, seed): return f"{act['id']}-s{seed}-A"
    def ctl(self, act, seed, kind=None): c = self.m['control']; return f"{self.work}/ctl/{self.ctl_name(act, seed)}-{c['style']}-{kind or c['variant']}" + ('.mp4' if not kind else '')
    def pfile(self, act, p): return f"{self.work}/prompts/{act['id']}.{p}.txt"
    def prompt(self, act, p): P = self.m['prompt']; return P['head'] + act['motion'] + (act.get('face' + p) or P['face' + p]) + act['still'] + P['tail']   # 动作可以自带 faceA / faceB，盖过清单的通用写法

    def done(self, act, seed, step):
        ex = lambda p: os.path.exists(os.path.join(PUPPET, p)); N = self.m['frames']
        full = lambda d: os.path.isdir(os.path.join(PUPPET, d)) and len([f for f in os.listdir(os.path.join(PUPPET, d)) if f.endswith('.png')]) == N
        if step in GEN: p = step[0].upper(); return ex(self.raw(act, seed, p)) and ex(self.raw(act, seed, p, '.json'))
        if step == 'ctl': return ex(self.ctl(act, seed)) and ex(self.ctl(act, seed, 'report') + '.json')
        p = step[0].upper(); return full(self.frames(act, seed, p)) and ex(self.reading(act, seed, p))

    def cmd(self, act, seed, step):
        """这一步等价的命令（相对 puppet/）。生成两步真的这样起子进程；a_key / b_key 在本进程里调 key_clip，这里给的是同样参数的单步命令。"""
        m = self.m; h = m['home']; size = ['--frames', str(m['frames']), '--width', str(self.W), '--height', str(self.H), '--seed', str(seed), '--tier', m['tier']]
        if step == 'a_gen': return [self.a.net_python, 'pipeline/clips/imggen.py', 'i2v', '--image', h['faceMagenta'], '--end', h['faceMagenta'], '--prompt-file', self.pfile(act, 'A')] + size + ['--out', self.raw(act, seed, 'A'), '--record', self.raw(act, seed, 'A', '.json')]
        if step == 'b_gen': return [self.a.net_python, 'pipeline/clips/imggen.py', 'ctrl', '--image', h['blankMagenta'], '--control', self.ctl(act, seed), '--prompt-file', self.pfile(act, 'B')] + size + ['--out', self.raw(act, seed, 'B'), '--record', self.raw(act, seed, 'B', '.json')]
        if step == 'ctl': return [sys.executable, 'pipeline/clips/control_video.py', self.raw(act, seed, 'A'), '--ref-face', h['faceMagenta'], '--ref-blank', h['blankMagenta'], '--out', f'{self.work}/ctl', '--name', self.ctl_name(act, seed), '--style', m['control']['style'], '--polarity', m['control']['polarity']]
        p = step[0].upper(); fit = h[h.get('aFit', 'faceRgba')] if p == 'A' else h['blankRgba']; ends = [h['faceRgba']] if p == 'A' and fit != h['faceRgba'] else []
        return [sys.executable, 'pipeline/clips/new_action_batch.py', '--key', self.raw(act, seed, p), fit, self.frames(act, seed, p), self.reading(act, seed, p)] + ends

    def clip_spec(self, act, seed): return f"{act['id']}_s{seed}_loop={self.frames(act, seed, 'B')}:{self.frames(act, seed, 'A')},label={act['label']}·s{seed}"

    def two_pass_cmds(self, items):
        m = self.m; L = m['lib']; h = m['home']
        tp = ['python3', 'pipeline/clips/two_pass.py', m['character'], L['name'], '--like', L['like'], '--dress-from', L['dressFrom'], '--home', h['blankRgba'], '--orig-home', h['faceRgba'], '--rest-a', h['faceRgba']] + (['--per-feature'] if L.get('perFeature') else [])
        for act, seed in items: tp += ['--clip', self.clip_spec(act, seed)]
        return tp, ['python3', 'pipeline/clips/accept_render.py', f"{m['character']}/{L['name']}", L['acceptOut']]

    def tasks(self, phases=PHASES):
        if self.a.order == 'phase': return [(act, seed, st) for ph in phases for act, seed in self.items for st in ph]
        return [(act, seed, st) for act, seed in self.items for st in STEPS]

    def track_fail(self, act, seed):
        """读 control_video.py 写的报告，和它自己打印的那行同一算法。没有报告 → None。"""
        p = os.path.join(PUPPET, self.ctl(act, seed, 'report') + '.json')
        if not os.path.exists(p): return None
        rows = json.load(open(p, encoding='utf-8'))['rows']; bad = [r for r in rows if r['track_fail'] or r.get('sim_fail')]
        return {'seed': seed, 'track_fail': len(bad), 'fail_frames': {k: [r['t'] for r in rows if k in r['track_fail']] for k in sorted({x for r in rows for x in r['track_fail']})},
                'miserase_max': max(r['miserase_px'] for r in rows), 'residual_max': max(r['residual_px'] for r in rows)}

    def select(self):
        """每个动作挑一条进 B 遍。返回 (选中的 [(act, seed)], 记录 dict)；有动作的报告不齐 → (None, 记录)。"""
        pick = dict(kv.split('=') for kv in self.a.pick.split(',')) if self.a.pick else {}; rec = {}; chosen = []; acts = {}
        for act, seed in self.items: acts.setdefault(act['id'], (act, []))[1].append(seed)
        if set(pick) - set(acts): sys.exit(f'--pick 里的动作不在这次要跑的里面：{sorted(set(pick) - set(acts))}')
        for aid, (act, seeds) in acts.items():
            c = [self.track_fail(act, s) for s in seeds]
            if any(x is None for x in c): rec[aid] = {'candidates': c, 'selected': None}; continue
            if aid in pick:
                if int(pick[aid]) not in seeds: sys.exit(f'--pick {aid}={pick[aid]}：这个动作的种子是 {seeds}')
                sel = int(pick[aid]); by = 'manual'
            else: sel = min(c, key=lambda x: (x['track_fail'], x['miserase_max'], x['residual_max'], x['seed']))['seed']; by = 'track_fail'
            rec[aid] = {'candidates': c, 'selected': sel, 'picked_by': by}; chosen.append((act, sel))
        return (chosen if len(chosen) == len(acts) else None), rec

    def step_est(self, step): return self.est[step] + (self.est['submit_wait'] if step in GEN else 0)

    def check_inputs(self):
        bad = [p for k, p in self.m['home'].items() if k not in ('aFit', '_note') and not os.path.exists(os.path.join(PUPPET, p))]
        bad += [p for p in ('pipeline/clips/imggen.py', 'pipeline/clips/control_video.py', 'pipeline/clips/two_pass.py', 'pipeline/clips/accept_render.py', '../tools/imggen/client.py') if not os.path.exists(os.path.join(PUPPET, p))]
        L = self.m['lib']; bad += [f"{self.m['character']}/{L[k]}/{f}" for k, f in (('like', 'clips.json'), ('dressFrom', 'dress.json')) if not os.path.exists(os.path.join(PUPPET, self.m['character'], L[k], f))]
        if os.path.exists(os.path.join(PUPPET, self.m['character'], L['name'])): bad.append(f"{self.m['character']}/{L['name']} 已经存在（two_pass 会往里写）")
        if self.m['frames'] % 4 != 1: bad.append(f"frames={self.m['frames']} 不是 4n+1")
        return bad

    def dry(self):
        m = self.m; a = self.a
        print(f"# 干跑：不发请求、不取令牌、不写文件。清单 {os.path.relpath(a.manifest, PUPPET)}")
        print(f"# {len({x['id'] for x, _ in self.items})} 个动作 × 种子 = {len(self.items)} 条；{m['frames']} 帧 @ {m['fps']}fps = {m['frames'] / m['fps']:.2f} 秒，{self.W}×{self.H}，{m['tier']} 档；顺序 {a.order}；工作目录 {self.work}")
        bad = self.check_inputs(); print('# 本机输入检查：' + ('都在' if not bad else '缺 / 有问题 → ' + '；'.join(bad)))
        print(f"# 预计耗时（秒）：{json.dumps(self.est)}；生成步骤每次另加 submit_wait")
        tot = {s: 0.0 for s in STEPS}; skip = 0; last = None; phases = PHASES[:2] if a.select_by or a.stop_after else PHASES
        for act, seed, st in self.tasks(phases):
            key = (act['id'], seed) if a.order == 'item' else st
            if key != last:
                print(f"\n## {act['id']}-s{seed}（{act['label']}，种子 {seed}）" if a.order == 'item' else f"\n## 阶段 {st}"); last = key
                if a.order == 'item': print(f"   提示词 A {len(self.prompt(act, 'A'))} 字 → {self.pfile(act, 'A')}；B {len(self.prompt(act, 'B'))} 字 → {self.pfile(act, 'B')}")
            d = self.done(act, seed, st)
            if d and a.resume: skip += 1; print(f"[{st}] 已有产物，跳过"); continue
            tot[st] += self.step_est(st)
            print(f"[{st}] 约 {fmt(self.step_est(st))}" + ('  ！已有产物，不带 --resume 会在这里停' if d else '') + f"\n  {shlex.join(self.cmd(act, seed, st))}")
        reg = self.items
        if a.select_by and not a.stop_after:
            chosen, rec = self.select(); acts = list({x['id']: x for x, _ in self.items}.values())
            print(f"\n## 筛选（--select-by {a.select_by}）：每个动作留 track_fail 帧数最少的一条进 B 遍" + ('' if chosen else '；控制视频报告还没有，下面 B 遍的种子写成 <选中种子>'))
            for aid, r in rec.items(): print(f"  {aid}: " + (f"选 s{r['selected']}（{r['picked_by']}）；" if r['selected'] is not None else '') + '候选 ' + json.dumps(r['candidates'], ensure_ascii=False))
            for ph in PHASES[2:]:
                print(f"\n## 阶段 {ph[0]}")
                for act, seed in (chosen or [(x, '<选中种子>') for x in acts]):
                    st = ph[0]; d = chosen and self.done(act, seed, st)
                    if d and a.resume: skip += 1; print(f"[{st}] 已有产物，跳过"); continue
                    tot[st] += self.step_est(st); print(f"[{st}] 约 {fmt(self.step_est(st))}\n  {shlex.join(self.cmd(act, seed, st))}")
            reg = chosen or [(x, '<选中种子>') for x in acts]
        if a.stop_after: print(f"\n## --stop-after {a.stop_after}：到控制视频为止，不发 B 遍、不登记")
        else:
            tp, ac = self.two_pass_cmds(reg)
            print(f"\n## 登记（全部跑完后写 {self.work}/two_pass_cmd.sh，不自动执行；只收 B 遍抠好了的条目，这里按全部列出）\n  {shlex.join(tp)}\n  {shlex.join(ac)}")
        n = len(self.items); gpu = sum(self.est[s] * (tot[s] / self.step_est(s)) for s in GEN); wall = sum(tot.values())
        print(f"\n## 合计（{n} 条，跳过 {skip} 步）")
        for s in STEPS: print(f"  {s:6s} {tot[s] / self.step_est(s):3.0f} 次 × {fmt(self.step_est(s))} = {fmt(tot[s])}")
        print(f"  GPU 生成时间（只算 a_gen + b_gen 的生成耗时，串行）：{fmt(gpu)}")
        print(f"  整批墙钟（含提交等待和本机步骤）：{fmt(wall)}")

    def write_prompts(self):
        os.makedirs(os.path.join(PUPPET, self.work, 'prompts'), exist_ok=True)
        for act in {x['id']: x for x, _ in self.items}.values():
            for p in 'AB': open(os.path.join(PUPPET, self.pfile(act, p)), 'w', encoding='utf-8').write(self.prompt(act, p))

    def run(self):
        a = self.a; bad = self.check_inputs()
        if bad: sys.exit('本机输入有问题，没开始：' + '；'.join(bad))
        sel = bool(a.select_by) or bool(a.stop_after); todo = self.tasks(PHASES[:2] if sel else PHASES); have = [(act['id'], seed, st) for act, seed, st in todo if self.done(act, seed, st)]
        if have and not a.resume: sys.exit(f'已有 {len(have)} 步的产物（头几个：{have[:4]}），不覆盖。要接着跑加 --resume，要重来先把 {self.work} 挪走。')
        sys.path.insert(0, os.path.join(REPO, 'tools', 'imggen')); import client as C
        env = dict(os.environ); env.setdefault('IMGGEN_URL', C.URL); env.setdefault('IMGGEN_TOKEN', C.get_token())
        r = subprocess.run([a.net_python, 'pipeline/clips/imggen.py', 'health'], cwd=PUPPET, env=env, capture_output=True, text=True)
        if r.returncode: sys.exit('服务连不上，没提交任何东西：' + (r.stdout + r.stderr).strip()[-300:])
        self.write_prompts(); log = open(os.path.join(PUPPET, self.work, 'batch-log.jsonl'), 'a', encoding='utf-8'); failed = set()
        for d in ('raw', 'ctl', 'frames', 'readings'): os.makedirs(os.path.join(PUPPET, self.work, d), exist_ok=True)
        self.log = log; self.env = env; self.failed = failed; final = self.items
        self.do(todo)
        if a.stop_after: print(f'--stop-after {a.stop_after}：停在控制视频之后。各条 track_fail：' + json.dumps({f"{act['id']}-s{seed}": (self.track_fail(act, seed) or {}).get('track_fail') for act, seed in self.items}, ensure_ascii=False)); return
        if a.select_by:
            chosen, rec = self.select(); json.dump(rec, open(os.path.join(PUPPET, self.work, 'selection.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            for aid, r in rec.items(): print(f"筛选 {aid}: " + (f"选 s{r['selected']}（{r['picked_by']}）" if r['selected'] is not None else '报告不齐，没选') + '；候选 ' + json.dumps(r['candidates'], ensure_ascii=False), flush=True)
            if not chosen: sys.exit('有动作的控制视频报告不齐（A 遍或控制视频那步失败了），没进 B 遍。')
            final = chosen; self.do([(act, seed, st) for ph in PHASES[2:] for act, seed in chosen for st in ph])
        ok = [(act, seed) for act, seed in final if self.done(act, seed, 'b_key') and self.done(act, seed, 'a_key')]
        if ok:
            tp, ac = self.two_pass_cmds(ok); p = os.path.join(PUPPET, self.work, 'two_pass_cmd.sh')
            open(p, 'w', encoding='utf-8').write('#!/bin/bash\n# new_action_batch.py 登记的入库 + 验收命令（没有执行过）。挑完种子后删掉不要的 --clip 再跑。\ncd "$(dirname "$0")/../../.."\n' + shlex.join(tp) + '\n' + shlex.join(ac) + '\n')
            print(f'登记了 {len(ok)} 条：{os.path.relpath(p, PUPPET)}')
        print(f'跑完：{len(ok)}/{len(final)} 条到了 b_key' + (f'；失败 {sorted(failed)}' if failed else ''))

    def do(self, todo):
        a = self.a; log = self.log; env = self.env; failed = self.failed
        for act, seed, st in todo:
            tag = f"{act['id']}-s{seed}"
            if tag in failed: continue
            if self.done(act, seed, st): print(f'{tag} [{st}] 已有产物，跳过', flush=True); continue
            cmd = self.cmd(act, seed, st); t0 = time.time(); print(f"{time.strftime('%H:%M:%S')} {tag} [{st}] {shlex.join(cmd)}", flush=True); err = None
            if st in ('a_key', 'b_key'):
                try:
                    info = key_clip(*[os.path.join(PUPPET, x) for x in cmd[3:]])
                    if info['frames'] != self.m['frames'] or info['size'] != [self.W, self.H]: err = f"取回的视频是 {info['frames']} 帧 {info['size']}，清单要 {self.m['frames']} 帧 {[self.W, self.H]}"
                    else: print('  ' + json.dumps({k: info[k] for k in ('raw_first_vs_home', 'raw_last_vs_home', 'motion_frames', 'margin_min', 'touches_edge_frames', 'magenta_left_max')}, ensure_ascii=False), flush=True)
                except Exception as e: err = repr(e)
            else:
                r = subprocess.run(cmd, cwd=PUPPET, env=env if st in GEN else None, capture_output=True, text=True); out = (r.stdout + r.stderr).strip()
                print('  ' + out[-400:].replace('\n', '\n  '), flush=True)
                if r.returncode: err = out[-400:]
                elif not self.done(act, seed, st): err = '命令返回成功，但产物不全'
            sec = round(time.time() - t0, 1); log.write(json.dumps({'at': time.strftime('%Y-%m-%d %H:%M:%S'), 'item': tag, 'step': st, 'seconds': sec, 'ok': err is None, 'error': err}, ensure_ascii=False) + '\n'); log.flush()
            if err and st in GEN: sys.exit(f'{tag} [{st}] 生成失败，整批停在这里：{err}')
            if err: failed.add(tag); print(f'  ✗ {tag} [{st}] 失败，这一条后面的步骤不做：{err}', flush=True)


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--key':   # 单步：--key <视频> <校色用的归位帧 rgba> <帧目录> <读数.json> [首末帧换成的 rgba]
        info = key_clip(*sys.argv[2:7]); print(json.dumps({k: v for k, v in info.items() if k not in ('sil_vs_home_pct', 'motion', 'margin_px_LTRB_per_frame')}, ensure_ascii=False)); return
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('manifest')
    ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--prompts', action='store_true'); ap.add_argument('--only'); ap.add_argument('--resume', action='store_true')
    ap.add_argument('--seeds-per-action', type=int, default=0, help='每个动作只取清单里前 n 个种子'); ap.add_argument('--order', choices=['item', 'phase'], default='item')
    ap.add_argument('--select-by', choices=['track_fail'], help='每个动作只让 track_fail 帧数最少的种子进 B 遍'); ap.add_argument('--pick', help='人工指定：动作=种子[,动作=种子]'); ap.add_argument('--stop-after', choices=['ctl'], help='做到控制视频为止')
    ap.add_argument('--est', help='覆盖预计耗时，如 a_gen=120,b_gen=210'); ap.add_argument('--net-python', default='/usr/bin/python3', help='发请求用的 python（conda 的 python 在 macOS 上可能被「本地网络」权限拦）')
    a = ap.parse_args(); a.manifest = os.path.abspath(a.manifest); os.chdir(PUPPET)
    if a.select_by or a.stop_after: a.order = 'phase'
    if a.pick and not a.select_by: sys.exit('--pick 要和 --select-by 一起用')
    b = Batch(a)
    if a.prompts:
        for act in {x['id']: x for x, _ in b.items}.values():
            for p in 'AB': print(f"=== {act['id']}（{act['label']}）{p} 遍，{len(b.prompt(act, p))} 字\n{b.prompt(act, p)}\n")
        return
    b.dry() if a.dry_run else b.run()


if __name__ == '__main__':
    main()
