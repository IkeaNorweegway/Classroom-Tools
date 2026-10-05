# Easy Read Notes — Design Context
*Grade 6 Science | Alberta Curriculum 2023*

---

## Who this format is for

Easy Read notes are designed for students who need lower text demand. This includes students with:

- Low reading ability (reading at a Grade 1–3 level)
- Low working memory or slow processing speed
- Low confidence with academic material
- English as an additional language
- Anxiety around dense or complex-looking pages

The goal is that a student picks up this document, feels calm, and can read it independently. Nothing about the page should feel overwhelming.

---

## Reading level: EF

EF level means:

- **Sentence length:** 5–12 words. One idea per sentence.
- **Word choice:** Use the simplest word that is accurate. Avoid synonyms — use the same word every time for the same concept.
- **No subordinate clauses stacked.** Not: "When particles heat up, because they move faster, they spread apart." Yes: "Heat makes particles move faster. Faster particles spread apart."
- **No passive voice.** Not: "Glucose is produced by the plant." Yes: "The plant makes glucose."
- **Define every technical word** the first time it appears, in plain English, right away — not in a glossary at the end.
- **Repeat key words.** Repetition is intentional. Do not paraphrase to avoid repetition.

---

## Layout: 70 / 30 column split

Every page uses a two-column layout.

**Left column — 70% width: Main content**
- Fill-in notes
- Diagrams and visual anchors
- Short explanatory sentences
- One idea per paragraph
- Never more than 3 sentences in a block before a visual break

**Right column — 30% width: Support strip**
- Vocab boxes (one word per box)
- Misconception warnings
- Key reminders
- Self-check questions
- Visual icons anchor each type

The support strip is always visible alongside the content it relates to. Vocab appears beside the sentence where the word first appears — not at the top of the page, not in a separate glossary.

---

## Spacing: generous in both dimensions

**Vertical spacing:**
- Line height: 1.9–2.0 (not 1.5)
- Paragraph gap: at least 1.2rem
- Section gap: at least 2.5rem
- Between fill-in lines: at least 0.9rem
- Between callout boxes: at least 1rem
- Section headings have 2.5rem above, 1rem below

**Horizontal spacing:**
- Main column max line length: 55–60 characters (not full page width)
- Left/right padding on callout boxes: at least 14px
- Never let text touch the edge of a box

The page should feel like it has room to breathe. White space is not wasted space — it is a support tool for slow processors.

---

## Callout box types

Four types only. Each has a fixed icon and colour so students learn the system quickly.

### 🔑 Vocab box
- Icon: 🔑
- Background: #eff6ff (pale blue)
- Border-left: 4px solid #3b82f6 (blue)
- Header: "Word to know"
- Structure: **Bold term** — plain English definition. Then one example in italics.
- Max length: 3 lines

### ⚠️ Watch Out box (misconception)
- Icon: ⚠️
- Background: #fff7ed (pale orange)
- Border-left: 4px solid #f97316 (orange)
- Header: "Watch out"
- Structure: State what students often think. Then correct it in 1–2 short sentences. Do not shame the wrong idea.
- Max length: 4 lines

### 💡 Remember box (key reminder)
- Icon: 💡
- Background: #f0fdf4 (pale green)
- Border-left: 4px solid #22c55e (green)
- Header: "Remember"
- Structure: 1–2 sentences restating the most important idea in the section.
- Max length: 3 lines

### ✅ Check box (self-check)
- Icon: ✅
- Background: #faf5ff (pale purple)
- Border-left: 4px solid #a855f7 (purple)
- Header: "Check yourself"
- Structure: A single yes/no or fill-in question the student can answer without writing — just thinking.
- Max length: 2 lines

---

## Fill-in blanks

- Use `border-bottom` underlines only — no boxes around blanks
- Blank width should roughly match the answer length: short word = 80px, medium = 130px, long phrase = 200px
- Blank is inline with the sentence (not on a new line) unless the answer is a full sentence
- Answers are drawn from a word bank when possible — reduces retrieval demand
- Word bank sits directly above the sentence(s) it serves — not at the top of a section

---

## Diagrams and visuals

- Every section should have at least one visual anchor — a simple diagram, icon grid, or comparison table
- Diagrams are labelled with short text (3–5 words per label)
- Comparison tables use two columns max. Rows are no longer than 2–3 words per cell unless writing lines are provided.
- ASCII/text-art diagrams are acceptable when rendered in a `<pre>` or styled `<div>` — use only for particle diagrams and simple before/after comparisons

---

## Tone

- Warm, calm, direct
- Second person: "You will learn..." / "This means..."
- Never say "as you can see" or "clearly" or "obviously"
- Never use exclamation marks in instructional text
- Encourage but do not over-praise: "Good work so far." is fine. "Amazing job!" is not.
- When correcting a misconception, be matter-of-fact: "Many people think this. Here is what actually happens."

---

## Section structure (for each unit)

Each unit follows this order. Do not deviate.

1. **Unit title + big question** (1 sentence, large text)
2. **What this unit is about** (2–3 short sentences, no jargon)
3. **Vocabulary you will need** (listed in the right column; each introduced inline at first use)
4. **Content sections** (one per knowledge cluster)
   - Each section: heading → 1–3 sentences → visual → fill-in activity → callouts in right column
5. **Unit check** (3–5 self-check questions at the end, no writing required)

---

## File naming

Easy Read unit notes: `sci6-[unit]-notes-ef-v[N].html`
Example: `sci6-matter-notes-ef-v1.html`

Easy Read year notes: `sci6-year-notes-ef-v[N].html` (already exists — revise to this spec)

---

## CSS class reference (for HTML builds)

```css
/* Layout */
.er-page           /* max-width: 900px, margin: auto, background: white */
.er-columns        /* display: flex, gap: 28px */
.er-main           /* flex: 0 0 68%, min-width: 0 */
.er-aside          /* flex: 0 0 28%, min-width: 0 */

/* Typography */
.er-body           /* font-size: 16.5px, line-height: 1.95, color: #1e293b */
.er-h1             /* font-size: 1.6rem, font-weight: 800 */
.er-h2             /* font-size: 1.15rem, font-weight: 700, margin-top: 2.5rem */
.er-h3             /* font-size: 1rem, font-weight: 600, margin-top: 1.8rem */

/* Callouts */
.er-vocab          /* 🔑 pale blue */
.er-watchout       /* ⚠️ pale orange */
.er-remember       /* 💡 pale green */
.er-check          /* ✅ pale purple */

/* Fill-in */
.b                 /* inline-block, border-bottom, width: 90px */
.b-sm              /* width: 80px */
.b-md              /* width: 130px */
.b-lg              /* width: 200px */
.word-bank         /* pale grey box, sits above its fill-in sentence */

/* Blanks — full line (written response) */
.al                /* display: block, border-bottom, min-height: 2rem, margin-bottom: 1rem */
```

---

## Checklist before finalising any Easy Read document

- [ ] No sentence is longer than 12 words
- [ ] Every technical term has a 🔑 Vocab box beside it on first use
- [ ] Every known misconception has a ⚠️ Watch Out box
- [ ] Every key cluster has a 💡 Remember box at the end
- [ ] Fill-in blanks have a word bank nearby
- [ ] The right column (30%) is never empty for more than one section
- [ ] Line height is 1.9 or greater
- [ ] No paragraph is more than 3 sentences
- [ ] Diagrams or visuals appear at least once per section
- [ ] The page prints cleanly on A4/Letter with no horizontal scroll
