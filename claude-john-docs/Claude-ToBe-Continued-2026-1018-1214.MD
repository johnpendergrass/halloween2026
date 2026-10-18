# Claude — To Be Continued (2026-10-18 12:14) — three games on a diagonal, the tab named for the game, the patch's tab pared down, no switches anywhere

This root folder is the SHELL's record. Read first: this file, then the
17:57 handoff of 2026-10-17 beside it (the choices feature that came and
went), then `specifications.MD` (6p) and `specifications-technical.MD`
(4p). The 2026-09-27 13:07 file is the project's baseline and stays (the
2026-10-17 14:41 handoff was removed by the three-most-recent rule). Each
game keeps its own docs: `games/candy-go-fish/_documents/claude-john-docs/`
and `games/stack-o-lantern/_documents/claude-john-docs/` (Stack's handoff
of this same minute records the morning's game work).

## State in one paragraph

**The shell shows three games on a diagonal and names the second tab for
the game; committed and pushed with this file.** The GAMES tab is three
fixed cells on a diagonal, slot 1 upper left (the Pumpkin Patch), slot 2
in the middle (Stack o' Lantern), slot 3 lower right (GO FISH! - Candy
Edition, moved from slot 8); the board is the middle half of the tab's
height. The placeholders game3..game7 are benched (empty slot) but their
folders stay for copying. The drawer's second tab reads the game's name
in capitals (PATCH, STACK O' LANTERN, GO FISH!: the accented part of a
long name, else the whole name, cut with an ellipsis if still too long)
instead of THIS GAME. The Pumpkin Patch's tab has no High Scores block
(a new optional games.json field, `"high_scores": false`), no byline, and
three centred lines: How to play / Nothing to do here. / Just sit back
and watch., then "Credits: jp/claude/chatty 10/2025"; its silhouettes
are brisker (rise 1-3 s, wait 1-2, hidden 2-6); its Slow / Fast switch is
gone, so no game declares a switch any more. The stamp is
`2026-1018-diagonal` (29 places).

## Work done this session (shell side, 2026-10-18 morning)

1. **The diagonal board** (John: "reduce the number of games offered in
   the GAMES tab to just three... put the icons in a diagonal row - but
   that row is bounded by the middle half of the vertical space").
   `LAST_SLOT` 3, `SLOTS_PER_ROW` gone, `makeGameButtons` gives each
   button `cell-<slot>`; CSS places the three cells (styles.css);
   games.json slots and `_about` text; index.html comment; README line.
   Measured headless at three sizes: the board spans 25%..75% of the
   tab's content height.
2. **The tab named for the game**: `gameTab.textContent =
   shortName(short_title || title)` in `loadGame`; `shortName()` returns
   the first `__accent__` of a name, else the plain words; the tab
   buttons are uppercase, one line, ellipsis. "GO FISH! - CANDY E..."
   was cut on both phones → John: "lets just leave it at GO FISH!".
3. **The Pumpkin Patch** (its own README updated too): timings; the
   switch removed from games.json; `high_scores: false` hides
   `.this-game-panels` in `fillThisGameTab`; description "", designer
   and date "" (no byline), `how_to_play` "Nothing to do here.\nJust sit
   back and watch.", credits "jp/claude/chatty 10/2025";
   `.look-pumpkin-patch` in styles.css 5b (centred, a blank line under
   the heading).
4. **An `*italic*` mark** for the tab text (John, mid-/update: Stack's
   "Milestones do not affect the score. / They are bragging rights
   only." in italics): `MARK`, `appendMarkedText`, `plainText`, the
   `_about` note; one mark per line, since a mark cannot span `\n`.
   Checked headless: two `<i>` in Stack's tab, Go Fish's text unchanged.
5. The stamp bumped to `2026-1018-diagonal` for the push.

## ToDo (shell)

- John's phone check from Pages once it serves `2026-1018-diagonal`: the
  diagonal board, the tab names, the patch's tab.
- `check-shell.cjs` (in Stack's checks): it still clicks "text:Stack"
  and reads the bar; worth adding the tab's name, the three-cell board
  and `high_scores`. The top-bar states and `reportScore`'s place are
  still not in it.
- The switch column: no game declares a switch now; keep the feature
  (it works and is documented) or drop it. Undecided.
- Longer term, unchanged: icons for the other games (none needed while
  the board is three); the requirements doc should mention
  `high_scores` and the three-cell board (it says 1..8 in places);
  the contribution workflow (AGENTS.md, a template game, a checker);
  the two-note "3 set game" sample.

## Traps worth remembering

- `app/styles.css` is MIXED line endings again (the 10-17 note that it
  was all LF was wrong for the picker block): every edit script this
  session tried the LF spelling then the CRLF spelling of each passage.
  `app.js`, `index.html`, `games.json` are LF.
- A bash heredoc turns `\n` inside a Python string into a real newline
  (games.json failed to parse once this morning before the write); write
  edit scripts to a file and use raw strings.
- The stamp: 29 places, `grep -rn <old>` and bump them together.
- John's own server is on 8091; Claude's checks use 8098, stopped by PID,
  one check at a time.
