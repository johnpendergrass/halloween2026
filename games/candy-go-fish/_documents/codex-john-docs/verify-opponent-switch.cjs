const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const [width, height] of [[338, 526], [547, 850]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => { Math.random = () => .25; });
      await page.goto('file:///' + path.resolve(__dirname, '../../index.html').replaceAll('\\', '/'));
      await page.locator('#overlay.welcoming #dialogAction').click();
      await page.locator('.opening-action').waitFor();
      const name = () => page.locator('.wendy-portrait .portrait-name').textContent();
      assert.equal(await name(), 'RON +');
      async function checkPortrait(filename) {
        const image = page.locator('.wendy-portrait .portrait');
        assert((await image.getAttribute('src')).endsWith(filename));
        await image.evaluate(node => node.decode());
        assert(await image.evaluate(node => node.naturalWidth > 0));
      }
      await checkPortrait('RON.webp');
      for (const expected of ['HARRY ++', 'HERMIONE +++', 'RON +']) { await page.locator('#opponentNext').click(); assert.equal(await name(), expected); }
      await page.locator('#opponentNext').click(); await checkPortrait('HARRY.webp');
      await page.locator('#opponentNext').click(); await checkPortrait('HERMIONE.webp');
      await page.locator('#opponentNext').click(); await checkPortrait('RON.webp');
      await page.locator('#opponentPrevious').click(); assert.equal(await name(), 'HERMIONE +++');
      await page.evaluate(() => {
        const create = CandyEngine.create;
        CandyEngine.create = (...args) => (window.switchTestState = create(...args));
      });
      await require('./start-round.cjs')(page, 'human');
      const state = () => page.evaluate(() => JSON.stringify(switchTestState));
      const before = await state();
      await page.locator('#opponentNext').click(); assert.equal(await name(), 'RON +');
      assert.equal(await state(), before, 'Switch must preserve all engine state');
      await page.locator('#rulesButton').click(); assert(await page.locator('#opponentNext').isDisabled());
      await page.locator('#dialogAction').click(); assert(await page.locator('#opponentNext').isEnabled());
      await page.screenshot({ path: path.join(__dirname, 'opponent-switch-' + width + '.png') });
      await page.locator('#newGame').click(); await page.locator('#dialogAction').click();
      await page.evaluate(() => {
        const create = CandyEngine.create;
        CandyEngine.create = (...args) => { const state = create(...args); state.finished = true; state.reason = 'emptyPile'; state.winner = 'human'; return state; };
      });
      await require('./start-round.cjs')(page, 'human');
      assert(await page.locator('#gameOver').isVisible());
      assert(await page.locator('#opponentNext').isDisabled());
      assert.deepEqual(errors, []); await page.close();
    }
    console.log('Opponent cycling, live state preservation, popup/game-over locks passed at both sizes.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
