import { addHint, addMoveOrCaptureHint, addSlidingHints } from './hints.js';
import { getPieceAt } from './pieces.js';

// Define move directions for clarity
const ROOK_DIRECTIONS = [
  [1, 0],   // down
  [-1, 0],  // up
  [0, 1],   // right
  [0, -1],  // left
];

const BISHOP_DIRECTIONS = [
  [1, 1],    // down-right
  [1, -1],   // down-left
  [-1, 1],   // up-right
  [-1, -1],  // up-left
];

const QUEEN_DIRECTIONS = [
  ...ROOK_DIRECTIONS,
  ...BISHOP_DIRECTIONS,
];

const KNIGHT_MOVES = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2],  [1, 2],
  [2, -1],  [2, 1],
];

const KING_MOVES = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

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
  const dir = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Forward moves
  if (i + dir >= 0 && i + dir < 8 && !cells[i + dir][j].querySelector('img')) {
    addHint(cells[i + dir][j], 'hint');
    // Double move from starting position
    if (i === startRow && !cells[i + 2 * dir][j].querySelector('img')) {
      addHint(cells[i + 2 * dir][j], 'hint');
    }
  }
  
  // Diagonal captures
  [-1, 1].forEach(dj => {
    const ni = i + dir, nj = j + dj;
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