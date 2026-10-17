/* Mode-hint check: tap the toggle on the start screen (hint shows), start
   a round (hint hides), tap mid-round (hint shows, then hides itself). */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(300);
    const read = () => page.evaluate(() => ({ hidden: document.getElementById('modeHint').hidden, text: document.getElementById('modeHint').textContent, mode: document.body.dataset.mode }));
    const out = {};
    out.atLoad = await read();
    await page.click('#modeSwitch'); await page.waitForTimeout(250);
    out.afterTap = await read();
    await page.screenshot({ path: path.join(__dirname, 'modehint-start.png') });
    await page.evaluate(() => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await page.waitForTimeout(200);
    out.afterStart = await read();
    await page.click('#modeSwitch'); await page.waitForTimeout(250);
    out.midRoundTap = await read();
    await page.screenshot({ path: path.join(__dirname, 'modehint-mid.png') });
    await page.waitForTimeout(2600);
    out.midRoundLater = await read();
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
