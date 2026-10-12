# Candy Go Fish: the three opponent strategies

Current local game, October 12, 2026. All are JavaScript algorithms using their own cards and observed information, with ten candy types and three- or four-candy sets.

- **Ron +:** Original weighted random choices. Remembers simple possession/absence clues and favors requests close to completing a set.
- **Harry ++:** Estimates possession probabilities and chooses the best immediate request for success, completion and progress. Avoids an immediately losing finish when possible. Completion weighting differs between three- and four-candy sets.
- **Hermione +++:** Tracks 1,024 plausible hidden-card arrangements through past requests, transfers and draws. Uses those estimates to prioritize completing sets and collecting cards, with immediate end-game checks. This is an approximate algorithm, not a perfect strategy.

Switching opponents preserves the game and observed history; the next request uses the selected strategy. Fresh validation found a clear Harry-over-Ron and Hermione-over-Harry advantage for both set sizes. See [the test report](ABILITY-REPORT-2026-1012.md).
