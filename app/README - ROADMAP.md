# Halloween 2026 — ROADMAP of the repository

*Where everything is, what each file does, and what reads it. Written
2026-10-18, the day the collection was declared finished, for John or
anyone who opens this repository cold.*

The whole thing is plain HTML, CSS and JavaScript. There is no build
step, no framework, no server code: GitHub Pages hands the files out
and the browser does the rest. If you can read a web page's source, you
can read all of it.

## The idea in one paragraph

**The app** (also called the shell) is one web page, `index.html`, that
draws a phone-shaped frame with three parts: a top bar, a big game panel
and a bottom panel that slides up. **Each game** is its own small web
page in its own folder under `games/`. The app shows a game by pointing
the game panel's `<iframe>` at that page, exactly as if you had opened
the game's `index.html` on its own. The list of games is a data file,
`games.json`; the app reads it when it starts and makes one button per
game. A game talks back to the app through one small helper file
(reporting a score, asking the best score) and nothing else.

## The map

```text
halloween2026/
│
├── index.html            THE APP'S PAGE. The frame and its three panels, as
│                         HTML with comments. Loads app/styles.css and app/app.js.
├── games.json            THE LIST OF GAMES. One entry per game: folder, slot,
│                         names, icon, description, how to play. The _about
│                         block at its bottom explains every field.
├── manifest.json         Tells Android and desktop browsers the page may be
│                         installed as an "app" (full screen, portrait, colours).
│                         iPhones use the <meta> tags in index.html instead.
├── README.md             The front page: what this is, how to run it, how to
│                         publish a change.
├── __STATUS - ....txt    The one-glance state of the project (see the rule in
│                         John's global notes). Each game folder has one too.
├── .gitignore            github-excluded/ never goes to GitHub; the usual
│                         editor and Python leftovers are ignored too.
│
├── app/                  THE APP'S CODE. Nothing in here knows any game by name.
│   ├── app.js            All the behaviour: panels, tabs, buttons, high scores,
│   │                     switching games, reading games.json. Seven sections.
│   ├── styles.css        All the looks: the 9:16 frame, the panels, the GAMES
│   │                     tab, the THIS GAME tab, per-game looks (5b).
│   ├── default-icon.svg  A little ghost, the fallback picture for a game button.
│   ├── README - ROADMAP.md          this file
│   ├── README - app.js.md           a guided tour of app.js
│   ├── README - styles.css.md       a guided tour of styles.css
│   └── README - default-icon.svg.md
│
├── games/                THE GAMES, one folder each, plus two shared files.
│   ├── README - game design requirements.md   THE RULES a game follows: sizes,
│   │                     text, art, and how a game lives with the app (version 5,
│   │                     final). The only copy; game folders link to it.
│   ├── game-helper.js    THE ONE FILE A GAME INCLUDES to talk to the app:
│   │                     Halloween.reportScore(...) and Halloween.bestScore().
│   │                     Also carries the no-double-tap-zoom guard.
│   ├── README - game-helper.js.md   a guided tour of the helper
│   ├── pumpkin-patch/    slot 1, shown at start. Watch-only: silhouettes rise.
│   │                     index.html, pumpkin-patch.css/.js, assets/, README.
│   ├── stack-o-lantern/  slot 2. A one-tap stacker with 51 milestones, sound,
│   │                     a practice level. index.html, stack-o-lantern.css/.js,
│   │                     sound.js, assets/, README - STACK-O-LANTERN.md,
│   │                     _documents/ (its specs, handoffs, checks, milestones).
│   └── candy-go-fish/    slot 3. GO FISH! - Candy Edition, by John with Codex.
│                         index.html, candy-go-fish.css, js/, assets/, README.md,
│                         _documents/ (_START-HERE.md is its reading order).
│
├── start-local/          A tiny web server for THIS PC (the app needs one; see
│   │                     "README - starting local.txt" in there).
│   ├── start-halloween.bat     double-click to run the app at localhost:8091
│   ├── no-cache-server.py      the server itself
│   └── README - starting local.txt
│
├── claude-john-docs/     THE SHELL'S DESIGN RECORD, written by Claude for John:
│   ├── specifications.MD              every design decision and why (sections 1-6)
│   ├── specifications-technical.MD    how each part is built (sections 1-4)
│   ├── Claude-ToBe-Continued-*.MD     session handoffs; the newest says where
│   │                                  things stand, the 2026-0927 one is the start
│   ├── designing-for-the-frame.MD     plain-language guide to phones vs PCs
│   ├── triageRush-layout-reference.MD where the 9:16 frame came from (history)
│   └── claudePlans/                   plan files from plan-mode sessions
│
└── codex-john-docs/      Codex's three handoffs from building Candy Go Fish
                          (2026-10-07 to 10-14). History; the game's own docs
                          are in games/candy-go-fish/_documents/.
```

