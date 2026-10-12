# Go Fish Candy Edition — current state and continuation

**Historical archive.** This accumulated document contains superseded UI/rule descriptions. The replacement [current entry point](CURRENT-STATE-2026-1009.md) and its linked documentation are authoritative for continuation.

Updated October 9, 2026, after screen, ending, animation, and strategy discussions.

This is the starting document for future work in `games/candy-go-fish`. It describes the current implementation and separates future ideas from working features. The original handoff and demo notes are historical context; this document wins where they conflict. The shared [game requirements](../../../README%20-%20game%20design%20requirements.md) remain authoritative, subject to John's explicit pause exception below.

## Checkpoint and publishing

- Current local code checkpoint before removing center request candy: **`5c49271467050efc4d745640ae03b4b3d65b3461`**, message **Checkpoint Go Fish before removing center request candy**. This preserves the speech interactions with requested candy still appearing in the middle.
- Earlier pre-speech checkpoint: **`3c925a8f89f5a3baa343c4cf76432ba4f2bc7865`**, message **Checkpoint Go Fish Candy Edition before request-flow changes**.
- Earlier checkpoint: **`71250d3bc6188b6f76783d02076d08dcca185023`**, message **Candy Go Fish better, still working**.
- Last pushed version: **`85d6360`**, message **Add Candy Go Fish demo in slot 8**. Tristan is reviewing that earlier version on GitHub Pages.
- **John explicitly does not want the checkpoint or later work pushed until he instructs us to do so.** Do not treat his earlier push requests as continuing permission.
- The latest center/art revision and its verification/documentation are uncommitted changes after `5c49271`. No strategy upgrade has been made.

## Working game rules

The base game has ten candy types, three physical copies of each, and five candies initially dealt per player. The remaining twenty go into the Candy Dish. The starting player is random. Complete triples are collected automatically, including any dealt initially. There is no refill.

The human selects a type they currently hold and presses Got any? Selecting a slot alone does not commit a request. A successful request transfers **one** candy, even if the opponent holds two, and grants another request. The requester can repeat the type or choose another type they hold. Completed sets are removed from active hands and cannot be requested.

A failed request allows one draw from the Candy Dish. The human clicks the dish to draw. When the opponent asks for a type the human lacks, the human presses Go fish! before the opponent draws. **Every fishing draw ends the turn**, including a requested-type draw or a draw completing a set.

The game ends when the Candy Dish empties, either active hand empties, or all sets are complete. The final drawn candy is received and any resulting set is collected **before** the result is calculated. If the last draw empties the dish and also completes a set/empties a hand, the displayed reason prioritizes the empty dish. Empty hands are legitimate endings, not situations requiring replacement candies.

Each completed set scores one point. Most sets wins; ties are allowed. The helper reports the human set count, with a short numeric result such as `6–3`. The shell does not record a zero score. No timer, move penalty, or bonus score exists.

## Current screen and interaction

The shell owns Home, the game title, menu, and bottom drawer. Inside the game is a green card-table background with:

- New Game and Rules sit in a self-contained title row inside the game, with the smaller outlined buttons. The purple shell bar retains only its original Home, title and menu controls. The temporary toolbar/helper extension was removed at John's request.
- Opponent header is a single aligned row: set total, circular portrait/overlapping name, and neutral hidden-hand wrapper pile/count badge. Ten fixed goal slots show identifiable candy only when a set is completed. No turn-text label is shown.
- Center uses one message in an unused side position beside the request image or Candy Dish, with no separate instruction above/below it. Normally text sits left; if Got any? occupies the left, text can use the right. Go fish! remains on the right with the failed-request outcome on the left. The unselected human turn prompts Choose a candy from your hand; the human fishing wait prompts No match. Tap the Candy Dish to draw. Selected candy plus Got any? communicates confirmation without another prompt. The portrait glow carries turn ownership; thinking and extra-turn filler messages are omitted. Transfer/draw/set outcomes remain useful feedback. Buttons appear only when available and the dish stays centered.
- Human's ten fixed candy slots with quantities and completed-set checkmarks. Below is the matching row: set total, circular portrait/overlapping name, and decorative wrapper pile/count badge. No turn-text label is shown. The human pile has no click action and is not an animation endpoint; actual human transfers still use the appropriate candy slot.

