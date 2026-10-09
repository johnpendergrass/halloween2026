const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const gallery = process.argv.includes('--gallery');
    await page.goto('http://localhost:8097/games/candy-swap/' + (gallery ? 'candy-art-gallery.html' : 'candy-art-preview.html'));
    await page.evaluate(() => [...document.images].forEach(image => { image.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth === 500 && image.naturalHeight === 500));
    const expectedCount = gallery ? JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/gamedata03.json'), 'utf8')).items.length : 4;
    assert.equal(await page.locator('.sample').count(), expectedCount);
    const button = page.locator('.target button').first();
    await button.tap();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    await button.tap();
    assert.equal(await button.getAttribute('aria-pressed'), 'false');
    await page.locator('#rotation').fill('30');
    assert.equal(await page.locator('#angle').textContent(), '30°');
    await page.locator('#fit').check();
    assert.ok(await page.evaluate(() => Number(document.documentElement.style.getPropertyValue('--scale')) < 0.74));
    await page.locator('#dark').uncheck();
    await page.locator('#dark').check();
    assert.ok(await page.locator('body').evaluate(body => body.classList.contains('dark')));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: __dirname + (gallery ? '/candy-gallery-390.png' : '/cutout-preview-390.png'), fullPage: !gallery });
    console.log('PASS: ' + expectedCount + ' cutouts loaded at 500px; touch toggles, rotation, fit, dark background, and phone width checked.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
