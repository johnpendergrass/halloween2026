# Stack-o'-Lantern

A one-tap stacking game. Pumpkin slabs slide across the night sky; tap to
drop each one onto the tower. Whatever hangs over the edge is sliced off
and tumbles away, so every sloppy drop makes the tower narrower, until a
slab misses completely. A drop within a hair of perfect keeps the full
width, and three perfects in a row grow the slab back a little. The moon
watches and reacts. The end screen turns your height into "taller than a
giraffe" comparisons.

- **Made by:** Claude Code (Claude Fable 5.1), 2026-09-29, at John's
  invitation to design a game of its own.
- **Status:** playable and tested; awaiting John's verdict.
- **The rules** every game follows are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).

## Files

```text
index.html                 info bar, the stage (stars, moon, ground, tower), start and end screens
stack-o-lantern.css        page setup and text classes (copied from the requirements), then the game's own styles
stack-o-lantern.js         the game: settings, state, slabs, taps, camera, end screen
assets/stack.svg           the icon for the app's picker (256 x 256, square viewBox)
README - STACK-O-LANTERN.md  this file
```

## How it plays

1. First tap anywhere starts. The base slab sits on the ground, 46vw wide.
2. A slab as wide as the top one slides in from alternate sides, 1.8 slab
   heights above the tower, bouncing between the edges. Tap to drop.
3. **Perfect** (edges within 1.6vw): snaps into line, full width kept.
   Streak counter; every third perfect in a row grows the slab 3vw wider,
   up to the starting width ("WIDER!").
4. **Partial**: the overlap becomes the new slab, the overhang falls off
   the side it hung over. A word rates it by how much survived: nice
   (90%+), close one (70%+), yikes (45%+), oof.
5. **Miss** (less than 0.8vw overlap): the whole slab tumbles, "SPLAT."
   (or "WHIFF." if nothing was stacked, "TIMBER!" on the end screen at 20+).
6. Speed starts at 42vw/s and multiplies by 1.035 per slab, capped at 110.
7. The camera keeps the tower top at 42% of the stage height, easing
   there. Stars and moon move less than the tower, for depth.
8. Every 7th slab is a pale "ghost pumpkin"; the others cycle six oranges.

## How it is built

- **Every number in stack-o-lantern.js is in vw.** Positions are written into
  `style.left/bottom/width` as `"Nvw"` strings, so the browser does the
  pixel maths and a resize costs nothing. The slab height and the ground
  height are CSS variables (`--slab-h`, `--ground-h`) read once by JS, so
  CSS and JS cannot disagree.
- **World vs camera.** Slab positions are world coordinates (y up from
  the stage's bottom). The camera is a single `translateY` on the tower
  container, so placed slabs are positioned once and never touched again.
- `requestAnimationFrame` loop; `dt` capped at 0.05 s so a sleeping tab
  does not fling the falling pieces away when it wakes.
- Reaction words restart their CSS animation with the reflow trick
  (`void element.offsetWidth` between removing and adding the class).
- The moon's face is one `.mouth` element whose border and radius change
  by class: smile, "o", flat line, frown.
- Taps use `pointerdown` on the stage (instant). Space/Enter also work on
  a keyboard, as an extra.
- No images: slabs are CSS (colour variable, repeating-gradient ribs,
  inset shadows, a `::before` stem), stars are two repeating radial
  gradients, the moon is a circle.

## Where this game breaks the requirements, and why

Nowhere that I know of. Checked against 2.4: page setup copied as is;
every size in vw (px only as `max()` floors in the text classes and 2px
lines); the whole stage is the tap target; the Stack again button is
13vw tall; all text uses the three classes; Arial; colours contrast
(white text with the `.text-on-art` shadow over the sky; ink face on the
pale moon); no localStorage, no postMessage, nothing loaded from outside
the folder. Tested at 382 x 594 (iPhone 16), 338 x 526 (SE) and 547 x 850
(PC) through chrome-devtools, and standalone.

**Best** in the info bar is this visit only. Rule 18 forbids
`localStorage` until the app defines how scores are kept; when it does,
the app should own the high score.

## Talks to the app?

No. The app just loads the page; 🏠 in the top panel leaves it. When the
message contract exists, the natural messages are: score (the count) at
game over, and pause when the drawer opens (freeze the mover).
