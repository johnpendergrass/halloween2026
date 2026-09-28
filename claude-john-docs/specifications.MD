# Halloween 2026 — Specifications (design decisions)

Last updated: 2026-09-27 17:33 (first day, fourth stretch: audit)

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

### What the app is right now (John, 2026-09-27, after the audit)

**A template for others to insert mini games into.** The frame and the docs
are the product. game0 (pumpkin patch) and game1 (Pie Maker) are **demos**:
not part of the final package, they may change or go. Consequences:

- **The requirements doc is the source of truth; the demos follow it**, not
  the other way round. Where a demo departs from a rule, its own README
  says so in a section "Where this game breaks the requirements, and why",
  so nobody mistakes the exception for the rule.
- **Code is written for an intermediate JavaScript front-end programmer**
  (the friends who will copy it), not for John. Comments explain *why* a
  game does something, not what standard JavaScript or CSS does.

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
- **Game panel = exactly 9:14.** Measured sizes: iPhone SE (smallest phone)
  338 × 526, iPhone Pro Max 432 × 672, 1080p PC about 547 × 850. Full-
  sharpness art = 1296 × 2016 (the Pro Max panel at ×3 = the design canvas).
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

## 4. The flow (real app, 2026-09-27)

- App starts on **game0**, with the bottom panel **open** showing the game
  buttons. **game0 is a real game** (its own folder, html/css/js/assets),
  special only because it is the default: shown at start and whenever no
  other game is active. It will become the HOME screen with animations.
- Tap a game → its page loads in the game panel, bottom panel **closes**,
  top panel title changes to the game's name.
- **🏠** (top panel) → back to game0, bottom panel **opens** again.
  (The mockup's in-game "Quit Game" button was dropped: it needs a message
  from game to app, and messaging is postponed.)
- ☰ or the strip opens/closes the bottom panel by hand.

## 5. Colours (placeholders for judging layers — not final)

Every layer has its own colour AND a visible edge:

| Layer | Colour | Edge |
|---|---|---|
| Stage (outside the frame) | purple `#2e1a44` (v6 TRIAL, was `#07040a`) | — |
| Frame | — | 2px pumpkin `#e8741c` outline |
| Top panel | purple `#2e1a44` | 2px `#9b7cc4` below |
| Game panel | parchment `#eae2d2` (seen only while a game page loads) | — |
| Bottom panel | swamp green `#173229` | 2px `#5fbf8f` above |
| Buttons | pumpkin `#e8741c`, shadow `#b85510` | — |

**v6 TRIAL (pending John's verdict):** stage matches the top panel purple, and
the iPhone status bar is `black-translucent` so the purple shows behind the
clock. John may "nix it" → back to `#07040a` and `black`.

## 6. How games plug in (DECIDED: iframes; messaging still to design)

- **Each game is its own mini website in an iframe** that fills
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
- Folders: `games/game0` … `games/game4` (John: each with its own js, css,
  html, assets). Each has a `README - <GAME NAME>.md` describing how it was
  made (John's naming). The rules live in **one** file,
  `games/README - game design requirements.md` (was five identical copies
  until the 2026-09-27 audit; copies drift, one file can't).
- Messaging (score, pause, settings) is **deliberately postponed** until the
  test games exist to try it on.

## 6a. Game design requirements (for game authors) — v3

Full text: `games/README - game design requirements.md` (the only copy).
Key decisions (John):

- **One design canvas: 1296 × 2016 real pixels** = the iPhone 16 Pro Max
  game panel at ×3. Designers draw, measure and export in canvas pixels
  only; CSS pixels appear only in the coder part. (John had been burned
  cropping art to CSS sizes → 3× too small on iPhone.)
- **The whole panel belongs to the game.** The app's edge lines (top
  lavender, bottom mint, side pumpkin outline, 2 CSS px = 6 canvas px) sit
  outside it. A game that wants a border draws it inside its own space.
- Tap target minimum **168 canvas px (13vw)** = 44 CSS px on iPhone SE,
  **still or moving** (v3: the separate 20vw "should" for moving targets was
  dropped; John tested 13vw moving pumpkins on an iPhone 16 Pro and found
  them fine). Gaps 26 (2vw). Keep important taps out of the bottom 65 (5vw).
  Grids: at most 7 tappable columns.
- **Text: three sizes** Small 47 / Medium 58 / Large 117 canvas px
  (3.6 / 4.5 / 9vw, with px floors). v3: the MUST is the *size* (nothing
  below Small); the `.text-*` classes are a SHOULD, since a class name
  cannot be enforced, only a size can (and a checker can read it). Arial
  for now; normal or bold; italics ok; no underline; strikethrough only with
  meaning; line spacing 1.35.
- **`px` floors only, no ceilings** (v3): `max(14px, 4.5vw)` yes,
  `clamp(…, 28px)` no. The panel is never wider than ~730 CSS px, so a cap
  does nothing useful and hides the real size.
- Sprites PNG (transparent) or SVG; backgrounds JPG at 1296 × 2016.
- Colour table (1.7) lists only colours the app itself uses (v3).
- Structure: Part 1 designers (canvas pixels only, never CSS px), Part 2
  coders + AI (18 MUST/SHOULD rules), appendix per-device sizes.
  Information stated once (John: repetition was confusing).

## 6b. Demo game: Pie Maker (game1)

John's design: "asteroids but for pumpkins and without a gun, just tapping."
10 pumpkins of varying size drift in straight lines, spin, and wrap around
the edges; tap → pumpkin pie (stays put); timer from load to last pie;
Play again. Sizes 13%–24% of width (was 12%; changed so the smallest is
44px on iPhone SE). Timer not reported to the app yet (later comms test),
and the number of pumpkins will later be a setting.

After the audit (2026-09-27) it follows the requirements exactly: the 2.2
page-setup block copied verbatim, the `.text-*` classes for all text, no px
ceilings, button `min-height: 13vw`. Its README lists no exceptions. Its
README no longer repeats the device tables from the requirements doc.

## 6c. Demo home game: pumpkin patch (game0)

Reused from the Halloween 2025 title screen (John, 2026-09-27): a painted
pumpkin patch under a full moon; a character silhouette (19 of them:
Batman, Totoro, Toy Story, etc.) slowly rises from behind the tree line,
waits, sinks. Decisions:
- **Art fit = "option 1"**: the 950 × 714 paintings are scaled so their
  HEIGHT fills the game panel, sides cropped (`--crop-from-left: 0.25`
  keeps the moon + big pumpkins). Looks soft (enlarged ~2.5× on a ×3
  phone); accepted as a first try. Later options: painting in the lower
  part with dark sky above, or new tall art at 1296 × 2016.
- **Only the horizon popup.** A second popup behind the front pumpkins was
  tried and dropped: the open bottom panel on the home screen covers that
  area, so it was almost always hidden (likely why 2025 dropped it too).
- **Timing**: rise 2–4 s, wait at top 1–4 s, sink 1 s faster than the rise,
  hidden **4–12 s (middle 8 s; John asked for ~20% faster than 2025's
  5–15 s)**. Characters dealt from a shuffled deck (no repeats until all
  have shown); mirrored on the right half so they face inward.
- Known: the open bottom panel hides the lower 55% of the scene on the
  home screen; some silhouettes have a light halo (2025 files).
- **Declared exceptions** (in its README): uses `vh` and `%` of the
  painting instead of `vw` (must fill the panel's height; keeps the
  character aligned with the layers); art is 950 × 714, not 1296 × 2016
  (reused). All 19 silhouettes are preloaded at start so none pops in late
  on a slow connection.

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
