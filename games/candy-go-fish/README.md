# Candy Go Fish — playable demo

Open `demo.html` for a centered 9:14 preview, or `index.html` for the game itself. Both work directly from disk or through the repository's local server. The demo is registered in the shell's slot 8 (bottom right), with a witch-hat fish icon. The old Game 8 placeholder remains listed without a menu slot.

Ten candy types, three copies each, five candies initially dealt per player, random starting player. Request only a held candy, receive one copy per successful request, and request again after success. Every fishing draw ends the turn. Collect triples automatically. The round ends when either active hand becomes empty or all sets are complete; most completed sets wins, including a possible tie. No refill.

Wendy's strategy sees only her own hand and public requests/transfers/set completion. Fishing draws stay unidentified to the other player. Her unknown goal slots do not reveal candy identities or counts.

Data and configurable visual settings are in [assets/json](assets/json/README.md). The ten existing PNGs are used unchanged. The pile and Wendy's hand use neutral wrapper shapes so they do not reveal hidden candies. These are initial placeholder illustrations.

Rules and New Game dialogs suspend presentation. New Game offers cancellation. Reduced motion shortens candy travel. The game reports completed-set totals through `../game-helper.js`; the helper gracefully logs when outside the shell.

## Where this game breaks the requirements, and why

See the authoritative [game requirements](../README%20-%20game%20design%20requirements.md). At John's request, the demo omits a dedicated Pause button despite rule 18 covering automatic movement. There are no timed decisions or penalties. Wendy can finish a bounded run of successful requests while the shell drawer is open, then waits for the human response or the human's turn. The shell provides no drawer notification. Record or formalize this exception before release. Local dialogs still suspend Wendy and animations.

## Integration still to do

Slot 8, the SVG icon, and metadata/instructions are now registered in `games.json`. The shell already supplies Home, title, and menu; this game does not control shell navigation. The current shared helper exposes score reporting only. Future type-count/set-size switches need coordinated settings API support before shell switches can affect the game. No app code was changed.

## Verification

`codex-john-docs/verify-engine.cjs` checks one-copy transfer, extra requests, both fishing outcomes ending turns, early empty-hand finish, legality, strategy memory, private history, conservation, and 1,000 simulated games. `verify-browser.cjs` checks phone/desktop fit, touch targets, dialogs, a complete UI round, replay, and direct file opening. It uses the local server on port 8098 and the existing bundled Playwright/Chrome paths. Review screenshots live alongside these scripts.
