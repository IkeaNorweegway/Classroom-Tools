# Render queue — assessments

Sources written but not yet rendered to `public/materials/`. Render from the repo root with the Perl port (runs in Git Bash) or the Python original. Python 3.15 is installed through `uv`, and the `python` on PATH is a Windows Store stub, so use the full path:

```
perl scripts/render_assessments.pl                  # every released exit and quiz
perl scripts/render_assessments.pl <file.md> ...    # just these
/c/Users/Ejan.Bremness/AppData/Roaming/uv/python/cpython-3.15-windows-x86_64-none/python.exe scripts/render_assessments.py <file.md> ...
```

With no arguments it renders every released exit and quiz under `tests-quizzes/` and overwrites any existing HTML of the same name, so check the list before running it without arguments. Unit tests and answer keys are skipped unless you pass `--out`. Then open each new HTML file in a browser before committing.

## Waiting for a render

Status update: every released exit ticket and quiz source now has a render in `public/materials/` (55 new files, untracked, not yet committed). Unit tests and answer keys were rendered to `../test-renders` (outside the repo, for the Drive folder). `stack_fractions.py` has been run on all of them. Each new file still needs a browser check before commit, and the site wiring (manifest and allow-list) is still to do.

The table below is the original list, kept for reference.

| Source | Output | Status |
|---|---|---|
| `tests-quizzes/grade-6-science/matter/sci6-matter-exits-v1.md` | `public/materials/sci6-matter-exits-v1.html` | Rendered with the Perl port (structure checked: 4 tickets, 4 LO lines, no stray markdown). Visual check in a browser still to do |
| `tests-quizzes/grade-6-science/forces/sci6-forces-exits-v1.md` | `public/materials/sci6-forces-exits-v1.html` | Rendered with the Perl port. Visual check still to do |
| `tests-quizzes/grade-8-social/*/soc8-*-exits-v1.md` (4 files) | `public/materials/soc8-*-exits-v1.html` | Rendered with the Perl port. Visual check still to do |

## Not on the site yet

Rendering a file does not put it on the site. Each new exit ticket also needs:

1. an entry in the course's manifest (`src/data/science6.ts`, `social8.ts`, `social9.ts`, `math9.ts`), and
2. the document name added to the unit's allow-list in `src/pages/*/view/[unit]/[doc].astro`, or the viewer will refuse to serve it.

Both are done in the same commit as the render, once the HTML is checked.

## Known limits of the script

- The Perl port (`render_assessments.pl`) was checked against the Python script's rules by reading both, and on the Grade 6 Matter pilot. It has not been compared byte for byte with the Python output (Python isn't installed here to run it). Line endings differ: the Perl port writes `\n`, Python on Windows writes `\r\n`.
- It does not handle tables or nested lists. Exit tickets and quizzes don't use them.

## Added: unit tests and answer keys (for the Google Drive folder, not the site)

Unit tests are unreleased. Render them for the Drive folder only. The script refuses to write tests into `public/materials/`: give an output folder outside the repo with `--out`, for example `python3 scripts/render_assessments.py --out ../test-renders <file>`.

Files, passed as paths with `--out` (the Grade 8 Social tests already include their answer key at the end):

- `tests-quizzes/grade-6-science/*/sci6-*-test-v1.md` and `*-test-answers-v1.md` (6 + 6)
- `tests-quizzes/math-9/*/math9-*-test-v1.md` and `*-test-answers-v1.md` (10 + 10)
- `tests-quizzes/grade-9-social/*/soc9-*-test-v1.md` and `*-test-answers-v1.md` (7 + 7)
- `tests-quizzes/grade-8-social/*/soc8-*-test-v1.md` (4, key included)

Quiz answer keys are also in this run: `*-quiz-answers-v1.md`. Keep them out of student copies.
