# Halloween 2026 — Technical Specifications

Last updated: 2026-10-01 12:39 (fourth day, third stretch: discussion only, the two sound options sketched in section 7; nothing built. Before that: high scores, switches and `games/game-helper.js`, see 4j)

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
games.json                 THE LIST OF GAMES: "games" array (v2 entries, see 4a) then an "_about" block documenting every field
manifest.json              Android/desktop full-screen ("standalone", portrait); icons: [] (TODO)
app/styles.css             app CSS (frame, panels, drawer) - moved from the mockup
app/app.js                 reads games.json at start-up; picker buttons, This Game tab (text, high scores, switches), drawer, loadGame/startGame/goHome. Never edited by designers
games/game-helper.js       THE HELPER a game includes to talk to the app: Halloween.reportScore() and nothing else (see 4j)
app/default-icon.svg       the ghost shown on a button that has neither a usable icon nor a title
games/pumpkin-patch/       the home game (was game0): index.html, pumpkin-patch.css/.js, assets/ (2025 art, patch.svg icon)
games/stack-o-lantern/     STACK-O'-LANTERN (Claude's stacker, was game4): index.html, stack-o-lantern.css/.js, assets/stack.svg
games/game1..game8/        NEUTRAL PLACEHOLDERS (see 4i): index.html, gameN.css/.js, empty assets/, README - GAME N.md
games/_TABLED GAMES/wrong-desktop/    TEST GAME, deliberately wrong (was game2): fixed 1280 x 720 desktop stage in px; wrong-desktop.css/.js
games/_TABLED GAMES/wrong-phone/      TEST GAME, deliberately wrong (was game3): fixed px for a 390-wide phone, small text, scrolls; wrong-phone.css/.js
games/_TABLED GAMES/       written + tested games that are NOT used in the app (John, 2026-10-01); nothing in the app points here
games/_TABLED GAMES/pie-maker/        PIE MAKER, TABLED 2026-10-01 (no games.json entry; was game1): index.html, pie-maker.css/.js, assets/pumpkin.svg, pie.svg (also its icon)
games/_TABLED GAMES/hollow-hill-cc/   HOLLOW HILL, TABLED (no games.json entry): index.html, hollow-hill.css, hollow-hill.js (story + engine), hollow-hill-art.js (SVG art), assets/hill.svg
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

## 4. Three-panel layout (index.html + app/styles.css)

- **`--bar-h: 11.111cqw`** — the key number. Frame height = 16/9 × width, so
  1/16 of the height = 1/9 of the width = 11.111cqw. Both bars use it, which
  is what makes them identical. (cqw is used because the shell is an
  `inline-size` container; there is no cqh.)
- Structure: `.app-shell` (flex column) → `.top-panel` (height `--bar-h`) +
  `.play-area` (flex 1, `position:relative`, overflow hidden).
- Inside `.play-area`:
  - `.game-panel`: absolute, `top:0; left:0; right:0; bottom: var(--bar-h)`
    → exactly 9:14.
  - `.drawer`: absolute, `bottom:0`, height
    `calc(var(--bar-h) + (100% - var(--bar-h)) * var(--drawer-open-share))`
    with `--drawer-open-share: 0.55`.
    Closed: `transform: translateY(calc(100% - var(--bar-h)))` → only the strip
    shows. Open (`.is-open`): `translateY(0)`. Slides with a 300ms transition.
- **Edges are drawn INSIDE the bar heights** (border-box): top panel
  `border-bottom: 2px`, drawer `border-top: 2px`, strip
  `flex: 0 0 calc(var(--bar-h) - 2px)`. Measured: both bars 42.44px on a
  390px viewport.
- Frame edge is an `outline` (takes no space, follows border-radius).
- `--frame-radius: clamp(8px, 2.6cqw, 16px)` on the shell; top panel uses
  `radius radius 0 0`, drawer `0 0 radius radius`.
- Drawer shadow only when open (when closed it leaked up as a grey smudge).
- **`inert`** is set on `.drawer-content` while closed so its off-screen
  buttons cannot be reached by keyboard; strip `aria-label` flips
  "Open panel"/"Close panel".
- The "gentle arrow" is a CSS chevron (two borders rotated 45°), 60% opacity,
  rotating to 225° when open.
- JS (`app/app.js`) is small named functions: `openDrawer`, `closeDrawer`,
  `toggleDrawer`, `showTab`, `loadGame(game)`, `startGame(game)`, `goHome()`,
  `makeGameButtons()`.

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
  `response.ok` and that `data.games` is an array. Then `homeGame` = the
  entry with `goes_in_slot === "home"`, `games = pickButtonGames(all)`:
  keeps entries whose slot is an integer 1..`LAST_SLOT` (8), first entry
  wins a duplicate slot (`console.warn`), anything else is skipped with a
  `console.info`; result sorted by slot. Then `makeGameButtons()` and
  `goHome()`. `readGamesFile()` reads the body as text and runs
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
  `startGame()` additionally `showTab("game")` before closing the drawer.
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

| Viewport | Frame | Game panel | Pie Maker info bar / field |
|---|---|---|---|
| 375×667 ×2 (SE) | 337.8 × 600.6 | 337.8 × 525.5 | 41.6 / 338 × 483.7 |
| 390×844 ×3 (15/16) | 382 × 679.1 | 382 × 594.2 | 46.9 / 382 × 547.1 |
| 440×956 ×3 (16 Pro Max) | 432 × 768 | 432 × 672 | 52.6 / 432 × 619.4 |

SE is height-limited (frame fits the height); the others are width-limited.
Pro Max panel ×3 = 1296 × 2016 → the design canvas. PC/Mac figures in the
requirements doc are estimates (browser toolbars vary).

