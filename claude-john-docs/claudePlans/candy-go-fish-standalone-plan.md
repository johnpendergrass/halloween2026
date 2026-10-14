# Plan: make Candy Go Fish a standalone game and repository

Written 2026-10-14 by Claude, after John asked for a plan. **Nothing in
this file has been done yet.** John wants to decide the open choices when
we pick it up again.

## John's goal (stated 2026-10-14)

- Pull the game out of the halloween2026 scaffold into its own folder,
  `D:\dev\projects\candy-go-fish\`, with its own git repository and its
  own GitHub repository (and therefore its own GitHub Pages site).
- The copy in halloween2026 (slot 8) may stay for now but is deprecated.
  Only the standalone game will be maintained.
- Git history does not need to be preserved. Fresh history, one first
  commit, forward-facing changes only.

## What ties the game to the shell today (verified in the code)

The game is already nearly self-contained: relative `./assets/...` paths,
no build step, a generated config companion so it even opens from a
`file://` URL. Only three things reach outside `games/candy-go-fish/`:

1. **The score helper.** `index.html` loads `../game-helper.js`, and
   `finishGame()` in `js/candy-go-fish.js` calls `Halloween.reportScore`
   once. Standalone there is no app to report to: remove the script tag
   and that one call.
2. **The 9:14 frame.** Every size in the game is in `vw`, which assumes
   the shell's iframe is the whole viewport. `#table` is
   `13vw + 53vw + 36vw + 52vw = 154vw` tall. On a phone in portrait that
   fits. On a PC browser in landscape it is about three times the window
   height and gets clipped (`html, body { overflow: hidden }`). The
   standalone page needs a frame of its own.
3. **Doc and script links.** The docs link to the shared requirements
   document two folders up (`games/README - game design requirements.md`)
   and to root `codex-john-docs/`. `verify-assets.cjs` reads
   `../../games.json`; `verify-shell.cjs` tests the shell menu and iframe.

Other facts that shape the plan:

- Folder size 77 MB: 39 MB is `_documents/design ideas/` (artwork
  sources and alternatives), 9.5 MB is `_documents/codex-john-docs/`
  (mostly screenshots and checkpoint copies), the rest is runtime assets
  (36 victory speeches, three soundtracks of 2 to 6 MB each).
- Check scripts hard-code Playwright under
  `C:/Users/johnp/.cache/codex-runtimes/...` and Chrome under
  `C:/Program Files/Google/Chrome/...`. They keep working on John's PC
  wherever the repo lives.
- The halloween2026 Pages site runs Jekyll (a bad UTF-8 byte once failed
  a build). Jekyll also refuses to serve `_`-prefixed folders. A
  `.nojekyll` file in the new repo avoids both.
- The shell's root `index.html` carries the iPhone home-screen meta tags
  (`apple-mobile-web-app-capable`, status-bar style, `viewport-fit=cover`)
  and a `manifest.json`. The game page has none of these; standalone it
  needs its own copies.
- Local server: `start-local/no-cache-server.py` + a `.bat` on port 8091
  (halloween2026). Codex also used port 8098 for the game alone.

## Decisions John still has to make

1. **How to frame the game on a PC screen.**
   - *Recommended first step:* a thin standalone `index.html` that
     centers a 9:14 stage and loads the untouched game page inside an
     iframe, like the shell does minus the panels. Zero change to game
     code, nothing can regress. The game page would move to
     `game/index.html` (or similar) so the root page is the wrapper.
   - *Alternative, later or never:* one page, with every `vw` converted
     to container units (`cqw`). Cleaner, but touches the stylesheet and
     three script files (`candy-go-fish.js` uses `window.innerWidth` for
     the flight arc; `candy-piles.js` writes `vw` into inline styles).
   - Related: standalone, the game could use the full phone height
     (9:16 or taller) instead of 9:14. That is a redesign of the row
     heights; keep it as a later item, not part of the move.
2. **How much documentation to carry.**
   - *Recommended:* carry the current handoff, TODOs, architecture, rules,
     UI, sound and strategy docs plus the check scripts. Move the
     historical pile (dated handoffs, surveys, checkpoint folders,
     screenshots) and `design ideas/` into `github-excluded/` so they stay
     on the PC but off GitHub.
   - *Alternative:* carry everything as is.
3. **Who creates the GitHub repository.** John in GitHub Desktop, or
   Claude with `gh repo create` once John says go. Claude will not push
   anything without an explicit OK.
4. **Port for the local server** (suggest 8092, to coexist with 8091 and
   8098) and the **repo / Pages name** (suggest `candy-go-fish`, giving
   `https://johnpendergrass.github.io/candy-go-fish/`).

## Proposed steps

1. **Close out halloween2026.** Commit the 2026-10-14 music rename
   (`soundtrack-music-wonderful.mp3`) so both copies start from the same
   code. John decides whether that commit is pushed; a push also needs
   the cache stamps bumped (`APP_VERSION` in `app/app.js`, both `?v=` in
   root `index.html`, all `?v=` in the game's `index.html` and the config
   fetch in `js/candy-go-fish.js`).
2. **Build the new folder** at `D:\dev\projects\candy-go-fish\`:
   - copy `games/candy-go-fish/` contents;
   - add the wrapper `index.html` (9:14 stage, iPhone meta tags,
     `viewport-fit=cover`, theme colour) and a `manifest.json`;
   - add `.nojekyll`, a `.gitignore` (copy halloween2026's: the
     `github-excluded/` rule is the one that matters), and a README;
   - copy `start-local/` with the `.bat` renamed and the port changed;
   - copy `games/README - game design requirements.md` in as a reference
     document, since the game was built against it.
3. **Cut the ties.** Remove the helper script tag and the `reportScore`
   call; delete `verify-shell.cjs`; repoint `verify-assets.cjs` away from
   `games.json` (keep its icon check against the local SVG or drop it);
   fix the doc links that pointed two folders up.
4. **Set up Claude's docs.** Create `claude-john-docs/` with
   `specifications.MD`, `specifications-technical.MD` and a first
   `Claude-ToBe-Continued`, written from the Codex handoffs. Keep the
   Codex docs as history under `_documents/`. Add a `__STATUS` marker at
   the repo root.
5. **Test locally.** Run `validate-candy-names`, `verify-assets`,
   `verify-victory-sounds`, `verify-sound-layout`, `verify-spinner-ticks`,
   `verify-welcome-music`, `verify-browser`, `verify-engine`. Then a
   manual look on the PC in landscape and on the iPhone over Wi-Fi.
6. **Initialize git.** `git init`, one commit.
7. **Publish.** Create the GitHub repo, push, enable Pages from `main`
   root, confirm the live URL on the iPhone from the home screen. Add an
   `apple-touch-icon` (180 x 180 PNG) when there is artwork; the only
   icon today is `assets/halloween-fish.svg`.
8. **Deprecate the old copy.** Note in the halloween2026 README and in the
   game's `games.json` description that the game now lives at the new
   URL. Remove it from slot 8 when John is ready.

## Later, once standalone

- Decide between the three soundtracks (`wonderful` is wired up;
  `haunted` and `earth` sit in `assets/sounds/`).
- Use the full phone height instead of 9:14.
- The physical iPhone audio review Codex left open (loudness, autoplay
  unlock, slow loading). See the game's `NEXT-TODOS.md`.
- Startup flash before the welcome (deferred by John).
