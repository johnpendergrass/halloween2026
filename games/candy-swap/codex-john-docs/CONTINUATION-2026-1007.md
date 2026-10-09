# Candy Swap — continuation handoff

Updated October 7, 2026, at the user's request to stop and resume later. **Read this document first.** It supersedes older handoffs wherever their gameplay, data source, artwork location or preference behavior differs.

## Project and documentation boundaries

Repository: `D:/dev/Projects/halloween2026`. Work for this game lives in `games/candy-swap`. Keep Candy Swap-specific Codex notes and handoffs in this `codex-john-docs` folder. Root Codex notes are for project-wide matters. Claude's documentation is separate in `claude-john-docs`; respect the ongoing project and existing conventions. Shared requirements: `games/README - game design requirements.md`. Concept drawings: this game's `design ideas/` folder (2026 1007 first concept of screen PNG/SVG).

## Current playable demo

This is a **single human player** game. Four computer characters own candy. The human proposes trades; the characters decide whether to accept them. Aim to increase their collective happiness through mutually acceptable trades.

1. Tap a candy to select it and show its display name and attributes nearby. Tap it again to deselect.
2. Select a second candy from another character. Selecting a different candy from an already-selected owner replaces that owner's selection. Selection can be revised freely before proposing. At most two candies, with different owners, are selected.
3. Tap **Propose Trade** at the diagonal crossing. The program evaluates both characters immediately.
4. If both individual score changes are >= 0, exchange the candies and update scores immediately. Improvement/even and even/even trades are allowed. If either loses points, nobody trades and scores/ownership remain unchanged.
5. Show the resolved result with each character's Accepts/Declines reaction, preferences, before/after scores and offered/received candy values. Accepted results say Gave/Got; declined results say Offers/Would get and Would be for hypothetical scores.
6. **Next proposal**, an outside tap or Escape dismisses the result and clears selection. These actions never undo or repeat the already-resolved trade. There is no manual swap-confirmation decision.

The result panel stays until dismissed, giving the player time to understand it. No timer, end-game condition, maximum-score calculation or saved progress exists. With voluntary trades, some higher collective scores may be unreachable through individual non-loss trades; this was discussed, not solved or implemented as an end-game feature.

## Characters and preferences — latest decision

Names/positions/placeholder emoji: Jing at top (pumpkin), Yuze right (ghost), Andries bottom (vampire), Noor left (witch).

**Every page load generates random preferences for each character**, drawn from attributes represented in the enabled candy pool. Three distinct attributes: one strong like/favorite (++), one like (+), one dislike (−). The same attribute can occur on different characters. Preferences stay fixed during that game; clearing a proposal does not reroll them. Reload rerolls both candy and preferences. Selection is uniform across available attribute IDs, not weighted by candy frequency; rare traits can therefore appear as favorites.

The short three-line preference display remains next to each portrait, toward the center, approximately 75% of its size. **There are no character preference popups or hover interactions.** The user tried those and decided the compact labels such as Chewy++ were enough. Portraits and preference displays are static sections. Compact abbreviations include Choc, Crunch, Peanut, Mallow, Low sug. Full labels appear in candy information and the result panel.

Encoded `characters` preferences and `candidateProfiles` still exist in data03 as reference/proposals, but runtime replaces each character's preferences with a generated set. Do not silently restore encoded profiles. Earlier corrections included Andries disliking peanuts, but current randomized gameplay has no fixed dislikes.

## Scoring

Each item starts at +1 for its owner. Add every matching displayed attribute's preference adjustment:

| Preference | Adjustment | Total for a candy with only that match |
|---|---:|---:|
| Unlisted / neutral | 0 | 1 |
| Like | +1 | 2 |
| Strong like / favorite | +2 | 3 |
| Dislike | −1 | 0 |
| Future strong dislike | −2 | −1 |

Several matching attributes accumulate. No implied parent matching: Cherry does not automatically match Fruity, Rice does not automatically match Crunchy. Strong dislikes are supported by the scoring weights but not generated currently. The earlier allergy example only explained stronger dislikes; the game need not expose health conditions.

Starting scores are calculated from the dealt candies. Empty collection would score zero. Portrait scores are raw sums, not constrained to the original concept's 0–10 range. The preview header shows the sum across all four characters. Acceptance checks each character independently; a collective gain cannot compensate for another character's loss.

## Layout and touch behavior

Portrait presentation with four regions separated by crossing diagonal lines. Original game panel ratio 1296×2016 (9:14), inside a portrait preview shell (9:16). Six candies per character, 24 total, dealt independently with replacement from enabled items; duplicates are possible. Positions are fixed; candies and ±30° art rotations randomize on reload.

Upright transparent hit boxes are 13vw squares relative to the game iframe, approximately 168×168 design pixels at 1296px width; actual CSS size varies by device. Processed art uses a 13vw square with object-fit containment and rotates independently. Legacy shape/color properties are still assigned but the current CSS presents transparent real artwork rather than colored square/bar placeholders. User explicitly approved art extending beyond the hit box during rotation; overhanging art is not a separate hit target.

Candy info may overlap other candy, as the user approved. It does not intercept touches. Result panel occupies 86% of board height and 90vw width, with overflow scrolling available. Phone layout/ergonomics still merit review on actual Safari.

## Data and artwork

Live demo loads **`assets/gamedata03.json`**. Human-readable companion: `assets/gamedata03.txt`. Earlier `gamedata.txt` and data02 are historical drafts. Catalog: **64 items and 19 shared attributes**, plus `default.png` as fallback art, not a dealable item.

