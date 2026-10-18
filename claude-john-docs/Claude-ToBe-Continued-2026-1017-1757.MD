# Claude — To Be Continued (2026-10-17 17:57) — a choices feature came and went; the stamp

This root folder is the SHELL's record. Read first: this file, then the
16:27 handoff beside it (the iPhone double-tap zoom, in order), then
`specifications.MD` (6n, 6o) and `specifications-technical.MD` (4n, 4o).
The 2026-09-27 13:07 file is the project's baseline and stays (the 13:32
handoff was removed by the three-most-recent rule). Each game keeps its
own docs: `games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**The shell is as it was at 16:27, plus a stamp.** Between 16:30 and
17:30 it briefly had drop-down "choices" a game could read (for Stack's
starting level: a `choices` field in games.json, `fillChoices` and
friends in app.js, `Halloween.choice(name)` in the helper, `.choice`
styles); John then moved the setting into the game's own welcome screen
("i would rather that the anchor pumpkin slice show its level") and
every piece came out again. The helper has its two calls; the rule that a
game cannot read its THIS GAME tab holds, and the helper's header says a
setting that changes play belongs in the game's page. The stamp is
`2026-1017-stack-practice` (29 places). Committed and pushed with this
file.

## Work done this session (shell side)

1. In and out: the choices feature (an hour). What remains: a note in
   app.js's section-4 comment, so the next reader knows it was tried.
2. The stamp bumped for Stack's ramp, practice level and the direction
   rule.

## ToDo (shell)

- John's phone check from Pages once it serves `2026-1017-stack-practice`.
- `check-shell.cjs`: the top-bar states; a line for `reportScore`'s
  return value.
- Longer term, unchanged: per-game switches that do something or drop the
  switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample.

## Traps worth remembering

- A game setting that changes play goes in the game, not the tab: the
  shell's choices feature was built and removed in one hour because of
  that rule, and John agreed with the rule in the end.
- The stamp: 29 places, `grep -rn <old>` and bump them together.
- `games/game-helper.js` and the requirements doc are CRLF, `app/app.js`
  and `index.html` LF, `app/styles.css` mostly CRLF.
- John's own server is on 8091; Claude's checks use 8098, stopped by PID,
  one check at a time.
