# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.

**Status: early scaffold (September 2026).** The three-panel frame (top bar,
game panel, sliding bottom panel) with five test games, each its own page
shown in the game panel: a pumpkin-patch home screen (game0), Pie Maker
(game1), and three placeholders. The rules for writing mini games are in
each game folder (`README - game design requirements.md`).

## Running it on your own machine

Double-click **`start-local/start-halloween.bat`**. It starts a small web
server and opens the game at `http://localhost:8091/`. It also prints an
address for testing on a phone on the same Wi-Fi.

## What is in here

```text
index.html          the app's entry point (the 9:16 frame and its three panels)
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript (app.js holds the list of games)
games/game0/        the home game (pumpkin patch): shown at start and when no game is active
games/game1..4/     one folder per game: index.html, its own css/js, assets/
mockups/            throwaway layout experiments (superseded by index.html)
start-local/        a small web server for testing on this machine
claude-john-docs/   design notes
```

Plain HTML, CSS and JavaScript. No framework, no build step.
