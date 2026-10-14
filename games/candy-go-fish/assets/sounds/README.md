# Candy Go Fish audio

Updated October 14, 2026. [Current handoff](../../_documents/codex-john-docs/CURRENT-STATE-2026-1014.md) is authoritative.

## Inventory

UI effects are directly in this folder:

- switch-to-ron-or-boo.mp3, switch-to-harry-or-mike.mp3, switch-to-hermione-or-sully.mp3: paired selector cues.
- winsSet-player.mp3 and winsSet-opponent.mp3: distinct earned-set sounds; player WAV converted at 128 kbps and deleted at John's request.
- confirmText.mp3: prepared, retained for future use; welcome, spinner-start and deal confirmations are silent.
- game-over-music.mp3: looping dialog soundtrack, approximately 5.4 MiB / 4m41s stereo MP3. Provenance: _where-are-the-sounds-from.txt.

speech/goes-first holds six named starter announcements. speech/victory holds 36 BIGWIN/CLOSE clips. victory-sounds.js is the generated index for HTTP and file opening; rerun sync-victory-sounds.cjs after victory filename changes. The source notes are in speech/_Speech generation used text-to-speech.online.txt. Text submitted for Hermione pronunciation used 'herm io ne'. Working candidates/masters are not runtime assets.

## Preparation and playback

js/preload.js centralizes fixed/configured image inventory, image loading/decoding, audio loading and spinner-tick buffer calculation. sound.js owns cached media elements, playback and the UI/music gain buses. All 48 short clips plus the separate soundtrack are prepared. Image/short audio completion bounds are six seconds; music gets 20 seconds. Failures permit play. Long music remains a media element, not a fully decoded PCM buffer. Browser preload/readiness behavior varies by device.

Spinner: synthesized 18ms noise tick, softened by a 3.2kHz low-pass, 50% gain. First tick begins with rotation, then roughly every 60 degrees follows the actual plate speed with a minimum 28ms gap. Animation pause/mute/exit/reduced motion are handled. No spinner confirmation effect has been added; goes-first speech plays at landing.

Earned sets: human role uses winsSet-player; wendy/opponent role uses winsSet-opponent. Each plays once when its set dialog appears. The synthesized trumpet trial was removed.

Victory: speech starts after two seconds, BIGWIN for a margin of at least three sets, CLOSE for one or two; ties/missing clips stay silent. Replay restarts immediately. New game, UI/global mute and page exit cancel pending/playing speeches; rain drain disables replay.

## Music and controls

Welcome, Deal again? and Rules share the soundtrack. It loops and fades to 50% over three seconds. Closing/confirming/canceling a dialog fades from its current volume to zero over two seconds while gameplay proceeds, then pauses preserving currentTime. Reopening resumes from there; fresh page load starts at zero, natural looping wraps at the end. No persistent storage is used.

Welcome action shows Loading assets until preparation settles, then Let's play. Autoplay is attempted but may be blocked; a tap on welcome artwork retries/unlocks it. Let's play remains a single-click entry to the game. Other dialogs open from a user gesture.

Upper-left UI and upper-right MUSIC speaker toggles appear on these three dialogs only. Diagonal slash means OFF; aria-pressed and accessible labels match state. Targets are at least 13vw and included in dialog focus navigation. Channel state persists across dialogs within the page session. UI mute leaves music independent; MUSIC mute pauses immediately and preserves position. Re-enable resumes/fades in. Device volume remains user-controlled; the shell sound switch has no game API.

Per-sound gain defaults to 50%; both channels default ON at gain 1. Future individual tuning uses soundVolumes. APIs: setChannelEnabled, setChannelVolume, getChannel and global setEnabled.

## Checks

From repository root, run node games/candy-go-fish/_documents/codex-john-docs/<script>: verify-assets.cjs, verify-victory-sounds.cjs, verify-sound-layout.cjs, verify-spinner-ticks.cjs, verify-welcome-music.cjs. Chrome checks do not replace physical iPhone listening/autoplay review. Current cache stamp: 2026-1014-audio-controls.
