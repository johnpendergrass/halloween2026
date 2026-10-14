# Claude — To Be Continued (2026-10-14 15:26)

First Claude session since 2026-10-01. Between those dates John built
**Candy Go Fish** (slot 8) with the Codex assistant. Codex's notes are the
authoritative record of the game: start with
`codex-john-docs/Codex-ToBe-Continued-2026-1014.md` at the repo root, then
`games/candy-go-fish/_documents/_START-HERE.md` and the game's
`CURRENT-STATE-2026-1014.md` and `NEXT-TODOS.md`. The Claude handoffs from
October 1 describe only the shell and are historical for the game.

## FIRST THING NEXT SESSION: the standalone plan

John wants Candy Go Fish pulled out of halloween2026 into its own folder,
git repo and GitHub repo (`D:\dev\projects\candy-go-fish\`), with the
halloween2026 copy left in place but deprecated. The full plan, the
verified shell dependencies, and the four decisions John still has to make
are in **`claudePlans/candy-go-fish-standalone-plan.md`**. Read it first
and put the decisions to John before building anything.

## Work done this session (2026-10-14)

1. Read all Codex and Claude docs and the game code; summarised the state
   for John.
2. **Soundtrack rename.** John had deleted `game-over-music.mp3` and added
   three candidates. `js/sound.js` now loads
   `soundtrack-music-wonderful.mp3` (byte-identical to the deleted file).
   `verify-assets.cjs`, `verify-welcome-music.cjs`, the game README, the
   sounds README and `CURRENT-STATE-2026-1014.md` were updated to the new
   name. Both checks pass. `haunted` and `earth` are in the folder,
   untracked, not wired up: John will choose later.
3. Wrote the standalone plan (above) and this file; refreshed the
   `__STATUS` marker, which had been untouched since October 1.

4. Added a Candy Go Fish section to `specifications.MD` (6k: decisions
   Claude must respect) and `specifications-technical.MD` (4k: file map,
   phases, audio routing, checks, ties to the shell, publishing rule).
5. **Committed and pushed** at John's request with the cache stamp bumped
   to `2026-1014-soundtrack-rename` (five code places plus the docs that
   quote it). The `haunted` and `earth` soundtrack candidates were left
   untracked on purpose: the asset check rejects unused tracked audio,
   and John has not chosen yet.

## Current state in one paragraph

Shell: unchanged since October 1; Sound switch and game switches still do
nothing and the option A / B question (specifications.MD 6j) was never
decided. Codex sidestepped it: the game owns its audio and shows its own
UI and MUSIC toggles on its dialogs. Game: complete and playable; ten
candies, three opponents with real strategies, three player characters,
full audio (48 clips plus a looping soundtrack), candy rain, victory
speeches. Codex's last commit `7cf177a` (October 14, stamp
`2026-1014-audio-controls`); Claude's commit of this session follows it
with stamp `2026-1014-soundtrack-rename`. Local servers: 8091 (shell
`.bat`) and 8098 (Codex, game alone).

## Immediate ToDo

1. **Execute the standalone plan** (`claudePlans/candy-go-fish-standalone-plan.md`).
   Decisions needed from John: framing approach (wrapper iframe
   recommended), how much documentation to carry, who creates the GitHub
   repo, port and repo name.
2. After the move: deprecate the halloween2026 copy (README note,
   `games.json` description, later remove from slot 8).

## Longer-term ToDo (game, carried from Codex's NEXT-TODOS)

- Choose between the three soundtracks.
- Physical iPhone review: loudness, autoplay unlock, slow loading.
- Human play feel, set/game-over recognition, pile readability.
- Startup flash before the welcome (deferred by John).
- Once standalone: use the full phone height instead of 9:14.

## Longer-term ToDo (shell, from October 1, still open)

- Sound option A or B; connect Sound and the per-game switches.
- Placeholder slots, requirements doc gaps, contribution workflow,
  GitHub Pages switch-on, iPhone home-screen test, icons.
