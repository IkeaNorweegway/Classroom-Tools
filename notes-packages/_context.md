# Notes Packages — Design Context
*Structured student notes — guided, not dictated*

**Pedagogical framework:** `_meta-context.md` governs how to think. This file governs how to build notes packages specifically. Read both before starting any build.

---

## ⛔ Pre-Build Gate — confirm all four before writing Section 1

| # | Constraint | What failure looks like |
|---|---|---|
| 1 | **Progressive blanking** — more support early, less late; never blank everything | A page of nothing but blanks; Section 6 as scaffolded as Section 1 |
| 2 | **Refutation-first on every major misconception** — wrong idea stated and shown to fail before the correct explanation | Misconception buried in a footnote; correct explanation given first, wrong idea mentioned after |
| 3 | **Sections ordered by conceptual dependency, not curriculum order** — container before engine, engine before implications | Photosynthesis before ecosystems; forces before Newton's laws |
| 4 | **Every section has all five elements** — learning target + vocab table + guided notes + retrieval check + self-check rating | Section with notes but no retrieval check; retrieval check but no self-check rating |

State this before writing: *"Progressive blanking confirmed. Refutation-first on: [list every misconception from unit _context.md]. Section order: [list cluster sequence and reason for that order]."*

Start from `templates/notes-package-template.md` — copy it, then fill in content. Never build from a blank file.

---

## What a Notes Package Is (and Isn't)

A notes package is the **primary vehicle for knowledge encoding during instruction**. Students fill it in during the direct instruction phase of a lesson — not after. It is not a study guide, not a workbook, and not a summary sheet.

| Artifact | When used | Primary function |
|---|---|---|
| **Notes package** | During instruction | Active encoding — students think as they fill it in |
| **Workbook** | During practice phase | Interleaved retrieval — students retrieve across scrambled concepts |
| **Study guide** | Before a test | Re-exposure — evidence says this is the weakest strategy; design it as retrieval instead |
| **Exit ticket** | End of class | Formative signal — independent, collected, acted on before next class |

A notes package that students could complete by copying text from the board is a bad notes package. Every blank should require a student to hold an idea in working memory while writing. That holding and writing is the encoding event.

---

## The Macro Architecture — Pre-Knowledge → Unit Synthesis

Every notes package follows the same macro arc, regardless of unit or subject. This is not decoration — it is the Zimmerman three-phase self-regulation loop stretched across the whole unit.

