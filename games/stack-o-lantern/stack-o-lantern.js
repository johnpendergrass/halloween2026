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
const MAX_SPEED = 110;

// EASY or HARD, the player's choice on the toggle in the info bar. HARD is
// the game as first built. EASY is the same game at the start, while the
// slabs are wide and slow, and grows forgiving as the tower climbs: the
// distance that still counts as perfect widens with the count until, at
// rampCount pumpkins, it is PERFECT_TOLERANCE + extraTolerance. The speed
// also climbs a little more gently. (John, 2026-10-16: a flat wider
// tolerance was "too easy"; the main difference should be the precision
// required to drop.) A switch takes effect at once, even mid-round.
const MODES = {
  hard: {
    extraTolerance: 0,
    rampCount: 1,
    speedGrowth: 1.035,       // speed is multiplied by this for every slab placed
    note: "HARD mode: line the edges up within a hair.",
  },
  easy: {
    extraTolerance: 1.6,      // twice as forgiving as HARD once the ramp is done
    rampCount: 20,            // ...which takes this many pumpkins
    speedGrowth: 1.03,
    note: "EASY mode: forgiving once the tower gets going.",
  },
};
const DEFAULT_MODE = "hard";

// Milestones: little achievements inside one round (John, 2026-10-16).
// `kind` names the counter that earns it and `at` the count: "perfect" =
// perfect drops in a row (a bounce does not break it), "clean" = drops in
// a row made before the slab touched a wall, "height" = pumpkins stacked,
// "ghost" = a perfect drop on a ghost pumpkin, "comeback" = a WIDER after
// the slab had shrunk below half its starting width, "small" = landings
// in a row on a slab half the starting width or less, "tiny" = the same
// at a quarter or less, "pencil" = the same at an eighth or less (the
// "pencil pumpkin", about a fingernail wide on a phone), "growth" =
// WIDERs in a row with no clip between them (John's classes,
// 2026-10-16). Each is earned once
// per round, celebrated with a banner and a burst of stars, and listed on
// the end screen. Nothing is remembered between rounds: it is a game, not
// a trophy cabinet. The celebration is also where a sound will go.
// `what` is the banner's short line; `tip` is the fuller story in the end
// screen's bubble (John: "you have a lot of room ... to actually describe
// the milestone").
const MILESTONES = [
  { kind: "perfect", at: 5, name: "Sharp Eye", what: "5 perfects in a row",
    tip: "Five perfect drops in a row. Every edge lined up within a hair.",
    hint: "five perfects in a row" },
  { kind: "perfect", at: 10, name: "Laser", what: "10 perfects in a row",
    tip: "Ten perfect drops in a row. The moon stopped blinking somewhere around seven.",
    hint: "ten perfects in a row" },
  { kind: "perfect", at: 20, name: "Machine", what: "20 perfects in a row",
    tip: "Twenty perfect drops in a row. Are you even a person?",
    hint: "twenty perfects in a row" },
  { kind: "clean", at: 5, name: "Quick Draw", what: "5 drops, no bounce",
    tip: "Five drops in a row made before the pumpkin ever touched a wall. No dithering.",
    hint: "five drops in a row before the pumpkin touches a wall" },
  { kind: "clean", at: 10, name: "Gunslinger", what: "10 drops, no bounce",
    tip: "Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch.",
    hint: "ten drops in a row with no bounce" },
  { kind: "clean", at: 20, name: "Lightning", what: "20 drops, no bounce",
    tip: "Twenty drops in a row without a bounce. The pumpkins never saw the walls.",
    hint: "twenty drops in a row with no bounce" },
  { kind: "height", at: 10, name: "Hoop Height", what: "10 pumpkins high",
    tip: "Ten pumpkins high, which is about the height of a basketball hoop.",
    hint: "ten pumpkins high" },
  { kind: "height", at: 25, name: "Haunted House", what: "25 pumpkins high",
    tip: "Twenty-five pumpkins high, two storeys of haunted house. The ghosts are looking down at you.",
    hint: "twenty-five pumpkins high" },
  { kind: "height", at: 50, name: "Skyscraper", what: "50 pumpkins high",
    tip: "Fifty pumpkins high. The stars are getting closer.",
    hint: "fifty pumpkins high" },
  { kind: "ghost", at: 1, name: "Ghost Whisperer", what: "a perfect on a ghost pumpkin",
    tip: "A perfect drop on a ghost pumpkin, the pale one. When does it come? Watch.",
    hint: "a perfect drop on the pale ghost pumpkin" },
  { kind: "comeback", at: 1, name: "Comeback", what: "grew back from under half width",
    tip: "The tower had shrunk to less than half its width, and three perfects in a row grew it back. Never give up.",
    hint: "three perfects in a row after shrinking below half width" },
  { kind: "small", at: 5, name: "Tightrope", what: "5 in a row on a half-size slab",
    tip: "Five landings in a row on a slab no more than half the starting width. Steady.",
    hint: "five in a row on a slab half size or smaller" },
  { kind: "small", at: 10, name: "High Wire", what: "10 in a row on a half-size slab",
    tip: "Ten landings in a row on a slab no more than half the starting width. No net.",
    hint: "ten in a row on a slab half size or smaller" },
  { kind: "tiny", at: 3, name: "Needle", what: "3 in a row on a quarter-size slab",
    tip: "Three landings in a row on a slab a quarter of the starting width or less. Threading it.",
    hint: "three in a row on a slab a quarter size or smaller" },
  { kind: "tiny", at: 6, name: "Eye of the Needle", what: "6 in a row on a quarter-size slab",
    tip: "Six landings in a row on a slab a quarter of the starting width or less. How?",
    hint: "six in a row on a slab a quarter size or smaller" },
  { kind: "pencil", at: 1, name: "Pencil Pusher", what: "landed on a pencil pumpkin",
    tip: "A landing on a pencil pumpkin, a slab an eighth of the starting width or less. Stacking those is hard.",
    hint: "land one on a pencil-thin pumpkin" },
  { kind: "pencil", at: 3, name: "Toothpick", what: "3 in a row on a pencil pumpkin",
    tip: "Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you?",
    hint: "three in a row on pencil-thin pumpkins" },
  { kind: "growth", at: 2, name: "Green Thumb", what: "2 WIDERs with no clip between",
    tip: "Two WIDER growths in a row without a clipped drop in between. The pumpkin is coming back.",
    hint: "two WIDERs in a row with no clip between them" },
  { kind: "growth", at: 3, name: "Pumpkin Farmer", what: "3 WIDERs with no clip between",
    tip: "Three WIDER growths in a row without a clipped drop in between. That is nine perfects.",
    hint: "three WIDERs in a row with no clip between them" },
];

