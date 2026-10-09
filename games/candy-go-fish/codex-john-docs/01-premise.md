# Basic premise

October 8, 2026

Candy Go Fish is a two-player collecting game: one human plays against a computer. Instead of conventional card ranks, players hold pictures of candy. They ask each other for candy types and try to collect three identical candies into completed sets.

The aim is an enjoyable game with a small, understandable interface. The human should be able to make a move by tapping a candy in their hand. Progress is visible through matching groups and completed sets, without attribute labels, preference calculations, or trade approval panels.

## Starting scope

- Ten candy types, three copies of each: thirty cards total.
- Five cards initially dealt to each player; twenty remain in the draw pile.
- Each completed set is worth one point. Most sets wins.
- One local human and one algorithmic opponent; no network or multiplayer service.
- No timer, difficulty selector, special cards, or additional scoring rules in the first prototype.

Deck size and set size should be easy to adjust in the implementation if playtesting suggests a better pace. The first prototype should test the simple game before adding rules.

## Supplied artwork

All ten files are in `../assets/candybar-images/`, relative to this documentation folder. Display names are separate from filenames and program identifiers.

| Stable identifier | Display name | File |
|---|---|---|
| hundredGrand | 100 Grand | 100Grand.png |
| threeMusketeers | 3 Musketeers | 3Musketeers.png |
| butterfinger | Butterfinger | Butterfinger.png |
| dots | Dots | Dots.png |
| lifeSaversGummies | Life Savers Gummies | LifeSaversGummies.png |
| mallomars | Mallomars | Mallomars.png |
| milkyWay | Milky Way | MilkyWay.png |
| mounds | Mounds | Mounds.png |
| redVines | Red Vines | RedVines.png |
| snickers | Snickers | Snickers.png |

The folder name is `candybar-images`, but the game can call all ten types “candies.” Preserve supplied image files and their names. Reuse their transparency and proportions; new artwork is unnecessary for this prototype.

## What the prototype should answer

Does collecting triples create satisfying decisions? Are turns understandable without instructions after every move? Can the human comfortably inspect and tap a hand on a phone? Does the computer feel plausible without knowing hidden cards? How often do games stall or end in ties?

Actual duration and enjoyment require playtesting; this document does not promise a particular game length.
