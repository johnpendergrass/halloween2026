# Candy Go Fish: current sound checkpoint

Updated October 13, 2026. This handoff takes precedence over older notes. Gameplay, accepted opponent algorithms, art, character switching, welcome, starter spinner, persistent piles and candy rain retain the October 12 behavior. See CURRENT-STATE-2026-1012.md for those details; the sound statements below supersede older descriptions.

## Implemented sound

Runtime audio is local MP3 through js/sound.js, using Web Audio gain. Default per-sound gain is 0.5; soundVolumes holds future individual overrides. UI and music have independent gain buses, enabled states and volumes. Both default ON at channel gain 1. Device volume remains under user control. No visible sound controls or music playback are implemented. The shell sound switch still cannot control the game.

Future controls can call CandySound.setChannelEnabled('ui'/'music', boolean), setChannelVolume(category, 0..1), and getChannel(category). setEnabled controls all audio. Muting stops active audio and pending victory speech immediately. Audio failures must not interrupt gameplay.

Character switching in either direction plays the newly selected character's cue: Ron/Boo = ronBoo.mp3, Harry/Mike = harryMike.mp3, Hermione/Sully = hermioneSully.mp3. Initial portraits are silent. Rapid switches replace the previous cue.

confirmText.mp3 plays on welcome Let's play, the accepted choose-starting-player action, and the goes-first/start action. Clicking either starter text or dish reaches the same guarded action. Other dialog confirmations remain silent.

Spinner rotation is silent with the original 3.7-second timing. Both vehicleCar and spinnerStart/ding trials were rejected and reverted. spinnerDing.mp3 is retained for possible use elsewhere but is not played. The Windows David sample was only a preview; starter name announcements are not implemented.

## Victory announcements and replay

18 supplied victory MP3s are currently indexed in assets/sounds/victory-announcements/. Two seconds after the game-over banner appears, names and score margin select the announcement: BIGWIN means a win by three or more sets; CLOSE means one or two. Ties and missing combinations stay silent. Speech uses the UI channel at default 50% per-sound gain.

The banner's bottom-right speaker/repeat-arrow button immediately restarts the selected speech. It appears only when a matching clip exists, has a 13vw touch target and accessible label, and cancels the initial automatic delay if clicked early. New Game cancels pending/playing speech immediately, including during candy-rain drain, and disables speech replay during that drain. New rounds and page exit also cancel speech.

Naming convention: winner beats loser BIGWIN/CLOSE - description.mp3. The index accepts beat as well as beats. One supplied Hermione/Boo CLOSE file spells Boo as book; the index explicitly maps that filename to Boo without renaming it. Name-only recordings are not used.

After adding or renaming clips run:

    node games/candy-go-fish/_documents/codex-john-docs/sync-victory-sounds.cjs

This regenerates assets/sounds/victory-sounds.js for HTTP and direct file opening. No directory listing or remote speech service is needed at runtime. The original speech-production notes are preserved in assets/sounds/README.md.

## Next work and asset handling

John is adding the remaining character speeches. Wait until those are supplied, refresh the index, then implement preloading of all active MP3s during the welcome screen. Proposed behavior: background loading while reading welcome; if Let's play is pressed before completion, show Loading sounds briefly; a bounded timeout/failure path must still permit play. This preload behavior is not yet implemented.

Long music tracks require separate consideration. Upcoming UI/music volume and ON/OFF controls remain unbuilt. More event sounds will be added element by element. Current files load when first played and are reused within the page.

Only active runtime MP3s, their index, source notes and the retained ding are included in this publishing checkpoint. Unused WAV masters, candidate audio and duplicate _DOWNLOADS material remain local and untracked. John plans to remove unused WAVs before final deployment; do not delete his working sources without a request.

18 victory clips total about 595 KB; all 36 projected clips would be roughly 1.2 MB at the current average. These speeches do not present a significant size concern. Images and future long music are larger download contributors.

## Verification and publishing

verify-victory-sounds.cjs checks indexed file existence, BIGWIN's three-set boundary, both winning directions, missing/tied silence and cancellation. Browser checks verified actual game-over timing, MP3 decoding, both phone/desktop replay layouts, touch size, no button overlap, immediate replay and cancellation of the original delay. Character cue mappings, mute and channel gain behavior were also checked. Physical iPhone audio review remains manual; John accepted character sounds, confirmations and victory replay.

Publishing stamp: 2026-1013-candy-sound. Update shell APP_VERSION, both root resource stamps and game resources together. Validate UTF-8, required assets, browser/shell behavior and the actual Pages workflow. John authorized docs, commit and push for this checkpoint.

Remaining older work: deferred startup flash, human play feel, celebration/pile refinement, Good Fish and full animation centralization. Accepted strategies should not be retuned without new evidence or a request.

Publishing verification on October 13 passed: asset references, victory unit checks, engine 1,000 games each for triples/quadruples, both selectors at phone/desktop sizes, live rain lifecycle, full HTTP browser round/replay, direct file opening and shell embedding. Strict UTF-8 decode passed for tracked Markdown.
