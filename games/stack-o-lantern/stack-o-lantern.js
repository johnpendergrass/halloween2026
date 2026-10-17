/* Stack o' Lantern (folder stack-o-lantern; "Stack-o'-Lantern" until 2026-10-17)

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
const MAX_SPEED = 110;

// One level (John, 2026-10-17: "hard seems fine as the only level"). An
// EASY / HARD toggle lived in an info bar above the stage for one day
// (2026-10-16); these are its HARD rules, the game as first built.
const SPEED_GROWTH = 1.035;     // speed is multiplied by this for every slab placed

// Milestones: little achievements inside one round (John, 2026-10-16;
// reworked into four families on 2026-10-17 from his list in
// _documents/milestone list.md, which is the place to edit the words).
//
// `family` is how the end screen groups them. "height" is the level the
// round reached: its name is the end screen's big title and its `line`
// the italic line under the count. The three named slots under that
// show the best "accuracy", "growth" and "bounce" milestone earned.
// WITHIN A FAMILY THE ORDER HERE IS THE RANK, rarest first: of a family's
// earned entries, the first one in this list is the one shown.
//
// `kind` names the counter that earns it and `at` the count:
//   "height"   = pumpkins stacked
//   "perfect"  = perfect drops in a row (a bounce does not break it)
//   "small", "tiny", "pencil" = landings in a row on a slab no wider than
//                a half / a quarter / an eighth of the starting width
//                (the "pencil pumpkin" is about a fingernail wide)
//   "ghost"    = a perfect drop on a ghost pumpkin
//   "growth"   = WIDERs in a row (a clip resets it, a plain perfect leaves
//                it; a WIDER needs a narrowed slab, so this family is only
//                ever earned after a clip: it rewards the recovery)
//   "clean"    = drops in a row made before the slab touched a wall (John's
//                word for it: no-bounce)
//   "cleanPerfect"      = no-bounce perfects in a row
//   "cleanSmallPerfect" = no-bounce perfects in a row on small slabs
//   "cleanTiny"         = no-bounce landings in a row on tiny slabs
//
// Each is earned once per round and celebrated with a banner and a burst
// of stars. Nothing is remembered between rounds: it is a game, not a
// trophy cabinet. The celebration is also where a sound will go.
// `what` is the banner's short line, `tip` the end screen's bubble, `hint`
// the start screen's goal line and `line` (height only) the comparison
// line. In all of those a word between asterisks (*perfect*) is shown in
// italics (John, 2026-10-17; see fillMarked).
const MILESTONES = [
  // HEIGHT: one per band; the line puns on the title without repeating it.
  { family: "height", kind: "height", at: 200, name: "Moon Landing", what: "200 pumpkins high",
    line: "Houston, we have a tower. Please come down now.",
    hint: "two hundred pumpkins high" },
  { family: "height", kind: "height", at: 100, name: "Burj Khalifa", what: "100 pumpkins high",
    line: "Dubai called. They want their skyline back.",
    hint: "a hundred pumpkins high" },
  { family: "height", kind: "height", at: 75, name: "Shanghai Tower", what: "75 pumpkins high",
    line: "Tourists on the top floor are staring at a pumpkin.",
    hint: "seventy-five pumpkins high" },
  { family: "height", kind: "height", at: 50, name: "Empire State", what: "50 pumpkins high",
    line: "King Kong wants to climb it. Tell him to get in line.",
    hint: "fifty pumpkins high" },
  { family: "height", kind: "height", at: 35, name: "Notre Dame", what: "35 pumpkins high",
    line: "The gargoyles are worried. The hunchback is impressed.",
    hint: "thirty-five pumpkins high" },
  { family: "height", kind: "height", at: 25, name: "Haunted House", what: "25 pumpkins high",
    line: "Two storeys up. The ghosts have to look up at you for once.",
    hint: "twenty-five pumpkins high" },
  { family: "height", kind: "height", at: 20, name: "Treetops", what: "20 pumpkins high",
    line: "The owls have a question. Who? You, apparently.",
    hint: "twenty pumpkins high" },
  { family: "height", kind: "height", at: 15, name: "Giraffe", what: "15 pumpkins high",
    line: "Eye to eye with the tallest animal alive. It blinked first.",
    hint: "fifteen pumpkins high" },
  { family: "height", kind: "height", at: 10, name: "Hoop Height", what: "10 pumpkins high",
    line: "Wembanyama can barely reach the top. Nothing but net.",
    hint: "ten pumpkins high" },
  { family: "height", kind: "height", at: 5, name: "Scarecrow", what: "5 pumpkins high",
    line: "The crows are watching. Nobody is scared yet.",
    hint: "five pumpkins high" },

  // ACCURACY: where the tap lands.
  { family: "accuracy", kind: "perfect", at: 20, name: "Machine", what: "20 *perfects* in a row",
    tip: "Twenty *perfect* drops in a row. Are you even a person?",
    hint: "twenty *perfects* in a row" },
  { family: "accuracy", kind: "pencil", at: 3, name: "Toothpick", what: "3 in a row on a pencil pumpkin",
    tip: "Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you?",
    hint: "three in a row on pencil-thin pumpkins" },
  { family: "accuracy", kind: "tiny", at: 6, name: "Eye of the Needle", what: "6 in a row on a tiny pumpkin",
    tip: "Six landings in a row on a tiny pumpkin, a quarter of the starting width or less. How?",
    hint: "six in a row on a tiny pumpkin" },
  { family: "accuracy", kind: "perfect", at: 10, name: "Laser", what: "10 *perfects* in a row",
    tip: "Ten *perfect* drops in a row. The moon stopped blinking somewhere around seven.",
    hint: "ten *perfects* in a row" },
  { family: "accuracy", kind: "small", at: 10, name: "High Wire", what: "10 in a row on a small pumpkin",
    tip: "Ten landings in a row on a small pumpkin. No net.",
    hint: "ten in a row on a small pumpkin" },
  { family: "accuracy", kind: "tiny", at: 3, name: "Needle", what: "3 in a row on a tiny pumpkin",
    tip: "Three landings in a row on a tiny pumpkin, a quarter of the starting width or less. Threading it.",
    hint: "three in a row on a tiny pumpkin" },
  { family: "accuracy", kind: "pencil", at: 1, name: "Pencil Pusher", what: "landed on a pencil pumpkin",
    tip: "A landing on a pencil pumpkin. Stacking those is hard.",
    hint: "land one on a pencil pumpkin" },
  { family: "accuracy", kind: "perfect", at: 5, name: "Sharp Eye", what: "5 *perfects* in a row",
    tip: "Five *perfect* drops in a row. Every edge lined up within a hair.",
    hint: "five *perfects* in a row" },
  { family: "accuracy", kind: "small", at: 5, name: "Tightrope", what: "5 in a row on a small pumpkin",
    tip: "Five landings in a row on a small pumpkin. Steady.",
    hint: "five in a row on a small pumpkin" },
  { family: "accuracy", kind: "ghost", at: 1, name: "Ghost Whisperer", what: "a *perfect* on a ghost pumpkin",
    tip: "A *perfect* drop on a ghost pumpkin, the pale one. When does it come? Watch.",
    hint: "a *perfect* drop on the pale ghost pumpkin" },

  // GROWTH: WIDERs in a row.
  { family: "growth", kind: "growth", at: 5, name: "Bumper Crop", what: "5 WIDERs in a row",
    tip: "Five WIDERs in a row. Fifteen *perfects*, and the tower is nearly whole again.",
    hint: "five WIDERs in a row" },
  { family: "growth", kind: "growth", at: 3, name: "Pumpkin Farmer", what: "3 WIDERs in a row",
    tip: "Three WIDERs in a row. That is nine *perfects*.",
    hint: "three WIDERs in a row" },
  { family: "growth", kind: "growth", at: 2, name: "Green Thumb", what: "2 WIDERs in a row",
    tip: "Two WIDERs in a row. The pumpkin is coming back.",
    hint: "two WIDERs in a row" },
  { family: "growth", kind: "growth", at: 1, name: "Sprout", what: "grew back WIDER",
    tip: "Three *perfects* in a row grew the pumpkin back a little. It all starts somewhere.",
    hint: "grow the pumpkin back with three *perfects* in a row" },

  // BOUNCE: tapped on the first pass, before the pumpkin touched a wall.
  // (John, 2026-10-17: 20 or 30 without a bounce is common, so the ladder
  // climbs to 100, and the no-bounce perfects to 20.)
  { family: "bounce", kind: "cleanPerfect", at: 20, name: "Desperado", what: "20 *perfects*, no bounce",
    tip: "Twenty *perfect* drops in a row and not one of them bounced. There is a poster with your face on it.",
    hint: "twenty *perfects* in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 100, name: "Supersonic", what: "100 drops, no bounce",
    tip: "A hundred drops in a row without a bounce. The walls have filed a complaint about being ignored.",
    hint: "a hundred drops in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 50, name: "Tornado", what: "50 drops, no bounce",
    tip: "Fifty drops in a row without a bounce. Things are getting picked up and put down very fast.",
    hint: "fifty drops in a row with no bounce" },
  { family: "bounce", kind: "cleanPerfect", at: 10, name: "Outlaw", what: "10 *perfects*, no bounce",
    tip: "Ten *perfect* drops in a row, every one tapped before the pumpkin bounced off a wall. Wanted in three counties.",
    hint: "ten *perfects* in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 30, name: "Wildfire", what: "30 drops, no bounce",
    tip: "Thirty drops in a row without a bounce. Spreading fast, no sign of stopping.",
    hint: "thirty drops in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 20, name: "Lightning", what: "20 drops, no bounce",
    tip: "Twenty drops in a row without a bounce. The pumpkins never saw the walls.",
    hint: "twenty drops in a row with no bounce" },
  { family: "bounce", kind: "cleanTiny", at: 3, name: "No Look", what: "3 tiny landings, no bounce",
    tip: "Three landings in a row on tiny pumpkins, with no wall bouncing. You were not even looking, were you?",
    hint: "three in a row on tiny pumpkins with no bounce" },
  { family: "bounce", kind: "cleanPerfect", at: 6, name: "Dead Eye", what: "6 *perfects*, no bounce",
    tip: "Six *perfect* drops in a row with no bounce. First pass, every time.",
    hint: "six *perfects* in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 10, name: "Gunslinger", what: "10 drops, no bounce",
    tip: "Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch.",
    hint: "ten drops in a row with no bounce" },
  { family: "bounce", kind: "cleanSmallPerfect", at: 3, name: "Trick Shot", what: "3 small *perfects*, no bounce",
    tip: "Three *perfect* drops in a row on small pumpkins, none of them bounced. Hold the applause.",
    hint: "three *perfects* on small pumpkins with no bounce" },
  { family: "bounce", kind: "cleanTiny", at: 1, name: "Blindfold", what: "a no-bounce landing",
    tip: "A landing on a tiny pumpkin, tapped before it bounced off a wall. Blindfolded, presumably.",
    hint: "land on a tiny pumpkin with no bounce" },
  { family: "bounce", kind: "cleanPerfect", at: 3, name: "Sharpshooter", what: "3 *perfects*, no bounce",
    tip: "Three *perfect* drops in a row, each with no bounce. Quick and right.",
    hint: "three *perfects* in a row with no bounce" },
  { family: "bounce", kind: "clean", at: 5, name: "Quick Draw", what: "5 drops, no bounce",
    tip: "Five drops in a row made before the pumpkin ever touched a wall. No dithering.",
    hint: "five drops in a row before the pumpkin touches a wall" },
];

// The end screen's three named slots, left to right.
const END_FAMILIES = ["accuracy", "growth", "bounce"];

// While the start screen waits, one quiet line under the title names
// a milestone to go for ("SHARP EYE: five perfects in a row"), fading to
// the next every few seconds (John's idea, 2026-10-16; first tried as the
// moon talking in a speech bubble, which "does not really work").
const HINT_FIRST_MS = 1200;   // the wait before the first line
const HINT_SHOW_MS = 3600;    // a line stays this long...
const HINT_GAP_MS = 500;      // ...and the next comes this long after it fades
const MILESTONE_MS = 1800;        // how long the banner stays
const MILESTONES_WAITING = 1;     // banners that may queue behind the one showing; older ones are dropped (John, 2026-10-17)
const SPARK_COUNT = 16;           // stars in one burst
const SPARK_COLOURS = ["#ffd34d", "#ffffff", "#fb9a48", "#5fbf8f", "#7fd4ff"];
const HOVER = SLAB_H * 1.8;     // how far above the tower the moving slab flies
const GRAVITY = 320;            // vw per second squared, for falling pieces
const CAMERA_LINE = 0.36;       // keep the tower top at this share of the stage height
                                // (0.42 until 2026-10-16: lowered so the flying slab
                                // stays under the milestone banner, which sits under
                                // the moon)
const END_DELAY_MS = 900;       // time to watch the miss before the end screen
const END_SCREEN_MS = 60000;    // the end screen gives way to the welcome screen after this long
                                // with no tap (John, 2026-10-17); any tap on it starts the wait over

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

// The big word that flashes at the miss: a band by count, a random pick
// from its words. From 5 pumpkins up it is just TIMBER! (John,
// 2026-10-17: "i like just TIMBER!"); the low bands keep their little
// words. On the end screen the title is the HEIGHT level's name instead
// (GIRAFFE, HAUNTED HOUSE); under 5 there is no level, so the miss word
// stays as the title. Short words only: the end screen shows them at 9vw.
const END_WORDS = [
  { from: 5, words: ["TIMBER!"] },
  { from: 1, words: ["SPLAT", "THUD", "OOF", "CRUNCH", "WELL THEN"] },
  { from: 0, words: ["WHIFF", "NOPE", "AIR BALL", "OOPS", "NOTHING"] },
];

// The italic line under the count on the end screen. From 5 pumpkins up
// it is the `line` of the HEIGHT level reached (John, 2026-10-17: the
// height milestone IS the comparison line). Below that, these four (the
// HARD set of 2026-10-16; EASY's kinder set went with the toggle). The
// last line whose count is not above the player's count is used.
const COMPARISONS = [
  [0, "The pumpkin patch remains undefeated."],
  [1, "One pumpkin. The patch is not impressed."],
  [2, "Taller than a cauldron. The cauldron is not worried."],
  [4, "Taller than a tombstone. Yours is being carved."],
];

/* ------------------------------------------------------------------------
   2. The page's parts and the game's state
   --------------------------------------------------------------------- */