## 4c. Pie Maker (folder `_TABLED GAMES/pie-maker`, tabled 2026-10-01, was game1) implementation notes

- All positions/sizes/speeds in "field widths"; pixels computed every frame
  from `field.clientWidth`, so it survives resizes.
- `requestAnimationFrame` loop, time step capped at 0.1 s.
- Wrap-around: a pumpkin jumps to the opposite edge only once fully off.
- `pointerdown` per pumpkin image (instant on touch). Pies get
  `z-index: 1`, pumpkins `2`, so pies never block taps.
- Settings constants at the top of pie-maker.js (count 10, size 0.13–0.24,
  speed 0.08–0.22 widths/s with small = fast, spin ±60°/s).
- Text via `.text-medium` / `.text-large` classes in the HTML. The
  `.play-again` button uses `font-family: inherit`, not `font: inherit`:
  the shorthand would reset `font-size` and beat the `.text-medium` class
  (same specificity, later rule wins).

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

## 4b2. The picker, icons and This Game (app.js sections 3–4, styles.css section 5)

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
- **`makeGameButtons()`** (board version, 2026-09-29 evening): the home
  button straight into `#gameButtons`, then a `div.game-board` holding up
  to two `div.board-row`s: `upperRow = games.filter(slot <= SLOTS_PER_ROW)`,
  `lowerRow = games.filter(slot > SLOTS_PER_ROW)`; a row with no games is
  not created. Each button gets `style.gridColumn = ((slot - 1) %
  SLOTS_PER_ROW) + 1` (slots 1 and 5 → column 1, and so on). Constants:
  `LAST_SLOT = 8`, `SLOTS_PER_ROW = 4`.
- **CSS**: `.game-buttons { display:flex; flex-direction:column;
  align-items:center; gap:4.5cqw; --game-button-size:18cqw }` (the gap is
  wider than the board's 3cqw because the pressed home button sinks 1.2cqw
  and its mint ring was touching the row below); `.game-board {
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

## 4e. The two wrong test games (wrong-desktop, wrong-phone; were game2, game3; tabled 2026-10-01)

Plain pages with no page-setup block, so the iframe's default scrolling
shows. (Below, "game2" = wrong-desktop and "game3" = wrong-phone.) game2: `#stage { width: 1280px; height: 720px }`, `click`
handlers, a `:hover` colour. game3: `.page { width: 390px }`, an 8-column
grid of 40 px `.square`s (12 random ghosts via a `Set` of indices), 16 px
body text. Each README lists the rule numbers it breaks. Verified with
chrome-devtools at 390×844×3 mobile and 1920×1080: panel 547 × 851 on the
PC; game3 sits in the top-left with a blank strip on the right.

## 4f. games.json v2: implemented 2026-09-29

