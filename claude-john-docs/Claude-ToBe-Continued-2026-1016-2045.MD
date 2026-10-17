# Claude — To Be Continued (2026-10-16 20:45) — shell untouched this evening; stamp bumped; everything PUSHED

This root folder is the SHELL's record. Read first: this file, then the
17:15 and 15:34 handoffs beside it (the no-zoom rule; the one-control-
point build, both still current), then `specifications.MD` (2, 3, 4, 6i)
and `specifications-technical.MD` (4). The 2026-09-27 13:07 file is the
project's baseline and stays. Each game keeps its own docs:
`games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**No shell code changed between 17:15 and 20:45.** The evening was all
Stack-o'-Lantern (its handoff of 20:45 has the story: the moon fixed at
one spot, the end screen rebuilt around it, the count popping off each
pumpkin, Best glowing on a new best). The shared cache stamp is now
`2026-1016-stack-endscreen` in 26 places (app.js 1, root index 2, Go Fish
20, Stack's index 3). Committed and pushed by Claude at John's request.

## ToDo (shell)

- John's phone check from the home-screen icon once Pages serves the new
  stamp: the no-zoom rule, the 9:15 panel, Home and tap-to-close, and
  Stack's new end screen.
- A `Halloween.savedScores()` helper call (the shell's saved list for the
  current game) so a game can say "that almost made the high scores
  list". Stack wants it; Go Fish could use it.
- Longer term, unchanged: per-game switches that do something or drop
  the switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample.

## Traps worth remembering

- The cache stamp: 26 places, bump them together (`grep -rn <old>`).
- `app/app.js` and `index.html` are CRLF; `app/styles.css` and
  `README.md` are mixed; games.json and Stack's files are LF. Edit with
  scripts written to disk that keep each line's own ending.
- John loads the served files live on 8091; Claude's checks run on 8098
  with Playwright (Claude in Chrome runs a page at one frame a second
  while a script is open).
