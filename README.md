# Interactive Chessboard

> **Note:** This project was originally a class exercise from UMass Amherst CS 326 Web Programming. It has since been refactored and extended into an almost fully working interactive chess game.

This project is a modern, interactive chessboard web app built with vanilla JavaScript, HTML, and CSS. It features smooth piece movement, move/capture hints, and a clean, Figma-inspired design.

---

## How to Play Chess (Beginner's Guide)

- **Goal:** The aim of chess is to checkmate your opponent's king (trap it so it cannot escape).
- **Board:** 8x8 grid, each player starts with 16 pieces: 8 pawns, 2 rooks, 2 knights, 2 bishops, 1 queen, 1 king.
- **Turns:** Players take turns moving one piece at a time. (not implemented yet)
- **Piece Movement:**
  - **Pawn:** Moves forward 1 square (or 2 from its starting position). Captures diagonally.
  - **Rook:** Moves any number of squares in a straight line (horizontal or vertical).
  - **Knight:** Moves in an "L" shape (2 squares in one direction, then 1 square perpendicular). Can jump over pieces.
  - **Bishop:** Moves any number of squares diagonally.
  - **Queen:** Moves any number of squares in any direction (horizontal, vertical, diagonal).
  - **King:** Moves 1 square in any direction.
- **Capturing:** Move your piece to a square occupied by an opponent's piece to capture it.
- **Check:** If your king can be captured next turn, you are in check. You must move out of check.
- **Checkmate:** If you cannot move out of check, you lose.

---

## Features

- **8x8 Chessboard** with custom colors and SVG chess pieces
- **Piece Movement:** Click a piece to see all available moves
- **Move Hints:**
  - Regular moves are shown as purple dots
  - Captures are shown as large purple outlines
- **Smooth Animation:** Pieces animate smoothly to their new positions
- **Capture Logic:** Captured pieces are removed and replaced by the moving piece
- **Event Delegation:** Efficient event handling for move/capture hints
- **Responsive UI:** Pieces and hints are always centered and visually clear

---

## Project Structure & File Documentation

### `chessboard.html`

- The main HTML file. Sets up the board container and loads the CSS and JavaScript.

### `chessboard.css`

- Styles for the chessboard, pieces, and move/capture hints.
- Uses CSS Grid for layout and Flexbox for centering.
- Custom colors for board squares and hints.

### `chessboard.js`

- Main logic for building the board, handling user interaction, and animating moves.
- **Key functions:**
  - `build()`: Creates the board, places pieces, and sets up click handlers.
  - `handleHintClick(e, cells)`: Handles moving a piece when a move/capture hint is clicked.

### `pieceMoves.js`

- Contains the movement logic for each chess piece.
- **Move patterns** are defined for each piece (except pawns, which have special logic).
- **Key functions:**
  - `handlePawnMoves(i, j, cells, color)`: Handles pawn movement and capturing.
  - `handlePieceMoves(i, j, cells, color, pattern)`: Handles movement for sliding/jumping pieces.
  - `pieceMoves`: An object mapping piece types to their movement logic.

### `hints.js`

- Handles the creation and removal of move/capture hints on the board.
- **Key functions:**
  - `addHint(cell, type)`: Adds a move or capture hint to a cell.
  - `clearHints()`: Removes all hints from the board.
  - `addMoveOrCaptureHint(i, j, cells, color)`: Shows a hint if a move/capture is possible.
  - `addSlidingHints(i, j, cells, color, directions)`: Shows all possible moves for sliding pieces (rook, bishop, queen).
  - `showHintsForPiece(i, j, cells, color, type, skipClear)`: Shows all possible moves for a selected piece.

### `pieces.js`

- Handles placing and identifying pieces on the board.
- **Key functions:**
  - `placePiece(cell, color, piece)`: Places a piece image in a cell.
  - `getPieceAt(i, j, cells)`: Returns the piece (type and color) at a given position.

### `/public/chess_pieces/`

- Contains SVG images for all chess pieces, separated into `white_pieces_svg` and `black_pieces_svg` folders.

---

## Setup

1. **Clone or Download** this repository.
2. Ensure the following structure:

   ```text
   /public/chess_pieces/white_pieces_svg/  # White SVGs
   /public/chess_pieces/black_pieces_svg/  # Black SVGs
   chessboard.html
   chessboard.js
   chessboard.css
   ```

3. Open `chessboard.html` in your browser.

---

## Usage

- Click any piece to see its available moves.
- Click a purple dot to move the piece.
- Click a purple outline to capture an opponent's piece.
- All moves and captures are animated.

---

## Implementation Highlights

- **SVG Assets:** Chess pieces are SVGs exported from Figma and placed in the `public/chess_pieces` directory.
- **CSS Grid:** The board uses CSS Grid for layout, and flexbox for centering.
- **Hints:** Move and capture hints are dynamically created and removed as needed.
- **Event Delegation:** Only one event listener is used for all hint clicks, improving performance.
- **No External Libraries:** All logic is implemented in vanilla JS and CSS.

---

## Possible Extensions

- Add turn logic (alternate between white and black)
- Implement advanced chess rules (castling, en passant, promotion)
- Add move history and undo
- Detect check/checkmate
- Add sound or visual effects for moves/captures

---

## Credits

- Chess piece SVGs: Exported from Figma community assets
- Inspired by modern chess UIs and Figma design principles
