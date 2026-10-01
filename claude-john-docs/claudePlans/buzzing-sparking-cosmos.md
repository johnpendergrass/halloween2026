# Plan: high scores and settings in the This Game tab

## Context

Until now the app and the games do not talk to each other (requirements
rule 18 forbids it "until a later version says how"). John wants the first,
simple version of that communication, shown in the **This Game** tab of the
sliding panel:

1. **High scores**: the top five scores for the current game, on the left,
   under the icon and name. No scrolling list; `---` where there is no
   score yet.
2. **Settings**: up to three on/off options on the right. Each is one line
   of text (for example "Easy / Hard") with a slider switch directly below
   it. The designer gives the three labels and the three defaults (0 or 1);
   the player can flip them; a change only applies to the next newly
   started game.

The description, how to play and credits stay, below these two blocks.

Two things John decided while this plan was being written:

- **Sound On / Off is one shared switch for the whole app, shown in the
  This Game tab of every game** (so all settings are in one place). It is
  global: off in one game means off in all. It is always there and is not
  one of a game's three switches. The App tab does not change.
- **The three This Game switches are the designer's own and optional.**
  Their purpose: a game that only needs a few on/off options gets them
  drawn and remembered by the app, without building an options screen.
  A game that needs more is free to build its own start or options screen
  inside its panel. A game that names no switches shows only high scores.
- **High scores are always shown, for every game**, five lines, all `---`
  to start.
- **A score is a number, with optional text shown in its place**:
  `reportScore(42)` shows `42`; `reportScore(42, "Master Chef")` shows
  `Master Chef` and ranks it as 42. The value is right-adjusted in the
  list.
- **Scores and switch positions are kept on each device** (the browser's
  own storage, `localStorage`), because a page on GitHub Pages can read
  `games.json` but cannot write to it. **No shared scoreboard and no
  structure for one**; no player names.

## What it will look like (This Game tab, drawer open)

```text
+--------------------------------------------+
| [icon]  Stack-o'-Lantern                   |
|         Claude, September 29, 2026         |
|                                            |
|  High scores          Sound                |
|  1.  Master Chef      (    o )             |
|  2.           30      Slow / Fast          |
|  3.           12      ( o    )             |
|  4.          ---      Wide / Narrow        |
|  5.          ---      (    o )             |
|                       Forgiving / Strict   |
|                       ( o    )             |
|                       Game options apply   |
|                       to your next game.   |
|                                            |
|  Pumpkin slabs slide across the night...   |   <- description, how to
|  How to play ...                           |      play, credits: scroll
+--------------------------------------------+      down to read, as today
```

**Sound is always the first switch in the settings column (John)**, in
line with the others; the game's own switches (up to three) follow it.
While a game is running the drawer opens on This Game, so Sound is one
tap away mid-game. Sound works at once; the hint line under the game's
switches says that those wait for the next game (no hint when a game has
no switches of its own).

Fit on a phone: under the icon row about 50cqw of height is visible.
Each switch item (label, switch directly below, the whole item one
tappable button) is about 12cqw, a 46 px fingertip target, so four items
take about 48cqw and show without scrolling. The hint line and the text
below are reached by scrolling the tab (it already scrolls). A game with
no scores yet and no switches of its own (the home game, the
placeholders) shows five `---` lines and only the Sound switch.

## Choices I made (say so if you want any of them different)

- **Where the designer writes the settings: in their `games.json` entry.**
  This keeps "one place to describe your game" and lets the app draw the
  switches without asking the game anything. It changes one earlier note
  ("settings live in the game's own folder"); the docs get updated.

  ```json
  "settings": [
    { "label": "Easy / Hard", "default": 0 }
  ]
  ```

  **John's choice of switches for now:** Pumpkin Patch has one,
  "Slow / Fast"; Stack-o'-Lantern has one, "Easy / Hard"; every other
  game has none (only Sound). They do nothing yet: no game is modified
  until John says so.

  - `settings`: zero to three entries; a fourth is ignored with a console
    note. Switch left = 0, right = 1, so a label written "Left / Right"
    lines up with the switch. About 20 characters fit.
- **Scores**: ranked by the number, higher is better, top five, kept on
  the device so they survive closing the app. Each saved score is
  `{ "value": 42, "text": "Master Chef" }` (`text` only when the game
  gave one). A value that is not a number, or is 0 or less, is not
  recorded (with a console note). No names or dates. Nothing is added to
  `games.json` for scores.
- **Settings are remembered per game on the device** too. They are
  identified by position (first, second, third).
