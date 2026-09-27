# Halloween 2026 — Technical Specifications

Last updated: 2026-09-27 14:43 (first day, second stretch)

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
manifest.json              Android/desktop full-screen ("standalone", portrait); icons: [] (TODO)
app/styles.css             app CSS (frame, panels, drawer) - moved from the mockup
app/app.js                 GAMES list, drawer, tabs, loadGame/startGame/goHome
games/game0/               the home game (placeholder page for now)
games/game1/               Pie Maker: index.html, game1.css, game1.js, assets/pumpkin.svg, pie.svg
games/game2..4/            placeholder pages
games/*/README - <NAME>.md                   how each game was made
games/*/README - game design requirements.md identical copies; game0's is the master
mockups/layout-mockup.html superseded mockup (kept for reference)
start-local/start-halloween.bat   double-click launcher, port 8091, prints LAN URL for iPhone
start-local/no-cache-server.py    dev server: code no-store, anything under /assets/ no-cache
claude-john-docs/          these notes
.gitignore                 anything in github-excluded/ never goes to GitHub
```

The three-panel design now lives in the real `index.html`/`app/` (the first
single-column scaffold was replaced on 2026-09-27).

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

## 4a. Games in iframes

- `GAMES` array at the top of `app/app.js` = **the one place to add a game**
  (`{ id, title }`; id = folder name). `HOME_GAME = { id: "game0", ... }`
  has no button. The App tab's buttons are generated from `GAMES`.
- `loadGame()` sets `gameFrame.src = "./games/<id>/index.html?v=" + APP_VERSION`.
  Changing `src` throws the old game away completely (no stop() needed).
- `APP_VERSION` in app.js must match the `?v=` tags in index.html
  (currently `2026-0927-panels1`).
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
  URL for the phone (same Wi-Fi; allow Python on Private networks).
- Mockup: `/mockups/layout-mockup.html`.
- Claude tests with chrome-devtools emulation (375×812 and 390×844 @3x, touch;
  1920×1080) and stops its own server afterwards so the .bat can use 8091.

## 7. Future implementation notes

- Registry is currently the `GAMES` array in app.js; may move to its own
  file (id, title, author, icon) when friends start adding games.
- Message contract via `postMessage` + a helper script games include; the
  helper must no-op when the game runs standalone (no parent).
- Also planned: `CLAUDE.md` + `AGENTS.md` at repo root pointing contributors'
  AIs at the mini-game spec; a template game to copy; a checker script
  (lowercase names, relative paths, size limits, no external URLs).
- Sound: iPhone plays nothing until a tap; the mute switch silences some web
  audio. Needs one shared rule.
