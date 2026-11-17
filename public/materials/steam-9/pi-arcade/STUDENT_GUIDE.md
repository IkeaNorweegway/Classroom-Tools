# Build a Game for the Class Arcade

You are going to make a game in Python. When it is finished, it will go on the class Raspberry Pi so everyone can play it.

You will work in four parts:

1. Get your computer ready
2. Run the starter game
3. Turn the starter into Rock Paper Scissors
4. Make your own game

After each step there is a **Check**. Run your game and make sure the check works before you go on. If it doesn't, look at the **Fixing problems** table at the end.

---

## Part 1: Get your computer ready

### What is a library?

Python can't make game windows on its own. A **library** is extra code that someone else wrote, which you can borrow. You borrow a library with the word `import`.

We use two libraries:

| Library | What it does | Do you need to install it? |
|---|---|---|
| `pgzrun` (Pygame Zero) | Makes the window, draws things, reads the keyboard | Yes, once |
| `random` | Lets the computer make random choices | No, it comes with Python |

### Install Pygame Zero

You only do this once on each computer.

1. Open a terminal (on Windows, open **PowerShell**).
2. Type this and press Enter:

   ```
   pip install pgzero
   ```

3. Wait until it says `Successfully installed`.

On the Raspberry Pi the command is different:

```
sudo apt install python3-pgzero
```

### Import the libraries

`import` lines always go at the very top of your game file:

```python
import pgzrun
import random
```

The starter game already has these lines, so you don't need to type them.

**Check:** type `python -c "import pgzrun"` in the terminal. If nothing happens, it worked. If you see `ModuleNotFoundError`, the install didn't work. Ask your teacher.

---

## Part 2: Run the starter game

1. Copy the `template` folder.
2. Rename your copy to the name of your game, with no spaces. For example: `rock_paper_scissors`.
3. Open `game.py` from your new folder.
4. Run it. In the terminal, go to your folder and type:

   ```
   python game.py
   ```

**Check:** a blue window opens. Press SPACE and the score goes up. Press ESC and the window closes.

### The six parts of every game

Look at `game.py`. It has six numbered parts. Every game you make will have the same six parts.

| Part | What it is for |
|---|---|
| 1. Import libraries | Borrow the code you need |
| 2. Window settings | How big the window is and what it is called |
| 3. Game variables | Everything the game needs to remember |
| 4. Draw | Paints the screen |
| 5. Keys | What happens when a key is pressed |
| 6. Start the game | `pgzrun.go()` is always the last line |

---

## Part 3: Make Rock Paper Scissors

### Step 1: Name your game

At the top of the file, change the game name and put your own name in.

Then in part 2, change the title:

```python
TITLE = "Rock Paper Scissors"
```

**Check:** the new title shows at the top of the window.

### Step 2: Add the variables

In part 3, delete the two lines `message = ...` and `score = ...`. Type these in their place:

```python
choices = ["rock", "paper", "scissors"]
player_choice = "?"
computer_choice = "?"
message = "Pick one!"
player_score = 0
computer_score = 0
```

Don't run it yet. It will break until you finish step 3.

### Step 3: Draw the screen

In part 4, delete the line that draws `"Score: "`. Then add these lines inside `draw()`, under the line that draws the title. Make sure they line up with the other lines.

```python
    screen.draw.text("LEFT = rock     UP = paper     RIGHT = scissors",
                     center=(WIDTH / 2, 160), fontsize=30, color="white")
    screen.draw.text("You: " + player_choice, center=(200, 280), fontsize=45, color="white")
    screen.draw.text("Computer: " + computer_choice, center=(600, 280), fontsize=45, color="white")
    screen.draw.text("You " + str(player_score) + " - " + str(computer_score) + " Computer",
                     center=(WIDTH / 2, 480), fontsize=40, color="white")
```

Now find the line that draws `message` and change its `center` so it doesn't sit on top of the other words:

```python
    screen.draw.text(message, center=(WIDTH / 2, 390), fontsize=60, color="orange")
```

In part 5, delete the `global` line. Then delete the `if key == keys.SPACE:` line and the two lines under it. Keep the ESCAPE lines.

**Check:** you see `You: ?` and `Computer: ?` and the score `You 0 - 0 Computer`.

### Step 4: Make the keys choose

Add a new function between part 4 and part 5:

```python
def play(choice):
    global player_choice
    player_choice = choice
```

Then in part 5, add these lines under the ESCAPE lines:

