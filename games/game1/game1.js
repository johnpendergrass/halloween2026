/* ============================================================================
   Pie Maker (game1) - its own code.

   "Asteroids, but pumpkins, and no gun": pumpkins drift across the field in
   straight lines, slowly spinning. A pumpkin that drifts off one edge comes
   back on the opposite edge. Tap a pumpkin and it turns into a pumpkin pie
   (which stays put). Turn all of them into pies as fast as you can.

   The timer starts when the game starts and stops at the last pie. It is
   NOT sent to the app yet - that is a later communications test.

   UNITS: every position, size and speed is measured in "field widths".
   x = 0.5 means halfway across; size = 0.2 means 20% of the width. The
   pixel numbers are worked out fresh every frame, so the game keeps its
   look at any size - even if the game panel changes shape later.

   Section map:
     1. Settings (fixed for now; later the app may change them)
     2. Game state
     3. Making the pumpkins
     4. Moving and drawing (the animation loop)
     5. Tapping: pumpkin -> pie
     6. Start, finish, play again
   ========================================================================= */

/* ------------------------------------------------------------------------
   1. Settings
   --------------------------------------------------------------------- */

const PUMPKIN_COUNT = 10;

// Pumpkin sizes, as a share of the field's width. 0.13 is 44px on an
// iPhone SE (the smallest phone) - the smallest comfortable finger target.
const SMALLEST_SIZE = 0.13;
const BIGGEST_SIZE = 0.24;

// Drift speeds, in field widths per second. Small pumpkins get the fast
// end, big pumpkins the slow end.
const SLOWEST_SPEED = 0.08;
const FASTEST_SPEED = 0.22;

// Spin, in degrees per second (either direction).
const MOST_SPIN = 60;

const PUMPKIN_IMAGE = "./assets/pumpkin.svg";
const PIE_IMAGE = "./assets/pie.svg";

/* ------------------------------------------------------------------------
   2. Game state
   --------------------------------------------------------------------- */

const field = document.getElementById("field");
const pieCountText = document.getElementById("pieCount");
const timerText = document.getElementById("timer");
const doneMessage = document.getElementById("doneMessage");
const doneTime = document.getElementById("doneTime");

// One object per pumpkin: { image, x, y, size, speedX, speedY, angle, spin, isPie }
let pumpkins = [];
let piesMade = 0;
let startTime = 0;        // when this round started (milliseconds)
let lastFrameTime = 0;    // when the previous frame was drawn
let isPlaying = false;

document.getElementById("pumpkinTotal").textContent = PUMPKIN_COUNT;

/* ------------------------------------------------------------------------
   3. Making the pumpkins
   --------------------------------------------------------------------- */

function randomBetween(low, high) {
  return low + Math.random() * (high - low);
}

/** How tall the field is, in field widths (e.g. 1.4 = 1.4 times as tall as wide). */
function fieldHeightInWidths() {
  return field.clientHeight / field.clientWidth;
}

/** Make one pumpkin at a random place, drifting in a random direction. */
function makePumpkin() {
  const size = randomBetween(SMALLEST_SIZE, BIGGEST_SIZE);

  // 0 for the smallest pumpkin, 1 for the biggest.
  const bigness = (size - SMALLEST_SIZE) / (BIGGEST_SIZE - SMALLEST_SIZE);
  const speed = FASTEST_SPEED - bigness * (FASTEST_SPEED - SLOWEST_SPEED);
  const direction = randomBetween(0, 2 * Math.PI);

  const image = document.createElement("img");
  image.className = "piece";
  image.src = PUMPKIN_IMAGE;
  image.alt = "pumpkin";
  image.draggable = false;
  field.appendChild(image);

  const pumpkin = {
    image: image,
    x: randomBetween(0, 1 - size),
    y: randomBetween(0, fieldHeightInWidths() - size),
    size: size,
    speedX: Math.cos(direction) * speed,
    speedY: Math.sin(direction) * speed,
    angle: randomBetween(0, 360),
    spin: randomBetween(-MOST_SPIN, MOST_SPIN),
    isPie: false,
  };

  // pointerdown (not click) so a tap counts the instant the finger lands -
  // important for moving targets.
  image.addEventListener("pointerdown", () => turnIntoPie(pumpkin));
  return pumpkin;
}

