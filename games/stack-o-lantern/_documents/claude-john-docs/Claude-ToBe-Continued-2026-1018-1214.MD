# Stack o' Lantern — To Be Continued (2026-10-18 12:14) — Rainier and Denali on the ladder, big rungs with fireworks, the practice level forgets itself, the high picks

Read: this, then the 17:57 handoff of 2026-10-17 beside it (the ramp
table, the practice level), then `specifications.MD` (section 9) and
`specifications-technical.MD` (section 11), then
`../../README - STACK-O-LANTERN.md`. The 2026-10-16 17:15 file is the
folder's baseline and stays (the 2026-10-17 14:41 handoff was removed by
the three-most-recent rule).

## State in one paragraph

**Playable; the ladder reworked, three big rungs celebrate with
fireworks, the practice level is per visit and offers four high picks;
checked, committed and pushed with this handoff.** The HEIGHT ladder is
still 24 rungs every five to 100 then 125 / 150 / 175 / 200, but Chrysler
and Big Ben are gone and Mount Rainier (85) and Denali (95) are in; the
stretch 50..95 was reordered by real height (Space Needle 50, Eiffel 55,
Empire State 60, Shanghai Tower 65, Burj Khalifa 70, Vesuvius 75, Fuji
80, Rainier 85, Kilimanjaro 90, Denali 95, Everest 100). Space Needle
(50), Everest (100) and Moon Landing (200) are BIG rungs: a longer,
louder arpeggio (`bigMilestone` in sound.js) and rockets from behind the
moon mid-round, with pops: two at 50, eight at 100, eight at 200. The
practice level lasts the visit only (every launch starts at Level 1; an
old saved key is removed once) and the picker reads 1..100, "...", 122,
"...", 147, "...", 172, "...", 197 (the "..." rows are disabled and OK
ignores them). Stamp `2026-1018-diagonal` (29 places; the shell's day
is in the root handoff of the same minute).

## Work done this session (2026-10-18 morning)

1. **Is milestones.md current?** Compared by script against the table:
   51 and 51, every field equal. Yes.
2. **The ladder** (John: "Remove Chrysler and Big Ben, and add in
   mountains Mt Rainier and Mt Denali. Reorder the items for correct
   height... Keep Everest as the 100 item"). One scratch generator
   rebuilt the HEIGHT block of `MILESTONES` and the HEIGHT table of
   `milestones.md` from one list; the kept rungs carry their old lines
   to their new counts. New lines: Rainier "Mount Rainier is out.
   Seattle stops to look, as it always does, and then notices the
   pumpkins."; Denali "Denali, the Great One, roof of North America. The
   grizzlies have never seen a pumpkin this high up." Names drop
   "Mount" like Fuji and Everest (John did not object).
3. **The big rungs** (John: "a special celebration at levels 50, 100 and
   200. Sort of like the height sound, but maybe a bit longer and
   louder? ... a moon firework, with maybe two fireworks at 50, four at
   100 and six at 200? with the fireworks sound?"; then "make the level
   100 even longer fireworks - maybe 8 or so. and so the 200 needs the
   same not more"). `fireworks: N` on the three entries;
   `startRungFireworks(n)` (rockets 330 ms apart, `RUNG_REACH` smaller
   than the end screen's, no trickle); `celebrateNext` plays
   `bigMilestone` for those and launches; `gameOver` calls
   `stopFireworks()`. Scratch check `check-bigrungs.cjs` (practice from
   49 and 99; 200 fired directly) passed; the screenshot shows a rocket
   leaving the moon beside the SPACE NEEDLE banner.
4. **The practice level forgets itself** (John: "currently it retains
   the level the cheat was set to. when relaunching the game it should
   go back to the default of 1"): `chosenStartLevel` in memory replaces
   the localStorage key; `check-startlevel.cjs` gained step 6 (set 50,
   reload, Level 1).
5. **The high picks** (John: "add new cheat heights of 122, 147, 172 and
   197 to the end"; then "a '...' after 100, a blank line that either
   cannot be chosen, or is ignored if it is chosen"; then "have that ...
   after the 123, etc #'s also"): `PRACTICE_HIGH`, `PRACTICE_LEVELS`,
   disabled "..." options after 100, 122, 147, 172; OK keeps the old
   level on a non-level pick. 108 rows; the check passes.
6. **The question of the morning's end** (John: "we need to make the
   higher levels harder. right now the only difficulty ramp is the
   speed, right?"): yes. The speed floors at about 121 and nothing else
   scales with height. Options laid out (below); John: "we will try
   something" after this /update.

## ToDo

1. **Difficulty at height** (next, John's "we will try something"). The
   options as given: (1) tighten the perfect tolerance with height, say
   1.6vw to about 1.0vw by 200, as a table like the ramp; (2) keep the
   speed falling past 121 with a third `RAMP` row and a lower floor;
   (3) weaken the grow-back at height (a smaller `BONUS_WIDTH` or four
   perfects per bonus above 100); (4) a hair off every landing above
   some height. Claude's suggestion: (1), maybe with a mild (2). The
   practice picks 122..197 are there to feel it.
2. The big rungs on John's phone: loudness of `bigMilestone` (volumes
   0.38..0.42 against the rung's 0.30..0.35), eight rockets at 100.
3. Move `check-bigrungs.cjs` from the scratchpad into
   `_documents/checks/` (it needs the double-spy fix: it wrapped
   `playSound` once per round); the 14:41 sound checks likewise;
   `check-moonspot.cjs` and `check-endgrid.cjs` stale; `check-families`'s
   harmless SHANGHAI TOWER print.
4. The MP3 voice per rung (later); more moon faces; the banner and the
   flying slab can overlap on short wide panels.
5. John's phone look from Pages at `2026-1018-diagonal`.

## Traps

- `stackedCount()` is `slabs.length + startLevel - 1`; `readStartLevel()`
  now answers from memory and is 1 unless the pick is in
  `PRACTICE_LEVELS` (so 110 or 200 cannot be smuggled in).
- A rung's rockets share `fireworkTimers` with the end screen's show;
  `gameOver` clears them before the end screen's own show starts, and
  `start` / `backToStart` still call `stopFireworks()`.
- A check that calls `backToStart()` before `END_DELAY_MS` has passed
  leaves the end screen's timeout to fire later, mid-next-round
  (fanfareGood and six rockets out of nowhere). Wait the delay first.
- The ladder: regenerate the script block and `milestones.md` together
  (the scratch `ladder.py` of today does both from one list; `heights.py`
  of 10-17 predates `sound` / `pitch` / `fireworks`).
- Run the checks one at a time; the stamp is in 29 places; John's server
  is 8091, the checks use 8098, stopped by PID.