```python
    if key == keys.LEFT:
        play("rock")
    if key == keys.UP:
        play("paper")
    if key == keys.RIGHT:
        play("scissors")
```

**Check:** press LEFT and the screen says `You: rock`. Try UP and RIGHT too.

### Step 5: Make the computer choose

This is where the `random` library is used. Change your `play` function to:

```python
def play(choice):
    global player_choice, computer_choice
    player_choice = choice
    computer_choice = random.choice(choices)
```

**Check:** each time you press a key, the computer shows a choice. Press the same key lots of times. The computer's choice should change.

### Step 6: Work out who wins

Change the `global` line in `play` to:

```python
    global player_choice, computer_choice, message, player_score, computer_score
```

Then add this at the end of `play`:

```python
    if player_choice == computer_choice:
        message = "Draw!"
    elif player_choice == "rock" and computer_choice == "scissors":
        message = "You win!"
        player_score = player_score + 1
    elif player_choice == "paper" and computer_choice == "rock":
        message = "You win!"
        player_score = player_score + 1
    elif player_choice == "scissors" and computer_choice == "paper":
        message = "You win!"
        player_score = player_score + 1
    else:
        message = "Computer wins!"
        computer_score = computer_score + 1
```

**Check:** play ten rounds. The message is right every time and the scores go up.

### Step 7: Make it yours

Pick at least one:

- Change the colours. Try `"purple"`, `"darkgreen"`, `"black"`, `"pink"`.
- Change the win and lose messages.
- Make the game end when someone gets to 5 points.
- Add a key that sets both scores back to 0.

If you get stuck, the finished game is in `examples/rock_paper_scissors`.

---

## Part 4: Make your own game

Start again with a fresh copy of the `template` folder. Plan your game on paper first by answering these questions:

1. **What does the game need to remember?** These are your variables (part 3).
2. **What does the player see?** This is your `draw()` function (part 4).
3. **What does each key do?** This is your `on_key_down()` function (part 5).
4. **How does someone win?** This is usually a new function, like `play()`.

Build it one small step at a time, and run it after every step.

### Game ideas

| Game | Hard part | Help |
|---|---|---|
| Guess the number | Comparing the guess to a random number | `random.randint(1, 10)` |
| Higher or lower | Remembering the last number | Use two variables |
| Noughts and crosses | Checking 3 in a row | Look at the Connect 4 example |
| Connect 4 | Checking 4 in a row | Finished game in `examples/connect4` |

### Useful code

```python
# Draw shapes
screen.draw.filled_circle((400, 300), 30, "red")
screen.draw.filled_rect(Rect(100, 100, 200, 50), "green")

# Random numbers
number = random.randint(1, 10)

# Keys you can use
keys.LEFT   keys.RIGHT   keys.UP   keys.DOWN   keys.SPACE
keys.W      keys.A       keys.S    keys.D      keys.LSHIFT
```

---

## Arcade rules

Your game must follow these rules or it won't work on the class Pi.

1. **Keyboard only.** No mouse.
2. **Use the arcade keys:**

   | Action | Player 1 | Player 2 |
   |---|---|---|
   | Move or choose | Arrow keys | W A S D |
   | Select | SPACE | LEFT SHIFT |
   | Quit | ESC | ESC |

3. **ESC must always quit.** Keep these two lines in `on_key_down`:

   ```python
       if key == keys.ESCAPE:
           exit()
   ```

4. **The file must be called `game.py`.**
5. **The folder name has no spaces and no capital letters.**
6. **Keep the window 800 by 600.**
7. **Show the controls on the screen** so new players know what to press.

---

## Fixing problems

| What you see | What it means | How to fix it |
|---|---|---|
| `ModuleNotFoundError: No module named 'pgzrun'` | Pygame Zero isn't installed | Do the install step in Part 1 |
| `IndentationError` | A line has the wrong number of spaces at the start | Line it up with the lines above it. Use 4 spaces. |
| `NameError: name 'scor' is not defined` | A spelling mistake, or the variable is missing from part 3 | Check the spelling matches exactly |
| `UnboundLocalError` | You changed a variable inside a function without `global` | Add the variable to the `global` line at the top of the function |
| `SyntaxError` | Something is missing, often a `:` or a `"` or a `)` | Look at the line it names, and the line above it |
| The window opens then closes | There is an error. Read the terminal. | Find the line number in the red text |
| Nothing happens when I press a key | The `if key ==` lines are not inside `on_key_down` | Check they are indented under `def on_key_down(key):` |