// While the start screen waits, one quiet line under the title names
// a milestone to go for ("SHARP EYE: five perfects in a row"), fading to
// the next every few seconds (John's idea, 2026-10-16; first tried as the
// moon talking in a speech bubble, which "does not really work").
const HINT_FIRST_MS = 1200;   // the wait before the first line
const HINT_SHOW_MS = 3600;    // a line stays this long...
const HINT_GAP_MS = 500;      // ...and the next comes this long after it fades
const MILESTONE_MS = 1800;        // how long the banner stays
const MODE_HINT_MS = 2500;        // a mid-round tap on the toggle shows the reminder this long
const SPARK_COUNT = 16;           // stars in one burst
const SPARK_COLOURS = ["#ffd34d", "#ffffff", "#fb9a48", "#5fbf8f", "#7fd4ff"];
const BADGE_FROM = { perfect: 2, clean: 3 };   // a streak badge shows from this count
// The game's own note on this device (rule 21: a key that starts with
// "halloween2026:stack-o-lantern:"). It holds "easy" or "hard".
const MODE_KEY = "halloween2026:stack-o-lantern:mode";
const HOVER = SLAB_H * 1.8;     // how far above the tower the moving slab flies
const GRAVITY = 320;            // vw per second squared, for falling pieces
const CAMERA_LINE = 0.36;       // keep the tower top at this share of the stage height
                                // (0.42 until 2026-10-16: lowered so the flying slab
                                // stays under the milestone banner, which sits under
                                // the moon)
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

