const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const config = require('../assets/json/game-config.json');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [width, height] of [[338, 526], [547, 850]]) {
      await page.setViewportSize({ width, height });
      await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
      await page.locator('#humanSlots .slot').last().waitFor();
      await page.locator('#dialogAction').click();
      const layout = await page.evaluate(() => {
        const targets = [...document.querySelectorAll('#humanSlots .slot, #askButton, #fishButton, #centerCircle, .game-bar button')];
        return { overflow: document.body.scrollHeight > innerHeight || document.body.scrollWidth > innerWidth,
          bad: targets.filter(target => { const rect = target.getBoundingClientRect(); return rect.width < innerWidth * 0.13 - 0.5 || rect.height < innerWidth * 0.13 - 0.5 || rect.bottom > innerHeight || rect.top < 0; }).map(target => target.id),
          images: [...document.images].every(image => image.complete && image.naturalWidth > 0) };
      });
      assert.equal(layout.overflow, false); assert.deepEqual(layout.bad, []);
      await page.locator('#rulesButton').click();
      assert(await page.locator('#dialogTitle').textContent() === 'How to play');
      await page.locator('#dialogAction').click();
      await page.screenshot({ path: path.join(__dirname, 'demo-' + width + '.png') });
    }
    // Accelerate presentation only, preserving the actual move logic.
    const fast = structuredClone(config); fast.appearance.travelMs = 40; fast.appearance.thinkingMs = 40;
    await page.route('**/game-config.json', route => route.fulfill({ json: fast }));
    await page.addInitScript(() => { const original = window.setTimeout; window.setTimeout = (fn, ms, ...args) => original(fn, Math.min(ms, 2), ...args); });
    await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
    await page.locator('#humanSlots .slot').last().waitFor();
    await page.locator('#dialogAction').click();
    let actions = 0;
    while (actions++ < 250) {
      if (await page.locator('#overlay').isVisible()) break;
      if (await page.locator('#fishButton').isEnabled()) await page.locator('#fishButton').click();
      else if (await page.locator('#centerCircle').isEnabled()) await page.locator('#centerCircle').click();
      else if (await page.locator('#humanSlots button:enabled').count()) {
        const slots = page.locator('#humanSlots button:enabled');
        await slots.nth(Math.floor(Math.random() * await slots.count())).click();
        await page.locator('#askButton').click();
      } else await page.waitForTimeout(100);
    }
    assert(await page.locator('#overlay').isVisible(), 'UI game did not finish');
    assert.match(await page.locator('#dialogTitle').textContent(), /win|tie/);
    await page.screenshot({ path: path.join(__dirname, 'demo-finish.png') });
    await page.locator('#dialogAction').click();
    assert.equal(await page.locator('#overlay').isVisible(), false);
    await page.goto('file:///' + path.resolve(__dirname, '../index.html').replaceAll('\\', '/'));
    await page.locator('#humanSlots .slot').last().waitFor();
    await page.locator('#dialogAction').click();
    assert.equal(await page.locator('#humanSlots .slot').count(), 10);
    assert.deepEqual(errors, []);
    console.log('Phone/desktop layout, target sizes, rules, full UI round, replay and file:// passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
