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

## Pedagogical Framework — How a Master Teacher Thinks

This section is the operating mind behind every material built here. It synthesizes the research into the decisions a skilled teacher makes moment-to-moment: which activity to choose, how hard to make it, when to use peers, how to handle a wrong answer, and when to slow down. Read this before designing any lesson, any task, or any assessment.

---

### The Ten Operating Principles

These are the beliefs that drive every design decision. They are not rules — they are a lens.

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

### Designing Activities — What Makes One Worth the Time

An activity earns its place in a lesson if it requires students to produce or connect, not just receive or recognize. Use this menu to vary the form while holding the principle constant. Variety prevents habituation; the principle ensures learning.

**Retrieval warm-up variations**
The goal is always production from memory — no notes, no prompts beyond the question. Vary the form so it does not become mechanical.

| Format | How it works | Best for |
|---|---|---|
| Short-answer recall | 3–5 written questions, no notes | Standard retrieval across any content |
| Whiteboard brain dump | Write everything you know about X | Unit openers, concept reviews |
| Sketch from memory | Draw the diagram/process without looking | Visual content: cell diagrams, force diagrams, solar system, particle model |
| Partner teach | Explain concept X to your partner, no notes, 90 seconds | Procedural or explanatory content |
| Error correction | Here is a statement with a mistake — find and fix it | Misconception-prone content; forces precise knowledge |
| What's missing? | Incomplete diagram or process — fill in the gap | Visual or sequential content |
| Two truths, one uncertainty | Write two things you're confident about and one you're less sure of | Self-regulation; surfaces where gaps still exist |
| Write the question | Given the answer, write the question | Forces deep familiarity with vocabulary and structure |
| Ranking with justification | Put these concepts in order from most to least [X] — explain | Requires comparative understanding, not just recall |

**Direct instruction variations**
The goal is novice schema-building with minimal extraneous cognitive load. Vary the delivery while keeping I do → We do intact.

| Format | How it works | Best for |
|---|---|---|
| Standard worked example | Teacher solves, narrates each step, students follow in notes | New procedural content |
| Think-aloud | Teacher narrates their own reasoning, including uncertainty — "I'm not sure yet, so I'm going to check..." | Complex reasoning; models metacognitive regulation |
| Deliberate error | Teacher makes a mistake mid-example. Students catch it. Teacher discusses why the error is tempting. | Misconception-prone content; forces active attention |
| Comparative examples | Two worked solutions to the same problem — one correct, one with a common error. Students evaluate which is right and why. | Content with frequent procedural mistakes |
| Partial completion | Teacher works first 2 steps, students complete the rest together | Transitioning from I do to We do |
| Case study | Real-world scenario analyzed as a class — what forces are acting here? what ecosystem is this? | Applied or contextual content |
| Predictive instruction | Before explaining, ask students to predict what they think will happen, then show/explain. Prediction activates prior knowledge and creates a contrast that aids encoding. | Science concepts with observable outcomes |

**Practice variations**
The goal is effortful retrieval and application under interleaved conditions. Vary so students must always identify what kind of problem they're solving — that identification step is where understanding lives.

| Format | How it works | Best for |
|---|---|---|
| Interleaved problem set | Mixed question types from across the unit | Standard practice; the workbook default |
| Sorting/classifying task | Given a set of examples, sort into categories — then justify one borderline case | Conceptual distinction content (biotic/abiotic, internal/external forces) |
| Error analysis | Here is a student's work — find what went wrong and explain why | Misconception correction; requires precise knowledge |
| Analogy building | "This concept is like ___ because ___" | Abstract content; forces connection to prior knowledge |
| Which one doesn't belong? | Four items — one is the odd one out. Explain why. No single right answer required. | Conceptual flexibility; generates discussion |
| Concept mapping | Draw the connections between the key ideas of this unit so far | Mid-unit consolidation; surfaces gaps in schema |
| Predict → observe → explain | Make a prediction, observe the result, explain the discrepancy if any | Lab and investigation phases |
| Jigsaw | Groups become experts on one concept, then regroup to teach others | Content with multiple distinct, equally important components |
| Convince me | One student defends a claim; partner tries to find flaws; switch | Forces justification; builds argumentation |

**Exit ticket variations**
The goal is individual formative data the teacher can act on. Must be independent — no group discussion.

