#!/bin/sh
# Play CEFL Town v2 with the play-through probe (godot/story-engine/tests/playtest/probe.gd) and keep what it saw.
# Read-only on the game: saves go to a throwaway folder inside OUTDIR, never to your real Godot saves.
#
#   scripts/playtest_town2.sh OUTDIR "auto=right seed=7" "auto=wrong mode=real seed=12 pick=rand" "auto=right seed=3 stop=d2_order"
#
# Each quoted play is a list of probe options (see the top of probe.gd). A play with stop=<step> runs twice:
# up to that step (saved), then resumed from the save (…/a and …/b), plus once unbroken to compare (…/c).
# OUTDIR/<play>/ gets transcript.jsonl, nav.jsonl, maps.txt, summary.json, stdout.txt (AUTO-RESULT, errors).
# OUTDIR/version.txt names the game version played; OUTDIR/digest.md (scripts/playtest_digest.py) is the readable summary. Used by the playtest agent (.claude/agents/playtest.md).
set -u
[ $# -ge 2 ] || { echo "usage: $0 OUTDIR \"auto=right seed=7\" [more plays…]"; exit 2; }
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJ="$ROOT/godot/story-engine"
GODOT=${GODOT:-$HOME/.local/bin/godot}
OUT="$1"; shift
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"
export XDG_DATA_HOME="$OUT/.userdata"     # keeps test saves away from real ones
mkdir -p "$XDG_DATA_HOME"
"$GODOT" --headless --path "$PROJ" --import >/dev/null 2>&1 || true
git -C "$ROOT" log -1 --format='%h %cs %s' -- godot/story-engine > "$OUT/version.txt"
git -C "$ROOT" status --porcelain -- godot/story-engine/engine godot/story-engine/games | sed 's/^/uncommitted: /' >> "$OUT/version.txt"

play() {   # play DIR OPTIONS…
	dir="$1"; shift
	mkdir -p "$dir"
	timeout 600 "$GODOT" --headless --path "$PROJ" res://tests/playtest/probe.tscn -- game=demo debug=1 quit=1 out="$dir" "$@" > "$dir/stdout.txt" 2>&1
	echo "exit $?" >> "$dir/stdout.txt"
}

for p in "$@"; do
	name=$(echo "$p" | tr ' =' '_-')
	stop=$(echo "$p" | tr ' ' '\n' | sed -n 's/^stop=//p')
	# shellcheck disable=SC2086
	if [ -n "$stop" ]; then
		rm -rf "$XDG_DATA_HOME"; mkdir -p "$XDG_DATA_HOME"
		play "$OUT/$name/a" $p save=1
		rest=$(echo "$p" | tr ' ' '\n' | grep -v '^stop=' | tr '\n' ' ')
		play "$OUT/$name/b" $rest save=1 resume=1
		play "$OUT/$name/c" $rest
	else
		play "$OUT/$name" $p
	fi
	echo "played: $p"
done
python3 "$ROOT/scripts/playtest_digest.py" "$OUT"