The default names/portraits are Player (friendly ghost) and Wendy (friendly witch). Names and portrait filenames come from `players` in the JSON. Internal `human` and `wendy` identifiers represent roles and do not imply fixed display names. Names apply to portrait/turn labels, actions, messages, Rules, winner announcement, and final scores.

The active half brightens gently, and a broad yellow halo highlights its portrait and overlapping name. Each name has a separate adjacent set total, without glow styling. The halo changes with the displayed turn and disappears when the game ends; it does not continually pulse. Input locks during resolution. Rules and the cancellable New Game confirmation pause local presentation; generation tokens discard work from abandoned rounds. Native controls support touch and keyboard, focus is visible, dialogs trap focus, and outcome text uses a live region.

### Request-bubble experiment

The human's matching slot no longer highlights during the opponent's question flight. It highlights and becomes tappable 500ms after the settled question (`appearance.requestHighlightDelayMs`), within the existing four-second automatic gift hold. Human selections still highlight immediately on the human's own turn.

The center now always shows the Candy Dish and remaining count during both players' requests. The requested candy appears only in the question bubble, never as a second candy image in the middle. Question bubbles are 32vw wide and use 100% of the grid artwork dimensions with the same candy rotation. Their artwork frame is 18vw tall. These changes supersede the earlier 90% speech art and center-candy reveal behavior; `5c49271` preserves that previous version.

After selecting a candy, the human question now waits four seconds (`appearance.playerRequestHoldMs`) and sends automatically, or sends immediately when tapped. Changing selection restarts the countdown. Local dialogs pause it. Generation/selection checks prevent stale timers and double requests.

Human requests now use the same cream speech box with three rounded corners and one sharper corner. Selecting a held type replaces the old Got any? control with a clickable **[Human name] asks: / Do you have any / [short candy name] / candy image** bubble. Tapping sends that bubble from its position beside the center toward the opponent portrait, shrinking and dissolving at arrival over `requestSpeechMs`. Only after arrival does the request resolve and the opponent reply or transfer candy. Input locks during travel; local dialogs pause it. Names, art scale and rotations are shared with the opponent request bubble.

Latest Go Fish control wording: **You say:** above **NOPE! GO FISH!**. Its fish illustration is removed; the gold emphasis and compact button dimensions remain.

Opponent requests now use separate block lines: **[Opponent name] asks:**, **Do you have any**, **[Candy name]**, then a centered candy image. Names and art come from the configured candy/player data. The Go Fish response control shows **Nope** above **GO FISH!**, retains the small fish illustration and gold emphasis, and uses a smaller 23vw-wide / 22vw-minimum-height shape.

If the human lacks the requested candy, this request bubble and image remain while awaiting **You say: NOPE! GO FISH!**, including after Rules closes. The old “[Opponent] wants … You have none” message is removed. Request art uses JSON `candyDisplay.speechImageScale: 100`, relative to the grid artwork dimensions and including the configured candy rotation. A centered clipped frame and soft shadow keep the art inside the wider bubble.

A cream quote box labeled with the configured opponent name says “Got any [candy]?” It expands and fades in from the opponent portrait while floating to the existing message position beside the dish/request image. Arrival takes 2.5 seconds. When the human has that candy, the settled quote holds for up to four seconds before automatic handover. Tapping the matching human slot during this hold starts the handover immediately; other slots remain disabled, and repeated taps cannot give extra candies. Requests the human cannot satisfy hold for 0.9 seconds. JSON appearance settings are `requestSpeechMs`, `requestGiveHoldMs`, and `requestHoldMs`. No candy changes hands during arrival. Local dialogs pause the animation; reduced motion uses a brief fade.

When the human asks for a candy the opponent lacks, the same animated quote says “Nope. Tap the candy dish to Go Fish!” Drawing is enabled once the quote arrives. It stays until the human draws, including after opening/closing Rules, and replaces the previous plain fishing instruction. Other interactions keep their existing presentation.

