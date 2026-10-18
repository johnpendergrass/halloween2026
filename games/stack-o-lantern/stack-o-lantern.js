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
// THE RAMP: how fast the slab slides, as the seconds it takes to cross
// the stage, by the number of pumpkins in the tower (the base is 1).
// Each pumpkin placed makes the next crossing a little quicker, by the
// step of the stretch it is in. John, 2026-10-17: "getting to 1.0 at
// 100, and then slowing down the subtraction by 50% from there on",
// after the first build's multiplier (x1.035 per slab, 1.0 s already at
// 25, the cap at 29) made it "hard at around 25 or so". One level only
// (an EASY / HARD toggle lived for one day, 2026-10-16).
const CROSSING_START = 2.4;     // seconds across the stage for the first slab
const CROSSING_FASTEST = 0.85;  // never quicker than this (John: "about 0.85")
const RAMP = [                  // seconds taken off the crossing per pumpkin, by stretch
  { from: 1,   step: 0.0141 },  // 2.4 s at pumpkin 1 down to 1.0 s at pumpkin 100
  { from: 100, step: 0.0071 },  // half as steep after that (the floor arrives about 121)
];

// Milestones: little achievements inside one round (John, 2026-10-16;
// reworked into four families on 2026-10-17 from his list). THIS TABLE
// IS THE PLACE TO EDIT THE WORDS; _documents/milestones.md is a reading
// copy of it, so change both.
//
// `family` is how the end screen groups them. "height" is the level the
// round reached: its name is the end screen's big title and its `line`
// the italic line under the count. The three named slots under that
// show the best "accuracy", "growth" and "bounce" milestone earned.
// WITHIN A FAMILY THE ORDER HERE IS THE RANK, rarest first: of a family's
// earned entries, the first one in this list is the one shown.
//
// `sound` says whether the banner rings (sound.js: the milestone ding)
// and `pitch` which note, in semitones above the lowest: 0 for a
// family's commonest milestone, 23 (nearly two octaves up) for its
// rarest, spread evenly by rank. Only the HEIGHT family rings for now,
// so the ding climbs as the tower does (John, 2026-10-17: "no other
// milestones carry a sound"); the others keep a pitch in case.
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
  // HEIGHT: one per band, every five pumpkins to 100 (buildings in real
  // height order, then the mountains, Everest at 100), the sky at 125 /
  // 150 / 175 and the Moon at 200 (John, 2026-10-17; Chrysler and Big Ben
  // out, Rainier and Denali in, 2026-10-18). The line puns on
  // the title without repeating it, EXCEPT that a title shortened to fit
  // the 9vw one-line frame (Liberty, Rainier, Everest, Hubble...)
  // carries its full name in the line; and most lines mention the
  // pumpkin tower. Widest title that fits: SHANGHAI TOWER.
  // A rung with `fireworks: N` is a BIG one (John, 2026-10-18: 50, 100
  // and 200): its banner rings the longer, louder arpeggio and N rockets
  // go up from behind the moon, mid-round (see startRungFireworks).
  { family: "height", kind: "height", at: 200, name: "Moon Landing", what: "200 pumpkins high",
    line: "Houston, we have a tower. Please come down now.",
    hint: "two hundred pumpkins high",
    sound: true, pitch: 23, fireworks: 8 },
  { family: "height", kind: "height", at: 175, name: "Hubble", what: "175 pumpkins high",
    line: "The Hubble Space Telescope turned around to get a better look at a stack of pumpkins.",
    hint: "a hundred and seventy-five pumpkins high",
    sound: true, pitch: 22 },
  { family: "height", kind: "height", at: 150, name: "Space Station", what: "150 pumpkins high",
    line: "The International Space Station just drifted past. The astronauts waved at the pumpkins.",
    hint: "a hundred and fifty pumpkins high",
    sound: true, pitch: 21 },
  { family: "height", kind: "height", at: 125, name: "Stratosphere", what: "125 pumpkins high",
    line: "Airliners cruise far below your pumpkins now. The captain has turned on the seatbelt sign.",
    hint: "a hundred and twenty-five pumpkins high",
    sound: true, pitch: 20 },
  { family: "height", kind: "height", at: 100, name: "Everest", what: "100 pumpkins high",
    line: "Mount Everest, top of the world. The Sherpas would like a word about carrying pumpkins.",
    hint: "a hundred pumpkins high",
    sound: true, pitch: 19, fireworks: 8 },
  { family: "height", kind: "height", at: 95, name: "Denali", what: "95 pumpkins high",
    line: "Denali, the Great One, roof of North America. The grizzlies have never seen a pumpkin this high up.",
    hint: "ninety-five pumpkins high",
    sound: true, pitch: 18 },
  { family: "height", kind: "height", at: 90, name: "Kilimanjaro", what: "90 pumpkins high",
    line: "Mount Kilimanjaro, the roof of Africa. Hemingway would have written a short, sad book about your pumpkins.",
    hint: "ninety pumpkins high",
    sound: true, pitch: 17 },
  { family: "height", kind: "height", at: 85, name: "Rainier", what: "85 pumpkins high",
    line: "Mount Rainier is out. Seattle stops to look, as it always does, and then notices the pumpkins.",
    hint: "eighty-five pumpkins high",
    sound: true, pitch: 16 },
  { family: "height", kind: "height", at: 80, name: "Fuji", what: "80 pumpkins high",
    line: "Mount Fuji has a snowy cap and a thousand paintings. Your peak is orange and wobbling.",
    hint: "eighty pumpkins high",
    sound: true, pitch: 15 },
  { family: "height", kind: "height", at: 75, name: "Vesuvius", what: "75 pumpkins high",
    line: "Mount Vesuvius buried Pompeii. Your pumpkin tower buried the skyline.",
    hint: "seventy-five pumpkins high",
    sound: true, pitch: 14 },
  { family: "height", kind: "height", at: 70, name: "Burj Khalifa", what: "70 pumpkins high",
    line: "Dubai called. They want their skyline back.",
    hint: "seventy pumpkins high",
    sound: true, pitch: 13 },
  { family: "height", kind: "height", at: 65, name: "Shanghai Tower", what: "65 pumpkins high",
    line: "Tourists on the top floor are staring at a pumpkin.",
    hint: "sixty-five pumpkins high",
    sound: true, pitch: 12 },
  { family: "height", kind: "height", at: 60, name: "Empire State", what: "60 pumpkins high",
    line: "King Kong wants to climb your pumpkins. Tell him the Empire State Building is around the corner.",
    hint: "sixty pumpkins high",
    sound: true, pitch: 11 },
  { family: "height", kind: "height", at: 55, name: "Eiffel Tower", what: "55 pumpkins high",
    line: "Paris looked at your pumpkins and shrugged. For Paris, that is a standing ovation.",
    hint: "fifty-five pumpkins high",
    sound: true, pitch: 10 },
  { family: "height", kind: "height", at: 50, name: "Space Needle", what: "50 pumpkins high",
    line: "Seattle's saucer on a stick, out-stacked by squash. Rain expected anyway.",
    hint: "fifty pumpkins high",
    sound: true, pitch: 9, fireworks: 2 },
  { family: "height", kind: "height", at: 45, name: "Liberty", what: "45 pumpkins high",
    line: "The Statue of Liberty, torch up, eyes on your tower. She has seen a lot. Never a pumpkin stack.",
    hint: "forty-five pumpkins high",
    sound: true, pitch: 8 },
  { family: "height", kind: "height", at: 40, name: "Sequoia", what: "40 pumpkins high",
    line: "Three thousand years to grow one of these. Your pumpkin pile took a coffee break.",
    hint: "forty pumpkins high",
    sound: true, pitch: 7 },
  { family: "height", kind: "height", at: 35, name: "Notre Dame", what: "35 pumpkins high",
    line: "The gargoyles are worried. The hunchback is impressed.",
    hint: "thirty-five pumpkins high",
    sound: true, pitch: 6 },
  { family: "height", kind: "height", at: 30, name: "Tower of Pisa", what: "30 pumpkins high",
    line: "The Leaning Tower of Pisa has tourists pretending to hold it up. Your pumpkins could use a few.",
    hint: "thirty pumpkins high",
    sound: true, pitch: 5 },
  { family: "height", kind: "height", at: 25, name: "Treetops", what: "25 pumpkins high",
    line: "The owls have a question. Who? You, apparently.",
    hint: "twenty-five pumpkins high",
    sound: true, pitch: 4 },
  { family: "height", kind: "height", at: 20, name: "Haunted House", what: "20 pumpkins high",
    line: "Two storeys up. The ghosts have to look up at you for once.",
    hint: "twenty pumpkins high",
    sound: true, pitch: 3 },
  { family: "height", kind: "height", at: 15, name: "Giraffe", what: "15 pumpkins high",
    line: "Eye to eye with the tallest animal alive. It blinked first.",
    hint: "fifteen pumpkins high",
    sound: true, pitch: 2 },
  { family: "height", kind: "height", at: 10, name: "Hoop Height", what: "10 pumpkins high",
    line: "Wembanyama can barely reach the top. Nothing but net.",
    hint: "ten pumpkins high",
    sound: true, pitch: 1 },
  { family: "height", kind: "height", at: 5, name: "Scarecrow", what: "5 pumpkins high",
    line: "The crows are watching. Nobody is scared yet.",
    hint: "five pumpkins high",
    sound: true, pitch: 0 },

  // ACCURACY: where the tap lands.
  { family: "accuracy", kind: "perfect", at: 20, name: "Machine", what: "20 *perfects* in a row",
    tip: "Twenty *perfect* drops in a row. Are you even a person?",
    hint: "twenty *perfects* in a row",
    sound: false, pitch: 23 },
  { family: "accuracy", kind: "pencil", at: 3, name: "Toothpick", what: "3 in a row on a pencil pumpkin",
    tip: "Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you?",
    hint: "three in a row on pencil-thin pumpkins",
    sound: false, pitch: 20 },
  { family: "accuracy", kind: "tiny", at: 6, name: "Eye of the Needle", what: "6 in a row on a tiny pumpkin",
    tip: "Six landings in a row on a tiny pumpkin, a quarter of the starting width or less. How?",
    hint: "six in a row on a tiny pumpkin",
    sound: false, pitch: 18 },
  { family: "accuracy", kind: "perfect", at: 10, name: "Laser", what: "10 *perfects* in a row",
    tip: "Ten *perfect* drops in a row. The moon stopped blinking somewhere around seven.",
    hint: "ten *perfects* in a row",
    sound: false, pitch: 15 },
  { family: "accuracy", kind: "small", at: 10, name: "High Wire", what: "10 in a row on a small pumpkin",
    tip: "Ten landings in a row on a small pumpkin. No net.",
    hint: "ten in a row on a small pumpkin",
    sound: false, pitch: 13 },
  { family: "accuracy", kind: "tiny", at: 3, name: "Needle", what: "3 in a row on a tiny pumpkin",
    tip: "Three landings in a row on a tiny pumpkin, a quarter of the starting width or less. Threading it.",
    hint: "three in a row on a tiny pumpkin",
    sound: false, pitch: 10 },
  { family: "accuracy", kind: "pencil", at: 1, name: "Pencil Pusher", what: "landed on a pencil pumpkin",
    tip: "A landing on a pencil pumpkin. Stacking those is hard.",
    hint: "land one on a pencil pumpkin",
    sound: false, pitch: 8 },
  { family: "accuracy", kind: "perfect", at: 5, name: "Sharp Eye", what: "5 *perfects* in a row",
    tip: "Five *perfect* drops in a row. Every edge lined up within a hair.",
    hint: "five *perfects* in a row",
    sound: false, pitch: 5 },
  { family: "accuracy", kind: "small", at: 5, name: "Tightrope", what: "5 in a row on a small pumpkin",
    tip: "Five landings in a row on a small pumpkin. Steady.",
    hint: "five in a row on a small pumpkin",
    sound: false, pitch: 3 },
  { family: "accuracy", kind: "ghost", at: 1, name: "Ghost Whisperer", what: "a *perfect* on a ghost pumpkin",
    tip: "A *perfect* drop on a ghost pumpkin, the pale one. When does it come? Watch.",
    hint: "a *perfect* drop on the pale ghost pumpkin",
    sound: false, pitch: 0 },

  // GROWTH: WIDERs in a row.
  { family: "growth", kind: "growth", at: 5, name: "Bumper Crop", what: "5 WIDERs in a row",
    tip: "Five WIDERs in a row. Fifteen *perfects*, and the tower is nearly whole again.",
    hint: "five WIDERs in a row",
    sound: false, pitch: 23 },
  { family: "growth", kind: "growth", at: 3, name: "Pumpkin Farmer", what: "3 WIDERs in a row",
    tip: "Three WIDERs in a row. That is nine *perfects*.",
    hint: "three WIDERs in a row",
    sound: false, pitch: 15 },
  { family: "growth", kind: "growth", at: 2, name: "Green Thumb", what: "2 WIDERs in a row",
    tip: "Two WIDERs in a row. The pumpkin is coming back.",
    hint: "two WIDERs in a row",
    sound: false, pitch: 8 },
  { family: "growth", kind: "growth", at: 1, name: "Sprout", what: "grew back WIDER",
    tip: "Three *perfects* in a row grew the pumpkin back a little. It all starts somewhere.",
    hint: "grow the pumpkin back with three *perfects* in a row",
    sound: false, pitch: 0 },

  // BOUNCE: tapped on the first pass, before the pumpkin touched a wall.
  // (John, 2026-10-17: 20 or 30 without a bounce is common, so the ladder
  // climbs to 100, and the no-bounce perfects to 20.)
  { family: "bounce", kind: "cleanPerfect", at: 20, name: "Desperado", what: "20 *perfects*, no bounce",
    tip: "Twenty *perfect* drops in a row and not one of them bounced. There is a poster with your face on it.",
    hint: "twenty *perfects* in a row with no bounce",
    sound: false, pitch: 23 },
  { family: "bounce", kind: "clean", at: 100, name: "Supersonic", what: "100 drops, no bounce",
    tip: "A hundred drops in a row without a bounce. The walls have filed a complaint about being ignored.",
    hint: "a hundred drops in a row with no bounce",
    sound: false, pitch: 21 },
  { family: "bounce", kind: "clean", at: 50, name: "Tornado", what: "50 drops, no bounce",
    tip: "Fifty drops in a row without a bounce. Things are getting picked up and put down very fast.",
    hint: "fifty drops in a row with no bounce",
    sound: false, pitch: 19 },
  { family: "bounce", kind: "cleanPerfect", at: 10, name: "Outlaw", what: "10 *perfects*, no bounce",
    tip: "Ten *perfect* drops in a row, every one tapped before the pumpkin bounced off a wall. Wanted in three counties.",
    hint: "ten *perfects* in a row with no bounce",
    sound: false, pitch: 17 },
  { family: "bounce", kind: "clean", at: 30, name: "Wildfire", what: "30 drops, no bounce",
    tip: "Thirty drops in a row without a bounce. Spreading fast, no sign of stopping.",
    hint: "thirty drops in a row with no bounce",
    sound: false, pitch: 15 },
  { family: "bounce", kind: "clean", at: 20, name: "Lightning", what: "20 drops, no bounce",
    tip: "Twenty drops in a row without a bounce. The pumpkins never saw the walls.",
    hint: "twenty drops in a row with no bounce",
    sound: false, pitch: 13 },
  { family: "bounce", kind: "cleanTiny", at: 3, name: "No Look", what: "3 tiny landings, no bounce",
    tip: "Three landings in a row on tiny pumpkins, with no wall bouncing. You were not even looking, were you?",
    hint: "three in a row on tiny pumpkins with no bounce",
    sound: false, pitch: 12 },
  { family: "bounce", kind: "cleanPerfect", at: 6, name: "Dead Eye", what: "6 *perfects*, no bounce",
    tip: "Six *perfect* drops in a row with no bounce. First pass, every time.",
    hint: "six *perfects* in a row with no bounce",
    sound: false, pitch: 10 },
  { family: "bounce", kind: "clean", at: 10, name: "Gunslinger", what: "10 drops, no bounce",
    tip: "Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch.",
    hint: "ten drops in a row with no bounce",
    sound: false, pitch: 8 },
  { family: "bounce", kind: "cleanSmallPerfect", at: 3, name: "Trick Shot", what: "3 small *perfects*, no bounce",
    tip: "Three *perfect* drops in a row on small pumpkins, none of them bounced. Hold the applause.",
    hint: "three *perfects* on small pumpkins with no bounce",
    sound: false, pitch: 6 },
  { family: "bounce", kind: "cleanTiny", at: 1, name: "Blindfold", what: "a no-bounce landing",
    tip: "A landing on a tiny pumpkin, tapped before it bounced off a wall. Blindfolded, presumably.",
    hint: "land on a tiny pumpkin with no bounce",
    sound: false, pitch: 4 },
  { family: "bounce", kind: "cleanPerfect", at: 3, name: "Sharpshooter", what: "3 *perfects*, no bounce",
    tip: "Three *perfect* drops in a row, each with no bounce. Quick and right.",
    hint: "three *perfects* in a row with no bounce",
    sound: false, pitch: 2 },
  { family: "bounce", kind: "clean", at: 5, name: "Quick Draw", what: "5 drops, no bounce",
    tip: "Five drops in a row made before the pumpkin ever touched a wall. No dithering.",
    hint: "five drops in a row before the pumpkin touches a wall",
    sound: false, pitch: 0 },
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

