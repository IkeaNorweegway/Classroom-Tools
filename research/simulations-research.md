# Interactive Simulations and Trainers — Research Summary
*Research session: October 2026. Sources: one systematic meta-analysis of K–12 STEM simulations (SRI, 2014; figures checked against the report), one meta-analysis of discovery learning, the PhET interview studies, reviews of virtual vs physical labs and virtual manipulatives, and one classroom trial of a programming routine. Some figures come from abstracts and later citations; each is marked.*

---

## How to Read This File

This file supports `_sims-context.md`, the build and design rules for every `*-sim-*` and `*-trainer-*` page on the site.

The findings that matter most:
1. Simulations help learning when they are compared with the same teaching without them. In the SRI meta-analysis the effect on achievement was moderate to large (g = 0.62).
2. **The same simulation with added scaffolding and feedback beat the plain version** (g = 0.49). How a sim guides the student matters about as much as having one.
3. Open discovery with no guidance does worse than explicit teaching. Discovery with guidance (feedback, worked examples, prompts to explain) does better.
4. Predicting before the run is what turns watching into learning.
5. A simulation supplements hands-on work and the teacher. It does not replace them.

---

## Topic and Why It Matters

Here, a **simulation** is a page with a model behind it: the student changes inputs and watches the outputs (Plant Lab, Flower Lab, the Math 9 Fraction and Pythagorean Simulators). A **trainer** is checked practice on a model of a tool the class will use for real (the Dash, littleBits and Python Trainers).

They matter here because:
- Plant processes, pollination and signal flow can't be seen in class at the speed or scale where they happen. A model makes them visible.
- Students can run a "what if" (no bees, sealed jar, a backwards bit) that would be slow, costly or impossible to set up for real.
- They are easy to build badly. A sim with sliders and no task invites clicking, not thinking.

---

## Core Finding

**Simulations work, and guided simulations work better.** In the SRI meta-analysis of K–12 STEM studies, simulation-based teaching beat similar teaching without simulations on achievement. Adding scaffolding and feedback to the same simulation raised learning again. The discovery-learning meta-analysis says the same from the other side: unassisted discovery loses to explicit teaching, and enhanced discovery wins.

The design question is never "sim or no sim?" It is "what does the student do in it?"

---

## Key Sources

### 1. D'Angelo et al. (2014). *Simulations for STEM Learning: Systematic Review and Meta-Analysis.* SRI International.

- **What it was:** 59 experimental or quasi-experimental K–12 studies (1991–2012), giving 128 effect sizes. A simulation was defined as an interactive environment with an underlying model, neither a plain visualization nor a game.
- **What it found** (figures from the report overview):

| Comparison | Outcome | g+ | Effect sizes | Improvement index |
|---|---|---|---|---|
| Sim vs no sim | Achievement | **0.62** (p < .001) | 46 | 23% |
| Enhanced sim vs same sim | Achievement | **0.49** (p < .001) | 50 | 19% |
| Sim vs no sim | Inquiry and reasoning | 0.26 (p = .17, not significant) | 6 | 10% |
| Enhanced sim vs same sim | Inquiry and reasoning | 0.41 (p < .001) | 11 | 16% |
| Sim vs no sim | Non-cognitive (interest, attitude) | 0.69 (p < .001) | 12 | 26% |

- "Enhancements" means added learner scaffolding and certain kinds of feedback.
- More sessions with a simulation went with larger achievement gains.
- Most studies were in science. There were few in mathematics or engineering.

### 2. Alfieri, Brooks, Aldrich & Tenenbaum (2011). Does discovery-based instruction enhance learning? *Journal of Educational Psychology*, 103(1), 1–18.

The meta-analysis covered 164 studies.
- **Unassisted discovery vs explicit teaching:** explicit teaching won (d = −0.38, 580 comparisons).
- **Enhanced discovery vs other forms of teaching:** enhanced discovery won (d = 0.30, 360 comparisons). "Enhanced" means feedback, worked examples, scaffolding, or asking learners to explain.
- In mathematics the enhanced-discovery effect was a little lower (about 0.29).

For sims, this means free play alone is unassisted discovery. Tasks, feedback and explain-prompts turn it into the enhanced kind.

### 3. de Jong & van Joolingen (1998). Scientific discovery learning with computer simulations of conceptual domains. *Review of Educational Research*, 68(2), 179–201.

This classic review lists where students go wrong in a simulation:
- they struggle to form a hypothesis;
- they design poor experiments, usually by changing several variables at once;
- they misread their data;
- they lose track of what they have tried.

