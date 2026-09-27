# game0 (Home)

The home game: loaded when the app starts, and shown again whenever no other
game is active (🏠).

A painted pumpkin patch under a full moon. Every so often a character's
silhouette slowly rises from behind the tree line, waits, and sinks back down.

- **Idea and art:** from the title screen of the Halloween 2025 app (JP and
  Tristan). **Ported by:** Claude Code, 2026-09-27.
- **Status:** first try (John's "option 1": reuse the 2025 art, scaled to
  fill the panel's height, sides cropped). The art is 950 × 714, so it looks
  soft on phones; new tall art (1296 × 2016) may replace it later.

## Files

```text
index.html   the scene: 2 painted layers with the character between them
game0.css    scene scaling and cropping, layer order, the rise/sink movement
game0.js     picks characters (shuffled deck) and times the rise and sink
assets/pumpkin_patch_BACKGROUND_950x714.png           full painting (back)
assets/pumpkin_patch_950x714_justBelowHorizon.png     tree line + field, sky cut away
assets/pumpkin_patch_950x714_justBelowPumpkins.png    only the big front pumpkins (NOT USED)
assets/silhouettes/  19 character silhouettes, each 250px tall, transparent PNG
README - GAME0.md    this file
```

## How the layers work

Back to front:

1. **Full painting** (moon, tree, field).
2. **The character**, resting just below the tree line.
3. **Tree line and field** layer: hides the character until it rises.

A second hiding place, behind the front pumpkins (using the
`justBelowPumpkins` layer), was tried on 2026-09-27 and dropped: the
app's bottom panel covers that part of the screen on the home screen, so
those characters were almost always hidden. (Probably why it was dropped in
2025 too.) The layer file is kept in `assets/` in case it is wanted later.

## Sizes

- The scene is as tall as the game panel; its width follows the painting's
  shape (950:714), and the sides are cut off. `--crop-from-left` in
  game0.css picks which part shows (0.25 keeps the moon and big pumpkins).
- Everything inside the scene is placed in **% of the painting**, so the
  characters always line up with the layers on any screen.
- On an iPhone 15/16 in the app, the panel is 382 × 594 CSS px and the
  scene is 790 wide (about half of it shows). The paintings are enlarged
  about 2.5× on a ×3 phone, which is why they look soft.

| Character | Value (in % of the scene) |
|---|---|
| Height | 35% (250 / 714) |
| Rests at | 54.2% down (just below the trees) |
| Rises by | 96% of its own height |
| Across (left edge) | 14%–40% |

## Timing (settings at the top of game0.js)

| Setting | Value |
|---|---|
| Rise | 2–4 s (random) |
| Wait at the top | 1–4 s |
| Sink | 1 s faster than the rise |
| Hidden before the next character | 4–12 s, 8 s on average (2025 used 5–15 s) |
| First rise | 0–1 s after loading |

Characters are dealt from a shuffled deck, so nobody repeats until all 19
have appeared. Characters on the right half of their range are mirrored to face inward.

## Known issues

- The app's bottom panel is open on the home screen and covers the lower
  55% of the panel, so only the upper part of a risen character shows
  until the panel is closed.
- Some silhouettes (e.g. Totoro) have a light halo, from the 2025 image
  files.
- Colours: the painting sets them; the page background is `#000`.

## Talks to the app?

No. The app just loads the page; 🏠 in the top panel leaves it.
