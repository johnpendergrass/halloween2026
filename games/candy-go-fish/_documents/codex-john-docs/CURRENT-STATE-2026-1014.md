Historical: superseded by [CURRENT-STATE-2026-1015.md](CURRENT-STATE-2026-1015.md) (Music popup, three soundtracks, saved settings).

# Candy Go Fish — current handoff

Updated October 14, 2026. This was the authoritative current state until October 15. Older handoffs, design notes and checkpoints are historical where they conflict. Start here, then [NEXT-TODOS.md](NEXT-TODOS.md). The shared [game requirements](../../../README%20-%20game%20design%20requirements.md) remain authoritative.

## Game and accepted behavior

GO FISH! — Candy Edition! runs in shell slot 8, as plain HTML/CSS/JavaScript without a build. HTTP and direct file opening are supported. The canvas is 9:14, width-relative, touch-controlled and non-scrolling. At John's direction there is no dedicated Pause button. Local dialogs pause presentation; the shell drawer does not notify or pause the game. Score reporting uses only ../game-helper.js.

Ten candy types, three copies each, five dealt to each player, with no completed opening set. Requests must name a held type; success transfers one candy and retains the turn. Triples collect automatically. Fishing always ends the turn. An empty hand, empty dish or all completed sets ends the game after any final set celebration. Most completed sets wins; ties are possible. Four-copy sets are supported internally, but not exposed as a player setting. Good Fish is not implemented.

YES replies hold question/reply for four active seconds before automatic transfer; either middle box or the dish shortcuts the wait. NO replies wait for a middle click to draw. A held requested candy shortcuts an opponent request immediately. Cream questions, green YES, coral NO, curved speaker tails and gentle answer breathing remain. Transfers curve, scale 100%-150%-100% and fade near arrival. Actual candy art flies for public transfers/player draws; opponent private draws remain unidentified. Reduced motion fades.

Persistent piles track physical card IDs and preserve surviving positions. Player hand is the grid; the restored cat tray shows its count. Main dish overflows slightly; opponent tray/dishes are green/red, player dishes brown/yellow. Ceramic pumpkin NEW GAME/RULES controls remain.

## Characters and strategy memory

Boo/Mike/Sully are player characters. Ron +, Harry ++ and Hermione +++ use the accepted beginner, medium and expert policies. Switching mid-round preserves cards, scores and observations from the initial deal. The next opponent decision uses the chosen policy. Hermione can reason over earlier events even if she was selected later; she never receives hidden player cards or dish order. Selectors are locked during dialogs/game-over. Accepted strategies remain unchanged; see [strategy documentation](../strategies-development/_START-HERE.md).

## Opening, dialogs and results

The pumpkin-vine welcome keeps the dimmed game artwork behind it. Its action shows Loading assets and is disabled while centralized preload settles, then becomes Let's play. Failed/timed-out assets permit play. The existing startup flash is still unresolved and deferred; this is not a claim that preloading fixes it.

Let's play opens the empty-board starter spinner; a plate or prompt click rotates it for 3.7 seconds, with the existing reduced-motion fallback. The selected character's goes-first speech plays when it lands; a click then deals. Welcome, spinner-start and deal confirmation clicks are silent. confirmText.mp3 is retained for later use.

Game-over score summary is second, ending reason last; the optional remaining-dish line stays between them. The winner portrait/name receives a larger, brighter gold halo than the current-turn highlight. Ties highlight neither side; replay clears the halo.

Original full-screen candy rainfall is the sole game-over celebration for all outcomes. It starts after three seconds: 60% generic bars, 40% branded candies with the original sizes/spin/drift. Both New Game controls stop new drops and let existing drops finish before replay. Early replay cancels delayed rain. The less-glamorous opponent-only spill experiment was rejected and removed, including its test/previews. Do not restore it without a request.

## Current sound inventory and behavior

All UI effects live directly in assets/sounds:

- switch-to-ron-or-boo.mp3, switch-to-harry-or-mike.mp3, switch-to-hermione-or-sully.mp3: newly selected character cue, either arrow direction; initial characters are silent; rapid selection replaces prior UI audio.
- winsSet-player.mp3 for human sets; winsSet-opponent.mp3 for opponent sets. Each plays once when its earned-set dialog appears. The player WAV was converted at 128 kbps, verified and deleted at John's request. The earlier synthesized trumpet fanfare was removed.
- confirmText.mp3 is prepared but currently unused.
- soundtrack-music-wonderful.mp3 is the looping dialog soundtrack (renamed from game-over-music.mp3 on October 14; two further candidates, haunted and earth, are in the folder but not yet wired up). Approximately 5.4 MiB, 4m41s, stereo MP3. Source provenance is retained in _where-are-the-sounds-from.txt.

