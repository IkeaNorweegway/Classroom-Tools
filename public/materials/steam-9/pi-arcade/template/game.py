# ============================================
#  GAME NAME:  My Game
#  MADE BY:    (your name)
# ============================================

# --- 1. IMPORT LIBRARIES ---
import pgzrun   # Pygame Zero: makes the window and reads the keyboard
import random   # lets the computer make random choices

# --- 2. WINDOW SETTINGS ---
WIDTH = 800
HEIGHT = 600
TITLE = "My Game"

# --- 3. GAME VARIABLES ---
# Everything your game needs to remember goes here.
message = "Press SPACE!"
score = 0


# --- 4. DRAW ---
# Pygame Zero runs this again and again to paint the screen.
def draw():
    screen.fill("navy")
    screen.draw.text(TITLE, center=(WIDTH / 2, 80), fontsize=70, color="yellow")
    screen.draw.text(message, center=(WIDTH / 2, 300), fontsize=50, color="white")
    screen.draw.text("Score: " + str(score), center=(WIDTH / 2, 400), fontsize=40, color="white")
    screen.draw.text("ESC = quit", center=(WIDTH / 2, 560), fontsize=25, color="gray")


# --- 5. KEYS ---
# Pygame Zero runs this every time a key is pressed.
def on_key_down(key):
    global message, score

    # Every game must have this, so players can get back to the menu.
    if key == keys.ESCAPE:
        exit()

    if key == keys.SPACE:
        score = score + 1
        message = "You pressed SPACE!"


# --- 6. START THE GAME ---
# This must always be the last line.
pgzrun.go()
