# Go Fish Candy Edition — animation and timing survey

**End-of-day update:** [End-of-first-day handoff](END-OF-FIRST-DAY-2026-1009.md) takes precedence for current runtime and TODOs. This earlier inventory includes assumptions superseded by the quote speed toggle, retained questions, compact boxes and four-copy preview. Resurvey those paths before implementing its refactor plan.

Surveyed October 9, 2026. This is an inventory and proposed design, not an implementation change. Preserve the current presentation while centralizing its controls in a later pass.

## Findings

The game has **two JavaScript timing helpers**, **five Web Animations creation sites**, and separate CSS transitions/animations. Main timings are already partly centralized in `assets/json/game-config.json`; other delays, easing, keyframe parameters, reduced-motion timings and CSS durations remain scattered. There are no runtime `setInterval` or `requestAnimationFrame` loops in the game itself. Animation-frame sampling and timer overrides in verification scripts are test machinery.

Recommended direction: retain JSON as the one editable source, expose a clearly labeled presentation setup at the top of `candy-go-fish.js`, and derive CSS custom properties from the same configuration. A second editable set of JavaScript defaults would create competing sources. `config-data.js` remains generated for direct file opening.

Do not make every effect identical. Standardize clocks, pause/cancellation, cleanup, configuration and sequencing; retain separate speech, candy and emphasis profiles. Reading time, automatic-action time and physical movement time serve different purposes.

## Scope and source map

| Source | Responsibility |
| --- | --- |
| `candy-go-fish.js`: `waitActive` | Pause-aware waits and optional early release |
| `candy-go-fish.js`: `playVisual` | Tracks native animations, local dialog pause, generation cancellation and cleanup |
| `emphasizeGift` | Source glow and scale pulse before every transfer/draw |
| `sendPlayerRequest` | Player question travels toward the opponent and disappears |
| `presentOpponentSpeech` | Opponent question, Yes reply, Nope reply, reading holds and optional fade |
| `fillRequestBubble` | Shared question contents, grid-relative art sizing and rotation |
| `fly` | Every candy transfer/draw; visible candy or private neutral wrapper |
| `selectCandy`, `proceed`, `resolveRequest`, `drawCandy` | Coordinate the order of waits, speech, pulses, engine events and travel |
| `showDialog`, `celebrateSet`, `startGame` | Pause, user-controlled continuation and generation reset |
| `candy-go-fish.css` | Turn glow/board transitions, Go Fish entrance, static emphasis and reduced motion |
| `game-config.json` | Current timing, candy-art and travel settings |

`game-engine.js` and `computer-player.js` contain no presentation loops. No SVG asset animation was found. The shell's banner/drawer are outside this game-owned survey; centralizing game effects should not introduce a new helper or parent API.

## Existing timing configuration

All values below are milliseconds except easing and percentages.

| Current JSON field | Value | Actual use / suggested responsibility |
| --- | ---: | --- |
| `appearance.thinkingMs` | 1000 | Before the opponent chooses/asks; thinking delay |
| `appearance.playerRequestHoldMs` | 4000 | Selection to automatic player-question send; tap sends sooner, reselection restarts |
| `appearance.requestSpeechMs` | 2500 | Player outgoing question; every opponent incoming question/Yes/Nope bubble |
| `appearance.requestGiveHoldMs` | 4000 | Settled opponent request to automatic gift; includes highlight delay, matching-slot tap ends it sooner |
| `appearance.requestHighlightDelayMs` | 500 | After settled opponent request, before matching slot highlights/enables |
| `appearance.requestHoldMs` | 900 | Two different purposes: unsatisfied opponent request before Go Fish is enabled; Yes reply's settled reading pause |
| `appearance.replyDissolveMs` | 300 | Settled Yes reply fades before candy transfer |
| `appearance.giftPulseMs` | 480 | Source emphasis before all four candy routes |
| `appearance.giftTravelMs` | 1400 | All four candy routes, including concealed opponent draws |
| `appearance.giftEasing` | `cubic-bezier(0.55, 0, 0.85, 0.55)` | Slow-start accelerating candy travel |
| `appearance.travelMs` | 650 | **Unused legacy field**; not the actual post-transfer wait |

