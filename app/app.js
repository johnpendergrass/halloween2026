/* ============================================================================
   Halloween 2026 - app/app.js   (the APP: frame, panels, switching games)

   Each game is its own little web page in games/<folder_name>/index.html. The app
   shows the chosen game by pointing the game panel's <iframe> at that page.
   A game can tell the app one thing so far: its score (section 4).

   The list of games is NOT in this file. It is in games.json, next to
   index.html, and the app reads it at start-up (section 6). A game author
   only touches their own games/<folder_name>/ folder and their entry in games.json.

   Section map:
     1. Settings and the games list
     2. Bottom panel: open, close, toggle
     3. Bottom panel tabs: App / This Game (and filling This Game)
     4. High scores and switches (the two columns in the This Game tab)
     5. Switching games
     6. Start up: read games.json, build the buttons, show the home game
   ========================================================================= */

// Bump this (and the ?v= tags in index.html) whenever code changes, so
// phones fetch fresh copies instead of old cached ones.
const APP_VERSION = "2026-1001-scores";

/* ------------------------------------------------------------------------
   1. Settings and the games list

   games.json holds one entry per game. The fields the app uses here:
     folder_name  = the folder under games/ (lowercase)
     goes_in_slot = "home" for the home game, or 1..LAST_SLOT for a button
                    on the board (see makeGameButtons). Anything else (say
                    9, or "") = listed but not shown.
     title        = the button's spoken name (aria-label) and tooltip
     short_title  = in the top panel
     icon         = a square picture inside the button, relative to the
                    game's folder. Missing or not up to spec (see
                    iconQualifies) = the short_title as text instead.
     settings     = up to three on/off switches for the This Game tab
                    (section 4).
   The full field list is in the _about block at the bottom of games.json.
   The home game is loaded at start and whenever no other game is active.
   It gets no button. homeGame and games are filled in by startUp() once
   games.json has been read; until then they are empty.
   --------------------------------------------------------------------- */

const GAMES_FILE = "./games.json";
// The button board is two rows of four fixed cells. A slot number is a
// cell: 1..4 across the upper row, 5..8 across the lower row, and a game
// always sits in its own cell (slot 1 is always top far left). Cells nobody
// claimed stay empty. The one exception: when only ONE row has games, that
// row is drawn in the middle of the board's space instead of at the top or
// bottom of it.
const LAST_SLOT = 8;
const SLOTS_PER_ROW = 4;
const DEFAULT_ICON = "./app/default-icon.svg";   // only when there is no text either

// The icon spec, in real pixels. Designers are told "256 x 256, square",
// but hand-cropped icons are rarely exact, so each side may be anywhere in
// ICON_MIN..ICON_MAX and the two sides may differ by up to ICON_SQUARE_SLACK.
// The button scales whatever arrives, so a little off looks fine.
const ICON_MIN = 200;
const ICON_MAX = 300;
const ICON_SQUARE_SLACK = 10;

let homeGame = null;   // the entry whose goes_in_slot is "home"
let games = [];        // the entries with a button, sorted by slot
let currentGame = null;   // the entry of the game now in the game panel

/* ------------------------------------------------------------------------
   2. Bottom panel: open, close, toggle
   --------------------------------------------------------------------- */

const drawer = document.getElementById("drawer");
const drawerStrip = document.getElementById("drawerStrip");
const drawerContent = document.getElementById("drawerContent");

function openDrawer() {
  drawer.classList.add("is-open");
  drawerContent.inert = false;
  drawerStrip.setAttribute("aria-label", "Close panel");
}

function closeDrawer() {
  showClearQuestion(false);   // an unanswered "You sure?" does not wait around
  drawer.classList.remove("is-open");
  drawerContent.inert = true;
  drawerStrip.setAttribute("aria-label", "Open panel");
}

function toggleDrawer() {
  if (drawer.classList.contains("is-open")) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

drawerStrip.addEventListener("click", toggleDrawer);
document.getElementById("menuButton").addEventListener("click", toggleDrawer);

/* ------------------------------------------------------------------------
   3. Bottom panel tabs: App / This Game
   --------------------------------------------------------------------- */

function showTab(tabName) {
  showClearQuestion(false);   // as in closeDrawer()
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
  document.getElementById("tab-app").hidden = tabName !== "app";
  document.getElementById("tab-game").hidden = tabName !== "game";
}

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.tab));
});

