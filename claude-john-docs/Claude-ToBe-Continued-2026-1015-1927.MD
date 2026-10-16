# Claude — To Be Continued (2026-10-15 19:27)

Seventh and last checkpoint of 2026-10-15. Read first:
`claudePlans/iphone-speech-buffers-plan.md` (the open problem and John's
three choices), then `games/candy-go-fish/_documents/codex-john-docs/
NEXT-TODOS.md` items 14 and 13, `CURRENT-STATE-2026-1015.md` (its "late
evening" section), `specifications.MD` 6k ("Late evening... continued")
and `specifications-technical.MD` 4k ("Candy cannon and the sound
diagnostic"). The 18:25 and 17:15 files hold the earlier parts of the day.

## State in one paragraph

Candy Go Fish in slot 8, standalone move deferred. Live at stamp
`2026-1015-sound-debug` (commit 729d132): the candy cannon is the
opponent's win celebration (John: "that works really well"), the tie has
its voiceover and half rain, `?demo=win|bigwin|loss|bigloss|tie` shows any
ending, `?debug=sound` shows an audio diagnostic panel. OPEN: on John's
iPhone every clip that starts on its own after a tap is silent (goes-first
voice, victory/tie speech, so the demo endings); everything started inside
a tap plays. Diagnosed tonight as an iOS media-element rule, not the loss
work. Decision pending from John: experiment / revert / buffer fix.

## Work done this session (late evening)

1. Cannon built to John's description, checked, pushed (6a22be1).
2. `CandySound.unlock()` on the dialogs' confirm button.
3. `verify-sound-layout` taught the tie clip (49 sounds).
4. iPhone silence: silent-switch and Bluetooth ruled out; `?debug=sound`
   panel built and pushed (729d132); John's readouts and two live rounds
   gave the diagnosis; plan written with three options.
5. Docs, status marker, commit, push (this checkpoint; no code change
   since 729d132, stamp unchanged).

## Immediate ToDo

1. **John chooses** (plan file): "experiment" (old game in a side folder on
   the live site, ten minutes), "revert" (not recommended), or "go" (speech
   and UI clips from decoded buffers, one to two hours). Then the small
   extra: a `click` listener on the welcome artwork calling `unlock()`.
2. **Rule for phone tests:** push first (stamp bump), the phone only sees
   the live site.
3. Item 13: the opponent's completed set must appear on arrival, not at
   take-off.
4. Remove the `?debug=sound` panel when the sound problem is closed.
5. iPhone review of the rest of the day's work (Sound popup v2, framed
   dialogs, shell tab, icon, game-over music, preload time).
6. Settings placement; items 2, 6, 10 (four stale checks).

## Longer-term ToDo

- Shell: per-game switches still change nothing; placeholder slots,
  requirements gaps, contribution workflow, Pages switch-on + iPhone
  home-screen test, icons for the other games. Standalone move (deferred,
  plan on file).
- Game: human play feel, startup flash (deferred), rename of the internal
  `wendy` role key (John's call).