Supports that helped: assignments (set tasks), hypothesis prompts, model progression (start simple, add variables) and structured records. This is the source of the "change one thing at a time" rule.

### 4. Adams et al. (2008). A study of educational simulations, Part II: Interface design. *Journal of Interactive Learning Research*, 19(4), 551–577. (PhET, University of Colorado)

- **What it was:** over 200 interviews of students using PhET sims while thinking aloud.
- **What it found:** when the interface is not intuitive, attention shifts from the science to working the controls.
- **Guidelines:** controls that look like what they do, direct manipulation, little text, and help that is there but not in the way.
- **Later PhET work:** describes "implicit scaffolding". The sim's design (which controls exist, what the student sees first) guides exploration without explicit instructions. Examples are Podolefsky, Perkins & Adams (2010) and Perkins et al. (2012); this is from secondary summaries.

### 5. Crouch, Fagen, Callan & Mazur (2004). Classroom demonstrations: Learning tools or entertainment? *American Journal of Physics*, 72(6), 835–838.

- **What it was:** a comparison of ways of running the same physics demonstrations.
- **What it found:** students who predicted the outcome before seeing it understood the result significantly better. Watching without predicting added little. (The finding as later sources report it; full text not checked.)

This is the same mechanism as predict–observe–explain (White & Gunstone, 1992) and the slow-reveal routine (`slow-reveal-graphs-research.md`).

### 6. Smetana & Bell (2012). Computer simulations to support science instruction and learning: A critical review of the literature. *International Journal of Science Education*, 34(9), 1337–1370.

- **What it was:** 61 studies since 1972, K–12 and college.
- **What it found:** simulations improved content knowledge, process skills and conceptual change, as well as or better than traditional teaching. They worked best as a **supplement** to other teaching, with the teacher guiding.
- Good use included: high-quality support materials, reflection, cognitive dissonance (a prediction that fails), and inquiry framing.

### 7. Virtual vs physical: labs and manipulatives

- **Brinson (2015)**, *Computers & Education*, 87, 218–237.
  - **What it was:** a review of post-2005 studies comparing virtual or remote labs with hands-on labs.
  - **What it found:** in 89% of them (50 studies), learning outcomes were equal or higher in the non-traditional lab.
- **de Jong, Linn & Zacharia (2013)**, *Science*, 340, 305–308.
  - **What it was:** a narrative review of physical and virtual labs in science and engineering.
  - **What it found:** each has its own strengths. Virtual labs can show the unseen and run many trials fast. Physical labs give real data, measurement error, and the feel of the equipment. The authors recommend **combining** them, not choosing one.
