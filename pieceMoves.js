import { addHint, addMoveOrCaptureHint, addSlidingHints } from './hints.js';
import { getPieceAt } from './pieces.js';

// --- Single-step directions for sliding pieces ---
const UP = [-1, 0];
const DOWN = [1, 0];
const LEFT = [0, -1];
const RIGHT = [0, 1];

const UP_LEFT = [-1, -1];
const UP_RIGHT = [-1, 1];
const DOWN_LEFT = [1, -1];
const DOWN_RIGHT = [1, 1];

// --- Knight moves (L-shaped jumps) ---
const KNIGHT_UP_LEFT = [-2, -1];
const KNIGHT_UP_RIGHT = [-2, 1];
const KNIGHT_LEFT_UP = [-1, -2];
const KNIGHT_RIGHT_UP = [-1, 2];
const KNIGHT_LEFT_DOWN = [1, -2];
const KNIGHT_RIGHT_DOWN = [1, 2];
const KNIGHT_DOWN_LEFT = [2, -1];
const KNIGHT_DOWN_RIGHT = [2, 1];

// --- Move direction arrays for each piece ---
const ROOK_DIRECTIONS = [DOWN, UP, RIGHT, LEFT];
const BISHOP_DIRECTIONS = [DOWN_RIGHT, DOWN_LEFT, UP_RIGHT, UP_LEFT];
const QUEEN_DIRECTIONS = [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS];

const KNIGHT_MOVES = [
  KNIGHT_UP_LEFT, KNIGHT_UP_RIGHT,
  KNIGHT_LEFT_UP, KNIGHT_RIGHT_UP,
  KNIGHT_LEFT_DOWN, KNIGHT_RIGHT_DOWN,
  KNIGHT_DOWN_LEFT, KNIGHT_DOWN_RIGHT,
];

const KING_MOVES = [
  UP_LEFT, UP, UP_RIGHT,
  LEFT,        RIGHT,
  DOWN_LEFT, DOWN, DOWN_RIGHT,
];

// --- Pawn move/capture directions ---
const PAWN_FORWARD_WHITE = UP;
const PAWN_FORWARD_BLACK = DOWN;
const PAWN_DOUBLE_FORWARD_WHITE = [-2, 0];
const PAWN_DOUBLE_FORWARD_BLACK = [2, 0];
const PAWN_CAPTURE_LEFT_WHITE = UP_LEFT;
const PAWN_CAPTURE_RIGHT_WHITE = UP_RIGHT;
const PAWN_CAPTURE_LEFT_BLACK = DOWN_LEFT;
const PAWN_CAPTURE_RIGHT_BLACK = DOWN_RIGHT;

// Define move patterns for each piece type
const MOVE_PATTERNS = {
  rook: {
    type: 'sliding',
    directions: ROOK_DIRECTIONS,
  },
  bishop: {
    type: 'sliding',
    directions: BISHOP_DIRECTIONS,
  },
  queen: {
    type: 'sliding',
    directions: QUEEN_DIRECTIONS,
  },
  knight: {
    type: 'jumping',
    moves: KNIGHT_MOVES,
  },
  king: {
    type: 'jumping',
    moves: KING_MOVES,
  },
};

// Special pawn moves
function handlePawnMoves(i, j, cells, color) {
  const isWhite = color === 'white';
  const forward = isWhite ? PAWN_FORWARD_WHITE : PAWN_FORWARD_BLACK;
  const doubleForward = isWhite ? PAWN_DOUBLE_FORWARD_WHITE : PAWN_DOUBLE_FORWARD_BLACK;
  const startRow = isWhite ? 6 : 1;
  const captureLeft = isWhite ? PAWN_CAPTURE_LEFT_WHITE : PAWN_CAPTURE_LEFT_BLACK;
  const captureRight = isWhite ? PAWN_CAPTURE_RIGHT_WHITE : PAWN_CAPTURE_RIGHT_BLACK;

  // Forward move
  const [fi, fj] = [i + forward[0], j + forward[1]];
  if (fi >= 0 && fi < 8 && fj >= 0 && fj < 8 && !cells[fi][fj].querySelector('img')) {
    addHint(cells[fi][fj], 'hint');
    // Double move from starting position
    const [dfi, dfj] = [i + doubleForward[0], j + doubleForward[1]];
    if (i === startRow && !cells[dfi][dfj].querySelector('img')) {
      addHint(cells[dfi][dfj], 'hint');
    }
  }

  // Diagonal captures
  [captureLeft, captureRight].forEach(([di, dj]) => {
    const ni = i + di, nj = j + dj;
    if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
      const target = getPieceAt(ni, nj, cells);
      if (target && target.color !== color) {
        addHint(cells[ni][nj], 'capture-hint');
      }
    }
  });
}

// Generic piece move handler
function handlePieceMoves(i, j, cells, color, pattern) {
  if (pattern.type === 'sliding') {
    addSlidingHints(i, j, cells, color, pattern.directions);
  } else if (pattern.type === 'jumping') {
    pattern.moves.forEach(([di, dj]) => {
      addMoveOrCaptureHint(i + di, j + dj, cells, color);
    });
  }
}

export const pieceMoves = {
  pawn: handlePawnMoves,
  rook: (i, j, cells, color) => handlePieceMoves(i, j, cells, color, MOVE_PATTERNS.rook),
  bishop: (i, j, cells, color) => handlePieceMoves(i, j, cells, color, MOVE_PATTERNS.bishop),
  knight: (i, j, cells, color) => handlePieceMoves(i, j, cells, color, MOVE_PATTERNS.knight),
  queen: (i, j, cells, color) => handlePieceMoves(i, j, cells, color, MOVE_PATTERNS.queen),
  king: (i, j, cells, color) => handlePieceMoves(i, j, cells, color, MOVE_PATTERNS.king)
}; 