`requestHoldMs` should become separate named settings for Yes reading time and failed-opponent-request readiness, initially both 900. Their values currently match but their purposes differ. Remove `travelMs` only in the later refactor after checking references; it should not be repurposed silently.

### Hardcoded waits and infrastructure

| Location / use | Value | Recommendation |
| --- | ---: | --- |
| `waitActive` poll | 40 | One scheduler setting; use actual active elapsed time rather than counting nominal ticks |
| `playVisual` poll | 40 | Same scheduler policy; native completion must remain authoritative |
| `resolveRequest`, transfer with no set | 650 | Named post-transfer reading/settling delay |
| `resolveRequest`, no pending draw branch | 1100 | Named fallback/turn-pass message hold; exceptional branch, not normal empty-dish ending |
| `drawCandy`, opponent fishing announcement | 500 | Named announcement-to-source-pulse delay |
| `drawCandy`, draw with no set | 1100 | Named post-draw result hold |
| Set celebration | User-controlled | Continue/outside tap; no timed auto-dismiss |
| Rules, New Game confirmation | User-controlled | Pause presentation until dismissed; no timed auto-dismiss |
| Game-over banner | User-controlled | Stays visible until New Game |

The 650ms post-transfer wait is a literal unrelated to the identically valued obsolete JSON `travelMs`. Likewise the 500ms fishing announcement is separate from the configurable 500ms requested-slot highlight delay.

## Motion profiles and hardcoded effects

### Source emphasis — `emphasizeGift`

- Shared by opponent pile, human slot and Candy Dish. Gold border/glow comes from CSS `.giving` rules and is not an independently timed fade.
- Duration 480ms; easing hardcoded `ease-in-out`.
- Keyframes: scale 1 → configured `giftPulseScale` (1.14) at 32% → 1 at 65% → hardcoded 1.06 at 82% → 1.
- Reduced motion uses a 120ms stationary animation, retaining the CSS glow.
- Source class is removed after completion. A full `render()` rebuilds slot classes, so opening a dialog during a source pulse can remove the slot's `.giving` style even while its native animation remains paused. Preserve presentation state separately in a refactor.

Centralize duration/easing, pulse peaks and offsets in one emphasis profile. Keep source identity independent of the profile.

### Player question departure — `sendPlayerRequest`

- Starts at the clickable question bubble and targets the center of the opponent portrait.
- Duration 2500ms; hardcoded `ease-in-out`, `fill: both`.
- Start: full size, opacity 1. At 75%: 80% of distance, scale 0.55, opacity 0.85. End: destination, scale 0.15, opacity 0.
- The original button is hidden and emptied after its contents are cloned. Only the flying copy owns the outgoing question.
- Input locks during travel. The engine request and opponent reply happen only after arrival/removal.
- Reduced motion: 100ms opacity fade without spatial travel.

Centralize the speech travel duration/easing, departure trajectory checkpoints and shrink/fade values. Preserve the cleanup order that prevents the original question flashing back.

### Opponent arrival and replies — `presentOpponentSpeech`

- Starts at the opponent portrait and targets the stationary message position beside the dish.
- Duration 2500ms by default; hardcoded `ease-in-out`, `fill: both`.
- Start: at portrait, scale 0.15, opacity 0. At 65%: 32% of original distance remains, scale/opacity 0.8. End: normal size, opacity 1.
- Stationary message is hidden before construction/measurement. Flying copy has transparent underlying opacity. It is hidden/removed before its effect is cancelled; then the stationary copy becomes visible.
- Opponent question: after arrival, wait 500ms before enabling/highlighting a matching human slot. That is part of the four-second gift countdown, not an extra delay. The rest waits for tap or timeout. If the human lacks the candy, hold 900ms, enable Go Fish, and retain the question until the human responds.
- Yes reply: arrive → hold 900ms → fade 300ms using hardcoded `ease-out` → clear the bubble → source pulse → candy transfer.
- Nope reply to a human request: arrive, then stay until the human draws. There is no finite reading hold before enabling that draw; the indefinite interaction supplies reading time.
- Reduced motion: arrival 100ms, Yes fade 100ms; reading and automatic-action waits remain unchanged.

