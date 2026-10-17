# Stack o' Lantern — Technical Specifications

Last updated: 2026-10-17 12:21 (/update; SECTION 6 IS CURRENT and overrides sections 2 and 3 where they differ: families and bestEarned, no MODES, no info bar, .score-corner, the staircase, the minute, Halloween.bestScore; stamp 2026-1017-stack-families. Earlier: 2026-10-16 20:45 /update, the checks under _documents/checks/, stamp 2026-1016-stack-endscreen; 20:20 #count gone, state.newBest; 19:55 popCount; 19:25 the moon at 26vw; 18:30 GRID_PATTERNS / fillMilestoneGrid; 17:15 first file in the game's own folder)

How the game is built, for whoever edits it next. The design and the
reasons are in `specifications.MD` beside this. Files: `index.html`,
`stack-o-lantern.css`, `stack-o-lantern.js`, `assets/stack.svg`, all LF.

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
