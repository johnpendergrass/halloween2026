/* Stack-o'-Lantern (folder stack-o-lantern)

   Pumpkin slabs slide across the sky. Tap to drop one onto the tower.
   Whatever hangs over the edge of the slab below is sliced off and falls,
   so the tower gets narrower with every sloppy drop, until a slab misses
   completely. A drop within a hair of perfect keeps the full width, and
   three perfects in a row grow the slab back a little.

   EVERY NUMBER IN THIS FILE IS IN vw (1vw = 1% of the game panel's width)
   unless a comment says otherwise. Positions are written into the
   elements' style as "Nvw", so the browser does the pixel maths and the
   game resizes by itself (requirements rule 5). The camera is one CSS
   transform on the tower container, so placed slabs are positioned once
   and never touched again. */

"use strict";

/* ------------------------------------------------------------------------
   1. Settings
   --------------------------------------------------------------------- */

const SLAB_H = readVw("--slab-h");        // one slab's height (9), shared with the CSS
const GROUND_H = readVw("--ground-h");    // the pumpkin patch at the bottom (10)
const START_WIDTH = 46;         // the base slab, and the widest a slab can be
const MIN_OVERLAP = 0.8;        // less overlap than this = a miss
const PERFECT_TOLERANCE = 1.6;  // edges this close count as perfect (about 6 px on a phone)
const PERFECT_STREAK = 3;       // every this-many perfects in a row...
const BONUS_WIDTH = 3;          // ...the slab grows this much wider (up to START_WIDTH)
const START_SPEED = 42;         // vw per second
const SPEED_GROWTH = 1.035;     // speed is multiplied by this for every slab placed
const MAX_SPEED = 110;
const HOVER = SLAB_H * 1.8;     // how far above the tower the moving slab flies
const GRAVITY = 320;            // vw per second squared, for falling pieces
const CAMERA_LINE = 0.42;       // keep the tower top at this share of the stage height
const END_DELAY_MS = 900;       // time to watch the miss before the end screen

const TONES = ["#f0862a", "#e8741c", "#f59a3c", "#d9631a", "#ee7f22", "#fb9a48"];
const GHOST_TONE = "#efe6d3";   // every 7th slab is a pale "ghost pumpkin"

// What the game says about a drop, by how much of the slab survived.
// Perfect drops and misses have their own words (see drop()).
const REACTIONS = [
  { atLeast: 0.9,  word: "nice",      moon: "is-happy" },
  { atLeast: 0.7,  word: "close one", moon: "is-happy" },
  { atLeast: 0.45, word: "yikes",     moon: "is-meh" },
  { atLeast: 0,    word: "oof",       moon: "is-meh" },
];

// The end screen turns the count into a height. A pumpkin slab is about
// 30 cm tall, so 10 slabs = 3 m = a basketball hoop. The last line whose
// count is not above the player's count is used.
const COMPARISONS = [
  [1,   "That is one pumpkin. Bold start."],
  [2,   "Taller than a cauldron. Barely."],
  [4,   "Taller than a tombstone."],
  [6,   "Taller than a grown-up."],
  [8,   "Taller than a door. A tall door."],
  [10,  "Taller than a basketball hoop."],
  [12,  "Taller than an elephant."],
  [18,  "Taller than a giraffe."],
  [25,  "As tall as a two-storey haunted house."],
  [34,  "Taller than a telephone pole."],
  [45,  "Taller than a school bus standing on end."],
  [60,  "Taller than a five-storey building."],
  [80,  "Taller than a blue whale balancing on its tail."],
  [100, "Twice the height of the Hollywood sign."],
  [150, "As tall as the Statue of Liberty. The lady, not the pedestal."],
  [200, "Taller than the Leaning Tower of Pisa."],
  [320, "Taller than Big Ben. Please go outside."],
];

/* ------------------------------------------------------------------------
   2. The page's parts and the game's state
   --------------------------------------------------------------------- */

const stage = document.getElementById("stage");
const tower = document.getElementById("tower");
const stars = document.getElementById("stars");
const moon = document.getElementById("moon");
const reaction = document.getElementById("reaction");
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const endWord = document.getElementById("endWord");
const endCount = document.getElementById("endCount");
const endCompare = document.getElementById("endCompare");
const countLabel = document.getElementById("count");
const bestLabel = document.getElementById("best");