/** Write one piece of text into an element, or hide the element when the
    text is empty, so a games.json entry with blanks leaves no gaps. */
function setTextOrHide(id, text) {
  const element = document.getElementById(id);
  element.textContent = text || "";
  element.hidden = !text;
}

/** Fill the This Game tab from a games.json entry. Called whenever a game
    is loaded, so the tab always describes what is in the game panel. The
    text comes straight from the file; the high scores and the switches
    are section 4. */
function fillThisGameTab(game) {
  fillScores(game);
  fillSwitches(game);
  setTextOrHide("thisGameTitle", game.title);
  // "Designer, date" on one line, whichever parts exist.
  setTextOrHide("thisGameByline", [game.designer, game.date].filter(Boolean).join(", "));
  setTextOrHide("thisGameDescription", game.description);
  setTextOrHide("thisGameHowToPlay", game.how_to_play);
  document.getElementById("thisGameHowHeading").hidden = !game.how_to_play;
  setTextOrHide("thisGameCredits", game.credits ? "Credits: " + game.credits : "");

  // The icon, under the same spec as the buttons; hidden if it fails.
  const icon = document.getElementById("thisGameIcon");
  icon.hidden = true;
  if (game.icon) {
    icon.onload = () => { icon.hidden = !iconQualifies(icon); };
    icon.onerror = () => { icon.hidden = true; };
    icon.src = iconPathFor(game);
  }
}

/* ------------------------------------------------------------------------
   4. High scores and switches (the two columns in the This Game tab)

   WHERE THESE ARE KEPT. A web page can read games.json but cannot write
   to it: a web server such as GitHub Pages only hands files out. What a
   page CAN do is keep small notes in the browser's own storage on this
   device, called localStorage. Each note has a name (a "key") and holds
   text; the app stores JSON text in two kinds of note:

     "halloween2026:app"            { "sound": true }
     "halloween2026:<folder_name>"  { "scores": [ ... ], "settings": [0, 1] }

   one for the whole app, and one per game. So the scores and the switch
   positions belong to this phone or PC only; another player's phone has
   its own. (To look at them: the browser's developer tools, Application,
   Local Storage.)

   SCORES COME FROM THE GAMES. A game includes games/game-helper.js and
   calls Halloween.reportScore(42) when a game is over; the helper passes
   that on to reportScore() below, through window.halloweenApp.

   THE SWITCHES ARE NOT CONNECTED TO THE GAMES. They are shown and
   remembered, but no game can read them, so they change nothing in a game.
   --------------------------------------------------------------------- */

const STORAGE_PREFIX = "halloween2026:";
const APP_STORAGE_KEY = STORAGE_PREFIX + "app";
const SCORES_SHOWN = 5;          // the High scores list is always this long
const MAX_GAME_SWITCHES = 3;     // a game's own switches; Sound is extra

/** The name of a game's note in the browser's storage. */
function storageKeyFor(game) {
  return STORAGE_PREFIX + game.folder_name;
}

/** Read one note and return it as an object. Returns {} when there is no
    note yet, and also when the storage cannot be read (some private
    browsing modes) or holds something unexpected, so the app carries on
    with nothing remembered rather than stopping. */
function readSaved(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    const isPlainObject = data !== null && typeof data === "object" && !Array.isArray(data);
    return isPlainObject ? data : {};
  } catch (error) {
    return {};
  }
}

/** Write one note. If the browser refuses, the choice simply is not
    remembered next time. */
function writeSaved(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save " + key + " in this browser:", error);
  }
}

/** Today's date on this device, as "2026-10-01" (year-month-day). That
    is how a score's date is saved: it cannot be misread, whatever country
    the reader is from. */
function todayAsText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");   // months count from 0
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

/** A saved date such as "2026-10-01" the way the list shows it:
    "(10-01-2026)", month-day-year. No date saved = nothing shown. */
function dateForList(savedDate) {
  if (typeof savedDate !== "string") return "";
  const [year, month, day] = savedDate.split("-");
  if (!year || !month || !day) return "";
  return "(" + month + "-" + day + "-" + year + ")";
}

