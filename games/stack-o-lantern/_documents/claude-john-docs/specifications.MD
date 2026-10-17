# Stack-o'-Lantern — Specifications (design decisions)

Last updated: 2026-10-16 20:45 (/update; John's ToDo list in section 4; 20:20: no Stacked count in the bar; Best glows on a new best; big word, Milestones lower; 20:05: end words lose their full stops, exclamation marks stay; comparison lower, grid rows 9vw; 19:55: count pops off each landed pumpkin; goal line halfway down the start screen; 19:40: the start screen no longer names the mode; the reminder shows there instead; 19:10: the moon's spot is now 26vw down, from John's screenshot; the banner below it; 19:00: the moon never moves, not even with the camera; John's six layout notes on his screenshot; 18:30: end screen laid out around the moon, milestones on a 3x3 grid, slanted; 17:15: first file in the game's own folder: the 2026-09-29 design from the root spec's section 6f, then the 2026-10-16 afternoon of modes, milestones and banter)

This file records WHAT the game is and WHY. The "how" is in
`specifications-technical.MD` beside it. The shell around the game keeps
its own record in the root `claude-john-docs/`. The player-facing summary
is `../../README - STACK-O-LANTERN.md`.

---

## 1. The game (Claude, 2026-09-29)

John invited Claude to "design and write a good little game of your own...
whimsical... meme-worthy... something folks will want to play over and
over." Claude chose a one-tap stacker.

- **Play**: pumpkin slabs slide across the sky above a tower; tap to drop.
  The overlap with the slab below becomes the new slab; the overhang is
  sliced off and tumbles away. Less than 0.8vw overlap = a miss = game
  over. A drop within 1.6vw of the edge is **PERFECT**: snaps into line,
  full width kept; every third perfect in a row grows the slab 3vw back
  (up to the 46vw start). Speed 42vw/s × 1.035 per slab, capped at 110.
