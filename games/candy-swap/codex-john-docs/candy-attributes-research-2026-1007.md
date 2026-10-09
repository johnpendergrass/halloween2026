# Candy attributes proposal — 2026-10-07

Research requested by John; attribute mapping is a proposal only. Game code has not been changed. Follow-up correction from John: Andries dislikes Peanut; its appearance under Likes was a mistake and has been removed from `assets/gamedata.txt`. Gum remains his Like.

## Simple rules

Sweetness is assumed for candy and is not a scoring attribute. Fruity and sour candies can still be sweet; these tags describe their distinguishing character, not the absence of sugar. Toys, peanuts, and plain popcorn do not inherit a Sweet tag either.

Use one or two defining attributes by default, three when all three clearly matter. Do not fill a quota with redundant tags. Omit Candy Bar (package/shape) and Sweet. Use one spelling throughout: Peanut, Hard, Toy. Rename Crispy to Crunchy so it can cover wafers, candy shells, nuts, and popcorn in familiar language. Keep Cookie separate to support cookie-loving characters. Do not automatically tag every cookie or peanut as Crunchy: choose the most recognizable characteristics and show every scoring tag.

Proposed vocabulary: Chocolate, Fruity, Sour, Minty, Chewy, Hard, Crunchy, Peanut, Caramel, Cookie, Gum, Toy. Twelve categories is still a large vocabulary; not all need appear in the first playable pool. Sugar Free can remain product metadata but is best omitted from preference scoring in the first simple version, because only one drafted item has it. These are gameplay classifications, not exhaustive ingredient lists.

## Proposed item mapping

Unless stated otherwise, use original/classic varieties. Names such as generic cookies, Nuts Candy Bar, and Popcorn do not identify a particular recipe; their tags are assumptions to confirm against eventual artwork. Research sources appear next to the relevant rows. Texture choices labelled as simplifications are design judgments.