Each item includes stable PascalCase `name`, readable `displayName`, actual `fileName`, measured `imageSize`, 1–3 `attributes`, `graphic`, `kind` and `enabled`. Names and filenames were corrected with the user's authorization; UI uses displayName. Shared attribute IDs are lower camel case. Candy is assumed sweet; no Sweet tag is needed.

Attributes: Chocolate, Fruity, Sour, Mint, Chewy, Hard, Crunchy, Peanut, Caramel, Cookie, Gum, Toy, Coconut, Rice, Low Sugar, Almond, Marshmallow, Cherry, Milk. Recent coverage: Marshmallow 3, Coconut 4, Low Sugar 6, Cherry 1, Milk 1. Sour remains 2. Milk currently represents Whoppers' distinct malted-milk center; Rice means crisped rice. Low Sugar uses explicitly sugar-free/zero-sugar products. These are simplified game traits, not exhaustive ingredient/dietary records.

The user's policy is **representative artwork can show another variety**. Examples: generic Trident is Gum/Low Sugar; Nestlé Nuts is Chocolate/Peanut/Caramel by explicit user direction despite real-world hazelnut packaging; generic Peeps is Marshmallow despite chocolate-covered artwork; generic Oh!asis patties are Chocolate/Coconut despite peppermint artwork. Preserve these choices unless asked to revise them.

All 64 product images plus default are transparent 500×500 RGBA PNGs in **`assets/candybars/`**. Subjects are centered at up to 480×480 with approximately 10px padding. The user moved original photographs to **`assets/original candybar images - not processed/`**. Backups are preserved. Latest 11 additions had `_` prefixes and yielded JetPuffedToastedCoconutMarshmallows, LifeSaversSugarFree, LifeSaversMintSugarFree, Mallomars (correcting Mallowmars), Ohasis, Peeps, TootsiePopsCherry, TootsieRoll, TwizzlersSugarFree, WerthersSugarFree and Whoppers.

Images were processed using the imagegen skill/built-in editing tool, followed by Pillow alpha cropping and resizing. Prompts, generated paths, original checksums and review images are documented in the cutout/expansion handoffs and manifests. Original images were unchanged. `candy-art-gallery.html` previews all 64 images, attributes, dark background, rotation and touch targets.

## Running and verifying

Run **`games/candy-swap/start-touch-test.bat`**. It reuses `start-local/no-cache-server.py`, serves repository root on port **8097**, prints explicit desktop and detected LAN/iPhone URLs and opens the desktop preview. Keep that server window open. Phone and computer must share the local network; user previously confirmed phone access works.

- Desktop: `http://localhost:8097/games/candy-swap/touch-preview.html`
- Phone: use the current LAN address printed by the launcher, followed by the same path. Previously `192.168.0.200`; do not assume it remains unchanged.
- Gallery: `/games/candy-swap/candy-art-gallery.html`

A Codex-started server was running during this session on 8097; check whether it is still running before launching another. No server changes were required in the latest iteration.

Implementation: `index.html`, `candy-swap.js`, `candy-swap.css`, `touch-preview.html`. This is still a standalone demo, not registered in `games.json`. Preview score/clear/target controls use same-origin postMessage; future production integration must follow the project's supported helper/shared requirements.

Current behavioral check: **`node games/candy-swap/codex-john-docs/verify-proposal-demo.cjs`** with the local server running. Uses bundled Playwright and installed Chrome. Latest run passed at 320/390/430px widths ×844px: three distinct generated preferences and correct levels, no preference popup, preserved selection after tapping a portrait, improved/even/declined trades, ownership and scores, result button fit, next-turn reset and no JS errors. Deterministic trade fixtures temporarily override two runtime profiles inside the test only. Old `verify-swap-demo.cjs` tests the superseded manual confirmation flow.

Artwork check: `check-cutout-preview.cjs --gallery` previously passed all 64 images, dimensions, controls and phone overflow. `build-gamedata03.py` regenerates catalog TXT/JSON and gallery; update it when changing records to avoid later regeneration losing edits. `finish-new-cutouts.py` handles the latest 11 generated assets. The older full-processing script is historical and guarded against rerunning when root JPGs no longer exist. Some old screenshots/documentation reflect earlier versions; use current source and this handoff as authority.

## History and likely continuation

1. Started from John's rough Excalidraw diagonal portrait layout to test actual iPhone hit targets. Colored placeholders, initially eight candies each, became six with separate portrait/preference displays.
2. Reworked local startup to print an explicit phone URL; phone connectivity confirmed.
3. Developed candy attributes/profiles in data02 and scoring, changing from zero baseline to +1 per candy plus preferences. Introduced a manual Compare/confirm panel.
4. Processed 53 supplied candy/treat photographs, standardized filenames and built data03. Added shared traits and 11 more images, bringing the library to 64.
5. Clarified that the human proposes, characters decide, and neither character may lose points. Replaced manual confirmation with resolved proposals and a result explanation.
6. Tried tap/hover character preference popups, then removed them at John's request. Latest version randomizes all character preferences and retains compact labels.

Next session should start with the user's observations of the current demo. Potential design topics, not authorized changes: how often rare random preferences yield satisfying trades; whether to balance deals/preferences; whether result feedback needs fewer taps or animation; identifying a stuck/finished game; timer/end-game design; eventual character artwork and app integration. Preserve the simple cheerful premise: easy proposals and understandable reactions, no hard math required from the human.
