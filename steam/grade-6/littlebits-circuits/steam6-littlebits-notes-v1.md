# littleBits: Circuits, Algorithms & Sensors — Notes
STEAM · Grade 6 · Unit 1

**Name:** _________________________ **Date:** _____________

**How to use this page:** Read one part at a time. Answer in your own words. When you see a 📌 box, that's a new word — read it before you keep going.

---

## Before We Start

*There are no wrong answers here. Just write what you really think.*

1. Is snapping together littleBits "real coding," or is it something else, since there's no screen and no typed blocks? Write what you think — we'll check later.

_______________________________________________

_______________________________________________

2. When you flip a light switch at home, what do you think actually happens between the switch and the light turning on?

_______________________________________________

<!-- Teacher note: Do NOT correct at this stage. Students return to this page at the Unit Wrap-Up. -->

---

## New Words in This Unit

Fill this in as you meet each word. Use your own words.

| Word | What it means (in your own words) | My example |
|---|---|---|
| Circuit | | |
| Signal / power flow | | |
| Sequence | | |
| Loop | | |
| Conditional | | |
| Input | | |
| Output | | |
| Debug | | |

---

## Part 1: Circuits — Power Has to Flow Somewhere

**Goal:** Explain how power moves through a circuit from a power bit to an output bit. Name the parts of that path.

> 📌 **New word: circuit**
> A connected path that power can travel along. Every littleBits build starts with a power bit and needs an unbroken path to an output for anything to happen.

> 📌 **New word: signal**
> The power/flow moving through the chain. If even one bit isn't connected properly, the signal stops there, and nothing past it turns on.

This is the same **sequence** idea from Dash and Scratch, just made physical: power → input → output, one step after another, in a fixed order you can actually hold and trace with a finger.

A circuit with a bit missing or backwards is your first hands-on **debug**ging — you check each connection in order, the same way you'd check each block in a program.

> **Example:**
> ```
> power bit → wire bit → LED bit
> ```
> Power flows in that order, one bit at a time. If the wire bit is left out or snapped in backwards, the signal never reaches the LED — the sequence is broken, so nothing after that point turns on.

**Check yourself** (don't look back at the page):
1. What has to be true about the path from a power bit to an output bit for the output to turn on?

   _______________________________________________

2. A chain of four bits doesn't produce any output. What's the first thing you should check, and why?

   _______________________________________________

---

## Part 2: Input, Output & Conditionals — Made Physical

**Goal:** Use a sensor bit to create a conditional response. Explain what condition triggers it.

> 📌 **New word: input (bit)**
> A button, light sensor, or sound sensor — it reports something happening in the world into the circuit. Same job an input played on Dash or in Scratch, just wired instead of coded.

> 📌 **New word: output (bit)**
> An LED, buzzer, or motor — what the circuit does in response to the input.

A sensor bit doesn't "decide" anything on its own — it just reports a reading (how much light, how loud a sound). Whether that reading turns something on is decided by how the circuit is built.

> 📌 **New word: conditional**
> A response built into the circuit itself — physical wiring instead of an "if — then" block.

> **Example:**
> ```
> power bit → light sensor bit → buzzer bit
> ```
> The light sensor reports how dark the room is. Wired this way, low light triggers the buzzer to sound — the physical version of "if light level is low, then buzz."

**Common mistake:** "littleBits isn't real coding, because there's no screen, no text, and no blocks."

**Why that's wrong:** The sequence → conditional → loop logic you used in Dash and Scratch didn't disappear. It's still running here — just expressed as physical wires instead of on-screen blocks. A light sensor bit triggering a buzzer bit *is* an "if the light level is below ___, then make sound" conditional. The logic is identical. Only the tool changed.

**What's actually true:** Computational thinking is about the *logic* — sequence, conditional, loop, debug — not about which tool expresses it. Screen blocks and snap-together bits are two different ways to write the same ideas.

**Check yourself:**
1. What job is a sensor bit doing, and what job is the rest of the circuit doing?

   _______________________________________________

2. Why is a light-sensor-triggered buzzer an example of a conditional, even though there's no "if" block anywhere?

   _______________________________________________

---

## Part 3: Loops, Made Physical — the Pulse/Oscillator Bit

**Goal:** Use a bit that produces a repeating behavior. Explain why it acts like a loop.

A pulse or oscillator bit turns an output on and off automatically, over and over, without you snapping the same bit into the chain again and again. That's exactly the job a **loop** does in a program — "repeat this" instead of writing the same instruction over and over.

> **Example:**
> ```
> power bit → pulse bit → LED bit
> ```
> The pulse bit switches the LED on, off, on, off automatically, forever, without anyone re-snapping the LED bit into the chain each time — one bit doing the job of "repeat forever."

**Think about it:** Think of something in real life that blinks or repeats on its own (a turn signal, a crosswalk countdown). What do you think is doing the "looping" job inside it?

_______________________________________________

**Check yourself:**
1. Why does a pulse/oscillator bit count as a loop, even though nothing is being "repeated" in code?

   _______________________________________________

2. Name one real-world blinking or repeating device and guess what's making it loop.

   _______________________________________________

---

## Part 4: Planning Before Building — the Circuit Diagram

**Goal:** Diagram a simple circuit before building it. Predict what it will do.

Before snapping any bits together, sketch a **circuit diagram** — a labeled block-and-arrow drawing showing power → input → output, plus a prediction of what will happen. This isn't a real electrical schematic — no official symbols needed. It's a first attempt at drawing something you can't actually see: signal flow. That's harder than diagramming a maze map, because the thing you're drawing is invisible until it's built.

**Predict, then test:** Diagram your circuit and write your prediction before you snap a single bit together. What do you expect to happen when you connect power to your chosen input and output?

_______________________________________________

**Check yourself:**
1. Why is diagramming signal flow harder than diagramming a path on a map?

   _______________________________________________

---

## Unit Wrap-Up

*Close this page. Answer from memory.*

**Circuits and signal flow:**

_______________________________________________

**Input, output, and conditionals in a physical circuit:**

_______________________________________________

**Why a pulse/oscillator bit is a loop:**

_______________________________________________

**Diagramming a circuit before building it:**

_______________________________________________

---

Now go back to "Before We Start." Read what you wrote about whether littleBits is "real coding."

Were you right? What would you tell your past self about why the logic is the same even though the tool looks completely different?

_______________________________________________

_______________________________________________