| Draft item / proposed identity | Proposed scoring attributes | Evidence or decision |
|---|---|---|
| Airheads Original | Fruity, Chewy | [Airheads](https://www.airheads.com/candy/airheads/) distinguishes original fruity chews from Sour Bars. |
| Candy Corn | Chewy | Broad soft/chewy bucket for this game, rather than another unique flavor category. Texture simplification; [Brach's](https://www.brachs.com/products/candy-corn) describes honey flavor. Not proposing Honey as a new tag. |
| Chocolate-chip cookie | Cookie, Chocolate | Generic item; recipe assumed from name. |
| Ghost cookie | Cookie | Shape does not imply a different flavor; recipe unspecified. |
| Pumpkin cookie | Cookie | Assuming pumpkin-shaped, not pumpkin-flavored; confirm artwork/recipe. |
| Crayons | Toy | Game shorthand for non-food treats. |
| Dots Original | Fruity, Chewy | [Tootsie](https://shop.tootsie.com/products/dots-assorted-fruit-gum-drops-8-oz-bag) describes chewy fruit gumdrops. |
| Eraser | Toy | Non-food treat. |
| Dubble Bubble Original | Gum | Correct brand spelling; [Tootsie](https://shop.tootsie.com/collections/dubble-bubble). Chewy is omitted as redundant with Gum. |
| Hubba Bubba Original | Gum | [Mars](https://www.mars.com/our-brands/mars-snacking) identifies it as bubble gum. Fruit/mint tags require a particular variety. |
| Trident Original | Gum, Minty | [Trident](https://www.tridentgum.com/products/trident-original-14-pieces) identifies original as sugar-free mint gum. Sugar Free retained only as descriptive metadata in this proposal. |
| Haribo Goldbears Original | Fruity, Chewy | [Haribo](https://www.haribo.com/en-us/products/goldbears) identifies gummy bears with fruit flavors. |
| Hershey's Milk Chocolate | Chocolate | [Hershey](https://www.hersheyland.com/products/hersheys-milk-chocolate-snack-size-candy-bars-10-35-oz-bag.html). No need for Sweet or Candy Bar. |
| Kit Kat Milk Chocolate | Chocolate, Crunchy | [Hershey](https://www.hersheyland.com/products/kit-kat-milk-chocolate-snack-size-candy-bars-10-78-oz-bag.html): milk chocolate and crisp wafers. |
| Life Savers Gummies, Five Flavors | Fruity, Chewy | [Life Savers](https://www.life-savers.com/gummies). |
| Life Savers hard candy, Five Flavors | Fruity, Hard | [Life Savers](https://www.life-savers.com/node) identifies the fruit-flavored hard-candy assortment. Pep-O-Mint would be Minty, Hard instead. |
| Mars Bar, classic UK-style | Chocolate, Caramel | [Mars](https://www.marsbar.co.uk/) describes chocolate, caramel, and nougat. Nougat omitted to avoid another category. Regional variety must match artwork. |
| Mentos Mint, standard roll | Minty, Chewy | [Mentos](https://us.mentos.com/products?_rsc=1dw30) lists mint rolls under Chewy Mints, separately from Hard Mints. |
| Mentos Mixed Fruit, standard roll | Fruity, Chewy | [Mentos](https://us.mentos.com/products/mixed-fruit-14pc-roll). Not Minty merely because the company calls them mints. |
| M&M's Peanut | Chocolate, Peanut, Crunchy | [M&M's](https://www.mms.com/en-us/mms-candy-flavors/peanut-mms-1005oz/ct2155-p.html?pr_rd_page=1): roasted peanuts, chocolate, candy shell. Crunchy is the gameplay texture classification. |
| M&M's Milk Chocolate / Plain | Chocolate, Crunchy | Chocolate with candy shell; simplified game texture. Product family shown by [M&M's](https://www.mms.com/en-us/celebrate/easter). |
| Nerds Original | Fruity, Crunchy | [Nerds](https://www.nerdscandy.com/nerds/) describes fruit flavors and crunchy, tangy candy. Reserve Sour for explicitly sour products. |
| Nuts Candy Bar | Peanut, plus recipe-dependent tag(s) | Unidentified product: do not invent Chocolate or Caramel. If it is a peanut-caramel bar, use Peanut, Caramel. |
| Planters peanuts, plain roasted | Peanut, Crunchy | [Planters](https://www.planters.com/product/unsalted-dry-roasted-peanuts/). No Sweet/Sugar Free classification. |
| Play-Doh | Toy | Game shorthand for non-food treat. |
| Popcorn, plain | Crunchy | Generic recipe assumption. Caramel corn would be Crunchy, Caramel. |
| Razor Knife | Exclude; replace with a toy spider | Editorial recommendation to fit John's cheerful tone; not a candy fact. Toy spider would be Toy. |
| Reese's Peanut Butter Cups | Chocolate, Peanut | [Hershey](https://www.hersheyland.com/reeses). Peanut includes peanut butter in this game. |
| Ruler | Toy | Game shorthand for non-food treat. |
| Skittles Sour | Fruity, Sour, Chewy | [Skittles](https://www.skittles.com/sour) describes sour fruit flavors and chewy texture. |
| Skittles Original (draft: Sweet) | Fruity, Chewy | [Mars](https://www.mars.com/our-brands/all-brands) describes chewy candies; [2026 product description](https://www.mars.com/news-and-stories/press-releases-statements/mars-snacking-us-releases-new-product-options-made) identifies original fruit flavors. |
| Smarties, US tablet rolls | Fruity, Crunchy | [Smarties FAQ](https://www.smarties.com/faqs/) identifies fruit/cream flavors and tablets; [store](https://smartiesstore.com/collections/original-smarties) calls them candy wafers. Crunchy is a simplified crumble/texture classification. Not strongly sour by default. Canadian/UK chocolate Smarties are a different item. |
| Snickers Original | Chocolate, Peanut, Caramel | [Snickers](https://www.snickers.com/mena/en/products/chocolate/snickers-chocolate-bar-50g). Three defining traits; omit nougat and redundant textures. |
| Sour Patch Kids Original | Fruity, Sour, Chewy | [Snackworks](https://snackworks.com/brands/sour-patch-kids/) identifies soft/chewy candies and sour-then-sweet character; fruit variety shown in its lineup. |
| Starburst Original | Fruity, Chewy | [Mars](https://www.mars.com/our-brands/all-brands). Use a named Sour variety if Sour is desired. |
| Tic Tac Fruit Adventure | Fruity, Hard | [Tic Tac](https://www.tictac.com/us/en/product/fruit-adventure/) describes fruit flavors. Hard is the game's texture bucket; omit Minty for fruit flavor even though marketed as mints. |
| Twix Original | Chocolate, Cookie, Caramel | [Twix](https://www.twix.com/products/chocolate/twix-bar-bars?bvstate=pg%3A2%2Fct%3Ar) describes all three. Cookie retained instead of a fourth Crunchy tag. |
| Twizzlers Strawberry Twists | Fruity, Chewy | [Hershey](https://www.hersheyland.com/brands/twizzlers.html). Strawberry variety, not black licorice. |

## Making trades easy

These tags simplify classification but do not, by themselves, eliminate arithmetic from scoring. Recommend three preferences per character for the first playable version: one favorite, one like, one dislike, with all other traits neutral. Keep scoring weights internal and use familiar hearts/faces or the existing ++/+/−− shorthand rather than exposing arithmetic.

When two candies are selected, preview each affected character's resulting satisfaction and a simple up/down/unchanged expression or arrow before confirmation. Show the net effect directly so the human does not have to add trait weights. No implementation or final scoring rule chosen yet.

Start with roughly 12–16 recognizable items covering contrasting traits, then expand the pool. Different wrappers may share a tag combination; variety in art is fine, but too many equivalent choices can crowd out useful contrasts. Retuning profiles is required if Sweet, Candy Bar, and Sugar Free cease to be scoring attributes. Andries's Peanut preference is confirmed as Dislike (−1), not Like.
