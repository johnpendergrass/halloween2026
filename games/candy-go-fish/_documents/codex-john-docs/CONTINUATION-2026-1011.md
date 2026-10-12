# Candy Go Fish — current handoff, updated October 12, 2026

Current October 12 implementation and folder layout: [current handoff](CURRENT-STATE-2026-1012.md). Earlier paths, prototype strategy descriptions and preview instructions below are historical where superseded.

This is the authoritative current-state entry point. Overall gameplay is acceptable; appearance work is ongoing. Historical design notes and checkpoint copies record alternatives and must not override this handoff.

John's documentation convention: every new folder summarizing a topic must include an obvious _START-HERE.md (or similarly clear index) with a short reading guide and links to its contents. The main _documents folder and strategies-development folder now have these entry points.

October 12 strategy cleanup supersedes all older opponents-folder references: the root opponents folder is removed. Live modules are now in js/strategies and js/shared, selected by js/strategies.js. Historical experiments and simulation code were deleted at John's request. See [development and implementation](../strategies-development/DEVELOPMENT-AND-IMPLEMENTATION.md) for the detailed retained summary, accepted parameters, measured results and compact validation evidence. Gameplay algorithms are unchanged. Cache stamp: 2026-1012-candy-strategy-cleanup.

October 12 documentation organization: codex-john-docs and all design ideas contents now live under the game's _documents folder. Markdown links and verification/config script imports were adjusted for the extra directory level. Windows still holds the original design ideas directory open; it is empty and can be removed after the external lock releases. Runtime game paths are unchanged.

October 12 script organization: all five runtime JavaScript files now live in js/: candy-go-fish.js, candy-piles.js, game-engine.js, computer-player.js and strategies.js (adapter moved from opponents/strategies.js). Specialized opponent modules stay in opponents/strategies and opponents/shared. HTML script URLs, Node imports, simulation source-hash paths and current verification scripts were updated. Asset/fetch URLs still resolve against index.html. Current cache stamp: 2026-1012-candy-js. Historical checkpoint copies retain their original structure.

October 12 root cleanup: deleted obsolete pile-preview.html/css/js, portrait-preview.html, portrait-size-demo.html/css and demo.html wrappers. Use index.html or the application shell for the current game. The maintained portrait CSS fallback remains in codex-john-docs/portrait-layout-checkpoint-2026-1012/. Asset verification now checks the live entry point only. Older preview URLs in historical notes no longer exist.

October 12 asset cleanup supersedes older paths: portraits now use assets/opponent-icons/RON.png, HARRY.png and HERMIONE.png; the player's ghost is in assets/player-icons/friendly-ghost.svg. Unused asset variants and obsolete catalog data were deleted; active images have simple descriptive filenames. The old opponents/icons copies were removed. Cache stamp: 2026-1012-candy-assets. See [cleanup record](ASSET-CLEANUP-2026-1012.md). verify-assets.cjs confirms all runtime/config/menu assets exist and no unused asset files remain except config documentation. Browser layout, full round, replay, file opening and opponent switching checks passed. The portrait CSS fallback has updated asset paths.

October 12 calibrated strategies supersede the prototype notes below: Ron remains weighted random, Harry uses calibrated immediate scoring, and Hermione uses 1,024 temporal hidden-card hypotheses and scoring (not full-round rollouts). All are installed locally; no commit/push requested for this work. Over 100,000 simulation games include 40,000 fresh validation games. Harry beats Ron and Hermione beats Harry clearly for both set sizes and starting orders. See [the validation report](../../opponents/_documents/ABILITY-REPORT-2026-1012.md). Browser checks cover all profiles, both set sizes, switching, full rounds, replay and candy transfers. Current cache stamp is 2026-1012-candy-abilities. John accepted these strategies; further strategy explanation is unnecessary. A Hermione self-play study separately measures starting advantage.

Latest local strategy work (not published): icons moved to opponents/icons and config/HTML paths updated. See ../opponents/README.md. A paired simulator supports ten types and both 3/4-copy sets. Browser and simulation now use the same beginner/medium/expert prototype policies, with the current profile read at the next decision. Public memory persists on mid-round switching; chosen requests finish normally. Ron preserves the previous weighted-random policy, Harry uses probability/end-game scoring, Hermione uses sampled full-round rollouts. Strength ranking is not established; initial small tests were mixed, particularly quadruples. Policies and simulation still require tuning/held-out evaluation. Earlier descriptions below of all profiles sharing a policy refer to the published checkpoint.

