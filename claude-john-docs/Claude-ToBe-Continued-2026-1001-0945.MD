# Claude — To Be Continued (2026-10-01 09:45)

Fourth day, first stretch: **the `_TABLED GAMES` folder. Pie Maker and
the two wrong test games tabled; the game is now Pumpkin Patch +
Stack-o'-Lantern, with eight neutral placeholder folders.** Read
`specifications.MD` and `specifications-technical.MD` next. The
game-author rules are still in ONE file:
`games/README - game design requirements.md` (v3; v4 must add the
games.json entry + icon spec, see ToDo 2).

## Current state

- **John's rule (2026-10-01): only a game that is actually used in the app
  has its own folder directly under `games/`.** Games that were written
  and tested and are worth keeping, but are not used, live in
  `games/_TABLED GAMES/` and have no games.json entry.
- **The game now consists of Pumpkin Patch (home) and Stack-o'-Lantern**
  (John). Everything else on the board is a neutral placeholder.

  | Slot | Folder | What it is |
  |---|---|---|
  | home | `pumpkin-patch` | The Pumpkin Patch |
  | 1 | `stack-o-lantern` | Stack-o'-Lantern, now also "the example that follows the rules" |
  | 2–8 | `game2`..`game8` | neutral placeholders, gameN in cell N |
  | "" (benched) | `game1` | neutral placeholder (cell 1 is taken) |

- **`games/_TABLED GAMES/`** holds four games, none in games.json:

  | Folder | What it is |
  |---|---|
  | `hollow-hill-cc` | Hollow Hill adventure (shelved 2026-09-30; was `_NOT-USED-hollow-hill-cc`) |
  | `pie-maker` | Pie Maker demo (was slot 1) |
  | `wrong-desktop` | wrong on purpose: 1280 × 720 desktop px (was folder `game2`, slot 3) |
  | `wrong-phone` | wrong on purpose: fixed px for one phone (was folder `game3`, slot 4) |

- **Slot 1 is John's decision. The placeholder slots (gameN in cell N,
  `game1` benched) are Claude's choice**, reported to John and not yet
  confirmed or changed.
- `APP_VERSION` = `2026-1001-tabled` (app.js + the two `?v=` tags).
- The local server is `start-local/start-halloween.bat` on port 8091.
- John edited the root `README.md` himself during the session (small
  wording and formatting changes); those are his and were kept.
- Committed and pushed right after this update.

## Work done this stretch

1. Read the docs. John had created `games/_TABLED GAMES/` and moved
   Hollow Hill into it; nothing in the app pointed at the old folder, so
   nothing broke. The rule and the new paths went into both spec files.
2. **Pie Maker tabled** (`git mv`), its games.json entry deleted,
   Stack-o'-Lantern moved from slot 2 to slot 1, version tag bumped.
   Every "see Pie Maker for an example" pointer now names
   Stack-o'-Lantern: the requirements doc (four places), the root README,
   the placeholder READMEs, the wrong games' READMEs and CSS comments.
   The requirements doc no longer says the demos "are not part of the
   finished app".
3. **The two wrong test games tabled and renamed**: `game2` →
   `wrong-desktop`, `game3` → `wrong-phone`, inner files renamed to match
   (`wrong-desktop.css/.js`, `README - WRONG DESKTOP.md`, same for
   wrong-phone), tags, header comments and READMEs updated. Both still
   run when opened directly.
4. **New neutral `game2` and `game3`** copied from `game5` with the
   number swapped; games.json entries for game2, game3, game4 rewritten
   as placeholder entries in slots 2, 3, 4.
5. Tested twice at 390×844 on a temporary server (port 8097, stopped
   afterwards): every board button loads its page, Stack-o'-Lantern sits
   in cell 1, the old `games/pie-maker/` address answers 404, the tabled
   games' files answer 200.
6. Root README, both spec files and the `__STATUS` marker updated.
7. This /update + commit + push.

## Immediate ToDo

1. **John to confirm the placeholder slots**, or say what the board
   should show (for example only Stack-o'-Lantern, cells 2–8 empty).
2. **Requirements doc v4**: "Your games.json entry" (fields, browsing
   rule, snake_case, lowercase folder, the 1–8 board), the icon spec with
   the 200–300 / ±10 wiggle room, the `short_title` length. Keep the doc
   the single source; games.json's `_about` is the short form. v4 should
   also say where the wrong-on-purpose examples now live.
3. **Decide the contribution workflow** (recommended: friends send a zip
   of their folder + their entry; John drops it in and pushes) and write
   the short "Adding your game" page in `games/` + a root `CLAUDE.md` /
   `AGENTS.md` for contributors' AIs pointing at the rules,
   `stack-o-lantern` (good), `_TABLED GAMES/wrong-desktop` and
   `wrong-phone` (wrong on purpose), and a placeholder folder (the thing
   to copy).
4. **`_TABLED GAMES` on GitHub**: the folder is in the public repo.
   Claude believes a default GitHub Pages setup (Jekyll) does not serve
   folders starting with an underscore, so the tabled games would not be
   on the live site; NOT verified for this repo. Check when Pages is
   switched on. Move to `github-excluded/` if John wants them private.
5. **Tabled games, later**: Hollow Hill (John wants changes considered:
   playing time, the mayor's look, dialogue lines, a visible player
   character) and Pie Maker. To bring one back: move the folder up to
   `games/` and restore its games.json entry from git (Hollow Hill:
   commit `c979de7`; Pie Maker: commit `a5bdbf7`). Pie Maker's and Hollow
   Hill's own files still carry their old paths in comments, and Pie
   Maker's README link to the requirements doc does not resolve from the
   tabled location.
6. **Maybe revisit the board**: "each row centres itself" (option B).
7. Known quirk: `markCurrentButton()` matches by `folder_name`, so two
   entries sharing a folder both look pressed. Harmless with real folders.
8. Switch on GitHub Pages; test on John's iPhone from the home screen.
9. Still waiting from before: verdicts on the home art, the drawer covering
   55% of Home, v6 TRIAL colours, title font. Favicon + app icons
   (manifest `icons`).

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
