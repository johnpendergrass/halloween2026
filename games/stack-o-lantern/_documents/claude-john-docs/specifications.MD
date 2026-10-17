# Stack-o'-Lantern — Specifications (design decisions)

Last updated: 2026-10-16 17:15 (first file in the game's own folder: the 2026-09-29 design from the root spec's section 6f, then the 2026-10-16 afternoon of modes, milestones and banter)

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
  instantly; the camera keeps the tower top at 42% of the stage; the
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
- **The reminder**: the start screen names the mode in a line; a tap on
  the toggle shows the same line in a quiet pill just under it until the
  round starts (mid-round it leaves after 2.5 s). No border, dimmed text
  ("more subdued").
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
- **Nineteen milestones**, each once per round, in eight classes:
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
- **A goal line on the start screen** under the mode note: "SHARP EYE:
  five perfects in a row", a random milestone every few seconds, stopped
  by the first tap. John's idea was the moon saying these in a speech
  bubble; built, tried on the phone, and dropped the same hour ("that
  does not really work"). The hints became the quiet line instead.
- **The end word** is one of five from the band the count reached (0,
  1–5, 6–10, 11–19, 20–34, 35+: WHIFF. / SPLAT. / TUMBLE! / TIMBER! / SKY
  HIGH! / GO OUTSIDE. are one from each), the same word flashing at the
  miss; "what is wrong with a longer list ... players love that sort of
  thing". It was WHIFF / SPLAT / TIMBER before.
- **The moon** stays exactly where and how big it is during play ("that
  is a feature"; a 1.3× grow at game over was tried and dropped), sits
  above the dimmed overlays so it is always bright, and on the end screen
  gives a verdict on the whole round: wide-eyed at 20+, a smile at 10+, a
  flat line at 4+, sad only below that. "It really has to be a bad
  performance for the moon to be sad." The end screen's words start
  below it.
- Nothing is remembered between rounds: "a light and fun game, not a
  technology demo." No trophy cabinet.

## 4. Not built, and why

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
