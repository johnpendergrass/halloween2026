/* Hollow Hill - the game.

   A point-and-click adventure in three parts:
     1. STORY   the scenes, who is in them, what they say, what items do.
                This is DATA. To change the adventure, change this part.
     2. ENGINE  shows a scene, lays out hotspots and exits, runs dialogue,
                keeps the inventory. It knows nothing about pumpkins.
     3. START   the title screen, the ending, the taps.

   Coordinates for hotspots are in the picture's own units (the SVG
   viewBox is 1000 wide by 1120 tall, see hollow-hill-art.js); the engine
   converts them to percentages so they scale with the panel. Text sizes
   and UI sizes are in vw, in the CSS. */

"use strict";

/* ========================================================================
   1. STORY
   ======================================================================== */

/* Everything that can change during the adventure. reset() copies this. */
const FRESH_FLAGS = {
  metMayor: false,
  spoonPulls: 0, spoonTaken: false,
  hatTaken: false, hatReturned: false, gateOpen: false,
  doorCode: [], doorOpen: false, skullTaken: false, skullReturned: false,
  batsFed: false, candleGiven: false,
  wispCaught: false,
  candlePlaced: false, lit: false,
};

const ITEM_NAMES = {
  candy: "Bag of candy corn",
  spoon: "Shiny spoon",
  hat: "Scarecrow's hat",
  skull: "Fibula's skull",
  jar: "Empty jar",
  wispjar: "Jar with a wisp in it",
  candle: "Beeswax candle",
};

/* A line of dialogue is [who, text]. An empty "who" is the narrator. */
const N = "";

/* Scenes. Each hotspot's tap(item) returns what happens: a list of lines,
   or { lines, then } where `then` runs after the last line is read. It
   may also call the story helpers (give, take, set) directly. */
