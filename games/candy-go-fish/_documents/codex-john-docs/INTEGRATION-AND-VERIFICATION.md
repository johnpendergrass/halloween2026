# Integration, preview, verification and publishing

Updated October 12, 2026. [Current handoff](CURRENT-STATE-2026-1012.md) is authoritative.

Plain HTML/CSS/JS, no build. Slot 8 registers Go Fish Candy Edition and the friendly fish SVG. Shell is 9:16, game 9:14. Follow games/README - game design requirements.md, including width-relative sizing, font/touch targets and standalone support.

Use only ../game-helper.js score reporting. No game parent messaging/storage or settings/audio API. John prefers no dedicated Pause button: local dialogs pause, shell drawer does not. Sound is a future coordinated design task. Do not recreate the removed shell game toolbar.

## Preview

From repository root: python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1. Reuse an existing server. URLs: http://127.0.0.1:8098/games/candy-go-fish/index.html and root shell/slot 8. Direct file opening uses generated config-data.js. After JSON edits run node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs.

## Checks

Run node games/candy-go-fish/_documents/codex-john-docs/<script> from repository root.

| Script | Coverage |
| --- | --- |
| verify-player-switch.cjs | Boo/Mike/Sully artwork, cycling, state preservation and locks |
| verify-candy-rain-game.cjs | Three-second delay, readable results, both replay paths drain, early cancellation |
| verify-assets.cjs | All current static/dynamic assets exist; no unused assets remain |
| verify-abilities-browser.cjs | All profiles, triples/quadruples, pending-request and next-decision switching |
| verify-opponent-switch.cjs | Portraits, cycling, state preservation and dialog/game-over locks |
| validate-candy-names.cjs | Catalog naming/normalization constraints |
| verify-engine.cjs | Rules, privacy, conservation, final sets and 1,000 games each with triples/quadruples |
| verify-quotes.cjs | Both actors' Yes/No, auto-countdowns, middle shortcuts, grid shortcut at three stages, retained text, dialog pause, styles, flight scale/timing |
| verify-go-fish-reply.cjs | Each middle draw target, single draw, retained question, coral/tail direction, breathing onset/peak, dialog stopping and reduced motion |
| verify-piles.cjs | Actual request/player-draw artwork, private Wendy wrapper sizing, pile counts and survivor stability after sets |
| verify-browser.cjs | 338x526/547x850 layout/targets, dialogs, alternate names, full round, sets/results, replay and file opening |
| verify-shell.cjs | Registry/icon/menu, embedded layout and game-owned controls |
| verify-speech.cjs | Alias for current quote checks |
| verify-speech-redraw.cjs | Quote checks with delayed fade timers and completed-animation replay detection |

Browser scripts use local Chrome and bundled Playwright paths hardcoded in the harness; they are not runtime dependencies. Breathing targets intentionally never become stationary: tests use pointer clicks at their centers, rather than Playwright stable-box waits. Full-round acceleration still uses the existing timer shortcut; runtime waits count nominal active ticks and are not a general elapsed-time scheduler.

Screenshots are development artifacts. Tests use Chrome, not actual iPhone Safari. Timing/strategy enjoyment and iPhone compositor behavior still need device review.

## Publishing

Version the game's own CSS/JS URLs and JSON fetch as well as the three shell stamps. Updating only the iframe URL does not change nested resource cache keys; after the October 12 deploy the live HTML was current but a user still saw cached game code/styles. Current game resource version: 2026-1012-candy-welcome. New artwork uses new filenames; changed artwork at an existing URL also needs a new filename or version.

Save documentation as UTF-8. Before publishing, strictly decode all tracked `.md`/`.MD` files as UTF-8 to catch invalid byte sequences, including Windows-1252 smart quotes and dashes. On October 12 these caused the Pages Jekyll build to fail; encoding-only fix 7f20652 restored deployment. Verify the actual Pages Actions workflow succeeds and check the live version/content; a stale Pages "building" label does not establish that a build is still running.

October 12 user requested refreshed docs, verification and commit/push of current UI and initial-deal changes. Publishing cache stamp: 2026-1012-candy-welcome. October 11 appearance/piles commit: 1df4eac. Update APP_VERSION in app/app.js and both root index.html ?v= stamps together. Verify shell and game, commit intended files, push main and verify remote/local commit equality. This authorizes the present checkpoint only; obtain a new request for future pushes.
