# Stack o' Lantern — To Be Continued (2026-10-18 13:04) — the floor at 0.65 s, three tips trimmed, the practice list of tens, practice rounds count as CHEAT

Read: this, then the 12:14 handoff of the same day beside it (the ladder,
the big rungs, practice per visit), then `specifications.MD` (sections
9.5, 9.6) and `specifications-technical.MD` (section 12), then
`../../README - STACK-O-LANTERN.md`. The 2026-10-16 17:15 file is the
folder's baseline and stays (the 2026-10-17 16:27 handoff was removed by
the three-most-recent rule).

## State in one paragraph

**Playable; the speed ramp runs on to 150; practice rounds count and are
marked CHEAT in the app's list; checked, committed and pushed with this
handoff.** `CROSSING_FASTEST` is 0.65 s (0.85 until today, 0.70 for an
hour): both RAMP rows are unchanged, so nothing below pumpkin 122 moved
and the slab keeps speeding up to pumpkin 150 (2.4 s at 1, 1.71 at 50,
1.0 at 100, 0.86 at 121, 0.65 from 150). A frame probe showed the game
holds every frame at a 10x CPU throttle; the display's refresh rate, not
the processor, sets the slab's jump per frame (1.3vw at 120 Hz, 2.6vw at
60 Hz, both inside the 3.2vw perfect band). The practice list is 1, 10,
20 ... 200 (21 rows, no "..." rows, no 122..197). A round from any level
is reported, can be the best (gold) or top five (green) and gets the
fanfare and fireworks; the app's list carries "**CHEAT**" as a second
note after the level's name (the shell's list renders the marks in notes
now); the end title is the plain level name (a " CHEAT" mark lived there
for an hour; John: "just a regular display is fine"). The panel reads
"Start the game at this level. / but levels above 1 / will be marked as
CHEAT in high scores." with the 1 orange and larger. Three tips
(Toothpick, Eye of the Needle, Needle) lost their "a quarter of the
starting width or less" clauses; pencil pumpkin stays. Stamp
`2026-1018-cheat` (29 places).

## Work done this session (2026-10-18 afternoon)

1. **Difficulty at height** (John: "i want to stick with fewer changes,
   because the player will feel cheated if something new changes without
   being told. let's try continuing the speed ramp first"): the table of
   speeds with no floor (0.65 at 150, 0.29 at 200) and the frame
   argument (jump per frame against the perfect band) led to a lower
   floor: 0.70 ("lower the floor to 0.70 and lets try it"), then 0.65
   ("lets try the .65 you wanted"). Five places quote the number: the
   constant and two comments, the README, spec 8/9.5, tech 10.1.
2. **A mainstream phone?** (John has an iPhone 16 Pro Max.) The scratch
   `probe-framerate.cjs` (now in checks/) measured frames at CPU
   throttles 1x, 6x, 10x, 20x: 8.3 ms every frame until 20x. Written up
   in spec 9.5.
3. **Three tips trimmed** (John: "we really do not need the
   definition.. just 'tiny pumpkin' ... and 'small pumpkin'"; then "no i
   really like your use of pencil pumpkin. that is a good milestone!"):
   the table and `milestones.md`; `compare-milestones.py` agrees.
4. **The practice list of tens** (John: "multiples of 10 upto 200. 1,
   10, 20, 30, ... 200. Of course the game continues past 200"):
   `PRACTICE_LEVELS = [1, 10, 20 ... 200]`; `PRACTICE_TOP`,
   `PRACTICE_HIGH` and the disabled rows gone.
5. **CHEAT rounds** (John: "include the cheat scores in the high scores
   list and celebrations, but with a **CHEAT** after the level name"):
   `updateLabels` no longer skips practice rounds; `gameOver` always
   reports, notes `[level.name, "**CHEAT**"]`; the shell's `fillScores`
   reads the marks in notes (one line, app.js) and the helper's comment.
   The end title carried a green half-size " CHEAT" span for an hour,
   then John: "do not have the CHEAT shown in the end game title";
   `.cheat-mark` removed. The panel's text in John's words, the 1 in
   `.practice-one` (orange, 1.3em; the panel's text is bold already).
6. **Checks**: `check-startlevel.cjs` rewritten for the new rules (21
   options, the practice end reports 51 with the notes, title SPACE
   NEEDLE, gold since 51 beat the corner's 1, best 51; the real round
   after it reports 7 with no notes and no CHEAT). Passes. Scratch
   `check-cheat.cjs` (now in checks/, with `cheat-end.png` and
   `cheat-list.png`) ran a practice round INSIDE the shell: the list
   reads "1. 51 (10-18-2026) Space Needle CHEAT" with CHEAT bold.
7. Docs: spec 9.5 (the floor, the probe) and 9.6; tech 12; README;
   `milestones.md`; this file; the stamp.

## ToDo

1. **John's phone** at `2026-1018-cheat`: the floor from practice 150,
   170, 200 (does 0.65 s still feel playable? 0.70 is the notch back);
   the gold balloon on a CHEAT best; the bold note; the big rungs'
   loudness and the eight rockets at 100 (still unheard on the phone).
2. If speed alone is not enough at height: the perfect-tolerance table
   (1.6vw to about 1.0 by 200, shaped like `RAMP`) is the next knob;
   then a weaker grow-back above 100. John prefers fewer, told changes.
3. `probe-framerate.cjs` and `check-cheat.cjs` are copied into checks/
   as they were (scratch headers; check-cheat clears the shell's
   localStorage on 8098, which is fine there). `check-bigrungs.cjs`
   still in the scratchpad (double spy, early backToStart); the 10-17
   sound checks likewise; `check-moonspot.cjs` and `check-endgrid.cjs`
   stale.
4. A first visit's practice round from 50 ends in a gold NEW HIGH SCORE
   at 51 (the corner's best was 1). By the rule asked for; worth a
   thought if it ever looks silly on the phone.
5. The MP3 voice per rung (later); more moon faces; the banner and the
   flying slab can overlap on short wide panels.

## Traps

- `stackedCount()` is `slabs.length + startLevel - 1`; `readStartLevel()`
  answers from memory and is 1 unless the pick is in `PRACTICE_LEVELS`.
- `reset()` calls `updateLabels()` with the OLD `startLevel` (it runs
  before `applyStartLevel`); harmless, but the corner's best becomes 1
  at load when the app has no score (the base counts).
- A note is cut to `MAX_NOTE_LENGTH` (16) before the shell reads its
  marks: keep marked notes short.
- A check that calls `backToStart()` before `END_DELAY_MS` has passed
  leaves the end screen's timeout to fire later. Wait the delay first.
- `check-startlevel` pushes empty slabs for its "real round", so no rung
  is earned there: the title is a miss word, not a level.
- The ladder: regenerate the script block and `milestones.md` together
  (`ladder.py` of 10-18 in the scratchpad does both from one list).
- Run the checks one at a time; the stamp is in 29 places; John's server
  is 8091, the checks use 8098, stopped by PID.
