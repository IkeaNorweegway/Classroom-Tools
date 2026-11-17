# ============================================
#  GAME NAME:  Connect 4
#  MADE BY:    Example
# ============================================

# --- 1. IMPORT LIBRARIES ---
import pgzrun   # Pygame Zero: makes the window and reads the keyboard

# --- 2. WINDOW SETTINGS ---
WIDTH = 800
HEIGHT = 600
TITLE = "Connect 4"

# --- 3. GAME VARIABLES ---
COLS = 7
ROWS = 6
CELL = 80            # size of one square on the board
BOARD_LEFT = 120     # where the board starts on the screen
BOARD_TOP = 110
COLOURS = {0: "navy", 1: "red", 2: "yellow"}

# The board is a list of rows. 0 = empty, 1 = red, 2 = yellow.
grid = []
for row in range(ROWS):
    grid.append([0] * COLS)

column = 3           # the column the player is pointing at
player = 1           # whose turn it is
game_over = False
message = "Red's turn"


# --- 4. DRAW ---
def draw():
    screen.fill("navy")
    screen.draw.text(message, center=(WIDTH / 2, 30), fontsize=45, color="white")

    # The piece waiting above the board
    if not game_over:
        x = BOARD_LEFT + column * CELL + CELL / 2
        screen.draw.filled_circle((x, 80), 30, COLOURS[player])

    # The board
    screen.draw.filled_rect(Rect(BOARD_LEFT, BOARD_TOP, COLS * CELL, ROWS * CELL), "blue")
    for row in range(ROWS):
        for col in range(COLS):
            x = BOARD_LEFT + col * CELL + CELL / 2
            y = BOARD_TOP + row * CELL + CELL / 2
            screen.draw.filled_circle((x, y), 30, COLOURS[grid[row][col]])


# Drops a piece into a column. Returns True if there was room.
def drop_piece(col):
    for row in range(ROWS - 1, -1, -1):   # start at the bottom row
        if grid[row][col] == 0:
            grid[row][col] = player
            return True
    return False


# Checks for 4 pieces in a line, starting at one square and going one way.
def line_of_four(row, col, row_step, col_step):
    for i in range(4):
        r = row + i * row_step
        c = col + i * col_step
        if r < 0 or r >= ROWS or c < 0 or c >= COLS:
            return False
        if grid[r][c] != player:
            return False
    return True


# Checks the whole board to see if the current player has won.
def has_won():
    for row in range(ROWS):
        for col in range(COLS):
            if line_of_four(row, col, 0, 1):    # across
                return True
            if line_of_four(row, col, 1, 0):    # down
                return True
            if line_of_four(row, col, 1, 1):    # diagonal down-right
                return True
            if line_of_four(row, col, 1, -1):   # diagonal down-left
                return True
    return False


def board_full():
    for col in range(COLS):
        if grid[0][col] == 0:
            return False
    return True


def new_game():
    global column, player, game_over, message
    for row in range(ROWS):
        for col in range(COLS):
            grid[row][col] = 0
    column = 3
    player = 1
    game_over = False
    message = "Red's turn"


# --- 5. KEYS ---
def on_key_down(key):
    global column, player, game_over, message

    if key == keys.ESCAPE:
        exit()

    if game_over:
        if key == keys.SPACE:
            new_game()
        return

    if key == keys.LEFT and column > 0:
        column = column - 1
    if key == keys.RIGHT and column < COLS - 1:
        column = column + 1

    if key == keys.SPACE:
        if drop_piece(column):
            if has_won():
                game_over = True
                if player == 1:
                    message = "Red wins! SPACE = play again"
                else:
                    message = "Yellow wins! SPACE = play again"
            elif board_full():
                game_over = True
                message = "Draw! SPACE = play again"
            elif player == 1:
                player = 2
                message = "Yellow's turn"
            else:
                player = 1
                message = "Red's turn"


# --- 6. START THE GAME ---
pgzrun.go()
