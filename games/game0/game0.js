/* ============================================================================
   game0 (Home)

   A painted pumpkin patch under a full moon. Every so often a character's
   silhouette rises from behind the tree line, waits, and sinks back down.
   Based on the title screen of the Halloween 2025 app.

   The movement itself is a CSS transition (game0.css). This code picks a
   character, places it, and adds or removes the "is-up" class on a timer.

   Sections: 1 Settings, 2 The deck of characters, 3 Rise and sink, 4 Start
   ========================================================================= */

/* ------------------------------------------------------------------------
   1. Settings
   --------------------------------------------------------------------- */

const SILHOUETTE_FOLDER = "./assets/silhouettes/";

// Each name is the middle of a file name: silhouette_<name>_transparent_250h.png
const CHARACTERS = [
  "batman", "darthVader", "jiji", "luke",
  "m_boo", "m_mike", "m_sully",
  "otgw_gregory", "otgw_theBeast", "otgw_wirt",
  "snoopy", "superman", "totoro",
  "ts_boPeep", "ts_buzz", "ts_jessie", "ts_rexx", "ts_sporky",
  "wickedWitch",
];

function imageFor(name) {
  return SILHOUETTE_FOLDER + "silhouette_" + name + "_transparent_250h.png";
}

// Timings in seconds, [shortest, longest]; a random time in between is used
// each time. Sinking takes 1 second less than the rise did.
const RISE_TIME = [2, 4];
const WAIT_AT_TOP = [1, 4];
const WAIT_HIDDEN = [4, 12]; // 2025 used 5-15; John wanted ~20% faster
const FIRST_WAIT = [0, 1];   // after the page loads

// Where the character's LEFT edge may be, in % of the painting's width.
// Only about 13% to 61% of the painting is on screen (--crop-from-left).
const LEFT_MOST = 14;
const RIGHT_MOST = 40;

/* ------------------------------------------------------------------------
   2. The deck of characters: shuffled and dealt one at a time, so nobody
   appears twice until everybody has appeared once.
   --------------------------------------------------------------------- */

const character = document.getElementById("character");
let deck = [];

function randomBetween(low, high) {
  return low + Math.random() * (high - low);
}

function randomTime(range) {
  return randomBetween(range[0], range[1]);
}

function shuffle(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function dealCharacter() {
  if (deck.length === 0) deck = shuffle(CHARACTERS);
  return deck.shift();
}

/* ------------------------------------------------------------------------
   3. Rise, wait, sink, wait, repeat
   --------------------------------------------------------------------- */

function afterSeconds(seconds, then) {
  setTimeout(then, seconds * 1000);
}

function rise() {
  character.src = imageFor(dealCharacter());

  // A random place across; on the right half, mirror it so it faces inward.
  const left = randomBetween(LEFT_MOST, RIGHT_MOST);
  const middle = (LEFT_MOST + RIGHT_MOST) / 2;
  character.style.left = left + "%";
  character.classList.toggle("is-mirrored", left > middle);

  const riseTime = randomTime(RISE_TIME);
  character.style.transitionDuration = riseTime + "s";
  character.classList.add("is-up");

  const sinkTime = Math.max(1, riseTime - 1);
  afterSeconds(riseTime + randomTime(WAIT_AT_TOP), () => sink(sinkTime));
}

function sink(sinkTime) {
  character.style.transitionDuration = sinkTime + "s";
  character.classList.remove("is-up");
  afterSeconds(sinkTime + randomTime(WAIT_HIDDEN), rise);
}

/* ------------------------------------------------------------------------
   4. Start
   --------------------------------------------------------------------- */

// Fetch every silhouette now. Otherwise, on a slow connection, a character's
// first rise can happen before its image has arrived, and it pops in late.
CHARACTERS.forEach((name) => {
  new Image().src = imageFor(name);
});

afterSeconds(randomTime(FIRST_WAIT), rise);
