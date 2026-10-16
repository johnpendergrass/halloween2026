SOUNDTRACK ORIGINALS  (moved here 2026-10-16 by Claude, at John's direction)

These three files are the tunes exactly as they came from Soundtrack Loops:
  soundtrack-music-earth.mp3       4:17  44.1 kHz stereo  ~168 kbps  5.1 MB
  soundtrack-music-haunted.mp3     1:54  44.1 kHz stereo  ~161 kbps  2.2 MB
  soundtrack-music-wonderful.mp3   4:41  44.1 kHz stereo  ~162 kbps  5.4 MB
Each one also carries embedded cover art (a PNG, and a JPEG too in Earth)
that the game never shows.

WHAT THE GAME VERSIONS ARE
The copies the game plays, in games/candy-go-fish/assets/sounds/soundtracks/
under the same file names, were re-encoded from these with ffmpeg 8.1.1:
  ffmpeg -i <original> -vn -c:a libmp3lame -b:a 96k -ar 44100 <game copy>
  -vn            drops the embedded cover art
  -b:a 96k       96 kbps constant bitrate (was ~160 to 168)
  -ar 44100      sample rate unchanged, still stereo
Result: 2.9 MB + 1.3 MB + 3.2 MB = 7.5 MB, down from 13.1 MB, for a faster
first download on the phone.

WHAT IT COSTS
At 96 kbps the encoder trims the very top of the sound (above roughly 15 to
16 kHz), so cymbals and shimmer are slightly softer. At the game's playback
levels on a phone or laptop speaker this is very hard to hear. The game
copies are a second generation of MP3 encoding (MP3 from MP3), which costs a
little more; negligible at 96 kbps.

TO REDO IT (for a different bitrate, or if a tune is replaced)
Encode from THESE files, never from the game copies. Keep the file names;
sound.js, the sounds README and the verify-assets check all refer to them
by name only.
