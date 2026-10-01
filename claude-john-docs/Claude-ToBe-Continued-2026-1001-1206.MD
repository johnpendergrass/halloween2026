# Claude — To Be Continued (2026-10-01 12:06)

Fourth day, second stretch: **the first communication between games and
the app. The This Game tab now shows each game's high scores and its
switches; Stack-o'-Lantern reports its score; the app never pauses a
game.** Read `specifications.MD` (6i) and `specifications-technical.MD`
(4j) next. The game-author rules are in ONE file,
`games/README - game design requirements.md`, now **version 4**.

## Current state

- **John's principle: a designer drops a game in and it runs.** The app
  does little to a game; what it does not do is the game's own job.
- **The This Game tab**, top to bottom: icon + name + byline (centred,
  thin rule under it); two columns; then description, how to play,
  credits (scroll).
  - **Left, High Scores** (always shown, every game): five lines
    `1.  42  (10-01-2026)`, `---` where empty; a text score can stand in
    for the number ("Master Chef"). A small **Clear scores** button asks
    "You sure?  Yes  No" first.
  - **Right, switches**: **Sound** first (one for the whole app), then up
    to three on/off switches the designer names in games.json
    (`settings`). Declared now: Pumpkin Patch "Slow / Fast",
    Stack-o'-Lantern "Easy / Hard". Placeholders: Sound only.
- **What works**: scores. A game includes `games/game-helper.js` and
  calls `Halloween.reportScore(42)` or `reportScore(42, "Master Chef")`
  at game over; the app keeps the five best per game, with the date.
  Stack-o'-Lantern does this (the only change to that game).
- **What does not work yet**: the switches. They are shown and
  remembered, but **no game can read Sound or its switches**; the helper
  has only `reportScore`. They change nothing in any game.
- **No pause** (John's decision): the bottom panel can be opened at any
  time, covers the lower 55% of the game, and the game is not paused or
  told. Pause/continue/start/restart are each game's own job.
  Stack-o'-Lantern has no pause.
- **Kept on the device**: scores and switch positions are in the
  browser's `localStorage` (a page on GitHub Pages cannot write to
  games.json). No shared scoreboard, no player names, no structure for
  either (John).
- **The docs describe what exists, not what is planned** (John). The
  requirements doc v4, the root README, games.json's `_about` and the
  helper's header all say the switches are shown and remembered only.
- `APP_VERSION` = `2026-1001-scores` (app.js + the two `?v=` tags).
- The local server is `start-local/start-halloween.bat` on port 8091.
- Committed and pushed right after this update.

## Work done this stretch

1. Plan written in plan mode and adjusted with John several times:
   `claude-john-docs/claudePlans/buzzing-sparking-cosmos.md`. Parts of it
   are superseded (see "Decisions" below); the spec files are the truth.
2. **Step 1, the tab layout**: two columns under the title block; five
   score lines; the switch (a `role="switch"` button with a CSS slider);
   Sound + each game's switches; all remembered in `localStorage`.
   `games.json` gained `settings` (two real entries, `[]` on the eight
   placeholders) and its `_about` text.
3. **Look**, in John's rounds: scores list narrower and centred; switches
   centred in their half; date added to each score, smaller, dimmer,
   vertically centred; the line became rank, two spaces, score, two
   spaces, date, as a table that is only as wide as its content (indents
   with short scores, widens for a text score); "High Scores" + Clear
   scores button, then the "You sure?" question; title block centred with
   a rule under it. Scores column 3 shares, switches 2.
4. **Score reporting**: `games/game-helper.js` (new), `reportScore()` and
   `window.halloweenApp` in app.js, one `<script>` line and one call in
   Stack-o'-Lantern.
5. **Pause discussed and dropped**: Claude proposed hooks, then a
   helper-run game loop with an app-drawn "tap anywhere to continue";
   John rejected both as added complexity for designers.