| Format | How it works | Best for |
|---|---|---|
| 2–3 short answer | Standard written check | Any content |
| Muddiest point | What is still unclear after today? | After dense instruction — surfaces confusion before it becomes entrenched |
| Diagram completion | Complete or label a diagram from today's lesson | Visual/structural content |
| Teach it | Explain concept X as if to a Grade 4 student | Checks depth of understanding vs surface familiarity |
| Confidence + evidence | Rate your understanding 1–5. Write one piece of evidence for your rating. | Builds self-regulation; surfaces overconfidence |
| One-sentence claim | Write one claim from today's lesson and the evidence that supports it | Scientific methods integration; checking explanatory understanding |

---

### Difficulty Calibration — Finding and Holding the Sweet Spot

Desirable difficulty sits at the intersection of achievable and effortful. Too easy = boredom and shallow encoding. Too hard = cognitive overload and shutdown. The target is Vygotsky's zone of proximal development: students can get there, but not without effort.

**Signals that difficulty is well-calibrated:**
- Students are slow but not stopped
- Wrong answers reveal partial understanding, not random guessing
- Students ask "why" not "what does this even mean"
- Students make progress within the class period

**Signals of too easy:**
- Task is finished well within time with nothing left to do
- Students give correct answers without being able to explain them
- Engagement drops midway through

**Signals of too hard (cognitive overload):**
- Random guessing with no reasoning
- Shutdown — students stop working and disengage
- Students cannot identify what type of problem they're solving
- Wrong answers that show no connection to the concept at all

**Scaffolding levers to adjust difficulty:**
- Add or remove a worked example before the task
- Increase or decrease the number of steps provided
- Change from recall to recognition temporarily, then return to recall
- Reduce the number of variables in a problem while keeping the cognitive demand
- Provide vocabulary support during practice for ELL students without reducing the conceptual demand

**The expertise reversal effect (Sweller):** As students gain competence, worked examples become a hindrance. Fade the scaffolding deliberately: full example → partial example → prompt only → independent. Giving competent students fully worked examples slows them down.

See **Scaffolding Architecture** below for the full scaffolding taxonomy, fading sequences, and the access vs. cognitive scaffold distinction — the most important design principle governing all scaffolding decisions.

---

### Peer Time — Structure It or Skip It

Peer conversation is among the most powerful inputs to learning (Nuthall) and among the most dangerous if unstructured. Misconceptions spread through peer talk at the same speed as correct ideas. Every peer task must have one of the following:

**Structure A — Reciprocal teaching (Brown)**
Assign four rotating roles: Summariser (restates what was just covered), Questioner (asks a genuine question about it), Clarifier (addresses confusion), Predictor (what comes next?). Used in the Elaborate/Explore phase — requires knowledge base to function.

**Structure B — Think-pair-share with accountability**
Students think independently first (written, not just in their head). Share with a partner. One partner reports to the class. The reporting step is the accountability mechanism — prevents pairs from drifting.

**Structure C — Peer instruction (Mazur)**
Pose a multiple-choice question with plausible distractors based on common misconceptions. Students answer individually. Students who disagree discuss with a partner. Class revotes. Teacher discusses the result. Works because arguing for or against a position requires articulating reasoning — which is itself a retrieval and elaboration event.

**Structure D — Error checking**
Exchange work. Mark each other's using a key or criteria. Flag disagreements. Discuss. The checking step requires independent judgment before peer influence, which reduces misconception spread.

**Structure E — Convince me**
Student A makes a claim. Student B tries to find a flaw. Roles switch. Teacher circulates and intervenes when misconceptions are being reinforced rather than challenged.

**When to use peer time:** During the guided practice phase, once students have enough knowledge to have something to think about together. Peer time during direct instruction (before students have a framework) produces noise, not learning.

---

### Misconception Handling — The Highest-Leverage Teaching Move

A corrected misconception produces more durable learning than a clean first-pass explanation of a concept students had no prior belief about. Misconceptions are not deficits — they are the terrain.

**The misconception handling sequence:**

1. **Surface before instruction** — Entry brain dump and the Engage phase exist partly for this. Don't correct yet. Just note what students believe.

2. **Design a prediction that the misconception makes wrong** — If a student believes plants get food from soil, they will predict that a plant grown in soil but sealed from CO₂ will grow normally. Set up the experiment or scenario. Let the prediction fail.

