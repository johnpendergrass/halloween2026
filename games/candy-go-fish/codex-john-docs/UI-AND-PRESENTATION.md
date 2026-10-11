# UI and presentation

**October 11 update:** [Current continuation](CONTINUATION-2026-1011.md) supersedes the quote-mode/timing descriptions below. Slow mode and the speed toggle have been deleted; quotes fade in place using the former Fast behavior. Candy flights remain.


Current implementation, October 9, 2026. Exact inventory and lifecycle findings are in [the animation survey](ANIMATION-SURVEY-2026-1009.md).

## Board and ownership

The game has a green card-table background and a fixed, non-scrolling 9:14 layout. The shell owns the purple Home/title/menu bar and bottom drawer. The game owns its smaller outlined New Game/Rules controls and a temporary Quotes: Slow / Fast toggle replacing the local Go Fish title. The shell title remains unchanged. Do not add game controls to the shell or recreate the removed toolbar helper.

Opponent header: set total, centered circular friendly-witch portrait with overlapping configured name, then neutral wrapper pile with total-count badge. Its ten goals are two rows of five. Unknown goals show no active candy identity. Completed goals show art and green checks.

Human footer: the same set-total/portrait-name/pile layout, using a friendly ghost by default. Above it are ten fixed candy slots showing counts, faint empty identities and completed goals. The human pile is decorative and is not a transfer endpoint. Human transfers use their individual slots.

The active portrait/name has a large yellow halo and the active half brightens. Set totals do not glow. No textual turn indicator is displayed. Set-score labels show SETS WON above the total, with the number slightly larger (4.5vw versus 3.6vw, with minimum font sizes). Profile names and portraits come from JSON.

## Middle and speech

The middle **always remains the Candy Dish** with wrappers and remaining count. There is no identifiable requested candy in it, on either player's turn. It can be clicked only for a human fishing draw.

One message/bubble uses the space beside the dish. Question bubbles use a cream background, dark text, gold edge, three rounded corners and one sharper corner. Contents are separate blocks: **[Name] asks:**, **Do you have any**, **[short candy name]**, candy art. Both question bubbles are 30vw wide. The middle layout has equal 30vw side columns around a centered 23vw dish column, separated by 2vw gaps. Speaker identity controls placement: opponent speech is always left, human speech always right. Human cream bubbles mirror the sharper corner. Question boxes are roughly 20% shorter: candy artwork sits in a 16vw absolute lower layer, with 11vw of reserved lower space and text above it. Modest image/text overlap is permitted; grid-sized art and per-candy rotation stay unchanged. Candy names in questions end with a question mark. Art uses 100% of the grid dimensions and the same per-candy rotation.

The human question is clickable and sends automatically after four seconds unless tapped sooner. It travels from its resting spot to the opponent portrait and dissolves. The original control is emptied while the clone travels. Incoming replies expand/fade from the speaking player’s portrait to their side. Both players now use the same cream “Yes I do” reply, arrival, reading hold and dissolve before candy transfer. Both gold Go Fish replies use the same arrival animation; the player’s reply no longer uses the separate 450ms pop effect. Persistent incoming content stays hidden until arrival. Yes replies settle and dissolve; question bubbles remain when awaiting human action. On a failed human request, the gold reply arrives from the opponent portrait to the left of the Candy Dish as **[Name] said: NO, GO FISH!** and becomes clickable after settling. Clicking it draws one candy; the Candy Dish is also clickable, without a separate instruction pointing to it.

Go Fish is a compact gold text-only event button on the right: **[Player name] said:** above **NO, GO FISH!**. It uses the same formatting and wording as the opponent’s left-side reply, with only the speaker name changing. It has no fish illustration. Its visible shape is 23vw wide, minimum 22vw tall. The witch-hat fish SVG is still the shell menu icon; do not delete that asset.

## Design TODOs — October 9, 2026

These are future design tasks, not implemented behavior. Keep them distinct from the current presentation described elsewhere in this document.