// Everything that changes while playing lives here, so it is easy to see
// (and to reset). Coordinates are "world" coordinates: x from the left
// edge, y up from the stage's bottom edge, both in vw. The camera only
// changes how the world is shown, never the numbers in it.
const state = {
  phase: "ready",      // "ready" (start screen), "playing", or "over"
  slabs: [],           // placed slabs, bottom first: { element, x, width }
  mover: null,         // the sliding slab: { element, x, width, direction, speed }
  pieces: [],          // falling bits: { element, x, y, vx, vy, angle, spin }
  camera: 0,           // how far up the world the view has scrolled
  streak: 0,           // perfect drops in a row
  best: 0,             // best count this visit (the app keeps the lasting list)
  lastTime: 0,         // timestamp of the previous animation frame (ms)
};

/* ------------------------------------------------------------------------
   3. Small helpers
   --------------------------------------------------------------------- */

/** A CSS variable such as "9vw" as the number 9. Read once at start-up. */
function readVw(variableName) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  return parseFloat(value);
}

/** The stage's height in vw. It depends on the panel's shape, so it is
    re-read whenever it is needed rather than remembered. */
function stageHeight() {
  return (stage.clientHeight / stage.clientWidth) * 100;
}

/** World y of the tower's top surface: where the next slab lands. */
function towerTop() {
  return GROUND_H + state.slabs.length * SLAB_H;
}

/** How many pumpkins the player has stacked (the base does not count). */
function stackedCount() {
  return Math.max(0, state.slabs.length - 1);
}

/** The colour of slab number `index` (0 = the base). */
function toneFor(index) {
  if (index % 7 === 6) return GHOST_TONE;
  return TONES[index % TONES.length];
}

/** A new slab element at world position (x, bottom), `width` wide. */
function makeSlabElement(x, bottom, width, tone) {
  const element = document.createElement("div");
  element.className = "slab";
  element.style.setProperty("--tone", tone);
  element.style.left = x + "vw";
  element.style.bottom = bottom + "vw";
  element.style.width = width + "vw";
  tower.appendChild(element);
  return element;
}

/* ------------------------------------------------------------------------
   4. Showing things: the reaction word, the moon, the camera
   --------------------------------------------------------------------- */

/** Flash a word over the tower. `extraClass` colours it (is-perfect,
    is-miss). Removing and re-adding the class would happen inside one
    frame and the browser would not notice, so the reflow trick
    (reading offsetWidth) forces it to restart the animation. */
function showReaction(word, extraClass) {
  reaction.textContent = word;
  reaction.className = "reaction text-large text-on-art";
  if (extraClass) reaction.classList.add(extraClass);
  void reaction.offsetWidth;
  reaction.classList.add("is-shown");
}

/** The moon's face: is-happy, is-wow, is-meh or is-sad. */
function moonReacts(mood) {
  moon.className = "moon " + mood;
}

/** Slide the view so the tower top stays around CAMERA_LINE. The tower
    container moves DOWN by `camera`, which shows a higher part of the
    world. The stars and the moon move less, for a little depth. */
function moveCamera(dt) {
  const target = Math.max(0, towerTop() - stageHeight() * CAMERA_LINE);
  // Ease towards the target: cover a share of the remaining distance each
  // frame, so the view glides instead of jumping.
  state.camera += (target - state.camera) * Math.min(1, dt * 6);
  tower.style.transform = "translateY(" + state.camera + "vw)";
  stars.style.transform = "translateY(" + state.camera * 0.25 + "vw)";
  moon.style.transform = "translateY(" + state.camera * 0.12 + "vw)";
}

function updateLabels() {
  const count = stackedCount();
  countLabel.textContent = count;
  if (count > state.best) state.best = count;
  bestLabel.textContent = state.best;
}

/* ------------------------------------------------------------------------
   5. The slabs: placing, sliding, dropping, falling
   --------------------------------------------------------------------- */