Latest October 12 checkpoint: [larger portrait layout](PORTRAIT-SIZE-DEMO-2026-1012.md) is adopted in production (icons +25%, name text unchanged, pumpkins -15%, grids up 5vw, larger player footer, opponent icon/name up 3vw). One-file CSS fallback is in portrait-layout-checkpoint-2026-1012/. [Opponent selector](OPPONENT-SELECTION-2026-1012.md) cycles Ron +, Harry ++ and Hermione +++ at any time except popups/game-over. Separate supplied character portraits use an 8% inset crop; names are centered over the lower icon. Plus signs are display-only, omitted from speech/results/start messages. All three still share one strategy. Next work is beginner/medium/expert strategies respectively; preserve state/memory on switching and private-information boundaries. Publishing cache version: 2026-1012-candy-opponents.

October 12 opening checkpoint after ba02f79: the [empty-board starter sequence](START-SEQUENCE-2026-1012.md) replaces the initial Let's play dialog. Click the cream prompt over the empty ghost dish, watch a 3.7-second spin settle toward a random actor, then click the winner message above/below the ghost to deal and begin. Initial load, replay and New Game use this sequence. Dialogs pause the spin; reduced motion uses a fade. User requested commit/push of this checkpoint. Opening dish is 250% size, messages approximately 150%, results offset 35.5vw, zero grid badges hidden. Cache version: 2026-1012-candy-start.

October 12 UI update supersedes the footer descriptions below: both score labels now read CANDY SETS. The player's right-side brown/yellow black-cat candy dish is restored, replacing Total candies text. Its live hand-count badge is horizontally centered and lowered to 75% of the dish height to leave the cat's face visible. It is a count display; the player's candies remain in the grid. The restored layout was verified at 338x526 and 547x850: artwork loads, both labels update and the page does not overflow.

## Current board and artwork

October 12 instruction update: "Choose a candy from your hand" appears in a wide cream rounded box centered over the main dish, matching question-box colors/border/shadow without a tail. It disappears immediately on candy selection. Removed the separate "Go fish, Wendy!" announcement and "Wendy draws a candy" status; her private wrapper flight remains. Player draw status remains. Verified popup dimensions, centering, absent tail and selection dismissal at phone/desktop sizes.

- Background: John's `assets/backgrounds/greenBlueGradient.png`, filling the panel. Original green gradient remains underneath and in the background checkpoint. The generated pumpkin scene was rejected and remains unused.
- Main Candy Dish: `ghost-plate-v2-300.png`, 21vw square, with count badge above the pile. Version 1 is retained as a fallback.
- Wendy: green/red witch tray, 20vw by 11vw, with live count badge. Green/red grid dishes are muted until a set is earned; completed sets show the bright dish, named candy and green check.
- Player: brown/yellow grid dishes with named candy and count badges. Zero-count dishes/badges are dimmed without further dimming the candy artwork. Selected/giveable slots have a small yellow rim glow. The brown/yellow cat tray is restored on the right; its count badge is centered horizontally at 75% height, below the face. Both score labels read CANDY SETS. Completed-set badges/checkmarks are 125% of normal badge size.
- Life Savers is the short display name; the full catalog name remains Life Savers Gummies.
- Original, green/red and brown/yellow witch/cat trays remain as artwork options. Plain sage grid dishes and older board files remain available as fallbacks. The restored player tray displays only the count; do not add a generic player pile.

## Persistent candy piles and transfers

`candy-piles.js` tracks decorative wrapper attributes by the engine's unique card IDs. This is presentation only; it does not change the deck, rules or public AI information. The player grid is the player's hand, with no additional generic player pile.

Each new game randomizes attributes once. Ordinary renders preserve survivor positions and appearance. Central draw order is reversed for display so the next engine draw is on top. Wendy's active hand is shown as an ordered pile of generic red bar sprites recolored with CSS. Completed-set cards leave that pile; survivors do not rearrange.

| Setting | Main dish | Wendy tray |
| --- | --- | --- |
| Base candy width | 78% of 21vw dish | 45% of 20vw tray |
| Individual size variation | +/-12% | +/-12% |
| Initial rotation | +/-65 degrees | +/-50 degrees |
| Color intensity | 50% saturation | 50% saturation |
| Brightness | 100%, with +/-4% variation | same |

