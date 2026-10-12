# Decision trace for shared-browser explanations

The adapter is in ../../js/strategies.js; specialized algorithms are in ../../js/strategies/. Experimental algorithms and the old opponents folder have been removed.

OpponentStrategies.choose records the actual choice and diagnostics without rerunning the policy. Beginner records candidates, clue category, base/completion weights, selection chances and the random roll. Medium records conditional success probabilities and score components, including ending penalties. The calibrated expert records temporal probability estimates and request scores from 1,024 plausible hidden-card arrangements.

Trace includes actor name at decision time, set size, own hand counts, public scores/hand/dish counts, public clue bounds and recent sanitized public events. It does not expose the human's actual hand or draw order. This is a development diagnostic and does reveal the computer's own holdings; keep it out of normal player-facing UI.

In the browser, the last 100 decisions are readable in the nonvisual application/json script element #opponentDecisionTrace. It resets on New Game/replay. The same array is available through OpponentStrategies.getTrace for tests. Read the game iframe's script text when inspecting the shared shell tab. No new visible controls or messages are added.

User prefers one- or two-sentence explanations identifying the main reason for a move. Use the stored decision, not a new simulation or guessed rationale. Distinguish weighted choice chance from request success probability, and rollout estimated win score from guaranteed outcome. One reload is needed to load the added tracing code; after that traces accumulate as the user plays.
