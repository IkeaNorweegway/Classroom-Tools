# Unit Workbooks — Design Context
*Practice and application artifact. Read alongside `_meta-context.md` and the unit's `_context.md`.*

---

## ⛔ Pre-Build Gate — confirm all four before writing question 1

Before generating any workbook content, state these four constraints explicitly in your response:

| # | Constraint | What failure looks like |
|---|---|---|
| 1 | **No part or section headers** — questions are not grouped by topic, lesson, or concept | `## Part A: Particles`, `### Heat Transfer Questions`, any label that tells students what the question tests |
| 2 | **Every concept has both a ★ Core and a ★★ Extended question** — minimum one of each per knowledge cluster | A cluster with only easy questions, or only hard questions, or only one question total |
| 3 | **Questions use the same examples from the notes package** — familiar context, not new scenarios | A workbook question inventing a new analogy that never appeared in the notes |
| 4 | **HTML format uses q-card divs with ★/★★ badges** — not section-title headers or plain paragraphs | Questions rendered as `<p><strong>1.</strong>...` or `<h2 class="section-title">Part A` |
| 5 | **Bloom's target: Apply / Analyze / Evaluate** — max 2 recall/vocab questions per workbook | Most questions are fill-in-the-blank; word banks on every question; no scenarios or visuals |
| 6 | **Scenario-based or visual for most questions** — students reason from a situation, diagram, or data, not fill blanks | "Conduction is the transfer of heat through ______"; word banks on explanation questions |

State this before writing: *"Interleaving confirmed. No part headers. ★/★★ per concept: [list clusters]. Bloom's check: [how many Apply / Analyze / Evaluate vs. Recall questions]. Visuals planned: [list diagram types]."*

**Bloom's distribution (enforced):**
- Remember / Understand (fill-in, vocab, define): max 2 per workbook
- Apply (use concept in a given scenario): ~4 questions
- Analyze (compare, find error, trace cause-effect, interpret diagram/data): ~4 questions
- Evaluate / Create (judge a claim, predict with justification, design a solution): ~4 questions

**Word bank rule:** Only on genuine labelling tasks (label this diagram). Never on explanation, prediction, or reasoning questions — the word bank removes the thinking.

**Question formats to use:**
- Scenario: "A factory discharges warm water into the Red Deer River. Downstream, a fish kill is reported. Explain what happened using your knowledge of specific heat and dissolved oxygen."
- Diagram analysis: [SVG embedded] → "What relationship does this diagram show? What would happen if [X] were removed?"
- Error analysis: "A student claims: '...' Identify the error. Correct it with a complete explanation."
- Predict and justify: "Predict what will happen to [X] if [Y] changes. Justify your prediction using [concept]."
- Data table / graph: [table or graph] → "What pattern do you see? What does it tell you about [concept]?"
- Design / evaluate: "Evaluate this proposed solution. Would it work? What would you change and why?"

---

## What a Workbook Is

A unit workbook is **the primary vehicle for interleaved practice across the unit.** It is not a worksheet, not a study guide, and not a test review. It is a growing document that students work through during guided practice time across multiple lessons, mixing questions from every concept in the unit in deliberate disorder.

The defining feature: **students do not know in advance which concept each question is testing.** That identification step — recognising "this is a particle model question, not a phase change question" — is where understanding lives. Grouping questions by lesson destroys this.

---

## Core Design Principles

### 1. Interleaving is non-negotiable

Questions from different lessons and concepts are **deliberately scrambled.** No sections labelled by lesson. No "Part A: Particles / Part B: Phase Changes." The student opens the workbook, reads a question, and must determine what it is asking before answering.

**Why:** Interleaved practice produces worse short-term performance and better long-term retention than blocked practice. The difficulty of figuring out what kind of problem you're solving is exactly the cognitive event that produces durable understanding. (Rohrer & Taylor, 2007; Bjork, 1994)

**How to signal which questions are available:** Each question carries a small lesson-release marker (e.g., `[opens after Lesson 3]`) in the teacher copy. Student copy shows the question unmarked — the teacher tells students which questions are unlocked each day. This preserves interleaving while preventing students from answering questions they haven't learned yet.

### 2. Every concept gets two questions: Core and Extended

Every concept in the unit must appear as **at least one Core question and one Extended question.**

| Type | Symbol | What it looks like | Who it's for |
|---|---|---|---|
| **Core** | ★ | Scaffolded, direct, often includes a support structure (sentence starter, word bank, partial diagram, hint box) | Accessible to all students |
| **Extended** | ★★ | Same concept, higher cognitive demand — requires explanation, justification, transfer to a new context, or error analysis | For students ready for deeper challenge |

