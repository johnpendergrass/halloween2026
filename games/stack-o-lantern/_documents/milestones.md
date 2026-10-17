# Stack o' Lantern - the milestones and heights

The game's complete list as of 2026-10-17, in the order the script holds
them. This is a READING copy: the words that run are in the `MILESTONES`
table near the top of `stack-o-lantern.js`. To change a milestone, change
it there (and here, so the two keep matching).

## How they work

- Every milestone is earned at most once per round, with a banner and a
  burst of stars. Nothing is remembered between rounds.
- The four FAMILIES are how the end screen shows them:
  - HEIGHT: the level reached. Its name is the big framed title on the
    end screen and its LINE is the italic line under the pumpkin count.
    Under 5 pumpkins there is no level: the miss word stays as the title
    and a short low-count line is used (see the end of this file).
  - ACCURACY, GROWTH, BOUNCE: the best one earned in each family is one
    of the three names on the staircase under "You earned...". Tapping a
    name shows its TIP in a bubble.
- WITHIN A FAMILY THE ORDER IS THE RANK, rarest first. If a round earns
  several from one family, the one highest in that family's list is shown.
- The HINT is the quiet goal line on the welcome screen ("SHARP EYE: five
  perfects in a row"), picked at random.
- A word between asterisks (*perfect*) is shown in italics everywhere.

## The counters

| Counter | What it counts | Reset by |
|---|---|---|
| height | pumpkins stacked (the base does not count) | the round ending |
| perfect | *perfect* drops in a row (edges within 1.6vw, about 6px) | any clipped drop |
| small | landings in a row on a slab no wider than HALF the start width (23vw) | landing on a wider slab |
| tiny | landings in a row on a slab no wider than a QUARTER (11.5vw) | landing on a wider slab |
| pencil | landings in a row on a slab no wider than an EIGHTH (5.75vw) | landing on a wider slab |
| ghost | a *perfect* drop on a ghost pumpkin (every 7th slab is the pale one) | - |
| growth | WIDERs in a row (every 3rd *perfect* in a row grows the slab 3vw) | any clipped drop |
| clean | drops in a row tapped before the slab touched a wall (no-bounce) | a drop after a bounce |
| cleanPerfect | no-bounce *perfects* in a row | a bounce or a clip |
| cleanSmallPerfect | no-bounce *perfects* in a row on small slabs | a bounce, a clip or a wide slab |
| cleanTiny | no-bounce landings in a row on tiny slabs | a bounce or a wide slab |

"Small", "tiny" and "pencil" look at the slab being dropped, before any clip.
A plain *perfect* leaves the growth count alone; only a clip resets it.

## HEIGHT (24) - the level, rank order

Every five pumpkins to 100 (buildings in their real height order, then
the mountains, Everest at 100), the sky at 125 / 150 / 175, the Moon at
200. The end title is 9vw capitals on ONE line: measured in the page,
anything wider than SHANGHAI TOWER wraps. A title shortened to fit
(Liberty, Chrysler, Everest, Hubble...) carries its full name in the
line, and most lines mention the pumpkin tower.

| Rank | Pumpkins | Name | Banner | Line under the count | Hint |
|---|---|---|---|---|---|
| 1 | 200 | Moon Landing | 200 pumpkins high | Houston, we have a tower. Please come down now. | two hundred pumpkins high |
| 2 | 175 | Hubble | 175 pumpkins high | The Hubble Space Telescope turned around to get a better look at a stack of pumpkins. | a hundred and seventy-five pumpkins high |
| 3 | 150 | Space Station | 150 pumpkins high | The International Space Station just drifted past. The astronauts waved at the pumpkins. | a hundred and fifty pumpkins high |
| 4 | 125 | Stratosphere | 125 pumpkins high | Airliners cruise far below your pumpkins now. The captain has turned on the seatbelt sign. | a hundred and twenty-five pumpkins high |
| 5 | 100 | Everest | 100 pumpkins high | Mount Everest, top of the world. The Sherpas would like a word about carrying pumpkins. | a hundred pumpkins high |
| 6 | 95 | Kilimanjaro | 95 pumpkins high | Mount Kilimanjaro, the roof of Africa. Hemingway would have written a short, sad book about your pumpkins. | ninety-five pumpkins high |
| 7 | 90 | Fuji | 90 pumpkins high | Mount Fuji has a snowy cap and a thousand paintings. Your peak is orange and wobbling. | ninety pumpkins high |
| 8 | 85 | Vesuvius | 85 pumpkins high | Mount Vesuvius buried Pompeii. Your pumpkin tower buried the skyline. | eighty-five pumpkins high |
| 9 | 80 | Burj Khalifa | 80 pumpkins high | Dubai called. They want their skyline back. | eighty pumpkins high |
| 10 | 75 | Shanghai Tower | 75 pumpkins high | Tourists on the top floor are staring at a pumpkin. | seventy-five pumpkins high |
| 11 | 70 | Empire State | 70 pumpkins high | King Kong wants to climb your pumpkins. Tell him the Empire State Building is around the corner. | seventy pumpkins high |
| 12 | 65 | Eiffel Tower | 65 pumpkins high | Paris looked at your pumpkins and shrugged. For Paris, that is a standing ovation. | sixty-five pumpkins high |
| 13 | 60 | Chrysler | 60 pumpkins high | The Chrysler Building: steel eagles, a chrome crown, and still shorter than a pile of gourds. | sixty pumpkins high |
| 14 | 55 | Space Needle | 55 pumpkins high | Seattle's saucer on a stick, out-stacked by squash. Rain expected anyway. | fifty-five pumpkins high |
| 15 | 50 | Big Ben | 50 pumpkins high | The clock stopped to count your pumpkins. London will be late for everything. | fifty pumpkins high |
| 16 | 45 | Liberty | 45 pumpkins high | The Statue of Liberty, torch up, eyes on your tower. She has seen a lot. Never a pumpkin stack. | forty-five pumpkins high |
| 17 | 40 | Sequoia | 40 pumpkins high | Three thousand years to grow one of these. Your pumpkin pile took a coffee break. | forty pumpkins high |
| 18 | 35 | Notre Dame | 35 pumpkins high | The gargoyles are worried. The hunchback is impressed. | thirty-five pumpkins high |
| 19 | 30 | Tower of Pisa | 30 pumpkins high | The Leaning Tower of Pisa has tourists pretending to hold it up. Your pumpkins could use a few. | thirty pumpkins high |
| 20 | 25 | Treetops | 25 pumpkins high | The owls have a question. Who? You, apparently. | twenty-five pumpkins high |
| 21 | 20 | Haunted House | 20 pumpkins high | Two storeys up. The ghosts have to look up at you for once. | twenty pumpkins high |
| 22 | 15 | Giraffe | 15 pumpkins high | Eye to eye with the tallest animal alive. It blinked first. | fifteen pumpkins high |
| 23 | 10 | Hoop Height | 10 pumpkins high | Wembanyama can barely reach the top. Nothing but net. | ten pumpkins high |
| 24 | 5 | Scarecrow | 5 pumpkins high | The crows are watching. Nobody is scared yet. | five pumpkins high |

## ACCURACY (10) - where the tap lands, rank order

| Rank | Counter | At | Name | Banner | Tip (end-screen bubble) | Hint |
|---|---|---|---|---|---|---|
| 1 | perfect | 20 | Machine | 20 *perfects* in a row | Twenty *perfect* drops in a row. Are you even a person? | twenty *perfects* in a row |
| 2 | pencil | 3 | Toothpick | 3 in a row on a pencil pumpkin | Three landings in a row on pencil pumpkins, an eighth of the starting width or less. Who are you? | three in a row on pencil-thin pumpkins |
| 3 | tiny | 6 | Eye of the Needle | 6 in a row on a tiny pumpkin | Six landings in a row on a tiny pumpkin, a quarter of the starting width or less. How? | six in a row on a tiny pumpkin |
| 4 | perfect | 10 | Laser | 10 *perfects* in a row | Ten *perfect* drops in a row. The moon stopped blinking somewhere around seven. | ten *perfects* in a row |
| 5 | small | 10 | High Wire | 10 in a row on a small pumpkin | Ten landings in a row on a small pumpkin. No net. | ten in a row on a small pumpkin |
| 6 | tiny | 3 | Needle | 3 in a row on a tiny pumpkin | Three landings in a row on a tiny pumpkin, a quarter of the starting width or less. Threading it. | three in a row on a tiny pumpkin |
| 7 | pencil | 1 | Pencil Pusher | landed on a pencil pumpkin | A landing on a pencil pumpkin. Stacking those is hard. | land one on a pencil pumpkin |
| 8 | perfect | 5 | Sharp Eye | 5 *perfects* in a row | Five *perfect* drops in a row. Every edge lined up within a hair. | five *perfects* in a row |
| 9 | small | 5 | Tightrope | 5 in a row on a small pumpkin | Five landings in a row on a small pumpkin. Steady. | five in a row on a small pumpkin |
| 10 | ghost | 1 | Ghost Whisperer | a *perfect* on a ghost pumpkin | A *perfect* drop on a ghost pumpkin, the pale one. When does it come? Watch. | a *perfect* drop on the pale ghost pumpkin |

## GROWTH (4) - WIDERs in a row, rank order

A WIDER needs a narrowed slab, so this family is only ever earned after a
clip: it rewards the recovery.

| Rank | Counter | At | Name | Banner | Tip (end-screen bubble) | Hint |
|---|---|---|---|---|---|---|
| 1 | growth | 5 | Bumper Crop | 5 WIDERs in a row | Five WIDERs in a row. Fifteen *perfects*, and the tower is nearly whole again. | five WIDERs in a row |
| 2 | growth | 3 | Pumpkin Farmer | 3 WIDERs in a row | Three WIDERs in a row. That is nine *perfects*. | three WIDERs in a row |
| 3 | growth | 2 | Green Thumb | 2 WIDERs in a row | Two WIDERs in a row. The pumpkin is coming back. | two WIDERs in a row |
| 4 | growth | 1 | Sprout | grew back WIDER | Three *perfects* in a row grew the pumpkin back a little. It all starts somewhere. | grow the pumpkin back with three *perfects* in a row |

## BOUNCE (13) - tapped on the first pass, rank order

| Rank | Counter | At | Name | Banner | Tip (end-screen bubble) | Hint |
|---|---|---|---|---|---|---|
| 1 | cleanPerfect | 20 | Desperado | 20 *perfects*, no bounce | Twenty *perfect* drops in a row and not one of them bounced. There is a poster with your face on it. | twenty *perfects* in a row with no bounce |
| 2 | clean | 100 | Supersonic | 100 drops, no bounce | A hundred drops in a row without a bounce. The walls have filed a complaint about being ignored. | a hundred drops in a row with no bounce |
| 3 | clean | 50 | Tornado | 50 drops, no bounce | Fifty drops in a row without a bounce. Things are getting picked up and put down very fast. | fifty drops in a row with no bounce |
| 4 | cleanPerfect | 10 | Outlaw | 10 *perfects*, no bounce | Ten *perfect* drops in a row, every one tapped before the pumpkin bounced off a wall. Wanted in three counties. | ten *perfects* in a row with no bounce |
| 5 | clean | 30 | Wildfire | 30 drops, no bounce | Thirty drops in a row without a bounce. Spreading fast, no sign of stopping. | thirty drops in a row with no bounce |
| 6 | clean | 20 | Lightning | 20 drops, no bounce | Twenty drops in a row without a bounce. The pumpkins never saw the walls. | twenty drops in a row with no bounce |
| 7 | cleanTiny | 3 | No Look | 3 tiny landings, no bounce | Three landings in a row on tiny pumpkins, with no wall bouncing. You were not even looking, were you? | three in a row on tiny pumpkins with no bounce |
| 8 | cleanPerfect | 6 | Dead Eye | 6 *perfects*, no bounce | Six *perfect* drops in a row with no bounce. First pass, every time. | six *perfects* in a row with no bounce |
| 9 | clean | 10 | Gunslinger | 10 drops, no bounce | Ten drops in a row without a single bounce off a wall. Fastest thumb in the patch. | ten drops in a row with no bounce |
| 10 | cleanSmallPerfect | 3 | Trick Shot | 3 small *perfects*, no bounce | Three *perfect* drops in a row on small pumpkins, none of them bounced. Hold the applause. | three *perfects* on small pumpkins with no bounce |
| 11 | cleanTiny | 1 | Blindfold | a no-bounce landing | A landing on a tiny pumpkin, tapped before it bounced off a wall. Blindfolded, presumably. | land on a tiny pumpkin with no bounce |
| 12 | cleanPerfect | 3 | Sharpshooter | 3 *perfects*, no bounce | Three *perfect* drops in a row, each with no bounce. Quick and right. | three *perfects* in a row with no bounce |
| 13 | clean | 5 | Quick Draw | 5 drops, no bounce | Five drops in a row made before the pumpkin ever touched a wall. No dithering. | five drops in a row before the pumpkin touches a wall |

51 milestones in all.

## Under 5 pumpkins: the miss word and the low-count lines

The word that flashes at the miss is TIMBER! from 5 pumpkins up. Below
that a random pick: at 1 to 4 pumpkins SPLAT, THUD, OOF, CRUNCH or WELL
THEN; at 0 WHIFF, NOPE, AIR BALL, OOPS or NOTHING. On the end screen that
word is the title, and the line under the count is the last of these
whose count the player reached:

| Pumpkins | Line |
|---|---|
| 0 | The pumpkin patch remains undefeated. |
| 1 | One pumpkin. The patch is not impressed. |
| 2 | Taller than a cauldron. The cauldron is not worried. |
| 4 | Taller than a tombstone. Yours is being carved. |
