import { addHint, addMoveOrCaptureHint, addSlidingHints } from './hints.js';
import { getPieceAt } from './pieces.js';

// Define move patterns for each piece type
const MOVE_PATTERNS = {
  rook: {
    type: 'sliding',
    directions: [[1,0], [-1,0], [0,1], [0,-1]]
  },
  bishop: {
    type: 'sliding',
    directions: [[1,1], [1,-1], [-1,1], [-1,-1]]
  },
  queen: {
    type: 'sliding',
    directions: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]
  },
  knight: {
    type: 'jumping',
    moves: [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]]
  },
  king: {
    type: 'jumping',
    moves: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]]
  }
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