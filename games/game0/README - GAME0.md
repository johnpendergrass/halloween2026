# game0 (Home)

The home game: loaded when the app starts, and shown again whenever no other
game is active (🏠).

A painted pumpkin patch under a full moon. Every so often a character's
silhouette slowly rises from behind the tree line, waits, and sinks back down.

- **Idea and art:** the title screen of the Halloween 2025 app (JP and
  Tristan). **Ported by:** Claude Code, 2026-09-27.
- **Status:** a **demo**, reusing last year's art as a first try. It is not
  the finished home screen and will change (see "Known issues"). The rules
  every game follows are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).

## Files

```text
index.html    the scene: 2 painted layers with the character between them
game0.css     page setup (from the requirements), scene scaling and cropping, the rise/sink movement
game0.js      picks characters (shuffled deck) and times the rise and sink
assets/pumpkin_patch_BACKGROUND_950x714.png        full painting (back)
assets/pumpkin_patch_950x714_justBelowHorizon.png  tree line + field, sky cut away (front)
assets/silhouettes/  19 character silhouettes, each 250px tall, transparent PNG
README - GAME0.md    this file
```

## How the layers work

Back to front:

1. **Full painting** (moon, tree, field).
2. **The character**, resting just below the tree line.
3. **Tree line and field**: hides the character until it rises.

A second hiding place, behind the big front pumpkins, was tried on
2026-09-27 and dropped: the app's bottom panel is open on the home screen and
covers that part of the scene, so those characters were almost always hidden.
(Probably why 2025 dropped it too.)

## Where this game breaks the requirements, and why

| Rule | What game0 does instead | Why |
|---|---|---|
| 5: all sizes relative to the width (`vw`) | The scene is `100vh` tall; everything inside it is in `%` of the painting. | The paintings are wide (950 × 714) and must fill the panel's *height*, with the sides cropped. Placing the character in % of the painting keeps it lined up with the layers at any size. |
| 16: full-panel backgrounds 1296 × 2016 | 950 × 714 paintings, enlarged about 2.5× on a phone. | Reused 2025 art. This is why it looks soft; new tall art may replace it. |
| 7: tap targets at least 13vw | There is nothing to tap. | The home screen only animates. |

## Sizes and timing

- `--crop-from-left` in game0.css picks which part of the painting shows
  (0.25 keeps the moon and big pumpkins). On an iPhone 15/16 the panel is
  382 × 594 CSS px and the scene is 790 wide, so about half of it shows.

| Character | Value (% of the scene) |
|---|---|
| Height | 35% (250 / 714) |
| Rests at | 54.2% down (just below the trees) |
| Rises by | 96% of its own height |
| Across (left edge) | 14%–40% |

| Setting (top of game0.js) | Value |
|---|---|
| Rise | 2–4 s |
| Wait at the top | 1–4 s |
| Sink | 1 s faster than the rise |
| Hidden before the next character | 4–12 s (2025 used 5–15 s) |
| First rise | 0–1 s after loading |

Characters are dealt from a shuffled deck, so nobody repeats until all 19
have appeared. A character on the right half of its range is mirrored to
face inward. All 19 images are fetched at start-up so none pops in late.

## Known issues

- The app's bottom panel is open on the home screen and covers the lower 55%
  of the panel, so only the upper part of a risen character shows until the
  panel is closed.
- Some silhouettes (Totoro, for one) have a light halo, from the 2025 files.

## Talks to the app?

No. The app just loads the page; 🏠 in the top panel leaves it.
