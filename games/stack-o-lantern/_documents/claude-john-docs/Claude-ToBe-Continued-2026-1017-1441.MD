# Stack o' Lantern — To Be Continued (2026-10-17 14:41) — sound: the switch, eight calculated sounds, rungs that ring and jump the queue; the base is pumpkin 1

Read: this, then the 13:32 handoff beside it (the 24-rung height
ladder), then `specifications.MD` (sections 5 and 6) and
`specifications-technical.MD` (sections 6, 7 and 8), then
`../../README - STACK-O-LANTERN.md`. The 2026-10-16 17:15 file is the
folder's baseline and stays (the 2026-10-16 20:45 handoff was removed
by the three-most-recent rule; its moon-spot story is in
`specifications.MD` 5.3 and the technical spec's section 6). The full
milestone list, with the new Sound and Pitch columns, is
`../milestones.md`.

## State in one paragraph

**Playable with sound, checked, committed and pushed with this
handoff.** Since the 13:32 push: a speaker switch in the stage's top
left (Go Fish's woofer, a white halo, a red slash when muted, on by
default, remembered on the device); `sound.js`, new, with eight sounds
made in code (tick, perfect, wider, soft, thunk, miss, start,
milestone) behind `playSound(name)`; every `MILESTONES` entry has
`sound` and `pitch`, and only the 24 HEIGHT rungs ring, a rising
arpeggio a semitone higher per rung; a rung's banner and arpeggio jump
the queue to the frame of the landing; the base is pumpkin 1 (the first
drop reads 2); the shell has a ☰ Settings button and Stack's credits
line. The stamp is `2026-1017-stack-sound` (27 places).

## Work done this session (13:40 to 14:41)

1. Credits line in `games.json`: "v 0.19.2 10/2026 claude/jp".
2. The switch: `assets/speaker.png` (160px, 39 KB), `#soundButton` in
   the stage, `.sound-corner` CSS, the switch code (first in the script,
   then moved to `sound.js`). John: "move the speaker icon down just a
   bit" (1vw → 2.5vw), glow added at his ask.
3. The shell's Settings button (the shell's own handoff has it).
4. Sound design agreed before code: calculated tones, the landing (not
   the tap) makes the sound, "no real lead in or ramping up", the slab
   stays instant ("keep it as it is now. it plays well").
5. `sound.js` and the calls. Tuning by John's ear: the miss went from
   crack-and-thud to two falling notes, then lower and closer; the
   milestone from da-ding to a single ding to a three-note arpeggio;
   the start ding added ("a cheery ding" on the start tap) and reused by
   the speaker.
6. `sound` / `pitch` on all 51 entries, in the table and milestones.md
   (John's idea, so the game checks the table).
7. The base counts ("in my mind it is already 1"); the under-5 bands
   shifted; the rung jumps the banner queue (`milestoneTimer`).
8. WebKit wakes audio on the finger lift: a `pointerup` resume. John
   confirmed on his phone: "that worked fine".
9. Checks: `check-families.cjs` passes; scratch checks for the speaker,
   the sounds and the milestone timing (a `playSound` spy) passed.

## ToDo

1. **Victory sounds** (John's next): the end screen, a new high score,
   maybe the NEW HIGH SCORE! balloon. Decide what "victory" is in a game
   that always ends in a miss: probably the reveal of the level title
   and a fanfare scaled by the rung, and a separate one for a new best.
2. **The difficulty ramp** (John: "it gets hard at around 25 or so";
   players should reach 50 and 75 "easily"). Talk first. The knobs:
   `START_SPEED` 42, `SPEED_GROWTH` 1.035 per slab (at 25 slabs the
   speed is ×2.4, at 50 ×5.6 capped by `MAX_SPEED` 110),
   `PERFECT_TOLERANCE` 1.6, `MIN_OVERLAP` 0.8, `BONUS_WIDTH` 3 every
   3 perfects. Options: a gentler growth (1.02 → ×1.6 at 25, ×2.7 at
   50), a speed ceiling reached later, growth in steps per rung, or a
   tolerance that widens slightly as the slab narrows.
3. The MP3 voice per rung (John's "for later"): `SOUNDS.<name>` can
   play a decoded buffer; files must be fetched and decoded ahead of the
   first rung (preload on the start tap).
4. Move the scratch checks into `_documents/checks/` (speaker, sounds,
   milestone timing); the 13:30 `heights.py` generator does not know
   `sound` / `pitch`.
5. From before: more moon faces; "almost made the high scores" (a third
   helper read); `check-moonspot.cjs` and `check-endgrid.cjs` stale;
   the banner and the flying slab can overlap on short wide panels.

## Traps

- Edit milestones in the script's table AND in `milestones.md`; the
  game reads only the table.
- A sound belongs in the landing code, not the tap code, and starts at
  full strength: `tone()`'s 1 ms ramp is the only "attack".
- `sound.js` loads before the game script; a new sound is a line in
  `SOUNDS` and one `playSound` call.
- Stop Claude's 8098 check server by its PID (`netstat -ano | findstr
  :8098`), never `taskkill //IM python.exe`: that killed John's own
  server all afternoon.
- The stamp lives in 27 places now.
