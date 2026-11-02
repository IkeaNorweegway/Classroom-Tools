---
title: [Skill name, e.g. Solving Two-Step Equations]
course: [math9 | math8 | science | science7 | social7 | social8 | social9 | steam]  (math9 if left out)
topic: [Math 8 and 9 only: topic slug, e.g. linear-equations]
strand: [Math 8 and 9 only: number | algebra | measurement-geometry | statistics-probability]
unit: [other courses: unit name for the header, e.g. Heat and Temperature]
skill: [one skill, in a few words]
time: [about 15 minutes]
notes: [the unit's notes, as its site address after /Classroom-Tools/, e.g. math8/view/notes/integers/math8-integers-notes-v1]
sections: [the notes sections this sheet practises, e.g. s2, s3]
---

<!--
HOME PRACTICE SHEET — parent pages (every course).
One sheet = ONE targeted skill, 6–8 questions, fits on one printed page.
Audience: a student working at home with a parent or guardian beside them
who may not remember this math. Plain words; no notation without an example.

Gate (state before writing): "One skill: [skill]. Worked example first, then
fading support: Q1–2 guided (partly filled in), Q3–5 independent, last
question a short real-world one. Maps to: [prerequisite or core skill]."

Render: python3 scripts/render_home_practice.py <this file>
Name: [prefix]-[unit]-home-[skill]-v1.md in the unit's type folder (Math 9:
worksheets/math-9/home/[topic]/; STEAM: steam/grade-N/home/), and list it in
the course manifest in src/data/ so the pages and the viewer link it.
Answers: same name with -answers, same format, with every step shown.

Notes link: `notes:` and `sections:` put "Need a reminder? See the class
notes: Section 2: ..." under the title, linked to those sections. Copy the
address from the unit parent page's "Jump to a part of the notes" list
(drop /Classroom-Tools/ and the #s2). Pick the one or two sections that
teach this sheet's skill. On the answers file, point `notes:` at the notes
answer key instead (e.g. ...-notes-answers-v1, from the parent page's answer
keys); the line then says "filled-in class notes". STEAM notes have no key,
so STEAM answers link to the notes. The render stops if a file or section is
missing.
After adding the line, print the sheet to check it still fits one page.

Format rules for the renderer:
  ## Heading            section heading
  ::: example ... :::   worked-example box (use numbered steps)
  ::: tip ... :::       "For the adult" box
  ::: check ... :::     self-check box at the end
  **1.** text           starts a question; it runs until the next question
  (work)                four blank lines of working space ((work 2) for two)
  ___                   a short answer blank
  - item                bullet list
-->

::: tip
**For the adult:** [One sentence on what this sheet practises and one on how to help, e.g. "Ask them to say each step out loud before they write it."]
:::

## Worked example

::: example
**Solve [example].**

1. [Step, with the reason in plain words.]
2. [Step.]
3. [Check the answer by substituting it back.]
:::

## Your turn

**1.** [Guided: same as the example, with the first step filled in.]

(work)

**2.** [Guided: one step filled in.]

(work)

**3.** [Independent.]

(work)

**4.** [Independent.]

(work)

**5.** [Independent, one small twist.]

(work)

**6.** [Short real-world problem using the same skill.]

(work)

::: check
I can [do the skill] and check my answer. ☐ Yes ☐ Almost ☐ Not yet
:::
