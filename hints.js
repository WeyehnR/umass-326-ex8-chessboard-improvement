// Hint logic module
import { getPieceAt } from './pieces.js';
import { pieceMoves } from './pieceMoves.js';

export function addHint(cell, type) {
  const hint = document.createElement('div');
  hint.className = type;
  cell.appendChild(hint);
}

export function clearHints() {
  const hints = document.querySelectorAll('.hint, .capture-hint');
  hints.forEach(hint => hint.remove());
}

export function addMoveOrCaptureHint(i, j, cells, color) {
  if (i < 0 || i >= 8 || j < 0 || j >= 8) return;
  const target = getPieceAt(i, j, cells);
  if (!target) {
    addHint(cells[i][j], 'hint');
  } else if (target.color !== color) {
    addHint(cells[i][j], 'capture-hint');
  }
}

export function addSlidingHints(i, j, cells, color, directions) {
  for (const [di, dj] of directions) {
    for (let k = 1; k < 8; k++) {
      const ni = i + di * k, nj = j + dj * k;
      if (ni < 0 || ni >= 8 || nj < 0 || nj >= 8) break;
      const target = getPieceAt(ni, nj, cells);
      if (!target) {
        addHint(cells[ni][nj], 'hint');
      } else {
        if (target.color !== color) addHint(cells[ni][nj], 'capture-hint');
        break;
      }
    }
  }
}

export function showHintsForPiece(i, j, cells, color, type, skipClear) {
  if (!skipClear) clearHints();
  pieceMoves[type]?.(i, j, cells, color);
} 