# Claude — To Be Continued (2026-09-29 19:31)

Second day, seventh stretch: **the eight-slot fixed-cell picker.** Read
`specifications.MD` and `specifications-technical.MD` next. The
game-author rules are still in ONE file:
`games/README - game design requirements.md` (v3; v4 must add the
games.json entry + icon spec, see ToDo 2).

## Current state

- **The app is a template** others insert mini games into. The frame + the
  docs are the product. `pumpkin-patch` (home) and `pie-maker` are demos
  that follow the rules; `game2`/`game3` are deliberately WRONG test games;
  `game4` is an empty placeholder. games.json lists exactly these five,
  slots home, 1, 2, 3, 4.
- **games.json v2** is unchanged in shape (`folder_name`, `goes_in_slot`,
  `title`, `short_title`, `icon`, `designer`, `credits`, `date`,
  `description`, `how_to_play`; `_about` at the bottom). Only the
  `goes_in_slot` rule grew: **a whole number 1 to 8 is a fixed cell on a
  board of two rows by four** (1 2 3 4 upper row, 5 6 7 8 lower row).
  Anything else (9, "", missing) = listed but benched, with a console
  info line. First entry in the file wins a duplicate slot.
- **The App tab picker**: the home game's button alone and centred at the
  top, then the board. A game always sits in its own cell (slot 1 is always
  top far left), empty cells stay empty, the designer decides the layout.
  ONE exception: when only one row has games, that row is drawn in the
  middle of the two-row space instead of at its top or bottom. John chose
  this over Claude's "each row centres itself" rule (option B) because it
  is simple and done; he may revisit ("that looks funky" with 1, 3 / 6, 8).
- **Start-up error for bad JSON**: one plain message ("games.json has some
  invalid JSON in it. You need to fix that file. (A JSON checker such as
  jsonlint.com will point at the line.)"). John REJECTED line-number
  detection built on the browsers' error messages: "error codes can
  change, different devices/browsers." The file:// hint about the .bat
  only shows when the page really was opened from disk.
- `APP_VERSION` = `2026-0930-slots8` (bumped once for this stretch; the
  two `?v=` tags in index.html match). Committed + pushed right after this
  update (see Work done, 9).
- Stale files (rules copies in the game folders, `mockups/`, unused PNG,
  two `.gitkeep`s) are GONE: John ran the delete command, commit `4dbb695`.

## Work done this stretch

1. Commit `4dbb695`: the stale-file cleanup John's delete command staged.
2. Picker rule discussion: John asked for 1–8 games with bowling-pin rows;
   Claude laid out A (absolute cells), B (slot picks the row, row centres
   itself), C (pure packing). John chose absolute cells, then B, then his
   own variant: **absolute cells + a lone row centred vertically.** All
   three were built in turn; the last one is what's on disk.
3. Code: `LAST_SLOT = 8`, `SLOTS_PER_ROW = 4`; `makeGameButtons()` builds
   `.game-board` > `.board-row` (upper: slots <= 4, lower: > 4; an empty
   row is not drawn) and sets each button's `style.gridColumn` from
   `((slot - 1) % 4) + 1`. CSS: `.game-buttons` is a flex column
   (`gap: 4.5cqw` because the pressed home button sinks 1.2cqw);
   `.game-board` is a fixed-height flex column (`2 × 18cqw + 3cqw`) with
   `justify-content: center`; `.board-row` is `grid-template-columns:
   repeat(4, 18cqw)`. `.is-home` is gone. Measured on 390×844: picker
   235 px in a 282 px tab body.
4. games.json `_about.goes_in_slot` rewritten for the board; index.html
   App-tab comment; app.js section-1 comment.
5. John hand-tested with nine entries (slots 1–9) on desktop + iPhone 16
   Pro; slot 9 and "" were benched correctly. He mangled the JSON once
   (`"goes_in_slot": :"",`); Claude fixed the stray colon.
6. Friendly JSON error: built with line detection (Firefox "line N",
   Chrome "(line N column M)" / snippet / "position N"), tested in
   Chrome, then REMOVED at John's request; plain message kept. While
   removing it Claude also deleted `pickButtonGames()` by accident (blank
   App tab, "Uncaught (in promise)"); restored from HEAD and re-verified.
7. games.json trimmed back to the five real entries, slots 1–4.
8. Lesson saved to memory: John loads the working tree live (own server,
   phone) while Claude tests, so a temporary test edit to games.json made
   his phone and desktop disagree. Warn first, restore before reporting.
9. This /update + commit + push.

## Immediate ToDo

1. **Requirements doc v4**: a section "Your games.json entry" (the field
   list, the browsing rule, snake_case, lowercase folder, the 1–8 board),
   the icon spec with the 200–300 / ±10 wiggle room, and the `short_title`
   length (about 12 chars; four text buttons across a row are narrow, so
   "Wrong: phone px" already wraps to three lines). Keep the doc the
   single source; games.json's `_about` is the short form.
2. **Decide the contribution workflow** (recommended: friends send a zip
   of their folder + their entry; John drops it in and pushes) and write
   the short "Adding your game" page in `games/` + a root `CLAUDE.md` /
   `AGENTS.md` for contributors' AIs pointing at the rules, `pie-maker`
   (good), `game2`/`game3` (wrong on purpose).
3. **Maybe revisit the board**: John: "maybe we will revisit that later,
   with your idea about centered buttons" = option B (slot picks the row,
   each row centres itself, so odd counts stagger like pins). Not now.
4. Known quirk to fix when scoring arrives: `markCurrentButton()` matches
   by `folder_name`, so two entries sharing a folder both look pressed.
   Real games have their own folders, so harmless today.
5. Top bar: show the current game's icon beside `short_title`? Only if
   John asks.
6. Switch on GitHub Pages; test on John's iPhone from the home screen.
7. Still waiting from before: verdicts on the home art (softness, crop,
   timing), the drawer covering 55% of Home, v6 TRIAL colours, title
   font, Pie Maker's timer while the drawer is open. Optional: drop the
   `dvh` fallback in styles.css. Favicon + app icons (manifest `icons`);
   the favicon 404 is the only console error.

## Long-term ToDo

- Message contract + helper script (score, game over, pause on drawer
  open, sound). Then games.json gains `scoring` (none/points/time),
  `settings`, `sound`, `pausable`; the app stores high scores keyed by
  `folder_name` and draws them in This Game (replacing the italic line).
- Checker script for games: relative paths, lowercase names, font sizes
  not below Small, no external URLs, size limits, games.json validity
  (this is where a line number for bad JSON belongs, not in the app),
  icon spec.
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