Seven hue choices are randomized independently of candy identity. Main candy centers are distributed across an ellipse with X spread 22% and Y spread 20% of dish diameter (4.62vw and 4.2vw), centered at (0, +0.7vw). Candy artwork is intentionally not clipped to the dish: the starting pile should overflow the rim a little. `dishPlacement` holds independent X/Y spread and origin parameters. Wendy placement stays in the narrow region below the witch.

When a card enters Wendy's tray, it resizes to her 45% baseline while retaining its original individual size variation, color and rotation. Only Wendy's private Go Fish draw flies a generic wrapper: it snapshots departure width, grows to 150% midway and smoothly shrinks to Wendy's landing width. Its destination wrapper stays hidden until the flight finishes.

Successful requests between players fly the actual named candy image in both directions. The player's Go Fish draw also flies the actual drawn candy image. Named candy flights use the existing configured candy dimensions and 100%-150%-100% motion; Wendy's resting tray stays generic. No private draw identity is displayed in Wendy's wrapper art.

`pile-preview.html` remains a separate locked board comparison (5/5, 15/15, 30/20; middle can switch to 20/5). It exposes sizes, independent main/Wendy rotations, spread X/Y, saturation and brightness. Production pile layers are hidden in its snapshots. Its historical transfer button retains wrapper size; live gameplay now resizes incoming Wendy cards, so the live game is authoritative for transfer behavior.

## Implemented gameplay

Ten candy types, three copies each: 30 total, five initially dealt per player, 20 initially in the Candy Dish. The initial deal cannot complete a set for either player: both start with five candies and zero collected sets. Set-completing cards are skipped during dealing and remain in the dish. First player is random. Request only a currently held type. Success transfers exactly one candy and retains the requester's turn. Three matching candies collect automatically as one set.

Current engine still ends every fishing turn. Good Fish (a set-completing draw retains the turn) was previously approved as a proposal, but is NOT implemented. Do not silently change rules during appearance work.

No hand refill. End on empty dish, empty active hand, or all ten sets collected, with that reason priority. Collect the possible final set before results; earned sets celebrate before continuing, including a final earned set. Most sets wins; ties are possible. Opponent hand identities/private draws stay hidden; AI receives only its hand and public clues.

## Current interaction defaults

Human selects a held candy. The selection highlights until the question is sent, then the highlight clears. The question auto-sends after one second; tapping it sends sooner, and reselection resets the wait.

Questions/replies appear in place in the middle, with 250ms fades and a one-second question reading beat. Slow mode, the Fast/Slow toggle, and portrait-to-panel quote flights are deleted.

| Answer | Both actors |
| --- | --- |
| YES | Question and answer remain for four active seconds after the answer settles, then clear as the candy transfers automatically. Clicking either middle text box or the Candy Dish starts the transfer sooner. |
| NO, GO FISH! | Question and answer remain indefinitely until the player clicks either middle text box or the Candy Dish. That starts one draw for the requester. |

Wendy-request shortcut: if the human holds the requested candy, its slot is enabled immediately during question arrival/reading and the Yes reply/countdown. Tapping that candy immediately hides the texts, interrupts outstanding speech/waits, and gives exactly one candy. Other hand slots are disabled. Repeated taps cannot duplicate an action. Middle acknowledgement targets enable once the answer settles. Rules/New Game dialogs lock interaction and pause waits/native motion; a new deal invalidates old actions.

## Current appearance and motion

