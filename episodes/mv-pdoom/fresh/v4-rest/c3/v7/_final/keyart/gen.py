"""副歌 3 第七版漫画关键画（#1070）：本地 imggen /edit，每张喂设定图（turnaround/master.png）+ 画风参考（parkour/raw/land.png）。
   /usr/bin/python3 gen.py <名字…|all> [--seed N] [--final]
产物 raw/<名字>-s<seed>.png（草稿档）/ raw/<名字>-final-s<seed>.png，记到 raw/calls.log。队列空了才发，一次一张。"""
import json, pathlib, subprocess, sys, time, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[4]
D = pathlib.Path(__file__).parent / 'raw'; D.mkdir(exist_ok=True)
CAST = ROOT / 'episodes/cast-cyber-girl'
R1 = CAST / 'turnaround/master.png'
R2 = CAST / 'closeup/parkour/raw/land.png'
GIRL = ('画图1里的同一个女孩：棕色长直发齐刘海、额头上戴着透明护目镜（在额头上，没有拉下来）、青色方形耳环、粉色亮面短夹克（黄色拉链、青色描边、袖子上黄色条纹），'
        '服装和发型完全不变，正常头身比（约七头身），不要Q版。')
HAND = '手和袖子取自图1的女孩：纤细的女孩子的手，五根手指，淡粉色指甲；粉色亮面夹克的袖子，袖子上有黄色和青色条纹，青色袖口。'
STYLE = ('画风和图2一致：美式漫画加日式动画的赛璐璐平涂，粗细有变化的黑色墨线，阴影用网点，色块干净。这是一格电影感的漫画分镜，透视夸张。夜晚，深蓝紫色调。'
         '画面里不要任何文字、字母、对白框、拟声字，不要画格框。')
CLIP = ('回形针堆：无边无际、由成千上万枚银色金属回形针堆成，地面完全被回形针盖住，夹杂少量粉色、薄荷绿、柠檬黄的回形针，近处的回形针画得很大、用粗黑线勾边。'
        '画面里绝对没有水、没有浪花、没有沙子、没有泥土。')
