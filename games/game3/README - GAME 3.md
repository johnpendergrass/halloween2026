# Game 3: "Wrong: fixed phone px" (a deliberately wrong test game)

**This game breaks the rules on purpose.** It shows the subtler mistake:
a page that was written for a phone, but in fixed pixels for *one* phone
and with ordinary web-page text and button sizes. It looks almost right
on the author's phone and wrong everywhere else. Use it to see the
problem; do not copy it.

- **Made by:** Claude Code, 2026-09-29, at John's request.
- **Status:** test game. Replace the whole folder when a real game takes
  this slot.
- **The rules** it ignores are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).
  For a game that follows them, see `games/game1/` (Pie Maker).

## What it is

"Ghost Count": an 8 × 6 board of 40 px squares, 12 of which hide a ghost.
Tap squares to find them. A 32 px Reset button, an underlined link, and a
list of instructions long enough to make the page scroll. Everything is
sized in `px` for a 390 px wide phone.

## What you will see in the app

- On an **iPhone 15/16** (panel 382 px wide) it nearly fits: the board is
  cut off by a few pixels on the right and the page scrolls to reach the
  instructions. The squares are 40 CSS px, just under a fingertip, so
  mis-taps are common. Text is 14 to 22 px, well below the Small size.
- On the **iPhone SE** (panel 338 px) the right column of the board is
  cut off entirely.
- On a **1080p PC** (panel 547 px) the page sits in the top-left corner
  with a blank strip down the right, and the text is small.
- A finger drag scrolls the page and can select text; pinch zooms.

## Where this game breaks the requirements, and why

On purpose: rules 2 (page setup), 3 (any 9:14 size), 5 (`px` sizing),
7 and 8 (40 px squares and 32 px buttons, 4 px gaps), 10 (8 columns),
13 (text below Small), 14 (underline).
