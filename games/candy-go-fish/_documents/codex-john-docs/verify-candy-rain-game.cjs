const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const startRound = require('./start-round.cjs');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 607 }, reducedMotion: 'no-preference' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('file:///' + path.resolve(__dirname, '../../index.html').replaceAll('\\', '/'));
    await page.locator('#overlay.welcoming').waitFor();
    await page.evaluate(() => {
      const create = CandyEngine.create;
      CandyEngine.create = (...args) => { const state = create(...args); state.finished = true; state.reason = 'emptyPile'; state.winner = 'human'; return state; };
    });
    for (const target of ['#gameOverNew', '#newGame']) {
      await startRound(page, 'human');
      await page.locator('#gameOver').waitFor();
      await page.waitForTimeout(2400);
      assert.equal(await page.locator('.candy-rain').count(), 0);
      await page.locator('.candy-rain img').first().waitFor();
      await page.waitForTimeout(1000);
      const buttonAccessible = await page.locator('#gameOverNew').evaluate(button => {
        const bounds = button.getBoundingClientRect();
        return button.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
      });
      assert(buttonAccessible, 'Rain must not block replay');
      if (target === '#gameOverNew') await page.screenshot({ path: path.join(__dirname, 'candy-rain-game.png') });
      await page.locator(target).click();
      assert(await page.locator('#gameOverNew').isDisabled());
      assert(await page.locator('#gameOver').isVisible(), 'Preserve results during drain');
      assert(await page.locator('.candy-rain img').count() > 0);
      await page.locator('.opening-action').waitFor();
      assert.equal(await page.locator('.candy-rain').count(), 0);
      assert(await page.locator('#gameOver').isHidden());
    }
    // Replay before the rain begins must cancel its delayed start.
    await startRound(page, 'human'); await page.locator('#gameOverNew').click();
    await page.locator('.opening-action').waitFor(); await page.waitForTimeout(3300);
    assert.equal(await page.locator('.candy-rain').count(), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: live delayed rain, accessible results, both replay paths drain, early replay cancels delay.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