const STORY = {

  square: {
    name: "The village square",
    art: ART.scenes.square,
    exits: [
      { to: "gate", side: "top", label: "Hill gate" },
      { to: "graveyard", side: "right", label: "Graves" },
      { to: "chapel", side: "left", label: "Chapel" },
      { to: "bog", side: "bottom", label: "Bog" },
    ],
    hotspots: [
      { id: "mayor", label: "The mayor", x: 640, y: 520, w: 200, h: 400,
        tap(item) {
          if (item === "candy") return [["Mayor", "I'm a vampire, dear. I don't do sugar."], ["Mayor", "...Well. Maybe one. Don't tell the council."]];
          if (item) return [["Mayor", "Very nice. Now put it to use somewhere useful."]];
          const f = flags();
          if (!f.gateOpen) return [["Mayor", "The scarecrow at the gate is sulking again. Something about his hat."], ["Mayor", "Guards. Honestly."]];
          if (!f.candleGiven) return [["Mayor", "Candles? Madame Wail in the chapel makes them. When she's in the mood, which is never."]];
          if (!f.wispCaught) return [["Mayor", "Wisps live in the bog. You'll need something to catch one in. Not your hands. Trust me on this."]];
          return [["Mayor", "What are you waiting for? Up the hill! The candy economy hangs by a thread!"]];
        } },
      { id: "signpost", label: "Signpost", x: 40, y: 560, w: 300, h: 360,
        tap() {
          return [[N, "CHAPEL to the left. GRAVES to the right. BOG down the muddy path. The hill gate is up the road."],
                  [N, "Someone has scratched 'the moon is watching' into the post. Probably the moon."]];
        } },
      { id: "cat", label: "A black cat", x: 400, y: 720, w: 170, h: 180,
        tap(item) {
          if (item === "candy") return [[N, "The cat sniffs the candy corn and leaves. The cat has standards."]];
          if (item) return [[N, "The cat is not interested in your " + ITEM_NAMES[item].toLowerCase() + ". The cat is not interested in anything."]];
          return [[N, "The cat looks at you, then looks away. You have been judged."]];
        } },
    ],
  },

  gate: {
    name: "The hill gate",
    art: ART.scenes.gate,
    exits: [
      { to: "square", side: "bottom", label: "Square" },
      { to: "hilltop", side: "top", label: "Up the hill",
        when: () => flags().gateOpen,
        blocked: [[N, "The gate is locked. The scarecrow is the guard, and the guard is not guarding. He is sulking."]] },
    ],
    hotspots: [
      { id: "scarecrow", label: "Stitch the scarecrow", x: 60, y: 480, w: 320, h: 440,
        tap(item) {
          const f = flags();
          if (item === "hat") {
            set("hatReturned", true);
            set("gateOpen", true);
            take("hat");
            return [["Stitch", "MY HAT! Oh, hello dignity. I missed you."],
                    ["Stitch", "Right. Guard business. The gate is open. Mind the steps, they're haunted."],
                    ["Stitch", "Kidding. Mostly."]];
          }
          if (item === "candy") return [["Stitch", "Stitched mouth. Can't eat. Kind of you, though."]];
          if (item) return [["Stitch", "That is not a hat. I know a hat when I see one. That is not one."]];
          if (f.hatReturned) return [["Stitch", "Looking sharp, feeling sharp. On you go."]];
          return [["Stitch", "Don't look at me. I'm not decent."],
                  ["Stitch", "Those crows took my hat. A guard without a hat is just a stick with opinions."],
                  ["Stitch", "Bring it back and I'll open the gate. Not moving an inch without it."]];
        } },
      { id: "gate", label: "The gate", x: 360, y: 520, w: 280, h: 400,
        tap(item) {
          if (item) return [[N, "The gate is iron. It does not care about your " + ITEM_NAMES[item].toLowerCase() + "."]];
          if (flags().gateOpen) return [[N, "The gate stands open. The path climbs into the dark. Onwards."]];
          return [[N, "Locked. A heavy iron gate. Beyond it the path climbs the hill towards the dark pumpkin."]];
        } },
    ],
  },

  graveyard: {
    name: "The graveyard",
    art: ART.scenes.graveyard,
    exits: [
      { to: "square", side: "left", label: "Square" },
      { to: "crypt", side: "right", label: "Crypt" },
    ],
    hotspots: [
      { id: "skeleton", label: "Fibula the skeleton", x: 170, y: 560, w: 260, h: 400,
        tap(item) {
          const f = flags();
          if (item === "skull") {
            set("skullReturned", true);
            take("skull");
            return { lines: [["Fibula", "My HEAD! Put it on, put it on. Ahh. Much better. I can SEE."],
                             ["Fibula", "You're a gem. Here, take my spare jar. I kept it for brains. Never found any."]],
                     then: () => give("jar") };
          }
          if (item === "candy") return [["Fibula", "No stomach. Story of my life."]];
          if (item) return [["Fibula", "That's not my head. I'd know. I've had it for years."]];
          if (f.skullReturned) return [["Fibula", "Everything's looking up. Literally. My neck is stiff."]];
          return [["Fibula", "Have you seen a skull? Round, bony, handsome? MY skull?"],
                  ["Fibula", "It rolled off during a yawn. Straight into the crypt. Can't go in without my head, I'd never find it."],
                  ["Fibula", "The door has a puzzle lock. Old family tradition. The hint is carved on my tombstone."]];
        } },
      { id: "crows", label: "Two crows", x: 590, y: 560, w: 230, h: 220,
        tap(item) {
          const f = flags();
          if (item === "spoon" && !f.hatTaken) {
            set("hatTaken", true);
            take("spoon");
            return { lines: [["Crows", "OOOH. SHINY. Deal. Take the silly hat."],
                             [N, "The crows admire their reflections in the spoon. You now own a floppy straw hat."]],
                     then: () => give("hat") };
          }
          if (item === "candy") return [["Crows", "Not shiny. CAW."]];
          if (item) return [["Crows", "Not shiny ENOUGH. CAW."]];
          if (f.hatTaken) return [["Crows", "CAW. Busy. Looking at spoon."]];
          return [["Crows", "CAW. Nice hat, isn't it? Ours now."],
                  ["Crows", "We'd trade it for something SHINY. Crows love shiny. Everyone knows this."]];
        } },
      { id: "tombstone", label: "A carved tombstone", x: 430, y: 720, w: 180, h: 200,
        tap() {
          return [[N, "FIBULA FAMILY. Carved below the name: a moon, then a bat, then a pumpkin."],
                  [N, "That looks like an order of things."]];
        } },
    ],
  },

  crypt: {
    name: "The family crypt",
    art: ART.scenes.crypt,
    exits: [
      { to: "graveyard", side: "left", label: "Graves" },
    ],
    hotspots: [
      // The four door symbols only exist while the door is shut.
      ...["moon", "bat", "pumpkin", "skull"].map((symbol, i) => ({
        id: "symbol-" + symbol, label: "Carved " + symbol,
        x: i % 2 === 0 ? 350 : 510, y: i < 2 ? 560 : 720, w: 140, h: 140,
        when: () => !flags().doorOpen,
        tap(item) {
          if (item) return [[N, "The carving is stone. Tapping it with things does nothing. Tapping it with a finger might."]];
          return pressSymbol(symbol);
        },
      })),
      { id: "skull", label: "A skull on the floor", x: 400, y: 760, w: 200, h: 170,
        when: () => flags().doorOpen && !flags().skullTaken,
        tap() {
          set("skullTaken", true);
          return { lines: [[N, "A skull. It looks embarrassed. You pick it up gently."], ["Skull", "...thanks."]],
                   then: () => give("skull") };
        } },
      { id: "doorway", label: "The open doorway", x: 320, y: 520, w: 360, h: 230,
        when: () => flags().doorOpen,
        tap() { return [[N, "Dark, dusty, and full of Fibulas. Politely, you don't look too closely."]]; } },
    ],
  },

  chapel: {
    name: "The old chapel",
    art: ART.scenes.chapel,
    exits: [
      { to: "square", side: "right", label: "Square" },
    ],
    hotspots: [
      { id: "bats", label: "Bats in the organ pipes", x: 580, y: 260, w: 320, h: 220,
        when: () => !flags().batsFed,
        tap(item) {
          if (item === "candy") {
            set("batsFed", true);
            set("candleGiven", true);
            return { lines: [[N, "You hold out a handful of candy corn."],
                             ["Bats", "SQUEAK!! (candy corn!!)"],
                             [N, "The bats pour out of the pipes, grab the candy and flap off into the night. The organ wheezes with relief."],
                             ["Madame Wail", "My PIPES! Clear at last!"],
                             [N, "She plays a chord that rattles the windows. It is the spookiest thing you have ever heard. It is wonderful."],
                             ["Madame Wail", "You, small mortal, have taste. Take my last beeswax candle. Burn it somewhere important."]],
                     then: () => give("candle") };
          }
          if (item) return [["Bats", "squeak? (that is not food)"]];
          return [["Bats", "squeak squeak (we live here now)"]];
        } },
      { id: "ghost", label: "Madame Wail", x: 500, y: 620, w: 300, h: 300,
        tap(item) {
          const f = flags();
          if (item === "candy") return [["Madame Wail", "Give it to the BATS, dear, not me. I'm a ghost. It would fall right through."]];
          if (item) return [["Madame Wail", "I have no use for that. Well. Perhaps as a paperweight."]];
          if (f.batsFed) return [["Madame Wail", "Listen to that tone. Glorious. Ghastly. Now go and save the pumpkin."]];
          return [["Madame Wail", "I cannot PLAY. There are BATS in my PIPES. Do you know what a bat does to a B-flat?"],
                  ["Madame Wail", "They won't leave. They care about nothing but food. Sweet food."]];
        } },
      { id: "candles", label: "A stand of candles", x: 80, y: 540, w: 200, h: 340,
        tap() { return [[N, "A stand of candles. They are hers, and she counts them. Every night. Out loud."]]; } },
    ],
  },

  bog: {
    name: "The bog",
    art: ART.scenes.bog,
    exits: [
      { to: "square", side: "top", label: "Square" },
    ],
    hotspots: [
      { id: "frogs", label: "Singing frogs", x: 200, y: 740, w: 420, h: 220,
        tap(item) {
          if (item === "candy") return [["Frogs", "(they eat it. they sing louder. this was a mistake.)"]];
          if (item) return [["Frogs", "ribbit? (they do not want it. they want an audience.)"]];
          if (!flags().spoonTaken) return [["Frogs", "ribbit. ribbit. RIBBIT."], [N, "They are singing. It is not good."], ["Frogs", "ribbit (something shiny in the mud over there. ribbit.)"]];
          return [["Frogs", "ribbit. ribbit. RIBBIT."], [N, "They are singing. It is still not good."]];
        } },
      { id: "spoon", label: "Something shiny in the mud", x: 680, y: 840, w: 200, h: 200,
        when: () => !flags().spoonTaken,
        tap() {
          const pulls = flags().spoonPulls + 1;
          set("spoonPulls", pulls);
          if (pulls === 1) return [[N, "A spoon, stuck in the mud. You pull. It does not budge."]];
          if (pulls === 2) return [[N, "You pull harder. The mud makes a rude noise."]];
          set("spoonTaken", true);
          return { lines: [[N, "POP. A silver spoon. Slightly bent, very shiny."], [N, "Who leaves a spoon in a bog? A story for another night."]],
                   then: () => give("spoon") };
        } },
      ...[[300, 450], [560, 380], [760, 520]].map(([x, y], i) => ({
        id: "wisp" + i, label: "A will-o'-wisp", x: x - 100, y: y - 100, w: 200, h: 200,
        when: () => !flags().wispCaught,
        tap(item) {
          if (item === "jar") {
            set("wispCaught", true);
            take("jar");
            return { lines: [[N, "You swoop the jar. The wisp tumbles in and glows, indignant."], ["Wisp", "...hmph."],
                             [N, "A true Halloween flame, in a jar. Try not to shake it."]],
                     then: () => give("wispjar") };
          }
          if (item) return [[N, "The wisp is not impressed by your " + ITEM_NAMES[item].toLowerCase() + ". You would need something to catch it IN."]];
          return [[N, "The wisp slips between your fingers and giggles. Rude."], [N, "You would need something to catch it in."]];
        },
      })),
    ],
  },

  hilltop: {
    name: "The top of Hollow Hill",
    art: ART.scenes.hilltop,
    exits: [
      { to: "gate", side: "bottom", label: "Gate" },
    ],
    hotspots: [
      { id: "pumpkin", label: "The Great Pumpkin", x: 220, y: 360, w: 560, h: 560,
        tap(item) {
          const f = flags();
          if (item === "candle") {
            set("candlePlaced", true);
            take("candle");
            return [[N, "You reach into the mouth and set the candle in its holder. It fits perfectly."],
                    [N, "Now it needs a flame. A proper one."]];
          }
          if (item === "wispjar") {
            if (!f.candlePlaced) return [["Wisp", "(from the jar) Light WHAT? There's no candle. Do you plan things?"]];
            set("lit", true);
            take("wispjar");
            return { lines: [[N, "You open the jar. The wisp drifts out, circles once..."],
                             [N, "...and dives onto the wick."],
                             [N, "The Great Pumpkin BLAZES. Its grin lights the whole valley. Down below, the village windows glow one by one."],
                             ["Mayor", "(faintly, from the square) THE CANDY ECONOMY IS SAVED!"]],
                     then: finish };
          }
          if (item === "candy") return [[N, "You offer the pumpkin some candy corn. It is a pumpkin. Nothing happens, but it felt right."]];
          if (item) return [[N, "The pumpkin does not want that."]];
          if (f.lit) return [[N, "Warm, bright, grinning. Job done."]];
          if (f.candlePlaced) return [[N, "The candle waits in the pumpkin's mouth. It needs a flame."]];
          return [[N, "The Great Pumpkin. Dark, sad, enormous. Its mouth is a cave."], [N, "Inside, an empty candle holder the size of a bucket."]];
        } },
    ],
  },
};

