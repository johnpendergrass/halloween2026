# Project continuation - October 12, 2026

Current work is Candy Go Fish in games/candy-go-fish, shell slot 8. Start with [the documentation guide](../games/candy-go-fish/_documents/_START-HERE.md) and [current handoff](../games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1012.md).

Ron, Harry and Hermione now use accepted, calibrated local algorithms. Fresh paired validation confirms the difficulty ranking for triples and quadruples. Hermione self-play found no starting advantage. Runtime code is in js/, js/strategies and js/shared. The root opponents folder and obsolete preview/demo files are removed. Assets were cleaned and renamed; portraits use the supplied assets/opponent-icons copies. Documentation and design sources moved under _documents, with clear starting guides.

The game retains the spinning empty-dish starter sequence, no-opening-set deal, enlarged portraits, ceramic pumpkin buttons, CANDY SETS labels, persistent candy piles, private draw artwork and existing speech/transfer behavior. Sound remains future work. John accepted the strategies; focus on human play feel and remaining appearance/sound tasks before additional tuning.

John requested a complete documentation update, commit and push of the current state. Current cache stamp is 2026-1012-candy-strategy-cleanup. Publishing checks include valid UTF-8, asset references, engine rules, browser gameplay and the actual Pages workflow. Empty locked design ideas directory has no contents and is not tracked by Git.

Every new summary folder must have _START-HERE.md or an obvious contents index. Retired experiments are described in [strategy development](../games/candy-go-fish/_documents/strategies-development/_START-HERE.md); experimental simulation programs were removed, with compact validation evidence retained.