// What the game says about a drop, by how much of the slab survived,
// and which sound the landing makes (sound.js: "soft" is the duller
// tink, "thunk" the poor landing). Perfect drops and misses have their
// own words and sounds (see drop()).
const REACTIONS = [
  { atLeast: 0.9,  word: "nice",      moon: "is-happy", sound: "soft" },
  { atLeast: 0.7,  word: "close one", moon: "is-happy", sound: "soft" },
  { atLeast: 0.45, word: "yikes",     moon: "is-meh",   sound: "thunk" },
  { atLeast: 0,    word: "oof",       moon: "is-meh",   sound: "thunk" },
];

// The big word that flashes at the miss: a band by count, a random pick
// from its words. From 5 pumpkins up it is just TIMBER! (John,
// 2026-10-17: "i like just TIMBER!"); the low bands keep their little
// words. On the end screen the title is the HEIGHT level's name instead
// (GIRAFFE, HAUNTED HOUSE); under 5 there is no level, so the miss word
// stays as the title. Short words only: the end screen shows them at 9vw.
// The base is pumpkin 1, so a miss on the very first drop is a count of 1.
const END_WORDS = [
  { from: 5, words: ["TIMBER!"] },
  { from: 2, words: ["SPLAT", "THUD", "OOF", "CRUNCH", "WELL THEN"] },
  { from: 1, words: ["WHIFF", "NOPE", "AIR BALL", "OOPS", "NOTHING"] },
];

