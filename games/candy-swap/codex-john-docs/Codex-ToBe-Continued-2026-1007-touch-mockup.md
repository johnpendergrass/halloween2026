# Candy Swap touch mockup — 2026-10-07

John requested a basic iPhone touch test before designing timer, swap confirmation, and pause controls. The concept reference is in `../design ideas/` (PNG and SVG).

`../touch-preview.html` provides a standalone portrait shell matching the project's 9:16 frame / 9:14 game proportions. `../index.html`, `../candy-swap.css`, and `../candy-swap.js` provide four diagonal regions, placeholder character cards, and 32 colored candies (8 per player). Colors, shapes, and artwork rotations randomize on reload; positions stay fixed for comparison. Each player has four squares and four smaller rectangular pieces, shuffled among its eight positions. Rotation ranges from −30° to +30°.

Candy artwork is now 9vw square or 9vw × 4.5vw rectangular, including vertical pieces. It was reduced so rotated artwork stays inside its upright 13vw × 13vw touch area (approximately 168 × 168 canvas pixels). All touch boxes stay clear of the board borders and diagonal lines and do not overlap each other or the player cards. Tap toggles highlighting; multiple selections are permitted for this test. Preview controls show touch areas and clear selections. Happiness values and preferences are placeholders. There is no swapping, timer, scoring, or running simulation yet.

This mockup is not registered in `games.json`. Its temporary preview controls use same-origin `postMessage`, an explicit departure from shared game rule 21 for testing only. Replace that communication with the supported helper if any such integration is needed in the final game. The preview footer is a test toolbar, not the app drawer.

The existing root `start-local/no-cache-server.py` is reused on port 8097; no duplicate server needed. `../start-touch-test.bat` restarts it. LAN address observed this session: `192.168.0.200`. Phone must be on the same local network; the computer can be wired Ethernet.

Follow-up: John could reach the preview on desktop but had trouble on iPhone. The launcher now follows the root launcher: detects the LAN address with the same UDP routing check, prints explicit computer and iPhone URLs, opens the desktop preview, tries `py -3` then `python`, and explains Private-network access. Address detection returned `192.168.0.200`. The Codex-owned server was stopped so John can launch this batch file without a port conflict. Phone connectivity has not been confirmed; an address alone does not resolve a possible firewall or network-isolation issue.

Verification: JavaScript syntax check and HTTP 200; Chrome phone emulation at 390 × 844 checked tap highlighting, selection count, touch-area toggle, and clearing. Visual review exposed adjacent-region overlaps in initial placement; top/bottom candy positions were adjusted. Real iPhone feel remains for John to assess. No app container code or Claude documentation changed.

John subsequently confirmed phone access works. The revised 32-candy layout passed a Chrome geometry check at 390 × 844: rotated artwork inside its target, targets clear of outer borders and both diagonals, no candy/card or candy/candy target overlaps. Highlight/count and touch-area controls were rechecked. Screenshot updated in this folder.

## Latest revision: separate portrait and preferences

John asked to split the player cards into a full-size character image with an overlaid random 0–10 satisfaction score, and a preferences icon toward the inside of each portrait, about 75% of its size. He then reduced candy count to six per player for this test.

Current state supersedes the counts and card description above: 24 candies total, six per player, with three square and three smaller pieces shuffled per player. Portraits are 20vw square, preferences 15vw square. The top preferences sit below its portrait, bottom preferences above, left preferences to its right, and right preferences to its left. Each shows three compact preference lines at the existing minimum font size. Large emoji remain placeholder character artwork. Scores randomize from 0 through 10 on reload and are not computed from candy.

Side candy placement was adjusted for the paired cards. Chrome verification at 390 × 844, 375 × 667, and 1920 × 1080 passed: 24 candies, four preferences cards, no touch box/card overlap, no preference text overflow, artwork within upright touch boxes, and candy clearance from borders and diagonals. Tap highlighting and the preview selection count passed at each size. Updated phone screenshot is `touch-preview-390.png`.
