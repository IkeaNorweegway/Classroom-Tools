# Classroom Materials — Meta Framework
*Curriculum-agnostic. Read this before building anything.*

---

## Purpose

This framework governs how classroom materials are built in this workspace. It applies to any subject or grade. Curriculum-specific details live in a separate context file alongside the curriculum. This file provides the evidence base, architecture, and build protocol that stays constant regardless of what is being taught.

---

## Evidence Foundation

Every design decision here traces back to one of the research files below. Read them if you need the "why" behind a rule.

- `research/lesson-structure-research.md` — retrieval practice, spaced practice, interleaving, worked examples, formative feedback loops
- `research/metacognition-lasting-knowledge-research.md` — metacognition, self-regulation, desirable difficulties, Nuthall's three encounters rule
- `research/udl-scaffolding-research.md` — UDL (v3.0), scaffolding types, fading evidence, access vs. cognitive scaffold distinction, ELL-specific strategies, UDL/desirable difficulties tension
- `research/hattie-visible-learning-research.md` — effect size rankings, d = 0.40 hinge point as strategy filter, Hattie & Timperley four-level feedback model, methodological critiques
- `research/three-act-math-research.md` — Three Act Math structure, information gap theory (Loewenstein), productive failure in math contexts, pseudo-context critique, mathematical modeling cycle
- `research/math-notebook-workbook-design-research.md` — Rule of Four (multiple representations), recording vs. processing distinction, self-explanation effect, low floor/high ceiling tasks, Cornell notes for math, writing-to-learn
- `research/significant-learning-gaps-research.md` — students significantly below grade level, learning disabilities, and intellectual/significant cognitive disabilities: the skill-gap vs. cognitive-disability distinction, explicit/Direct Instruction and CRA evidence, systematic instruction for ID/SCD, and Alberta IPP/Modified-programming context

The short version: memory is built through retrieval under effort, not re-exposure. Difficulty is the mechanism, not the obstacle. Feedback only works if someone acts on it.

---

## Operating Principles

These are the beliefs that drive every design decision. They are a lens, not a rule list. The detailed layer (activity menus, scaffolding types, peer structures, feedback design, UDL, math-specific principles) is in `_pedagogy-reference.md`. Read it when designing a lesson, a task type, a scaffold, or an assessment.

**1. Memory is the residue of thought. (Willingham)**
Whatever causes students to think hard is what produces memory. An activity that students can complete without genuine cognitive effort — by skimming, pattern-matching, or copying — will not produce learning, regardless of how well-designed it looks. Before finalising any task, ask: *can a student complete this without actually thinking?* If yes, redesign it.

**2. Difficulty is the mechanism, not the obstacle. (Bjork)**
Conditions that feel productive — fast, smooth, high-performance — often produce shallow encoding. Conditions that feel slow and hard often produce durable, transferable learning. When students say "this is hard," that is the signal learning is happening. Calibrate for effort within reach, not for comfort.

**3. Familiarity is not knowledge. (Bjork, Roediger)**
Students who have seen material recently feel like they know it. They don't. Feeling of knowing and actual retrieval are different cognitive events. Build in retrieval — not re-exposure — at every opportunity. Never count "we covered this" as learning.

**4. Three complete encounters, minimum. (Nuthall)**
One excellent lesson is almost never enough. Students need at least three separate, complete encounters with a concept — spaced across time — for it to transfer to long-term memory. Plan backward from this: if a concept only appears once, it will not stick. If an encounter is incomplete or contains a misconception, it may do more harm than good.

**5. Background knowledge is the medium of thought, not a prerequisite for it. (Willingham)**
You cannot teach students to think critically about something they know nothing about. Higher-order thinking is not a skill that transfers across empty domains — it runs on knowledge. Build the knowledge base first, explicitly, through direct instruction. Every gap in background knowledge is a constraint on reasoning, not a deficit to work around.

**6. Feedback is only formative if someone acts on it. (Wiliam)**
Feedback that is given but not acted upon has zero learning value. Feedback that is read and filed has zero learning value. Design every feedback moment to include a response: time to revise, a follow-up question, a re-attempt. The design question is always: *what happens after?*

**7. Knowing and regulating are not the same thing. (Flavell)**
A student can know that re-reading is ineffective and still re-read compulsively because it feels productive. Metacognitive knowledge (knowing how learning works) and metacognitive regulation (actually doing it) are separate skills. Teach regulation explicitly — monitor your understanding, adjust when stuck, attribute success to effort not luck — not just once but repeatedly, embedded in tasks.

**8. Peer conversations are powerful and dangerous. (Nuthall)**
The most influential inputs to student learning are often peer conversations — richer than teachers imagine, and riddled with misconceptions that go uncorrected. Unstructured peer time spreads wrong ideas as efficiently as right ones. Every peer task must have a structure that constrains misconception spread: roles, a specific question, a product to produce, or a mechanism for correction.

**9. The reflection phase is the most often skipped and the most important. (Zimmerman)**
Students who only do a task but never reflect on how they did it do not improve across tasks — they repeat the same approaches. Self-reflection (Was my plan right? What did I do when stuck? What would I do differently?) is what converts task completion into genuine skill development. Build it in. Don't assume it happens.