When the human asks for a candy the opponent has, “Yes I do” floats from the opponent portrait over `requestSpeechMs` (2.5 seconds), settles for `requestHoldMs` (0.9 seconds), then fades over `replyDissolveMs` (0.3 seconds). After this reply finishes, the opponent pile pulses and the candy transfers to the human. No engine transfer or candy travel occurs during the reply. Local dialogs pause the animations. This replaces the earlier 1.4-second arrival with immediate disappearance.

Real-time browser verification checks arrival, the unchanged hand during the hold, pausing via Rules, and phone placement. `demo-request-speech.png` shows the settled quote. John is reviewing this experiment before further changes.

## Candy artwork and configuration

Each candy now has `longName` and `shortName` instead of a single `name`. Compact requests/status messages use the short name; celebrations, accessibility labels, and request-image descriptions use the long name. Current example: **Life Savers Gummies / LS Gummies**. Other current names are already brief, so both values match. IDs remain independent of naming.

Short names are curated, at most 16 characters, and unique across the catalog ignoring case, spacing and punctuation. `validate-candy-names.cjs` enforces these requirements when `sync-config.cjs` runs and includes rejection checks. Keep variant distinctions and validate the entire future catalog, not just the ten selected types. Do not automatically truncate names. Review future names on a phone as well as checking their character count. The catalog currently still contains ten types; wider candy selection is future work.

The Go Fish! response is styled as an event: a larger golden button with the witch-hat fish icon, bold GO FISH! text, and a brief entrance pop when it appears. It stays in the right-side action position, with the failed-request explanation to the left of the Candy Dish. Reduced-motion settings suppress the entrance motion. The button remains available only when the human needs to tell the opponent to fish.

Only the ten supplied PNGs in `assets/candybar-images/` are used as candy types. Original files are unchanged. The older TXT/JSON data elsewhere in assets is not loaded.

`assets/json/game-config.json` is the editable source for rules, players, catalog, timings, shared candy display settings, per-type overrides, and slot order. `config-data.js` is its generated companion for direct `file://` opening. After changing the JSON, run:

```powershell
node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs
```

HTTP play reads JSON; direct file play reads the companion. Always regenerate it rather than editing two sources manually. See [the data README](../../assets/json/README.md) for individual settings.

Current slot artwork:

- Empty candy identity images have 82% transparency; set `candyDisplay.emptyTransparency` to 100 to hide them completely while retaining the slot.
- Ordinary images use 150% of the original fitting. The six narrow bars use 225%, another 50% enlargement over 150%.
- 100 Grand rotates −15°. 3 Musketeers, Butterfinger, Milky Way, Mounds, and Snickers rotate −30°.
- Images stay centered and crop inside the slot. Badge clipping is separate, keeping quantity/check badges visible.
- Two active copies use offset images plus a number badge. Completed sets show candy, highlighting, and a green checkmark. Opponent unknown slots reveal no active identities.

The layout uses a responsive grid, not stored pixel coordinates. Future positions can be recorded in the JSON; do not assume a position editor already exists.

## Transfers and end-screen presentation

All four movement routes now share the prominent treatment: human → opponent, opponent → human, Candy Dish → human, and Candy Dish → opponent. The source glows/pulses for 480ms, then an enlarged image travels along a curved path for 1400ms. Slow-start acceleration makes it gather speed. During the final portion it shrinks and dissolves into the destination. Timings, size, curve, pulse scale, and dissolve threshold are configurable through the existing gift-named JSON settings, now shared by every route. Counts normally update after travel; local overlays re-render current engine state, so strict display deferral during overlay interruption could be refined later.

The opponent's fishing draw travels as an unidentified wrapper, preserving privacy; its completed set is public if one results. Reduced motion replaces prominent travel with a short stationary fade/highlight. The engine resolves moves once, independently of animation callbacks.

After a move earns a set, play pauses for a celebration dialog with the configured winner name, a large unrotated candy image, and **Collected all 3 [CANDY NAME] candies!** The count uses the actual configured copies per type, supporting future four-copy wording. Continue or a tap outside the dialog dismisses it and resumes the original turn flow. An earned final set celebrates before the game-over banner. Initial sets collected during the opening deal are currently reflected in the board/totals without a celebration. Browser checks exercise both dismissal methods and compare name-adjacent totals with completed slots.

The finished game stays visible. A compact central banner replaces the request buttons and Candy Dish; it does not cover either hand and needs no separate Admire control. It shows:

