# Halloween 2026 — Specifications (design decisions)

**PROJECT FINISHED 2026-10-18 (John: "it will likely be opened for bug fixes, but i am not planning any additional games or features"). This file describes the game as it ships; bug fixes only from here.**

Last updated: 2026-10-18 13:04 (6q: the marks in a score's notes, for Stack's CHEAT rounds; 6r: the GAMES tab rebuilt: a rainbow title, a row of three labelled icons, credits; the second tab PATCH / STACK / FISH; before that 2026-10-18 12:14: 6p: three games on a diagonal board, the tab named for the game, the Pumpkin Patch's tab, no switches, an *italic* mark; before that 2026-10-17 17:57: 6o: the choices feature tried and removed; 16:27: 6n: the iPhone double-tap zoom, reportScore's place, Stack's byline; 14:41: 6m: a Settings button on the right of the top bar, Home → GAMES, Settings → THIS GAME; before that 2026-10-16 17:15: 2: no zoom on the shell page; 6f moved to the game's folder; 6i: Stack's switch dropped; before that: 15:34 names, 15:45 one control point, 15:00 tabled games removed)

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
are the product. The Pumpkin Patch (first named game0) is a **demo**:
not part of the final package, it may change or go. (Update 2026-10-01:
John counts the Pumpkin Patch and Stack-o'-Lantern as "the game". See
6h.) Consequences:

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

**No zoom on the shell page (John's phone, 2026-10-16).** The game panel
appeared magnified edge to edge with the top bar scrolled out of view: a
double tap on the top bar or the frame's margins, or two thumbs down at
once, had triggered the browser's zoom on the shell page. The games block
zoom inside their own panels; the shell now does too (`touch-action:
pan-y` on html and body: vertical panning only, so the THIS GAME tab
still scrolls). The iframe cannot move the shell by itself.

## 3. The panels (decided, mockup v6; ONE CONTROL POINT 2026-10-16; TWO BUTTONS since 2026-10-17, see 6m)

```text
┌─────────────────────┐
│ TOP PANEL           │  1/16 of frame height. Always visible. Never moves.
├─────────────────────┤  Home on the left, game name centred, ☰ Settings on the right (2026-10-17).
│                     │
│    GAME PANEL       │  Everything below the top panel -> exactly 9:15.
│                     │  The game's iframe lives here. Nothing covers
│                     │  it unless the player opens the bottom panel.
│                     │
└─────────────────────┘  BOTTOM PANEL: out of sight until Home or Settings is tapped.
```

- **Two buttons (John, 2026-10-17; see 6m).** Home opens the bottom panel
  on GAMES, ☰ Settings opens it on THIS GAME; the button whose tab is
  showing closes it, the other just switches the tab.
- **One control point (John, 2026-10-16; superseded 2026-10-17).** The top panel holds a Home
  button and the game's name, nothing else. Home opens the bottom panel
  on the THIS GAME tab; Home again, or a tap on the game above the open
  panel, closes it. Picking a game from the GAMES tab closes it too. Gone
  that day: the ☰ button, the bottom strip with its arrow, and the
  "home" slot (see 4). John's reason: two ways to reach the same panel
  (the top buttons and the strip) were one too many, and the strip took
  a row of the frame for nothing.
- **Game panel = exactly 9:15** (15/16 of the frame). Measured: iPhone SE
  338 × 563, iPhone 15/16 382 × 637, Pro Max 432 × 720, 1080p PC about
  547 × 912. Full-sharpness art = 1296 × 2160 (the Pro Max panel at ×3 =
  the design canvas). History: 9:14 from 2026-09-27 to 2026-10-16, while
  the strip sat below the game; 3:5 before that, while the bottom panel
  was a pull tab poking into the game area (John rejected the tab so game
  designers never work around it). The three games of 2026-10-16 were
  checked at 9:15 before the change and after it: Candy Go Fish centres
  its 154vw board in the taller panel (a little more felt above and
  below), Stack-o'-Lantern re-reads the panel's shape, the Pumpkin Patch
  crops a little more of its painting's sides.
- **Bottom panel = a drawer.** Closed: slid fully below the frame,
  invisible. Open: slides UP over the lower 55% of the game panel. **The
  game panel never changes size** — same as Halloween2025's right panel,
  which (checked in its code) slid OVER the fixed 950 × 720 game area
  rather than resizing it. While the panel is open an invisible sheet
  lies over the game: a tap there closes the panel and never reaches the
  game (which is not paused either way, see 6i). John: "it would be
  fine if the tap was not registered by the actual game."
- The bottom panel has two tabs (labelled GAMES and THIS GAME since
  2026-10-16, John's rename; App and THIS GAME before that):
  - **GAMES** — game selection: the board (3a).
  - **THIS GAME** — that game's high scores, switches, how to play.
- Rounded corners: top panel's two TOP corners and the drawer's two
  BOTTOM corners follow the frame. The game panel's edges stay square;
  its two bottom corners are now clipped by the frame's rounding (a few
  pixels of the game, decoration only; see the rules doc's size table).

## 3a. The GAMES tab: an icon picker with an eight-cell board (John, 2026-09-29) — THREE CELLS ON A DIAGONAL SINCE 2026-10-18, see 6p

- **Layout (v2, evening of 2026-09-29)**: a **board of two rows by four
  fixed cells**, centred in the tab. (Until 2026-10-16 the home game's
  button sat alone above the board; it went with the "home" slot, see 4.)
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

## 3b. The THIS GAME tab (2026-09-29; named for the game since 2026-10-18, see 6p)

Filled from the current game's games.json entry every time a game loads:
icon (same spec/check, in a small orange tile), title, "designer, date",
description, a **How to play** heading + text, "Credits: …".
Blank fields hide together with their headings. Since 2026-10-01 the
icon/title block is centred with a thin rule under it, and between it and
the description sit two columns: High Scores and the switches (see 6i).

**A game's name, two ways (John, 2026-10-16).** The title and the short
title may carry the text marks (6i). In the tab, a `\n` in the title makes
a second line, and a game's own look (styles.css 5b) may size the lines:
Candy Go Fish's title is `__GO FISH!__\nCandy Edition`, GO FISH! big in
the gold over a smaller "Candy Edition" (no exclamation mark on the
subtitle, John's call; the welcome screen lost its mark to match), with
a wider gap to the candy plate ("cramped together"). In the top bar the
short title is rendered with its marks too: an `__accent__` is the
shell's pumpkin orange, the rest white; Candy Go Fish's
`__GO FISH!__ - Candy Edition` shows the name at the bar's size and
"- Candy Edition" at about three quarters (its 5b rule). The bar cuts a
name that is still too long with an ellipsis rather than pushing Home
aside; about 24 characters fit on the smallest phone. Tabs are labelled
GAMES and THIS GAME (renamed this day from App / This Game; CURRENT GAME
was tried for a minute).

## 3c. When games.json will not parse (John, 2026-09-29)

One plain message in the GAMES tab: "games.json has some invalid JSON in it.
You need to fix that file. (A JSON checker such as jsonlint.com will point
at the line.)" Claude built and tested line-number detection from the
browsers' own error messages; John had it removed: "chasing errors is not
the way to go. error codes can change. different devices/browsers." A
line number belongs in the future checker script, not in the app. The
hint about opening through the .bat file appears only when the page really
was opened from disk (`file:`), since that is the only time it applies.

## 4. The flow (real app, 2026-09-27; icons and tabs 2026-09-29; one control point 2026-10-16)

- App starts on **the game in slot 1** (currently `pumpkin-patch`, the
  watch-only patch; Stack-o'-Lantern moved from slot 1 to slot 2 for it
  and the game2 placeholder is benched), with the bottom panel **open**
  on the GAMES tab: the icon picker (see 3a). Until 2026-10-16 a separate
  "home" entry (`goes_in_slot: "home"`, its own button above the board)
  played this part and 🏠 returned to it; John folded it into slot 1:
  "lets make game #1 the startup game, move pumpkin patch into that."
  No slot 1 at all → the lowest slot stands in; no slots at all is a
  start-up error in the GAMES tab.
- Tap a game's icon → its page loads in the game panel, the bottom panel
  **closes**, the top panel shows the game's `short_title`, and that
  game's icon button looks **pressed in**. (Until 2026-10-17 the drawer's
  tab also switched to THIS GAME once the slide was over; now Home and
  Settings each choose the tab when they open the panel, see 6m.)
- **🏠** (top panel) → opens the bottom panel on **THIS GAME** for the
  current game; the player may switch to the GAMES tab from there. 🏠
  again, or a tap on the game above the panel, closes it. Home no longer
  changes the game: the Pumpkin Patch is reached through its slot 1
  button like any other game.
  (The mockup's in-game "Quit Game" button was dropped: it needs a
  message from game to app, and messaging is postponed. The ☰ button and
  the strip under the game, a second way to open and close the panel,
  were dropped on 2026-10-16.)

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
  another's), simplest rule for friends ("make a page that works in a 9:15
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
  (lowercase, required), `goes_in_slot` (a whole number 1–8, slot 1 = shown at start; `"home"` existed until 2026-10-16
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
  `games/game1..8/` (see 6h for which is what; any lowercase name
  works). Each
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

- **One design canvas: 1296 × 2160 real pixels (1296 × 2016 until 2026-10-16)** = the iPhone 16 Pro Max
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
- Sprites PNG (transparent) or SVG; backgrounds JPG at 1296 × 2160.
- Colour table (1.7) lists only colours the app itself uses (v3).
- Structure: Part 1 designers (canvas pixels only, never CSS px), Part 2
  coders + AI (18 MUST/SHOULD rules), appendix per-device sizes.
  Information stated once (John: repetition was confusing).

## 6c. Demo home game: The Pumpkin Patch (folder `pumpkin-patch`, was game0)

Reused from the Halloween 2025 title screen (John, 2026-09-27): a painted
pumpkin patch under a full moon; a character silhouette (19 of them:
Batman, Totoro, Toy Story, etc.) slowly rises from behind the tree line,
waits, sinks. Decisions:
- **Art fit = "option 1"**: the 950 × 714 paintings are scaled so their
  HEIGHT fills the game panel, sides cropped (`--crop-from-left: 0.25`
  keeps the moon + big pumpkins). Looks soft (enlarged ~2.5× on a ×3
  phone); accepted as a first try. Later options: painting in the lower
  part with dark sky above, or new tall art at 1296 × 2160.
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
  character aligned with the layers); art is 950 × 714, not 1296 × 2160
  (reused). All 19 silhouettes are preloaded at start so none pops in late
  on a slow connection.

## 6f. Stack-o'-Lantern (slot 2) — MOVED 2026-10-16

The game's design record (what was section 6f here since 2026-09-29, plus
the 2026-10-16 afternoon of EASY / HARD, milestones, end words and the
moon's verdict) now lives with the game:
`games/stack-o-lantern/_documents/claude-john-docs/specifications.MD`. Shell
facts: slot 2; it declares no switches since 2026-10-16 (its EASY / HARD
toggle is its own, see 6i); it sends the mode as the score's note.

## 6h. The folders and the board (John, 2026-09-30)

John wants a complete set of numbered placeholder folders next to the
named games, so a designer always has a neutral folder to copy or take
over. As of 2026-10-16 (Stack-o'-Lantern moved from slot 2 to slot 1
on 2026-10-01; Candy Go Fish took slot 8 in October; every game that
was ever tabled was deleted for good on 2026-10-16):

| Folder | What it is | Slot |
|---|---|---|
| `pumpkin-patch` | the watch-only patch; slot 1 = shown at start (was the "home" game until 2026-10-16) | 1 |
| `stack-o-lantern` | Claude's stacker, the example that follows the rules | 2 (John's slot 1 until 2026-10-16) |
| `candy-go-fish` | GO FISH - Candy Edition (its title), John + Codex's card game; its own docs in its folder | 8 |
| `game3`..`game7` | neutral placeholders | 3–7 (same number as the folder) |
| `game1`, `game2`, `game8` | neutral placeholders | "" (benched: cells 1, 2 and 8 are taken) |

John (2026-10-01): the game now consists of only `pumpkin-patch` (home)
and `stack-o-lantern` (game 1); "keep default demo game folders 1-8 in
the games folder". The placeholders' slots (gameN in cell N, `game1`
benched) are Claude's choice, to be confirmed.

- **Only a game that is actually used in the app has a folder under
  `games/`** (John, 2026-10-01). A game that is dropped is deleted, folder
  and games.json entry together; nothing is kept "for later" in the repo
  (John, 2026-10-16: the games once parked in a tabled folder were all
  abandoned and are gone, from the code and from these docs).
- **A neutral placeholder** shows its name ("Game 5"), the line
  "Placeholder page for Game 5." and the measured size of the game panel.
  It follows the rules doc (page-setup block, text classes), so it is a
  correct starting point. Its games.json entry has a
  title and short title only; the button shows the text fallback.
- **Slot 1 is John's.** The rest is Claude's choice, flagged to
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
- **High scores**: always shown for every game in the THIS GAME tab, left
  column: "High Scores" + a small **Clear scores** button, then five
  lines `1.  42  (10-01-2026)` (rank, score right-adjusted, date smaller
  and dimmer), `---` where empty. The table is as wide as its content and
  centred, so short scores leave an indent each side and a text score
  widens it. A score is a number (ranks, higher is better) with optional
  text shown in its place (`reportScore(42, "Master Chef")`). 0 or less
  is not recorded. The app adds the date. Clear scores asks
  "You sure?  Yes  No" first; it clears only the current game's list.
- **2026-10-15: the app's Sound switch is gone** (see 6j and 6k). Sound
  lives in each game. The scores list is five lines (ten was tried that
  day and found too tall) and a score may carry **up to two short
  notes** after the date (`reportScore(3, "3-2", ["vs. Ron", "3 set game"])`).
  A game with no switches gets no switch column; its scores use the full
  width. The tab's text (title, description, how_to_play) may use small
  marks: `**bold**`, `__accent__` (a look the game defines), `~~rainbow~~`
  (a colour per letter), `\n` for a line break, `!! ` for a shaded line;
  and a game may have its tab drawn in its own style through a
  `look-<folder>` class and a marked section 5b of the app stylesheet.
- **Switches**, right column (as first built): **Sound** always first (one switch for the
  whole app; decided: it is to work immediately), then up to three on/off switches
  the designer declares in games.json (`settings`: label + default 0/1).
  **A game switch applies to the next newly started game**, never
  mid-game. Their purpose: a few simple options without building an
  options screen. Anything that changes mid-game, or more than three, is
  the game's own job. Now declared: Pumpkin Patch "Slow / Fast" only.
  (Stack-o'-Lantern declared "Easy / Hard" until 2026-10-16, when the game
  grew its own EASY / HARD toggle in its info bar and dropped the entry:
  one control, not two that disagree.)
- **Not connected yet**: no game can read Sound or its switches (the
  helper had only `reportScore` until 2026-10-17, when `bestScore()` joined it, see 6l); the switches are shown and remembered.
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

## 6j. How the Sound switch reaches a game (discussed 2026-10-01; RESOLVED 2026-10-15 by removing the switch)

**Resolved on 2026-10-15:** John had the app's Sound switch deleted ("it
is now in the game"). Every sound control is the game's own, inside its
page; the designers' docs say so (1.8, rule 20). The discussion below is
kept for the reasoning. Nothing of options A or B was built.

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

## 6k. Candy Go Fish (slot 8) — MOVED 2026-10-16

The game's design record (what was section 6k here, 2026-10-07 to 10-16, about 450
lines) now lives with the game:
`games/candy-go-fish/_documents/claude-john-docs/specifications.MD`. The game is
RELEASABLE as of 2026-10-16. Rule from then on: a game's claude-john-docs lives in
its own `_documents/claude-john-docs/`; this root folder is the shell's only.


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