/* ------------------------------------------------------------------------
   4. Moving and drawing
   --------------------------------------------------------------------- */

/** Move a pumpkin along its path. Off one edge -> back on the opposite edge. */
function movePumpkin(pumpkin, seconds) {
  const height = fieldHeightInWidths();

  pumpkin.x += pumpkin.speedX * seconds;
  pumpkin.y += pumpkin.speedY * seconds;
  pumpkin.angle += pumpkin.spin * seconds;

  // Wait until it is completely off the field before it jumps across.
  if (pumpkin.x > 1) pumpkin.x = -pumpkin.size;
  if (pumpkin.x < -pumpkin.size) pumpkin.x = 1;
  if (pumpkin.y > height) pumpkin.y = -pumpkin.size;
  if (pumpkin.y < -pumpkin.size) pumpkin.y = height;
}

/** Turn a pumpkin's field-width numbers into pixels on screen. */
function drawPumpkin(pumpkin) {
  const pixelsPerWidth = field.clientWidth;
  const style = pumpkin.image.style;
  style.width = pumpkin.size * pixelsPerWidth + "px";
  style.left = pumpkin.x * pixelsPerWidth + "px";
  style.top = pumpkin.y * pixelsPerWidth + "px";
  style.rotate = pumpkin.angle + "deg";
}

function showTime(milliseconds) {
  timerText.textContent = (milliseconds / 1000).toFixed(1) + " s";
}

/** One frame of animation. The browser calls this about 60 times a second. */
function animate(now) {
  if (!isPlaying) return;

  // Seconds since the last frame. Capped, so a pause (e.g. switching away
  // from the tab) doesn't make pumpkins jump a long way at once.
  const seconds = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  pumpkins.forEach((pumpkin) => {
    if (!pumpkin.isPie) movePumpkin(pumpkin, seconds);
    drawPumpkin(pumpkin); // pies too, in case the panel changed size
  });

  showTime(now - startTime);
  requestAnimationFrame(animate);
}

/* ------------------------------------------------------------------------
   5. Tapping: pumpkin -> pie
   --------------------------------------------------------------------- */

function turnIntoPie(pumpkin) {
  if (pumpkin.isPie || !isPlaying) return;

  pumpkin.isPie = true;
  pumpkin.angle = 0;
  pumpkin.image.src = PIE_IMAGE;
  pumpkin.image.alt = "pumpkin pie";
  pumpkin.image.classList.add("is-pie");
  drawPumpkin(pumpkin); // straighten it now, even if this was the last one

  piesMade += 1;
  pieCountText.textContent = piesMade;

  if (piesMade === PUMPKIN_COUNT) finishGame();
}

/* ------------------------------------------------------------------------
   6. Start, finish, play again
   --------------------------------------------------------------------- */

function startGame() {
  field.replaceChildren(); // clear away the last round's pies
  pumpkins = [];
  for (let i = 0; i < PUMPKIN_COUNT; i += 1) {
    pumpkins.push(makePumpkin());
  }

  piesMade = 0;
  pieCountText.textContent = 0;
  doneMessage.hidden = true;

  startTime = performance.now();
  lastFrameTime = startTime;
  isPlaying = true;
  requestAnimationFrame(animate);
}

function finishGame() {
  isPlaying = false;
  const elapsed = performance.now() - startTime;
  showTime(elapsed);
  doneTime.textContent = "Time: " + (elapsed / 1000).toFixed(1) + " seconds";
  doneMessage.hidden = false;
}

document.getElementById("playAgain").addEventListener("click", startGame);

startGame();
