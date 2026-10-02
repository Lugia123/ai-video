"""副歌 3 关机开关漫画页关键画（#1047）：本地 imggen edit，参考 = 全身设定图 + Sydney 段动作关键画（画风），做法同 closeup/parkour/gen.py。
   /usr/bin/python3 episodes/cast-cyber-girl/closeup/killswitch/gen.py draft [名字…] [--seeds 11,23]
   /usr/bin/python3 episodes/cast-cyber-girl/closeup/killswitch/gen.py final 名字=种子 …
door / face 有她（edit 喂参考图）；button / chair 是道具（只喂画风参考图 2）。"""
import pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
D = pathlib.Path(__file__).parent / 'raw'
R1 = ROOT / 'episodes/cast-cyber-girl/turnaround/master.png'
R2 = ROOT / 'episodes/cast-cyber-girl/closeup/sydney/raw/08-leap.png'
R3 = ROOT / 'episodes/cast-cyber-girl/closeup/final/neutral.png'
BASE = ('画图1里的同一个女孩：棕色长直发齐刘海、头顶透明护目镜、青色方形耳环、粉色亮面短夹克（黄色拉链、青色描边）、青绿色工装短裤、黄绿色厚底运动鞋，'
        '服装和发型完全不变。画风和图2一致：日式动画赛璐璐平涂，粗黑描线，动作夸张有力。纯白背景，不要文字，不要速度线，不要地面和阴影。')
PROP = '画风和图1一致：日式动画赛璐璐平涂，粗黑描线，暗夜色调，室内只有冷色屏幕光，带少量粉色 #FF2E88、薄荷绿 #5FE3C0、柠黄 #F4E04D 霓虹点缀。不要人物。'
KEYS = {
    # 名字: (宽, 高, 参考图, 提示词)
    'door': (832, 1248, [R1, R2], BASE + '全身完整入画不被裁切。动作：她用右肩撞开一扇门冲进来的瞬间，身体前倾，右臂护在身前，左臂向后甩，左脚刚跨进门槛，长发向后飘起，表情急切、咬牙，眼睛看着画面前方。三分之四正面视角。'),
    'face': (1024, 1024, [R3, R2], '画图1里的同一个女孩的脸部和肩膀特写（发型、刘海、头顶透明护目镜、青色方形耳环、粉色夹克领口都完全不变），画风和图2一致：日式动画赛璐璐平涂，粗黑描线。'
             '表情：愣住了，眼睛睁大、瞳孔缩小，嘴巴微张成一条歪线，额角挂着一大滴冷汗，面无血色的那种无语震惊。正面朝向镜头。纯白背景，不要文字。'),
    'button': (1248, 832, [R2], PROP + '画面：一张控制台上，一个巨大的红色圆形紧急按钮罩在透明玻璃罩下，按钮底座上贴着空白的黄黑斜纹警示标牌（标牌上不要字），按钮微微发红光，特写，略俯视。'),
    'chair': (1248, 832, [R2], PROP + '画面：安全控制室的工位，一把空着的黑色办公转椅转向一边，桌上有熄灭的显示器、一个空咖啡杯，桌面上贴着一张空白的黄色便利贴（上面不要字），旁边放着一张热带海滩明信片（棕榈树、蓝色大海），明信片上不要字。中景，平视。'),
}

def run(name, seed, final):
    w, h, refs, p = KEYS[name]
    out = D / (f'{name}.png' if final else f'drafts/{name}-s{seed}.png')
    out.parent.mkdir(parents=True, exist_ok=True)
    # 用系统自带的 /usr/bin/python3：miniconda 的 python 在这台 Mac 上访问局域网会报 No route to host
    cmd = ['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'edit', *map(str, refs), p, '--seed', str(seed), '-W', str(w), '-H', str(h), '-o', str(out)]
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
