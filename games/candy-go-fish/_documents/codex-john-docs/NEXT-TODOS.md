# Next work — appearance and sound

Updated October 12, 2026. Overall gameplay is acceptable. Follow these priorities from John; work on each as a separate reviewable change.

October 12 update: the strategy-development priority below is completed locally and superseded. The three calibrated policies passed fresh paired validation and are installed in the game. John accepted them. See ../strategies-development/ABILITY-REPORT-2026-1012.md for results; review human play feel before any further tuning. John authorized documentation update, commit and push of the current checkpoint.

Current priorities: review human play feel, then continue the appearance and sound tasks below. All three accepted strategies are installed and validated. The retired simulation code is described in ../strategies-development/DEVELOPMENT-AND-IMPLEMENTATION.md. See CURRENT-STATE-2026-1012.md for authoritative current paths.

1. Improve the YOU WON A SET popup and game-over popup. Tune visual presentation, recognition and celebration. Preserve clear player/candy/result information, user-controlled earned-set dismissal, final-set celebration before results, visible final hands and replay.
2. Refine the implemented candy piles after visual review: main dish overflowing slightly, Wendy tray density, overlap/count readability and transfers. Persistent individual candies and live pile removal are implemented. The restored cat tray displays only the player count; the player hand remains the grid. Keep private opponent draws unidentified.
3. Review the implemented choice instruction: wide tail-free cream popup over the dish, hidden immediately on selection. Separate Wendy fishing/draw messages are removed.
4. Review the installed ceramic pumpkin buttons: NEW GAME left, RULES right, carved candlelit lettering with matching letter height. Keep controls game-owned.
5. Add sound. First decide events, effects/music and mute behavior, including phone tap activation and immediate silence of already-playing audio when sound is turned off. Shell Sound switches currently store/display preferences but games cannot read them. A working shared sound solution requires coordinated helper/shell changes; a game-owned control is another design option. No audio API or sound assets have been selected or implemented.

Appearance/sound items remain after the strategy work. Keep current question/answer defaults, three-candy sets, opening spin, curved candy flight/scaling, breathing and shortcuts intact unless John requests a change. Good Fish, profile customization, 11/4 variants and full animation centralization remain separate older backlog.
