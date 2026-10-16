# Candy Go Fish audio

Updated October 15, 2026. [Current handoff](../../_documents/codex-john-docs/CURRENT-STATE-2026-1015.md) is authoritative.

## Inventory

UI effects are directly in this folder:

- switch-to-ron-or-boo.mp3, switch-to-harry-or-mike.mp3, switch-to-hermione-or-sully.mp3: paired selector cues.
- winsSet-player.mp3 and winsSet-opponent.mp3: distinct earned-set sounds; player WAV converted at 128 kbps and deleted at John's request.
- confirmText.mp3: prepared, retained for future use; welcome, spinner-start and deal confirmations are silent.
- soundtrack-music-earth.mp3 (5.1 MiB), soundtrack-music-haunted.mp3 (2.2 MiB) and soundtrack-music-wonderful.mp3 (5.4 MiB, 4m41s): the three looping soundtracks, shown in the Music popup as Earth, Haunted and Wonderful. Wonderful is the default. Provenance: _where-are-the-sounds-from.txt.

speech/goes-first holds six named starter announcements. speech/victory holds 36 BIGWIN/CLOSE clips. speech/tie holds the one tie voiceover (John, 2026-10-15), wired by name in sound.js assetMap as 'victory:tie'. victory-sounds.js is the generated index for HTTP and file opening; rerun sync-victory-sounds.cjs after victory filename changes. The source notes are in speech/_where the speech generation came from.txt. Text submitted for Hermione pronunciation used 'herm io ne'. Working candidates/masters are not runtime assets.

## Preparation and playback

js/preload.js centralizes fixed/configured image inventory, image loading/decoding, audio loading and spinner-tick buffer calculation. sound.js owns cached media elements, playback and the UI/music gain buses. All 48 short clips plus all three soundtracks are prepared (John chose to preload every tune and judge the startup cost on the phone). Image/short audio completion bounds are six seconds; music gets 20 seconds. Failures permit play. Long music remains a media element, not a fully decoded PCM buffer. Browser preload/readiness behavior varies by device.

Spinner: synthesized 18ms noise tick, softened by a 3.2kHz low-pass, 50% gain. First tick begins with rotation, then roughly every 60 degrees follows the actual plate speed with a minimum 28ms gap. Animation pause/mute/exit/reduced motion are handled. No spinner confirmation effect has been added; goes-first speech plays at landing.

Earned sets: human role uses winsSet-player; wendy/opponent role uses winsSet-opponent. Each plays once when its set dialog appears. The synthesized trumpet trial was removed.

Victory: speech starts after two seconds, BIGWIN for a margin of at least three sets, CLOSE for one or two, the tie voiceover for a tie; missing clips stay silent. Replay restarts immediately. New game, UI/global mute and page exit cancel pending/playing speeches; rain drain disables replay.

## Music and controls (2026-10-15, Claude)

Welcome, Deal again? and Rules share the soundtrack. The chosen tune loops and fades in over three seconds. In the default play mode, When paused, closing/confirming/canceling a dialog fades it to zero over two seconds while gameplay proceeds, then pauses preserving currentTime; reopening resumes from there. In Continuous mode the dialog closing changes nothing and the tune keeps playing through the game. Each tune is its own media element, so switching away and back resumes that tune where it left off. A fresh page load starts every tune at zero.

Welcome action shows Loading assets until preparation settles, then Let's play. Autoplay is attempted but may be blocked; a tap on welcome artwork retries/unlocks it. Let's play remains a single-click entry to the game. Other dialogs open from a user gesture.

One SOUND speaker button sits at the top right of these three dialogs only, drawn with John's speaker photo (assets/buttons/speaker-grill.png) and the bold label SOUND below it; a red slash crosses it when both channels are off. It opens the Sound popup (2026-10-15 afternoon; it replaced the separate UI toggle and the Music popup). The popup is a second overlay with the welcome's vine frame, laid out after John's sketch: UI and MUSIC speaker toggles side by side (steady green glow when on, red slash when off); then MUSIC SOUNDTRACK: Soundtrack with left/right arrows around the tune name (Earth, Haunted, Wonderful), When to play as a two-way slider switch (Always or Paused), and a Volume slider with fixed stops 0, 20, 40, 60, 80, 100 and tick numbers under it. Changes apply at once so they can be heard. CANCEL restores all five settings as they were when the popup opened; OK keeps and saves them (the layout followed John's second sketch on the same day: speakers centred one above the other, no labels on the three controls). The UI OFF switch only flips the channel flag (the channel's gain goes to zero), cancels a pending victory speech and pauses a clip that is actually playing; idle clips are left alone, because pausing all 84 of them took seconds on an iPhone, and each clip rewinds itself when played. Game over (John, 2026-10-15): in Paused mode the soundtrack ramps up about a second after the victory speech ends (a fallback timer of the clip's length plus a second covers a blocked clip; three seconds when there is no speech at all) and plays until New game is tapped, when it fades during the candy rain. In Always mode nothing changes because it is already playing.

Switching tunes fades the old one out over one second (keeping its position) and fades the new one in. Music OFF pauses immediately, preserving position; ON resumes with the fade-in. UI OFF stops effects and pending victory speech but leaves music alone.

Volume: the slider value is the music channel volume (0 to 1). sound.js scales the music channel by 1/0.75, so the level the game first shipped with (clip gain 0.5 at channel gain 1) now sits at slider 75 and the top stop is a third louder. The default stop is 80. Per-sound gain stays 50%; the UI channel stays at gain 1.

Remembered settings: Done in the popup, and the UI toggle, write one note to localStorage under the key halloween2026:candy-go-fish:music: { enabled, volume, track, mode, ui }. It is read once at startup, every value checked, and a missing or damaged note is ignored. This is allowed by rule 21 of the game requirements (relaxed 2026-10-15); the shell's own halloween2026:candy-go-fish note is never touched. Device volume remains user-controlled; the shell Sound switch has no game API.

APIs in sound.js: musicTracks, currentTrack, selectTrack(id), musicMode, setMusicMode('paused'|'continuous'), setChannelEnabled, setChannelVolume, getChannel, prepareWelcomeMusic (returns the three clips), startWelcomeMusic, fadeOutWelcomeMusic and global setEnabled.

## Checks

From repository root, run node games/candy-go-fish/_documents/codex-john-docs/<script>: verify-assets.cjs, verify-victory-sounds.cjs, verify-sound-layout.cjs, verify-spinner-ticks.cjs, verify-welcome-music.cjs. The Music popup itself was checked on 2026-10-15 with two throwaway Playwright scripts (tune switching with position kept, Cancel/Done, Continuous surviving Let's play and Rules, settings restored after a reload, damaged note ignored); they were not kept. Chrome checks do not replace physical iPhone listening/autoplay review. Current cache stamp: 2026-1015-tie-voice-demo.
