# Verification — October 11, 2026

Release title requested: Overall gameplay ok, need to work on appearances.

Current configured game uses three-candy sets. Runtime and generated config companion match.

Passed checks:
- JavaScript syntax and Git whitespace.
- Candy catalog naming/normalization validation.
- Engine legality, one-copy requests, current fishing/end rules, public-memory privacy/conservation and 1,000 simulated games each with triples/quadruples.
- Current quote suite: both actors' Yes/No, four-second auto-transfers and early middle clicks, matching-slot shortcut during question arrival/reply/settled wait, retained questions through dialogs, no inactive human selection highlight, correct Yes colors, separate candy timing and 100%-150%-100% scale.
- No-reply suite: all middle acknowledgement targets for both actors, exactly one draw, Rules locking, coral/tail directions, 500ms breathing delay, 1000ms eased onset and unchanged 4% peak, stopping and reduced motion.
- Final full UI round, 338x526/547x850 layout/targets, alternate identities, earned-set popups, results, replay and direct file opening.
- Shell registry/icon/menu and embedded board, game-owned Rules/New Game, return Home.

The final shell run exposed overly long Rules copy whose close button reached the bottom strip. The explanation was shortened without changing gameplay; shell checks then passed. The standalone/full-round suite was rerun after this copy fix.

Some quote/motion suites ran during implementation; final publishing-only edits are documentation, cache stamps and the concise Rules copy. Latest quote/scaling checks passed before that Rules copy fix. Delayed-timer checks previously passed during stationary-quote migration; they were not rerun for this appearance publish.

All browser verification uses local Chrome/Playwright. Actual iPhone Safari ergonomics, compositor behavior and subjective pacing remain unverified. Full-round acceleration uses the existing timer harness; it does not establish ideal real-world pacing or strategy.

Publishing cache stamp is 2026-1011-gameplay-appearance in APP_VERSION and both root index.html resource references. This release includes requested current docs/TODOs and the preceding local breathing checkpoint. No sound or Good Fish implementation is included.
