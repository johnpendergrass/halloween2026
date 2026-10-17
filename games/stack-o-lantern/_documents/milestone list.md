# Stack-o'-Lantern milestone list (John's working copy, started 2026-10-17)

Rewritten 2026-10-17 (Claude, at John's request) with GROWTH as its own
family. This file is the current one; the proposal file beside it is
the earlier draft.

Four families. HEIGHT is shown as the end screen's italic comparison
line under the count (the highest band reached), not as a named
milestone. The three named milestones below it are the highest-ranked
one earned in ACCURACY, in GROWTH and in BOUNCE, each in its own slot,
left empty when nothing in that family was earned. Every milestone
still pops its banner during play and appears in the start screen's
goal line.

Edit anything: names, criteria, the lines. Each milestone is one block:

```
NAME         the name shown on the banner (and, for ACCURACY, GROWTH
             and BOUNCE, on the end screen)
CRITERIA     what earns it (the rule the code will check)
BANNER       the short line under the name on the mid-round banner
LINE         HEIGHT only: the end screen's comparison line; keep it
             under ~60 characters (two lines on a phone) and do not
             repeat the number, the count is right above it
TIP          ACCURACY, GROWTH and BOUNCE: the end-screen bubble
HINT         the start screen's goal line, after "NAME: " (lower case,
             no full stop)

In displayed text (BANNER, TIP, HINT, LINE) the word *perfect* /
*perfects* is shown in italics (John, 2026-10-17); *...* marks it here.
```

Within a family the list runs rarest (top) to commonest (bottom). The
order IS the rank, so to re-rank one, move its block.

Words: perfect = edge within the tolerance; clip = a non-perfect
landing, the overhang sliced off; no-bounce = tapped before the
pumpkin touched a wall (first pass); starting width 46vw. A SMALL pumpkin is
half the starting width or less (23vw); a TINY pumpkin (a "needle") is
a quarter or less (11.5vw); a PENCIL pumpkin is an eighth or less
(5.75vw).

WIDER: every THIRD perfect in a row (the 3rd, 6th, 9th...) grows the
slab 3vw back toward the starting width, and only while the slab is
narrower than that. A perfect at full width is just a perfect. Decided
2026-10-17: the rule stays every third, so a WIDER is a reward, not a
given. A plain perfect leaves a growth streak alone; only a clip
resets it.

# ======================================================================

FAMILY 1: HEIGHT (the comparison line)

One per band, earned when the count reaches the band. A round under 5
earns none; the old lines for 0, 1, 2 and 4 pumpkins stay for those.

On the end screen the NAME is the big title (GIRAFFE, HAUNTED HOUSE) and
the LINE is the italic line under the count (John, 2026-10-17). Under 5
there is no level: the title is one of the low words (WHIFF, SPLAT...)
and the line one of the four old ones. The word that flashes at the
miss itself is TIMBER! from 5 up, or one of the low words. A LINE must
not repeat its title's words; it puns on the title or the height.

NAME      Moon Landing
CRITERIA  200 pumpkins high
BANNER    200 pumpkins high
LINE      Houston, we have a tower. Please come down now.
HINT      two hundred pumpkins high

NAME      Burj Khalifa
CRITERIA  100 pumpkins high
BANNER    100 pumpkins high
LINE      Dubai called. They want their skyline back.
HINT      a hundred pumpkins high

NAME      Shanghai Tower
CRITERIA  75 pumpkins high
BANNER    75 pumpkins high
LINE      Tourists on the top floor are staring at a pumpkin.
HINT      seventy-five pumpkins high

NAME      Empire State
CRITERIA  50 pumpkins high
BANNER    50 pumpkins high
LINE      King Kong wants to climb it. Tell him to get in line.
HINT      fifty pumpkins high

NAME      Notre Dame
CRITERIA  35 pumpkins high
BANNER    35 pumpkins high
LINE      The gargoyles are worried. The hunchback is impressed.
HINT      thirty-five pumpkins high

NAME      Haunted House
CRITERIA  25 pumpkins high
BANNER    25 pumpkins high
LINE      Two storeys up. The ghosts have to look up at you for once.
HINT      twenty-five pumpkins high

NAME      Treetops
CRITERIA  20 pumpkins high
BANNER    20 pumpkins high
LINE      The owls have a question. Who? You, apparently.
HINT      twenty pumpkins high

NAME      Giraffe
CRITERIA  15 pumpkins high
BANNER    15 pumpkins high
LINE      Eye to eye with the tallest animal alive. It blinked first.
HINT      fifteen pumpkins high

NAME      Hoop Height
CRITERIA  10 pumpkins high
BANNER    10 pumpkins high
LINE      Wembanyama can barely reach the top. Nothing but net.
HINT      ten pumpkins high

NAME      Scarecrow
CRITERIA  5 pumpkins high
BANNER    5 pumpkins high
LINE      The crows are watching. Nobody is scared yet.
HINT      five pumpkins high

# ======================================================================

FAMILY 2: ACCURACY

Where the tap lands: perfects and narrow slabs. Streaks reset on the
first landing that does not qualify.

NAME      Machine
CRITERIA  20 perfects in a row
BANNER    20 *perfects* in a row
TIP       Twenty *perfect* drops in a row. Are you even a person?
HINT      twenty *perfects* in a row

NAME      Toothpick
CRITERIA  3 landings in a row on pencil pumpkins
BANNER    3 in a row on a pencil pumpkin
TIP       Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you?
HINT      three in a row on pencil-thin pumpkins

NAME      Eye of the Needle
CRITERIA  6 landings in a row on tiny pumpkins
BANNER    6 in a row on a tiny pumpkin
TIP       Six landings in a row on a tiny pumpkin, a quarter of the starting width or less. How?
HINT      six in a row on a tiny pumpkin

NAME      Laser
CRITERIA  10 perfects in a row
BANNER    10 *perfects* in a row
TIP       Ten *perfect* drops in a row. The moon stopped blinking somewhere around seven.
HINT      ten *perfects* in a row

NAME      High Wire
CRITERIA  10 landings in a row on small pumpkins
BANNER    10 in a row on a small pumpkin
TIP       Ten landings in a row on a small pumpkin. No net.
HINT      ten in a row on a small pumpkin

NAME      Needle
CRITERIA  3 landings in a row on tiny pumpkins
BANNER    3 in a row on a tiny pumpkin
TIP       Three landings in a row on a tiny pumpkin, a quarter of the starting width or less. Threading it.
HINT      three in a row on a tiny pumpkin

NAME      Pencil Pusher
CRITERIA  1 landing on a pencil pumpkin
BANNER    landed on a pencil pumpkin
TIP       A landing on a pencil pumpkin. Stacking those is hard.
HINT      land one on a pencil pumpkin

NAME      Sharp Eye
CRITERIA  5 perfects in a row
BANNER    5 *perfects* in a row
TIP       Five *perfect* drops in a row. Every edge lined up within a hair.
HINT      five *perfects* in a row

NAME      Tightrope
CRITERIA  5 landings in a row on small pumpkins
BANNER    5 in a row on a small pumpkin
TIP       Five landings in a row on a small pumpkin. Steady.
HINT      five in a row on a small pumpkin

NAME      Ghost Whisperer
CRITERIA  a perfect drop on a ghost pumpkin (every seventh pumpkin is the pale one)
BANNER    a *perfect* on a ghost pumpkin
TIP       A *perfect* drop on a ghost pumpkin, the pale one. When does it come? Watch.
HINT      a *perfect* drop on the pale ghost pumpkin

# ======================================================================

FAMILY 3: GROWTH

WIDERs in a row: how many times running the player grew the pumpkin
back. No width test; any WIDER counts. A clip resets the streak; a
plain perfect does not. Since a WIDER needs a slab narrower than the
start, this family is only ever earned after a clip: it rewards the
recovery. (A flawless round earns nothing here, and that is fine.)

NAME      Bumper Crop
CRITERIA  5 WIDERs in a row (fifteen perfects with no clip between)
BANNER    5 WIDERs in a row
TIP       Five WIDERs in a row. Fifteen *perfects*, and the tower is nearly whole again.
HINT      five WIDERs in a row

NAME      Pumpkin Farmer
CRITERIA  3 WIDERs in a row (nine perfects with no clip between)
BANNER    3 WIDERs in a row
TIP       Three WIDERs in a row. That is nine *perfects*.
HINT      three WIDERs in a row

NAME      Green Thumb
CRITERIA  2 WIDERs in a row (six perfects with no clip between)
BANNER    2 WIDERs in a row
TIP       Two WIDERs in a row. The pumpkin is coming back.
HINT      two WIDERs in a row





NAME      Sprout 

CRITERIA  1 WIDER (three perfects in a row on a narrowed tower) 

BANNER    grew back WIDER 

TIP       Three *perfects* in a row grew the pumpkin back a little. It all starts somewhere.
HINT      grow the pumpkin back with three *perfects* in a row

# ======================================================================

FAMILY 4: BOUNCE

Tapping on the first pass: the pumpkin never touched a wall. Streaks
reset on the first drop that bounced (or, where it says perfect, on the
first that was not perfect).
Four tiers added 2026-10-17 (John: "it is common to go 10.. 20.. 30 or
more without allowing a bounce"): Wildfire 30, Tornado 50, Supersonic
100, and Desperado for 20 no-bounce perfects.

NAME      Desperado
CRITERIA  20 no-bounce perfects in a row
BANNER    20 *perfects*, no bounce
TIP       Twenty *perfect* drops in a row and not one of them bounced. There is a poster with your face on it.
HINT      twenty *perfects* in a row with no bounce

NAME      Supersonic
CRITERIA  100 no-bounce drops in a row
BANNER    100 drops, no bounce
TIP       A hundred drops in a row without a bounce. The walls have filed a complaint about being ignored.
HINT      a hundred drops in a row with no bounce

NAME      Tornado
CRITERIA  50 no-bounce drops in a row
BANNER    50 drops, no bounce
TIP       Fifty drops in a row without a bounce. Things are getting picked up and put down very fast.
HINT      fifty drops in a row with no bounce

NAME      Outlaw
CRITERIA  10 no-bounce perfects in a row (perfect AND no bounce, each)
BANNER    10 *perfects*, no bounce
TIP       Ten *perfect* drops in a row, every one tapped before the pumpkin bounced off a wall. Wanted in three counties.
HINT      ten *perfects* in a row with no bounce

NAME      Wildfire
CRITERIA  30 no-bounce drops in a row
BANNER    30 drops, no bounce
TIP       Thirty drops in a row without a bounce. Spreading fast, no sign of stopping.
HINT      thirty drops in a row with no bounce

NAME      Lightning
CRITERIA  20 no-bounce drops in a row (any landing, no bounce)
BANNER    20 drops, no bounce
TIP       Twenty drops in a row without a bounce. The pumpkins never saw the walls.
HINT      twenty drops in a row with no bounce

NAME      No Look
CRITERIA  3 no-bounce landings in a row on tiny pumpkins
BANNER    3 tiny landings, no bounce
TIP       Three landings in a row on tiny pumpkins, with no wall bouncing. You were not even looking, were you?
HINT      three in a row on tiny pumpkins with no bounce

NAME      Dead Eye
CRITERIA  6 no-bounce perfects in a row
BANNER    6 *perfects*, no bounce
TIP       Six *perfect* drops in a row with no bounce. First pass, every time.
HINT      six *perfects* in a row with no bounce

NAME      Gunslinger
CRITERIA  10 no-bounce drops in a row
BANNER    10 drops, no bounce
TIP       Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch.
HINT      ten drops in a row with no bounce

NAME      Trick Shot
CRITERIA  3 no-bounce perfects in a row on small pumpkins
BANNER    3 small *perfects*, no bounce
TIP       Three *perfect* drops in a row on small pumpkins, none of them bounced. Hold the applause.
HINT      three *perfects* on small pumpkins with no bounce

NAME      Blindfold
CRITERIA  1 no-bounce landing on a tiny pumpkin
BANNER    a no-bounce landing
TIP       A landing on a tiny pumpkin, tapped before it bounced off a wall. Blindfolded, presumably.
HINT      land on a tiny pumpkin with no bounce

NAME      Sharpshooter
CRITERIA  3 no-bounce perfects in a row
BANNER    3 *perfects*, no bounce
TIP       Three *perfect* drops in a row, each with no bounce. Quick and right.
HINT      three *perfects* in a row with no bounce

NAME      Quick Draw
CRITERIA  5 no-bounce drops in a row
BANNER    5 drops, no bounce
TIP       Five drops in a row made before the pumpkin ever touched a wall. No dithering.
HINT      five drops in a row before the pumpkin touches a wall