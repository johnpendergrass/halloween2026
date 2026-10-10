# Integration, preview, verification and publishing

**End-of-day update:** [End-of-first-day handoff](END-OF-FIRST-DAY-2026-1009.md) takes precedence for current runtime and TODOs. This earlier inventory includes assumptions superseded by the quote speed toggle, retained questions, compact boxes and four-copy preview. Resurvey those paths before implementing its refactor plan.

Current state, October 9, 2026.

## Repository and shell

Workspace: `D:\dev\Projects\halloween2026`; game: `games/candy-go-fish`; branch at handoff: `main`. Remote is `https://github.com/johnpendergrass/halloween2026.git`. John explicitly wants local commits and **no push yet**, while Tristan reviews an earlier version on GitHub Pages.

Read and follow the shared [Game Design Requirements](../../README%20-%20game%20design%20requirements.md). Do not duplicate that specification into the game. Game panel is 9:14 on the 1296×2016 art canvas, with no scrolling; shell overall is 9:16. Minimum target is 13vw in both dimensions; normal text floors and width-based sizing remain binding. Refer to the specification for the full constraints.

Registry is root `games.json`: game is **Go Fish Candy Edition**, full `title` and `short_title`, slot 8 at bottom right, local `assets/halloween-fish.svg` icon. The old Game 8 placeholder has no slot. The shell purple banner uses `short_title`; changing only a game-local title does not change it. The local title is currently replaced by the temporary Quotes: Slow / Fast toggle.

Only the existing `../game-helper.js` score API is used: `Halloween.reportScore(humanSetCount, 'human–opponent')`, once at result. Human completed sets are the ranked numeric score. The shell keeps the best five per game/device and ignores zero-or-less scores. Standalone play logs harmlessly instead of storing a score. The game must not directly use parent messaging, parent access or localStorage.

The temporary shared toolbar/helper extension was explicitly removed. New Game and Rules remain game-owned. Do not recreate it. The helper has no settings-read/audio API; shell switch rendering/storage alone cannot make proposed variations work. Such changes need separately authorized coordinated integration.

## Pause exception and drawer

The drawer can cover the lower 55% of the board and does not pause or notify the iframe. At John's direction this game has no dedicated Pause button despite the shared rule addressing automatic movement. Local Rules/New Game dialogs pause JavaScript presentation. There are no time penalties; opponent successful requests may advance automatically while the drawer is open, and an already selected human question can auto-send. Formalize the exception with the owner before release if necessary. Do not infer a new shell pause API.

## Local preview

From repository root in PowerShell:

```powershell
python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1
```

Use `http://127.0.0.1:8098/games/candy-go-fish/demo.html` for a centered game frame, the game's `index.html` for direct play, or root `index.html` for shell/slot 8. Direct file opening also works through the generated config companion. A prior server may already occupy 8098; reuse it or inspect before starting a duplicate. Loopback cannot be reached by an iPhone; use the existing LAN preview setup or a later explicitly authorized GitHub Pages push for device access.

## Verification scripts

Run Node commands from repository root. Browser scripts use the local server above and currently hardcode the bundled Playwright import under `C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` and Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. On another machine, locate equivalent dependencies and update the test harness paths; the game itself does not depend on them.

```powershell
node games/candy-go-fish/codex-john-docs/validate-candy-names.cjs
node games/candy-go-fish/codex-john-docs/verify-engine.cjs
node games/candy-go-fish/codex-john-docs/verify-browser.cjs
node games/candy-go-fish/codex-john-docs/verify-speech.cjs
node games/candy-go-fish/codex-john-docs/verify-speech-redraw.cjs
```

| Script | Coverage |
| --- | --- |
| `validate-candy-names.cjs` | Current catalog and rejected normalized duplicate, missing name and overlong short name |
| `verify-engine.cjs` | One-copy transfer, turn rules, legality, early ending, final-draw set, privacy/memory/conservation and 1,000 simulated games each for three/four copies |
| `verify-browser.cjs` | Phone/desktop fit, target size, dialogs, alternate names, full UI round, both celebration dismissal methods, result hands, replay and file opening |
| `verify-speech.cjs` | Real-time arrival/holds, delayed highlight, manual/automatic actions, reselection reset, source/destination timing, Rules pause, question art/rotation/fit, Yes reading/fade before transfer |
| `verify-speech-redraw.cjs` | Legal Red Vines Yes/Nope scenarios, frame visibility, hidden/removed old layers, delayed timer replay checks and incoming opponent question |
| `verify-shell.cjs` | Existing registry/icon/menu/iframe integration check; run when registry or shell changes |

The full-round harness currently speeds up `setTimeout`, while real-time speech uses real clocks and the redraw test deliberately delays timers. The centralization handoff requires migrating fast-test acceleration before replacing tick-count waits. Do not mistake fast-round tests for visual pacing verification.

Screenshots beside the scripts are development artifacts, not game assets. Some result/celebration shots use alternate Casper/Hazel names intentionally. Tests refresh screenshots; review them for layout, but obtain real iPhone Safari feedback for compositor issues and subjective pacing. No test establishes optimal strategy or enjoyment.

## Git and publishing procedure

Inspect status and scope first. This handoff commit includes the current game changes, tests, updated screenshots and docs since `5c49271`; it is the pre-animation-refactor baseline. Do not include unrelated repository changes. A commit's own hash is recorded in the chat after creation rather than embedded in itself. Older hashes and commit title are in the continuation entry point.

Do not push now. When John later authorizes publishing, inspect the repository's current cache convention and update all required version references together: root `index.html` stylesheet/script cache values plus the app's game-loading cache value. Their last known stamp is `2026-1009-candy-go-fish`. Avoid changing shell behavior. Verify registration/preview and then perform the authorized push; GitHub Pages is already configured.
