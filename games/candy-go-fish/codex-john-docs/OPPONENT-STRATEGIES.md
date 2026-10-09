# Opponent strategies — implemented behavior and future ideas

Updated October 9, 2026. Preserve the distinction between implemented behavior and proposed difficulty levels. The animation refactor must not change the strategy.

## Opponent strategies

### Implemented strategy — Beginning (+) classification

The strategy receives only the opponent's own type-only hand and memory built from public observations. It does not receive the human hand or dish order. The engine separately accesses both hands to enforce moves; UI-visible quantities do not become strategy input.

Current choice is weighted random over held types: remembered human possession has weight 8, remembered absence 0.3, and an unknown type 2. Holding exactly two multiplies the weight by 1.8. These are heuristic weights, **not calculated probabilities**. Current code already uses some memory; the proposed 0% beginner memory has not been implemented.

Human requests and candies transferred to the human mark possession. A failed opponent request marks absence. A human draw clears absence evidence without disclosing its identity. Completed sets clear related clues. Receiving one candy from the human clears known possession of that type, even though the human might still have another. There is no required repeat request.

John's example: Wendy requests Snickers while holding one; the human holds two and gives one. Wendy now has two, the human one. Wendy sometimes switches requests, misses, and hands the turn back. The human can then request Snickers twice and take the set. Record this behavior as **Beginning (+)**, and the stronger follow-up below as a higher level.

### Proposed stronger follow-up — ++ / +++

After receiving a candy without completing a set, favor asking for that type again, especially when one short of completion. Consider the immediate scoring opportunity and the risk of exposing a near-complete group before giving the human another turn. In John's example, the repeat wins the set. From the opponent's limited knowledge, receiving one does not always prove the human still holds another; the remaining copy could be in the dish. Use public evidence rather than cheating.

### Proposed memory levels

John suggests **0% / 50% / 100%** remembrance for **+ / ++ / +++**. ++/+++ may additionally always remember a candy directly given to the human until later evidence invalidates that knowledge. Clarify whether that guaranteed direct-transfer memory overrides the general percentage.

Define forgetting consistently: chance to store a clue when observed, or chance to lose a stored clue on relevant later moves. Avoid independently resampling an old fact on every decision, which could make forgotten information reappear. Perfect memory means perfect recall of public observations, not knowledge of hidden draws. Transfers and completed sets update/invalidate clues; unknown draws weaken absence evidence.

### Proposed probability and value calculations

John suggests estimating the percentage chance of obtaining a type from the human's hand or the Candy Dish, then valuing the outcome. Distinguish these questions:

- **Request success:** probability the human holds at least one of the chosen type. The human does not supply a random candy; a successful request transfers one matching copy.
- **Dish draw:** estimated proportion of that type in the dish, based on known counts and plausible hidden allocations. A fishing draw is from the shuffled dish, not a request for a particular type.
- **Decision value:** immediate set completion, progress toward a set, another request after success, ending the turn after fishing, and revealing a vulnerable holding to the human.

Start with the configured copies per type, subtract the opponent's known holdings and publicly completed sets, and use remembered public evidence to constrain possible human/dish allocations. Track uncertainty or plausible allocations instead of treating invisible quantities as facts. Evaluate probabilities from that belief model; no access to actual hidden counts or dish order. A dish match never grants another turn under these rules, though it may finish a set. The last dish draw ends the game after set collection, making late-game scoring especially relevant.

Every strategy must support **sets of three or four**. Use the configured set size for remaining-copy counts, distance to completion, and value calculations. Prefer `held === copiesPerType - 1` over hardcoded pair logic. The current `quantity === 2` heuristic and two-image UI are triple-specific and need revision before a four-copy variant is offered.

### Proposed selector and variations

Arrows near the opponent would cycle **+**, **++**, **+++**. This selector is a future in-game control, not an implemented feature or shell binary switch. Decide whether a level applies at the next deal or can change mid-round.

Other future switches: ten/eleven types and sets of three/four. Eleven prevents ties only when all eleven sets are actually claimed. Because the game also ends on an empty hand/dish, **an eleven-type variant could still tie in its current ending rules**. It needs an extra asset/slot and scoring review. Four-copy sets need quantity presentation, strategy, and tests beyond merely changing the JSON number. Neither variation is validated or available in the demo.
