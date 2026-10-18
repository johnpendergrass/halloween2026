# Candy Go Fish — To Be Continued (2026-10-18 13:32) — RELEASABLE; the music starts OFF and Always

The game's own handoff folder. Read first: this file, then
`specifications.MD` (the dated section at the end) and
`specifications-technical.MD` beside it, then the 2026-10-16 15:34
handoff for the shell-side tweaks of that day, then the Codex record in
`../codex-john-docs/`. The 2026-10-16 11:33 file is this folder's
baseline and stays (the 13:28 checkpoint of that day was removed by the
three-most-recent rule).

## State in one paragraph

**Releasable, as since 2026-10-16, with one default changed: a fresh
load has MUSIC off and the play mode Always.** John: "the MUSIC setting
is ON/PAUSED. we should have it OFF/ALWAYS as the initial default when
loading the game." In sound.js `channels.music.enabled` is `false` and
`musicMode` is `'continuous'`; `restoreSoundSettings` applies any
boolean `saved.enabled` (it applied only `false` before), so a note
remembered from the Sound popup's OK still wins, including a remembered
"on"; the popup's markup starts unpressed / Always to match. The MUSIC
tap starts the tune at once (John: "that is what i want to happen"):
`applyMusicSettings` enables the channel and calls `startWelcomeMusic`,
three-second fade, whatever the mode; Cancel turns it off again. Stamp
`2026-1018-gofish-music` (shared with the shell, 29 places). Committed
and pushed with this file.

## Work done (2026-10-18 13:40)

1. The defaults, the restore line, the markup, the README's sound
   sentence, a dated section in `specifications.MD`, a paragraph in
   `specifications-technical.MD`, the status marker.
2. Checked headless (`_documents/codex-john-docs/check-gofish-music.cjs`,
   beside the Codex verify scripts; the no-cache server on 8098): with
   storage cleared the popup shows MUSIC off and Always on and nothing
   has played; the MUSIC tap enables the channel and calls `play()` on a
   tune; Cancel turns it off and closes the popup; a saved note (on,
   Paused, Haunted, 0.6) comes back as such after a reload. The tunes are
   `Audio` objects, not in the page, so the check counts
   `HTMLMediaElement.prototype.play` calls. Cancel outside the popup
   throws (`musicBefore` is null); a check must open the popup first.

## Added at 13:55: the remembered note carries the cache stamp

John reloaded from Pages and the music was ON: his phone's note from the
old version won, since storage ignores the cache stamp. "lets fix that
so that the setting for a new version is always at the default", then,
offered a defaults-only number: "whenever the file is changed and redone
on pages, that the defaults go back to what they were. Music
OFF/ALWAYS." So `SCRIPT_STAMP` (line 2 of candy-go-fish.js, read from
the script tag's `?v=` before the async function's first await) is the
note's version: OK writes `{ version: "<stamp>", ...settings }`; a note
whose version differs (the old notes have none) is removed at load and
the defaults stand. Every push bumps the stamp, so every push resets the
sound settings for everyone; a push without a bump would not. The check
gained the stale, written and current-stamp cases. Stamp
`2026-1018-gofish-defaults`.

## ToDo

- John's phone look from Pages at `2026-1018-gofish-music`: the popup's
  first look (slash on MUSIC, Always selected), the MUSIC tap's fade-in,
  and that the welcome is quiet on a fresh load.
- Otherwise maintenance only; NEXT-TODOS is empty; the earlier phone
  items (the 9:15 board, the welcome, a finished game's score line) are
  still unreviewed on the phone.