/** The intro, said once on the first visit to the square. */
const INTRO = [
  [N, "Hollow Hill. Halloween night. Something is wrong: the Great Pumpkin on the hill is dark."],
  ["Mayor", "Oh thank goodness, a child in a costume. You'll do."],
  ["Mayor", "The Great Pumpkin has gone out. Without it the trick-or-treaters can't find the village. No visitors means no candy economy!"],
  ["Mayor", "Relighting it needs three things: a way through the hill gate, a proper candle, and a TRUE Halloween flame. A will-o'-wisp."],
  ["Mayor", "I'd go myself, but I'm... between capes. Tap the arrows to get about. Tap anything that looks interesting. Off you go."],
];

/** The crypt door: the symbols must be tapped moon, bat, pumpkin. */
const DOOR_CODE = ["moon", "bat", "pumpkin"];

function pressSymbol(symbol) {
  const f = flags();
  const code = f.doorCode.concat(symbol);
  if (code[code.length - 1] !== DOOR_CODE[code.length - 1]) {
    set("doorCode", []);
    return [[N, "The door grumbles and the carvings slide back. Wrong order."]];
  }
  set("doorCode", code);
  if (code.length < DOOR_CODE.length) return [[N, "The stone clicks. " + (DOOR_CODE.length - code.length) + " to go."]];
  set("doorOpen", true);
  return { lines: [[N, "With a groan the crypt door swings open. Something pale sits on the floor inside."]],
           then: () => showScene("crypt") };
}

