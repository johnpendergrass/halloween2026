# Claude — To Be Continued (2026-10-16 11:33)

Second checkpoint of 2026-10-16, written for the "sound fix worked" commit.
Read first: this file, then `specifications.MD` 6k (the 2026-10-16 entries,
from "2026-10-16 morning" to "Sound closed") and
`specifications-technical.MD` 4k ("What today's phone tests add" through the
line-endings trap). The game's own record is
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(October 16 section) and `NEXT-TODOS.md`. The 10:01 file holds this morning
before any code; the 10-15 19:27 file yesterday's late evening.

## State in one paragraph

**The iPhone sound problem is closed.** John heard every sound on the live
site (wifi, in the shell): the "goes first" voice, the character arrows, the
set fanfares, the victory speech. The fix is Option C of
`claudePlans/iphone-speech-buffers-plan.md`: the twelve short sounds are
fetched and decoded into AudioBuffers at startup, the 37 victory speeches on
demand, and all play like the spinner ticks always did; the three soundtracks
stay media elements that only ever start inside a tap, with every click
retrying a stalled tune. Then, the same day: "Let's play" no longer waits for
the music and only the chosen tune preloads; the six character portraits went
from 8.8 MB of 1024 px PNGs to 183 kB of 512 px WebP; the `?debug=sound`
panel and its two diagnostics were removed. Stamp `2026-1016-sound-fix-worked`.
Candy Go Fish is in slot 8, every one of the twelve live checks passes, and
the fallback tag `before-iphone-speech-buffers` (= 300675c) stays on GitHub.

## Work done this session (2026-10-16, after the 10:01 checkpoint)

1. **Option C built** (commit d6cc38c, stamp `2026-1016-sound-buffers`):
   `sound.js` buffers/voices/decode-on-demand/`retryMusic`/`userTapped`;
   `preload.js` waits for the decodes; `candy-go-fish.js` welcome `click`
   listener, `document` click → `userTapped()`, no auto-start after loading.
   `verify-sound-layout` and `verify-victory-sounds` rewritten;
   `serve-game.cjs` added (fetch needs http); `verify-welcome-music` taps
   the title in every mode. John's phone test: every sound heard.
2. **Fast start** (e40e3b0, `2026-1016-fast-start`): John's cold start took
   ~10 s of blank popup and ~10 s of "Loading assets". Now `ready` (images +
   twelve decodes) enables the button; `musicReady` is separate; only the
   chosen tune is prepared, after `restoreSoundSettings` (so
   `CandyPreload.start` moved below it); `selectTrack` creates a newly
   picked tune at once.
3. **Measured the cold start** of the live site (throwaway Playwright
   script, CDP cache clear + throttling): the welcome shows in ~1 s; the
   wait was the six portraits (8.8 MB), which on good 4G passed the 6 s
   preload bound (Let's play at 6.4 s). John's "brisk" cellular restart
   was warm: a stamp refreshes scripts only, images and music stay cached.
4. **Portraits** (ba1b7ec + b92c349, `2026-1016-small-portraits`): 512 px
   WebP, quality 85, after John asked about iPad and 4K (max drawn size
   311 device px on an iPad in portrait; 246 on 4K at any scaling).
   Originals in `_documents/design ideas/character portraits/` with
   `_why these were converted.txt`. After: 3.5 MB cold download, Let's play
   3.3 s on good 4G with no timeouts; slow 4G unchanged at ~7.6 s (the tune
   competes with the images). Candies left as PNG (John: not a problem).
5. **Cleanup** (this commit, `2026-1016-sound-fix-worked`): `?debug=sound`
   panel and `engineState`/`testTone` removed; docs and marker updated;
   twelve checks green. John also moved his three sketch files from
   `games/candy-go-fish/design ideas/` into `_documents/design ideas/`.
6. Memory notes updated: per-file line endings and the `sed -i` CR trap;
   how to run the checks (8098 server, timeouts, stale four, PNG restore).

## Immediate ToDo (next session)

1. **Item 13** (NEXT-TODOS): when the opponent takes a candy that completes
   a set, the set appears in the opponent's dish at take-off; it must appear
   on arrival (mirror of item 7, the human's give path).
2. **Real cold start on the phone**: private tab or cleared site data, on
   cellular. Expect ~1 s to the welcome, a few seconds to Let's play.
3. iPhone review of the 10-15 work not yet looked at closely: Sound popup
   v2, framed dialogs, shell tab + icon, game-over music in Paused mode on
   the phone (a timer start; the next tap should rescue it).
4. Settings placement (John: revisit later); items 2, 6, 10 (four stale
   checks: go-fish-reply, quotes, speech, speech-redraw).

## Longer-term ToDo

- Shell: per-game switches still change nothing; placeholder slots,
  requirements gaps, contribution workflow, Pages switch-on + iPhone
  home-screen test, icons for the other games. Standalone move (deferred,
  plan on file).
- Game: slow-4G lever (start the tune's download after `ready` settles);
  candies to WebP at the same 500 px (~1.3 MB, optional); human play feel;
  startup flash (deferred); rename of the internal `wendy` role key (John's
  call); Now Playing pause button controlling the music from outside the
  game (known, accepted).

## Traps worth remembering

- A new stamp is NOT a cold start: only stamped files refresh; images and
  music are cached ten minutes and then revalidated without a download.
- Pages' edge is cold for a minute or two after a deploy; a phone test in
  that window sees a slow blank popup that friends will not.
- This Git Bash's `sed -i` strips CR from CRLF files; use Python edit
  scripts that keep the file's own ending. `file <path>` shows the truth.
- Browser checks need the 8098 server for browser/shell/piles; wrap each in
  `timeout`; restore the PNG screenshots afterwards; skip the stale four.
