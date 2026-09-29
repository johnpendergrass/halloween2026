/* game3 - DELIBERATELY WRONG test game: fixed px for one phone size.
   A tiny find-the-ghosts board: 8 x 6 squares, 12 of them hide a ghost.
   Tap a square to open it. Uses click, like an ordinary web page. */

const COLUMNS = 8;
const ROWS = 6;
const GHOSTS = 12;

const board = document.getElementById("board");
const foundBox = document.getElementById("found");
let found = 0;

/** Build a fresh board: every square closed, 12 random ones hiding a ghost. */
function makeBoard() {
  board.innerHTML = "";
  found = 0;
  foundBox.textContent = found;

  // Pick GHOSTS distinct squares out of ROWS x COLUMNS.
  const total = COLUMNS * ROWS;
  const ghostSquares = new Set();
  while (ghostSquares.size < GHOSTS) {
    ghostSquares.add(Math.floor(Math.random() * total));
  }

  for (let i = 0; i < total; i += 1) {
    const square = document.createElement("div");
    square.className = "square";
    square.addEventListener("click", () => {
      if (square.classList.contains("is-open")) return;
      square.classList.add("is-open");
      if (ghostSquares.has(i)) {
        square.classList.add("is-ghost");
        found += 1;
        foundBox.textContent = found;
      }
    });
    board.appendChild(square);
  }
}

document.getElementById("reset").addEventListener("click", makeBoard);
makeBoard();