/** Put a slab on top of the tower and remember it. */
function placeSlab(element, x, width) {
  // Only the top slab shows a stem.
  const previousTop = state.slabs[state.slabs.length - 1];
  if (previousTop) previousTop.element.classList.remove("has-stem");
  element.classList.add("has-stem");
  state.slabs.push({ element, x, width });
}

/** Start a new slab sliding in from alternate sides, as wide as the
    slab it must land on, a little faster than the one before. */
function spawnMover() {
  const top = state.slabs[state.slabs.length - 1];
  const fromLeft = state.slabs.length % 2 === 1;
  const speed = Math.min(MAX_SPEED, START_SPEED * Math.pow(SPEED_GROWTH, state.slabs.length - 1));
  const x = fromLeft ? -top.width : 100;
  const element = makeSlabElement(x, towerTop() + HOVER, top.width, toneFor(state.slabs.length));
  element.classList.add("has-stem");
  state.mover = { element, x, width: top.width, direction: fromLeft ? 1 : -1, speed };
}

/** Slide the mover back and forth. It turns around when it is a bit past
    the stage's edge, so it is never out of sight for long. */
function moveMover(dt) {
  const mover = state.mover;
  mover.x += mover.direction * mover.speed * dt;
  const leftLimit = -mover.width * 0.35;
  const rightLimit = 100 - mover.width * 0.65;
  if (mover.x < leftLimit) { mover.x = leftLimit; mover.direction = 1; }
  if (mover.x > rightLimit) { mover.x = rightLimit; mover.direction = -1; }
  mover.element.style.left = mover.x + "vw";
}

/** A piece that tumbles off the tower (or a whole missed slab). */
function addFallingPiece(element, x, y, width, vx) {
  element.classList.remove("has-stem", "is-new");
  element.style.left = x + "vw";
  element.style.bottom = y + "vw";
  element.style.width = width + "vw";
  state.pieces.push({
    element, x, y, vx,
    vy: 12,                                   // a small hop up first
    angle: 0,
    spin: (vx >= 0 ? 1 : -1) * (90 + Math.random() * 120),   // degrees per second
  });
}

/** Gravity for the falling pieces; remove them once they are well below
    the bottom of the view. */
function movePieces(dt) {
  const gone = [];
  state.pieces.forEach((piece) => {
    piece.vy -= GRAVITY * dt;
    piece.y += piece.vy * dt;
    piece.x += piece.vx * dt;
    piece.angle += piece.spin * dt;
    piece.element.style.left = piece.x + "vw";
    piece.element.style.bottom = piece.y + "vw";
    piece.element.style.transform = "rotate(" + piece.angle + "deg)";
    if (piece.y + SLAB_H * 2 < state.camera) gone.push(piece);
  });
  gone.forEach((piece) => {
    piece.element.remove();
    state.pieces.splice(state.pieces.indexOf(piece), 1);
  });
}

/** The tap. Works out how the moving slab lines up with the top slab. */
function drop() {
  const mover = state.mover;
  const top = state.slabs[state.slabs.length - 1];
  const landing = towerTop();
  state.mover = null;

  // Perfect: the edges match within the tolerance. Snap it into line.
  if (Math.abs(mover.x - top.x) <= PERFECT_TOLERANCE) {
    state.streak += 1;
    let x = top.x;
    let width = top.width;
    let word = state.streak > 1 ? "PERFECT x" + state.streak : "PERFECT!";
    if (state.streak % PERFECT_STREAK === 0 && width < START_WIDTH) {
      // The reward for a streak: the slab grows back, evenly on both sides.
      const grownWidth = Math.min(START_WIDTH, width + BONUS_WIDTH);
      x -= (grownWidth - width) / 2;
      width = grownWidth;
      word = "WIDER!";
    }
    settle(mover.element, x, width, landing);
    showReaction(word, "is-perfect");
    moonReacts("is-wow");
    return;
  }

  state.streak = 0;
  const left = Math.max(mover.x, top.x);
  const right = Math.min(mover.x + mover.width, top.x + top.width);
  const overlap = right - left;

  // A miss: the whole slab tumbles off the side it hung over.
  if (overlap < MIN_OVERLAP) {
    const fellLeft = mover.x < top.x;
    addFallingPiece(mover.element, mover.x, landing + HOVER, mover.width, fellLeft ? -25 : 25);
    gameOver();
    return;
  }

  // A partial hit: keep the overlap, drop the overhang.
  if (mover.x < top.x) {
    const cut = makeSlabElement(mover.x, landing, top.x - mover.x, toneFor(state.slabs.length));
    addFallingPiece(cut, mover.x, landing, top.x - mover.x, -20);
  } else {
    const cutX = top.x + top.width;
    const cut = makeSlabElement(cutX, landing, mover.x + mover.width - cutX, toneFor(state.slabs.length));
    addFallingPiece(cut, cutX, landing, mover.x + mover.width - cutX, 20);
  }
  settle(mover.element, left, overlap, landing);

  const kept = overlap / mover.width;
  const feeling = REACTIONS.find((entry) => kept >= entry.atLeast);
  showReaction(feeling.word);
  moonReacts(feeling.moon);
}

