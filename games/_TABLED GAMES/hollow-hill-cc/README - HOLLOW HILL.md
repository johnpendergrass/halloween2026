# Hollow Hill

A tap-only point-and-click adventure, in the spirit of Freddi Fish and
Pajama Sam with a little dungeon-door puzzle for flavour. The Great
Pumpkin on Hollow Hill has gone dark on Halloween night. The mayor (a
vampire in a bathrobe) sends you to relight it, which needs three things:
a way through the hill gate, a proper candle, and a true Halloween flame,
which means a will-o'-wisp from the bog. Ten to fifteen minutes.

- **Made by:** Claude Code (Claude Fable 5.1), 2026-09-29, at John's
  invitation to design a longer adventure game of its own. Story, art and
  code are all Claude's; nothing is downloaded.
- **Status:** playable and tested end to end; awaiting John's verdict.
- **The rules** every game follows are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).

## Files

```text
index.html             the three bands: scene, dialogue box, inventory strip; title and end screens
hollow-hill.css        page setup and text classes (copied from the requirements), then the game's own styles
hollow-hill.js         1. STORY (scenes, hotspots, dialogue, items, hints)  2. ENGINE  3. start and ending
hollow-hill-art.js     every picture as SVG markup built from small helpers (moon, tree, tombstone, characters)
assets/hill.svg        the icon for the app's picker (256 x 256, square viewBox)
README - HOLLOW HILL.md  this file
```

## The adventure (spoilers)

Seven scenes: the **village square** (hub), the **hill gate**, the
**graveyard**, the **family crypt**, the **old chapel**, the **bog**, and
the **top of Hollow Hill**. Three puzzle chains, in any order:

1. **The gate.** Stitch the scarecrow will not open it without his hat.
   The crows in the graveyard have it and trade it for something shiny:
   a spoon stuck in the bog mud (three pulls). The frogs hint at it.
2. **The candle.** Madame Wail, the ghost organist, cannot play because
   bats are stuffed in her organ pipes. Bats love candy corn; you start
   with a bag. Fed, they leave, she plays, and gives her last beeswax
   candle. Offering her the candy gets a hint to give it to the bats.
3. **The flame.** Fibula the skeleton has a spare jar but has lost his
   skull, which rolled into the crypt. The crypt door opens when its four
   carvings are tapped moon, bat, pumpkin (the order is carved on
   Fibula's tombstone; a wrong tap resets). Return the skull for the
   jar, then hold the jar and tap a drifting wisp in the bog.

**Finale:** through the gate, up the hill, candle first, then release the
wisp. The pumpkin blazes, the village windows light, the mayor cheers
about the candy economy. The end screen shows the time and a rank
(under 6 min Legend, under 10 Night Navigator, under 15 Steady
Lantern-Bearer, else Thorough Trick-or-Treater).

Every character answers every item, usually with a joke. The **?** button
gives a hint for exactly the next step; after a minute with no progress
it pulses, but never interrupts. There are no dead ends and nothing can
be lost.

## How it is built

- **Story as data.** `STORY` in hollow-hill.js is a plain object: each
  scene has a name, an art function, exits (`to`, `side`, `label`, an
  optional `when` gate and `blocked` lines) and hotspots (`x, y, w, h` in
  picture units, a `label`, an optional `when`, and `tap(item)` which
  returns lines or `{ lines, then }`). Dialogue lines are `[who, text]`;
  an empty `who` is the narrator (italic). Flags live in one object,
  copied from `FRESH_FLAGS` on every start.
- **The engine** (`showScene`, `say`, `advance`, `give`, `take`, `hold`)
  knows nothing about pumpkins. Hotspot coordinates are in the SVG's
  viewBox units (1000 x 1120) and become percentages of the scene box,
  which has the same 1000:1120 shape on a 9:14 panel. Hotspots are never
  smaller than 140 units (14vw). They glow once when a scene opens, and
  ring while an item is held, because fingers cannot hover.
- **Redraw only when the story moves** (the flags changed), so the little
  bobbing animations are not restarted by every tap.
- **Art** is SVG markup from helper functions in hollow-hill-art.js. Each
  scene function receives the flags and draws the world as it is now:
  the door open or shut, the crows with or without the hat, the pumpkin
  lit. Animated parts (`.bob`, `.sway`, `.drift-*`, `.flicker`) sit inside
  a plain positioned group, because a CSS transform on an SVG element
  replaces its `transform` attribute.
- All UI sizes are vw; the picture scales with `preserveAspectRatio:
  slice`. Text uses the three classes; the dialogue box holds three
  Medium lines, so lines are kept under about 110 characters.

## Where this game breaks the requirements, and why

Nowhere that I know of. Page setup copied as is; sizes in vw (px only as
`max()` floors and 2px lines); every tap target at or above 13vw (exits
16vw, items 14vw, hint 13vw, hotspots at least 14vw); Arial; text on art
uses the shadow class; no localStorage, no postMessage, nothing loaded
from outside the folder. Tested at 382 x 594, 338 x 526 and 547 x 850
through chrome-devtools, and standalone.

**No saving.** Rule 18 forbids `localStorage` for now, so the adventure
is one sitting (10 to 15 minutes). When the app defines saving, the
natural thing to store is the flags object and the inventory.

## Talks to the app?

No. When the message contract exists: report "finished" with the time at
the end, and pause (ignore taps) while the drawer is open.
