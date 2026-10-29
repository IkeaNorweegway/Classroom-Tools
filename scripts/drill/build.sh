#!/bin/sh
# Stitch the narrow trainers (Math 9 and Science 7) from the shared shell and each page's parts.
#   sh scripts/drill/build.sh            build all
#   sh scripts/drill/build.sh lr eco     build some (keys in pages.sh)
# Parts: top-<p>.html (head + header comment), shell-css.html, kit.js, model-<p>.js, shell.js, [sci.js], view-<p>.js, tail.html.
cd "$(dirname "$0")"
. ./pages.sh
for p in ${@:-$PAGES}; do
  [ -f model-$p.js ] || continue
  f="$(dir $p)/$(name $p).html"
  cat top-$p.html shell-css.html kit.js model-$p.js shell.js $(libs $p) view-$p.js tail.html > "$f"
  echo "built $f"
done
