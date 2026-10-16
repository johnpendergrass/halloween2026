# Claude — To Be Continued (2026-10-16 14:15) — shell-level handoff

This root folder is now the SHELL's record only. Read first: this file, then
`specifications.MD` and `specifications-technical.MD` here (the shell's
design and build), then the status marker in the repo root. The first
handoff of the project (2026-09-27 13:07) stays as the baseline.

**Candy Go Fish has its own docs now:**
`games/candy-go-fish/_documents/claude-john-docs/` (handoffs, the two spec
files cut from sections 6k and 4k of the root specs, the game's plans) plus
the Codex record in `_documents/codex-john-docs/`. The game folder carries
its own `__STATUS` marker. **Rule (John, 2026-10-16):** a game's
claude-john-docs lives in its own `_documents/claude-john-docs/`; a session
that touches a game writes that game's handoff; a session that touches the
shell writes this one; both when both. Future games follow the same shape.

## State in one paragraph

**The shell works; Candy Go Fish is RELEASABLE in slot 8 (John, 2026-10-16
afternoon)**, pushed with stamp `2026-1016-releasable`. The shell's
remaining gaps are unchanged from the September 27 to October 1 work:
per-game switches change nothing yet, placeholder slots, no icons for the
other games, requirements gaps, the contribution workflow. The shared Sound
switch question was resolved 2026-10-15 by removing it (the game owns its
sound). Standalone move of the game: deferred, plan in the game's folder.

## The next project: one control point (John, 2026-10-16, not started)

John's question: does the shell need two control points, the top
Home/Settings buttons and the bottom sliding panel? His idea: one button at
the top (Home) that brings up the sliding game panel for the current game.
Nothing decided or written yet. Start by reading specs sections 2 to 4 (the
frame, the three panels, the flow) and 3a/3b (the App tab picker and This
Game), then `app/app.js` and `app/styles.css`, before proposing a layout.
John prefers small agreed steps: agree the design before code.

## Work done 2026-10-16 (all of it on the game; summary only)

iPhone sound closed (decoded buffers); fast start; 512 px WebP portraits;
set on arrival; shorter Go Fish pause; startup flash fixed; scrolling
welcome with the shell's This Game text; NEW/HELP; quieter mix; phone
flicker fixed; soundtracks 96 kbps in `assets/sounds/soundtracks/`; Sound
popup polish; every game todo closed; docs consolidated into the game
folder. Details in the game's 14:15 handoff.

## ToDo

Immediate: the one-control-point discussion above.

Longer term (shell): per-game switches that do something; icons for the
other games; placeholder slots and requirements gaps; the contribution
workflow (AGENTS.md, a template game, a checker); Pages switch-on test from
the iPhone home screen; the standalone-game move if ever wanted.

## Traps worth remembering

- The cache stamp is shared by the shell and the game: `app/app.js`
  APP_VERSION, both root `index.html` stamps, and the game's 19 + 1 + docs
  (28 places in all; a Python replace across the list in the game's
  technical spec). Pages serves a new stamp about 50 s after a push.
- `app/app.js` and `app/styles.css` have mixed CRLF/LF; edit with scripts
  that keep each file's own ending, matching whole lines.
- John loads the served files live while Claude tests; warn before and
  restore after any temporary test edit.
- Checks live in the game's `_documents/codex-john-docs/` and need the
  8098 server; `verify-shell.cjs` covers the shell with the game in slot 8.
