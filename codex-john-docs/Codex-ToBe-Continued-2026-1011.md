# Project continuation — updated October 12, 2026

Main work is Go Fish Candy Edition in games/candy-go-fish, registered slot 8. Start with its codex-john-docs/CONTINUATION-2026-1011.md and NEXT-TODOS.md. Current gameplay remains triples, stationary speech bubbles, four-second Yes auto-transfers, click-required No draws, middle/grid shortcuts, curved-tail colored boxes and answer breathing.

Appearance now uses greenBlueGradient.png, ghost plate v2, green/red witch tray and Wendy grid dishes, brown/yellow player grid dishes, and the restored brown/yellow player cat tray with a lowered count badge. Labels read CANDY SETS, completed-set badges are 125% size and turn highlights have a small inset. Empty player dishes/badges are dimmed separately from candy artwork. Life Savers is the short label. Original art/palette options and checkpoint files are retained.

Live generic piles persist by engine card ID. Main candy size is 78%, rotation +/-65 degrees and center spread 22% X/20% Y; Wendy size is 45%, rotation +/-50 degrees. Color intensity 50%, brightness about 100%, sizes +/-12%. New deals randomize, redraws preserve arrangement, completed sets remove their cards. Incoming Wendy cards resize for her tray. Transfers between players and player Go Fish draws use actual candy images; only Wendy's private draw flies a generic wrapper. A separate pile-preview.html exposes tuning controls.

Next priorities: earned-set/game-over popups; further pile appearance refinement; sound. Choice instructions now use a tail-free cream popup over the dish; top buttons are ceramic pumpkins with carved candlelit labels. Initial deals prohibit completed sets: five candies each, zero collected sets. Good Fish/variants/opponent strategy remain separate backlog; sound is unimplemented.

October 12 user requested refreshed docs, verification and commit/push of current UI and initial-deal changes. Cache stamp: 2026-1012-candy-ui. October 11 appearance/piles commit: 1df4eac. Previous published checkpoint: 1d7a777, Overall gameplay ok, need to work on appearances. Further pushes require a new user request. 5a33e38 is the last Fast/Slow version; 83c418b predates breathing.

Candy Swap remains separate. Keep project-wide notes here and game notes in that game's codex-john-docs/. Shared game requirements in games/ are authoritative. Plain HTML/CSS/JS; no build or newly invented shell settings/audio/pause API.

Publishing follow-up, October 12: GitHub Pages failed on Windows-1252 punctuation in five Markdown files. Commit 7f20652 converted them to UTF-8; deployment succeeded and the current live game was verified. Going forward, save documentation as UTF-8 and strictly validate tracked Markdown files before publishing. Check the actual Pages Actions workflow conclusion, because the Pages API/settings can retain a stale "building" status after failure. Confirm the live site's version stamp and game content after deployment.