The long positional/boolean argument list mixes question, Yes and Nope policies. Replace it later with named event profiles/options, such as `opponentQuestion`, `yesReply`, `nopeReply`; they should still use a shared motion implementation. Departure and arrival shapes differ deliberately and need not use identical keyframes.

### Candy travel — `fly`

All routes share this function:

| Route | Source | Destination | Artwork |
| --- | --- | --- | --- |
| Opponent → human | Opponent pile | Matching human slot | Identifiable candy |
| Human → opponent | Matching human slot | Opponent pile | Identifiable candy |
| Dish → human | Candy Dish | Matching human slot | Identifiable candy |
| Dish → opponent | Candy Dish | Opponent pile | Neutral wrapper; draw stays private |

- Travel lasts 1400ms with configured accelerating easing.
- Samples a quadratic curve into 41 frames; side bend is `giftArcVw: 22`. Control point is half the displacement, bent left/right according to horizontal direction. Same vertical midpoint for every route.
- Visible artwork box is `giftWidthVw: 22` by `giftHeightVw: 17`; hidden wrapper uses half the configured width as height (22 × 11vw).
- Starts at the candy's configured rotation and ends upright; hidden wrapper uses no rotation.
- `giftDissolveStart: 0.82` starts fade/shrink in the final 18% of **path progress**. Scale ends at 0.55 via hardcoded shrink amount 0.45. Nonlinear easing means 18% path progress is not necessarily 18% elapsed time.
- Reduced motion is an 80ms stationary fade; source emphasis still runs first.
- CSS flying-art width/height defaults are overridden by the inline configured sizes. Shadow, wrapper styling and z-index remain in CSS. There is no per-route timing override.
- Engine transfer/draw happens after source pulse and before travel; visible counts/slots are normally refreshed after travel. Dialog `render()` during travel can expose updated counts earlier. A later refactor should explicitly separate model state from staged presentation state if strict visual sequencing is required.

Centralize travel profile, frame count, end scale, concealment dimensions and easing. Keep asset rotation/slot art in candy data. Preserve private draw art and all four routes.

### CSS motion

| Selector / effect | Timing | Current coordination |
| --- | --- | --- |
| Portrait halo pseudo-element opacity | 350ms, CSS default `ease` | Triggered by turn class; does not use JS loop |
| Portrait shadow/border | 350ms, default `ease` | Same turn class |
| Name shadow | 350ms, default `ease` | Same turn class |
| Player-half background/shadow | 400ms, default `ease` | Same turn class |
| Go Fish entrance | 450ms, `ease-out` | CSS when button becomes visible; 0.85/0.5 scale/opacity → 1.06 at 65% → 1 |
| `.active .turn-label`, `arrive` keyframes | 450ms, `ease-out` | Dormant: current HTML has no turn-label element |
| Reduced-motion override | 1ms | CSS transitions/animations only; JS uses its own 80/100/120ms policies |

CSS effects do not pause with `overlayOpen`. Go Fish is hidden while Rules is open because its disabled/hidden state follows the dialog, so closing Rules can replay its entrance animation. Glow/board transitions can continue behind dialogs. These are short decorative effects, but the policy should be explicit rather than accidentally different from speech/candy motion. CSS animations may use `animation-play-state`; transitions need a deliberate separate approach or can remain decorative.

