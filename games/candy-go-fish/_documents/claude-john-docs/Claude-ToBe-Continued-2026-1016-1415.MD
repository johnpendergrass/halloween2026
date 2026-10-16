# Candy Go Fish — To Be Continued (2026-10-16 14:15) — RELEASABLE

This is the game's own handoff folder, created 2026-10-16 when John had the
game's Claude docs consolidated here (they were in the root
`claude-john-docs/`, sections 6k and 4k of the specs plus the October 16
handoffs). Read first: this file, then `specifications.MD` and
`specifications-technical.MD` beside it, then the Codex record in
`../codex-john-docs/CURRENT-STATE-2026-1015.md` (October 16 section) and
`NEXT-TODOS.md` (every item closed). The 13:28, 12:22 and 11:33 files here
are the earlier checkpoints of the same day; 11:33 is kept as this folder's
baseline.

## State in one paragraph

**Candy Go Fish is RELEASABLE (John, 2026-10-16 afternoon).** It sits in
slot 8 of the shell, every live check passes, and John closed every open
item in NEXT-TODOS plus the three pending phone reviews (today's changes,
the cellular cold start, the October 15 work). Stamp
`2026-1016-releasable`. Further work on the game is maintenance; the next
project is the shell (John is weighing a single control point: the Home
button opening the sliding game panel, instead of the top buttons plus the
bottom panel).

## Work done since the 13:28 checkpoint

1. **Soundtracks at 96 kbps, art dropped, own folder.** The three tunes
   were ~160 kbps stereo with embedded cover art, 13.1 MB together. Trial
   encodes (128/96/80/64/48 kbps, stereo and mono) were sized and
   described; John chose 96 kbps stereo without the art: 7.5 MB. The
   untouched originals moved (git mv) to `../design ideas/soundtrack
   originals/` with `README - what was done to the game versions.txt`
   (the ffmpeg command; re-encode from the originals only). John made
   `assets/sounds/soundtracks/` and the game copies live there under the
   same names; `sound.js` musicEntry and `verify-assets.cjs` point there;
   `verify-welcome-music` matches by file-name ending and was untouched.
2. **Sound popup.** Volume slider: the browser's tick marks (datalist)
   removed, numbers kept, snapping kept via `step="20"`. When-to-play
   switch: two centred lines per side, a small lowercase lead-in over the
   action word at its old size ("play / Always", "only when / Paused");
   `.mode-when` span, `.mode-switch button` 9.5vw tall.
3. **Todos closed.** NEXT-TODOS: items 2, 3, 6, 8, 10, the continuous-sound
   question, the cellular judgement and the optional candy WebP, each with
   a one-line reason and "CLOSED 2026-10-16 (John)".
4. **Docs consolidated here** (John's idea, 14:30): sections 6k and 4k cut
   from the root specs into this folder's two spec files (stubs left in the
   root pointing here); the three October 16 handoffs and the two game
   plans (`claudePlans/candy-go-fish-standalone-plan.md`,
   `iphone-speech-buffers-plan.md`) moved here; the game folder got its own
   `__STATUS` marker; `_START-HERE.md` one level up gives the reading
   order. Rule from now on: a game's claude-john-docs lives in its own
   `_documents/claude-john-docs/`; the root folder is the shell's.
5. Checks run today after each step: verify-assets, verify-welcome-music,
   verify-sound-layout, verify-piles, verify-browser, verify-shell,
   verify-victory-sounds, verify-spinner-ticks, verify-candy-rain-game.
   verify-shell again after the stamp bump. All green. The four stale
   checks (go-fish-reply, quotes, speech, speech-redraw) are retired.

## ToDo

Nothing open. If the game is touched again: bump the shared stamp (28
places, see `../codex-john-docs/INTEGRATION-AND-VERIFICATION.md`), run the
checks against the 8098 server one at a time, restore the check PNGs, and
write the handoff HERE, not in the root.

Known and accepted: the speech bubble's candy image is rebuilt on every
redraw (harmless); the Rules text keeps its older "If YES / If NO" wording;
the engine's internal opponent role key is still `wendy`; the shell's Now
Playing pause button can stop the music from outside the game.

## Traps worth remembering

- The phone only runs the live site: push before asking for a phone test.
  A new stamp is NOT a cold start; Pages' edge is cold for a minute or two
  after a deploy.
- Edit with Python scripts that keep the file's own line ending; never
  `sed -i` (it strips CR). `rm` anywhere in a Bash command gets the whole
  command refused. A heredoc inside a heredoc trips the Bash tool; write
  scripts with the Write tool and run them.
- Checks need `python start-local/no-cache-server.py --port 8098 --bind
  127.0.0.1`; wrap each in `timeout`; `git checkout --` the PNGs after.
- Re-encode music from `design ideas/soundtrack originals/`, never from
  the 96 kbps game copies.
