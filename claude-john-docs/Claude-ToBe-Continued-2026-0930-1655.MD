# Claude — To Be Continued (2026-09-30 16:55)

Third day, first stretch: **Hollow Hill shelved, Stack-o'-Lantern gets its
own folder, a full set of placeholder folders game1..game8.** Read
`specifications.MD` and `specifications-technical.MD` next. The game-author
rules are still in ONE file: `games/README - game design requirements.md`
(v3; v4 must add the games.json entry + icon spec, see ToDo 1).

## Current state

- **The app is a template** others insert mini games into. games.json now
  lists the home game plus ten entries for an eight-cell board:

  | Slot | Folder | What it is |
  |---|---|---|
  | home | `pumpkin-patch` | The Pumpkin Patch |
  | 1 | `pie-maker` | Pie Maker |
  | 2 | `stack-o-lantern` | Stack-o'-Lantern (Claude's one-tap stacker) |
  | 3 | `game2` | Wrong: desktop size (wrong on purpose) |
  | 4 | `game3` | Wrong: fixed phone px (wrong on purpose) |
  | 5–8 | `game5`..`game8` | neutral placeholders |
  | "" (benched) | `game1`, `game4` | neutral placeholders |

- **Slots 1 and 2 are John's decision. Slots 3–8 and the two benched
  entries are Claude's choice**, reported to John and not yet confirmed or
  changed. Nine games for eight cells, so something has to sit out.
- **Hollow Hill is shelved, not deleted** (John: "we will consider changes
  to it and using it later"). John renamed its folder to
  `games/_NOT-USED-hollow-hill-cc/`; its entry is out of games.json and
  nothing in the app points at it. The folder's own files are untouched
  and still call themselves `hollow-hill`. (John renamed it twice during
  the session: first `hollow-hill-cc-not-used`, then this name. The
  leading underscore sorts it first; the capitals are fine only because
  the app never loads it. A folder the app loads must be lowercase.)
- `APP_VERSION` = `2026-0930-stack` (app.js + the two `?v=` tags).
- The local server is `start-local/start-halloween.bat` on **port 8091**
  (John confirmed; an old memory note said 9000 and was corrected).
- Committed and pushed right after this update.

## Work done this stretch

1. Read the docs; found two stale spots (tech spec said version
   `2026-0930-slots8`, a memory note said port 9000). Both fixed.
2. **Hollow Hill removed from the app**: games.json entry deleted; the
   version tag (`2026-0929-hollow`) renamed since it carried the name.
3. **Placeholder folders game5..game8**, then **game4** and **game1** at
   John's request. game2 and game3 are no longer neutral placeholders, so
   the source was the ORIGINAL game4 placeholder from git history (commit
   `c44f4de`), with the number swapped.
4. **`game4` → `stack-o-lantern`** (`git mv`), its files renamed to
   `stack-o-lantern.css/.js`, every reference inside the folder updated.
5. games.json rewritten by script working on the TEXT (not a parsed and
   re-dumped copy) so the hand-made layout and the `_about` block stay.
6. Root `README.md` updated (games list, folder list).
7. Tested at 390×844 in the app with the real buttons: all eight board
   buttons load their page; Stack-o'-Lantern plays from the new folder
   (two taps → slabs placed), its pressed button and This Game icon are
   right; `game1` and `game4` pages fetched directly (no button).
8. This /update + commit + push.

## Immediate ToDo

1. **John's call on the board**: keep Claude's slots 3–8, or bench the
   wrong test games and show `game1`/`game4`, or leave cells empty.
2. **Requirements doc v4**: "Your games.json entry" (fields, browsing
   rule, snake_case, lowercase folder, the 1–8 board), the icon spec with
   the 200–300 / ±10 wiggle room, the `short_title` length. Keep the doc
   the single source; games.json's `_about` is the short form.
3. **Decide the contribution workflow** (recommended: friends send a zip
   of their folder + their entry; John drops it in and pushes) and write
   the short "Adding your game" page in `games/` + a root `CLAUDE.md` /
   `AGENTS.md` for contributors' AIs pointing at the rules, `pie-maker`
   and `stack-o-lantern` (good), `game2`/`game3` (wrong on purpose), and a
   placeholder folder (the thing to copy).
4. **Hollow Hill, later**: John wants changes considered before using it.
   Earlier tuning ideas: playing time, the mayor's look, dialogue lines,
   a visible player character. To bring it back: rename the folder to a
   final name and add a games.json entry (the old entry is in git,
   commit `c979de7`).
5. Should `_NOT-USED-hollow-hill-cc` stay in the public repo / on Pages?
   It is pushed now (nothing links to it). Move it to `github-excluded/`
   if John wants it private.
6. **Maybe revisit the board**: "each row centres itself" (option B).
7. Known quirk: `markCurrentButton()` matches by `folder_name`, so two
   entries sharing a folder both look pressed. Harmless with real folders.
8. Switch on GitHub Pages; test on John's iPhone from the home screen.
9. Still waiting from before: verdicts on the home art, the drawer covering
   55% of Home, v6 TRIAL colours, title font, Pie Maker's timer while the
   drawer is open. Favicon + app icons (manifest `icons`).

## Long-term ToDo

- Message contract + helper script (score, game over, pause on drawer
  open, sound). Then games.json gains `scoring`, `settings`, `sound`,
  `pausable`; the app stores high scores keyed by `folder_name`.
  Stack-o'-Lantern has a natural "finished/score" message and a pause.
  Hollow Hill would also want "save" (flags + inventory).
- Checker script for games (paths, names, font sizes, no external URLs,
  size limits, games.json validity incl. a line number, icon spec).
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
