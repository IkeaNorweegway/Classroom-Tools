#!/bin/sh
# Stitch the Math 9 narrow trainers from the shared shell and each page's parts.
#   sh scripts/drill/build.sh            build all three
#   sh scripts/drill/build.sh lr         build one (lr, le, po)
# Parts: top-<p>.html (head + header comment), shell-css.html, kit.js, model-<p>.js, shell.js, view-<p>.js, tail.html.
cd "$(dirname "$0")"
OUT=../../public/materials/math-9/practice
name() { case $1 in lr) echo math9-linear-relations-trainer-v1;; le) echo math9-linear-equations-trainer-v2;; po) echo math9-polynomials-trainer-v2;; esac; }
for p in ${1:-lr le po}; do
  f="$OUT/$(name $p).html"
  cat top-$p.html shell-css.html kit.js model-$p.js shell.js view-$p.js tail.html > "$f"
  echo "built $f"
done
