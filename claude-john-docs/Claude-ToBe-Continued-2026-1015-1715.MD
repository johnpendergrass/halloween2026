# Claude — To Be Continued (2026-10-15 17:15)

Fifth checkpoint of 2026-10-15. Read first:
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(its three "October 15" sections) and `NEXT-TODOS.md`, then
`specifications.MD` 6i, 6j, 6k and `specifications-technical.MD` 4j, 4k.
The 15:07 and 12:56 files hold the earlier parts of the day.

## State in one paragraph

Candy Go Fish in slot 8, standalone move deferred. Since the 15:07 push:
the UI toggle's slowness on the iPhone found and fixed (the OFF tap no
longer pauses 84 idle clips); the Sound popup rebuilt to John's second
sketch with CANCEL / OK; all confirming buttons bright green, secondary
buttons outlined; "3 candies per set" notes on the table; a candy-plate
icon; and the shell reworked for this game: no Sound switch, five scores
with "vs. <opponent>" and "<n> set game" notes, John's own text with gold
GO FISH and a rainbow "candy rainfall", a per-game look, and the tab
switch moved after the panel's slide. Cache stamp
`2026-1015-shell-sound-icon`, committed and pushed at John's request.

## Work done this session (evening)

1. UI toggle: rewind guard for iOS, then the real fix, a toggle that does
   almost nothing on OFF (John's idea). Desktop simulation with a throwing
   `currentTime` setter passes.
2. Set-size notes under ?? / SOUND and above the player's dish, centred in
   their gaps.
3. Shell: Sound switch removed; ten scores tried, back to five; score
   notes; title/short title/description/credits; how-to-play as the Rules
   lines, then replaced by John's text; text marks (`**`, `__`, `~~`,
   `\n`, `!! `); per-game look (cream sheet tried, rejected for the flash;
   dark green kept); tab switch after the drawer settles; icon shown plain
   and larger; byline removed.
4. Sound popup v2 (second sketch), speakers aligned on the centre line,
   controls shrunk, OK label, bright-green OK; then every primary button
   bright green and every secondary outlined.
5. Icon: candy plate + candies, four versions, final: Snickers, Dots, Red
   Vines; moved to `assets/candy-dish/`; fish SVG retired.
6. All Codex checks run one at a time: all pass except the four stale
   ones; `verify-shell` and `verify-assets` learned the icon.
7. Docs, stamp, status marker, commit, push.

## Immediate ToDo

1. **iPhone review:** the UI toggle (is OFF immediate now?), the Sound
   popup v2, the framed dialogs, the shell's This Game tab and icon, the
   game-over music, the preload time (item 5).
2. **Settings placement** (John: "we will revisit that issue later") and
   the "3 set game" wording in the score notes, which is John's text as
   written.
3. Items 2, 6 and 10 from John's list (item 10: four stale checks).
4. Small known things: Rules opened during game over fades the game-over
   music; the byline is gone from the tab (designer and date fields are
   empty in games.json, not deleted).
5. Confirm the Pages build and the live stamp after this push.

## Longer-term ToDo

- Shell: per-game switches still change nothing (Sound option A/B is
  moot now: the switch is gone); placeholder slots, requirements gaps,
  contribution workflow, Pages switch-on + iPhone home-screen test, icons
  for the other games. Standalone move (deferred, plan on file).
- Game: human play feel, startup flash (deferred), rename of the internal
  `wendy` role key (John's call).