- **Moyer-Packenham & Westenskow (2013)**, *International Journal of Virtual and Personal Learning Environments*, 4(3).
  - **What it was:** a meta-analysis of virtual manipulatives in mathematics, reviewing 66 studies.
  - **What it found:** a moderate overall effect over other teaching, about 0.34 across 82 effect sizes, as later papers by the same authors report it. Their 2016 update, with more studies, found the same moderate effect. (The 2013 paper's own figures were not checked.)
- **Carbonneau, Marley & Selig (2013)**, *Journal of Educational Psychology*, 105(2), 380–400.
  - **What it was:** a meta-analysis of concrete manipulatives in mathematics, 55 studies.
  - **What it found:** a small-to-moderate benefit over abstract symbols alone (d = 0.37). The benefit depended heavily on the instructional guidance given with them.

### 8. Trainers: Sentance, Waite & Kallia (2019). Teaching computer programming with PRIMM: a sociocultural perspective. *Computer Science Education*, 29(2–3), 136–176.

- **What it was:** PRIMM (Predict, Run, Investigate, Modify, Make) was trialled in 13 English schools with 493 students aged 11–14, against a control group, for 8–12 weeks.
- **What it found:**
  - PRIMM students scored higher on the post-test.
  - Teachers said it let every student progress in mixed-ability classes.
  - Students read and predict working code before they write their own. That mirrors the trainers' checked steps followed by free play.
- **Limit:** other classroom reports found the final "Make" step hard for multi-step programs.

### 9. Narrow practice after instruction (the Math 9 narrow trainers, 2026-10-29)

The Math 9 trainers are used after a skill has been taught. That changes what helps.

- **Expertise reversal.** Guidance that novices need becomes redundant once learners hold the schema, and can then hurt learning. Detailed text explanations are the usual example. (Kalyuga, Ayres, Chandler & Sweller, 2003.) **Design move:** no intro, tour or worked-example popups; the notes link is there for anyone who needs to relearn.
- **Perceptual learning modules.** Short, varied classification trials with feedback built pattern recognition and fluency in middle and high school mathematics, including an Algebraic Transformations module for Grades 8–9. (Kellman, Massey & Son, 2010.) **Design move:** one narrow skill per tab, many quick items, tap choices where the skill is a decision (Flip?, Direct?).
- **Elaborated feedback.** In computer-based learning, feedback that explains beat giving the correct answer, which beat right/wrong alone: average effects 0.49, 0.32 and 0.05 across 40 studies, with larger effects in mathematics. (Van der Kleij, Feskens & Eggen, 2015; figures from the abstract.) **Design move:** a wrong answer gets a named-error cue and a picture that shows the error, not just ✗.
- **Multiple representations cost effort.** Several linked views only help when the learner can connect them; otherwise they add load (Ainsworth, 2006). **Design move:** one picture per tab, chosen to make that one skill visible.
- **What this format gives up.** Narrow tabs are blocked practice. Interleaved practice is better for choosing a method (Rohrer & Taylor, 2007), so mixing stays in the workbooks and practice tests. Word problems (LE5) stay on paper because they need reading, except on the PAT Word Problems trainer (user request, 2026-10-29). There the picture is schematic, not decorative: students who draw schematic pictures of a problem solve it more often than those who draw pictorial ones (Hegarty & Kozhevnikov, 1999), schema-based instruction with tape and bar diagrams improves word-problem solving (Jitendra et al., 2009), and irrelevant illustrations slow solving down (Berends & van Lieshout, 2009). Its Mixed tab adds the interleaving the PAT asks for.

**Confidence:** moderate. Each finding is well replicated, but none tested a page like ours directly, and the PLM studies used longer modules than a 10-item round.

---

## Effect Sizes at a Glance

| Practice | Effect | Source |
|---|---|---|
| Simulation vs same teaching without | g = 0.62 (achievement) | D'Angelo et al. 2014 |
| Scaffolded or feedback sim vs plain sim | g = 0.49 (achievement) | D'Angelo et al. 2014 |
| Guided ("enhanced") discovery vs other teaching | d = 0.30 | Alfieri et al. 2011 |
| Unassisted discovery vs explicit teaching | d = −0.38 | Alfieri et al. 2011 |
| Virtual manipulatives vs other teaching (math) | ≈ 0.34 (as later cited) | Moyer-Packenham & Westenskow 2013 |
| Concrete manipulatives vs symbols only (math) | d = 0.37 | Carbonneau et al. 2013 |

---

## What It Looks Like in Practice

These are the design rules in `_sims-context.md`, with the evidence for each:

| Rule in `_sims-context.md` | Why |
|---|---|
| Guided, never free play alone (3) | Unassisted discovery loses; scaffolded sims and enhanced discovery win (Alfieri 2011; D'Angelo 2014) |
| Predict, then test (4) | Predicting first is what makes a demonstration teach (Crouch 2004; Smetana & Bell's cognitive dissonance) |
| Change one thing at a time (5) | Students otherwise vary several variables and can't read the result (de Jong & van Joolingen 1998) |
| Let the mistake fail on screen (6) | Conceptual change needs the old idea to visibly fail (Smetana & Bell 2012) |
| Back to paper (7) | Explaining is one of the "enhancements" that make discovery work (Alfieri 2011) |
| Worked example first (8) | Worked examples are the other named enhancement (Alfieri 2011) |
| Trainers supplement the kit (9) | Virtual and physical work best combined (de Jong, Linn & Zacharia 2013; Smetana & Bell 2012) |
| The interface must be obvious (10) | Effort spent working the controls is taken from the science (Adams et al. 2008) |
| Give a sim more than one session | More sessions went with larger gains (D'Angelo 2014) |

**In class:**
- Set the sim as a task with a written product, not as a reward for finishing early.
- Run it alongside the matching notes section.
- Use the real kit or the real plant after the sim, not instead of it.

---

## What It Doesn't Support

- **Free exploration as the main activity.** The evidence is against it, especially for novices.
- **Sims replacing the lab or the kit.** Equal outcomes in some lab studies are not a reason to drop hands-on work. They measured content learning, not measurement skill or how to handle equipment.
- **Big claims for inquiry skills.** Sim vs no sim on inquiry and reasoning was small and not significant (6 effect sizes).
- **Strong claims in mathematics.** Most simulation studies are in science. Math evidence comes mainly from virtual manipulatives, a related but narrower kind of tool.
- **Trainers as proven.** PRIMM supports the shape (read and predict, then modify, then make), but no study tests block or bit trainers like ours directly.
- **Device-based results.** Most studies ran on lab computers with a researcher present. School Chromebooks, touch screens and home use are untested here, as for every build on this site.

---

## Alberta / Canada Angle

- Alberta Science 7 (2007 Program of Studies) expects students to plan and conduct investigations and to interpret evidence. Predict-then-test missions practise that cycle quickly, and the real plant work in the unit then makes it concrete.
- The STEAM trainers prepare for equipment the school owns (Dash, littleBits). Class time on the real kit is limited and shared, so a trainer lets students arrive at the robot already knowing the blocks. That is the "supplement" use the evidence supports.
- PhET (University of Colorado) is free and widely used in Canadian classrooms. Its interview-based design guidance is the closest match to how these sims are built.

---

## Source List

- D'Angelo, C., Rutstein, D., Harris, C., Haertel, G., Bernard, R., & Borokhovski, E. (2014). *Simulations for STEM learning: Systematic review and meta-analysis* (report overview). SRI International. https://www.sri.com/wp-content/uploads/2022/04/simulations-for-stem-learning-brief.pdf
- Alfieri, L., Brooks, P. J., Aldrich, N. J., & Tenenbaum, H. R. (2011). Does discovery-based instruction enhance learning? *Journal of Educational Psychology*, 103(1), 1–18.
- de Jong, T., & van Joolingen, W. R. (1998). Scientific discovery learning with computer simulations of conceptual domains. *Review of Educational Research*, 68(2), 179–201.
- Adams, W. K., Reid, S., LeMaster, R., McKagan, S. B., Perkins, K. K., Dubson, M., & Wieman, C. E. (2008). A study of educational simulations Part II: Interface design. *Journal of Interactive Learning Research*, 19(4), 551–577.
- Crouch, C. H., Fagen, A. P., Callan, J. P., & Mazur, E. (2004). Classroom demonstrations: Learning tools or entertainment? *American Journal of Physics*, 72(6), 835–838.
- Smetana, L. K., & Bell, R. L. (2012). Computer simulations to support science instruction and learning: A critical review of the literature. *International Journal of Science Education*, 34(9), 1337–1370.
- Brinson, J. R. (2015). Learning outcome achievement in non-traditional (virtual and remote) versus traditional (hands-on) laboratories: A review of the empirical research. *Computers & Education*, 87, 218–237.
- de Jong, T., Linn, M. C., & Zacharia, Z. C. (2013). Physical and virtual laboratories in science and engineering education. *Science*, 340(6130), 305–308.
- Moyer-Packenham, P. S., & Westenskow, A. (2013). Effects of virtual manipulatives on student achievement and mathematics learning. *International Journal of Virtual and Personal Learning Environments*, 4(3), 35–50.
- Carbonneau, K. J., Marley, S. C., & Selig, J. P. (2013). A meta-analysis of the efficacy of teaching mathematics with concrete manipulatives. *Journal of Educational Psychology*, 105(2), 380–400.
- Sentance, S., Waite, J., & Kallia, M. (2019). Teaching computer programming with PRIMM: a sociocultural perspective. *Computer Science Education*, 29(2–3), 136–176.
- White, R., & Gunstone, R. (1992). *Probing understanding.* Falmer Press. (Predict–observe–explain.)
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist*, 38(1), 23–31.
- Kellman, P. J., Massey, C. M., & Son, J. Y. (2010). Perceptual learning modules in mathematics: Enhancing students' pattern recognition, structure extraction, and fluency. *Topics in Cognitive Science*, 2(2), 285–305. https://pmc.ncbi.nlm.nih.gov/articles/PMC6124488
- Van der Kleij, F. M., Feskens, R. C. W., & Eggen, T. J. H. M. (2015). Effects of feedback in a computer-based learning environment on students' learning outcomes: A meta-analysis. *Review of Educational Research*, 85(4), 475–511. https://doi.org/10.3102/0034654314564881
- Ainsworth, S. (2006). DeFT: A conceptual framework for considering learning with multiple representations. *Learning and Instruction*, 16(3), 183–198.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481–498.
- Hegarty, M., & Kozhevnikov, M. (1999). Types of visual–spatial representations and mathematical problem solving. *Journal of Educational Psychology*, 91(4), 684–689.
- Jitendra, A. K., Star, J. R., Starosta, K., Leh, J. M., Sood, S., Caskie, G., Hughes, C. L., & Mack, T. R. (2009). Improving seventh grade students’ learning of ratio and proportion: The role of schema-based instruction. *Contemporary Educational Psychology*, 34(3), 250–264.
- Berends, I. E., & van Lieshout, E. C. D. M. (2009). The effect of illustrations in arithmetic problem-solving: Effects of increased cognitive load. *Learning and Instruction*, 19(4), 345–353.
