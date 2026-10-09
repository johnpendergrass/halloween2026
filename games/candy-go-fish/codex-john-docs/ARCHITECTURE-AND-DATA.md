# Architecture and data

Current code, October 9, 2026. Plain HTML/CSS/JavaScript; no build framework or installed project dependency is required for the game.

## Files and dependency order

| File | Responsibility |
| --- | --- |
| `index.html` | Board, buttons, live message region, overlays and script order |
| `demo.html` | Centered standalone 9:14 iframe preview |
| `candy-go-fish.css` | Responsive board, quote shape, portraits, artwork, CSS motion and reduced motion |
| `candy-go-fish.js` | Async presentation coordinator, input, model calls, dialogs, score reporting |
| `game-engine.js` | Pure rules; browser global `CandyEngine` or Node export |
| `computer-player.js` | Own-hand/public-memory strategy; `WendyPlayer` or Node export |
| `assets/json/game-config.json` | Authoritative editable data/settings |
| `assets/json/config-data.js` | Generated `window.CandyConfig` for file opening / fetch fallback |
| `assets/candybar-images/` | Ten original PNGs, unchanged |
| `assets/*.svg` | Local portraits/menu icon; neutral hand/dish wrappers are CSS |
| `codex-john-docs/` | Current docs, historical records, verification scripts and screenshots |

HTML loads `../game-helper.js`, config companion, engine, strategy, then UI. HTTP UI attempts JSON fetch and falls back to the companion if it fails. Direct file opening uses the companion. Do not edit generated data independently.

## Engine model and events

`CandyEngine.create(config, random?, fixedDeck?)` builds/shuffles physical copies, chooses starting role, deals alternately, collects initial sets and checks ending. Cards contain stable `{ id, type }`. State includes `pile`, `hands.human/wendy`, `sets.human/wendy`, `turn`, `pending`, `finished`, `copies`, `typeCount`, `history`, and ending `reason/winner` when finished.

`request(state, actor, type)` validates turn, no pending draw, unfinished state and held type. It emits `request`, then either one `transfer` and optional `set`, or `miss` with pending `{ actor, type }`. It checks ending and appends public events. Success leaves the turn unchanged.

`fish(state)` requires a pending unfinished draw, shifts one card, clears pending, switches turn unconditionally, collects possible set, checks ending and returns draw/set events. Returned draw type is available to presentation; stored public draw history omits identity for both roles. `count` and `heldTypes` support legality/display/strategy inputs.

Sets retain their physical cards; conservation is testable across hands/dish/sets. State mutation happens once per accepted action. Animation cleanup must never cause another engine request/draw. Strategy sees only its hand's type-only copy and public clues.

## UI coordination and phases

The UI owns `state`, `memory`, `phase`, `selected`, `generation`, `overlayOpen`, `reported`, `displayedTurn`, `giftWait`, and `playerRequestWait` inside an async IIFE.

| Phase | Meaning |
| --- | --- |
| `intro` | Initial dialog before dealing |
| `choose` | Human can select/request; selected question has auto-send timer |
| `requesting` | Human question traveling or human request resolving |
| `thinking` | Opponent delay before choosing |
| `wendyRequest` | Opponent question arriving/holding or transfer resolving |
| `fishResponse` | Opponent Nope arrival after a human miss |
| `humanFishWait` | Human may draw from dish |
| `wendyFishWait` | Human may send opponent fishing |
| `drawing` | Draw pulse/travel/celebration/result hold |
| `finished` | Central result banner |

Phases are coarse; several visual steps share a phase. `render` rebuilds slot contents/classes, count badges, dish wrappers and control availability. It uses phase plus waiter objects for highlighting/taps. Full re-render during dialogs can affect staged visual state, a survey finding to address deliberately.

`proceed` advances to human choice, opponent thinking, or result. `resolveRequest` sequences reply/pulse/engine transfer/travel/celebration. `drawCandy` sequences announcement/pulse/engine draw/travel/celebration. `showDialog` sets inert/pause; `celebrateSet` waits on human dismissal. `startGame` resets waiters, increments generation and deals. `finishGame` reports score once.

`waitActive` handles local pause and optional early completion. `playVisual` coordinates native animation pause/completion and cleanup; it must not replay finished effects. Existing timing helpers still count nominal 40ms ticks. Future changes are specified in the animation handoff; do not mix gameplay changes into them.

## Configuration and candy naming

Current sections: `rules`, `players`, `appearance`, `candyDisplay`, `layout`, `candies`. The [data README](../assets/json/README.md) describes individual fields; the survey inventories all timings/effects.

Candy records contain stable `id`, explicit `longName`, explicit `shortName`, `image`, and optional `display` overrides. Compact messages/questions use short names; accessibility, image descriptions and celebrations use long names. Example: **Life Savers Gummies / LS Gummies**. Names may match for brief products.

Short names must be trimmed, nonempty, at most 16 characters and unique across the whole catalog after case/spacing/punctuation normalization. Stable IDs must be unique. `sync-config.cjs` runs `validate-candy-names.cjs` before writing the companion. Do not auto-truncate or let two variants share an ambiguous abbreviation. A future catalog should distinguish variants (for example LS Gummies versus LS Hard Candy) and validate all products before choosing a round subset.

From repository root:

```powershell
node games/candy-go-fish/codex-john-docs/validate-candy-names.cjs
node games/candy-go-fish/codex-john-docs/sync-config.cjs
```

The catalog still contains ten fixed types and fixed slot order. A larger master catalog/round selector is not implemented. Type IDs, asset paths, naming and selected-round layout will need coordinated expansion. Per-candy art overrides must remain separate from global motion timing.
