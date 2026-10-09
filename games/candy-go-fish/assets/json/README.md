# Candy Go Fish data

`game-config.json` is the editable source for this game's data. Older JSON/TXT files elsewhere in assets are not loaded.

- `candies`: stable identifiers, `longName`, `shortName`, and PNG filenames in `../candybar-images/`. Compact speech/status messages use `shortName`; accessibility labels, image descriptions, and celebrations use `longName`.

Short names are explicit editorial choices, at most 16 characters, and unique across the whole catalog. Do not automatically truncate a long name: keep meaningful brand/variant distinctions (for example `LS Gummies` versus a future `LS Hard Candy`). The stable `id` identifies a candy in gameplay, independently of either display name. Names may match when the full name is already brief.

Configuration regeneration validates required names, duplicate IDs, length, and short-name collisions after ignoring case, punctuation and spacing. Adding another variety with an existing short name requires editing the names to distinguish both varieties. Use the same validator on the full future catalog before selecting a subset for a round. Character count is a guardrail; review new names on the phone because character widths differ. Run `node games/candy-go-fish/codex-john-docs/validate-candy-names.cjs` to check the catalog and validation scenarios.

`appearance.playerRequestHoldMs` is the wait after selecting a candy before the player's question sends automatically (4000ms). Tapping the question sends it immediately. Changing selection restarts the wait; local dialogs pause it.
- `rules`: base copies per type and initial deal size. No empty-hand refill; an empty hand ends the round.
- `players`: configurable human/opponent names and portrait filenames. Internal `human`/`wendy` keys are stable role IDs; changing a display name changes portrait labels, turn labels, messages, Rules and game-over text without changing engine roles.
- `appearance`: transfer/pulse timing, thinking delay, and gift acceleration easing. `requestSpeechMs` controls speech arrival (2500ms); `requestGiveHoldMs` holds a successful opponent request before automatic handover (4000ms); `requestHoldMs` holds an unsuccessful opponent request (900ms). The opponent's animated Nope response stays until the human draws.
- `candyDisplay`: shared slot-art settings, including empty transparency (0 visible, 100 invisible), image scale, rotation, fitting dimensions, duplicate offset, and duplicate rotation. Each candy's optional `display` object overrides these defaults. Enlarged candy images remain centered and clip inside the slot; badges sit outside that clipping layer. Main images use the specified rotation; the rear duplicate adds the configured stack rotation.
- `layout`: five columns and the ordered slot identifiers. Both players use the same order. Positions are derived from the responsive grid rather than hardcoded screen pixels. Future canvas coordinates or character-icon positions can be recorded here if needed.

HTTP play loads the JSON directly. For direct `file://` play, `config-data.js` is a generated companion. After changing JSON, run from the repository root:

```powershell
node games/candy-go-fish/codex-john-docs/sync-config.cjs
```

Keep both files together. Do not edit the generated JavaScript separately.

The six narrow bars use `imageScale: 225`, which is another 50% enlargement over the previous 150 setting. 100 Grand uses −15°; 3 Musketeers, Butterfinger, Milky Way, Mounds and Snickers use −30°. Other candies retain the 150 default. Set `candyDisplay.emptyTransparency` to 100 for invisible empty-slot artwork.

`giftWidthVw`, `giftHeightVw`, `giftArcVw`, `giftPulseScale`, and `giftDissolveStart` now control **every** transfer/draw route. Sources pulse for 480ms, travel follows a sampled curve for 1400ms with slow-start acceleration, and the candy fades/shrinks into its destination during the final 18% of the path. The gift-named timing/easing fields are shared by all routes; `travelMs` is retained legacy data and no longer used. Hidden opponent draws use an enlarged neutral wrapper. Reduced motion uses a brief stationary fade instead.

`candyDisplay.speechImageScale` controls request-bubble candy art relative to the actual grid artwork, currently 90%. It uses each candy's grid fitting, enlargement and rotation settings. Art is centered in a generous clipped frame beneath the question, with a soft shadow. This replaces the older scale relative to the original small speech image. When the human lacks the requested candy, the full request bubble remains until Go Fish is tapped, replacing the old plain wants/none message.