// The big word at the miss and on the end screen: a band by count, a
// random pick from its five (John, 2026-10-16: "players love that sort of
// thing"; it was WHIFF / SPLAT / TIMBER before). Short words only: the
// end screen shows them at 9vw.
const END_WORDS = [
  { from: 35, words: ["UNREAL", "GO OUTSIDE", "PUMPKIN GOD", "WHAT?!", "STARSTRUCK"] },
  { from: 20, words: ["TIMBER!!", "SKY HIGH!", "MONSTER!", "LEGENDARY", "BIG TIMBER!"] },
  { from: 11, words: ["TIMBER!", "LOOK OUT!", "AVALANCHE!", "A TOWER", "RESPECT"] },
  { from: 6,  words: ["TUMBLE!", "KERPLUNK!", "WOBBLE", "SO CLOSE", "IT'S DOWN"] },
  { from: 1,  words: ["SPLAT", "THUD", "OOF", "CRUNCH", "WELL THEN"] },
  { from: 0,  words: ["WHIFF", "NOPE", "AIR BALL", "OOPS", "NOTHING"] },
];

// The end screen turns the count into a height. A pumpkin slab is about
// 30 cm tall, so 10 slabs = 3 m = a basketball hoop. The last line whose
// count is not above the player's count is used. Each mode has its own
// set, the same heights: EASY's lines are kind, HARD's have an edge
// (John, 2026-10-16). A round that used EASY at any point gets EASY's.
const COMPARISONS = {
  easy: [
    [0,   "The pumpkin patch remains undefeated. For now."],
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
  ],
  hard: [
    [0,   "The pumpkin patch remains undefeated."],
    [1,   "One pumpkin. The patch is not impressed."],
    [2,   "Taller than a cauldron. The cauldron is not worried."],
    [4,   "Taller than a tombstone. Yours is being carved."],
    [6,   "Taller than a grown-up. A short one."],
    [8,   "Taller than a door. The door would like a word."],
    [10,  "Taller than a basketball hoop. Still no swish."],
    [12,  "Taller than an elephant. It has already forgotten you."],
    [18,  "Taller than a giraffe. It looked down on you anyway."],
    [25,  "Two storeys of haunted house. The ghosts are mildly curious."],
    [34,  "Taller than a telephone pole. Nobody is calling."],
    [45,  "A school bus on end. Now that is a traffic hazard."],
    [60,  "Five storeys. The moon is pretending not to look."],
    [80,  "A blue whale on its tail. Fine. That was good."],
    [100, "Twice the Hollywood sign. The moon admits it is impressed."],
    [150, "Statue of Liberty tall. The moon is taking notes."],
    [200, "Taller than the Leaning Tower. Yours leans less."],
    [320, "Taller than Big Ben. Please go outside. Seriously."],
  ],
};

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
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const endWord = document.getElementById("endWord");
const endNumber = document.getElementById("endNumber");
const endNoun = document.getElementById("endNoun");
const endCompare = document.getElementById("endCompare");
const bestBox = document.getElementById("bestBox");
const bestLabel = document.getElementById("best");
const modeSwitch = document.getElementById("modeSwitch");
const modeHint = document.getElementById("modeHint");
let modeHintTimer = 0;   // the mid-round reminder's timeout, so a second tap restarts it

