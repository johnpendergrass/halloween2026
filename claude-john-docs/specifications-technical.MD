# Halloween 2026 — Technical Specifications

Last updated: 2026-10-18 13:04 (4q: appendMarkedText in fillScores' notes; 4r: the GAMES tab column, GAMES_TAB_TITLE, button_label, .game-label, the row, the tab named from the label; stamp 2026-1018-cheat; before that 2026-10-18 12:14: 4p: the three-cell board, gameTab and shortName, high_scores, the *italic* mark, stamp 2026-1018-diagonal in 29 places; before that 2026-10-17 17:57: 4o: the choices feature in and out, stamp 2026-1017-stack-practice; 16:27: 4n: the touchend guard in the helper and app.js section 7, the viewport lines, .game-frame touch-action, reportScore returns the place, stamp 2026-1017-stack-victory in 29 places; 14:41: 4m: #settingsButton, pressTopButton, currentTab, afterDrawerSettles gone; stamp 2026-1017-stack-sound, 27 places; before that 2026-10-16 20:45: stamp 2026-1016-stack-endscreen, 26 places now: Stack's index has 3; nothing else in the shell; 17:15: 4: touch-action on the shell page; 4g moved to the game's folder; stamp 2026-1016-stack-milestones; before that: 15:34 top title, 15:45 one control point)

## 1. Stack and hosting

- Plain HTML / CSS / JavaScript. No framework, no build step, no dependencies.
- Repo: `https://github.com/johnpendergrass/halloween2026` (public, branch
  `main`). **All lowercase on purpose** — GitHub Pages paths are
  case-sensitive with no redirect (triageRush lost a day to this). The repo
  was briefly `Halloween2026` and renamed the same day.
- Pages URL (when enabled): `https://johnpendergrass.github.io/halloween2026/`
- Rules for Pages: only relative `./` paths; lowercase file/folder names;
  `?v=` query on script/stylesheet links, bumped per release.
- No service worker (no offline mode) — deliberate, same as triageRush.

## 2. Files

```text
index.html                 the app: 9:16 frame, top panel, game panel with <iframe id=gameFrame>, drawer
games.json                 THE LIST OF GAMES: "games" array (v2 entries, see 4a; goes_in_slot 1..3 and the optional high_scores since 2026-10-18, 4p) then an "_about" block documenting every field
manifest.json              Android/desktop full-screen ("standalone", portrait); icons: [] (TODO)
app/styles.css             app CSS (frame, panels, drawer) - moved from the mockup
app/app.js                 reads games.json at start-up; picker buttons, THIS GAME tab (text, high scores, switches), drawer (Home → GAMES, Settings → THIS GAME, a tap on #gameCover closes it), loadGame/startGame. Never edited by designers
games/game-helper.js       THE HELPER a game includes to talk to the app: Halloween.reportScore() (returns the place since 2026-10-17 16:27) and Halloween.bestScore() (see 4j, 4l, 4n); its tail is the no-double-tap-zoom guard every game gets (4n)
app/default-icon.svg       the ghost shown on a button that has neither a usable icon nor a title
games/pumpkin-patch/       slot 1, shown at start (was game0, then the "home" game until 2026-10-16): index.html, pumpkin-patch.css/.js, assets/ (2025 art, patch.svg icon)
games/stack-o-lantern/     STACK-O'-LANTERN (Claude's stacker, was game4): index.html, stack-o-lantern.css/.js, assets/stack.svg
games/game1..game8/        NEUTRAL PLACEHOLDERS (see 4i): index.html, gameN.css/.js, empty assets/, README - GAME N.md
games/candy-go-fish/       CANDY GO FISH (John + Codex, slot 8): its own _documents/ folder holds its docs and checks
games/README - game design requirements.md   THE RULES (one copy; each game README links to it)
games/*/README - <NAME>.md                   how each game was made + "Where this game breaks the requirements"
start-local/start-halloween.bat   double-click launcher, port 8091 (confirmed by John 2026-09-30), prints LAN URL for iPhone
start-local/no-cache-server.py    dev server: code no-store, anything under /assets/ no-cache
claude-john-docs/          these notes; claudePlans/ holds plan-mode plans (the 2026-10-01 scores + switches plan)
.gitignore                 anything in github-excluded/ never goes to GitHub
```

The three-panel design now lives in the real `index.html`/`app/` (the first
single-column scaffold was replaced on 2026-09-27; the old `mockups/`
folder was removed on 2026-09-29).

**Code style (John, 2026-09-27):** written for an intermediate JavaScript
front-end programmer. Small named functions, settings at the top, a section
map in each file. Comments say *why* (design decisions, non-obvious CSS
tricks), not *what* standard JS/CSS does.

**Every game's CSS starts with the same two blocks**, copied verbatim from
the requirements doc: the 2.2 page setup (`*` reset, `html, body`, `body`
touch rules, `[hidden]`, `img`) and the 2.3 `.text-small/medium/large`
classes. The game's own styles follow. This is what makes the demos
checkable against the doc.

## 3. The 9:16 shell (in both index.html and the mockup)

```css
.app-shell {
  width:  min(calc(100vw - 8px), calc(90dvh * 0.5625));
  height: min(90dvh, calc((100vw - 8px) * 1.7778));
  container-type: inline-size;   /* 1cqw = 1% of frame width */
}
/* + an @supports (height: 100svh) version subtracting safe-area insets */
```
Body: `display:grid; place-items:center;` padding `max(5dvh, safe-area)`
top/bottom, `max(4px, safe-area)` sides. `viewport-fit=cover` in the viewport
meta is required for the `env(safe-area-inset-*)` values.

## 4. Three-panel layout (index.html + app/styles.css; one control point 2026-10-16; Home + Settings since 2026-10-17, see 4m)

- **`--bar-h: 11.111cqw`** — the key number. Frame height = 16/9 × width, so
  1/16 of the height = 1/9 of the width = 11.111cqw: the top panel's
  height. (cqw is used because the shell is an `inline-size` container;
  there is no cqh.) Until 2026-10-16 the bottom strip used it too, which
  made the two bars identical; the strip is gone.
- Structure: `.app-shell` (flex column) → `.top-panel` (height `--bar-h`) +
  `.play-area` (flex 1, `position:relative`, overflow hidden).
- The top panel: `#homeButton` (`.top-icon`, a square as tall as the bar;
  `aria-expanded` follows the drawer), `.top-title` (flex 1, centred) and
  `#settingsButton` (another `.top-icon`, ☰) on the right, so the title
  is centred between two equal squares (until 2026-10-17 the right one
  was an empty spacer span).
- Inside `.play-area`:
  - `.game-panel`: absolute, `top/left/right/bottom: 0` → 15/16 of the
    frame = exactly 9:15 (was `bottom: var(--bar-h)` → 9:14).
  - `.game-cover` (`#gameCover`): absolute, `inset: 0`, `z-index: 4`, no
    background; `hidden` while the drawer is closed. Its one job is to
    catch the tap that closes the drawer, so the game never sees it.
  - `.drawer`: absolute, `bottom:0`, `z-index: 5`, height
    `calc(100% * var(--drawer-open-share))` with `--drawer-open-share: 0.55`.
    Closed: `transform: translateY(100%)` → entirely below `.play-area`,
    which clips it. Open (`.is-open`): `translateY(0)`. Slides with a
    300ms transition.
- **Edges are drawn INSIDE the heights** (border-box): top panel
  `border-bottom: 2px`, drawer `border-top: 2px`. Measured: the top bar
  42.44px on a 390px viewport.
- Frame edge is an `outline` (takes no space, follows border-radius).
- `--frame-radius: clamp(8px, 2.6cqw, 16px)` on the shell; top panel uses
  `radius radius 0 0`, drawer `0 0 radius radius`.
- Drawer shadow only when open (when closed it leaked up as a grey smudge).
- **`inert`** is set on `.drawer-content` while closed so its off-screen
  buttons cannot be reached by keyboard.
- JS (`app/app.js`) is small named functions: `openDrawer` / `closeDrawer`
  (they also show/hide the cover and set `aria-expanded` on both buttons),
  `pressTopButton(tabName)` (Home "app" / Settings "game": close if open
  on that tab, else `showTab` and open if closed; `toggleDrawer` until
  2026-10-17), `showTab` (also keeps `currentTab`),
  `loadGame(game)`, `startGame(game)`, `makeGameButtons()`. `#gameCover`
  click → `closeDrawer`. Gone on 2026-10-16: `goHome()`, the strip and
  ☰ listeners, the `homeGame` variable.
- **Fast taps during the slide**: the cover appears the moment the drawer
  starts opening, so a tap that lands where the panel will be, before it
  arrives, closes the panel again. Seen in a scripted test (clicks 0 ms
  apart, 2026-10-16); a finger is slower. Accepted.
- Checked 2026-10-16 at a 430 × 930 window: panel ratio 1.6668, drawer
  height 55% of the panel, all three games load and lay out; the game's
  own `verify-shell.cjs` (port 8098) passes unchanged.

- **`html, body { touch-action: pan-y }`** (2026-10-16): no double-tap or
  pinch zoom on the shell page; the drawer's `overflow-y: auto` content
  still pans. Each game page sets `touch-action: none` on its own body.
  Before this a double tap on the top bar magnified the game panel to the
  screen's edges on John's iPhone.

## 4a. Games in iframes, and games.json v2 (2026-09-29)

- **`games.json`** (root, beside index.html) = **the one place to add a
  game**. Shape: `{ "games": [ {entry}, ... ], "_about": { what_this_file_is:
  [...], fields: { field: "explanation", ... }, good_to_know: [...] } }`
  (`good_to_know` was `coming_later` until 2026-10-01).
  `_about` is the file's own documentation (JSON has no comments) and is
  deliberately LAST; the app ignores it.
- **Entry fields** (snake_case): `folder_name`, `goes_in_slot`, `title`,
  `short_title`, `icon`, `designer`, `credits`, `date`, `description`,
  `how_to_play`, `settings` (a list of `{ "label", "default": 0|1 }`, at
  most three, see 4j). Only `folder_name` is required in principle; the app
  copes with blanks (text fallbacks, hidden lines).
- **app.js section 6, `startUp()`** (async): `readGamesFile()` fetches
  `./games.json?v=APP_VERSION` (same cache-busting as the scripts), checks
  `response.ok` and that `data.games` is an array. Then
  `games = pickButtonGames(all)`:
  keeps entries whose slot is an integer 1..`LAST_SLOT` (8), first entry
  wins a duplicate slot (`console.warn`), anything else is skipped with a
  `console.info`; result sorted by slot. No button at all is a start-up
  error. Then `makeGameButtons()`, `loadGame(games[0])` (slot 1, or the
  lowest slot there is), `showTab("app")`, `openDrawer()` (since
  2026-10-16; before, `goHome()` loaded the "home" entry).
  `readGamesFile()` reads the body as text and runs
  `JSON.parse` itself inside try/catch so a punctuation mistake becomes
  one plain sentence ("... has some invalid JSON in it. You need to fix
  that file. (A JSON checker such as jsonlint.com will point at the
  line.)"); no line-number detection, by John's decision (spec 3c). Any
  failure → `showStartupError()` swaps `#gameButtons` to class
  `.startup-error` (pre-wrap text) and writes "Could not read the list of
  games." + the error's message; when `location.protocol === "file:"` it
  adds the hint to open the app through start-local/start-halloween.bat
  or a web server. **`fetch()` does not work over `file://`**, which is
  why that hint exists; tested.
- **`loadGame(game)`** now also sets the top title to `short_title ||
  title`, calls `fillThisGameTab(game)` and `markCurrentButton(game)`.
  `startGame()` closes the drawer (until 2026-10-17 it then switched the
  tab once the slide was over, via `afterDrawerSettles`, now gone).
- app.js contains no game names. Nothing in `app/` changes when a game is
  added, renamed or removed; verified by `git status` after the two test
  games were written (only `games/game2/`, `games/game3/` and games.json
  changed).
- `loadGame()` sets `gameFrame.src = "./games/<folder_name>/index.html?v=" + APP_VERSION`.
  Changing `src` throws the old game away completely (no stop() needed).
- `APP_VERSION` in app.js must match the `?v=` tags in index.html
  (currently `2026-1001-scores`; check app.js, this line has gone stale
  before). **An edit to games.json also needs
  the bump** before a push, or phones keep the old list for up to 10
  minutes; the local server never caches it. The game pages' own `<link>`/`<script>`
  tags carry no `?v=`: on GitHub Pages (10-minute cache) a phone may run a
  new game HTML with the old CSS/JS for up to 10 minutes after a publish.
  Accepted; friends would forget to bump a tag inside their game.
- No postMessage. A game talks to the app only through
  `games/game-helper.js`, which calls the parent page directly (4j). Game
  pages must also run standalone.
- Inside a game page, `100vw × 100vh` = the game panel.

## 4b. Measured sizes (2026-09-27, chrome-devtools emulation, mobile+touch)

Emulation has no safe-area insets, but in home-screen mode the insets are
smaller than the 5dvh padding on these phones, so the numbers match.

| Viewport | Frame | Game panel (9:15 since 2026-10-16) | was (9:14) |
|---|---|---|---|
| 375×667 ×2 (SE) | 337.8 × 600.6 | 337.8 × 563.1 | 337.8 × 525.5 |
| 390×844 ×3 (15/16) | 382 × 679.1 | 382 × 636.7 | 382 × 594.2 |
| 440×956 ×3 (16 Pro Max) | 432 × 768 | 432 × 720 | 432 × 672 |

SE is height-limited (frame fits the height); the others are width-limited.
Pro Max panel ×3 = 1296 × 2160 → the design canvas (1296 × 2016 before 2026-10-16). PC/Mac figures in the
requirements doc are estimates (browser toolbars vary).

## 4d. The Pumpkin Patch (home, folder `pumpkin-patch`, was game0) implementation notes

- `.scene` div: `height: 100%`, `aspect-ratio: 950 / 714`,
  `left: calc((100vw - 100vh * 950 / 714) * var(--crop-from-left))`, body
  `overflow: hidden`. Everything inside is placed in **% of the painting**,
  so the character always lines up with the layers at any panel size.
- Layers back to front (DOM order): BACKGROUND painting, `#character`,
  `justBelowHorizon` (tree line + field, sky transparent).
- Character: `height: 35%`, `top: 54.2%` (2025's 250px at y 387 on 714).
  Rise = CSS transition on `translate` to `0 -96%` (class `is-up`, % of
  its own height); mirror = `scale: -1 1` (class `is-mirrored`), separate
  properties so they don't fight. JS sets `transition-duration` each time.
- JS: `rise()` → `afterSeconds(rise + topWait, sink)` → `sink()` →
  `afterSeconds(sink + hiddenWait, rise)`. setTimeout chain, no
  animationend. Settings at top of pumpkin-patch.js (`RISE_TIME`, `WAIT_AT_TOP`,
  `WAIT_HIDDEN`, `FIRST_WAIT`, `LEFT_MOST`/`RIGHT_MOST` = 14–40%).
- `CHARACTERS` holds short names (`"totoro"`); `imageFor(name)` builds the
  file name `silhouette_<name>_transparent_250h.png`. All 19 are preloaded
  with `new Image().src` at start-up.
- The unused front popup layer (`..._justBelowPumpkins.png`) was removed on
  2026-09-29.
- Measured 2026-09-27 at 390×844 in the app: panel 382 × 594, scene 790
  wide, left −102. The 404 in the console is `/favicon.ico` (no icon yet).

## 4b2. The picker, icons and THIS GAME (app.js sections 3–4, styles.css section 5)

- **`makeIconButton(game)`**: `<button class="game-button" aria-label=title
  title=title data-folder=folder_name>` holding one `<img>`. Listeners are
  attached BEFORE `img.src` is set. On `load`: `iconQualifies(img)` or
  `showTextInstead()`. On `error`: `showTextInstead()`. No `icon` field:
  `showTextInstead()` straight away.
- **`iconQualifies(img)`**: `.svg` → true. Else `naturalWidth/Height` each
  in `ICON_MIN..ICON_MAX` (200..300) and `|w − h| <= ICON_SQUARE_SLACK`
  (10). Constants at the top of app.js. Rejections `console.warn` the real
  size and the rule.
- **`showTextInstead(button, game)`**: `short_title || title` as text with
  class `is-text` (`clamp(11px, 3.4cqw, 18px)`, bold, two lines, `overflow:
  hidden`); if no text, an `<img src=DEFAULT_ICON>` (`./app/default-icon.svg`).
- **`makeGameButtons()`** (board version, 2026-09-29 evening; the home
  button that used to come first went on 2026-10-16): a `div.game-board`
  into `#gameButtons`, holding up
  to two `div.board-row`s: `upperRow = games.filter(slot <= SLOTS_PER_ROW)`,
  `lowerRow = games.filter(slot > SLOTS_PER_ROW)`; a row with no games is
  not created. Each button gets `style.gridColumn = ((slot - 1) %
  SLOTS_PER_ROW) + 1` (slots 1 and 5 → column 1, and so on). Constants:
  `LAST_SLOT = 8`, `SLOTS_PER_ROW = 4`.
- **CSS**: `.game-buttons { display:flex; flex-direction:column;
  align-items:center; justify-content:center; min-height:100%;
  --game-button-size:18cqw }` (centres the board in the tab since
  2026-10-16; before, a 4.5cqw gap held the home button off the board);
  `.game-board {
  display:flex; flex-direction:column; justify-content:center; gap:3cqw;
  height: calc(2 * var(--game-button-size) + 3cqw) }` — a fixed two-row
  space, so a lone row lands in the middle; `.board-row { display:grid;
  grid-template-columns: repeat(4, var(--game-button-size)); gap:3cqw }` —
  four cells always, 81cqw wide, empty cells simply empty. `.game-button`
  is a square `18cqw`, `padding:2cqw`, `place-items:center`, orange with
  the `1.2cqw` dark drop shadow; `img { width/height:100%;
  object-fit:contain; pointer-events:none }`. Measured on 390×844: tab
  body 282 px, picker 235 px (three rows). Four text-fallback buttons
  across a row are narrow enough that "Wrong: phone px" wraps to three
  lines; still legible.
- **Test method for layouts**: edit slot numbers in games.json, reload,
  read `getBoundingClientRect()` of each `.board-row` child via
  chrome-devtools `evaluate_script`. WARNING: John loads the same working
  tree live on his own server and phone, so such edits must be announced
  and restored (see the 2026-09-29 mix-up: his phone showed a 3+1 test
  layout while the desktop showed 4 across).
- **`markCurrentButton(game)`**: toggles `.is-current` + `aria-current` on
  the button whose `data-folder` matches. CSS `.is-current { transform:
  translateY(1.2cqw); background: var(--pumpkin-dark); box-shadow: inset 0
  1.6cqw 2cqw #0007, inset 0 0 0 0.8cqw #0003; outline: 0.8cqw solid
  var(--drawer-edge); outline-offset: 0.4cqw }`, icon/text at 0.85 opacity.
- **`fillThisGameTab(game)`** + `setTextOrHide(id, text)`: writes into
  `#thisGameTitle`, `#thisGameByline` ("designer, date", joined from the
  non-empty parts), `#thisGameDescription`, `#thisGameHowToPlay` (and hides
  `#thisGameHowHeading` with it), `#thisGameCredits` ("Credits: …"), and
  `#thisGameIcon` (hidden until `load` passes `iconQualifies`). The
  skeleton with these ids is in index.html; `.this-game-*` styles in
  styles.css (`.this-game-icon` 14cqw orange tile; title
  `clamp(16px, 5.4cqw, 28px)`; byline/credits at 0.7 opacity). Since
  2026-10-01 it first calls `fillScores(game)` and `fillSwitches(game)`
  (4j), and `.this-game-head` is centred with a 1px rule under it.

- **The top title (2026-10-16)**: `loadGame()` sets
  `topTitle.className = "top-title look-" + folder_name`, empties it and
  `appendMarkedText(topTitle, short_title || title)` (it was
  `textContent = plainText(...)`). CSS: `.top-title { min-width:0;
  overflow:hidden; text-overflow:ellipsis }` so a long name is cut, not
  the bar; `.top-title .accent { color: var(--pumpkin) }`. Section 5b:
  `.top-title.look-candy-go-fish { font-size: clamp(11px, 3.8cqw, 20px) }`
  and `.top-title.look-candy-go-fish .accent { font-size: clamp(14px,
  5cqw, 26px) }` (the bar's own size), so GO FISH! stays full size and
  "- Candy Edition" shrinks. Tab side, also 5b:
  `.look-candy-go-fish .this-game-title { font-size: clamp(13px, 4.2cqw,
  22px) }`, `... .accent { font-size: 1.4em }` (the `\n` in the title is a
  `<br>` from `appendMarkedText`), `.look-candy-go-fish .this-game-head {
  gap: 6cqw }` (3cqw for the others). Measured at a 334 px shell: top
  title fits with air both sides; at 26px/20px on a wide window.
  Note the selector shapes: the look class is ON the top title but a
  PARENT of the tab's title.
- **games.json escapes**: a bash heredoc turned `\\n` into a real line
  break inside the title string once (JSON then fails with "invalid
  control character"); write edit scripts to a file. The `_about` note
  for `title` shows the two characters as `\"\\n\"` in the file.

## 4f. games.json v2: implemented 2026-09-29

Built as described in 4a and 4b2 (the plan that used to sit here was
superseded by John's `goes_in_slot` / snake_case shape). Not built: an
icon in the top bar next to `short_title`; only if John asks.
- **Renames** were done with `git mv` so history follows: `game0` →
  `pumpkin-patch` (+ `pumpkin-patch.css/.js`, `README - PUMPKIN PATCH.md`).
  Every old reference was replaced (its own files, the other game READMEs
  and CSS comments, the requirements doc, the root README).
- **Icons**: `games/pumpkin-patch/assets/patch.svg` (100×100 viewBox, all
  shapes inside a `<clipPath>` rounded square so the ground doesn't poke
  out of the corners). `app/default-icon.svg` is a ghost on
  transparent.
- **Test method** for the icon check: three throwaway PNGs made with
  Pillow (256×250 ok, 150×150 too small, 256×230 lopsided) plus a missing
  path, built into buttons via the page's own `makeIconButton()` from
  chrome-devtools `evaluate_script`; results and console warnings matched
  the spec. The PNGs were deleted afterwards.

## 4g. Stack-o'-Lantern implementation notes — MOVED 2026-10-16

Now `games/stack-o-lantern/_documents/claude-john-docs/specifications-technical.MD`
(the 2026-09-29 notes that were here, plus modes, milestones, the end screen
and how the game is tested). Shell-side: slot 2 in `games.json`, `settings: []`,
the game's own localStorage key `halloween2026:stack-o-lantern:mode` (rule 21),
and its `index.html` links carry the shared cache stamp since 2026-10-16
(`2026-1016-stack-endscreen` at 20:45).

## 4i. Placeholder folders and the 2026-09-30 reshuffle

- **Where a neutral placeholder comes from**: the original game4
  placeholder in git, commit `c44f4de` (the last commit before
  Stack-o'-Lantern overwrote it). Recipe for game N: `git show
  "c44f4de:games/game4/<file>"` piped through `sed` swapping `game4`,
  `Game 4` and `GAME 4` for the new number, for `index.html`,
  `game4.css`, `game4.js`, `README - GAME 4.md` (file names renamed the
  same way), plus an empty `assets/.gitkeep`. Made this way: game1,
  game4, game5, game6, game7, game8; identical apart from the number.
- **A placeholder page**: `<h1>` name, "Placeholder page for Game N.",
  and `#sizeReadout` filled by `showSize()` ("Game panel: 382 × 594 px
  (9:15 = 1.667, this = 1.667)"), refreshed on `resize`. CSS = the 2.2
  page-setup block + the 2.3 text classes + a lilac page (`#efdcef`).
- **Stack-o'-Lantern's move**: `git mv games/game4 games/stack-o-lantern`,
  then `git mv` of `game4.css/.js` to `stack-o-lantern.css/.js`, then the
  `<link>`/`<script>` tags and the comments and README inside the folder.
  The old placeholder's `assets/.gitkeep` travelled with it (harmless).
- **The 2026-10-01 reshuffle**: `stack-o-lantern` changed from slot 2 to
  slot 1 and the version tag was bumped to `2026-1001-tabled`. Every
  "see ... for an example" pointer names `games/stack-o-lantern/`: the
  requirements doc (four places), the root README, the placeholder
  READMEs. Tested at 390×844: seven board buttons all load,
  Stack-o'-Lantern sits in column 1, cell 2 is empty.
- **2026-10-16**: the games that had been parked in a tabled folder since
  the reshuffle were deleted for good (`git rm`, 22 files); nothing in the
  code or the docs refers to them any more.
- **New `game2` and `game3` placeholders**: copied from `game5` with
  `sed` swapping `game5`, `Game 5`, `GAME 5` for the new number (simpler
  than the `c44f4de` recipe above, same result; `diff` against game4 with
  the numbers masked says identical). games.json: the game2, game3 and
  game4 entries rewritten as placeholder entries in slots 2, 3, 4.
  Tested at 390×844: eight board buttons, gameN in cell N, each loads its
  page; `game1` (benched) files answer 200.
- **Editing games.json by script**: work on the text (find the entry,
  insert before a marker such as the line `"folder_name": "game5",`),
  assert each marker occurs exactly once, then `json.loads` the result as
  the check. `json.dump` of the parsed file would flatten John's
  hand-made layout.
- **Test method**: at 390×844×3 in the app, `click()` every
  `.board-row .game-button` in turn and read `gameFrame.src`, the iframe's
  `document.title`, the top title and `.is-current`. Benched games have no
  button, so their three files are `fetch`ed and the status codes read.
  Stack-o'-Lantern: two `pointerdown` events on `.stage`, then count
  `.slab` (1 → 3).

## 4j. High scores, switches and the helper (2026-10-01)

- **2026-10-15 changes (see also 4k).** The `halloween2026:app` note and
  the Sound switch are gone (`soundIsOn`/`saveSound` removed; an old note
  is ignored). `SCORES_SHOWN` is 5 again after a day at 10. A score may
  hold `notes`, up to `MAX_SCORE_NOTES` (2) strings cut to
  `MAX_NOTE_LENGTH` (16); `reportScore(value, text, notes)` through the
  helper; `fillScores` always draws two note cells so the five-column grid
  (`auto minmax(0,auto) auto auto auto`) lines up. `fillSwitches` hides the
  column and toggles `.no-switches` on `.this-game-panels` when a game
  declares none. Text marks: `appendMarkedText(parent, text)` splits on the
  `MARK` regex (`**..**`, `__..__`, `~~..~~`, `\n`) and builds `b`,
  `span.accent`, `span.rainbow > span` per letter, or `br`; `makeParagraph`
  adds `.emphasis` for a `!! ` prefix; `plainText()` strips the marks for
  the button's aria-label/title, the iframe title and the top bar. The tab
  carries `look-<folder_name>` (set in `fillThisGameTab`), and styles.css
  section 5b holds `.look-candy-go-fish` (centred text, uppercase heading,
  accent in the welcome gold with `-webkit-text-stroke`, plain icon at
  18.2cqw). (`startGame` used to switch the tab in `afterDrawerSettles()`
  after the slide, because a visible switch flashed; both went on
  2026-10-17 when the two top buttons took over choosing the tab, 4m.)
- **Storage** (as first built): `localStorage`, JSON text, two kinds of key:
  `halloween2026:app` = `{ "sound": true }` and
  `halloween2026:<folder_name>` = `{ "scores": [...], "settings": [0, 1] }`.
  `readSaved(key)` returns `{}` for a missing, unreadable or non-object
  note; `writeSaved(key, data)` warns in the console if the browser
  refuses. Per origin: the test port 8097, John's 8091, and (later) Pages
  each have their own notes; an iPhone home-screen copy also has its own.
- **Scores**: a saved score is `{ "value": 42, "date": "2026-10-01" }`
  plus `"text"` when the game gave one. `reportScore(value, text)` (app.js
  section 4) ignores a value that is not a finite number above 0
  (`console.info`), stamps `todayAsText()` (local date, ISO order), pushes,
  sorts by `value` descending (stable, so of two equal scores the earlier
  stays above), keeps `SCORES_SHOWN` = 5, saves, calls `fillScores`.
  `dateForList("2026-10-01")` gives `"(10-01-2026)"`. It applies to
  `currentGame`, which `loadGame()` sets, so a game never says who it is.
- **`fillScores(game)`** builds five `.score-row`s of three spans (rank,
  `.score-value`, `.score-date`) inside `#thisGameScores.score-list`.
  CSS: the list is ONE grid, `grid-template-columns: auto minmax(0, auto)
  auto; justify-content: center; column-gap: 2.4cqw`, and each row is
  `display: contents`, so the three columns line up from line to line,
  the table is only as wide as its content, and it is centred. The score
  is right-adjusted with an ellipsis; the date is 0.75em at 0.7 opacity,
  `align-items: center`. Measured at 390 wide: column 192 px; numbers
  leave about 28 px each side; "Master Chef" fits with 2 px to spare.
- **Clear scores**: `.score-head#scoreHead` ("High Scores" + the
  `.small-button#clearScores`) and `.score-head#clearQuestion` ("You
  sure?" + `#clearYes`, `#clearNo`), one of them `hidden`.
  `showClearQuestion(isAsking)` swaps them; `clearScores()` (the Yes
  button) deletes `data.scores` only. `fillScores`, `showTab` and
  `closeDrawer` all call `showClearQuestion(false)`. The button is
  `disabled` when the list is empty. `.small-button::after { inset:
  -3.4cqw -1cqw }` stretches the tap area to about 44 px while the pill
  stays one line tall.
- **Switches**: `fillSwitches(game)` fills `#thisGameSettings`: Sound
  first (`soundIsOn()` = `sound !== false`; `saveSound`), then
  `gameSwitches(game)` (the entry's `settings`, cut to
  `MAX_GAME_SWITCHES` = 3 with a `console.warn`), then the hint
  `p.setting-hint` when the game has switches of its own.
  `currentSettings(game)` = the saved 0/1 where the player touched a
  switch, else the default. `saveSetting(game, index, value)` writes only
  that index; untouched places stay holes (`null` in the JSON), so they
  keep following the games.json default.
- **`makeSwitch(label, isOn, onChange)`**: one `<button class="setting"
  role="switch" aria-checked>` holding `.setting-label` and
  `.setting-slider` (knob = `::after`). `aria-checked` is the only state;
  the CSS draws from it. Slider 13 x 6.5cqw, knob 5.3cqw, travel 6.5cqw.
  The whole item is the tap target (`min-height: 44px`).
- **Layout**: `.this-game-panels { display: grid; grid-template-columns:
  minmax(0, 3fr) minmax(0, 2fr); gap: 4cqw }` (scores 3 shares, switches
  2). `.this-game-head` centred, `padding-bottom`/`margin-bottom` 2.5cqw,
  `border-bottom: 1px solid #ffffff33`. Measured at 390x844: Sound + three
  game switches end 2 px above the bottom of the open drawer, so four
  switches is the limit without scrolling.
- **The helper, `games/game-helper.js`**: a classic script defining
  `const Halloween = { findApp(), reportScore(value, text) }`.
  `findApp()` returns `window.parent.halloweenApp` (set in app.js:
  `window.halloweenApp = { reportScore }`), or null when the page is its
  own parent or the access throws. Works because games and app share an
  origin. Standalone: `reportScore` only logs a `console.info`. Games
  include it as `../game-helper.js` before their own script; it carries no
  `?v=` (same caching caveat as game files, 4a).
- **Stack-o'-Lantern**: `Halloween.reportScore(count)` at the end of
  `gameOver()`. Nothing else in the game changed; its switch does nothing.
- **Test method**: on port 8097, `evaluate_script` taps the game's stage
  inside the iframe (`new win.PointerEvent("pointerdown")`) at a steady
  beat until `state.phase === "over"`, then reads the `.score-row`s in the
  parent; `win.eval('Halloween.reportScore(42, "Master Chef")')` for text
  and invalid values; reload for persistence. To check a four-switch fit
  without editing files, the Stack entry's `settings` was replaced in
  memory (`games.find(...)`) before opening the game. `localStorage` of
  the test origin is cleared afterwards.

## 4k. Candy Go Fish implementation notes — MOVED 2026-10-16

Now `games/candy-go-fish/_documents/claude-john-docs/specifications-technical.MD`
(what was section 4k here, about 540 lines). Shell-side facts that matter to the
shell stay in this file: the game is slot 8 in `games.json`, scores arrive by the
message contract of 4j, the cache stamp is shared (APP_VERSION, both root stamps
and the game's resources must match; see 6 below).


## 5. iPhone "app" mode

- Tags: `apple-mobile-web-app-capable`, `mobile-web-app-capable`,
  `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`,
  `theme-color`, plus `manifest.json` for Android.
- `black-translucent` status bar (v6 trial, mockup only): page background shows
  behind the clock/battery. Content stays clear because body padding uses the
  safe-area insets. **iOS reads this when the icon is added** — delete and
  re-add the home-screen icon after changing it.
- Adding from **Chrome on iPhone**: Share icon in the address bar → Add to Home
  Screen → keep "Open as web app" ON. (Safari: Share → Add to Home Screen.)
- A home-screen copy has its own storage, separate from the browser.

## 6. Local testing

- `start-local/start-halloween.bat` → `http://localhost:8091/`, prints the LAN
  URL for the phone (same Wi-Fi; allow Python on Private networks). The LAN
  address comes from a PowerShell UDP-socket trick (commented in the .bat).
- `manifest.json` `background_color`/`theme_color` = `#2e1a44`, the current
  stage purple (was an unrelated `#140c1c`). Change with the v6 verdict.
- Claude tests with chrome-devtools emulation (375×812 and 390×844 @3x, touch;
  1920×1080) and stops its own server afterwards so the .bat can use 8091.

## 7. Future implementation notes

- Registry moved to `games.json` on 2026-09-29 (see 4a, 4f).
- **Next step (John, 2026-10-01): connect Sound and the switches.** Fill
  in the sound and settings options, devise a way for plug-in games to
  use them, and change the demo games to use the values. Claude's sketch
  (not built, not agreed): `Halloween.getSettings()` returning the 0/1
  list, read when a new game starts, and `Halloween.soundIsOn()`, asked
  before each sound; on the app side two more functions on
  `window.halloweenApp` (`currentSettings(game)` and `soundIsOn()`
  already exist in app.js). Standalone: `[0, 0, 0]` and `true`.
- **Sound, two options, not chosen (2026-10-01, see specifications.MD
  6j). All names below are illustrative; nothing is built.**
  - No browser API mutes an iframe from its parent. Same origin lets
    either page call the other: game to app is
    `window.parent.halloweenApp.x()` (as `reportScore` today); app to
    game would be `gameFrame.contentWindow.Halloween.x()` (`Halloween`
    is a `const` in a classic script, so check it is reachable from the
    parent, or have the helper also set `window.Halloween`).
  - **A, the game asks**: add `soundIsOn` to `window.halloweenApp`;
    helper `Halloween.soundIsOn()` (standalone: `true`). For sound
    already playing the game needs to be told: e.g.
    `Halloween.onSoundChange(fn)`, the helper keeps `fn`, the app calls
    into the helper from `saveSound()`.
  - **B, the helper plays**: `Halloween.playSound(file)` /
    `Halloween.playMusic(file)`; the helper keeps every `Audio` it made
    in a list; the app, in the Sound switch's handler, calls e.g.
    `Halloween.setSound(isOn)` in the current game's page, which sets
    `.muted` on each (mute, not pause, so music carries on and is
    audible again on ON). On load the helper asks the app for the
    current position. Paths in `playSound` are relative to the game's
    page. A game loaded later starts with the saved position.
  - Rejected: the app muting `audio`/`video` elements it finds in
    `contentDocument`; misses `new Audio()` not in the page and Web
    Audio.
  - Unknown, test on the iPhone: whether a tap on the switch in the app
    page unlocks audio in the game's page.
- Not planned: `postMessage`, pause signals, a helper-run game loop
  (rejected 2026-10-01, see specifications.MD 6i).
- Also planned: `CLAUDE.md` + `AGENTS.md` at repo root pointing contributors'
  AIs at the mini-game spec; a template game to copy; a checker script
  (lowercase names, relative paths, size limits, no external URLs).
- Sound: iPhone plays nothing until a tap; the mute switch silences some web
  audio. Needs one shared rule.

## 4l. bestScore, the Clear-scores reload, the Home icon, Stack's look (2026-10-17)

- **`games/game-helper.js`**: `Halloween.bestScore()` returns
  `findApp().bestScore()` or 0. The header comment lists it under "ONE
  MORE CALL, TO ASK".
- **`app/app.js`**: `bestScore()` (section 4, before `showClearQuestion`)
  reads the current game's saved note and returns `scores[0].value`
  (the list is kept sorted best first) or 0; `window.halloweenApp = {
  reportScore, bestScore }`. `clearScores()` ends with
  `gameFrame.contentWindow.location.reload()` in a try/catch.
- **`app/styles.css`**: `.top-icon` font-size `clamp(22px, 8.5cqw, 42px)`
  (was 16/6/30; the bar is 11.111cqw). Section 5b gains
  `.look-stack-o-lantern` (text-align center), `.look-stack-o-lantern
  .accent` (#ffd34d, 0.6px dark stroke, shadow) and
  `.look-stack-o-lantern p.emphasis` (orange left edge, centred, italic).
- **`games.json`** (Stack): `title` and `short_title` "Stack o' Lantern";
  `description` a six-item list using `**bold**`, `__accent__`, `\n` and
  a leading `!! ` emphasis line; `how_to_play: []`.
- **`games/README - game design requirements.md`**: rule 19 mentions
  `bestScore()`; section 2.5 shows it and says "those are the helper's
  only calls: one to tell, one to ask".
- **The stamp**: `2026-1017-stack-families`, 26 places.
- **Line endings**: app.js, styles.css, the helper and the requirements
  doc are mixed or CRLF; the day's edits used a scratch Python script
  that tries each passage with LF then CRLF and writes back with
  `newline=""`. `git diff --numstat` confirmed 1-line, 25/3-line,
  17/1-line and 12/2-line diffs.
- **Check**: `games/stack-o-lantern/_documents/checks/check-shell.cjs`
  drives the app on 8098 (in-page clicks: the drawer intercepts
  Playwright taps), reads the bar, the THIS GAME text, plays a round in
  the iframe, reads the saved note, reloads, reads the corner (7), clears
  (list empty, corner 0, game on its start screen).

## 4m. The Settings button (2026-10-17 14:41)

- **`index.html`**: the top panel is `#homeButton` 🏠 (aria-label
  "Games"), `.top-title`, `#settingsButton` ☰ (aria-label "This game"),
  both `button.top-icon`; the spacer span is gone.
- **`app/app.js`** section 2: `settingsButton`; `openDrawer` /
  `closeDrawer` set `aria-expanded` on both; `pressTopButton(tabName)`
  replaces `toggleDrawer`: `isOpen && currentTab === tabName` → close,
  else `showTab(tabName)` and open if closed. Section 3: `let currentTab
  = "app"`, kept by `showTab`. `startGame` = `loadGame` + `closeDrawer`;
  `afterDrawerSettles` deleted (unused). Section map line 2 reworded.
- **`app/styles.css`**: only the comment over `.top-icon`.
- **Check**: scratchpad `check-topbar.cjs` drove the eight states
  (start open on GAMES; pick Stack closes; Settings → THIS GAME; Home →
  GAMES; Home closes; Home opens GAMES; Settings switches; Settings
  closes) and screenshotted the bar. Worth adding to `check-shell.cjs`.
- **`games.json`**: Stack's `credits` "v 0.19.2 10/2026 claude/jp".
- **The stamp**: `2026-1017-stack-sound`, 27 places now (Stack's index
  gained `sound.js`): app.js 1, Candy Go Fish index 19 + script 1,
  Stack index 4, root index 2.
- **Line endings**: app.js, styles.css and index.html were all LF by
  this session (`grep -c $'\r'` = 0); the earlier mixed-endings trap
  may be history, but check before a big edit.

## 4n. The double-tap zoom guard, reportScore's place, the stamp (2026-10-17 16:27)

**The guard.** At the end of `games/game-helper.js` (CRLF) and as
section 7 of `app/app.js`:
```js
let lastTouchEnd = 0;
document.addEventListener("touchend", (event) => {
  const now = Date.now();
  if (now - lastTouchEnd < 350) event.preventDefault();   // the second tap: no zoom
  lastTouchEnd = now;
}, { passive: false });
```
`passive: false` matters: a passive listener cannot `preventDefault`.
Touches inside the iframe never reach the parent's listeners, so the
helper's copy is the one that covers the games; `app.js`'s covers the top
bar and the panel. `games/pumpkin-patch/index.html` now loads the helper
(before its own script) for the guard alone.

**What did not work, kept as requests.** `index.html`'s viewport line is
`width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no,
viewport-fit=cover` (Stack's and Pumpkin Patch's pages have the same
without the cover); iOS ignores the no-zoom part for accessibility.
`.game-frame { touch-action: manipulation }` in `styles.css`. A watchdog
on `visualViewport.scale` that rewrote the viewport line (the classic
reset) did nothing on Chrome for iPhone and was deleted. The diagnostic
box that found the zoom (a fixed `#probe` div, a log in localStorage
under `halloween2026:probe-log`, shown only when `frame.top < 0 ||
scrollY || scale != 1 || visualViewport.offsetTop || innerHeight !=
100svh`) is deleted too; the four iPhone screenshots are in
`games/stack-o-lantern/_documents/`.

**reportScore returns the place.** In `app.js`:
```js
  fillScores(currentGame);
  // Where did it land? indexOf finds this very score object; -1 (cut
  // off the end) becomes 0, the top line becomes 1.
  return data.scores.indexOf(score) + 1;
```
The early returns return 0. The helper: `return app.reportScore(value,
text, notes)`, else 0 with the console note. The requirements doc (rule
19 and the snippet) say so.

**games.json.** Stack: `"designer": ""`, `"date": ""` → `setTextOrHide`
hides `#thisGameByline`.

**The stamp.** `2026-1017-stack-victory`, 29 places: app/app.js 1,
candy-go-fish index 20 (its helper tag now), js 1, stack index 4, pumpkin
patch index 1 (its new helper tag), root index 2. The helper itself has
no `?v=` inside; its loaders carry it.

## 4o. The choices feature, in and out; the stamp (2026-10-17 17:57)

Built and removed within the hour (see the game's technical spec 10.5
for what it was). Nothing of it remains in code but a sentence in app.js
section 4's comment. The stamp is `2026-1017-stack-practice`, 29 places
(the same count as 16:27).

## 4p. The three-cell board, the game-named tab, high_scores, the italic mark, the stamp (2026-10-18 12:14)

- **app.js**: `LAST_SLOT = 3`, `SLOTS_PER_ROW` gone. `makeGameButtons()`
  makes one `div.game-board` and appends every button with the class
  `cell-<slot>`; no rows. `pickButtonGames` unchanged (1..LAST_SLOT).
- **styles.css**: `.game-buttons { position: relative; min-height: 100%
  }` (the percentage resolves because `.drawer-body` is a definite-height
  flex item); `.game-board { position: absolute; top: 25%; height: 50%;
  min-height: var(--game-button-size); left: 0; right: 0 }`; `.game-board
  .game-button { position: absolute }`; `.cell-1 { top: 0; left: 9.5cqw
  }`, `.cell-2 { top: 50%; left: 50%; translate: -50% -50% }` (`translate`,
  not `transform`, so `.is-current`'s transform still applies), `.cell-3
  { bottom: 0; right: 9.5cqw }`. `.board-row` gone. Measured headless
  at 390x844 / 375x667 / 1200x900: board top at 27.7% of the padded tab
  body (25% of its content box), bottom at 72.6%; buttons 69 / 61 / 82
  px; the vertical step 30 / 24 / 37 px; no errors.
- **The tab**: `const gameTab = document.querySelector('[data-tab="game"]')`
  (section 5, by `topTitle`); `loadGame` sets `gameTab.textContent =
  shortName(game.short_title || game.title)`; `shortName(text)` (section
  3, before `appendMarkedText`) returns the first `__..__` group or
  `plainText(text)`. CSS `.drawer-tabs button`: `min-width: 0; padding: 0
  2cqw; text-transform: uppercase; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis`. `index.html` keeps "THIS GAME" as the text
  before the first load, with a comment.
- **high_scores**: `fillThisGameTab` sets
  `document.querySelector(".this-game-panels").hidden = game.high_scores
  === false` before `fillScores` / `fillSwitches` (`[hidden]` is
  `!important`, so the grid rule loses). `_about.fields.high_scores`
  documents it. `index.html`'s tab comment says five scores and names the
  field.
- **The italic mark**: `MARK = /(\*\*.+?\*\*|\*.+?\*|__.+?__|~~.+?~~|\n)/`
  (the double first), `appendMarkedText` builds `<i>` for a piece that
  starts with one `*`, `plainText` strips single `*` too. `_about`'s
  description note lists `*italic*`.
- **games.json**: candy-go-fish slot 3; game3..game7 `""`; pumpkin-patch
  `settings: []`, `high_scores: false`, `designer` / `date` /
  `description` "", `how_to_play` "Nothing to do here.\nJust sit back and
  watch.", `credits` "jp/claude/chatty 10/2025"; stack-o-lantern's
  description gained "*Milestones do not affect the score.*\n*They are
  bragging rights only.*" after the Sharp Eye line.
- **styles.css 5b**: `.look-pumpkin-patch { text-align: center }`,
  `.look-pumpkin-patch .this-game-heading { margin-bottom: 1.6em }`.
- **pumpkin-patch.js**: `RISE_TIME [1, 3]`, `WAIT_AT_TOP [1, 2]`,
  `WAIT_HIDDEN [2, 6]`.
- **Line endings**: `app/styles.css` is mixed again (the picker block is
  CRLF); the day's edit scripts try LF then CRLF per passage.
- **Checks** (scratchpad, not kept): `check-diagonal.cjs`,
  `check-tabname.cjs`, `check-patchtab.cjs`, `check-italics.cjs`, all on
  8098 with in-page clicks.
- **The stamp**: `2026-1018-diagonal`, 29 places (app.js 1, root index
  2, Go Fish index 20 + js 1, Stack index 4, patch index 1).

## 4r. The GAMES tab column, the row, button_label (2026-10-18 13:04)

- index.html `#tab-app` holds `<div class="games-tab">` with
  `<p class="games-title" id="gamesTitle">` (empty; app.js fills it),
  `<div class="game-buttons" id="gameButtons">` and
  `<p class="games-credits">Credits: jp/claude/chatty 10/2026</p>`.
- app.js: `const GAMES_TAB_TITLE = "~~HALLOWEEN 2026!~~\nSmall games
  with a Halloween feel.";` above `makeGameButtons`, which starts with
  `appendMarkedText(document.getElementById("gamesTitle"),
  GAMES_TAB_TITLE)`; for each game with a `button_label` it appends
  `<span class="game-label">` filled by `appendMarkedText` inside the
  button; `loadGame`: `gameTab.textContent = shortName(game.button_label
  || game.short_title || game.title)`. The comments at the top of the
  file and above `makeGameButtons` describe the row.
- styles.css (section 5, the picker): `.games-tab { display: flex;
  flex-direction: column; min-height: 100% }`; `.games-title` centred with `margin-top: 3cqw` ("it crowds the top rule"),
  `.games-title .rainbow { font-size: clamp(20px, 7cqw, 36px);
  font-weight: 800 }`; `.games-credits` (opacity 0.7, 0.85em, centred);
  `.game-buttons { flex: 1; display: flex; flex-direction: column;
  justify-content: center; --game-button-size: 20cqw }`; `.game-board {
  display: flex; justify-content: space-around; align-items: flex-start;
  padding-bottom: 6cqw }` (the labels' room, so the whole thing centres);
  `.game-board .game-button { position: relative }`; `.cell-1..3 { order:
  1..3 }`; `.game-label { position: absolute; top: 100%; left: -5cqw;
  right: -5cqw; margin-top: 1.2cqw; white-space: nowrap; font-size:
  clamp(11px, 3.4cqw, 18px); color: #fff; pointer-events: none }`;
  `.game-button { padding: 1.5cqw }`; the seven `.rainbow span` rules
  lost their `.this-game` prefix. The old `.game-buttons { min-height:
  100% }`, the absolute board and the cell positions are gone.
- games.json: `"button_label"` on pumpkin-patch ("Patch"),
  stack-o-lantern ("Stack"), candy-go-fish ("Fish"); `_about` describes
  it and the row.
- Measured by the scratch `check-gamestab.cjs` (loads index.html, clicks
  the GAMES tab, measures, shoots `gamestab-<width>.png`): at 390x844 the
  tab is 303 px tall, the title 58, the squares 76 px (icons 65) at x 54
  / 157 / 260, credits bottom at 288, no scrolling; at 375x667 the tab is
  263, squares 68 (icons 57). NOTE the drawer starts open on GAMES, so a
  check must not click Home first (that closes it).
- README.md's current-work line mentions the new tab.

## 4q. Marks in notes, the stamp (2026-10-18 13:04)

- `fillScores` (app.js): `if (typeof notes[slot] === "string")
  appendMarkedText(note, notes[slot]);` where it set `textContent`; the
  comment above the function shows the "**CHEAT**" example.
  `reportScore` is unchanged: a note is trimmed and cut to
  `MAX_NOTE_LENGTH` (16) BEFORE the marks are read, so a long bold note
  could lose its closing `**` and show the opening one; "**CHEAT**" is
  9 characters.
- `games/game-helper.js`: the notes line of the reportScore comment says
  the marks work.
- Checked by Stack's `_documents/checks/check-cheat.cjs` (a practice
  round inside the shell on 8098; it clears localStorage there first):
  `#thisGameScores .score-note b` reads CHEAT, the saved notes are
  `["Space Needle", "**CHEAT**"]`; `cheat-list.png`.
- Stamp `2026-1018-cheat`, 29 places (unchanged count).
