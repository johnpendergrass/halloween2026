/* ============================================================================
   Halloween 2026 - games/game-helper.js   (how a game talks to the app)

   A game that wants its scores kept includes this file BEFORE its own
   script, in its index.html:

       <script src="../game-helper.js"></script>
       <script src="./my-game.js"></script>

   and then calls, when a game is over:

       Halloween.reportScore(42);                  // the list shows 42
       Halloween.reportScore(42, "Master Chef");   // the list shows Master Chef
       Halloween.reportScore(3, "3-2", ["vs. Ron", "3 set game"]);

   The number is ALWAYS given: the app ranks the scores by it, higher is
   better, and keeps the best five for this game on this device. The text
   is optional; when given, it is shown in place of the number. The list
   of notes is optional too: up to two short strings (about 16 characters
   each) shown after the date, for things like the opponent or the game
   variant. A score of 0 or less is not recorded. The app adds the date
   itself and shows the five in the THIS GAME tab, e.g.
       1.  3-2 (10-15-2026)  vs. Ron  3 set game

   reportScore RETURNS the score's place in that list (since 2026-10-17):
   1 for the top line down to 5, or 0 when the score did not make the
   list. A game may use it to say "TOP 5 SCORE!" or may ignore it. An
   equal score lands below the earlier one, so a score that only matches
   the best comes back as 2, not 1.

   That is all a game has to do. It must not use window.parent itself;
   this file is the one place that does. A game MAY keep its own settings
   in localStorage (rule 21 in "README - game design requirements.md"):
   under a key that starts with "halloween2026:<its folder>:" and never
   the bare "halloween2026:<its folder>" key, which belongs to the app.

   HOW IT WORKS. The app shows each game in an <iframe>. From inside an
   iframe, window.parent is the page around it: the app. The app (app.js)
   keeps an object there called halloweenApp, and this helper simply calls
   its reportScore function. That is allowed because the games and the app
   are served from the same website.

   ON ITS OWN. A game page opened directly (not through the app) has no app
   around it. reportScore then does nothing except leave a note in the
   browser console, so the game still runs and can be tested alone.

   ONE MORE CALL, TO ASK (since 2026-10-17):

       Halloween.bestScore();     // the top saved score for this game, or 0

   It returns the number at the top of the app's list for this game on
   this device, so a game that shows a "High score" of its own can start
   from it instead of from 0 and the two agree (Stack o' Lantern does
   this). Outside the app, or with no score saved yet, it returns 0.

   THAT IS ALL THERE IS: reportScore to tell, bestScore to ask. A game
   cannot read its own switches in the THIS GAME tab, and the app has no
   sound switch of its own (since 2026-10-15): sound is the game's job.
   A setting that changes how a game plays belongs in the game's own page
   (Stack o' Lantern's practice level lives on its welcome screen).

   NOT HERE, ON PURPOSE: pausing. The player can open the app's bottom
   panel at any time; it covers about the lower half of the game, and the
   app neither pauses the game nor tells it. A game that needs a pause
   builds its own (rule 18 in "README - game design requirements.md").
   ========================================================================= */

"use strict";

const Halloween = {

  /** The app's side of the link (app.js: window.halloweenApp), or null
      when this page is not running inside the app. */
  findApp() {
    try {
      // Opened on its own, a page is its own parent.
      if (window.parent === window) return null;
      return window.parent.halloweenApp || null;
    } catch (error) {
      // Inside a page from some other website: the browser refuses the
      // look, and that page is not our app anyway.
      return null;
    }
  },

  /** Tell the app this game's result. `value` is a number (higher is
      better); `text` is optional and is shown in place of the number;
      `notes` is optional, up to two short strings shown after the date
      (the text marks work in them: "**CHEAT**" shows bold).
      Returns the score's place in the app's list, 1 to 5, or 0 when it
      did not make the list (also 0 outside the app). */
  reportScore(value, text, notes) {
    const app = Halloween.findApp();
    if (app) {
      return app.reportScore(value, text, notes);
    }
    console.info("Halloween.reportScore: not inside the app, so the score " +
                 value + " was not saved.");
    return 0;
  },

  /** The app's top saved score for this game, as a number; 0 when there
      is none, or when this page is not inside the app. */
  bestScore() {
    const app = Halloween.findApp();
    return app ? app.bestScore() : 0;
  },
};

/* ------------------------------------------------------------------------
   NO DOUBLE-TAP ZOOM (2026-10-17)

   On the iPhone a quick double (or triple) tap zooms the page, and when
   the tap lands on a game inside the app's frame it is the APP's page
   that zooms: the frame grows past the screen and the app's top bar
   ends up behind the browser's address bar, with no way back but a
   reload (John's phone, 2026-10-16 and 10-17). The viewport line's
   user-scalable=no and touch-action rules did not stop it on Chrome for
   iPhone. What does: the page refusing the second tap's default action.
   A touch that ends within 350 ms of the previous one is the second
   tap of a double tap, and preventDefault on its touchend cancels the
   zoom. It also cancels that tap's click, so a button needs a fresh tap
   after a fast one; a game that acts on pointerdown (Stack o' Lantern)
   never notices. This file is in every game, so every game is covered;
   app.js does the same for taps outside the frame.
   --------------------------------------------------------------------- */

let lastTouchEnd = 0;
document.addEventListener("touchend", (event) => {
  const now = Date.now();
  if (now - lastTouchEnd < 350) event.preventDefault();   // the second tap: no zoom
  lastTouchEnd = now;
}, { passive: false });                                     // passive listeners cannot preventDefault
