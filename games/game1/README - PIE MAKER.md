# Pie Maker (game1)

Tap the drifting pumpkins to turn them into pumpkin pies. Make all ten pies
as fast as you can.

*Like Asteroids, but with pumpkins, and no gun: just tapping.*

- **Idea:** John. **Code and art:** Claude Code, 2026-09-27.
- **Status:** first test game, used to judge the game panel's size and how
  tapping feels. It may survive as a demo game for others to copy.

---

## How to play

- Ten pumpkins drift across the field in straight lines, spinning slowly.
  One that drifts off an edge comes back on the opposite edge.
- Tap a pumpkin and it pops into a pie, which stays where it was.
- The timer starts when the game loads and stops at the last pie.
- **Play again** starts a fresh round.

## Files

```text
index.html         the page: info bar, playing field, "All pies made!" message
game1.css          all styles (only affect this game)
game1.js           all code: settings, pumpkins, animation, tapping, start/finish
assets/pumpkin.svg pumpkin drawing (100 x 100 viewBox)
assets/pie.svg     pumpkin pie seen from above (100 x 100 viewBox)
README - PIE MAKER.md  this file
```

Plain HTML/CSS/JavaScript. No libraries, no build step, no sound.

## How it fits in the app

- The app shows this page in an `<iframe>` that fills the **game panel**
  (9:14, e.g. 382 × 594 px on a 390px-wide phone).
- It also works on its own. Open `games/game1/index.html` directly, e.g.
  `http://localhost:8091/games/game1/index.html`.
- **It does not talk to the app yet.** The time is not reported, and
  opening the app's bottom panel does not pause the game. Both are planned
  as a later communications test.

## Layout and sizes

**Units: everything in the game is measured in "field widths".**
Position `x = 0.5` means halfway across; `size = 0.2` means 20% of the field's
width. The code turns these into pixels on every frame, so the game keeps
its look at any size, even if the panel's shape changes later.

| Part | How it is sized |
|---|---|
| Whole page | the game panel (inside the iframe, `100vw` × `100vh` = the panel) |
| Info bar (top) | padding `3vw 5vw`, text `clamp(14px, 5vw, 28px)`, 2px bottom edge |
| Playing field | everything below the info bar |
| Pumpkins | 13% to 24% of the field's width |
| "Play again" button | at least 44px tall; text `clamp(16px, 5.5vw, 30px)` |

### Real sizes on an iPhone (measured 2026-09-27)

Two kinds of pixel:

- **CSS pixels** are what the code uses (`px` in CSS, `innerWidth` in JS).
- **Screen pixels** are the phone's real dots. Modern iPhones have
  **3 screen pixels per CSS pixel** (the iPhone SE has 2). **Artwork must be
  made in screen pixels** to look sharp.

**Reference phone: iPhone 15 / 16** (390 × 844 CSS px screen, ×3).
Measured in the app, as a home-screen app:

| Part | CSS pixels | Screen pixels (×3) |
|---|---|---|
| The whole 9:16 frame | 382 × 679 | 1146 × 2037 |
| App's top panel | 382 × 42 | 1146 × 127 |
| **Game panel (this whole page)** | **382 × 594** | **1146 × 1783** |
| Info bar | 382 × 47 | 1146 × 141 |
| **Playing field** | **382 × 547** | **1146 × 1641** |
| Info bar text | 19 px tall | 57 |
| "Play again" button | 165 × 51 | 495 × 154 |
| Small pumpkin (13%) | 50 × 50 | 149 × 149 |
| Medium pumpkin (18%) | 69 × 69 | 206 × 206 |
| Large pumpkin (24%) | 92 × 92 | 275 × 275 |

**Other devices** (game panel, and the pumpkins on it, in CSS pixels; screen
pixels in brackets):

| Device | Game panel | Small / medium / large pumpkin |
|---|---|---|
| iPhone SE (375 × 667, ×2) | 338 × 526 | 44 / 61 / 81  (88 / 122 / 162) |
| iPhone 15 / 16 (390 × 844, ×3) | 382 × 594 | 50 / 69 / 92  (149 / 206 / 275) |
| iPhone 16 Pro Max (440 × 956, ×3) | 432 × 672 | 56 / 78 / 104  (168 / 233 / 311) |
| 1080p PC monitor (×1) | 547 × 850 | 71 / 98 / 131  (71 / 98 / 131) |

