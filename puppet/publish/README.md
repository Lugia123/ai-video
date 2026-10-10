# publish：面向用户的成品页和打包

- `index.html`：成品页。左边舞台，右边按钮（随机来一个 / 动作 / 表情 / 漫符 / 常用组合 / 说话）；点人物 = 点「随机来一个」。`?seed=数字` 把随机固定下来。它按打包后的目录找东西（`./lib/`、`./library/`），所以不能在这里直接打开，要先打包。
- `build.py`：把成品页、脚本和片段库里用到的图拷成一个能整目录拷走的包。只读原库。默认以 clips-2p 为底，并入 clips-2p-new 的 clap_s1、stepbeat_s1 和 clips-2p-new-fix 的 hips_s1_fix（`build.py` 开头的 ADD / MAIN 两张表：并什么、主按钮是哪几条）。

```
python3 publish/build.py            # → out/release-html/<角色>-host-v3.1/（PNG 帧）
python3 publish/build.py --webp     # → out/release-html/<角色>-host-v3.1-webp/（无损 WebP，要装 cwebp）
sh out/release-html/beret-girl-host-v3.1/start.sh      # 然后开 http://localhost:8795/
```

选项：`--char`（默认 beret-girl）、`--lib`（默认 clips-2p）、`--add 库:动作,动作`、`--no-add`、`--keep-all`（MAIN 里没列的动作也带上，进「更多版本」）、`--tag`（默认 v3.1）、`--port`（默认 8795）、`--out`、`--jobs`。

`index.v1.html` / `build.v1.py` 是第一版（没有随机、没有合并库，端口 8765）的备份；`index.v2.html` / `build.v2.py` 是第二版（12 条动作全带，端口 8791）的备份。第三版起 MAIN 里没列的动作不进包；`build.v3.py` 是第三版（7 条，不含叉腰，端口 8793）的备份。

包里的片段库和原库的不同，见 `build.py` 开头的说明：`points.json` 缺漫符选项时从角色默认库补上；`--webp` 时图和路径一起换扩展名。

页面要走本地服务打开，`file://` 不行（浏览器不让本地文件加载脚本模块）。