const stage = document.getElementById("stage");
const tower = document.getElementById("tower");
const stars = document.getElementById("stars");
const moon = document.getElementById("moon");
const reaction = document.getElementById("reaction");
const reactionWord = document.getElementById("reactionWord");
const milestone = document.getElementById("milestone");
const milestoneName = document.getElementById("milestoneName");
const milestoneWhat = document.getElementById("milestoneWhat");
const endMilestones = document.getElementById("endMilestones");
const endMilestoneList = document.getElementById("endMilestoneList");
const milestoneTip = document.getElementById("milestoneTip");
const goalLine = document.getElementById("goalLine");
let hintTimer = 0;        // the goal line's show/hide timeout
let lastHint = null;      // so the same milestone is never named twice running
let endTimer = 0;         // the end screen's way back to the welcome screen
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const endWord = document.getElementById("endWord");
const endNumber = document.getElementById("endNumber");
const endNoun = document.getElementById("endNoun");
const endCompare = document.getElementById("endCompare");
const bestBox = document.getElementById("bestBox");
const bestLabel = document.getElementById("best");
const newBest = document.getElementById("newBest");   // the NEW HIGH SCORE! balloon

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
  cleanStreak: 0,      // drops in a row made before the slab touched a wall (no-bounce)
  smallStreak: 0,      // landings in a row on a slab <= half the starting width
  tinyStreak: 0,       // landings in a row on a slab <= a quarter of it
  pencilStreak: 0,     // landings in a row on a slab <= an eighth of it
  growthStreak: 0,     // WIDERs in a row (a clip resets it; a plain perfect leaves it)
  cleanPerfectStreak: 0,       // no-bounce perfects in a row
  cleanSmallPerfectStreak: 0,  // no-bounce perfects in a row on a small slab
  cleanTinyStreak: 0,          // no-bounce landings in a row on a tiny slab
  earned: [],          // MILESTONES entries earned this round, in order
  toCelebrate: [],     // earned but not yet shown (two can land on one drop)
  celebrating: false,  // is the banner up?
  best: 0,             // the high score: the app's top saved count at start-up, then this visit's best
  bestBefore: 0,       // the best when this round started
  newBest: false,      // this round beat an earlier best (so "Best" glows at the end)
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

