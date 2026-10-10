#!/usr/bin/env python3
# /usr/bin/python3 gen/ctrl.py ctrl --image … --control … 等：地址和令牌由 tools/imggen/client.py 在进程内取（环境变量 / 缓存 / 服务器文件），只放进本进程环境，不打印、不写文件，再交给 pipeline/clips/imggen.py
import os, sys
R = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + '/../../../../..')
sys.path.insert(0, R + '/tools/imggen'); sys.path.insert(0, R + '/puppet/pipeline/clips')
import client as C, imggen as G
os.environ.setdefault('IMGGEN_URL', C.URL); os.environ.setdefault('IMGGEN_TOKEN', C.get_token())
sys.argv = ['imggen.py'] + sys.argv[1:]; G.main()
