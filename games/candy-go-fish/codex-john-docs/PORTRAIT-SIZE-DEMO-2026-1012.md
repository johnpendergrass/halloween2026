# Larger portrait preview

Separate playable `portrait-size-demo.html` loads the current game's CSS/JS/assets plus `portrait-size-demo.css`. Production `index.html` and `candy-go-fish.css` are unchanged and remain the exact fallback.

Portrait diameter increases from 18vw to 22.5vw (25%). Names retain their original 5vw font and styling. Pumpkin artwork displays at 85% of its current size inside the original tap targets. Rows change from 13/53/36/52vw to 11/53/33/57vw, keeping total height 154vw: the player grid moves up 5vw and its footer gains space. Player footer height increases from 21vw to 26vw. Portrait holders/heading center columns widen to accommodate the larger icons.

Adopted locally in the real game at John's direction after review. Wendy's icon/name is moved up 3vw; names retain their original size. The previous production stylesheet is saved in `portrait-layout-checkpoint-2026-1012/candy-go-fish.css`; copy it over the game's stylesheet to undo only this change. The demo remains available. Not yet committed or pushed.
