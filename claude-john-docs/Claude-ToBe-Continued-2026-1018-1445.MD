# Claude — To Be Continued (2026-10-18 14:45) — the closing clean-up: placeholders gone, READMEs for a cold reader

**The project is FINISHED (John, 2026-10-18 14:31; the 14:31 handoff
beside this one has what ships and the bug-fix routine). This file
records the clean-up John asked for right after: "we should actually
clean up the folders and files somewhat before officially ending
things."**

For a bug fix, read: the 14:31 handoff, then this one, then
`specifications.MD` (6s, 6r) and `specifications-technical.MD` (4s, 4r).
A reader who does not know the repository starts at
`app/README - ROADMAP.md` instead. The 2026-09-27 13:07 file is the
baseline and stays; the 13:24 handoff of this day was removed by the
three-most-recent rule (its content, the speaker's hit box, is in Stack's
own docs and in spec 9.7 there).

## What changed (all pushed with this handoff, stamp 2026-1018-cleanup)

1. **`games/game1` to `games/game8` deleted**, with their eight entries
   in `games.json`. They were the empty shells of the original plan, in
   which friends would take one over each; John: "they can be deleted."
   `games.json` now holds exactly the three games that ship, and its
   `_about` block says the placeholders existed and why they are gone.
   The duplicated "High scores need nothing in this file" line in
   `good_to_know` is gone too.
2. **`games/README - game design requirements.md` is version 5, final.**
   John asked whether it was stale: it was, in the places where the shell
   had moved on. Brought into line: the Home / Settings pair (it said
   Home alone opened the panel), the second tab named for the game, the
   `high_scores: false` option, marks in a score's notes, the rule 6
   check sizes for the 9:15 panel (338 × 563 and 547 × 912; it still said
   the 9:14 numbers), `games/<folder_name>/` in rule 1, the three shipped
   games in place of "demo games... may change", the colours as final,
   and the "Coming in later versions" list rewritten as "Never written
   (the project is finished)". The rules themselves did not change.
3. **`__TRISTAN README!.txt`** at the root: John deleted it himself; the
   deletion rides in this commit.
4. **`start-local/README - starting local.txt`**: what the folder is for,
   how to use the bat, why a server is needed at all (fetch refuses
   file://), the two caching rules, the two ports (8091 John, 8098 the
   checks), troubleshooting.
5. **READMEs for the app**, written for "john, a relative novice
   programmer, looked at this repo": `app/README - ROADMAP.md` (the map
   of every file, who reads what, the stamp's 29 places by file, a
   reading order), `app/README - app.js.md` (the seven sections),
   `app/README - styles.css.md` (the sections and the traps),
   `app/README - default-icon.svg.md`, `games/README - game-helper.js.md`.
   The root files (`index.html`, `games.json`, `manifest.json`) are
   described in the ROADMAP rather than given READMEs of their own, so
   the root stays uncluttered; `index.html` and `games.json` carry their
   own comments anyway.
6. **Root `README.md` rewritten** for the finished state: no more
   game1..8 line, no 9:16 "three places" stamp advice (it is 29), no
   Codex October-14 checkpoint paragraph, pointers to the ROADMAP and the
   per-file READMEs, the bug-fix routine under "Publishing a change".
7. **Stamp** `2026-1018-gofish-defaults` → `2026-1018-cleanup` (29
   places; games.json changed, so phones must refetch it). Go Fish's
   sound settings reset with it, by design.
8. Checked: `check-gamestab.cjs` (scratch) on 8098 after the deletions:
   three buttons, no console errors, the tab as before.

## ToDo

Nothing planned. For a bug fix, the routine in the 14:31 handoff.

## Traps worth remembering

- A bash heredoc in this environment can fail to close on a long Python
  script (today: "unexpected EOF while looking for matching `'`" on a
  160-line heredoc that was fine as a file). Write edit scripts with the
  Write tool and run them with `python -I`.
- `games.json` has no benched entries any more; `pickButtonGames` still
  handles `goes_in_slot: ""` if one is ever added back.
- The requirements doc, the root README and `games.json` are LF;
  `app/styles.css` stays mixed.
