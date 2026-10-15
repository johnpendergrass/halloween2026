# Integration, preview, verification and publishing

Updated October 14, 2026. [Current handoff](CURRENT-STATE-2026-1014.md) is authoritative.

Plain HTML/CSS/JS, no build. Slot 8; shell 9:16, game 9:14. Follow shared game requirements. Only ../game-helper.js links game/app; no parent messaging/storage, shell Sound/settings API or recreated toolbar. No dedicated Pause button at John's direction. Local dialogs pause; shell drawer does not.

## Preview and data

Reuse an existing server, or run python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1 from repository root. Open http://127.0.0.1:8098/games/candy-go-fish/index.html and root shell/slot 8. File opening uses config-data.js. Regenerate after JSON edits with sync-config.cjs; regenerate victory catalog after MP3 filename changes with sync-victory-sounds.cjs.

## Checks

Run node games/candy-go-fish/_documents/codex-john-docs/<script> from repository root.

| Script | Coverage |
| --- | --- |
| validate-candy-names.cjs | Catalog uniqueness/normalization/required fields/length |
| verify-engine.cjs | Rules, privacy, conservation, final sets; 1,000 games each for triples/quadruples |
| verify-assets.cjs | Runtime/catalog references and published-source exceptions |
| verify-victory-sounds.cjs | 36 clips, BIGWIN boundary, both directions, tie/missing silence, cancellation |
| verify-sound-layout.cjs | 48 short sounds preload/decode; separate set paths, gain/mute, starter/deal/file opening |
| verify-spinner-ticks.cjs | Prepared/reused buffer, initial tick, acceleration/deceleration, mute/reduced motion |
| verify-welcome-music.cjs | Music load/loop/autoplay/gesture/missing fallback, actual fade gains, pause/resume, Rules/new-round |
| verify-browser.cjs | Phone/desktop layout, dialogs, full rounds/results/replay and file opening |
| verify-shell.cjs | Registry/menu/icon, iframe layout and game-owned controls |
| verify-player-switch.cjs / verify-opponent-switch.cjs | Cycling/portraits/preserved state/dialog-game-over locks |
| verify-candy-rain-game.cjs | Original delayed rain, results accessibility, both replay drains/early cancellation |
| verify-abilities-browser.cjs | Accepted policies, both set sizes, switching/pending decisions |
| verify-quotes.cjs / verify-go-fish-reply.cjs | Replies/shortcuts/retained questions/breathing/pause/reduced motion |
| verify-piles.cjs | Public/private art, counts and survivor stability |

Browser checks use local Chrome and bundled Playwright paths; these are not runtime dependencies. Breathing targets require center pointer clicks rather than stable-box waits. Test full-round acceleration is not a runtime elapsed-time scheduler. Screenshots are development evidence. Physical iPhone audio/autoplay/loading/compositor review remains manual. See VERIFICATION-2026-1014.md.

## Publishing

Current stamp: 2026-1015-set-size-speakers. Synchronize APP_VERSION, both root resource stamps, game resources and JSON fetch. Changing only the iframe URL does not invalidate nested caches. Same-URL changed artwork/audio needs filename/version changes.

Strictly decode tracked Markdown as UTF-8 before publishing; invalid Windows-1252 bytes previously failed Pages/Jekyll. Include active audio, provenance, code/docs/checks and relevant previews; exclude _DOWNLOADS/unused sources. Delete WAV masters only on John's explicit request.

John authorized complete documentation, commit and push for the October 14 checkpoint. Commit intended files, push main, confirm remote equality, actual Pages Actions success and live nested stamps/assets. Stale Pages labels do not establish workflow status. Future pushes require a new request.
