# Candy Go Fish — Technical Specifications

Last updated: 2026-10-18 13:40 (channels.music.enabled false and musicMode 'continuous' by default, restoreSoundSettings honours a saved true; before that 2026-10-16 15:34: score note, welcome subtitle, 9:15 panel; the name rules live in the shell's app/styles.css 5b, see the root technical spec 4b2). Before: 14:15 RELEASABLE, consolidated here from section 4k of the root file; sub-headings keep their 4k numbering.

## 4k. Candy Go Fish implementation notes (games/candy-go-fish/, 2026-10-14 reading)

Authoritative detail is in the game's own `_documents/`; this is the
map Claude built while reading the code. Codex's style is dense (long
lines, compact IIFEs, no comments on the obvious); anything Claude adds
follows John's readable style instead.

**Files and load order** (`index.html`, all with `?v=` stamps):
`../game-helper.js` → `assets/json/config-data.js` (generated twin of
`game-config.json`, used for `file://` opening or fetch failure) →
`js/game-engine.js` (pure rules, `CandyEngine`) → `js/computer-player.js`
(the original weighted-random policy, kept as Ron's baseline) →
`js/shared/knowledge.js` (public-clue memory + exact hidden-card
distribution), `temporal-memory.js`, `temporal-beliefs.js` (particle
filter) → `js/strategies/beginner|medium|temporal|calibrated-*.js` →
`js/strategies.js` (adapter; also publishes a decision trace as JSON in a
`<script id="opponentDecisionTrace">`) → `js/candy-rain.js`,
`js/candy-piles.js` → `assets/sounds/victory-sounds.js` (generated index
of the 36 speech files) → `js/preload.js` → `js/sound.js` →
`js/candy-go-fish.js` (the controller, one async IIFE, ~720 lines).

**Engine model.** `CandyEngine.create(config)` deals so that no opening
hand holds a completed set. State: `pile`, `hands.human/wendy`,
`sets.human/wendy`, `turn`, `pending`, `finished`, `reason`, `winner`,
`history`. `request()` returns events (`request`, `transfer`/`set` or
`miss`); `fish()` always switches the turn. Public `history` never holds
the identity of a private draw. The role key for the opponent is still
`wendy` everywhere (the first opponent's name), whatever character is
shown.

**Controller phases**: `pickStarter → spinningStarter → starterReady`
(empty-board spinner, 3.7 s, ticks follow the rendered rotation) then
`choose / requesting / thinking / wendyRequest / fishResponse /
humanFishWait / wendyFishWait / drawing / finished`. A `generation`
counter invalidates every awaited step when a new round starts; `waitActive`
and `playVisual` poll every 40 ms and pause while a dialog is open.
`render()` rebuilds the whole board from state each time.

**Audio.** `preload.js` loads every image and 48 short clips (plus the
three soundtracks as media elements, 20 s bound each) while the welcome
shows; the Play button says "Loading assets" until it settles, with 6 s /
20 s bounds and failure permitted. `sound.js` routes every clip through
Web Audio: one gain per clip → `ui` or `music` channel gain → destination.
Spinner ticks are a synthesized 18 ms noise burst through a 3.2 kHz
low-pass.

**Music (2026-10-15, Claude's code in John's readable style).** In
`sound.js` a `musicTracks` table (`id`, `name`, `file`) holds one lazily
created clip entry per tune; `currentTrack` points at the chosen one.
`startWelcomeMusic` fades the current tune's clip gain 0 → 0.5 over 3 s;
`fadeOutTrack(track, seconds, fadeInStart)` fades any tune to 0 and pauses
it after the ramp (position kept). `fadeOutWelcomeMusic` is a 2 s fade of
the current tune, and does nothing in `musicMode === 'continuous'`.
`selectTrack(id)` fades the old tune out over 1 s and starts the new one
if a dialog wants music. Channels carry a `scale`: music is `1 / 0.75`, so
`setChannelVolume('music', v)` with the slider's 0..1 gives up to a third
more than the original level (0.75 = old level, default 0.8). Mode API:
`musicMode` / `setMusicMode('paused' | 'continuous')`. Defaults since
2026-10-18: `channels.music.enabled` is `false` and `musicMode` is
`'continuous'` (both were the other way). `restoreSoundSettings` in
candy-go-fish.js now applies any boolean `saved.enabled` (it only applied
`false` before, which was enough while the default was on); the popup's
markup in index.html starts with `#musicEnabled` `aria-pressed="false"`
and `#modeContinuous` pressed, though `syncAudioControls` redraws it at
load anyway. The MUSIC tap path is unchanged: `applyMusicSettings` sees
`enabled` change to true, calls `setChannelEnabled('music', true)` then
`startWelcomeMusic()`, which plays the current tune with the 3 s fade
regardless of mode.

The popup lives in `index.html` as a second overlay `#musicOverlay`
(`.music-options`, z-index 30, panel 90vw × 94vh, flex column with the
Cancel/Done row pushed to the bottom). `candy-go-fish.js` snapshots the
settings on open (`musicBefore`), applies each control immediately, and
Cancel re-applies the snapshot. The Tab trap in the keydown handler
switches to the popup's controls while it is open.

**Saved settings.** Key `halloween2026:candy-go-fish:music`, value
`{ enabled, volume, track, mode, ui }`, written by `saveSoundSettings()`
on Done and on the UI toggle, read once by `restoreSoundSettings()` at
startup with every field validated (unknown tune, out-of-range volume or
bad JSON are ignored). Both are wrapped in try/catch so a browser that
refuses storage still starts the game.

**Candies per set (2026-10-15).** `config.rules.copiesPerType` is the
single source: `engine.create` builds the deck from it, every strategy
reads it from the view (`view.copiesPerType`), the Rules and celebration
texts read `state.copies`, and the hand art stacks up to three images.
`applySetSize(copies)` in `candy-go-fish.js` writes `copiesPerType` and
`initialHandSize = base + (copies - baseCopies)` into `config.rules`,
which the next `startGame` / `dealGame` picks up; `baseRules` is a copy of
the file's values taken at load. Saved under
`halloween2026:candy-go-fish:rules` as `{ copiesPerType }`; only 4 is
honoured, anything else means the file default. The switch `#setSizeChoice`
lives in the dialog markup between `#dialogBody` and `#dialogAction` and is
shown by CSS only under `.welcoming` (add `.new-round` for Deal again?).
Audit numbers: 300 simulated games per opponent per size, opponent win
rates 60/66/83 percent at four copies against a random human versus
58/58/76 at three; four-copy games average 47 requests versus 28.

**Two-way slider switch (CSS).** `.two-way` is a flex row with a
`.two-way-thumb` span absolutely positioned under the first half;
`data-selected="1"` on the group translates the thumb by 100 percent
(0.25 s, none under reduced motion). The pressed button
(`aria-pressed="true"`) gets the dark text and a `::after` green circle with
a cream check at `top/right: -1.6vw`, outside the button box, so it never
overlaps the candy bars. JS sets `data-selected` and both `aria-pressed`
values together (`applySetSize`, `syncMusicPopup`).

**Remembered characters.** `halloween2026:candy-go-fish:players` holds
`{ opponent, player }` (names). `restorePlayers()` runs before the
module-level `humanName` / `opponentName` are read, so it simply
`Object.assign`s the matching entries from `config.playerCharacters` and
`config.opponents` into `config.players.human/wendy`; no cue sound, no
renaming. Each switch function calls `savePlayers()`.

**Speaker buttons.** `.audio-toggle` is a flex column: the 11vw image,
then the label. The slash is the button's `::after`, absolutely centred on
the image (`top: 5.5vw`) and shown by `aria-pressed="false"` (UI toggle,
popup ON/OFF) or `.is-off` (the MUSIC button, which opens the popup).
Lesson: an `img` with a CSS `filter` forms a stacking context and paints
above later in-flow siblings; anything meant to sit over such an image
needs `position: relative; z-index`.

**Give-path redraw.** In `resolveRequest`, when the actor is the opponent
(the human gives), `render()` runs before `fly()` instead of only
`piles.render(state)`; the flight's source rectangle was snapshotted by
`piles.begin` beforehand, so the redraw does not move it.

**Stale checks.** `verify-go-fish-reply.cjs` (clicks Let's play and expects
a selectable hand; the starter spinner now comes first), `verify-quotes.cjs`,
`verify-speech.cjs` and `verify-speech-redraw.cjs` (the last three expect
"Wendy asks:") fail on any current code and are not part of Codex's
October 13/14 pass lists. Item 10 in `NEXT-TODOS.md`.

**Dialog frames (2026-10-15 pm).** The vine-and-plate frame is one
`::before` rule shared by `.welcoming`, `.new-round`, `.rules` and
`.music-options` dialogs (`position: relative; isolation: isolate`, the
frame at `inset: -3.2vw`, `z-index: -1`). A frame drawn by `::before`
scrolls and clips with a scrolling box, so no framed dialog scrolls as a
whole: Rules is a flex column with `max-height: 94vh` and only
`#dialogBody` scrolls; the Sound popup likewise, with its rows in
`.music-body` and the title and `.music-actions` pinned. The welcome, Deal
again? and Rules dialogs share the `.dialog-audio` row (one `#dialogSound`
button, `justify-content: flex-end`) and the `#setSizeChoice` switch
shows under `.welcoming` and `.new-round`.

**Sound popup (2026-10-15 pm).** Same overlay (`#musicOverlay`), same
storage key and same `musicSettings()` snapshot, which now includes `ui`,
so Cancel restores the UI channel too and `saveSoundSettings` writes the
snapshot as is. Toggles `#uiEnabled` and `#musicEnabled` are `.audio-toggle`
buttons without a label; `syncToggle(id, name, on)` sets `aria-pressed`
and the aria-label, CSS draws the green glow (`box-shadow` on the image)
or the red slash. The Always/Paused switch has Always on the left, so
`#modeChoice` gets `data-selected` "0" for continuous and "1" for paused.
The dialog SOUND button carries `.is-off` only when both channels are off.
The volume `<output>` is gone; `.volume-ticks` is a flex row of six
numbers under the range. The layout is sized by `vw` with a
`@media (max-height: 700px)` block that tightens spacing on short screens.
Measured with a throwaway script at 390x844, 390x664, 375x667, 390x560
and 338x526: the buttons stay on screen and the body does not scroll.

**Game-over music (2026-10-15 pm).** In `sound.js`, `victoryMusicAfter(ms)`
arms one timer that calls `startWelcomeMusic()` only while
`musicMode === 'paused'`. `scheduleVictory` sets `victorySpeechPending`
when it arms the two-second speech timer; when the speech plays it arms
the music for the clip's duration plus a second (a fallback for a phone
that silently refuses the clip) and `clip.onended` re-arms it to one
second. `scheduleGameOverMusic()`, called at the end of `finishGame`,
arms three seconds when no speech is pending (tie, UI off, no clip).
`cancelVictory` clears both timers; `replayAfterRain` calls
`fadeOutWelcomeMusic()` so the music fades during the rain drain (a no-op
in continuous mode). `verify-victory-sounds.cjs` was rewritten: its
sandbox `setTimeout` keeps the 2000 ms timer as the speech and any other
delay as the music timer, and the test fires them by hand.

**Top buttons.** `.game-bar button` is 27vw by 13vw (13vw is the minimum
target `verify-browser` enforces); the candy bar is a `::before` layer
with `filter: hue-rotate(170deg) saturate(0.7)` (red bar, hue 1, to the
gradient top #21786b, hue 171) so the cream text on top is untinted. The
label is a visible `<span>` again (it used to be visually hidden under the
carved pumpkin art). `preload.js` lost the two pumpkin entries.

**UI toggle on iOS (2026-10-15 evening).** `stopAll(channel)` and
`cancelVictory` touch only clips with `!clip.paused`; `rewind(clip)` skips
`readyState === 0` and swallows the InvalidStateError iOS throws for an
unloaded clip; `play()` calls `rewind` before `clip.play()` so a clip
paused mid-way by the OFF switch starts over. The popup's UI toggle
handler redraws in a `finally`. Checked with a desktop simulation whose
`currentTime` setter always throws (`ios_toggle_check.cjs`, scratch).

**Set-size notes.** `#setSizeNote` (absolute, under the right bar button)
and `#setSizeNoteHuman` (inside `#humanPile`, `bottom: 100%`) are written
by `applySetSize`.

**Icon.** `assets/candy-dish/icon-candy-plate.png`, 256x256, built by a
scratch script (`make_icon2.py`: ghost plate at 250 px, three trimmed
candy images resized, rotated and shadowed at hand-placed centres). The
shell's `iconQualifies` accepts it; `verify-assets` and `verify-shell`
name it.

**Editing traps learned 2026-10-15.** `app/app.js` and `app/styles.css`
have mixed line endings (CRLF from older edits, LF from newer), so an
exact-text replacement must try both; a Bash heredoc holding a long
Python script with quotes failed to parse once and a `str.find` slice of
`index.html` swallowed three `<script>` tags (restored from git). Scratch
edit scripts are now written as files and replace whole lines where they
can.

**"(you)".** `showTableName()` in `candy-go-fish.js` writes
`humanName.toUpperCase() + ' (you)'` to the player's `.portrait-name`;
`switchPlayerCharacter` calls it. The game-over title adds " (you)" to
the human winner only. `verify-browser` and `verify-player-switch` were
taught the suffix. The throwaway Playwright scripts written on 2026-10-15
(give path, players note, set size, popup, four-copy UI rounds, node
simulation) were not kept; their shape is described in the handoff.

**Config.** `assets/json/game-config.json` is authoritative; after an
edit run `node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs`
(it validates candy names first). After renaming victory MP3s run
`sync-victory-sounds.cjs`.

**Checks** (`node games/candy-go-fish/_documents/codex-john-docs/<script>`
from the repo root): `validate-candy-names`, `verify-engine` (1,000 games
per set size), `verify-assets` (every referenced asset exists, no unused
tracked asset; untracked audio is ignored), `verify-victory-sounds`,
`verify-sound-layout`, `verify-spinner-ticks`, `verify-welcome-music`,
`verify-browser`, `verify-shell`, `verify-player-switch`,
`verify-opponent-switch`, `verify-candy-rain-game`, `verify-piles`,
`verify-abilities-browser`. All of these passed on 2026-10-15 at 15:00;
the Playwright ones rewrite their PNGs under `codex-john-docs`, restored
with `git checkout --` before committing. The browser checks
hard-code Playwright at `C:/Users/johnp/.cache/codex-runtimes/...` and
Chrome at `C:/Program Files/Google/Chrome/...`; most open the page by
`file://`, some (`verify-browser`) need a local server on port 8098:
`python start-local/no-cache-server.py --port 8098`. Two traps learned
2026-10-15: a check whose assertion fails leaves the browser open and the
node process hangs instead of exiting, so run checks one at a time and
watch for silence; and `verify-assets` rejects any tracked audio that no
code references, so a new MP3 must be added to its `referenced` list.
`verify-welcome-music` still keys on the Wonderful file and the 0.5 clip
ramp, both unchanged by the popup.

**Ties to the shell** (matter for the standalone move, see
`claudePlans/candy-go-fish-standalone-plan.md`): the helper script tag
and one `Halloween.reportScore` call; every size in `vw`, so the page
assumes a 9:14 viewport (`#table` is 154vw tall); `verify-assets.cjs`
reads `../../games.json`; docs link to the requirements file two folders
up.

**Publishing (Codex's rule, confirmed by a failed build):** Pages runs
Jekyll on this repo, so every tracked Markdown file must be valid UTF-8
before a push, and `_`-prefixed folders are not served (harmless, they
are docs). Cache stamp lives in five places: `APP_VERSION` in
`app/app.js`, two `?v=` in root `index.html`, every `?v=` in the game's
`index.html`, and the config fetch in `js/candy-go-fish.js`; the docs
also quote it.

**Endings, 2026-10-15 late evening.**

- **Rain moods.** `js/candy-rain.js` now has a `MOODS` table at the top
  (`full` and `tie`; a `trickle` row existed for an hour and is gone):
  burst, perTick, tickMs, maxOnScreen, total, brands, fallMs range, turns
  range, drift share and an extra CSS filter. `start(waitMs, moodName)`
  picks a row; the layer carries `data-mood`. `drop()` counts candies
  since the last start so a mood can have a finite `total`. `finishGame`
  passes `'tie'` for a tie and `'full'` otherwise. The old code is the
  `full` row, number for number.
- **Tie voiceover.** `sound.js` `assetMap()` adds `victory:tie` ->
  `assets/sounds/speech/tie/tie - no one saw that coming.mp3`. The
  `victory:` prefix is what `cancelVictory` and the preload key on, so
  the tie clip is preloaded, cancelled by New game and replayed by the
  speaker button like any speech. `scheduleVictory(winner, loser, 0)`
  selects it; `finishGame` now calls `scheduleVictory` for every result
  (names are irrelevant on a tie) and shows the replay button whenever
  `hasVictorySpeech`. `verify-victory-sounds.cjs` asserts the clip plays
  for margin 0 and that the file exists; `verify-assets.cjs` lists it.
- **Demo endings.** At the bottom of `js/candy-go-fish.js`: `DEMO_SETS`
  maps `win [6,4]`, `bigwin [8,2]`, `loss [4,6]`, `bigloss [2,8]`,
  `tie [5,5]` (player sets, opponent sets, ten types). When `?demo=` is a
  key, the welcome's Let's play callback is `playDemoEnding` instead of
  `startGame`: it runs `startGame()`, creates a real engine state, pools
  every card, hands whole types to each player as `{type, cards}` sets,
  empties pile and hands, sets `finished`, `reason 'allSets'` and
  `winner`, then calls `finishGame()`. Works over `file://` and HTTP. The
  shell's iframe URL does not carry the query, so open the game page
  directly (`/games/candy-go-fish/index.html?demo=loss`).
- **Session scripts (scratchpad, not in the repo):** `endings_shot.cjs`
  (five demos, mood, replay button, screenshots), `tie_check.cjs` (over
  port 8098: the tie clip is fetched with 200 during preload, the tie
  demo shows the replay button). Edits were made with whole-line Python
  scripts (`edit_endings.py`, `edit_tie.py`, `remove_loss.py`) per the
  line-ending trap: `sound.js`, `candy-go-fish.js` and the stylesheet
  are CRLF, `candy-rain.js` and the Codex docs are LF.

**Candy cannon and the sound diagnostic, 2026-10-15 late evening.**

- **Cannon.** `js/candy-rain.js` has a `CANNON` table beside the `RAIN`
  moods: `perVolley [5,8]`, `volleyMs [450,750]`, `maxOnScreen 60`,
  `brandChance .75`, `spread .25` (launch zone as a share of the width,
  centred), `angle 30` (degrees either side of straight up), `rise [.25,.6]`
  (climb above the muzzle as a share of the height), `gravity 1.8` (screen
  heights per second squared), `turns [90,540]`, `samples 40`. `fire()`
  does schoolbook projectile motion: vy from the rise (vy² = 2gh), vx =
  vy·tan(aim), flight time to two candy sizes below the bottom edge in
  closed form, then 40 keyframes of `translate(x(t), y(t)) rotate(...)`
  played with linear easing by `element.animate`, the same machinery and
  the same `animations` set as the rain, so `drain()` and `stop()` need no
  change. `start(waitMs, 'cannon', behindElement)` takes the game-over
  panel; the muzzle is its top edge (bottom of the screen if absent).
  Volleys are a `setTimeout` chain with jitter (`volley` timer), cleared
  by stop/drain. Reduced motion: two candies every 1.5 s, no tumble.
  `makeCandy()` is shared by rain and cannon. The layer stays at z-index 2
  on `body` and the panel at z-index 3 in the root stacking context, so the
  candies draw behind the panel and over the table.
- **Audio wake-up.** `CandySound.unlock()` = `prepareContext()` (create +
  resume) and is called first thing in the dialogs' confirm handler.
- **`?debug=sound` (REMOVED 2026-10-16 evening, once the fix was heard on
  the phone).** It was a block at the bottom of `js/candy-go-fish.js`
  building a fixed panel (`#soundDebug`) refreshed twice a second with
  the AudioContext state, both channels, preload state and failures, the
  device string and a short log, plus four buttons: Wake engine, Engine
  beep (an oscillator straight into the destination), UI clip, Plain clip
  (a `new Audio` NOT routed through the context). The two diagnostics it
  used in `sound.js` (`engineState`, `testTone`) went with it. To get it
  back: commit 729d132 has the panel, 300675c the last version with the
  media-element clips. `CandySound.decodedSounds` and `CandyPreload.failures`
  remain and are what a console check would use.
- **Finding and plan.** See `claudePlans/iphone-speech-buffers-plan.md`.
  Short form: iOS lets an `HTMLMediaElement` start only inside a user tap
  or shortly after; every clip here is its own element routed through the
  AudioContext by `createMediaElementSource`; the ticks (AudioBuffer
  sources) are exempt. Proposed: decode the 48 UI clips at startup and the
  chosen victory clip on demand into AudioBuffers and play them like the
  ticks; music unchanged. Checks to rewrite: `verify-sound-layout`,
  `verify-victory-sounds`.
- **Session scripts (scratchpad):** `cannon_check.cjs` (brand mix, pause,
  stacking, clickability, drain, two screenshots), `debug_panel_check.cjs`,
  `endings_shot.cjs` (now expects `cannon` for the loss demos).

**What today's phone tests add, 2026-10-16 morning (read of `sound.js`,
`preload.js`, `candy-go-fish.js`; no code changed).**

- **Where the music is asked to play.** `CandySound.startWelcomeMusic()`
  is called from: the welcome `pointerdown` on the overlay (artwork);
  `CandyPreload.whenReady().then(...)` (no user gesture, iOS always
  rejects this one, and it may leave the element registered-but-paused in
  Now Playing); the Rules button; the New game button (Deal again?);
  `applyMusicSettings` when MUSIC is switched on. Nothing during play
  calls it. `fadeOutWelcomeMusic()` returns at once in continuous mode.
- **How a clip plays today.** `play(sound)` -> `prepareContext()`,
  `getClip()` (one `<audio>` per sound through `createMediaElementSource`
  into the channel gain), `rewind`, `clip.play()`; the promise rejection
  is swallowed. So a refused `play()` on the phone is silent in both
  senses. Ticks bypass all this (AudioBufferSourceNode from
  `prepareTickBuffer()`), which is why they are the one reliable sound.
- **Readiness.** `preload.js` `loadAudio` resolves on `canplaythrough`
  or a 6 s / 20 s timer and only records a failure when `readyState < 4`.
  iPhone Safari reports `canplaythrough` before the bytes are resident,
  so the panel's "0 failures" and a fast "Loading assets" do not mean
  the music is downloaded. On cellular the Wonderful tune (5.4 MB) was
  very likely not there when the artwork tap asked for it.
- **Option C, as it will be built** (see the plan file and the 10-16
  ToBeContinued for the step list): UI clips fetched with `fetch` and
  `decodeAudioData` into a Map of AudioBuffers at startup; `play()`
  returns `{ clip }` shaped like today's so `scheduleVictory` keeps
  working; victory speech decoded on demand and cached; music elements
  kept, started only inside taps, retried on every tap while wanted and
  paused; welcome gets a `click` listener next to `pointerdown`. Checks
  to rewrite: `verify-sound-layout.cjs`, `verify-victory-sounds.cjs`.
- **Fallback.** Git tag `before-iphone-speech-buffers` = 300675c, on
  GitHub (the repo's first tag). Restoring only the game:
  `git checkout before-iphone-speech-buffers -- games/candy-go-fish`.

**Option C as built, 2026-10-16 (Claude; stamp `2026-1016-sound-buffers`).**

- **`sound.js`, two kinds of sound.** UI clips and speech are decoded
  buffers; the three soundtracks stay media elements. `decode(sound)`
  fetches the MP3, decodes it (callback form of `decodeAudioData`, which
  older iOS also has; the context may stay suspended) and caches the
  AudioBuffer in `buffers`; an in-flight promise sits in `decodes`; a
  failure is forgotten so the next call retries. `playBuffer` makes an
  `AudioBufferSourceNode` with a per-play gain into the UI channel and
  returns a voice `{ sound, duration, gain, onended, source, stopped }`;
  `voices` holds the live ones; `stopVoice` marks `stopped` first so a
  stop never counts as an end (the game-over music must not be re-armed
  by a cancelled speech). `play(sound)` returns the voice, or undefined
  when the buffer is not there yet (and starts its decode). `stopAll('ui')`
  stops ticks and voices; `stopAll('music')` pauses a playing tune.
- **Startup vs on demand.** `prepareAssets()` decodes the twelve
  non-victory sounds and returns `[{ url, ready }]`; `preload.js`
  `loadBuffer` waits on `ready` with the six-second bound and records a
  failure (the decode keeps going past the bound). `prepareSpeech(sound)`
  decodes one victory speech; `scheduleVictory` calls it immediately, and
  the 2 s timer then waits on that promise, checks `victoryToken` (bumped
  by `cancelVictory`) and plays; `replayVictory` reuses the cached buffer.
  Memory: twelve short clips, under 10 MB of PCM; one victory speech more.
- **Music rules.** `startWelcomeMusic()` is no longer called from
  `whenReady().then(...)`. `retryMusic()` restarts the current tune when
  `welcomeMusicWanted` is true, the channel is on and `clip.paused`;
  `userTapped()` = `unlock()` + `retryMusic()`. `candy-go-fish.js` calls
  it from a `click` listener on `document` (bubbling, so it runs after the
  tapped element's own handler: closing a dialog in Paused mode sets
  wanted=false first, and the retry does nothing). The welcome artwork has
  a `click` listener beside `pointerdown` that calls `unlock()` and
  `startWelcomeMusic()`.
- **file://.** Chrome refuses `fetch()` over file://, so a page opened
  from disk records twelve preload failures and has no UI sounds or
  speech; music still plays. HTTP (the server, Pages) is the real case.
- **Checks.** `serve-game.cjs` (new) is a 30-line `node:http` static
  server on an ephemeral port; `verify-sound-layout` uses it, counts
  `AudioBufferSourceNode.start` calls under reduced motion (no ticks, so
  every start is a voice) and sees the goes-first speech start from the
  spinner's timer. `verify-victory-sounds` runs its assertions inside an
  async function with a `setImmediate` settle after each fired timer.
  `verify-welcome-music` taps the title in all three modes. All twelve
  non-stale checks pass; the four stale ones (item 10) were not run.
- **Fast start (same afternoon; stamp `2026-1016-fast-start`).**
  `preload.js` keeps two promises: `ready` (images + the twelve decodes;
  enables Let's play) and `musicReady` (`whenMusicReady()`, the chosen
  tune's `loadAudio` with the 20 s bound, failures still pushed).
  `prepareWelcomeMusic()` returns `[musicEntry(currentTrack).clip]` only;
  `CandyPreload.start(config)` moved from line 10 of `candy-go-fish.js`
  to just after `restoreSoundSettings()` so `currentTrack` is the saved
  one when the element is created (no top-level `await` sits between the
  two places, so nothing else changes). `selectTrack` now calls
  `musicEntry(track)` when the context exists, which creates the element
  with `preload = 'auto'` and so starts the download at the popup tap.
  Throwaway check: with the MP3 route delayed 4 s the button was enabled
  in 271 ms; only Earth was created with Earth saved; the arrow created
  Haunted. The cold blank popup before the welcome (scripts, CSS, fonts,
  `welcome-vines.svg` from a cold Pages edge) is not addressed.
- **Cold-start measurement and the portraits (same afternoon; stamp
  `2026-1016-small-portraits`).** A throwaway Playwright script
  (`Network.clearBrowserCache` + `Network.emulateNetworkConditions` over
  CDP, mobile viewport, live site) measured time to the welcome, to
  Let's play enabled and to `whenMusicReady()`, game alone and in the
  shell. Before: 12.2 MB in 60 files; welcome 0.4 to 1.6 s; Let's play
  0.8 s on wifi, 6.4 s on 10 Mbps "good 4G" (five portraits past the 6 s
  `loadImage` bound), 7.5 s on 1.6 Mbps "slow 4G" (27 bounds passed,
  music ready at 21.5 s). The six portraits were 8.8 MB (1024 px PNG,
  RGBA for the three opponents). Drawn size: `.portrait` is 22.5vw of
  the iframe, and the frame is `min(100vw - 8px, 90dvh * 0.5625)` wide,
  so device pixels = 0.9 x screen rows x 0.5625 x 0.225: 246 on any 4K
  monitor regardless of Windows scaling, 311 on an iPad 12.9 in portrait
  (the maximum), 258 on a 3x iPhone. Converted with Pillow
  (`thumbnail((512, 512), LANCZOS)`, `save(..., "WEBP", quality=85,
  method=6)`): 19 to 46 kB each, 183 kB in all. Same base names with
  `.webp`; `game-config.json` portrait paths, `config-data.js` (via
  `sync-config.cjs`), the two default `<img src>` in `index.html`, the
  two switch checks and `serve-game.cjs`'s MIME map changed. Originals:
  `_documents/design ideas/character portraits/` with
  `_why these were converted.txt`. After, same script, live site: 3.5 MB
  in 60 files; Let's play 1.0 s on wifi, 3.3 s on good 4G (0 failures,
  music ready at 4.1 s), still 7.6 s on slow 4G (19 bounds passed; the
  5.4 MB tune competes with the images for 1.6 Mbps, music ready at
  21.6 s). The shell adds 0.3 to 1.3 s. Next lever if slow 4G matters:
  start the tune's download only after `ready` settles, so the images
  and sounds have the line to themselves. Candies left alone (500 px,
  drawn up to ~720 device px on the celebration dialog, so no resize;
  WebP-only is a possible later 1.3 MB saving).
- **Line endings, a trap.** This Git Bash's `sed -i` strips CR from CRLF
  files. Git (`core.autocrlf=true`) stores LF either way, so the commits
  were unaffected, but the working files were converted back by hand.
  Per-file endings differ (`sound.js`, `candy-go-fish.js`, both
  `index.html` and `app.js` are CRLF; `preload.js`, the checks and the
  docs are LF); edit scripts must detect the file's own ending.
- **`render(players)` (midday, item 13).** `render` in `candy-go-fish.js`
  takes an optional list of players whose dishes and counts to redraw
  (default both; the buttons, centre dish and piles always redraw). The
  gift flight in `resolveRequest` calls `render(['human'])` when the
  opponent is taking and `piles.render(state)` when the human is
  receiving; the full `render()` after the flight shows the set. Verified
  with a throwaway script asserting the opponent slot has no `complete`
  class and the counts are unchanged while `.flying-candy` exists.
- **`requestHoldMs` is live again.** `presentSpeech` computed
  `effectiveHold = requestType ? quoteHoldMs : min(holdMs, quoteHoldMs)`,
  so every request bubble was held 1 s whatever the caller passed. Now
  `min(holdMs, quoteHoldMs)` for all. `game-config.json` `requestHoldMs`
  900 -> 400 (`sync-config.cjs` run). `waitActive` with `quoteWait` still
  caps at `quoteHoldMs`. Measured with a MutationObserver on the
  `.stationary-speech` clones: question fade-in to reply fade-in 693 ms.
- **Startup flash: how it was recorded and what it was.** Throwaway
  Playwright script: CDP `Network.clearBrowserCache`,
  `Network.emulateNetworkConditions` (150 ms, 10 Mbps),
  `Page.startScreencast` (png, every frame) on the shell page, click the
  game button, and every 15 ms sample the iframe's `readyState`,
  `#overlay.className`, `#dialogAction.textContent` and
  `styleSheets.length`. Timeline on 4G: overlay in the DOM at 0.2 s with
  class `overlay` and "Let's play"; stylesheet at 0.5 s (first paint of
  the plain dialog); page complete at 1.3 s; `welcoming` added at 1.5 s,
  after the script's awaited config fetch. Fix in `index.html`:
  `<div id="overlay" class="overlay welcoming">` and
  `<button id="dialogAction" class="primary" disabled>Loading assets`.
  `startGame()` removes the class and the welcome block re-adds it, so the
  script path is unchanged; `whenReady` enables the button. After: the
  first painted iframe frame is the welcome. The `.welcome-subtitle`
  line break depends on `.welcoming`, which is why the plain frame showed
  "GO FISH!Candy Edition!" as one line.
- **Welcome scroll box (afternoon).** `index.html`: `<div
  class="dialog-scroll-wrap"><div id="dialogScroll" class="dialog-scroll">`
  wraps `#dialogTitle` and `#dialogBody`; after the inner div come
  `#scrollUp` and `#scrollDown` (buttons with an inline SVG chevron,
  `hidden` by default). CSS: both wrappers and the arrows are `display:
  contents` / `display: none` by default, so every other dialog (Rules,
  whose `#dialogBody` must stay a flex child of `.dialog` to scroll) is
  laid out as before; under `.welcoming` the wrap is a positioned block
  (`margin-top: 0.6vw`, below the SOUND label, where an earlier -4vw let
  the up-fade cover the label), the box is `height: 54vw; overflow-y:
  auto; overflow-x: hidden; touch-action: pan-y; scrollbar-width: none`
  plus the WebKit scrollbar rule, and the arrows are absolute 7vw strips
  on cream gradients at the top and bottom edges. `touch-action: pan-y`
  on the scroller is what lets a finger drag it although `body` is
  `touch-action: none` (the gesture stops at the scrolling element).
  Script (after the welcome block): `updateScrollArrows()` hides the up
  arrow when `scrollTop <= 1` and the down arrow when less than a pixel is
  left below; bound to the box's `scroll`, `resize`, `document.fonts.ready`
  and once at startup; the arrows call `scrollBy` by 70% of the box with
  smooth behaviour. The welcome's h1 margin is `0 0 2.2vw` (inside the
  box; a negative margin would clip). Fit measured in the shell (dialog
  bottom vs iframe height): 390x844 542/594, 375x667 480/525, 360x780
  500/548, 1024x1366 982/1076. Text: `.welcome-credits` 2.6vw grey.
- **Volume constants (`sound.js`).** `uiVolume` 0.25, `speechVolume`
  0.375, `musicVolume` 0.5 (the tune's fade-in target, formerly the shared
  `defaultVolume`), `soundVolumes` overrides (`spinnerTick: uiVolume`, the
  three `switch-to-*` keys at `uiVolume * 0.75`), and `gainFor(sound)`:
  override, else speech level for keys starting `goes-first:` or
  `victory:`, else `uiVolume`. Music channel `scale` 1 (was 1 / 0.75);
  effective music gain = slider/100 x scale x musicVolume. The slider's
  stops are unchanged. `verify-sound-layout` asserts 0.25 / 0.375 / 0.1875
  by key prefix.
- **Image reuse (the phone flicker).** `candy-piles.js`: `elements` map
  (card id -> `<img>`), `style(img, candy)` applies size, place, rotation,
  filter and the `moving` visibility, `node(candy)` makes a fresh styled
  image (the flight's flier), `element(candy)` returns the kept one;
  `render` keeps each host's `.candy-pile-layer`, removes children not in
  the new list and appends the list (append moves existing nodes, so a
  card going dish -> tray keeps its element); `reset()` clears the map.
  `candy-go-fish.js` `render`: the centre plate `<img>` and `.pile-number`
  are created once if missing and only the number's text is updated (the
  old code rebuilt them, and so the pile layer, on every non-opening
  redraw); each slot stores `dataset.drawn = quantity|complete` (or
  `hidden`) and only rebuilds its children when that changes, while the
  classes (complete, selected, available, empty, unknown) are still set
  every time; `candyImage` sets `decoding = 'sync'`. Measured with a
  throwaway script patching `document.createElement`: three selection
  redraws create three images, all the speech bubble's candy
  (`fillRequestBubble` still rebuilds the bubble each render); the 39
  images in the slots, centre and tray are the same elements before and
  after.
- **Soundtracks (14:00).** The game copies are
  `assets/sounds/soundtracks/soundtrack-music-{earth,haunted,wonderful}.mp3`,
  made with ffmpeg 8.1.1: `ffmpeg -i <original> -vn -c:a libmp3lame -b:a
  96k -ar 44100 <copy>` (`-vn` drops the embedded art). 2.9 + 1.3 + 3.2 MB.
  `sound.js` `musicEntry` builds the path as `'./assets/sounds/soundtracks/'
  + track.file`; the `musicTracks` list still holds bare file names.
  `verify-assets.cjs` references the three new paths (its `sounds/` prefix
  rule still covers the subfolder); `verify-welcome-music.cjs` matches
  tunes by file-name ending and needed no change. Originals (with git
  history, moved by `git mv`) in `_documents/design ideas/soundtrack
  originals/` beside `README - what was done to the game versions.txt`.
- **Sound popup markup.** `#musicVolume` lost its `list` attribute and the
  `<datalist id="musicVolumeStops">`; `step="20"` alone gives the snapping,
  `.volume-ticks` is still the row of numbers. `#modeContinuous` and
  `#modePaused` each hold `<span class="mode-when">` (lowercase lead-in)
  and `<span class="mode-word">`; CSS `.mode-switch button { min-height:
  9.5vw; gap: 0; line-height: 1.1 }` and `.mode-switch .mode-when {
  font-size: max(8px,1.9vw); font-weight: normal }`. Nothing in the
  scripts reads those labels (only `aria-pressed`). Measured at 390 px: the
  lead-in sits at its 8 px floor, the word at 12 px, both centred on the
  same x.
- **Note on line endings (this afternoon's surprise).** `grep -c $'\r'`
  found no CR in `index.html` or `candy-go-fish.css` in the working tree,
  although the 13:28 notes call them CRLF; Git's autocrlf warnings show
  on other files. The Python edit scripts detect the file's own ending, so
  it does not matter which; keep using them rather than `sed -i`.


**2026-10-16 later afternoon (stamp `2026-1016-one-control`).**

- **`finishGame()`** (`js/candy-go-fish.js`): `Halloween.reportScore(sets,
  'h–w', [humanName + ' vs ' + opponentName])`; both names are `let`s of
  the same start-up function. Was `['vs. ' + opponentName, copies + ' set
  game']`.
- **Welcome subtitle**: the baked `<span class="welcome-subtitle">` in
  `index.html` and the rebuilt one in the script (`welcomeSubtitle.textContent`)
  both say `Candy Edition`. The page `<title>` is unchanged.
- **9:15 panel**: `#table { height:100%; grid-template-rows: 13vw 53vw
  36vw 52vw; align-content:center }` needs nothing; on a 382-wide phone
  the panel is 637 px tall against the grid's 588 px. Popups cap at 94vh
  and just get room. `verify-shell.cjs` still asserts the three regions
  in order and `human.bottom <= innerHeight`; it passed.
- **Stamps**: the 19 `?v=` in `index.html` and the config fetch now say
  `2026-1016-one-control`; the shell's APP_VERSION matches.