- [ ] **Try direct candy departure.** Remove the initial flash/expand/contract of the source candy, pile or icon when a candy animation starts. Let the moving candy simply glide out of its source. Apply the experiment consistently to all transfer and fishing routes; retain the curved travel and destination treatment unless separately revised. This concerns the candy source pulse, not the speech-bubble arrival effect. Coordinate with the animation standardization work and its centralized settings.
- [ ] **Tone down the set-completed banner.** Make the set celebration quieter and less dominant. Exact styling remains to be tried; preserve clear recognition of the player, candy and completed set.
- [ ] **Make game over more celebratory.** Explore candy rain or another celebratory effect. Candy rain is an idea, not a settled design. Keep the result, ending reason and final hands readable, retain the ability to admire the board, and provide a reduced-motion presentation.
- [ ] **Resolve the game-owned top section.** Revisit the New Game / title / Rules arrangement and styling. Its final design is still undecided; keep the game self-contained and respect the shell boundary.
- [ ] **Create three selectable opponents with different algorithms.** Each opponent should have a distinct icon/name and strategy. Switching must be available at any time, including during a game, and use the newly selected strategy immediately without a new deal. Explore arrows to the left and right of the opponent portrait, cycling opponents, or clicking the portrait to open an opponent-choice popup. The popup is the latest alternative to try; the choice of selector is still open. See Opponent strategies for the state and strategy considerations.
- [ ] **Customize the human player.** Explore clicking the player portrait to open a popup for choosing an icon and name. Keep the configured identity consistent in the portrait label, question bubbles, set celebrations, result text and accessibility labels. The same portrait-click pattern may serve the opponent selector.

## Speaker consistency — implemented October 9, 2026

Candy questions share `fillRequestBubble`; Go Fish replies share `fillGoFishReply`; the arrival/hold/dissolve routine supports either speaker. Failed human requests retain their question until fishing begins. Opponent questions and Yes/Go Fish replies settle left; human questions and Yes/Go Fish replies settle right. Draw and transfer status placement follows the actor/speaker, rather than whichever button is visible. Neutral selection guidance sits on the human side. A tap on a requested human candy now starts the human Yes reply immediately, then the normal reply hold/fade precedes transfer. Existing four-second request hold and 500ms highlight delay are retained. Gameplay rules are unchanged; Good Fish remains pending.

## Quote speed toggle — implemented October 9, 2026

The temporary center control in the game-owned top row is **Quotes: Slow / Fast**, defaulting to Slow on page load. It can change during a round and retains its choice through a new deal in that page; no persistent settings storage or shell helper is added.

Slow preserves the existing question/reply travel and reading waits. Fast replaces outgoing and incoming quote movement with a 250ms stationary fade and uses a one-second question reading beat before the answer is available. Human questions auto-send after one second; opponent questions remain readable for one second before Yes/Go Fish replies start, with matching-slot taps available after 500ms so a deliberate human tap can bypass the remaining wait. Reply fades stay at 250ms; question reading time is one second. Fast human questions do not fly away when sent. After a failed human request, the question remains on the right beside the opponent’s left-side Go Fish reply until the human draws, in either speed mode. The retained question is disabled to prevent duplicate requests. Set celebrations and game-over behavior are unchanged. Candy source pulse, curved candy travel, destination dissolve, and their durations are unchanged. This setting applies only to quotes; reduced-motion behavior remains separate. Switching to Fast during a slow quote settles its current motion promptly, then uses fast pacing. Rules/New Game dialogs still pause motion and waits.

The quick values are grouped near the top of `candy-go-fish.js` in `quickQuotes`. This is a focused quote shortcut, not completion of the broader animation standardization plan. Verify with `verify-fast-quotes.cjs`, alongside existing Slow speech and full-round checks.

## Effective timing (Slow mode)

| Step | Nominal duration |
| --- | ---: |
| Opponent thinking | 1000ms |
| Human question before auto-send | 4000ms, tap can shorten |
| Question departure / opponent bubble arrival | 2500ms |
| Matching human slot readiness | 500ms after opponent question settles |
| Opponent request auto-gift | 4000ms after settling, including the 500ms readiness delay |
| Unsatisfied opponent request before Go Fish | 900ms after settling |
| Yes settled reading hold / fade | 900ms / 300ms |
| Source pulse / candy travel | 480ms / 1400ms |
| Post-transfer / post-draw result hold | 650ms / 1100ms |
| Opponent fishing announcement before pulse | 500ms |