**10. Science is self-correcting — model that in the classroom. (Scientific Methods strand)**
Students should see the teacher change their mind when confronted with evidence. Wrong answers should be treated as data, not failures. Prior explanations that turned out to be wrong (geocentric solar system, taste map of the tongue) should be discussed explicitly. The norm in the classroom should match the norm in science: evidence changes understanding.

---

### Design rules that bind every build

Each rule is explained, with evidence, in `_pedagogy-reference.md`.

- **Produce, don't receive.** A task earns its place only if students must produce or connect. Every blank requires generation, not transcription.
- **Access vs. cognitive scaffolds.** Before adding any scaffold, ask whether it removes an access barrier (may stay) or the difficulty that is the learning target (must be planned to fade). A word bank on a retrieval task removes the retrieval.
- **Plan the fade.** Full worked example → partial completion → prompt only → independent → novel transfer, planned across lessons before building.
- **One version for the full range.** Build a single material with built-in supports and Core/Extended tiers. Do not lower the ceiling. For students years below grade level, first decide whether it is a skill gap or a documented cognitive disability; see `research/significant-learning-gaps-research.md`.
- **Three encounters.** Every key concept is taught once, retrieved once, and met again in a new context. A concept that appears once is not learned.
- **Misconceptions first.** Surface the belief, set up a prediction it gets wrong, contrast explicitly, anchor the correct idea, and return to it in later warm-ups.
- **Peer time is structured or skipped.** Every peer task has roles, a specific question, a product, or a correction mechanism.
- **Feedback includes its response.** Design what the student does with the feedback. Aim comments at process and self-regulation, not at the task or the person.
- **Reflection is built in.** Forethought before significant tasks, reflection after, targeting attribution and process.
- **Vocabulary is the knowledge.** Each new term gets a definition, an example, a non-example, and an application. Never ask students to copy definitions.
- **Math.** Each major concept appears in at least two representations (Rule of Four). Put a self-explanation prompt between each worked example and its practice problem. Reject pseudo-context problems. Prefer low-floor, high-ceiling tasks.

---

## Materials Suite

This is the full target suite for a unit. Build the pieces the request asks for; the suite shows where each piece fits. PPTX decks have not been built for any unit to date.

| Material | Description |
|---|---|
| **PPTX** | Daily instruction slides — diagrams, worked examples, embedded retrieval prompts, discussion anchors. One deck per unit, organized by lesson. |
| **Guided notes package** | Student fill-in that mirrors the PPTX. Print-ready. Leaves blanks at key knowledge points, not at everything. |
| **Entry brain dump** | Pre-assessment. Students write everything they think they know about the unit topic. No stakes. Used to surface prior knowledge and misconceptions before instruction begins. |
| **Unit workbook** | Interleaved practice. Questions are scrambled across the unit's lessons. Students identify and answer the questions they are now able to answer with new knowledge. Grows across the unit. For math: apply the Rule of Four — include at least one representation translation task per concept cluster. Every blank requires generation, not transcription. |
| **Exit tickets** | 2–3 questions per lesson, independent, collected. Teacher reads them before next class and adjusts. |
| **Unit quiz** | Mid-unit formative. Tied to specific Knowledge and Understanding outcomes. Short-answer and explain/justify format. |
| **Unit test** | End-of-unit summative. Covers all three curriculum columns: Knowledge (recall), Understanding (explain/justify), Skills & Procedures (application/performance). |
| **Inquiry project brief** | Structured open-ended project. Runs in the second half of the unit after the knowledge base is established. Gives constraints, a guiding question, and required evidence. 2–3 options per unit so teachers can choose. |
| **Teacher guide** | Light. Timing notes per lesson, Socratic question prompts, misconception flags, lab or activity facilitation notes, and retrieval warm-up suggestions (within-unit and cross-unit). |

---

## Daily Lesson Architecture

Every class period follows this structure regardless of subject or grade.

| Phase | Time | What happens | Evidence basis |
|---|---|---|---|
| **Retrieval warm-up** | 5–8 min | 3–5 short questions on prior content — no notes, low stakes. Within-unit by default; teacher guide flags opportunities to pull from prior units. | Testing effect (Roediger & Butler, 2011); spaced retrieval |
| **Direct instruction** | 15–20 min | New content with 2–3 fully worked examples. I do → We do. PPTX drives this phase. | Cognitive load theory (Sweller, 1988); expertise reversal effect |
| **Guided/interleaved practice** | 20–25 min | Problems or tasks mixing today's content with earlier lessons in the unit. Workbook is the vehicle. Teacher circulates and gives in-class feedback. | Interleaving (Rohrer & Taylor, 2007); desirable difficulties (Bjork, 1994) |
| **Exit ticket** | 5–8 min | 2–3 independent questions, collected. Not discussed as a class. | Formative feedback loops (Black & Wiliam, 1998) |

Working memory degrades after ~20 minutes of receiving new information. The 20-minute cap on direct instruction is a cognitive limit, not a stylistic choice. Do not extend it.

