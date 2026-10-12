# Opponent selector

Current October 12 implementation and folder layout: [current handoff](CURRENT-STATE-2026-1012.md). Earlier paths, prototype strategy descriptions and preview instructions below are historical where superseded.

Latest local update: icons live in opponents/icons/. Ron/Harry/Hermione now select beginner/medium/expert prototype algorithms at the next decision. An in-flight request continues unchanged and public memory is retained. See ../opponents/README.md for simulation design and limitations; the following shared-strategy descriptions record the earlier published stage.

Local implementation: Ron +, Harry ++ and Hermione +++ cycle in both directions through cream arrows beside the opponent portrait, matching John's mockup. The nameplate is horizontally centered while overlapping the bottom of the icon. Arrows align with the icon center; opponent score shifts left/down and the tray shifts right. Each uses its supplied square artwork from opponents/icons: RON cartoon 01.png, HARRY cartoon 02.png and HERMIONE cartoon 01.png. Existing circular object-fit cover framing crops the corners without altering source files. All share the existing strategy; plus signs are labels only for now. Profiles live in the configuration's opponents array; internal engine role stays wendy.

At John's direction switching is permitted during opening, spinning, chosen-starter screen and normal play. It does not reset cards, pile, score, turn or opponent memory. Name/portrait/configured speaker identity updates immediately, including current speech and accessibility labels, without rebuilding candy piles or interrupting animation. Arrows are disabled/hidden while a dialog is open or at game over, then available on replay. Selection persists across rounds in this loaded page, not across reloads.

Face framing uses object-view-box inset(8%) for about 19% zoom inside the unchanged circular frame; Chrome support was checked. Original sources are preserved. Configuration separates plain name (Ron/Harry/Hermione) from displayName (Ron +/Harry ++/Hermione +++); expertise symbols appear only on the centered portrait nameplate.

verify-opponent-switch.cjs checks bidirectional wraparound, all three image paths/decoding, state preservation, dialog/game-over locks and no page errors at phone/desktop sizes. Distinct strategies are the next requested work: Ron beginner, Harry medium, Hermione expert. All currently share one strategy. Opponent memory is retained on switching; future strategy work must preserve the public-information boundary.
