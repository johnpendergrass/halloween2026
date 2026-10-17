# Stack o' Lantern — Specifications (design decisions)

Last updated: 2026-10-17 14:41 (/update; SECTION 6: sound, the base is pumpkin 1, a rung jumps the banner queue, the shell's Settings button. 12:21: SECTION 5 IS THE CURRENT DESIGN: milestone families, the level as the title, one level, no info bar, the corner, the staircase, the minute, the shell reading back scores. Sections 1 to 4 are the 2026-09-29 and 2026-10-16 record; section 2 (EASY / HARD) and the 3x3 grid in section 3 are history now. Earlier: 2026-10-16 20:45 /update; 20:20 no Stacked count in the bar, Best glows on a new best; 19:55 count pops off each pumpkin; 19:10 the moon fixed at one spot; 18:30 the end screen laid out around the moon; 17:15 first file in the game's own folder)

The game is called **Stack o' Lantern** since 2026-10-17 (it was
"Stack-o'-Lantern"; the folder stays `stack-o-lantern`).

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

## 2. EASY / HARD (John, 2026-10-16) — GONE 2026-10-17 (see 5.4)

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

## 5. 2026-10-17: families, one level, the whole screen (John and Claude)

Items 1 and 2 of John's list of 2026-10-16 (fewer, larger milestones on
the end screen; the moon faces) turned into a day's rework. Sound is
still next. The height ladder grew from 10 to 24 rungs at 13:30 (every five pumpkins
to 100 with Pisa, Sequoia, Liberty, Big Ben, Space Needle, Chrysler and
Eiffel among the buildings, then the mountains Vesuvius, Fuji,
Kilimanjaro and Everest at 85 to 100; Stratosphere, Space Station and
Hubble at 125 / 150 / 175; the Moon at 200 (Canton Tower, Taipei 101
and Petronas were in for an hour and cut as "eliminate these");
John's rules: taller things later, a shortened title carries its full
name in its line, most lines mention the pumpkin tower, and a title
must fit the 9vw frame on one line, SHANGHAI TOWER being the widest).
The words of every milestone live in
the script's `MILESTONES` table; `_documents/milestones.md` lists them as
tables (John's three working papers of the morning were deleted at 12:40).

### 5.1 Four families, and a fixed rank

John's first idea was a rarity list kept in localStorage; Claude talked
him out of it (cold start, noise, drift, and "no trophy cabinet") in
favour of a FIXED RANK: within a family, the order of the table IS the
rank, rarest first, and the end screen shows the first earned entry of
each family. The families are John's: **HEIGHT** (ten levels, one per
band: Scarecrow 5, Hoop Height 10, Giraffe 15, Treetops 20, Haunted
House 25, Notre Dame 35, Empire State 50, Shanghai Tower 75, Burj
Khalifa 100, Moon Landing 200; a round under 5 earns none), **ACCURACY**
(where the tap lands: Machine, Toothpick, Eye of the Needle, Laser, High
Wire, Needle, Pencil Pusher, Sharp Eye, Tightrope, Ghost Whisperer),
**GROWTH** (WIDERs in a row, no width test: Bumper Crop 5, Pumpkin Farmer
3, Green Thumb 2, Sprout 1; Comeback went) and **BOUNCE** (no-bounce
drops: Desperado 20 no-bounce perfects, Supersonic 100, Tornado 50,
Outlaw 10 no-bounce perfects, Wildfire 30, Lightning 20, No Look 3 on
tiny, Dead Eye 6 no-bounce perfects, Gunslinger 10, Trick Shot 3
no-bounce perfects on small, Blindfold 1 on tiny, Sharpshooter 3
no-bounce perfects, Quick Draw 5). 37 in all. John's words: "clean" is
"no-bounce"; a SMALL pumpkin is half the start width or less, TINY a
quarter, PENCIL an eighth. The WIDER rule stays every third perfect
("to make it a meaningful reward"). The four top bounce tiers came last
("it is common to go 10.. 20.. 30 or more without allowing a bounce").
The word *perfect* is in italics wherever a milestone shows it.

### 5.2 The end screen

