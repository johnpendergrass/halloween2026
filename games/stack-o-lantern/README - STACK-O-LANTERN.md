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
   up to the starting width ("WIDER!"). In EASY the 1.6 grows with the
   count, reaching 3.2 at 20 pumpkins and staying there.
4. **Partial**: the overlap becomes the new slab, the overhang falls off
   the side it hung over. A word rates it by how much survived: nice
   (90%+), close one (70%+), yikes (45%+), oof.
5. **Miss** (less than 0.8vw overlap): the whole slab tumbles and a big
   word flashes, the same one the end screen then shows: one of five,
   picked at random, from the band the count reached (`END_WORDS`: 0,
   1–5, 6–10, 11–19, 20–34, 35+; WHIFF. / SPLAT. / TUMBLE! / TIMBER! /
   SKY HIGH! / GO OUTSIDE. are one from each). John, 2026-10-16.
6. Speed starts at 42vw/s and multiplies by 1.035 per slab (1.03 in EASY),
   capped at 110.
7. The camera keeps the tower top at 42% of the stage height, easing
   there. Stars and moon move less than the tower, for depth.
8. Every 7th slab is a pale "ghost pumpkin"; the others cycle six oranges.
9. **Streaks and milestones** (John, 2026-10-16). The reaction word
   carries badges: a gold star "x3" for perfects in a row (from 2) and a
   blue bolt "x4" for drops in a row made before the slab touched a wall
   (from 3). Nineteen milestones, each once per round: Sharp Eye / Laser /
   Machine (5 / 10 / 20 perfects in a row), Quick Draw / Gunslinger /
   Lightning (5 / 10 / 20 drops without a bounce), Hoop Height / Haunted
   House / Skyscraper (10 / 25 / 50 high), Ghost Whisperer (a perfect on a
   ghost pumpkin), Comeback (a WIDER from under half width), Tightrope /
   High Wire (5 / 10 landings in a row on a slab half the starting width
   or less), Needle / Eye of the Needle (3 / 6 in a row at a quarter or
   less), Pencil Pusher / Toothpick (1 / 3 in a row on a "pencil pumpkin",
   an eighth or less), Green Thumb / Pumpkin Farmer (2 / 3 WIDERs in a row with no
   clipped drop between them; a plain perfect keeps the run). Each pops a
   gold banner with a burst of 16 stars for 1.8 s (two on one drop are
   shown one after the other) and the moon goes wide-eyed; the end screen
   lists the round's milestones, the top one of each kind only (a 24
   stack shows Haunted House, not Hoop Height too), as plain gold names:
   tap one (hover, with a mouse)
   and a bubble above it tells the fuller story (each milestone's `tip`,
   a sentence or two). The moon keeps its in-game place and size on the
   end screen (a feature; the words start below it). It winces at the
   miss, then on the end
   screen gives its verdict on the round: wide-eyed at 20+, a smile at
   10+, a flat line at 4+, sad below that (John: sad only for a bad
   performance). While the start screen waits, a **goal line** under the
   mode note names a milestone to go for ("GUNSLINGER: ten drops in a row
   with no bounce"), fading to another every few seconds (each entry's
   `hint`). The first tap stops it. (A moon speech bubble was tried first
   and dropped the same day: "does not really work".) The moon sits above the
   overlays (always bright). Nothing is
   remembered between rounds.
   The celebration (`celebrateNext`) is where the ding will go.
10. **EASY / HARD** is the toggle in the middle of the info bar (added
   2026-10-16 at John's suggestion: 20+ was hard for everyone). The lit
   word is the mode; the start screen says it in words, and a tap on the
   toggle shows the same line in a pill just under it until the next round
   starts (mid-round it leaves after 2.5 s); HARD's sky is
   blacker with a red horizon so the two are told apart at a glance. HARD
   is the game as first built. EASY starts identical and ramps: the
   perfect tolerance widens with the count (step 3) and the speed climbs
   a touch more gently (×1.03 a slab). A tap on the toggle takes effect at
   once, mid-round too, with a flash of the word; a round that was EASY for
   even a moment is an EASY round. The choice is remembered on the device
   under the game's own localStorage key `halloween2026:stack-o-lantern:mode`
   (rule 21). The round's mode goes to the app as the score's note, so the
   high scores list reads "14 (10-16-2026) easy", and picks the set of end
   lines: EASY's are kind, HARD's have an edge ("Taller than a tombstone.
   Yours is being carved.").

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
the folder except the app's own `../game-helper.js`. Tested at 382 x 594 (iPhone 16), 338 x 526 (SE) and 547 x 850
(PC) through chrome-devtools, and standalone.

**Best** in the info bar is this visit only. The lasting list, the five
best counts on this device, is kept by the app and shown in the THIS GAME
tab (see below).

## Talks to the app?

Yes, one thing (since 2026-10-01): at game over it reports the count.
`index.html` includes `../game-helper.js` before the game's own script,
and `gameOver()` calls `Halloween.reportScore(count)`. The app keeps the
five best and shows them in the THIS GAME tab. A count of 0 is not
recorded. Opened on its own, outside the app, the call does nothing, so
the game still runs standalone.

The game declares no switches in games.json: the app's switches cannot be
read by a game, so EASY / HARD is the game's own toggle (above). Its
settings list there is `[]`.

## Pause

None (John's decision, 2026-10-01). The app does not pause a game when
its bottom panel opens, and a game cannot tell that it opened; pausing is
each game's own job (rule 18). This game has no pause of its own, so the
pumpkin keeps sliding behind an open panel. A round is short, and a tap
on the panel does not drop the pumpkin.
