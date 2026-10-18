# Stack o' Lantern — To Be Continued (2026-10-18 13:24) — the speaker's hit box three times its picture

**Added 2026-10-18 14:31: THE PROJECT IS FINISHED (John). Bug fixes only; nothing in the ToDo below is planned any more. The root handoff of 14:31 has the bug-fix routine.**

Read: the 13:04 handoff of this day beside this one (the floor at 0.65 s,
the tips, the practice list of tens, CHEAT rounds), then
`specifications.MD` (9.5 to 9.7) and `specifications-technical.MD`
(section 12), then `../../README - STACK-O-LANTERN.md`. This file only
records the twenty minutes after 13:04. The 2026-10-16 17:15 file is the
folder's baseline and stays (the 2026-10-17 17:57 handoff was removed by
the three-most-recent rule).

## State in one paragraph

**As pushed at 13:04, plus the speaker button's hit box.** John: "is
there any way to stop a tap on the speaker icon, turning sound on/off,
from triggering a pumpkin drop?" The switch already swallowed its
pointerdown (sound.js), so a tap ON it never dropped; the picture was
8.5vw, about 33 px, under the 44 px fingertip minimum, and a thumb
landing just outside it hit the stage. John weighed "any tap above the
moon level is ignored" and chose "making the speaker target bigger is
more elegant", then "imagine the speaker icon was 3x its size - can we
have the hit box that size?" So `.sound-corner` is 25.5vw square (about
100 px) with 8.5vw of clear padding all round, placed at top -6vw, left
-5.5vw so the picture stays exactly where it was; the part above and
left of the stage's corner is clipped (the stage has overflow hidden),
and the reach is all to the right and below, on the stage side. The
muted slash is centred on the button, so it stays on the picture. Only
the stylesheet changed. Stamp `2026-1018-speaker` (29 places). Checked,
committed and pushed with this handoff.

## Work done since 13:04

1. **The speaker's hit box**, as above: 13.5vw first (2.5vw padding),
   then 3x. `check-speaker.cjs` (now in checks/): loads the game alone
   on 8098 and sends REAL touch taps (`page.touchscreen.tap`) on the
   picture's centre and 6 / 20 / 28 / 40 px outside it to the right,
   below and diagonally: each toggles `aria-pressed` and leaves
   `state.phase` "ready"; a tap at (195, 400) then starts the round.
   The taps are 500 ms apart: at 250 ms the shell's double-tap guard
   (game-helper.js, 350 ms) cancelled the click and the check read "not
   toggled" for a working button.
2. Docs: spec 9.7, tech 12.4, README's sound line, this file, the stamp.

## ToDo

1. **John's phone** at `2026-1018-speaker`: the speaker's reach; the
   floor from practice 150 / 170 / 200 (0.70 is the notch back); the
   gold balloon on a CHEAT best; the bold note; the big rungs' loudness
   and the eight rockets at 100 (still unheard on the phone).
2. If speed alone is not enough at height: the perfect-tolerance table
   (1.6vw to about 1.0 by 200, shaped like `RAMP`); then a weaker
   grow-back above 100. John prefers fewer, told changes.
3. Checks: `check-bigrungs.cjs` still in the scratchpad (double spy,
   early backToStart); the 10-17 sound checks likewise;
   `check-moonspot.cjs` and `check-endgrid.cjs` stale; `probe-framerate`,
   `check-cheat` and `check-speaker` in checks/ with scratch headers.
4. A first visit's practice round from 50 ends in a gold NEW HIGH SCORE
   at 51 (the corner's best was 1). By the rule asked for; worth a
   thought if it ever looks silly on the phone.
5. The MP3 voice per rung (later); more moon faces; the banner and the
   flying slab can overlap on short wide panels.

## Traps

- Test taps on any button must be 400 ms or more apart, or the shell's
  double-tap guard eats the click (see 1 above).
- `.sound-corner` now starts outside the stage (negative top and left);
  anything that reads its box (a check, a future layout) should look at
  the `img` inside it for where the picture is.
- `stackedCount()` is `slabs.length + startLevel - 1`; `readStartLevel()`
  answers from memory and is 1 unless the pick is in `PRACTICE_LEVELS`.
- `reset()` calls `updateLabels()` with the OLD `startLevel`; harmless,
  but the corner's best becomes 1 at load when the app has no score.
- A note is cut to `MAX_NOTE_LENGTH` (16) before the shell reads its
  marks: keep marked notes short.
- A check that calls `backToStart()` before `END_DELAY_MS` has passed
  leaves the end screen's timeout to fire later. Wait the delay first.
- The ladder: regenerate the script block and `milestones.md` together
  (`ladder.py` of 10-18 in the scratchpad does both from one list).
- Run the checks one at a time; the stamp is in 29 places; John's server
  is 8091, the checks use 8098, stopped by PID.