## 6l. The helper's second call, and Clear scores reloads the game (John, 2026-10-17)

Stack o' Lantern shows a "High score" of its own in its top corner. It
started at 0 on every load while the shell's list kept last week's best
("the high scores get out of sync ... if i clear the high scores in the
shell, it should clear the high score in the game"). Two decisions:

- **`Halloween.bestScore()`**: a game MAY ask the app for its top saved
  score (a number; 0 outside the app or with none saved) and seed its own
  display from it. The helper's promise becomes "one call to tell, one
  to ask" (requirements rule 19 and section 2.5 updated). No other read
  yet: a game still cannot see the whole list or its switches.
- **Clear scores loads the game again.** After emptying the list the app
  reloads the game panel's iframe, so whatever the game shows starts
  over. A round in progress is lost, which is fair for a deliberate,
  two-tap clear.

Also for Stack that day, in the shell: the game's name is "Stack o'
Lantern" (title and `short_title`, so the top bar shows the full name,
as Go Fish's does); its THIS GAME text is six short centred lines with
marks, in Go Fish's manner ("too wordy ... shorter, lighter"), with a
small per-game look in `styles.css`; its scores carry the level reached
as the note ("16 (10-17-2026) Giraffe"); and the Home icon is larger
within the unchanged bar ("I do not want to change the shell's top bar").

## 6m. A Settings button on the right of the top bar (John, 2026-10-17)

"currently when a game is playing it has the top bar of HOME, game
name, nothing. Lets put a settings icon in the top right corner
(mirroring the home icon) - the one with three lines. The new
behaviors will be HOME takes you back to the shell GAMES tab, SETTINGS
takes you to the shell this game tab."

So the top bar is 🏠, the game's name, ☰, the two buttons the same
size so the name stays centred (the empty spacer that did that job is
gone). Home opens the bottom panel on GAMES; Settings opens it on THIS
GAME; if the panel is open on the other tab, the button switches the
tab; the button whose tab is showing closes the panel. A tap on the
game above the open panel still closes it, and picking a game still
closes it. Picking a game no longer switches the panel to THIS GAME
behind the scenes, since each button now chooses its own tab. The
2026-10-16 "one control point" is history: the ☰ came back, with a
different job from the old one (which opened the same panel as Home).

Also that afternoon: Stack o' Lantern's credits line in the THIS GAME
tab became "Credits: v 0.19.2 10/2026 claude/jp" (games.json), in Go
Fish's format.

## 6n. The iPhone double-tap zoom, the score's place, no byline for Stack (John, 2026-10-17)

**The zoom.** A quick double or triple tap on a game zoomed the whole
shell on John's iPhone (Chrome): the frame grew past the screen and the
top bar sat behind the address bar, with no way back but a reload,
because the no-pinch rule of 2026-10-16 (section 2) had closed the
pinch that would have undone it. The 10-16 fix had treated the symptom
from the wrong side. The decision: the page refuses the second tap of a
double tap (a touch ending within 350 ms of the previous one), in every
game through the helper and in the shell itself. The cost: that second
tap's click is lost too, so a button needs a fresh tap after a fast one.
Stack acts on the touch itself and never notices; Go Fish's cards lose
only the fast second tap. The viewport line's no-zoom request and a
no-double-tap rule on the frame stay as well, but on the iPhone they are
requests only; the technical spec (4n) has the hunt.

**The place.** `reportScore` now answers with the score's place in the
five-line list, 1 to 5, or 0. Stack uses it for a green TOP 5 SCORE!
balloon and a smaller celebration than a new best. Any game may use it
or ignore it. An equal score sits below the earlier one, so a score that
only matches the best is place 2: a tie is a top five, not a new best.

**No byline.** Stack's THIS GAME tab showed "Claude, September 29,
2026" under the title and a credits line at the bottom. John: "remove
that. it is already at the bottom." Stack's `designer` and `date` are
blank in `games.json`, so the byline hides (the shell hides any empty
line); other games keep theirs.

## 6o. A game setting in the tab, tried and withdrawn (John, 2026-10-17)

For one hour the THIS GAME tab had a drop-down above the high scores,
"Starting level" for Stack o' Lantern, which the game read through a
third helper call. It was John's ask ("a useful debugging feature for
now") and it bent the rule of 6i that a game cannot read its own tab.
Offered the alternative, John chose the game's own welcome screen ("i
would rather that the anchor pumpkin slice show its level ... if the user
clicks on it the popup comes up"), and the shell went back to how it
was: two helper calls, switches that games cannot read, no choices. The
rule stands, and now has a precedent: a setting that changes how a game
plays belongs in the game's page.

## 6p. Three games on a diagonal, the tab named for the game, the patch's tab (John, 2026-10-18)

**The board.** "lets reduce the number of games offered in the GAMES tab
to just three. The three that are there right now. First should be
Patch, 2nd Stack o Lantern, and 3rd Go Fish. put the icons in a diagonal
row - but that row is bounded by the middle half of the vertical space."
So the two-by-four board of 3a is history: the board is THREE fixed
cells on a diagonal, slot 1 upper left, slot 2 in the middle, slot 3
lower right, inside the middle half of the tab's height (a quarter of
air above, a quarter below; the first cell flush with the band's top,
the last with its bottom). The outer cells keep the 9.5cqw of side air
the old board had. Claude's choices, open to change: the diagonal runs
down to the right, and on a phone it is shallow (each button steps down
about 30 px while being about 69 px tall). `goes_in_slot` is 1..3 now;
Candy Go Fish moved from slot 8 to 3; game3..game7 are benched with an
empty slot but keep their folders (6h still holds: a neutral folder to
copy).

