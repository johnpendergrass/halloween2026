# Halloween 2026 — Specifications (design decisions)

Last updated: 2026-10-01 12:39 (fourth day, third stretch: discussion only, how the Sound switch could reach a game; two options, not chosen; see 6j. Before that: high scores and switches, see 6i)

This file records WHAT the app looks like and WHY. Technical "how" lives in
`specifications-technical.MD`. Companion notes in this folder:

- `triageRush-layout-reference.MD` — the 9:16 shell specs borrowed from
  triageRush, verified against its shipped code.
- `designing-for-the-frame.MD` — plain-language guide: why game authors can
  mostly ignore devices, and the seven things that still differ.

---

## 1. What the project is

A collection of Halloween mini games, played on phones first, but also on
tablets and PC browsers. Released on GitHub Pages at
`https://johnpendergrass.github.io/halloween2026/` (not yet enabled).

### The plan (John, 2026-09-27)

1. John + Claude build the framework: look, sizing, platforms, technical limits.
2. Build the HOME screen: background animations + menu of games.
3. Write a VERY specific mini-game spec that humans AND AI assistants can follow.
4. Friends write mini games using the scaffold + docs (with their own AIs).
5. Friends become GitHub collaborators; the group finishes the app together.
6. Release on GitHub Pages. Target: Halloween, 2026-10-31.

Because other people's AIs will follow these docs, rules must be precise,
checkable, and backed by a working example game.

### What the app is right now (John, 2026-09-27, after the audit)

**A template for others to insert mini games into.** The frame and the docs
are the product. The Pumpkin Patch and Pie Maker (first named game0 and game1) are **demos**:
not part of the final package, they may change or go. (Update
2026-10-01: Pie Maker is tabled; John now counts the Pumpkin Patch and
Stack-o'-Lantern as "the game". See 6h.) Consequences:

- **The requirements doc is the source of truth; the demos follow it**, not
  the other way round. Where a demo departs from a rule, its own README
  says so in a section "Where this game breaks the requirements, and why",
  so nobody mistakes the exception for the rule.
- **Code is written for an intermediate JavaScript front-end programmer**
  (the friends who will copy it), not for John. Comments explain *why* a
  game does something, not what standard JavaScript or CSS does.

---

## 2. The frame (decided)

- **One 9:16 portrait frame, identical on every device.** No separate desktop
  or tablet layout. On a PC/tablet it floats on a background like a phone on a
  desk. Borrowed from triageRush, where it worked well on phone, tablet and PC.
- Fits whichever limit is smaller (screen width or height); 5% of screen height
  kept above and below; clear of notch/home bar via safe-area insets.
- The page itself never scrolls.
- **Slightly rounded corners on every device**: `clamp(8px, 2.6cqw, 16px)`
  (~10px on a phone). Replaced triageRush's "round only on big screens".
- **Nothing is ever placed outside the frame** (John, 2026-09-27). Modern
  phones have spare space above/below a 9:16 frame, and it differs per
  device. Using it would mean designing per device — explicitly rejected.
  Colouring that space is allowed (decoration only).

## 3. The three panels (decided, mockup v6)

```text
┌─────────────────────┐
│ TOP PANEL           │  1/16 of frame height. Always visible. Never moves.
├─────────────────────┤  Game name, Home icon, ☰ (quick navigation).
│                     │
│    GAME PANEL       │  Everything between the bars -> exactly 9:14.
│                     │  The game's iframe will live here. Nothing covers
│                     │  it unless the player opens the bottom panel.
├─────────────────────┤
│ BOTTOM PANEL strip  │  1/16 of frame height, full width, gentle up arrow.
└─────────────────────┘
```

- **Top panel and closed bottom strip are the same height** (symmetric).
  Measured 42.44px each on a 390px-wide phone.
- **Game panel = exactly 9:14.** Measured sizes: iPhone SE (smallest phone)
  338 × 526, iPhone Pro Max 432 × 672, 1080p PC about 547 × 850. Full-
  sharpness art = 1296 × 2016 (the Pro Max panel at ×3 = the design canvas).
  (Was 3:5 while the bottom panel was a pull tab poking into the game area;
  John rejected the tab so game designers never work around it.)
- **Bottom panel = a drawer.** Closed: just the strip, in its own space.
  Open: slides UP over the lower 55% of the game panel. **The game panel
  never changes size** — same as Halloween2025's right panel, which (checked
  in its code) slid OVER the fixed 950 × 720 game area rather than resizing it.
