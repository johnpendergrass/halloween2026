const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    for (const mode of ['normal', 'muted', 'reduced']) {
      const page = await browser.newPage({viewport: {width: 338, height: 526}, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference'});
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        window.tickTimes = [];
        window.tickBuffers = 0;
        const createBuffer = AudioContext.prototype.createBuffer;
        AudioContext.prototype.createBuffer = function(...args) {
          if (args[0] === 1 && args[1] === Math.ceil(this.sampleRate * .018)) tickBuffers++;
          return createBuffer.apply(this, args);
        };
        const original = AudioBufferSourceNode.prototype.start;
        AudioBufferSourceNode.prototype.start = function(...args) {
          tickTimes.push(performance.now()); return original.apply(this, args);
        };
      });
      await page.goto('file:///' + path.resolve(__dirname, '../../index.html').replaceAll('\\', '/'));
      assert.equal(await page.evaluate(() => tickBuffers), 1, 'Tick prepared during welcome');
      await page.locator('#dialogAction').click();
      await page.evaluate(() => { window.spinClickedAt = null; document.getElementById('message').addEventListener('click', () => { spinClickedAt = performance.now(); }, {once:true, capture:true}); });
      await page.locator('.opening-action').click();
      if (mode === 'muted') {
        await page.waitForFunction(() => tickTimes.length >= 5);
        await page.evaluate(() => { CandySound.setChannelEnabled('ui', false); window.muteTickCount = tickTimes.length; });
      }
      await page.waitForFunction(() => document.getElementById('message').textContent.includes('goes first'));
      const times = await page.evaluate(() => tickTimes);
      if (mode === 'normal') {
        assert(times[0] - await page.evaluate(() => spinClickedAt) < 150, 'First tick starts with spinner');
        assert.equal(await page.evaluate(() => tickBuffers), 1, 'Preloaded tick reused');
        assert(times.length > 20, 'Expected continuous ticks during rotation');
        const gaps = times.slice(1).map((time, i) => time - times[i]);
        const fastest = Math.min(...gaps);
        assert(gaps[0] > fastest * 1.4, 'Ticks accelerate');
        assert(gaps.slice(-4).some(gap => gap > fastest * 2), 'Ticks slow near landing');
        console.log('Normal spin:', times.length, 'ticks; first/fastest/final gaps', gaps[0].toFixed(0), fastest.toFixed(0), gaps.at(-1).toFixed(0), 'ms');
      } else if (mode === 'muted') assert.equal(times.length, await page.evaluate(() => muteTickCount));
      else assert.equal(times.length, 0);
      // Starting the deal must not generate another click.
      await page.locator('.opening-action').click();
      assert.equal(await page.evaluate(() => tickTimes.length), times.length);
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log('PASS: rotation-linked acceleration/deceleration, UI mute, reduced motion and no deal tick.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