/** The five lines of the High scores column: "1." to "5.", then the score
    (right-adjusted) or "---" where there is none yet, then the date the
    score was made, e.g.  1.  42 (10-01-2026). A saved score looks like
      { "value": 42, "date": "2026-10-01" }                         or
      { "value": 42, "text": "Master Chef", "date": "2026-10-01" }
    and the text, when a game gave one, is shown in place of the number. */
function fillScores(game) {
  const savedScores = readSaved(storageKeyFor(game)).scores;
  const scores = Array.isArray(savedScores) ? savedScores : [];

  // Nothing to clear = the Clear scores button is dimmed and does nothing.
  document.getElementById("clearScores").disabled = scores.length === 0;
  // A list drawn afresh never starts with the "You sure?" question showing.
  showClearQuestion(false);

  const list = document.getElementById("thisGameScores");
  list.replaceChildren();
  for (let place = 1; place <= SCORES_SHOWN; place += 1) {
    const score = scores[place - 1];

    const rank = document.createElement("span");
    rank.textContent = place + ".";
    const value = document.createElement("span");
    value.className = "score-value";
    value.textContent = score ? (score.text || String(score.value)) : "---";
    const date = document.createElement("span");
    date.className = "score-date";
    date.textContent = score ? dateForList(score.date) : "";

    const row = document.createElement("div");
    row.className = "score-row";
    row.append(rank, value, date);
    list.appendChild(row);
  }
}

/** A game reports a result (through games/game-helper.js). `value` is a
    number, higher is better; `text` is optional and is shown in place of
    the number. The app adds today's date. The score joins the list of the
    game now in the panel, the list is sorted best first and cut back to
    five, saved, and drawn again.
    A value that is not a number, or is 0 or less, is not recorded. */
function reportScore(value, text) {
  if (!currentGame) return;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    console.info('"' + currentGame.title + '" reported the score ' +
                 JSON.stringify(value) + ", which is not recorded (a score " +
                 "must be a number above 0).");
    return;
  }

  const score = { value: value, date: todayAsText() };
  const hasText = text !== undefined && text !== null && String(text).trim() !== "";
  if (hasText) score.text = String(text).trim();

  const data = readSaved(storageKeyFor(currentGame));
  const scores = Array.isArray(data.scores) ? data.scores : [];
  scores.push(score);
  // Highest value first. Equal values keep their order, so of two equal
  // scores the earlier one stays above the newer one.
  scores.sort((a, b) => b.value - a.value);
  data.scores = scores.slice(0, SCORES_SHOWN);
  writeSaved(storageKeyFor(currentGame), data);

  fillScores(currentGame);
}

/** Clearing takes two taps, so a stray touch cannot wipe the list. The
    Clear scores button only swaps the column's top line for the question
    "You sure?  Yes  No" (isAsking = true); No, or leaving the tab, swaps
    it back (isAsking = false). Only Yes clears. */
function showClearQuestion(isAsking) {
  document.getElementById("scoreHead").hidden = isAsking;
  document.getElementById("clearQuestion").hidden = !isAsking;
}

/** The Yes button: forget every saved score of the game now in the panel.
    There is no undo. The game's switch positions are kept, and so are the
    other games' scores. */
function clearScores() {
  if (!currentGame) return;
  const data = readSaved(storageKeyFor(currentGame));
  delete data.scores;
  writeSaved(storageKeyFor(currentGame), data);
  fillScores(currentGame);   // redraws the list and puts the top line back
}

document.getElementById("clearScores").addEventListener("click", () => showClearQuestion(true));
document.getElementById("clearNo").addEventListener("click", () => showClearQuestion(false));
document.getElementById("clearYes").addEventListener("click", clearScores);

// What a game's page can reach. The game sits in an iframe, and from in
// there window.parent is this page; games/game-helper.js looks for this
// object on it. Only what is listed here is meant for games.
window.halloweenApp = {
  reportScore: reportScore,
};

/** Is sound switched on? One answer for the whole app, on until the
    player turns it off. */
function soundIsOn() {
  return readSaved(APP_STORAGE_KEY).sound !== false;
}

