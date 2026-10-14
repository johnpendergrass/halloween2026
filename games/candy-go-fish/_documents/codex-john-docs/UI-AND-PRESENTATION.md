# Current UI and presentation

Current October 12 implementation and folder layout: [current handoff](CURRENT-STATE-2026-1013.md). Earlier paths, prototype strategy descriptions and preview instructions below are historical where superseded.

Updated October 13, 2026. See [handoff](CONTINUATION-2026-1011.md) for complete current behavior and [next TODOs](NEXT-TODOS.md) for priorities.

The non-scrolling 9:14 board uses greenBlueGradient.png, two rows of five ceramic dishes per side, portraits/names and CANDY SETS. Wendy has a green/red witch tray with a persistent generic candy pile/count. The brown/yellow player cat tray is restored on the right; its count badge is horizontally centered at 75% height, below the face. Completed-set badges/checkmarks are 125% of normal size. Human grid dishes are brown/yellow; Wendy’s goal dishes are green/red, muted until completed. Zero-count human dishes/badges dim separately from candy artwork. The main dish is ghost plate v2 with an overflowing generic pile/count. Opponent active identities remain hidden. Human absent identities are faint; one/two held candies use overlapping artwork/counts. The active side/portrait glows. Side highlights are inset 1vw vertically and 0.5vw horizontally. The Candy Dish remains unidentified.

Speech stays in the middle: Wendy left, human right, cream questions, light-green/black Yes, muted-coral No. Speaker asks:/says: labels use normal weight and the main text color. Rounded boxes have broad curved tails: Wendy up, human down. No Fast/Slow control or speech flights remain.

Both answers breathe gently at 4%: 500ms still, 1000ms eased first swell, then a one-second cycle. Only answers pulse. Dialogs/acknowledgement/transfers stop it, and reduced motion disables it.

YES retains both boxes for four seconds or an earlier middle click; NO waits indefinitely for a middle click. Wendy-request matching slot is an immediate gift shortcut. Human selection highlight ends when its question sends.

Candy has no source bounce/glow. All routes curve/accelerate over 1400ms and fade near arrival. Actual named candy images fly on successful requests in both directions and player Go Fish draws, rotating toward upright and scaling 100%-150%-100%. Only private opponent draws use a generic wrapper: it retains rotation/color and shrinks from its 150% midpoint to Wendy’s resting width. Reduced motion uses stationary fades.

Set popup and game-over banner remain functional and are next to improve. Top buttons are ceramic pumpkins with carved candlelit text: NEW GAME v2 left and RULES v3 right, matching letter heights. HTML labels are visually hidden for accessibility. The choice instruction is a 48vw-wide tail-free cream popup centered over the dish, hidden immediately on selection. Separate Wendy fishing/draw announcements are removed; her private wrapper flight remains. Further pile refinement, popup polish and sound remain upcoming work.

Live pile defaults and placement are detailed in the current handoff. New deals randomize size/angle/hue/brightness/position once; surviving candies do not move during redraws or set removal. A separate pile-preview.html provides visual tuning controls.

October 13 audio: character/confirmation cues and delayed victory announcements are active. The game-over banner has a bottom-right speech replay icon, hidden for missing clips/ties. UI gain defaults to 50% per sound. Spinner remains silent; music, visible audio controls and preloading remain pending.