// Everything that changes while playing lives here, so it is easy to see
// (and to reset). Coordinates are "world" coordinates: x from the left
// edge, y up from the stage's bottom edge, both in vw. The camera only
// changes how the world is shown, never the numbers in it.
const state = {
  phase: "ready",      // "ready" (start screen), "playing", or "over"
  modeName: "hard",    // the toggle's position: "easy" or "hard"
  rules: MODES.hard,   // the MODES entry in force (changes at once on the toggle)
  usedEasy: false,     // was EASY on at any point in this round? (end lines, score note)
  slabs: [],           // placed slabs, bottom first: { element, x, width }
  mover: null,         // the sliding slab: { element, x, width, direction, speed }
  pieces: [],          // falling bits: { element, x, y, vx, vy, angle, spin }
  camera: 0,           // how far up the world the view has scrolled
  streak: 0,           // perfect drops in a row
  cleanStreak: 0,      // drops in a row made before the slab touched a wall
  smallStreak: 0,      // landings in a row on a slab <= half the starting width
  tinyStreak: 0,       // landings in a row on a slab <= a quarter of it
  pencilStreak: 0,     // landings in a row on a slab <= an eighth of it
  growthStreak: 0,     // WIDERs in a row with no clipped drop between them
  earned: [],          // MILESTONES entries earned this round, in order
  toCelebrate: [],     // earned but not yet shown (two can land on one drop)
  celebrating: false,  // is the banner up?
  best: 0,             // best count this visit (the app keeps the lasting list)
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

/** How far off a drop may be and still count as perfect, right now. HARD
    is always PERFECT_TOLERANCE. EASY starts there and adds its extra
    gradually, in proportion to the count, until rampCount pumpkins. */
function perfectTolerance() {
  const ramp = Math.min(1, stackedCount() / state.rules.rampCount);
  return PERFECT_TOLERANCE + state.rules.extraTolerance * ramp;
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
    (reading offsetWidth) forces it to restart the animation. The current
    streaks ride along as badges: a gold star "x3" for perfects in a row,
    a blue bolt "x4" for drops without a bounce (John: the old "PERFECT
    x3" text was not obvious enough as a player). */
function showReaction(word, extraClass) {
  reactionWord.textContent = word;
  reaction.querySelectorAll(".badge").forEach((badge) => badge.remove());
  if (state.streak >= BADGE_FROM.perfect) reaction.appendChild(makeBadge("star", state.streak));
  if (state.cleanStreak >= BADGE_FROM.clean) reaction.appendChild(makeBadge("bolt", state.cleanStreak));
  reaction.className = "reaction text-large text-on-art";
  if (extraClass) reaction.classList.add(extraClass);
  void reaction.offsetWidth;
  reaction.classList.add("is-shown");
}

/** A badge for the reaction line: a shape (star or bolt, drawn by the
    CSS) and "xN" after it. */
function makeBadge(shape, count) {
  const badge = document.createElement("span");
  badge.className = "badge badge-" + shape;
  const icon = document.createElement("span");
  icon.className = "badge-icon";
  badge.appendChild(icon);
  badge.appendChild(document.createTextNode("\u00d7" + count));
  return badge;
}

/** After a drop that landed: has any milestone just been reached? The
    flags say what this particular drop was (a perfect on a ghost, a
    comeback). Each milestone is earned once per round; two earned on the
    same drop are celebrated one after the other. */
function checkMilestones(flags) {
  const counts = {
    perfect: state.streak,
    clean: state.cleanStreak,
    height: stackedCount(),
    ghost: flags.ghost ? 1 : 0,
    comeback: flags.comeback ? 1 : 0,
    small: state.smallStreak,
    tiny: state.tinyStreak,
    pencil: state.pencilStreak,
    growth: state.growthStreak,
  };
  MILESTONES.forEach((entry) => {
    if (state.earned.includes(entry)) return;
    if (counts[entry.kind] >= entry.at) {
      state.earned.push(entry);
      state.toCelebrate.push(entry);
    }
  });
  if (!state.celebrating) celebrateNext();
}

/** Show the next waiting milestone: the banner pops in, stars burst, the
    moon goes wide-eyed. SOUND: the celebratory ding belongs here. */
function celebrateNext() {
  const entry = state.toCelebrate.shift();
  if (!entry) { state.celebrating = false; return; }
  state.celebrating = true;
  milestoneName.textContent = entry.name;
  milestoneWhat.textContent = entry.what;
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
  goalLine.appendChild(document.createTextNode(": " + entry.hint));
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

/** Of the milestones earned, the highest `at` of each kind. The list
    keeps the order in which each kind was first earned. */
function topMilestones(earned) {
  const best = [];
  earned.forEach((entry) => {
    const index = best.findIndex((kept) => kept.kind === entry.kind);
    if (index === -1) best.push(entry);
    else if (entry.at > best[index].at) best[index] = entry;
  });
  return best;
}

/** Where 1 to 9 names go on the end screen's 3x3 grid, as nine cells
    read left to right, top to bottom (1 = a name goes here). John's
    table (2026-10-16): one name sits in the middle, two take the top and
    bottom of the middle column, three run the diagonal, four the
    corners... so the names always land in the same tidy places. More
    than nine (impossible today: nine kinds) would show the first nine. */
const GRID_PATTERNS = [
  "",           // 0: the block is hidden
  "000010000",  // 1
  "010000010",  // 2
  "100010001",  // 3
  "110000011",  // 4
  "101010101",  // 5
  "110110011",  // 6
  "110111011",  // 7
  "111101111",  // 8
  "111111111",  // 9
];

/** Fill the grid: a cell for each digit of the pattern, a chip in the
    cells marked 1, in the order the milestones were given. */
function fillMilestoneGrid(entries) {
  endMilestoneList.replaceChildren();
  const shown = entries.slice(0, 9);
  let next = 0;
  for (const place of GRID_PATTERNS[shown.length]) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    if (place === "1") cell.appendChild(makeChip(shown[next++]));
    endMilestoneList.appendChild(cell);
  }
}

/** A chip for the end screen: the milestone's name; a tap toggles its
    bubble, a mouse hovering shows it (pointerType tells a finger from a
    mouse, and a finger's tap must not show-then-hide). */
function makeChip(entry) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "milestone-chip";
  chip.textContent = entry.name;
  chip.dataset.tip = entry.tip;
  chip.addEventListener("click", () => {
    if (chip.classList.contains("is-open")) hideTip(); else showTip(chip);
  });
  chip.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") showTip(chip); });
  chip.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") hideTip(); });
  return chip;
}

/** The bubble above a chip: the milestone's `tip`. Placed in px from the
    chip's and the end screen's rectangles, kept inside the screen's
    width. */
function showTip(chip) {
  hideTip();
  milestoneTip.textContent = chip.dataset.tip;
  milestoneTip.hidden = false;
  const screen = endScreen.getBoundingClientRect();
  const box = chip.getBoundingClientRect();
  const margin = 8;
  let left = box.left + box.width / 2 - screen.left - milestoneTip.offsetWidth / 2;
  left = Math.max(margin, Math.min(left, screen.width - milestoneTip.offsetWidth - margin));
  milestoneTip.style.left = left + "px";
  milestoneTip.style.top = (box.top - screen.top - milestoneTip.offsetHeight - margin) + "px";
  chip.classList.add("is-open");
}

function hideTip() {
  milestoneTip.hidden = true;
  endMilestoneList.querySelectorAll(".is-open").forEach((chip) => chip.classList.remove("is-open"));
}

// A tap anywhere else on the end screen closes the bubble.
endScreen.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".milestone-chip")) hideTip();
});

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
  const speed = Math.min(MAX_SPEED, START_SPEED * Math.pow(state.rules.speedGrowth, state.slabs.length - 1));
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
  if (Math.abs(mover.x - top.x) <= perfectTolerance()) {
    state.streak += 1;
    state.cleanStreak = clean ? state.cleanStreak + 1 : 0;
    state.smallStreak = small ? state.smallStreak + 1 : 0;
    state.tinyStreak = tiny ? state.tinyStreak + 1 : 0;
    state.pencilStreak = pencil ? state.pencilStreak + 1 : 0;
    let x = top.x;
    let width = top.width;
    let word = "PERFECT!";
    let comeback = false;
    if (state.streak % PERFECT_STREAK === 0 && width < START_WIDTH) {
      // The reward for a streak: the slab grows back, evenly on both sides.
      comeback = width < START_WIDTH / 2;
      const grownWidth = Math.min(START_WIDTH, width + BONUS_WIDTH);
      x -= (grownWidth - width) / 2;
      width = grownWidth;
      word = "WIDER!";
      state.growthStreak += 1;   // a plain perfect leaves it; a clip resets it
    }
    settle(mover.element, x, width, landing);
    showReaction(word, "is-perfect");
    moonReacts("is-wow");
    checkMilestones({ ghost: isGhost, comeback });
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
  state.usedEasy = state.modeName === "easy";
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
  reset();
  hideModeHint();
  stopHints();
  bestBox.classList.remove("is-new-best");   // the glow was for the last round only
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

  endWord.textContent = word;
  endNumber.textContent = count;                        // "You stacked / 23 / pumpkins!"
  endNoun.textContent = count === 1 ? "pumpkin!" : "pumpkins!";
  // A round is EASY if EASY was on at any moment of it, however briefly.
  const roundMode = state.usedEasy ? "easy" : "hard";
  const line = COMPARISONS[roundMode].filter((entry) => entry[0] <= count).pop();
  endCompare.textContent = line[1];
  // The round's milestones, the top one of each kind only (a 24 stack
  // shows Haunted House, not Hoop Height as well; John), in the order the
  // kinds were first earned. The block is hidden when there were none.
  const shown = topMilestones(state.earned);
  endMilestones.hidden = shown.length === 0;
  fillMilestoneGrid(shown);
  hideTip();

  // Tell the app, which keeps this game's five best counts and shows them
  // in the THIS GAME tab (games/game-helper.js). A count of 0 is ignored.
  // The mode rides along as the note, so the list reads "14 (10-16-2026) easy".
  Halloween.reportScore(count, undefined, [roundMode]);

  // Let the miss play out (the moon winces at it) before the end screen
  // covers it. Then the moon gives its verdict on the round.
  setTimeout(() => {
    endScreen.hidden = false;
    moonReacts(moodForCount(count));
    if (state.newBest) bestBox.classList.add("is-new-best");   // "Best" glows until the next start
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
   7. The EASY / HARD toggle
   --------------------------------------------------------------------- */

/** Put a mode in force: the rules, the toggle, the start screen's line,
    the sky (HARD's is darker: body[data-mode] in the CSS) and the note on
    this device. It works mid-round too, at once, with a flash of the word
    (John: switching to EASY when a round goes badly "would be fun"). A
    round that was EASY for even a moment counts as EASY at the end. */
function applyMode(modeName, quiet) {
  state.modeName = MODES[modeName] ? modeName : DEFAULT_MODE;
  state.rules = MODES[state.modeName];
  if (state.modeName === "easy") state.usedEasy = true;
  modeSwitch.dataset.mode = state.modeName;
  modeSwitch.setAttribute("aria-label", "Mode: " + state.modeName + ". Tap to change.");
  document.body.dataset.mode = state.modeName;
  try {
    localStorage.setItem(MODE_KEY, state.modeName);
  } catch (error) {
    // A browser with storage off still plays; the choice just does not
    // outlast the visit.
  }
  if (state.phase === "playing") showReaction(state.modeName.toUpperCase(), "is-mode");
  if (!quiet) showModeHint();
}

/** The reminder under the toggle (John: "what makes it easy/hard"). It
    shows on the start screen for whatever mode is in force, and on every
    tap of the toggle; it stays until a round starts (tapped mid-round,
    it leaves by itself). The start screen itself does not name the
    mode (John, 2026-10-16: "whatever default is used ... should just
    show up in the top where the message displays"). */
function showModeHint() {
  modeHint.textContent = MODES[state.modeName].note;
  modeHint.hidden = false;
  clearTimeout(modeHintTimer);
  if (state.phase === "playing") modeHintTimer = setTimeout(hideModeHint, MODE_HINT_MS);
}

function hideModeHint() {
  clearTimeout(modeHintTimer);
  modeHint.hidden = true;
}

/** The remembered mode, or the default on a first visit. */
function savedMode() {
  try {
    return localStorage.getItem(MODE_KEY) || DEFAULT_MODE;
  } catch (error) {
    return DEFAULT_MODE;
  }
}

modeSwitch.addEventListener("click", () => {
  applyMode(state.modeName === "hard" ? "easy" : "hard");
});

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
applyMode(savedMode());         // and the reminder shows under the toggle
startHints();                   // the goal line cycles while the start screen waits
requestAnimationFrame(frame);
