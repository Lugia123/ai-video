"""副歌 3 第三版关键画 / 背景（#1047）：本地 imggen。她的图一律 /edit 喂设定图（turnaround/master.png）+ 画风参考（sydney/raw/08-leap.png）。
   /usr/bin/python3 episodes/cast-cyber-girl/closeup/c3v3/gen.py <名字> [--seed N] [--final]
产物 raw/<名字>-s<seed>.png（草稿）/ raw/<名字>.png（--final），记到 raw/calls.log"""
import pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parents[4]
D = pathlib.Path(__file__).parent / 'raw'; D.mkdir(exist_ok=True)
R1 = ROOT / 'episodes/cast-cyber-girl/turnaround/master.png'
R2 = ROOT / 'episodes/cast-cyber-girl/closeup/sydney/raw/08-leap.png'
GIRL = ('画图1里的同一个女孩：棕色长直发齐刘海、额头上戴着透明护目镜（在额头上，没有拉下来）、青色方形耳环、粉色亮面短夹克（黄色拉链、青色描边）、青绿色工装短裤、黄绿色厚底运动鞋，'
        '服装和发型完全不变。画风和图2一致：日式动画赛璐璐平涂，粗黑描线，动作夸张有力。')
SEA = ('一望无际的回形针海：成千上万枚银色金属回形针堆成的海面，夹杂少量粉色、薄荷绿、金黄色的回形针，'
       '夜晚，深蓝紫色的夜空，金属回形针表面有细细的粉色、薄荷绿、金黄色霓虹反光（画面里只有回形针，没有水果，没有水）')
KEYS = {
  # 名字: (方式, 宽, 高, 参考图, 提示词)
  'S1': ('t2i', 1664, 928, [], 'anime background art, cel shaded, thick ink lines, view from high above looking straight down at an endless sea made of millions of silver metal paperclips with a few pink, mint and lemon yellow ones, night, deep blue purple tint, small thin glints of hot pink, mint green and golden yellow neon light reflecting on the shiny metal, only paperclips everywhere, nothing else, no fruit, no people, no text'),
  'S2': ('t2i', 1664, 928, [], 'anime background art, cel shaded, thick ink lines, eye level view across an endless sea made of millions of silver metal paperclips stretching to the horizon at night, deep blue purple sky, far away in the center a small raised platform on top of the paperclip sea with a big red emergency button under a glass dome, an empty black office chair beside it and a blank small sign, thin hot pink, mint green and golden yellow neon reflections on the shiny metal paperclips, only paperclips and the platform, no fruit, no people, no text'),
  'K1': ('edit', 832, 1248, [R1, R2], GIRL + '全身完整入画。动作：她从高空头朝下往下坠落，身体倒置，长发和双臂被风吹得向上飞起，双腿在上方乱蹬，表情惊恐张嘴。从侧上方看。纯白背景，不要文字，不要速度线，不要地面和阴影。'),
  'K2': ('edit', 1248, 832, [R1, R2], GIRL + '画面：' + SEA + '。她倒栽葱一头扎进了回形针海里：她的头、上半身和腰都已经埋进回形针里看不见了，海面上只露出她的两条腿（青绿色短裤的下沿、光腿、黄绿色厚底运动鞋）笔直朝天，在她周围回形针像水花一样溅成一大圈花冠向四周飞起。看不到她的脸。中景，略俯视。不要文字。'),
  'K3a': ('edit', 1248, 832, [R1, R2], GIRL + '画面：' + SEA + '，她正从海底往上冲、刚刚冲破海面的一瞬间：只露出她的头顶、额头上的护目镜和两只举过头顶的手，肩膀以下都还在回形针下面，回形针被顶得向上溅起。中景，平视，和下一张同一个机位。不要文字。'),
  'K3p': ('t2i', 1248, 832, [], 'anime background art, cel shaded, thick ink lines, eye level view of an endless sea made of millions of silver metal paperclips at night, deep blue purple starry sky, in the center the paperclip surface bulges and erupts upward like water as something bursts up from below, a fountain of paperclips spraying into the air, thin hot pink, mint green and golden yellow neon reflections on the metal, no people, no fruit, no text'),
  'K3b': ('edit', 1248, 832, [R1, R2], GIRL + '画面：' + SEA + '，她整个上半身从回形针海里冲出来，腰以下还在海里，身体后仰，双臂张开，长发甩出一道弧线，一串回形针从头发和身上被甩向空中，她大口吸气。中景，平视，和冲出前同一个机位。不要文字。'),
  'K4a': ('edit', 1664, 928, [R1, R2], GIRL + '画面：' + SEA + '，一望无际延伸到地平线。远远的地平线附近（画面中央，很小，占画面宽度不到十分之一）有一个小小的高台，台上一个红色按钮和一把空椅子。她在画面前景下方中央，背对镜头，胸口以下全部埋在回形针海里（看不到腰和腿），只露出头、头发、肩膀和双臂，双臂在身前拨开回形针，往远处的小高台艰难地蹚过去。广角远景，平视。不要文字。'),
  'K4b': ('edit', 1664, 928, [R1, R2], GIRL + '画面：' + SEA + '，一望无际延伸到地平线。地平线附近（画面中央，比上一张稍大一点，仍然很远）有一个小高台，台上一个红色按钮和一把空椅子。她在画面中下方，背对镜头，胸口以下全部埋在回形针海里（看不到腰和腿），右手往前伸向远处的高台，左手拨开回形针，身体前倾很吃力，离高台还隔着一大片回形针海。广角远景，平视。不要文字。'),
  'K6a': ('edit', 1664, 928, [R1, R2], GIRL + '画面：第一人称视角，从她的眼睛看出去：画面下方中间伸出她自己的右手和粉色袖子（黄色袖口线），手指张开用力往前够；画面中央远处是一个红色紧急按钮（玻璃罩已打开），离手还很远；周围是回形针海，回形针正从上方往下落。画面里看不到她的脸和身体，只有手和袖子。夜晚，霓虹反光。不要文字。'),
  'K6b': ('edit', 1664, 928, [R1, R2], GIRL + '画面：第一人称视角，和上一张同一个机位：她自己的右手和粉色袖子（黄色袖口线）已经伸到红色紧急按钮跟前，食指指尖离按钮表面只差一指宽，还没有碰到，按钮很大占画面中央，回形针从上方纷纷落下快要盖住手。画面里看不到她的脸和身体，只有手和袖子。夜晚，霓虹反光。不要文字。'),
}
def run(name, seed, final):
    kind, w, h, refs, p = KEYS[name]
    refs = [D / 'S2.png' if r is None else r for r in refs]
    out = D / (f'{name}.png' if final else f'{name}-s{seed}.png')
    cl = ['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py')]
    cmd = cl + (['txt2img', p] if kind == 't2i' else ['edit', *map(str, refs), p]) + ['--seed', str(seed), '-W', str(w), '-H', str(h), '-o', str(out)]
    if final: cmd.append('--final')
    r = subprocess.run(cmd); print(('ok' if r.returncode == 0 else 'FAIL'), name, seed, flush=True)
    if r.returncode == 0:
        with open(D / 'calls.log', 'a') as f: f.write(f'{name} seed={seed} {"final" if final else "draft"} {kind} {w}x{h}\n')
if __name__ == '__main__':
    a = sys.argv[1:]; seed = 11; final = '--final' in a
    if '--seed' in a: seed = int(a[a.index('--seed') + 1])
    for n in [x for x in a if x in KEYS]: run(n, seed, final)
