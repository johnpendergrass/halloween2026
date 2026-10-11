# Candy Go Fish — October 11 continuation

**Latest defaults:** either YES reply keeps both text boxes for four active seconds, then clears them and transfers automatically. Either middle text box or the Candy Dish can shortcut the wait. The matching-candy shortcut during Wendy requests also remains. Both NO replies wait indefinitely for a middle click before drawing. Local dialogs pause YES countdowns. The shared setting is `appearance.yesAutoTransferMs: 4000`, replacing `playerYesAutoTransferMs`. Earlier one-sided countdown/indefinite YES descriptions are superseded.

**Current set size:** restored to three candies per set. Ten types give 30 candies total, five dealt to each player and 20 initially in the dish before initial sets collect. Four-copy descriptions below are historical.

**Latest interaction exception:** when the human requests a candy and Wendy answers Yes, the settled question and answer stay for four active seconds, then clear as candy flight starts automatically. Clicking either middle text box or the dish starts it sooner. The configurable duration is `appearance.playerYesAutoTransferMs: 4000`; local dialogs pause the countdown. Wendy-request Yes and both NO paths retain their existing acknowledgement behavior.

**Grid highlight:** human selection highlight now clears when the question is sent. It does not remain during Wendy replies or incoming candy flight. Wendy requested-candy highlights remain because those slots are gift shortcuts.

**Speaker labels:** all asks:/says: labels use normal weight and inherit their box text color. Candy names and answer emphasis keep their existing weight.

**Tail refinement:** base widened from 6vw to 8vw with a stronger sideways sweep and rounded tip. The human tail mirrors the Wendy curve. Placement keeps the wider base within the box.

**Tail refinement:** triangular tips replaced by smoothly curved SVG masks with rounded tips. Wendy points up; human points down. Colors, size, placement and interaction behavior remain unchanged.

**NO color experiment:** NO, GO FISH! now uses muted coral `#efa39a` instead of gold, with a pale coral border and matching tail. Pre-tail/gold styling remains in the rollback folder.

**Styling experiment:** rounded speech bubbles now have upward tails for Wendy and downward tails for the human, consistently for question/Yes/NO. Colors remain cream/light green/gold. Pre-tail CSS and runtime are preserved in `style-checkpoint-before-tails-2026-1011/` for rollback.

**Reply styling:** both Yes replies now use the existing speech box geometry with light green `#cdebb7` background, black text, and a subtle white text shadow. The style applies during the stationary fade and while settled. Questions retain cream styling; gold NO, GO FISH! boxes are unchanged.

**Latest interaction exception:** during Wendy's request for a held candy, that matching human slot is enabled immediately and remains available through question arrival, reading and automatic Yes reply. Tapping it acknowledges the gift immediately, clears both text boxes, interrupts pending speech/reading, and starts the normal candy flight without a bounce. Other hand slots remain disabled. Middle acknowledgement targets remain available once the answer settles. Dialogs lock the shortcut; new round invalidates it; repeated taps cannot give twice.

**Latest motion change:** source bounce/pulse and glow have been removed from every candy transfer/draw route, including their helper, CSS and configuration. Candy now departs directly after acknowledgement (the existing Wendy fishing announcement remains), with the same curved flight and destination fade/shrink. This supersedes pulse references below.

## Default interaction rule — latest decision

Either player asks; the game automatically displays the truthful Yes I do / NO, GO FISH! answer. Both question and answer remain visible indefinitely. No candy is given or drawn until the human clicks one of the three middle elements: opponent text, Candy Dish, or player text. That acknowledgement starts the pending action exactly once. Both Yes directions now use the same acknowledgement wait; the previous automatic human gift and matching-slot shortcut were removed. Candy movement remains unchanged. Middle controls lock during answer arrival, after acknowledgement, and while dialogs are open. New round invalidates pending waits. Individual interaction refinements are future work.

This section supersedes intermediate interaction descriptions below, especially automatic/manual gifts and reading timeouts.

The published rollback checkpoint is `5a33e38`, **This is last version that still has FAST vs SLOW modes**, pushed to GitHub main at John's request before this change.

## Current presentation

