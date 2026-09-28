# Halloween 2026 — Game Design Requirements

*For anyone making a mini game for Halloween 2026, and for their AI
assistants.*

Version 3, 2026-09-27. This version covers **sizes, text, artwork and
colours only**. Later versions will add: talking to the app (scores, game
over, pause), high scores, settings, sound, and file-size limits.

- **Part 1 is for designers.** Everything is measured on one drawing
  canvas, in real pixels.
- **Part 2 is for coders and AI assistants.** It explains how to turn Part 1's
  numbers into code, and gives the exact rule list.
- **The appendix** shows how big things end up on each device (optional
  reading).

> **AI assistants:** read all of it. The rule list in **2.4** is binding:
> treat every MUST as a requirement and check your work against it before
> finishing.

**Demo games.** `games/game1/` (Pie Maker) and `games/game0/` (the home
screen) are demos, written to follow these rules. They are not part of the
finished app and may change. Where a demo departs from a rule, its own
`README - <NAME>.md` has a section *"Where this game breaks the
requirements, and why"*. If the demo and this document disagree and the
demo's README does not explain it, **this document is right**.

*This is the only copy of this file. It lives in `games/` and is maintained
by the project owner. Don't copy it into your game folder: link to it.*

---

# PART 1 — For designers

## 1.1 Your canvas: 1296 × 2016 pixels

Your game lives in the **game panel**, the big middle area of the app:

```text
┌─────────────────────┐
│  app top panel      │  the app's: game name, Home, menu
├─────────────────────┤  ← app's lavender line (not in your space)
│                     │
│                     │
│    GAME PANEL       │  YOURS: every pixel, edge to edge
│    1296 × 2016      │
│                     │
│                     │
├─────────────────────┤  ← app's mint line (not in your space)
│  app bottom strip   │  the app's: slides up for menus
└─────────────────────┘
```

**Design everything on a canvas of 1296 × 2016 pixels.** That is the game
panel on the biggest iPhone (16 Pro Max), in its real screen pixels. On
every other device the whole canvas is shrunk evenly to fit, never
stretched or cropped. The shape (9 wide : 14 tall) is the same everywhere.

- **The whole canvas is yours.** The lines around it belong to the app and
  take none of your space (see 1.7).
- **You get no border.** If you want a border around your game, draw it
  inside your canvas. It uses up some of your space.
- The corners are square.
- **The app's bottom panel can slide up over the lower 55% of the canvas**
  (about the bottom 1109 pixels) when the player opens it. Later, the app
  will tell your game to pause when that happens.

## 1.2 Measure in canvas pixels, always

**Every size in Part 1 is in canvas pixels.** They are real pixels, the
same pixels your drawing program uses, so:

- Draw and measure on the 1296 × 2016 canvas.
- **Export each image at the size it has on the canvas.** A pumpkin that is
  311 pixels wide on the canvas is exported 311 pixels wide (or up to 1.5×
  bigger, never smaller).

**The trap to avoid.** Web code measures in "CSS pixels", which are bigger
than real pixels: 1 CSS pixel = 3 real pixels on an iPhone. If you crop an
image to a size you saw in code (say "92 px"), it comes out a third of the
size it needs, and looks blurry on a phone. Measure on the canvas instead,
and the problem never comes up.

## 1.3 Sizes at a glance

The "In code" column is for coders (see 2.1). Designers can ignore it.

| Thing | Canvas pixels | In code |
|---|---|---|
| **The canvas** | **1296 × 2016** | 100vw × 100vh |
| **Smallest tap target** (anything the player touches, still or moving) | **168 × 168** | 13vw |
| Comfortable tap target | 200 to 260 | 15–20vw |
| Space between tap targets (at least) | 26 | 2vw |
| Main button (Start, Play again) | 170–210 tall, 520–1040 wide | 13–16vw × 40–80vw |
| Keep important buttons out of the bottom strip of | 65 | 5vw |
| Info bar (score, timer), suggested height | about 160 (8% of the height) | 12.5vw |
| Sprite, decoration only (too small to tap) | 104 | 8vw |
| Sprite, small (smallest tappable) | 168 | 13vw |
| Sprite, medium | 233 | 18vw |
| Sprite, large | 311 | 24vw |
| Sprite, main character | 428 | 33vw |
| Sprite, boss / big object | 648 | 50vw |

