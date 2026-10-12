# Candy Go Fish strategies: development and current implementation

October 12, 2026. This is the retained development record for the three strategies accepted by John. The live game uses local JavaScript algorithms. There are no AI calls during gameplay. Development experiments and simulation programs have been removed; the runtime algorithms remain under `js/`.

## Goals and game assumptions

The requested difficulty order was Ron + (beginner), Harry ++ (medium), Hermione +++ (expert), with a clear measured advantage at each step. All policies support ten candy types and either three or four copies per type. The current configuration uses three copies. Opening hands contain five candies and cannot contain a completed set.

The algorithm can request only a type it holds. A successful request transfers one candy and keeps the turn; completed sets collect automatically. Fishing ends the turn. An empty hand, empty dish or collection of all sets can finish the round. These rules make emptying a hand potentially harmful when behind in sets. The stronger policies account for some immediately ending requests, but neither is a solved optimal strategy.

The algorithms receive their own hand, public completed sets, the other player's card count, the dish count, set size, candy types and observed history. They never receive the other player's actual hand or the dish order. Own private draws are legitimate information; the other player's draw identity is removed before the strategy receives it.

## Ron +: beginner

Ron preserves the original weighted random policy. For each held type, a remembered clue that the other player holds it gives weight 8, an unknown type gives weight 2, and remembered absence gives weight 0.3. Being one candy from a set multiplies the weight by 1.8. Ron chooses randomly in proportion to these weights rather than always choosing the strongest candidate.

A public request establishes that the requester holds that type. Misses establish absence. Transfers and collected sets update those clues. A later opponent draw clears remembered absence clues because the missing type might have been drawn. This simple memory can miss better moves and does not optimize an ending position. Ron was retained unchanged as the beginner baseline.

## Harry ++: medium

Harry chooses the highest scoring legal request, breaking equal scores randomly. A conditional allocation model estimates the chance that the other player holds each candy. It counts possible unseen-card allocations consistent with public lower/upper count bounds, known completed sets, the total hidden hand count and the prohibition on active complete sets. Dense prefix/suffix dynamic programming makes those calculations fast.

For a candidate with success probability p, Harry adds:

- Success: 3p.
- Completion, if one candy would complete a set: p times 1 for three-copy sets, or p times 4 for four-copy sets.
- Otherwise, progress: p times the held count divided by set size.
- An immediately ending request: an additional +100p if the resulting set margin wins, -100p if it loses, or zero if tied.

The ending check covers completing the last cards in Harry's hand and taking the other player's last candy. This helps avoid a losing finish when another request is available. It does not plan every possible future ending; if only one type is held, the legal request may still lose.

The completion weights differ by set size because paired testing showed the best weighting for triples was not the best weighting for quadruples. Harry uses current public bounds rather than Hermione's full temporal inference.

## Hermione +++: expert

Hermione maintains 1,024 plausible hidden-card arrangements, called particles. Each represents possible counts in the other hand and the dish, not the real hidden state. Initialization uses her actual opening hand, the other hand's public size and the no-opening-set constraint. As history unfolds, public requests, misses, transfers and collected sets reject incompatible arrangements. Own private draws constrain the sampled dish; the other player's draws are sampled without revealing their identities.

Request choices also contain behavioral information. A heuristic model favors requests closer to completion and those suggested by public clues. The installed request bias is 4 with a 20% random mixture, allowing plausible unexpected choices instead of assuming perfect play. This is an approximate behavioral model, not knowledge of the player's mind or selected strategy.

Particles are resampled when necessary. If observations eliminate every surviving particle, the algorithm rebuilds from the current public-bound allocation model and records a reset. This fallback keeps the policy usable but can lose some temporal information. The model is therefore approximate and its confidence is not a guarantee.

For each request, the particles estimate success probability p, probability q that the other hand contains enough copies to finish the set, and expected pickup m (capped at the number needed). The installed score is:

`3p + 12q + m + immediate ending adjustment`

Progress and certain-success bonuses are both zero in the accepted settings. The ending adjustment uses the same immediate winning/losing margin principle, weighted by 100p. Hermione chooses the highest score and breaks ties randomly. She does not run full-round rollouts in the current game. Sampling hidden possibilities is still an ordinary JavaScript algorithm, not an AI service.

## Development process and why this version was selected

The first medium prototype improved on Ron inconsistently across set sizes. The first expert prototype sampled eight possible hidden arrangements and simulated candidate requests to the end of the round using medium play. Large baseline tests found the expert weaker than medium, especially for four-copy sets: roughly 47% against Harry for triples and 37% for quadruples.

