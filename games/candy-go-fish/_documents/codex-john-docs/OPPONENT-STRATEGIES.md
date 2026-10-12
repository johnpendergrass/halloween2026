# Opponent strategies — implemented behavior and future ideas

Current October 12 implementation and folder layout: [current handoff](CURRENT-STATE-2026-1012.md). Earlier paths, prototype strategy descriptions and preview instructions below are historical where superseded.

**Historical October 9 material:** the current [October 11 handoff](CONTINUATION-2026-1011.md) supersedes conflicting runtime, presentation, backlog and publishing descriptions below.

Updated October 9, 2026. Preserve the distinction between implemented behavior and proposed difficulty levels. The animation refactor must not change the strategy.

## Opponent strategies

### Implemented strategy — Beginning (+) classification

The strategy receives only the opponent's own type-only hand and memory built from public observations. It does not receive the human hand or dish order. The engine separately accesses both hands to enforce moves; UI-visible quantities do not become strategy input.

Current choice is weighted random over held types: remembered human possession has weight 8, remembered absence 0.3, and an unknown type 2. Holding one fewer than the configured set size multiplies the weight by 1.8 (two for triples, three for the four-copy preview). These are heuristic weights, **not calculated probabilities**. Current code already uses some memory; the proposed 0% beginner memory has not been implemented.

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

Start with the configured copies per type, subtract the opponent's known holdings and publicly completed sets, and use remembered public evidence to constrain possible human/dish allocations. Track uncertainty or plausible allocations instead of treating invisible quantities as facts. Evaluate probabilities from that belief model; no access to actual hidden counts or dish order. Under the specified Good Fish rule (implementation pending), completing a set from the dish also earns another turn unless the game ends. A dish match alone does not earn another turn. Future strategy should value the extra turn from set completion as well as the set itself. The last dish draw ends the game after set collection, making late-game scoring especially relevant.

Every strategy must support **sets of three or four**. Use the configured set size for remaining-copy counts, distance to completion, and value calculations. Prefer `held === copiesPerType - 1` over hardcoded pair logic. The near-completion heuristic now uses the configured set size, and the preview supports three images in a slot. Difficulty algorithms and probability calculations remain future work.

### Proposed selector and variations

- [ ] Develop **three distinct opponents**, each with its own name, portrait and strategy algorithm. The earlier + / ++ / +++ memory, follow-up and probability ideas are inputs to this work; the final algorithms and identities are still to be designed.
- [ ] Add an easy selector: try arrows on either side of the opponent portrait, or clicking that portrait to open an opponent-choice popup. The popup is John's latest alternative; the final control is undecided. This remains a game-owned control, not a shell binary switch.
- [ ] Permit switching **at any time, including mid-game**, with the new strategy selected immediately and used for the next decision. Preserve the current opponent hand, completed sets, Candy Dish, turn and pending request; changing the persona must not redeal or duplicate a move already in progress. A request already chosen continues resolving, while subsequent choices use the newly selected algorithm. Coordinate selector behavior with asynchronous presentation and generation/cancellation handling.
- [ ] Define memory handoff when switching algorithms. Decide what public observations are retained and how each strategy's remembering/forgetting policy uses them; never reveal the human hand or private draw identities to the new opponent. This detail is still open, rather than an implemented policy.

These tasks supersede the earlier open question about restricting difficulty changes to the next deal. The UI design TODOs are recorded in [UI and presentation](UI-AND-PRESENTATION.md).

Other future switches: ten/eleven types and sets of three/four. Eleven prevents ties only when all eleven sets are actually claimed. Because the game also ends on an empty hand/dish, **an eleven-type variant could still tie in its current ending rules**. It needs an extra asset/slot and scoring review. Four-copy sets need quantity presentation, strategy, and tests beyond merely changing the JSON number. Neither variation is validated or available in the demo.