/** What the ? button says, worked out from how far the player has got. */
function hintFor(f) {
  if (f.lit) return "You did it. Enjoy the glow.";
  if (f.candlePlaced && f.wispCaught) return "Open the jar at the pumpkin. The wisp knows what to do.";
  if (f.gateOpen && f.candleGiven && f.wispCaught) return "You have everything. Through the gate, up the hill. Candle first, then the wisp.";
  if (f.hatTaken && !f.hatReturned) return "Take the hat back to Stitch, the scarecrow at the gate.";
  if (f.spoonTaken && !f.hatTaken) return "Crows love shiny things. Show the crows in the graveyard your spoon.";
  if (!f.gateOpen && !f.spoonTaken) return "Stitch wants his hat. The crows have it, and crows like shiny things. The frogs in the bog know where something shiny is.";
  if (!f.candleGiven) return "Madame Wail's organ pipes are full of bats. Bats like sweets. You have a whole bag of candy corn.";
  if (f.skullTaken && !f.skullReturned) return "Give Fibula his skull back. He is in the graveyard, being headless.";
  if (!f.doorOpen) return "The crypt door opens when its carvings are tapped in the right order. Fibula's tombstone shows it: moon, bat, pumpkin.";
  if (!f.skullTaken) return "The skull is on the floor inside the crypt.";
  if (!f.wispCaught) return "Hold the jar (tap it in the strip below), then tap a wisp in the bog.";
  return "Up the hill!";
}

