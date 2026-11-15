<!-- Replace all [BRACKETED] items with real content -->
<!-- Claude fills this in. A cheaper model (DeepSeek, Qwen, etc. in Kilo) carries it out. Claude reviews the diff. -->
<!-- Save as handoffs/[YYYY-MM-DD]-[short-name].md (gitignored). -->

# Handoff: [short name]

**Branch:** `handoff/[short-name]` (create it from `[base branch]` before starting)
**Kind of work:** [sweep / render-script edit / site wiring / search / question-bank draft]

## The task in one sentence
[What changes, in plain words. One sentence. If it needs two, split the handoff.]

## Files
Touch only these:
- [path or glob]
- [path or glob]

Read for reference, do not edit:
- [path, e.g. scripts/_context.md]

## The rule
[The rule stated so a stranger could apply it. Exact strings, class names, values.]

## One finished example
Before (`[file]`, lines [N–M]):
```
[before]
```
After:
```
[after]
```

## Do not
- Change questions, answers, keys, numbers in diagrams, outcome codes or student-facing wording
- Hand-edit rendered files in `public/materials/` unless they are HTML-first (games, sims, trainers, prereq practice). Change the script and re-render
- Touch files not listed above, rename or delete anything, commit or push
- [task-specific limits]

If a file needs a content change to fit the rule, skip it and list it under Skipped.

## Done means
Run, in order, and all must pass:
1. `[command, e.g. npm run build]`
2. `[command, e.g. perl scripts/render_math8.pl ... ]`
3. `git diff --stat` shows only the files listed above

## Report back
Append to the bottom of this file:
- **Changed:** [count] files: [list]
- **Skipped:** [file: reason]
- **Checks:** [each command: pass / fail + first error line]
- **Questions:** [anything unclear — do not guess on these]

---

## Review (Claude fills this in after)
- [ ] Diff matches the rule on every file
- [ ] No content changes (questions, answers, wording, codes)
- [ ] Checks re-run and pass
- [ ] Skipped files dealt with
- Verdict: [merge / fix list / discard branch]
