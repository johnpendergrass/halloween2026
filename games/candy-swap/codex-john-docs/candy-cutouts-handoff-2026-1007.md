# Full candy artwork processing — October 7, 2026

The user approved the four initial samples, dark-background appearance, and rotations extending beyond the upright touch boxes. All 53 source JPG images are now processed using the same approach. Final location: `assets/candybars/processed/<original-base-name>.png`. The existing default graphic is also normalized there, for 54 PNG files total. Original JPGs and the user's backup folder remain intact.

## Format and use

- Transparent RGBA PNG, 500 × 500 pixels.
- Subject centered within 480 × 480; at least approximately 10px padding on its longest dimension.
- Original proportions and orientation preserved; CSS applies ±30° rotation at runtime.
- Touch box stays upright. Artwork can overhang; the overhanging portion is not interactive.
- Includes candy packaging, cookies, crayons, eraser, Play-Doh, and popcorn from the source folder.

`candy-art-gallery.html` presents the full set on a dark background with small tappable icons, larger artwork, and rotation controls. Phone URL: http://192.168.0.200:8097/games/candy-swap/candy-art-gallery.html (use the LAN address printed by the existing launcher if it changes).

## Processing and traceability

Used the built-in image editing tool (`imagegen` skill), background-extraction mode, one edit per source image. Common prompt: remove only surrounding background and external cast shadows to genuine transparency; preserve the complete product, wrapper ends, lettering, logos, color, proportions, orientation, and photographic appearance; keep white product areas opaque; do not redesign, unwrap, add objects, or text; center with transparent padding and clean edges. Specific instructions preserve cookie decorations, entire multi-object groups, exposed gum sticks/crayons, popcorn kernels, clear container outlines, and remove baked-in checkerboard/black backdrops where present.

`candy-cutout-tool-outputs.json` records generated intermediate paths. `finish-candy-cutouts.py` only crops and resizes these already-transparent tool outputs, preserves their alpha, writes final project assets, validates size/transparency/padding, and builds the review gallery and dark contact sheets. `candy-cutouts-manifest.json` records final graphics and original source checksums; `candy-source-checksums.json` captures the originals before processing.

These are AI-assisted edits rather than pixel-identical masks. The user approved this appearance based on the samples. Packaging should still be checked when choosing final game artwork.

The game data and swap demo continue using the default graphic; this task prepares the artwork library without changing candy definitions or scoring.

## Completed verification

All 53 cutouts passed dimensions, RGBA transparency, and visible-subject padding checks. All 54 processed PNGs are 500 × 500. Reviewed all images on dark contact sheets. The full gallery passed headless Chrome verification at 390 × 844: every image loaded, touch selection toggled, rotation/fit/dark-background controls worked, and the page had no horizontal overflow. All 53 original JPG SHA-256 checksums match the pre-processing inventory.
