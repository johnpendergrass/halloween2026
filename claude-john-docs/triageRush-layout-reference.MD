# Layout reference borrowed from triageRush

Extracted 2026-09-27 from `D:\dev\projects\triageRush\` (v0.19.2, Aug 2026).
**Only the screen/shell/device specs are borrowed — none of triageRush's game
content, art, or rules.**

**VERIFIED AGAINST THE ACTUAL SHIPPED CODE** (John: the docs may not reflect
what the game became). Source of truth = the code at commit `82a6232`
(2026-08-11, clean working tree):
- `triageRush/triageRush/styles.css` — sections 1, 2, 3, 10 (+ footer, hover)
- `triageRush/index.html` `<head>`, `manifest.json`, `start-local/no-cache-server.py`
- `triageRush/triageRush/app.js` — event handling

The design doc `github-excluded/docs/7-mobile-ui-and-interaction-spec.md`
was used ONLY for the device-size table (re-computed by hand from the CSS
formula) and the section 6 checklist, which is marked as doc-sourced.

---

## 1. The core idea: one 9:16 "phone" shell everywhere

- The whole app lives in a single box (`.app-shell`) locked to **9:16 portrait**.
- The **same layout on every device**. There is no separate desktop or
  tablet layout. On a PC/tablet the shell floats in the middle of a dark
  "stage" background and looks like a phone on the screen.
- The shell fits whichever limit is smaller: screen width or screen height.
- **The outer page never scrolls** (`html, body { overflow: hidden }`).
- Rounded corners only when the shell has room around it
  (viewport >= 700 wide and >= 800 tall): `border-radius: 10px`.

### Fit rules

- Width-limited (phones): width decides the size, min 4px padding each side.
- Height-limited (PC, tablet): leave **5% of viewport height above and below**.
- Phone notches/home bars: safe-area insets replace the padding when bigger.
- Uses `dvh`, plus `svh` where supported, so mobile browser toolbars can't
  push the shell off the screen.

```css
/* The body is the "stage" that centers the shell */
body {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding:
    max(5dvh, env(safe-area-inset-top))
    max(4px,  env(safe-area-inset-right))
    max(5dvh, env(safe-area-inset-bottom))
    max(4px,  env(safe-area-inset-left));
}

/* 0.5625 = 9/16, 1.7778 = 16/9 */
.app-shell {
  position: relative;
  width:  min(calc(100vw - 8px), calc(90dvh * 0.5625));
  height: min(90dvh, calc((100vw - 8px) * 1.7778));
  overflow: hidden;
  container-type: inline-size;   /* makes cqw units = % of shell width */
  isolation: isolate;
}