- These are the sizes when the app is launched from its home-screen icon.
  In the Safari browser, the toolbars take some height, so everything is a
  little smaller.
- The smallest pumpkin (13%) is 44 CSS px on the iPhone SE, the
  comfortable finger size. It was 12% (41px on the SE) until 2026-09-27.

### Making artwork (PNG etc.) for a game like this

The rule: **make art at the biggest size it will ever appear, in screen
pixels.** That is the iPhone Pro Max (×3). It will be scaled down
everywhere else and still look sharp.

| Art | Biggest on screen | Make it at least |
|---|---|---|
| Small sprite (13% of width) | 168 × 168 | **170 × 170** |
| Medium sprite (18%) | 233 × 233 | **240 × 240** |
| Large sprite (24%) | 311 × 311 | **320 × 320** |
| Background for the playing field | 1296 × 1858 | **1296 × 1860** |
| Background for the whole game panel | 1296 × 2016 | **1296 × 2016** |

- A sprite of any size: **width share × 432 × 3**. For example, a sprite
  30% of the width → 0.30 × 432 × 3 ≈ 389 → make it 400 × 400.
- Use PNG with a transparent background for sprites.
- Pie Maker uses **SVG** drawings instead. SVG is sharp at every size, so
  none of this applies to it, but it only suits simple, flat art.

## Colours

| Use | Colour |
|---|---|
| Page background | `#fde7cf` (pale peach) |
| Info bar | `#f8d3ab`, edge `#e8b27a` |
| Text | `#2a2230` |
| "All pies made!" cover | peach at 85% opacity |
| Button | pumpkin `#e8741c`, shadow `#b85510` |
| Pumpkin art | ribs `#d2601a` / `#f07f22`, highlight `#f7a04a`, stem `#4f7a28` |
| Pie art | crust `#b8793a` / `#e3ad68`, filling `#c0601c` / `#d4722a`, cream `#fffaf0` |

## Settings (top of `game1.js`)

| Setting | Value | Meaning |
|---|---|---|
| `PUMPKIN_COUNT` | 10 | pumpkins per round |
| `SMALLEST_SIZE` | 0.13 | smallest pumpkin, share of field width (44px on an iPhone SE, the comfortable finger size) |
| `BIGGEST_SIZE` | 0.24 | biggest pumpkin |
| `SLOWEST_SPEED` | 0.08 | field widths per second (given to the biggest pumpkins) |
| `FASTEST_SPEED` | 0.22 | field widths per second (given to the smallest pumpkins) |
| `MOST_SPIN` | 60 | degrees per second, either direction |

Fixed for now. Later, the app's "This Game" tab may let players change them.

## How it works (in `game1.js`)

1. **Start:** make 10 pumpkins. Each gets a random size, place, direction
   and spin. Smaller pumpkins are faster. Start the clock.
2. **Every frame** (`requestAnimationFrame`, about 60 times a second): move
   each pumpkin by speed × time since the last frame, wrap it around the
   edges, and draw it. Time steps are capped at 0.1 s, so a pause never makes
   pumpkins jump.
3. **Tap:** each pumpkin image listens for `pointerdown`, not `click`, so a
   tap counts the instant the finger lands. That matters for moving targets.
   The pumpkin's picture becomes the pie, it stops moving, and it plays a
   short "pop" animation.
4. **Finish:** at 10 pies, stop the clock and show the time and
   **Play again**.

## Touch handling

- `touch-action: none` on the page: dragging never scrolls or zooms.
- No text selection and no iPhone "save image" pop-up (`user-select`,
  `-webkit-touch-callout`, `draggable = false`).
- Pies sit underneath the pumpkins (`z-index`), so a finished pie never
  blocks a tap on a pumpkin. When pumpkins overlap, the top one gets the tap.
- `prefers-reduced-motion` turns off the pop animation.
