# Candy Go Fish: current state and publishing checkpoint

Superseded by [October 13 handoff](CURRENT-STATE-2026-1013.md) for current sound and publishing state.

Updated October 12, 2026. This was the authoritative handoff for **GO FISH! — Candy Edition!** Older dated notes and snapshots are historical and may name retired previews, experiments or asset paths.

## October 13: first sound element

Switching to Ron or Boo plays ronBoo.mp3; Harry or Mike plays harryMike.mp3; Hermione or Sully plays hermioneSully.mp3 from assets/sounds/players-and-opponents/. Runtime cues are 128 kbps stereo MP3 conversions; original WAVs remain as editing masters. Both arrow directions play the newly selected character's cue. Initial portraits are silent. Rapid switches replace the previous cue.

js/sound.js owns playback and defaults to ON. The future global sound control can call CandySound.setEnabled(boolean); OFF immediately stops playing cues and blocks further playback. No global switch is implemented yet. Playback runs from the selector click for phone activation; blocked audio does not interrupt selection. Other game events remain silent.

## Welcome and help

The welcome remains until Let's play is clicked. It has a pumpkin-vine border with leaves, curled tendrils and small pumpkins, plus a ghost candy dish in each corner. GO FISH! is uppercase with orange fill, a thin black outline and green shadow. Candy Edition! is a smaller green subheading. The inline GO FISH! uses the same accent. Decorative generic candies were removed. The compact panel was subsequently enlarged 10%, with text only 5% larger; the button clears the bottom border.

The welcome says Ask for candies and explains requesting a held type, receiving a match and another turn, or drawing and switching turns. The help screen emphasizes that fishing always ends a turn, even after drawing a match, and that either player or the dish running out ends the game. Set size is taken from the active config (3 or 4); most sets wins. It was checked at phone size.

Previous plain and steampunk welcome designs are preserved in [the welcome fallback](welcome-checkpoint-2026-1012/_START-HERE.md). The active border is assets/decorations/welcome-vines.svg. Keep the dimmed game artwork behind the welcome.

## Startup issue: deferred

John still observes a brief green/partially drawn screen before the welcome. Visibility hiding, waiting for images/fonts, matching backgrounds and an opaque cover did not resolve it and were all reverted at his request. A red HTML-background diagnostic did not show red. Both local servers delivered current files with no-cache headers. The original rendering flow is restored. The issue remains on [the TODO list](NEXT-TODOS.md); do not claim it is fixed or reapply discarded work without further investigation.

## Opening, gameplay and results

Shell slot 8 runs index.html without a build, over HTTP or file opening. The current config uses ten candy types, three copies per set and five starting cards, with no opening completed set. Engine and opponents also support four-copy sets. Successful requests transfer one card and retain the turn. Fishing ends the turn. Empty hand, empty dish or all completed sets ends the round; most sets wins. Good Fish and sound remain unimplemented.

Let's play opens the empty-board, enlarged ghost-dish starter sequence. Clicking the dish or its prompt triggers a 3.7-second spin to a random player; clicking the result deals. The dish stays centered, with messages above/below it. Reduced motion fades. New Game and replay repeat the spinner without repeating the welcome. Zero-valued grid badges are hidden.

Labels read CANDY SETS. Completed-set badges are 125% of original size. The cat-dish count badge sits below the face. A wide cream, tail-free choice instruction disappears on selection. Pumpkin buttons have carved candlelit lettering. Portraits are enlarged with unchanged name sizing, smaller top buttons and an upward board shift. Player images sit 1.5vw higher than before the recent selector change.

Yes replies transfer after four active seconds or a middle click; No waits for a draw click. A matching requested slot shortcuts the request/reply. Questions are cream, Yes green, No coral, with curved tails and gently breathing replies. Dialogs pause presentation. Transfers curve and scale from 100% to 150% and back; reduced motion fades. Piles retain individual arrangements by card ID, preserve survivors and remove collected cards. Private opponent draws remain unidentified.

The earned-set celebration is smaller, with tighter spacing and no friendly-competition tagline. Game-over results remain readable and clickable. After three seconds, dense candy rain starts: 60% hue-varied generic bars at their original sizes and 40% branded candy at random 1.5–2.5 size multipliers. Candies enter above and exit below the screen with random spin and drift. Both New Game controls stop new drops, show Finishing and let the remaining candy fall before resetting. Early replay cancels the delayed rain. Reduced motion uses sparse, slower nonspinning drops. Leaving the page clears the effect.

The approved rain now lives in js/candy-rain.js and is integrated into the actual game. The temporary candy-rain-demo.html and its demo-only test were deleted before this publishing checkpoint. The live integration test remains.

## Characters and algorithms

Boo, Mike and Sully cycle with left/right arrows beside the player's portrait, with centered names overlapping its lower edge. Boo is the default. Their images are assets/player-icons/boo.png, mike.png and sully.png. The previous ghost is archived under _documents/design ideas/unused.

Ron +, Harry ++ and Hermione +++ use the accepted beginner, medium and expert algorithms. Plus signs indicate difficulty and appear only in portrait labels. Runtime logic is local JavaScript with no model calls. Ron preserves weighted randomness; Harry uses calibrated immediate probability scoring; Hermione tracks 1,024 plausible hidden arrangements and scores requests from temporal evidence. No policy receives actual player hidden cards or dish order.

