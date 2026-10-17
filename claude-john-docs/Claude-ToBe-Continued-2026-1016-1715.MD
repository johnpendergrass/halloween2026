# Claude — To Be Continued (2026-10-16 17:15) — shell: no-zoom rule, Stack's switch dropped; everything PUSHED

This root folder is the SHELL's record. Read first: this file, then the
15:34 handoff beside it (the one-control-point build, still current), then
`specifications.MD` (2, 3, 4, 6i) and `specifications-technical.MD` (4).
The 2026-09-27 13:07 file is the project's baseline and stays. Each game
keeps its own docs: `games/candy-go-fish/_documents/claude-john-docs/` and,
since today, `games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**The shell is the one-control-point design of 15:34, plus one rule, and
it is committed and pushed** (Claude, at John's request, 17:15; the first
push of the day covers the deletions, the shell rebuild, the docs, Go
Fish's name tweaks and the whole Stack-o'-Lantern afternoon). Cache stamp
`2026-1016-stack-milestones` everywhere (app.js, both root stamps, Go
Fish's 20 places, and now three links in Stack's `index.html`).

## Shell work this session (after 15:34)

1. **No zoom on the shell page** (`app/styles.css`, `html, body {
   touch-action: pan-y }`). John's phone: the game panel appeared
   magnified edge to edge with the top bar scrolled out of view. Cause: a
   double tap on the top bar or the frame's margins, or two thumbs down at
   once, triggered Safari's zoom on the shell page; the games block zoom
   inside their own panels but the shell never did. `pan-y` keeps the
   THIS GAME tab scrolling. John: "thanks for taking care of that."
2. **Stack-o'-Lantern's shell switch removed** (`games.json`: `settings:
   []`, `how_to_play` mentions the game's own toggle). The game cannot
   read the shell's switches, so it grew its own EASY / HARD in its info
   bar; two controls that disagree were worse than one. Pumpkin Patch's
   "Slow / Fast" is now the only declared switch, still unconnected.
3. **Docs**: 6f and 4g of the root specs are stubs pointing at the game's
   new folder; 2 (spec) and 4 (technical) note the no-zoom rule; the root
   README's current-work line and folder list mention Stack's new state.
   Status markers: root renamed to PUSHED; Go Fish's to PUSHED; Stack's
   created.
4. **Commit + push** by Claude from the terminal (John: "when done here do
   a /update and then a commit push"; he was away). One commit.

## ToDo

Immediate (shell):
- John's phone check from the home-screen icon after Pages updates (about
  a minute): the no-zoom rule (double-tap the top bar: nothing should
  move), the 9:15 panel, Home and tap-to-close, GO FISH! in the bar.
- Consider a second helper call, `Halloween.savedScores()`, returning the
  shell's saved list for the current game, so a game can say "that almost
  made the high scores list" (Stack wants it; Go Fish could too).

Longer term (unchanged): per-game switches that do something, or drop
the switch column now that both real games manage their own settings;
icons for the other games; placeholder slots and requirements gaps; the
contribution workflow (AGENTS.md, a template game, a checker); the
two-note "3 set game" sample in the helper and rules doc.

## Traps worth remembering

- The cache stamp is shared by the shell, Go Fish (20 places) and now
  Stack (3 links). Bump all of them together: `grep -rn <old stamp>`.
- `app/app.js` and `index.html` are CRLF; `app/styles.css` is mixed;
  `README.md` is mixed; games.json, the placeholders and Stack's files are
  LF. Edit with scripts written to disk that match whole lines and keep
  each line's own ending; a bash heredoc mangles `\\n` and `\u` escapes.
- John loads the served files live on port 8091; Claude's checks run on
  8098 (Playwright; Claude in Chrome throttles a page to one frame a
  second while a script runs, so timing-based tests fail there).
- The `look-<folder>` class is on BOTH the THIS GAME tab and the top
  title; section 5b rules must say which.