Selection/highlight changes, completed-set checkmarks, badge changes, dialog appearance and game-over appearance are immediate style/DOM changes, not timed animations. Celebration art is static. There is no confetti or timed celebration entrance. Old `#centerCircle > img` CSS is unused by current rendering, since requests only show candy in quote bubbles.

## Interaction sequences to preserve

Times are nominal active time; slow timers and polling can lengthen waits. User interruptions and celebrations are noted explicitly.

| Event | Sequence |
| --- | --- |
| Human selects candy | Show question and highlight selection → wait up to 4000ms, or tap → outgoing question 2500ms → resolve request |
| Human request succeeds | Outgoing question finishes → Yes arrives 2500ms → reading hold 900ms → fade 300ms → opponent pile pulse 480ms → engine transfer → candy travel 1400ms → render → 650ms result hold or set celebration → human chooses again |
| Human request fails | Outgoing question finishes → engine records failed request → Nope arrives 2500ms → enable dish and retain Nope → await draw tap |
| Opponent asks, human has candy | Thinking 1000ms → question arrives 2500ms → 500ms delay → matching slot lights/enables → remaining 3500ms or tap → human slot pulse 480ms → engine transfer → travel 1400ms → render → 650ms result hold or celebration → opponent thinks/asks again |
| Opponent asks, human lacks candy | Thinking 1000ms → question arrives 2500ms → 900ms hold → enable Go Fish and retain question → await response tap |
| Human fishes | Tap dish → source pulse 480ms → engine draw → visible travel 1400ms → render → 1100ms result hold or set celebration → next turn / game end |
| Opponent fishes | Tap Go Fish → announcement wait 500ms → dish pulse 480ms → engine draw → private wrapper travel 1400ms → render → 1100ms result hold or celebration → next turn / game end |
| Set earned | Render completed goal/count → celebration waits for Continue/outside tap → resume original turn/end sequence |

The final draw's possible set is collected before scoring; the final earned set celebrates before the result banner. Preserve these rules when reorganizing presentation code.

## Timing and lifecycle risks discovered in the survey

1. `waitActive` accumulates 40ms per completed poll, not actual elapsed active time. A 170ms delayed poll still counts as 40ms, so holds stretch under load. Split holds round separately: 500 becomes 520 and 3500 becomes 3520 at nominal poll cadence. Use an active-time clock based on monotonic timestamps, excluding paused intervals.
2. `playVisual` currently observes native completion but also maintains a nominal-tick duration cutoff. That creates two sources of completion truth. Prefer native animation completion for visual effects; a scheduler should manage pause/cancel, not replay/finish a completed animation to match a counter.
3. The recent repeated-play bug is already fixed: resume only `paused`, exit when `finished`. This must be an invariant in the future controller. Delayed timers previously restarted an outgoing question three times in the regression test.
4. Speech cleanup policies differ from permanent-element effects. Temporary speech is removed before effect cancellation; permanent Yes fade is hidden/cleared before its cancellation; source pulses use class cleanup; candy travel is removed after the controller returns. Give cleanup explicit policies instead of a positional `removeTarget` boolean.
5. Generation tokens stop old-round callbacks, but cancellation is checked on the next poll. Replacement timers also end through a polled predicate. A shared cancellation mechanism can make this immediate and prevent old presentation effects from touching a new round.
6. Dialogs pause native movement and waits, but full `render()` rebuilds imagery/classes and counts. Minimize presentation reconstruction or preserve active effect state when opening/closing dialogs. A pause should not accidentally replay an entrance or remove a source glow.
7. There is no timeout for user-controlled celebrations. If a new round is started while a celebration promise waits, its promise is not explicitly resolved/cancelled; generation checks after it eventually resumes are protective but not a complete cancellation lifecycle.
8. Reduced-motion choice is queried separately at each effect. A unified policy should select motion reductions consistently while keeping reading waits intact. Changing OS preference mid-action needs an explicit next-action policy.
9. Test `verify-browser.cjs` accelerates all `setTimeout` calls to 2ms. That exploits nominal tick counting and will not remain a reliable speed mechanism after switching to actual elapsed time. Move test acceleration into the proposed configuration/controller; keep real-time/throttled checks separately.

