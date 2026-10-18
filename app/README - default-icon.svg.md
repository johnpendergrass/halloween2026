# app/default-icon.svg

A little white ghost with three dark holes, drawn as a 100 × 100 SVG with
a transparent background. It is the app's fallback picture for a game
button.

**Where it is used.** `app.js` names it once, `DEFAULT_ICON =
"./app/default-icon.svg"`, and shows it on a game's button only when the
game's `games.json` entry has no usable icon AND no text to show instead
(a game with a short title shows the title as text first; see
`showTextInstead` in app.js, section 5). As shipped, all three games have
their own icon, so the ghost is never seen; it stays so a half-filled
entry can never produce an empty orange square.

**Changing it.** Any square SVG with a transparent background works; the
button scales it. Keep it simple and light-coloured: it sits on the
pumpkin-orange button.
