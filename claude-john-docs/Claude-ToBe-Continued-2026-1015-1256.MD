# Claude — To Be Continued (2026-10-15 12:56)

Third checkpoint of 2026-10-15 (the morning one, `...-1015-1140.MD`, has
the Music popup detail and John's eleven-item todo list). Read first:
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
and `NEXT-TODOS.md` (John's list with DONE / still-to-do notes), then
`specifications.MD` 6k and `specifications-technical.MD` 4k.

## State in one paragraph

Candy Go Fish in slot 8, standalone move deferred. Since the morning push:
item 7 (a given candy leaves the dish at once), item 1 (opponent and
player character remembered across restarts), the welcome half of item 11
(Three / Four candies per set slider on the welcome, four deals six
cards, choice remembered), the two-way slider style on the Music popup's
Play switch, John's speaker photo on the UI/MUSIC/ON-OFF buttons with the
label below and a red slash when off, and a taller welcome with the
speakers lower and room under Let's play. Cache stamp
`2026-1015-set-size-speakers`, committed and pushed at John's request.

## Work done this session (afternoon)

1. Todo list items 1 to 11 recorded in `NEXT-TODOS.md` and the 11:40 file.
2. Item 7 built: one `render()` before the flight when the human gives.
3. Item 1 built: `halloween2026:candy-go-fish:players` note.
4. Green check on the Play switch, then the whole two-way slider style.
5. Item 11 audited at both sizes (engine check, 300-game node simulation
   per opponent, full UI rounds at four copies) and the welcome half built.
6. Welcome layout: speakers lower, switch above Let's play with angled
   red/blue bars, taller box.
7. Speaker photo buttons; John's original kept in design ideas/unused,
   512px runtime copy in `assets/buttons/speaker-grill.png`, preloaded.
8. John renamed the speech provenance note to
   `_where the speech generation came from.txt`; check and docs follow.
9. Docs, stamp, status marker, commit, push.

## Immediate ToDo

1. **Item 11, second half:** the set-size switch on Deal again?. Show
   `#setSizeChoice` under `.new-round` too, check that dialog's height,
   and decide whether a mid-round change should warn (it only takes
   effect at the next deal anyway).
2. **iPhone review** of everything above plus the morning's popup and the
   three-soundtrack preload time (item 5).
3. Items 2, 3, 4, 6, 8, 9, 10 from John's list, in whatever order John
   picks. Item 3 (UI toggle sometimes not toggling) has suspects listed.
4. A stray, unreferenced `speaker-cone-256.png` sits at the repo root
   (not created by Claude; John declined a delete, then did not decide).
   It is untracked; ask John before touching it. It is NOT in the commit.
5. Confirm the Pages build and the live stamp after this push.

## Longer-term ToDo

- Shell: Sound option A or B, Sound + per-game switches, placeholder
  slots, requirements gaps, contribution workflow, Pages switch-on +
  iPhone home-screen test, icons. Standalone move (deferred, plan on file).
- Game: human play feel, startup flash (deferred), rename of the internal
  `wendy` role key (John's call), redo the two stale checks (item 10).
