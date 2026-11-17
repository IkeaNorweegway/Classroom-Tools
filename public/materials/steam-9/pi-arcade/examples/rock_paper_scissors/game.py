# ============================================
#  GAME NAME:  Rock Paper Scissors
#  MADE BY:    Example
# ============================================

# --- 1. IMPORT LIBRARIES ---
import pgzrun   # Pygame Zero: makes the window and reads the keyboard
import random   # lets the computer make random choices

# --- 2. WINDOW SETTINGS ---
WIDTH = 800
HEIGHT = 600
TITLE = "Rock Paper Scissors"

# --- 3. GAME VARIABLES ---
choices = ["rock", "paper", "scissors"]
player_choice = "?"
computer_choice = "?"
message = "Pick one!"
player_score = 0
computer_score = 0


# --- 4. DRAW ---
def draw():
    screen.fill("navy")
    screen.draw.text(TITLE, center=(WIDTH / 2, 80), fontsize=70, color="yellow")
    screen.draw.text("LEFT = rock     UP = paper     RIGHT = scissors",
                     center=(WIDTH / 2, 160), fontsize=30, color="white")
    screen.draw.text("You: " + player_choice, center=(200, 280), fontsize=45, color="white")
    screen.draw.text("Computer: " + computer_choice, center=(600, 280), fontsize=45, color="white")
    screen.draw.text(message, center=(WIDTH / 2, 390), fontsize=60, color="orange")
    screen.draw.text("You " + str(player_score) + " - " + str(computer_score) + " Computer",
                     center=(WIDTH / 2, 480), fontsize=40, color="white")
    screen.draw.text("ESC = quit", center=(WIDTH / 2, 560), fontsize=25, color="gray")


# Plays one round. choice is "rock", "paper" or "scissors".
def play(choice):
    global player_choice, computer_choice, message, player_score, computer_score

    player_choice = choice
    computer_choice = random.choice(choices)

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


# --- 5. KEYS ---
def on_key_down(key):
    if key == keys.ESCAPE:
        exit()

    if key == keys.LEFT:
        play("rock")
    if key == keys.UP:
        play("paper")
    if key == keys.RIGHT:
        play("scissors")


# --- 6. START THE GAME ---
pgzrun.go()
