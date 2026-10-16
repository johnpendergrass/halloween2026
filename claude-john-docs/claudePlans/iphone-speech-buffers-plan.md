# Plan: make speech and UI clips play on the iPhone (2026-10-15 evening, John + Claude)

Status: PROPOSED, not started. John to choose tomorrow: "experiment", "revert" or "go".

## The problem

On John's iPhone (live GitHub Pages site, Safari) the game is silent for every
sound that starts on its own, some time after a tap:

- the "<name> goes first" voice, which plays when the starter spinner stops
  (about 3.7 s after the dish tap);
- the victory / tie speech, which starts 2 s after game over from a timer;
- so also the demo endings (`?demo=...`), where the speech is the only sound.

Everything that starts inside a tap plays: the welcome music on the artwork
tap, the spinner ticks, the UI clips, the Sound popup. Desktop Chrome plays
everything.

## Evidence (2026-10-15, 18:30 to 19:20, on the live site)

1. `?debug=sound` panel (commit 729d132): engine "running" after the Wake
   button, sound on, ui on vol 1, music on vol 0.8, preload done, 0 failures.
   Engine beep: heard. UI clip: heard. Plain clip (a fresh `<audio>` not
   routed through the engine): heard after a download delay, then every time.
2. Game page alone: artwork tap started the music, Let's play, dish tap gave
   the ticks, no "goes first" voice.
3. Game inside the shell: ticks and voice both heard once; music did not
   start on the welcome but came in when the game started.
4. The iPhone's ring/silent switch was normal. No Bluetooth route.

Reading: the iPhone lets a media element (`new Audio`) start only inside a
user tap or within a short grace period after one, and every clip is its own
element that must earn that separately. The audio engine (AudioContext) only
needs waking once, and sounds the engine makes itself from decoded data
(the ticks) need no further permission. Test 3's voice was heard because the
grace period had not run out that time.

## What this is NOT

- Not the loss celebration. The cannon (6a22be1) and the demo (7934d89) do
  not change when or how any clip starts; the tie commit only added one clip
  to the preload list. Reverting to 59f21b3 would most likely leave the
  voices silent on the phone. The voices after a real game have probably
  been silent on the phone since Codex built them; the demo was simply the
  first time John listened for a timer-started sound.
- Not a mistake in the sound settings, the preload or the files (panel).
- One correction: Claude twice asked John to retry on the phone before a
  push. The phone only ever runs the live site, so those retries tested
  nothing. Always push (stamp bump) before asking for a phone test.

## Option A: the experiment (10 minutes, settles the revert question)

Copy `games/candy-go-fish` as of 59f21b3 into a served side folder (not
`_`-prefixed, e.g. `test-old-go-fish/`), push, John plays one round on the
phone and listens after the spinner and after game over, then the folder is
deleted. Silent too = revert pointless, go to Option C. Talking = Claude was
wrong, revert.

## Option B: revert to 59f21b3's game

Safe but, per the evidence, pointless for the voices. Loses the cannon, the
tie voiceover, the demo endings and the debug panel. Not recommended.

## Option C (recommended): play speech and UI clips from decoded buffers

The ticks already do this. The plan:

1. `js/sound.js`
   - At startup, fetch each UI clip (the 48 in `assetMap()` minus music) and
     `decodeAudioData` it into an AudioBuffer, kept in a Map by sound key.
     Decoding needs the AudioContext to exist (it may stay suspended); the
     context is created in `prepareWelcomeMusic` already.
   - `play(sound)`: if a buffer exists, make an `AudioBufferSourceNode`, a
     per-play gain (the per-sound volume), connect to the channel gain,
     `start()`. Keep the active sources in a Set (like `tickSources`).
     Return an object the callers already understand: `{ clip }` where
     `clip` offers `duration`, `onended` (wired to the source's `onended`),
     `paused`. `scheduleVictory` uses `clip.duration` and `clip.onended` to
     time the game-over music.
   - `stopAll('ui')`: stop every active source (instant; this also retires
     the 84-idle-clips problem for good). `cancelVictory`, `replayVictory`,
     `setChannelEnabled('ui', false)` follow.
   - Victory speeches (36 + tie): not decoded at startup (about 60 MB of
     PCM). Decode on demand with a cache: `scheduleVictory` starts the
     decode at once and the 2 s timer plays it when ready; `replayVictory`
     reuses the cached buffer. Optionally pre-decode the five possible
     clips for the current pairing at deal time.
   - Music stays as media elements: it only starts inside taps, and the
     game-over music in Paused mode resumes a player that a tap unlocked.
   - `unlock()` stays (wakes the engine on Let's play).
2. `js/preload.js`: wait for the UI decodes instead of `canplaythrough` on
   48 elements; record decode failures in `failures`.
3. Checks: `verify-sound-layout.cjs` (counts `readyState >= 4` on 49
   elements and reads `clip.src`), `verify-victory-sounds.cjs` (fakes
   `play` returning `{ clip: { duration } }` and calls `clip.onended()`),
   `verify-spinner-ticks.cjs` (unchanged, probably). Rewrite the first two
   for buffers.
4. Docs: sounds README (the "Audio wake-up" and "Victory" lines),
   CURRENT-STATE, NEXT-TODOS item 14, specs 6k / 4k.
5. Phone test: live site, game page alone and in the shell: artwork tap,
   Let's play, dish tap (ticks + voice), a full round (set fanfares), game
   over (speech, then music in Paused mode), `?demo=tie` (tie voice).

Risks: memory for decoded UI clips (short clips, a few tens of MB at most);
`decodeAudioData` on iOS needs the context created but not running (fine);
the `rewind` helper and the `stopAll` paused-skip become dead code for UI
clips and can go. Size: one to two hours, one commit.

## Small extra (do in any case)

The welcome artwork listens for `pointerdown`; on the phone it worked in
one test and not in another. Add a `click` listener doing the same, and call
`CandySound.unlock()` there. Cheap, and `verify-welcome-music` clicks the
title, so it stays green.
