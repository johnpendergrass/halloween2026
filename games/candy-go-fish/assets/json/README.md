# Candy Go Fish configuration

`game-config.json` is the authoritative editable source. Older JSON/TXT files elsewhere in assets are not loaded. HTTP play fetches it; direct file opening and fetch failure use the generated `config-data.js` companion.

## Sections

| Section | Responsibility |
| --- | --- |
| `rules` | Copies per type and initial hand size; base is 3/5 |
| `players` | Names and portrait filenames for stable human/wendy roles |
| `appearance` | Main presentation timings and candy-travel easing |
| `candyDisplay` | Shared slot fitting, empty transparency, stacking, speech sizing and candy-movement art |
| `layout` | Five columns and ordered type IDs; both boards share the order |
| `candies` | Stable ID, long/short names, image filename and optional display overrides |

The [animation survey](../../codex-john-docs/ANIMATION-SURVEY-2026-1009.md) lists every current timing, including literals/CSS still outside this JSON. The [implementation handoff](../../codex-john-docs/ANIMATION-IMPLEMENTATION-HANDOFF.md) proposes central presentation profiles; that new schema is not implemented.

## Names and catalog expansion

Every candy requires `id`, `longName`, `shortName`, and `image`. Short names are curated, trimmed, nonempty, at most 16 characters and unique across the entire catalog ignoring case/spacing/punctuation. Do not auto-truncate. Keep variants distinguishable, such as current **Life Savers Gummies / LS Gummies** and a future separate **LS Hard Candy**. Existing brief names may use the same long/short value.

Questions/compact status use short names; accessibility, image descriptions and celebrations use long names. IDs remain independent of names. Validate the full future catalog before selecting a round subset; the demo currently still uses ten fixed candies, without a broader catalog/round-selection feature.

## Art settings

Empty identities use 82% transparency; set `emptyTransparency` to 100 to hide them completely. Default `imageScale` is 150; six narrow bars use 225. 100 Grand rotates −15°, while 3 Musketeers, Butterfinger, Milky Way, Mounds and Snickers rotate −30°. Candy-specific `display` overrides shared settings. Art is centered/cropped inside the slot while badges remain visible. Two copies use offset art plus a count badge.

`speechImageScale: 100` means 100% of actual grid artwork dimensions, with inherited candy rotation, inside a clipped quote-art frame. It is not a percentage of the original small speech image. The requested candy appears only in the bubble; the center remains the Candy Dish.

Gift-named settings apply to all four transfer/draw routes. `giftWidthVw`, `giftHeightVw`, `giftArcVw`, `giftPulseScale`, and `giftDissolveStart` control prominent travel, curve, pulse and fade/shrink threshold. Private opponent draws use neutral wrappers. `appearance.travelMs` is unused legacy data; actual motion uses `giftTravelMs`.

## Timing relationships

Human questions wait `playerRequestHoldMs` (4000) before sending, or bubble tap sends immediately; reselection restarts it. Incoming speech uses `requestSpeechMs` (2500). Opponent matching slots highlight/enable after `requestHighlightDelayMs` (500), within the `requestGiveHoldMs` (4000) automatic gift wait. Matching-slot tap releases the gift early.

Yes uses `requestSpeechMs` to arrive, `requestHoldMs` (900) to remain readable, and `replyDissolveMs` (300) to fade before source pulse/travel. An unsatisfied opponent question also uses `requestHoldMs` before Go Fish readiness. Nope remains until the human draws. Local dialogs pause JavaScript waits/motion; reduced motion retains reading waits.

## Regeneration

From repository root:

```powershell
node games/candy-go-fish/codex-john-docs/validate-candy-names.cjs
node games/candy-go-fish/codex-john-docs/sync-config.cjs
```

Regeneration validates names/IDs and writes the companion. Keep both files together; do not edit generated JavaScript independently. The current validator does not validate all animation values; adding presentation-schema validation is part of the later handoff.

Dots, Life Savers Gummies, Mallomars and Red Vines now also use a −30° rotation through per-candy JSON overrides, shared by grid, quote and transfer artwork. Their existing image scales remain unchanged. 100 Grand retains −15°.

Current visual trial: the demo is temporarily configured for four candies per set, with 40 candies total and 30 in the Candy Dish after dealing. Three held copies display as three stacked images. The intended base game remains ten types with sets of three; change copiesPerType back to 3 and regenerate the companion to restore it. Other turn/end rules are unchanged.
