# GO FISH! — Candy Edition!

Playable Halloween 2026 mini game, shell slot 8. Plain HTML/CSS/JavaScript, no framework or build. HTTP and direct index.html opening work.

Start with [_documents/_START-HERE.md](_documents/_START-HERE.md) and the authoritative [October 15 handoff](_documents/codex-john-docs/CURRENT-STATE-2026-1015.md). Older design/handoff notes are historical where superseded.

Ten candy types, three copies each, five dealt per player without completed opening sets. Successful requests transfer one card and keep the turn. Triples collect automatically; fishing always ends the turn. Empty hand/dish or all sets ends the round after any final-set celebration. Most sets wins. Good Fish is not implemented.

Boo/Mike/Sully are player characters; Ron +, Harry ++ and Hermione +++ use the accepted beginner/medium/expert algorithms. Mid-round switching preserves hands, scores and all observations since the initial deal. Strategies never see hidden player cards or dish order. See [strategy documentation](_documents/strategies-development/_START-HERE.md).

The pumpkin-vine welcome keeps dimmed game art behind it. Loading assets changes to Let's play after preload settles, with bounded failure fallback. Starter spinner lasts 3.7 seconds; soft ticks follow its actual rotation, then the selected character's goes-first speech plays. Opening/deal clicks are silent. YES holds four active seconds or a middle shortcut; NO waits for a draw click. Requested held candy shortcuts an opponent request. Persistent piles and curved candy flights remain.

Separate player/opponent earned-set sounds play with their dialogs. Game-over score is second and ending reason last; winner portrait/name gets a larger gold halo. Original full-screen candy rain is the only celebration, including opponent wins. Replay drains active drops and clears the halo. The rejected opponent-spill experiment is removed.

Audio: UI effects live directly in assets/sounds; speeches are in speech/goes-first and speech/victory (six starters, 36 victory clips). Victory speech has a two-second delay and replay button. UI sounds default to 50% gain. Central preparation lives in js/preload.js; playback/channel control lives in js/sound.js.

Three looping soundtracks (Earth, Haunted, Wonderful; Wonderful by default) accompany welcome, Deal again? and Rules: three-second fade in, two-second fade out on closing, then pause preserving position; each tune keeps its own position for the page session. Welcome autoplay may require a tap on the artwork. One SOUND speaker (upper right) opens the Sound popup: UI sounds and music on/off (green glow when on), soundtrack arrows, when to play (Always or Paused) and a six-stop volume slider, with CANCEL and CONFIRM. CONFIRM remembers the settings in this browser. In Paused mode the soundtrack also comes in a second after the victory speech at game over and plays until New game. The shell Sound switch cannot control this game. See [audio guide](assets/sounds/README.md). Since October 15 the speaker buttons use a speaker photo with the label below and a red slash when off, the welcome offers three or four candies per set (four deals six cards each), and the chosen characters, tune settings and set size are remembered in this browser.

## Preview and configuration

Reuse an existing server, or run from repository root:

    python start-local/no-cache-server.py --port 8098 --bind 127.0.0.1

Open http://127.0.0.1:8098/games/candy-go-fish/index.html or the root shell/slot 8. game-config.json is authoritative; regenerate assets/json/config-data.js using _documents/codex-john-docs/sync-config.cjs after edits. See [configuration](assets/json/README.md) and [verification](_documents/codex-john-docs/INTEGRATION-AND-VERIFICATION.md).

## Requirements and remaining work

The shared [game requirements](../README%20-%20game%20design%20requirements.md) are authoritative. At John's direction there is no dedicated Pause button. Local dialogs pause presentation; the shell drawer does not notify/pause the game. There are no timed penalties. The helper is the only game/shell link.

Startup flash remains unresolved and deferred; preload is not claimed as its fix. Physical iPhone audio/first-render review remains manual. Further sound elements, visual polish and older gameplay proposals are in [NEXT-TODOS](_documents/codex-john-docs/NEXT-TODOS.md).

Current publishing cache stamp: 2026-1016-welcome-scroll.

Demo endings (developer aid): open index.html with ?demo=win, bigwin, loss, bigloss or tie and tap Let's play to see that game-over screen without playing a game.