- **The smallest tap target is 168 × 168, in both directions**, whether it
  moves or not. On the smallest phone that is a fingertip (44 CSS px, the
  size Apple recommends as a minimum), so 168 is the floor, not a
  comfortable size. For text buttons, 168 is the minimum *height*.
  (Pie Maker's smallest pumpkin is exactly 168, and was tested fine on an
  iPhone 16 Pro.)
- Over about 648 (half the width), a sprite leaves little room to move, and
  as a button it stops looking like something to tap.
- Nothing that matters may depend on hovering (fingers can't hover), a
  double tap, a long press, or a keyboard.

## 1.4 Text

**Three standard sizes.** Heights are canvas pixels, the font size you'd
set in a drawing program on the canvas.

| Size | Canvas px | In code | Use for |
|---|---|---|---|
| **Small**: the minimum, nothing smaller | 47 | `.text-small` (3.6vw) | labels, fine print |
| **Medium** | 58 | `.text-medium` (4.5vw) | scores, timers, instructions |
| **Large** | 117 | `.text-large` (9vw) | titles, "Game Over", big numbers |

Sizes in between are allowed. **Nothing smaller than Small.**

**Standard text styles:**

- **Font:** Arial (plain sans-serif) for everything, for now. A Halloween
  title font may be added later for Large text.
- **Weight:** normal or **bold**. No thin or light weights: they vanish on
  phones.
- **Italics:** fine, for emphasis.
- **Underline:** don't. It looks like a link.
- **Strikethrough:** only when it means something (a crossed-off item).
- **ALL CAPS:** fine for short labels and titles, not for sentences.
- **Line spacing:** 1.35 (the standard). Up to 1.5 for paragraphs.
- **Colour:** must stand out clearly from what is behind it, dark on light
  or light on dark. Pale grey on white is unreadable outdoors.
- **Text over pictures:** add a dark shadow or outline so it stays
  readable over busy art.
- Keep sentences short. The canvas fits about 40 characters per line at
  Medium size, and about 20 at Large.

## 1.5 Grids (boards, tiles, "tap a square" games)

Square cells filling the full width (1296):

| Columns | Cell size | Rows that fit (whole canvas) | Rows that fit (with info bar) | Tappable? |
|---|---|---|---|---|
| 3 | 432 | 4 | 4 | ✅ very easy |
| 4 | 324 | 6 | 5 | ✅ easy |
| 5 | 259 | 7 | 7 | ✅ comfortable |
| 6 | 216 | 9 | 8 | ✅ fine |
| 7 | 185 | 10 | 10 (just) | ⚠️ the limit |
| 8 | 162 | 12 | 11 | ❌ too small to tap |
| 9 or more | 144 or less | | | ❌ look-only |

- **At most 7 columns** for cells the player taps one by one. 5 or 6 is
  comfortable.
- **Gaps come out of the cell size.** Example: 5 columns with 26-pixel gaps
  (6 gaps, counting both edges, = 156) leaves (1296 − 156) ÷ 5 = 228-pixel
  cells. Still comfortable.
- Space left under the last row can hold your info bar or buttons.

## 1.6 Exporting artwork

| Art | Export at |
|---|---|
| A sprite | its width on the canvas (e.g. 311 × 311 for a large sprite) |
| A full-width strip or bar | 1296 wide |
| **A background for the whole game** | **1296 × 2016** exactly (so it is never cropped or stretched) |

- **Sprites: PNG with a transparent background.**
- **Backgrounds and photos: JPG** (much smaller files).
- **SVG** is sharp at any size and usually tiny, and suits flat, simple art
  (Pie Maker's pumpkins and pies are SVG). For SVG, only the shape matters,
  not the pixel size.
- Up to 1.5× the canvas size is fine. Much bigger only makes the game
  slower to load, with no visible gain.

## 1.7 The app's colours and edges

**Your colours are entirely up to you.** You may match these so your game
feels part of the app, borrow them, or ignore them.
*These are the current test colours and may change before release.* Only
colours the app itself uses are listed; the demo games choose their own.

| Colour | Hex | Where the app uses it |
|---|---|---|
| Deep purple | `#2e1a44` | top panel; the background around the app |
| Lavender | `#9b7cc4` | line along the **top** edge of your canvas |
| Swamp green | `#173229` | bottom panel |
| Mint green | `#5fbf8f` | line along the **bottom** edge of your canvas |
| Pumpkin orange | `#e8741c` | buttons; the frame's outline (along your **left and right** edges) |
| Dark pumpkin | `#b85510` | button shadows |
| Parchment | `#eae2d2` | the game panel while your page is loading |
| Ink | `#2a2230` | the app's default text colour |
| White | `#ffffff` | text on the top and bottom panels |

**The edges around your canvas** (all owned by the app, all outside your
space), in case you want to echo them inside your game:

| Edge | Line | Colour |
|---|---|---|
| Top | 6 canvas pixels | lavender `#9b7cc4` |
| Bottom | 6 canvas pixels | mint `#5fbf8f` |
| Left and right | 6 canvas pixels | pumpkin `#e8741c` |

**The app's button look**, if you want your buttons to match: pumpkin
orange, white bold text, rounded corners (39 canvas pixels), a dark-pumpkin
"shadow" 16 pixels deep directly below, and the button presses down when
tapped. Pie Maker's **Play again** button copies it.

---

# PART 2 — For coders and AI assistants

## 2.1 Turning canvas pixels into code

Your page runs inside the game panel, so **inside your page, `100vw` ×
`100vh` is the whole canvas**. One number converts everything:

> **canvas pixels ÷ 12.96 = vw**  (because the canvas is 1296 wide = 100vw)

- CSS: a 311-pixel sprite → `width: 24vw` (311 ÷ 12.96 = 24.0).
- **Use `vw` for heights and positions too** (not `vh`), so everything
  shrinks by the same amount and shapes stay true. `100vh` equals 155.6vw.
- Borders and lines of 1 to 3 CSS px may stay in `px` (the app's own lines
  are `2px`, which is the 6 canvas pixels in 1.7).
- **A `px` floor is fine, a `px` ceiling is not.** `max(14px, 4.5vw)` keeps
  text readable if the panel is ever shown very small. Don't cap sizes with
  `clamp(..., 28px)`: the panel is never wider than about 730 CSS px, so a
  cap does nothing useful and hides the real size.

**In JavaScript**, convert with the page's current width:

```js
/** Canvas pixels (on the 1296 x 2016 design canvas) -> CSS pixels right now. */
function canvasToScreen(canvasPixels) {
  return (canvasPixels / 1296) * window.innerWidth;
}
```

Re-read `window.innerWidth` whenever you draw (or on `resize`), never just
once at start-up.

## 2.2 Page setup (copy this)

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden;              /* the page never scrolls */
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.35;
  /* Taps are for the game: no scrolling, zooming, selecting, or the
     iPhone "save image" pop-up. */
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

[hidden] { display: none !important; }   /* hidden always wins, even over flex */

img { -webkit-user-drag: none; }   /* plus draggable="false" on each <img> */
```

Copy it as is (the demo games do). Add your own rules below it.

## 2.3 The three text sizes in code

```css
/* Size = a share of the canvas width, with a floor so text can never
   become unreadable if the panel is ever shown unusually small. */
.text-small  { font-size: max(12px, 3.6vw); }   /* 47 canvas px */
.text-medium { font-size: max(14px, 4.5vw); }   /* 58 canvas px */
.text-large  { font-size: max(24px, 9vw); font-weight: 700; }   /* 117 canvas px */

/* Text over busy art */
.text-on-art { color: #fff; text-shadow: 0 0.3vw 0.6vw rgb(0 0 0 / 70%); }
```

These classes are a convenience, not a fence: nothing stops a page from
setting any `font-size` it likes. The rule that matters is the **size**
(rule 13). Using the classes is the easy way to be sure you meet it, and it
lets a checker read your CSS.

## 2.4 The rules

**MUST** = required. **SHOULD** = do it unless there is a good reason.
Sizes refer to the table in 1.3.

**Page**

1. MUST be a normal web page at `games/<game-id>/index.html`, with its CSS,
   JS and `assets/` in that same folder. MUST use relative paths (`./...`)
   and MUST NOT load anything from outside its own folder.
2. MUST include the page setup in 2.2 (fills the panel, never scrolls,
   touch settings).
3. MUST work at any size with a 9:14 shape, and SHOULD still look right at
   slightly different shapes (9:13 to 9:15).
4. MUST also run on its own when its `index.html` is opened directly.

**Sizing**

5. All sizes MUST be relative to the width: `vw` in CSS, or
   `canvasToScreen()` / shares of `window.innerWidth` in JS. `px` is allowed
   only as a **floor** inside `max()`, and for lines of 1 to 3 px. No `px`
   ceilings (no `clamp(..., Npx)`).
6. Check the layout at 338 × 526 CSS px (smallest phone) and 547 × 850
   (PC). See the appendix for more sizes.

**Touch**

7. Every tap target MUST be at least 13vw × 13vw, still or moving.
8. Tap targets SHOULD be at least 2vw apart.
9. Important tap targets SHOULD NOT be in the bottom 5vw.
10. Grids of individually tapped cells MUST have at most 7 columns (cells
    at least 13vw after gaps).
11. MUST be fully playable by touch alone: no hover-only features, no
    keyboard-only controls, no required double tap or long press.
12. Taps on game objects SHOULD use `pointerdown` (instant); ordinary
    buttons may use `click`.

**Text**

13. No text MUST be smaller than Small (`3.6vw`, 47 canvas px). Text
    SHOULD use the three classes in 2.3; sizes between Small and Large
    are allowed.
14. Font MUST be Arial/Helvetica/sans-serif. Text MUST NOT be underlined.
    Weights: normal or bold only.
15. Text MUST contrast clearly with its background. Text over images
    SHOULD use `.text-on-art` or similar.

**Artwork**

16. Raster images SHOULD be exported at their canvas size (their CSS width
    in vw × 12.96), up to 1.5× that, never smaller. Full-panel backgrounds:
    1296 × 2016.
17. Sprites SHOULD be PNG with transparency (or SVG); backgrounds and
    photos SHOULD be JPG.

**Not defined yet (do not invent your own)**

18. Talking to the app, scores, settings, sound and file-size limits are
    not defined yet. MUST NOT use `window.parent`, `postMessage`, cookies
    or `localStorage` until a later version of this document says how.

---

# APPENDIX — How big it all is on real devices

The canvas is shrunk to fit each device.

| Device | Canvas shown at (CSS px) | Real screen pixels | Canvas scale |
|---|---|---|---|
| iPhone SE (smallest phone) | 338 × 526 | 676 × 1052 | 52% |
| iPhone 15 / 16 (typical) | 382 × 594 | 1146 × 1783 | 88% |
| **iPhone 16 Pro Max** | 432 × 672 | **1296 × 2016** | **100%** |
| PC, 1080p monitor | up to 547 × 850 | up to 547 × 850 | up to 42% |
| PC, 4K monitor | depends on Windows scaling | about 1030 wide | about 80% |
| Mac, 5K screen | about 650 to 730 wide | about 1300 to 1460 wide | 100% to 113% |

- **Phones are measured** in the app launched from its home-screen icon.
  In the Safari browser, the toolbars make everything a little smaller.
- **PCs and Macs are estimates**, and depend on the browser window's size
  and toolbars. The largest numbers are for a full-screen browser.
- The smallest tap target (168 canvas px) is 44 CSS px on the iPhone SE,
  the size of a fingertip. That's where the number comes from.
- A 5K Mac can show art up to about 13% larger than the canvas. That's
  barely noticeable, so the canvas is not made bigger for it.

---

## Coming in later versions

- Talking to the app: reporting a score, saying "game over", pausing when
  the bottom panel opens
- High scores (saved by the app, shown in the bottom panel)
- Settings (declared by your game, shown by the app)
- Sound rules (iPhones play nothing until the first tap)
- File-size limits, folder and file naming rules, how to test and submit
