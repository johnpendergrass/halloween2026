# Claude — To Be Continued (2026-09-29 17:51)

Second day, sixth stretch: **games.json v2, icons, the picker, This Game.**
Read `specifications.MD` and `specifications-technical.MD` next. The
game-author rules are still in ONE file:
`games/README - game design requirements.md` (v3; v4 must add the
games.json entry + icon spec, see ToDo 2).

## Current state

- **The app is a template** others insert mini games into. The frame + the
  docs are the product. `pumpkin-patch` (home) and `pie-maker` are demos
  that follow the rules; `game2`/`game3` are deliberately WRONG test games;
  `game4` is an empty placeholder.
- **`games.json` v2 is live.** Entry fields (snake_case, John's choice):
  `folder_name`, `goes_in_slot` ("home" | 1..4 | anything else = benched),
  `title`, `short_title`, `icon`, `designer`, `credits`, `date`,
  `description`, `how_to_play`. The `_about` block sits at the BOTTOM of
  the file (data first) and documents every field. John's rule for what
  goes in the file: *anything the player might want while browsing, before
  tapping a game*. If the game and the file disagree, the file wins.
- **Folders renamed** (`git mv`): `game0` → `pumpkin-patch`, `game1` →
  `pie-maker`, with their css/js/README files renamed to match.
- **The App tab is a five-icon picker**: the home game's button alone and
  centred on row 1, then slots 1–4 two per row. Buttons are orange rounded
  squares holding ONLY the icon (no name). The current game's button looks
  pressed IN (sunk, dark, inset shadow, mint ring, `aria-current`).
- **Icon spec + check**: 256 × 256 real px, PNG with transparency or SVG
  with a square viewBox. Accepted if each side is 200–300 and the sides
  differ by <= 10 (John: hand-cropped icons are never exactly square). SVG
  skips the size check. Fail / missing / bad path → the button shows
  `short_title` as text; no text at all → the default ghost
  (`app/default-icon.svg`). Every rejection is explained in the console.
- **This Game tab** is filled from the current entry: icon, title,
  "designer, date", description, How to play, credits, and an italic
  "scores and settings later" line. Blank fields hide. Picking a game
  switches the drawer to This Game; the Home button switches back to App.
- `APP_VERSION` = `2026-0929-pressed`. **Nothing this stretch is committed
  yet**; commit + push follows this update.
- Stale copies of the requirements doc: `games/pie-maker/`, `game2`,
  `game3`, `game4` (the pie-maker one moved with the folder). `mockups/`
  and the unused pumpkin PNG also still on disk.

## Work done this stretch

1. games.json v2: John edited the first entry as a proposal; discussed
   here-vs-in-the-game (decided: browsing test), `goes_in_slot`,
   `folder_name` lowercase, snake_case names. Claude rewrote all entries to
   match, restored Pie Maker, moved `_about` to the bottom with a
   per-field `fields` object.
2. Renamed the two demo folders and every reference (their own files,
   game2–4 READMEs, requirements doc, root README "Adding a game").
3. Icons: `pumpkin-patch/assets/patch.svg` (moon, tree line, pumpkin,
   rounded square, clip-path), Pie Maker reuses `assets/pie.svg`.
4. app.js reads the new shape: `pickButtonGames()` (slots 1..LAST_SLOT,
   sorted, first wins a duplicate, console notes for the rest).
5. Five-icon picker (`makeIconButton`, `.game-buttons` grid, `.is-home`
   spans both columns). Measured: 69 px buttons on a 390 phone, 61 px on
   the SE, three rows fit with no scrolling.
6. John's correction: app files were touched (that's OUR one-time change;
   designers still never edit `app/`), and the icon must be spec'd with a
   text fallback → `iconQualifies()`, `showTextInstead()`, `_about`
   wording for `icon` and `short_title` (about 12 chars). Tested with 5
   cases (ok 256×250, 150², 256×230, missing file, missing + no title).
7. This Game tab (`fillThisGameTab`, `setTextOrHide`) + styles.
8. Pressed look for the current game (`markCurrentButton`, `.is-current`).
9. All tested via chrome-devtools at 390×844×3 and 375×667×2; no console
   errors or warnings except the known favicon 404.

## Immediate ToDo

1. **Commit + push** (right after this update). Then John runs the delete
   command (paths updated for the rename), one line:
   ```
   ! git rm -r -q "games/pie-maker/README - game design requirements.md" "games/game2/README - game design requirements.md" "games/game3/README - game design requirements.md" "games/game4/README - game design requirements.md" mockups games/pumpkin-patch/assets/pumpkin_patch_950x714_justBelowPumpkins.png games/pumpkin-patch/assets/.gitkeep games/pie-maker/assets/.gitkeep
   ```
   game2–4 keep their `assets/.gitkeep`.
2. **Requirements doc v4**: a section "Your games.json entry" (the field
   list, the browsing rule, snake_case, lowercase folder), the icon spec
   with the 200–300 / ±10 wiggle room, and the `short_title` length. Keep
   the doc the single source; games.json's `_about` is the short form.
3. **Decide the contribution workflow** (recommended: friends send a zip
   of their folder + their entry; John drops it in and pushes) and write
   the short "Adding your game" page in `games/` + a root `CLAUDE.md` /
   `AGENTS.md` for contributors' AIs pointing at the rules, `pie-maker`
   (good), `game2`/`game3` (wrong on purpose).
4. Top bar: show the current game's icon beside `short_title`? Not done;
   John has not asked. Only if it earns its space.
5. Switch on GitHub Pages; test on John's iPhone from the home screen.
6. Still waiting from before: verdicts on the home art (softness, crop,
   timing), the drawer covering 55% of Home, v6 TRIAL colours, title
   font, Pie Maker's timer while the drawer is open. Optional: drop the
   `dvh` fallback in styles.css. Favicon + app icons (manifest `icons`).

## Long-term ToDo

- Message contract + helper script (score, game over, pause on drawer
  open, sound). Then games.json gains `scoring` (none/points/time),
  `settings`, `sound`, `pausable`; the app stores high scores keyed by
  `folder_name` and draws them in This Game (replacing the italic line).
- Checker script for games: relative paths, lowercase names, font sizes
  not below Small, no external URLs, size limits, games.json validity,
  icon spec.
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
