# Candy Go Fish — current handoff, October 11, 2026

This is the authoritative current-state entry point. It supersedes October 9 notes and intermediate October 11 interaction descriptions. Overall gameplay is now acceptable; the next work is appearance and sound, in the order in NEXT-TODOS.md.

## Implemented gameplay

Ten candy types, three copies each: 30 total, five initially dealt per player, 20 initially in the Candy Dish before initially dealt sets collect. First player is random. Request only a currently held type. Success transfers exactly one candy and retains the requester's turn. Three matching candies collect automatically as one set.

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

Candy transfers/draws depart without a source bounce, pulse or glow. Curved accelerating travel remains 1400ms with rotation toward upright and an end fade starting at 82% of the route. Scale smoothly goes 100% -> 150% at route midpoint -> 100% at the destination; previous terminal shrink is removed. Opponent private draws use an unidentified wrapper. Reduced motion uses an 80ms stationary fade. The existing short Wendy-fishing announcement remains.

The green table uses two rows of five goals/slots per player, static wrapper piles and counts, portrait/name and SETS WON totals. Human slots show absent identities faintly and held quantities; opponent active identities remain private. Active portrait/half glows. The central Candy Dish always remains unidentified. Current top controls are New Game and Rules.

## Current popups and pending design

Earned-set popup has configured player name, candy image, collected-three wording and user-controlled Continue/outside-tap dismissal. Initial dealt sets skip this popup. Game-over banner leaves hands visible, names the result/reason/totals and offers New Game. These are functional but are the first appearance tasks to improve.

Read NEXT-TODOS.md for the user's next priorities. Older opponent/variant/animation/Good Fish proposals remain separate backlog, not authorization to implement them during appearance work.

## Files and configuration

- index.html / demo.html: game markup and standalone preview.
- candy-go-fish.js: presentation, input locks, acknowledgement/timer orchestration, grid shortcut and dialogs.
- candy-go-fish.css: layout, speech colors/tails and breathing.
- game-engine.js: pure rules and state; computer-player.js: public-information weighted strategy.
- assets/json/game-config.json: authoritative rules, profiles, catalog, display settings and runtime timings.
- assets/json/config-data.js: generated fallback for file opening/fetch failure.

After JSON edits run node games/candy-go-fish/codex-john-docs/sync-config.cjs; never edit the generated companion independently. Current important fields: copiesPerType 3, quoteFadeMs 250, quoteHoldMs/playerRequestHoldMs 1000, yesAutoTransferMs 4000, giftTravelMs 1400, giftMidScale 1.5. Some older appearance fields remain unused; do not assume every configured field controls current runtime. Breathing/tail constants are CSS. Full presentation centralization is not implemented.

## Shell, preview and publishing

Plain HTML/CSS/JS, no build. The shell is 9:16; game panel 9:14. Follow the single shared games/README - game design requirements.md. Keep game-owned controls inside the game. Slot 8 title is Go Fish Candy Edition; icon is assets/halloween-fish.svg.

Only the existing ../game-helper.js score API is used: Halloween.reportScore(humanSetCount, 'human-opponent') once at finish, with a numeric ranking and displayed totals. The actual separator is an en dash. No direct parent messaging/storage. Shell settings/audio APIs are not implemented. There is no dedicated Pause button at John's direction; local dialogs pause, but the shell drawer does not notify/pause the iframe.

Run python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1, reusing an existing server. Preview /games/candy-go-fish/demo.html or root shell/slot 8. File opening uses the companion. Loopback is PC-only; actual iPhone Safari still needs device review.

Publishing request for this checkpoint: commit/push to main with title "Overall gameplay ok, need to work on appearances". Resolve its hash in Git history or the chat after creation. Update APP_VERSION and both root ?v= stamps together before publishing. This authorization does not authorize later pushes.

## Rollback and verification

- 5a33e38: last Fast/Slow version, previously pushed.
- 83c418b: local checkpoint immediately before breathing, preserving earlier October 11 changes.
- style-checkpoint-before-tails-2026-1011/: pre-tail/gold styles and runtime; restore CSS for a visual rollback, not old JS over newer behavior.

See VERIFICATION-2026-1011.md for validation and INTEGRATION-AND-VERIFICATION.md for commands. Screenshots are development artifacts; neither Chrome tests nor fixtures establish actual iPhone Safari pacing/compositor behavior.