Each game's folder is self-contained: its page, its CSS, its JavaScript
and its `assets/` (pictures, sounds). A game loads nothing from outside
its folder except `../game-helper.js`. Delete a game's folder and its
entry in `games.json`, and the app has never heard of it.

## Who reads what (the wiring)

```text
browser opens  index.html
                 ├── <link>   app/styles.css?v=STAMP
                 └── <script> app/app.js?v=STAMP
                                ├── fetch("games.json?v=STAMP")   at start-up
                                ├── builds one button per entry with goes_in_slot 1..3
                                ├── <iframe src="games/<folder_name>/index.html?v=STAMP">
                                │        the game's page, which itself loads
                                │        ../game-helper.js, its own css, js, assets/
                                │        and calls Halloween.reportScore(42) at game over
                                │             └── window.parent.halloweenApp.reportScore(42)
                                │                 (that is app.js, section 4)
                                └── localStorage "halloween2026:<folder_name>"
                                         { scores: [...five best...], settings: [...] }
```

- **The app never reads a game's files.** It only knows the folder name
  and what `games.json` says about it.
- **A game never reads the app.** It knows only the `Halloween` object
  from the helper. (Rule 21 of the requirements forbids `window.parent`
  in a game; the helper is the one place that uses it.)
- **Scores live on the player's device**, in the browser's localStorage,
  one note per game. A web page cannot write to a file on GitHub Pages.
- **STAMP** is the cache stamp, e.g. `2026-1018-cleanup`. See below.

## The cache stamp (the one chore before every push)

Phones keep old copies of code. Every script, stylesheet and JSON file is
loaded with `?v=<stamp>` on its address, and the stamp is changed before
every push so phones fetch fresh files. It appears in **29 places** across
six files:

```text
index.html                                 2  (styles.css, app.js)
app/app.js                                 1  (APP_VERSION; app.js adds it to games.json and every game's page)
games/pumpkin-patch/index.html             1  (the helper)
games/stack-o-lantern/index.html           4  (css, js, sound.js, the helper)
games/candy-go-fish/index.html            20  (its css, its many js files, the helper)
games/candy-go-fish/js/candy-go-fish.js    1  (the config fetch)
                                          29
```

To bump it, search the repository for the old stamp and replace every
one (a "replace in files" in your editor, or
`grep -rn "<old stamp>" --include=*.html --include=*.js --include=*.json`).
Then check the count is still 29. Candy Go Fish reads its own stamp from
its script tag and drops its remembered sound settings whenever the stamp
changes, so every push starts its music OFF / Always on purpose.

## If you want to...

| ...do this | ...go here |
|---|---|
| Run it on this PC | `start-local/start-halloween.bat` (and its README) |
| Change a game's name, icon, description or slot | `games.json` (the `_about` block explains the fields) |
| Change the app's words, colours or layout | `app/styles.css` for looks, `index.html` for structure, `app/app.js` for behaviour (the GAMES tab title is `GAMES_TAB_TITLE` in app.js) |
| Fix a game | that game's folder; its README and `_documents/` first |
| Add a game (if the shell is ever reused) | `games/README - game design requirements.md`, then copy `games/stack-o-lantern/` as the worked example, then add a `games.json` entry |
| Know why something is the way it is | `claude-john-docs/specifications.MD` (shell), or the game's own `_documents/claude-john-docs/` |
| Know what was happening last | the newest `claude-john-docs/Claude-ToBe-Continued-*.MD` |
| Publish | bump the stamp (29 places), commit, push; GitHub Pages serves `main` |

## Reading order for a novice

1. `README.md` at the root (five minutes).
2. `index.html`: it is short and every part has a comment saying what it
   is for. You now know the frame.
3. `games.json`: the data, then its `_about` block.
4. `app/README - app.js.md`, then `app/app.js` section by section. Start
   with section 6 (start-up): it is the story of what happens when the
   page opens.
5. `app/README - styles.css.md`, then `app/styles.css` when a look
   question comes up; it is long, but each rule has a comment.
6. `games/README - game-helper.js.md` and `games/game-helper.js`: the
   whole link between a game and the app is one small object.
7. A game: `games/pumpkin-patch/` is the smallest; `games/stack-o-lantern/`
   is the one that uses everything.
