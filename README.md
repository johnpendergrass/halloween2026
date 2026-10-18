# Halloween 2026

A collection of Halloween mini games for phone, tablet and PC browser.
Plain HTML, CSS and JavaScript: no framework, no build step. It is served
by GitHub Pages straight from this repository.

**FINISHED (October 18, 2026).** John: the collection is done; it may be
opened for bug fixes, but no more games or features are planned. Three
games ship: the Pumpkin Patch (slot 1), Stack o' Lantern (slot 2) and
GO FISH! - Candy Edition (slot 3), on GitHub Pages at stamp
`2026-1018-cleanup`. The `__STATUS - ...` file in this folder and in each
game's folder is the one-glance state; the eight empty placeholder game
folders that stood here while the collection was being built were
removed the day it was finished.

**New here?** Read `app/README - ROADMAP.md`: it maps every file in the
repository, says what reads what, and gives a reading order for a
novice. Each code file of the app has its own `README - <file>.md` beside
it (`app/app.js`, `app/styles.css`, `app/default-icon.svg`,
`games/game-helper.js`).

## What it is

The **app** (the shell) is one page, `index.html`: a phone-shaped 9:16
frame with a top bar (Home, the game's name, Settings), a 9:15 game
panel, and a bottom panel that slides up over the lower half of the game.
The bottom panel has two tabs: GAMES (a rainbow title, a row of three
icons named Patch, Stack and Fish, a credits line) and the game's own tab
(PATCH, STACK or FISH: its description, how to play, five high scores
with dates and notes). Home opens the panel on GAMES, Settings on the
game's tab, and the button whose tab is showing closes it; so does a tap
on the game.

Each **game** is its own small web page in its own folder under `games/`,
shown in the game panel's iframe. The app reads `games.json` at start-up
and makes one button per game; a game talks back only through
`games/game-helper.js` (report a score, ask the best score). The app
never pauses a game and never reads a game's files.

## Running it on your own machine

Double-click `start-local/start-halloween.bat`. It starts a small web
server, opens the app at `http://localhost:8091/` and prints an address
for a phone on the same Wi-Fi. A web server is needed even locally
because the app reads `games.json` with `fetch()`, which browsers refuse
for a page opened from the disk. `start-local/README - starting local.txt`
has the details.

## What is in here

```text
index.html            the app's page: the frame and its three panels, with comments
games.json            THE LIST OF GAMES: one entry per game (folder, slot, names, icon,
                      description...); the _about block at its bottom explains every field
manifest.json         lets Android and desktop install the page full screen
app/                  the app's code: app.js (behaviour), styles.css (looks),
                      default-icon.svg, README - ROADMAP.md and a README per file
games/README - game design requirements.md   THE RULES a mini game follows (version 5, final)
games/game-helper.js  the one file a game includes to talk to the app (+ its README)
games/pumpkin-patch/  slot 1, shown at start: silhouettes rise behind the tree line
games/stack-o-lantern/  slot 2: a one-tap stacker, 51 milestones, sound, a practice level
games/candy-go-fish/  slot 3: GO FISH! - Candy Edition, by John with Codex
start-local/          the local web server (.bat, .py, README - starting local.txt)
claude-john-docs/     the shell's design record: specifications.MD (why),
                      specifications-technical.MD (how), session handoffs, plans
codex-john-docs/      Codex's three handoffs from building Candy Go Fish (history)
```

Each game keeps its own documentation in its folder: a README, and for
Stack o' Lantern and Candy Go Fish a `_documents/` folder with specs,
handoffs and automated checks. The root `claude-john-docs/` is the
shell's only.

## Adding a game (if the shell is ever reused)

1. Make a folder `games/<your-game>/` (lowercase, no spaces) with your
   `index.html`, CSS, JS and `assets/`. Follow
   `games/README - game design requirements.md`; `games/stack-o-lantern/`
   is the example to copy.
2. Add your entry to `games.json` (copy an existing one; the `_about` block
   at the bottom explains every field). `goes_in_slot` 1 to 3 gives it a
   button; anything else lists it without showing it.
3. Run `start-local/start-halloween.bat` and tap your game's button.

Nothing in `app/` needs to change. Three things to know before you
design (section 1.8 of the rules): the bottom panel does not pause your
game, so build your own pause if you need one; high scores are one call,
`Halloween.reportScore(42)`, through the helper; and sound and settings
are your game's own controls inside your page (the switches the app can
show for you are remembered but cannot be read by any game).

## Publishing a change (the bug-fix routine)

Phones keep old copies of the code. Before pushing, change the cache
stamp (`?v=...` on every script, stylesheet and JSON address, and
`APP_VERSION` in `app/app.js`) in **all 29 places** across six files, so
phones fetch fresh files; `app/README - ROADMAP.md` lists them. Then:

1. Run the relevant check (Stack's in
   `games/stack-o-lantern/_documents/checks/`, Go Fish's in
   `games/candy-go-fish/_documents/codex-john-docs/`), one at a time, on
   a second server on port 8098 so a browser open on 8091 is not disturbed.
2. Update the docs: a handoff in `claude-john-docs/` (and in the game's
   own docs folder), the specs if logic changed, the `__STATUS` markers.
3. Commit and push `main`; GitHub Pages serves it within a minute or two.

Candy Go Fish reads its own stamp and resets its remembered sound
settings whenever the stamp changes, so every push starts its music OFF /
Always. That is intended.
