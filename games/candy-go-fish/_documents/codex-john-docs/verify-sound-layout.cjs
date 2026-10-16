// UI sounds and speech play from decoded buffers (2026-10-16, Option C of
// claude-john-docs/claudePlans/iphone-speech-buffers-plan.md). This check
// serves the game over http (fetch() is refused over file://) and listens
// for AudioBufferSourceNode starts instead of media elements.
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { serveGame } = require('./serve-game.cjs');
// The twelve sounds decoded at startup: confirm, two set fanfares, three
// character arrows, six "goes first" speeches.
const startupSounds = ['confirmText', 'winsSet-player', 'winsSet-opponent',
  'switch-to-ron-or-boo', 'switch-to-harry-or-mike', 'switch-to-hermione-or-sully',
  ...['ron', 'boo', 'harry', 'mike', 'hermione', 'sully'].map(name => 'goes-first:' + name)];
(async () => {
  const server = await serveGame();
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    // Reduced motion: the spinner does not tick, so every buffer start
    // counted below is a voice (a UI sound or a speech).
    const page = await browser.newPage({ viewport: { width: 338, height: 526 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      Math.random = () => .25;
      window.voiceStarts = 0;
      const start = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function(...args) { voiceStarts++; return start.apply(this, args); };
    });
    await page.goto(server.url + '/index.html');
    await page.evaluate(() => CandyPreload.whenReady());
    assert.deepEqual(await page.evaluate(() => CandyPreload.failures), [], 'Preloaded assets load successfully');
    // Startup decodes the twelve short sounds and none of the victory speeches.
    assert.deepEqual(await page.evaluate(() => CandySound.decodedSounds.sort()), [...startupSounds].sort());
    await page.locator('#overlay.welcoming #dialogAction').click();
    // Each plays at once from its buffer: a voice with a real length at 25% gain (uiVolume);
    // the three character-switch sounds sit a quarter lower (0.1875), the spoken lines higher (0.375).
    const voices = await page.evaluate(keys => keys.map(key => {
      const voice = CandySound.play(key);
      return voice && { sound: voice.sound, duration: voice.duration, gain: voice.gain };
    }), startupSounds);
    for (const [index, voice] of voices.entries()) {
      assert(voice, startupSounds[index] + ' plays');
      assert.equal(voice.sound, startupSounds[index]);
      assert(voice.duration > 0 && voice.duration < 10, startupSounds[index] + ' has a sensible length');
      const key = startupSounds[index];
      assert.equal(voice.gain, key.startsWith('switch-to-') ? .1875 : key.startsWith('goes-first:') ? .375 : .25);
    }
    assert.equal(await page.evaluate(() => voiceStarts), 12);
    assert.equal(await page.evaluate(() => CandySound.play('no-such-sound')), undefined);
    // Every victory speech (36) and the tie decode on demand.
    const victoryLengths = await page.evaluate(async () => {
      const lengths = [];
      for (const key of [...Object.values(CandyVictorySounds).map(file => 'victory:' + file), 'victory:tie']) {
        const buffer = await CandySound.prepareSpeech(key);
        lengths.push(buffer ? buffer.duration : 0);
      }
      return lengths;
    });
    assert.equal(victoryLengths.length, 37);
    for (const length of victoryLengths) assert(length > 0, 'victory speech decodes');
    assert.equal(await page.evaluate(() => CandySound.decodedSounds.length), 49);
    // The spinner lands and the "goes first" speech starts from a timer, not a tap.
    await page.evaluate(() => {
      window.starterCalls = [];
      const original = CandySound.playGoesFirst;
      CandySound.playGoesFirst = function(name) { starterCalls.push(name); return original.call(this, name); };
    });
    const before = await page.evaluate(() => voiceStarts);
    await page.locator('.opening-action').click();
    await page.waitForFunction(() => document.getElementById('message').textContent.includes('goes first'));
    assert.deepEqual(await page.evaluate(() => starterCalls), ['Boo']);
    assert.equal(await page.evaluate(() => voiceStarts), before + 1, 'the goes-first speech played from its buffer');
    await page.locator('.opening-action').click();
    await page.waitForFunction(() => !document.getElementById('message').textContent.includes('click to start'));
    for (const [role, key] of [['human', 'winsSet-player'], ['wendy', 'winsSet-opponent']]) {
      const fanfare = await page.evaluate(role => {
        const voice = CandySound.playSetFanfare(role);
        return { sound: voice.sound, gain: voice.gain };
      }, role);
      assert.equal(fanfare.sound, key);
      assert.equal(fanfare.gain, .25);
    }
    await page.evaluate(() => CandySound.setEnabled(false));
    assert.equal(await page.evaluate(() => CandySound.playSetFanfare('human')), undefined);
    assert.equal(await page.evaluate(() => CandySound.playSetFanfare('wendy')), undefined);
    assert.deepEqual(errors, []);
    console.log('PASS: 12 sounds decode at startup and play from buffers at 25% gain; 37 victory speeches decode on demand; timer-started goes-first speech plays; mute respected.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
