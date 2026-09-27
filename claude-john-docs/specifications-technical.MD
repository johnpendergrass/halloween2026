# Halloween 2026 — Technical Specifications

Last updated: 2026-09-27 (first session)

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
index.html                 scaffold app: 9:16 shell, home menu, 4 placeholder games
manifest.json              Android/desktop full-screen ("standalone", portrait); icons: [] (TODO)
app/styles.css             scaffold CSS (shell copied from triageRush)
app/app.js                 scaffold view switching via data-show="NAME" -> #view-NAME
mockups/layout-mockup.html THE CURRENT DESIGN: three-panel layout + flow (self-contained)
start-local/start-halloween.bat   double-click launcher, port 8091, prints LAN URL for iPhone
start-local/no-cache-server.py    dev server: code no-store, anything under /assets/ no-cache
claude-john-docs/          these notes
.gitignore                 anything in github-excluded/ never goes to GitHub
```

**Note:** `index.html`/`app/` is still the FIRST scaffold (single-column menu).
The three-panel design exists only in `mockups/layout-mockup.html` so far.

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

## 4. Three-panel layout (mockups/layout-mockup.html)

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
- JS is small named functions: `openDrawer`, `closeDrawer`, `toggleDrawer`,
  `startGame(n)`, `quitGame()`, `showSize()` (live size readout on game0).

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

- Games → `games/<id>/index.html` shown in an `<iframe>` inside `.game-panel`.
  Inside an iframe, `100vw`/`100vh` = the game panel, so a game can size
  itself with ordinary viewport units.
- One registry file (e.g. `games/games-list.js/.json`: id, title, author,
  icon) → the App tab's buttons are generated from it.
- Message contract via `postMessage` + a helper script games include; the
  helper must no-op when the game runs standalone (no parent).
- Also planned: `CLAUDE.md` + `AGENTS.md` at repo root pointing contributors'
  AIs at the mini-game spec; a template game to copy; a checker script
  (lowercase names, relative paths, size limits, no external URLs).
- Sound: iPhone plays nothing until a tap; the mute switch silences some web
  audio. Needs one shared rule.
