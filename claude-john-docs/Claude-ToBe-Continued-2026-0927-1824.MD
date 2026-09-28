# Claude — To Be Continued (2026-09-27 18:24)

Fourth stretch of the first day: **the audit**. Read `specifications.MD` and
`specifications-technical.MD` next. The game-author rules are now in ONE
file: `games/README - game design requirements.md` (v3).

## Current state

- **The app is a template** for others to insert mini games into (John,
  this stretch). The frame + the docs are the product. game0 (pumpkin
  patch) and game1 (Pie Maker) are **demos**, not part of the final
  package; they must agree with the requirements doc, and any departure is
  declared in their own README under *"Where this game breaks the
  requirements, and why"*.
- **Code audience: intermediate JavaScript front-end programmers** (the
  friends who will copy it), not John. Comments explain why, not what.
- Three-panel app (`index.html` + `app/`), games in iframes, no messaging.
  `APP_VERSION` = `2026-0927-rules3`.
- Every game's CSS starts with the requirements' 2.2 page-setup block and
  2.3 text classes, copied verbatim, then its own styles.
- v6 TRIAL colours still in place; `manifest.json` colours now match them.
- Everything below is committed and pushed at the end of this stretch
  **except the deletions John still has to run** (see Immediate ToDo 1).

## Work done this stretch

1. Answered "is this ready for GitHub Pages?": yes; Pages is not switched
   on yet (Settings → Pages → Deploy from branch → main → / root).
2. Full audit of the project (15 findings). John's framing: docs first,
   demos follow the docs, not the other way round.
3. Rule decisions (John): rule 5 px floors only, no ceilings; rule 7 one
   minimum (13vw) for still and moving targets (13vw tested fine on an
   iPhone 16 Pro); rule 13 the size is the MUST, the `.text-*` classes a
   SHOULD (a class can't be enforced, a size can); designer text is canvas
   pixels only; colour table lists only the app's own colours.
4. Requirements doc → v3, moved to `games/` (`git mv` of the game0 copy).
   The other four copies are stale and await deletion.
5. Pie Maker and game0 brought into line with v3 (page-setup block, text
   classes, no px ceilings, button `min-height: 13vw`); game0 preloads its
   19 silhouettes and uses short names + `imageFor()`. READMEs trimmed;
   exceptions sections added (Pie Maker: none; game0: `vh`/`%` sizing,
   950 × 714 art, nothing to tap). game2–4 same treatment.
6. Docs made consistent: smallest phone is the measured 338 × 526 CSS px
   everywhere; canvas 1296 × 2016; triageRush reference marked historical;
   root README says where the rules are and lists the 3-place version bump.
7. Comment pass on game0.js / game1.js for an intermediate reader. `.bat`
   IP trick commented. Tested in the browser at phone size: no console
   messages, sizes as specified.

## Immediate ToDo

1. **John: run the delete command** (paste at the prompt, one line):
   ```
   ! git rm -r -q "games/game1/README - game design requirements.md" "games/game2/README - game design requirements.md" "games/game3/README - game design requirements.md" "games/game4/README - game design requirements.md" mockups games/game0/assets/pumpkin_patch_950x714_justBelowPumpkins.png games/game0/assets/.gitkeep games/game1/assets/.gitkeep
   ```
   Then commit/push (Claude can do that part). game2–4 keep their
   `assets/.gitkeep` so the empty folders survive in git.
2. Decide game folder naming before friends copy the pattern: keep
   `gameN`, or descriptive ids (`pieMaker`)? Renaming later touches every path.
3. Optional from the audit, not done: drop the `dvh` fallback formula in
   `styles.css` (keep only the `svh` version); cache-bust inside game pages
   (decided: accept the 10-minute Pages cache instead).
4. Switch on GitHub Pages; then test on John's real iPhone, home-screen mode.
5. Still waiting from before: John's verdict on the home screen (softness,
   crop, timing); the open bottom panel covering 55% of Home; v6 TRIAL
   colours; title font; game2–4 descriptions; Pie Maker timer while the
   panel is open.

## Long-term ToDo

- Home art: new tall painting + cut-out layer at 1296 × 2016, or painting
  low with dark sky above (title / countdown). Fix silhouette halos.
- Message contract + helper script (score, game over, pause on drawer
  open, settings in "This Game", sound). Then add those sections to the
  requirements doc (v4).
- Checker script for games: relative paths, lowercase names, font sizes
  not below Small, no external URLs, size limits. `CLAUDE.md`/`AGENTS.md`
  at repo root for contributors' AIs; a template game to copy.
- Consider promoting `claude-john-docs/designing-for-the-frame.MD` to the
  friends' plain-language introduction (numbers now agree with the rules).
- "Please rotate your phone" message; icons + favicon; friend workflow.
- CONSIDER: Chinese language switch (whole app, display only; Simplified
  vs Traditional undecided). Notes in the 2026-0927-1634 ToBeContinued.
- Deadline: 2026-10-31.
