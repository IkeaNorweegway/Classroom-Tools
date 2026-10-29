# Page list for build.sh, test.sh and shot.sh: short key -> published file name, output folder, extra shared parts.
PAGES="lr le po pe rn sr cg me si st pr pat eco pla hea str ear"
name() { case $1 in
  lr) echo math9-linear-relations-trainer-v1;; le) echo math9-linear-equations-trainer-v2;; po) echo math9-polynomials-trainer-v2;;
  pe) echo math9-powers-exponents-trainer-v1;; rn) echo math9-rational-numbers-trainer-v1;; sr) echo math9-square-roots-trainer-v1;;
  cg) echo math9-circle-geometry-trainer-v1;; me) echo math9-measurement-trainer-v1;; si) echo math9-similarity-trainer-v1;;
  st) echo math9-statistics-trainer-v1;; pr) echo math9-probability-trainer-v1;; pat) echo math9-pat-trainer-v1;;
  eco) echo sci7-interactions-ecosystems-trainer-v1;; pla) echo sci7-plants-food-fibre-trainer-v1;; hea) echo sci7-heat-temperature-trainer-v1;;
  str) echo sci7-structures-forces-trainer-v1;; ear) echo sci7-planet-earth-trainer-v1;;
esac; }
# Science 7 pages go flat in public/materials and add the science kit (icon cards, arrows, sorting bins).
dir() { case $1 in eco|pla|hea|str|ear) echo ../../public/materials;; *) echo ../../public/materials/math-9/practice;; esac; }
libs() { case $1 in eco|pla|hea|str|ear) echo sci.js;; esac; }
