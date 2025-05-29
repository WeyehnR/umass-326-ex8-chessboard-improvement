# Interactive Chessboard

> **Note:** This project was originally a class exercise from UMass Amherst CS 326 Web Programming. It has since been refactored and extended into an almost fully working interactive chess game.

This project is a modern, interactive chessboard web app built with vanilla JavaScript, HTML, and CSS. It features smooth piece movement, move/capture hints, and a clean, Figma-inspired design.

## Features

- **8x8 Chessboard** with custom colors and SVG chess pieces
- **Piece Movement**: Click a piece to see all available moves
- **Move Hints**:
  - Regular moves are shown as purple dots
  - Captures are shown as large purple outlines
- **Smooth Animation**: Pieces animate smoothly to their new positions
- **Capture Logic**: Captured pieces are removed and replaced by the moving piece
- **Event Delegation**: Efficient event handling for move/capture hints
- **Responsive UI**: Pieces and hints are always centered and visually clear

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

## Usage

- Click any piece to see its available moves.
- Click a purple dot to move the piece.
- Click a purple outline to capture an opponent's piece.
- All moves and captures are animated.

## Implementation Highlights

- **SVG Assets**: Chess pieces are SVGs exported from Figma and placed in the `public/chess_pieces` directory.
- **CSS Grid**: The board uses CSS Grid for layout, and flexbox for centering.
- **Hints**: Move and capture hints are dynamically created and removed as needed.
- **Event Delegation**: Only one event listener is used for all hint clicks, improving performance.
- **No External Libraries**: All logic is implemented in vanilla JS and CSS.

## Possible Extensions

- Add turn logic (alternate between white and black)
- Implement advanced chess rules (castling, en passant, promotion)
- Add move history and undo
- Detect check/checkmate
- Add sound or visual effects for moves/captures

## Credits

- Chess piece SVGs: Exported from Figma community assets
- Inspired by modern chess UIs and Figma design principles

---
Enjoy exploring and extending your interactive chessboard!
