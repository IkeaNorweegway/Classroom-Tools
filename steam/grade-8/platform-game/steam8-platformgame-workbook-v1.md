# Platform Game (Scratch) — Design Journal
STEAM · Grade 8 · Unit 2

**Name:** _________________________ **Date:** _____________
**About this journal:** This is your project log — plan, build, test, and record what your playtester actually tells you, including the parts you didn't expect.

**How to use it:** Work through the sections in order, and write in your own words.

---

## Step 1: Define the Brief

**The brief:** Build a platform game level with player-controlled movement and jumping, at least one collision-based mechanic, and a scoring or lives system. Two requirements apply: your game must have a defined **win condition** and a defined **lose condition**, and every collision type you use must work correctly and consistently — not just most of the time.

What is your win condition? What is your lose condition?

_______________________________________________

What's the core mechanic or feeling you want this level to have (fast and precise, exploratory, puzzle-like, something else)?

_______________________________________________

---

## Step 2: Gravity Prototype

*Build a sprite that falls and stops on a "ground" sprite before adding anything else.*

*Example row shown below — yours starts on the next blank row.*

| What I tried | What happened | What I'll change |
|---|---|---|
| Set gravity to -2 and used "change y by (gravity)" every frame, with no ground check yet | Sprite fell smoothly but dropped straight through the ground sprite and off the bottom of the stage | Add an if-touching-ground check that sets gravity back to 0 so the sprite actually stops |
| | | |
| | | |

---

## Step 3: Player Movement & Jump

*Add player-controlled movement and jumping, combining input, your gravity variable, and a ground collision check.*

*Example row shown below — yours starts on the next blank row.*

| What I tried | What happened | What I'll change |
|---|---|---|
| Added arrow-key movement and a jump that sets gravity to 10 on spacebar press | Jump worked fine on flat ground but the sprite clipped through the corner of a platform when jumping toward it at an angle | Check collision against the platform sprite every frame instead of only right after landing |
| | | |
| | | |
| | | |

**Forethought check:** Before your first full test, what part of the jump/collision logic are you least sure about?

_______________________________________________

---

## Step 4: Sketch Three Level Layouts

*Draw three genuinely different level layouts before choosing one — different platform/obstacle arrangements and difficulty progressions, not the same layout with one platform moved. Mark where difficulty increases in each.*

**Layout 1:**

```








```

**Layout 2:**

```








```

**Layout 3:**

```








```

Which layout are you building, and why did you pick it over the other two?

_______________________________________________

### Sign-Off: Show Your Level Sketch Before You Build

Before you start building this level, show your chosen layout — or your sketch in your engineering booklet — to your teacher.

Sketched: ☐ Here in this journal &nbsp;&nbsp;&nbsp; ☐ In my engineering booklet (page _____)

**Teacher sign-off:** ☐ Approved to build &nbsp;&nbsp;&nbsp; ☐ Revise and show again

Initials: _______________ &nbsp;&nbsp;&nbsp; Date: _____________

---

## Step 5: Build Your Level

*Add obstacles, collectibles, and your scoring or lives system.*

*Example row shown below — yours starts on the next blank row.*

| What I tried | What happened | What I'll change |
|---|---|---|
| Added a coin sprite that adds 1 to score on touch and a spike sprite that subtracts 1 life on touch | Coin collection worked, but touching one spike removed 3 lives instead of 1 because the collision check kept firing every frame the sprites overlapped | Add a short invincibility delay after a hit so the same collision can't fire again for half a second |
| | | |
| | | |
| | | |

**Mid-project check-in:** Pause. Does your win condition actually trigger when it should, and your lose condition trigger when it should? If not, what specifically is going wrong?

_______________________________________________

---

## Step 6: Peer Playtest

*A partner plays your level start to finish while you watch and take notes — don't help them unless they're truly stuck.*

Playtester's name: _______________

Where did they get stuck?

_______________________________________________

Did any collision feel wrong to them? Which one, and how?

_______________________________________________

Did the difficulty feel fair to them? Why or why not?

_______________________________________________

---

## Step 7: Fix From Feedback

*Pick the single most important thing your playtester reported, and fix it — not add new content.*

What specific change did you make, and why that one first?

_______________________________________________

Did the fix work when your playtester (or a new one) tried it again?

_______________________________________________

---

## Step 8: Final Test

Does the win condition trigger correctly? Y / N &nbsp;&nbsp;&nbsp; Does the lose condition trigger correctly? Y / N

Does every collision type in your game behave consistently across repeated tries? Y / N — if not, what's still inconsistent?

_______________________________________________

---

## Reflection

Where did you get stuck this unit, and what did you do about it?

_______________________________________________

Was there a moment you were tempted to add more content instead of fixing something broken? What did you do?

_______________________________________________

Did your final level work because you understood how the gravity variable and collision checks connect, or because you kept changing numbers until something worked? How do you know?

_______________________________________________

---

## Self-Assessment

| I can... | Got it | Getting there | Not yet |
|---|---|---|---|
| Implement a simulated-gravity behavior using a continuously updated variable | ☐ | ☐ | ☐ |
| Implement and debug collision detection between sprites | ☐ | ☐ | ☐ |
| Design a level with an intentional difficulty progression, planned on paper before building | ☐ | ☐ | ☐ |
| Conduct a structured playtest and make a specific, justified change based on the feedback | ☐ | ☐ | ☐ |

One question I still have:

_______________________________________________
