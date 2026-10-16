# Claude — To Be Continued (2026-10-16 13:28)

Fourth checkpoint of 2026-10-16. Read first: this file, then
`specifications.MD` 6k (the 2026-10-16 entries, the last four are this
afternoon's) and `specifications-technical.MD` 4k. The game's own record is
`games/candy-go-fish/_documents/codex-john-docs/CURRENT-STATE-2026-1015.md`
(October 16 section, now long) and `NEXT-TODOS.md`. The 12:22 file holds
the three small fixes of midday; the 11:33 file the sound story.

## State in one paragraph

**Candy Go Fish is in slot 8, every live check passes, and this commit
(stamp `2026-1016-welcome-scroll`) carries the afternoon's work:** the
welcome screen's text is the shell's This Game text inside a borderless
scroll box with up/down chevrons; the table buttons read NEW and HELP;
four volume changes (UI 0.25, speech 0.375, character-switch 0.1875,
music a quarter quieter at every slider stop); and the phone-only flicker
of the dish candies is fixed by reusing the candy images across redraws.
Earlier today: iPhone sound closed (Option C decoded buffers), fast start,
512 px WebP portraits, set on arrival (item 13), shorter NO GO FISH pause,
startup flash fixed (item 4). John has not yet tried the afternoon's
changes on the phone.

## Work done this session (after the 12:22 checkpoint)

1. **Welcome text and scroll box** (John's design, several rounds). Body =
   shell text (`games.json` description, `_documents/design ideas/Text for
   THIS GAME.txt`) with the marks rendered as the shell does (orange
   outlined GO FISH!, per-letter rainbow "candy rainfall"), John's line
   breaks ("Pick a candy you hold / to request a matching one. / Get it, or
   else GO FISH!" and "Play as your favorite / non-AI animated 3D
   character!"), no "Good luck!", a two-line credit "v 0.19.2 10/2026" /
   "jp/claude/chatty". First try was a smaller-font static layout; John:
   "that is not working". Now `#dialogScroll` (54vw tall, hidden
   scrollbar, `touch-action: pan-y`) holds title + subtitle + text below
   the SOUND button; `#scrollUp`/`#scrollDown` chevrons on cream fades,
   shown by the script only when there is more above or below, a tap
   scrolls 70% of the box. At the start the title, subtitle and the lines
   through GO FISH! are visible. Switch and Let's play fixed below; clears
   the vines on iPhone 12-15, SE, small Android, iPad. Wrappers are
   `display: contents` outside `.welcoming` so Rules is untouched. Old
   text kept in an HTML comment; John's "Welcome screen - old version.png"
   in design ideas.
2. **NEW and HELP** replace NEW GAME and ?? / SOUND on the table.
3. **Volumes** in `sound.js`: `uiVolume` 0.25 (was a shared 0.5),
   `speechVolume` 0.375 (goes-first and victory keys), the three
   character-switch sounds 0.1875 (overrides), `musicVolume` 0.5 for the
   tune's fade-in (unchanged), music channel scale 1 (was 1/0.75). A
   `gainFor(sound)` helper picks the level. verify-sound-layout asserts
   the three UI levels; the sounds README lists them.
4. **Phone flicker of the dish candies** (John: after a reload, when a
   candy is selected and after it lands; phone only). Cause: every redraw
   recreated every candy `<img>` (slot art, centre plate, whole pile
   layer); phones drop decoded bitmaps and paint a new element blank for a
   frame. Fix: `candy-piles.js` keeps one element per card (`elements`
   map; render restyles, removes leavers, appends in order); `render()`
   keeps the centre plate and updates only its number; a slot's art is
   rebuilt only when its count or completed state changes
   (`slot.dataset.drawn`); candy images get `decoding = 'sync'`. Traced
   with a throwaway script: after the fix the only images made by a
   selection redraw are the speech bubble's candy; every dish and pile
   image is the same element.
5. Checks run after each step: verify-piles, verify-browser, verify-shell,
   verify-welcome-music, verify-sound-layout, verify-victory-sounds,
   verify-spinner-ticks, verify-candy-rain-game; all green.

## Immediate ToDo (next session)

1. **John tries the afternoon on the phone**: the scrolling welcome (drag
   and chevrons), the quieter mix, and whether the dish flicker is gone.
   Volumes are one number each in `sound.js` if they need another nudge.
2. **Real cold start on the phone**: private tab or cleared site data, on
   cellular.
3. iPhone review of the 10-15 work: Sound popup v2, framed dialogs, shell
   tab + icon, game-over music in Paused mode.
4. Settings placement (John: revisit later); items 2, 6, 10 (four stale
   checks: go-fish-reply, quotes, speech, speech-redraw).
5. Small: the speech bubble's candy is still recreated on every redraw
   (harmless, it changes with the selection); the Rules dialog text still
   says "If YES ... If NO match" in the old wording, fine as is.

## Longer-term ToDo

- Shell: per-game switches still change nothing; placeholder slots,
  requirements gaps, contribution workflow, Pages switch-on + iPhone
  home-screen test, icons for the other games. Standalone move (deferred,
  plan on file).
- Game: slow-4G lever (start the tune's download after `ready` settles);
  candies to WebP at the same 500 px (optional); human play feel; rename of
  the internal `wendy` role key (John's call); Now Playing pause button
  controlling the music from outside the game (known, accepted).

## Traps worth remembering

- A new stamp is NOT a cold start; Pages' edge is cold for a minute or two
  after a deploy.
- This Git Bash's `sed -i` strips CR from CRLF files; use Python edit
  scripts that keep the file's own ending. `file <path>` shows the truth.
- `rm` anywhere in a Bash command gets the whole command refused; write new
  outputs under new names instead.
- A long heredoc containing another heredoc can trip the Bash tool
  ("unexpected EOF"); write scripts with the Write tool and run them.
- Browser checks need the 8098 server; wrap each in `timeout`; restore the
  PNG screenshots afterwards; skip the stale four.
- The welcome measurements and screenshots came from throwaway Playwright
  scripts in the session scratchpad (`shot-scroll.cjs`, `measure-se.cjs`,
  `try-image-reuse.cjs`, `try-opening-flash.cjs`); none are in the repo.
