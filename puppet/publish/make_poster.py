#!/usr/bin/env python3
"""从打好的包里截一张「等待时的人物图」：讲解员在 t = 0 画出来的那一帧（归位站姿 + 默认脸），存成 publish/poster/<角色>.webp。
页面加载片段库的那段时间把它摆在房间里（点不了），加载完换成真的讲解员——两张是同一帧，换的时候看不出来。build.py 打包时会把它带上。

用法（在 puppet/ 下；包要先起服务）：
  sh out/release-html/<角色>-host-v4-webp/start.sh &
  uv run --with playwright python publish/make_poster.py --url http://localhost:8797/ --char beret-girl
换了片段库、归位帧或默认脸之后要重截；截完再打一次包。要装 cwebp。
"""
import argparse, base64, os, subprocess, tempfile
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(); ap.add_argument('--url', default='http://localhost:8797/'); ap.add_argument('--char', default='beret-girl')
A = ap.parse_args(); HERE = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(HERE, 'poster', A.char + '.webp'); os.makedirs(os.path.dirname(out), exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.add_init_script('window.requestAnimationFrame = () => 0;')          # 时间不往前走：画布上留的就是 t = 0 那一帧
    pg.goto(A.url + ('&' if '?' in A.url else '?') + 'intro=0'); pg.wait_for_function('window.__app && window.__host', timeout=600000, polling=200)          # 默认按 rAF 轮询，上面把 rAF 停了，改成定时
    data = pg.evaluate('window.__host().canvas.toDataURL("image/png")'); b.close()
with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f: f.write(base64.b64decode(data.split(',', 1)[1])); png = f.name
subprocess.run(['cwebp', '-quiet', '-lossless', '-exact', '-z', '8', png, '-o', out], check=True); os.unlink(png)
print(out, os.path.getsize(out), '字节')
