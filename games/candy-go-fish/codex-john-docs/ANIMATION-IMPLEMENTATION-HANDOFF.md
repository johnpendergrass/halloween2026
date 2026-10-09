# Animation standardization — implementation handoff

Prepared October 9, 2026 for the next developer/AI. John requested a thorough survey before implementation, then this handoff and comprehensive game docs with a local commit. **The centralization has not been implemented.** Do not infer permission to push or change gameplay from this document.

## Objective and starting point

Make motion/pacing easy to tune globally and make animation lifecycle consistent across questions, replies, candy icons, source highlights and CSS effects. Preserve the current interface, sequencing and restricted-information rules. Start with [current state](CURRENT-STATE-2026-1009.md), then the [complete animation survey](ANIMATION-SURVEY-2026-1009.md). The survey contains every current value, hardcoded checkpoint and event sequence; it is the detailed inventory supporting this plan.

The baseline is the local commit titled **Document Candy Go Fish and hand off animation standardization**. Find its hash in Git history or the chat's final response. Before a future refactor, inspect the actual working tree and make a new checkpoint if newer changes exist. Earlier `5c49271` does not include all current flash/highlight/Yes-reply fixes.

## Invariants to preserve

- Center remains the Candy Dish in every request; candy image belongs only in the quote bubble.
- Both question boxes use the shared three-rounded/one-sharper-corner design and full grid art sizing/rotation.
- Human selection waits four seconds or bubble tap, reselection restarts it, then question travels to opponent before response.
- Opponent question arrives before highlighting the human's matching slot; highlight/tap enable is 500ms after settling, within the four-second auto-gift wait.
- Yes arrives for 2500ms, holds 900ms, fades 300ms, then source pulse and candy transfer. No overlapping candy transfer during the reply.
- Nope/question remains while awaiting the human's relevant draw/Go Fish action.
- Every candy route uses the same source pulse and travel treatment; opponent draw remains a neutral private wrapper.
- Successful request transfers one candy and retains turn. Any fishing draw ends turn. Final possible set resolves before game result.
- Set celebration waits for human dismissal; no automatic disappearance. Result banner leaves both hands visible.
- Native effects resume only from paused state. Never call `play()` on a completed animation; timer lag must not restart anything.
- Hide/remove temporary speech before cancelling its effect. Original outgoing question is emptied once cloned. Stationary incoming content stays hidden until arrival. Permanent fade content is cleared/hidden before effect cancellation.
- Local dialogs pause motion and waits; generation changes invalidate old work. Do not add a shell toolbar/helper or rely on drawer notifications.

## Implementation stages

### 1. Establish and verify the baseline

Run naming validation, engine checks, full UI round, real-time speech/highlight tests and throttled Red Vines redraw checks. Record the starting commit and current timing values. Review the phone screenshots and, when available, the same transitions on iPhone Safari. Preserve a rollback point before modifying runtime code.

### 2. Introduce one authoritative presentation setup

Keep editable values in `assets/json/game-config.json`. A clearly labeled setup section near the top of the UI should normalize/validate that data and derive effective profiles and CSS variables. Do not maintain a second editable set of timing values in JavaScript. Regenerate `config-data.js` for file opening.

Use the survey's proposed `presentation.motion`, `.pacing`, `.artwork`, `.scheduler` groups, or an equally clear schema. Include currently literal waits, easing, keyframe checkpoints, reduced-motion durations and CSS timing. Preserve effective baseline values first.

Separate movement speed from reading/automatic-action pacing. Initially both multipliers are 1. If an overall test/playback speed is supplied, apply it explicitly to both categories. Reading holds should not shrink simply because someone wants faster candy travel.

Split the existing shared `requestHoldMs` into independently named Yes reading and failed-opponent-request readiness fields, initially both 900ms. Give names to 650ms post-transfer, 1100ms post-draw/fallback and 500ms fishing-announcement delays. Remove unused `travelMs` after confirming references. Per-candy fitting/enlargement/rotation remain asset data.

Validate finite nonnegative durations, positive speed multipliers, fractions in range, ordered checkpoints, geometry and highlight delay ≤ auto-gift delay. Decide whether configuration edits apply only to the next action; recommended: snapshot each action's profile so a pending sequence does not change halfway through.

### 3. Replace nominal tick counting with a shared controller

Provide one pause/cancel lifecycle for waits and native effects. Waits should use actual monotonic elapsed active time, subtracting dialog pauses, instead of adding 40ms per timer tick. Motion should follow native completion; an elapsed tick counter must not finish, replay or restart it to catch up.

