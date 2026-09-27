# Halloween 2026 — Specifications (design decisions)

Last updated: 2026-09-27 (first session)

This file records WHAT the app looks like and WHY. Technical "how" lives in
`specifications-technical.MD`. Companion notes in this folder:

- `triageRush-layout-reference.MD` — the 9:16 shell specs borrowed from
  triageRush, verified against its shipped code.
- `designing-for-the-frame.MD` — plain-language guide: why game authors can
  mostly ignore devices, and the seven things that still differ.

---

## 1. What the project is

A collection of Halloween mini games, played on phones first, but also on
tablets and PC browsers. Released on GitHub Pages at
`https://johnpendergrass.github.io/halloween2026/` (not yet enabled).

### The plan (John, 2026-09-27)

1. John + Claude build the framework: look, sizing, platforms, technical limits.
2. Build the HOME screen: background animations + menu of games.
3. Write a VERY specific mini-game spec that humans AND AI assistants can follow.
4. Friends write mini games using the scaffold + docs (with their own AIs).
5. Friends become GitHub collaborators; the group finishes the app together.
6. Release on GitHub Pages. Target: Halloween, 2026-10-31.

Because other people's AIs will follow these docs, rules must be precise,
checkable, and backed by a working example game.

---

## 2. The frame (decided)

- **One 9:16 portrait frame, identical on every device.** No separate desktop
  or tablet layout. On a PC/tablet it floats on a background like a phone on a
  desk. Borrowed from triageRush, where it worked well on phone, tablet and PC.
- Fits whichever limit is smaller (screen width or height); 5% of screen height
  kept above and below; clear of notch/home bar via safe-area insets.
- The page itself never scrolls.
- **Slightly rounded corners on every device**: `clamp(8px, 2.6cqw, 16px)`
  (~10px on a phone). Replaced triageRush's "round only on big screens".
- **Nothing is ever placed outside the frame** (John, 2026-09-27). Modern
  phones have spare space above/below a 9:16 frame, and it differs per
  device. Using it would mean designing per device — explicitly rejected.
  Colouring that space is allowed (decoration only).

## 3. The three panels (decided, mockup v6)

```text
┌─────────────────────┐
│ TOP PANEL           │  1/16 of frame height. Always visible. Never moves.
├─────────────────────┤  Game name, Home icon, ☰ (quick navigation).
│                     │
│    GAME PANEL       │  Everything between the bars -> exactly 9:14.
│                     │  The game's iframe will live here. Nothing covers
│                     │  it unless the player opens the bottom panel.
├─────────────────────┤
│ BOTTOM PANEL strip  │  1/16 of frame height, full width, gentle up arrow.
└─────────────────────┘
```

- **Top panel and closed bottom strip are the same height** (symmetric).
  Measured 42.44px each on a 390px-wide phone.
- **Game panel = exactly 9:14.** Sizes: smallest phone 367 × 571, iPhone Pro
  Max 432 × 672, 1080p PC 547 × 850. Full-sharpness art ≈ 1296 × 2016.
  (Was 3:5 while the bottom panel was a pull tab poking into the game area;
  John rejected the tab so game designers never work around it.)
- **Bottom panel = a drawer.** Closed: just the strip, in its own space.
  Open: slides UP over the lower 55% of the game panel. **The game panel
  never changes size** — same as Halloween2025's right panel, which (checked
  in its code) slid OVER the fixed 950 × 720 game area rather than resizing it.
- The bottom panel has two tabs:
  - **App** — game selection, overall high scores, sound, about/credits.
  - **This Game** — that game's high scores, settings, how to play.
- Rounded corners: top panel's two TOP corners and bottom panel's two BOTTOM
  corners follow the frame. The game panel's edges stay square and crisp.

## 4. The flow (mockup v3+)

- App starts on **game0**, the default screen ("This is the default game
  screen"), with the bottom panel **open** showing the game buttons.
- Tap a game → game panel shows it, bottom panel **closes**, top panel title
  changes to the game's name.
- **Quit Game** (inside the game) or **🏠** (top panel) → back to game0, bottom
  panel **opens** again.
- ☰ or the strip opens/closes the bottom panel by hand.

## 5. Colours (placeholders for judging layers — not final)

Every layer has its own colour AND a visible edge:

| Layer | Colour | Edge |
|---|---|---|
| Stage (outside the frame) | purple `#2e1a44` (v6 TRIAL, was `#07040a`) | — |
| Frame | — | 2px pumpkin `#e8741c` outline |
| Top panel | purple `#2e1a44` | 2px `#9b7cc4` below |
| Game panel | off-white `#f5f1e8`/`#eae2d2` + faint grid | — |
| Bottom panel | swamp green `#173229` | 2px `#5fbf8f` above |
| Buttons | pumpkin `#e8741c`, shadow `#b85510` | — |

**v6 TRIAL (pending John's verdict):** stage matches the top panel purple, and
the iPhone status bar is `black-translucent` so the purple shows behind the
clock. John may "nix it" → back to `#07040a` and `black`.

## 6. How games plug in (leaning, NOT final)

- **Recommended: each game is its own mini website in an iframe** that fills
  the game panel. Reasons: total isolation (one friend's CSS/JS cannot break
  another's), simplest rule for friends ("make a page that works in a 9:14
  box"), each game testable alone. Halloween2025 proved it: its two iframe
  games dropped in with no changes.
- Games talk to the app with small messages (`postMessage`): score, game over,
  ready, their settings list → app; settings changed, pause/resume, sound
  on/off → game. A helper file will hide the plumbing
  (`Halloween.reportScore(120)` etc.).
- **Games cannot draw in the bottom panel.** They send data; the app draws
  scores and settings controls. Keeps every game's panel consistent.
- The app owns: the frame, Home button, sound setting, high scores, loading.

## 7. Lessons from Halloween2025 (`D:\dev\projects\halloween2025`)

Desktop-only 1280 × 720, a host (`js/main.js`) with games exposing
`render/start/stop/getScore`.
- Keep: iframe wrapper for standalone games; `games/<id>/` folder convention;
  placeholder when a game fails to load; one switch function (stop old →
  render → start new).
- Fix: adding a game meant editing 3 places (→ one list); built-in games shared
  global CSS names and document listeners (→ iframes); iframe games could not
  report scores (→ message contract); unprefixed localStorage keys (→ prefix
  with game id).
