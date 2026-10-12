# Candy Go Fish: current state and publishing checkpoint

Updated October 12, 2026. This is the authoritative current handoff. Earlier dated notes and snapshots are historical and may name retired previews, experiments or asset paths.

## Game and presentation

Registered in shell slot 8; index.html runs without a build. HTTP and file opening work. Current configuration uses ten candy types, three copies per set and five starting cards, with no complete set in either opening hand. Engine and opponents also support four-copy sets. Fishing ends the turn; Good Fish remains unimplemented.

The opening shows an empty board and a centered enlarged ghost dish. Clicking the dish or prompt chooses a random starter through a 3.7-second spin; clicking the resulting message deals. The dish remains centered. Reduced motion fades. New Game and replay repeat the opening. Zero-valued grid badges are hidden.

Labels read CANDY SETS. Completed-set badges are 125% of the original size. The cat dish's count badge sits below the face. The choice instruction is a wide cream tail-free box over the dish, hidden on candy selection. Redundant fishing/drawing narration is removed. Pumpkin buttons have carved candlelit lettering. Portraits are 25% larger, names unchanged in size; smaller buttons and an upward board shift give room. Opponent names overlap centrally below the portrait; arrows flank the circle.

Question/reply boxes stay stationary. Yes replies transfer after four active seconds or a middle click; No replies wait for a draw click. Matching a requested player candy shortcuts the request/reply. Questions are cream, Yes green, No coral, with curved tails. Replies gently breathe. Dialogs pause presentation. Candy transfers curve and scale from 100% to 150% and back; reduced motion fades. Opponent private draws remain unidentified.

Piles retain arrangements by engine card ID; redraws preserve survivors and sets remove their cards. Current artwork is the flat gradient, ghost plate, witch tray, cat tray and two grid dishes. Sound remains unimplemented. Width-relative sizing, Arial text, touch targets and standalone operation follow shared requirements. No dedicated Pause button at John's direction; the shell drawer does not pause play.

## Opponents

Ron +, Harry ++ and Hermione +++ use distinct installed JavaScript policies with no model calls during gameplay. Ron preserves weighted randomness; Harry uses calibrated immediate probability scoring; Hermione tracks 1,024 plausible hidden-card arrangements and scores requests from temporal evidence. Plus signs indicate difficulty and appear only in portrait labels.

Switching is allowed mid-round except in dialogs/game-over. Cards, scores, turn and observations persist. A chosen request completes; the next decision uses the selected policy. Strategies never receive actual player hidden cards or dish order. Public history and own private draws are retained from the deal.

Read [the strategy guide](../strategies-development/_START-HERE.md) for algorithms, development, measured results and compact evidence. Historical simulation and experimental code were removed at John's request. Forty thousand fresh validation games established Harry over Ron and Hermione over Harry for both set sizes and starting orders. Sixteen thousand Hermione self-play games found no starting advantage; triples suggested only a small borderline disadvantage. These results do not establish optimal play.

## Folder map

- index.html and candy-go-fish.css: entry point and layout.
- js/: controller, engine, pile renderer, beginner support and strategies.js adapter.
- js/strategies/: five required runtime policy modules.
- js/shared/: public memory and temporal inference.
- assets/: active images, authoritative JSON, generated companion and config documentation. Portraits use opponent-icons/RON.png, HARRY.png, HERMIONE.png and player-icons/friendly-ghost.svg.
- _documents/_START-HERE.md: main guide.
- _documents/codex-john-docs/: game docs, checks and historical checkpoints.
- _documents/design ideas/: artwork sources and visual alternatives.
- _documents/strategies-development/: accepted algorithms and development record.

The root opponents folder and seven obsolete preview/demo files are removed. Active filenames omit version/source/dimension suffixes. Thirty-one unused assets and three redundant portraits were deleted. An empty old design ideas directory remains locked by another Windows process; Git does not track empty directories. The maintained portrait-layout CSS fallback has current asset paths.

## Configuration, checks and publishing

Edit assets/json/game-config.json and regenerate config-data.js with _documents/codex-john-docs/sync-config.cjs. Configuration holds names, portraits, strategy IDs, rules and presentation values. The adapter records actual choices in a nonvisual decision trace for explanations. It reveals computer holdings and is a development aid.

Verification covers all live asset references, names, engine privacy/conservation and 1,000 games per set size; phone/desktop layout, full play, replay and file opening; all profiles, both set sizes and switching; shell registration and rendering. Browser tests use desktop Chrome, not physical iPhone Safari. Real-device appearance, performance and difficulty enjoyment remain review tasks.

Cache stamp: 2026-1012-candy-strategy-cleanup in shell, nested resource URLs and JSON fetch. John authorized documentation update, commit and push of this state. Check strict UTF-8 and replacement characters before publishing; invalid characters previously blocked Pages. Verify remote equality and actual Pages deployment rather than the settings page's generic being-built-from-main label.

## Next work and documentation convention

John accepted the current strategies. Review human play feel before further tuning. Remaining ideas: earned-set/results celebrations, pile readability and coordinated sound design. Recreate retired simulations only if future work needs them.

Every new summary folder needs an obvious _START-HERE.md or clear contents index with links. Start future work at the main guide and this handoff. Older notes remain historical; this file takes precedence.
