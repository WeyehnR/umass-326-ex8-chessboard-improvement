import { placePiece, getPieceAt } from './pieces.js';
import { clearHints, showHintsForPiece } from './hints.js';

let currentTurn = Math.random() < 0.5 ? 'white' : 'black';

// --- Board Configuration ---
const BOARD_SIZE = 8;
const PIECE_ORDER = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

// --- DOM Elements ---
const theGrid = document.getElementById('theGrid');
const fragment = document.createDocumentFragment();

// --- State for Selected Piece ---
let selectedPiece = null;
let selectedPos = null;

// --- Turn Indicator UI ---
function updateTurnIndicator() {
  let indicator = document.getElementById('turn-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'turn-indicator';
    indicator.style.margin = '10px';
    indicator.style.fontWeight = 'bold';
    document.body.appendChild(indicator);
  }
  indicator.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) + "'s Turn";
}

// --- Promotion Menu UI ---
function showPromotionMenu(targetCell, color, onSelect) {
  // Remove any existing menu
  let existingMenu = document.getElementById('promotion-menu');
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement('div');
  menu.id = 'promotion-menu';
  menu.style.position = 'absolute';
  menu.style.zIndex = '1000';
  menu.style.background = 'white';
  menu.style.border = '1px solid #888';
  menu.style.padding = '8px';
  menu.style.display = 'flex';
  menu.style.gap = '8px';

  // Position menu near the target cell
  const rect = targetCell.getBoundingClientRect();
  menu.style.left = `${rect.left + window.scrollX}px`;
  menu.style.top = `${rect.top + window.scrollY}px`;

  ['queen', 'rook', 'bishop', 'knight'].forEach(pieceType => {
    const btn = document.createElement('button');
    btn.textContent = pieceType.charAt(0).toUpperCase() + pieceType.slice(1);
    btn.onclick = () => {
      menu.remove();
      onSelect(pieceType);
    };
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
}

// --- Piece Movement Animation and Capture ---
function animateAndMovePiece(pieceImg, targetCell, toRow, toCol, cells) {
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

      // --- Pawn Promotion Logic ---
      const piece = getPieceAt(toRow, toCol, cells);
      if (piece && piece.type === 'pawn') {
        const promotionRow = piece.color === 'white' ? 0 : 7;
        if (toRow === promotionRow) {
          pieceImg.remove();
          showPromotionMenu(targetCell, piece.color, (chosenPiece) => {
            placePiece(targetCell, piece.color, chosenPiece);
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
            updateTurnIndicator();
          });
          return; // Wait for promotion choice before switching turn
        }
      }

      // Switch turn after move
      currentTurn = currentTurn === 'white' ? 'black' : 'white';
      updateTurnIndicator();
    }, 300);
  });
}

// --- Handle Click on Move or Capture Hint ---
function handleHintClick(event, cells) {
  const hint = event.target.closest('.hint, .capture-hint');
  if (!hint || !selectedPiece || !selectedPos) return;

  event.stopPropagation();
  const targetCell = hint.parentElement;

  // Find the target cell's coordinates
  const toRow = cells.findIndex(row => row.includes(targetCell));
  const toCol = cells[toRow]?.indexOf(targetCell);

  if (toRow === -1 || toCol === -1) return;

  animateAndMovePiece(selectedPiece, targetCell, toRow, toCol, cells);
}

// --- Handle Click on a Board Cell ---
function handleCellClick(i, j, cells, cell) {
  return function(event) {
    // Ignore if clicking a hint
    if (event.target.closest('.hint, .capture-hint')) return;
    clearHints();

    const piece = getPieceAt(i, j, cells);
    if (piece && piece.color === currentTurn) {
      showHintsForPiece(i, j, cells, piece.color, piece.type);
      selectedPiece = cell.querySelector('img');
      selectedPos = [i, j];
    } else {
      selectedPiece = null;
      selectedPos = null;
    }
  };
}

// --- Build the Chessboard and Place Pieces ---
function buildBoard() {
  const cells = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE));

  for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx++) {
    const row = document.createElement('div');
    row.classList.add('row');

    for (let colIdx = 0; colIdx < BOARD_SIZE; colIdx++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', (rowIdx + colIdx) % 2 === 0 ? 'white' : 'black');
      cells[rowIdx][colIdx] = cell;

      // Place pieces according to standard chess setup
      if (rowIdx === 0) placePiece(cell, 'black', PIECE_ORDER[colIdx]);
      else if (rowIdx === 1) placePiece(cell, 'black', 'pawn');
      else if (rowIdx === 6) placePiece(cell, 'white', 'pawn');
      else if (rowIdx === 7) placePiece(cell, 'white', PIECE_ORDER[colIdx]);

      // Attach click handler for this cell
      cell.addEventListener('click', handleCellClick(rowIdx, colIdx, cells, cell));

      row.appendChild(cell);
    }
    fragment.appendChild(row);
  }

  theGrid.appendChild(fragment);
  theGrid.addEventListener('click', (e) => handleHintClick(e, cells));
  theGrid.style.visibility = 'visible';
}

function resetBoard() {
  // Remove all children from theGrid
  while (theGrid.firstChild) {
    theGrid.removeChild(theGrid.firstChild);
  }
  // Remove promotion menu if present
  const menu = document.getElementById('promotion-menu');
  if (menu) menu.remove();
  // Reset state
  selectedPiece = null;
  selectedPos = null;
  currentTurn = Math.random() < 0.5 ? 'white' : 'black';
  // Rebuild the board and update the turn indicator
  buildBoard();
  updateTurnIndicator();
}

// --- Initialize the Board ---
buildBoard();
updateTurnIndicator();

document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetBoard);
  }
});
