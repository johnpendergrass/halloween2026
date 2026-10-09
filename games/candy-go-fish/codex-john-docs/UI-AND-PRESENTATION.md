# UI and presentation

Current implementation, October 9, 2026. Exact inventory and lifecycle findings are in [the animation survey](ANIMATION-SURVEY-2026-1009.md).

## Board and ownership

The game has a green card-table background and a fixed, non-scrolling 9:14 layout. The shell owns the purple Home/title/menu bar and bottom drawer. The game owns its smaller outlined New Game/Rules controls and local Go Fish title row. Do not add game controls to the shell or recreate the removed toolbar helper.

Opponent header: set total, centered circular friendly-witch portrait with overlapping configured name, then neutral wrapper pile with total-count badge. Its ten goals are two rows of five. Unknown goals show no active candy identity. Completed goals show art and green checks.

Human footer: the same set-total/portrait-name/pile layout, using a friendly ghost by default. Above it are ten fixed candy slots showing counts, faint empty identities and completed goals. The human pile is decorative and is not a transfer endpoint. Human transfers use their individual slots.

The active portrait/name has a large yellow halo and the active half brightens. Set totals do not glow. No textual turn indicator is displayed. Set-score labels use singular/plural. Profile names and portraits come from JSON.

## Middle and speech

The middle **always remains the Candy Dish** with wrappers and remaining count. There is no identifiable requested candy in it, on either player's turn. It can be clicked only for a human fishing draw.

One message/bubble uses the space beside the dish. Question bubbles use a cream background, dark text, gold edge, three rounded corners and one sharper corner. Contents are separate blocks: **[Name] asks:**, **Do you have any**, **[short candy name]**, candy art. Both question bubbles are 32vw wide. Their clipped artwork frame is 18vw tall with a soft shadow. Art uses 100% of the grid dimensions and the same per-candy rotation.

The human question is clickable and sends automatically after four seconds unless tapped sooner. It travels from its resting spot to the opponent portrait and dissolves. The original control is emptied while the clone travels. Incoming opponent bubbles expand/fade from their portrait to their resting spot. Persistent incoming content stays hidden until arrival. Yes replies settle and dissolve; question/Nope bubbles remain when awaiting human action.

Go Fish is a compact gold text-only event button on the right: **You say:** above **NOPE! GO FISH!**. It has no fish illustration. Its visible shape is 23vw wide, minimum 22vw tall. The witch-hat fish SVG is still the shell menu icon; do not delete that asset.

## Effective timing

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

- Never call `play()` on every timer tick or on an already finished animation. Resume only paused effects.
- Hide/remove temporary speech layers before releasing their animation effects.
- Clear the old player question once its traveling copy takes over.
- Hide stationary reply content before constructing/measuring it, and reveal only at arrival.
- Clear/hide permanent Yes content before cancelling its final fade.

The regression reproduces timer lag and checks Red Vines question handoffs for both replies plus an incoming opponent question. Chrome DOM/frame checks do not substitute for iPhone Safari visual review.
