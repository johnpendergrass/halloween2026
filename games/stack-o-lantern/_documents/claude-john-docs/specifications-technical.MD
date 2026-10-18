# Stack o' Lantern — Technical Specifications

**PROJECT FINISHED 2026-10-18 (John: "it will likely be opened for bug fixes, but i am not planning any additional games or features"). This file describes the game as it ships; bug fixes only from here.**

Last updated: 2026-10-18 13:24 (/update; 12.4 .sound-corner 25.5vw with 8.5vw padding at top -6vw / left -5.5vw, check-speaker, stamp 2026-1018-speaker; before that 13:04: SECTION 12: CROSSING_FASTEST 0.65, probe-framerate, the tips, PRACTICE_LEVELS of tens, updateLabels and gameOver for CHEAT rounds, fillScores' marks, check-startlevel rewritten, check-cheat, stamp 2026-1018-cheat; before that 2026-10-18 12:14: SECTION 11: the ladder regenerated, fireworks on three entries, bigMilestone, startRungFireworks, chosenStartLevel, PRACTICE_LEVELS and the disabled rows, check-startlevel steps, stamp 2026-1018-diagonal; before that 2026-10-17 17:57: SECTION 10: CROSSING_START / CROSSING_FASTEST / RAMP / crossingFor, the practice level (PRACTICE_KEY, applyStartLevel, the badge, the panel), Stack again → backToStart, lastDirection, check-startlevel, stamp 2026-1017-stack-practice. 16:27: SECTION 9: reportScore's place, endTier, the balloons, FANFARES, the fireworks layer and shows, check-topfive, stamp 2026-1017-stack-victory in 29 places. 14:41: SECTION 8: sound.js, the switch, sound/pitch in the table, stackedCount counts the base, the rung jumps the queue, stamp 2026-1017-stack-sound in 27 places. 12:21: SECTION 6 IS CURRENT and overrides sections 2 and 3 where they differ: families and bestEarned, no MODES, no info bar, .score-corner, the staircase, the minute, Halloween.bestScore; stamp 2026-1017-stack-families. Earlier: 2026-10-16 20:45 /update, the checks under _documents/checks/, stamp 2026-1016-stack-endscreen; 20:20 #count gone, state.newBest; 19:55 popCount; 19:25 the moon at 26vw; 18:30 GRID_PATTERNS / fillMilestoneGrid; 17:15 first file in the game's own folder)

How the game is built, for whoever edits it next. The design and the
reasons are in `specifications.MD` beside this. Files: `index.html`,
`stack-o-lantern.css`, `stack-o-lantern.js`, `sound.js` (since 14:41),
`assets/stack.svg`, `assets/speaker.png`; the text files all LF.

## 1. The 2026-09-29 build

- **Every number in stack-o-lantern.js is in vw**; positions are written as
  `"Nvw"` strings into `style.left/bottom/width`, so the browser does the
  pixel maths and resizing is free. `--slab-h` (9vw) and `--ground-h`
  (10vw) are CSS variables read once by JS (`readVw`), so CSS and JS
  cannot disagree.
- **The bar**: `.info-side` spans (`flex: 1 1 0`) either side of the
  toggle keep it centred; the left one is empty (the count label is
  gone), the right is `#bestBox` ("Best `#best`"). `reset()` notes
  `state.bestBefore`; `updateLabels()` sets `state.newBest` when the
  count passes it (and it was above 0); the
  end-screen timeout in `gameOver()` adds `is-new-best` to `#bestBox`
  (gold, `best-glow` pulse 1.2 s; reduced motion: steady glow) and
  `start()` removes it; `reset()` clears the flag.
- **The count pop**: `settle()` calls `popCount(x, width, bottom)`, which
  appends a `.count-pop` div to `.tower` at `left: x + width/2`,
  `bottom: bottom + SLAB_H` (world vw, so the camera carries it) with the
  count as text; the `count-pop` keyframes (700 ms, `translate(-50%, …)`
  for centring, swell to 1.15 then up 18vw and out) and an `animationend`
  listener that removes it. Reduced motion swaps in `count-fade`.
- **World vs camera**: slab positions are world coordinates (y up from the
  stage bottom). The camera is ONE `translateY` on the `.tower` container
  (stars ×0.25 for parallax; the moon is fixed), so placed slabs are set once.
  The ground element is created inside `.tower` by `reset()` so it scrolls
  away too.
- `drop()`: perfect if `|mover.x - top.x| <= perfectTolerance()`; else
  overlap = `min(rights) - max(lefts)`; `< MIN_OVERLAP` = miss (the whole
  slab becomes a falling piece); else the overhang becomes a piece
  (`addFallingPiece`, gravity 320vw/s², spin) and the mover settles
  (`settle()` → `placeSlab`, `updateLabels`, `spawnMover`).
- Reaction word restarts its CSS animation via `void el.offsetWidth`
  between removing and adding `.is-shown`. The moon's mouth is one element
  restyled by class (`is-happy/is-wow/is-meh/is-sad`).
- `requestAnimationFrame` loop, dt capped at 0.05 s. `pointerdown` on the
  stage; Space/Enter as a keyboard extra.
- A full-width slab can never fully miss: the mover's range (−16 to 70vw)
  always overlaps a 46vw base by at least 3vw. A miss needs a narrowed
  tower. (Found while writing a test; not a bug.)

## 2. Modes (2026-10-16)

- `MODES = { hard, easy }`, each `{ extraTolerance, rampCount, speedGrowth,
  note }`; `PERFECT_TOLERANCE` (1.6) and `START_WIDTH` (46) are shared
  constants again. `perfectTolerance()` = `PERFECT_TOLERANCE +
  extraTolerance * min(1, stackedCount() / rampCount)`: HARD has
  extra 0; EASY 1.6 over 20 pumpkins. `spawnMover` uses
  `state.rules.speedGrowth`.
- `state.modeName` (the toggle), `state.rules` (the MODES entry in force),
  `state.usedEasy` (set by `reset()` from the mode and by `applyMode` when
  EASY is chosen mid-round; read at game over for the end lines and the
  score note). `applyMode(name, quiet)`: sets rules, toggle `data-mode`,
  `body.dataset.mode` (the CSS sky: `body[data-mode="hard"] .stage`,
  `.ground`, `.moon`), localStorage
  `halloween2026:stack-o-lantern:mode` (try/catch), a `showReaction(MODE,
  "is-mode")` flash when playing, and `showModeHint()` unless quiet (no
  caller is quiet today; the start-up call shows the reminder on the
  start screen, where it stays until `start()` hides it). `#modeSwitch`
  is a `<button>` in the info bar,
  outside the stage, so it never drops a pumpkin; min-height 13vw (rule
  1.7). `#modeHint` is a pill at the top of the stage (z 12, above the
  overlays), hidden by `start()` or by a 2.5 s timer mid-round.
- `COMPARISONS = { easy: [...], hard: [...] }`, each with a `[0, ...]`
  line, so the lookup never misses. `gameOver` reports
  `Halloween.reportScore(count, undefined, [roundMode])`.

## 3. Milestones (2026-10-16)

- `MILESTONES`: `{ kind, at, name, what, tip, hint }`. `what` is the
  banner's short line, `tip` the end-screen bubble, `hint` the start
  screen's goal line (lower case, after "NAME: "). Counters in `state`:
  `streak` (perfects), `cleanStreak`, `smallStreak`, `tinyStreak`,
  `pencilStreak`, `growthStreak`; plus `height` = `stackedCount()`,
  `ghost` and `comeback` as flags of the drop. `checkMilestones(flags)`
  builds `counts` by kind, pushes any unearned entry whose count reaches
  `at` onto `state.earned` and `state.toCelebrate`, then `celebrateNext()`
  drains the queue one banner per `MILESTONE_MS` (1800) using
  `state.celebrating`.
- **The streaks in `drop()`**: `clean` = `!mover.bounced`; `small/tiny/
  pencil` test `mover.width` (the slab being landed, before any clip)
  against `START_WIDTH / 2, / 4, / 8`; on any landing each is `+1` or `0`;
  `growthStreak` `+1` on a WIDER, `0` on a clip, untouched by a plain
  perfect. `isGhost` = `state.slabs.length % 7 === 6` (the mover's index
  at drop time); `comeback` = a WIDER whose width before growing was under
  `START_WIDTH / 2`.
- **The bounce flag**: `moveMover` sets `mover.bounced` only when the
  slab was heading INTO the wall it is clamped to. A new mover starts
  beyond the limit (`x = -width` or `100`) and is pulled to it on its
  first frame; counting that as a bounce broke the no-bounce streak for
  ever (found by the test, fixed the same hour).
- **Badges**: `showReaction(word, extraClass)` writes the word into
  `#reactionWord`, removes old `.badge`s and appends `makeBadge("star",
  n)` / `("bolt", n)` from `BADGE_FROM` (2 / 3). The shapes are
  `clip-path` polygons on `.badge-icon` (gold star; blue bolt).
- **The banner** `#milestone` (z 5, under the overlays): `.is-shown` runs
  `pop` 1800 ms; `burstStars()` appends `SPARK_COUNT` (16) `.spark`
  spans to the stage with `--dx/--dy/--spin/--spark` and a random delay;
  the `spark` keyframes fly them out (`translate(calc(-50% + var(--dx)),
  ...)`), each removes itself on `animationend`. `gameOver` empties the
  queue, hides the banner and removes sparks. Reduced motion: no sparks,
  the banner fades.
- **The end screen**: `topMilestones(earned)` keeps the highest `at` per
  kind in first-earned order; `fillMilestoneGrid(entries)` builds nine
  `.grid-cell` divs from `GRID_PATTERNS[n]` (a string of nine 0/1s, left
  to right, top to bottom; John's placement table) and puts
  `makeChip(entry)` in the cells marked 1. `.milestone-grid` is a CSS
  grid of 3 × 30vw columns and 9vw rows (slanted names in one column
  run parallel, so they can sit close); the chip is a borderless gold
  `<button class="milestone-chip">` with `data-tip`, `font-size:
  max(12px, 3.3vw)` (the widest name measures 27.4vw there, 30vw at
  text-small) and `transform: rotate(-15deg)`. A rotated button's
  `getBoundingClientRect()` is the box around the slant, which is what
  the bubble is placed from, so nothing else changes.
  `click` toggles `showTip(chip)` / `hideTip()`; `pointerenter/leave`
  with `pointerType === "mouse"` hover (a finger's tap fires pointerenter
  too, and must not show-then-hide). `#milestoneTip` is positioned in px
  from `getBoundingClientRect()` of the chip and `#endScreen`, clamped to
  the screen's width, 8px above the chip. A `pointerdown` on the end
  screen outside a chip hides it. `#endScreen` has `padding-top: 58vw`
  (the moon, `top: 26vw`, reaches 50vw), `padding-bottom: 12vw`, `justify-content:
  flex-start`, and `margin-top: auto` on the button pushes it to the
  bottom;
  `#endWord` (`.end-word`) and `#endCount` (`.end-count`) are
  `position: absolute` inside it: the word midway between the rule and
  the moon (`top: 8.5vw`, `line-height: 1`, full width, centred), the
  count in a flex column at `top: 26vw; left: 12vw; width: 56vw; height:
  24vw` (the moon's own top and height, centred on 40vw). During play
  `.reaction` sits at `top: 11vw` (the strip above the moon; its `rise`
  animation lifts it 8vw), `.milestone` at `top: 35%` (just under the
  moon's 50vw) and `.spark` bursts from `top: 38%`; `CAMERA_LINE` is 0.36
  so the flying slab (tower top + `HOVER`, 1.8 slabs) stays below the
  banner. `#startScreen` is `justify-content: flex-start` with
  `padding-top: 55vw`, like the end screen. `#endCount` holds
  three spans: "You stacked", `#endNumber` (text-large) and `#endNoun`
  ("pumpkin!" or "pumpkins!").
- **End words**: `END_WORDS` bands (`from`, five `words`), `endWordFor
  (count)` = first band reached, random word; used for both the miss
  flash and `#endWord`. The moon: `moonReacts("is-sad")` at the miss,
  then `moodForCount(count)` when the end screen appears (20+ wow, 10+
  happy, 4+ meh, else sad).
- **Goal line** `#goalLine` on the start screen: `startHints()` →
  `showHint()` picks a random MILESTONES entry (never the same twice
  running), `<b>NAME</b>: hint`, `.is-shown` fades it (opacity
  transition), `HINT_SHOW_MS` 3600 on, `HINT_GAP_MS` 500 off;
  `stopHints()` in `start()`. `min-height: 2.7em` keeps the overlay from
  jumping. (The moon speech bubble that preceded it is gone entirely: no
  `#moonBubble`, no `MOON_LINES`.)
- **The moon** has `z-index: 11` (above the overlays' 10). The camera's
  `translateY` is set on `style.transform` each frame, so any extra
  effect must use another property (`scale` was used for the dropped
  grow).

## 4. Testing

- Claude in Chrome throttles the page to about one frame a second while a
  script is held open, so timing-based taps cannot land. The checks are
  Playwright scripts (headless Chrome, 390×693, touch) against the
  no-cache server on port 8098, run one at a time, server stopped after:
  `check-milestones.cjs` (twelve perfects by polling the mover's left
  against the top slab's each frame, then sloppy drops to a miss),
  `check-narrow.cjs` (clips to under a quarter and an eighth, then
  perfects: Needle, Tightrope, Comeback, Green Thumb, Pencil Pusher,
  Toothpick), `check-chips.cjs` (end screen, tap/hover bubbles),
  `check-endgrid.cjs` (the grid with 1 to 9 names, screenshots, the
  word and count around the moon),
  `check-moonspot.cjs` (the moon's box on the start, play and end
  screens, the banner under it, the end screen with 9 and 1 names),
  `check-countpop.cjs` (goal line position, a count pop mid-flight),
  `check-bestglow.cjs` (the bar, the Best glow over three rounds),
  `check-modenote.cjs`, `check-modehint.cjs`, `check-hints.cjs`,
  `measure-names.cjs` (name widths at three font sizes). Since 20:45
  they live in `games/stack-o-lantern/_documents/checks/` (copied from
  the session's scratchpad; each hard-codes the Playwright path under
  `C:/Users/johnp/.cache/codex-runtimes/...` and Chrome's exe, and
  writes its screenshots beside itself). Run: start
  `python start-local/no-cache-server.py --port 8098` from the repo
  root, `node <check>.cjs`, stop the server.
- Edit the files with scripts written to disk (a bash heredoc mangles
  `★`-style escapes); all three game files are LF.

## 5. Shell-side facts

- `games.json`: slot 2, `settings: []`; since 2026-10-17 `title` and
  `short_title` are both "Stack o' Lantern", `description` is a list of
  six marked lines and `how_to_play` is `[]`; `app/styles.css` has a
  `.look-stack-o-lantern` block (centred, gold `.accent` with a dark
  stroke, an orange-edged `p.emphasis`).
- `index.html` links carry the shared cache stamp (`?v=2026-1017-stack-
  families` on the stylesheet, the helper and the script); bump them
  with the shell's (26 places: app.js 1, root index 2, Go Fish 20,
  Stack 3).
- The game writes nothing to localStorage any more (the mode key
  `halloween2026:stack-o-lantern:mode` is stale on devices that had it).

## 6. The 2026-10-17 build (families, one level, the whole screen)

- **MILESTONES** (37 entries on 2026-10-17 12:21; 51 from 13:30, when the height ladder grew to 24 rungs, see milestones.md): `{ family, kind, at, name, what, tip |
  line, hint }`. `family` is "height" | "accuracy" | "growth" | "bounce";
  the order within a family is the rank (rarest first), and
  `bestEarned(family)` is `MILESTONES.find(entry => entry.family ===
  family && state.earned.includes(entry))`. Height entries carry `line`
  (the comparison line) instead of `tip`. `END_FAMILIES = ["accuracy",
  "growth", "bounce"]` is the slot order. New `kind`s and counters in
  `state`: `cleanPerfectStreak` (no-bounce perfects in a row),
  `cleanSmallPerfectStreak` (the same on a slab <= half width),
  `cleanTinyStreak` (no-bounce landings in a row on <= a quarter). In
  `drop()` the perfect branch adds to all three when `clean` (and
  `small` / `tiny`); the clip branch zeroes the two perfect ones and
  keeps `cleanTinyStreak` going when `clean && tiny`. `comeback` is
  gone. The words were transcribed from John's `milestone list.md`; since
  12:40 the table is the source and `_documents/milestones.md` its reading copy.
- **Italics**: `fillMarked(element, text)` / `appendMarked` split the
  text on `*` and wrap the odd pieces in `<i>`; used for the banner's
  `what`, the tip bubble, the goal line's hint and the comparison line.
- **The banner queue**: `MILESTONES_WAITING` (1); after `celebrateNext()`
  is kicked, `checkMilestones` trims `state.toCelebrate` to its last
  entry, so older waiting banners expire. `state.earned` keeps them all.
- **END_WORDS**: `{ from: 5, ["TIMBER!"] }`, then the 1..4 and 0 bands;
  `endWordFor(count)` still picks the miss flash. `COMPARISONS` is one
  list of four (0, 1, 2, 4), HARD's. In `gameOver()`: `level =
  bestEarned("height")`; the title is `level.name.toUpperCase()` or the
  miss word; the line is `fillMarked(endCompare, level.line)` or the
  COMPARISONS pick; `Halloween.reportScore(count, undefined, level ?
  [level.name] : undefined)`.
- **The "You earned" space**: `#endMilestones` (`.end-milestones`,
  `flex: 1 1 auto; align-self: stretch; position: relative`) fills from
  the comparison line to the button; its `<p class="earned-heading">`
  ("You earned...", left, 4vw padding); `#endMilestoneList`
  (`.milestone-row`, absolute, `left/right: -8vw` so it spans the full
  width, `top: 7vw; bottom: 0`). `ROW_PLACES = [[], [50], [33.3, 66.7],
  [26, 50, 74]]` (centres in vw); `fillMilestoneRow(entries)` sets each
  chip's `left: Xvw` and `top: calc(50% + (X - 50) * tan 15° vw)`: the
  staircase falls to the right. `.milestone-chip` is `position:
  absolute; transform: translate(-50%, -50%) rotate(-15deg); max-width:
  31vw; min-width: min-content; font-size: max(16px, 4.8vw); font-weight:
  900; line-height: 1.1`, and holds a `span.milestone-word` (display
  block). `showTip(chip)` measures that span: bubble top = span rect top
  + (span.offsetWidth x sin 15°) / 2 - bubble height - 4px (the rotated
  rect's top is the raised right end; the middle of the word is lower by
  half the slant). `GRID_PATTERNS` / `fillMilestoneGrid` are gone.
- **The title**: `#endWord` is now a `span.end-word-box` inside the
  `.end-word` line: `inline-block; max-width: 94vw; padding: 1.2vw 3vw;
  border: 0.6vw solid #e8741c; border-radius: 3vw; box-shadow: 0 0 0
  0.5vw #5fbf8f`. `.end-word` top 18vw.
- **No MODES**: `SPEED_GROWTH` (1.035) and `PERFECT_TOLERANCE` (1.6) are
  used directly; `perfectTolerance()`, `applyMode`, `showModeHint`,
  `hideModeHint`, `savedMode`, `MODE_KEY`, `MODE_HINT_MS`, `state.modeName
  / rules / usedEasy`, `#modeSwitch`, `#modeHint`, `.is-mode` are gone.
  The sky is `.stage`'s own gradient (`#050309 / #1a0820 / #6b1d2a`),
  `.ground` `#1b1a1f` with a `#d9631a` line, `.moon` `#ead6a6`.
- **No info bar**: `<main class="stage is-glowing">` is the whole
  `<body>` (flex column, the stage `flex: 1 1 auto`). `#bestBox` is
  `div.score-corner.text-medium` (absolute, `top: 2vw; right: 3vw;
  z-index: 12; display: flex; gap: 2.5vw; pointer-events: none`) holding
  `p.new-best#newBest` (hidden; `font-size: 0.7em`; `::after` is the
  rightward tail; `new-best` keyframes pulse scale and glow) then
  `span.best-label` ("High score", 0.7em) and `b#best`. `is-new-best` on
  the corner lights the number (`best-glow`). The stage clips at its top
  edge, which is why the corner is inside it at 2vw.
- **The moon's spot**: `top: 34.75vw` (26 under the bar + 15 for the bar
  - 4 - 2.25). Everything tied to it: `.reaction` top 19.75vw,
  `.milestone` `top: max(60.75vw, 35%)`, `.spark` `top: max(63.75vw,
  38%)`, `#startScreen` padding-top 63.75vw, `#endScreen` padding-top
  66.75vw, `.end-count` top 34.75vw, `.end-word` top 18vw. The end
  screen's layout against the moon: 68..92vw across, 34.75..58.75vw
  down.
- **The glow**: `.stage.is-glowing .moon` adds two soft box-shadows
  (`transition: box-shadow 700ms`); the class is in the markup, removed
  by `start()`, added back in `gameOver()`'s timeout.
- **The minute**: `END_SCREEN_MS` (60000), `endTimer`; `armEndTimer()`
  (clear + set) is called when the end screen shows and on every
  `pointerdown` on `#endScreen`; `backToStart()` (only when `state.phase
  === "over"`): hides the tip, clears `is-new-best` and the balloon,
  `reset()`, phase "ready", swaps the screens, `startHints()`. `start()`
  clears the timer.
- **Start screen**: `.overlay .goal-line.is-shown { opacity: 0.6 }`;
  `#startScreen .hint { font-size: max(18px, 6vw); font-weight: 700 }`.
- **No badges**: `showReaction(word, extraClass)` writes the word only;
  `makeBadge`, `BADGE_FROM`, `.badge*` are gone.
- **The high score from the shell**: at start-up `state.best =
  Halloween.bestScore()` before `reset()`. The helper's new call returns
  `window.parent.halloweenApp.bestScore()` (app.js: the first saved
  score's `value`, the list being sorted best first) or 0; the shell's
  `clearScores()` calls `gameFrame.contentWindow.location.reload()` in a
  try/catch after emptying the list.
- **Checks** (`_documents/checks/`, Playwright, server on 8098):
  `check-families.cjs` (a 13-round of perfects: banners with `<i>`, the
  title HOOP HEIGHT, the line, "You earned...", chips and their places,
  the tip's italics, forced rows of 1 / 2 / 3 long names with box
  measurements and screenshots, a 3-round with THUD and the old line, a
  16-round with the glow, the balloon and the moon's shadow, then the
  end timer re-armed by a tap and `backToStart()` called directly),
  `check-startscreen.cjs` (glow, goal line opacity, hint font, glow off
  after a tap), `check-shell.cjs` (the app: pick Stack with in-page
  clicks because the drawer intercepts Playwright taps; the bar's title
  and Home size; THIS GAME text and a scrolled screenshot; a round
  inside the iframe and the saved note; reload and the corner reads 7;
  Clear scores and the corner reads 0), `check-narrow.cjs` (updated:
  `stackedCount()`, the streaks, `bestEarned` per family).
  `checks/obsolete/` holds check-bestglow, check-milestones,
  check-modehint, check-modenote (toggle or `#count`). `check-moonspot`
  and `check-endgrid` are stale (the old numbers) and were not run.

## 7. The height ladder (2026-10-17 13:30)

- **24 HEIGHT entries** at the top of `MILESTONES`, rarest first: 200
  Moon Landing, 175 Hubble, 150 Space Station, 125 Stratosphere, 100
  Everest, 95 Kilimanjaro, 90 Fuji, 85 Vesuvius, 80 Burj Khalifa, 75
  Shanghai Tower, 70 Empire State, 65 Eiffel Tower, 60 Chrysler, 55
  Space Needle, 50 Big Ben, 45 Liberty, 40 Sequoia, 35 Notre Dame, 30
  Tower of Pisa, 25 Treetops, 20 Haunted House, 15 Giraffe, 10 Hoop
  Height, 5 Scarecrow. `what` is always "N pumpkins high"; `hint` the
  count in words. Nothing else in the script changed: `bestEarned`,
  `gameOver` and the hints already walk the table.
- **The one-line rule**: the end title is 9vw capitals in `.end-word-box`
  (`max-width: 94vw`, inline-block). Measured with Playwright at 390px:
  one line is 48px tall, SHANGHAI TOWER 90.8vw; anything wider wraps to
  84px and would sit on the count. Measure a new name before adding it
  (set `#endWord`'s text and read its bounding box).
- **`_documents/milestones.md`** is the reading copy: counters, the four
  families as tables, the under-5 words and lines. The ladder was
  generated into the script and the file by one scratch script with a
  ROWS list; regenerate both rather than editing one.
- **Stamp**: `2026-1017-stack-heights`, 26 places.

## 8. Sound (2026-10-17 14:41)

- **`sound.js`**, loaded by `index.html` BEFORE `stack-o-lantern.js`
  (same stamp), three sections: (1) the speaker switch (`SOUND_KEY =
  "stack-o-lantern-sound"`, `sound.enabled`, `loadSoundSetting` /
  `saveSoundSetting` / `showSoundSwitch` / `toggleSound`,
  `audioContext()` which makes the Web Audio context on first use and
  resumes a suspended one, a `pointerdown` stopPropagation on
  `#soundButton` so the stage never sees the tap, and a document
  `pointerup` listener that resumes a suspended context: WebKit counts
  the lift, not the touch-down); (2) two building blocks, `tone(context,
  {wave, from, to, volume, length, delay})` and `noiseBurst(context,
  {volume, length, cutoff, delay})`, both scheduled at `currentTime +
  delay` with the gain set in a 1 ms linear ramp (a zero-time jump
  clicks) then an exponential fade, oscillators stopped 20 ms after the
  fade; the noise buffer (half a second, made once) through a lowpass;
  (3) the `SOUNDS` table of name → function(context, detail) and
  `playSound(name, detail)`, which returns at once when the switch is
  off and warns on an unknown name.
- **The numbers** (Hz, volume 0..1, seconds): tick 1500 / 0.08 / 0.025;
  perfect 1320 / 0.30 / 0.18 + 2640 / 0.10 / 0.08; wider 1320 / 0.30 /
  0.15 then 1760 / 0.30 / 0.25 at +0.09; soft triangle 660 / 0.25 /
  0.14; thunk 160→70 / 0.50 / 0.25 + noise 0.25 / 0.08 / cutoff 900;
  miss triangle 440 / 0.40 / 0.16 then 220→185 / 0.40 / 0.45 at +0.13;
  start 523 / 0.30 / 0.30 + 1046 / 0.10 / 0.15; milestone root = 659 ×
  2^(pitch/12), root / third (×1.26) / fifth (×1.5) at +0.10 / +0.17 /
  +0.24, 0.12 / 0.12 / 0.40 long, plus fifth×2 faintly on the last.
- **The calls** in `stack-o-lantern.js`: `playSound("tick")` in
  `moveSlab` where the direction flips at a wall (only when the slab was
  heading into it, as `bounced` already required); in `drop()`
  `playSound(word === "WIDER!" ? "wider" : "perfect")` after `settle`,
  `playSound("miss")` before `gameOver()`, `playSound(feeling.sound)`
  after the clipped `settle` (REACTIONS gained `sound: "soft" |
  "thunk"`); `playSound("start")` in `start()`; `if (entry.sound)
  playSound("milestone", entry.pitch)` in `celebrateNext`.
- **The table**: every `MILESTONES` entry ends `sound: true|false,
  pitch: N` (height true, the 27 others false). Pitches by rank within a
  family: `round((n-1-i) * 23 / (n-1))`, rarest 23, commonest 0: height
  23..0 one per rung; accuracy 23 20 18 15 13 10 8 5 3 0; growth 23 15
  8 0; bounce 23 21 19 17 15 13 12 10 8 6 4 2 0. `milestones.md` has
  Sound and Pitch columns with the same values (added by scratch script
  `add-pitch.py`; the 13:30 `heights.py` generator predates the two
  fields and would drop them: extend it or edit by hand).
- **`stackedCount()`** returns `state.slabs.length` (was length − 1):
  the base is pumpkin 1. `END_WORDS` bands from 5 / 2 / 1 (were 5 / 1 /
  0); `COMPARISONS` at 1 / 2 / 3 / 4 (were 0 / 1 / 2 / 4, the 1 line
  reworded "Two pumpkins..."). Nothing else reads the count differently;
  `check-families.cjs` passes unchanged.
- **The queue jump**: `checkMilestones` collects `newlyEarned`; if one
  is `family === "height"` it clears `milestoneTimer`, sets
  `state.toCelebrate = [rung, ...waiting, ...others]` and calls
  `celebrateNext()` at once (which plays the arpeggio, then sets the
  name: a spy that reads the banner at the sound sees the OLD name);
  otherwise the old path. `celebrateNext` keeps its timer in
  `milestoneTimer`; `reset()` clears it.
- **The switch's CSS** (`.sound-corner`): absolute, top 2.5vw, left 3vw,
  z-index 12 (the score corner's layer, above the overlays), 8.5vw
  square, the img rounded with `box-shadow: 0 0 2vw 0.5vw rgb(255 255
  255 / 55%)`; `::after` the slash (10vw × 1vw, #d93a2b, −45°) shown by
  `[aria-pressed="false"]`.
- **Checks** (scratchpad, not yet in `_documents/checks/`):
  `check-speaker.cjs` (flip, no round started, survives reload),
  `check-sounds.cjs` and `check-milestone-sound.cjs` (a `playSound` spy
  records names and the count; Chrome launched with
  `--autoplay-policy=no-user-gesture-required`). Worth moving in.
- **Stamp**: `2026-1017-stack-sound`, 27 places (Stack's index has 4:
  the CSS, the helper, sound.js, the script).

## 9. The end screen's celebration (2026-10-17 16:27)

### 9.1 The place, from the shell

`app.js` `reportScore(value, text, notes)` now RETURNS the score's place
in the five-line list: after the sort and the cut to five,
`data.scores.indexOf(score) + 1` (the very object it pushed; -1 → 0). The
early returns (no game, a bad value) return 0. The helper's
`Halloween.reportScore` returns what the app returns, 0 outside the app.
In `gameOver()`: `state.place = Halloween.reportScore(count, undefined,
level ? [level.name] : undefined)`.

### 9.2 The tier and the corner

```js
function endTier(count) {
  if (count < 5) return "none";
  if (state.newBest) return "best";
  if (state.place > 0) return "topFive";
  return "good";
}
```
Read inside the `END_DELAY_MS` timeout, after the end screen shows:
`FANFARES[tier]` → `playSound`, `startFireworks(tier)`, then the corner:
"best" adds `is-new-best` to `#bestBox` and shows `#newBest`; "topFive"
adds `is-top-five` and shows `#topFive` (new `<p class="new-best
is-top-five" id="topFive" hidden>TOP 5 SCORE!</p>` beside the gold one).
`clearCornerGlow()` removes both classes and hides both balloons; it is
called from `start()` and `backToStart()` (which also call
`stopFireworks()`). CSS: `.score-corner.is-top-five b` (colour `#8ee69a`,
a steady text-shadow, no animation), `.new-best.is-top-five`
(`animation: none`, a steady box-shadow, the pointer's
`border-left-color`), and the reduced-motion lines.

### 9.3 The fanfares (sound.js)

`FANFARES = { best: "fanfareBest", topFive: "fanfareTopFive", good:
"fanfareGood" }` in the game script. In `SOUNDS`:
- `fanfareGood`: G 392 (0.15 s), D 587 held 0.90 s at +0.18 with its
  octave 1174 faint.
- `fanfareTopFive`: C E G at 0 / 0.15 / 0.30 (sine 0.28 + triangle 0.08
  each, 0.14 s), then C 1046 held 1.10 s at +0.45 with G 784 under it.
- `fanfareBest`: `brass(pitch, at, length, volume)` = sine + triangle at
  30%; `semitones(root, n)`; `set(root, at, volume)` = root, +4, +7
  semitones 0.11 s apart (0.10 s each), the octave at +0.33 (0.30 s,
  volume +0.04). `set(523, 0, 0.24)`, `set(587, 0.62, 0.27)`, `set(659,
  1.24, 0.30)`, then 1318 at 1.76 (0.30 s) and 1318 at 1.96 held 1.80 s
  with E 659, G# 830, B 988 under it (0.14 each) and the shimmer 2637 +
  2643 (0.06 each, 1.40 s). About 3.8 s in all.
- `pop`: noise 0.30 / 0.07 s / cutoff 2500, a tone 500→120 0.25 / 0.08 s,
  and three noise ticks 0.10 / 0.02 s / cutoff 5000 at 0.10, 0.17, 0.26.

### 9.4 The fireworks

`index.html`: `<div class="fireworks" id="fireworks" aria-hidden="true">`
BEFORE the moon in the stage. CSS: `.fireworks` absolute, inset 0,
`z-index: 11` (the moon's level; before it in the page, so under it),
`overflow: hidden`, `pointer-events: none`. `.rocket`: 2.4vw white dot,
`box-shadow: 0 0 1vw 0.3vw var(--colour)`, `animation: rocket 550ms
ease-out forwards` from `translate(-50%,-50%)` to `translate(calc(-50% +
var(--tx)), calc(-50% + var(--ty)))` (px, set by the script).
`.firework`: 3.2vw dot in `var(--colour)`, `box-shadow: 0 0 0.6vw`,
`animation: firework 1100ms cubic-bezier(0.1, 0.6, 0.3, 1) forwards`:
scale 1.3 → opacity 1 at 65% → opacity 0 at `calc(-50% + var(--dx)),
calc(-50% + var(--dy) + 6vw)` scale 0.4 (the +6vw is the sag).
Reduced motion hides `.rocket, .firework` (no bursts, so no pops).

The script, after `clearCornerGlow`:
```js
const FIREWORK_COLOURS = ["#ff5e3a", "#ffd23f", "#3dff7a", "#4dc9ff", "#ff4fd8", "#ff9a1f"];
const FIREWORK_SHOWS = {
  good:    { bursts: 6,  over: 3000, colours: 6, trickle: { shortest: 2000, longest: 6000, most: 2 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
  topFive: { bursts: 12, over: 4000, colours: 6, trickle: { shortest: 800,  longest: 4000, most: 3 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
  best:    { bursts: 16, over: 5000, colours: 6, trickle: { shortest: 800,  longest: 4000, most: 3 }, reach: { left: 75, right: 10, up: 36, down: 50 } },
};
```
- `startFireworks(tier)`: `FIREWORK_SHOWS[tier]` or nothing; `pick()` a
  colour from the first `colours`; burst i at `(i / (bursts - 1)) * over
  + random 250 ms` (a single burst at 0); then, if `trickle`,
  `setTimeout(() => trickle(show, pick), over + 1200)`.
- `trickle(show, pick)`: a pause of `shortest + random × (longest −
  shortest)`; then `rockets = min(most, roll < 0.55 ? 1 : roll < 0.85 ?
  2 : 3)` launched `i × (150 + random 300)` ms apart; then `trickle`
  again. Every timer goes in `fireworkTimers`.
- `stopFireworks()`: clears every timer, empties `#fireworks`.
- `launchRocket(colour, reach)`: measures the stage and the moon
  (`getBoundingClientRect`), `vw = stage width / 100`; `dx` in
  `[-left, +right] × vw`, `dy` in `[-up, +down] × vw`; a point within 8vw
  of the moon's centre is pushed 12vw up; clamped to x 8..92vw, y 6vw ..
  stage height − 10vw. A `.rocket` at the moon's centre with `--tx`,
  `--ty`, `--colour`; on `animationend` it is removed and `burst(toX,
  toY, colour)` runs.
- `burst(x, y, colour)`: 36 `.firework` dots at even angles (+ random
  0.15 rad), distance 10 + random 12 vw, `--dx`/`--dy` in vw, every fourth
  dot white; removed on `animationend`; `playSound("pop")`.

### 9.5 The check

`_documents/checks/check-topfive.cjs` (needs the 8098 server): loads the
SHELL, clears localStorage, opens Stack (slot 2's button is an icon, so
`.game-button[1].click()`), reports 20 / 30 / 5 / 30 from the shell
(places 1, 1, 3, 2), then inside the frame spies on `playSound` and
fakes rounds (`reset()`, `state.slabs.push({})` to the count,
`state.newBest`, `gameOver()`, wait `END_DELAY_MS`): 6 → green, 12 pops,
36 in the sky; `backToStart()` → clean; 40 with newBest → gold, 16 pops;
3 → nothing; with a full list of 90s, 6 → good, 6 pops, fanfareGood.
Screenshots `topfive-green.png`, `topfive-gold.png`,
`topfive-fireworks.png`. The browser's own `/favicon.ico` 404 is ignored
(the console line has no URL); real missing files are caught by a
response listener. `TOPFIVE OK`.

### 9.6 The stamp

`2026-1017-stack-victory` in 29 places: the 27 of before plus the
helper's script tags in Candy Go Fish's and Pumpkin Patch's `index.html`
(Stack's already had one). Without a stamp the phone kept an old
`game-helper.js`.

## 10. The ramp table, the practice level, back and forth (2026-10-17 17:57)

### 10.1 The ramp

`START_SPEED`, `MAX_SPEED` and `SPEED_GROWTH` are gone. In their place:
```js
const CROSSING_START = 2.4;     // seconds across the stage for the first slab
const CROSSING_FASTEST = 0.65;  // never quicker than this (0.85 until 2026-10-18)
const RAMP = [                  // seconds taken off the crossing per pumpkin, by stretch
  { from: 1,   step: 0.0141 },  // 2.4 s at pumpkin 1 down to 1.0 s at pumpkin 100
  { from: 100, step: 0.0071 },  // half as steep after that (the floor arrives at 150)
];
function crossingFor(count) {
  let seconds = CROSSING_START;
  for (let pumpkin = 2; pumpkin <= count; pumpkin += 1) {
    const stretch = RAMP.filter((row) => row.from < pumpkin).pop();
    seconds -= stretch.step;
  }
  return Math.max(CROSSING_FASTEST, seconds);
}
```
`spawnMover`: `speed = 100 / crossingFor(stackedCount())` (the stage is
100vw wide; the speed is that of the tower as it stands). A loop of at
most a couple of hundred steps per spawn, kept plain so the table can
have any number of rows. Pumpkin 100 → 2.4 − 0.0141 × 99 = 1.004 s.

### 10.2 The practice level

`index.html`: `<button class="level-badge" id="levelBadge" hidden>` after
the start screen; `<div class="overlay practice-panel" id="practicePanel"
hidden>` with `.practice-box` (title, the three-line note with
`.practice-fine`, `.practice-row` = `.practice-pick` label + `<select
id="practiceLevel">` and `#practiceReset`, `.practice-buttons` =
`#practiceCancel` + `#practiceDone` reading "OK"). CSS: `.level-badge`
absolute at `left: 50%; bottom: calc(var(--ground-h) + var(--slab-h) /
2)`, `translate(-50%, 50%)`, `z-index: 11` (over the start overlay),
plain white 3.6vw bold text with the stage's text shadow, 44px tall by
padding; `.practice-panel` `z-index: 13`, a dim; the select and its
`option`s opaque `#3a2f44` with white text (a desktop browser painted
white on white otherwise). Script:
- `state.startLevel` (1), `PRACTICE_KEY =
  "halloween2026:stack-o-lantern:start-level"`, `PRACTICE_TOP = 100`.
- `readStartLevel()` (try/catch, clamped 1..100), `saveStartLevel(n)`.
- `stackedCount()` = `state.slabs.length + state.startLevel - 1`.
- `applyStartLevel()` in `start()` after `reset()`: reads the level;
  above 1 pushes every height entry with `at <= startLevel` into
  `state.earned` (no banner, no arpeggio).
- `updateLabels()` returns at once when `startLevel > 1`; `gameOver`
  sets `state.place = 0` without calling `reportScore` then.
- `showBadge()` (text "Level N", shown) at load and in `backToStart()`;
  `start()` hides it. `openPractice()` builds the 100 options once and
  sets the select to the saved level; `closePractice()`; OK saves, shows
  the badge, closes; Reset sets the select to "1" (OK still needed);
  Cancel closes. The badge and the panel `stopPropagation` on
  `pointerdown` so the stage's start tap does not fire under them.
- `#playAgain` → `backToStart` (was `start`); Enter/Space on the end
  screen → `backToStart`.

### 10.3 Back and forth

`state.lastDirection` (0 at reset); `drop()` sets it to
`mover.direction` the moment the slab is dropped; `spawnMover`:
`fromLeft = state.lastDirection !== 1` (the first slab from the left,
then always the side opposite to the last travel). Until today it was
`state.slabs.length % 2 === 1`.

### 10.4 Checks

`check-startlevel.cjs` (the game page alone on 8098; `Halloween.
reportScore` replaced by a spy): the badge "Level 1" shown and the panel
hidden; a tap on the badge opens the panel (100 options) without
starting; OK with 50 → badge "Level 50", the key "50"; Cancel keeps it;
a stage tap starts a practice round (badge hidden, `startLevel` 50,
count 50, speed = `100 / crossingFor(50)`, rungs 5..50 earned); a
lined-up drop pops 51 with no banner; `gameOver` → `place` 0, nothing
reported, no balloon; Stack again → the welcome screen with "Level 50";
back to 1 → a round of 7 reports 7. Screenshots `startlevel-welcome.png`,
`startlevel-panel.png`. `check-families.cjs`: a `__tap()` after each
Stack again, and `__dropWhen` resolves "no mover" instead of throwing
inside a frame callback (which hung the check). Run the checks one at a
time.

### 10.5 The shell's hour

For the first build the shell had `games.json` `"choices"`, `fillChoices`
/ `makeChoice` / `currentChoice` / `saveChoice` / `choice(name)` in
app.js, `Halloween.choice(name)` in the helper and `.choice` styles;
all removed again the same hour. The shell's section-4 comment notes it.

### 10.6 The stamp

`2026-1017-stack-practice`, 29 places (unchanged count).

## 11. The ladder, the big rungs, practice per visit, the high picks (2026-10-18 12:14)

### 11.1 The ladder

The HEIGHT block of `MILESTONES` and the HEIGHT table of
`_documents/milestones.md` were regenerated together by a scratch
`ladder.py` (a LADDER list of (at, name), the kept lines read from the
script, NEW_LINES for Rainier and Denali, hints by count, pitch = 24 -
rank), so the two files match field for field. A compare script
(`compare-milestones.py`, scratchpad) parses both and prints every
difference; it misses the table's last entry by a regex slip (checked
by hand). The script's header comment and the markdown's date line note
the change; the "shortened title" example in both is Rainier now.

### 11.2 The big rungs

- **The table**: `fireworks: 2` on Space Needle (50), `fireworks: 8` on
  Everest (100) and Moon Landing (200); absent elsewhere. The table's
  comment explains the field.
- **`celebrateNext`**: `if (entry.sound) playSound(entry.fireworks ?
  "bigMilestone" : "milestone", entry.pitch); if (entry.fireworks)
  startRungFireworks(entry.fireworks);`.
- **`startRungFireworks(bursts)`** (by `fireworkTimers`, before
  `startFireworks`): `RUNG_ROCKET_GAP_MS = 330`, `RUNG_REACH = { left:
  60, right: 10, up: 30, down: 30 }`; rocket i at `i * 330 + random 120`
  ms via `launchRocket(pick(), RUNG_REACH)`; timers into
  `fireworkTimers`; no trickle.
- **`gameOver`** calls `stopFireworks()` after removing the sparks, so
  a rung's rockets do not run into the end screen's own show.
- **`sound.js`** `bigMilestone(context, pitch)`: root / third / fifth at
  0.10 / 0.17 / 0.24 (0.38, 0.38, 0.40; 0.12, 0.12, 0.14 s), the octave
  at 0.33 held 0.85 s (0.42) with a triangle (0.10, 0.60 s), the fifth
  (0.18) and root (0.14) under it for 0.85 s, and `octave * 2` (0.08,
  0.30 s) as shimmer.
- **Check** (scratchpad `check-bigrungs.cjs`, Chrome with
  `--autoplay-policy=no-user-gesture-required`): practice rounds from 49
  and 99 (a `playSound` spy; the banner, rockets in `#fireworks`, pops),
  200 by `state.toCelebrate = [entry]; celebrateNext()`. It wraps the
  spy once per round (so later rounds log every sound twice) and calls
  `backToStart()` before `END_DELAY_MS`, which lets the previous end
  screen's show fire mid-round: fix both before moving it into
  `_documents/checks/`.

### 11.3 The practice level per visit, and the picks

- `PRACTICE_KEY`, `readStartLevel`'s localStorage read and
  `saveStartLevel`'s write are gone. `let chosenStartLevel = 1`;
  `saveStartLevel(level)` sets it; `readStartLevel()` returns it when
  `PRACTICE_LEVELS.includes(chosenStartLevel)`, else 1. At load, once:
  `localStorage.removeItem("halloween2026:stack-o-lantern:start-level")`
  in try/catch.
- `PRACTICE_TOP = 100`, `PRACTICE_HIGH = [122, 147, 172, 197]`,
  `PRACTICE_LEVELS = [1..100, ...PRACTICE_HIGH]`. `openPractice` builds
  an option per level and, after 100, 122, 147 and 172, a disabled
  `<option value="">...</option>` (108 rows). OK: `const pick =
  Number(practiceLevel.value); if (PRACTICE_LEVELS.includes(pick))
  saveStartLevel(pick)`.
- **`check-startlevel.cjs`**: `look()` reports `saved` (always null now)
  and `chosen`; expects 108 options, the last four values `",172,,197"`,
  the rows at 100 / 102 / 104 / 106 "..." and disabled; step 6 picks 50,
  reloads, expects Level 1. Passes.

### 11.4 The stamp

`2026-1018-diagonal`, 29 places (Stack's index 4).

## 12. The floor, the tips, the list of tens, CHEAT rounds (2026-10-18 afternoon)

### 12.1 The floor
`CROSSING_FASTEST = 0.65` (0.85 until this day, 0.70 for an hour); the
RAMP rows unchanged, so `crossingFor` floors at pumpkin 150. The scratch
`probe-framerate.cjs` (scratchpad; worth moving into checks/) starts a
practice round at 172 and samples 180 frames per CPU throttle through
`Emulation.setCPUThrottlingRate`: frame gaps and `|dx|` of `state.mover.x`.
Found: 8.3 ms frames (headless Chrome at 120 Hz here) at 1x, 6x, 10x;
drops only at 20x.

### 12.2 The tips
Three `tip` strings in MILESTONES (Toothpick, Eye of the Needle, Needle)
and the same cells in `milestones.md`; `compare-milestones.py` still
agrees (its known miss of the last row aside).

### 12.3 The practice list and CHEAT rounds
- `PRACTICE_LEVELS = [1, ...Array.from({ length: 20 }, (_, i) => (i + 1) * 10)]`;
  `PRACTICE_TOP` and `PRACTICE_HIGH` gone; `openPractice` builds 21
  plain options (no disabled rows); OK still keeps the old level on a
  pick outside the list.
- `updateLabels` no longer returns early for `startLevel > 1`: the
  corner's best and `newBest` work in a practice round.
- `gameOver`: `const cheat = state.startLevel > 1`; the notes are
  `[level.name, "**CHEAT**"].filter(Boolean)` and `reportScore` is always
  called (`state.place` from its answer). The title is the plain level
  name (a `.cheat-mark` span after it lived for an hour).
- index.html: the panel's three lines and its comment.
- Shell `app/app.js` `fillScores`: a note is filled with
  `appendMarkedText(note, notes[slot])` instead of `textContent`;
  `games/game-helper.js` says so in its notes line. A note is still cut
  to `MAX_NOTE_LENGTH` (16) BEFORE the marks are read, so "**CHEAT**"
  (9 characters) is safe; a longer bold note could lose its closing
  mark.
- `check-startlevel.cjs`: the spy records `notes` and answers place 1;
  expects 21 options ('1,10,20' ... '170,180,190,200'), the practice end
  reported 51 with 'Space Needle,**CHEAT**', title 'SPACE NEEDLE',
  gold (51 beat the corner's 1), best '51'; the real round after it
  reports 7 with no notes (the check's pushed slabs earn no rung) and no
  CHEAT in the title. Passes. Scratch `check-cheat.cjs` ran the same
  round INSIDE the shell (frame found by url) and shot `cheat-end.png`
  and `cheat-list.png`: the bold note in the list, the saved notes.
- No stamp bump yet (local only).

### 12.4 The speaker's hit box (2026-10-18 13:24)
- `.sound-corner { top: -6vw; left: -5.5vw; width: 25.5vw; height:
  25.5vw; padding: 8.5vw }` (was top 2.5vw, left 3vw, 8.5vw square, no
  padding): the `img` inside is still 8.5vw at the same spot; `.stage`
  has `overflow: hidden`, so the part outside the corner is clipped and
  inert. `::after` (the slash) is centred on the button = on the picture.
- `_documents/checks/check-speaker.cjs`: real taps via
  `page.touchscreen.tap` at the picture's centre and 6 / 20 / 28 / 40 px
  outside; reads `aria-pressed` before and after and `state.phase`; then
  a tap at (195, 400) must start the round. Taps 500 ms apart: within
  350 ms the shell's touchend guard cancels the click.
- Stamp `2026-1018-speaker`, 29 places (unchanged count).
