# Stack-o'-Lantern milestones, as of 2026-10-17

The nineteen milestones as they are in `stack-o-lantern.js` today (the
`MILESTONES` table), listed by class, for John to think about. Nothing in
this file is a proposal; it is what runs.

## How they work today

- Each milestone can be earned **once per round**. Nothing carries over
  between rounds.
- A milestone is checked after every landed pumpkin. When one is earned,
  a gold banner with the name and the short line pops for 1.8 s with a
  burst of 16 stars, and the moon goes wide-eyed. Two earned on the same
  drop show one after the other.
- The **end screen shows the top milestone of each class only** (a round
  that reached Haunted House does not also show Hoop Height). With nine
  classes, nine names is the most that can appear. A tap on a name opens
  its longer description (the "tip" below).
- The **start screen's goal line** cycles through the "hint" lines below,
  one every few seconds, as "NAME: hint".

Words used below:

- **Perfect**: a drop whose edge is within the perfect tolerance of the
  slab below (1.6vw in HARD; EASY widens it with the count, to 3.2vw at
  20 pumpkins). A perfect keeps the slab's full width.
- **WIDER**: every third perfect in a row grows the slab 3vw back toward
  the 46vw starting width.
- **Clip**: a drop that was not perfect; the overhang is sliced off and
  the slab gets narrower.
- **Bounce**: the sliding pumpkin touched a wall and turned round before
  the tap. A drop made before any bounce is a "clean" drop.
- **Starting width** is 46vw. Half = 23vw, a quarter = 11.5vw, an eighth
  = 5.75vw (a "pencil pumpkin").
- "In a row" streaks reset to zero on the first drop that breaks them.

## The nineteen, by class

### Perfects in a row (class `perfect`)

| # | Name | Earned at | Banner line | Tip (end-screen bubble) |
|---|------|-----------|-------------|--------------------------|
| 1 | **Sharp Eye** | 5 perfects in a row | 5 perfects in a row | Five perfect drops in a row. Every edge lined up within a hair. |
| 2 | **Laser** | 10 perfects in a row | 10 perfects in a row | Ten perfect drops in a row. The moon stopped blinking somewhere around seven. |
| 3 | **Machine** | 20 perfects in a row | 20 perfects in a row | Twenty perfect drops in a row. Are you even a person? |

Streak rule: any non-perfect drop resets the count to zero.

### Drops in a row with no bounce (class `clean`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 4 | **Quick Draw** | 5 clean drops in a row | 5 drops, no bounce | Five drops in a row made before the pumpkin ever touched a wall. No dithering. |
| 5 | **Gunslinger** | 10 clean drops in a row | 10 drops, no bounce | Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch. |
| 6 | **Lightning** | 20 clean drops in a row | 20 drops, no bounce | Twenty drops in a row without a bounce. The pumpkins never saw the walls. |

Streak rule: a drop after the pumpkin has bounced off a wall resets the
count. A new pumpkin sliding in from off-screen does not count as a
bounce. The drop does not have to be perfect, only quick.

### Height (class `height`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 7 | **Hoop Height** | 10 pumpkins stacked | 10 pumpkins high | Ten pumpkins high, which is about the height of a basketball hoop. |
| 8 | **Haunted House** | 25 pumpkins stacked | 25 pumpkins high | Twenty-five pumpkins high, two storeys of haunted house. The ghosts are looking down at you. |
| 9 | **Skyscraper** | 50 pumpkins stacked | 50 pumpkins high | Fifty pumpkins high. The stars are getting closer. |

Not a streak; the count of landed pumpkins (the base slab is not
counted).

### The ghost pumpkin (class `ghost`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 10 | **Ghost Whisperer** | the first perfect drop on a ghost pumpkin | a perfect on a ghost pumpkin | A perfect drop on a ghost pumpkin, the pale one. When does it come? Watch. |

Every 7th pumpkin is the pale ghost. The tip deliberately does not say
"every seventh" ("let them figure that out").

