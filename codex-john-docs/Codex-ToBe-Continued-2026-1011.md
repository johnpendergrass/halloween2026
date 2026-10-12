# Project continuation — October 11, 2026

Main work is Go Fish Candy Edition in games/candy-go-fish, registered slot 8. Start with its codex-john-docs/CONTINUATION-2026-1011.md and NEXT-TODOS.md. Current gameplay remains triples, stationary speech bubbles, four-second Yes auto-transfers, click-required No draws, middle/grid shortcuts, curved-tail colored boxes and answer breathing.

Appearance now uses greenBlueGradient.png, ghost plate v2, green/red witch tray and Wendy grid dishes, brown/yellow player grid dishes, and Total candies in place of the player cat tray. Empty player dishes/badges are dimmed separately from candy artwork. Life Savers is the short label. Original art/palette options and checkpoint files are retained.

Live generic piles persist by engine card ID. Main candy size is 78%, rotation +/-65 degrees and center spread 22% X/20% Y; Wendy size is 45%, rotation +/-50 degrees. Color intensity 50%, brightness about 100%, sizes +/-12%. New deals randomize, redraws preserve arrangement, completed sets remove their cards. Incoming Wendy cards resize for her tray. Transfers between players and player Go Fish draws use actual candy images; only Wendy's private draw flies a generic wrapper. A separate pile-preview.html exposes tuning controls.

Next priorities: earned-set/game-over popups; further pile appearance refinement; generic instructions; top New Game/Rules buttons; sound. Good Fish/variants/opponent strategy remain separate backlog; sound is unimplemented.

Current user requested verification, refreshed docs and commit/push of these changes. Commit title: Update candy artwork, persistent piles and transfer visuals. Cache stamp: 2026-1011-candy-piles. Previous published checkpoint: 1d7a777, Overall gameplay ok, need to work on appearances. Further pushes require a new user request. 5a33e38 is the last Fast/Slow version; 83c418b predates breathing.

Candy Swap remains separate. Keep project-wide notes here and game notes in that game's codex-john-docs/. Shared game requirements in games/ are authoritative. Plain HTML/CSS/JS; no build or newly invented shell settings/audio/pause API.
