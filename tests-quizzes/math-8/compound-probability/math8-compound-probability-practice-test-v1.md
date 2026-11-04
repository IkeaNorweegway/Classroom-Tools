---
title: Independent & Dependent Events
topic: compound-probability
strand: statistics-probability
test: practice
marks: 40
time: 60 minutes
calculator: Calculator allowed
---
<!-- Gate: outcome map complete. LOs covered: CP1, CP2, CP3, CP4 (outcome 8PR1). Every item maps to a specific LO.
     Extended response rubric included (Q20). Marks: CP1 10 · CP2 10 · CP3 10 · CP4 10 = 40.
     Posted for students. No item repeats the quiz, the exits, the notes examples or the unit test (math8-compound-probability-test-v1).
     Multiple-choice answers: C A B D D B A C (two of each letter).
     Made-up data: the class of 30 with 12 in glasses, the cookie box, the 80% free-throw shooter, the raffle, the carnival games. -->

## Part A — Choose the Answer
Circle the best answer. 1 mark each.

### [CP1 · 1] Spin a 4-part spinner and roll a die. How many outcomes are there?
- A) 10
- B) 4
- C) 24
- D) 6
=> **C.** Each of the 4 parts pairs with all 6 numbers: 4 × 6 = 24.
=> Common mistakes: A adds 4 + 6. B and D count only one event.

### [CP1 · 1] Which is the sample space for flipping two coins?
- A) S = {HH, HT, TH, TT}
- B) S = {HH, HT, TT}
- C) S = {H, T}
- D) S = {HH, TT}
=> **A.** HT and TH are different outcomes: heads first, or tails first.
=> Common mistakes: B counts HT and TH as one. C is one coin. D leaves out the mixed outcomes.

### [CP2 · 1] Roll a die two times. What is P(6, then 6)?
- A) {2/6}
- B) {1/36}
- C) {1/12}
- D) {1/6}
=> **B.** {1/6} × {1/6} = {1/36}.
=> Common mistakes: A adds the fractions. C uses {1/2} for one roll. D is one roll only.

### [CP2 · 1] Which pair of events is independent?
- A) Draw a card, keep it, then draw another.
- B) Pick two students for a team.
- C) Take two cookies from a jar and eat the first.
- D) Spin a spinner, then flip a coin.
=> **D.** The spinner cannot change the coin.
=> Common mistakes: A, B and C take something away, so the second event changes.

### [CP3 · 1] A bag has 5 red and 3 blue counters. You draw a red and keep it out. What is P(red) on the next draw?
- A) {5/8}
- B) {4/8}
- C) {5/7}
- D) {4/7}
=> **D.** 4 red are left, and 7 counters in all.
=> Common mistakes: A forgets the draw. B changes only the top. C changes only the bottom.

### [CP3 · 1] Why is drawing twice without replacement dependent?
- A) The counters change colour.
- B) The first draw changes what is left in the bag.
- C) You need two bags.
- D) The second draw is always less likely.
=> **B.** One counter is kept out, so the second draw has different chances.
=> Common mistakes: D: the second draw can be more likely. If you take a blue, P(red) goes up.

### [CP4 · 1] Roll two dice. What is P(both numbers are even)?
- A) {1/4}
- B) {1/2}
- C) 1
- D) {1/36}
=> **A.** The dice are independent: {3/6} × {3/6} = {9/36} = {1/4}.
=> Common mistakes: B uses one die only. C adds {1/2} + {1/2}. D is one cell of the table.

### [CP4 · 1] In a class of 30, 12 students wear glasses. The teacher picks 2 different students. Which finds P(both wear glasses)?
- A) {12/30} × {12/30}
- B) {12/30} + {11/29}
- C) {12/30} × {11/29}
- D) {12/30} × {11/30}
=> **C.** The same student can't be picked twice, so 11 of 29 are left.
=> Common mistakes: A treats it as independent. B adds. D changes only the top.

## Part B — Show Your Work
Show your steps.

### [CP1 · 3] Spin a number spinner (1, 2, 3, 4) and a colour spinner (red, yellow, green). a) Fill in the table. b) Write the sample space in set notation. c) Find P(an even number and green).
@viz outcomes rows="1,2,3,4" cols="R,Y,G" blank=1 rowlabel="number" collabel="colour"
(lines 2)
=> a) 12 cells: 1R, 1Y, 1G, 2R, … 4G (1 mark).
=> b) S = {1R, 1Y, 1G, 2R, 2Y, 2G, 3R, 3Y, 3G, 4R, 4Y, 4G} (1 mark).
=> c) 2G and 4G: {2/12} = {1/6} (1 mark).

### [CP1 · 3] Roll two dice and add. a) Find P(a sum of 10 or more). b) Leah says a sum of 7 and a sum of 12 are equally likely, because each is one number. Is she right? Explain.
@viz cpsum rowlabel="red die" collabel="blue die"
(lines 3)
=> a) (4,6), (5,5), (6,4), (5,6), (6,5), (6,6): 6 cells (1 mark). {6/36} = {1/6} (1 mark).
=> b) No. A sum of 7 has 6 cells, but 12 has only 1 cell, (6,6). A sum of 7 is 6 times as likely (1 mark).