- **The level is the title and the line.** "the main title on the
  winning page should read the title of the height": GIRAFFE in a frame
  (orange border, green ring, "to jazz it up a bit"), "You stacked / 17
  / pumpkins!" beside the moon, and the level's LINE under it in
  italics, a pun on the title that never repeats its words ("The owls
  have a question. Who? You, apparently."). Under 5 pumpkins there is no
  level: the title is one of the low words (WHIFF, SPLAT, THUD...) and
  the line one of the four old HARD lines. The miss flash during play
  is just TIMBER! from 5 up ("i like just TIMBER!").
- **"You earned..."** at the left, then up to three names, the best of
  ACCURACY, GROWTH and BOUNCE in that order, in the space down to the
  button: one in the middle; two at a third and two thirds; three at
  26, 50 and 74 percent, STEPPING DOWN TO THE RIGHT like a staircase at
  the words' own 15 degrees ("Ghost Whisperer at the top left, Sprout in
  the middle, Sharpshooter at the bottom right. Like three angled lines,
  not one"). A third, a half and two thirds put long names on top of
  each other, so the outer two sit further out. The names are 4.8vw and
  as bold as Arial goes (John: "larger and bolder"; 5vw ran
  "Sharpshooter" off the edge). A tap or hover opens the tip bubble
  just above the letters.
- **After a minute with no tap** the end screen gives way to the welcome
  screen; any tap on it (a milestone name, anywhere) starts the minute
  over. The high score stays; the glow and the balloon go.

### 5.3 The whole screen, the corner, the moon

- **The info bar is gone** ("have the entire screen devoted to the
  game"). "High score 16" sits in the stage's top right corner, the
  label smaller than the number, room for three digits. A new best this
  visit lights the number gold and shows a **NEW HIGH SCORE!** balloon
  beside it (to the left, tail pointing at the number; first built under
  the number, then "a bit smaller ... the same text size as the High
  Score text").
- **The moon's spot**: with the bar gone, John wanted it "a bit higher
  ... to be aesthetic with the screen frame": up about a quarter of the
  bar's height, then the whole group (moon, title, count, line) up
  another quarter of the title's size, then the title alone the same
  again. The moon is at 34.75vw down, still the anchor for every screen.
- **The moon glows** softly on the start and end screens ("a subtle
  glow"), not during play.
- **The start screen**: the goal line dimmed ("more subdued"), "Tap
  anywhere to start" bigger and bold.
- **One counter**: the number popping off each landed pumpkin. The
  reaction word's streak badges (a star x3, a bolt x4, added the day
  before) read to John as a second pumpkin count and went.
- **The banner queue holds one**: a run of drops that earns a pile shows
  the one up and then only the most recent; the rest expire unshown
  ("a set of four or five showed when the pumpkin was just bouncing").

### 5.4 One level

"what do you think about just having one level ... the hard seems fine
as the only level to me." Claude agreed: the milestones now give a
beginner things to earn, and one level means scores that compare. HARD's
rules (1.6vw tolerance, x1.035 speed) and HARD's look (the near-black sky
with the ember horizon, the dark ground, the paler moon) are the game.
Gone: the toggle, the reminder pill, the mid-round flash, the remembered
mode, EASY's kinder end lines, the mode note on scores (old scores keep
theirs).

### 5.5 The shell, for this game

- The name shows as **Stack o' Lantern** in the top bar (the shell shows
  `short_title`, so it is the full name too), the THIS GAME tab, the
  game's own title and page title.
- Scores go to the shell as the count with **the level's name as the
  note**: "16 (10-17-2026) Giraffe".
- **The high score and the shell's list agree**: the game asks the shell
  for its top saved score when it loads (`Halloween.bestScore()`, the
  helper's second call, "one to tell, one to ask"), and Clear scores in
  the shell reloads the game so its corner starts over. Before this the
  corner started at 0 every load while the list kept last week's 23
  ("the high scores get out of sync").
- The THIS GAME text is six short centred lines in Go Fish's style
  ("too wordy ... shorter, lighter"), with bold words, TIMBER! in the
  milestone gold, and "The moon is judging you." as a shaded line.
- The Home icon is larger inside the unchanged bar.

---

## 6. 2026-10-17 afternoon: sound, the base is pumpkin 1, the rung jumps the queue (John and Claude)

### 6.1 The speaker switch

"a simple sound on/off switch ... on the top left (mirroring the high
score) ... a speaker icon like that used in the go fish game ... and
have a slash when muted. default will be on." So: Go Fish's woofer
photo, shrunk to 160px (`assets/speaker.png`), 8.5vw across, 2.5vw from
the top (1vw "crowded the top edge") and 3vw from the left, with "a
small whiteish glow ... just enough to set it off" from the dark sky.
Muted is Go Fish's red slash, drawn by CSS. A tap on it never reaches
the stage, so it cannot drop a pumpkin. The choice is remembered on the
device under the game's own key; the shell's Clear scores leaves it.

