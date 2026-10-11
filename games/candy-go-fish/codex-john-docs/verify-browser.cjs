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
        const targets = [...document.querySelectorAll('#humanSlots .slot, #askButton, #fishButton, #centerCircle, .game-bar button')].filter(target => !target.hidden);
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
    fast.appearance.quoteFadeMs = 80; fast.appearance.quoteHoldMs = 40; fast.appearance.requestHoldMs = 40; fast.appearance.requestGiveHoldMs = 40;
    fast.appearance.playerRequestHoldMs = 60000; // Automated manual-click round; real-time auto-send is checked separately.
    fast.players.human.name = 'Casper'; fast.players.wendy.name = 'Hazel';
    await page.route('**/game-config.json', route => route.fulfill({ json: fast }));
    await page.addInitScript(() => { const original = window.setTimeout; window.setTimeout = (fn, ms, ...args) => original(fn, Math.min(ms, 2), ...args); });
    await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
    await page.locator('#humanSlots .slot').last().waitFor();
    assert.equal(await page.locator('.player-portrait .portrait-name').textContent(), 'CASPER');
    assert.equal(await page.locator('.wendy-portrait .portrait-name').textContent(), 'HAZEL');
    await page.locator('#dialogAction').click();
    let actions = 0;
    let celebrations = 0;
    while (actions++ < 750) {
      if (await page.locator('#gameOver').isVisible()) break;
      if (await page.locator('#overlay.celebrating').isVisible()) {
        assert.match(await page.locator('#dialogTitle').textContent(), /won a set!/);
        assert(await page.locator('.celebration-candy').evaluate(img => img.complete && img.naturalWidth > 0));
        if (!celebrations) await page.screenshot({ path: path.join(__dirname, 'demo-celebration.png') });
        if (celebrations++ % 2) await page.locator('#overlay').click({ position: { x: 2, y: 2 } });
        else await page.locator('#dialogAction').click();
      }
      else if (await page.locator('#yesReply:enabled').count()) await page.locator('#yesReply').click();
      else if (await page.locator('#fishButton').isEnabled()) await page.locator('#fishButton').click();
      else if (await page.locator('#centerCircle').isEnabled()) await page.locator('#centerCircle').click();
      else if (await page.locator('.player-portrait.portrait-active').count() && await page.locator('#humanSlots button:enabled').count()) {
        const slots = page.locator('#humanSlots button:enabled');
        await slots.nth(Math.floor(Math.random() * await slots.count())).click();
        await page.locator('#askButton').evaluate(button => { if (!button.disabled) button.click(); });
      } else await page.waitForTimeout(100);
    }
    assert(await page.locator('#gameOver').isVisible(), 'UI game did not finish');
    assert(celebrations > 0, 'No earned-set celebration observed');
    assert.equal(await page.locator('#humanSetCount span').textContent(), 'SETS WON');
    assert.equal(await page.locator('#humanSetCount strong').textContent(), String(await page.locator('#humanSlots .complete').count()));
    assert.equal(await page.locator('#wendySetCount span').textContent(), 'SETS WON');
    assert.equal(await page.locator('#wendySetCount strong').textContent(), String(await page.locator('#wendySlots .complete').count()));
    assert.equal(await page.locator('#overlay').isVisible(), false, 'Finish should leave the board uncovered');
    assert.match(await page.locator('#gameOverTitle').textContent(), /win|tie/);
    assert.match(await page.locator('#gameOverReason').textContent(), /Hazel|Casper|Both players|All ten|Candy Dish/);
    assert.match(await page.locator('#gameOverScore').textContent(), /^Casper had \d+ candy sets?; Hazel had \d+\.$/);
    assert.equal(await page.locator('#gameOverRemaining').isVisible(), /ran out/.test(await page.locator('#gameOverReason').textContent()) && !(await page.locator('#gameOverReason').textContent()).includes('Candy Dish'));
    const clearHands = await page.evaluate(() => {
      const banner = document.getElementById('gameOver').getBoundingClientRect();
      const top = document.getElementById('wendySlots').getBoundingClientRect();
      const bottom = document.getElementById('humanSlots').getBoundingClientRect();
      return banner.top >= top.bottom && banner.bottom <= bottom.top;
    });
    assert(clearHands, 'End banner overlaps a hand');
    assert.equal(await page.locator('#humanSlots').isVisible(), true);
    assert.equal(await page.locator('#wendySlots').isVisible(), true);
    await page.screenshot({ path: path.join(__dirname, 'demo-finish.png') });
    await page.locator('#gameOverNew').click();
    assert.equal(await page.locator('#overlay').isVisible(), false);
    await page.goto('file:///' + path.resolve(__dirname, '../index.html').replaceAll('\\', '/'));
    await page.locator('#humanSlots .slot').last().waitFor();
    await page.locator('#dialogAction').click();
    assert.equal(await page.locator('#humanSlots .slot').count(), 10);
    assert.deepEqual(errors, []);
    console.log('Phone/desktop layout, target sizes, rules, full UI round, replay and file:// passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