These are not yet all centralized. JSON, JavaScript literals and CSS each own parts. Timer polling can stretch nominal waits under load. See survey and implementation handoff before refactoring.

## Artwork and movement

Empty-slot images default to 82% transparency; 100 makes them disappear. Default fitting enlargement is 150%. Six narrow bars use 225%: 100 Grand rotates −15°; 3 Musketeers, Butterfinger, Milky Way, Mounds and Snickers rotate −30°. Art remains centered and crops inside slots; badges remain outside the art clipping layer. Two active copies use offset images plus a count badge. More-than-two presentation requires review before four-copy rules are offered.

All four candy routes share source glow/pulse, prominent art, a curved accelerating path and a final fade/shrink into the destination. Hidden opponent draws use a neutral wrapper. Transfer art starts at configured candy rotation and ends upright. Completed-set celebration art is large and unrotated.

Rules and New Game confirmation pause native motion and waits. CSS turn/entrance effects currently have separate pause behavior. New Game confirmation can be cancelled; the finished-game New Game button deals directly. Generation tokens reject old-round callbacks. Dialogs trap Tab focus, outcome messages use a live region, and controls have visible focus. Reduced motion replaces travel with short stationary fades while keeping reading waits.

## Preserve the flash fixes

Known copy cleanup: the introductory dialog and Rules HTML still contain older “Got any?” wording. Actual requests now use the tappable/automatic question bubble. Update that instructional copy during an authorized UI pass; these docs describe the implemented interaction, not the stale instruction text.

Required rules/help update: when the pending Good Fish rule is implemented, explain it by name in the in-game Rules screen and all help text describing turn continuation. A completed set (including one from fishing) or a successful request keeps the turn; fishing without completing a set ends it. Drawing the requested type alone is insufficient. See the Rules and gameplay notes for suggested wording and ending-condition precedence. Deliver the explanation together with the gameplay change.

- Never call `play()` on every timer tick or on an already finished animation. Resume only paused effects.
- Hide/remove temporary speech layers before releasing their animation effects.
- Clear the old player question once its traveling copy takes over.
- Hide stationary reply content before constructing/measuring it, and reveal only at arrival.
- Clear/hide permanent Yes content before cancelling its final fade.

The regression reproduces timer lag and checks Red Vines question handoffs for both replies plus an incoming opponent question. Chrome DOM/frame checks do not substitute for iPhone Safari visual review.

Opponent request persistence: after a failed opponent request, keep the full question and candy image on the left while the human’s Go Fish reply appears on the right. The question remains through waits and Rules dialog redraws until the human clicks NO, GO FISH!; then clear it as the opponent draw begins. This applies to both quote speeds.

Successful opponent requests also retain the full question on the left while the human’s Yes reply arrives, holds and dissolves on the right. Clear the retained question only when the Yes reply finishes, before the candy transfer. This applies in Slow and Fast modes and survives local dialog pauses.

Fast-mode manual gift shortcut: when the human taps a matching candy in response to the opponent, show the human Yes reply immediately and start normal candy travel without the reply arrival/hold/fade or source-pulse delay. Keep the opponent question and human Yes reply visible during travel. This shortcut applies only to that human tap, not automatic gifts or NPC actions. Matching-slot taps become available 500ms after the question settles; an untapped request retains the one-second Fast reading hold.

Dots, Life Savers Gummies, Mallomars and Red Vines now also use a −30° rotation through per-candy JSON overrides, shared by grid, quote and transfer artwork. Their existing image scales remain unchanged. 100 Grand retains −15°.

Four-candy preview: three held copies now show a third rear image with twice the stacking offset and an additional −18° relative to the front image. Two-copy presentation is unchanged. The count badge remains authoritative, and the fourth copy collects the set immediately.