---

## Unit Architecture

Units follow a modified 5E arc at the macro level. Evidence-based lesson structure runs inside each phase.

| Phase | When in unit | What it looks like |
|---|---|---|
| **Engage** | Lesson 1 | Hook and misconception surface. Entry brain dump. Curiosity question or provocative image/demo. No instruction yet. |
| **Explain** | Lessons 2 through ~60% of unit | Direct instruction phase. Guided notes + PPTX. Retrieval warm-ups pull from within the unit as it builds. Workbook questions accumulate. |
| **Elaborate + Explore** | Remaining ~40% of unit | Inquiry project. Students apply the knowledge base they've built. Labs, investigations, design challenges, or research tasks. |
| **Evaluate** | Throughout + end | Exit tickets throughout. Quiz at mid-unit. Test at end. Project assessed on its own rubric. |

**Why Explain before Explore:** Students cannot investigate what they do not yet have a framework to interpret. Inquiry without prior knowledge produces observations without meaning (Sweller; Nuthall). The project phase works because students arrive at it with enough schema to think, not just follow instructions.

**Three Act Math as an Engage phase move (math):**
For math units, Three Act Math (Dan Meyer) is the highest-quality single Engage phase structure available. A short video or image presents a perplexing real-world scenario with no numbers or question provided. Students generate the question, identify required information, work through the math, then compare their estimates to the revealed real answer.

The mechanism is Loewenstein's Information Gap Theory (1994): curiosity is triggered when students perceive a gap between what they know and what they want to know. Act 1 engineers this gap deliberately — the scenario is visible but information-free. Act 2 is a productive failure event (Kapur, 2015): students attempt before having all tools, priming the schema that instruction fills.

**Important constraints:**
- Requires a full class period (50–80 min) — use as a unit opener, not a daily structure
- Only works if Act 1 is genuinely perplexing — a weak Act 1 makes it a decorated word problem
- Does not replace direct instruction; this is the Engage phase, not the Explain phase
- Students need enough prior schema to perceive what's missing — works less well as an absolute zero-knowledge entry point

See `research/three-act-math-research.md` for the full structure, theoretical spine, and evidence quality assessment.

---

## Importance Scale

Use this to score any learning outcome or unit when prioritising instructional time and assessment weight.

| Criterion | Description | Max |
|---|---|---|
| **Transfer value** | Does understanding this unlock learning in future grades or other subjects? | 3 |
| **Foundational** | Do other outcomes in this course depend on this one being understood first? | 3 |
| **Frequency** | How many other outcomes or lessons reference or rely on this concept? | 2 |
| **Misconception load** | Is there a known, persistent wrong belief students bring that will block future learning if uncorrected? | 2 |

**Total: /10**

| Score | Tier | Instructional weeks | Assessment |
|---|---|---|---|
| 8–10 | **Tier 1** | 5–6 weeks | Full test + quiz + inquiry project |
| 5–7 | **Tier 2** | 3–4 weeks | Quiz + inquiry project |
| 1–4 | **Tier 3** | 2–3 weeks | Quiz + project (lighter) |

---

## Silo Design Principle

Units are designed to be self-contained. A teacher can teach any unit in any order without students being disadvantaged.

**What this requires:**
- Every unit defines its own vocabulary — no "as we learned in Unit X"
- Scientific methods skills are embedded in every unit, not assumed from a prior one
- Retrieval warm-ups draw from within the unit by default
- The teacher guide includes optional "connection notes" for teachers who have taught other units — these are invisible in student materials

**What this does not mean:**
- Units cannot reference real-world concepts students likely know (weather, gravity, plants)
- Cross-unit connections are flagged in the teacher guide as optional enrichment, never as prerequisite knowledge

---

## Cross-Curricular Embedding

Separate subjects that are naturally integrated (computer science, math data skills, Indigenous knowledge, literacy) are embedded into the content units where they fit most logically. They do not occupy standalone weeks.

The principle: every embedded element has a genuine content reason to be there, not just a curricular checkbox reason. If the fit requires a stretch, it does not belong.

---

## Build Protocol

Clarifying questions, the artifact compliance gates, and trust mode are defined in `CLAUDE.md`. That file is the single source for them.

Minimum information needed before building anything:
- Subject and grade (if not in context)
- Specific unit or concept
- How many class periods are available
- Any constraints specific to this build not already documented

---

## Design Principles Checklist

Before finalising any artifact, run the checklist in `templates/evidence-design-principles.md`. Every material must pass at least 3 of the 5 criteria. Tier 1 unit materials should pass all 5.

---

## File Naming

Defined in `CLAUDE.md`. Version numbers never get overwritten; bump the number on significant revision.

---

## Expanding This Framework

This framework is science-first but not science-only. When extending to a new subject:
1. Write a curriculum-specific `_courses/[subject]/_context.md` using the same structure as existing ones
2. Adapt the materials suite only where the subject genuinely requires it (e.g., Math may replace the inquiry project brief with a problem set; ELA may replace the workbook with a reading/writing task)
3. Put subject-specific rules in that course context, not in this file