3. **Contrast explicitly** — "You predicted X because you believed Y. What we observed was Z. Why?" Do not just present the correct answer. The contrast between prediction and observation is the learning event.

4. **Anchor the correct idea** — The correct idea must be as memorable as the misconception it replaced. Give it a hook: a striking example, a real-world application, a physical demonstration, a vivid analogy. A correct but forgettable explanation loses to a wrong but memorable prior belief.

5. **Return to it in retrieval warm-ups** — Misconceptions relapse. Students who correctly explain phase change on the unit test may revert to "particles disappear" six weeks later. Include misconception-targeted questions in future retrieval warm-ups.

**The Socratic misconception approach (teacher guide tool):**
Rather than correcting directly, ask questions that make the misconception visible to the student:
- "If that were true, what would we expect to see when we do X?"
- "Does that match what we observed?"
- "What would have to be true for your explanation to work?"
Students who arrive at the contradiction themselves retain the correction better than students who are told they were wrong.

---

### Reflection and Self-Regulation — Zimmerman's Three Phases

Zimmerman's self-regulated learning model identifies three phases. The third is the most often skipped and the most important for improvement across tasks.

**Phase 1 — Forethought (before the task)**
Students who plan before working perform better and improve faster. Build in a brief forethought prompt before significant tasks:
- "What do you think the hard part of this will be?"
- "What's your strategy for getting started?"
- "What do you already know that will help here?"

This is not filler — it activates relevant prior knowledge and sets a goal that the student can evaluate afterward.

**Phase 2 — Performance monitoring (during the task)**
Students who monitor their own understanding while working adjust and recover faster than those who don't notice they're confused. Build in mid-task monitoring prompts (in the teacher guide, not in student materials):
- "Pause. Does this make sense so far? If not, what specifically is unclear?"
- "If you got stuck here, what would you do?"
- "Can you explain what you just did in your own words before moving on?"

**Phase 3 — Self-reflection (after the task)**
This is the phase that converts task completion into genuine learning. Without it, students repeat the same approaches regardless of whether they worked. Build structured reflection into:
- The end of any inquiry project ("What would you do differently? What does your result mean?")
- Returned assessments ("Where did you lose marks? What did you misunderstand? What will you do before the next assessment?")
- Major workbook sets ("Which questions were hardest? Why? What does that tell you about your understanding?")

Reflection prompts should target **attribution**: "Did you get this right because you understood it, or because you got lucky?" and **process** ("What did you do when you got stuck?") not just **performance** ("How did I do?").

---

### The Three Encounters Lens — Planning Backward from Nuthall

Before finalising a unit plan, run every key concept through this check:

**Encounter 1:** Where is this concept first explicitly taught? (Direct instruction phase — guided notes, PPTX)

**Encounter 2:** Where does the student have to retrieve and apply it? (Retrieval warm-up in a later lesson, workbook question, quiz)