- **Whimsy**: a giant reaction word per drop (PERFECT! in gold, nice,
  close one, yikes, oof), a moon with a face (wide-eyed "o" on perfect,
  flat mouth on sloppy, frown at the miss), every 7th slab a pale ghost
  pumpkin, and an end screen that turns the count into a height ("10 = a
  basketball hoop, 18 = a giraffe, 320 = Big Ben. Please go outside.").
  John: "that was a fine little game."
- **Decisions**: no images at all (slabs, stars, moon are CSS) so it loads
  instantly; the camera keeps the tower top at 36% of the stage (42%
  until 2026-10-16, see the moon below); the
  ground is part of the scrolling world (a pinned ground made the lower
  slabs look like they sank); Best is per visit (rule 18). No pause
  (John, 2026-10-01): a round is short.
- Written in the `game4` folder; moved to `stack-o-lantern` on 2026-09-30.
  Reports its count to the shell at game over (`Halloween.reportScore`)
  since 2026-10-01; the shell shows the five best in THIS GAME.

## 2. EASY / HARD (John, 2026-10-16)

John and friends found 20+ hard to reach; Claude had called the perfect
tolerance "generous" and was corrected. The shell's Easy / Hard switch for
this game could not be read by the game (shell rule), so:

- **The toggle is the game's own**, in the middle of its info bar: EASY |
  HARD, the lit word is the mode. The shell entry's `settings` is `[]`,
  so the THIS GAME tab shows the scores across its full width: one
  control, not two that disagree.
- **HARD is the game as first built.** The first EASY (a flat wider
  tolerance, a wider start slab) was "too easy" and "not really easy to
  tell from hard". So **EASY ramps**: identical to HARD at the start,
  while the slabs are wide and slow; the perfect tolerance widens in
  proportion to the count until, at 20 pumpkins, it is double (3.2vw);
  the speed climbs a touch more gently (×1.03). Same starting width.
  "The main difference ... would be the precision required to drop."
- **The modes look different**: HARD's sky is near black with an
  ember-red horizon, a darker ground with an orange line, a paler moon;
  EASY keeps the plum sky. The sky fades between them.
- **Two sets of end lines**, same heights: EASY's are kind ("Taller than
  a tombstone."), HARD's have an edge ("Taller than a tombstone. Yours is
  being carved."; "Taller than Big Ben. Please go outside. Seriously.").
- **A switch takes effect at once, mid-round too** ("if I was doing
  poorly I might switch to easy mode for a bit"), with the word flashing
  over the tower. A round that was EASY for even a moment is an EASY
  round: its end lines and its score note ("14 (10-16-2026) easy" in the
  shell's list) say so, so a last-second flip cannot launder a HARD score.
- **The reminder**: a quiet line just under the toggle says what the
  mode in force means ("HARD mode: line the edges up within a hair"). It
  shows on the start screen for the remembered or default mode, and on
  every tap of the toggle, and goes when the round starts (tapped
  mid-round it leaves after 2.5 s). No border, dimmed text ("more
  subdued"). The start screen itself does not name the mode any more
  (19:40; it did, and the two said the same thing twice).
- The choice is remembered on the device under the game's own key
  (rule 21). Default HARD, so old scores stay comparable.

## 3. Milestones and banter (John, 2026-10-16)

"Players love the milestones and stuff and the banter that goes along
with the game." Built in one afternoon, in this order, each piece
play-tested by John on his phone between steps.

- **Streak badges on the reaction line**: a gold star "×3" for perfects
  in a row (from 2), a blue lightning bolt "×4" for drops in a row made
  before the slab touched a wall (from 3). The old "PERFECT x3" text "was
  just not as obvious to me as a player".
- **Nineteen milestones**, each once per round, in nine classes:
  perfects in a row (Sharp Eye 5, Laser 10, Machine 20); no-bounce drops
  in a row (Quick Draw 5, Gunslinger 10, Lightning 20); height (Hoop
  Height 10, Haunted House 25, Skyscraper 50); a perfect on a ghost
  pumpkin (Ghost Whisperer); a WIDER from under half width (Comeback);
  landings in a row on a slab half size or less (Tightrope 5, High Wire
  10), a quarter or less (Needle 3, Eye of the Needle 6), an eighth or
  less, the "pencil pumpkin" (Pencil Pusher 1, Toothpick 3); WIDERs in a
  row with no clip between (Green Thumb 2, Pumpkin Farmer 3). The narrow
  and growth classes are John's ("stacking them is hard!").
- **The celebration**: a gold glowing banner with the name and a short
  line ("5 perfects in a row") pops in for 1.8 s while sixteen coloured
  stars burst out, spin and fade, "like the stars a gamer might collect
  in a Mario game ... pop like fireworks". The moon goes wide-eyed. Two
  earned on one drop show one after the other. Play is never stopped. A
  celebration still running at the miss is cut.
- **The end screen lists the round's milestones**, the top one of each
  class only (a 24 stack shows Haunted House, not Hoop Height too), as
  plain gold names with no border ("just the word alone looked great"),
  and no "Tap one" ("players will naturally do that"). A tap (hover,
  with a mouse) opens a bubble above the name with a sentence or two
  ("you have a lot of room ... to actually describe the milestone");
  Ghost Whisperer's does not give away "every seventh": "let them figure
  that out".
- **The names sit on a fixed 3×3 grid** (John, 18:30), placed by a table
  so the same number of milestones always lands in the same spots: one
  in the centre, two top and bottom of the middle column, three on the
  diagonal, four in the corners, five an X, six the two outer columns,
  seven adds the centre, eight all but the centre, nine all. Each name
  is slanted 15° anticlockwise ("that would look fine i think"), and
  the font is a touch under text-small so the widest name (Eye of the
  Needle) sits in a 30vw cell with air on both sides. No star before
  the name any more; the gold and the slant do that job.
- **The end screen's top is laid out around the moon** (John, 18:30):
  the big word (LEGENDARY, OOF) centred in the strip above the moon;
  "You stacked / 23 / pumpkins!" in three lines, the number large, to the
  moon's left; the comparison line, the grid and Stack again below.
  John's notes on the first try (his "bad layout.png" in `design ideas/`,
  taken while the moon still drifted): the word midway between the top
  rule and the moon; the count directly left of the moon; the comparison
  centred a bit below the moon; the heading just "Milestones", with
  space above; tighter grid rows, moved down; the button moved down
  "but have plenty of breathing room above the bottom" (it sits at the
  bottom of the screen above 12vw of padding).
- **No running count in the bar** (John, 20:20: "now that we have that
  counter we no longer need the Stacked 56 up in the title bar"). The
  bar is toggle and Best. **A new best glows**: when a round passes an
  earlier best this visit, the Best number turns gold and pulses from
  the end screen until the next round starts ("only after that round i
  mean - not forever!"). The first round of a visit sets the best
  without beating one, so it does not glow.
- **The count pops off every landed pumpkin** (John, 19:55: "a # STACKED
  badge to the top of the current pumpkin that flys up and away, and
  fades away ... quickly gets out of the way"): the new count in bold
  white on the slab's top edge, a quick swell, then up 18vw and gone in
  0.7 s. It rides the camera with the slab. Reduced motion: it fades in
  place.
- **A goal line on the start screen** halfway between the three lines
  and "Tap anywhere to start" (John, 19:55): "SHARP EYE:
  five perfects in a row", a random milestone every few seconds, stopped
  by the first tap. John's idea was the moon saying these in a speech
  bubble; built, tried on the phone, and dropped the same hour ("that
  does not really work"). The hints became the quiet line instead.
- **The end word** is one of five from the band the count reached (0,
  1–5, 6–10, 11–19, 20–34, 35+: WHIFF / SPLAT / TUMBLE! / TIMBER! / SKY
  HIGH! / GO OUTSIDE. are one from each), the same word flashing at the
  miss; "what is wrong with a longer list ... players love that sort of
  thing". It was WHIFF / SPLAT / TIMBER before.
- **The moon never moves**: "it should be in the same spot in the game,
  the starting screen, and the finish screen. it is an anchor point of
  the game design." A 1.3× grow at game over was tried and dropped, and
  the original slow drift down with the camera (12% of the tower's
  scroll, for depth) went the same day, once John's screenshot showed
  the end screen laid out against a moon that was somewhere else. It
  Its spot, since 19:10, is the one John liked in that screenshot: 24vw
  across, 8vw from the right, 26vw down (it was 9vw down). Everything
  else made room: during play the reaction word (PERFECT! and its
  badges) now flashes in the strip above the moon and the milestone
  banner pops just under it, with the tower held a little lower (36%)
  so the flying slab passes beneath the banner; the start screen's text
  begins below the moon, as the end screen's does. It
  sits above the dimmed overlays so it is always bright, and on the end screen
  gives a verdict on the whole round: wide-eyed at 20+, a smile at 10+, a
  flat line at 4+, sad only below that. "It really has to be a bad
  performance for the moon to be sad." The big word and the count keep
  it company either side; the rest of the end screen starts below it.
- Nothing is remembered between rounds: "a light and fun game, not a
  technology demo." No trophy cabinet.

## 4. Not built, and why

John's list of 2026-10-16 20:40, in his order, comes first:

1. **Fewer milestones on the end screen, larger**: "reduce it to show
   five at the max, and the milestone grid text needs to be larger". The
   3×3 grid and its placement table want a five-slot rethink (perhaps a
   2 + 3 or 3 + 2 arrangement, or the placement table cut at five); the
   set of nineteen "may adjust" too.
2. **More variety in the moon's face, "especially at the end screen"**:
   today it has four faces (wow, happy, meh, sad) and the end screen
   picks one by the count.
3. **Sound** (below).

- **Sound** (John's suggestion 3 of the afternoon: a bass click on the
  wall, a kerthunk on landing, a celebratory ding): the next step. The
  plan is to synthesise with the browser's audio API, no files, a speaker
  toggle in the info bar, swap any sound for an MP3 of John's if it
  disappoints. The celebration (`celebrateNext`) and the drop are the
  places.
- **Feedback against the high score list at game over** ("Oh so close...
  that almost made the high scores list!"): not built yet. The game would
  need to read the shell's saved list, which the helper does not offer;
  the clean way is a second helper call (`Halloween.savedScores()`), a
  shell change. Keep it light and positive when built.
- **More milestone classes** Claude offered and John did not pick (yet):
  close calls (Cliffhanger), recovery (Shake It Off, Phoenix, Full Width),
  consistency (Steady Hand, Clean Sweep), speed (Top Gear, Hot Hands),
  Ghost Hunter, mode (Iron Will, Switch Hitter), Window Shopper.
