const printMe = (i, j) => {
  console.log('You clicked on (' + (i + 1) + ', ' + (j + 1) + ')');
};

// Helper function to place a piece on a cell
function placePiece(cell, color, piece) {
  const img = document.createElement('img');
  img.src = `public/chess_pieces/${color}_pieces_svg/piece-${piece}-side-${color}.svg`;
  img.alt = `${color.charAt(0).toUpperCase() + color.slice(1)} ${piece.charAt(0).toUpperCase() + piece.slice(1)}`;
  img.style.width = '80px';
  img.style.height = '80px';
  cell.appendChild(img);
}

function addHintDot(cell) {
  // Remove any existing hint dot
  const oldHint = cell.querySelector('.hint');
  if (oldHint) oldHint.remove();
  // Create and add new hint dot
  const hint = document.createElement('div');
  hint.className = 'hint';
  cell.appendChild(hint);
}

function addCaptureHint(cell) {
  // Remove any existing capture hint
  const oldHint = cell.querySelector('.capture-hint');
  if (oldHint) oldHint.remove();
  // Create and add new capture hint
  const hint = document.createElement('div');
  hint.className = 'capture-hint';
  cell.appendChild(hint);
}

function clearHints() {
  document.querySelectorAll('.hint, .capture-hint').forEach(hint => hint.remove());
}

function getPieceAt(i, j, cells) {
  if (i < 0 || i > 7 || j < 0 || j > 7) return null;
  const cell = cells[i][j];
  const img = cell.querySelector('img');
  if (!img) return null;
  if (img.src.includes('white')) return { color: 'white', type: getPieceTypeFromSrc(img.src) };
  if (img.src.includes('black')) return { color: 'black', type: getPieceTypeFromSrc(img.src) };
  return null;
}

function getPieceTypeFromSrc(src) {
  // src: .../piece-king-side-white.svg
  const match = src.match(/piece-([a-z]+)-side-(white|black)\.svg/);
  return match ? match[1] : null;
}

function showHintsForPiece(i, j, cells, color, type, skipClear) {
  if (!skipClear) clearHints();
  if (type === 'pawn') {
    // Only forward moves and captures for pawns
    const dir = color === 'white' ? -1 : 1;
    // Forward one
    if (i + dir >= 0 && i + dir < 8 && cells[i + dir][j].children.length === 0) {
      addHintDot(cells[i + dir][j]);
      // Forward two from starting position
      if ((color === 'white' && i === 6) || (color === 'black' && i === 1)) {
        if (cells[i + 2 * dir][j].children.length === 0) {
          addHintDot(cells[i + 2 * dir][j]);
        }
      }
    }
    // Captures
    for (const dj of [-1, 1]) {
      const ni = i + dir, nj = j + dj;
      if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
        const target = getPieceAt(ni, nj, cells);
        if (target && target.color !== color) {
          addCaptureHint(cells[ni][nj]);
        }
      }
    }
  } else if (type === 'rook') {
    // Rook: straight lines
    for (const [di, dj] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      for (let k = 1; k < 8; k++) {
        const ni = i + di * k, nj = j + dj * k;
        if (ni < 0 || ni > 7 || nj < 0 || nj > 7) break;
        const target = getPieceAt(ni, nj, cells);
        if (!target) {
          addHintDot(cells[ni][nj]);
        } else {
          if (target.color !== color) addCaptureHint(cells[ni][nj]);
          break;
        }
      }
    }
  } else if (type === 'bishop') {
    // Bishop: diagonals
    for (const [di, dj] of [[1,1], [1,-1], [-1,1], [-1,-1]]) {
      for (let k = 1; k < 8; k++) {
        const ni = i + di * k, nj = j + dj * k;
        if (ni < 0 || ni > 7 || nj < 0 || nj > 7) break;
        const target = getPieceAt(ni, nj, cells);
        if (!target) {
          addHintDot(cells[ni][nj]);
        } else {
          if (target.color !== color) addCaptureHint(cells[ni][nj]);
          break;
        }
      }
    }
  } else if (type === 'knight') {
    // Knight: L shapes
    for (const [di, dj] of [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]]) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
        const target = getPieceAt(ni, nj, cells);
        if (!target) {
          addHintDot(cells[ni][nj]);
        } else if (target.color !== color) {
          addCaptureHint(cells[ni][nj]);
        }
      }
    }
  } else if (type === 'queen') {
    showHintsForPiece(i, j, cells, color, 'rook');
    showHintsForPiece(i, j, cells, color, 'bishop', true);
  } else if (type === 'king') {
    // King: one square in any direction
    for (const di of [-1, 0, 1]) {
      for (const dj of [-1, 0, 1]) {
        if (di === 0 && dj === 0) continue;
        const ni = i + di, nj = j + dj;
        if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
          const target = getPieceAt(ni, nj, cells);
          if (!target) {
            addHintDot(cells[ni][nj]);
          } else if (target.color !== color) {
            addCaptureHint(cells[ni][nj]);
          }
        }
      }
    }
  }
}

