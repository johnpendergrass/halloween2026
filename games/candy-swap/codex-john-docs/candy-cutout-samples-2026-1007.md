# Candy artwork samples — October 7, 2026

Four sample assets: Snickers, Peanut M&M's, Candy Corn, and homemade Chocolate Chip Cookie. Original JPG files and the user's backup folder are preserved.

Each new PNG uses a 500 × 500 transparent canvas. The visible subject fits within 480 × 480, centered with at least 10 pixels of padding. Proportions are preserved; long wrappers have more vertical space. Images remain unrotated on disk.

The image editing tool removed the surrounding background and external shadows. These are AI-assisted sample cutouts, so packaging details should be reviewed before adopting the workflow for every product. `normalize-cutout-samples.py` crops and sizes the tool output; it does not perform background removal. The manifest records tool output paths and crop bounds.

Phone preview: http://192.168.0.200:8097/games/candy-swap/candy-art-preview.html

Start the existing `start-touch-test.bat` server if needed; use the LAN address it prints if the address changes. The sample page has small tappable icons, larger artwork, a ±30° rotation slider, dark-background inspection, and a fit-inside-box option. Touch boxes remain upright and transparent. When fit is disabled, visible artwork can overhang the box; the overhang itself is not tappable. The fit option conservatively scales the entire square canvas.

The game data and swap demo still use the existing default graphic. These four samples are isolated for visual review before processing the remaining images.