/* ========================================================================
   2. ENGINE
   ======================================================================== */

const el = {
  scene: document.getElementById("scene"),
  art: document.getElementById("sceneArt"),
  hotspots: document.getElementById("hotspots"),
  exits: document.getElementById("exits"),
  sceneName: document.getElementById("sceneName"),
  dialogue: document.getElementById("dialogue"),
  speaker: document.getElementById("speaker"),
  line: document.getElementById("line"),
  more: document.getElementById("more"),
  items: document.getElementById("items"),
  hintButton: document.getElementById("hintButton"),
  titleScreen: document.getElementById("titleScreen"),
  endScreen: document.getElementById("endScreen"),
  endTime: document.getElementById("endTime"),
  endRank: document.getElementById("endRank"),
  playAgain: document.getElementById("playAgain"),
};

const state = {
  phase: "title",          // "title", "playing", "done"
  sceneId: "square",
  flags: {},
  inventory: [],
  held: null,              // the item id currently held, or null
  queue: [],               // dialogue lines still to show
  afterQueue: null,        // runs when the queue is finished
  startedAt: 0,
  lastProgressAt: 0,
};

/* --- Story helpers (the STORY functions call these) --------------------- */

function flags() { return state.flags; }

function set(flag, value) {
  state.flags[flag] = value;
  noteProgress();
}

