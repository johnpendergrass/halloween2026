# Rules and gameplay

Current base game, October 9, 2026. Display names are configurable; `human` and `wendy` are role keys, not fixed names.

## Deck, turns and scoring

- Ten types, three copies each: 30 candies total. Alternate dealing five to each player; 20 remain in the shuffled Candy Dish. First player is random.
- Only request a type currently held in the active hand. Completed sets are removed from active hands and cannot be requested.
- A successful request transfers **one** matching candy, regardless of how many the other player holds. The requester keeps the turn and may repeat that type or choose another held type.
- A failed request allows exactly one random Candy Dish draw. **Every draw ends the turn**, including a match to the request or a draw completing a set.
- Three identical candies form one set automatically, worth one point. Initially dealt triples also collect automatically, without the later earned-set popup.
- There is no hand refill, move penalty, timer score or bonus. Presentation auto-actions are conveniences, not gameplay penalties.
- End when the dish empties, either active hand empties, or all ten sets are claimed. Receiving the final drawn candy and collecting its possible set happen before end-game evaluation.
- End-reason priority: empty dish, then all sets, then empty hand. Most sets wins. A tie is permitted even with an odd type count if the game ends early.

## Human requests

The unselected turn says **Choose a candy from your hand.** A held slot can be selected with touch or keyboard. It highlights immediately and creates a clickable question bubble with human name, question, short candy name and image. Selecting another type replaces it and restarts the four-second auto-send wait. Tapping the question sends immediately.

The question travels to the opponent portrait and dissolves. Only then is the request resolved. If the opponent has the candy, the **Yes I do** bubble arrives, remains readable, then fades; the opponent pile pulses and one candy travels to the human's corresponding slot. The human keeps the turn.

If the opponent has none, **Nope. Tap the candy dish to Go Fish!** arrives from the portrait and remains beside the dish. The dish becomes tappable after arrival. One candy is drawn and travels to its slot, then the turn switches. Buttons and other selections lock while a move resolves.

## Opponent requests

After a thinking delay, the opponent chooses a held type using only their own hand and public memory. A question bubble expands/fades from their portrait to beside the dish. No matching human slot highlights during this arrival.

If the human has the type, the matching slot highlights and becomes tappable half a second after the question settles. Tapping gives one candy immediately; otherwise the gift begins automatically four seconds after settling. Other human slots remain disabled. Repeated taps cannot duplicate the transfer. Source pulse and travel make the automatic gift visible. The opponent retains the turn unless the game ended.

If the human has none, the question remains with its candy image. After a short settled hold, the gold button appears: **You say: NOPE! GO FISH!**. Tapping it permits the opponent to draw one private candy. An unidentified wrapper travels to their pile. Any completed set is then shown publicly. Fishing ends their turn.

## Sets, results and privacy

An earned set opens a celebration with the configured player's name, large candy image and **Collected all 3 [long candy name] candies!** Continue or outside tap resumes play. A final earned set celebrates before the result banner. Set size wording comes from state, though a four-copy variant is not yet a validated UI/strategy feature.

The result banner occupies the middle, leaving both hands visible for admiration. It names the winner or tie, the ending reason, and totals such as **Player had 6 candy sets; Wendy had 3.** Empty-hand results include a separate **Candy Dish had 1 candy left.** / **… 2 candies left.** line. Other endings omit that line. New Game deals immediately from the result banner. All player-facing nouns use candy/candies.

The opponent's active type identities are hidden; only total hand count and completed goals are shown. Their decision code cannot inspect the human hand or dish order. Human slots are visible to the human but are treated as private from the opponent. Draw identities stay out of public history; public completed-set events still reveal their type.

## Future variations, not implemented

Ten/eleven types and sets of three/four were proposed as two on/off game options. Current shell/helper limitations prevent working settings integration. Four-copy support also requires quantities, strategy and tests; eleven types require another asset/slot and scoring review. Keep the base rules stable during animation work. Difficulty levels and expanded candy catalog are separate later tasks.
