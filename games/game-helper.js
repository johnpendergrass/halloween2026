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

   THAT IS ALL THERE IS. reportScore is the helper's only call. A game
   cannot read its own switches in the THIS GAME tab, and the app has no
   sound switch of its own (since 2026-10-15): sound is the game's job.

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
      `notes` is optional, up to two short strings shown after the date. */
  reportScore(value, text, notes) {
    const app = Halloween.findApp();
    if (app) {
      app.reportScore(value, text, notes);
    } else {
      console.info("Halloween.reportScore: not inside the app, so the score " +
                   value + " was not saved.");
    }
  },
};
