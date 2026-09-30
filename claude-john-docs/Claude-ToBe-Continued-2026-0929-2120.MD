# Claude — To Be Continued (2026-09-29 21:20)

Second day, eighth stretch: **two games by Claude: Stack-o'-Lantern and
Hollow Hill.** Read `specifications.MD` and `specifications-technical.MD`
next. The game-author rules are still in ONE file:
`games/README - game design requirements.md` (v3; v4 must add the
games.json entry + icon spec, see ToDo 1).

## Current state

- **The app is a template** others insert mini games into. It now holds
  FIVE real pages plus two benched test pages. games.json (slots):
  `pumpkin-patch` home, `pie-maker` 1, `game2` 2 (deliberately wrong,
  desktop px), `game3` "" (benched: deliberately wrong phone px, kept as
  the example), `hollow-hill` 3, `game4` 4 (Stack-o'-Lantern lives in the
  game4 folder; John said "keep game4 for now").
- **Stack-o'-Lantern** (`games/game4/`, John: "a fine little game"): a
  one-tap stacker. Pumpkin slabs slide, tap to drop, the overhang is
  sliced off and tumbles, a perfect drop keeps the width and three in a
  row grow it back. Reaction words, a moon with a face that reacts, end
  screen with "taller than a giraffe" comparisons. No images: CSS only.
  Icon `assets/stack.svg`. README `README - STACK-O-LANTERN.md`.
- **Hollow Hill** (`games/hollow-hill/`, awaiting John's verdict): a
  tap-only point-and-click adventure, 10 to 15 minutes. Seven scenes
  (square hub, hill gate, graveyard, crypt, chapel, bog, hilltop), three
  puzzle chains in any order (hat for the scarecrow via spoon-to-crows;
  candle from the ghost organist via candy-to-bats; wisp via
  skull-from-crypt-for-jar), finale relights the Great Pumpkin. Story as
  data, engine separate, all art SVG drawn in code, hint button. First
  person (no player sprite). Icon `assets/hill.svg`. README
  `README - HOLLOW HILL.md` has the full walkthrough.
- `APP_VERSION` = `2026-0929-hollow` (bumped for the games.json edits).
  Both games, the games.json changes and the docs are committed and pushed
  right after this update.
- Rule 18 (no localStorage / postMessage) is honoured by both games: Stack's
  "Best" is per visit; Hollow Hill has no saving.

## Work done this stretch

1. John invited Claude to design a game of its own for game4, "whimsical,
   meme-worthy, replayable". Built Stack-o'-Lantern (index.html, game4.css,
   game4.js, icon, README), tested at three sizes, standalone and in the
   app. Fix on the way: the ground now scrolls with the world instead of
   hiding the lower slabs.
2. John then asked for "a more complicated and involved adventure type
   game, 10-15 minutes, Halloween themed... Freddi Fish / Pajama Sam /
   D&D caves... tap friendly around the game edges... create the artwork
   yourself". Claude pitched Hollow Hill (story, map, three chains,
   controls, art plan); John: "i am afk, but the computer is on all night.
   take your time." Built it in `games/hollow-hill/` with the two open
   questions decided by Claude: first person, and a hint button.
3. Hollow Hill fixes found in testing: SVG groups with a `transform`
   attribute AND a CSS transform animation lose the attribute (wrapped the
   animated groups); the tombstone carving was cramped; black crows on a
   dark sky (moonlit stroke); the "tap to continue" marker overlapped line
   three on the SE (moved to the speaker row); the end overlay lightened
   so the lit pumpkin shows; the square is drawn behind the title screen.
4. Test method: scripted playthrough with the REAL buttons (aria-labels),
   including wrong turns; every scene screenshotted with debug hotspot
   outlines injected into the page (not in the code); sizes 382x594,
   338x526, 547x850; picker + This Game in the app.
5. games.json: hollow-hill entry (slot 3), game3 benched, game4 entry
   filled in for Stack-o'-Lantern. Version bumped twice (stack, hollow).
6. This /update + commit + push.

## Immediate ToDo

1. **Requirements doc v4**: "Your games.json entry" (fields, browsing
   rule, snake_case, lowercase folder, the 1–8 board), the icon spec with
   the 200–300 / ±10 wiggle room, the `short_title` length. Keep the doc
   the single source; games.json's `_about` is the short form.
2. **John's verdict on Hollow Hill.** Things he may want tuned: the
   playing time (lengtheners: one more fetch step per chain, a second
   crypt puzzle), the mayor's look, dialogue lines, whether the player
   character should be visible. If kept, decide the folder for
   Stack-o'-Lantern (rename game4 → `stack-o-lantern`?).
3. **Decide the contribution workflow** (recommended: friends send a zip
   of their folder + their entry; John drops it in and pushes) and write
   the short "Adding your game" page in `games/` + a root `CLAUDE.md` /
   `AGENTS.md` for contributors' AIs pointing at the rules, `pie-maker`
   (good), `game2`/`game3` (wrong on purpose), `hollow-hill` (big).
4. **Maybe revisit the board**: John: "maybe we will revisit that later,
   with your idea about centered buttons" = each row centres itself.
5. Known quirk: `markCurrentButton()` matches by `folder_name`, so two
   entries sharing a folder both look pressed. Harmless with real folders.
6. Switch on GitHub Pages; test on John's iPhone from the home screen.
7. Still waiting from before: verdicts on the home art, the drawer covering
   55% of Home, v6 TRIAL colours, title font, Pie Maker's timer while the
   drawer is open. Favicon + app icons (manifest `icons`).

## Long-term ToDo

- Message contract + helper script (score, game over, pause on drawer
  open, sound). Then games.json gains `scoring`, `settings`, `sound`,
  `pausable`; the app stores high scores keyed by `folder_name`. Both of
  Claude's games have a natural "finished/score" message and a pause.
  Hollow Hill would also want "save" (flags + inventory).
- Checker script for games (paths, names, font sizes, no external URLs,
  size limits, games.json validity incl. a line number, icon spec).
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
