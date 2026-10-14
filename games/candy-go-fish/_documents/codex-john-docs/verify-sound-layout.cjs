const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../..');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 338, height: 526 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => { Math.random = () => .25; });
    await page.goto('file:///' + path.join(root, 'index.html').replaceAll('\\', '/'));
    await page.evaluate(() => CandyPreload.whenReady());
    assert.deepEqual(await page.evaluate(() => CandyPreload.failures), [], 'Preloaded assets load successfully');
    assert.equal(await page.evaluate(() => CandySound.prepareAssets().filter(clip => clip.readyState >= 4).length), 48);
    await page.locator('#overlay.welcoming #dialogAction').click();
    const urls = await page.evaluate(() => {
      const results = [];
      for (const name of ['Ron', 'Boo', 'Harry', 'Mike', 'Hermione', 'Sully']) {
        results.push(CandySound.play('goes-first:' + name.toLowerCase()).clip.src);
      }
      for (const key of ['switch-to-ron-or-boo', 'switch-to-harry-or-mike', 'switch-to-hermione-or-sully', 'confirmText']) {
        results.push(CandySound.play(key).clip.src);
      }
      results.push(CandySound.playSetFanfare('human').clip.src);
      results.push(CandySound.playSetFanfare('wendy').clip.src);
      for (const file of Object.values(CandyVictorySounds)) results.push(CandySound.play('victory:' + file).clip.src);
      return results;
    });
    assert.equal(urls.length, 48);
    for (const url of urls) assert(fs.existsSync(require('node:url').fileURLToPath(url)), url);
    const audioData = urls.map(url => fs.readFileSync(require('node:url').fileURLToPath(url)).toString('base64'));
    await page.evaluate(async recordings => {
      const context = new AudioContext();
      try {
        for (const recording of recordings) {
          const bytes = Uint8Array.from(atob(recording), character => character.charCodeAt(0)).buffer;
          const audio = await context.decodeAudioData(bytes);
          if (!(audio.duration > 0)) throw new Error('Empty audio');
        }
      } finally { await context.close(); }
    }, audioData);
    await page.evaluate(() => {
      window.starterCalls = [];
      const original = CandySound.playGoesFirst;
      CandySound.playGoesFirst = function(name) { starterCalls.push(name); return original.call(this, name); };
    });
    await page.locator('.opening-action').click();
    await page.waitForFunction(() => document.getElementById('message').textContent.includes('goes first'));
    assert.deepEqual(await page.evaluate(() => starterCalls), ['Boo']);
    await page.locator('.opening-action').click();
    await page.waitForFunction(() => !document.getElementById('message').textContent.includes('click to start'));
    for (const [role, filename] of [['human', 'winsSet-player.mp3'], ['wendy', 'winsSet-opponent.mp3']]) {
      const fanfare = await page.evaluate(role => {
        const entry = CandySound.playSetFanfare(role);
        return { url: entry.clip.src, gain: entry.gain.gain.value };
      }, role);
      assert(fanfare.url.endsWith('/assets/sounds/' + filename));
      assert.equal(fanfare.gain, .5);
    }
    await page.evaluate(() => CandySound.setEnabled(false));
    assert.equal(await page.evaluate(() => CandySound.playSetFanfare('human')), undefined);
    assert.equal(await page.evaluate(() => CandySound.playSetFanfare('wendy')), undefined);
    assert.deepEqual(errors, []);
    console.log('PASS: 48 sounds preload and decode; separate player/opponent set clips use 50% gain and respect mute; spinner/deal work over file opening.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
