# Teacher Notes — Format and Design Context
*Applies to all teacher notes documents, all subjects, all grades.*
*Read alongside `_meta-context.md` (what teacher guides contain) — this file governs how they look and behave.*

---

## Core Design Principle

A teacher notes document is a **teaching tool used mid-lesson**, not a document read at a desk. The format must serve one job: let a teacher find their place in two seconds and scan for the next action without reading.

**Three tests for every design decision:**

1. **The glance test** — Can a teacher find any flag or beat in under three seconds without reading?
2. **The lost-place test** — If a teacher looks away for 30 seconds, can they re-find their spot instantly?
3. **The scan test** — Do misconception flags visually pop off the page without needing to read the text around them?

If a design choice fails any of these, change it.

---

## What This Is Not

- Not a script. SHOW / SAY / CUE are prompts, not sentences to read aloud.
- Not a document read front-to-back. No teacher reads a lesson guide from line 1. The format exists for rapid navigation, not linear reading.
- Not a student document. The teacher banner at the top is required. Teacher-only content (misconceptions, answer guides, pacing notes) lives here freely.

---

## Document Structure

Every teacher notes document has these sections in this order:

| Section | Purpose |
|---|---|
| Teacher banner | Visual signal this is teacher-only |
| Title + subtitle | Subject, unit, "Teacher Notes Package · SHOW / SAY / CUE format" |
| How to Use This Document | One table: Label / What it contains. Stays brief. |
| Unit at a Glance | Lesson table: Lesson number / Content / Student notes section |
| Materials per Lesson | Bulleted list. Lesson-specific items called out explicitly. |
| Section dividers (h2) | One per curriculum section. Each section contains beats. |
| Beats (h3 + cards) | The core teaching units. See beat anatomy below. |
| Answer guides | Per section or per retrieval check. Green box. |
| Flags (inline) | Appear immediately before or after the beat they apply to. |

---

## Beat Anatomy

A beat is one teaching moment — one concept, one example, one cue. Every beat has three parts. Each part is a **separate visual card**, not inline text.

```
[Beat title — h3]

┌─ SHOW card (gray) ──────────────────┐
│ What is visible to students.         │
│ One thing per beat.                  │
└──────────────────────────────────────┘

┌─ SAY card (blue) ───────────────────┐
│ Key phrases and questions.           │
│ Answers to blanks in [brackets].     │
└──────────────────────────────────────┘

┌─ CUE card (indigo) ─────────────────┐
│ ★ Write / ✎ Draw / ⊡ Think / ↩ Check │
│ The exact student signal.            │
└──────────────────────────────────────┘
```

**The three cards must be visually distinct from each other and from surrounding prose.** If SHOW, SAY, and CUE blend together, the format has failed.

---

## Visual Language — Card Colors

Each card type has a fixed color identity. Never swap them.

| Card | Left border | Background | Label color |
|---|---|---|---|
| SHOW | `#64748b` (slate) | `#f8fafc` | `#475569` |
| SAY | `#0284c7` (blue) | `#f0f9ff` | `#0284c7` |
| CUE | `#6366f1` (indigo) | `#eef2ff` | `#4f46e5` |

---

## Visual Language — Flags

Flags are the highest-priority scan targets in the document. They must be **more visually prominent than any beat card** — a teacher skimming should catch a misconception flag before they catch the beat it sits next to.

| Flag type | Left border | Background | Label color | When to use |
|---|---|---|---|---|
| Misconception | `#dc2626` (red) | `#fef2f2` | `#dc2626` | A known wrong belief students bring that will cause errors if uncorrected. Not every lesson has one — only flag genuine misconceptions. |
| Pacing | `#d97706` (amber) | `#fffbeb` | `#b45309` | Moments where lessons historically stall or where time pressure is real. Include a specific time target or decision point. |
| CS Connection | `#0284c7` (blue) | `#f0f9ff` | `#0284c7` | Where computer science content is embedded. Grade 6 science only. |

**Flags are positioned immediately before or after the beat they apply to.** Never at the end of a section where they will be missed.

