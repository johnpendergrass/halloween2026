# Stack o' Lantern — To Be Continued (2026-10-17 16:27) — the end screen celebrates: three tiers, two balloons, three fanfares, fireworks from behind the moon

Read: this, then the 14:41 handoff beside it (sound), then
`specifications.MD` (sections 6 and 7) and `specifications-technical.MD`
(sections 8 and 9), then `../../README - STACK-O-LANTERN.md`. The
2026-10-16 17:15 file is the folder's baseline and stays (the 12:21
handoff was removed by the three-most-recent rule; its families story is
in `specifications.MD` 5). The shell's own handoff of the same minute,
in the root `claude-john-docs/`, has the iPhone double-tap zoom fix.

## State in one paragraph

**Playable, with sound and a celebration, checked, committed and pushed
with this handoff.** Since 14:41: the shell's `reportScore` returns the
score's place in the five-line list, so the game knows three tiers at
the end screen: a NEW BEST (gold balloon, the full fanfare, 16
fireworks then a random trickle), a TOP FIVE (green balloon that does
not pulse, a four-note fanfare, 12 fireworks and the trickle), and GOOD
JOB for every other round of 5 or more (a two-note "ta-daa", 6
fireworks and a sparser trickle); under 5 pumpkins nothing new. The
fireworks are rockets that rise from behind the moon and burst into
rings of 36 bright dots over the words of the end screen, with a pop
each. Stack's byline in the THIS GAME tab is gone (the credits line says
it). The stamp is `2026-1017-stack-victory` (29 places: the helper's
script tags carry it now).

## Work done this session (14:45 to 16:27)

1. The design talk: John asked for three kinds of ending (a new high
   score, a top-five score, a good job) with their own fanfares and a
   "celebratory moon" with fireworks "coming out from behind the moon
   ... above everything else (text, etc)". Then: a green "TOP 5 SCORE!"
   balloon like the gold one.
2. Step 1: `reportScore` returns the place (app.js, the helper, the
   requirements doc); `state.place`, `endTier(count)`, the green balloon
   and glow, `clearCornerGlow()`. John: "drop the pulsing of the top 5
   score" → the green balloon and number sit still.
3. Step 2: `fanfareGood`, `fanfareTopFive`, `fanfareBest` in sound.js,
   `FANFARES` by tier, played when the end screen appears. John: the
   best "needs much more fanfare ... three sets of climbing arpeggios,
   da da da ding, da da da ding, da da da ding ding ding!" → built as
   three sets in C, D, E with a helper per set.
4. Step 3: the `#fireworks` layer, `.rocket` / `.firework` CSS,
   `FIREWORK_COLOURS`, `FIREWORK_SHOWS`, `startFireworks`,
   `stopFireworks`, `launchRocket`, `burst`, the `pop` sound. Tuned by
   John in five rounds: "very small and blurry ... more of them ...
   bright and colorful ... in front of the text" (3.2vw crisp dots, 36 a
   burst, six saturated colours, the layer at the moon's level); "more
   fireworks still ... further from the moon" (16 bursts, a `reach` per
   show, the best over the whole screen); "after the flurry it should
   slow down, but still fire off randomly ... not on a regular clock"
   (the `trickle` function: random pauses, salvos of one to three);
   the top five "about 3/4 of that" with the same rhythm; the good
   "about half of the top five" with "reduced amounts" after.
5. `check-topfive.cjs` in `_documents/checks/`: the shell's places, the
   four tiers' balloons, fanfares (a `playSound` spy), pops and an empty
   sky after each restart; screenshots `topfive-green/gold/fireworks.png`.
6. The iPhone problem (the shell's handoff has the whole story): a double
   tap on the game zoomed the shell. Four iPhone screenshots sit in
   `_documents/` as the record. Stack's `index.html` viewport line asks
   for no zoom; the fix itself is the touchend guard in `game-helper.js`.
7. `games.json`: Stack's `designer` and `date` blanked, so the THIS GAME
   tab shows no byline under the title (John: "it is already at the
   bottom", the credits line).

## ToDo

1. **The difficulty ramp** (John: "it gets hard at around 25 or so";
   players should reach 50 and 75 "easily"). Talk first. The knobs:
   `START_SPEED` 42, `SPEED_GROWTH` 1.035 per slab (×2.4 at 25, ×5.6 at
   50, capped by `MAX_SPEED` 110), `PERFECT_TOLERANCE` 1.6, `MIN_OVERLAP`
   0.8, `BONUS_WIDTH` 3 every 3 perfects. Options: gentler growth (1.02
   → ×1.6 at 25, ×2.7 at 50), a later ceiling, growth in steps per rung,
   a tolerance that widens as the slab narrows.
2. The MP3 voice per rung (John's "for later"): `SOUNDS.<name>` can play
   a decoded buffer; preload on the start tap.
3. John's phone look at the fireworks on a real NEW BEST once Pages
   serves `2026-1017-stack-victory` (the shows were tuned on his local
   server, Chrome on the iPhone).
4. Move the scratch sound checks of 14:41 into `_documents/checks/`
   (speaker, sounds, milestone timing); `heights.py` does not know
   `sound` / `pitch`; `check-moonspot.cjs` and `check-endgrid.cjs` stale.
5. From before: more moon faces; the banner and the flying slab can
   overlap on short wide panels.

## Traps

- The tiers come from the shell: `Halloween.reportScore` must be called
  before `endTier` is read (gameOver does both, in that order).
- A fast double tap in Stack is fine (the game acts on pointerdown), but
  the second tap's click is refused by the helper's guard: Stack again
  and the speaker need a fresh tap after a fast one.
- The fireworks layer is `z-index: 11`, the moon's level, and must stay
  BEFORE the moon in `index.html` so the moon paints over it.
- `stopFireworks()` belongs wherever the end screen is left (`start`,
  `backToStart`); a forgotten call leaves the trickle running.
- The stamp is in 29 places now (the three helper script tags too).
- Stop Claude's 8098 check server by its PID, never `taskkill //IM
  python.exe`; John's own server runs on 8091.
