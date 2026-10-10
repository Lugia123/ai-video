#!/bin/bash
cd "$(dirname "$0")/.."; export V=_v2
for n in wave_h1-blank2-draft-s1 think_h1-blank2-draft-s1 wave_h2-blank2-draft-s1 think_h2-blank2-draft-s1 wave_h3-blank2-draft-s1 shrug_h1-blank2-draft-s1 wave_h1-blank2-draft-s2 think_h1-blank2-draft-s2; do
  until [ -f raw/$n.mp4 ]; do sleep 5; done; sleep 3
  gen/after_all.sh $n > readings/$n.after.txt 2>&1; echo "done $n" >> readings/watch2.log
done
