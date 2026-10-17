# Claude — To Be Continued (2026-10-17 12:21) — the helper's second call, Clear scores reloads the game, Stack's shell look; stamp bumped

This root folder is the SHELL's record. Read first: this file, then the
2026-10-16 handoffs beside it (20:45 the stamp; 17:15 the no-zoom rule;
the 15:34 one-control-point build has been cut back to the three most
recent, its story is in `specifications.MD` 3 and 4), then
`specifications.MD` (2, 3, 4, 6i, 6l) and `specifications-technical.MD`
(4j, 4l). The 2026-09-27 13:07 file is the project's baseline and stays.
Each game keeps its own docs: `games/candy-go-fish/_documents/
claude-john-docs/` and `games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**Four small shell changes today, all for Stack o' Lantern, all checked;
about to be committed and pushed.** (1) The helper has a second call,
`Halloween.bestScore()`: the app's top saved score for the current game,
0 outside the app or with none saved; app.js exposes `bestScore` beside
`reportScore` on `window.halloweenApp`. (2) `clearScores()` reloads the
game's iframe after emptying the list, so a game that shows its own high
score starts over too. (3) The Home icon is larger (8.5cqw, was 6) inside
the unchanged bar. (4) `styles.css` has a `.look-stack-o-lantern` block
(centred lines, gold accent, orange-edged emphasis) and `games.json`'s
Stack entry has the new name "Stack o' Lantern" (title and short_title),
a six-line marked description and an empty how_to_play. The requirements
doc (rule 19, section 2.5) and the helper's own notes now say "one call
to tell, one to ask". The shared cache stamp is `2026-1017-stack-families`
in 26 places. Stack's own day (families, one level, no bar, the corner,
the staircase, the minute) is in its own folder's handoff.

## ToDo (shell)

- John's phone check from the home-screen icon once Pages serves the new
  stamp: the bigger Home icon, "Stack o' Lantern" in the bar, the THIS
  GAME text, a score with its level note, Clear scores restarting the
  game.
- Longer term, unchanged: per-game switches that do something or drop
  the switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample. A third helper
  read (the whole saved list) if a game wants "almost made the high
  scores" feedback.

## Traps worth remembering

- The cache stamp: 26 places, bump them together (`grep -rn <old>`).
- `app/app.js`, `app/styles.css`, `games/game-helper.js` and the
  requirements doc have mixed or CRLF endings; today's edits went
  through a scratch script that matches each passage with LF, then
  with CRLF, and writes the file back byte for byte. `git diff --numstat`
  afterwards shows only the intended lines.
- John loads the served files live on 8091; Claude's checks run on 8098
  with Playwright. The shell's drawer intercepts Playwright taps while it
  slides, so `check-shell.cjs` (in Stack's checks folder) clicks from
  inside the page instead.