**The tab.** "lets change the name of the THIS GAME tab to the actual
game name." The drawer's second tab reads the game's name in capitals
(PATCH, STACK O' LANTERN), plain like GAMES beside it. A long name does
not fit half the bar ("GO FISH! - CANDY E..."), so a name with an
`__accent__` gives the tab its accented part only: GO FISH!. John: "lets
just leave it at GO FISH!".

**The Pumpkin Patch.** Its "Slow / Fast" switch never did anything (no
game can read its switches, 6i); John first had the silhouettes paced up
instead (rise 1-3 s, wait 1-2, hidden 2-6; was 2-4, 1-4, 4-12), then
"lets remove the fast/slow switch in the tab". No game declares a switch
now; the switch column is kept as a feature. Then the tab itself: "clear
the high scores for this game. move the general text up" → a new
optional games.json field, `"high_scores": false`, hides the whole
scores-and-switches block for a game that never reports a score; and the
words: "How to Play // Nothing to do here. // Just sit back and watch."
then the credits "jp/claude/chatty 10/2025" (no byline next to the icon:
designer and date blank), centred, a blank line under the heading. Its
own README says the switch went.

**An italic mark.** For Stack's tab line "Milestones do not affect the
score. / They are bragging rights only." in italics: `*italic*` joined
the marks of 6i (`**bold**` is tried first, so the longer mark wins). A
mark cannot span a `\n`: one mark per line.

## 6r. The GAMES tab: a title, a row of three named icons, credits (John, 2026-10-18 afternoon)

John's words, in order: "a colorful title 'HALLOWEEN 2026!/Small games
with a Halloween feel./Enjoy!' and down at the bottom of the tab a
'Credits: jp/claude/chatty 10/2026'"; "make the actual icon in the
button a bit larger? the icon is the important thing"; "lable the button
below with Patch, Stack, and Fish"; "remove the diagonal and just use
three icons in a line. make them small enough to have some breathing
room"; "you can remove 'Enjoy!'"; "the names of Patch, Stack and Fish
are fine too. they fit nicely" (two-line names with a rainbow "Candy
Edition" were asked for and withdrawn within minutes); "adjust the name
of the game in the games tab to be these short names".

So the tab is a column. At the top, "HALLOWEEN 2026!" in the rainbow
mark (the seven colours the THIS GAME tab already had, now usable
anywhere), 7cqw and extra bold, over "Small games with a Halloween feel."
in the tab's normal size. In the middle, in whatever room is left, a row
of three orange squares (20cqw each; of the 40cqw of air a third sits
between each pair and a sixth at each edge, after "the three icons are
very close to one another. give them a bit more space between. not
much" on the phone, where the four gaps had been equal), the icon filling more of the square than before
(padding 1.5cqw, was 2cqw), and under each square its one-word name
from games.json `button_label`: Patch, Stack, Fish. At the bottom,
"Credits: jp/claude/chatty 10/2026", dim and small like the THIS GAME
credits. The drawer's second tab reads the same word in capitals (PATCH,
STACK, FISH) instead of the short title's accent.

Why a row and not the morning's diagonal: the drawer is about 300 px
tall on a phone and the title and credits take 100 of it; the diagonal's
"middle half" shrank to one square's height and the three squares ended
up in a row anyway, overlapping. John chose the row outright. Why the
label hangs from inside the button: the square stays square and the
pressed-in look still works; the label is 5cqw wider than the square on
each side (the gaps are 13cqw) and never wraps on its own.

## 6q. A score's notes may use the marks (John, 2026-10-18 afternoon)

Stack o' Lantern's practice rounds now count, and John wanted them
"in the high scores list and celebrations, but with a **CHEAT** after
the level name". The list already had two note cells after the date and
the app already had the text marks, so the shell's part is one line:
a note is filled with the marks read, and Stack sends "**CHEAT**" as its
second note. The list reads "1. 51 (10-18-2026) Space Needle **CHEAT**".
Candy Go Fish's notes ("vs. Ron", "3 set game") have no marks and look
the same as before. Why bold and not a colour: the note cells are small
and dim (0.75em, 85% opacity); bold is the one mark that reads there.

## 6s. The closing clean-up (John, 2026-10-18, after FINISHED)

"we should actually clean up the folders and files somewhat before
officially ending things." The eight placeholder game folders
(`games/game1` to `game8`) and their `games.json` entries are gone: they
were the shells of the original plan in which friends would each take
one over, and that plan was dropped. `games.json` now lists exactly the
three games that ship. The requirements document is version 5, final,
brought into line with the shell as it ships (Home and Settings, the tab
named for the game, `high_scores: false`, marks in notes, the 9:15 check
sizes) without changing a rule; its "coming later" list became "never
written", so a future reader does not wait for it. New READMEs, written
for a novice who opens the repository cold: `app/README - ROADMAP.md`
(the map of every file and who reads what), one per app code file
(`app.js`, `styles.css`, `default-icon.svg`, `game-helper.js`), and
`start-local/README - starting local.txt`. The root README was rewritten
for the finished state. Why READMEs beside the files rather than one big
document: John's question was "what would help him get up to speed?",
and the answer is a map first, then a short guide wherever he lands.