**Misconception flags must name:**
1. The specific wrong belief (one sentence)
2. What to do about it (one or two sentences — Socratic prompt, contrast move, or direct address)
3. When it recurs (if it appears in more than one beat)

---

## Visual Language — Answer Guides

Answer guides appear after retrieval checks or worked examples. They are green to signal "teacher-only correct answer."

| Property | Value |
|---|---|
| Background | `#f0fdf4` |
| Border | `1px solid #bbf7d0`, border-radius 8px |
| Label color | `#16a34a` |
| Label text | "Section X — Retrieval Check Answer Guide" or similar |

Answer guides contain the expected student response — specific enough to let a teacher confirm quickly, not so long they become reference reading.

---

## Typography

| Element | Spec |
|---|---|
| Body font | `'Segoe UI', system-ui, sans-serif` — never serif. Serif body text slows scanning. |
| Body size | `11pt` |
| Line height | `1.55` |
| Body color | `#1e293b` |
| Max width | `820px`, centered |
| h1 | `22pt`, bold, `#1e293b` |
| h2 (section header) | `14pt`, bold, accent color, **border-bottom** 2px accent-light — never a solid background banner |
| h3 (beat title) | `11.5pt`, bold, `#334155`, uppercase, letter-spacing `.04em` |
| h4 | `11pt`, bold, accent color |
| Muted / secondary text | `em` element, `color: #475569` |

**h2 must use a border-bottom treatment, not a solid color background banner.** A solid h2 banner breaks scanning — it acts as a visual stop sign. The border-bottom treatment marks a section while keeping the page readable as a continuous stream.

---

## Accent Color (Unit-Specific)

Each document sets one accent color in `:root`. The accent color applies to h2, h4, table headers, and the teacher banner. All other colors (card colors, flag colors) are fixed regardless of accent.

| Subject / Unit example | Accent |
|---|---|
| Grade 6 Science — Climate | `#0369a1` (sky blue) |
| Grade 6 Science — Forces | `#b45309` (amber) |
| Grade 6 Science — Matter | (set per unit) |
| Math (any grade) | Set per course — one color, used consistently |

The accent color is cosmetic only. It does not carry meaning. Never use it for flags or beat cards — those have fixed, meaning-bearing colors.

---

## The SHOW / SAY / CUE Rule

**SHOW and SAY carry different things. Never put SAY content on the SHOW.**

- SHOW: the visual — the diagram, the equation, the table, the board drawing. One thing. Students see this.
- SAY: the reasoning — the explanation, the questions, the connections. Students hear this.
- CUE: the signal — what students do right now. Specific and brief.

If a teacher is tempted to write a full paragraph under SHOW, the beat needs to be split.

---

## Beat Titles

Beat titles use h3 and follow this pattern:

`Beat [section].[number] — [What happens]`

Examples:
- `Beat 1.1 — The Core Distinction`
- `Beat 2.3 — Albedo and the Ice-Albedo Feedback Loop`
- `Beat 4 — Worked Example 1: One-Step Equation`

Beat titles are uppercase (via CSS `text-transform: uppercase`), letter-spaced, and muted — they orient the teacher but do not compete with the cards below them.

---

## Anti-Patterns — What Breaks Scannability

These patterns exist in older teacher notes documents. Do not replicate them.

| Anti-pattern | Why it fails |
|---|---|
| Inline SHOW / SAY / CUE labels (colored `<strong>` spans in running prose) | The label disappears into text. Teacher cannot find their place at a glance. |
| Solid-color full-width h2 banners | Acts as a visual stop. Breaks the scan flow. Looks like a form, not a guide. |
| Serif body font (Georgia, Times) | Slows scanning. Serif is for reading. Teacher notes are for glancing. |
| Beats compressed into single paragraphs | SHOW/SAY/CUE must be distinct blocks. Prose compression makes them un-scannable. |
| Flags at end of section | Flags must be adjacent to the beat. End-of-section flags are skipped mid-lesson. |
| Answer guides mixed into SAY text | Answer guides must be visually isolated — green box. If they blend into SAY, teachers will accidentally read answers aloud. |
| Missing beat numbers | If beats aren't numbered, the lost-place test fails. |

---

## File Format

Teacher notes are authored as **HTML files**, not markdown.

