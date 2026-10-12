# Candy Go Fish: ability and starting-player tests

October 12, 2026. The calibrated strategies are installed in the local game. This work has not been committed or pushed.

## Difficulty spread

More than 100,000 development and validation games were run. The frozen strategies were then checked on 40,000 fresh games: 1,000 independent deals per matchup and set size, each repeated with swapped hands and both starting orders. Scores count a win as 1, a tie as 0.5 and a loss as 0. Confidence intervals are approximate 95% intervals clustered by deal.

*** NOTE - in below Ron is the lowest level player, Harry is the medium, and Hermione is the highest, most expert player.

| Matchup | Set size | Games | Stronger player score | 95% interval |
|---|---:|---:|---:|---|
| Harry vs Ron | 3 | 4000 | 63.24% | 61.88% to 64.59% |
| Harry vs Ron | 4 | 4000 | 72.86% | 71.58% to 74.15% |
| Hermione vs Harry | 3 | 4000 | 71.47% | 70.33% to 72.62% |
| Hermione vs Harry | 4 | 4000 | 68.56% | 67.29% to 69.83% |

The ranking also passed separately for both starting orders and against a random baseline. Ron is unchanged. Harry and Hermione use the calibrated algorithms described briefly in STRATEGY-SUMMARY.md. Increasing old rollout sample counts alone did not establish the desired ranking; Hermione now uses temporal probability estimates instead.

## Does going first help?

Hermione played herself on 2,000 additional independent deals per set size, again swapping hands and reversing starting order: 8,000 games per set size, 16,000 total. Both players use exactly the same calibrated algorithm. The table combines the two player identities, measuring the starter rather than one named seat.

| Set size | First-player wins | Ties | Second-player wins | First-player score | 95% interval |
|---|---:|---:|---:|---:|---|
| 3 | 3532 | 693 | 3775 | 48.48% | 46.99% to 49.97% |
| 4 | 3640 | 719 | 3641 | 49.99% | 48.42% to 51.56% |

Three-candy sets show a small possible disadvantage to starting: 48.48% versus 50%, with the upper confidence limit barely below 50% (49.97%). Treat this as borderline evidence, not a strong reason to prefer going second. Four-candy sets are effectively even. There is no measured starting advantage here. This is algorithm self-play, not a universal guarantee for human play.

## Checks and limits

All simulated choices were legal and conserved cards. Scenario tests checked clue privacy, private draws, end-game choices and three/four-copy behavior. Browser checks passed for all three profiles, switching mid-round, full rounds, replay and candy transfers. The live memory adapter matched the validation runner exactly across 40 additional paired games.

Chance contributes to losses, but the measured difficulty gaps are much larger than sampling uncertainty. Hidden information and approximate reasoning also contribute; these tests do not separate unavoidable chance from remaining strategy weaknesses. Desktop decision timings are not phone performance measurements.

The development harness and experimental source files were retired at John's request after this evaluation. Compact aggregate results, options and source hashes are retained beside this report. See DEVELOPMENT-AND-IMPLEMENTATION.md for the development history and current runtime file map. Repeating these studies would require rebuilding or recovering a simulation harness.
