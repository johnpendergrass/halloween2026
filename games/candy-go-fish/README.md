# Go Fish Candy Edition

Playable Halloween 2026 mini game, registered in slot 8. Open index.html for standalone play or launch through the application shell. Plain HTML/CSS/JS; HTTP and file opening work. Runtime JavaScript lives in js/, including the strategies.js adapter and strategies/shared subfolders. The development history and measured results are in [_documents/strategies-development](_documents/strategies-development/DEVELOPMENT-AND-IMPLEMENTATION.md). Old preview/demo wrappers, experimental policies and simulation programs have been removed.

Start with [current handoff](_documents/codex-john-docs/CURRENT-STATE-2026-1012.md) and [next TODOs](_documents/codex-john-docs/NEXT-TODOS.md).

Ten types, three copies each, five initially dealt per player with no completed sets in either opening hand. Request a held type; one-candy success keeps the turn. Triples collect automatically. Fishing currently always ends the turn; the proposed Good Fish rule is not implemented. Empty dish/hand or all sets ends the round after possible final-set collection.

Both YES answers retain question/reply for four seconds, then transfer automatically; either middle text box or the Candy Dish shortcuts it. Both NO answers wait for a middle click to draw. Tapping a requested held candy during Wendy's request is an immediate gift shortcut.

Quotes fade in place; cream question, light-green Yes, coral No. Curved tails indicate speaker. Answers gently breathe while waiting. Candy travels on a curve without source bounce, scaling 100%-150%-100% with an end fade.

Current artwork uses the green/blue gradient, ghost main plate, green/red Wendy tray/dishes and brown/yellow player dishes. Persistent generic piles track actual card IDs; player footer has the restored brown/yellow cat tray with a lowered count badge. Score labels read CANDY SETS; completed-set badges are 125% size. Main wrappers overflow the rim slightly; survivors keep their positions when cards move or collect into sets. Requests in either direction and player draws fly actual candy images; only Wendy’s private draw flies a generic wrapper, resizing to her tray.

Current priorities: improve earned-set/game-over popups, refine pile appearance, then sound. The choice instruction is a tail-free cream popup over the dish; top buttons are ceramic pumpkins with carved candlelit NEW GAME and RULES labels. See [verification/integration](_documents/codex-john-docs/INTEGRATION-AND-VERIFICATION.md) and [configuration](assets/json/README.md).

## Preview

From repository root: python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1. Reuse an existing server.

## Requirements exception

The shared [game requirements](../README%20-%20game%20design%20requirements.md) are authoritative. At John's direction there is no dedicated Pause button. Local dialogs pause presentation, but the shell drawer does not notify/pause the game. There are no timed penalties. Game controls remain inside the game; score reporting uses only the existing helper.

Opponent arrows cycle Ron +, Harry ++ and Hermione +++, using separate character portraits. Plain names are used in speech/results. Switching preserves the round and is locked only during dialogs/game-over. Ron, Harry and Hermione use the calibrated beginner, medium and expert strategies. Larger portraits keep original name text size; see _documents/codex-john-docs/PORTRAIT-SIZE-DEMO-2026-1012.md for the one-file layout fallback.
