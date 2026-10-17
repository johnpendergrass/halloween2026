# Stack o' Lantern — To Be Continued (2026-10-17 12:21) — milestone families, one level, no bar; the shell reads back scores

Read: this, then `specifications.MD` (section 5 is today) and
`specifications-technical.MD` (section 6 is today) beside it, then
`../../README - STACK-O-LANTERN.md`. The 2026-10-16 17:15 file beside
this one is the folder's baseline and stays. The milestone words live in
`../milestone list.md` (the file to edit); `../milestones-asof-10-17-2026.md`
and `../milestones-proposal-10-17-2026.md` are the morning's working
papers.

## State in one paragraph

**Playable, checked, about to be committed and pushed.** A long day of
John play-testing and Claude building. The game is called "Stack o'
Lantern" now (the folder is still `stack-o-lantern`). The milestones
were reworked into four families from John's list: HEIGHT (ten levels,
Scarecrow to Moon Landing) is the end screen's framed title and the
italic line under the count; ACCURACY, GROWTH and BOUNCE each put their
best earned name into one of three slots that step down to the right
like a staircase under "You earned...". The EASY / HARD toggle and the
whole info bar are gone: one level (HARD's rules and colours), the stage
is the full screen, "High score" sits in the top right corner with a
NEW HIGH SCORE! balloon beside it on a new best. The moon moved up and
everything laid out against it followed. The high score starts from
the shell's saved list (new helper call `Halloween.bestScore()`), and
Clear scores in the shell reloads the game, so the two agree. The end
screen goes back to the welcome screen after a minute with no tap. The
reaction word lost its streak badges; the milestone banner queue holds
one waiting banner at most. Scores go to the shell with the level's
name as the note. Cache stamp `2026-1017-stack-families` (26 places).

## Work done this session (09:00 to 12:20), in order

1. Morning: `milestones-asof-10-17-2026.md` (the nineteen as they were),
   the rarity-list idea discussed and dropped for fixed ranks, the
   four-family proposal, John's edits, `milestone list.md` as the
   source of truth (NAME / CRITERIA / BANNER / LINE or TIP / HINT per
   block; order within a family = rank; *perfect* in italics).
2. Built: 33 then 37 milestones with `family`; three new no-bounce
   counters; `bestEarned(family)`; the HEIGHT level as title and line;
   END_WORDS cut to TIMBER! from 5 up plus the low words; `fillMarked`
   for the italics; the "You earned" row (3 x 32vw grid, then absolute
   places on a slanted line, then the staircase: 26 / 50 / 74 across,
   left high, right low, 4.8vw 900-weight names that wrap, a single
   long word widening its box); the bubble hung from the word itself.
3. "High score" instead of "Best", one line; the NEW HIGH SCORE!
   balloon; the moon's glow on the start and end screens; the start
   screen's goal line dimmed to 60%, "Tap anywhere to start" 6vw bold.
4. One level: MODES, the toggle, the reminder pill, the mode flash, the
   localStorage key, the mode note on scores, EASY's lines all removed;
   HARD's sky, ground and moon are the only look.
5. The info bar removed; `.score-corner` in the stage; the moon at
   37vw then 34.75vw (John: "a bit higher ... aesthetic with the screen
   frame", then the whole group up a quarter of the title's size); the
   title alone up another quarter (18vw) and framed (orange border,
   green ring); the balloon at the label's size, beside the number.
6. "You earned..." left with 4vw padding; the streak badges (star x3,
   bolt x4) removed; the banner queue capped (`MILESTONES_WAITING` 1).
7. Shell: title "Stack o' Lantern" (short_title too, so the bar shows
   it); the Home icon 8.5cqw; the THIS GAME text as six centred short
   lines with marks and a `look-stack-o-lantern` style; scores reported
   with the level's name as the note.
8. Shell + helper: `Halloween.bestScore()`; `clearScores()` reloads the
   game's iframe; the requirements doc and the helper's notes say "one
   call to tell, one to ask".
9. The end screen's minute (`END_SCREEN_MS`, `armEndTimer`,
   `backToStart`; any tap on the end screen re-arms it).
10. Four more bounce tiers: Wildfire 30, Tornado 50, Supersonic 100,
    Desperado (20 no-bounce perfects).
11. Checks: `check-families.cjs`, `check-startscreen.cjs`,
    `check-shell.cjs` written; `check-narrow.cjs` updated; four old
    ones moved to `checks/obsolete/`. `check-moonspot.cjs` and
    `check-endgrid.cjs` still describe the old layout (not run today).

## ToDo

Immediate (John's list is empty at 12:20; these are Claude's notes):
- John's phone check from the home-screen icon once Pages serves
  `2026-1017-stack-families`: the full-screen stage, the corner, the
  staircase, the framed title, the balloon, the minute.
- Scale check on a PC-shaped panel: the banner is at `max(60.75vw, 35%)`
  and the mover flies at a share of the height; on a short, wide panel
  the two can overlap for a moment (they could before too).
- `check-moonspot.cjs` and `check-endgrid.cjs`: rewrite for the new
  layout or move to obsolete.

Longer term, unchanged: sound (Web Audio: thunk, knock, chime, crack,
splat, milestone ding in `celebrateNext`; a speaker toggle in the corner
remembered on the device; first-tap unlock for iPhone); more moon faces;
"almost made the high scores" feedback (the helper could grow a third
read); the ground strip's look; the start screen once per visit.

## Traps

- John loads the working tree live on 8091; checks run on 8098 with
  Playwright (`node <check>.cjs` from `_documents/checks/`, the no-cache
  server started and stopped around it). Claude in Chrome throttles the
  page to one frame a second while a script runs.
- A full-width slab cannot miss; a miss test must clip first.
- The milestone table's ORDER within a family is the rank. Add a new
  tier in its ranked place, not at the end.
- `min-width: min-content` on the chip is what lets "Sharpshooter"
  (36vw at 4.8vw) widen its box; without it the word spills out and is
  clipped at the screen's edge.
- The balloon and the corner live in the stage; the stage clips at its
  top edge, which is why the corner sits 2vw down.
- Edit scripts to disk; the Stack files are LF, the shell's `app.js`,
  `styles.css`, the helper and the requirements doc have mixed or CRLF
  endings (the scratch scripts try LF then CRLF for each match).
- The cache stamp is shared with the shell and Go Fish: 26 places.
