# Halloween 2026 — Technical Specifications

Last updated: 2026-09-29 17:51 (second day, sixth stretch: games.json v2, icons, picker, This Game)

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
games/pie-maker/           Pie Maker (was game1): index.html, pie-maker.css/.js, assets/pumpkin.svg, pie.svg (also its icon)
games/game2/               TEST GAME, deliberately wrong: fixed 1280 x 720 desktop stage in px
games/game3/               TEST GAME, deliberately wrong: fixed px for a 390-wide phone, small text, scrolls
games/game4/               placeholder page
games/README - game design requirements.md   THE RULES (one copy; each game README links to it)
games/*/README - <NAME>.md                   how each game was made + "Where this game breaks the requirements"
start-local/start-halloween.bat   double-click launcher, port 8091, prints LAN URL for iPhone
start-local/no-cache-server.py    dev server: code no-store, anything under /assets/ no-cache
claude-john-docs/          these notes
.gitignore                 anything in github-excluded/ never goes to GitHub
```

The three-panel design now lives in the real `index.html`/`app/` (the first
single-column scaffold was replaced on 2026-09-27; the `mockups/` folder is
superseded and is to be deleted by John: see the delete command in the
2026-0927-1824 ToBeContinued).

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
  keeps entries whose slot is an integer 1..`LAST_SLOT` (4), first entry
  wins a duplicate slot (`console.warn`), anything else is skipped with a
  `console.info`; result sorted by slot. Then `makeGameButtons()` and
  `goHome()`. Any failure → `showStartupError()` writes a plain message
  into `#gameButtons` ("Could not read the list of games (...). Open the
  app through start-local/start-halloween.bat or a web server, not by
  double-clicking index.html.") and logs to the console. **`fetch()` does
  not work over `file://`**, which is why that message exists; tested.
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
  (currently `2026-0929-pressed`). **An edit to games.json also needs
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

## 4c. Pie Maker (folder `pie-maker`, was game1) implementation notes

- All positions/sizes/speeds in "field widths"; pixels computed every frame
  from `field.clientWidth`, so it survives resizes.
- `requestAnimationFrame` loop, time step capped at 0.1 s.
- Wrap-around: a pumpkin jumps to the opposite edge only once fully off.
- `pointerdown` per pumpkin image (instant on touch). Pies get
  `z-index: 1`, pumpkins `2`, so pies never block taps.
- Settings constants at the top of game1.js (count 10, size 0.13–0.24,
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
  animationend. Settings at top of game0.js (`RISE_TIME`, `WAIT_AT_TOP`,
  `WAIT_HIDDEN`, `FIRST_WAIT`, `LEFT_MOST`/`RIGHT_MOST` = 14–40%).
- `CHARACTERS` holds short names (`"totoro"`); `imageFor(name)` builds the
  file name `silhouette_<name>_transparent_250h.png`. All 19 are preloaded
  with `new Image().src` at start-up.
- `assets/pumpkin_patch_950x714_justBelowPumpkins.png` (front popup layer,
  dropped) is unused; John is to delete it (Claude can't delete files).
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
- **`makeGameButtons()`**: home button first with class `is-home`, then
  `games` in slot order, all into `#gameButtons`.
- **CSS**: `.game-buttons { display:grid; grid-template-columns: repeat(2,
  var(--game-button-size)); justify-content:center; gap:3cqw;
  --game-button-size:18cqw }`; `.is-home { grid-column: 1 / -1;
  justify-self:center }`; `.game-button` is a square `18cqw`, `padding:2cqw`,
  `place-items:center`, orange with the `1.2cqw` dark drop shadow; `img
  { width/height:100%; object-fit:contain; pointer-events:none }`.
  Measured: tab body 282 px, grid 229 px on 390×844; 244 / 203 on 375×667.
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

## 4e. The two wrong test games (game2, game3)

Plain pages with no page-setup block, so the iframe's default scrolling
shows. game2: `#stage { width: 1280px; height: 720px }`, `click`
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