Both types appear **in the same workbook, in interleaved order.** There are no separate tracks. Teachers can direct students to attempt Core first and Extended after, or assign Extended to students who finish Core quickly, or use Extended as whole-class discussion questions. The workbook supports all three approaches.

**The Core question is not easy — it is accessible.** It removes barriers without removing the thinking. A Core question should not be answerable by copying from notes. It requires genuine retrieval and application.

### 3. Questions play off lesson contexts, not just lesson content

Questions must use the **same examples, scenarios, analogies, and demonstrations from the notes package and lessons.** If Lesson 1 used marbles in a tray to demonstrate particle states, the workbook should use marbles-in-a-tray language when building on that concept. If Lesson 6 introduced bridge expansion gaps as a real-world application, the workbook extends that bridge scenario — it does not invent a new one.

**Why:** Familiar context reduces extraneous cognitive load and focuses attention on the conceptual demand. The student is not simultaneously figuring out a new situation and retrieving science knowledge.

**In practice:** Before writing workbook questions, review the lesson notes, guided examples, demonstrations, and analogies used in instruction. Write questions that live in the same world the students already inhabit.

### 4. Visuals are not decoration — they are question types

Every workbook must include visual questions. Science knowledge is partly visual knowledge: the particle model is a diagram, force relationships are arrow diagrams, food webs are networks, the solar system is a scale problem. Visual questions are not easier than text questions — they test different representations of the same knowledge.

**Visual question formats to use:**

| Format | What the student does | Best for |
|---|---|---|
| **Label the diagram** | Given a pre-drawn image, add labels, force arrows, or particle arrangements | Any structural or spatial content |
| **Complete the diagram** | Partial image — student fills in the missing elements | Processes and relationships (phase change, food web, thermometer) |
| **Draw from description** | Given a written scenario, student draws the correct representation | Transfers knowledge from text to spatial form |
| **Compare diagrams** | Two diagrams side by side — what changed? What's the same? Why? | Heating/cooling effects, before/after states, force interactions |
| **Error in the diagram** | A deliberately incorrect diagram — find the mistake and correct it | Misconception-targeted; forces precise knowledge |
| **Sketch from memory** | No visual provided — student draws from recall | Retrieval of key visual representations |

**SVG/print guidance:** Diagrams in print-format workbooks should be simple, high-contrast line drawings that reproduce clearly in black-and-white. For the site version, SVG inline diagrams are preferred. Every diagram must have a clear label and enough whitespace for students to annotate.

**Split-attention rule:** Labels and annotations belong *on* the diagram, not in a separate legend or caption. A legend in the margin forces students to look back and forth, consuming working memory on the search rather than the concept. Integrate text directly beside or within the element it describes. (Chandler & Sweller, 1992)

**Coherence rule:** Every visual must be explanatory — showing a relationship, process, or structure central to the question. Decorative images, thematic borders, and stock illustrations compete for attention without contributing to learning and should be removed. (Mayer, 2001)

### 5. UDL — Multiple Paths to the Same Concept

Universal Design for Learning principles are embedded at the question level, not bolted on afterward.

**Multiple means of representation:**
- Every major concept appears in at least two formats: text-based and visual
- Word banks are provided for questions that require precise vocabulary use (label this diagram; fill in the blank using the following terms)
- Hint boxes appear on selected questions — they are optional, clearly labelled as a hint, and cost nothing to use

**Multiple means of expression:**
- Some questions ask students to write; some ask students to draw; some ask students to label; some ask students to choose and justify
- Extended questions often offer a choice of format: "Explain in writing OR draw a diagram and annotate it"
- No question format should be the only way to demonstrate understanding of a concept

**Multiple means of engagement:**
- Difficulty increases within the workbook as the unit progresses and students' schema builds — early questions are more supported; later questions fade the scaffold
- The stretch region (last ~20% of questions) is labelled as a challenge zone — optional for most, expected for some
- Metacognitive check-ins appear at natural breakpoints to give students agency over their own monitoring

**What UDL does not mean here:** Reducing the cognitive demand. Core questions are accessible; they are not simple. UDL removes **access barriers** (format, language, sensory) — not **cognitive demand that is the learning target**. A word bank on a retrieval task removes the retrieval. A sentence frame that supplies reasoning removes the reasoning. Both are UDL applied too broadly. The difficulty should feel productive — slow but not stopped. See `_meta-context.md` → *Universal Design for Learning* for the full access vs. cognitive scaffold distinction.

### 6. Reading level — Fountas & Pinnell P–Q

All student-facing text in workbooks must be written at **Fountas & Pinnell level P–Q** (approximately Grade 4 reading level). This applies to question stems, instructions, scenario text, hint boxes, sentence starters, and metacognition prompts.

