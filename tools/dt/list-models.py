"""扫描目录下所有 .glb，生成 3D 查看器用的 models.json 清单（路径相对该目录）。
  python3 tools/dt/list-models.py [episodes/cast-cyber-girl/3d]
下划线开头的目录（如 _test/）排在最后。"""
import json, pathlib, sys
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'episodes/cast-cyber-girl/3d')
if not root.is_dir(): sys.exit(f'目录不存在：{root}')
files = sorted(root.rglob('*.glb'), key=lambda p: (p.relative_to(root).parts[0].startswith('_'), str(p.relative_to(root))))
models = [{'path': p.relative_to(root).as_posix(), 'bytes': p.stat().st_size} for p in files]
(root / 'models.json').write_text(json.dumps({'models': models}, ensure_ascii=False, indent=2) + '\n')
print(f'{root / "models.json"}: {len(models)} 个模型')
for m in models: print(f'  {m["path"]}  {m["bytes"] / 1e6:.1f} MB')
