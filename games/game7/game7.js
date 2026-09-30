/* game7 - its own code. Placeholder for now: it only shows how big the game
   panel is, so sizes can be checked on each device. */

const sizeReadout = document.getElementById("sizeReadout");

/** Show this page's size. Inside the app, that is the game panel's size. */
function showSize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  sizeReadout.textContent =
    "Game panel: " + w + " × " + h + " px (9:14 = 1.556, this = " +
    (h / w).toFixed(3) + ")";
}

showSize();
window.addEventListener("resize", showSize);
