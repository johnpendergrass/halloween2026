# Pie Maker (game1)

Tap the drifting pumpkins to turn them into pumpkin pies. Make all ten as
fast as you can. *Asteroids, but with pumpkins, and no gun.*

- **Idea:** John. **Code and art:** Claude Code, 2026-09-27.
- **Status:** a **demo game**. It exists to show the rules in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md)
  in practice, and to judge the game panel's size and how tapping feels. It
  is not part of the finished app and may change.

## How to play

- Ten pumpkins drift across the field in straight lines, spinning slowly.
  One that drifts off an edge comes back on the opposite edge.
- Tap a pumpkin and it pops into a pie, which stays where it was.
- The timer starts when the game loads and stops at the last pie.
- **Play again** starts a fresh round.

## Files

```text
index.html          info bar, playing field, "All pies made!" message
game1.css           page setup and text classes (copied from the requirements), then Pie Maker's own styles
game1.js            settings, pumpkins, animation, tapping, start/finish
assets/pumpkin.svg  pumpkin (100 × 100 viewBox)
assets/pie.svg      pumpkin pie seen from above (100 × 100 viewBox)
README - PIE MAKER.md  this file
```

Plain HTML/CSS/JavaScript. No libraries, no build step, no sound.

## How it fits in the app

- The app shows this page in an `<iframe>` that fills the game panel. It also
  runs on its own: open `games/game1/index.html` directly.
- **It does not talk to the app yet.** The time is not reported, and opening
  the app's bottom panel does not pause the game. Both wait for the
  messaging step.

## Where this game breaks the requirements, and why

**Nowhere.** Pie Maker follows every rule in version 3 of the requirements.
Two choices worth knowing about:

- The smallest pumpkin is exactly the smallest allowed tap target (13vw,
  168 canvas px), and it moves. John tested it on an iPhone 16 Pro and found
  it fine to hit.
- Pumpkins are SVG, so the artwork-size rules (1.6) don't apply: SVG is
  sharp at any size.

## Settings (top of `game1.js`)

| Setting | Value | Meaning |
|---|---|---|
| `PUMPKIN_COUNT` | 10 | pumpkins per round |
| `SMALLEST_SIZE` | 0.13 | smallest pumpkin, as a share of the field's width (= 13vw) |
| `BIGGEST_SIZE` | 0.24 | biggest pumpkin (= 24vw) |
| `SLOWEST_SPEED` | 0.08 | field widths per second, for the biggest pumpkins |
| `FASTEST_SPEED` | 0.22 | field widths per second, for the smallest pumpkins |
| `MOST_SPIN` | 60 | degrees per second, either direction |

Fixed for now. Later, the app's "This Game" tab may let players change them.

## How it works (`game1.js`)

Everything is measured in **field widths** (`x = 0.5` is halfway across,
`size = 0.2` is 20% of the width) and converted to pixels every frame from
the field's current width, so the game survives a resize.

1. **Start:** make 10 pumpkins with a random size, place, direction and
   spin. Smaller pumpkins are faster. Start the clock.
2. **Every frame** (`requestAnimationFrame`): move each pumpkin by speed ×
   time since the last frame, wrap it around the edges, draw it. Time steps
   are capped at 0.1 s so a pause never makes pumpkins jump.
3. **Tap:** each pumpkin listens for `pointerdown` (not `click`) so a tap on
   a moving target counts the instant the finger lands. The picture becomes
   the pie, it stops moving, and it plays a short "pop".
4. **Finish:** at 10 pies, stop the clock and show the time and
   **Play again**.

Pies sit underneath the pumpkins (`z-index`), so a finished pie never blocks
a tap on a pumpkin. When pumpkins overlap, the top one gets the tap.

## Colours (Pie Maker's own, not the app's)

| Use | Colour |
|---|---|
| Page background | `#fde7cf` (pale peach) |
| Info bar | `#f8d3ab`, edge `#e8b27a` |
| Text | `#2a2230` |
| "All pies made!" cover | peach at 85% opacity |
| Button | the app's pumpkin `#e8741c`, shadow `#b85510` |
| Pumpkin art | ribs `#d2601a` / `#f07f22`, highlight `#f7a04a`, stem `#4f7a28` |
| Pie art | crust `#b8793a` / `#e3ad68`, filling `#c0601c` / `#d4722a`, cream `#fffaf0` |
