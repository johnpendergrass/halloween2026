# app/styles.css — a guided tour

*What the file is, who loads it, and what each section does. Written
2026-10-18. The file's own comments explain each rule where it stands;
this is the map.*

## What it is and where it is used

`styles.css` is the app's only stylesheet, about 850 lines. `index.html`
loads it with one `<link>` tag in the head, with the cache stamp:

```html
<link rel="stylesheet" href="./app/styles.css?v=2026-1018-cleanup" />
```

It styles the app only: the frame, the top bar, the game panel, the
bottom panel and both of its tabs. **It never reaches inside a game.** A
game's page sits in an `<iframe>`, which is its own document with its own
CSS, so nothing here can affect a game and nothing in a game can affect
the app. (The one exception is section 5b, where a game may have the look
of ITS OWN tab in the bottom panel adjusted; that is still the app's
panel, not the game's page.)

## The one sizing idea

Inside the frame, sizes are in `cqw` units: 1cqw is 1% of the FRAME's
width (the frame is a CSS container), not the browser window's. So a
button that is 20cqw is a fifth of the frame wide on a small phone, a
big phone and a PC alike, and the whole layout scales as one picture.
`clamp(min, preferred, max)` keeps text from becoming unreadably small or
comically large.

## The sections

**1. Colours and base.** The `:root` block names every colour once
(`--pumpkin`, `--top-bg`, `--drawer-bg`...), so a colour change is one
line. Also here: `--drawer-open-share: 0.55`, how much of the game panel
the open bottom panel covers. Then the resets: no margins, no page
scrolling, `touch-action: pan-y` (no pinch zoom on the app's own page;
the THIS GAME tab may still scroll), and `[hidden]` always winning.

**2. The stage and the 9:16 frame.** Borrowed from an earlier project
(triageRush). The page is a dark "stage"; the frame is the biggest 9:16
rectangle that fits the screen, centred, with a 2px pumpkin outline and
rounded corners, clear of the iPhone's notch and home bar
(`env(safe-area-inset-*)`). A second version uses `svh` units on
browsers that know them, so the phone's own toolbars are accounted for.

**3. Top panel.** 1/16 of the frame's height: the Home and Settings
buttons, the same size either side, and the game's short title centred
between them. An `__accent__` mark in the title shows orange.

**4. Game panel and the game's iframe.** `.play-area` is everything below
the top bar (so exactly 9:15); `.game-frame` fills it with no border; a
parchment colour shows only while a game's page is loading. `.game-cover`
is the invisible sheet that lies over the game while the panel is open.

**5. Bottom panel (the drawer).** The biggest section. The panel's height
is the open share of the game panel; closed, it is slid down out of
sight, open it is slid up, with a transition. Then, top to bottom of the
panel:

- the two tabs sharing the width (the second one is renamed for the
  game by app.js);
- the GAMES tab: title (rainbow first line), the row of three square
  icon buttons (`.game-board`, `.cell-1/2/3`, `.game-button`), the
  one-word label hanging under each button (`.game-label`), the pressed-in
  look of the current game, the text fallback when an icon is unusable,
  the credits line, and the red start-up error;
- the THIS GAME tab: icon and title, the two columns (five high scores
  with date and notes on the left, up to three switches on the right),
  the "Clear scores / You sure? Yes No" pills, the switch slider drawn
  with `::after`, the description and how-to-play paragraphs, and the
  text marks (`b`, `i`, `.accent`, `.rainbow span` in seven colours, the
  shaded `!!` line).

**5b. Per-game looks.** app.js puts the class `look-<folder_name>` on the
THIS GAME tab, so a game may have its tab drawn its own way. Candy Go
Fish's rules (gold GO FISH!, no orange frame around its candy-plate
icon), Stack o' Lantern's and the Pumpkin Patch's live here, each under
a comment naming the game. Everything in 5b is optional; the rest of the
app never depends on it.

**6. Reduced motion.** No sliding or slider animation for people who turn
on "reduce motion" in their phone's settings.

## Traps

- **Mixed line endings.** This file has both CRLF and LF lines from its
  history. Editors cope; a script that searches for a multi-line passage
  must try both spellings. Do not "normalise" the whole file in an
  unrelated commit, or the diff hides the real change.
- A rule that seems not to apply usually loses to `[hidden]` or to a
  later rule with two class names (the comments point these out).
- Test a look change at two phone widths (390 and 375 CSS px are the
  usual ones) and on the PC; the drawer is only about 300 px tall on a
  phone, so anything added to the GAMES tab competes for little room.
- Looks only: no behaviour lives here. If something should HAPPEN,
  that is `app.js`.
