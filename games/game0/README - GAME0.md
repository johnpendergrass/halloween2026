# game0 (the home game)

The home game: loaded when the app starts, and shown again whenever no other game is active (🏠). It will become the home screen with background animations. For now it only shows its name and the game panel's size.

- **Made by:** Claude Code, 2026-09-27 (placeholder page).
- **Status:** placeholder. Replace this file when the real game is written.
  See `games/game1/README - PIE MAKER.md` (Pie Maker) for what a finished one covers.

## Files

```text
index.html   heading, note, size readout
game0.css    styles (only affect this game)
game0.js     shows the page's size, which is the game panel's size inside the app
assets/      empty for now
README - GAME0.md  this file
```

## Layout, sizes, colours

- Fills the game panel (inside the iframe, `100vw` × `100vh` = the panel).
- Sizes in `vw`, so everything scales with the panel.
- Background `#f5f1e8`, text `#2a2230`, quieter text `#6b6272`.

## Talks to the app?

No. The app just loads the page; 🏠 in the top panel leaves it.
