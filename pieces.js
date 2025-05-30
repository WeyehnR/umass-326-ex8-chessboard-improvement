// Piece logic module

export function placePiece(cell, color, piece) {
  const img = document.createElement('img');
  img.src = `public/chess_pieces/${color}_pieces_svg/piece-${piece}-side-${color}.svg`;
  img.alt = `${color.charAt(0).toUpperCase() + color.slice(1)} ${piece.charAt(0).toUpperCase() + piece.slice(1)}`;
  img.style.width = '80px';
  img.style.height = '80px';
  cell.appendChild(img);
}

export function getPieceAt(i, j, cells) {
  if (i < 0 || i >= 8 || j < 0 || j >= 8) return null;
  const img = cells[i][j].querySelector('img');
  if (!img) return null;
  const color = img.src.includes('white') ? 'white' : 'black';
  const type = img.src.match(/piece-([a-z]+)-side/)?.[1];
  return type ? { color, type } : null;
} 