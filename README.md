# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.

**Status: template (September 2026).** The three-panel frame (top bar, game
panel, sliding bottom panel) is the app. The games in it are demos and
placeholders for others to copy: a pumpkin-patch home screen,
Stack-o'-Lantern and eight empty placeholders. **The rules for writing a mini game
are in** `games/README - game design requirements.md`**.**

## Running it on your own machine

Double-click `start-local/start-halloween.bat`. It starts a small web
server and opens the game at `http://localhost:8091/`. It also prints an
address for testing on a phone on the same Wi-Fi.

## What is in here

```text
index.html          the app's entry point (the 9:16 frame and its three panels)
games.json          THE LIST OF GAMES: one entry per game (folder, slot, title, icon...), read at start-up
manifest.json       makes it installable / full screen on Android and desktop
app/                the app's CSS and JavaScript (reads games.json, builds the buttons)
games/README - game design requirements.md   THE RULES for mini games (the only copy)
games/game-helper.js  the one file a game includes to talk to the app (reporting a score)
games/pumpkin-patch/  the home game: shown at start and when no other game is active
games/stack-o-lantern/  a finished game that follows the rules (a one-tap stacker)
games/game1..8/       eight placeholder folders to copy or take over: index.html, its own css/js, assets/, README
games/_TABLED GAMES/  games that were written and tested but are not used in the app
                      (wrong-desktop and wrong-phone in there break the rules on purpose, to show why the rules exist)
start-local/        a small web server for testing on this Windows machine
claude-john-docs/   design notes and session summaries
```

Plain HTML, CSS and JavaScript. No framework, no build step.

## Adding a game

1. Make a folder `games/<your-game>/` (lowercase, no spaces) with your
  `index.html`, CSS, JS and `assets/`. Follow
   `games/README - game design requirements.md`. `games/stack-o-lantern/`
   is the example to copy.
2. Add your entry to `games.json` (copy an existing one; the `_about` block
  at the bottom explains every field). `goes_in_slot` picks the button.
3. Run `start-local/start-halloween.bat` and tap your game's button.

Nothing in `app/` needs to change.

Three things to know before you design (all in section 1.8 of the rules):

- **The bottom panel does not pause your game.** The player can slide it
  up at any time; it covers about the lower half of your game, and your
  game is not paused or told. If your game needs a pause, build your own.
- **High scores:** include `games/game-helper.js` and call
  `Halloween.reportScore(42)` when a game ends. The app keeps the five
  best and shows them in the panel's This Game tab.
- **Sound and settings:** the This Game tab shows one Sound switch for all
  games and up to three on/off switches of your own, named in
  `games.json`. The app shows and remembers them, but no game can read
  them, so they change nothing. Any sound control or setting your game
  needs is your game's own job.

## Publishing a change

Phones keep old copies of the code. Before pushing, change the version stamp
in **three places** so they fetch fresh files: `APP_VERSION` in `app/app.js`,
and the two `?v=` tags in `index.html`.