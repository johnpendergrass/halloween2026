# Candy Go Fish — Specifications (design decisions)

Last updated: 2026-10-18 13:40 (the music default is OFF and Always, see the section at the end; before that 2026-10-16 15:34: name in the shell, score note, welcome subtitle; the shell around the game has one control point and a 9:15 panel, see the root claude-john-docs). Before: 14:15 RELEASABLE, consolidated here from section 6k of the root spec; sub-headings keep their 6k numbering.

## 6k. Candy Go Fish (slot 8; John + Codex, 2026-10-07 to 10-14; Claude from 10-14)

The first real game in the app, built by John with the Codex assistant
while Claude was not involved. **Codex's documents are the authoritative
record of the game**, not this file:

- `games/candy-go-fish/_documents/_START-HERE.md` (reading guide)
- `.../codex-john-docs/CURRENT-STATE-2026-1014.md` (behaviour, accepted
  decisions), `NEXT-TODOS.md`, `RULES-AND-GAMEPLAY.md`,
  `UI-AND-PRESENTATION.md`, `ARCHITECTURE-AND-DATA.md`
- `.../strategies-development/_START-HERE.md` (the three opponents, with
  40,000-game validation results)
- root `codex-john-docs/Codex-ToBe-Continued-<date>.md` (project level)

**What it is.** Go Fish with ten candy types, three copies each, five
dealt per player. Ask for a candy you hold; a match gives you one card and
another turn; Go Fish always ends the turn, even on a lucky draw. Triples
collect themselves. The round ends when the dish or either hand is empty
or all ten sets are taken; most sets wins, ties possible. Score reported
to the shell is the human's set count (text "3–2").

**Decisions John made with Codex that Claude must respect:**
- No Pause button; the game's own dialogs pause it, the shell drawer does
  not. No timed penalties.
- Three opponents are three real algorithms, not a difficulty number:
  Ron + (weighted random with simple memory), Harry ++ (probability over
  public clues), Hermione +++ (1,024-particle belief tracking). They are
  calibrated and accepted; **do not retune without a request**.
  Opponents never see hidden cards or the dish order. Switching opponent
  or player character mid-round keeps the hand, score and memory.
- Sound is the game's own job (the shell switch never reached a game).
  The dialogs carry UI and MUSIC speaker toggles; per-sound gain 50%.
  Music loops on the welcome, "Deal again?" and Rules dialogs, fades in
  over 3 s and out over 2 s, and resumes where it paused.
- Rejected and removed, do not restore: opponent-only candy spill,
  synthesized trumpet fanfare, opening/deal click sounds, various
  startup-flash fixes. The startup flash itself is deferred by John.
- Original full-screen candy rain is the only game-over celebration.
  Victory speech (36 clips: winner x loser x BIGWIN/CLOSE) starts 2 s
  after the banner; BIGWIN is a margin of 3 or more.

**2026-10-14 (Claude):** soundtrack file renamed to
`soundtrack-music-wonderful.mp3`. A plan to move the game into its own
repo was written (`claudePlans/candy-go-fish-standalone-plan.md`).

**2026-10-15 (John + Claude): the standalone move is DEFERRED.** John
wants to keep working inside halloween2026 with the game in slot 8; the
plan stays on file for later.

**2026-10-15: the Music popup.** John's design, built by Claude:
- All three tunes are wired up and named after their files: Earth,
  Haunted, Wonderful (default Wonderful). All three preload on the
  welcome screen; John chose to see the startup cost before loading lazily.
- The MUSIC speaker on the welcome, Deal again? and Rules dialogs keeps
  its icon and label and shows the state (slash = off) but no longer
  toggles: it opens a popup. The popup is a separate panel sized like the
  tallest dialog (Rules, 94vh) so it fully covers whatever is underneath.
  Cancel bottom left (restores what was in force when it opened), Done
  bottom right (keeps and saves). Changes are heard as they are made.
- Rows: Music ON/OFF (OFF by default since 2026-10-18); Soundtrack chosen
  with left/right arrows around the name, like the character selectors;
  Play mode, a two-way switch between "When paused" (music only while a
  dialog is open, the original behaviour and the default until
  2026-10-18) and "Continuous" / "Always" (keeps playing through the game,
  no ducking under speeches for now; the default since 2026-10-18);
  Volume, a slider feel with fixed stops 0, 20, 40, 60, 80, 100.
