# End-of-day verification — October 9, 2026

Checkpoint title: **end of first day - fast vs slow working - 3 vs 4 sets working - needs tuning.** Runtime is the four-copy preview; intended base remains three. See the end-of-first-day handoff for current behavior and pending work.

Final checks passed:

- Catalog names/normalization validation and UI JavaScript syntax.
- Engine legality, one-copy transfer, current fishing/end rules, public memory/privacy and conservation; 1,000 simulated games each with three and four copies (maximum 75 requests in this deterministic run).
- Real-time Slow speech arrivals/reading holds, matching-slot readiness, manual actions, quote art/rotation/fit, Yes sequencing and Rules pause.
- Fast one-second questions, both speakers' Yes/Go Fish replies, retained questions across waits/dialog redraws, immediate manual Fast gift, and unchanged candy travel when switching speed.
- Speech redraw/timer-lag regression, hidden-before-cancel handling, no completed-effect replay and intentional retained question differentiation.
- Phone/desktop targets/layout, alternate profile names, full four-copy UI round, earned-set dialogs, results, replay and direct file opening. Increased the harness action allowance from 250 to 750 because the larger deck and presentation steps can exceed the old limit; no runtime timing was changed for the test.
- Shared Go Fish reply styling/placement, button/dish each drawing once, and duplicate-click protection.
- Handoff/index link and Git whitespace checks.

Earlier focused checks also verified compact questions for every candy at 320/338/547px, artwork below text, question marks and top/bottom clearance; the named empty-hand ending and larger score number; and three held images plus the fourth-candy celebration.

Browser checks use local Chrome through Playwright, localhost:8098. These are not iPhone Safari tests and do not validate subjective visual tuning or strategy quality. The synthetic four-copy screenshot is a fixture, not a saved actual round. Screenshots are development artifacts.

Shell registry/helper were unchanged in this later work, so the shell-specific suite was not repeated. Full timing centralization, Good Fish implementation/help update, selectable variants/opponents/profiles and celebration redesign are pending.

The three unused processed toy images have matching Git blob hashes at their former and new paths; they are moves, not deletions of active candy assets. No push or publication was performed.
