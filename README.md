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
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript (app.js holds the list of games)
games/README - game design requirements.md   THE RULES for mini games (the only copy)
games/game0/        the home game (pumpkin patch): shown at start and when no game is active
games/game1..4/     one folder per game: index.html, its own css/js, assets/, README
start-local/        a small web server for testing on this machine
claude-john-docs/   design notes and session summaries
```

Plain HTML, CSS and JavaScript. No framework, no build step.

## Publishing a change

Phones keep old copies of the code. Before pushing, change the version stamp
in **three places** so they fetch fresh files: `APP_VERSION` in `app/app.js`,
and the two `?v=` tags in `index.html`.