- The bottom panel has two tabs:
  - **App** — game selection, overall high scores, sound, about/credits.
  - **This Game** — that game's high scores, settings, how to play.
- Rounded corners: top panel's two TOP corners and bottom panel's two BOTTOM
  corners follow the frame. The game panel's edges stay square and crisp.

## 3a. The App tab: an icon picker with an eight-cell board (John, 2026-09-29)

- **Layout (v2, evening of 2026-09-29)**: the home game's button alone and
  centred at the top, then a **board of two rows by four fixed cells**.
  `goes_in_slot` 1–4 are the upper row left to right, 5–8 the lower row.
  A game always sits in its own cell (slot 1 is always top far left),
  empty cells stay empty, so the designer decides the picture. **One
  exception**: when only one row has games, that row is drawn in the
  middle of the two-row space rather than at its top or bottom. Three
  rows of 69 px buttons on a 390-wide phone (61 px on the SE), no
  scrolling; four across is 81% of the panel width with ~9% air each side.
- **Why fixed cells** (John): "keep it simple... absolute positions", "it
  is easy and done." Claude's alternative, kept for later: *option B*, the
  slot picks the row and each row centres itself, which staggers odd
  counts like bowling pins (4 over 3, 2 under 3). John liked it, saw that
  1, 3 over 6, 8 "looks funky" with fixed cells, and may revisit.
- **Layout v1** (afternoon): four slots, two per row under the home
  button. Superseded the same day.
- **A button is just the button shape with the icon inside, no name**
  (John). Orange rounded square, small orange margin, icon scaled inside.
  The name goes to `aria-label` and the mouse tooltip.
- **The current game's button looks pressed IN** (John: "make it
  pronounced"): sunk by the full shadow height, no drop shadow, darker
  orange, deep inset shadow along the top, a mint ring, icon dimmed a
  touch, `aria-current="true"`.
- **Icon spec** (John, 2026-09-29): square, **256 × 256 real pixels**, PNG
  with a transparent background or SVG with a square viewBox; draw
  anything that fills the square and plan for orange around it. **Wiggle
  room**: each side 200–300, sides within 10 px of each other, because
  hand-cropped icons are never exactly square; the app scales it. SVG has
  no pixel size and skips the check.
