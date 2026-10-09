# Candy Go Fish data

`game-config.json` is the editable source for this game's data. Older JSON/TXT files elsewhere in assets are not loaded.

- `candies`: stable identifiers, player-facing names, and PNG filenames in `../candybar-images/`.
- `rules`: base copies per type and initial deal size. No empty-hand refill; an empty hand ends the round.
- `players`: configurable human/opponent names and portrait filenames. Internal `human`/`wendy` keys are stable role IDs; changing a display name changes portrait labels, turn labels, messages, Rules and game-over text without changing engine roles.
- `appearance`: normal transfer duration, Wendy's thinking delay, the pre-gift pulse duration, slower gift travel duration, and gift acceleration easing.
- `candyDisplay`: shared slot-art settings, including empty transparency (0 visible, 100 invisible), image scale, rotation, fitting dimensions, duplicate offset, and duplicate rotation. Each candy's optional `display` object overrides these defaults. Enlarged candy images remain centered and clip inside the slot; badges sit outside that clipping layer. Main images use the specified rotation; the rear duplicate adds the configured stack rotation.
- `layout`: five columns and the ordered slot identifiers. Both players use the same order. Positions are derived from the responsive grid rather than hardcoded screen pixels. Future canvas coordinates or character-icon positions can be recorded here if needed.

HTTP play loads the JSON directly. For direct `file://` play, `config-data.js` is a generated companion. After changing JSON, run from the repository root:

```powershell
node games/candy-go-fish/codex-john-docs/sync-config.cjs
```

Keep both files together. Do not edit the generated JavaScript separately.

The six narrow bars use `imageScale: 225`, which is another 50% enlargement over the previous 150 setting. 100 Grand uses −15°; 3 Musketeers, Butterfinger, Milky Way, Mounds and Snickers use −30°. Other candies retain the 150 default. Set `candyDisplay.emptyTransparency` to 100 for invisible empty-slot artwork.

`giftWidthVw`, `giftHeightVw`, `giftArcVw`, `giftPulseScale`, and `giftDissolveStart` now control **every** transfer/draw route. Sources pulse for 480ms, travel follows a sampled curve for 1400ms with slow-start acceleration, and the candy fades/shrinks into its destination during the final 18% of the path. The gift-named timing/easing fields are shared by all routes; `travelMs` is retained legacy data and no longer used. Hidden opponent draws use an enlarged neutral wrapper. Reduced motion uses a brief stationary fade instead.
