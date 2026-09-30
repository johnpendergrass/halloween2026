/* ============================================================================
   Halloween 2026 - app/app.js   (the APP: frame, panels, switching games)

   Each game is its own little web page in games/<folder_name>/index.html. The app
   shows the chosen game by pointing the game panel's <iframe> at that page.
   The app and the games do not talk to each other yet - that comes later.

   The list of games is NOT in this file. It is in games.json, next to
   index.html, and the app reads it at start-up (section 5). A game author
   only touches their own games/<folder_name>/ folder and their entry in games.json.

   Section map:
     1. Settings and the games list
     2. Bottom panel: open, close, toggle
     3. Bottom panel tabs: App / This Game (and filling This Game)
     4. Switching games
     5. Start up: read games.json, build the buttons, show the home game
   ========================================================================= */

// Bump this (and the ?v= tags in index.html) whenever code changes, so
// phones fetch fresh copies instead of old cached ones.
const APP_VERSION = "2026-0929-hollow";

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
    is loaded, so the tab always describes what is in the game panel. For
    now it is all static text from the file; scores and settings come
    later, once games can talk to the app. */
function fillThisGameTab(game) {
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
   4. Switching games
   --------------------------------------------------------------------- */

const gameFrame = document.getElementById("gameFrame");
const topTitle = document.getElementById("topTitle");

/** Show a game's page in the game panel and put its name in the top panel.
    Changing the iframe's src throws the old game away completely. */
function loadGame(game) {
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
   5. Start up: read games.json, build the buttons, show the home game.

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
