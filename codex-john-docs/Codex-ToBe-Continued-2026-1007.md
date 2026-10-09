# Codex handoff — 2026-10-07

## Documentation convention

John requested that Codex keep its documentation and handoffs in `codex-john-docs/`. Claude's existing documentation and handoffs remain in `claude-john-docs/` and are useful historical context. Keep Codex notes here; do not duplicate the authoritative game requirements.

## First-session orientation

This session reviewed the root README, Tristan's short introduction, the latest Claude handoff (2026-10-01 12:39), the scores/settings plan, game requirements, specification excerpts, app structure, helper, demo code, registry, and local server. No application code was changed. No runtime/browser testing was performed. The working tree was clean on arrival; HEAD was `5c6a8be`.

## Project map and verified current behavior

- Plain HTML/CSS/JavaScript, no framework or build step. `index.html` and `app/` provide the container; `games.json` registers games and supplies their metadata and switches.
- The outer frame is 9:16. Its game iframe is 9:14, designed on a 1296 × 2016 artwork canvas. App sizing uses `cqw`; games use width-relative sizing (`vw` or equivalent JavaScript).
- The drawer covers the lower 55% of the game without resizing, pausing, or notifying it. Games own their pause controls.
- Pumpkin Patch is home. Stack-o'-Lantern occupies slot 1; game2–game8 occupy slots 2–8. game1 has no slot. `_TABLED GAMES/` contains inactive games and deliberately incorrect examples.
- `games/game-helper.js` exposes score reporting through `Halloween.reportScore(value, optionalText)`. It calls the same-origin parent's `window.halloweenApp.reportScore`. Standalone reporting logs a note without saving.
- The app stores the five best positive numerical scores per game, with dates and optional display text, in device-local browser storage. Stack-o'-Lantern reports its final count.
- The app displays and saves a global Sound switch and up to three binary switches per game. The helper exposes no sound or settings API; the switches currently do not affect games.
- Local launcher: `start-local/start-halloween.bat`, port 8091. The Python server disables code caching and revalidates assets.
- Current app version: `2026-1001-scores`. Publishing code changes requires updating `APP_VERSION` in `app/app.js` and both `?v=` stamps in root `index.html`.

## Source of truth and working conventions

Read `games/README - game design requirements.md` before game work. It is the single authoritative requirements document. Games are self-contained and touch-playable, use relative local paths, run standalone, and communicate with the app only through the helper. Minimum targets are 13vw in both dimensions; minimum text is 3.6vw, with the documented floors. Verify game layout at 338 × 526 and 547 × 850 CSS pixels.

Claude's specifications record John's preference for small named functions and code understandable by an intermediate JavaScript programmer, with comments explaining decisions. Docs should describe implemented behavior and clearly distinguish proposals.

## Unfinished work from Claude's latest handoff

These are historical pending items, not instructions to implement them in this session.

- Sound approach is undecided: games could manage their own audio and react to changes, or the helper could own audio playback and mute its tracked sounds. A combined API was also discussed. John wants Sound OFF to silence already-playing audio immediately.
- Game switches should apply to the next newly started game. Proposed `Halloween.getSettings()` is not implemented. The effects of Easy/Hard in Stack-o'-Lantern and Slow/Fast in Pumpkin Patch still need agreement.
- Demo sounds, helper API, designer requirements, and demo integration would need coordinated updates once those choices are made. iPhone audio activation needs real-device verification.
- Other pending items include contributor workflow, registry/icon requirements, placeholder confirmation, icons, visual decisions, and eventual GitHub Pages release. Hosting status was not checked during orientation.

The older Claude plan mentions APIs that do not exist yet; follow the current code and latest handoff when determining what is implemented. The latest handoff also says its doc changes were uncommitted at that time, but current HEAD already includes the subsequent documentation commit.

## Next session

Follow John's next request. This was orientation only, not authorization to resume every item in Claude's backlog.