### 6.2 Calculated sounds, and the rule

John chose tones made in code over MP3 files ("i like your idea of just
using calculated sounds"), keeping open "an mp3 voice sound that would
play every time a new height is reached" for later. His rule: "the
sounds must be carefully calibrated to sound when the event occurs. so
not real lead in or ramping up." Every sound starts at full strength on
the frame of its event and fades from there.

Which event? "the tap on the phone for dropping a pumpkin is not the
same as when the pumpkin hits the stack. which should activate the
sound?" The landing. In this game the two are the same frame, because
the slab does not fall: the tap decides, the slab is placed, the squash
plays. John kept it that way ("keep it as it is now. it plays well"),
so the calls sit in the landing code and would move with a fall if one
is ever added.

### 6.3 The set

- **tick** off a wall: 25 ms, the quietest sound; it fires often late
  in a round.
- **perfect**: a bright tink, a high pure note with a fainter octave
  that dies first; **wider**: that tink and a higher one behind it.
- **soft** ("nice", "close one"): the duller tink, lower, wooden edge.
- **thunk** ("yikes", "oof"): a low falling note with a scrape of dull
  noise. The REACTIONS table names its sound beside its word.
- **miss** (TIMBER): two falling notes, "dee-dup", the second an
  octave down and hard on the first's heels (a crack-and-thud first
  draft "does not register well"; then "lower the pitch of the first,
  and shorten the delay of the 2nd note").
- **milestone**: a fast rising three-note arpeggio (root, major third,
  fifth, 70 ms apart, the last ringing on). Drafts: a two-note da-ding
  ("too much"), a single ding ("a bright cheery you did it sound"),
  then "a more celebratory 3 pitch fast arpeggio". It waits a tenth of
  a second so the landing's tink is heard first.
- **start**: one bright ding on the tap that starts a round, from the
  welcome screen or Stack again; the speaker plays the same ding when
  it flips on.

### 6.4 Only the rungs ring, each at its own pitch

"the pitch could increase as the level increases" became two fields on
every milestone, John's idea ("assign a celebratory pitch level in the
milestone table"; then "a sound yes/no column, and its pitch ... play
the sound if yes and be silent if no"): `sound` and `pitch`. Only the
24 HEIGHT rungs ring ("not as much sound clutter"); pitch is in
semitones above the lowest, 0 for a family's commonest milestone and 23
for its rarest, spread by rank, so the arpeggio climbs a semitone per
rung from Scarecrow to the Moon. The other families keep a pitch in
case. Both fields are in `_documents/milestones.md` too.

### 6.5 The base is pumpkin 1

John saw the rungs "off by one ... they show the height when 6, 11, etc
not 5, 10". Two things were true. The count did not include the base
and John's does ("in my mind it is already 1"): now the base is pumpkin
1, the first drop reads 2, Scarecrow comes on the fourth drop. The
under-5 words and lines moved up by one (a miss on the first drop is a
count of 1: WHIFF and friends; 2 to 4: SPLAT and friends; the lines run
1 to 4, "Two pumpkins. The patch is not impressed."). Old saved scores
are one lower than the same round scores now.

And the banner queue delayed rungs: a rung earned while another banner
was up waited its 1.8 s, or was pushed out unshown. Now a HEIGHT
milestone jumps the queue: its banner replaces whatever is showing and
its arpeggio plays on the frame of the landing; the others wait behind
it as before.

### 6.6 Waking the phone's audio

Generated sounds play on the first tap with no unlock step, because the
first sound is always asked for inside a tap. One WebKit rule showed on
John's phone: Safari counts the finger LIFTING as the tap that may start
audio, not the touch-down the game acts on, so the start ding came out
at the first wall tick. Every lift now wakes the audio clock too, and
the ding plays a blink after the tap. The phone's ring/silent switch
still mutes everything; nothing can change that.

### 6.7 The shell, for this game (afternoon)

- The credits line in the THIS GAME tab reads "Credits: v 0.19.2
  10/2026 claude/jp" (games.json).
- The top bar has a second button, ☰ on the right mirroring Home: Home
  opens the panel on GAMES, Settings on THIS GAME, the button whose tab
  is showing closes it. Recorded in the shell's own specs (3, 4, 6m).

### 6.8 Next (John, 2026-10-17 14:40)

1. Victory sounds (the end screen, a new high score).
2. The difficulty ramp: "it would be nice if the difficulty ramp was
   easier, so players could get to 50, 75 easily... it gets hard at
   around 25 or so". To talk through first.
