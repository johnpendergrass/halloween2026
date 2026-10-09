# Candy Swap selection / comparison demo — 2026-10-07

## User decisions and current behavior

The existing Candy Swap preview is now an untimed playable swap demo at `/games/candy-swap/touch-preview.html`, using the same local launcher/server/port 8097. No main app files or game registry were changed.

Six random items are drawn independently for each of four characters from enabled `assets/gamedata02.json` items. Duplicate items are allowed. The current profiles are used in order: Jing at top, Yuze right, Andries bottom, Noor left. Character artwork remains emoji. Every candy uses the shared default PNG, with color, shape, and rotation for visual distinction; its full identity is visible when selected.

Every item starts at **+1**. Each matching strong-like/favorite attribute adds **+2**, Like adds **+1**, Dislike subtracts **1**. Strong dislike subtracts **2**, supported for later but used by no current character. Unlisted attributes add no adjustment. Therefore neutral item = 1, a single ordinary dislike = 0, and a single strong dislike = -1. Other matched traits are also added. An empty allotment is 0.

Show raw character totals (no `/10`, no clamp), calculated from the initial deal and updated on each confirmed swap. Preview top bar shows the sum of all four characters. This supersedes the earlier 0–10 scale and the briefly proposed neutral-item-zero rule. No medical reasons or allergy status are stored/displayed.

Interaction:

1. Tap a candy to highlight it and open a nearby persistent information popup with name and all its attributes. Popups may cover other candies. Its own hit box remains exposed for deselection.
2. Tap it again to deselect. A new candy from that same character replaces their selection. Up to two candies may be selected, from different characters; with two selected, a third character's candy replaces the second selection. Choices remain editable until Compare Yes is chosen.
3. Two selections show **COMPARE? Yes / No** at the diagonal intersection. No clears the turn.
4. Yes hides the information popups and shows a comparison panel occupying 75% of game height and 90% of width. First character is at top, second at bottom. Each has preferences, before/after raw score, and Happier/Sadder/Same with direction arrow. Their outgoing/incoming candy cards show item names, attributes, graphics, and the value to that character including the +1 base. Middle buttons are **Swap / NO**.
5. Swap exchanges the item objects between their fixed board slots, recalculates scores/total, and clears the turn. NO or tapping outside the panel clears it without changing the deal or scores. Escape also cancels. The board cannot be selected behind an open comparison.

The preview retains Touch areas and Clear controls. Clear cancels a selection/comparison, not the deal. Reload starts a new random deal. No pause is needed because this version has no timer or automatic movement.

## Files and verification

`index.html`, `candy-swap.css`, `candy-swap.js`, and `touch-preview.html` implement the demo. `assets/gamedata02.json` and its text companion were updated for current scoring. Portraits were slightly enlarged to 21.5vw and preferences to 16.125vw (exactly 75%) to keep the three lines readable on small phones. Candy touch boxes remain 13vw square and unrotated; artwork rotates within them.

`verify-swap-demo.cjs` is a repeatable browser check using the bundled Playwright package and installed Chrome. It independently calculates expected scores from DOM item IDs and the JSON, verifies the combined score, selection replacement/deselection, Compare No, panel No, outside cancellation, prediction, and actual item exchange/recalculation. Checks neutral = 1, dislike = 0, strong dislike = -1, strong like = 3, empty allotment = 0. Layout checks passed at 390 × 844, 375 × 667, and 1920 × 1080. Long-name / three-attribute fixture also fits the smaller phone panel. No browser runtime errors were reported. Screenshots are in this folder.

Integration limitation: the temporary preview uses same-origin `postMessage` for total score and toolbar controls, as documented in the initial mockup notes. It is not integrated into the production app's helper or score reporting yet. Production integration must follow shared game requirements rather than copy this preview messaging into the app.