Both selectors work mid-round except during dialogs and game-over, preserving cards, scores, turn and observations. A chosen request completes; the next decision uses the selected opponent. Public history and own private draws are retained from the deal.

[Strategy documentation](../strategies-development/_START-HERE.md) covers development, parameters and compact evidence. Forty thousand fresh validation games established Harry over Ron and Hermione over Harry for both set sizes and starting orders. Sixteen thousand Hermione self-play games found no starting advantage; triples suggested only a small borderline disadvantage. Experimental simulation programs were removed at John's request. These results do not establish optimal play.

## Organization, checks and publishing

- index.html and candy-go-fish.css: live entry and layout.
- js/: controller, engine, pile renderer, rain, beginner support and strategies.js adapter.
- js/strategies/ and js/shared/: required policies and inference.
- assets/: active images and JSON configuration/standalone companion. Opponent portraits use opponent-icons/RON.png, HARRY.png and HERMIONE.png.
- _documents/: clear starting guide, game docs/checks/fallbacks, design ideas and strategy development record.

Old root opponents and preview/demo files are removed. Artwork filenames are simplified. The maintained portrait-layout CSS fallback has current asset paths. Any empty locked old design ideas directory is untracked by Git.

Edit assets/json/game-config.json, then regenerate config-data.js with _documents/codex-john-docs/sync-config.cjs. Width-relative sizing, Arial, touch targets and standalone operation follow shared requirements. There is no dedicated Pause button at John's direction; the shell drawer does not pause gameplay.

Checks cover catalog/asset references, engine privacy/conservation and 1,000 games per set size; phone/desktop layout, full play, replay and file opening; all profiles, player/opponent cycling, both set sizes and switching; shell integration, candy transfers and live rain lifecycle. Desktop Chrome checks do not replace physical iPhone review.

Current publishing stamp: 2026-1012-candy-welcome. John authorized a full documentation update, demo removal, commit and push. Validate UTF-8 before publishing because invalid characters previously blocked Pages. Confirm remote equality, workflow success and live resource paths. New summary folders must have _START-HERE.md or an obvious contents guide.

Remaining work: deferred startup flash, human play feel, further celebration/pile refinement and coordinated sound design. John accepted the strategies; tune further only when new evidence or requested work calls for it.

Sound volume default: all cues use Web Audio gain 0.5 (50% signal amplitude). js/sound.js has a shared defaultVolume and a soundVolumes override map for individual tuning as new sounds are added. Device volume remains under user control. Chrome verification confirmed all three gain values and mute behavior; iPhone listening review remains manual.

Audio categories: ui and music have independent enabled/volume state and Web Audio gain buses. Character-selection cues are UI. Future controls use CandySound.setChannelEnabled(category, boolean), setChannelVolume(category, 0..1), and getChannel(category). Both channels default ON at full channel gain; individual sounds still default to 50%, preserving current levels. Signal path: per-sound gain, category gain, device volume. UI switching stops only UI clips, leaving future music independent. No music asset or visible controls are added yet.

Opening confirmation cue: confirmText.mp3 (128 kbps; original WAV retained) in assets/sounds/welcome-and-start-clicks/ plays for welcome Let's play, accepted choose-starting-player action, and accepted goes-first/start action. Either the starter message or dish uses the same guarded action, preventing duplicate cues while spinning. This is a UI cue at the default 50% per-sound gain. Other dialog confirmations remain silent for now.


Spinner audio trial reverted at John's request: the tray rotation is silent again, with its original 3.7-second timing. Existing confirmText opening clicks and character-selection cues remain. vehicleCar.mp3 is retained as a supplied asset but is not used.


SpinnerStart/ding trial reverted at John's request. Spinner rotation is silent with original timing; confirmation clicks remain. The existing spinnerDing.mp3 is retained in assets/sounds/startGameSpinner/ for possible use elsewhere (not currently played).

Victory speech (October 13): 18 supplied clips indexed from assets/sounds/victory-announcements/. Two seconds after game-over presentation, winner/loser names and set margin select BIGWIN (3+ sets) or CLOSE (1-2 sets). Ties and missing combinations are silent. Speech is UI audio at default 50% gain. Replay cancels pending/playing speech immediately, including during rain drain; new rounds, UI/global mute and page exit also cancel it. Catalog script sync-victory-sounds.cjs generates assets/sounds/victory-sounds.js for HTTP and standalone file opening: re-run when adding/renaming clips. Naming is winner beats loser BIGWIN/CLOSE - description.mp3; beat is accepted too. Current source typo book is mapped to Boo without renaming. Name-only subfolder is not used. verify-victory-sounds.cjs checks catalog, threshold, both winner directions, silence and cancellation; browser check confirmed actual Harry-over-Mike game-over timing and MP3 decoding.

Victory replay: bottom-right banner button shows a speaker with a curved repeat arrow, with a 13vw touch target and accessible Replay victory speech label. It appears only for results with an indexed speech clip. Clicking cancels any pending automatic announcement and restarts that result's speech immediately; audio still respects UI/global mute and volume. New-game rain drain disables the button. Phone/desktop browser checks verified layout, non-overlap with New game, immediate/repeated playback and cancellation of the initial two-second timer.