Built as described in 4a and 4b2 (the plan that used to sit here was
superseded by John's `goes_in_slot` / snake_case shape). Not built: an
icon in the top bar next to `short_title`; only if John asks.
- **Renames** were done with `git mv` so history follows: `game0` →
  `pumpkin-patch` (+ `pumpkin-patch.css/.js`, `README - PUMPKIN PATCH.md`),
  `game1` → `pie-maker` (+ `pie-maker.css/.js`). Every old reference was
  replaced (their own files, game2–4 READMEs and CSS comments, the
  requirements doc, the root README).
- **Icons**: `games/pumpkin-patch/assets/patch.svg` (100×100 viewBox, all
  shapes inside a `<clipPath>` rounded square so the ground doesn't poke
  out of the corners); Pie Maker points its `icon` at the existing
  `assets/pie.svg` sprite. `app/default-icon.svg` is a ghost on
  transparent.
- **Test method** for the icon check: three throwaway PNGs made with
  Pillow (256×250 ok, 150×150 too small, 256×230 lopsided) plus a missing
  path, built into buttons via the page's own `makeIconButton()` from
  chrome-devtools `evaluate_script`; results and console warnings matched
  the spec. The PNGs were deleted afterwards.

## 4g. Stack-o'-Lantern implementation notes (games/stack-o-lantern/)

- **Every number in stack-o-lantern.js is in vw**; positions are written as `"Nvw"`
  strings into `style.left/bottom/width`, so the browser does the pixel
  maths and resizing is free. `--slab-h` (9vw) and `--ground-h` (10vw) are
  CSS variables read once by JS (`readVw`), so CSS and JS cannot disagree.
- **World vs camera**: slab positions are world coordinates (y up from the
  stage bottom). The camera is ONE `translateY` on the `.tower` container
  (stars ×0.25 and moon ×0.12 for parallax), so placed slabs are set once.
  The ground element is created inside `.tower` by `reset()` so it scrolls
  away too.
- `drop()`: perfect if `|mover.x - top.x| <= PERFECT_TOLERANCE`; else
  overlap = `min(rights) - max(lefts)`; `< MIN_OVERLAP` = miss (the whole
  slab becomes a falling piece); else the overhang becomes a piece
  (`addFallingPiece`, gravity 320vw/s², spin) and the mover settles
  (`settle()` → `placeSlab`, `updateLabels`, `spawnMover`).
- Reaction word restarts its CSS animation via `void el.offsetWidth`
  between removing and adding `.is-shown`. The moon's mouth is one element
  restyled by class (`is-happy/is-wow/is-meh/is-sad`).
- `requestAnimationFrame` loop, dt capped at 0.05 s. `pointerdown` on the
  stage; Space/Enter as a keyboard extra.
- Tested with `evaluate_script` driving `pointerdown` events and waiting
  for alignment; the reaction word was screenshotted by pausing its
  animation (`animationPlayState = "paused"`) since a screenshot call
  arrives after 800 ms.

## 4h. Hollow Hill implementation notes (games/_TABLED GAMES/hollow-hill-cc/, tabled)

- **Three files**: `hollow-hill-art.js` (an `ART` object: `scenes.{square,
  gate, graveyard, crypt, chapel, bog, hilltop}(flags)` returning SVG
  markup for a `viewBox="0 0 1000 1120"`, plus `ITEM_ICONS`), and
  `hollow-hill.js` in three parts: STORY (data), ENGINE, START/END.
- **STORY shape**: `STORY[sceneId] = { name, art, exits: [{to, side,
  label, when?, blocked?}], hotspots: [{id, label, x, y, w, h, when?,
  tap(item)}] }`. `tap` returns `[[who, text], ...]` or `{ lines, then }`.
  Story helpers: `flags()`, `set(flag, value)`, `has/give/take(item)`.
  `FRESH_FLAGS` is deep-copied on `start()`. Lines with `who === ""` are
  narration (italic). `hintFor(flags)` is an ordered if-chain.
- **ENGINE**: `showScene(id, glow)` draws art, builds hotspot buttons
  (picture units → %: `x/10`, `y/11.2`; min 140 units) and exit buttons;
  `tapHotspot` runs `tap(held)`, then `say()`, then redraws ONLY if the
  flags changed (a JSON compare), so the SVG animations are not restarted
  by every tap; `say/advance` run the queue, and `then` fires when the
  LAST line is shown so an item pops in while the line mentioning it is
  on screen; `hold(item)` toggles `.is-holding` on the scene (rings).
  Taps anywhere on the scene or box advance dialogue; hotspots/exits
  `stopPropagation`.
- **Crypt door**: `pressSymbol()` appends to `flags.doorCode`; a wrong
  symbol resets; complete → `doorOpen` and `showScene("crypt")` in `then`.
  Door symbol hotspots have `when: () => !doorOpen`; the skull hotspot
  `when: doorOpen && !skullTaken`.
- **SVG gotcha**: a CSS `transform` animation on an SVG element REPLACES
  its `transform` attribute, so every animated group (`.bob`, `.sway`,
  `.drift-*`) sits inside a plain positioned `<g transform=...>`.
  `stars(seed, ...)` uses a tiny LCG so the sky is stable across redraws.
- Layout: `body` flex column; `.scene` flex 1 (≈112vw on 9:14), `.dialogue`
  26vw, `.inventory` 17.6vw. The SVG uses `preserveAspectRatio="xMidYMid
  slice"`; the hotspot percentages assume the 1000:1120 shape, so on
  9:13–9:15 panels they drift slightly (accepted by rule 3's SHOULD).
- **Test method**: `evaluate_script` playthrough using the REAL buttons by
  `aria-label` ("Go to Bog", "Two crows", "Shiny spoon"), reading dialogue
  by tapping the box, including wrong turns; a debug `<style>` injected
  into the page outlined the hotspots for the screenshots (not in code).
  Sizes 382×594, 338×526 (three-line dialogue fits, no overflow),
  547×850; picker + This Game in the app.

## 4i. Placeholder folders and the 2026-09-30 reshuffle

- **Where a neutral placeholder comes from**: the original game4
  placeholder in git, commit `c44f4de` (the last commit before
  Stack-o'-Lantern overwrote it). game2 and game3 cannot be the source,
  they are the wrong-on-purpose tests. Recipe for game N: `git show
  "c44f4de:games/game4/<file>"` piped through `sed` swapping `game4`,
  `Game 4` and `GAME 4` for the new number, for `index.html`,
  `game4.css`, `game4.js`, `README - GAME 4.md` (file names renamed the
  same way), plus an empty `assets/.gitkeep`. Made this way: game1,
  game4, game5, game6, game7, game8; identical apart from the number.
- **A placeholder page**: `<h1>` name, "Placeholder page for Game N.",
  and `#sizeReadout` filled by `showSize()` ("Game panel: 382 × 594 px
  (9:14 = 1.556, this = 1.555)"), refreshed on `resize`. CSS = the 2.2
  page-setup block + the 2.3 text classes + a lilac page (`#efdcef`).
- **Stack-o'-Lantern's move**: `git mv games/game4 games/stack-o-lantern`,
  then `git mv` of `game4.css/.js` to `stack-o-lantern.css/.js`, then the
  `<link>`/`<script>` tags and the comments and README inside the folder.
  The old placeholder's `assets/.gitkeep` travelled with it (harmless).
- **Hollow Hill**: John renamed the folder in Explorer (git sees delete +
  add and pairs them as a rename when staged). Only two things in the app
  named it: the games.json entry and the version tag `2026-0929-hollow`.
  Its own files still say `hollow-hill` and `games/hollow-hill/` in
  comments; left alone on purpose until it is brought back. Its old
  games.json entry is in git, commit `c979de7`. On 2026-10-01 John moved
  the folder again, to `games/_TABLED GAMES/hollow-hill-cc/` (the first
  name was `games/_NOT-USED-hollow-hill-cc/`).
- **Pie Maker tabled (2026-10-01)**: `git mv games/pie-maker
  "games/_TABLED GAMES/pie-maker"`, entry deleted from games.json,
  `stack-o-lantern` changed from slot 2 to slot 1, version tag bumped to
  `2026-1001-tabled`. Every "see Pie Maker for an example" pointer now
  names `games/stack-o-lantern/`: the requirements doc (four places), the
  root README, the six placeholder READMEs, and game2/game3's READMEs and
  CSS comments. Pie Maker's own files are untouched; its README's
  relative link to the requirements doc no longer resolves from the
  tabled location (same policy as Hollow Hill: fix when brought back).
  To bring it back: move the folder up to `games/` and restore its entry
  from git (commit `a5bdbf7`). Tested at 390×844: seven board buttons
  all load, Stack-o'-Lantern sits in column 1, cell 2 is empty,
  `games/pie-maker/index.html` answers 404.
- **The wrong test games tabled (2026-10-01)**: `git mv games/game2
  "games/_TABLED GAMES/wrong-desktop"` and `game3` → `wrong-phone`, then
  `git mv` of the inner files (`wrong-desktop.css/.js`, `README - WRONG
  DESKTOP.md`, same for wrong-phone), the `<link>`/`<script>` tags, the
  first comment line of each css/js ("wrong-desktop (was game2) - ..."),
  and each README's title, status line and link to the requirements doc
  (now `../../README...`, so it resolves from the tabled location). Both
  still run when opened directly (tested in an iframe: click scores 1 on
  the 1280px stage; 48 squares on the 390px page).
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
  18.2cqw). `startGame` closes the drawer first and switches the tab in
  `afterDrawerSettles()` (transitionend on the drawer's own `transform`,
  600 ms fallback), because a visible tab switch flashed during the slide.
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

## 4k. Candy Go Fish implementation notes (games/candy-go-fish/, 2026-10-14 reading)

Authoritative detail is in the game's own `_documents/`; this is the
map Claude built while reading the code. Codex's style is dense (long
lines, compact IIFEs, no comments on the obvious); anything Claude adds
follows John's readable style instead.

**Files and load order** (`index.html`, all with `?v=` stamps):
`../game-helper.js` → `assets/json/config-data.js` (generated twin of
`game-config.json`, used for `file://` opening or fetch failure) →
`js/game-engine.js` (pure rules, `CandyEngine`) → `js/computer-player.js`
(the original weighted-random policy, kept as Ron's baseline) →
`js/shared/knowledge.js` (public-clue memory + exact hidden-card
distribution), `temporal-memory.js`, `temporal-beliefs.js` (particle
filter) → `js/strategies/beginner|medium|temporal|calibrated-*.js` →
`js/strategies.js` (adapter; also publishes a decision trace as JSON in a
`<script id="opponentDecisionTrace">`) → `js/candy-rain.js`,
`js/candy-piles.js` → `assets/sounds/victory-sounds.js` (generated index
of the 36 speech files) → `js/preload.js` → `js/sound.js` →
`js/candy-go-fish.js` (the controller, one async IIFE, ~720 lines).

**Engine model.** `CandyEngine.create(config)` deals so that no opening
hand holds a completed set. State: `pile`, `hands.human/wendy`,
`sets.human/wendy`, `turn`, `pending`, `finished`, `reason`, `winner`,
`history`. `request()` returns events (`request`, `transfer`/`set` or
`miss`); `fish()` always switches the turn. Public `history` never holds
the identity of a private draw. The role key for the opponent is still
`wendy` everywhere (the first opponent's name), whatever character is
shown.

**Controller phases**: `pickStarter → spinningStarter → starterReady`
(empty-board spinner, 3.7 s, ticks follow the rendered rotation) then
`choose / requesting / thinking / wendyRequest / fishResponse /
humanFishWait / wendyFishWait / drawing / finished`. A `generation`
counter invalidates every awaited step when a new round starts; `waitActive`
and `playVisual` poll every 40 ms and pause while a dialog is open.
`render()` rebuilds the whole board from state each time.

**Audio.** `preload.js` loads every image and 48 short clips (plus the
three soundtracks as media elements, 20 s bound each) while the welcome
shows; the Play button says "Loading assets" until it settles, with 6 s /
20 s bounds and failure permitted. `sound.js` routes every clip through
Web Audio: one gain per clip → `ui` or `music` channel gain → destination.
Spinner ticks are a synthesized 18 ms noise burst through a 3.2 kHz
low-pass.

**Music (2026-10-15, Claude's code in John's readable style).** In
`sound.js` a `musicTracks` table (`id`, `name`, `file`) holds one lazily
created clip entry per tune; `currentTrack` points at the chosen one.
`startWelcomeMusic` fades the current tune's clip gain 0 → 0.5 over 3 s;
`fadeOutTrack(track, seconds, fadeInStart)` fades any tune to 0 and pauses
it after the ramp (position kept). `fadeOutWelcomeMusic` is a 2 s fade of
the current tune, and does nothing in `musicMode === 'continuous'`.
`selectTrack(id)` fades the old tune out over 1 s and starts the new one
if a dialog wants music. Channels carry a `scale`: music is `1 / 0.75`, so
`setChannelVolume('music', v)` with the slider's 0..1 gives up to a third
more than the original level (0.75 = old level, default 0.8). Mode API:
`musicMode` / `setMusicMode('paused' | 'continuous')`.

The popup lives in `index.html` as a second overlay `#musicOverlay`
(`.music-options`, z-index 30, panel 90vw × 94vh, flex column with the
Cancel/Done row pushed to the bottom). `candy-go-fish.js` snapshots the
settings on open (`musicBefore`), applies each control immediately, and
Cancel re-applies the snapshot. The Tab trap in the keydown handler
switches to the popup's controls while it is open.

**Saved settings.** Key `halloween2026:candy-go-fish:music`, value
`{ enabled, volume, track, mode, ui }`, written by `saveSoundSettings()`
on Done and on the UI toggle, read once by `restoreSoundSettings()` at
startup with every field validated (unknown tune, out-of-range volume or
bad JSON are ignored). Both are wrapped in try/catch so a browser that
refuses storage still starts the game.

**Candies per set (2026-10-15).** `config.rules.copiesPerType` is the
single source: `engine.create` builds the deck from it, every strategy
reads it from the view (`view.copiesPerType`), the Rules and celebration
texts read `state.copies`, and the hand art stacks up to three images.
`applySetSize(copies)` in `candy-go-fish.js` writes `copiesPerType` and
`initialHandSize = base + (copies - baseCopies)` into `config.rules`,
which the next `startGame` / `dealGame` picks up; `baseRules` is a copy of
the file's values taken at load. Saved under
`halloween2026:candy-go-fish:rules` as `{ copiesPerType }`; only 4 is
honoured, anything else means the file default. The switch `#setSizeChoice`
lives in the dialog markup between `#dialogBody` and `#dialogAction` and is
shown by CSS only under `.welcoming` (add `.new-round` for Deal again?).
Audit numbers: 300 simulated games per opponent per size, opponent win
rates 60/66/83 percent at four copies against a random human versus
58/58/76 at three; four-copy games average 47 requests versus 28.

**Two-way slider switch (CSS).** `.two-way` is a flex row with a
`.two-way-thumb` span absolutely positioned under the first half;
`data-selected="1"` on the group translates the thumb by 100 percent
(0.25 s, none under reduced motion). The pressed button
(`aria-pressed="true"`) gets the dark text and a `::after` green circle with
a cream check at `top/right: -1.6vw`, outside the button box, so it never
overlaps the candy bars. JS sets `data-selected` and both `aria-pressed`
values together (`applySetSize`, `syncMusicPopup`).

**Remembered characters.** `halloween2026:candy-go-fish:players` holds
`{ opponent, player }` (names). `restorePlayers()` runs before the
module-level `humanName` / `opponentName` are read, so it simply
`Object.assign`s the matching entries from `config.playerCharacters` and
`config.opponents` into `config.players.human/wendy`; no cue sound, no
renaming. Each switch function calls `savePlayers()`.

**Speaker buttons.** `.audio-toggle` is a flex column: the 11vw image,
then the label. The slash is the button's `::after`, absolutely centred on
the image (`top: 5.5vw`) and shown by `aria-pressed="false"` (UI toggle,
popup ON/OFF) or `.is-off` (the MUSIC button, which opens the popup).
Lesson: an `img` with a CSS `filter` forms a stacking context and paints
above later in-flow siblings; anything meant to sit over such an image
needs `position: relative; z-index`.

**Give-path redraw.** In `resolveRequest`, when the actor is the opponent
(the human gives), `render()` runs before `fly()` instead of only
`piles.render(state)`; the flight's source rectangle was snapshotted by
`piles.begin` beforehand, so the redraw does not move it.

**Stale checks.** `verify-go-fish-reply.cjs` (clicks Let's play and expects
a selectable hand; the starter spinner now comes first), `verify-quotes.cjs`,
`verify-speech.cjs` and `verify-speech-redraw.cjs` (the last three expect
"Wendy asks:") fail on any current code and are not part of Codex's
October 13/14 pass lists. Item 10 in `NEXT-TODOS.md`.

**Dialog frames (2026-10-15 pm).** The vine-and-plate frame is one
`::before` rule shared by `.welcoming`, `.new-round`, `.rules` and
`.music-options` dialogs (`position: relative; isolation: isolate`, the
frame at `inset: -3.2vw`, `z-index: -1`). A frame drawn by `::before`
scrolls and clips with a scrolling box, so no framed dialog scrolls as a
whole: Rules is a flex column with `max-height: 94vh` and only
`#dialogBody` scrolls; the Sound popup likewise, with its rows in
`.music-body` and the title and `.music-actions` pinned. The welcome, Deal
again? and Rules dialogs share the `.dialog-audio` row (one `#dialogSound`
button, `justify-content: flex-end`) and the `#setSizeChoice` switch
shows under `.welcoming` and `.new-round`.

**Sound popup (2026-10-15 pm).** Same overlay (`#musicOverlay`), same
storage key and same `musicSettings()` snapshot, which now includes `ui`,
so Cancel restores the UI channel too and `saveSoundSettings` writes the
snapshot as is. Toggles `#uiEnabled` and `#musicEnabled` are `.audio-toggle`
buttons without a label; `syncToggle(id, name, on)` sets `aria-pressed`
and the aria-label, CSS draws the green glow (`box-shadow` on the image)
or the red slash. The Always/Paused switch has Always on the left, so
`#modeChoice` gets `data-selected` "0" for continuous and "1" for paused.
The dialog SOUND button carries `.is-off` only when both channels are off.
The volume `<output>` is gone; `.volume-ticks` is a flex row of six
numbers under the range. The layout is sized by `vw` with a
`@media (max-height: 700px)` block that tightens spacing on short screens.
Measured with a throwaway script at 390x844, 390x664, 375x667, 390x560
and 338x526: the buttons stay on screen and the body does not scroll.

**Game-over music (2026-10-15 pm).** In `sound.js`, `victoryMusicAfter(ms)`
arms one timer that calls `startWelcomeMusic()` only while
`musicMode === 'paused'`. `scheduleVictory` sets `victorySpeechPending`
when it arms the two-second speech timer; when the speech plays it arms
the music for the clip's duration plus a second (a fallback for a phone
that silently refuses the clip) and `clip.onended` re-arms it to one
second. `scheduleGameOverMusic()`, called at the end of `finishGame`,
arms three seconds when no speech is pending (tie, UI off, no clip).
`cancelVictory` clears both timers; `replayAfterRain` calls
`fadeOutWelcomeMusic()` so the music fades during the rain drain (a no-op
in continuous mode). `verify-victory-sounds.cjs` was rewritten: its
sandbox `setTimeout` keeps the 2000 ms timer as the speech and any other
delay as the music timer, and the test fires them by hand.

**Top buttons.** `.game-bar button` is 27vw by 13vw (13vw is the minimum
target `verify-browser` enforces); the candy bar is a `::before` layer
with `filter: hue-rotate(170deg) saturate(0.7)` (red bar, hue 1, to the
gradient top #21786b, hue 171) so the cream text on top is untinted. The
label is a visible `<span>` again (it used to be visually hidden under the
carved pumpkin art). `preload.js` lost the two pumpkin entries.

**UI toggle on iOS (2026-10-15 evening).** `stopAll(channel)` and
`cancelVictory` touch only clips with `!clip.paused`; `rewind(clip)` skips
`readyState === 0` and swallows the InvalidStateError iOS throws for an
unloaded clip; `play()` calls `rewind` before `clip.play()` so a clip
paused mid-way by the OFF switch starts over. The popup's UI toggle
handler redraws in a `finally`. Checked with a desktop simulation whose
`currentTime` setter always throws (`ios_toggle_check.cjs`, scratch).

**Set-size notes.** `#setSizeNote` (absolute, under the right bar button)
and `#setSizeNoteHuman` (inside `#humanPile`, `bottom: 100%`) are written
by `applySetSize`.

**Icon.** `assets/candy-dish/icon-candy-plate.png`, 256x256, built by a
scratch script (`make_icon2.py`: ghost plate at 250 px, three trimmed
candy images resized, rotated and shadowed at hand-placed centres). The
shell's `iconQualifies` accepts it; `verify-assets` and `verify-shell`
name it.

**Editing traps learned 2026-10-15.** `app/app.js` and `app/styles.css`
have mixed line endings (CRLF from older edits, LF from newer), so an
exact-text replacement must try both; a Bash heredoc holding a long
Python script with quotes failed to parse once and a `str.find` slice of
`index.html` swallowed three `<script>` tags (restored from git). Scratch
edit scripts are now written as files and replace whole lines where they
can.

**"(you)".** `showTableName()` in `candy-go-fish.js` writes
`humanName.toUpperCase() + ' (you)'` to the player's `.portrait-name`;
`switchPlayerCharacter` calls it. The game-over title adds " (you)" to
the human winner only. `verify-browser` and `verify-player-switch` were
taught the suffix. The throwaway Playwright scripts written on 2026-10-15
(give path, players note, set size, popup, four-copy UI rounds, node
simulation) were not kept; their shape is described in the handoff.

**Config.** `assets/json/game-config.json` is authoritative; after an
edit run `node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs`
(it validates candy names first). After renaming victory MP3s run
`sync-victory-sounds.cjs`.

**Checks** (`node games/candy-go-fish/_documents/codex-john-docs/<script>`
from the repo root): `validate-candy-names`, `verify-engine` (1,000 games
per set size), `verify-assets` (every referenced asset exists, no unused
tracked asset; untracked audio is ignored), `verify-victory-sounds`,
`verify-sound-layout`, `verify-spinner-ticks`, `verify-welcome-music`,
`verify-browser`, `verify-shell`, `verify-player-switch`,
`verify-opponent-switch`, `verify-candy-rain-game`, `verify-piles`,
`verify-abilities-browser`. All of these passed on 2026-10-15 at 15:00;
the Playwright ones rewrite their PNGs under `codex-john-docs`, restored
with `git checkout --` before committing. The browser checks
hard-code Playwright at `C:/Users/johnp/.cache/codex-runtimes/...` and
Chrome at `C:/Program Files/Google/Chrome/...`; most open the page by
`file://`, some (`verify-browser`) need a local server on port 8098:
`python start-local/no-cache-server.py --port 8098`. Two traps learned
2026-10-15: a check whose assertion fails leaves the browser open and the
node process hangs instead of exiting, so run checks one at a time and
watch for silence; and `verify-assets` rejects any tracked audio that no
code references, so a new MP3 must be added to its `referenced` list.
`verify-welcome-music` still keys on the Wonderful file and the 0.5 clip
ramp, both unchanged by the popup.

**Ties to the shell** (matter for the standalone move, see
`claudePlans/candy-go-fish-standalone-plan.md`): the helper script tag
and one `Halloween.reportScore` call; every size in `vw`, so the page
assumes a 9:14 viewport (`#table` is 154vw tall); `verify-assets.cjs`
reads `../../games.json`; docs link to the requirements file two folders
up.

**Publishing (Codex's rule, confirmed by a failed build):** Pages runs
Jekyll on this repo, so every tracked Markdown file must be valid UTF-8
before a push, and `_`-prefixed folders are not served (harmless, they
are docs). Cache stamp lives in five places: `APP_VERSION` in
`app/app.js`, two `?v=` in root `index.html`, every `?v=` in the game's
`index.html`, and the config fetch in `js/candy-go-fish.js`; the docs
also quote it.

**Endings, 2026-10-15 late evening.**

- **Rain moods.** `js/candy-rain.js` now has a `MOODS` table at the top
  (`full` and `tie`; a `trickle` row existed for an hour and is gone):
  burst, perTick, tickMs, maxOnScreen, total, brands, fallMs range, turns
  range, drift share and an extra CSS filter. `start(waitMs, moodName)`
  picks a row; the layer carries `data-mood`. `drop()` counts candies
  since the last start so a mood can have a finite `total`. `finishGame`
  passes `'tie'` for a tie and `'full'` otherwise. The old code is the
  `full` row, number for number.
- **Tie voiceover.** `sound.js` `assetMap()` adds `victory:tie` ->
  `assets/sounds/speech/tie/tie - no one saw that coming.mp3`. The
  `victory:` prefix is what `cancelVictory` and the preload key on, so
  the tie clip is preloaded, cancelled by New game and replayed by the
  speaker button like any speech. `scheduleVictory(winner, loser, 0)`
  selects it; `finishGame` now calls `scheduleVictory` for every result
  (names are irrelevant on a tie) and shows the replay button whenever
  `hasVictorySpeech`. `verify-victory-sounds.cjs` asserts the clip plays
  for margin 0 and that the file exists; `verify-assets.cjs` lists it.
- **Demo endings.** At the bottom of `js/candy-go-fish.js`: `DEMO_SETS`
  maps `win [6,4]`, `bigwin [8,2]`, `loss [4,6]`, `bigloss [2,8]`,
  `tie [5,5]` (player sets, opponent sets, ten types). When `?demo=` is a
  key, the welcome's Let's play callback is `playDemoEnding` instead of
  `startGame`: it runs `startGame()`, creates a real engine state, pools
  every card, hands whole types to each player as `{type, cards}` sets,
  empties pile and hands, sets `finished`, `reason 'allSets'` and
  `winner`, then calls `finishGame()`. Works over `file://` and HTTP. The
  shell's iframe URL does not carry the query, so open the game page
  directly (`/games/candy-go-fish/index.html?demo=loss`).
- **Session scripts (scratchpad, not in the repo):** `endings_shot.cjs`
  (five demos, mood, replay button, screenshots), `tie_check.cjs` (over
  port 8098: the tie clip is fetched with 200 during preload, the tie
  demo shows the replay button). Edits were made with whole-line Python
  scripts (`edit_endings.py`, `edit_tie.py`, `remove_loss.py`) per the
  line-ending trap: `sound.js`, `candy-go-fish.js` and the stylesheet
  are CRLF, `candy-rain.js` and the Codex docs are LF.

**Candy cannon and the sound diagnostic, 2026-10-15 late evening.**

- **Cannon.** `js/candy-rain.js` has a `CANNON` table beside the `RAIN`
  moods: `perVolley [5,8]`, `volleyMs [450,750]`, `maxOnScreen 60`,
  `brandChance .75`, `spread .25` (launch zone as a share of the width,
  centred), `angle 30` (degrees either side of straight up), `rise [.25,.6]`
  (climb above the muzzle as a share of the height), `gravity 1.8` (screen
  heights per second squared), `turns [90,540]`, `samples 40`. `fire()`
  does schoolbook projectile motion: vy from the rise (vy² = 2gh), vx =
  vy·tan(aim), flight time to two candy sizes below the bottom edge in
  closed form, then 40 keyframes of `translate(x(t), y(t)) rotate(...)`
  played with linear easing by `element.animate`, the same machinery and
  the same `animations` set as the rain, so `drain()` and `stop()` need no
  change. `start(waitMs, 'cannon', behindElement)` takes the game-over
  panel; the muzzle is its top edge (bottom of the screen if absent).
  Volleys are a `setTimeout` chain with jitter (`volley` timer), cleared
  by stop/drain. Reduced motion: two candies every 1.5 s, no tumble.
  `makeCandy()` is shared by rain and cannon. The layer stays at z-index 2
  on `body` and the panel at z-index 3 in the root stacking context, so the
  candies draw behind the panel and over the table.
- **Audio wake-up.** `CandySound.unlock()` = `prepareContext()` (create +
  resume) and is called first thing in the dialogs' confirm handler.
- **`?debug=sound`.** A block at the bottom of `js/candy-go-fish.js`
  builds a fixed panel (`#soundDebug`, z-index 100) refreshed twice a
  second: `CandySound.engineState` ('none' or the AudioContext state),
  `CandySound.enabled`, both channels' enabled/volume, `CandyPreload.settled`
  and `failures`, the device string, and a six-line log. Buttons: Wake
  engine (`unlock`), Engine beep (`CandySound.testTone()`, an oscillator
  straight into the context destination), UI clip (`play('confirmText')`),
  Plain clip (a `new Audio` NOT routed through the context). Absent without
  the parameter; remove when no longer needed.
- **Finding and plan.** See `claudePlans/iphone-speech-buffers-plan.md`.
  Short form: iOS lets an `HTMLMediaElement` start only inside a user tap
  or shortly after; every clip here is its own element routed through the
  AudioContext by `createMediaElementSource`; the ticks (AudioBuffer
  sources) are exempt. Proposed: decode the 48 UI clips at startup and the
  chosen victory clip on demand into AudioBuffers and play them like the
  ticks; music unchanged. Checks to rewrite: `verify-sound-layout`,
  `verify-victory-sounds`.
- **Session scripts (scratchpad):** `cannon_check.cjs` (brand mix, pause,
  stacking, clickability, drain, two screenshots), `debug_panel_check.cjs`,
  `endings_shot.cjs` (now expects `cannon` for the loss demos).

**What today's phone tests add, 2026-10-16 morning (read of `sound.js`,
`preload.js`, `candy-go-fish.js`; no code changed).**

- **Where the music is asked to play.** `CandySound.startWelcomeMusic()`
  is called from: the welcome `pointerdown` on the overlay (artwork);
  `CandyPreload.whenReady().then(...)` (no user gesture, iOS always
  rejects this one, and it may leave the element registered-but-paused in
  Now Playing); the Rules button; the New game button (Deal again?);
  `applyMusicSettings` when MUSIC is switched on. Nothing during play
  calls it. `fadeOutWelcomeMusic()` returns at once in continuous mode.
- **How a clip plays today.** `play(sound)` -> `prepareContext()`,
  `getClip()` (one `<audio>` per sound through `createMediaElementSource`
  into the channel gain), `rewind`, `clip.play()`; the promise rejection
  is swallowed. So a refused `play()` on the phone is silent in both
  senses. Ticks bypass all this (AudioBufferSourceNode from
  `prepareTickBuffer()`), which is why they are the one reliable sound.
- **Readiness.** `preload.js` `loadAudio` resolves on `canplaythrough`
  or a 6 s / 20 s timer and only records a failure when `readyState < 4`.
  iPhone Safari reports `canplaythrough` before the bytes are resident,
  so the panel's "0 failures" and a fast "Loading assets" do not mean
  the music is downloaded. On cellular the Wonderful tune (5.4 MB) was
  very likely not there when the artwork tap asked for it.
- **Option C, as it will be built** (see the plan file and the 10-16
  ToBeContinued for the step list): UI clips fetched with `fetch` and
  `decodeAudioData` into a Map of AudioBuffers at startup; `play()`
  returns `{ clip }` shaped like today's so `scheduleVictory` keeps
  working; victory speech decoded on demand and cached; music elements
  kept, started only inside taps, retried on every tap while wanted and
  paused; welcome gets a `click` listener next to `pointerdown`. Checks
  to rewrite: `verify-sound-layout.cjs`, `verify-victory-sounds.cjs`.
- **Fallback.** Git tag `before-iphone-speech-buffers` = 300675c, on
  GitHub (the repo's first tag). Restoring only the game:
  `git checkout before-iphone-speech-buffers -- games/candy-go-fish`.

**Option C as built, 2026-10-16 (Claude; stamp `2026-1016-sound-buffers`).**

- **`sound.js`, two kinds of sound.** UI clips and speech are decoded
  buffers; the three soundtracks stay media elements. `decode(sound)`
  fetches the MP3, decodes it (callback form of `decodeAudioData`, which
  older iOS also has; the context may stay suspended) and caches the
  AudioBuffer in `buffers`; an in-flight promise sits in `decodes`; a
  failure is forgotten so the next call retries. `playBuffer` makes an
  `AudioBufferSourceNode` with a per-play gain into the UI channel and
  returns a voice `{ sound, duration, gain, onended, source, stopped }`;
  `voices` holds the live ones; `stopVoice` marks `stopped` first so a
  stop never counts as an end (the game-over music must not be re-armed
  by a cancelled speech). `play(sound)` returns the voice, or undefined
  when the buffer is not there yet (and starts its decode). `stopAll('ui')`
  stops ticks and voices; `stopAll('music')` pauses a playing tune.
- **Startup vs on demand.** `prepareAssets()` decodes the twelve
  non-victory sounds and returns `[{ url, ready }]`; `preload.js`
  `loadBuffer` waits on `ready` with the six-second bound and records a
  failure (the decode keeps going past the bound). `prepareSpeech(sound)`
  decodes one victory speech; `scheduleVictory` calls it immediately, and
  the 2 s timer then waits on that promise, checks `victoryToken` (bumped
  by `cancelVictory`) and plays; `replayVictory` reuses the cached buffer.
  Memory: twelve short clips, under 10 MB of PCM; one victory speech more.
- **Music rules.** `startWelcomeMusic()` is no longer called from
  `whenReady().then(...)`. `retryMusic()` restarts the current tune when
  `welcomeMusicWanted` is true, the channel is on and `clip.paused`;
  `userTapped()` = `unlock()` + `retryMusic()`. `candy-go-fish.js` calls
  it from a `click` listener on `document` (bubbling, so it runs after the
  tapped element's own handler: closing a dialog in Paused mode sets
  wanted=false first, and the retry does nothing). The welcome artwork has
  a `click` listener beside `pointerdown` that calls `unlock()` and
  `startWelcomeMusic()`.
- **file://.** Chrome refuses `fetch()` over file://, so a page opened
  from disk records twelve preload failures and has no UI sounds or
  speech; music still plays. HTTP (the server, Pages) is the real case.
- **Checks.** `serve-game.cjs` (new) is a 30-line `node:http` static
  server on an ephemeral port; `verify-sound-layout` uses it, counts
  `AudioBufferSourceNode.start` calls under reduced motion (no ticks, so
  every start is a voice) and sees the goes-first speech start from the
  spinner's timer. `verify-victory-sounds` runs its assertions inside an
  async function with a `setImmediate` settle after each fired timer.
  `verify-welcome-music` taps the title in all three modes. All twelve
  non-stale checks pass; the four stale ones (item 10) were not run.
- **Fast start (same afternoon; stamp `2026-1016-fast-start`).**
  `preload.js` keeps two promises: `ready` (images + the twelve decodes;
  enables Let's play) and `musicReady` (`whenMusicReady()`, the chosen
  tune's `loadAudio` with the 20 s bound, failures still pushed).
  `prepareWelcomeMusic()` returns `[musicEntry(currentTrack).clip]` only;
  `CandyPreload.start(config)` moved from line 10 of `candy-go-fish.js`
  to just after `restoreSoundSettings()` so `currentTrack` is the saved
  one when the element is created (no top-level `await` sits between the
  two places, so nothing else changes). `selectTrack` now calls
  `musicEntry(track)` when the context exists, which creates the element
  with `preload = 'auto'` and so starts the download at the popup tap.
  Throwaway check: with the MP3 route delayed 4 s the button was enabled
  in 271 ms; only Earth was created with Earth saved; the arrow created
  Haunted. The cold blank popup before the welcome (scripts, CSS, fonts,
  `welcome-vines.svg` from a cold Pages edge) is not addressed.
- **Line endings, a trap.** This Git Bash's `sed -i` strips CR from CRLF
  files. Git (`core.autocrlf=true`) stores LF either way, so the commits
  were unaffected, but the working files were converted back by hand.
  Per-file endings differ (`sound.js`, `candy-go-fish.js`, both
  `index.html` and `app.js` are CRLF; `preload.js`, the checks and the
  docs are LF); edit scripts must detect the file's own ending.

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