Opponent speech settles left, human speech right. Questions are cream (#f5e8c5); Yes replies light green (#cdebb7) with black text and a subtle light shadow; No replies muted coral (#efa39a). All asks:/says: speaker labels have normal weight and inherit the main text color.

All speech boxes have rounded corners and softly curved, wide-base tails: up for Wendy, down for the human. CSS uses local inline SVG masks, with no external asset dependency. Tail base is 8vw and height 4.5vw.

Both answer boxes gently breathe at 4% peak scale: hold natural size for 500ms, ease to the peak over 1000ms, then repeat a one-second peak-to-natural-to-peak cycle. Questions and dish do not breathe. Breathing stops on acknowledgement, auto-transfer, shortcut, dialog or new round, and is disabled for reduced motion.

Candy transfers/draws depart without a source bounce, pulse or glow. Curved accelerating travel remains 1400ms with rotation toward upright and an end fade starting at 82% of the route. Scale smoothly goes 100% -> 150% at route midpoint -> 100% at the destination; previous terminal shrink is removed. Opponent private draws use an unidentified wrapper. Reduced motion uses an 80ms stationary fade. The separate Wendy-fishing and Wendy-draw status messages are removed.

The gradient board uses two rows of five dishes per player, persistent central/Wendy candy piles, portraits/names and CANDY SETS totals. Human slots show absent identities faintly and held quantities; opponent active identities remain private. Active portrait/half glows. The central Candy Dish always remains unidentified. Top controls are ceramic pumpkins with carved candlelit labels: NEW GAME v2 left and RULES v3 right, with matching letter height. Accessible labels remain in visually hidden spans. Side highlights are inset 1vw vertically and 0.5vw horizontally.

## Current popups and pending design

Earned-set popup has configured player name, candy image, collected-three wording and user-controlled Continue/outside-tap dismissal. Initial deals cannot complete a set. Game-over banner leaves hands visible, names the result/reason/totals and offers New Game. These are functional but are the first appearance tasks to improve.

Read NEXT-TODOS.md for the user's next priorities. Older opponent/variant/animation/Good Fish proposals remain separate backlog, not authorization to implement them during appearance work.

## Files and configuration

- index.html / demo.html: game markup and standalone preview.
- candy-go-fish.js: presentation, input locks, acknowledgement/timer orchestration, grid shortcut and dialogs.
- candy-go-fish.css: layout, speech colors/tails, breathing and decorative pile layers.
- candy-piles.js: persistent wrapper identity, size/color/rotation, placement and flight departure snapshots.
- pile-preview.html / .css / .js: separate appearance tuning tool.
- game-engine.js: pure rules and state; computer-player.js: public-information weighted strategy.
- assets/json/game-config.json: authoritative rules, profiles, catalog, display settings and runtime timings.
- assets/json/config-data.js: generated fallback for file opening/fetch failure.

After JSON edits run node games/candy-go-fish/_documents/codex-john-docs/sync-config.cjs; never edit the generated companion independently. Current important fields: copiesPerType 3, quoteFadeMs 250, quoteHoldMs/playerRequestHoldMs 1000, yesAutoTransferMs 4000, giftTravelMs 1400, giftMidScale 1.5. Some older appearance fields remain unused; do not assume every configured field controls current runtime. Breathing/tail constants are CSS. Full presentation centralization is not implemented.

## Shell, preview and publishing

Plain HTML/CSS/JS, no build. The shell is 9:16; game panel 9:14. Follow the single shared games/README - game design requirements.md. Keep game-owned controls inside the game. Slot 8 title is Go Fish Candy Edition; icon is assets/halloween-fish.svg.

Only the existing ../game-helper.js score API is used: Halloween.reportScore(humanSetCount, 'human-opponent') once at finish, with a numeric ranking and displayed totals. The actual separator is an en dash. No direct parent messaging/storage. Shell settings/audio APIs are not implemented. There is no dedicated Pause button at John's direction; local dialogs pause, but the shell drawer does not notify/pause the iframe.

Run python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1, reusing an existing server. Preview /games/candy-go-fish/demo.html or root shell/slot 8. File opening uses the companion. Loopback is PC-only; actual iPhone Safari still needs device review.

October 12 publishing request: refresh docs, verify, commit and push current UI and initial-deal changes to main. October 11 appearance/piles commit was 1df4eac; encoding fix 7f20652 restored Pages deployment. Previous published gameplay checkpoint: 1d7a777 ("Overall gameplay ok, need to work on appearances"). Update APP_VERSION and both root ?v= stamps together before publishing. This authorization does not authorize later pushes.

## Rollback and verification

- 5a33e38: last Fast/Slow version, previously pushed.
- 83c418b: local checkpoint immediately before breathing, preserving earlier October 11 changes.
- pile-integration-checkpoint-2026-1011/: board immediately before live generic piles; restore its HTML/CSS/JS together to remove integration.
- grid-dishes-checkpoint-2026-1011/, player-piles-checkpoint-2026-1011/, background-checkpoint-green-2026-1011/: earlier visual rollback files, not current runtime.
- style-checkpoint-before-tails-2026-1011/: pre-tail/gold styles and runtime; restore CSS for a visual rollback, not old JS over newer behavior.

See VERIFICATION-2026-1011.md for validation and INTEGRATION-AND-VERIFICATION.md for commands. Screenshots are development artifacts; neither Chrome tests nor fixtures establish actual iPhone Safari pacing/compositor behavior.