- Winner using the configured name, or a tie.
- Reason, e.g. **Wendy ran out of candies**.
- A separate second reason line for hand-empty endings: **Candy Dish had 1 candy left.** or **Candy Dish had 2 candies left.** It is omitted for other ending types.
- Score, e.g. **Player had 6 candy sets; Wendy had 3.**
- A smaller New Game button, which deals immediately from this finished state. Its transparent hit area remains at least 13vw tall; the visible button is smaller so the reason/score text has more space.

Other reasons are **Candy Dish ran out of candies.** and **All ten sets are complete.** Player-facing language uses candy/candies throughout.

## Opponent strategies

### Implemented strategy — Beginning (+) classification

The strategy receives only the opponent's own type-only hand and memory built from public observations. It does not receive the human hand or dish order. The engine separately accesses both hands to enforce moves; UI-visible quantities do not become strategy input.

Current choice is weighted random over held types: remembered human possession has weight 8, remembered absence 0.3, and an unknown type 2. Holding exactly two multiplies the weight by 1.8. These are heuristic weights, **not calculated probabilities**. Current code already uses some memory; the proposed 0% beginner memory has not been implemented.

Human requests and candies transferred to the human mark possession. A failed opponent request marks absence. A human draw clears absence evidence without disclosing its identity. Completed sets clear related clues. Receiving one candy from the human clears known possession of that type, even though the human might still have another. There is no required repeat request.

John's example: Wendy requests Snickers while holding one; the human holds two and gives one. Wendy now has two, the human one. Wendy sometimes switches requests, misses, and hands the turn back. The human can then request Snickers twice and take the set. Record this behavior as **Beginning (+)**, and the stronger follow-up below as a higher level.

### Proposed stronger follow-up — ++ / +++

After receiving a candy without completing a set, favor asking for that type again, especially when one short of completion. Consider the immediate scoring opportunity and the risk of exposing a near-complete group before giving the human another turn. In John's example, the repeat wins the set. From the opponent's limited knowledge, receiving one does not always prove the human still holds another; the remaining copy could be in the dish. Use public evidence rather than cheating.

### Proposed memory levels

John suggests **0% / 50% / 100%** remembrance for **+ / ++ / +++**. ++/+++ may additionally always remember a candy directly given to the human until later evidence invalidates that knowledge. Clarify whether that guaranteed direct-transfer memory overrides the general percentage.

Define forgetting consistently: chance to store a clue when observed, or chance to lose a stored clue on relevant later moves. Avoid independently resampling an old fact on every decision, which could make forgotten information reappear. Perfect memory means perfect recall of public observations, not knowledge of hidden draws. Transfers and completed sets update/invalidate clues; unknown draws weaken absence evidence.

### Proposed probability and value calculations

John suggests estimating the percentage chance of obtaining a type from the human's hand or the Candy Dish, then valuing the outcome. Distinguish these questions:

- **Request success:** probability the human holds at least one of the chosen type. The human does not supply a random candy; a successful request transfers one matching copy.
- **Dish draw:** estimated proportion of that type in the dish, based on known counts and plausible hidden allocations. A fishing draw is from the shuffled dish, not a request for a particular type.
- **Decision value:** immediate set completion, progress toward a set, another request after success, ending the turn after fishing, and revealing a vulnerable holding to the human.

Start with the configured copies per type, subtract the opponent's known holdings and publicly completed sets, and use remembered public evidence to constrain possible human/dish allocations. Track uncertainty or plausible allocations instead of treating invisible quantities as facts. Evaluate probabilities from that belief model; no access to actual hidden counts or dish order. A dish match never grants another turn under these rules, though it may finish a set. The last dish draw ends the game after set collection, making late-game scoring especially relevant.

Every strategy must support **sets of three or four**. Use the configured set size for remaining-copy counts, distance to completion, and value calculations. Prefer `held === copiesPerType - 1` over hardcoded pair logic. The current `quantity === 2` heuristic and two-image UI are triple-specific and need revision before a four-copy variant is offered.

### Proposed selector and variations

Arrows near the opponent would cycle **+**, **++**, **+++**. This selector is a future in-game control, not an implemented feature or shell binary switch. Decide whether a level applies at the next deal or can change mid-round.

