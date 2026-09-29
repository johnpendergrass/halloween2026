# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.

**Status: template (September 2026).** The three-panel frame (top bar, game
panel, sliding bottom panel) is the app. The five games in it are demos and
placeholders for others to copy: a pumpkin-patch home screen (game0), Pie
Maker (game1), and three empty slots. **The rules for writing a mini game
are in `games/README - game design requirements.md`.**

## Running it on your own machine

Double-click **`start-local/start-halloween.bat`**. It starts a small web
server and opens the game at `http://localhost:8091/`. It also prints an
address for testing on a phone on the same Wi-Fi.

## What is in here

```text
index.html          the app's entry point (the 9:16 frame and its three panels)
games.json          THE LIST OF GAMES: one entry per slot (game0..game4), read at start-up
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript (reads games.json, builds the buttons)
games/README - game design requirements.md   THE RULES for mini games (the only copy)
games/game0/        the home game (pumpkin patch): shown at start and when no game is active
games/game1..4/     one folder per game: index.html, its own css/js, assets/, README
start-local/        a small web server for testing on this machine
claude-john-docs/   design notes and session summaries
```

Plain HTML, CSS and JavaScript. No framework, no build step.

## Adding a game

1. Take one of the slots `games/game2/`, `game3/` or `game4/`. Put your
   `index.html`, CSS, JS and `assets/` in that folder, replacing the
   placeholder. Follow `games/README - game design requirements.md`.
2. Fill in your slot's entry in `games.json` (title, author, description).
3. Run `start-local/start-halloween.bat` and tap your game's button.

Nothing in `app/` needs to change. `game0` is the home screen and `game1` is
the Pie Maker demo.

## Publishing a change

Phones keep old copies of the code. Before pushing, change the version stamp
in **three places** so they fetch fresh files: `APP_VERSION` in `app/app.js`,
and the two `?v=` tags in `index.html`.