Use a cancellation handle tied to the round/action and selection replacement. Complete/cancel abandoned waiter promises, including celebrations if a round is replaced. Ensure temporary layers are removed immediately or predictably, and old effects cannot hide/clear a new round's message. Use explicit cleanup policies for temporary layers, permanent message fades and source emphasis.

Keep the no-replay fix under delayed timers. `animation.finished` rejection on cancellation must be handled if used; avoid unhandled rejections and detached cleanup touching new state. Pause/resume changes should occur on state transitions, not repeated calls every tick.

### 4. Define reusable effect profiles

- Speech departure: full question at its resting spot → opponent portrait → shrink/dissolve.
- Speech arrival: portrait → resting spot → full size/opacity.
- Speech exit: readable settled reply → fade → clear safely.
- Source emphasis: CSS glow plus configured pulse shape.
- Candy transport: shared curved path, acceleration, rotation-to-upright and end fade/shrink; identifiable or private-wrapper art.
- Decorative turn/Go Fish effects: shared configuration with an explicit pause policy.

Direction and cleanup are options of reusable effects; outcome decisions remain in gameplay coordination. Replace positional flags in `presentOpponentSpeech` with named options/event profiles. Keep actual event order readable at the call sites.

### 5. Move CSS motion settings onto the same setup

Expose portrait/board transition durations, easing, Go Fish entrance timing/keyframes and reduced-motion policy via CSS variables or the controller. Decide whether these decorative effects continue while dialogs are open. Avoid Go Fish entrance replay just because Rules toggled its hidden state. Remove dormant turn-label animation and obsolete center-image styling only after verifying no current use.

Keep ordinary colors/layout in CSS unless tunability requires them. Do not move every dimension into JSON simply to centralize animation. Shared quote/art-frame presentation may be configured together when useful.

### 6. Preserve staged presentation during rendering

Opening Rules currently performs a full `render()` that can rebuild images, strip slot glow classes and expose already-mutated model counts during travel. Define which state owns displayed quantities and active emphasis. Either preserve active effect state through rendering or isolate rendering from native-effect targets. Do not silently change when engine actions occur; keep rules pure and presentation staged once per accepted action.

### 7. Migrate tests and complete acceptance checks

The fast full-round test monkey-patches `setTimeout` to 2ms. That assumes nominal tick counting and will cease to represent controlled acceleration with real elapsed time. Replace this mechanism with configuration/controller speed or a controllable test clock. Keep separate real-time and delayed-timer regression checks.

Required checks:

| Area | Acceptance |
| --- | --- |
| Baseline rules | Existing engine scenarios and 1,000 simulations remain unchanged |
| Human request | Tap and auto-send both work; reselection resets wait; only one question/engine action |
| Opponent request | No early highlight; 500ms settled delay; tap or four-second auto-gift |
| Replies | Yes arrival/hold/fade precedes transfer; Nope remains until draw |
| Four routes | Both transfer directions and both dish draws use correct source/destination/art |
| Privacy | Opponent draw stays unidentified; strategy has no hidden-state access |
| Pause | Rules/New Game pause each wait/effect; no jumps/replayed entrance on resume |
| Cancellation | New round/selection replacement leaves no old overlay, source class, waiter or state mutation |
| Delayed timers | Outgoing Red Vines, Yes/Nope replies and incoming opponent question do not restart/flash |
| Reduced motion | No large travel/pulse; reading time remains useful; same event order |
| Endgame | Last draw set before result; final celebration before result; hands remain visible |
| Layout | Existing 338×526 and 547×850 checks, touch targets, file opening, alternate names |
| Device review | iPhone Safari speech handoffs/highlight/readability checked when available |

Update survey/current docs and configuration README to the final implementation, including what was intentionally left out. Run relevant checks once per coherent stage; repeat only for new changes or failures. Keep a concise validation record.

## Decisions to make during implementation

Recommended defaults are recorded above, but these are not implemented features: motion versus overall playback speed; decorative CSS pause policy; whether tuning is next-action-only; profile naming/schema; whether staged UI counts warrant a separate presentation model. Resolve routine details consistently with current behavior. Ask John only when a choice would materially change gameplay/presentation he has not already specified.

Do not introduce difficulty levels, new candies, 11/4 variations, audio or shell settings integration in this refactor. Those have their own requirements. Current shell constraints and John's Pause exception remain documented in [integration](INTEGRATION-AND-VERIFICATION.md).

## Completion and Git

When implementation is actually requested, complete the stages and acceptance checks, document the result, and create a local checkpoint as authorized. **Do not push** until John explicitly asks. The present documentation task commits the current implementation and this plan; it does not execute the plan.