function saveSound(isOn) {
  const data = readSaved(APP_STORAGE_KEY);
  data.sound = isOn;
  writeSaved(APP_STORAGE_KEY, data);
}

/** The switches a game asks for in its games.json entry: a list of
    { "label": "Easy / Hard", "default": 0 }. No list = no switches. */
function gameSwitches(game) {
  const list = Array.isArray(game.settings) ? game.settings : [];
  if (list.length > MAX_GAME_SWITCHES) {
    console.warn('games.json: "' + game.title + '" has ' + list.length +
                 " settings; only the first " + MAX_GAME_SWITCHES + " are shown.");
  }
  return list.slice(0, MAX_GAME_SWITCHES);
}

/** Where each of a game's switches stands now, as a list of 0 (left) and
    1 (right), in the same order as in games.json. A switch the player has
    touched uses the saved position; one never touched uses its default. */
function currentSettings(game) {
  const savedSettings = readSaved(storageKeyFor(game)).settings;
  const saved = Array.isArray(savedSettings) ? savedSettings : [];
  return gameSwitches(game).map((entry, index) => {
    if (saved[index] === 0 || saved[index] === 1) return saved[index];
    return entry.default === 1 ? 1 : 0;
  });
}

/** Remember one switch of one game. Only the switch that was touched is
    written; the places of untouched switches stay empty (null in the
    saved text), so those keep following their games.json default. */
function saveSetting(game, index, value) {
  const data = readSaved(storageKeyFor(game));
  const settings = Array.isArray(data.settings) ? data.settings : [];
  settings[index] = value;
  data.settings = settings;
  writeSaved(storageKeyFor(game), data);
}

/** One switch: a line of text with a slider below it. The whole thing is
    a single button, so the text is tappable too and the target is big
    enough for a fingertip. role="switch" and aria-checked tell a screen
    reader it is an on/off control; the CSS draws the slider's position
    from aria-checked, so that one attribute is the only state there is.
    onChange(isOn) is called with true (right) or false (left). */
function makeSwitch(label, isOn, onChange) {
  const button = document.createElement("button");
  button.className = "setting";
  button.setAttribute("role", "switch");
  button.setAttribute("aria-checked", String(isOn));

  const text = document.createElement("span");
  text.className = "setting-label";
  text.textContent = label;
  const slider = document.createElement("span");
  slider.className = "setting-slider";      // the knob is drawn by the CSS
  button.append(text, slider);

  button.addEventListener("click", () => {
    const nowOn = button.getAttribute("aria-checked") !== "true";
    button.setAttribute("aria-checked", String(nowOn));
    onChange(nowOn);
  });
  return button;
}

/** The switches column: Sound first (every game has it, and it is one
    switch for the whole app: off here is off in every game), then the
    game's own switches. */
function fillSwitches(game) {
  const holder = document.getElementById("thisGameSettings");
  holder.replaceChildren();
  holder.appendChild(makeSwitch("Sound", soundIsOn(), saveSound));

  const positions = currentSettings(game);
  gameSwitches(game).forEach((entry, index) => {
    const label = entry.label || "Option " + (index + 1);
    const saveThisSwitch = (isOn) => saveSetting(game, index, isOn ? 1 : 0);
    holder.appendChild(makeSwitch(label, positions[index] === 1, saveThisSwitch));
  });

  // Sound works at once; a game's own switches wait for a new game.
  if (positions.length > 0) {
    const hint = document.createElement("p");
    hint.className = "setting-hint";
    hint.textContent = "Game options apply to your next game.";
    holder.appendChild(hint);
  }
}

/* ------------------------------------------------------------------------
   5. Switching games
   --------------------------------------------------------------------- */

const gameFrame = document.getElementById("gameFrame");
const topTitle = document.getElementById("topTitle");

/** Show a game's page in the game panel and put its name in the top panel.
    Changing the iframe's src throws the old game away completely. */
function loadGame(game) {
  currentGame = game;   // a score reported from now on belongs to this game
  gameFrame.src = "./games/" + game.folder_name + "/index.html?v=" + APP_VERSION;
  gameFrame.title = game.title;
  topTitle.textContent = game.short_title || game.title;
  fillThisGameTab(game);
  markCurrentButton(game);
}