- Loudness: the level the game shipped with sits at 75 on that scale, so
  100 is a third louder; the default stop is 80.
- Each tune remembers its position for the page session; switching fades
  the old one out over 1 s. A reload starts them all from zero.
- Settings are remembered between visits (tune, volume, on/off, play
  mode, UI toggle). To allow this, **rule 21 of the game requirements was
  relaxed**: a game may keep its own notes in localStorage under a key
  starting `halloween2026:<folder>:`; the bare `halloween2026:<folder>`
  note stays the shell's. The helper comment and app.js note say the same.

**2026-10-15 afternoon (John + Claude).** John wrote a todo list of eleven
items (recorded in the game's `NEXT-TODOS.md`); items 1, 7 and the welcome
half of 11 were built the same day:
- **Candies per set (item 11, welcome half).** A two-way slider switch on
  the welcome, just above Let's play: "Three candies per set" with three
  red generic bars, "Four candies per set" with four blue bars, bars
  angled 30 degrees and tucked together so the switch stays 60vw wide
  with room around it. Two visual clues to the choice, by John's design:
  a cream thumb slides under the chosen side and a green check sits on
  that side's top-right corner. Four-candy sets deal one more card to
  each player (six). The choice is remembered. Both sizes were audited
  and tested first; nothing in the engine, strategies or screen hard-codes
  three. Still to do: the same switch on Deal again?.
- **The same slider style** replaced the checkbox on the Music popup's
  Play switch, so both switches read the same way.
- **Remembered characters (item 1).** The last opponent and player
  character survive a reload or app restart, restored silently before the
  welcome. New Game already kept them within a session.
- **Speaker buttons.** John supplied a speaker photo. The UI and MUSIC
  buttons show it with a bold label centred below in the page font and the
  dark green of the welcome subtitle; a red slash crosses the speaker
  when off. Two rejected variants: the label in white inside the cone
  (unreadable with the slash) and dark green inside the cone.
- **Welcome layout.** Taller box: speakers lower, clear of the vines;
  switch below the text; breathing room under Let's play.
- **Candy leaving the dish (item 7).** A candy the player gives now leaves
  the dish the moment it starts flying, not when the next message shows.
- **Internal role key.** The engine still calls whichever opponent is
  showing `wendy`; John knows, and a rename is a separate question.

**2026-10-15 later afternoon (John + Claude).** Items 4, 9 and the rest
of 11 from John's list, plus a run of visual decisions:
- **Every dialog wears the welcome frame.** Deal again? and Rules got the
  vine-and-plate frame (John: "the same style treatment"). Deal again?
  kept its text and button placement ("the overall text and button
  placement is fine") but grew taller so the speaker clears the vine and
  there is room under Keep playing. Rules shrank its type a little and
  gained side padding so the shaded boxes and the button stay off the
  vines; its speaker and title moved down 2vw and the gap under the title
  shrank by the same amount. John dropped "Tap the Candy Dish to draw one
  candy" from the rules text.
- **One SOUND button, one Sound popup.** John: "I am concerned about
  having various settings spread out all over." The UI speaker left the
  three dialogs; a single speaker labelled SOUND at the top right opens
  the popup, now called Sound, which holds UI sounds, music on/off, the
  soundtrack, when to play and volume. Its layout follows John's sketch
  (`games/candy-go-fish/design ideas/Sound requester layout.png`): title
  SOUNDS; UI and MUSIC speakers side by side; a MUSIC SOUNDTRACK section
  with each control below and to the right of its label; the volume
  slider with tick numbers 0 to 100 instead of a live percentage; boxed
  CANCEL and filled CONFIRM. The speaker toggles have no ON/OFF label: a
  steady green glow means on (John asked for a pulse, then preferred a
  still glow), the red slash means off. "Always" sits left, "Paused"
  right. Controls were then made shorter and narrower, the fields spaced
  out, the labels indented, and the popup sized to its content so it
  never scrolls on a phone (the first framed version pushed the buttons
  off John's screen; now only the rows scroll, on screens shorter than
  the content).
- **Candy-bar top buttons.** NEW GAME and RULES stopped being ceramic
  pumpkins: they are the generic candy bar, tinted the light teal green
  of the top of the table gradient, with the words printed on the
  wrapper. John relabelled the right one "?? / SOUND", since Rules is
  where the SOUND speaker lives. The pumpkins moved to the unused folder.
- **"(you)".** The player's label under their portrait reads, for
  example, "MIKE (you)", and the game-over title says "Mike (you) wins!"
  when the player wins. Nowhere else: not the score line, the speech or
  the bubbles. (John first wrote "Ron (you)", then: "I meant Mike (you)
  cause Ron is never you.")
- **Game-over soundtrack (item 4).** After the victory speech, about a
  second of silence, then, only when music is on and in Paused mode, the
  soundtrack ramps up and plays until the player taps New game. John's
  framing: "add the victory screen, after the spoken words, as play when
  paused event." Always mode needs nothing because the music is already
  playing. With no speech the music comes in after three seconds.
- **Settings inventory**, at John's request: UI sounds, music on/off,
  soundtrack, when to play, volume (all in the Sound popup, reachable from
  the welcome, Deal again? and Rules), candies per set (welcome and Deal
  again?), and the opponent/player arrows on the table. Nothing else is a
  setting. John: "we will revisit that issue later."

**2026-10-15 evening (John + Claude).** The iPhone review, the shell, and
the Sound popup's second sketch:
- **The UI toggle on the iPhone.** John: the UI speaker "usually does not
  switch modes when I click it", then more precisely: ON to OFF "takes
  several seconds to display the OFF (slash) icon", OFF to ON is
  immediate. Two fixes. First, a rewind guard: iOS throws when a clip
  that has not loaded is rewound, and the error aborted the redraw.
  Second, and the real one, John's own suggestion: "make the button
  essentially a toggle switch, with no responsibility for starting or
  stopping sounds, rewinding them, etc." The OFF tap used to pause and
  rewind all 48 UI clips and 36 victory clips, seconds of work on a
  phone. Now it flips the flag (the channel's volume node goes to zero,
  which is what silences things), cancels a pending speech, and pauses
  only a clip that is actually playing; each sound rewinds itself when it
  is played. John asked why not let sounds run to their end: it would
  have worked too, at the price of a paused victory speech coming back
  mid-sentence.
- **Set-size reminders on the table.** "3 candies per set" in light text
  under the ?? / SOUND bar and again above the player's dish, each centred
  in its gap; they follow the switch.
- **The shell.** John: "delete the SOUND option in the halloween2026 shell,
  as it is now in the game." Done; a game with no switches gets the full
  width for its scores. The score list shows `<score> <date> <player> vs
  <opponent>` (John, 2026-10-16: "Sully vs Hermione"; before that `vs.
  <opponent> <#> set game`, the set-size note dropped as not needed);
  ten lines were tried ("too long a display") and it went
  back to five. The text is John's own, from `design ideas/Text for THIS
  GAME.txt`, laid out like the Rules box: centred, GO FISH in the welcome's
  gold with the dark outline (title and text), "candy rainfall" with a
  colour per letter, line breaks where he asked, no byline, credits
  "v 0.19.2 10/2026 jp/claude/chatty". A cream sheet was tried for the tab
  and rejected: it flashed while the panel slid shut (the tab used to
  switch before the slide; now it switches after). Title "GO FISH - Candy
  Edition", top bar "GO FISH".
- **The icon.** John: the candy plate with candies piled on it. Built by a
  script from the ghost plate and the real candy images: Snickers, Dots
  and Red Vines, large, spilling a little over the rim, the ghost's face
  and hands clear. In the This Game tab it stands alone, no orange frame,
  30% larger. Saved in the game's candy-dish folder; the fish SVG retired.
- **The Sound popup, second sketch** (`design ideas/Sound requester layout
  2nd version.png`): SOUNDS; the UI speaker centred; a rule; the MUSIC
  speaker centred; the three controls centred below with no labels. Both
  speakers on the dialog's centre line, labels right-justified to one
  edge; more air around the rule and under MUSIC; the controls shorter and
  narrower. The confirm button is **OK** (John asked what is most common;
  OK with Cancel is, and the house rule is now: settings dialogs Cancel /
  OK, consequential choices named by their action, information dialogs
  one button saying where you go). OK, Let's play, Start a new round, Back
  to the table and the celebration button all take the brighter green of
  the check marks; Keep playing and CANCEL are outlined in the dark green.

**Later in the evening of 2026-10-15 (Claude, at John's direction): the
endings.**

- **The loss ending, first try, removed.** John: "i want to rethink the
  celebration screen when the player does not win. i would rather not add
  any significant assets, but it should be a very muted celebration,
  rather than the candy rainfall when the player wins." Claude proposed,
  from the existing assets, a candy trickle (a handful of dim grey
  wrappers, slow, hardly turning, no brand candies because those went to
  the opponent), the player's portrait fading to grey, the winner's
  portrait swaying, a green-grey game-over box, and no change to the
  music; John: "i would keep the music cues as is... still regular volume
  at the same timing." It was built and shown, then John changed course:
  "lets try something different. more work, but maybe more reward. i still
  want a celebration, even if it is for the other player. so i will
  describe it more fully next." The loss pieces were removed the same
  evening; the opponent's win gets the full rain again until the new
  celebration is designed. The rain module kept its mood table.
- **The tie has a voice.** John recorded `tie - no one saw that coming`
  and put it in `assets/sounds/speech/tie/`. It plays exactly where a
  victory speech would (two seconds after game over, replay button shown,
  music a second after it ends in Paused mode). John, when the removal
  of the loss ending was announced: "no, keep the tie voiceover!!!" It
  stayed, with the tie's half-strength rain.
- **Seeing an ending without playing a game.** John asked whether the
  endings could be shown "without me having to play entire games and
  trying to win/lose/tie". The game page takes `?demo=win`, `bigwin`,
  `loss`, `bigloss` or `tie`; Let's play then jumps to that game over
  with a real deal rearranged into completed sets. The tap on Let's play
  is the sound unlock, so speech and music play as in a real game. "big"
  means a margin of three, which picks the BIGWIN speech. New game deals
  a normal round. It is a developer aid, left in because it costs nothing
  and John will want it again for the new loss celebration.
- **Noticed by John, for the list (item 13):** when the opponent takes a
  candy from the player that completes a set, the opponent's dish shows
  the check-marked set while the candy is still flying over; it should
  appear only when the candy has arrived.
- **Checkpoint.** John: "do another /update the commit should be tagged
  'Workign fine. Just before adding new loss celebration'". Stamp
  `2026-1015-tie-voice-demo`.

**Late evening of 2026-10-15, continued: the candy cannon and the iPhone.**

- **The candy cannon (John's design, now the loss celebration).** "imagine a
  cannon that is hidden behind the game over requester panel. it fires
  candies up and out from behind that panel. the candies are aimed randomly
  from maybe -30 degree to +30 degrees from vertical. each candy follows an
  arch that is affected by gravity, some of them going off screen to the
  sides... like a cannonball would go. each candy is a random branded candy
  (75% of them) or a generic candy (25%). Same size options as the victory
  candy rain. the candies then fall down behind the game over panel to the
  bottom and are gone... When the user clicks the continue button we wait
  for all candies to clear and then continue... The density and frequency
  of the cannons should be an easy thing for you to adjust, as well as the
  random velocities and the effect of gravity. i am aiming for a density of
  maybe 50% of the candy rain." Claude's questions and John's answers:
  launch point centred with about a quarter of the screen width of spread;
  volleys rather than a fountain; peaks on screen with a few overshooting
  the top; tumbling; the same three-second pause and run-until-New-game as
  the rain; loss only; falling back behind the panel. Since the rain layer
  already sat behind the game-over panel (z-index 2 under 3) and in front
  of everything else, "the candy display would mirror what happened with
  the candy rain" came for free. John: "that works really well. very good
  job!" Committed and pushed at his request as the official loss ending.
- **The iPhone silence.** John: "something has stopped the phone from
  playing sound... no music. no ui." The ring/silent switch was normal.
  Claude built a `?debug=sound` panel (engine state, switches, preload,
  four test buttons) and John ran it on the phone: engine running, every
  switch on, preload clean, the engine's own beep and a UI clip both heard.
  Two live rounds then showed the pattern: sounds started inside a tap
  play (artwork tap music, spinner ticks, UI clips); sounds that start on
  their own later (the "goes first" voice, the victory speech, hence the
  demo endings) do not, except once when the gap after the tap was short.
  Conclusion: an iPhone rule, each clip a separate media element that may
  only start inside or shortly after a tap; not the cannon, not the demo.
  John asked whether to revert to the version before the loss work; Claude
  advised that it would most likely stay silent and offered a ten-minute
  experiment (the old version in a side folder on the live site), a
  revert, or the real fix (speech and UI clips played from decoded
  buffers, as the ticks already are). Plan on file:
  `claudePlans/iphone-speech-buffers-plan.md`. John: "we will restart
  tomorrow." Two lessons recorded there: the phone only runs the live
  site, so a push must precede any phone test; and the voices after a real
  game were probably never audible on the phone, the demo was just the
  first time anyone listened for a timer-started sound.

**2026-10-16 morning (John's phone tests, no code; Claude): the sound
problem is wider, and the fix is chosen.**

- **John's tests on the live site, inside the shell** (UI on, music on,
  Always, volume 80): nothing on the welcome; Let's play silent (by
  design); the spinner ticks heard; no "goes first" voice; the character
  arrows silent; ?? / SOUND and the popup, no change, still silent. On
  wifi one whole run was silent except the ticks until he went back to
  the shell's picker, reopened the game and tapped the artwork, when the
  music started. The iPhone's notch (Dynamic Island) showed the game's
  soundtrack as a "Now Playing" track, sometimes paused, sometimes
  playing, with the page title scrolling and the system pause button.
- **What that means** (Claude): the notch control is iOS treating a long
  media element as a song; "paused" there means the tap's play request
  was accepted but the file was not ready and the request stalled past
  the short window iOS allows after a tap. Put with yesterday: the engine
  is fine (ticks always play); **every media element is unreliable on the
  phone, tap-started or timer-started** (arrows, voices, speech, sometimes
  music); readiness ("Loading assets" clearing) is only a hint on the
  phone. John asked whether the welcome is the only place sound can be
  switched on: for the music, effectively yes; it is asked to start in
  five places (artwork tap, loading-finished with no tap, Rules open,
  Deal again? open, MUSIC on in the popup) and never during play.
- **Decoded buffers explained** to John: the same MP3s, fetched as now,
  decoded in the browser into raw samples at startup (milliseconds a
  clip), about 30 MB of memory, the 37 victory speeches decoded only when
  needed, the three soundtracks untouched. John: "go ahead with option C,
  but first lets make absolutely sure that we have a fallback."
- **Decided.** Option C from `claudePlans/iphone-speech-buffers-plan.md`,
  plus two music rules: never ask the music to play outside a tap (the
  loading-finished call goes), and every tap during play retries the
  music when it is wanted and not playing. Fallback: tag
  `before-iphone-speech-buffers` on commit 300675c, pushed; John also
  copies the game folder outside the project by hand. The Now Playing
  pause button controlling the music from outside the game is accepted.

**2026-10-16, Option C built (Claude; one commit, stamp
`2026-1016-sound-buffers`, pushed for John's phone test).**

- **What changed for the player.** Nothing visible. The same twelve UI
  sounds and 37 speeches, the same three tunes, the same popup. The
  difference is how a sound is played: UI clips and speech now come from
  the audio engine's own decoded copies (as the spinner ticks always did),
  so a voice that starts from a timer, seconds after a tap, plays on the
  phone. The music is still a media element, because a tune is minutes
  long; it is now only ever asked to start inside a tap, and every tap
  during play gives a stalled tune another chance.
- **Two small behaviour changes.** (1) The welcome music no longer tries
  to start by itself when loading finishes; the artwork tap is the one
  start, on every browser (desktop Chrome blocked the auto-start anyway
  unless the site had been played a lot). (2) A tap during play restarts
  a tune that is wanted but not playing: Always mode, or the game-over
  tune; in Paused mode, where the tune was faded out on purpose, taps do
  nothing.
- **What John tests on the phone** (live site, alone and in the shell):
  artwork tap starts the music; Let's play; dish tap gives ticks and then
  the "goes first" voice; the character arrows speak; a round with set
  fanfares; game over with the speech and then the tune; `?demo=tie`.
  If the game-over tune does not come in Paused mode, a tap should
  start it; that case (a timer, not a tap) is the one known soft spot.
- **Phone test passed** (John, wifi, live site): every sound heard,
  including the goes-first voice, the arrows and the victory speech.
- **Fast start, same afternoon (John's "option 3").** John's cold first
  start took about ten seconds of blank popup and ten more of "Loading
  assets"; the second start was brisk. Decided and built: "Let's play"
  waits only for the images and the twelve short sounds; the music never
  holds the button; only the chosen tune downloads at startup, the other
  two when picked in the popup. The music does not start by itself when
  it arrives (that would be a start with no tap behind it): in Always
  mode the next tap during play starts it, in Paused mode the next dialog
  does; the player never goes back to the welcome. The blank popup before
  the welcome is the page itself arriving cold from the Pages edge on a
  first visit; every friend's first visit is a cold start, so this is
  still worth a look (item 5 in the game's NEXT-TODOS).
- **The portraits were the wait (same afternoon).** John asked whether
  the stamp had really been bumped, because the cellular restart was
  brisk. It had; a stamp only refreshes the scripts and stylesheets,
  while the music and images stay cached for ten minutes and are then
  revalidated without a download, so his run was warm. A measured cold
  start against the live site showed the welcome appearing within a
  second or two and the wait being the six character portraits: 8.8 MB
  of 1024 px PNGs drawn at no more than about 311 device pixels on any
  device John cares about (iPhone, iPad, PC browser, even a 4K monitor,
  where the frame's height cap makes the portrait 246 device pixels at
  any scaling). Decided: 512 px WebP, quality 85, which John accepted
  after seeing the drawn sizes and a trial table (183 kB for all six,
  fifty times smaller, transparency kept, WebP shown by every browser
  that runs the game). Originals kept in the design-ideas folder under
  "character portraits" with a note, as John asked. The candies (500 px,
  1.8 MB, already at their drawn size) are left for a possible later
  WebP-only pass.
- **Sound closed (evening).** John: "the sound seems to be working fine
  now. we know where to look if we still have problems later." The
  `?debug=sound` panel and its two diagnostics were removed; the candies
  stay PNG (not a problem). Still to do: item 13 (the opponent's set
  appearing before the candy arrives); a real cold start on the phone
  (private tab or cleared site data) on cellular.
- **Set on arrival (midday, item 13).** The giver's side redraws at
  take-off, the receiver's on arrival, in both directions. Before, the
  opponent's take redrew the whole board at take-off, after the engine had
  already recorded the set, so the check mark and the set count showed
  while the candy was still in the air. Nothing else about the flight
  changed.
- **A shorter pause before the human's NO, GO FISH (John).** John felt the
  opponent's "no" came faster than his own. It does when he taps Ask
  (0.25 s after the question is sent); otherwise his question auto-sends
  after 1 s. Decided: the opponent's unsatisfiable question is held 0.4 s
  instead of 1 s before the reply fades in (`requestHoldMs`, tunable; 0
  makes it instant). The give case keeps its 1 s window for tapping the
  matching candy.
- **The startup flash, traced and fixed (NEXT-TODOS item 4, deferred since
  October).** John: "a quick flash of another popup ... 'welcome to go fish
  candy edition' ... it flashes by so fast i cannot really read it." A
  screencast of the shell on throttled 4G showed what it is: the welcome
  dialog itself in its plain look (title and subtitle run together, rules
  text, a green Let's play, no vine frame), on screen for about a second
  before the script adds the welcome styling. John confirmed the frame.
  Decided: ship the welcome look in the HTML (the overlay starts with the
  `welcoming` class and a disabled "Loading assets" button), so the first
  paint is the welcome. No cover, no visibility trick; the earlier
  experiments of that kind stay reverted.
- **The welcome says what the shell says (afternoon, John's design).**
  John wanted the welcome's text to be the This Game text from the shell,
  formatted the same way: orange outlined GO FISH!, "candy rainfall" with
  a colour per letter, his line breaks, "Good luck!" dropped, a two-line
  credit at the end ("v 0.19.2 10/2026" / "jp/claude/chatty", no
  "Credits:"). The first attempt shrank the type to fit; John: "that is
  not working, but we still need the content." Decided: the title,
  subtitle and text scroll inside a box with no visible border, under the
  SOUND button; the three/four switch and Let's play stay fixed below
  it. A down chevron sits along the bottom of the box when there is more
  below, an up chevron along the top when there is more above (never
  when there is not); a tap scrolls most of a box, a finger drags. At the
  start the title, subtitle and the lines through "Get it, or else GO
  FISH!" are in view. Text sizes went back to the welcome's own. The old
  two-paragraph welcome stays in an HTML comment as the fallback, and
  John saved a screenshot of it in the design-ideas folder.
- **NEW and HELP.** The two candy-bar buttons on the table were NEW GAME
  and ?? / SOUND; John shortened them.
- **The mix, a quarter quieter (John, by ear on the desktop).** The UI
  sounds were at half level and felt loud next to the music: now a
  quarter. Then by ear: the character-switch sounds a quarter below that,
  the spoken lines (goes first, victory, tie) half again above the UI
  level, and all the music a quarter quieter at every slider stop (the
  stops 0 to 100 and the default 80 stay; it is what 100 means that
  dropped). Each level is one number in `sound.js` for the next round of
  tuning on the phone.
- **The dish candies flickered on the phone (John), not on the desktop.**
  Cause: every redraw of the table threw away every candy picture and
  made new ones; a phone paints a brand-new picture blank for a frame
  while it decodes it again, a desktop keeps the decoded picture around.
  Decided: keep the pictures. A candy keeps its picture for the whole
  round and is only moved between the dish and the tray; the centre plate
  is made once; a slot's artwork is redrawn only when its count or its
  completed check changes. The cheaper "decode before painting" hint was
  added too, for the pictures that genuinely are new (the flying candy).
- **The three soundtracks, a lot smaller (John, 2026-10-16 14:00).** They
  came from Soundtrack Loops as 44.1 kHz stereo MP3s at about 160 kbps,
  13.1 MB for the three, each with embedded cover art the game never
  shows. Trial encodes at 128, 96, 80, 64 (stereo and mono) and 48 kbps
  were listed with sizes; the sound cost of each was described (96 kbps
  trims above roughly 15 kHz, inaudible at the game's levels on a phone;
  64 needs mono; 48 at 22 kHz sounds like a small radio). John chose 96
  kbps stereo with the art dropped: 7.5 MB. The untouched originals moved
  to `_documents/design ideas/soundtrack originals/` with a README giving
  the ffmpeg command and the rule to re-encode from the originals, never
  from the game copies. John then made `assets/sounds/soundtracks/` and
  the three game copies live there; the file names did not change.
- **Sound popup, two small changes (John).** The volume slider lost the
  browser's tick marks ("the numbers tell the story"); the 0 to 100
  numbers stay and the slider still snaps to them. The When-to-play
  switch reads two centred lines per side: a small lowercase lead-in over
  the action word at its old size, "play / Always" and "only when /
  Paused".
- **Go Fish is releasable (John, 2026-10-16 afternoon).** John closed
  every open item in the game's NEXT-TODOS (sound element by element,
  play feel, the mobile sound-start question, where settings live, the
  four stale checks, the optional candy WebP, the cellular cold start)
  and the three phone reviews that were pending (the afternoon's
  changes, the cold start, the October 15 work). The game is documented
  as complete; later work on it is maintenance. The next project is the
  shell: John is weighing one control point (the Home button opening the
  sliding game panel) instead of the top buttons plus the bottom panel.


**2026-10-16 later afternoon (Claude; stamp `2026-1016-one-control`,
shared with the shell).** The shell changed around the game: one control
point (Home opens the panel, a tap on the game closes it, no strip) and a
**9:15 game panel**. The board's 154vw grid is centred, so it gained
about 5.5vw of felt above and below and nothing moved; checked at phone
size and by `verify-shell.cjs`. John's four asks on the game's side:

- **Score note**: "Sully vs Hermione", the player's chosen name, vs, the
  opponent; the "<n> set game" note dropped ("no need").
- **Name in the tab**: GO FISH! big in the gold, "Candy Edition" smaller
  under it, like the welcome heading; more air between the candy plate
  and the title ("cramped together"). Built with a `\n` in the games.json
  title and two size rules in the shell's 5b block.
- **Name in the top bar**: `GO FISH! - Candy Edition`, GO FISH! in the
  shell's orange at the bar's size, the rest white and smaller.
- **No exclamation mark on "Candy Edition"**, in the tab and now on the
  welcome screen too (GO FISH! keeps its own).

## The music default: OFF and Always (John, 2026-10-18)

"the MUSIC setting is ON/PAUSED. we should have it OFF/ALWAYS as the
initial default when loading the game." So a fresh load has the music
channel off and the play mode Always; the Sound popup shows MUSIC with
the red slash and the switch on Always. John: "if the user taps the ON
for MUSIC, that it will start playing immediately? that is what i want
to happen." It does: the MUSIC tap enables the channel and starts the
chosen tune at once with its three-second fade-in, whatever the mode;
Cancel puts it back off and stops it, OK keeps it and remembers the
settings in this browser. A remembered note still wins over the
defaults on the next load, including a remembered "on". Nothing else in
the popup changed.
