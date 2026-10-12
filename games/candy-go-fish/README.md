# Go Fish Candy Edition

Playable Halloween 2026 mini game, registered in slot 8. Open demo.html for a centered preview or index.html for standalone play. Plain HTML/CSS/JS; HTTP and file opening work.

Start with [current handoff](codex-john-docs/CONTINUATION-2026-1011.md) and [next TODOs](codex-john-docs/NEXT-TODOS.md).

Ten types, three copies each, five initially dealt per player. Request a held type; one-candy success keeps the turn. Triples collect automatically. Fishing currently always ends the turn; the proposed Good Fish rule is not implemented. Empty dish/hand or all sets ends the round after possible final-set collection.

Both YES answers retain question/reply for four seconds, then transfer automatically; either middle text box or the Candy Dish shortcuts it. Both NO answers wait for a middle click to draw. Tapping a requested held candy during Wendy's request is an immediate gift shortcut.

Quotes fade in place; cream question, light-green Yes, coral No. Curved tails indicate speaker. Answers gently breathe while waiting. Candy travels on a curve without source bounce, scaling 100%-150%-100% with an end fade.

Current artwork uses the green/blue gradient, ghost main plate, green/red Wendy tray/dishes and brown/yellow player dishes. Persistent generic piles track actual card IDs; player footer shows Total candies. Main wrappers overflow the rim slightly; survivors keep their positions when cards move or collect into sets. Requests in either direction and player draws fly actual candy images; only Wendy’s private draw flies a generic wrapper, resizing to her tray.

Open pile-preview.html for size/rotation/spread/color tuning. Current priorities: improve earned-set/game-over popups, refine pile appearance, generic instructions, top New Game/Rules controls, then sound. See [verification/integration](codex-john-docs/INTEGRATION-AND-VERIFICATION.md) and [configuration](assets/json/README.md).

## Preview

From repository root: python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1. Reuse an existing server.

## Requirements exception

The shared [game requirements](../README%20-%20game%20design%20requirements.md) are authoritative. At John's direction there is no dedicated Pause button. Local dialogs pause presentation, but the shell drawer does not notify/pause the game. There are no timed penalties. Game controls remain inside the game; score reporting uses only the existing helper.
