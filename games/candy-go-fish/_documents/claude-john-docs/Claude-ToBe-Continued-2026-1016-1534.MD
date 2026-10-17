# Candy Go Fish — To Be Continued (2026-10-16 15:34) — RELEASABLE, small name and score tweaks

The game's own handoff folder. Read first: this file, then
`specifications.MD` and `specifications-technical.MD` beside it, then the
Codex record in `../codex-john-docs/`. The 11:33 file is this folder's
baseline; 13:28 and 14:15 are the earlier checkpoints of the day. The
shell's record is the root `claude-john-docs/` (its 15:34 handoff covers
the one-control-point shell this game now sits in).

## State in one paragraph

**Still RELEASABLE.** Nothing in the game's play changed. This session the
shell around it changed (one control point, a 9:15 panel) and John asked
for four small things on the game's side, all built and checked, NOT yet
committed. Stamp `2026-1016-one-control` (shared with the shell).

## Work done this session (afternoon, after the 14:15 handoff)

- **The panel is 9:15 now.** The shell dropped its bottom strip; the
  game's `#table` (154vw of grid rows, centred) sits with about 5.5vw of
  felt above and below instead of almost none. Checked in Chrome at phone
  size: opponent, centre and player regions in order and inside the
  panel; welcome, rules and the board all fine; `verify-shell.cjs` passes
  (it needs a server on 8098 and rewrites its two PNGs).
- **Score note** (John): `finishGame` reports `[humanName + ' vs ' +
  opponentName]`, e.g. "Sully vs Hermione"; the "<n> set game" note is
  gone ("no need"). One line in `js/candy-go-fish.js` plus its comment.
  Scores saved earlier keep their old notes until cleared.
- **Name in the shell** (John; games.json, the shell's files): title
  `__GO FISH!__\nCandy Edition` → THIS GAME tab shows GO FISH! big in the
  gold over a smaller "Candy Edition", with a wider gap to the candy
  plate; short_title `__GO FISH!__ - Candy Edition` → top bar shows GO
  FISH! in the shell's pumpkin at full size and "- Candy Edition" in
  white at about three quarters. The sizes live in section 5b of
  `app/styles.css` under `.look-candy-go-fish` (the top title now carries
  that class too). Fits at iPhone SE width.
- **Welcome subtitle**: "Candy Edition" without the exclamation mark, in
  `index.html` (the baked first paint) and in `js/candy-go-fish.js`
  where the heading is rebuilt. GO FISH! keeps its mark.
- **Stamps**: the 19 `?v=` in `index.html` and the config fetch in the
  script bumped to `2026-1016-one-control` with the shell.
- **Tab labels** the game's docs refer to are now GAMES and THIS GAME
  (the shell renamed them; the game's own text file is still
  `design ideas/Text for THIS GAME.txt`).

## ToDo

- John: commit + push; then a phone look at the 9:15 board, the welcome
  without the mark, and a finished game's "<you> vs <opponent>" line in
  THIS GAME.
- Codex's `CURRENT-STATE-2026-1015.md` line 81 still describes the two
  notes; it is a dated record, left alone. Update it only if Codex works
  on the game again.
- Otherwise maintenance only; every NEXT-TODOS item stays closed.