Other future switches: ten/eleven types and sets of three/four. Eleven prevents ties only when all eleven sets are actually claimed. Because the game also ends on an empty hand/dish, **an eleven-type variant could still tie in its current ending rules**. It needs an extra asset/slot and scoring review. Four-copy sets need quantity presentation, strategy, and tests beyond merely changing the JSON number. Neither variation is validated or available in the demo.

## Scaffold integration and remaining work

The registered full title and shell `short_title` are both **Go Fish Candy Edition**, in **slot 8**, bottom right, with the local witch-hat fish SVG. The purple banner displays that full name. The original Game 8 placeholder is benched by an empty slot value. `games.json` includes metadata and instructions. The shell helper handles score reporting; no custom parent messaging/storage bridge exists.

The shell currently displays/remembers up to three binary game switches, but the helper exposes no settings-read or audio API. Working shell variations require coordinated helper/app/requirements changes. Ordinary menu registration does not require app-code changes. John withdrew the purple-bar control request and directed that the game remain self-contained. The temporary toolbar callbacks, shell controls, styles and helper methods have all been removed; shared files are restored to the checkpoint. Score reporting remains the existing supported helper call. When John authorizes another publication, update all three cache version stamps per the repository convention before pushing.

At John's direction there is no dedicated Pause button despite automatic opponent moves/animation. There are no timed penalties. The opponent can make a bounded sequence of successful requests while the drawer covers the lower board, then waits for human interaction. The shell does not notify or pause the iframe. The game README records the rule-18 exception; formalize it before release if necessary. Local Rules/New Game dialogs still suspend presentation.

## Verification and next steps

Before animation standardization, read [Animation and timing survey](ANIMATION-SURVEY-2026-1009.md). It inventories current JSON/hardcoded timing, motion profiles, CSS effects, per-event sequencing, pause/cancellation issues, and a proposed single presentation configuration. This survey changes documentation only; implementation is a later step.

Root restart fix: `playVisual` previously called `animation.play()` on every timer tick, including after the browser had already finished the animation. Under delayed timers this restarted an outgoing question three times in the regression check, explaining old-position flashes and incoming boxes flashing after settling. The loop now exits on `finished`, resumes only `paused` animations, and pauses only when needed. `verify-speech-redraw.cjs` throttles speech timer ticks to 170ms and checks outgoing questions, incoming replies, and an incoming opponent question for zero completed-animation replays.

Follow-up handoff fix for John's Red Vines report: clear the original player question immediately after cloning it for travel. For both incoming/outgoing speech, hide and remove the flying element before cancelling its animation, rather than finishing a still-mounted speech layer. `verify-speech-redraw.cjs` now deals legal Red Vines scenarios for both Nope and Yes replies and samples rendered-frame DOM visibility to ensure the original question stays gone and the stationary reply remains hidden during arrival.

Speech redraw fix: browser instrumentation reproduced the old cleanup cancelling a live filled animation and restoring an opaque bubble before removal. `playVisual` now finishes valid animations in their final state; abandoned animations still cancel. Speech clones have transparent underlying opacity and fill both ends of the animation, and stationary speech content is hidden before it is built/measured. This prevents an unanimated box flashing during departure/arrival. `verify-speech-redraw.cjs` checks outgoing questions, settled Nope replies, and dissolving Yes replies; the prior code fails its opaque-cancellation check.

Latest code checks passed: engine scenarios including final-draw set collection, 1,000 deterministic simulated games, browser fit/targets at 338 × 526 and 547 × 850, full UI round, replay, Rules, file opening, alternate Casper/Hazel names, and a result banner leaving both hands uncovered. Earlier shell checks verified the fish icon/menu/iframe at iPhone size. Screenshots beside the scripts are development artifacts; the finish screenshot may intentionally show alternate test names.

Functional checks do not establish enjoyment, optimal strategy, or ideal pacing. Continue John's review of the board and animations. Before strategy changes, settle the difficulty/memory design, implement it behind the restricted-information interface, and compare behavior through repeatable scenarios and human play. Keep the base ten/triple game stable while reviewing stronger opponents. Document implemented changes separately from these ideas, and **do not push without John's instruction**.
