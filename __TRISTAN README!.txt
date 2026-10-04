Hey, there are complete docs here for how to write a game for the scaffold program.  But they are claude's and he can be wordy sometimes... here it is in a nutshell.... (but read claude's games/README - game design requirements.md for full details)


1. The Halloween 2026 app is in index.html and in the app/folder.  You shouldn't need to touch it much, because it really is just a container that selects games to play in the GAMES panel.  

2. You write a html/js/css game that can run from GitHub Pages.  It goes in one of the games/ slots.  Doesn't matter which.

3. Essentially your game is for a 1296 x 2016 pixel shape.  Those are actual real pixels (ie. so if you design graphic assets, icons, sprites, etc, design with that scale in mind), not CSS pixels.  So think of that as your actual canvas size, as if you were writing a game for a specific device.  It is self contained in that iFrame.  I suppose it *could* be landscape oriented, but the game scaffold is really designed for a portrait orientation.

4. You can communicate with the outside app for high scores, and three 'settings' (ie. Fast/Slow, Easy/Hard, etc... designed to be switches, so choices are limited to two options).

5. The sound is not wired yet, but will be able to be ON/OFF in the This Game panel; how to do that is coming.

6. there is a games.json in the root which configures which game goes in which slot.

7. I have been using cc for most of this, and there is a 'claude-john-docs' folder, which contains specifications, and technical-specifications, but also a 'Claude-ToBe-Continued-2026-10...' file, which you should have your claude read.  That will get claude up to speed, rather than having to guess.

Have fun!

