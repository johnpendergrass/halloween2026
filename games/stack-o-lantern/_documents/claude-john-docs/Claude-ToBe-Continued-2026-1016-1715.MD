# Stack-o'-Lantern — To Be Continued (2026-10-16 17:15) — modes, milestones and banter BUILT; sound next

The game's own handoff folder, started today (the rule since 2026-10-16:
a game's claude-john-docs lives in its `_documents/claude-john-docs/`;
the root folder is the shell's). This file is the folder's baseline.
Read: this, then `specifications.MD` and `specifications-technical.MD`
beside it, then `../../README - STACK-O-LANTERN.md`.

## State in one paragraph

**Playable and much richer than this morning; committed and pushed with
the shell's one-control-point work.** John played it on his phone between
every step and steered: an EASY / HARD toggle in the game's own info bar
(EASY ramps from HARD's rules as the tower grows; the modes look
different; two sets of end lines; a mid-round switch takes effect at
once); streak badges (star ×n for perfects, bolt ×n for no-bounce drops);
nineteen milestones in eight classes, each celebrated with a gold banner
and a burst of stars, the top of each class listed on the end screen as
tappable gold names with a describing bubble; a goal line on the start
screen; thirty end words in six bands; the moon bright above the overlays,
unmoved, with a verdict face on the whole round. Nothing is remembered
between rounds except the mode.

## Work done this session (2026-10-16, 16:00 to 17:15)

In order, each one play-tested by John: the mode toggle (then its second
pass: ramp, sky, two end-line sets, instant switch); the mode reminder
under the toggle; milestones with badges, banners, bursts and the end
list; describing bubbles on the names; the moon forward; moon speech
hints (dropped); plain names, no "Tap one"; the moon back to its in-game
place and size, the words moved up, the reminder subdued; end-word bands;
top-of-class only on the end screen; narrow-slab, pencil and growth
classes. Bug found by a test and fixed: a new slab's first-frame clamp to
the wall counted as a bounce. The game's docs were created in this
folder (sections 6f / 4g of the root specs are now stubs pointing here).

## ToDo

Immediate:
- **Sound.** John: "give it a try!" Plan: synthesise with the Web Audio
  API (no files): a low thunk on landing, a sharper knock when the slab
  bounces off a wall, a short bright chime on a perfect rising with the
  streak, a woody crack for the sliced piece, a falling whistle and splat
  on the miss, a celebratory ding at each milestone (`celebrateNext`). A
  speaker toggle in the info bar, remembered like the mode. iPhone needs
  the first tap to unlock audio: create/resume the context in `onTap`.
  If a synthesised sound disappoints, swap that one for an MP3 John
  finds; keep the play calls the same.
- **High score feedback at game over** ("Oh so close... that almost made
  the high scores list!"): needs the shell to offer the saved list to the
  game (a `Halloween.savedScores()` helper call) or the game to keep its
  own best. Light and positive, fine-grained.
- Phone check of the latest: pencil milestones, the end-word bands, the
  goal line, the subdued reminder.

Longer term:
- More milestone classes if John picks any (list in specifications.MD
  section 4).
- The start screen shows once per visit, so the goal line is rarely
  seen; either accept, or give "Stack again" a start-screen stop.
- The start-screen mode note and the tapped reminder say the same line
  twice for a moment; could drop one.

## Traps

- Timing tests through Claude in Chrome do not work (one frame a second
  while a script runs); use Playwright on port 8098 (technical spec 4).
- A full-width slab cannot miss; a test that wants a miss must clip
  first.
- The cache stamp is shared with the shell and Go Fish; this game's
  `index.html` carries it on three links since today.
- Write edit scripts to files; a bash heredoc eats `\u` escapes.