Experiments compared immediate tactical scoring, completion and pickup priorities, larger 32/64-sample rollouts, temporal inference, request-choice evidence and different Harry completion weights. Increasing the original rollout count alone did not fix the ranking. Posterior-informed rollouts also underperformed the selected temporal scoring policy. A fractional-weight bug in an early exploratory request-bias screen was corrected before final tuning comparisons and held-out validation; that early screen was not the final evidence.

The allocation calculations were optimized, Harry's weights were calibrated separately for triples and quadruples, and Hermione's temporal scoring settings were selected from the stronger comparisons. Those solver settings were then frozen before testing fresh seeds. Development and ability validation covered 112,000 games in the principal studies, followed by 16,000 Hermione self-play games to examine starting order. Small smoke tests and browser checks were additional.

## Validation evidence

The final ability evaluation used 1,000 fresh independent deal seeds, 1000000 through 1000999, for each matchup and set size. Each deal was repeated four ways: both starting orders and swapped hands. Five pairings across two set sizes produced 40,000 games. This pairing reduces confounding by good hands or seat position. A win scores 1, a tie 0.5 and a loss 0; confidence intervals were calculated from deal-level averages because the four repetitions are correlated.

| Matchup | Three-copy score (95% interval) | Four-copy score (95% interval) |
|---|---|---|
| Harry against Ron | 63.24% (61.88–64.59%) | 72.86% (71.58–74.15%) |
| Hermione against Harry | 71.47% (70.33–72.62%) | 68.56% (67.29–69.83%) |

Each cell represents 4,000 games. Acceptance required scores of at least 60%, confidence lower bounds above 55%, and a measurable advantage separately in both starting orders. Random-opponent robustness checks also passed. The differences are much larger than sampling uncertainty, so the observed ranking is not simply lucky deals. Chance and remaining algorithm limitations both contribute to losses; these experiments do not isolate an optimal-play ceiling or prove how much loss is unavoidable.

Hermione self-play used another 2,000 seeds per set size, 2000000 through 2001999, for 8,000 games per set size. The starter scored 48.48% for triples (95% interval 46.99–49.97%) and 49.99% for quadruples (48.42–51.56%). There was no measured starting advantage. The triple result suggests only a small, borderline disadvantage to going first, not a strong general rule for human play.

The original concise report and strategy summary are retained here. Compact result records preserve parameters, hashes, aggregate scores and intervals without the retired simulation programs or large per-deal traces. They document what was measured; rerunning development would require a new or recovered simulation harness.

## Current game integration and file map

`index.html` loads the engine, original beginner support, shared inference modules, policies, adapter, candy rendering and main controller as regular scripts in dependency order. They also expose CommonJS exports for verification. Asset/config requests still resolve relative to the game document, even though scripts live under `js/`.

- `js/candy-go-fish.js`: controls the round, observes engine events and reads the selected opponent when a decision is due.
- `js/game-engine.js`: implements rules; it does not select opponent requests.
- `js/computer-player.js`: preserves Ron's original weighted-random policy.
- `js/strategies.js`: selects the policy and records actual decision diagnostics.
- `js/strategies/beginner.js`: adapts shared observations to Ron's simple clues.
- `js/strategies/medium.js` and `calibrated-medium.js`: Harry's scorer and accepted set-size weights.
- `js/strategies/temporal.js` and `calibrated-expert.js`: Hermione's scorer and accepted parameters.
- `js/shared/knowledge.js`: sanitized public view, bounds and current allocation probabilities.
- `js/shared/temporal-memory.js`: opening information and grouped observations, preserving only own private draws.
- `js/shared/temporal-beliefs.js`: Hermione's sampled hidden-card inference.

The configuration in `assets/json/game-config.json` maps Ron to beginner, Harry to medium and Hermione to expert. Plus signs appear only in the portrait display labels; ordinary names are used in questions and results. Portraits are in `assets/opponent-icons/`.

Switching opponents preserves cards, score, turn and observation memory. A chosen request finishes normally; the next decision uses the newly selected algorithm. Memory starts at the deal, so switching to Hermione midway allows her to process previous observations. Dialogs and game-over screens lock switching.

The adapter stores up to 100 actual decisions in the nonvisual `opponentDecisionTrace` JSON element, resets it on New Game and exposes `getTrace()` for checks. Diagnostics include candidate probabilities, scores or random weights and the selected choice. They do not reveal the player's actual hidden hand, but do reveal the computer's own counts, so they remain a development aid rather than visible player UI.

Earlier tests checked legal requests, card conservation, privacy, forced and avoidable losing finishes and probability behavior. The live memory adapter exactly matched the held-out runner on 40 further games. Browser checks cover all three profiles, three/four-copy sets, mid-round switching, layouts, complete play, replay, transfers and file opening. The cleanup must preserve those behaviors; changing folder names is not strategy retuning.
