# Halloween 2026 — Technical Specifications

Last updated: 2026-09-29 15:40 (second day, fifth stretch: games.json)

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
games.json                 THE LIST OF GAMES: "_about" block + "games" array of { slot, title, author, description }
manifest.json              Android/desktop full-screen ("standalone", portrait); icons: [] (TODO)
app/styles.css             app CSS (frame, panels, drawer) - moved from the mockup
app/app.js                 reads games.json at start-up; drawer, tabs, loadGame/startGame/goHome. Never edited by designers
games/game0/               the home game: pumpkin patch + rising silhouettes (2025 art in assets/)
games/game1/               Pie Maker: index.html, game1.css, game1.js, assets/pumpkin.svg, pie.svg
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

## 4a. Games in iframes, and games.json (2026-09-29)

- **`games.json`** (root, beside index.html) = **the one place to add a
  game**. Shape: `{ "_about": [...strings...], "games": [ { slot, title,
  author, description }, ... ] }`. `_about` is the file's own
  documentation (JSON has no comments); the app ignores it. `slot` = the
  folder name under `games/`.
- **app.js section 5, `startUp()`** (async): `readGamesFile()` fetches
  `./games.json?v=APP_VERSION` (same cache-busting as the scripts), checks
  `response.ok` and that `data.games` is an array, then `homeGame` = the
  entry whose slot is `HOME_SLOT` (`"game0"`), `games` = every other
  entry in file order. Then `makeGameButtons()` and `goHome()`. Any
  failure → `showStartupError()` writes a plain message into
  `#gameButtons` ("Could not read the list of games (...). Open the app
  through start-local/start-halloween.bat or a web server, not by
  double-clicking index.html.") and logs to the console. **`fetch()` does
  not work over `file://`**, which is why that message exists; tested.
- app.js contains no game names. Nothing in `app/` changes when a game is
  added, renamed or removed; verified by `git status` after the two test
  games were written (only `games/game2/`, `games/game3/` and games.json
  changed).
- `loadGame()` sets `gameFrame.src = "./games/<slot>/index.html?v=" + APP_VERSION`.
  Changing `src` throws the old game away completely (no stop() needed).
- `APP_VERSION` in app.js must match the `?v=` tags in index.html
  (currently `2026-0929-gamesjson`). **An edit to games.json also needs
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

## 4c. Pie Maker implementation notes

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

## 4d. game0 (Home) implementation notes

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

## 4e. The two wrong test games (game2, game3)

Plain pages with no page-setup block, so the iframe's default scrolling
shows. game2: `#stage { width: 1280px; height: 720px }`, `click`
handlers, a `:hover` colour. game3: `.page { width: 390px }`, an 8-column
grid of 40 px `.square`s (12 random ghosts via a `Set` of indices), 16 px
body text. Each README lists the rule numbers it breaks. Verified with
chrome-devtools at 390×844×3 mobile and 1920×1080: panel 547 × 851 on the
PC; game3 sits in the top-left with a blank strip on the right.

## 4f. games.json v2: how it would be implemented (not done)

Design in `specifications.MD` 6e. Code plan:
- app.js: `HOME_SLOT` goes away; `homeGame = entries.find(e => e.role === "home")`,
  `games = entries.filter(e => e.role !== "home" && e.status !== "hidden")`.
  `loadGame()` uses `entry.folder`. Top bar shows `entry.shortTitle ||
  entry.title` and an `<img>` at `./games/<folder>/<icon>`, with an
  `onerror`/missing-field fallback to a default pumpkin SVG in `app/`.
- index.html / styles.css: an icon `<img>` before `#topTitle`; buttons
  become icon + label (flex row). Icon sizes in cqw so they scale with
  the frame (about 60 canvas px in the bar, 120 on a button).
- Each game: `assets/icon.svg` (or a 256 px square PNG).
- Validation stays minimal: a missing optional field falls back; a
  missing `folder` or no home entry → `showStartupError()`.

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
