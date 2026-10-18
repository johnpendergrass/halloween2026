# Claude — To Be Continued (2026-10-18 13:32) — a stamp bump for Go Fish's music default; the shell itself unchanged since 13:04

This root folder is the SHELL's record. Read first: the 13:04 handoff of
this day beside this one (the GAMES tab rebuilt, the second tab PATCH /
STACK / FISH, marks in score notes), then `specifications.MD` (6r, 6q)
and `specifications-technical.MD` (4r, 4q); the 13:24 file is the
stamp bump for Stack's speaker, this one is the stamp bump for Go Fish's
music. The 2026-09-27 13:07 file is the project's baseline and stays
(the 12:14 handoff of this day was removed by the three-most-recent
rule; its content is in spec 6p and 4p). Each game keeps its own docs:
`games/candy-go-fish/_documents/claude-john-docs/` (a handoff of this
minute: the music default) and
`games/stack-o-lantern/_documents/claude-john-docs/` (13:24).

## State in one paragraph

**The shell is as pushed at 13:04.** The GAMES tab is the rainbow
title, the row of three labelled icons with the air mostly between them,
and the credits line; the second tab reads the game's one-word label in
capitals; a score's notes may use the text marks. The only change since
13:24 is in GO FISH! - Candy Edition (its music starts OFF and Always;
see its handoff), which needed the cache stamp bumped:
`2026-1018-gofish-music` (29 places). Committed and pushed with this file.

## Work done since 13:24 (shell side)

1. The stamp bumped to `2026-1018-gofish-music` for the push. Nothing else.
2. 13:55: bumped again to `2026-1018-gofish-defaults` for Go Fish's
   settings version (its handoff). A shell-wide lesson worth keeping: a
   game's localStorage note outlives every stamp, so a game whose saved
   settings should follow the version must store the stamp in the note.
   Go Fish reads its own `?v=` from `document.currentScript` on its first
   line and keeps the note only while the stamp matches, so EVERY push
   (every stamp bump) resets its sound settings, which is what John
   wants there. The shell's own notes (scores, switches) do not do this.

## ToDo (shell)

- John's phone check from Pages at `2026-1018-gofish-music`: the GAMES
  tab (title, row, labels, credits), the tab names PATCH / STACK / FISH,
  the patch's tab, the bold CHEAT note, the speaker's reach in Stack, the
  quiet welcome in Go Fish.
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
  first (that closes it). Test taps on any button must be 400 ms or more
  apart, or the double-tap guard eats the click.
- John's own server is on 8091; Claude's checks use 8098, stopped by PID,
  one check at a time.