// The italic line under the count on the end screen. From 5 pumpkins up
// it is the `line` of the HEIGHT level reached (John, 2026-10-17: the
// height milestone IS the comparison line). Below that, these four (the
// HARD set of 2026-10-16; EASY's kinder set went with the toggle). The
// last line whose count is not above the player's count is used.
const COMPARISONS = [
  [1, "The pumpkin patch remains undefeated."],
  [2, "Two pumpkins. The patch is not impressed."],
  [3, "Taller than a cauldron. The cauldron is not worried."],
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
const topFive = document.getElementById("topFive");   // the green TOP 5 SCORE! balloon
const fireworks = document.getElementById("fireworks");   // the end screen's fireworks layer
const levelBadge = document.getElementById("levelBadge");       // "Level 1" over the base on the welcome screen
const practicePanel = document.getElementById("practicePanel"); // the picker that opens from the badge
const practiceLevel = document.getElementById("practiceLevel"); // its <select>, 1..100

// Everything that changes while playing lives here, so it is easy to see
// (and to reset). Coordinates are "world" coordinates: x from the left
// edge, y up from the stage's bottom edge, both in vw. The camera only
// changes how the world is shown, never the numbers in it.
const state = {
  phase: "ready",      // "ready" (start screen), "playing", or "over"
  slabs: [],           // placed slabs, bottom first: { element, x, width }
  mover: null,         // the sliding slab: { element, x, width, direction, speed }
  lastDirection: 0,    // which way the last slab was sliding when dropped (+1 right, -1 left; 0 = none yet)
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
  place: 0,            // where the last round landed in the app's five-line list (1..5), 0 if it did not
  startLevel: 1,       // the practice level (the badge on the welcome screen): the base counts as this many; 1 = a real round
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

/** How many pumpkins are in the tower. The base is pumpkin 1 (John,
    2026-10-17: "in my mind it is already 1"; until then it did not
    count), so the first drop reads 2 and Scarecrow comes on the fourth. */
function stackedCount() {
  // The base is pumpkin 1. A round started at level 50 (the practice
  // panel) has a base that counts as 50, so the first drop
  // reads 51 and the first slab slides at the ramp's speed for a tower of
  // 50 (the speed is always that of the tower as it stands).
  return state.slabs.length + state.startLevel - 1;
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
    still counts for the end screen.

    EXCEPT a HEIGHT milestone, which jumps the queue: its banner replaces
    whatever is showing the instant the pumpkin lands, and its arpeggio
    plays then (John, 2026-10-17: the rung must be seen and heard on the
    pumpkin that earned it, not a pumpkin later). The others wait behind
    it as usual. */
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
  const newlyEarned = [];
  MILESTONES.forEach((entry) => {
    if (state.earned.includes(entry)) return;
    if (counts[entry.kind] >= entry.at) {
      state.earned.push(entry);
      newlyEarned.push(entry);
    }
  });
  const rung = newlyEarned.find((entry) => entry.family === "height");
  if (rung) {
    // The rung goes first, now; everything else lines up behind it.
    clearTimeout(milestoneTimer);
    const others = newlyEarned.filter((entry) => entry !== rung);
    state.toCelebrate = [rung, ...state.toCelebrate, ...others];
    celebrateNext();
  } else {
    state.toCelebrate.push(...newlyEarned);
    if (!state.celebrating) celebrateNext();
  }
  // Keep only the newest of those still waiting; the rest expire unshown.
  if (state.toCelebrate.length > MILESTONES_WAITING) {
    state.toCelebrate = state.toCelebrate.slice(-MILESTONES_WAITING);
  }
}

let milestoneTimer = null;   // takes the banner down after MILESTONE_MS; a rung cancels it

/** Show the next waiting milestone: the banner pops in, stars burst, the
    moon goes wide-eyed, and (for a rung) the arpeggio plays at the entry's
    pitch. */
function celebrateNext() {
  const entry = state.toCelebrate.shift();
  if (!entry) { state.celebrating = false; return; }
  state.celebrating = true;
  if (entry.sound) playSound(entry.fireworks ? "bigMilestone" : "milestone", entry.pitch);
  if (entry.fireworks) startRungFireworks(entry.fireworks);
  milestoneName.textContent = entry.name;
  fillMarked(milestoneWhat, entry.what);
  milestone.hidden = false;
  milestone.classList.remove("is-shown");
  void milestone.offsetWidth;
  milestone.classList.add("is-shown");
  burstStars();
  moonReacts("is-wow");
  clearTimeout(milestoneTimer);
  milestoneTimer = setTimeout(() => {
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
  if (state.startLevel > 1) return;     // a practice round: the high score is not in play
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
  clearCornerGlow();
  stopFireworks();
  reset();                        // a fresh base on the ground; the moon smiles
  state.phase = "ready";
  endScreen.hidden = true;
  startScreen.hidden = false;     // the stage keeps its glow: both screens have it
  showBadge();
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

/** The seconds a slab takes to cross the stage when the tower holds
    `count` pumpkins: the start, less one step for every pumpkin after the
    first, each step from the RAMP stretch that pumpkin is in, never under
    the floor. A plain loop, so the table can have any number of rows. */
function crossingFor(count) {
  let seconds = CROSSING_START;
  for (let pumpkin = 2; pumpkin <= count; pumpkin += 1) {
    const stretch = RAMP.filter((row) => row.from < pumpkin).pop();
    seconds -= stretch.step;
  }
  return Math.max(CROSSING_FASTEST, seconds);
}

/** Start a new slab sliding in from the side opposite to the way the
    last one was going when it was dropped (the first from the left), as
    wide as the slab it must land on, a little faster than the one before.
    Until 2026-10-17 the sides simply alternated by slab number, which
    reads the same while slabs are dropped before their first bounce;
    once they bounce (fast slabs, a practice round at a high level) a
    slab dropped on its way back was followed by one from the same way
    (John: "I prefer the regular method"). */
function spawnMover() {
  const top = state.slabs[state.slabs.length - 1];
  const fromLeft = state.lastDirection !== 1;   // the last one went right (came from the left)? then from the right
  const speed = 100 / crossingFor(stackedCount());       // the stage is 100vw wide
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
  if (mover.x < leftLimit) {
    mover.x = leftLimit;
    if (mover.direction < 0) { mover.bounced = true; playSound("tick"); }
    mover.direction = 1;
  }
  if (mover.x > rightLimit) {
    mover.x = rightLimit;
    if (mover.direction > 0) { mover.bounced = true; playSound("tick"); }
    mover.direction = -1;
  }
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
  state.lastDirection = mover.direction;        // the next slab comes the other way

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
    playSound(word === "WIDER!" ? "wider" : "perfect");   // the landing's sound
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
    playSound("miss");
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
  playSound(feeling.sound);                                // the landing's sound
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
  state.lastDirection = 0;
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
  clearTimeout(milestoneTimer);
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
  applyStartLevel();
  levelBadge.hidden = true;       // the base scrolls away; the badge is for the welcome screen
  stopHints();
  clearCornerGlow();              // the glow and the balloon were for the last round only
  stopFireworks();
  stage.classList.remove("is-glowing");      // the moon's start/end-screen glow goes
  state.phase = "playing";
  startScreen.hidden = true;
  endScreen.hidden = true;
  playSound("start");             // the "go" ding, and the phone's audio wake-up (see sound.js)
  spawnMover();
}

/* ---- The practice level (John, 2026-10-17) -------------------------------
   "a useful debugging feature": the badge over the base slab on the
   welcome screen reads "Level 1"; a tap on it opens a panel to pick where
   the next round starts, 1 to 100. Above 1 the base counts as that many
   pumpkins (stackedCount), the ramp's speed is that level's, the height
   rungs below the level are marked earned without a banner (so the end
   title is right and the first drop does not ring them all), and the
   round is not reported (gameOver) nor counted as a best (updateLabels).
   The pick lasts for the visit only: every launch of the game starts at
   level 1 (John, 2026-10-18: "it retains the level the cheat was set
   to... it should go back to the default of 1"; until then it was kept
   on the device under the game's own key). It first lived as a drop-down
   in the shell's THIS GAME tab, for an hour; John moved it here. */

// The levels the panel offers: every level to 100, then four high ones a
// few drops short of the sky rungs (125, 150, 175, 200), so those can be
// seen without a tower of a hundred first (John, 2026-10-18).
const PRACTICE_TOP = 100;
const PRACTICE_HIGH = [122, 147, 172, 197];
const PRACTICE_LEVELS = [...Array.from({ length: PRACTICE_TOP }, (_, i) => i + 1), ...PRACTICE_HIGH];
let chosenStartLevel = 1;        // the panel's pick, for this visit

/** The practice level in force: the pick when it is one the panel
    offers, else 1. */
function readStartLevel() {
  return PRACTICE_LEVELS.includes(chosenStartLevel) ? chosenStartLevel : 1;
}

function saveStartLevel(level) {
  chosenStartLevel = level;
}

// Until 2026-10-18 the level was saved on the device under this key;
// a device that still has it is tidied up once.
try { localStorage.removeItem("halloween2026:stack-o-lantern:start-level"); } catch (error) { /* no storage, nothing to tidy */ }

/** At the start of a round: take the level and set the tower up for it. */
function applyStartLevel() {
  state.startLevel = readStartLevel();
  if (state.startLevel === 1) return;
  MILESTONES.forEach((entry) => {
    if (entry.family === "height" && entry.at <= state.startLevel) state.earned.push(entry);
  });
}

/** The badge over the base on the welcome screen, with the level it
    would start at. */
function showBadge() {
  levelBadge.textContent = "Level " + readStartLevel();
  levelBadge.hidden = false;
}

/** Open the panel with the <select> on the saved level. The options are
    built once, the first time. */
function openPractice() {
  if (practiceLevel.options.length === 0) {
    for (const level of PRACTICE_LEVELS) {
      const option = document.createElement("option");
      option.value = String(level);
      option.textContent = String(level);
      practiceLevel.appendChild(option);
      if (level !== PRACTICE_LEVELS[PRACTICE_LEVELS.length - 1] && level >= PRACTICE_TOP) {
        // A "..." row after 100 and between the high levels, to show the
        // jumps. It is disabled, so it cannot be picked; OK ignores it anyway.
        const gap = document.createElement("option");
        gap.value = "";
        gap.textContent = "...";
        gap.disabled = true;
        practiceLevel.appendChild(gap);
      }
    }
  }
  practiceLevel.value = String(readStartLevel());
  practicePanel.hidden = false;
}

function closePractice() {
  practicePanel.hidden = true;
}

// The badge and the panel sit inside the stage, where a touch-down starts
// the round: their touches stop here (like the sound switch's).
levelBadge.addEventListener("pointerdown", (event) => event.stopPropagation());
levelBadge.addEventListener("click", openPractice);
practicePanel.addEventListener("pointerdown", (event) => event.stopPropagation());
document.getElementById("practiceDone").addEventListener("click", () => {
  const pick = Number(practiceLevel.value);
  if (PRACTICE_LEVELS.includes(pick)) saveStartLevel(pick);   // the "..." row changes nothing
  showBadge();
  closePractice();
});
document.getElementById("practiceCancel").addEventListener("click", closePractice);
document.getElementById("practiceReset").addEventListener("click", () => {
  practiceLevel.value = "1";      // OK still has to be tapped; Cancel keeps the old level
});

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
  stopFireworks();   // a big rung's rockets too; the end screen has its own show
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
  // The answer is the count's place in that list, 1 to 5, or 0. A round
  // started above level 1 is practice and is not reported (John: "no
  // scores will be recorded").
  state.place = state.startLevel === 1
    ? Halloween.reportScore(count, undefined, level ? [level.name] : undefined)
    : 0;

  // Let the miss play out (the moon winces at it) before the end screen
  // covers it. Then the moon gives its verdict on the round, with a
  // softer glow around it, and the corner says how the round ranks.
  setTimeout(() => {
    endScreen.hidden = false;
    stage.classList.add("is-glowing");
    armEndTimer();                             // untouched for a minute, it gives way to the welcome screen
    moonReacts(moodForCount(count));
    const tier = endTier(count);
    if (FANFARES[tier]) playSound(FANFARES[tier]);   // "none" has no fanfare
    startFireworks(tier);                            // and no fireworks
    if (tier === "best") {
      bestBox.classList.add("is-new-best");   // the number glows gold until the next start
      newBest.hidden = false;                 // NEW HIGH SCORE! beside it
    } else if (tier === "topFive") {
      bestBox.classList.add("is-top-five");   // the same in green
      topFive.hidden = false;                 // TOP 5 SCORE!
    }
  }, END_DELAY_MS);
}

/** The end screen's fanfare for each tier (sound.js). Under 5 pumpkins
    ("none") there is none: the miss sound was the last word. */
const FANFARES = {
  best: "fanfareBest",
  topFive: "fanfareTopFive",
  good: "fanfareGood",
};

/** How the round that just ended ranks, for the end screen's celebration
    (John, 2026-10-17). From the top:
      "best"     this round beat the best (the gold balloon),
      "topFive"  it made the app's five-line list without topping it (green),
      "good"     every other round of 5 pumpkins or more (a level was reached),
      "none"     under 5 pumpkins: no cheer, the moon is sad and that is that.
    Under 5 is checked first: with an empty list a tower of 3 would be
    "number one", which would be silly. A tie with the best counts as
    top five, not best (the app ranks the earlier score higher). */
function endTier(count) {
  if (count < 5) return "none";
  if (state.newBest) return "best";
  if (state.place > 0) return "topFive";
  return "good";
}

/** Take the gold or green glow and balloon off the corner: they were for
    the round just ended (John: "only after that round ... not forever!"). */
function clearCornerGlow() {
  bestBox.classList.remove("is-new-best", "is-top-five");
  newBest.hidden = true;
  topFive.hidden = true;
}

/* ---- Fireworks (John, 2026-10-17) ----------------------------------------
   Rockets rise from behind the moon and burst into rings of dots over the
   end screen (the layer sits under the moon and over the words; see the
   CSS). A show is a number of bursts spread over a time, by tier; the
   best round keeps a slow trickle going until the next tap. Each burst
   pops (sound.js) at the moment the rocket arrives. */

// Bright, saturated colours against the night sky (John: "bright and
// colorful"). Every fourth dot of a burst is white, for sparkle.
const FIREWORK_COLOURS = ["#ff5e3a", "#ffd23f", "#3dff7a", "#4dc9ff", "#ff4fd8", "#ff9a1f"];

/** The show for each tier: how many bursts, spread over how long, in
    which colours (the first N of the list), a slow trickle afterwards
    (null = none; see trickle below: the shortest and longest pause, and
    the most rockets in one salvo), and how far from
    the moon the bursts may land: `reach` is in vw, left and right of the
    moon's centre and up and down from it (the moon is at the top right,
    so "left" and "down" are where the room is). The best round's
    fireworks go out over the whole screen (John, 2026-10-17: "more
    fireworks still, and they should go out further from the moon"; the
    top five is "about 3/4" of it with the same rhythm after; the good
    round "about half of the top five" and "reduced amounts" after). */
const FIREWORK_SHOWS = {
  good:    { bursts: 6,  over: 3000, colours: 6, trickle: { shortest: 2000, longest: 6000, most: 2 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
  topFive: { bursts: 12, over: 4000, colours: 6, trickle: { shortest: 800,  longest: 4000, most: 3 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
  best:    { bursts: 16, over: 5000, colours: 6, trickle: { shortest: 800,  longest: 4000, most: 3 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
};

let fireworkTimers = [];        // every pending rocket and the trickle, so a tap can stop them

/** A big rung's fireworks, mid-round (John, 2026-10-18: "a moon firework,
    with maybe two fireworks at 50, four at 100 and six at 200"; then
    "even longer" at 100, eight, and 200 "the same not more"). The
    rockets leave the moon one after another, a third of a second apart,
    and burst around it: a smaller reach than the end screen's, since the
    tower is in play below. No trickle: play goes on. They share
    fireworkTimers, so a miss (gameOver) or a new round cuts them. */
const RUNG_ROCKET_GAP_MS = 330;
const RUNG_REACH = { left: 60, right: 10, up: 30, down: 30 };
function startRungFireworks(bursts) {
  const pick = () => FIREWORK_COLOURS[Math.floor(Math.random() * FIREWORK_COLOURS.length)];
  for (let i = 0; i < bursts; i += 1) {
    const at = i * RUNG_ROCKET_GAP_MS + Math.random() * 120;
    fireworkTimers.push(setTimeout(() => launchRocket(pick(), RUNG_REACH), at));
  }
}

/** Start the tier's show; "none" (under 5 pumpkins) has no entry. */
function startFireworks(tier) {
  const show = FIREWORK_SHOWS[tier];
  if (!show) return;
  const colours = FIREWORK_COLOURS.slice(0, show.colours);
  const pick = () => colours[Math.floor(Math.random() * colours.length)];
  for (let i = 0; i < show.bursts; i += 1) {
    // Spread over the show's time, the first one at once, each a little
    // off its even beat so they do not march.
    const at = show.bursts === 1 ? 0 : (i / (show.bursts - 1)) * show.over + Math.random() * 250;
    fireworkTimers.push(setTimeout(() => launchRocket(pick(), show.reach), at));
  }
  if (show.trickle) {
    fireworkTimers.push(setTimeout(() => trickle(show, pick), show.over + 1200));
  }
}

/** After the flurry: the odd rocket at random, until the next tap (John,
    2026-10-17: "it should slow down, but still fire off randomly...
    sometimes with a couple, sometimes with just one, but not on a regular
    clock"). Each time: a pause of a random length between the show's
    shortest and longest, then usually one rocket, sometimes two close
    together, now and then three. Then it waits again. Every timer goes
    in fireworkTimers, so stopFireworks ends it mid-pause or mid-salvo. */
function trickle(show, pick) {
  const pause = show.trickle.shortest + Math.random() * (show.trickle.longest - show.trickle.shortest);
  fireworkTimers.push(setTimeout(() => {
    const roll = Math.random();
    const rockets = Math.min(show.trickle.most, roll < 0.55 ? 1 : roll < 0.85 ? 2 : 3);
    for (let i = 0; i < rockets; i += 1) {
      fireworkTimers.push(setTimeout(() => launchRocket(pick(), show.reach), i * (150 + Math.random() * 300)));
    }
    trickle(show, pick);          // and wait for the next one
  }, pause));
}

/** Stop the show and clear the sky: the next round is starting. */
function stopFireworks() {
  fireworkTimers.forEach((timer) => clearTimeout(timer));
  fireworkTimers = [];
  fireworks.innerHTML = "";
}

/** One rocket: a dot that rises from the moon's centre to a random point
    within the show's reach of it, and bursts there. The moon's centre is
    measured, so the CSS owns its spot. A point lands at least 8vw from
    the moon's centre, so no burst is hidden behind the moon. */
function launchRocket(colour, reach) {
  const stageBox = stage.getBoundingClientRect();
  const moonBox = moon.getBoundingClientRect();
  const vw = stageBox.width / 100;                    // one vw in px
  const fromX = moonBox.left - stageBox.left + moonBox.width / 2;
  const fromY = moonBox.top - stageBox.top + moonBox.height / 2;
  // The burst point: anywhere in the reach, kept inside the stage (8vw
  // from the sides, 6vw from the top, 10vw from the bottom).
  const dx = (Math.random() * (reach.left + reach.right) - reach.left) * vw;
  const dy = (Math.random() * (reach.up + reach.down) - reach.up) * vw;
  const tooClose = Math.hypot(dx, dy) < 8 * vw;
  const toX = Math.min(92 * vw, Math.max(8 * vw, fromX + dx));
  const toY = Math.min(stageBox.height - 10 * vw, Math.max(6 * vw, fromY + (tooClose ? -12 * vw : dy)));

  const rocket = document.createElement("span");
  rocket.className = "rocket";
  rocket.style.left = fromX + "px";
  rocket.style.top = fromY + "px";
  rocket.style.setProperty("--tx", (toX - fromX) + "px");
  rocket.style.setProperty("--ty", (toY - fromY) + "px");
  rocket.style.setProperty("--colour", colour);
  rocket.addEventListener("animationend", () => {
    rocket.remove();
    burst(toX, toY, colour);
  });
  fireworks.appendChild(rocket);
}

/** The burst: a ring of dots flying out from the point, each a random
    distance (10 to 22vw) at an even angle around the circle, and the pop. */
function burst(x, y, colour) {
  const count = 36;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.15;
    const distance = 10 + Math.random() * 12;
    const dot = document.createElement("span");
    dot.className = "firework";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    dot.style.setProperty("--dx", Math.cos(angle) * distance + "vw");
    dot.style.setProperty("--dy", Math.sin(angle) * distance + "vw");
    dot.style.setProperty("--colour", i % 4 === 3 ? "#ffffff" : colour);
    dot.addEventListener("animationend", () => dot.remove());
    fireworks.appendChild(dot);
  }
  playSound("pop");
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
// Stack again returns to the welcome screen (the base with its level
// badge in view); the next tap there starts the round (John, 2026-10-17).
document.getElementById("playAgain").addEventListener("click", backToStart);

// A bonus for people at a keyboard. Touch alone is enough (rule 11).
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    if (state.phase === "over") backToStart(); else onTap(event);
  }
});

// The high score starts from the app's list, not from 0, so the corner
// and the THIS GAME tab agree (John, 2026-10-17); outside the app it is
// 0. When the app's list is cleared, the app loads this page again, so
// the corner starts over too.
state.best = Halloween.bestScore();
reset();
showBadge();                    // "Level 1" over the base (a practice level lasts the visit only)
startHints();                   // the goal line cycles while the start screen waits
requestAnimationFrame(frame);
