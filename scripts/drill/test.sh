#!/bin/sh
# Headless Chrome tests for the narrow trainers (Git Bash on Windows; Chrome at the usual path).
#   sh scripts/drill/test.sh [pages]    model + UI tests, then layout at 3 sizes
# Prints only failures, then a count. Test copies go in scripts/drill/t/ (ignored by git).
cd "$(dirname "$0")"
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"

mkdir -p t
run() { "$CH" --headless=new --disable-gpu --window-size=$2 --virtual-time-budget=8000 --dump-dom "file:///$(cygpath -m "$PWD/$1")?debug=1" 2>/dev/null | sed -n '/<pre id="results">/,/<\/pre>/p' | sed 's/<[^>]*>//g'; }
. ./pages.sh
for k in ${@:-$PAGES}; do [ -f model-$k.js ] || continue; n=$(name $k)

  { sed 's#<script>#<script>window.__errs=[];window.addEventListener("error",e=>window.__errs.push(e.message+" @"+e.lineno));#' "$(dir $k)/$n.html" | sed '/<\/body>/,$d'; cat extra-$k.js test-common.js; printf '</body></html>\n'; } > t/$n.html
  { sed '/<\/body>/,$d' "$(dir $k)/$n.html"; cat extra-$k.js layout.js; printf '</body></html>\n'; } > t/$n-lay.html
  r=$(run t/$n.html 1366,734); echo "$n: $(echo "$r" | grep -c '^PASS') pass"; echo "$r" | grep '^FAIL'
  for sz in 1366,734 1000,700 1280,600; do run t/$n-lay.html $sz | grep '^FAIL' | grep -v 'mono .*slots wrap'; done
done
