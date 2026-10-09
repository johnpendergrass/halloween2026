# Initial interface design

October 8, 2026

The primary action is tapping a candy in your hand to request that type. Show the instruction “Tap a candy to ask for it” during the human turn. A tap commits the request immediately; there is no selection-and-confirm sequence.

## Phone layout

Use a portrait layout with four clear areas, from top to bottom:

1. Opponent area: “Computer,” hand count, a small face-down hand illustration, and completed-set count.
2. Center: draw pile with remaining count, a brief turn/result message, and space to show a transfer or the human's draw.
3. Your completed sets: small identifiable candy thumbnails, with a visible total. Opponent sets can use a matching strip near the top.
4. Your hand: grouped candy images with names and copy counts, arranged in a responsive grid.

There can be at most ten distinct types in a hand. Grouping duplicates avoids a wide fan of cards and keeps every available request easy to find. Use a visible badge such as “×2”; do not encode counts only through overlapping images. Allow vertical scrolling if needed on short screens rather than making touch targets too small.

The human's hand can be larger than five cards after transfers. Five is the initial deal and refill maximum, not a hand-size limit.

## Artwork and legibility

Preserve image proportions with contain-style fitting. Keep enough separation between images to identify wrappers. Use a simple contrasting background and readable labels. Artwork should fit inside its interactive tile; the Candy Swap rotation and overhanging hit-box behavior are unnecessary here.

Use at least 44 CSS pixels for interactive targets and check actual candy recognition at phone size. Provide text labels for long product names without clipping or horizontal page overflow.

## Turn feedback

Examples of short messages:

- “You asked for Snickers. Computer gave you two!”
- “Go fish! You drew Mounds. Computer's turn.”
- “Computer asks for Dots. You gave one.”
- “You completed Butterfinger! Ask again.”

Show the latest outcome long enough to understand it. During the computer turn and move presentation, disable human requests. Separate presentation timing from game rules so animations cannot cause duplicate moves or change outcomes. Respect reduced-motion preferences.

Keep the opponent's hidden draw private: “Computer goes fishing” is sufficient unless drawing the requested candy grants another turn. In that case the match is public and can be named.

## Start, help, and finish

Begin with a short explanation and a “Play” button. Offer a compact “How to play” control for the full rules. At the finish, show win, loss, or tie; both set totals; and “Play again.” A new game resets the entire deal and computer memory.

For the first prototype, avoid an always-visible restart button that could accidentally discard a game. Add one later only if testing makes it useful.

## Accessibility

Candy request tiles should be native buttons with names such as “Ask for Snickers; you have two.” Support keyboard activation, visible focus, and a polite live region for turn results. Do not rely on color or animation alone to communicate turns, set completion, or victory. Expose hand and draw-pile counts as text.