Reason: the card layout (three distinct divs per beat with colored borders and backgrounds) cannot be reproduced in markdown. Markdown-converted HTML (pandoc output) produces inline labels and collapses the card structure.

**File naming:** follows the course-specific `_context.md` convention.
Pattern: `[subject][grade]-[unit]-teachernotes-v[N].html`
Example: `sci6-climate-teachernotes-v1.html`

---

## Canonical CSS Block

Every teacher notes HTML file uses this base CSS, with the `:root` accent variables set per unit:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.55;
  color: #1e293b;
  background: #fff;
  max-width: 820px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}
:root {
  --accent: [unit color];
  --accent-light: [unit color light];
  --accent-mid: [unit color mid];
}

/* Typography */
h1 { font-size: 22pt; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
h2 { font-size: 14pt; font-weight: 700; color: var(--accent); margin: 32px 0 10px; border-bottom: 2px solid var(--accent-light); padding-bottom: 4px; }
h3 { font-size: 11.5pt; font-weight: 700; color: #334155; margin: 22px 0 6px; text-transform: uppercase; letter-spacing: .04em; }
h4 { font-size: 11pt; font-weight: 700; color: var(--accent); margin: 16px 0 4px; }
p  { margin-bottom: 8px; }
ul, ol { margin: 6px 0 10px 22px; }
li { margin-bottom: 4px; }
strong { font-weight: 700; }
em { font-style: italic; color: #475569; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10.5pt; }
th { background: var(--accent-light); color: var(--accent); font-weight: 700; text-align: left; padding: 7px 10px; border: 1px solid var(--accent-light); }
td { padding: 8px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
tr:nth-child(even) td { background: #f8fafc; }
hr { border: none; border-top: 2px solid #e2e8f0; margin: 24px 0; }

/* Teacher banner */
.teacher-banner {
  background: var(--accent);
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 10px;
}

/* Beat cards */
.show, .say, .cue {
  padding: 10px 14px;
  border-radius: 0 6px 6px 0;
  margin: 8px 0;
}
.beat-label {
  font-size: 8.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  margin-bottom: 5px;
}
.show { border-left: 4px solid #64748b; background: #f8fafc; }
.say  { border-left: 4px solid #0284c7; background: #f0f9ff; }
.cue  { border-left: 4px solid #6366f1; background: #eef2ff; }
.show .beat-label { color: #475569; }
.say  .beat-label { color: #0284c7; }
.cue  .beat-label { color: #4f46e5; }

/* Flags */
.flag {
  border-radius: 0 6px 6px 0;
  padding: 10px 14px;
  margin: 14px 0;
  font-size: 10.5pt;
}
.flag .flag-label {
  font-size: 8.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  margin-bottom: 5px;
}
.flag-misconception { border-left: 4px solid #dc2626; background: #fef2f2; }
.flag-misconception .flag-label { color: #dc2626; }
.flag-pacing        { border-left: 4px solid #d97706; background: #fffbeb; }
.flag-pacing        .flag-label { color: #b45309; }
.flag-cs            { border-left: 4px solid #0284c7; background: #f0f9ff; }
.flag-cs            .flag-label { color: #0284c7; }

/* Answer guide */
.answer-guide {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 14px 18px;
  margin: 14px 0;
}
.answer-guide .ag-label {
  font-size: 8.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: #16a34a;
  margin-bottom: 8px;
}

/* Print */
@media print {
  body { padding: 12px 18px; }
  h2 { page-break-before: always; }
}
```

---

## Checklist Before Finalising Any Teacher Notes Document

- [ ] Teacher banner present at top
- [ ] Every beat has three separate card divs (SHOW / SAY / CUE) — not inline labels
- [ ] h2 uses border-bottom, not solid background
- [ ] Body font is system-ui/sans-serif
- [ ] Every misconception flag is adjacent to its beat, not at end of section
- [ ] Misconception flags name the wrong belief AND what to do
- [ ] Pacing flags include a time estimate or decision point
- [ ] Answer guides are isolated in green boxes
- [ ] Beat titles are numbered (section.beat pattern)
- [ ] No SAY content appears in the SHOW card
