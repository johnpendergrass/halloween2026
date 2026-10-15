# Claude — To Be Continued (2026-10-15 11:40)

Superseded the same afternoon by `Claude-ToBe-Continued-2026-1015-1256.MD`; the todo list below is kept current in the game's `NEXT-TODOS.md`.

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

## John's new ToDo list (added 2026-10-15 afternoon, nothing started)

Also recorded in the game's `NEXT-TODOS.md`.

## John's additions, 2026-10-15 afternoon (not started)

1. DONE 2026-10-15 (Claude): the last opponent and player character are saved on every arrow tap under halloween2026:candy-go-fish:players and restored silently at startup, before the welcome. New Game already kept them within a session. An iPhone home-screen copy has storage separate from Safari. Checked with a throwaway Playwright script; verify-opponent-switch and verify-player-switch pass.
2. "Add continuous sound option" (John's words). A Continuous play mode for the soundtrack already shipped this morning; confirm with John whether this means something else, such as music during gameplay by default or a UI-sound setting.
3. The UI sound icon does not toggle reliably; sometimes a tap does nothing. Investigate (touch-action: none on buttons? the welcome pointerdown unlock? double events on iPhone?).
4. Play the soundtrack during the winning celebration: ramp it up right after the victory speech finishes.
5. Startup speed on mobile needs looking at (three soundtracks now preload, about 13 MB).
6. Find an elegant way to start sound on mobile. Something has to be touched; make that touch feel natural rather than a hidden rule.
7. DONE 2026-10-15 (Claude): when the human gives a candy, the whole board redraws as the flight starts, so the candy leaves the player's dish and the counts drop at once; when the human receives, the slot still fills on arrival. One line in resolveRequest in js/candy-go-fish.js. Checked with a throwaway Playwright script (give and receive paths); verify-piles and verify-browser pass.
8. A sound control on the main game page itself. Today the only way to the UI toggle and the Music popup is through the welcome, Deal again? (New Game) and Rules dialogs, and players cannot be relied on to open those. Something on the table, perhaps a small speaker in the game bar next to NEW GAME and RULES, that opens the same Music popup.
9. The Music popup works but looks plain next to the rest of the game. Restyle it in the game's own style: the welcome's pumpkin-vine frame and ghost-plate corners, the ceramic pumpkin button look, the game's type and colours, so it feels like part of the table rather than a settings form.
10. Two of Codex's checks are stale and fail on any current code: verify-go-fish-reply.cjs (clicks Let's play and expects a selectable hand, but the starter spinner now comes first) and verify-quotes.cjs (expects an opponent named Wendy, the original single opponent). John, 2026-10-15: redo them for the three opponents and three player characters. Separate question for John: the engine still uses 'wendy' as the internal role key for whichever opponent is showing (state.hands.wendy, config.players.wendy); renaming that touches the engine, strategies and every check, so it stays unless asked.
11. Offer a choice of 3-candy or 4-candy sets on the welcome and the Deal again? dialogs. AUDITED 2026-10-15 (Claude): the set size flows from config.rules.copiesPerType through engine.create, every strategy (Harry even has a separate completion weight for 4), the rules text, the celebration text and the hand art; nothing hard-codes 3. Tests: verify-engine (1,000 games each size, baseline policy); a node simulation of 300 games per opponent per size (all finish, cards conserved, opponent win rates 60/66/83% at 4 vs 58/58/76% at 3 against a random human; 4-copy games average 47 requests vs 28); full UI rounds at 4 copies against all three opponents with no page errors, 'Collected all 4' celebrations, 'sets of 4 matching candies' in Rules, 40 cards dealt 5+5 with 30 in the dish, three stacked images for a triple in hand. WELCOME HALF DONE 2026-10-15 (Claude): a two-way slider switch under the title, Three / Four candies per set with generic candy bars beside the word, a cream thumb that slides under the chosen side and a green check on its top-right corner; four-candy sets deal six cards each; the choice is saved under halloween2026:candy-go-fish:rules and restored on load. The Music popup's Play switch now uses the same two-way style. STILL TO DO: the same switch on the Deal again? dialog (the #setSizeChoice element only shows on .welcoming today; it sits in the dialog markup, so showing it on .new-round is mostly a CSS selector plus a look at the dialog height).

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