/** Show which game is in the panel: its button looks pressed in (CSS
    .is-current) and is announced as the current one to screen readers. */
function markCurrentButton(game) {
  document.querySelectorAll(".game-button").forEach((button) => {
    const isCurrent = button.dataset.folder === game.folder_name;
    button.classList.toggle("is-current", isCurrent);
    if (isCurrent) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

/** Start one of the real games and get the bottom panel out of the way. */
function startGame(game) {
  loadGame(game);
  showTab("game");   // next time the drawer opens, it is about this game
  closeDrawer();
}

/** Back to game0 (the home game) with the bottom panel open. */
function goHome() {
  loadGame(homeGame);
  showTab("app");
  openDrawer();
}

document.getElementById("homeButton").addEventListener("click", goHome);

/** The icon's URL: the games.json path is relative to the game's folder. */
function iconPathFor(game) {
  return "./games/" + game.folder_name + "/" + game.icon;
}

/** Is a loaded icon within the spec? SVG has no real pixel size (it scales
    to anything), so it passes as long as it loaded. PNG must be roughly
    square and roughly 256 on a side; see the ICON_ constants. */
function iconQualifies(img) {
  if (img.src.toLowerCase().endsWith(".svg")) return true;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const sizeOk = w >= ICON_MIN && w <= ICON_MAX && h >= ICON_MIN && h <= ICON_MAX;
  const squareOk = Math.abs(w - h) <= ICON_SQUARE_SLACK;
  return sizeOk && squareOk;
}

/** No usable icon: show the game's short name as text on the button. If
    there is no name at all, show the default ghost so the button is not
    blank (which also flags a half-filled games.json entry). */
function showTextInstead(button, game) {
  button.replaceChildren();
  const text = game.short_title || game.title || "";
  if (text) {
    button.classList.add("is-text");
    button.textContent = text;
  } else {
    const ghost = document.createElement("img");
    ghost.src = DEFAULT_ICON;
    ghost.alt = "";
    ghost.draggable = false;
    button.appendChild(ghost);
  }
}

/** One square orange button holding only the game's icon (or, failing
    that, its short name). The full name is not printed on it (John's
    choice), so it goes in aria-label for screen readers and in title for
    a mouse tooltip on a PC. */
function makeIconButton(game) {
  const button = document.createElement("button");
  button.className = "game-button";
  button.setAttribute("aria-label", game.title);
  button.title = game.title;
  button.dataset.folder = game.folder_name;   // so markCurrentButton() can find it
  button.addEventListener("click", () => startGame(game));

  if (!game.icon) {
    showTextInstead(button, game);
    return button;
  }

  const icon = document.createElement("img");
  icon.alt = "";                 // the button already has the name
  icon.draggable = false;
  // Decide only once the picture has loaded and its real size is known.
  icon.addEventListener("load", () => {
    if (iconQualifies(icon)) return;
    console.warn('games.json: the icon for "' + game.title + '" is ' +
                 icon.naturalWidth + " x " + icon.naturalHeight +
                 " real pixels; it must be " + ICON_MIN + "-" + ICON_MAX +
                 " on each side and within " + ICON_SQUARE_SLACK +
                 " of square. Showing the short title instead.");
    showTextInstead(button, game);
  }, { once: true });
  icon.addEventListener("error", () => {
    console.warn('games.json: the icon for "' + game.title + '" (' + icon.src +
                 ") could not be loaded. Showing the short title instead.");
    showTextInstead(button, game);
  }, { once: true });
  icon.src = iconPathFor(game);   // set last, after the listeners are in place

  button.appendChild(icon);
  return button;
}

/** The App tab: the home game's button alone at the top, then the board:
    an upper row for slots 1..4 and a lower row for slots 5..8. Each row is
    a four-column CSS grid, and every button is told which column is its
    cell, so slot 1 is always far left and slot 4 always far right, however
    many games there are. A row with no games is not drawn at all, and the
    board's CSS then centres the remaining row in the two-row space. */
function makeGameButtons() {
  const holder = document.getElementById("gameButtons");
  holder.appendChild(makeIconButton(homeGame));

  const board = document.createElement("div");
  board.className = "game-board";
  const upperRow = games.filter((game) => game.goes_in_slot <= SLOTS_PER_ROW);
  const lowerRow = games.filter((game) => game.goes_in_slot > SLOTS_PER_ROW);
  [upperRow, lowerRow].forEach((rowGames) => {
    if (rowGames.length === 0) return;   // an empty row is not drawn
    const row = document.createElement("div");
    row.className = "board-row";
    rowGames.forEach((game) => {
      const button = makeIconButton(game);
      // Slots 1 and 5 are column 1, 2 and 6 column 2, and so on.
      const column = ((game.goes_in_slot - 1) % SLOTS_PER_ROW) + 1;
      button.style.gridColumn = String(column);
      row.appendChild(button);
    });
    board.appendChild(row);
  });
  holder.appendChild(board);
}

/* ------------------------------------------------------------------------
   6. Start up: read games.json, build the buttons, show the home game.

   fetch() only works over http(s), not when index.html is opened straight
   from the disk (file://). Always test through start-local/ or a web
   server. If games.json cannot be read, the app says so in the App tab
   instead of showing a blank frame.
   --------------------------------------------------------------------- */

/** Read games.json and return its "games" array. Throws if anything fails. */
async function readGamesFile() {
  // Same ?v= trick as the scripts: a phone must not reuse an old copy.
  const response = await fetch(GAMES_FILE + "?v=" + APP_VERSION);
  if (!response.ok) {
    throw new Error(GAMES_FILE + " returned " + response.status);
  }
  // JSON.parse throws on any punctuation mistake in a hand-edited file.
  // Browsers word that error differently and rarely say where it is, so
  // the app just says the file needs fixing (a JSON checker finds the line).
  let data;
  try {
    data = JSON.parse(await response.text());
  } catch (parseError) {
    throw new Error(GAMES_FILE + " has some invalid JSON in it. You need to " +
                    "fix that file. (A JSON checker such as jsonlint.com will " +
                    "point at the line.)");
  }
  if (!Array.isArray(data.games)) {
    throw new Error(GAMES_FILE + ' has no "games" list');
  }
  return data.games;
}

/** The entries that get a button: goes_in_slot 1..LAST_SLOT, sorted by
    slot. If two entries claim the same slot the first in the file wins;
    the loser, and any entry with a slot outside the range, is left out
    (with a console note so a typo in games.json is easy to spot). */
function pickButtonGames(allGames) {
  const bySlot = new Map();   // slot number -> the entry that won it
  allGames.forEach((game) => {
    const slot = game.goes_in_slot;
    if (slot === "home") return;
    if (!Number.isInteger(slot) || slot < 1 || slot > LAST_SLOT) {
      console.info('games.json: "' + game.title + '" has goes_in_slot ' +
                   JSON.stringify(slot) + ", so it gets no button.");
      return;
    }
    if (bySlot.has(slot)) {
      console.warn('games.json: slot ' + slot + ' is already taken by "' +
                   bySlot.get(slot).title + '"; "' + game.title + '" is ignored.');
      return;
    }
    bySlot.set(slot, game);
  });
  return [...bySlot.keys()].sort((a, b) => a - b).map((slot) => bySlot.get(slot));
}

/** Put a readable message where the game buttons would have been. */
function showStartupError(error) {
  const holder = document.getElementById("gameButtons");
  holder.className = "startup-error";     // plain text, not the button board
  let message = "Could not read the list of games.\n" + error.message;
  if (location.protocol === "file:") {
    message += "\n\nfetch() cannot read files opened straight from the disk. " +
               "Open the app through start-local/start-halloween.bat or a " +
               "web server, not by double-clicking index.html.";
  }
  holder.textContent = message;
  console.error("Halloween 2026 start-up failed:", error);
}

async function startUp() {
  let allGames;
  try {
    allGames = await readGamesFile();
  } catch (error) {
    showStartupError(error);
    return;
  }

  homeGame = allGames.find((game) => game.goes_in_slot === "home");
  games = pickButtonGames(allGames);

  if (!homeGame) {
    showStartupError(new Error('no entry with goes_in_slot "home" in ' + GAMES_FILE));
    return;
  }

  makeGameButtons();
  goHome();
}

startUp();
