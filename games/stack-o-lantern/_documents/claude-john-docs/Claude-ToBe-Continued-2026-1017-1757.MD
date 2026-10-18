# Stack o' Lantern — To Be Continued (2026-10-17 17:57) — the ramp as a table of seconds, a practice level on the welcome screen, Stack again goes home, back and forth

Read: this, then the 16:27 handoff beside it (the celebration), then
`specifications.MD` (sections 7 and 8) and `specifications-technical.MD`
(sections 9 and 10), then `../../README - STACK-O-LANTERN.md`. The
2026-10-16 17:15 file is the folder's baseline and stays (the 13:32
handoff was removed by the three-most-recent rule; the ladder story is
in `specifications.MD` 5 and the technical spec's section 7).

## State in one paragraph

**Playable, with sound, a celebration, a gentler ramp and a practice
level; checked, committed and pushed with this handoff.** The slab's
speed is now a RAMP TABLE in seconds per crossing: 2.4 s at pumpkin 1,
1.0 s at 100, half as steep after, never under 0.85 s (reached about
121); John reaches 70 or so on it and wants to "rethink" the stretch
over 100 later. The base slab on the welcome screen reads "Level 1"; a
tap on the words opens the PRACTICE panel (pick 1 to 100, Reset to 1,
Cancel / OK) and a round from a higher level counts from there, slides
at that level's speed, rings no rung below it, and reports no score.
Stack again returns to the welcome screen (one tap more per round, but
the base and its level are in view). The next slab always slides the
opposite way to the one just dropped, bounce or no bounce. The practice
level lived for an hour as a drop-down in the shell's THIS GAME tab, with
a third helper call; John moved it into the game and the shell is as it
was. Stamp `2026-1017-stack-practice` (29 places).

## Work done this session (16:30 to 17:57)

1. The ramp talk: today's multiplier (×1.035 a slab) put 1.0 s at 25
   and the cap at 29 ("hard at around 25"). John's shapes: linear 0.01
   a level (0.9 at 150); front-loaded steps (floor at 68, too early for
   "75 easily"); "linear with no ramp ... 1.0 s at 100"; then "getting
   to 1.0 at 100, and then slowing down the subtraction by 50%", and
   "the cap at about 0.85". Built as `CROSSING_START`, `CROSSING_FASTEST`
   and `RAMP` rows (`from`, `step`), walked by `crossingFor(count)`.
2. "i have a hard time getting above 70 or so!" → the starting level.
   First as John asked, in the shell's tab (games.json `choices`, the
   shell's `fillChoices`, `Halloween.choice(name)`, `check-startlevel`);
   then John: "i would rather that the anchor pumpkin slice show its
   level (default = 1), but if the user clicks on it the popup comes up
   ... Say that this is for practice only, and that no scores will be
   recorded." and "have the stack again just replay the welcome screen".
   Rebuilt in the game; the shell's feature removed again.
3. Panel tuning: a dark pill badge → "just clickable text"; the picker's
   list blank on desktop (white on white) → opaque dark rows; the note
   as three lines, the last smaller; the picker left and "Reset to 1"
   right; Cancel left and OK right on one line; "Done" → "OK".
4. "when practicing it comes from the same direction" → measured: the
   sides alternated by slab number in both modes; what John felt was a
   bounce. New rule: `state.lastDirection` at the drop, the next slab
   from the other side (`spawnMover`). "that works fine. good job."
5. `check-families.cjs` taught that Stack again goes to the welcome
   screen (a tap after it), and its drop helper now says "no mover"
   instead of hanging; `check-startlevel.cjs` rewritten for the game
   page (the badge, the panel, a practice round, Stack again, a real
   round that reports); `check-topfive.cjs` still passes.
6. The four iPhone screenshots of the zoom bug were removed from
   `_documents/` (John).

## ToDo

1. **Difficulty over 100** (John: "it is very close, but may need some
   tuning over 100"): the second `RAMP` row (0.0071 a level from 100)
   and the floor (0.85). Play from the practice panel at 90 or 100 and
   decide; a third row is one line.
2. The slicing is now the harder half: the perfect tolerance (1.6vw)
   could widen a little with speed if the fast stretch still kills by
   narrowing (talked about, not built).
3. `check-families.cjs`: its "low round" prints the title of the forced
   longest-names rows (SHANGHAI TOWER at 14) because the row-forcing part
   writes `#endWord` and the next round's `gameOver` does not get a word
   in before the read; harmless (the real round reads HOOP HEIGHT), fix
   the check when it is next touched. The check has no pass line; it
   prints JSON and screenshots.
4. The MP3 voice per rung (John's "for later"); move the 14:41 scratch
   sound checks into `_documents/checks/`; `check-moonspot.cjs` and
   `check-endgrid.cjs` stale; more moon faces; the banner and the flying
   slab can overlap on short wide panels.
5. John's phone look from Pages at the practice panel and the fireworks
   once it serves `2026-1017-stack-practice`.

## Traps

- `stackedCount()` is `slabs.length + startLevel - 1`: use it for
  anything that means "pumpkins", `state.slabs.length` only for slab
  indexes (colours, the ghost, the top slab).
- `applyStartLevel()` runs in `start()` after `reset()`; `showBadge()`
  in `backToStart()` and at load; `levelBadge.hidden = true` in `start`.
- The badge and the panel stop `pointerdown` so the stage does not start
  a round under them; a new control inside the stage needs the same.
- The practice key is `halloween2026:stack-o-lantern:start-level` (rule
  21); `sound.js` still uses the older bare `stack-o-lantern-sound`.
- A check that restarts a round must tap after Stack again now.
- Run the Playwright checks ONE AT A TIME: two on the same server made
  the families check look hung for ten minutes.
- The stamp is in 29 places; John's server is 8091, the checks use 8098.
