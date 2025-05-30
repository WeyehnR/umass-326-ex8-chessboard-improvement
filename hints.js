// Hint logic module
import { getPieceAt } from './pieces.js';

export function addHint(cell, type) {
  const hint = document.createElement('div');
  hint.className = type;
  cell.appendChild(hint);
}

export function clearHints() {
  const hints = document.querySelectorAll('.hint, .capture-hint');
  hints.forEach(hint => hint.remove());
}

function addMoveOrCaptureHint(i, j, cells, color) {
  if (i < 0 || i >= 8 || j < 0 || j >= 8) return;
  const target = getPieceAt(i, j, cells);
  if (!target) {
    addHint(cells[i][j], 'hint');
  } else if (target.color !== color) {
    addHint(cells[i][j], 'capture-hint');
  }
}

export function showHintsForPiece(i, j, cells, color, type, skipClear) {
  if (!skipClear) clearHints();
  const BOARD_SIZE = 8;
  const moves = {
    pawn: () => {
      const dir = color === 'white' ? -1 : 1;
      // Forward moves
      if (i + dir >= 0 && i + dir < BOARD_SIZE && !cells[i + dir][j].querySelector('img')) {
        addHint(cells[i + dir][j], 'hint');
        if ((color === 'white' && i === 6) || (color === 'black' && i === 1)) {
          if (!cells[i + 2 * dir][j].querySelector('img')) {
            addHint(cells[i + 2 * dir][j], 'hint');
          }
        }
      }
      // Captures
      [-1, 1].forEach(dj => {
        const ni = i + dir, nj = j + dj;
        if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
          const target = getPieceAt(ni, nj, cells);
          if (target && target.color !== color) {
            addHint(cells[ni][nj], 'capture-hint');
          }
        }
      });
    },
    rook: () => {
      [[1,0], [-1,0], [0,1], [0,-1]].forEach(([di, dj]) => {
        for (let k = 1; k < BOARD_SIZE; k++) {
          const ni = i + di * k, nj = j + dj * k;
          if (ni < 0 || ni >= BOARD_SIZE || nj < 0 || nj >= BOARD_SIZE) break;
          const target = getPieceAt(ni, nj, cells);
          if (!target) {
            addHint(cells[ni][nj], 'hint');
          } else {
            if (target.color !== color) addHint(cells[ni][nj], 'capture-hint');
            break;
          }
        }
      });
    },
    bishop: () => {
      [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([di, dj]) => {
        for (let k = 1; k < BOARD_SIZE; k++) {
          const ni = i + di * k, nj = j + dj * k;
          if (ni < 0 || ni >= BOARD_SIZE || nj < 0 || nj >= BOARD_SIZE) break;
          const target = getPieceAt(ni, nj, cells);
          if (!target) {
            addHint(cells[ni][nj], 'hint');
          } else {
            if (target.color !== color) addHint(cells[ni][nj], 'capture-hint');
            break;
          }
        }
      });
    },
    knight: () => {
      [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]].forEach(([di, dj]) => {
        addMoveOrCaptureHint(i + di, j + dj, cells, color);
      });
    },
    queen: () => {
      moves.rook();
      moves.bishop();
    },
    king: () => {
      for (const di of [-1, 0, 1]) {
        for (const dj of [-1, 0, 1]) {
          if (di === 0 && dj === 0) continue;
          addMoveOrCaptureHint(i + di, j + dj, cells, color);
        }
      }
    }
  };
  moves[type]?.();
} 