function has(item) { return state.inventory.includes(item); }

function give(item) {
  if (has(item)) return;
  state.inventory.push(item);
  renderInventory(item);
  noteProgress();
}

function take(item) {
  state.inventory = state.inventory.filter((each) => each !== item);
  if (state.held === item) hold(null);
  renderInventory();
}

/** The player did something that moves the story on: the hint nudge waits. */
function noteProgress() {
  state.lastProgressAt = performance.now();
  el.hintButton.classList.remove("is-nudging");
}

/* --- Scenes ------------------------------------------------------------- */

/** Draw a scene: its picture, its hotspots (the ones whose `when` is true
    right now) and its exits. Hotspot coordinates come in picture units
    (1000 x 1120) and go out as percentages of the scene box. */
function showScene(sceneId, glow = true) {
  const scene = STORY[sceneId];
  state.sceneId = sceneId;
  el.art.innerHTML = scene.art(state.flags);
  el.sceneName.textContent = scene.name;

  el.hotspots.innerHTML = "";
  scene.hotspots.forEach((spot) => {
    if (spot.when && !spot.when()) return;
    const button = document.createElement("button");
    button.className = "hotspot" + (glow ? " is-glowing" : "");
    button.setAttribute("aria-label", spot.label);
    // Never smaller than 140 picture units (14vw): the fingertip rule.
    const w = Math.max(140, spot.w);
    const h = Math.max(140, spot.h);
    const x = spot.x - (w - spot.w) / 2;
    const y = spot.y - (h - spot.h) / 2;
    button.style.left = (x / 10) + "%";
    button.style.top = (y / 11.2) + "%";
    button.style.width = (w / 10) + "%";
    button.style.height = (h / 11.2) + "%";
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      tapHotspot(spot);
    });
    el.hotspots.appendChild(button);
  });

  el.exits.innerHTML = "";
  scene.exits.forEach((exit) => {
    const button = document.createElement("button");
    button.className = "exit side-" + exit.side;
    const arrow = { top: "↑", bottom: "↓", left: "←", right: "→" }[exit.side];
    button.innerHTML = '<span class="arrow">' + arrow + '</span><span class="where">' + exit.label + "</span>";
    button.setAttribute("aria-label", "Go to " + exit.label);
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      tapExit(exit);
    });
    el.exits.appendChild(button);
  });
}

function tapExit(exit) {
  if (state.queue.length) { advance(); return; }
  if (exit.when && !exit.when()) { say(exit.blocked); return; }
  hold(null);
  showScene(exit.to);
  idleLine();
}

function tapHotspot(spot) {
  if (state.queue.length) { advance(); return; }
  const item = state.held;
  const before = JSON.stringify(state.flags);
  const outcome = spot.tap(item);
  hold(null);
  if (Array.isArray(outcome)) say(outcome);
  else say(outcome.lines, outcome.then);
  // Redraw only if the story moved on (the crows lost the hat, the door
  // opened): a redraw restarts the little animations, so not every tap.
  if (JSON.stringify(state.flags) !== before) showScene(state.sceneId, false);
}

/* --- Dialogue ----------------------------------------------------------- */

/** Show lines one at a time; each tap on the box shows the next. */
function say(lines, then) {
  state.queue = lines.slice();
  state.afterQueue = then || null;
  advance();
}

function advance() {
  if (state.queue.length === 0) return;
  const [who, text] = state.queue.shift();
  el.speaker.textContent = who;
  el.line.textContent = text;
  el.line.classList.toggle("is-narration", who === N);
  el.more.hidden = state.queue.length === 0;
  if (state.queue.length === 0 && state.afterQueue) {
    // The last line is on screen; run what follows now, so an item pops
    // into the strip while the line that mentions it is still showing.
    const then = state.afterQueue;
    state.afterQueue = null;
    then();
  }
}