Slow mode is deleted completely, including its toggle, state, portrait-origin geometry, outgoing question flight, and retired timing settings. The former Fast behavior is now the only quote presentation: stationary 250ms fades in the middle panel, opponent left / human right, with a one-second question reading beat. Human selection auto-sends after one second or a question tap; reselection resets that wait. Matching human slots enable 500ms after the opponent question settles. Automatic Yes replies hold 900ms and fade 250ms before candy movement. Manually tapping a matching slot starts the Yes reply and candy travel immediately, retaining the opponent question until flight finishes. Failed questions remain until draw/Go Fish action.

Candy flights retain their curved route, 1400ms duration, easing and destination fade/shrink. Automatic source pulses remain 480ms; manual gifts skip the pulse as before. Reduced-motion candy effects and dialog pause behavior remain. Top row now has only New Game and Rules. No replacement title or setting was introduced.

Editable quote timings are in `assets/json/game-config.json`: `quoteFadeMs`, `quoteHoldMs`, `playerRequestHoldMs`, `requestHighlightDelayMs`, and `requestHoldMs`. The generated companion was synchronized. `requestSpeechMs` and `replyDissolveMs` are removed.

## Verification

`verify-quotes.cjs` replaces `verify-fast-quotes.cjs`; it covers both speakers' success/miss replies, automatic/manual gifts, retained questions through dialogs, stationary keyframes, and separate candy timing. `verify-speech.cjs` runs that current suite. `verify-speech-redraw.cjs` runs it with delayed timers and completed-animation replay detection; the former Slow flight expectations are retired. `verify-browser.cjs` covers phone/desktop targets/layout, alternate identities, a full round, celebrations, results, replay and direct file opening. Engine and naming checks remain available.

Validation passed: JavaScript syntax, naming validation, engine scenarios and 1,000 simulations each for three/four copies, real-time stationary quote scenarios, delayed-timer quote scenarios, and phone/desktop full-round/replay/file-opening checks. The refreshed 338px screenshot was visually reviewed. These checks use local Chrome, not iPhone Safari.

## Human request answered Yes — interaction tuning

Player question remains alongside Wendy says: Yes I do. The settled Yes reply is a native clickable button (`yesReply`), usable by touch or keyboard. There is no automatic transfer or reading timeout: both messages remain until the human clicks the Yes reply. The click is accepted once, then the existing source pulse runs and both messages clear when candy flight starts. Rules/New Game dialogs suspend interaction; starting a new round invalidates the old waiter. NO/dish-draw flow and Wendy-request flow are unchanged. Reply labels use says: throughout. The temporary `playerYesHoldMs` setting was removed.


## Wendy request answered No — interaction tuning

Both Wendy question and Player says: NO, GO FISH! remain until the human clicks either the reply or the Candy Dish. Both triggers use the same locked draw handler, drawing exactly one private candy for Wendy. Dish accessibility text identifies Wendy as the recipient, and Rules disables both actions.

## Shared middle acknowledgement

Whenever a transfer/draw is ready for acknowledgement, either visible middle text box or the Candy Dish triggers the same action. This covers human Yes receipt, both Go Fish outcomes, and the ready-to-give window after Wendy requests a held candy. Matching-slot taps and existing opponent automatic timing remain supported. One guarded `acknowledgeMiddle` handler releases Yes/gift waits or starts the pending draw; controls lock immediately when acknowledged, during speech arrival/transfer, and in local dialogs. Candy identity selection still takes place in the human hand; an unsent human question can still be clicked to send it early.

The text/status area gains keyboard button semantics when it is an acknowledgement target; Wendy's Yes reply retains its native button. Retained human questions are enabled as acknowledgements, rather than duplicate requests. Rules explain the common middle targets.

## Remaining work

The October 9 end-of-first-day handoff remains authoritative for all other behavior and backlog. Four-copy preview remains selected. Good Fish is still unimplemented. Full animation centralization, source-pulse experiment, celebration tuning and selectable identities/variants remain separate work. Earlier Slow/Fast documentation and screenshots are historical.

This change has not been pushed; the earlier checkpoint push does not authorize publishing subsequent work.
