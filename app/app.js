/* ============================================================================
   Halloween 2026 - app/app.js   (the APP: frame, panels, switching games)

   Each game is its own little web page in games/<slot>/index.html. The app
   shows the chosen game by pointing the game panel's <iframe> at that page.
   The app and the games do not talk to each other yet - that comes later.

   The list of games is NOT in this file. It is in games.json, next to
   index.html, and the app reads it at start-up (section 5). A game author
   only touches their own games/<slot>/ folder and their entry in games.json.

   Section map:
     1. Settings and the games list
     2. Bottom panel: open, close, toggle
     3. Bottom panel tabs: App / This Game
     4. Switching games
     5. Start up: read games.json, build the buttons, show the home game
   ========================================================================= */

// Bump this (and the ?v= tags in index.html) whenever code changes, so
// phones fetch fresh copies instead of old cached ones.
const APP_VERSION = "2026-0929-gamesjson";

/* ------------------------------------------------------------------------
   1. Settings and the games list

   games.json holds one entry per slot: { slot, title, author, description }.
   slot  = the folder name under games/ (game0 ... game4)
   title = shown on the game's button and in the top panel
   The slot named HOME_SLOT is the home game: loaded at start and whenever
   no other game is active. It gets no button.
   These two variables are filled in by startUp() once games.json has been
   read; until then they are empty.
   --------------------------------------------------------------------- */

const GAMES_FILE = "./games.json";
const HOME_SLOT = "game0";

let homeGame = null;   // the games.json entry for HOME_SLOT
let games = [];        // every other entry, in games.json order

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

/* ------------------------------------------------------------------------
   4. Switching games
   --------------------------------------------------------------------- */

const gameFrame = document.getElementById("gameFrame");
const topTitle = document.getElementById("topTitle");

/** Show a game's page in the game panel and put its name in the top panel.
    Changing the iframe's src throws the old game away completely. */
function loadGame(game) {
  gameFrame.src = "./games/" + game.slot + "/index.html?v=" + APP_VERSION;
  gameFrame.title = game.title;
  topTitle.textContent = game.title;
}

/** Start one of the real games and get the bottom panel out of the way. */
function startGame(game) {
  loadGame(game);
  closeDrawer();
}

/** Back to game0 (the home game) with the bottom panel open. */
function goHome() {
  loadGame(homeGame);
  showTab("app");
  openDrawer();
}

document.getElementById("homeButton").addEventListener("click", goHome);

/** Make one button in the App tab for each game (the home game has none). */
function makeGameButtons() {
  const holder = document.getElementById("gameButtons");
  games.forEach((game) => {
    const button = document.createElement("button");
    button.className = "game-button";
    button.textContent = game.title;
    button.addEventListener("click", () => startGame(game));
    holder.appendChild(button);
  });
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
  const data = await response.json();
  if (!Array.isArray(data.games)) {
    throw new Error(GAMES_FILE + ' has no "games" list');
  }
  return data.games;
}

/** Put a readable message where the game buttons would have been. */
function showStartupError(error) {
  const holder = document.getElementById("gameButtons");
  holder.textContent =
    "Could not read the list of games (" + error.message + "). " +
    "Open the app through start-local/start-halloween.bat or a web server, " +
    "not by double-clicking index.html.";
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

  homeGame = allGames.find((game) => game.slot === HOME_SLOT);
  games = allGames.filter((game) => game.slot !== HOME_SLOT);

  if (!homeGame) {
    showStartupError(new Error('no "' + HOME_SLOT + '" entry in ' + GAMES_FILE));
    return;
  }

  makeGameButtons();
  goHome();
}

startUp();
