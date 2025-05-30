import { placePiece, getPieceAt } from './pieces.js';
import { addHint, clearHints, showHintsForPiece } from './hints.js';

// Constants for board configuration
const BOARD_SIZE = 8;
const PIECE_ORDER = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

// Cache DOM elements and create document fragment
const theGrid = document.getElementById('theGrid');
const fragment = document.createDocumentFragment();

let selectedPiece = null;
let selectedPos = null;

// Optimized move handling
function handleHintClick(e, cells) {
  const hint = e.target.closest('.hint, .capture-hint');
  if (!hint || !selectedPiece || !selectedPos) return;
  
  e.stopPropagation();
  const targetCell = hint.parentElement;
  
  // Find target position using cached cell references
  const toI = cells.findIndex(row => row.includes(targetCell));
  const toJ = cells[toI]?.indexOf(targetCell);
  
  if (toI === -1 || toJ === -1) return;

  // Animate piece movement
  const pieceImg = selectedPiece;
  const fromRect = pieceImg.getBoundingClientRect();
  const toRect = targetCell.getBoundingClientRect();
  
  pieceImg.style.zIndex = '10';
  pieceImg.style.transform = `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)`;
  
  clearHints();
  
  requestAnimationFrame(() => {
    setTimeout(() => {
      const captured = targetCell.querySelector('img');
      if (captured && captured !== pieceImg) captured.remove();
      
      pieceImg.style.transform = '';
      pieceImg.style.zIndex = '';
      targetCell.appendChild(pieceImg);
      selectedPiece = null;
      selectedPos = null;
    }, 300);
  });
}

// Optimized board building
function build() {
  const cells = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE));

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', (i + j) % 2 === 0 ? 'white' : 'black');
      cells[i][j] = cell;

      // Place pieces
      if (i === 0) placePiece(cell, 'black', PIECE_ORDER[j]);
      else if (i === 1) placePiece(cell, 'black', 'pawn');
      else if (i === 6) placePiece(cell, 'white', 'pawn');
      else if (i === 7) placePiece(cell, 'white', PIECE_ORDER[j]);

      // Add click handler
      cell.addEventListener('click', (event) => {
        // Prevent cell click logic if clicking a hint
        if (event.target.closest('.hint, .capture-hint')) return;
        clearHints();
        const piece = getPieceAt(i, j, cells);
        if (piece) {
          showHintsForPiece(i, j, cells, piece.color, piece.type);
          selectedPiece = cell.querySelector('img');
          selectedPos = [i, j];
        } else {
          selectedPiece = null;
          selectedPos = null;
        }
      });

      row.appendChild(cell);
    }
    fragment.appendChild(row);
  }

  theGrid.appendChild(fragment);
  theGrid.addEventListener('click', (e) => handleHintClick(e, cells));
  theGrid.style.visibility = 'visible';
}

build();