### Growing back (class `comeback`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 11 | **Comeback** | a WIDER earned while the slab was under half the starting width | grew back from under half width | The tower had shrunk to less than half its width, and three perfects in a row grew it back. Never give up. |

### Landings in a row on a half-size slab (class `small`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 12 | **Tightrope** | 5 landings in a row on a slab 23vw wide or less | 5 in a row on a half-size slab | Five landings in a row on a slab no more than half the starting width. Steady. |
| 13 | **High Wire** | 10 landings in a row on a slab 23vw wide or less | 10 in a row on a half-size slab | Ten landings in a row on a slab no more than half the starting width. No net. |

Streak rule: the width tested is the pumpkin being dropped (before any
clip). Any landing counts, perfect or clipped; a landing on a wider slab
resets the count.

### Landings in a row on a quarter-size slab (class `tiny`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 14 | **Needle** | 3 landings in a row on a slab 11.5vw wide or less | 3 in a row on a quarter-size slab | Three landings in a row on a slab a quarter of the starting width or less. Threading it. |
| 15 | **Eye of the Needle** | 6 landings in a row on a slab 11.5vw wide or less | 6 in a row on a quarter-size slab | Six landings in a row on a slab a quarter of the starting width or less. How? |

Same streak rule as the half-size class. A quarter-size landing also
counts toward the half-size streak.

### Landings on a pencil pumpkin (class `pencil`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 16 | **Pencil Pusher** | 1 landing on a slab 5.75vw wide or less | landed on a pencil pumpkin | A landing on a pencil pumpkin, a slab an eighth of the starting width or less. Stacking those is hard. |
| 17 | **Toothpick** | 3 landings in a row on a slab 5.75vw wide or less | 3 in a row on a pencil pumpkin | Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you? |

Same streak rule. A pencil landing also counts toward the quarter-size
and half-size streaks, so one pencil run can earn three classes at once.

### WIDERs in a row (class `growth`)

| # | Name | Earned at | Banner line | Tip |
|---|------|-----------|-------------|-----|
| 18 | **Green Thumb** | 2 WIDERs with no clip between them | 2 WIDERs with no clip between | Two WIDER growths in a row without a clipped drop in between. The pumpkin is coming back. |
| 19 | **Pumpkin Farmer** | 3 WIDERs with no clip between them | 3 WIDERs with no clip between | Three WIDER growths in a row without a clipped drop in between. That is nine perfects. |

Streak rule: a WIDER adds one; a clip resets to zero; a plain perfect
(one that is not the third of a trio) leaves the count alone. Two WIDERs
in a row means six perfects in a row, three means nine, so Green Thumb
always arrives with Sharp Eye and Pumpkin Farmer always arrives just
before Laser. A WIDER cannot happen when the slab is already at full
width, so these need a clipped tower first.

## Things to notice while thinking

- **Overlap between classes.** Green Thumb (6 perfects) and Pumpkin
  Farmer (9 perfects) are nearly the same achievement as Sharp Eye (5)
  and Laser (10). A good run of perfects can light four banners in five
  drops. The pencil / quarter / half classes nest the same way.
- **Reachability.** Machine (20 perfects), Lightning (20 clean),
  Skyscraper (50 high), Eye of the Needle and Toothpick are rare; some
  may never have been earned. Hoop Height, Sharp Eye and Quick Draw come
  most rounds.
- **The end screen cap.** Nine classes today means up to nine names. A
  cap of five means either five classes, or nineteen-plus milestones
  with the end screen showing only the five "best" by some ranking
  (hardest first, or John's own order).
- **Shown vs earned.** Showing only the top of each class already hides
  the lower tiers; with a cap of five the rule for which five would need
  deciding.
- **Classes Claude offered on 2026-10-16 that were not picked**: close
  calls (Cliffhanger), recovery (Shake It Off, Phoenix, Full Width),
  consistency (Steady Hand, Clean Sweep), speed (Top Gear, Hot Hands),
  Ghost Hunter, mode (Iron Will, Switch Hitter), Window Shopper.