### [CP2 · 3] Roll a die and spin this spinner. Find P(yellow and a number less than 3). Write it as a fraction, a decimal and a percent.
@viz spin sections="yellow:1;blue:3" size=100
(lines 2)
=> P(yellow) = {1/4}. P(less than 3) = {2/6} (1 mark).
=> {1/4} × {2/6} = {2/24} = {1/12} (1 mark).
=> ≈ 0.08 ≈ 8.3% (1 mark).

### [CP2 · 3] A basketball player makes 80% of her free throws. Each shot is independent. She takes 3 shots. a) Why can you multiply? b) Find P(she makes all 3). c) Find P(she misses all 3).
@viz cptree first="M,X" p1="0.8,0.2" second="M,X" p2="0.8,0.2" third="M,X" p3="0.8,0.2"
(lines 3)
=> a) The shots are independent: one shot does not change the chance on the next (1 mark).
=> b) 0.8 × 0.8 × 0.8 = 0.512 = 51.2% (1 mark).
=> c) P(miss) = 0.2. 0.2 × 0.2 × 0.2 = 0.008 = 0.8% (1 mark).

### [CP3 · 3] A box has 4 chocolate and 3 vanilla cookies. Ty takes two without looking and eats them. a) Fill in the second fractions. b) Find P(chocolate, chocolate). c) Find P(one of each).
@viz cptree first="C,V" p1="4/7,3/7" second="C,V|C,V" p2="[[3/6]],[[3/6]]|[[4/6]],[[2/6]]" outcomes=show
(lines 3)
=> a) After C: C {3/6}, V {3/6}. After V: C {4/6}, V {2/6} (1 mark).
=> b) {4/7} × {3/6} = {12/42} = {2/7} (1 mark).
=> c) CV: {4/7} × {3/6} = {12/42}. VC: {3/7} × {4/6} = {12/42}. Total {24/42} = {4/7} (1 mark).

### [CP3 · 3] A raffle has 20 tickets. You bought 3 of them. Two prizes are drawn, and a winning ticket is not put back. a) Find P(you win both prizes). b) Find P(you win the first prize but not the second).
(lines 3)
=> a) 1st: {3/20}. 2nd: {2/19}, because one of your tickets is out (1 mark).
=> {3/20} × {2/19} = {6/380} = {3/190} ≈ 1.6% (1 mark).
=> b) {3/20} × {17/19} = {51/380} ≈ 13.4% (1 mark).

### [CP4 · 3] In a class game, you roll two dice. You win a prize if **both** dice show a 5 or a 6. 36 students play. a) Are the two rolls independent or dependent? b) Find P(win). c) About how many of the 36 students should win?
@viz area a=2/6 b=2/6 alabel="2/6 red die" blabel="2/6 blue die" note1="columns: the blue die" note2="rows: the red die"
(lines 3)
=> a) Independent: one die does not change the other (1 mark).
=> b) {2/6} × {2/6} = {4/36} = {1/9} (1 mark).
=> c) {1/9} × 36 = 4 students (1 mark).

## Part C — Put It Together
A school carnival booth has two games. You win a game if you get gold **two times**.

| Game | How it works |
|---|---|
| 1 | Spin a spinner with 3 equal parts (gold, red, blue) two times. |
| 2 | A box holds 5 tickets: 2 gold and 3 white. Draw 2 tickets without putting the first back. |

### [CP1 · 2] (a) Write the sample space for Game 1 in set notation. How many outcomes are there?
@viz spin sections="gold;red;blue" size=100
(lines 2)
=> S = {GG, GR, GB, RG, RR, RB, BG, BR, BB} (1 mark).
=> 3 × 3 = 9 outcomes (1 mark).

### [CP2 · 2] (b) Find P(win Game 1).
(lines 1)
=> The spins are independent (1 mark).
=> {1/3} × {1/3} = {1/9} (1 mark).

### [CP3 · 2] (c) Find P(win Game 2).
(lines 1)
=> 1st: {2/5}. 2nd: {1/4}, because one gold is out (1 mark).
=> {2/5} × {1/4} = {2/20} = {1/10} (1 mark).

### [CP4 · 2] (d) Which game gives you the better chance? If Game 2 put the first ticket back, would your chance go up or down?
(lines 2)
=> Game 1: {1/9} ≈ 11.1% is more than {1/10} = 10% (1 mark).
=> Up: {2/5} × {2/5} = {4/25} = 16% (1 mark).

## Part D — Explain Your Thinking

### [CP4 · 3] Owen says, "Putting the counter back or not makes no difference. The bag starts the same either way." A bag has 3 red and 3 blue counters. Find P(red, red) both ways and use your answers to show Owen is wrong.
@viz bag counters="red:3;blue:3"
(lines 5)
=> Model answer: With replacement the draws are independent: {3/6} × {3/6} = {9/36} = {1/4} = 25%. Without replacement they are dependent: after one red is out, 2 of 5 are red, so {3/6} × {2/5} = {6/30} = {1/5} = 20%. The answers are different. The bag starts the same, but keeping a red out changes the second draw: one fewer red and one fewer counter.
::: teacher label: Marking guide
| Level | Marks | What it looks like |
|---|---|---|
| Full | 3 | Finds {1/4} with replacement and {1/5} without; names the draws independent and dependent; explains that keeping the red out changes the top and bottom of the second fraction |
| Partial | 2 | Finds both probabilities and says they differ, but gives no reason, or gives the reason with one slip |
| Partial | 1 | Says Owen is wrong with a reason but no probabilities, or finds one probability correctly |
| Not shown | 0 | Agrees with Owen |
:::
