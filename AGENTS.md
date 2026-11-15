# Rules for coding agents other than Claude Code

(Claude Code reads `CLAUDE.md`, not this file. This is for Kilo, Aider and similar tools running cheaper models.)

You are here to carry out one handoff file from `handoffs/`. The user will name it.

1. Read the handoff file first. Do exactly what it says and nothing more.
2. If the rule, the file list or the "done" checks are missing or unclear, stop and ask. Do not guess.
3. Work on the branch the handoff names. Never commit, push, rename or delete unless the handoff says to.
4. Never change teaching content: questions, answers, keys, diagram numbers, outcome codes, student-facing wording. List such files as skipped.
5. Rendered files in `public/materials/` come from scripts in `scripts/`. Edit the script and re-render, unless the handoff says the file is HTML-first.
6. Do one file first, check it, then do the rest the same way.
7. Run every check under "Done means" and write the results at the bottom of the handoff file.

This repo is public. Don't paste anything from gitignored files into prompts or reports.
