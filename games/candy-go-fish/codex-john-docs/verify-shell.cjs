const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8098/');
    const button = page.locator('.game-button[data-folder="candy-go-fish"]');
    await button.waitFor();
    const icon = button.locator('img');
    await icon.evaluate(img => img.decode());
    assert((await icon.getAttribute('src')).includes('halloween-fish.svg'));
    await page.screenshot({ path: path.join(__dirname, 'shell-menu.png') });
    await button.click();
    const frame = page.frameLocator('#gameFrame');
    await frame.locator('#dialogAction').click();
    assert.equal(await frame.locator('#humanSlots .slot').count(), 10);
    assert.equal(await page.locator('#topTitle').textContent(), 'Go Fish');
    await page.screenshot({ path: path.join(__dirname, 'shell-game.png') });
    assert.deepEqual(errors, []);
    console.log('Shell icon, menu selection and embedded game passed at iPhone size.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
