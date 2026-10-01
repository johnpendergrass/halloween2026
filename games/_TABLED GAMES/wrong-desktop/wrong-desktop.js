/* wrong-desktop (was game2) - DELIBERATELY WRONG test game: desktop-style, fixed 1280 x 720.
   The only "game": click a pumpkin to score a point; Reset brings them back.
   Uses click, not pointerdown, like a typical desktop page. */

const scoreBox = document.getElementById("score");
const pumpkins = document.querySelectorAll(".pumpkin");
let score = 0;

pumpkins.forEach((pumpkin) => {
  pumpkin.addEventListener("click", () => {
    pumpkin.hidden = true;
    score += 1;
    scoreBox.textContent = score;
  });
});

document.getElementById("reset").addEventListener("click", () => {
  pumpkins.forEach((pumpkin) => { pumpkin.hidden = false; });
  score = 0;
  scoreBox.textContent = score;
});
