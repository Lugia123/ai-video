#!/usr/bin/env python3
"""puppet 是通用项目，不该含某一集的内容。这个检查在 puppet 目录里搜「单集 / 试验目录」的名字和路径，搜到就报。
用法：python3 tools/check_generic.py        退出码 0 = 干净
不搜的地方（各有理由）：out/（产物，不入库）、third_party/（别人的许可证和来源清单）、node_modules/、图片；
  角色数据包和坏样本里的 provenance.json（来历是事实记录，如实写着素材最初在哪做的）；
  ARCHITECTURE.md、CONSOLIDATION.md（设计和整理计划，里面的历史说明要提到原来的位置）；这个脚本自己。
另有一份「已知还没清掉的」名单 KNOWN：在名单里的文件搜到了只提醒、不算失败，名单清空之日就是整理完成之日。"""
import os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PAT = re.compile(r'ep\d\d|episodes/|proto[-_]b')
SKIP_DIRS = {'out', 'third_party', 'node_modules', '__pycache__', '.git'}
SKIP_FILES = {'ARCHITECTURE.md', 'CONSOLIDATION.md', 'tools/check_generic.py'}
KNOWN = {}          # 文件 → 为什么还在（2026-10-07 来源素材搬进来之后清空了）
bad, known = [], []
for d, dirs, files in os.walk(ROOT):
    dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
    for f in files:
        rel = os.path.relpath(os.path.join(d, f), ROOT)
        if rel in SKIP_FILES or f == 'provenance.json' or f.lower().endswith(('.png', '.jpg', '.webp', '.mp4', '.npy', '.lock')): continue
        try: lines = open(os.path.join(d, f), encoding='utf-8').read().split('\n')
        except (UnicodeDecodeError, OSError): continue
        hits = [(i + 1, l.strip()[:110]) for i, l in enumerate(lines) if PAT.search(l)]
        if hits: (known if rel in KNOWN else bad).append((rel, hits))
for rel, hits in known: print(f'（已知，待清）{rel}：{len(hits)} 处 —— {KNOWN[rel]}')
for rel, hits in bad:
    print(f'✗ {rel}')
    for n, l in hits[:6]: print(f'    {n}: {l}')
stale = [k for k in KNOWN if k not in {r for r, _ in known}]
if stale: print('名单里这些已经干净了，可以从 KNOWN 里去掉：', '、'.join(stale))
print('通过：通用代码里没有单集 / 试验目录的内容' + (f'（另有 {len(known)} 个已知待清）' if known else '') if not bad else f'{len(bad)} 个文件不干净')
sys.exit(1 if bad else 0)
