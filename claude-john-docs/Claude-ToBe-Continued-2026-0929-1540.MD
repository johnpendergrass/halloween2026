# Claude — To Be Continued (2026-09-29 15:40)

Second day, fifth stretch: **games.json**. Read `specifications.MD` and
`specifications-technical.MD` next. The game-author rules are still in ONE
file: `games/README - game design requirements.md` (v3).

## Current state

- **The app is a template** others insert mini games into. The frame + the
  docs are the product. game0 (pumpkin patch) and game1 (Pie Maker) are
  demos that follow the rules.
- **NEW: `games.json` at the root is the list of games.** app.js reads it
  at start-up and builds the buttons. A designer touches only their
  `games/<slot>/` folder and their entry in games.json; **app.js, index.html
  and styles.css are stable and never edited by a designer** (John's stated
  goal, 2026-09-29). Slots game0–game4 are a convention, not a limit.
- **NEW: game2 and game3 are deliberately wrong test games** ("Wrong:
  desktop size", "Wrong: fixed phone px") that show what the app does with
  a page that ignores the rules: nothing. The page is shown as is.
- `APP_VERSION` = `2026-0929-gamesjson`. Editing games.json needs the
  3-place version bump before a push (its fetch carries the `?v=` tag).
- **Nothing from this session is committed yet.** John said commit/push
  right after this update.
- The four stale copies of the requirements doc, `mockups/` and the unused
  game0 PNG are STILL on disk (delete command below, from last session).

## Work done this session

1. Read the docs; reviewed the state of the "how to add a game" docs for
   John. Verdict: the rules are solid; the step-by-step procedure and an
   AI entry point (CLAUDE.md) did not exist; the plain-language guide is
   hidden in claude-john-docs; the stale copies are a real risk for AIs.
2. Traced the by-hand procedure through the code (copy a slot, edit the
   GAMES list in app.js, bump version, run the .bat). John's answer: make
   it a true import scaffold, list in a JSON file, app.js never edited.
3. Wrote `games.json` (with an `_about` block, since JSON has no comments)
   and rewrote app.js sections 1, 4, 5: async `startUp()` fetches the
   file, `homeGame` = the `game0` entry, `games` = the rest. A readable
   error appears in the App tab if the fetch fails (e.g. opened via
   `file://`). README got an "Adding a game" section. Tested in the
   browser: buttons from the file, Pie Maker/Home switching, error path.
4. John asked what a wrong page looks like. Tried one via `srcdoc`, then
   at his request turned game2 and game3 into permanent test games, each
   with a README explaining what is wrong and what you will see.
   Screenshots checked at 390×844 (phone) and 1920×1080 (PC): behaviour
   matches the READMEs.
5. Designed **games.json v2** (fields list) with John; written up in
   `specifications.MD` 6e. NOT implemented yet.

## Immediate ToDo

1. **Commit + push this session** (John asked; do it right after this
   update). Then the delete command, still pending from last session
   (paste at the prompt, one line):
   ```
   ! git rm -r -q "games/game1/README - game design requirements.md" "games/game2/README - game design requirements.md" "games/game3/README - game design requirements.md" "games/game4/README - game design requirements.md" mockups games/game0/assets/pumpkin_patch_950x714_justBelowPumpkins.png games/game0/assets/.gitkeep games/game1/assets/.gitkeep
   ```
   game2–4 keep their `assets/.gitkeep`.
2. **Implement games.json v2** (spec 6e): `folder` replaces `slot`;
   `title`, `shortTitle`, `icon`, `designer`, `date`, `role: "home"`,
   `status` (ready/test/hidden), `description`, `howToPlay`, `credits`.
   app.js: read `folder`/`role`/`status`, skip hidden, icon + short title
   in the top bar, icon on the buttons, default pumpkin icon when missing.
   index.html/styles.css: an icon slot in the top bar and on the buttons.
   Every game: `assets/icon.svg` (or 256 px PNG). Then requirements doc
   v4: a section on "your games.json entry" + the icon convention.
3. **Decide the contribution workflow**: collaborator push, zip to John,
   or pull request. And who assigns folder names (once v2 lands, any
   lowercase folder name works; game0–4 are just the demo names).
4. Write the short "Adding your game" page in `games/` and a root
   `CLAUDE.md` / `AGENTS.md` that points contributors' AIs at the rules,
   the demo (game1) and the two wrong examples (game2, game3). Consider
   promoting `designing-for-the-frame.MD` to the friends' intro.
5. Switch on GitHub Pages; test on John's iPhone in home-screen mode.
6. Still waiting from before: John's verdicts on the home screen
   (softness, crop, timing), the open drawer covering 55% of Home, v6
   TRIAL colours, title font, Pie Maker timer while the drawer is open.
   Optional: drop the `dvh` fallback in styles.css.

## Long-term ToDo

- games.json deferred fields, together with the message contract:
  `scoring` (none/points/time), `settings`, `sound`, `pausable`. Then
  high scores and settings drawn by the app in "This Game".
- Message contract + helper script (score, game over, pause on drawer
  open, sound); requirements doc v4/v5.
- Checker script for games: relative paths, lowercase names, font sizes
  not below Small, no external URLs, size limits, games.json validity.
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message; icons + favicon (the console 404).
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
