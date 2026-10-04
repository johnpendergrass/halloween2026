# Claude — To Be Continued (2026-10-01 12:39)

Fourth day, third stretch: **discussion only, no code changed.** John
asked how the Sound switch could control an iframe game. Two options
came out of it; he has not chosen.

## FIRST THING NEXT SESSION: choose how Sound reaches a game

Put these two options to John before anything else. Nothing here is
built, and none of it is in the designers' docs. Same text, with the
reasoning, in `specifications.MD` 6j; the technical sketch is in
`specifications-technical.MD` section 7.

**What John wants**: Sound ON in Halloween 2026 lets the game play
sounds; Sound OFF stops the game's sound **immediately**, also sound
that is already playing.

**The fact that shapes the answer**: Halloween 2026 cannot force a game
to be silent. Browsers have no "mute this iframe" switch. On/off works
only if the game cooperates, through the helper file
(`games/game-helper.js`).

### Option A: the game asks (the designer does the work)

- The game plays its own sounds. Before each one it asks
  `Halloween.soundIsOn()` and plays only on a yes.
- Fine for short effects (a pop, a thud).
- Does NOT stop a sound already playing, such as music. For that the
  game must also be told when the switch flips: it hands the helper a
  function to run at that moment, and the designer writes the code that
  stops the game's own music. Extra code in every game with music.

### Option B: the helper plays the sounds (Claude's recommendation)

- The game never plays a sound itself. It calls something like
  `Halloween.playSound("pop.mp3")` or `Halloween.playMusic("tune.mp3")`.
- The helper keeps a list of every sound it started.
- When the player flips Sound, Halloween 2026 calls a function of the
  helper inside the game's page, and the helper mutes or un-mutes
  everything in its list at once.
- The designer writes nothing for on/off. The game's own code is not
  involved and does not "watch" anything: it is a function call made at
  the moment of the flip, not a variable somebody has to check.
- Looping music becomes audible again when Sound goes back ON.
- The catch: it is a rule, not a lock. A designer who plays sound around
  the helper is not silenced by the switch. The requirements doc would
  have to say "all sound goes through the helper".

### Also possible

- **Both**: B, plus A's `Halloween.soundIsOn()` for a designer who needs
  to know.
- Rejected by Claude: Halloween 2026 reaching into the game's page and
  muting what it finds. It catches only some kinds of sound.

### Where the discussion stopped

- Claude asked: B, A, or B with `soundIsOn()` as well? **No answer yet.**
- John's questions so far, and the answers given:
  - "I thought there was no communication between the two?" There is one
    piece already, the score: the game's page calls a function in
    Halloween 2026's page (same website, so the browser allows it).
    `soundIsOn()` would be a second piece of the same kind. The other
    direction, Halloween 2026 calling into the game's page, is equally
    possible; nothing uses it yet.
  - "Wouldn't the game need to pay attention to respond immediately?"
    Not in B (the helper holds the sounds and is called directly). Yes
    in A.
- To test once built: an iPhone plays no sound before the player's first
  tap. Unknown whether a tap on the Sound switch counts for the game's
  page, or the first tap must be inside the game.
- The game switches (Slow / Fast, Easy / Hard) were not discussed; they
  come after sound.

## Current state (unchanged since the 12:06 update)

- **A name (John, this stretch)**: the main app is **Halloween 2026**;
  the games it shows are the iframe games.
- **John's principle: a designer drops a game in and it runs.**
- **The This Game tab**: icon + name + byline (centred, rule under it);
  left **High Scores** (five lines `1.  42  (10-01-2026)`, `---` where
  empty, Clear scores with "You sure?  Yes  No"); right the switches:
  **Sound** first (one for the whole app), then up to three per game
  from games.json `settings` (Pumpkin Patch "Slow / Fast",
  Stack-o'-Lantern "Easy / Hard"); then description, how to play,
  credits.
- **Scores work**: a game includes `games/game-helper.js` and calls
  `Halloween.reportScore(42)` or `reportScore(42, "Master Chef")`; the
  app keeps the five best per game with the date, in `localStorage`.
  Stack-o'-Lantern does this.
- **Switches do not work yet**: shown and remembered only; no game can
  read Sound or its switches. No game makes any sound.
- **No pause from the app** (John): pause/continue/restart are each
  game's own job.
- **The docs describe what exists, not what is planned** (John).
- `APP_VERSION` = `2026-1001-scores`. Local server:
  `start-local/start-halloween.bat`, port 8091.
- Git: the code is committed and pushed (`536f8ba`). **This update's
  doc changes are NOT committed** (John: no commit yet).

## Work done this stretch

1. Reminded John how a score is reported (helper, `reportScore`,
   `localStorage`, the This Game list).
2. Discussed sound control; options A and B above.
3. This /update: this file, `specifications.MD` 6j,
   `specifications-technical.MD` section 7, the `__STATUS` marker.

## Immediate ToDo

1. **Choose the sound option** (top of this file).
2. Then the rest of John's next step: "fill in the sound and settings
   options, devise a way for plug-in games to use them, and modify the
   demo games to use those values."
   - Game switches: Claude's sketch, not agreed: `Halloween.getSettings()`
     (the 0/1 list, read when a new game starts). Decide what
     "Easy / Hard" does in Stack-o'-Lantern (`START_SPEED`,
     `SPEED_GROWTH`, `PERFECT_TOLERANCE`) and what "Slow / Fast" does in
     Pumpkin Patch (`RISE_TIME`, `WAIT_HIDDEN`).
   - The demo games need sounds to demonstrate Sound at all; none exist.
   - Already decided by John: Sound works immediately; a game switch in
     the panel applies to the next newly started game.
   - When built: the requirements doc gets the rules, and its "cannot
     read them" notes come out.
3. **The hint line** "Game options apply to your next game." under a
   game's switches: reword or remove (John deferred it).
4. **John to confirm the placeholder slots** (gameN in cell N, `game1`
   benched), still Claude's choice.
5. **Requirements doc, still missing**: "Your games.json entry" and the
   icon spec; where the wrong-on-purpose examples live.
6. **Contribution workflow** (zip to John?), "Adding your game" page,
   root `CLAUDE.md` / `AGENTS.md` for contributors' AIs.
7. Placeholder folders could show the helper as a commented example.
8. `_TABLED GAMES` on GitHub Pages: Claude believes Jekyll does not
   serve underscore folders; NOT verified.
9. Tabled games later (Hollow Hill: commit `c979de7`; Pie Maker: commit
   `a5bdbf7` for their games.json entries).
10. Maybe revisit the board (option B of the board, not of sound). Known
    quirk: `markCurrentButton()` matches by `folder_name`.
11. Switch on GitHub Pages; test on John's iPhone from the home screen
    (a home-screen copy has its own saved scores).
12. Still waiting: verdicts on the home art, the drawer covering 55% of
    Home, v6 TRIAL colours, title font. Favicon + app icons.

## Long-term ToDo

- Sound rules for designers (formats, file sizes, the iPhone first-tap
  rule); follows from the choice above.
- Checker script for games (paths, names, font sizes, no external URLs,
  size limits, games.json validity, icon spec, no direct
  `window.parent`/`localStorage`).
- Shared scoreboard + player names: explicitly NOT now.
- Home art: new tall painting at 1296 × 2016; fix silhouette halos.
- "Please rotate your phone" message.
- CONSIDER: Chinese language switch as a second file, not doubled fields.
- Deadline: 2026-10-31.