speech/goes-first contains six '<name> goes first.mp3' clips. speech/victory contains all 36 BIGWIN/CLOSE combinations between the three opponents and three player characters. assets/sounds/victory-sounds.js is generated by sync-victory-sounds.cjs; run it after adding/renaming victory files. Runtime never lists directories. Production notes remain in speech/_Speech generation used text-to-speech.online.txt. Spoken Hermione was supplied as 'herm io ne' for pronunciation; runtime names/filenames use Hermione.

Victory speech starts two seconds after the results banner: BIGWIN is a margin of at least three sets, CLOSE is one or two. Ties/missing clips are silent. The banner replay button immediately restarts the selected speech and cancels its delayed start. Replay/new rounds, UI/global mute and page exit cancel pending/playing victory speech; replay is disabled during rain drain.

Spinner ticking is synthesized, not an MP3. preload.js builds an 18ms tapered noise buffer; sound.js applies a 3.2kHz low-pass. Initial tick starts with rotation, then roughly one tick per 60 degrees of forward movement follows actual rendered speed, with a 28ms minimum gap. Landing wobble is ignored. Animation pause, stop, mute, exit and reduced motion are handled. Spinner tick gain is now 50%; earlier 11%/75% trials are superseded. No new spinner confirmation effect is installed; goes-first speech remains.

## Preload, soundtrack and channel controls

js/preload.js is the single preparation coordinator: fixed artwork, configured portraits/candies, image loading/decoding, audio loading and spinner-buffer generation. CandySound.prepareAssets supplies 48 short audio elements; prepareWelcomeMusic supplies the separate long music element. Cached elements/buffers are reused. Short assets have six-second completion/failure bounds; music has 20 seconds. Music uses a media element plus Web Audio gain, not a fully decoded long PCM buffer. Browser preload is a hint, and the readiness event does not guarantee that every byte is resident on every mobile browser. Preparation does not play audio.

Music appears on welcome, Deal again? and Rules. It loops, fades from zero to 50% over three seconds once playback is available, and fades from its current level to zero over two seconds when the dialog closes. Game entry/return proceeds immediately during fade-out. Pausing preserves currentTime; reopening resumes that position. Only a fresh page load starts at zero; natural looping wraps at the end. No persistent browser storage is used.

Autoplay restrictions still apply. Welcome attempts automatic playback; tapping welcome artwork retries/unlocks audio when required. Let's play enters gameplay on its first click, rather than forcing another click solely to unlock music. Rules/new-round opens originate from user gestures. A failed music load does not leave the action disabled indefinitely.

UI/music have independent gain buses and ON/OFF state. Speaker toggles are upper-left UI and upper-right MUSIC on welcome, Deal again? and Rules. Muted icons have a diagonal slash; labels/aria-pressed match state; touch targets are at least 13vw. State carries between dialogs in the current page session. UI mute stops effects/pending victory without stopping music. MUSIC mute pauses immediately, preserving position; re-enable resumes with fade-in. Dialog keyboard focus includes controls. Earned-set dialogs do not show these toggles. Per-sound defaults are 50%; channel gain defaults to 100%. Device volume remains user-controlled. The shell Sound switch has no game API and still does not control this game.

## Files, checks and publishing

index.html/candy-go-fish.css are entry/layout. js/candy-go-fish.js coordinates UI; js/sound.js owns playback/buses/volume; js/preload.js prepares assets; js/candy-rain.js is the original celebration; js/candy-piles.js owns persistent piles. Engine/accepted policies stay in js/, js/strategies and js/shared. assets/json/game-config.json is authoritative; regenerate config-data.js with sync-config.cjs after edits.

Current cache stamp: 2026-1014-soundtrack-rename. Keep APP_VERSION, both root stamps and game resources/config fetch synchronized. Physical iPhone audio and first-render review remain manual. Tests use local Chrome/bundled Playwright; they are development dependencies only. See [verification guide](INTEGRATION-AND-VERIFICATION.md) and [October 14 verification](VERIFICATION-2026-1014.md).

John requested complete documentation, commit and push for this checkpoint. Publish active MP3s, current code, docs and relevant verification previews; do not publish _DOWNLOADS candidates or unused working sources. Strictly validate tracked Markdown as UTF-8 before pushing because invalid encoding previously failed Pages. Confirm remote/local commit equality, the actual Pages workflow and live nested-resource stamps.
