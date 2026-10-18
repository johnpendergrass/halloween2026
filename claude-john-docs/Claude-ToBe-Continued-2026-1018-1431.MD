# Claude — To Be Continued (2026-10-18 14:31) — THE PROJECT IS FINISHED. Bug fixes only from here.

**John, 2026-10-18: "this halloween2026 game is finished. it will likely
be opened for bug fixes, but i am not planning any additional games or
features. October 18th. Done."**

This root folder is the SHELL's record. For a bug fix, read: this file,
then the 13:32 and 13:24 handoffs of this day beside it (what the last
pushes changed), then `specifications.MD` (6r is the GAMES tab as it
ships; 6q the marks in score notes) and `specifications-technical.MD`
(4r, 4q). The 2026-09-27 13:07 file is the project's baseline and stays.
Each game keeps its own docs: `games/candy-go-fish/_documents/claude-john-docs/`
and `games/stack-o-lantern/_documents/claude-john-docs/`; the Pumpkin
Patch has its README.

## What ships (as pushed 2026-10-18, commit 7026830, stamp 2026-1018-gofish-defaults)

- **The shell**: top bar (Home, the game's name, Settings), the 9:15
  game panel, the sliding bottom panel with two tabs. The GAMES tab:
  "HALLOWEEN 2026!" in rainbow over "Small games with a Halloween
  feel.", a row of three icons labelled Patch / Stack / Fish, "Credits:
  jp/claude/chatty 10/2026". The second tab is named for the game
  (PATCH / STACK / FISH) and shows its text, five high scores with a
  date and up to two notes (marks allowed), and a switch column no game
  uses. games.json drives all of it; game3..game7 are benched
  placeholders kept for copying.
- **Pumpkin Patch** (slot 1): silhouettes rise and fall; nothing to do;
  no scores.
- **Stack o' Lantern** (slot 2): 51 milestones, a 24-rung ladder to the
  Moon at 200, big rungs with fireworks at 50 / 100 / 200, the ramp
  floors at 0.65 s from pumpkin 150, a practice level (1, 10 ... 200)
  whose rounds count and are marked CHEAT in the list, sound with a big
  speaker target.
- **GO FISH! - Candy Edition** (slot 3): releasable since 10-16; music
  starts OFF / Always on every new version.

## If a bug fix is needed

1. Make the change in the game's own folder (or app/ for the shell).
2. Bump the cache stamp in all 29 places (`grep -rn <old stamp>`), or
   phones keep the old files. Note: Go Fish resets its sound settings on
   every stamp bump by design.
3. Run the relevant check one at a time on 8098 (Stack's in
   `games/stack-o-lantern/_documents/checks/`, Go Fish's in
   `games/candy-go-fish/_documents/codex-john-docs/`); John's own server
   is 8091, never kill it.
4. /update (a handoff here and in the game's folder, the specs if logic
   changed, the status markers), commit, push.

## Not planned (recorded so nobody wonders)

The ideas that were on the lists are closed, not pending: the
perfect-tolerance table at height in Stack, the MP3 voice per rung, more
moon faces, check-shell additions, dropping the switch column, the
requirements doc's 1..8 wording, the contribution workflow (AGENTS.md, a
template game, a checker), icons for game3..7. John's phone looks at the
last stamps are his to do or not.

## Traps worth remembering

- `app/styles.css` is MIXED line endings; `app.js`, `index.html`,
  `games.json` are LF. Edit scripts try the LF spelling of a passage
  then the CRLF one.
- A bash heredoc turns `\n` inside a Python or JavaScript string into a
  real newline; write edit scripts to a file with the Write tool.
- The drawer starts OPEN on the GAMES tab: a check must not click Home
  first. Test taps on any button must be 400 ms or more apart, or the
  double-tap guard eats the click.
- A game's localStorage note outlives every stamp; Go Fish stores the
  stamp in its sound note, Stack keeps its practice level in memory only.
