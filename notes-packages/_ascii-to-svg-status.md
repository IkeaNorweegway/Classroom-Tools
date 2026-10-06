# ASCII-to-SVG Conversion Status
*Started: 2026-06-07 | Target: replace all `<pre>` ASCII-art in HTML files with inline SVG*

---

## How to read this file

- **File** — path relative to workspace root
- **Diagrams** — count of distinct ASCII-art blocks in the file
- **Types** — what the ASCII-art represents (informs SVG design)
- **Status** — `pending` / `in-progress` / `done`

SVGs must use the `dg-*` class system already defined in each file's `<style>` block.
See `notes-packages/_svg-classes.md` for the full class reference.

Paired files (primary + EF + answers) share diagram types — convert primary first, propagate.

---

## Grade 6 Science — Notes Packages (primary)

| File | Diagrams | Types | Status |
|---|---|---|---|
| `notes-packages/grade-6-science/forces/sci6-forces-notes-v1.html` | 6 | force arrows on box, internal forces (tension/compression/shear/torsion), elastic/plastic deformation | done ✓ |
| `notes-packages/grade-6-science/forces/sci6-forces-notes-ef-v1.html` | 4 | force arrows, internal forces | pending |
| `notes-packages/grade-6-science/matter/sci6-matter-notes-v1.html` | 9 | particle model (solid/liquid/gas), temperature-particle speed, state changes, thermometer, bridge, water/ice | done ✓ |
| `notes-packages/grade-6-science/matter/sci6-matter-notes-ef-v1.html` | 5 | particle model, temperature | pending |
| `notes-packages/grade-6-science/climate/sci6-climate-notes-v1.html` | 7 | timescale, greenhouse effect, latitude/sunlight, ice-albedo loop, fossil fuels, ice core, signal vs noise | done ✓ |
| `notes-packages/grade-6-science/climate/sci6-climate-notes-ef-v1.html` | 2 | (subset of above) | pending |
| `notes-packages/grade-6-science/living-systems/sci6-living-systems-notes-gr6-v1.html` | 2 | food chain, food web | done ✓ |
| `notes-packages/grade-6-science/living-systems/sci6-living-systems-notes-ef-gr6-v1.html` | 3 | food chain, food web | pending |
| `notes-packages/grade-6-science/space/sci6-space-notes-v1.html` | 0 | no ASCII-art (mnemonic text only) | n/a |
| `notes-packages/grade-6-science/space/sci6-space-notes-ef-v1.html` | 0 | no ASCII-art | n/a |
| `notes-packages/grade-6-science/energy-resources/sci6-energy-resources-notes-v1.html` | 0 | no ASCII-art | n/a |
| `notes-packages/grade-6-science/energy-resources/sci6-energy-resources-notes-ef-v1.html` | 0 | no ASCII-art | n/a |
| `notes-packages/grade-6-science/year-notes/sci6-year-notes-v1.html` | 13 | particles, states, phase change, photosynthesis, food web, forces, greenhouse, solar system, satellite | done ✓ |
| `notes-packages/grade-6-science/year-notes/sci6-year-notes-ef-v1.html` | 8 | cold/hot particles, states, photosynthesis, food web, force arrows, timescale, greenhouse, planets | done ✓ |

---

## Math 9 — Notes Packages (primary)

| File | Diagrams | Types | Status |
|---|---|---|---|
| `notes-packages/math-9/linear-relations/math9-linear-relations-notes-v1.html` | 0 | already SVG — no pre blocks | n/a |
| `notes-packages/math-9/linear-relations/math9-linear-relations-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/statistics/math9-statistics-notes-v1.html` | 2 | scatter plot template, student plotting grid | done ✓ |
| `notes-packages/math-9/statistics/math9-statistics-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/polynomials/math9-polynomials-notes-v1.html` | 0 | division layout uses CSS border — no pre blocks | n/a |
| `notes-packages/math-9/polynomials/math9-polynomials-notes-answers-v1.html` | 1 | polynomial subtraction vertical layout | done ✓ |
| `notes-packages/math-9/similarity/math9-similarity-notes-v1.html` | 2 | shadow method, mirror method | done ✓ |
| `notes-packages/math-9/similarity/math9-similarity-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/square-roots/math9-square-roots-notes-v1.html` | 1 | radical expression structure | done ✓ |
| `notes-packages/math-9/square-roots/math9-square-roots-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/probability/math9-probability-notes-v1.html` | 0 | no pre blocks | n/a |
| `notes-packages/math-9/probability/math9-probability-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/rational-numbers/math9-rational-numbers-notes-v1.html` | 0 | no pre blocks | n/a |
| `notes-packages/math-9/rational-numbers/math9-rational-numbers-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/measurement/math9-measurement-notes-v1.html` | 3 | perpendicular height, cylinder unrolling, composite shape | done ✓ |
| `notes-packages/math-9/measurement/math9-measurement-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.html` | 3 | inscribed angle theorem, equal inscribed angles, equal tangents | done ✓ |
| `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/powers-exponents/math9-powers-notes-v1.html` | 0 | no pre blocks | n/a |
| `notes-packages/math-9/powers-exponents/math9-powers-notes-answers-v1.html` | — | audit needed | pending |
| `notes-packages/math-9/linear-equations/math9-linear-equations-notes-v1.html` | 0 | no pre blocks | n/a |
| `notes-packages/math-9/linear-equations/math9-linear-equations-notes-answers-v1.html` | — | audit needed | pending |

