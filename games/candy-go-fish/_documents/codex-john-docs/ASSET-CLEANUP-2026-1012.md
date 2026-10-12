# Asset cleanup, October 12, 2026

Deleted 31 unused files from Candy Go Fish's assets folder, including older artwork variants, source images, unused backgrounds and obsolete candy catalogs. The exact list is in asset-cleanup-removed-2026-1012.json. Removed the three redundant long-named portraits from opponents/icons after switching to the supplied assets/opponent-icons copies.

The active asset folder now holds 28 files: 25 images, the authoritative JSON configuration, its generated standalone companion and config documentation. Candy brand filenames were already meaningful and remain unchanged.

Renamed active artwork:

- buttons/ceramic-pumpkin-new-game.png and ceramic-pumpkin-rules.png
- candy-dish/ghost-plate.png, witch-tray.png, black-cat-tray.png, player-grid-dish.png and opponent-grid-dish.png
- generic-candies/candy-bar.png
- backgrounds/green-blue-gradient.png
- player-icons/friendly-ghost.svg (moved into the supplied folder)

Portraits use opponent-icons/RON.png, HARRY.png and HERMIONE.png. Configuration, HTML, CSS, dynamic image paths, preview and portrait fallback paths were updated. The file-opening config companion was regenerated and the cache version changed to 2026-1012-candy-assets.

Checks passed: complete asset reference inventory, opponent cycling/state preservation, phone/desktop layout, full UI round, replay and file opening. Gameplay algorithms were not changed. Historical checkpoint documents may still name old assets; those references are historical, except the maintained portrait CSS fallback which has current paths.

This cleanup is local and has not been committed or pushed.