/** The quiet prompt when nobody is talking. */
function idleLine() {
  el.speaker.textContent = "";
  el.line.textContent = STORY[state.sceneId].name + ". Tap things to look at them. Tap the arrows to walk.";
  el.line.classList.add("is-narration");
  el.more.hidden = true;
}

/* --- Inventory ---------------------------------------------------------- */

function renderInventory(newItem) {
  el.items.innerHTML = "";
  state.inventory.forEach((item) => {
    const button = document.createElement("button");
    button.className = "item" + (item === state.held ? " is-held" : "") + (item === newItem ? " is-new" : "");
    button.innerHTML = ART.ITEM_ICONS[item];
    button.setAttribute("aria-label", ITEM_NAMES[item]);
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      if (state.queue.length) { advance(); return; }
      hold(state.held === item ? null : item);
      if (state.held) {
        el.speaker.textContent = "";
        el.line.textContent = "Holding: " + ITEM_NAMES[item] + ". Tap something to use it on, or tap it again to put it away.";
        el.line.classList.add("is-narration");
      } else {
        idleLine();
      }
    });
    el.items.appendChild(button);
  });
}

/** Hold an item (or null for empty hands). The scene shows rings on
    everything tappable while something is held. */
function hold(item) {
  state.held = item;
  el.scene.classList.toggle("is-holding", item !== null);
  el.items.querySelectorAll(".item").forEach((button, i) => {
    button.classList.toggle("is-held", state.inventory[i] === item);
  });
}

/* ========================================================================
   3. START, HINTS, THE END
   ======================================================================== */

function start() {
  state.phase = "playing";
  state.flags = JSON.parse(JSON.stringify(FRESH_FLAGS));
  state.inventory = [];
  state.held = null;
  state.queue = [];
  state.afterQueue = null;
  state.startedAt = performance.now();
  noteProgress();
  el.titleScreen.hidden = true;
  el.endScreen.hidden = true;
  renderInventory();
  give("candy");
  showScene("square");
  set("metMayor", true);
  say(INTRO);
}

/** Runs after the last line of the finale. */
function finish() {
  state.phase = "done";
  showScene("hilltop");   // redraw: the pumpkin is lit now
  const seconds = Math.round((performance.now() - state.startedAt) / 1000);
  const minutes = Math.floor(seconds / 60);
  el.endTime.textContent = "You relit Hollow Hill in " + minutes + " min " + (seconds % 60) + " s.";
  el.endRank.textContent =
    minutes < 6 ? "Rank: Hollow Hill Legend" :
    minutes < 10 ? "Rank: Night Navigator" :
    minutes < 15 ? "Rank: Steady Lantern-Bearer" :
    "Rank: Thorough Trick-or-Treater (you read every sign, didn't you)";
  setTimeout(() => { el.endScreen.hidden = false; }, 2500);
}

/* Taps. Anywhere on the scene or the dialogue box while someone is
   talking = next line. The hotspots and exits stop their own taps from
   reaching here. */
el.scene.addEventListener("pointerdown", () => {
  if (state.phase !== "playing") return;
  if (state.queue.length) advance();
});
el.dialogue.addEventListener("pointerdown", () => {
  if (state.phase !== "playing") return;
  if (state.queue.length) advance();
});

el.hintButton.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  if (state.phase !== "playing") return;
  hold(null);
  say([["Hint", hintFor(state.flags)]]);
  el.hintButton.classList.remove("is-nudging");
  state.lastProgressAt = performance.now();
});

el.titleScreen.addEventListener("pointerdown", start);
el.playAgain.addEventListener("click", start);

// A gentle nudge: if nothing has moved the story on for a minute, the ?
// button pulses. It never interrupts.
setInterval(() => {
  if (state.phase !== "playing") return;
  if (performance.now() - state.lastProgressAt > 60000) el.hintButton.classList.add("is-nudging");
}, 2000);

state.flags = JSON.parse(JSON.stringify(FRESH_FLAGS));
showScene("square", false);   // the picture behind the title screen
idleLine();
