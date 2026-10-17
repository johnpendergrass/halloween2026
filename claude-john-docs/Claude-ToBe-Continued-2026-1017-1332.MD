# Claude — To Be Continued (2026-10-17 13:32) — stamp only; Stack's height ladder lives in its own folder

This root folder is the SHELL's record. Read first: this file, then the
2026-10-17 12:21 handoff beside it (the helper's second call, Clear
scores reloads the game, the Home icon, Stack's look), then
`specifications.MD` (2, 3, 4, 6i, 6l) and `specifications-technical.MD`
(4j, 4l). The 2026-09-27 13:07 file is the project's baseline and stays
(the 2026-10-16 17:15 handoff was removed by the three-most-recent rule;
its no-zoom rule is in `specifications.MD` 6i). Each game keeps its own
docs: `games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**No shell code changed since 12:21 except the shared cache stamp**,
now `2026-1017-stack-heights` in the same 26 places (app.js, both
games, the root page), bumped because Stack's script changed: its
height ladder grew from 10 to 24 rungs (every five pumpkins to Everest
at 100, then Stratosphere, Space Station, Hubble, the Moon at 200) and
its `_documents` lost three working papers to one `milestones.md`. All
of that is in Stack's own 13:32 handoff. Committed and pushed with this
file.

## ToDo (shell)

- John's phone check from the home-screen icon once Pages serves
  `2026-1017-stack-heights`: the bigger Home icon, "Stack o' Lantern"
  in the bar, the THIS GAME text, a score with its level note, Clear
  scores restarting the game.
- Longer term, unchanged: per-game switches that do something or drop
  the switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample; a third helper
  read (the whole saved list) if a game wants "almost made the high
  scores" feedback.

## Traps worth remembering

- The cache stamp: 26 places, bump them together (`grep -rn <old>`);
  the docs quote old stamps as history and are left alone.
- `app/app.js`, `app/styles.css`, `games/game-helper.js` and the
  requirements doc have mixed or CRLF endings: edit by scratch script
  that matches each passage with LF then CRLF and writes back byte for
  byte; `git diff --numstat` afterwards.
- John loads the served files live on 8091; Claude's checks run on 8098
  with Playwright (the checks' own `require` path and installed Chrome).
