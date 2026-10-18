# games/game-helper.js — a guided tour

*What the file is, who loads it, and what it does. Written 2026-10-18.
The file's own opening comment is the full story; this is the map.*

## What it is

The one file a game includes to talk to the app. About 130 lines, most of
them comment. It gives the game's page one global object, `Halloween`,
with two calls:

```js
const place = Halloween.reportScore(42);                   // tell: the list shows 42
Halloween.reportScore(42, "Master Chef");                  // tell: the list shows the text
Halloween.reportScore(3, "3-2", ["vs. Ron", "3 set game"]); // tell: with two notes
const best = Halloween.bestScore();                        // ask: the top saved score, or 0
```

`reportScore` returns the score's place in the app's list, 1 to 5, or 0
when it did not make the list. A note may carry the text marks
(`**CHEAT**` shows bold). That is all a game can say to the app and all
it can ask.

## Where it is used

Every game's `index.html` loads it BEFORE the game's own script, from the
folder above:

```html
<script src="../game-helper.js?v=2026-1018-cleanup"></script>
<script src="./my-game.js?v=2026-1018-cleanup"></script>
```

All three shipped games include it. Stack o' Lantern uses both calls
(a score at game over, the best score for its "High score" corner);
Candy Go Fish reports the sets won, shown as "3–2", with one note saying
who played whom; the Pumpkin Patch reports nothing and includes the file
only for the double-tap guard below.

## How it works

The app shows a game in an `<iframe>`. From inside an iframe,
`window.parent` is the page around it, the app, and `app.js` keeps an
object there called `halloweenApp` with `reportScore` and `bestScore`.
The helper's `findApp()` looks for it, and the two calls simply pass
through to it. The games and the app come from the same website, so the
browser allows the look.

Opened on its own (double-clicking the game's `index.html`, or a direct
address), a page is its own parent and there is no app: `reportScore`
then prints a note in the browser console and returns 0, `bestScore`
returns 0, and the game runs as usual. That is rule 4 of the
requirements: every game also works alone.

Rule 21 says a game must not touch `window.parent` itself; this file is
the one place that does. If the app's side ever changes (say a third
call), this file is where the games' side changes too, once, for all of
them.

## The second job: no double-tap zoom

The end of the file is a `touchend` listener that calls `preventDefault()`
on a touch ending within 350 ms of the previous one. On the iPhone a fast
double tap inside a game zoomed the APP's page, with no way back but a
reload; viewport tags and `touch-action` did not stop it on Chrome for
iPhone, this does. Because every game includes the helper, every game is
covered; `app.js` has the same lines for taps on the app's own bar and
panel. A fast second tap loses its click, so a button sometimes needs a
fresh tap; a game that acts on `pointerdown` never notices.

## Not here, on purpose

- **Pausing.** The app's bottom panel can open over a game at any time
  and the app does not pause or notify the game. A game that needs a
  pause builds its own (rule 18). The browser's `visibilitychange` event
  is available to any page that wants to pause when the phone locks.
- **Reading a game's switches.** The THIS GAME tab shows and remembers up
  to three switches named in `games.json`, and no game can read them.
- **Sound.** The app has no sound switch; sound is each game's own
  control inside its page.
