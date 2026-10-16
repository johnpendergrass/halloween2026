const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
// Two timers matter here: the speech starts 2 s after game over, and the
// soundtrack follows the speech (John, 2026-10-15). The sandbox keeps the
// latest of each so the test can fire them by hand. Since 2026-10-16 the
// speech is decoded first (prepareSpeech) and played when that promise
// settles, so firing the 2 s timer is followed by a wait for promises.
let pending, musicPending, musicDelay;
const window = { addEventListener() {} };
const sandbox = { window,
  setTimeout(fn, delay) {
    if (delay === 2000) { pending = fn; return 1; }
    musicPending = fn; musicDelay = delay; return 2;
  },
  clearTimeout(id) { if (id === 1) pending = null; if (id === 2) musicPending = null; }
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/sounds/victory-sounds.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/sound.js'), 'utf8'), sandbox);
for (const file of Object.values(window.CandyVictorySounds)) assert(fs.existsSync(path.join(root, 'assets/sounds/speech/victory', file)));
assert(fs.existsSync(path.join(root, 'assets/sounds/speech/tie', 'tie - no one saw that coming.mp3')), 'tie voiceover present');
const sounds = window.CandySound;
const played = [];
const voice = { duration: 3 };
sounds.play = key => { played.push(key); return voice; };
let musicStarts = 0;
sounds.startWelcomeMusic = () => musicStarts++;
// There is no audio engine in this sandbox, so prepareSpeech resolves to
// null at once; the speech timer then plays through the stubbed play().
const settle = () => new Promise(resolve => setImmediate(resolve));
const fireSpeech = async () => { pending(); await settle(); };
(async () => {
  for (const [winner, loser, margin, expected] of [
    ['Harry', 'Mike', 2, 'CLOSE'], ['Harry', 'Mike', 3, 'BIGWIN'],
    ['Mike', 'Ron', 5, 'BIGWIN'], ['Hermione', 'Boo', 1, 'CLOSE']
  ]) {
    sounds.scheduleVictory(winner, loser, margin);
    assert(pending); await fireSpeech();
    assert.equal(played.at(-1), 'victory:' + window.CandyVictorySounds[`${winner.toLowerCase()}|${loser.toLowerCase()}|${expected}`]);
  }
  assert.equal(Object.keys(window.CandyVictorySounds).length, 36);
  sounds.scheduleVictory('Ron', 'Sully', 3); assert(pending);
  sounds.scheduleVictory('Harry', 'Ron', 3); assert.equal(pending, null);
  // A tie (margin 0) plays the single tie voiceover (John, 2026-10-15).
  sounds.scheduleVictory('Harry', 'Mike', 0); assert(pending); await fireSpeech(); assert.equal(played.at(-1), 'victory:tie');
  sounds.scheduleVictory('Harry', 'Mike', 3); sounds.cancelVictory(); assert.equal(pending, null);
  sounds.scheduleVictory('Harry', 'Mike', 3); sounds.setChannelEnabled('ui', false); assert.equal(pending, null);
  sounds.setChannelEnabled('ui', true);
  // A speech cancelled while its decode is still running must not play late:
  // the timer fires, then New game cancels before the promise settles.
  played.length = 0;
  sounds.scheduleVictory('Harry', 'Mike', 3); pending(); sounds.cancelVictory(); await settle();
  assert.deepEqual(played, [], 'cancelled speech stays silent');
  // Replay plays the chosen speech again.
  sounds.scheduleVictory('Harry', 'Mike', 3); sounds.replayVictory(); await settle();
  assert.equal(played.at(-1), 'victory:' + window.CandyVictorySounds['harry|mike|BIGWIN']);

  // Game-over music. Paused mode: the speech plays, a fallback timer is armed for
  // its length plus a second, and the voice's ended event re-arms it to one second.
  sounds.setMusicMode('paused');
  sounds.scheduleVictory('Harry', 'Mike', 3); sounds.scheduleGameOverMusic();
  assert(!musicPending, 'the speech decides when the music starts');
  await fireSpeech();
  assert.equal(musicDelay, 4000); assert(musicPending);
  voice.onended(); assert.equal(musicDelay, 1000);
  musicPending(); assert.equal(musicStarts, 1);
  // Continuous mode: the timer fires but asks for nothing (music already plays).
  sounds.setMusicMode('continuous');
  sounds.scheduleVictory('Harry', 'Mike', 3); await fireSpeech(); voice.onended(); musicPending();
  assert.equal(musicStarts, 1);
  // No speech (no clip for the pairing): music after 3 s in paused mode.
  sounds.setMusicMode('paused');
  sounds.scheduleVictory('Harry', 'Ron', 3); sounds.scheduleGameOverMusic();
  assert.equal(musicDelay, 3000); musicPending(); assert.equal(musicStarts, 2);
  // A speech that could not play (no buffer): music after 4 s.
  sounds.play = () => undefined;
  sounds.scheduleVictory('Harry', 'Mike', 3); await fireSpeech();
  assert.equal(musicDelay, 4000);
  // New game cancels a pending music start.
  sounds.scheduleGameOverMusic(); sounds.cancelVictory(); assert.equal(musicPending, null);
  console.log('Victory catalog, BIGWIN boundary, both winner directions, tie voiceover, missing-clip silence, cancellation during decode, replay and game-over music passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
