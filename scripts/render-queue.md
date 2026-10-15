# Render queue — assessments

Sources written but not yet rendered to `public/materials/`. Run these on a machine with Python 3 (see `scripts/_context.md`), from the repo root:

```
python3 scripts/render_assessments.py
```

With no arguments that renders every exit, quiz, test and answer-key source under `tests-quizzes/`. Then open each new HTML file in a browser before committing.

## Waiting for a render

| Source | Output | Status |
|---|---|---|
| `tests-quizzes/grade-6-science/matter/sci6-matter-exits-v1.md` | `public/materials/sci6-matter-exits-v1.html` | Pilot — check the output first |
| `tests-quizzes/grade-6-science/forces/sci6-forces-exits-v1.md` | `public/materials/sci6-forces-exits-v1.html` | Source exists, never rendered |
| `tests-quizzes/grade-8-social/*/soc8-*-exits-v1.md` | `public/materials/soc8-*-exits-v1.html` | Source exists, never rendered |

## Not on the site yet

Rendering a file does not put it on the site. Each new exit ticket also needs:

1. an entry in the course's manifest (`src/data/science6.ts`, `social8.ts`, `social9.ts`, `math9.ts`), and
2. the document name added to the unit's allow-list in `src/pages/*/view/[unit]/[doc].astro`, or the viewer will refuse to serve it.

Both are done in the same commit as the render, once the HTML is checked.

## Known limits of the script

- Written without being run here. If the output looks wrong, send the first few lines of the source file and the HTML it produced.
- It does not handle tables or nested lists. Exit tickets and quizzes don't use them.

## Added: unit tests and answer keys (for the Google Drive folder, not the site)

Unit tests are unreleased. Render them for the Drive folder only; do not publish them to `public/materials/`.

Run `python3 scripts/render_assessments.py` for the Grade 6 Science, Grade 9 Social and Math 9 folders, and the same for the Grade 8 Social test files (these already contain their answer key at the end). Files:

- `tests-quizzes/grade-6-science/*/sci6-*-test-v1.md` and `*-test-answers-v1.md` (6 + 6)
- `tests-quizzes/math-9/*/math9-*-test-v1.md` and `*-test-answers-v1.md` (10 + 10)
- `tests-quizzes/grade-9-social/*/soc9-*-test-v1.md` and `*-test-answers-v1.md` (7 + 7)
- `tests-quizzes/grade-8-social/*/soc8-*-test-v1.md` (4, key included)

Quiz answer keys are also in this run: `*-quiz-answers-v1.md`. Keep them out of student copies.
