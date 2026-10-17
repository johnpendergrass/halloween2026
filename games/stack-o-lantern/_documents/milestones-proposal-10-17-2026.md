# Stack-o'-Lantern milestones: three families, ranked (proposal, 2026-10-17)

Claude's first cut at John's idea of 2026-10-17: the end screen shows at
most THREE milestones, one from each of three families, the
highest-ranked one earned in that round. Every milestone still pops its
banner during play and still appears in the start screen's goal line;
only the end screen is capped. Nothing here is built yet. The current
nineteen are in `milestones-asof-10-17-2026.md` beside this.

Rank is a fixed number per milestone, set by hand, roughly "how much
skill this takes". It only has to order milestones WITHIN a family,
because the end screen never compares across families.

Words: **perfect** = edge within the tolerance (1.6vw HARD; EASY widens
with the count); **clip** = a non-perfect landing, overhang sliced off;
**clean** = tapped before the pumpkin touched a wall (its first pass);
**WIDER** = every third perfect in a row grows the slab 3vw back;
starting width 46vw, half 23vw, quarter (a "needle") 11.5vw, eighth (a
"pencil") 5.75vw.

---



## Family 1: HEIGHT (10 tiers, one earned per band, every round has one from 5 up)

Not streaks. The count of landed pumpkins at the moment the band is
reached, so a long round pops each banner in turn. The end screen shows
the highest band reached. A round under 5 earns no height milestone (the
moon is already sad; a badge for 2 pumpkins would be a joke at the
player's expense).


| Rank | Name               | Band    | Banner line       | Line (the end screen's comparison line)                                                                              | Hint (goal line)           |
| ---- | ------------------ | ------- | ----------------- | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| 10 | **Moon Landing** | 200+ | 200 pumpkins high | You reached the moon. It would like you to stop now. | two hundred pumpkins high |
| 9 | **Burj Khalifa** | 100–199 | 100 pumpkins high | Taller than the Burj Khalifa. The clouds are below you. | a hundred pumpkins high |
| 8 | **Shanghai Tower** | 75–99 | 75 pumpkins high | Shanghai Tower tall. Tourists are staring at a pumpkin. | seventy-five pumpkins high |
| 7 | **Empire State** | 50–74 | 50 pumpkins high | Empire State tall. The view is iconic. | fifty pumpkins high |
| 6 | **Notre Dame** | 35–49 | 35 pumpkins high | Taller than Notre Dame. The gargoyles are worried. | thirty-five pumpkins high |
| 5 | **Haunted House** | 25–34 | 25 pumpkins high | Two storeys of haunted house. The ghosts look up at you. | twenty-five pumpkins high |
| 4 | **Treetops** | 20–24 | 20 pumpkins high | Up in the treetops with the owls. They are not impressed. | twenty pumpkins high |
| 3 | **Giraffe** | 15–19 | 15 pumpkins high | Eye to eye with a giraffe. It blinked first. | fifteen pumpkins high |
| 2 | **Hoop Height** | 10–14 | 10 pumpkins high | Basketball hoop high. Wembanyama can barely reach the top. | ten pumpkins high |
| 1 | **Scarecrow** | 5–9 | 5 pumpkins high | As tall as the scarecrow. The crows are watching. | five pumpkins high |


Decided (John, 2026-10-17): **the height milestone IS the comparison
line.** The end screen's italic line under the count shows the Line of
the highest band reached, and the height family is NOT one of the
named milestones listed below it. Each Line is kept under ~60
characters (two lines of text-medium italic on a phone; "Taller than a
giraffe. It looked down on you anyway." is 52), and none repeats the
number, since the count sits right above. Under 5 pumpkins the old
`COMPARISONS` lines for 0, 1, 2 and 4 still have to say something;
keep those four (one set, or EASY / HARD as now).

Things to decide:

- **EASY / HARD flavours.** Today the comparison line has two versions
  per step. One Line per band loses that. Keep one, or give each band a
  HARD variant with an edge?
- **Two names or three?** With height moved into the comparison line,
  the named list below it has two families, ACCURACY and BOUNCE. Two
  names, or three with a rule for the third (the next-best from either
  family)?
- John's first band was "under 10". Claude split it at 5 (Scarecrow) so
a round of 5 to 9 gets a name and a round under 5 gets none.
- Ten banners in a 200 round is a lot of gold. They arrive 5, 10, 15,
20, 25, 35, 50, 75, 100, 200: closer together early, when the player
needs the encouragement, far apart later.

---



## Family 2: ACCURACY (where the tap lands: perfects, narrow slabs, growing back)

The existing perfect, small, tiny, pencil, growth, comeback and ghost
classes, in one ranked list. Rarest first.


| Rank | Name                  | Earned at                                                       | Today? | Banner line                       | Tip                                                                                                        |
| ---- | --------------------- | --------------------------------------------------------------- | ------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 13   | **Machine**           | 20 perfects in a row                                            | yes    | 20 perfects in a row              | Twenty perfect drops in a row. Are you even a person?                                                      |
| 12   | **Toothpick**         | 3 landings in a row on pencils (≤ 5.75vw)                       | yes    | 3 in a row on a pencil pumpkin    | Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you?          |
| 11   | **Eye of the Needle** | 6 landings in a row on needles (≤ 11.5vw)                       | yes    | 6 in a row on a quarter-size slab | Six landings in a row on a slab a quarter of the starting width or less. How?                              |
| 10   | **Pumpkin Farmer**    | 3 WIDERs with no clip between (9 perfects from a clipped tower) | yes    | 3 WIDERs with no clip between     | Three WIDER growths in a row without a clipped drop in between. That is nine perfects.                     |
| 9    | **Laser**             | 10 perfects in a row                                            | yes    | 10 perfects in a row              | Ten perfect drops in a row. The moon stopped blinking somewhere around seven.                              |
| 8    | **High Wire**         | 10 landings in a row on half-size (≤ 23vw)                      | yes    | 10 in a row on a half-size slab   | Ten landings in a row on a slab no more than half the starting width. No net.                              |
| 7    | **Needle**            | 3 landings in a row on needles                                  | yes    | 3 in a row on a quarter-size slab | Three landings in a row on a slab a quarter of the starting width or less. Threading it.                   |
| 6    | **Green Thumb**       | 2 WIDERs with no clip between (6 perfects)                      | yes    | 2 WIDERs with no clip between     | Two WIDER growths in a row without a clipped drop in between. The pumpkin is coming back.                  |
| 5    | **Pencil Pusher**     | 1 landing on a pencil                                           | yes    | landed on a pencil pumpkin        | A landing on a pencil pumpkin, a slab an eighth of the starting width or less. Stacking those is hard.     |
| 4    | **Comeback**          | a WIDER from under half width                                   | yes    | grew back from under half width   | The tower had shrunk to less than half its width, and three perfects in a row grew it back. Never give up. |
| 3    | **Sharp Eye**         | 5 perfects in a row                                             | yes    | 5 perfects in a row               | Five perfect drops in a row. Every edge lined up within a hair.                                            |
| 2    | **Tightrope**         | 5 landings in a row on small pumpkin.                           | yes    | 5 in a row on a half-size slab    | Five landings in a row on a small pumpkin. Steady.                                                         |
| 1    | **Ghost Whisperer**   | a perfect on a ghost pumpkin.                                   | yes    | a perfect on a ghost pumpkin      | A perfect drop on a ghost pumpkin, the pale one. When does it come? Watch.                                 |


Things to decide:

- **Green Thumb and Pumpkin Farmer** are six and nine perfects in a row
by another name, and always arrive with Sharp Eye and Laser. With one
slot per family they can never both show with their twins, so the
overlap no longer clutters the end screen; it only doubles the
banners mid-round. Keep them if the "growing back" story is worth two
more banners; cut them if not. Comeback is the one with its own story
and should stay either way.
- Pencil Pusher (one landing on a 5.75vw slab) is partly luck; it is
ranked below Green Thumb for that reason.
- Ghost Whisperer is the easiest here (one perfect, on a slab that comes
every seventh) and sits at the bottom, so it shows only in a round
that earned nothing harder. That seems right: it is a nice surprise
for a beginner.

NOTE small pumpkin means a pumpkin 1/2 or less in size.

NOTE tiny pumpkin means a pumpkin 1/4 or less in size.



---



## Family 3: BOUNCE (tapping on the first pass: no wall touched)

The existing clean class plus John's four ideas, named in the Quick Draw
/ Gunslinger spirit. Six of these are new. Rarest first.


| Rank | Name             | Earned at                                             | Today? | Banner line                 | Tip                                                                                                                | Hint                                                  |
| ---- | ---------------- | ----------------------------------------------------- | ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| 9    | **Outlaw**       | 10 clean perfects in a row                            | new    | 10 perfects, no bounce      | Ten perfect drops in a row, every one tapped before the pumpkin reached a wall. Wanted in three counties.          | ten perfects in a row with no bounce                  |
| 8    | **Lightning**    | 20 clean drops in a row                               | yes    | 20 drops, no bounce         | Twenty drops in a row without a bounce. The pumpkins never saw the walls.                                          | twenty drops in a row with no bounce                  |
| 7    | **No Look**      | 3 clean landings in a row on needles (≤ 11.5vw)       | new    | 3 needles, no bounce        | Three landings in a row on quarter-size slabs, each tapped on the first pass. You were not even looking, were you. | three in a row on needles with no bounce              |
| 6    | **Dead Eye**     | 6 clean perfects in a row                             | new    | 6 perfects, no bounce       | Six perfect drops in a row with no bounce. First pass, every time.                                                 | six perfects in a row with no bounce                  |
| 5    | **Gunslinger**   | 10 clean drops in a row                               | yes    | 10 drops, no bounce         | Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch.                                 | ten drops in a row with no bounce                     |
| 4    | **Trick Shot**   | 3 clean perfects in a row on half-size slabs (≤ 23vw) | new    | 3 small perfects, no bounce | Three perfect drops in a row on half-size slabs, none of them bounced. Hold the applause.                          | three perfects on small slabs with no bounce          |
| 3    | **Blindfold**    | 1 clean landing on a needle                           | new    | a needle, no bounce         | A landing on a quarter-size slab, tapped before the pumpkin touched a wall. Blindfolded, presumably.               | land on a needle with no bounce                       |
| 2    | **Sharpshooter** | 3 clean perfects in a row                             | new    | 3 perfects, no bounce       | Three perfect drops in a row, each on the first pass. Quick and right.                                             | three perfects in a row with no bounce                |
| 1    | **Quick Draw**   | 5 clean drops in a row                                | yes    | 5 drops, no bounce          | Five drops in a row made before the pumpkin ever touched a wall. No dithering.                                     | five drops in a row before the pumpkin touches a wall |


Things to decide:

- **Outlaw above Lightning?** Ten clean perfects means hitting a 1.6vw
window on a single pass ten times running. Twenty clean drops can be
sloppy, but twenty sloppy drops narrow the tower to nothing, so they
must be fairly accurate too. Claude put Outlaw first; a coin flip.
- Nine is a lot for one family. If it should be shorter, drop Blindfold
(one lucky tap) and Trick Shot first.
- Counting these needs three new streak counters (clean perfects, clean
perfects on half-size, clean landings on needles). Each is the same
shape as today's: +1 on a landing that qualifies, 0 on one that does
not.

---



## The end screen

Three slots, in a fixed order so the player learns to read them: HEIGHT,
ACCURACY, BOUNCE. Each shows the family's highest-ranked milestone
earned this round, or stays empty. Fixed slots mean a round with only
Scarecrow shows one name; a strong round shows three. With three names
instead of nine the text can be much larger (John: "the milestone grid
text needs to be larger"); the layout itself is a later step, laid out
against the moon's fixed spot.

## What changes in the code, when built

- `MILESTONES` entries gain `family` ("height" / "accuracy" / "bounce")
and `rank` (an integer, higher = rarer). `kind` stays for the
counters.
- `topMilestones()` becomes "highest rank per family" instead of
"highest `at` per kind".
- Ten height entries replace three; six new bounce entries; three new
counters in `state` and `drop()`.
- `fillMilestoneGrid` and `GRID_PATTERNS` go; a three-slot row or column
replaces them.
- The Playwright checks for the end grid and milestones need updating.

