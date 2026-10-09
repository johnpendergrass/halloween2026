# Go Fish Candy Edition — continuation entry point

Updated October 9, 2026. This document and the current documents linked below describe the implementation at the documentation/animation-handoff checkpoint. Read them before editing. Historical documents contain superseded rules and UI; do not use them as current specifications.

## Read in this order

1. [Rules and gameplay](RULES-AND-GAMEPLAY.md): exact rules, outcomes and interaction sequences.
2. [UI and presentation](UI-AND-PRESENTATION.md): current board, speech, art, timing and accessibility.
3. [Architecture and data](ARCHITECTURE-AND-DATA.md): files, model/events, presentation state and configuration workflow.
4. [Opponent strategies](OPPONENT-STRATEGIES.md): current restricted-information strategy and John's future ideas.
5. [Integration and verification](INTEGRATION-AND-VERIFICATION.md): shell boundaries, local preview, tests and publishing.
6. [Animation survey](ANIMATION-SURVEY-2026-1009.md): complete inventory and findings.
7. [Animation implementation handoff](ANIMATION-IMPLEMENTATION-HANDOFF.md): ordered implementation steps, invariants and acceptance checks.

## Current implementation

Base game: ten types, three copies each, five initial candies each. Request a held type, transfer one candy on success and keep the turn. Every fishing draw ends the turn. Empty dish, empty hand or all sets ends the game; collect the final possible set before judging. No refill. Most sets wins; ties remain possible.

The center always shows the Candy Dish. Requested candy appears only in a cream question bubble, using full grid art size and rotation. Human selection sends automatically after four seconds or sooner by tapping the bubble. The outgoing question dissolves at the opponent portrait before the opponent responds. A matching human slot highlights 500ms after the opponent question settles; tap gives immediately, otherwise auto-give at four seconds after settling. Yes arrives for 2.5 seconds, holds 0.9 seconds and fades 0.3 seconds before candy transfer. Nope stays until the human draws. All candy routes use source pulse and curved travel; opponent draws remain unidentified. Set celebrations wait for dismissal; the central result banner leaves both hands visible.

No animation centralization has been implemented yet. The survey/handoff are the next-work specification. Current fixes prevent completed-animation replay, remove speech layers before effect cancellation, clear the old player question during handoff, and defer requested-slot highlighting. Preserve them.

## Version and publication record

The commit containing this documentation set and current code is the local checkpoint titled **Document Candy Go Fish and hand off animation standardization**. Resolve its full hash with `git log --all --format="%H %s"` and that title; a commit cannot contain its own hash. The final chat response records the hash after creation.

Earlier rollback points:

| Commit | Purpose |
| --- | --- |
| `5c49271467050efc4d745640ae03b4b3d65b3461` | Before removing center request candy; predates later flash/timing fixes |
| `3c925a8f89f5a3baa343c4cf76432ba4f2bc7865` | Before speech-flow experiments |
| `71250d3bc6188b6f76783d02076d08dcca185023` | Candy Go Fish better, still working |
| `85d6360` | Last known pushed demo in slot 8; Tristan is reviewing this earlier version |

**Commit locally as John requests; do not push until he explicitly asks.** Earlier push instructions do not override this restriction. No new animation architecture, strategy levels, catalog expansion or shell API is authorized by the documentation request.

## Historical material

[UI iteration history](HISTORY-UI-ITERATIONS-2026-1009.md), [original handoff](HANDOFF-2026-1009.md), [demo notes](DEMO-2026-1009.md), and numbered 01–04 notes preserve prior decisions. Current linked documents override them. In particular, ignore historical all-copy transfers, match-draw extra turns, empty-hand refill, shell toolbar extension, Got any? confirmation-only flow, fish illustration inside Go Fish, and requested candy in the middle.