/** Write `text` into `element`, with any words between asterisks in
    italics: "5 *perfects* in a row" (John, 2026-10-17: "perfect" in
    italics wherever it is shown). The asterisks are the only markup, so
    the words in MILESTONES stay plain strings. */
function fillMarked(element, text) {
  element.replaceChildren();
  appendMarked(element, text);
}

/** The same, added after what the element already holds. */
function appendMarked(element, text) {
  text.split("*").forEach((part, index) => {
    if (part === "") return;
    if (index % 2 === 1) {
      const italic = document.createElement("i");
      italic.textContent = part;
      element.appendChild(italic);
    } else {
      element.appendChild(document.createTextNode(part));
    }
  });
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
    (reading offsetWidth) forces it to restart the animation. (From
    2026-10-16 to 2026-10-17 the perfect and no-bounce streaks rode along
    as badges, a star "x3" and a bolt "x4"; John read the bolt's number
    as a second pumpkin count, so the word is on its own again. The
    milestones celebrate the streaks.) */
function showReaction(word, extraClass) {
  reactionWord.textContent = word;
  reaction.className = "reaction text-large text-on-art";
  if (extraClass) reaction.classList.add(extraClass);
  void reaction.offsetWidth;
  reaction.classList.add("is-shown");
}

/** After a drop that landed: has any milestone just been reached? The
    flags say what this particular drop was (a perfect on a ghost). Each
    milestone is earned once per round. Two earned on the same drop are
    celebrated one after the other, but no more than MILESTONES_WAITING
    may wait behind the banner that is showing: when a run of drops earns
    a pile at once, the older waiting ones are dropped and only the most
    recent is shown next (John, 2026-10-17: "a set of four or five showed
    when the pumpkin was just bouncing back and forth"). Everything earned
    still counts for the end screen. */
function checkMilestones(flags) {
  const counts = {
    perfect: state.streak,
    clean: state.cleanStreak,
    height: stackedCount(),
    ghost: flags.ghost ? 1 : 0,
    small: state.smallStreak,
    tiny: state.tinyStreak,
    pencil: state.pencilStreak,
    growth: state.growthStreak,
    cleanPerfect: state.cleanPerfectStreak,
    cleanSmallPerfect: state.cleanSmallPerfectStreak,
    cleanTiny: state.cleanTinyStreak,
  };
  MILESTONES.forEach((entry) => {
    if (state.earned.includes(entry)) return;
    if (counts[entry.kind] >= entry.at) {
      state.earned.push(entry);
      state.toCelebrate.push(entry);
    }
  });
  if (!state.celebrating) celebrateNext();
  // Keep only the newest of those still waiting; the rest expire unshown.
  if (state.toCelebrate.length > MILESTONES_WAITING) {
    state.toCelebrate = state.toCelebrate.slice(-MILESTONES_WAITING);
  }
}

/** Show the next waiting milestone: the banner pops in, stars burst, the
    moon goes wide-eyed. SOUND: the celebratory ding belongs here. */
function celebrateNext() {
  const entry = state.toCelebrate.shift();
  if (!entry) { state.celebrating = false; return; }
  state.celebrating = true;
  milestoneName.textContent = entry.name;
  fillMarked(milestoneWhat, entry.what);
  milestone.hidden = false;
  milestone.classList.remove("is-shown");
  void milestone.offsetWidth;
  milestone.classList.add("is-shown");
  burstStars();
  moonReacts("is-wow");
  setTimeout(() => {
    milestone.hidden = true;
    celebrateNext();
  }, MILESTONE_MS);
}

/** A ring of little stars that fly out from the banner, spin and fade,
    like a firework. Each gets its own direction and colour as CSS
    variables; the CSS animation does the flying. They remove themselves. */
function burstStars() {
  for (let i = 0; i < SPARK_COUNT; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    const angle = (Math.PI * 2 * i) / SPARK_COUNT + Math.random() * 0.4;
    const distance = 22 + Math.random() * 22;                       // vw
    spark.style.setProperty("--dx", Math.cos(angle) * distance + "vw");
    spark.style.setProperty("--dy", Math.sin(angle) * distance - 8 + "vw");
    spark.style.setProperty("--spin", Math.random() * 720 - 360 + "deg");
    spark.style.setProperty("--spark", SPARK_COLOURS[i % SPARK_COLOURS.length]);
    spark.style.animationDelay = Math.random() * 120 + "ms";
    spark.addEventListener("animationend", () => spark.remove());
    stage.appendChild(spark);
  }
}

/** The moon's face: is-happy, is-wow, is-meh or is-sad. */
function moonReacts(mood) {
  moon.className = "moon " + mood;
}

/** The moon's verdict on a whole round, for the end screen. Sad only for
    a poor one (John: "it really has to be a bad performance"); a TIMBER!
    round leaves it wide-eyed. */
function moodForCount(count) {
  if (count >= 20) return "is-wow";
  if (count >= 10) return "is-happy";
  if (count >= 4) return "is-meh";
  return "is-sad";
}

/** Slide the view so the tower top stays around CAMERA_LINE. The tower
    container moves DOWN by `camera`, which shows a higher part of the
    world. The stars move less, for a little depth. The moon does not
    move at all: it is in the same spot during play, on the start screen
    and on the end screen, "an anchor point of the game design" (John,
    2026-10-16; it drifted down at 0.12x the camera before, which put it
    in a different place on every end screen). */
function moveCamera(dt) {
  const target = Math.max(0, towerTop() - stageHeight() * CAMERA_LINE);
  // Ease towards the target: cover a share of the remaining distance each
  // frame, so the view glides instead of jumping.
  state.camera += (target - state.camera) * Math.min(1, dt * 6);
  tower.style.transform = "translateY(" + state.camera + "vw)";
  stars.style.transform = "translateY(" + state.camera * 0.25 + "vw)";
}

/** Start the goal line cycling (the start screen). */
function startHints() {
  stopHints();
  hintTimer = setTimeout(showHint, HINT_FIRST_MS);
}

/** Stop it, at once (a round starts). */
function stopHints() {
  clearTimeout(hintTimer);
  goalLine.classList.remove("is-shown");
}

/** One line: a random milestone's name and what it takes, faded in,
    held, faded out, then the next. */
function showHint() {
  const choices = MILESTONES.filter((entry) => entry !== lastHint);
  const entry = choices[Math.floor(Math.random() * choices.length)];
  lastHint = entry;
  goalLine.replaceChildren();
  const name = document.createElement("b");
  name.textContent = entry.name.toUpperCase();
  goalLine.appendChild(name);
  appendMarked(goalLine, ": " + entry.hint);
  goalLine.classList.add("is-shown");
  hintTimer = setTimeout(() => {
    goalLine.classList.remove("is-shown");
    hintTimer = setTimeout(showHint, HINT_GAP_MS);
  }, HINT_SHOW_MS);
}

/** Keep "Best" in the bar up to date. (The running count is not in the
    bar any more: it pops off each landed pumpkin, see popCount.) A round
    that passes an earlier best is remembered, so the end screen can make
    the number glow; the first round of a visit sets the best without
    beating one, so no glow then. */
function updateLabels() {
  const count = stackedCount();
  if (count > state.best) state.best = count;
  if (state.bestBefore > 0 && count > state.bestBefore) state.newBest = true;
  bestLabel.textContent = state.best;
}

/** The best milestone of one family earned this round: the first entry
    of that family in MILESTONES (the list is rarest first) that was
    earned, or undefined when none was. */
function bestEarned(family) {
  return MILESTONES.find((entry) => entry.family === family && state.earned.includes(entry));
}

/** Where 1 to 3 names go in the "You earned" space, as centres across
    the screen (vw from the left edge), by how many there are. John
    (2026-10-17): one in the middle, two at a third and two thirds, three
    spread across, STEPPING DOWN TO THE RIGHT like a staircase: the left
    name at the top left, the middle one in the middle, the right one at
    the bottom right, each word still slanting up on its own (so three
    short slanted lines, not one long one). The steps fall at the words'
    own 15 degrees; fillMilestoneRow works the height out from that.
    (Three at a third, a half and two thirds, John's first thought, put
    the long names on top of each other: 17vw apart, 25vw wide.) */
const ROW_PLACES = [
  [],               // 0: the block is hidden
  [50],             // 1
  [33.3, 66.7],     // 2
  [26, 50, 74],     // 3 (John: "compress ... a bit"; it was 21 / 79)
];
const ROW_SLANT = Math.tan((15 * Math.PI) / 180);   // drop per vw across: the staircase's 15 degrees

/** Fill the space: a chip per name at its place on the slanted line, in
    the order given (END_FAMILIES: accuracy, growth, bounce). The CSS
    centres each chip on the point (translate -50%, -50%). */
function fillMilestoneRow(entries) {
  endMilestoneList.replaceChildren();
  const places = ROW_PLACES[entries.length];
  entries.forEach((entry, index) => {
    const chip = makeChip(entry);
    const x = places[index];
    chip.style.left = x + "vw";
    // The staircase falls to the right: left of centre is lifted (a
    // negative offset) and right of centre pushed down.
    chip.style.top = "calc(50% + " + ((x - 50) * ROW_SLANT).toFixed(2) + "vw)";
    endMilestoneList.appendChild(chip);
  });
}

/** A chip for the end screen: the milestone's name; a tap toggles its
    bubble, a mouse hovering shows it (pointerType tells a finger from a
    mouse, and a finger's tap must not show-then-hide). */
function makeChip(entry) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "milestone-chip";
  // The name sits in its own span, so showTip can measure the word
  // rather than the finger-sized button around it.
  const word = document.createElement("span");
  word.className = "milestone-word";
  word.textContent = entry.name;
  chip.appendChild(word);
  chip.dataset.tip = entry.tip;
  chip.addEventListener("click", () => {
    if (chip.classList.contains("is-open")) hideTip(); else showTip(chip);
  });
  chip.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") showTip(chip); });
  chip.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") hideTip(); });
  return chip;
}

