# Artwork catalog and shared attributes — October 7, 2026

Update: the catalog now contains 64 items following the eleven-image expansion. See [candy-expansion-2026-1007.md](candy-expansion-2026-1007.md) for current counts, Cherry/Milk activation, new tags, and processing verification. The original 53-item survey below remains as historical context.

User requested a fresh attribute survey, stable program names, readable display names, filenames, measured sizes, and matching candy/player attribute identifiers. They explicitly authorized renaming incorrectly named files. `assets/gamedata03.json` and `assets/gamedata03.txt` now cover all 53 root artwork files. `default.png` is described separately as fallback artwork; it is not a dealable candy. The current demo still loads gamedata02.json; no scoring or profile changes were silently deployed.

## Identity and filenames

Each item has `name`, `displayName`, `fileName`, `imageSize`, `attributes`, `graphic`, `kind`, and `enabled`. `name` is the canonical program identity, unique without regard to case. Use string-key lookup, including for numeric brands such as `100Grand` and `3Musketeers`. Display text can change independently. All filenames match `<name>.png`. Dimensions were read from each file, all 500 × 500.

Filenames were corrected and aligned with program identities; see the cumulative history in `candy-filename-renames-2026-1007.json`. Examples: Krackle → Krackel, GumDoubleBubble → DubbleBubble, NestlesCrunch → NestleCrunch, Payday → PayDay, NutsCandybar → NestleNuts. Following John's clarification, images are representative, so overly specific names were simplified to Airheads, Trident, Orbit, HubbaBubba, RingPop, Starburst, TicTacFruit, and Twizzlers. Renames preserve image bytes. The user moved processed PNGs to the candybars root; both review pages now use those root paths. Historical manifests retain original provenance. The old processing helper is guarded against recreating an empty gallery after that move.

## Shared vocabulary

17 shared attributes: Chocolate, Fruity, Sour, Mint, Chewy, Hard, Crunchy, Peanut, Caramel, Cookie, Gum, Toy, Coconut, Rice, Low Sugar, Almond, Marshmallow. Marshmallow is available for future candy/player records but currently has zero artwork-backed items. Stable IDs are lower camel case (`lowSugar`), identical in candy and player preferences. Mint replaces Minty. Counts and definitions are in both data files.

John clarified that artwork variety should not dictate the intended game item. `attributeBasis: game-design` and `artworkIsRepresentative: true` record this policy. Trident is generic Gum (also Low Sugar), with no inferred fruit/mint preference. Nestlé Nuts uses Peanut, Chocolate, Caramel by explicit user direction. Generic Hubba Bubba gets Gum alone. Do not override these choices by researching the representative wrapper's recipe.

Cherry and Milk are reserved, not assigned. Mixed fruit assortments remain Fruity rather than adding a Cherry score because one piece might be cherry. Red color does not establish cherry flavor. Milk Chocolate is already covered by Chocolate; no distinct milk-flavored item exists in this image set. Milk Duds artwork is not present.

Rice means crisped rice, not a separate rice flavor. It appears on 100 Grand, Crunch, and Krackel. To respect the three-tag limit, 100 Grand prioritizes Chocolate, Caramel, Rice; its real crunch is noted but not a hidden scoring tag. Crunch and Krackel have Chocolate, Rice, Crunchy. There are no implicit parent matches or extra scores behind the visible list. For an even simpler future set, Rice can be folded into Crunchy across all three products after review.

Low Sugar currently includes sugar-free Orbit and Trident game items. This is a game classification with a narrow, documented qualification rule, not an invented nutrient threshold. Plain peanuts/popcorn and toys do not receive this tag just because they contain little or no sugar. Coconut oil alone does not establish Coconut flavor. Peanut includes peanut butter plus the explicit Nestlé Nuts game assignment; Almond remains a separate optional trait. Gum does not also receive Chewy. Broad texture labels for Candy Corn and Smarties are explicitly marked as gameplay simplifications. Cookies and plain popcorn have recipe assumptions rather than invented flavors.

## Research and corrections

