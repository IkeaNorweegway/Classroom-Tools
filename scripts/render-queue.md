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