/** Land the moving slab's element on the tower as a placed slab, then
    send in the next mover. */
function settle(element, x, width, bottom) {
  element.style.left = x + "vw";
  element.style.bottom = bottom + "vw";
  element.style.width = width + "vw";
  element.classList.add("is-new");
  placeSlab(element, x, width);
  updateLabels();
  spawnMover();
}

/* ------------------------------------------------------------------------
   6. Starting, ending, the frame loop and the taps
   --------------------------------------------------------------------- */

/** Clear the tower and put the base slab on the ground. */
function reset() {
  tower.innerHTML = "";
  // The ground is part of the world, so it scrolls away with the base.
  const ground = document.createElement("div");
  ground.className = "ground";
  tower.appendChild(ground);
  state.slabs = [];
  state.pieces = [];
  state.mover = null;
  state.camera = 0;
  state.streak = 0;
  moveCamera(1);
  const baseX = (100 - START_WIDTH) / 2;
  const base = makeSlabElement(baseX, GROUND_H, START_WIDTH, toneFor(0));
  placeSlab(base, baseX, START_WIDTH);
  updateLabels();
  moonReacts("is-happy");
}

function start() {
  reset();
  state.phase = "playing";
  startScreen.hidden = true;
  endScreen.hidden = true;
  spawnMover();
}

function gameOver() {
  state.phase = "over";
  const count = stackedCount();
  moonReacts("is-sad");
  showReaction(count === 0 ? "WHIFF." : "SPLAT.", "is-miss");

  endWord.textContent = count >= 20 ? "TIMBER!" : (count === 0 ? "WHIFF." : "SPLAT.");
  endCount.textContent = count === 1 ? "You stacked 1 pumpkin."
                                     : "You stacked " + count + " pumpkins.";
  const line = COMPARISONS.filter((entry) => entry[0] <= count).pop();
  endCompare.textContent = line ? line[1] : "The pumpkin patch remains undefeated.";

  // Tell the app, which keeps this game's five best counts and shows them
  // in the This Game tab (games/game-helper.js). A count of 0 is ignored.
  Halloween.reportScore(count);

  // Let the miss play out before the end screen covers it.
  setTimeout(() => { endScreen.hidden = false; }, END_DELAY_MS);
}

/** One animation frame. dt is in seconds, capped so a paused tab does not
    fling everything off the screen when it wakes up. */
function frame(now) {
  const dt = Math.min(0.05, (now - state.lastTime) / 1000 || 0);
  state.lastTime = now;
  if (state.mover) moveMover(dt);
  movePieces(dt);
  moveCamera(dt);
  requestAnimationFrame(frame);
}

/** Every tap does the one thing the current phase needs. On the end
    screen only the button restarts, so a stray tap does not skip it. */
function onTap(event) {
  if (state.phase === "ready") { start(); return; }
  if (state.phase === "playing") { drop(); }
}

// pointerdown fires the instant a finger touches: no click delay.
stage.addEventListener("pointerdown", onTap);
document.getElementById("playAgain").addEventListener("click", start);

// A bonus for people at a keyboard. Touch alone is enough (rule 11).
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    if (state.phase === "over") start(); else onTap(event);
  }
});

reset();
requestAnimationFrame(frame);
