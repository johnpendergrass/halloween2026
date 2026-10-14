# October 14 checkpoint verification

Current behavior is defined in [CURRENT-STATE-2026-1014.md](CURRENT-STATE-2026-1014.md).

Checks recorded during implementation:

- Asset inventory and regenerated 36-clip victory catalog; BIGWIN boundary, both winning directions, ties/missing silence and cancellation.
- All 48 short sounds prepared and decoded in Chrome; separate player/opponent set paths, 50% gain and mute; six starter names, one announcement at landing, direct file opening and deal.
- Spinner buffer prepared during welcome and reused; initial tick within 150ms in Chrome; rhythm accelerates/decelerates with plate, UI mute/reduced motion and stop behavior.
- Music readiness/looping, automatic-playback test mode, restrictive autoplay with artwork tap, missing-file fallback, three-second fade-in and two-second fade-out. Tests inspect actual nonzero/intermediate gain and eventual pause, plus saved position on Rules/new-round reopening.
- Speaker controls visible on welcome/new-round/Rules at 338x526 and 547x850, adequate touch targets, independent channels, mute state carried across dialogs and music resume.
- Winner halo for either side, no halo on ties, replay clears it; phone/desktop visual previews. Original rain restored byte-for-byte to the prior committed module; opponent-spill experiment removed.

Checkpoint regression run passed October 14: validate-candy-names, verify-engine (1,000 games per set size), verify-assets, verify-victory-sounds, verify-sound-layout, verify-spinner-ticks, verify-welcome-music, verify-browser (HTTP/full rounds/replay/file opening), verify-shell, verify-player-switch, verify-opponent-switch and verify-candy-rain-game. HTTP checks needed local-server network access outside the default sandbox. No application failure remained. Physical iPhone listening/autoplay/data-loading behavior remains manual; Chrome is not a Safari substitute. No claim is made that startup flash is fixed.

Run scripts from the repository root: node games/candy-go-fish/_documents/codex-john-docs/<script>. Current new checks are verify-sound-layout.cjs, verify-spinner-ticks.cjs and verify-welcome-music.cjs, alongside maintained assets/victory/engine/browser/shell checks. Screenshots are development evidence, not runtime assets.
