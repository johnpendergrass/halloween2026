# Go Fish Candy Edition — end-of-first-day handoff

**Historical October 9 material:** the current [October 11 handoff](CONTINUATION-2026-1011.md) supersedes conflicting runtime, presentation, backlog and publishing descriptions below.

Updated October 9, 2026. This is the authoritative end-of-day summary for the game as it runs now, the remaining design work, and integration steps. It supersedes conflicting earlier current-state descriptions and animation-survey assumptions. Historical documents remain useful records, not instructions to restore an old interface.

## Checkpoint and scope

The local commit for this handoff is titled **end of first day - fast vs slow working - 3 vs 4 sets working - needs tuning.** Resolve its hash in Git history; the chat records it after creation. Previous baseline: `0f04d349c6a4722354c71d0cd7e690cebc2d7eaa` (Document Candy Go Fish and hand off animation standardization).

**Do not push until John explicitly requests it.** Tristan is reviewing an earlier published build. The current work includes runtime changes, configuration and generated companion, documentation, regression scripts and screenshots. Three unused processed toy images were moved from the unused candy-image folder into `assets/toy-images-processed`; these are not used by the game.

## Playable rules and the important pending exception

The original intended base is ten candy types and sets of three. **The current demo is a four-candy visual trial:** `rules.copiesPerType` is 4, so there are 40 candies, each player starts with five and the Candy Dish starts with 30, before any initially dealt sets collect. The engine uses this one value both to create copies and to decide set completion. Restore it to 3 and regenerate the companion to return to 30 total candies and 20 in the dish. There is no in-game 3/4 switch yet.

- First player is random. Request only a type currently held in the active hand.
- A success transfers exactly one candy and keeps the requester's turn. They may request that type again or another held type.
- A miss leads to one draw from the shuffled Candy Dish.
- **Current runtime still ends every fishing turn. Good Fish is specified but NOT implemented.** The approved rule is that completing a set by any means, including a fishing draw, or successfully requesting a candy keeps the turn. A draw without completing a set ends it; drawing the requested type alone is insufficient.
- Completing the configured number of matching candies removes them from the active hand and awards one set. Initial dealt sets also collect, without the earned-set dialog.
- End when the dish empties, either active hand empties, or all ten sets are claimed. No refill. Collect a possible final-draw set before evaluating the ending; a final earned set celebrates before results.
- Ending priority is empty dish, then all sets, then empty hand. Most sets wins; ties are possible, including in a future eleven-type variant when the game ends early.
- Opponent active identities stay hidden. The human sees their own candy slots. Public goals show completed sets; both piles show total hand counts. The strategy cannot inspect the human hand or dish order.

Implement Good Fish as a separate engine change and update all in-game Rules/help copy at the same time. The live Rules currently truthfully describe unconditional fishing turn end; documentation of the desired rule must not be mistaken for runtime support.

## Current screen

The shell owns the purple Home/title/menu bar and bottom drawer. The registered title is **Go Fish Candy Edition**, slot 8 with the friendly Halloween fish icon. The game-owned top row is New Game, **Quotes: Slow / Fast**, Rules. The temporary Quotes control replaces the local Go Fish title; the shell title is unchanged.

The green table has an opponent header and human footer: **SETS WON** with a slightly larger number below, circular portrait/overlapping name, and wrapper pile/total-count badge. Scores do not glow. The active portrait/name gets a yellow halo and that half of the board brightens. Wendy and Player are defaults from configuration, not mandatory display names.

Each side has ten goal slots in two rows of five. Human slots show faint images for absent types, candy count badges, and one/two/three images for held candies. Completed sets show green checks. Opponent slots reveal only completed identities. The human decorative pile is not the transfer destination; human candy transfers use the corresponding slot.

The center dish is centered between equal 30vw side columns, with a 23vw middle column and 2vw gaps. **All opponent speech settles left; all human speech settles right.** Neutral selection guidance is on the human side. The center always remains an unidentified Candy Dish; requested candy belongs in a question box.

### Shared quote styles and persistence

Questions share a cream design with three rounded corners and one sharper corner, mirrored for the human. They contain `[Name] asks:`, `Do you have any`, `[short candy name]?`, and candy art. They are about 20% shorter than the earlier full-height boxes. Artwork is placed first in the DOM and on the lower visual layer, in a 16vw absolute frame; 11vw of bottom space lets a small part overlap the text. Text stays above the image. Question width is 30vw; art dimensions and rotation inherit the grid's settings.