These are survey findings, not changes made by this task. Some require a decision about behavior; centralization should not silently change the pacing.

## Proposed central configuration

Use one `presentation` object in the existing JSON, grouped by purpose. Names below are proposals; initially preserve all current effective values.

```text
presentation
  motion
    speed                     global visual-motion multiplier, initially 1
    speech
      travelMs, easing
      arrival checkpoints / departure checkpoints
      replyFadeMs, replyFadeEasing
    candy
      travelMs, easing, arcVw, samples, dissolveStart, endScale
      widthVw, heightVw, hiddenHeightRatio
    emphasis
      pulseMs, easing, scale peaks / offsets
    turn
      portraitMs, boardMs, easing
    goFish
      entranceMs, easing, scale / opacity checkpoints
    reduced
      speechMs, pulseMs, candyMs, fadeMs, cssMs
  pacing
    speed                     optional separate playback/read pacing multiplier, initially 1
    opponentThinkMs
    playerQuestionAutoSendMs
    opponentQuestionAutoGiveMs
    matchingSlotHighlightAfterMs
    yesReplyReadMs
    opponentMissReadyMs
    opponentFishingAnnouncementMs
    afterTransferMs, afterDrawMs, fallbackTurnPassMs
  artwork
    speechScalePercent        relative to grid, per-candy rotation inherited
    speechFrameWidthVw / heightVw
  scheduler
    pollMs                    if polling remains necessary
```

Visual speed should adjust motion durations; reading/automatic-action pacing should remain independently controllable. A single optional overall playback speed can apply both categories intentionally, especially for tests, without disguising what it changes. Validate nonnegative finite values, sensible fractions/geometry, and highlight delay ≤ auto-give delay. Snapshot the selected profile for an action so live edits cannot alter its settings halfway through.

The top of the program can expose a readable normalized `presentation` setup, plus `applyPresentationCssVariables(...)`. It should read the authoritative JSON, not require users to update both JS and JSON. Candy-specific enlargement and rotation remain in `candies[].display`; they are asset properties, not global time controls.

Keep colors, borders and ordinary layout CSS in styles unless there is a concrete tuning need. Centralizing motion does not require moving every visual property into JSON. The shared quote shape and art frame are useful shared presentation styles.

## Proposed implementation structure and order

1. Save a local pre-refactor checkpoint when implementation begins. `5c49271` is an earlier checkpoint before removing center request candy, not a snapshot of all current timing fixes.
2. Create normalized named motion/pacing profiles from JSON; migrate literal waits, easing, reduced-motion values and CSS motion durations without changing intended values. Remove dormant/legacy motion after confirming it is unused.
3. Replace duplicated ticking with one pause/cancellation controller. Use native completion for motion and actual active elapsed time for waits. Preserve remove-before-cancel and never replay completed animations.
4. Have event sequences call named steps: question arrival, reading hold, reply fade, highlight readiness, source emphasis, candy travel, result hold. Keep explicit ordering; no speech/candy parallelism where John requires reply first.
5. Replace `presentOpponentSpeech` positional policy flags with named profiles/options. Separate reusable visual transport from the game decision/state logic.
6. Map CSS timing/easing to variables and decide which decorative effects pause. Keep shell/drawer behavior unchanged unless separately requested.
7. Update test acceleration; verify all four transfer routes, both players' requests, manual vs automatic continuation, selection replacement, local pause, new-round cancellation, last-draw set collection, reduced motion, and the exact Red Vines flash regressions under timer throttling.
8. Review pacing on an actual iPhone, especially incoming/outgoing quote handoffs and grid highlights. Chrome checks do not establish Safari compositor behavior or subjective readability.

No runtime animation code, settings or gameplay were changed by this survey. No commit or push was requested for it.