6. **Docs**: requirements doc v4 (section 1.8, section 2.5, rules 18 to
   22, rule 1's exception for the helper), root README, Stack-o'-Lantern
   and Pumpkin Patch READMEs, games.json `_about` (`coming_later` became
   `good_to_know`), both spec files (6i, 4j).
7. Tested on a temporary server (port 8097, stopped each time) at
   390×844 and 1920×1080: real games played by script, text scores,
   top-five cut-off, invalid values, persistence, Clear + Yes/No, Sound
   across games, four switches fit, standalone page.
8. This /update + commit + push.

## Decisions this stretch (John unless marked)

- Sound is in the This Game tab, always the first switch, global.
- The three game switches are the designer's own and optional; a game
  may also have its own options screen.
- High scores always shown; score = number, optional text in its place;
  date shown as `(MM-DD-YYYY)` (saved as `YYYY-MM-DD`, Claude).
- Local scores only; no structure for shared boards.
- Clear scores needs a second tap (Yes/No).
- No pause from the app; the designer is responsible.
- Docs reflect what is, not what is planned.
- **Decided for the next step, not built**: Sound is to work immediately;
  a game switch in the panel applies to the next newly started game.
- Deferred by John: the hint line "Game options apply to your next
  game." under a game's switches (it reads oddly on Pumpkin Patch).
- Claude's choices, not objected to: settings declared in games.json;
  the helper calls the app page directly (no `postMessage`); a score of
  0 or less is not recorded; equal scores are both listed.

## Immediate ToDo

1. **Next step (John's words): "fill in the sound and settings options,
   devise a way for plug-in games to use them, and modify the demo games
   to use those values."** Claude's sketch, not agreed:
   `Halloween.getSettings()` (the 0/1 list, read when a new game starts)
   and `Halloween.soundIsOn()` (asked before each sound). Then decide
   what "Easy / Hard" does in Stack-o'-Lantern (`START_SPEED`,
   `SPEED_GROWTH`, `PERFECT_TOLERANCE`) and what "Slow / Fast" does in
   Pumpkin Patch (`RISE_TIME`, `WAIT_HIDDEN`). No game makes sound yet.
   When it is built: the requirements doc gets the rules for it (sound
   at once, switches at the next game), and the "cannot read them" notes
   come out.
2. **The hint line** under a game's switches: reword or remove (deferred).
3. **John to confirm the placeholder slots** (gameN in cell N, `game1`
   benched), still Claude's choice from the first stretch.
4. **Requirements doc, still missing**: "Your games.json entry" (fields,
   snake_case, lowercase folder, the 1–8 board) and the icon spec; for
   now the doc points at games.json's `_about` block. Also where the
   wrong-on-purpose examples live.
5. **Contribution workflow** (zip to John?), the short "Adding your game"
   page, and a root `CLAUDE.md` / `AGENTS.md` for contributors' AIs.
6. **Placeholder folders**: could show the helper + `reportScore` as a
   commented example. Not done.
7. **`_TABLED GAMES` on GitHub Pages**: Claude believes default Pages
   (Jekyll) does not serve underscore folders; NOT verified. Check when
   Pages is on.
8. Tabled games later (Hollow Hill: commit `c979de7`; Pie Maker: commit
   `a5bdbf7` for their games.json entries).
9. Maybe revisit the board (option B). Known quirk:
   `markCurrentButton()` matches by `folder_name`.
10. Switch on GitHub Pages; test on John's iPhone from the home screen
    (note: a home-screen copy has its own saved scores).
11. Still waiting: verdicts on the home art, the drawer covering 55% of
    Home, v6 TRIAL colours, title font. Favicon + app icons.

## Long-term ToDo

- Sound rules (iPhones play nothing until the first tap; formats).
- Checker script for games (paths, names, font sizes, no external URLs,
  size limits, games.json validity, icon spec, no direct
  `window.parent`/`localStorage`).
- Shared scoreboard + player names: explicitly NOT now; would need an
  online service outside GitHub Pages.
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
