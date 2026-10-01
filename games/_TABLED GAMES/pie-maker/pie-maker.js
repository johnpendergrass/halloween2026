/* ============================================================================
   Pie Maker (folder pie-maker)

   "Asteroids, but pumpkins, and no gun." Pumpkins drift across the field in
   straight lines, spinning; one that leaves by one edge comes back by the
   opposite edge. Tap a pumpkin and it becomes a pie, which stays put. Turn
   all of them into pies as fast as you can.

   UNITS: positions, sizes and speeds are in "field widths" (x = 0.5 is
   halfway across, size = 0.2 is 20% of the width). Pixels are worked out
   every frame from the field's current width, so the game looks the same
   at any panel size and survives a resize.

   The time is not reported to the app yet (app <-> game messaging is a
   later step).

   Sections: 1 Settings, 2 State, 3 Making pumpkins, 4 Animation,
             5 Tapping, 6 Start and finish
   ========================================================================= */

/* ------------------------------------------------------------------------
   1. Settings
   --------------------------------------------------------------------- */

const PUMPKIN_COUNT = 10;

// Pumpkin sizes, as a share of the field's width. 0.13 (13vw) is the
// requirements' smallest tap target: 44px on an iPhone SE.
const SMALLEST_SIZE = 0.13;
const BIGGEST_SIZE = 0.24;

// Drift speed, in field widths per second. Small pumpkins get the fast end,
// big ones the slow end.
const SLOWEST_SPEED = 0.08;
const FASTEST_SPEED = 0.22;

// Spin, in degrees per second, either direction.
const MOST_SPIN = 60;

const PUMPKIN_IMAGE = "./assets/pumpkin.svg";
const PIE_IMAGE = "./assets/pie.svg";

/* ------------------------------------------------------------------------
   2. State
   --------------------------------------------------------------------- */

const field = document.getElementById("field");
const pieCountText = document.getElementById("pieCount");
const timerText = document.getElementById("timer");
const doneMessage = document.getElementById("doneMessage");
const doneTime = document.getElementById("doneTime");

// One object per pumpkin: { image, x, y, size, speedX, speedY, angle, spin, isPie }
let pumpkins = [];
let piesMade = 0;
let startTime = 0;        // performance.now() when this round started
let lastFrameTime = 0;
let isPlaying = false;

document.getElementById("pumpkinTotal").textContent = PUMPKIN_COUNT;

/* ------------------------------------------------------------------------
   3. Making pumpkins
   --------------------------------------------------------------------- */

function randomBetween(low, high) {
  return low + Math.random() * (high - low);
}

/** The field's height in field widths (1.4 = 1.4 times as tall as wide). */
function fieldHeightInWidths() {
  return field.clientHeight / field.clientWidth;
}

/** One pumpkin at a random place, drifting in a random direction. */
function makePumpkin() {
  const size = randomBetween(SMALLEST_SIZE, BIGGEST_SIZE);

  // 0 for the smallest possible pumpkin, 1 for the biggest.
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

  // pointerdown, not click: a tap on a moving target must count the instant
  // the finger lands, not when it lifts.
  image.addEventListener("pointerdown", () => turnIntoPie(pumpkin));
  return pumpkin;
}

/* ------------------------------------------------------------------------
   4. Animation
   --------------------------------------------------------------------- */

/** Move a pumpkin along its path; off one edge means back on the opposite edge. */
function movePumpkin(pumpkin, seconds) {
  const height = fieldHeightInWidths();

  pumpkin.x += pumpkin.speedX * seconds;
  pumpkin.y += pumpkin.speedY * seconds;
  pumpkin.angle += pumpkin.spin * seconds;

  // Only jump across once the pumpkin is completely off the field.
  if (pumpkin.x > 1) pumpkin.x = -pumpkin.size;
  if (pumpkin.x < -pumpkin.size) pumpkin.x = 1;
  if (pumpkin.y > height) pumpkin.y = -pumpkin.size;
  if (pumpkin.y < -pumpkin.size) pumpkin.y = height;
}

/** Field widths -> pixels on screen. */
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

function animate(now) {
  if (!isPlaying) return;

  // Capped, so a pause (switching tabs, say) doesn't make everything jump.
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
   6. Start and finish
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
