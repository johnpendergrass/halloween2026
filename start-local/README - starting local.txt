README - starting local            (start-local/, Halloween 2026)
==============================================================

WHAT THIS FOLDER IS FOR

  Running the app on this PC, and looking at it on a phone on the same
  Wi-Fi, BEFORE pushing to GitHub Pages. Nothing in here is used by
  GitHub Pages or by the app itself; it is a convenience for this PC
  only. The two files:

    start-halloween.bat    double-click this one. Starts the server
                           below on port 8091, prints the two addresses
                           (PC and phone) and opens your browser.
    no-cache-server.py     the server: Python's built-in web server
                           with two caching rules added (below).

WHY A SERVER AT ALL

  The app reads games.json with fetch(), and browsers refuse fetch()
  for a page opened straight from the disk (file://). So index.html
  must come from a web server, even on your own PC. If you double-click
  index.html the GAMES tab says exactly this in red.

HOW TO USE IT

  1. Double-click start-halloween.bat. A black window opens and prints:
         Computer: http://localhost:8091/
         iPhone:   http://192.168.x.x:8091/
     and your browser opens the first address a couple of seconds later.
  2. Leave the black window open while you test. Closing it stops the
     server (or press ctrl-C in it).
  3. On the phone: same Wi-Fi as the PC, type the iPhone address into
     Safari or Chrome. If Windows asks about network access the first
     time, allow it on Private networks.
  4. Edit a file, reload the page: you see the new file at once. There
     is no build step.

  Running the server by hand (any working directory, any port):
         python start-local/no-cache-server.py --port 9000
  The bat tries "py -3" first, then "python". If neither is found it
  says so; install Python from python.org.

THE TWO CACHING RULES (why this is not plain "python -m http.server")

  CODE  (html, js, css, json)         -> Cache-Control: no-store.
        Never kept by the browser, so a reload always runs the file you
        just saved. No more "why is my change not showing".
  ART and SOUND (anything under an assets/ folder) -> no-cache.
        Kept, but re-checked on every request: a replaced picture comes
        back fresh, an unchanged one costs no download. (Refusing to
        cache art broke preloading in an earlier project; this is the fix.)

  GitHub Pages does NOT do this. There, phones keep old copies of the
  code, which is why every push bumps the cache stamp (the ?v=... on
  every script and stylesheet tag, APP_VERSION in app/app.js: 29 places).
  See "Publishing a change" in the root README.md.

PORTS

  8091 is John's port, the one the bat uses. Claude's automated checks
  start a second copy of this same server on 8098 so they never disturb
  a browser John has open on 8091; the two can run at the same time.

TROUBLESHOOTING

  "Address already in use"   a server is already running on 8091 (an old
                             black window). Close it, or start another
                             copy on a different port with --port.
  The phone cannot connect   same Wi-Fi? Windows firewall allowed on
                             Private networks? The PC's address changes
                             now and then; the bat prints the current one.
  The page is blank          look at the black window: every request is
                             logged there with its status code (404 =
                             a wrong path, usually a capital letter;
                             GitHub Pages is case-sensitive too).
