/* ============================================================================
   Halloween 2026 - app/app.js   (the APP: frame, panels, switching games)

   Each game is its own little web page in games/<id>/index.html. The app
   shows the chosen game by pointing the game panel's <iframe> at that page.
   The app and the games do not talk to each other yet - that comes later.

   Section map:
     1. The list of games
     2. Bottom panel: open, close, toggle
     3. Bottom panel tabs: App / This Game
     4. Switching games
     5. Start up
   ========================================================================= */

// Bump this (and the ?v= tags in index.html) whenever code changes, so
// phones fetch fresh copies instead of old cached ones.
const APP_VERSION = "2026-0927-rules3";

/* ------------------------------------------------------------------------
   1. The list of games. THE ONE PLACE to add a game.
   id    = its folder name under games/ (lowercase, no spaces)
   title = shown on its button and in the top panel
   game0 is the default "home" game: loaded at start and whenever no other
   game is active. It does not get a button.
   --------------------------------------------------------------------- */

const HOME_GAME = { id: "game0", title: "Halloween 2026" };

const GAMES = [
  { id: "game1", title: "Pie Maker" },
  { id: "game2", title: "Game 2" },
  { id: "game3", title: "Game 3" },
  { id: "game4", title: "Game 4" },
];

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
  gameFrame.src = "./games/" + game.id + "/index.html?v=" + APP_VERSION;
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
  loadGame(HOME_GAME);
  showTab("app");
  openDrawer();
}

document.getElementById("homeButton").addEventListener("click", goHome);

/** Make one button in the App tab for each game in GAMES. */
function makeGameButtons() {
  const holder = document.getElementById("gameButtons");
  GAMES.forEach((game) => {
    const button = document.createElement("button");
    button.className = "game-button";
    button.textContent = game.title;
    button.addEventListener("click", () => startGame(game));
    holder.appendChild(button);
  });
}

/* ------------------------------------------------------------------------
   5. Start up: build the buttons, show game0, panel open.
   --------------------------------------------------------------------- */

makeGameButtons();
goHome();
