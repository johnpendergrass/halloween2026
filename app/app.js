/* ============================================================================
   Halloween 2026 - app.js

   For now this file does one job: switching between screens ("views").

   HOW IT WORKS
   Every screen is a <section class="view" id="view-NAME"> in index.html.
   Any button with a data-show="NAME" attribute opens the view with that
   name. For example:
       <button data-show="game1">  opens  <section id="view-game1">
       <button data-show="home">   opens  <section id="view-home">

   So adding a new screen later means: add a <section>, add a button with
   the matching data-show. No JavaScript changes needed.
   ========================================================================= */

/**
 * Show one view and hide all the others.
 * @param {string} viewName - e.g. "home" or "game1"
 */
function showView(viewName) {
  const allViews = document.querySelectorAll(".view");

  allViews.forEach((view) => {
    const isTheOneWeWant = view.id === "view-" + viewName;
    view.hidden = !isTheOneWeWant;
  });
}

/**
 * One click listener on the whole shell handles every data-show button,
 * including ones added later. closest() finds the button even when the tap
 * lands on text inside it.
 */
function handleShellClick(event) {
  const button = event.target.closest("[data-show]");
  if (button) {
    showView(button.dataset.show);
  }
}

document.getElementById("appShell").addEventListener("click", handleShellClick);
