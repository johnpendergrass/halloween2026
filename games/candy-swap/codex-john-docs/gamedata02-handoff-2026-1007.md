# Game data 02 handoff — 2026-10-07

John requested the researched proposal as `gamedata02.txt`, corresponding JSON usable by the game, and one shared `candybars/default.png` placeholder.

Deliverables:

- `../assets/gamedata02.txt`: readable proposal, item mappings, and simplified character profiles.
- `../assets/gamedata02.json`: schema version 1; rules, attribute dictionary, item registry, and character registry. Stable lowercase IDs; readable labels; per-item `graphic`, `kind`, and `enabled`; profile preferences map attributes to favorite/like/dislike levels. Optional item/profile notes explain assumptions.
- `../assets/candybars/default.png`: transparent 256 × 256 PNG, generated with the built-in imagegen tool and downsampled with Pillow while preserving alpha.

JSON graphic URLs are relative to the game page: `./assets/candybars/default.png`. They are not relative to the JSON's assets directory. A consumer should load `./assets/gamedata02.json`, filter items by `enabled`, look up attribute labels by ID, and map preference levels through `rules.preferenceWeights`.

There are 38 items, 37 enabled. Nuts Candy Bar is disabled pending recipe confirmation. Razor Knife is replaced by the proposed Toy Spider. Existing artwork was discovered and left untouched; every data item uses the requested default image for now. Trident's proposed identity is Original Mint, and its note calls out that John's existing watermelon image would need Fruity instead.

Three-line trial profiles: Jing Sour favorite / Cookie like / Minty dislike; Yuze Chewy favorite / Chocolate like / Gum dislike; Andries Hard favorite / Gum like / Peanut dislike; Noor Fruity favorite / Crunchy like / Sour dislike. These are proposals, not a claim that John has individually approved every profile change. Andries's Peanut dislike is explicitly confirmed. Jing's Minty dislike is a new proposed replacement for the removed Sweet preference. All dislikes use the simpler -1 weight in this version, including Yuze's former -3 Gum dislike.

The game does not yet load these files. Satisfaction mapping is explicitly null in JSON because the 0–10 formula is undecided. No inferred scaling formula was silently introduced. Toys remain neutral for these proposed profiles.

Validation passed: JSON parsing, unique item/character IDs, valid attribute references, one to three distinct attributes per item, exactly one favorite/like/dislike per character, Andries's Peanut dislike, every graphic path existing, and transparent 256 × 256 PNG. Text was generated from the JSON to keep names, tags, and profiles aligned. Image inspected visually.

## Image generation

Mode: built-in imagegen; no CLI/API fallback.

Final prompt:

> Use case: stylized-concept. Asset type: small placeholder candy icon for a cheerful mobile Halloween candy trading game. Create exactly one friendly wrapped candy, centered, horizontal, bold clear rounded silhouette with twisted wrapper ends, simple colorful wrapper, readable at 100 pixels wide. Polished playful flat illustration with restrained shading and thick dark outline. No text, no brand, no extra objects, no cast shadow outside the silhouette. Transparent background. Square composition with generous padding so the whole candy fits inside its square touch box.

Original generated output remains in Codex's generated_images directory; the project contains its resized copy. Original `assets/GameData.txt` is preserved (apart from the earlier user-requested correction to Andries).
