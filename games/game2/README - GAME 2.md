# Game 2: "Wrong: desktop size" (a deliberately wrong test game)

**This game breaks the rules on purpose.** It shows what happens when a
page built for a desktop window is dropped into the app's game panel
without change. Use it to see the problem; do not copy it.

- **Made by:** Claude Code, 2026-09-29, at John's request.
- **Status:** test game. Replace the whole folder when a real game takes
  this slot.
- **The rules** it ignores are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).
  For a game that follows them, see `games/game1/` (Pie Maker).

## What it is

A fixed **1280 × 720** stage in `px`, the way the Halloween 2025 games were
built. Four pumpkins to click, a score, a Reset button at the bottom
centre. The page is not cropped, scaled or fixed up by the app in any way.

## What you will see in the app

- On a phone the panel is about 382 CSS px wide, so only the **top-left
  corner** of the stage is visible: the score, one pumpkin, maybe two. The
  other pumpkins and the Reset button are off to the right and below.
- The page **scrolls** inside the panel (no `overflow: hidden`), so a
  finger drag pans around the stage instead of playing.
- On a 1080p PC the panel is about 547 px wide: still less than half the
  stage.
- Pinch-zoom and text selection are not blocked; hover highlights do
  nothing on a phone.

## Where this game breaks the requirements, and why

Everywhere, on purpose: rules 2 (page setup), 3 (any 9:14 size), 5 (`vw`
sizing), 7 (tap target size), 11 (hover), 12 (`pointerdown`), 13 and 14
(text sizes). Text is 16 and 24 px, below Small.