**Rules:**
- Sentences: 8–14 words average; simple or compound structures preferred
- Split complex or compound-complex sentences into two short sentences
- Active voice over passive
- Replace uncommon words with common ones (e.g. "identify" → "name", "evaluate" → "check", "components" → "parts", "deliberate" → "on purpose")
- Science vocabulary (curriculum terms like compression, photosynthesis, Newton's Third Law) is **kept** — these are learning targets, not access barriers
- Teacher-copy answer notes, circulation prompts, and misconception labels are adult-facing and are exempt from this requirement

---

## Scaffolding Structures for Core Questions

Use these tools to make Core questions accessible without reducing their cognitive demand:

| Scaffold | How to use it | When to use it |
|---|---|---|
| **Sentence starter** | "The particle model says that ___" | Abstract or language-heavy concepts |
| **Word bank** | 6–8 terms provided, some may be used more than once, some not at all | Label tasks, vocabulary-heavy questions |
| **Partial diagram** | The diagram is started — student adds the missing elements | Visual representation questions |
| **Hint box** | A small box below the question: *Hint: Think about what happens to the space between particles.* Student uses it or ignores it | Questions where a single conceptual cue changes everything |
| **Step prompts** | First ___ / Then ___ / Finally ___ | Processes with a clear sequence (phase change, photosynthesis) |
| **Worked reference** | "Look at your Lesson 3 notes example — then answer without looking." | Transitional questions during early practice before the concept is fully retrieved |

**Remove scaffolds progressively across the unit.** A question with a sentence starter in Week 2 should appear without one in Week 5. The workbook should reflect the expertise-reversal principle: as competence grows, supported versions become a hindrance. This is not optional — explicit fading protocols produce d = 0.71 vs. d = 0.32 without fading. The standard sequence: full scaffold → reduced scaffold → prompt only → independent → transfer to new context. See `_meta-context.md` → *Scaffolding Architecture* for the full fading framework.

---

## Metacognition — Built In at Three Points

Per `_meta-context.md` (Zimmerman's three phases), metacognition is embedded at the start, middle, and end of each workbook session — not as a filler activity, but as a cognitive event.

### Before (Forethought)
At the top of each day's workbook session (teacher-directed):
> "Before you begin: look at the questions for today. Which one do you think will be hardest? Why?"

This activates prior knowledge and sets a comparison point for the reflection.

### During (Performance monitoring)
A mid-workbook check-in box appears at the natural midpoint:
> "Pause. Which question have you found hardest so far? Circle it. What made it hard — did you not know the answer, or did you know some of it but got stuck? What did you do to get unstuck?"

This is not marked. It is a self-regulation cue. The teacher reads these during circulation to diagnose where students are stuck.

### After (Self-reflection)
A structured reflection block at the end of each workbook session (3–4 questions):
1. "Which questions did you find hardest today? Write the question numbers."
2. "Was it hard because you didn't know the concept, or because the question was asking in an unfamiliar way?"
3. "What is one thing you would do differently before the next workbook session?"
4. "Rate your understanding of today's toughest concept: 1 (lost) — 2 (partial) — 3 (got it) — 4 (could teach it). Write one piece of evidence for your rating."

**Attribution check:** The reflection prompts should push students toward process attribution ("I got it because I practiced retrieval") not luck ("I got it because I guessed"). Flag questions that reveal overconfidence: students who rate 4 but got the concept wrong.

---

## Misconception Handling in Workbooks

Misconceptions get their own dedicated question types — not just standard questions where students might reveal a misconception, but questions **designed to surface and correct a specific wrong idea.**

**Misconception question formats:**
- **Error analysis:** "A student wrote: 'When ice melts, the water particles melt too.' What is wrong with this statement? Correct it."
- **Two explanations, one right:** "Here are two explanations of why ice floats. Which is scientifically accurate? How do you know?"
- **Predict with the misconception:** "A student believes particles in a solid don't move at all. What would they predict would happen if you cool a solid to absolute zero? What actually happens — and why?"

Every major misconception listed in the unit's `_context.md` must appear as a misconception question in the workbook. These are marked in the teacher version as **[misconception target: particles = material]** etc. so teachers know to watch for them during circulation.

---

## Workbook Structure — Print-Ready Format

### Front page
- Unit name, student name/date fields
- One sentence: "This workbook is your interleaved practice — questions are scrambled on purpose. The work of figuring out what each question is asking is part of the learning."
- Brief instructions for Core (★) and Extended (★★) questions

### Question pages
- Questions in interleaved order — no sections by lesson or concept
- Lesson-release markers in teacher copy only
- Generous white space for working and diagrams
- Visual questions interspersed, not grouped
- Hint boxes beneath selected Core questions
- Response space sized to signal expected depth: Core recall questions 2–3 lines; Core explanation questions 4–5 lines; Extended questions 6–8+ lines. Shrinking space to fit more questions on a page degrades response quality — students calibrate depth to available space. (Israel, 2010)

### Metacognition check-ins
- Forethought prompt (start of session — teacher-directed)
- Mid-workbook monitoring box (at ~50% completion)
- Reflection block (end of session)

### Stretch zone (final ~20% of questions)
- Label: "Challenge zone — attempt after completing all previous questions"
- Higher-order questions: transfer, evaluation, application to novel contexts
- No scaffolding
- Extended (★★) format exclusively

### Self-assessment rubric (back page)
After the final session:
- For each knowledge cluster in the unit, students rate themselves:
  - "I can explain this without notes": Yes / Getting there / Not yet
  - "One question I still have about this cluster:"
- This feeds directly into inquiry project readiness — students who have gaps know what to address before the project phase begins

---

## Interleaving in Practice — How to Sequence Questions

When writing the workbook, sequence questions using this pattern:

1. Never place two questions on the same concept in a row
2. Return to each concept at least 3 times across the workbook (Nuthall — three encounters)
3. The first appearance of a concept should be its most supported question (Core with scaffold)
4. The second appearance should be Core without scaffold, or Core where the context is shifted slightly
5. The third appearance should be Extended — same concept, applied to a novel scenario or evaluated as an error
6. After all three encounters, a concept may appear in the Stretch zone in a multi-concept question that requires integrating two or more ideas

**Multi-concept questions** (questions that require knowing two things at once) only appear after each concept has had its own dedicated questions first. Do not introduce multi-concept questions early — they overload working memory before the individual schemas are stable.

---

## Connection to the Rest of the Materials Suite

The workbook does not stand alone. It is the practice vehicle for a system:

| Material | Role in relation to workbook |
|---|---|
| **Guided notes / lesson** | Provides the first encounter with each concept; introduces the contexts and examples workbook questions live in |
| **Exit tickets** | Provide daily micro-data on specific gaps; inform which concepts need to reappear prominently in the next workbook session |
| **Quiz (mid-unit)** | A sample from workbook-style questions under more formal conditions; the teacher can see which question types students are stronger/weaker on |
| **Retrieval warm-up** | Short daily version of the same interleaving principle — 3–5 questions, no notes, from across the unit so far |
| **Inquiry project** | The Nuthall "third encounter in a new context" for the most important concepts — workbook questions at Core and Extended level should preview the thinking skills needed in the project |

---

## Evidence Base

Every workbook design decision traces back to:

- **Interleaving:** Rohrer & Taylor (2007) — "The shuffling of mathematics problems improves learning"
- **Desirable difficulties:** Bjork (1994) — productive difficulty enhances encoding
- **UDL:** CAST v3.0 (2024) — multiple means of representation, expression, and engagement; apply at strategy level, not framework level (Boysen, 2024)
- **Scaffolding fade:** Sweller (1988) expertise reversal effect + fading meta-analysis (2024) d = 0.71 (with fading) vs. d = 0.32 (without); fading roughly doubles the effect
- **Scaffolding types and ELL:** Renkl (2002) partial completion; Hattie d = 0.57 graphic organizers; Gibbons (2002) sentence frames — see `research/udl-scaffolding-research.md`
- **Three encounters:** Nuthall (2007) — minimum three complete, separate encounters for long-term retention
- **Metacognition:** Zimmerman (2002) — forethought, monitoring, reflection as a complete self-regulation cycle
- **Misconception correction:** Chi (2008) — refutation + contrast + re-encoding produces more durable correction than re-explanation alone
- **Feedback architecture:** Black & Wiliam (1998) — formative feedback only works if it generates a response

---

## Build Checklist

Before finalising any unit workbook, confirm:

- [ ] Questions are genuinely interleaved — no two consecutive questions on the same concept
- [ ] Every knowledge cluster appears at least 3 times
- [ ] Every major misconception has a dedicated misconception question
- [ ] Core questions include appropriate scaffolds; Extended questions have none
- [ ] At least 30% of questions involve a visual component
- [ ] Diagram labels are integrated directly onto diagrams — no separate legends
- [ ] No decorative images — every visual is explanatory
- [ ] Response space matches question type (Core recall 2–3 lines; Core explanation 4–5; Extended 6–8+)
- [ ] Questions use contexts and examples from the lesson notes package
- [ ] Metacognition prompts appear at start, mid, and end of workbook
- [ ] Scaffolds are progressively removed — more support early, less late
- [ ] Stretch zone is clearly marked and contains only Extended questions
- [ ] Self-assessment rubric maps to unit knowledge clusters
- [ ] Teacher version includes lesson-release markers and misconception target labels
- [ ] Student-facing text is written at Fountas & Pinnell P–Q reading level (science terms kept; surrounding language simplified)
