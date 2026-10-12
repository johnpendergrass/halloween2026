# Next work — appearance and sound

Updated October 11, 2026. Overall gameplay is acceptable. Follow these priorities from John; work on each as a separate reviewable change.

1. Improve the YOU WON A SET popup and game-over popup. Tune visual presentation, recognition and celebration. Preserve clear player/candy/result information, user-controlled earned-set dismissal, final-set celebration before results, visible final hands and replay.
2. Refine the implemented candy piles after visual review: main dish overflowing slightly, Wendy tray density, overlap/count readability and transfers. Persistent individual candies and live pile removal are implemented. The separate player tray is removed; the player hand remains the grid. Keep private opponent draws unidentified.
3. Decide how generic instructions should appear, especially "Choose a candy from your hand." Explore a consistent neutral treatment separate from speaker bubbles; do not make instructions look like another player's question/answer.
4. Decide how to handle the two top buttons, New Game and Rules. Placement/appearance/final arrangement are open. Keep controls game-owned; do not add a game-specific shell toolbar/helper.
5. Add sound. First decide events, effects/music and mute behavior, including phone tap activation and immediate silence of already-playing audio when sound is turned off. Shell Sound switches currently store/display preferences but games cannot read them. A working shared sound solution requires coordinated helper/shell changes; a game-owned control is another design option. No audio API or sound assets have been selected or implemented.

These are remaining tasks; the initial candy-pile implementation is now complete. Keep current question/answer defaults, three-candy sets, curved candy flight/scaling, breathing and shortcuts intact unless John requests a change. Good Fish implementation, stronger/selectable opponents, profile customization, 11/4 variants and full animation centralization remain separate older backlog.
