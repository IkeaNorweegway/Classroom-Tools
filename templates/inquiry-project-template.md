# Inquiry Project Template (Math 9 strand projects)
*Built from the Algebra pilot and used for all four Math 9 strands (2026-10-17). Use it for any new or revised strand project.*

Reference build: `worksheets/math-9/algebra/math9-algebra-project-v1.md` (brief), `…-project-journal-v1.md` (journal), `notes-packages/math-9/algebra/math9-algebra-project-teacherguide-v1.md` (teacher guide). Render all three with `python3 scripts/render_math9_projects.py`, then run `scripts/stack_fractions.py` on the output.

Evidence base: `research/project-based-learning-research.md`. Projects work only when they are structured, so every element below is required.

---

## Gate (state before writing)

"Options: [3, equal difficulty]. Driving questions launched in strand Lesson 1. Mini-lessons: [A: …, B: …]. Critique cycle: Period 4. Teams 4–5, roles: Facilitator, Recorder, Checker, Data/Materials (+ Skeptic). Audience per option: [ ]. Rubric K/U/S → [local codes]. Depth ceilings respected: [list what is excluded]. Real data with source and date: [ ]."

---

## Three files

| File | Folder | Pandoc front matter |
|---|---|---|
| `math9-[strand]-project-v1.md` | `worksheets/math-9/[strand]/` | `title`, `course_label`, `style: student` |
| `math9-[strand]-project-journal-v1.md` | `worksheets/math-9/[strand]/` | `title`, `course_label`, `style: student` |
| `math9-[strand]-project-teacherguide-v1.md` | `notes-packages/math-9/[strand]/` | `title`, `style: teacher` |

Then add `project: { brief, journal, guide }` to the strand in `src/data/math9.ts`. The strand page and the teacher hub pick it up automatically.

**Markdown conventions (pandoc):** `::: {.class}` fenced divs and `[text]{.class}` spans. Blanks: `[ ]{.b .b-sm}`, never `___` (pandoc reads underscores as emphasis). Use `\` at the end of a line for a line break inside data cards and SHOW/SAY/CUE cards. Use a `{=html}` raw block for the name row.

---

## Student brief — section order

1. Name row + `.about-callout`: title, topics line, **the big question** shared by all options, one-paragraph summary, "5 class periods · Teams of 4–5 · keep everything in your Project Journal"
2. **How the project works:** table of Periods 1–5 → what the team does → milestone M1–M5 (Plan, Model, Draft, Revised, Final), plus a `.hint` saying no team moves on until the milestone is checked
3. **Team roles** table
4. Three `.option-card`s, each with:
   - `.option-header` with badges (Option N, type, Alberta if relevant) and an `## Option title`
   - **Guiding question** (italic): a real question that can't be answered without the strand's math
   - **Context:** why someone outside school needs this answer (genuine context, not decoration)
   - `.data-card` with real numbers, a source and a "checked [month year]" date; sample values marked as samples
   - **What you will do:** numbered steps, labelled with milestones M1–M5. The model step must use the Rule of Four. The solve step must use the strand's core procedure.
   - **What to hand in:** bullets that match the journal pages
   - `.stretch-card` ★★ Extended task
   - *Math you will use:* local outcome codes
5. **Rubric (shared):** 4 criteria × 3 levels = 12. Criteria: 1 Model (S&P), 2 Solve and predict (S&P), 3 Explain the meaning (Understanding, **marked individually**), 4 Communicate (Understanding). Each criterion names its codes.
6. `.reflection-block` pre-hand-in checklist (task list)
7. `.word-bank` "What the codes mean"

## Project journal — one page break per milestone

| Milestone | Required pieces |
|---|---|
| M1 Plan | Copy the guiding question; gut-guess table (one row per member); know / need to know / how we'll find out; plan box with option-specific prompts; teacher check row |
| M2 Model | Mini-lesson notes box; labelled table; `.graph-grid`; equation box; "in words" starter; Checker's two-row agreement test; `.own-box` (individual, Criterion 3); teacher check |
| M3 Use | Mini-lesson notes box; "Let ___ = ___" equation box; check-it box; one-sentence draft answer; option-specific extra question; teacher check |
| M4 Critique | Kind / specific / helpful rules; feedback received; feedback given; revision log (what changed / which feedback / before → after); teacher check |
| M5 Show | Product record table; individual reflection (gut guess vs math, explain the method, best feedback, still unsure); self-assessment grid |

## Teacher guide — section order

Follow `templates/teacher-notes-format-context.md` (SHOW/SAY/CUE beats, red misconception flags, amber pacing flags, green answer guides):

1. Banner, title, how to use, *why the project is built this way* (2–3 sentences from the PBL research)
2. **Project at a Glance:** Lesson 1 launch + Periods 1–6, with "must be taught first" (notes sections) and journal page; where it sits in the strand
3. **Prep and materials** per option; any cards (profiles, data) to cut out; a "check these prices before printing" note
4. **Launch beat** (strand Lesson 1, 10 min): three images and questions, a vote, the need-to-know wall
5. **Period beats:** roles; gut guess; **Mini-lesson A** with 2 worked examples *not* taken from any option; **Mini-lesson B** with target / break-even / constraint examples; gallery walk (2 rounds × 8 min, a focus question per round); revise; show-it formats table
6. Misconception flags from `_courses/math-9/_context.md`, placed next to the beat where they appear; a rounding-in-context flag
7. **Answer guides** for every option, with sample data and every number checked by script
8. Assessment (team vs individual criteria, local codes, the 10-min return response); supports and extension; sources with dates; key flags summary

---

## Checks before publishing

- [ ] Every number in the answer guides recomputed (script, not by hand)
- [ ] Every rubric criterion maps to a code; no task goes past a depth ceiling in `_courses/math-9/_context.md`
- [ ] All 5 items in `templates/evidence-design-principles.md` (Tier 1 strands)
- [ ] Rendered HTML opened in headless Chrome; journal printed to PDF with one milestone per page break
- [ ] `npm run build` passes; strand page and teacher hub show the project
