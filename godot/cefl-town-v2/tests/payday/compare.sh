#!/bin/sh
# Checks the Godot Payday model against v1's JavaScript, cent for cent, on 540 runs (every worker, job and play style).
set -e
cd "$(dirname "$0")"
GODOT=${GODOT:-$HOME/.local/bin/godot}
T=$(mktemp -d)
node v1_ref.cjs > "$T/v1.json"
"$GODOT" --headless --path ../.. -s res://tests/test_payday.gd -- dump="$T/v2.json" >/dev/null 2>&1
python3 - "$T/v1.json" "$T/v2.json" <<'PY'
import json, sys
a, b = (json.load(open(f)) for f in sys.argv[1:3])
def norm(x):
    if isinstance(x, float) and x.is_integer(): return int(x)
    if isinstance(x, dict): return {k: norm(v) for k, v in x.items()}
    if isinstance(x, list): return [norm(v) for v in x]
    return x
a, b = norm(a), norm(b)
bad = 0
for ra, rb in zip(a["runs"], b["runs"]):
    for k in ("out", "strikes", "covered"):
        if ra[k] != rb[k]: bad += 1; print("run", ra["wk"], ra["jk"], ra["seed"], k, ra[k], rb[k]) if bad < 20 else None
    for sa, sb in zip(ra["steps"], rb["steps"]):
        for k in sa:
            if sa[k] != sb[k]:
                bad += 1
                if bad < 20: print("run", ra["wk"], ra["jk"], ra["seed"], "p", sa["p"], k, "v1", sa[k], "v2", sb[k])
for k in ("story", "card"):
    if a[k] != b[k]: bad += 1; print(k, a[k], b[k])
print("PAYDAY v1 vs v2: %d runs, %d differences" % (len(a["runs"]), bad))
sys.exit(1 if bad or len(a["runs"]) != len(b["runs"]) else 0)
PY
rm -rf "$T"
