# Stack-o'-Lantern — To Be Continued (2026-10-16 20:45) — end screen redesigned around a FIXED moon; PUSHED

Read: this, then `specifications.MD` (sections 3 and 4) and
`specifications-technical.MD` beside it, then `../../README -
STACK-O-LANTERN.md`. The 17:15 file beside this one is the folder's
baseline (modes, milestones, banter) and stays.

## State in one paragraph

**Playable, pushed, and John has a three-item list for next time.** The
evening (17:30 to 20:45) was John play-testing on his phone and sending
screenshots, Claude rebuilding the end screen each time. The moon is
now FIXED at one spot on every screen (24vw across, 8vw from the right,
26vw down; it used to drift with the camera, which put it somewhere
different on every end screen and made John's first screenshot "a
mess"). The end screen is laid out around it: the big end word above
it, "You stacked / 23 / pumpkins!" level with it on the left, the
comparison line, a "Milestones" heading and a 3×3 grid of slanted gold
names placed by John's table below, Stack again pinned at the bottom.
During play the reaction word flashes above the moon, the milestone
banner pops under it, the tower is held at 36%. The count pops off each
landed pumpkin (no Stacked number in the bar any more); Best glows gold
after a round that beat an earlier best; the start screen's text sits
below the moon with the mode reminder under the toggle instead of a
mode line; end words have no full stops. Cache stamp
`2026-1016-stack-endscreen`.

## Work done this session (17:30 to 20:45), in order

1. 3×3 milestone grid with John's placement table (1: centre; 2: top and
   bottom middle; 3: diagonal; 4: corners; 5: X; 6: outer columns; 7: +
   centre; 8: all but centre; 9: all), names slanted −15°, chip font
   3.3vw so "Eye of the Needle" fits a 30vw cell, no star prefix.
2. John's "bad layout.png" (now in `design ideas/`): six notes. Cause
   found: the moon drifted 0.12× the camera. Drift removed; the moon
   moved to the spot in that screenshot (26vw); the banner, the reaction
   word, the sparks, the camera line (0.42 → 0.36) and the start screen
   all made room.
3. The ground strip question answered (it is the pumpkin patch, part of
   the world; not a shell remnant). Unchanged.
4. Start screen: no mode line; the reminder under the toggle shows at
   the start, on every toggle tap, and goes when the round starts.
5. Goal line halfway between the three lines and "Tap anywhere to
   start". The count pop (`popCount`, `.count-pop`).
6. End words without full stops; comparison lower; grid rows 9vw.
7. "Stacked N" out of the bar (empty balancing span); end word lower
   (clear of the reminder); Milestones lower; Best glows on a new best
   (`state.bestBefore` / `state.newBest`, `is-new-best` on `#bestBox`,
   cleared by `start()`; a first cut compared against the running best
   and glowed on round one — fixed).
8. The Playwright checks copied into `_documents/checks/` so they
   outlive the session.

## ToDo

John's list (20:40), in his order:
1. **Show five milestones at most on the end screen, larger text.** The
   grid and placement table need a five-slot design; the set itself
   "may adjust".
2. **More moon faces**, especially on the end screen (four today).
3. **Sound**: Web Audio synthesis (thunk, knock, chime, crack, splat,
   milestone ding in `celebrateNext`), speaker toggle in the bar
   remembered like the mode, first-tap unlock for iPhone; swap any
   disappointing sound for an MP3 of John's.

Then, as before: "almost made the high scores list" feedback (needs a
`Halloween.savedScores()` helper call in the shell); the ground strip's
look if John wants it to read as ground; more milestone classes if he
picks any; the start screen shows once per visit.

## Traps

- John loads the working tree live on 8091; checks run on 8098 (Claude
  in Chrome throttles the page to one frame a second while a script
  runs, so timing tests fail there).
- A full-width slab cannot miss; a miss test must clip first.
- Write edit scripts to files (a bash heredoc eats backslash escapes and
  once broke on a long heredoc). Match whole passages; the docs wrap at
  about 72 columns, so copy the exact lines.
- The cache stamp is shared with the shell and Go Fish: 26 places now
  (Stack's `index.html` has 3). `grep -rn <old stamp>`.
- The moon's spot is an anchor: nothing may move it, and new overlays
  must be laid out against 68..92vw across, 26..50vw down.