/** The bubble above a chip: the milestone's `tip`. Placed in px from the
    word's and the end screen's rectangles, kept inside the screen's
    width, just above the letters (John, 2026-10-17: "a bit closer").
    A slanted word's rectangle is the box around the slant: its top is
    the raised right-hand end, and the middle of the word sits lower by
    half of (the word's width x sin 15 degrees). The bubble is put that
    much further down, so it hangs over the middle of the word. */
function showTip(chip) {
  hideTip();
  fillMarked(milestoneTip, chip.dataset.tip);
  milestoneTip.hidden = false;
  const screen = endScreen.getBoundingClientRect();
  const word = chip.firstElementChild;
  const box = word.getBoundingClientRect();
  const margin = 8;
  const gap = 4;                                           // px between the bubble and the letters
  const slantDrop = (word.offsetWidth * Math.sin((15 * Math.PI) / 180)) / 2;   // offsetWidth is unrotated
  let left = box.left + box.width / 2 - screen.left - milestoneTip.offsetWidth / 2;
  left = Math.max(margin, Math.min(left, screen.width - milestoneTip.offsetWidth - margin));
  milestoneTip.style.left = left + "px";
  milestoneTip.style.top = (box.top - screen.top + slantDrop - milestoneTip.offsetHeight - gap) + "px";
  chip.classList.add("is-open");
}

