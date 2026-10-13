# Welcome design fallback

The later steampunk design is also preserved: steampunk-welcome.css is the stylesheet immediately before replacing pipes with vines, and welcome-pipes.svg is its border artwork. To restore it, copy the stylesheet to the game root and the SVG to assets/decorations. This snapshot has the smaller welcome panel, lifted button and no decorative candy bars.

Saved before the steampunk welcome-border change on October 12, 2026.

- index.html: original welcome markup.
- candy-go-fish.css: original stylesheet.
- candy-go-fish.js: original controller, copied from js/.

For a full rollback, copy these files back to the game root, except candy-go-fish.js which belongs in js/. These snapshots include the current player selector and candy rain. After later gameplay changes, restore only the welcome-related portions to avoid replacing newer work.
