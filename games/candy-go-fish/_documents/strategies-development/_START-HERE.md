# Start here: opponent strategies

This folder explains the accepted Ron, Harry and Hermione strategies, how they were developed, and how they work in the current game.

## Reading guide

1. [Strategy summary](STRATEGY-SUMMARY.md) — a short explanation of each opponent.
2. [Development and implementation](DEVELOPMENT-AND-IMPLEMENTATION.md) — the detailed record: algorithms, weights, experiments, validation and current code locations.
3. [Ability and starting-player results](ABILITY-REPORT-2026-1012.md) — difficulty differences, confidence intervals and Hermione self-play results.
4. [Decision trace](DECISION-TRACE.md) — how to inspect the recorded reasons behind actual requests.

## Supporting data

- [Ability validation](ability-validation-fresh-1000-summary.json) — compact results from 40,000 fresh games, including parameters and source hashes.
- [Hermione self-play](hermione-starting-player-2000-summary.json) — compact results from 16,000 games with both starting orders.
- [Starting-player summary](starting-player-summary.json) — combined starter scores, win/tie/loss counts and confidence intervals.

These JSON files preserve evidence rather than executable tests. The experimental simulation programs were removed. The live strategy code is in ../../js/strategies and ../../js/shared, with its adapter at ../../js/strategies.js.
