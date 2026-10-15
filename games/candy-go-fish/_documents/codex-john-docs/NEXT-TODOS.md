# Next work — Candy Go Fish

Updated October 15, 2026. [Current handoff](CURRENT-STATE-2026-1015.md) takes precedence over older TODOs. Overall gameplay and the calibrated strategies are accepted; do not retune them without a request or new evidence.

Completed: 36 indexed victory speeches, six starter speeches, renamed/moved audio paths, central graphic/audio preparation, rotating tick at 50%, separate earned-set MP3s, dialog soundtrack with fades/loop/resume, UI/MUSIC toggles on welcome/new-round/Rules, game-over line reorder and winner halo. Original full-screen candy rain remains; the opponent-only spill was rejected and removed. Opening/deal confirmation clicks are silent. October 15 (Claude): Music popup with three soundtracks, play mode, volume stops and remembered settings.

1. Physical iPhone review: tick/set/speech/music loudness, autoplay unlock, slow/cellular preload (now three soundtracks, about 13 MB) and loading fallback, the Music popup (arrows, volume stops, Continuous mode under speeches), and whether settings survive a home-screen relaunch. Chrome validation is not a substitute. If the triple preload is too slow, load only the chosen tune and fetch the others on demand.
2. Continue sound element by element. A spinner confirmation effect is still a possible next item; current goes-first speech remains. Review any new supplied sounds before mapping them.
3. Review human play feel, earned-set/game-over recognition, pile overlap/count readability and transfer appearance. Preserve final-set celebration before results, user-controlled set dismissal, visible final hands, shortcuts and replay drain.
4. Deferred at John's request: brief green/partially rendered flash before welcome. Prior visibility/image/font/loading-cover/background experiments failed and were reverted. Record first-render frames in the actual browser/shell before attempting another fix. Keep dimmed game artwork behind welcome; do not claim current preload fixes the flash.

Choice instruction and ceramic pumpkin buttons are implemented and available for later visual refinement. Persistent piles/actual-candy transfers remain. Good Fish, profile customization, larger candy catalogs/11-type/four-copy variants and full animation centralization are separate older backlog. The shell sound switch remains unavailable to games; use game-owned controls.

Future publication needs a fresh user request. This October 14 checkpoint is authorized for documentation, commit and push.
