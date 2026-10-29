#!/bin/sh
# Screenshot one tab in one state:  sh scripts/drill/shot.sh pe "tab=base&do=show&seed=3" [WxH]
# do = ask | wrong | wrong2 | right | show. Writes scripts/drill/t/shots/<page>-<tab>-<do>.png (ignored by git).
cd "$(dirname "$0")"; . ./pages.sh
k=$1; hash=$2; size=${3:-1366,734}; n=$(name $k)
mkdir -p t/shots
{ sed '/<\/body>/,$d' ../../public/materials/math-9/practice/$n.html; cat extra-$k.js shot-inject.js; printf '</body></html>\n'; } > t/$n-shot.html
tab=$(echo "$hash" | sed 's/.*tab=\([^&]*\).*/\1/'); d=$(echo "$hash" | sed -n 's/.*do=\([^&]*\).*/\1/p')
out="t/shots/$k-$tab-${d:-ask}.png"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=$size --virtual-time-budget=3000 --screenshot="$(cygpath -m "$PWD/$out")" "file:///$(cygpath -m "$PWD/t/$n-shot.html")?debug=1#$hash" >/dev/null 2>&1
echo "$PWD/$out"