Both Yes replies share a cream `[Name] said:` / `Yes I do` presentation. Both Go Fish replies share a gold `[Name] said:` / `NO, GO FISH!` button. Only the speaker name/side changes. A failed human request leaves their disabled question on the right alongside Wendy's left-side reply until they draw. Wendy's unanswered question stays left alongside the human's right-side Go Fish button until that button is clicked. For a successful Wendy request, her question stays left while the human Yes reply appears right, then clears after the reply finishes. The manual Fast exception below keeps both visible during the candy flight.

The opponent Go Fish reply draws for the human when clicked. The center dish also draws for the human, with no separate instruction advertising that alternative. The human Go Fish reply sends Wendy fishing. Draw/transfer phases lock controls so repeated clicks cannot duplicate moves.

## Quotes: Slow / Fast

Default is Slow on page load. The choice can change during a game and survives a new deal on the same page. It is not saved persistently. Native button semantics plus `aria-pressed` identify whether Fast is selected.

| Step | Slow | Fast |
| --- | --- | --- |
| Human selected question before auto-send | 4000ms; tap can send sooner | 1000ms; tap can send sooner |
| Incoming question/reply motion | 2500ms portrait-origin travel | 250ms stationary fade |
| Human outgoing question | Travels/dissolves to Wendy | Remains stationary; no outgoing flight |
| Opponent settled question before automatic Yes reply | 4000ms | 1000ms |
| Opponent settled question before Go Fish reply | 900ms | 1000ms |
| Matching human slot tap readiness | 500ms after question arrival | 500ms after question arrival |
| Ordinary Yes reading/fade | 900ms / 300ms | 900ms / 250ms |
| Candy source pulse/travel | 480ms / 1400ms | Same, except explicit manual gift shortcut |

Fast values live near the top of `candy-go-fish.js` in `quickQuotes`: `fadeMs: 250`, `holdMs: 1000`. Fast quote waits use the quick profile, while actual candy pulse/travel helpers remain separate. Switching to Fast during Slow quote motion settles that motion promptly. Switching back affects following steps; a running short fade is not lengthened. Local dialogs pause motion and waits. Reduced-motion preferences have their separate short stationary effects.

**Human manual gift shortcut, Fast only:** when Wendy requests a held candy and the human taps its enabled slot, show the human Yes reply immediately and begin normal candy travel without waiting for reply arrival/hold/dissolve or the preliminary source pulse. Keep Wendy's question and the human Yes reply visible during travel, then remove them. The click is the confirmation. This exception does not apply to an untapped automatic gift, Wendy's own transfers, or dish draws. Curved travel duration/easing/dissolve remain unchanged.

Opponent thinking (1000ms), post-transfer/result waits, and user-dismissed celebration dialogs are not shortened by the quote toggle. `waitActive` still counts nominal 40ms ticks rather than elapsed active time, so heavy load can stretch reading holds. The broader animation standardization remains pending.

## Candy presentation and four-copy support

JSON is authoritative for display settings. Short names are curated, unique after normalization and at most 16 characters; long names serve accessibility and celebrations. Questions alone append a question mark. Example: Life Savers Gummies / LS Gummies.

All types now tilt −30° except 100 Grand at −15°. Six narrow bars retain 225% scale; Dots, Life Savers Gummies, Mallomars and Red Vines retain the 150% shared scale. Grid/quote art stays consistent; the original PNG files are unchanged. Empty identities default to 82% transparency; 100 hides them entirely.

Pairs use opposite 0.6vw offsets and an extra −9° rear tilt. Three copies add a third rear image with twice the offset and −18° relative tilt. John likes the visibly overlapping stack; keep it. Badges give the exact count, and the fourth copy completes/removes the set. The fourth-copy celebration and live Rules/intro wording use the configured number. Wendy's current near-completion multiplier also uses `copiesPerType - 1`, rather than always favoring a pair.

All candy routes use prominent curved, accelerating travel with destination fade/shrink. Human-to-opponent, opponent-to-human and dish-to-human show the candy identity. Opponent private draws use an unidentified wrapper. The manual Fast gift skips only the lead-in, not the actual flight.

## Set celebration and game over

Earned sets open a dialog with the configured player name, candy image and `Collected all [configured count] ... candies!`. Continue or outside tap resumes play; it has no automatic timeout. Initial sets skip that dialog.

Game over is a central banner leaving both hands visible for admiration. Winner/tie uses configured names. The reason begins **Game over because** with no colon, followed by the named ending, such as `Wendy ran out of candies`. Empty-hand endings add `Candy Dish had 1 candy left.` / plural; other reasons omit that second line. Totals use configured names, such as `Player had 6 candy sets; Wendy had 3.` The compact New Game button deals immediately. Use candy/candies throughout, not cards.

