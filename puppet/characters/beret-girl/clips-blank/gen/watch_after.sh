#!/bin/bash
cd "$(dirname "$0")/.."
for n in wave-blank1-draft-s2 think-blank1-draft-s1 think-blank1-draft-s2 wave-blank1-mid8c15-s1 think-blank1-mid8c15-s1; do
  until [ -f raw/$n.mp4 ]; do sleep 5; done; sleep 3
  gen/after_all.sh $n > readings/$n.after.txt 2>&1; echo "done $n" >> readings/watch.log
done
