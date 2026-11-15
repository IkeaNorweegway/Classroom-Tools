#!/bin/sh
# Nightly CEFL Town v2 play-through: runs the playtest agent once, headless, with only the tools it needs.
# Started by ~/.config/systemd/user/cefl-playtest.timer (02:00, catches up after the machine was off). Run by hand the same way.
# The agent writes only to _playtest-review/ (git-ignored); this log goes to _playtest-review/runs/nightly.log.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
R="$ROOT/_playtest-review"
mkdir -p "$R/runs"
cd "$ROOT" || exit 1
export PATH="$HOME/.local/bin:$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
{
	echo "=== $(date '+%F %T') start"
	claude -p "Run the playtest agent: one nightly run, following .claude/agents/playtest.md exactly. Today is $(date +%F). Also play Realm (the Math 9 game) with the same player: scripts/playtest_town2.sh OUTDIR \"game=realm auto=right seed=1\" \"game=realm auto=wrong mode=real seed=2 pick=rand\" \"game=realm auto=second seed=3 pick=rand\" \"game=realm chapter=2 auto=right spots=1 seed=4\" \"game=realm chapter=2 auto=wrong mode=real seed=5 pick=rand\" (chapter=2 starts Chapter 2 with no Chapter 1 save; a game= option overrides the script's default game=demo)." \
		--agent playtest --model sonnet --permission-mode dontAsk --max-budget-usd 3 --no-session-persistence \
		--allowedTools "Read" "Grep" "Glob" \
			"Edit(_playtest-review/**)" "Write(_playtest-review/**)" \
			"Edit(//$R/**)" "Write(//$R/**)" \
			"Bash(scripts/playtest_town2.sh *)" "Bash($ROOT/scripts/playtest_town2.sh *)" \
			"Bash(git log *)" "Bash(git status *)" "Bash(date *)" "Bash(ls *)" \
			"Bash(rm -rf $R/plays/*)" "Bash(rm -rf _playtest-review/plays/*)"
	echo "=== $(date '+%F %T') end (exit $?)"
} >> "$R/runs/nightly.log" 2>&1