- [Nestlé Nuts](https://www.nestle.de/marken/alle-marken/nuts) identifies the representative real-world product as hazelnut, caramel, and milk chocolate. John explicitly chooses Peanut for the game; that game assignment takes precedence and is noted in the record.
- [Hershey Almond Joy / Mounds](https://www.hersheyland.com/almond-joy-mounds) distinguishes Almond Joy's almonds and coconut from Mounds' coconut filling. Both get Coconut; only Almond Joy gets Almond.
- [Crunch](https://www.crunchbar.com/products/crunch-bar) describes chocolate and crisped rice. [Hershey's Krackel announcement](https://www.prnewswire.com/news-releases/the-hershey-company-announces-a-big-comeback-krackel-bar-is-back-the-classic-milk-chocolate-with-crisped-rice-bar-is-once-again-available-in-a-full-size-offering-259944271.html) supports crisped rice and the corrected spelling. The 100 Grand wrapper itself identifies chocolate, caramel, and crisp rice.
- [Butterfinger](https://www.butterfinger.com/) supports the crunchy peanut character. [Baby Ruth](https://www.ferrerofoodservice.com/us/en/brands/babyruth/babyruth-minis-bulk-30lb) supports peanuts and caramel. Their wrappers establish chocolate/chocolatey coatings.
- [3 Musketeers](https://www.3musketeers.com/our-products) describes chocolate and nougat; no Caramel added. [Milky Way](https://www.milkywaybar.com/) supports the chocolate/caramel combination, subject to regional variety assumptions. [Mr. Goodbar](https://www.hersheyland.com/products/hersheys-mr-goodbar-chocolate-with-peanuts-candy-bar-1-75-oz.html) identifies chocolate and peanuts.
- [Junior Mints](https://tootsie.com/product-brand/junior-mints/) describes chocolate and peppermint. [Orbit Bubblemint](https://www.orbitgum.com/orbit-bubblemint-gum) and [Trident Watermelon](https://www.tridentgum.com/products/trident-watermelon-twist-14-pieces) confirm sugar-free varieties. The game uses generic Orbit and Trident identities with the intended tags above.
- [Airheads](https://www.airheads.com/candy/) distinguishes Bites from bars and sour products. Regular Airheads uses Fruity and Chewy regardless of the representative Bites package. Hubba Bubba remains Gum; pictured fruit flavor does not add a game preference.
- [Red Vines FAQ](https://redvines.com/faq/) establishes its chewy texture and says only Black Licorice Twists have licorice extract. Original Red gets Chewy alone; cherry/raspberry/black licorice flavor is not inferred.
- Remaining established mappings and official sources are recorded in [the preceding research](candy-attributes-research-2026-1007.md). User-defined game identities override specific representative-artwork varieties. Generic cookie, popcorn, and non-food classifications are stated assumptions/design choices.

## Preference direction

Coverage: Chocolate 21, Fruity 17, Chewy 12, Crunchy 10, Peanut 9, Caramel 8, Gum 6, Cookie 4, Hard 4, Mint 3, Toy 3, Rice 3, Sour 2, Coconut 2, Low Sugar 2, Almond 1, Marshmallow 0.

With uniformly random six-item allotments from the full catalog, Sour as a favorite is often absent. Choose broad favorites and keep rare traits as secondary likes/dislikes, or deliberately guarantee them in the deal. Frequency is counted per item type, not inferred popularity. The TXT includes the probability of at least one match for a uniform six-item draw without replacement; this is a design comparison, not a promise about the demo's randomization.

Existing three-line demo profiles are preserved in `characters`, with Mint replacing Minty in this new proposal. `candidateProfiles` separately proposes:

| Character | Favorite | Like | Dislike |
|---|---|---|---|
| Jing | Chocolate | Cookie | Mint |
| Yuze | Chewy | Caramel | Gum |
| Andries | Crunchy | Gum | Peanut |
| Noor | Fruity | Toy | Sour |

Andries's Peanut dislike remains confirmed. Noor liking Toy creates a useful recipient for the non-food treats. These profiles are proposals for review, not an active change. Base +1, favorite +2, like +1, dislike -1, future strong dislike -2 remain the existing calculation. No strong dislikes assigned.

The image gallery now shows readable display names and proposed attributes beneath each product. Old draft items without artwork (Mentos Mint, Ruler, Toy Spider) are excluded from this artwork-backed catalog rather than pretending their images exist.

## Variety gaps

Marshmallow is the clear missing category. [Peeps](https://www.peepsbrand.com/products/classic-marshmallow-chicks/) can provide a simple Marshmallow item; [Mallomars](https://www.snackworks.com/products/mallomars-pure-chocolate-cookies-82-oz/) supplies Chocolate + Marshmallow + Cookie. [Warheads hard candy](https://warheads.com/warheads/) can strengthen Sour and Hard with a different combination from the two chewy sour candies. These are recorded as suggestedAdditions, not enabled items, and need artwork. Other gaps worth considering are Mint + Hard, more Coconut choices, and a specifically selected Cherry candy. Favor new combinations and support for scarce traits over additional equivalent chocolate bars.

Do not tag nougat bars as Marshmallow just to fill the gap: [Charleston Chew](https://shop.tootsie.com/collections/peanut-free/products/charleston-chew-vanilla-fun-size-41-92-oz-96-ct-box) is described as nougat. [Rocky Road](https://annabellecandy.com/collections/rocky-road) is another actual marshmallow candidate, with chocolate and cashews, if desired later.

Verification passed: 53 unique records, matching case-sensitive filenames, measured dimensions, one to three valid tags per existing item, valid shared player preference IDs, recomputed coverage counts, and the Trident/Nestlé Nuts user overrides. The full phone-sized gallery loaded all 53 images and passed touch, rotation, dark-background, and width checks after the final renames.