## Opponent strategy now and planned opponents

Current strategy is Beginning (+): weighted random over its held types, with remembered human possession weight 8, absence 0.3, unknown 2; being one short of a set multiplies by 1.8. It already has some public memory, so it is not the proposed 0%-memory beginner yet. No required repeat request is implemented. Receiving one candy clears that type's remembered human possession, even though the human may hold another.

Preserve John's Snickers example: Wendy starts with one, receives one from a human holding two, switches requests, misses, and leaves the human able to request twice and claim the set. Stronger opponents should evaluate a follow-up request and the risk of exposing a near-complete group.

Future memory proposals: 0% / 50% / 100% for + / ++ / +++; medium/advanced may always remember directly given candies. Define clue storage/forgetting and invalidation explicitly. Perfect recall means recall of public evidence, not knowledge of private draws. Probability/value ideas include chance of a successful request, estimated remaining dish composition, set completion, turn retention under Good Fish, and vulnerable holdings. All algorithms must work for triples and quadruples.

## TODOs and integration steps

- [ ] **Tune compact question boxes on actual iPhone Safari.** Review every candy, long/short names, rotated packs, three-image slots and readability over artwork. Allow modest overlap without hiding punctuation or names. Preserve font/target requirements and layout without scrolling.
- [ ] **Implement Good Fish.** In `game-engine.js`, collect draw sets before choosing the next actor, retaining the actor only when a set completes; ending conditions still take priority. Successful requests already retain turns. Cover both roles, three/four copies, requested-type draw without a set, empty dish/hand, and final set celebration order. Then update Rules, introductory/help text and UI tests together.
- [ ] **Standardize presentation configuration and lifecycle.** Read the earlier survey/handoff as a baseline inventory, then resurvey these newer routes, retained questions, speed toggle and manual Fast shortcut. Group motion/pacing settings; retain quote-vs-candy separation and explicit manual exceptions. Replace nominal-tick waits with paused active-time measurements only after updating accelerated test harnesses. Preserve generation invalidation, hidden-before-cancel cleanup and no completed-effect replay. Generalized `presentSpeech` and `quickQuotes` are partial steps, not the full refactor.
- [ ] **Try removing candy source flash/expand/contract.** John wants direct departure as an experiment on all routes. Only manual Fast human gifts currently skip the pulse. Implement the global experiment via the centralized motion settings after retaining a rollback checkpoint.
- [ ] **Tone down set celebration.** Keep the completed player/type clear but make its banner less dominant. Preserve user-controlled continuation and final-set ordering.
- [ ] **Make game over more celebratory.** Explore candy rain or another effect, keeping the final board/result readable and providing reduced motion. Candy rain is an idea, not a final requirement.
- [ ] **Resolve the top controls.** Final New Game/title/Rules arrangement is undecided. Move Quotes speed into a later game-owned settings UI; do not restore the removed shell toolbar/helper.
- [ ] **Three distinct selectable opponents.** Design identities/portraits and three algorithms. Try arrows beside the portrait or portrait-click selection popup; latest suggested alternative is the popup. Switching is permitted mid-game: keep hands, sets, dish, turn and pending action, select the new algorithm immediately for subsequent decisions, and never duplicate/redeal a move already resolving. Define public-memory handoff without private-state leakage. Runtime currently caches names/profile values at load; hot switching requires updating all bubbles, labels, scores, results and accessibility text deliberately.
- [ ] **Human profile customization.** Explore portrait-click popup for icon/name, sharing a pattern with opponent selection. Update every identity-dependent UI surface and decide whether game-owned persistence is needed within shell constraints.
- [ ] **Expose 3/4 and 10/11 variations properly.** Both engine set sizes now work and have tests; current value 4 is a preview, not a selector. Add game-owned variation controls with a clear new-deal policy, regenerate no static data on user clicks, and test distribution/quantity/result wording. Eleven types require an extra asset/slot/layout review and do not guarantee no early-ending ties. Score comparability between modes needs a deliberate shell/helper integration decision.
- [ ] **Refresh remaining help copy.** Older Got any? wording still appears in intro/Rules; the actual flow uses question bubbles and auto-send. Explain speed/manual shortcuts appropriately and add Good Fish only with its runtime implementation.
- [ ] **Finalize shell pause/settings exception.** John does not want a dedicated Pause button. Local dialogs pause; the shell drawer does not notify/pause the iframe and can cover the board while automatic presentation continues. There are no timed penalties. Document the exception without inventing a helper API. Future shared settings/score changes require coordinated shell work.