**Page 1: Pre-Knowledge Check**
Before any instruction. No notes, no correction, no stakes. Students write their honest first beliefs about the unit topic. This serves three functions:
1. Surfaces misconceptions before instruction (teacher and student both see what's there)
2. Creates a baseline the student will compare to at the end
3. Activates prior knowledge, which primes encoding for the first lesson

**The package body: Section 1 → Section N**
Ordered by conceptual sequence (see below). Students fill in guided notes during instruction.

**Final page: Unit Synthesis**
Complete from memory — notes closed. Students reconstruct key ideas from each knowledge cluster. The final question on the synthesis page always sends students back to their Pre-Knowledge Check to read what they wrote before instruction. Seeing their own pre-instruction words in their own handwriting is a more powerful corrective experience than being told they were wrong.

> This arc is the most underused structural move in notes design. Build it into every package, every time.

---

## Section Ordering — Conceptual Sequence, Not Curriculum Order

Sections are ordered by the conceptual dependencies in the content, not by the curriculum's listing order and not by lesson number.

**The principle:** A student needs the "container" before they can understand the "engine." They need the "engine" before they can understand the "implications."

**Applied:**
- Container = What is this system? What are its parts? (establishes the framework)
- Engine = What is the key process that drives it? (the mechanism)
- Implications = What does this mean for the world, for other organisms, for engineering? (the so-what)

In Living Systems: Biotic/Abiotic (container) → Photosynthesis (engine) → Plant-Animal Relationships (implications). Starting with photosynthesis before ecosystems is like explaining how an engine works before you know a car has parts.

**Practical rule:** Before ordering sections, write down: "What does a student need to already know to make sense of this section?" If the answer is "nothing," it goes first. If the answer is "Section 1," it goes second. Build the dependency map, then order accordingly.

---

## Section Structure — Every Section Has the Same Five Elements

Each section contains these elements in this order:

**1. Section header + learning target**
One sentence, "I can ___" format. The learning target defines what students should be able to do without notes by the end of the section. It sets the retrieval standard they'll be held to at the section's retrieval check.

**2. Vocabulary table**
Three columns: Term | Definition in your own words | One example.
- Placed at the section start, filled in as the student encounters each term in context
- Never ask students to copy a definition — "in your own words" is the non-negotiable column
- 4–8 terms per section; only terms that will appear in assessment or are required to explain other concepts
- Flag high-risk vocabulary in the teacher version: terms that overlap with everyday language (force, matter, food, energy, system, work, climate) are the most dangerous because students believe they already know them

**3. Guided notes with fill-in blanks**
The content of the section. See Fill-in Blank Philosophy below.

**4. Retrieval check**
4–5 questions, notes covered. See Retrieval Checks below.

**5. Self-check rating**
"I could teach it / Getting there / Not yet" — one line, at the end of the retrieval check. See Metacognitive Elements below.

---

## Fill-in Blank Philosophy

Blanks are not random gaps. Each blank is a cognitive forcing event — it requires a student to hold an idea in working memory while deciding what to write. That decision is the encoding event.

**What gets a blank:**
- Key terms (on first use in the notes body — they've already seen it in the vocab table)
- Core claims ("The particle model says that all matter is made of ___")
- Critical relationships and cause-effect pairs ("When temperature increases, particles ___")
- Conclusions from worked examples ("This means that ___")
- Contrasts that define a concept ("A biotic factor is ___, while an abiotic factor is ___")

**What does not get a blank:**
- Contextual framing and transitions — these should be pre-written so students can focus on understanding
- Misconception explanations — pre-written in full (students need to read and understand these, not transcribe them)
- Background information that is supporting, not essential

**Progressive blanking — the expertise reversal principle:**
Early sections are more supported. Later sections are less supported. As students build schema, the scaffolding reduces. A section that required a sentence starter in the first week should not have one in the fifth week's retrieval warm-up. The notes package should reflect this: blank density and scaffold level should decrease toward the back.

**Never blank everything.** A page of blanks is a cloze test. Students will rush to fill it with anything. Cloze tests produce completion behaviour, not thinking behaviour.

---

## Misconception Handling in Notes

Misconceptions don't get a paragraph buried in the notes. They get a dedicated, visually distinct callout box. For the biggest misconceptions, the refutation comes before the instruction — not after.

**The refutation-first move (Chi, 2008):**
State the wrong idea → show empirically why it fails → then explain the correct idea. The contrast between wrong and right is the learning event, not just the right explanation. Students who see the misconception's prediction fail retain the correct explanation better than students who receive the explanation first and then hear "some students think...".

**Applied:** In Living Systems notes, Section 2 opens with the soil misconception before any photosynthesis instruction. The tree-in-a-pot thought experiment makes the misconception's prediction fail before a word of explanation is given. Then the correct process follows. The student arrives at the explanation already wanting to know what the answer is.

**Callout box visual standard:**
- Red left border
- "MISCONCEPTION" label in small caps
- Wrong idea stated in bold quotation marks
- Why it fails — the mechanism, not just "that's wrong"

**Every major misconception listed in the unit `_context.md` must have a callout box in the notes.** No exceptions on Tier 1 units.

---

## Vocabulary as Knowledge — Not a Warm-Up Activity

Vocabulary in notes packages follows the rules in `_meta-context.md` — vocabulary IS the knowledge, not a pre-lesson warm-up. Specific notes-package rules:

- Vocabulary table at section start, filled in context — not before instruction begins, not in isolation
- Definition in own words: forces elaboration, prevents copying
- One example: requires application at the moment of encoding
- Vocabulary returns in retrieval checks — not just in the week it's introduced
- Teacher version flags words students will use incorrectly because they think they already know them

---

## Retrieval Checks

Every section ends with a retrieval check: 4–5 questions answered with notes closed. This is not assessment — it is performance monitoring (Zimmerman Phase 2) that converts task completion into genuine encoding.

**Structure:**
- Questions 1–3: Core retrieval — key terms, key relationships, the main claim of the section
- Question 4: Application — take the concept and use it in a scenario slightly different from the notes
- Question 5 (marked Stretch): Transfer or multi-concept — requires connecting this section to another concept, evaluating an error, or applying to a novel situation

**The stretch question is not for fast finishers.** It is for students who have consolidated the basic content and need a different kind of thinking challenge. It is available to all, expected of some.

**After the retrieval check:** Students open notes and check. The checking step — not the teacher marking it — is the formative moment. Students who find a gap know exactly what to re-read. This is targeted re-exposure, not passive re-reading of everything.

---

## Metacognitive Elements — Built Into Every Section

Three metacognitive structures appear at consistent positions across the package:

**Self-check rating (after every retrieval check):**
"I could teach it / Getting there / Not yet"

The "I could teach it" standard is deliberately demanding. Being able to teach something requires understanding it at depth, not just reproducing it. Students who aim for "could teach it" push further than students who settle for "I think I get it." Teachers read these during class to identify who needs a follow-up question.

**Connection prompts (at conceptual transitions):**
Orange-bordered boxes that ask students to link new content to prior knowledge, real-world experience, or another unit. Always includes a blank response space — students write, not just think. Thinking without writing produces no encoding. Examples:
- "This connects to something I already know about ___"
- "Think of the last time you saw X. What does the photosynthesis equation tell you about what was happening?"

**White space for doodles and annotations:**
White space in notes is not wasted space. Students who sketch, annotate, and doodle during instruction are more engaged and encode more deeply. Build generous white space into every page — especially around diagrams and worked examples. Don't fill every centimetre with text.

---

## Visual Elements

Science knowledge is partly visual knowledge. Every section should have at least one visual element. These are not decorative — they test and build a different representation of the same knowledge.

**Visual types to use in notes:**

| Type | What the student does | Best for |
|---|---|---|
| **Label the diagram** | Add labels to a pre-drawn image | Structural content (particle arrangements, solar system, ecosystem components) |
| **Complete the diagram** | Partially drawn — student finishes it | Processes (phase change, food web, photosynthesis flow) |
| **Equation box** | Fill-in blanks within a styled diagram of the equation | Chemical or mathematical relationships |
| **Food web / network** | Draw arrows between given organisms | Interdependence and energy flow |
| **Table with blanks** | Two-column or three-column comparison table | Distinguishing concepts (biotic/abiotic, solid/liquid/gas, internal/external forces) |

**Source and format:** In the .md version, use markdown tables and ASCII diagrams. In the .html rendered version, use styled CSS boxes and SVG-quality diagrams. Both should carry the same cognitive demand — the format changes, not the thinking.

**Split-attention rule:** Labels belong *on* the diagram, not in a separate legend. When the label and the element it describes are physically separated, students must hold both in working memory simultaneously to integrate them — extraneous load with no learning benefit. Place annotations directly on or immediately beside the element they describe. (Chandler & Sweller, 1992)

**Coherence rule:** Remove any image that is not doing explanatory work. Decorative visuals — thematic graphics, stock illustrations, borders — compete for attention and reduce learning (Mayer, 2001). Every image in a notes package should require the student to do something with it: label it, complete it, or read a relationship from it.

---

## Scope Discipline — Know the Depth Ceiling Before Building

The most common error in notes design is going too deep. A single grade level has a specific depth ceiling. Content below that ceiling goes in the notes. Content above it belongs in a different course.

**Before building any section:**
1. Identify what students need to be able to do to answer the unit's learning outcomes
2. Set the depth ceiling: process level? cellular level? molecular level? observable level?
3. Document the boundary in the unit's `_context.md` as a scope boundary table (see Living Systems example for photosynthesis — process level, not cellular)

**The test:** "Does a student need to know this to answer the unit test outcomes?" If no, it does not go in the notes. If yes, it does — at the level the outcome requires, not deeper.

**Grade 6 default depth ceilings:**
- Biology content: observable process level (not cellular or molecular)
- Chemistry/matter: particle model level (not atomic structure or bonding)
- Physics/forces: conceptual level (not vector calculations or equations of motion)
- Earth science: system level (not geological time or plate tectonic mechanisms)

If you find yourself writing about stomata, chloroplasts, electron transport chains, or covalent bonds in Grade 6 materials — you have gone too deep. Stop and reframe at the process level.

---

## UDL — Universal Design for Learning in Notes Packages

Notes packages reach all students through design, not through separate versions. UDL is embedded, not bolted on.

**Multiple means of representation:**
- Every major concept appears in at least two forms: written explanation + visual element
- Sentence starters on selected blanks (not all — overuse removes the cognitive demand)
- Hint text in brackets on the hardest blanks: *(Hint: think about what happens to the space between particles)*

**Multiple means of expression:**
- Some blanks ask for a word; some ask for a sentence; some ask for a diagram; some ask for an explanation in your own words
- Retrieval check questions vary in format — write, label, draw, explain

**Multiple means of engagement:**
- Connection prompts link to students' prior experience, not just prior curriculum
- FNMI content integrated as substantive ecological and scientific knowledge, not as cultural add-ons
- White space allows personalisation (annotation, doodle, personal examples)

**What UDL does not mean:** reducing the cognitive demand. The scaffold removes the **access barrier** (format, language, sensory) — not the cognitive demand that is the learning target. A sentence starter that supplies the reasoning removes the reasoning; that is not UDL, it is a crutch. Scaffolds embedded in notes packages must be planned to fade across the unit — more supported early sections, less supported later. Explicit fading protocols produce d = 0.71 vs. d = 0.32 without fading. See `_meta-context.md` → *Universal Design for Learning* and *Scaffolding Architecture* for the full framework.

---

## Rendered Version — .md, .html, and .pdf

Every notes package should exist in three formats:

**.md file** — the source and the editable version. Used for version control and future revision. Markdown renders cleanly on the classroom website.

**.html file** — the screen/web version. Self-contained (no dependencies). Design standards:
- Georgian serif body font (12pt in print, 15px on screen)
- System-ui sans-serif for labels, tables, and UI elements
- Section headers: solid color bar matching unit color (Living Systems = emerald, Matter = cyan, Forces = violet, Climate = amber, Energy = orange, Space = indigo)
- Fill-in blanks: CSS `border-bottom` underlines, sized to context (sm/md/lg/xl)
- Misconception callouts: red left border, "MISCONCEPTION" label
- Retrieval checks: light blue background box
- Connection prompts: orange left border
- Self-checks: light green background row
- Print styles: colors preserved (`print-color-adjust: exact`)

**Print pagination rules (required on every HTML render):**

These rules must be included in the `@media print` block of every HTML file. They are not optional.

```css
@media print {
  /* Each section starts a fresh page */
  .section { break-before: page; }

  /* These elements must never be split across a page break */
  .question,
  .retrieval,
  .misconception,
  .connection,
  .self-check,
  .worked-example,
  .learning-target,
  .name-row,
  table,
  figure { break-inside: avoid; }

  /* Headings stay with the content that follows them */
  h2, h3, h4 { break-after: avoid; }

  /* Prevent orphaned or widowed lines in paragraphs */
  p { orphans: 3; widows: 3; }
}
```

What each rule does:
- `break-before: page` on `.section`: every Section N heading gets a fresh page — students never start a section mid-page
- `break-inside: avoid` on questions, boxes, tables, worked examples: content that starts near the bottom of a page pushes to the next rather than splitting
- `break-after: avoid` on headings: a heading will never appear as the last line on a page before its content wraps to the next
- `orphans: 3; widows: 3`: no paragraph leaves fewer than 3 lines stranded at the top or bottom of a page

Wrap each section in `<div class="section">...</div>`. The Pre-Knowledge Check and Unit Synthesis each get their own `.section` wrapper so they also start on a fresh page. Individual questions should be wrapped in `<div class="question">...</div>`.

When building the HTML, start from the .md as the content source. Translate section by section. Do not redesign the content in the process of rendering it — the structure and wording carry over directly.

**.pdf file** — the print master. Produced from a `.tex` source using LaTeX/TikZ via the `latex-pdf` skill. Textbook-quality output: proper typography, vector diagrams, exact page breaks. The HTML is the web version; the PDF is what goes to the printer. Build the PDF with: `bash .claude/skills/latex-pdf/scripts/compile.sh path/to/file.tex`

**HTML conventions that enable reliable LaTeX builds:**

*Diagram comment tags* — every SVG in the HTML must be preceded by a `<!-- tikz: ... -->` comment naming the TikZ pattern and its parameters:
```html
<!-- tikz: circle-vocab | r=2.5 | points=O,T,Q,R,A,P,S | features=diameter,radius,chord,arc,tangent -->
<svg ...>...</svg>
```
Pattern names correspond to sections in `.claude/skills/latex-pdf/references/tikz-patterns.md`. When building the `.tex`, the comment tells you exactly which pattern to use — do not reverse-engineer TikZ from the SVG paths.

*Semantic blank classes* — use specific CSS classes so blanks are unambiguous when converting to LaTeX:

| HTML class | LaTeX command | Use for |
|---|---|---|
| `class="blank-sm"` | `\blank{2cm}` | Single word |
| `class="blank-md"` | `\blank{4cm}` | Short phrase |
| `class="blank-lg"` | `\blank{7cm}` | Full sentence |
| `class="blank-xl"` | `\blank{10cm}` | Long phrase or definition |
| `class="answer-line"` | `\answerline` | Write-on line (retrieval/worked example) |
| `class="self-check"` | `\selfcheck` | Self-check rating row |

These conventions apply to all new HTML notes packages. Retrofit to existing packages when building a PDF version.

**Build checklist update:** Add `.pdf` to the "Both .md and .html versions created" item → "`.md`, `.html`, and `.pdf` versions created" (for Tier 1 units; Tier 2/3 optional).

---

## SVG Diagram Class System

All SVG diagrams in HTML notes packages must use the `dg-*` CSS class system. **No inline `stroke`, `fill`, `stroke-width`, or `font-family`/`font-size` attributes on SVG elements** — all visual properties live in the CSS `<style>` block.

**Why:** One edit to a custom property updates every diagram in the file. Unit accent colour propagates automatically: `--dg-accent` inherits from `--accent` (already set per-page), so a Matter file's cyan, a Math 9 file's blue, and a Forces file's violet all just work with no SVG changes.

**Full reference:** [`notes-packages/_svg-classes.md`](_svg-classes.md) — CSS snippet, class vocabulary, unit theming table, before/after examples.

### Class vocabulary (quick reference)

| Class | Applies to | What it represents |
|---|---|---|
| `dg-boundary` | `<circle>`, `<rect>`, `<ellipse>` | Shape outline — gray stroke, light fill |
| `dg-line` | `<line>`, `<path>` | Standard line — gray |
| `dg-accent` | `<line>`, `<path>`, `<circle>` | Highlighted element — unit colour, bold stroke |
| `dg-dashed` | `<line>`, `<path>` | Secondary/guide — gray dashed |
| `dg-right-angle` | `<polyline>`, `<path>` | Right-angle mark — thin gray |
| `dg-construction` | `<line>`, `<path>` | Faint guide — muted, fine dash |
| `dg-point` | `<circle>` (small r) | Filled vertex dot — gray |
| `dg-point-accent` | `<circle>` (small r) | Filled vertex dot — unit colour |
| `dg-label` | `<text>` | Point label — 12px gray |
| `dg-label-sm` | `<text>` | Secondary annotation — 11px muted |
| `dg-label-accent` | `<text>` | Key element label — 11px unit colour, semi-bold |

**Attributes that stay on the element** (positional/structural, not styling):
`cx cy r x1 y1 x2 y2 d points` — geometry | `viewBox width height role aria-label` — SVG structure | `text-anchor dominant-baseline` — text alignment | `font-weight="700"` — meaningful bold

**Reference implementation:** `notes-packages/math-9/circle-geometry/math9-circle-geometry-notes-v1.html`

---

## Format Selection

Use this to choose the right format when a request doesn't specify:

| Format | When to use |
|---|---|
| **Guided notes (fill-in)** | Default for Grade 6. Dense content. ELL students present. Any Tier 1 unit. |
| **Cornell notes** | Secondary (Grade 9+). Students already have metacognitive note-taking habits. Not recommended as primary format for Grade 6. |
| **Graphic organiser** | Embedded within guided notes at key relationship points (food webs, force diagrams, phase change sequences). Not as a standalone format for a full unit. |
| **Hybrid** | Default choice: guided notes as the spine, graphic organizers and visual elements embedded where the content is relational or spatial. This is what the Living Systems package uses. |
| **Unit Summary** | Final synthesis page only — students fill from memory, not as a format for the whole package |

---

## Evidence Design Checklist

Run this before finalising any notes package (from `templates/evidence-design-principles.md`):

- [ ] Student produces something from memory at least once (retrieval checks + synthesis page)
- [ ] Student explains or justifies reasoning at least once (connection prompts + stretch retrieval questions)
- [ ] Prior content is mixed in (pre-knowledge check activates prior knowledge; synthesis links back)
- [ ] There is a formative signal the teacher can act on (self-check ratings, retrieval check results)
- [ ] Worked examples or guided content appear before practice (notes are the worked example; retrieval check is the practice)

All five must be yes for a Tier 1 unit. Minimum three for Tier 2 or 3.

---

## Build Checklist

Before submitting any notes package as complete:

- [ ] Pre-knowledge check on page 1 — no correction, honest first thoughts
- [ ] Sections ordered by conceptual sequence, not curriculum order
- [ ] Every section: vocab table + guided notes + retrieval check + self-check rating
- [ ] Every major misconception from unit `_context.md` has a dedicated callout box
- [ ] At least one visual element per section
- [ ] Diagram labels integrated directly onto diagrams — no separate legends
- [ ] No decorative images — every visual is explanatory or removed
- [ ] Connection prompts at conceptual transitions with written response space
- [ ] White space built in — not every centimetre is text
- [ ] Unit synthesis page: fill from memory, then link back to pre-knowledge check
- [ ] Scope stays within the depth ceiling documented in unit `_context.md`
- [ ] `.md`, `.html`, and `.pdf` versions created (Tier 1 units); `.md` + `.html` minimum for Tier 2/3
- [ ] HTML: SVG diagrams preceded by `<!-- tikz: ... -->` comment tags
- [ ] HTML: blanks use semantic classes (`blank-sm/md/lg/xl`, `answer-line`, `self-check`)
- [ ] HTML: SVG audit passes — `python ".claude/skills/svg-audit/scripts/audit.py" path/to/file.html`
- [ ] HTML tested in browser: blanks display correctly, print styles work
