# Claude — To Be Continued (2026-10-17 16:27) — the iPhone double-tap zoom fixed; reportScore returns the place; Stack's byline gone; the stamp

This root folder is the SHELL's record. Read first: this file, then the
14:41 handoff beside it (the Settings button), then `specifications.MD`
(6l, 6m, 6n) and `specifications-technical.MD` (4l, 4m, 4n). The
2026-09-27 13:07 file is the project's baseline and stays (the 12:21
handoff was removed by the three-most-recent rule). Each game keeps its
own docs: `games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**The iPhone double-tap zoom is fixed, after two false fixes.** A quick
double or triple tap on a game zoomed the whole shell (scale 1.16, the
frame's top at −32px), parking the top bar behind Chrome's address bar
with no way back but a reload; it had happened to John twice in two days
and he could not make it happen on purpose until a detective box in the
page caught it. What stopped it: a `touchend` guard that refuses the
second tap's default action, at the end of `games/game-helper.js` (every
game) and of `app/app.js` (the top bar and panel). `reportScore` returns
the score's place in the list (1..5, or 0), which Stack uses for its
green TOP 5 SCORE! balloon. Stack's `designer` and `date` are blank in
`games.json`, so its THIS GAME tab has no byline under the title. The
stamp is `2026-1017-stack-victory` in 29 places: the helper's script
tags in Candy Go Fish's and Pumpkin Patch's pages carry it now, since
the phone kept an old helper without one. Committed and pushed with this
file.

## The iPhone story, in order (so nobody repeats it)

1. John's screenshot: Stack's end screen with the shell's top bar cut
   off, "pinching or stretching does nothing". Reloading cured it; he
   could not duplicate it. First guess (wrong): Chrome drawing its bars
   over a page that cannot scroll.
2. A TEMPORARY diagnostic box in `index.html` (gone now): the window,
   the viewport units, the zoom scale, the frame's top; then a detective
   version that logged every change and showed itself only when the
   frame was cut off. The healthy numbers: 402×680, svh 680, lvh 790,
   frame 34..646. The bad ones: visual 346×585 at top 66, scale 1.16,
   frame top −32, scrollY 66 → a 16% zoom, nothing else.
3. John found the trigger: "a double or triple tap on the screen".
4. Fix 1 (not enough): `maximum-scale=1, user-scalable=no` on the
   viewport lines of the shell, Stack and Pumpkin Patch. iOS keeps the
   gesture for accessibility.
5. Fix 2 (not enough): `touch-action: manipulation` on `.game-frame`,
   and a watchdog that rewrote the viewport line when the visual
   viewport reported a zoom. The box confirmed all three were loaded
   ("watchdog YES, frame rule manipulation, meta YES") and the zoom
   stayed. The watchdog is deleted; the meta and the frame rule stay as
   cheap requests, with comments that say they are only that.
6. Fix 3 (works): the `touchend` guard. "that seems to have worked."
   A touch that ends within 350 ms of the previous one has its default
   refused, which cancels the zoom and that tap's click; Stack acts on
   pointerdown and never notices, Go Fish's cards lose only a fast
   second tap. Pumpkin Patch now loads the helper for the guard alone.
7. The stamp bumped mid-hunt so John's phone fetched fresh files ("how
   do i clear the cache. it is such a pain on mobile" → the stamp is the
   tool); the helper's tags given stamps.

## Other work (shell side)

- `app.js` `reportScore` returns `data.scores.indexOf(score) + 1` (0 when
  cut or not recorded); the helper passes it through; the requirements
  doc's rule 19 and snippet say so.
- `games.json`: Stack's `designer` "" and `date` "" (the byline hides;
  `setTextOrHide`).
- Section 7 of `app.js` is the guard; the watchdog it replaced is gone.

## ToDo (shell)

- John's phone check from Pages once it serves `2026-1017-stack-victory`:
  the double tap in Stack, Go Fish and the opening screen; the top bar.
- `check-shell.cjs`: the top-bar states; a check that `reportScore`
  returns the place (the game's `check-topfive.cjs` covers it for now).
- Longer term, unchanged: per-game switches that do something or drop the
  switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample.

## Traps worth remembering

- A game's own touch-action and viewport rules cannot stop the OUTER
  page's double-tap zoom on the iPhone; only the touchend guard can, and
  it must be in the game's document (the helper) because touches inside
  an iframe never reach the parent's listeners.
- The stamp: 29 places now, `grep -rn <old>` and bump them together.
- `games/game-helper.js`, `app/styles.css` (mostly) and the requirements
  doc are CRLF; `app/app.js`, `index.html`, `games.json` are LF.
- John's own server is on 8091; Claude's checks use 8098, stopped by PID.
- Long Python edit scripts: write them as files and run `python -I`;
  bash heredocs turn `\n` inside strings into real newlines (the
  diagnostic box's first version died of that).
