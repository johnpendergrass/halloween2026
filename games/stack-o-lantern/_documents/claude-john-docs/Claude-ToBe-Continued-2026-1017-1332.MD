# Stack o' Lantern — To Be Continued (2026-10-17 13:32) — the height ladder: 24 rungs, every five to 100, the sky, the Moon

Read: this, then the 12:21 handoff beside it (the families, one level,
no bar day), then `specifications.MD` (section 5, with the 13:30 note)
and `specifications-technical.MD` (sections 6 and 7), then
`../../README - STACK-O-LANTERN.md`. The 2026-10-16 17:15 file is the
folder's baseline and stays. The full milestone list, as tables, is
`../milestones.md`.

## State in one paragraph

**Playable, checked, committed and pushed with this handoff.** Since the
12:21 push: the three milestone working papers in `_documents` are gone
and `milestones.md` (a reading copy of the script's `MILESTONES` table,
every milestone with its count and words, plus the counters and the
under-5 lines) replaced them; the HEIGHT family grew from 10 to 24 rungs,
every five pumpkins from Scarecrow (5) to Everest (100), then
Stratosphere 125, Space Station 150, Hubble 175 and Moon Landing 200.
51 milestones in all. The stamp is `2026-1017-stack-heights`.

## Work done this session (12:40 to 13:32)

1. `milestones.md` written from the script (not from John's list), the
   three papers deleted with `git rm`, every reference repointed (the
   script's comment now says the TABLE is the place to edit the words;
   the README, both specs, the 12:21 handoff, the status marker).
2. The height ladder, four proposal drafts in a `_documents` file John
   edited by reply (Eiffel, Space Needle, Chrysler, Sequoia and "a few
   more skyscrapers"; steps of five; Alpha Centauri proposed and cut;
   Canton Tower, Taipei 101 and Petronas in for an hour and cut; the
   mountains; the sky). The proposal file was parked in Claude's
   scratchpad once built.
3. John's rules, recorded in the script's comment and milestones.md:
   taller things later (after Hoop Height the counts are relative);
   the title must fit the 9vw frame on ONE line (measured in the page:
   SHANGHAI TOWER at 90.8vw is the widest that fits; LEANING TOWER OF
   PISA, STATUE OF LIBERTY, CHRYSLER BUILDING and PETRONAS TOWERS wrap,
   so they are Tower of Pisa, Liberty, Chrysler, Petronas); a shortened
   title carries its full name in its line; most lines mention the
   pumpkin tower ("that is the game after all").
4. Haunted House and Treetops swapped (20 and 25): a two-storey house
   is shorter than a tree.
5. The ladder is generated into BOTH files by one scratch script
   (`heights.py`, a ROWS list), so they cannot drift.
6. Checks: `check-families.cjs` passes on the new table (HOOP HEIGHT
   for the 12-perfect round; WELL THEN / SPLAT under 5); a scratch
   script forced the end screen at 30 / 45 / 85 / 175 / 200 and all
   titles sat on one line in the frame.
7. Stamp bumped to `2026-1017-stack-heights` in the 26 code places.

## ToDo

- John's phone look from Pages: a 30+ round for TOWER OF PISA and the
  line under the count; the welcome screen's hints now include the
  long ones ("a hundred and seventy-five pumpkins high").
- Sound (Web Audio: thunk, knock, chime, crack, splat, milestone ding; a
  speaker toggle in the corner; iPhone first-tap unlock).
- More moon faces; "almost made the high scores" feedback (needs a
  third helper read).
- `check-moonspot.cjs` and `check-endgrid.cjs` still describe the old
  layout: rewrite or retire.
- The banner and the flying slab can briefly overlap on short, wide
  panels.

## Traps

- Edit the milestones in the script's table AND in `milestones.md`.
- New height titles: measure before adding; 14 capitals is the edge.
- Stack's files are LF; the root `app.js` / `styles.css` are mixed; the
  stamp lives in 26 places across app, both games and the root page.