function hideTip() {
  milestoneTip.hidden = true;
  endMilestoneList.querySelectorAll(".is-open").forEach((chip) => chip.classList.remove("is-open"));
}

// A tap anywhere else on the end screen closes the bubble. Any tap on the
// end screen also starts its minute over (see armEndTimer).
endScreen.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".milestone-chip")) hideTip();
  armEndTimer();
});

/** Start (or start over) the end screen's wait: after END_SCREEN_MS with
    no tap on it, the welcome screen comes back. */
function armEndTimer() {
  clearTimeout(endTimer);
  endTimer = setTimeout(backToStart, END_SCREEN_MS);
}

/** The end screen has sat untouched for a minute: back to the welcome
    screen, as the page first loads. The high score stays; the glow and
    the balloon were for the round just ended, so they go. */
function backToStart() {
  if (state.phase !== "over") return;
  clearTimeout(endTimer);
  hideTip();
  bestBox.classList.remove("is-new-best");
  newBest.hidden = true;
  reset();                        // a fresh base on the ground; the moon smiles
  state.phase = "ready";
  endScreen.hidden = true;
  startScreen.hidden = false;     // the stage keeps its glow: both screens have it
  startHints();
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
  // `bounced` turns true the first time it reaches a wall; a drop made
  // before that counts towards the no-bounce streak.
  state.mover = { element, x, width: top.width, direction: fromLeft ? 1 : -1, speed, bounced: false };
}

