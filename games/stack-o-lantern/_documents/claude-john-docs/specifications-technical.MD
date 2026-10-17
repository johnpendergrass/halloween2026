# Stack-o'-Lantern — Technical Specifications

Last updated: 2026-10-16 17:15 (first file in the game's own folder: the 2026-09-29 notes from the root technical spec's section 4g, then the 2026-10-16 modes, milestones and end screen)

How the game is built, for whoever edits it next. The design and the
reasons are in `specifications.MD` beside this. Files: `index.html`,
`stack-o-lantern.css`, `stack-o-lantern.js`, `assets/stack.svg`, all LF.

## 1. The 2026-09-29 build

- **Every number in stack-o-lantern.js is in vw**; positions are written as
  `"Nvw"` strings into `style.left/bottom/width`, so the browser does the
  pixel maths and resizing is free. `--slab-h` (9vw) and `--ground-h`
  (10vw) are CSS variables read once by JS (`readVw`), so CSS and JS
  cannot disagree.
- **World vs camera**: slab positions are world coordinates (y up from the
  stage bottom). The camera is ONE `translateY` on the `.tower` container
  (stars ×0.25 and moon ×0.12 for parallax), so placed slabs are set once.
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
  `.ground`, `.moon`), the start-screen note, localStorage
  `halloween2026:stack-o-lantern:mode` (try/catch), a `showReaction(MODE,
  "is-mode")` flash when playing, and `showModeHint()` unless quiet (the
  start-up call is quiet). `#modeSwitch` is a `<button>` in the info bar,
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
  kind in first-earned order; each becomes `makeChip(entry)`, a
  borderless gold `<button class="milestone-chip">` with `data-tip`.
  `click` toggles `showTip(chip)` / `hideTip()`; `pointerenter/leave`
  with `pointerType === "mouse"` hover (a finger's tap fires pointerenter
  too, and must not show-then-hide). `#milestoneTip` is positioned in px
  from `getBoundingClientRect()` of the chip and `#endScreen`, clamped to
  the screen's width, 8px above the chip. A `pointerdown` on the end
  screen outside a chip hides it. `#endScreen` has `padding-top: 35vw`
  (the moon, unscaled, reaches 33vw) and `justify-content: flex-start`.
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
  `check-modehint.cjs`, `check-hints.cjs`. They lived in the session's
  scratchpad; copy the pattern from Go Fish's
  `_documents/codex-john-docs/verify-shell.cjs` if they are wanted in the
  repo.
- Edit the files with scripts written to disk (a bash heredoc mangles
  `★`-style escapes); all three game files are LF.

## 5. Shell-side facts

- `games.json`: slot 2, `settings: []` (the shell's Easy / Hard entry was
  dropped 2026-10-16), `how_to_play` mentions the toggle.
- `index.html` links carry the shared cache stamp since 2026-10-16
  (`?v=2026-1016-stack-milestones` on the stylesheet, the helper and the
  script); bump them with the shell's.
- The game's own localStorage key: `halloween2026:stack-o-lantern:mode`.