**Encounter 3:** Where does it appear in a new context or in connection with another concept? (Inquiry project, interleaved practice, a later unit's retrieval warm-up)

If any key concept only has one encounter, plan a second and third before building the materials. Concepts that appear in the unit once are not learned — they are encountered.

**The misconception corollary (Nuthall):** An incomplete encounter — one that leaves a gap or contains a peer-introduced error — can be worse than no encounter at all, because it gives students a false sense of knowing. Ensure every encounter is complete: the concept, its application, and the correction of any predictable confusion.

---

### Feedback Architecture — What Happens After?

Every feedback moment in the materials must be designed with its response built in. The question is never "how do we give feedback?" — it is "what does the student do with it?"

**Exit ticket → teacher response:**
Teacher reads exit tickets before next class. Next class opens with the retrieval warm-up targeting what the exit tickets revealed. If 70%+ of students showed a specific gap, the warm-up addresses it directly before moving on.

**Quiz → student response:**
Return quizzes with comments, not just marks. Build in 5–10 minutes at the start of the following class for students to read feedback and do one of: correct an error, explain why they lost a mark, or write one question they still have. Feedback not acted upon is decoration.

**Workbook → in-class circulation:**
The teacher's job during the practice phase is not to wait at the front. It is to circulate, observe misconceptions live, and correct them before they become entrenched. A misconception caught during practice is corrected in 30 seconds. The same misconception left until the test requires re-teaching.

**Inquiry project → structured reflection:**
Return projects with specific feedback tied to the criteria. Students write a one-paragraph response: what they would change, what they now understand that they didn't when they started, what question they still have.

**The four levels of feedback (Hattie & Timperley, 2007):**
Not all feedback is equally effective. Level determines outcome more than quantity or timing.

| Level | Question it answers | Effect | Design implication |
|---|---|---|---|
| **Task** | "Is this correct?" | Variable | Necessary but not sufficient — use for immediate error correction only |
| **Process** | "What strategy should I use?" | High | Target this in teacher comments and teacher guide responses to common errors |
| **Self-regulation** | "How am I monitoring my own understanding?" | High | Build into exit ticket design and returned-assessment reflection prompts |
| **Self** | "How am I doing as a person?" | Negative to zero | Avoid — praise unlinked to process or product has weak to negative learning effects |

Write teacher guide feedback suggestions at the process and self-regulation levels, not the task level. The task level ("this is wrong") is where most classroom feedback stops. The process level ("what step did you use, and what would a different step give you?") is where learning accelerates.

See `research/hattie-visible-learning-research.md` for the full Hattie & Timperley model and effect size evidence.

---

### Vocabulary as Knowledge — Not a Separate Topic

Vocabulary is not a warm-up activity or a word wall exercise. Vocabulary IS the knowledge. A student who cannot name the parts of a concept cannot think clearly about it — the label gives the handle that the mind uses to manipulate the idea.

**Principles for vocabulary in materials:**
- Introduce vocabulary in the context of its use, not in isolation before instruction begins
- Every new term gets: a definition, an example, a non-example, and an application
- Never ask students to copy definitions — ask them to write the definition in their own words, use the term in a sentence about something real, or identify which of three examples correctly uses the term
- Vocabulary appears in retrieval warm-ups — not just the week it's introduced, but in subsequent weeks
- The teacher guide flags vocabulary that is likely to cause confusion: terms that overlap with everyday language (force, work, energy, matter, ecosystem) are the highest-risk words because students believe they already know them

---

### Universal Design for Learning — Design Philosophy

UDL is a **proactive design philosophy**: barriers are anticipated and removed from materials before any specific student is known. It is not differentiated instruction, which is a responsive practice (adjusting after you know who your students are). UDL minimises the need for differentiation; it does not eliminate it.

**UDL Guidelines v3.0 (CAST, 2024) — three principles:**

| Principle | "The ___ of learning" | Most relevant to print materials |
|---|---|---|
| **Multiple Means of Representation** | What | Vocabulary in context; text + diagram + worked example; activate prior knowledge explicitly; advance organizers |
| **Multiple Means of Action & Expression** | How | Vary response formats; executive function supports (checklists, planning prompts); tiered question complexity (Core/Extended) |
| **Multiple Means of Engagement** | Why | Vary challenge level; make goals visible; vary task contexts; build in collaboration structures; self-regulation prompts |

For print materials, Representation and Action/Expression considerations have the strongest fit. Engagement is primarily a teacher-delivery decision.

**Evidence caveat (important):** UDL as a whole-framework intervention has a moderate, methodologically uneven evidence base (g ≈ 0.43 for achievement; Kieran & Anderson, 2019). The neuroscientific framing of the three principles — three distinct brain networks — is **not empirically supported** (Boysen, 2024). Do not treat "UDL-aligned" as equivalent to "evidence-based." Each UDL strategy has its own independent evidence base (vocabulary instruction, graphic organizers, worked examples, advance organizers). Cite the strategy-level evidence, not the framework.

**The UDL vs. desirable difficulties tension — resolved by precision:**
UDL's impulse to remove barriers can, if applied without discrimination, remove difficulties that are the learning target. This conflicts directly with desirable difficulties research (Bjork, 1994) and productive failure research (Kapur, 2015). The resolution is not compromise — it is precision:

- **Remove freely:** access barriers irrelevant to the learning target (format, language accessibility, sensory presentation, task instructions) — these are extraneous cognitive load
- **Do not remove:** difficulties that are the learning target (retrieving vocabulary from memory, generating an explanation, applying a principle to a novel context, discriminating between concept types in interleaved practice) — these are desirable difficulties

A word bank on a retrieval task removes the retrieval. A sentence frame that supplies reasoning removes the reasoning. Both are instances of UDL applied too broadly, conflating access barriers with productive difficulty.

**Single-version materials — the equity principle:**
A well-designed single material with built-in vocabulary support, visual representations, tiered question complexity, and executive function prompts serves more learners than separate versions. Separate materials carry the Matthew Effect risk (Stanovich, 1986): students consistently assigned to simplified materials are exposed to less grade-level vocabulary, less complex syntax, and shallower content — compounding over years into knowledge deficit cascades. Build for the full range. Do not lower the ceiling.

**Students significantly below grade level (multiple grades behind):** For a student working years behind grade placement, first determine whether the gap is a skill deficit (achievement behind, cognitive ability typical — including undiagnosed or diagnosed LD) or a documented intellectual/significant cognitive disability. The two need different responses: a skill gap keeps the grade-level topic and outcome, with reading/writing load reduced through access scaffolds while the concept stays intact, plus an explicit, high-repetition foundational-skills track (decoding, number sense) running in parallel — not folded into the content assignment. A documented cognitive disability calls for IPP-specified alternate/modified outcomes taught through systematic instruction (task analysis, planned prompting), with materials kept age-appropriate even as skill demand drops. Defaulting to "just make it easier" without first knowing which case applies is the most common design error. Full evidence base, effect sizes, and the Alberta IPP/Modified-programming framework: `research/significant-learning-gaps-research.md`.

---

### Scaffolding Architecture — Types, Fading, and the Crutch Problem

**The original definition (Wood, Bruner & Ross, 1976):** Effective scaffolding is contingent — it adjusts to the student's current state in real time. More help on failure, less help on success. Modern usage has drifted to mean any support added to a task. The original definition is more useful.

---

#### The Access vs. Cognitive Scaffold Distinction

This is the most important design principle in this section. Every scaffold decision starts here.

| Type | What it removes | Learning target affected? | Should it fade? |
|---|---|---|---|
| **Access scaffold** | Barriers irrelevant to the learning target (format, language, sensory) | No — demand is unchanged | May be permanent |
| **Cognitive scaffold** | Difficulty that is the learning target; supports thinking through genuine challenge | Yes — must be removed as competence builds | Must fade |

**Ask before adding any scaffold:** *Is this removing an access barrier, or is it removing cognitive demand that is the learning target?* The first can stay. The second must be planned to fade.

Examples: A picture glossary for a student blocked by English vocabulary on a content comprehension task = access scaffold. A word bank on a vocabulary retrieval task = cognitive scaffold (removing the retrieval demand). A partially completed worked example = cognitive scaffold (appropriate; must be faded). Text-to-speech for a student with a decoding disability answering a science question = access scaffold.

---

#### Scaffolding Types and Evidence

| Type | What it does | Fades? | Evidence | Citation |
|---|---|---|---|---|
| **Worked examples** | Full solution with narration; teacher models the thinking | Yes → partial → prompt → independent | Strong | Sweller (1988) |
| **Partial completion** | Same structure as worked example; one or more steps removed; backward fading > forward | Yes — this IS the fading move | Strong | Renkl (2002, 2005) |
| **Hint sequences** | Hierarchical prompts, least to most explicit; student gets minimum help to proceed | Yes → withdraw levels as competence grows | Moderate-to-Strong | VanLehn (2011) |
| **Graphic organizers** | Externalise structure; offload working memory; free resources for comprehension | Transition to student-generated structures | Moderate-to-Strong | Hattie d = 0.57; Kim et al. (2004) |
| **Advance organizers** | Pre-instruction overview; activates schema; comparative > expository | N/A — used before instruction, not faded | Moderate | Ausubel (1960); Stone (1983) d = 0.55 |
| **Sentence frames** | Scaffold academic language output; target a specific linguistic structure | Yes — frame → approximation → independent | Moderate (production); Moderate, risk (dependence) | Gibbons (2002); Alvarez (2023) |
| **Checklists** | Procedural support for complex multi-step tasks | Yes — student internalises the sequence | Moderate | Rosenshine (2012) |

---

#### Fading — The Most Underused Design Move

Scaffolding without fading roughly halves the learning effect: d = 0.71 (with explicit fading protocols) vs. d = 0.32 (without). Fading is not optional — it is causally important to outcomes.

**Default fading sequence for any cognitive skill:**
1. Full worked example *(Lesson N)*
2. Partial completion — same structure, one step missing *(Lesson N+1 or N+2)*
3. Prompt only — "What comes next? What type of problem is this?" *(later lesson)*
4. Fully independent problem
5. Novel transfer context — new scenario, different application

This sequence should be **planned across lessons** before building the materials, not assumed to happen naturally. State the intention to students: "We are using this scaffold now; by Lesson X, you will be doing this without it."

**Moderator:** Students with lower working memory benefit from slower fading (Miller-Cotto & Brock, 2026). The teacher reads the room; the teacher guide signals when to hold vs. release.

---

#### Hard vs. Contingent Scaffolds — What Print Can and Cannot Do

**Hard (static) scaffolds** — planned in advance, embedded in materials, available to all students regardless of their current state. All print-material scaffolding is hard scaffolding.

**Contingent (soft) scaffolds** — spontaneous teacher responses, adjusted in real time to the individual student's specific error or gap. The most effective type (Wood et al., 1978).

Print materials can only deliver hard scaffolds. **The teacher guide is the vehicle for contingent scaffolding:** it should specify what common errors look like during practice, and what the minimum effective hint is for each error pattern. Hard scaffolds in the material and contingent scaffolds from the teacher are complementary — they cover different functions, not the same function.

---

#### ELL-Specific Scaffolding

**Word banks:** Build them larger than the number of blanks and include plausible distractors — this requires semantic selection, not just letter-matching. Student-generated word banks are more cognitively engaging than teacher-provided lists. Evidence quality: Weak-to-Moderate.

**Sentence frames:** Use for specific academic language structures that are genuinely new to the student, not for content recall. The goal is to scaffold the linguistic register, not the reasoning. Fade as the student demonstrates control of that structure. Heavy reliance on pre-scripted frames can reduce meaning-making in the content domain (Alvarez, 2023).

**Graphic organizers:** The strongest-evidenced ELL scaffold. Use as a thinking tool during the task; transition to student-generated organizer structures as a next step. Evidence quality: Moderate-to-Strong.

---

#### When Scaffolding Becomes a Crutch

Five conditions under which scaffolding reduces learning:

1. **Not faded** — remains permanently regardless of student competence
2. **Removes the learning target** — the difficulty being removed is exactly what students are supposed to be learning to do
3. **Undifferentiated** — applied to every student on every task regardless of need
4. **Consistently below grade level** — simplifies task demands rather than supporting students through grade-level demands
5. **Substitutes for instruction** — provides the answer structure rather than helping students build toward it

Conditions 2 and 4 are the most serious long-term risks. Permanently simplified materials reduce exposure to grade-level vocabulary, complex syntax, and ambitious content — compounding over years. Scaffolding should bring students to grade-level demand, not replace it.

---

#### Metacognitive Scaffolding

Metacognitive scaffolding — prompts that help students monitor their own understanding and regulate their strategy — is among the highest-leverage scaffold types. Evidence: g = 0.40–0.50 for learning outcomes (Guo et al., 2022); +7 months of additional progress (EEF, 2021); d = 0.60 (Hattie, 2009).

Generic prompts ("How are you doing?") show weak effects. Specific process prompts with a response mechanism show consistent effects.

**Types and placement:**

| Position | Type | Example |
|---|---|---|
| Pre-task | Planning + prior knowledge activation | "What do you think the hardest part of this will be? What do you already know that will help?" |
| Mid-task | Comprehension monitoring | "Stop here. Does this make sense? If not, what specifically is unclear?" |
| Post-task | Process reflection | "Where did you get stuck? What did you do? Would you do it differently?" |
| Post-task | Attribution | "Did you get this right because you understood it, or because you got lucky?" |
| On returned work | Error diagnosis | "Was this wrong because you didn't understand, or because of a careless mistake? What is the difference?" |

Build metacognitive prompts into workbook reflection sections and on returned assessments — not as filler but as deliberate self-regulation practice. They extend Zimmerman's Phase 3 (Self-reflection) from the macro arc into every major practice event.

---

### Math-Specific Design Principles

These principles extend the general framework for math materials. They do not replace the general scaffolding, retrieval, or UDL principles above — they apply on top of them.

**The Rule of Four (Lesh, Post & Behr, 1987; NCTM):**
Mathematical understanding requires fluency across four representation modes: algebraic/symbolic, numerical/tabular, graphical/visual, and verbal. A student who can only work algebraically has learned a procedure, not a concept.

- Every major concept in a math unit should appear in at least two representation modes
- Translation tasks — "draw the graph that matches this equation," "write the equation that describes this table," "explain in words what the formula means" — are learning events, not just checks
- Not every practice problem needs four representations; the Rule of Four operates at the concept level, not the individual problem level
- Not all combinations of representations are equally effective (Ainsworth, 2006): design tasks that require students to *make* the connection between representations, not just encounter them side by side

**Recording vs. Processing — the most important design distinction for math notebooks:**
The biggest design error in math materials is treating notebooks and workbooks as recording tools. Recording = students transcribe what the teacher produces. Processing = students generate mathematical thinking.

The generation effect (Slamecka & Graf, 1978; d = 0.40–0.50) and self-explanation effect (Fiorella & Mayer, 2016; g ≈ 0.55) both predict large, durable differences between these designs. Every blank in a math notebook should require production from reasoning — not transcription from the board.

| Recording (avoid) | Processing (build toward) |
|---|---|
| Copy the worked example | Reproduce it from a partial prompt with notes closed |
| Write the definition | Write it in own words; generate a non-example |
| Record the formula | Derive it from a specific case; explain what each part means |
| Label a pre-drawn graph | Produce the graph from the equation or table |
| Answer the practice problem | Name the problem type, then solve it |

**Self-explanation after worked examples:**
Insert a self-explanation prompt between each worked example and its practice problem: "Explain what happened at Step [X] and why that step was necessary." This is the highest-yield single move for math workbooks — g ≈ 0.55 for transfer (Fiorella & Mayer, 2016; Renkl, Atkinson & Grosse, 2004).

**Low Floor, High Ceiling tasks (Boaler, 2016):**
The math-specific resolution to the UDL/desirable difficulties tension. One task that all students can enter (low floor = access) but that extends to genuine mathematical complexity (high ceiling = productive difficulty preserved). Design move: specific case → generalization → edge case → proof.

This is not the same as "open tasks." Low floor/high ceiling requires a deliberately designed ceiling — a task that doesn't extend is just easy, not open. Evidence quality for the principle is moderate; Boaler's broader mindset program claims are contested.

**Pseudo-context test (Meyer, 2010):**
Before including any "real world" math problem in workbooks or assessments, apply this test: if you strip the scenario down to the numbers and the operation, does the problem remain identical? If yes, it's pseudo-context — the scenario is cosmetic and students will ignore it. A genuine context is one where the scenario generates the mathematical question and removing it makes the problem incoherent. Prefer naked math problems over thin scenarios students will immediately strip.

See `research/math-notebook-workbook-design-research.md` for the full evidence base behind these principles.

---

## Materials Suite

Every unit produces the same set of materials. Nothing is optional.

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

### Clarifying questions

Triggered whenever a build/make/create/write request comes in. Only ask what is genuinely missing — do not ask about things already established in context or in the curriculum-specific context file. Keep questions short and direct. Maximum 4 at once.

Minimum information needed before building anything:
- Subject and grade (if not in context)
- Specific unit or concept
- How many class periods are available
- Any constraints specific to this build not already documented

### Trust mode

Activated by the user saying **"i trust you."** Resets at the start of each new conversation — default is question mode.

When trust mode is active:
- Proceed through all materials for the requested unit without asking for confirmation at each step
- Note at the start of the build: *Trust mode active.*
- Flag decisions that are genuinely ambiguous (not just stylistic) — do not silently guess on things that would require rework to fix
- Trust mode applies to the current build task, not permanently to all future requests in the session

---

## Design Principles Checklist

Before finalising any artifact, run the checklist in `templates/evidence-design-principles.md`. Every material must pass at minimum 3 of 5 criteria. Tier 1 unit materials should pass all 5.

---

## File Naming

Governed by the curriculum-specific context file. General pattern:
`[subject]-[unit/concept]-[material-type]-[grade]-v[N].[ext]`

Version numbers never get overwritten — bump the number on significant revision.

---

## Expanding This Framework

This meta framework is science-first but not science-only. When extending to a new subject:
1. Create a `[subject]-[grade]/` subfolder
2. Write a curriculum-specific `_context.md` using the same structure as existing ones
3. Adapt the materials suite only where the subject genuinely requires it (e.g., Math may replace inquiry project brief with a problem set; ELA may replace workbook with a reading/writing task)
4. Do not modify this file — add to the curriculum-specific context instead
