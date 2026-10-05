# SVG Diagram Class System — Reference

CSS classes and custom properties for all SVG diagrams in HTML notes packages.
Copy the CSS snippet into the `<style>` block of any notes HTML file.

---

## CSS snippet (paste into `<style>` block)

```css
/* ─── SVG Diagram Design System (dg-* classes) ─────────── */
:root {
  --dg-stroke:    #334155;             /* primary: shapes, lines, point labels */
  --dg-fill:      #f8fafc;             /* shape interior fill */
  --dg-accent:    var(--accent, #1d4ed8); /* highlighted elements — inherits unit colour */
  --dg-secondary: #64748b;             /* secondary / annotation text */
  --dg-muted:     #94a3b8;             /* faint construction lines */
  --dg-sw:        1.5px;               /* standard stroke width */
  --dg-sw-bold:   2.5px;               /* bold stroke (key elements) */
  --dg-sw-thin:   1.0px;               /* thin stroke (right-angle marks) */
}

/* Non-scaling strokes: crisp at any size — browser zoom, print, PDF export */
svg .dg-boundary, svg .dg-line, svg .dg-accent, svg .dg-grid,
svg .dg-dashed, svg .dg-right-angle, svg .dg-construction {
  vector-effect: non-scaling-stroke;
}

svg .dg-boundary    { stroke: var(--dg-stroke);    fill: var(--dg-fill);  stroke-width: var(--dg-sw); }
svg .dg-line        { stroke: var(--dg-stroke);    fill: none;            stroke-width: var(--dg-sw); }
svg .dg-accent      { stroke: var(--dg-accent);    fill: none;            stroke-width: var(--dg-sw-bold); }
svg .dg-dashed      { stroke: var(--dg-secondary); fill: none;            stroke-width: var(--dg-sw); stroke-dasharray: 5 3; }
svg .dg-right-angle { stroke: var(--dg-stroke);    fill: none;            stroke-width: var(--dg-sw-thin); }
svg .dg-construction{ stroke: var(--dg-muted);     fill: none;            stroke-width: var(--dg-sw-thin); stroke-dasharray: 2 3; }
svg .dg-grid        { stroke: var(--dg-muted);     fill: none;            stroke-width: var(--dg-sw-thin); }
svg .dg-point       { fill: var(--dg-stroke);      stroke: none; }
svg .dg-point-accent{ fill: var(--dg-accent);      stroke: none; }
svg .dg-label       { font: 12px/1.3 system-ui, sans-serif; fill: var(--dg-stroke);    stroke: none; }
svg .dg-label-sm    { font: 11px/1.3 system-ui, sans-serif; fill: var(--dg-secondary); stroke: none; }
svg .dg-label-accent{ font: 11px/1.3 system-ui, sans-serif; fill: var(--dg-accent);    stroke: none; font-weight: 600; }
```

---

## Class vocabulary

| Class | What it represents | Applies to |
|---|---|---|
| `dg-boundary` | Shape outline: gray stroke + light fill | `<circle>`, `<rect>`, `<ellipse>`, `<polygon>` |
| `dg-line` | Standard line: gray, standard weight | `<line>`, `<path>`, `<polyline>` |
| `dg-accent` | Highlighted element: unit colour, bold stroke | `<line>`, `<path>`, `<circle>` |
| `dg-dashed` | Secondary/guide: gray, dashed | `<line>`, `<path>` |
| `dg-right-angle` | Right-angle mark: thin gray | `<polyline>`, `<path>` |
| `dg-construction` | Faint guide: muted, fine dash | `<line>`, `<path>` — geometry construction lines only |
| `dg-grid` | Chart grid / connector: muted, solid, thin | `<line>` — chart grid lines, tree diagram branches |
| `dg-point` | Filled vertex dot: gray | `<circle>` with small r (2–3px) |
| `dg-point-accent` | Highlighted vertex dot: unit colour | `<circle>` with small r (2–3px) |
| `dg-label` | Point label: 12px gray | `<text>` for vertex/point names |
| `dg-label-sm` | Annotation: 11px muted gray | `<text>` for secondary annotations |
| `dg-label-accent` | Accent annotation: 11px unit colour, semi-bold | `<text>` for labelled key elements |

---

## Unit colour theming

`--dg-accent` inherits from `--accent`. Set `--accent` once in `:root` and every accent-class element updates automatically:

```css
/* Math 9 (blue) */
:root { --accent: #1d4ed8; --accent-light: #eff6ff; --accent-mid: #3b82f6; }

/* Science 6 — Matter (cyan) */
:root { --accent: #0e7490; --accent-light: #ecfeff; --accent-mid: #22d3ee; }

/* Science 6 — Living Systems (emerald) */
:root { --accent: #16a34a; --accent-light: #f0fdf4; --accent-mid: #22c55e; }

/* Science 6 — Forces (violet) */
:root { --accent: #7c3aed; --accent-light: #f5f3ff; --accent-mid: #8b5cf6; }
```

No SVG markup changes needed when switching units — change one variable, every diagram updates.

---

## What stays as an element attribute

The `dg-*` system controls colour, stroke width, and font. Everything positional or structural stays on the element:

| Keep as attribute | Reason |
|---|---|
| `cx`, `cy`, `r`, `x1`, `y1`, `x2`, `y2`, `d`, `points` | Geometry — layout breaks without these |
| `viewBox`, `width`, `height`, `role`, `aria-label` | SVG structure |
| `text-anchor`, `dominant-baseline` | Text alignment |
| `font-weight="700"` | Semantically meaningful bold (titles, key terms) |

**The rule:** If you can change it with CSS and nothing breaks, put it in CSS. If removing it would break layout or structure, keep it on the element.

---

## Before and after

**Before (inline attributes):**
```html
<circle cx="175" cy="180" r="115" stroke="#334155" stroke-width="1.5" fill="#f8fafc"/>
<line x1="60" y1="180" x2="290" y2="180" stroke="#1d4ed8" stroke-width="1.8"/>
<polyline points="183,65 183,73 175,73" fill="none" stroke="#334155" stroke-width="1.2"/>
<circle cx="175" cy="180" r="2.5" fill="#334155"/>
<text x="181" y="176" font-family="system-ui" font-size="12" fill="#334155">O</text>
<text x="175" y="170" text-anchor="middle" font-family="system-ui" font-size="11" fill="#1d4ed8">diameter (d)</text>
```

**After (`dg-*` classes):**
```html
<circle cx="175" cy="180" r="115" class="dg-boundary"/>
<line x1="60" y1="180" x2="290" y2="180" class="dg-accent"/>
<polyline points="183,65 183,73 175,73" class="dg-right-angle"/>
<circle cx="175" cy="180" r="2.5" class="dg-point"/>
<text x="181" y="176" class="dg-label">O</text>
<text x="175" y="170" text-anchor="middle" class="dg-label-accent">diameter (d)</text>
```

---

## Why `vector-effect: non-scaling-stroke`

Without it, SVG strokes scale with the `viewBox`. A `stroke-width: 1.5px` element inside a `viewBox="0 0 360 350"` SVG displayed at 180px wide renders at 0.75px — hairline. `non-scaling-stroke` keeps the rendered stroke width constant regardless of display size. Critical for print, where CSS-pixel-to-physical resolution is resolved at the print driver level.

---

## Reference implementation

`notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.html`

All 6 SVGs in this file use the `dg-*` system. Read it as the canonical example before building new diagrams.
