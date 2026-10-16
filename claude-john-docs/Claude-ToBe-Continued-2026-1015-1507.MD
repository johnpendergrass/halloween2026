# Claude — To Be Continued (2026-10-15 15:07)

Superseded the same evening by `Claude-ToBe-Continued-2026-1015-1715.MD`.

Fourth checkpoint of 2026-10-15. Read first:
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(its two "October 15" sections) and `NEXT-TODOS.md` (John's eleven items
with DONE notes), then `specifications.MD` 6k and
`specifications-technical.MD` 4k. The 12:56 file has the earlier
afternoon, the 11:40 file the morning's Music popup.

## State in one paragraph

Candy Go Fish in slot 8, standalone move deferred. Since the 12:56 push:
the set-size switch also on Deal again? (item 11 complete); the vine-and-
plate frame on Deal again?, Rules and the popup; the Music popup became
the **Sound popup** (UI sounds inside, one SOUND speaker on the three
dialogs, layout after John's sketch, green glow / red slash toggles,
CANCEL / CONFIRM, sized to fit a phone without scrolling); NEW GAME and
"?? / SOUND" as teal candy bars; the player's label "NAME (you)" on the
table and in the win title; the soundtrack ramping up a second after the
victory speech in Paused mode (item 4) until New game. Cache stamp
`2026-1015-sound-popup-frames`, committed and pushed at John's request.

## Work done this session (later afternoon)

1. Welcome spacing (speakers lower and nearer the middle, switch lower,
   more room under Let's play).
2. Set-size switch on Deal again?; checked three/four deals from there.
3. Frame on Deal again? (layout kept, taller), on Rules (smaller type,
   padding, no whole-box scrolling, "Tap the Candy Dish" sentence dropped,
   speaker and title lowered 2vw), on the popup.
4. Sound popup: UI toggle folded in, one SOUND speaker, then John's
   sketch layout, then three rounds of sizing (shorter controls, spacing,
   narrower sliders, indented labels, no scrolling on a phone).
5. Candy-bar top buttons, teal tint, "?? / SOUND" label; pumpkins moved
   to `_documents/design ideas/unused`.
6. "(you)" on the table label and the win title.
7. Game-over music in Paused mode; `verify-victory-sounds` rewritten.
8. All Codex checks run one at a time: everything passes except the four
   stale ones (go-fish-reply, quotes, speech, speech-redraw). The browser
   check forced the bar buttons back to 13vw tall; it and
   verify-player-switch learned "(you)".
9. Docs, stamp, status marker, commit, push.

Lesson of the day: a multi-line heredoc with Python inside Bash failed to
parse and a `str.find` replacement swallowed three `<script>` tags of
`index.html` (restored from git, redone line by line). Scratch edit
scripts now go to the scratchpad as files and replace whole lines.

## Immediate ToDo

1. **iPhone review** of everything above: the Sound popup (no scrolling?
   glow visible? CANCEL / CONFIRM reachable in the shell's frame?), the
   framed Rules and Deal again?, the candy-bar buttons, the game-over
   music timing, and the morning's triple-soundtrack preload time
   (item 5).
2. **Settings placement** (John: "we will revisit that issue later"):
   today's inventory is in `specifications.MD` 6k. Item 8 is only partly
   addressed by the "?? / SOUND" label.
3. Items 2, 3, 6 and 10 from John's list. Item 10 now covers four stale
   checks.
4. Known small thing: opening and closing Rules during the game-over
   screen fades the game-over music like any dialog.
5. John's sketch sits at `games/candy-go-fish/design ideas/` (game root,
   not `_documents/design ideas/`); it is committed where he put it.
6. Confirm the Pages build and the live stamp after this push.

## Longer-term ToDo

- Shell: Sound option A or B, Sound + per-game switches, placeholder
  slots, requirements gaps, contribution workflow, Pages switch-on +
  iPhone home-screen test, icons. Standalone move (deferred, plan on file).
- Game: human play feel, startup flash (deferred), rename of the internal
  `wendy` role key (John's call).
