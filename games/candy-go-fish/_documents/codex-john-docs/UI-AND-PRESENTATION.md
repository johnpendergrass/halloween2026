# Current UI and presentation

Updated October 14, 2026. [Current handoff](CURRENT-STATE-2026-1014.md) is authoritative.

The non-scrolling 9:14 board uses the green/blue gradient, ghost main plate, green/red opponent tray/dishes and brown/yellow player dishes/cat tray. Persistent piles track card IDs; survivors keep their arrangement. Human hand is the grid, cat tray shows count. Labels read CANDY SETS; completed-set badges are enlarged. Zero-count art is faint/badges hidden. Portrait selectors preserve round state.

Current-turn glow remains in play. Game-over winner portrait/name gets a larger, brighter gold halo. Ties highlight neither side; replay clears it. Title first, score second, optional remaining-dish line next, ending reason last. Final hands/replay remain visible.

Original full-screen candy rain starts three seconds after results: 60% generic, 40% branded, original sizes/spin/drift. Both New Game actions stop new drops and drain existing ones before replay. Reduced motion is sparse/slower/nonspinning. The opponent-only spill was rejected and removed.

Pumpkin-vine welcome retains dimmed artwork. Loading assets is disabled until centralized preload settles, then Let's play; failure/timeout permits play. Starter spins 3.7 seconds with rotation-linked ticks and goes-first speech at landing. Opening/deal confirmations are silent. Startup flash remains unresolved; do not restore rejected cover/visibility fixes.

Welcome, Deal again? and Rules share corner speaker buttons: UI left (on/off toggle), MUSIC right (shows the state, opens the Music popup; 2026-10-15). Since October 15 they are a speaker photo with the bold label centred below; a red slash across the speaker means off. The welcome also carries the Three / Four candies-per-set slider switch just above Let's play, sits taller, and places its speaker buttons lower, clear of the vines. Targets are at least 13vw, accessible state/labels and dialog focus are maintained. Set dialogs omit them. The Music popup covers the dialog (90vw by 94vh): Music ON/OFF, Soundtrack arrows (Earth, Haunted, Wonderful), Play mode (When paused / Continuous), Volume stops 0-100 by 20, Cancel bottom left, Done bottom right.

Those three dialogs share the chosen looping tune: three-second fade in, two-second fade out when closing while gameplay proceeds (When paused mode) or no fade at all (Continuous mode), pause preserving position, resume on reopening; each tune keeps its own position. Welcome autoplay may require an artwork tap; other dialogs originate from gestures. Music OFF pauses immediately; ON resumes/fades in. UI OFF leaves music playing. Done saves tune, volume, mode and both switches in localStorage (see assets/sounds/README.md).

Speech is centered: cream questions, green YES, coral NO, curved tails and answer breathing. YES waits four active seconds or a middle shortcut; NO waits for a middle draw click. Requested held candy is an immediate gift shortcut. Public transfers/player draws fly actual candy; opponent private draw flies generic art. Flights curve/accelerate over 1400ms, scale 100%-150%-100%, fade near arrival; reduced motion fades. No source bounce/glow.

Set dismissal is user-controlled and precedes final results when needed. Separate player/opponent set MP3s play once. Victory speech starts after two seconds, replayable from banner speaker/repeat icon. Ties/missing clips have no replay control. New Game cancels speech during rain drain.

Choice instruction is a wide tail-free cream popup, hidden on selection. Top controls are ceramic pumpkins with carved NEW GAME/RULES text. Retired preview wrappers are absent; historical art notes preserve alternatives rather than define active files.

See [audio guide](../../assets/sounds/README.md), [next work](NEXT-TODOS.md) and [verification](INTEGRATION-AND-VERIFICATION.md). Physical iPhone review remains manual.