let selectedPiece = null;
let selectedPos = null;

// Event delegation for hint clicks
function handleHintClick(e, cells) {
  const hint = e.target.closest('.hint, .capture-hint');
  if (!hint) return;
  e.stopPropagation();
  if (!selectedPiece || !selectedPos) return;
  const targetCell = hint.parentElement;
  const [fromI, fromJ] = selectedPos;
  let toI = -1, toJ = -1;
  // Find the target cell's position
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (cells[i][j] === targetCell) {
        toI = i; toJ = j;
      }
    }
  }
  if (toI === -1 || toJ === -1) return;
  // Animate the piece
  const pieceImg = selectedPiece;
  const fromRect = pieceImg.getBoundingClientRect();
  const toRect = targetCell.getBoundingClientRect();
  const dx = toRect.left - fromRect.left;
  const dy = toRect.top - fromRect.top;
  pieceImg.style.zIndex = 10;
  pieceImg.style.transform = `translate(${dx}px, ${dy}px)`;
  // Remove hints immediately
  clearHints();
  // After animation, move the piece in the DOM
  setTimeout(() => {
    // If this is a capture, remove the captured piece
    const captured = targetCell.querySelector('img');
    if (captured && captured !== pieceImg) {
      captured.remove();
    }
    pieceImg.style.transform = '';
    pieceImg.style.zIndex = '';
    targetCell.appendChild(pieceImg);
    selectedPiece = null;
    selectedPos = null;
  }, 300);
}

const build = () => {
  const numCols = 8,
    numRows = 8,
    pieceOrder = [
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'bishop',
      'knight',
      'rook',
    ],
    theGrid = document.getElementById('theGrid');

  // Store references to all cells for move hinting
  const cells = Array.from({ length: numRows }, () => Array(numCols));

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
      cells[i][j] = cell;

      // Place black pieces on top two rows
      if (i === 0) {
        placePiece(cell, 'black', pieceOrder[j]);
      } else if (i === 1) {
        placePiece(cell, 'black', 'pawn');
      }

      // Place white pieces on bottom two rows
      if (i === 6) {
        placePiece(cell, 'white', 'pawn');
      } else if (i === 7) {
        placePiece(cell, 'white', pieceOrder[j]);
      }

      // Add click event for all pieces
      cell.addEventListener('click', () => {
        clearHints();
        const piece = getPieceAt(i, j, cells);
        if (piece) {
          showHintsForPiece(i, j, cells, piece.color, piece.type);
          // Store selected piece and position
          const img = cell.querySelector('img');
          selectedPiece = img;
          selectedPos = [i, j];
        } else {
          selectedPiece = null;
          selectedPos = null;
        }
      });

      row.appendChild(cell);
    }
    theGrid.appendChild(row);
  }

  // Attach a single event listener for hint clicks (event delegation)
  theGrid.addEventListener('click', (e) => handleHintClick(e, cells));
};

build();
