#!/bin/sh
# Stitch the Math 9 narrow trainers from the shared shell and each page's parts.
#   sh scripts/drill/build.sh            build all
#   sh scripts/drill/build.sh lr pe      build some (lr le po pe rn sr)
# Parts: top-<p>.html (head + header comment), shell-css.html, kit.js, model-<p>.js, shell.js, view-<p>.js, tail.html.
cd "$(dirname "$0")"
OUT=../../public/materials/math-9/practice
. ./pages.sh
for p in ${@:-$PAGES}; do
  f="$OUT/$(name $p).html"
  cat top-$p.html shell-css.html kit.js model-$p.js shell.js view-$p.js tail.html > "$f"
  echo "built $f"
done
