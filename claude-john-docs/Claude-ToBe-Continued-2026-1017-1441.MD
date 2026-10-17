# Claude — To Be Continued (2026-10-17 14:41) — a Settings button in the top bar; Stack's credits; the stamp

This root folder is the SHELL's record. Read first: this file, then the
2026-10-17 12:21 handoff beside it (the helper's second call, Clear
scores reloads the game, the Home icon, Stack's look), then
`specifications.MD` (3, 4, 6l, 6m) and `specifications-technical.MD`
(4j, 4l, 4m). The 2026-09-27 13:07 file is the project's baseline and
stays (the 2026-10-16 20:45 handoff was removed by the three-most-recent
rule; the 13:32 one beside this was stamp-only). Each game keeps its own
docs: `games/candy-go-fish/_documents/claude-john-docs/` and
`games/stack-o-lantern/_documents/claude-john-docs/`.

## State in one paragraph

**The top bar has two buttons again.** 🏠 on the left opens the bottom
panel on GAMES; ☰ Settings on the right (new, mirroring Home) opens it
on THIS GAME; the button whose tab is showing closes the panel, the
other switches the tab (John, 2026-10-17: "HOME takes you back to the
shell GAMES tab, SETTINGS takes you to the shell this game tab").
Picking a game closes the panel and no longer switches its tab behind
the scenes; the slide-wait helper went with that. Stack o' Lantern's
credits line reads "v 0.19.2 10/2026 claude/jp". The stamp is
`2026-1017-stack-sound` in 27 places (Stack's page loads a new
`sound.js`). Stack itself gained sound this afternoon: its own 14:41
handoff. Committed and pushed with this file.

## Work done this session (shell side)

1. `games.json`: Stack's `credits`.
2. `index.html`: `#settingsButton` replaces the spacer span; the top
   panel comment.
3. `app/app.js`: `pressTopButton(tabName)` replaces `toggleDrawer`;
   `currentTab` kept by `showTab`; `startGame` is load + close;
   `afterDrawerSettles` removed; section 2's comment tells the story.
4. `app/styles.css`: the `.top-icon` comment only.
5. The stamp, 27 places.
6. A scratch `check-topbar.cjs` drove the eight open/close/switch states
   at phone width and screenshotted the bar (house, name, three lines).

## ToDo (shell)

- John's phone check from the home-screen icon once Pages serves
  `2026-1017-stack-sound`: the ☰, the two tabs, Stack's speaker and
  sounds, the credits line.
- Add the top-bar states to `games/stack-o-lantern/_documents/checks/check-shell.cjs`.
- Longer term, unchanged: per-game switches that do something or drop
  the switch column; icons for the other games; placeholder slots and
  requirements gaps; the contribution workflow (AGENTS.md, a template
  game, a checker); the two-note "3 set game" sample; a third helper
  read (the whole saved list) if a game wants "almost made the high
  scores" feedback.

## Traps worth remembering

- The cache stamp: 27 places, bump them together (`grep -rn <old>`);
  the docs quote old stamps as history and are left alone.
- `app/app.js`, `app/styles.css` and `index.html` were pure LF this
  session; `games/game-helper.js` and the requirements doc may still be
  mixed or CRLF: check with `grep -c $'\r'` before a big edit.
- John runs his own local server while Claude works. Stop Claude's 8098
  check server by its PID only, never `taskkill //IM python.exe`.
- John loads the served files live; Claude's checks run on 8098 with
  Playwright (the checks' own `require` path and installed Chrome).
