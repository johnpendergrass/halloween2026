# Rules and gameplay

**October 11 update:** [Current continuation](CONTINUATION-2026-1011.md) supersedes the quote-mode/timing descriptions below. Slow mode and the speed toggle have been deleted; quotes fade in place using the former Fast behavior. Candy flights remain.


Base game rules, updated October 9, 2026. The Good Fish rule below is approved as a specification; its runtime implementation is pending. Display names are configurable; `human` and `wendy` are role keys, not fixed names.

## Deck, turns and scoring

- Ten types, three copies each: 30 candies total. Alternate dealing five to each player; 20 remain in the shuffled Candy Dish. First player is random.
- Only request a type currently held in the active hand. Completed sets are removed from active hands and cannot be requested.
- A successful request transfers **one** matching candy, regardless of how many the other player holds. The requester keeps the turn and may repeat that type or choose another held type.
- A failed request allows exactly one random Candy Dish draw. Under the **Good Fish rule**, a draw that completes a set keeps the turn; a draw that does not complete a set ends the turn. Merely drawing the requested type does not keep the turn.
- Three identical candies form one set automatically, worth one point. Initially dealt triples also collect automatically, without the later earned-set popup.
- There is no hand refill, move penalty, timer score or bonus. Presentation auto-actions are conveniences, not gameplay penalties.
- End when the dish empties, either active hand empties, or all ten sets are claimed. Receiving the final drawn candy and collecting its possible set happen before end-game evaluation.
- End-reason priority: empty dish, then all sets, then empty hand. Most sets wins. A tie is permitted even with an odd type count if the game ends early.

## Good Fish rule

A player's turn continues when either:

- They complete a set, however the set is completed.
- They successfully request a candy from the other player.

When fishing, completing a set with the drawn candy keeps the turn. A draw that does not complete a set ends the turn, even if it matches the requested candy. This applies equally to both players and to sets of three or a future four-candy variation.

Game-ending conditions still take priority: collect any set from the last candy before evaluating the result, but do not start another turn if the Candy Dish or either active hand is empty, or all sets are complete. No hand refill is introduced.

### Required in-game Rules and help wording

When implementing this rule, include it by name in the game's Rules screen and any help screen explaining turns. Suggested player-facing text: **Good Fish rule: Your turn continues when you complete a candy set or successfully request a candy from the other player. If you Go Fish and your drawn candy completes a set, keep playing. Otherwise, your turn ends.** Explain that drawing the candy you requested only keeps the turn if it completes a set, and that game-ending conditions still apply. Use candy/candies throughout. Update the help text together with the gameplay implementation so the explanation matches the running game.

**Implementation pending:** the current engine still ends every fishing turn. Update `game-engine.js` so `fish(state)` collects sets before deciding whose turn follows, retaining the drawing player when a set event occurs. Preserve ending checks, privacy and celebration sequencing. Verify both players' set-completing and non-completing draws, requested-type draws without a set, successful requests, final-dish/empty-hand endings, and three/four-copy engine configurations. Update runtime Rules text and existing engine/UI checks with the implementation.

## Human requests

The unselected turn says **Choose a candy from your hand.** A held slot can be selected with touch or keyboard. It highlights immediately and creates a clickable question bubble with human name, question, short candy name and image. Selecting another type replaces it and restarts the four-second auto-send wait. Tapping the question sends immediately.

The question travels to the opponent portrait and dissolves. Only then is the request resolved. If the opponent has the candy, the **Yes I do** bubble arrives, remains readable, then fades; the opponent pile pulses and one candy travels to the human's corresponding slot. The human keeps the turn.

If the opponent has none, **[Opponent name] said: NO, GO FISH!** arrives from the portrait as the prominent gold Go Fish button on the left of the Candy Dish. The player’s Go Fish response to an opponent request remains on the right. The human’s question remains visible on the right until they draw. Once the reply settles, tapping it draws one candy. The Candy Dish also becomes tappable, but no separate message directs the player to it. One candy is drawn and travels to its slot, then the human keeps the turn if that draw completes a set; otherwise the turn switches (Good Fish rule; implementation pending). Buttons and other selections lock while a move resolves.

## Opponent requests

After a thinking delay, the opponent chooses a held type using only their own hand and public memory. A question bubble expands/fades from their portrait to beside the dish. No matching human slot highlights during this arrival.

If the human has the type, the matching slot highlights and becomes tappable half a second after the question settles. Tapping starts the human’s “Yes I do” reply immediately; otherwise that reply begins automatically four seconds after settling. It arrives on the right from the human portrait, holds and dissolves like the opponent’s Yes reply, then one candy transfers. Other human slots remain disabled. Repeated taps cannot duplicate the transfer. Source pulse and travel make the automatic gift visible. The opponent retains the turn unless the game ended.

If the human has none, the question remains with its candy image. After a short settled hold, the gold button appears: **[Player name] said: NO, GO FISH!**. Tapping it permits the opponent to draw one private candy. An unidentified wrapper travels to their pile. Any completed set is then shown publicly. Under the Good Fish rule, completing a set from the draw keeps their turn; otherwise fishing ends it (implementation pending).

## Sets, results and privacy

An earned set opens a celebration with the configured player's name, large candy image and **Collected all 3 [long candy name] candies!** Continue or outside tap resumes play. A final earned set celebrates before the result banner. Set size wording comes from state, though a four-copy variant is not yet a validated UI/strategy feature.

The result banner occupies the middle, leaving both hands visible for admiration. It names the winner or tie, the ending reason prefixed with **Game over because**, and totals such as **Player had 6 candy sets; Wendy had 3.** Empty-hand results include a separate **Candy Dish had 1 candy left.** / **… 2 candies left.** line. Other endings omit that line. New Game deals immediately from the result banner. All player-facing nouns use candy/candies.

The opponent's active type identities are hidden; only total hand count and completed goals are shown. Their decision code cannot inspect the human hand or dish order. Human slots are visible to the human but are treated as private from the opponent. Draw identities stay out of public history; public completed-set events still reveal their type.

## Future variations, not implemented

Ten/eleven types and sets of three/four were proposed as two on/off game options. Current shell/helper limitations prevent working settings integration. Four-copy support also requires quantities, strategy and tests; eleven types require another asset/slot and scoring review. Keep the base rules stable during animation work. Difficulty levels and expanded candy catalog are separate later tasks.

Opponent request persistence: after a failed opponent request, keep the full question and candy image on the left while the human’s Go Fish reply appears on the right. The question remains through waits and Rules dialog redraws until the human clicks NO, GO FISH!; then clear it as the opponent draw begins. This applies to both quote speeds.

Current visual trial: the demo is temporarily configured for four candies per set, with 40 candies total and 30 in the Candy Dish after dealing. Three held copies display as three stacked images. The intended base game remains ten types with sets of three; change copiesPerType back to 3 and regenerate the companion to restore it. Other turn/end rules are unchanged.
