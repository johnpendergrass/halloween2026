# Claude — To Be Continued (2026-10-16 12:22)

Third checkpoint of 2026-10-16. Read first: this file, then
`specifications.MD` 6k (the 2026-10-16 entries) and
`specifications-technical.MD` 4k. The game's own record is
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(October 16 section) and `NEXT-TODOS.md`. The 11:33 file holds the sound
story of the morning; the 10:01 file the morning before any code.

## State in one paragraph

**Three small fixes are committed and pushed (stamp `2026-1016-three-fixes`),
checked, and documented in the game's docs.** They follow the "sound fix worked" commit
(8ef661f, stamp `2026-1016-sound-fix-worked`, pushed and live). The iPhone
sound problem stays closed. The fixes: (1) NEXT-TODOS item 13, the
opponent's completed set no longer appears before the flying candy lands;
(2) the pause before the human's NO, GO FISH reply is 0.4 s instead of 1 s;
(3) NEXT-TODOS item 4, the long-deferred startup flash, traced with a
screencast and fixed with two attributes in the game's `index.html`. To
publish them: bump the stamp (suggested `2026-1016-three-fixes`), commit,
push: done at 12:30 at John's word ("commit and push").

## Work done this session (after the 11:33 checkpoint)

1. **Item 13** (`js/candy-go-fish.js`): `render(players = ['human', 'wendy'])`
   takes the list of dishes to redraw. The gift flight passes `['human']`
   when the opponent is taking, so the giver's dish empties at take-off
   (item 7) while the opponent's dish, set count and hand count wait for the
   full redraw on arrival. Throwaway Playwright check (take with and without
   a completed set); verify-piles and verify-browser pass.
2. **Shorter NO, GO FISH pause** (John's ask): `presentSpeech` ignored the
   caller's hold for request bubbles and always used `quoteHoldMs` (1 s);
   `appearance.requestHoldMs` (900) was dead. Now the hold is
   `min(holdMs, quoteHoldMs)`: `requestGiveHoldMs` 1000 when the human has
   the candy (the tap-to-give window), `requestHoldMs` when not, set to 400
   in `game-config.json` (`config-data.js` regenerated with sync-config).
   Measured question fade-in to reply fade-in: 0.69 s, was about 1.25 s.
   The other direction is unchanged (0.25 s after the human's question is
   sent; the question auto-sends after `playerRequestHoldMs` 1 s or at once
   on Ask).
3. **Startup flash** (John: "a quick flash of another popup ... 'welcome to
   go fish candy edition'"). A throwaway script recorded a CDP screencast of
   the shell opening the game, plus a timeline of the iframe's overlay class.
   The flash is the welcome dialog painted plain (title and subtitle run
   together, rules text, green Let's play, no vine frame) from the
   stylesheet's arrival until the script adds the `welcoming` class at the
   very end of its startup, after the 18 scripts and the awaited config
   fetch: about a second on throttled 4G, 0.13 s locally. John confirmed the
   captured frame is what he sees. Fix: `index.html` ships
   `class="overlay welcoming"` and a disabled "Loading assets" button (the
   script still sets both). Re-recorded: the first painted frame is the
   vine-framed welcome. verify-browser, verify-welcome-music, verify-shell
   pass. Prior cover/visibility experiments stay reverted.
4. Docs: NEXT-TODOS items 4 and 13 marked DONE, three bullets in
   CURRENT-STATE's October 16 section, specs 6k/4k entries, this file.

## Immediate ToDo (next session)

1. **John tries the three fixes on the phone** (set on arrival, shorter
   Go Fish pause, no opening flash). Stamp `2026-1016-three-fixes` is live.
2. **Real cold start on the phone**: private tab or cleared site data, on
   cellular. Expect about a second to the welcome, a few seconds to
   Let's play.
3. iPhone review of the 10-15 work: Sound popup v2, framed dialogs, shell
   tab + icon, game-over music in Paused mode.
4. Settings placement (John: revisit later); items 2, 6, 10 (four stale
   checks: go-fish-reply, quotes, speech, speech-redraw).

## Longer-term ToDo

- Shell: per-game switches still change nothing; placeholder slots,
  requirements gaps, contribution workflow, Pages switch-on + iPhone
  home-screen test, icons for the other games. Standalone move (deferred,
  plan on file).
- Game: slow-4G lever (start the tune's download after `ready` settles);
  candies to WebP at the same 500 px (~1.3 MB, optional); human play feel;
  rename of the internal `wendy` role key (John's call); Now Playing pause
  button controlling the music from outside the game (known, accepted).

## Traps worth remembering

- A new stamp is NOT a cold start: only stamped files refresh; images and
  music are cached ten minutes and then revalidated without a download.
- Pages' edge is cold for a minute or two after a deploy.
- This Git Bash's `sed -i` strips CR from CRLF files; use Python edit
  scripts that keep the file's own ending. `file <path>` shows the truth.
- Browser checks need the 8098 server for browser/shell/piles/welcome-music;
  wrap each in `timeout`; restore the PNG screenshots afterwards
  (`git checkout -- ...codex-john-docs/*.png`); skip the stale four.
- `rm` is on the deny list even inside a longer Bash command; the whole
  command is refused. Write new recordings under a new name instead.
- To record first-paint frames: Playwright + CDP `Page.startScreencast`
  with `Network.emulateNetworkConditions`; the throwaway script lives in the
  session scratchpad as `try-opening-flash.cjs` (not in the repo).
