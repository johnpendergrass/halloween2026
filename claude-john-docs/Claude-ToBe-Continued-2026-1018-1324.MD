# Claude — To Be Continued (2026-10-18 13:24) — a stamp bump for Stack's speaker; the shell itself unchanged since 13:04

This root folder is the SHELL's record. Read first: the 13:04 handoff of
this day beside this one (the GAMES tab rebuilt, the second tab PATCH /
STACK / FISH, marks in score notes), then `specifications.MD` (6r, 6q)
and `specifications-technical.MD` (4r, 4q). This file only records the
twenty minutes after it. The 2026-09-27 13:07 file is the project's
baseline and stays (the 2026-10-17 17:57 handoff was removed by the
three-most-recent rule). Each game keeps its own docs:
`games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**The shell is as pushed at 13:04.** The GAMES tab is the rainbow
title, the row of three labelled icons with the air mostly between them,
and the credits line; the second tab reads the game's one-word label in
capitals; a score's notes may use the text marks. The only change since
is in Stack o' Lantern's stylesheet (its speaker button's hit box, see
Stack's handoff of this minute), which needed the cache stamp bumped:
`2026-1018-speaker` (29 places). Committed and pushed with this file.

## Work done since 13:04 (shell side)

1. The stamp bumped to `2026-1018-speaker` for the push. Nothing else.

## A shell fact learned from Stack's check

The double-tap zoom guard in `games/game-helper.js` (and app.js) cancels
the click of any touch that ends within 350 ms of the previous one. A
check that taps a button twice in quick succession sees the second tap
do nothing; space test taps 400 ms or more apart. Players notice it only
as "a very fast second tap on a button does nothing", which was the
price of killing the iPhone's double-tap zoom (2026-10-17).

## ToDo (shell)

- John's phone check from Pages at `2026-1018-speaker`: the GAMES tab
  (title, row, labels, credits), the tab names PATCH / STACK / FISH, the
  patch's tab, the bold CHEAT note, and the speaker's reach in Stack.
- `check-shell.cjs` (in Stack's checks): the tab's name, the row and its
  labels, `high_scores`, a note with marks; the top-bar states and
  `reportScore`'s place are still not in it. `check-gamestab.cjs` is in
  the scratchpad only (worth keeping beside check-shell).
- The switch column: no game declares a switch now; keep the feature or
  drop it. Undecided.
- Longer term, unchanged: icons for the other games (none needed while
  the board is three); the requirements doc should mention `high_scores`,
  `button_label` and the row (it says 1..8 in places); the contribution
  workflow (AGENTS.md, a template game, a checker); the two-note "3 set
  game" sample.

## Traps worth remembering

- `app/styles.css` is MIXED line endings; `app.js`, `index.html`,
  `games.json` are LF. Edit scripts try the LF spelling of a passage
  then the CRLF one.
- A bash heredoc turns `\n` inside a Python or JavaScript string into a
  real newline; write edit scripts to a file with the Write tool, or use
  the Edit tool.
- The stamp: 29 places, `grep -rn <old>` and bump them together.
- The drawer starts OPEN on the GAMES tab: a check must not click Home
  first (that closes it).
- John's own server is on 8091; Claude's checks use 8098, stopped by PID,
  one check at a time.