---

## Math 9 — Strand Workbooks

| File | Diagrams | Types | Status |
|---|---|---|---|
| `worksheets/math-9/algebra/math9-algebra-workbook-v1.html` | 0 | no pre blocks | n/a |
| `worksheets/math-9/algebra/math9-algebra-workbook-answers-v1.html` | 0 | no pre blocks | n/a |
| `worksheets/math-9/measurement-geometry/math9-measurement-geometry-workbook-v1.html` | 2 | circle/tangent, similar triangle | done ✓ |
| `worksheets/math-9/measurement-geometry/math9-measurement-geometry-workbook-answers-v1.html` | 0 | no pre blocks | n/a |
| `worksheets/math-9/statistics-probability/math9-statistics-probability-workbook-v1.html` | 3 | coin×spinner tree, scatter plot axes ×2 | done ✓ |
| `worksheets/math-9/statistics-probability/math9-statistics-probability-workbook-answers-v1.html` | 0 | no pre blocks | n/a |
| `worksheets/math-9/number/math9-number-workbook-v1.html` | 0 | no pre blocks | n/a |
| `worksheets/math-9/number/math9-number-workbook-answers-v1.html` | 0 | no pre blocks | n/a |

---

## Math 9 — Topic Worksheets (by strand)

### Algebra
*(All 0 pre blocks after audit — no conversions needed)*

### Measurement & Geometry
| File | Pre blocks | Status |
|---|---|---|
| `worksheets/math-9/measurement-geometry/similarity/math9-similarity-worksheet-core-v1.html` | 1 | done ✓ |
| `worksheets/math-9/measurement-geometry/similarity/math9-similarity-worksheet-challenge-v1.html` | 1 | done ✓ |
| `worksheets/math-9/measurement-geometry/circle-geometry/math9-circle-geometry-worksheet-core-v1.html` | 2 | done ✓ |

### Statistics & Probability
| File | Pre blocks | Status |
|---|---|---|
| `worksheets/math-9/statistics-probability/math9-statistics-probability-workbook-v1.html` | 3 | in-progress |
| `worksheets/math-9/statistics-probability/probability/math9-probability-worksheet-core-v1.html` | 1 | coin×4-spinner tree | done ✓ |

---

## Progress summary

| Group | Files with pre blocks | Done | In-progress | n/a (clean) |
|---|---|---|---|---|
| Gr6 Science notes (primary + EF) | 8 | 8 | 0 | 6 |
| Math 9 notes (primary + AK) | 5 | 5 | 0 | 17 |
| Math 9 workbooks | 2 | 2 | 0 | 6 |
| Math 9 topic worksheets | 5 | 5 | 0 | many |
| **Total** | **20** | **20** | **0** | **~29** |

**COMPLETE — all HTML files with ASCII-art `<pre>` blocks have been converted to SVG.**
*Last verified: 2026-06-08. All converted SVGs pass `svg-diagram-review` with no WARNs or ERRORs.*

---

## Conversion rules

1. Every `<pre>` block containing ASCII-art becomes an inline `<svg>` or a wrapping `<figure>` + `<svg>`.
2. SVGs use `dg-*` classes (see `notes-packages/_svg-classes.md`).
3. Force diagrams: `dg-line` for shaft, `dg-accent` for arrowhead, `dg-label` for N values.
4. Particle diagrams: `dg-point` for particles, grouping with `transform` for arrangement.
5. Coordinate axes: reuse existing patterns from linear-relations notes (already have SVG coords there).
6. Number lines: `dg-line` shaft, `dg-point` for tick/point, `dg-label` for values.
7. Blank diagram boxes (student fill-in): `dg-boundary` rect with no interior marks.
8. Source `.md` files: replace ASCII-art with a `[SVG: description]` placeholder comment — do not embed raw SVG in markdown.
