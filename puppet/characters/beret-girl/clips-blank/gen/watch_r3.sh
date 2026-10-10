#!/bin/bash
cd "$(dirname "$0")/.."; export V=_v2
for n in $(for s in 3 4 5 6 7 8; do echo wave_h1-blank2-draft-s$s; done; for s in 3 4 5 6 7 8; do echo think_h1c-blank2-draft-s$s; done); do
  until [ -f raw/$n.mp4 ]; do sleep 5; done; sleep 3
  gen/after_all.sh $n > readings/$n.after.txt 2>&1; echo "done $n" >> readings/watch3.log
done
