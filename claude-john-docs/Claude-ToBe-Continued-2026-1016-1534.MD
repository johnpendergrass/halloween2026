# Claude — To Be Continued (2026-10-16 15:34) — shell: one control point BUILT

This root folder is the SHELL's record. Read first: this file, then
`specifications.MD` (sections 2 to 4, 3a, 3b) and
`specifications-technical.MD` (section 4) here, then the status marker in
the repo root. The 2026-09-27 13:07 file is the project's baseline and
stays. Candy Go Fish keeps its own docs in
`games/candy-go-fish/_documents/claude-john-docs/` (its handoff of the same
time covers the game-side changes of this session).

## State in one paragraph

**The shell has one control point (John's design, built and browser-checked
2026-10-16, NOT yet committed).** The top bar is Home plus the game's name;
the menu button is gone. The bottom panel has no strip or arrow: closed, it
is out of sight; Home opens it on THIS GAME; Home again, or a tap on the
game above it, closes it; picking a game closes it too. The game panel is
9:15 (15/16 of the frame; design canvas 1296 × 2160). The "home" slot is
gone: the game in slot 1 is shown at start under the open GAMES tab, and
that is the Pumpkin Patch (Stack-o'-Lantern moved to slot 2, the game2
placeholder is benched). Tabs are labelled GAMES and THIS GAME. Cache stamp
`2026-1016-one-control` in app.js, both root stamps and the game's 20
places. Candy Go Fish stays RELEASABLE in slot 8.

## Work done this session (2026-10-16 afternoon)

1. **Deleted for good** (John): `games/candy-swap` (an abandoned start,
   203 files) and `games/_TABLED GAMES` (Pie Maker, wrong-desktop,
   wrong-phone, Hollow Hill; 22 files). Both `git rm`, staged. Every
   mention was cut from the root README, both shell specs (sections 6b,
   6d, 6g, 4c, 4e, 4h removed; 6h and 4i rewritten) and one clause of the
   2026-10-07 Codex handoff. Rule recorded in 6h: a dropped game is
   deleted, folder and entry together; nothing is parked in the repo.
2. **One control point** (design agreed in chat, then built):
   - `index.html`: menu button and strip removed; an empty `span.top-icon`
     balances the title; `div.game-cover#gameCover` (hidden) between the
     game panel and the drawer; comments.
   - `app/styles.css`: `.game-panel` bottom 0 (9:15); `.game-cover`
     (absolute, inset 0, z-index 4, no look); `.drawer` height
     `100% * share`, closed `translateY(100%)`; strip/arrow rules gone;
     `.game-buttons` centres the board (`justify-content:center;
     min-height:100%`); `.top-title` gets `min-width:0; overflow:hidden;
     text-overflow:ellipsis` and `.top-title .accent { color: pumpkin }`.
   - `app/app.js`: `homeGame` and `goHome()` gone; `openDrawer`/`closeDrawer`
     show/hide the cover and set `aria-expanded` on Home; `toggleDrawer`
     is Home (close if open, else `showTab("game")` + open); `#gameCover`
     click closes; `startUp()` loads `games[0]` (slot 1 or the lowest),
     `showTab("app")`, `openDrawer()`; no "home" special case in
     `pickButtonGames`; `loadGame` renders the top title with
     `appendMarkedText` and puts `look-<folder>` on it.
   - `games.json`: pumpkin-patch slot 1, stack-o-lantern 2, game2 "";
     field notes for `goes_in_slot`, `title`, `short_title` rewritten.
   - Placeholders game1..8: size readout says 9:15 = 1.667.
   - Tabs renamed GAMES / THIS GAME (John first chose CURRENT GAME, then
     "I like THIS GAME better"); data-tab values and ids unchanged.
   - Browser checks (Claude in Chrome, John's 8091 server): panel ratio
     1.6668; drawer 55% of the panel; Home/tap/pick flow; all three games
     lay out (Go Fish's board centred with more felt; Stack re-reads the
     shape; the Patch crops a little more); labels fit at SE width; the
     game's `verify-shell.cjs` passes on port 8098 (it rewrote its two
     PNGs, which show as modified).
   - Quirk, accepted: a tap landing where the panel will be, before the
     300 ms slide finishes, hits the cover and closes it again. Seen only
     with scripted 0 ms clicks.
3. **Docs**: rules doc (canvas 1296 × 2160, diagram, rule 3 = 9:15 with
   9:14 to 9:16 tolerated, section 1.8 "the Home button", device table),
   both shell specs (3, 3a, 3b, 4; technical 2, 4, 4a, 4b, 4b2, 4i),
   root README (current work, folder list, pause and settings bullets),
   Pumpkin Patch README, the number in `__TRISTAN README!.txt`.
4. **Go Fish's name in the shell** (John): games.json title
   `__GO FISH!__\nCandy Edition` (two lines in the tab, the gold accent
   1.4× the subtitle; icon-to-title gap 6cqw) and short_title
   `__GO FISH!__ - Candy Edition` (top bar: GO FISH! in pumpkin at the
   bar's size, the rest white at about three quarters). Both sized in
   section 5b of styles.css under `.look-candy-go-fish`. No exclamation
   mark on "Candy Edition" anywhere (the welcome screen lost its too).
5. **Go Fish's score note** (John): `reportScore` sends one note,
   `<player> vs <opponent>` ("Sully vs Hermione"); the set-size note is
   gone. Game-side change, see the game's handoff.

## ToDo

Immediate:
- **John commits and pushes** from GitHub Desktop (deletions, shell, docs,
  the earth soundtrack edit, two refreshed check PNGs). Pages serves the
  new stamp about 50 s later.
- Look at the shell on the iPhone from the home-screen icon: the 9:15
  panel, Home, tap-to-close, the long GO FISH! title in the bar.

Longer term (shell, unchanged): per-game switches that do something;
icons for the other games; placeholder slots and requirements gaps; the
contribution workflow (AGENTS.md, a template game, a checker); whether
the shell's helper and rules doc examples should drop the two-note
"3 set game" sample now that the only real game sends one note.

## Traps worth remembering

- The cache stamp is shared by the shell and the game: `APP_VERSION`,
  both root `index.html` stamps, the game's 19 `?v=` in `index.html` and
  1 in `js/candy-go-fish.js`; the game's docs quote old stamps as history.
- `app/app.js` and `index.html` are CRLF; `app/styles.css` is mixed;
  games.json and the placeholders are LF. Edit with scripts that match
  whole lines and keep each line's own ending (the scratch scripts of this
  session did). A bash heredoc turned `\\n` into a real newline inside
  games.json once; write the script to a file instead.
- John loads the served files live on port 8091; a reload mid-edit shows
  half-done work. Test on 8091 (no-cache) or start your own on 8098 for
  the game's checks; stop it afterwards.
- The `look-<folder>` class is now on BOTH the tab and the top title;
  section 5b rules for the title must say which (`.top-title.look-x` vs
  `.look-x .this-game-title`).
