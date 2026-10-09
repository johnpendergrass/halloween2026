# Candy Go Fish data

`game-config.json` is the editable source for this game's data. Older JSON/TXT files elsewhere in assets are not loaded.

- `candies`: stable identifiers, player-facing names, and PNG filenames in `../candybar-images/`.
- `rules`: base copies per type and initial deal size. No empty-hand refill; an empty hand ends the round.
- `appearance`: empty-slot transparency (0 visible, 100 invisible), transfer duration, and Wendy's thinking delay, in milliseconds.
- `layout`: five columns and the ordered slot identifiers. Both players use the same order. Positions are derived from the responsive grid rather than hardcoded screen pixels. Future canvas coordinates or character-icon positions can be recorded here if needed.

HTTP play loads the JSON directly. For direct `file://` play, `config-data.js` is a generated companion. After changing JSON, run from the repository root:

```powershell
node games/candy-go-fish/codex-john-docs/sync-config.cjs
```

Keep both files together. Do not edit the generated JavaScript separately.