/* Better version where the browser supports svh (small viewport height) */
@supports (height: 100svh) {
  .app-shell {
    width: min(
      calc(100svw - max(4px, env(safe-area-inset-left))
                  - max(4px, env(safe-area-inset-right))),
      calc((100svh - max(5svh, env(safe-area-inset-top))
                   - max(5svh, env(safe-area-inset-bottom))) * 0.5625));
    height: min(
      calc(100svh - max(5svh, env(safe-area-inset-top))
                  - max(5svh, env(safe-area-inset-bottom))),
      calc((100svw - max(4px, env(safe-area-inset-left))
                   - max(4px, env(safe-area-inset-right))) * 1.7778));
  }
}
```

### Reference shell sizes

| Device | Approx. shell size (CSS px) |
|---|---:|
| Smallest phone tested | ~375 wide screen -> ~367 x 652 |
| iPhone 16 Pro Max (440 x 956, 3x) | 432 x 768 (needs 1296 x 2304 real pixels for full-shell art) |
| Full HD PC 1920 x 1080 | 547 x 972 |
| 4K PC 3840 x 2160 | 1094 x 1944 |

Art for a full-shell background should be about **1296 x 2304** (or a bit
more) so it stays sharp on a 3x phone. triageRush used 852 x 1515 lobby art,
which worked but is on the low side.

---

## 2. Sizing everything inside the shell

- **Font sizes use `cqw`** (1cqw = 1% of shell width) wrapped in `clamp()`,
  so text scales with the shell, not the browser window. Example:
  `font-size: clamp(11px, 3.4cqw, 16px);`
- No screen-size breakpoints for layout; container-relative sizes instead.
- Positions on top of artwork use **percentages of the art's canvas**
  (`left = x / artWidth`, `top = y / artHeight`) so hotspots stay locked to
  the picture at any size.
- Gotcha: an element's own `cqw` is measured against its nearest *ancestor*
  container, not itself — wrap inner content if a sub-panel should be its
  own container.
- Always check that the widest text fits at the **smallest shell (375px
  wide screen)** before making anything bigger.
- Tap targets: at least ~44px; small corner buttons use
  `clamp(35px, 12cqw, 50px)`.
- Game screen band split used in triageRush (a useful starting point, not a
  rule): header 7.2% / play area 85.8% / footer 7%, header/footer
  `min-height: 40px` (all verified in styles.css).

---

## 3. Base CSS worth copying

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }

button {
  font: inherit; color: inherit; cursor: pointer;
  border: none; background: none;
  -webkit-tap-highlight-color: transparent;
}

/* Stops iOS double-tap zoom on controls (pinch zoom still works). */
button, label, input, select { touch-action: manipulation; }

button:focus-visible { outline: 3px solid #fff; outline-offset: 1px; }

img { user-select: none; -webkit-user-drag: none; }

[hidden] { display: none !important; }

/* Inputs must be >= 16px font or iOS zooms the page on focus. */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

Stage background (behind the shell, the "phone on a desk" look):
`radial-gradient(circle at 50% 20%, #244454 0%, #0d2532 40%, #02090e 100%)`
— for Halloween we'd swap in our own colors.

Shell frame: `border: 2px solid #46606b; box-shadow: 0 24px 80px #000c, inset 0 0 0 2px #0b1014;`

---

## 4. `index.html` head (phone / home-screen setup)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#......" />
<link rel="apple-touch-icon" href="./Link-icons/iPhone-icon-180.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="..." />
<link rel="manifest" href="./manifest.json" />
<!-- plus og:* tags with ABSOLUTE urls for texted-link preview cards -->
```

- `viewport-fit=cover` is what makes the safe-area `env()` values work.
- Home-screen launch = full screen, no browser bars — the 9:16 shell was
  designed for this.
- `manifest.json`: `"display": "standalone"`, `"orientation": "portrait"`,
  icons 192, 512, and a **maskable 512** (art shrunk to ~65% for Android's
  circle mask).
- **No service worker** on purpose (no offline mode, avoids caching headaches).
- Icons: square, NOT pre-rounded, art kept ~10% from edges.
- Script tags use `?v=<version>` to bust the cache on release.

---

## 5. Local dev server

- Can't open `index.html` from disk if the game fetches data files — use a
  local server.
- triageRush had `start-local/start-triageRush.bat` + `no-cache-server.py`
  (port 8090, bound to 0.0.0.0 so an iPhone on the same Wi-Fi can test).
- Caching lesson: send `no-store` for .html/.js/.css (always fresh code) but
  `no-cache` for art/data (kept, re-checked). "Never cache anything" broke
  preloading.

---

## 6. Input, hover, and accessibility

**Verified in code:**
- All controls use plain `click` listeners (works the same for mouse, touch,
  pen). The only `pointerdown` is a one-time "first gesture" listener used to
  unlock audio (browsers block sound until the user taps).
- Hover effects are wrapped in `@media (hover: hover)` so they only apply on
  real mouse devices. On iPhone, `:hover` "sticks" after a tap.

**From the design doc only (not checked line by line in code):**
- Color is never the only signal (pair with text/symbol/sound).
- Sound is optional and never the only feedback.
- Reduced-motion users get shortened/removed animations.
- Overlays stay inside the shell; overlays may scroll internally, the page never does.
- Test with mobile browser toolbars visible and on a notched phone.
