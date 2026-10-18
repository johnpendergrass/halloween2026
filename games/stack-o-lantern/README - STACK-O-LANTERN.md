# Stack o' Lantern

A one-tap stacking game. Pumpkin slabs slide across the night sky; tap to
drop each one onto the tower. Whatever hangs over the edge is sliced off
and tumbles away, so every sloppy drop makes the tower narrower, until a
slab misses completely. A drop within a hair of perfect keeps the full
width, and three perfects in a row grow the slab back a little. The moon
watches and reacts. Milestones pop up as you climb, and the end screen
names the height you reached, from Scarecrow to Moon Landing, with your
three best milestones under it.

- **Made by:** Claude Code (Claude Fable 5.1), 2026-09-29, at John's
  invitation to design a game of its own; reworked with John through
  2026-10-16 and 2026-10-17.
- **Name:** "Stack o' Lantern" since 2026-10-17 (it was Stack-o'-Lantern);
  the folder stays `stack-o-lantern`.
- **Status:** playable and checked, with sound, an end-screen
  celebration, a gentler ramp, three big rungs with fireworks and a
  practice level (2026-10-18 12:14); the floor at 0.65 s, practice rounds
  count as CHEAT in the app's list (2026-10-18 13:04); the speaker's hit box
  three times its picture (13:24).
- **The rules** every game follows are in
  [`../README - game design requirements.md`](../README%20-%20game%20design%20requirements.md).

## Files

```text
index.html                 the stage (the high score corner, stars, moon, ground, tower), start and end screens
stack-o-lantern.css        page setup and text classes (copied from the requirements), then the game's own styles
stack-o-lantern.js         the game: settings, the milestone table, state, slabs, taps, camera, end screen
sound.js                   the speaker switch and every sound, made in code (Web Audio): the landings, the rungs, three fanfares, the firework pop; loaded before the game script
assets/stack.svg           the icon for the app's picker (256 x 256, square viewBox)
assets/speaker.png         the speaker switch's picture (Go Fish's woofer at 160px)
_documents/milestones.md            every milestone, its height or count and its words, as tables (a reading copy of the script's table)
_documents/claude-john-docs/        the design and technical records
_documents/checks/                  Playwright checks (see the technical spec, section 6)
README - STACK-O-LANTERN.md  this file
```

## How it plays

1. First tap anywhere starts. The base slab sits on the ground, 46vw wide.
2. A slab as wide as the top one slides in from alternate sides, 1.8 slab
   heights above the tower, bouncing between the edges. Tap to drop.
3. **Perfect** (edges within 1.6vw): snaps into line, full width kept.
   Every third perfect in a row grows the slab 3vw wider, up to the
   starting width ("WIDER!"), and only while it is narrower than that.
4. **Partial**: the overlap becomes the new slab, the overhang falls off
   the side it hung over. A word rates it by how much survived: nice
   (90%+), close one (70%+), yikes (45%+), oof.
5. **Miss** (less than 0.8vw overlap): the whole slab tumbles and TIMBER!
   flashes (from 5 pumpkins up; below that one of the little words:
   SPLAT, THUD, OOF, CRUNCH, WELL THEN, or WHIFF, NOPE, AIR BALL, OOPS,
   NOTHING at 0).
6. Speed starts at 42vw/s and multiplies by 1.035 per slab, capped at 110.
7. As each pumpkin lands, its count ("12") pops off the top of it, flies
   up and fades in under a second. That is the only running count.
8. The camera keeps the tower top at 36% of the stage height, easing
   there. Stars move less than the tower, for depth; the moon never
   moves: the same spot on every screen, the anchor of the layout.
9. Every 7th slab is a pale "ghost pumpkin"; the others cycle six oranges.
10. **Milestones** (John, 2026-10-16 to 2026-10-18), 51 of them in four
    families, each earned once per round and celebrated with a gold
    banner and a burst of 16 stars (one banner at a time; when a run
    earns a pile, only the most recent waits, the rest expire unshown):
    - **Height**, 24 rungs, every five pumpkins to 100 then the sky:
      Scarecrow 5, Hoop Height 10, Giraffe 15, Haunted House 20,
      Treetops 25, Tower of Pisa 30, Notre Dame 35, Sequoia 40, Liberty
      45, Space Needle 50, Eiffel Tower 55, Empire State 60, Shanghai
      Tower 65, Burj Khalifa 70, Vesuvius 75, Fuji 80, Rainier 85,
      Kilimanjaro 90, Denali 95, Everest 100, Stratosphere 125, Space
      Station 150, Hubble 175, Moon Landing 200 (the full list with every
      line is `_documents/milestones.md`). Space Needle, Everest and
      Moon Landing are BIG rungs: a longer, louder ring and fireworks
      from behind the moon mid-round (two, eight and eight).
    - **Accuracy**: Machine / Laser / Sharp Eye (20 / 10 / 5 perfects in
      a row), Toothpick / Pencil Pusher (3 in a row / 1 on a pencil
      pumpkin, an eighth of the start width or less), Eye of the Needle
      / Needle (6 / 3 in a row on a tiny one, a quarter or less), High
      Wire / Tightrope (10 / 5 in a row on a small one, half or less),
      Ghost Whisperer (a perfect on a ghost pumpkin).
    - **Growth**: Bumper Crop / Pumpkin Farmer / Green Thumb / Sprout
      (5 / 3 / 2 / 1 WIDERs in a row; a clip resets, a plain perfect
      does not).
    - **Bounce** (no-bounce = tapped before the pumpkin touched a wall):
      Supersonic / Tornado / Wildfire / Lightning / Gunslinger / Quick
      Draw (100 / 50 / 30 / 20 / 10 / 5 no-bounce drops in a row),
      Desperado / Outlaw / Dead Eye / Sharpshooter (20 / 10 / 6 / 3
      no-bounce perfects in a row), Trick Shot (3 no-bounce perfects on
      small ones), No Look / Blindfold (3 in a row / 1 no-bounce landing
      on a tiny one).
    Within a family the list is ranked, rarest first. The word *perfect*
    is in italics wherever a milestone shows it. While the start screen
    waits, a quiet **goal line** names one to go for, changing every few
    seconds.
11. **The end screen**: the level reached as the framed title (GIRAFFE),
    "You stacked / 17 / pumpkins!" beside the moon, the level's line in
    italics ("Eye to eye with the tallest animal alive. It blinked
    first."), then "You earned..." and up to three names, the best of
    accuracy, growth and bounce, stepping down to the right like a
    staircase. Tap a name (hover, with a mouse) for a sentence about it.
    Under 5 pumpkins there is no level: a little word is the title and
    one of four old lines sits under the count. The moon gives its
    verdict (wide-eyed at 20+, a smile at 10+, flat at 4+, sad below)
    and glows softly, as it does on the start screen. After a minute
    with no tap the welcome screen comes back; any tap on the end
    screen starts the minute over.
12. **High score** sits in the top right corner. It starts from the
    app's saved list for this game (see below), then follows this
    visit's best. A round that beats it lights the number gold and shows
    a NEW HIGH SCORE! balloon beside it until the next round starts.
13. One level. (An EASY / HARD toggle in an info bar above the stage
    lived for one day, 2026-10-16; these are its HARD rules and look.)

## How it is built

- **Every number in stack-o-lantern.js is in vw.** Positions are written into
  `style.left/bottom/width` as `"Nvw"` strings, so the browser does the
  pixel maths and a resize costs nothing. The slab height and the ground
  height are CSS variables (`--slab-h`, `--ground-h`) read once by JS, so
  CSS and JS cannot disagree.
- **World vs camera.** Slab positions are world coordinates (y up from
  the stage's bottom). The camera is a single `translateY` on the tower
  container, so placed slabs are positioned once and never touched again.
- `requestAnimationFrame` loop; `dt` capped at 0.05 s so a sleeping tab
  does not fling the falling pieces away when it wakes.
- Reaction words restart their CSS animation with the reflow trick
  (`void element.offsetWidth` between removing and adding the class).
- The moon's face is one `.mouth` element whose border and radius change
  by class: smile, "o", flat line, frown.
- Taps use `pointerdown` on the stage (instant). Space/Enter also work on
  a keyboard, as an extra.
- No images: slabs are CSS (colour variable, repeating-gradient ribs,
  inset shadows, a `::before` stem), stars are two repeating radial
  gradients, the moon is a circle.
- The milestone table in the script is the source; `_documents/milestones.md`
  lists the same 51 as tables. The order within a family is the rank. Each
  entry says whether its banner rings (`sound`) and at which note (`pitch`).
- Sounds are tones made in code in `sound.js`, named in a table: tick,
  perfect, wider, soft, thunk, miss, start, milestone. The game script only
  calls `playSound("name")` at the landing. Every sound starts at full
  strength on the frame of its event and fades from there. The speaker in
  the top left corner mutes them; the choice is remembered on the device.
- **The end screen celebrates** (John, 2026-10-17). The shell's
  `reportScore` hands back the score's place in its five-line list, so
  the game ranks the round: a NEW BEST gets the gold balloon, a fanfare of
  three climbing arpeggios and 16 fireworks; a TOP FIVE the green balloon,
  a four-note fanfare and 12; every other round of 5 or more a two-note
  "ta-daa" and 6; under 5 nothing new. After the flurry the odd rocket
  keeps going at random until the next tap. Rockets rise from behind the
  moon and burst over the words (`startFireworks`, `FIREWORK_SHOWS`).
- **The ramp** (John, 2026-10-17) is a table of seconds per crossing in
  the script: 2.4 s for the first slab, 0.0141 s less per pumpkin to 1.0
  s at 100, half as steep after, never under 0.65 s (`RAMP`,
  `crossingFor`). The next slab always slides the opposite way to the one
  just dropped.
- **Practice** (John, 2026-10-17): the base on the welcome screen reads
  "Level 1"; tap it for the Practice start panel (1, then every ten to
  200). A round from a higher level counts from there at that level's
  speed and rings no rung below it. It scores like any other round and
  gets the same celebration, but the app's list says CHEAT after the
  level name (2026-10-18; before that practice rounds were not scored). Stack again returns to the welcome screen, where the
  level is in view. The pick lasts the visit: every launch starts at 1.
- The base is pumpkin 1: the first drop reads 2.

## Where this game breaks the requirements, and why

Nowhere that I know of. Checked against 2.4: page setup copied as is;
every size in vw (px only as `max()` floors in the text classes and 2px
lines); the whole stage is the tap target; the Stack again button is
13vw tall; all text uses the three classes; Arial; colours contrast
(white text with the `.text-on-art` shadow over the sky; ink face on the
pale moon); no localStorage, no postMessage, nothing loaded from outside
the folder except the app's own `../game-helper.js`. Checked with
Playwright at 390 x 650 (about the shell's 9:15 panel) and inside the
shell itself.

## Talks to the app?

Yes, two things, both through `../game-helper.js` (included before the
game's own script):

- At game over, `Halloween.reportScore(count, undefined, [level])`: the
  count with the level's name as the note, so the app's list reads
  "16 (10-17-2026) Giraffe". A count of 0 is not recorded. Under 5
  there is no level and no note.
- At start-up, `Halloween.bestScore()`: the app's top saved score for
  this game, which seeds the High score corner, so the corner and the
  THIS GAME list agree. When the app's list is cleared, the app loads
  the game again, so the corner starts over too.

Opened on its own, outside the app, both calls do nothing (the score is
not saved; the high score starts at 0), so the game still runs standalone.

The game declares no switches in games.json (`settings: []`).

## Pause

None (John's decision, 2026-10-01). The app does not pause a game when
its bottom panel opens, and a game cannot tell that it opened; pausing is
each game's own job (rule 18). This game has no pause of its own, so the
pumpkin keeps sliding behind an open panel. A round is short, and a tap
on the panel does not drop the pumpkin.
