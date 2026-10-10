#!/usr/bin/env python3
# /usr/bin/python3 gen/gen.py <wave|think> <draft|mid8c15> <seed> [帧数=49]   首帧 = 尾帧 = home_blank_magenta.png
# draft = 4 步 + lightx2v LoRA、cfg 1（反向词不生效，不传）；mid8c15 = LoRA、8 步、cfg 1.5、反向词 NEG_MID。
import sys, os, json, time, subprocess
R = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + '/..'); sys.path.insert(0, os.path.normpath(R + '/../../../../tools/imggen')); import client as C
act, tier, seed = sys.argv[1], sys.argv[2], int(sys.argv[3]); frames = int(sys.argv[4]) if len(sys.argv) > 4 else 49
prompt, neg, ver = subprocess.run(['bash', '-c', f'. {R}/gen/{os.environ.get("PROMPTS","prompts.sh")}; printf "%s\\0%s\\0%s" "$P_{act}" "$NEG_MID" "$VER"'], capture_output=True).stdout.decode().split('\0')
ver += os.environ.get('VTAG', ''); home = C.b64(R + '/' + os.environ.get('HOME_FILE', f'home_blank{os.environ.get("V","")}_magenta.png')); name = f'{act}-{ver}-{tier}-s{seed}'; out = f'{R}/raw/{name}'
p = dict(prompt=prompt, model='wan', fast=True, seed=seed, frames=frames, width=832, height=1104, image=home, end_image=home)
if tier == 'mid8c15': p.update(steps=8, cfg=1.5, negative=neg)
t0 = time.time(); j = json.loads(C.call('/img2video', p)[0]); log = open(out + '.log', 'w')
def say(s): print(s, flush=True); log.write(s + '\n'); log.flush()
say(f"{name} job {j['id']} {j['width']}x{j['height']} {j['frames']}帧 tier={tier} prompt={prompt}"); last = None
while True:
    time.sleep(5); j = json.loads(C.call(f"/jobs/{j['id']}")[0])
    if j['status'] != last: say(f"  {time.strftime('%H:%M:%S')} {j['status']}"); last = j['status']
    if j['status'] == 'done':
        open(out + '.mp4', 'wb').write(C.call(f"/jobs/{j['id']}/video")[0])
        say(f"生成 {j['elapsed']}s（排队 {j.get('queue_wait')}s）整卡显存峰值 {j.get('vram_peak_mib')} MiB 模型 {j.get('model')}"); break
    if j['status'] in ('error', 'cancelled'): say(f"{j['status']}：{j.get('error')}"); sys.exit(1)
say(f'wall {time.time()-t0:.0f} s')
