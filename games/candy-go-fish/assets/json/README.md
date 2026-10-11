# Candy Go Fish configuration

game-config.json is authoritative. HTTP fetches it; direct file opening/fetch failure uses generated config-data.js. Do not edit the companion independently.

| Section | Current purpose |
| --- | --- |
| rules | copiesPerType 3, initialHandSize 5: 30 total, 20 initially in dish after dealing |
| players | Names/portrait filenames for human/wendy role keys |
| appearance | quoteFadeMs 250; quoteHoldMs/playerRequestHoldMs 1000; yesAutoTransferMs 4000; thinkingMs 1000; giftTravelMs 1400 and accelerating easing |
| candyDisplay | Slot fitting/rotation/stacking, giftWidthVw 22, giftHeightVw 17, giftArcVw 22, giftMidScale 1.5, giftDissolveStart 0.82 |
| layout | Five columns, ten ordered candy IDs |
| candies | Stable ID, long/short name, image and display overrides |

Both Yes replies wait four active seconds or a middle click. No replies require a middle click. Wendy-request matching slot can shortcut question/reply waits immediately. Slot highlight is immediate for that shortcut; requestHighlightDelayMs is no longer used. requestGiveHoldMs/requestHoldMs remain legacy inputs at call sites; question pacing derives from quoteHoldMs. appearance.travelMs is unused.

Candy flights grow 100%-150%-100%, with end fade and no terminal shrink or source pulse. Reduced motion uses stationary fade. CSS controls breathing (500ms delay, 1000ms first swell, 4% peak, 1000ms repeating cycle), speech colors and curved SVG-mask tails. These are not centralized into JSON.

Empty identities have 82% transparency. Default imageScale is 150; narrow bars use 225. All candies tilt -30 degrees except 100 Grand at -15. Two held copies overlap with a count badge. speechImageScale 100 means grid artwork dimensions, retaining per-candy rotation. Candy art appears in question boxes, not in the central dish. Private draws use unidentified wrappers.

Names require unique normalized shortName, trimmed/nonempty and at most 16 characters; longName is for accessibility/celebrations. Original PNGs are unchanged.

After editing JSON run:
node games/candy-go-fish/codex-john-docs/validate-candy-names.cjs
node games/candy-go-fish/codex-john-docs/sync-config.cjs

The broader animation centralization and full presentation-value validation remain pending. The October 9 survey is a historical inventory, not current effective timing. See the current handoff for behavior.
