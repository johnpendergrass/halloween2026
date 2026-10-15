# Claude — To Be Continued (2026-10-15 11:40)

Second Claude session on Candy Go Fish. Read first:
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(authoritative game state, updated today), then this file, then
`specifications.MD` 6k and `specifications-technical.MD` 4k.

## Decision this session: standalone move DEFERRED

John wants to keep working on halloween2026 with the game in slot 8.
`claudePlans/candy-go-fish-standalone-plan.md` stays on file; reconsider
later. Do not start it unless John asks.

## Work done this session (2026-10-15)

1. **Three soundtracks wired up**: Earth, Haunted, Wonderful (default
   Wonderful), all preloaded on the welcome. Each tune keeps its own
   position for the page session; switching fades 1 s out / 3 s in.
2. **Music popup** replaces the MUSIC toggle on the welcome, Deal again?
   and Rules dialogs. The MUSIC speaker keeps icon + label, shows the
   state with a slash, and opens a second overlay sized like the Rules
   box (90vw × 94vh). Rows: Music ON/OFF, Soundtrack with arrows, Play
   mode (When paused / Continuous), Volume with stops 0..100 by 20.
   Cancel (bottom left) restores, Done (bottom right) keeps and saves.
3. **Volume remapped**: old level = slider 75, top stop a third louder,
   default 80 (music channel `scale = 1/0.75` in `sound.js`).
4. **Settings remembered** in localStorage under
   `halloween2026:candy-go-fish:music` (enabled, volume, track, mode,
   ui). Requirements **rule 21 relaxed** to allow game-owned notes under
   `halloween2026:<folder>:`; helper comment and `app/app.js` note updated.
5. `verify-assets.cjs` now lists the two new tunes. The six Codex sound
   and browser checks pass; two throwaway Playwright checks of the popup
   passed and were not kept (described in `assets/sounds/README.md`).
6. Docs: new `CURRENT-STATE-2026-1015.md` (1014 marked historical),
   `_START-HERE.md`, `NEXT-TODOS.md`, game README, sounds README,
   `UI-AND-PRESENTATION.md`, both specs, this file, `__STATUS` marker.
7. Cache stamp bumped to `2026-1015-music-popup` in all five code places
   and the docs that quote it. Committed and pushed at John's request,
   including the two previously untracked tune files.

## Immediate ToDo

1. **iPhone review of the popup** (John): arrows, volume stops, slash on
   the MUSIC button, Continuous mode under set sounds and victory speech,
   and whether the triple preload (about 13 MB) slows the welcome on
   Wi-Fi/cellular. If too slow: preload only the chosen tune, fetch the
   others on demand (the `musicEntry` function in `sound.js` already
   creates clips lazily; only `prepareWelcomeMusic` would change).
2. Confirm the Pages build succeeded and the live site serves the new
   stamp (Codex's rule: check the Actions run, not the label).
3. Decide whether Continuous mode should duck under speeches (John said
   no dip for the first try).

## Longer-term ToDo (game, from Codex's NEXT-TODOS)

- Human play feel, set/game-over recognition, pile readability.
- Startup flash before the welcome (deferred by John).
- Spinner confirmation effect (possible), more sound elements.

## Longer-term ToDo (shell, from October 1, still open)

- Shell Sound switch: option A or B never chosen; Sound and per-game
  switches still change nothing. The game owns its audio now, which may
  make the shell switch redundant for this game.
- Placeholder slots, requirements doc gaps, contribution workflow,
  GitHub Pages switch-on + iPhone home-screen test for the shell, icons.
- The standalone move (deferred, plan on file).