Implement these in separate reviewable steps rather than combining strategy, rules, layout and timing into one large rewrite. Keep the user's decisions, existing regression coverage and local rollback checkpoints.

## Files and implementation map

| File | Role |
| --- | --- |
| `index.html`, `demo.html` | Game-owned markup/dialogs and standalone preview |
| `candy-go-fish.css` | Fixed layout, shared/mirrored quotes, compact art layers, stacked slots and effects |
| `candy-go-fish.js` | State orchestration, speed toggle, speech/transfer sequencing, input locks, overlays and results |
| `game-engine.js` | Deck, legality, one-copy requests, set collection, current fishing/end rules; Good Fish change belongs here |
| `computer-player.js` | Restricted-information memory/weighted strategy; `choose(hand, memory, random, copiesPerType)` |
| `assets/json/game-config.json` | Set size, static profiles, catalog, display values and many presentation timings |
| `assets/json/config-data.js` | Generated fallback for direct file opening/fetch failure |
| `codex-john-docs/` | Handoff, source surveys, tests and development screenshots |

UI uses `phase`, `generation`, local overlay pause, `giftWait`, `playerRequestWait`, explicit speaker placement, retained questions and a one-shot `fastManualGift` marker. Both reply speakers share `presentSpeech`. `heldOpponentQuestion` preserves a question alongside the player's Yes reply and is removed after the reply or manual flight, and on new-game reset. Other retained question state clears on draw/new deal. Repeated clicks cannot duplicate engine mutation.

## Shell integration and preview

Read `games/README - game design requirements.md`. The game panel is 9:14 inside the shell, with no scrolling; the shell overall is 9:16. Width-based text and minimum target constraints remain binding. Runtime imports only the existing `../game-helper.js` score API. At finish it calls `Halloween.reportScore(humanSetCount, 'human–opponent')` once; shell stores best five nonzero scores. No direct parent access/messaging/localStorage is introduced. Three/four modes currently share the game's score bucket; review this before finalizing selectable variants.

Root `games.json` registers slot 8, `title` and `short_title` as Go Fish Candy Edition, and `games/candy-go-fish/assets/halloween-fish.svg`. The shell banner uses short_title. Do not add game-specific controls to the purple bar. Helper/settings/audio additions are not part of this checkpoint.

From repository root: `python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1`. Reuse an existing server. Preview `/games/candy-go-fish/demo.html`, direct `index.html`, or root shell/slot 8. Direct file opening uses the companion; HTTP prefers JSON. Loopback cannot be reached by iPhone; use the established LAN preview or a later authorized Pages push.

After JSON edits, run `node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs`; do not edit the companion independently. Before any later publishing, update the repository's current cache stamps consistently in root CSS/script references and game-loading code, verify shell/registry, and push only with explicit authorization.

## Verification and limitations

Engine/name scripts use Node. Browser tests require localhost:8098, bundled Playwright and local Chrome paths currently hardcoded in the harness; adjust those paths on a new machine, not runtime code.

- `validate-candy-names.cjs`: catalog identity/short-name validation.
- `verify-engine.cjs`: legality, one-copy requests, endings, final draw, privacy/memory/conservation, and 1,000 simulated games each for three and four copies.
- `verify-browser.cjs`: phone/desktop target/layout checks, alternate identities, full four-copy UI round, celebrations/results, replay and file opening.
- `verify-speech.cjs`: real-time Slow sequencing, highlight/taps, source/destination timing, pauses, quote size/rotation and Yes before transfer.
- `verify-speech-redraw.cjs`: timer lag, completed-effect replay, cancellation visibility and intentional retained questions distinguished from flashes.
- `verify-fast-quotes.cjs`: Fast one-second question hold, Yes/Go Fish for both speakers, retained questions/dialog pause, human manual immediate gift, unchanged candy travel and mid-flight speed switching.
- `verify-go-fish-reply.cjs`: shared gold box formatting, side placement and exactly one draw from reply/dish.
- `verify-shell.cjs`: registry/menu/iframe check when shell or registration changes.

Additional focused visual checks verified every candy question at 320/338/547px with breathing room/text layering/question marks, score/result fit, and three-image hand plus fourth-copy celebration. Screenshots are development artifacts, not game assets. Some use Casper/Hazel or synthetic fixture hands; they are not new default identities or saved real games.

Automated checks establish correctness/layout, not optimal pacing, aesthetics, strategy or iPhone compositor behavior. Four-copy support is a working preview that still needs subjective tuning. Good Fish, selectable profiles/difficulties, eleven types, candy rain and full timing centralization are still pending.
