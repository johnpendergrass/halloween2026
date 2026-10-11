# Go Fish Candy Edition — current continuation entry

**October 11 update:** [Current continuation](CONTINUATION-2026-1011.md) supersedes the quote-mode/timing descriptions below. Slow mode and the speed toggle have been deleted; quotes fade in place using the former Fast behavior. Candy flights remain.


Updated October 9, 2026, end of first day.

**Read [End-of-first-day handoff](END-OF-FIRST-DAY-2026-1009.md) first.** It is the authoritative description of the current runtime, design decisions, TODOs, integration work and tests, and supersedes older conflicting snapshots.

Current preview: ten types, four candies per set, five dealt per player. Three/four engine configurations work; four is the currently selected visual trial. Quotes: Slow / Fast works, with one-second Fast question pacing and an immediate human-tap gift exception. Candy movement remains separate. Compact question boxes use layered art/question marks; all candies rotate −30° except 100 Grand at −15°. Pair/triple stacks are preserved. Speaker placement is opponent left / human right. Good Fish is approved in the specification but remains unimplemented in the engine/help.

## Local checkpoints

The newest checkpoint has the title **end of first day - fast vs slow working - 3 vs 4 sets working - needs tuning.** Resolve it in Git history; the chat records its hash after creation.

| Commit | Purpose |
| --- | --- |
| `0f04d349c6a4722354c71d0cd7e690cebc2d7eaa` | Earlier animation survey/documentation checkpoint, before today's later Fast/Slow and four-copy changes |
| `5c49271467050efc4d745640ae03b4b3d65b3461` | Before removing center request candy; predates later flash/timing fixes |
| `3c925a8f89f5a3baa343c4cf76432ba4f2bc7865` | Before speech experiments |
| `71250d3bc6188b6f76783d02076d08dcca185023` | Candy Go Fish better, still working |
| `85d6360` | Last known pushed demo; Tristan is reviewing an earlier published version |

**Commit locally as requested; do not push until John explicitly asks.** Historical handoffs/numbered notes and the initial animation survey are records, not current UI specifications. Resurvey before the planned full timing refactor.
