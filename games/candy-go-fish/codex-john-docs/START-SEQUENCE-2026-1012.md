# Empty-board opening and starter selection

Implemented locally October 12 after published cache fix ba02f79. Initial load and replay/New Game now enter an empty board rather than the old Let's play dialog. Both grids show blank dishes, central/Wendy dishes have no candy piles, hand badges are hidden and set totals are zero. No deck is dealt yet.

A cream tail-free message over the central ghost dish says "Click to choose a starting player". Clicking it or the dish locks the action and randomly selects the starter. A native transform animation lasts 3700ms: slow start, rapid turns, deceleration, then decreasing 18/-9/+4 degree rocking into the final orientation. Native image is head-up; Wendy is 0 degrees, human 180 degrees. No video or separate animation asset is needed.

The result message uses the configured player name and says "<name> goes first - click to start". The dish stays in its original center position. Only the message moves 35.5vw above an upward ghost or below a downward ghost; overlap with the chosen player's grid is allowed at John's direction. This second click creates the deck, deals five candies to each player with no completed opening sets, applies the selected starting actor and resumes normal play. Dish returns to its usual orientation once gameplay begins.

Opening phases: pickStarter, spinningStarter, starterReady. generation invalidates an old spin on a new round. Repeat clicks cannot repeat a deal. Rules/New Game dialogs lock input and pause the native animation; the spinning image survives dialog renders. Reduced motion uses an 80ms fade instead of rotation. Message supports Enter/Space.

Opening appearance enlarged at John's direction: dish is 52.5vw (250% of normal), centered throughout. Opening prompt is 72vw wide with text/padding about 150% of normal; result box is 90vw wide to stay inside the board, with enlarged text and optional wrapping. Result message sits 35.5vw above/below the center. Both dish and result message start the deal; dish is locked only while spinning or a dialog is open. Gameplay returns to normal sizes.

Verified both orientations and configured winner text at phone/desktop sizes, blank piles, result/dish separation, five-candy deal, Rules pause/resume, new-round reset and reduced motion. Updated browser regression passes full round, replay, Rules and file opening. start-round.cjs adapts browser/shell/quote/pile fixtures to the new opening and can choose a specific actor for deterministic scenarios. Actual device feel still needs user review.

The opening center layer draws above both grids, avoiding dim dishes showing over the plate. This layer override is removed during gameplay; normal-size dish and all 20 initial candy sprites were verified at phone/desktop sizes. Zero-count player grid badges are omitted; positive counts and set checks remain. Publishing cache version: 2026-1012-candy-start.
