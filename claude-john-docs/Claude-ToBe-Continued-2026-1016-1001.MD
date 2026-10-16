# Claude — To Be Continued (2026-10-16 10:01)

First checkpoint of 2026-10-16, written just before John closes the session,
backs up the game folder by hand and restarts. Read first:
`claudePlans/iphone-speech-buffers-plan.md` (now CHOSEN: Option C plus two
music rules), then `specifications.MD` 6k ("2026-10-16 morning") and
`specifications-technical.MD` 4k ("What today's phone tests add"). The
2026-10-15 19:27 file holds yesterday's late evening; the 18:25 file the
earlier parts of that day.

## State in one paragraph

No code has changed since commit 300675c (stamp `2026-1015-sound-debug`),
which is what GitHub Pages serves. That commit is tagged
**`before-iphone-speech-buffers`** on GitHub as the fallback point; John is
also copying `games/candy-go-fish` to a folder outside the project. Candy Go
Fish is in slot 8 with the candy cannon, tie voiceover, demo endings and the
`?debug=sound` panel. OPEN: iPhone sound. John's tests this morning (live
site, inside the shell, UI on, music on / Always / 80) widened yesterday's
finding: every sound that goes through a media element is unreliable on the
phone, whether a tap or a timer starts it (character arrows silent, "goes
first" voice silent, music a coin flip on the artwork tap, nothing from the
Rules tap); only the spinner ticks (decoded buffer) always play. DECIDED:
Option C, speech and UI clips from decoded buffers, music kept as media
elements but only ever asked to play inside a tap and retried on every later
tap. Work starts next session.

## Work done this session (morning, no code)

1. Read the docs; reported the state and the three choices.
2. John's phone tests, in order: shell flow silent except ticks; the iOS
   Now Playing control in the notch shows the soundtrack as a track, either
   "paused" (play asked before the file was ready, request stalled past
   the tap window) or playing; wifi run silent until a reload and a fresh
   artwork tap. Explained what the notch control is and why "paused".
3. Answered John's two questions from the code: "Loading assets" clearing
   fast proves little on the phone (readiness is a hint there), and the
   music is asked to start in exactly five places, none during play.
4. Explained decoded buffers (same MP3s, decoded in the browser at startup,
   milliseconds per clip, about 30 MB memory, victory speech decoded on
   demand, music unchanged). John: "go ahead with option C" after a
   fallback.
5. Fallback: tag `before-iphone-speech-buffers` on 300675c, pushed and
   verified on GitHub (first tag in the repo).
6. This /update. Docs only; not committed (John will back up and restart).

## Immediate ToDo (next session)

1. **Option C**, one commit, per the plan file:
   - `js/sound.js`: fetch + `decodeAudioData` the 48 UI clips at startup
     into a Map of AudioBuffers; `play()` makes an AudioBufferSourceNode
     with a per-play gain into the channel gain; active sources in a Set;
     return `{ clip }` with `duration`, `onended`, `paused` for
     `scheduleVictory`; `stopAll('ui')` stops the sources; victory speech
     (36 + tie) decoded on demand with a cache, decode started by
     `scheduleVictory`, reused by `replayVictory`.
   - Music: remove the `startWelcomeMusic()` call in the preload-ready
     callback (no tap behind it); make every tap during play a retry when
     music is wanted and the clip is paused (Let's play, dish, arrows,
     candies); keep the Now Playing behaviour.
   - Welcome artwork: add a `click` listener beside `pointerdown`, calling
     `unlock()` and `startWelcomeMusic()`.
   - `js/preload.js`: wait for the decodes, record failures.
   - Checks: rewrite `verify-sound-layout.cjs` and
     `verify-victory-sounds.cjs` for buffers; run the rest one at a time.
   - Stamp bump (five places), docs (sounds README, CURRENT-STATE,
     NEXT-TODOS 14, specs 6k/4k), commit, **push**, then the phone test on
     the live site: alone and in the shell, artwork tap, Let's play, dish
     (ticks + voice), arrows, a round, game over (speech then music),
     `?demo=tie`.
2. Item 13: the opponent's completed set must appear on arrival, not at
   take-off.
3. Remove the `?debug=sound` panel when the sound problem is closed.
4. iPhone review of the rest of 10-15's work (Sound popup v2, framed
   dialogs, shell tab, icon, game-over music, preload time on cellular).
5. Settings placement; items 2, 6, 10 (four stale checks).

## Longer-term ToDo

- Shell: per-game switches still change nothing; placeholder slots,
  requirements gaps, contribution workflow, Pages switch-on + iPhone
  home-screen test, icons for the other games. Standalone move (deferred,
  plan on file).
- Game: human play feel, startup flash (deferred), rename of the internal
  `wendy` role key (John's call), the Now Playing pause button controlling
  the music from outside the game (known, accepted).
