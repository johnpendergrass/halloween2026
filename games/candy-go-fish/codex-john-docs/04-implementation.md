# Initial implementation plan

October 8, 2026

Build a standalone browser prototype in `games/candy-go-fish`. Keep game logic separate from rendering and computer decision-making. No framework or service is required for this small game; inspect repository requirements before choosing the final integration structure.

## Proposed files

- `index.html`: page structure, instructions, game regions, and controls.
- `candy-go-fish.css`: responsive layout, artwork tiles, feedback, and accessibility styling.
- `candy-go-fish.js`: initialization, rendering, and presentation sequencing.
- `game-engine.js`: deck creation, shuffle, legal moves, turn resolution, refill, sets, and finish detection.
- `computer-player.js`: requests chosen from the computer's hand and public observations.
- `assets/candies.json`: ten stable IDs, display names, and existing image paths.
- `codex-john-docs/`: documentation, meaningful verification scripts, and review screenshots.

These filenames are proposals. Keep supplied images in `assets/candybar-images` and reference them relative to the game page. Do not copy Candy Swap's preference or scoring data.

## State and engine

Use a single authoritative state containing shuffled draw pile, both hands, both completed-set lists, current player, phase, winner/result, and a public event history. Each physical card has a unique ID and a candy type ID. Configure `copiesPerType = 3` and `initialHandSize = 5`.

Suggested phases: introduction, human turn, resolving move, computer turn, and finished. UI timing is separate from whose turn the engine assigns. Ignore input while a move is being presented or after the game ends.

A request-resolution function validates the actor and held type, transfers matching cards or draws one, collects triples, refills empty hands in the defined order, selects the next eligible player, and checks completion. Return presentation events alongside the resulting state. Resolve logical changes once; animations only display those events.

Use Fisher–Yates shuffle with an injectable random source for repeatable verification. Production play can use ordinary browser randomness; this is not a security-sensitive shuffle.

Maintain these invariants:

- All thirty unique cards exist exactly once across pile, hands, and completed sets.
- Every completed set contains exactly three cards of one type.
- No hand retains a complete triple after resolution.
- A type appears in at most one completed set.
- Every accepted request comes from a type held by the acting player.
- Finished play has ten completed sets and cannot accept further moves.

## Computer strategy

Give the computer only its own hand, public counts, completed sets, and public move observations. Do not pass the human hand or draw-pile order into its strategy function.

Start with a simple priority system:

1. Prefer a held type that public evidence indicates the human has.
2. Within equally promising choices, prefer types where the computer holds two copies.
3. Prefer types without a recent failed request over types believed absent.
4. Randomly choose among equal candidates.

Human requests reveal that the human holds that type at that moment. A failed computer request establishes absence at that moment. Clear or weaken absence evidence when the human draws unknown cards. Account for transfers and completed sets so memory does not retain impossible beliefs. When the computer gives away a type, the human has it unless that transfer completes and removes its set.

The priority system is a starting heuristic, not a claim of optimal play. Use the same request-resolution engine for both players. Add a brief readable pause before computer moves, including consecutive turns, without making the player acknowledge every event.

## Verification

Test the rules independently of the UI with fixed decks and controlled randomness. Cover successful transfers of one and two cards, requested and unrelated draws, triple collection, continued turns, empty-hand refill including a triple in the refill, depleted piles, skipped empty hands, a win, a tie, and rejected illegal requests.

Run complete simulated games to check card conservation, legal computer choices, and eventual completion. Use a generous diagnostic move limit to detect defects; do not introduce a gameplay turn cap. Confirm that a computer decision cannot access hidden human cards or draw order.

Browser checks should cover starting and replaying, tapping a request once, blocking repeated taps during resolution, readable consecutive computer turns, correct displayed counts, hidden opponent cards, keyboard use, and layout at narrow phone sizes. Inspect screenshots for image recognition and long labels. Real phone playtesting should assess pacing and enjoyment after functional checks pass.

## Build sequence

1. Confirm the ten-image catalog and repository integration requirements.
2. Implement and verify the engine with the proposed rules.
3. Add the restricted-information computer strategy.
4. Build the minimal phone interface and clear move feedback.
5. Verify browser behavior and review on the user's phone.
6. Adjust pace or layout based on play, then consider production integration.

Production menu registration, shared game helpers, and score reporting are later integration work. Inspect their actual requirements before implementing them; the existing temporary Candy Swap preview messaging is not an integration specification.
