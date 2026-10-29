# Page list for build.sh and test.sh: short key -> published file name.
PAGES="lr le po pe rn sr"
name() { case $1 in
  lr) echo math9-linear-relations-trainer-v1;; le) echo math9-linear-equations-trainer-v2;; po) echo math9-polynomials-trainer-v2;;
  pe) echo math9-powers-exponents-trainer-v1;; rn) echo math9-rational-numbers-trainer-v1;; sr) echo math9-square-roots-trainer-v1;;
esac; }
