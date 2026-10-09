# Go Fish Candy Edition

Playable demo for the Halloween 2026 shell, registered in slot 8. Open `demo.html` for a centered 9:14 preview or `index.html` for standalone play. HTTP and direct file opening are supported.

**Start with [current state and continuation](codex-john-docs/CURRENT-STATE-2026-1009.md).** It links current rules/gameplay, UI, architecture/data, strategy, integration/testing, the complete animation survey and the implementation handoff. Historical docs preserve earlier decisions and are not current specifications.

Ten types, three copies per type, five initially dealt per player. Request a held type; a success transfers one candy and keeps the turn. Every fishing draw ends the turn. No refill. Empty dish, empty active hand or all sets ends the game after collecting any final set. Most sets wins; ties are possible.

Question bubbles carry the requested candy image; the middle stays the Candy Dish. Human questions send after four seconds or a bubble tap. Opponent questions settle before matching human slots highlight. Yes replies arrive, pause and fade before candy transfer. All transfer/draw routes have source emphasis and curved travel; opponent draws stay private. Celebrations wait for dismissal. The result banner leaves both hands visible.

Data and artwork settings are in [assets/json](assets/json/README.md). Original candy PNGs are unchanged. The strategy receives only its own hand and public clues. There is no implemented difficulty selector, 11/4 variant, expanded catalog selector or position editor.

## Preview and verification

From repository root:

```powershell
python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1
```

See [integration and verification](codex-john-docs/INTEGRATION-AND-VERIFICATION.md) for preview URLs, exact test commands/dependencies and publishing procedure. The verification suite covers engine/naming, full phone/desktop UI rounds, real-time speech/highlights and throttled Red Vines flash regressions. Screenshots are development artifacts.

## Where this game breaks the requirements, and why

The shared [game requirements](../README%20-%20game%20design%20requirements.md) are authoritative. At John's direction there is no dedicated Pause button despite rule 18 addressing automatic movement. There are no timed penalties, but automatic requests/transfers can advance while the shell drawer covers the lower board. The shell provides no pause notification. Local Rules/New Game dialogs suspend JavaScript presentation. Formalize the owner-directed exception before release if necessary.

## Integration and next work

The shell owns Home/title/menu/drawer; New Game and Rules stay in the game. Use only `../game-helper.js` score reporting. Do not restore the removed shell toolbar extension. Settings/audio integration is separate future work.

Animation standardization is surveyed and handed off, not implemented. Its next developer should start with [the implementation handoff](codex-john-docs/ANIMATION-IMPLEMENTATION-HANDOFF.md), preserve current behavior and use the survey as the migration inventory.

John authorized the local **Document Candy Go Fish and hand off animation standardization** checkpoint. **Do not push** until he explicitly asks. Earlier rollback commits are recorded in current state; `5c49271` predates the latest flash/timing fixes.