- **Fallback**: no icon, bad path, or out of spec → the button shows
  `short_title` as text (two lines of ~10 characters; hence "about 12
  characters" for `short_title`). No text either → the default ghost
  (`app/default-icon.svg`), which effectively means "half-filled entry".
  The browser console says why, with the real dimensions.
- Adding an icon never touches `app/`: the designer drops a file in their
  folder and names it in games.json. (The picker itself was the app's own
  one-time change; John first read it as designers editing app files.)

## 3b. The This Game tab (2026-09-29)

Filled from the current game's games.json entry every time a game loads:
icon (same spec/check, in a small orange tile), title, "designer, date",
description, a **How to play** heading + text, "Credits: …".
Blank fields hide together with their headings. Since 2026-10-01 the
icon/title block is centred with a thin rule under it, and between it and
the description sit two columns: High Scores and the switches (see 6i).

## 3c. When games.json will not parse (John, 2026-09-29)

One plain message in the App tab: "games.json has some invalid JSON in it.
You need to fix that file. (A JSON checker such as jsonlint.com will point
at the line.)" Claude built and tested line-number detection from the
browsers' own error messages; John had it removed: "chasing errors is not
the way to go. error codes can change. different devices/browsers." A
line number belongs in the future checker script, not in the app. The
hint about opening through the .bat file appears only when the page really
was opened from disk (`file:`), since that is the only time it applies.

## 4. The flow (real app, 2026-09-27; icons and tabs 2026-09-29)

- App starts on the **home game** (the games.json entry with
  `goes_in_slot: "home"`, currently `pumpkin-patch`), with the bottom panel
  **open** on the App tab: the icon picker (see 3a). **The home game is a real game** (its own folder, html/css/js/assets),
  special only because it is the default: shown at start and whenever no
  other game is active. It will become the HOME screen with animations.
- Tap a game's icon → its page loads in the game panel, the bottom panel
  **closes**, the top panel shows the game's `short_title`, the drawer's
  tab switches to **This Game** (so the next open is about that game), and
  that game's icon button looks **pressed in**.
- **🏠** (top panel) → back to the home game, bottom panel **opens** again
  on the App tab.
  (The mockup's in-game "Quit Game" button was dropped: it needs a message
  from game to app, and messaging is postponed.)
- ☰ or the strip opens/closes the bottom panel by hand.

## 5. Colours (placeholders for judging layers — not final)

Every layer has its own colour AND a visible edge:

| Layer | Colour | Edge |
|---|---|---|
| Stage (outside the frame) | purple `#2e1a44` (v6 TRIAL, was `#07040a`) | — |
| Frame | — | 2px pumpkin `#e8741c` outline |
| Top panel | purple `#2e1a44` | 2px `#9b7cc4` below |
| Game panel | parchment `#eae2d2` (seen only while a game page loads) | — |
| Bottom panel | swamp green `#173229` | 2px `#5fbf8f` above |
| Buttons | pumpkin `#e8741c`, shadow `#b85510` | — |

**v6 TRIAL (pending John's verdict):** stage matches the top panel purple, and
the iPhone status bar is `black-translucent` so the purple shows behind the
clock. John may "nix it" → back to `#07040a` and `black`.

## 6. How games plug in (DECIDED: iframes; scores and switches see 6i)

- **Each game is its own mini website in an iframe** that fills
  the game panel. Reasons: total isolation (one friend's CSS/JS cannot break
  another's), simplest rule for friends ("make a page that works in a 9:14
  box"), each game testable alone. Halloween2025 proved it: its two iframe
  games dropped in with no changes.
- **How games talk to the app (decided 2026-10-01, see 6i):** one helper
  file, `games/game-helper.js`, which calls the app page directly (same
  website, so no `postMessage` is needed). So far it has one call,
  `Halloween.reportScore(number[, text])`. **The app never pauses a game**
  and sends it no signal when the bottom panel opens: pausing is each
  game's own job (John: keep "drop a game in and it runs"). The earlier
  plan here (postMessage messages for score, game over, ready, settings,
  pause/resume, sound) is superseded.
- **Games cannot draw in the bottom panel.** They send data; the app draws
  scores and settings controls. Keeps every game's panel consistent.
- The app owns: the frame, Home button, sound setting, high scores, loading.
- **The list of games is `games.json` at the root (John, 2026-09-29).**
  Goal: *a true import scaffold*. A designer puts their files in
  `games/<folder_name>/` and fills in their entry in games.json. **app.js,
  index.html and styles.css are stable and are never edited by a
  designer**; app.js reads the file at start-up and does the importing
  and (later) the communication.
- **What belongs in games.json (John's test, 2026-09-29): anything the
  player might want while BROWSING games, before tapping one.** Title,
  short title, icon, description, how to play, designer, credits, date,
  slot. Everything else (assets, settings, sizes) lives in the game's
  folder and the app never reads it: the app cannot peek into a game
  without loading it, and loading five games to draw five buttons is
  exactly what we don't want on a phone. If the same fact is in both
  places, **games.json wins** (it is readable before the game runs, and
  it is the app owner's file). High scores will follow the same principle
  later: the app stores them, keyed by `folder_name`.
- **Entry shape v2** (John's field names, snake_case): `folder_name`
  (lowercase, required), `goes_in_slot` (`"home"`, or a whole number 1–8
  = a fixed cell on the two-by-four board, see 3a; any other value, 9 or
  "" say, = listed but not shown, an easy way to bench a game; a duplicate
  slot goes to the first entry in the file),
  `title`, `short_title`, `icon`, `designer`, `credits`, `date` (free text,
  display only), `description`, `how_to_play`. The `_about` block sits at
  the **bottom** of the file so a reader sees data first; it documents
  every field. Dropped from Claude's earlier proposal: `role` and `status`
  (`goes_in_slot` does both jobs), button order (array order), per-game
  colours, translated titles (a second file if the Chinese switch happens).
- Folders: `games/pumpkin-patch/` (home), `games/stack-o-lantern/`,
  `games/game1..8/`, and `games/_TABLED GAMES/` for games not in use
  (see 6h for which is what; any lowercase name works). Each
  has a `README - <GAME NAME>.md` describing how it was made (John's
  naming). The rules live in **one** file,
  `games/README - game design requirements.md` (was five identical copies
  until the 2026-09-27 audit; copies drift, one file can't).
- Messaging was deliberately postponed until test games existed; the first
  part (scores, the switches, the no-pause decision) was settled on
  2026-10-01, see 6i.

## 6a. Game design requirements (for game authors) — v4 (v3 + "living with the app", see 6i)

Full text: `games/README - game design requirements.md` (the only copy).
Key decisions (John):

- **One design canvas: 1296 × 2016 real pixels** = the iPhone 16 Pro Max
  game panel at ×3. Designers draw, measure and export in canvas pixels
  only; CSS pixels appear only in the coder part. (John had been burned
  cropping art to CSS sizes → 3× too small on iPhone.)
- **The whole panel belongs to the game.** The app's edge lines (top
  lavender, bottom mint, side pumpkin outline, 2 CSS px = 6 canvas px) sit
  outside it. A game that wants a border draws it inside its own space.
- Tap target minimum **168 canvas px (13vw)** = 44 CSS px on iPhone SE,
  **still or moving** (v3: the separate 20vw "should" for moving targets was
  dropped; John tested 13vw moving pumpkins on an iPhone 16 Pro and found
  them fine). Gaps 26 (2vw). Keep important taps out of the bottom 65 (5vw).
  Grids: at most 7 tappable columns.
- **Text: three sizes** Small 47 / Medium 58 / Large 117 canvas px
  (3.6 / 4.5 / 9vw, with px floors). v3: the MUST is the *size* (nothing
  below Small); the `.text-*` classes are a SHOULD, since a class name
  cannot be enforced, only a size can (and a checker can read it). Arial
  for now; normal or bold; italics ok; no underline; strikethrough only with
  meaning; line spacing 1.35.
- **`px` floors only, no ceilings** (v3): `max(14px, 4.5vw)` yes,
  `clamp(…, 28px)` no. The panel is never wider than ~730 CSS px, so a cap
  does nothing useful and hides the real size.
- Sprites PNG (transparent) or SVG; backgrounds JPG at 1296 × 2016.
- Colour table (1.7) lists only colours the app itself uses (v3).
- Structure: Part 1 designers (canvas pixels only, never CSS px), Part 2
  coders + AI (18 MUST/SHOULD rules), appendix per-device sizes.
  Information stated once (John: repetition was confusing).

## 6b. Demo game: Pie Maker (TABLED 2026-10-01; folder `_TABLED GAMES/pie-maker`, was game1)

**Status (John, 2026-10-01):** moved out of the games root into
`games/_TABLED GAMES/pie-maker/` and removed from games.json. Its files
are untouched. Stack-o'-Lantern took over slot 1 and the role of "the
example that follows the rules" in the requirements doc, the root README
and the placeholder/test game READMEs. What follows describes the game as
built.

John's design: "asteroids but for pumpkins and without a gun, just tapping."
10 pumpkins of varying size drift in straight lines, spin, and wrap around
the edges; tap → pumpkin pie (stays put); timer from load to last pie;
Play again. Sizes 13%–24% of width (was 12%; changed so the smallest is
44px on iPhone SE). Timer not reported to the app yet (later comms test),
and the number of pumpkins will later be a setting.

After the audit (2026-09-27) it follows the requirements exactly: the 2.2
page-setup block copied verbatim, the `.text-*` classes for all text, no px
ceilings, button `min-height: 13vw`. Its README lists no exceptions. Its
README no longer repeats the device tables from the requirements doc.

## 6c. Demo home game: The Pumpkin Patch (folder `pumpkin-patch`, was game0)

Reused from the Halloween 2025 title screen (John, 2026-09-27): a painted
pumpkin patch under a full moon; a character silhouette (19 of them:
Batman, Totoro, Toy Story, etc.) slowly rises from behind the tree line,
waits, sinks. Decisions:
- **Art fit = "option 1"**: the 950 × 714 paintings are scaled so their
  HEIGHT fills the game panel, sides cropped (`--crop-from-left: 0.25`
  keeps the moon + big pumpkins). Looks soft (enlarged ~2.5× on a ×3
  phone); accepted as a first try. Later options: painting in the lower
  part with dark sky above, or new tall art at 1296 × 2016.
- **Only the horizon popup.** A second popup behind the front pumpkins was
  tried and dropped: the open bottom panel on the home screen covers that
  area, so it was almost always hidden (likely why 2025 dropped it too).
- **Timing**: rise 2–4 s, wait at top 1–4 s, sink 1 s faster than the rise,
  hidden **4–12 s (middle 8 s; John asked for ~20% faster than 2025's
  5–15 s)**. Characters dealt from a shuffled deck (no repeats until all
  have shown); mirrored on the right half so they face inward.
- Known: the open bottom panel hides the lower 55% of the scene on the
  home screen; some silhouettes have a light halo (2025 files).
- **Declared exceptions** (in its README): uses `vh` and `%` of the
  painting instead of `vw` (must fill the panel's height; keeps the
  character aligned with the layers); art is 950 × 714, not 1296 × 2016
  (reused). All 19 silhouettes are preloaded at start so none pops in late
  on a slow connection.

## 6d. Test games: wrong-desktop and wrong-phone are deliberately wrong (2026-09-29; TABLED 2026-10-01)

**Status (John, 2026-10-01):** "get rid of wrong desktop and wrong
phone... rename those games to those names and put them into the _TABLED
GAMES folder." They were the folders `game2` and `game3` (board slots 3
and 4); they are now `games/_TABLED GAMES/wrong-desktop/` and
`games/_TABLED GAMES/wrong-phone/`, with their files renamed to match,
and they are out of games.json. `game2` and `game3` are neutral
placeholders again. The text below was written while they were still
called game2 and game3.

John asked what a designer sees if they drop in a page that was not
written for the panel. Answer, verified: **the app does nothing to it**.
The iframe fills the panel and the page is shown as is, no scaling,
cropping or repair. To make that visible, the two placeholders became
permanent test games, labelled "wrong on purpose" in their titles, page
comments and READMEs, with a "what you will see" section each:

- **game2 "Wrong: desktop size"**: a fixed 1280 × 720 stage in px, the way
  Halloween 2025's games were built. On a phone only the top-left corner
  shows (score, one pumpkin); the page pans with a finger drag; the Reset
  button is off-screen. On a 1080p PC the panel is still under half the
  stage.
- **game3 "Wrong: fixed phone px"**: written for one 390-wide phone in px,
  ordinary 16 px web text, 40 px squares, a 32 px button, an underlined
  link, a page that scrolls. Nearly right on an iPhone 15/16 (the trap),
  clipped on the SE, huddled small in the top-left corner on a PC.

They are the argument for the rules doc. Both must be replaced wholesale
when a real game takes the slot. Since 2026-09-30 both are on the board
again (slots 3 and 4; game3 had been benched for one night to make room
for Hollow Hill).

## 6f. Stack-o'-Lantern (folder `stack-o-lantern`, by Claude, 2026-09-29)

Written in the `game4` folder; moved to its own named folder on 2026-09-30
(John), which freed `game4` to be a placeholder again.

John invited Claude to "design and write a good little game of your own...
whimsical... meme-worthy... something folks will want to play over and
over." Claude chose a one-tap stacker.

- **Play**: pumpkin slabs slide across the sky above a tower; tap to drop.
  The overlap with the slab below becomes the new slab; the overhang is
  sliced off and tumbles away. Less than 0.8vw overlap = a miss = game
  over. A drop within 1.6vw of the edge is **PERFECT**: snaps into line,
  full width kept; every third perfect in a row grows the slab 3vw back
  (up to the 46vw start). Speed 42vw/s × 1.035 per slab, capped at 110.
- **Whimsy**: a giant reaction word per drop (PERFECT x5 in gold, nice,
  close one, yikes, oof, SPLAT.), a moon with a face (wide-eyed "o" on
  perfect, flat mouth on sloppy, frown at the end), every 7th slab a pale
  ghost pumpkin, and an end screen that turns the count into a height
  ("10 = a basketball hoop, 18 = a giraffe, 320 = Big Ben. Please go
  outside."). John: "that was a fine little game."
- **Decisions**: no images at all (slabs, stars, moon are CSS) so it loads
  instantly; the camera keeps the tower top at 42% of the stage; the
  ground is part of the scrolling world (a pinned ground made the lower
  slabs look like they sank); Best is per visit (rule 18).

## 6g. Hollow Hill (TABLED 2026-09-30; folder `_TABLED GAMES/hollow-hill-cc`)

**Status (John, 2026-09-30):** "keep the game folder... remove all
references to it in the actual game, game json and such. we will consider
changes to it and using it later." John renamed the folder himself; the
games.json entry is gone and nothing in the app points at it. The files
inside are untouched. On 2026-10-01 John moved it from
`games/_NOT-USED-hollow-hill-cc/` into the new `games/_TABLED GAMES/`
folder (see 6h). What follows describes the game as built on 2026-09-29.

John then asked for "a more complicated and involved adventure type game...
10-15 minutes... Freddi Fish or Pajama Sam... d&d type games in caves...
easy controls... tap friendly around the game edges... create the artwork
yourself". Claude pitched and built a point-and-click adventure.

- **Story**: the Great Pumpkin on Hollow Hill has gone dark; the vampire
  mayor (in a bathrobe) sends you to relight it. Three things needed: a
  way through the hill gate, a candle, and a true Halloween flame (a
  will-o'-wisp).
- **Map**: village square (hub) with exits to the hill gate (north), the
  graveyard (east, then the crypt), the chapel (west) and the bog (south);
  the hilltop beyond the gate. Seven scenes.
- **Three chains, any order**: (1) scarecrow Stitch wants his hat; the
  crows trade it for something shiny; a spoon is stuck in the bog mud
  (three pulls; the frogs hint). (2) Ghost organist Madame Wail's pipes
  are full of bats; bats love candy corn (you start with a bag); she gives
  her last beeswax candle. (3) Skeleton Fibula has a spare jar but lost
  his skull in the crypt; the crypt door opens by tapping its four
  carvings moon, bat, pumpkin (order carved on his tombstone; a wrong tap
  resets); return the skull, get the jar, catch a drifting wisp.
- **Finale**: through the gate, up the hill, candle first, then the wisp;
  the pumpkin blazes, the village windows light, the mayor: "THE CANDY
  ECONOMY IS SAVED!" End screen: time + rank (<6 min Legend, <10 Night
  Navigator, <15 Steady Lantern-Bearer, else Thorough Trick-or-Treater).
- **Controls (all taps)**: hotspots in the picture (glow once on entering
  a scene, ring while an item is held, never under 14vw); orange arrow
  tabs on the scene edges labelled with the destination (16vw); an
  inventory strip (14vw tiles: tap to hold, tap a target to use); a
  dialogue box (three Medium lines; tap to continue); a **?** hint button
  that names exactly the next step and pulses after a minute without
  progress. Every character answers every item, usually with a joke. No
  dead ends, nothing can be lost.
- **Decisions Claude made while John was away**: first person (no player
  sprite: halves the art, Myst-style), a hint button (yes), the wrong test
  game `game3` benched (slot "") rather than deleted, Hollow Hill in its
  own lowercase folder. Layout: scene 112vw tall + dialogue 26vw +
  inventory 17.6vw = the 155.6vw panel. All art is flat SVG drawn in code
  (no downloads, no licences). No saving (rule 18): one sitting.

## 6h. The folders and the board (John, 2026-09-30)

John wants a complete set of numbered placeholder folders next to the
named games, so a designer always has a neutral folder to copy or take
over. As of 2026-10-01 (Pie Maker and the two wrong test games tabled,
Stack-o'-Lantern moved from slot 2 to slot 1):

| Folder | What it is | Slot |
|---|---|---|
| `pumpkin-patch` | the home game | home |
| `stack-o-lantern` | Claude's stacker, the example that follows the rules | 1 (John) |
| `game2`..`game8` | neutral placeholders | 2–8 (same number as the folder) |
| `game1` | neutral placeholder | "" (benched: Stack-o'-Lantern has cell 1) |
| `_TABLED GAMES/pie-maker` | tabled 2026-10-01, no entry | none |
| `_TABLED GAMES/wrong-desktop` | was `game2`, wrong on purpose: desktop px; tabled 2026-10-01 | none |
| `_TABLED GAMES/wrong-phone` | was `game3`, wrong on purpose: phone px; tabled 2026-10-01 | none |
| `_TABLED GAMES/hollow-hill-cc` | tabled, no entry | none |

John (2026-10-01): the game now consists of only `pumpkin-patch` (home)
and `stack-o-lantern` (game 1); "keep default demo game folders 1-8 in
the games folder". The placeholders' slots (gameN in cell N, `game1`
benched) are Claude's choice, to be confirmed.

- **`games/_TABLED GAMES/` (John, 2026-10-01)** holds games that were
  written and tested and are worth keeping, but are not used in the app.
  **Only a game that is actually used in the app has its own folder
  directly under `games/`** (`stack-o-lantern`, `pumpkin-patch`, ...).
  Tabling a game = move its folder in there and remove its games.json
  entry; nothing in the app points into that folder, so its capitals and
  the space in its name are harmless.
- **A neutral placeholder** shows its name ("Game 5"), the line
  "Placeholder page for Game 5." and the measured size of the game panel.
  It follows the rules doc (page-setup block, text classes), so it is a
  correct starting point, unlike the two wrong test games. Its games.json entry has a
  title and short title only; the button shows the text fallback.
- **Slot 1 is John's** (on 2026-09-30 slots 1 and 2 were: Pie Maker and
  Stack-o'-Lantern). The rest is Claude's choice, flagged to
  John and open: nine entries for eight cells means one sits out
  (`game1`, since Stack-o'-Lantern has cell 1). Changing it is one number
  per entry in games.json.
- There is no `game1`..`game8` to slot 1..8 rule. The folder name and the
  slot are independent (that is the point of `goes_in_slot`).

## 6i. Scores, switches and the no-pause rule (John, 2026-10-01)

**The principle (John): a designer drops a game in and it runs.** The app
does little to a game; what it does not do is the game's own job.

- **No pause from the app.** The player can open the bottom panel at any
  time; it covers the lower 55% of the game; the game is not paused,
  stopped or told, and cannot detect it. Pause, continue, start and
  restart are each game's own responsibility. Considered and rejected the
  same day: pause hooks in the helper, a helper-run game loop, an
  app-drawn "tap anywhere to continue". Reason: they add complexity for
  every designer. Stack-o'-Lantern has no pause.
- **High scores**: always shown for every game in the This Game tab, left
  column: "High Scores" + a small **Clear scores** button, then five
  lines `1.  42  (10-01-2026)` (rank, score right-adjusted, date smaller
  and dimmer), `---` where empty. The table is as wide as its content and
  centred, so short scores leave an indent each side and a text score
  widens it. A score is a number (ranks, higher is better) with optional
  text shown in its place (`reportScore(42, "Master Chef")`). 0 or less
  is not recorded. The app adds the date. Clear scores asks
  "You sure?  Yes  No" first; it clears only the current game's list.
- **Switches**, right column: **Sound** always first (one switch for the
  whole app; decided: it is to work immediately), then up to three on/off switches
  the designer declares in games.json (`settings`: label + default 0/1).
  **A game switch applies to the next newly started game**, never
  mid-game. Their purpose: a few simple options without building an
  options screen. Anything that changes mid-game, or more than three, is
  the game's own job. Now declared: Pumpkin Patch "Slow / Fast",
  Stack-o'-Lantern "Easy / Hard".
- **Not connected yet**: no game can read Sound or its switches (the
  helper has only `reportScore`); the switches are shown and remembered.
  The hint line "Game options apply to your next game." under a game's
  switches is under discussion (John deferred it).
- **Kept on the device**: scores and switch positions live in the
  browser's `localStorage`, because a page on GitHub Pages can read
  games.json but cannot write to it. No shared scoreboard, no player
  names, and no structure for either (John).
- This changes the older note "settings live in the game's own folder":
  the three switches are in games.json; a game's own options screen, if
  any, stays in its folder.
- The title block of the tab (icon, name, byline) is centred with a thin
  rule under it.
- Written into the requirements doc as **version 4**: section 1.8, section
  2.5, rules 18 to 22. **The docs describe what exists, not what is
  planned** (John): they say the switches are shown and remembered and
  that no game can read them. "Sound works immediately" and "a game
  switch applies to the next game" are John's decisions for the next
  step; they are not yet rules in the designers' docs.

## 6j. OPEN QUESTION: how the Sound switch reaches a game (discussed 2026-10-01, NOT decided)

**First thing to settle in the next session.** Nothing here is built, and
none of it is in the designers' docs.

A name (John): the main app is called **Halloween 2026**; the games it
shows are the iframe games.

What John wants: Sound ON in Halloween 2026 lets the game play sounds;
Sound OFF stops the game's sound **immediately**, also sound that is
already playing (music).

The fact that shapes the answer: **Halloween 2026 cannot force a game to
be silent.** Browsers have no "mute this iframe" switch. Sound on/off
works only if the game cooperates, and the helper file
(`games/game-helper.js`) is where that cooperation lives. Communication
itself is not the problem: the two pages come from the same website, so
either one can call a function in the other (that is how `reportScore`
works today, game to app; the other direction is equally possible).

- **Option A: the game asks (the designer does the work).** The game
  plays its own sounds. Before each one it asks `Halloween.soundIsOn()`
  and plays only on a yes.
  - Good for short effects (a pop, a thud).
  - Does not stop a sound already playing. For that the game must also
    be told when the switch flips: it hands the helper a function to run
    at that moment and writes the code that stops its own music. Extra
    code in every game that has music.
- **Option B: the helper plays the sounds.** The game never plays a sound
  itself; it calls something like `Halloween.playSound("pop.mp3")` or
  `Halloween.playMusic("tune.mp3")`. The helper keeps a list of what it
  started. When the player flips Sound, Halloween 2026 calls a function
  of the helper inside the game's page, and the helper mutes or un-mutes
  everything in its list at once.
  - Immediate on and off with no designer code; the game's own code is
    not involved and does not have to "watch" anything (it is a function
    call at the moment of the flip, not a variable somebody checks).
  - Looping music becomes audible again on ON.
  - The catch: it is a rule, not a lock. A designer who plays sound
    around the helper is not silenced. The requirements doc would have to
    say "all sound goes through the helper".
- **Both**: B, plus A's `soundIsOn()` for a designer who needs to know.
- **Rejected by Claude**: Halloween 2026 reaching into the game's page to
  mute what it finds. It catches only some kinds of sound.

Claude's recommendation: **B** (it fits "a designer drops a game in and
it runs"). **John has not chosen.** His last question was whether the
game must "pay attention" for an immediate OFF; answer: not in B, yes in
A.

To test when built: an iPhone plays no sound before the player's first
tap. Unknown whether a tap on the Sound switch (in Halloween 2026's
page) counts for the game's page, or the first tap must be inside the
game.

The game switches (Slow / Fast, Easy / Hard) were not discussed this
stretch; 6i still holds (they apply to the next newly started game).

## 6e. games.json v2: the first proposal (2026-09-29, superseded)

Kept for the reasoning. The shape actually built is in section 6 above;
the differences: John's `goes_in_slot` replaced `role` + `status`, field
names became snake_case, `credits` was kept, and the icon spec gained its
wiggle room (3a). Original proposal:

| Field | Use |
|---|---|
| `folder` | replaces `slot`; the only required field |
| `title` | long name, on the button |
| `shortTitle` | top bar (narrow, shares space with two icons); falls back to `title` |
| `icon` | path relative to the game folder, e.g. `assets/icon.svg`; on the button and beside the top-bar title; default pumpkin when missing |
| `designer` | free text |
| `date` | `YYYY-MM-DD`, finished or last changed |
| `role` | `"home"` on one entry; removes the hidden "home must be game0" rule |
| `status` | `ready` / `test` / `hidden`; hidden = no button, entry stays; test = small tag on the button |
| `description` | one or two sentences, This Game tab |
| `howToPlay` | short paragraph (later: a file path), This Game tab |
| `credits` | art / sound / idea sources, About area |

**Deferred until the message contract exists:** `scoring`
(none / points / time), `settings`, `sound`, `pausable`.

**Not added, on purpose:** button order (array order does it), per-game
colours (the app's buttons should look alike), translated titles (a
second file if the Chinese switch happens).

**Icon convention:** every game keeps `assets/icon.svg` (or a square
256 px PNG). Drawn at about 60 canvas px in the top bar, about 120 on the
button. Goes into requirements doc v4 with a "your games.json entry"
section.

## 7. Lessons from Halloween2025 (`D:\dev\projects\halloween2025`)

Desktop-only 1280 × 720, a host (`js/main.js`) with games exposing
`render/start/stop/getScore`.
- Keep: iframe wrapper for standalone games; `games/<id>/` folder convention;
  placeholder when a game fails to load; one switch function (stop old →
  render → start new).
- Fix: adding a game meant editing 3 places (→ one entry in games.json,
  nothing in the app's code); built-in games shared
  global CSS names and document listeners (→ iframes); iframe games could not
  report scores (→ message contract); unprefixed localStorage keys (→ prefix
  with game id).
