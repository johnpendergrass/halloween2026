# app/app.js — a guided tour

*What the file is, who loads it, and what each section does. Written
2026-10-18 for a reader who knows some JavaScript but not this project.
The file's own comments say the same things in more detail, right where
the code is; this is the map.*

## What it is and where it is used

`app.js` is the app's only script, about 900 lines, plain JavaScript
with no library. `index.html` loads it with one `<script>` tag at the end
of the body (so every element it looks up already exists), with the cache
stamp on the address:

```html
<script src="./app/app.js?v=2026-1018-cleanup"></script>
```

It runs once, when the page opens, and then sits waiting for taps. It
knows no game by name: everything about a game comes from `games.json`.
It also puts one object on the page, `window.halloweenApp`, which is the
only thing a game (through `games/game-helper.js`) can reach.

## The seven sections

The file opens with a section map, and each section begins with a long
comment block. In order:

**1. Settings and the games list** (the constants). `APP_VERSION` is the
cache stamp; it is added to the address of `games.json` and of every
game's page the app loads. `LAST_SLOT = 3` is the size of the button
board. `ICON_MIN`, `ICON_MAX`, `ICON_SQUARE_SLACK` say what counts as a
usable icon (200 to 300 real pixels a side, nearly square). `games` is
the list of games with a button, filled at start-up; `currentGame` is
the one in the panel now.

**2. Bottom panel: open, close.** `openDrawer()` and `closeDrawer()` add
or remove the class `is-open` (styles.css slides the panel) and show or
hide the invisible sheet over the game (`#gameCover`), so that a tap on
the game while the panel is open closes the panel and goes no further.
`pressTopButton(tabName)` is what Home and Settings do: open the panel on
their tab, or close it if their tab is already showing.

**3. Bottom panel tabs: GAMES / THIS GAME.** `showTab()` switches the two
tabs. Then the text machinery: `MARK` is the pattern for the text marks a
`games.json` string may carry (`**bold**`, `*italic*`, `__accent__`,
`~~rainbow~~`, `\n`), and `appendMarkedText(parent, text)` turns such a
string into elements. `plainText()` strips the marks (for a spoken label),
`shortName()` keeps the first line. `fillThisGameTab(game)` fills the
second tab's title, byline, description, how-to-play and credits from the
game's entry, hiding whatever is empty.

**4. High scores and switches.** The two columns of the THIS GAME tab.
Scores are kept in the browser's `localStorage` under the key
`halloween2026:<folder_name>` as `{ scores: [...], settings: [...] }`;
`readSaved()` and `writeSaved()` wrap every access in try/catch because
some browsers refuse storage. `reportScore(value, text, notes)` is what a
game calls through the helper: it keeps the five best, adds today's date,
redraws the list and returns the score's place (1 to 5, or 0).
`bestScore()` answers the top number. `fillScores()` draws the five lines,
`clearScores()` with its "You sure?" question empties them. The switches
(`makeSwitch`, `fillSwitches`, `saveSetting`) are drawn and remembered
for a game that names them in `games.json`; no game can read them. This
section is where `window.halloweenApp = { reportScore, bestScore }` is
published for the helper.

**5. Switching games.** `loadGame(game)` points the `<iframe>` at
`games/<folder_name>/index.html?v=STAMP`, names the top bar and the
second tab, fills the THIS GAME tab and marks the pressed button;
`startGame(game)` is the button's tap (load, then close the panel). The
icon rules: `iconPathFor()`, `iconQualifies(img)` (checks the natural
size against the constants of section 1), `showTextInstead()` when the
icon is missing or off-spec, and `makeIconButton(game)` which builds one
square button with its picture, its spoken name and the one-word label
under it. `GAMES_TAB_TITLE` holds the GAMES tab's two-line title (first
line rainbow); `makeGameButtons()` fills the title and the row of three.

**6. Start up.** `readGamesFile()` fetches `games.json` (this is why the
app needs a web server: `fetch()` refuses `file://`). `pickButtonGames()`
keeps the entries whose `goes_in_slot` is 1 to 3, sorted by slot (an
entry with "" or a higher number is listed but not shown, a way to bench
a game). `showStartupError()` writes a readable message into the GAMES
tab when the file cannot be read, with a hint about `file://`. `startUp()`
is the story of the page opening: read the file, pick the games, build
the buttons, load the slot 1 game, open the panel on the GAMES tab. The
last line of the section calls it.

**7. No double-tap zoom.** On the iPhone a quick double tap zooms the
whole page and there is no way back but a reload. The cure that worked,
after several that did not, is a `touchend` listener that calls
`preventDefault()` on a touch ending within 350 ms of the previous one.
This copy covers taps on the app's own bar and panel; the identical guard
at the end of `games/game-helper.js` covers taps inside every game. A side
effect: a second tap that fast loses its click, so automated checks tap at
least 400 ms apart.

## How to make a change safely

- Behaviour lives here, looks live in `styles.css`, structure in
  `index.html`. A new element needs all three: the `id` in the HTML, the
  `getElementById` here, the rule there.
- The file has LF line endings (styles.css is mixed). Any editor is fine.
- Test through `start-local/start-halloween.bat`, never by
  double-clicking `index.html`.
- Before a push, bump `APP_VERSION` and the other 28 stamp places (see
  `README - ROADMAP.md`).
- The design record is `claude-john-docs/specifications.MD` (why) and
  `specifications-technical.MD` (how), one dated subsection per change.
