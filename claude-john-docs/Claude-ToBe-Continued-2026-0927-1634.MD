# Claude — To Be Continued (2026-09-27 16:34)

Third stretch of the first day. Read `specifications.MD` and
`specifications-technical.MD` next. The game-author rules live in
`games/<id>/README - game design requirements.md` (identical copy in every
game folder; master = the game0 copy).

## Current state

- **The real app has the three-panel design** (`index.html` + `app/`).
  `mockups/layout-mockup.html` is kept but superseded.
- **Games are iframes**, `games/game0` … `games/game4`, each with
  `index.html`, `gameN.css`, `gameN.js`, `assets/`, `README - <NAME>.md`.
  No app↔game messaging yet (deliberate). 🏠 is the way out of a game.
- **game0 = Home: the 2025 pumpkin patch** (NEW this stretch). Painting
  scaled to the panel's height, sides cropped; one character silhouette at
  a time rises from behind the tree line, waits, sinks. Hidden wait 4–12 s
  (John: ~20% faster than 2025). See specifications §6c, technical §4d,
  and `games/game0/README - GAME0.md`.
- **game1 = Pie Maker** (asteroid-style pumpkins → pies, timer).
- game2–4 = placeholder pages.
- v6 TRIAL colours still in place; no verdict from John yet.
- Committed and pushed at the end of this stretch (see git log).

## Work done this stretch

1. Answered: Chinese text is easy for display-only (UTF-8 already; system
   fonts; `lang`; no big web fonts). A whole-app language switch needs a
   text table + setting + messaging. John: probably whole app, Simplified
   vs Traditional undecided. Chinese game ideas listed. Added to long-term
   ToDo as CONSIDER (details below).
2. Found the 2025 title screen (`halloween2025/index.html`,
   `js/games/title-screen.js`, `css/styles.css` 368–441,
   `assets/background/`). Explained how it worked and the art-shape
   problem (950 × 714 wide vs our tall panel). John chose "option 1":
   scale to height, crop the sides.
3. Ported it to game0 with two popup slots (horizon + behind the front
   pumpkins). John: drop the front one (hidden by the open bottom panel);
   keep only the horizon popup. Then: hidden wait ~20% shorter, random
   around a middle value → 4–12 s (middle 8 s).
4. Tested in the app at 390×844 (emulation): layers line up, cycle timing
   correct, no errors (only a `/favicon.ico` 404 — no icon yet).

## Immediate ToDo

1. John to look at the home screen on his phone and say how it feels
   (softness of the art, crop position, popup timing).
2. Home-screen design question: the open bottom panel covers the lower 55%
   of the scene. Options: open less far on Home, move the scene, or start
   with the panel closed.
3. Unused file `games/game0/assets/pumpkin_patch_950x714_justBelowPumpkins.png`
   — John may delete it (Claude can't delete files).
4. Still waiting from before:
   - John reading design requirements v2; confirm the Part 2 "cut off"
     display problem is gone.
   - John to describe game2, game3, game4.
   - v6 TRIAL verdict; title font; Pie Maker text vs the standard classes;
     Pie Maker timer keeps running while the bottom panel is open.
5. Test on John's real iPhone (home-screen mode).

## Long-term ToDo

- Home art: new tall painting + cut-out layer at 1296 × 2016 (sharp), or
  painting in the lower part with dark sky above (room for a title or a
  countdown to Halloween, as in 2025). Fix silhouette halos.
- Message contract + helper script (score, game over, pause on drawer
  open, settings in the "This Game" tab, sound). Then add those sections
  to the design requirements doc.
- Keep the 5 copies of the requirements doc in sync (template + checker).
- Mini-game spec extras: naming, file-size limits, sound rules,
  submit/test process, `CLAUDE.md`/`AGENTS.md`, template game, checker.
- "Please rotate your phone" message; icons (+ favicon); GitHub Pages;
  friend workflow.
- **CONSIDER: Chinese language switch for the whole app** (John,
  2026-09-27; display only, no keyboard entry). Simplified vs Traditional
  undecided (depends on audience; could support both). Notes:
  - Pages are already UTF-8. Use system fonts (font stack: Arial,
    "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif) and set
    `lang="zh-Hans"` / `lang="zh-Hant"`. No full Chinese web fonts (5-20 MB);
    subset with pyftsubset, or draw titles as art.
  - Design doc rules to add: Medium (58 canvas px) is the minimum size for
    Chinese, no italics, line spacing ~1.5, ~20 chars/line at Medium.
    Pinyin via `<ruby>`.
  - A switch needs: app text in a per-language table, a language setting,
    and the app telling each game the language (needs messaging first).
    Games that can't do Chinese (spelling, anagrams) say "English only".
  - Chinese game ideas: word search (找词, 2-4 character words / 成语),
    find the odd character (汉字找茬, e.g. one 鬼 among look-alikes),
    build a character (拼汉字, 木+木=林), idiom chain (成语接龙),
    idiom fill-in (成语填空).
- Deadline: 2026-10-31.