- **How the game and the app talk: one small helper file,
  `games/game-helper.js`**, that a game includes with one `<script>` tag.
  It gives the game three functions:
  - `Halloween.reportScore(42)` or
    `Halloween.reportScore(42, "Master Chef")` - call it at game over.
  - `Halloween.getSettings()` - returns e.g. `[0, 1, 0]`; call it when a
    new game starts.
  - `Halloween.soundIsOn()` - returns true or false; call it each time
    the game is about to play a sound, so the Sound switch works at once,
    even in the middle of a game.

  Inside, the helper simply calls the matching functions of the app page
  (`window.parent.halloweenApp...`). That works because every game is
  served from the same site as the app. It is simpler than the
  `postMessage` idea in the old notes: no waiting, no timing problems, and
  about 20 lines. When a game page is opened on its own (no app around
  it), `reportScore` does nothing, `getSettings` returns `[0, 0, 0]` and
  `soundIsOn` returns true, so games still run standalone.
- **Sound**: on by default, remembered on the device under one key for
  the whole app (`halloween2026:app`). No game makes sound yet, so for now
  the switch is only remembered and offered to games; the rules for sound
  itself (iPhones play nothing until the first tap) stay a later topic.
- "Only applies to a newly started game" needs no extra machinery: the
  game asks for the settings at the moment a new game starts, never in
  the middle of one.

## Steps (small; I stop after each one for John to look)

### Step 1 - the tab layout only (nothing reaches the game yet)

**This is the only step John has approved so far ("do not modify any
game yet").**

- `games.json`: add `settings` to two entries: Pumpkin Patch
  ("Slow / Fast", default 0) and Stack-o'-Lantern ("Easy / Hard",
  default 0); document the field in `_about` and bring `coming_later` up
  to date.
- `index.html`: in `#tab-game`, after `.this-game-head`, add a two-column
  row: `#thisGameScores` (heading + five lines) and `#thisGameSettings`
  (filled by app.js). Remove the "will appear here later" sentence.
- `app/app.js`: new section "Scores and settings":
  - `readSaved(game)` / `writeSaved(game, data)`: one browser-storage key
    per game, `halloween2026:<folder_name>`, holding
    `{ "scores": [...], "settings": [...] }`; wrapped in try/catch so
    private browsing cannot break the app.
  - `currentSettings(game)`: saved values, else the defaults from
    games.json.
  - `fillScores(game)` and `fillSettings(game)`, called from the existing
    `fillThisGameTab(game)`; each switch is a
    `<button role="switch" aria-checked>` that saves on tap.
  - `loadGame` remembers `currentGame`.
  - `makeSwitch(isOn, onChange)`: builds one slider switch; used for the
    game switches and for Sound.
  - The Sound switch: `fillSettings(game)` always makes it first, then
    the game's own switches; its value is saved under `halloween2026:app`,
    so it is the same whichever game is open.
- `app/styles.css`: the two columns, the score lines, the switch item
  (label above, slider below, the whole item at least 44 px tall), all in
  `cqw` like the rest of the drawer.
- Bump `APP_VERSION` and the two `?v=` tags.
- Result: scores show five `---`; the game switches and the Sound switch
  flip and are remembered; Stack-o'-Lantern itself is unchanged.

### Step 2 - scores

- New `games/game-helper.js` (the helper, heavily commented).
- `app/app.js`:
  `window.halloweenApp = { reportScore, getSettings, soundIsOn }`;
  `reportScore(value, text)` adds the score to the current game's list,
  sorts by `value`, keeps five, saves, redraws the block (showing `text`
  where there is one, otherwise the number).
- `games/stack-o-lantern/`: include the helper in `index.html`; call
  `Halloween.reportScore(count)` in `gameOver()`
  (`stack-o-lantern.js`). Its own on-screen "best" label stays as it is.

### Step 3 - settings reach the game

- John and I agree what "Easy / Hard" really does in Stack-o'-Lantern
  (existing constants such as `START_SPEED`, `SPEED_GROWTH`,
  `PERFECT_TOLERANCE` in `stack-o-lantern.js`) and what "Slow / Fast"
  does in Pumpkin Patch.
- `start()` in `stack-o-lantern.js` reads `Halloween.getSettings()` and
  applies them for that game.

### Step 4 - write it down for the friends

- `games/README - game design requirements.md`: replace rule 18 and the
  "coming later" lines with the real rule (include the helper, the three
  functions, still no direct `window.parent` / `postMessage` /
  `localStorage` in a game). Say plainly that the three switches are
  optional and that a game may have its own options screen as well.
- Placeholder folders `game1..8`: the two calls shown as commented
  examples; root `README.md`; both specification files; `/update`.

## Checking each step

Temporary server on port 8097 (not John's 8091, and its saved scores are
separate from his), Chrome emulating a 390 x 844 phone:

- Step 1: screenshot the This Game tab for Stack-o'-Lantern, the home
  game and a placeholder; flip a switch, reload, confirm it is remembered;
  turn Sound off in one game, open another, confirm it is off there too;
  confirm nothing overflows at 375 wide and on a 1920 x 1080 desktop.
- Step 2: play to game over (or call `Halloween.reportScore(7)` inside the
  iframe) several times; the list shows the top five in order; reload and
  they are still there; open the game page directly and confirm no error.
- Step 3: flip a switch mid-game (nothing changes), start a new game (it
  changes).

The server is stopped afterwards. These are real edits to served files,
so John will see each step live on 8091 as it lands.
