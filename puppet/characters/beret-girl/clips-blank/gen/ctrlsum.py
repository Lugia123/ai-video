#!/usr/bin/env python3
# 控制遍汇总一行：python3 gen/ctrlsum.py <标签…>  读 readings/pair-<标签>.json、<成片名>.face.json、.after.txt
import sys, json, re
for t in sys.argv[1:]:
    j = json.load(open(f'readings/pair-{t}.json')); S = j['summary']; B = j['B']; f = json.load(open(f'readings/{B}.face.json')); a = open(f'readings/{B}.after.txt').read()
    g = lambda k: '%.2f/%.2f' % (S[k]['均值'], S[k]['最大']) if k in S else '-'
    m = lambda p: (re.search(p, a) or [None, '?'])[1] if re.search(p, a) else '?'
    print(t, '| md5同:', a.split()[2] == a.split()[4], '| 五官px 首%d 最大%d' % (f['feat_px_first'], f['feat_px_max']))
    print('  下巴', g('下巴'), '左颊', g('左脸颊'), '右颊', g('右脸颊'), '刘海', g('刘海下缘'), '左帽檐', g('左帽檐'), '右帽檐', g('右帽檐'), '发卡', g('发卡'), '脸轮廓', g('脸轮廓(下巴/左右颊逐帧取最大)'))
    print('  手臂光流均值', g('手臂光流均值'), 'p95', g('手臂光流p95'), '倒角均值', g('手臂轮廓倒角均值'), '倒角最大', g('手臂轮廓倒角最大'), '| 帽横', f['hat_dx_max_abs'])
    for l in a.splitlines():
        if l.startswith('c 身份 发卡') or l.startswith('c 身份 帽子') or l.startswith('c 身份 挑染'): print('  ', l[:130])
