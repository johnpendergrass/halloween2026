# Claude — To Be Continued (2026-09-27 14:43)

Second stretch of the first day. Read `specifications.MD` and
`specifications-technical.MD` next. The game-author rules now live in
`games/<id>/README - game design requirements.md` (identical copy in every
game folder; master = the game0 copy).

## Current state

- **The real app now has the three-panel design** (`index.html` + `app/`),
  moved from the mockup. The first single-column scaffold is gone.
  `mockups/layout-mockup.html` is kept but superseded.
- **Games are iframes.** `games/game0` … `games/game4`, each with
  `index.html`, `gameN.css`, `gameN.js`, `assets/`, and a
  `README - <NAME>.md`. The app loads one at a time into `#gameFrame`.
- **No app↔game messaging yet** (deliberate). 🏠 is the way out of a game.
- **game1 = Pie Maker** (John's design): 10 pumpkins drift asteroid-style
  (straight lines, spin, wrap around edges); tap → pie; timer; Play again.
  SVG art. Smallest pumpkin changed 0.12 → 0.13 of width (44px on iPhone SE).
- game0, game2–4 = placeholder pages (name + live size readout).
- v6 TRIAL colours (purple stage, black-translucent status bar) carried into
  the real app, still marked "v6 TRIAL"; no verdict from John yet.
- Committed and pushed at the end of this session (see git log).

## Work done this stretch

1. Answered: iframes vs "background images" (mockup was just swapped text);
   relative-size changes only matter if a game hard-codes the 9:14 shape.
2. Folder decision: `games/<id>/` (not root). game0 is a real game too (the
   home game: shown at start and whenever no game is active).
3. Built the real app + 5 iframe game pages; tested switching at 390×844.
4. Built Pie Maker; tested taps (simulated), finish, Play again.
5. Per-game READMEs, named `README - <GAME NAME>.md` at John's request
   (note: GitHub only auto-shows `README.md`; John accepted the naming).
6. Measured real sizes at 375×667, 390×844, 440×956 (see technical spec).
7. Wrote the **game design requirements** doc, then rewrote it (v2) per
   John's feedback around ONE design canvas of **1296 × 2016 real pixels**
   (the Pro Max game panel). Part 1 designers (canvas px only), Part 2
   coders/AI (÷12.96 = vw, `canvasToScreen()`, page setup, text classes,
   18 MUST/SHOULD rules), appendix per device.
8. John saw the doc "cut off" at Part 2 in his viewer; file was complete.
   Moved an indented code fence out of a list item (likely cause). John has
   not yet confirmed it now displays.

## Immediate ToDo

1. John is reading the design requirements v2; expect questions/edits.
   Confirm the "cut off" display problem is gone (ask which viewer if not).
2. John will describe test games game0 (home), game2, game3, game4.
3. Open questions for John:
   - v6 TRIAL verdict (purple stage + black-translucent status bar).
   - Title font: plain Arial for now; Halloween title font later?
   - Bring Pie Maker exactly in line with the text rules (it uses
     `clamp(14px, 5vw, 28px)` for its info bar, not the standard classes)?
   - Timer keeps running while the bottom panel is open (needs messaging).
4. Test on John's real iPhone (home-screen mode) — sizes, tap feel.

## Long-term ToDo

- Message contract + helper script (score, game over, pause on drawer
  open, settings declared as data and drawn in "This Game" tab, sound).
  Then add those sections to the design requirements doc.
- A way to keep the 5 copies of the requirements doc in sync (template
  game + checker script).
- HOME screen (game0) with background animations (plan step 2).
- Mini-game spec extras: file/folder naming, file-size limits, sound rules,
  submit/test process, `CLAUDE.md`/`AGENTS.md`, template game, checker.
- "Please rotate your phone" message; icons; GitHub Pages; friend workflow.
- **CONSIDER: Chinese language switch for the whole app** (John, 2026-09-27;
  display only, no keyboard entry). Simplified vs Traditional undecided
  (depends on audience; could support both). Notes:
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
