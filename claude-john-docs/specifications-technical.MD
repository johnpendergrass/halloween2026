# Halloween 2026 — Technical Specifications

Last updated: 2026-10-01 09:45 (fourth day: the `_TABLED GAMES` folder; Pie Maker and the two wrong test games tabled; game1..game8 all placeholders)

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
app/app.js                 reads games.json at start-up; picker buttons, This Game tab, drawer, loadGame/startGame/goHome. Never edited by designers
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
claude-john-docs/          these notes
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
  [...], fields: { field: "explanation", ... }, coming_later: [...] } }`.
  `_about` is the file's own documentation (JSON has no comments) and is
  deliberately LAST; the app ignores it.
- **Entry fields** (snake_case): `folder_name`, `goes_in_slot`, `title`,
  `short_title`, `icon`, `designer`, `credits`, `date`, `description`,
  `how_to_play`. Only `folder_name` is required in principle; the app
  copes with blanks (text fallbacks, hidden lines).
- **app.js section 5, `startUp()`** (async): `readGamesFile()` fetches
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
  (currently `2026-1001-tabled`; check app.js, this line has gone stale
  before). **An edit to games.json also needs
  the bump** before a push, or phones keep the old list for up to 10
  minutes; the local server never caches it. The game pages' own `<link>`/`<script>`
  tags carry no `?v=`: on GitHub Pages (10-minute cache) a phone may run a
  new game HTML with the old CSS/JS for up to 10 minutes after a publish.
  Accepted; friends would forget to bump a tag inside their game.
- No postMessage yet. Game pages must also run standalone.
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
  `clamp(16px, 5.4cqw, 28px)`; byline/credits/later at 0.7 opacity).

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

- Registry moved to `games.json` on 2026-09-29 (see 4a, 4f). The deferred
  fields `scoring`, `settings`, `sound`, `pausable` arrive with the message
  contract.
- Message contract via `postMessage` + a helper script games include; the
  helper must no-op when the game runs standalone (no parent).
- Also planned: `CLAUDE.md` + `AGENTS.md` at repo root pointing contributors'
  AIs at the mini-game spec; a template game to copy; a checker script
  (lowercase names, relative paths, size limits, no external URLs).
- Sound: iPhone plays nothing until a tap; the mute switch silences some web
  audio. Needs one shared rule.
