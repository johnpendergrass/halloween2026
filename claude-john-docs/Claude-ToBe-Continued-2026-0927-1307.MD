# Claude — To Be Continued (2026-09-27 13:07)

First session of Halloween 2026. Read `specifications.MD` and
`specifications-technical.MD` next; they hold the decisions and details.

## Current state

- Repo created and public: `https://github.com/johnpendergrass/halloween2026`
  (lowercase on purpose). Branch `main`. Pages not enabled yet.
- `index.html` + `app/` = the FIRST scaffold: 9:16 shell (from triageRush),
  off-white single-column menu with Game 1–4, each opening a blank screen with
  Return to Home. Tested phone + PC sizes.
- `mockups/layout-mockup.html` = the CURRENT DESIGN (v6): three panels
  (top bar / 9:14 game panel / sliding bottom drawer), game0 default screen,
  Game 1–4 buttons in the drawer's App tab, Quit Game / 🏠 back to game0.
  Rounded frame, distinct layer colours. John tested it as an iPhone
  home-screen app ("worked fine", "looks good").
- Local server: `start-local/start-halloween.bat` (port 8091).

## Work done this session

1. Extracted triageRush's layout specs, verified against its shipped code
   (John: docs may not match the game) → `triageRush-layout-reference.MD`.
2. Built the scaffold, local server, `.gitignore`, README; created the GitHub
   repo (renamed `Halloween2026` → `halloween2026` for case-sensitive Pages).
3. Studied Halloween2025 (`D:\dev\projects\halloween2025`): host + games with
   render/start/stop; two games were iframe-wrapped standalone projects; its
   right panel slid OVER a fixed game area (did not resize it).
4. Wrote `designing-for-the-frame.MD` (why devices mostly don't matter; the
   seven differences; who handles what).
5. Iterated the layout mockup v1→v6 with John:
   - v1 3:5 game panel + pull tab → v3 full-width strip (John: no tab poking
     into the game) → game panel 9:14.
   - v4 distinct layer colours/edges; bars measured equal (42.44px).
   - v5 rounded frame corners on all devices; bars follow; game panel crisp.
   - v6 TRIAL: stage purple to match top panel + `black-translucent` status bar.
6. Decided: nothing ever goes outside the frame (John: not worth per-device
   design). Colouring outside the frame is OK.

## Immediate ToDo

1. **John's verdict on the v6 TRIAL** (purple stage + black-translucent status
   bar). If "nix it": `--stage-bg` back to `#07040a`, status bar `black`,
   theme-color `#07040a` (all marked "v6 TRIAL" in the mockup).
2. Settle remaining layout details: drawer open height (55%?), what exactly
   goes in the top panel, whether the orange frame outline stays.
3. **Decide how games plug in** — recommendation is iframes (see spec §6).
   Then turn the mockup's four games into real `games/<id>/index.html`
   iframe pages and test Quit/score messages for real.
4. Move the three-panel design from the mockup into the real `index.html` /
   `app/` (replacing the first scaffold).
5. Save Halloween2025 lessons as their own note if John wants
   (currently summarised in specifications.MD §7).

## Long-term ToDo

- Message contract + helper script (`Halloween.reportScore()` etc.), settings
  declared as data and drawn by the app in the This Game tab, pause/resume on
  drawer open/close, sound on/off, high scores saved by the app.
- Games registry (one list → menu generated automatically).
- HOME screen with background animations (John's plan step 2).
- The mini-game spec for friends + `CLAUDE.md`/`AGENTS.md` + template game +
  checker script (plan step 3).
- Rules still to write: sound (iPhone tap-to-unlock, mute switch), file/art
  size limits, "please rotate your phone" message, gesture blocking over the
  game panel.
- Icons (apple-touch-icon 180, manifest 192/512/maskable), link-preview tags,
  QR code; enable GitHub Pages.
- Git workflow for friends (branches + pull requests); asset rights (public repo).
- Deadline: 2026-10-31. Aim to finish plan steps 1–3 in ~1–2 weeks.
