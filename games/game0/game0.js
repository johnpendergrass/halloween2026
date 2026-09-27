/* ============================================================================
   game0 (Home) - its own code.

   A painted pumpkin patch under a full moon. Every so often a character's
   silhouette slowly rises up from behind the tree line, waits a moment,
   and sinks back down. Based on the title screen of the Halloween 2025 app.

   The rising and sinking itself is a CSS transition (see game0.css): this
   code just picks a character, puts it somewhere, and adds or removes the
   "is-up" class at the right times.

   Section map:
     1. Settings
     2. The deck of characters (shuffled, like cards)
     3. Rise, wait, sink, wait, repeat
     4. Start
   ========================================================================= */

/* ------------------------------------------------------------------------
   1. Settings
   --------------------------------------------------------------------- */

const SILHOUETTE_FOLDER = "./assets/silhouettes/";

const CHARACTERS = [
  "silhouette_batman_transparent_250h.png",
  "silhouette_darthVader_transparent_250h.png",
  "silhouette_jiji_transparent_250h.png",
  "silhouette_luke_transparent_250h.png",
  "silhouette_m_boo_transparent_250h.png",
  "silhouette_m_mike_transparent_250h.png",
  "silhouette_m_sully_transparent_250h.png",
  "silhouette_otgw_gregory_transparent_250h.png",
  "silhouette_otgw_theBeast_transparent_250h.png",
  "silhouette_otgw_wirt_transparent_250h.png",
  "silhouette_snoopy_transparent_250h.png",
  "silhouette_superman_transparent_250h.png",
  "silhouette_totoro_transparent_250h.png",
  "silhouette_ts_boPeep_transparent_250h.png",
  "silhouette_ts_buzz_transparent_250h.png",
  "silhouette_ts_jessie_transparent_250h.png",
  "silhouette_ts_rexx_transparent_250h.png",
  "silhouette_ts_sporky_transparent_250h.png",
  "silhouette_wickedWitch_transparent_250h.png",
];

// Timings, in seconds: [shortest, longest]. A random time in between is
// picked each time. Sinking takes 1 second less than rising did.
const RISE_TIME = [2, 4];
const WAIT_AT_TOP = [1, 4];
const WAIT_HIDDEN = [4, 12]; // middle 8 s (was 5-15, middle 10 s; John: ~20% faster)
const FIRST_WAIT = [0, 1]; // after the page loads

// Where the character may appear: its LEFT edge, in % of the painting's
// width. Only about 13% to 61% of the painting is on screen (see
// --crop-from-left in game0.css).
const LEFT_MOST = 14;
const RIGHT_MOST = 40;

/* ------------------------------------------------------------------------
   2. The deck of characters
   Shuffled like cards, and dealt one at a time, so nobody appears twice
   until everybody has appeared once. Then it is shuffled again.
   --------------------------------------------------------------------- */

const character = document.getElementById("character");
let deck = [];

function randomBetween(low, high) {
  return low + Math.random() * (high - low);
}

/** A random time from a [shortest, longest] setting. */
function randomTime(range) {
  return randomBetween(range[0], range[1]);
}

/** Put the characters in a random order (the Fisher-Yates shuffle). */
function shuffle(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Deal the next character from the deck. */
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

/** Pick a new character, put it somewhere, and start it rising. */
function rise() {
  character.src = SILHOUETTE_FOLDER + dealCharacter();

  // Across: a random place. On the right half, mirror it so it faces inward.
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

/** Start the character sinking, then wait a while before the next one. */
function sink(sinkTime) {
  character.style.transitionDuration = sinkTime + "s";
  character.classList.remove("is-up");
  afterSeconds(sinkTime + randomTime(WAIT_HIDDEN), rise);
}

/* ------------------------------------------------------------------------
   4. Start
   --------------------------------------------------------------------- */

afterSeconds(randomTime(FIRST_WAIT), rise);
