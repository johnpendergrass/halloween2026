# Designing for the Frame

*Why you (mostly) don't have to think about phones, tablets and PCs —
and the few things you still do.*

Written 2026-09-27. Plain-language guide for John and for anyone writing a
mini game for Halloween 2026.

---

## The big idea

The whole app lives inside one **9:16 portrait frame** — the shape of a
phone held upright.

- On a **phone**, the frame fills nearly the whole screen.
- On a **tablet or PC**, the frame floats in the middle of a dark
  background, like a phone lying on a desk.
- The frame is **exactly the same shape everywhere**. There is no special
  desktop layout and no special tablet layout.

Each mini game runs **inside that frame**, not inside the phone's screen.
The frame is the only part of the app that knows about screen sizes,
notches, home bars, and browser toolbars — and it deals with all of that
once, for everybody.

**So when you write a game, think: "I have a 9:16 box."** That's it. It will
look the same on an iPhone, an iPad, and a 4K monitor — just bigger or
smaller.

```text
   Phone                      PC monitor
 ┌────────┐       ┌─────────────────────────────────┐
 │┌──────┐│       │            ┌──────┐             │
 ││      ││       │            │      │             │
 ││ GAME ││       │            │ GAME │             │
 ││      ││       │            │      │             │
 ││      ││       │            │      │             │
 │└──────┘│       │            └──────┘             │
 └────────┘       └─────────────────────────────────┘
  same 9:16 box              same 9:16 box
```

---

## The few things that still differ

Devices are not *completely* interchangeable. Here are the seven real
differences, what each one means, and who takes care of it.

### 1. Fingers vs. mouse

A mouse is precise and can hover. A finger is fat, covers what it touches,
and cannot hover.

- **No hover on touch screens.** Nothing important may depend on hovering
  (no hover-only tooltips, no hover-only menus).
- **No keyboard on a phone.** Keyboard controls are fine as a bonus, but
  never the *only* way to play.
- **Big tap targets.** Anything you tap should be at least about 44 pixels
  across on the smallest frame.
- **The phone's own gestures fight back.** Dragging inside a game can make
  the page scroll, trigger pull-to-refresh, trigger Safari's swipe-back, or
  start selecting text with the magnifying loupe. The app can switch these
  off for the game area, but the rule has to be followed.

*Who handles it:* mostly **the game author** (design for fingers), with some
help from **the app** (blocking the phone's gestures).

### 2. Physical size

The layout is identical, but the frame is a very different *physical* size:

| Device | Frame width (roughly) |
|---|---|
| Phone | about 6.5 cm / 2.5 in |
| PC monitor | about 15 cm / 6 in |

**Always design for the smallest frame** — about **367 × 652** CSS pixels.
If your text is readable and your buttons are tappable there, they will be
fine everywhere. Bigger screens simply scale everything up.

*Who handles it:* **the game author**.

### 3. Sharpness of pictures

A phone screen crams about **3 real pixels into every 1 pixel** of layout.
That means a phone needs *more detailed* artwork than a normal PC monitor,
even though its screen is smaller.

- Full-frame background art should be about **1296 × 2304** pixels.
- It will simply look extra crisp on a PC.

*Who handles it:* **the game author** (size art for the phone).

### 4. Sound on the iPhone

- An iPhone **will not play any sound until the player taps something**.
- The iPhone's side **mute switch** can silence some kinds of web sound.

This needs one clear, shared rule so every game handles sound the same way
(to be written in the mini-game spec).

*Who handles it:* **the app** provides the sound on/off setting; **the game
author** follows the sound rule.

### 5. Speed and memory

A phone is much weaker than a desktop PC, and an iPhone will quietly
**reload the page** if it uses too much memory.

- A game that runs smoothly on your PC may stutter on a phone.
- The spec will set limits on file sizes and on heavy effects.

*Who handles it:* **the game author**, within the limits in the spec.

### 6. Turning the phone sideways

In landscape, a 9:16 frame shrinks to about 200 pixels wide — technically
working, practically unplayable.

*Who handles it:* **the app** shows a "please rotate your phone" message.
Games do nothing.

### 7. Testing

- **Every browser on an iPhone is really Safari underneath** — even
  "Chrome" on an iPhone.
- A game that works in Chrome on your PC still needs to be **checked once
  on a real phone**.
- The local test launcher (`start-local/start-halloween.bat`) prints an
  address you can type into your phone's browser, as long as the phone is
  on the same Wi-Fi.

*Who handles it:* **the game author**, before submitting.

---

## Who takes care of what

**The app (the frame) handles — once, for everyone:**

- Sizing the 9:16 frame on every screen
- Staying clear of the iPhone notch, home bar and browser toolbars
- Full-screen "app" mode from the home screen
- The "please rotate your phone" message
- Blocking the phone's own swipe/scroll/zoom gestures over the game
- The Home button
- The sound on/off setting

**Each game author handles:**

- Designing for the **smallest** frame
- Using sizes that grow with the frame, not fixed pixel sizes
- Working with a **finger**, not just a mouse
- No hover-only or keyboard-only features
- Keeping files and artwork within the size limits
- Testing once on a real phone

---

## The short version

> **Design for a 9:16 box. Make it work with a finger. Test it once on a
> phone.**
>
> Everything else about devices is the app's job.
