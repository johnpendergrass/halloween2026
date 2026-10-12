# Generic candy pile study — October 11, 2026

Open ../pile-preview.html, or http://127.0.0.1:8098/games/candy-go-fish/pile-preview.html using the local server. This separate appearance tool compares locked board snapshots with main/Wendy counts 5/5, 15/15 and 30/20. Middle board can switch to the current 20/5 deal. Production pile layers are hidden to avoid double rendering.

Current defaults match the live pile appearance: main width 78%, Wendy width 45%, main rotation +/-65 degrees, Wendy rotation +/-50 degrees, main X spread 22%/Y spread 20% of dish diameter, saturation 50%, brightness about 100%. Each candy varies size +/-12% and brightness +/-4%, with seven hue choices. Main candy positions use an ellipse, shifted down 0.7vw; the starting pile intentionally overlaps the rim. Controls expose these settings, Try another arrangement and the actual starting count preset.

Preview piles are ordered arrays with stable ID, image, width, rotation, hue, saturation, brightness and center-relative position. Changing controls/reroll explicitly regenerates seeded arrangements. Normal redraws preserve survivors; controls lock during a flight. The transfer button moves the top wrapper to Wendy with a 1400ms curved 100%-150%-100% flight.

The preview transfer still preserves its original size as a historical appearance experiment. Live gameplay is authoritative: candy-piles.js tracks engine card IDs, incoming Wendy cards resize to her tray baseline, successful requests in either direction and player draws fly actual named candy images, and only Wendy's private draw flies a generic wrapper. The human hand remains the named grid; there is no generic human pile.

This tool reads its own same-origin iframes, not a game-to-shell API or helper change. It is not registered as a separate game. Earlier comparison screenshots are developmental snapshots, not guarantees of current slider values. Live phone/desktop images are demo-338.png and demo-547.png after verification.
