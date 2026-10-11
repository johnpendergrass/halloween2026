# Candy Go Fish — working documents

**October 11 update:** [Current continuation](CONTINUATION-2026-1011.md) supersedes the quote-mode/timing descriptions below. Slow mode and the speed toggle have been deleted; quotes fade in place using the former Fast behavior. Candy flights remain.


Updated October 9, 2026

This folder holds working documentation and supporting development material for the new game in `games/candy-go-fish`.

**Start with [End-of-first-day handoff](END-OF-FIRST-DAY-2026-1009.md), then [Current state and checkpoints](CURRENT-STATE-2026-1009.md).** It identifies the local baseline and links the comprehensive current documentation below. This set overrides historical notes.

- [Rules and gameplay](RULES-AND-GAMEPLAY.md)
- [UI and presentation](UI-AND-PRESENTATION.md): current appearance and design TODOs, including candy departure, celebrations, top controls and portrait selectors.
- [Architecture and data](ARCHITECTURE-AND-DATA.md)
- [Opponent strategies](OPPONENT-STRATEGIES.md)
- [Integration and verification](INTEGRATION-AND-VERIFICATION.md)
- [Animation implementation handoff](ANIMATION-IMPLEMENTATION-HANDOFF.md)
- [Baseline verification record](VERIFICATION-2026-1009.md)
- [End-of-day verification record](END-OF-DAY-VERIFICATION-2026-1009.md)

- [Animation and timing survey](ANIMATION-SURVEY-2026-1009.md): complete motion/wait inventory, event sequences, coordination risks, and proposed central setup before refactoring.

- [Premise](01-premise.md): purpose, scope, and the selected artwork.
- [Proposed rules](02-rules.md): a complete starting ruleset, including endgame behavior.
- [Initial design](03-design.md): the phone interface and player interaction.
- [Implementation plan](04-implementation.md): data, game state, computer strategy, and verification.

The October 8 documents below are historical initial proposals. Their all-copy transfers, matching-draw extra turns, immediate request taps, scrolling-hand suggestion, and empty-hand refills have been superseded. A playable standalone demo now exists at `../demo.html`.

The previous Candy Swap game remains a separate project. Its preference system, scoring, and trade interface are not part of this game.

[UI iteration history](HISTORY-UI-ITERATIONS-2026-1009.md), demo notes, the original handoff and numbered notes are historical. They may describe interfaces or rules no longer present. Do not implement their stale descriptions over the current docs.
