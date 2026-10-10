#!/usr/bin/env python3
"""逐帧 md5（哪个系统都能用）：python3 tools/md5_frames.py <帧目录> [另一个帧目录或另一份清单.txt]
只给一个目录：按文件名顺序打印每个 PNG 的 md5（重定向到文件就是一份清单）。
给两个：逐帧比，打印「共多少帧、多少帧不同」，退出码 0 = 完全一致。"""
import hashlib, os, sys
def listing(p):
    if os.path.isdir(p): return [hashlib.md5(open(os.path.join(p, f), 'rb').read()).hexdigest() for f in sorted(os.listdir(p)) if f.endswith('.png')]
    return [l.strip() for l in open(p) if l.strip()]
if len(sys.argv) < 2: raise SystemExit(__doc__)
a = listing(sys.argv[1])
if len(sys.argv) < 3: print('\n'.join(a)); sys.exit(0)
b = listing(sys.argv[2]); diff = sum(x != y for x, y in zip(a, b)) + abs(len(a) - len(b))
print(f'{len(a)} 帧 对 {len(b)} 帧，不同 {diff}'); sys.exit(1 if diff else 0)
