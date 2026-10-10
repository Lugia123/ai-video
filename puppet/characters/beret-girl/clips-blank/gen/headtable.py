#!/usr/bin/env python3
# 头晃并排列表：python3 gen/headtable.py <段名>…   读 readings/<段名>.face.json
import sys, json
print('%-34s %6s %6s %6s %6s %6s %6s' % ('段', '帽横', '帽纵', '脸心横', '脸心纵', '旋转°', '五官+'))
for n in sys.argv[1:]:
    j = json.load(open(f'readings/{n}.face.json'))
    print('%-34s %6.1f %6.1f %6.1f %6.1f %6.1f %6d' % (n, j['hat_dx_max_abs'], j['hat_dy_max_abs'], j['sim_dx_max_abs'], j['sim_dy_max_abs'], j['sim_rot_max_abs_deg'], j['feat_px_over_first_max']))