W, H = 1248, 704
P = {
  'k1': (GIRL + STYLE + '画面：低机位侧面中景，画面略微倾斜：她站在齐胸深的回形针堆里，只露出胸口以上（画面里没有腿、没有短裤、没有鞋），身体侧对镜头、脸朝画面右边，从画面左边往右边艰难地往前挤，'
         '上身用力前倾，咬紧牙关，双臂像游泳拨水一样拨开面前的回形针，回形针在她胸前堆成一道隆起的浪挡着她，她身后（画面左边）留下一道犁开的沟。表示阻力的短粗动作线。'
         '画面最右边的远处有一点红色的光，把她的脸映红。' + CLIP),
  'k2': (GIRL + STYLE + '画面：侧面近景：她只露出胸口以上，胸口以下埋在回形针堆里，整个上身向画面右边扑出去，右臂伸得笔直，五指张开，拼命伸向画面右侧一个发着红光的红色圆形大按钮（按钮装在一个黑色金属底座上，底座从回形针堆里露出来）；'
         '她的指尖离按钮还差一个手掌的距离，没有碰到。她表情拼命、张嘴喊，脸和手被按钮的红光照亮。速度线朝按钮汇聚。' + CLIP),
  'k3': (STYLE + '画面：特写，俯视四十五度，画面里没有脸、没有身体，只有一只手、一截袖子和一个按钮：一只右手张开手掌，从画面左上方狠狠拍在一个红色圆形大按钮上（' + HAND + '），手掌整个压在按钮上，按钮被拍得陷进黑色金属底座里；'
         '以按钮为中心一圈放射状的冲击线和几道闪电形的震动线，周围的回形针被震得跳起来。按钮发着红光。' + CLIP),
  'k4': (STYLE + '画面：极特写，没有人物、没有手：一个红色圆形大按钮被拍裂了，红色的外壳像蛋壳一样裂开、翘起，裂口里面不是电路，而是伸出一根粗粗的、麻绳一样的黄褐色引线（导火索），'
         '引线的头正在燃烧，喷出一团耀眼的金白色火花，火星四处飞溅，冒着一缕烟；引线从按钮里伸出来、沿着黑色金属底座垂下去，伸向画面右下角。按钮的红光和火花的金光把周围的回形针照亮。' + CLIP),
  'k5': (GIRL + STYLE + '画面：脸部大特写，宽银幕：她的脸占满画面，眼睛睁得很大、瞳孔缩小、嘴微张，一脸「糟了」的震惊表情；脸的下半部分被下方的金色火花照亮，几粒火星从脸前飞过，头发上挂着一枚回形针。背景是深蓝紫色加网点。'),
}
# ---- 第二轮（用户 10-02：四格按钮统一成「扁的红色大按钮 + 黑色底座」；引线在底座点着、火花往上冲）
BTN = pathlib.Path(__file__).parent / 'btn-ref.png'          # 按钮定稿参考图（gen.py btn 出，挑好后拷成 btn-ref.png）
K3A = pathlib.Path(__file__).parent / 'raw/k3-s11.png'
BDESC = '按钮必须和图3里的按钮一模一样：一个扁平的、圆饼形的红色大按钮（不是球形），表面微微鼓起、有一道高光，装在一圈黑色金属圆形底座上。'
NOCOIN = '地上只有回形针，没有彩色圆片、没有硬币、没有糖豆、没有纽扣。'
P2 = {
  'btn': ([K3A], '把图1里的手和袖子去掉，只保留按钮：一个扁平的圆饼形红色大按钮，装在一圈黑色金属圆形底座上，没有被按下，完整、居中、略俯视四十五度，占画面宽度的三分之一。去掉所有冲击线、闪电、星星。' + NOCOIN + '画风不变：粗黑墨线、赛璐璐平涂、网点。' + CLIP + '不要任何文字。'),
  'k2b': ([R1, R2, BTN], GIRL + STYLE + '画面：侧面近景：她只露出胸口以上，胸口以下埋在回形针堆里，整个上身向画面右边扑出去，右臂伸得笔直，五指张开，拼命伸向画面右侧的红色按钮。' + BDESC +
          '按钮发着红光。她的指尖离按钮还差一个手掌的距离，没有碰到按钮，手和按钮之间看得到空隙。她表情拼命、张嘴喊，脸和手被按钮的红光照亮。速度线朝按钮汇聚。' + NOCOIN + CLIP),
  'k3b': ([R1, R2, BTN], STYLE + '画面：特写，俯视四十五度，画面里没有脸、没有身体，只有一只手、一截袖子和一个按钮：一只右手张开手掌，从画面左上方狠狠拍在红色按钮上（手和袖子取自图1的女孩：纤细的女孩子的手，五根手指，淡粉色指甲；粉色亮面夹克的袖子，黄色和青色条纹，青色袖口），'
          '手掌整个压在按钮上，按钮被拍得陷进黑色底座里。' + BDESC + '以按钮为中心一圈放射状的白色冲击线和几道闪电形的震动线，周围的回形针被震得跳起来。' + NOCOIN + CLIP),
  'k4b': ([R2, R2, BTN], STYLE + '画面：极低机位的仰拍特写，没有人物、没有手，竖直方向的冲击感：画面下方三分之一是红色按钮和它的黑色金属底座（按钮已经被按下去、陷在底座里）。' + BDESC +
          '底座的侧面底部伸出一根粗粗的麻绳一样的黄褐色引线（导火索），引线贴着底座笔直地向上伸进夜空、一直伸出画面上沿。引线在底座根部被点着了：一团耀眼的金白色火花正沿着引线从底部向上猛冲，已经冲到画面中间的高度，'
          '身后拖着一条长长的、烧红的火尾，火星向下飞溅，一缕烟；整幅画面是竖直向上的速度线，像火箭升空。按钮的红光和火花的金光照亮周围的回形针。' + NOCOIN + CLIP),
}
# ---- 第三轮：在选中的图上只做一件事——去掉彩色圆片（和泥土），别的不动
RAW = pathlib.Path(__file__).parent / 'raw'
CLEAN = '保持图1的构图、人物、手、按钮、线条和颜色完全不变，只做一处修改：把地上所有彩色的圆片、圆点、硬币一样的东西全部去掉，换成和周围一样的银色金属回形针（粗黑线勾边）；地上的泥土、沙子也换成回形针。地面只有回形针。不要任何文字。'
P2.update({
  'k2c': ([RAW / 'k2b-s23.png'], CLEAN),
  'k3c': ([RAW / 'k3b-s11.png'], CLEAN),
  'k4c': ([RAW / 'btn-s23.png'], CLEAN + '背景上方留出深蓝紫色的夜空。'),
})
P2['k4d'] = ([RAW / 'k4c-final-s11.png'], '保持图1的构图、按钮、底座、线条和颜色完全不变，只做一处修改：地上那些灰色的实心圆片、圆点全部去掉，换成和周围一样的银色金属回形针（细长的环形铁丝，粗黑线勾边）。地面上只有回形针，没有任何圆片、圆点、圆饼。不要任何文字。')
def run2(name, seed, final=False):
    wait_idle(); refs, p = P2[name]
    out = D / (f'{name}-final-s{seed}.png' if final else f'{name}-s{seed}.png')
    cmd = ['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'edit', *map(str, refs), p, '--seed', str(seed), '-W', str(W), '-H', str(H), '-o', str(out)]
    if final: cmd.append('--final')
    r = subprocess.run(cmd); print(('ok' if r.returncode == 0 else 'FAIL'), name, seed, flush=True)
    if r.returncode == 0:
        with open(D / 'calls.log', 'a') as f: f.write(f'{name} seed={seed} draft edit {W}x{H}\n')
def wait_idle(limit=240):
    t0 = time.time()
    while time.time() - t0 < limit:
        try:
            h = json.load(urllib.request.urlopen('http://192.168.3.127:7860/health', timeout=5))
            if not h.get('busy') and not h.get('image_waiting') and not h.get('queue', {}).get('running'): return
        except Exception: pass
        time.sleep(6)
def run(name, seed, final):
    wait_idle()
    out = D / (f'{name}-final-s{seed}.png' if final else f'{name}-s{seed}.png')
    cmd = ['/usr/bin/python3', str(ROOT / 'tools/imggen/client.py'), 'edit', str(R1), str(R2), P[name], '--seed', str(seed), '-W', str(W), '-H', str(H), '-o', str(out)]
    if final: cmd.append('--final')
    r = subprocess.run(cmd); print(('ok' if r.returncode == 0 else 'FAIL'), name, seed, flush=True)
    if r.returncode == 0:
        with open(D / 'calls.log', 'a') as f: f.write(f'{name} seed={seed} {"final" if final else "draft"} edit {W}x{H}\n')
if __name__ == '__main__':
    a = sys.argv[1:]; seed = 11; final = '--final' in a
    if '--seed' in a: seed = int(a[a.index('--seed') + 1])
    for n in [n for n in P if 'all' in a or n in a]: run(n, seed, final)
    for n in [n for n in P2 if n in a]: run2(n, seed, final)
