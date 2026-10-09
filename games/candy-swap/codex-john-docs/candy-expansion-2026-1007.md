# Eleven new candy images — October 7, 2026

Requested: process the eleven `_`-prefixed JPGs in `assets/original candybar images - not processed` and update the shared attribute catalog. Originals retain their filenames and bytes; normalized PNGs use canonical names in `assets/candybars`. Updated `gamedata03.txt`, `gamedata03.json`, the catalog generator, and `candy-art-gallery.html`. Subsequent proposal-gameplay iteration now loads data03; see proposal-gameplay-handoff-2026-1007.md.

## Processing

Built-in imagegen skill, background-extraction mode, one edit per image. Common prompt: remove only surrounding background and external cast shadows to genuine transparency; preserve the COMPLETE visible product/package, wrapper ends, lettering, logos, colors, proportions, orientation and photographic appearance; keep printed white areas opaque; preserve whole multi-package groups, exposed candy and the entire lollipop stick; do not unwrap, redesign, add or remove product elements; center with transparent padding and clean edges. For Whoppers preserve the rectangular printed box and the pictured balls extending below its bottom edge.

`finish-new-cutouts.py` crops tool-generated alpha bounds (threshold >8), preserves aspect ratio, sizes the subject to at most 480×480, and centers it on a transparent 500×500 RGBA canvas. It does not extract backgrounds itself. Tool output paths are recorded in `new-cutout-progress-*.json`; final paths and original SHA-256 hashes in `new-candy-cutouts-manifest.json`. Original inventory hashes are in `new-source-checksums.json`. Review contact sheet: `new-candy-cutouts-review.png`.

## New catalog entries

| Canonical name / PNG stem | Display name | Shared attributes |
|---|---|---|
| JetPuffedToastedCoconutMarshmallows | Jet-Puffed Toasted Coconut Marshmallows | Marshmallow, Coconut |
| LifeSaversSugarFree | Life Savers Sugar Free | Fruity, Hard, Low Sugar |
| LifeSaversMintSugarFree | Life Savers Pep-O-Mint Sugar Free | Mint, Hard, Low Sugar |
| Mallomars | Mallomars | Chocolate, Marshmallow, Cookie |
| Ohasis | Oh!asis Coconut Patties | Chocolate, Coconut |
| Peeps | Peeps | Marshmallow |
| TootsiePopsCherry | Tootsie Pops Cherry | Cherry, Hard, Chocolate |
| TootsieRoll | Tootsie Roll | Chocolate, Chewy |
| TwizzlersSugarFree | Twizzlers Sugar Free | Fruity, Chewy, Low Sugar |
| WerthersSugarFree | Werther's Original Sugar Free | Caramel, Hard, Low Sugar |
| Whoppers | Whoppers | Chocolate, Crunchy, Milk |

Spelling correction: `_Mallowmars.jpg` becomes `Mallomars.png`. Jet-Puffed's visible package is Toasted Coconut Marshmallows, correcting its abbreviated source filename. Hyphens/underscore prefixes are omitted in program identities. Backups retain their original names for provenance.

Keep one to three scoring tags. Sweetness is assumed. Cherry does not implicitly match Fruity; Milk does not apply to every milk chocolate. Whoppers' distinct malted-milk center motivates activating Milk. The cherry Tootsie Pop gets Chocolate for its chocolatey Tootsie Roll center; omit Chewy and generic Fruity to honor the three-tag cap. Marshmallow already identifies its soft texture; omit redundant Chewy.

John's representative-artwork policy remains: generic Peeps is Marshmallow even though this package is chocolate-covered; generic Oh!asis is Chocolate/Coconut even though the image is a limited-edition peppermint variety. Low Sugar deliberately distinguishes clearly sugar-free/zero-sugar products from their regular versions. No player profiles or preference weights are changed.

## Research evidence

- Visible source packaging establishes Jet-Puffed Toasted Coconut and both Life Savers sugar-free varieties (fruit assortment and Pep-O-Mint); no current retail availability claim is made.
- [Mallomars manufacturer](https://www.snackworks.com/products/mallomars-pure-chocolate-cookies-82-oz/) describes graham crackers topped with marshmallow and dark chocolate.
- [Oh!asis manufacturer](https://ohasis.com/) identifies coconut patties; this image also labels dark chocolatey coating.
- [Peeps manufacturer](https://www.peepsbrand.com/products/classic-marshmallow-chicks/) supports the generic marshmallow identity.
- [Tootsie Pops Cherry](https://shop.tootsie.com/products/tootsie-pops-cherry-flavor) identifies cherry flavor and a Tootsie Roll center. [Assorted Pops description](https://shop.tootsie.com/collections/tootsie-pops/products/tootsie-pops-assorted-flavors-10-13-oz-bag) explains the hard coating and chewy center.
- [Tootsie Roll manufacturer](https://shop.tootsie.com/collections/best-sellers/products/tootsie-roll-bulk-30-lb-box) describes cocoa flavor and chew. Subtle fruit undertones do not add Fruity.
- [Hershey's zero-sugar products](https://www.hersheyland.com/brands/zero-sugar.html) includes strawberry Twizzlers twists.
- [Werther's product overview](https://www.werthers-original.us/en/products/product-overview) identifies sugar-free hard caramels.
- [Whoppers manufacturer](https://www.hersheyland.com/whoppers) identifies malted milk; Crunchy is a gameplay texture classification.

## Coverage after expansion

64 items; 19 shared attributes. Marshmallow 3, Coconut 4, Low Sugar 6, Cherry 1, Milk 1. Peeps and Mallomars move from proposed additions into the artwork catalog. Warheads remains a proposed addition needing artwork. Full measured sizes, paths, counts and six-item-deal probabilities are regenerated in data03.

## Completed verification

All eleven new PNGs passed RGBA transparency, 500×500 dimensions, centered-subject padding and source checksum checks. Visually reviewed every new cutout on the dark contact sheet: package text, groups, white areas, lollipop stick and the exposed Werther's candy are intact. Catalog checks passed 64 unique names, 19 valid shared attributes, one to three tags per item, measured sizes and exact filename coverage (plus the default graphic). The full 64-item gallery passed Chrome testing at 390×844: all images loaded at 500px, touch toggles worked, rotation/fit/dark controls worked, and there was no horizontal overflow. Local server started on port 8097 for verification.