/** Slide the mover back and forth. It turns around when it is a bit past
    the stage's edge, so it is never out of sight for long. */
function moveMover(dt) {
  const mover = state.mover;
  mover.x += mover.direction * mover.speed * dt;
  const leftLimit = -mover.width * 0.35;
  const rightLimit = 100 - mover.width * 0.65;
  // A bounce is only a bounce when the slab was heading INTO that wall: a
  // new slab starts beyond the limit and is pulled to it on its first
  // frame, and that must not count (it broke the no-bounce streak once).
  if (mover.x < leftLimit) { mover.x = leftLimit; if (mover.direction < 0) mover.bounced = true; mover.direction = 1; }
  if (mover.x > rightLimit) { mover.x = rightLimit; if (mover.direction > 0) mover.bounced = true; mover.direction = -1; }
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
  const clean = !mover.bounced;                 // dropped before it ever touched a wall
  const isGhost = state.slabs.length % 7 === 6; // the mover's own colour (see toneFor)
  const small = mover.width <= START_WIDTH / 2; // the slab being landed, before any clip
  const tiny = mover.width <= START_WIDTH / 4;
  const pencil = mover.width <= START_WIDTH / 8;
  state.mover = null;

  // Perfect: the edges match within the tolerance. Snap it into line.
  if (Math.abs(mover.x - top.x) <= PERFECT_TOLERANCE) {
    state.streak += 1;
    state.cleanStreak = clean ? state.cleanStreak + 1 : 0;
    state.smallStreak = small ? state.smallStreak + 1 : 0;
    state.tinyStreak = tiny ? state.tinyStreak + 1 : 0;
    state.pencilStreak = pencil ? state.pencilStreak + 1 : 0;
    state.cleanPerfectStreak = clean ? state.cleanPerfectStreak + 1 : 0;
    state.cleanSmallPerfectStreak = clean && small ? state.cleanSmallPerfectStreak + 1 : 0;
    state.cleanTinyStreak = clean && tiny ? state.cleanTinyStreak + 1 : 0;
    let x = top.x;
    let width = top.width;
    let word = "PERFECT!";
    if (state.streak % PERFECT_STREAK === 0 && width < START_WIDTH) {
      // The reward for a streak: the slab grows back, evenly on both sides.
      const grownWidth = Math.min(START_WIDTH, width + BONUS_WIDTH);
      x -= (grownWidth - width) / 2;
      width = grownWidth;
      word = "WIDER!";
      state.growthStreak += 1;   // a plain perfect leaves it; a clip resets it
    }
    settle(mover.element, x, width, landing);
    showReaction(word, "is-perfect");
    moonReacts("is-wow");
    checkMilestones({ ghost: isGhost });
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
  state.cleanStreak = clean ? state.cleanStreak + 1 : 0;
  state.smallStreak = small ? state.smallStreak + 1 : 0;
  state.tinyStreak = tiny ? state.tinyStreak + 1 : 0;
  state.pencilStreak = pencil ? state.pencilStreak + 1 : 0;
  state.growthStreak = 0;
  state.cleanPerfectStreak = 0;          // a clip is not a perfect
  state.cleanSmallPerfectStreak = 0;
  state.cleanTinyStreak = clean && tiny ? state.cleanTinyStreak + 1 : 0;   // any landing counts here
  settle(mover.element, left, overlap, landing);

  const kept = overlap / mover.width;
  const feeling = REACTIONS.find((entry) => kept >= entry.atLeast);
  showReaction(feeling.word);
  moonReacts(feeling.moon);
  checkMilestones({});
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
  popCount(x, width, bottom);
  spawnMover();
}

/** The count pops off the slab just landed: "12" on top of it, flying
    up and fading (John: "a # STACKED badge ... a number that counts the
    stacked pumpkins, and quickly gets out of the way"). It goes in the
    tower at the slab's own world position, so the camera carries it,
    and it removes itself when its animation ends. */
function popCount(x, width, bottom) {
  const pop = document.createElement("div");
  pop.className = "count-pop";
  pop.textContent = stackedCount();
  pop.style.left = x + width / 2 + "vw";      // centred on the slab (the CSS translates -50%)
  pop.style.bottom = bottom + SLAB_H + "vw";  // sitting on its top edge
  pop.addEventListener("animationend", () => pop.remove());
  tower.appendChild(pop);
}

/* ------------------------------------------------------------------------
   6. Starting, ending, the frame loop and the taps
   --------------------------------------------------------------------- */

/** Clear the tower and put the base slab on the ground. */
function reset() {
  state.bestBefore = state.best;
  state.newBest = false;
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
  state.cleanStreak = 0;
  state.smallStreak = 0;
  state.tinyStreak = 0;
  state.pencilStreak = 0;
  state.growthStreak = 0;
  state.cleanPerfectStreak = 0;
  state.cleanSmallPerfectStreak = 0;
  state.cleanTinyStreak = 0;
  state.earned = [];
  state.toCelebrate = [];
  state.celebrating = false;
  milestone.hidden = true;
  stage.querySelectorAll(".spark").forEach((spark) => spark.remove());
  moveCamera(1);
  const baseX = (100 - START_WIDTH) / 2;
  const base = makeSlabElement(baseX, GROUND_H, START_WIDTH, toneFor(0));
  placeSlab(base, baseX, START_WIDTH);
  updateLabels();
  moonReacts("is-happy");
}

function start() {
  clearTimeout(endTimer);         // Stack again beat the end screen's minute
  reset();
  stopHints();
  bestBox.classList.remove("is-new-best");   // the glow was for the last round only
  newBest.hidden = true;                     // ...and so was the balloon
  stage.classList.remove("is-glowing");      // the moon's start/end-screen glow goes
  state.phase = "playing";
  startScreen.hidden = true;
  endScreen.hidden = true;
  spawnMover();
}

/** The end word for a count: the first band the count reaches, then a
    random one of its words. */
function endWordFor(count) {
  const band = END_WORDS.find((entry) => count >= entry.from);
  return band.words[Math.floor(Math.random() * band.words.length)];
}

function gameOver() {
  state.phase = "over";
  const count = stackedCount();
  const word = endWordFor(count);
  // A celebration still running (a milestone on the last good drop) would
  // show through the end screen: cut it; the chip below tells the story.
  state.toCelebrate = [];
  milestone.hidden = true;
  stage.querySelectorAll(".spark").forEach((spark) => spark.remove());
  moonReacts("is-sad");
  showReaction(word, "is-miss");

  // The title is the level reached (GIRAFFE), its line under the count;
  // under 5 pumpkins there is no level, so the miss word is the title and
  // the line is one of the four old ones.
  const level = bestEarned("height");
  endWord.textContent = level ? level.name.toUpperCase() : word;
  endNumber.textContent = count;                        // "You stacked / 23 / pumpkins!"
  endNoun.textContent = count === 1 ? "pumpkin!" : "pumpkins!";
  if (level) {
    fillMarked(endCompare, level.line);
  } else {
    const line = COMPARISONS.filter((entry) => entry[0] <= count).pop();
    endCompare.textContent = line[1];
  }
  // "You earned": the best accuracy, growth and bounce milestone of the
  // round, up to three names in a row. The block is hidden when there
  // were none.
  const shown = END_FAMILIES.map(bestEarned).filter(Boolean);
  endMilestones.hidden = shown.length === 0;
  fillMilestoneRow(shown);
  hideTip();

  // Tell the app, which keeps this game's five best counts and shows them
  // in the THIS GAME tab (games/game-helper.js). A count of 0 is ignored.
  // The level's name rides along as the note, so the list reads
  // "16 (10-17-2026) Giraffe" (John, 2026-10-17; it was the mode, "easy"
  // or "hard", for a day, and scores saved then keep that note). Under 5
  // there is no level and no note.
  Halloween.reportScore(count, undefined, level ? [level.name] : undefined);

  // Let the miss play out (the moon winces at it) before the end screen
  // covers it. Then the moon gives its verdict on the round, with a
  // softer glow around it, and a new high score gets its balloon.
  setTimeout(() => {
    endScreen.hidden = false;
    stage.classList.add("is-glowing");
    armEndTimer();                             // untouched for a minute, it gives way to the welcome screen
    moonReacts(moodForCount(count));
    if (state.newBest) {
      bestBox.classList.add("is-new-best");   // the number glows until the next start
      newBest.hidden = false;                 // NEW HIGH SCORE! under it
    }
  }, END_DELAY_MS);
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

/* ------------------------------------------------------------------------
   7. Wiring up and starting
   --------------------------------------------------------------------- */

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

// The high score starts from the app's list, not from 0, so the corner
// and the THIS GAME tab agree (John, 2026-10-17); outside the app it is
// 0. When the app's list is cleared, the app loads this page again, so
// the corner starts over too.
state.best = Halloween.bestScore();
reset();
startHints();                   // the goal line cycles while the start screen waits
requestAnimationFrame(frame);
