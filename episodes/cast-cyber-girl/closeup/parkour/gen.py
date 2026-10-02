"""v4-03 跑酷漫画格关键画（#1030）：本地 imggen edit，参考 = 全身设定图 + Sydney 段动作关键画（画风）。
   python3 episodes/cast-cyber-girl/closeup/parkour/gen.py draft [名字…] [--seeds 11,23]
   python3 episodes/cast-cyber-girl/closeup/parkour/gen.py final 名字=种子 …
draft：Lightning 草稿 → raw/drafts/<名字>-s<种子>.png；final：40 步定稿 → raw/<名字>.png，记到 raw/calls.log"""
import pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
D = pathlib.Path(__file__).parent / 'raw'
R1 = ROOT / 'episodes/cast-cyber-girl/turnaround/master.png'
R2 = ROOT / 'episodes/cast-cyber-girl/closeup/sydney/raw/08-leap.png'
BASE = ('画图1里的同一个女孩：棕色长直发齐刘海、头顶透明护目镜、青色方形耳环、粉色亮面短夹克（黄色拉链、青色描边）、青绿色工装短裤、黄绿色厚底运动鞋，'
        '服装和发型完全不变。画风和图2一致：日式动画赛璐璐平涂，粗黑描线，动作夸张有力。纯白背景，全身完整入画不被裁切，不要文字，不要速度线，不要地面和阴影。动作：')
KEYS = {
    'gap': (832, 1248, '从斜上方俯视的高角度镜头，她正在半空中大步飞跃：身体前倾，左腿向前跨出伸直，右腿向后蹬，双臂一前一后大幅摆开，长发向后飘起，咬牙专注地看着前方。强透视，头和肩离镜头近、显得大，脚离镜头远、显得小。'),
    'wall': (1248, 832, '正侧面视角，她向画面右方全力冲刺奔跑的瞬间：身体大幅前倾，右腿向前高抬膝，左腿向后蹬直离地，双臂用力前后摆，长发水平向后飘，侧脸，表情兴奋张嘴。'),
    'flip': (1024, 1024, '她在空中做后空翻，身体完全倒置：头在画面下方、双脚在画面上方，背部向后弓起，双膝微收，双臂向两侧张开，长发因为倒置而向下垂散，脸朝向镜头，自信地笑。'),
    'land': (1248, 832, '超级英雄式落地：左膝跪地，右脚踩地屈膝，右拳砸在地面上，左臂向身后斜上方扬起，身体压低，抬头用凌厉的眼神直视镜头，长发因冲击向上扬起。正面略俯视的视角。'),
}

def run(name, seed, final):
    w, h, p = KEYS[name]
    out = D / (f'{name}.png' if final else f'drafts/{name}-s{seed}.png')
    out.parent.mkdir(parents=True, exist_ok=True)
    # 用系统自带的 /usr/bin/python3：miniconda 的 python 在这台 Mac 上访问局域网会报 No route to host（curl 和系统 python 正常）
    cmd = ['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'edit', str(R1), str(R2), BASE + p, '--seed', str(seed), '-W', str(w), '-H', str(h), '-o', str(out)]
    if final: cmd.append('--final')
    r = subprocess.run(cmd)
    print(('ok' if r.returncode == 0 else 'FAIL'), name, seed, flush=True)
    if final and r.returncode == 0:
        with open(D / 'calls.log', 'a') as f: f.write(f'{name} seed={seed} final {w}x{h}\n')

if __name__ == '__main__':
    mode, args = sys.argv[1], sys.argv[2:]
    seeds = [11, 23]
    if '--seeds' in args: i = args.index('--seeds'); seeds = [int(s) for s in args[i + 1].split(',')]; args = args[:i] + args[i + 2:]
    if mode == 'draft':
        for n in (args or KEYS):
            for s in seeds: run(n, s, False)
    else:
        for a in args: n, s = a.split('='); run(n, int(s), True)
