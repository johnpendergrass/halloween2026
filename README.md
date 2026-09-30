# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.

**Status: template (September 2026).** The three-panel frame (top bar, game
panel, sliding bottom panel) is the app. The games in it are demos and
placeholders for others to copy: a pumpkin-patch home screen, Pie Maker,
Stack-o'-Lantern, two deliberately wrong test games and six empty
placeholders. **The rules for writing a mini game
are in `games/README - game design requirements.md`.**

## Running it on your own machine

Double-click **`start-local/start-halloween.bat`**. It starts a small web
server and opens the game at `http://localhost:8091/`. It also prints an
address for testing on a phone on the same Wi-Fi.

## What is in here

```text
index.html          the app's entry point (the 9:16 frame and its three panels)
games.json          THE LIST OF GAMES: one entry per game (folder, slot, title, icon...), read at start-up
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript (reads games.json, builds the buttons)
games/README - game design requirements.md   THE RULES for mini games (the only copy)
games/pumpkin-patch/  the home game: shown at start and when no other game is active
games/pie-maker/      the demo game that follows the rules
games/stack-o-lantern/  a second finished game (a one-tap stacker)
games/game1..8/       one folder per game: index.html, its own css/js, assets/, README
                      (game2, game3 = wrong on purpose; game1, game4..8 = placeholders)
start-local/        a small web server for testing on this machine
claude-john-docs/   design notes and session summaries
```

Plain HTML, CSS and JavaScript. No framework, no build step.

## Adding a game

1. Make a folder `games/<your-game>/` (lowercase, no spaces) with your
   `index.html`, CSS, JS and `assets/`. Follow
   `games/README - game design requirements.md`. `games/pie-maker/` is the
   example to copy.
2. Add your entry to `games.json` (copy an existing one; the `_about` block
   at the bottom explains every field). `goes_in_slot` picks the button.
3. Run `start-local/start-halloween.bat` and tap your game's button.

Nothing in `app/` needs to change.

## Publishing a change

Phones keep old copies of the code. Before pushing, change the version stamp
in **three places** so they fetch fresh files: `APP_VERSION` in `app/app.js`,
and the two `?v=` tags in `index.html`.
